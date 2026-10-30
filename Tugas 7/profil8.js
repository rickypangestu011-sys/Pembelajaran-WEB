
const judulSitus = document.querySelector("header h1");

const tombolTema = document.querySelector("#btn-tema");
const tombolInfo = document.querySelector("#btn-info");
const tombolReset = document.querySelector("#btn-reset");
const infoTambahan = document.querySelector("#info-tambahan");

const inputKegiatan = document.querySelector("#input-kegiatan");
const inputJabatan = document.querySelector("#input-jabatan");
const inputTahun = document.querySelector("#input-tahun");

const formPortofolio = document.querySelector("#form-portofolio");
const containerPortofolio = document.querySelector("#daftar-portofolio");

const containerArtikel = document.querySelector("#container-artikel");
const loadingArtikel = document.querySelector("#loading-artikel");

const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const daftarKomentar = document.querySelector("#daftar-komentar");
const loadingKomentar = document.querySelector("#loading-komentar");

const kunciPortofolio = "profil_portofolio";
const kunciKomentar = "profil_komentar";
const kunciLike = "profil_like";
const kunciTema = "profil_tema";
const kunciInfo = "profil_info";
const kunciArtikelDihapus = "profil_artikel_dihapus";

console.log(judulSitus.textContent);

function ambilData(kunci, dataAwal) {
    try {
        const dataTersimpan = localStorage.getItem(kunci);

        if (dataTersimpan !== null) {
            const hasil = JSON.parse(dataTersimpan);

            if (Array.isArray(hasil)) {
                return hasil;
            }
        }
    } catch (error) {
        console.error("Data tidak dapat dibaca:", error);
    }

    return dataAwal;
}

function simpanData(kunci, data) {
    try {
        localStorage.setItem(kunci, JSON.stringify(data));
    } catch (error) {
        console.error("Data tidak dapat disimpan:", error);
    }
}

function toggleTema() {
    document.body.classList.toggle("dark-mode");

    simpanData(
        kunciTema,
        document.body.classList.contains("dark-mode")
    );
}

if (localStorage.getItem(kunciTema) === "true") {
    document.body.classList.add("dark-mode");
}

tombolTema.addEventListener("click", toggleTema);

document.addEventListener("keydown", (event) => {
    if (
        event.key.toLowerCase() === "d" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
        toggleTema();
    }
});

if (localStorage.getItem(kunciInfo) === "terbuka") {
    infoTambahan.classList.remove("tersembunyi");
}

tombolInfo.addEventListener("click", () => {
    infoTambahan.classList.toggle("tersembunyi");

    simpanData(
        kunciInfo,
        infoTambahan.classList.contains("tersembunyi")
            ? "tertutup"
            : "terbuka"
    );
});

const dataPortofolioAwal = [
    {
        kegiatan: "Panitia Kecil Selebrasi FCH 1",
        jabatan: "Anggota",
        tahun: "2025"
    },
    {
        kegiatan: "Komunitas Paingan",
        jabatan: "Koordinator Koor",
        tahun: "2026"
    }
];

let daftarPortofolio = ambilData(
    kunciPortofolio,
    dataPortofolioAwal
);

let daftarLike = ambilData(
    kunciLike,
    []
);

let daftarArtikel = [];

let artikelDihapus = ambilData(
    kunciArtikelDihapus,
    []
);

let komentarAPI = [];

let komentarLokal = ambilData(
    kunciKomentar,
    []
);

function tampilkanPortofolio() {
    containerPortofolio.innerHTML = "";

    daftarPortofolio.forEach((data, index) => {
        const tr = document.createElement("tr");

        const no = document.createElement("td");
        no.textContent = index + 1;

        const kegiatan = document.createElement("td");
        kegiatan.textContent = data.kegiatan;

        const jabatan = document.createElement("td");
        jabatan.textContent = data.jabatan;

        const tahun = document.createElement("td");
        tahun.textContent = data.tahun;

        const aksi = document.createElement("td");

        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.classList.add("btn-hapus");
        tombolHapus.dataset.index = index;

        aksi.appendChild(tombolHapus);

        tr.appendChild(no);
        tr.appendChild(kegiatan);
        tr.appendChild(jabatan);
        tr.appendChild(tahun);
        tr.appendChild(aksi);

        containerPortofolio.appendChild(tr);
    });
}

