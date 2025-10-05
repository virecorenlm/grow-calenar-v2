import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import type { Nutrient, Grow } from "@shared/types";
import { toast } from "sonner";
const logFormSchema = z.object({
  date: z.date({ invalid_type_error: "A date is required." }),
  ph: z.coerce.number().optional(),
  ec: z.coerce.number().optional(),
  notes: z.string().optional(),
  photoUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  nutrientsUsed: z.array(z.object({
    nutrientId: z.string().min(1, "Please select a nutrient."),
    amount: z.coerce.number().min(0, "Amount must be positive."),
    unit: z.enum(['ml', 'tsp']),
  })).optional(),
});
type LogFormValues = z.infer<typeof logFormSchema>;
interface NewLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedGrow: Grow) => void;
  growId: string;
}
export function NewLogDialog({ isOpen, onClose, onSuccess, growId }: NewLogDialogProps) {
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LogFormValues>({
    resolver: zodResolver(logFormSchema),
    defaultValues: {
      date: new Date(),
      nutrientsUsed: [],
      notes: "",
      photoUrl: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "nutrientsUsed",
  });
  useEffect(() => {
    if (isOpen) {
      api<Nutrient[]>('/api/nutrients')
        .then(setNutrients)
        .catch(() => toast.error("Failed to load nutrients."));
    }
  }, [isOpen]);
  const onSubmit = async (data: LogFormValues) => {
    setIsSubmitting(true);
    try {
      const newLogData = {
        ...data,
        date: data.date.toISOString(),
      };
      const updatedGrow = await api<Grow>(`/api/grows/${growId}/logs`, {
        method: 'POST',
        body: JSON.stringify(newLogData),
      });
      toast.success("Log added successfully!");
      onSuccess(updatedGrow);
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to add log. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Log Entry</DialogTitle>
          <DialogDescription>Record your observations and feedings for this grow.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <FormField control={form.control} name="date" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="ph" render={({ field }) => (<FormItem><FormLabel>pH</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g., 6.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="ec" render={({ field }) => (<FormItem><FormLabel>EC / PPM</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g., 1.2" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="photoUrl" render={({ field }) => (<FormItem><FormLabel>Photo URL (Optional)</FormLabel><FormControl><Input placeholder="https://example.com/plant.jpg" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea placeholder="Any observations? e.g., 'Slight yellowing on lower leaves.'" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <div>
              <FormLabel>Nutrients Used</FormLabel>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                    <FormField control={form.control} name={`nutrientsUsed.${index}.nutrientId`} render={({ field }) => (
                      <FormItem className="flex-1"><FormLabel className="text-xs">Nutrient</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a nutrient" /></SelectTrigger></FormControl><SelectContent position="popper"><SelectItem value="null" disabled>Select a nutrient</SelectItem>{nutrients.map(n => <SelectItem key={n.id} value={n.id}>{n.brand} - {n.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`nutrientsUsed.${index}.amount`} render={({ field }) => (
                      <FormItem className="w-24"><FormLabel className="text-xs">Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`nutrientsUsed.${index}.unit`} render={({ field }) => (
                      <FormItem className="w-24"><FormLabel className="text-xs">Unit</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger></FormControl><SelectContent><SelectItem value="ml">ml</SelectItem><SelectItem value="tsp">tsp</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ nutrientId: '', amount: 0, unit: 'ml' })}><PlusCircle className="mr-2 h-4 w-4" />Add Nutrient</Button>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Log
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}