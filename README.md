# AIShortHub MVP（Phase 13 · 商业模型重构 + Creator 自定价 + 专业视频工作流）

本轮将平台商业结构从“订阅 + 抽成导向”重构为：
**广告优先 + 服务收入 + Viewer 订阅 + 单次解锁 + 低抽成**，并升级 Creator Studio 上传流程为更专业的视频 CMS 工作流。

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

## 关键改动（Phase 13）

### 1) Viewer 定价重构（低门槛）
- Free：$0（仅预告/试看）
- Pro Viewer：$4.99/月（完整内容）
- Premium Viewer：$9.99/月（更高质量 + 抢先看 + 专属内容）
- Pricing / Profile / Watch / Series Detail 的升级引导与访问说明已同步。

### 2) Creator 方案重构（低抽成）
- Creator Basic：$0 / 15% commission / 2 active series / 20 episodes / 5GB
- Creator Pro：$19 / 10% commission / 5 active series / 100 episodes / 25GB
- Studio：$49 / 7% commission / 20 active series / 500 episodes / 100GB
- Sticky Upgrade Rail、Profile、Pricing、配额卡与方案说明已同步。

### 3) 广告优先平台化模型
新增 Revenue Model / Platform Monetization 模块，展示：
- 平台收入：广告、服务订单、订阅、单次解锁、低抽成
- 创作者收入：广告分成、订阅池分成、整剧/单集销售、服务成本、平台抽成、净收入

### 4) Creator 自定价系统
- 支持整剧价（Entire title price）
- 支持单集解锁价（Episode unlock price）
- 支持结局额外包（Finale unlock）
- 支持试看集配置（Free preview episodes）
- Creator Studio 提供配置入口，Series Detail / Watch / Profile 可读到这些价格结构。

### 5) 收益面板升级（钱从哪里来）
- 新增 Earnings Breakdown（广告、订阅分成、整剧销售、单集销售、服务成本、平台抽成、净收入、待结算、已打款）
- 提供堆叠条 + 明细卡 + 环比占位（本期 vs 上期）

### 6) 上传流程升级（Trailer 与 Main Episodes 分离）
- Trailer 独立资产：标题、封面、时长、CTA、比例/分辨率
- Main Episodes 独立工作流：分集顺序、试看/收费、单集价格、上架时间、字幕语言、审核状态
- QC 占位检查：缺封面、缺预告、分辨率不足、比例不推荐、时长异常、文件过大、命名不规范、缺字幕

### 7) 退款策略同步
- Viewer：低摩擦取消，已开始计费周期默认不按比例退款
- Creator：独立退款规则，上传/审核/权益消耗后不可退款
- Add-on：未开工可退，开工后默认不可退

## 文档入口
- `docs/USER_MANUAL.md`
- `docs/CREATOR_MANUAL.md`
- `docs/ADMIN_PLAYBOOK.md`
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
