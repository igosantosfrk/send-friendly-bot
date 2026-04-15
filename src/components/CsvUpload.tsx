import { useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Contact } from '@/types/whatsapp';

interface Props {
  contacts: Contact[];
  onContactsLoaded: (contacts: Contact[]) => void;
  onClear: () => void;
}

function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

function parseCSV(text: string): Contact[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().split(/[,;\t]/);
  const phoneIdx = header.findIndex(h => h.trim().includes('telefone') || h.trim().includes('phone') || h.trim().includes('numero'));
  const nameIdx = header.findIndex(h => h.trim().includes('nome') || h.trim().includes('name'));

  if (phoneIdx === -1) return [];

  return lines.slice(1).filter(l => l.trim()).map(line => {
    const cols = line.split(/[,;\t]/);
    const telefone = (cols[phoneIdx] || '').trim();
    const nome = nameIdx >= 0 ? (cols[nameIdx] || '').trim() : '';
    const valid = validatePhone(telefone);
    return { nome, telefone, valid, error: valid ? undefined : 'Número inválido' };
  });
}

export default function CsvUpload({ contacts, onContactsLoaded, onClear }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const validCount = contacts.filter(c => c.valid).length;
  const invalidCount = contacts.filter(c => !c.valid).length;

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      onContactsLoaded(parsed);
    };
    reader.readAsText(file);
  }, [onContactsLoaded]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) handleFile(file);
  }, [handleFile]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Contatos CSV
          </span>
          {contacts.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Limpar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
          >
            <Upload className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              Arraste um arquivo CSV ou <span className="text-primary font-medium">clique para selecionar</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Colunas: <code className="bg-muted px-1 rounded">telefone</code> (obrigatório), <code className="bg-muted px-1 rounded">nome</code> (opcional)
            </p>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }} />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 bg-accent/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{validCount}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-success" /> Válidos
                </p>
              </div>
              <div className="flex-1 bg-destructive/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-destructive">{invalidCount}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <XCircle className="w-3 h-3 text-destructive" /> Inválidos
                </p>
              </div>
            </div>
            <ScrollArea className="h-[180px] border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left p-2 font-medium text-muted-foreground">Telefone</th>
                    <th className="text-center p-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, i) => (
                    <tr key={i} className="border-t border-border/50">
                      <td className="p-2">{c.nome || '—'}</td>
                      <td className="p-2 font-mono text-xs">{c.telefone}</td>
                      <td className="p-2 text-center">
                        {c.valid
                          ? <CheckCircle2 className="w-4 h-4 text-success inline-block" />
                          : <XCircle className="w-4 h-4 text-destructive inline-block" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
