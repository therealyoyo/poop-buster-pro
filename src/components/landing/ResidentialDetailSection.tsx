import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  CalendarCheck,
  Clock,
  Sparkles,
  Shield,
  MessageSquare,
  DoorOpen,
  Search,
  Lock,
  Trash2,
  Mail,
  AlertTriangle,
  Heart,
} from "lucide-react";
import PawIcon from "@/components/PawIcon";

const services = [
  {
    icon: CalendarCheck,
    title: "2x par semaine",
    desc: "Idéal pour les foyers avec plusieurs chiens ou en cas d'accumulation importante de déjections.\nPermet de maintenir un jardin propre et agréable en permanence tout en réduisant plus rapidement les odeurs et la prolifération des bactéries grâce à des interventions plus fréquente",
  },
  {
    icon: Clock,
    title: "Hebdomadaire",
    desc: "Notre service le plus populaire, parfait  pour les propriétaires d'animaux au quotidien bien rempli. Garantit une hygiène optimale en limitant les bactéries et les mauvaises odeurs. Idéal pour les foyers comptant 1 à 2 chiens.",
  },
  {
    icon: Sparkles,
    title: "Toutes les 2 semaines",
    desc: "Une excellente option pour les habitations avec une accumulation de déjections modérée. Parfait pour les propriétaires qui souhaitent un nettoyage régulier sans avoir besoin d'un passage hebdomadaire",
  },
  {
    icon: Shield,
    title: "Ponctuel",
    desc: "Besoin d'un nettoyage rapide de votre jardin ? Que ce soit pour un événement spécial, un grand ménage de printemps ou simplement un entretien négligé, notre service ponctuel remet votre terrain en état. Parfait pour les propriétaires, les gestionnaires immobiliers ou les locataires qui emménagent ou déménagent",
  },
];

const steps = [
  {
    icon: MessageSquare,
    title: "Notification par SMS",
    desc: "Nos Scoopers vous enverront un SMS « En route » environ 60 minutes avant le début de l'intervention.",
  },
  {
    icon: DoorOpen,
    title: "Accès facilité",
    desc: "Votre présence n'est pas requise au moment du service, mais nous vous demandons simplement de faciliter l'accès aux zones à nettoyer et de ne pas laisser de chiens agressifs dans le jardin. Ces petites attentions nous permettent de vous garantir un service fluide, efficace et sûr pour tous.",
  },
  {
    icon: Search,
    title: "Nettoyage méticuleux",
    desc: "Votre scooper professionnel arrive sur place et commence immédiatement le nettoyage complet de votre jardin. Les membres de l'équipe Crotte&Go® sont formés pour couvrir l'entièreté de votre jardin afin de ne rien oublier. Pour vous garantir un résultat impeccable, notre équipe effectue plusieurs passages dans votre jardin, s'assurant ainsi qu'aucune déjection n'ait été oubliée.",
  },
  {
    icon: Lock,
    title: "Procédures de Sécurité",
    desc: "Une fois votre jardin impeccable, votre technicien Crotte&Go® prendra une photo de votre portail de jardin fermé et l'ajoutera à votre portail client. Cette étape garantit qu'aucun chien ne puisse s'échapper accidentellement de votre propriété.\n\nNotre équipe procède ensuite à la désinfection systématique de tout son matériel de ramassage à l'aide d'un désinfectant biologique de qualité vétérinaire. Cette mesure prévient la propagation des germes et des maladies entre les chiens, garantissant ainsi un environnement sain et sécuritaire pour tous nos clients.",
  },
  {
    icon: Trash2,
    title: "Élimination des déjections",
    desc: "Votre technicien Crotte&Go® emballe les déjections dans un double sac avant de les déposer dans votre poubelle. Si vous n'avez pas de poubelle ou de benne accessible, les sacs doublés seront simplement déposés sur le côté de votre domicile. Ce processus garantit une élimination conforme aux normes d'hygiène et aux directives locales.",
  },
];

const benefits = [
  "Jardin propre et sain pour votre famille et vos animaux",
  "Réduction des risques sanitaires liés aux déjections",
  "Plus de temps libre pour profiter de votre extérieur",
  "Service flexible, sans contrat ni engagement",
  "SMS de notification 60 minutes avant notre arrivée",
  "Photo et e-mail de confirmation après chaque passage",
];


const ResidentialDetailSection = ({ onOpenQuote }: { onOpenQuote?: () => void }) => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4 max-w-5xl">
      {/* ── Bloc 1 : Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="font-display font-bold text-secondary text-sm uppercase tracking-widest mb-2 block">
          Service Résidentiel
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
          Un Jardin Propre, Sans Lever le Petit Doigt
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
          Vous en avez assez de consacrer votre temps libre au ramassage des déjections de votre chien ?
          Chez Crotte&Go, nous prenons en charge cette corvée pour que vous puissiez profiter pleinement
          de votre jardin en famille, en toute tranquillité.
        </p>
      </motion.div>

      {/* ── Service plans ── */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-2xl font-bold text-foreground text-center mb-10"
      >
        Nos Formules de Ramassage
      </motion.h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-card text-center hover:shadow-card-hover transition-all hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent mb-4">
              <s.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <h4 className="font-display font-bold text-foreground mb-2">{s.title}</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Bloc 2 : À quoi s'attendre ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          À Quoi S'attendre le Jour de Notre Passage ?
        </h3>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          De la notification initiale au rapport final, chaque étape est pensée pour votre tranquillité.
        </p>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-5 bg-card rounded-2xl p-6 shadow-card"
            >
              <div className="shrink-0 flex items-start">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent">
                  <step.icon className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground mb-1">{step.title}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Bloc 4 : Éducatif ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20 bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-destructive/10">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            L'importance du ramassage : Protégez votre environnement
          </h3>
        </div>
        <p className="text-muted-foreground leading-relaxed text-lg mb-4">
          Les déjections canines ne sont pas seulement une nuisance visuelle ; elles sont considérées comme des déchets dangereux en raison des bactéries et des parasites nocifs qu'elles peuvent contenir.
        </p>
        <p className="text-muted-foreground leading-relaxed text-lg">
          Lorsqu'elles ne sont pas ramassées, elles peuvent contaminer le sol et même polluer les cours d'eau locaux, posant de graves risques pour la santé des humains comme des animaux. En éliminant régulièrement ces déchets, un service professionnel aide à prévenir la propagation de maladies et garantit un environnement plus propre et plus sûr pour votre famille, vos animaux et votre communauté.
        </p>
      </motion.div>

      {/* ── Bloc 5 : Pourquoi faire appel à nous + CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent">
            <Heart className="w-7 h-7 text-accent-foreground" />
          </div>
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Détendez-vous, on s'occupe du ramassage
        </h3>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto mb-4">
          Au lieu de consacrer votre précieux temps libre à ramasser les crottes de votre chien, profitez de moments de qualité avec votre fidèle compagnon et votre famille. Notre service professionnel garantit un jardin propre et hygiénique, sans aucun effort de votre part.
        </p>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto mb-8">
          Que vous ayez un emploi du temps chargé, des problèmes de mobilité ou que vous préfériez simplement éviter cette corvée désagréable, notre service de ramassage est la solution fiable qu'il vous faut.
        </p>
        <Button variant="cta" size="lg" className="rounded-full px-10 py-6 text-lg" onClick={onOpenQuote}>
          <PawIcon className="w-5 h-5" /> Réserver mon nettoyage maintenant
        </Button>
      </motion.div>

    </div>
  </section>
);

export default ResidentialDetailSection;
