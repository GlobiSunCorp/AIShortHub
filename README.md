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
