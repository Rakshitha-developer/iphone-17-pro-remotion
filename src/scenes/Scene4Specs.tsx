import React from "react";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GlassCard } from "../components/GlassCard";
import { IPhone17Pro3D } from "../components/IPhone17Pro3D";
import { StudioEnvironment } from "../components/StudioEnvironment";
import { APPLE_EASE_OUT, APPLE_FONT_STACK, COLORS } from "../theme";

const SPECS = [
  {
    title: "A19 Pro Chip",
    subtitle: "6-Core GPU with Neural Accelerators",
  },
  {
    title: "6.3″ Super Retina XDR",
    subtitle: "ProMotion up to 120Hz",
  },
  {
    title: "3,000 Nits",
    subtitle: "Peak Outdoor Brightness",
  },
];

export const Scene4Specs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const ease = Easing.bezier(...APPLE_EASE_OUT);

  // Position 3D phone cleanly in upper half of 9:16 frame, rotating to front OLED display
  const phoneScale = interpolate(frame, [0, 55], [0.92, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const phoneY = interpolate(frame, [0, 55], [0.3, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const phoneRotateY = interpolate(frame, [0, 65], [0.3, Math.PI - 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const sceneFadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle pulsing Cosmic Orange ambient glow behind glass cards (6% - 10% opacity)
  const glowPulse =
    0.06 + 0.04 * (0.5 + 0.5 * Math.sin((frame / 45) * Math.PI));

  const sceneOpacity = interpolate(frame, [194, 210], [1, 0], {
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
        opacity: sceneFadeIn * sceneOpacity,
      }}
    >
      {/* Warm Cosmic Orange ambient glow pulsing gently behind the glass cards */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          width: 820,
          height: 820,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(247, 115, 20, ${glowPulse.toFixed(
            3
          )}) 0%, rgba(247, 115, 20, 0) 68%)`,
          pointerEvents: "none",
        }}
      />

      {/* 3D Device Rotating to Display Front Screen */}
      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 9.8], fov: 36 }}
        >
          <StudioEnvironment />
          <ambientLight intensity={1.15} />
          <directionalLight position={[4, 6, 6]} intensity={2.0} color="#FFF8F2" />
          <directionalLight position={[-5, 2, 5]} intensity={1.2} color="#FFE4D1" />
          <IPhone17Pro3D
            position={[0, phoneY, 0]}
            rotation={[0.04, phoneRotateY, 0]}
            scale={phoneScale}
          />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* Three Stacked Glassmorphism Spec Pills in Lower Half */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: 820,
        }}
      >
        {SPECS.map((spec, index) => {
          const delay = 28 + index * 12;
          const cardSpring = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 26, stiffness: 120, mass: 0.95 },
          });

          const translateY = interpolate(cardSpring, [0, 1], [44, 0]);
          const opacity = interpolate(frame, [delay, delay + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const sheen = interpolate(frame, [delay + 18, delay + 52], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease,
          });

          return (
            <div
              key={spec.title}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              <GlassCard
                borderRadius={26}
                padding="24px 34px"
                sheenProgress={sheen}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                    color: COLORS.primaryInk,
                    lineHeight: 1.15,
                  }}
                >
                  {spec.title}
                </div>
                <div
                  style={{
                    fontSize: 21,
                    fontWeight: 400,
                    color: COLORS.secondaryInk,
                    marginTop: 6,
                  }}
                >
                  {spec.subtitle}
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
