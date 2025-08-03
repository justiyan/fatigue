import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fatigueInputSchema, type FatigueInput } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Sun, Briefcase, Calculator } from "lucide-react";
import { generateTimeOptions } from "@/lib/fatigue-calculator";
import { useEffect } from "react";

interface SleepHistoryFormProps {
  onCalculate: (data: FatigueInput, shouldScroll?: boolean) => void;
  isCalculating: boolean;
  onSetResetFunction: (resetFn: () => void) => void;
  hasResults: boolean;
}

export function SleepHistoryForm({ onCalculate, isCalculating, onSetResetFunction, hasResults }: SleepHistoryFormProps) {
  const timeOptions = generateTimeOptions();
  
  const form = useForm<FatigueInput>({
    resolver: zodResolver(fatigueInputSchema),
    defaultValues: {
      sleepLast24: 0,
      sleepPrevious24: 0,
      wakeTime: "",
      workStartTime: "",
    },
  });

  const watchedValues = form.watch();
  const totalSleep48 = (watchedValues.sleepLast24 || 0) + (watchedValues.sleepPrevious24 || 0);

  // Expose reset function to parent component
  useEffect(() => {
    const resetForm = () => {
      form.reset({
        sleepLast24: 0,
        sleepPrevious24: 0,
        wakeTime: "",
        workStartTime: "",
      });
    };
    onSetResetFunction(resetForm);
  }, [form, onSetResetFunction]);

  // Removed auto-calculation to prevent scrolling issues
  // Users must now click the CALCULATE button manually

  const onSubmit = (data: FatigueInput) => {
    // Manual button click should always scroll to results
    onCalculate(data, true);
  };

  const generateHourOptions = () => {
    const options = [];
    for (let i = 0; i <= 12; i++) {
      options.push({ value: i.toString(), label: `${i} hour${i !== 1 ? 's' : ''}` });
    }
    return options;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Bed className="text-primary mr-2 h-5 w-5" />
          Sleep History
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="fatigue-form">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sleepLast24"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep in the 24 hours before starting work</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      data-testid="select-sleep-last-24"
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select hours..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {generateHourOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sleepPrevious24"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep in the previous 24 hours (before that)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      data-testid="select-sleep-previous-24"
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select hours..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {generateHourOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total sleep in the last 48 hours:</span>
                <span className="text-lg font-bold text-primary" data-testid="total-sleep-48">
                  {totalSleep48} hours
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="wakeTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Sun className="text-orange-500 mr-1 h-4 w-4" />
                      What time did you wake up today?
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} data-testid="select-wake-time">
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.display}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workStartTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Briefcase className="text-primary mr-1 h-4 w-4" />
                      What time do you start work?
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} data-testid="select-work-start-time">
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.display}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-none text-sm uppercase tracking-wide transition-colors duration-200"
                disabled={isCalculating}
                data-testid="button-calculate"
              >
                {isCalculating ? 'Calculating...' : 'CALCULATE'}
                <span className="ml-2">▶</span>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
