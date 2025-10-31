import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Artifact } from '../types.js';

interface ArtifactInsertPosition {
  chapterId: string;
  position: 'start' | 'end' | number; // line number or position
  context?: string;
}

interface ArtifactStore {
  // State
  artifacts: Artifact[];
  insertPositions: Map<string, ArtifactInsertPosition>; // artifactId -> position
  generatingArtifacts: Set<string>; // Set of chapter IDs currently generating artifacts
  uploadedAssets: Map<string, string>; // artifactId -> uploaded file URL/path

  // Filters
  selectedCategory: string | null;
  selectedChapter: number | null;
  searchQuery: string;

  // Actions - Artifact Management
  setArtifacts: (artifacts: Artifact[]) => void;
  addArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  deleteArtifact: (id: string) => void;
  clearArtifacts: () => void;
  getArtifactsByChapter: (chapterNumber: number) => Artifact[];
  getArtifactsByCategory: (category: string) => Artifact[];
  getArtifactsByType: (type: Artifact['type']) => Artifact[];

  // Actions - Generation Status
  setGenerating: (chapterId: string, generating: boolean) => void;
  isGenerating: (chapterId: string) => boolean;

  // Actions - Insert Positions
  setInsertPosition: (artifactId: string, position: ArtifactInsertPosition) => void;
  getInsertPosition: (artifactId: string) => ArtifactInsertPosition | undefined;
  removeInsertPosition: (artifactId: string) => void;

  // Actions - Asset Upload
  setUploadedAsset: (artifactId: string, assetUrl: string) => void;
  getUploadedAsset: (artifactId: string) => string | undefined;
  removeUploadedAsset: (artifactId: string) => void;

  // Actions - Filters
  setSelectedCategory: (category: string | null) => void;
  setSelectedChapter: (chapterNumber: number | null) => void;
  setSearchQuery: (query: string) => void;
  getFilteredArtifacts: () => Artifact[];

  // Actions - Statistics
  getStats: () => {
    total: number;
    byType: Record<Artifact['type'], number>;
    byCategory: Record<string, number>;
    withAssets: number;
    withPositions: number;
  };
}

