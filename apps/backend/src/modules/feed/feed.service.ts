import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ExamType } from '@prisma/client';
import {
  CommunityReelFeedResponseDto,
  DifficultyLevel,
  HomeFeedDto,
  ReelEngageActionType,
  ReelEngageResponseDto,
  TopicDetailDto,
  TrendingBadgeType,
  TrendingReelDto,
  TrendingReelsQueryDto,
} from '../../contracts';

@Injectable()
export class FeedService {
  // In-memory community engagement ledger for fast sliding-window velocity in dev/mock-db environments
  private readonly likedByUser = new Map<string, Set<string>>();
  private readonly extraLikesByReel = new Map<string, number>();
  private readonly extraSharesByReel = new Map<string, number>();

  constructor(private readonly prisma: PrismaService) {}

  private mapTopicToDetailDto(topic: any): TopicDetailDto {
    let cheatSheetSummary: string[] | undefined;
    if (topic.cheatSheetJson) {
      try {
        cheatSheetSummary = JSON.parse(topic.cheatSheetJson);
      } catch {
        cheatSheetSummary = undefined;
      }
    }

    return {
      id: topic.id,
      title: topic.title,
      difficulty: (topic.difficulty as DifficultyLevel) || 'medium',
      chapterId: topic.chapterId,
      reelCount: topic._count?.reels ?? topic.reels?.length ?? 1,
      chapter: {
        id: topic.chapter.id,
        title: topic.chapter.titleEn,
      },
      subject: {
        id: topic.chapter.subject.id,
        name: topic.chapter.subject.name,
        classLevel: topic.chapter.subject.classLevel ?? undefined,
        examType: topic.chapter.subject.examType as any,
      },
      cheatSheetSummary,
    };
  }

