import { useState } from 'react';
import { X, Sparkles, RotateCcw, Save } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Textarea } from './ui/Textarea';

interface PromptEditorProps {
  systemPrompt: string;
  userPrompt: string;
  estimatedTokens?: number;
  estimatedCost?: number;
  onClose: () => void;
  onGenerate: (customSystemPrompt?: string, customUserPrompt?: string) => void;
  title?: string;
}

export default function PromptEditor({
  systemPrompt,
  userPrompt,
  estimatedTokens = 0,
  estimatedCost = 0,
  onClose,
  onGenerate,
  title
}: PromptEditorProps) {
  const [activeTab, setActiveTab] = useState<'system' | 'user'>('system');
  const [editedSystemPrompt, setEditedSystemPrompt] = useState(systemPrompt);
  const [editedUserPrompt, setEditedUserPrompt] = useState(userPrompt);
  const [isEditing, setIsEditing] = useState(false);

  const hasChanges =
    editedSystemPrompt !== systemPrompt || editedUserPrompt !== userPrompt;

  const handleReset = () => {
    setEditedSystemPrompt(systemPrompt);
    setEditedUserPrompt(userPrompt);
    setIsEditing(false);
  };

  const handleSaveTemplate = () => {
    // Save to localStorage for now
    const templates = JSON.parse(localStorage.getItem('prompt_templates') || '[]');
    const newTemplate = {
      id: Date.now().toString(),
      name: `Custom Template ${templates.length + 1}`,
      systemPrompt: editedSystemPrompt,
      userPrompt: editedUserPrompt,
      createdAt: new Date().toISOString()
    };
    templates.push(newTemplate);
    localStorage.setItem('prompt_templates', JSON.stringify(templates));
    alert('Template saved successfully!');
  };

  const handleGenerate = () => {
    if (hasChanges) {
      onGenerate(editedSystemPrompt, editedUserPrompt);
    } else {
      onGenerate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{title || 'AI Prompt Editor'}</CardTitle>
              <CardDescription>
                {isEditing ? 'Edit the prompts below' : 'Preview the prompts that will be sent to AI'}
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'system'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              System Prompt
            </button>
            <button
              onClick={() => setActiveTab('user')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              User Prompt
            </button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-6">
          {activeTab === 'system' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">System Prompt</h3>
                  <p className="text-sm text-muted-foreground">
                    Defines the AI's role and writing style
                  </p>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editedSystemPrompt}
                  onChange={(e) => setEditedSystemPrompt(e.target.value)}
                  rows={18}
                  className="font-mono text-sm"
                />
              ) : (
                <pre className="p-4 bg-muted rounded-lg overflow-auto text-sm whitespace-pre-wrap">
                  {editedSystemPrompt}
                </pre>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">User Prompt</h3>
                  <p className="text-sm text-muted-foreground">
                    The specific request and structure for the book outline
                  </p>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={editedUserPrompt}
                  onChange={(e) => setEditedUserPrompt(e.target.value)}
                  rows={18}
                  className="font-mono text-sm"
                />
              ) : (
                <pre className="p-4 bg-muted rounded-lg overflow-auto text-sm whitespace-pre-wrap">
                  {editedUserPrompt}
                </pre>
              )}
            </div>
          )}
        </CardContent>

        <div className="border-t p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Estimated Tokens: <span className="font-semibold text-foreground">{estimatedTokens}</span></div>
              <div>Estimated Cost: <span className="font-semibold text-foreground">${estimatedCost.toFixed(3)}</span></div>
              {hasChanges && (
                <div className="text-amber-500 font-medium">Changes not saved</div>
              )}
            </div>
            <div className="flex gap-2">
              {isEditing && (
                <>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    disabled={!hasChanges}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleSaveTemplate}
                    variant="outline"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                </>
              )}
              <Button
                onClick={handleGenerate}
                className="min-w-32"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
