"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from './input';

interface SimpleKeywordInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
  maxKeywords?: number;
  disabled?: boolean;
}

/**
 * Componente semplificato per input keywords che evita loop infiniti
 * Sostituisce ReactTags con un input HTML nativo
 */
export function SimpleKeywordInput({
  value = [],
  onChange,
  placeholder = "Aggiungi parole chiave...",
  maxKeywords = 10,
  disabled = false,
}: SimpleKeywordInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword();
    }
  };

  const addKeyword = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed) && value.length < maxKeywords) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = value.filter((_, i) => i !== index);
    onChange(newKeywords);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addKeyword}
          placeholder={placeholder}
          disabled={disabled || value.length >= maxKeywords}
          className="flex-1"
        />
        <button
          type="button"
          onClick={addKeyword}
          disabled={!inputValue.trim() || value.length >= maxKeywords || disabled}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Aggiungi
        </button>
      </div>

      {value.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            Parole chiave aggiunte ({value.length}/{maxKeywords}):
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((keyword, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                <span>{keyword}</span>
                <button
                  type="button"
                  onClick={() => removeKeyword(index)}
                  disabled={disabled}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {value.length >= maxKeywords && (
        <p className="text-sm text-muted-foreground">
          Hai raggiunto il limite massimo di {maxKeywords} parole chiave.
        </p>
      )}
    </div>
  );
}