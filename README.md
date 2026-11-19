# 現金流計算器 / Cashflow Calculator

Vue 3 + Pinia cashflow tool. Track income and expenses, compute monthly cashflow, export a PDF report. UI is bilingual (繁體中文 / English) and Bootstrap-based.

## Features

- Multiple income and expense items
- Multi-currency with editable FX rates (HKD base)
- Live annual / monthly cashflow
- PDF export and print
- 繁中 / EN language toggle

## Stack

- Vue 3 (Composition API) + Pinia
- Bootstrap 5
- html2pdf.js
- Vite
- Docker (nginx) for production

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Docker

```bash
docker build -t cashflow-calculator .
docker run --rm -p 8080:80 cashflow-calculator
```

Open http://localhost:8080

## Usage

1. Add income/expense rows (amount, months, currency).
2. Adjust FX rates if needed.
3. Read monthly cashflow in the summary bar.
4. Export report for print or PDF.

Data lives in memory only; refresh clears it.

## License

MIT
