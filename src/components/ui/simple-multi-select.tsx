"use client";

import React, { useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface SimpleMultiSelectProps {
  options: MultiSelectOption[];
  value: MultiSelectOption[];
  onChange: (selected: MultiSelectOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  maxHeight?: string;
}

/**
 * Componente MultiSelect semplificato che evita loop infiniti
 * Sostituisce react-multi-select-component con HTML nativo
 */
export function SimpleMultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Seleziona opzioni...",
  disabled = false,
  searchPlaceholder = "Cerca...",
  maxHeight = "200px",
}: SimpleMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option: MultiSelectOption) => {
    const isSelected = value.some(v => v.value === option.value);
    
    if (isSelected) {
      // Rimuovi opzione
      const newValue = value.filter(v => v.value !== option.value);
      onChange(newValue);
    } else {
      // Aggiungi opzione
      onChange([...value, option]);
    }
  };

  const removeOption = (optionToRemove: MultiSelectOption) => {
    const newValue = value.filter(v => v.value !== optionToRemove.value);
    onChange(newValue);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full justify-between h-auto min-h-[40px] p-2"
      >
        <div className="flex flex-wrap gap-1 flex-1 text-left">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {value.slice(0, 2).map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded px-2 py-1 text-sm"
                >
                  <span>{option.label}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(option);
                    }}
                    className="hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {value.length > 2 && (
                <div className="flex items-center px-2 py-1 text-sm text-muted-foreground">
                  +{value.length - 2} altri
                </div>
              )}
            </>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-md shadow-lg">
          {/* Search */}
          <div className="p-2 border-b">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>

          {/* Options */}
          <div className="py-1" style={{ maxHeight, overflowY: 'auto' }}>
            {/* Clear All Button */}
            {value.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="w-full px-3 py-2 text-sm text-left hover:bg-destructive/10 text-destructive border-b"
              >
                Deseleziona tutto ({value.length})
              </button>
            )}

            {/* Options List */}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Nessuna opzione trovata
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.some(v => v.value === option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option)}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                  >
                    <div className="flex items-center justify-center w-4 h-4 border border-border rounded">
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{option.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}