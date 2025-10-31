import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Sparkles,
  Download,
  Loader2,
  BookOpen,
  FileText,
  Heart,
  Palette,
  Megaphone,
  Lightbulb,
  Eye
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../components/ui/Dialog';
import {
  AWARENESS_STAGES,
  OFFER_QUESTIONS,
  buildAvatarPrompt,
  type OfferQuestion
} from '../constants/avatarResearch';

interface OfferResponses {
  [questionId: string]: string;
}

interface Avatar {
  stage: string;
  name: string;
  tagline: string;
  demographics: any;
  psychographics: any;
  buyer_psychology: any;
}

interface AllAvatars {
  unaware?: Avatar;
  problem_aware?: Avatar;
  solution_aware?: Avatar;
  product_aware?: Avatar;
  most_aware?: Avatar;
}

interface DiaryEntries {
  before: string;
  during: string;
  after: string;
}

// Brand identity is now returned as markdown string from backend
// interface BrandIdentity {
//   brand_positioning?: any;
//   visual_identity?: any;
//   messaging_framework?: any;
//   voice_and_tone?: any;
//   emotional_triggers?: any;
//   content_strategy?: any;
//   marketing_language?: any;
//   brand_story?: any;
// }

interface MarketingAssets {
  headlines?: string[];
  email_sequences?: any;
  social_media?: any[];
  ad_copy?: any[];
  landing_page?: any;
  video_scripts?: any[];
  content_pillars?: any[];
  conversion_assets?: any;
  launch_campaign?: any;
}

interface ResearchData {
  allAvatars?: AllAvatars;
  diaryEntries?: DiaryEntries;
  brandIdentity?: string; // Now markdown instead of JSON object
  landingPageSpec?: string;
  marketingAssets?: MarketingAssets;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
};

// Default test data for easy testing
const DEFAULT_TEST_RESPONSES: OfferResponses = {
  offer: "The Complete Guide to AI-Powered Marketing - A comprehensive book that teaches business owners how to leverage AI tools to automate their marketing, generate high-converting copy, and scale their business without hiring expensive agencies.",
  audience: "Small business owners and entrepreneurs",
  problem: "Spending $5,000+/month on marketing agencies but not getting the results they want. They feel overwhelmed by marketing complexity and can't afford to keep hiring expensive experts.",
  price_point: "$97 one-time payment",
  target_market: "Business owners aged 30-50 with revenue between $100k-$500k/year who are tech-savvy enough to use AI tools but don't have time to figure everything out themselves",
  benefit: "Create professional marketing campaigns themselves using AI - saving 70% on marketing costs while increasing leads by 200%. Go from agency-dependent to marketing-confident in 30 days."
};

