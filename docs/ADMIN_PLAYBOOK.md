# AIShortHub 管理后台操作手册（Phase 14）

## 1. 商业模型运营重点
平台收入优先级：广告 > 服务 > 订阅 > 单次解锁 > 低抽成。
请避免把抽成当作第一收入来源来优化策略。

## 2. Creator policy（冷启动）
- Creator 抽成为 8% / 5% / 3%。
- 仅在 creator 有收入后抽成。
- 月费和抽成分离，避免双重压榨感。

## 3. Admin onboarding
1. Review Queue 处理审核。
2. 服务订单状态更新并留痕。
3. 关注 creator 收益异常与投诉。
4. 对照 Launch Checklist 完成生产切换。

## 4. Launch Checklist 管理
- 详细执行文档：`docs/LAUNCH_CHECKLIST.md`
- Admin 页面内置只读版，用于会议快速点检。

## 5. 软上线到正式切换
建议先软上线 7-14 天，确认支付、审核、客服、结算链路稳定后，再放大流量。


## Phase 15 Operator Console
Admin 现包含 `Operator Overview`：
- 核心指标：总用户、总创作者、活跃订阅、活跃 Creator Plan、已发布、待审核、举报/标记、待处理服务单、支付问题、待打款。
- 运营卡片：Needs attention / Awaiting review / Support inbox / Revenue this cycle / Top series / Creators near quota。
- 近期活动流：聚合审核日志和服务单状态变化。
- Launch Readiness：站内核对项（生产环境、域名、客服邮箱、Stripe live、首批内容、checkout、上传、审核、结算检查）。
