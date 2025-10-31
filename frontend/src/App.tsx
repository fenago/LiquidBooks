import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.js';
import Navigation from './components/Navigation.js';
import Footer from './components/Footer.js';
import BackgroundEffects from './components/BackgroundEffects.js';
import Landing from './pages/Landing.js';
import Dashboard from './pages/Dashboard.js';
import Settings from './pages/Settings.js';
import AdvancedSettings from './pages/AdvancedSettings.js';
import BookPlanner from './pages/BookPlanner.js';
import OutlineReview from './pages/OutlineReview.js';
import ChapterBuilder from './pages/ChapterBuilder.js';
import ArtifactManager from './pages/ArtifactManager.js';
import BookAssembler from './pages/BookAssembler.js';
import BookPublisher from './pages/BookPublisher.js';
import AudienceResearch from './pages/AudienceResearch.js';
import BookCreator from './components/BookCreator.js';
import Editor from './components/Editor.js';
import { useBookStore } from './store.js';

function AppRoutes() {
  const { book } = useBookStore();
  const navigate = useNavigate();
  const location = useLocation();
  const showNav = location.pathname !== '/';

  return (
    <>
      {showNav && <Navigation />}
      <div className="pb-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/advanced" element={<AdvancedSettings />} />
          <Route path="/audience" element={<AudienceResearch />} />
          <Route path="/create/plan" element={<BookPlanner />} />
          <Route path="/create/outline" element={<OutlineReview />} />
          <Route path="/create/chapters" element={<ChapterBuilder />} />
          <Route path="/create/artifacts" element={<ArtifactManager />} />
          <Route path="/create/assemble" element={<BookAssembler />} />
          <Route path="/create/publish" element={<BookPublisher />} />
          <Route
            path="/create"
            element={
              <BookCreator
                onComplete={() => navigate('/editor')}
                onCancel={() => navigate('/dashboard')}
              />
            }
          />
          <Route
            path="/editor"
            element={book ? <Editor /> : <Dashboard />}
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-background relative">
        <BackgroundEffects />
        <AppRoutes />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
