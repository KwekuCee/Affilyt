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
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-4">
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage products, sellers, and payouts</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Products" value={String(productsList.length)} icon={Package} />
            <StatsCard title="Active Sellers" value={String(affiliatesList.filter((a) => a.status === "Active").length)} icon={Users} />
            <StatsCard title="Pending Payouts" value={String(payouts.filter((p) => p.status === "Pending").length)} icon={CreditCard} />
            <StatsCard title="Total Revenue" value="₵12,450" icon={DollarSign} trend="+18% this month" />
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-0">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Products Tab */}
          {tab === "products" && (
            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-base font-semibold text-foreground">All Products</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="rounded-full gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-2">
                      <Input placeholder="Product title" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
                      <Textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                      <Input placeholder="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                      <select
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        <option>E-books</option>
                        <option>Software</option>
                        <option>Courses</option>
                      </select>
                      <Button onClick={addProduct} className="w-full rounded-full">Add Product</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="px-6 py-3 font-medium">Product</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium">Price</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-4 font-medium text-foreground">{p.title}</td>
                        <td className="px-6 py-4"><Badge variant="secondary">{p.category}</Badge></td>
                        <td className="px-6 py-4 text-foreground">₵{p.price}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button size="sm" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteProduct(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sellers Tab */}
          {tab === "sellers" && (
            <div className="rounded-2xl border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Seller</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Payment</th>
                    <th className="px-6 py-3 font-medium text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliatesList.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{a.avatar}</span>
                        {a.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{a.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={a.status === "Active" ? "default" : "destructive"}>{a.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        {a.paid && <Badge variant="secondary" className="text-success border-success/20 bg-success/10">Paid</Badge>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Switch checked={a.status === "Active"} onCheckedChange={() => toggleAffiliate(a.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payouts Tab */}
          {tab === "payouts" && (
            <div className="rounded-2xl border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Affiliate</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 font-medium text-foreground">{p.affiliateName}</td>
                      <td className="px-6 py-4 text-foreground">₵{p.amount}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.date}</td>
                      <td className="px-6 py-4">
                        <Badge variant={p.status === "Pending" ? "secondary" : p.status === "Approved" ? "default" : "destructive"}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {p.status === "Pending" && (
                          <>
                            <Button size="sm" variant="outline" className="gap-1 text-success border-success/30 hover:bg-success/10" onClick={() => handlePayout(p.id, "Approved")}>
                              <CheckCircle className="h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handlePayout(p.id, "Declined")}>
                              <XCircle className="h-3.5 w-3.5" /> Decline
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
