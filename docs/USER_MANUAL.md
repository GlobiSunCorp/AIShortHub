# AIShortHub 用户说明书（试运营）

## 1. 网站如何使用
1. 首页浏览热门剧集与平台说明。
2. Browse 页面按标签/状态筛选剧集。
3. Pricing 页面选择 Viewer 或 Creator 方案。
4. Profile 页面查看账号状态、方案、配额与订单。

## 2. 主要页面作用
- `/`：平台介绍 + 热门内容。
- `/browse`：剧集浏览与筛选。
- `/series/:id`：剧集详情与播放入口。
- `/pricing`：Viewer/Creator 定价与退款入口。
- `/creator`：创作者上传与提审。
- `/services`：加购服务下单。
- `/admin`：审核与订单管理。
- `/support`：Support / Creator Ops / Policy 联系。

## 3. 如何测试角色
- Demo 模式下在 Profile 使用 `DemoRoleSwitcher` 切换 viewer / creator / admin。
- 真实模式下请使用真实登录账号测试。

## 4. 如何测试支付
1. 进入 Pricing 或 Services。
2. 点击购买按钮，确认出现 loading。
3. 确认跳转 checkout（真实 Stripe 或 mock success/cancel）。
4. 在 `/checkout/success` 与 `/checkout/cancel` 验证支付类型与返回入口。

## 5. 如何测试上传
1. 切到 Creator 账号进入 `/creator`。
2. 在 Step 2 上传素材，观察配额提示。
3. 在 Step 4 提交审核，超限时应显示明确错误。

## 6. 如何查看订单与审核状态
- Profile：查看近期服务订单与上传记录。
- Services 详情页：查看单个订单状态。
- Admin：查看审核队列和服务订单处理。


## 7. 会员徽章与权益卡
- 顶部头像附近会显示当前身份徽章（Viewer / Creator / Studio / Admin）。
- 鼠标悬停（桌面）或点击（移动）可查看当前计划权益摘要。
- 在 Profile 页面可查看配额徽章与详细额度卡。

## 8. 配额提醒
- Creator 账号会显示 Series / Episodes / Storage / Motion Poster / Featured 请求额度。
- 当接近限制时，系统会给出轻提醒与升级建议。

## 9. 新版运营提醒与健康卡
- Creator Studio 顶部会显示 Quota Alert Bar，提示额度风险和下一步动作。
- Profile 展示轻量提醒条与 Plan Health Card，可查看续费日与配额重置日。
- 全站下拉已统一为深色主题组件，移动端点击、键盘操作更稳定。

## Iteration 11: Viewer Membership Experience
- Top-right plan badge now opens a detailed status card (plan identity + entitlement details + upgrade path).
- Viewer accounts now only receive Viewer upgrade prompts (Pro Viewer / Premium Viewer).
- New Sticky Upgrade Rail provides persistent upgrade context: current plan, quality, full access, early access, exclusive content.