export default function AudienceResearch() {
  const [responses, setResponses] = useState<OfferResponses>(DEFAULT_TEST_RESPONSES);
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState('');
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [partialAvatars, setPartialAvatars] = useState<AllAvatars>({});
  const [activeTab, setActiveTab] = useState<'questionnaire' | 'avatars' | 'diary' | 'brand' | 'landing_page' | 'marketing'>('questionnaire');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const problemAwareStage = AWARENESS_STAGES.find(s => s.id === 'problem_aware');

  // Download utility functions
  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = async (content: string, filename: string) => {
    // For PDF, we'll use browser print functionality
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download PDF');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2, h3 { color: #333; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const formatAvatarForDownload = (avatar: any): string => {
    let content = `${avatar.name || 'Avatar'}\n`;
    content += `${avatar.tagline || ''}\n`;
    content += `${'='.repeat(60)}\n\n`;

    // Who Are They
    if (avatar.who_are_they) {
      content += `👤 WHO ARE THEY\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `Job: ${avatar.who_are_they.job || 'N/A'}\n`;
      content += `Income: ${avatar.who_are_they.household_income || 'N/A'}\n`;
      content += `Status: ${avatar.who_are_they.marital_status || 'N/A'}\n`;
      content += `Education: ${avatar.who_are_they.education_level || 'N/A'}\n`;
      content += `Age: ${avatar.who_are_they.age_range || 'N/A'}\n`;
      content += `Location: ${avatar.who_are_they.geographic_location || 'N/A'}\n\n`;
    }

    // What They Do & Like
    if (avatar.what_they_do_and_like) {
      content += `💼 WHAT THEY DO & LIKE\n`;
      content += `${'-'.repeat(60)}\n`;

      if (avatar.what_they_do_and_like.daily_activities?.length > 0) {
        content += `Daily Activities:\n`;
        avatar.what_they_do_and_like.daily_activities.forEach((activity: string) => {
          content += `  • ${activity}\n`;
        });
        content += '\n';
      }

      if (avatar.what_they_do_and_like.hobbies_and_interests?.length > 0) {
        content += `Hobbies & Interests:\n`;
        avatar.what_they_do_and_like.hobbies_and_interests.forEach((hobby: string) => {
          content += `  • ${hobby}\n`;
        });
        content += '\n';
      }

      if (avatar.what_they_do_and_like.media_consumption?.length > 0) {
        content += `Media Consumption:\n`;
        avatar.what_they_do_and_like.media_consumption.forEach((media: string) => {
          content += `  • ${media}\n`;
        });
        content += '\n';
      }
    }

    // What Keeps Them Up At Night
    if (avatar.smart_market_questions) {
      content += `💭 WHAT KEEPS THEM UP AT NIGHT\n`;
      content += `${'-'.repeat(60)}\n`;

      if (avatar.smart_market_questions.keeps_awake_at_night) {
        content += `${avatar.smart_market_questions.keeps_awake_at_night}\n\n`;
      }

      if (avatar.smart_market_questions.daily_frustrations?.length > 0) {
        content += `Daily Frustrations:\n`;
        avatar.smart_market_questions.daily_frustrations.forEach((frustration: string) => {
          content += `  • ${frustration}\n`;
        });
        content += '\n';
      }

      if (avatar.smart_market_questions.secret_worries?.length > 0) {
        content += `Secret Worries:\n`;
        avatar.smart_market_questions.secret_worries.forEach((worry: string) => {
          content += `  • ${worry}\n`;
        });
        content += '\n';
      }
    }

    // Primary Wants
    if (avatar.primary_wants) {
      content += `🎯 PRIMARY WANTS\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `Wants to Gain: ${avatar.primary_wants.wants_to_gain || 'N/A'}\n`;
      content += `Wants to Avoid: ${avatar.primary_wants.wants_to_avoid || 'N/A'}\n\n`;
    }

    // Purchasing Habits
    if (avatar.purchasing_habits) {
      content += `💰 PURCHASING HABITS\n`;
      content += `${'-'.repeat(60)}\n`;
      content += `Price Tolerance: ${avatar.purchasing_habits.price_tolerance || 'N/A'}\n`;
      content += `Purchase Triggers: ${avatar.purchasing_habits.purchase_triggers || 'N/A'}\n`;
      content += `Common Objections: ${avatar.purchasing_habits.common_objections || 'N/A'}\n\n`;
    }

    // Empathy Map
    if (avatar.empathy_map) {
      content += `❤️ EMPATHY MAP\n`;
      content += `${'-'.repeat(60)}\n`;

      if (avatar.empathy_map.thinks?.length > 0) {
        content += `Thinks:\n`;
        avatar.empathy_map.thinks.forEach((think: string) => {
          content += `  • ${think}\n`;
        });
        content += '\n';
      }

      if (avatar.empathy_map.feels?.length > 0) {
        content += `Feels:\n`;
        avatar.empathy_map.feels.forEach((feel: string) => {
          content += `  • ${feel}\n`;
        });
        content += '\n';
      }

      if (avatar.empathy_map.says?.length > 0) {
        content += `Says:\n`;
        avatar.empathy_map.says.forEach((say: string) => {
          content += `  • ${say}\n`;
        });
        content += '\n';
      }

      if (avatar.empathy_map.does?.length > 0) {
        content += `Does:\n`;
        avatar.empathy_map.does.forEach((does: string) => {
          content += `  • ${does}\n`;
        });
        content += '\n';
      }
    }

    return content;
  };

  const formatDiaryForDownload = (diary: DiaryEntries): string => {
    let content = `CUSTOMER JOURNEY DIARY\n`;
    content += `${'='.repeat(60)}\n`;
    content += `The emotional journey from struggle to success\n\n`;

    content += `😔 BEFORE: Struggling with the Problem\n`;
    content += `${'-'.repeat(60)}\n`;
    content += `${diary.before}\n\n\n`;

    content += `🌱 DURING: Discovering & Implementing\n`;
    content += `${'-'.repeat(60)}\n`;
    content += `${diary.during}\n\n\n`;

    content += `✨ AFTER: Life After Transformation\n`;
    content += `${'-'.repeat(60)}\n`;
    content += `${diary.after}\n`;

    return content;
  };

  const formatMarketingAssetsForDownload = (assets: MarketingAssets): string => {
    let content = `MARKETING ASSETS KIT\n`;
    content += `${'='.repeat(60)}\n`;
    content += `Ready-to-use headlines, emails, ads, social posts, and more\n\n`;

    // Headlines
    if (assets.headlines && assets.headlines.length > 0) {
      content += `📢 HEADLINES\n`;
      content += `${'-'.repeat(60)}\n`;
      assets.headlines.forEach((headline: string, i: number) => {
        content += `${i + 1}. ${headline}\n`;
      });
      content += '\n\n';
    }

    // Email Sequences
    if (assets.email_sequences) {
      content += `📧 EMAIL SEQUENCES\n`;
      content += `${'-'.repeat(60)}\n`;
      content += JSON.stringify(assets.email_sequences, null, 2);
      content += '\n\n';
    }

    // Social Media
    if (assets.social_media && assets.social_media.length > 0) {
      content += `📱 SOCIAL MEDIA POSTS\n`;
      content += `${'-'.repeat(60)}\n`;
      content += JSON.stringify(assets.social_media, null, 2);
      content += '\n\n';
    }

    // Ad Copy
    if (assets.ad_copy && assets.ad_copy.length > 0) {
      content += `💰 AD COPY\n`;
      content += `${'-'.repeat(60)}\n`;
      content += JSON.stringify(assets.ad_copy, null, 2);
      content += '\n\n';
    }

    // Video Scripts
    if (assets.video_scripts && assets.video_scripts.length > 0) {
      content += `🎥 VIDEO SCRIPTS\n`;
      content += `${'-'.repeat(60)}\n`;
      content += JSON.stringify(assets.video_scripts, null, 2);
      content += '\n\n';
    }

    // Content Pillars
    if (assets.content_pillars && assets.content_pillars.length > 0) {
      content += `🎯 CONTENT PILLARS\n`;
      content += `${'-'.repeat(60)}\n`;
      content += JSON.stringify(assets.content_pillars, null, 2);
      content += '\n\n';
    }

    // Conversion Assets
    if (assets.conversion_assets) {
      content += `✨ CONVERSION ASSETS\n`;
      content += `${'-'.repeat(60)}\n`;
      content += JSON.stringify(assets.conversion_assets, null, 2);
      content += '\n\n';
    }

    // Launch Campaign
    if (assets.launch_campaign) {
      content += `🚀 LAUNCH CAMPAIGN\n`;
      content += `${'-'.repeat(60)}\n`;
      content += JSON.stringify(assets.launch_campaign, null, 2);
      content += '\n';
    }

    return content;
  };

  // Timer effect to track elapsed time during generation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isGenerating && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 100); // Update every 100ms for smooth countdown
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, startTime]);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateResponses = (): boolean => {
    for (const question of OFFER_QUESTIONS) {
      if (question.required && !responses[question.id]?.trim()) {
        alert(`Please answer: ${question.question}`);
        return false;
      }
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateResponses()) return;

    setIsGenerating(true);
    setStartTime(Date.now()); // Start the timer
    setElapsedTime(0);
    setPartialAvatars({}); // Clear previous partial avatars
    setGeneratingProgress(0);

    try {
      // Step 1: Generate ONLY Problem Aware avatar (the most important one)
      const avatarPrompt = buildAvatarPrompt(responses);
      const allAvatars: AllAvatars = {};

      // Retry logic for robustness
      const MAX_RETRIES = 2;
      let retryCount = 0;
      let result: any = null;

      while (retryCount <= MAX_RETRIES) {
        try {
          if (retryCount > 0) {
            setGeneratingStep(`⚡ Retry ${retryCount}/${MAX_RETRIES} - Regenerating avatar...`);
          } else {
            setGeneratingStep('⭐ Generating your Problem Aware avatar (the most valuable audience)...');
          }
          setGeneratingProgress(10 + (retryCount * 5));

          const response = await fetch('http://localhost:8000/api/ai/generate-single-avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: avatarPrompt,
              stage: 'problem_aware'
            })
          });

          result = await response.json();

          if (result.success && result.avatar) {
            allAvatars.problem_aware = result.avatar;

            // Show the avatar immediately!
            setPartialAvatars({ problem_aware: result.avatar });
            setGeneratingProgress(100);

            if (result.warning) {
              console.warn('⚠️ Avatar generated with warnings:', result.warning);
            }

            console.log('✅ Problem Aware avatar generated:', result.avatar);
            break; // Success! Exit retry loop
          } else {
            throw new Error(result.error || 'Failed to generate avatar');
          }
        } catch (error) {
          retryCount++;
          console.error(`❌ Attempt ${retryCount} failed:`, error);

          if (retryCount > MAX_RETRIES) {
            // All retries exhausted
            const errorMsg = result?.error || (error as Error).message;
            alert(`Failed to generate avatar after ${MAX_RETRIES} attempts.\n\nError: ${errorMsg}\n\nPlease try again or check your AI provider settings.`);
            setIsGenerating(false);
            return;
          }

          // Wait before retry
          setGeneratingStep(`⏳ Attempt failed, retrying in 2 seconds... (${retryCount}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Only save the Problem Aware avatar
      // Diary, brand, and landing page are now generated on-demand with manual buttons
      setResearchData({
        allAvatars
      });

      setActiveTab('avatars');
    } catch (error) {
      console.error('Error generating research data:', error);
      alert('Failed to generate research. Please check the console for details.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
      setStartTime(null);
      setElapsedTime(0);
    }
  };

  const handleExportAvatars = () => {
    if (!researchData?.allAvatars) return;
    const markdown = generateAvatarsMarkdown();
    downloadMarkdown(markdown, 'customer-avatars-5-stages.md');
  };

  const handleExportDiary = () => {
    if (!researchData?.diaryEntries) return;
    const markdown = generateDiaryMarkdown();
    downloadMarkdown(markdown, 'customer-journey-diary.md');
  };

  const handleExportBrand = () => {
    if (!researchData?.brandIdentity) return;
    // Brand identity is now markdown, so we can export it directly with header
    let markdown = '# Brand Identity System\n\n';
    markdown += '*Optimized for your Problem Aware audience*\n\n';
    markdown += '---\n\n';
    markdown += researchData.brandIdentity;
    downloadMarkdown(markdown, 'brand-identity-system.md');
  };

  const handleExportLandingPage = () => {
    if (!researchData?.landingPageSpec) return;
    let markdown = '# Landing Page Specification\n\n';
    markdown += '*Complete PRD for building a high-converting landing page*\n\n';
    markdown += '---\n\n';
    markdown += researchData.landingPageSpec;
    downloadMarkdown(markdown, 'landing-page-spec.md');
  };

  const handleExportMarketing = () => {
    if (!researchData?.marketingAssets) return;
    const markdown = generateMarketingMarkdown();
    downloadMarkdown(markdown, 'marketing-assets-kit.md');
  };

  const handleGenerateDiary = async () => {
    if (!researchData?.allAvatars?.problem_aware) {
      alert('Please generate the Problem Aware avatar first');
      return;
    }

    setIsGenerating(true);
    setGeneratingStep('📖 Writing customer journey diary (Before/During/After)...');
    setStartTime(Date.now());

    try {
      const problemAwareAvatar = researchData.allAvatars.problem_aware;
      const diaryEntries: DiaryEntries = { before: '', during: '', after: '' };

      for (const diaryType of ['before', 'during', 'after']) {
        setGeneratingStep(`📖 Writing diary entry: ${diaryType.replace('_', ' ')}...`);

        const diaryResponse = await fetch('http://localhost:8000/api/ai/generate-avatar-diary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            avatar_profile: problemAwareAvatar,
            diary_type: diaryType,
            offer_context: responses
          })
        });

        const diaryResult = await diaryResponse.json();
        if (diaryResult.success) {
          diaryEntries[diaryType as keyof DiaryEntries] = diaryResult.diary_entry;
        }
      }

      setResearchData({
        ...researchData,
        diaryEntries
      });
      setActiveTab('diary');
    } catch (error) {
      console.error('Error generating diary:', error);
      alert('Failed to generate diary. Please try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
      setStartTime(null);
      setElapsedTime(0);
    }
  };

  const handleGenerateBrand = async () => {
    if (!researchData?.allAvatars?.problem_aware) {
      alert('Please generate the Problem Aware avatar first');
      return;
    }

    setIsGenerating(true);
    setGeneratingStep('🎨 Creating comprehensive brand identity system...');
    setStartTime(Date.now());

    try {
      const problemAwareAvatar = researchData.allAvatars.problem_aware;

      const brandResponse = await fetch('http://localhost:8000/api/ai/generate-brand-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_aware_avatar: problemAwareAvatar,
          diary_entries: researchData.diaryEntries,
          offer_context: responses
        })
      });

      const brandResult = await brandResponse.json();
      if (brandResult.success) {
        setResearchData({
          ...researchData,
          brandIdentity: brandResult.brand_identity
        });
        setActiveTab('brand');
      } else {
        throw new Error('Brand identity generation failed');
      }
    } catch (error) {
      console.error('Error generating brand identity:', error);
      alert('Failed to generate brand identity. Please try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
      setStartTime(null);
      setElapsedTime(0);
    }
  };

  const handleGenerateLandingPage = async () => {
    if (!researchData?.allAvatars?.problem_aware) {
      alert('Please generate the Problem Aware avatar first');
      return;
    }

    setIsGenerating(true);
    setGeneratingStep('📄 Creating landing page specification (17-section PRD)...');
    setStartTime(Date.now());

    try {
      const problemAwareAvatar = researchData.allAvatars.problem_aware;

      const landingPageResponse = await fetch('http://localhost:8000/api/ai/generate-landing-page-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_aware_avatar: problemAwareAvatar,
          brand_identity: researchData.brandIdentity,
          diary_entries: researchData.diaryEntries,
          offer_context: responses
        })
      });

      const landingPageResult = await landingPageResponse.json();
      if (landingPageResult.success) {
        setResearchData({
          ...researchData,
          landingPageSpec: landingPageResult.landing_page_spec
        });
        setActiveTab('landing_page');
      } else {
        throw new Error('Landing page generation failed');
      }
    } catch (error) {
      console.error('Error generating landing page:', error);
      alert('Failed to generate landing page specification. Please try again.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
      setStartTime(null);
      setElapsedTime(0);
    }
  };

  const handleGenerateMarketing = async () => {
    if (!researchData?.allAvatars || !researchData?.brandIdentity) {
      alert('Please generate avatars and brand identity first');
      return;
    }

    setIsGenerating(true);
    setGeneratingStep('📣 Generating marketing assets (headlines, emails, ads, social posts)...');
    setStartTime(Date.now());

    try {
      const problemAwareAvatar = researchData.allAvatars.problem_aware;

      const marketingResponse = await fetch('http://localhost:8000/api/ai/generate-marketing-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_aware_avatar: problemAwareAvatar,
          brand_identity: researchData.brandIdentity,
          diary_entries: researchData.diaryEntries,
          landing_page_spec: researchData.landingPageSpec,
          offer_context: responses
        })
      });

      const marketingResult = await marketingResponse.json();
      if (marketingResult.success) {
        setResearchData({
          ...researchData,
          marketingAssets: marketingResult.marketing_assets
        });
        setActiveTab('marketing');
      } else {
        throw new Error('Marketing generation failed');
      }
    } catch (error) {
      console.error('Error generating marketing assets:', error);
      alert('Failed to generate marketing assets. Please check the console for details.');
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
      setStartTime(null);
      setElapsedTime(0);
    }
  };

  const handleExportAll = () => {
    if (!researchData) return;

    let markdown = '# Complete Audience Research & Marketing Package\n\n';
    markdown += '*Generated with LiquidBooks Audience Research*\n\n';
    markdown += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
    markdown += '---\n\n';

    markdown += '# Table of Contents\n\n';
    markdown += '1. [Customer Avatars (All 5 Awareness Stages)](#customer-avatars)\n';
    markdown += '2. [Customer Journey Diary](#customer-journey-diary)\n';
    markdown += '3. [Brand Identity System](#brand-identity-system)\n';
    markdown += '4. [Marketing Assets Kit](#marketing-assets-kit)\n\n';
    markdown += '---\n\n';

    markdown += '<a name="customer-avatars"></a>\n\n';
    markdown += generateAvatarsMarkdown() + '\n\n';
    markdown += '---\n\n';

    markdown += '<a name="customer-journey-diary"></a>\n\n';
    markdown += generateDiaryMarkdown() + '\n\n';
    markdown += '---\n\n';

    markdown += '<a name="brand-identity-system"></a>\n\n';
    markdown += generateBrandMarkdown() + '\n\n';
    markdown += '---\n\n';

    markdown += '<a name="marketing-assets-kit"></a>\n\n';
    markdown += generateMarketingMarkdown();

    downloadMarkdown(markdown, 'complete-audience-marketing-package.md');
  };

  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateAvatarsMarkdown = (): string => {
    if (!researchData?.allAvatars) return '';

    let md = '# Customer Avatars - 5 Stages of Market Awareness\n\n';
    md += '*Based on Eugene Schwartz\'s Breakthrough Advertising*\n\n';

    const stages = [
      { key: 'problem_aware', emoji: '⭐', note: 'PRIMARY AUDIENCE' },
      { key: 'solution_aware', emoji: '🤔', note: '' },
      { key: 'product_aware', emoji: '🧐', note: '' },
      { key: 'most_aware', emoji: '💡', note: '' },
      { key: 'unaware', emoji: '😴', note: '' }
    ];

    stages.forEach(({ key, emoji, note }) => {
      const avatar = researchData.allAvatars![key as keyof AllAvatars];
      if (!avatar) return;

      md += `\n## ${emoji} ${avatar.name} - ${avatar.stage.replace('_', ' ').toUpperCase()}\n\n`;
      if (note) md += `**${note}**\n\n`;
      md += `> ${avatar.tagline}\n\n`;

      if (avatar.demographics) {
        md += `### Demographics\n`;
        md += `- **Age:** ${avatar.demographics.age_range}\n`;
        md += `- **Occupation:** ${avatar.demographics.occupation}\n`;
        md += `- **Income:** ${avatar.demographics.income}\n`;
        md += `- **Life Stage:** ${avatar.demographics.life_stage}\n\n`;
      }

      if (avatar.psychographics) {
        md += `### Current Situation\n\n`;
        md += `${avatar.psychographics.situation}\n\n`;

        if (avatar.psychographics.pain_points?.length) {
          md += `**Pain Points:**\n`;
          avatar.psychographics.pain_points.forEach((pain: string) => {
            md += `- ${pain}\n`;
          });
          md += '\n';
        }

        if (avatar.psychographics.desires?.length) {
          md += `**Desires:**\n`;
          avatar.psychographics.desires.forEach((desire: string) => {
            md += `- ${desire}\n`;
          });
          md += '\n';
        }
      }

      if (avatar.buyer_psychology) {
        md += `### Buyer Psychology\n\n`;
        md += `**Awareness Level:** ${avatar.buyer_psychology.awareness_level}\n\n`;

        if (avatar.buyer_psychology.key_insights?.length) {
          md += `**Key Insights:**\n`;
          avatar.buyer_psychology.key_insights.forEach((insight: string) => {
            md += `- ${insight}\n`;
          });
          md += '\n';
        }
      }

      md += '---\n';
    });

    return md;
  };

  const generateDiaryMarkdown = (): string => {
    if (!researchData?.diaryEntries) return '';
    const { before, during, after } = researchData.diaryEntries;

    let md = '# Customer Journey Diary\n\n';
    md += '*First-person emotional journey of your Problem Aware customer*\n\n';
    md += '---\n\n';

    md += '## 😔 Before: Struggling with the Problem\n\n';
    md += `${before}\n\n`;
    md += '---\n\n';

    md += '## 🌱 During: Discovering & Implementing the Solution\n\n';
    md += `${during}\n\n`;
    md += '---\n\n';

    md += '## ✨ After: Life After Transformation\n\n';
    md += `${after}\n\n`;

    return md;
  };

  const generateBrandMarkdown = (): string => {
    if (!researchData?.brandIdentity) return '';
    // Brand identity is now markdown, so just return it with header
    let md = '# Brand Identity System\n\n';
    md += '*Optimized for your Problem Aware audience*\n\n';
    md += '---\n\n';
    md += researchData.brandIdentity;
    return md;
  };

  const generateMarketingMarkdown = (): string => {
    if (!researchData?.marketingAssets) return '';
    const assets = researchData.marketingAssets;

    let md = '# Marketing Assets Kit\n\n';
    md += '*Ready-to-use marketing assets for your Problem Aware audience*\n\n';
    md += '---\n\n';

    // Headlines
    if (assets.headlines?.length) {
      md += '## Headlines (20 Variations)\n\n';
      assets.headlines.forEach((headline: string, i: number) => {
        md += `${i + 1}. ${headline}\n`;
      });
      md += '\n---\n\n';
    }

    // Email Sequences
    if (assets.email_sequences) {
      md += '## Email Sequences\n\n';
      Object.entries(assets.email_sequences).forEach(([key, value]: [string, any]) => {
        md += `### ${key.replace(/_/g, ' ').toUpperCase()}\n\n`;
        if (Array.isArray(value)) {
          value.forEach((email: any, i: number) => {
            md += `**Email ${i + 1}**\n\n`;
            md += `**Subject:** ${email.subject || email.title}\n\n`;
            if (email.preview) md += `*${email.preview}*\n\n`;
            md += `${email.body || email.content}\n\n`;
            md += '---\n\n';
          });
        }
      });
    }

    // Social Media
    if (assets.social_media?.length) {
      md += '## Social Media Posts\n\n';
      assets.social_media.forEach((post: any, i: number) => {
        md += `### Post ${i + 1} - ${post.platform || 'Social'}\n\n`;
        if (post.type) md += `**Type:** ${post.type}\n\n`;
        md += `${post.content || post.text}\n\n`;
        if (post.hashtags) md += `${post.hashtags}\n\n`;
        md += '---\n\n';
      });
    }

    // Ad Copy
    if (assets.ad_copy?.length) {
      md += '## Ad Copy\n\n';
      assets.ad_copy.forEach((ad: any, i: number) => {
        md += `### Ad ${i + 1} - ${ad.platform || 'Platform'}\n\n`;
        if (ad.format) md += `**Format:** ${ad.format}\n\n`;
        if (ad.headline) md += `**Headline:** ${ad.headline}\n\n`;
        md += `${ad.body || ad.content}\n\n`;
        if (ad.cta) md += `**CTA:** ${ad.cta}\n\n`;
        md += '---\n\n';
      });
    }

    // Video Scripts
    if (assets.video_scripts?.length) {
      md += '## Video Scripts\n\n';
      assets.video_scripts.forEach((script: any, i: number) => {
        md += `### Video ${i + 1}\n\n`;
        if (script.type) md += `**Type:** ${script.type}\n\n`;
        if (script.title) md += `**Title:** ${script.title}\n\n`;
        md += `${script.script || script.content}\n\n`;
        md += '---\n\n';
      });
    }

    // Content Pillars
    if (assets.content_pillars?.length) {
      md += '## Content Pillars & Ideas\n\n';
      assets.content_pillars.forEach((pillar: any, i: number) => {
        md += `### Pillar ${i + 1}: ${pillar.name || pillar.title}\n\n`;
        if (pillar.description) md += `${pillar.description}\n\n`;
        if (pillar.ideas?.length) {
          md += '**Content Ideas:**\n\n';
          pillar.ideas.forEach((idea: string) => {
            md += `- ${idea}\n`;
          });
          md += '\n';
        }
        md += '---\n\n';
      });
    }

    // Conversion Assets
    if (assets.conversion_assets) {
      md += '## Conversion Assets\n\n';
      Object.entries(assets.conversion_assets).forEach(([key, value]: [string, any]) => {
        md += `### ${key.replace(/_/g, ' ').toUpperCase()}\n\n`;
        if (Array.isArray(value)) {
          value.forEach((item: any) => {
            if (typeof item === 'string') {
              md += `- ${item}\n`;
            } else {
              if (item.title) md += `**${item.title}**\n\n`;
              if (item.description) md += `${item.description}\n\n`;
            }
          });
          md += '\n';
        }
      });
      md += '---\n\n';
    }

    // Launch Campaign
    if (assets.launch_campaign) {
      md += '## Launch Campaign\n\n';
      Object.entries(assets.launch_campaign).forEach(([phase, content]: [string, any]) => {
        md += `### ${phase.replace(/_/g, ' ').toUpperCase()}\n\n`;
        if (typeof content === 'string') {
          md += `${content}\n\n`;
        } else {
          Object.entries(content).forEach(([key, val]: [string, any]) => {
            md += `**${key.replace(/_/g, ' ')}:**\n\n`;
            if (typeof val === 'string') {
              md += `${val}\n\n`;
            } else if (Array.isArray(val)) {
              val.forEach((item: string) => {
                md += `- ${item}\n`;
              });
              md += '\n';
            }
          });
        }
        md += '---\n\n';
      });
    }

    return md;
  };

  // Avatar Detail Modal Component
  const AvatarModal = () => {
    if (!selectedAvatar) return null;

    return (
      <Dialog open={avatarModalOpen} onOpenChange={setAvatarModalOpen}>
        <DialogContent className="!max-w-4xl !max-h-[85vh] !overflow-y-auto p-0">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedAvatar?.name}</DialogTitle>
            <DialogDescription className="text-base">{selectedAvatar?.tagline}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Who Are They */}
            {selectedAvatar?.who_are_they && (
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  👤 Who Are They
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><strong>Job:</strong> {selectedAvatar.who_are_they.job}</div>
                  <div><strong>Income:</strong> {selectedAvatar.who_are_they.household_income}</div>
                  <div><strong>Marital Status:</strong> {selectedAvatar.who_are_they.marital_status}</div>
                  <div><strong>Education:</strong> {selectedAvatar.who_are_they.education_level}</div>
                  <div className="col-span-2"><strong>Age Range:</strong> {selectedAvatar.who_are_they.age_range}</div>
                  <div className="col-span-2"><strong>Geographic:</strong> {selectedAvatar.who_are_they.geographic_location}</div>
                </div>
              </div>
            )}

            {/* What They Do & Like */}
            {selectedAvatar?.what_they_do_and_like && (
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  💼 What They Do & Like
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="block mb-1">Daily Activities:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.what_they_do_and_like.daily_activities}</p>
                  </div>
                  <div>
                    <strong className="block mb-1">Hobbies & Interests:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.what_they_do_and_like.hobbies_and_interests}</p>
                  </div>
                  <div>
                    <strong className="block mb-1">Media Consumption:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.what_they_do_and_like.media_consumption}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Market Questions */}
            {selectedAvatar?.smart_market_questions && (
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  💭 What Keeps Them Up At Night
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="block mb-1">3AM Worries:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.smart_market_questions.keeps_awake_at_night}</p>
                  </div>
                  {selectedAvatar.smart_market_questions.daily_frustrations && (
                    <div>
                      <strong className="block mb-1">Daily Frustrations:</strong>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedAvatar.smart_market_questions.daily_frustrations.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <strong className="block mb-1">Decision Bias:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.smart_market_questions.decision_bias}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Wants */}
            {selectedAvatar?.primary_wants && (
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  🎯 Primary Wants
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="block mb-1">Wants to Gain:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.primary_wants.wants_to_gain}</p>
                  </div>
                  <div>
                    <strong className="block mb-1">Wants to Avoid:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.primary_wants.wants_to_avoid}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Purchasing Habits */}
            {selectedAvatar?.purchasing_habits && (
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  💰 Purchasing Habits
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="block mb-1">Price Tolerance:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.purchasing_habits.price_tolerance}</p>
                  </div>
                  <div>
                    <strong className="block mb-1">Buying Triggers:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.purchasing_habits.buying_triggers}</p>
                  </div>
                  <div>
                    <strong className="block mb-1">Objections:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.purchasing_habits.objections}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Empathy Map */}
            {selectedAvatar?.empathy_map && (
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  ❤️ Empathy Map
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="block mb-1">Thinks:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.empathy_map.thinks}</p>
                  </div>
                  <div>
                    <strong className="block mb-1">Feels:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.empathy_map.feels}</p>
                  </div>
                  <div>
                    <strong className="block mb-1">Says:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.empathy_map.says}</p>
                  </div>
                  <div>
                    <strong className="block mb-1">Does:</strong>
                    <p className="text-muted-foreground">{selectedAvatar.empathy_map.does}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Full JSON (collapsed by default) */}
            <details className="border rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-sm flex items-center gap-2">
                <span>📋</span> View Full Avatar JSON
              </summary>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto mt-3 max-h-96">
                {JSON.stringify(selectedAvatar, null, 2)}
              </pre>
            </details>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Users className="h-10 w-10 text-primary" />
                Discover Your Perfect Audience
              </h1>
              <Badge variant="outline" className="text-xs">v0.15.0</Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              Answer 6 simple questions about YOUR OFFER, and AI will discover your perfect customer avatars, journey diary, brand identity, and complete marketing kit
            </p>
            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{problemAwareStage?.icon}</div>
                <div>
                  <div className="font-semibold text-primary flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    The WOW Factor: Get Out of Your Own Head
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Don't worry about knowing your audience in advance! Just tell us about YOUR BOOK/PRODUCT, and we'll use AI to discover your ideal Problem Aware customer - the person who knows they have a problem and is actively searching for your solution. Then we'll generate everything you need to reach them.
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 font-medium">
                    ⭐ Focus: Problem Aware is your PRIMARY audience (most valuable & easiest to convert)
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
              <TabsTrigger value="questionnaire">
                Questionnaire
              </TabsTrigger>
              <TabsTrigger value="avatars" disabled={!researchData}>
                Avatars
              </TabsTrigger>
              <TabsTrigger value="diary" disabled={!researchData?.diaryEntries}>
                Diary
              </TabsTrigger>
              <TabsTrigger value="brand" disabled={!researchData?.brandIdentity}>
                Brand
              </TabsTrigger>
              <TabsTrigger value="landing_page" disabled={!researchData?.landingPageSpec}>
                Landing Page
              </TabsTrigger>
              <TabsTrigger value="marketing" disabled={!researchData?.marketingAssets}>
                Marketing
              </TabsTrigger>
            </TabsList>

            {/* Questionnaire Tab */}
            <TabsContent value="questionnaire">
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Tell Us About Your Offer</CardTitle>
                    <CardDescription>
                      Answer these 6 questions about YOUR BOOK/PRODUCT (not your audience). The AI will discover your perfect customer from your answers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {OFFER_QUESTIONS.map((question: OfferQuestion) => (
                        <div key={question.id} className="space-y-2">
                          <label className="block text-sm font-medium">
                            {question.question}
                            {question.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          {question.helpText && (
                            <p className="text-xs text-muted-foreground">
                              {question.helpText}
                            </p>
                          )}
                          {question.type === 'textarea' ? (
                            <Textarea
                              value={responses[question.id] || ''}
                              onChange={(e) => handleResponseChange(question.id, e.target.value)}
                              placeholder={question.placeholder}
                              rows={4}
                              className="w-full"
                            />
                          ) : (
                            <Input
                              value={responses[question.id] || ''}
                              onChange={(e) => handleResponseChange(question.id, e.target.value)}
                              placeholder={question.placeholder}
                              className="w-full"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center mt-8 pt-6 border-t">
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        size="lg"
                        className="gap-2 px-8"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            {generatingStep}
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            Discover My Audience & Generate Everything
                          </>
                        )}
                      </Button>
                    </div>

                    {isGenerating && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-xl"
                        >
                          {/* Animated Progress Indicator */}
                        <div className="flex items-center justify-center mb-4">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                            <Sparkles className="h-12 w-12 text-primary relative z-10" />
                          </motion.div>
                        </div>

                        {/* Current Step */}
                        <motion.div
                          key={generatingStep}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                          className="text-center mb-6"
                        >
                          <p className="text-base font-medium text-foreground mb-1">
                            {generatingStep}
                          </p>

                          {/* Countdown Timer */}
                          {elapsedTime > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="my-4 p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg border border-primary/20"
                            >
                              <div className="flex items-center justify-center gap-3 mb-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="text-2xl"
                                >
                                  ⏱️
                                </motion.div>
                                <div>
                                  <div className="text-3xl font-bold text-primary tabular-nums">
                                    {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                                  </div>
                                  <div className="text-xs text-muted-foreground">elapsed</div>
                                </div>
                                <div className="h-8 w-px bg-border" />
                                <div>
                                  <div className="text-3xl font-bold text-foreground/70 tabular-nums">
                                    {Math.max(0, Math.floor((150 - elapsedTime) / 60))}:{Math.max(0, (150 - elapsedTime) % 60).toString().padStart(2, '0')}
                                  </div>
                                  <div className="text-xs text-muted-foreground">estimated remaining</div>
                                </div>
                              </div>
                              <div className="w-full bg-border/30 rounded-full h-2.5 overflow-hidden">
                                <motion.div
                                  className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 h-full rounded-full"
                                  initial={{ width: "0%" }}
                                  animate={{ width: `${Math.min(100, (elapsedTime / 150) * 100)}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Expected completion: 2-3 minutes
                              </p>
                            </motion.div>
                          )}

                          {generatingProgress > 0 && (
                            <div className="w-full bg-border/30 rounded-full h-2 mb-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${generatingProgress}%` }}
                              />
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {generatingProgress > 0 ? `${generatingProgress}% complete - High-quality avatar generation in progress` : 'Starting AI generation...'}
                          </p>
                          {generatingProgress === 0 && (
                            <p className="text-xs text-primary font-medium mt-1 animate-pulse">
                              ⚡ Deep analysis of your audience in progress
                            </p>
                          )}
                        </motion.div>

                        {/* Progress Steps */}
                        <div className="space-y-3">
                          {[
                            { label: 'All 5 customer avatars', icon: Users, completed: generatingStep.includes('journey') || generatingStep.includes('brand') || generatingStep.includes('landing') },
                            { label: 'Customer journey diary', icon: Heart, completed: generatingStep.includes('brand') || generatingStep.includes('landing') },
                            { label: 'Complete brand identity', icon: Palette, completed: generatingStep.includes('landing') },
                            { label: 'Landing page specification', icon: BookOpen, completed: false }
                          ].map((step, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                step.completed
                                  ? 'bg-primary/10 border border-primary/30'
                                  : generatingStep.toLowerCase().includes(step.label.toLowerCase().split(' ')[0])
                                  ? 'bg-primary/5 border border-primary/20'
                                  : 'bg-background/50 border border-border/50'
                              }`}
                            >
                              <motion.div
                                animate={
                                  step.completed
                                    ? { scale: 1, rotate: 0 }
                                    : generatingStep.toLowerCase().includes(step.label.toLowerCase().split(' ')[0])
                                    ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                                    : { scale: 1 }
                                }
                                transition={{
                                  duration: 1.5,
                                  repeat: step.completed ? 0 : Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                <step.icon className={`h-5 w-5 ${
                                  step.completed
                                    ? 'text-primary'
                                    : generatingStep.toLowerCase().includes(step.label.toLowerCase().split(' ')[0])
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                                }`} />
                              </motion.div>
                              <span className={`text-sm flex-1 ${
                                step.completed || generatingStep.toLowerCase().includes(step.label.toLowerCase().split(' ')[0])
                                  ? 'text-foreground font-medium'
                                  : 'text-muted-foreground'
                              }`}>
                                {step.label}
                              </span>
                              {step.completed && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                >
                                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                    <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                </motion.div>
                              )}
                              {!step.completed && generatingStep.toLowerCase().includes(step.label.toLowerCase().split(' ')[0]) && (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Loader2 className="h-5 w-5 text-primary" />
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                        </motion.div>

                        {/* Live Avatar Preview - Shows avatars as they're generated */}
                        {Object.keys(partialAvatars).length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-2 border-primary/30 rounded-xl space-y-4"
                          >
                            <div className="text-center pb-2 border-b border-primary/20">
                              <h3 className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
                                <span className="text-2xl">⭐</span>
                                Problem Aware Avatar (Your Perfect Customer)
                              </h3>
                              <p className="text-sm text-muted-foreground">The most valuable audience segment for your offer</p>
                            </div>
                            <div className="grid gap-3">
                              {Object.entries(partialAvatars).map(([stage, avatar]) => (
                                <motion.div
                                  key={stage}
                                  initial={{ opacity: 0, scale: 0.95, x: -20 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                >
                                  <Card className={`${stage === 'problem_aware' ? 'border-primary border-2 bg-primary/10' : 'bg-background'} hover:shadow-lg transition-shadow`}>
                                    <CardHeader className="pb-3">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />
                                            <CardTitle className="text-lg">{avatar.name || 'Avatar'}</CardTitle>
                                            {stage === 'problem_aware' && (
                                              <Badge variant="default" className="text-xs">⭐ PRIMARY</Badge>
                                            )}
                                          </div>
                                          <CardDescription className="text-sm mt-1 leading-relaxed">
                                            {avatar.tagline || stage.replace('_', ' ')}
                                          </CardDescription>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-4">
                                      {/* Full detailed sections */}
                                      {avatar.who_are_they && (
                                        <div className="border-l-2 border-primary pl-3">
                                          <h4 className="font-semibold text-sm mb-2">👤 Who Are They</h4>
                                          <div className="text-xs space-y-1 text-muted-foreground">
                                            <p><strong>Job:</strong> {avatar.who_are_they.job}</p>
                                            <p><strong>Income:</strong> {avatar.who_are_they.household_income}</p>
                                            <p><strong>Status:</strong> {avatar.who_are_they.marital_status}</p>
                                            <p><strong>Education:</strong> {avatar.who_are_they.education_level}</p>
                                          </div>
                                        </div>
                                      )}

                                      {avatar.smart_market_questions && (
                                        <div className="border-l-2 border-orange-500 pl-3">
                                          <h4 className="font-semibold text-sm mb-2">💭 What Keeps Them Up At Night</h4>
                                          <p className="text-xs text-muted-foreground leading-relaxed">{avatar.smart_market_questions.keeps_awake_at_night}</p>

                                          {avatar.smart_market_questions.daily_frustrations && (
                                            <div className="mt-2">
                                              <p className="text-xs font-medium mb-1">Daily Frustrations:</p>
                                              <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                                                {avatar.smart_market_questions.daily_frustrations.map((f: string, i: number) => (
                                                  <li key={i}>{f}</li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {avatar.primary_wants && (
                                        <div className="border-l-2 border-green-500 pl-3">
                                          <h4 className="font-semibold text-sm mb-2">🎯 Primary Wants</h4>
                                          <div className="text-xs space-y-1 text-muted-foreground">
                                            <p><strong>To Gain:</strong> {avatar.primary_wants.wants_to_gain}</p>
                                            <p><strong>To Avoid:</strong> {avatar.primary_wants.wants_to_avoid}</p>
                                          </div>
                                        </div>
                                      )}

                                      {avatar.purchasing_habits && (
                                        <div className="border-l-2 border-blue-500 pl-3">
                                          <h4 className="font-semibold text-sm mb-2">💰 Purchasing</h4>
                                          <div className="text-xs space-y-1 text-muted-foreground">
                                            <p><strong>Price Tolerance:</strong> {avatar.purchasing_habits.price_tolerance}</p>
                                            <p><strong>Decision Bias:</strong> {avatar.smart_market_questions?.decision_bias}</p>
                                          </div>
                                        </div>
                                      )}

                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full mt-2"
                                        onClick={() => {
                                          console.log('Full avatar data:', avatar);
                                          alert('Full avatar data logged to console. Press F12 to view.');
                                        }}
                                      >
                                        📋 View Full Avatar JSON
                                      </Button>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Avatars Tab */}
            <TabsContent value="avatars">
              {researchData?.allAvatars && (
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Your Customer Avatars (All 5 Stages)</h2>
                      <p className="text-sm text-muted-foreground">
                        Focus on Problem Aware (your PRIMARY audience), but know the others too
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleExportAvatars} variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Avatars
                      </Button>
                      <Button onClick={handleExportAll} className="gap-2">
                        <Download className="h-4 w-4" />
                        Export All
                      </Button>
                    </div>
                  </div>

                  {/* Problem Aware Avatar (Featured) - Full Display */}
                  {researchData.allAvatars.problem_aware && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="border-primary border-2 bg-primary/5">
                        <CardHeader>
                          <Badge variant="default" className="mb-2 w-fit">⭐ PRIMARY AUDIENCE</Badge>
                          <CardTitle className="text-3xl flex items-center gap-3">
                            <span className="text-5xl">{problemAwareStage?.icon}</span>
                            {researchData.allAvatars.problem_aware.name || 'Problem Aware Avatar'}
                          </CardTitle>
                          <CardDescription className="text-lg">
                            {researchData.allAvatars.problem_aware.tagline || 'Your primary target audience'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Who Are They */}
                          {researchData.allAvatars.problem_aware.who_are_they && (
                            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 rounded-r-lg">
                              <h3 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">
                                👤 Who Are They
                              </h3>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><strong>Job:</strong> {researchData.allAvatars.problem_aware.who_are_they.job || 'N/A'}</div>
                                <div><strong>Income:</strong> {researchData.allAvatars.problem_aware.who_are_they.household_income || 'N/A'}</div>
                                <div><strong>Status:</strong> {researchData.allAvatars.problem_aware.who_are_they.marital_status || 'N/A'}</div>
                                <div><strong>Education:</strong> {researchData.allAvatars.problem_aware.who_are_they.education_level || 'N/A'}</div>
                                <div><strong>Age:</strong> {researchData.allAvatars.problem_aware.who_are_they.age_range || 'N/A'}</div>
                                <div><strong>Location:</strong> {researchData.allAvatars.problem_aware.who_are_they.geographic_location || 'N/A'}</div>
                              </div>
                            </div>
                          )}

                          {/* What They Do & Like */}
                          {researchData.allAvatars.problem_aware.what_they_do_and_like && (
                            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/20 rounded-r-lg">
                              <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-400">
                                💼 What They Do & Like
                              </h3>
                              <div className="space-y-3 text-sm">
                                {researchData.allAvatars.problem_aware.what_they_do_and_like.daily_activities?.length > 0 && (
                                  <div>
                                    <strong>Daily Activities:</strong>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                      {researchData.allAvatars.problem_aware.what_they_do_and_like.daily_activities.map((activity: string, i: number) => (
                                        <li key={i}>{activity}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {researchData.allAvatars.problem_aware.what_they_do_and_like.hobbies_and_interests?.length > 0 && (
                                  <div>
                                    <strong>Hobbies & Interests:</strong>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                      {researchData.allAvatars.problem_aware.what_they_do_and_like.hobbies_and_interests.map((hobby: string, i: number) => (
                                        <li key={i}>{hobby}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {researchData.allAvatars.problem_aware.what_they_do_and_like.media_consumption?.length > 0 && (
                                  <div>
                                    <strong>Media Consumption:</strong>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                      {researchData.allAvatars.problem_aware.what_they_do_and_like.media_consumption.map((media: string, i: number) => (
                                        <li key={i}>{media}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* What Keeps Them Up At Night */}
                          {researchData.allAvatars.problem_aware.smart_market_questions && (
                            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 rounded-r-lg">
                              <h3 className="text-lg font-semibold mb-3 text-red-700 dark:text-red-400">
                                💭 What Keeps Them Up At Night
                              </h3>
                              <div className="space-y-3 text-sm">
                                {researchData.allAvatars.problem_aware.smart_market_questions.keeps_awake_at_night && (
                                  <p className="leading-relaxed">{researchData.allAvatars.problem_aware.smart_market_questions.keeps_awake_at_night}</p>
                                )}
                                {researchData.allAvatars.problem_aware.smart_market_questions.daily_frustrations?.length > 0 && (
                                  <div>
                                    <strong>Daily Frustrations:</strong>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                      {researchData.allAvatars.problem_aware.smart_market_questions.daily_frustrations.map((frustration: string, i: number) => (
                                        <li key={i}>{frustration}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {researchData.allAvatars.problem_aware.smart_market_questions.secret_worries?.length > 0 && (
                                  <div>
                                    <strong>Secret Worries:</strong>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                      {researchData.allAvatars.problem_aware.smart_market_questions.secret_worries.map((worry: string, i: number) => (
                                        <li key={i}>{worry}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Primary Wants */}
                          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
                            <h3 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-400">
                              🎯 Primary Wants
                            </h3>
                            <div className="space-y-3 text-sm">
                              <div>
                                <strong>Wants to Gain:</strong>
                                <p className="mt-1 leading-relaxed">{researchData.allAvatars.problem_aware.primary_wants?.wants_to_gain || 'N/A'}</p>
                              </div>
                              <div>
                                <strong>Wants to Avoid:</strong>
                                <p className="mt-1 leading-relaxed">{researchData.allAvatars.problem_aware.primary_wants?.wants_to_avoid || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Purchasing Habits */}
                          <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20 rounded-r-lg">
                            <h3 className="text-lg font-semibold mb-3 text-orange-700 dark:text-orange-400">
                              💰 Purchasing Habits
                            </h3>
                            <div className="space-y-3 text-sm">
                              <div>
                                <strong>Price Tolerance:</strong>
                                <p className="mt-1 leading-relaxed">{researchData.allAvatars.problem_aware.purchasing_habits?.price_tolerance || 'N/A'}</p>
                              </div>
                              <div>
                                <strong>Purchase Triggers:</strong>
                                <p className="mt-1 leading-relaxed">{researchData.allAvatars.problem_aware.purchasing_habits?.purchase_triggers || 'N/A'}</p>
                              </div>
                              <div>
                                <strong>Common Objections:</strong>
                                <p className="mt-1 leading-relaxed">{researchData.allAvatars.problem_aware.purchasing_habits?.common_objections || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Empathy Map */}
                          <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 rounded-r-lg">
                            <h3 className="text-lg font-semibold mb-3 text-indigo-700 dark:text-indigo-400">
                              ❤️ Empathy Map
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Thinks:</strong>
                                {researchData.allAvatars.problem_aware.empathy_map?.thinks?.length > 0 ? (
                                  <ul className="list-disc list-inside mt-1 space-y-1">
                                    {researchData.allAvatars.problem_aware.empathy_map.thinks.map((think: string, i: number) => (
                                      <li key={i}>{think}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="mt-1 text-muted-foreground">N/A</p>
                                )}
                              </div>
                              <div>
                                <strong>Feels:</strong>
                                {researchData.allAvatars.problem_aware.empathy_map?.feels?.length > 0 ? (
                                  <ul className="list-disc list-inside mt-1 space-y-1">
                                    {researchData.allAvatars.problem_aware.empathy_map.feels.map((feel: string, i: number) => (
                                      <li key={i}>{feel}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="mt-1 text-muted-foreground">N/A</p>
                                )}
                              </div>
                              <div>
                                <strong>Says:</strong>
                                {researchData.allAvatars.problem_aware.empathy_map?.says?.length > 0 ? (
                                  <ul className="list-disc list-inside mt-1 space-y-1">
                                    {researchData.allAvatars.problem_aware.empathy_map.says.map((say: string, i: number) => (
                                      <li key={i}>{say}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="mt-1 text-muted-foreground">N/A</p>
                                )}
                              </div>
                              <div>
                                <strong>Does:</strong>
                                {researchData.allAvatars.problem_aware.empathy_map?.does?.length > 0 ? (
                                  <ul className="list-disc list-inside mt-1 space-y-1">
                                    {researchData.allAvatars.problem_aware.empathy_map.does.map((does: string, i: number) => (
                                      <li key={i}>{does}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="mt-1 text-muted-foreground">N/A</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Download Buttons */}
                          <div className="mt-6 pt-6 border-t border-border">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              Download Avatar Profile
                            </h4>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const content = formatAvatarForDownload(researchData.allAvatars.problem_aware);
                                  downloadAsText(content, 'problem-aware-avatar');
                                }}
                                className="flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                .txt
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const content = formatAvatarForDownload(researchData.allAvatars.problem_aware);
                                  downloadAsMarkdown(content, 'problem-aware-avatar');
                                }}
                                className="flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                .md
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const content = formatAvatarForDownload(researchData.allAvatars.problem_aware);
                                  downloadAsPDF(content, 'problem-aware-avatar');
                                }}
                                className="flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                .pdf
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {researchData.allAvatars.problem_aware && (
                    <>
                      {/* Generate Other Avatars Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mt-6"
                      >
                        <Card className="border-dashed">
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Users className="h-5 w-5 text-primary" />
                              Generate Other Awareness Stage Avatars
                            </CardTitle>
                            <CardDescription>
                              Create detailed avatars for other stages of the awareness journey (Unaware, Solution Aware, Product Aware, Most Aware)
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {AWARENESS_STAGES.filter(stage => stage.id !== 'problem_aware').map((stage) => {
                                const isGenerated = researchData.allAvatars?.[stage.id as keyof AllAvatars];
                                return (
                                  <Button
                                    key={stage.id}
                                    variant={isGenerated ? "secondary" : "outline"}
                                    disabled={isGenerating}
                                    className="h-auto py-3 flex items-start gap-3 justify-start"
                                    onClick={() => {
                                      // Generate this specific avatar
                                      alert(`Generating ${stage.name} avatar... (Feature coming soon)`);
                                    }}
                                  >
                                    <span className="text-2xl">{stage.icon}</span>
                                    <div className="text-left">
                                      <div className="font-semibold">{stage.name}</div>
                                      <div className="text-xs opacity-70 line-clamp-2">{stage.description}</div>
                                      {isGenerated && (
                                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Generated</div>
                                      )}
                                    </div>
                                  </Button>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Generate Additional Assets Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                      >
                        <div className="border-t border-border pt-4 mt-6">
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Generate Additional Assets
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Now that you have your Problem Aware Avatar, generate these optional assets to deepen your marketing strategy
                          </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          <Button
                            onClick={handleGenerateDiary}
                            disabled={isGenerating || !!researchData.diaryEntries}
                            className="h-auto py-4 flex-col items-start gap-2"
                            variant={researchData.diaryEntries ? "secondary" : "default"}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Heart className="h-5 w-5" />
                              <span className="font-semibold">Customer Diary</span>
                            </div>
                            <span className="text-xs text-left opacity-80">
                              {researchData.diaryEntries ? '✓ Generated' : '3 emotional diary entries'}
                            </span>
                          </Button>

                          <Button
                            onClick={handleGenerateBrand}
                            disabled={isGenerating || !!researchData.brandIdentity}
                            className="h-auto py-4 flex-col items-start gap-2"
                            variant={researchData.brandIdentity ? "secondary" : "default"}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Palette className="h-5 w-5" />
                              <span className="font-semibold">Brand Identity</span>
                            </div>
                            <span className="text-xs text-left opacity-80">
                              {researchData.brandIdentity ? '✓ Generated' : 'Complete design system'}
                            </span>
                          </Button>

                          <Button
                            onClick={handleGenerateLandingPage}
                            disabled={isGenerating || !!researchData.landingPageSpec}
                            className="h-auto py-4 flex-col items-start gap-2"
                            variant={researchData.landingPageSpec ? "secondary" : "default"}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <FileText className="h-5 w-5" />
                              <span className="font-semibold">Landing Page</span>
                            </div>
                            <span className="text-xs text-left opacity-80">
                              {researchData.landingPageSpec ? '✓ Generated' : '17-section PRD spec'}
                            </span>
                          </Button>

                          <Button
                            onClick={handleGenerateMarketing}
                            disabled={isGenerating || !researchData.brandIdentity || !!researchData.marketingAssets}
                            className="h-auto py-4 flex-col items-start gap-2"
                            variant={researchData.marketingAssets ? "secondary" : "default"}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Megaphone className="h-5 w-5" />
                              <span className="font-semibold">Marketing Assets</span>
                            </div>
                            <span className="text-xs text-left opacity-80">
                              {researchData.marketingAssets ? '✓ Generated' : researchData.brandIdentity ? 'Emails, ads, headlines' : 'Requires brand first'}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                    </>
                  )}

                  {/* Other Avatars (Grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['solution_aware', 'product_aware', 'most_aware', 'unaware'].map(stage => {
                      const avatar = researchData.allAvatars![stage as keyof AllAvatars];
                      if (!avatar) return null;

                      return (
                        <motion.div
                          key={stage}
                          whileHover={{ scale: 1.02, y: -4 }}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedAvatar(avatar);
                            setAvatarModalOpen(true);
                          }}
                        >
                          <Card className="h-full transition-shadow hover:shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-lg">{avatar.name}</CardTitle>
                              <CardDescription>{avatar.tagline}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Badge variant="outline" className="mb-4">{avatar.stage.replace('_', ' ')}</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-4"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAvatar(avatar);
                                  setAvatarModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Full Profile
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </TabsContent>

            {/* Diary Tab */}
            <TabsContent value="diary">
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Customer Journey Diary</h2>
                    <p className="text-sm text-muted-foreground">
                      The emotional journey from struggle to success
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!researchData?.diaryEntries ? (
                      <Button
                        onClick={handleGenerateDiary}
                        disabled={isGenerating || !researchData?.allAvatars?.problem_aware}
                        className="gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        {isGenerating ? 'Generating...' : 'Generate Diary'}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const content = formatDiaryForDownload(researchData.diaryEntries);
                            downloadAsText(content, 'customer-journey-diary');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .txt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const content = formatDiaryForDownload(researchData.diaryEntries);
                            downloadAsMarkdown(content, 'customer-journey-diary');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .md
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const content = formatDiaryForDownload(researchData.diaryEntries);
                            downloadAsPDF(content, 'customer-journey-diary');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .pdf
                        </Button>
                      </>
                    )}
                  </div>
                </div>

              {researchData?.diaryEntries && (
                <div className="space-y-6">

                  <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        😔 Before: Struggling with the Problem
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {researchData.diaryEntries.before}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                        🌱 During: Discovering & Implementing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {researchData.diaryEntries.during}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        ✨ After: Life After Transformation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {researchData.diaryEntries.after}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
              </motion.div>
            </TabsContent>

            {/* Brand Tab */}
            <TabsContent value="brand">
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Brand Identity & Design System</h2>
                    <p className="text-sm text-muted-foreground">
                      Complete brand strategy and visual identity system
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!researchData?.brandIdentity ? (
                      <Button
                        onClick={handleGenerateBrand}
                        disabled={isGenerating || !researchData?.allAvatars?.problem_aware}
                        className="gap-2"
                      >
                        <Palette className="h-4 w-4" />
                        {isGenerating ? 'Generating...' : 'Generate Brand'}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            downloadAsText(researchData.brandIdentity, 'brand-identity');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .txt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            downloadAsMarkdown(researchData.brandIdentity, 'brand-identity');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .md
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            downloadAsPDF(researchData.brandIdentity, 'brand-identity');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .pdf
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {researchData?.brandIdentity && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {researchData.brandIdentity}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {/* Landing Page Tab */}
            <TabsContent value="landing_page">
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Landing Page Specification</h2>
                    <p className="text-sm text-muted-foreground">
                      Complete PRD for building a high-converting landing page
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!researchData?.landingPageSpec ? (
                      <Button
                        onClick={handleGenerateLandingPage}
                        disabled={isGenerating || !researchData?.allAvatars?.problem_aware}
                        className="gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        {isGenerating ? 'Generating...' : 'Generate Landing Page'}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            downloadAsText(researchData.landingPageSpec, 'landing-page-spec');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .txt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            downloadAsMarkdown(researchData.landingPageSpec, 'landing-page-spec');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .md
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            downloadAsPDF(researchData.landingPageSpec, 'landing-page-spec');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .pdf
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {researchData?.landingPageSpec ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {researchData.landingPageSpec}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Landing Page Spec Generated</CardTitle>
                      <CardDescription>
                        Generate your audience research to see the landing page specification
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {/* Marketing Tab */}
            <TabsContent value="marketing">
              {activeTab === 'marketing' && (
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Marketing Assets Kit</h2>
                      <p className="text-sm text-muted-foreground">
                        Ready-to-use headlines, emails, ads, social posts, and more (100+ items)
                      </p>
                    </div>
                    {researchData?.marketingAssets ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const content = formatMarketingAssetsForDownload(researchData.marketingAssets);
                            downloadAsText(content, 'marketing-assets-kit');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .txt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const content = formatMarketingAssetsForDownload(researchData.marketingAssets);
                            downloadAsMarkdown(content, 'marketing-assets-kit');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .md
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const content = formatMarketingAssetsForDownload(researchData.marketingAssets);
                            downloadAsPDF(content, 'marketing-assets-kit');
                          }}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          .pdf
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handleGenerateMarketing}
                        disabled={isGenerating}
                        className="gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Generate Marketing Assets
                      </Button>
                    )}
                  </div>

                  {researchData?.marketingAssets ? (
                    <div className="space-y-6">
                      {/* Headlines */}
                      {researchData.marketingAssets.headlines && researchData.marketingAssets.headlines.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Headlines (20 Variations)</CardTitle>
                            <CardDescription>
                              Attention-grabbing headlines optimized for your Problem Aware audience
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {researchData.marketingAssets.headlines.map((headline: string, i: number) => (
                                <div key={i} className="p-3 bg-muted rounded-lg">
                                  <span className="text-xs text-muted-foreground mr-2">{i + 1}.</span>
                                  <span className="font-medium">{headline}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Email Sequences */}
                      {researchData.marketingAssets.email_sequences && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Email Sequences</CardTitle>
                            <CardDescription>
                              Welcome series, nurture sequences, and sales campaigns
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {Object.entries(researchData.marketingAssets.email_sequences).map(([key, value]: [string, any]) => (
                                <div key={key} className="space-y-2">
                                  <h4 className="font-semibold capitalize text-lg">
                                    {key.replace(/_/g, ' ')}
                                  </h4>
                                  {Array.isArray(value) ? (
                                    <div className="space-y-3">
                                      {value.map((email: any, i: number) => (
                                        <div key={i} className="p-4 bg-muted rounded-lg space-y-2">
                                          <div className="flex items-center gap-2">
                                            <Badge variant="outline">Email {i + 1}</Badge>
                                            <span className="text-sm font-medium">{email.subject || email.title}</span>
                                          </div>
                                          {email.preview && (
                                            <p className="text-xs text-muted-foreground italic">{email.preview}</p>
                                          )}
                                          <p className="text-sm whitespace-pre-wrap">{email.body || email.content}</p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                                      {JSON.stringify(value, null, 2)}
                                    </pre>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Social Media */}
                      {researchData.marketingAssets.social_media && researchData.marketingAssets.social_media.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Social Media Posts</CardTitle>
                            <CardDescription>
                              Ready-to-post content for Instagram, Twitter, LinkedIn, and more
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {researchData.marketingAssets.social_media.map((post: any, i: number) => (
                                <div key={i} className="p-4 bg-muted rounded-lg space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="default">{post.platform || 'Social'}</Badge>
                                    {post.type && <Badge variant="outline">{post.type}</Badge>}
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">{post.content || post.text}</p>
                                  {post.hashtags && (
                                    <p className="text-xs text-muted-foreground">{post.hashtags}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Ad Copy */}
                      {researchData.marketingAssets.ad_copy && researchData.marketingAssets.ad_copy.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Ad Copy</CardTitle>
                            <CardDescription>
                              High-converting ad variations for Facebook, Google, and other platforms
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {researchData.marketingAssets.ad_copy.map((ad: any, i: number) => (
                                <div key={i} className="p-4 bg-muted rounded-lg space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="default">{ad.platform || 'Ad'}</Badge>
                                    {ad.format && <Badge variant="outline">{ad.format}</Badge>}
                                  </div>
                                  {ad.headline && (
                                    <p className="font-semibold">{ad.headline}</p>
                                  )}
                                  <p className="text-sm whitespace-pre-wrap">{ad.body || ad.content}</p>
                                  {ad.cta && (
                                    <Button size="sm" variant="outline" disabled>
                                      {ad.cta}
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Video Scripts */}
                      {researchData.marketingAssets.video_scripts && researchData.marketingAssets.video_scripts.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Video Scripts</CardTitle>
                            <CardDescription>
                              Script outlines for promotional videos, explainers, and testimonials
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {researchData.marketingAssets.video_scripts.map((script: any, i: number) => (
                                <div key={i} className="p-4 bg-muted rounded-lg space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="default">Video {i + 1}</Badge>
                                    {script.type && <Badge variant="outline">{script.type}</Badge>}
                                  </div>
                                  {script.title && (
                                    <p className="font-semibold">{script.title}</p>
                                  )}
                                  <p className="text-sm whitespace-pre-wrap">{script.script || script.content}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Content Pillars */}
                      {researchData.marketingAssets.content_pillars && researchData.marketingAssets.content_pillars.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Content Pillars & Ideas</CardTitle>
                            <CardDescription>
                              Strategic content themes with 45+ ready-to-create ideas
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {researchData.marketingAssets.content_pillars.map((pillar: any, i: number) => (
                                <div key={i} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="default">Pillar {i + 1}</Badge>
                                    <span className="font-semibold">{pillar.name || pillar.title}</span>
                                  </div>
                                  {pillar.description && (
                                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                                  )}
                                  {pillar.ideas && (
                                    <ul className="text-sm space-y-1 pl-4">
                                      {pillar.ideas.map((idea: string, j: number) => (
                                        <li key={j} className="list-disc">{idea}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Conversion Assets */}
                      {researchData.marketingAssets.conversion_assets && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Conversion Assets</CardTitle>
                            <CardDescription>
                              Lead magnets, tripwires, and other conversion tools
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {Object.entries(researchData.marketingAssets.conversion_assets).map(([key, value]: [string, any]) => (
                                <div key={key} className="space-y-2">
                                  <h4 className="font-semibold capitalize">
                                    {key.replace(/_/g, ' ')}
                                  </h4>
                                  {Array.isArray(value) ? (
                                    <div className="space-y-2">
                                      {value.map((item: any, i: number) => (
                                        <div key={i} className="p-3 bg-muted rounded-lg">
                                          {typeof item === 'string' ? (
                                            <p className="text-sm">{item}</p>
                                          ) : (
                                            <div className="space-y-1">
                                              {item.title && <p className="font-medium text-sm">{item.title}</p>}
                                              {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                                      {JSON.stringify(value, null, 2)}
                                    </pre>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Launch Campaign */}
                      {researchData.marketingAssets.launch_campaign && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Launch Campaign</CardTitle>
                            <CardDescription>
                              Complete pre-launch, launch, and post-launch strategy
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {Object.entries(researchData.marketingAssets.launch_campaign).map(([phase, content]: [string, any]) => (
                                <div key={phase} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="default">{phase.replace(/_/g, ' ')}</Badge>
                                  </div>
                                  {typeof content === 'string' ? (
                                    <p className="text-sm whitespace-pre-wrap">{content}</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {Object.entries(content).map(([key, val]: [string, any]) => (
                                        <div key={key} className="p-3 bg-muted rounded-lg">
                                          <p className="text-xs font-semibold mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                                          {typeof val === 'string' ? (
                                            <p className="text-sm">{val}</p>
                                          ) : Array.isArray(val) ? (
                                            <ul className="text-sm space-y-1 pl-4">
                                              {val.map((item: string, i: number) => (
                                                <li key={i} className="list-disc">{item}</li>
                                              ))}
                                            </ul>
                                          ) : (
                                            <pre className="text-xs overflow-auto">{JSON.stringify(val, null, 2)}</pre>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Marketing Assets Not Generated Yet</CardTitle>
                        <CardDescription>
                          Click "Generate Marketing Assets" to create 100+ ready-to-use marketing items
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          This will generate:
                        </p>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                          <li>20 Headlines (4 types: curiosity, benefit-driven, problem-agitation, social-proof)</li>
                          <li>15 Email Sequences (Welcome, Nurture, Sales)</li>
                          <li>30 Social Media Posts (Instagram, Twitter, LinkedIn)</li>
                          <li>10 Ad Copy Variations (Facebook + Google)</li>
                          <li>5 Video Script Outlines</li>
                          <li>45 Content Ideas (3 pillars × 15)</li>
                          <li>5 Lead Magnets</li>
                          <li>3 Tripwire Offers</li>
                          <li>Webinar Outline</li>
                          <li>Launch Campaign (Pre/Launch/Post)</li>
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Avatar Detail Modal */}
      {AvatarModal()}
    </div>
  );
}
