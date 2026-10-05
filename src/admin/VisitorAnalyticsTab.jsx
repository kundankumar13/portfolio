import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaEye,
  FaUsers,
  FaCalendarDay,
  FaLaptop,
  FaMobileScreen,
  FaGlobe,
  FaArrowRotateRight,
  FaTrash,
  FaGoogle,
  FaChrome,
  FaCheck,
  FaShieldHalved,
  FaArrowUpRightFromSquare,
  FaCircleQuestion
} from "react-icons/fa6";
import { getVisitorAnalytics, resetVisitorAnalytics } from "../utils/visitorTracker";
import { getGAMeasurementId, saveGAMeasurementId, isGAConfigured } from "../utils/googleAnalytics";

export default function VisitorAnalyticsTab({ triggerSaveNotification }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Google Analytics ID State
  const [gaId, setGaId] = useState("");
  const [isGaActive, setIsGaActive] = useState(false);
  const [gaSaving, setGaSaving] = useState(false);

  const fetchStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const data = await getVisitorAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load visitor stats:", err);
    } finally {
      setLoading(false);
      if (isManualRefresh) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchStats();
    const currentGaId = getGAMeasurementId();
    setGaId(currentGaId || "");
    setIsGaActive(isGAConfigured());
  }, []);

  const handleSaveGA = (e) => {
    e.preventDefault();
    setGaSaving(true);
    const cleaned = (gaId || "").trim();

    if (cleaned && !cleaned.startsWith("G-") && !cleaned.startsWith("UA-")) {
      alert("Invalid Measurement ID. A standard Google Analytics 4 ID starts with 'G-' (e.g. G-ABC123XYZ)");
      setGaSaving(false);
      return;
    }

    const success = saveGAMeasurementId(cleaned);
    if (success) {
      setIsGaActive(Boolean(cleaned));
      if (triggerSaveNotification) {
        triggerSaveNotification(
          cleaned ? "Google Analytics connected successfully!" : "Google Analytics ID cleared."
        );
      }
    }
    setGaSaving(false);
  };

  const handleReset = async () => {
    await resetVisitorAnalytics();
    setShowResetModal(false);
    fetchStats(true);
    if (triggerSaveNotification) {
      triggerSaveNotification("Visitor statistics have been reset.");
    }
  };

  // Helper to format timestamps relative or readable
  const formatTime = (isoStr) => {
    if (!isoStr) return "Just now";
    try {
      const date = new Date(isoStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "Recently";
    }
  };

  // Calculate Last 7 Days Data for Bar Chart
  const getWeeklyTrend = () => {
    const days = [];
    const daily = (analytics && analytics.dailyVisits) || {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const count = daily[dateStr] || 0;

      const dayName = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
      const displayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      days.push({ dateStr, dayName, displayDate, count });
    }

    const maxCount = Math.max(...days.map((d) => d.count), 5); // Minimum scale of 5 for nice visual
    return { days, maxCount };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
        <FaArrowRotateRight className="animate-spin text-3xl text-[#1cd8d2]" />
        <p className="text-sm">Loading visitor analytics...</p>
      </div>
    );
  }

  const { days, maxCount } = getWeeklyTrend();
  const totalViews = analytics?.totalViews || 0;
  const uniqueVisitors = analytics?.uniqueVisitors || 0;
  const todayViews = analytics?.todayViews || 0;

  const devices = analytics?.devices || { desktop: 0, mobile: 0, tablet: 0 };
  const deviceTotal = (devices.desktop || 0) + (devices.mobile || 0) + (devices.tablet || 0) || 1;
  const desktopPct = Math.round(((devices.desktop || 0) / deviceTotal) * 100);
  const mobilePct = Math.round(((devices.mobile || 0) / deviceTotal) * 100);
  const tabletPct = Math.max(0, 100 - desktopPct - mobilePct);

  const browsers = analytics?.browsers || { chrome: 0, safari: 0, firefox: 0, edge: 0, other: 0 };
  const browserTotal =
    (browsers.chrome || 0) +
      (browsers.safari || 0) +
      (browsers.firefox || 0) +
      (browsers.edge || 0) +
      (browsers.other || 0) || 1;

  const recentVisits = analytics?.recentVisits || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Visitor Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Tracking Active
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-gray-400 border border-white/10 items-center gap-1">
              <FaShieldHalved className="text-xs" /> 100% Private (Admin Only)
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Monitor how many people are visiting your portfolio, their devices, and integrate Google Analytics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition flex items-center gap-2 cursor-pointer active:scale-95"
            title="Refresh analytics data"
          >
            <FaArrowRotateRight className={refreshing ? "animate-spin text-[#1cd8d2]" : ""} />
            <span>{refreshing ? "Updating..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition flex items-center gap-1.5 cursor-pointer"
            title="Reset counts for testing"
          >
            <FaTrash className="text-xs" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Hero Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-cyan-300">Total Page Views</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
              <FaEye className="text-base" />
            </div>
          </div>
          <div className="text-3xl font-extrabold mt-3 text-white tracking-tight">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Total hits on your portfolio</p>
        </div>

        {/* Unique Visitors */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-300">Unique Visitors</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
              <FaUsers className="text-base" />
            </div>
          </div>
          <div className="text-3xl font-extrabold mt-3 text-white tracking-tight">
            {uniqueVisitors.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Real distinct individuals reached</p>
        </div>

        {/* Today's Visits */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300">Today's Visits</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm shadow-purple-500/20">
              <FaCalendarDay className="text-base" />
            </div>
          </div>
          <div className="text-3xl font-extrabold mt-3 text-white tracking-tight">
            {todayViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Recorded today ({new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })})</p>
        </div>

        {/* Platform Share */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300">Dominant Device</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/20">
              {mobilePct >= desktopPct ? <FaMobileScreen className="text-base" /> : <FaLaptop className="text-base" />}
            </div>
          </div>
          <div className="text-2xl font-extrabold mt-3 text-white tracking-tight">
            {mobilePct >= desktopPct ? `${mobilePct}% Mobile` : `${desktopPct}% Desktop`}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {desktopPct}% Desktop • {mobilePct}% Mobile
          </p>
        </div>
      </div>

      {/* 7-Day Activity Trend Bar Chart */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FaChartLine className="text-[#1cd8d2]" />
              7-Day Traffic Trend
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Website visits over the past 7 days</p>
          </div>
          <span className="text-xs text-gray-400">Total 7-day visits: {days.reduce((acc, d) => acc + d.count, 0)}</span>
        </div>

        {/* Chart Bars */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end pt-6 pb-2 px-2 border-b border-white/10">
          {days.map((day, idx) => {
            const heightPct = Math.max(12, Math.round((day.count / maxCount) * 100));
            const isToday = day.dayName === "Today";

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                {/* Count tooltip on top */}
                <span
                  className={`text-[11px] font-bold mb-1 transition-transform group-hover:scale-110 ${
                    day.count > 0 ? (isToday ? "text-[#1cd8d2]" : "text-white") : "text-gray-500"
                  }`}
                >
                  {day.count}
                </span>

                {/* Animated Bar */}
                <div className="w-full max-w-[42px] bg-white/[0.04] rounded-t-lg h-full flex items-end overflow-hidden p-0.5">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t transition-all duration-700 ease-out group-hover:opacity-90 ${
                      isToday
                        ? "bg-gradient-to-t from-[#00bf8f] to-[#1cd8d2] shadow-lg shadow-[#00bf8f]/20"
                        : day.count > 0
                        ? "bg-gradient-to-t from-blue-600/80 to-cyan-400/90"
                        : "bg-white/10"
                    }`}
                  ></div>
                </div>

                {/* Day Labels */}
                <div className="text-center mt-2">
                  <p className={`text-xs font-semibold ${isToday ? "text-[#1cd8d2]" : "text-gray-300"}`}>
                    {day.dayName}
                  </p>
                  <p className="text-[10px] text-gray-500">{day.displayDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Grid: Device & Browser Distribution + Google Analytics Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Device & Browser Distribution */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <FaGlobe className="text-[#1cd8d2]" />
              Visitor Breakdown
            </h2>
            <p className="text-xs text-gray-400 mb-6">Devices and browsers used by your visitors</p>

            {/* Devices Section */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs font-medium text-gray-300">
                <span>Devices</span>
                <span>Hits & Ratio</span>
              </div>

              {/* Desktop Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-2 text-white">
                    <FaLaptop className="text-cyan-400" /> Desktop
                  </span>
                  <span>{devices.desktop || 0} visits ({desktopPct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div style={{ width: `${desktopPct}%` }} className="h-full bg-cyan-400 rounded-full transition-all duration-500"></div>
                </div>
              </div>

              {/* Mobile Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-2 text-white">
                    <FaMobileScreen className="text-emerald-400" /> Mobile
                  </span>
                  <span>{devices.mobile || 0} visits ({mobilePct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div style={{ width: `${mobilePct}%` }} className="h-full bg-emerald-400 rounded-full transition-all duration-500"></div>
                </div>
              </div>

              {/* Tablet Bar */}
              {tabletPct > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-2 text-white">
                      <FaGlobe className="text-purple-400" /> Tablet
                    </span>
                    <span>{devices.tablet || 0} visits ({tabletPct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div style={{ width: `${tabletPct}%` }} className="h-full bg-purple-400 rounded-full transition-all duration-500"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Browsers Section */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <span className="text-xs font-medium text-gray-300">Top Browsers</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: "Chrome", count: browsers.chrome || 0, color: "text-amber-400" },
                  { name: "Safari", count: browsers.safari || 0, color: "text-cyan-400" },
                  { name: "Firefox", count: browsers.firefox || 0, color: "text-orange-400" },
                  { name: "Edge", count: browsers.edge || 0, color: "text-blue-400" },
                  { name: "Other", count: browsers.other || 0, color: "text-gray-400" }
                ].map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="flex items-center gap-1.5 text-gray-300">
                      <FaChrome className={b.color} /> {b.name}
                    </span>
                    <span className="font-semibold text-white">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Google Analytics (GA4) Integration */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1cd8d2]/10 via-black/40 to-black/60 border border-[#1cd8d2]/30 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-amber-400">
                  <FaGoogle className="text-base" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Google Analytics 4 (GA4)</h2>
                  <p className="text-xs text-gray-400">World-class detailed traffic analytics</p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  isGaActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isGaActive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
                {isGaActive ? "Connected & Active" : "Setup Ready"}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Google Analytics gives you in-depth demographic statistics (cities, countries, real-time live visitors, user retention, and bounce rates).
            </p>

            {/* Measurement ID Form */}
            <form onSubmit={handleSaveGA} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  GA4 Measurement ID (Tracking ID)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gaId}
                    onChange={(e) => setGaId(e.target.value)}
                    placeholder="e.g. G-ABC123XYZ"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-sm text-white focus:outline-none focus:border-[#1cd8d2] font-mono placeholder:text-gray-600"
                  />
                  <button
                    type="submit"
                    disabled={gaSaving}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00bf8f] to-[#1cd8d2] text-black font-bold text-xs hover:opacity-90 transition active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    {gaSaving ? "Saving..." : isGaActive ? "Update ID" : "Connect"}
                  </button>
                </div>
              </div>
            </form>

            {/* Direct Google Analytics Link */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1cd8d2] hover:underline"
              >
                <span>Open Google Analytics Console</span>
                <FaArrowUpRightFromSquare className="text-[10px]" />
              </a>

              {gaId && (
                <button
                  type="button"
                  onClick={() => {
                    setGaId("");
                    saveGAMeasurementId("");
                    setIsGaActive(false);
                    if (triggerSaveNotification) triggerSaveNotification("Google Analytics ID removed.");
                  }}
                  className="text-xs text-red-400 hover:text-red-300 text-left sm:text-right"
                >
                  Disconnect GA
                </button>
              )}
            </div>

            {/* Quick 3-Step Setup Guide */}
            <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-400 space-y-1">
              <div className="font-semibold text-gray-300 flex items-center gap-1">
                <FaCircleQuestion className="text-cyan-400" /> How to get your free GA4 Measurement ID:
              </div>
              <ol className="list-decimal list-inside space-y-0.5 pl-1 text-gray-400">
                <li>Go to <strong className="text-white">analytics.google.com</strong> and click "Create Property".</li>
                <li>Choose "Web" stream and enter your website URL.</li>
                <li>Copy the <strong className="text-white">Measurement ID</strong> (format: <code className="text-[#1cd8d2]">G-XXXXXXXXXX</code>) and paste it above!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Visitors Log Table */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FaUsers className="text-[#1cd8d2]" />
              Recent Visitors Log
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest real-time visits to your portfolio</p>
          </div>
          <span className="text-xs text-gray-400">{recentVisits.length} recorded</span>
        </div>

        {recentVisits.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">
            No visitor history recorded yet. Share your website URL with friends or recruiters to see live logs!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-2.5 px-3 font-semibold">Time</th>
                  <th className="py-2.5 px-3 font-semibold">Device & OS</th>
                  <th className="py-2.5 px-3 font-semibold">Browser</th>
                  <th className="py-2.5 px-3 font-semibold">Traffic Source</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentVisits.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-3 text-gray-300 font-medium whitespace-nowrap">
                      {formatTime(item.timestamp)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-200">
                        {item.device === "Mobile" ? (
                          <FaMobileScreen className="text-emerald-400" />
                        ) : (
                          <FaLaptop className="text-cyan-400" />
                        )}
                        <span>{item.device}</span>
                        {item.os && <span className="text-gray-400 font-normal">({item.os})</span>}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <FaChrome className="text-gray-400" />
                        {item.browser || "Standard Browser"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          item.referrer === "Google"
                            ? "bg-red-500/10 text-red-300 border border-red-500/20"
                            : item.referrer === "LinkedIn"
                            ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                            : item.referrer === "GitHub"
                            ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                            : "bg-white/5 text-gray-400 border border-white/10"
                        }`}
                      >
                        {item.referrer || "Direct"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-gray-400">
                      {item.path || "/"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/10 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Reset Visitor Stats?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              This will reset the total views, unique visitors, and recent log history back to zero. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
