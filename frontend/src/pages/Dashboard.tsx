import { BookOpen, Plus, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create stunning, interactive Liquid Books powered by AI
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="cursor-pointer group h-full shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
              <CardHeader className="p-8">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-sm">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl font-bold">Create New Book</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Start with AI or create manually
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Link to="/create/plan">
                  <Button className="w-full h-12 text-base font-medium glow-primary shadow-lg shadow-primary/25">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="cursor-pointer group h-full shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
              <CardHeader className="p-8">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4 shadow-sm">
                    <BookOpen className="h-8 w-8 text-accent" />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl font-bold">My Books</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  View and edit your books
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Link to="/editor">
                  <Button variant="outline" className="w-full h-12 text-base font-medium hover:bg-accent/10">
                    Open Editor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="cursor-pointer group h-full shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
              <CardHeader className="p-8">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-sm">
                    <SettingsIcon className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl font-bold">Settings</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Configure API keys & preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Link to="/settings">
                  <Button variant="outline" className="w-full h-12 text-base font-medium hover:bg-primary/10">
                    Configure
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="space-y-3 p-8 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
            >
              <h3 className="text-2xl font-semibold">🤖 AI-Powered</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Generate book outlines and chapters using OpenAI, Claude, or OpenRouter
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="space-y-3 p-8 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
            >
              <h3 className="text-2xl font-semibold">📚 Liquid Books</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Full support for code blocks, math equations, quizzes, and more
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="space-y-3 p-8 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
            >
              <h3 className="text-2xl font-semibold">🎨 Beautiful Output</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Professional, interactive HTML books with modern styling
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="space-y-3 p-8 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
            >
              <h3 className="text-2xl font-semibold">🔒 Privacy First</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Your API keys stay in your browser - no database required
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Version Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          v0.2.0 • 21st.dev Design System • Advanced Shadows & Springs
        </motion.div>
      </div>
    </div>
  );
}
