# Validasi SaveHUB 4.4.0

Diperiksa pada 21 November 2026.

## Pengujian otomatis

85 pengujian lulus, 0 gagal.

- Migrasi partisi akun utama dipertahankan; akun tambahan dan platform berbeda mendapat partisi berbeda.
- UI tambah akun berpindah ke sesi baru dan mengubah label akun aktif.
- Kunci PIN menggunakan scrypt bersalt, meminta PIN saat ini untuk perubahan/penonaktifan, serta menerapkan cooldown setelah kegagalan.
- Startup dari konfigurasi PIN memulai aplikasi terkunci. Overlay menghalangi perpindahan layanan di UI.
- Simulasi proses utama menguji bahwa IPC akun/platform diblokir saat terkunci, renderer remote tidak boleh memanggil pembuka PIN, perubahan layout tidak memunculkan konten terkunci, dan popup mengikuti sesi akun induk.
- Simulasi penutupan jendela mempertahankan proses di tray; menonaktifkan tutup-ke-tray menyebabkan aplikasi keluar.
- Mode fokus berakhir sesuai waktu dan pemulihan suara menghormati preferensi mute manual.
- Pengelola unduhan diuji untuk progres, jeda, lanjutkan, selesai, serta penghapusan riwayat tanpa penghapusan berkas. Nama berkas di-escape pada UI.
- Penghemat RAM melewati panel foreground, draf, audio, dan memulihkan panel menggunakan sesi login yang sama.
- Updater menolak sumber yang belum dikonfigurasi, identitas penerbit yang tidak cocok, serta tidak mengunduh/memasang tanpa kondisi atau tindakan yang sesuai.
- Fitur lama tetap diperiksa: profil Chromium, batas panel, URL aman, blur selektif/seluruh halaman, navigasi/dialog/error, favorit, pencarian, tab pengaturan, serta pratinjau blur.

Pemeriksaan sintaks JavaScript serta skema konfigurasi build lokal dan konfigurasi update bertanda tangan lulus.

## Regresi notifikasi Windows

Lima uji tambahan memeriksa kesesuaian AppUserModelID dengan build, GUID activator stabil, registrasi DisplayName dan IconUri SaveHUB, pemakaian ikon eksternal app.asar, shortcut development dengan argumen folder, target executable packaged/portable, perlindungan shortcut instalasi, kegagalan registrasi, dan tanpa perubahan registrasi pada OS lain. Uji proses utama memastikan pendaftaran selesai sebelum bootstrap layanan.

Sebelas uji tambahan pada 3.1.0 memeriksa sembilan identitas platform dengan logo lokal, penanganan kegagalan, XML aman, validasi tautan aktivasi, penolakan pemalsuan platform dan asal IPC, redaksi blur, blokir saat terkunci/fokus, tag dan pembatasan laju, data PowerShell lewat stdin, serta bridge notifikasi halaman. Simulasi proses utama menguji sesi akun asal dan penundaan klik sampai PIN dibuka.

## Regresi tampilan 4.0.0

- Kontrol jendela mengikuti urutan tutup, minimalkan, maksimalkan; seluruhnya tetap memakai aksi Electron yang ada.
- Tombol sidebar baru memperbarui preferensi tersimpan, atribut aria-pressed, serta label aksesibilitas. Perpindahan platform tetap bekerja saat sidebar ringkas.
- Tombol browser luar di menu dan halaman error sudah tidak ada. Handler hub:external dan API preload dihapus. Simulasi proses utama memeriksa tidak adanya IPC tersebut, serta popup login HTTPS tetap terikat pada jendela dan sesi akun induknya. URL file/mailto ditolak.
- Seluruh 53 uji lulus. Sintaks JavaScript, parsing 361 aturan CSS, dan skema konfigurasi build diperiksa.
- CSS menyediakan susunan untuk jendela lebar, jendela 920 piksel, sidebar ringkas, dan jendela pendek; mode gelap, reduced motion, dan fallback tanpa backdrop-filter tersedia. Ketepatan tampilan pada ukuran tersebut belum diverifikasi dengan render browser.
- Percobaan pratinjau Chromium dihentikan oleh batas izin socket lingkungan. Tidak ada screenshot atau hasil uji visual nyata yang diklaim. Pemeriksaan UI memakai DOM simulasi; diperlukan pemeriksaan visual pada Windows, terutama skala layar 125%/150%, toolbar platform, serta dialog panjang.

