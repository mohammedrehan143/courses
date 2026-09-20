import { AIAgentType, UIPrompt } from '@/types/marketplace';

export const MOCK_UI_PROMPTS: Record<string, UIPrompt> = {
  'ui-prod-001': {
    id: 'prompt-001',
    ui_product_id: 'ui-prod-001',
    version: '1.2.0',
    prompt_content: `You are an expert principal frontend architect and UI engineer.
Recreate the "AI SaaS Landing Page & Workflow Studio" interface with pixel precision and production-ready code.

### 1. PROJECT OBJECTIVE
Build a high-converting, developer-focused marketing landing page for a next-generation AI developer tool. The page must feel fast, authoritative, and sophisticated, avoiding generic cliches while showcasing interactive live mockups of AI workflows.

### 2. TECH STACK
- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS 3.4
- Component Primitives: Radix UI / Lucide React
- Animation: Subtle CSS keyframes / Framer Motion transitions

### 3. DESIGN SYSTEM & VISUAL HIERARCHY
- Background: Deep slate/navy (#0a0f1d, #0f172a, #030712) with subtle radial gradient mesh accents.
- Card Surfaces: rgba(15, 23, 42, 0.75) with 1px border border-slate-800/80 and backdrop-blur-xl.
- Highlight Accents: Electric Indigo (#6366f1) and Cyber Cyan (#06b6d4) for active states and badges.
- Borders: Crisp 1px borders with border-slate-800 on dark; hover:border-indigo-500/40.

### 4. LAYOUT
- Desktop: Max-width 1280px container with 24px horizontal gutters.
- Bento Grid: 3-column asymmetric layout (2 col wide hero card + 1 col tall card on right).
- Spacing: 8pt grid scale (gap-6, gap-8, py-16, py-24).

### 5. TYPOGRAPHY
- Headings: Inter or Geist Sans, font-weight 700/800, tracking-tight (-0.025em), leading-tight.
- Body: Font-size 15px/16px, leading-relaxed (1.6), text-slate-400.
- Code/Tokens: JetBrains Mono or font-mono, text-xs/text-sm for CLI snippets and prompt inputs.

### 6. KEY COMPONENTS TO IMPLEMENT
1. NavigationBar:
   - Sticky blur header with logo, product links, GitHub star count button, and "Start Free" CTA.
2. HeroSection:
   - Announcement pill: "Introducing Workflow Canvas 2.0 →"
   - Massive headline: "AI orchestration that runs directly in your repository."
   - Interactive prompt simulator input: Allows user to type and watch a live simulated workflow graph activate.
3. BentoFeatureGrid:
   - Card 1: Multi-Agent Parallel Execution visualizer with animated pulse lines.
   - Card 2: Zero-latency streaming metrics widget (14ms latency badge).
   - Card 3: Git-native Branch Synchronization with simulated git diff view.
4. PricingCalculator:
   - Monthly/Annual billing switcher (save 20% discount badge).
   - Starter ($0), Developer ($29/mo - Popular), and Team ($99/mo) cards with checkmark features.
5. DeveloperTestimonials:
   - Real quote cards with avatars, company badges (e.g. YC, GitHub), and verified handles.
6. CallToActionBanner:
   - Gradient glow container with CLI command \`npx create-ai-workflow\` and 1-click copy button.

### 7. RESPONSIVE BEHAVIOR
- Mobile (<640px): Stack bento cards into 1 column. Collapse navigation into slideout drawer.
- Tablet (641px - 1024px): 2-column grid with touch-friendly button targets (minimum 44px height).
- Desktop (>1024px): Full multi-column bento layout with hover glow states.

### 8. ANIMATIONS & MICRO-INTERACTIONS
- Subtle cursor hover glows on bento cards using CSS radial-gradient.
- Copy CLI button provides instant feedback ("Copied!" with check icon for 2000ms).
- No distracting bouncy or sluggish spring animations; keep durations under 200ms ease-out.

### 9. ACCESSIBILITY (a11y)
- Full keyboard navigation for interactive widgets and billing toggles.
- Contrast ratio >= 4.5:1 for all text against backgrounds.
- All SVG icons must include aria-hidden="true" or appropriate aria-label.

### 10. IMPLEMENTATION REQUIREMENTS & CONSTRAINTS
- Write modular, clean TypeScript files divided into /components/hero, /components/bento, /components/pricing.
- Zero hydration errors: Avoid non-deterministic values during initial SSR render.
- Use Semantic HTML: <header>, <main>, <section>, <article>, <footer>.
- Recreate the exact visual aesthetic described. Do not replace custom components with generic placeholders.`,
  },
  'ui-prod-002': {
    id: 'prompt-002',
    ui_product_id: 'ui-prod-002',
    version: '1.1.0',
    prompt_content: `You are an expert frontend systems engineer specializing in data-dense observability dashboards.
Recreate the "Modern Analytics & Observability Dashboard" with production-quality TypeScript and Tailwind CSS.

### 1. PROJECT OBJECTIVE
Build an executive and engineer-friendly observability dashboard that organizes high-volume telemetry, server health, token usage, and user cohort retention into a clean, legible hierarchy.

### 2. TECH STACK
- Framework: Next.js 15 / React 19
- Language: TypeScript
- Styling: Tailwind CSS
- Data Visualization: Responsive SVG / HTML5 canvas / Recharts integration
- State: URL search parameters for date ranges and filter persistence

### 3. DESIGN SYSTEM
- Background: #090d16 with panel surfaces at #111827.
- Color Palette:
  - Success/Healthy: #10b981 (Emerald)
  - Warning/High Latency: #f59e0b (Amber)
  - Error/Outage: #ef4444 (Rose)
  - Primary Telemetry Line: #3b82f6 (Sky Blue)
  - Secondary Telemetry Line: #8b5cf6 (Purple)
- Typography: Tabular numbers (font-variant-numeric: tabular-nums) for all financial and metric displays.

### 4. KEY COMPONENTS
1. SidebarNav:
   - Collapsible navigation rail with Overview, Traces, Metrics, Logs, Billing, and API Keys.
   - Live cluster status indicator dot (Green: All 12 regions operational).
2. HeaderControls:
   - Global Date Range Picker: "Last 24 Hours", "Last 7 Days", "Last 30 Days", "Custom".
   - Environment Selector dropdown: "Production - us-east-1", "Staging", "Dev".
   - Refresh interval dropdown (Auto-refresh: 10s, 30s, Off).
3. MetricCardRow:
   - 4 summary cards: "Total API Requests" (14.2M), "p99 Latency" (38ms), "Error Rate" (0.02%), "Total Spend" ($1,842.10).
   - Sparkline SVG graph on each card showing 24h trend.
4. TimeSeriesTelemetryCard:
   - Dual-axis graph comparing Requests/sec against Latency (ms).
   - Hover tooltip showing exact timestamp and metric values with crosshair guide.
5. CohortRetentionTable:
   - Sortable columns: Endpoint, Method (GET, POST with badge), Status Code, p50, p95, p99, Error Count.
   - Search input to filter endpoints in real time.
6. ServerHealthWidget:
   - Visual heat map grid of 24 availability zones.

### 5. RESPONSIVE BEHAVIOR
- Desktop: Persistent left sidebar (240px) + flexible dashboard content.
- Tablet: Sidebar collapses into icons-only mode (64px).
- Mobile: Horizontal scrollable tables with sticky first column; sidebar hidden in sheet drawer.

### 6. CONSTRAINTS
- Strict typing for all telemetry data models and chart coordinates.
- Ensure all charts handle zero-state (empty metrics) and loading skeleton states gracefully.`,
  },
  'ui-prod-003': {
    id: 'prompt-003',
    ui_product_id: 'ui-prod-003',
    version: '1.0.0',
    prompt_content: `You are an expert developer and UI designer.
Recreate the "Developer Minimalist Portfolio & Tech Blog" interface.

### 1. PROJECT OBJECTIVE
Create an elegant, blazingly fast portfolio and technical writing platform for a software developer. Emphasize craftsmanship, typography, project showcase, and open-source contributions.

### 2. TECH STACK
- Framework: Next.js 15 (Static Export / Server Components)
- Language: TypeScript
- Styling: Tailwind CSS
- Markdown/MDX: Content rendering with syntax highlighting support

### 3. DESIGN SYSTEM & AESTHETICS
- Background: Minimalist clean dark (#0a0a0c) or warm monochrome light (#fafaf9).
- Accents: Subtle emerald (#10b981) for "Available for projects" status indicator.
- Typography: Editorial serif headings or clean grotesque sans; monospace for code tags.

### 4. KEY COMPONENTS
1. BioHero:
   - Clean profile portrait with subtle border.
   - Concise bio, current role ("Software Engineer at ..."), and location with local time clock.
   - "Available for hire / freelance" live pulse badge.
2. InteractiveTerminalBio:
   - Simulated mini-CLI where visitors can type commands: 'help', 'skills', 'contact', 'clear'.
3. FeaturedProjectsGrid:
   - 4 card showcase with project screenshot, description, tech stack tags, live demo URL, and GitHub stars pill.
4. ExperienceTimeline:
   - Chronological career history with expandable impact bullet points and company links.
5. WritingSection:
   - List of recent technical articles with publication date, reading time estimate, and tag badges.
6. ContactSection:
   - 1-click email copy button with tooltip ("Click to copy address").
   - Verified links to GitHub, X/Twitter, LinkedIn, and Substack/RSS.

### 5. CONSTRAINTS
- Prioritize near-instant page transitions and lightweight DOM.
- No heavy canvas or sluggish libraries. Keep CSS utility-driven and accessible.`,
  },
  'ui-prod-004': {
    id: 'prompt-004',
    ui_product_id: 'ui-prod-004',
    version: '1.2.0',
    prompt_content: `You are a staff AI frontend architect.
Recreate the "AI Chat & Multi-Modal Agent Canvas" workspace interface.

### 1. PROJECT OBJECTIVE
Build a state-of-the-art conversational and workspace UI designed for AI coding agents and reasoning LLMs. The design must accommodate multi-step reasoning thoughts, split canvas code previews, and diff viewers.

### 2. TECH STACK
- Framework: Next.js 15
- Language: TypeScript
- Styling: Tailwind CSS
- Component Library: Radix UI primitives for dialogs, dropdowns, and split panes.

### 3. KEY SECTIONS & COMPONENTS
1. SplitLayoutWorkspace:
   - Resizable split panel: Left side is Chat Stream (40-50%), Right side is Artifact Canvas (50-60%).
2. ConversationStream:
   - User messages with avatar and editable prompt button.
   - Assistant responses with streaming cursor indicator.
   - Collapsible "Thinking Process" accordion showing step-by-step reasoning tokens with elapsed time.
3. CodeArtifactInspector:
   - Top action bar: File path tab, "Copy Code", "Download File", "Open in Sandbox", and View Toggle ("Code" vs "Preview").
   - Code editor view with syntax highlighting, line numbers, and diff changes (green added / red removed lines).
4. PromptComposer:
   - Multiline auto-expanding textarea.
   - Attachment picker (Images, PDF, Code snippets).
   - Model dropdown selector: Claude 3.7 Sonnet, GPT-4.5, Gemini 2.0 Flash, DeepSeek R1.
   - Token counter badge (e.g., "1,240 / 128,000 tokens").
5. ThreadHistorySidebar:
   - Categorized chat history (Today, Yesterday, Previous 7 Days).
   - Search input for conversation history.
   - Settings and user profile footer.

### 4. CONSTRAINTS & ACCESSIBILITY
- High contrast syntax highlighting theme (e.g. One Dark or Tokyo Night).
- Complete keyboard accessibility: Cmd/Ctrl+K for command menu, Cmd+Enter to send message, Esc to close panels.`,
  },
  'ui-prod-005': {
    id: 'prompt-005',
    ui_product_id: 'ui-prod-005',
    version: '1.0.0',
    prompt_content: `You are a lead e-commerce frontend engineer.
Recreate the "Headless E-commerce Storefront & Checkout Flow".

### 1. PROJECT OBJECTIVE
Develop a high-performance, conversion-optimized headless e-commerce product catalog, product details page, slide-over cart, and streamlined checkout accordion.

### 2. TECH STACK
- Next.js 15, TypeScript, Tailwind CSS, Lucide React.

### 3. KEY COMPONENTS
1. StorefrontHeader: Search with instant autocomplete popup, currency switcher (INR/USD), category links, and cart badge with dynamic count.
2. ProductCatalogGrid: Filter sidebar (Category, Price slider, Size pills, In-Stock toggle) and responsive 3-column product cards with quick-add button.
3. ProductDetailModal: Multi-image thumbnail gallery with active zoom, size/color variant selectors, inventory status badge ("Only 3 left in stock"), and Sticky Add to Cart bar.
4. SlideOverCart: Drawer with item quantity stepper (+/-), order summary, promo code applicator, and checkout CTA button.
5. CheckoutFlow: 3-step clean accordion: 1. Shipping Address, 2. Delivery Options, 3. Payment Method (Razorpay / UPI / Cards).

### 4. CONSTRAINTS
- Strict optimistic UI updates when adding/removing items from cart.
- Seamless responsive layout across smartphone, tablet, and desktop viewports.`,
  },
  'ui-prod-006': {
    id: 'prompt-006',
    ui_product_id: 'ui-prod-006',
    version: '1.0.0',
    prompt_content: `You are an expert academic software engineer.
Recreate the "Student Project Showcase & Research Lab Hub" platform.

### 1. PROJECT OBJECTIVE
Create an academic and hackathon project showcase platform that allows student teams and research labs to publish capstone projects, research papers, datasets, and benchmark results.

### 2. TECH STACK
- React 19, Next.js 15, TypeScript, Tailwind CSS.

### 3. KEY COMPONENTS
1. ProjectHero: Paper/Project title, authors list with university affiliations and student badges, advisor credits, publication date, and GitHub/Demo links.
2. CitationModal: 1-click copy for BibTeX, APA, and IEEE citation formats.
3. BenchmarkScores: Interactive table comparing project performance, accuracy metrics, and inference latency against baseline papers.
4. DatasetDownloader: Download links with file size, MD5 checksum, and license badges.
5. MediaGallery: Video walkthrough embed with slide deck previewer.

### 4. CONSTRAINTS
- Clean academic typography with LaTeX-style formula rendering readiness.
- Clear university branding elements with verified college email badges.`,
  },
  'ui-prod-007': {
    id: 'prompt-007',
    ui_product_id: 'ui-prod-007',
    version: '1.0.0',
    prompt_content: `You are a senior mobile UI engineer.
Recreate the "Mobile-First Neo-Banking & Expense Tracker UI".

### 1. PROJECT OBJECTIVE
Build a touch-first, mobile viewport optimized personal finance app with virtual debit cards, categorized expense tracking, quick peer-to-peer transfers, and security settings.

### 2. TECH STACK
- React, TypeScript, Tailwind CSS, Framer Motion.

### 3. KEY COMPONENTS
1. MobileViewportContainer: Framed mobile view with native status bar mock, dynamic island, and bottom navigation bar.
2. VirtualDebitCard: Beautiful gradient card with flip animation showing card number, expiry, and CVV on click.
3. QuickActionsRow: Send, Request, Add Money, and Analytics action circles with icons.
4. SpendingBreakdown: Donut chart visualization of monthly budget across Categories (Food, Housing, Tech, Subscriptions).
5. RecentTransactionsList: Grouped by date (Today, Yesterday), with merchant logos, categories, and positive/negative amount formatting.

### 4. CONSTRAINTS
- Native feel with 60fps gesture feedback and active tap states on touch devices.`,
  },
  'ui-prod-008': {
    id: 'prompt-008',
    ui_product_id: 'ui-prod-008',
    version: '2.0.0',
    prompt_content: `You are a principal design systems engineer.
Recreate the "DevKit UI: Accessible Component Library & Docs System".

### 1. PROJECT OBJECTIVE
Build an open-source, highly accessible component library showcase and interactive documentation platform with live prop switchers, copyable code snippets, and design tokens.

### 2. TECH STACK
- Next.js 15, TypeScript, Tailwind CSS, Radix UI Primitives.

### 3. KEY COMPONENTS
1. DocsSidebar: Grouped component navigation: Getting Started, Primitives (Button, Dialog, Accordion, Tooltip, Input, Select, Badge), and Patterns (Auth form, Table, Card grid).
2. LiveComponentPlayground: Interactive stage where users can toggle variant props (size, color, disabled, loading) and inspect both JSX and Tailwind HTML.
3. CodeSnippetViewer: Copyable npm/pnpm/yarn CLI install snippet with language tabs and syntax highlights.
4. TokenColorPalette: Interactive swatch viewer for primary, secondary, slate, and semantic color scales.
5. AccessibilityChecklist: Guidelines for ARIA roles, keyboard shortcuts, and screen reader announcements.

### 6. CONSTRAINTS
- Follow strict W3C WAI-ARIA authoring practices for every primitive component.`,
  },
};

