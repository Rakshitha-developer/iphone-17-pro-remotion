#!/usr/bin/env bash
set -e

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FFMPEG="./node_modules/ffmpeg-static/ffmpeg"

echo "1/2 Rendering 900 PNG frames..."
npx remotion render MainVideo out/frames \
  --sequence \
  --image-format=png \
  --browser-executable="$CHROME"

echo "2/2 Stitching frames + synchronized SFX into MP4..."
"$FFMPEG" -y \
  -framerate 30 -i out/frames/element-%03d.png \
  -itsoffset 0.000 -i public/sfx/intro-chime.wav \
  -itsoffset 4.000 -i public/sfx/whoosh-hero.wav \
  -itsoffset 10.000 -i public/sfx/zoom-camera.wav \
  -itsoffset 11.833 -i public/sfx/lens-shimmer.wav \
  -itsoffset 17.000 -i public/sfx/whoosh-hero.wav \
  -itsoffset 17.933 -i public/sfx/pop-tick.wav \
  -itsoffset 18.333 -i public/sfx/pop-tick.wav \
  -itsoffset 18.733 -i public/sfx/pop-tick.wav \
  -itsoffset 24.000 -i public/sfx/finale-resolve.wav \
  -filter_complex "[1:a]volume=0.55[a1];[2:a]volume=0.60[a2];[3:a]volume=0.68[a3];[4:a]volume=0.42[a4];[5:a]volume=0.48[a5];[6:a]volume=0.40[a6];[7:a]volume=0.40[a7];[8:a]volume=0.40[a8];[9:a]volume=0.62[a9];[a1][a2][a3][a4][a5][a6][a7][a8][a9]amix=inputs=9:duration=longest:normalize=0[aout]" \
  -map 0:v -map "[aout]" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest \
  out/iphone-17-pro-cosmic-orange.mp4

echo "Done! Video saved to out/iphone-17-pro-cosmic-orange.mp4"
