# Ikon taskbar SaveHUB

Versi 4.2.2 menambahkan identitas tombol taskbar Windows yang lengkap untuk jendela utama dan popup: AppID SaveHUB, file ICO nyata, nama SaveHUB, dan perintah peluncuran ulang. Notifikasi tetap memakai nama/logo platform.

## Memakai pembaruan

1. Ekstrak seluruh ZIP ini ke folder baru.
2. Jalankan BUILD-WINDOWS.bat. Semua tes tetap harus lulus sebelum build.
3. Keluar dari SaveHUB lama melalui menu tray → Keluar dari SaveHUB.
4. Pasang installer SaveHUB-Setup-4.2.2-x64.exe dari folder release, lalu buka melalui shortcut SaveHUB. Alternatif: jalankan SaveHUB-Portable-4.2.2-x64.exe dari release.
5. Jika ikon Electron lama masih dipin, klik kanan ikon itu → Unpin from taskbar. Setelah SaveHUB baru terbuka, klik kanan ikon SaveHUB → Pin to taskbar.

JALANKAN-WINDOWS.bat memakai release/win-unpacked/SaveHUB.exe jika tersedia. Jika belum ada hasil build, ia menjalankan mode sumber melalui runtime pengembangan; gunakan hasil installer/portable untuk distribusi dan pin harian. Mengganti sumber tidak memperbarui EXE versi lama yang sudah terpasang.

Perbaikan ini tidak menghapus data akun, pin taskbar, cache ikon Windows, atau ikon aplikasi lain. Windows yang menyimpan pin lama mungkin perlu aplikasi ditutup dan dibuka kembali setelah unpin/pin.

74 tes otomatis lulus dengan adaptor. Ikon taskbar pada Windows asli dan hasil executable belum diverifikasi langsung di lingkungan ini. Identitas ikon pada file EXE memerlukan proses build; paket ZIP ini tetap berisi sumber dan skrip build.
