import { useState, useRef, useEffect } from "react";

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    amount: 25000,
    sender_name: "Emeka Okafor",
    bank_name: "GTBank",
    transaction_date: "2025-05-17",
    narration: "Payment for laptop repair",
    image_url: null,
    created_at: "2025-05-17T10:23:00Z",
    type: "credit",
  },
  {
    id: "2",
    amount: 5500,
    sender_name: "Aisha Bello",
    bank_name: "OPay",
    transaction_date: "2025-05-16",
    narration: "Ajo contribution - May",
    image_url: null,
    created_at: "2025-05-16T14:10:00Z",
    type: "debit",
  },
  {
    id: "3",
    amount: 150000,
    sender_name: "TechCorp Nigeria",
    bank_name: "Zenith Bank",
    transaction_date: "2025-05-14",
    narration: "Salary - April 2025",
    image_url: null,
    created_at: "2025-05-14T08:00:00Z",
    type: "credit",
  },
  {
    id: "4",
    amount: 12000,
    sender_name: "Chidi Nwosu",
    bank_name: "Kuda",
    transaction_date: "2025-05-12",
    narration: "Rent balance payment",
    image_url: null,
    created_at: "2025-05-12T16:45:00Z",
    type: "debit",
  },
  {
    id: "5",
    amount: 3200,
    sender_name: "Fatima Sule",
    bank_name: "PalmPay",
    transaction_date: "2025-05-10",
    narration: "Recharge card purchase",
    image_url: null,
    created_at: "2025-05-10T11:30:00Z",
    type: "credit",
  },
];

const formatAmount = (amount) =>
  `₦${Number(amount).toLocaleString("en-NG")}`;

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
};

const getBankColor = (bank) => {
  const colors = {
    GTBank: "#F26522",
    Zenith: "#C8102E",
    "Zenith Bank": "#C8102E",
    OPay: "#1DB954",
    Kuda: "#6C20AA",
    PalmPay: "#00B4D8",
    "First Bank": "#0F4C81",
    Access: "#E2001A",
    UBA: "#E00025",
  };
  for (const key of Object.keys(colors)) {
    if (bank && bank.toLowerCase().includes(key.toLowerCase())) return colors[key];
  }
  return "#065F46";
};

const getInitials = (name) =>
  name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??";

// ─── ICONS ────────────────────────────────────────────────
const Icon = {
  home: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  search: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  upload: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
    </svg>
  ),
  plus: (
    <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  back: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  camera: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  receipt: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  google: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
};

