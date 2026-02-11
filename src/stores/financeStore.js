import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';

export const useFinanceStore = defineStore('finance', () => {
  // 狀態
  const incomeItems = ref([]);
  const expenseItems = ref([]);
  
  // 預設匯率
  const defaultRates = {
    'HKD': 1,
    'USD': 7.8,
    'CNY': 1.13,
    'EUR': 8.5,
    'GBP': 9.8,
    'JPY': 0.055
  };

  // 全域匯率設定（可由使用者在畫面底部統一調整）
  const rates = ref({ ...defaultRates });
  
  // 生成唯一ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };
  
  // 添加預設收入項目
  const addDefaultIncomeItem = () => {
    incomeItems.value.push({
      id: generateId(),
      name: '工資收入',
      amount: 15000,
      months: 12,
      currency: 'HKD',
      rate: 1
    });
  };
  
  // 添加預設支出項目
  const addDefaultExpenseItem = () => {
    expenseItems.value.push({
      id: generateId(),
      name: '房租',
      amount: 6000,
      months: 12,
      currency: 'HKD',
      rate: 1
    });
  };
  
  // 添加收入項目
  const addIncomeItem = () => {
    incomeItems.value.push({
      id: generateId(),
      name: '',
      amount: 0,
      months: 1,
      currency: 'HKD',
      rate: 1
    });
  };
  
  // 添加支出項目
  const addExpenseItem = () => {
    expenseItems.value.push({
      id: generateId(),
      name: '',
      amount: 0,
      months: 1,
      currency: 'HKD',
      rate: 1
    });
  };
  
  // 刪除收入項目
  const removeIncomeItem = (id) => {
    const index = incomeItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      incomeItems.value.splice(index, 1);
    }
  };
  
  // 刪除支出項目
  const removeExpenseItem = (id) => {
    const index = expenseItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      expenseItems.value.splice(index, 1);
    }
  };
  
  // 更新匯率
  const updateRate = (item, currency) => {
    item.currency = currency;
  };
  
  // 取得指定貨幣匯率（如未設定則回傳 1）
  const getRate = (currency) => {
    return rates.value[currency] || 1;
  };

  // 更新全域匯率供使用者編輯
  const updateGlobalRate = (currency, value) => {
    const num = parseFloat(value);
    rates.value[currency] = Number.isNaN(num) ? 1 : num;
  };

  // 計算收入小計
  const calculateIncomeSubtotal = (item) => {
    return (parseFloat(item.amount) || 0) * (parseFloat(item.months) || 0) * getRate(item.currency);
  };
  
  // 計算支出小計
  const calculateExpenseSubtotal = (item) => {
    return (parseFloat(item.amount) || 0) * (parseFloat(item.months) || 0) * getRate(item.currency);
  };
  
  // 計算收入總額（年度）
  const totalIncome = computed(() => {
    return incomeItems.value.reduce((total, item) => {
      return total + calculateIncomeSubtotal(item);
    }, 0);
  });
  
  // 計算支出總額（年度）
  const totalExpense = computed(() => {
    return expenseItems.value.reduce((total, item) => {
      return total + calculateExpenseSubtotal(item);
    }, 0);
  });
  
  // 計算年度現金流
  const annualCashFlow = computed(() => {
    return totalIncome.value - totalExpense.value;
  });
  
  // 計算每月現金流
  const monthlyCashFlow = computed(() => {
    return annualCashFlow.value / 12;
  });
  
  // 計算收入百分比
  const getIncomePercentage = (amount) => {
    if (totalIncome.value === 0) return 0;
    return (amount / totalIncome.value * 100).toFixed(1);
  };
  
  // 計算支出百分比
  const getExpensePercentage = (amount) => {
    if (totalExpense.value === 0) return 0;
    return (amount / totalExpense.value * 100).toFixed(1);
  };
  
  // 格式化數字
  const formatNumber = (number) => {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // 格式化日期
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 獲取當前日期
  const getCurrentDate = () => {
    return formatDate(new Date());
  };
  
  // 生成財務報告
  const generateReport = () => {
    return {
      date: getCurrentDate(),
      income: {
        items: incomeItems.value.map(item => ({
          ...item,
          subtotal: calculateIncomeSubtotal(item)
        })),
        total: totalIncome.value
      },
      expense: {
        items: expenseItems.value.map(item => ({
          ...item,
          subtotal: calculateExpenseSubtotal(item)
        })),
        total: totalExpense.value
      },
      annualCashFlow: annualCashFlow.value,
      monthlyCashFlow: monthlyCashFlow.value
    };
  };
  
  // 初始化函數 - 檢查是否需要添加預設項目
  const initializeItems = () => {
    if (incomeItems.value.length === 0) {
      addDefaultIncomeItem();
    }
    
    if (expenseItems.value.length === 0) {
      addDefaultExpenseItem();
    }
  };
  
  // 在store創建時自動初始化
  initializeItems();

  return {
    incomeItems,
    expenseItems,
    defaultRates,
    rates,
    addIncomeItem,
    addExpenseItem,
    removeIncomeItem,
    removeExpenseItem,
    updateRate,
    getRate,
    updateGlobalRate,
    calculateIncomeSubtotal,
    calculateExpenseSubtotal,
    totalIncome,
    totalExpense,
    annualCashFlow,
    monthlyCashFlow,
    getIncomePercentage,
    getExpensePercentage,
    formatNumber,
    formatDate,
    getCurrentDate,
    generateReport,
    initializeItems
  };
}); 