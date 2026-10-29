# IOB Customer Reward Portal (Cheggout Loyalty)

A pixel-perfect replica of the **Cheggout Loyalty Portal** for **Indian Overseas Bank (IOB)** (`https://loyaltyredemptionui.z29.web.core.windows.net/cards`).

Built with **React 18**, **Vite**, **React Router v6**, and **Vanilla CSS**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run the Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173/`.

### 3. Build for Production
```bash
npm run build
```
Generates an optimized static production bundle in `dist/`.

### 4. Preview the Production Build
```bash
npm run preview
```

---

## ☁️ Deploying to Azure

### Option A: Azure Static Web Apps (SWA CLI)
Deploy using the Azure SWA CLI (configured with SPA fallback routes in `staticwebapp.config.json`):

1. **Interactive Deployment**:
   ```powershell
   npm run deploy:swa
   ```
   *(Prompts you to authenticate with Azure and creates/selects the app)*

2. **Using a Deployment Token**:
   ```powershell
   npx @azure/static-web-apps-cli deploy ./dist --deployment-token "<YOUR_TOKEN>" --env production
   ```

### Option B: Azure Storage Static Website (Exact match with `*.web.core.windows.net`)
If deploying to Azure Blob Storage `$web` container:
1. In Azure Portal -> Storage Account -> **Static website** -> Click **Enable**:
   - Set **Index document name**: `index.html`
   - Set **Error document path**: `index.html` *(required for client-side routing)*
2. Upload via Azure CLI:
   ```powershell
   az storage blob upload-batch -s ./dist -d '$web' --account-name <STORAGE_ACCOUNT_NAME> --auth-mode key --overwrite
   ```
   Or run the automated helper:
   ```powershell
   .\deploy-azure.ps1 -Target storage -StorageAccountName <STORAGE_ACCOUNT_NAME>
   ```

---

## 📱 Features & Architecture

### 1. Authentication & Security (`/auth`)
- **Branded Hero Section**: Custom vector gold glow gradients, dot pattern canvas, floating credit card/star/voucher badges.
- **Hero Features**: 4 high-contrast feature highlights with SVG iconography.
- **Two-Step Login**:
  - **Mobile Verification**: Accepts 10-digit Indian mobile numbers (`^[6-9]\d{9}$`) with live format validation and checkmark animation.
  - **OTP Verification**: 6-digit OTP verification. Includes developer mode OTP display (`devOtp`) and resend OTP cooldown.
- **Session Management**: JWT token storage, Cheggout PWA session establishment, and automated token injection.

### 2. Credit Cards Dashboard (`/cards`)
- **Card Carousel**:
  - Auto-rotates between customer credit cards every 4 seconds.
  - Pauses automatically on hover or touch interactions.
  - Realistic metallic gradient credit card tile with custom golden microchip SVG.
  - Points balance formatted according to `en-IN` numbering (e.g., `14,850 Points`).
- **Recent Transactions**:
  - Chronological list of orders and redemptions with visual status indicators (earned vs redeemed).
  - Indian Rupee/points formatting and localized dates.
- **Reward Marketplace**:
  - Rotating showcase for **Gift Cards**, **Shop D2C**, and **Exclusive Offers**.
  - Smooth crossfade transitions between top brands.

### 3. Partner PWA Embedding (`/pwa`)
- Responsive iframe integration with secure permission allowances (`clipboard`, `payment`, `camera`, `microphone`).
- 30-second automated points balance synchronization.

### 4. Design System & Dynamic Theming
- Native typography using **Poppins** and **Material Icons**.
- Dynamic bank theme injection via CSS variables (`--primary` `#d4af37`, `--primary-dark` `#f0d78c`).
- Built-in toast notifications for user interactions.

---

## 🛠️ Project Structure

```text
├── dist/                  # Production static build
├── public/                # Static assets (IOB logo, Exclusive Offers banner)
├── src/
│   ├── assets/            # High-resolution media assets
│   ├── components/        # Reusable UI components
│   │   ├── AppShell.jsx            # Topbar, sidebar, user menu, points badge
│   │   ├── CardCarousel.jsx        # Credit card auto-sliding carousel
│   │   ├── CreditCardTile.jsx      # Credit card styling & chip SVG
│   │   ├── Icons.jsx               # Vector SVGs & decorative canvas
│   │   ├── RewardMarketplace.jsx   # Marketplace banner rotators
│   │   └── TransactionsList.jsx    # Order history list
│   ├── context/           # React context providers
│   │   ├── AuthContext.jsx         # User & token authentication
│   │   ├── BankContext.jsx         # Bank branding & CSS theme variables
│   │   └── ToastContext.jsx        # Global toast notifications
│   ├── pages/             # Page views
│   │   ├── AuthPage.jsx            # Login & OTP verification
│   │   ├── CardsPage.jsx           # Cards dashboard & transactions
│   │   └── PwaViewer.jsx           # Embedded PWA viewer
│   ├── services/          # API layer & resilience fallbacks
│   │   └── api.js                  # Cheggout API client + offline mock support
│   ├── styles/            # Stylesheets
│   │   └── index.css               # Complete Cheggout portal stylesheet
│   ├── App.jsx            # Routes & protected route guarding
│   └── main.jsx           # React DOM root entry
├── index.html             # HTML entry point with Google Fonts
├── package.json
└── vite.config.js
```
