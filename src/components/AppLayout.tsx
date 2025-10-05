import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";
export function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <footer className="flex-shrink-0 border-t bg-muted/40 px-4 py-2 text-center text-xs text-muted-foreground">
          <p>
            Disclaimer: This application is for educational and tracking purposes only.
            Consult local laws regarding cannabis cultivation.
          </p>
        </footer>
      </main>
      <Toaster richColors />
    </div>
  );
}