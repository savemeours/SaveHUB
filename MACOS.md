# SaveHUB untuk macOS — 4.3.0

Paket ini berisi sumber versi macOS dan alat pembuat DMG/ZIP. Ini belum berupa DMG yang sudah selesai dibangun. Source tetap dapat membuat paket Windows seperti sebelumnya.

## Pilih arsitektur

| Mac | Target | Nama hasil |
| --- | --- | --- |
| Apple Silicon (seri M) | arm64 | SaveHUB-4.3.0-macOS-arm64.dmg |
| Intel | x64 | SaveHUB-4.3.0-macOS-x64.dmg |

Kedua target juga menghasilkan ZIP berisi SaveHUB.app. Ikon ICNS SaveHUB sudah disertakan. Periksa jenis prosesor melalui menu Apple → About This Mac/Tentang Mac Ini.

## Build langsung di Mac

1. Ekstrak seluruh paket dan pasang Node.js 24 LTS dari https://nodejs.org/.
2. Pada Terminal, masuk ke folder SaveHUB hasil ekstraksi.
3. Jalankan `bash BUILD-MACOS.command`. Skrip memilih arsitektur Mac yang dipakai, memasang dependensi, menjalankan seluruh tes, lalu membuat DMG dan ZIP di folder release.
4. Untuk membuat kedua varian pada satu Mac, gunakan `bash BUILD-MACOS.command all`. Untuk target tertentu: `bash BUILD-MACOS.command arm64` atau `bash BUILD-MACOS.command x64`.
5. Buka DMG yang sesuai dan tarik SaveHUB.app ke Applications, lalu jalankan dari Applications.

Untuk menjalankan source saat pengembangan, gunakan `bash JALANKAN-MACOS.command`. Skrip mendahulukan /Applications/SaveHUB.app, lalu hasil build yang sesuai arsitektur; jika belum ada, ia menjalankan source. Jika Terminal tidak diperlukan, file .command bisa dibuka langsung setelah memiliki izin executable, misalnya `chmod +x BUILD-MACOS.command JALANKAN-MACOS.command`.

## Build melalui GitHub Actions

1. Unggah isi folder SaveHUB ke repository milikmu, termasuk package-lock.json dan .github/workflows/build-macos.yml.
2. Buka tab Actions → Build SaveHUB macOS → Run workflow.
3. Unduh artifact SaveHUB-macOS-arm64 atau SaveHUB-macOS-x64 setelah job selesai.
4. Ekstrak artifact untuk mendapatkan DMG/ZIP. Workflow tidak menerbitkan rilis publik atau melakukan deploy.

Job ARM memakai runner macos-15; job Intel memakai macos-15-intel. Workflow ini belum dijalankan dalam tugas ini. Waktu dan kuota Actions mengikuti akun/repository GitHub yang digunakan.

## Perilaku versi Mac

- Traffic lights merah–kuning–hijau berasal dari macOS; kontrol HTML tiruan disembunyikan.
- Ikon Dock dan About memakai identitas SaveHUB.
- Menutup jendela menyembunyikannya; klik ikon Dock untuk membuka kembali. ⌘Q keluar dari aplikasi, ⌘W menutup jendela.
- ⌘K mencari platform, ⌘1–9 berpindah platform, ⌘, membuka pengaturan. Jika penguncian otomatis saat disembunyikan diaktifkan, aksi Hide macOS juga mengunci PIN.
- Multiakun, blur, fokus, unduhan, penghemat RAM, serta splash screen tetap disertakan.
- Kamera dan mikrofon memiliki deskripsi izin macOS. Izinkan hanya platform yang kamu gunakan; izin aplikasi juga dapat diatur melalui System Settings → Privacy & Security.

## Status distribusi dan batas dukungan

Build bawaan ditujukan untuk pengujian dan tidak menggunakan sertifikat Developer ID atau notarization Apple yang disediakan pengguna. Karena itu macOS mungkin meminta persetujuan aplikasi yang belum terverifikasi. Jika paket dibuat sendiri atau berasal dari sumber yang kamu percaya, gunakan persetujuan khusus aplikasi melalui Privacy & Security → Open Anyway bila macOS menyediakannya. Jangan mematikan Gatekeeper secara global.

Distribusi publik memerlukan proses Developer ID signing dan notarization milik penerbit. Paket sumber tidak memuat kredensial Apple. Untuk mengaktifkan signing sendiri, konfigurasi certificate/identity serta notarization sesuai electron-builder versi 26; pengaturan tersebut belum diaktifkan di workflow ini.

Notifikasi macOS menggunakan jalur sistem bawaan dan identitas aplikasi SaveHUB; relay nama/logo per platform pada versi Windows belum dipindahkan ke macOS. Blur tampilan berlaku pada konten aplikasi; penyamaran isi notifikasi macOS belum diimplementasikan. Notifikasi latar belakang, panggilan, dan OAuth mengikuti kemampuan situs dan izin OS. Pembaruan otomatis macOS belum diaktifkan—gunakan paket versi terbaru secara manual.

Pengujian otomatis menggunakan adaptor macOS/Electron dan DOM simulasi pada Linux. DMG, instalasi, login nyata, panggilan, notifikasi, permission prompt, dan serah-terima splash di Mac belum diuji secara langsung. Tidak ada klaim bahwa file DMG telah dibuat dalam lingkungan ini.

Referensi:
- https://www.electron.build/v26/docs/mac/
- https://www.electronjs.org/docs/latest/tutorial/custom-title-bar
- https://docs.github.com/en/actions/reference/runners/github-hosted-runners
