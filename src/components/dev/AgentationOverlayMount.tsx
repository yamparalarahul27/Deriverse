"use client";

import dynamic from "next/dynamic";

const AgentationOverlay =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/components/dev/AgentationOverlay"), {
        ssr: false,
      })
    : null;

export default function AgentationOverlayMount() {
  return AgentationOverlay ? <AgentationOverlay /> : null;
}
