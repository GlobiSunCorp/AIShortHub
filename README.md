# AIShortHub MVP (Phase 10 · 下拉组件统一 + 配额预警 + 计划健康与动作中心)

本轮重点打磨试运营闭环：Creator 上传配额、退款策略拆分、支付按钮真实跳转、Support 可信化、文档体系补齐。

## 技术栈
- Vite + React
- Supabase Auth + Supabase REST + Supabase Storage（缺配置时自动 mock fallback）
- Stripe Checkout Session（前后端结构预留 + mock fallback）

## 本地运行
```bash
npm install
npm run dev
npm run build
```

## 环境变量（`.env.example`）
```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_STRIPE_SECRET_KEY=
VITE_STRIPE_WEBHOOK_SECRET=
VITE_STRIPE_CHECKOUT_ENDPOINT=
VITE_PLATFORM_TAKE_RATE=0.2
VITE_SUPPORT_PILOT_MODE=1
VITE_SUPPORT_EMAIL=support@aishorthub.com
VITE_CREATOR_OPS_EMAIL=creatorops@aishorthub.com
VITE_POLICY_EMAIL=policy@aishorthub.com
VITE_SUPPORT_FORM_URL=/support
```

## Phase 10 完成内容

### 1) Creator 上传限制与配额
- Creator Plan 新增：`maxActiveSeries`、`maxTotalEpisodes`、`monthlyAssetStorageLimitGb`、`monthlyUploadLimit`、`includedMotionPosterCount`、`reviewPriority`、`featuredPlacementEligibility`。
- Pricing 展示计划对比。
- Creator Studio 展示已用/可用配额，并在超限时给出明确提示。
- Profile 增加 Creator 配额摘要。

### 1) Membership Badge System
- 新增统一会员徽章组件，覆盖 Free/Pro/Premium Viewer、Creator Basic/Pro、Studio、Admin。
- Header、Profile、Creator Studio、Services、Pricing 统一展示身份徽章。
- 徽章支持 hover/tap 弹出权益卡，移动端可点按查看。

### 2) Usage Quota Badge System
- Creator 配额统一通过 `quotaService` 聚合输出：
  - `maxActiveSeries`
  - `maxTotalEpisodes`
  - `monthlyAssetStorageLimit` / `monthlyAssetStorageLimitGb`
  - `includedMotionPosterCount`
  - `maxFeaturedRequestsPerCycle`
  - `reviewPriority`
  - `commissionRate`
- 在 Profile 与 Creator Studio 展示简洁配额徽章（如 `2/5 Series`、`12GB/20GB`、`Motion Poster 0 left`）。

### 3) Entitlement Hover / Tap Card
- 徽章弹层改为迷你方案状态卡，支持：
  - 当前方案
  - 审核优先级
  - 平台抽成
  - 系列/分集/存储已用与剩余
  - Motion Poster / Featured request 剩余额度
  - 计费周期占位与升级 CTA
- Creator Studio 增加接近上限提醒（如 `Only 1 series slot left`、`2GB storage remaining`）。

### 4) Upload/Services 权益呈现
- Creator 上传资产模块增加 Included / Discounted / Add-on 说明。
- Services 卡片显示当前计划待遇，并给出专业化文案（Included in Studio / Discounted for Creator Pro / Add-on for Basic）。

### 2) 退款策略矩阵
- Refund Policy 拆分为：
  - Viewer Subscription Refund Policy
  - Creator Plan Refund Policy
  - Add-on Services Refund Policy
- Pricing / Services / Creator Studio / Profile 均提供退款入口。

### 3) 支付联动修复
- Pricing 的 Viewer / Creator 购买按钮：返回 `session.url` 时立即跳转。
- Services 下单：
  - Included 服务直接下单进入详情。
  - 需支付服务优先跳转 checkout。
- 所有支付动作提供 loading 与错误提示。
- Checkout success/cancel 展示支付类型与下一步建议。

### 4) 播放按钮统一化
- Browse / Home 卡片封面保留统一播放按钮。
- Home Hero 与 Series Detail 主视觉新增可见 Play 标识。

### 5) Contact / Support 真实化
- 支持 custom domain 模式与 pilot fallback 模式。
- 区分 Support / Creator Ops / Policy&Abuse 联系用途。
- Footer / FAQ / Support 文案一致。

## 文档入口
- 用户说明书：`docs/USER_MANUAL.md`
- 创作者说明书：`docs/CREATOR_MANUAL.md`
- 管理后台操作手册：`docs/ADMIN_PLAYBOOK.md`
- 更新日志：`docs/CHANGELOG.md`
- Supabase Schema：`docs/supabase-schema.sql`

## 真实接入范围 vs 仍为 mock

### 已接入真实结构
- Auth 登录/注册/找回/登出流程
- Profiles 同步
- 基础表读写服务层
- Storage 上传骨架
- Stripe Checkout 调用结构和回跳页

### 仍为 mock 或待下一轮
- Stripe webhook 完整落库与幂等对账
- 真实 RLS 策略与多租户权限细化
- 大视频转码与 CDN 分发（Mux/Cloudflare Stream）
- 运营工单系统与自动化风控


### 新增：运营化 Creator 面板升级
- 统一替换原生 select 为 `DarkSelect` 组件，覆盖 Demo Role Switcher、Browse 筛选、Admin 状态筛选与 Signup 账户类型。
- 新增 Quota Alert Bar（normal / near_limit / exhausted）并支持 CTA。
- 新增 Plan Health Card：展示 Viewer/Creator plan、commission、review priority、Series/Episodes/Storage/Motion Poster/Featured 使用情况、renewal 与 quota reset 日期。
- 新增 Creator Action Center：按 urgent / recommended / informational 分类行动项。
- 新增 Submission Readiness Checklist：提交前显式校验缺项与状态（ready to submit / needs revision / upgrade recommended）。
- Pricing / Services / Profile 补充 Included / Discounted / Add-on / quota / renewal 说明文案。
