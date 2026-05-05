import { useState } from "react";
import { FileText, Download, DollarSign, Minus, Calculator, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const generateAnnualData = () => {
    const months = monthNames.map((month, i) => {
        const gross = Math.round(Math.random() * 400 + 100);
        const fees = Math.round(gross * 0.1);
        const orders = Math.round(Math.random() * 20 + 5);
        return { month, monthIndex: i, gross, fees, net: gross - fees, orders };
    });
    const totals = months.reduce((a, m) => ({
        gross: a.gross + m.gross,
        fees: a.fees + m.fees,
        net: a.net + m.net,
        orders: a.orders + m.orders,
    }), { gross: 0, fees: 0, net: 0, orders: 0 });
    return { months, totals };
};

const TaxDocumentGenerator = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [taxYear, setTaxYear] = useState(new Date().getFullYear());
    const [tin, setTin] = useState("");
    const [businessName, setBusinessName] = useState(profile?.full_name || "");
    const [address, setAddress] = useState("");

    const data = generateAnnualData();

    const handlePrint = () => {
        const win = window.open("", "_blank");
        if (!win) return;
        win.document.write(`
      <html><head><title>Tax Summary ${taxYear}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, system-ui, sans-serif; padding: 40px; color: #1a1a1a; font-size: 13px; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        .subtitle { color: #666; margin-bottom: 24px; }
        .section { margin: 20px 0; }
        .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 8px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 12px; }
        th { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 600; }
        td.right, th.right { text-align: right; }
        .summary-row { background: #f8f8f8; font-weight: 700; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 32px; }
        .info-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; }
        .info-item p { font-size: 13px; margin-top: 2px; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 10px; color: #aaa; }
        @media print { body { padding: 20px; } }
      </style>
      </head><body>
        <h1>Tax Earnings Summary</h1>
        <p class="subtitle">Tax Year ${taxYear} • Affilyt Platform</p>

        <div class="section">
          <p class="section-title">Affiliate Information</p>
          <div class="info-grid">
            <div class="info-item"><label>Name</label><p>${businessName || "—"}</p></div>
            <div class="info-item"><label>TIN</label><p>${tin || "—"}</p></div>
            <div class="info-item"><label>Email</label><p>${user?.email || "—"}</p></div>
            <div class="info-item"><label>Address</label><p>${address || "—"}</p></div>
          </div>
        </div>

        <div class="section">
          <p class="section-title">Monthly Breakdown</p>
          <table>
            <thead><tr><th>Month</th><th class="right">Gross</th><th class="right">Fees</th><th class="right">Net</th><th class="right">Orders</th></tr></thead>
            <tbody>
              ${data.months.map(m => `<tr><td>${m.month}</td><td class="right">$${m.gross}</td><td class="right">$${m.fees}</td><td class="right">$${m.net}</td><td class="right">${m.orders}</td></tr>`).join("")}
              <tr class="summary-row"><td>Total</td><td class="right">$${data.totals.gross}</td><td class="right">$${data.totals.fees}</td><td class="right">$${data.totals.net}</td><td class="right">${data.totals.orders}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="footer">
          Generated on ${new Date().toLocaleDateString()} • This is not a tax form. For tax advice, consult a professional. • Affilyt
        </div>
      </body></html>
    `);
        win.document.close();
        setTimeout(() => win.print(), 300);
        toast({ title: "PDF Ready", description: "Print dialog opened. Save as PDF to download." });
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Tax Documents</h2>
                <p className="text-sm text-muted-foreground mt-1">Generate your annual earnings PDF for tax filing.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info Form */}
                <div className="lg:col-span-1 space-y-5">
                    <div className="p-5 sm:p-6 rounded-2xl glass space-y-4">
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary" />
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Your Info</h3>
                        </div>
                        {[
                            { label: "Tax Year", value: taxYear.toString(), set: (v: string) => setTaxYear(parseInt(v) || new Date().getFullYear()), type: "number" },
                            { label: "Name / Business", value: businessName, set: setBusinessName },
                            { label: "TIN", value: tin, set: setTin, placeholder: "Tax ID Number" },
                            { label: "Address", value: address, set: setAddress, placeholder: "City, Country" },
                        ].map(f => (
                            <div key={f.label} className="space-y-1.5">
                                <label className="text-[11px] font-medium uppercase text-muted-foreground tracking-wider">{f.label}</label>
                                <Input value={f.value} onChange={e => f.set(e.target.value)} type={f.type || "text"} className="h-10 rounded-xl bg-secondary border-none text-sm" placeholder={f.placeholder} />
                            </div>
                        ))}
                    </div>

                    <Button onClick={handlePrint} className="w-full h-11 rounded-xl font-semibold text-sm">
                        <Download className="h-4 w-4 mr-2" /> Generate PDF
                    </Button>
                </div>

                {/* Earnings Table */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Gross", value: `$${data.totals.gross.toLocaleString()}`, icon: DollarSign },
                            { label: "Fees", value: `$${data.totals.fees.toLocaleString()}`, icon: Minus },
                            { label: "Net", value: `$${data.totals.net.toLocaleString()}`, icon: Calculator },
                            { label: "Orders", value: data.totals.orders.toString(), icon: FileText },
                        ].map((s, i) => (
                            <div key={i} className="p-4 rounded-2xl glass">
                                <div className="flex items-center gap-2 mb-1">
                                    <s.icon className="h-3.5 w-3.5 text-primary" />
                                    <p className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">{s.label}</p>
                                </div>
                                <p className="text-lg font-bold text-foreground">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Monthly Breakdown */}
                    <div className="p-5 sm:p-6 rounded-2xl glass">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Monthly Breakdown — {taxYear}</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[400px]">
                                <thead>
                                    <tr className="border-b border-border">
                                        {["Month", "Gross", "Fees", "Net", "Orders"].map(h => (
                                            <th key={h} className={`py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ${h !== "Month" ? "text-right" : "text-left"}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.months.map(m => (
                                        <tr key={m.month} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                                            <td className="py-2.5 text-sm font-medium text-foreground">{m.month}</td>
                                            <td className="py-2.5 text-sm text-right font-mono">${m.gross}</td>
                                            <td className="py-2.5 text-sm text-right font-mono text-muted-foreground">${m.fees}</td>
                                            <td className="py-2.5 text-sm text-right font-mono font-semibold">${m.net}</td>
                                            <td className="py-2.5 text-sm text-right font-mono text-muted-foreground">{m.orders}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-secondary/30">
                                        <td className="py-2.5 text-sm font-bold text-foreground">Total</td>
                                        <td className="py-2.5 text-sm text-right font-mono font-bold">${data.totals.gross}</td>
                                        <td className="py-2.5 text-sm text-right font-mono font-bold text-muted-foreground">${data.totals.fees}</td>
                                        <td className="py-2.5 text-sm text-right font-mono font-bold text-primary">${data.totals.net}</td>
                                        <td className="py-2.5 text-sm text-right font-mono font-bold">{data.totals.orders}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxDocumentGenerator;