## Regresi pengalaman desktop 4.1.0

Enam uji baru mencakup menu klik kanan sesuai izin edit, penolakan menu ketika terkunci, penanganan pesan internal tanpa membocorkan jalur/kode, pemulihan koneksi dan sertifikat, status startup siap/gagal, serta konten awal yang tetap tertutup sampai pemuatan selesai. Seluruh 59 uji lulus. Teks lama yang menyebut kode pemuatan, kegagalan registrasi mentah, dan konfigurasi installer di layar telah diganti; pemeriksaan status gagal tetap dipertahankan.

Judul popup ditentukan dari platform/akun yang tervalidasi dan tidak mengikuti perubahan judul halaman. Error startup proses utama menampilkan dialog SaveHUB. Kedua jalur ini belum diuji pada Windows asli. Fitur sertifikat tidak menyediakan jalan untuk melewati verifikasi.

## Splash dan regresi startup 4.2.0

Dua reproduksi awal gagal sebelum perbaikan: normalizeAccounts(null) melempar TypeError dan balasan layout terbalik memilih WhatsApp meski pilihan terakhir Telegram. Keduanya lulus setelah normalisasi dan pemberian revisi navigasi.

Sepuluh uji baru mencakup normalisasi akun/preferensi, perpindahan cepat, splash lokal tersandbox, dua urutan kesiapan jendela/renderer, kegagalan file splash, pembatalan, timeout, penolakan sinyal siap dari halaman remote, izin notifikasi selama perubahan fokus, serta penggunaan ulang menu tray. Seluruh 69 uji lulus. Adaptor proses utama kini menyertakan URL global agar jalur dialog izin benar-benar diuji, bukan selalu jatuh ke penolakan akibat kekurangan adaptor.

Splash tidak memakai skrip renderer atau akses Node dan memblokir popup/navigasi. Aset splash dikemas di dalam src dan assets. Tidak ada angka klaim peningkatan startup/RAM: pengujian memastikan penghapusan pembuatan menu tray yang berulang, bukan benchmark OS. Tampilan splash dan serah-terima jendela belum diuji pada Windows asli.

## Perbaikan tes Windows 4.2.1

Foto kegagalan menunjukkan satu assertion logo notifikasi menolak URL `file:///C:/local/whatsapp.png` karena regex hanya menerima `file:///local/whatsapp.png`. Ini terjadi pada npm test, sebelum electron-builder dijalankan. Tes diperbaiki dengan fixture jalur lokal OS dan pembacaan atribut XML serta pemeriksaan URL balik ke berkas asal. Dua harness DOM juga memakai pathToFileURL untuk URL dokumen lokal yang valid di Windows.

Satu uji regresi baru menggunakan opsi Windows/POSIX dari API URL Node untuk menguji drive C, spasi, #, dan & dalam XML logo. Ini simulasi format lintas OS, bukan eksekusi build Windows. Total 70 tes lulus di lingkungan Linux; tidak ada tes yang dilewati. Skrip batch mempertahankan penghentian jika tes gagal dan memberi nama tahap kegagalan.

## Regresi taskbar Windows 4.2.2

Empat uji baru memeriksa pemanggilan setIcon dan setAppDetails dengan ICO eksternal, AppID yang cocok, pasangan relaunchCommand/relaunchDisplayName, argumen sumber yang dikutip, target installer/portable yang stabil, pengabaian pada OS lain, kegagalan ikon yang tidak menghentikan aplikasi, serta penerapan pada jendela utama sebelum splash menyerahkan tampilan. Total 74 uji lulus.

