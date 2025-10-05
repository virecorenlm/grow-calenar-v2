import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import type { Nutrient } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
export function NutrientsPage() {
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    async function fetchNutrients() {
      try {
        setIsLoading(true);
        const nutrientsData = await api<Nutrient[]>('/api/nutrients');
        setNutrients(nutrientsData);
      } catch (error) {
        console.error("Failed to fetch nutrients:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNutrients();
  }, []);
  const filteredNutrients = nutrients.filter(nutrient =>
    nutrient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nutrient.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="flex flex-col h-full">
      <Header title="Nutrient Database" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Input
          placeholder="Search nutrients by name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2 mt-2" /></CardContent></Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNutrients.map(nutrient => (
              <Card key={nutrient.id}>
                <CardHeader>
                  <CardTitle>{nutrient.name}</CardTitle>
                  <CardDescription>{nutrient.brand}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>NPK:</strong> {nutrient.npk}</p>
                  <p><strong>Dosage:</strong> {nutrient.dosage}</p>
                  <div>
                    <Badge variant="outline">{nutrient.stage.charAt(0).toUpperCase() + nutrient.stage.slice(1)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}