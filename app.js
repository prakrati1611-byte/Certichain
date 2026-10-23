const certificates = [
  {
    id: "CCH-2025-04821",
    status: "verified",
    recipient: "Maya Chen",
    credential: "Bachelor of Science · Computer Science",
    issuer: "Northstar Institute",
    issued: "May 18, 2025",
    block: "18,429,073",
    transaction: "0x8f2a71c94d30b6e1...7c41e9",
  },
  {
    id: "CCH-2024-01307",
    status: "revoked",
    recipient: "Jordan Lee",
    credential: "Professional Certificate · Data Analytics",
    issuer: "Westbridge Learning",
    issued: "November 2, 2024",
    block: "16,208,411",
    transaction: "0x4c19d2a86e5f0b13...92a7c0",
  },
  {
    id: "CCH-2025-06712",
    status: "not-verified",
    recipient: "Amara Okafor",
    credential: "Diploma · Sustainable Design",
    issuer: "Meridian College",
    issued: "June 4, 2025",
    block: "18,511,602",
    transaction: "0xa72e81b3d96f4c20...18b6d2",
  },
  {
    id: "CCH-2025-09136",
    status: "verified",
    recipient: "Ethan Park",
    credential: "Master of Engineering · Robotics",
    issuer: "Northstar Institute",
    issued: "August 12, 2025",
    block: "18,739,184",
    transaction: "0x19c4a8d6e2f07135...b0e783",
  },
  {
    id: "CCH-2024-02854",
    status: "verified",
    recipient: "Sofia Alvarez",
    credential: "Certificate · Project Management",
    issuer: "Brightpath Academy",
    issued: "December 15, 2024",
    block: "16,941,032",
    transaction: "0x6bd2f47a91c83e05...7a1b9c",
  },
  {
    id: "CCH-2025-10423",
    status: "revoked",
    recipient: "Noah Williams",
    credential: "Certificate · Cloud Architecture",
    issuer: "Westbridge Learning",
    issued: "September 9, 2025",
    block: "18,812,590",
    transaction: "0x38ef1a60c7d942b5...c2514a",
  },
  {
    id: "CCH-2025-11208",
    status: "verified",
    recipient: "Priya Raman",
    credential: "Bachelor of Arts · Economics",
    issuer: "Meridian College",
    issued: "October 2, 2025",
    block: "18,940,775",
    transaction: "0x9a53e182bc74d601...48f026",
  },
  {
    id: "CCH-2024-03619",
    status: "not-verified",
    recipient: "Lucas Moreau",
    credential: "Diploma · Culinary Arts",
    issuer: "Cedar House Institute",
    issued: "January 20, 2025",
    block: "17,103,922",
    transaction: "0xd4617a20f9b38c5e...a21f09",
  },
  {
    id: "CCH-2025-12044",
    status: "verified",
    recipient: "Aisha Patel",
    credential: "Certificate · UX Research",
    issuer: "Brightpath Academy",
    issued: "November 14, 2025",
    block: "19,026,381",
    transaction: "0x57bc3180a4d92f61...eb7034",
  },
  {
    id: "CCH-2025-12690",
    status: "verified",
    recipient: "Oliver Kim",
    credential: "Master of Science · Applied Mathematics",
    issuer: "Cedar House Institute",
    issued: "December 8, 2025",
    block: "19,091,467",
    transaction: "0xe62a9f30b17d4c85...1f36ac",
  },
];

const certificatesById = new Map(certificates.map((certificate) => [certificate.id, certificate]));
const statusLabels = {
  verified: "Verified",
  revoked: "Revoked",
  "not-verified": "Not verified",
};

const form = document.querySelector("#verify-form");
const input = document.querySelector("#certificate-id");
const verifyButton = document.querySelector("#verify-button");
const clearButton = document.querySelector("#clear-input");
const sampleButton = document.querySelector("#sample-button");
const errorMessage = document.querySelector("#form-error");
const emptyResult = document.querySelector("#empty-result");
const result = document.querySelector("#verification-result");
const fileInput = document.querySelector("#certificate-file");
const uploadZone = document.querySelector("#upload-zone");
const fileResult = document.querySelector("#file-result");
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function formatCount(value) {
  return new Intl.NumberFormat().format(value);
}

function renderCertificateRows(searchTerm = "") {
  const rows = document.querySelector("#certificate-rows");
  const tableEmpty = document.querySelector("#table-empty");
  if (!rows || !tableEmpty) return;

  const query = searchTerm.trim().toLowerCase();
  const matchingRecords = certificates.filter((certificate) => (
    [certificate.id, certificate.recipient, certificate.credential, certificate.issuer, statusLabels[certificate.status]]
      .some((value) => value.toLowerCase().includes(query))
  ));

  rows.innerHTML = matchingRecords.map((certificate) => `
    <tr>
      <td><strong>${escapeHtml(certificate.id)}</strong></td>
      <td>${escapeHtml(certificate.recipient)}</td>
      <td>${escapeHtml(certificate.credential)}</td>
      <td>${escapeHtml(certificate.issuer)}</td>
      <td>${escapeHtml(certificate.issued)}</td>
      <td><span class="status-pill ${certificate.status}"><span class="status-dot"></span>${statusLabels[certificate.status]}</span></td>
      <td><a class="table-action" href="#verify" data-lookup="${escapeHtml(certificate.id)}">Verify ↗</a></td>
    </tr>`).join("");

  tableEmpty.textContent = "No certificates match your search.";
  tableEmpty.hidden = matchingRecords.length > 0;
  document.querySelector("#table-count").textContent = `${formatCount(matchingRecords.length)} of ${formatCount(certificates.length)} records`;
}

