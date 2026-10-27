
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

const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const daftarKomentar = document.querySelector("#daftar-komentar");

const kunciPortofolio = "profil_portofolio";
const kunciArtikel = "profil_artikel";
const kunciKomentar = "profil_komentar";
const kunciLike = "profil_like";
const kunciTema = "profil_tema";
const kunciInfo = "profil_info";

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

const dataArtikelAwal = [
    {
        judul: "Belajar Pemrograman Web",
        isi: "Pemrograman web merupakan proses membuat dan mengembangkan website menggunakan HTML, CSS, dan JavaScript."
    },
    {
        judul: "Pentingnya JavaScript",
        isi: "JavaScript digunakan untuk membuat halaman web menjadi lebih interaktif dan dinamis."
    },
    {
        judul: "Belajar DOM",
        isi: "DOM memungkinkan JavaScript mengakses dan mengubah elemen HTML secara langsung."
    }
];

let daftarPortofolio = ambilData(
    kunciPortofolio,
    dataPortofolioAwal
);

let daftarArtikel = ambilData(
    kunciArtikel,
    dataArtikelAwal
);

let daftarKomentarData = ambilData(kunciKomentar, []);

let daftarLike = ambilData(
    kunciLike,
    dataArtikelAwal.map(() => 0)
);

while (daftarLike.length < daftarArtikel.length) {
    daftarLike.push(0);
}

daftarLike = daftarLike.slice(0, daftarArtikel.length);

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
        tombolLike.textContent = `Like (${daftarLike[index] || 0})`;
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

containerArtikel.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-like")) {
        const index = Number(event.target.dataset.index);

        daftarLike[index] = (daftarLike[index] || 0) + 1;

        simpanData(kunciLike, daftarLike);

        tampilkanArtikel();
    }

    if (event.target.classList.contains("btn-hapus-artikel")) {
        const index = Number(event.target.dataset.index);

        daftarArtikel.splice(index, 1);
        daftarLike.splice(index, 1);

        simpanData(kunciArtikel, daftarArtikel);
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

    daftarKomentarData.forEach((data, index) => {
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

daftarKomentar.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-hapus-komentar")) {
        const index = Number(event.target.dataset.index);

        daftarKomentarData.splice(index, 1);

        simpanData(kunciKomentar, daftarKomentarData);

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

    if (nama === "" || pesan === "") {
        alert("Nama dan komentar wajib diisi!");
        return;
    }

    daftarKomentarData.push({
        nama: nama,
        pesan: pesan
    });

    simpanData(kunciKomentar, daftarKomentarData);

    tampilkanKomentar();

    sessionStorage.removeItem("draftNama");
    sessionStorage.removeItem("draftPesan");

    formKomentar.reset();
});

if (tombolReset) {
    tombolReset.addEventListener("click", () => {
        const konfirmasi = confirm(
            "Yakin ingin mereset semua data ke kondisi awal?"
        );

        if (!konfirmasi) {
            return;
        }

        localStorage.removeItem(kunciPortofolio);
        localStorage.removeItem(kunciArtikel);
        localStorage.removeItem(kunciKomentar);
        localStorage.removeItem(kunciLike);
        localStorage.removeItem(kunciTema);
        localStorage.removeItem(kunciInfo);

        sessionStorage.removeItem("draftNama");
        sessionStorage.removeItem("draftPesan");

        location.reload();
    });
}

tampilkanPortofolio();
tampilkanArtikel();
tampilkanKomentar();
