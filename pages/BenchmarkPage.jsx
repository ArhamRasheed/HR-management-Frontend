import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Database,
  Layers,
  GitBranch,
  Zap,
  ChevronDown,
  ChevronRight,
  Info,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import PageHeader from "../src/components/PageHeader";
import Footer from "../components/footer";
import { benchmarkService } from "../src/api/benchmarkService";

const FAST_COLOR = "#10b981";
const SLOW_COLOR = "#ef4444";
const COUNT_FAST_COLOR = "#059669";
const COUNT_SLOW_COLOR = "#f97316";

const formatMs = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return `${num.toFixed(3)} ms`;
};

const formatNumber = (value, digits = 2) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "-";
  return num.toFixed(digits);
};

const SectionCard = ({ icon: Icon, iconBg, iconColor, title, description, children }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-200 flex items-start gap-3">
      <div className={`${iconBg} p-2.5 rounded-lg`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mt-0.5">{description}</p>
        )}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, suffix }) => (
  <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">
          {value}
          {suffix && (
            <span className="text-base font-semibold text-gray-500 ml-1">{suffix}</span>
          )}
        </p>
      </div>
      <div className={`${iconBg} p-3 rounded-lg`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const NoteCallout = ({ children }) => (
  <div className="mt-4 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
    <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-emerald-900 leading-relaxed">{children}</p>
  </div>
);

const DataTable = ({ rows }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="w-full text-sm">
      <tbody className="divide-y divide-gray-200">
        {rows.map(([label, value], idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-600 font-medium bg-gray-50 w-1/2">
              {label}
            </td>
            <td className="px-4 py-3 text-gray-900 font-mono">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TimeBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-gray-600">
          <span className="font-semibold" style={{ color: entry.color }}>
            {entry.name}:
          </span>{" "}
          {entry.dataKey === "queryCount"
            ? `${entry.value} queries`
            : formatMs(entry.value)}
        </p>
      ))}
    </div>
  );
};

const TwoBarChart = ({ data, dataKey = "time", height = 240 }) => (
  <div style={{ width: "100%", height }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `${v} ms`}
          width={80}
        />
        <Tooltip content={<TimeBarTooltip />} cursor={{ fill: "#f9fafb" }} />
        <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} maxBarSize={120}>
          {data.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={entry.fast ? FAST_COLOR : SLOW_COLOR}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const QueryOptimizationChart = ({ data, height = 260 }) => (
  <div style={{ width: "100%", height }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `${v} ms`}
          width={80}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `${v}`}
          width={50}
        />
        <Tooltip content={<TimeBarTooltip />} cursor={{ fill: "#f9fafb" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar
          yAxisId="left"
          dataKey="time"
          name="Time (ms)"
          radius={[8, 8, 0, 0]}
          maxBarSize={70}
        >
          {data.map((entry, idx) => (
            <Cell
              key={`time-${idx}`}
              fill={entry.fast ? FAST_COLOR : SLOW_COLOR}
            />
          ))}
        </Bar>
        <Bar
          yAxisId="right"
          dataKey="queryCount"
          name="Query Count"
          radius={[8, 8, 0, 0]}
          maxBarSize={70}
        >
          {data.map((entry, idx) => (
            <Cell
              key={`q-${idx}`}
              fill={entry.fast ? COUNT_FAST_COLOR : COUNT_SLOW_COLOR}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const ExplainBlock = ({ title, rows }) => {
  const text = Array.isArray(rows)
    ? rows
        .map((row) =>
          Array.isArray(row) ? row.map((c) => String(c ?? "")).join(" | ") : String(row ?? "")
        )
        .join("\n")
    : String(rows ?? "");
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <pre className="bg-gray-900 text-emerald-200 text-xs font-mono rounded-lg p-4 overflow-x-auto whitespace-pre leading-relaxed max-h-72 overflow-y-auto">
        {text || "No data"}
      </pre>
    </div>
  );
};

const BenchmarkPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [explainOpen, setExplainOpen] = useState(false);

  const loadBenchmark = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await benchmarkService.runBenchmark();
      setData(result);
    } catch (err) {
      setError(err?.message || "Failed to run benchmark.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBenchmark();
  }, []);

  const benchmarkResults = data?.benchmark_results || {};
  const summary = data?.summary || {};
  const indexing = benchmarkResults.indexing || {};
  const queryOpt = benchmarkResults.query_optimization || {};
  const concurrency = benchmarkResults.concurrency || {};
  const asyncProc = benchmarkResults.async_processing || {};

  const indexingChartData = [
    {
      name: indexing.non_indexed_field || "Non-Indexed",
      time: Number(indexing.non_indexed_time_ms) || 0,
      fast: false,
    },
    {
      name: indexing.indexed_field || "Indexed",
      time: Number(indexing.indexed_time_ms) || 0,
      fast: true,
    },
  ];

  const queryChartData = [
    {
      name: "Without select_related",
      time: Number(queryOpt.without_select_related?.time_ms) || 0,
      queryCount: Number(queryOpt.without_select_related?.query_count) || 0,
      fast: false,
    },
    {
      name: "With select_related",
      time: Number(queryOpt.with_select_related?.time_ms) || 0,
      queryCount: Number(queryOpt.with_select_related?.query_count) || 0,
      fast: true,
    },
  ];

  const concurrencyChartData = [
    {
      name: "Non-Atomic",
      time: Number(concurrency.non_atomic_time_ms) || 0,
      fast: true,
    },
    {
      name: "Atomic",
      time: Number(concurrency.atomic_time_ms) || 0,
      fast: false,
    },
  ];

  const asyncChartData = [
    {
      name: "Sync",
      time: Number(asyncProc.sync_response_time_ms) || 0,
      fast: false,
    },
    {
      name: "Async",
      time: Number(asyncProc.async_response_time_ms) || 0,
      fast: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Performance Benchmark
            </h1>
            <p className="text-gray-600">
              Live measurements comparing optimized vs. unoptimized backend
              strategies.
            </p>
          </div>
          <button
            onClick={loadBenchmark}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Running..." : "Run Benchmark"}
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">
                Failed to load benchmark
              </p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={loadBenchmark}
              className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Running benchmark suite...</p>
            <p className="text-sm text-gray-500 mt-1">
              This may take a few seconds.
            </p>
          </div>
        )}

        {/* Content */}
        {data && (
          <>
            {/* Summary Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={Database}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                label="DB Indexing Speedup"
                value={`${formatNumber(summary.indexing_speedup_factor, 2)}x`}
                suffix="faster"
              />
              <StatCard
                icon={Layers}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                label="Queries Saved"
                value={summary.queries_saved_by_select_related ?? 0}
                suffix="queries"
              />
              <StatCard
                icon={GitBranch}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                label="Concurrency Overhead"
                value={formatNumber(summary.concurrency_overhead_ms, 3)}
                suffix="ms"
              />
              <StatCard
                icon={Zap}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
                label="Async Time Saved"
                value={formatNumber(summary.async_time_saved_ms, 3)}
                suffix="ms"
              />
            </div>

            {/* Benchmark Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1 — DB Indexing */}
              <SectionCard
                icon={Database}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                title="DB Indexing"
                description={indexing.description}
              >
                <TwoBarChart data={indexingChartData} />
                <div className="mt-5">
                  <DataTable
                    rows={[
                      ["Non-Indexed Field", indexing.non_indexed_field || "-"],
                      [
                        "Non-Indexed Time",
                        formatMs(indexing.non_indexed_time_ms),
                      ],
                      ["Indexed Field", indexing.indexed_field || "-"],
                      ["Indexed Time", formatMs(indexing.indexed_time_ms)],
                      [
                        "Speedup Factor",
                        `${formatNumber(indexing.speedup_factor, 2)}x`,
                      ],
                    ]}
                  />
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => setExplainOpen((v) => !v)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {explainOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    {explainOpen ? "Hide" : "Show"} raw EXPLAIN output
                  </button>
                  {explainOpen && (
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <ExplainBlock
                        title="EXPLAIN — Non-Indexed"
                        rows={indexing.explain_non_indexed}
                      />
                      <ExplainBlock
                        title="EXPLAIN — Indexed"
                        rows={indexing.explain_indexed}
                      />
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Card 2 — Query Optimization */}
              <SectionCard
                icon={Layers}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                title="Query Optimization (N+1 vs select_related)"
                description={queryOpt.description}
              >
                <QueryOptimizationChart data={queryChartData} />
                <div className="mt-5">
                  <DataTable
                    rows={[
                      [
                        "Without select_related — Queries",
                        queryOpt.without_select_related?.query_count ?? "-",
                      ],
                      [
                        "Without select_related — Time",
                        formatMs(queryOpt.without_select_related?.time_ms),
                      ],
                      [
                        "With select_related — Queries",
                        queryOpt.with_select_related?.query_count ?? "-",
                      ],
                      [
                        "With select_related — Time",
                        formatMs(queryOpt.with_select_related?.time_ms),
                      ],
                      ["Queries Saved", queryOpt.queries_saved ?? "-"],
                      ["Time Saved", formatMs(queryOpt.time_saved_ms)],
                    ]}
                  />
                </div>
              </SectionCard>

              {/* Card 3 — Concurrency */}
              <SectionCard
                icon={GitBranch}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                title="Concurrency"
                description={concurrency.description}
              >
                <TwoBarChart data={concurrencyChartData} />
                <div className="mt-5">
                  <DataTable
                    rows={[
                      ["Subject", concurrency.subject || "-"],
                      ["Record Count", concurrency.record_count ?? "-"],
                      [
                        "Non-Atomic Time",
                        formatMs(concurrency.non_atomic_time_ms),
                      ],
                      ["Atomic Time", formatMs(concurrency.atomic_time_ms)],
                      ["Overhead", formatMs(concurrency.overhead_ms)],
                    ]}
                  />
                </div>
                {concurrency.note && (
                  <NoteCallout>{concurrency.note}</NoteCallout>
                )}
              </SectionCard>

              {/* Card 4 — Async Processing */}
              <SectionCard
                icon={Zap}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
                title="Async Processing"
                description={asyncProc.description}
              >
                <TwoBarChart data={asyncChartData} />
                <div className="mt-5">
                  <DataTable
                    rows={[
                      [
                        "Sync Response Time",
                        formatMs(asyncProc.sync_response_time_ms),
                      ],
                      [
                        "Async Response Time",
                        formatMs(asyncProc.async_response_time_ms),
                      ],
                      ["Time Saved", formatMs(asyncProc.time_saved_ms)],
                    ]}
                  />
                </div>
                {asyncProc.note && <NoteCallout>{asyncProc.note}</NoteCallout>}
              </SectionCard>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BenchmarkPage;
