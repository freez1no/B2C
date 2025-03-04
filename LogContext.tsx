import React, { createContext, useState } from 'react';

interface LogContextProps {
  logs: string[];
  addLog: (log: string) => void;
  resetLogs: () => void;
}

export const LogContext = createContext<LogContextProps>({
  logs: [],
  addLog: () => {},
  resetLogs: () => {},
});

export const LogProvider: React.FC = ({ children }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setLogs((prevLogs) => [...prevLogs, log]);
  };

  const resetLogs = () => {
    setLogs([]);
  };

  return (
    <LogContext.Provider value={{ logs, addLog, resetLogs }}>
      {children}
    </LogContext.Provider>
  );
};
