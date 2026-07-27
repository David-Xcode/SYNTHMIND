// ─── 项目成果 · Blueprint ───
// IBM Plex Mono stat 数字 / 蓝色数字 / 计数动画
// v7：count-up 卡片统一走 shared/StatCard（本文件不再自持 hooks——
// 原 ResultCard 的解析 + 动画双份实现随卡片系统收敛退役），
// 组件回归 Server Component，client 岛只剩 StatCard/AnimateOnScroll 叶子
// IA v1 §4.4：extractStat 支持句中数字——此前只认句首，"…to under 15
// minutes" 这类真实成果被整条降级成 bullet，页面上一个数字都立不起来。
// 🚨 铁律：解析不到就 bullet 直排，**不虚构数字，也不虚构精度**。
// 写 results 文案时可预期的降级（都是有意为之的漏报，不是 bug）：
// - 货币金额（"$40,000 saved"）——`$` 不在候选前缀里，永远走 bullet
// - 裸年份（"since 2023"）、区间（"40%–60%"）、单位词不在 UNIT_WORDS 白名单
// - 只给起点不给终值（"Scaled from 3 systems"）——避免把旧指标当成果
// - 数字前的否定 + 限定词组合（"not much more than 15 minutes"）——避免反义

import AnimateOnScroll from '@/components/shared/AnimateOnScroll';
import SectionTitle from '@/components/shared/SectionTitle';
import StatCard from '@/components/shared/StatCard';

interface ResultsSectionProps {
  results: string[];
}

// 数字本体：千分位必须是「逗号 + 恰好三位」，不允许以逗号收尾——
// 松散的 [\d,]* 会把 "Since 2023, teams…" 的 digits 吃成 "2023,"，
// 再被 StatCard 的 toLocaleString 渲染成大字 "2,023 teams"（复核 F2）
const DIGITS = String.raw`\d+(?:,\d{3})*(?:\.\d+)?`;

// 两条互斥通道，全局扫描收集**所有**候选（不是只取第一处，见 pickCandidate）。
// 共同的前置 (?:^|[\s(]) 是防误报的关键：没有它，"24/7 lead capture" 会从
// '7 lead' 起匹配，把一个排班口径读成成果数字。
//
// ① 带符号（% / x / × / +）：数字自身已是完整度量，后面不需要单位词
const SYMBOL_STAT = new RegExp(
  String.raw`(?:^|[\s(])(${DIGITS}[%x×+])(?=$|[\s,.;:)])`,
  'g',
);
// ② 裸数字 + 单位词：单位词必须在下面的白名单里
const UNIT_STAT = new RegExp(
  String.raw`(?:^|[\s(])(${DIGITS})\s+([a-zA-Z]+)`,
  'g',
);

// 裸四位年份不是度量（"Since 2023 teams saved hours" 里的 2023）
const YEAR_LIKE = /^(?:19|20)\d{2}$/;

// 🚨 单位词是**白名单**不是黑名单：决定「什么能变成对外页面上的大数字」
// 必须是显式授权。黑名单版曾把 "Live in production since 2024 across three
// provinces" 解析成 value "2024 across"，再被 StatCard 的 toLocaleString
// 渲染成大字 "2,024 across" —— 一个年份被读成了度量。
// 白名单漏掉的写法一律降级 bullet（spec：解析不到就 bullet 直排），
// 漏报只是可惜，误报是对外材料红线。新单位按需追加。
const UNIT_WORDS = new Set([
  // 时间
  'second',
  'seconds',
  'minute',
  'minutes',
  'hour',
  'hours',
  'day',
  'days',
  'week',
  'weeks',
  'month',
  'months',
  'year',
  'years',
  'quarter',
  'quarters',
  'sec',
  'secs',
  'min',
  'mins',
  'hr',
  'hrs',
  'wk',
  'wks',
  'mo',
  'yr',
  'yrs',
  // 可数实体
  'document',
  'documents',
  'file',
  'files',
  'form',
  'forms',
  'page',
  'pages',
  'project',
  'projects',
  'client',
  'clients',
  'customer',
  'customers',
  'site',
  'sites',
  'system',
  'systems',
  'broker',
  'brokers',
  'policy',
  'policies',
  'business',
  'businesses',
  'user',
  'users',
  'account',
  'accounts',
  'team',
  'teams',
  'brokerage',
  'brokerages',
  'submission',
  'submissions',
  'signature',
  'signatures',
  // 倍数
  'times',
]);

