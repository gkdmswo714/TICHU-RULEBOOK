import { ButtonHTMLAttributes, ReactNode } from "react";
import { Search, X } from "lucide-react";
export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  return <button className={`${variant}-button ${className}`} {...props} />;
}
export function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`surface ${className}`}>{children}</div>;
}
export function SectionHeading({
  en,
  title,
  description,
}: {
  en: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{en}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
  autoFocus = false,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="search-field">
      <Search size={20} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          aria-label={`${label} 지우기`}
          onClick={() => onChange("")}
        >
          <X size={18} />
        </button>
      )}
    </label>
  );
}
