import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const BulkImport = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const processCSV = async () => {
        if (!file || !user) return;
        setIsProcessing(true);
        setResults(null);

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const csv = event.target?.result as string;
                const lines = csv.split('\n').filter(line => line.trim().length > 0);

                if (lines.length < 2) throw new Error("CSV must contain a header row and at least one data row.");

                // Minimal parser (assumes columns: title,description,price,commission_rate,category)
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const mappedProducts = lines.slice(1).map(line => {
                    // Simplistic CSV splitting (does not handle quoted commas properly, for demo purposes)
                    const cols = line.split(',');
                    const product: any = { seller_id: user.id, status: 'active', approval_status: 'pending' };

                    headers.forEach((h, i) => {
                        if (h === 'title') product.title = cols[i]?.trim();
                        if (h === 'description') product.description = cols[i]?.trim();
                        if (h === 'price') product.price = parseFloat(cols[i]?.trim() || "0");
                        if (h === 'commission_rate') product.commission_rate = parseFloat(cols[i]?.trim() || "50");
                        if (h === 'category') product.category = cols[i]?.trim();
                    });
                    return product;
                }).filter(p => p.title); // skip rows without titles

                let successCount = 0;
                let errors: string[] = [];

                // Insert batch
                for (let i = 0; i < mappedProducts.length; i++) {
                    const { error } = await supabase.from('products').insert(mappedProducts[i]);
                    if (error) {
                        errors.push(`Row ${i + 2}: ${error.message}`);
                    } else {
                        successCount++;
                    }
                }

                setResults({ success: successCount, errors });
                if (successCount > 0) toast({ title: "Import complete", description: `Successfully imported ${successCount} products.` });
                if (errors.length > 0) toast({ title: "Import finished with errors", variant: "destructive" });

            } catch (err: any) {
                toast({ title: "Parse Error", description: err.message, variant: "destructive" });
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsText(file);
    };

    const downloadSample = () => {
        const csv = "title,description,price,commission_rate,category\nSample Product A,Great product,19.99,50,Software\nSample Product B,Another one,49.99,75,Courses";
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "affiliate_hub_import_template.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-foreground italic uppercase tracking-tight">Bulk Import</h2>
                    <p className="text-muted-foreground font-medium">Upload hundreds of products instantly via CSV.</p>
                </div>
                <UploadCloud className="h-10 w-10 text-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-[2rem] glass space-y-6">
                    <div className="p-6 rounded-2xl glass-subtle border-2 border-dashed border-primary/20 text-center space-y-4">
                        <FileSpreadsheet className="w-12 h-12 text-primary/50 mx-auto" />
                        <div>
                            <p className="font-black">Upload CSV File</p>
                            <p className="text-xs text-muted-foreground">Select a properly formatted .csv file for your catalog.</p>
                        </div>
                        <input
                            type="file"
                            accept=".csv"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="block w-full">
                            <Button asChild variant="outline" className="w-full cursor-pointer h-12 rounded-xl">
                                <span>{file ? file.name : "Select File"}</span>
                            </Button>
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="secondary" className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest" onClick={downloadSample}>
                            Download Template
                        </Button>
                        <Button className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest" onClick={processCSV} disabled={!file || isProcessing}>
                            {isProcessing ? "Processing..." : "Start Import"}
                        </Button>
                    </div>
                </div>

                <div>
                    {results && (
                        <div className="p-8 rounded-[2rem] glass-subtle space-y-4 animate-in slide-in-from-right-4">
                            <h3 className="font-black text-xl flex items-center gap-2">
                                <CheckCircle className="text-success h-5 w-5" /> Import Results
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground">
                                <span className="text-success font-black">{results.success}</span> products successfully imported.
                            </p>

                            {results.errors.length > 0 && (
                                <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2">
                                    <h4 className="text-xs font-black uppercase text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Errors ({results.errors.length})
                                    </h4>
                                    <ul className="text-xs text-destructive/80 space-y-1 max-h-[150px] overflow-y-auto">
                                        {results.errors.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkImport;
