import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const H1 = ({ children, className }: Props) => {
  return <h1 className={className}>{children}</h1>;
};
export default H1;
