"use client";

import React, { useState } from 'react';
import { ChevronDown, Lightbulb } from 'lucide-react';

interface TipsDropdownProps {
  title: string;
  tips: string[];
  className?: string;
}

export const TipsDropdown: React.FC<TipsDropdownProps> = ({
  title,
  tips,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`mb-4 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-200 text-left"
      >
        <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0" />
        <span className="text-sm font-medium text-blue-800 flex-grow">
          {title}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-blue-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {isOpen && (
        <div className="mt-2 p-4 bg-card rounded-lg border border-gray-200 shadow-sm">
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1 text-xs">•</span>
                <span className="text-sm text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};