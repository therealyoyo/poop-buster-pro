import { useState } from "react";
import TopBar from "@/components/landing/TopBar";
import SiteNavbar from "@/components/landing/SiteNavbar";
import SiteFooter from "@/components/landing/SiteFooter";
import CommercialSection from "@/components/landing/CommercialSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import PostalCodeModal from "@/components/landing/PostalCodeModal";

const Commercial = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const openQuote = () => setQuoteOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <SiteNavbar onOpenQuote={openQuote} />
      <CommercialSection onOpenQuote={openQuote} />
      <FinalCTASection onOpenQuote={openQuote} />
      <PostalCodeModal open={quoteOpen} onOpenChange={setQuoteOpen} isB2B />
      <SiteFooter />
    </div>
  );
};

export default Commercial;
