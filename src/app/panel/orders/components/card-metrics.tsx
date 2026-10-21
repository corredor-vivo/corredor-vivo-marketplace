import { cn } from "cn";

type CardMetricProps = {
  name: string;
  value: number;
  textStyle: string;
};

export function CardMetric({ name, value, textStyle }: CardMetricProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{name}</p>
      <p className={cn("text-2xl font-bold text-slate-900", textStyle)}>{value}</p>
    </div>
  );
}
