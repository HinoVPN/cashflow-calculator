<template>
  <div class="finance-card expense-card">
    <div class="card-header">
      <h2>
        <i class="fas fa-arrow-circle-up"></i> 支出來源
        <span class="header-subtitle">(含儲蓄/投資)</span>
      </h2>
    </div>
    <div class="card-body">
      <div id="expenseItems" class="items-container">
        <div v-if="financeStore.expenseItems.length === 0" class="text-center text-muted my-4">
          <p>尚未添加支出項目</p>
        </div>
        
        <div v-for="item in financeStore.expenseItems" :key="item.id" class="item-card expense-item mb-2">
          <div class="item-header">
            <span class="item-label"><i class="fas fa-minus-circle"></i> 支出</span>
            <input 
              type="text" 
              class="form-control form-control-sm item-name" 
              placeholder="名稱 (選填)"
              v-model="item.name"
            >
          </div>
          
          <div class="item-body">
            <div class="row">
              <div class="col-7">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text">金額</span>
                  <input 
                    type="number" 
                    class="form-control amount" 
                    placeholder="輸入金額"
                    step="0.01"
                    v-model="item.amount"
                  >
                </div>
              </div>
              <div class="col-5">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text">月數</span>
                  <input 
                    type="number" 
                    class="form-control unit-months" 
                    value="1" 
                    min="1"
                    v-model="item.months"
                  >
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-7">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text">貨幣</span>
                  <select 
                    class="form-select currency-unit" 
                    v-model="item.currency"
                    @change="updateCurrency(item)"
                  >
                    <option value="HKD" selected>HKD</option>
                    <option value="USD">USD</option>
                    <option value="CNY">CNY</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
              </div>
              <div class="col-5">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text">匯率</span>
                  <input 
                    type="number" 
                    class="form-control rate" 
                    step="0.0001"
                    v-model="item.rate"
                  >
                </div>
              </div>
            </div>
          </div>
          
          <div class="item-footer">
            <div class="item-subtotal-container">
              <small>年度金額: <span class="item-subtotal">{{ formatSubtotal(item) }}</span> HKD</small>
            </div>
            <button class="btn btn-sm remove-btn remove-item" @click="removeExpense(item.id)">
              <i class="fas fa-trash-alt"></i> 刪除
            </button>
          </div>
        </div>
      </div>
      
      <button class="btn btn-add" @click="addExpense">
        <i class="fas fa-plus"></i> 新增支出項目
      </button>
      
      <div class="total-container" v-if="financeStore.expenseItems.length > 0">
        <div class="total-label">年支出總計</div>
        <div class="total-amount expense-amount"><span id="expenseTotal">{{ financeStore.formatNumber(financeStore.totalExpense) }}</span> HKD</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFinanceStore } from '../stores/financeStore';

const financeStore = useFinanceStore();

const addExpense = () => {
  financeStore.addExpenseItem();
};

const removeExpense = (id) => {
  financeStore.removeExpenseItem(id);
};

const updateCurrency = (item) => {
  financeStore.updateRate(item, item.currency);
};

const formatSubtotal = (item) => {
  const subtotal = financeStore.calculateExpenseSubtotal(item);
  return financeStore.formatNumber(subtotal);
};
</script> 