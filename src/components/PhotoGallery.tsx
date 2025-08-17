import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Camera, Download, ExternalLink } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  title?: string;
}

export default function PhotoGallery({ photos, title = "Photo Gallery" }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const openPhoto = (index: number) => {
    setSelectedPhoto(index);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    }
  };

  const prevPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    }
  };

  const downloadPhoto = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `photo_${index + 1}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  if (photos.length === 0) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Camera className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">No photos available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <Card 
              key={index} 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
              onClick={() => openPhoto(index)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Photo Modal */}
      <Dialog open={selectedPhoto !== null} onOpenChange={closePhoto}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedPhoto !== null && (
            <div className="relative">
              {/* Photo */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img
                  src={photos[selectedPhoto]}
                  alt={`Photo ${selectedPhoto + 1}`}
                  className="w-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                
                {/* Navigation Buttons */}
                {photos.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                      onClick={prevPhoto}
                      disabled={selectedPhoto === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                      onClick={nextPhoto}
                      disabled={selectedPhoto === photos.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between p-4 bg-background border-t">
                <span className="text-sm text-muted-foreground">
                  Photo {selectedPhoto + 1} of {photos.length}
                </span>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInNewTab(photos[selectedPhoto])}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadPhoto(photos[selectedPhoto], selectedPhoto)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}