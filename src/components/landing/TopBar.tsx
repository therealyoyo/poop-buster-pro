import { useState } from "react";
import { PawPrint } from "lucide-react";
import PostalCodeModal from "@/components/landing/PostalCodeModal";

const TopBar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-hero-gradient text-primary-foreground text-center py-2 text-sm font-display font-bold tracking-wide relative">
        <button onClick={() => setModalOpen(true)} className="group inline-flex items-center gap-1.5 relative pb-0.5 transition-all">
           <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} /> Profitez de votre premier ramassage GRATUIT
           <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
        </button>
      </div>
      <PostalCodeModal open={modalOpen} onOpenChange={setModalOpen} />
    </>);

};

export default TopBar;