
'use client';

import { useState, useTransition, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Terminal } from 'lucide-react';
import { generateAudioAction } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AudioPlayer } from './AudioPlayer';
import { Label } from '@/components/ui/label';

const DEEPGRAM_MODELS = [
    { "value": "aura-2-amalthea-en", "label": "Amalthea", "gender": "Female", "accent": "Filipino" },
    { "value": "aura-2-andromeda-en", "label": "Andromeda", "gender": "Female", "accent": "American" },
    { "value": "aura-2-apollo-en", "label": "Apollo", "gender": "Male", "accent": "American" },
    { "value": "aura-2-arcas-en", "label": "Arcas", "gender": "Male", "accent": "American" },
    { "value": "aura-2-aries-en", "label": "Aries", "gender": "Male", "accent": "American" },
    { "value": "aura-2-asteria-en", "label": "Asteria", "gender": "Female", "accent": "American" },
    { "value": "aura-2-athena-en", "label": "Athena", "gender": "Female", "accent": "American" },
    { "value": "aura-2-atlas-en", "label": "Atlas", "gender": "Male", "accent": "American" },
    { "value": "aura-2-aurora-en", "label": "Aurora", "gender": "Female", "accent": "American" },
    { "value": "aura-2-callista-en", "label": "Callista", "gender": "Female", "accent": "American" },
    { "value": "aura-2-cora-en", "label": "Cora", "gender": "Female", "accent": "American" },
    { "value": "aura-2-cordelia-en", "label": "Cordelia", "gender": "Female", "accent": "American" },
    { "value": "aura-2-delia-en", "label": "Delia", "gender": "Female", "accent": "American" },
    { "value": "aura-2-draco-en", "label": "Draco", "gender": "Male", "accent": "British" },
    { "value": "aura-2-electra-en", "label": "Electra", "gender": "Female", "accent": "American" },
    { "value": "aura-2-harmonia-en", "label": "Harmonia", "gender": "Female", "accent": "American" },
    { "value": "aura-2-helena-en", "label": "Helena", "gender": "Female", "accent": "American" },
    { "value": "aura-2-hera-en", "label": "Hera", "gender": "Female", "accent": "American" },
    { "value": "aura-2-hermes-en", "label": "Hermes", "gender": "Male", "accent": "American" },
    { "value": "aura-2-hyperion-en", "label": "Hyperion", "gender": "Male", "accent": "Australian" },
    { "value": "aura-2-iris-en", "label": "Iris", "gender": "Female", "accent": "American" },
    { "value": "aura-2-janus-en", "label": "Janus", "gender": "Female", "accent": "American" },
    { "value": "aura-2-juno-en", "label": "Juno", "gender": "Female", "accent": "American" },
    { "value": "aura-2-jupiter-en", "label": "Jupiter", "gender": "Male", "accent": "American" },
    { "value": "aura-2-luna-en", "label": "Luna", "gender": "Female", "accent": "American" },
    { "value": "aura-2-mars-en", "label": "Mars", "gender": "Male", "accent": "American" },
    { "value": "aura-2-minerva-en", "label": "Minerva", "gender": "Female", "accent": "American" },
    { "value": "aura-2-neptune-en", "label": "Neptune", "gender": "Male", "accent": "American" },
    { "value": "aura-2-odysseus-en", "label": "Odysseus", "gender": "Male", "accent": "American" },
    { "value": "aura-2-ophelia-en", "label": "Ophelia", "gender": "Female", "accent": "American" },
    { "value": "aura-2-orion-en", "label": "Orion", "gender": "Male", "accent": "American" },
    { "value": "aura-2-orpheus-en", "label": "Orpheus", "gender": "Male", "accent": "American" },
    { "value": "aura-2-pandora-en", "label": "Pandora", "gender": "Female", "accent": "British" },
    { "value": "aura-2-phoebe-en", "label": "Phoebe", "gender": "Female", "accent": "American" },
    { "value": "aura-2-pluto-en", "label": "Pluto", "gender": "Male", "accent": "American" },
    { "value": "aura-2-saturn-en", "label": "Saturn", "gender": "Male", "accent": "American" },
    { "value": "aura-2-selene-en", "label": "Selene", "gender": "Female", "accent": "American" },
    { "value": "aura-2-thalia-en", "label": "Thalia", "gender": "Female", "accent": "American" },
    { "value": "aura-2-theia-en", "label": "Theia", "gender": "Female", "accent": "Australian" },
    { "value": "aura-2-vesta-en", "label": "Vesta", "gender": "Female", "accent": "American" },
    { "value": "aura-2-zeus-en", "label": "Zeus", "gender": "Male", "accent": "American" }
];


