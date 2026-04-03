import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Users, CreditCard, DollarSign, Plus, Pencil, Trash2, CheckCircle, XCircle, Search, Building2, Landmark } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { products as initialProducts, affiliates as initialAffiliates, payoutRequests as initialPayouts, Product } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [productsList, setProductsList] = useState(initialProducts);
  const [affiliatesList, setAffiliatesList] = useState(initialAffiliates);
  const [payouts, setPayouts] = useState(initialPayouts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", category: "E-books" });
  const [sellerSearch, setSellerSearch] = useState("");

  const addProduct = () => {
    const p: Product = {
      id: String(Date.now()),
      title: newProduct.title,
      subtitle: "New Product",
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

  const filteredSellers = affiliatesList.filter(a =>
    a.name.toLowerCase().includes(sellerSearch.toLowerCase())
  );

  const pendingPayouts = payouts.filter(p => p.status === "Pending");

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar type="admin" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card px-8 py-6">
          <h1 className="text-3xl font-black text-foreground">Superadmin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Centralized governance for the marketplace ecosystem.</p>
        </div>

        <div className="p-8 space-y-10">
          {/* Inventory Manager */}
          <section>
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Inventory Manager</h2>
                  <p className="text-xs text-muted-foreground">Managing digital assets and distribution rights.</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="rounded-lg bg-primary text-primary-foreground gap-1.5 text-xs h-9 px-4">
                      <Plus className="h-4 w-4" /> Add New Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-xl">
                    <DialogHeader><DialogTitle className="font-bold">Add New Product</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-2">
                      <Input placeholder="Product title" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="rounded-lg" />
                      <Textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="rounded-lg" />
                      <Input placeholder="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="rounded-lg" />
                      <select
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        <option>E-books</option>
                        <option>Software</option>
                        <option>Courses</option>
                      </select>
                      <Button onClick={addProduct} className="w-full rounded-lg bg-primary text-primary-foreground">Save Product</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Product Name</th>
                      <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Category</th>
                      <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Stock</th>
                      <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Price</th>
                      <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-primary cursor-pointer hover:underline">{p.title}</span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{p.category === "E-books" ? "Digital Assets" : p.category === "Software" ? "SaaS Platform" : "Digital Course"}</td>
                        <td className="px-6 py-4 text-muted-foreground">{p.category === "Software" ? "Unlimited" : `${Math.floor(Math.random() * 80 + 20)} Units`}</td>
                        <td className="px-6 py-4 text-foreground font-bold font-mono">${p.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <Button size="sm" variant="ghost" className="rounded-lg h-8 w-8 p-0"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                          <Button size="sm" variant="ghost" className="rounded-lg h-8 w-8 p-0" onClick={() => deleteProduct(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Seller Management */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Seller Management</h2>
                <p className="text-xs text-muted-foreground">Verified partners and institutional sellers.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search sellers..."
                  value={sellerSearch}
                  onChange={(e) => setSellerSearch(e.target.value)}
                  className="pl-9 h-9 w-56 rounded-lg bg-secondary border-0 text-sm"
                />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Seller Identity</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Registration</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Volume</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-right">Governance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {a.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{a.name}</p>
                            <p className="text-[10px] text-muted-foreground">{a.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          a.registrationType === "PAID REGISTRATION"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground border border-border"
                        }`}>
                          {a.registrationType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{a.volume}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${a.status === "Active" ? "bg-success" : "bg-destructive"}`} />
                          <span className={`text-sm ${a.status === "Active" ? "text-success" : "text-destructive"}`}>{a.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => toggleAffiliate(a.id)}
                          className={`rounded-lg text-xs h-8 px-4 font-semibold ${
                            a.status === "Active"
                              ? "bg-foreground text-background hover:bg-foreground/90"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {a.status === "Active" ? "Suspend Access" : "Restore Access"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Payout Queue */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Payout Queue</h2>
                <p className="text-xs text-muted-foreground">Pending withdrawal requests for treasury approval.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-1.5 text-xs font-bold">
                <CreditCard className="h-3.5 w-3.5" /> {pendingPayouts.length} REQUESTS PENDING
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {payouts.map((p) => (
                <div key={p.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Request #{p.requestId}</p>
                      <p className="text-2xl font-black text-foreground mt-1">${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                      {p.method === "Wire Transfer" ? <Building2 className="h-4 w-4 text-muted-foreground" /> :
                       p.method === "SWIFT" ? <Landmark className="h-4 w-4 text-muted-foreground" /> :
                       <CreditCard className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm mb-5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="font-semibold text-foreground">{p.affiliateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="font-semibold text-foreground">{p.method}</span>
                    </div>
                  </div>
                  {p.status === "Pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-lg bg-primary text-primary-foreground text-xs h-9 font-semibold"
                        onClick={() => handlePayout(p.id, "Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-lg text-xs h-9 font-semibold"
                        onClick={() => handlePayout(p.id, "Declined")}
                      >
                        Decline
                      </Button>
                    </div>
                  ) : (
                    <span className={`inline-flex rounded-md px-3 py-1.5 text-xs font-bold ${
                      p.status === "Approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}>
                      {p.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-border px-8 py-6 mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-muted-foreground uppercase tracking-wider">
            <span>© 2024 THE EXECUTIVE LEDGER. BUILT FOR INSTITUTIONAL TRUST.</span>
            <div className="flex gap-6">
              <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
              <span className="hover:text-foreground cursor-pointer">Privacy Policy</span>
              <span className="hover:text-foreground cursor-pointer">Contact</span>
              <span className="hover:text-foreground cursor-pointer">API Documentation</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
