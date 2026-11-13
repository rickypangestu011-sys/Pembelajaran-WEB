
class SalamPengguna extends HTMLElement {
    connectedCallback() {
        const nama = this.getAttribute("nama") || "Tamu";
        this.textContent = `Halo, ${nama}! Selamat datang di website profil saya.`;
    }
}

customElements.define("salam-pengguna", SalamPengguna);


class TombolTema extends HTMLElement {
    connectedCallback() {
        if (this.querySelector("button")) return;

        const tombol = document.createElement("button");
        tombol.id = "btn-tema";
        tombol.type = "button";

        const temaTersimpan = localStorage.getItem("profil_tema");

        document.body.classList.toggle("dark-mode", temaTersimpan === "true");

        tombol.addEventListener("click", () => {
            this.ubahTema();
        });

        this.appendChild(tombol);
        this.perbaruiTeks();
    }

    ubahTema() {
        document.body.classList.toggle("dark-mode");

        const temaAktif = document.body.classList.contains("dark-mode");

        localStorage.setItem("profil_tema", temaAktif);

        this.perbaruiTeks();
    }

    perbaruiTeks() {
        const tombol = this.querySelector("button");

        if (!tombol) return;

        tombol.textContent =
            document.body.classList.contains("dark-mode")
                ? "Mode Terang"
                : "Mode Gelap";
    }
}

customElements.define("tombol-tema", TombolTema);


document.addEventListener("keydown", (event) => {
    if (
        event.key.toLowerCase() === "d" &&
        !["INPUT", "TEXTAREA"].includes(event.target.tagName) &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
    ) {
        document.querySelector("tombol-tema")?.ubahTema();
    }
});


class KartuArtikel extends HTMLElement {
    static get observedAttributes() {
        return ["id", "judul", "isi", "jumlah-like", "batas-like"];
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        console.log("kartu-artikel dilepas");
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.render();
        }
    }

    render() {
        const artikel = document.createElement("article");

        const judul = document.createElement("h3");
        judul.textContent = this.getAttribute("judul") || "";

        const isi = document.createElement("p");
        isi.textContent = this.getAttribute("isi") || "";

        const jumlahLike = Number(this.getAttribute("jumlah-like")) || 0;
        const batasAtribut = this.getAttribute("batas-like");

        const batasLike = batasAtribut === null
            ? Infinity
            : Number(batasAtribut);

        const tombolContainer = document.createElement("div");
        tombolContainer.className = "tombol-artikel";

        const tombolLike = document.createElement("button");
        tombolLike.type = "button";
        tombolLike.className = "btn-like";
        tombolLike.textContent = `Like (${jumlahLike})`;
        tombolLike.disabled = jumlahLike >= batasLike;

        tombolLike.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("like-artikel", {
                bubbles: true,
                detail: {
                    id: Number(this.getAttribute("id")),
                    jumlahSebelumnya: jumlahLike
                }
            }));
        });

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.className = "btn-hapus-artikel";
        tombolHapus.textContent = "Hapus";

        tombolHapus.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("hapus-artikel", {
                bubbles: true,
                detail: {
                    id: Number(this.getAttribute("id"))
                }
            }));
        });

        tombolContainer.append(tombolLike, tombolHapus);
        artikel.append(judul, isi, tombolContainer);

        this.replaceChildren(artikel);
    }
}

customElements.define("kartu-artikel", KartuArtikel);


class KartuKomentar extends HTMLElement {
    static get observedAttributes() {
        return ["nama", "pesan", "id", "sumber"];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.render();
        }
    }

    render() {
        const wadah = document.createElement("div");
        wadah.className = "isi-komentar";

        const nama = document.createElement("span");
        nama.className = "nama-komentar";
        nama.textContent = this.getAttribute("nama") || "";

        const pesan = document.createElement("span");
        pesan.className = "pesan-komentar";
        pesan.textContent = this.getAttribute("pesan") || "";

        const tombolEdit = document.createElement("button");
        tombolEdit.type = "button";
        tombolEdit.className = "btn-edit-komentar";
        tombolEdit.textContent = "Edit";

        tombolEdit.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("edit-komentar", {
                bubbles: true,
                detail: {
                    id: this.getAttribute("id"),
                    sumber: this.getAttribute("sumber"),
                    nama: this.getAttribute("nama"),
                    pesan: this.getAttribute("pesan")
                }
            }));
        });

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.className = "btn-hapus-komentar";
        tombolHapus.textContent = "Hapus";

        tombolHapus.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("hapus-komentar", {
                bubbles: true,
                detail: {
                    id: this.getAttribute("id"),
                    sumber: this.getAttribute("sumber")
                }
            }));
        });

        wadah.append(nama, pesan, tombolEdit, tombolHapus);

        this.replaceChildren(wadah);
    }
}

customElements.define("kartu-komentar", KartuKomentar);
