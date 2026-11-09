
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

let komentarSedangDiedit = null;

// Modul 8: menangani pesan berdasarkan status code
function pesanDariStatus(status) {
    if (status === 404) {
        return "Data tidak ditemukan di server.";
    }

    if (status === 400) {
        return "Data yang dikirim tidak valid.";
    }

    if (status >= 500) {
        return "Server sedang bermasalah, coba lagi nanti.";
    }

    return "Terjadi kesalahan tidak terduga.";
}

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
            throw new Error(pesanDariStatus(response.status));
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

// Modul 8: memperbarui jumlah like menggunakan PATCH
async function perbaruiLikeKeServer(postId, jumlahLike) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${postId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    likes: jumlahLike
                })
            }
        );

        if (!response.ok) {
            throw new Error(pesanDariStatus(response.status));
        }

        console.log("Like berhasil diperbarui di server");

        return true;

    } catch (error) {
        console.error("Gagal memperbarui like:", error);

        return false;
    }
}

containerArtikel.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-like")) {
        const tombol = event.target;
        const index = Number(tombol.dataset.index);
        const idArtikel = daftarArtikel[index].id;

        const jumlahLike = (daftarLike[idArtikel] || 0) + 1;

        tombol.disabled = true;

        const berhasil = await perbaruiLikeKeServer(
            idArtikel,
            jumlahLike
        );

        if (berhasil) {
            daftarLike[idArtikel] = jumlahLike;

            simpanData(kunciLike, daftarLike);

            tampilkanArtikel();
        } else {
            tombol.disabled = false;
            alert("Gagal memperbarui jumlah like.");
        }
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

// Modul 8: menampilkan komentar API dan komentar lokal
function tampilkanKomentar() {
    daftarKomentar.innerHTML = "";

    komentarAPI.forEach((data) => {
        const itemKomentar = document.createElement("li");
        itemKomentar.dataset.id = data.id;

        const teksKomentar = document.createElement("span");
        teksKomentar.textContent = `${data.nama}: ${data.pesan}`;

        const tombolEditKomentar = document.createElement("button");
        tombolEditKomentar.textContent = "Edit";
        tombolEditKomentar.classList.add("btn-edit-komentar");
        tombolEditKomentar.dataset.id = data.id;
        tombolEditKomentar.dataset.source = "api";

        const tombolHapusKomentar = document.createElement("button");
        tombolHapusKomentar.textContent = "Hapus";
        tombolHapusKomentar.classList.add("btn-hapus-komentar");
        tombolHapusKomentar.dataset.id = data.id;
        tombolHapusKomentar.dataset.source = "api";

        itemKomentar.appendChild(teksKomentar);
        itemKomentar.appendChild(tombolEditKomentar);
        itemKomentar.appendChild(tombolHapusKomentar);

        daftarKomentar.appendChild(itemKomentar);
    });

    komentarLokal.forEach((data, index) => {
        const itemKomentar = document.createElement("li");

        const teksKomentar = document.createElement("span");
        teksKomentar.textContent = `${data.nama}: ${data.pesan}`;

        const tombolEditKomentar = document.createElement("button");
        tombolEditKomentar.textContent = "Edit";
        tombolEditKomentar.classList.add("btn-edit-komentar");
        tombolEditKomentar.dataset.index = index;
        tombolEditKomentar.dataset.source = "lokal";

        const tombolHapusKomentar = document.createElement("button");
        tombolHapusKomentar.textContent = "Hapus";
        tombolHapusKomentar.classList.add("btn-hapus-komentar");
        tombolHapusKomentar.dataset.index = index;
        tombolHapusKomentar.dataset.source = "lokal";

        itemKomentar.appendChild(teksKomentar);
        itemKomentar.appendChild(tombolEditKomentar);
        itemKomentar.appendChild(tombolHapusKomentar);

        daftarKomentar.appendChild(itemKomentar);
    });
}

// Modul 8: mengambil komentar dari API menggunakan GET
async function muatKomentarDariAPI() {
    loadingKomentar.style.display = "flex";

    try {
        const response = await
            fetch("https://jsonplaceholder.typicode.com/posts/1/comments");

        if (!response.ok) {
            throw new Error(pesanDariStatus(response.status));
        }

        const daftarKomentarAPI = await response.json();

        komentarAPI = daftarKomentarAPI.map((komentar) => {
            return {
                id: komentar.id,
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

// Modul 8: mengirim komentar baru menggunakan POST
async function kirimKomentarKeServer(nama, pesan) {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/comments",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nama,
                body: pesan,
                postId: 1
            })
        }
    );

    if (!response.ok) {
        throw new Error(pesanDariStatus(response.status));
    }

    return await response.json();
}

// Modul 8: memperbarui komentar menggunakan PATCH
async function perbaruiKomentarKeServer(id, nama, pesan) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nama,
                body: pesan
            })
        }
    );

    if (!response.ok) {
        throw new Error(pesanDariStatus(response.status));
    }

    return await response.json();
}

