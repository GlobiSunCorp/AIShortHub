# AIShortHub MVP（Phase 14 · 软上线准备 + 术语系统 + Onboarding + 低抽成策略）

本轮目标：把“可运行原型”推进到“可小范围正式上线”状态，重点是规则清晰、体验顺滑、文档可执行。

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

## Phase 14 重点

### 1) Creator-friendly 低抽成策略（默认）
- Creator Basic：$0 / **8%** commission / 2 active series / 20 episodes / 5GB
- Creator Pro：$19 / **5%** commission / 5 active series / 100 episodes / 25GB
- Studio：$49 / **3%** commission / 20 active series / 500 episodes / 100GB

> 规则：**平台抽成仅在 creator 产生收入后生效；无收入不抽成。**
> 月费用于工具、额度、优先服务，和收入抽成完全分离。

### 2) 商业模型表达升级（广告优先）
平台收入优先级：
1. Advertising revenue
2. Service revenue
3. Viewer subscriptions
4. Single-title / single-episode unlocks
5. Low platform commission

Creator 收入路径：
1. Ad revenue share
2. Subscription pool share
3. Single-title sales
4. Single-episode sales
5. Net payout after low commission

### 3) 全站术语解释系统
新增统一 glossary + hover/tap explain 组件，重点覆盖 Pricing / Profile / Creator Studio / Services。

### 4) Onboarding 系统
新增 role-based onboarding（Viewer / Creator / Admin），首次访问引导 + 快速步骤提示。

### 5) 页面切换与状态反馈
- 页面顶部增加当前位置与切换状态提示。
- CTA 行为统一 loading / success / error 反馈。

### 6) 首批内容上线支持
Home/Browse 支持“少量优质内容”的展示策略，避免内容少时出现空白感。

### 7) Production Readiness
- 新增 `docs/LAUNCH_CHECKLIST.md`。
- Admin 页面提供只读 checklist 快速核对。

## 生产切换说明（给非工程负责人）
1. 先完成域名、支付、数据库、客服邮箱四项基础配置。
2. 准备首批 2-3 部短剧（含 Trailer、主剧集、封面、字幕）。
3. 全流程演练：浏览→支付→观看→上传→提审→审核→结算。
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

### 仍为 mock/占位
- webhook 完整落库与幂等
- 真实 RLS 细粒度策略
- 视频转码/CDN（Mux/Cloudflare Stream）
- 广告实时分账与财务对账流水


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
- 新增 `src/lib/selectors/getCatalogSnapshot.js` 统一 Home/Browse 的筛选、标签、低内容态与分集统计。
- 新增 `src/lib/selectors/getAccountCenterSnapshot.js` 统一 Profile 的会员、计划、配额、收益、订单、上传快照。
- 页面减少 mixed raw shape 条件判断与散落计算，更多依赖 selector 输出。

### Soft launch 低内容策略
- 即便只有 2-3 部首发剧，Home/Browse 仍保持有层次展示，不出现“空白感”。
- 空状态统一升级为 premium empty-state 语气与视觉。
- Trailer / Preview / Main Episode / Paid Unlock 的表达更明显。


## Phase 17（第十五轮：导航重组 + Browse 智能发现 + Creator Studio 专业化）
- 顶部导航重组为 Viewer 主导航与 Creator/Admin 区域，Creator 入口改为下拉式 Creator Studio。
- Browse 增加分类体系、排序体系、智能搜索建议、热门关键词、快速筛选与空结果推荐。
- Creator Studio 增加更专业的内容结构：基础信息、商业信息、资产信息、分发信息四大分组。
- 首页新增 Audience Toggle（For Viewers / For Creators），更利于不同角色快速上手。
- 视觉系统精修：导航对齐、按钮圆角、chip 高亮、dropdown 层次、卡片信息标签更统一。
