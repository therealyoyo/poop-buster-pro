import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PawIcon from "@/components/PawIcon";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <div className="min-h-screen bg-background paw-pattern flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold text-primary">
            <PawIcon className="w-8 h-8 animate-paw-bounce" />
            Crotte & Go
          </Link>
        </div>

        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-xl">🐾</CardTitle>
            <CardDescription className="font-display text-lg font-bold text-foreground">
              Portail client — Bientôt disponible !
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Votre espace personnel est en cours de préparation. Vous recevrez un email dès qu'il sera accessible.
            </p>
            <p className="text-sm text-muted-foreground">
              Une question ? Contactez-nous à{" "}
              <a href="mailto:hello@crotteandgo.be" className="text-primary underline">hello@crotteandgo.be</a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
