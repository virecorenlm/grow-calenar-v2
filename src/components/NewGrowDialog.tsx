import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import type { Strain, Grow } from "@shared/types";
import { toast } from "sonner";
const growFormSchema = z.object({
  name: z.string().min(3, { message: "Grow name must be at least 3 characters." }),
  strainId: z.string().min(1, { message: "Please select a strain." }),
  plantCount: z.coerce.number().min(1, "You must have at least one plant."),
  startDate: z.date({
    invalid_type_error: "A start date is required.",
  }),
});
type GrowFormValues = z.infer<typeof growFormSchema>;
interface NewGrowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newGrow: Grow) => void;
}
export function NewGrowDialog({ isOpen, onClose, onSuccess }: NewGrowDialogProps) {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<GrowFormValues>({
    resolver: zodResolver(growFormSchema),
    defaultValues: {
      name: "",
      strainId: "",
      plantCount: 1,
      startDate: new Date(),
    },
  });
  useEffect(() => {
    if (isOpen) {
      api<Strain[]>('/api/strains')
        .then(setStrains)
        .catch(() => toast.error("Failed to load strains."));
    }
  }, [isOpen]);
  const onSubmit = async (data: GrowFormValues) => {
    setIsSubmitting(true);
    try {
      const newGrowData = {
        ...data,
        startDate: data.startDate.toISOString(),
      };
      const newGrow = await api<Grow>('/api/grows', {
        method: 'POST',
        body: JSON.stringify(newGrowData),
      });
      toast.success("New grow created successfully!");
      onSuccess(newGrow);
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to create grow. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Grow</DialogTitle>
          <DialogDescription>
            Fill in the details below to start tracking your new cultivation cycle.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grow Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer OG Kush Run" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="strainId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Strain</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? strains.find((strain) => strain.id === field.value)?.name
                            : "Select a strain"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search strain..." />
                        <CommandList>
                          <CommandEmpty>No strain found.</CommandEmpty>
                          <CommandGroup>
                            {strains.map((strain) => (
                              <CommandItem
                                value={strain.name}
                                key={strain.id}
                                onSelect={() => {
                                  form.setValue("strainId", strain.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    strain.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {strain.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Plants</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date (from seed/clone)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Grow
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}