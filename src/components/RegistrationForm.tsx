import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BASE_TYPE_OPTIONS } from "@/data/stalls";
import QRCode from "qrcode";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";

interface FormData {
  vendor: string;
  contact: string;
  type: string;
  monthlyRent: string;
}

interface SubmittedData {
  id?: number;
  vendor: string;
  contact: string;
  type: string;
  monthlyRent: number;
  last_payment?: string;
  next_due?: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    vendor: "",
    contact: "",
    type: "",
    monthlyRent: "",
  });
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generate QR after submit
  useEffect(() => {
    if (submittedData) {
      const generateQrCode = async () => {
        try {
          const dataUrl = await QRCode.toDataURL(JSON.stringify(submittedData));
          setQrCodeDataUrl(dataUrl);
        } catch (err) {
          console.error("Failed to generate QR code", err);
          toast.error("Could not generate QR code.");
        }
      };
      generateQrCode();
    }
  }, [submittedData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "contact") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => ({
        ...prev,
        contact: digitsOnly,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!/^09\d{9}$/.test(formData.contact)) {
      toast.error("Please enter a valid 11-digit contact number starting with 09");
      setLoading(false);
      return;
    }

    try {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      const { data, error } = await supabase
        .from("vendors")
        .insert([
          {
            vendor: formData.vendor,
            contact: formData.contact,
            type: formData.type,
            monthly_rent: Number(formData.monthlyRent || 0),
            last_payment: today.toISOString().split("T")[0],
            next_due: nextMonth.toISOString().split("T")[0],
            status: "current",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSubmittedData({
        id: data.id,
        vendor: data.vendor,
        contact: data.contact,
        type: data.type,
        monthlyRent: Number((data.monthly_rent ?? formData.monthlyRent) || 0),
        last_payment: data.last_payment,
        next_due: data.next_due,
      });
      toast.success("Registration successful!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setQrCodeDataUrl(null);
    setFormData({ vendor: "", contact: "", type: "", monthlyRent: "" });
  };

  const handleDownloadPDF = async () => {
    if (!submittedData || !qrCodeDataUrl) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("SIBULAN MARKET PAY", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Stall Registration Receipt", 105, 28, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Vendor: ${submittedData.vendor}`, 20, 50);
    doc.text(`Contact: ${submittedData.contact}`, 20, 60);
    doc.text(`Stall Type: ${submittedData.type}`, 20, 70);
    doc.text(`Monthly Rent: ₱${submittedData.monthlyRent}`, 20, 80);
    doc.text(`Date Registered: ${new Date().toLocaleDateString()}`, 20, 90);
    doc.text(`Next Due: ${submittedData.next_due || "N/A"}`, 20, 100);

    doc.text("QR Code:", 20, 115);
    doc.addImage(qrCodeDataUrl, "PNG", 20, 120, 50, 50);

    doc.setFontSize(10);
    doc.text(
      "Thank you for registering with Sibulan Market Pay!",
      105,
      180,
      { align: "center" }
    );

    doc.save(`stall-receipt-${submittedData.vendor}.pdf`);
  };

  // ------------- SUCCESS SCREEN -------------
  if (submittedData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-primary/10 via-secondary/30 to-background p-6">
        <Card className="max-w-md w-full text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-2 text-green-600">
              Registration Successful!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm mb-4">
              Thank you for registering. Please present this QR code for verification.
            </p>

            <div className="p-4 bg-white rounded-lg border inline-block mb-4">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
              ) : (
                <p>Generating QR code...</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleDownloadPDF} className="w-full">
                Download Receipt (PDF)
              </Button>
              <Button variant="outline" onClick={handleReset} className="w-full">
                Register Another Stall
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ------------- REGISTRATION FORM -------------
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-primary/10 via-secondary/30 to-background p-6">
      <div className="flex flex-col items-center gap-6">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F91a6ef17b9d24a3a990b22eddcf74bd4%2Fdfdf48c4de854c4daf984ec5ed9b2757?format=webp&width=800"
          alt="Municipality of Sibulan seal"
          className="w-28 sm:w-32 md:w-36"
        />
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Stall Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="vendor">Vendor Name</Label>
              <Input
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                pattern="\d{11}"
                value={formData.contact}
                onChange={handleChange}
                placeholder="09xxxxxxxxx"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Stall Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border border-input rounded-md p-2 text-sm bg-background"
              >
                <option value="">Select type</option>
                {BASE_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="monthlyRent">Monthly Rent (PHP)</Label>
              <Input
                id="monthlyRent"
                name="monthlyRent"
                type="number"
                min={0}
                value={formData.monthlyRent}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Registration"}
            </Button>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
