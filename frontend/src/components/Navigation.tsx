import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Settings, Moon, Sun, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button.js';
import { useTheme } from '../contexts/ThemeContext.js';

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/editor', label: 'Editor', icon: BookOpen },
    { path: '/audience', label: 'Audience', icon: Users },
    { path: '/create/artifacts', label: 'Artifacts', icon: Sparkles },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="border-b border-border/40 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              <BookOpen className="h-7 w-7 text-primary relative z-10" />
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-full blur-md"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                LiquidBooks
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">Create. Enhance. Publish.</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant={active ? 'default' : 'ghost'}
                      size="sm"
                      className={`
                        relative transition-all duration-300
                        ${active ? 'shadow-lg shadow-primary/25 glow-primary' : 'hover:bg-primary/10'}
                      `}
                    >
                      <motion.div
                        animate={active ? { rotate: [0, -5, 5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                      </motion.div>
                      {item.label}
                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative overflow-hidden group"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'light' ? 0 : 180 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5 transition-colors group-hover:text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 transition-colors group-hover:text-accent" />
                  )}
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}
