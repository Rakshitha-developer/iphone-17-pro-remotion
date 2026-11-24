import React from "react";
import { APPLE_FONT_STACK } from "../theme";

export interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  borderRadius?: number;
  padding?: string;
  /** Optional 0..1 progress for a subtle specular light-sweep across the glass */
  sheenProgress?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  borderRadius = 24,
  padding = "22px 28px",
  sheenProgress,
}) => {
  const showSheen =
    typeof sheenProgress === "number" &&
    sheenProgress > 0 &&
    sheenProgress < 1;

  const sheenLeft = showSheen ? -40 + sheenProgress * 180 : -100;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        fontFamily: APPLE_FONT_STACK,
        background: "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.75)",
        borderRadius,
        padding,
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 20px 50px rgba(0, 0, 0, 0.08)",
        ...style,
      }}
    >
      {showSheen && (
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: `${sheenLeft}%`,
            width: "45%",
            height: "140%",
            background:
              "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-18deg)",
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};
