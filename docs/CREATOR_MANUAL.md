# AIShortHub 创作者说明书（Phase 14）

## 1. Creator 方案（低抽成）
- Creator Basic：$0 / **8%** / 2 active series / 20 episodes / 5GB
- Creator Pro：$19 / **5%** / 5 active series / 100 episodes / 25GB
- Studio：$49 / **3%** / 20 active series / 500 episodes / 100GB

> 核心原则：**仅在你有收入后才会抽成**。无收入，不抽成。

## 2. 月费与抽成的区别
- 月费：工具、额度、优先审核、支持服务。
- 抽成：你实际产生收入后按比例计提。

## 3. Creator onboarding（快速上手）
1. 选择 Creator Plan。
2. 上传 Trailer 与 Main Episodes。
3. 设置整剧价与单集价。
4. 完成 QC 后提交审核。
5. 在收益面板查看净收益、待打款。

## 4. 收益结构（creator-friendly）
1. Ad revenue share
2. Subscription pool share
3. Single-title sales
4. Single-episode sales
5. Net payout after low commission

## 5. 常见术语
- Platform Commission：有收入后才生效。
- Pending Payout：已确认、待打款收益。
- Net Earnings：扣除成本与抽成后的净额。
- Included / Discounted / Add-on / Optional：服务权益状态。


## Phase 15 更新（创作者侧）
- Creator Studio 引入统一计费解释：月费覆盖范围、抽成生效条件、服务费与平台抽成差异。
- 新增 Revenue Logic Breakdown（money in / deductions / net payout）。
- 上传与发布流程继续沿用 5 步法，但底层数据已走规范化层，降低 mock/real 字段不一致导致的异常。

## Phase 16 更新（创作者侧）
- Creator Studio 改为 workspace：
  1) Overview（健康度、额度、下一步）
  2) Content（剧集与分集）
  3) Assets（海报/Trailer/素材）
  4) Pricing（整剧价、单集价、结局包）
  5) Earnings（收入与扣减）
  6) Review & Publish（提审前检查）
- 计费解释更直白：
  - 你每月支付什么（creator plan fee）
  - 平台何时抽成（有收入后）
  - 哪些是可选服务费（add-on）
- 软上线低内容建议：每部首发剧至少 1 条 Trailer + 1-2 条 Preview + 若干 Main Episodes。

## Phase 17 更新（创作者工作区）
- 顶部新增下拉式 Creator Studio，统一进入 Dashboard、My Series、Upload Assets、Episodes、Pricing、Earnings 等模块。
- Creator Studio 表单结构升级为四大分组：
  1) 基础信息（标题、副标题、简介、分类、标签、语言、分级、地区、连载状态）
  2) 商业信息（包含模式、整剧价、单集价、结局价、广告资格、订阅池资格、推荐位请求、Promo 方案）
  3) 资产信息（Poster / Motion Poster / Vertical Cover / Thumbnail / Trailer / Subtitle / Caption / Promo）
  4) 分发信息（比例、分辨率、发布排期、TikTok hook、QC、审核状态）
- 高阶 Creator / Studio 会看到额外权益入口：Featured placement、Motion Poster、Promo tools、Priority support。

## Phase 18 更新（导航与交互闭环）
- Creator Studio 下拉已改为专业后台分组导航：
  1) Workspace：Dashboard / My Series / Upload Assets / Pricing & Monetization / Earnings
  2) Publishing：Review & Publish / Featured Placement / Creator Guidelines
  3) Growth Tools：Motion Poster / Promo Tools / Priority Support
  4) Service：Service Orders
- 每个导航项会显示轻量状态（例如 `3 drafts`、`2 files missing`、`Setup 80%`、`Locked`），hover 可查看短解释。
- 页面项与模块项已明确区分：
  - 页面：Dashboard、My Series、Upload Assets、Pricing & Monetization、Earnings、Service Orders、Creator Guidelines
  - 模块：Featured Placement（Add-on）、Motion Poster（Pro）、Promo Tools（Beta）、Priority Support（Studio only）
- 在 Creator Studio 中切换模块时，顶部会同步显示：
  - `Creator Studio / Current Module`
  - 当前模块标题与简短说明
  - 当前状态标签（Ready / Draft / In Progress / Locked / Pending Review）
  - 对应主 CTA（如 `Submit for Review`、`Upload Trailer`、`Open Service Orders`）
- 操作按钮已统一为更清晰的动作文案与状态反馈（hover / active / disabled），减少“点击无感知”问题。
