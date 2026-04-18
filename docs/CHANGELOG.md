# AIShortHub Changelog

## Phase 13 · 2026-04-18
- 重构 Viewer 定价：Free $0 / Pro Viewer $4.99 / Premium Viewer $9.99，并同步 Pricing、Profile、Watch、Series Detail 升级文案。
- 重构 Creator 方案：Basic(15%) / Pro(10%) / Studio(7%)，同步配额为 2/20/5GB、5/100/25GB、20/500/100GB。
- 新增 Revenue Model / Platform Monetization 模块，明确平台收入来源（广告优先 + 服务 + 订阅 + 解锁 + 低抽成）。
- 新增 Creator 自定价结构：整剧价、单集价、结局包、试看集配置，并贯通到 Creator Studio、详情与播放提示。
- 新增 Creator Earnings Breakdown：广告、订阅分成、整剧销售、单集销售、服务成本、平台抽成、净收入、待结算、已打款。
- Creator 上传系统升级为专业工作流：Trailer 与 Main Episodes 分离、资产类型扩展、分辨率/比例维度、QC 检查提示。
- 更新退款文案：Viewer/Creator/Add-on 独立且更清晰可信。
- README、USER_MANUAL、CREATOR_MANUAL、ADMIN_PLAYBOOK 同步更新。

## Phase 10 · 2026-04-13
- 新增统一深色下拉组件 `DarkSelect`，替换核心页面原生 select，修复暗色主题可读性问题。
- 新增 `QuotaAlertBar`（normal/near_limit/exhausted）用于 Creator Studio 与 Profile。
- 新增 `PlanHealthCard`，集中展示会员、创作者计划、抽成、审核优先级、额度使用与续费/重置信息。
- 新增 `CreatorActionCenter`，按优先级输出运营动作与 CTA。
- 新增 `SubmissionReadinessChecklist`，在提审前显示完成态/缺失态和计划兼容性。
