import { Lightbulb } from 'lucide-react';

interface SuggestionsListProps {
  suggestions: string[];
}

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-accent/20 animate-in fade-in-50 duration-500">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-accent-foreground" />
        <h3 className="font-semibold text-accent-foreground">AI Suggestions for Improvement</h3>
      </div>
      <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
}
