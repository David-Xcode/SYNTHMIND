# Hero「Blueprint Object」设计定案

> 首页 Hero 右栏 3D 物件——从 2D SVG 活蓝图升维为有物理感的立体物件。
> 参考基准：Resend 魔方（安静、有质感、靠存在传递实力）。
> 上位正本：`2026-07-25-frontend-redesign-design.md`（Blueprint 设计系统）。

## 1. 概念定案：「Axonometric Core」轴测核心体

一块哑光深色长方体（280 × 340 × 120 逻辑 px，竖立碑体），以工程制图的
轴测姿态呈现（rotateX −16° / rotateY −28°），可见三面各司其职：

- **正面**：INPUT → CORE → OUTPUT 电路蚀刻（承接原 2D 蓝图叙事的微缩版）+
  角部裁切标记 + 底部图签栏（SYNTHMIND / S.01 / 1:1——侧面透视缩短会压坏文字，图签留正面）
- **右侧面**：竖向全高尺寸标注（340）+ 机身面板接缝
- **顶面**：十字基准标记 + 前棱刻度

物件读作「一张轴测图活了过来」。被否概念：Drafted Assembly（三层爆炸视图——
轮廓碎、稀释单体存在感），其 Draft/Build/Ship 叙事降维进入场编排。

## 2. 路线定案：A+（CSS preserve-3d + SVG 面 + 弹簧物理 JS），否决 WebGL

1. 物件本质是 hairline 线稿：DOM/SVG 细线抗锯齿优于 WebGL 细线（Line2 亦毛糙）
2. WebGL 独有收益（PBR/镜面/bloom）全在质感禁区；平面体的 CSS 逐面着色 ≈ flat shading 正确解
3. 入场「线框逐笔绘制」直接复用已踩平 Safari 坑的 `.bp-draw`；three.js 侧反而是难点
4. 厚重感住在物理层（欠阻尼弹簧）不住渲染层——JS 行为与渲染技术无关
5. 降级链 4 条塌缩 1 条：Server 直出 SVG，无 JS 即静态完成态；LCP 零影响；零新依赖

## 3. 架构

```
HomeHero (.hero-tilt 滚动 scrub 保留在外层)
└─ HeroObjectPhysics  'use client' — .bp-object-scene（perspective:2000px，偏长透视贴平行投影气质）
   ├─ .bp-object-backglow / .bp-object-shadow  背光与地面投影 —
   │    ⚠️ 必须是弹簧层的兄弟节点（旋转链外）：放进链内会随指针转动/缩放，光源就不固定了；
   │    画在 spring 之前被物件正常遮挡；backglow 宽度锁定 380px，不吃列宽百分比
   └─ .bp-object-spring  弹簧层 — rAF 半隐式欧拉弹簧写 rotateX/rotateY/scale
      │    （yaw/pitch 跟随 + hover 进度共用一根弹簧驱动 scale 与 --edge-boost）
      └─ .bp-object-root  物件根容器 — ⚠️ 也必须 preserve-3d：此层缺失时 WebKit
         │   把整个物件压扁成平面卡（Chromium 宽容恰好看不出来，Safari 严格执行）
         └─ .obj-float  CSS 呼吸 translateY −6/+3px / 7s（延迟 2.4s 起，入场完再呼吸）
            └─ .obj-sway  CSS 摇曳 rotateY ±3° / 13s（与指针 yaw ±7° 同轴叠加峰值 10°，不破倾角纪律）
               └─ .bp-object  轴测基姿态 rotateX(-16°) rotateY(-28°)，preserve-3d
                  └─ 3 × .bp-face（front/top/right — 可达角度域内另三面永不可见，整体省略）
                     ├─ .bp-face-fill  哑光渐变实底，入场延迟淡入（实体化）
                     └─ svg  边缘线框(.bp-draw) + 蚀刻细节(.bp-draw/.bp-fade) + hover 增亮描边层
```

组合模式：SVG 大块 DOM 全在 Server Component（不进 client bundle）；
client 组件只有 ~3KB 物理逻辑，以 children 接收服务端子树。

