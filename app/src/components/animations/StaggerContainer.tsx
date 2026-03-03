import { type ReactNode } from "react";
import { FadeIn } from "./FadeIn";

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
  once = true,
}: StaggerContainerProps) {
  return (
    <div className={className}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <FadeIn key={index} delay={index * staggerDelay} once={once}>
            {child}
          </FadeIn>
        ))
      ) : (
        <FadeIn once={once}>{children}</FadeIn>
      )}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
