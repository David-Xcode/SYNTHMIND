// ─── MediaQueryList 监听守卫 ───
// MediaQueryList.addEventListener 是 Safari 14+ 才有 — 老内核缺守卫会在
// effect 里抛 TypeError，经页面 ErrorBoundary 把整个宿主子树打成 null
// （HeroObjectPhysics 与 GridBricks 共用；不用旧 addListener 回退——
// 老内核直接放弃「会话中途能力变化」响应，静态路径本就完整）

export function listenMql(
  mql: MediaQueryList,
  fn: (e: MediaQueryListEvent) => void,
) {
  if (typeof mql.addEventListener !== 'function') return () => {};
  mql.addEventListener('change', fn);
  return () => mql.removeEventListener('change', fn);
}
