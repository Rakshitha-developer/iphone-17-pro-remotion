import React from "react";
import { AbsoluteFill, Audio, Series, Sequence, staticFile } from "remotion";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Hero } from "./scenes/Scene2Hero";
import { Scene3Camera } from "./scenes/Scene3Camera";
import { Scene4Specs } from "./scenes/Scene4Specs";
import { Scene5Finale } from "./scenes/Scene5Finale";
import { COLORS } from "./theme";

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.studioBg }}>
      {/* Visual Timeline */}
      <Series>
        {/* Scene 1: Minimalist Hook & Logo Reveal (Frames 0-120 | 0s-4s) */}
        <Series.Sequence durationInFrames={120}>
          <Scene1Intro />
        </Series.Sequence>

        {/* Scene 2: Hero Device Entrance (Frames 120-300 | 4s-10s) */}
        <Series.Sequence durationInFrames={180}>
          <Scene2Hero />
        </Series.Sequence>

        {/* Scene 3: Camera System Showcase (Frames 300-510 | 10s-17s) */}
        <Series.Sequence durationInFrames={210}>
          <Scene3Camera />
        </Series.Sequence>

        {/* Scene 4: Performance & Display Callouts (Frames 510-720 | 17s-24s) */}
        <Series.Sequence durationInFrames={210}>
          <Scene4Specs />
        </Series.Sequence>

        {/* Scene 5: Iconic Apple Finale & Lockup (Frames 720-900 | 24s-30s) */}
        <Series.Sequence durationInFrames={180}>
          <Scene5Finale />
        </Series.Sequence>
      </Series>

      {/* Sound Effects Track */}
      <Sequence from={0} durationInFrames={90}>
        <Audio src={staticFile("sfx/intro-chime.wav")} volume={0.55} />
      </Sequence>
      <Sequence from={120} durationInFrames={50}>
        <Audio src={staticFile("sfx/whoosh-hero.wav")} volume={0.6} />
      </Sequence>
      <Sequence from={300} durationInFrames={60}>
        <Audio src={staticFile("sfx/zoom-camera.wav")} volume={0.68} />
      </Sequence>
      <Sequence from={355} durationInFrames={40}>
        <Audio src={staticFile("sfx/lens-shimmer.wav")} volume={0.42} />
      </Sequence>
      <Sequence from={510} durationInFrames={50}>
        <Audio src={staticFile("sfx/whoosh-hero.wav")} volume={0.48} />
      </Sequence>
      {/* Staggered UI glass card ticks */}
      <Sequence from={538} durationInFrames={15}>
        <Audio src={staticFile("sfx/pop-tick.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={550} durationInFrames={15}>
        <Audio src={staticFile("sfx/pop-tick.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={562} durationInFrames={15}>
        <Audio src={staticFile("sfx/pop-tick.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={720} durationInFrames={120}>
        <Audio src={staticFile("sfx/finale-resolve.wav")} volume={0.62} />
      </Sequence>
    </AbsoluteFill>
  );
};