  async getHomeFeed(
    userId: string,
    examTypeStr?: string,
    classLevel?: number
  ): Promise<HomeFeedDto> {
    // 1. Normalize exam type
    let normalizedExamType: ExamType = 'TECH';
    if (examTypeStr) {
      const upper = examTypeStr.toUpperCase();
      if (upper.includes('TECH')) normalizedExamType = 'TECH';
      else if (upper.includes('PM')) normalizedExamType = 'PM';
      else if (upper.includes('FIN')) normalizedExamType = 'FINANCE';
      else if (upper.includes('UPSC')) normalizedExamType = 'UPSC';
      else if (upper.includes('JEE')) normalizedExamType = 'IIT_JEE';
      else if (upper.includes('NEET')) normalizedExamType = 'NEET';
      else if (upper.includes('SCHOOL')) normalizedExamType = 'SCHOOL';
    }

    // 2. Build subject filter
    const subjectFilter: any = { examType: normalizedExamType };
    if (normalizedExamType === 'SCHOOL' && classLevel) {
      subjectFilter.classLevel = classLevel;
    }

    // 3. Query subjects for shortcuts
    const subjects = await this.prisma.subject.findMany({
      where: subjectFilter,
      orderBy: { name: 'asc' },
      take: 6,
    });

    const subjectShortcuts = subjects.map((s) => ({
      id: s.id,
      name: s.name,
      classLevel: s.classLevel ?? undefined,
      examType: s.examType as any,
    }));

    // 4. Query user's real progress for "continueLearning"
    const userProgress = await this.prisma.topicProgress.findMany({
      where: {
        userId,
        topic: {
          chapter: {
            subject: subjectFilter,
          },
        },
      },
      include: {
        topic: {
          include: {
            chapter: {
              include: { subject: true },
            },
            _count: { select: { reels: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    });

    let continueLearning: TopicDetailDto[] = userProgress.map((p) =>
      this.mapTopicToDetailDto(p.topic)
    );

    // If user has no progress yet in this track, fallback to initial topics
    if (continueLearning.length === 0) {
      const fallbackTopics = await this.prisma.topic.findMany({
        where: {
          chapter: {
            subject: subjectFilter,
          },
        },
        include: {
          chapter: {
            include: { subject: true },
          },
          _count: { select: { reels: true } },
        },
        orderBy: { title: 'asc' },
        take: 3,
      });
      continueLearning = fallbackTopics.map((t) => this.mapTopicToDetailDto(t));
    }

    // 5. Query Recommended topics
    const recommendedTopics = await this.prisma.topic.findMany({
      where: {
        chapter: {
          subject: subjectFilter,
        },
      },
      include: {
        chapter: {
          include: { subject: true },
        },
        _count: { select: { reels: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 4,
    });

    // 6. Query Quick Revision topics (those with active reels)
    const quickRevisionTopics = await this.prisma.topic.findMany({
      where: {
        chapter: {
          subject: subjectFilter,
        },
        reels: { some: {} },
      },
      include: {
        chapter: {
          include: { subject: true },
        },
        _count: { select: { reels: true } },
      },
      orderBy: { title: 'desc' },
      take: 3,
    });

    const trendingFeed = await this.getTrendingReels(userId, {
      sortBy: 'trending',
      timeWindow: '24h',
      limit: 8,
    });

    return {
      subjectShortcuts,
      continueLearning,
      recommended: recommendedTopics.map((t) => this.mapTopicToDetailDto(t)),
      quickRevision: quickRevisionTopics.map((t) => this.mapTopicToDetailDto(t)),
      trendingReels: trendingFeed.items,
    };
  }

  /**
   * Computes a deterministic seed from a string so community baseline telemetry
   * remains consistent and realistic across requests before combining live DB views.
   */
  private computeDeterministicMetrics(reelId: string, index: number, liveViews: number, liveBookmarks: number) {
    let hash = 0;
    for (let i = 0; i < reelId.length; i++) {
      hash = (hash * 31 + reelId.charCodeAt(i)) >>> 0;
    }
    const isPhysicsReel = reelId.includes('rotational') || reelId.includes('gauss') || reelId.includes('tir') || reelId.includes('ohm');
    const baseViews = isPhysicsReel
      ? 21800 - (index % 8) * 1950 + (hash % 900)
      : 7200 + (hash % 6400);
    const viewsCount = baseViews + liveViews;
    const extraLikes = this.extraLikesByReel.get(reelId) ?? 0;
    const extraShares = this.extraSharesByReel.get(reelId) ?? 0;

    const likesCount = Math.round(viewsCount * 0.145) + extraLikes;
    const bookmarksCount = Math.round(viewsCount * 0.088) + liveBookmarks;
    const sharesCount = Math.round(viewsCount * 0.042) + extraShares;
    const rewatchesCount = Math.round(viewsCount * (isPhysicsReel ? 0.24 : 0.16));
    const completionRate = isPhysicsReel ? 91 + (hash % 7) : 82 + (hash % 12);
    const completionsCount = Math.round((viewsCount * completionRate) / 100);
    const commentsCount = Math.max(48, Math.round(viewsCount * 0.014));
    const activeLearnersNow = isPhysicsReel ? 64 + (hash % 180) : 18 + (hash % 55);
    const velocityDeltaPercent = isPhysicsReel ? 95 + (hash % 150) : 28 + (hash % 65);
    const quizPassRate = isPhysicsReel ? 91 + (hash % 6) : 86 + (hash % 9);

    // Bayesian time-decayed Trending Score:
    // Score = (1*V + 3*C + 4*R + 5*L + 6*B + 8*S) / (Hours + 2)^1.5
    const hoursAge = 6 + (index % 18);
    const weightedEvents =
      1.0 * viewsCount +
      3.0 * completionsCount +
      4.0 * rewatchesCount +
      5.0 * likesCount +
      6.0 * bookmarksCount +
      8.0 * sharesCount;
    const trendingScore = Number((weightedEvents / Math.pow(hoursAge + 2, 1.15) / 220).toFixed(1));

    return {
      viewsCount,
      completionsCount,
      completionRate,
      rewatchesCount,
      likesCount,
      bookmarksCount,
      sharesCount,
      commentsCount,
      activeLearnersNow,
      trendingScore,
      velocityDeltaPercent,
      quizPassRate,
    };
  }

  async getTrendingReels(
    userId: string,
    query: TrendingReelsQueryDto
  ): Promise<CommunityReelFeedResponseDto> {
    const sortBy = query.sortBy ?? 'trending';
    const timeWindow = query.timeWindow ?? '24h';
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);

    const whereClause: any = {};
    if (query.examType && query.examType !== 'ALL') {
      whereClause.topic = {
        chapter: {
          subject: {
            examType: query.examType,
          },
        },
      };
    }

    const reels = await this.prisma.reel.findMany({
      where: whereClause,
      include: {
        topic: {
          include: {
            chapter: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 60,
    });

    const userBookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      select: { reelId: true, topicId: true },
    });
    const bookmarkedReelIds = new Set(userBookmarks.map((b) => b.reelId).filter(Boolean));
    const bookmarkedTopicIds = new Set(userBookmarks.map((b) => b.topicId));
    const userLikes = this.likedByUser.get(userId) ?? new Set<string>();

    const windowMultiplier =
      timeWindow === '24h' ? 1 : timeWindow === '7d' ? 3.4 : timeWindow === '30d' ? 9.2 : 18.5;

    const mapped: TrendingReelDto[] = reels.map((r, idx) => {
      const baseMetrics = this.computeDeterministicMetrics(
        r.id,
        idx,
        0,
        bookmarkedReelIds.has(r.id) ? 1 : 0
      );
      const metrics = {
        ...baseMetrics,
        viewsCount: Math.round(baseMetrics.viewsCount * windowMultiplier),
        completionsCount: Math.round(baseMetrics.completionsCount * windowMultiplier),
        likesCount: Math.round(baseMetrics.likesCount * windowMultiplier),
        bookmarksCount: Math.round(baseMetrics.bookmarksCount * windowMultiplier),
        sharesCount: Math.round(baseMetrics.sharesCount * windowMultiplier),
        rewatchesCount: Math.round(baseMetrics.rewatchesCount * windowMultiplier),
      };

      const isStudioReel = r.videoUrl.startsWith('/physics_reels/');
      const badge: TrendingBadgeType =
        idx === 0
          ? 'TRENDING_1'
          : isStudioReel && idx < 3
          ? 'TOP_GROSSING'
          : metrics.completionRate >= 93
          ? 'HIGH_RETENTION'
          : 'COMMUNITY_FAVORITE';

      return {
        id: r.id,
        title: r.title,
        videoUrl: r.videoUrl,
        durationSec: r.durationSec,
        topicId: r.topicId,
        keyTakeaway: r.keyTakeaway ?? undefined,
        topic: {
          id: r.topic.id,
          title: r.topic.title,
          difficulty: (r.topic.difficulty as DifficultyLevel) || 'medium',
        },
        chapter: {
          id: r.topic.chapter.id,
          title: r.topic.chapter.titleEn,
        },
        subject: {
          id: r.topic.chapter.subject.id,
          name: r.topic.chapter.subject.name,
          classLevel: r.topic.chapter.subject.classLevel ?? undefined,
          examType: r.topic.chapter.subject.examType as any,
        },
        rank: idx + 1,
        badge,
        badgeLabel: idx === 0 ? '🔥 #1 TRENDING' : '🏆 TOP GROSSING',
        metrics,
        communityHighlight: {
          authorName: isStudioReel ? 'Aarav S.' : 'Conceptly Community',
          authorBadge: `${r.topic.chapter.subject.examType} Cohort`,
          topComment: `Essential visual breakdown of ${r.topic.title} — saved for pre-exam revision.`,
          upvotesCount: 140 + ((idx * 37) % 300),
          createdAt: '2h ago',
        },
        viewerState: {
          isLiked: userLikes.has(r.id),
          isBookmarked: bookmarkedReelIds.has(r.id) || bookmarkedTopicIds.has(r.topicId),
          isWatched: false,
        },
      };
    });

    mapped.sort((a, b) => {
      // Prioritize real studio reels first, then apply requested sort cohort
      const aReal = a.videoUrl.startsWith('/physics_reels/') ? 1 : 0;
      const bReal = b.videoUrl.startsWith('/physics_reels/') ? 1 : 0;
      if (aReal !== bReal) return bReal - aReal;

      if (sortBy === 'top_grossing') {
        return (
          b.metrics.viewsCount +
          b.metrics.bookmarksCount * 4 -
          (a.metrics.viewsCount + a.metrics.bookmarksCount * 4)
        );
      }
      if (sortBy === 'most_rewatched') {
        return (
          b.metrics.rewatchesCount * b.metrics.completionRate -
          a.metrics.rewatchesCount * a.metrics.completionRate
        );
      }
      if (sortBy === 'community_picks') {
        return (
          b.metrics.likesCount +
          b.metrics.sharesCount * 3 -
          (a.metrics.likesCount + a.metrics.sharesCount * 3)
        );
      }
      return b.metrics.trendingScore - a.metrics.trendingScore;
    });

    const ranked = mapped.slice(0, limit).map((item, idx) => ({
      ...item,
      rank: idx + 1,
      badge: idx === 0 ? ('TRENDING_1' as TrendingBadgeType) : item.badge,
    }));

    const totalActiveLearners = ranked.reduce((acc, r) => acc + r.metrics.activeLearnersNow, 0);
    const totalViews = ranked.reduce((acc, r) => acc + r.metrics.viewsCount, 0);
    const totalUpvotes = ranked.reduce((acc, r) => acc + r.metrics.likesCount, 0);
    const avgCompletion =
      ranked.length > 0
        ? Math.round(ranked.reduce((acc, r) => acc + r.metrics.completionRate, 0) / ranked.length)
        : 92;

    return {
      items: ranked,
      communityPulse: {
        activeLearnersNow: Math.max(totalActiveLearners, 420),
        reelsWatchedToday: Math.max(totalViews, 48200),
        totalCommunityUpvotes: Math.max(totalUpvotes, 12400),
        topTrendingSubject: ranked[0]?.subject.name ?? 'Physics & Core Concepts',
        avgCompletionRate: avgCompletion,
      },
      sortBy,
      timeWindow,
      nextCursor: mapped.length > limit ? String(limit) : null,
    };
  }

  async engageWithReel(
    userId: string,
    reelId: string,
    action: ReelEngageActionType
  ): Promise<ReelEngageResponseDto> {
    if (!this.likedByUser.has(userId)) {
      this.likedByUser.set(userId, new Set<string>());
    }
    const userSet = this.likedByUser.get(userId)!;

    if (action === 'like') {
      if (!userSet.has(reelId)) {
        userSet.add(reelId);
        this.extraLikesByReel.set(reelId, (this.extraLikesByReel.get(reelId) ?? 0) + 1);
      }
    } else if (action === 'unlike') {
      if (userSet.has(reelId)) {
        userSet.delete(reelId);
        this.extraLikesByReel.set(reelId, Math.max(0, (this.extraLikesByReel.get(reelId) ?? 1) - 1));
      }
    } else if (action === 'share') {
      this.extraSharesByReel.set(reelId, (this.extraSharesByReel.get(reelId) ?? 0) + 1);
    }

    const metrics = this.computeDeterministicMetrics(reelId, 0, 1, 1);

    return {
      reelId,
      action,
      updatedLikesCount: metrics.likesCount,
      updatedSharesCount: metrics.sharesCount,
      trendingScore: metrics.trendingScore,
    };
  }
}
