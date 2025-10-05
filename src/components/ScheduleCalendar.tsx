import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, addWeeks, startOfWeek } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GeneratedSchedule, ScheduleWeek } from "@/lib/schedule-generator";
interface ScheduleCalendarProps {
  schedule: GeneratedSchedule;
  startDate: Date;
}
export function ScheduleCalendar({ schedule, startDate }: ScheduleCalendarProps) {
  const vegWeeks = schedule.weeks.filter(w => w.stage === 'Vegetative').length;
  const flowerWeeks = schedule.weeks.length - vegWeeks;
  const modifiers = {
    vegetative: (date: Date) => {
      const startOfVeg = startOfWeek(startDate);
      const endOfVeg = addDays(addWeeks(startOfVeg, vegWeeks), -1);
      return date >= startOfVeg && date <= endOfVeg;
    },
    flowering: (date: Date) => {
      const startOfFlower = addWeeks(startOfWeek(startDate), vegWeeks);
      const endOfFlower = addDays(addWeeks(startOfFlower, flowerWeeks), -1);
      return date >= startOfFlower && date <= endOfFlower;
    },
  };
  const modifiersStyles = {
    vegetative: {
      backgroundColor: '#22c55e', // --green-500 from theme
      color: 'white',
    },
    flowering: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
    },
  };
  const renderWeekCard = (week: ScheduleWeek) => (
    <Card key={week.week} className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Week {week.week}</span>
          <Badge variant={week.stage === 'Vegetative' ? 'default' : 'secondary'}>{week.stage}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2">Nutrient Plan:</h4>
        {week.nutrients.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {week.nutrients.map((n, index) => (
              <li key={index}>
                <strong>{n.name}</strong> ({n.brand}): {n.dosage}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Plain water or flush.</p>
        )}
      </CardContent>
    </Card>
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <DayPicker
          mode="range"
          defaultMonth={startDate}
          selected={{ from: startDate, to: addDays(addWeeks(startDate, schedule.totalWeeks), -1) }}
          numberOfMonths={3}
          showOutsideDays
          fixedWeeks
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="p-4 border rounded-lg bg-card"
          classNames={{
            caption_label: "font-display",
            head_cell: "text-muted-foreground",
          }}
        />
      </div>
      <div className="max-h-[600px] overflow-y-auto pr-2">
        <h3 className="text-xl font-display font-semibold mb-4">Weekly Schedule</h3>
        {schedule.weeks.map(renderWeekCard)}
      </div>
    </div>
  );
}