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
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: clientEmail,
        password: clientPassword,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Connexion réussie ! 🐾");
      navigate("/portal");
    } catch {
      toast.error("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleData) {
        await supabase.auth.signOut();
        toast.error("Accès admin refusé.");
        return;
      }
      toast.success("Connexion admin réussie ! 🐾");
      navigate("/admin");
    } catch {
      toast.error("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Erreur de connexion Google.");
  };

  const handleForgotPassword = async () => {
    if (!clientEmail.trim()) {
      toast.error("Veuillez d'abord entrer votre email.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(clientEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Un lien de réinitialisation a été envoyé à votre email.");
    }
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
                <div className="space-y-4">
                  {/* Google login */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continuer avec Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  <form onSubmit={handleClientLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="clientEmail">Courriel</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        placeholder="vous@exemple.com"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="clientPassword">Mot de passe</Label>
                      <Input
                        id="clientPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={clientPassword}
                        onChange={(e) => setClientPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" variant="cta" className="w-full rounded-full" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {loading ? "Connexion..." : "Accéder à mon portail"}
                    </Button>
                  </form>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-primary hover:underline w-full text-center"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </TabsContent>
              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="adminEmail">Courriel</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@crotteetgo.be"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="adminPassword">Mot de passe</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {loading ? "Connexion..." : "Connexion admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Nouveau client ? <Link to="/?quote=true" className="text-primary font-semibold hover:underline">Inscrivez-vous gratuitement</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
