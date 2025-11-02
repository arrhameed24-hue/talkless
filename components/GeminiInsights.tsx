
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { TalkRecord, GeminiInsight } from '../types';
import { Icon, Lightbulb, Zap } from './Icons';

interface GeminiInsightsProps {
  records: TalkRecord[];
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
    </div>
);

const InsightDisplay: React.FC<{ insight: GeminiInsight }> = ({ insight }) => (
    <div>
        <h3 className="text-lg font-bold text-sky-400 mb-2">{insight.title}</h3>
        <p className="text-sm text-slate-300 mb-3">{insight.insight}</p>
        <ul className="space-y-2">
            {insight.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start text-sm text-slate-300">
                    <Icon svg={<Zap />} className="w-4 h-4 text-sky-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                </li>
            ))}
        </ul>
    </div>
);


export const GeminiInsights: React.FC<GeminiInsightsProps> = ({ records }) => {
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getInsights = async () => {
    if (records.length < 5) {
        setInsight({
            title: "Keep Tracking!",
            insight: "You're just getting started. Keep logging your talk records for a few days, and I'll be able to provide some helpful analysis.",
            suggestions: ["Log an 'unwanted talk' whenever you catch yourself speaking impulsively.", "Use the 'talkless timer' during focused work or relaxation."]
        });
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setInsight(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const recentRecords = records.slice(-50); // Analyze last 50 records
        
        const prompt = `
            You are a kind and insightful behavioral coach. A user is tracking their "unwanted talk" to improve mindfulness.
            Here are timestamps (in milliseconds since epoch) of their recent unwanted talks:
            ${JSON.stringify(recentRecords.map(r => r.timestamp))}

            Analyze this data to identify patterns (e.g., time of day, clusters).
            Provide a concise, encouraging title, a short paragraph of insight, and a bulleted list of 2-3 simple, actionable suggestions.
            The output must conform to the provided JSON schema.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        insight: { type: Type.STRING },
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["title", "insight", "suggestions"]
                }
            }
        });

        const text = response.text.trim();
        const parsedInsight: GeminiInsight = JSON.parse(text);
        setInsight(parsedInsight);

    } catch (e) {
        console.error("Error fetching Gemini insights:", e);
        setError("Couldn't fetch AI insights. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-200 flex items-center">
          <Icon svg={<Lightbulb />} className="mr-2 text-amber-400" />
          AI Insights
        </h2>
        <button 
          onClick={getInsights} 
          disabled={isLoading}
          className="bg-sky-600 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-sky-700 disabled:bg-slate-600 disabled:text-slate-400 transition"
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      <div className="min-h-[150px]">
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-rose-400 text-sm">{error}</p>}
        {insight && <InsightDisplay insight={insight} />}
        {!isLoading && !error && !insight && (
            <div className="text-center text-slate-500 pt-8">
                <p>Click "Analyze" to get personalized feedback on your progress.</p>
            </div>
        )}
      </div>
    </div>
  );
};