// Modul 8: menghapus komentar menggunakan DELETE
async function hapusKomentarDariServer(id) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error(pesanDariStatus(response.status));
    }

    return true;
}

// Modul 8: event delegation untuk Edit dan Hapus komentar
daftarKomentar.addEventListener("click", async (event) => {

    // Mengedit komentar
    if (event.target.classList.contains("btn-edit-komentar")) {

        const source = event.target.dataset.source;

        if (source === "api") {
            const id = Number(event.target.dataset.id);

            const data = komentarAPI.find(
                (komentar) => komentar.id === id
            );

            inputNama.value = data.nama;
            inputPesan.value = data.pesan;

            komentarSedangDiedit = {
                source: "api",
                id: id
            };

        } else {
            const index = Number(event.target.dataset.index);

            const data = komentarLokal[index];

            inputNama.value = data.nama;
            inputPesan.value = data.pesan;

            komentarSedangDiedit = {
                source: "lokal",
                index: index
            };
        }

        inputNama.focus();
    }

    // Menghapus komentar
    if (event.target.classList.contains("btn-hapus-komentar")) {

        const tombol = event.target;
        const source = tombol.dataset.source;

        if (source === "api") {

            const id = Number(tombol.dataset.id);

            tombol.disabled = true;
            tombol.textContent = "Menghapus...";

            try {
                await hapusKomentarDariServer(id);

                komentarAPI = komentarAPI.filter(
                    (komentar) => komentar.id !== id
                );

                tampilkanKomentar();

            } catch (error) {
                tombol.disabled = false;
                tombol.textContent = "Hapus";

                alert(error.message);

                console.error("Gagal menghapus komentar:", error);
            }

        } else {

            const index = Number(tombol.dataset.index);

            komentarLokal.splice(index, 1);

            simpanData(kunciKomentar, komentarLokal);

            tampilkanKomentar();
        }
    }
});

// Draft komentar menggunakan sessionStorage
inputNama.value = sessionStorage.getItem("draftNama") || "";
inputPesan.value = sessionStorage.getItem("draftPesan") || "";

inputNama.addEventListener("input", () => {
    sessionStorage.setItem("draftNama", inputNama.value);
});

inputPesan.addEventListener("input", () => {
    sessionStorage.setItem("draftPesan", inputPesan.value);
});

// Modul 8: mengirim dan memperbarui komentar
formKomentar.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    if (nama.length < 3 || pesan.length < 5) {
        alert("Nama minimal 3 karakter dan komentar minimal 5 karakter.");
        return;
    }

    const tombolKirim = formKomentar.querySelector(
        'button[type="submit"]'
    );

    tombolKirim.disabled = true;

    try {

        if (komentarSedangDiedit !== null) {

            tombolKirim.textContent = "Memperbarui...";

            if (komentarSedangDiedit.source === "api") {

                const id = komentarSedangDiedit.id;

                const hasil = await perbaruiKomentarKeServer(
                    id,
                    nama,
                    pesan
                );

                const index = komentarAPI.findIndex(
                    (komentar) => komentar.id === id
                );

                komentarAPI[index] = {
                    id: hasil.id,
                    nama: hasil.name,
                    pesan: hasil.body.replace(/\s+/g, " ")
                };

            } else {

                const index = komentarSedangDiedit.index;

                komentarLokal[index] = {
                    nama: nama,
                    pesan: pesan
                };

                simpanData(kunciKomentar, komentarLokal);
            }

            alert("Komentar berhasil diperbarui!");

            komentarSedangDiedit = null;

        } else {

            tombolKirim.textContent = "Mengirim...";

            const hasil = await kirimKomentarKeServer(
                nama,
                pesan
            );

            komentarAPI.push({
                id: hasil.id,
                nama: hasil.name,
                pesan: hasil.body.replace(/\s+/g, " ")
            });

            console.log("Komentar tersimpan di server, id:", hasil.id);
        }

        tampilkanKomentar();

        sessionStorage.removeItem("draftNama");
        sessionStorage.removeItem("draftPesan");

        formKomentar.reset();

    } catch (error) {

        alert(error.message);

        console.error("Gagal memproses komentar:", error);

    } finally {

        tombolKirim.disabled = false;
        tombolKirim.textContent = "Kirim";
    }
});

// Modul 8: mengambil data pengguna dari API
async function muatProfilPenulis() {
    try {
        const response = await
            fetch("https://jsonplaceholder.typicode.com/users/1");

        if (!response.ok) {
            throw new Error(pesanDariStatus(response.status));
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
const tombolAtas = document.querySelector("#btn-atas");

window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        tombolAtas.classList.add("tampil");
    } else {
        tombolAtas.classList.remove("tampil");
    }
});

tombolAtas.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

tampilkanPortofolio();
muatArtikelDariAPI();
muatKomentarDariAPI();
muatProfilPenulis();
