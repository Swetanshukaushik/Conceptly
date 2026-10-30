import React, { useState } from 'react';
import { View, Pressable, Modal, TextInput, StyleSheet } from 'react-native';
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
import { useTheme } from '@/app/providers/ThemeProvider';
import { ThemeMode } from '@/theme/types';
import { educationApi } from '@/services/api/educationApi';
import { useProgressQuery } from '@/services/api/hooks/useProgressQuery';
import { useBookmarksQuery } from '@/services/api/hooks/useBookmarksQuery';
import { useQueryClient } from '@tanstack/react-query';

const THEME_OPTIONS: Array<{
  id: ThemeMode;
  name: string;
  tagline: string;
  icon: string;
  bgPreview: string;
  cardPreview: string;
  accentPreview: string;
}> = [
  {
    id: 'light',
    name: 'Light',
    tagline: 'Pure Focus Alabaster',
    icon: '☀️',
    bgPreview: '#F8FAFC',
    cardPreview: '#FFFFFF',
    accentPreview: '#1D4ED8',
  },
  {
    id: 'dark',
    name: 'Dark',
    tagline: 'Studio Graphite',
    icon: '🌙',
    bgPreview: '#1B1C20',
    cardPreview: '#23252A',
    accentPreview: '#F59E0B',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colors, theme, setTheme, isDark } = useTheme();
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
      <AppHeader
        title="Profile & Settings"
        subtitle="Customization & Study Preferences"
      />

      {/* User Card */}
      <AppCard tone="primarySoft" style={{ marginTop: 12, marginBottom: 16 }}>
        <View style={styles.userCardRow}>
          <View
            style={[
              styles.avatarBadge,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              },
            ]}
          >
            <AppText variant="h2" tone="inverse">
              ⚡
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="h3">
              {userName || (userEmail ? userEmail.split('@')[0] : 'Conceptly Member')}
            </AppText>
            <AppText variant="caption" tone="primary" style={{ marginTop: 2, fontWeight: '600' }}>
              Target: {domainLabel}
            </AppText>
            <View style={styles.streakRow}>
              <Icon name="flame" size={15} color="#EA580C" />
              <AppText variant="micro" style={{ color: '#EA580C', fontWeight: '700' }}>
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

      {/* 🎨 Theme & Appearance Switcher */}
      <View style={{ marginTop: 24, marginBottom: 8 }}>
        <SectionHeader title="Color Theme & Appearance" />
        <AppText variant="caption" tone="secondary" style={{ marginTop: 2, marginBottom: 12 }}>
          Choose an engineered palette designed for extreme focus and low eye strain.
        </AppText>

        <View style={styles.themeGrid}>
          {THEME_OPTIONS.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setTheme(opt.id)}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                {/* Visual Swatch Preview */}
                <View
                  style={[
                    styles.swatchPreview,
                    { backgroundColor: opt.bgPreview, borderColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.swatchCard,
                      { backgroundColor: opt.cardPreview, borderColor: colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.swatchDot,
                        { backgroundColor: opt.accentPreview },
                      ]}
                    />
                  </View>
                </View>

                {/* Option Details */}
                <View style={styles.themeDetails}>
                  <View style={styles.themeTitleRow}>
                    <AppText variant="bodyMedium" style={{ fontWeight: '700' }}>
                      {opt.icon} {opt.name}
                    </AppText>
                    {isSelected && (
                      <View
                        style={[
                          styles.checkBadge,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <AppText variant="micro" tone="inverse" style={{ fontSize: 9 }}>
                          ✓
                        </AppText>
                      </View>
                    )}
                  </View>
                  <AppText variant="micro" tone="muted" numberOfLines={1}>
                    {opt.tagline}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* 🔐 Account & Cloud Sync */}
      <View style={{ marginTop: 20, marginBottom: 8 }}>
        <SectionHeader title="Account & Cloud Sync" />
        <AppCard tone="default" style={{ marginTop: 8 }}>
          <View style={styles.accountRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="person-circle-outline" size={20} color={colors.primaryText} />
              <AppText variant="title">
                {userEmail ? 'Verified Account' : 'Guest Session'}
              </AppText>
            </View>
            <View
              style={[
                styles.syncBadge,
                {
                  backgroundColor: userEmail ? colors.successSoft : colors.surfaceSubtle,
                  borderColor: userEmail ? colors.border : colors.border,
                },
              ]}
            >
              <AppText
                variant="micro"
                style={{
                  fontWeight: '700',
                  color: userEmail ? colors.successText : colors.textMuted,
                }}
              >
                {userEmail ? '● CLOUD SYNCED' : '● LOCAL ONLY'}
              </AppText>
            </View>
          </View>

          <AppText variant="caption" tone="secondary" style={{ marginBottom: 16 }}>
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
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <SectionHeader title="Study Language" />
        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLanguage('en')}
            style={[
              styles.langButton,
              {
                backgroundColor: language === 'en' ? colors.primary : colors.surface,
                borderColor: language === 'en' ? colors.primary : colors.border,
              },
            ]}
          >
            <AppText
              variant="bodyMedium"
              tone={language === 'en' ? 'inverse' : 'default'}
              style={{ fontWeight: '700' }}
            >
              English
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => setLanguage('hi')}
            style={[
              styles.langButton,
              {
                backgroundColor: language === 'hi' ? colors.primary : colors.surface,
                borderColor: language === 'hi' ? colors.primary : colors.border,
              },
            ]}
          >
            <AppText
              variant="bodyMedium"
              tone={language === 'hi' ? 'inverse' : 'default'}
              style={{ fontWeight: '700' }}
            >
              हिन्दी (Hindi)
            </AppText>
          </Pressable>
        </View>
      </View>

      {/* ⚡ API Data Engine Switcher */}
      <View style={{ marginBottom: 20 }}>
        <SectionHeader title="Backend & Data Engine" />
        <AppCard tone="default" style={{ marginTop: 8 }}>
          <View style={styles.accountRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="server-outline" size={20} color={colors.primaryText} />
              <AppText variant="title">Active Data Source</AppText>
            </View>
            <View
              style={[
                styles.syncBadge,
                {
                  backgroundColor: apiDataSource === 'live' ? colors.successSoft : colors.surfaceSubtle,
                },
              ]}
            >
              <AppText
                variant="micro"
                style={{
                  fontWeight: '700',
                  color: apiDataSource === 'live' ? colors.successText : colors.textMuted,
                }}
              >
                {apiDataSource === 'live' ? '● LIVE REST API' : '● MOCK ENGINE'}
              </AppText>
            </View>
          </View>

          <AppText variant="caption" tone="secondary" style={{ marginBottom: 16 }}>
            {apiDataSource === 'live'
              ? 'Connected to live Render cloud backend (https://conceptly-api.onrender.com/v1) backed by Supabase PostgreSQL.'
              : 'Serving rich offline mock datasets. Instant and works without internet.'}
          </AppText>

          <View style={styles.langRow}>
            <Pressable
              onPress={() => handleToggleApiSource('mock')}
              style={[
                styles.langButton,
                {
                  backgroundColor: apiDataSource === 'mock' ? colors.primary : colors.surface,
                  borderColor: apiDataSource === 'mock' ? colors.primary : colors.border,
                },
              ]}
            >
              <AppText
                variant="bodyMedium"
                tone={apiDataSource === 'mock' ? 'inverse' : 'default'}
                style={{ fontWeight: '700' }}
              >
                🧪 Offline Mock
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => handleToggleApiSource('live')}
              style={[
                styles.langButton,
                {
                  backgroundColor: apiDataSource === 'live' ? colors.primary : colors.surface,
                  borderColor: apiDataSource === 'live' ? colors.primary : colors.border,
                },
              ]}
            >
              <AppText
                variant="bodyMedium"
                tone={apiDataSource === 'live' ? 'inverse' : 'default'}
                style={{ fontWeight: '700' }}
              >
                🌐 Live Backend
              </AppText>
            </Pressable>
          </View>
        </AppCard>
      </View>

      {/* Target Domain Switcher */}
      <View style={{ marginBottom: 20 }}>
        <SectionHeader title="Revision Domain Settings" />
        <View style={{ gap: 10, marginTop: 8 }}>
          <AppButton
            label="Switch Target Domain (Tech / PM / Finance / UPSC / School)"
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
      <AppCard tone="default" style={{ marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Icon name="information-circle-outline" size={20} color={colors.textSecondary} />
          <AppText variant="title">About Conceptly</AppText>
        </View>
        <AppText variant="caption" tone="secondary">
          First-principles visual micro-reels and interactive flashcard checkpoints designed to build deep conceptual clarity across exams and careers.
        </AppText>
        <AppText variant="micro" tone="muted" style={{ marginTop: 12 }}>
          Conceptly Platform v2.0 • Executive Multi-Theme Edition
        </AppText>
      </AppCard>

      {/* 🔐 Auth Modal (Log In / Sign Up) */}
      <Modal
        visible={authModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAuthModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.borderSubtle }]}>
              <AppText variant="h3">
                {authMode === 'login' ? 'Welcome Back' : 'Create Candidate Account'}
              </AppText>
              <Pressable
                onPress={() => setAuthModalVisible(false)}
                style={[styles.closeButton, { backgroundColor: colors.surfaceSubtle }]}
              >
                <AppText style={{ color: colors.textSecondary, fontWeight: '700' }}>✕</AppText>
              </Pressable>
            </View>

            {/* Mode Switcher Tabs */}
            <View style={[styles.modalTabs, { backgroundColor: colors.surfaceSubtle }]}>
              <Pressable
                onPress={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                style={[
                  styles.modalTab,
                  authMode === 'login' && {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  style={{
                    fontWeight: '700',
                    color: authMode === 'login' ? colors.primaryText : colors.textMuted,
                  }}
                >
                  Sign In
                </AppText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                style={[
                  styles.modalTab,
                  authMode === 'signup' && {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  style={{
                    fontWeight: '700',
                    color: authMode === 'signup' ? colors.primaryText : colors.textMuted,
                  }}
                >
                  Register
                </AppText>
              </Pressable>
            </View>

            {/* Error banner */}
            {authError && (
              <View style={[styles.errorBanner, { backgroundColor: colors.dangerSoft }]}>
                <AppText variant="micro" style={{ color: colors.dangerText, fontWeight: '500' }}>
                  {authError}
                </AppText>
              </View>
            )}

            {/* Form Fields */}
            {authMode === 'signup' && (
              <View style={{ marginBottom: 12 }}>
                <AppText variant="micro" tone="secondary" style={{ marginBottom: 4, fontWeight: '600' }}>
                  Full Name / Alias
                </AppText>
                <TextInput
                  value={authName}
                  onChangeText={setAuthName}
                  placeholder="e.g. Alex Chen"
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                />
              </View>
            )}

            <View style={{ marginBottom: 12 }}>
              <AppText variant="micro" tone="secondary" style={{ marginBottom: 4, fontWeight: '600' }}>
                Email Address
              </AppText>
              <TextInput
                value={authEmail}
                onChangeText={setAuthEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="name@example.com"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <AppText variant="micro" tone="secondary" style={{ marginBottom: 4, fontWeight: '600' }}>
                Password
              </AppText>
              <TextInput
                value={authPassword}
                onChangeText={setAuthPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
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

const styles = StyleSheet.create({
  userCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  themeCard: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },
  swatchPreview: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  swatchCard: {
    width: '75%',
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  themeDetails: {
    alignItems: 'center',
    width: '100%',
  },
  themeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  checkBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  syncBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  langRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  langButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTabs: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    marginVertical: 16,
  },
  modalTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorBanner: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
});
