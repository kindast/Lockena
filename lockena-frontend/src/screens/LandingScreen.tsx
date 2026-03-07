import AppPreviewSection from "../components/landing/AppPreviewSection";
import CapabilitiesSection from "../components/landing/CapabilitiesSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import { FinalCTASection } from "../components/landing/FinalCTASection";
import { FooterLanding } from "../components/landing/Footer";
import { HeaderLanding } from "../components/landing/Header";
import { HeroSection } from "../components/landing/HeroSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { SecuritySection } from "../components/landing/SecuritySection";

function LandingScreen() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeaderLanding />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SecuritySection />
        <CapabilitiesSection />
        <AppPreviewSection />
        <FinalCTASection />
      </main>
      <FooterLanding />
    </div>
  );
}

export default LandingScreen;
