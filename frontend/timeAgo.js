// ===============================
// FORMAT "Posté il y a X"
// ===============================

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (isNaN(seconds)) return "";

  const intervals = [
    { label: "an", seconds: 31536000 },
    { label: "mois", seconds: 2592000 },
    { label: "jour", seconds: 86400 },
    { label: "heure", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "seconde", seconds: 1 },
  ];

  for (let interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      if (interval.label === "mois") {
        return `Posté il y a ${count} mois`;
      }
      return `Posté il y a ${count} ${interval.label}${count > 1 ? "s" : ""}`;
    }
  }

  return "Posté à l'instant";
}

// ===============================
// Mise à jour automatique
// ===============================

function updateTimeAgoElements() {
  document.querySelectorAll("[data-date]").forEach((element) => {
    const date = element.dataset.date;
    element.textContent = timeAgo(date);
  });
}

// Mise à jour toutes les 60 secondes
setInterval(updateTimeAgoElements, 60000);

// Met à jour immédiatement au chargement
document.addEventListener("DOMContentLoaded", updateTimeAgoElements);
