"use client";

import { CircleAlert } from "lucide-react";
import { BaseFormProps } from "../types";

export const DebugPanel = ({ form }: BaseFormProps) => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <CircleAlert className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Debug - Valori Correnti del Form
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong>Nome Prodotto:</strong> 
                <span className={form.watch('name') ? 'text-green-600' : 'text-red-600'}>
                  {form.watch('name') || 'VUOTO'}
                </span>
              </div>
              <div>
                <strong>Nome Variante:</strong> 
                <span className={form.watch('variantName') ? 'text-green-600' : 'text-red-600'}>
                  {form.watch('variantName') || 'VUOTO'}
                </span>
              </div>
              <div>
                <strong>Marca:</strong> 
                <span className={form.watch('brand') ? 'text-green-600' : 'text-red-600'}>
                  {form.watch('brand') || 'VUOTO'}
                </span>
              </div>
              <div>
                <strong>Descrizione:</strong> 
                <span className={form.watch('description') ? 'text-green-600' : 'text-red-600'}>
                  {form.watch('description') ? `${form.watch('description').substring(0, 50)}...` : 'VUOTO'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};