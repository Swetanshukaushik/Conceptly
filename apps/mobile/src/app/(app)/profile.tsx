import React, { useState } from 'react';
import { View, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { Icon } from '@/components/ui/Icon';
import { QuickStatsRow } from '@/components/patterns/QuickStatsRow';
import { SectionHeader } from '@/components/ui/SectionHeader';

import { useAppStore } from '@/store/useAppStore';
import { educationApi } from '@/services/api/educationApi';
import { useProgressQuery } from '@/services/api/hooks/useProgressQuery';
import { useBookmarksQuery } from '@/services/api/hooks/useBookmarksQuery';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    selectedExamType,
    selectedClassId,
    language,
    setLanguage,
    apiDataSource,
    setApiDataSource,
    authToken,
    setAuthToken,
    userEmail,
    userName,
    setUserInfo,
    logout,
  } = useAppStore();
  const { data: progress } = useProgressQuery();
  const { data: bookmarks } = useBookmarksQuery();

  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleToggleApiSource = (source: 'mock' | 'live') => {
    setApiDataSource(source);
    queryClient.invalidateQueries();
  };

  const handleAuthSubmit = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'login') {
        const res = await educationApi.login({
          email: authEmail.trim(),
          password: authPassword.trim(),
        });
        setAuthToken(res.accessToken);
        setUserInfo({
          email: res.user.email ?? authEmail.trim(),
          name: res.user.displayName,
        });
      } else {
        const res = await educationApi.signup({
          email: authEmail.trim(),
          password: authPassword.trim(),
          displayName: authName.trim() || 'Candidate',
          examType: (selectedExamType as any) || 'TECH',
        });
        setAuthToken(res.accessToken);
        setUserInfo({
          email: res.user.email ?? authEmail.trim(),
          name: res.user.displayName,
        });
      }

      setAuthModalVisible(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      queryClient.invalidateQueries();
    } catch (e: any) {
      setAuthError(e?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    logout();
    queryClient.invalidateQueries();
    // Bootstrap fresh guest session if in live mode
    if (apiDataSource === 'live') {
      try {
        const res = await educationApi.createGuestSession();
        if (res?.accessToken) setAuthToken(res.accessToken);
      } catch {}
    }
  };

  const completedCount = progress?.filter((p) => p.completionPercent >= 100).length ?? 0;
  const bookmarksCount = bookmarks?.length ?? 0;

  const domainLabel =
    selectedExamType === 'TECH_INTERVIEW'
      ? 'Tech & System Design'
      : selectedExamType === 'PM_INTERVIEW'
      ? 'Product Management'
      : selectedExamType === 'FINANCE_CONSULTING'
      ? 'Finance & Consulting Cases'
      : selectedExamType === 'UPSC'
      ? 'UPSC Civil Services'
      : selectedExamType === 'IIT_JEE'
      ? 'IIT JEE Engineering'
      : selectedExamType === 'NEET'
      ? 'NEET Medical Exam'
      : selectedExamType === 'SCHOOL'
      ? `Class ${selectedClassId ?? 10} • CBSE / NCERT`
      : 'Tech & System Design Interview';

  return (
    <ScreenContainer scroll>
      <AppHeader title="Profile & Preferences" subtitle="Your Conceptly Learning Dashboard" />

      {/* User Card */}
      <AppCard tone="primarySoft" className="mt-4 mb-4 border-indigo-100">
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 rounded-full bg-indigo-600 items-center justify-center shadow-sm">
            <AppText variant="h2" tone="inverse">
              ⚡
            </AppText>
          </View>
          <View className="flex-1">
            <AppText variant="h3">
              {userName || (userEmail ? userEmail.split('@')[0] : 'Conceptly Member')}
            </AppText>
            <AppText variant="caption" tone="primary" className="mt-0.5 font-semibold">
              Target: {domainLabel}
            </AppText>
            <View className="flex-row items-center gap-1.5 mt-1.5">
              <Icon name="flame" size={16} color="#EA580C" />
              <AppText variant="micro" className="text-orange-600 font-bold">
                5 Day Interview Streak
              </AppText>
            </View>
          </View>
        </View>
      </AppCard>

      {/* Stats row */}
      <QuickStatsRow
        stats={[
          { label: 'Mastered', value: completedCount.toString() },
          { label: 'Saved', value: bookmarksCount.toString() },
          { label: 'Daily Streak', value: '5 days' },
        ]}
      />

      {/* 🔐 Account & Cloud Sync */}
      <View className="mt-6 mb-2">
        <SectionHeader title="Account & Cloud Sync" />
        <AppCard tone="default" className="mt-3 border-slate-200">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <Icon name="person-circle-outline" size={20} color="#6366F1" />
              <AppText variant="title">
                {userEmail ? 'Verified Account' : 'Guest Session'}
              </AppText>
            </View>
            <View
              className={`px-2.5 py-0.5 rounded-full ${
                userEmail ? 'bg-emerald-100' : 'bg-slate-100'
              }`}
            >
              <AppText
                variant="micro"
                className={`font-bold ${
                  userEmail ? 'text-emerald-700' : 'text-slate-600'
                }`}
              >
                {userEmail ? '● CLOUD SYNCED' : '● LOCAL ONLY'}
              </AppText>
            </View>
          </View>

          <AppText variant="caption" tone="secondary" className="mb-4">
            {userEmail
              ? `Signed in as ${userEmail}. All progress, quizzes, and bookmarks are backed up to the database.`
              : 'You are currently studying as a Guest. Sign in or register to sync your learning streak and bookmarks across devices.'}
          </AppText>

          {userEmail ? (
            <AppButton
              label="Sign Out of Account"
              variant="secondary"
              onPress={handleLogout}
            />
          ) : (
            <AppButton
              label="Sign In or Create Account →"
              variant="primary"
              onPress={() => {
                setAuthError(null);
                setAuthModalVisible(true);
              }}
            />
          )}
        </AppCard>
      </View>

      {/* Study Language Preference */}
      <View className="mt-6 mb-6">
        <SectionHeader title="Study Language" />
        <View className="flex-row gap-3 mt-3">
          <Pressable
            onPress={() => setLanguage('en')}
            className={`flex-1 p-3.5 rounded-2xl border items-center justify-center ${
              language === 'en'
                ? 'bg-indigo-600 border-indigo-600'
                : 'bg-white border-slate-200'
            }`}
          >
            <AppText
              variant="bodyMedium"
              tone={language === 'en' ? 'inverse' : 'default'}
              className="font-bold"
            >
              English
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => setLanguage('hi')}
            className={`flex-1 p-3.5 rounded-2xl border items-center justify-center ${
              language === 'hi'
                ? 'bg-indigo-600 border-indigo-600'
                : 'bg-white border-slate-200'
            }`}
          >
            <AppText
              variant="bodyMedium"
              tone={language === 'hi' ? 'inverse' : 'default'}
              className="font-bold"
            >
              हिन्दी (Hindi)
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* ⚡ API Data Engine Switcher */}
      <View className="mb-6">
        <SectionHeader title="Backend & Data Engine" />
        <AppCard tone="default" className="mt-3 border-slate-200">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Icon name="server-outline" size={20} color="#6366F1" />
              <AppText variant="title">Active Data Source</AppText>
            </View>
            <View
              className={`px-2.5 py-0.5 rounded-full ${
                apiDataSource === 'live' ? 'bg-emerald-100' : 'bg-purple-100'
              }`}
            >
              <AppText
                variant="micro"
                className={`font-bold ${
                  apiDataSource === 'live' ? 'text-emerald-700' : 'text-purple-700'
                }`}
              >
                {apiDataSource === 'live' ? '● LIVE REST API' : '● MOCK ENGINE'}
              </AppText>
            </View>
          </View>

          <AppText variant="caption" tone="secondary" className="mb-4">
            {apiDataSource === 'live'
              ? 'Connected to NestJS + SQLite server (http://localhost:3000/v1) with live Prisma persistence & real JWT sessions.'
              : 'Serving rich in-memory mock datasets. Completely offline-first and instant.'}
          </AppText>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => handleToggleApiSource('mock')}
              className={`flex-1 p-3 rounded-2xl border items-center justify-center ${
                apiDataSource === 'mock'
                  ? 'bg-purple-600 border-purple-600'
                  : 'bg-white border-slate-200'
              }`}
            >
              <AppText
                variant="bodyMedium"
                tone={apiDataSource === 'mock' ? 'inverse' : 'default'}
                className="font-bold"
              >
                🧪 Offline Mock
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => handleToggleApiSource('live')}
              className={`flex-1 p-3 rounded-2xl border items-center justify-center ${
                apiDataSource === 'live'
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white border-slate-200'
              }`}
            >
              <AppText
                variant="bodyMedium"
                tone={apiDataSource === 'live' ? 'inverse' : 'default'}
                className="font-bold"
              >
                🌐 Live Backend
              </AppText>
            </Pressable>
          </View>
        </AppCard>
      </View>

      {/* Target Domain Switcher */}
      <View className="mb-6">
        <SectionHeader title="Revision Domain Settings" />
        <View className="gap-3 mt-3">
          <AppButton
            label="Switch Target Domain (Tech / PM / UPSC / School)"
            variant="secondary"
            onPress={() => router.push('/exam-type-select')}
          />
          {selectedExamType === 'SCHOOL' && (
            <AppButton
              label="Change Class Level"
              variant="secondary"
              onPress={() => router.push('/class-select')}
            />
          )}
          <AppButton
            label="Change Active Subject Module"
            variant="secondary"
            onPress={() => router.push('/subject-select')}
          />
        </View>
      </View>

      {/* About Conceptly */}
      <AppCard tone="default" className="mb-8 border-slate-200">
        <View className="flex-row items-center gap-2 mb-2">
          <Icon name="information-circle-outline" size={20} color="#64748B" />
          <AppText variant="title">About Conceptly</AppText>
        </View>
        <AppText variant="caption" tone="secondary">
          First-principles visual micro-reels and interactive flashcard checkpoints designed to build deep conceptual clarity across exams and careers.
        </AppText>
        <AppText variant="micro" tone="muted" className="mt-3">
          Conceptly Platform v2.0 (High-Speed Visual Player)
        </AppText>
      </AppCard>

      {/* 🔐 Auth Modal (Log In / Sign Up) */}
      <Modal
        visible={authModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAuthModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-4">
          <View className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200">
            {/* Header */}
            <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
              <AppText variant="h3">
                {authMode === 'login' ? 'Welcome Back' : 'Create Candidate Account'}
              </AppText>
              <Pressable
                onPress={() => setAuthModalVisible(false)}
                className="h-8 w-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <AppText className="text-slate-500 font-bold">✕</AppText>
              </Pressable>
            </View>

            {/* Mode Switcher Tabs */}
            <View className="flex-row bg-slate-100 p-1 rounded-2xl my-4">
              <Pressable
                onPress={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-xl items-center ${
                  authMode === 'login' ? 'bg-white shadow-xs' : ''
                }`}
              >
                <AppText
                  variant="caption"
                  className={`font-bold ${
                    authMode === 'login' ? 'text-indigo-600' : 'text-slate-600'
                  }`}
                >
                  Sign In
                </AppText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 rounded-xl items-center ${
                  authMode === 'signup' ? 'bg-white shadow-xs' : ''
                }`}
              >
                <AppText
                  variant="caption"
                  className={`font-bold ${
                    authMode === 'signup' ? 'text-indigo-600' : 'text-slate-600'
                  }`}
                >
                  Register
                </AppText>
              </Pressable>
            </View>

            {/* Error banner */}
            {authError && (
              <View className="bg-red-50 border border-red-200 p-3 rounded-xl mb-3">
                <AppText variant="micro" className="text-red-700 font-medium">
                  {authError}
                </AppText>
              </View>
            )}

            {/* Form Fields */}
            {authMode === 'signup' && (
              <View className="mb-3">
                <AppText variant="micro" tone="secondary" className="mb-1 font-semibold">
                  Full Name / Alias
                </AppText>
                <TextInput
                  value={authName}
                  onChangeText={setAuthName}
                  placeholder="e.g. Alex Chen"
                  placeholderTextColor="#94A3B8"
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 bg-slate-50"
                />
              </View>
            )}

            <View className="mb-3">
              <AppText variant="micro" tone="secondary" className="mb-1 font-semibold">
                Email Address
              </AppText>
              <TextInput
                value={authEmail}
                onChangeText={setAuthEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="name@example.com"
                placeholderTextColor="#94A3B8"
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 bg-slate-50"
              />
            </View>

            <View className="mb-5">
              <AppText variant="micro" tone="secondary" className="mb-1 font-semibold">
                Password
              </AppText>
              <TextInput
                value={authPassword}
                onChangeText={setAuthPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 bg-slate-50"
              />
            </View>

            {/* Submit */}
            <AppButton
              label={
                authLoading
                  ? 'Verifying...'
                  : authMode === 'login'
                  ? 'Sign In to Account'
                  : 'Create & Sync Account'
              }
              variant="primary"
              disabled={authLoading}
              onPress={handleAuthSubmit}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
