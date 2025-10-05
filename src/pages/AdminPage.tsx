import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Leaf, Droplets, MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Strain, Nutrient } from "@shared/types";
import { toast } from "sonner";
// NOTE: In a larger application, the admin sections for Strains and Nutrients
// would be broken into their own components with dedicated forms/dialogs.
// For this project, they are combined here for simplicity.
const StrainsAdmin = () => {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const fetchStrains = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api<Strain[]>('/api/strains');
      setStrains(data);
    } catch (error) {
      toast.error("Failed to fetch strains.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchStrains();
  }, [fetchStrains]);
  const handleDelete = async (id: string) => {
    try {
      await api(`/api/strains/${id}`, { method: 'DELETE' });
      toast.success("Strain deleted successfully.");
      setStrains(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      toast.error("Failed to delete strain.");
    } finally {
      setIsDeleting(null);
    }
  };
  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button disabled><PlusCircle className="w-4 h-4 mr-2" /> Add Strain (Not Implemented)</Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Breeder</TableHead>
              <TableHead>Flowering Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strains.map(strain => (
              <TableRow key={strain.id}>
                <TableCell className="font-medium">{strain.name}</TableCell>
                <TableCell>{strain.breeder || 'N/A'}</TableCell>
                <TableCell>{strain.floweringTime} weeks</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsDeleting(strain.id)} className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!isDeleting} onOpenChange={(open) => !open && setIsDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the strain.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => isDeleting && handleDelete(isDeleting)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
const NutrientsAdmin = () => {
    const [nutrients, setNutrients] = useState<Nutrient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const fetchNutrients = useCallback(async () => {
      setIsLoading(true);
      try {
        const data = await api<Nutrient[]>('/api/nutrients');
        setNutrients(data);
      } catch (error) {
        toast.error("Failed to fetch nutrients.");
      } finally {
        setIsLoading(false);
      }
    }, []);
    useEffect(() => {
      fetchNutrients();
    }, [fetchNutrients]);
    const handleDelete = async (id: string) => {
      try {
        await api(`/api/nutrients/${id}`, { method: 'DELETE' });
        toast.success("Nutrient deleted successfully.");
        setNutrients(prev => prev.filter(n => n.id !== id));
      } catch (error) {
        toast.error("Failed to delete nutrient.");
      } finally {
        setIsDeleting(null);
      }
    };
    if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    return (
      <div>
        <div className="flex justify-end mb-4">
          <Button disabled><PlusCircle className="w-4 h-4 mr-2" /> Add Nutrient (Not Implemented)</Button>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>NPK</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutrients.map(nutrient => (
                <TableRow key={nutrient.id}>
                  <TableCell className="font-medium">{nutrient.name}</TableCell>
                  <TableCell>{nutrient.brand}</TableCell>
                  <TableCell>{nutrient.npk}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsDeleting(nutrient.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AlertDialog open={!!isDeleting} onOpenChange={(open) => !open && setIsDeleting(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the nutrient.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => isDeleting && handleDelete(isDeleting)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
};
export function AdminPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Admin Panel" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="strains" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm">
            <TabsTrigger value="strains">
              <Leaf className="w-4 h-4 mr-2" />
              Strains
            </TabsTrigger>
            <TabsTrigger value="nutrients">
              <Droplets className="w-4 h-4 mr-2" />
              Nutrients
            </TabsTrigger>
          </TabsList>
          <TabsContent value="strains" className="mt-4">
            <StrainsAdmin />
          </TabsContent>
          <TabsContent value="nutrients" className="mt-4">
            <NutrientsAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}