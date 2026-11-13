
const tombolInfo = document.querySelector("#btn-info");
const tombolReset = document.querySelector("#btn-reset");
const tombolAtas = document.querySelector("#btn-atas");

const infoTambahan = document.querySelector("#info-tambahan");

const formPortofolio = document.querySelector("#form-portofolio");
const inputKegiatan = document.querySelector("#input-kegiatan");
const inputJabatan = document.querySelector("#input-jabatan");
const inputTahun = document.querySelector("#input-tahun");
const daftarPortofolioElement = document.querySelector("#daftar-portofolio");

const containerArtikel = document.querySelector("#container-artikel");
const loadingArtikel = document.querySelector("#loading-artikel");
const pesanArtikel = document.querySelector("#pesan-artikel");

const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const daftarKomentarElement = document.querySelector("#daftar-komentar");
const loadingKomentar = document.querySelector("#loading-komentar");
const pesanKomentar = document.querySelector("#pesan-komentar");

const kunciPortofolio = "profil_portofolio";
const kunciKomentar = "profil_komentar";
const kunciKomentarDihapus = "profil_komentar_dihapus";
const kunciKomentarEdit = "profil_komentar_edit";
const kunciLike = "profil_like";
const kunciInfo = "profil_info";
const kunciArtikelDihapus = "profil_artikel_dihapus";

function ambilData(kunci, dataAwal) {
    try {
        const data = localStorage.getItem(kunci);

        if (data !== null) {
            const hasil = JSON.parse(data);

            if (Array.isArray(dataAwal)) {
                return Array.isArray(hasil) ? hasil : dataAwal;
            }

            if (
                typeof dataAwal === "object" &&
                dataAwal !== null
            ) {
                return typeof hasil === "object" &&
                    hasil !== null &&
                    !Array.isArray(hasil)
                    ? hasil
                    : dataAwal;
            }

            return hasil;
        }
    } catch (error) {
        console.error("Gagal membaca data:", error);
    }

    return dataAwal;
}

function simpanData(kunci, data) {
    try {
        localStorage.setItem(kunci, JSON.stringify(data));
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
    }
}

function pesanDariStatus(status) {
    if (status === 404) return "Data tidak ditemukan.";
    if (status === 400) return "Data yang dikirim tidak valid.";
    if (status >= 500) return "Server sedang bermasalah.";

    return "Terjadi kesalahan.";
}

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

let daftarPortofolio = ambilData(kunciPortofolio, dataPortofolioAwal);
let daftarLike = ambilData(kunciLike, {});
let artikelDihapus = ambilData(kunciArtikelDihapus, []);
let daftarArtikel = [];

let komentarAPI = [];
let komentarLokal = ambilData(kunciKomentar, []);
let komentarDihapus = ambilData(kunciKomentarDihapus, []);
let komentarEdit = ambilData(kunciKomentarEdit, {});

if (localStorage.getItem(kunciInfo) === "terbuka") {
    infoTambahan.classList.remove("tersembunyi");
}

tombolInfo.addEventListener("click", () => {
    infoTambahan.classList.toggle("tersembunyi");

    const statusInfo = infoTambahan.classList.contains("tersembunyi")
        ? "tertutup"
        : "terbuka";

    localStorage.setItem(kunciInfo, statusInfo);
});

function tampilkanPortofolio() {
    daftarPortofolioElement.replaceChildren();

    daftarPortofolio.forEach((data, index) => {
        const baris = document.createElement("tr");

        const kolomNo = document.createElement("td");
        const kolomKegiatan = document.createElement("td");
        const kolomJabatan = document.createElement("td");
        const kolomTahun = document.createElement("td");
        const kolomAksi = document.createElement("td");

        const tombolHapus = document.createElement("button");

        kolomNo.textContent = index + 1;
        kolomKegiatan.textContent = data.kegiatan;
        kolomJabatan.textContent = data.jabatan;
        kolomTahun.textContent = data.tahun;

        tombolHapus.type = "button";
        tombolHapus.textContent = "Hapus";
        tombolHapus.className = "btn-hapus-portofolio";
        tombolHapus.dataset.index = index;

        kolomAksi.appendChild(tombolHapus);

        baris.append(
            kolomNo,
            kolomKegiatan,
            kolomJabatan,
            kolomTahun,
            kolomAksi
        );

        daftarPortofolioElement.appendChild(baris);
    });
}

formPortofolio.addEventListener("submit", (event) => {
    event.preventDefault();

    const kegiatan = inputKegiatan.value.trim();
    const jabatan = inputJabatan.value.trim();
    const tahun = inputTahun.value.trim();

    if (!kegiatan || !jabatan || !tahun) {
        alert("Semua data harus diisi.");
        return;
    }

    daftarPortofolio.push({ kegiatan, jabatan, tahun });

    simpanData(kunciPortofolio, daftarPortofolio);

    tampilkanPortofolio();
    formPortofolio.reset();
});

