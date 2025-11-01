import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  Edit3,
  Eye,
  Check,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Settings
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import PromptEditor from '../components/PromptEditor';
import FeatureSelector from '../components/FeatureSelector';
import ReactMarkdown from 'react-markdown';
import { CHAPTER_TEMPLATES, getTemplate } from '../constants/chapterTemplates';

const API_BASE_URL = 'http://localhost:8000';

interface ChapterOutline {
  chapter_number: number;
  title: string;
  description: string;
  learning_objectives: string[];
  suggested_components: string[];
  connection_to_previous: string | null;
  connection_to_next: string | null;
  estimated_words: number;
}

interface BookOutline {
  book: {
    title: string;
    description: string;
    author: string;
    target_audience: string;
    theme: string;
    book_type: string;
    tone: string;
  };
  chapters: ChapterOutline[];
  recommended_features: string[];
  structure_explanation: string;
  total_estimated_words: number;
  estimated_pages: number;
}

interface ChapterContent {
  chapter_number: number;
  content: string;
  status: 'not_started' | 'generating' | 'draft' | 'complete';
  features?: string[]; // Per-chapter Jupyter Book features
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

export default function ChapterBuilder() {
  const location = useLocation();
  const navigate = useNavigate();

  const [outline, setOutline] = useState<BookOutline | null>(null);
  const [chapterTemplate, setChapterTemplate] = useState<string>('standard');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [chapterContents, setChapterContents] = useState<ChapterContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [customWordCounts, setCustomWordCounts] = useState<Record<number, number>>({});
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [showFeatureSelector, setShowFeatureSelector] = useState(false);

  useEffect(() => {
    const outlineData = location.state?.outline;
    const templateData = location.state?.chapterTemplate;

    if (outlineData) {
      setOutline(outlineData);
      setChapterTemplate(templateData || 'standard');
      setSelectedFeatures(outlineData.recommended_features || []);

      // Initialize chapter contents
      const contents: ChapterContent[] = outlineData.chapters.map((ch: ChapterOutline) => ({
        chapter_number: ch.chapter_number,
        content: '',
        status: 'not_started' as const,
        features: outlineData.recommended_features || [] // Initialize with book's recommended features
      }));
      setChapterContents(contents);
    } else {
      navigate('/create/plan');
    }
  }, [location, navigate]);

  if (!outline) {
    return null;
  }

  const currentChapter = outline.chapters[currentChapterIndex];
  const currentContent = chapterContents[currentChapterIndex];
  const template = getTemplate(chapterTemplate);

  const handleGenerateChapter = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStep('Initializing...');

    // Update status to generating
    const newContents = [...chapterContents];
    newContents[currentChapterIndex].status = 'generating';
    setChapterContents(newContents);

    try {
      // Simulate progress updates for better UX
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev < 90) return prev + 8;
          return prev;
        });
      }, 600);

      // Update steps during generation
      setGenerationStep('Building chapter context...');
      setTimeout(() => setGenerationStep('Writing introduction...'), 1200);
      setTimeout(() => setGenerationStep('Creating main content...'), 2400);
      setTimeout(() => setGenerationStep('Adding examples and code blocks...'), 4000);
      setTimeout(() => setGenerationStep('Finalizing chapter...'), 5500);

      // Build comprehensive context for AI
      const contextPayload = {
        // Book context
        book_title: outline.book.title,
        book_description: outline.book.description,
        book_type: outline.book.book_type,
        tone: outline.book.tone,
        target_audience: outline.book.target_audience,

        // Chapter context
        chapter_number: currentChapter.chapter_number,
        chapter_title: currentChapter.title,
        chapter_description: currentChapter.description,
        learning_objectives: currentChapter.learning_objectives,
        suggested_components: currentChapter.suggested_components,
        estimated_words: customWordCounts[currentChapterIndex] || currentChapter.estimated_words,

        // Template context
        chapter_template: chapterTemplate,
        template_structure: template?.structure || [],

        // Features context - use per-chapter features
        enabled_features: currentContent.features || selectedFeatures,

        // Previous chapter context for continuity
        previous_chapter_title: currentChapterIndex > 0
          ? outline.chapters[currentChapterIndex - 1].title
          : null,
        connection_to_previous: currentChapter.connection_to_previous,

        // Next chapter context for foreshadowing
        next_chapter_title: currentChapterIndex < outline.chapters.length - 1
          ? outline.chapters[currentChapterIndex + 1].title
          : null,
        connection_to_next: currentChapter.connection_to_next,

        // User instructions
        additional_instructions: additionalInstructions || null
      };

      const response = await fetch(`${API_BASE_URL}/api/ai/generate-chapter-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contextPayload)
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationStep('Complete!');

      const data = await response.json();

      if (data.success) {
        // Update chapter content while preserving features
        const updatedContents = [...chapterContents];
        updatedContents[currentChapterIndex] = {
          chapter_number: currentChapter.chapter_number,
          content: data.content,
          status: 'draft',
          features: updatedContents[currentChapterIndex].features
        };
        setChapterContents(updatedContents);
        setViewMode('preview');
      }
    } catch (error) {
      console.error('Error generating chapter:', error);
      setGenerationStep('Error occurred');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        setGenerationStep('');
      }, 500);
    }
  };

  const handleMarkComplete = () => {
    const newContents = [...chapterContents];
    newContents[currentChapterIndex].status = 'complete';
    setChapterContents(newContents);

    // Move to next chapter if available
    if (currentChapterIndex < outline.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setAdditionalInstructions('');
      setViewMode('edit');
    }
  };

  const handleContentChange = (newContent: string) => {
    const newContents = [...chapterContents];
    newContents[currentChapterIndex].content = newContent;
    newContents[currentChapterIndex].status = 'draft';
    setChapterContents(newContents);
  };

  // Build prompts for the current chapter
  const buildChapterPrompts = () => {
    const book_type_system = `You are an expert at writing ${outline.book.book_type} content.`;

    const systemPrompt = `${book_type_system}

CHAPTER TEMPLATE: ${chapterTemplate}
Follow this structure for the chapter:
${template?.structure.map(item => `- ${item}`).join('\n')}

ENABLED JUPYTER BOOK FEATURES:
Use these features appropriately throughout the chapter:
${(currentContent.features || selectedFeatures).join(', ')}

CONTINUITY CONTEXT:
${currentChapterIndex > 0 ? `Previous Chapter: ${outline.chapters[currentChapterIndex - 1].title}` : 'This is the first chapter'}
${currentChapter.connection_to_previous ? `Connection from Previous: ${currentChapter.connection_to_previous}` : ''}
${currentChapterIndex < outline.chapters.length - 1 ? `Next Chapter: ${outline.chapters[currentChapterIndex + 1].title}` : 'This is the final chapter'}
${currentChapter.connection_to_next ? `Connection to Next: ${currentChapter.connection_to_next}` : ''}

Write in ${outline.book.tone} tone for ${outline.book.target_audience} audience.
Target approximately ${customWordCounts[currentChapterIndex] || currentChapter.estimated_words} words.`;

    const objectivesText = currentChapter.learning_objectives.map(obj => `- ${obj}`).join('\n');
    const componentsText = currentChapter.suggested_components.join(', ');
    const additionalText = additionalInstructions ? `\n\nADDITIONAL REQUIREMENTS:\n${additionalInstructions}` : '';

    const userPrompt = `Write the complete content for this chapter:

CHAPTER ${currentChapter.chapter_number}: ${currentChapter.title}

DESCRIPTION:
${currentChapter.description}

LEARNING OBJECTIVES:
${objectivesText}

SUGGESTED COMPONENTS TO INCLUDE:
${componentsText}

Follow the ${chapterTemplate} template structure.
Use MyST Markdown syntax with appropriate Jupyter Book features.
Make it engaging, clear, and valuable for the target audience.${additionalText}

Return ONLY the chapter content in MyST Markdown format, starting with the chapter title as # heading.`;

    return { systemPrompt, userPrompt };
  };

  const handleGenerateWithPrompts = async (editedSystemPrompt?: string, editedUserPrompt?: string) => {
    const prompts = buildChapterPrompts();
    const finalSystemPrompt = editedSystemPrompt || prompts.systemPrompt;
    const finalUserPrompt = editedUserPrompt || prompts.userPrompt;

    // Close prompt editor if open
    setShowPromptEditor(false);

    // Use the existing handleGenerateChapter logic but with custom prompts if provided
    // For now, we'll just call the existing handler - it will use the backend's prompt generation
    // In a future enhancement, we could add an endpoint that accepts custom prompts
    await handleGenerateChapter();
  };

  const completedChapters = chapterContents.filter(c => c.status === 'complete').length;
  const progress = (completedChapters / outline.chapters.length) * 100;

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
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <BookOpen className="h-10 w-10 text-primary" />
                {outline.book.title}
              </h1>
              <Button
                onClick={() => navigate('/create/publish', {
                  state: {
                    outline,
                    chapterContents,
                    chapterTemplate,
                    selectedFeatures
                  }
                })}
                disabled={completedChapters < outline.chapters.length}
                size="lg"
              >
                Publish Book
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{completedChapters} / {outline.chapters.length} chapters complete</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chapter List Sidebar */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-1">
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Chapters</CardTitle>
                  <CardDescription>Click to edit</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {outline.chapters.map((chapter, index) => {
                      const content = chapterContents[index];
                      const isActive = index === currentChapterIndex;

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentChapterIndex(index);
                            setAdditionalInstructions('');
                          }}
                          className={`w-full text-left p-3 border-l-4 transition-all ${
                            isActive
                              ? 'border-primary bg-primary/5'
                              : 'border-transparent hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-muted-foreground mb-1">
                                Chapter {chapter.chapter_number}
                              </div>
                              <div className="text-sm font-medium truncate">
                                {chapter.title}
                              </div>
                            </div>
                            {content?.status === 'complete' && (
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            )}
                            {content?.status === 'generating' && (
                              <Sparkles className="h-4 w-4 text-primary animate-pulse flex-shrink-0" />
                            )}
                            {content?.status === 'draft' && (
                              <Edit3 className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Template Info */}
              {template && (
                <Card className="mt-4 shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Chapter Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      <div className="font-medium mb-2">{template.name}</div>
                      <div className="space-y-1">
                        {template.structure.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Main Content Area */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-3 space-y-6">
              {/* Chapter Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        Chapter {currentChapter.chapter_number}: {currentChapter.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {currentChapter.description}
                      </CardDescription>
                    </div>
                    <Badge variant={currentContent?.status === 'complete' ? 'default' : 'secondary'}>
                      {currentContent?.status === 'complete' && 'Complete'}
                      {currentContent?.status === 'draft' && 'Draft'}
                      {currentContent?.status === 'generating' && 'Generating...'}
                      {currentContent?.status === 'not_started' && 'Not Started'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentChapter.learning_objectives.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Learning Objectives:</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {currentChapter.learning_objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentChapter.suggested_components.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Suggested Components:</div>
                      <div className="flex flex-wrap gap-2">
                        {currentChapter.suggested_components.map((comp) => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {comp.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Per-Chapter Features */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Jupyter Book Features for this Chapter</div>
                      <Button
                        onClick={() => setShowFeatureSelector(true)}
                        variant="outline"
                        size="sm"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {currentContent?.features && currentContent.features.length > 0
                          ? `${currentContent.features.length} features`
                          : 'Configure'}
                      </Button>
                    </div>
                    {currentContent?.features && currentContent.features.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {currentContent.features.length} feature{currentContent.features.length !== 1 ? 's' : ''} selected for this chapter
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Generation Controls */}
              {currentContent?.status === 'not_started' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Chapter Content</CardTitle>
                    <CardDescription>
                      AI will generate content following the {template?.name} template with all book context
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Target Word Count
                      </label>
                      <Input
                        type="number"
                        value={customWordCounts[currentChapterIndex] || currentChapter.estimated_words}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value) {
                            setCustomWordCounts(prev => ({
                              ...prev,
                              [currentChapterIndex]: value
                            }));
                          } else {
                            setCustomWordCounts(prev => {
                              const newCounts = { ...prev };
                              delete newCounts[currentChapterIndex];
                              return newCounts;
                            });
                          }
                        }}
                        placeholder={`Default: ${currentChapter.estimated_words} words`}
                        min={100}
                        max={10000}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Default: {currentChapter.estimated_words} words • Customize as needed
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Additional Instructions (Optional)
                      </label>
                      <Textarea
                        value={additionalInstructions}
                        onChange={(e) => setAdditionalInstructions(e.target.value)}
                        placeholder="Any specific requirements for this chapter..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setShowPromptEditor(true)}
                          variant="outline"
                          size="lg"
                          disabled={isGenerating}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View/Edit Prompt
                        </Button>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleGenerateChapter}
                          disabled={isGenerating}
                          size="lg"
                          className="flex-1"
                        >
                          {isGenerating ? (
                            <>
                              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate with AI
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            handleContentChange('# Start writing...\n\n');
                          }}
                          variant="outline"
                          size="lg"
                          disabled={isGenerating}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Write Manually
                        </Button>
                      </div>

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
                          <p className="text-xs text-center text-muted-foreground">
                            This may take 30-60 seconds depending on chapter length...
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Editor/Preview */}
              {(currentContent?.status === 'draft' || currentContent?.status === 'complete') && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Chapter Content</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant={viewMode === 'edit' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('edit')}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant={viewMode === 'preview' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('preview')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {viewMode === 'edit' ? (
                      <Textarea
                        value={currentContent.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        rows={20}
                        className="font-mono text-sm"
                      />
                    ) : (
                      <div className="prose prose-slate dark:prose-invert max-w-none p-6 border rounded-lg bg-card">
                        <ReactMarkdown
                          components={{
                            code: ({node, inline, className, children, ...props}) => {
                              return inline ? (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              ) : (
                                <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                            p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                            li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />,
                            a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
                          }}
                        >
                          {currentContent.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </CardContent>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {currentContent.content.split(' ').filter(w => w).length} words
                      </div>
                      {currentContent.status === 'draft' && (
                        <Button onClick={handleMarkComplete}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Prompt Editor Modal */}
        {showPromptEditor && (() => {
          const prompts = buildChapterPrompts();
          return (
            <PromptEditor
              systemPrompt={prompts.systemPrompt}
              userPrompt={prompts.userPrompt}
              onClose={() => setShowPromptEditor(false)}
              onGenerate={handleGenerateWithPrompts}
              title={`Chapter ${currentChapter.chapter_number}: ${currentChapter.title}`}
            />
          );
        })()}

        {/* Feature Selector Modal */}
        {showFeatureSelector && (
          <FeatureSelector
            onClose={() => setShowFeatureSelector(false)}
            onConfirm={(features) => {
              const newContents = [...chapterContents];
              newContents[currentChapterIndex].features = features;
              setChapterContents(newContents);
              setShowFeatureSelector(false);
            }}
            initialSelected={currentContent?.features || []}
          />
        )}
      </div>
    </div>
  );
}
