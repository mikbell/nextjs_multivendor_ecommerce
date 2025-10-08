"use client";

import { FC } from "react";

export const SimpleCategoryFormTest: FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">
          Category Form Test
        </h1>
        <p className="text-muted-foreground">
          If you can see this, the basic component loading is working.
        </p>
        <div className="p-4 bg-card rounded-lg border">
          <p className="text-sm text-green-600">✅ Component loaded successfully</p>
        </div>
      </div>
    </div>
  );
};