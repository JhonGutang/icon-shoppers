"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  colorClass: string;
  iconColorClass: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  colorClass,
  iconColorClass,
}) => {
  return (
    <Card className={cn("overflow-hidden border-none shadow-sm transition-all hover:shadow-md", colorClass)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </CardTitle>
        <div className={cn("rounded-lg p-2 shadow-sm", iconColorClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-gray-900">{value}</div>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
