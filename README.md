# 萬能工具箱 (HR Magic Box)

這是一個專為 HR 與團隊管理者設計的多功能工具箱，包含名單管理、獎品抽籤與自動分組功能。

## ✨ 功能特色

- **👥 名單管理**：輕鬆新增、編輯與管理參與者名單。
- **🎁 獎品抽籤**：設定獎項數量，進行隨機抽籤。
- **🧩 自動分組**：依據人數需求，快速將成員進行分組。

## 🚀 快速開始

### 前置需求

- Node.js (建議 v18 以上)

### 安裝與啟動

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd luckydraw
   ```

2. **安裝套件**
   ```bash
   npm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   啟動後，請瀏覽 `http://localhost:3000`。

## 📦 部署 (Deployment)

本專案已設定 **GitHub Actions** 自動部署至 **GitHub Pages**。

### 如何部署？

1. 將程式碼推送到 GitHub 的 `main` 或 `master` 分支。
2. GitHub Actions 會自動觸發構建與部署流程。
3. 部署完成後，您的網站將可在 GitHub Pages 網址上存取 (依據 GitHub Settings > Pages 設定)。

### 手動構建

若需在本機產生部署檔案 (`dist` 資料夾)：

```bash
npm run build
```

## 🛠️ 技術對棧

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
