# E-Tourism Sumenep - Admin Dashboard

Aplikasi E-Tourism Sumenep adalah platform manajemen digital untuk mendata dan mengelola koleksi Keraton dan Museum Sumenep. Aplikasi ini dilengkapi dengan dashboard admin untuk manajemen data koleksi, manajemen pengguna (admin/pengunjung), dan pembuatan QR Code otomatis untuk setiap koleksi.

## Fitur Utama

-   **Manajemen Koleksi**: Tambah, edit, dan hapus data koleksi museum/keraton.
-   **QR Code Generator**: Otomatis membuat QR Code unik (hashed string) untuk setiap koleksi yang ditambahkan.
-   **Manajemen Pengguna**: Kelola akses admin dan pengguna aplikasi.
-   **Dashboard Statistik**: Ringkasan jumlah koleksi, pengguna, dan QR code aktif.
-   **Keamanan**: Autentikasi menggunakan secure session/cookies dengan password hashing (bcrypt).

## Teknologi yang Digunakan

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Database**: SQLite
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Language**: TypeScript

## Prasyarat

Pastikan Anda telah menginstal:

-   [Node.js](https://nodejs.org/) (Versi 20 atau lebih baru)
-   npm (Node Package Manager)

## Panduan Instalasi dan Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokal Anda.

### 1. Instalasi Dependencies

Clone repository ini (jika ada) atau buka terminal di folder project, lalu jalankan:

```bash
npm install
```

### 2. Konfigurasi Lingkungan (Environment Variables)

Buat file `.env` di root folder project. Anda bisa mencontek konfigurasi berikut:

```env
# URL Database SQLite
DATABASE_URL="file:./dev.db"

# Secret untuk Generate JWT (Ganti dengan string acak yang aman)
JWT_SECRET="rahasia_super_aman_sumenep_tourism"
```

### 3. Inisialisasi Database

Jalankan perintah prisma untuk membuat file database SQLite dan menerapkan skema:

```bash
# Push skema ke database (cara paling cepat untuk development)
npx prisma migrate dev
```

setelah itu buat prisma client

```bash
npx prisma generate
```

### 4. Seeding Database (Data Awal)

Untuk membuat user admin pertama kali, jalankan seed script yang telah disediakan:

```bash
npx tsx prisma/seed.ts
```

Script ini akan membuat user admin dengan kredensial:
-   **Email**: `admin@sumenep.go.id`
-   **Password**: `admin123`

### 5. Menjalankan Aplikasi

Jalankan server development:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

-   Halaman utama akan mengarahkan Anda ke halaman Login.
-   Masuk menggunakan kredensial admin yang telah dibuat saat seeding.
-   Akses dashboard admin di `/admin`.

## Struktur Project

-   `app/admin`: Halaman-halaman dashboard admin.
-   `app/api`: Endpoint REST API untuk data dan autentikasi.
-   `app/lib`: Utilitas, termasuk inisialisasi Prisma Client.
-   `components/ui`: Komponen UI reusable (Button, Input, dll).
-   `prisma/schema.prisma`: Definisi skema database.

## Catatan Tambahan

-   Jika Anda mengubah skema database (`prisma/schema.prisma`), jangan lupa untuk menjalankan `npx prisma migrate dev` dan `npx prisma generate` kembali.
-   Untuk melihat data database secara visual, Anda bisa menggunakan **Prisma Studio**:
    ```bash
    npx prisma studio
    ```
