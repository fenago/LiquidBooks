import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Check,
  FileText,
  Sparkles,
  Download,
  Eye,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Package
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useBookStore } from '../store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

interface Enhancement {
  chapter_number: number;
  chapter_title: string;
  enhancements: {
    cross_references: Array<{ reference_to: string; location: string; reason: string }>;
    chapter_transition: string;
    forward_hook: string;
    glossary_terms: Array<{ term: string; definition: string }>;
    callouts: Array<{ type: string; location: string; content: string }>;
    code_enhancements: Array<{ location: string; suggestion: string }>;
  };
}

export default function BookAssembler() {
  const { book } = useBookStore();
  const navigate = useNavigate();
  const [enhancing, setEnhancing] = useState(false);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const handleEnhanceBook = async () => {
    if (!book) return;

    setEnhancing(true);
    try {
      const payload = {
        book_title: book.title,
        book_description: book.description,
        chapters: book.chapters.map(ch => ({
          chapter_number: ch.chapter_number,
          title: ch.title,
          content: ch.content || ''
        }))
      };

      const response = await fetch(`${API_BASE_URL}/api/ai/enhance-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to enhance book');
      }

      const data = await response.json();
      setEnhancements(data.enhancements);
    } catch (error) {
      console.error('Error enhancing book:', error);
      alert('Failed to enhance book. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };

  const handleBuildBook = () => {
    navigate('/editor');
  };

  const completedChapters = book?.chapters.filter(ch => ch.content && ch.content.length > 0) || [];
  const totalChapters = book?.chapters.length || 0;
  const completionPercentage = totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100) : 0;

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
                  <Package className="h-10 w-10 text-primary" />
                  Book Assembly
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Review, enhance, and finalize your book
                </p>
              </div>
              <Button
                onClick={handleBuildBook}
                size="lg"
                disabled={completedChapters.length === 0}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Open in Editor
              </Button>
            </div>

            {/* Book Info */}
            {book && (
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Title</div>
                      <div className="text-lg font-semibold">{book.title}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Type</div>
                      <Badge variant="outline">{book.book_type}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Chapters</div>
                      <div className="text-lg font-semibold">{completedChapters.length}/{totalChapters}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Progress</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold">{completionPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
              {/* Chapters Review */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Chapters Overview
                  </CardTitle>
                  <CardDescription>
                    Review all your completed chapters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {completedChapters.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                      <p>No completed chapters yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => navigate('/create/chapters')}
                      >
                        Create Chapters
                      </Button>
                    </div>
                  ) : (
                    completedChapters.map((chapter) => (
                      <div
                        key={chapter.chapter_number}
                        className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="font-medium">Chapter {chapter.chapter_number}</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-1">{chapter.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {chapter.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{(chapter.content?.length || 0).toLocaleString()} characters</span>
                              {chapter.learning_objectives && chapter.learning_objectives.length > 0 && (
                                <span>{chapter.learning_objectives.length} objectives</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Enhancements */}
              {enhancements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Enhancement Suggestions
                    </CardTitle>
                    <CardDescription>
                      AI-powered suggestions to improve your book
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enhancements.map((enhancement) => {
                      const isExpanded = expandedChapter === enhancement.chapter_number;
                      const totalSuggestions =
                        enhancement.enhancements.cross_references.length +
                        enhancement.enhancements.callouts.length +
                        enhancement.enhancements.glossary_terms.length +
                        enhancement.enhancements.code_enhancements.length;

                      return (
                        <div key={enhancement.chapter_number} className="border rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedChapter(isExpanded ? null : enhancement.chapter_number)}
                            className="w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold">Chapter {enhancement.chapter_number}: {enhancement.chapter_title}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {totalSuggestions} suggestions
                              </div>
                            </div>
                            <ChevronRight className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>

                          {isExpanded && (
                            <div className="p-4 border-t bg-muted/20 space-y-4">
                              {/* Cross References */}
                              {enhancement.enhancements.cross_references.length > 0 && (
                                <div>
                                  <div className="font-medium mb-2">Cross-References</div>
                                  <div className="space-y-2">
                                    {enhancement.enhancements.cross_references.map((ref, i) => (
                                      <div key={i} className="text-sm p-2 bg-background rounded">
                                        <div className="font-medium">{ref.reference_to}</div>
                                        <div className="text-muted-foreground text-xs mt-1">{ref.reason}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Callouts */}
                              {enhancement.enhancements.callouts.length > 0 && (
                                <div>
                                  <div className="font-medium mb-2">Suggested Callouts</div>
                                  <div className="space-y-2">
                                    {enhancement.enhancements.callouts.map((callout, i) => (
                                      <div key={i} className="text-sm p-2 bg-background rounded">
                                        <Badge variant="outline" className="mb-1">{callout.type}</Badge>
                                        <div className="text-muted-foreground text-xs">{callout.content}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Glossary Terms */}
                              {enhancement.enhancements.glossary_terms.length > 0 && (
                                <div>
                                  <div className="font-medium mb-2">Glossary Terms</div>
                                  <div className="space-y-2">
                                    {enhancement.enhancements.glossary_terms.map((term, i) => (
                                      <div key={i} className="text-sm p-2 bg-background rounded">
                                        <div className="font-medium">{term.term}</div>
                                        <div className="text-muted-foreground text-xs mt-1">{term.definition}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-1 space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleEnhanceBook}
                    disabled={enhancing || completedChapters.length === 0}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    {enhancing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Enhance Book
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => navigate('/create/artifacts')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Manage Artifacts
                  </Button>

                  <Button
                    onClick={() => navigate('/editor')}
                    disabled={completedChapters.length === 0}
                    variant="default"
                    className="w-full justify-start"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview & Edit
                  </Button>
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export</CardTitle>
                  <CardDescription>Download your book</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled={completedChapters.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Liquid Books Source
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled={completedChapters.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Built HTML
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled={completedChapters.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF Export
                  </Button>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Book Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Chapters</span>
                    <span className="font-semibold">{totalChapters}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-semibold">{completedChapters.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Words</span>
                    <span className="font-semibold">
                      {completedChapters
                        .reduce((sum, ch) => sum + (ch.content?.split(' ').length || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg per Chapter</span>
                    <span className="font-semibold">
                      {completedChapters.length > 0
                        ? Math.round(
                            completedChapters.reduce((sum, ch) => sum + (ch.content?.split(' ').length || 0), 0) /
                              completedChapters.length
                          ).toLocaleString()
                        : 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