const GENDERS = ['all', 'Female', 'Male'];

const MAX_CHARS = 1000;

export function VocalizeCard() {
  const [text, setText] = useState('G\'day! I can convert this text into speech with an authentic Australian voice.');
  const [model, setModel] = useState('aura-2-theia-en');
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const [accentFilter, setAccentFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  
  const [isConverting, startConversionTransition] = useTransition();

  const availableAccents = useMemo(() => {
    const accents = DEEPGRAM_MODELS.map(m => m.accent);
    return ['all', ...[...new Set(accents)].sort()];
  }, []);

  const availableModels = useMemo(() => {
    return DEEPGRAM_MODELS.filter(m => 
      (accentFilter === 'all' || m.accent === accentFilter) &&
      (genderFilter === 'all' || m.gender === genderFilter)
    );
  }, [accentFilter, genderFilter]);
  
  useEffect(() => {
    const currentModelDetails = DEEPGRAM_MODELS.find(m => m.value === model);
    if (!currentModelDetails || (accentFilter !== 'all' && currentModelDetails.accent !== accentFilter) || (genderFilter !== 'all' && currentModelDetails.gender !== genderFilter)) {
      if (availableModels.length > 0) {
        setModel(availableModels[0].value);
      }
    }
  }, [accentFilter, genderFilter, availableModels, model]);

  const handleAccentChange = (accent: string) => {
    setAccentFilter(accent);
  };
  
  const handleGenderChange = (gender: string) => {
    setGenderFilter(gender);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };

  const handleConversion = async () => {
    setError('');
    setAudioUrl('');
    startConversionTransition(async () => {
      const result = await generateAudioAction(text, model);
      if (result.error) {
        setError(result.error);
      } else if (result.audioDataUri) {
        setAudioUrl(result.audioDataUri);
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Convert Text to Speech</CardTitle>
        <CardDescription>Enter your text, select a voice, and let AI create natural-sounding audio for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-4">
          <div className="relative">
            <Textarea
              placeholder="Type or paste your text here..."
              value={text}
              onChange={handleTextChange}
              className="min-h-[150px] resize-y pr-20"
              maxLength={MAX_CHARS}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {text.length} / {MAX_CHARS}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="accent-filter-select">Accent</Label>
                <Select value={accentFilter} onValueChange={handleAccentChange}>
                    <SelectTrigger id="accent-filter-select">
                        <SelectValue placeholder="Accent" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableAccents.map((accent) => (
                            <SelectItem key={accent} value={accent}>
                                {accent}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="gender-filter-select">Gender</Label>
                <Select value={genderFilter} onValueChange={handleGenderChange}>
                    <SelectTrigger id="gender-filter-select">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        {GENDERS.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                                {gender}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model-select">Voice Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model-select">
                <SelectValue placeholder="Select a voice model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.length > 0 ? availableModels.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col items-start">
                        <span>{m.label}</span>
                        <span className="text-xs text-muted-foreground">{m.accent}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-4">{m.gender}</span>
                    </div>
                  </SelectItem>
                )) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No models match the selected filters.
                    </div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-grow flex flex-col sm:flex-row gap-2">
              <Button onClick={handleConversion} className="w-full" disabled={isConverting || !text}>
                  {isConverting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Convert to Audio
              </Button>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {audioUrl && <AudioPlayer audioUrl={audioUrl} />}

        </div>
      </CardContent>
      <CardFooter>
        
      </CardFooter>
    </Card>
  );
}
