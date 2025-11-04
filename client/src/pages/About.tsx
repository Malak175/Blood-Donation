import { Card } from "@/components/ui/card";
import { Heart, Shield, Users, Target } from "lucide-react";
import teamImage from "@assets/generated_images/Medical_team_about_page_405f6ede.png";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We care deeply about every life we touch and every donor who helps us save lives.",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "We maintain the highest standards of safety and quality in every donation process.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We build strong connections between donors and those whose lives they save.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in service, care, and the impact we make every day.",
    },
  ];

  const milestones = [
    { year: "2000", event: "Founded with a mission to save lives" },
    { year: "2010", event: "Reached 100,000 successful donations" },
    { year: "2020", event: "Expanded to 50+ donation centers" },
    { year: "2025", event: "10,000+ active donors in our community" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${teamImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" data-testid="text-about-title">
            Our Mission
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            Connecting donors with those in need to save lives and build healthier communities.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Story</h2>
          <div className="space-y-6 text-lg text-foreground/90">
            <p>
              BloodLife was founded in 2000 with a simple yet powerful mission: to ensure that no one suffers or dies due to lack of blood. What started as a small community initiative has grown into a comprehensive blood donation network serving thousands of patients every year.
            </p>
            <p className="text-2xl font-semibold text-primary italic border-l-4 border-l-primary pl-6 my-8">
              "Every drop counts. Every donor is a hero. Every life saved is a victory."
            </p>
            <p>
              Our dedicated team of medical professionals, volunteers, and administrators work tirelessly to maintain the highest standards of blood collection, testing, and distribution. We believe in transparency, safety, and the incredible power of human generosity.
            </p>
            <p>
              Today, we serve over 100 hospitals and medical facilities, coordinate thousands of donations annually, and continue to expand our reach to ensure that help is always available when it's needed most.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Our Values</h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            These core principles guide everything we do and every decision we make.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-8 hover-elevate">
                <value.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 pt-4">
                  <Card className="p-6">
                    <p className="text-lg font-medium">{milestone.event}</p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Making an Impact</h2>
          <p className="text-xl opacity-90 mb-12">
            Every donation creates a ripple effect of hope and healing in our community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">3</div>
              <div className="text-lg opacity-90">Lives saved per donation</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-lg opacity-90">Partner hospitals</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Emergency support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
