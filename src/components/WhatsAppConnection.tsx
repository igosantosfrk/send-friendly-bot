import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import type { ConnectionStatus } from '@/types/whatsapp';

interface Props {
  status: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
}

const statusConfig: Record<ConnectionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  disconnected: { label: 'Desconectado', color: 'bg-destructive', icon: <WifiOff className="w-4 h-4" /> },
  scanning: { label: 'Escaneando QR Code...', color: 'bg-warning', icon: <QrCode className="w-4 h-4" /> },
  connected: { label: 'Conectado', color: 'bg-success', icon: <Wifi className="w-4 h-4" /> },
  reconnecting: { label: 'Reconectando...', color: 'bg-warning', icon: <RefreshCw className="w-4 h-4 animate-spin" /> },
};

export default function WhatsAppConnection({ status, onConnect, onDisconnect }: Props) {
  const [qrDots, setQrDots] = useState<boolean[]>([]);
  const cfg = statusConfig[status];

  useEffect(() => {
    if (status === 'scanning') {
      // Generate random QR pattern
      setQrDots(Array.from({ length: 225 }, () => Math.random() > 0.4));
    }
  }, [status]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            Conexão WhatsApp
          </span>
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.color} ${status === 'scanning' || status === 'reconnecting' ? 'animate-pulse_dot' : ''}`} />
            {cfg.label}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {status === 'scanning' && (
          <div className="bg-card border-2 border-border p-4 rounded-lg">
            <div className="grid grid-cols-[repeat(15,1fr)] gap-[2px] w-[180px] h-[180px]">
              {qrDots.map((filled, i) => (
                <div
                  key={i}
                  className={`rounded-[1px] ${filled ? 'bg-foreground' : 'bg-transparent'}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Escaneie com seu WhatsApp
            </p>
          </div>
        )}

        {status === 'connected' && (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <Wifi className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-primary">Sessão ativa</p>
          </div>
        )}

        {status === 'disconnected' && (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <WifiOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Nenhuma sessão ativa</p>
          </div>
        )}

        <div className="flex gap-2 w-full">
          {status !== 'connected' ? (
            <Button onClick={onConnect} className="flex-1" disabled={status === 'scanning'}>
              {status === 'scanning' ? 'Aguardando...' : 'Gerar QR Code'}
            </Button>
          ) : (
            <Button onClick={onDisconnect} variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              Desconectar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
