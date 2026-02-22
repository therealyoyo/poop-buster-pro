import { useState } from "react";
import PostalCodeModal from "@/components/landing/PostalCodeModal";

const TopBar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-hero-gradient text-primary-foreground text-center py-2 text-sm font-display font-bold tracking-wide relative">
        <button onClick={() => setModalOpen(true)} className="hover:underline underline-offset-2 transition-all">
          🐾 Réclamez votre premier nettoyage GRATUIT !
        </button>
      </div>
      <PostalCodeModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default TopBar;
