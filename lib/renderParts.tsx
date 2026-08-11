import { Fragment, type ReactNode } from "react";

/** One piece of rich text from JSON (optional bold / line break). */
export type TextPart = {
  text: string;
  className?: string;
  br?: boolean;
};

/** Turns JSON text parts into JSX spans and line breaks. */
export function renderParts(parts: TextPart[]): ReactNode {
  return parts.map((part, index) => (
    <Fragment key={index}>
      <span className={part.className}>{part.text}</span>
      {part.br ? <br /> : null}
    </Fragment>
  ));
}
