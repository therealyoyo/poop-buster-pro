import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PawIcon from "@/components/PawIcon";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PortalLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminError, setAdminError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (role?.role === "admin") {
          setAdminError(true);
        } else {
          navigate("/portal", { replace: true });
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setAdminError(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (role?.role === "admin") {
          setAdminError(true);
          await supabase.auth.signOut();
        } else {
          navigate("/portal", { replace: true });
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background paw-pattern flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold text-primary">
            <PawIcon className="w-8 h-8 animate-paw-bounce" />
            Crotte & Go
          </Link>
        </div>

        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-xl">
              Mon espace Crotte & Go 🐾
            </CardTitle>
            <CardDescription>
              Consultez vos passages, factures et messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adminError ? (
              <div className="text-center space-y-4">
                <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
                  Ce portail est réservé aux clients. Accédez à l'admin{" "}
                  <Link to="/admin-login" className="underline font-medium">ici →</Link>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mot de passe</Label>
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                  </div>
                  <Button type="submit" variant="cta" className="w-full rounded-full" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Se connecter
                  </Button>
                </form>

                <div className="mt-4 text-center space-y-2">
                  <Link to="/reset-password" className="text-sm text-muted-foreground hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <p className="mt-6 text-xs text-muted-foreground text-center">
                  Votre compte est créé automatiquement lors de l'acceptation de votre devis.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PortalLogin;
