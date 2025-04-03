document.addEventListener('DOMContentLoaded', function() {
    let incomeCounter = 0;
    let expenseCounter = 0;
    
    // 添加收入項目
    document.getElementById('addIncome').addEventListener('click', function() {
        addItem('income');
    });
    
    // 添加支出項目
    document.getElementById('addExpense').addEventListener('click', function() {
        addItem('expense');
    });
    
    // 初始化各添加一個項目
    addItem('income');
    addItem('expense');
    
    function addItem(type) {
        const container = type === 'income' ? document.getElementById('incomeItems') : document.getElementById('expenseItems');
        const counter = type === 'income' ? ++incomeCounter : ++expenseCounter;
        const itemId = `${type}-item-${counter}`;
        
        const itemHTML = `
            <div id="${itemId}" class="${type}-item item-card mb-2">
                <div class="input-group input-group-sm mb-1">
                    <span class="input-group-text">金額</span>
                    <input type="number" class="form-control amount" placeholder="輸入金額" step="0.01">
                </div>
                <div class="input-group input-group-sm mb-1">
                    <span class="input-group-text">月數</span>
                    <input type="number" class="form-control unit-months" value="1" min="1">
                </div>
                <div class="input-group input-group-sm mb-1">
                    <span class="input-group-text">貨幣</span>
                    <select class="form-select currency-unit">
                        <option value="HKD" selected>HKD</option>
                        <option value="USD">USD</option>
                        <option value="CNY">CNY</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                    </select>
                </div>
                <div class="input-group input-group-sm mb-1">
                    <span class="input-group-text">匯率</span>
                    <input type="number" class="form-control rate" value="1" step="0.0001">
                </div>
                <div class="d-flex justify-content-between align-items-center mt-1">
                    <small class="text-muted">小計: <span class="item-subtotal">0</span> HKD</small>
                    <button class="btn btn-outline-${type === 'income' ? 'danger' : 'success'} remove-btn remove-item" data-item-id="${itemId}">刪除</button>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHTML);
        
        const itemElement = document.getElementById(itemId);
        
        // 綁定事件
        const inputs = itemElement.querySelectorAll('.amount, .unit-months, .rate');
        inputs.forEach(input => {
            input.addEventListener('input', calculateTotals);
        });
        
        itemElement.querySelector('.currency-unit').addEventListener('change', function() {
            const rateInput = itemElement.querySelector('.rate');
            const defaultRates = {
                'HKD': 1,
                'USD': 7.8,
                'CNY': 1.13,
                'EUR': 8.5,
                'GBP': 9.8,
                'JPY': 0.055
            };
            rateInput.value = defaultRates[this.value] || 1;
            calculateTotals();
        });
        
        itemElement.querySelector('.remove-item').addEventListener('click', function() {
            document.getElementById(this.getAttribute('data-item-id')).remove();
            calculateTotals();
        });
        
        calculateTotals();
    }
    
    function calculateTotals() {
        // 計算收入總計
        let incomeTotal = 0;
        document.querySelectorAll('.income-item').forEach(item => {
            const amount = parseFloat(item.querySelector('.amount').value) || 0;
            const months = parseFloat(item.querySelector('.unit-months').value) || 0;
            const rate = parseFloat(item.querySelector('.rate').value) || 0;
            const subtotal = amount * months * rate;
            item.querySelector('.item-subtotal').textContent = subtotal.toFixed(2);
            incomeTotal += subtotal;
        });
        document.getElementById('incomeTotal').textContent = incomeTotal.toFixed(2);
        
        // 計算支出總計
        let expenseTotal = 0;
        document.querySelectorAll('.expense-item').forEach(item => {
            const amount = parseFloat(item.querySelector('.amount').value) || 0;
            const months = parseFloat(item.querySelector('.unit-months').value) || 0;
            const rate = parseFloat(item.querySelector('.rate').value) || 0;
            const subtotal = amount * months * rate;
            item.querySelector('.item-subtotal').textContent = subtotal.toFixed(2);
            expenseTotal += subtotal;
        });
        document.getElementById('expenseTotal').textContent = expenseTotal.toFixed(2);
        
        // 計算每月現金流
        const monthlyCashflow = (incomeTotal - expenseTotal) / 12;
        document.getElementById('monthlyCashflow').textContent = monthlyCashflow.toFixed(2);
    }
});