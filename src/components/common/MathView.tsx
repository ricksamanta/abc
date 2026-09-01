/**
 * CalcRick MathView Component
 * Renders mathematical expressions using KaTeX with fallback
 */

import React, { useMemo } from "react";
import katex from "katex";

interface MathViewProps {
  latex?: string;
  math?: string;
  inline?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  latex,
  math,
  inline = false,
  className = "",
}) => {
  const content = latex || math || "";

  const renderedHtml = useMemo(() => {
    if (!content) return "";
    try {
      return katex.renderToString(content, {
        displayMode: !inline,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return content;
    }
  }, [content, inline]);

  if (!content) return null;

  return (
    <span
      className={`math-katex-view ${inline ? "inline-block" : "block my-2 overflow-x-auto py-1"} ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
