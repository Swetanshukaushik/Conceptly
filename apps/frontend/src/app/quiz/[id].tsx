import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, FlatList, Pressable, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { Icon } from '@/components/ui/Icon';
import { CognitiveTelemetryBar } from '@/components/ui/CognitiveTelemetryBar';
import { BionicText } from '@/components/ui/BionicText';

import { useQuizByTopicQuery } from '@/services/api/hooks/useQuizByTopicQuery';
import { educationApi } from '@/services/api/educationApi';
import { queryKeys } from '@/services/api/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useAppStore } from '@/store/useAppStore';
import type { QuizSubmissionResultDto } from '@/services/api/types';

const QUESTION_TIME_LIMIT_SEC = 45;
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function getMarkingScheme(examType: string | null) {
  if (examType === 'UPSC') {
    return {
      label: 'UPSC GS Scheme (+2.0 / -0.66)',
      correctPts: 2.0,
      wrongPenalty: 0.66,
    };
  }
  if (examType === 'IIT_JEE' || examType === 'NEET') {
    return {
      label: `${examType === 'IIT_JEE' ? 'JEE' : 'NEET'} Scheme (+4.0 / -1.0)`,
      correctPts: 4.0,
      wrongPenalty: 1.0,
    };
  }
  return {
    label: 'High-Stakes Scheme (+4.0 / -1.0)',
    correctPts: 4.0,
    wrongPenalty: 1.0,
  };
}