daftarPortofolioElement.addEventListener("click", (event) => {
    if (!event.target.classList.contains("btn-hapus-portofolio")) {
        return;
    }

    const index = Number(event.target.dataset.index);

    daftarPortofolio.splice(index, 1);

    simpanData(kunciPortofolio, daftarPortofolio);
    tampilkanPortofolio();
});

function tampilkanArtikel() {
    containerArtikel.replaceChildren();

    daftarArtikel.forEach((artikel) => {
        const kartu = document.createElement("kartu-artikel");

        kartu.setAttribute("id", artikel.id);
        kartu.setAttribute("judul", artikel.judul);
        kartu.setAttribute("isi", artikel.isi);
        kartu.setAttribute("jumlah-like", daftarLike[artikel.id] || 0);
        kartu.setAttribute("batas-like", 10);

        containerArtikel.appendChild(kartu);
    });
}

async function muatArtikelDariAPI() {
    loadingArtikel.hidden = false;
    pesanArtikel.textContent = "";

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );

        if (!response.ok) {
            throw new Error(pesanDariStatus(response.status));
        }

        const data = await response.json();

        daftarArtikel = data
            .filter((artikel) => !artikelDihapus.includes(artikel.id))
            .map((artikel) => ({
                id: artikel.id,
                judul: artikel.title,
                isi: artikel.body
            }));

        tampilkanArtikel();
    } catch (error) {
        pesanArtikel.textContent = "Gagal memuat artikel.";
        console.error("Kesalahan artikel:", error);
    } finally {
        loadingArtikel.hidden = true;
    }
}

async function perbaruiLikeKeServer(id, jumlahLike) {
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ likes: jumlahLike })
        }
    );

    if (!response.ok) {
        throw new Error(pesanDariStatus(response.status));
    }

    return response.json();
}

containerArtikel.addEventListener("like-artikel", async (event) => {
    const { id, jumlahSebelumnya } = event.detail;

    const kartu = [...containerArtikel.querySelectorAll("kartu-artikel")]
        .find((item) => Number(item.getAttribute("id")) === id);

    if (!kartu) return;

    const tombolLike = kartu.querySelector(".btn-like");
    const jumlahBaru = jumlahSebelumnya + 1;

    tombolLike.disabled = true;
    tombolLike.textContent = "Memproses...";

    try {
        await perbaruiLikeKeServer(id, jumlahBaru);

        daftarLike[id] = jumlahBaru;
        simpanData(kunciLike, daftarLike);

        kartu.setAttribute("jumlah-like", jumlahBaru);
    } catch (error) {
        tombolLike.textContent = `Like (${jumlahSebelumnya})`;
        tombolLike.disabled = false;

        alert(error.message);
        console.error("Gagal memperbarui Like:", error);
    }
});

containerArtikel.addEventListener("hapus-artikel", (event) => {
    const id = event.detail.id;

    artikelDihapus.push(id);
    artikelDihapus = [...new Set(artikelDihapus)];

    simpanData(kunciArtikelDihapus, artikelDihapus);

    daftarArtikel = daftarArtikel.filter(
        (artikel) => artikel.id !== id
    );

    tampilkanArtikel();
});

containerArtikel.addEventListener("mouseover", (event) => {
    const kartu = event.target.closest("kartu-artikel");

    if (kartu) {
        kartu.querySelector("article")?.classList.add("artikel-hover");
    }
});

containerArtikel.addEventListener("mouseout", (event) => {
    const kartu = event.target.closest("kartu-artikel");

    if (kartu && !kartu.contains(event.relatedTarget)) {
        kartu.querySelector("article")?.classList.remove("artikel-hover");
    }
});

function buatKartuKomentar(data, sumber) {
    const kartu = document.createElement("kartu-komentar");

    kartu.setAttribute("nama", data.nama);
    kartu.setAttribute("pesan", data.pesan);
    kartu.setAttribute("id", data.id);
    kartu.setAttribute("sumber", sumber);

    return kartu;
}

function tampilkanKomentar() {
    daftarKomentarElement.replaceChildren();

    const komentarAPITampil = komentarAPI
        .filter((komentar) => !komentarDihapus.includes(String(komentar.id)))
        .map((komentar) => ({
            ...komentar,
            ...(komentarEdit[String(komentar.id)] || {})
        }));

    komentarAPITampil.forEach((komentar) => {
        daftarKomentarElement.appendChild(
            buatKartuKomentar(komentar, "api")
        );
    });

    komentarLokal.forEach((komentar) => {
        daftarKomentarElement.appendChild(
            buatKartuKomentar(komentar, "lokal")
        );
    });
}

