import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingProducts() {
    return (
        <div className="space-y-6 text-slate-800">
            <div className="border-b border-slate-200 pb-4">
                <Skeleton className="h-9 w-52" />
                <Skeleton className="mt-2 h-5 w-96 max-w-full" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="mt-3 h-8 w-12" />
                    </div>
                ))}
            </div>

            <Card className="rounded-lg">
                <CardHeader>
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <Skeleton className="h-11 w-full sm:w-45" />
                        <div className="flex gap-3">
                            <Skeleton className="h-11 w-96 max-w-full" />
                            <Skeleton className="h-11 w-24" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 overflow-x-auto">
                    <Skeleton className="h-12 w-full" />
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-14 w-full" />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
