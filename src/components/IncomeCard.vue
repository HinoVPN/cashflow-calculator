<template>
  <div class="finance-card income-card">
    <div class="card-header">
      <h2>
        <i class="fas fa-arrow-circle-down"></i> 收入來源
      </h2>
    </div>
    <div class="card-body">
      <div id="incomeItems" class="items-container">
        <div v-if="financeStore.incomeItems.length === 0" class="text-center text-muted my-4">
          <p>尚未添加收入項目</p>
        </div>
        
        <div v-for="item in financeStore.incomeItems" :key="item.id" class="item-card income-item mb-2">
          <div class="item-header">
            <span class="item-label"><i class="fas fa-plus-circle"></i> 收入</span>
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
            <button class="btn btn-sm remove-btn remove-item" @click="removeIncome(item.id)">
              <i class="fas fa-trash-alt"></i> 刪除
            </button>
          </div>
        </div>
      </div>
      
      <button class="btn btn-add" @click="addIncome">
        <i class="fas fa-plus"></i> 新增收入項目
      </button>
      
      <div class="total-container" v-if="financeStore.incomeItems.length > 0">
        <div class="total-label">年收入總計</div>
        <div class="total-amount income-amount"><span id="incomeTotal">{{ financeStore.formatNumber(financeStore.totalIncome) }}</span> HKD</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFinanceStore } from '../stores/financeStore';

const financeStore = useFinanceStore();

const addIncome = () => {
  financeStore.addIncomeItem();
};

const removeIncome = (id) => {
  financeStore.removeIncomeItem(id);
};

const updateCurrency = (item) => {
  financeStore.updateRate(item, item.currency);
};

const formatSubtotal = (item) => {
  const subtotal = financeStore.calculateIncomeSubtotal(item);
  return financeStore.formatNumber(subtotal);
};
</script> 