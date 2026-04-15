import { useState, useRef, useCallback, useEffect } from 'react';
import WhatsAppConnection from '@/components/WhatsAppConnection';
import CsvUpload from '@/components/CsvUpload';
import MessageEditor from '@/components/MessageEditor';
import MediaUpload from '@/components/MediaUpload';
import DispatchControl from '@/components/DispatchControl';
import SendLogs from '@/components/SendLogs';
import type { ConnectionStatus, Contact, DispatchState, LogEntry } from '@/types/whatsapp';

const Index = () => {
  // Connection
  const [connStatus, setConnStatus] = useState<ConnectionStatus>('disconnected');

  const handleConnect = () => {
    setConnStatus('scanning');
    setTimeout(() => setConnStatus('connected'), 3000);
  };

  const handleDisconnect = () => setConnStatus('disconnected');

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const validContacts = contacts.filter(c => c.valid);

  // Message
  const [message, setMessage] = useState('');

  // Media
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (f: File | null) => {
    setFile(f);
    if (f && f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  // Dispatch
  const [dispatchState, setDispatchState] = useState<DispatchState>('idle');
  const [delay, setDelay] = useState(5);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);

  const sent = logs.filter(l => l.status === 'sent').length;
  const failed = logs.filter(l => l.status === 'failed').length;

  const sendNext = useCallback((idx: number, contactsList: Contact[]) => {
    if (pausedRef.current || idx >= contactsList.length) {
      if (idx >= contactsList.length) setDispatchState('completed');
      return;
    }

    const contact = contactsList[idx];
    // Simulate send: 85% success rate
    const success = Math.random() > 0.15;

    const entry: LogEntry = {
      id: `${Date.now()}-${idx}`,
      contact,
      status: success ? 'sent' : 'failed',
      timestamp: new Date(),
      error: success ? undefined : 'Timeout ao enviar',
    };

    setLogs(prev => [entry, ...prev]);
    setCurrentIdx(idx + 1);

    if (idx + 1 < contactsList.length) {
      const jitter = (Math.random() - 0.5) * 2000;
      timerRef.current = setTimeout(() => sendNext(idx + 1, contactsList), delay * 1000 + jitter);
    } else {
      setDispatchState('completed');
    }
  }, [delay]);

  const canStart = connStatus === 'connected' && validContacts.length > 0 && message.trim().length > 0;

  const handleStart = () => {
    setDispatchState('running');
    setLogs([]);
    setCurrentIdx(0);
    pausedRef.current = false;
    sendNext(0, validContacts);
  };

  const handlePause = () => {
    pausedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    setDispatchState('paused');
  };

  const handleResume = () => {
    pausedRef.current = false;
    setDispatchState('running');
    sendNext(currentIdx, validContacts);
  };

  const handleReset = () => {
    pausedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    setDispatchState('idle');
    setLogs([]);
    setCurrentIdx(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary-foreground" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.114 1.519 5.845L.057 23.58l5.895-1.55A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82a9.8 9.8 0 01-5.01-1.372l-.36-.213-3.727.981.994-3.637-.234-.372A9.8 9.8 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">WhatsApp Sender</h1>
            <p className="text-xs text-muted-foreground">Sistema de disparo em massa</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <WhatsAppConnection
              status={connStatus}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
            <CsvUpload
              contacts={contacts}
              onContactsLoaded={setContacts}
              onClear={() => setContacts([])}
            />
            <MediaUpload
              file={file}
              preview={preview}
              onFileSelect={handleFileSelect}
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <MessageEditor message={message} onChange={setMessage} />
            <DispatchControl
              state={dispatchState}
              delay={delay}
              onDelayChange={setDelay}
              sent={sent}
              failed={failed}
              total={validContacts.length}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              canStart={canStart}
            />
            <SendLogs logs={logs} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
