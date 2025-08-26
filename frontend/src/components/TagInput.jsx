// components/TagInput.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/forms.css";

/**
 * Props:
 * - value: string[] (canonical tag ids)  ← recommended
 * - onChange(nextIds: string[])
 * - options: { id, label }[]   (already filtered for org)
 * - maxSelected?: number
 * - placeholder?: string
 */
export default function TagInput({
  value = [],
  onChange,
  options = [],
  maxSelected,
  placeholder = "Search approved tags…",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const selected = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let base = options.filter((o) => !selected.has(o.id));
    if (q) {
      base = base.filter(
        (o) =>
          o.label.toLowerCase().includes(q) ||
          o.id.includes(q.replace(/\s+/g, "-"))
      );
      base.sort((a, b) => {
        const aStarts = a.label.toLowerCase().startsWith(q) ? -1 : 0;
        const bStarts = b.label.toLowerCase().startsWith(q) ? -1 : 0;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.label.localeCompare(b.label);
      });
    } else {
      base.sort((a, b) => a.label.localeCompare(b.label));
    }
    return base.slice(0, 100);
  }, [options, selected, query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (!listRef.current && !inputRef.current) return;
      const root = inputRef.current?.closest(".tag-input-container");
      if (root && !root.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function add(id) {
    if (!id) return;
    if (maxSelected && value.length >= maxSelected) return;
    if (selected.has(id)) return;
    onChange?.([...value, id]);
    setQuery("");
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function remove(id) {
    onChange?.(value.filter((v) => v !== id));
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleKeyDown(e) {
    if (e.key === "Backspace" && !query && value.length) {
      e.preventDefault();
      remove(value[value.length - 1]);
      return;
    }
    if (open && ["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const max = Math.max(0, filtered.length - 1);
      if (e.key === "ArrowDown") setActiveIndex((i) => Math.min(i + 1, max));
      if (e.key === "ArrowUp") setActiveIndex((i) => Math.max(i - 1, 0));
      if (e.key === "Home") setActiveIndex(0);
      if (e.key === "End") setActiveIndex(max);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (open && filtered[activeIndex]) add(filtered[activeIndex].id);
      return;
    }
    if (e.key === "Escape") setOpen(false);
  }

  const atLimit = maxSelected && value.length >= maxSelected;

  return (
    <div className="tag-input-container" style={{ position: "relative" }}>
      <div className="tag-list" onClick={() => inputRef.current?.focus()}>
        {value.map((id) => {
          const opt = options.find((o) => o.id === id) || { id, label: id };
          return (
            <span key={id} className="tag">
              {opt.label}
              <button
                className="remove-tag"
                type="button"
                onClick={() => remove(id)}
                aria-label={`Remove ${opt.label}`}
              >
                &times;
              </button>
            </span>
          );
        })}

        <input
          ref={inputRef}
          className="tag-input"
          type="text"
          value={query}
          placeholder={atLimit ? `Max ${maxSelected} tags` : placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={!!atLimit}
          // ✅ A11y: combobox pattern
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="tag-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={
            open && filtered[activeIndex]
              ? `tagopt-${filtered[activeIndex].id}`
              : undefined
          }
        />
      </div>

      {open && filtered.length > 0 && (
        <div
          ref={listRef}
          id="tag-suggestions"
          role="listbox"
          className="tag-dropdown"
          style={{
            position: "absolute",
            zIndex: 50,
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 6,
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          {filtered.map((opt, i) => {
            const active = i === activeIndex;
            return (
              <div
                key={opt.id}
                role="option"
                aria-selected={active}
                className={`tag-option${active ? " active" : ""}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => add(opt.id)}
                onMouseEnter={() => setActiveIndex(i)}
                style={{
                  padding: "8px 10px",
                  cursor: "pointer",
                  background: active ? "rgba(59,130,246,0.12)" : undefined,
                }}
                title={`${opt.label}`}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
