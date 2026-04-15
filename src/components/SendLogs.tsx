import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList, Download, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { LogEntry } from '@/types/whatsapp';

interface Props {
  logs: LogEntry[];
}

type Filter = 'all' | 'sent' | 'failed';

export default function SendLogs({ logs }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = logs.filter(l => {
    if (filter === 'sent') return l.status === 'sent';
    if (filter === 'failed') return l.status === 'failed';
    return true;
  });

  const exportLogs = () => {
    const csv = ['Nome,Telefone,Status,Hora,Erro']
      .concat(logs.map(l =>
        `"${l.contact.nome}","${l.contact.telefone}","${l.status}","${l.timestamp.toLocaleTimeString()}","${l.error || ''}"`
      ))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs_disparo.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusIcon = (status: string) => {
    if (status === 'sent') return <CheckCircle2 className="w-4 h-4 text-success" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-destructive" />;
    return <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Logs de Envio
          </span>
          {logs.length > 0 && (
            <Button variant="ghost" size="sm" onClick={exportLogs}>
              <Download className="w-4 h-4 mr-1" /> CSV
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum envio registrado ainda.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-1">
              {(['all', 'sent', 'failed'] as Filter[]).map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="text-xs"
                >
                  {f === 'all' ? 'Todos' : f === 'sent' ? '✅ Enviados' : '❌ Falhas'}
                </Button>
              ))}
            </div>
            <ScrollArea className="h-[220px]">
              <div className="space-y-1">
                {filtered.map(log => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {statusIcon(log.status)}
                      <span className="truncate font-medium">{log.contact.nome || log.contact.telefone}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground font-mono">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
