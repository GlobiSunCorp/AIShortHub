# AIShortHub MVP (Phase 3)

AIShortHub 在第二轮业务闭环基础上，完成了第三轮「体验与表单验证强化」，目标是让老板/产品同学可以更顺手地验收全链路。

## 技术栈
- Vite + React
- 自定义 history router（`resolveRoute`）
- Mock data + Supabase 兼容接口预留
- Stripe checkout-session 结构预留 + mock fallback

## 本地启动
```bash
npm install
npm run dev
npm run build
```

## 第三轮增强内容

### 1) 角色切换与测试体验
- 新增 Demo Role Switcher（Header 菜单 + Profile 页面）：可在 `guest / member(free/pro) / creator / admin` 间直接切换。
- 右上角状态文案统一为自然表达：
  - `Status: Guest`
  - `Status: Member / Free`
  - `Status: Member / Pro Monthly`
  - `Status: Creator`
  - `Status: Admin`
- Creator/Admin 无权限访问时，展示友好引导面板：
  - 当前角色
  - 无权限原因
  - 一键切换到可测试角色 + 跳转 Profile

### 2) Browse / 首页卡片体验
- 剧集卡封面新增明显的播放按钮 Overlay。
- 点击封面可直接进入 `/watch/:seriesId/1`（播放行为更自然）。
- 保留 `View detail` 入口。
- 首页热门/上新与 Browse 统一增强为“可播放内容卡”。

### 3) 关键表单验证与反馈
- 已为关键表单补齐前端校验与可见反馈：
  - Login
  - Signup
  - Creator 创建剧集
  - Creator 上传分集
  - Service order 提交
  - Admin 审核原因（reject 场景）
- 覆盖规则：必填、邮箱格式、URL 格式、文本最小长度。
- 覆盖状态：loading / success / error，避免“点击提交无反应”。

### 4) Service Orders 完善
- 新增路由：`/services/:orderId`。
- 提交成功后自动跳转订单详情页，展示：
  - 订单编号
  - 服务类型
  - 项目标题
  - 当前状态
  - 返回服务页 / 去个人中心查看

### 5) Creator / Admin 体验增强
- Creator：保存草稿、上传分集、提交审核都有成功反馈。
- Admin：approve/reject/订单状态更新都有明确结果反馈。
- reject 时审核原因为空会提示错误，避免静默失败。

### 6) Profile 摘要增强
- 新增账号摘要区：状态、角色、会员档位。
- Profile 内可直接使用 Demo Role Switcher，便于 QA 回归测试。

## 数据模型（`src/data/mockData.js`）
- `profiles`, `memberships`, `creators`
- `series`, `episodes`, `trailers`
- `serviceOrders`, `reviewLogs`
- `payments`, `payouts`, `ordersHistory`
- `PLATFORM_CONFIG`（平台抽成默认 20%，可配置）

## 真实接入 vs Mock
- **已真实预留结构**：Supabase client、Stripe checkout session 调用封装。
- **当前仍为 mock**：Auth 状态、内容写入、支付确认、播放地址、订单流转。

## 本轮明确未做
- 真实 TikTok API
- 复杂推荐算法
- 评论系统
- 复杂支付结算
- 过深后台权限系统