// 数字前的限定词必须跟着数字走进 value —— 摘掉它就是虚构精度：
// "under 15 minutes"（≤15）被改写成 "15 minutes"（=15）。这类词绝不能
// 进 label 尾部虚词表被剥掉（H1 审查发现）。
// (?:no|not) 分支必须在裸 more/less than 之前列出：漏了它，
// "not more than 15 minutes" 会命中 "more than"，把 ≤ 说成 >（复核 F4）
const HEDGE_PREFIX =
  /(?:^|\s)((?:at least|at most|(?:no|not) (?:more|less|fewer|later|longer) than|more than|less than|fewer than|up to|as (?:few|little|many|much) as|under|over|about|around|nearly|almost|approximately|roughly|just|only)\s*)$/i;

// label 尾部的连接虚词（数字短语摘走后留下的"…from days to"）。
// 注意：限定词（under/over/about/…）已由 HEDGE_PREFIX 先行提走，不在此表
const TRAILING_FILLER = new Set([
  'to',
  'from',
  'in',
  'on',
  'at',
  'by',
  'of',
  'for',
  'with',
  'within',
  'than',
  'into',
  'and',
  'or',
  'a',
  'an',
  'the',
  'as',
  'up',
  'down',
]);

// 标点必须**双向**剥：数字短语是从句子中间挖走的，左半截会留下悬空的开括号、
// 右半截会留下前导逗号，拼起来就是 "Cut review time , with zero manual steps"
// 或 "Delivered in ( ) flat"（复核 I-1）
const trimPunct = (s: string) =>
  s.replace(/^[\s—–\-,;:)]+/, '').replace(/[\s—–\-,;:(]+$/, '');

// 尾部虚词与悬空标点逐个剥掉，直到落在实词上。
// `(^|\s)` 而非 `\s`：整段只剩一个虚词时也要剥空，剥空后由调用方退回后半句
function trimFiller(text: string): string {
  let out = trimPunct(text.trim());
  for (;;) {
    const match = out.match(/(?:^|\s)([a-zA-Z]+)$/);
    if (!match || !TRAILING_FILLER.has(match[1].toLowerCase())) break;
    out = trimPunct(out.slice(0, match.index ?? 0).trim());
  }
  return out;
}

interface Candidate {
  /** 数字短语本身，如 "15 minutes" / "90%" */
  phrase: string;
  /** 在原句中的区间（不含前导空白） */
  start: number;
  end: number;
}

// 两条通道各自全局扫描，合并后按位置排序。
// 前缀 (?:^|[\s(]) 至多消费 1 个非数字字符，故 indexOf(捕获组) 恒等于前缀长度
function collectCandidates(text: string): Candidate[] {
  const out: Candidate[] = [];

  SYMBOL_STAT.lastIndex = 0;
  for (let m = SYMBOL_STAT.exec(text); m; m = SYMBOL_STAT.exec(text)) {
    const start = m.index + m[0].indexOf(m[1]);
    out.push({ phrase: m[1], start, end: start + m[1].length });
  }

  UNIT_STAT.lastIndex = 0;
  for (let m = UNIT_STAT.exec(text); m; m = UNIT_STAT.exec(text)) {
    const [full, digits, unit] = m;
    // 白名单外的单位词、以及裸年份：跳过这一个候选而不是放弃整条
    if (!UNIT_WORDS.has(unit.toLowerCase()) || YEAR_LIKE.test(digits)) continue;
    const start = m.index + full.indexOf(digits);
    out.push({
      phrase: `${digits} ${unit}`,
      start,
      end: m.index + full.length,
    });
  }

  return out.sort((a, b) => a.start - b.start);
}

// 候选前的语境词 ⇒ 这是改造前的旧指标。不能只认字面 "from"：
// "Was 6 hours, now 15 minutes" 一类不带 from 的对比句式同样把基线放最左，
// 只认 from 会让 F1 从这些句式原样回流（复核 I-3）
const BASELINE_CTX = new Set([
  'from',
  'was',
  'were',
  'previously',
  'before',
  'versus',
  'vs',
  'than',
]);

// "compared to / relative to / prior to" 的 to 指向**对照基线**而不是成果值。
// 只看紧邻一个词会把基线顶到最高优先级——比不判断还糟（复核 I-2）
const BASELINE_TO_LEAD = new Set([
  'compared',
  'relative',
  'prior',
  'according',
]);

type StatContext = 'target' | 'baseline' | 'neutral';

// 候选之前最近的两个实词（限定词先剥掉）：判断它是基线值还是成果值
function contextOf(text: string, start: number): StatContext {
  let head = text.slice(0, start);
  const hedge = head.match(HEDGE_PREFIX);
  if (hedge?.[1]) head = head.slice(0, hedge.index ?? 0);
  const words = head
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);
  const last = words[words.length - 1] ?? '';
  if (last === 'to') {
    return BASELINE_TO_LEAD.has(words[words.length - 2] ?? '')
      ? 'baseline'
      : 'target';
  }
  return BASELINE_CTX.has(last) ? 'baseline' : 'neutral';
}

