const body = document.body;
const modeBtn = document.getElementById("engineerModeToggle");
const interviewBtn = document.getElementById("interviewModeBtn");

const statusEl = document.getElementById("sysStatus");
const roleEl = document.getElementById("sysRole");
const locationEl = document.getElementById("sysLocation");
const versionEl = document.getElementById("sysVersion");
const uptimeEl = document.getElementById("sysUptime");

const throttle = document.getElementById("throttle");
const road = document.getElementById("road");
const car = document.getElementById("car");
const rearWheel = document.getElementById("w1");
const frontWheel = document.getElementById("w2");
const speedTxt = document.getElementById("speedTxt");
const stabTxt = document.getElementById("stabTxt");

const sun = document.getElementById("sun");
const sky = document.getElementById("skyArea");
const pivot = document.getElementById("pivot");
const g1 = document.getElementById("g1");
const g2 = document.getElementById("g2");
const vFill = document.getElementById("vFill");
const vNum = document.getElementById("vNum");

const copyMailBtn = document.getElementById("copyMailBtn");

const copyToast = document.createElement("div");
copyToast.className = "copy-toast";
copyToast.textContent = "email copied";
copyToast.setAttribute("role", "status");
copyToast.setAttribute("aria-live", "polite");
document.body.appendChild(copyToast);

let engineerMode = false;
let tourRunning = false;
let bootTime = Date.now();

let distance = 0;
let velocity = 0;
let stabilityValue = 100;
let wheelAngle = 0;
let copyToastTimer;
let lateralOffset = -18;

if (modeBtn) {
  modeBtn.addEventListener("click", () => {
    engineerMode = !engineerMode;
    body.classList.toggle("engineer-on", engineerMode);
    modeBtn.textContent = `Engineer Mode: ${engineerMode ? "ON" : "OFF"}`;
    modeBtn.setAttribute("aria-pressed", String(engineerMode));
  });
}

function updateStatusBar() {
  if (!statusEl || !roleEl || !locationEl || !versionEl || !uptimeEl) return;

  const elapsed = Math.floor((Date.now() - bootTime) / 1000);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  uptimeEl.textContent = `${mm}:${ss}`;
  statusEl.textContent = elapsed % 14 > 10 ? "SYNCING" : "ONLINE";
  roleEl.textContent = engineerMode ? "ENGINEER+SYSTEMS" : "ENGINEER";
  locationEl.textContent = "RAJAHMUNDRY, TANUKU";
  versionEl.textContent = engineerMode ? "v1.0-E" : "v1.0";
}

setInterval(updateStatusBar, 1000);
updateStatusBar();

function runEVDemo() {
  if (!throttle || !road || !car || !rearWheel || !frontWheel || !speedTxt || !stabTxt) return;

  const throttleValue = Number(throttle.value);
  const targetVelocity = throttleValue * 1.6;

  velocity += (targetVelocity - velocity) * 0.08;
  distance -= velocity / 6;
  wheelAngle += velocity * 0.22;

  const targetStability = Math.max(82, 100 - throttleValue * 0.05);
  stabilityValue += (targetStability - stabilityValue) * 0.04;

  // Keep car slightly left at low throttle and shift right gradually after 50%.
  const targetLateral = -18 + Math.max(0, throttleValue - 50) * 0.56;
  lateralOffset += (targetLateral - lateralOffset) * 0.08;

  speedTxt.textContent = velocity.toFixed(0);
  stabTxt.textContent = stabilityValue.toFixed(1);

  const suspension = Math.sin(distance / 15) * Math.min(2.5, velocity / 45);
  const bodyTilt = -Math.min(5, velocity / 45);

  road.style.transform = `translateX(${distance % 60}px)`;
  rearWheel.style.transform = `rotate(${wheelAngle}deg)`;
  frontWheel.style.transform = `rotate(${wheelAngle}deg)`;
  car.style.transform = `translateX(${lateralOffset}px) translateY(${suspension}px) rotate(${bodyTilt}deg)`;

  requestAnimationFrame(runEVDemo);
}

runEVDemo();

let sunActive = false;

function getPointerX(evt) {
  if (evt.touches && evt.touches.length > 0) {
    return evt.touches[0].clientX;
  }
  return evt.clientX;
}

function moveSun(evt) {
  if (!sunActive || !sun || !sky || !pivot || !g1 || !g2 || !vFill || !vNum) return;

  const rect = sky.getBoundingClientRect();
  const x = getPointerX(evt) - rect.left;
  const pct = Math.max(0, Math.min(1, x / rect.width));

  const sunX = pct * 100;
  const sunY = Math.pow(pct - 0.5, 2) * 160;

  sun.style.left = `calc(${sunX}% - 17px)`;
  sun.style.top = `${sunY}px`;

  pivot.style.transform = `rotateY(${(pct - 0.5) * 78}deg) rotateX(${(sunY / 100) * 40 + 30}deg)`;
  g1.style.transform = `rotate(${pct * 1080}deg)`;
  g2.style.transform = `rotate(${-pct * 1080}deg)`;

  const voltage = (1 - Math.abs(pct - 0.5) * 2) * 12.6;
  vFill.style.height = `${Math.max(0, voltage * 7)}%`;
  vNum.textContent = Math.max(0, voltage).toFixed(1);
}

if (sun) {
  sun.addEventListener("mousedown", () => {
    sunActive = true;
  });
  sun.addEventListener("touchstart", () => {
    sunActive = true;
  });

  window.addEventListener("mouseup", () => {
    sunActive = false;
  });
  window.addEventListener("touchend", () => {
    sunActive = false;
  });

  window.addEventListener("mousemove", moveSun);
  window.addEventListener(
    "touchmove",
    (evt) => {
      moveSun(evt);
      evt.preventDefault();
    },
    { passive: false }
  );
}

if (copyMailBtn) {
  copyMailBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("sowrya2809@gmail.com");
      copyMailBtn.classList.add("copied");
      copyMailBtn.setAttribute("aria-label", "Email copied");
      copyToast.classList.add("show");

      clearTimeout(copyToastTimer);
      copyToastTimer = setTimeout(() => {
        copyToast.classList.remove("show");
      }, 1000);

      setTimeout(() => {
        copyMailBtn.classList.remove("copied");
        copyMailBtn.setAttribute("aria-label", "Copy email");
      }, 1100);
    } catch {
      copyMailBtn.classList.remove("copied");
    }
  });
}

function animateCounter(el) {
  const target = Number(el.dataset.target || "0");
  const duration = 1000;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = target * progress;
    el.textContent = target % 1 === 0 ? Math.round(value) : value.toFixed(2);
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".counter").forEach((el) => counterObserver.observe(el));

if (interviewBtn) {
  interviewBtn.addEventListener("click", async () => {
    if (tourRunning) return;
    tourRunning = true;

    const sequence = ["hero", "timeline", "skills", "projects", "experience", "contact"];
    for (const id of sequence) {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        await new Promise((resolve) => setTimeout(resolve, 1600));
      }
    }

    tourRunning = false;
  });
}
