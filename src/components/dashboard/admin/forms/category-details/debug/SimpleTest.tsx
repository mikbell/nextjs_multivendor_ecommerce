"use client";

import Heading from "@/components/shared/heading";
import { FC } from "react";

export const SimpleCategoryFormTest: FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Heading>
          Category Form Test
        </Heading>
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