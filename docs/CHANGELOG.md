# AIShortHub Changelog

## Phase 14 · 2026-04-18
- 重构 Creator 方案为更低抽成：Basic 8% / Pro 5% / Studio 3%，并明确“有收入后才抽成”。
- 定义并落地 creator-friendly launch policy：月费与抽成彻底分离，避免双重压榨感。
- Pricing/Profile/Creator Studio/Services 同步升级商业模型文案，强调广告优先与 early creator program。
- 新增统一术语解释系统（hover/tap `ⓘ`），覆盖核心术语。
- 新增 role-based onboarding 组件（Viewer / Creator / Admin）。
- 新增页面上下文状态条（Current Page + Switching/Ready），改善跳转感知。
- Home/Browse 增加首批内容友好展示逻辑，支持少量优质内容软上线。
- Admin 页面新增 Production Readiness 只读清单。
- 新增 `docs/LAUNCH_CHECKLIST.md`，并更新 README 与三类手册文档。

## Phase 13 · 2026-04-18
- 重构 Viewer 定价：Free $0 / Pro Viewer $4.99 / Premium Viewer $9.99，并同步 Pricing、Profile、Watch、Series Detail 升级文案。
- 重构 Creator 方案：Basic(15%) / Pro(10%) / Studio(7%)，同步配额为 2/20/5GB、5/100/25GB、20/500/100GB。
- 新增 Revenue Model / Platform Monetization 模块，明确平台收入来源（广告优先 + 服务 + 订阅 + 解锁 + 低抽成）。
- 新增 Creator 自定价结构：整剧价、单集价、结局包、试看集配置，并贯通到 Creator Studio、详情与播放提示。
- 新增 Creator Earnings Breakdown：广告、订阅分成、整剧销售、单集销售、服务成本、平台抽成、净收入、待结算、已打款。
- Creator 上传系统升级为专业工作流：Trailer 与 Main Episodes 分离、资产类型扩展、分辨率/比例维度、QC 检查提示。
- 更新退款文案：Viewer/Creator/Add-on 独立且更清晰可信。
- README、USER_MANUAL、CREATOR_MANUAL、ADMIN_PLAYBOOK 同步更新。


## Phase 15
- Added data normalization layer in `src/lib/normalizers`.
- Added selector/view-model layer in `src/lib/selectors`.
- Hardened key pages/components for missing membership/creator/quota/payment states.
- Rebuilt Admin as operator-focused overview console with launch readiness module.
- Added reusable billing explanation components and integrated into Pricing/Profile/Creator/FAQ.
- Expanded glossary with grouped categories and additional launch/billing/workflow terms.

## Phase 16 · 2026-04-18
- Creator Studio 完成 IA 重排：增加 workspace tabs（Overview / Content / Assets / Pricing / Earnings / Review & Publish），减少单页拥挤感。
- Profile 重构为 Account Center，分离计划、配额、订单上传、收益与帮助区。
- Admin 增加 Founder Quick Actions 与更可执行的 Launch Readiness 区块。
- 新增 design-system 样式层（`ds-*`）与 5 类卡片体系（Primary / Secondary / Data / Status / Action）。
- Glossary 升级为双层解释：Quick explain + Learn more 链接。
- 新增 `getCatalogSnapshot` 与 `getAccountCenterSnapshot`，推进页面 selector-driven 消费。
- Home/Browse/Series/Watch 文案与展示增强 low-content launch 适配，并提升 trailer/preview/paid 区分。

## Phase 17 · 2026-04-18
- 顶部导航按 Viewer 与 Creator/Admin 分区重组，Creator 功能整合为下拉式 Creator Studio 入口。
- Creator Studio 下拉支持 Dashboard、My Series、Upload Assets、Episodes、Pricing & Monetization、Earnings、Service Orders、Creator Guidelines，以及高阶权益项。
- Browse 完成智能发现增强：15 类分类、10 种排序、智能搜索（标题/标签/创作者/简介/题材/付费类型）、搜索建议、热门关键词、空结果推荐、筛选状态显示。
- Creator Studio 增加更专业化的内容字段分组（基础信息、商业信息、资产信息、分发信息）。
- 首页新增 For Viewers / For Creators audience toggle；内容卡标签强化 Free Preview / Included with Subscription / Paid Unlock / In Review。
- 全站视觉精修：导航布局、按钮半径、筛选 chip、dropdown 质感、字体与层次细节。
