import { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Nutrient } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { GripVertical, FlaskConical, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
interface SortableNutrientItemProps {
  nutrient: Nutrient;
  onRemove: (id: string) => void;
}
function SortableNutrientItem({ nutrient, onRemove }: SortableNutrientItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: nutrient.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-2 bg-muted rounded-md touch-none">
      <button {...attributes} {...listeners} className="cursor-grab p-1">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="flex-1">
        <p className="font-medium">{nutrient.name}</p>
        <p className="text-sm text-muted-foreground">{nutrient.brand}</p>
      </div>
      <Badge variant="outline">{nutrient.npk}</Badge>
      <Button variant="ghost" size="icon" onClick={() => onRemove(nutrient.id)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
interface CustomMixBuilderProps {
  allNutrients: Nutrient[];
}
export function CustomMixBuilder({ allNutrients }: CustomMixBuilderProps) {
  const [availableNutrients, setAvailableNutrients] = useState(allNutrients);
  const [selectedNutrients, setSelectedNutrients] = useState<Nutrient[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedNutrients((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const addToMix = (nutrient: Nutrient) => {
    if (!selectedNutrients.find(n => n.id === nutrient.id)) {
      setSelectedNutrients(prev => [...prev, nutrient]);
    }
  };
  const removeFromMix = (id: string) => {
    setSelectedNutrients(prev => prev.filter(n => n.id !== id));
  };
  // Simplified NPK calculation for demonstration
  const calculateTotalNPK = () => {
    return selectedNutrients.reduce((acc, n) => {
      const parts = n.npk.split('-').map(Number);
      if (parts.length === 3) {
        acc[0] += parts[0];
        acc[1] += parts[1];
        acc[2] += parts[2];
      }
      return acc;
    }, [0, 0, 0]).join(' - ');
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Nutrient Library</CardTitle>
          <CardDescription>Click to add to your mix</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {availableNutrients.map(n => (
                <button key={n.id} onClick={() => addToMix(n)} className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors">
                  <p className="font-medium">{n.name}</p>
                  <p className="text-sm text-muted-foreground">{n.brand}</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Your Custom Mix</CardTitle>
          <CardDescription>Drag to reorder, calculate total NPK</CardDescription>
        </CardHeader>
        <CardContent>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={selectedNutrients} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 min-h-[24rem] border rounded-md p-4">
                {selectedNutrients.length > 0 ? (
                  selectedNutrients.map(n => <SortableNutrientItem key={n.id} nutrient={n} onRemove={removeFromMix} />)
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <FlaskConical className="h-12 w-12 mb-4" />
                    <p>Your mix is empty.</p>
                    <p className="text-sm">Add nutrients from the library to get started.</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
          <div className="mt-4 flex justify-between items-center p-4 bg-muted rounded-md">
            <p className="font-semibold text-lg">Total NPK (approx.):</p>
            <p className="font-bold text-lg font-mono">{calculateTotalNPK()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}