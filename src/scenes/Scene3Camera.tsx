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

export const Scene3Camera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const ease = Easing.bezier(...APPLE_EASE_OUT);

  // Smooth 3D zoom and pan into upper-left triple-camera plateau in upper half of 9:16 frame
  const zoomScale = interpolate(frame, [0, 80], [0.88, 1.38], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const panX = interpolate(frame, [0, 80], [0, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const panY = interpolate(frame, [0, 80], [0.35, -0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const rotY = interpolate(frame, [0, 90], [0.2, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const sceneFadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lensFlareProgress = interpolate(frame, [55, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  // Staggered glass cards in the lower half of the 9:16 frame
  const card1Spring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 26, stiffness: 115, mass: 1 },
  });
  const card1Y = interpolate(card1Spring, [0, 1], [36, 0]);
  const card1Opacity = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const card2Spring = spring({
    frame: Math.max(0, frame - 64),
    fps,
    config: { damping: 26, stiffness: 115, mass: 1 },
  });
  const card2Y = interpolate(card2Spring, [0, 1], [44, 0]);
  const card2Opacity = interpolate(frame, [64, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardsParallaxY = interpolate(frame, [40, 210], [8, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sheen1 = interpolate(frame, [58, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const sheen2 = interpolate(frame, [82, 116], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

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
      {/* Subtle Cosmic Orange radial ambient glow */}
      <div
        style={{
          position: "absolute",
          top: 180,
          width: 780,
          height: 780,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(247, 115, 20, 0.08) 0%, rgba(247, 115, 20, 0) 68%)",
          pointerEvents: "none",
        }}
      />

      {/* 3D Camera Plateau Close-up */}
      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 8.8], fov: 35 }}
        >
          <StudioEnvironment />
          <ambientLight intensity={1.15} />
          <directionalLight position={[4, 6, 6]} intensity={2.2} color="#FFF8F2" />
          <directionalLight position={[-4, 2, 5]} intensity={1.1} color="#FFE4D1" />
          <IPhone17Pro3D
            position={[panX, panY, 0]}
            rotation={[0.08, rotY, 0]}
            scale={zoomScale}
            lensFlareProgress={lensFlareProgress}
          />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* Bottom Staggered Glassmorphism Camera Cards */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: 820,
          transform: `translateY(${cardsParallaxY}px)`,
        }}
      >
        <div
          style={{
            opacity: card1Opacity,
            transform: `translateY(${card1Y}px)`,
          }}
        >
          <GlassCard
            borderRadius={26}
            padding="28px 36px"
            sheenProgress={sheen1}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: COLORS.cosmicOrange,
                marginBottom: 8,
              }}
            >
              Pro Camera System
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: COLORS.primaryInk,
                lineHeight: 1.15,
              }}
            >
              48MP Pro Fusion
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: COLORS.secondaryInk,
                marginTop: 8,
              }}
            >
              Main • Ultra Wide • Telephoto
            </div>
          </GlassCard>
        </div>

        <div
          style={{
            opacity: card2Opacity,
            transform: `translateY(${card2Y}px)`,
          }}
        >
          <GlassCard
            borderRadius={26}
            padding="28px 36px"
            sheenProgress={sheen2}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: COLORS.cosmicOrange,
                marginBottom: 8,
              }}
            >
              Telephoto Reach
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: COLORS.primaryInk,
                lineHeight: 1.15,
              }}
            >
              16x Optical-Quality Zoom
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: COLORS.secondaryInk,
                marginTop: 8,
              }}
            >
              Up to 8x Telephoto
            </div>
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};