export default function QuizScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const selectedExamType = useAppStore((s) => s.selectedExamType);
  const updateUserProgress = useAppStore((s) => s.updateUserProgress);
  const { id: topicId } = useLocalSearchParams<{ id: string }>();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResultDto | null>(null);

  // High-Stakes Exam Mode state
  const [examMode, setExamMode] = useState<boolean>(true);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(QUESTION_TIME_LIMIT_SEC);
  const [totalElapsedSec, setTotalElapsedSec] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const markingScheme = getMarkingScheme(selectedExamType);
  const { data: quiz, isLoading } = useQuizByTopicQuery(topicId || '');

  useEffect(() => {
    if (quiz) {
      educationApi.trackAnalyticsEvent('quiz_opened', {
        topicId,
        totalQuestions: quiz.questions.length,
      });
    }
  }, [topicId, quiz]);

  // Reset per-question timer when question changes
  useEffect(() => {
    setTimeLeftSec(QUESTION_TIME_LIMIT_SEC);
  }, [currentQuestionIndex, examMode]);

  // Countdown timer in Exam Mode
  useEffect(() => {
    if (isSubmitted || isLoading || !quiz || !examMode) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTotalElapsedSec((prev) => prev + 1);
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          const totalQ = quiz.questions.length;
          if (currentQuestionIndex < totalQ - 1) {
            setCurrentQuestionIndex((idx) => Math.min(totalQ - 1, idx + 1));
          }
          return QUESTION_TIME_LIMIT_SEC;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSubmitted, isLoading, quiz, examMode, currentQuestionIndex]);

  // Web keyboard shortcuts (1-4 or A-D to select option)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || isSubmitted || !quiz) return;
    const currentQ = quiz.questions[currentQuestionIndex];
    if (!currentQ) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toUpperCase();
      const idxMap: Record<string, number> = {
        '1': 0,
        A: 0,
        '2': 1,
        B: 1,
        '3': 2,
        C: 2,
        '4': 3,
        D: 3,
      };
      if (key in idxMap) {
        const opt = currentQ.options[idxMap[key]];
        if (opt) {
          setSelectedAnswers((prev) => ({
            ...prev,
            [currentQ.id]: opt.id,
          }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, isSubmitted, quiz]);

  if (!topicId) {
    return (
      <ScreenContainer>
        <AppHeader title="Practice Quiz" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center px-4">
          <AppText tone="muted">Quiz not found</AppText>
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Practice Quiz" onBack={() => router.back()} />
        <View className="py-20">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <ScreenContainer>
        <AppHeader title="Practice Quiz" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center px-4 py-20">
          <AppText tone="muted" className="text-center">
            No quiz questions currently available for this topic.
          </AppText>
        </View>
      </ScreenContainer>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const answeredQuestions = Object.keys(selectedAnswers).length;

  const handleAnswerSelect = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedAnswers((prev) => {
        // Clicking the same option again deselects it (useful in Negative Marking mode)
        if (prev[currentQuestion.id] === optionId) {
          const copy = { ...prev };
          delete copy[currentQuestion.id];
          return copy;
        }
        return {
          ...prev,
          [currentQuestion.id]: optionId,
        };
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const answersPayload = Object.entries(selectedAnswers).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );

    try {
      const result = await educationApi.submitQuiz(topicId, answersPayload);
      setSubmissionResult(result);
      setIsSubmitted(true);
      updateUserProgress(topicId, Math.max(result.scorePercent, 75));
      queryClient.invalidateQueries({ queryKey: queryKeys.progress() });

      educationApi.trackAnalyticsEvent('quiz_submitted', {
        topicId,
        score: result.scorePercent,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctCount,
        examMode,
      });
    } catch (err) {
      console.error('Quiz submission error:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const totalQ = quiz.questions.length;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    quiz.questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id];
      const resultItem = submissionResult?.results.find((r) => r.questionId === q.id);
      const correctOptId = resultItem ? resultItem.correctOptionId : q.correctOptionId;

      if (!userAnswer) {
        skippedCount += 1;
      } else if (userAnswer === correctOptId) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }
    });

    const accuracyPercent = Math.round((correctCount / Math.max(totalQ, 1)) * 100);
    const maxMarks = Number((totalQ * markingScheme.correctPts).toFixed(2));
    const netMarks = Number(
      (
        correctCount * markingScheme.correctPts -
        (examMode ? wrongCount * markingScheme.wrongPenalty : 0)
      ).toFixed(2)
    );
    const avgSecPerQ = Math.max(1, Math.round(totalElapsedSec / Math.max(totalQ, 1)));

    return (
      <ScreenContainer>
        <AppHeader title="Synaptic Assessment Report" onBack={() => router.back()} />
        <CognitiveTelemetryBar />
        <ScrollView className="flex-1 py-2" showsVerticalScrollIndicator={false}>
          <AppCard
            tone="default"
            style={{
              marginBottom: 16,
              padding: 22,
              borderWidth: 1,
              borderColor: colors.borderSpecular,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <AppText variant="micro" tone="primary" style={{ fontWeight: '800', letterSpacing: 0.6 }}>
                  {examMode ? markingScheme.label.toUpperCase() : 'STANDARD PRACTICE SCORE'}
                </AppText>
                <AppText variant="hero" tone="primary" style={{ marginTop: 4 }}>
                  {accuracyPercent}%
                </AppText>
                <AppText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                  {correctCount} Correct • {wrongCount} Incorrect • {skippedCount} Skipped
                </AppText>
              </View>

              <View
                style={{
                  alignItems: 'flex-end',
                  backgroundColor: colors.surfaceSubtle,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <AppText variant="micro" tone="muted" style={{ fontWeight: '700' }}>
                  NET EXAM MARKS
                </AppText>
                <AppText
                  variant="h2"
                  style={{
                    fontWeight: '800',
                    color: netMarks >= maxMarks * 0.6 ? colors.successText : colors.warningText,
                    marginTop: 2,
                  }}
                >
                  {netMarks} / {maxMarks}
                </AppText>
                <AppText variant="micro" style={{ color: colors.telemetryMono, marginTop: 2 }}>
                  AVG PACE: {avgSecPerQ}s / Q
                </AppText>
              </View>
            </View>
          </AppCard>

          {accuracyPercent >= 70 ? (
            <AppCard tone="successSoft" style={{ marginBottom: 20, padding: 14 }}>
              <AppText variant="bodyMedium" tone="success" style={{ fontWeight: '700', textAlign: 'center' }}>
                Synaptic Checkpoint Verified! High retention confirmed. 🎉
              </AppText>
            </AppCard>
          ) : (
            <AppCard tone="warningSoft" style={{ marginBottom: 20, padding: 14 }}>
              <AppText variant="bodyMedium" tone="warning" style={{ fontWeight: '700', textAlign: 'center' }}>
                Review the conceptual takeaways below and re-run the 45s reels to eliminate traps.
              </AppText>
            </AppCard>
          )}

          <AppText variant="h3" style={{ marginBottom: 12, fontWeight: '700' }}>
            Detailed Answer Diagnostics
          </AppText>

          <FlatList
            scrollEnabled={false}
            data={quiz.questions}
            keyExtractor={(item) => item.id}
            renderItem={({ item: question, index }) => {
              const userAnswer = selectedAnswers[question.id];
              const resultItem = submissionResult?.results.find((r) => r.questionId === question.id);
              const correctOptId = resultItem ? resultItem.correctOptionId : question.correctOptionId;
              const isSkipped = !userAnswer;
              const isCorrect = !isSkipped && userAnswer === correctOptId;

              return (
                <AppCard tone="default" style={{ marginBottom: 14, padding: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AppText variant="caption" tone="primary" style={{ fontWeight: '700' }}>
                      Question {index + 1}
                    </AppText>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                        backgroundColor: isSkipped
                          ? colors.surfaceSubtle
                          : isCorrect
                          ? colors.successSoft
                          : colors.dangerSoft,
                        borderWidth: 1,
                        borderColor: isSkipped
                          ? colors.border
                          : isCorrect
                          ? colors.success
                          : colors.danger,
                      }}
                    >
                      <AppText
                        variant="micro"
                        style={{
                          fontWeight: '800',
                          color: isSkipped
                            ? colors.textMuted
                            : isCorrect
                            ? colors.successText
                            : colors.dangerText,
                        }}
                      >
                        {isSkipped
                          ? '0.0 PTS (SKIPPED)'
                          : isCorrect
                          ? `+${markingScheme.correctPts} PTS`
                          : examMode
                          ? `-${markingScheme.wrongPenalty} PTS (PENALTY)`
                          : '0.0 PTS'}
                      </AppText>
                    </View>
                  </View>

                  <View style={{ marginTop: 6 }}>
                    <BionicText
                      text={question.text}
                      style={{ fontSize: 15, lineHeight: 22, color: colors.textPrimary }}
                    />
                  </View>

                  <FlatList
                    scrollEnabled={false}
                    data={question.options}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: option, index: optIdx }) => {
                      const isSelected = userAnswer === option.id;
                      const isCorrectAnswer = option.id === correctOptId;
                      const showAsCorrect = isCorrectAnswer;
                      const showAsIncorrect = isSelected && !isCorrect;

                      let optBg = colors.surfaceSubtle;
                      let optBorder = colors.border;
                      let optText = colors.textPrimary;

                      if (showAsCorrect) {
                        optBg = colors.successSoft;
                        optBorder = colors.success;
                        optText = colors.successText;
                      } else if (showAsIncorrect) {
                        optBg = colors.dangerSoft;
                        optBorder = colors.danger;
                        optText = colors.dangerText;
                      }

                      return (
                        <View
                          style={{
                            marginTop: 8,
                            padding: 12,
                            borderRadius: 12,
                            borderWidth: 1,
                            backgroundColor: optBg,
                            borderColor: optBorder,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: colors.surface,
                              borderWidth: 1,
                              borderColor: optBorder,
                            }}
                          >
                            <AppText variant="micro" style={{ color: optText, fontWeight: '800' }}>
                              {OPTION_LETTERS[optIdx] ?? optIdx + 1}
                            </AppText>
                          </View>
                          <View style={{ flex: 1 }}>
                            <AppText
                              variant="caption"
                              style={{
                                color: optText,
                                fontWeight: showAsCorrect ? '700' : '500',
                              }}
                            >
                              {option.text} {showAsCorrect && '✓ (Correct)'}{' '}
                              {showAsIncorrect && '✗ (Your answer)'}
                            </AppText>
                          </View>
                        </View>
                      );
                    }}
                  />

                  {/* 💡 Concept Insight / Explanation */}
                  {(resultItem?.explanation || (question as any).explanation) && (
                    <View
                      style={{
                        marginTop: 12,
                        padding: 12,
                        backgroundColor: colors.primarySoft,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.primaryBorder,
                      }}
                    >
                      <AppText variant="micro" tone="primary" style={{ fontWeight: '700', marginBottom: 4 }}>
                        💡 Conceptual Takeaway:
                      </AppText>
                      <BionicText
                        text={resultItem?.explanation || (question as any).explanation}
                        style={{ fontSize: 13, lineHeight: 19, color: colors.textSecondary }}
                      />
                    </View>
                  )}
                </AppCard>
              );
            }}
          />

          <View className="my-6 flex-row gap-3">
            <View className="flex-1">
              <AppButton
                label="Retry Quiz"
                variant="secondary"
                onPress={() => {
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setIsSubmitted(false);
                  setSubmissionResult(null);
                  setTotalElapsedSec(0);
                  setTimeLeftSec(QUESTION_TIME_LIMIT_SEC);
                }}
              />
            </View>
            <View className="flex-1">
              <AppButton
                label="Back to Topic"
                variant="primary"
                onPress={() => router.back()}
              />
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const isLowTime = examMode && timeLeftSec <= 10;

  return (
    <ScreenContainer>
      <AppHeader
        title={`Quiz Checkpoint (${currentQuestionIndex + 1}/${totalQuestions})`}
        onBack={() => router.back()}
      />

      <CognitiveTelemetryBar />

      <ScrollView className="flex-1 py-2" showsVerticalScrollIndicator={false}>
        {/* High-Stakes Exam Mode Control & Timer HUD */}
        <AppCard tone="muted" style={{ marginBottom: 14, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <Pressable
              onPress={() => setExamMode((prev) => !prev)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                borderWidth: 1,
                backgroundColor: examMode ? colors.warningSoft : colors.surfaceSubtle,
                borderColor: examMode ? colors.warning : colors.border,
              }}
            >
              <Icon
                name="flash"
                size={12}
                color={examMode ? colors.warningText : colors.textMuted}
              />
              <AppText
                variant="micro"
                style={{
                  fontWeight: '800',
                  color: examMode ? colors.warningText : colors.textSecondary,
                }}
              >
                {examMode ? `HIGH-STAKES: ${markingScheme.label}` : 'STANDARD PRACTICE (UNTIMED)'}
              </AppText>
            </Pressable>

            {examMode ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: isLowTime ? colors.dangerSoft : colors.surface,
                  borderWidth: 1,
                  borderColor: isLowTime ? colors.danger : colors.border,
                }}
              >
                <Icon
                  name="time-outline"
                  size={13}
                  color={isLowTime ? colors.dangerText : colors.telemetryMono}
                />
                <AppText
                  variant="micro"
                  style={{
                    fontWeight: '800',
                    color: isLowTime ? colors.dangerText : colors.telemetryMono,
                  }}
                >
                  00:{String(timeLeftSec).padStart(2, '0')}s
                </AppText>
              </View>
            ) : (
              <AppText variant="micro" tone="muted">
                {answeredQuestions}/{totalQuestions} answered
              </AppText>
            )}
          </View>

          {/* Dual Progress Bar: Question Progress + Time Remaining */}
          <View
            style={{
              marginTop: 10,
              width: '100%',
              backgroundColor: colors.surfaceSubtle,
              borderRadius: 999,
              height: 6,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                backgroundColor: colors.primary,
                borderRadius: 999,
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </View>
        </AppCard>

        {/* Current Question Card */}
        <AppCard
          tone="default"
          style={{
            marginBottom: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.borderSpecular,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <AppText variant="micro" tone="primary" style={{ fontWeight: '800', letterSpacing: 0.6 }}>
              QUESTION {currentQuestionIndex + 1} OF {totalQuestions}
            </AppText>
            {examMode && (
              <AppText variant="micro" tone="muted">
                +{markingScheme.correctPts} Correct • -{markingScheme.wrongPenalty} Wrong • 0 Skip
              </AppText>
            )}
          </View>

          <BionicText
            text={currentQuestion.text}
            style={{ fontSize: 18, lineHeight: 26, color: colors.textPrimary }}
          />

          <View className="mt-5 gap-3">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              const letter = OPTION_LETTERS[optIdx] ?? String(optIdx + 1);
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleAnswerSelect(option.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    backgroundColor: isSelected ? colors.primarySoft : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                    }}
                  >
                    <AppText
                      variant="caption"
                      style={{
                        fontWeight: '800',
                        color: isSelected ? colors.textInverse : colors.textSecondary,
                      }}
                    >
                      {letter}
                    </AppText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <BionicText
                      text={option.text}
                      style={{
                        fontSize: 14,
                        lineHeight: 20,
                        color: isSelected ? colors.primaryText : colors.textPrimary,
                      }}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </AppCard>

        <View className="flex-row gap-3 mb-8">
          <View className="flex-1">
            <AppButton
              label="Previous"
              variant="secondary"
              onPress={handlePrevious}
              disabled={currentQuestionIndex === 0}
            />
          </View>

          <View className="flex-1">
            {currentQuestionIndex === totalQuestions - 1 ? (
              <AppButton
                label={isSubmitting ? 'Evaluating...' : 'Submit Assessment'}
                variant="primary"
                onPress={handleSubmit}
                disabled={isSubmitting}
              />
            ) : (
              <AppButton
                label={selectedAnswers[currentQuestion.id] ? 'Next Question' : 'Skip (0 pts) →'}
                variant={selectedAnswers[currentQuestion.id] ? 'primary' : 'secondary'}
                onPress={handleNext}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
