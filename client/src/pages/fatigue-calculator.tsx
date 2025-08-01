import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SleepHistoryForm } from "@/components/sleep-history-form";
import { FatigueResults } from "@/components/fatigue-results";
import { ActionGuidelines } from "@/components/action-guidelines";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Info, HelpCircle, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { FatigueInput, FatigueResult } from "@shared/schema";

export default function FatigueCalculator() {
  const [result, setResult] = useState<FatigueResult | null>(null);
  const { toast } = useToast();

  const calculateMutation = useMutation({
    mutationFn: async (data: FatigueInput): Promise<FatigueResult> => {
      const response = await apiRequest("POST", "/api/calculate-fatigue", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.querySelector('[data-testid="fatigue-results"]');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    },
    onError: () => {
      toast({
        title: "Calculation Error",
        description: "Unable to calculate fatigue score. Please check your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const handleCalculate = (data: FatigueInput) => {
    calculateMutation.mutate(data);
  };

  const handleRecalculate = () => {
    setResult(null);
    const formElement = document.querySelector('[data-testid="fatigue-form"]');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
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
              <p className="text-blue-100 text-sm">Safe Places for Children Safety Tool</p>
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

        {/* Calculator Form */}
        <SleepHistoryForm 
          onCalculate={handleCalculate} 
          isCalculating={calculateMutation.isPending}
        />

        {/* Results Section */}
        {result && (
          <FatigueResults 
            result={result} 
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
                  has been developed for Safe Places for Children employee purposes only and shouldn't be relied upon for any 
                  other purpose/s. No warranty or representation is made as to its accuracy or completeness.
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
            Copyright 2025 Safe Places for Children. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
