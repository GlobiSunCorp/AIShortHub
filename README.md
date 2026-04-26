# AIShortHub MVP（AI-Powered Short Video Discovery + Creator Showcase）

AIShortHub is evolving from an AI short drama MVP into a broader **AI-powered short video discovery and creator showcase platform**.

The public product direction is now:

> **The Hub for AI-Powered Short Videos**  
> Discover cinematic AI shorts, vertical videos, trailers, music videos, animations, commercials, product videos, and experimental stories from creators around the world.

本阶段目标：把“可运行原型”推进到“可小范围正式上线”的平台雏形，重点是定位清晰、规则清楚、体验顺滑、创作者友好、运营可执行。

## 技术栈
- Vite + React
- Supabase Auth + REST + Storage（缺配置自动 mock fallback）
- Stripe Checkout Session（mock + real 兼容）

## 本地运行
```bash
npm install
npm run dev
npm run build
```

## Product positioning

### Public-facing platform language
- Use **AI-powered short videos** or **AI shorts** for broad public pages.
- Use **title / project / video** for creator and catalog flows.
- Keep internal route/data compatibility for now: `/series/:id`, `seriesId`, and `episodes` can remain as implementation names until the data model is migrated.

### Supported content formats
AIShortHub should feel open to:
- Cinematic AI shorts
- Vertical videos
- Trailers / teasers
- Music videos
- Animation
- Commercials
- Product videos
- Experimental stories
- Sci-Fi / Horror / Comedy / Drama

## Phase 14+ Core Product Areas

### 1) Creator-friendly 低抽成策略（默认）
- Creator Basic：$0 / **8%** commission / 2 active projects / 20 videos / 5GB
- Creator Pro：$19 / **5%** commission / 5 active projects / 100 videos / 25GB
- Studio：$49 / **3%** commission / 20 active projects / 500 videos / 100GB

> 规则：**平台抽成仅在 creator 产生收入后生效；无收入不抽成。**
> 月费用于工具、额度、优先服务，和收入抽成完全分离。

### 2) 商业模型表达升级（广告优先）
平台收入优先级：
1. Advertising revenue
2. Service revenue
3. Viewer subscriptions
4. Single-title / single-video unlocks
5. Low platform commission

Creator 收入路径：
1. Ad revenue share
2. Subscription pool share
3. Single-title sales
4. Single-video sales
5. Net payout after low commission

### 3) 全站术语解释系统
新增统一 glossary + hover/tap explain 组件，重点覆盖 Pricing / Profile / Creator Studio / Services。

### 4) Onboarding 系统
新增 role-based onboarding（Viewer / Creator / Admin），首次访问引导 + 快速步骤提示。

### 5) 页面切换与状态反馈
- 页面顶部增加当前位置与切换状态提示。
- CTA 行为统一 loading / success / error 反馈。
- Checkout success/cancel 页面按 viewer / creator / add-on 分流。
- Profile Recent Activity 与 Header 通知中心读取 account event。

### 6) 首批内容上线支持
Home/Browse 支持“少量优质 AI shorts”的展示策略，避免内容少时出现空白感。

### 7) Production Readiness
- 新增 `docs/LAUNCH_CHECKLIST.md`。
- Admin 页面提供 AI Shorts Hero Control、内容审核、订单状态与 launch readiness 快速核对。

## 生产切换说明（给非工程负责人）
1. 先完成域名、支付、数据库、客服邮箱四项基础配置。
2. 准备首批 2-3 个 AI short title/project：每个至少包含 poster、trailer/teaser、1 个 main video、基础标签、简介与审核说明。
3. 全流程演练：浏览→支付→观看→提交→上传→提审→审核→服务订单→结算。
4. 软上线 7-14 天，确认稳定后再放大流量。

## 文档入口
- `docs/USER_MANUAL.md`
- `docs/CREATOR_MANUAL.md`
- `docs/ADMIN_PLAYBOOK.md`
- `docs/LAUNCH_CHECKLIST.md`
- `docs/CHANGELOG.md`
- `docs/supabase-schema.sql`

## 真实接入 vs mock
### 已接入结构
- Auth（登录/注册/找回/登出）
- Profiles + 基础表读写服务层
- Storage 上传骨架
- Stripe Checkout 调用结构与回跳页
- Account event / Recent Activity mock event flow
- Header notification center mock event flow

### 仍为 mock/占位
- webhook 完整落库与幂等
- 真实 RLS 细粒度策略
- 视频转码/CDN（Mux/Cloudflare Stream）
- 广告实时分账与财务对账流水
- 真实通知 read/unread 状态
- 真正的数据模型重命名（series/episodes → projects/videos）

