import React, { useEffect, useState } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Loader } from '@/components/ui/Loader';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

import { useQuizByTopicQuery } from '@/services/api/hooks/useQuizByTopicQuery';
import { educationApi } from '@/services/api/educationApi';
import { queryKeys } from '@/services/api/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@/app/providers/ThemeProvider';
import type { QuizSubmissionResultDto } from '@/services/api/types';

export default function QuizScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const { id: topicId } = useLocalSearchParams<{ id: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResultDto | null>(null);

  const { data: quiz, isLoading } = useQuizByTopicQuery(topicId || '');

  useEffect(() => {
    if (quiz) {
      educationApi.trackAnalyticsEvent('quiz_opened', {
        topicId,
        totalQuestions: quiz.questions.length
      });
    }
  }, [topicId, quiz]);

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
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: optionId
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
      queryClient.invalidateQueries({ queryKey: queryKeys.progress() });

      educationApi.trackAnalyticsEvent('quiz_submitted', {
        topicId,
        score: result.scorePercent,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctCount,
      });
    } catch (err) {
      console.error('Quiz submission error:', err);
      // Fallback
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const totalQ = submissionResult?.totalQuestions ?? totalQuestions;
    const correctCount =
      submissionResult?.correctCount ??
      Object.entries(selectedAnswers).filter(([qId, selectedOptionId]) => {
        const question = quiz.questions.find((q) => q.id === qId);
        return question && selectedOptionId === question.correctOptionId;
      }).length;

    const score =
      submissionResult?.scorePercent ?? Math.round((correctCount / Math.max(totalQ, 1)) * 100);

    return (
      <ScreenContainer>
        <AppHeader title="Quiz Results" onBack={() => router.back()} />
        <ScrollView className="flex-1 py-2" showsVerticalScrollIndicator={false}>
          <AppCard tone="default" style={{ marginBottom: 20, padding: 24, alignItems: 'center' }}>
            <AppText variant="hero" tone="primary">{score}%</AppText>
            <AppText variant="body" tone="secondary" style={{ marginTop: 8 }}>
              {correctCount} of {totalQ} questions correct
            </AppText>
          </AppCard>

          {score >= 70 ? (
            <AppCard tone="successSoft" style={{ marginBottom: 24, padding: 16 }}>
              <AppText variant="bodyMedium" tone="success" style={{ fontWeight: '700', textAlign: 'center' }}>
                Outstanding work! You have passed this topic! 🎉
              </AppText>
            </AppCard>
          ) : (
            <AppCard tone="warningSoft" style={{ marginBottom: 24, padding: 16 }}>
              <AppText variant="bodyMedium" tone="warning" style={{ fontWeight: '700', textAlign: 'center' }}>
                Good effort! Watch the video reels again and retry to improve.
              </AppText>
            </AppCard>
          )}

          <AppText variant="h3" style={{ marginBottom: 12, fontWeight: '700' }}>
            Review Answers
          </AppText>

          <FlatList
            scrollEnabled={false}
            data={quiz.questions}
            keyExtractor={(item) => item.id}
            renderItem={({ item: question, index }) => {
              const userAnswer = selectedAnswers[question.id];
              const resultItem = submissionResult?.results.find((r) => r.questionId === question.id);
              const isCorrect = resultItem
                ? resultItem.isCorrect
                : userAnswer === question.correctOptionId;
              const correctOptId = resultItem
                ? resultItem.correctOptionId
                : question.correctOptionId;

              return (
                <AppCard tone="default" style={{ marginBottom: 14, padding: 16 }}>
                  <AppText variant="caption" tone="primary" style={{ fontWeight: '700' }}>
                    Question {index + 1}
                  </AppText>
                  <AppText variant="bodyMedium" style={{ marginTop: 4, fontWeight: '700' }}>
                    {question.text}
                  </AppText>
                  <FlatList
                    scrollEnabled={false}
                    data={question.options}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: option }) => {
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
                          }}
                        >
                          <AppText
                            variant="caption"
                            style={{
                              color: optText,
                              fontWeight: showAsCorrect ? '700' : '500',
                            }}
                          >
                            {option.text} {showAsCorrect && '✓ (Correct)'} {showAsIncorrect && '✗ (Your answer)'}
                          </AppText>
                        </View>
                      );
                    }}
                  />

                  {/* 💡 Concept Insight / Explanation */}
                  {resultItem?.explanation && (
                    <View style={{ marginTop: 12, padding: 12, backgroundColor: colors.primarySoft, borderRadius: 12, borderWidth: 1, borderColor: colors.primaryBorder }}>
                      <AppText variant="micro" tone="primary" style={{ fontWeight: '700' }}>
                        💡 Conceptual Takeaway:
                      </AppText>
                      <AppText variant="caption" tone="secondary" style={{ marginTop: 2, lineHeight: 18 }}>
                        {resultItem.explanation}
                      </AppText>
                    </View>
                  )}
                </AppCard>
              );
            }}
          />

          <View className="my-6">
            <AppButton
              label="Back to Topic"
              variant="primary"
              onPress={() => router.back()}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppHeader
        title={`Quiz (${currentQuestionIndex + 1}/${totalQuestions})`}
        onBack={() => router.back()}
      />
      <ScrollView className="flex-1 py-2" showsVerticalScrollIndicator={false}>
        {/* Progress indicator */}
        <AppCard tone="muted" style={{ marginBottom: 16, padding: 12 }}>
          <View className="flex-row items-center justify-between">
            <AppText variant="micro" tone="muted">Progress</AppText>
            <AppText variant="micro" tone="muted">
              {answeredQuestions} of {totalQuestions} answered
            </AppText>
          </View>
          <View style={{ marginTop: 8, width: '100%', backgroundColor: colors.surfaceSubtle, borderRadius: 999, height: 6, overflow: 'hidden' }}>
            <View
              style={{
                height: '100%',
                backgroundColor: colors.primary,
                borderRadius: 999,
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
              }}
            />
          </View>
        </AppCard>

        {/* Current Question */}
        <AppCard tone="default" style={{ marginBottom: 24, padding: 20 }}>
          <AppText variant="h3" style={{ fontWeight: '700', lineHeight: 26 }}>
            {currentQuestion.text}
          </AppText>

          <View className="mt-4 gap-2.5">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              return (
                <AppButton
                  key={option.id}
                  label={option.text}
                  variant={isSelected ? 'primary' : 'secondary'}
                  onPress={() => handleAnswerSelect(option.id)}
                />
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
                label={isSubmitting ? 'Evaluating...' : 'Submit Quiz'}
                variant="primary"
                onPress={handleSubmit}
                disabled={!selectedAnswers[currentQuestion.id] || isSubmitting}
              />
            ) : (
              <AppButton
                label="Next"
                variant="primary"
                onPress={handleNext}
                disabled={!selectedAnswers[currentQuestion.id]}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
