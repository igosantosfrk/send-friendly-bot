import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import type { DispatchState } from '@/types/whatsapp';

interface Props {
  state: DispatchState;
  delay: number;
  onDelayChange: (val: number) => void;
  sent: number;
  failed: number;
  total: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  canStart: boolean;
}

export default function DispatchControl({
  state, delay, onDelayChange, sent, failed, total,
  onStart, onPause, onResume, onReset, canStart,
}: Props) {
  const progress = total > 0 ? ((sent + failed) / total) * 100 : 0;
  const remaining = total - sent - failed;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-primary" />
          Controle de Disparo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Delay entre envios</span>
            <span className="font-medium">{delay}s</span>
          </div>
          <Slider
            value={[delay]}
            onValueChange={v => onDelayChange(v[0])}
            min={3}
            max={10}
            step={1}
            disabled={state === 'running'}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>3s</span><span>10s</span>
          </div>
        </div>

        {state !== 'idle' && (
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-accent/50 rounded-md p-2">
                <p className="text-lg font-bold text-primary">{sent}</p>
                <p className="text-muted-foreground">Enviados</p>
              </div>
              <div className="bg-destructive/10 rounded-md p-2">
                <p className="text-lg font-bold text-destructive">{failed}</p>
                <p className="text-muted-foreground">Falhas</p>
              </div>
              <div className="bg-muted rounded-md p-2">
                <p className="text-lg font-bold">{remaining}</p>
                <p className="text-muted-foreground">Restantes</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {state === 'idle' && (
            <Button onClick={onStart} disabled={!canStart} className="flex-1">
              <Play className="w-4 h-4 mr-1" /> Iniciar Disparo
            </Button>
          )}
          {state === 'running' && (
            <Button onClick={onPause} variant="outline" className="flex-1">
              <Pause className="w-4 h-4 mr-1" /> Pausar
            </Button>
          )}
          {state === 'paused' && (
            <>
              <Button onClick={onResume} className="flex-1">
                <Play className="w-4 h-4 mr-1" /> Retomar
              </Button>
              <Button onClick={onReset} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}
          {state === 'completed' && (
            <Button onClick={onReset} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-1" /> Novo Disparo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
