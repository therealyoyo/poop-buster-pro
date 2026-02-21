import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PawIcon from "@/components/PawIcon";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent, role: "admin" | "client") => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Connexion réussie ! 🐾");
      navigate(role === "admin" ? "/admin" : "/portal");
    }, 800);
  };

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
            <CardTitle className="font-display text-xl">Bon retour ! 🐾</CardTitle>
            <CardDescription>Connectez-vous à votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="client">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="client" className="flex-1">Portail client</TabsTrigger>
                <TabsTrigger value="admin" className="flex-1">Admin</TabsTrigger>
              </TabsList>
              <TabsContent value="client">
                <form onSubmit={(e) => handleLogin(e, "client")} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="clientEmail">Courriel</Label>
                    <Input id="clientEmail" type="email" placeholder="vous@exemple.com" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="clientPassword">Mot de passe</Label>
                    <Input id="clientPassword" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" variant="cta" className="w-full rounded-full" disabled={loading}>
                    {loading ? "Connexion..." : "Accéder à mon portail"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="admin">
                <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="adminEmail">Courriel</Label>
                    <Input id="adminEmail" type="email" placeholder="admin@poopbuster.com" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="adminPassword">Mot de passe</Label>
                    <Input id="adminPassword" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Connexion..." : "Connexion admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Nouveau client ? <Link to="/#signup" className="text-primary font-semibold hover:underline">Inscrivez-vous gratuitement</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
