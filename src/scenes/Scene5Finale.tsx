import React from "react";
import { ThreeCanvas } from "@remotion/three";
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
import { IPhone17Pro3D } from "../components/IPhone17Pro3D";
import { StudioEnvironment } from "../components/StudioEnvironment";
import { APPLE_EASE_OUT, APPLE_FONT_STACK, COLORS } from "../theme";

export const Scene5Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const ease = Easing.bezier(...APPLE_EASE_OUT);

  const phoneSpring = spring({
    frame,
    fps,
    config: { damping: 28, stiffness: 100, mass: 1 },
  });

  const lockupScale = interpolate(phoneSpring, [0, 1], [0.68, 0.76]);
  const phoneOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gentleDriftY = interpolate(frame, [0, 135], [1.02, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const titleY = interpolate(frame, [16, 48], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const titleOpacity = interpolate(frame, [16, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [28, 60], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const subtitleOpacity = interpolate(frame, [28, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaSpring = spring({
    frame: Math.max(0, frame - 46),
    fps,
    config: { damping: 26, stiffness: 115, mass: 0.95 },
  });
  const ctaY = interpolate(ctaSpring, [0, 1], [32, 0]);
  const ctaOpacity = interpolate(frame, [46, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sheen = interpolate(frame, [72, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const finalFade = interpolate(frame, [165, 180], [1, 0], {
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
        opacity: finalFade,
      }}
    >
      {/* Faint Cosmic Orange radial ambient glow */}
      <div
        style={{
          position: "absolute",
          top: 240,
          width: 820,
          height: 820,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(247, 115, 20, 0.08) 0%, rgba(247, 115, 20, 0) 68%)",
          pointerEvents: "none",
        }}
      />

      {/* 3D Dual Device Lockup in Upper Half */}
      <AbsoluteFill style={{ opacity: phoneOpacity }}>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 10.0], fov: 36 }}
        >
          <StudioEnvironment />
          <ambientLight intensity={1.15} />
          <directionalLight position={[4, 6, 6]} intensity={2.0} color="#FFF8F2" />
          <directionalLight position={[-5, 2, 5]} intensity={1.1} color="#FFE4D1" />

          <IPhone17Pro3D
            position={[0.55, gentleDriftY, -0.45]}
            rotation={[0.02, Math.PI - 0.12, 0]}
            scale={lockupScale * 0.97}
          />
          <IPhone17Pro3D
            position={[-0.45, gentleDriftY, 0.2]}
            rotation={[0.02, 0.12, 0]}
            scale={lockupScale}
          />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* Bottom Centered Editorial Lockup & Frosted Glass CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: 880,
        }}
      >
        <div style={{ overflow: "hidden", paddingBottom: 6 }}>
          <h2
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
          </h2>
        </div>

        <div style={{ overflow: "hidden", marginTop: 14 }}>
          <p
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              color: COLORS.secondaryInk,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
            }}
          >
            Power. Precision. Cosmic Orange.
          </p>
        </div>

        <div
          style={{
            marginTop: 40,
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <GlassCard
            borderRadius={28}
            padding="22px 36px"
            sheenProgress={sheen}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Img
                src={staticFile("apple-logo.png")}
                style={{
                  width: 34,
                  height: 34,
                  objectFit: "contain",
                  filter: "brightness(0) saturate(100%)",
                }}
              />
              <div
                style={{
                  width: 1,
                  height: 32,
                  backgroundColor: "rgba(29, 29, 31, 0.16)",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "-0.015em",
                    color: COLORS.primaryInk,
                  }}
                >
                  Available Now
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: COLORS.secondaryInk,
                    marginTop: 2,
                  }}
                >
                  Think Different.
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};
