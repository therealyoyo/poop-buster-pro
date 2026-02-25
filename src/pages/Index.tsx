import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "@/components/landing/TopBar";
import SiteNavbar from "@/components/landing/SiteNavbar";
import HeroSection from "@/components/landing/HeroSection";
import IntroSection from "@/components/landing/IntroSection";
import PromiseSection from "@/components/landing/PromiseSection";
import AboutSection from "@/components/landing/AboutSection";
import ResidentialDetailSection from "@/components/landing/ResidentialDetailSection";
import PromoSection from "@/components/landing/PromoSection";
import CommercialSection from "@/components/landing/CommercialSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";
import ServiceAreasSection from "@/components/landing/ServiceAreasSection";

import FinalCTASection from "@/components/landing/FinalCTASection";
import FAQSection from "@/components/landing/FAQSection";

import SiteFooter from "@/components/landing/SiteFooter";
import PostalCodeModal from "@/components/landing/PostalCodeModal";

const Index = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("quote") === "true") {
      setQuoteOpen(true);
      searchParams.delete("quote");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openQuote = () => setQuoteOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <SiteNavbar onOpenQuote={openQuote} />
      <HeroSection onOpenQuote={openQuote} />
      <IntroSection onOpenQuote={openQuote} />
      <PromiseSection />
      <AboutSection />
      <ResidentialDetailSection onOpenQuote={openQuote} />
      <PromoSection onOpenQuote={openQuote} />
      <CommercialSection onOpenQuote={openQuote} />
      <WhyChooseUsSection />
      <ServiceAreasSection />
      
      <FinalCTASection onOpenQuote={openQuote} />
      <FAQSection />
      
      <SiteFooter />
      <PostalCodeModal open={quoteOpen} onOpenChange={setQuoteOpen} />
    </div>
  );
};

export default Index;
