import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PawIcon from "@/components/PawIcon";
import { Calendar, DollarSign, Leaf, Star, MapPin, Dog } from "lucide-react";
import { Link } from "react-router-dom";

const ClientDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <PawIcon className="w-7 h-7 text-primary animate-paw-bounce" />
            Hi, Sarah! 🐾
          </h1>
          <p className="text-muted-foreground mt-1">Here's your service overview.</p>
        </motion.div>

        {/* Fun Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-hero-gradient text-primary-foreground shadow-card mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
              <PawIcon className="w-full h-full" />
            </div>
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6" />
                <h2 className="font-display text-xl font-bold">Your Yard Scorecard</h2>
              </div>
              <p className="text-primary-foreground/80 text-lg">
                Your yard has been scooped <span className="font-bold text-primary-foreground">47 times</span> this year! That's over <span className="font-bold text-primary-foreground">94 lbs</span> of poop we've removed! 💪🐕
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Your Service Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency</span>
                  <span className="font-medium text-foreground">Weekly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Visit</span>
                  <span className="font-medium text-foreground">Feb 22, 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><Dog className="w-4 h-4" /> Dogs</span>
                  <span className="font-medium text-foreground">2 dogs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><Leaf className="w-4 h-4" /> Deodorizing</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">Active ✅</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4" /> Address</span>
                  <span className="text-sm text-foreground">123 Oak St</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Billing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="font-bold text-foreground text-lg">$180/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scooping</span>
                  <span className="text-foreground">$150</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deodorizing Add-on</span>
                  <span className="text-foreground">$30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Invoice</span>
                  <span className="text-foreground">Mar 1, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">All Paid ✅</span>
                </div>
                <Link to="/portal/invoices">
                  <Button variant="outline" size="sm" className="w-full mt-2">View All Invoices →</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Services */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display">Recent Service Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "Feb 15, 2026", notes: "Full yard cleanup + deodorizing ✨", tech: "Mike" },
                { date: "Feb 8, 2026", notes: "Regular cleanup, gate code worked fine 🐾", tech: "Mike" },
                { date: "Feb 1, 2026", notes: "Full cleanup + deodorizing, extra attention to backyard", tech: "Sarah" },
                { date: "Jan 25, 2026", notes: "Regular weekly cleanup 🐕", tech: "Mike" },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-medium text-foreground text-sm">{v.date}</p>
                    <p className="text-xs text-muted-foreground">{v.notes}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Tech: {v.tech}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
