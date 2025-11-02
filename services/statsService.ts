
import type { TalkRecord, DailyStat } from '../types';

// Helper to get date string in 'YYYY-MM-DD' format, respecting local timezone
const toLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getDailyStats = (records: TalkRecord[], talklessSeconds: number): DailyStat | null => {
    const today = new Date();
    const todayStr = toLocalDateString(today);

    const todaysRecords = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        return toLocalDateString(recordDate) === todayStr;
    });

    return {
        date: 'Today',
        talkCount: todaysRecords.length,
        talklessSeconds: talklessSeconds,
    };
};

export const getWeeklyStats = (records: TalkRecord[]): DailyStat[] => {
    const stats: { [key: string]: number } = {};
    const today = new Date();
    const days: DailyStat[] = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = toLocalDateString(d);
        const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        stats[dateStr] = 0;
        days.push({ date: dayLabel, talkCount: 0, talklessSeconds: 0 });
    }

    records.forEach(record => {
        const recordDate = new Date(record.timestamp);
        const dateStr = toLocalDateString(recordDate);
        if (stats[dateStr] !== undefined) {
            stats[dateStr]++;
        }
    });

    days.forEach((day, index) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - index));
        const dateStr = toLocalDateString(d);
        day.talkCount = stats[dateStr] || 0;
    });

    return days;
};

export const getMonthlyStats = (records: TalkRecord[]): { date: string, talkCount: number }[] => {
    const stats: { [key: string]: number } = {};
    const today = new Date();
    
    // Initialize stats for the last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return toLocalDateString(d);
    }).reverse();

    last30Days.forEach(dateStr => {
        stats[dateStr] = 0;
    });
    
    records.forEach(record => {
        const dateStr = toLocalDateString(new Date(record.timestamp));
        if (dateStr in stats) {
            stats[dateStr]++;
        }
    });
    
    return Object.entries(stats).map(([date, talkCount]) => ({
        date: date.substring(5), // M-D format
        talkCount,
    })).sort((a,b) => a.date.localeCompare(b.date));
};


export const formatDuration = (totalSeconds: number): string => {
    if (totalSeconds < 0) totalSeconds = 0;
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const hStr = hours.toString().padStart(2, '0');
    const mStr = minutes.toString().padStart(2, '0');
    const sStr = seconds.toString().padStart(2, '0');

    return `${hStr}:${mStr}:${sStr}`;
};
