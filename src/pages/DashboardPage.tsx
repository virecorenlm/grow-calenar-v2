import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Leaf } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Grow, Strain } from "@shared/types";
import { differenceInDays, differenceInWeeks } from "date-fns";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { NewGrowDialog } from "@/components/NewGrowDialog";
export function DashboardPage() {
  const [grows, setGrows] = useState<Grow[]>([]);
  const [strains, setStrains] = useState<Record<string, Strain>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNewGrowDialogOpen, setIsNewGrowDialogOpen] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [growsData, strainsData] = await Promise.all([
        api<Grow[]>('/api/grows'),
        api<Strain[]>('/api/strains')
      ]);
      setGrows(growsData);
      const strainsMap = strainsData.reduce((acc, strain) => {
        acc[strain.id] = strain;
        return acc;
      }, {} as Record<string, Strain>);
      setStrains(strainsMap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleNewGrowSuccess = (newGrow: Grow) => {
    setGrows(prevGrows => [...prevGrows, newGrow]);
    // Optionally, you could refetch all data:
    // fetchData();
  };
  const getGrowProgress = (grow: Grow) => {
    const strain = strains[grow.strainId];
    if (!strain) return { progressValue: 0, progressText: "Unknown Strain" };
    const totalWeeks = strain.floweringTime + 4; // Assuming 4 weeks veg
    const weeksElapsed = differenceInWeeks(new Date(), new Date(grow.startDate));
    const progressValue = Math.min(100, (weeksElapsed / totalWeeks) * 100);
    const progressText = `Week ${weeksElapsed + 1} of ${totalWeeks}`;
    return { progressValue, progressText };
  };
  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Dashboard" />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Your Grows</h2>
            <Button onClick={() => setIsNewGrowDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Grow
            </Button>
          </div>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : grows.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Leaf className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Grows Yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first grow.</p>
              <Button className="mt-6" onClick={() => setIsNewGrowDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> New Grow
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {grows.map((grow) => {
                const strain = strains[grow.strainId];
                const { progressValue, progressText } = getGrowProgress(grow);
                return (
                  <Card key={grow.id} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <CardHeader>
                      <CardTitle>{grow.name}</CardTitle>
                      <CardDescription>{strain?.name || 'Unknown Strain'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Progress value={progressValue} />
                        <p className="text-sm text-muted-foreground">{progressText}</p>
                        <p className="text-sm text-muted-foreground">
                          Started {differenceInDays(new Date(), new Date(grow.startDate))} days ago
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/grows/${grow.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <NewGrowDialog
        isOpen={isNewGrowDialogOpen}
        onClose={() => setIsNewGrowDialogOpen(false)}
        onSuccess={handleNewGrowSuccess}
      />
    </>
  );
}