function tampilkanArtikel() {
    containerArtikel.innerHTML = "";

    daftarArtikel.forEach((data, index) => {
        const article = document.createElement("article");

        const judul = document.createElement("h3");
        judul.textContent = data.judul;

        const isi = document.createElement("p");
        isi.textContent = data.isi;

        const tombolLike = document.createElement("button");
        tombolLike.textContent = `Like (${daftarLike[data.id] || 0})`;
        tombolLike.classList.add("btn-like");
        tombolLike.dataset.index = index;

        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.classList.add("btn-hapus-artikel");
        tombolHapus.dataset.index = index;

        const tombolContainer = document.createElement("div");
        tombolContainer.classList.add("tombol-artikel");

        tombolContainer.appendChild(tombolLike);
        tombolContainer.appendChild(tombolHapus);

        article.appendChild(judul);
        article.appendChild(isi);
        article.appendChild(tombolContainer);

        containerArtikel.appendChild(article);
    });
}

// Modul 8: mengambil artikel dari API
async function muatArtikelDariAPI() {
    loadingArtikel.style.display = "flex";

    try {
        const response = await
            fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");

        if (!response.ok) {
            throw new Error("Status: " + response.status);
        }

        const daftarPost = await response.json();

        daftarArtikel = daftarPost
            .filter((post) => !artikelDihapus.includes(post.id))
            .map((post) => {
                return {
                    id: post.id,
                    judul: post.title,
                    isi: post.body
                };
            });

        daftarArtikel.forEach((artikel) => {
            if (daftarLike[artikel.id] === undefined) {
                daftarLike[artikel.id] = 0;
            }
        });

        simpanData(kunciLike, daftarLike);

        tampilkanArtikel();

    } catch (error) {
        containerArtikel.innerHTML =
            "<p>Gagal memuat artikel, silakan coba lagi nanti.</p>";

        console.error("Gagal mengambil data artikel:", error);

    } finally {
        loadingArtikel.style.display = "none";
    }
}

containerArtikel.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-like")) {
        const index = Number(event.target.dataset.index);
        const idArtikel = daftarArtikel[index].id;

        daftarLike[idArtikel] = (daftarLike[idArtikel] || 0) + 1;

        simpanData(kunciLike, daftarLike);

        tampilkanArtikel();
    }

    if (event.target.classList.contains("btn-hapus-artikel")) {
        const index = Number(event.target.dataset.index);
        const idArtikel = daftarArtikel[index].id;

        artikelDihapus.push(idArtikel);

        artikelDihapus = [...new Set(artikelDihapus)];

        simpanData(kunciArtikelDihapus, artikelDihapus);

        daftarArtikel.splice(index, 1);

        simpanData(kunciLike, daftarLike);

        tampilkanArtikel();
    }
});

containerArtikel.addEventListener("mouseover", (event) => {
    const article = event.target.closest("article");

    if (article && containerArtikel.contains(article)) {
        article.classList.add("artikel-hover");
    }
});

containerArtikel.addEventListener("mouseout", (event) => {
    const article = event.target.closest("article");

    if (
        article &&
        containerArtikel.contains(article) &&
        !article.contains(event.relatedTarget)
    ) {
        article.classList.remove("artikel-hover");
    }
});

formPortofolio.addEventListener("submit", (event) => {
    event.preventDefault();

    const kegiatan = inputKegiatan.value.trim();
    const jabatan = inputJabatan.value.trim();
    const tahun = inputTahun.value.trim();

    if (kegiatan === "" || jabatan === "" || tahun === "") {
        alert("Semua data harus diisi!");
        return;
    }

    daftarPortofolio.push({
        kegiatan: kegiatan,
        jabatan: jabatan,
        tahun: tahun
    });

    simpanData(kunciPortofolio, daftarPortofolio);

    formPortofolio.reset();

    tampilkanPortofolio();
});

containerPortofolio.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-hapus")) {
        const index = Number(event.target.dataset.index);

        daftarPortofolio.splice(index, 1);

        simpanData(kunciPortofolio, daftarPortofolio);

        tampilkanPortofolio();
    }
});

