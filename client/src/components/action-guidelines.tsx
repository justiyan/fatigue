import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle, Ban } from "lucide-react";

const actionGuidelines = [
  {
    level: 'Low',
    icon: CheckCircle,
    bgColor: 'bg-fatigue-low',
    hoverColor: 'hover:bg-green-50',
    iconColor: 'text-fatigue-low',
    action: 'Good to go? Continue to monitor fatigue. Note the assessment on HazChat.',
  },
  {
    level: 'Moderate',
    icon: AlertCircle,
    bgColor: 'bg-fatigue-moderate',
    hoverColor: 'hover:bg-yellow-50',
    iconColor: 'text-fatigue-moderate',
    action: 'Discuss with team/crew, decide on appropriate controls. Consider whether high risk tasks should occur. Advise Supervisor if appropriate. Controls may include self and peer monitoring, task rotation, increased breaks, pacing work load. Note the assessment and actions on HazChat.',
  },
  {
    level: 'High',
    icon: XCircle,
    bgColor: 'bg-fatigue-high',
    hoverColor: 'hover:bg-red-50',
    iconColor: 'text-fatigue-high',
    action: 'Stop Work. Discuss controls with crew/team and with Supervisor. High risk tasks should not be performed. Controls may include increased supervision, task re-assignment, buddy check, arrange back-up, transport alternatives may be required. Note the assessment and actions on HazChat.',
  },
  {
    level: 'Extreme',
    icon: Ban,
    bgColor: 'bg-fatigue-extreme',
    hoverColor: 'hover:bg-purple-50',
    iconColor: 'text-fatigue-extreme',
    action: 'Stop Work (or do not commence). Discuss contingency with supervisor. Controls are unlikely to be sufficient. Make arrangements to convey worker home. Continuing with any work requires GM approval. Note the assessment and actions on HazChat.',
  },
];

export function ActionGuidelines() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <AlertTriangle className="text-orange-500 mr-2 h-5 w-5" />
          Important Information
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fatigue Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Required
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {actionGuidelines.map((guideline) => {
                const IconComponent = guideline.icon;
                return (
                  <tr key={guideline.level} className={guideline.hoverColor} data-testid={`guideline-${guideline.level.toLowerCase()}`}>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${guideline.bgColor} text-white`}>
                        <IconComponent className="mr-1 h-4 w-4" />
                        {guideline.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {guideline.level === 'High' || guideline.level === 'Extreme' ? (
                        <>
                          <strong>
                            {guideline.level === 'High' ? 'Stop Work.' : 'Stop Work (or do not commence).'}
                          </strong>{' '}
                          {guideline.action.replace(/^Stop Work\.?\s*(\(or do not commence\)\.?\s*)?/, '')}
                        </>
                      ) : (
                        guideline.action
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
