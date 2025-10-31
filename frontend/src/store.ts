import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, Chapter, Artifact, Enhancement, BuildResult } from './types.js';

interface BookStore {
  // Core Book State
  book: Book | null;
  currentChapter: Chapter | null;

  // Artifact State
  artifacts: Artifact[];

  // Enhancement State
  enhancements: Enhancement[];

  // Build State
  buildResult: BuildResult | null;
  isBuilding: boolean;

  // Book Actions
  setBook: (book: Book) => void;
  updateBook: (updates: Partial<Book>) => void;
  clearBook: () => void;

  // Chapter Actions
  setCurrentChapter: (chapter: Chapter | null) => void;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  updateChapterContent: (id: string, content: string) => void;
  updateChapterStatus: (id: string, status: Chapter['status']) => void;
  addChapter: (chapter: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;
  reorderChapters: (chapters: Chapter[]) => void;

  // Artifact Actions
  setArtifacts: (artifacts: Artifact[]) => void;
  addArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  deleteArtifact: (id: string) => void;
  clearArtifacts: () => void;

  // Enhancement Actions
  setEnhancements: (enhancements: Enhancement[]) => void;
  clearEnhancements: () => void;

  // Build Actions
  setBuildResult: (result: BuildResult | null) => void;
  setIsBuilding: (isBuilding: boolean) => void;
}

export const useBookStore = create<BookStore>()(
  persist(
    (set) => ({
      // Initial State
      book: null,
      currentChapter: null,
      artifacts: [],
      enhancements: [],
      buildResult: null,
      isBuilding: false,

      // Book Actions
      setBook: (book) => set({ book }),

      updateBook: (updates) =>
        set((state) => {
          if (!state.book) return state;
          return { book: { ...state.book, ...updates } };
        }),

      clearBook: () =>
        set({
          book: null,
          currentChapter: null,
          artifacts: [],
          enhancements: [],
          buildResult: null,
        }),

      // Chapter Actions
      setCurrentChapter: (chapter) => set({ currentChapter: chapter }),

      updateChapter: (id, updates) =>
        set((state) => {
          if (!state.book) return state;
          const updatedChapters = state.book.chapters.map((ch) =>
            ch.id === id ? { ...ch, ...updates } : ch
          );
          return {
            book: { ...state.book, chapters: updatedChapters },
            currentChapter:
              state.currentChapter?.id === id
                ? { ...state.currentChapter, ...updates }
                : state.currentChapter,
          };
        }),

      updateChapterContent: (id, content) =>
        set((state) => {
          if (!state.book) return state;
          const updatedChapters = state.book.chapters.map((ch) =>
            ch.id === id ? { ...ch, content } : ch
          );
          return {
            book: { ...state.book, chapters: updatedChapters },
            currentChapter:
              state.currentChapter?.id === id
                ? { ...state.currentChapter, content }
                : state.currentChapter,
          };
        }),

      updateChapterStatus: (id, status) =>
        set((state) => {
          if (!state.book) return state;
          const updatedChapters = state.book.chapters.map((ch) =>
            ch.id === id ? { ...ch, status } : ch
          );
          return {
            book: { ...state.book, chapters: updatedChapters },
            currentChapter:
              state.currentChapter?.id === id
                ? { ...state.currentChapter, status }
                : state.currentChapter,
          };
        }),

      addChapter: (chapterData) =>
        set((state) => {
          if (!state.book) return state;
          const newChapter: Chapter = {
            id: `chapter-${Date.now()}`,
            title: chapterData.title || 'New Chapter',
            content: chapterData.content || `# ${chapterData.title || 'New Chapter'}\n\nStart writing here...`,
            order: state.book.chapters.length,
            status: 'not_started',
            ...chapterData,
          };
          return {
            book: {
              ...state.book,
              chapters: [...state.book.chapters, newChapter],
            },
          };
        }),

      deleteChapter: (id) =>
        set((state) => {
          if (!state.book) return state;
          return {
            book: {
              ...state.book,
              chapters: state.book.chapters.filter((ch) => ch.id !== id),
            },
            currentChapter:
              state.currentChapter?.id === id ? null : state.currentChapter,
          };
        }),

      reorderChapters: (chapters) =>
        set((state) => {
          if (!state.book) return state;
          return {
            book: {
              ...state.book,
              chapters: chapters.map((ch, index) => ({ ...ch, order: index })),
            },
          };
        }),

      // Artifact Actions
      setArtifacts: (artifacts) => set({ artifacts }),

      addArtifact: (artifact) =>
        set((state) => ({
          artifacts: [...state.artifacts, artifact],
        })),

      updateArtifact: (id, updates) =>
        set((state) => ({
          artifacts: state.artifacts.map((art) =>
            art.id === id ? { ...art, ...updates } : art
          ),
        })),

      deleteArtifact: (id) =>
        set((state) => ({
          artifacts: state.artifacts.filter((art) => art.id !== id),
        })),

      clearArtifacts: () => set({ artifacts: [] }),

      // Enhancement Actions
      setEnhancements: (enhancements) => set({ enhancements }),
      clearEnhancements: () => set({ enhancements: [] }),

      // Build Actions
      setBuildResult: (result) => set({ buildResult: result }),
      setIsBuilding: (isBuilding) => set({ isBuilding }),
    }),
    {
      name: 'liquidbooks-storage',
      partialize: (state) => ({
        book: state.book,
        artifacts: state.artifacts,
        enhancements: state.enhancements,
      }),
    }
  )
);
