import type { ClassLevelId, SubjectId } from '@/types/ids';
import type { LocalizedString } from '@/types/i18n';

export const CLASS_LEVELS: Array<{
  id: ClassLevelId;
  label: LocalizedString;
}> = Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
  const id = n as ClassLevelId;
  return {
    id,
    label: {
      en: `Class ${n}`,
      hi: `कक्षा ${n}`
    }
  };
});

export const SUBJECTS: Array<{
  id: SubjectId;
  label: LocalizedString;
  shortLabel: LocalizedString;
}> = [
  {
    id: 'math',
    label: { en: 'Mathematics', hi: 'गणित' },
    shortLabel: { en: 'Math', hi: 'गणित' }
  },
  {
    id: 'science',
    label: { en: 'Science', hi: 'विज्ञान' },
    shortLabel: { en: 'Science', hi: 'विज्ञान' }
  },
  {
    id: 'english',
    label: { en: 'English', hi: 'अंग्रेज़ी' },
    shortLabel: { en: 'Eng', hi: 'अंग्रेज़ी' }
  },
  {
    id: 'social_science',
    label: { en: 'Social Science', hi: 'सामाजिक विज्ञान' },
    shortLabel: { en: 'SST', hi: 'सामाजिक विज्ञान' }
  },
  {
    id: 'hindi',
    label: { en: 'Hindi', hi: 'हिन्दी' },
    shortLabel: { en: 'Hindi', hi: 'हिन्दी' }
  }
];

export type Difficulty = 'easy' | 'medium' | 'hard';

