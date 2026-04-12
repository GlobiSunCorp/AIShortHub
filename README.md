# AIShortHub MVP (Phase 2)

AIShortHub 现已从展示型首页升级为可演示的「业务闭环 MVP」，覆盖会员、观看、创作者审核、服务订单四条核心链路。

## 技术栈
- Vite + React
- 自定义 history router（`resolveRoute`）
- Mock data + Supabase 兼容接口预留
- Stripe checkout-session 结构预留 + mock fallback

## 本地启动
```bash
npm install
npm run dev
npm run build
```

## 本轮闭环能力

### 1) 会员闭环
- 可用化 Auth 页面：Login / Signup / Forgot Password。
- 用户状态管理：`guest / member / creator / admin`。
- Pricing 支持 `Free / Pro Monthly / Pro Yearly`，并保留 checkout-session mock 流程。
- Watch 端权限：
  - guest：仅可观看 trailer 与前 1 集（前 45s 试看提示）
  - member/creator/admin：可观看完整分集
- 导航栏实时显示账号状态和会员档位。

### 2) 剧集详情 / 观看闭环
- Series Detail：封面字段、标题、简介、标签、创作者、分集列表、trailer 入口、会员解锁提示。
- Watch：当前分集信息、分集切换、非会员锁定提示、返回详情页入口。
- 详情页 → 观看页 → 定价页流转可通。

### 3) 创作者上传 / 审核闭环
- Creator Dashboard 支持：
  - 创建剧集（title/description/tags/cover/trailer/tiktokHook）
  - 上传分集（标题/序号/时长/URL/试看）
  - 提交审核后进入 `pending_review`
- Admin Review Queue 支持 `approve / reject`，并写入 review logs。
- 创作者端可看到剧集当前审核状态。

### 4) 服务订单闭环
- 新增 Services 页面可提交服务订单：
  - Trailer Editing
  - Cover Design
  - Listing Packaging
  - TikTok Promo Pack
  - Subtitle / Localization
- 表单字段：`service type / project title / request details / budget / contact / status`。
- Admin 页面支持查看订单并更新状态。

## 数据模型（`src/data/mockData.js`）
- `profiles`, `memberships`, `creators`
- `series`, `episodes`, `trailers`
- `serviceOrders`, `reviewLogs`
- `payments`, `payouts`, `ordersHistory`
- `PLATFORM_CONFIG`（平台抽成默认 20%，可配置）

## 真实接入 vs Mock
- **已真实预留结构**：Supabase client、Stripe checkout session 调用封装。
- **当前仍为 mock**：Auth 状态、内容写入、支付确认、播放地址。

## 本轮明确未做
- 真实 TikTok API
- 复杂推荐算法
- 评论系统
- 复杂支付结算
- 过深后台权限系统
