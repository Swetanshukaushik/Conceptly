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

export default function QuizScreen() {
  const router = useRouter();
  const { id: topicId } = useLocalSearchParams<{ id: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        <AppHeader title="Quiz" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center px-4">
          <AppText className="text-text-muted text-center">Quiz not found</AppText>
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <AppHeader title="Quiz" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center">
          <Loader />
        </View>
      </ScreenContainer>
    );
  }

  if (!quiz) {
    return (
      <ScreenContainer>
        <AppHeader title="Quiz" onBack={() => router.back()} />
        <View className="flex-1 justify-center items-center px-4">
          <AppText className="text-text-muted text-center">Quiz not available</AppText>
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
    setIsSubmitted(true);
    
    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q: typeof quiz.questions[0]) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / totalQuestions) * 100);

    educationApi.trackAnalyticsEvent('quiz_submitted', {
      topicId,
      score,
      totalQuestions,
      correctAnswers: correctCount
    });

    // Update progress
    try {
      await educationApi.updateProgress(topicId, score);
    } catch (err) {
      console.error('Progress update error:', err);
    }
  };

  if (isSubmitted) {
    const correctCount = Object.entries(selectedAnswers).filter(([qId, selectedOptionId]) => {
      const question = quiz.questions.find((q: typeof quiz.questions[0]) => q.id === qId);
      return question && selectedOptionId === question.correctOptionId;
    }).length;

    const score = Math.round((correctCount / totalQuestions) * 100);

    return (
      <ScreenContainer>
        <AppHeader title="Quiz Results" onBack={() => router.back()} />
        <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
          <AppCard className="mb-6 p-6 bg-bg-secondary items-center">
            <AppText className="text-text-primary text-4xl font-bold">{score}%</AppText>
            <AppText className="text-text-muted mt-2">
              {correctCount} of {totalQuestions} correct
            </AppText>
          </AppCard>

          {score >= 70 ? (
            <AppCard className="mb-6 p-4 bg-accent/10 border border-accent">
              <AppText className="text-accent font-semibold">Great job! You passed! 🎉</AppText>
            </AppCard>
          ) : (
            <AppCard className="mb-6 p-4 bg-red-500/10 border border-red-500">
              <AppText className="text-red-500 font-semibold">Keep practicing to improve!</AppText>
            </AppCard>
          )}

          <AppText className="text-text-primary text-lg font-bold mb-3">Review Answers</AppText>
          <FlatList
            scrollEnabled={false}
            data={quiz.questions}
            keyExtractor={(item) => item.id}
            renderItem={({ item: question, index }) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.correctOptionId;

              return (
                <AppCard className="mb-3 p-3">
                  <AppText className="text-text-primary font-semibold text-sm">
                    Question {index + 1}
                  </AppText>
                  <AppText className="text-text-primary mt-2">{question.text}</AppText>
                  <FlatList
                    scrollEnabled={false}
                    data={question.options}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: option }) => {
                      const isSelected = userAnswer === option.id;
                      const isCorrectAnswer = option.id === question.correctOptionId;
                      const showAsCorrect = isCorrectAnswer && isCorrect;
                      const showAsIncorrect = isSelected && !isCorrect;

                      return (
                        <View
                          className={`mt-2 p-3 rounded border ${
                            showAsCorrect
                              ? 'border-accent bg-accent/10'
                              : showAsIncorrect
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-bg-tertiary'
                          }`}
                        >
                          <AppText
                            className={`text-sm ${
                              showAsCorrect
                                ? 'text-accent'
                                : showAsIncorrect
                                  ? 'text-red-500'
                                  : 'text-text-muted'
                            }`}
                          >
                            {option.text}
                            {showAsCorrect && ' ✓'}
                            {showAsIncorrect && ' ✗'}
                          </AppText>
                        </View>
                      );
                    }}
                  />
                </AppCard>
              );
            }}
          />

          <AppButton
            label="Back to Topic"
            variant="primary"
            onPress={() => router.back()}
            className="mb-4 mt-4"
          />
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppHeader title={`Quiz - Question ${currentQuestionIndex + 1}/${totalQuestions}`} onBack={() => router.back()} />
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <AppCard className="mb-4 p-3 bg-bg-secondary">
          <AppText className="text-text-muted text-xs">Progress</AppText>
          <View className="mt-2 w-full bg-bg-tertiary rounded-full overflow-hidden">
            <View
              className="h-2 bg-accent"
              style={{
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
              }}
            />
          </View>
          <AppText className="text-text-muted text-xs mt-2">
            {answeredQuestions} of {totalQuestions} answered
          </AppText>
        </AppCard>

        <AppCard className="mb-6 p-4">
          <AppText className="text-text-primary text-lg font-bold">{currentQuestion.text}</AppText>

          <FlatList
            scrollEnabled={false}
            data={currentQuestion.options}
            keyExtractor={(item) => item.id}
            renderItem={({ item: option }) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              return (
                <AppButton
                  key={option.id}
                  label={option.text}
                  variant={isSelected ? 'primary' : 'secondary'}
                  onPress={() => handleAnswerSelect(option.id)}
                  className="mt-3"
                />
              );
            }}
          />
        </AppCard>

        <View className="flex-row gap-2 mb-4">
          <AppButton
            label="Previous"
            variant="secondary"
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex-1"
          />

          {currentQuestionIndex === totalQuestions - 1 ? (
            <AppButton
              label="Submit"
              variant="primary"
              onPress={handleSubmit}
              className="flex-1"
            />
          ) : (
            <AppButton
              label="Next"
              variant="primary"
              onPress={handleNext}
              className="flex-1"
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
