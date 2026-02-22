// ─── JSON-LD 结构化数据注入组件 ───
// 通用 SEO 组件，在 <head> 中输出 application/ld+json script

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
