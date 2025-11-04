import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Droplet, Users, Heart, Calendar } from "lucide-react";
import heroImage from "@assets/generated_images/Blood_donation_hero_image_7d9b0d01.png";

export default function Home() {
  const stats = [
    { icon: Droplet, label: "Lives Saved", value: "10,000+", color: "text-primary" },
    { icon: Users, label: "Active Donors", value: "5,000+", color: "text-chart-3" },
    { icon: Heart, label: "Donations This Year", value: "15,000+", color: "text-chart-2" },
    { icon: Calendar, label: "Years of Service", value: "25+", color: "text-chart-4" },
  ];

  const bloodTypes = [
    { type: "A+", urgency: "high" },
    { type: "O-", urgency: "critical" },
    { type: "B+", urgency: "moderate" },
    { type: "AB+", urgency: "low" },
    { type: "O+", urgency: "high" },
    { type: "A-", urgency: "moderate" },
  ];

  const steps = [
    {
      number: "1",
      title: "Register",
      description: "Fill out our simple donor registration form with your information.",
    },
    {
      number: "2",
      title: "Get Approved",
      description: "Our team reviews your application to ensure you meet donation criteria.",
    },
    {
      number: "3",
      title: "Save Lives",
      description: "Schedule your donation and help save lives in your community.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6" data-testid="text-hero-title">
            Give the Gift of Life
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Your blood donation can save up to three lives. Join our community of heroes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                variant="default"
                className="text-lg px-8 backdrop-blur-md bg-primary hover:bg-primary/90"
                data-testid="button-donate-now"
              >
                Become a Donor
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 backdrop-blur-md bg-white/10 border-white/30 text-white hover:bg-white/20"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-8 text-center hover-elevate">
                <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-4xl md:text-5xl font-bold mb-2" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Becoming a blood donor is easy. Follow these simple steps to start saving lives.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-8 relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-border"></div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Blood Needs Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Urgent Blood Needs</h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            These blood types are critically needed. If you match, please consider donating.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bloodTypes.map((blood, index) => (
              <Card
                key={index}
                className={`p-6 text-center hover-elevate ${
                  blood.urgency === "critical"
                    ? "border-l-4 border-l-destructive"
                    : blood.urgency === "high"
                    ? "border-l-4 border-l-primary"
                    : ""
                }`}
              >
                <div className="text-3xl font-bold mb-2">{blood.type}</div>
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    blood.urgency === "critical"
                      ? "text-destructive"
                      : blood.urgency === "high"
                      ? "text-primary"
                      : blood.urgency === "moderate"
                      ? "text-chart-4"
                      : "text-muted-foreground"
                  }`}
                >
                  {blood.urgency}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of donors who are saving lives every day. Your donation matters.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8"
              data-testid="button-register-cta"
            >
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
