<script setup lang="ts">
import BuyerShareCard from './components/BuyerShareCard.vue'
import CalculatorPanel from './components/CalculatorPanel.vue'
import PresetBar from './components/PresetBar.vue'
import ResultPanel from './components/ResultPanel.vue'
</script>

<template>
  <main class="app">
    <section class="hero">
      <div>
        <p class="badge">本地计算 · 无需登录</p>
        <h1>跨境卖家计算器</h1>
      </div>
      <p class="subtitle">
        回答两个核心问题：我卖这个价能赚多少？我要赚这个利润应该卖多少？
      </p>
    </section>

    <PresetBar />

    <section class="workspace-grid">
      <ResultPanel />
      <div class="input-stack">
        <CalculatorPanel />
      </div>
    </section>

    <BuyerShareCard />

    <footer class="footer">
      <section>
        <h2>跨境卖家计算器怎么用</h2>
        <p>
          先输入当前售价、产品成本、头程尾程、仓储税费和其他固定扣款，再填写平台佣金、支付手续费、广告费率、活动扣点、达人佣金和其他比例扣款。页面会同时计算当前售价利润，并按目标利润率反推建议售价。
        </p>
      </section>
      <section>
        <h2>适合哪些人</h2>
        <p>
          适合跨境电商卖家、独立站卖家、平台店铺、海外仓报价、选品测算和团队报价核对。结果仅用于利润估算，实际费用请以平台、物流商、支付服务商和税务账单为准。
        </p>
      </section>
      <section>
        <h2>隐私和开源</h2>
        <p>
          本工具不需要登录，计算在浏览器本地完成，不上传你的成本、售价或利润数据。项目开源，便于自行部署、审查和二次修改。
        </p>
      </section>
    </footer>
  </main>
</template>
