import React from "react";
import { socket } from "..";
import { SocketEventTypes, TVersion } from "../types";

interface IHistoryPanelProps {
  versions: TVersion[];
}

export const HistoryPanel: React.FC<IHistoryPanelProps> = ({ versions }) => {
  const sorted = [...versions].sort((a, b) => {
    const ta = new Date(a.timestamp).getTime();
    const tb = new Date(b.timestamp).getTime();
    return ta - tb;
  });

  return (
    <ul>
      {sorted.map((version, i) => (
        <li
          key={version.id}
          style={{ listStyle: "none", cursor: "pointer" }}
          onClick={() => socket.emit(SocketEventTypes.getStateAt, version.id)}
        >
          {i + 1}.{" "}
          {new Date(version.timestamp).toLocaleString("ru-RU", {
            dateStyle: "short",
            timeStyle: "medium",
          })}
        </li>
      ))}
    </ul>
  );
};
