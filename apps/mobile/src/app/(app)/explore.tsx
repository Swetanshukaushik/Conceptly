import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Icon } from '@/components/ui/Icon';

import { useAppStore } from '@/store/useAppStore';
import { useChaptersBySubjectQuery } from '@/services/api/hooks/useChaptersBySubjectQuery';
import { useTopicsByChapterQuery } from '@/services/api/hooks/useTopicsByChapterQuery';
import { educationApi } from '@/services/api/educationApi';
import { mockTopics, mockSubjectsByExamType, mockSubjectsByClass } from '@/services/api/mockData';

export default function ExploreScreen() {
  const router = useRouter();
  const selectedSubjectId = useAppStore((s) => s.selectedSubjectId) ?? 'tech-sysdesign';
  const selectedExamType = useAppStore((s) => s.selectedExamType) ?? 'TECH_INTERVIEW';
  const setExamType = useAppStore((s) => s.setExamType);
  const setSubjectId = useAppStore((s) => s.setSubjectId);
  const viewMode = useAppStore((s) => s.viewMode);
  const isDesktop = Platform.OS === 'web' && viewMode === 'desktop';
  const language = useAppStore((s) => s.language) ?? 'en';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubjectId, setActiveSubjectId] = useState<string>(selectedSubjectId);
  const [activeChapterId, setActiveChapterId] = useState<string>('');

  // Sync activeSubjectId when selectedSubjectId changes
  useEffect(() => {
    if (selectedSubjectId) {
      setActiveSubjectId(selectedSubjectId);
    }
  }, [selectedSubjectId]);

  // Dynamically query subjects for the current exam track (from live backend or mock)
  const { data: trackSubjects } = useQuery({
    queryKey: ['explore-subjects', selectedExamType],
    queryFn: async () => {
      if (selectedExamType === 'SCHOOL') {
        return educationApi.getSubjectsByClass(10);
      }
      return educationApi.getSubjectsByExamType(selectedExamType);
    },
  });

  // When track subjects update, ensure activeSubjectId belongs to the selected track
  useEffect(() => {
    if (trackSubjects && trackSubjects.length > 0) {
      if (!trackSubjects.some((s) => s.id === activeSubjectId)) {
        setActiveSubjectId(trackSubjects[0].id);
        setSubjectId(trackSubjects[0].id);
      }
    }
  }, [trackSubjects, activeSubjectId, setSubjectId]);

  const { data: chapters, isLoading: chaptersLoading } = useChaptersBySubjectQuery(activeSubjectId);

  // Set first chapter as active when chapters load
  useEffect(() => {
    if (chapters && chapters.length > 0 && (!activeChapterId || !chapters.some((c) => c.id === activeChapterId))) {
      setActiveChapterId(chapters[0].id);
    }
  }, [chapters, activeChapterId]);

  const { data: topics, isLoading: topicsLoading } = useTopicsByChapterQuery(activeChapterId || '');

  useEffect(() => {
    educationApi.trackAnalyticsEvent('explore_opened', {
      subjectId: activeSubjectId,
      chapterId: activeChapterId,
    });
  }, [activeSubjectId, activeChapterId]);

  const availableSubjects = useMemo(() => {
    if (trackSubjects && trackSubjects.length > 0) {
      return trackSubjects.map((s) => ({
        id: s.id,
        name: (s.label as any)?.[language] || (s.label as any)?.en || s.id,
      }));
    }

    const primary =
      selectedExamType === 'SCHOOL'
        ? (mockSubjectsByClass[10] ?? [])
        : (mockSubjectsByExamType[selectedExamType] ?? []);

    return primary.map((s) => ({
      id: s.id,
      name: (s.label as any)?.[language] || (s.label as any)?.en || s.id,
    }));
  }, [trackSubjects, selectedExamType, language]);

  // Search filtering across all topics
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    // Search within current topics first, fallback to mock topics
    const sourceTopics = topics && topics.length > 0 ? topics : mockTopics;
    return sourceTopics.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.difficulty.toLowerCase().includes(q)
    );
  }, [searchQuery, topics]);

  const activeChapter = chapters?.find((c) => c.id === activeChapterId);

  return (
    <ScreenContainer scroll>
      <AppHeader title="Conceptly Explorer" subtitle="Instant search & curriculum index" />

      {/* 🔍 Search Input Bar */}
      <View className="mt-3 mb-3">
        <View className="flex-row items-center bg-slate-100 rounded-2xl px-3.5 py-2.5 border border-slate-200">
          <Icon name="search" size={20} color="#64748B" />
          <TextInput
            placeholder="Search concepts (e.g. CAP Theorem, Sliding Window...)"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2.5 text-slate-900 text-sm font-medium"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} className="p-1">
              <Icon name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* If Search is Active */}
      {searchQuery.trim().length > 0 ? (
        <View className="mt-2 mb-8">
          <SectionHeader
            title={`Search Results (${searchResults.length})`}
            subtitle={`Matches for "${searchQuery}"`}
          />

          {searchResults.length === 0 ? (
            <EmptyState
              title="No concepts found"
              description="Try searching for 'CAP', 'Hashing', 'Window', 'React' or 'Preamble'."
            />
          ) : (
            <View className={isDesktop ? "flex-row flex-wrap gap-4 mt-2" : "gap-3 mt-2"}>
              {searchResults.map((item) => (
                <Pressable
                  key={item.id}
                  style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
                  onPress={() => {
                    educationApi.trackAnalyticsEvent('search_topic_opened', { topicId: item.id });
                    router.push(`/topic/${item.id}`);
                  }}
                >
                  <AppCard tone="default" className="border-slate-200">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1 mr-3">
                        <AppText variant="title" className="text-slate-900 font-bold">
                          {item.title}
                        </AppText>
                        <View className="flex-row items-center gap-2 mt-2">
                          <View className="bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                            <AppText variant="micro" tone="primary" className="capitalize font-semibold">
                              {item.difficulty}
                            </AppText>
                          </View>
                          <AppText variant="micro" tone="muted">
                            {item.reelCount} visual reels
                          </AppText>
                        </View>
                      </View>
                      <View className="bg-indigo-600 p-2.5 rounded-full items-center justify-center">
                        <Icon name="play" size={16} color="#FFFFFF" />
                      </View>
                    </View>
                  </AppCard>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      ) : (
        /* Normal Category / Curriculum Browser */
        <>
          {/* Target Domains horizontal selector */}
          <View className="mb-2.5">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, paddingHorizontal: 4 }}
            >
              {[
                { id: 'TECH_INTERVIEW', label: '💻 Tech' },
                { id: 'PM_INTERVIEW', label: '🚀 PM' },
                { id: 'FINANCE_CONSULTING', label: '📊 Finance' },
                { id: 'UPSC', label: '🏛️ UPSC' },
                { id: 'IIT_JEE', label: '📐 JEE' },
                { id: 'NEET', label: '🩺 NEET' },
                { id: 'SCHOOL', label: '🎒 School' },
              ].map((dm) => {
                const isSelected = selectedExamType === dm.id;
                return (
                  <Chip
                    key={dm.id}
                    label={dm.label}
                    variant={isSelected ? 'selected' : 'soft'}
                    onPress={() => {
                      setExamType(dm.id);
                      const domainSubs =
                        dm.id === 'SCHOOL'
                          ? mockSubjectsByClass[10]
                          : mockSubjectsByExamType[dm.id];
                      if (domainSubs && domainSubs.length > 0) {
                        setActiveSubjectId(domainSubs[0].id);
                        setSubjectId(domainSubs[0].id);
                      }
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>

          {/* Subjects horizontal selector */}
          <View className="mb-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
            >
              {availableSubjects.map((subject) => {
                const isSelected = activeSubjectId === subject.id;
                return (
                  <Chip
                    key={subject.id}
                    label={subject.name}
                    variant={isSelected ? 'selected' : 'default'}
                    onPress={() => {
                      setActiveSubjectId(subject.id);
                      setSubjectId(subject.id);
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>

          {/* Chapters horizontal selector */}
          {chaptersLoading ? (
            <View className="py-8">
              <Loader />
            </View>
          ) : chapters && chapters.length > 0 ? (
            <View className="mt-3 mb-4">
              <SectionHeader title="Chapters / Modules" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingHorizontal: 4, marginTop: 6 }}
              >
                {chapters.map((chap) => {
                  const isSelected = activeChapterId === chap.id;
                  const title = typeof chap.title === 'object' ? (chap.title[language] ?? chap.title.en) : chap.title;
                  return (
                    <Pressable
                      key={chap.id}
                      onPress={() => setActiveChapterId(chap.id)}
                      className={`px-4 py-2.5 rounded-2xl border ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <AppText
                        variant="caption"
                        tone={isSelected ? 'inverse' : 'default'}
                        className="font-semibold"
                      >
                        {title}
                      </AppText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            <View className="mt-4">
              <EmptyState title="No chapters found" description="Select another subject to view modules." />
            </View>
          )}

          {/* Topics List for selected chapter */}
          <View className="mt-2 mb-8">
            <View className="flex-row items-center justify-between mb-3">
              <AppText variant="h3">
                {activeChapter
                  ? (typeof activeChapter.title === 'object'
                      ? (activeChapter.title[language] ?? activeChapter.title.en)
                      : activeChapter.title)
                  : 'Topics'}
              </AppText>
              {topics && (
                <AppText variant="caption" tone="muted">
                  {topics.length} topics
                </AppText>
              )}
            </View>

            {topicsLoading ? (
              <View className="py-8">
                <Loader />
              </View>
            ) : !topics || topics.length === 0 ? (
              <EmptyState
                title="No topics in this module"
                description="Select another chapter above to view visual lessons."
              />
            ) : (
              <View className={isDesktop ? "flex-row flex-wrap gap-4" : "gap-3"}>
                {topics.map((item) => (
                  <Pressable
                    key={item.id}
                    style={isDesktop ? { width: 'calc(50% - 8px)' as any } : undefined}
                    onPress={() => {
                      educationApi.trackAnalyticsEvent('topic_opened', { topicId: item.id });
                      router.push(`/topic/${item.id}`);
                    }}
                  >
                    <AppCard tone="default" className="border-slate-200">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-3">
                          <AppText variant="title" className="text-slate-900 font-bold">
                            {item.title}
                          </AppText>
                          <View className="flex-row items-center gap-2 mt-2">
                            <View className="bg-slate-100 px-2.5 py-0.5 rounded-md">
                              <AppText variant="micro" tone="secondary" className="capitalize">
                                {item.difficulty}
                              </AppText>
                            </View>
                            <AppText variant="micro" tone="muted">
                              {item.reelCount} visual lessons
                            </AppText>
                          </View>
                        </View>
                        <View className="bg-indigo-50 p-2.5 rounded-full items-center justify-center">
                          <Icon name="play" size={18} color="#4F46E5" />
                        </View>
                      </View>
                    </AppCard>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}
