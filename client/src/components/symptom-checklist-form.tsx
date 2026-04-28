import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { symptomChecklistSchema, type SymptomChecklist } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Brain, Activity, Heart, Car, Moon } from "lucide-react";
import { useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SymptomChecklistFormProps {
  onChecklistChange: (data: SymptomChecklist) => void;
  onSetResetFunction: (resetFn: () => void) => void;
}

interface ChecklistCategory {
  title: string;
  icon: React.ReactNode;
  fields: Array<{
    name: keyof SymptomChecklist;
    label: string;
  }>;
}

export function SymptomChecklistForm({ onChecklistChange, onSetResetFunction }: SymptomChecklistFormProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    "alertness", "physical", "mood", "highRisk", "overnight"
  ]);

  const form = useForm<SymptomChecklist>({
    resolver: zodResolver(symptomChecklistSchema),
    defaultValues: {
      strugglingAlert: false,
      troubleConcentrating: false,
      unusualMistakes: false,
      slowResponses: false,
      yawningFrequently: false,
      physicalSymptoms: false,
      hardToStayAwake: false,
      poorCoordination: false,
      moodChanges: false,
      decisionDifficulty: false,
      feelingOverwhelmed: false,
      concernsRaised: false,
      requiredToDrive: false,
      administerMedication: false,
      highBehavioralSupport: false,
      workingAlone: false,
      brokenSleep: false,
      overnightSupport: false,
      overnightIncident: false,
      insufficientRest: false,
    },
  });

  const watchedValues = form.watch();

  // Calculate symptom score
  const calculateSymptomScore = (values: SymptomChecklist): number => {
    let score = 0;

    // Regular symptoms (1 point each)
    const regularSymptoms = [
      'strugglingAlert', 'troubleConcentrating', 'unusualMistakes', 'slowResponses',
      'yawningFrequently', 'physicalSymptoms', 'hardToStayAwake', 'poorCoordination',
      'moodChanges', 'decisionDifficulty', 'feelingOverwhelmed', 'concernsRaised',
      'brokenSleep', 'overnightSupport', 'overnightIncident', 'insufficientRest'
    ] as const;

    // High-risk work (2 points each)
    const highRiskSymptoms = [
      'requiredToDrive', 'administerMedication', 'highBehavioralSupport', 'workingAlone'
    ] as const;

    regularSymptoms.forEach(symptom => {
      if (values[symptom]) score += 1;
    });

    highRiskSymptoms.forEach(symptom => {
      if (values[symptom]) score += 2;
    });

    return score;
  };

  const symptomScore = calculateSymptomScore(watchedValues);

  const getSymptomLevel = (score: number): string => {
    if (score <= 2) return 'Low symptom concern';
    if (score <= 5) return 'Moderate symptom concern';
    if (score <= 8) return 'High symptom concern';
    return 'Extreme symptom concern';
  };

  const getSymptomLevelColor = (level: string): string => {
    if (level.includes('Low')) return 'text-fatigue-low';
    if (level.includes('Moderate')) return 'text-fatigue-moderate';
    if (level.includes('High')) return 'text-fatigue-high';
    return 'text-fatigue-extreme';
  };

  // Expose reset function to parent component
  useEffect(() => {
    const resetForm = () => {
      form.reset();
    };
    onSetResetFunction(resetForm);
  }, [form, onSetResetFunction]);

  // Call parent whenever values change
  useEffect(() => {
    onChecklistChange(watchedValues);
  }, [watchedValues, onChecklistChange]);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const categories: ChecklistCategory[] = [
    {
      title: "Alertness and concentration",
      icon: <Brain className="text-primary h-4 w-4" />,
      fields: [
        { name: "strugglingAlert", label: "Is the person struggling to stay alert or keep their eyes open?" },
        { name: "troubleConcentrating", label: "Are they having trouble concentrating or following the conversation?" },
        { name: "unusualMistakes", label: "Are they making unusual mistakes or forgetting simple tasks?" },
        { name: "slowResponses", label: "Are they responding more slowly than normal?" },
      ],
    },
    {
      title: "Physical signs",
      icon: <Activity className="text-orange-500 h-4 w-4" />,
      fields: [
        { name: "yawningFrequently", label: "Are they yawning frequently or appearing visibly tired?" },
        { name: "physicalSymptoms", label: "Are they reporting headaches, heavy eyes, dizziness, or feeling physically drained?" },
        { name: "hardToStayAwake", label: "Are they finding it hard to stay awake while sitting still?" },
        { name: "poorCoordination", label: "Are they showing signs of poor coordination or slowed movement?" },
      ],
    },
    {
      title: "Mood and behaviour",
      icon: <Heart className="text-red-500 h-4 w-4" />,
      fields: [
        { name: "moodChanges", label: "Are they more irritable, emotional, withdrawn, or unusually flat?" },
        { name: "decisionDifficulty", label: "Are they finding it harder than normal to make decisions?" },
        { name: "feelingOverwhelmed", label: "Are they reporting feeling overwhelmed or unable to cope?" },
        { name: "concernsRaised", label: "Has anyone else raised concerns about their presentation or behaviour?" },
      ],
    },
    {
      title: "High-risk work",
      icon: <Car className="text-yellow-600 h-4 w-4" />,
      fields: [
        { name: "requiredToDrive", label: "Are they required to drive as part of the shift?" },
        { name: "administerMedication", label: "Are they required to administer medication, including psychotropic medication?" },
        { name: "highBehavioralSupport", label: "Are they supporting a young person with high behavioural intensity or recent incidents?" },
        { name: "workingAlone", label: "Are they working alone or in a setting where reduced alertness could increase risk?" },
      ],
    },
    {
      title: "Overnight disruption",
      icon: <Moon className="text-purple-500 h-4 w-4" />,
      fields: [
        { name: "brokenSleep", label: "Did they have broken sleep during a sleepover shift?" },
        { name: "overnightSupport", label: "Were they required to actively support a young person between 10pm and 6am?" },
        { name: "overnightIncident", label: "Was there an overnight incident, hospital presentation, or extended period awake?" },
        { name: "insufficientRest", label: "Do they feel they had enough meaningful rest before continuing work?" },
      ],
    },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <AlertCircle className="text-primary mr-2 h-5 w-5" />
          Fatigue Symptoms Checklist
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Use these questions to guide a conversation when fatigue is reported or suspected.
          This does not replace professional judgement, but helps identify warning signs that may increase fatigue risk.
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form className="space-y-4" data-testid="symptom-checklist-form">
            {categories.map((category, categoryIndex) => {
              const sectionKey = category.title.toLowerCase().replace(/\s+/g, '');
              const isOpen = openSections.includes(sectionKey);

              return (
                <Collapsible
                  key={categoryIndex}
                  open={isOpen}
                  onOpenChange={() => toggleSection(sectionKey)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <h3 className="font-medium text-left">{category.title}</h3>
                          {category.title === "High-risk work" && (
                            <span className="text-xs text-yellow-600 font-medium">(2 points each)</span>
                          )}
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3 border-t">
                        {category.fields.map((field) => (
                          <FormField
                            key={field.name}
                            control={form.control}
                            name={field.name}
                            render={({ field: formField }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={formField.value}
                                    onCheckedChange={formField.onChange}
                                    data-testid={`checkbox-${field.name}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer select-none">
                                  {field.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Symptom flags:</span>
                <span className="text-lg font-bold text-primary" data-testid="symptom-score">
                  {symptomScore}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-sm font-medium text-gray-700">Risk level:</span>
                <span
                  className={`ml-2 text-sm font-bold ${getSymptomLevelColor(getSymptomLevel(symptomScore))}`}
                  data-testid="symptom-level"
                >
                  {getSymptomLevel(symptomScore)}
                </span>
              </div>
            </div>

            {/* Interpretation text */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                {symptomScore <= 2 &&
                  "No significant fatigue symptoms have been identified through the checklist. Continue to consider sleep history, hours worked and the nature of the duties."
                }
                {symptomScore >= 3 && symptomScore <= 5 &&
                  "Some fatigue warning signs are present. Consider whether additional controls are needed, particularly if the person is performing high-risk work."
                }
                {symptomScore >= 6 && symptomScore <= 8 &&
                  "Multiple fatigue warning signs are present. The person may not be fit to safely perform high-risk work without additional controls or support."
                }
                {symptomScore >= 9 &&
                  "Significant fatigue warning signs are present. Escalation is recommended and the person should not perform high-risk work unless risk has been reviewed and appropriate controls are in place."
                }
              </p>

              {/* High-risk work warning */}
              {(watchedValues.requiredToDrive || watchedValues.administerMedication ||
                watchedValues.highBehavioralSupport || watchedValues.workingAlone) &&
               symptomScore >= 3 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ High-risk duties identified with fatigue symptoms present. Review required before proceeding with these duties.
                  </p>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}