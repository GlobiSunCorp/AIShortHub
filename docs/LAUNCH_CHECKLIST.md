# AIShortHub Launch Checklist（Soft Launch → Production）

给运营/老板可直接执行的上线清单。

## A. 基础设施
1. **Custom domain setup**：主域名、`www`、证书、回跳地址。
2. **Production env vars setup**：Supabase、Stripe、Support Email、Policy Email。
3. **Supabase production checklist**：生产库、RLS、备份、审计日志。
4. **Stripe production checklist**：正式 key、Webhook、Checkout 回调、退款流程。

## B. 运营准备
5. **Support email / pilot contact mode**：support 与 creatorops 邮箱可用，SLA 责任人明确。
6. **Terms / Privacy / Refund / Content Policy review**：法律文本最终确认。
7. **First content batch readiness**：至少 2-3 部短剧，含 Trailer + Main Episodes + 封面与字幕。

## C. 核心流程验证
8. **Payment and checkout testing**：Viewer / Creator / Add-on 三条支付链路全走一遍。
9. **Creator upload testing**：Basic / Pro / Studio 三档配额与提审流程验证。
10. **Soft launch checklist**：
   - 小流量开站
   - 监控支付、播放、提审
   - 每日复盘并修正文案与政策解释

## D. Production 切换建议
- 先软上线 7-14 天，再切生产宣传流量。
- 维持 creator-friendly launch policy：低抽成（8/5/3）+ 有收入后才抽成。
- 若服务能力或审核能力不足，先限制新 creator 数量，避免体验崩盘。


## In-product Launch Readiness Mirror (Phase 15)
Admin → Operator Overview now mirrors launch checks with Yes/No placeholders:
- production env configured
- custom domain configured
- support email configured
- Stripe live mode ready
- first content batch ready
- checkout tested
- creator upload tested
- review queue tested
- payout logic checked
