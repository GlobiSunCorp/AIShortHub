# AIShortHub 管理后台操作手册

## 1. 审核剧集
1. 打开 `/admin` 查看审核队列。
2. 按状态筛选 draft/pending_review/published/rejected。
3. 填写审核备注并执行通过或拒绝。

## 2. 处理举报（占位流程）
- 目前通过 Policy/Abuse 联系邮箱收集工单。
- 在后台备注中记录证据链与处理结论。

## 3. 处理服务订单
1. 在后台找到服务订单。
2. 更新状态（pending/in_progress/completed/cancelled）。
3. 写入 admin note 以便 Support 回溯。

## 4. 查看支付/结算
- Checkout 成功后从回跳页进入 Profile 查看状态。
- 后续 webhook 落库后可在 payments/payouts 扩展对账。

## 5. 退款申请占位处理
- 按 Refund Matrix 分类：Viewer / Creator / Add-on。
- 确认是否满足人工审核条件（重复扣费、履约失败等）。
- 记录最终处理为退款、拒绝或 credit。
