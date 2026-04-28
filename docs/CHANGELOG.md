# AIShortHub Changelog

## Phase 19 · Platform Repositioning
- Public positioning updated from a narrow AI short drama platform to a broader **AI-powered short video discovery and creator showcase platform**.
- Homepage public hero copy now centers on **The Hub for AI-Powered Short Videos**.
- Browse discovery expanded beyond drama-style viewing into format, genre, style, monetization mode, and creator-profile discovery.
- Category defaults expanded to Cinematic / Vertical / Animation / Music Video / Trailer / Commercial / Experimental / Sci-Fi / Horror / Comedy / Drama / Product Video.
- Submit page converted from a redirect-only page into a creator submission landing page with accepted formats, requirements, review process, featured opportunities, and Creator Dashboard CTA.
- Admin homepage control renamed to **AI Shorts Hero Control** and review queue renamed toward **AI Shorts Review Queue**.
- Profile, pricing, watch, title detail, and account activity language increasingly uses **AI shorts / title / project / video** while preserving current `series` / `episodes` internal routes and data shape.
- Creator Studio navigation language changed from My Series / Episodes toward **My Projects / Videos / AI short project workflow**.
- Launch checklist, user manual, creator manual, admin playbook, and README updated to match the broader AI shorts positioning.

## Phase 18 · 2026-04-19
- Creator Studio 下拉导航升级为四组：Workspace / Publishing / Growth Tools / Service，并支持分组标题、组间留白、专业后台风格层级。
- 下拉项新增状态元信息与标签体系（Module / Add-on / Pro / Beta / Studio only / Locked / Ready / In Progress）。
- 新增 `src/data/creatorStudio.js` 统一维护 Creator 导航结构、hash alias 与模块-工作区映射，减少分散硬编码。
- Creator Studio 页面实现模块级联动：模块切换后自动同步顶部 breadcrumb、标题、副标题、状态提示与主 CTA。
- 明确“页面 vs 模块”边界：Featured Placement / Motion Poster / Promo Tools / Priority Support 显示为模块面板并提供可执行入口。
- CTA 文案与交互态精修：`Submit for Review`、`Upload Trailer`、`Save & Continue to Next Step`、`Upgrade to Studio`、`Buy Add-on` 等动作化文案落地。
- 全局按钮与导航视觉细节增强：主次按钮层级、hover/active/disabled 反馈、Creator 菜单激活态与信息密度提升。
- App context bar 现支持 Creator hash 子模块文案，页面切换感更明确。

## Phase 17 · 2026-04-18
- 顶部导航按 Viewer 与 Creator/Admin 分区重组，Creator 功能整合为下拉式 Creator Studio 入口。
- Creator Studio 下拉支持 Dashboard、My Projects、Upload Assets、Videos、Pricing & Monetization、Earnings、Service Orders、Creator Guidelines，以及高阶权益项。
- Browse 完成智能发现增强：15 类分类、10 种排序、智能搜索（标题/标签/创作者/简介/题材/付费类型）、搜索建议、热门关键词、空结果推荐、筛选状态显示。
- Creator Studio 增加更专业化的内容字段分组（基础信息、商业信息、资产信息、分发信息）。
- 首页新增 public / viewer / creator 三种主页逻辑；内容卡标签强化 Free Preview / Included with Subscription / Paid Unlock / In Review。
- 全站视觉精修：导航布局、按钮半径、筛选 chip、dropdown 质感、字体与层次细节。

## Phase 16 · 2026-04-18
- Creator Studio 完成 IA 重排：增加 workspace tabs（Overview / Content / Assets / Pricing / Earnings / Review & Publish），减少单页拥挤感。
- Profile 重构为 Account Center，分离计划、配额、订单上传、收益与帮助区。
- Admin 增加 Founder Quick Actions 与更可执行的 Launch Readiness 区块。
- 新增 design-system 样式层（`ds-*`）与 5 类卡片体系（Primary / Secondary / Data / Status / Action）。
- Glossary 升级为双层解释：Quick explain + Learn more 链接。
- 新增 `getCatalogSnapshot` 与 `getAccountCenterSnapshot`，推进页面 selector-driven 消费。
- Home/Browse/Title/Watch 文案与展示增强 low-content launch 适配，并提升 trailer/preview/paid 区分。

## Phase 15
- Added data normalization layer in `src/lib/normalizers`.
- Added selector/view-model layer in `src/lib/selectors`.
- Hardened key pages/components for missing membership/creator/quota/payment states.
- Rebuilt Admin as operator-focused overview console with launch readiness module.
- Added reusable billing explanation components and integrated into Pricing/Profile/Creator/FAQ.
- Expanded glossary with grouped categories and additional launch/billing/workflow terms.

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
- 重构 Viewer 定价：Free $0 / Pro Viewer $4.99 / Premium Viewer $9.99，并同步 Pricing、Profile、Watch、Title Detail 升级文案。
- 重构 Creator 方案：Basic(15%) / Pro(10%) / Studio(7%)，同步配额为 2/20/5GB、5/100/25GB、20/500/100GB。
- 新增 Revenue Model / Platform Monetization 模块，明确平台收入来源（广告优先 + 服务 + 订阅 + 解锁 + 低抽成）。
- 新增 Creator 自定价结构：title price、single-video unlock price、special/finale unlock、preview video 配置，并贯通到 Creator Studio、详情与播放提示。
- 新增 Creator Earnings Breakdown：广告、订阅分成、title sales、single-video sales、服务成本、平台抽成、净收入、待结算、已打款。
- Creator 上传系统升级为专业工作流：Trailer 与 Main Videos 分离、资产类型扩展、分辨率/比例维度、QC 检查提示。
- 更新退款文案：Viewer/Creator/Add-on 独立且更清晰可信。
- README、USER_MANUAL、CREATOR_MANUAL、ADMIN_PLAYBOOK 同步更新。
