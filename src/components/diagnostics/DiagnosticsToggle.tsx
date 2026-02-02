import { useState, useEffect, useSyncExternalStore } from 'react';
import { Bug, AlertTriangle } from 'lucide-react';
import { diagnostics } from '@/lib/diagnostics';
import { DiagnosticsPanel } from './DiagnosticsPanel';

export const DiagnosticsToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize diagnostics engine on first render
  useEffect(() => {
    diagnostics.init();
  }, []);

  const logs = useSyncExternalStore(
    (cb) => diagnostics.subscribe(cb),
    () => diagnostics.getLogs()
  );

  const errorCount = logs.filter((l) => l.type === 'error').length;
  const hasErrors = errorCount > 0;

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 left-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
          hasErrors
            ? 'bg-red-600 hover:bg-red-500 animate-pulse'
            : isOpen
            ? 'bg-green-600 hover:bg-green-500'
            : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700'
        }`}
        title="Toggle Diagnostics Console (Ctrl+Shift+D)"
      >
        {hasErrors ? (
          <AlertTriangle className="w-5 h-5 text-white" />
        ) : (
          <Bug className="w-5 h-5 text-white" />
        )}
        {errorCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-[10px] flex items-center justify-center text-white font-bold border-2 border-black">
            {errorCount > 9 ? '9+' : errorCount}
          </span>
        )}
      </button>
      <DiagnosticsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default DiagnosticsToggle;
