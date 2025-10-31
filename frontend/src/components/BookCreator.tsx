import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookStore } from '../store.js';
import { useSettingsStore } from '../stores/settingsStore.js';
import { Button } from './ui/Button.js';
import { Input } from './ui/Input.js';
import { Label } from './ui/Label.js';
import { Textarea } from './ui/Textarea.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card.js';
import { Switch } from './ui/Switch.js';
import { Badge } from './ui/Badge.js';
import {
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Loader2,
  Wand2
} from 'lucide-react';
import { JUPYTER_BOOK_FEATURES, type JupyterBookFeature } from '../constants/jupyterFeatures.js';
import axios from 'axios';

interface BookCreatorProps {
  onComplete: () => void;
  onCancel: () => void;
}

type Step = 'method' | 'topic' | 'features' | 'generating';

export default function BookCreator({ onComplete, onCancel }: BookCreatorProps) {
  // Step management
  const [step, setStep] = useState<Step>('method');

  // Method selection
  const [useAI, setUseAI] = useState(true);

  // Manual creation fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');

  // AI generation fields
  const [aiTopic, setAiTopic] = useState('');
  const [numChapters, setNumChapters] = useState(5);
  const [systemPrompt, setSystemPrompt] = useState('');

  // JupyterBook features
  const [features, setFeatures] = useState<JupyterBookFeature[]>(JUPYTER_BOOK_FEATURES);

  // State management
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const setBook = useBookStore((state) => state.setBook);
  const { backendUrl, selectedProvider, apiKeys } = useSettingsStore();

  const defaultBookPrompt = `You are an expert technical writer and educator specializing in creating interactive educational books using Liquid Books format.
Your task is to create comprehensive, well-structured book content with rich Liquid Books features including code blocks, mathematical equations, admonitions, interactive quizzes, and more.
Generate content that is educational, engaging, and makes full use of Liquid Books's capabilities.`;

  const toggleFeature = (featureId: string) => {
    setFeatures(features.map(f =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) {
      setError('Please enter a topic for the AI to generate content about');
      return;
    }

    const apiKey = apiKeys[selectedProvider];
    if (!apiKey) {
      setError(`Please configure your ${selectedProvider} API key in Settings`);
      return;
    }

    setGenerating(true);
    setError('');
    setStep('generating');

    try {
      const response = await axios.post(`${backendUrl}/api/ai/generate-book`, {
        topic: aiTopic,
        system_prompt: systemPrompt || undefined,
        num_chapters: numChapters,
      });

      if (response.data.success && response.data.content) {
        const bookData = JSON.parse(response.data.content);

        const chapters = bookData.chapters.map((ch: any, idx: number) => ({
          id: `chapter-${idx}`,
          title: ch.title,
          content: ch.content,
          order: idx,
          description: ch.description,
        }));

        const newBook = {
          id: `book-${Date.now()}`,
          title: bookData.title,
          author: bookData.author || author || 'AI Generated',
          description: bookData.description,
          chapters,
        };

        setBook(newBook);
        setGenerating(false);
        onComplete();
      } else {
        throw new Error(response.data.error || 'AI generation failed');
      }
    } catch (err: any) {
      console.error('AI generation error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to generate book with AI');
      setGenerating(false);
      setStep('topic');
    }
  };

  const handleManualCreate = () => {
    if (!title || !author) {
      setError('Please fill in title and author');
      return;
    }

    const newBook = {
      id: `book-${Date.now()}`,
      title,
      author,
      description,
      chapters: [
        {
          id: 'intro',
          title: 'Introduction',
          order: 0,
          content: `# Introduction

Welcome to **${title}**!

This is an interactive book built with Liquid Books.

Let's get started!
`,
        },
      ],
    };

    setBook(newBook);
    onComplete();
  };

  const canProceed = () => {
    if (step === 'method') return true;
    if (step === 'topic') {
      if (useAI) {
        return aiTopic.trim().length > 0;
      } else {
        return title.trim().length > 0 && author.trim().length > 0;
      }
    }
    if (step === 'features') return true;
    return false;
  };

  const handleNext = () => {
    if (step === 'method') {
      setStep('topic');
    } else if (step === 'topic') {
      if (useAI) {
        setStep('features');
      } else {
        handleManualCreate();
      }
    } else if (step === 'features') {
      handleAIGenerate();
    }
  };

  const handleBack = () => {
    if (step === 'topic') {
      setStep('method');
    } else if (step === 'features') {
      setStep('topic');
    }
  };

  const stepVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  const renderStep = () => {
    switch (step) {
      case 'method':
        return (
          <motion.div
            key="method"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <BookOpen className="h-16 w-16 mx-auto text-primary" />
              <h2 className="text-3xl font-bold">Create Your Book</h2>
              <p className="text-muted-foreground">
                Choose how you'd like to start
              </p>
            </div>

            <div className="grid gap-4 mt-8">
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  useAI ? 'border-primary border-2 bg-primary/5' : 'hover:border-primary/50'
                }`}
                onClick={() => setUseAI(true)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Sparkles className="h-10 w-10 text-primary" />
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        AI-Powered Generation
                        {useAI && <Badge>Selected</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Let AI create a complete book outline with chapters based on your topic
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  !useAI ? 'border-primary border-2 bg-primary/5' : 'hover:border-primary/50'
                }`}
                onClick={() => setUseAI(false)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <BookOpen className="h-10 w-10 text-primary" />
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        Manual Creation
                        {!useAI && <Badge>Selected</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Start with a basic template and add chapters yourself
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        );

      case 'topic':
        return (
          <motion.div
            key="topic"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {useAI ? 'AI Generation Settings' : 'Book Details'}
              </h2>
              <p className="text-muted-foreground">
                {useAI
                  ? 'Tell the AI what you want to create'
                  : 'Provide basic information about your book'}
              </p>
            </div>

            {useAI ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aiTopic">Topic *</Label>
                  <Input
                    id="aiTopic"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g., Machine Learning Basics, Web Development, Data Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numChapters">Number of Chapters</Label>
                  <Input
                    id="numChapters"
                    type="number"
                    min="1"
                    max="20"
                    value={numChapters}
                    onChange={(e) => setNumChapters(parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 5-10 chapters for best results
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">
                    System Prompt (Optional)
                  </Label>
                  <Textarea
                    id="systemPrompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder={`Customize how the AI generates content...\n\n${defaultBookPrompt}`}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use the default system prompt
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Introduction to Python"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your book"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}
          </motion.div>
        );

      case 'features':
        const basicFeatures = features.filter(f => f.category === 'basic');
        const advancedFeatures = features.filter(f => f.category === 'advanced');
        const layoutFeatures = features.filter(f => f.category === 'layout');
        const mathematicalFeatures = features.filter(f => f.category === 'mathematical');
        const interactiveFeatures = features.filter(f => f.category === 'interactive');

        const renderFeatureSection = (title: string, description: string, featureList: typeof features) => (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {featureList.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );

        return (
          <motion.div
            key="features"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Liquid Books Features</h2>
              <p className="text-muted-foreground">
                Select which features you want the AI to include in your book ({features.filter(f => f.enabled).length} of {features.length} enabled)
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {renderFeatureSection(
                'Basic Features',
                'Essential elements for your book',
                basicFeatures
              )}
              {renderFeatureSection(
                'Advanced Features',
                'Enhanced formatting and content options',
                advancedFeatures
              )}
              {renderFeatureSection(
                'Layout & Design',
                'Sphinx Design components for beautiful layouts',
                layoutFeatures
              )}
              {renderFeatureSection(
                'Mathematical Features',
                'Theorem, proof, and formal mathematical blocks',
                mathematicalFeatures
              )}
              {renderFeatureSection(
                'Interactive Features',
                'Engage readers with dynamic and executable content',
                interactiveFeatures
              )}
            </div>
          </motion.div>
        );

      case 'generating':
        return (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 space-y-6"
          >
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Generating Your Book</h2>
              <p className="text-muted-foreground">
                AI is creating your book outline and chapters...
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Indicator */}
        {step !== 'generating' && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              <div className={`flex items-center gap-2 ${step === 'method' ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === 'method' ? 'border-primary bg-primary text-primary-foreground' :
                  'border-muted-foreground bg-background'
                }`}>
                  {['topic', 'features'].includes(step) ? <Check className="h-5 w-5" /> : '1'}
                </div>
                <span className="text-sm font-medium">Method</span>
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground" />

              <div className={`flex items-center gap-2 ${step === 'topic' ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === 'topic' ? 'border-primary bg-primary text-primary-foreground' :
                  step === 'features' ? 'border-primary bg-background' :
                  'border-muted-foreground bg-background'
                }`}>
                  {step === 'features' ? <Check className="h-5 w-5" /> : '2'}
                </div>
                <span className="text-sm font-medium">Details</span>
              </div>

              {useAI && (
                <>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />

                  <div className={`flex items-center gap-2 ${step === 'features' ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step === 'features' ? 'border-primary bg-primary text-primary-foreground' :
                      'border-muted-foreground bg-background'
                    }`}>
                      3
                    </div>
                    <span className="text-sm font-medium">Features</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step !== 'generating' && (
              <motion.div
                className="flex justify-between gap-4 mt-8 pt-6 border-t"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  onClick={step === 'method' ? onCancel : handleBack}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {step === 'method' ? 'Cancel' : 'Back'}
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  {step === 'features' ? (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate with AI
                    </>
                  ) : step === 'topic' && !useAI ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Create Book
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
