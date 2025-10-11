"use client";

import { createContext, useContext, type ReactNode } from "react";

const ProjectPidContext = createContext<string>("");

export const useProjectPid = () => {
  const ctx = useContext(ProjectPidContext);
  if (ctx === undefined) {
    throw new Error(
      "Use project pid must be used within a project pid provider"
    );
  }
  return ctx;
};

export const ProjectPidProvider = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => (
  <ProjectPidContext.Provider value={value}>
    {children}
  </ProjectPidContext.Provider>
);
