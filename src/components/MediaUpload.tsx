import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, FileText, Film, X, Paperclip } from 'lucide-react';

interface Props {
  file: File | null;
  preview: string | null;
  onFileSelect: (file: File | null) => void;
}

const iconForType = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-5 h-5 text-primary" />;
  if (type === 'application/pdf') return <FileText className="w-5 h-5 text-destructive" />;
  if (type.startsWith('video/')) return <Film className="w-5 h-5 text-info" />;
  return <Paperclip className="w-5 h-5 text-muted-foreground" />;
};

export default function MediaUpload({ file, preview, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    onFileSelect(f);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Paperclip className="w-5 h-5 text-primary" />
          Anexo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
          >
            <div className="flex gap-3 text-muted-foreground">
              <Image className="w-6 h-6" />
              <FileText className="w-6 h-6" />
              <Film className="w-6 h-6" />
            </div>
            <p className="text-sm text-muted-foreground">Imagem, PDF ou Vídeo</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf,video/*"
              className="hidden"
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {preview && file.type.startsWith('image/') && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={preview} alt="Preview" className="w-full max-h-[200px] object-contain bg-muted/30" />
              </div>
            )}
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 min-w-0">
                {iconForType(file.type)}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onFileSelect(null)} className="text-muted-foreground hover:text-destructive shrink-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
