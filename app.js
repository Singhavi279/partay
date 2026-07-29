const flavours = {
  blue: {
    number: "01", name: "BLUE LAGOON", role: "The Party Starter",
    line: "MAIN CHARACTER DRINK",
    description: "Shows up loud, owns the room. No introduction needed.",
    src: "assets/bluelagoon.png", alt: "Partay Blue Lagoon instant mocktail mix"
  },
  pink: {
    number: "02", name: "COSMOPOLITAN", role: "The Standout Classic",
    line: "SIP LIKE YOU MEAN IT",
    description: "Smooth. Sharp. Unapologetic. The drink that makes the room turn around.",
    src: "assets/cosmopolitan.png", alt: "Partay Cosmopolitan instant mocktail mix"
  },
  green: {
    number: "03", name: "MOJITO", role: "The Legendary Refresher",
    line: "OG CHILL ICON",
    description: "Minty-cool, always trending, never trying too hard. The effortless one.",
    src: "assets/mojito.png", alt: "Partay Mojito instant mocktail mix"
  }
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stage = document.querySelector(".flavour-stage");
const pack = document.querySelector("#productPack");
const tabs = [...document.querySelectorAll("[data-flavour]")];
const flavourKeys = ["blue", "pink", "green"];
let flavourIndex = 0;
let flavourTimer = null;
let flavourVisible = false;

function setFlavour(key, shouldScroll = false) {
  const item = flavours[key];
  if (!item || !stage) return;
  flavourIndex = flavourKeys.indexOf(key);
  stage.dataset.activeFlavour = key;
  document.querySelector("#flavourNumber").textContent = item.number;
  document.querySelector("#flavourName").textContent = item.name;
  document.querySelector("#flavourRole").textContent = item.role;
  document.querySelector("#flavourLine").textContent = item.line;
  document.querySelector("#flavourDesc").textContent = item.description;
  pack.style.opacity = "0";
  pack.style.transform = "translateY(18px) rotate(-5deg)";
  window.setTimeout(() => {
    pack.src = item.src;
    pack.alt = item.alt;
    pack.style.opacity = "";
    pack.style.transform = "";
  }, 160);
  tabs.forEach(tab => {
    const active = tab.dataset.flavour === key;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active);
  });
  document.querySelectorAll("[data-flavour-jump]").forEach(glass => {
    glass.classList.toggle("active", glass.dataset.flavourJump === key);
  });
  if (shouldScroll) stage.scrollIntoView({ behavior: "smooth", block: "center" });
}

function startFlavourLoop() {
  window.clearInterval(flavourTimer);
  if (reducedMotion || !flavourVisible) return;
  flavourTimer = window.setInterval(() => {
    flavourIndex = (flavourIndex + 1) % flavourKeys.length;
    setFlavour(flavourKeys[flavourIndex]);
  }, 2500);
}

tabs.forEach(tab => tab.addEventListener("click", () => {
  setFlavour(tab.dataset.flavour);
  startFlavourLoop();
}));
document.querySelectorAll("[data-flavour-jump]").forEach(glass => {
  glass.addEventListener("click", () => {
    setFlavour(glass.dataset.flavourJump, true);
    startFlavourLoop();
  });
});

if (stage && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    flavourVisible = entry.isIntersecting;
    startFlavourLoop();
  }, { threshold: 0.18 }).observe(stage);
} else {
  flavourVisible = true;
  startFlavourLoop();
}

stage?.addEventListener("pointerenter", () => window.clearInterval(flavourTimer));
stage?.addEventListener("pointerleave", startFlavourLoop);
stage?.addEventListener("focusin", () => window.clearInterval(flavourTimer));
stage?.addEventListener("focusout", startFlavourLoop);

if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(item => observer.observe(item));
} else {
  document.querySelectorAll(".reveal").forEach(item => item.classList.add("in-view"));
}

