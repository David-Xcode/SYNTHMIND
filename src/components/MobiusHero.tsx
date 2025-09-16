'use client'

import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// 创建莫比乌斯环的几何体
function createMobiusGeometry(radius = 2, tube = 0.3, radialSegments = 32, tubularSegments = 200) {
  const points: THREE.Vector3[] = []
  const normals: THREE.Vector3[] = []

  for (let i = 0; i <= tubularSegments; i++) {
    const u = (i / tubularSegments) * Math.PI * 2

    // 莫比乌斯环参数方程
    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * 2 - 1
      const halfTwist = u / 2

      const x = (radius + tube * v * Math.cos(halfTwist)) * Math.cos(u)
      const y = (radius + tube * v * Math.cos(halfTwist)) * Math.sin(u)
      const z = tube * v * Math.sin(halfTwist)

      points.push(new THREE.Vector3(x, y, z))

      // 计算法线
      const nx = Math.cos(u) * Math.cos(halfTwist)
      const ny = Math.sin(u) * Math.cos(halfTwist)
      const nz = Math.sin(halfTwist)
      normals.push(new THREE.Vector3(nx, ny, nz).normalize())
    }
  }

  // 创建面索引
  const indices: number[] = []
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = (radialSegments + 1) * i + j
      const b = (radialSegments + 1) * (i + 1) + j
      const c = (radialSegments + 1) * (i + 1) + j + 1
      const d = (radialSegments + 1) * i + j + 1

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array(points.length * 3)
  const normalsArray = new Float32Array(normals.length * 3)

  for (let i = 0; i < points.length; i++) {
    vertices[i * 3] = points[i].x
    vertices[i * 3 + 1] = points[i].y
    vertices[i * 3 + 2] = points[i].z

    normalsArray[i * 3] = normals[i].x
    normalsArray[i * 3 + 1] = normals[i].y
    normalsArray[i * 3 + 2] = normals[i].z
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normalsArray, 3))
  geometry.setIndex(indices)

  return geometry
}

// 单个莫比乌斯环组件
function MobiusRing({
  color,
  radius,
  tube,
  rotationSpeed = 0.01,
  rotationAxis = 'y',
  opacity = 0.85,
  emissive = false,
  offset = [0, 0, 0]
}: {
  color: string
  radius: number
  tube: number
  rotationSpeed?: number
  rotationAxis?: 'x' | 'y' | 'z'
  opacity?: number
  emissive?: boolean
  offset?: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => createMobiusGeometry(radius, tube), [radius, tube])

  // 动画循环
  useFrame((state) => {
    if (meshRef.current) {
      // 主旋转 - 缓慢且流畅
      const baseRotation = state.clock.elapsedTime * rotationSpeed

      // 鼠标交互效果 - 增强响应
      const pointer = state.pointer
      const mouseInfluenceX = pointer.x * 0.3
      const mouseInfluenceY = pointer.y * 0.3

      if (rotationAxis === 'y') {
        meshRef.current.rotation.y = baseRotation + mouseInfluenceX
        meshRef.current.rotation.x = mouseInfluenceY * 0.5
      } else if (rotationAxis === 'x') {
        meshRef.current.rotation.x = baseRotation + mouseInfluenceY
        meshRef.current.rotation.z = mouseInfluenceX * 0.5
      } else {
        meshRef.current.rotation.z = baseRotation + mouseInfluenceX
        meshRef.current.rotation.y = mouseInfluenceY * 0.5
      }

      // 轻微的浮动效果 - 更平滑
      meshRef.current.position.y = offset[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={offset}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={color}
        metalness={0.1}
        roughness={0.8}
        clearcoat={0.2}
        clearcoatRoughness={0.3}
        transparent={false}
        opacity={1.0}
        emissive={emissive ? color : undefined}
        emissiveIntensity={emissive ? 0.3 : 0}
        envMapIntensity={0.4}
        side={THREE.DoubleSide}
        depthWrite={true}
        depthTest={true}
      />
    </mesh>
  )
}

// 雾化粒子效果
function FogParticles({ color, count = 500 }: { color: string, count?: number }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // 创建围绕中心的雾状分布
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 8 + 2
      const height = (Math.random() - 0.5) * 10

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }
    return positions
  }, [count])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={color}
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 主场景组件
function Scene() {
  return (
    <>
      {/* 相机设置 - 拉远视角 */}
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />

      {/* 轨道控制 - 允许鼠标交互 */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.1}
        enableRotate={true}
        rotateSpeed={0.5}
      />

      {/* 环境光照 - 更亮的光照 */}
      <ambientLight intensity={0.25} />
      <pointLight position={[10, 10, 10]} intensity={0.7} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#3498db" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* 环境贴图 */}
      <Environment preset="night" />

      {/* 雾效果 - 更亮的雾 */}
      <fog attach="fog" args={['#4a4a4a', 12, 45]} />

      {/* 主容器 - 整体45度倾斜朝向观察者 */}
      <group rotation={[Math.PI / 4, 0, 0]}>

        {/* 蓝色莫比乌斯环 - 垂直轨道 */}
        <MobiusRing
          color="#3498db"
          radius={5.2}
          tube={0.4}
          rotationSpeed={0.08}
          rotationAxis="y"
          opacity={1.0}
          emissive={true}
          offset={[0, 0, 0]}
        />

        {/* 黑色（深灰）莫比乌斯环 - 60度倾斜轨道 */}
        <group rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <MobiusRing
            color="#2c3e50"
            radius={5.0}
            tube={0.38}
            rotationSpeed={-0.09}
            rotationAxis="y"
            opacity={1.0}
            offset={[0, 0, 0]}
          />
        </group>
      </group>
    </>
  )
}

// 主组件
export default function MobiusHero() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500">
      {/* 3D画布 */}
      <Canvas
        shadows
        dpr={[1, 2]}
        className="absolute inset-0"
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* 覆盖层文字内容 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center mt-16">
          <h1 className="text-6xl md:text-8xl font-bold text-white/90 tracking-tight">
            <span className="text-[#3498db]">Synth</span>
            <span className="text-gray-300">mind</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-400">
            Where Mathematics Meets Innovation
          </p>
        </div>
      </div>

      {/* 渐变遮罩 - 底部淡出效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-500 to-transparent pointer-events-none" />
    </div>
  )
}