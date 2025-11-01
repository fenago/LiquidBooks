import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { useBookStore } from '../store.js';
import axios from 'axios';
import './Editor.css';
import 'katex/dist/katex.min.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type ViewMode = 'markdown' | 'preview' | 'split';

export default function Editor() {
  const { book, currentChapter, setCurrentChapter, updateChapter, addChapter } =
    useBookStore();
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [building, setBuilding] = useState(false);
  const [buildStatus, setBuildStatus] = useState<string>('');
  const [aiChapterSystemPrompt, setAiChapterSystemPrompt] = useState('');
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [generatingChapter, setGeneratingChapter] = useState(false);
  const [includeCode, setIncludeCode] = useState(true);
  const [includeMath, setIncludeMath] = useState(true);
  const [includeAdmonitions, setIncludeAdmonitions] = useState(true);
  const [includeQuiz, setIncludeQuiz] = useState(false);
  const [includeImages, setIncludeImages] = useState(false);
  const [showGenerateCurrentChapter, setShowGenerateCurrentChapter] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const defaultChapterPrompt = `You are an expert technical writer creating STUNNING educational content for Liquid Bookss.
Your goal is to CREATE THE MOST IMPRESSIVE, FEATURE-RICH chapter possible that showcases the full power of Liquid Books.
Generate comprehensive chapter content using MyST Markdown with ALL available Liquid Books features.
Make it VISUALLY STUNNING and PEDAGOGICALLY EXCELLENT.`;

  const handleEditorChange = (value: string | undefined) => {
    if (currentChapter && value !== undefined) {
      updateChapter(currentChapter.id, value);
    }
  };

  const handleAddChapter = () => {
    if (newChapterTitle.trim()) {
      addChapter(newChapterTitle);
      setNewChapterTitle('');
      setShowAddChapter(false);
    }
  };

  const handleGenerateChapterWithAI = async () => {
    if (!newChapterTitle.trim() || !book) return;

    setGeneratingChapter(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/generate-chapter`, {
        book_title: book.title,
        book_description: book.description,
        chapter_title: newChapterTitle,
        chapter_description: currentChapter?.description,
        system_prompt: aiChapterSystemPrompt || undefined,
        include_code: includeCode,
        include_math: includeMath,
        include_admonitions: includeAdmonitions,
        include_quiz: includeQuiz,
        include_images: includeImages,
      });

      if (response.data.success && response.data.content) {
        const chapterId = `chapter-${Date.now()}`;
        const newChapter = {
          id: chapterId,
          title: newChapterTitle,
          content: response.data.content,
          order: book.chapters.length,
        };

        // Add chapter using the store
        addChapter(newChapterTitle);
        // Update the content with AI generated content
        setTimeout(() => {
          updateChapter(chapterId, response.data.content);
        }, 100);

        setNewChapterTitle('');
        setShowAddChapter(false);
        setShowAIPrompt(false);
        setAiChapterSystemPrompt('');
        setGeneratingChapter(false);
      } else {
        throw new Error(response.data.error || 'Failed to generate chapter');
      }
    } catch (error: any) {
      console.error('AI chapter generation error:', error);
      alert(error.response?.data?.detail || error.message || 'Failed to generate chapter with AI');
      setGeneratingChapter(false);
    }
  };

  const handleRegenerateCurrentChapter = async () => {
    if (!currentChapter || !book) return;

    setGeneratingChapter(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/generate-chapter`, {
        book_title: book.title,
        book_description: book.description,
        chapter_title: currentChapter.title,
        chapter_description: currentChapter.description,
        system_prompt: aiChapterSystemPrompt || undefined,
        include_code: includeCode,
        include_math: includeMath,
        include_admonitions: includeAdmonitions,
        include_quiz: includeQuiz,
        include_images: includeImages,
      });

      if (response.data.success && response.data.content) {
        updateChapter(currentChapter.id, response.data.content);
        setShowGenerateCurrentChapter(false);
        setGeneratingChapter(false);
      } else {
        throw new Error(response.data.error || 'Failed to generate chapter');
      }
    } catch (error: any) {
      console.error('AI chapter generation error:', error);
      alert(error.response?.data?.detail || error.message || 'Failed to generate chapter with AI');
      setGeneratingChapter(false);
    }
  };

  const handleBuildAndDeploy = async () => {
    if (!book) return;

    setBuilding(true);
    setBuildStatus('Building your book...');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/build`, {
        book,
      });

      const buildUrl = response.data.url || 'Build completed';
      setBuildStatus(buildUrl);
      setBuilding(false);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message || 'Build failed';
      setBuildStatus(`❌ Error: ${errorMsg}`);
      setBuilding(false);
    }
  };

  if (!book) return null;

  return (
    <div className="editor">
      <div className="editor-sidebar">
        <div className="sidebar-header">
          <h3>Chapters</h3>
          <button
            className="btn-small"
            onClick={() => setShowAddChapter(!showAddChapter)}
          >
            +
          </button>
        </div>

        {showAddChapter && (
          <div className="add-chapter" style={{ flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="Chapter title"
                onKeyPress={(e) => e.key === 'Enter' && !showAIPrompt && handleAddChapter()}
              />
              <button className="btn-small btn-primary" onClick={handleAddChapter}>
                Add
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={showAIPrompt}
                  onChange={(e) => setShowAIPrompt(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <span>Generate with AI</span>
              </label>
            </div>

            {showAIPrompt && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  padding: '0.5rem',
                  background: '#f9fafb',
                  borderRadius: '0.25rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={includeCode} onChange={(e) => setIncludeCode(e.target.checked)} />
                    <span>Code Examples</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={includeMath} onChange={(e) => setIncludeMath(e.target.checked)} />
                    <span>Math Equations</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={includeAdmonitions} onChange={(e) => setIncludeAdmonitions(e.target.checked)} />
                    <span>Admonitions</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={includeQuiz} onChange={(e) => setIncludeQuiz(e.target.checked)} />
                    <span>Interactive Quiz</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={includeImages} onChange={(e) => setIncludeImages(e.target.checked)} />
                    <span>Image Placeholders</span>
                  </label>
                </div>
                <textarea
                  value={aiChapterSystemPrompt}
                  onChange={(e) => setAiChapterSystemPrompt(e.target.value)}
                  placeholder="Optional: Custom system prompt for AI generation..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.25rem',
                    resize: 'vertical'
                  }}
                />
                <button
                  className="btn-small btn-primary"
                  onClick={handleGenerateChapterWithAI}
                  disabled={generatingChapter || !newChapterTitle.trim()}
                  style={{ width: '100%', height: 'auto', padding: '0.5rem' }}
                >
                  {generatingChapter ? 'Generating...' : '✨ Generate Impressive Chapter with AI'}
                </button>
              </>
            )}
          </div>
        )}

        <div className="chapter-list">
          <AnimatePresence>
            {book.chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className={`chapter-item ${currentChapter?.id === chapter.id ? 'active' : ''}`}
                onClick={() => setCurrentChapter(chapter)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', width: '100%' }}>
                  <span className="chapter-number">{chapter.order + 1}.</span>
                  <div style={{ flex: 1 }}>
                    <div className="chapter-title">{chapter.title}</div>
                    {chapter.description && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '0.25rem',
                        lineHeight: '1.2'
                      }}>
                        {chapter.description}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="sidebar-actions">
          <button
            className="btn-primary"
            onClick={handleBuildAndDeploy}
            disabled={building}
          >
            {building ? 'Building...' : '🚀 Build & Deploy'}
          </button>
        </div>

        <AnimatePresence>
          {buildStatus && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="build-status"
            >
              {buildStatus.startsWith('file://') ? (
                <div>
                  <p style={{ marginBottom: '0.5rem', fontWeight: 600 }}>✅ Build Successful!</p>
                  <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                    Copy this path and paste it in your browser address bar:
                  </p>
                  <input
                    type="text"
                    readOnly
                    value={buildStatus}
                    onClick={(e) => e.currentTarget.select()}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      border: '1px solid #86efac',
                      borderRadius: '0.25rem',
                      background: 'white',
                    }}
                  />
                </div>
              ) : (
                <p>{buildStatus}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="editor-main">
        <div className="editor-header">
          <h2>{currentChapter?.title || 'Select a chapter'}</h2>
          <div className="editor-tabs">
            <button
              className={`tab ${viewMode === 'markdown' ? 'active' : ''}`}
              onClick={() => setViewMode('markdown')}
            >
              Markdown
            </button>
            <button
              className={`tab ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              Preview
            </button>
            <button
              className={`tab ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
            >
              Split
            </button>
            {currentChapter && (
              <button
                className="tab"
                onClick={() => setShowGenerateCurrentChapter(!showGenerateCurrentChapter)}
                style={{
                  background: showGenerateCurrentChapter ? '#4f46e5' : 'none',
                  color: showGenerateCurrentChapter ? 'white' : '#6b7280'
                }}
              >
                ✨ AI Generate
              </button>
            )}
          </div>
        </div>

        {showGenerateCurrentChapter && currentChapter && (
          <div style={{
            padding: '1rem',
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={includeCode} onChange={(e) => setIncludeCode(e.target.checked)} />
                <span>Code Examples</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={includeMath} onChange={(e) => setIncludeMath(e.target.checked)} />
                <span>Math Equations</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={includeAdmonitions} onChange={(e) => setIncludeAdmonitions(e.target.checked)} />
                <span>Admonitions</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={includeQuiz} onChange={(e) => setIncludeQuiz(e.target.checked)} />
                <span>Interactive Quiz</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={includeImages} onChange={(e) => setIncludeImages(e.target.checked)} />
                <span>Images</span>
              </label>
            </div>
            <textarea
              value={aiChapterSystemPrompt}
              onChange={(e) => setAiChapterSystemPrompt(e.target.value)}
              placeholder={`System prompt (optional - default shown below):\n\n${defaultChapterPrompt}`}
              rows={4}
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn-primary"
                onClick={handleRegenerateCurrentChapter}
                disabled={generatingChapter}
                style={{ flex: 1 }}
              >
                {generatingChapter ? 'Generating...' : '✨ Generate Content with AI'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowGenerateCurrentChapter(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="editor-content" style={{ display: 'flex', gap: '1px', background: '#e5e7eb' }}>
          {currentChapter ? (
            <>
              {/* Markdown Editor */}
              {(viewMode === 'markdown' || viewMode === 'split') && (
                <div style={{ flex: viewMode === 'split' ? 1 : 'auto', width: viewMode === 'split' ? '50%' : '100%', background: 'white' }}>
                  <MonacoEditor
                    height="100%"
                    language="markdown"
                    theme="vs-light"
                    value={currentChapter.content}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              )}

              {/* Preview */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div
                  style={{
                    flex: viewMode === 'split' ? 1 : 'auto',
                    width: viewMode === 'split' ? '50%' : '100%',
                    background: 'white',
                    overflow: 'auto',
                    padding: '2rem',
                  }}
                >
                  <div className="markdown-preview prose prose-lg max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                    >
                      {currentChapter.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-chapter" style={{ width: '100%', background: 'white' }}>
              <p>Select a chapter to start editing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
