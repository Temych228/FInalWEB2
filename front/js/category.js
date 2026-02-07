function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAge(age) {
  if (age === null || age === undefined) return "Age: -";
  return `Age: ${age} yr${Number(age) === 1 ? "" : "s"}`;
}

function renderGallery(pets) {
  const petGrid = document.getElementById("pet-grid");
  petGrid.innerHTML = "";

  if (!pets.length) {
    petGrid.innerHTML = `<div style="opacity:.9;">No pets found.</div>`;
    return;
  }

  petGrid.innerHTML = pets
    .map((p) => {
      const name = esc(p.name);
      const ageText = esc(formatAge(p.age));
      const photo = esc(p.photoUrl || "");

      return `
        <div class="pet-card" data-id="${p._id}">
          <img src="${photo}" alt="${name}">
          <div class="pet-overlay">
            <div class="pet-name">${name}</div>
            <div class="pet-age">${ageText}</div>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".pet-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      window.location.href = `pet.html?id=${encodeURIComponent(id)}`;
    });
  });
}

async function loadCategory(type) {
  const statusEl = document.getElementById("status");

  try {
    statusEl.textContent = "Loading pets from database...";
    const res = await fetch("/api/pets");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const allPets = await res.json();
    const filtered = allPets.filter((p) => p.type === type);

    statusEl.textContent = `Found ${filtered.length} ${type}(s). Hover to see name & age.`;
    renderGallery(filtered);
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Failed to load pets. Check server + /api/pets.";
  }
}
