import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UI Marketplace for AI Coding Agents | CoSurf',
  description:
    'Discover production-ready interfaces built for AI coding agents. Buy and unlock structured AI implementation prompts for Claude Code, Cursor, Antigravity, Gemini, and Codex.',
  openGraph: {
    title: 'UI Marketplace - Beautiful UI. Built for AI.',
    description:
      'Turn professionally crafted developer interfaces into working websites with AI coding agents.',
    type: 'website',
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
