"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Prediction = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types?: string[];
};

export default function PlaceAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  id,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (prediction: Prediction) => void;
  placeholder?: string;
  id: string;
  label: string;
}) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchPredictions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setPredictions([]);
      return;
    }
    try {
      const res = await fetch(
        `/api/places-autocomplete?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      setPredictions(data.predictions ?? []);
      setOpen(true);
      setActiveIdx(-1);
    } catch {
      setPredictions([]);
    }
  }, []);

  function handleChange(v: string) {
    onChange(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(v), 250);
  }

  function handleSelect(p: Prediction) {
    onChange(p.mainText);
    onSelect(p);
    setOpen(false);
    setPredictions([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || predictions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, predictions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(predictions[activeIdx]!);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="text"
        required
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => predictions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={`${id}-listbox`}
        className="block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {open && predictions.length > 0 && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-border bg-card py-1 shadow-lg"
        >
          {predictions.map((p, i) => (
            <li
              key={p.placeId}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={() => handleSelect(p)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`cursor-pointer px-4 py-2.5 text-sm transition ${
                i === activeIdx
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="font-medium">{p.mainText}</span>
              {p.secondaryText && (
                <span className="ml-1.5 text-muted-foreground">
                  {p.secondaryText}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
