<template>
  <section class="rate-settings-section">
    <div class="rate-settings-header">
      <h2><i class="fas fa-exchange-alt"></i> 匯率設定</h2>
      <p class="rate-settings-desc">
        編輯各貨幣兌換成 HKD 的匯率，所有收入與支出會即時依照這裡的匯率重新計算。
      </p>
    </div>
    <div class="rate-settings-body">
      <table class="rate-settings-table">
        <thead>
          <tr>
            <th>貨幣</th>
            <th>1 單位 換算成 HKD</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="code in currencyCodes" :key="code">
            <td class="rate-code">{{ code }}</td>
            <td>
              <div class="rate-input-group">
                <span class="rate-input-prefix">1 {{ code }} =</span>
                <input
                  type="number"
                  step="0.0001"
                  class="form-control form-control-sm"
                  :value="financeStore.rates[code]"
                  @input="onRateInput(code, $event.target.value)"
                />
                <span class="rate-input-suffix">HKD</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
// All comments in English
import { computed } from 'vue';
import { useFinanceStore } from '../stores/financeStore';

const financeStore = useFinanceStore();

// Currency list based on defaultRates keys so order is stable
const currencyCodes = computed(() => Object.keys(financeStore.defaultRates));

// Handle input change for a specific currency code
const onRateInput = (code, value) => {
  financeStore.updateGlobalRate(code, value);
};
</script>