async function muatKomentarDariAPI() {
    loadingKomentar.hidden = false;
    pesanKomentar.textContent = "";

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts/1/comments"
        );

        if (!response.ok) {
            throw new Error(pesanDariStatus(response.status));
        }

        const data = await response.json();

        komentarAPI = data.map((komentar) => ({
            id: komentar.id,
            nama: komentar.name,
            pesan: komentar.body
        }));

        tampilkanKomentar();
    } catch (error) {
        pesanKomentar.textContent = "Gagal memuat komentar dari API.";
        console.error("Kesalahan komentar:", error);
    } finally {
        loadingKomentar.hidden = true;
    }
}

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

    return response.json();
}

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

formKomentar.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nama = inputNama.value.trim();
    const pesan = inputPesan.value.trim();

    if (nama.length < 3 || pesan.length < 5) {
        alert("Nama minimal 3 karakter dan pesan minimal 5 karakter.");
        return;
    }

    const tombolKirim = formKomentar.querySelector("button");

    tombolKirim.disabled = true;
    tombolKirim.textContent = "Mengirim...";

    try {
        const hasil = await kirimKomentarKeServer(nama, pesan);

        komentarLokal.push({
            id: `lokal-${hasil.id}-${Date.now()}`,
            nama,
            pesan
        });

        simpanData(kunciKomentar, komentarLokal);
        tampilkanKomentar();

        formKomentar.reset();
        pesanKomentar.textContent = "Komentar berhasil dikirim.";
    } catch (error) {
        pesanKomentar.textContent = "Komentar gagal dikirim.";
        console.error("Kesalahan mengirim komentar:", error);
    } finally {
        tombolKirim.disabled = false;
        tombolKirim.textContent = "Kirim Komentar";
    }
});

daftarKomentarElement.addEventListener("edit-komentar", (event) => {
    const { id, sumber, nama, pesan } = event.detail;

    const namaBaru = prompt("Masukkan nama baru:", nama);

    if (namaBaru === null) return;

    const pesanBaru = prompt("Masukkan pesan baru:", pesan);

    if (pesanBaru === null) return;

    if (namaBaru.trim().length < 3 || pesanBaru.trim().length < 5) {
        alert("Nama minimal 3 karakter dan pesan minimal 5 karakter.");
        return;
    }

    if (sumber === "api") {
        komentarEdit[String(id)] = {
            nama: namaBaru.trim(),
            pesan: pesanBaru.trim()
        };

        simpanData(kunciKomentarEdit, komentarEdit);
    } else {
        const index = komentarLokal.findIndex(
            (komentar) => String(komentar.id) === String(id)
        );

        if (index === -1) return;

        komentarLokal[index].nama = namaBaru.trim();
        komentarLokal[index].pesan = pesanBaru.trim();

        simpanData(kunciKomentar, komentarLokal);
    }

    tampilkanKomentar();
});

daftarKomentarElement.addEventListener("hapus-komentar", async (event) => {
    const { id, sumber } = event.detail;

    if (sumber === "api") {
        try {
            await hapusKomentarDariServer(id);

            komentarDihapus.push(String(id));
            komentarDihapus = [...new Set(komentarDihapus)];

            simpanData(kunciKomentarDihapus, komentarDihapus);

            delete komentarEdit[String(id)];
            simpanData(kunciKomentarEdit, komentarEdit);

            komentarAPI = komentarAPI.filter(
                (komentar) => String(komentar.id) !== String(id)
            );

            tampilkanKomentar();
            pesanKomentar.textContent = "Komentar berhasil dihapus.";
        } catch (error) {
            alert(error.message);
            console.error("Gagal menghapus komentar:", error);
        }
    } else {
        komentarLokal = komentarLokal.filter(
            (komentar) => String(komentar.id) !== String(id)
        );

        simpanData(kunciKomentar, komentarLokal);
        tampilkanKomentar();
    }
});

async function muatProfilPenulis() {
    const namaPenulis = document.querySelector("#nama-penulis");
    const emailPenulis = document.querySelector("#email-penulis");

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users/1"
        );

        if (!response.ok) {
            throw new Error(pesanDariStatus(response.status));
        }

        const data = await response.json();

        namaPenulis.textContent = data.name;
        emailPenulis.textContent = data.email;
    } catch (error) {
        namaPenulis.textContent = "Gagal memuat data.";
        emailPenulis.textContent = "Gagal memuat data.";

        console.error("Kesalahan profil penulis:", error);
    }
}

tombolReset.addEventListener("click", () => {
    const konfirmasi = confirm(
        "Yakin ingin mereset semua data ke kondisi awal?"
    );

    if (!konfirmasi) return;

    localStorage.removeItem(kunciPortofolio);
    localStorage.removeItem(kunciKomentar);
    localStorage.removeItem(kunciKomentarDihapus);
    localStorage.removeItem(kunciKomentarEdit);
    localStorage.removeItem(kunciLike);
    localStorage.removeItem(kunciInfo);
    localStorage.removeItem(kunciArtikelDihapus);
    localStorage.removeItem("profil_tema");

    location.reload();
});

window.addEventListener("scroll", () => {
    tombolAtas.classList.toggle("tampil", window.scrollY > 200);
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
