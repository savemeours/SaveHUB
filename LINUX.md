# SaveHUB Linux 4.4.0

Build x64 telah menghasilkan dua paket:

| Berkas | Penggunaan |
| --- | --- |
| SaveHUB-4.4.0-Linux-x86_64.AppImage | Paket portable Linux x64; tidak perlu instalasi paket sistem |
| SaveHUB-4.4.0-Linux-amd64.deb | Paket untuk desktop berbasis Debian/Ubuntu/Mint x64 |

ARM64 sudah memiliki konfigurasi dan workflow build, tetapi binary ARM64 belum dibuat atau diuji dalam tugas ini. Tidak ada klaim mendukung semua distro/versi Linux. Aplikasi memerlukan lingkungan desktop grafis dan pustaka sistem yang sesuai dengan runtime yang dikemas.

## Menjalankan AppImage

Di folder unduhan, jalankan:

```bash
chmod +x SaveHUB-4.4.0-Linux-x86_64.AppImage
./SaveHUB-4.4.0-Linux-x86_64.AppImage
```

AppImage dapat memerlukan FUSE sesuai distro. Bila FUSE tidak tersedia, runtime mendukung ekstraksi dan peluncuran:

```bash
./SaveHUB-4.4.0-Linux-x86_64.AppImage --appimage-extract-and-run
```

Alternatifnya, gunakan paket DEB pada distro yang mendukungnya. Aplikasi dijalankan sebagai pengguna desktop biasa; jangan memakai opsi --no-sandbox atau mematikan sandbox agar dapat berjalan sebagai root.

## Memasang DEB

```bash
sudo apt install ./SaveHUB-4.4.0-Linux-amd64.deb
```

Setelah terpasang, buka **SaveHUB** dari menu aplikasi atau jalankan `savehub`. Launcher desktop menggunakan nama/ikon SaveHUB dan AppID yang cocok untuk asosiasi jendela X11/Wayland. AppImage tidak otomatis membuat launcher desktop tersendiri; gunakan DEB untuk integrasi menu sistem.

## Fitur dan perilaku desktop

- Multiakun, blur chat/media, kunci PIN, mode fokus, pengelola unduhan, penghemat RAM, dan splash screen disertakan.
- Tampilan kaca serta kontrol jendela konsisten dengan versi desktop SaveHUB. Linux menggunakan kontrol aplikasi, bukan traffic lights macOS native.
- Tutup ke tray dimatikan secara bawaan pada Linux. Dukungan ikon tray bergantung desktop/session (GNOME, KDE, X11, Wayland). Aktifkan tutup ke tray hanya setelah ikon tray terlihat dan dapat dipakai untuk membuka kembali jendela.
- Notifikasi mengikuti server notifikasi Linux dan izin platform; relay identitas per platform Windows belum dipindahkan. Blur hanya menyamarkan konten di dalam aplikasi; isi notifikasi Linux belum disamarkan oleh relay.
- Kamera, mikrofon, berbagi layar, dan panggilan mengikuti dukungan situs dan desktop/portal Linux. Fitur itu belum diuji pada sesi desktop nyata dalam tugas ini.
- Pembaruan otomatis belum diaktifkan. Gunakan paket SaveHUB versi terbaru secara manual.

## Build sendiri

Pasang Node.js 24 LTS dan ekstrak paket source, lalu:

```bash
bash BUILD-LINUX.sh
```

Skrip mendeteksi x64/arm64, memasang dependensi, menjalankan tes, dan membuat AppImage/DEB di folder release. Untuk memilih target: `bash BUILD-LINUX.sh x64` atau `bash BUILD-LINUX.sh arm64`. Jika tool pengemasan native tidak tersedia pada arsitektur host, gunakan runner CI dengan arsitektur yang sesuai.

`bash JALANKAN-LINUX.sh` mengutamakan aplikasi terpasang, lalu binary hasil build sesuai arsitektur, dan akhirnya mode source. Skrip tidak menonaktifkan sandbox. Paket installer tetap pilihan praktis bagi pengguna akhir.

## GitHub Actions

Unggah isi folder source ke repository sendiri, lalu jalankan **Actions → Build SaveHUB Linux → Run workflow**. Workflow memakai ubuntu-24.04 untuk x64 dan ubuntu-24.04-arm untuk ARM64. Hasil disimpan sebagai artifact SaveHUB-Linux-x64 / SaveHUB-Linux-arm64; tidak menerbitkan rilis publik secara otomatis. Workflow belum dijalankan dalam tugas ini.

## Pengujian

85 tes otomatis lulus. Build x64 AppImage dan DEB berhasil pada lingkungan Linux; metadata DEB, isi launcher desktop, dan respons --appimage-version telah diperiksa. GUI aplikasi, login platform, tray, notifikasi, panggilan, serta instalasi pada distro pengguna belum diuji di desktop Linux nyata. Binary ARM64 belum dibangun. Ini membedakan hasil pengemasan yang sudah berhasil dari kompatibilitas desktop yang masih perlu diperiksa.

Referensi: https://www.electron.build/v26/docs/linux/ dan https://www.electronjs.org/docs/latest/api/app#appsetdesktopnamename-linux
