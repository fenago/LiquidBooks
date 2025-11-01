import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Image,
  Video,
  Code,
  Layers,
  Copy,
  Check,
  Download,
  Eye,
  Filter,
  Search,
  RefreshCw,
  Info,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useBookStore } from '../store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

interface Artifact {
  id: string;
  artifact_type_id: string;
  artifact_name: string;
  category: 'image' | 'video' | 'diagram' | 'interactive';
  tool: string;
  chapter_number: number;
  chapter_title: string;
  generated_prompt: string;
  placement_guidelines: string[];
  file_extension: string;
  description: string;
}

interface ArtifactResponse {
  success: boolean;
  total_artifacts: number;
  artifacts: Artifact[];
  artifacts_by_category: {
    image: Artifact[];
    video: Artifact[];
    diagram: Artifact[];
    interactive: Artifact[];
  };
  summary: {
    images: number;
    videos: number;
    diagrams: number;
    interactive: number;
  };
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'image': return <Image className="h-5 w-5" />;
    case 'video': return <Video className="h-5 w-5" />;
    case 'diagram': return <Code className="h-5 w-5" />;
    case 'interactive': return <Layers className="h-5 w-5" />;
    default: return <Sparkles className="h-5 w-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'image': return 'bg-blue-500/10 text-blue-500';
    case 'video': return 'bg-purple-500/10 text-purple-500';
    case 'diagram': return 'bg-green-500/10 text-green-500';
    case 'interactive': return 'bg-orange-500/10 text-orange-500';
    default: return 'bg-gray-500/10 text-gray-500';
  }
};

const TOOL_INFO: Record<string, { name: string; url: string; description: string }> = {
  nano_banana: {
    name: 'Nano Banana',
    url: 'https://nanobanana.ai',
    description: 'AI-powered image generation'
  },
  sora_2: {
    name: 'Sora 2',
    url: 'https://openai.com/sora',
    description: 'AI video generation by OpenAI'
  },
  veo_3: {
    name: 'Veo 3',
    url: 'https://deepmind.google/technologies/veo/',
    description: 'AI video generation by Google DeepMind'
  },
  mermaid: {
    name: 'Mermaid.js',
    url: 'https://mermaid.js.org',
    description: 'Diagram generation from text'
  },
  custom_component: {
    name: 'Custom Component',
    url: '',
    description: 'Custom interactive element'
  },
  jupyterbook_thebe: {
    name: 'Jupyter Thebe',
    url: 'https://jupyterbook.org/interactive/thebe.html',
    description: 'Interactive code execution'
  },
  plotly: {
    name: 'Plotly',
    url: 'https://plotly.com',
    description: 'Interactive data visualization'
  },
  sphinx_design: {
    name: 'Sphinx Design',
    url: 'https://sphinx-design.readthedocs.io',
    description: 'UI components for Sphinx'
  }
};

