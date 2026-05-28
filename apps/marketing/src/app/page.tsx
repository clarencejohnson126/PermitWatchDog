import Nav from '../components/Nav';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import WelcomeVideoSection from '../components/home/WelcomeVideoSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import DoctrineSection from '../components/home/DoctrineSection';
import AlertProofSection from '../components/home/AlertProofSection';
import PricingTeaserSection from '../components/home/PricingTeaserSection';
import CredibilitySection from '../components/home/CredibilitySection';
import FaqSection from '../components/home/FaqSection';
import SplashIntro from '../components/SplashIntro';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <SplashIntro />
      <Nav />
      <HeroSection />
      <WelcomeVideoSection />
      <HowItWorksSection />
      <DoctrineSection />
      <AlertProofSection />
      <PricingTeaserSection />
      <CredibilitySection />
      <FaqSection />
      <Footer />
    </main>
  );
}
