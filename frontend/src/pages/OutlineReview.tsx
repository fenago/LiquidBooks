import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  BookOpen,
  GripVertical,
  Info,
  FileText,
  Settings
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion';
import { JUPYTER_BOOK_FEATURES } from '../constants/jupyterFeatures';
import { CHAPTER_TEMPLATES, type ChapterTemplate } from '../constants/chapterTemplates';
import CustomTemplateDialog from '../components/CustomTemplateDialog';

interface ChapterOutline {
  chapter_number: number;
  title: string;
  description: string;
  learning_objectives: string[];
  suggested_components: string[];
  connection_to_previous: string | null;
  connection_to_next: string | null;
  estimated_words: number;
  target_pages?: number; // User-configurable target page count
  chapter_template?: string; // Per-chapter template override
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

export default function OutlineReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [outline, setOutline] = useState<BookOutline | null>(null);
  const [editingChapter, setEditingChapter] = useState<number | null>(null);
  const [editingBook, setEditingBook] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [chapterTemplate, setChapterTemplate] = useState<string>('standard');
  const [customTemplates, setCustomTemplates] = useState<ChapterTemplate[]>([]);
  const [showCustomTemplateDialog, setShowCustomTemplateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const outlineData = location.state?.outline;
    if (outlineData) {
      setOutline(outlineData);
      setSelectedFeatures(outlineData.recommended_features || []);
    } else {
      // No outline data, redirect back to planner
      navigate('/create/plan');
    }

    // Load custom templates from localStorage
    const savedTemplates = localStorage.getItem('customChapterTemplates');
    if (savedTemplates) {
      setCustomTemplates(JSON.parse(savedTemplates));
    }
  }, [location, navigate]);

  if (!outline) {
    return null;
  }

  const handleUpdateChapter = (index: number, updates: Partial<ChapterOutline>) => {
    const newOutline = { ...outline };
    newOutline.chapters[index] = { ...newOutline.chapters[index], ...updates };
    setOutline(newOutline);
    setEditingChapter(null);
  };

  const handleUpdateBook = (updates: Partial<typeof outline.book>) => {
    if (!outline) return;
    const newOutline = { ...outline };
    newOutline.book = { ...newOutline.book, ...updates };
    setOutline(newOutline);
  };

  const handleDeleteChapter = (index: number) => {
    const newOutline = { ...outline };
    newOutline.chapters.splice(index, 1);
    // Renumber chapters
    newOutline.chapters.forEach((ch, i) => {
      ch.chapter_number = i + 1;
    });
    setOutline(newOutline);
  };

  const handleAddChapter = () => {
    const newOutline = { ...outline };
    newOutline.chapters.push({
      chapter_number: newOutline.chapters.length + 1,
      title: 'New Chapter',
      description: 'Chapter description',
      learning_objectives: [],
      suggested_components: [],
      connection_to_previous: null,
      connection_to_next: null,
      estimated_words: 1500
    });
    setOutline(newOutline);
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSaveCustomTemplate = (template: ChapterTemplate) => {
    const updatedTemplates = [...customTemplates, template];
    setCustomTemplates(updatedTemplates);
    localStorage.setItem('customChapterTemplates', JSON.stringify(updatedTemplates));
    setChapterTemplate(template.id); // Automatically select the new template
  };

  const handleProceed = () => {
    // Save outline with selected features and chapter template to state/storage
    navigate('/create/chapters', {
      state: {
        outline: {
          ...outline,
          recommended_features: selectedFeatures
        },
        chapterTemplate
      }
    });
  };

  // Calculate dynamic statistics based on current chapter data
  const totalEstimatedWords = outline.chapters.reduce((sum, ch) => sum + (ch.estimated_words || 0), 0);
  const totalTargetPages = outline.chapters.reduce((sum, ch) => sum + (ch.target_pages || 0), 0);
  // Estimate pages from words (assuming ~250 words per page)
  const estimatedPages = totalTargetPages > 0 ? totalTargetPages : Math.ceil(totalEstimatedWords / 250);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-8">
            <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
              Review Your Book Outline
            </h1>
            <p className="text-lg text-muted-foreground">
              Review and adjust your book structure before creating content
            </p>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
                <TabsTrigger value="overview" className="gap-2">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="features" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Features & Templates</span>
                </TabsTrigger>
                <TabsTrigger value="chapters" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Chapters</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
                    {/* Book Info */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {editingBook ? (
                              <div className="space-y-2">
                                <Input
                                  value={outline.book.title}
                                  onChange={(e) => handleUpdateBook({ title: e.target.value })}
                                  placeholder="Book title"
                                  className="text-2xl font-semibold"
                                />
                                <Textarea
                                  value={outline.book.description}
                                  onChange={(e) => handleUpdateBook({ description: e.target.value })}
                                  placeholder="Book description"
                                  rows={2}
                                />
                              </div>
                            ) : (
                              <>
                                <CardTitle className="text-2xl">{outline.book.title}</CardTitle>
                                <CardDescription>{outline.book.description}</CardDescription>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => setEditingBook(!editingBook)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            {editingBook ? <CheckCircle2 className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {editingBook ? (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Author</label>
                              <Input
                                value={outline.book.author}
                                onChange={(e) => handleUpdateBook({ author: e.target.value })}
                                placeholder="Author name"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Book Type</label>
                              <Input
                                value={outline.book.book_type.replace(/_/g, ' ')}
                                disabled
                                className="bg-muted"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Tone</label>
                              <Input
                                value={outline.book.tone}
                                disabled
                                className="bg-muted"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">Audience</label>
                              <Input
                                value={outline.book.target_audience}
                                disabled
                                className="bg-muted"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Author:</span> {outline.book.author}
                            </div>
                            <div>
                              <span className="font-medium">Type:</span> {outline.book.book_type.replace(/_/g, ' ')}
                            </div>
                            <div>
                              <span className="font-medium">Tone:</span> {outline.book.tone}
                            </div>
                            <div>
                              <span className="font-medium">Audience:</span> {outline.book.target_audience}
                            </div>
                          </div>
                        )}
                        <div className="pt-3 border-t">
                          <div className="font-medium text-sm mb-2">Structure Overview:</div>
                          <p className="text-sm text-muted-foreground">{outline.structure_explanation}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Chapter Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Chapter Summary</CardTitle>
                        <CardDescription>Quick overview of your book structure</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {outline.chapters.map((chapter) => (
                            <div key={chapter.chapter_number} className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {chapter.chapter_number}. {chapter.title}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {chapter.description}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground ml-4">
                                {chapter.estimated_words.toLocaleString()} words
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Sidebar with stats */}
                  <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Book Statistics</CardTitle>
                        <CardDescription>Updates dynamically as you edit</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chapters:</span>
                          <span className="font-semibold">{outline.chapters.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Words:</span>
                          <span className="font-semibold">{totalEstimatedWords.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Pages:</span>
                          <span className="font-semibold">{estimatedPages}</span>
                        </div>
                        {totalTargetPages > 0 && (
                          <div className="pt-2 border-t text-xs text-muted-foreground">
                            Based on {totalTargetPages} target pages set
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              {/* Chapters Tab */}
              <TabsContent value="chapters">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Chapters ({outline.chapters.length})</CardTitle>
                        <CardDescription>Click to edit, drag to reorder</CardDescription>
                      </div>
                      <Button onClick={handleAddChapter} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Chapter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple">
                      {outline.chapters.map((chapter, index) => (
                        <AccordionItem
                          key={index}
                          value={`chapter-${index}`}
                        >
                          <AccordionTrigger>
                            <div className="flex items-center gap-2 text-left w-full">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">
                                Chapter {chapter.chapter_number}: {chapter.title}
                              </span>
                              <span className="text-xs text-muted-foreground ml-auto mr-4">
                                {chapter.estimated_words} words
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2">
                              {editingChapter === index ? (
                          <div className="space-y-3">
                            <Input
                              value={chapter.title}
                              onChange={(e) =>
                                handleUpdateChapter(index, { title: e.target.value })
                              }
                              placeholder="Chapter title"
                            />
                            <Textarea
                              value={chapter.description}
                              onChange={(e) =>
                                handleUpdateChapter(index, { description: e.target.value })
                              }
                              placeholder="Chapter description"
                              rows={3}
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">
                                  Est. Words
                                </label>
                                <Input
                                  type="number"
                                  value={chapter.estimated_words}
                                  onChange={(e) =>
                                    handleUpdateChapter(index, { estimated_words: parseInt(e.target.value) || 0 })
                                  }
                                  placeholder="Est. words"
                                  min={0}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground mb-1 block">
                                  Target Pages
                                </label>
                                <Input
                                  type="number"
                                  value={chapter.target_pages || ''}
                                  onChange={(e) =>
                                    handleUpdateChapter(index, { target_pages: parseInt(e.target.value) || undefined })
                                  }
                                  placeholder="Optional"
                                  min={0}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">
                                Chapter Template
                              </label>
                              <select
                                value={chapter.chapter_template || chapterTemplate}
                                onChange={(e) =>
                                  handleUpdateChapter(index, { chapter_template: e.target.value })
                                }
                                className="w-full p-2 rounded-md border border-border bg-background text-sm"
                              >
                                <option value="">Use default template</option>
                                {[...CHAPTER_TEMPLATES, ...customTemplates].map((template) => (
                                  <option key={template.id} value={template.id}>
                                    {template.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground mb-1 block">
                                Suggested Components (click to toggle)
                              </label>
                              <div className="flex flex-wrap gap-1">
                                {chapter.suggested_components.map((comp, compIndex) => (
                                  <Badge
                                    key={comp}
                                    variant="secondary"
                                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => {
                                      const newComponents = [...chapter.suggested_components];
                                      newComponents.splice(compIndex, 1);
                                      handleUpdateChapter(index, { suggested_components: newComponents });
                                    }}
                                  >
                                    {comp.replace(/_/g, ' ')} ✕
                                  </Badge>
                                ))}
                                <button
                                  onClick={() => {
                                    const newComp = prompt('Add component (e.g., code_blocks, math_equations):');
                                    if (newComp) {
                                      handleUpdateChapter(index, {
                                        suggested_components: [...chapter.suggested_components, newComp.trim()]
                                      });
                                    }
                                  }}
                                  className="text-xs px-2 py-1 rounded border border-dashed border-border hover:bg-muted"
                                >
                                  + Add
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => setEditingChapter(null)} size="sm">
                                Done
                              </Button>
                              <Button
                                onClick={() => handleDeleteChapter(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-semibold">
                                    Chapter {chapter.chapter_number}: {chapter.title}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground pl-6">
                                  {chapter.description}
                                </p>
                              </div>
                              <button
                                onClick={() => setEditingChapter(index)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            </div>
                            {chapter.learning_objectives.length > 0 && (
                              <div className="pl-6 mt-2">
                                <div className="text-xs font-medium text-muted-foreground mb-1">
                                  Learning Objectives:
                                </div>
                                <ul className="text-xs text-muted-foreground space-y-0.5">
                                  {chapter.learning_objectives.slice(0, 2).map((obj, i) => (
                                    <li key={i}>• {obj}</li>
                                  ))}
                                  {chapter.learning_objectives.length > 2 && (
                                    <li>• +{chapter.learning_objectives.length - 2} more</li>
                                  )}
                                </ul>
                              </div>
                            )}
                            <div className="flex gap-2 mt-2 pl-6 items-center flex-wrap">
                              {chapter.suggested_components.slice(0, 3).map((comp) => (
                                <Badge key={comp} variant="secondary" className="text-xs">
                                  {comp.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                              {chapter.suggested_components.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{chapter.suggested_components.length - 3}
                                </Badge>
                              )}
                              <div className="ml-auto flex gap-3 text-xs text-muted-foreground">
                                <span>{chapter.estimated_words.toLocaleString()} words</span>
                                {chapter.target_pages && (
                                  <span>• {chapter.target_pages} pages</span>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Features & Templates Tab */}
              <TabsContent value="features">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chapter Template */}
                  <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Chapter Template</CardTitle>
                      <CardDescription>Choose a consistent structure for all chapters</CardDescription>
                    </div>
                    <Button
                      onClick={() => setShowCustomTemplateDialog(true)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Custom
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Predefined Templates */}
                    {CHAPTER_TEMPLATES.map((template) => (
                      <label
                        key={template.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 ${
                          chapterTemplate === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        }`}
                      >
                        <input
                          type="radio"
                          name="chapterTemplate"
                          value={template.id}
                          checked={chapterTemplate === template.id}
                          onChange={(e) => setChapterTemplate(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {template.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            <span className="font-medium">Structure:</span>{' '}
                            {template.structure.slice(0, 3).join(', ')}
                            {template.structure.length > 3 && '...'}
                          </div>
                        </div>
                      </label>
                    ))}

                    {/* Custom Templates */}
                    {customTemplates.length > 0 && (
                      <>
                        <div className="pt-2 border-t">
                          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                            Custom Templates
                          </div>
                        </div>
                        {customTemplates.map((template) => (
                          <label
                            key={template.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 ${
                              chapterTemplate === template.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border'
                            }`}
                          >
                            <input
                              type="radio"
                              name="chapterTemplate"
                              value={template.id}
                              checked={chapterTemplate === template.id}
                              onChange={(e) => setChapterTemplate(e.target.value)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="font-medium flex items-center gap-2">
                                {template.name}
                                <Badge variant="secondary" className="text-xs">Custom</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {template.description}
                              </div>
                              <div className="text-xs text-muted-foreground mt-2">
                                <span className="font-medium">Structure:</span>{' '}
                                {template.structure.slice(0, 3).join(', ')}
                                {template.structure.length > 3 && '...'}
                              </div>
                            </div>
                          </label>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

                  {/* Features */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Liquid Books Features</CardTitle>
                      <CardDescription>
                        Recommended features are pre-selected, but you can enable any features you want
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['basic', 'advanced', 'interactive', 'layout', 'mathematical'].map((category) => {
                          const categoryFeatures = JUPYTER_BOOK_FEATURES.filter(f => f.category === category);
                          if (categoryFeatures.length === 0) return null;

                          return (
                            <div key={category}>
                              <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                {category}
                              </div>
                              <div className="space-y-1">
                                {categoryFeatures.map((feature) => (
                                  <label
                                    key={feature.id}
                                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedFeatures.includes(feature.id)}
                                      onChange={() => toggleFeature(feature.id)}
                                      className="rounded mt-0.5"
                                    />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium flex items-center gap-2">
                                        {feature.name}
                                        {outline.recommended_features.includes(feature.id) && (
                                          <Badge variant="secondary" className="text-xs">Recommended</Badge>
                                        )}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {feature.description}
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Actions - Fixed at bottom */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleProceed}
                  className="w-full"
                  size="lg"
                >
                  Next: Create Content
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  You'll be able to generate or write each chapter
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom Template Dialog */}
      <CustomTemplateDialog
        isOpen={showCustomTemplateDialog}
        onClose={() => setShowCustomTemplateDialog(false)}
        onSave={handleSaveCustomTemplate}
      />
    </div>
  );
}
