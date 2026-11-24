import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Generates a procedural Apple-keynote studio softbox environment map
 * so metallic anodized aluminum and sapphire camera glass have realistic
 * specular highlights instead of reflecting black.
 */
export const StudioEnvironment: React.FC = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color("#EFEFF2");

    // Overhead main softbox
    const topBox = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(3.5, 3.45, 3.4), side: THREE.DoubleSide })
    );
    topBox.position.set(0, 7, 0);
    topBox.rotation.x = Math.PI / 2;
    envScene.add(topBox);

    // Front-left warm key softbox
    const leftKey = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 12),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(2.8, 2.5, 2.3), side: THREE.DoubleSide })
    );
    leftKey.position.set(-7, 1.5, 5);
    leftKey.lookAt(0, 0, 0);
    envScene.add(leftKey);

    // Front-right crisp rim strip
    const rightRim = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 14),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.7, 2.9), side: THREE.DoubleSide })
    );
    rightRim.position.set(7, 1, 4);
    rightRim.lookAt(0, 0, 0);
    envScene.add(rightRim);

    // Back-top edge kicker light
    const backKicker = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 4),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.1, 2.0), side: THREE.DoubleSide })
    );
    backKicker.position.set(0, 5, -7);
    backKicker.lookAt(0, 0, 0);
    envScene.add(backKicker);

    // Warm studio bounce floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 18),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(1.3, 1.15, 1.05), side: THREE.DoubleSide })
    );
    floor.position.set(0, -7, 0);
    floor.rotation.x = -Math.PI / 2;
    envScene.add(floor);

    const renderTarget = pmrem.fromScene(envScene, 0.03);
    scene.environment = renderTarget.texture;

    return () => {
      scene.environment = null;
      renderTarget.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
};
