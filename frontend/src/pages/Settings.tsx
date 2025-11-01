import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Save, RefreshCw, Filter, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card.js';
import { Input } from '../components/ui/Input.js';
import { Label } from '../components/ui/Label.js';
import { Badge } from '../components/ui/Badge.js';
import { useTheme } from '../contexts/ThemeContext.js';
import { useSettingsStore, type AIProvider, type AIModel } from '../stores/settingsStore.js';
import FeatureSelector from '../components/FeatureSelector.js';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    apiKeys,
    selectedProvider,
    selectedModel,
    backendUrl,
    defaultFeatures,
    setApiKey,
    setProvider,
    setModel,
    setBackendUrl,
    setDefaultFeatures,
  } = useSettingsStore();

  const [localKeys, setLocalKeys] = useState(apiKeys);
  const [localBackendUrl, setLocalBackendUrl] = useState(backendUrl);
  const [localDefaultFeatures, setLocalDefaultFeatures] = useState(defaultFeatures);
  const [saved, setSaved] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showFeatureSelector, setShowFeatureSelector] = useState(false);

  // Fetch models when provider changes
  useEffect(() => {
    fetchModels();
  }, [selectedProvider]);

  const fetchModels = async () => {
    setLoadingModels(true);
    try {
      const providerMap: Record<AIProvider, string> = {
        'openai': 'openai',
        'claude': 'anthropic',
        'openrouter': 'openrouter'
      };

      const response = await fetch(
        `${backendUrl}/api/ai/models?provider=${providerMap[selectedProvider]}`
      );
      const data = await response.json();

      if (data.success) {
        setModels(data.models);
      } else {
        console.error('Failed to fetch models:', data.error);
        setModels([]);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleSave = () => {
    Object.entries(localKeys).forEach(([provider, key]) => {
      setApiKey(provider as AIProvider, key);
    });
    setBackendUrl(localBackendUrl);
    setDefaultFeatures(localDefaultFeatures);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const providers: { id: AIProvider; name: string; description: string }[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4o, GPT-5, and other frontier models for chat and reasoning',
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      description: 'Claude 4.5, 4, and 3.x models - best for coding, reasoning, and extended thinking',
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      description: 'Access 100+ models from OpenAI, Anthropic, Meta, Google, and more',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {/* AI Provider Selection */}
          <Card>
            <CardHeader>
              <CardTitle>AI Provider</CardTitle>
              <CardDescription>
                Choose your preferred AI model provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setProvider(provider.id)}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedProvider === provider.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{provider.name}</h3>
                        {selectedProvider === provider.id && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {provider.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Model</CardTitle>
                  <CardDescription>
                    Select the specific model for {selectedProvider === 'claude' ? 'Anthropic' : selectedProvider === 'openai' ? 'OpenAI' : 'OpenRouter'}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchModels}
                  disabled={loadingModels}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingModels ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingModels ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Loading models...
                </div>
              ) : models.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No models available. Check your API key configuration.
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setModel(model.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${
                        selectedModel === model.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm truncate">{model.name}</h3>
                          {selectedModel === model.id && (
                            <Badge variant="default" className="text-xs">Selected</Badge>
                          )}
                        </div>
                        {model.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {model.description}
                          </p>
                        )}
                        {model.context_length && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Context: {model.context_length.toLocaleString()} tokens
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Configure your AI provider API keys (stored locally in browser)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.id} className="space-y-2">
                  <Label htmlFor={`api-key-${provider.id}`}>
                    {provider.name} API Key
                  </Label>
                  <Input
                    id={`api-key-${provider.id}`}
                    type="password"
                    placeholder={`Enter your ${provider.name} API key`}
                    value={localKeys[provider.id]}
                    onChange={(e) =>
                      setLocalKeys({
                        ...localKeys,
                        [provider.id]: e.target.value,
                      })
                    }
                  />
                  {provider.id === 'openai' && (
                    <p className="text-xs text-muted-foreground">
                      Get your API key from{' '}
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        platform.openai.com
                      </a>
                    </p>
                  )}
                  {provider.id === 'claude' && (
                    <p className="text-xs text-muted-foreground">
                      Get your API key from{' '}
                      <a
                        href="https://console.anthropic.com/settings/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        console.anthropic.com
                      </a>
                    </p>
                  )}
                  {provider.id === 'openrouter' && (
                    <p className="text-xs text-muted-foreground">
                      Get your API key from{' '}
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        openrouter.ai
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Backend Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Backend URL</CardTitle>
              <CardDescription>
                Configure the LiquidBooks backend API endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backend-url">Backend URL</Label>
                <Input
                  id="backend-url"
                  type="url"
                  placeholder="http://localhost:8000"
                  value={localBackendUrl}
                  onChange={(e) => setLocalBackendUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  For local development, use http://localhost:8000. For
                  production, use your deployed backend URL (e.g., Railway, Render).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Default Jupyter Book Features */}
          <Card>
            <CardHeader>
              <CardTitle>Default Jupyter Book Features</CardTitle>
              <CardDescription>
                Set default features for new books (can be customized per book)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowFeatureSelector(true)}
                variant="outline"
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                {localDefaultFeatures.length > 0
                  ? `${localDefaultFeatures.length} Default Features Selected`
                  : 'Configure Default Features'}
              </Button>
              {localDefaultFeatures.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  These features will be automatically selected for new books
                </p>
              )}
            </CardContent>
          </Card>

          {/* Publishing Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Settings</CardTitle>
              <CardDescription>
                Configure copyright, ISBNs, front matter, and back matter for your books
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/publishing-settings')}
                variant="outline"
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Configure Publishing Settings
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Set up copyright information, dedication, preface, acknowledgements, and more
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg">
              <Save className="h-4 w-4 mr-2" />
              {saved ? 'Saved!' : 'Save Settings'}
            </Button>
          </div>
        </div>

        {/* Feature Selector Modal */}
        {showFeatureSelector && (
          <FeatureSelector
            onClose={() => setShowFeatureSelector(false)}
            onConfirm={(features) => {
              setLocalDefaultFeatures(features);
              setShowFeatureSelector(false);
            }}
            initialSelected={localDefaultFeatures}
          />
        )}
      </div>
    </div>
  );
}
