import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GlassCard } from "../components/GlassCard";
import { APPLE_EASE_OUT, APPLE_FONT_STACK, COLORS } from "../theme";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ease = Easing.bezier(...APPLE_EASE_OUT);

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 28, stiffness: 120, mass: 1 },
  });

  const logoFade = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const logoGlideUp = interpolate(frame, [32, 62], [0, -110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const logoScale =
    interpolate(logoEntrance, [0, 1], [0.85, 1.0]) *
    interpolate(frame, [32, 62], [1.0, 0.76], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease,
    });

  const titleY = interpolate(frame, [38, 68], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const titleOpacity = interpolate(frame, [38, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeSpring = spring({
    frame: Math.max(0, frame - 54),
    fps,
    config: { damping: 26, stiffness: 130, mass: 0.9 },
  });

  const badgeY = interpolate(badgeSpring, [0, 1], [28, 0]);
  const badgeOpacity = interpolate(frame, [54, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sheenProgress = interpolate(frame, [66, 98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const sceneOpacity = interpolate(frame, [104, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.studioBg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: APPLE_FONT_STACK,
        opacity: sceneOpacity,
      }}
    >
      {/* Subtle Cosmic Orange radial ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 820,
          height: 820,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(247, 115, 20, 0.08) 0%, rgba(247, 115, 20, 0) 68%)",
          pointerEvents: "none",
        }}
      />

      {/* Apple Logo */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: logoFade,
          transform: `translateY(${logoGlideUp}px) scale(${logoScale})`,
        }}
      >
        <Img
          src={staticFile("apple-logo.png")}
          style={{
            width: 88,
            height: 88,
            objectFit: "contain",
            filter: "brightness(0) saturate(100%)",
          }}
        />
      </div>

      {/* Masked Title & Frosted Pill */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 110,
          gap: 28,
        }}
      >
        <div style={{ overflow: "hidden", padding: "4px 12px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 82,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: COLORS.primaryInk,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            iPhone 17 Pro
          </h1>
        </div>

        <div
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
          }}
        >
          <GlassCard
            borderRadius={999}
            padding="14px 32px"
            sheenProgress={sheenProgress}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #F98B3E 0%, #F77314 65%, #D95F0C 100%)",
                  boxShadow: "0 0 12px rgba(247, 115, 20, 0.45)",
                }}
              />
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  color: COLORS.primaryInk,
                }}
              >
                Cosmic Orange
              </span>
            </div>
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};
