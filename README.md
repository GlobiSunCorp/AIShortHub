# AIShortHub MVP (Phase 5)

AIShortHub 在前几轮基础上完成第五轮「商业化、Creator Studio 与精细化上传」升级：从功能演示型 MVP 进一步走向商业逻辑清晰、创作者体验分层明确的平台版本。

## 技术栈
- Vite + React
- 自定义 history router（`resolveRoute`）
- Mock data + Supabase 兼容命名预留
- Stripe checkout-session 结构预留 + mock fallback

## 本地启动
```bash
npm install
npm run dev
npm run build
```

## 第五轮增强内容

### 1) Pricing 双体系重构
- Pricing 页面拆分为 **For Viewers** 与 **For Creators** 两大区块。
- Viewer Subscription：`Free / Pro Viewer / Premium Viewer`，展示月费/年费、完整剧集、画质、抢先看、专属内容、观看工具、推荐优先级。
- Creator Plan：`Creator Basic / Creator Pro / Studio`，展示月费、Platform Commission、审核优先级、Motion Poster、TikTok Promo Pack、推荐位、数据面板、支持等级。
- 新增“平台抽成说明”：明确订阅费、服务费、平台抽成及 Included 与 Add-on 差异。

### 2) 商业化配置集中化
- 新增 `src/data/monetization.js` 统一管理：
  - `VIEWER_SUBSCRIPTIONS`
  - `CREATOR_PLANS`
  - `ADD_ON_SERVICES`
  - `DEFAULT_PLATFORM_COMMISSION`
  - 价格/抽成格式化与权益判定 helper
- 避免在页面散落硬编码，后续可平滑接 Supabase/后台配置表。

### 3) Creator Studio 导航 + 浮动工具箱
- 顶部导航新增 **Creator Studio**（仅 creator/admin 或拥有 creator plan 的账户显示）。
- 新增浮动 **Floating Creator Toolbox**：
  - 桌面端右下角
  - 默认收起/点击展开
  - 当前页面高亮
  - 高阶创作者显示额外入口（Motion Poster、TikTok Promo Pack、结算入口等）

### 4) Creator 上传流程升级为多步骤
- Creator 页面升级为 4 步工作流：
  1. Basic Info
  2. Assets
  3. Episodes
  4. Publishing & Review
- 增加步骤校验、上一步/下一步、保存草稿、步骤完成反馈、提交审核反馈、草稿摘要。
- 明确拆分“内容资产（Assets）”与“平台增值服务（Add-on Services）”。

### 5) Services 页面升级为专业下单中心
- 服务卡片区：展示名称、说明、价格、是否 Included/Discounted。
- 服务表单区：显示当前 Creator Plan 与权益状态，提交前校验。
- 服务详情页增强：订单编号、服务类型、状态、方案权益、加购价格、下一步建议、按身份跳转。

### 6) Profile 升级为账号中心
- 展示：Status、Viewer Subscription、Creator Plan、Platform Commission、Included Benefits。
- 展示订阅概览、Add-on Services 权益状态、最近订单与最近上传内容摘要。
- Demo Role Switcher 保留并更自然融入账号中心。

### 7) 术语统一
- 统一使用以下术语：
  - Viewer Subscription
  - Creator Plan
  - Platform Commission
  - Add-on Services
  - Included Benefits
- 状态文案统一支持：
  - `Status: Guest`
  - `Status: Member / Free|Pro Viewer|Premium Viewer`
  - `Status: Creator / Basic|Pro|Studio`
  - `Status: Admin`

## 数据模型（`src/data/mockData.js`）
- `profiles` 增加 `viewerPlan / creatorPlan` mock 字段。
- `memberships` 增加 `creatorPlan` 字段（与 Viewer Subscription 并行）。
- `serviceOrders` 增加 `entitlement / addOnPrice / nextStep` 等订单展示字段。
- `PLATFORM_CONFIG` 增加 `settlementCycle` mock 结算说明。

## 真实接入 vs Mock
- **已真实预留结构**：Supabase 命名风格、Stripe checkout-session 调用封装、Creator/Services/Profile 数据流。
- **当前仍为 mock**：
  - Auth 与权限判定
  - 支付确认与账务对账
  - 资产文件上传存储
  - 审核队列 SLA 与推荐位分发
  - Creator 收益与结算自动化

## 本轮明确未做
- 真实对象存储上传（S3/Supabase Storage）
- 真正的计费与分账清结算
- 真实推荐系统与投放回传
- 真实客服工单系统
