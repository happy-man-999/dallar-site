// The only three things to edit on this site. Every Buy button, Download
// button and contact link on every page reads from here.
window.DALLAR = {
  // Polar checkout link for the $5/month product (Products → Checkout Links).
  buyUrl: "https://buy.polar.sh/REPLACE-ME",
  // The installer. Upload it to the server's downloads/ folder through the
  // hosting panel and keep this path, or point it anywhere else.
  downloadUrl: "/download/Dallar-Setup.exe",
  // Where customers write to you.
  supportEmail: "support@example.com",
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
