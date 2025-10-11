"use client";

import { createContext, useContext, type ReactNode } from "react";

type PidContextType = {
  projectPid: string;
  teamPid: string;
};

const PidContext = createContext<PidContextType>({
  projectPid: "",
  teamPid: "",
});

export const usePidContext = () => {
  const values = useContext(PidContext);
  if (values === undefined) {
    throw new Error(
      "Use project pid must be used within a project pid provider"
    );
  }
  return values;
};

export const ProjectPidProvider = ({
  value,
  children,
}: {
  value: PidContextType;
  children: ReactNode;
}) => <PidContext.Provider value={value}>{children}</PidContext.Provider>;
