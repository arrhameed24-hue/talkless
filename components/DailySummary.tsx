
import React from 'react';
import type { DailyStat } from '../types';
import { formatDuration } from '../services/statsService';
import { Icon, Star, Target, ShieldCheck } from './Icons';

interface DailySummaryProps {
  stats: DailyStat | null;
  score: number;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ stats, score }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-200 mb-4">Today's Progress</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-slate-700/50 p-4 rounded-lg">
          <div className="flex justify-center items-center text-rose-400 mb-2">
            <Icon svg={<Target />} className="w-6 h-6 mr-2" />
            <h3 className="text-sm font-semibold uppercase text-slate-400">Unwanted Talks</h3>
          </div>
          <p className="text-4xl font-bold text-slate-100">{stats?.talkCount ?? 0}</p>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-lg">
           <div className="flex justify-center items-center text-sky-400 mb-2">
            <Icon svg={<ShieldCheck />} className="w-6 h-6 mr-2" />
            <h3 className="text-sm font-semibold uppercase text-slate-400">Talkless Time</h3>
          </div>
          <p className="text-4xl font-bold text-slate-100">{formatDuration(stats?.talklessSeconds ?? 0)}</p>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-lg">
           <div className="flex justify-center items-center text-amber-400 mb-2">
            <Icon svg={<Star />} className="w-6 h-6 mr-2" />
            <h3 className="text-sm font-semibold uppercase text-slate-400">Mindfulness Score</h3>
          </div>
          <p className="text-4xl font-bold text-slate-100">{score}</p>
        </div>
      </div>
    </div>
  );
};
