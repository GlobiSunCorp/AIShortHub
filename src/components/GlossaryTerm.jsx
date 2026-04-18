import { useState } from 'react';
import { GLOSSARY } from '../data/glossary';

export function GlossaryTerm({ id, compact = false }) {
  const [open, setOpen] = useState(false);
  const item = GLOSSARY[id];
  if (!item) return null;

  return (
    <span
      className={`glossary-term ${compact ? 'compact' : ''}`.trim()}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button type="button" className="glossary-trigger" onClick={() => setOpen((prev) => !prev)} aria-label={`Explain ${item.term}`}>
        ⓘ
      </button>
      {open ? (
        <span className="glossary-popover" role="tooltip">
          <strong>{item.term}</strong>
          <span>{item.short}</span>
          <span className="small-text">{item.detail}</span>
        </span>
      ) : null}
    </span>
  );
}

export function GlossaryInline({ id, label }) {
  return <>{label} <GlossaryTerm id={id} compact /></>;
}
