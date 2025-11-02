
import React from 'react';
import { Icon, MessageSquareWarning, Timer, TimerOff } from './Icons';
import { formatDuration } from '../services/statsService';

interface TrackerControlsProps {
  onAddTalkRecord: () => void;
  onToggleTimer: () => void;
  isTimerActive: boolean;
  talklessTime: number;
}

export const TrackerControls: React.FC<TrackerControlsProps> = ({ onAddTalkRecord, onToggleTimer, isTimerActive, talklessTime }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-200 mb-4">Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={onAddTalkRecord}
          className="flex flex-col items-center justify-center p-6 bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          <Icon svg={<MessageSquareWarning />} className="w-10 h-10 mb-2" />
          <span className="font-semibold text-lg">Log Unwanted Talk</span>
        </button>
        <button 
          onClick={onToggleTimer}
          className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${isTimerActive ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30 focus:ring-green-400' : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 focus:ring-sky-400'}`}
        >
          {isTimerActive ? (
            <Icon svg={<TimerOff />} className="w-10 h-10 mb-2" />
          ) : (
            <Icon svg={<Timer />} className="w-10 h-10 mb-2" />
          )}
          <span className="font-semibold text-lg">{isTimerActive ? 'Stop Talkless Timer' : 'Start Talkless Timer'}</span>
          <span className="text-sm mt-1 font-mono">{formatDuration(talklessTime)}</span>
        </button>
      </div>
      {isTimerActive && <p className="text-center mt-4 text-sky-400 animate-pulse">Reminder: You are in a talkless period. Embrace the quiet.</p>}
    </div>
  );
};
