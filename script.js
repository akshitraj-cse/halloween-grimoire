(function () {
  const SPELLS = [
    {id:1,name:"Shadow Cloak",category:"Dark Energy",ingredients:["Raven feather","Powdered obsidian","Moonless-night dew"],mana:40,effect:"Wraps the caster in living darkness, hiding them from sight and sound for one hour.",steps:["Draw a circle of obsidian powder at midnight.","Hold the raven feather over the dew and speak the name of your shadow.","Sweep the feather across your shoulders three times."],warning:"Never cast near open flame; the cloak will burn away."},
    {id:2,name:"Venom Burst",category:"Curses",ingredients:["Nightshade berries","Viper fang","Black salt"],mana:55,effect:"Unleashes a cloud of toxic spores that sickens everything within ten paces.",steps:["Crush the berries and fang into a fine paste.","Mix in black salt until it glows faintly green.","Hurl the mixture at your target and retreat upwind."],warning:"The caster must carry an antidote."},
    {id:3,name:"Soul Drain",category:"Necromancy",ingredients:["Grave dirt","Silver thread","Candle of bone fat"],mana:80,effect:"Siphons a target's life force into the caster's reserves.",steps:["Light the bone candle on an unmarked grave.","Bind the silver thread around the target's name on parchment.","Chant until the flame turns violet, then snuff it."],warning:"Drained souls may haunt the caster for seven nights."},
    {id:4,name:"Phantom Strike",category:"Curses",ingredients:["Ghost orchid","Cold iron nail","Spectral ash"],mana:65,effect:"Summons an unseen force that strikes the target from within the veil.",steps:["Pierce the ghost orchid with the iron nail.","Sprinkle spectral ash across your palm.","Point at the target and release the word of passing."],warning:"Leaves no trace, but the veil remembers."},
    {id:5,name:"Necrotic Plague",category:"Necromancy",ingredients:["Rotting lichen","Plague-rat tooth","Grave water"],mana:85,effect:"Spreads a creeping decay that withers crops, flesh and morale across a village.",steps:["Steep lichen and tooth in grave water for three nights.","Pour the brew across the target's threshold.","Speak the name of the village thrice."],warning:"The plague does not recognise its caster's friends."},
    {id:6,name:"Blood Moon Ritual",category:"Dark Energy",ingredients:["Crimson candles","Wolf's blood","Silver dagger","Red clay"],mana:95,effect:"Doubles all magic cast beneath the blood moon until it sets.",steps:["Ring a clearing with seven crimson candles.","Mark the clay with the dagger and wolf's blood.","Raise your arms and call the moon by its old name."],warning:"Only works during a lunar eclipse."},
    {id:7,name:"Hellfire Ward",category:"Curses",ingredients:["Brimstone","Dragon scale","Iron chain"],mana:70,effect:"Encircles the caster in black flame that burns anything hostile crossing it.",steps:["Lay the iron chain in a closed circle.","Scatter brimstone and dragon scale along it.","Strike a spark and name your enemies aloud."],warning:"The fire also scorches your own boots."},
    {id:8,name:"Banshee Wail",category:"Dark Energy",ingredients:["Mourning bell","Widow's tear","Silver whistle"],mana:60,effect:"A piercing shriek that shatters glass and sends foes fleeing in dread.",steps:["Ring the mourning bell once.","Blow the silver whistle over the widow's tear.","Open your mouth and let the grief out."],warning:"Cover your ears, or you will deafen yourself."},
    {id:9,name:"Elixir of Midnight",category:"Potions",ingredients:["Wolfsbane","Bat wing","Crimson moss","Spring water"],mana:35,effect:"Grants perfect night vision and heightened senses until dawn.",steps:["Simmer spring water until it steams violet.","Add bat wing, then wolfsbane, stirring counter-clockwise.","Fold in the moss, cool for 13 minutes and drink."],warning:"Do not combine with sunlight."},
    {id:10,name:"Witching Hour Brew",category:"Potions",ingredients:["Pumpkin seed oil","Toad lily","Cauldron soot"],mana:45,effect:"Restores mana swiftly but fills the mind with eerie whispers.",steps:["Warm the oil in an iron cauldron.","Dissolve soot and toad lily petals.","Stir clockwise 13 times beneath the midnight bell."],warning:"Whispers fade by morning."},
    {id:11,name:"Raise Bone Servant",category:"Necromancy",ingredients:["Skeleton knuckle","Graveyard moss","Blood-red wax"],mana:90,effect:"Animates a skeleton that obeys simple commands for one night.",steps:["Place the knuckle at the centre of a salt ring.","Seal it with blood-red wax and moss.","Speak the command of waking, then one clear order."],warning:"Servants obey literally. Choose your words wisely."},
    {id:12,name:"Pumpkin Hex Tonic",category:"Potions",ingredients:["Rotten pumpkin pulp","Spider silk","Candy corn ash"],mana:30,effect:"Turns the drinker's laughter into harmless green sparks for a night.",steps:["Mash the pulp with spider silk.","Sprinkle in candy corn ash and stir until it fizzes.","Sip slowly under a jack-o'-lantern's glow."],warning:"Side effects include uncontrollable cackling."}
  ];
  const CATS = ["All","Curses","Necromancy","Potions","Dark Energy"];
  const KEY = "grimoire_favorites";

  let favs = [];
  try { favs = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { favs = []; }
  const state = { tab: "all", cat: "All", q: "" };

  const $ = id => document.getElementById(id);
  const grid = $("grid"), empty = $("empty"), modal = $("modal"), modalBody = $("modalBody");

  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(favs)); } catch (e) {} };

  function toggleFav(id) {
    favs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    save(); render();
    if (!modal.hidden) openModal(id);
  }

  function visible() {
    const q = state.q.trim().toLowerCase();
    return SPELLS.filter(s =>
      (state.tab === "all" || favs.includes(s.id)) &&
      (state.cat === "All" || s.category === state.cat) &&
      (!q || s.name.toLowerCase().includes(q) || s.ingredients.some(i => i.toLowerCase().includes(q)))
    );
  }

  function render() {
    $("favCount").textContent = favs.length;
    const list = visible();
    grid.innerHTML = list.map(s => `
      <article class="card" data-id="${s.id}" tabindex="0" aria-label="Open ${esc(s.name)}">
        <button class="star ${favs.includes(s.id) ? "on" : ""}" data-fav="${s.id}" aria-label="Toggle bookmark" aria-pressed="${favs.includes(s.id)}">${favs.includes(s.id) ? "💀" : "☠"}</button>
        <h3>${esc(s.name)}</h3>
        <span class="tag">${esc(s.category)}</span>
        <dl>
          <dt>Ingredients</dt><dd>${s.ingredients.map(esc).join(", ")}</dd>
          <dt>Mana cost</dt><dd class="mana">${s.mana} MP</dd>
          <dt>Effect</dt><dd>${esc(s.effect)}</dd>
        </dl>
      </article>`).join("");
    empty.hidden = list.length > 0;
    if (!list.length) empty.textContent = state.tab === "fav" && !favs.length
      ? "No bookmarks yet. Tap the skull on any spell to save it here."
      : "No spells match. Try a different name, ingredient, or category.";
  }

  function openModal(id) {
    const s = SPELLS.find(x => x.id === id);
    const on = favs.includes(id);
    modalBody.innerHTML = `
      <h2 id="mTitle">${esc(s.name)}</h2>
      <span class="tag">${esc(s.category)}</span> <span class="mana">${s.mana} MP</span>
      <h4>Effect</h4><p>${esc(s.effect)}</p>
      <h4>Ingredients</h4><p>${s.ingredients.map(esc).join(" · ")}</p>
      <h4>Execution instructions</h4><ol>${s.steps.map(t => `<li>${esc(t)}</li>`).join("")}</ol>
      <p class="warn">${esc(s.warning)}</p>
      <button class="fav-btn" data-fav="${s.id}">${on ? "Remove bookmark" : "Bookmark spell"}</button>`;
    modal.hidden = false;
    $("close").focus();
  }
  const closeModal = () => { modal.hidden = true; };

  // Filters
  $("filters").innerHTML = CATS.map(c => `<button class="chip ${c === "All" ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
  $("filters").addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.dataset.cat;
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === b));
    render();
  });

  // Tabs
  document.querySelector(".tabs").addEventListener("click", e => {
    const b = e.target.closest("[data-tab]"); if (!b) return;
    state.tab = b.dataset.tab;
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t === b));
    render();
  });

  $("search").addEventListener("input", e => { state.q = e.target.value; render(); });

  // Card + bookmark clicks
  grid.addEventListener("click", e => {
    const f = e.target.closest("[data-fav]");
    if (f) { e.stopPropagation(); toggleFav(+f.dataset.fav); return; }
    const c = e.target.closest(".card"); if (c) openModal(+c.dataset.id);
  });
  grid.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.classList.contains("card")) openModal(+e.target.dataset.id);
  });
  modalBody.addEventListener("click", e => {
    const f = e.target.closest("[data-fav]"); if (f) toggleFav(+f.dataset.fav);
  });

  // Modal close
  $("close").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // ===== The Runaway Button =====
  const btn = $("runaway"), ph = $("placeholder"), status = $("runStatus");
  const MAX_RUNS = 4, DEPLETED_MS = 5000, TRIGGER = 120;
  let runs = 0, depleted = false, lastRun = 0;

  function runAway() {
    const now = Date.now();
    if (depleted || now - lastRun < 350) return;
    lastRun = now;
    if (!btn.classList.contains("fleeing")) {
      const r = btn.getBoundingClientRect();
      ph.style.width = r.width + "px"; ph.style.height = r.height + "px"; ph.hidden = false;
      btn.classList.add("fleeing");
      btn.style.left = r.left + "px"; btn.style.top = r.top + "px";
      void btn.offsetWidth;
    }
    const w = btn.offsetWidth, h = btn.offsetHeight, pad = 16;
    btn.style.left = pad + Math.random() * Math.max(0, innerWidth - w - 2 * pad) + "px";
    btn.style.top = 70 + Math.random() * Math.max(0, innerHeight - h - 70 - pad) + "px";
    runs++;
    if (runs >= MAX_RUNS) { status.textContent = "Kirmada's spell is fading…"; setTimeout(deplete, 450); }
    else status.textContent = "It escaped! Dodges: " + runs + " / " + MAX_RUNS;
  }

  function deplete() {
    depleted = true;
    btn.classList.add("depleted");
    btn.textContent = "Spell Depleted - Click Me!";
    let left = DEPLETED_MS / 1000;
    status.textContent = "Strike now! " + left + "s left";
    const t = setInterval(() => {
      left--;
      if (depleted && left > 0) status.textContent = "Strike now! " + left + "s left";
      else clearInterval(t);
    }, 1000);
    setTimeout(() => { if (depleted) recharge(); }, DEPLETED_MS);
  }

  function recharge() {
    depleted = false; runs = 0;
    btn.classList.remove("depleted");
    btn.textContent = "Cast Ultimate Spell";
    status.textContent = "Kirmada recovered his power. Try again.";
  }

  document.addEventListener("pointermove", e => {
    if (depleted) return;
    const r = btn.getBoundingClientRect();
    const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
    const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
    if (Math.hypot(dx, dy) < TRIGGER) runAway();
  });
  btn.addEventListener("pointerdown", e => { if (!depleted) { e.preventDefault(); runAway(); } });
  btn.addEventListener("click", () => {
    if (!depleted) return;
    depleted = false; runs = 0;
    $("victory").hidden = false;
    $("victoryClose").focus();
  });
  $("victoryClose").addEventListener("click", () => { $("victory").hidden = true; recharge(); status.textContent = "Want to go again?"; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") $("victory").hidden = true; });

  // ===== Ambient Spooky Audio Auto-Play Feature =====
  const bgAudio = $("bg-audio");
  bgAudio.volume = 0.2; // Sets a subtle 20% background atmosphere volume

  function playAmbientAudio() {
    bgAudio.play().then(() => {
      // Clean up event listeners once audio starts successfully
      document.removeEventListener('click', playAmbientAudio);
      document.removeEventListener('scroll', playAmbientAudio);
      document.removeEventListener('keydown', playAmbientAudio);
    }).catch(() => {
      // Catches and bypasses browser autoplay policy blocks smoothly
    });
  }

  // Automatically triggers on the user's first click, scroll, or keypress anywhere
  document.addEventListener('click', playAmbientAudio);
  document.addEventListener('scroll', playAmbientAudio);
  document.addEventListener('keydown', playAmbientAudio);

  render();
})();
