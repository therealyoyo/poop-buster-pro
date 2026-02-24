import { useState } from "react";
import { PawPrint } from "lucide-react";
import PostalCodeModal from "@/components/landing/PostalCodeModal";

const TopBar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-hero-gradient text-primary-foreground text-center py-2 text-sm font-display font-bold tracking-wide relative">
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 hover:underline underline-offset-2 transition-all">
           <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} /> Profitez de votre premier ramassage GRATUIT
        </button>
      </div>
      <PostalCodeModal open={modalOpen} onOpenChange={setModalOpen} />
    </>);

};

export default TopBar;