Konfigurasi build tetap memuat assets/icon.ico dan signAndEditExecutable: true agar ikon executable diproses saat build. Penetapan properti taskbar dan ikon juga dipakai oleh callback pembuatan popup. Launcher mengutamakan binary hasil build di release/win-unpacked. Tampilan taskbar Windows, pembaruan ikon yang sudah dipin, dan eksekusi file BAT belum diverifikasi di Windows asli. Tidak ada klaim EXE sudah dibuat dalam perbaikan ini.

Referensi: https://www.electronjs.org/docs/latest/api/browser-window#winsetappdetailsoptions-windows

## Dukungan macOS 4.3.0

Tujuh uji tambahan memeriksa opsi native window, Dock/About/menu, menu Command-Q dan aksi platform, metadata izin dan ikon ICNS, perilaku close/activate, penguncian saat Hide, serta kelas UI/pintasan Command. Skema electron-builder versi terpasang dan sintaks kedua skrip shell juga diperiksa. Plist entitlements dan header/panjang ICNS divalidasi. Total 81 uji lulus pada Linux dengan adaptor; build native Mac, signing/notarization, artifact Actions, izin OS, dan distribusi DMG belum dijalankan.

Workflow terpisah menggunakan runner ARM64/Intel dan menyimpan artifact, tanpa merilis secara publik. Notifikasi native Mac dan auto-update memiliki batas yang dijelaskan di MACOS.md; tidak mengklaim parity relay Windows.

## Dukungan Linux 4.4.0

Empat uji baru memeriksa setDesktopName sebelum ready, kesesuaian identitas desktop/package, target dan metadata paket, default tutup-ke-tray yang aman, serta perilaku close Linux. Seluruh 85 uji lulus. Sintaks shell dan skema konfigurasi build valid.

Build `npm run dist:linux -- --publish never` berhasil dengan exit code 0. Hasil: SaveHUB-4.4.0-Linux-x86_64.AppImage dan SaveHUB-4.4.0-Linux-amd64.deb. Pemeriksaan dpkg-deb mengonfirmasi Package savehub, Version 4.4.0, Architecture amd64, desktop entry id.savemeours.savehub.desktop, Exec /opt/SaveHUB/savehub %U, dan StartupWMClass yang cocok. AppImage berformat ELF x86-64 dan merespons --appimage-version. Tidak ada tes GUI atau instalasi paket ke sistem host.

ARM64, workflow CI, variasi desktop/distro, FUSE pengguna, sandbox desktop, notifikasi native Linux, portal Wayland, serta media/panggilan belum diuji. Klaim paket berhasil dibangun tidak berarti seluruh integrasi desktop telah diverifikasi.

## Batas pengujian

Uji proses utama memakai adaptor Electron tiruan dalam VM, uji panel memakai adaptor native tiruan, dan uji UI memakai DOM simulasi. Ini belum merupakan pengujian EXE/native Windows. Belum diverifikasi: integrasi tray OS, idle/lock-screen OS sebenarnya, login multiakun nyata, panggilan, notifikasi yang sudah diantre OS, unduhan jaringan nyata, dan penghematan RAM terukur.

Tidak ada installer/portable Windows atau DMG macOS yang telah dibuat, dan tidak ada rilis publik yang diterbitkan. Paket Linux x64 telah dibuat pada 4.4.0 sebagaimana dicatat di atas. Runtime Electron tidak tersedia di lingkungan kerja. Paket berisi sumber, skrip menjalankan/build, serta workflow penerbitan. Pembaruan otomatis belum aktif karena sumber rilis resmi dan penandatanganan Windows belum dikonfigurasi. Mekanisme pemeriksaan, unduhan, validasi penerbit, dan tindakan pemasangan telah diimplementasikan dan diuji dengan adaptor.

Selector blur dapat berubah mengikuti situs. Penghemat RAM dapat melewatkan format draf khusus situs; platform penting dapat dikecualikan. Kunci PIN melindungi akses UI, bukan enkripsi disk atau pertahanan terhadap administrator perangkat.