// 🚨 "reduced from A to B" 是成果文案的标准句式，而 A 是**改造前**的旧指标。
// 只取第一处匹配会把旧指标当成果打成大字（复核 F1）——这不是假想句式，
// 现有 results 里已有三条 "from … to …"，只是 A 侧暂时没有数字。
// 规则：target 语境优先 → 其次 neutral → 全是 baseline
//（"Scaled from 3 systems" 这种只给起点不给终值的句子）→ 不出卡
function pickCandidate(text: string, list: Candidate[]): Candidate | null {
  const tagged = list.map((c) => ({ c, ctx: contextOf(text, c.start) }));
  return (
    tagged.find((t) => t.ctx === 'target')?.c ??
    tagged.find((t) => t.ctx === 'neutral')?.c ??
    null
  );
}

// 从文本中提取数字指标；提取不到返回 null（该条走 bullet 直排）
function extractStat(text: string): { value: string; label: string } | null {
  const picked = pickCandidate(text, collectCandidates(text));
  if (!picked) return null;

  let head = text.slice(0, picked.start);
  // 限定词随数字走（"…to under" + "15 minutes" → "under 15 minutes"）
  const hedge = head.match(HEDGE_PREFIX);
  let value = picked.phrase;
  if (hedge?.[1]) {
    head = head.slice(0, hedge.index ?? 0);
    // 限定词前还残留否定词 = 摘出来的那半句会语义反转
    //（"not much more than 15" 只吃到 "more than" → 输出成「多于 15」）。
    // 这种句子宁可整条降级 bullet，不冒反义风险（复核 I-4）
    if (/(?:^|\s)(?:no|not|never)(?:\s+[a-zA-Z]+)?\s*$/i.test(head))
      return null;
    value = `${hedge[1].trim()} ${picked.phrase}`;
  }

  // label 由前后两半拼成：只取 head 会丢掉数字之后的限定语
  //（"Delivered 40% faster" 的 "faster"，复核 F5）
  const label = [trimFiller(head), trimFiller(text.slice(picked.end))]
    .filter(Boolean)
    .join(' ');
  return label ? { value, label } : null;
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  // 分离有数字和无数字的结果（单次遍历，extractStat 每项只调一次）
  const statsResults: { value: string; label: string }[] = [];
  const textResults: string[] = [];
  results.forEach((r) => {
    const stat = extractStat(r);
    if (stat) statsResults.push(stat);
    else textResults.push(r);
  });

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <SectionTitle
            sheetNo="03"
            eyebrow="RESULTS"
            light="The"
            bold="Results"
          />
        </AnimateOnScroll>

        {/* Stat 卡片网格 — count-up 大数字 */}
        {statsResults.length > 0 && (
          <div
            className={`grid gap-4 mb-8 ${statsResults.length >= 3 ? 'grid-cols-2 md:grid-cols-3' : statsResults.length === 2 ? 'grid-cols-2' : 'grid-cols-1 max-w-xs'}`}
          >
            {statsResults.map((stat, index) => (
              // key 用 index：两条成果可能解析出相同的 value+label（同一 slug 内
              // 罕见但不受约束），拼接键会碰撞；列表顺序在本次渲染内恒定
              <AnimateOnScroll
                key={`${index}-${stat.value}`}
                delay={index * 100}
              >
                <StatCard value={stat.value} label={stat.label} size="lg" />
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* 文本结果列表 */}
        {textResults.length > 0 && (
          <div className="space-y-4">
            {textResults.map((result, index) => (
              <AnimateOnScroll key={result} delay={index * 80 + 200}>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2.5" />
                  <p className="text-txt-secondary leading-7 text-base">
                    {result}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
