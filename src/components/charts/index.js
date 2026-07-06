/**
 * Charts barrel — analytical / data-viz components. All zero-dependency
 * (pure SVG + own scales/geometry), token-only, responsive.
 */
export { LineChart } from "./LineChart/LineChart";
export { BarChart } from "./BarChart/BarChart";
export { DonutChart, PieChart } from "./DonutChart/DonutChart";
export { Sparkline } from "./Sparkline/Sparkline";
export { StatCard } from "./StatCard/StatCard";

// Number formatters for chart axes / values / KPI (pass as yFormat/valueFormat/format).
export { formatCompact, formatIndian, formatNumber } from "./internal/lib";
