<script setup lang="ts">
import BuyerShareCard from './components/BuyerShareCard.vue'
import CalculatorPanel from './components/CalculatorPanel.vue'
import PresetBar from './components/PresetBar.vue'
import ResultPanel from './components/ResultPanel.vue'
</script>

<template>
  <main class="app">
    <section class="hero">
      <p class="badge">开源 · 本地计算 · 无需登录</p>
      <h1>跨境卖家利润计算器</h1>
      <p class="subtitle">
        输入产品成本、头程、尾程和费率，一眼看清建议售价、保本价和利润空间。
      </p>
    </section>

    <PresetBar />

    <section class="workspace-grid">
      <CalculatorPanel />
      <ResultPanel />
    </section>

    <BuyerShareCard />

    <footer class="footer">
      <p>本工具仅用于利润估算，实际费用请以平台、物流商和支付服务商账单为准。</p>
      <p>Open Source Seller Profit Calculator</p>
    </footer>
  </main>
</template>
