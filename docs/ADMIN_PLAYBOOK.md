# AIShortHub 管理后台操作手册（AI Shorts Operator Playbook）

AIShortHub 的运营定位已经从单一 AI 短剧站，扩展为 **AI-powered short video discovery and creator showcase platform**。Admin 的核心工作是保证首页展示、内容审核、创作者服务、支付与结算链路稳定，并让平台看起来像一个专业的 AI shorts marketplace / showcase。

## 1. 商业模型运营重点
平台收入优先级：广告 > 服务 > 订阅 > 单次解锁 > 低抽成。
请避免把抽成当作第一收入来源来优化策略。冷启动阶段更重要的是吸引创作者、积累可看的 AI shorts、验证 viewer conversion。

## 2. Creator policy（冷启动）
- Creator 抽成为 8% / 5% / 3%。
- 仅在 creator 有收入后抽成。
- 月费和抽成分离，避免双重压榨感。
- 内容类型要保持开放：cinematic shorts、vertical videos、trailers、music videos、animations、commercials、product videos、experimental stories。

## 3. Admin onboarding
1. 用 **AI Shorts Hero Control** 管理首页 public hero。
2. 在 **AI Shorts Review Queue** 处理创作者提交。
3. 更新服务订单状态并留痕。
4. 关注 creator 收益异常、支付异常、投诉和素材合规问题。
5. 对照 Launch Checklist 完成生产切换。

## 4. Launch Checklist 管理
- 详细执行文档：`docs/LAUNCH_CHECKLIST.md`
- Admin 页面内置只读版，用于会议快速点检。
- 软上线前至少准备 2-3 个 AI short title/project，每个要有 poster、trailer/teaser、main video、tags、synopsis 和 review notes。

## 5. 软上线到正式切换
建议先软上线 7-14 天，确认支付、审核、客服、结算链路稳定后，再放大流量。

## 6. 首页运营标准
Public homepage 第一屏应该传达：
- 这是 AI-powered short videos 的发现平台。
- Viewer 可以直接探索 AI shorts。
- Creator 可以提交作品。
- 内容类型不局限于 drama，包括 music video、commercial、animation、product video 等。

Hero 管理时优先检查：
- Title 是否清楚。
- Synopsis 是否宽泛而不误导。
- CTA 是否分别指向 Explore / Submit / Creator。
- Poster 是否适配 16:9 与移动端 9:16。

## Phase 15 Operator Console
Admin 现包含 `Operator Overview`：
- 核心指标：总用户、总创作者、活跃订阅、活跃 Creator Plan、已发布、待审核、举报/标记、待处理服务单、支付问题、待打款。
- 运营卡片：Needs attention / Awaiting review / Support inbox / Revenue this cycle / Top AI shorts / Creators near quota。
- 近期活动流：聚合审核日志和服务单状态变化。
- Launch Readiness：站内核对项（生产环境、域名、客服邮箱、Stripe live、首批内容、checkout、上传、审核、结算检查）。

## Phase 16 Operator Guidance
- Admin 新增 Founder Quick Actions，适合 solo founder 日常：
  - 检查 public homepage hero
  - 审核待审 AI shorts
  - 检查支付流
  - 打开支持页
  - 快速回看计费逻辑
  - 查看最新上传/订单
- Launch Readiness 区块改为“已就绪 / 待配置”清单，便于非技术角色快速判断能否对外。
- 建议每周执行一次 launch rehearse：支付、上传、审核、客服、结算全链路走通。

## Phase 19 Operator Guidance（平台重新定位）
- 首页和 Browse 不应只像短剧平台，要明确支持 AI-powered short videos。
- Admin 文案应优先使用 AI shorts / title / project / video。
- 内部字段 `series / episodes` 暂时保留，不要急着做大规模数据库迁移。
- Review Queue 审核标准要覆盖：原创性、AI 生成声明、素材授权、成人/血腥/暴力边界、广告/商业内容标识、音乐授权。
- Creator services 应覆盖 broader creator needs：Motion Poster、Trailer Editing、Promo Pack、Localization、Listing Packaging。
