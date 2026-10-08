/* Portes à mot de passe. Les réponses ne sont jamais écrites en clair : seulement leur empreinte SHA-256. */
(function () {
  var SALT = "0317-kestrel";
  function norm(s) {
    return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }
  async function sha(s) {
    var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return Array.prototype.map.call(new Uint8Array(b), function (x) { return x.toString(16).padStart(2, "0"); }).join("");
  }
  window.Gate = { norm: norm, sha: sha };
  document.querySelectorAll("form[data-gate]").forEach(function (f) {
    f.addEventListener("submit", async function (e) {
      e.preventDefault();
      var out = f.querySelector(".msg");
      var h = await sha(SALT + norm(f.querySelector("input").value));
      if (!window.GATES || !window.GATES[f.dataset.gate]) {
        out.textContent = "Portail hors ligne (maintenance). Reviens plus tard.";
      } else if (h === window.GATES[f.dataset.gate]) {
        out.textContent = f.dataset.ok || "Accès accordé...";
        setTimeout(function () { location.href = f.dataset.next; }, 900);
      } else {
        out.textContent = f.dataset.ko || "Refusé.";
      }
    });
  });
})();
