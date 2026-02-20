import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, AlertCircle, UserPlus, BarChart3 } from "lucide-react";
import PawIcon from "@/components/PawIcon";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Clients", value: "127", icon: Users, change: "+8 this month" },
  { label: "Active Clients", value: "98", icon: UserPlus, change: "77% active" },
  { label: "Monthly Revenue", value: "$8,420", icon: DollarSign, change: "+12% vs last month" },
  { label: "Invoices Due", value: "14", icon: AlertCircle, change: "$1,240 pending" },
];

const revenueData = [
  { month: "Mar", revenue: 5200 }, { month: "Apr", revenue: 5800 },
  { month: "May", revenue: 6100 }, { month: "Jun", revenue: 6900 },
  { month: "Jul", revenue: 7200 }, { month: "Aug", revenue: 7500 },
  { month: "Sep", revenue: 7100 }, { month: "Oct", revenue: 7800 },
  { month: "Nov", revenue: 8000 }, { month: "Dec", revenue: 7600 },
  { month: "Jan", revenue: 8100 }, { month: "Feb", revenue: 8420 },
];

const serviceBreakdown = [
  { name: "Scooping", value: 6800, color: "hsl(152, 56%, 32%)" },
  { name: "Deodorizing", value: 1620, color: "hsl(30, 35%, 45%)" },
];

const recentClients = [
  { name: "Sarah Johnson", dogs: 2, plan: "Weekly", status: "Active", revenue: "$180/mo" },
  { name: "Mike Chen", dogs: 1, plan: "Bi-Weekly", status: "Active", revenue: "$80/mo" },
  { name: "Emily Davis", dogs: 3, plan: "Weekly", status: "Active", revenue: "$240/mo" },
  { name: "Tom Wilson", dogs: 1, plan: "Monthly", status: "Paused", revenue: "$45/mo" },
  { name: "Lisa Park", dogs: 2, plan: "Weekly", status: "Active", revenue: "$180/mo" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
              <PawIcon className="w-7 h-7 text-primary" />
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your business overview.</p>
          </div>
          <Link to="/admin/clients">
            <Button variant="hero" size="sm">
              <UserPlus className="w-4 h-4" /> Add Client
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-display font-bold text-foreground mt-1">{s.value}</p>
                      <p className="text-xs text-primary mt-1">{s.change}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-accent">
                      <s.icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Revenue (Last 12 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 18%, 85%)" />
                  <XAxis dataKey="month" stroke="hsl(30, 15%, 45%)" fontSize={12} />
                  <YAxis stroke="hsl(30, 15%, 45%)" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                    contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(35, 18%, 85%)" }}
                  />
                  <Bar dataKey="revenue" fill="hsl(152, 56%, 32%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Service Breakdown */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenue by Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={serviceBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={5}>
                    {serviceBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {serviceBreakdown.map(s => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Clients */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Recent Clients</CardTitle>
            <Link to="/admin/clients">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Dogs</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClients.map(c => (
                    <tr key={c.name} className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                      <td className="py-3 px-2 font-medium text-foreground">{c.name}</td>
                      <td className="py-3 px-2 text-muted-foreground">{c.dogs} 🐕</td>
                      <td className="py-3 px-2 text-muted-foreground">{c.plan}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.status === "Active" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-foreground">{c.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
