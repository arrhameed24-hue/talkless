
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Header } from './components/Header';
import { TrackerControls } from './components/TrackerControls';
import { DailySummary } from './components/DailySummary';
import { GeminiInsights } from './components/GeminiInsights';
import { Icon, LogOut, BrainCircuit } from './components/Icons';
import type { TalkRecord, DailyStat } from './types';
import { getDailyStats, getWeeklyStats, getMonthlyStats } from './services/statsService';

const App: React.FC = () => {
  const [talkRecords, setTalkRecords] = useState<TalkRecord[]>([]);
  const [talklessTime, setTalklessTime] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  useEffect(() => {
    const savedRecords = localStorage.getItem('talkRecords');
    if (savedRecords) {
      setTalkRecords(JSON.parse(savedRecords));
    }
    const savedTalklessTime = localStorage.getItem('talklessTime');
    if (savedTalklessTime) {
      setTalklessTime(JSON.parse(savedTalklessTime));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('talkRecords', JSON.stringify(talkRecords));
  }, [talkRecords]);

  useEffect(() => {
    localStorage.setItem('talklessTime', JSON.stringify(talklessTime));
  }, [talklessTime]);
  
  useEffect(() => {
    let interval: number | undefined;
    if (isTimerActive) {
      interval = window.setInterval(() => {
        setTalklessTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive]);

  const addTalkRecord = () => {
    setTalkRecords(prev => [...prev, { timestamp: Date.now() }]);
  };

  const toggleTimer = () => {
    setIsTimerActive(prev => !prev);
  };

  const dailyStats = useMemo(() => getDailyStats(talkRecords, talklessTime), [talkRecords, talklessTime]);
  const weeklyStats = useMemo(() => getWeeklyStats(talkRecords), [talkRecords]);
  const monthlyStats = useMemo(() => getMonthlyStats(talkRecords), [talkRecords]);

  const score = useMemo(() => {
    const totalTalks = talkRecords.length;
    const totalQuietHours = talklessTime / 3600;
    // Simple scoring: more quiet time is good, fewer talks is good.
    const score = Math.max(0, Math.round(totalQuietHours * 10 - totalTalks * 0.5));
    return score;
  }, [talkRecords, talklessTime]);

  const appBgClass = isTimerActive ? 'talkless-active-bg' : 'bg-slate-900';

  return (
    <div className={`min-h-screen ${appBgClass} text-slate-200 transition-colors duration-1000`}>
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TrackerControls 
              onAddTalkRecord={addTalkRecord} 
              onToggleTimer={toggleTimer} 
              isTimerActive={isTimerActive}
              talklessTime={talklessTime}
            />
            <DailySummary stats={dailyStats} score={score} />
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
                <Icon svg={<LogOut />} className="mr-2" />
                Weekly Talk Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyStats} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} />
                  <YAxis tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem' }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#cbd5e1' }} />
                  <Legend wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }} />
                  <Bar dataKey="talkCount" fill="#38bdf8" name="Unwanted Talks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
             <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
                <Icon svg={<LogOut />} className="mr-2" />
                Monthly Talk Overview
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyStats} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} />
                  <YAxis tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem' }} itemStyle={{ color: '#e2e8f0' }} labelStyle={{ color: '#cbd5e1' }} />
                  <Legend wrapperStyle={{ color: '#94a3b8', paddingTop: '10px' }} />
                  <Bar dataKey="talkCount" fill="#0ea5e9" name="Unwanted Talks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <GeminiInsights records={talkRecords} />
            <div className="bg-gradient-to-br from-slate-700 to-slate-600 text-slate-300 p-6 rounded-2xl shadow-lg">
               <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center"><Icon svg={<BrainCircuit />} className="mr-2 text-sky-400" />Why Track This?</h3>
               <p className="text-sm opacity-90">
                Tracking unwanted talk isn't about silence, it's about mindfulness. It helps you understand your communication patterns, reduce impulsive speech, and become a more intentional listener.
               </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        ARR_2.0 | arivukalanjiyam
      </footer>
    </div>
  );
};

export default App;
