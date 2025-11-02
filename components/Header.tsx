
import React from 'react';
import { Icon, Rabbit } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon svg={<Rabbit />} className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold text-slate-100">
            Talk-Less Tracker
          </h1>
        </div>
        <p className="text-sm text-slate-400 hidden md:block">Your journey to mindful communication starts here.</p>
      </div>
    </header>
  );
};
