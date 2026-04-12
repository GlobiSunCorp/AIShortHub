# AIShortHub MVP (Phase 6 · 真实接入与试运营准备)

本轮把项目从“演示原型”推进到“可小范围试运营”的产品骨架：真实账号、真实内容写入、真实素材上传、真实支付结构、基础审核工作台与运营政策页面。

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
```

## 第六轮完成内容

### 1) Supabase Auth 真实接入（带 mock 兜底）
- 新增统一 auth hook：`src/hooks/useAuth.js`。
- 支持：注册 / 登录 / 登出 / 忘记密码。
- 登录后自动同步 `profiles`（不存在则自动创建）。
- Demo Role Switcher 保留，但在真实模式下仅作为演示说明，不影响真实登录态。

### 2) Supabase 数据接口层 + 页面层分离
- 新增服务层：`src/lib/services/platformService.js`。
- 新增平台状态 hook：`src/hooks/usePlatformState.js`（真实加载 + mock fallback）。
- Creator Studio 提交剧集/分集/审核写入服务层。
- Services 下单写入 `service_orders`。
- Admin 读取并管理审核队列和服务订单状态。

### 3) Supabase Storage 上传骨架
- Creator Studio 支持 file picker 上传：Static Poster / Motion Poster / Thumbnail / Trailer / Video 占位。
- 上传成功后写入 `assets` 记录。
- 保留 URL 输入模式作为 fallback。
- 建议 bucket：`posters`, `motion-posters`, `thumbnails`, `trailers`（`episodes` 预留）。
- 后续可扩展 Mux：保持 `assets` 表 + `video_url` 双轨架构，逐步迁移到托管视频转码。

### 4) Stripe 结构接入
- 新增 `src/lib/services/billingService.js`。
- Checkout 类型拆分：
  - `viewer_subscription`
  - `creator_plan`
  - `addon_purchase`
- Pricing / Services 已接入购买入口。
- 新增成功/取消回跳页：`/checkout/success`, `/checkout/cancel`。

### 5) Admin 审核流骨架增强
- Review Queue 支持状态筛选：`draft / pending_review / published / rejected`。
- 审核备注输入 + reject 备注必填。
- `review_logs` 写入结构保留。
- 服务订单状态更新包含更新时间与备注占位。
- 预留 `report_count` / `flagged` 字段。

### 6) 试运营政策与支持页面
新增页面并加入 Footer 入口：
- FAQ
- Terms of Service
- Privacy Policy
- Refund Policy
- Contact / Support
- Creator Guidelines
- Content Policy
- Commission & Payout Policy

## 集中化配置
- 新增 `src/data/platformConfig.js`：
  - Viewer plans
  - Creator plans
  - Commission rules
  - Add-on pricing
  - Included / Discounted / Add-on 判定
- Pricing / Profile / Services / Creator Studio 共用配置。

## Supabase Schema 建议
见：`docs/supabase-schema.sql`

包含核心表：
- `profiles`
- `viewer_subscriptions`
- `creator_plans`
- `creators`
- `series`
- `episodes`
- `assets`
- `service_orders`
- `payments`
- `payouts`
- `review_logs`

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

## 下一轮建议
1. 加 Stripe webhook consumer（写 `payments`/`viewer_subscriptions`/`creator_plans`）。
2. 完整 RLS + policy（viewer/creator/admin）。
3. Admin 加举报处理面板和证据链。
4. Creator 收益看板接 `payouts` 真实流水。
