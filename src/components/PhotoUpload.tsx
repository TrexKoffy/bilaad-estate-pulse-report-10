import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Upload, X, Loader2, AlertCircle } from 'lucide-react';

interface PhotoUploadProps {
  photos: string[];
  onPhotosUpdate: (photos: string[]) => void;
  unitId?: string;
  projectId: string;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export default function PhotoUpload({ 
  photos, 
  onPhotosUpdate, 
  unitId, 
  projectId, 
  maxFiles = 10,
  maxSize = 5
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Only image files are allowed';
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${projectId}/${unitId || 'project'}/${fileName}`;

    try {
      console.log('PhotoUpload: Uploading file to path:', filePath);
      const { data, error } = await supabase.storage
        .from('UNITS')
        .upload(filePath, file);

      if (error) {
        console.error('PhotoUpload: Upload error:', error);
        return null;
      }
      
      console.log('PhotoUpload: Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('UNITS')
        .getPublicUrl(filePath);

      console.log('PhotoUpload: Public URL generated:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('PhotoUpload: Unexpected upload error:', error);
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check total files limit
    if (photos.length + files.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxFiles} photos allowed`,
        variant: 'destructive'
      });
      return;
    }

    // Validate all files first
    const validationErrors: string[] = [];
    files.forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(`File ${index + 1}: ${error}`);
      }
    });

    if (validationErrors.length > 0) {
      toast({
        title: 'File validation failed',
        description: validationErrors.join('\n'),
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      console.log('PhotoUpload: Starting upload process for', files.length, 'files');
      const uploadPromises = files.map(async (file, index) => {
        console.log(`PhotoUpload: Uploading file ${index + 1}/${files.length}:`, file.name);
        const url = await uploadFile(file);
        setUploadProgress(((index + 1) / files.length) * 100);
        return url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const successfulUploads = uploadedUrls.filter(url => url !== null) as string[];
      
      console.log('PhotoUpload: Upload results:', { 
        total: files.length, 
        successful: successfulUploads.length,
        urls: successfulUploads 
      });

      if (successfulUploads.length > 0) {
        const newPhotos = [...photos, ...successfulUploads];
        console.log('PhotoUpload: Updating photos from', photos.length, 'to', newPhotos.length);
        onPhotosUpdate(newPhotos);
        
        toast({
          title: 'Photos uploaded',
          description: `${successfulUploads.length} photo(s) uploaded successfully`
        });
      }

      if (successfulUploads.length < files.length) {
        const failedCount = files.length - successfulUploads.length;
        console.error('PhotoUpload: Some uploads failed:', failedCount);
        toast({
          title: 'Some uploads failed',
          description: `${failedCount} photo(s) failed to upload. Check console for details.`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Upload process error:', error);
      toast({
        title: 'Upload failed',
        description: 'An error occurred during upload. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosUpdate(newPhotos);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={openFileDialog}
          disabled={uploading || photos.length >= maxFiles}
          variant="outline"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {uploading ? 'Uploading...' : 'Upload Photos'}
        </Button>
        <span className="text-sm text-muted-foreground">
          {photos.length}/{maxFiles} photos • Max {maxSize}MB per file
        </span>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No photos uploaded yet</p>
            <Button type="button" onClick={openFileDialog} variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Upload First Photo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Guidelines */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Photo Guidelines:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Maximum {maxFiles} photos per unit</li>
            <li>Maximum {maxSize}MB per photo</li>
            <li>Supported formats: JPG, PNG, WEBP, GIF</li>
            <li>High-quality photos show progress best</li>
          </ul>
        </div>
      </div>
    </div>
  );
}