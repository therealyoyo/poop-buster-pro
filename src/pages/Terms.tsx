import SiteNavbar from "@/components/landing/SiteNavbar";
import SiteFooter from "@/components/landing/SiteFooter";

const Terms = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <SiteNavbar />
    <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">Conditions Générales de Services</h1>

      <div className="prose prose-sm max-w-none text-foreground space-y-6">
        <p className="font-semibold text-muted-foreground">Version 1.0</p>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 1 — IDENTIFICATION DES PARTIES ET CHAMP D'APPLICATION</h2>
          <p>Les présentes Conditions Générales de Services (« CGS ») régissent la relation contractuelle entre Crotte & Go, entreprise de services de ramassage de déjections canines établie en Belgique (« le Prestataire »), et toute personne ayant souscrit à un service (« le Client »). En acceptant un devis, le Client accepte ces CGS sans réserve.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 2 — DESCRIPTION DES SERVICES</h2>
          <p>Crotte & Go propose : le ramassage régulier ou ponctuel de déjections canines dans les jardins privés résidentiels, ainsi que des services pour entreprises et espaces communs (B2B). Les services sont réalisés selon la fréquence convenue (unique, 1x/mois, toutes les 2 semaines, hebdomadaire ou 2x/semaine).</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 3 — DEVIS ET FORMATION DU CONTRAT</h2>
          <p>Tout service fait l'objet d'un devis valable 14 jours. Le contrat est formé à l'acceptation expresse du devis par le Client via le lien électronique sécurisé fourni, accompagnée de la signature électronique. L'acceptation vaut acceptation des présentes CGS.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 4 — TARIFS ET FACTURATION</h2>
          <p>Les tarifs sont en EUR TTC. Toute modification tarifaire est notifiée 30 jours à l'avance. Facturation mensuelle ou trimestrielle (-10% sur le trimestre). Les codes promotionnels et remises de parrainage (25 € pour le filleul) sont à usage unique. En cas de retard de paiement, des intérêts légaux et une indemnité forfaitaire de 40 EUR sont appliqués de plein droit conformément à la loi belge du 2 août 2002.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 5 — ACCÈS AU JARDIN ET CONDITIONS D'INTERVENTION</h2>
          <p>Le Client s'engage à permettre l'accès au jardin, à fournir les informations d'accès nécessaires et à signaler tout animal agressif. En cas d'accès impossible imputable au Client, la prestation est facturée. Crotte & Go ne peut être tenu responsable des dommages causés par un animal non signalé.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 6 — RÉSILIATION ET SUSPENSION</h2>
          <p>Résiliation possible à tout moment sans frais avec 7 jours de préavis (email à hello@crotteandgo.be). Suspension temporaire possible jusqu'à 3 mois/an sur notification écrite. Crotte & Go peut résilier en cas de non-paiement, comportement abusif ou informations fausses.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 7 — RESPONSABILITÉS ET GARANTIES</h2>
          <p>En cas de prestation insatisfaisante, le Client peut demander un repassage gratuit dans les 24h avec photo à l'appui. La responsabilité de Crotte & Go est limitée au montant de la prestation concernée. Crotte & Go est couvert par une assurance RC professionnelle.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 8 — PROTECTION DES DONNÉES (RGPD)</h2>
          <p>Crotte & Go traite les données personnelles du Client pour l'exécution du contrat, conformément au RGPD (UE) 2016/679 et à la loi belge du 30 juillet 2018. Données conservées 7 ans après résiliation. Droits d'accès, rectification, effacement et opposition exercés via privacy@crotteandgo.be. Réclamations possibles auprès de l'APD (autoriteprotectiondonnees.be).</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 9 — MODIFICATION DES CGS</h2>
          <p>Toute modification est notifiée 30 jours à l'avance. En l'absence d'opposition, les nouvelles CGS sont réputées acceptées.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 10 — DROIT APPLICABLE ET LITIGES</h2>
          <p>Droit belge applicable. En cas de litige, recherche d'une solution amiable dans les 30 jours, puis compétence des tribunaux belges. Recours possible auprès du Service de Médiation pour le Consommateur (mediationconsommateur.be) ou via la plateforme ODR européenne.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">ARTICLE 11 — DISPOSITIONS DIVERSES</h2>
          <p>Le contrat est intuitu personae et non cessible sans accord écrit. Si une clause est nulle, les autres restent en vigueur. La version française fait foi.</p>
        </section>

        <p className="font-semibold text-muted-foreground pt-4 border-t border-border">
          Crotte & Go — hello@crotteandgo.be — www.crotteandgo.be — Belgique
        </p>
      </div>
    </main>
    <SiteFooter />
  </div>
);

export default Terms;
