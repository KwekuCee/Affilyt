import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Users, CreditCard, DollarSign, Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { products as initialProducts, affiliates as initialAffiliates, payoutRequests as initialPayouts, Product } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [productsList, setProductsList] = useState(initialProducts);
  const [affiliatesList, setAffiliatesList] = useState(initialAffiliates);
  const [payouts, setPayouts] = useState(initialPayouts);
  const [tab, setTab] = useState<"products" | "sellers" | "payouts">("products");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", category: "E-books" });

  const addProduct = () => {
    const p: Product = {
      id: String(Date.now()),
      title: newProduct.title,
      description: newProduct.description,
      price: Number(newProduct.price),
      category: newProduct.category as Product["category"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      features: ["Digital download", "Instant access"],
    };
    setProductsList([...productsList, p]);
    setDialogOpen(false);
    setNewProduct({ title: "", description: "", price: "", category: "E-books" });
    toast({ title: "Product added!" });
  };

  const deleteProduct = (id: string) => {
    setProductsList(productsList.filter((p) => p.id !== id));
    toast({ title: "Product deleted" });
  };

  const toggleAffiliate = (id: string) => {
    setAffiliatesList(affiliatesList.map((a) =>
      a.id === id ? { ...a, status: a.status === "Active" ? "Suspended" as const : "Active" as const } : a
    ));
  };

  const handlePayout = (id: string, action: "Approved" | "Declined") => {
    setPayouts(payouts.map((p) => (p.id === id ? { ...p, status: action } : p)));
    toast({ title: `Payout ${action.toLowerCase()}` });
  };

  const tabs = [
    { key: "products" as const, label: "Products", icon: Package },
    { key: "sellers" as const, label: "Sellers", icon: Users },
    { key: "payouts" as const, label: "Payouts", icon: CreditCard },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="admin" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-5">
          <h1 className="text-xl font-extrabold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage products, sellers, and payouts</p>
        </div>

        <div className="p-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Products" value={String(productsList.length)} icon={Package} />
            <StatsCard title="Active Sellers" value={String(affiliatesList.filter((a) => a.status === "Active").length)} icon={Users} />
            <StatsCard title="Pending Payouts" value={String(payouts.filter((p) => p.status === "Pending").length)} icon={CreditCard} />
            <StatsCard title="Total Revenue" value="₵12,450" icon={DollarSign} trend="+18% this month" />
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl bg-secondary p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Products Tab */}
          {tab === "products" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-sm font-bold text-foreground">All Products</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="rounded-full gradient-btn border-0 gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader><DialogTitle className="font-extrabold">Add New Product</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-2">
                      <Input placeholder="Product title" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="rounded-xl" />
                      <Textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="rounded-xl" />
                      <Input placeholder="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="rounded-xl" />
                      <select
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        <option>E-books</option>
                        <option>Software</option>
                        <option>Courses</option>
                      </select>
                      <Button onClick={addProduct} className="w-full rounded-full gradient-btn border-0">Add Product</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Product</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Category</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Price</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
                        <td className="px-6 py-4 font-semibold text-foreground">{p.title}</td>
                        <td className="px-6 py-4"><span className="inline-flex rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">{p.category}</span></td>
                        <td className="px-6 py-4 text-foreground font-mono">₵{p.price}</td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <Button size="sm" variant="ghost" className="rounded-lg"><Pencil className="h-4 w-4 text-muted-foreground" /></Button>
                          <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => deleteProduct(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Sellers Tab */}
          {tab === "sellers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Seller</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Email</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Payment</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliatesList.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-btn text-xs font-bold">{a.avatar}</span>
                          {a.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{a.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          a.status === "Active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                        }`}>{a.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        {a.paid && <span className="inline-flex rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">Paid</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Switch checked={a.status === "Active"} onCheckedChange={() => toggleAffiliate(a.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* Payouts Tab */}
          {tab === "payouts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Affiliate</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Amount</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
                      <td className="px-6 py-4 font-semibold text-foreground">{p.affiliateName}</td>
                      <td className="px-6 py-4 text-foreground font-mono font-bold">₵{p.amount}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.status === "Pending" ? "bg-warning/10 text-warning" :
                          p.status === "Approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {p.status === "Pending" && (
                          <>
                            <Button size="sm" variant="outline" className="gap-1 rounded-full text-xs border-success/30 text-success hover:bg-success/10" onClick={() => handlePayout(p.id, "Approved")}>
                              <CheckCircle className="h-3 w-3" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 rounded-full text-xs border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => handlePayout(p.id, "Declined")}>
                              <XCircle className="h-3 w-3" /> Decline
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
