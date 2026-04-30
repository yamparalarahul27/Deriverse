"use client";

import { Agentation } from "agentation";

// Dev-only wrapper around the Agentation overlay. Imported via
// next/dynamic in src/app/layout.tsx so the underlying `agentation`
// chunk is never requested in a production build.
export default function AgentationOverlay() {
  return <Agentation />;
}
