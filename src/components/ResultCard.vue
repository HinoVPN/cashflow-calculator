<template>
  <div class="finance-card result-card">
    <div class="card-header">
      <h2>
        <i class="fas fa-chart-line"></i> 每月現金流
      </h2>
    </div>
    <div class="card-body">
      <div class="cashflow-result">
        <div class="result-label">每月現金流</div>
        <div class="result-amount" id="cashflowResultContainer" :style="{ color: getCashflowColor }">
          <span id="monthlyCashflow">{{ financeStore.formatNumber(financeStore.monthlyCashFlow) }}</span> <span class="currency">HKD</span>
        </div>
      </div>
      <div class="calculation-formula">
        <i class="fas fa-calculator"></i> 計算公式: (年收入 - 年支出) ÷ 12
      </div>
      
      <!-- 工具列按鈕 -->
      <div class="toolbar" v-if="financeStore.incomeItems.length > 0 || financeStore.expenseItems.length > 0">
        <button id="exportReport" class="btn btn-primary" @click="showReport">
          <i class="fas fa-file-export"></i> 匯出財務報表 (Beta)
        </button>
      </div>
    </div>
  </div>
    
  <!-- 報告模態框 - 修改為使用Teleport，避免在DOM樹中嵌套 -->
  <Teleport to="body">
    <div class="modal fade" id="reportModal" tabindex="-1" aria-labelledby="reportModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="reportModalLabel">財務現金流報表</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
          </div>
          <div class="modal-body">
            <div id="reportContent" class="report-content">
              <div class="report-header">
                <h1 class="report-title">現金流財務分析報表</h1>
                <div class="report-subtitle">每月現金流詳細分析</div>
                <div class="report-date">報表生成日期：{{ report.date }}</div>
              </div>
              
              <!-- 收入部分 -->
              <div class="report-section" v-if="report.income.items.length > 0">
                <h2 class="report-section-title">收入明細</h2>
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width: 30%">項目名稱</th>
                      <th style="width: 15%">每月金額</th>
                      <th style="width: 15%">貨幣</th>
                      <th style="width: 10%">月數</th>
                      <th style="width: 10%">匯率</th>
                      <th style="width: 20%">年度金額 (HKD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in report.income.items" :key="item.id" class="income-row">
                      <td>{{ item.name || '未命名收入' }}</td>
                      <td class="amount-column">{{ financeStore.formatNumber(item.amount) }}</td>
                      <td>{{ item.currency }}</td>
                      <td class="amount-column">{{ item.months }}</td>
                      <td class="amount-column">{{ Number(item.rate).toFixed(4) }}</td>
                      <td class="amount-column">{{ financeStore.formatNumber(item.subtotal) }}</td>
                    </tr>
                    <tr class="total-row">
                      <td colspan="5">年度收入總計</td>
                      <td class="amount-column positive-amount">{{ financeStore.formatNumber(report.income.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- 支出部分 -->
              <div class="report-section" v-if="report.expense.items.length > 0">
                <h2 class="report-section-title">支出明細</h2>
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width: 30%">項目名稱</th>
                      <th style="width: 15%">每月金額</th>
                      <th style="width: 15%">貨幣</th>
                      <th style="width: 10%">月數</th>
                      <th style="width: 10%">匯率</th>
                      <th style="width: 20%">年度金額 (HKD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in report.expense.items" :key="item.id" class="expense-row">
                      <td>{{ item.name || '未命名支出' }}</td>
                      <td class="amount-column">{{ financeStore.formatNumber(item.amount) }}</td>
                      <td>{{ item.currency }}</td>
                      <td class="amount-column">{{ item.months }}</td>
                      <td class="amount-column">{{ Number(item.rate).toFixed(4) }}</td>
                      <td class="amount-column">{{ financeStore.formatNumber(item.subtotal) }}</td>
                    </tr>
                    <tr class="total-row">
                      <td colspan="5">年度支出總計</td>
                      <td class="amount-column negative-amount">{{ financeStore.formatNumber(report.expense.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- 總結 -->
              <div class="report-summary">
                <div class="summary-title">現金流摘要</div>
                <div class="summary-item">
                  <span>年度收入總計:</span>
                  <span class="positive-amount">{{ financeStore.formatNumber(report.income.total) }} HKD</span>
                </div>
                <div class="summary-item">
                  <span>年度支出總計:</span>
                  <span class="negative-amount">{{ financeStore.formatNumber(report.expense.total) }} HKD</span>
                </div>
                <div class="summary-item">
                  <span>年度現金流:</span>
                  <span :class="report.annualCashFlow >= 0 ? 'positive-amount' : 'negative-amount'">
                    {{ financeStore.formatNumber(report.annualCashFlow) }} HKD
                  </span>
                </div>
                <div class="summary-total">
                  <span>每月平均現金流:</span>
                  <span :class="report.monthlyCashFlow >= 0 ? 'positive-amount' : 'negative-amount'">
                    {{ financeStore.formatNumber(report.monthlyCashFlow) }} HKD
                  </span>
                </div>
              </div>
              
              <div class="report-footer">
                <p>此報表由「現金流計算器」自動生成 | 生成日期：{{ report.date }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
            <button type="button" class="btn btn-primary" id="printReport" @click="printReport">
              <i class="fas fa-print"></i> 列印報表
            </button>
            <button type="button" class="btn btn-success" id="downloadPDF" @click="exportPDF">
              <i class="fas fa-file-pdf"></i> 下載 PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFinanceStore } from '../stores/financeStore';
import html2pdf from 'html2pdf.js';

const financeStore = useFinanceStore();
const report = ref({
  date: '',
  income: { items: [], total: 0 },
  expense: { items: [], total: 0 },
  annualCashFlow: 0,
  monthlyCashFlow: 0
});

// 獲取現金流顏色
const getCashflowColor = computed(() => {
  if (financeStore.monthlyCashFlow > 0) {
    return 'var(--color-income)';
  } else if (financeStore.monthlyCashFlow < 0) {
    return 'var(--color-expense)';
  } else {
    return 'var(--color-primary)';
  }
});

// 儲存模態框實例
let reportModalInstance = null;

// 顯示報告
const showReport = () => {
  report.value = financeStore.generateReport();
  
  // 確保我們不會重複創建模態框實例
  if (!reportModalInstance) {
    const modalElement = document.getElementById('reportModal');
    reportModalInstance = new bootstrap.Modal(modalElement);
    
    // 為模態框添加事件監聽，在隱藏後釋放實例
    modalElement.addEventListener('hidden.bs.modal', () => {
      // 不需要刪除實例，只需在下次使用時重複使用
    });
  }
  
  reportModalInstance.show();
};

// 列印報告
const printReport = () => {
  // 創建一個新窗口來列印報表
  const printWindow = window.open('', '_blank');
  
  // 獲取報表內容
  const reportContent = document.getElementById('reportContent').cloneNode(true);
  
  // 獲取所有目前頁面的CSS樣式
  let styles = '';
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      const sheet = document.styleSheets[i];
      const rules = sheet.cssRules || sheet.rules;
      for (let j = 0; j < rules.length; j++) {
        styles += rules[j].cssText;
      }
    } catch (e) {
      // 某些跨域樣式表可能無法訪問，忽略錯誤
    }
  }
  
  // 添加額外的列印優化樣式
  const printStyles = `
    @media print {
      body { 
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }
    
    body {
      background-color: #f8f9fa;
      font-family: Arial, sans-serif;
      padding: 30px;
      color: #333;
    }
    
    .print-container {
      max-width: 900px;
      margin: 0 auto;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
      padding: 30px;
    }
    
    .report-content {
      max-width: none !important;
      margin: 0 !important;
      box-shadow: none !important;
    }
    
    .report-header {
      text-align: center;
      margin-bottom: 25px;
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 15px;
    }
    
    .report-title {
      font-size: 24px;
      margin-bottom: 10px;
      font-weight: bold;
      color: #4a6cf7;
    }
    
    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    .report-table th,
    .report-table td {
      border: 1px solid #dee2e6;
      padding: 10px;
    }
    
    .report-table th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    
    .amount-column {
      text-align: right;
    }
    
    .income-row {
      background-color: rgba(40, 167, 69, 0.1);
    }
    
    .expense-row {
      background-color: rgba(220, 53, 69, 0.1);
    }
    
    .total-row {
      font-weight: bold;
    }
    
    .positive-amount {
      color: #28a745 !important;
      font-weight: bold;
    }
    
    .negative-amount {
      color: #dc3545 !important;
      font-weight: bold;
    }
  `;
  
  // 創建HTML文檔內容
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>現金流報表</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
      <style>
        ${styles}
        ${printStyles}
      </style>
    </head>
    <body>
      <div class="print-container">
        ${reportContent.outerHTML}
      </div>
      <div class="d-print-none text-center mt-4">
        <button class="btn btn-primary" onclick="window.print()">
          <i class="fas fa-print"></i> 點擊列印
        </button>
        <button class="btn btn-secondary ms-2" onclick="window.close()">
          <i class="fas fa-times"></i> 關閉
        </button>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // 等待所有資源加載完畢再準備列印
  printWindow.onload = function() {
    // 確保樣式和字體正確加載
    setTimeout(() => {
      printWindow.focus();
    }, 1000);
  };
};

// 匯出 PDF
const exportPDF = () => {
  const reportContent = document.getElementById('reportContent');
  const options = {
    margin: [10, 10, 10, 10],
    filename: '現金流報表_' + financeStore.getCurrentDate() + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(options).from(reportContent).save();
};
</script>

<style scoped>
/* 為模態框添加額外的樣式，防止閃爍問題 */
:deep(.modal) {
  transform: none !important;
  will-change: opacity !important;
  pointer-events: auto !important;
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
}

:deep(.modal-dialog) {
  transform: none !important;
  transition: none !important;
  will-change: auto !important;
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
}

:deep(.modal-content) {
  animation: none !important;
  transition: none !important;
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
}

:deep(.modal-backdrop) {
  transition: none !important;
  animation: none !important;
  will-change: opacity !important;
}

/* 防止報表內容在模態框中閃爍 */
:deep(#reportContent) {
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
  transform: translateZ(0) !important;
  -webkit-transform: translateZ(0) !important;
}

/* 讓模態框中的表格更穩定 */
:deep(.report-table) {
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
}
</style> 