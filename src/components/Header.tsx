import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Leaf } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/strains", label: "Strains" },
  { to: "/nutrients", label: "Nutrients" },
  { to: "/guides", label: "Guides" },
  { to: "/admin", label: "Admin" },
];
export function Header({ title }: { title: string; }) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-30">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <NavLink to="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span>Cultivar</span>
              </NavLink>
              {navItems.map((item) =>
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:text-foreground",
                      isActive && "text-foreground"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <h1 className="text-2xl font-display font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <ThemeToggle className="relative" />
      </div>
    </header>
  );
}