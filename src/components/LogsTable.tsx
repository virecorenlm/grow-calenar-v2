import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Log, Nutrient } from "@shared/types";
import { format } from "date-fns";
interface LogsTableProps {
  logs: Log[];
  nutrients: Nutrient[];
}
export function LogsTable({ logs, nutrients }: LogsTableProps) {
  const nutrientMap = new Map(nutrients.map(n => [n.id, n]));
  if (logs.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <h3 className="text-lg font-semibold">No Logs Yet</h3>
        <p className="text-muted-foreground">Add your first log to start tracking your grow's progress.</p>
      </div>
    );
  }
  // Sort logs by date, most recent first
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="text-center">pH</TableHead>
            <TableHead className="text-center">EC/PPM</TableHead>
            <TableHead>Nutrients Used</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{format(new Date(log.date), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-center">{log.ph ?? 'N/A'}</TableCell>
              <TableCell className="text-center">{log.ec ?? 'N/A'}</TableCell>
              <TableCell>
                {log.nutrientsUsed && log.nutrientsUsed.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {log.nutrientsUsed.map((nu, index) => {
                      const nutrient = nutrientMap.get(nu.nutrientId);
                      return (
                        <Badge key={index} variant="secondary">
                          {nutrient?.name ?? 'Unknown'}: {nu.amount}{nu.unit}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell className="max-w-xs truncate">{log.notes ?? <span className="text-muted-foreground">No notes</span>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}