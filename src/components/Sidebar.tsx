import { NavLink } from "react-router-dom";
import { Home, Leaf, Droplets, BookOpen, Bot, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMemo } from "react";
const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/strains", icon: Leaf, label: "Strains" },
  { to: "/nutrients", icon: Droplets, label: "Nutrients" },
  { to: "/guides", icon: BookOpen, label: "Guides" },
  { to: "/admin", icon: Bot, label: "Admin" },
];
const growerQuotes = [
  "Patience is a virtue in the grow room.",
  "Listen to your plants; they'll tell you what they need.",
  "The secret ingredient is always love... and Cal-Mag.",
  "A good grower is always learning.",
  "In the garden, every mistake is a lesson.",
];
export function Sidebar() {
  const randomQuote = useMemo(() => growerQuotes[Math.floor(Math.random() * growerQuotes.length)], []);
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-muted/40">
      <div className="flex h-16 items-center border-b px-6">
        <NavLink to="/dashboard" className="flex items-center gap-2 font-display font-semibold text-lg">
          <Leaf className="h-6 w-6 text-primary" />
          <span>Cultivar</span>
        </NavLink>
      </div>
      <nav className="flex-1 py-4 px-4 space-y-1">
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      buttonVariants({ variant: isActive ? "secondary" : "ghost", size: "default" }),
                      "w-full justify-start"
                    )
                  }
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="italic">{randomQuote}</p>
        </div>
      </div>
    </aside>
  );
}