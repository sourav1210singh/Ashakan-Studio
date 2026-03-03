import { useEffect, useRef, useState } from "react";

interface TextRevealProps {
  text: string;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function TextReveal({
  text,
  delay = 0,
  className = "",
  as: Component = "span",
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      <Component>
        {words.map((word, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden mr-[0.25em]"
          >
            <span
              className="inline-block transition-transform"
              style={{
                transform: isVisible ? "translateY(0)" : "translateY(100%)",
                transitionDuration: "0.6s",
                transitionDelay: `${delay + index * 0.05}s`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </Component>
    </div>
  );
}

interface CharacterRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

export function CharacterReveal({
  text,
  delay = 0,
  className = "",
}: CharacterRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const characters = text.split("");

  return (
    <span ref={ref} className={className}>
      {characters.map((char, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <span
            className="inline-block transition-transform"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(100%)",
              transitionDuration: "0.4s",
              transitionDelay: `${delay + index * 0.02}s`,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}
