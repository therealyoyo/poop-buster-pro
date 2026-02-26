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
import { translateAuthError } from "@/lib/authErrors";

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
      toast.error(translateAuthError(err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/portal/auth-callback`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(translateAuthError(err.message || ""));
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

                {/* Separator */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">OU</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Google Button */}
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuer avec Google
                </Button>

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
