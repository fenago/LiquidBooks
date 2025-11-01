import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIProvider = 'openai' | 'claude' | 'openrouter';

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: any;
}

interface SettingsState {
  apiKeys: {
    openai: string;
    claude: string;
    openrouter: string;
  };
  selectedProvider: AIProvider;
  selectedModel: string;
  backendUrl: string;
  defaultFeatures: string[];
  setApiKey: (provider: AIProvider, key: string) => void;
  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  setBackendUrl: (url: string) => void;
  setDefaultFeatures: (features: string[]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKeys: {
        openai: '',
        claude: '',
        openrouter: '',
      },
      selectedProvider: 'claude',
      selectedModel: 'claude-sonnet-4-5-20250929',
      backendUrl: 'http://localhost:8000',
      defaultFeatures: [],
      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key },
        })),
      setProvider: (provider) => set({ selectedProvider: provider }),
      setModel: (model) => set({ selectedModel: model }),
      setBackendUrl: (url) => set({ backendUrl: url }),
      setDefaultFeatures: (features) => set({ defaultFeatures: features }),
    }),
    {
      name: 'liquidbooks-settings',
    }
  )
);
