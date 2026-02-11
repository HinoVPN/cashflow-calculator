<template>
  <section class="finance-table-section income-section">
    <div class="table-header">
      <h2><i class="fas fa-arrow-circle-down"></i> 收入來源</h2>
      <button class="btn btn-add-row" @click="addIncome">
        <i class="fas fa-plus"></i> 新增
      </button>
    </div>
    <div class="table-wrapper">
      <table class="finance-table">
        <thead>
          <tr>
            <th>名稱</th>
            <th class="col-amount">金額</th>
            <th class="col-months">月數</th>
            <th class="col-currency">貨幣</th>
            <th class="col-annual">年度 (HKD)</th>
            <th class="col-actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="financeStore.incomeItems.length === 0">
            <td colspan="7" class="empty-cell">尚未添加收入項目</td>
          </tr>
          <tr v-for="item in financeStore.incomeItems" :key="item.id" class="data-row">
            <td>
              <input type="text" class="form-control form-control-sm" placeholder="名稱 (選填)" v-model="item.name" />
            </td>
            <td class="col-amount">
              <input type="number" class="form-control form-control-sm" placeholder="0" step="0.01" v-model="item.amount" />
            </td>
            <td class="col-months">
              <input type="number" class="form-control form-control-sm" min="1" v-model="item.months" />
            </td>
            <td class="col-currency">
              <select class="form-select form-select-sm" v-model="item.currency" @change="updateCurrency(item)">
                <option value="HKD">HKD</option>
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </td>
            <td class="col-annual amount-cell">
              {{ formatSubtotal(item) }}
            </td>
            <td class="col-actions">
              <button type="button" class="btn btn-sm btn-remove" @click="removeIncome(item.id)" title="刪除">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="financeStore.incomeItems.length > 0">
          <tr class="total-row">
            <td colspan="4" class="total-label">年收入總計</td>
            <td class="amount-cell total-amount">{{ financeStore.formatNumber(financeStore.totalIncome) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>
</template>

<script setup>
import { useFinanceStore } from '../stores/financeStore';

const financeStore = useFinanceStore();

const addIncome = () => financeStore.addIncomeItem();
const removeIncome = (id) => financeStore.removeIncomeItem(id);
const updateCurrency = (item) => financeStore.updateRate(item, item.currency);
const formatSubtotal = (item) => financeStore.formatNumber(financeStore.calculateIncomeSubtotal(item));
</script>
