const btn = document.getElementById("toggle");
const label = document.getElementById("label");
const hint = document.getElementById("hint");
const mode = document.getElementById("mode");
const siteRow = document.getElementById("siteRow");
const site = document.getElementById("site");
const siteNote = document.getElementById("siteNote");

// the popup speaks the language of the browser
document.documentElement.lang = sffLang();
document.getElementById("title").textContent = sffT("title");
// one choice instead of two boxes: what happens to items that are not natural (or cannot be read)
//   hide   = hide plastic items and unreadable ones (default)   plastic = hide plastic items only   labels = hide nothing, only add labels
[["hide", "modeHide"], ["plastic", "modePlastic"], ["labels", "modeLabels"]].forEach(([v, k]) => {
  const o = document.createElement("option");
  o.value = v; o.textContent = sffT(k);
  mode.appendChild(o);
});

let isOn = false;
function show(on) {
  isOn = on;
  label.textContent = on ? sffT("on") : sffT("off");
  btn.className = on ? "on" : "";
  hint.textContent = !on ? sffT("hintOff") : mode.value === "hide" ? sffT("hintOn") : mode.value === "labels" ? sffT("hintLabels") : "";
}

chrome.storage.local.get(["enabled", "hideUnverified", "labelOnly"], (d) => {
  mode.value = d.labelOnly === true ? "labels" : d.hideUnverified === false ? "plastic" : "hide";
  show(!!d.enabled);
});
mode.addEventListener("change", () => {
  // "labels" keeps the old "hide unreadable" choice untouched; the other two set it
  if (mode.value === "labels") chrome.storage.local.set({ labelOnly: true });
  else chrome.storage.local.set({ labelOnly: false, hideUnverified: mode.value === "hide" });
  show(isOn);
});

btn.addEventListener("click", () => {
  chrome.storage.local.get("enabled", (d) => {
    const next = !d.enabled;
    chrome.storage.local.set({ enabled: next }, () => show(next));
  });
});

// "Use on this website": shown only on a shopping list. It is ticked when the extension works on this
// page, and the user can switch a website off, or switch it on when we took it for a non-clothing page.
let status = null;
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs && tabs[0];
  if (!tab || tab.id == null) return;
  chrome.tabs.sendMessage(tab.id, { type: "sff-status" }, (res) => {
    if (chrome.runtime.lastError || !res) return;        // a page where the extension does not run
    status = res;
    if (!["clothing", "other", "off"].includes(status.kind)) return;   // not a shopping list: nothing to switch
    siteRow.style.display = "flex";
    document.getElementById("siteLabel").textContent = " " + sffT("siteUse", { host: status.host });
    site.checked = status.kind === "clothing" || (status.kind === "other" && status.forced);
    siteNote.textContent = status.kind === "other" && !status.forced ? sffT("siteOther") : "";
  });
});

site.addEventListener("change", () => {
  chrome.storage.local.get(["offHosts", "forceHosts"], (d) => {
    const off = d.offHosts || {}, force = d.forceHosts || {};
    if (site.checked) {
      delete off[status.host];
      if (status.kind === "other") force[status.host] = true;      // we took it for non-clothing, the user says it is not
    } else {
      off[status.host] = true;
      delete force[status.host];
    }
    chrome.storage.local.set({ offHosts: off, forceHosts: force });
    siteNote.textContent = "";
  });
});

// "Something wrong?": hands over counts and shapes of the current page (no page text, no query part of the address)
const reportBtn = document.getElementById("report");
const reportNote = document.getElementById("reportNote");
reportBtn.textContent = sffT("report");
reportBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || tab.id == null) { reportNote.textContent = sffT("reportNone"); return; }
    chrome.tabs.sendMessage(tab.id, { type: "sff-report" }, (res) => {
      if (chrome.runtime.lastError || !res) { reportNote.textContent = sffT("reportNone"); return; }
      navigator.clipboard.writeText(JSON.stringify(res)).then(
        () => { reportNote.textContent = sffT("reportCopied"); },
        () => { reportNote.textContent = JSON.stringify(res); });          // no clipboard: show the text so it can be copied by hand
    });
  });
});
