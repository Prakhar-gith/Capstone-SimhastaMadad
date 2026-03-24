import { cn } from '../../lib/utils';

function SkeletonBase({ className, ...props }) {
    return (
        <div
            className={cn(
                'bg-white/[0.04] rounded-lg relative overflow-hidden',
                'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent after:animate-[shimmer_2s_infinite]',
                className
            )}
            {...props}
        />
    );
}

export function Skeleton({ className, ...props }) {
    return <SkeletonBase className={cn('h-4 w-full', className)} {...props} />;
}

export function SkeletonStatsCard() {
    return (
        <div className="rounded-xl bg-white/[0.02] ring-1 ring-white/[0.04] p-4">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                    <SkeletonBase className="h-2.5 w-20" />
                    <SkeletonBase className="h-7 w-16" />
                    <SkeletonBase className="h-2.5 w-14" />
                </div>
                <SkeletonBase className="h-9 w-9 rounded-lg" />
            </div>
        </div>
    );
}

export function SkeletonAlertRow() {
    return (
        <div className="p-3 flex items-center gap-3">
            <SkeletonBase className="w-8 h-8 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                    <SkeletonBase className="h-3.5 w-28" />
                    <SkeletonBase className="h-4 w-14 rounded-md" />
                </div>
                <SkeletonBase className="h-3 w-36" />
            </div>
            <div className="space-y-1.5 items-end flex flex-col">
                <SkeletonBase className="h-4 w-20 rounded-md" />
                <SkeletonBase className="h-3 w-14" />
            </div>
        </div>
    );
}

export function SkeletonTableRow() {
    return (
        <tr className="border-b border-white/[0.03]">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="px-3 py-3">
                    <SkeletonBase className={`h-3.5 ${i === 0 ? 'w-20' : i < 3 ? 'w-24' : 'w-16'}`} />
                </td>
            ))}
        </tr>
    );
}

export function SkeletonVolunteerCard() {
    return (
        <div className="p-3.5 border-b md:border-r border-white/[0.04]">
            <div className="flex items-start gap-2.5 mb-2.5">
                <SkeletonBase className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <SkeletonBase className="h-3.5 w-24" />
                    <SkeletonBase className="h-2.5 w-16" />
                </div>
                <SkeletonBase className="h-5 w-16 rounded-md" />
            </div>
            <div className="space-y-1.5 mb-2.5">
                <SkeletonBase className="h-3 w-32" />
                <SkeletonBase className="h-3 w-20" />
            </div>
            <div className="pt-2.5 border-t border-white/[0.04] flex justify-between">
                <SkeletonBase className="h-3 w-20" />
                <SkeletonBase className="h-5 w-14 rounded-md" />
            </div>
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="h-[280px] flex items-end gap-2 px-4 pb-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonBase
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{ height: `${30 + Math.random() * 60}%` }}
                />
            ))}
        </div>
    );
}

export function SkeletonDensityBar() {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between">
                <SkeletonBase className="h-3 w-28" />
                <SkeletonBase className="h-3 w-8" />
            </div>
            <SkeletonBase className="h-1 w-full rounded-full" />
        </div>
    );
}
