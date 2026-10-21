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
import type { QuizSubmissionResultDto } from '@/services/api/types';

export default function QuizScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
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
          <AppCard className="mb-6 p-6 bg-slate-50 border-slate-200 items-center">
            <AppText className="text-4xl font-extrabold text-indigo-600">{score}%</AppText>
            <AppText variant="body" tone="secondary" className="mt-2">
              {correctCount} of {totalQ} questions correct
            </AppText>
          </AppCard>

          {score >= 70 ? (
            <AppCard tone="successSoft" className="mb-6 p-4 border-green-200">
              <AppText variant="bodyMedium" tone="success" className="font-bold text-center">
                Outstanding work! You have passed this topic! 🎉
              </AppText>
            </AppCard>
          ) : (
            <AppCard className="mb-6 p-4 bg-amber-50 border border-amber-200">
              <AppText variant="bodyMedium" className="text-amber-800 font-semibold text-center">
                Good effort! Watch the video reels again and retry to improve.
              </AppText>
            </AppCard>
          )}

          <AppText variant="h3" className="mb-3">
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
                <AppCard className="mb-3 p-4 border-slate-200" tone="default">
                  <AppText variant="caption" tone="primary" className="font-bold">
                    Question {index + 1}
                  </AppText>
                  <AppText variant="bodyMedium" className="font-semibold text-slate-900 mt-1">
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

                      return (
                        <View
                          className={`mt-2 p-3 rounded-xl border ${
                            showAsCorrect
                              ? 'border-green-500 bg-green-50'
                              : showAsIncorrect
                              ? 'border-red-400 bg-red-50'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <AppText
                            variant="caption"
                            className={`font-medium ${
                              showAsCorrect
                                ? 'text-green-700 font-bold'
                                : showAsIncorrect
                                ? 'text-red-600'
                                : 'text-slate-700'
                            }`}
                          >
                            {option.text} {showAsCorrect && '✓ (Correct)'} {showAsIncorrect && '✗ (Your answer)'}
                          </AppText>
                        </View>
                      );
                    }}
                  />

                  {/* 💡 Concept Insight / Explanation */}
                  {resultItem?.explanation && (
                    <View className="mt-3 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
                      <AppText variant="micro" tone="primary" className="font-bold">
                        💡 Conceptual Takeaway:
                      </AppText>
                      <AppText variant="caption" tone="secondary" className="mt-0.5 text-slate-700 leading-relaxed">
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
        <AppCard className="mb-4 p-3 bg-slate-50 border-slate-200">
          <View className="flex-row items-center justify-between">
            <AppText variant="micro" tone="muted">Progress</AppText>
            <AppText variant="micro" tone="muted">
              {answeredQuestions} of {totalQuestions} answered
            </AppText>
          </View>
          <View className="mt-2 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <View
              className="h-full bg-indigo-600 rounded-full"
              style={{
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
              }}
            />
          </View>
        </AppCard>

        {/* Current Question */}
        <AppCard className="mb-6 p-5 border-slate-200">
          <AppText variant="h3" className="text-slate-900 leading-snug">
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
