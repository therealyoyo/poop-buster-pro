import TopBar from "@/components/landing/TopBar";
import SiteNavbar from "@/components/landing/SiteNavbar";
import SiteFooter from "@/components/landing/SiteFooter";
import CommercialSection from "@/components/landing/CommercialSection";
import StatsSection from "@/components/landing/StatsSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import OnboardingForm from "@/components/OnboardingForm";
import { motion } from "framer-motion";

const Commercial = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <SiteNavbar />
      <CommercialSection />
      <StatsSection />
      <FinalCTASection />

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

      <SiteFooter />
    </div>
  );
};

export default Commercial;
