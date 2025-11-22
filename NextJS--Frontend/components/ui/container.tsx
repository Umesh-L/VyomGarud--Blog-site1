import { ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
}

/**
 * Consistent content wrapper to keep pages centered on larger screens.
 */
export function Container({ children, as: Tag = "div", className = "", id }: ContainerProps) {
  return (
    <Tag id={id} className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
