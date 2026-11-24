import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import * as THREE from "three";

export interface IPhone17Pro3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Optional 0..1 progress for a specular highlight sweep across the camera plateau */
  lensFlareProgress?: number;
}

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function createBackGlassBaseCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d")!;

  // Rich satin Cosmic Orange Ceramic Shield gradient (#F77E2D -> #F77314)
  const bg = ctx.createLinearGradient(0, 0, 512, 768);
  bg.addColorStop(0, "#F98838");
  bg.addColorStop(0.5, "#F77E2D");
  bg.addColorStop(1, "#F77314");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 768);
  return canvas;
}

function createScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 1620;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#050303";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(384, 780, 30, 384, 780, 720);
  glow.addColorStop(0, "rgba(247, 115, 20, 0.42)");
  glow.addColorStop(0.55, "rgba(180, 62, 16, 0.16)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const drawTube = (
    y1: number,
    y2: number,
    cp1y: number,
    cp2y: number,
    width: number
  ) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(247, 115, 20, 0.25)";
    ctx.lineWidth = width + 28;
    ctx.beginPath();
    ctx.moveTo(-60, y1);
    ctx.bezierCurveTo(240, cp1y, 520, cp2y, canvas.width + 60, y2);
    ctx.stroke();

    const g = ctx.createLinearGradient(0, Math.min(y1, cp1y) - 60, 0, Math.max(y2, cp2y) + 60);
    g.addColorStop(0, "#2E1004");
    g.addColorStop(0.35, "#F77314");
    g.addColorStop(0.52, "#FFD2AD");
    g.addColorStop(0.7, "#D95D1E");
    g.addColorStop(1, "#1F0A02");
    ctx.strokeStyle = g;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(-60, y1);
    ctx.bezierCurveTo(240, cp1y, 520, cp2y, canvas.width + 60, y2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 240, 224, 0.72)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-60, y1 - width * 0.18);
    ctx.bezierCurveTo(
      240,
      cp1y - width * 0.18,
      520,
      cp2y - width * 0.18,
      canvas.width + 60,
      y2 - width * 0.18
    );
    ctx.stroke();
    ctx.restore();
  };

  drawTube(300, 260, 460, 140, 52);
  drawTube(660, 560, 440, 860, 64);
  drawTube(960, 1080, 1180, 780, 58);
  drawTube(1340, 1280, 1180, 1450, 48);

  // Dynamic Island
  ctx.fillStyle = "#000000";
  const pillW = 210;
  const pillH = 56;
  const pillX = (canvas.width - pillW) / 2;
  const pillY = 48;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 28);
  ctx.fill();

  ctx.fillStyle = "#162038";
  ctx.beginPath();
  ctx.arc(pillX + pillW - 36, pillY + pillH / 2, 10, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const CameraLens: React.FC<{ position: [number, number, number]; radius?: number }> = ({
  position,
  radius = 0.27,
}) => {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius * 1.05, 0.1, 64]} />
        <meshStandardMaterial
          color="#F77314"
          metalness={0.84}
          roughness={0.22}
          envMapIntensity={1.35}
        />
      </mesh>
      <mesh position={[0, 0, 0.032]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.86, radius * 0.86, 0.05, 64]} />
        <meshStandardMaterial
          color="#1E1E22"
          metalness={0.75}
          roughness={0.25}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh position={[0, 0, 0.048]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.72, radius * 0.72, 0.03, 48]} />
        <meshStandardMaterial color="#0C0C0E" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.062]}>
        <ringGeometry args={[radius * 0.28, radius * 0.58, 48]} />
        <meshPhysicalMaterial
          color="#101B38"
          metalness={0.2}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.8}
        />
      </mesh>
      <mesh position={[0, 0, 0.065]}>
        <circleGeometry args={[radius * 0.26, 48]} />
        <meshPhysicalMaterial
          color="#050812"
          metalness={0.1}
          roughness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.02}
          ior={1.77}
          reflectivity={1}
          envMapIntensity={2.2}
        />
      </mesh>
      <mesh position={[0, 0, 0.072]}>
        <circleGeometry args={[radius * 0.78, 64]} />
        <meshPhysicalMaterial
          color="#0B1020"
          transparent
          opacity={0.28}
          roughness={0.02}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.02}
          ior={1.77}
          envMapIntensity={2.4}
        />
      </mesh>
    </group>
  );
};

