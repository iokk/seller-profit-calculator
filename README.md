# 跨境卖家计算器

<p>
  <img width="360" alt="跨境卖家计算器页面预览" src="https://github.com/user-attachments/assets/76a2bf09-b12f-41e6-a11e-d5de05124d30" />
</p>

免费的开源跨境卖家利润计算器，帮助卖家快速回答两个问题：

- 当前售价能赚多少？
- 想达到目标利润率，建议售价应该是多少？

在线使用：<https://temu.nowdn.com/>

GitHub：<https://github.com/iokk/seller-profit-calculator>

## 适合场景

- Temu、Amazon、TikTok Shop、Shopee 等平台卖家
- 独立站、铺货、精品选品、海外仓和代发团队
- 活动报价、达人佣金、广告成本、客户报价核对
- 需要一个不登录、不上传数据的本地计算工具

## 核心功能

| 模块 | 用途 |
| --- | --- |
| 当前售价利润 | 输入售价后，查看单件利润和利润率 |
| 目标利润反推 | 输入目标利润率，反推建议售价 |
| 成本拆分 | 产品成本、头程、尾程、仓储、税费、退货损耗、其他固定扣款 |
| 比例扣款 | 平台佣金、支付费、广告费、活动扣点、达人佣金、其他比例扣款 |
| 报价核对 | 生成简洁的客户核对视图，方便截图或复制 |
| 汇率参考 | 支持参考汇率和自定义汇率，结果仅作参考 |

## 隐私说明

这个工具不需要登录。计算在浏览器本地完成，不上传你的成本、售价、利润或业务数据。

<details>
<summary><strong>计算逻辑</strong></summary>

固定成本：

```txt
产品成本 + 头程费用 + 尾程费用 + 仓储费 + 税费 + 退货损耗 + 其他固定扣款
```

变动费率：

```txt
平台佣金 + 支付手续费 + 广告费率 + 活动扣点 + 达人佣金 + 其他比例扣款
```

当前售价利润：

```txt
当前售价 - 固定成本 - 当前售价 × 变动费率
```

保本售价：

```txt
固定成本 / (1 - 变动费率)
```

建议售价：

```txt
固定成本 / (1 - 变动费率 - 目标利润率)
```

如果变动费率和目标利润率合计达到或超过 100%，工具会提示无法反推合理建议售价。

</details>

<details>
<summary><strong>本地开发</strong></summary>

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建静态文件：

```bash
npm run build
```

构建结果会生成在 `dist/` 目录。

</details>

<details>
<summary><strong>Docker 部署</strong></summary>

直接构建并启动：

```bash
docker compose up -d --build
```

默认访问地址：

```txt
http://127.0.0.1:8088
```

如果需要修改端口，可以调整 `docker-compose.yml`：

```yaml
ports:
  - "127.0.0.1:8088:80"
```

建议只绑定本机端口，再通过 Nginx、OpenResty、1Panel 或其他网关反向代理到公网域名。

</details>

<details>
<summary><strong>1Panel 反向代理部署</strong></summary>

推荐结构：

```txt
公网域名 -> 1Panel / OpenResty -> 127.0.0.1:8088 -> Docker 容器
```

示例：

```txt
temu.nowdn.com -> http://127.0.0.1:8088
```

部署步骤：

1. 在服务器安装 Docker 和 1Panel。
2. 上传项目或从 GitHub 拉取项目。
3. 在项目目录执行 `docker compose up -d --build`。
4. 在 1Panel 网站中创建反向代理。
5. 申请并开启 HTTPS 证书。
6. 访问域名确认页面、图标、统计代码和静态资源加载正常。

上线后建议检查：

```bash
curl -I https://你的域名
```

如果返回 `HTTP/2 200` 或 `HTTP/1.1 200 OK`，说明站点已经可访问。

</details>

## 技术栈

- Vue 3
- TypeScript
- Pinia
- Vite
- Docker / Nginx

## License

MIT
