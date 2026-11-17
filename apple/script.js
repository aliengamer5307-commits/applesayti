
// ===================================
// OWL CAROUSEL
// ===================================
$(document).ready(function () {

  $(".product-carousel").owlCarousel({
    loop: true,
    margin: 18,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    smartSpeed: 700,
    navText: ["‹", "›"],
    responsive: {
      0: {
        items: 1,
        margin: 10
      },
      550: {
        items: 2
      },
      850: {
        items: 3
      },
      1150: {
        items: 4
      }
    }
  });

  $(".device-carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    dots: true,
    autoplay: false,
    smartSpeed: 650,
    navText: ["‹", "›"],
    responsive: {
      0: { items: 1 },
      550: { items: 2 },
      900: { items: 3 },
      1150: { items: 4 }
    }
  });

});

// ===================================
// LIGHT / DARK THEME
// ===================================
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  localStorage.setItem("appleTheme", theme);
}

const savedTheme = localStorage.getItem("appleTheme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark")
    ? "light"
    : "dark";

  setTheme(nextTheme);
});

// ===================================
// MOBILE NAVIGATION
// ===================================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

// ===================================
// IMAGE FALLBACK
// ===================================
document.querySelectorAll("img").forEach(img => {
  img.addEventListener("error", () => {
    img.style.opacity = "0.2";
    img.alt = "Image unavailable";
  });
});


/* IPHONE SIMULATOR */

let phoneOn = true;
let phoneUnlocked = false;

function togglePhone() {
  phoneOn = !phoneOn;

  document.getElementById("phoneScreen").style.background =
    phoneOn ? "" : "#000";

  document.getElementById("phoneLock").style.display =
    phoneOn ? "flex" : "none";

  document.getElementById("phoneHome").style.display = "none";
  document.getElementById("phoneAppPage").style.display = "none";

  phoneUnlocked = false;
}

function unlockPhone() {
  if (!phoneOn) {
    togglePhone();
  }

  phoneUnlocked = true;
  document.getElementById("phoneLock").style.display = "none";
  document.getElementById("phoneHome").style.display = "block";
  document.getElementById("phoneAppPage").style.display = "none";
}

function goHome() {
  document.getElementById("phoneAppPage").style.display = "none";
  document.getElementById("phoneHome").style.display = "block";
}

function openApp(app) {
  if (!phoneOn) return;

  if (!phoneUnlocked) {
    unlockPhone();
    return;
  }

  if (app === "youtube") {
    window.open("https://www.youtube.com/", "_blank");
    return;
  }

  if (app === "music") {
    window.open("https://music.apple.com/", "_blank");
    return;
  }

  if (app === "safari") {
    document.getElementById("appContent").innerHTML = `
      <h2>Safari</h2>
      <p>Enter a website address:</p>
      <input id="siteAddress" placeholder="example.com">
      <button onclick="visitSite()">Go</button>
    `;
  }

  else if (app === "photos") {
    document.getElementById("appContent").innerHTML =
      "<h2>Photos</h2><p>Your photo library is empty.</p>🌄";
  }

  else if (app === "calculator") {
    document.getElementById("appContent").innerHTML = `
      <h2>Calculator</h2>
      <input id="calcInput" placeholder="Example: 25*4">
      <button onclick="calculate()">=</button>
      <p id="calcResult">Result appears here</p>
    `;
  }

  else if (app === "notes") {
    document.getElementById("appContent").innerHTML = `
      <h2>Notes</h2>
      <textarea id="phoneNotes" rows="7"
        style="width:95%;border:1px solid #ccc;border-radius:10px;padding:8px"
        placeholder="Write your notes..."></textarea>
      <button onclick="saveNotes()">Save</button>
      <p id="noteStatus"></p>
    `;

    document.getElementById("phoneNotes").value =
      localStorage.getItem("phoneNotes") || "";
  }

  else if (app === "game") {
    document.getElementById("appContent").innerHTML = `
      <h2>🦖 Dino Runner</h2>
      <p>Tap the button to jump over obstacles!</p>
      <div id="dinoGame" style="
        height:110px;background:#e5e5e5;border-radius:12px;
        position:relative;overflow:hidden;color:#222">
        <div id="dino" style="position:absolute;bottom:10px;left:25px;font-size:30px">🦖</div>
        <div id="obstacle" style="position:absolute;bottom:10px;right:0;font-size:27px">🌵</div>
      </div>
      <h3>Score: <span id="gameScore">0</span></h3>
      <button onclick="jumpDino()">JUMP</button>
      <button onclick="startDino()">Restart</button>
    `;
    startDino();
  }

  else {
    document.getElementById("appContent").innerHTML =
      `<h2>${app.toUpperCase()}</h2><p>Welcome to ${app}!</p>`;
  }

  document.getElementById("phoneHome").style.display = "none";
  document.getElementById("phoneAppPage").style.display = "block";
}

