import { cn } from "cn"

type CardMetricProps = {
    name: string
    value: number
    textStyle: string
}
export function CardMetric({ value, name, textStyle }: CardMetricProps) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
      <p className="text-sm text-slate-500 font-medium">{name}</p>
      <p className={cn("text-2xl font-bold text-slate-900", textStyle)}>{value}</p>
    </div>
  );
}
