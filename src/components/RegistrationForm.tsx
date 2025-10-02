import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Store, User, Building2, CheckCircle2 } from "lucide-react";
import { BASE_TYPE_OPTIONS } from "@/data/stalls";
import QRCode from "qrcode";

const registrationSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(100),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(100),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(500),
  stallName: z.string().trim().min(2, "Stall name required").max(200),
  stallType: z.string().min(1, "Please select a stall type"),
  monthlyRent: z.coerce.number().positive("Rent must be a positive number."),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;
type SubmittedData = RegistrationFormData & { registrationId: string };

export const RegistrationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

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

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const submissionData = {
        ...data,
        registrationId: `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      console.log("Form submitted:", submissionData);
      setSubmittedData(submissionData);
      setIsSubmitted(true);
      toast.success("Registration submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit registration. Please try again.");
    }
  };

  const handleAnotherRegistration = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    setQrCodeDataUrl(null);
    reset();
  };

  if (isSubmitted && submittedData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[image:var(--gradient-bg)]">
        <Card className="w-full max-w-2xl shadow-2xl border-2">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">Registration Submitted!</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Thank you for registering. Please present this QR code for verification.
            </p>
            <div className="mb-8 flex justify-center">
              <div className="p-4 bg-white rounded-lg border">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="QR Code" />
                ) : (
                  <p>Generating QR code...</p>
                )}
              </div>
            </div>
            <Button 
              onClick={handleAnotherRegistration} 
              className="bg-[image:var(--gradient-primary)] hover:opacity-90 transition-opacity"
            >
              Submit Another Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[image:var(--gradient-bg)]">
      <Card className="w-full max-w-4xl shadow-2xl border-2">
        <CardHeader className="space-y-2 pb-8 border-b bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-[image:var(--gradient-primary)]">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Sibulan Market Stall Rental</CardTitle>
              <CardDescription className="text-base mt-1">Registration Form</CardDescription>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Please fill out all required fields to register for a market stall rental.
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+63 XXX XXX XXXX"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  {...register("address")}
                  rows={3}
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>
            </div>

            {/* Stall Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Stall Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stallName">Stall Name *</Label>
                  <Input
                    id="stallName"
                    {...register("stallName")}
                    className={errors.stallName ? "border-destructive" : ""}
                  />
                  {errors.stallName && (
                    <p className="text-sm text-destructive">{errors.stallName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stallType">Stall Type *</Label>
                  <Select onValueChange={(value) => setValue("stallType", value)}>
                    <SelectTrigger className={errors.stallType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BASE_TYPE_OPTIONS.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.stallType && (
                    <p className="text-sm text-destructive">{errors.stallType.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent (PHP) *</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  {...register("monthlyRent")}
                  className={errors.monthlyRent ? "border-destructive" : ""}
                />
                {errors.monthlyRent && (
                  <p className="text-sm text-destructive">{errors.monthlyRent.message}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-[image:var(--gradient-primary)] hover:opacity-90 transition-opacity text-lg py-6 px-8"
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
