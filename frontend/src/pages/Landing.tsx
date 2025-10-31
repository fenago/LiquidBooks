import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Code, GraduationCap, FileText, Zap, Palette, Rocket } from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card.js';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <motion.div
          initial="initial"
          animate="animate"
          className="text-center max-w-5xl mx-auto"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="h-4 w-4 text-primary animate-float" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-Powered Book Creation Platform
            </span>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            className="text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Create Interactive Books
            </span>
            <br />
            <span className="text-foreground">with AI Magic</span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your ideas into stunning, professional books.
            Powered by cutting-edge AI, designed for creators, educators, and authors.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link to="/create/plan">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg font-semibold shadow-lg shadow-primary/25 glow-primary transition-all duration-300"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Creating
                </Button>
              </motion.div>
            </Link>
            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg font-semibold hover:bg-primary/10 transition-all duration-300"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  My Books
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <span>Beautiful Output</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>AI-Enhanced</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">AI-Powered</CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">
                  Generate complete books with AI assistance
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4 shadow-sm">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold">Full Control</CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">
                  Write manually with optional AI help
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-sm">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Live Code</CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">
                  Executable code in 100+ languages
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="h-full shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4 shadow-sm">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold">Assessments</CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">
                  Interactive quizzes and challenges
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-2">
            Built on <BookOpen className="h-4 w-4" /> Liquid Books • Open Source • Provider Agnostic
          </p>
        </motion.div>
      </section>
    </div>
  );
}
