"use client";

import {
    Bar,
    BarChart,
    Pie,
    PieChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface Property {
    id: number;
    name: string;
    views: number;
    moderationStatus: string;
}

interface PropertyChartsProps {
    properties: Property[];
}

/* ─── Chart configs ───────────────────────────────────────────────────────── */

const barConfig = {
    views: { label: "Views", color: "#153e75" },
} satisfies ChartConfig;

const pieConfig = {
    approved: { label: "Approved", color: "#153e75" },
    pending: { label: "Pending", color: "#f59e0b" },
    rejected: { label: "Rejected", color: "#ef4444" },
} satisfies ChartConfig;

const statusColors: Record<string, string> = {
    approved: "#153e75",
    pending: "#f59e0b",
    rejected: "#ef4444",
};

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function PropertyCharts({ properties }: PropertyChartsProps) {
    // Derive views data from properties (top 6 by views)
    const viewsData = [...properties]
        .sort((a, b) => b.views - a.views)
        .slice(0, 6)
        .map((p) => ({
            name: p.name.split(" ").slice(0, 2).join(" "),
            views: p.views,
        }));

    // Derive moderation breakdown dynamically
    const moderationCounts = properties.reduce<Record<string, number>>((acc, p) => {
        acc[p.moderationStatus] = (acc[p.moderationStatus] || 0) + 1;
        return acc;
    }, {});

    const moderationData = Object.entries(moderationCounts)
        .filter(([status]) => status !== "archived")
        .map(([status, count]) => ({
            status,
            count,
            fill: statusColors[status] ?? "#94a3b8",
        }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ── Bar Chart ── */}
            <Card className="rounded-2xl shadow-card border border-surface-tertiary animate-fade-in">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-ink uppercase tracking-wide">
                        Views per Property
                    </CardTitle>
                    <CardDescription className="text-xs text-ink-muted">
                        Total views across all active listings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={barConfig} className="h-[260px] w-full">
                        <BarChart
                            key={JSON.stringify(viewsData)}
                            data={viewsData}
                            margin={{ top: 16, right: 8, left: -10, bottom: 0 }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="4 4"
                                stroke="#f1f5f9"
                            />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: "#475569" }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 11, fill: "#475569" }}
                            />
                            <ChartTooltip
                                cursor={{ fill: "#eaf0fb", radius: 4 }}
                                content={<ChartTooltipContent />}
                            />
                            <Bar
                                dataKey="views"
                                fill="#153e75"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={48}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* ── Pie / Donut Chart ── */}
            <Card className="rounded-2xl shadow-card border border-surface-tertiary animate-fade-in">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-ink uppercase tracking-wide">
                        Moderation Status
                    </CardTitle>
                    <CardDescription className="text-xs text-ink-muted">
                        Breakdown of listing approval states
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <ChartContainer config={pieConfig} className="h-[220px] w-full">
                        <PieChart key={JSON.stringify(moderationData)}>
                            <ChartTooltip
                                content={<ChartTooltipContent nameKey="status" hideLabel />}
                            />
                            <Pie
                                data={moderationData}
                                dataKey="count"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                innerRadius={62}
                                outerRadius={96}
                                paddingAngle={3}
                                strokeWidth={0}
                            >
                                {moderationData.map((entry) => (
                                    <Cell key={entry.status} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>

                    {/* Summary pills */}
                    <div className="flex gap-2.5 flex-wrap justify-center">
                        {moderationData.map((d) => (
                            <div
                                key={d.status}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-secondary border border-surface-tertiary"
                            >
                                <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ background: d.fill.startsWith("var") ? pieConfig[d.status as keyof typeof pieConfig].color : d.fill }}
                                />
                                <span className="text-xs font-medium text-ink-secondary capitalize">{d.status}</span>
                                <span className="text-xs font-bold text-ink">{d.count}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}