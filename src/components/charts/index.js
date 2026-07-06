/**
 * Charts barrel — analytical / data-viz components. All zero-dependency
 * (pure SVG + own scales/geometry), token-only, responsive.
 */
export { LineChart } from "./LineChart";
export { BarChart } from "./BarChart";
export { DonutChart, PieChart } from "./DonutChart";
export { Sparkline } from "./Sparkline";
export { StatCard } from "./StatCard";
export { RadarChart } from "./RadarChart";
export { GaugeChart } from "./GaugeChart";

// Number formatters for chart axes / values / KPI (pass as yFormat/valueFormat/format).
export { formatCompact, formatIndian, formatNumber } from "./internal/lib";
