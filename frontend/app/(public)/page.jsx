import HomeHero from '@/components/public/HomeHero';
import HomeServices from '@/components/public/HomeService';
import HomeCTA from '@/components/public/HomeCTA';

export const metadata = {
  title: 'Productivity Gourmet | Operations Support',
  description: 'Virtual assistant and operations support for service providers, executives, and creators.',
};

export default function Home() {
  return (
    // Note: We removed the hardcoded style tags and ThemeToggle from here.
    // The ThemeToggle is now handled in your custom mobile/desktop header.
    <>
      <HomeHero />
      <HomeServices />
      <HomeCTA />
      
      {/* We will stack <HomeServices /> and <HomeCTA /> below this later */}
    </>
  );
}