import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
export function GuidesPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Growing Guides" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <CardTitle>Content Coming Soon!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We're cultivating a library of expert growing guides. Check back soon for tips on everything from germination to curing.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}