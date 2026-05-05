import { useState, useRef } from "react";
import {
    FileText, Download, Printer, Calendar, DollarSign,
    Building2, User, MapPin, Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

// Mock annual earnings by month
const generateMockAnnual = (year: number) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months.map((month, i) => ({
        month,
        gross: Math.round(Math.random() * 800 + 200),
        fees: Math.round(Math.random() * 40 + 5),
        orders: Math.round(Math.random() * 30 + 5),
    }));
};

const TaxDocumentGenerator = () => {
    const { profile } = useAuth();
    const printRef = useRef<HTMLDivElement>(null);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [taxInfo, setTaxInfo] = useState({
        tin: "",
        businessName: "",
        address: "",
    });
    const [showPreview, setShowPreview] = useState(false);

    const annualData = generateMockAnnual(selectedYear);
    const totalGross = annualData.reduce((s, m) => s + m.gross, 0);
    const totalFees = annualData.reduce((s, m) => s + m.fees, 0);
    const totalNet = totalGross - totalFees;
    const totalOrders = annualData.reduce((s, m) => s + m.orders, 0);

    const handlePrint = () => {
        const el = printRef.current;
        if (!el) return;
        const win = window.open("", "_blank");
        if (!win) return;
        win.document.write(`
      <html>
        <head>
          <title>Tax Document — ${selectedYear}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #111; }
            .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #111; }
            .header h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; }
            .header p { color: #666; font-size: 12px; margin-top: 4px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-box { padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
            .info-label { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #888; letter-spacing: 0.1em; }
            .info-value { font-size: 14px; font-weight: 700; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; background: #f5f5f5; padding: 10px 12px; text-align: left; border-bottom: 2px solid #ddd; }
            td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
            .total-row td { font-weight: 900; border-top: 3px solid #111; font-size: 14px; }
            .summary { margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px; }
            .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .summary-row.total { border-top: 2px solid #111; padding-top: 12px; margin-top: 8px; }
            .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: 10px; }
          </style>
        </head>
        <body>
          ${el.innerHTML}
          <div class="footer">
            Generated on ${new Date().toLocaleDateString()} • Affilyt Affiliate Platform • For informational purposes only
          </div>
        </body>
      </html>
    `);
        win.document.close();
        win.print();
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Tax Documents</h2>
                    <p className="text-muted-foreground font-medium">Generate annual earnings summaries for tax filing.</p>
                </div>
                <FileText className="h-10 w-10 text-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Config Panel */}
                <div className="space-y-6">
                    {/* Year Selection */}
                    <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Select Year</h3>
                        <div className="flex gap-3">
                            {[currentYear - 2, currentYear - 1, currentYear].map(year => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${selectedYear === year
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "bg-secondary text-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tax Info */}
                    <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-border space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Tax Information</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                    <Hash className="h-3 w-3" /> TIN / Tax ID
                                </label>
                                <Input value={taxInfo.tin} onChange={e => setTaxInfo({ ...taxInfo, tin: e.target.value })} className="h-12 rounded-xl bg-secondary border-none font-bold" placeholder="XXX-XXX-XXX" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                    <Building2 className="h-3 w-3" /> Business / Full Name
                                </label>
                                <Input value={taxInfo.businessName} onChange={e => setTaxInfo({ ...taxInfo, businessName: e.target.value })} className="h-12 rounded-xl bg-secondary border-none font-bold" placeholder={profile?.full_name || "Your Name"} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                    <MapPin className="h-3 w-3" /> Address
                                </label>
                                <Input value={taxInfo.address} onChange={e => setTaxInfo({ ...taxInfo, address: e.target.value })} className="h-12 rounded-xl bg-secondary border-none font-bold" placeholder="123 Main St, Accra" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-8 rounded-[2.5rem] bg-primary/5 border-2 border-primary/20 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Summary</h3>
                        {[
                            { label: "Gross Earnings", value: `$${totalGross.toLocaleString()}` },
                            { label: "Platform Fees", value: `-$${totalFees.toLocaleString()}` },
                            { label: "Net Earnings", value: `$${totalNet.toLocaleString()}`, bold: true },
                            { label: "Total Orders", value: totalOrders.toString() },
                        ].map((s, i) => (
                            <div key={i} className={`flex justify-between items-center ${s.bold ? "pt-2 border-t-2 border-primary/20" : ""}`}>
                                <p className={`text-[10px] font-black uppercase text-muted-foreground`}>{s.label}</p>
                                <p className={`font-black text-foreground ${s.bold ? "text-xl text-primary" : ""}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button onClick={() => setShowPreview(!showPreview)} variant={showPreview ? "secondary" : "default"} className="flex-1 h-14 rounded-2xl font-black text-sm uppercase">
                            {showPreview ? "Hide Preview" : "Preview Document"}
                        </Button>
                        <Button onClick={handlePrint} variant="outline" className="h-14 rounded-2xl font-black text-sm uppercase px-6">
                            <Printer className="h-4 w-4 mr-2" /> Print / PDF
                        </Button>
                    </div>
                </div>

                {/* Document Preview */}
                <div className="lg:col-span-2">
                    <div className={`p-10 rounded-[2.5rem] bg-white text-black border-2 border-border shadow-2xl ${showPreview ? "" : "hidden lg:block"}`}>
                        <div ref={printRef}>
                            <div className="header text-center mb-8 pb-6 border-b-2 border-black">
                                <h1 className="text-2xl font-black uppercase tracking-tighter">Annual Earnings Statement</h1>
                                <p className="text-sm text-gray-500 mt-1">Tax Year {selectedYear} • Affilyt Affiliate Platform</p>
                            </div>

                            <div className="info-grid grid grid-cols-2 gap-6 mb-8">
                                <div className="info-box p-4 rounded-xl border border-gray-200">
                                    <p className="info-label text-[9px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1"><User className="h-3 w-3" /> Affiliate</p>
                                    <p className="info-value text-sm font-bold mt-1">{taxInfo.businessName || profile?.full_name || "—"}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{taxInfo.tin || "TIN not provided"}</p>
                                </div>
                                <div className="info-box p-4 rounded-xl border border-gray-200">
                                    <p className="info-label text-[9px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</p>
                                    <p className="info-value text-sm font-bold mt-1">{taxInfo.address || "—"}</p>
                                </div>
                            </div>

                            {/* Monthly Breakdown Table */}
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left p-3 text-[9px] font-black uppercase tracking-wider text-gray-500 border-b-2 border-gray-200">Month</th>
                                        <th className="text-right p-3 text-[9px] font-black uppercase tracking-wider text-gray-500 border-b-2 border-gray-200">Orders</th>
                                        <th className="text-right p-3 text-[9px] font-black uppercase tracking-wider text-gray-500 border-b-2 border-gray-200">Gross</th>
                                        <th className="text-right p-3 text-[9px] font-black uppercase tracking-wider text-gray-500 border-b-2 border-gray-200">Fees</th>
                                        <th className="text-right p-3 text-[9px] font-black uppercase tracking-wider text-gray-500 border-b-2 border-gray-200">Net</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {annualData.map(m => (
                                        <tr key={m.month} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3 font-bold">{m.month}</td>
                                            <td className="p-3 text-right">{m.orders}</td>
                                            <td className="p-3 text-right">${m.gross.toLocaleString()}</td>
                                            <td className="p-3 text-right text-gray-500">-${m.fees}</td>
                                            <td className="p-3 text-right font-bold">${(m.gross - m.fees).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-t-2 border-black">
                                        <td className="p-3 font-black text-base">TOTAL</td>
                                        <td className="p-3 text-right font-black text-base">{totalOrders}</td>
                                        <td className="p-3 text-right font-black text-base">${totalGross.toLocaleString()}</td>
                                        <td className="p-3 text-right font-black text-base text-gray-500">-${totalFees.toLocaleString()}</td>
                                        <td className="p-3 text-right font-black text-base">${totalNet.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="summary mt-8 p-6 bg-gray-50 rounded-xl">
                                <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-3">Earnings Summary</p>
                                {[
                                    { label: "Gross Commission Earnings", value: `$${totalGross.toLocaleString()}` },
                                    { label: "Platform/Processing Fees", value: `-$${totalFees.toLocaleString()}` },
                                ].map((r, i) => (
                                    <div key={i} className="flex justify-between py-2">
                                        <span className="text-sm text-gray-600">{r.label}</span>
                                        <span className="text-sm font-bold">{r.value}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between py-3 border-t-2 border-black mt-2">
                                    <span className="font-black text-base">Net Earnings ({selectedYear})</span>
                                    <span className="font-black text-base">${totalNet.toLocaleString()}</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-400 mt-6 text-center italic">
                                This document is provided for informational purposes only and does not constitute tax advice.
                                Please consult a qualified tax professional for your specific situation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxDocumentGenerator;