## 4. 入场编排（Draft → Build → Ship）

| 阶段 | 时间 | 内容 |
|------|------|------|
| Draft | 0 – 1.4s | 12 条棱线逐笔绘制（`.bp-draw`，按面分段 `--draw-delay`） |
| Build | 0.9 – 1.9s | 面板实体化：`.bp-face-fill` 淡入 + 地面投影浮现 |
| Ship | 1.6 – 2.6s | 蚀刻细节绘制（电路/图签/刻度），节点圆点最后亮起 |
| 常态 | 2.4s 起 | 呼吸 + 摇曳接管 |

## 5. 物理层（指针交互）

- 监听区域 = hero `<section>`（组件 mount 时 `closest('section')` 获取）
- 指针归一化 [-1,1] → 目标 yaw ±7° / pitch ±5°（与 ±3° 摇曳叠加后 ≤10° 纪律）
- 弹簧：半隐式欧拉 `v += (-k·Δx − c·v)·dt; x += v·dt`，k≈30、ζ≈0.6（欠阻尼一次过冲）
- 离开区域：目标归零 → 弹簧过冲回摆（"有质量的物体被拨动"）
- hover 物件本体：hover 进度弹簧 0→1，驱动 scale 1→1.03 与 `--edge-boost`（增亮描边层 opacity）
- rAF 循环按需运行：静止收敛后停帧，指针事件唤醒
- dt 上限 clamp（防 tab 切换回跳爆炸）

## 6. 降级路径

| 条件 | 行为 |
|------|------|
| `prefers-reduced-motion` | 全局 reset 让 .bp-draw/.bp-fade/bpSolidify 落终态；.obj-float/.obj-sway/.bp-object-shadow 显式 `animation:none`（shadow 补静态 opacity 0.55）；JS 检测 matchMedia 不挂监听，会话中途开启则 teardown（disposed 终止位防复活） |
| 无 JS / hydration 前 | Server 直出完成态 SVG + CSS 入场/呼吸照常，仅无指针跟随 |
| 触屏（hover:none / pointer:coarse） | 不挂指针监听（媒体查询 JS 侧判定） |
| 移动端 <lg | CSS 隐藏（hidden lg:block）+ JS 侧 (min-width:1024px) 门控：mount 窄窗不挂监听；会话中缩窗跨界则 move 早退 + 目标归零 |
| 老内核（无 animation-timeline） | 仅影响外层 .hero-tilt（现状既有降级），物件本身动画为普通 CSS 动画不受影响 |

## 7. 文件清单

- 新增 `src/components/home/BlueprintObject.tsx`（Server：物件本体）
- 新增 `src/components/home/HeroObjectPhysics.tsx`（client：弹簧物理 wrapper）
- 删除 `src/components/home/HomeHeroBlueprint.tsx`（叙事已微缩进正面蚀刻）
- 修改 `src/components/home/HomeHero.tsx`（右栏接线）
- 修改 `src/app/globals.css`（objFloat / objSway / objShadow / bpSolidify + reduced-motion 增补）
- 修改 `CLAUDE.md` §6（白名单增补 + 指针跟随窄口径豁免声明）

## 8. 白名单修法（CLAUDE.md §6）

- ALLOWED 增补：`objFloat`（呼吸 −6/+3px，周期 7s）、`objSway`（摇曳 ≤±3°）、
  `objShadow`、`bpSolidify`（面板实体化淡入）、hero 物件弹簧物理（rAF，transform/opacity/CSS 变量 only）
- FORBIDDEN 修订：mouse-tracking tilt 条目注明「唯一豁免：Hero Blueprint Object，
  阻尼弹簧跟随，非 1:1 硬跟」
- 「不引入动效 JS 库」立场不变（本案零新依赖）

## 9. 验收

- Chrome + Safari 截图/录屏自检；静止 5s 有生命感；快速划过有惯性回摆无跳变
- reduced-motion / 无 JS / 触屏 / <lg 四条降级逐一实测
- `npm run lint` + `npm run build` 通过；code-review-loop 至零 verdict-changing 问题
