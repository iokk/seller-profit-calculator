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
        <h1>跨境卖家利润计算器</h1>
      </div>
      <p class="subtitle">
        给客户或团队快速核对售价、成本、费用和利润，金额优先，细节轻量展示。
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
      <p>本工具仅用于利润估算，实际费用请以平台、物流商和支付服务商账单为准。</p>
      <p>Open Source Seller Profit Calculator</p>
    </footer>
  </main>
</template>
