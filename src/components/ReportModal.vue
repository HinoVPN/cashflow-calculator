<template>
  <Teleport to="body">
    <div
      class="modal fade"
      id="reportModal"
      tabindex="-1"
      :aria-labelledby="reportTitleId"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" :id="reportTitleId">{{ t('reportTitle') }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              :aria-label="t('close')"
            ></button>
          </div>
          <div class="modal-body">
            <div id="reportContent">
              <div class="text-center border-bottom pb-3 mb-4">
                <h1 class="h4 mb-1">{{ t('reportHeading') }}</h1>
                <div class="text-secondary small">{{ t('reportSubtitle') }}</div>
                <div class="text-secondary small mt-1">
                  {{ t('reportDate') }}{{ report.date }}
                </div>
              </div>

              <div v-if="report.income.items.length > 0" class="mb-4">
                <h2 class="h6">{{ t('incomeDetails') }}</h2>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr class="small text-secondary">
                        <th>{{ t('itemName') }}</th>
                        <th class="text-end">{{ t('monthlyAmount') }}</th>
                        <th>{{ t('currency') }}</th>
                        <th class="text-end">{{ t('months') }}</th>
                        <th class="text-end">{{ t('rate') }}</th>
                        <th class="text-end">{{ t('annualAmountHkd') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in report.income.items" :key="item.id">
                        <td>{{ item.name || t('unnamedIncome') }}</td>
                        <td class="amount-num">
                          {{ financeStore.formatNumber(item.amount) }}
                        </td>
                        <td>{{ item.currency }}</td>
                        <td class="amount-num">{{ item.months }}</td>
                        <td class="amount-num">{{ Number(item.rate).toFixed(4) }}</td>
                        <td class="amount-num">
                          {{ financeStore.formatNumber(item.subtotal) }}
                        </td>
                      </tr>
                      <tr class="fw-semibold">
                        <td colspan="5">{{ t('totalIncome') }}</td>
                        <td class="amount-num text-income">
                          {{ financeStore.formatNumber(report.income.total) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-if="report.expense.items.length > 0" class="mb-4">
                <h2 class="h6">{{ t('expenseDetails') }}</h2>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr class="small text-secondary">
                        <th>{{ t('itemName') }}</th>
                        <th class="text-end">{{ t('monthlyAmount') }}</th>
                        <th>{{ t('currency') }}</th>
                        <th class="text-end">{{ t('months') }}</th>
                        <th class="text-end">{{ t('rate') }}</th>
                        <th class="text-end">{{ t('annualAmountHkd') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in report.expense.items" :key="item.id">
                        <td>{{ item.name || t('unnamedExpense') }}</td>
                        <td class="amount-num">
                          {{ financeStore.formatNumber(item.amount) }}
                        </td>
                        <td>{{ item.currency }}</td>
                        <td class="amount-num">{{ item.months }}</td>
                        <td class="amount-num">{{ Number(item.rate).toFixed(4) }}</td>
                        <td class="amount-num">
                          {{ financeStore.formatNumber(item.subtotal) }}
                        </td>
                      </tr>
                      <tr class="fw-semibold">
                        <td colspan="5">{{ t('totalExpense') }}</td>
                        <td class="amount-num text-expense">
                          {{ financeStore.formatNumber(report.expense.total) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="border rounded-3 p-3 bg-body-tertiary">
                <div class="fw-semibold mb-2">{{ t('cashflowSummary') }}</div>
                <div class="d-flex justify-content-between small mb-1">
                  <span>{{ t('totalIncome') }}</span>
                  <span class="amount-num text-income">
                    {{ financeStore.formatNumber(report.income.total) }} HKD
                  </span>
                </div>
                <div class="d-flex justify-content-between small mb-1">
                  <span>{{ t('totalExpense') }}</span>
                  <span class="amount-num text-expense">
                    {{ financeStore.formatNumber(report.expense.total) }} HKD
                  </span>
                </div>
                <div class="d-flex justify-content-between small mb-2">
                  <span>{{ t('annualCashflow') }}</span>
                  <span class="amount-num" :class="signClass(report.annualCashFlow)">
                    {{ financeStore.formatNumber(report.annualCashFlow) }} HKD
                  </span>
                </div>
                <div class="d-flex justify-content-between fw-semibold">
                  <span>{{ t('monthlyAvgCashflow') }}</span>
                  <span class="amount-num" :class="signClass(report.monthlyCashFlow)">
                    {{ financeStore.formatNumber(report.monthlyCashFlow) }} HKD
                  </span>
                </div>
              </div>

              <p class="text-secondary small mt-3 mb-0">
                {{ t('reportFooter') }}{{ report.date }}
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              {{ t('close') }}
            </button>
            <button type="button" class="btn btn-outline-dark" @click="printReport">
              {{ t('printReport') }}
            </button>
            <button type="button" class="btn btn-dark" @click="exportPDF">
              {{ t('downloadPdf') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import html2pdf from 'html2pdf.js';
import { useFinanceStore } from '../stores/financeStore';
import { useI18n } from '../i18n';

const financeStore = useFinanceStore();
const { t } = useI18n();

const reportTitleId = 'reportModalLabel';
const report = ref({
  date: '',
  income: { items: [], total: 0 },
  expense: { items: [], total: 0 },
  annualCashFlow: 0,
  monthlyCashFlow: 0,
});

let reportModalInstance = null;

const signClass = (value) => {
  if (value > 0) return 'text-income';
  if (value < 0) return 'text-expense';
  return '';
};

const show = () => {
  report.value = financeStore.generateReport();
  const modalElement = document.getElementById('reportModal');
  if (!reportModalInstance) {
    reportModalInstance = new window.bootstrap.Modal(modalElement);
  }
  reportModalInstance.show();
};

const printReport = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const reportContent = document.getElementById('reportContent').cloneNode(true);
  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${t('printWindowTitle')}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
  <style>
    .text-income { color: #198754 !important; }
    .text-expense { color: #dc3545 !important; }
    .amount-num { font-variant-numeric: tabular-nums; text-align: right; }
    body { padding: 2rem; }
  </style>
</head>
<body>
  <div class="container">
    ${reportContent.outerHTML}
    <div class="text-center mt-4 d-print-none">
      <button class="btn btn-dark" onclick="window.print()">${t('clickPrint')}</button>
      <button class="btn btn-outline-secondary ms-2" onclick="window.close()">${t('close')}</button>
    </div>
  </div>
</body>
</html>`);
  printWindow.document.close();
};

const exportPDF = () => {
  const reportContent = document.getElementById('reportContent');
  const options = {
    margin: [10, 10, 10, 10],
    filename: `${t('pdfFilenamePrefix')}${financeStore.getCurrentDate()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };
  html2pdf().set(options).from(reportContent).save();
};

defineExpose({ show });
</script>