export default function ArtifactManager() {
  const { book } = useBookStore();
  const [loading, setLoading] = useState(false);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [artifactsByCategory, setArtifactsByCategory] = useState<ArtifactResponse['artifacts_by_category'] | null>(null);
  const [summary, setSummary] = useState<ArtifactResponse['summary'] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedArtifact, setExpandedArtifact] = useState<string | null>(null);

  const generateArtifacts = async () => {
    if (!book) return;

    setLoading(true);
    try {
      const payload = {
        book_title: book.title,
        book_description: book.description,
        book_type: book.book_type,
        tone: book.tone,
        target_audience: book.target_audience,
        chapters: book.chapters.map(ch => ({
          chapter_number: ch.chapter_number,
          title: ch.title,
          description: ch.description,
          content: ch.content || '',
          learning_objectives: ch.learning_objectives || []
        }))
      };

      const response = await fetch(`${API_BASE_URL}/api/ai/generate-artifacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to generate artifacts');
      }

      const data: ArtifactResponse = await response.json();
      setArtifacts(data.artifacts);
      setArtifactsByCategory(data.artifacts_by_category);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error generating artifacts:', error);
      alert('Failed to generate artifacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getFilteredArtifacts = () => {
    let filtered = artifacts;

    if (selectedCategory) {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.artifact_name.toLowerCase().includes(query) ||
        a.chapter_title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.tool.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredArtifacts = getFilteredArtifacts();

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
                  <Sparkles className="h-10 w-10 text-primary" />
                  Artifact Manager
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Generate prompts for images, videos, diagrams, and interactive elements
                </p>
              </div>
              <Button
                onClick={generateArtifacts}
                disabled={loading || !book?.chapters || book.chapters.length === 0}
                size="lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Artifacts
                  </>
                )}
              </Button>
            </div>

            {/* Summary Stats */}
            {summary && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-sm">Images</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-500">{summary.images}</div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-500/10 border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-5 w-5 text-purple-500" />
                      <span className="font-medium text-sm">Videos</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-500">{summary.videos}</div>
                  </CardContent>
                </Card>

                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-sm">Diagrams</span>
                    </div>
                    <div className="text-3xl font-bold text-green-500">{summary.diagrams}</div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="h-5 w-5 text-orange-500" />
                      <span className="font-medium text-sm">Interactive</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-500">{summary.interactive}</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>

          {!artifacts.length ? (
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent className="p-12 text-center">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Artifacts Generated Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Generate artifacts to create prompts for images, videos, diagrams, and interactive elements.
                  </p>
                  <Button
                    onClick={generateArtifacts}
                    disabled={loading || !book?.chapters || book.chapters.length === 0}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Artifacts
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="lg:col-span-1 space-y-4">
                {/* Category Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        selectedCategory === null ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">All Artifacts</span>
                        <Badge variant="secondary">{artifacts.length}</Badge>
                      </div>
                    </button>

                    {['image', 'video', 'diagram', 'interactive'].map((cat) => {
                      const count = artifacts.filter(a => a.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            selectedCategory === cat ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(cat)}
                              <span className="text-sm font-medium capitalize">{cat}s</span>
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
                        placeholder="Search artifacts..."
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Artifacts List */}
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="lg:col-span-3 space-y-4">
                {filteredArtifacts.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="text-muted-foreground">No artifacts found matching your criteria</div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredArtifacts.map((artifact) => {
                    const toolInfo = TOOL_INFO[artifact.tool];
                    const isExpanded = expandedArtifact === artifact.id;

                    return (
                      <Card key={artifact.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${getCategoryColor(artifact.category)}`}>
                                  {getCategoryIcon(artifact.category)}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">{artifact.artifact_name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      Chapter {artifact.chapter_number}: {artifact.chapter_title}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs capitalize">
                                      {artifact.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-3">
                                {artifact.description}
                              </p>

                              {/* Tool Info */}
                              {toolInfo && (
                                <div className="flex items-center gap-2 mb-4 text-sm">
                                  <span className="text-muted-foreground">Tool:</span>
                                  <a
                                    href={toolInfo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1"
                                  >
                                    {toolInfo.name}
                                    {toolInfo.url && <ExternalLink className="h-3 w-3" />}
                                  </a>
                                  <span className="text-muted-foreground">- {toolInfo.description}</span>
                                </div>
                              )}

                              {/* Generated Prompt */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium">Generated Prompt</label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(artifact.generated_prompt, artifact.id)}
                                  >
                                    {copiedId === artifact.id ? (
                                      <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Copied!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy
                                      </>
                                    )}
                                  </Button>
                                </div>
                                <Textarea
                                  value={artifact.generated_prompt}
                                  readOnly
                                  rows={isExpanded ? 12 : 4}
                                  className="font-mono text-sm"
                                />
                              </div>

                              {/* Expanded Details */}
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-4 space-y-4"
                                >
                                  <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="text-sm font-medium mb-2">Placement Guidelines</div>
                                    <ul className="space-y-1">
                                      {artifact.placement_guidelines.map((guideline, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                          <span>{guideline}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>File Extension:</span>
                                    <Badge variant="outline">{artifact.file_extension}</Badge>
                                  </div>
                                </motion.div>
                              )}

                              <div className="flex items-center gap-2 mt-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedArtifact(isExpanded ? null : artifact.id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  {isExpanded ? 'Less Info' : 'More Info'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
