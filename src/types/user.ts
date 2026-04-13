import type { ClassLevelId, SubjectId } from './ids';
import type { LanguageCode } from './i18n';

export type StudentUser = {
  id: string;
  name: string;
  // MVP: stored locally
  preferredLanguage: LanguageCode;
  selectedClassLevel: ClassLevelId | null;
  selectedSubjectId: SubjectId | null;
};

