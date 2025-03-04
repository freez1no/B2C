// LogContext.tsx
import React, { createContext, useState } from 'react';

interface LogContextType {
  logs: string[];
  addLog: (log: string) => void;
  clearLogs: () => void;
}

export const LogContext = createContext<LogContextType>({
  logs: [],
  addLog: () => {},
  clearLogs: () => {},
});

export const LogProvider: React.FC = ({ children }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setLogs(prevLogs => [log, ...prevLogs]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};