const closing = document.querySelector(".closing");
const closingPack = document.querySelector("#closingPack");
const closingLabel = document.querySelector("#closingFlavour");
const closingKeys = ["blue", "pink", "green"];
const closingLabels = {
  blue: "BLUE LAGOON · MAIN CHARACTER DRINK",
  pink: "COSMOPOLITAN · SIP LIKE YOU MEAN IT",
  green: "MOJITO · OG CHILL ICON"
};
let closingIndex = 2;
let closingTimer;
let closingAnimating = false;
let closingVisible = false;

function showClosingFlavour(key) {
  if (!closing || !closingPack || closingAnimating || closing.dataset.closingFlavour === key) return;
  const item = flavours[key];
  closingAnimating = true;
  closingPack.classList.remove("is-entering");
  closingPack.classList.add("is-leaving");
  window.setTimeout(() => {
    closing.dataset.closingFlavour = key;
    closingPack.src = item.src;
    closingPack.alt = item.alt;
    closingLabel.textContent = closingLabels[key];
    document.querySelectorAll("[data-closing-pick]").forEach(dot => {
      dot.classList.toggle("active", dot.dataset.closingPick === key);
    });
    closingPack.classList.remove("is-leaving");
    void closingPack.offsetWidth;
    closingPack.classList.add("is-entering");
    window.setTimeout(() => {
      closingPack.classList.remove("is-entering");
      closingAnimating = false;
    }, 440);
  }, 230);
}

function startClosingLoop() {
  window.clearInterval(closingTimer);
  if (reducedMotion || !closingVisible) return;
  closingTimer = window.setInterval(() => {
    closingIndex = (closingIndex + 1) % closingKeys.length;
    showClosingFlavour(closingKeys[closingIndex]);
  }, 2200);
}

document.querySelectorAll("[data-closing-pick]").forEach(dot => {
  dot.addEventListener("click", () => {
    closingIndex = closingKeys.indexOf(dot.dataset.closingPick);
    showClosingFlavour(dot.dataset.closingPick);
    startClosingLoop();
  });
});

if (closing && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    closingVisible = entry.isIntersecting;
    startClosingLoop();
  }, { threshold: 0.18 }).observe(closing);
} else {
  closingVisible = true;
  startClosingLoop();
}

closing?.addEventListener("pointerenter", () => window.clearInterval(closingTimer));
closing?.addEventListener("pointerleave", startClosingLoop);
closing?.addEventListener("focusin", () => window.clearInterval(closingTimer));
closing?.addEventListener("focusout", startClosingLoop);

const priceButton = document.querySelector("#priceButton");
const priceAfter = document.querySelector("#priceAfter");
priceButton?.addEventListener("click", () => {
  document.querySelector(".price-before").hidden = true;
  priceAfter.classList.add("show");
});

const modal = document.querySelector("#orderModal");
document.querySelectorAll("[data-open-order]").forEach(button => {
  button.addEventListener("click", () => {
    const bulk = button.dataset.orderType === "bulk";
    document.querySelector("#modalTitle").textContent = bulk ? "LET’S BULK UP THE PARTAY." : "LET’S FIND YOUR PARTAY.";
    document.querySelector("#modalIntro").textContent = bulk
      ? "For events, offices, weddings, gifting or retail: bulk orders can ship Pan India."
      : "For personal packs, ask for the nearest offline store in Gurugram or Alwar.";
    modal.showModal();
  });
});
document.querySelector("[data-close-order]")?.addEventListener("click", () => modal.close());
modal?.addEventListener("click", event => { if (event.target === modal) modal.close(); });

document.querySelector("#copyEnquiry")?.addEventListener("click", async () => {
  const message = "Hi Partay! I’m interested in a bulk order with Pan-India shipping. Please share flavours, minimum order quantity, pricing and delivery timelines.";
  const status = document.querySelector("#copyStatus");
  try {
    await navigator.clipboard.writeText(message);
    status.textContent = "Copied! Paste it into a DM to @partaymix.";
  } catch {
    status.textContent = message;
  }
});
