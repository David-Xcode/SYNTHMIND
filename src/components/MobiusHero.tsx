'use client'

// ─── 3D Möbius Hero · Neural ───
// 蓝色莫比乌斯环 / 降低 bloom / 左对齐文字

import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// 黄金比例常量
const PHI = 1.618033988749895

// 检测是否为移动设备
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// 莫比乌斯环参数方程
function generateMobiusPoints(
  R: number,
  w: number,
  segments: number,
  lineCount: number
): THREE.Vector3[][] {
  const lines: THREE.Vector3[][] = []

  for (let l = 0; l < lineCount; l++) {
    const v = lineCount === 1 ? 0 : -w + (2 * w * l) / (lineCount - 1)
    const points: THREE.Vector3[] = []

    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2

      const x = (R + v * Math.cos(u / 2)) * Math.cos(u)
      const y = (R + v * Math.cos(u / 2)) * Math.sin(u)
      const z = v * Math.sin(u / 2)

      points.push(new THREE.Vector3(x, z, y))
    }

    lines.push(points)
  }

  return lines
}

// 莫比乌斯环组件
function MobiusStrip({
  radius = 3,
  width = 0.8,
  segments = 128,
  lineCount = 5,
  color = '#C0C0C0', // 默认银灰色（Three.js 须硬编码，实际由调用方覆盖）
  lineWidth = 1.5,
  rotation = [0, 0, 0] as [number, number, number]
}: {
  radius?: number
  width?: number
  segments?: number
  lineCount?: number
  color?: string
  lineWidth?: number
  rotation?: [number, number, number]
}) {
  const groupRef = useRef<THREE.Group>(null)

  const lines = useMemo(() => {
    return generateMobiusPoints(radius, width, segments, lineCount)
  }, [radius, width, segments, lineCount])

  return (
    <group ref={groupRef} rotation={rotation}>
      {lines.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={color}
          lineWidth={lineWidth}
          toneMapped={false}
        />
      ))}
    </group>
  )
}

// 主场景组件
function Scene({ isMobile }: { isMobile: boolean }) {
  const ring1Ref = useRef<THREE.Group>(null)
  const ring2Ref = useRef<THREE.Group>(null)
  const sceneRef = useRef<THREE.Group>(null)

  const segments = isMobile ? 64 : 128
  const lineCount = isMobile ? 3 : 5

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const baseSpeed = 0.15

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * baseSpeed
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = time * baseSpeed * PHI
    }
    if (sceneRef.current) {
      sceneRef.current.rotation.x = Math.PI / 6 + Math.sin(time * 0.1) * 0.05
      sceneRef.current.rotation.y = time * 0.02
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />
      {/* 注意：Three.js material 不支持 Tailwind token，以下颜色必须硬编码 */}
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4A9FE5" />

      <group ref={sceneRef}>
        {/* 环 1 — Synth Blue 主色（= accent-500 #4A9FE5，Three.js 须硬编码） */}
        <group ref={ring1Ref}>
          <MobiusStrip
            radius={3}
            width={0.6}
            segments={segments}
            lineCount={lineCount}
            color="#4A9FE5"
            lineWidth={isMobile ? 2 : 3}
          />
        </group>

        {/* 环 2 — 深海灰蓝 #2c3e50（正交，Three.js 须硬编码） */}
        <group ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
          <MobiusStrip
            radius={3}
            width={0.6}
            segments={segments}
            lineCount={lineCount}
            color="#2c3e50"
            lineWidth={isMobile ? 2 : 3}
          />
        </group>
      </group>

      <EffectComposer>
        <Bloom
          intensity={isMobile ? 0.5 : 0.8}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// 主组件
export default function MobiusHero() {
  const isMobile = useIsMobile()

  // background 须硬编码 = bg-base #080B10（inline style 不支持 Tailwind token）
  return (
    <div className="relative w-full h-screen" style={{ background: '#080B10' }}>
      {/* 3D 画布 */}
      <Canvas
        dpr={isMobile ? 1 : [1, 2]}
        className="absolute inset-0"
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} />
        </Suspense>
      </Canvas>

      {/* 覆盖层文字 — 左对齐 */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="ml-8 md:ml-20 lg:ml-32 mt-16">
          <h1 className="text-display tracking-tighter">
            <span className="text-txt-primary/80 font-light">Synth</span>
            <span className="font-display font-semibold text-txt-primary">mind</span>
          </h1>
          <div className="w-16 h-px bg-accent/40 mt-6 mb-4" />
          <p className="text-base md:text-lg text-txt-tertiary font-normal tracking-tight">
            Unleash Human Potential with AI.
          </p>
        </div>
      </div>

      {/* 底部渐变过渡 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base to-transparent" />
      </div>

      {/* 滚动指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="w-5 h-8 rounded-full border border-txt-quaternary/40 flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2 bg-txt-quaternary rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  )
}
