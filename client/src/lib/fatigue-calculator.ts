export function generateTimeOptions() {
  const times: { value: string; display: string }[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
      const displayTime = formatTimeDisplay(hour, minute);
      times.push({ value: timeString, display: displayTime });
    }
  }
  
  return times;
}

function formatTimeDisplay(hour: number, minute: number): string {
  const minuteStr = String(minute).padStart(2, '0');
  
  if (hour === 0) {
    return `12:${minuteStr} AM`;
  } else if (hour < 12) {
    return `${hour}:${minuteStr} AM`;
  } else if (hour === 12) {
    return `12:${minuteStr} PM`;
  } else {
    return `${hour - 12}:${minuteStr} PM`;
  }
}

export function getFatigueLevelConfig(level: string) {
  switch (level) {
    case 'Low':
      return {
        color: 'text-fatigue-low',
        bgColor: 'bg-fatigue-low',
        icon: 'check-circle',
      };
    case 'Moderate':
      return {
        color: 'text-fatigue-moderate',
        bgColor: 'bg-fatigue-moderate',
        icon: 'exclamation-circle',
      };
    case 'High':
      return {
        color: 'text-fatigue-high',
        bgColor: 'bg-fatigue-high',
        icon: 'times-circle',
      };
    case 'Extreme':
      return {
        color: 'text-fatigue-extreme',
        bgColor: 'bg-fatigue-extreme',
        icon: 'ban',
      };
    default:
      return {
        color: 'text-gray-500',
        bgColor: 'bg-gray-500',
        icon: 'question-circle',
      };
  }
}
