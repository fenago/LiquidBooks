import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Eye, ArrowRight, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion';
import { BOOK_TYPES, TONE_OPTIONS, AUDIENCE_OPTIONS, getToneOptionsForBookType } from '../constants/bookTypes';
import PromptEditor from '../components/PromptEditor';
import FeatureSelector from '../components/FeatureSelector';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

export default function BookPlanner() {
  const navigate = useNavigate();
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [showFeatureSelector, setShowFeatureSelector] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');

  // Form state
  const [topic, setTopic] = useState('');
  const [selectedBookType, setSelectedBookType] = useState('programming_tutorial');
  const [tone, setTone] = useState('conversational');
  const [customTone, setCustomTone] = useState('');
  const [targetAudience, setTargetAudience] = useState('intermediate');
  const [numChapters, setNumChapters] = useState<number | ''>('');
  const [pagesPerChapter, setPagesPerChapter] = useState<number | ''>('');
  const [requirements, setRequirements] = useState('');
  const [customFeatures, setCustomFeatures] = useState<string[]>([]);

  // Prompt preview state
  const [promptPreview, setPromptPreview] = useState<{
    system: string;
    user: string;
    estimated_tokens: number;
    estimated_cost: number;
  } | null>(null);

  const selectedBookTypeData = BOOK_TYPES.find(bt => bt.id === selectedBookType);
  const availableTones = getToneOptionsForBookType(selectedBookType);

  const handlePreviewPrompt = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/preview-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          book_type: selectedBookType,
          tone: tone === 'custom' ? customTone : tone,
          target_audience: targetAudience,
          num_chapters: numChapters || null,
          requirements: requirements || null
        })
      });

      const data = await response.json();
      if (data.success) {
        setPromptPreview({
          system: data.system_prompt,
          user: data.user_prompt,
          estimated_tokens: data.estimated_tokens,
          estimated_cost: data.estimated_cost
        });
        setShowPromptEditor(true);
      }
    } catch (error) {
      console.error('Error previewing prompt:', error);
    }
  };

  const handleGenerateOutline = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStep('Initializing...');

    try {
      // Simulate progress updates for better UX
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 500);

      // Update steps during generation
      setGenerationStep('Analyzing your requirements...');
      setTimeout(() => setGenerationStep('Structuring book outline...'), 1000);
      setTimeout(() => setGenerationStep('Creating chapter descriptions...'), 2000);
      setTimeout(() => setGenerationStep('Finalizing recommendations...'), 3000);

      const response = await fetch(`${API_BASE_URL}/api/ai/generate-outline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          book_type: selectedBookType,
          tone: tone === 'custom' ? customTone : tone,
          target_audience: targetAudience,
          num_chapters: numChapters || null,
          pages_per_chapter: pagesPerChapter || null,
          requirements: requirements || null,
          return_prompts: false
        })
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationStep('Complete!');

      const data = await response.json();
      if (data.success) {
        // Strip markdown code blocks if present
        let outlineStr = data.outline;
        if (typeof outlineStr === 'string') {
          // Remove ```json and ``` wrappers
          outlineStr = outlineStr.replace(/^```json\s*/i, '').replace(/\s*```$/,'').trim();
        }

        // Parse the outline and override recommended_features if custom features are set
        const parsedOutline = JSON.parse(outlineStr);
        if (customFeatures.length > 0) {
          parsedOutline.recommended_features = customFeatures;
        }

        // Navigate to outline review with generated data
        navigate('/create/outline', { state: { outline: parsedOutline } });
      }
    } catch (error) {
      console.error('Error generating outline:', error);
      setGenerationStep('Error occurred');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        setGenerationStep('');
      }, 500);
    }
  };

  const isFormValid = topic.trim().length > 0 && selectedBookType && tone && targetAudience && (tone !== 'custom' || customTone.trim().length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-8 text-center lg:text-left">
            <h1 className="text-5xl font-bold mb-3 flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Plan Your Book
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Let's create an outline for your book. Choose your topic, style, and audience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
              {/* Topic */}
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
                <CardHeader>
                  <CardTitle>Book Topic</CardTitle>
                  <CardDescription>What is your book about?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic or Subject</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Python Web Development with FastAPI"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Book Type Selection */}
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
                <CardHeader>
                  <CardTitle>Book Type</CardTitle>
                  <CardDescription>
                    {selectedBookTypeData ? (
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{selectedBookTypeData.icon}</span>
                        <span className="font-semibold text-foreground">{selectedBookTypeData.name}</span>
                      </span>
                    ) : (
                      'Select the type of book you want to create'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" defaultValue="book-types">
                    <AccordionItem value="book-types">
                      <AccordionTrigger>View All Book Types</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                          {BOOK_TYPES.map((bookType) => (
                            <button
                              key={bookType.id}
                              onClick={() => {
                                setSelectedBookType(bookType.id);
                                // Reset tone if not available for this book type
                                if (!bookType.availableTones.includes(tone)) {
                                  setTone(bookType.availableTones[0]);
                                }
                              }}
                              className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                                selectedBookType === bookType.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <div className="text-3xl mb-2">{bookType.icon}</div>
                              <div className="font-semibold text-sm mb-1">{bookType.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                {bookType.description}
                              </div>
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Tone & Audience */}
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
                <CardHeader>
                  <CardTitle>Writing Style</CardTitle>
                  <CardDescription>Choose the tone and target audience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <select
                      id="tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full p-2 rounded-md border border-border bg-background"
                    >
                      {availableTones.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}{t.recommended ? ' (Recommended)' : ''} - {t.description}
                        </option>
                      ))}
                      <option value="custom">Custom Tone (AI-Assisted)</option>
                    </select>
                    {tone === 'custom' && (
                      <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                        <Label htmlFor="customTone" className="text-sm">Describe Your Custom Tone</Label>
                        <Input
                          id="customTone"
                          value={customTone}
                          onChange={(e) => setCustomTone(e.target.value)}
                          placeholder="e.g., Enthusiastic and beginner-friendly with a touch of humor"
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          The AI will interpret your custom tone description when generating content
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <select
                      id="audience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full p-2 rounded-md border border-border bg-background"
                    >
                      {AUDIENCE_OPTIONS.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label} - {a.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Optional Settings */}
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
                <CardHeader>
                  <CardTitle>Optional Settings</CardTitle>
                  <CardDescription>Customize your book structure (expand to configure)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single">
                    <AccordionItem value="optional-settings">
                      <AccordionTrigger>Configure Optional Settings</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label htmlFor="chapters">Number of Chapters (Optional)</Label>
                            <Input
                              id="chapters"
                              type="number"
                              placeholder={`${selectedBookTypeData?.typicalChapterRange[0]}-${selectedBookTypeData?.typicalChapterRange[1]} (AI will decide if left empty)`}
                              value={numChapters}
                              onChange={(e) => setNumChapters(e.target.value ? parseInt(e.target.value) : '')}
                              min={1}
                              max={50}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pagesPerChapter">Pages Per Chapter (Optional)</Label>
                            <Input
                              id="pagesPerChapter"
                              type="number"
                              placeholder="e.g., 10-20 pages (AI will decide if left empty)"
                              value={pagesPerChapter}
                              onChange={(e) => setPagesPerChapter(e.target.value ? parseInt(e.target.value) : '')}
                              min={1}
                              max={100}
                            />
                            <p className="text-xs text-muted-foreground">
                              Approximately 300 words per page
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="requirements">Special Requirements (Optional)</Label>
                            <Textarea
                              id="requirements"
                              placeholder="Any specific topics to cover, examples to include, or special formatting requirements..."
                              value={requirements}
                              onChange={(e) => setRequirements(e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="space-y-4">
              {/* Selected Book Type Info */}
              {selectedBookTypeData && (
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
                  <CardHeader>
                    <div className="text-4xl mb-2">{selectedBookTypeData.icon}</div>
                    <CardTitle className="text-xl">{selectedBookTypeData.name}</CardTitle>
                    <CardDescription>{selectedBookTypeData.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-1">Typical Length</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedBookTypeData.typicalChapterRange[0]}-{selectedBookTypeData.typicalChapterRange[1]} chapters
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Recommended Features</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedBookTypeData.recommendedFeatures.slice(0, 4).map((feature) => (
                          <span
                            key={feature}
                            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {feature.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {selectedBookTypeData.recommendedFeatures.length > 4 && (
                          <span className="text-xs px-2 py-1 text-muted-foreground">
                            +{selectedBookTypeData.recommendedFeatures.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Jupyter Book Features */}
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Jupyter Book Features</CardTitle>
                  <CardDescription>Customize which features to include</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowFeatureSelector(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {customFeatures.length > 0
                      ? `${customFeatures.length} Custom Features`
                      : selectedBookTypeData
                      ? `${selectedBookTypeData.recommendedFeatures.length} Recommended`
                      : 'Configure Features'}
                  </Button>
                  {customFeatures.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Using custom feature selection
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handlePreviewPrompt}
                    disabled={!isFormValid}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View/Edit Prompt
                  </Button>
                  <div className="space-y-3">
                    <Button
                      onClick={handleGenerateOutline}
                      disabled={!isFormValid || isGenerating}
                      className="w-full glow-primary shadow-lg shadow-primary/25"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Outline
                        </>
                      )}
                    </Button>

                    {isGenerating && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{generationStep}</span>
                          <span>{generationProgress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${generationProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    {promptPreview && !isGenerating && (
                      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                        <div>Est. Tokens: {promptPreview.estimated_tokens}</div>
                        <div>Est. Cost: ${promptPreview.estimated_cost.toFixed(3)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Prompt Editor Modal */}
      {showPromptEditor && promptPreview && (
        <PromptEditor
          systemPrompt={promptPreview.system}
          userPrompt={promptPreview.user}
          estimatedTokens={promptPreview.estimated_tokens}
          estimatedCost={promptPreview.estimated_cost}
          onClose={() => setShowPromptEditor(false)}
          onGenerate={handleGenerateOutline}
        />
      )}

      {/* Feature Selector Modal */}
      {showFeatureSelector && (
        <FeatureSelector
          onClose={() => setShowFeatureSelector(false)}
          onConfirm={(features) => {
            setCustomFeatures(features);
            setShowFeatureSelector(false);
          }}
          initialSelected={
            customFeatures.length > 0
              ? customFeatures
              : selectedBookTypeData?.recommendedFeatures || []
          }
        />
      )}
    </div>
  );
}
