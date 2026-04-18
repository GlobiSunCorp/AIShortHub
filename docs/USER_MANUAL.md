# AIShortHub 用户说明书（Phase 14）

## 1. 你会看到哪些付费方式
- **Viewer Subscription**：按月会员，解锁完整内容。
- **Single-title / Single-episode unlock**：不订阅也能单买。

## 2. 观众 onboarding（首次建议）
1. 先在 `/browse` 看 Trailer 和试看。
2. 觉得合适再开通会员。
3. 不想订阅也可以按整剧/单集购买。
4. 在 `/profile` 查看续费日期与账单。

## 3. 术语说明入口
页面中带 `ⓘ` 的术语可 hover/tap 查看解释，例如：
- Viewer Subscription
- Early Access
- Exclusive Content
- Entire Title Price / Episode Unlock Price

## 4. 支付与账单
1. 在 `/pricing` 选择方案。
2. 跳转 Checkout（真实 Stripe 或 mock）。
3. 返回 `/checkout/success` 查看结果。
4. 在 `/profile` 确认订阅状态。

## 5. 软上线阶段说明
平台当前处于 early launch 阶段，可能会逐步扩充内容库；首页和 Browse 已支持少量内容的友好展示。


## Phase 15 更新（用户侧）
- 订阅、试看、单片/单集解锁说明已统一到可复用计费说明卡。
- FAQ 增加术语分类（Viewer/Creator/Billing/Payout/Workflow/Moderation），桌面 hover、移动端 tap 均可查看解释。
- 首页与浏览页使用统一数据快照，减少状态切换时的信息抖动或空白。

## Phase 16 更新（用户侧）
- Profile 已升级为 Account Center，更容易找到：会员方案、账单规则、退款入口、最近订单和上传记录。
- 观看说明更清晰：Trailer（始终可看）/ Preview（免费试看）/ Main Episodes（订阅或购买）。
- Home/Browse 在内容较少时也会保持推荐结构，不会显得空。
- 术语提示改为两层：悬浮快速解释 + Learn more 深入页。

### IA 快速导航
- `/profile`：Account Center 总览
- `/pricing`：会员与计费逻辑
- `/browse`：按标签和状态发现内容
- `/watch/:series/:episode`：播放与解锁入口
