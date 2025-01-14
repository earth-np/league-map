import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Terrain = () => {
  const texture = useTexture('/public/terrain_z1.jpg');
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(100, 100, 256, 256);
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const Marker = ({ position, listener }: {
  position: [number, number, number], listener: THREE.AudioListener | null

}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const soundRef = useRef<THREE.Audio | null>(null);

  const handlePointerOver = () => {
    console.log("🚀 ~ React.useEffect ~ listener:", listener)
    soundRef.current?.play();
    setIsHovered(true)
  };
  const handlePointerOut = () => setIsHovered(false);
  const colorMap = useLoader(THREE.TextureLoader, '/public/noxus.png')
  const hoverColorMap = useLoader(THREE.TextureLoader, '/public/noxus-hover.png')





  return (
    <mesh
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={() => {
      console.log("🚀 ~ React.useEffect ~ listener:", listener)
      const sound = new THREE.Audio(listener);
      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load('/public/sfx-ui-hover-regions-01.mp3', function (buffer: unknown) {
        sound.setBuffer(buffer);
        sound.setVolume(0.5);
        sound.play();
      });
      soundRef.current = sound;
      }}
    >
      <sphereGeometry args={[2, 32, 64]} />
      <meshStandardMaterial
      map={isHovered ? hoverColorMap : colorMap}
      />
      {isHovered && (
      <>
        <mesh>
        <sphereGeometry args={[2.1, 32, 64]} />
        <meshBasicMaterial color="white" wireframe />
        </mesh>
        <mesh>
        <sphereGeometry args={[2.2, 32, 64]} />
        <meshBasicMaterial color="black" transparent opacity={0.5} />
        </mesh>
      </>
      )}
    </mesh>
  );


};

const DebugCamera = (props: {
  listener: THREE.AudioListener | null;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>();
  const minYPosition = 10; // Set your minimum y position here
  const maxYPosition = 30; // Set your maximum y position here
  const minZPosition = 0; // Set your minimum z position here
  const maxZPosition = 27; // Set your maximum z position here

  useFrame(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      if (camera.position.y < minYPosition) {
        camera.position.y = minYPosition;
      }
      if (camera.position.y > maxYPosition) {
        camera.position.y = maxYPosition;
      }
      if (camera.position.z < minZPosition) {
        camera.position.z = minZPosition;
      }
      if (camera.position.z > maxZPosition) {
        camera.position.z = maxZPosition;
      }
    }
  });


  useEffect(() => {
    if (props.listener) {
      const camera = controlsRef.current.object;
      camera.add(props.listener);
    }
  }, [props.listener]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enableRotate={true}
      minAzimuthAngle={0} // Set your minimum azimuth angle here
      maxAzimuthAngle={0} // Set your maximum azimuth angle here
      minPolarAngle={0} // Set your minimum polar angle here
      maxPolarAngle={Math.PI / 4} // Set your maximum polar angle here
    />
  );
};

const TerrainScene = () => {
  const [listener] = React.useState(() => new THREE.AudioListener());

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 30, 0] }}
        style={{
          height: '100vh',
          width: '100vw',
        }}>
        <ambientLight intensity={0.5} />
        <Terrain />
        <Marker position={[-1, 1, -7]} listener={listener} /> {/* Add marker at desired position */}
        <DebugCamera listener={listener} />
      </Canvas>
    </div>
  );
};

export default TerrainScene;