function tampilkanKomentar() {
    daftarKomentar.innerHTML = "";

    komentarAPI.forEach((data) => {
        const itemKomentar = document.createElement("li");

        const teksKomentar = document.createElement("span");
        teksKomentar.textContent = `${data.nama}: ${data.pesan}`;

        itemKomentar.appendChild(teksKomentar);

        daftarKomentar.appendChild(itemKomentar);
    });

    komentarLokal.forEach((data, index) => {
        const itemKomentar = document.createElement("li");

        const teksKomentar = document.createElement("span");
        teksKomentar.textContent = `${data.nama}: ${data.pesan}`;

        const tombolHapusKomentar = document.createElement("button");
        tombolHapusKomentar.textContent = "Hapus";
        tombolHapusKomentar.classList.add("btn-hapus-komentar");
        tombolHapusKomentar.dataset.index = index;

        itemKomentar.appendChild(teksKomentar);
        itemKomentar.appendChild(tombolHapusKomentar);

        daftarKomentar.appendChild(itemKomentar);
    });
}

// Modul 8: mengambil komentar dari API
async function muatKomentarDariAPI() {
    loadingKomentar.style.display = "flex";

    try {
        const response = await
            fetch("https://jsonplaceholder.typicode.com/posts/1/comments");

        if (!response.ok) {
            throw new Error("Status: " + response.status);
        }

        const daftarKomentarAPI = await response.json();

        komentarAPI = daftarKomentarAPI.map((komentar) => {
            return {
                nama: komentar.name,
                pesan: komentar.body.replace(/\s+/g, " ")
            };
        });

        tampilkanKomentar();

    } catch (error) {
        daftarKomentar.innerHTML =
            "<li>Gagal memuat komentar, silakan coba lagi nanti.</li>";

        console.error("Gagal memuat komentar:", error);

    } finally {
        loadingKomentar.style.display = "none";
    }
}

daftarKomentar.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-hapus-komentar")) {
        const index = Number(event.target.dataset.index);

        komentarLokal.splice(index, 1);

        simpanData(kunciKomentar, komentarLokal);

        tampilkanKomentar();
    }
});

inputNama.value = sessionStorage.getItem("draftNama") || "";
inputPesan.value = sessionStorage.getItem("draftPesan") || "";

inputNama.addEventListener("input", () => {
    sessionStorage.setItem("draftNama", inputNama.value);
});

inputPesan.addEventListener("input", () => {
    sessionStorage.setItem("draftPesan", inputPesan.value);
});

formKomentar.addEventListener("submit", (event) => {
    event.preventDefault();

    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    if (nama.length < 3 || pesan.length < 5) {
        alert("Nama minimal 3 karakter dan komentar minimal 5 karakter.");
        return;
    }

    komentarLokal.push({
        nama: nama,
        pesan: pesan
    });

    simpanData(kunciKomentar, komentarLokal);

    tampilkanKomentar();

    sessionStorage.removeItem("draftNama");
    sessionStorage.removeItem("draftPesan");

    formKomentar.reset();
});

// Modul 8: mengambil data pengguna dari API
async function muatProfilPenulis() {
    try {
        const response = await
            fetch("https://jsonplaceholder.typicode.com/users/1");

        if (!response.ok) {
            throw new Error("Status: " + response.status);
        }

        const user = await response.json();

        document.querySelector("#nama-penulis").textContent = user.name;
        document.querySelector("#email-penulis").textContent = user.email;

    } catch (error) {
        document.querySelector("#nama-penulis").textContent =
            "Gagal memuat data penulis.";

        document.querySelector("#email-penulis").textContent = "";

        console.error("Gagal memuat profil penulis:", error);
    }
}

if (tombolReset) {
    tombolReset.addEventListener("click", () => {
        const konfirmasi = confirm(
            "Yakin ingin mereset semua data ke kondisi awal?"
        );

        if (!konfirmasi) {
            return;
        }

        localStorage.removeItem(kunciPortofolio);
        localStorage.removeItem(kunciKomentar);
        localStorage.removeItem(kunciLike);
        localStorage.removeItem(kunciTema);
        localStorage.removeItem(kunciInfo);
        localStorage.removeItem(kunciArtikelDihapus);

        sessionStorage.removeItem("draftNama");
        sessionStorage.removeItem("draftPesan");

        location.reload();
    });
}

tampilkanPortofolio();
muatArtikelDariAPI();
muatKomentarDariAPI();
muatProfilPenulis();
