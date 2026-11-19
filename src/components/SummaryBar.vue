<template>
  <section class="bg-white border rounded-3 p-4">
    <div class="row g-4">
      <div class="col-md-4">
        <div class="text-secondary small mb-1">{{ t('annualIncome') }}</div>
        <div class="fs-5 fw-semibold amount-num text-income">
          {{ financeStore.formatNumber(financeStore.totalIncome) }}
          <span class="fs-6 text-secondary">HKD</span>
        </div>
      </div>
      <div class="col-md-4">
        <div class="text-secondary small mb-1">{{ t('annualExpense') }}</div>
        <div class="fs-5 fw-semibold amount-num text-expense">
          {{ financeStore.formatNumber(financeStore.totalExpense) }}
          <span class="fs-6 text-secondary">HKD</span>
        </div>
      </div>
      <div class="col-md-4">
        <div class="text-secondary small mb-1">{{ t('monthlyCashflow') }}</div>
        <div class="summary-cashflow amount-num" :class="cashflowClass">
          {{ financeStore.formatNumber(financeStore.monthlyCashFlow) }}
          <span class="fs-6 fw-normal text-secondary">HKD</span>
        </div>
        <div class="text-secondary small mt-1">{{ t('formula') }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useFinanceStore } from '../stores/financeStore';
import { useI18n } from '../i18n';

const financeStore = useFinanceStore();
const { t } = useI18n();

const cashflowClass = computed(() => {
  if (financeStore.monthlyCashFlow > 0) return 'text-income';
  if (financeStore.monthlyCashFlow < 0) return 'text-expense';
  return 'text-body';
});
</script>
