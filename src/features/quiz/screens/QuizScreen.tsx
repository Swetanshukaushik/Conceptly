import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

import { analytics } from '@/services/analytics/analytics';
import { useAppStore } from '@/store/useAppStore';
import { getLocalizedValue } from '@/types/i18n';

import { useQuizQuestionsByReelQuery } from '../hooks/useQuizQuestionsByReelQuery';

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ reelId?: string }>();
  const reelId = params.reelId;

  const language = useAppStore((s) => s.preferences.language);

  const { data, isLoading, isError, refetch } =
    useQuizQuestionsByReelQuery(reelId);

  const questions = data ?? [];
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const isCorrect = useMemo(() => {
    if (!current || !selectedOptionId) return false;
    return selectedOptionId === current.correctOptionId;
  }, [current, selectedOptionId]);

  if (isLoading) {
    return (
      <Screen className="p-0">
        <AppHeader title="Quiz" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center">
          <Loader />
          <Text className="text-text-muted mt-3 text-sm">Loading quiz…</Text>
        </View>
      </Screen>
    );
  }

  if (isError || !reelId) {
    return (
      <Screen className="p-0">
        <AppHeader title="Quiz" onBack={() => router.back()} />
        <View className="flex-1 px-4 justify-center">
          <Card>
            <Text className="text-text-primary text-base font-extrabold">
              Could not load quiz
            </Text>
            <View className="mt-4">
              <Button onPress={() => refetch()}>
                <Text className="text-text-primary text-center font-bold">
                  Retry
                </Text>
              </Button>
            </View>
          </Card>
        </View>
      </Screen>
    );
  }

  if (questions.length === 0) {
    return (
      <Screen className="p-0">
        <AppHeader title="Quiz" onBack={() => router.back()} />
        <View className="flex-1 px-4 justify-center">
          <Card>
            <Text className="text-text-primary text-base font-extrabold">
              No questions available
            </Text>
            <Text className="text-text-muted mt-2 text-sm">
              This reel doesn’t have a quiz yet.
            </Text>
          </Card>
        </View>
      </Screen>
    );
  }

  if (!current) {
    // Summary
    const scorePct = Math.round((correctCount / questions.length) * 100);
    analytics.track('quiz_completed', { reelId, scorePct });

    return (
      <Screen className="p-0">
        <AppHeader title="Quiz summary" onBack={() => router.replace('/feed')} />
        <View className="flex-1 px-4 py-6">
          <Card className="p-5">
            <Text className="text-text-primary text-xl font-extrabold">
              Score: {correctCount}/{questions.length}
            </Text>
            <Text className="text-text-muted mt-2 text-sm">
              {scorePct}% correct
            </Text>
            <View className="mt-5">
              <Button onPress={() => router.back()}>
                <Text className="text-text-primary text-center font-bold">
                  Back to reel
                </Text>
              </Button>
            </View>
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen className="p-0">
      <AppHeader
        title={`Quiz (${index + 1}/${questions.length})`}
        subtitle="Single-select MCQ"
        onBack={() => router.back()}
      />

      <View className="flex-1 px-4 py-4">
        <Card className="p-5">
          <Text className="text-text-primary text-base font-extrabold">
            {getLocalizedValue(current.prompt, language)}
          </Text>

          <View className="mt-4 gap-2">
            {current.options.map((opt) => {
              const selected = selectedOptionId === opt.id;
              const correct = submitted && opt.id === current.correctOptionId;
              const wrong = submitted && selected && opt.id !== current.correctOptionId;

              return (
                <Pressable
                  key={opt.id}
                  disabled={submitted}
                  onPress={() => setSelectedOptionId(opt.id)}
                  className={[
                    'rounded-xl border px-4 py-3',
                    selected ? 'border-brand500 bg-brand500/15' : 'border-border bg-bg-secondary',
                    correct ? 'border-brand500 bg-brand500/20' : '',
                    wrong ? 'border-danger-500 bg-danger-500/10' : ''
                  ].join(' ')}
                >
                  <Text className="text-text-primary text-sm font-bold">
                    {getLocalizedValue(opt.label, language)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {submitted ? (
            <View className="mt-4">
              <Text className={isCorrect ? 'text-brand500 text-sm font-bold' : 'text-danger-500 text-sm font-bold'}>
                {isCorrect ? 'Correct' : 'Incorrect'}
              </Text>
              {current.explanation ? (
                <Text className="text-text-muted mt-2 text-sm">
                  {getLocalizedValue(current.explanation, language)}
                </Text>
              ) : null}
            </View>
          ) : null}
        </Card>
      </View>

      <View className="px-4 pb-6">
        {!submitted ? (
          <Button
            disabled={!selectedOptionId}
            onPress={() => {
              analytics.track('quiz_started', { reelId });
              setSubmitted(true);
              if (isCorrect) setCorrectCount((c) => c + 1);
            }}
            className="w-full"
          >
            <Text className="text-text-primary text-center font-bold">
              Submit
            </Text>
          </Button>
        ) : (
          <Button
            onPress={() => {
              setSubmitted(false);
              setSelectedOptionId(null);
              if (isLast) {
                setIndex((i) => i + 1); // triggers summary
              } else {
                setIndex((i) => i + 1);
              }
            }}
            className="w-full"
          >
            <Text className="text-text-primary text-center font-bold">
              {isLast ? 'View results' : 'Next question'}
            </Text>
          </Button>
        )}
      </View>
    </Screen>
  );
}

