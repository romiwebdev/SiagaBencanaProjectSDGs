# 🌍 SiagaBencanaBojonegoro

**SiagaBencanaBojonegoro** adalah aplikasi web berbasis **Next.js** dan **Tailwind CSS** yang dirancang untuk mendukung _Sustainable Development Goals (SDGs)_, khususnya dalam hal **monitoring dan kesiapsiagaan bencana** di Kabupaten Bojonegoro, Jawa Timur.

> Aplikasi ini menampilkan Web GIS interaktif, laporan bencana dari masyarakat, dan dashboard statistik untuk membantu tanggap darurat berbasis data.

---

## 🚀 Tech Stack

- **Next.js** (Pages Router, tanpa folder `src/`)
- **Tailwind CSS** (via CDN injection)
- **Leaflet.js** + **OpenStreetMap** (untuk peta interaktif)
- **Supabase** (untuk autentikasi Google & manajemen user)
- **Google Cloud Console** (OAuth2.0)
- **CSV lokal** (sebagai dummy data)

---

## 📦 Fitur Utama

### ✅ Beranda (`/`)
- Peta interaktif dengan **Leaflet.js**
- Marker tiap **kecamatan di Bojonegoro**
- Warna marker sesuai tingkat dampak (semakin merah = semakin parah)
- Popup info: jumlah desa terdampak **banjir, gempa, longsor**

### ✅ Laporkan Bencana (`/laporkan`)
- Form laporan bencana (pilih kecamatan, jenis bencana, deskripsi, upload foto)
- Waktu tercatat otomatis
- Daftar laporan dummy dengan status: `Menunggu`, `Terkonfirmasi`, `Hoax`

### ✅ Dashboard Admin (`/admin`)
- Statistik laporan dummy (total laporan, status)
- Tabel manajemen laporan (edit, ubah status, hapus)

---

## 🔐 Akses Admin
Akses halaman `/admin` dibatasi hanya untuk email yang ditentukan di `.env`:

```env
NEXT_PUBLIC_ADMIN_EMAIL=youremail@example.com
````

---

## 🔧 Struktur Proyek

```
/pages
  /index.js
  /laporkan.js
  /admin.js
  /auth/callback.js
  /api
    /...
/components
/data
/public
```

---

## ⚙️ Instalasi Lokal

```bash
git clone https://github.com/romiwebdev/SiagaBencanaProjectSDGs.git
cd SiagaBencanaProjectSDGs
npm install
npm run dev
```

Tambahkan file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_ADMIN_EMAIL=rominmuh230@gmail.com
NEXT_PUBLIC_SUPABASE_REDIRECT=http://localhost:3000/auth/callback
```

---

## 🌐 Deployment

1. **Push ke GitHub**
2. **Hubungkan ke [Vercel](https://vercel.com/)**
3. **Isi environment variables di Vercel sesuai `.env.local`**

---

## 🗺️ SEO & Sitemap

* Favicon lengkap (semua ukuran) tersedia di `/public`
* Sitemap dan robots.txt dihasilkan otomatis
* Meta tag SEO friendly ada di semua halaman utama

---

## ✅ SDGs Goals Yang Didukung

* **Goal 11: Sustainable Cities and Communities**
* **Goal 13: Climate Action**

---

## 📌 Fokus Wilayah

**Kabupaten Bojonegoro, Jawa Timur – Indonesia**

---

## 📄 Lisensi

MIT License © 2025 - romiwebdev

---

## 📣 Kontribusi

Pull Request terbuka! Silakan fork repo ini dan ajukan PR jika ingin membantu mengembangkan fitur lebih lanjut.

```

