import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CollegeProvider } from '@/context/college-context';
import { AuthProvider } from '@/context/auth-context';
import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'CoSurf | Free Courses & Certifications for College Students',
    template: '%s | CoSurf',
  },
  description:
    'Discover free online courses, cloud credits, and verified industry certifications available through your official college email address. Harvard, Google Cloud, IBM, Microsoft, and AWS opportunities.',
  keywords: [
    'free courses for college students',
    'free certifications with student email',
    'edu email discounts',
    'college course discovery',
    'free AWS vouchers for students',
    'free Microsoft AI-900',
    'Coursera for campus',
    'cosurf',
  ],
  authors: [{ name: 'CoSurf Team' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'CoSurf | Free Courses & Certifications for College Students',
    description: 'What free courses can you get with your college email? Discover and claim zero-tuition certifications today on CoSurf.',
    url: 'http://localhost:3000',
    siteName: 'CoSurf',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        <CollegeProvider>
          <AuthProvider>
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </CollegeProvider>
      </body>
    </html>
  );
}
