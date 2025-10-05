import type { Log } from '@shared/types';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Images } from 'lucide-react';
interface PhotoGalleryProps {
  logs: Log[];
}
export function PhotoGallery({ logs }: PhotoGalleryProps) {
  const photos = logs
    .filter(log => log.photoUrl)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  if (photos.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center h-96 flex items-center justify-center">
        <div>
          <Images className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Photos Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a photo URL when creating a log to see it here.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photoLog) => (
        <Card key={photoLog.id} className="overflow-hidden group">
          <AspectRatio ratio={1 / 1}>
            <img
              src={photoLog.photoUrl}
              alt={`Grow photo from ${format(new Date(photoLog.date), 'PPP')}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          <div className="p-2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm">
            {format(new Date(photoLog.date), 'MMM d, yyyy')}
          </div>
        </Card>
      ))}
    </div>
  );
}