export const useArtifactStore = create<ArtifactStore>()(
  persist(
    (set, get) => ({
      // Initial State
      artifacts: [],
      insertPositions: new Map(),
      generatingArtifacts: new Set(),
      uploadedAssets: new Map(),
      selectedCategory: null,
      selectedChapter: null,
      searchQuery: '',

      // Artifact Management
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
        set((state) => {
          const newInsertPositions = new Map(state.insertPositions);
          newInsertPositions.delete(id);

          const newUploadedAssets = new Map(state.uploadedAssets);
          newUploadedAssets.delete(id);

          return {
            artifacts: state.artifacts.filter((art) => art.id !== id),
            insertPositions: newInsertPositions,
            uploadedAssets: newUploadedAssets,
          };
        }),

      clearArtifacts: () =>
        set({
          artifacts: [],
          insertPositions: new Map(),
          uploadedAssets: new Map(),
        }),

      getArtifactsByChapter: (chapterNumber) => {
        return get().artifacts.filter((art) => art.chapter_number === chapterNumber);
      },

      getArtifactsByCategory: (category) => {
        return get().artifacts.filter((art) => art.category === category);
      },

      getArtifactsByType: (type) => {
        return get().artifacts.filter((art) => art.type === type);
      },

      // Generation Status
      setGenerating: (chapterId, generating) =>
        set((state) => {
          const newSet = new Set(state.generatingArtifacts);
          if (generating) {
            newSet.add(chapterId);
          } else {
            newSet.delete(chapterId);
          }
          return { generatingArtifacts: newSet };
        }),

      isGenerating: (chapterId) => {
        return get().generatingArtifacts.has(chapterId);
      },

      // Insert Positions
      setInsertPosition: (artifactId, position) =>
        set((state) => {
          const newMap = new Map(state.insertPositions);
          newMap.set(artifactId, position);
          return { insertPositions: newMap };
        }),

      getInsertPosition: (artifactId) => {
        return get().insertPositions.get(artifactId);
      },

      removeInsertPosition: (artifactId) =>
        set((state) => {
          const newMap = new Map(state.insertPositions);
          newMap.delete(artifactId);
          return { insertPositions: newMap };
        }),

      // Asset Upload
      setUploadedAsset: (artifactId, assetUrl) =>
        set((state) => {
          const newMap = new Map(state.uploadedAssets);
          newMap.set(artifactId, assetUrl);
          return { uploadedAssets: newMap };
        }),

      getUploadedAsset: (artifactId) => {
        return get().uploadedAssets.get(artifactId);
      },

      removeUploadedAsset: (artifactId) =>
        set((state) => {
          const newMap = new Map(state.uploadedAssets);
          newMap.delete(artifactId);
          return { uploadedAssets: newMap };
        }),

      // Filters
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedChapter: (chapterNumber) => set({ selectedChapter: chapterNumber }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      getFilteredArtifacts: () => {
        const { artifacts, selectedCategory, selectedChapter, searchQuery } = get();

        return artifacts.filter((art) => {
          // Category filter
          if (selectedCategory && art.category !== selectedCategory) {
            return false;
          }

          // Chapter filter
          if (selectedChapter !== null && art.chapter_number !== selectedChapter) {
            return false;
          }

          // Search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const searchableText = `${art.title} ${art.description} ${art.category}`.toLowerCase();
            if (!searchableText.includes(query)) {
              return false;
            }
          }

          return true;
        });
      },

      // Statistics
      getStats: () => {
        const { artifacts, uploadedAssets, insertPositions } = get();

        const byType: Record<Artifact['type'], number> = {
          image: 0,
          video: 0,
          diagram: 0,
          interactive: 0,
        };

        const byCategory: Record<string, number> = {};

        artifacts.forEach((art) => {
          byType[art.type]++;
          byCategory[art.category] = (byCategory[art.category] || 0) + 1;
        });

        return {
          total: artifacts.length,
          byType,
          byCategory,
          withAssets: uploadedAssets.size,
          withPositions: insertPositions.size,
        };
      },
    }),
    {
      name: 'liquidbooks-artifacts',
      partialize: (state) => ({
        artifacts: state.artifacts,
        insertPositions: Array.from(state.insertPositions.entries()),
        uploadedAssets: Array.from(state.uploadedAssets.entries()),
      }),
      // Custom merge for Map serialization
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        insertPositions: new Map(persistedState?.insertPositions || []),
        uploadedAssets: new Map(persistedState?.uploadedAssets || []),
        generatingArtifacts: new Set(),
      }),
    }
  )
);

// Helper functions for artifact categories
export const ARTIFACT_CATEGORIES = {
  IMAGES: [
    'Chapter Cover',
    'Concept Illustration',
    'Process Diagram',
    'Before/After Comparison',
    'Visual Metaphor',
  ],
  VIDEOS: [
    'Tutorial Video',
    'Concept Animation',
    'Process Walkthrough',
  ],
  DIAGRAMS: [
    'Flowchart',
    'Sequence Diagram',
    'Class Diagram',
    'Mind Map',
    'Gantt Chart',
  ],
  INTERACTIVE: [
    'Quiz',
    'Code Playground',
    'Interactive Visualization',
    'Collapsible Section',
  ],
};

export const getCategoryForType = (type: Artifact['type']): string[] => {
  switch (type) {
    case 'image':
      return ARTIFACT_CATEGORIES.IMAGES;
    case 'video':
      return ARTIFACT_CATEGORIES.VIDEOS;
    case 'diagram':
      return ARTIFACT_CATEGORIES.DIAGRAMS;
    case 'interactive':
      return ARTIFACT_CATEGORIES.INTERACTIVE;
    default:
      return [];
  }
};
