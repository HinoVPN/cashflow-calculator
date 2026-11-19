<template>
  <section class="bg-white border rounded-3 p-3 h-100">
    <div class="d-flex align-items-center justify-content-between mb-3 gap-2">
      <h2 class="h6 mb-0 fw-semibold">
        {{ title }}
        <span v-if="subtitle" class="text-secondary fw-normal">{{ subtitle }}</span>
      </h2>
      <button type="button" class="btn btn-sm btn-outline-dark" @click="onAdd">
        {{ t('add') }}
      </button>
    </div>

    <div
      class="table-responsive table-scroll"
      :class="{ 'is-scrollable': items.length > 6 }"
    >
      <table class="table table-sm align-middle mb-0">
        <thead>
          <tr class="text-secondary small">
            <th scope="col">{{ t('name') }}</th>
            <th scope="col" class="text-end col-amount">{{ t('amount') }}</th>
            <th scope="col" class="text-end col-months">{{ t('months') }}</th>
            <th scope="col" class="col-currency">{{ t('currency') }}</th>
            <th scope="col" class="text-end">{{ t('annual') }}</th>
            <th scope="col" class="text-end"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="items.length === 0">
            <td colspan="6" class="text-secondary text-center py-4">{{ emptyText }}</td>
          </tr>
          <tr v-for="item in items" :key="item.id">
            <td>
              <input
                type="text"
                class="form-control form-control-sm"
                :placeholder="t('namePlaceholder')"
                v-model="item.name"
              />
            </td>
            <td class="col-amount">
              <input
                type="number"
                class="form-control form-control-sm text-end"
                placeholder="0"
                step="0.01"
                v-model="item.amount"
              />
            </td>
            <td class="col-months">
              <input
                type="number"
                class="form-control form-control-sm text-end px-1"
                min="1"
                v-model="item.months"
              />
            </td>
            <td class="col-currency">
              <select
                class="form-select form-select-sm"
                v-model="item.currency"
                @change="financeStore.updateRate(item, item.currency)"
              >
                <option v-for="code in currencies" :key="code" :value="code">
                  {{ code }}
                </option>
              </select>
            </td>
            <td class="amount-num small fw-medium text-nowrap">
              {{ formatSubtotal(item) }}
            </td>
            <td class="text-end">
              <button
                type="button"
                class="btn btn-sm btn-link text-secondary text-decoration-none p-1"
                :aria-label="t('delete')"
                @click="onRemove(item.id)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                  />
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="items.length > 0"
      class="d-flex justify-content-between align-items-center pt-2 mt-1 border-top"
    >
      <span class="fw-semibold small">{{ totalLabel }}</span>
      <span class="amount-num fw-semibold" :class="totalClass">
        {{ financeStore.formatNumber(total) }}
      </span>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useFinanceStore } from '../stores/financeStore';
import { useI18n } from '../i18n';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (v) => v === 'income' || v === 'expense',
  },
});

const financeStore = useFinanceStore();
const { t } = useI18n();

const currencies = computed(() => Object.keys(financeStore.defaultRates));
const isIncome = computed(() => props.type === 'income');

const items = computed(() =>
  isIncome.value ? financeStore.incomeItems : financeStore.expenseItems
);
const total = computed(() =>
  isIncome.value ? financeStore.totalIncome : financeStore.totalExpense
);
const title = computed(() =>
  t(isIncome.value ? 'incomeSources' : 'expenseSources')
);
const subtitle = computed(() =>
  isIncome.value ? '' : t('expenseSubtitle')
);
const emptyText = computed(() =>
  t(isIncome.value ? 'emptyIncome' : 'emptyExpense')
);
const totalLabel = computed(() =>
  t(isIncome.value ? 'totalIncome' : 'totalExpense')
);
const totalClass = computed(() =>
  isIncome.value ? 'text-income' : 'text-expense'
);

const onAdd = () =>
  isIncome.value ? financeStore.addIncomeItem() : financeStore.addExpenseItem();
const onRemove = (id) =>
  isIncome.value
    ? financeStore.removeIncomeItem(id)
    : financeStore.removeExpenseItem(id);
const formatSubtotal = (item) =>
  financeStore.formatNumber(
    isIncome.value
      ? financeStore.calculateIncomeSubtotal(item)
      : financeStore.calculateExpenseSubtotal(item)
  );
</script>

<style scoped>
.table-scroll.is-scrollable {
  /* header + ~6 data rows */
  max-height: calc(2.25rem + 6 * 2.75rem);
  overflow-y: auto;
}
.table-scroll.is-scrollable thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
}
.col-amount {
  width: 5.5rem;
}
.col-months {
  width: 3.25rem;
}
.col-currency {
  width: 3.25rem;
}
.col-amount .form-control,
.col-months .form-control,
.col-currency .form-select {
  width: 100%;
}
.col-amount .form-control,
.col-months .form-control {
  appearance: textfield;
  -moz-appearance: textfield;
}
.col-amount .form-control::-webkit-outer-spin-button,
.col-amount .form-control::-webkit-inner-spin-button,
.col-months .form-control::-webkit-outer-spin-button,
.col-months .form-control::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}
.col-currency .form-select {
  background-image: none;
  padding-left: 0.35rem;
  padding-right: 0.35rem;
  appearance: none;
  font-size: 0.8125rem;
}
</style>
