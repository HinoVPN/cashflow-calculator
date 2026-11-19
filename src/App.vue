<template>
  <div class="d-flex flex-column min-vh-100 bg-body-tertiary">
    <AppHeader />

    <main class="flex-grow-1 py-4">
      <div class="container" style="max-width: 1100px">

        <div class="row g-3 mb-4">
          <div class="col-lg-6">
            <ItemTable type="income" />
          </div>
          <div class="col-lg-6">
            <ItemTable type="expense" />
          </div>
        </div>

        <div class="mb-3">
          <SummaryBar />
        </div>

        <div class="d-flex justify-content-end gap-2 mb-4">
          <button
            type="button"
            class="btn btn-outline-dark"
            @click="openRates"
          >
            {{ t('rateSettings') }}
          </button>
          <button
            type="button"
            class="btn btn-dark"
            :disabled="!hasItems"
            @click="openReport"
          >
            {{ t('exportReport') }}
          </button>
        </div>
      </div>
    </main>

    <footer class="border-top bg-white py-3">
      <div class="container text-center text-secondary small">
        © {{ currentYear }} {{ t('brand') }} | {{ t('footerBuilt') }}
      </div>
    </footer>

    <RateSettings ref="rateModal" />
    <ReportModal ref="reportModal" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import AppHeader from './components/AppHeader.vue';
import ItemTable from './components/ItemTable.vue';
import SummaryBar from './components/SummaryBar.vue';
import RateSettings from './components/RateSettings.vue';
import ReportModal from './components/ReportModal.vue';
import { useFinanceStore } from './stores/financeStore';
import { useI18n } from './i18n';

const financeStore = useFinanceStore();
const { t, locale } = useI18n();
const rateModal = ref(null);
const reportModal = ref(null);

const currentYear = computed(() => new Date().getFullYear());
const hasItems = computed(
  () =>
    financeStore.incomeItems.length > 0 || financeStore.expenseItems.length > 0
);

const seedDefaults = () => {
  financeStore.initializeItems({
    incomeName: t('defaultIncomeName'),
    expenseName: t('defaultExpenseName'),
  });
};

onMounted(() => {
  seedDefaults();
  document.title = `${t('brand')} | ${t('tagline')}`;
  document.documentElement.lang = locale.value === 'en' ? 'en' : 'zh-Hant';
});

watch(locale, () => {
  document.title = `${t('brand')} | ${t('tagline')}`;
  document.documentElement.lang = locale.value === 'en' ? 'en' : 'zh-Hant';
});

const openRates = () => {
  rateModal.value?.show();
};

const openReport = () => {
  reportModal.value?.show();
};
</script>
