import { useEffect, useMemo, useRef, useState } from 'react';

export function DarkSelect({ id, label, value, onChange, options = [], disabled = false, className = '', placeholder = 'Select' }) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  const normalized = useMemo(
    () => options.map((item) => (typeof item === 'string' ? { value: item, label: item } : item)),
    [options],
  );

  const selected = normalized.find((item) => item.value === value);

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutside);
    return () => document.removeEventListener('mousedown', closeOnOutside);
  }, []);

  useEffect(() => {
    const index = normalized.findIndex((item) => item.value === value);
    setFocusedIndex(index >= 0 ? index : 0);
  }, [value, normalized]);

  const selectValue = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onButtonKeyDown = (event) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen((prev) => !prev);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) return setOpen(true);
      setFocusedIndex((prev) => Math.min(prev + 1, normalized.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) return setOpen(true);
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    }
    if (event.key === 'Escape') setOpen(false);
  };

  return (
    <div className={`dark-select-wrap ${className}`.trim()} ref={rootRef}>
      {label ? <label className="small-text" htmlFor={id}>{label}</label> : null}
      <button
        id={id}
        ref={buttonRef}
        type="button"
        className="dark-select-trigger"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-haspopup="listbox"
        onKeyDown={onButtonKeyDown}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span>{selected?.label || placeholder}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="dark-select-popover" role="listbox" id={`${id}-listbox`}>
          {normalized.map((item, index) => (
            <button
              key={item.value}
              type="button"
              role="option"
              className={`dark-select-option ${item.value === value ? 'selected' : ''} ${index === focusedIndex ? 'focused' : ''}`.trim()}
              aria-selected={item.value === value}
              onMouseEnter={() => setFocusedIndex(index)}
              onClick={() => selectValue(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
