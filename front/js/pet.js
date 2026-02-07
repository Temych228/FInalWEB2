const params = new URLSearchParams(window.location.search);
const petId = params.get("id");

const statusEl = document.getElementById("pet-status");

const elName = document.getElementById("pet-name");
const elPhoto = document.getElementById("pet-photo");

const elType = document.getElementById("pet-type");
const elGender = document.getElementById("pet-gender");
const elAge = document.getElementById("pet-age");
const elLocation = document.getElementById("pet-location");
const elDesc = document.getElementById("pet-desc");

async function loadPet() {
  if (!petId) {
    statusEl.textContent = "No pet id in URL.";
    return;
  }

  try {
    statusEl.textContent = "Loading pet details...";
    const res = await fetch(`/api/pets/${encodeURIComponent(petId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const p = await res.json();

    elName.textContent = p.name || "Unknown";

    elPhoto.src = p.photoUrl || "";
    elPhoto.alt = p.name || "Pet photo";

    elType.textContent = p.type || "-";
    elGender.textContent = p.gender || "-";
    elAge.textContent =
      p.age !== undefined && p.age !== null ? `${p.age} years` : "-";
    elLocation.textContent = p.location || "-";
    elDesc.textContent = p.description || "-";

    statusEl.textContent = "";
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Failed to load pet. Check API /api/pets/:id";
  }
}

loadPet();
