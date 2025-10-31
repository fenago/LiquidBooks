import { Info } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore.js';

export default function Footer() {
  const { selectedProvider, selectedModel } = useSettingsStore();
  const version = '0.16.0';

  const providerNames = {
    openai: 'OpenAI',
    claude: 'Anthropic',
    openrouter: 'OpenRouter'
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Info className="h-3 w-3" />
              <span className="font-medium">v{version}</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/70">Provider:</span>
              <span className="font-medium text-foreground">{providerNames[selectedProvider]}</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/70">Model:</span>
              <span className="font-medium text-foreground truncate max-w-[200px]" title={selectedModel}>
                {selectedModel}
              </span>
            </div>
          </div>
          <div className="text-muted-foreground/70">
            LiquidBooks • Open Source • Provider Agnostic
          </div>
        </div>
      </div>
    </footer>
  );
}
