import { motion } from "framer-motion";
import TopBar from "@/components/landing/TopBar";
import SiteNavbar from "@/components/landing/SiteNavbar";
import HeroSection from "@/components/landing/HeroSection";
import IntroSection from "@/components/landing/IntroSection";
import PromiseSection from "@/components/landing/PromiseSection";
import AboutSection from "@/components/landing/AboutSection";
import ResidentialSection from "@/components/landing/ResidentialSection";
import PromoSection from "@/components/landing/PromoSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";
import ServiceAreasSection from "@/components/landing/ServiceAreasSection";

import ReferralSection from "@/components/landing/ReferralSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import FAQSection from "@/components/landing/FAQSection";
import StatsSection from "@/components/landing/StatsSection";
import SiteFooter from "@/components/landing/SiteFooter";
import OnboardingForm from "@/components/OnboardingForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Navbar */}
      <SiteNavbar />

      {/* 3. Hero */}
      <HeroSection />

      {/* 4. Intro */}
      <IntroSection />

      {/* 5. Promesse client */}
      <PromiseSection />

      {/* 5. À propos */}
      <AboutSection />

      {/* 6. Services résidentiels */}
      <ResidentialSection />

      {/* 7. Section promo */}
      <PromoSection />

      {/* 8. Pourquoi nous choisir */}
      <WhyChooseUsSection />

      {/* 9. Zones desservies */}
      <ServiceAreasSection />


      {/* 11. Parrainage */}
      <ReferralSection />

      {/* 12. CTA Final */}
      <FinalCTASection />

      {/* 13. FAQ */}
      <FAQSection />

      {/* 14. Compteurs animés */}
      <StatsSection />

      {/* 15. Signup Form */}
      <section id="signup" className="py-20 bg-muted/50 paw-pattern">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <OnboardingForm />
          </motion.div>
        </div>
      </section>

      {/* 16. Footer */}
      <SiteFooter />
    </div>
  );
};

export default Index;
