# SaveHUB 3.0 — Panduan fitur

## Multiakun

Buka platform lalu klik nama akun di toolbar (awalnya **Utama**). Tambahkan nama seperti Pribadi, Kerja, atau Usaha. Akun baru mendapat halaman login dan penyimpanan sesi sendiri; cookie akun utama lama tetap dipakai. Maksimal 10 akun per platform. Klik akun untuk berpindah, edit namanya, atau hapus akun tambahan dari daftar lokal. Menghapus akun lokal meminta konfirmasi dan tidak menghapus akun pada layanan aslinya.

Panel akun yang sudah dibuka tetap aktif di latar kecuali dijeda oleh penghemat RAM. Satu akun per platform ditampilkan pada satu waktu. Pengaturan blur dan mute manual berlaku per platform, termasuk semua akunnya. Jendela login popup memakai sesi akun yang membukanya.

## System tray

Secara bawaan tombol × menyembunyikan jendela ke tray, sehingga akun dan unduhan tetap berjalan. Buka kembali melalui ikon tray. Menu tray menyediakan Buka SaveHUB, Kunci aplikasi, Mode fokus, dan Keluar. Gunakan **Keluar dari SaveHUB** untuk menghentikan aplikasi sepenuhnya.

Nonaktifkan **Pengaturan → Perangkat & aplikasi → Tutup ke system tray** bila × harus keluar. Bila tray tidak tersedia pada sistem, aplikasi memakai perilaku keluar normal dan memberi keterangan pada pengaturan.

## Kunci aplikasi

Klik ikon gembok untuk membuat PIN 4–12 angka. Setelah PIN dibuat, ikon gembok mengunci aplikasi. Gunakan **Ctrl+Shift+L** untuk mengunci cepat. PIN disimpan sebagai hash scrypt bersalt; PIN asli tidak disimpan.

Atur waktu idle komputer sebelum kunci otomatis dan pilihan kunci saat diminimalkan/disembunyikan. Aplikasi mengunci ketika sistem mengirim peristiwa layar dikunci atau suspend. Saat terkunci, panel platform dan popup disembunyikan, suara dibisukan, tindakan akun/platform/unduhan dibatasi di proses utama, dan tampilan meminta PIN. Perubahan atau penonaktifan PIN memerlukan PIN saat ini. Lima kegagalan menimbulkan jeda percobaan yang tetap tersimpan setelah restart.

Kunci ini melindungi antarmuka, bukan mengenkripsi seluruh cookie, riwayat unduhan, file, atau profil Windows. Pengguna dengan akses administrasi ke perangkat tetap dapat membaca/mengubah berkas lokal. Simpan PIN dengan baik; tidak ada pemulihan akun jarak jauh.

## Mode fokus

Buka **Mode fokus** di sidebar atau Ctrl+Shift+F. Pilih platform dan durasi 5–180 menit. Seluruh akun pada platform terpilih dibisukan selama fokus. SaveHUB juga menolak permintaan izin notifikasi baru dari platform tersebut saat fokus aktif. Setelah timer selesai atau fokus dihentikan, mute kembali mengikuti pilihan manual sebelumnya.

Notifikasi yang sudah dikirim ke sistem operasi atau mekanisme khusus penyedia mungkin tetap terlihat. Fitur tidak menonaktifkan koneksi akun dan tidak otomatis menolak/menutup panggilan.

## Pengelola unduhan

Buka **Unduhan** di sidebar. Unduhan menampilkan nama berkas, platform, akun, byte diterima, total, kecepatan, progres, dan status. Aksi yang tersedia mencakup jeda, lanjutkan bila server/unduhan mendukung, batalkan, buka berkas selesai, buka folder, serta hapus riwayat selesai.

Unduhan tetap berjalan saat jendela berada di tray. Berkas disimpan melalui dialog native. Riwayat lokal menyimpan hingga 200 entri terakhir; menghapus riwayat tidak menghapus berkas. Unduhan yang belum selesai ketika aplikasi benar-benar keluar ditandai terputus pada peluncuran berikutnya; pelanjutan lintas restart tidak tersedia.

## Penghemat RAM

Buka **Pengaturan → Perangkat & aplikasi → Penghemat RAM**. Fitur otomatis mati secara bawaan agar pengguna memilih dulu platform penting yang dikecualikan. Ketika diaktifkan, panel latar yang melewati batas 5–120 menit akan dijeda. WhatsApp dan Telegram dikecualikan secara bawaan.

Panel yang sedang ditampilkan, bersuara/memutar media, memiliki unduhan aktif atau popup, serta memiliki kolom teks berisi tidak dijeda. Pemeriksaan draf hanya mengembalikan boolean; isi teks tidak dikirim atau disimpan. Pemeriksaan yang gagal/lambat membuat panel dilewati. Draf khusus situs mungkin tidak terdeteksi; kecualikan platform penting. Tersedia tombol Jeda untuk panel latar pada daftar.

Jeda menutup renderer untuk mengurangi pemakaian proses/RAM tanpa menghapus cookie. Panel yang dijeda tidak menerima pesan/notifikasi sampai dibuka kembali. Memilihnya memuat kembali halaman terakhir melalui sesi akun yang sama; posisi scroll, state sementara, atau riwayat navigasi dalam renderer tidak dijamin pulih. Tidak ada klaim persentase penghematan RAM sebelum diukur di Windows.

## Pembaruan otomatis

UI, pemeriksaan, progres unduhan, dan pemasangan setelah persetujuan tersedia. Pada paket sumber ini statusnya **Sumber rilis resmi belum dikonfigurasi**; tidak ada server/rilis publik atau EXE yang telah diterbitkan dari percakapan ini.

Agar berfungsi, penerbit harus:

1. Menempatkan proyek pada repositori GitHub resmi yang dipilih.
2. Memiliki sertifikat Windows code signing dan nama penerbit yang sesuai.
3. Menjalankan `node scripts/configure-updates.cjs OWNER REPO "Nama penerbit sertifikat"`.
4. Menyediakan konfigurasi penandatanganan (`CSC_LINK`, `CSC_KEY_PASSWORD`) di lingkungan build/Secrets GitHub. Jangan menaruh sertifikat/kata sandi di kode sumber.
5. Menerbitkan installer NSIS bertanda tangan beserta metadata update dan blockmap menggunakan workflow **Publish signed SaveHUB Windows release** yang disertakan. Set repository variable `SAVEHUB_PUBLISHER_NAME`.
6. Mendistribusikan hasil installer resmi pertama; build itu membawa identitas feed dan penerbit terpercaya untuk pembaruan berikutnya.

Konfigurasi sumber rilis membuat build mewajibkan code signing dan validasi identitas penerbit. Runtime menolak manifest yang menonaktifkan verifikasi atau tidak memuat nama penerbit yang dikonfigurasi. Mekanisme memakai electron-updater; tidak ada bypass pemeriksaan signature. Pemeriksaan saat aplikasi dibuka dapat diatur, unduh otomatis opsional, sedangkan pemasangan selalu lewat tindakan pengguna dan dialog mulai ulang.

Mode pengembangan (`npm start`) dan versi portable tidak melakukan pemasangan update otomatis. Build lokal tanpa konfigurasi rilis tetap bisa dibuat, dengan fitur update belum aktif. Sertifikat/rilis resmi belum disediakan atau dikonfigurasi pada paket ini.
