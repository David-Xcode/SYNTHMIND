'use client'

import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// 雾状环组件 - 由粒子组成的旋转环
function FoggyRing({
  color,
  radius,
  thickness = 1.5,
  particleCount = 3000,
  rotationSpeed = 0.01,
  rotationAxis = 'y',
  opacity = 0.4,
  offset = [0, 0, 0]
}: {
  color: string
  radius: number
  thickness?: number
  particleCount?: number
  rotationSpeed?: number
  rotationAxis?: 'x' | 'y' | 'z'
  opacity?: number
  offset?: [number, number, number]
}) {
  const groupRef = useRef<THREE.Group>(null)

  // 创建环形粒子分布
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const opacities = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // 在环形路径上分布粒子
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5
      const radiusVariation = radius + (Math.random() - 0.5) * thickness

      // 添加一些垂直方向的变化，使其更像雾
      const heightVariation = (Math.random() - 0.5) * thickness * 0.5

      pos[i * 3] = Math.cos(angle) * radiusVariation
      pos[i * 3 + 1] = heightVariation
      pos[i * 3 + 2] = Math.sin(angle) * radiusVariation

      // 随机大小和透明度 - 更大的粒子，更高的密度
      sizes[i] = Math.random() * 0.6 + 0.2
      opacities[i] = Math.random() * 0.7 + 0.3
    }

    return { positions: pos, sizes, opacities }
  }, [particleCount, radius, thickness])

  // 动画循环
  useFrame((state) => {
    if (groupRef.current) {
      // 主旋转 - 缓慢且流畅
      const baseRotation = state.clock.elapsedTime * rotationSpeed

      // 鼠标交互效果 - 增强响应
      const pointer = state.pointer
      const mouseInfluenceX = pointer.x * 0.3
      const mouseInfluenceY = pointer.y * 0.3

      if (rotationAxis === 'y') {
        groupRef.current.rotation.y = baseRotation + mouseInfluenceX
        groupRef.current.rotation.x = mouseInfluenceY * 0.5
      } else if (rotationAxis === 'x') {
        groupRef.current.rotation.x = baseRotation + mouseInfluenceY
        groupRef.current.rotation.z = mouseInfluenceX * 0.5
      } else {
        groupRef.current.rotation.z = baseRotation + mouseInfluenceX
        groupRef.current.rotation.y = mouseInfluenceY * 0.5
      }

      // 轻微的浮动效果
      groupRef.current.position.y = offset[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.05

      // 更新粒子属性以创建流动效果
      const points = groupRef.current.children[0] as THREE.Points
      if (points && points.geometry) {
        const positionAttribute = points.geometry.attributes.position
        const time = state.clock.elapsedTime

        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2 + time * 0.05
          const radiusVariation = radius + Math.sin(time * 0.5 + i * 0.1) * thickness * 0.3

          positionAttribute.array[i * 3] = Math.cos(angle) * radiusVariation
          positionAttribute.array[i * 3 + 2] = Math.sin(angle) * radiusVariation
        }

        positionAttribute.needsUpdate = true
      }
    }
  })

  return (
    <group ref={groupRef} position={offset}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={positions.sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-opacity"
            count={particleCount}
            array={positions.opacities}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
          uniforms={{
            color: { value: new THREE.Color(color) },
            opacity: { value: opacity }
          }}
          vertexShader={`
            attribute float size;
            attribute float opacity;
            varying float vOpacity;

            void main() {
              vOpacity = opacity;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size * 50.0 / -mvPosition.z;
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform vec3 color;
            uniform float opacity;
            varying float vOpacity;

            void main() {
              vec2 center = gl_PointCoord - vec2(0.5);
              float dist = length(center);
              float alpha = smoothstep(0.5, 0.0, dist);

              gl_FragColor = vec4(color, alpha * opacity * vOpacity);
            }
          `}
        />
      </points>
    </group>
  )
}


// 主场景组件
function Scene() {
  const mainGroupRef = useRef<THREE.Group>(null)
  const initialRotationRef = useRef(0)
  const grayRingGroupRef = useRef<THREE.Group>(null)
  const blueRingGroupRef = useRef<THREE.Group>(null)

  // 整体场景的旋转动画
  useFrame((state) => {
    if (mainGroupRef.current) {
      const elapsedTime = state.clock.elapsedTime

      // 初始快速旋转效果 - 在前1秒内快速旋转180度（半圈），然后继续较快旋转
      let sceneRotation
      if (elapsedTime < 1) {
        // 使用缓动函数实现减速效果
        const progress = elapsedTime / 1
        const easeOut = 1 - Math.pow(1 - progress, 3)
        initialRotationRef.current = easeOut * Math.PI // 180度旋转
        sceneRotation = initialRotationRef.current
      } else {
        // 1秒后继续保持较快的旋转速度
        sceneRotation = initialRotationRef.current + (elapsedTime - 1) * 0.08
      }

      mainGroupRef.current.rotation.y = sceneRotation
    }

    // 两个环围绕中心的公转动画（相对旋转）
    if (grayRingGroupRef.current && blueRingGroupRef.current) {
      const time = state.clock.elapsedTime

      // 浅灰色环围绕Y轴公转（正向）- 更慢速
      grayRingGroupRef.current.rotation.y = time * 0.15

      // 蓝色环围绕Y轴公转（反向）- 更慢速
      blueRingGroupRef.current.rotation.y = -time * 0.12
    }
  })

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
        autoRotate={false}
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

      {/* 雾效果 - 深色调雾 */}
      <fog attach="fog" args={['#1a1f2e', 12, 45]} />

      {/* 主容器 - 整体45度倾斜朝向观察者 */}
      <group ref={mainGroupRef} rotation={[Math.PI / 4, 0, 0]}>

        {/* 浅灰色雾状环容器 - 围绕中心公转 */}
        <group ref={grayRingGroupRef}>
          {/* 浅灰色雾状环 - 垂直轨道（后面） */}
          <FoggyRing
            color="#95a5a6"
            radius={4.8}
            thickness={1.5}
            particleCount={35000}
            rotationSpeed={0.15}
            rotationAxis="y"
            opacity={0.6}
            offset={[0, 0, -0.5]}
          />
        </group>

        {/* 蓝色雾状环容器 - 围绕中心公转 */}
        <group rotation={[Math.PI / 3, Math.PI / 6, 0]} ref={blueRingGroupRef}>
          <FoggyRing
            color="#3498db"
            radius={5.5}
            thickness={1.8}
            particleCount={40000}
            rotationSpeed={-0.18}
            rotationAxis="y"
            opacity={0.7}
            offset={[0, 0, 0.5]}
          />
        </group>
      </group>
    </>
  )
}

// 主组件
export default function MobiusHero() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#0f1419] via-[#1a1f2e] to-[#252b3b]">
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
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span className="text-[#3498db]">Synth</span>
            <span className="text-gray-300">mind</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-400">
            Where Mathematics Meets Innovation
          </p>
        </div>
      </div>

      {/* 渐变遮罩 - 底部淡出效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#252b3b] to-transparent pointer-events-none" />
    </div>
  )
}