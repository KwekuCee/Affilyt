import { useState, useRef, useEffect, useCallback } from "react";
import { QrCode, Download, Printer, Copy, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const affiliateLinksData = [
    { id: "l1", product: "Digital Marketing Mastery", shortCode: "abc123" },
    { id: "l2", product: "Premium Fitness Tracker", shortCode: "fit456" },
    { id: "l3", product: "E-Book Bundle: 50 Titles", shortCode: "book789" },
    { id: "l4", product: "Wireless Headphones Pro", shortCode: "head101" },
    { id: "l5", product: "Online Cooking Academy", shortCode: "cook55" },
];

const QR_SIZE = 200;

// Simple QR-like pattern generator (visual placeholder)
const drawQR = (ctx: CanvasRenderingContext2D, text: string, size: number, fg: string, bg: string) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
    const modules = 25;
    const cellSize = size / modules;
    ctx.fillStyle = fg;
    // Simple hash-based deterministic pattern
    let hash = 0;
    for (let i = 0; i < text.length; i++) { hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0; }
    for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
            const isBorder = r < 2 || c < 2 || r >= modules - 2 || c >= modules - 2;
            const isCorner = (r < 7 && c < 7) || (r < 7 && c >= modules - 7) || (r >= modules - 7 && c < 7);
            const seed = (hash + r * 31 + c * 17) & 0xFFFF;
            if (isCorner || (isBorder && (r + c) % 2 === 0) || seed % 3 === 0) {
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
    }
    // Draw finder patterns
    const drawFinder = (x: number, y: number) => {
        ctx.fillStyle = fg;
        ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
        ctx.fillStyle = bg;
        ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
        ctx.fillStyle = fg;
        ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
    };
    drawFinder(0, 0);
    drawFinder((modules - 7) * cellSize, 0);
    drawFinder(0, (modules - 7) * cellSize);
};

const QRCodeGenerator = () => {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedLink, setSelectedLink] = useState(affiliateLinksData[0]);
    const [fgColor, setFgColor] = useState("#16a34a");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [copied, setCopied] = useState(false);

    const refId = profile?.affiliate_link || user?.id?.slice(0, 8) || "demo";
    const fullUrl = `${window.location.origin}/marketplace?ref=${refId}&p=${selectedLink.shortCode}`;

    const renderQR = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = QR_SIZE;
        canvas.height = QR_SIZE;
        drawQR(ctx, fullUrl, QR_SIZE, fgColor, bgColor);
    }, [fullUrl, fgColor, bgColor]);

    useEffect(() => { renderQR(); }, [renderQR]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `qr-${selectedLink.shortCode}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast({ title: "Downloaded!", description: "QR code saved as PNG." });
    };

    const handlePrint = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const win = window.open("", "_blank");
        if (!win) return;
        win.document.write(`
      <html><head><title>QR Code</title><style>
        body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Inter, sans-serif; }
        img { width: 300px; height: 300px; image-rendering: pixelated; }
        p { margin-top: 16px; font-size: 12px; color: #666; word-break: break-all; max-width: 300px; text-align: center; }
      </style></head><body>
        <img src="${canvas.toDataURL()}" />
        <p>${fullUrl}</p>
      </body></html>
    `);
        win.document.close();
        win.print();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        toast({ title: "Link Copied!", description: selectedLink.product });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">QR Code Generator</h2>
                <p className="text-sm text-muted-foreground mt-1">Generate printable QR codes for your affiliate links.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left — QR Preview */}
                <div className="p-5 sm:p-8 rounded-2xl glass flex flex-col items-center space-y-6">
                    <div className="p-4 bg-white rounded-2xl shadow-lg">
                        <canvas ref={canvasRef} className="w-[200px] h-[200px]" style={{ imageRendering: "pixelated" }} />
                    </div>

                    <p className="text-xs font-mono text-muted-foreground text-center break-all max-w-xs">{fullUrl}</p>

                    <div className="flex flex-wrap gap-3 justify-center">
                        <Button onClick={handleDownload} className="h-10 rounded-xl font-semibold text-sm px-5">
                            <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                        <Button onClick={handlePrint} variant="outline" className="h-10 rounded-xl font-semibold text-sm px-5">
                            <Printer className="h-4 w-4 mr-2" /> Print
                        </Button>
                        <Button onClick={handleCopy} variant="outline" className="h-10 rounded-xl font-semibold text-sm px-5">
                            {copied ? <><Check className="h-4 w-4 mr-2" /> Copied</> : <><Copy className="h-4 w-4 mr-2" /> Copy URL</>}
                        </Button>
                    </div>
                </div>

                {/* Right — Settings */}
                <div className="space-y-5">
                    {/* Link Selector */}
                    <div className="p-5 sm:p-6 rounded-2xl glass space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Select Link</h3>
                        <div className="space-y-2">
                            {affiliateLinksData.map(link => (
                                <button
                                    key={link.id}
                                    onClick={() => setSelectedLink(link)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${selectedLink.id === link.id
                                        ? "bg-primary/10 border-primary/30"
                                        : "bg-secondary/30 border-transparent hover:border-border"
                                        }`}
                                >
                                    <Link2 className="h-4 w-4 text-primary shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate">{link.product}</p>
                                        <p className="text-xs text-muted-foreground font-mono">/{link.shortCode}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Customization */}
                    <div className="p-5 sm:p-6 rounded-2xl glass space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Colors</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Foreground</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer" />
                                    <span className="text-xs font-mono text-muted-foreground">{fgColor}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Background</label>
                                <div className="flex items-center gap-2">
                                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer" />
                                    <span className="text-xs font-mono text-muted-foreground">{bgColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Tips</h3>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                            <li>• High contrast colors scan better</li>
                            <li>• Dark foreground on light background is recommended</li>
                            <li>• Test scanning before printing</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeGenerator;
