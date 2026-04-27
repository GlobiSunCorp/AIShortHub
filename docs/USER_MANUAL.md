# AIShortHub 用户说明书（AI-Powered Short Video Discovery）

AIShortHub 现在定位为 **AI-powered short video discovery and creator showcase platform**。你可以在这里发现来自全球创作者的 cinematic AI shorts、vertical videos、trailers、music videos、animations、commercials、product videos 和 experimental stories。

## 1. 你会看到哪些付费方式
- **Viewer Subscription**：按月会员，解锁更多 AI shorts、高清播放、收藏/继续观看等 viewer 工具。
- **Single-title / Single-video unlock**：不订阅也可以单独解锁某个 title 或单个 video。
- **Free Preview**：Trailer / teaser 与部分 preview videos 可免费试看。

## 2. 观众 onboarding（首次建议）
1. 先在 `/browse` 探索 AI shorts，按类型、标签、格式、风格或 creator profile 筛选。
2. 先看 Trailer / Teaser / Preview videos。
3. 想持续观看再开通 Viewer Subscription。
4. 不想订阅也可以按 title / video 单独解锁。
5. 在 `/profile` 查看当前 viewer plan、账单状态、recent activity 与 recent changes。

## 3. 术语说明入口
页面中带 `ⓘ` 的术语可 hover/tap 查看解释，例如：
- Viewer Subscription
- Early Access
- Exclusive Content
- Entire Title Price / Single-video Unlock Price
- Platform Commission
- Subscription Pool Share

## 4. 支付与账单
1. 在 `/pricing` 选择 viewer plan 或 creator plan。
2. 跳转 Checkout（真实 Stripe 或 mock）。
3. 返回 `/checkout/success` 查看结果。
4. 在 `/profile` 确认 plan、recent activity、recent changes 是否更新。
5. 如果权益未同步，请通过 `/support` 联系客服并附上订单或截图。

## 5. 如何发现内容
- `/`：公共首页，展示 AIShortHub 的 AI shorts hero、精选内容与 creator showcase 入口。
- `/browse`：主发现页，支持分类、排序、搜索建议和标签筛选。
- `/watch/:series/:episode`：当前内部路由名称暂时保留，但用户可理解为 watch title/video。
- `/series/:id`：当前内部路由名称暂时保留，但页面表达会逐步使用 title/project/video 语言。

## 6. 支持的内容类型
Browse 与提交体系会逐步支持：
- Cinematic
- Vertical
- Animation
- Music Video
- Trailer
- Commercial
- Experimental
- Sci-Fi
- Horror
- Comedy
- Drama
- Product Video

## 7. 软上线阶段说明
平台当前处于 early launch 阶段，可能会逐步扩充内容库；首页和 Browse 已支持少量优质 AI shorts 的友好展示，不会因为内容少而显得空。

## Phase 15 更新（用户侧）
- 订阅、试看、单 title / 单 video 解锁说明已统一到可复用计费说明卡。
- FAQ 增加术语分类（Viewer/Creator/Billing/Payout/Workflow/Moderation），桌面 hover、移动端 tap 均可查看解释。
- 首页与浏览页使用统一数据快照，减少状态切换时的信息抖动或空白。

## Phase 16 更新（用户侧）
- Profile 已升级为 Account Center，更容易找到：会员方案、账单规则、退款入口、最近订单、recent activity 和 recent changes。
- 观看说明更清晰：Trailer / Teaser（始终可看）/ Preview Videos（免费试看）/ Main Videos（订阅或购买）。
- Home/Browse 在内容较少时也会保持推荐结构，不会显得空。
- 术语提示改为两层：悬浮快速解释 + Learn more 深入页。

### IA 快速导航
- `/profile`：Account Center 总览
- `/pricing`：会员与计费逻辑
- `/browse`：按标签、格式、风格和状态发现 AI shorts
- `/watch/:series/:episode`：播放与解锁入口（内部路由暂时保留）
- `/submit`：创作者提交入口

## Phase 17 更新（用户侧发现体验）
- 顶部导航更清楚：Home / Browse / Pricing / Services 面向普通观众，Creator 与 Admin 入口独立分区。
- Browse 支持更细分类和排序，并提供热门关键词与搜索建议。
- 浏览结果会显示更清晰标签：Free Preview、Included with Subscription、Paid Unlock、In Review。
- 首页根据登录状态分为 public / viewer / creator 三种体验。

## Phase 19 更新（平台重新定位）
- Public homepage 改为 **The Hub for AI-Powered Short Videos**。
- 平台不再只表达为 AI short drama，而是 broader AI-powered short video discovery + creator showcase。
- Browse 分类扩展到 trailer、music video、animation、commercial、product video、experimental 等内容。
- Submit 页面变成创作者提交 landing page，解释可提交内容、素材要求、审核过程和 featured opportunities。
