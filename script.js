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

    // 匯出報表按鈕
    document.getElementById('exportReport').addEventListener('click', function() {
        generateReport();
        const reportModal = new bootstrap.Modal(document.getElementById('reportModal'));
        reportModal.show();
    });

    // 列印報表
    document.getElementById('printReport').addEventListener('click', function() {
        window.print();
    });

    // 下載PDF
    document.getElementById('downloadPDF').addEventListener('click', function() {
        const reportContent = document.getElementById('reportContent');
        const options = {
            margin: [10, 10, 10, 10],
            filename: '現金流報表_' + formatDate(new Date()) + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(reportContent).save();
    });
    
    // 初始化各添加一個項目
    addItem('income');
    addItem('expense');
    
    function addItem(type) {
        const container = type === 'income' ? document.getElementById('incomeItems') : document.getElementById('expenseItems');
        const counter = type === 'income' ? ++incomeCounter : ++expenseCounter;
        const itemId = `${type}-item-${counter}`;
        const labelText = type === 'income' ? '收入' : '支出';
        const icon = type === 'income' ? 'fa-plus-circle' : 'fa-minus-circle';
        
        const itemHTML = `
            <div id="${itemId}" class="${type}-item item-card mb-2">
                <div class="item-header">
                    <span class="item-label"><i class="fas ${icon}"></i> ${labelText} #${counter}</span>
                    <input type="text" class="form-control form-control-sm item-name" placeholder="名稱 (選填)">
                </div>
                <div class="item-body">
                    <div class="row">
                        <div class="col-7">
                            <div class="input-group input-group-sm mb-2">
                                <span class="input-group-text">金額</span>
                                <input type="number" class="form-control amount" placeholder="輸入金額" step="0.01">
                            </div>
                        </div>
                        <div class="col-5">
                            <div class="input-group input-group-sm mb-2">
                                <span class="input-group-text">月數</span>
                                <input type="number" class="form-control unit-months" value="1" min="1">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-7">
                            <div class="input-group input-group-sm mb-2">
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
                        </div>
                        <div class="col-5">
                            <div class="input-group input-group-sm mb-2">
                                <span class="input-group-text">匯率</span>
                                <input type="number" class="form-control rate" value="1" step="0.0001">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-footer">
                    <div class="item-subtotal-container">
                        <small>年度金額: <span class="item-subtotal">0</span> HKD</small>
                    </div>
                    <button class="btn btn-sm remove-btn remove-item" data-item-id="${itemId}">
                        <i class="fas fa-trash-alt"></i> 刪除
                    </button>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHTML);
        
        const itemElement = document.getElementById(itemId);
        
        // 綁定事件
        const inputs = itemElement.querySelectorAll('.amount, .unit-months, .rate');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                calculateTotals();
                highlightChanges(this);
            });
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
            highlightChanges(rateInput);
        });
        
        itemElement.querySelector('.remove-item').addEventListener('click', function() {
            const itemToRemove = document.getElementById(this.getAttribute('data-item-id'));
            
            // 添加淡出動畫
            itemToRemove.style.transition = 'opacity 0.3s, transform 0.3s';
            itemToRemove.style.opacity = '0';
            itemToRemove.style.transform = 'translateX(10px)';
            
            // 等待動畫完成後移除元素
            setTimeout(function() {
                itemToRemove.remove();

                //TODO reorder the item order
                // if(itemToRemove.id.split("-")[0] == 'income'){
                //     incomeCounter--;
                // }else if(itemToRemove.id.split("-")[0] == 'expense'){
                //     expenseCounter--;
                // }
                calculateTotals();
            }, 300);
        });
        
        // 讓新增的項目有動畫效果
        itemElement.style.opacity = '0';
        itemElement.style.transform = 'translateY(10px)';
        
        setTimeout(function() {
            itemElement.style.transition = 'opacity 0.3s, transform 0.3s';
            itemElement.style.opacity = '1';
            itemElement.style.transform = 'translateY(0)';
        }, 10);
        
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
            item.querySelector('.item-subtotal').textContent = formatNumber(subtotal);
            incomeTotal += subtotal;
        });
        
        // 更新收入總計
        const incomeTotalElement = document.getElementById('incomeTotal');
        const previousIncomeTotal = parseFloat(incomeTotalElement.textContent.replace(/,/g, '')) || 0;
        incomeTotalElement.textContent = formatNumber(incomeTotal);
        
        if (Math.abs(incomeTotal - previousIncomeTotal) > 0.01) {
            highlightElement(incomeTotalElement);
        }
        
        // 計算支出總計
        let expenseTotal = 0;
        document.querySelectorAll('.expense-item').forEach(item => {
            const amount = parseFloat(item.querySelector('.amount').value) || 0;
            const months = parseFloat(item.querySelector('.unit-months').value) || 0;
            const rate = parseFloat(item.querySelector('.rate').value) || 0;
            const subtotal = amount * months * rate;
            item.querySelector('.item-subtotal').textContent = formatNumber(subtotal);
            expenseTotal += subtotal;
        });
        
        // 更新支出總計
        const expenseTotalElement = document.getElementById('expenseTotal');
        const previousExpenseTotal = parseFloat(expenseTotalElement.textContent.replace(/,/g, '')) || 0;
        expenseTotalElement.textContent = formatNumber(expenseTotal);
        
        if (Math.abs(expenseTotal - previousExpenseTotal) > 0.01) {
            highlightElement(expenseTotalElement);
        }
        
        // 計算每月現金流
        const monthlyCashflow = (incomeTotal - expenseTotal) / 12;
        const monthlyCashflowElement = document.getElementById('monthlyCashflow');
        const previousMonthlyCashflow = parseFloat(monthlyCashflowElement.textContent.replace(/,/g, '')) || 0;
        monthlyCashflowElement.textContent = formatNumber(monthlyCashflow);
        
        if (Math.abs(monthlyCashflow - previousMonthlyCashflow) > 0.01) {
            highlightElement(monthlyCashflowElement);
        }
        
        // 根據現金流是正數還是負數來改變顏色
        const cashflowResultContainer = document.getElementById('cashflowResultContainer');
        if (monthlyCashflow > 0) {
            cashflowResultContainer.style.color = 'var(--color-income)';
        } else if (monthlyCashflow < 0) {
            cashflowResultContainer.style.color = 'var(--color-expense)';
        } else {
            cashflowResultContainer.style.color = 'var(--color-primary)';
        }
    }

    // 生成財務報表
    function generateReport() {
        const reportContent = document.getElementById('reportContent');
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        
        // 收集收入項目數據
        const incomeItems = [];
        document.querySelectorAll('.income-item').forEach(item => {
            const name = item.querySelector('.item-name').value || '未命名收入';
            const amount = parseFloat(item.querySelector('.amount').value) || 0;
            const months = parseFloat(item.querySelector('.unit-months').value) || 0;
            const currency = item.querySelector('.currency-unit').value;
            const rate = parseFloat(item.querySelector('.rate').value) || 0;
            const subtotal = amount * months * rate;
            
            incomeItems.push({
                name: name,
                amount: amount,
                months: months,
                currency: currency,
                rate: rate,
                subtotal: subtotal
            });
        });
        
        // 收集支出項目數據
        const expenseItems = [];
        document.querySelectorAll('.expense-item').forEach(item => {
            const name = item.querySelector('.item-name').value || '未命名支出';
            const amount = parseFloat(item.querySelector('.amount').value) || 0;
            const months = parseFloat(item.querySelector('.unit-months').value) || 0;
            const currency = item.querySelector('.currency-unit').value;
            const rate = parseFloat(item.querySelector('.rate').value) || 0;
            const subtotal = amount * months * rate;
            
            expenseItems.push({
                name: name,
                amount: amount,
                months: months,
                currency: currency,
                rate: rate,
                subtotal: subtotal
            });
        });
        
        // 計算總額
        const incomeTotal = incomeItems.reduce((total, item) => total + item.subtotal, 0);
        const expenseTotal = expenseItems.reduce((total, item) => total + item.subtotal, 0);
        const annualCashflow = incomeTotal - expenseTotal;
        const monthlyCashflow = annualCashflow / 12;
        
        // 生成報表HTML
        let reportHTML = `
            <div class="report-header">
                <h1 class="report-title">現金流財務分析報表</h1>
                <div class="report-subtitle">每月現金流詳細分析</div>
                <div class="report-date">報表生成日期：${formattedDate}</div>
            </div>
            
            <div class="report-section">
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
        `;
        
        // 添加收入項目
        incomeItems.forEach(item => {
            reportHTML += `
                <tr class="income-row">
                    <td>${item.name}</td>
                    <td class="amount-column">${formatNumber(item.amount)}</td>
                    <td>${item.currency}</td>
                    <td class="amount-column">${item.months}</td>
                    <td class="amount-column">${item.rate.toFixed(4)}</td>
                    <td class="amount-column">${formatNumber(item.subtotal)}</td>
                </tr>
            `;
        });
        
        // 收入總計
        reportHTML += `
                    <tr class="total-row">
                        <td colspan="5">年度收入總計</td>
                        <td class="amount-column positive-amount">${formatNumber(incomeTotal)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="report-section">
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
        `;
        
        // 添加支出項目
        expenseItems.forEach(item => {
            reportHTML += `
                <tr class="expense-row">
                    <td>${item.name}</td>
                    <td class="amount-column">${formatNumber(item.amount)}</td>
                    <td>${item.currency}</td>
                    <td class="amount-column">${item.months}</td>
                    <td class="amount-column">${item.rate.toFixed(4)}</td>
                    <td class="amount-column">${formatNumber(item.subtotal)}</td>
                </tr>
            `;
        });
        
        // 支出總計
        reportHTML += `
                    <tr class="total-row">
                        <td colspan="5">年度支出總計</td>
                        <td class="amount-column negative-amount">${formatNumber(expenseTotal)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="report-summary">
            <div class="summary-title">現金流摘要</div>
            <div class="summary-item">
                <span>年度收入總計:</span>
                <span class="positive-amount">${formatNumber(incomeTotal)} HKD</span>
            </div>
            <div class="summary-item">
                <span>年度支出總計:</span>
                <span class="negative-amount">${formatNumber(expenseTotal)} HKD</span>
            </div>
            <div class="summary-item">
                <span>年度現金流:</span>
                <span class="${annualCashflow >= 0 ? 'positive-amount' : 'negative-amount'}">${formatNumber(annualCashflow)} HKD</span>
            </div>
            <div class="summary-total">
                <span>每月平均現金流:</span>
                <span class="${monthlyCashflow >= 0 ? 'positive-amount' : 'negative-amount'}">${formatNumber(monthlyCashflow)} HKD</span>
            </div>
        </div>
        
        <div class="report-footer">
            <p>此報表由「現金流計算器」自動生成 | 生成日期：${formattedDate}</p>
        </div>
        `;
        
        reportContent.innerHTML = reportHTML;
    }
    
    function formatNumber(number) {
        return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function highlightChanges(inputElement) {
        const itemCard = inputElement.closest('.item-card');
        const subtotalElement = itemCard.querySelector('.item-subtotal');
        highlightElement(subtotalElement);
    }
    
    function highlightElement(element) {
        element.classList.remove('highlight');
        void element.offsetWidth; // 強制重繪
        element.classList.add('highlight');
    }
});