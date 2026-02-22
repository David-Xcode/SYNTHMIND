// 从聊天文本中用正则提取联系信息（零成本、无延迟）
// 复用于：chat route（实时更新 lead info）

/** 从一段文本中提取 email 和北美电话号码 */
export function extractContactInfo(text: string) {
  const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
  const phoneMatch = text.match(
    /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/,
  );

  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0].trim() : null,
  };
}

/** 从消息数组中提取联系信息（只看 user 消息） */
export function extractContactFromMessages(
  messages: { role: string; content: string }[],
) {
  const userText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ');
  return extractContactInfo(userText);
}
