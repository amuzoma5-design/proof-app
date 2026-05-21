import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://etefvsueyoqrlmguffhi.supabase.co";
const SUPABASE_KEY = "sb_publishable_Tg3bm89cdmDHdNu6rOrmWg_rFzkynX-";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
const fmtDate = (d) => new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
const bankColor = (b) => {
  const colors = { GTBank: "#F26522", "Zenith Bank": "#C8102E", OPay: "#1DB954", Kuda: "#6C20AA", PalmPay: "#00B4D8", Access: "#E2001A", UBA: "#E00025", "First Bank": "#0F4C81" };
  for (const key of Object.keys(colors)) { if (b && b.toLowerCase().includes(key.toLowerCase())) return colors[key]; }
  return "#065F46";
};
const initials = (n) => n?.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase() || "??";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --green: #065F46; --green-mid: #047857; --green-light: #D1FAE5; --green-soft: #ECFDF5;
    --black: #0A0F1A; --grey-1: #1F2937; --grey-2: #374151; --grey-3: #6B7280; --grey-4: #9CA3AF;
    --grey-5: #E5E7EB; --grey-6: #F3F4F6; --grey-7: #F9FAFB; --white: #FFFFFF;
    --radius: 16px; --radius-sm: 10px; --shadow: 0 2px 16px rgba(0,0,0,0.07); --nav-h: 68px;
  }
 html, body { height: 100%; overflow: hidden; padding-bottom: env(safe-area-inset-bottom); }
  body { font-family: 'DM Sans', sans-serif; background: var(--grey-7); color: var(--black); -webkit-font-smoothing: antialiased; }
  #root { height: 100%; display: flex; justify-content: center; background: #E9EDF2; }
  .app-shell { width: 100%; max-width: 430px; height: 100%; background: var(--white); display: flex; flex-direction: column; position: relative; overflow: hidden; box-shadow: 0 0 60px rgba(0,0,0,0.12); }
  .screen { flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
  .screen::-webkit-scrollbar { display: none; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  .fade-in { animation: fadeIn 0.3s ease; }
  .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
`;

const GG = { background: "linear-gradient(155deg,#022C22 0%,#065F46 100%)" };

function Btn({ children, onClick, style = {}, outline = false, loading = false, dark = false }) {
  return (
    <button onClick={onClick} disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: 14, border: outline ? "1.5px solid rgba(255,255,255,0.25)" : "none", background: outline ? "transparent" : dark ? "white" : "#065F46", color: outline ? "rgba(255,255,255,0.85)" : dark ? "#065F46" : "white", fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: outline ? 10 : 0, opacity: loading ? 0.8 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...style }}>
      {loading ? <span className="spinner" /> : null}{children}
    </button>
  );
}

function Input({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>{label}</label>
      <input type={type} style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "13px 14px", fontFamily: "inherit", fontSize: 15, outline: "none", background: "#F9FAFB", boxSizing: "border-box", color: "#0A0F1A" }} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

function TxnCard({ txn, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: "white", borderRadius: 14, marginBottom: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer", border: "1px solid #F3F4F6" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: bankColor(txn.bank_name), display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials(txn.sender_name)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#0A0F1A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{txn.sender_name}</div>
        <div style={{ fontSize: 12, color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{txn.narration}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 700, color: txn.type === "credit" ? "#065F46" : "#1F2937" }}>{txn.type === "credit" ? "+" : "-"}{fmt(txn.amount)}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{fmtDate(txn.transaction_date)}</div>
      </div>
    </div>
  );
}

function NavBar({ active, setActive }) {
  const items = [
    { id: "home", label: "Home", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id: "search", label: "Search", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
    { id: "receipts", label: "Receipts", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { id: "profile", label: "Profile", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];
  return (
    <div style={{ height: 96, background: "white", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", padding: "0 6px 32px", flexShrink: 0 }}>
      {items.slice(0, 2).map(i => (
        <button key={i.id} onClick={() => setActive(i.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0", color: active === i.id ? "#065F46" : "#9CA3AF" }}>
          {i.icon}<span style={{ fontSize: 10, fontWeight: 600 }}>{i.label}</span>
        </button>
      ))}
      <button onClick={() => setActive("upload")} style={{ width: 52, height: 52, background: "#065F46", borderRadius: 15, border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer", boxShadow: "0 6px 18px rgba(6,95,70,0.4)", flexShrink: 0 }}>
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      {items.slice(2).map(i => (
        <button key={i.id} onClick={() => setActive(i.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0", color: active === i.id ? "#065F46" : "#9CA3AF" }}>
          {i.icon}<span style={{ fontSize: 10, fontWeight: 600 }}>{i.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [tab, setTab] = useState("login");
  const [nav, setNav] = useState("home");
  const [user, setUser] = useState(null);
  const [txns, setTxns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [aiRes, setAiRes] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const fileRef = useRef();

  // ── Check session on load ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setScreen("app");
        loadTransactions(session.user.id);
      }
      setAppLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setScreen("app");
        loadTransactions(session.user.id);
      } else {
        setUser(null);
        setScreen("welcome");
        setTxns([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadTransactions = async (userId) => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) setTxns(data);
  };

  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: "" }), 2800); };

  const handleLogin = async () => {
    if (!email || !pass) return showToast("Fill all fields");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) showToast(error.message);
    setAuthLoading(false);
  };

  const handleSignup = async () => {
    if (!name || !email || !pass) return showToast("Fill all fields");
    if (pass.length < 6) return showToast("Password must be at least 6 characters");
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password: pass,
      options: { data: { full_name: name } }
    });
    if (error) showToast(error.message);
    else showToast("Check your email to confirm your account!");
    setAuthLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast("Logged out successfully");
  };

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f); setAiRes(null);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target.result);
    r.readAsDataURL(f);
    setAiLoading(true);
    try {
      const b64 = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = e2 => res(e2.target.result.split(",")[1]); fr.onerror = rej; fr.readAsDataURL(f); });
      const resp = await fetch("/.netlify/functions/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: b64, mediaType: f.type })
      });
      const parsed = await resp.json();
      setAiRes(parsed);
    } catch {
      setAiRes({ amount: "0", sender_name: "Unknown", bank_name: "Unknown", transaction_date: new Date().toISOString().split("T")[0], narration: "Payment received", confidence: "low" });
    } finally { setAiLoading(false); }
  };

  const handleSave = async () => {
    if (!aiRes || !user) return;
    setSaveLoading(true);
    try {
      let imageUrl = null;

      // Upload image to Supabase Storage
      if (file) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(fileName, file);
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      }

      // Save transaction to database
      const { data, error } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount: parseFloat(aiRes.amount) || 0,
        sender_name: aiRes.sender_name || "Unknown",
        bank_name: aiRes.bank_name || "Unknown",
        transaction_date: aiRes.transaction_date || new Date().toISOString().split("T")[0],
        narration: aiRes.narration || "Payment",
        image_url: imageUrl,
        type: "credit",
      }).select().single();

      if (error) { showToast("Error saving receipt"); return; }
      setTxns(prev => [data, ...prev]);
      setFile(null); setPreview(null); setAiRes(null);
      setNav("home");
      showToast("Receipt saved successfully ✓");
    } catch (err) {
      showToast("Error saving receipt");
    } finally {
      setSaveLoading(false);
    }
  };

  const filtered = txns.filter(t => [t.sender_name, t.narration, t.bank_name, String(t.amount)].some(v => v?.toLowerCase().includes(q.toLowerCase())));
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  // ── LOADING ──
  if (appLoading) return (
    <>
      <style>{styles}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "#E9EDF2", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ ...GG, width: 430, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, background: "rgba(255,255,255,0.12)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 36 36"><rect x="6" y="4" width="24" height="28" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/><path d="M11 13h14M11 18h10M11 23h7" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="27" cy="27" r="6" fill="#4ADE80"/><path d="M24.5 27l1.5 1.5 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontFamily: "Sora, sans-serif", fontSize: 28, fontWeight: 800, color: "white" }}>Proof</div>
          <div className="spinner" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
        </div>
      </div>
    </>
  );

  // ── WELCOME ──
  if (screen === "welcome") return (
    <>
      <style>{styles}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "#E9EDF2", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 16px" }}>
        <div style={{ width: "100%", maxWidth: 390, height: "100vh", maxHeight: 780, ...GG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "60px 28px 48px", position: "relative", overflow: "hidden", borderRadius: 24, boxShadow: "0 0 60px rgba(0,0,0,0.15)" }}>
          <div style={{ position: "absolute", top: -100, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 1 }}>
            <div style={{ width: 68, height: 68, background: "rgba(255,255,255,0.12)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
              <svg width="34" height="34" fill="none" viewBox="0 0 36 36"><rect x="6" y="4" width="24" height="28" rx="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/><path d="M11 13h14M11 18h10M11 23h7" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="27" cy="27" r="6" fill="#4ADE80"/><path d="M24.5 27l1.5 1.5 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontFamily: "Sora, sans-serif", fontSize: 34, fontWeight: 800, color: "white", letterSpacing: -1 }}>Proof</div>
          </div>
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <div style={{ fontFamily: "Sora, sans-serif", fontSize: 24, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 12 }}>Your Financial Memory.</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Never lose a payment proof again.<br/>Save, search, and verify every receipt.</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
              {["📱 Mobile First", "🤖 AI Powered", "🔒 Secure"].map(p => (
                <div key={p} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{p}</div>
              ))}
            </div>
          </div>
          <div style={{ width: "100%", zIndex: 1 }}>
            <Btn dark onClick={() => { setTab("signup"); setScreen("auth"); }}>Get Started Free</Btn>
            <Btn outline onClick={() => { setTab("login"); setScreen("auth"); }}>I have an account</Btn>
            <div style={{ textAlign: "center", marginTop: 16, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>🔒 Your data is encrypted and private</div>
          </div>
        </div>
      </div>
    </>
  );

  // ── AUTH ──
  if (screen === "auth") return (
    <>
      <style>{styles}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "#E9EDF2", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 16px" }}>
        <div style={{ width: "100%", maxWidth: 390, height: "100vh", maxHeight: 780, background: "white", display: "flex", flexDirection: "column", borderRadius: 24, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.15)" }}>
          <div style={{ ...GG, padding: "52px 24px 36px" }}>
            <button onClick={() => setScreen("welcome")} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer", marginBottom: 20 }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div style={{ fontFamily: "Sora, sans-serif", fontSize: 24, fontWeight: 700, color: "white", marginBottom: 4 }}>{tab === "login" ? "Welcome back" : "Create account"}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>{tab === "login" ? "Sign in to your Proof account" : "Start organizing your financial life"}</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
            <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 4, marginBottom: 24 }}>
              {["login", "signup"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ flex: 1, background: tab === t ? "white" : "transparent", border: "none", borderRadius: 7, padding: "10px", fontFamily: "inherit", fontSize: 14, fontWeight: tab === t ? 700 : 500, color: tab === t ? "#065F46" : "#6B7280", cursor: "pointer", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                  {t === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>
            {tab === "signup" && <Input label="Full Name" placeholder="e.g. Chidi Okafor" value={name} onChange={e => setName(e.target.value)} />}
            <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Password" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
            <Btn loading={authLoading} onClick={tab === "login" ? handleLogin : handleSignup} style={{ marginTop: 8, background: "#065F46", color: "white" }}>
              {tab === "login" ? "Log In to Proof" : "Create My Account"}
            </Btn>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0", color: "#9CA3AF", fontSize: 13 }}>
              <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />or<div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            </div>
            <button onClick={handleGoogleLogin} style={{ width: "100%", background: "white", border: "1.5px solid #E5E7EB", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "inherit", fontSize: 15, fontWeight: 500, color: "#1F2937", cursor: "pointer" }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // ── MAIN APP ──
  const renderContent = () => {
    if (selected) return (
      <div className="fade-in">
        <div style={{ padding: "48px 20px 20px", background: "white", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSelected(null)} style={{ background: "#F3F4F6", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <div style={{ fontFamily: "Sora, sans-serif", fontSize: 18, fontWeight: 700 }}>Receipt Detail</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Verified proof</div>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ ...GG, borderRadius: 20, padding: "26px 22px", textAlign: "center", marginBottom: 16 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "4px 12px", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
              {selected.type === "credit" ? "↓ Received" : "↑ Sent"}
            </div>
            <div style={{ fontFamily: "Sora, sans-serif", fontSize: 36, fontWeight: 800, color: "white", letterSpacing: -1 }}>{fmt(selected.amount)}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 8 }}>{fmtDate(selected.transaction_date)}</div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ECFDF5", border: "1px solid #D1FAE5", borderRadius: 8, padding: "6px 12px", color: "#065F46", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            Saved to Proof
          </div>
          <div style={{ background: "#F9FAFB", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden", marginBottom: 16 }}>
            {[["From / To", selected.sender_name], ["Bank", selected.bank_name], ["Date", fmtDate(selected.transaction_date)], ["Narration", selected.narration]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "13px 16px", borderBottom: "1px solid #E5E7EB", gap: 12 }}>
                <div style={{ fontSize: 13, color: "#6B7280" }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0A0F1A", textAlign: "right", maxWidth: "60%" }}>{v}</div>
              </div>
            ))}
          </div>
          {selected.image_url && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Receipt Image</div>
              <img src={selected.image_url} alt="Receipt" style={{ width: "100%", borderRadius: 12, maxHeight: 220, objectFit: "cover" }} />
            </div>
          )}
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast("Link copied! 🔗"); }} style={{ width: "100%", background: "#065F46", color: "white", border: "none", borderRadius: 14, padding: 16, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Share Verified Proof
          </button>
        </div>
      </div>
    );

    if (nav === "search") return (
      <div className="fade-in">
        <div style={{ padding: "48px 20px 16px", background: "white", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ fontFamily: "Sora, sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Search</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "11px 14px" }}>
            <svg width="18" height="18" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input style={{ flex: 1, border: "none", background: "transparent", fontFamily: "inherit", fontSize: 15, outline: "none", color: "#0A0F1A" }} placeholder="Search by name, bank, amount..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {q === "" ? (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <div style={{ width: 64, height: 64, background: "#F3F4F6", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#9CA3AF" }}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 17, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Find any receipt</div>
              <div style={{ fontSize: 14, color: "#9CA3AF" }}>Search by sender, bank, amount or narration</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 17, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No results</div>
              <div style={{ fontSize: 14, color: "#9CA3AF" }}>Try a different keyword</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, marginBottom: 12 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
              {filtered.map(t => <TxnCard key={t.id} txn={t} onClick={() => setSelected(t)} />)}
            </>
          )}
        </div>
      </div>
    );

    if (nav === "upload") return (
      <div className="fade-in">
        <div style={{ padding: "48px 20px 20px", background: "white", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ fontFamily: "Sora, sans-serif", fontSize: 20, fontWeight: 700, color: "#0A0F1A", marginBottom: 4 }}>Upload Receipt</div>
          <div style={{ fontSize: 14, color: "#6B7280" }}>AI extracts transaction details automatically</div>
        </div>
        <div style={{ padding: "20px 20px" }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          {!file ? (
            <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed #E5E7EB", borderRadius: 18, padding: "36px 20px", textAlign: "center", cursor: "pointer", background: "#F9FAFB", marginBottom: 18 }}>
              <div style={{ width: 60, height: 60, background: "#D1FAE5", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#065F46" }}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Upload Payment Proof</div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>Select from gallery or take a photo</div>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
                {["Screenshot", "Bank Alert", "Transfer Receipt", "POS Slip"].map(t => (
                  <div key={t} style={{ background: "#ECFDF5", color: "#065F46", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{t}</div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: "#F9FAFB", borderRadius: 14, overflow: "hidden", marginBottom: 16, border: "1px solid #E5E7EB" }}>
              {preview && <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />}
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <button onClick={() => { setFile(null); setPreview(null); setAiRes(null); }} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Remove</button>
              </div>
            </div>
          )}

          {(aiLoading || aiRes) && (
            <div style={{ ...GG, borderRadius: 18, padding: 18, marginBottom: 16 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "3px 10px", color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 600, marginBottom: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", animation: "pulse 1.5s infinite" }} />
                AI Extraction
              </div>
              {aiLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)", animation: `bounce 1.2s ${d}s infinite` }} />)}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>Reading your receipt...</div>
                </div>
              ) : aiRes && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["Amount", fmt(aiRes.amount)], ["Bank", aiRes.bank_name], ["From/To", aiRes.sender_name], ["Date", fmtDate(aiRes.transaction_date)], ["Narration", aiRes.narration]].map(([l, v], i) => (
                    <div key={l} style={i === 4 ? { gridColumn: "1/-1" } : {}}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, marginBottom: 2 }}>{l}</div>
                      <div style={{ fontFamily: "Sora, sans-serif", fontSize: 14, color: "white", fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {aiRes && (
            <button onClick={handleSave} disabled={saveLoading} style={{ width: "100%", background: "#065F46", color: "white", border: "none", borderRadius: 14, padding: 16, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: saveLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {saveLoading ? <><span className="spinner" />Saving...</> : "Save to My Receipts"}
            </button>
          )}
        </div>
      </div>
    );

    if (nav === "profile") return (
      <div className="fade-in">
        <div style={{ ...GG, padding: "52px 24px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora, sans-serif", fontSize: 20, fontWeight: 700, color: "white" }}>{initials(userName)}</div>
            <div>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 18, fontWeight: 700, color: "white" }}>{userName}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{user?.email}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ background: "#F9FAFB", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden", marginBottom: 20 }}>
            {[["Total Receipts", txns.length], ["This Month", txns.filter(t => new Date(t.created_at).getMonth() === new Date().getMonth()).length]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 14, color: "#6B7280" }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0A0F1A" }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={handleLogout} style={{ width: "100%", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 14, padding: 16, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Log Out
          </button>
        </div>
      </div>
    );

    // Dashboard
    return (
      <div className="fade-in">
        <div style={{ ...GG, padding: "50px 22px 26px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 3 }}>Good day,</div>
              <div style={{ fontFamily: "Sora, sans-serif", color: "white", fontSize: 20, fontWeight: 700 }}>{userName.split(" ")[0]} 👋</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora, sans-serif", fontSize: 13, fontWeight: 700, color: "white", border: "1.5px solid rgba(255,255,255,0.2)" }}>
              {initials(userName)}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["Saved Receipts", txns.length, "All time"], ["This Month", txns.filter(t => new Date(t.created_at).getMonth() === new Date().getMonth()).length, new Date().toLocaleString("default", { month: "long" })]].map(([l, v, s]) => (
              <div key={l} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: 14 }}>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{l}</div>
                <div style={{ fontFamily: "Sora, sans-serif", color: "white", fontSize: 26, fontWeight: 700 }}>{v}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 2 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "20px 18px" }}>
          <div style={{ fontFamily: "Sora, sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[["Upload Receipt", "📤", "upload"], ["Search Proof", "🔍", "search"]].map(([l, ic, id]) => (
              <div key={id} onClick={() => setNav(id)} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 14, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{ic}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontFamily: "Sora, sans-serif", fontSize: 15, fontWeight: 700 }}>Recent Activity</div>
            <button onClick={() => setNav("search")} style={{ background: "none", border: "none", color: "#065F46", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>See all</button>
          </div>
          {txns.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 24px", background: "#F9FAFB", borderRadius: 14, border: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🧾</div>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No receipts yet</div>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>Tap the + button to upload your first receipt</div>
            </div>
          ) : (
            txns.slice(0, 5).map(t => <TxnCard key={t.id} txn={t} onClick={() => setSelected(t)} />)
          )}
          <div style={{ height: 12 }} />
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ width: "100%", minHeight: "100vh", background: "#E9EDF2", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 16px" }}>
        <div style={{ width: "100%", maxWidth: 390, height: "100vh", maxHeight: 780, background: "white", display: "flex", flexDirection: "column", borderRadius: 24, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.15)" }}>
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{renderContent()}</div>
          {!selected && <NavBar active={nav} setActive={setNav} />}
          {toast.show && (
            <div style={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "#0A0F1A", color: "white", borderRadius: 12, padding: "11px 18px", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              {toast.msg}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
