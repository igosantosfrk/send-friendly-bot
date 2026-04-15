import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface Props {
  message: string;
  onChange: (msg: string) => void;
}

export default function MessageEditor({ message, onChange }: Props) {
  const preview = message
    .replace(/\{nome\}/gi, 'João Silva')
    .replace(/\n/g, '<br/>');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5 text-primary" />
          Mensagem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Olá {nome}, tudo bem? 👋"
          value={message}
          onChange={e => onChange(e.target.value)}
          className="min-h-[120px] resize-y"
        />
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-muted-foreground">Variáveis:</span>
          <button
            type="button"
            onClick={() => onChange(message + '{nome}')}
            className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {'{nome}'}
          </button>
        </div>
        {message.trim() && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Preview:</p>
            <p
              className="text-sm whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
