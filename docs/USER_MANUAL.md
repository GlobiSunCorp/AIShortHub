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
