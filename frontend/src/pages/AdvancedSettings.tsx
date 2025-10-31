import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Zap,
  Info,
  Check,
  X,
  Sparkles,
  BookOpen,
  Brain,
  Heart,
  TrendingUp,
  Search
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import {
  ADVANCED_FEATURES,
  FEATURE_CATEGORIES,
  FEATURE_PRESETS,
  getFeaturesByCategory,
  getFeaturesByTag,
  type AdvancedFeature
} from '../constants/advancedFeatures';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'outline': return <BookOpen className="h-5 w-5" />;
    case 'chapter': return <Brain className="h-5 w-5" />;
    case 'content': return <Heart className="h-5 w-5" />;
    case 'visual': return <Sparkles className="h-5 w-5" />;
    default: return <Settings className="h-5 w-5" />;
  }
};

export default function AdvancedSettings() {
  const [features, setFeatures] = useState<AdvancedFeature[]>(ADVANCED_FEATURES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [featureInputs, setFeatureInputs] = useState<Record<string, string>>({});

  const toggleFeature = (featureId: string) => {
    setFeatures(features.map(f =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const applyPreset = (presetKey: string) => {
    const preset = FEATURE_PRESETS[presetKey as keyof typeof FEATURE_PRESETS];
    setFeatures(features.map(f => ({
      ...f,
      enabled: preset.features.includes(f.id)
    })));
  };

  const getFilteredFeatures = () => {
    let filtered = features;

    if (selectedCategory) {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const filteredFeatures = getFilteredFeatures();
  const enabledCount = features.filter(f => f.enabled).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold flex items-center gap-3">
                  <Zap className="h-10 w-10 text-primary" />
                  Advanced Features
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Enhance your book with proven psychological and persuasion frameworks
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Features Enabled</div>
                <div className="text-3xl font-bold text-primary">{enabledCount}/{features.length}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {FEATURE_CATEGORIES.map((cat) => {
                const catFeatures = getFeaturesByCategory(cat.id);
                const enabledInCategory = catFeatures.filter(f => f.enabled).length;
                return (
                  <Card key={cat.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="font-medium text-sm">{cat.name}</span>
                      </div>
                      <div className="text-2xl font-bold">{enabledInCategory}/{catFeatures.length}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-1 space-y-4">
              {/* Presets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Presets</CardTitle>
                  <CardDescription>Apply feature configurations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(FEATURE_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className="w-full text-left p-3 rounded-lg border-2 border-border hover:border-primary transition-colors"
                    >
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {preset.description}
                      </div>
                      <div className="text-xs text-primary mt-2">
                        {preset.features.length} features
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Categories Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedCategory === null ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">All Features</span>
                      <Badge variant="secondary">{features.length}</Badge>
                    </div>
                  </button>
                  {FEATURE_CATEGORIES.map((cat) => {
                    const count = getFeaturesByCategory(cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left p-2 rounded-lg transition-colors ${
                          selectedCategory === cat.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat.icon}</span>
                            <span className="text-sm font-medium">{cat.name}</span>
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Search */}
              <Card>
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search features..."
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features List */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-3 space-y-4">
              {filteredFeatures.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-muted-foreground">No features found matching your criteria</div>
                  </CardContent>
                </Card>
              ) : (
                filteredFeatures.map((feature) => (
                  <Card key={feature.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{feature.icon}</span>
                            <div>
                              <h3 className="text-lg font-semibold">{feature.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {FEATURE_CATEGORIES.find(c => c.id === feature.category)?.name}
                                </Badge>
                                {feature.enabled && (
                                  <Badge variant="default" className="text-xs">
                                    <Check className="h-3 w-3 mr-1" />
                                    Enabled
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            {feature.description}
                          </p>

                          {expandedFeature === feature.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-4"
                            >
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="text-sm font-medium mb-2">About This Feature</div>
                                <p className="text-sm text-muted-foreground">{feature.longDescription}</p>
                              </div>

                              <div>
                                <div className="text-sm font-medium mb-2">Benefits</div>
                                <ul className="space-y-1">
                                  {feature.benefits.map((benefit, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{benefit}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {feature.tags && (
                                <div>
                                  <div className="text-sm font-medium mb-2">Tags</div>
                                  <div className="flex flex-wrap gap-2">
                                    {feature.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {feature.requiresInput && feature.enabled && (
                                <div>
                                  <div className="text-sm font-medium mb-2">{feature.inputPrompt}</div>
                                  <Textarea
                                    value={featureInputs[feature.id] || ''}
                                    onChange={(e) => setFeatureInputs({
                                      ...featureInputs,
                                      [feature.id]: e.target.value
                                    })}
                                    placeholder="Enter your response here..."
                                    rows={4}
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}

                          <div className="flex items-center gap-2 mt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedFeature(
                                expandedFeature === feature.id ? null : feature.id
                              )}
                            >
                              <Info className="h-4 w-4 mr-2" />
                              {expandedFeature === feature.id ? 'Less Info' : 'More Info'}
                            </Button>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <button
                            onClick={() => toggleFeature(feature.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              feature.enabled ? 'bg-primary' : 'bg-muted'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                feature.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </motion.div>
          </div>

          {/* Save Button */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="mt-8 flex justify-end gap-4">
            <Button variant="outline" size="lg">
              Reset to Defaults
            </Button>
            <Button size="lg">
              <Check className="h-5 w-5 mr-2" />
              Save Configuration
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
