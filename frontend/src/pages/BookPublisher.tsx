import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Download, CheckCircle, Rocket, AlertCircle, Globe, ExternalLink, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const API_BASE_URL = 'http://localhost:8000';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

interface ChapterContent {
  chapter_number: number;
  content: string;
  status: 'not_started' | 'generating' | 'draft' | 'complete';
}

export default function BookPublisher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishComplete, setPublishComplete] = useState(false);
  const [buildUrl, setBuildUrl] = useState<string | null>(null);
  const [buildDir, setBuildDir] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // GitHub deployment state
  const [showGitHubDeploy, setShowGitHubDeploy] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [repoName, setRepoName] = useState('');
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  const outline = location.state?.outline;
  const chapterContents = location.state?.chapterContents as ChapterContent[];
  const chapterTemplate = location.state?.chapterTemplate;
  const selectedFeatures = location.state?.selectedFeatures || [];

  useEffect(() => {
    if (!outline || !chapterContents) {
      navigate('/create/plan');
    }
  }, [outline, chapterContents, navigate]);

  if (!outline || !chapterContents) {
    return null;
  }

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);

    try {
      // Build the Book object for backend
      const bookData = {
        id: `book_${Date.now()}`,
        title: outline.book.title,
        author: outline.book.author,
        description: outline.book.description,
        chapters: chapterContents.map((ch, index) => ({
          id: `chapter_${index + 1}`,
          title: outline.chapters[index].title,
          content: ch.content,
          order: index + 1
        }))
      };

      const response = await fetch(`${API_BASE_URL}/api/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: bookData,
          features: selectedFeatures
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to build book');
      }

      if (data.success) {
        setBuildUrl(data.url);
        setBuildDir(data.build_dir);
        setPublishComplete(true);
      } else {
        throw new Error(data.message || 'Build failed');
      }
    } catch (err) {
      console.error('Error publishing book:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownload = async () => {
    if (!buildDir) {
      alert('No build directory available for download');
      return;
    }

    try {
      // Request to create a zip of the build directory
      const response = await fetch(`${API_BASE_URL}/api/ai/download-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ build_dir: buildDir })
      });

      if (!response.ok) {
        throw new Error('Failed to create download');
      }

      // Download the zip file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${outline.book.title.replace(/\s+/g, '_')}_book.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading book:', err);
      alert('Failed to download book files. The build files are available at: ' + buildDir);
    }
  };

  const handleGitHubDeploy = async () => {
    if (!githubUsername || !githubToken || !repoName) {
      setDeployError('Please fill in all GitHub fields');
      return;
    }

    setIsDeploying(true);
    setDeployError(null);

    try {
      console.log('[GitHub Deploy] Starting deployment...');
      console.log(`[GitHub Deploy] Username: ${githubUsername}`);
      console.log(`[GitHub Deploy] Repo: ${repoName}`);

      // Build the Book object for backend
      const bookData = {
        id: `book_${Date.now()}`,
        title: outline.book.title,
        author: outline.book.author,
        description: outline.book.description,
        chapters: chapterContents.map((ch, index) => ({
          id: `chapter_${index + 1}`,
          title: outline.chapters[index].title,
          content: ch.content,
          order: index + 1
        }))
      };

      console.log('[GitHub Deploy] Sending build request with GitHub credentials...');

      const response = await fetch(`${API_BASE_URL}/api/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: bookData,
          features: selectedFeatures,
          github_username: githubUsername,
          github_token: githubToken,
          repo_name: repoName
        })
      });

      console.log(`[GitHub Deploy] Response status: ${response.status}`);
      const data = await response.json();
      console.log('[GitHub Deploy] Response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to deploy to GitHub');
      }

      if (data.success) {
        // Check if URL is a GitHub Pages URL (deployment successful)
        if (data.url && data.url.includes('github.io')) {
          setDeployUrl(data.url);
          setShowGitHubDeploy(false);
        } else {
          throw new Error('GitHub deployment did not return a valid GitHub Pages URL');
        }
      } else {
        throw new Error(data.message || 'GitHub deployment failed');
      }
    } catch (err) {
      console.error('Error deploying to GitHub:', err);
      setDeployError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Rocket className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Publish Your Book
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your book is ready! Generate and download your Liquid Books.
            </p>
          </motion.div>

          {!publishComplete ? (
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="shadow-card-premium border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Ready to Publish</CardTitle>
                  <CardDescription className="text-base">
                    Click the button below to generate your Liquid Books. This will create all necessary files and structure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Book outline completed</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">All chapters written</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Content validated</span>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-red-900 dark:text-red-100">Build Failed</div>
                        <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      size="lg"
                      className="flex-1 glow-primary shadow-lg shadow-primary/25"
                    >
                      {isPublishing ? (
                        <>
                          <Rocket className="h-5 w-5 mr-2 animate-pulse" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-5 w-5 mr-2" />
                          Publish Book
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => navigate('/create/chapters')}
                      variant="outline"
                      size="lg"
                    >
                      Back to Chapters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-card-premium border-border/50 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </motion.div>
                  </div>
                  <CardTitle className="text-3xl text-center">Book Published Successfully!</CardTitle>
                  <CardDescription className="text-base text-center">
                    Your Liquid Books has been generated and is ready to download.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Local Preview URL */}
                  {buildUrl && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm font-medium mb-2">Local Preview:</div>
                      <a
                        href={buildUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {buildUrl}
                      </a>
                      <p className="text-xs text-muted-foreground mt-2">
                        This is a temporary local preview. Deploy your book to make it publicly accessible.
                      </p>
                    </div>
                  )}

                  {/* Deployed URL */}
                  {deployUrl && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div className="text-sm font-medium text-green-900 dark:text-green-100">Live on GitHub Pages!</div>
                      </div>
                      <a
                        href={deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                      >
                        {deployUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {/* Deployment Information Card */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Deployment Options</CardTitle>
                      </div>
                      <CardDescription>
                        Your Jupyter Book is a complete static website. Choose how to share it:
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-semibold mb-1">What's Included</div>
                          <p className="text-muted-foreground">
                            The <code className="text-xs bg-background px-1.5 py-0.5 rounded">_build/html</code> directory contains your complete book:
                            HTML pages, CSS styling, JavaScript interactivity, images, search index, and navigation.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="font-semibold">Deployment Options:</div>

                          <div className="pl-4 space-y-2">
                            <div>
                              <div className="font-medium">1. GitHub Pages (Recommended)</div>
                              <p className="text-muted-foreground text-xs">
                                Free hosting with custom domain support. Use the form below to deploy automatically.
                              </p>
                            </div>

                            <div>
                              <div className="font-medium">2. Download & Manual Deploy</div>
                              <p className="text-muted-foreground text-xs">
                                Download the files and upload to Netlify, Vercel, or any static hosting service.
                              </p>
                            </div>

                            <div>
                              <div className="font-medium">3. Local Testing</div>
                              <p className="text-muted-foreground text-xs">
                                Open the local preview URL above to view your book offline.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* GitHub Pages Deployment Section */}
                  {!showGitHubDeploy && (
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => setShowGitHubDeploy(true)}
                    >
                      <Globe className="h-5 w-5 mr-2" />
                      {deployUrl ? 'Re-deploy to GitHub Pages' : 'Deploy to GitHub Pages'}
                    </Button>
                  )}

                  {showGitHubDeploy && (
                    <Card className="border-primary/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Deploy to GitHub Pages</CardTitle>
                        <CardDescription>
                          Your book will be automatically deployed to GitHub Pages. The repository will be created if it doesn't exist.
                        </CardDescription>
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                              <strong>Please wait:</strong> Deployment typically takes 1-2 minutes. After deployment, GitHub Pages may take an additional 1-2 minutes to activate your site.
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Instructions */}
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2">
                          <div className="font-medium text-blue-900 dark:text-blue-100">Setup Instructions:</div>
                          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-xs">
                            <li>
                              <strong>GitHub Username:</strong> Your GitHub username (found at <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="underline">github.com</a> when logged in)
                            </li>
                            <li>
                              <strong>Personal Access Token:</strong> Create at <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">github.com/settings/tokens</a>
                              <div className="ml-6 mt-1">
                                • Click "Generate new token" → "Generate new token (classic)"<br/>
                                • Check the <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">repo</code> scope<br/>
                                • Copy the token (you won't see it again!)
                              </div>
                            </li>
                            <li>
                              <strong>Repository Name:</strong> Choose a name (e.g., "my-book"). Repository will be created automatically if it doesn't exist.
                            </li>
                          </ol>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">GitHub Username</label>
                            <Input
                              type="text"
                              placeholder="your-username"
                              value={githubUsername}
                              onChange={(e) => setGithubUsername(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Personal Access Token</label>
                            <Input
                              type="password"
                              placeholder="ghp_xxxxxxxxxxxx"
                              value={githubToken}
                              onChange={(e) => setGithubToken(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Repository Name</label>
                            <Input
                              type="text"
                              placeholder="my-book"
                              value={repoName}
                              onChange={(e) => setRepoName(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Your book will be available at: https://{githubUsername || 'username'}.github.io/{repoName || 'repo-name'}
                            </p>
                          </div>
                        </div>

                        {deployError && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 text-sm">
                              <div className="font-medium text-red-900 dark:text-red-100">Deployment Failed</div>
                              <div className="text-red-700 dark:text-red-300 mt-1">{deployError}</div>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button
                            onClick={handleGitHubDeploy}
                            disabled={isDeploying || !githubUsername || !githubToken || !repoName}
                            className="flex-1"
                          >
                            {isDeploying ? (
                              <>
                                <Globe className="h-4 w-4 mr-2 animate-pulse" />
                                Deploying...
                              </>
                            ) : (
                              <>
                                <Globe className="h-4 w-4 mr-2" />
                                Deploy Now
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowGitHubDeploy(false);
                              setDeployError(null);
                            }}
                            disabled={isDeploying}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Download Button */}
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={handleDownload}
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Book Files
                  </Button>

                  {/* Return to Dashboard */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/dashboard')}
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Return to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
