import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Sparkles, Save } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Label } from './ui/Label';
import type { ChapterTemplate } from '../constants/chapterTemplates';

interface CustomTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: ChapterTemplate) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CustomTemplateDialog({ isOpen, onClose, onSave }: CustomTemplateDialogProps) {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateStructure, setTemplateStructure] = useState<string[]>(['']);
  const [templateExample, setTemplateExample] = useState('');

  // AI generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleAddStructureItem = () => {
    setTemplateStructure([...templateStructure, '']);
  };

  const handleRemoveStructureItem = (index: number) => {
    const newStructure = templateStructure.filter((_, i) => i !== index);
    setTemplateStructure(newStructure.length > 0 ? newStructure : ['']);
  };

  const handleStructureItemChange = (index: number, value: string) => {
    const newStructure = [...templateStructure];
    newStructure[index] = value;
    setTemplateStructure(newStructure);
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 500);

      const response = await fetch(`${API_BASE_URL}/api/ai/generate-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: aiPrompt })
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      const data = await response.json();
      if (data.success) {
        const template = JSON.parse(data.template);
        setTemplateName(template.name);
        setTemplateDescription(template.description);
        setTemplateStructure(template.structure);
        setTemplateExample(template.example);
        setMode('manual'); // Switch to manual mode to allow editing
      }
    } catch (error) {
      console.error('Error generating template:', error);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);
    }
  };

  const handleSave = () => {
    if (!templateName.trim() || !templateDescription.trim()) {
      alert('Please provide a name and description for your template');
      return;
    }

    const validStructure = templateStructure.filter(item => item.trim());
    if (validStructure.length === 0) {
      alert('Please provide at least one structure item');
      return;
    }

    const newTemplate: ChapterTemplate = {
      id: `custom_${Date.now()}`,
      name: templateName,
      description: templateDescription,
      structure: validStructure,
      example: templateExample || `# ${templateName}\n\n[Your content here...]`
    };

    onSave(newTemplate);
    handleClose();
  };

  const handleClose = () => {
    setTemplateName('');
    setTemplateDescription('');
    setTemplateStructure(['']);
    setTemplateExample('');
    setAiPrompt('');
    setMode('manual');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl border border-border"
        >
          {/* Header */}
          <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create Custom Template</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode Selection */}
          <div className="p-6 border-b border-border">
            <div className="flex gap-2">
              <Button
                onClick={() => setMode('manual')}
                variant={mode === 'manual' ? 'default' : 'outline'}
                className="flex-1"
              >
                Manual Creation
              </Button>
              <Button
                onClick={() => setMode('ai')}
                variant={mode === 'ai' ? 'default' : 'outline'}
                className="flex-1"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Assisted
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {mode === 'ai' ? (
              <>
                <div className="space-y-2">
                  <Label>Describe Your Template</Label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the type of chapter template you want. For example: 'A template for technical deep-dive chapters with emphasis on code examples and best practices'"
                    rows={4}
                    disabled={isGenerating}
                  />
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Generating template...</span>
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

                <Button
                  onClick={handleGenerateWithAI}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Template
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g., Advanced Tutorial"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Brief description of this template's purpose and structure"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Structure Sections</Label>
                    <Button
                      onClick={handleAddStructureItem}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Section
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {templateStructure.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => handleStructureItemChange(index, e.target.value)}
                          placeholder={`Section ${index + 1}`}
                          className="flex-1"
                        />
                        {templateStructure.length > 1 && (
                          <Button
                            onClick={() => handleRemoveStructureItem(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-example">Example (Optional)</Label>
                  <Textarea
                    id="template-example"
                    value={templateExample}
                    onChange={(e) => setTemplateExample(e.target.value)}
                    placeholder="Provide an example of what a chapter using this template might look like"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {mode === 'manual' && (
            <div className="sticky bottom-0 bg-background border-t border-border p-6 flex gap-3">
              <Button onClick={handleClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
