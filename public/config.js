// The only three things to edit on this site. Every Buy button, Download
// button and contact link on every page reads from here.
window.DALLAR = {
  // Polar checkout link for the $5/month product (Products → Checkout Links).
  buyUrl: "https://buy.polar.sh/polar_cl_SqWBg5UntKxLzIxIxevCsoFP2F530CkTL2Bz321rxDs",
  // The installer, attached to the newest GitHub release of this repo as
  // Dallar-Setup.exe. This link always points at the latest release.
  downloadUrl: "https://github.com/happy-man-999/dallar-site/releases/latest/download/Dallar-Setup.exe",
  // Where customers write to you.
  supportEmail: "emicena23@gmail.com",
};

document.addEventListener("DOMContentLoaded", () => {
  const c = window.DALLAR;
  document.querySelectorAll("[data-buy]").forEach((a) => (a.href = c.buyUrl));
  document.querySelectorAll("[data-download]").forEach((a) => (a.href = c.downloadUrl));
  document.querySelectorAll("[data-email]").forEach((a) => {
    a.href = `mailto:${c.supportEmail}`;
    if (!a.textContent.trim()) a.textContent = c.supportEmail;
  });
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});
