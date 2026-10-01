const judulSitus = document.querySelector("header h1");
const tombolTema = document.querySelector("#btn-tema");
const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("#kotak-aside");

const inputKegiatan = document.querySelector("#input-kegiatan");
const inputJabatan = document.querySelector("#input-jabatan");
const inputTahun = document.querySelector("#input-tahun");
const tombolTambah = document.querySelector("#btn-tambah");

const containerPortofolio = document.querySelector("#daftar-portofolio");

console.log(judulSitus.textContent);

tombolTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

tombolInfo.addEventListener("click", () => {
    kotakAside.classList.toggle("tersembunyi");
});

const daftarPortofolio = [
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

        aksi.appendChild(tombolHapus);

        tr.appendChild(no);
        tr.appendChild(kegiatan);
        tr.appendChild(jabatan);
        tr.appendChild(tahun);
        tr.appendChild(aksi);

        containerPortofolio.appendChild(tr);
    });
}

tombolTambah.addEventListener("click", () => {

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

    inputKegiatan.value = "";
    inputJabatan.value = "";
    inputTahun.value = "";

    tampilkanPortofolio();
});

containerPortofolio.addEventListener("click", (event) => {

    if (event.target.classList.contains("btn-hapus")) {

        const baris = event.target.closest("tr");

        baris.remove();
    }
});

tampilkanPortofolio();