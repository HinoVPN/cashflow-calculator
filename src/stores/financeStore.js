import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFinanceStore = defineStore('finance', () => {
  const incomeItems = ref([]);
  const expenseItems = ref([]);

  const defaultRates = {
    HKD: 1,
    USD: 7.8,
    CNY: 1.13,
    EUR: 8.5,
    GBP: 9.8,
    JPY: 0.055,
  };

  const rates = ref({ ...defaultRates });

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  const addDefaultIncomeItem = (name = '') => {
    incomeItems.value.push({
      id: generateId(),
      name,
      amount: 15000,
      months: 12,
      currency: 'HKD',
    });
  };

  const addDefaultExpenseItem = (name = '') => {
    expenseItems.value.push({
      id: generateId(),
      name,
      amount: 6000,
      months: 12,
      currency: 'HKD',
    });
  };

  const addIncomeItem = () => {
    incomeItems.value.push({
      id: generateId(),
      name: '',
      amount: 0,
      months: 1,
      currency: 'HKD',
    });
  };

  const addExpenseItem = () => {
    expenseItems.value.push({
      id: generateId(),
      name: '',
      amount: 0,
      months: 1,
      currency: 'HKD',
    });
  };

  const removeIncomeItem = (id) => {
    const index = incomeItems.value.findIndex((item) => item.id === id);
    if (index !== -1) incomeItems.value.splice(index, 1);
  };

  const removeExpenseItem = (id) => {
    const index = expenseItems.value.findIndex((item) => item.id === id);
    if (index !== -1) expenseItems.value.splice(index, 1);
  };

  const updateRate = (item, currency) => {
    item.currency = currency;
  };

  const getRate = (currency) => rates.value[currency] || 1;

  const updateGlobalRate = (currency, value) => {
    const num = parseFloat(value);
    rates.value[currency] = Number.isNaN(num) ? 1 : num;
  };

  const calculateIncomeSubtotal = (item) =>
    (parseFloat(item.amount) || 0) *
    (parseFloat(item.months) || 0) *
    getRate(item.currency);

  const calculateExpenseSubtotal = (item) =>
    (parseFloat(item.amount) || 0) *
    (parseFloat(item.months) || 0) *
    getRate(item.currency);

  const totalIncome = computed(() =>
    incomeItems.value.reduce(
      (total, item) => total + calculateIncomeSubtotal(item),
      0
    )
  );

  const totalExpense = computed(() =>
    expenseItems.value.reduce(
      (total, item) => total + calculateExpenseSubtotal(item),
      0
    )
  );

  const annualCashFlow = computed(
    () => totalIncome.value - totalExpense.value
  );

  const monthlyCashFlow = computed(() => annualCashFlow.value / 12);

  const formatNumber = (number) =>
    Number(number || 0)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentDate = () => formatDate(new Date());

  const generateReport = () => ({
    date: getCurrentDate(),
    income: {
      items: incomeItems.value.map((item) => ({
        ...item,
        rate: getRate(item.currency),
        subtotal: calculateIncomeSubtotal(item),
      })),
      total: totalIncome.value,
    },
    expense: {
      items: expenseItems.value.map((item) => ({
        ...item,
        rate: getRate(item.currency),
        subtotal: calculateExpenseSubtotal(item),
      })),
      total: totalExpense.value,
    },
    annualCashFlow: annualCashFlow.value,
    monthlyCashFlow: monthlyCashFlow.value,
  });

  const initializeItems = ({ incomeName = '', expenseName = '' } = {}) => {
    if (incomeItems.value.length === 0) {
      addDefaultIncomeItem(incomeName);
    }
    if (expenseItems.value.length === 0) {
      addDefaultExpenseItem(expenseName);
    }
  };

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
    formatNumber,
    formatDate,
    getCurrentDate,
    generateReport,
    initializeItems,
  };
});
