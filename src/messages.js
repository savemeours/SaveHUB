'use strict';
// Shared presentation copy: internal exceptions never become screen text.
(function(root,factory){const copy=factory();if(typeof module==='object'&&module.exports)module.exports=copy;else root.SaveHUBCopy=copy;})(globalThis,()=>{
 function friendly(error,fallback='Tindakan belum berhasil. Silakan coba lagi.'){
  const message=String(error?.message??error??'');
  const seconds=message.match(/(\d{1,3}) detik/);if(seconds&&/PIN|coba lagi|tunggu/i.test(message))return 'Tunggu '+seconds[1]+' detik sebelum mencoba PIN lagi.';
  const rules=[[/PIN(?: saat ini)? tidak cocok/i,'PIN tidak cocok. Silakan coba lagi.'],[/PIN.*4.?12|4.?12.*digit/i,'Gunakan PIN berisi 4–12 angka.'],[/Buka kunci/i,'Buka kunci SaveHUB untuk melanjutkan.'],[/Nama akun harus/i,'Isi nama akun dengan 1–30 karakter.'],[/Maksimal 10 akun/i,'Batas 10 akun untuk platform ini sudah tercapai.'],[/Akun utama tidak dapat dihapus/i,'Akun utama tidak dapat dihapus. Gunakan Keluar akun.'],[/Akun tidak ditemukan/i,'Akun ini sudah tidak tersedia. Pilih akun lain.'],[/Sesi sedang diperbaiki/i,'Akun sedang disiapkan. Coba lagi sebentar.'],[/Berkas belum selesai/i,'Tunggu sampai unduhan selesai sebelum membuka berkas.'],[/penerbit/i,'Pembaruan tidak dapat diverifikasi. Gunakan paket SaveHUB dari penerbit yang kamu percaya.'],[/sumber rilis|belum dikonfigurasi/i,'Pembaruan otomatis belum tersedia untuk versi ini.'],[/NSIS|mode pengembangan|portable/i,'Pembaruan otomatis tersedia melalui SaveHUB yang dipasang dengan installer.'],[/Belum ada pembaruan/i,'Belum ada pembaruan yang siap diunduh.'],[/Pembaruan belum siap/i,'Tunggu sampai pembaruan selesai diunduh.']];
  return rules.find(([pattern])=>pattern.test(message))?.[1]||fallback;
 }
 function connection(code,name){if(code===-106)return 'Perangkat sedang offline. Sambungkan internet untuk melanjutkan.';if(code===-105)return 'Alamat '+name+' belum dapat dijangkau. Periksa koneksi internet, lalu coba lagi.';if(code===-118)return name+' membutuhkan waktu lebih lama untuk merespons. Coba sambungkan kembali.';if(code<=-200&&code>=-299)return 'Koneksi aman ke '+name+' tidak dapat diverifikasi. Periksa tanggal perangkat atau coba jaringan lain.';return name+' belum dapat terhubung. Periksa koneksi internet, lalu coba lagi.';}
 return {friendly,connection};
});
