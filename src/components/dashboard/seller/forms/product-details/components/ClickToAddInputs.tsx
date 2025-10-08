"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClickToAddInputsProps<T extends Record<string, unknown>> {
  details: T[];
  setDetails: (details: T[]) => void;
  initialDetail: T;
  containerClassName?: string;
  inputClassName?: string;
}

export default function ClickToAddInputs<T extends Record<string, unknown>>({
  details,
  setDetails,
  initialDetail,
  containerClassName = "",
  inputClassName = "",
}: ClickToAddInputsProps<T>) {
  const addDetail = () => {
    setDetails([...details, { ...initialDetail }]);
  };

  const removeDetail = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const updateDetail = (index: number, key: keyof T, value: unknown) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], [key]: value } as T;
    setDetails(newDetails);
  };

  const renderInput = (
    detail: T,
    index: number,
    key: keyof T,
    label: string
  ) => {
    const value = detail[key];
    const isNumber = typeof initialDetail[key] === 'number';

    return (
      <div key={`${String(key)}-${index}`} className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground capitalize">
          {label}
        </Label>
        <Input
          type={isNumber ? "number" : "text"}
          placeholder={`Inserisci ${label.toLowerCase()}`}
          value={value || (isNumber ? 0 : "")}
          onChange={(e) => {
            const newValue = isNumber 
              ? parseFloat(e.target.value) || 0 
              : e.target.value;
            updateDetail(index, key, newValue);
          }}
          className={`${inputClassName} text-sm`}
        />
      </div>
    );
  };

  const getFieldLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      question: "Domanda",
      answer: "Risposta",
      name: "Nome",
      value: "Valore",
      color: "Colore",
      size: "Taglia",
      price: "Prezzo (€)",
      quantity: "Quantità",
      discount: "Sconto (%)"
    };
    return labelMap[key] || key;
  };

  return (
    <div className={`space-y-4 ${containerClassName}`}>
      {details.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Nessun elemento aggiunto ancora.</p>
          <p className="text-xs">Clicca il pulsante + per iniziare.</p>
        </div>
      )}

      {details.map((detail, index) => (
        <div
          key={index}
          className="p-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 grid gap-4 min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {Object.keys(initialDetail).map((key) =>
                renderInput(detail, index, key as keyof T, getFieldLabel(key))
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeDetail(index)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addDetail}
        className="w-full border-dashed border-2 hover:bg-muted py-3"
      >
        <Plus className="h-4 w-4 mr-2" />
        Aggiungi {
          Object.keys(initialDetail).length === 1 
            ? getFieldLabel(Object.keys(initialDetail)[0] || "")
            : "elemento"
        }
      </Button>
    </div>
  );
}