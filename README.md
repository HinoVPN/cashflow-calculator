# 現金流計算器 - 使用說明

## 專案概述

這是一個專業的現金流計算工具，使用Vue 3和Pinia構建，採用現代化的UI設計，可幫助您追蹤收入與支出，計算每月現金流狀況。專案採用響應式設計，在手機和電腦上都能提供良好的使用體驗。

## 功能特色

- **多項目管理**：可添加多個收入與支出項目
- **多貨幣支援**：支持不同貨幣和自定義匯率
- **靈活計算**：支援不同的週期和月數設定
- **即時計算**：輸入數據後自動更新結果
- **專業報表**：清晰展示年總額和每月現金流
- **PDF導出**：一鍵導出專業財務報表
- **列印功能**：直接列印財務報表

## 技術架構

- **前端框架**：Vue 3 (Composition API)
- **狀態管理**：Pinia
- **UI元件**：Bootstrap 5
- **圖標庫**：Font Awesome
- **PDF生成**：html2pdf.js
- **響應式設計**：適應各種屏幕尺寸
- **部署平台**：GitHub Pages

## 在線訪問

您可以通過以下鏈接訪問現金流計算器：
[https://[YOUR_USERNAME].github.io/cashflow-calculator/](https://[YOUR_USERNAME].github.io/cashflow-calculator/)

## 本地安裝與運行

### 要求
- Node.js 14.0+
- npm 或 yarn

### 安裝步驟
1. 克隆此存儲庫
```bash
git clone https://github.com/[YOUR_USERNAME]/cashflow-calculator.git
cd cashflow-calculator
```

2. 安裝依賴
```bash
npm install
# 或
yarn install
```

3. 本地開發模式運行
```bash
npm run dev
# 或
yarn dev
```

4. 構建生產版本
```bash
npm run build
# 或
yarn build
```

## 使用步驟

1. **添加收入項目**：
   - 點擊「收入來源」區塊的「新增項目」按鈕
   - 輸入項目名稱和金額（如月薪）
   - 設置月數（如月薪設12個月）
   - 選擇貨幣（自動填充匯率，可手動修改）

2. **添加支出項目**：
   - 點擊「支出來源」區塊的「新增項目」按鈕
   - 輸入項目名稱和每月支出金額
   - 設置支出周期（如房租設12個月）
   - 如有需要可調整貨幣和匯率

3. **查看結果**：
   - 系統會自動計算並顯示每月現金流
   - 可點擊「匯出財務報表」生成詳細報告
   - 報告可以直接列印或下載為PDF文件

## 項目部署

本項目配置了GitHub Actions，支持自動部署到GitHub Pages：

1. 將代碼推送到GitHub存儲庫的main分支
2. GitHub Actions會自動構建並部署到GitHub Pages
3. 幾分鐘後，您可以通過以下鏈接訪問：
   `https://[YOUR_USERNAME].github.io/cashflow-calculator/`

## 常見問題

### 如何計算年終獎金？

1. 添加一個新的收入項目
2. 輸入獎金名稱和金額
3. 將月數設為1（一次性收入）

### 如何記錄季度支付的費用？

1. 添加一個新的支出項目
2. 輸入每次支付的金額
3. 將月數設為4（一年4個季度）

### 資料會保存嗎？

目前所有資料僅存儲在瀏覽器內存中，刷新頁面後會重置。未來版本中將添加本地儲存功能。

## 授權資訊

此專案為開源軟體，採用 MIT 授權。歡迎自由使用與修改。

## 貢獻指南

歡迎提交Pull Request或Issues來改進這個專案。

## 聯絡方式

如有任何問題或建議，請聯繫開發者或提交GitHub Issue。

---

**注意**：此工具僅供參考，不構成財務建議。重要財務決策請諮詢專業人士。
