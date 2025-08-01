import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, RotateCcw } from "lucide-react";
import { getFatigueLevelConfig } from "@/lib/fatigue-calculator";
import type { FatigueResult } from "@shared/schema";

interface FatigueResultsProps {
  result: FatigueResult;
  onRecalculate: () => void;
}

export function FatigueResults({ result, onRecalculate }: FatigueResultsProps) {
  const { score, level } = result;
  const config = getFatigueLevelConfig(level);

  const levels = [
    { name: 'Low', range: '1-3', active: level === 'Low' },
    { name: 'Moderate', range: '4-6', active: level === 'Moderate' },
    { name: 'High', range: '7-8', active: level === 'High' },
    { name: 'Extreme', range: '9-10', active: level === 'Extreme' },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto" data-testid="fatigue-results">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <BarChart3 className="text-primary mr-2 h-5 w-5" />
          Your Current Likelihood of Fatigue
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${config.bgColor}`}>
            <span className="text-2xl font-bold text-white" data-testid="fatigue-score">
              {score}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Fatigue Level:</p>
            <p className={`text-2xl font-bold ${config.color}`} data-testid="fatigue-level">
              {level}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {levels.map((levelInfo) => {
            const levelConfig = getFatigueLevelConfig(levelInfo.name);
            return (
              <div key={levelInfo.name} className="text-center">
                <div 
                  className={`h-8 rounded-t-lg flex items-center justify-center ${
                    levelInfo.active ? levelConfig.bgColor : 'bg-gray-200'
                  }`}
                  data-testid={`indicator-${levelInfo.name.toLowerCase()}`}
                >
                  <span className={`text-xs font-medium ${
                    levelInfo.active ? 'text-white' : 'text-gray-500'
                  }`}>
                    {levelInfo.name}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">{levelInfo.range}</div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            onClick={onRecalculate}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-none text-sm uppercase tracking-wide transition-colors duration-200"
            data-testid="button-recalculate"
          >
            <span className="mr-2">◀</span>
            START AGAIN
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
