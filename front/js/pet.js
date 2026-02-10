const params = new URLSearchParams(window.location.search);
const petId = params.get("id");

const authToken = localStorage.getItem("petadopt_token");
const userStr = localStorage.getItem("petadopt_user");
const currentUser = userStr ? JSON.parse(userStr) : null;
const isAdmin = currentUser?.role === "admin";

const statusEl = document.getElementById("pet-status");

const elName = document.getElementById("pet-name");
const elPhoto = document.getElementById("pet-photo");

const elType = document.getElementById("pet-type");
const elGender = document.getElementById("pet-gender");
const elAge = document.getElementById("pet-age");
const elLocation = document.getElementById("pet-location");
const elDesc = document.getElementById("pet-desc");

const actionEl = document.getElementById("pet-action");

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

    if (!actionEl) {
      console.warn("pet-action element not found in HTML");
    } else if (isAdmin) {
     actionEl.innerHTML = `
  <div class="admin-actions">
    <button id="editBtn" class="admin-btn edit-btn">
      <i class="fa-solid fa-pen"></i>
      <span>Edit</span>
    </button>

    <button id="deleteBtn" class="admin-btn delete-btn">
      <i class="fa-solid fa-trash"></i>
      <span>Delete</span>
    </button>
  </div>
`;

      document.getElementById("editBtn").onclick = async () => {
        await showEditModal(p);
      };

      document.getElementById("deleteBtn").onclick = async () => {
        if (!confirm(`Are you sure you want to delete ${p.name}?`)) return;
        try {
          const res = await fetch(`/api/pets/${petId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });

          if (!res.ok) {
            const data = await res.json();
            alert(data.message || "Delete failed");
            return;
          }

          alert("Pet deleted successfully");
          window.location.href = "/";
        } catch (err) {
          console.error(err);
          alert("Delete error");
        }
      };
    } else if (!p.isAvailable) {
      actionEl.innerHTML =
        `<p class="adopted-text">This pet has already found a home 🏠</p>`;
    } else if (!authToken) {
      actionEl.innerHTML =
        `<p>Please login to adopt this pet</p>`;
    } else {
      actionEl.innerHTML =
        `<button id="adoptBtn" class="adopt-btn">Adopt this pet</button>`;

      document.getElementById("adoptBtn").onclick = async () => {
        try {
          const res = await fetch(`/api/pets/${petId}/adopt`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.message || "Adoption failed");
            return;
          }

          loadPet();
        } catch (err) {
          console.error(err);
          alert("Adoption error");
        }
      };
    }

    statusEl.textContent = "";
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Failed to load pet.";
  }
}

async function showEditModal(pet) {
  const name = prompt("Enter pet name:", pet.name);
  if (name === null) return;

  const age = prompt("Enter pet age (years):", pet.age);
  if (age === null) return;

  const description = prompt("Enter pet description:", pet.description || "");
  if (description === null) return;

  const location = prompt("Enter pet location:", pet.location);
  if (location === null) return;

  try {
    const res = await fetch(`/api/pets/${petId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name,
        age: parseInt(age) || pet.age,
        description,
        location
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    alert("Pet updated successfully");
    loadPet();
  } catch (err) {
    console.error(err);
    alert("Update error");
  }
}

loadPet();
