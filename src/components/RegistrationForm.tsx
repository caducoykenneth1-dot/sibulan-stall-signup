import { useState } from "react";
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

const registrationSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(100),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(500),
  businessName: z.string().trim().min(2, "Business name required").max(200),
  businessType: z.string().min(1, "Please select a business type"),
  yearsInBusiness: z.string().min(1, "Required field"),
  stallSize: z.string().min(1, "Please select a stall size"),
  locationPreference: z.string().min(1, "Please select a location preference"),
  additionalInfo: z.string().max(1000).optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const RegistrationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      setIsSubmitted(true);
      toast.success("Registration submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit registration. Please try again.");
    }
  };

  if (isSubmitted) {
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
              Thank you for registering. We'll review your application and contact you within 3-5 business days.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)} 
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
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

            {/* Business Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Business Information</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  {...register("businessName")}
                  className={errors.businessName ? "border-destructive" : ""}
                />
                {errors.businessName && (
                  <p className="text-sm text-destructive">{errors.businessName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select onValueChange={(value) => setValue("businessType", value)}>
                    <SelectTrigger className={errors.businessType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                      <SelectItem value="clothing">Clothing & Apparel</SelectItem>
                      <SelectItem value="produce">Fresh Produce</SelectItem>
                      <SelectItem value="meat">Meat & Seafood</SelectItem>
                      <SelectItem value="household">Household Items</SelectItem>
                      <SelectItem value="handicrafts">Handicrafts & Souvenirs</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.businessType && (
                    <p className="text-sm text-destructive">{errors.businessType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                  <Select onValueChange={(value) => setValue("yearsInBusiness", value)}>
                    <SelectTrigger className={errors.yearsInBusiness ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Business</SelectItem>
                      <SelectItem value="1-2">1-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5+">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.yearsInBusiness && (
                    <p className="text-sm text-destructive">{errors.yearsInBusiness.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stall Preferences */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Store className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">Stall Preferences</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stallSize">Preferred Stall Size *</Label>
                  <Select onValueChange={(value) => setValue("stallSize", value)}>
                    <SelectTrigger className={errors.stallSize ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (2m x 2m)</SelectItem>
                      <SelectItem value="medium">Medium (3m x 3m)</SelectItem>
                      <SelectItem value="large">Large (4m x 4m)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.stallSize && (
                    <p className="text-sm text-destructive">{errors.stallSize.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationPreference">Location Preference *</Label>
                  <Select onValueChange={(value) => setValue("locationPreference", value)}>
                    <SelectTrigger className={errors.locationPreference ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-entrance">Near Main Entrance</SelectItem>
                      <SelectItem value="food-court">Food Court Area</SelectItem>
                      <SelectItem value="produce">Produce Section</SelectItem>
                      <SelectItem value="general">General Area</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.locationPreference && (
                    <p className="text-sm text-destructive">{errors.locationPreference.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  {...register("additionalInfo")}
                  rows={4}
                  placeholder="Any special requirements or additional details..."
                />
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
