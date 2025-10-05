import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Droplets, BarChart2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
export function HomePage() {
  const navigate = useNavigate();
  const handleStartGrowing = () => {
    // Mock authentication: redirect to dashboard
    navigate("/dashboard");
  };
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <ThemeToggle className="absolute top-4 right-4 z-50" />
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10"></div>
        <div className="absolute -bottom-1/3 -right-1/4 w-2/3 h-2/3 bg-brand-accent/10 rounded-full blur-3xl animate-float -z-10"></div>
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-brand-green/10 rounded-full blur-3xl animate-float animation-delay-3000 -z-10"></div>
        <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium">
            From Seed to Harvest
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-balance leading-tight">
            Your Ultimate Cannabis Grow Journal
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Plan, track, and optimize your cultivation cycle with an intelligent feeding scheduler and extensive strain database.
          </p>
          <Button
            size="lg"
            onClick={handleStartGrowing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transition-transform hover:scale-105 active:scale-95"
          >
            Start Growing Now
          </Button>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-muted/40">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Everything a Grower Needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cultivar provides the tools and data to help you achieve the best possible results, every time.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border rounded-lg bg-background shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Strain Database</h3>
              <p className="text-muted-foreground">Access detailed information on 50+ popular strains to choose the perfect cultivar for your setup.</p>
            </div>
            <div className="text-center p-8 border rounded-lg bg-background shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nutrient Scheduler</h3>
              <p className="text-muted-foreground">Auto-generate feeding schedules and track your plant's diet with our extensive nutrient library.</p>
            </div>
            <div className="text-center p-8 border rounded-lg bg-background shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Analyze</h3>
              <p className="text-muted-foreground">Log daily activities, upload photos, and visualize your grow data to make informed decisions.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground/80">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
    </main>
  );
}