## Phase 15（稳定性与运营清晰度）
- 新增 `src/lib/normalizers/*` 统一数据字段（`createdAt/created_at`、`seriesId/series_id`、`profileId/profile_id` 等）。
- 新增 `src/lib/selectors/*` 视图模型层，页面使用预处理快照而非散落业务逻辑。
- Admin 升级为 Operator Overview：核心运营指标、注意事项卡片、近期活动流、Launch Readiness 内置看板。
- 新增可复用计费解释组件：`BillingExplainerCard`、`RevenueFlowDiagram`、`FeeBreakdownCard`、`HowPricingWorksPanel`。
- FAQ 新增按类别术语系统，支持 hover/tap 解释。

### 数据规范化说明
UI 页面统一消费 normalizer 输出，避免页面层继续猜测 snake_case/camelCase。服务层仍兼容 Supabase 字段，normalizer 负责映射。

## Phase 16（IA + Design System + Data Hardening + Launch Prep UI）

### 信息架构（IA）
- Creator Studio 改为 workspace 结构：Overview / Content / Assets / Pricing / Earnings / Review & Publish。
- Profile 改为 Account Center：Account Overview、Plans & Billing、Quota & Entitlements、Orders & Uploads、Revenue Summary、Help。
- Admin 增加 Founder/Operator Quick Actions + Launch Readiness 实操区。

### Design System 统一约定
- 新增统一排版层：`ds-h1/ds-h2/ds-h3`、`ds-meta/ds-caption`。
- 新增卡片层级：`card-primary`、`card-secondary`、`card-data`、`card-status`、`card-action`、`empty-state`。
- 新增 section/header/tabs 规范：`ds-section`、`ds-section-heading`、`ds-tabs`、`ds-tab`。
- Glossary 改为双层解释：Quick explain（短解释）+ Learn more（长解释 + 跳转）。

### Normalized data 使用完成度提升
- 新增 `src/lib/selectors/getCatalogSnapshot.js` 统一 Home/Browse 的筛选、标签、低内容态与 video 统计。
- 新增 `src/lib/selectors/getAccountCenterSnapshot.js` 统一 Profile 的会员、计划、配额、收益、订单、上传、recent activity 快照。
- 页面减少 mixed raw shape 条件判断与散落计算，更多依赖 selector 输出。

### Soft launch 低内容策略
- 即便只有 2-3 个首发 AI short title，Home/Browse 仍保持有层次展示，不出现“空白感”。
- 空状态统一升级为 premium empty-state 语气与视觉。
- Trailer / Preview / Main Video / Paid Unlock 的表达更明显。

## Phase 17（导航重组 + Browse 智能发现 + Creator Studio 专业化）
- 顶部导航重组为 Viewer 主导航与 Creator/Admin 区域，Creator 入口改为下拉式 Creator Studio。
- Browse 增加分类体系、排序体系、智能搜索建议、热门关键词、快速筛选与空结果推荐。
- Creator Studio 增加更专业的内容结构：基础信息、商业信息、资产信息、分发信息四大分组。
- 首页新增 public / viewer / creator 三种主页逻辑，更利于不同角色快速上手。
- 视觉系统精修：导航对齐、按钮圆角、chip 高亮、dropdown 层次、卡片信息标签更统一。

## Phase 18（Creator Studio 导航重构 + 状态化下拉 + CTA 精修）
- Creator Studio 下拉重构为分组导航（Workspace / Publishing / Growth Tools / Service），并增加组间留白、标题层级与更明显激活态。
- 每个下拉项新增轻量状态信息（如 `3 drafts`、`2 files missing`、`Setup 80%`、`Locked`），并通过 hover hint 解释术语和状态。
- 明确区分“独立页面”与“模块功能”：
  - 独立页面：Dashboard、My Projects、Upload Assets、Pricing & Monetization、Earnings、Service Orders、Creator Guidelines。
  - 模块功能：Featured Placement（Add-on）、Motion Poster（Pro）、Promo Tools（Beta）、Priority Support（Studio only）。
- Creator Studio 页面增加“Creator Studio / Current Module”上下文头部，模块切换后标题、副标题、状态标签与主 CTA 同步变化，避免“像跳了又像没跳”。
- CTA 与按钮系统精修：主次按钮层级、hover/active/disabled 状态、文案动作感增强（如 `Save & Continue to Next Step`、`Submit for Review`、`Open Service Orders`）。
- Context bar 对 Creator hash 子模块感知增强，支持显示模块级说明。

## Phase 19（Platform repositioning）
- Public homepage repositioned to **The Hub for AI-Powered Short Videos**.
- Browse expanded beyond drama-style discovery into format, genre, style, monetization mode, and creator profile discovery.
- Categories expanded to Cinematic / Vertical / Animation / Music Video / Trailer / Commercial / Experimental / Sci-Fi / Horror / Comedy / Drama / Product Video.
- Submit page converted into a creator submission landing page.
- Admin renamed homepage management to **AI Shorts Hero Control**.
- Profile, pricing, watch, and title details increasingly use **project / title / video / AI shorts** language while preserving current routes and data fields.
