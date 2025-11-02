
export interface TalkRecord {
  timestamp: number;
}

export interface DailyStat {
  date: string;
  talkCount: number;
  talklessSeconds: number;
}

export interface GeminiInsight {
  title: string;
  insight: string;
  suggestions: string[];
}

export interface AppData {
  talkRecords: TalkRecord[];
  talklessTime: number;
}
