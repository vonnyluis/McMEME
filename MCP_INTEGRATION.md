# 麦当劳 MCP 接入说明

参考资料：[麦当劳 MCP 公开文档](https://open.mcd.cn/mcp/doc)，查阅日期：2026 年 10 月 14 日。

## 当前接入状态

**尚未连接真实 MCP 服务，也未进行真实接口调用验证。** 当前版本是无需 Token 的演示原型，不应将文档示例或演示数据描述为真实调用结果。

已实现：

- `lib/meme.ts` 中的 `query-meals` 响应格式转换：读取 `success`、以餐品编码为键的 `data.meals`、餐品 `name` 和十进制字符串 `currentPrice`，并标记数据来源为 `documentation-example`。
- 金额转换测试：使用整数分计算，拒绝格式错误、负数或精度超限的金额。
- 独立的六餐品演示菜单：界面明确显示演示状态；这些数据不是接口录制结果。

## 公开文档中的工具与字段

- **4.2.6 `query-nearby-stores`：** `searchType=2` 使用城市和关键词；`beType=1` 表示到店取餐，`beType=5` 表示得来速。
- **4.2.8 `query-meals`：** `data.categories[].meals[]` 通过餐品编码引用 `data.meals` 中的完整记录；`currentPrice`、`originalPrice` 为以元为单位的十进制字符串。`discountType` 与 `withOrder` 可能表示有条件的会员优惠，不能直接当作人人适用的价格。
- **4.2.9 `query-meal-detail`：** `rounds`、`modification`、`supportModify` 描述可选内容及修改能力，不能自行编造可用定制项。
- **4.2.10 `calculate-price`：** `data.price`、优惠和配送费用使用整数分，展示时才除以 100。请求须包含 `items[].productCode`、`quantity` 及所选门店和订单上下文。
- **4.2.11 `create-order`：** 属于独立写操作，可返回支付链接。本原型没有下单路由，也不会调用该工具。

## 计划中的真实调用流程

以下流程尚未实现或验证：

1. 双方分别选择真实门店。
2. 调用 `query-meals` 获取该门店餐品。
3. 有定制需求时调用 `query-meal-detail`。
4. 调用 `calculate-price` 获取当前价格。
5. 将真实餐品选择映射为原创漫画插画，双方共同创作并确认导出。

预期价值是让真实选餐成为共同创作的素材，把两人的饮食偏好变成可保存、可分享的互动故事；这属于后续目标，并非当前已验证能力。

接入前须核对最新 `tools/list` 和工具参数结构。Token 应仅保存在服务端，按参与者隔离，保留数据来源与查询时间，避免向另一位参与者泄露凭证。配置示例见 `mcp-config.example.json`，其中仅包含环境变量占位符。

## 参赛准备

当前离线原型不声称已满足参赛资格。已提交报名申请 #708，并根据审核反馈补充了与官方原文一致的 CONTEST_DECLARATION.md。真实 MCP 使用与验证仍待完成；文件齐全不代表已满足实际接入要求或已通过审核。
