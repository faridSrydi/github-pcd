# Laporan Tata Cara Push dan Pull GitHub

Repositori: [faridSrydi/github-pcd](https://github.com/faridSrydi/github-pcd)

Dokumen ini menjelaskan langkah demi langkah cara menghubungkan proyek di komputer lokal dengan GitHub, mengirim perubahan (**push**), dan mengambil perubahan (**pull**), lengkap dengan penjelasan dari setiap perintah. Pada bagian akhir (bab 14) terdapat studi kasus praktik langsung: membuat website portfolio sederhana dengan HTML, CSS, dan JavaScript, lalu mengunggah dan mempublikasikannya lewat GitHub Pages.

---

## Daftar Isi

1. [Konsep Dasar](#1-konsep-dasar)
2. [Persiapan](#2-persiapan)
3. [Autentikasi ke GitHub](#3-autentikasi-ke-github)
4. [Push Pertama Kali ke Repositori Kosong](#4-push-pertama-kali-ke-repositori-kosong)
5. [Alur Kerja Harian: Add, Commit, Push](#5-alur-kerja-harian-add-commit-push)
6. [Pull dan Clone](#6-pull-dan-clone)
7. [Bekerja dengan Branch](#7-bekerja-dengan-branch)
8. [Pull Request](#8-pull-request)
9. [Menangani Konflik](#9-menangani-konflik)
10. [Perintah Pendukung](#10-perintah-pendukung)
11. [Pemecahan Masalah Umum](#11-pemecahan-masalah-umum)
12. [Ringkasan Perintah (Cheat Sheet)](#12-ringkasan-perintah-cheat-sheet)

---

## 1. Konsep Dasar

| Istilah | Penjelasan |
|---|---|
| **Git** | Aplikasi *version control* yang berjalan di komputer lokal untuk mencatat riwayat perubahan file. |
| **GitHub** | Layanan hosting repositori Git di internet, tempat menyimpan, berbagi, dan berkolaborasi. |
| **Repository (repo)** | Folder proyek beserta seluruh riwayat perubahannya. |
| **Local repository** | Repo yang ada di komputer kita. |
| **Remote** | Repo yang ada di server (GitHub). Nama standarnya adalah `origin`. |
| **Commit** | "Foto" kondisi proyek pada satu titik waktu, disertai pesan penjelasan. |
| **Branch** | Cabang pengembangan. Branch utama biasanya bernama `main`. |
| **Push** | Mengirim commit dari lokal ke GitHub. |
| **Pull** | Mengambil commit terbaru dari GitHub ke lokal, lalu menggabungkannya. |
| **Clone** | Menyalin seluruh repo dari GitHub ke komputer untuk pertama kali. |
| **Staging area** | Area transit tempat file ditandai (`git add`) sebelum di-commit. |

### Alur Kerja Git

```
 Working Directory  --git add-->  Staging Area  --git commit-->  Local Repo  --git push-->  GitHub (Remote)
 (file yang diedit)              (siap di-commit)               (riwayat lokal)                (origin)

 Working Directory  <---------------------------  git pull / git clone  <-------------------  GitHub (Remote)
```

Penjelasan: perubahan file harus melewati tiga tahap di lokal (edit, `add`, `commit`) sebelum dikirim ke GitHub dengan `push`. Sebaliknya, `pull` membawa perubahan dari GitHub ke lokal.

---

## 2. Persiapan

### 2.1 Instalasi Git

- **Windows**: unduh dari <https://git-scm.com/downloads>, lalu install dengan pengaturan bawaan. Ikut terpasang *Git Bash* dan *Git Credential Manager*.
- **macOS**: `brew install git` (atau `xcode-select --install`).
- **Linux (Debian/Ubuntu)**: `sudo apt update && sudo apt install git`

Cek instalasi:

```bash
git --version
```

Penjelasan: jika muncul nomor versi (misalnya `git version 2.x.x`), Git sudah terpasang dengan benar.

### 2.2 Konfigurasi Identitas (sekali saja)

```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email@contoh.com"
git config --global init.defaultBranch main
```

Penjelasan:

- `user.name` dan `user.email` akan tercatat di setiap commit sebagai identitas penulis. Gunakan email yang sama dengan akun GitHub agar commit terhubung ke profil.
- `init.defaultBranch main` membuat repo baru otomatis memakai branch `main` (bukan `master`).
- `--global` berarti pengaturan berlaku untuk semua repo di komputer tersebut.

Cek hasil konfigurasi:

```bash
git config --list
```

---

## 3. Autentikasi ke GitHub

GitHub **tidak lagi menerima password akun** untuk operasi Git lewat HTTPS. Pilih salah satu cara berikut.

### Opsi A: HTTPS dengan Personal Access Token (PAT)

1. Buka GitHub, lalu **Settings > Developer settings > Personal access tokens**.
2. Buat token (*fine-grained* atau *classic*) dengan izin akses **repo / Contents: Read and write**.
3. Salin token dan simpan di tempat aman (hanya tampil sekali).
4. Saat `git push` meminta kredensial:
   - **Username**: username GitHub (`faridSrydi`)
   - **Password**: tempel **token**, bukan password akun

Di Windows dan macOS, Git Credential Manager biasanya membuka jendela login browser dan menyimpan kredensial otomatis.

### Opsi B: SSH Key

```bash
ssh-keygen -t ed25519 -C "email@contoh.com"
```

Tekan Enter untuk lokasi bawaan. Lalu tampilkan kunci publik:

```bash
cat ~/.ssh/id_ed25519.pub
```

Salin hasilnya ke GitHub: **Settings > SSH and GPG keys > New SSH key**. Uji koneksi:

```bash
ssh -T git@github.com
```

Penjelasan: jika berhasil, muncul pesan *"Hi faridSrydi! You've successfully authenticated"*. Dengan SSH, gunakan URL remote berformat `git@github.com:faridSrydi/github-pcd.git`.

### Opsi C: GitHub CLI

```bash
gh auth login
```

Ikuti petunjuk interaktif. Cara ini paling mudah karena login lewat browser.

---

## 4. Push Pertama Kali ke Repositori Kosong

Repositori `github-pcd` saat ini masih **kosong**, sehingga proyek lokal bisa langsung didorong ke sana.

### Langkah 1: Masuk ke folder proyek

```bash
cd path/ke/folder-proyek
```

### Langkah 2: Inisialisasi repo lokal

```bash
git init
```

Penjelasan: membuat folder tersembunyi `.git` yang menyimpan seluruh riwayat dan konfigurasi. Langkah ini hanya dilakukan sekali per proyek. Lewati langkah ini jika folder sudah berisi `.git`.

### Langkah 3: Buat file `.gitignore` (disarankan)

Contoh isi `.gitignore` untuk proyek Python/Node:

```gitignore
# Python
__pycache__/
*.pyc
venv/
.env

# Node
node_modules/

# Sistem & editor
.DS_Store
.vscode/
.idea/
```

Penjelasan: file/folder yang tercantum akan **diabaikan** Git. Ini penting agar file sampah, dependensi berukuran besar, dan data rahasia (seperti `.env` berisi password/API key) tidak ikut terunggah.

### Langkah 4: Cek status

```bash
git status
```

Penjelasan: menampilkan file mana yang belum dilacak (*untracked*), berubah, atau sudah di-staging. Biasakan menjalankan perintah ini sebelum dan sesudah tiap langkah.

### Langkah 5: Tambahkan file ke staging

```bash
git add .
```

Penjelasan: tanda titik berarti semua file di folder saat ini. Untuk file tertentu saja: `git add namafile.py`.

### Langkah 6: Commit

```bash
git commit -m "Commit pertama: menambahkan struktur proyek"
```

Penjelasan: menyimpan snapshot dari file yang ada di staging ke riwayat lokal. Opsi `-m` berisi pesan yang menjelaskan isi perubahan.

### Langkah 7: Pastikan nama branch `main`

```bash
git branch -M main
```

Penjelasan: `-M` mengganti nama branch saat ini menjadi `main` (memaksa, jika nama sudah ada).

### Langkah 8: Hubungkan ke repo GitHub (remote)

```bash
git remote add origin https://github.com/faridSrydi/github-pcd.git
```

Penjelasan: mendaftarkan alamat repo GitHub dengan nama pendek `origin`. Cek hasilnya:

```bash
git remote -v
```

> Jika memakai SSH: `git remote add origin git@github.com:faridSrydi/github-pcd.git`

### Langkah 9: Push

```bash
git push -u origin main
```

Penjelasan:

- `origin` = tujuan (remote GitHub).
- `main` = branch yang dikirim.
- `-u` (*set upstream*) mengaitkan branch lokal `main` dengan `origin/main`. Setelah ini, cukup ketik `git push` atau `git pull` tanpa argumen tambahan.

Setelah berhasil, muat ulang halaman repo di GitHub. File proyek sudah tampil.

---

## 5. Alur Kerja Harian: Add, Commit, Push

Setelah push pertama, siklus kerja sehari-hari selalu sama:

```bash
# 1. Ambil perubahan terbaru dulu (hindari konflik)
git pull

# 2. Edit file proyek seperti biasa

# 3. Lihat apa saja yang berubah
git status
git diff

# 4. Masukkan perubahan ke staging
git add .

# 5. Simpan sebagai commit
git commit -m "Menambahkan fitur login"

# 6. Kirim ke GitHub
git push
```

Penjelasan tambahan:

- `git diff` menampilkan baris yang berubah sebelum di-staging. `git diff --staged` menampilkan yang sudah di-staging.
- Commit sebaiknya **kecil dan fokus** (satu tujuan per commit) agar riwayat mudah dibaca dan mudah dibatalkan.

### Format Pesan Commit yang Baik

```
<jenis>: <ringkasan singkat dalam bentuk perintah>
```

| Jenis | Kegunaan | Contoh |
|---|---|---|
| `feat` | Fitur baru | `feat: tambah halaman registrasi` |
| `fix` | Perbaikan bug | `fix: perbaiki validasi email` |
| `docs` | Dokumentasi | `docs: perbarui README` |
| `refactor` | Merapikan kode tanpa ubah fungsi | `refactor: pisahkan fungsi koneksi database` |
| `chore` | Tugas kecil/konfigurasi | `chore: tambah .gitignore` |

---

## 6. Pull dan Clone

### 6.1 Clone: mengunduh repo untuk pertama kali

```bash
git clone https://github.com/faridSrydi/github-pcd.git
cd github-pcd
```

Penjelasan: membuat folder `github-pcd` berisi seluruh file dan riwayat, serta otomatis mengatur remote `origin`. Cocok dipakai di komputer baru atau oleh anggota tim lain.

Untuk menamai folder lain:

```bash
git clone https://github.com/faridSrydi/github-pcd.git nama-folder
```

### 6.2 Pull: mengambil pembaruan

```bash
git pull origin main
```

Atau cukup `git pull` jika upstream sudah diatur dengan `-u`.

Penjelasan: `git pull` sebenarnya gabungan dua perintah:

```bash
git fetch origin        # mengunduh perubahan terbaru (belum menggabungkan)
git merge origin/main   # menggabungkan ke branch lokal
```

### 6.3 Fetch vs Pull

| | `git fetch` | `git pull` |
|---|---|---|
| Mengunduh perubahan | Ya | Ya |
| Menggabungkan ke branch lokal | **Tidak** | **Ya** |
| Risiko mengubah file lokal | Tidak ada | Ada (bisa konflik) |
| Kapan dipakai | Ingin melihat dulu perubahan di remote | Ingin langsung sinkron |

Untuk meninjau sebelum menggabungkan:

```bash
git fetch origin
git log HEAD..origin/main --oneline   # lihat commit baru di remote
git merge origin/main                 # gabungkan jika sudah yakin
```

### 6.4 Pull dengan rebase (riwayat lebih rapi)

```bash
git pull --rebase
```

Penjelasan: commit lokal "diletakkan ulang" di atas commit terbaru dari remote, sehingga riwayat berbentuk garis lurus tanpa commit *merge* tambahan.

---

## 7. Bekerja dengan Branch

Branch memungkinkan mengerjakan fitur tanpa mengganggu `main`.

```bash
# Buat dan pindah ke branch baru
git switch -c fitur-login

# Lihat semua branch
git branch

# Pindah ke branch lain
git switch main

# Push branch baru ke GitHub
git push -u origin fitur-login

# Gabungkan branch ke main (secara lokal)
git switch main
git merge fitur-login

# Hapus branch yang sudah selesai
git branch -d fitur-login               # lokal
git push origin --delete fitur-login    # remote
```

Penjelasan:

- `git switch -c` = membuat (*create*) sekaligus berpindah ke branch baru. Setara dengan `git checkout -b`.
- `-d` hanya menghapus branch yang sudah digabungkan, sehingga lebih aman dari `-D`.

---

## 8. Pull Request

Pull Request (PR) adalah cara mengusulkan penggabungan branch ke `main` melalui GitHub, biasanya disertai peninjauan (*review*).

1. Push branch fitur: `git push -u origin fitur-login`
2. Buka repo di GitHub. Akan muncul tombol **Compare & pull request**.
3. Isi judul dan deskripsi perubahan, lalu klik **Create pull request**.
4. Setelah ditinjau dan disetujui, klik **Merge pull request**.
5. Di lokal, sinkronkan kembali:

```bash
git switch main
git pull
```

---

## 9. Menangani Konflik

Konflik terjadi saat dua orang (atau dua branch) mengubah **baris yang sama** pada file yang sama.

Contoh pesan saat `git pull`:

```
CONFLICT (content): Merge conflict in app.py
Automatic merge failed; fix conflicts and then commit the result.
```

Cara menyelesaikan:

1. Buka file yang berkonflik. Git menandainya seperti ini:

```
<<<<<<< HEAD
versi milik kita (lokal)
=======
versi milik remote
>>>>>>> origin/main
```

2. Edit file: pilih salah satu versi atau gabungkan keduanya, lalu **hapus** ketiga baris penanda (`<<<<<<<`, `=======`, `>>>>>>>`).
3. Tandai sudah selesai dan commit:

```bash
git add app.py
git commit -m "fix: selesaikan konflik pada app.py"
git push
```

Untuk membatalkan proses merge dan kembali ke kondisi sebelum pull:

```bash
git merge --abort
```

---

## 10. Perintah Pendukung

| Perintah | Fungsi |
|---|---|
| `git log --oneline --graph` | Melihat riwayat commit secara ringkas dan bergrafik |
| `git show <id-commit>` | Melihat detail satu commit |
| `git restore <file>` | Membatalkan perubahan file yang belum di-staging |
| `git restore --staged <file>` | Mengeluarkan file dari staging (perubahan tetap ada) |
| `git commit --amend -m "pesan baru"` | Mengubah pesan commit terakhir (hanya jika belum di-push) |
| `git revert <id-commit>` | Membatalkan commit dengan membuat commit baru (aman untuk riwayat publik) |
| `git stash` | Menyimpan sementara perubahan yang belum di-commit |
| `git stash pop` | Mengembalikan perubahan yang di-stash |
| `git remote -v` | Melihat alamat remote |
| `git remote set-url origin <url>` | Mengganti alamat remote |
| `git rm --cached <file>` | Berhenti melacak file tanpa menghapusnya dari komputer |

---

## 11. Pemecahan Masalah Umum

| Pesan error / masalah | Penyebab | Solusi |
|---|---|---|
| `fatal: not a git repository` | Folder belum diinisialisasi | Jalankan `git init` atau pindah ke folder repo yang benar |
| `remote origin already exists` | Remote sudah pernah ditambahkan | `git remote set-url origin <url>` |
| `Authentication failed` / `Support for password authentication was removed` | Memakai password akun | Gunakan **Personal Access Token**, SSH, atau `gh auth login` |
| `error: src refspec main does not match any` | Belum ada commit, atau nama branch bukan `main` | Lakukan `git commit` dulu, lalu `git branch -M main` |
| `rejected ... (fetch first)` / `non-fast-forward` | Remote punya commit yang belum ada di lokal | `git pull --rebase` lalu `git push` |
| `refusing to merge unrelated histories` | Riwayat lokal dan remote berasal dari awal berbeda | `git pull origin main --allow-unrelated-histories` |
| `Permission denied (publickey)` | SSH key belum terdaftar di GitHub | Tambahkan kunci publik di Settings > SSH and GPG keys |
| File terlalu besar (>100 MB) ditolak | Batas ukuran file GitHub | Gunakan [Git LFS](https://git-lfs.com) atau jangan commit file tersebut |
| Terlanjur meng-commit `.env` atau password | File rahasia ikut ter-push | **Segera ganti/cabut kredensial tersebut**, lalu hapus dari riwayat; menghapus di commit baru saja tidak cukup |

---

## 12. Ringkasan Perintah (Cheat Sheet)

### Pertama kali (repo kosong)

```bash
git init
git add .
git commit -m "Commit pertama"
git branch -M main
git remote add origin https://github.com/faridSrydi/github-pcd.git
git push -u origin main
```

### Sehari-hari

```bash
git pull
git status
git add .
git commit -m "pesan perubahan"
git push
```

### Di komputer lain

```bash
git clone https://github.com/faridSrydi/github-pcd.git
```

---

## Referensi

- Dokumentasi resmi Git: <https://git-scm.com/doc>
- Buku Pro Git (gratis): <https://git-scm.com/book/id/v2>
- Dokumentasi GitHub: <https://docs.github.com>
