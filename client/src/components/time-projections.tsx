import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw } from "lucide-react";
import { getFatigueLevelConfig } from "@/lib/fatigue-calculator";
import type { TimeProjection } from "@shared/schema";

interface TimeProjectionsProps {
  projections: TimeProjection[];
  onRecalculate: () => void;
}

export function TimeProjections({ projections, onRecalculate }: TimeProjectionsProps) {
  // Group projections by level for display
  const groupedProjections = projections.reduce((acc, projection) => {
    if (!acc[projection.level]) {
      acc[projection.level] = [];
    }
    acc[projection.level].push(projection);
    return acc;
  }, {} as Record<string, TimeProjection[]>);

  // Create timeline segments based on consecutive levels
  const timelineSegments: Array<{ level: string; start: string; end: string; width: number }> = [];
  let currentLevel = projections[0]?.level;
  let segmentStart = projections[0]?.time;
  let segmentLength = 1;

  for (let i = 1; i < projections.length; i++) {
    if (projections[i].level === currentLevel) {
      segmentLength++;
    } else {
      // End current segment
      const widthPercent = (segmentLength / projections.length) * 100;
      timelineSegments.push({
        level: currentLevel,
        start: segmentStart,
        end: projections[i - 1].time,
        width: widthPercent,
      });

      // Start new segment
      currentLevel = projections[i].level;
      segmentStart = projections[i].time;
      segmentLength = 1;
    }
  }

  // Add the final segment
  if (segmentLength > 0) {
    const widthPercent = (segmentLength / projections.length) * 100;
    timelineSegments.push({
      level: currentLevel,
      start: segmentStart,
      end: projections[projections.length - 1].time,
      width: widthPercent,
    });
  }

  // Generate time labels (every 2 hours for readability)
  const timeLabels: string[] = [];
  const startHour = parseInt(projections[0]?.time.split(':')[0] || '0');
  for (let i = 0; i < 12; i++) {
    const hour = (startHour + i * 2) % 24;
    timeLabels.push(`${String(hour).padStart(2, '0')}:00`);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6" data-testid="time-projections">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Clock className="text-primary mr-2 h-5 w-5" />
          Your Projected Likelihood of Fatigue
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Timeline visualization */}
        <div className="relative mb-6">
          {/* Timeline bar */}
          <div className="h-16 flex rounded-lg overflow-hidden border border-gray-200">
            {timelineSegments.map((segment, index) => {
              const config = getFatigueLevelConfig(segment.level);
              return (
                <div
                  key={index}
                  className={`${config.bgColor} flex items-center justify-center text-white text-sm font-medium`}
                  style={{ width: `${segment.width}%` }}
                  data-testid={`timeline-segment-${segment.level.toLowerCase()}`}
                >
                  {segment.width > 15 ? segment.level : ''}
                </div>
              );
            })}
          </div>

          {/* Time labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            {timeLabels.map((label, index) => (
              <span key={index} className="text-center" style={{ marginLeft: index === 0 ? '0' : '-20px' }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Low', 'Moderate', 'High', 'Extreme'].map((level) => {
            const config = getFatigueLevelConfig(level);
            const hasData = groupedProjections[level]?.length > 0;
            
            return (
              <div 
                key={level} 
                className={`flex items-center p-3 rounded-lg border ${
                  hasData ? 'border-gray-300' : 'border-gray-200 opacity-50'
                }`}
                data-testid={`legend-${level.toLowerCase()}`}
              >
                <div className={`w-4 h-4 rounded ${config.bgColor} mr-2`}></div>
                <div>
                  <div className="font-medium text-sm">{level}</div>
                  <div className="text-xs text-gray-500">
                    {hasData ? `${groupedProjections[level].length}h` : '0h'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary text */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-3">
            This projection shows how your fatigue level will escalate over the next 24 hours without sleep recovery. 
            Fatigue levels can only increase or stay the same during extended wakefulness - they do not decrease until adequate sleep is obtained.
          </p>
          <div className="text-center">
            <Button 
              onClick={onRecalculate}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-none text-sm uppercase tracking-wide transition-colors duration-200"
              data-testid="button-recalculate-projections"
            >
              <span className="mr-2">◀</span>
              START AGAIN
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}