import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { SleepHistoryForm } from "@/components/sleep-history-form";
import { SymptomChecklistForm } from "@/components/symptom-checklist-form";
import { FatigueResults } from "@/components/fatigue-results";
import { ActionGuidelines } from "@/components/action-guidelines";
import { TimeProjections } from "@/components/time-projections";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Info, HelpCircle, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FatigueInput, FatigueResult, SymptomChecklist } from "@shared/schema";

export default function FatigueCalculator() {
  const [result, setResult] = useState<FatigueResult | null>(null);
  const [symptomChecklist, setSymptomChecklist] = useState<SymptomChecklist | null>(null);
  const { toast } = useToast();
  const formResetRef = useRef<() => void>();
  const checklistResetRef = useRef<() => void>();
  const [shouldScrollToResults, setShouldScrollToResults] = useState(false);

  const calculateMutation = useMutation({
    mutationFn: async (data: FatigueInput): Promise<FatigueResult> => {
      // Add symptom checklist to the calculation request if available
      const requestData = {
        ...data,
        symptomChecklist: symptomChecklist || undefined,
      };
      const response = await apiRequest("POST", "/api/calculate-fatigue", requestData);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      
      // Only scroll to results if explicitly requested (manual submission or first auto-calc)
      if (shouldScrollToResults) {
        setTimeout(() => {
          const resultsElement = document.querySelector('[data-testid="fatigue-results"]');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        setShouldScrollToResults(false); // Reset the flag
      }
    },
    onError: (error) => {
      console.error("Calculation failed:", error);
      console.error("Error message:", error.message);
      toast({
        title: "Calculation Error",
        description: "Unable to calculate fatigue score. Please check your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const handleCalculate = (data: FatigueInput, shouldScroll: boolean = false) => {
    setShouldScrollToResults(shouldScroll);
    calculateMutation.mutate(data);
  };

  const handleRecalculate = () => {
    setResult(null);
    setSymptomChecklist(null);
    // Reset both forms
    if (formResetRef.current) {
      formResetRef.current();
    }
    if (checklistResetRef.current) {
      checklistResetRef.current();
    }
    // Scroll to top
    setTimeout(() => {
      const checklistElement = document.querySelector('[data-testid="symptom-checklist-form"]');
      if (checklistElement) {
        checklistElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleChecklistChange = (checklist: SymptomChecklist) => {
    setSymptomChecklist(checklist);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Calculator className="text-2xl h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Fatigue Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Introduction Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Info className="text-primary text-xl mt-1 h-5 w-5" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">About This Calculator</h2>
                <p className="text-gray-700">
                  The fatigue calculator is designed to help keep you safe. Find out your likelihood of being fatigued in three easy steps.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptom Checklist */}
        <SymptomChecklistForm
          onChecklistChange={handleChecklistChange}
          onSetResetFunction={(resetFn) => { checklistResetRef.current = resetFn; }}
        />

        {/* Calculator Form */}
        <SleepHistoryForm 
          onCalculate={handleCalculate} 
          isCalculating={calculateMutation.isPending}
          onSetResetFunction={(resetFn) => { formResetRef.current = resetFn; }}
          hasResults={!!result}
        />

        {/* Results Section */}
        {result && (
          <>
            {/* Combined Risk Alert if symptoms are high/extreme */}
            {result.symptomResult && (result.symptomResult.symptomLevel === 'High' || result.symptomResult.symptomLevel === 'Extreme') && (
              <Card className="bg-red-50 border border-red-300">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="text-red-600 text-xl mt-1 h-5 w-5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Combined Risk Assessment</h4>
                      <p className="text-sm text-gray-700">
                        {result.symptomResult.symptomLevel === 'Extreme'
                          ? "Critical fatigue warning: Both symptom assessment and sleep history indicate extreme fatigue risk. Immediate escalation required. Do not proceed with high-risk work."
                          : result.symptomResult.hasHighRiskWork
                          ? "High fatigue warning: Multiple fatigue symptoms detected with high-risk work identified. Review controls before proceeding."
                          : "High fatigue warning: Multiple fatigue symptoms detected. Additional controls may be required before proceeding with work."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <FatigueResults
              result={result}
              onRecalculate={handleRecalculate}
            />
          </>
        )}

        {/* Time Projections */}
        {result && (
          <TimeProjections 
            projections={result.projections} 
            onRecalculate={handleRecalculate}
          />
        )}

        {/* Action Guidelines */}
        <ActionGuidelines />

        {/* Contact Information */}
        <Card className="bg-blue-50 border border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <HelpCircle className="text-primary text-xl mt-1 h-5 w-5" />
              <div>
                <p className="text-sm text-gray-700">
                  Questions about the calculator?{' '}
                  <a 
                    href="mailto:iyanbarry@gmail.com" 
                    className="text-primary hover:text-primary-dark font-medium underline"
                    data-testid="link-contact-email"
                  >
                    Email us
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-yellow-50 border border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-yellow-600 text-xl mt-1 h-5 w-5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Disclaimer</h4>
                <p className="text-sm text-gray-700">
                  The information and data contained on this page including but not limited to the fatigue calculator
                  is provided for informational purposes only and shouldn't be relied upon for any
                  critical safety decisions. No warranty or representation is made as to its accuracy or completeness.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-400">
            Copyright 2025 Iyan Barry. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
