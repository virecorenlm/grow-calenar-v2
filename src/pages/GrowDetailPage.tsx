import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Images, BarChart2, Loader2, PlusCircle, Download, FlaskConical } from "lucide-react";
import { api } from "@/lib/api-client";
import type { Grow, Strain, Nutrient } from "@shared/types";
import { generateSchedule, GeneratedSchedule } from "@/lib/schedule-generator";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NewLogDialog } from "@/components/NewLogDialog";
import { LogsTable } from "@/components/LogsTable";
import { GrowCharts } from "@/components/GrowCharts";
import { generatePdfReport } from "@/lib/pdf-generator";
import { PhotoGallery } from "@/components/PhotoGallery";
import { CustomMixBuilder } from "@/components/CustomMixBuilder";
export function GrowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [grow, setGrow] = useState<Grow | null>(null);
  const [strain, setStrain] = useState<Strain | null>(null);
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const logsTableRef = useRef<HTMLDivElement>(null);
  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const [growData, strainsData, nutrientsData] = await Promise.all([
        api<Grow>(`/api/grows/${id}`),
        api<Strain[]>('/api/strains'),
        api<Nutrient[]>('/api/nutrients'),
      ]);
      const currentStrain = strainsData.find(s => s.id === growData.strainId) || null;
      setGrow(growData);
      setStrain(currentStrain);
      setNutrients(nutrientsData);
    } catch (error) {
      console.error("Failed to fetch grow details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleNewLogSuccess = (updatedGrow: Grow) => {
    setGrow(updatedGrow);
  };
  const handleDownloadPdf = () => {
    if (grow && strain && logsTableRef.current) {
      generatePdfReport('logs-table-container', grow.name, strain.name);
    }
  };
  const schedule = useMemo<GeneratedSchedule | null>(() => {
    if (!grow || !strain || nutrients.length === 0) return null;
    return generateSchedule(strain, nutrients, new Date(grow.startDate));
  }, [grow, strain, nutrients]);
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Loading Grow..." />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  if (!grow || !strain) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Grow Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <p>The grow you are looking for could not be found.</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col h-full">
        <Header title={grow.name} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Tabs defaultValue="calendar" className="w-full">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <TabsList className="grid w-full max-w-lg grid-cols-5">
                <TabsTrigger value="calendar"><Calendar className="w-4 h-4 mr-2"/>Calendar</TabsTrigger>
                <TabsTrigger value="logs"><FileText className="w-4 h-4 mr-2"/>Logs</TabsTrigger>
                <TabsTrigger value="photos"><Images className="w-4 h-4 mr-2"/>Photos</TabsTrigger>
                <TabsTrigger value="reports"><BarChart2 className="w-4 h-4 mr-2"/>Reports</TabsTrigger>
                <TabsTrigger value="mixer"><FlaskConical className="w-4 h-4 mr-2"/>Mixer</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button onClick={handleDownloadPdf} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button onClick={() => setIsLogDialogOpen(true)}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Log
                </Button>
              </div>
            </div>
            <TabsContent value="calendar" className="mt-4">
              {schedule ? (
                <ScheduleCalendar schedule={schedule} startDate={new Date(grow.startDate)} />
              ) : (
                <div className="border rounded-lg p-8 text-center flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  <p className="ml-4">Generating schedule...</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="logs" className="mt-4">
              <div id="logs-table-container" ref={logsTableRef}>
                <LogsTable logs={grow.logs} nutrients={nutrients} />
              </div>
            </TabsContent>
            <TabsContent value="photos" className="mt-4">
              <PhotoGallery logs={grow.logs} />
            </TabsContent>
            <TabsContent value="reports" className="mt-4 space-y-6">
              <GrowCharts logs={grow.logs} />
            </TabsContent>
            <TabsContent value="mixer" className="mt-4">
                <CustomMixBuilder allNutrients={nutrients} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {id && (
        <NewLogDialog
          isOpen={isLogDialogOpen}
          onClose={() => setIsLogDialogOpen(false)}
          onSuccess={handleNewLogSuccess}
          growId={id}
        />
      )}
    </>
  );
}