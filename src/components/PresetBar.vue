<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculator'

const store = useCalculatorStore()
</script>

<template>
  <section class="preset-bar" aria-label="场景模板">
    <button v-for="preset in store.presets" :key="preset.id" @click="store.applyPreset(preset)">
      <strong>{{ preset.name }}</strong>
      <small>{{ preset.description }}</small>
    </button>
  </section>
</template>
