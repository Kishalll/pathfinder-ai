"use client";

import React, { useEffect, useState } from "react";

const FALLBACK = {
  studentsGuided: "10k+",
  careerMatches: "94%",
  successRate: "92%",
  avgRating: "4.8",
};

const LABELS = {
  studentsGuided: "Students Guided",
  careerMatches: "Career Matches",
  successRate: "Success Rate",
  avgRating: "Avg Rating",
};

const StatCell = ({ value, label, loading }) => (
  <div className="flex flex-col items-center space-y-2">
    <h3 className="text-4xl font-bold">
      {loading ? <span className="inline-block h-8 w-24 rounded bg-slate-200 animate-pulse" /> : value}
    </h3>
    <p className="text-muted-foreground">{label}</p>
  </div>
);

export default function HeroStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch (e) {
        if (!cancelled) setStats(FALLBACK);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  // Prevent SSR/CSR mismatch by rendering a skeleton on the server
  if (!isMounted) {
    return (
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
        {Object.keys(LABELS).map((k) => (
          <StatCell key={k} loading={true} label={LABELS[k]} />
        ))}
      </div>
    );
  }

  const values = stats || FALLBACK;

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center md:grid-cols-4">
      <StatCell value={values.studentsGuided} label={LABELS.studentsGuided} loading={loading} />
      <StatCell value={values.careerMatches} label={LABELS.careerMatches} loading={loading} />
      <StatCell value={values.successRate} label={LABELS.successRate} loading={loading} />
      <StatCell value={values.avgRating} label={LABELS.avgRating} loading={loading} />
    </div>
  );
}
