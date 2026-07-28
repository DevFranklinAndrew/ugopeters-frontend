import { useEffect, useId, useRef, useState } from "react";
import { LuChevronDown, LuCheck } from "react-icons/lu";
import { cn } from "../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** When set, a hidden input is rendered so the value is picked up by native
   *  form submission / FormData. */
  name?: string;
  disabled?: boolean;
  /** Renders the control with a red border to signal a validation error. */
  invalid?: boolean;
  id?: string;
  /** Applied to the outer wrapper (width, spacing, etc.). */
  className?: string;
  ariaLabel?: string;
}

/**
 * Accessible custom dropdown used across the app in place of the native
 * `<select>` (which can't be fully styled — dropdown option colors/hover are
 * controlled by the OS). Fully keyboard-navigable and themeable, with the gold
 * accent on the active/hovered option.
 */
const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select…",
  name,
  disabled,
  invalid,
  id,
  className,
  ariaLabel,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reactId = useId();
  const listId = `${id ?? reactId}-listbox`;

  const selected = options.find((o) => o.value === value);
  const selectedIndex = options.findIndex((o) => o.value === value);

  const firstEnabled = () => options.findIndex((o) => !o.disabled);
  const lastEnabled = () => {
    for (let i = options.length - 1; i >= 0; i--) {
      if (!options[i].disabled) return i;
    }
    return -1;
  };

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the active option scrolled into view during keyboard navigation.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const openMenu = () => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : firstEnabled());
    setOpen(true);
  };

  const commit = (index: number) => {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
  };

  const moveActive = (dir: 1 | -1) => {
    setActiveIndex((prev) => {
      let next = prev;
      for (let i = 0; i < options.length; i++) {
        next = (next + dir + options.length) % options.length;
        if (!options[next]?.disabled) break;
      }
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (open) moveActive(1);
        else openMenu();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) moveActive(-1);
        else openMenu();
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActiveIndex(firstEnabled());
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActiveIndex(lastEnabled());
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) commit(activeIndex);
        else openMenu();
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        if (open) setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined
        }
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full flex items-center justify-between gap-3 bg-transparent border-b py-3 text-lg font-serif text-left transition-colors focus:outline-none",
          invalid
            ? "border-red-500"
            : open
              ? "border-gold"
              : "border-border hover:border-foreground/30",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <span className={cn("truncate", !selected && "text-foreground/40")}>
          {selected ? selected.label : placeholder}
        </span>
        <LuChevronDown
          size={18}
          className={cn(
            "shrink-0 text-foreground/40 transition-transform duration-200",
            open && "rotate-180 text-gold",
          )}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 w-full max-h-64 overflow-auto bg-card border border-border shadow-xl shadow-black/20 py-1"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={opt.value}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled || undefined}
                onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(i)}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-2.5 text-base select-none transition-colors",
                  opt.disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer",
                  isActive && !opt.disabled
                    ? "bg-gold text-black"
                    : "text-foreground",
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <LuCheck
                    size={16}
                    className={cn(
                      "shrink-0",
                      isActive ? "text-black" : "text-gold",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