export const IPhone17Pro3D: React.FC<IPhone17Pro3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  lensFlareProgress = 0,
}) => {
  const [appleLogoTex, setAppleLogoTex] = useState<THREE.CanvasTexture | null>(null);
  const [handle] = useState(() => delayRender("Loading Apple logo for 3D back glass"));

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = staticFile("apple-logo.png");
    img.onload = () => {
      // Draw crisp tone-on-tone Cosmic Orange Apple logo onto transparent canvas
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext("2d")!;

      const aspect = img.width / img.height;
      const drawH = 380;
      const drawW = drawH * aspect;
      ctx.drawImage(img, (512 - drawW) / 2, (512 - drawH) / 2, drawW, drawH);

      // Tint the exact Apple logo silhouette to subtle tone-on-tone Cosmic Orange
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = "rgba(212, 82, 8, 0.55)";
      ctx.fillRect(0, 0, 512, 512);

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      setAppleLogoTex(tex);
      continueRender(handle);
    };
    img.onerror = () => {
      continueRender(handle);
    };
  }, [handle]);

  const { bodyGeo, plateauGeo, backInsetGeo, screenGeo, screenTexture, backTexture } =
    useMemo(() => {
      const W = 2.15;
      const H = 4.45;
      const D = 0.22;
      const R = 0.34;

      const bodyShape = createRoundedRectShape(W, H, R);
      const bGeo = new THREE.ExtrudeGeometry(bodyShape, {
        depth: D,
        bevelEnabled: true,
        bevelThickness: 0.032,
        bevelSize: 0.032,
        bevelSegments: 10,
        curveSegments: 28,
      });
      bGeo.center();

      const plateauShape = createRoundedRectShape(1.94, 1.18, 0.24);
      const pGeo = new THREE.ExtrudeGeometry(plateauShape, {
        depth: 0.075,
        bevelEnabled: true,
        bevelThickness: 0.022,
        bevelSize: 0.022,
        bevelSegments: 8,
        curveSegments: 24,
      });
      pGeo.center();

      const iw = 1.9;
      const ih = 2.75;
      const insetShape = createRoundedRectShape(iw, ih, 0.22);
      const iGeo = new THREE.ExtrudeGeometry(insetShape, {
        depth: 0.012,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.006,
        bevelSegments: 4,
        curveSegments: 20,
      });
      iGeo.center();
      const ipos = iGeo.attributes.position;
      const iuvs = new Float32Array(ipos.count * 2);
      for (let i = 0; i < ipos.count; i++) {
        iuvs[i * 2] = (ipos.getX(i) + iw / 2) / iw;
        iuvs[i * 2 + 1] = (ipos.getY(i) + ih / 2) / ih;
      }
      iGeo.setAttribute("uv", new THREE.BufferAttribute(iuvs, 2));

      const sw = W - 0.12;
      const sh = H - 0.12;
      const scrShape = createRoundedRectShape(sw, sh, R - 0.05);
      const sGeo = new THREE.ShapeGeometry(scrShape, 28);
      const pos = sGeo.attributes.position;
      const uvs = new Float32Array(pos.count * 2);
      for (let i = 0; i < pos.count; i++) {
        uvs[i * 2] = (pos.getX(i) + sw / 2) / sw;
        uvs[i * 2 + 1] = (pos.getY(i) + sh / 2) / sh;
      }
      sGeo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

      const bTex = new THREE.CanvasTexture(createBackGlassBaseCanvas());
      bTex.colorSpace = THREE.SRGBColorSpace;

      return {
        bodyGeo: bGeo,
        plateauGeo: pGeo,
        backInsetGeo: iGeo,
        screenGeo: sGeo,
        screenTexture: createScreenTexture(),
        backTexture: bTex,
      };
    }, []);

  const showFlare = lensFlareProgress > 0 && lensFlareProgress < 1;
  const flareX = -0.9 + lensFlareProgress * 1.8;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main Cosmic Orange Anodized Aluminum Unibody */}
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color="#F77314"
          metalness={0.82}
          roughness={0.25}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Antenna Bands */}
      <mesh position={[-1.105, 1.65, 0]}>
        <boxGeometry args={[0.015, 0.04, 0.22]} />
        <meshStandardMaterial color="#D95F0C" roughness={0.6} />
      </mesh>
      <mesh position={[1.105, 1.65, 0]}>
        <boxGeometry args={[0.015, 0.04, 0.22]} />
        <meshStandardMaterial color="#D95F0C" roughness={0.6} />
      </mesh>
      <mesh position={[-1.105, -1.65, 0]}>
        <boxGeometry args={[0.015, 0.04, 0.22]} />
        <meshStandardMaterial color="#D95F0C" roughness={0.6} />
      </mesh>
      <mesh position={[1.105, -1.65, 0]}>
        <boxGeometry args={[0.015, 0.04, 0.22]} />
        <meshStandardMaterial color="#D95F0C" roughness={0.6} />
      </mesh>

      {/* Side Buttons */}
      <mesh position={[-1.11, 1.25, 0]}>
        <boxGeometry args={[0.035, 0.18, 0.08]} />
        <meshStandardMaterial color="#F77314" metalness={0.84} roughness={0.22} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[-1.11, 0.85, 0]}>
        <boxGeometry args={[0.035, 0.34, 0.08]} />
        <meshStandardMaterial color="#F77314" metalness={0.84} roughness={0.22} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[-1.11, 0.42, 0]}>
        <boxGeometry args={[0.035, 0.34, 0.08]} />
        <meshStandardMaterial color="#F77314" metalness={0.84} roughness={0.22} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[1.11, 0.72, 0]}>
        <boxGeometry args={[0.035, 0.48, 0.08]} />
        <meshStandardMaterial color="#F77314" metalness={0.84} roughness={0.22} envMapIntensity={1.3} />
      </mesh>
      <mesh position={[1.105, -0.78, 0]}>
        <boxGeometry args={[0.025, 0.34, 0.07]} />
        <meshStandardMaterial color="#E3650E" metalness={0.7} roughness={0.28} envMapIntensity={1.2} />
      </mesh>

      {/* BACK FACE (+Z) */}
      <group position={[0, 0, 0.145]}>
        <mesh geometry={plateauGeo} position={[0, 1.52, 0.03]}>
          <meshStandardMaterial
            color="#F77314"
            metalness={0.8}
            roughness={0.24}
            envMapIntensity={1.3}
          />
        </mesh>

        <group position={[0, 1.52, 0.07]}>
          <CameraLens position={[-0.6, 0.28, 0]} radius={0.26} />
          <CameraLens position={[-0.6, -0.28, 0]} radius={0.26} />
          <CameraLens position={[-0.06, 0.0, 0]} radius={0.26} />

          <mesh position={[0.68, 0.32, 0.014]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.098, 0.098, 0.02, 32]} />
            <meshPhysicalMaterial
              color="#FFF6E5"
              emissive="#FFE7BA"
              emissiveIntensity={0.2}
              roughness={0.18}
              clearcoat={0.8}
            />
          </mesh>

          <mesh position={[0.68, 0.02, 0.014]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.02, 16]} />
            <meshStandardMaterial color="#1D1D1F" roughness={0.8} />
          </mesh>

          <mesh position={[0.68, -0.28, 0.014]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.115, 0.115, 0.02, 32]} />
            <meshPhysicalMaterial
              color="#101014"
              metalness={0.25}
              roughness={0.15}
              clearcoat={0.9}
            />
          </mesh>
        </group>

        {/* Satin Ceramic Shield Back Glass Inset */}
        <mesh geometry={backInsetGeo} position={[0, -0.58, 0.005]}>
          <meshPhysicalMaterial
            map={backTexture}
            metalness={0.12}
            roughness={0.38}
            clearcoat={0.4}
            clearcoatRoughness={0.25}
            envMapIntensity={1.05}
          />
        </mesh>

        {/* Exact Apple Logo Decal from public/apple-logo.png */}
        {appleLogoTex && (
          <mesh position={[0, -0.45, 0.019]}>
            <planeGeometry args={[0.62, 0.62]} />
            <meshStandardMaterial
              map={appleLogoTex}
              transparent
              roughness={0.28}
              metalness={0.25}
              depthWrite={false}
            />
          </mesh>
        )}

        {showFlare && (
          <pointLight
            position={[flareX, 1.52, 0.7]}
            intensity={2.4}
            distance={2.6}
            color="#FFF6EB"
          />
        )}
      </group>

      {/* FRONT FACE (-Z) — OLED Display */}
      <mesh
        geometry={screenGeo}
        position={[0, 0, -0.145]}
        rotation={[0, Math.PI, 0]}
      >
        <meshPhysicalMaterial
          map={screenTexture}
          roughness={0.06}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.4}
        />
      </mesh>
    </group>
  );
};