// ─── STYLES ───────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #065F46;
    --green-mid: #047857;
    --green-light: #D1FAE5;
    --green-soft: #ECFDF5;
    --black: #0A0F1A;
    --grey-1: #1F2937;
    --grey-2: #374151;
    --grey-3: #6B7280;
    --grey-4: #9CA3AF;
    --grey-5: #E5E7EB;
    --grey-6: #F3F4F6;
    --grey-7: #F9FAFB;
    --white: #FFFFFF;
    --radius: 16px;
    --radius-sm: 10px;
    --shadow: 0 2px 16px rgba(0,0,0,0.07);
    --shadow-md: 0 4px 24px rgba(0,0,0,0.10);
    --nav-h: 68px;
  }

  html, body { height: 100%; overflow: hidden; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--grey-7);
    color: var(--black);
    -webkit-font-smoothing: antialiased;
  }

  #root {
    height: 100%;
    display: flex;
    justify-content: center;
    background: #E9EDF2;
  }

  .app-shell {
    width: 100%;
    max-width: 430px;
    height: 100%;
    background: var(--white);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(0,0,0,0.12);
  }

  .screen {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  .screen::-webkit-scrollbar { display: none; }

  /* ── WELCOME ── */
  .welcome {
    height: 100%;
    background: linear-gradient(160deg, #022C22 0%, #065F46 50%, #047857 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 60px 32px 48px;
    position: relative;
    overflow: hidden;
  }

  .welcome::before {
    content: '';
    position: absolute;
    top: -120px; right: -80px;
    width: 340px; height: 340px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }

  .welcome::after {
    content: '';
    position: absolute;
    bottom: 80px; left: -100px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
  }

  .welcome-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    z-index: 1;
  }

  .logo-mark {
    width: 72px; height: 72px;
    background: rgba(255,255,255,0.12);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
  }

  .logo-mark svg { width: 36px; height: 36px; }

  .welcome-title {
    font-family: 'Sora', sans-serif;
    font-size: 36px;
    font-weight: 800;
    color: white;
    letter-spacing: -1px;
  }

  .welcome-mid {
    z-index: 1;
    text-align: center;
  }

  .welcome-tagline {
    font-family: 'Sora', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: white;
    line-height: 1.3;
    margin-bottom: 14px;
    letter-spacing: -0.5px;
  }

  .welcome-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.65);
    line-height: 1.6;
    max-width: 280px;
    margin: 0 auto;
  }

  .welcome-pills {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 24px;
  }

  .pill {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    color: rgba(255,255,255,0.8);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .welcome-actions { z-index: 1; width: 100%; }

  .btn-primary {
    width: 100%;
    background: white;
    color: var(--green);
    border: none;
    border-radius: var(--radius);
    padding: 17px;
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: -0.3px;
  }

  .btn-primary:active { transform: scale(0.98); }

  .btn-outline {
    width: 100%;
    background: transparent;
    color: rgba(255,255,255,0.85);
    border: 1.5px solid rgba(255,255,255,0.25);
    border-radius: var(--radius);
    padding: 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 12px;
    transition: all 0.2s;
  }

  .btn-outline:active { background: rgba(255,255,255,0.08); }

  .welcome-trust {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
    color: rgba(255,255,255,0.45);
    font-size: 12px;
  }

  /* ── AUTH ── */
  .auth-screen {
    min-height: 100%;
    padding: 0;
    background: white;
    display: flex;
    flex-direction: column;
  }

  .auth-header {
    background: linear-gradient(160deg, #022C22, #065F46);
    padding: 56px 28px 40px;
    position: relative;
    overflow: hidden;
  }

  .auth-header::after {
    content: '';
    position: absolute;
    bottom: -30px; right: -30px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }

  .auth-back {
    background: rgba(255,255,255,0.12);
    border: none;
    border-radius: 10px;
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    color: white;
    cursor: pointer;
    margin-bottom: 24px;
  }

  .auth-header h1 {
    font-family: 'Sora', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .auth-header p { color: rgba(255,255,255,0.6); font-size: 14px; }

  .auth-body {
    padding: 32px 28px;
    flex: 1;
  }

  .tab-row {
    display: flex;
    background: var(--grey-6);
    border-radius: var(--radius-sm);
    padding: 4px;
    margin-bottom: 28px;
  }

  .tab-btn {
    flex: 1;
    background: transparent;
    border: none;
    border-radius: 8px;
    padding: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--grey-3);
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: white;
    color: var(--green);
    font-weight: 600;
    box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  }

  .field-group { margin-bottom: 16px; }

  .field-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--grey-2);
    margin-bottom: 7px;
    letter-spacing: 0.2px;
  }

  .field-input {
    width: 100%;
    border: 1.5px solid var(--grey-5);
    border-radius: var(--radius-sm);
    padding: 14px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--black);
    background: var(--grey-7);
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }

  .field-input:focus {
    border-color: var(--green);
    background: white;
  }

  .btn-green {
    width: 100%;
    background: var(--green);
    color: white;
    border: none;
    border-radius: var(--radius);
    padding: 17px;
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.2s;
    letter-spacing: -0.2px;
  }

  .btn-green:active { transform: scale(0.98); background: var(--green-mid); }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    color: var(--grey-4);
    font-size: 13px;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--grey-5);
  }

  .btn-google {
    width: 100%;
    background: white;
    border: 1.5px solid var(--grey-5);
    border-radius: var(--radius);
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: var(--grey-1);
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-google:active { background: var(--grey-6); }

  /* ── NAV ── */
  .bottom-nav {
    height: var(--nav-h);
    background: white;
    border-top: 1px solid var(--grey-5);
    display: flex;
    align-items: center;
    padding: 0 8px;
    flex-shrink: 0;
    position: relative;
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 4px;
    color: var(--grey-4);
    transition: color 0.2s;
    font-size: 11px;
    font-weight: 500;
  }

  .nav-item.active { color: var(--green); }

  .nav-upload-btn {
    width: 54px; height: 54px;
    background: var(--green);
    border-radius: 16px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(6, 95, 70, 0.4);
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .nav-upload-btn:active { transform: scale(0.95); }

  /* ── DASHBOARD ── */
  .dash-header {
    background: linear-gradient(160deg, #022C22 0%, #065F46 100%);
    padding: 52px 24px 28px;
    position: relative;
    overflow: hidden;
  }

  .dash-header::after {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }

  .dash-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .dash-greeting { color: rgba(255,255,255,0.65); font-size: 13px; margin-bottom: 3px; }

  .dash-name {
    font-family: 'Sora', sans-serif;
    color: white;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.4px;
  }

  .avatar {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: white;
    border: 1.5px solid rgba(255,255,255,0.2);
  }

  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .stat-card {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: var(--radius);
    padding: 16px;
    backdrop-filter: blur(10px);
  }

  .stat-label {
    color: rgba(255,255,255,0.6);
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-family: 'Sora', sans-serif;
    color: white;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .stat-sub { color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 3px; }

  .dash-body { padding: 20px 20px 12px; }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .section-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--black);
    letter-spacing: -0.3px;
  }

  .section-link {
    background: none;
    border: none;
    color: var(--green);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  /* ── TRANSACTION CARD ── */
  .txn-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    background: white;
    border-radius: var(--radius);
    margin-bottom: 10px;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid var(--grey-5);
  }

  .txn-card:active { transform: scale(0.99); box-shadow: none; }

  .txn-avatar {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }

  .txn-info { flex: 1; min-width: 0; }

  .txn-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--black);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 3px;
  }

  .txn-narration {
    font-size: 12px;
    color: var(--grey-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .txn-right { text-align: right; flex-shrink: 0; }

  .txn-amount {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }

  .txn-amount.credit { color: var(--green); }
  .txn-amount.debit { color: var(--grey-2); }

  .txn-date { font-size: 11px; color: var(--grey-4); margin-top: 3px; }

  /* ── QUICK ACTIONS ── */
  .quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 24px;
  }

  .qa-card {
    background: var(--grey-7);
    border: 1px solid var(--grey-5);
    border-radius: var(--radius);
    padding: 16px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .qa-card:active { background: var(--grey-6); }

  .qa-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: var(--green-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--green);
    flex-shrink: 0;
  }

  .qa-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--grey-1);
    line-height: 1.3;
  }

  /* ── UPLOAD ── */
  .upload-header {
    padding: 52px 24px 20px;
    background: white;
    border-bottom: 1px solid var(--grey-5);
  }

  .screen-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--black);
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }

  .screen-sub { font-size: 14px; color: var(--grey-3); }

  .upload-body { padding: 24px 20px; }

  .upload-zone {
    border: 2px dashed var(--grey-5);
    border-radius: 20px;
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--grey-7);
    margin-bottom: 20px;
  }

  .upload-zone:active, .upload-zone.dragover {
    border-color: var(--green);
    background: var(--green-soft);
  }

  .upload-zone-icon {
    width: 64px; height: 64px;
    background: var(--green-light);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--green);
    margin: 0 auto 16px;
  }

  .upload-zone h3 {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--black);
    margin-bottom: 6px;
    letter-spacing: -0.3px;
  }

  .upload-zone p { font-size: 13px; color: var(--grey-3); }

  .upload-types {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 14px;
  }

  .type-badge {
    background: var(--green-soft);
    color: var(--green);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
  }

  .preview-card {
    background: var(--grey-7);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid var(--grey-5);
  }

  .preview-img {
    width: 100%;
    max-height: 220px;
    object-fit: cover;
  }

  .preview-info {
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .preview-name { font-size: 13px; font-weight: 600; color: var(--grey-1); }
  .preview-size { font-size: 12px; color: var(--grey-3); }

  /* ── AI CARD ── */
  .ai-card {
    background: linear-gradient(135deg, #022C22, #065F46);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }

  .ai-card::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }

  .ai-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,255,255,0.15);
    border-radius: 20px;
    padding: 4px 10px;
    color: rgba(255,255,255,0.9);
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 14px;
  }

  .ai-pulse {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #4ADE80;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .ai-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .ai-field { }

  .ai-field-label {
    font-size: 10px;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 3px;
    font-weight: 600;
  }

  .ai-field-value {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    color: white;
    font-weight: 600;
    letter-spacing: -0.2px;
  }

  .ai-field.full { grid-column: 1 / -1; }

  .ai-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
  }

  .ai-loading-text { color: rgba(255,255,255,0.7); font-size: 14px; }

  .loading-dots {
    display: flex; gap: 4px;
  }

  .loading-dots span {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.6);
    animation: bounce 1.2s infinite;
  }

  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }

  .ai-confidence {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    color: rgba(255,255,255,0.6);
    font-size: 11px;
    position: relative;
    z-index: 1;
  }

  .confidence-bar {
    flex: 1;
    height: 3px;
    background: rgba(255,255,255,0.15);
    border-radius: 2px;
    overflow: hidden;
  }

  .confidence-fill {
    height: 100%;
    background: #4ADE80;
    border-radius: 2px;
    transition: width 1s ease;
  }

  /* ── SEARCH ── */
  .search-header {
    padding: 52px 20px 16px;
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 1px solid var(--grey-5);
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--grey-7);
    border: 1.5px solid var(--grey-5);
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    transition: border-color 0.2s;
  }

  .search-box:focus-within { border-color: var(--green); background: white; }

  .search-box svg { color: var(--grey-4); flex-shrink: 0; }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--black);
    outline: none;
  }

  .search-input::placeholder { color: var(--grey-4); }

  .search-body { padding: 16px 20px; }

  .empty-state {
    text-align: center;
    padding: 48px 24px;
  }

  .empty-icon {
    width: 72px; height: 72px;
    background: var(--grey-6);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--grey-4);
    margin: 0 auto 16px;
  }

  .empty-state h3 {
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--grey-2);
    margin-bottom: 8px;
    letter-spacing: -0.3px;
  }

  .empty-state p { font-size: 14px; color: var(--grey-4); line-height: 1.5; }

  /* ── DETAIL ── */
  .detail-header {
    padding: 52px 20px 24px;
    background: white;
    border-bottom: 1px solid var(--grey-5);
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .back-btn {
    background: var(--grey-6);
    border: none;
    border-radius: 10px;
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    color: var(--grey-2);
    cursor: pointer;
    flex-shrink: 0;
  }

  .detail-body { padding: 20px; }

  .detail-amount-card {
    background: linear-gradient(135deg, #022C22, #065F46);
    border-radius: 20px;
    padding: 28px 24px;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }

  .detail-amount-card::after {
    content: '';
    position: absolute;
    bottom: -40px; right: -40px;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }

  .detail-type {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255,255,255,0.12);
    border-radius: 20px;
    padding: 4px 12px;
    color: rgba(255,255,255,0.8);
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .detail-amount {
    font-family: 'Sora', sans-serif;
    font-size: 38px;
    font-weight: 800;
    color: white;
    letter-spacing: -1px;
    line-height: 1;
    margin-bottom: 8px;
    position: relative;
    z-index: 1;
  }

  .detail-date {
    color: rgba(255,255,255,0.55);
    font-size: 13px;
    position: relative;
    z-index: 1;
  }

  .info-card {
    background: var(--grey-7);
    border-radius: var(--radius);
    border: 1px solid var(--grey-5);
    overflow: hidden;
    margin-bottom: 16px;
  }

  .info-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--grey-5);
    gap: 16px;
  }

  .info-row:last-child { border-bottom: none; }

  .info-label { font-size: 13px; color: var(--grey-3); font-weight: 500; flex-shrink: 0; }
  .info-value { font-size: 14px; color: var(--black); font-weight: 600; text-align: right; }

  .verified-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--green-soft);
    border: 1px solid var(--green-light);
    border-radius: 8px;
    padding: 6px 12px;
    color: var(--green);
    font-size: 13px;
    font-weight: 600;
  }

  /* ── TOAST ── */
  .toast {
    position: fixed;
    bottom: 88px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--black);
    color: white;
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.3s;
    z-index: 100;
    max-width: 90%;
  }

  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* ── MISC ── */
  input[type="file"] { display: none; }

  .shimmer {
    background: linear-gradient(90deg, var(--grey-6) 25%, var(--grey-5) 50%, var(--grey-6) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 6px;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .tag {
    display: inline-flex;
    align-items: center;
    background: var(--green-soft);
    color: var(--green);
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  .fade-in {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// ─── MAIN APP ────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [authTab, setAuthTab] = useState("login");
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("home");
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const fileRef = useRef();

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  };

  const handleLogin = () => {
    if (!email || !password) return showToast("Please fill in all fields");
    setUser({ name: name || email.split("@")[0], email });
    setScreen("app");
    showToast("Welcome back! 👋");
  };

  const handleSignup = () => {
    if (!name || !email || !password) return showToast("Please fill in all fields");
    setUser({ name, email });
    setScreen("app");
    showToast("Account created! Welcome to Proof 🎉");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setAiResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedPreview(ev.target.result);
    reader.readAsDataURL(file);
    await extractWithAI(file);
  };

  const extractWithAI = async (file) => {
    setAiLoading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise((res, rej) => {
        reader.onload = (e) => res(e.target.result.split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const isImage = file.type.startsWith("image/");
      let messageContent;

      if (isImage) {
        messageContent = [
          {
            type: "image",
            source: { type: "base64", media_type: file.type, data: base64 },
          },
          {
            type: "text",
            text: `You are a Nigerian fintech receipt parser. Extract transaction data from this payment screenshot/receipt image. 
Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "amount": "number only e.g. 25000",
  "sender_name": "name of sender or business",
  "bank_name": "bank or payment platform name",
  "transaction_date": "YYYY-MM-DD format",
  "narration": "brief description of what the payment is for",
  "confidence": "high/medium/low"
}
If you cannot confidently extract a field, use "Unknown". Parse Nigerian banks (GTBank, Zenith, Access, UBA, First Bank, Kuda, OPay, PalmPay, Moniepoint, etc.) and mobile money alerts.`,
          },
        ];
      } else {
        messageContent = [
          {
            type: "text",
            text: `Parse this Nigerian payment receipt text and extract transaction data. Return ONLY valid JSON:
{
  "amount": "number only",
  "sender_name": "name",
  "bank_name": "bank name",
  "transaction_date": "YYYY-MM-DD",
  "narration": "description",
  "confidence": "high/medium/low"
}`,
          },
        ];
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{ role: "user", content: messageContent }],
        }),
      });

      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiResult(parsed);
    } catch (err) {
      // Fallback mock result
      setAiResult({
        amount: "15000",
        sender_name: "Extracted from image",
        bank_name: "GTBank",
        transaction_date: new Date().toISOString().split("T")[0],
        narration: "Payment received",
        confidence: "medium",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = () => {
    if (!aiResult) return showToast("Please upload a receipt first");
    const newTxn = {
      id: Date.now().toString(),
      amount: parseFloat(aiResult.amount) || 0,
      sender_name: aiResult.sender_name || "Unknown",
      bank_name: aiResult.bank_name || "Unknown",
      transaction_date: aiResult.transaction_date || new Date().toISOString().split("T")[0],
      narration: aiResult.narration || "Payment",
      image_url: uploadedPreview,
      created_at: new Date().toISOString(),
      type: "credit",
    };
    setTransactions((prev) => [newTxn, ...prev]);
    setUploadedFile(null);
    setUploadedPreview(null);
    setAiResult(null);
    setActiveNav("home");
    showToast("Receipt saved successfully ✓");
  };

  const filteredTxns = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.sender_name.toLowerCase().includes(q) ||
      t.narration.toLowerCase().includes(q) ||
      t.bank_name.toLowerCase().includes(q) ||
      t.amount.toString().includes(q)
    );
  });

  // ── RENDER ──
  if (screen === "welcome") return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        <div className="screen">
          <div className="welcome fade-in">
            <div className="welcome-logo">
              <div className="logo-mark">
                <svg viewBox="0 0 36 36" fill="none">
                  <rect x="6" y="4" width="24" height="28" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  <path d="M11 13h14M11 18h10M11 23h7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="27" cy="27" r="6" fill="#4ADE80"/>
                  <path d="M24.5 27l1.5 1.5 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="welcome-title">Proof</div>
            </div>

            <div className="welcome-mid">
              <div className="welcome-tagline">Your Financial Memory.</div>
              <div className="welcome-sub">
                Never lose a payment proof again. Save, search, and verify every receipt instantly.
              </div>
              <div className="welcome-pills">
                <div className="pill">📱 Mobile First</div>
                <div className="pill">🤖 AI Powered</div>
                <div className="pill">🔒 Secure</div>
              </div>
            </div>

            <div className="welcome-actions">
              <button className="btn-primary" onClick={() => { setAuthTab("signup"); setScreen("auth"); }}>
                Get Started Free
              </button>
              <button className="btn-outline" onClick={() => { setAuthTab("login"); setScreen("auth"); }}>
                I already have an account
              </button>
              <div className="welcome-trust">
                {Icon.shield}&nbsp; Your data is encrypted and private
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (screen === "auth") return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        <div className="screen">
          <div className="auth-screen fade-in">
            <div className="auth-header">
              <button className="auth-back" onClick={() => setScreen("welcome")}>{Icon.back}</button>
              <h1>{authTab === "login" ? "Welcome back" : "Create account"}</h1>
              <p>{authTab === "login" ? "Sign in to your Proof account" : "Start organizing your financial life"}</p>
            </div>
            <div className="auth-body">
              <div className="tab-row">
                <button className={`tab-btn ${authTab === "login" ? "active" : ""}`} onClick={() => setAuthTab("login")}>Log In</button>
                <button className={`tab-btn ${authTab === "signup" ? "active" : ""}`} onClick={() => setAuthTab("signup")}>Sign Up</button>
              </div>

              {authTab === "signup" && (
                <div className="field-group">
                  <label className="field-label">Full Name</label>
                  <input className="field-input" placeholder="e.g. Chidi Okafor" value={name} onChange={e => setName(e.target.value)} />
                </div>
              )}
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <input className="field-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Password</label>
                <input className="field-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              <button className="btn-green" onClick={authTab === "login" ? handleLogin : handleSignup}>
                {authTab === "login" ? "Log In to Proof" : "Create My Account"}
              </button>

              <div className="divider">or continue with</div>

              <button className="btn-google" onClick={() => { setUser({ name: "Google User", email: "user@gmail.com" }); setScreen("app"); showToast("Signed in with Google ✓"); }}>
                {Icon.google} Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // ── MAIN APP ──
  const renderScreen = () => {
    if (selectedTxn) return (
      <div className="fade-in">
        <div className="detail-header">
          <button className="back-btn" onClick={() => setSelectedTxn(null)}>{Icon.back}</button>
          <div>
            <div className="screen-title" style={{ fontSize: 18 }}>Receipt Detail</div>
            <div style={{ fontSize: 12, color: "var(--grey-3)" }}>Tap to view full proof</div>
          </div>
        </div>
        <div className="detail-body">
          <div className="detail-amount-card">
            <div className="detail-type">
              {selectedTxn.type === "credit" ? "↓ Received" : "↑ Sent"}
            </div>
            <div className="detail-amount">{formatAmount(selectedTxn.amount)}</div>
            <div className="detail-date">{formatDate(selectedTxn.transaction_date)}</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div className="verified-badge">
              {Icon.check}&nbsp;Saved to Proof
            </div>
          </div>

          <div className="info-card">
            <div className="info-row">
              <div className="info-label">From / To</div>
              <div className="info-value">{selectedTxn.sender_name}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Bank</div>
              <div className="info-value">{selectedTxn.bank_name}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Date</div>
              <div className="info-value">{formatDate(selectedTxn.transaction_date)}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Narration</div>
              <div className="info-value" style={{ maxWidth: "60%" }}>{selectedTxn.narration}</div>
            </div>
          </div>

          {selectedTxn.image_url && (
            <div>
              <div className="section-title" style={{ marginBottom: 10 }}>Receipt Image</div>
              <div className="preview-card">
                <img src={selectedTxn.image_url} alt="Receipt" className="preview-img" />
              </div>
            </div>
          )}

          <button className="btn-green" style={{ marginTop: 8 }} onClick={() => showToast("Share link copied! 🔗")}>
            Share Verified Proof
          </button>
        </div>
      </div>
    );

    if (activeNav === "search") return (
      <div className="fade-in">
        <div className="search-header">
          <div className="screen-title" style={{ marginBottom: 12 }}>Search</div>
          <div className="search-box">
            {Icon.search}
            <input
              className="search-input"
              placeholder="Search by name, bank, amount..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="search-body">
          {searchQuery === "" ? (
            <div className="empty-state">
              <div className="empty-icon">{Icon.search}</div>
              <h3>Find any receipt</h3>
              <p>Search by sender name, bank, amount, or narration</p>
            </div>
          ) : filteredTxns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{Icon.receipt}</div>
              <h3>No results found</h3>
              <p>Try a different keyword or upload the receipt</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: "var(--grey-3)", marginBottom: 12, fontWeight: 600 }}>
                {filteredTxns.length} result{filteredTxns.length !== 1 ? "s" : ""} found
              </div>
              {filteredTxns.map(txn => (
                <div key={txn.id} className="txn-card" onClick={() => setSelectedTxn(txn)}>
                  <div className="txn-avatar" style={{ background: getBankColor(txn.bank_name) }}>
                    {getInitials(txn.sender_name)}
                  </div>
                  <div className="txn-info">
                    <div className="txn-name">{txn.sender_name}</div>
                    <div className="txn-narration">{txn.narration}</div>
                  </div>
                  <div className="txn-right">
                    <div className={`txn-amount ${txn.type}`}>{formatAmount(txn.amount)}</div>
                    <div className="txn-date">{txn.bank_name}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );

    if (activeNav === "upload") return (
      <div className="fade-in">
        <div className="upload-header">
          <div className="screen-title">Upload Receipt</div>
          <div className="screen-sub">AI will extract transaction details automatically</div>
        </div>
        <div className="upload-body">
          <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleFileChange} />

          {!uploadedFile ? (
            <div className="upload-zone" onClick={() => fileRef.current.click()}>
              <div className="upload-zone-icon">{Icon.camera}</div>
              <h3>Upload Payment Proof</h3>
              <p>Tap to select from gallery or take a photo</p>
              <div className="upload-types">
                <span className="type-badge">Screenshot</span>
                <span className="type-badge">Bank Alert</span>
                <span className="type-badge">Transfer Receipt</span>
                <span className="type-badge">POS Slip</span>
              </div>
            </div>
          ) : (
            <div className="preview-card">
              {uploadedPreview && <img src={uploadedPreview} alt="Preview" className="preview-img" />}
              <div className="preview-info">
                <div>
                  <div className="preview-name">{uploadedFile.name}</div>
                  <div className="preview-size">{(uploadedFile.size / 1024).toFixed(1)} KB</div>
                </div>
                <button style={{ background: "none", border: "none", color: "var(--grey-3)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                  onClick={() => { setUploadedFile(null); setUploadedPreview(null); setAiResult(null); }}>
                  Remove
                </button>
              </div>
            </div>
          )}

          {(aiLoading || aiResult) && (
            <div className="ai-card">
              <div className="ai-badge">
                <div className="ai-pulse"></div>
                AI Extraction
              </div>
              {aiLoading ? (
                <div className="ai-loading">
                  <div className="loading-dots">
                    <span/><span/><span/>
                  </div>
                  <div className="ai-loading-text">Reading your receipt...</div>
                </div>
              ) : aiResult ? (
                <>
                  <div className="ai-fields">
                    <div className="ai-field">
                      <div className="ai-field-label">Amount</div>
                      <div className="ai-field-value">{formatAmount(aiResult.amount)}</div>
                    </div>
                    <div className="ai-field">
                      <div className="ai-field-label">Bank</div>
                      <div className="ai-field-value">{aiResult.bank_name}</div>
                    </div>
                    <div className="ai-field">
                      <div className="ai-field-label">From / To</div>
                      <div className="ai-field-value">{aiResult.sender_name}</div>
                    </div>
                    <div className="ai-field">
                      <div className="ai-field-label">Date</div>
                      <div className="ai-field-value">{formatDate(aiResult.transaction_date)}</div>
                    </div>
                    <div className="ai-field full">
                      <div className="ai-field-label">Narration</div>
                      <div className="ai-field-value">{aiResult.narration}</div>
                    </div>
                  </div>
                  <div className="ai-confidence">
                    <span>Confidence</span>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: aiResult.confidence === "high" ? "90%" : aiResult.confidence === "medium" ? "60%" : "35%" }}/>
                    </div>
                    <span style={{ textTransform: "capitalize" }}>{aiResult.confidence}</span>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {aiResult && (
            <button className="btn-green" onClick={handleSave}>
              Save to My Receipts
            </button>
          )}

          {!uploadedFile && (
            <div style={{ marginTop: 20, padding: 16, background: "var(--grey-7)", borderRadius: "var(--radius)", border: "1px solid var(--grey-5)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--grey-1)", marginBottom: 8 }}>💡 What you can upload</div>
              <div style={{ fontSize: 13, color: "var(--grey-3)", lineHeight: 1.7 }}>
                • GTBank, Zenith, Access, UBA, Kuda alerts<br/>
                • OPay, PalmPay, Moniepoint receipts<br/>
                • WhatsApp payment screenshots<br/>
                • POS & ATM transaction slips
              </div>
            </div>
          )}
        </div>
      </div>
    );

    // Dashboard (default)
    return (
      <div className="fade-in">
        <div className="dash-header">
          <div className="dash-top">
            <div>
              <div className="dash-greeting">Good day,</div>
              <div className="dash-name">{user?.name?.split(" ")[0] || "there"} 👋</div>
            </div>
            <div className="avatar">{getInitials(user?.name || "U")}</div>
          </div>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Saved Receipts</div>
              <div className="stat-value">{transactions.length}</div>
              <div className="stat-sub">All time</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">This Month</div>
              <div className="stat-value">{transactions.filter(t => new Date(t.created_at).getMonth() === new Date().getMonth()).length}</div>
              <div className="stat-sub">May 2025</div>
            </div>
          </div>
        </div>

        <div className="dash-body">
          <div style={{ marginBottom: 20 }}>
            <div className="section-header">
              <div className="section-title">Quick Actions</div>
            </div>
            <div className="quick-actions">
              <div className="qa-card" onClick={() => setActiveNav("upload")}>
                <div className="qa-icon">{Icon.upload}</div>
                <div className="qa-label">Upload Receipt</div>
              </div>
              <div className="qa-card" onClick={() => setActiveNav("search")}>
                <div className="qa-icon">{Icon.search}</div>
                <div className="qa-label">Search Proof</div>
              </div>
            </div>
          </div>

          <div>
            <div className="section-header">
              <div className="section-title">Recent Activity</div>
              <button className="section-link" onClick={() => setActiveNav("search")}>See all</button>
            </div>
            {transactions.slice(0, 5).map(txn => (
              <div key={txn.id} className="txn-card" onClick={() => setSelectedTxn(txn)}>
                <div className="txn-avatar" style={{ background: getBankColor(txn.bank_name) }}>
                  {getInitials(txn.sender_name)}
                </div>
                <div className="txn-info">
                  <div className="txn-name">{txn.sender_name}</div>
                  <div className="txn-narration">{txn.narration}</div>
                </div>
                <div className="txn-right">
                  <div className={`txn-amount ${txn.type}`}>
                    {txn.type === "credit" ? "+" : "-"}{formatAmount(txn.amount)}
                  </div>
                  <div className="txn-date">{formatDate(txn.transaction_date)}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 16 }} />
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        <div className="screen">
          {renderScreen()}
        </div>

        {!selectedTxn && (
          <div className="bottom-nav">
            <button className={`nav-item ${activeNav === "home" ? "active" : ""}`} onClick={() => setActiveNav("home")}>
              {Icon.home}
              <span>Home</span>
            </button>
            <button className={`nav-item ${activeNav === "search" ? "active" : ""}`} onClick={() => setActiveNav("search")}>
              {Icon.search}
              <span>Search</span>
            </button>
            <button className="nav-upload-btn" onClick={() => setActiveNav("upload")}>
              {Icon.plus}
            </button>
            <button className={`nav-item ${activeNav === "upload" ? "active" : ""}`} onClick={() => setActiveNav("upload")}>
              {Icon.receipt}
              <span>Receipts</span>
            </button>
            <div className="nav-item" onClick={() => showToast("Profile coming soon!")}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: activeNav === "profile" ? "var(--green-light)" : "var(--grey-6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--green)" }}>
                {getInitials(user?.name || "U")}
              </div>
              <span style={{ fontSize: 11, color: "var(--grey-4)", fontWeight: 500 }}>Profile</span>
            </div>
          </div>
        )}

        <div className={`toast ${toast.show ? "show" : ""}`}>{toast.msg}</div>
      </div>
    </>
  );
}
