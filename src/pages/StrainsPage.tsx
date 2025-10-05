import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import type { Strain } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
export function StrainsPage() {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    async function fetchStrains() {
      try {
        setIsLoading(true);
        const strainsData = await api<Strain[]>('/api/strains');
        setStrains(strainsData);
      } catch (error) {
        console.error("Failed to fetch strains:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStrains();
  }, []);
  const filteredStrains = strains.filter(strain =>
    strain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strain.breeder?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getRatioText = (sativaPercentage?: number) => {
    if (sativaPercentage === undefined) return 'Hybrid';
    if (sativaPercentage === 100) return '100% Sativa';
    if (sativaPercentage === 0) return '100% Indica';
    return `${sativaPercentage}% Sativa / ${100 - sativaPercentage}% Indica`;
  };
  return (
    <div className="flex flex-col h-full">
      <Header title="Strain Database" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Input
          placeholder="Search strains by name or breeder..."
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
            {filteredStrains.map(strain => (
              <Card key={strain.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{strain.name}</CardTitle>
                  <CardDescription>{strain.breeder || 'Unknown Breeder'}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-2 text-sm">
                  <p><strong>Flowering Time:</strong> {strain.floweringTime} weeks</p>
                  <p><strong>THC:</strong> {strain.thc || 'N/A'}%</p>
                  <p><strong>Yield:</strong> {strain.yield || 'N/A'}</p>
                  <div>
                    <Badge variant={strain.sativaPercentage && strain.sativaPercentage > 50 ? "default" : "secondary"}>
                      {getRatioText(strain.sativaPercentage)}
                    </Badge>
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