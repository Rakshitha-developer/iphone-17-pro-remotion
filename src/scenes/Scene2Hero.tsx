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

export const Scene2Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const ease = Easing.bezier(...APPLE_EASE_OUT);

  const riseSpring = spring({
    frame,
    fps,
    config: { damping: 28, stiffness: 95, mass: 1.1 },
  });

  const phoneY = interpolate(riseSpring, [0, 1], [-2.8, 0.45]);
  const phoneRotateY = interpolate(frame, [0, 110], [0.85, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const phoneRotateX = interpolate(frame, [0, 110], [0.12, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const proX = interpolate(frame, [0, 180], [28, -28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const proOpacity = interpolate(frame, [8, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  // Floating glass callout at bottom-center in 9:16 vertical layout
  const cardSpring = spring({
    frame: Math.max(0, frame - 42),
    fps,
    config: { damping: 26, stiffness: 115, mass: 1 },
  });
  const cardY = interpolate(cardSpring, [0, 1], [44, 0]);
  const cardOpacity = interpolate(frame, [42, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineHeight = interpolate(frame, [52, 82], [0, 110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const sheenProgress = interpolate(frame, [62, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const sceneOpacity = interpolate(frame, [164, 180], [1, 0], {
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
      {/* Faint Cosmic Orange radial ambient glow */}
      <div
        style={{
          position: "absolute",
          top: 260,
          width: 860,
          height: 860,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(247, 115, 20, 0.09) 0%, rgba(247, 115, 20, 0) 68%)",
          pointerEvents: "none",
        }}
      />

      {/* Large background kinetic typography */}
      <div
        style={{
          position: "absolute",
          top: 520,
          fontSize: 340,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: COLORS.kineticGray,
          opacity: proOpacity,
          transform: `translateX(${proX}px)`,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        Pro.
      </div>

      {/* 3D Hero Device */}
      <AbsoluteFill>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ position: [0, 0, 9.6], fov: 36 }}
        >
          <StudioEnvironment />
          <ambientLight intensity={1.1} />
          <directionalLight position={[4, 6, 6]} intensity={2.0} color="#FFF8F2" />
          <directionalLight position={[-5, -2, 4]} intensity={1.0} color="#FFE4D1" />
          <directionalLight position={[0, 4, -5]} intensity={1.0} color="#FFFFFF" />
          <IPhone17Pro3D
            position={[0, phoneY, 0]}
            rotation={[phoneRotateX, phoneRotateY, 0]}
            scale={0.88}
          />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* Bottom Callout Card + Vertical Hairline Connector */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {lineHeight > 10 && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: COLORS.primaryInk,
                boxShadow: "0 0 0 4px rgba(247, 115, 20, 0.25)",
              }}
            />
          )}
          <div
            style={{
              width: 1.5,
              height: lineHeight,
              background:
                "linear-gradient(180deg, rgba(29,29,31,0.65) 0%, rgba(29,29,31,0.35) 100%)",
            }}
          />
        </div>

        <GlassCard
          borderRadius={26}
          padding="28px 40px"
          sheenProgress={sheenProgress}
          style={{ width: 640, textAlign: "center" }}
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
            Design
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: COLORS.primaryInk,
              lineHeight: 1.15,
            }}
          >
            Aluminum Unibody
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: COLORS.secondaryInk,
              marginTop: 6,
            }}
          >
            Ceramic Shield 2
          </div>
        </GlassCard>
      </div>
    </AbsoluteFill>
  );
};
