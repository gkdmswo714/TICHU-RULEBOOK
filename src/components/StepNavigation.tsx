"use client";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
type Props = {labels: string[]; markers?: string[]; step: number; onChange: (step: number) => void; prefix: string};
export function StepNavigation({labels, markers, step, onChange, prefix}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = ref.current, button = strip?.children[step] as HTMLElement | undefined;
    if (strip && button) strip.scrollTo({left: button.offsetLeft - strip.offsetLeft, behavior: "instant"});
  }, [step]);
  return <><p className="step-hint">단계를 선택하면 자세한 설명을 볼 수 있어요.</p><div className="step-progress step-buttons" ref={ref} role="tablist" aria-label="게임 순서">{labels.map((label,i)=><button key={label} role="tab" id={`${prefix}-${i}`} aria-controls={`${prefix}-content`} aria-selected={step===i} tabIndex={step===i?0:-1} onClick={()=>onChange(i)} onKeyDown={e=>{
    const next=e.key==="ArrowRight"?(i+1)%labels.length:e.key==="ArrowLeft"?(i+labels.length-1)%labels.length:e.key==="Home"?0:e.key==="End"?labels.length-1:-1;
    if(next>=0){e.preventDefault();onChange(next);(ref.current?.children[next] as HTMLElement)?.focus({preventScroll:true});}
  }}><span className="step-circle">{markers?.[i]??i+1}</span><span>{label}</span><ChevronRight size={18} aria-hidden="true"/></button>)}</div></>;
}
export function StepActions({step, count, onChange}: {step: number; count: number; onChange: (step: number) => void}) {
  return <div className="step-actions"><button disabled={step===0} onClick={()=>onChange(step-1)}><ArrowLeft size={18}/>이전 단계</button><button disabled={step===count-1} onClick={()=>onChange(step+1)}>{step===count-1?"마지막 단계":"다음 단계"}<ArrowRight size={18}/></button></div>;
}