/**
 * Customizes the base implementation prompt for a specific AI Coding Agent
 */
export function formatPromptForAgent(basePrompt: string, agentType: AIAgentType): string {
  switch (agentType) {
    case 'claude':
      return `[CLAUDE CODE SPECIFICATION & EXECUTION PROTOCOL]
You are Claude Code, Anthropic's agentic CLI tool. Execute the following implementation request thoroughly:
- Analyze existing directory structure and packages before generating files.
- Break down the implementation into discrete sub-components in logical order: types -> utilities -> primitives -> page layouts.
- Output complete, production-ready code. Do not leave placeholder comments like "// implement later".
- Verify all imports match existing project conventions and tsconfig path aliases.

${basePrompt}

### CLAUDE CODE EXECUTION TIPS:
1. Initialize the file structure using \`mkdir\` or your file creation tools.
2. Write individual component files inside the appropriate directory.
3. Run \`npm run build\` or \`npx tsc --noEmit\` to verify type safety after completion.`;

    case 'cursor':
      return `/* CURSOR COMPOSER & .cursorrules INSTRUCTIONS */
You are an expert AI software engineer operating inside Cursor IDE. Follow these instructions:
- Use @components and @lib paths appropriately.
- Strictly adhere to Next.js 15 App Router conventions and React 19.
- Implement reusable components with clean TypeScript interfaces.

${basePrompt}

### CURSOR PROMPT CHUNK SUGGESTION:
You can highlight the target files in your project and prompt Cursor Composer:
"Implement the UI specified above, starting with the design system tokens and component primitives, followed by the responsive page composition."`;

    case 'antigravity':
      return `<!-- GOOGLE ANTIGRAVITY AGENT PROTOCOL -->
You are Antigravity, Google DeepMind's agentic AI coding assistant.
Execute this implementation plan with precision:

1. Research: Inspect existing UI components and Tailwind configuration.
2. Plan: Draft an artifact plan breaking down the interface into modular units.
3. Execute: Implement the files using \`write_to_file\` or \`replace_file_content\`.
4. Validate: Run type-checks and verify that the page renders without hydration warnings.

${basePrompt}

### ANTIGRAVITY SPECIFIC GUIDELINES:
- Maintain documentation integrity and clean code formatting.
- Ensure all clickable interactions have accessible aria labels.
- Provide clickable file links using file:// protocol.`;

    case 'gemini':
      return `/* GOOGLE GEMINI 2.0 DEVELOPER DIRECTIVE */
You are Gemini, Google's multimodal reasoning AI.
Transform this interface specification into clean, production-grade Next.js 15 code:

${basePrompt}

### GEMINI INSTRUCTIONS:
- Pay close attention to visual spacing, typography scale, and responsive breakpoints.
- Ensure all interactive states (hover, focus-visible, active) are fully styled.
- Include proper fallback states for dynamic content.`;

    case 'codex':
      return `// OPENAI CODEX & CHATGPT CODING DIRECTIVE
// Instructions: Implement the complete frontend architecture specified below without truncations.

${basePrompt}

// Ensure strict adherence to React 19 hooks, client-boundary directives ('use client'), and TypeScript generics.`;

    case 'general':
    default:
      return basePrompt;
  }
}
