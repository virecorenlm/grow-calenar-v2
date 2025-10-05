import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { Log } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
interface GrowChartsProps {
  logs: Log[];
}
export function GrowCharts({ logs }: GrowChartsProps) {
  const chartData = useMemo(() => {
    return logs
      .filter(log => log.ph || log.ec)
      .map(log => ({
        date: new Date(log.date),
        ph: log.ph,
        ec: log.ec,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(log => ({
        ...log,
        name: format(log.date, 'MMM d'),
      }));
  }, [logs]);
  if (chartData.length < 2) {
    return (
      <div className="border rounded-lg p-8 text-center h-96 flex items-center justify-center">
        <div>
          <h3 className="text-lg font-semibold">Not Enough Data to Display Charts</h3>
          <p className="text-muted-foreground">Add at least two logs with pH or EC values to see trends.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>pH Trend</CardTitle>
          <CardDescription>pH level over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[5, 8]} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="ph" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>EC / PPM Trend</CardTitle>
          <CardDescription>Electrical conductivity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="ec" stroke="hsl(var(--accent-foreground))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}