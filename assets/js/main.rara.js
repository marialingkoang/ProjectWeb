document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     CONFIG
  ============================================================ */
  const STORAGE_KEY = "filkom_event_registrants";

  /* ============================================================
     PREVIEW FOTO
  ============================================================ */
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");
  const pvImg = document.getElementById("pvImg");

  if (photoInput) {
    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          photoPreview.innerHTML = `<img src="${reader.result}" class="img-fluid rounded preview-img">`;
          pvImg.src = reader.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /* ============================================================
     PREVIEW TEKS (Nama, Event, Catatan)
  ============================================================ */
  const nameInput = document.getElementById("name");
  const eventInput = document.getElementById("event");
  const noteInput = document.getElementById("note");

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      document.getElementById("pvName").textContent = nameInput.value || "Nama";
    });
  }

  if (eventInput) {
    eventInput.addEventListener("change", () => {
      document.getElementById("pvEvent").textContent = eventInput.value || "Event";
    });
  }

  if (noteInput) {
    noteInput.addEventListener("input", () => {
      document.getElementById("pvNote").textContent = noteInput.value || "Catatan";
    });
  }

  /* ============================================================
     RESET FORM
  ============================================================ */
  const resetBtn = document.getElementById("resetBtn");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.getElementById("regForm").reset();
      photoPreview.innerHTML =
        `<img src="https://source.unsplash.com/400x300/?student,portrait" class="img-fluid rounded preview-img">`;
      pvImg.src = "https://source.unsplash.com/200x200/?student";
      document.getElementById("pvName").textContent = "Nama";
      document.getElementById("pvEvent").textContent = "Event";
      document.getElementById("pvNote").textContent = "Catatan";
    });
  }

  /* ============================================================
     SIMPAN DATA PENDAFTARAN
  ============================================================ */
  const form = document.getElementById("regForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        return;
      }

      const data = {
        name: nameInput.value,
        nim: document.getElementById("nim").value,
        faculty: document.getElementById("faculty").value,
        major: document.getElementById("major").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        baju: document.getElementById("baju").value,
        makanan: document.getElementById("makanan").value,
        note: noteInput.value,
        photo: pvImg.src,
        ts: Date.now()
      };

      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      list.push(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

      document.getElementById("submitSummary").innerHTML = `
        <b>Nama:</b> ${data.name}<br>
        <b>NIM:</b> ${data.nim}<br>
        <b>Email:</b> ${data.email}<br>
        <b>Baju:</b> ${data.baju}<br>
        <b>Pakaian</b ${data.pakaian}<br>
      `;

      const modal = new bootstrap.Modal(document.getElementById("submitModal"));
      modal.show();

      form.reset();
    });
  }

  /* ============================================================
     HALAMAN PESERTA
  ============================================================ */
  const tableBody = document.querySelector("#participantsTable tbody");

  if (tableBody) {
    loadParticipants();

    /* ============================================================
   FITUR: REFRESH DATA
============================================================ */
const refreshBtn = document.getElementById("refreshBtn");
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    loadParticipants();
  });
}

/* ============================================================
   FITUR: SEARCH FILTER
============================================================ */
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#participantsTable tbody tr");

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(keyword) ? "" : "none";
    });
  });
}

/* ============================================================
   FITUR: EXPORT CSV
============================================================ */
const exportBtn = document.getElementById("exportBtn");

if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (data.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    let csv = "Nama,NIM,Fakultas,Prodi,Event,Email,Telepon,Waktu\n";

    data.forEach(item => {
      csv += `${item.name},${item.nim},${item.faculty},${item.major},${item.event},${item.email},${item.phone},${new Date(item.ts).toLocaleString()}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data_peserta_filkom.csv";
    a.click();
  });
}

/* ============================================================
   FITUR: HAPUS SEMUA DATA
============================================================ */
const clearBtn = document.getElementById("clearBtn");

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (!confirm("Yakin ingin menghapus semua peserta?")) return;

    localStorage.removeItem(STORAGE_KEY);
    loadParticipants();
  });
}

  }

  function loadParticipants() {
    tableBody.innerHTML = "";

    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    data.forEach((item, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.nim}</td>
        <td>${item.faculty}</td>
        <td>${item.major}</td>
        <td>${item.baju}</td>
        <td>${item.makanan}</td>
        <td>${new Date(item.ts).toLocaleString()}</td>
      `;

      tableBody.appendChild(tr);
    });
  }

  /* ============================================================
     UPDATE STAT PESERTA DI BERANDA
  ============================================================ */
  const statCount = document.getElementById("statCount");
  if (statCount) {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    statCount.textContent = data.length;
  }

});
// === LOAD 3 FOTO DARI GALERY KE INDEX ===
document.addEventListener("DOMContentLoaded", () => {

  const galleryPreview = document.getElementById("galleryGrid");
  if (!galleryPreview) return; // hanya berjalan di index.rara.html

  // LOKASI FOTO YANG ADA DI galery.html
  const galleryImages = [
    "foto/foto2.jpg",
    "foto/foto4.jpg",
    "foto/foto3.jpg"
  ];

  galleryImages.forEach(src => {
    const col = document.createElement("div");
    col.className = "col-4";

    col.innerHTML = `
      <img src="${src}" class="img-fluid rounded shadow-sm hover-rise" style="height:170px; object-fit:cover; width:100%">
    `;

    galleryPreview.appendChild(col);
  });

});