function renderDashboardInsights() {
  const counts = Object.fromEntries(Object.keys(statusLabels).map((status) => [
    status,
    certificates.filter((certificate) => certificate.status === status).length,
  ]));
  const verifiedRate = Math.round((counts.verified / certificates.length) * 100);

  document.querySelector("#certificate-total").textContent = formatCount(certificates.length);
  document.querySelector("#certificate-verified").textContent = formatCount(counts.verified);
  document.querySelector("#certificate-revoked").textContent = formatCount(counts.revoked);
  document.querySelector("#certificate-unverified").textContent = formatCount(counts["not-verified"]);
  document.querySelector("#insight-total").textContent = formatCount(certificates.length);
  document.querySelector("#insight-issuers").textContent = formatCount(new Set(certificates.map((item) => item.issuer)).size);
  document.querySelector("#insight-verified-rate").textContent = `${verifiedRate}%`;

  const issuerCounts = new Map();
  for (const certificate of certificates) {
    issuerCounts.set(certificate.issuer, (issuerCounts.get(certificate.issuer) ?? 0) + 1);
  }
  const topIssuers = [...issuerCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  const maximum = Math.max(...topIssuers.map(([, count]) => count));
  document.querySelector("#issuer-chart-bars").innerHTML = topIssuers.map(([issuer, count]) => `
    <div style="--bar:${Math.round((count / maximum) * 100)}%" title="${escapeHtml(issuer)}: ${count} certificates">
      <i></i><span>${escapeHtml(issuer.split(" ")[0])}</span>
    </div>`).join("");
  document.querySelector("#issuer-chart-axis").innerHTML = [maximum, Math.round(maximum * .66), Math.round(maximum * .33), 0]
    .map((value) => `<span>${value}</span>`).join("");

  document.querySelector("#field-coverage").innerHTML = Object.entries(statusLabels).map(([status, label]) => {
    const percent = Math.round((counts[status] / certificates.length) * 100);
    return `<div class="coverage-item"><div><span>${label}</span><strong>${counts[status]}</strong></div><span class="coverage-track ${status}"><i style="width:${percent}%"></i></span></div>`;
  }).join("");

  document.querySelector("#sample-records").innerHTML = certificates.slice(0, 3).map((certificate) => `
    <div>
      <span class="activity-symbol ${certificate.status}">${certificate.status === "verified" ? "✓" : certificate.status === "revoked" ? "!" : "…"}</span>
      <span><strong>${statusLabels[certificate.status]} · ${escapeHtml(certificate.recipient)}</strong><small>${escapeHtml(certificate.id)} · ${escapeHtml(certificate.issuer)}</small></span>
      <a class="text-link" href="#verify" data-lookup="${escapeHtml(certificate.id)}">View ↗</a>
    </div>`).join("");
}

function setActiveView() {
  const [requestedView] = window.location.hash.slice(1).split("?");
  const viewName = requestedView === "how-it-works" ? "about" : requestedView;
  const availableViews = [...document.querySelectorAll("[data-view]")];
  const activeView = availableViews.some((view) => view.dataset.view === viewName) ? viewName : "verify";
  const activeNav = activeView === "result" ? "verify" : activeView;

  availableViews.forEach((view) => {
    view.hidden = view.dataset.view !== activeView;
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active = link.dataset.nav === activeNav;
    link.classList.toggle("nav-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  const titles = {
    verify: "Certificate verification",
    result: "Verification result",
    certificates: "Certificates",
    insights: "Insights",
    about: "About CertiChain",
  };
  document.title = `CertiChain — ${titles[activeView]}`;
  if (activeView === "result") {
    const query = window.location.hash.split("?")[1] ?? "";
    const id = new URLSearchParams(query).get("id");
    if (id !== null) renderResult(id);
    else {
      emptyResult.hidden = false;
      result.hidden = true;
    }
  }
}

function renderResult(id) {
  const certificate = certificatesById.get(id);
  emptyResult.hidden = true;
  result.hidden = false;

  if (!certificate) {
    result.innerHTML = `
      <span class="status-pill not-found"><span class="status-dot"></span> No matching record</span>
      <h2 class="credential-name">Certificate not found</h2>
      <p class="credential-degree">We couldn't find a record for ${escapeHtml(id)}.</p>
      <p class="result-notice">Check the certificate ID or choose a record from the Certificates dashboard.</p>`;
    return;
  }

  const status = certificate.status;
  const notice = {
    verified: "This certificate matches a verified record in the mock registry.",
    revoked: "This certificate is marked revoked in the mock registry. Do not treat it as valid.",
    "not-verified": "A record exists, but it has not been verified in the mock registry.",
  }[status];

  result.innerHTML = `
    <span class="status-pill ${status}"><span class="status-dot"></span> ${statusLabels[status]}</span>
    <h2 class="credential-name">${escapeHtml(certificate.recipient)}</h2>
    <p class="credential-degree">${escapeHtml(certificate.credential)}</p>
    <div class="result-details">
      <div class="detail-row"><span>Certificate ID</span><span>${escapeHtml(certificate.id)}</span></div>
      <div class="detail-row"><span>Issued by</span><span>${escapeHtml(certificate.issuer)}</span></div>
      <div class="detail-row"><span>Issue date</span><span>${escapeHtml(certificate.issued)}</span></div>
      <div class="detail-row"><span>Record block</span><span>${escapeHtml(certificate.block)}</span></div>
      <div class="detail-row transaction-row"><span>Transaction</span><span class="transaction-value">${escapeHtml(certificate.transaction)} <button class="copy-transaction" type="button" aria-label="Copy transaction ID" data-transaction="${escapeHtml(certificate.transaction)}">Copy</button></span></div>
    </div>
    <p class="result-notice">${notice} These records are illustrative and are not checked against a live blockchain.</p>`;
}

window.addEventListener("hashchange", setActiveView);
setActiveView();
renderCertificateRows();
renderDashboardInsights();
document.querySelector("#certificate-search").addEventListener("input", (event) => {
  renderCertificateRows(event.currentTarget.value);
});

function handleLookupLink(event) {
  const link = event.target.closest("[data-lookup]");
  if (!link) return;
  event.preventDefault();
  input.value = link.dataset.lookup;
  clearButton.hidden = false;
  window.location.hash = `result?id=${encodeURIComponent(link.dataset.lookup)}`;
}

document.querySelector("#certificate-rows").addEventListener("click", handleLookupLink);
document.querySelector("#sample-records").addEventListener("click", handleLookupLink);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = input.value.trim().toUpperCase();
  errorMessage.hidden = true;

  if (!id) {
    errorMessage.textContent = "Enter a certificate ID to continue.";
    errorMessage.hidden = false;
    input.focus();
    return;
  }

  verifyButton.disabled = true;
  verifyButton.querySelector("span").textContent = "Checking record…";
  window.setTimeout(() => {
    verifyButton.disabled = false;
    verifyButton.querySelector("span").textContent = "Verify certificate";
    window.location.hash = `result?id=${encodeURIComponent(id)}`;
  }, 250);
});

input.addEventListener("input", () => {
  clearButton.hidden = input.value.length === 0;
  if (!errorMessage.hidden) errorMessage.hidden = true;
});

clearButton.addEventListener("click", () => {
  input.value = "";
  clearButton.hidden = true;
  errorMessage.hidden = true;
  input.focus();
});

sampleButton.addEventListener("click", () => {
  input.value = "CCH-2025-04821";
  clearButton.hidden = false;
  form.requestSubmit();
});

result.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-transaction");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.transaction);
    showToast("Transaction ID copied");
  } catch (error) {
    showToast("Clipboard unavailable in this browser");
  }
});

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fingerprintFile(file) {
  if (!window.crypto?.subtle) {
    throw new Error("Secure file hashing is unavailable. Open this page over HTTPS or localhost.");
  }
  const digest = await window.crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function handleFile(file) {
  if (!file) return;
  const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
  const allowedExtensions = /\.(pdf|png|jpe?g|webp)$/i;
  if (!allowedTypes.includes(file.type) && !allowedExtensions.test(file.name)) {
    fileResult.textContent = "Choose a PDF, PNG, JPG, or WebP certificate file.";
    fileResult.hidden = false;
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    fileResult.textContent = "This file is larger than the 15 MB limit.";
    fileResult.hidden = false;
    return;
  }

  fileResult.textContent = "Computing a SHA-256 fingerprint locally…";
  fileResult.hidden = false;
  try {
    const fingerprint = await fingerprintFile(file);
    fileResult.innerHTML = `<strong>${escapeHtml(file.name)}</strong> · ${formatBytes(file.size)}<br>SHA-256: ${fingerprint}<br><span>This fingerprint was computed on your device. This demo does not compare uploaded files with a live blockchain.</span>`;
  } catch (error) {
    fileResult.textContent = error.message;
  }
}

fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));
uploadZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadZone.classList.add("dragging");
});
uploadZone.addEventListener("dragleave", () => uploadZone.classList.remove("dragging"));
uploadZone.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadZone.classList.remove("dragging");
  handleFile(event.dataTransfer.files[0]);
});
