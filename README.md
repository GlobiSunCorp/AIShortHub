# AIShortHub MVP (Phase 8 · 上传限制、退款矩阵、支付联动与运营文档体系)

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

## Phase 8 完成内容

### 1) Creator 上传限制与配额
- Creator Plan 新增：`maxActiveSeries`、`maxTotalEpisodes`、`monthlyAssetStorageLimitGb`、`monthlyUploadLimit`、`includedMotionPosterCount`、`reviewPriority`、`featuredPlacementEligibility`。
- Pricing 展示计划对比。
- Creator Studio 展示已用/可用配额，并在超限时给出明确提示。
- Profile 增加 Creator 配额摘要。

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
