import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PawIcon from "@/components/PawIcon";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, Dog, Leaf, Shield } from "lucide-react";

const OnboardingForm = () => {
  const [deodorizing, setDeodorizing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Will connect to Supabase later
    setSubmitted(true);
    toast.success("Welcome to Poop Buster! 🐾 We'll be in touch soon.");
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">You're All Set! 🎉</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thanks for signing up! We'll reach out shortly to confirm your first free cleanup. Your pup's yard is about to get a whole lot cleaner!
        </p>
      </motion.div>
    );
  }

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
          <PawIcon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="font-display text-2xl">Get Your Free First Cleanup!</CardTitle>
        <CardDescription>Fill out the form below and we'll take care of the rest 🐾</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Smith" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="street">Street Address</Label>
            <Input id="street" placeholder="123 Green Lawn Dr" required />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Springfield" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" placeholder="12345" required />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <Label htmlFor="dogs">Number of Dogs</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "dog" : "dogs"}</SelectItem>
                  ))}
                  <SelectItem value="6+">6+ dogs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Yard Size</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select yard size" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Service Frequency</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="How often?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="onetime">One-Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deodorizing add-on */}
          <div className="rounded-lg border border-primary/20 bg-accent/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Leaf className="w-4 h-4 text-primary" />
                  <Label htmlFor="deodorizing" className="font-display font-bold text-foreground">
                    Add Yard Deodorizing Service
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our safe, non-toxic, biodegradable enzyme formula neutralizes pet waste odors. 
                  100% safe for pets, kids, and the environment. 🌿
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pet Safe</span>
                  <span className="flex items-center gap-1"><Dog className="w-3 h-3" /> Kid Safe</span>
                  <span className="flex items-center gap-1"><Leaf className="w-3 h-3" /> Eco-Friendly</span>
                </div>
              </div>
              <Switch id="deodorizing" checked={deodorizing} onCheckedChange={setDeodorizing} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>How did you hear about us?</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Special Instructions / Gate Code</Label>
            <Textarea id="notes" placeholder="e.g., Gate code is #1234, dogs are friendly..." rows={3} />
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full text-lg py-6">
            <PawIcon className="w-5 h-5 mr-1" />
            Get My Free First Cleanup!
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OnboardingForm;
