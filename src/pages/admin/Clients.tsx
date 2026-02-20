import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Filter } from "lucide-react";
import { useState } from "react";
import PawIcon from "@/components/PawIcon";

const allClients = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", address: "123 Oak St", dogs: 2, plan: "Weekly", status: "Active", deodorizing: true, revenue: 2160, nextService: "Feb 22, 2026" },
  { id: 2, name: "Mike Chen", email: "mike@email.com", address: "456 Pine Ave", dogs: 1, plan: "Bi-Weekly", status: "Active", deodorizing: false, revenue: 960, nextService: "Feb 25, 2026" },
  { id: 3, name: "Emily Davis", email: "emily@email.com", address: "789 Elm Dr", dogs: 3, plan: "Weekly", status: "Active", deodorizing: true, revenue: 3480, nextService: "Feb 21, 2026" },
  { id: 4, name: "Tom Wilson", email: "tom@email.com", address: "321 Maple Ln", dogs: 1, plan: "Monthly", status: "Paused", deodorizing: false, revenue: 540, nextService: "—" },
  { id: 5, name: "Lisa Park", email: "lisa@email.com", address: "654 Cedar Blvd", dogs: 2, plan: "Weekly", status: "Active", deodorizing: false, revenue: 1800, nextService: "Feb 23, 2026" },
  { id: 6, name: "James Brown", email: "james@email.com", address: "987 Birch Ct", dogs: 4, plan: "Weekly", status: "Active", deodorizing: true, revenue: 4800, nextService: "Feb 22, 2026" },
  { id: 7, name: "Anna Kim", email: "anna@email.com", address: "135 Walnut St", dogs: 1, plan: "Bi-Weekly", status: "Cancelled", deodorizing: false, revenue: 320, nextService: "—" },
  { id: 8, name: "David Lee", email: "david@email.com", address: "246 Ash Rd", dogs: 2, plan: "Monthly", status: "Active", deodorizing: true, revenue: 720, nextService: "Mar 1, 2026" },
];

const AdminClients = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = allClients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <PawIcon className="w-7 h-7 text-primary" />
            Client Management
          </h1>
          <Button variant="hero" size="sm">
            <UserPlus className="w-4 h-4" /> Add Client
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-card mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <Filter className="w-4 h-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Client Table */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">Address</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Dogs</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Deodorizing</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">Next Service</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{c.address}</td>
                      <td className="py-3 px-4 text-center">{c.dogs} 🐕</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{c.plan}</td>
                      <td className="py-3 px-4">
                        <Badge variant={c.status === "Active" ? "default" : c.status === "Paused" ? "secondary" : "destructive"}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center hidden lg:table-cell">
                        {c.deodorizing ? "✅" : "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">{c.nextService}</td>
                      <td className="py-3 px-4 text-right font-medium text-foreground">${c.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <PawIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No clients found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminClients;