function visitSite() {
  let address = document.getElementById("siteAddress").value.trim();
  if (!address) return;

  if (!/^https?:\/\//i.test(address)) {
    address = "https://" + address;
  }

  window.open(address, "_blank");
}

function calculate() {
  const value = document.getElementById("calcInput").value.trim();

  if (!/^[0-9+\-*/().% ]+$/.test(value)) {
    document.getElementById("calcResult").textContent = "Invalid expression";
    return;
  }

  try {
    const result = Function('"use strict"; return (' + value + ')')();
    document.getElementById("calcResult").textContent =
      Number.isFinite(result) ? result : "Invalid result";
  } catch {
    document.getElementById("calcResult").textContent = "Error";
  }
}

function saveNotes() {
  localStorage.setItem(
    "phoneNotes",
    document.getElementById("phoneNotes").value
  );
  document.getElementById("noteStatus").textContent = "Saved!";
}

/* DINO GAME */

let dinoTimer = null;
let scoreTimer = null;
let dinoScore = 0;
let dinoJumping = false;

function startDino() {
  clearInterval(dinoTimer);
  clearInterval(scoreTimer);

  dinoScore = 0;
  dinoJumping = false;

  const score = document.getElementById("gameScore");
  const obstacle = document.getElementById("obstacle");

  if (!score || !obstacle) return;

  score.textContent = "0";
  obstacle.style.right = "0px";

  let position = 0;

  dinoTimer = setInterval(() => {
    position += 5;
    obstacle.style.right = position + "px";

    if (position > 230) position = 0;

    if (position > 175 && position < 210 && !dinoJumping) {
      clearInterval(dinoTimer);
      clearInterval(scoreTimer);
      alert("Game Over! Your score: " + dinoScore);
    }
  }, 45);

  scoreTimer = setInterval(() => {
    dinoScore++;
    const currentScore = document.getElementById("gameScore");
    if (currentScore) currentScore.textContent = dinoScore;
  }, 300);
}

function jumpDino() {
  if (dinoJumping) return;

  const dino = document.getElementById("dino");
  if (!dino) return;

  dinoJumping = true;
  dino.style.bottom = "65px";

  setTimeout(() => {
    dino.style.bottom = "10px";
    dinoJumping = false;
  }, 550);
}

/* MACBOOK */

let macOpen = false;

function toggleMac() {
  macOpen = !macOpen;

  document.getElementById("macbookLid")
    .classList.toggle("open", macOpen);

  document.getElementById("macStatus").textContent =
    macOpen ? "MacBook is open and running" : "MacBook is closed";
}

function macApp(app) {
  if (!macOpen) {
    toggleMac();
  }

  if (app === "youtube") {
    window.open("https://www.youtube.com/", "_blank");
  } else if (app === "music") {
    window.open("https://music.apple.com/", "_blank");
  } else if (app === "safari") {
    window.open("https://www.apple.com/safari/", "_blank");
  } else {
    alert(app.charAt(0).toUpperCase() + app.slice(1) + " opened!");
  }
}

/* IPAD */

let ipadOn = true;

function toggleIPad() {
  ipadOn = !ipadOn;

  document.getElementById("ipadScreen").style.display =
    ipadOn ? "block" : "none";
}

function tabletApp(app) {
  if (!ipadOn) return;

  if (app === "youtube") {
    window.open("https://www.youtube.com/", "_blank");
  } else if (app === "music") {
    window.open("https://music.apple.com/", "_blank");
  } else if (app === "safari") {
    window.open("https://www.apple.com/safari/", "_blank");
  } else if (app === "game") {
    document.getElementById("ipadMessage").innerHTML =
      "🦖 Dino Game: Open the iPhone to play the full game!";
  } else {
    document.getElementById("ipadMessage").textContent =
      app.charAt(0).toUpperCase() + app.slice(1) + " opened!";
  }
}

function tabletHome() {
  if (ipadOn) {
    document.getElementById("ipadMessage").textContent =
      "Choose an app to get started.";
  }
}

/* CLOCK */

function updatePhoneClock() {
  const now = new Date();
  const clock = document.getElementById("lockTime");

  if (clock) {
    clock.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }
}

updatePhoneClock();
setInterval(updatePhoneClock, 1000);
