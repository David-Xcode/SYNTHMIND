// ─── JSON-LD 结构化数据注入组件 ───
// 通用 SEO 组件，在 <head> 中输出 application/ld+json script

// U+2028 行分隔符 / U+2029 段分隔符：JSON 里合法，但在 JS 字符串字面量里
// 被当作换行，会让部分解析器语法错误。
//
// 这里刻意用 String.fromCharCode 而不是在正则里直接写这两个字符 —— 后者在源码中
// 是不可见字符，编辑器、diff、格式化工具都可能把它吃掉或规范化；更糟的是
// 它本身就等同于换行，写进正则字面量会直接把字面量截断成语法错误
// （本次修复第一版就踩了这个坑）。用 charCode 构造，源码保持纯 ASCII。
const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);

/**
 * 转义 JSON 字符串里能提前终止 <script> 或被 HTML 解析器特殊对待的字符。
 *
 * ⚠️ 为什么裸 JSON.stringify 不够：它不转义 `<`，所以数据里只要出现
 * `</script>`（哪怕是在某个 description 字段的正文中间），浏览器就会在那里
 * 提前闭合标签，后面的内容被当成 HTML 解析 —— 这是 dangerouslySetInnerHTML
 * 注入 JSON-LD 的经典 XSS 路径。
 *
 * 当前站内传进来的 data 全是 src/ 下的硬编码常量，所以这不是活漏洞；
 * 但组件是通用入口，哪天有人把 CMS 内容、用户输入或案例文案接进来就会引爆，
 * 而且不会有任何报错。转义是几行的事，比记住这条约定可靠。
 * （2026-07-27 审查修复）
 */
function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split(LINE_SEP)
    .join('\\u2028')
    .split(PARA_SEP)
    .join('\\u2029');
}

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD 必须以原始文本注入 script 标签（React 不会渲染 children 到
      // script 里），内容已经过 serializeJsonLd 转义。
      // 不加 biome-ignore：本仓 biome.json 已把 noDangerouslySetInnerHtml 设为
      // off，多余的抑制注释自身会触发 suppressions/unused 警告
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
