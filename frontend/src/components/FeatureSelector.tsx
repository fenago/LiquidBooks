import { useState, useMemo } from 'react';
import { X, Search, Filter, CheckSquare, Square, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import {
  JUPYTER_BOOK_FEATURES,
  FEATURE_CATEGORIES,
  FEATURE_PRESETS,
  type JupyterBookFeature
} from '../constants/jupyterBookFeatures';

interface FeatureSelectorProps {
  onClose: () => void;
  onConfirm: (selectedFeatures: string[]) => void;
  initialSelected?: string[];
}

export default function FeatureSelector({
  onClose,
  onConfirm,
  initialSelected = []
}: FeatureSelectorProps) {
  const [features, setFeatures] = useState<JupyterBookFeature[]>(
    JUPYTER_BOOK_FEATURES.map(f => ({
      ...f,
      enabled: initialSelected.includes(f.id) || f.enabled
    }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Filter features based on search and category
  const filteredFeatures = useMemo(() => {
    let filtered = features;

    if (selectedCategory) {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [features, searchQuery, selectedCategory]);

  // Group features by category
  const featuresByCategory = useMemo(() => {
    const grouped: Record<string, JupyterBookFeature[]> = {};

    filteredFeatures.forEach(feature => {
      if (!grouped[feature.category]) {
        grouped[feature.category] = [];
      }
      grouped[feature.category].push(feature);
    });

    return grouped;
  }, [filteredFeatures]);

  // Count enabled features
  const enabledCount = features.filter(f => f.enabled).length;
  const totalCount = features.length;

  const handleToggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(f =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
    setSelectedPreset(null); // Clear preset when manually toggling
  };

  const handleToggleCategory = (category: string) => {
    const categoryFeatures = features.filter(f => f.category === category);
    const allEnabled = categoryFeatures.every(f => f.enabled);

    setFeatures(prev => prev.map(f =>
      f.category === category ? { ...f, enabled: !allEnabled } : f
    ));
    setSelectedPreset(null);
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = FEATURE_PRESETS[presetKey as keyof typeof FEATURE_PRESETS];
    setFeatures(prev => prev.map(f => ({
      ...f,
      enabled: preset.features.includes(f.id)
    })));
    setSelectedPreset(presetKey);
  };

  const handleSelectAll = () => {
    setFeatures(prev => prev.map(f => ({ ...f, enabled: true })));
    setSelectedPreset('complete');
  };

  const handleDeselectAll = () => {
    setFeatures(prev => prev.map(f => ({ ...f, enabled: false })));
    setSelectedPreset(null);
  };

  const handleConfirm = () => {
    const selectedIds = features.filter(f => f.enabled).map(f => f.id);
    onConfirm(selectedIds);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Jupyter Book Features</CardTitle>
              <CardDescription>
                Select the features you want to include in your book ({enabledCount}/{totalCount} selected)
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Presets */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Quick Presets
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(FEATURE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handleApplyPreset(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedPreset === key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
            >
              Deselect All
            </Button>
          </div>

          {/* Category Filters */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All Categories
            </button>
            {FEATURE_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-6">
          {Object.keys(featuresByCategory).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No features found matching your search.
            </div>
          ) : (
            <div className="space-y-6">
              {FEATURE_CATEGORIES.map(category => {
                const categoryFeatures = featuresByCategory[category.id];
                if (!categoryFeatures || categoryFeatures.length === 0) return null;

                const allEnabled = categoryFeatures.every(f => f.enabled);
                const someEnabled = categoryFeatures.some(f => f.enabled);

                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center justify-between sticky top-0 bg-background py-2 border-b">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <span className="text-sm text-muted-foreground">
                          ({categoryFeatures.filter(f => f.enabled).length}/{categoryFeatures.length})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleCategory(category.id)}
                      >
                        {allEnabled ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryFeatures.map(feature => (
                        <button
                          key={feature.id}
                          onClick={() => handleToggleFeature(feature.id)}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            feature.enabled
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {feature.enabled ? (
                                <CheckSquare className="h-5 w-5 text-primary" />
                              ) : (
                                <Square className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{feature.name}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {feature.description}
                              </div>
                              {feature.sphinxExtension && (
                                <div className="text-xs text-muted-foreground/70 mt-2 font-mono">
                                  {Array.isArray(feature.sphinxExtension)
                                    ? feature.sphinxExtension.join(', ')
                                    : feature.sphinxExtension}
                                </div>
                              )}
                              {feature.mystExtension && (
                                <div className="text-xs text-muted-foreground/70 mt-2 font-mono">
                                  MyST: {feature.mystExtension}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        <div className="border-t p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{enabledCount}</span> features selected
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="min-w-32"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Features
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
