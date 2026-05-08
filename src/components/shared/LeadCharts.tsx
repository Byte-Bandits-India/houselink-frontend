"use client";

import { Bar, BarChart, Pie, PieChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
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
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

/* ─── Data ────────────────────────────────────────────────────────────────── */

// Bar — Leads per property
const leadsPerPropertyData = [
    { name: "Greenwood", leads: 5 },
    { name: "Sunrise Villa", leads: 3 },
    { name: "Metro Studio", leads: 7 },
    { name: "Coastal Dream", leads: 2 },
    { name: "Tranquil Nest", leads: 4 },
    { name: "Park View", leads: 2 },
];

// Pie — Sell vs Rent/Lease leads
const leadsByTypeData = [
    { type: "sell", count: 3, fill: "var(--color-sell)" },
    { type: "rent", count: 2, fill: "var(--color-rent)" },
];

/* ─── Chart Configs ───────────────────────────────────────────────────────── */

const barConfig = {
    leads: { label: "Leads", color: "#153e75" },
} satisfies ChartConfig;

const pieConfig = {
    sell: { label: "Sell", color: "#153e75" },
    rent: { label: "Rent/Lease", color: "#7c9fd4" },
} satisfies ChartConfig;

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function LeadCharts() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ── Bar Chart — Leads per Property ── */}
            <Card className="rounded-2xl shadow-card border border-surface-tertiary animate-fade-in">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-ink uppercase tracking-wide">
                        Leads per Property
                    </CardTitle>
                    <CardDescription className="text-xs text-ink-muted">
                        Number of enquiries received per listing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={barConfig} className="h-[260px] w-full">
                        <BarChart
                            data={leadsPerPropertyData}
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
                                allowDecimals={false}
                            />
                            <ChartTooltip
                                cursor={{ fill: "#eaf0fb", radius: 4 }}
                                content={<ChartTooltipContent />}
                            />
                            <Bar
                                dataKey="leads"
                                fill="#153e75"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={48}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* ── Pie Chart — Sell vs Rent/Lease ── */}
            <Card className="rounded-2xl shadow-card border border-surface-tertiary animate-fade-in">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-ink uppercase tracking-wide">
                        Leads by Type
                    </CardTitle>
                    <CardDescription className="text-xs text-ink-muted">
                        Distribution of sell vs rent/lease enquiries
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <ChartContainer config={pieConfig} className="h-[220px] w-full">
                        <PieChart>
                            <ChartTooltip
                                content={<ChartTooltipContent nameKey="type" hideLabel />}
                            />
                            <Pie
                                data={leadsByTypeData}
                                dataKey="count"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                innerRadius={62}
                                outerRadius={96}
                                paddingAngle={3}
                                strokeWidth={0}
                            >
                                {leadsByTypeData.map((entry) => (
                                    <Cell key={entry.type} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="type" />}
                            />
                        </PieChart>
                    </ChartContainer>

                    {/* Summary pills */}
                    <div className="flex gap-2.5 flex-wrap justify-center">
                        {leadsByTypeData.map((d) => (
                            <div
                                key={d.type}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-secondary border border-surface-tertiary"
                            >
                                <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ background: pieConfig[d.type as keyof typeof pieConfig].color }}
                                />
                                <span className="text-xs font-medium text-ink-secondary capitalize">
                                    {pieConfig[d.type as keyof typeof pieConfig].label}
                                </span>
                                <span className="text-xs font-bold text-ink">{d.count}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}