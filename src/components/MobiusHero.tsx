'use client'

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
// x(u,v) = (R + v·cos(u/2)) · cos(u)
// y(u,v) = (R + v·cos(u/2)) · sin(u)
// z(u,v) = v · sin(u/2)
function generateMobiusPoints(
  R: number,        // 主半径
  w: number,        // 带宽的一半
  segments: number, // u 方向的分段数
  lineCount: number // 平行线数量
): THREE.Vector3[][] {
  const lines: THREE.Vector3[][] = []

  // 生成多条平行线（沿 v 方向分布）
  for (let l = 0; l < lineCount; l++) {
    const v = lineCount === 1 ? 0 : -w + (2 * w * l) / (lineCount - 1)
    const points: THREE.Vector3[] = []

    // 沿 u 方向生成点
    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2

      const x = (R + v * Math.cos(u / 2)) * Math.cos(u)
      const y = (R + v * Math.cos(u / 2)) * Math.sin(u)
      const z = v * Math.sin(u / 2)

      points.push(new THREE.Vector3(x, z, y)) // 交换 y 和 z 使环水平放置
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
  color = '#C0C0C0',
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

  // 生成莫比乌斯环的线条点
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

  // 移动端减少线段数量
  const segments = isMobile ? 64 : 128
  const lineCount = isMobile ? 3 : 5

  // 动画：黄金比例旋转
  useFrame((state) => {
    const time = state.clock.elapsedTime

    // 基础旋转速度
    const baseSpeed = 0.15

    // 环 1：基础速度旋转
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * baseSpeed
    }

    // 环 2：黄金比例速度旋转（更快）
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = time * baseSpeed * PHI
    }

    // 整体场景缓慢倾斜，增加动态感
    if (sceneRef.current) {
      sceneRef.current.rotation.x = Math.PI / 6 + Math.sin(time * 0.1) * 0.05
      sceneRef.current.rotation.y = time * 0.02
    }
  })

  return (
    <>
      {/* 相机设置 */}
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />

      {/* 环境光照 */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3498db" />

      {/* 主场景容器 */}
      <group ref={sceneRef}>
        {/* 莫比乌斯环 1 - 金属银 */}
        <group ref={ring1Ref}>
          <MobiusStrip
            radius={3}
            width={0.6}
            segments={segments}
            lineCount={lineCount}
            color="#4A6278"
            lineWidth={isMobile ? 2 : 3}
          />
        </group>

        {/* 莫比乌斯环 2 - 深蓝（正交放置） */}
        <group ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
          <MobiusStrip
            radius={3}
            width={0.6}
            segments={segments}
            lineCount={lineCount}
            color="#1A5277"
            lineWidth={isMobile ? 2 : 3}
          />
        </group>
      </group>

      {/* 后处理效果 */}
      <EffectComposer>
        <Bloom
          intensity={isMobile ? 0.8 : 1.5}
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

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#060b15] via-[#101c2f] to-[#1b2f49]">
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

      {/* 覆盖层文字内容 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center mt-16">
          <h1 className="text-7xl md:text-9xl font-extralight tracking-wider">
            <span className="text-white/80">Synth</span>
            <span className="text-white font-normal">mind</span>
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8 mb-6" />
          <p className="text-lg md:text-xl text-white/50 font-light tracking-wider">
            Unleash Human Potential with AI.
          </p>
        </div>
      </div>

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#252b3b] to-transparent pointer-events-none" />
    </div>
  )
}
