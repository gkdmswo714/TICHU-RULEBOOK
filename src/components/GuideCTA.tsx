import { ArrowRight } from "lucide-react";
export function GuideCTA({title, description, label, onClick}: {title: string; description?: string; label: string; onClick: () => void}) {
  return <section className="guide-cta"><p>{title}</p>{description && <p className="muted">{description}</p>}<button onClick={onClick}>{label}<ArrowRight size={20} aria-hidden="true"/></button></section>;
}
