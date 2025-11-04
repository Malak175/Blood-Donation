import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertDonorSchema, type InsertDonor } from "@shared/schema";
import { Heart } from "lucide-react";

export default function Register() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // نعدل هنا عشان الـ age تكون رقم مش string
  const form = useForm<InsertDonor>({
    resolver: zodResolver(insertDonorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bloodType: "",
      age: 0,
      address: "",
    },
  });

  // ✅ الميوتشن
  const mutation = useMutation({
    mutationFn: async (data: InsertDonor) => {
      return await apiRequest("POST", "/api/donors", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Registration successful!",
        description: "Your application is pending approval. We'll notify you via email.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  // ✅ مهم: نحول age إلى رقم قبل الإرسال
  const onSubmit = (data: InsertDonor) => {
    mutation.mutate({ ...data, age: Number(data.age) });
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="min-h-screen py-16 md:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-12 w-12 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-register-title">
            Become a Blood Donor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community of heroes. Fill out the form below to register as a blood donor.
          </p>
        </div>

        <Card className="p-8">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Thank you for registering!</h3>
              <p className="text-muted-foreground mb-2">
                Your application has been submitted successfully.
              </p>
              <p className="text-muted-foreground mb-6">
                Our team will review your application and notify you via email once approved.
              </p>
              <Button onClick={() => setIsSubmitted(false)} data-testid="button-register-another">
                Register Another Donor
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bloodType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bloodTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="25"
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main Street, City, State ZIP"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Before you donate:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• You must be at least 18 years old and in good health</li>
                    <li>• You should weigh at least 110 pounds</li>
                    <li>• You must not have donated blood in the last 8 weeks</li>
                    <li>• Bring a valid ID on donation day</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Submitting..." : "Submit Registration"}
                </Button>
              </form>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
}
