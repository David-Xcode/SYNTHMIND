# Repository Guidelines

> **本仓所有工程与设计约定见 [`CLAUDE.md`](./CLAUDE.md)，无第二份正本。**
> 本文件只保留 CLAUDE.md 未覆盖的提交/PR 规范。任何与 CLAUDE.md 冲突的表述，
> 一律以 CLAUDE.md 为准；发现冲突请改 CLAUDE.md，不要在本文件里另起一套。
> 项目速览（是什么 / 怎么跑）见 [`README.md`](./README.md)。

## 提交与拉取请求规范

- 提交信息使用祈使句（示例：`Add contact form validation`），每个提交聚焦单一职责；
  正文关联相关 Issue 或需求编号。
- PR 描述需包含变更摘要、验证步骤（`npm run lint`、`npm run build`、手动提交表单）
  以及 UI 变更的截图或录屏。
- 涉及配置、环境变量或安全策略调整时，在 PR 中说明影响面与回滚策略。
- 设计系统级改动（材质 / 动效 / 卡片 / 按钮 / 背景层）必须与 `docs/superpowers/specs/`
  下的对应 spec 同 commit 落盘，并同步更新 CLAUDE.md——三者不得脱节。

## 安全与配置提示

- 环境变量走根目录 `.env`（模板见 `.env.example`，当前只有 `RESEND_API_KEY`）；
  密钥不得进 git，成员离开或权限变更需立即轮换 Resend API Key。
- Preview / Demo 环境使用最小权限密钥，示例数据中不得包含真实客户隐私。
- 对外文案的事实红线（客户不点名 / CSIO 认证进行时 / 已签约方是 brokerages）见
  CLAUDE.md §1，改文案前必读。
