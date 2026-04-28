# AIShortHub Launch Checklist（AI Shorts Soft Launch → Production）

给运营/老板可直接执行的上线清单。当前定位：**AI-powered short video discovery and creator showcase platform**，不是单一 AI short drama 平台。

## A. 基础设施
1. **Custom domain setup**：主域名、`www`、证书、Checkout success/cancel 回跳地址。
2. **Production env vars setup**：Supabase、Stripe、Support Email、Creator Ops Email、Policy Email。
3. **Supabase production checklist**：生产库、RLS、备份、审计日志、Storage bucket、public/private asset policy。
4. **Stripe production checklist**：正式 key、Webhook、Checkout 回调、退款流程、viewer / creator / add-on 三条链路。
5. **Video hosting / CDN decision**：Mux、Cloudflare Stream、Bunny Stream、S3+CloudFront 或临时外链方案。软上线前必须明确 main video 存放方式。

## B. 运营准备
6. **Support email / pilot contact mode**：support 与 creatorops 邮箱可用，SLA 责任人明确。
7. **Terms / Privacy / Refund / Content Policy review**：法律文本最终确认，尤其是 AI 内容、商业素材、音乐授权、成人/血腥/暴力边界。
8. **First AI shorts batch readiness**：至少 2-3 个 AI short title/project，每个包含：
   - Static Poster
   - Vertical Cover 或 Square Thumbnail
   - Trailer / Teaser
   - 至少 1 个 Main Video
   - Synopsis
   - Tags / Category / Audience
   - Review notes（AI 工具说明、素材授权说明、敏感内容说明）
9. **Homepage merchandising**：Admin → AI Shorts Hero Control 设置 public hero poster、title、subtitle、CTA。
10. **Browse taxonomy readiness**：确认分类包含 Cinematic / Vertical / Animation / Music Video / Trailer / Commercial / Experimental / Sci-Fi / Horror / Comedy / Drama / Product Video。

## C. 核心流程验证
11. **Payment and checkout testing**：Viewer / Creator / Add-on 三条支付链路全走一遍。
12. **Creator upload testing**：Basic / Pro / Studio 三档 project、video、storage、motion poster、featured request 配额验证。
13. **Review queue testing**：提交、审核通过、拒绝、备注、状态回写都要走通。
14. **Watch / unlock testing**：Trailer、Preview Video、Main Video、subscription access、single-title / single-video unlock 文案都要清楚。
15. **Profile / notification testing**：升级、降级、下单、订单状态变化后，Profile Recent Activity 与 Header 通知中心都应出现记录。
16. **Support and refund testing**：Support 页面、Refund policy、Contact routing 全部可达。
17. **Soft launch checklist**：
   - 小流量开站
   - 监控支付、播放、提审、服务订单
   - 每日复盘并修正文案、政策解释和首页推荐

## D. Production 切换建议
- 先软上线 7-14 天，再切生产宣传流量。
- 维持 creator-friendly launch policy：低抽成（8/5/3）+ 有收入后才抽成。
- 若服务能力或审核能力不足，先限制新 creator 数量，避免体验崩盘。
- 内容少时，宁可少而精，不要把首页铺满低质量 placeholder。
- 对外宣传先主打：AI shorts discovery、creator showcase、low-commission creator-friendly launch。

## E. 每日 Founder 检查表
每天至少检查一次：
- 首页 hero 是否正常显示，移动端比例是否可接受。
- Browse 是否至少有 2-3 个可点击 AI shorts。
- 是否有待审核 project 积压。
- 是否有 pending_payment service order。
- 是否有 checkout 成功但 Profile plan 未同步。
- 是否有 support / refund / policy 链接无法打开。
- Header notification center 是否能看到最近事件。
- Admin Launch Readiness 是否有 blocking item。

## In-product Launch Readiness Mirror (Phase 15+)
Admin → Operator Overview now mirrors launch checks with Yes/No placeholders:
- production env configured
- custom domain configured
- support email configured
- Stripe live mode ready
- first AI shorts batch ready
- checkout tested
- creator upload tested
- review queue tested
- payout logic checked
- AI Shorts Hero configured
- notification / account activity tested

## Phase 16 Soft Launch Presentation Notes
- 当内容库存较低（2-3 个 AI short title）时：
  - 保持首页 Featured / Hero 区不断层
  - Browse 使用 Starter Picks 强化首发引导
  - 明确 Trailer、Teaser 与 Preview Video 的免费入口
  - 不要假装内容很多，重点强调 curator-picked launch batch
- Founder Console 每日检查：
  - 待审核是否积压
  - 待支付/支付异常是否升高
  - 支持入口是否可达
  - billing 文案是否仍清晰可理解
  - 首页是否仍准确表达 AI-powered short videos，而不是单一短剧平台

## Phase 19 Repositioning Notes
- Public copy should use **AI-powered short videos / AI shorts**.
- Creator copy should use **project / title / video**.
- Internal routes and data fields may still use `series` / `episodes` until a later data migration.
- Do not rush architectural rewrites during soft launch; prioritize stable UI, clear copy, and complete user flows.
