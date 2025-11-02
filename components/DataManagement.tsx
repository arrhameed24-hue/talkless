
import React, { useRef } from 'react';
import { Icon, Database, DownloadCloud, UploadCloud } from './Icons';
import type { AppData } from '../types';

interface DataManagementProps {
  data: AppData;
  onImport: (data: AppData) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ data, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `talk-less-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Error exporting data.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('File content is not readable text.');
        }
        const importedData = JSON.parse(text);

        // Basic validation
        if (
          'talkRecords' in importedData &&
          'talklessTime' in importedData &&
          Array.isArray(importedData.talkRecords)
        ) {
          if (window.confirm('Are you sure you want to import this data? This will overwrite your current data in this browser.')) {
            onImport(importedData as AppData);
          }
        } else {
          throw new Error('Invalid data format.');
        }
      } catch (error) {
        console.error('Failed to import data:', error);
        alert('Error importing data. Please make sure it is a valid export file.');
      } finally {
        // Reset file input to allow importing the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
        <Icon svg={<Database />} className="mr-2 text-slate-400" />
        Data Management
      </h2>
      <div className="space-y-3">
        <p className="text-sm text-slate-400">
          Your data is saved in this browser. Use these options to back it up or move it to another device.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center justify-center py-2 px-4 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Export your data to a file"
          >
            <Icon svg={<DownloadCloud />} className="w-5 h-5 mr-2" />
            <span className="font-semibold">Export</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center py-2 px-4 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Import data from a file"
          >
            <Icon svg={<UploadCloud />} className="w-5 h-5 mr-2" />
            <span className="font-semibold">Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
