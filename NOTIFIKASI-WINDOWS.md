# Notifikasi platform — SaveHUB 4.2.2

Notifikasi layanan memakai **nama dan logo platform masing-masing**. Contoh: header WhatsApp dengan logo WhatsApp, Telegram dengan logo Telegram. Berlaku untuk sembilan platform. Nama kontak/judul dan isi pesan ditampilkan di bawah identitas platform; label akun membantu membedakan akun pribadi/kerja. Baris atribusi menyebut “via SaveHUB” agar asal aplikasi jelas.

## Cara menerapkan

1. Keluar dari SaveHUB lama melalui menu tray → **Keluar dari SaveHUB**.
2. Ekstrak seluruh ZIP ini ke folder baru, kemudian jalankan **JALANKAN-WINDOWS.bat**.
3. Buka layanan yang digunakan dan izinkan notifikasi jika diminta.
4. Periksa notifikasi **baru**. Notifikasi lama di pusat notifikasi tidak diubah.
5. Pengaturan → Perangkat & aplikasi menampilkan jumlah identitas platform yang terdaftar.

Bila memakai EXE, sumber yang diperbarui tidak mengubah EXE lama. Jalankan **BUILD-WINDOWS.bat**, lalu gunakan installer/portable baru di folder release. Login lama tetap memakai partisi akun yang sama.

## Perilaku

- Setiap platform memiliki AppUserModelID, DisplayName, ikon lokal, serta shortcut tersendiri pada folder Start Menu **SaveHUB Platforms**. Identitas aplikasi utama tetap SaveHUB.
- Nama dan ikon platform ditentukan proses utama dari sesi dan domain asal. Halaman tidak dapat memilih nama platform atau logo lain.
- Tidak ada pergantian identitas global per pesan sehingga notifikasi dari beberapa platform tidak berebut identitas.
- Jalur Windows memakai WinRT ToastNotificationManager melalui skrip PowerShell tetap. Data pesan dikirim sebagai JSON lewat stdin, bukan argumen executable, skrip dinamis, atau berkas berisi pesan.
- Klik notifikasi membuka platform dan akun asal melalui protokol savehub. Jika aplikasi terkunci, membuka platform menunggu PIN; akun yang sudah dihapus diabaikan.
- Mode fokus dan kunci aplikasi memblokir permintaan baru. Ketika blur platform aktif, judul kontak serta isi pesan pada notifikasi baru diganti teks umum. Notifikasi yang sudah dikirim ke Windows sebelum blur/kunci tidak ditarik ulang.
- Bridge dipasang sebelum halaman dan service worker dijalankan. Akun yang ditidurkan penghemat RAM, aplikasi yang sudah keluar, atau platform yang tidak mengirim Web Notifications tidak dijamin menghasilkan notifikasi latar belakang.
- Registrasi tidak membutuhkan administrator. Nama platform merujuk layanan yang dibuka melalui SaveHUB; aplikasi ini bukan klien resmi platform tersebut.

## Batas dukungan dan validasi

Windows 10/11 diperlukan untuk jalur toast ini. PowerShell/registrasi pengguna yang diblokir kebijakan perangkat dapat menyebabkan notifikasi gagal. Jangan menonaktifkan proteksi Windows; gunakan kebijakan perangkat yang berlaku. Pada OS lain, notifikasi situs tetap mengikuti jalur bawaan.

Balasan langsung, tombol aksi khusus situs, gambar lampiran, getNotifications lintas restart, dan event notificationclick service worker dengan objek native lengkap belum didukung oleh relay. Klik dasar membuka platform dan akun; pemilihan percakapan khusus bergantung callback halaman yang masih hidup.

74 pengujian otomatis lulus. Pengujian memakai adaptor Electron/Windows dan DOM simulasi; **toast Windows nyata, preload service worker pada runtime asli, dan installer Windows belum diverifikasi langsung**. Paket ini berisi sumber, bukan EXE siap pasang. Setelah build, uji pesan masuk pada akun nyata, nama/logo header, klik akun yang berbeda, mode fokus, blur, kunci PIN, serta izin notifikasi Windows sebelum distribusi.

Referensi teknis:
- https://www.electronjs.org/docs/latest/api/session#sesregisterpreloadscriptscript
- https://www.electronjs.org/docs/latest/api/service-worker-main
- https://www.electronjs.org/docs/latest/api/context-bridge
- https://learn.microsoft.com/en-us/uwp/api/windows.ui.notifications.toastnotificationmanager.createtoastnotifier
- https://learn.microsoft.com/en-us/windows/apps/design/shell/tiles-and-notifications/toast-activation-overview
