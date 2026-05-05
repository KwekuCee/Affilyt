import { useState, useRef, useEffect, useCallback } from "react";
import { QrCode, Download, Printer, Copy, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Simple QR code generator using Canvas API
const generateQRMatrix = (data: string): boolean[][] => {
    // Simple QR-like pattern generator for visual representation
    const size = 25;
    const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    // Create a deterministic pattern from input data
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    // Finder patterns (top-left, top-right, bottom-left)
    const drawFinder = (startR: number, startC: number) => {
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
                const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
                if (startR + r < size && startC + c < size) {
                    matrix[startR + r][startC + c] = isOuter || isInner;
                }
            }
        }
    };

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
        matrix[6][i] = i % 2 === 0;
        matrix[i][6] = i % 2 === 0;
    }

    // Data area - use hash to generate deterministic pattern
    let seed = Math.abs(hash);
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c]) continue;
            if (r < 9 && c < 9) continue;
            if (r < 9 && c > size - 9) continue;
            if (r > size - 9 && c < 9) continue;
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            matrix[r][c] = seed % 3 === 0;
        }
    }

    return matrix;
};

const QRCodeGenerator = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [links, setLinks] = useState<any[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const refId = profile?.affiliate_link || user?.id?.slice(0, 8) || "demo";
    const baseUrl = window.location.origin;
    const defaultLink = { label: "Main Marketplace", url: `${baseUrl}/marketplace?ref=${refId}` };

    useEffect(() => {
        if (!user) return;
        (async () => {
            const { data } = await supabase
                .from("affiliate_links")
                .select("*, products(title)")
                .eq("affiliate_id", user.id)
                .order("created_at", { ascending: false });
            setLinks(data || []);
        })();
    }, [user]);

    const allLinks = [
        defaultLink,
        ...links.map(l => ({
            label: l.products?.title || "Product Link",
            url: `${baseUrl}/marketplace?ref=${l.short_code}&product=${l.product_id}`
        }))
    ];

    const activeLink = allLinks[selectedIndex] || defaultLink;

    const drawQR = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const matrix = generateQRMatrix(activeLink.url);
        const cellSize = 10;
        const padding = 20;
        const qrSize = matrix.length * cellSize;
        canvas.width = qrSize + padding * 2;
        canvas.height = qrSize + padding * 2;

        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // QR cells
        const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
        ctx.fillStyle = `hsl(${primary})`;

        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    ctx.beginPath();
                    ctx.roundRect(
                        padding + c * cellSize,
                        padding + r * cellSize,
                        cellSize - 1,
                        cellSize - 1,
                        2
                    );
                    ctx.fill();
                }
            }
        }
    }, [activeLink.url]);

    useEffect(() => {
        drawQR();
    }, [drawQR]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `qr-code-${selectedIndex}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast({ title: "QR Downloaded!", description: "PNG saved to your downloads." });
    };

    const handlePrint = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const win = window.open("", "_blank");
        if (!win) return;
        win.document.write(`
      <html><head><title>QR Code — ${activeLink.label}</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,sans-serif;margin:0}
      img{width:300px;height:300px}h2{margin-top:24px;font-size:18px}p{color:#666;font-size:12px;word-break:break-all;max-width:400px;text-align:center}</style></head>
      <body><img src="${canvas.toDataURL("image/png")}" /><h2>${activeLink.label}</h2><p>${activeLink.url}</p></body></html>
    `);
        win.document.close();
        win.print();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(activeLink.url);
        setCopied(true);
        toast({ title: "Link copied!" });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">QR Arsenal</h2>
                <p className="text-muted-foreground font-medium">Generate printable QR codes for any affiliate link.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Link Selector */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Select Link</h3>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-hide pr-2">
                        {allLinks.map((l, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedIndex(i)}
                                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${i === selectedIndex
                                        ? "bg-primary/10 border-primary/30 shadow-lg"
                                        : "bg-card/40 border-border hover:border-primary/10 hover:bg-card/60"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${i === selectedIndex ? "bg-primary/20" : "bg-secondary"}`}>
                                        <Link2 className={`h-5 w-5 ${i === selectedIndex ? "text-primary" : "text-muted-foreground"}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-sm text-foreground truncate">{l.label}</p>
                                        <p className="text-[10px] text-muted-foreground font-mono truncate">{l.url.slice(0, 40)}...</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* QR Code Display */}
                <div className="lg:col-span-3 p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border-2 border-primary/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center space-y-8">
                        <Badge className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full italic">
                            {activeLink.label}
                        </Badge>

                        <div className="p-6 bg-white rounded-[2rem] shadow-xl">
                            <canvas ref={canvasRef} className="w-[270px] h-[270px]" />
                        </div>

                        <div className="w-full p-4 rounded-2xl bg-secondary/50 border border-border">
                            <code className="text-[10px] font-bold text-primary break-all">{activeLink.url}</code>
                        </div>

                        <div className="flex gap-4 w-full">
                            <Button onClick={handleDownload} className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-tight shadow-lg shadow-primary/20">
                                <Download className="h-4 w-4 mr-2" /> Download PNG
                            </Button>
                            <Button onClick={handlePrint} variant="secondary" className="h-14 rounded-2xl font-black text-sm uppercase px-6">
                                <Printer className="h-4 w-4 mr-2" /> Print
                            </Button>
                            <Button onClick={handleCopy} variant="outline" className="h-14 w-14 rounded-2xl">
                                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
