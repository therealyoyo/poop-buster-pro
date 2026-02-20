import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

const ClientSettings = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings updated! 🐾");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2 mb-6">
          <SettingsIcon className="w-7 h-7 text-primary" />
          Account Settings
        </h1>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input defaultValue="Sarah" />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input defaultValue="Johnson" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="sarah@email.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input type="tel" defaultValue="(555) 123-4567" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Service Address</Label>
                <Input defaultValue="123 Oak St, Springfield, 12345" />
              </div>
              <div className="space-y-1.5">
                <Label>Special Instructions / Gate Code</Label>
                <Textarea defaultValue="Gate code #1234. Dogs are friendly, usually in the backyard." rows={3} />
              </div>
              <Button type="submit" variant="hero">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSettings;
