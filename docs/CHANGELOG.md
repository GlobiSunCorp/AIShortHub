# AIShortHub Changelog

## Phase 8 · 2026-04-13
- 新增 Creator 方案上传配额字段与页面展示（Pricing / Creator Studio / Profile）。
- 新增 Refund Matrix（三类政策拆分：Viewer / Creator / Add-on）。
- 修复支付按钮联动：Pricing/Services 支持 loading、错误提示、真实 checkout 跳转与 mock 回跳。
- 增强 checkout success/cancel 页面，展示支付类型与下一步建议。
- 统一海报播放按钮（Home hero、Browse/Home 卡片、Series Detail 主视觉）。
- Contact/Support 支持 domain 模式与 pilot fallback 模式，Footer/FAQ 联动一致。
- 新增文档体系：USER_MANUAL、CREATOR_MANUAL、ADMIN_PLAYBOOK。

## Phase 10 · 2026-04-13
- 新增统一深色下拉组件 `DarkSelect`，替换核心页面原生 select，修复暗色主题可读性问题。
- 新增 `QuotaAlertBar`（normal/near_limit/exhausted）用于 Creator Studio 与 Profile。
- 新增 `PlanHealthCard`，集中展示会员、创作者计划、抽成、审核优先级、额度使用与续费/重置信息。
- 新增 `CreatorActionCenter`，按优先级输出运营动作与 CTA。
- 新增 `SubmissionReadinessChecklist`，在提审前显示完成态/缺失态和计划兼容性。
- 增强 Pricing/Services/Profile 的 Included / Discounted / Add-on / Quota / Renewal 文案和升级收益提示。

## 2026-04-13 · Iteration 11
- Added unified Plan Identity System component (`PlanIdentityBadge`) and centralized identity metadata in `src/lib/planIdentity.js`.
- Upgraded membership badge popovers to status-entry cards with role-separated upgrade CTA logic.
- Added `StickyUpgradeRail` with Viewer / Creator / Admin variants and responsive behavior.
- Improved dark theme contrast for badges, popovers, selects, cards, and quota UI.
- Enhanced quota alert wording for “Remaining / Resets on …” semantics.
- Pricing and Profile now display clearer current-plan markers and role-specific upgrade messaging.
