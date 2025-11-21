'use client'

export const ChartSkeleton = (): React.JSX.Element => (
    <div className="w-full h-60 rounded-md bg-slate-50 border border-slate-200 px-4 py-3 flex items-center justify-center">
        <div className="h-full flex items-end gap-2">
            <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '30%' }} />
            <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '55%' }} />
            <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '80%' }} />
            <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '45%' }} />
            <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '65%' }} />
            <div className="w-6 bg-slate-200 animate-pulse rounded" style={{ height: '35%' }} />
        </div>
    </div>
)

