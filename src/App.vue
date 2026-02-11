<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <h1 class="app-title">現金流計算器</h1>
        <p class="app-description">輕鬆追蹤您的收入和支出，計算現金流量，做出明智的財務決策。</p>
      </div>
    </header>
    
    <main class="main-content">
      <div class="container">
        <div class="app-instructions compact">
          <i class="fas fa-info-circle"></i>
          <span>添加收入與支出項目，輸入每月金額、月數與貨幣，系統自動計算年總額 (HKD)。年薪請將月數設為 12。</span>
        </div>
        
        <div class="tables-row">
          <IncomeTable />
          <ExpenseTable />
        </div>
        
        <div class="row">
          <div class="col-md-12 mb-4">
            <ResultCard />
          </div>
        </div>

        <div class="row">
          <div class="col-md-12 mb-4">
            <RateSettings />
          </div>
        </div>
      </div>
    </main>
    
    <footer class="app-footer">
      <div class="container">
        <p>© {{ currentYear }} 現金流計算器 | 使用 Vue 3 和 Pinia 構建</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import IncomeTable from './components/IncomeTable.vue';
import ExpenseTable from './components/ExpenseTable.vue';
import ResultCard from './components/ResultCard.vue';
import RateSettings from './components/RateSettings.vue';

// 計算當前年份
const currentYear = computed(() => new Date().getFullYear());
</script>

<style>
/* 導入全局樣式 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');
</style> 