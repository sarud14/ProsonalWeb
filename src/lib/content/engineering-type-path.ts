import {
  ENGINEERING_NOTE_TYPE,
  type EngineeringNoteType,
} from '@/constants/engineering'

const ENGINEERING_TYPE_BY_PATH: Readonly<Record<string, EngineeringNoteType>> = {
  architecture: ENGINEERING_NOTE_TYPE.ARCHITECTURE,
  decisions: ENGINEERING_NOTE_TYPE.DECISIONS,
  performance: ENGINEERING_NOTE_TYPE.PERFORMANCE,
}

export function resolveEngineeringTypeFromPath(
  pathSegment: string,
): EngineeringNoteType | null {
  return ENGINEERING_TYPE_BY_PATH[pathSegment.toLowerCase()] ?? null
}
