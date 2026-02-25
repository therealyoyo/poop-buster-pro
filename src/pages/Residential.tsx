import { useState } from "react";
import TopBar from "@/components/landing/TopBar";
import SiteNavbar from "@/components/landing/SiteNavbar";
import SiteFooter from "@/components/landing/SiteFooter";
import ResidentialDetailSection from "@/components/landing/ResidentialDetailSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";
import StatsSection from "@/components/landing/StatsSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import PostalCodeModal from "@/components/landing/PostalCodeModal";

const Residential = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const openQuote = () => setQuoteOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <SiteNavbar onOpenQuote={openQuote} />
      <ResidentialDetailSection onOpenQuote={openQuote} />
      <WhyChooseUsSection />
      <StatsSection />
      <FinalCTASection onOpenQuote={openQuote} />
      <PostalCodeModal open={quoteOpen} onOpenChange={setQuoteOpen} />
      <SiteFooter />
    </div>
  );
};

export default Residential;
