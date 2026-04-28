I need you to modify my existing fatigue calculator web app.

Goal:
Add a new “Fatigue Symptoms Checklist” section above the existing “Sleep History” section. This checklist should help an on-call person or manager ask structured questions to assess whether a staff member may be at risk of fatigue before relying only on sleep/hour calculations.

Please inspect the existing app structure first and follow the current coding style, layout, components, styling, validation patterns and state management already used in the project.

New section placement:
- Add this new section directly above the current “Sleep History” section.
- Keep the current Sleep History section and all existing calculator logic intact.
- Do not break any existing calculations, scoring, forms, responsive design or deployment behaviour.

Section title:
“Fatigue Symptoms Checklist”

Short helper text:
“Use these questions to guide a conversation when fatigue is reported or suspected. This does not replace professional judgement, but helps identify warning signs that may increase fatigue risk.”

Checklist requirements:
Create a checklist of symptom-based questions grouped into clear categories. Each question should have a Yes/No response, ideally using the same input style already used in the app.

Suggested categories and questions:

1. Alertness and concentration
- Is the person struggling to stay alert or keep their eyes open?
- Are they having trouble concentrating or following the conversation?
- Are they making unusual mistakes or forgetting simple tasks?
- Are they responding more slowly than normal?

2. Physical signs
- Are they yawning frequently or appearing visibly tired?
- Are they reporting headaches, heavy eyes, dizziness, or feeling physically drained?
- Are they finding it hard to stay awake while sitting still?
- Are they showing signs of poor coordination or slowed movement?

3. Mood and behaviour
- Are they more irritable, emotional, withdrawn, or unusually flat?
- Are they finding it harder than normal to make decisions?
- Are they reporting feeling overwhelmed or unable to cope?
- Has anyone else raised concerns about their presentation or behaviour?

4. High-risk work
- Are they required to drive as part of the shift?
- Are they required to administer medication, including psychotropic medication?
- Are they supporting a young person with high behavioural intensity or recent incidents?
- Are they working alone or in a setting where reduced alertness could increase risk?

5. Overnight disruption
- Did they have broken sleep during a sleepover shift?
- Were they required to actively support a young person between 10pm and 6am?
- Was there an overnight incident, hospital presentation, or extended period awake?
- Do they feel they had enough meaningful rest before continuing work?

Scoring / risk logic:
Add a simple symptom checklist risk indicator. This should be separate from the existing sleep history calculation, but can contribute to the overall recommendation if the app already has a final risk summary.

Suggested scoring:
- Each “Yes” answer = 1 symptom/risk flag.
- High-risk work “Yes” answers should be treated as stronger risk indicators. If possible, count each high-risk work “Yes” answer as 2 points.
- Display a checklist score such as: “Symptom flags: X”
- Display a symptom risk level:
  - 0–2 points: Low symptom concern
  - 3–5 points: Moderate symptom concern
  - 6–8 points: High symptom concern
  - 9+ points: Extreme symptom concern

Suggested interpretation text:
Low:
“No significant fatigue symptoms have been identified through the checklist. Continue to consider sleep history, hours worked and the nature of the duties.”

Moderate:
“Some fatigue warning signs are present. Consider whether additional controls are needed, particularly if the person is performing high-risk work.”

High:
“Multiple fatigue warning signs are present. The person may not be fit to safely perform high-risk work without additional controls or support.”

Extreme:
“Significant fatigue warning signs are present. Escalation is recommended and the person should not perform high-risk work unless risk has been reviewed and appropriate controls are in place.”

Interaction with existing calculator:
- Keep the symptom checklist visibly separate from the existing Sleep History calculator.
- If the current app has an overall result or recommendation, update it so the symptoms checklist can influence the recommendation.
- If symptom risk is High or Extreme, make sure the final recommendation clearly flags this, even if the sleep history score is lower.
- If any high-risk work item is selected and the symptom risk is Moderate or above, show a clear warning that high-risk duties may need to be reviewed.

UI/UX requirements:
- Keep it simple and clean.
- Make it easy for on-call to use during a phone conversation.
- Use collapsible groups or cards if that suits the existing design.
- Provide a “Clear checklist” or reset option for just this checklist.
- Make the section mobile-friendly.
- Use plain English.
- Avoid making it feel like a medical diagnosis. This is a workplace risk conversation guide.

Accessibility:
- Ensure all Yes/No controls are keyboard accessible.
- Ensure labels are properly associated with inputs.
- Use accessible colour contrast.
- Do not rely on colour alone for risk level.

Data/state requirements:
- Store checklist answers in component state.
- Calculate the checklist score dynamically.
- Show the symptom risk level dynamically.
- Make sure resetting the full calculator also resets the checklist.
- If the app currently saves or exports results, include the symptom checklist summary in that output.

Testing:
Please run the existing tests if available.
Add or update tests for:
- Checklist renders above Sleep History.
- Yes answers increase the symptom score correctly.
- High-risk work questions count as 2 points if implemented.
- Risk levels calculate correctly.
- Reset clears checklist answers.
- Existing sleep calculator behaviour still works.

Acceptance criteria:
- A new “Fatigue Symptoms Checklist” appears above “Sleep History”.
- The checklist contains grouped Yes/No questions.
- A symptom flag score and risk level are shown.
- Risk level changes dynamically as questions are answered.
- High and Extreme symptom risk levels clearly flag escalation / review.
- High-risk duties are called out if symptoms are present.
- Existing fatigue calculator functionality remains unchanged.
- The app remains responsive and deployable.

Before making changes:
1. Inspect the current project structure.
2. Identify where the Sleep History section is rendered.
3. Identify where the final fatigue recommendation is calculated.
4. Make the smallest clean change that fits the existing architecture.
5. Explain what files were changed and what logic was added.