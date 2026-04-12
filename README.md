# AIShortHub MVP

AIShortHub 已从“静态预览站”升级为“可运营的 AI 短剧平台 MVP”。

## 1) 项目目标
- TikTok 负责引流，AIShortHub 负责承接、试看、订阅、看全集。
- 创作者可上传剧集/分集并提交审核。
- 管理端可审核、上/下架、管理服务订单。
- 平台支持配套内容服务下单（Trailer、Cover、TikTok Promo Pack 等）。

## 2) 技术栈
- **前端**: Vite + React
- **路由**: 轻量自定义 Router（history API）
- **数据层**: Mock 数据 + Supabase 接口预留
- **支付层**: Stripe checkout session 结构预留 + mock fallback

## 3) 本地运行
```bash
npm install
npm run dev
npm run build
```

> 若环境无法访问 npm registry，可直接使用已安装依赖执行 `npm run build`。

## 4) 环境变量
复制 `.env.example` 为 `.env`，按需填写：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_CHECKOUT_ENDPOINT`
- `VITE_PLATFORM_TAKE_RATE`

未填写时默认进入 mock 模式，不影响 MVP 演示。

## 5) 数据模型（已实现基础结构）
数据集中在 `src/data/mockData.js`：
- `profiles`
- `memberships`
- `creators`
- `series`
- `episodes`
- `trailers`
- `tags`
- `serviceOrders`
- `payments`
- `payouts`
- `reviewLogs`
- `PLATFORM_CONFIG`（含平台抽成，默认 20%）

## 6) 已完成功能范围
### 访客与会员
- Home：Hero、平台定位、热门/最新、创作者招募、服务介绍、TikTok 引流说明。
- Browse：按标签/状态筛选 + 搜索剧名/创作者。
- Series Detail：封面区、简介、标签、创作者、分集列表、预告入口、会员提示。
- Watch：试看与会员权限逻辑（非会员仅预览集，会员看全集）。
- Pricing：Free / Pro Monthly / Pro Yearly，权益说明，checkout/mock 流程。
- Auth：登录/注册/忘记密码（mock 登录流程，Supabase Auth 预留）。
- Profile：会员状态、已解锁内容、订单记录。

### 创作者侧
- Creator Dashboard：总览指标、我的剧集、会员观看占位、服务订单入口。
- 创建剧集（标题/简介/标签/TikTok hook）。
- 上传分集（标题/排序/URL/试看开关）。
- 提交审核（进入 in_review）。
- 收益页面占位（可提现/累计收益 + 抽成说明）。

### 平台管理端
- Admin Dashboard：待审核、已发布、用户总数、创作者总数。
- 审核队列：通过/拒绝并可填原因。
- 内容管理：上架/下架。
- 用户管理：角色展示。
- 服务订单管理：查看并更新状态。

### 配套服务模块
- Service Orders 页面支持提交并展示：
  - Trailer Editing
  - Cover Design
  - Listing Packaging
  - TikTok Promo Pack
  - Subtitle / Localization

## 7) Supabase / Stripe 接入说明
### Supabase
- `src/lib/supabaseClient.js` 提供 REST 调用封装（基于 env）。
- 当前 UI 默认使用 mock 数据，后续可逐页替换为 Supabase 表查询/写入。

### Stripe
- `src/lib/stripeClient.js` 提供 `createStripeCheckoutSession`。
- 若配置 `VITE_STRIPE_CHECKOUT_ENDPOINT`，将调用后端创建 checkout session。
- 未配置时自动走 mock checkout，并保持前端流程可跑通。

## 8) 当前真实接入 vs Mock
- **真实接入**: 架构预留（Supabase/Stripe 接口层）。
- **Mock**: 当前数据读写、会员变更、支付确认、播放地址仍为 mock。

## 9) 下一阶段建议（最合理顺序）
1. 接 Supabase Auth（登录、注册、找回密码真实化）。
2. 接 Supabase Database + Storage（剧集、分集、服务订单、审核日志真实入库）。
3. 增加后端（Edge Functions/Node）创建 Stripe checkout session + webhook 同步会员。
4. 权限从前端 mock 迁移为 RLS + JWT claims（viewer/creator/admin）。
5. 增加最基础自动化测试（关键页面 smoke + 表单流程）。
6. 引入播放器与统计埋点（播放时长、完播率、付费转化漏斗）。

## 10) TikTok 本轮范围
- 已实现首页和创作者侧的 TikTok 引流说明。
- 已提供 Creator Dashboard 的 “TikTok Promo Pack” 服务入口。
- 已在数据结构中预留 `tiktokHook` 字段，供后续自动化集成使用。
