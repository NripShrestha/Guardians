import { useMission } from "./MissionContext";

export default function MissionDebugger() {
  const { mission } = useMission();

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        padding: "8px 12px",
        background: "rgba(0,0,0,0.7)",
        color: "#0f0",
        fontFamily: "monospace",
        zIndex: 9999,
      }}
    >
      <div>Mission: {mission.id}</div>
      <div>Stage: {mission.stage}</div>
      <div>Result: {mission.result ?? "-"}</div>
    </div>
  );
}
