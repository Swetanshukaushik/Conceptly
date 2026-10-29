import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { mockTopicDetails, mockTopics } from '@/services/api/mockData';
import { Icon } from './Icon';

interface OmnibarCommand {
  id: string;
  category: 'TELEPORT: TOPIC' | 'SYSTEM COMMAND' | 'QUIZ CHECKPOINT';
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  onExecute: () => void;
}

export function NeuralOmnibar() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const isOpen = useAppStore((s) => s.commandPaletteOpen);
  const setOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const setTheme = useAppStore((s) => s.setTheme);
  const toggleBionicReading = useAppStore((s) => s.toggleBionicReading);
  const bionicReading = useAppStore((s) => s.bionicReading);
  const toggleCaptions = useAppStore((s) => s.toggleCaptions);
  const captionsEnabled = useAppStore((s) => s.captionsEnabled);
  const setExploreLayoutMode = useAppStore((s) => s.setExploreLayoutMode);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global ⌘K / Ctrl+K keyboard listener on Web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!useAppStore.getState().commandPaletteOpen);
      } else if (e.key === 'Escape' && useAppStore.getState().commandPaletteOpen) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allCommands = useMemo<OmnibarCommand[]>(() => {
    const topicMap = new Map<string, { id: string; title: string; subtitle: string; diff: string }>();

    mockTopicDetails.forEach((t) => {
      topicMap.set(t.id, {
        id: t.id,
        title: t.title,
        subtitle: t.cheatSheetSummary?.[0] ?? `${t.subject.name} • ${t.chapter.title}`,
        diff: t.difficulty.toUpperCase(),
      });
    });

    mockTopics.forEach((t) => {
      if (!topicMap.has(t.id)) {
        topicMap.set(t.id, {
          id: t.id,
          title: t.title,
          subtitle: `Visual Revision Node • ${t.reelCount} Reels`,
          diff: t.difficulty.toUpperCase(),
        });
      }
    });

    const topicCommands: OmnibarCommand[] = Array.from(topicMap.values()).map((t) => ({
      id: `topic-${t.id}`,
      category: 'TELEPORT: TOPIC',
      title: t.title,
      subtitle: t.subtitle,
      badge: t.diff,
      icon: 'flash',
      onExecute: () => {
        setOpen(false);
        router.push(`/topic/${t.id}`);
      },
    }));

    const sysCommands: OmnibarCommand[] = [
      {
        id: 'sys-bionic',
        category: 'SYSTEM COMMAND',
        title: `${bionicReading ? 'Disable' : 'Enable'} 2040 Bionic Reading Mode`,
        subtitle: 'High-velocity eye-fixation typography across all cheat sheets & notes',
        badge: bionicReading ? 'ACTIVE' : 'TOGGLE',
        icon: 'eye',
        onExecute: () => {
          toggleBionicReading();
          setOpen(false);
        },
      },
      {
        id: 'sys-constellation',
        category: 'SYSTEM COMMAND',
        title: 'Open Neural Knowledge Constellation Map',
        subtitle: 'Navigate curriculum as a connected prerequisite skill graph',
        badge: '2040 GRAPH',
        icon: 'git-network',
        onExecute: () => {
          setExploreLayoutMode('constellation');
          setOpen(false);
          router.push('/explore');
        },
      },
      {
        id: 'sys-captions',
        category: 'SYSTEM COMMAND',
        title: `${captionsEnabled ? 'Mute' : 'Enable'} Synchronized Reel Subtitles (CC)`,
        subtitle: 'Toggle timed WebVTT / mental-model closed captions on all reels',
        badge: captionsEnabled ? 'CC ON' : 'CC OFF',
        icon: 'chatbox-ellipses',
        onExecute: () => {
          toggleCaptions();
          setOpen(false);
        },
      },
      {
        id: 'sys-theme-dark',
        category: 'SYSTEM COMMAND',
        title: 'Switch Optical Theme → Luminescent Dark',
        subtitle: 'Deep obsidian canvas with Ice Sky telemetry accents',
        badge: 'THEME',
        icon: 'moon',
        onExecute: () => {
          setTheme('dark');
          setOpen(false);
        },
      },
      {
        id: 'sys-theme-grey',
        category: 'SYSTEM COMMAND',
        title: 'Switch Optical Theme → Industrial Graphite Grey',
        subtitle: 'Machined titanium surface with Horology Amber accents',
        badge: 'THEME',
        icon: 'contrast',
        onExecute: () => {
          setTheme('grey');
          setOpen(false);
        },
      },
      {
        id: 'sys-theme-light',
        category: 'SYSTEM COMMAND',
        title: 'Switch Optical Theme → Daylight Studio Light',
        subtitle: 'High-contrast alabaster paper with Royal Cobalt accents',
        badge: 'THEME',
        icon: 'sunny',
        onExecute: () => {
          setTheme('light');
          setOpen(false);
        },
      },
    ];

    return [...sysCommands, ...topicCommands];
  }, [bionicReading, captionsEnabled, router, setExploreLayoutMode, setOpen, setTheme, toggleBionicReading, toggleCaptions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCommands.slice(0, 12);
    return allCommands
      .filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(q) ||
          cmd.subtitle.toLowerCase().includes(q) ||
          cmd.category.toLowerCase().includes(q)
      )
      .slice(0, 14);
  }, [allCommands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // ArrowUp / ArrowDown / Enter inside Omnibar on Web
  useEffect(() => {
    if (!isOpen || Platform.OS !== 'web' || typeof window === 'undefined') return;
    const handleNavKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].onExecute();
      }
    };
    window.addEventListener('keydown', handleNavKey);
    return () => window.removeEventListener('keydown', handleNavKey);
  }, [isOpen, filtered, selectedIndex]);

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        onPress={() => setOpen(false)}
        style={[
          styles.backdrop,
          {
            backgroundColor: isDark ? 'rgba(7, 9, 14, 0.80)' : 'rgba(15, 23, 42, 0.55)',
          },
        ]}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.paletteCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.primaryBorder,
              borderTopColor: colors.borderSpecular,
              shadowColor: colors.primary,
            },
          ]}
        >
          {/* Search Input Header */}
          <View style={[styles.searchRow, { borderBottomColor: colors.border }]}>
            <Icon name="search" size={18} color={colors.primaryText} />
            <TextInput
              autoFocus={true}
              placeholder="Type a concept, command, or topic (e.g. CAP, Cache, Bionic, Constellation)..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              style={[styles.input, { color: colors.textPrimary }]}
            />
            <Pressable
              onPress={() => setOpen(false)}
              style={[
                styles.escBadge,
                { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.escText, { color: colors.textMuted }]}>ESC</Text>
            </Pressable>
          </View>

          {/* Results List */}
          <ScrollView style={styles.resultsScroll} keyboardShouldPersistTaps="handled">
            {filtered.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  No neural nodes matched "{query}"
                </Text>
                <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                  Try searching for "CAP", "Cache", "Rate", "Bionic", or "Constellation".
                </Text>
              </View>
            ) : (
              filtered.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <Pressable
                    key={item.id}
                    onPress={item.onExecute}
                    style={[
                      styles.resultItem,
                      {
                        backgroundColor: isSelected ? colors.primarySoft : 'transparent',
                        borderColor: isSelected ? colors.primaryBorder : 'transparent',
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.itemIconBox,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Icon
                        name={item.icon as any}
                        size={15}
                        color={isSelected ? colors.textInverse : colors.primaryText}
                      />
                    </View>

                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={[styles.itemCategory, { color: colors.telemetryMono }]}>
                        {item.category}
                      </Text>
                      <Text
                        style={[styles.itemTitle, { color: colors.textPrimary }]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={[styles.itemSubtitle, { color: colors.textSecondary }]}
                        numberOfLines={1}
                      >
                        {item.subtitle}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.itemBadge,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.itemBadgeText, { color: colors.textSecondary }]}>
                        {item.badge}
                      </Text>
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          {/* Footer Telemetry */}
          <View
            style={[
              styles.footerRow,
              {
                backgroundColor: colors.surfaceSubtle,
                borderTopColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.footerHint, { color: colors.textMuted }]}>
              ↑↓ Navigate • ↵ Teleport • ⌘K Toggle Omnibar
            </Text>
            <Text style={[styles.footerHint, { color: colors.telemetryMono }]}>
              {filtered.length} NODES INDEXED
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'web' ? 76 : 56,
    paddingHorizontal: 16,
  },
  paletteCard: {
    width: '100%',
    maxWidth: 640,
    maxHeight: 500,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.3,
    shadowRadius: 28,
    elevation: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  escBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  escText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '800',
  },
  resultsScroll: {
    maxHeight: 380,
    padding: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4,
    gap: 12,
  },
  itemIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCategory: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
  },
  itemSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  itemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  itemBadgeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 9,
    fontWeight: '800',
  },
  emptyBox: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  footerHint: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
  },
});
