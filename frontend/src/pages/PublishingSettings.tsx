import { useState, useEffect } from 'react';
import { BookOpen, Save, FileText, User, Copyright } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Switch } from '../components/ui/Switch';
import { useBookStore } from '../store';

export default function PublishingSettings() {
  const { book, updateBook } = useBookStore();
  const [saved, setSaved] = useState(false);

  // Initialize local state
  const [showAuthorName, setShowAuthorName] = useState(book?.publishingInfo?.showAuthorName ?? true);
  const [penName, setPenName] = useState(book?.publishingInfo?.penName ?? book?.author ?? '');
  const [edition, setEdition] = useState(book?.publishingInfo?.edition ?? 'First edition');
  const [yearOfPublication, setYearOfPublication] = useState(
    book?.publishingInfo?.yearOfPublication ?? new Date().getFullYear().toString()
  );
  const [publisherName, setPublisherName] = useState(book?.publishingInfo?.publisherName ?? '');

  const [isbns, setIsbns] = useState({
    epub: book?.publishingInfo?.isbns?.epub ?? '',
    kindle: book?.publishingInfo?.isbns?.kindle ?? '',
    paperback: book?.publishingInfo?.isbns?.paperback ?? '',
    hardcover: book?.publishingInfo?.isbns?.hardcover ?? '',
    pdf: book?.publishingInfo?.isbns?.pdf ?? '',
  });

  const [collaborators, setCollaborators] = useState(
    book?.publishingInfo?.collaborators ?? []
  );

  const [legalClauses, setLegalClauses] = useState({
    allRightsReserved: book?.legalClauses?.allRightsReserved ?? true,
    fiction: book?.legalClauses?.fiction ?? false,
    moralRights: book?.legalClauses?.moralRights ?? true,
    externalContent: book?.legalClauses?.externalContent ?? false,
    designations: book?.legalClauses?.designations ?? false,
  });

  const [epigraph, setEpigraph] = useState(book?.publishingInfo?.epigraph ?? '');
  const [foreword, setForeword] = useState(book?.publishingInfo?.foreword ?? '');
  const [dedication, setDedication] = useState(book?.publishingInfo?.dedication ?? '');
  const [preface, setPreface] = useState(book?.publishingInfo?.preface ?? '');
  const [acknowledgements, setAcknowledgements] = useState(book?.publishingInfo?.acknowledgements ?? '');
  const [aboutTheAuthor, setAboutTheAuthor] = useState(book?.publishingInfo?.aboutTheAuthor ?? '');
  const [alsoByTheAuthor, setAlsoByTheAuthor] = useState(book?.publishingInfo?.alsoByTheAuthor ?? '');

  // Helper function to count words
  const countWords = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleSave = () => {
    if (!book) return;

    updateBook({
      publishingInfo: {
        showAuthorName,
        penName,
        edition,
        yearOfPublication,
        isbns,
        publisherName,
        collaborators,
        epigraph,
        foreword,
        dedication,
        preface,
        acknowledgements,
        aboutTheAuthor,
        alsoByTheAuthor,
      },
      legalClauses,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No book loaded. Please create a book first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Publishing Settings</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Author Display */}
          <Card>
            <CardHeader>
              <CardTitle>Author Display</CardTitle>
              <CardDescription>
                Configure how the author name appears in the book
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showAuthor">Show Author Name in Book</Label>
                <Switch
                  id="showAuthor"
                  checked={showAuthorName}
                  onCheckedChange={setShowAuthorName}
                />
              </div>
              {showAuthorName && (
                <div className="space-y-2">
                  <Label htmlFor="penName">Pen Name / Author Name</Label>
                  <Input
                    id="penName"
                    value={penName}
                    onChange={(e) => setPenName(e.target.value)}
                    placeholder="Enter author name to display"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Copyright Page */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copyright className="h-5 w-5" />
                Copyright Information
              </CardTitle>
              <CardDescription>
                Configure copyright page details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edition">Edition</Label>
                  <Input
                    id="edition"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    placeholder="e.g., First edition"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year of Publication</Label>
                  <Input
                    id="year"
                    type="number"
                    value={yearOfPublication}
                    onChange={(e) => setYearOfPublication(e.target.value)}
                    placeholder={new Date().getFullYear().toString()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher Name</Label>
                <Input
                  id="publisher"
                  value={publisherName}
                  onChange={(e) => setPublisherName(e.target.value)}
                  placeholder="e.g., Learning Science Publishing"
                />
              </div>

              <div className="space-y-3">
                <Label>ISBNs (Optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="EPUB ISBN"
                    value={isbns.epub}
                    onChange={(e) => setIsbns({ ...isbns, epub: e.target.value })}
                  />
                  <Input
                    placeholder="Kindle ISBN"
                    value={isbns.kindle}
                    onChange={(e) => setIsbns({ ...isbns, kindle: e.target.value })}
                  />
                  <Input
                    placeholder="Paperback ISBN"
                    value={isbns.paperback}
                    onChange={(e) => setIsbns({ ...isbns, paperback: e.target.value })}
                  />
                  <Input
                    placeholder="Hardcover ISBN"
                    value={isbns.hardcover}
                    onChange={(e) => setIsbns({ ...isbns, hardcover: e.target.value })}
                  />
                  <Input
                    placeholder="PDF ISBN"
                    value={isbns.pdf}
                    onChange={(e) => setIsbns({ ...isbns, pdf: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Legal Clauses</Label>
                <div className="space-y-2">
                  {[
                    { key: 'allRightsReserved', label: 'All Rights Reserved' },
                    { key: 'fiction', label: 'Fiction Disclaimer' },
                    { key: 'moralRights', label: 'Moral Rights' },
                    { key: 'externalContent', label: 'External Content Disclaimer' },
                    { key: 'designations', label: 'Trademarks & Designations' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                      <Switch
                        id={key}
                        checked={legalClauses[key as keyof typeof legalClauses]}
                        onCheckedChange={(checked) =>
                          setLegalClauses({ ...legalClauses, [key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Front Matter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Front Matter
              </CardTitle>
              <CardDescription>
                Optional sections before the main content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="epigraph">Epigraph</Label>
                  {epigraph && (
                    <span className="text-xs text-muted-foreground">
                      {countWords(epigraph)} words
                    </span>
                  )}
                </div>
                <Textarea
                  id="epigraph"
                  value={epigraph}
                  onChange={(e) => setEpigraph(e.target.value)}
                  placeholder="A brief quotation or saying at the beginning of your book..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  An epigraph is a short quotation or saying that sets the tone for the book
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="foreword">Foreword</Label>
                  {foreword && (
                    <span className="text-xs text-muted-foreground">
                      {countWords(foreword)} words
                    </span>
                  )}
                </div>
                <Textarea
                  id="foreword"
                  value={foreword}
                  onChange={(e) => setForeword(e.target.value)}
                  placeholder="Usually written by someone other than the author..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  A foreword is typically written by someone other than the author
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dedication">Dedication</Label>
                  {dedication && (
                    <span className="text-xs text-muted-foreground">
                      {countWords(dedication)} words
                    </span>
                  )}
                </div>
                <Textarea
                  id="dedication"
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="To my family, friends, and mentors..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="preface">Preface</Label>
                  {preface && (
                    <span className="text-xs text-muted-foreground">
                      {countWords(preface)} words
                    </span>
                  )}
                </div>
                <Textarea
                  id="preface"
                  value={preface}
                  onChange={(e) => setPreface(e.target.value)}
                  placeholder="This book was born from..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  A preface is written by the author to explain the book's purpose
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="acknowledgements">Acknowledgements</Label>
                  {acknowledgements && (
                    <span className="text-xs text-muted-foreground">
                      {countWords(acknowledgements)} words
                    </span>
                  )}
                </div>
                <Textarea
                  id="acknowledgements"
                  value={acknowledgements}
                  onChange={(e) => setAcknowledgements(e.target.value)}
                  placeholder="I would like to thank..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Back Matter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Back Matter
              </CardTitle>
              <CardDescription>
                Optional sections after the main content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="aboutAuthor">About the Author</Label>
                  {aboutTheAuthor && (
                    <span className="text-xs text-muted-foreground">
                      {countWords(aboutTheAuthor)} words
                    </span>
                  )}
                </div>
                <Textarea
                  id="aboutAuthor"
                  value={aboutTheAuthor}
                  onChange={(e) => setAboutTheAuthor(e.target.value)}
                  placeholder="Write a brief biography..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="alsoBy">Also by the Author</Label>
                  {alsoByTheAuthor && (
                    <span className="text-xs text-muted-foreground">
                      {countWords(alsoByTheAuthor)} words
                    </span>
                  )}
                </div>
                <Textarea
                  id="alsoBy"
                  value={alsoByTheAuthor}
                  onChange={(e) => setAlsoByTheAuthor(e.target.value)}
                  placeholder="List other books by the author..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg">
              <Save className="h-4 w-4 mr-2" />
              {saved ? 'Saved!' : 'Save Publishing Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
