
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

        tombol.textContent = document.body.classList.contains("dark-mode")
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
        return ["id", "jumlah-like", "batas-like", "like-diproses"];
    }

    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    min-width: 0;
                    height: 100%;
                }

                article {
                    height: 100%;
                    padding: 18px;
                    border: 1px solid var(--kartu-garis, #ccc);
                    border-radius: var(--kartu-radius, 10px);
                    background: var(--kartu-latar, white);
                    color: var(--kartu-teks, #222);
                    overflow-wrap: anywhere;
                    transition: transform 0.2s ease;
                }

                article:hover {
                    transform: translateY(-3px);
                }

                h3 {
                    margin-top: 0;
                }

                p {
                    text-align: left;
                }

                .tombol-artikel {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                button {
                    padding: 8px 13px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }

                button:hover {
                    opacity: 0.85;
                }

                button:disabled {
                    cursor: not-allowed;
                    opacity: 0.55;
                }

                .btn-like {
                    background: #1f7a4d;
                    color: white;
                }

                .btn-hapus {
                    background: #c0392b;
                    color: white;
                }
            </style>

            <article>
                <slot name="judul"></slot>
                <slot></slot>

                <div class="tombol-artikel">
                    <button type="button" class="btn-like" part="like">
                        Like (0)
                    </button>

                    <button type="button" class="btn-hapus">
                        Hapus
                    </button>
                </div>
            </article>
        `;

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector(".btn-like").addEventListener("click", () => {
            const jumlahLike = Number(this.getAttribute("jumlah-like")) || 0;

            this.dispatchEvent(new CustomEvent("suka", {
                bubbles: true,
                composed: true,
                detail: {
                    id: Number(this.getAttribute("id")),
                    jumlahSebelumnya: jumlahLike
                }
            }));
        });

        this.shadowRoot.querySelector(".btn-hapus").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("hapus-artikel", {
                bubbles: true,
                composed: true,
                detail: {
                    id: Number(this.getAttribute("id"))
                }
            }));
        });

        this.perbaruiLike();
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.perbaruiLike();
        }
    }

    perbaruiLike() {
        const tombolLike = this.shadowRoot.querySelector(".btn-like");

        if (!tombolLike) return;

        const jumlahLike = Number(this.getAttribute("jumlah-like")) || 0;
        const batasAtribut = this.getAttribute("batas-like");

        const batasLike = batasAtribut === null
            ? Infinity
            : Number(batasAtribut);

        const sedangDiproses = this.getAttribute("like-diproses") === "true";

        tombolLike.textContent = sedangDiproses
            ? "Memproses..."
            : `Like (${jumlahLike})`;

        tombolLike.disabled = sedangDiproses || jumlahLike >= batasLike;
    }
}

customElements.define("kartu-artikel", KartuArtikel);

class KartuKomentar extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement("template");

        template.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .isi-komentar {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 10px;
                    padding: 14px;
                    border: 1px solid var(--kartu-garis, #ccc);
                    border-radius: var(--kartu-radius, 8px);
                    overflow-wrap: anywhere;
                    color: var(--kartu-teks, #222);
                }

                .nama-komentar {
                    width: 100%;
                    font-weight: bold;
                }

                .pesan-komentar {
                    flex: 1;
                    min-width: 150px;
                }

                button {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    color: white;
                }

                .btn-edit {
                    background: #33a52b;
                }

                .btn-hapus {
                    background: #c0392b;
                }

                button:hover {
                    opacity: 0.85;
                }
            </style>

            <div class="isi-komentar">
                <span class="nama-komentar">
                    <slot name="nama"></slot>
                </span>

                <span class="pesan-komentar">
                    <slot name="pesan"></slot>
                </span>

                <button type="button" class="btn-edit">Edit</button>
                <button type="button" class="btn-hapus">Hapus</button>
            </div>
        `;

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector(".btn-edit").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("edit-komentar", {
                bubbles: true,
                composed: true,
                detail: {
                    id: this.getAttribute("id"),
                    sumber: this.getAttribute("sumber"),
                    nama: this.getAttribute("nama"),
                    pesan: this.getAttribute("pesan")
                }
            }));
        });

        this.shadowRoot.querySelector(".btn-hapus").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("hapus-komentar", {
                bubbles: true,
                composed: true,
                detail: {
                    id: this.getAttribute("id"),
                    sumber: this.getAttribute("sumber")
                }
            }));
        });
    }
}

customElements.define("kartu-komentar", KartuKomentar);



