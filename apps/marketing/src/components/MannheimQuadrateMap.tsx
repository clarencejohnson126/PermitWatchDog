'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Stylized 3D map of the Mannheim Quadrate district.
 * - Procedurally rendered grid (no external map tile API, no data fetch)
 * - Pilot project Q5,18 highlighted with an extruded electric-blue building
 * - Orbit/drag to explore, hover the project marker for the info panel
 *
 * The Quadrate grid in real Mannheim runs roughly A1–U7 (variable per row).
 * For visual clarity at this scale we render a 7×7 stylized sub-grid centered
 * on the project quadrant, with Q5 explicitly labelled. This is a UI map,
 * not a cartographic surface.
 */

// 7×7 stylized Quadrate grid. Row letters mirror Mannheim's southern Quadrate
// where Q5 lives (centred just south-east of the Planken intersection).
const ROW_LETTERS = ['M', 'N', 'O', 'P', 'Q', 'R', 'S'];
const COL_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

const QUADRATE_SIZE = 0.84;
const QUADRATE_GAP = 0.16;
const STEP = QUADRATE_SIZE + QUADRATE_GAP;

type QuadrateProps = {
  row: number;
  col: number;
  label: string;
  isPilot: boolean;
  onHover: (label: string | null) => void;
};

function Quadrat({ row, col, label, isPilot, onHover }: QuadrateProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Position based on grid coordinates, centered on origin
  const x = (col - (COL_NUMBERS.length - 1) / 2) * STEP;
  const z = (row - (ROW_LETTERS.length - 1) / 2) * STEP;

  // Pilot quadrant gets a tall extrusion + blue glow
  const height = isPilot ? 0.9 : 0.04;
  const color = isPilot ? '#1654FF' : hovered ? '#3A7BFF' : '#1a1a22';
  const emissive = isPilot ? '#1654FF' : '#000000';

  return (
    <group position={[x, height / 2, z]}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          if (isPilot) onHover(label);
        }}
        onPointerOut={() => {
          setHovered(false);
          if (isPilot) onHover(null);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[QUADRATE_SIZE, height, QUADRATE_SIZE]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isPilot ? 0.5 : 0}
          metalness={isPilot ? 0.3 : 0.2}
          roughness={isPilot ? 0.4 : 0.7}
        />
      </mesh>

      {/* Letter label floating above each quadrant */}
      {(col === 0 || isPilot) && (
        <Text
          position={[0, isPilot ? height / 2 + 0.4 : 0.1, -QUADRATE_SIZE / 2 - 0.15]}
          fontSize={0.18}
          color={isPilot ? '#FFFFFF' : '#71717A'}
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {label}
        </Text>
      )}

      {/* Pilot beacon pulse */}
      {isPilot && (
        <mesh position={[0, height / 2 + 0.05, 0]}>
          <ringGeometry args={[QUADRATE_SIZE / 2, QUADRATE_SIZE / 2 + 0.08, 32]} />
          <meshBasicMaterial color="#1654FF" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function PilotPulse() {
  // Animated expanding ring around the pilot quadrant
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ringRef.current) return;
    const t = (state.clock.getElapsedTime() % 3) / 3;
    ringRef.current.scale.set(1 + t * 1.5, 1 + t * 1.5, 1);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.6 * (1 - t);
  });

  // Q5 is row index 4 ('Q' is the 5th of M,N,O,P,Q,R,S), col index 4 ('5' is the 5th col)
  const x = (4 - (COL_NUMBERS.length - 1) / 2) * STEP;
  const z = (4 - (ROW_LETTERS.length - 1) / 2) * STEP;

  return (
    <mesh ref={ringRef} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[QUADRATE_SIZE / 2, QUADRATE_SIZE / 2 + 0.05, 32]} />
      <meshBasicMaterial color="#3A7BFF" transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

function MapScene({ onPilotHover }: { onPilotHover: (label: string | null) => void }) {
  return (
    <>
      {/* Ground plane — subtle dark slab for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#0a0a0e" roughness={0.95} />
      </mesh>

      {/* Quadrate grid */}
      {ROW_LETTERS.map((letter, row) =>
        COL_NUMBERS.map((num, col) => {
          const isPilot = letter === 'Q' && num === 5;
          const label = isPilot ? 'Q 5,18 — Wohnhaus' : `${letter} ${num}`;
          return (
            <Quadrat
              key={`${letter}${num}`}
              row={row}
              col={col}
              label={label}
              isPilot={isPilot}
              onHover={onPilotHover}
            />
          );
        })
      )}

      <PilotPulse />

      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-6, 6, -4]} intensity={0.35} color="#1654FF" />

      {/* Subtle fog so distant edges fall into the dark */}
      <fog attach="fog" args={['#0a0a0e', 7, 18]} />
    </>
  );
}

export default function MannheimQuadrateMap() {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  return (
    <section className="bg-black py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue mb-4">
            Pilot-Projekt im Quadrat
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">
            Q5, 18 &mdash; <span className="text-blue">interaktiv erleben.</span>
          </h2>
          <p className="font-body text-lg text-zinc-400 mt-6 leading-relaxed">
            Das Mannheimer Quadrate-Raster mit unserem Pilot-Bauvorhaben. Ziehen Sie zum Drehen, scrollen
            Sie zum Zoomen. Hovern Sie über den blau leuchtenden Block für Projektdetails.
          </p>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_60px_rgba(22,84,255,0.12)] bg-[#0A0A0E]">
          <Canvas
            shadows
            camera={{ position: [0, 7, 8], fov: 35, near: 0.1, far: 50 }}
            dpr={[1, 2]}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <MapScene onPilotHover={setHoveredLabel} />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={5}
                maxDistance={14}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.2}
                target={[0, 0, 0]}
                makeDefault
              />
            </Suspense>
          </Canvas>

          {/* Hover info panel */}
          {hoveredLabel && (
            <div className="absolute top-6 left-6 max-w-sm border border-blue bg-black/85 backdrop-blur-md px-5 py-4 rounded-lg pointer-events-none">
              <p className="font-body text-xs tracking-[0.25em] uppercase text-blue-light mb-2">
                Pilot &mdash; aktiv
              </p>
              <p className="font-serif text-xl text-white mb-2">{hoveredLabel}</p>
              <p className="font-body text-sm text-zinc-400 leading-relaxed">
                Neubau Mehrfamilienhaus &middot; EG + 4&nbsp;OG &middot; 10&nbsp;Wohneinheiten.
                Bauantrag genehmigt, Rohbau begonnen.
              </p>
            </div>
          )}

          {/* Interaction hint — bottom right */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 text-xs font-body tracking-widest uppercase text-zinc-500 pointer-events-none">
            <span>Ziehen &middot; Zoom</span>
            <span className="w-2 h-2 rounded-full bg-blue animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
