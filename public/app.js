/* ===================== STATE & HELPERS ===================== */
const KEY='sapAkademiV2';
let S={les:{},mq:{},quiz:{},sims:{},cards:{},cases:{},check:{},notes:{},simMode:'guided'};
try{const r=localStorage.getItem(KEY); if(r) S=Object.assign(S,JSON.parse(r));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tc=c=>`<span class="tc">${c}</span>`;
const rp=n=>'Rp '+Math.round(n).toLocaleString('id-ID');
const norm=v=>String(v??'').trim().toUpperCase().replace(/\s+/g,'');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const cp=(q,o,a,e)=>({q,o,a,e});

/* ===================== MODULES (lessons + checkpoints) ===================== */
const LEGACY_MODS=[
{id:1,title:'Navigasi SAP GUI',dur:'25 mnt',sum:'Login, layar SAP, status bar, command field, tombol fungsi, multiple selection, variant, dan export.',tcs:['/n','/o','F4','F8'],
note:'Tulis dengan kata-katamu: kapan kamu memakai /n dan kapan /o? Variant apa yang akan kamu buat untuk laporan mingguanmu?',
objs:['Login ke sistem yang benar (client, user, bahasa)','Mengenali bagian layar SAP dan membaca status bar','Pindah transaksi dengan /n dan /o','Memakai F4, F8, F3, Ctrl+S, multiple selection, dan variant'],
lessons:[
{t:'Login lewat SAP Logon',html:`
<ol class="steps">
<li>Buka <b>SAP Logon 64</b>, pilih sistem. Biasanya ada <b>PRD</b> (produksi, data asli), <b>QAS</b> (testing), dan <b>DEV</b> (development). Kerja harian memakai PRD. Untuk latihan, minta akses QAS/training ke tim IT.</li>
<li>Isi <b>Client</b> (3 digit, misalnya 100), <b>User</b>, <b>Password</b>, dan <b>Language</b> (EN atau ID, sesuai tim).</li>
<li>Jika muncul pesan <i>"User already logged on"</i>, lanjutkan tanpa menutup sesi lain hanya jika kamu yakin sesi lama milikmu.</li>
</ol>
<div class="callout warn"><b>Jangan berbagi user</b>Setiap posting di SAP tercatat atas nama user. GR, GI, dan opname yang diposting dengan user orang lain akan menyulitkan audit.</div>`,
keys:['PRD = data asli, QAS = latihan/testing','Client + user + password + bahasa','Satu user untuk satu orang'],
cp:cp('Kamu ingin mencoba-coba membuat PR tanpa takut mengganggu data asli. Sistem mana yang sebaiknya dipakai?',['PRD','QAS / client training','Sistem mana saja sama','DEV milik programmer'],1,'QAS/training dibuat untuk latihan dan testing. PRD berisi data asli.')},
{t:'Anatomi layar & status bar',html:`
<p>Setiap layar SAP punya susunan yang sama. Coba kenali bagiannya dengan mengklik area yang diminta pada layar di bawah.</p>
<div data-widget="hotspot"></div>
<p>Status bar di bagian paling bawah adalah teman terbaikmu. Warnanya memberi arti:</p>
<div class="tbl-wrap"><table><tr><th>Tipe</th><th>Arti</th><th>Yang harus dilakukan</th></tr>
<tr><td><span class="pill ok">S – Success</span></td><td>Berhasil, biasanya menampilkan nomor dokumen</td><td>Catat nomor dokumen ke database/tracker</td></tr>
<tr><td><span class="pill warn">W – Warning</span></td><td>Boleh lanjut, tapi ada yang perlu dicek</td><td>Baca dulu, lalu tekan Enter untuk melanjutkan</td></tr>
<tr><td><span class="pill bad">E – Error</span></td><td>Tidak bisa disimpan</td><td>Perbaiki field yang disorot</td></tr>
<tr><td><span class="pill ac">I – Info</span></td><td>Informasi, sering muncul sebagai popup</td><td>Baca, lalu Enter</td></tr>
</table></div>`,
keys:['Command field di kiri atas untuk mengetik T-code','Title bar menunjukkan transaksi yang sedang dibuka','Status bar: S hijau, W kuning (Enter untuk lanjut), E merah (perbaiki)'],
cp:cp('Saat Save, status bar menampilkan pesan kuning "Delivery date cannot be met". Apa yang terjadi dan apa yang kamu lakukan?',['Dokumen gagal total, ulang dari awal','Ini warning: baca, lalu Enter untuk melanjutkan bila memang benar','Abaikan dan tutup SAP','Telepon IT'],1,'Warning (W) tidak memblokir. Baca pesannya, pastikan benar, lalu tekan Enter untuk melanjutkan penyimpanan.')},
{t:'Command field: /n dan /o',html:`
<div class="tbl-wrap"><table><tr><th>Ketik</th><th>Fungsi</th><th>Contoh</th></tr>
<tr><td><code>/n</code> + T-code</td><td>Tutup transaksi sekarang, buka yang baru di jendela yang sama</td><td><code>/nMB52</code></td></tr>
<tr><td><code>/o</code> + T-code</td><td>Buka di jendela (session) baru, yang lama tetap terbuka</td><td><code>/oME23N</code></td></tr>
<tr><td><code>/n</code></td><td>Keluar dari transaksi, kembali ke Easy Access</td><td>–</td></tr>
<tr><td><code>/nend</code></td><td>Logoff (dengan konfirmasi)</td><td>–</td></tr>
<tr><td><code>/nex</code></td><td>Logoff langsung <b>tanpa konfirmasi</b> dan tanpa simpan</td><td>Hindari</td></tr>
</table></div>
<div class="callout"><b>Kenapa harus /n?</b>Saat kamu sudah berada di dalam transaksi (misalnya ME23N), mengetik <code>MB52</code> saja tidak akan jalan. Ketik <code>/nMB52</code>. Di layar awal Easy Access, T-code tanpa /n tetap bisa. Kamu juga bisa membuka transaksi dari pohon <b>SAP menu</b> atau folder <b>Favorites</b>.</div>`,
keys:['Dari dalam transaksi wajib /n atau /o','/o = jendela baru, data di jendela lama tidak hilang','/nex menutup semua tanpa simpan'],
cp:cp('Kamu sedang mengisi MIGO (belum disimpan) dan perlu mengecek stok di MMBE tanpa kehilangan isian. Ketik apa?',['/nMMBE','/oMMBE','MMBE','/nex'],1,'/o membuka MMBE di jendela baru, jadi isian MIGO di jendela lama aman. /n akan menutup MIGO.')},
{t:'Tombol fungsi',html:`
<div class="tbl-wrap"><table><tr><th>Tombol</th><th>Fungsi</th></tr>
<tr><td><code>Enter</code></td><td>Validasi isian dan memuat data otomatis (misalnya deskripsi material, item dari PO)</td></tr>
<tr><td><code>F4</code></td><td>Daftar pilihan (search help) untuk field: cari material, vendor, WBS</td></tr>
<tr><td><code>F8</code></td><td>Execute, menjalankan laporan</td></tr>
<tr><td><code>Ctrl+S</code></td><td>Save/Post dokumen. Di layar filter laporan, Ctrl+S menyimpan variant</td></tr>
<tr><td><code>F3</code></td><td>Back, kembali satu layar</td></tr>
<tr><td><code>Shift+F3</code> / <code>F12</code></td><td>Exit / Cancel</td></tr>
<tr><td><code>F1</code></td><td>Penjelasan arti sebuah field</td></tr>
</table></div>
<p>Kebiasaan yang baik: setelah mengisi field kunci (material, nomor PO), tekan <b>Enter</b> dulu. SAP akan mengisi data pendukung dan langsung memberi tahu jika ada yang salah.</p>`,
keys:['Enter dulu, baru Save','F4 saat lupa kode','F8 untuk menjalankan laporan'],
cp:cp('Kamu lupa nomor material bearing yang mau di-PR. Cara tercepat menemukannya di field Material?',['Tanya gudang lewat telepon','Taruh kursor di field lalu tekan F4 dan cari "6205"','Ketik angka acak lalu Save','Tekan F8'],1,'F4 membuka search help. Kamu bisa mencari dengan potongan deskripsi.')},
{t:'Multiple selection & variant',html:`
<h3>Multiple selection: tempel banyak nomor dari Excel</h3>
<ol class="steps">
<li>Di Excel, blok satu kolom nomor PO atau material, lalu <b>Ctrl+C</b>.</li>
<li>Di layar filter laporan (misalnya ME2N), klik ikon panah kanan (<b>Multiple selection</b>) di samping field.</li>
<li>Di tab <i>Select Single Values</i>, klik <b>Upload from clipboard</b> (Shift+F12).</li>
<li>Klik <b>Copy</b> (F8) untuk kembali. Ikon panah berubah hijau tanda filter aktif. Lalu F8.</li>
</ol>
<h3>Variant: simpan filter laporan</h3>
<ol class="steps">
<li>Isi filter yang sering dipakai, misalnya ME2N dengan Purchasing Group P05, Plant 1100, WE101.</li>
<li>Tekan <b>Ctrl+S</b> di layar filter (atau Goto → Variants → Save as Variant).</li>
<li>Beri nama dan deskripsi yang jelas, misalnya <code>ZPO_OPEN_P05</code> "PO proyek belum GR".</li>
<li>Minggu depan klik <b>Get Variant</b> (Shift+F5), pilih, lalu F8.</li>
</ol>`,
keys:['Multiple selection = tempel banyak nomor sekaligus','Variant = simpan filter laporan rutin','Ctrl+S di layar filter = Save as Variant'],
cp:cp('Setiap Senin kamu menjalankan ME2N dengan filter yang sama. Supaya tidak mengetik ulang, kamu…',['Screenshot filter','Menyimpan variant lalu memanggilnya dengan Get Variant','Membuka 5 session','Minta IT membuat T-code baru'],1,'Variant menyimpan isian filter laporan.')},
{t:'Export ke Excel & Favorites',html:`
<p>Hampir semua laporan list di SAP memakai tampilan <b>ALV</b>: tabel dengan toolbar untuk sort, filter, total (Σ), dan export. Langkah yang sering dipakai:</p>
<ul><li><b>Klik judul kolom</b> untuk memilih kolom, lalu tombol <b>Sort ascending/descending</b>.</li><li><b>Filter</b> untuk menyaring isi kolom, misalnya hanya WBS tertentu.</li><li><b>Σ Total</b> pada kolom angka untuk menjumlahkan, misalnya total biaya.</li><li><b>Export → Spreadsheet</b> (atau menu List → Export → Spreadsheet) untuk membuat file Excel laporan mingguan.</li></ul>
<p>Tambahkan T-code harian ke <b>Favorites</b>: klik kanan folder Favorites → <i>Insert transaction</i>. Semua ini bisa kamu coba di simulator.</p>`,
keys:['ALV: pilih kolom → sort/filter/Σ','Export → Spreadsheet untuk laporan','Favorites untuk T-code harian'],
cp:cp('Di laporan CJI3 kamu ingin tahu total biaya semua baris. Tombol ALV yang dipakai?',['Sort','Σ Total setelah memilih kolom nilai','Export','Filter'],1,'Pilih kolom nilai, lalu Σ untuk menampilkan total.')}
],
quiz:[
{q:'Kamu sedang di ME23N dan ingin membuka MB52 di jendela yang sama. Apa yang diketik?',o:['MB52','/nMB52','/oMB52','/exMB52'],a:1,e:'/n menutup transaksi aktif dan membuka MB52 di jendela yang sama.'},
{q:'Tombol untuk menjalankan (execute) laporan adalah…',o:['F3','F4','F8','F12'],a:2,e:'F8 = Execute.'},
{q:'Kamu punya 40 nomor PO di Excel dan ingin melihat semuanya di ME2N. Cara tercepat?',o:['Ketik satu per satu','Multiple selection → Upload from clipboard','Minta Procurement mengirim','Pakai /o 40 kali'],a:1,e:'Multiple selection menerima tempelan dari clipboard.'},
{q:'Status bar menampilkan pesan merah (E). Artinya?',o:['Data tersimpan','Ada isian yang harus diperbaiki sebelum bisa lanjut','Hanya informasi','SAP akan logoff'],a:1,e:'E = error: dokumen belum bisa disimpan.'},
{q:'Setelah mengisi nomor material di ME51N, kebiasaan yang baik adalah…',o:['Langsung Save','Tekan Enter agar deskripsi dan satuan terisi dan dicek','Tekan F8','Tutup transaksi'],a:1,e:'Enter memvalidasi dan memuat data dari master.'}
]},
{id:2,title:'Data Induk & Struktur Organisasi',dur:'20 mnt',sum:'Material, vendor, plant/sloc, cost center, WBS, internal order, aset, dan account assignment.',tcs:['MM03','KS03','CJ13','AS03'],
note:'Catat kode asli di perusahaanmu: company code, plant, storage location gudang proyek, purchasing group proyek, dan format WBS.',
objs:['Membedakan master data dan transaction data','Membaca struktur Company Code → Plant → Storage Location','Memilih account assignment yang benar (K, P, F, A)'],
lessons:[
{t:'Master data vs transaction data',html:`
<p><b>Master data</b> adalah data induk yang jarang berubah dan dipakai berulang: material, vendor, cost center, WBS, aset. <b>Transaction data</b> adalah dokumen yang dibuat setiap hari dan merujuk ke master data: PR, PO, GR, GI, invoice.</p>
<p>Kalau master datanya salah (material duplikat, satuan keliru), semua transaksi setelahnya ikut salah. Biasakan cek master data di ${tc('MM03')} sebelum membuat PR.</p>`,
keys:['Master data = induk, transaction data = dokumen harian','Kesalahan master data menular ke semua dokumen'],
cp:cp('Mana yang termasuk transaction data?',['Vendor PT Mitra Teknik','Material 300012457','PO 4500021873','Cost center 11PRD310'],2,'PO adalah dokumen transaksi.')},
{t:'Struktur organisasi',html:`
<div class="tbl-wrap"><table><tr><th>Level</th><th>Contoh</th><th>Keterangan</th></tr>
<tr><td>Company Code</td><td><code>1000</code> PT JACIWEY Indonesia</td><td>Entitas legal untuk laporan keuangan</td></tr>
<tr><td>Plant</td><td><code>1100</code> Pabrik Cikarang</td><td>Lokasi pabrik</td></tr>
<tr><td>Storage Location</td><td><code>1101</code> Gudang Sparepart, <code>1102</code> Gudang Proyek</td><td>Lokasi stok di dalam plant</td></tr>
<tr><td>Purchasing Organization</td><td><code>1000</code> Pembelian JACIWEY</td><td>Unit yang bernegosiasi dan berkontrak dengan vendor</td></tr>
<tr><td>Purchasing Group</td><td><code>P05</code> Project & Engineering</td><td>Buyer/kelompok pembelian</td></tr>
</table></div>
<div class="callout warn"><b>Kode contoh</b>Semua kode di platform ini fiktif. Catat kode asli perusahaanmu saat onboarding.</div>`,
keys:['Company code → Plant → Storage location','Purchasing group = tim buyer'],
cp:cp('"Gudang Proyek" di dalam Pabrik Cikarang adalah contoh…',['Company code','Plant','Storage location','Purchasing group'],2,'Storage location adalah lokasi stok di dalam plant.')},
{t:'Master data yang kamu baca',html:`
<div class="tbl-wrap"><table><tr><th>Data</th><th>Contoh</th><th>Lihat di</th><th>Dipakai untuk</th></tr>
<tr><td>Material</td><td><code>300012457</code> Bearing SKF 6205-2RS</td><td>${tc('MM03')}</td><td>PR, PO, GR, GI, stok</td></tr>
<tr><td>Vendor</td><td><code>100118</code> PT Mitra Teknik Abadi</td><td>${tc('XK03')} / ${tc('BP')}</td><td>PO, invoice</td></tr>
<tr><td>Cost center</td><td><code>11PRD310</code> Produksi Line 3</td><td>${tc('KS03')}</td><td>Biaya rutin/OPEX</td></tr>
<tr><td>WBS element</td><td><code>P-26-014.02</code> Material Mekanikal</td><td>${tc('CJ13')}</td><td>Biaya proyek</td></tr>
<tr><td>Internal order</td><td><code>700000231</code> Improvement Line 2</td><td>${tc('KO03')}</td><td>Proyek kecil</td></tr>
<tr><td>Asset</td><td><code>4000012-0</code> AuC Mesin Filling</td><td>${tc('AS03')}</td><td>CAPEX</td></tr>
<tr><td>Equipment</td><td><code>10004521</code> Conveyor L3</td><td>${tc('IE03')}</td><td>Data mesin</td></tr>
</table></div>
<p>Di ${tc('MM03')}, setelah mengisi nomor material dan Enter, SAP meminta kamu memilih <b>view</b> (Basic Data 1, Purchasing, MRP, dll.). Basic Data 1 berisi deskripsi, <b>base unit</b>, dan material group. View Purchasing butuh plant.</p>`,
keys:['MM03 → pilih view (Basic Data 1, Purchasing)','Base unit menentukan satuan di PR/PO'],
cp:cp('Kamu ingin tahu satuan dasar (base unit) material. View mana yang dibuka di MM03?',['Accounting 1','Basic Data 1','MRP 1','Tidak ada'],1,'Base unit ada di Basic Data 1.')},
{t:'Account assignment: ke mana biayanya pergi',html:`
<div class="tbl-wrap"><table><tr><th>Kode</th><th>Dibebankan ke</th><th>Kapan dipakai</th></tr>
<tr><td><b>K</b></td><td>Cost center</td><td>Pembelian rutin/OPEX</td></tr>
<tr><td><b>P</b></td><td>Project (WBS element)</td><td>Material/jasa proyek berstruktur WBS</td></tr>
<tr><td><b>F</b></td><td>Order</td><td>Improvement kecil atau work order PM</td></tr>
<tr><td><b>A</b></td><td>Asset (termasuk AuC)</td><td>Pembelian yang langsung dikapitalisasi</td></tr>
<tr><td><i>kosong</i></td><td>Stok gudang</td><td>Masuk stok dulu, biaya muncul saat GI</td></tr>
</table></div>
<div class="callout"><b>Contoh praktik</b>Bearing 300012457 untuk penggantian rutin oleh maintenance: <b>K</b> ke cost center Line 3. Bearing yang sama untuk proyek conveyor baru: <b>P</b> ke WBS P-26-014.02. Materialnya sama, laporan biayanya berbeda.</div>`,
keys:['K cost center, P WBS, F order, A asset','Proyek CAPEX jangan pakai K'],
cp:cp('PR grease untuk pelumasan rutin mesin produksi Line 3. Account assignment?',['P – WBS','K – Cost center','A – Asset','F – Order'],1,'Biaya rutin/OPEX ke cost center (K).')}
],
quiz:[
{q:'PR motor baru untuk proyek conveyor (punya WBS) memakai account assignment…',o:['K','P','Kosong','F'],a:1,e:'P agar biaya masuk WBS dan terbaca di CJI3.'},
{q:'Untuk melihat detail material master dipakai…',o:['MM03','MB52','ME23N','KS03'],a:0,e:'MM03 = Display Material.'},
{q:'Manakah yang termasuk transaction data?',o:['Vendor','Cost center','Purchase Order','Material number'],a:2,e:'PO adalah dokumen transaksi.'},
{q:'Gudang Proyek di dalam Plant 1100 adalah…',o:['Company code','Storage location','Purchasing group','Cost center'],a:1,e:'Storage location.'},
{q:'Kenapa sebaiknya cek master data sebelum membuat PR?',o:['Supaya cepat di-approve','Kesalahan master data terbawa ke semua transaksi berikutnya','Wajib dicetak','Agar vendor tahu'],a:1,e:'Kesalahan master data merusak PO, GR, stok, dan laporan biaya.'}
]},
{id:3,title:'Alur Pembelian: Procure to Pay',dur:'35 mnt',sum:'PR → PO → GR/SES → Invoice → 3-way match → Payment, cara mengisi ME51N, dan memantau PO.',tcs:['ME51N','ME5A','ME21N','ME23N','ME2N','MIRO'],
note:'Tuliskan alur PR → bayar versi perusahaanmu: siapa approver PR, siapa buyer, dan berapa lama biasanya tiap tahap.',
objs:['Menjelaskan alur PR sampai pembayaran beserta pemilik tiap langkah','Mengisi ME51N: tabel item dan tab detail','Membaca PO history di ME23N','Memahami 3-way match'],
lessons:[
{t:'Peta alur procure to pay',html:`<p>Klik setiap langkah. Perhatikan siapa yang mengerjakan dan apa yang perlu kamu cek.</p><div data-widget="flow" data-flow="p2p"></div>`,
keys:['Kamu membuat PR, Procurement membuat PO, Gudang GR, Finance invoice & bayar','Pantau setiap tahap, jangan hanya menunggu'],
cp:cp('Siapa yang biasanya membuat PO di ME21N?',['Gudang','Procurement','Finance','Vendor'],1,'Procurement mengubah PR yang sudah di-approve menjadi PO.')},
{t:'Mengisi ME51N',html:`
<p>Layar ${tc('ME51N')} terdiri dari tiga bagian:</p>
<ol class="steps">
<li><b>Header</b>: jenis dokumen (NB = Purchase Requisition).</li>
<li><b>Item Overview</b>: tabel, satu baris per material. Kolom penting: <b>A</b> (account assignment), Material, Quantity, Deliv. Date, Plant, SLoc, PGr. Setelah mengisi material tekan <b>Enter</b> agar Short Text dan satuan terisi.</li>
<li><b>Item Detail</b>: tab untuk item yang dipilih. Karena A = P, SAP meminta <b>WBS element</b> di tab <b>Account Assignment</b>. Nama pemohon diisi di tab <b>Contact Person</b> (Requisitioner).</li>
</ol>
<p>Jika tanggal butuh lebih cepat dari lead time, SAP memberi <b>warning</b> kuning. PR tetap bisa disimpan setelah Enter, tapi kabari Procurement bahwa barang mendesak.</p>
<div class="callout"><b>Praktik</b>Skenario "Buat PR material proyek" di simulator melatih persis langkah ini.</div>`,
keys:['Header → Item Overview → Item Detail','A = P → WBS di tab Account Assignment','Enter sebelum Save'],
cp:cp('Kamu mengisi A = P di item PR. Di mana WBS element diisi?',['Di header','Di tab Account Assignment pada Item Detail','Di kolom Short Text','Tidak perlu'],1,'WBS diisi di tab Account Assignment.')},
{t:'Nomor dokumen',html:`
<div class="tbl-wrap"><table><tr><th>Dokumen</th><th>Contoh nomor</th><th>T-code lihat</th></tr>
<tr><td>Purchase Requisition</td><td><code>10004587</code></td><td>${tc('ME53N')}</td></tr>
<tr><td>Purchase Order</td><td><code>4500021873</code></td><td>${tc('ME23N')}</td></tr>
<tr><td>Material document GR/GI</td><td><code>5000187342</code> / <code>4900061520</code></td><td>${tc('MIGO')} / ${tc('MB03')}</td></tr>
<tr><td>Service Entry Sheet</td><td><code>1000034561</code></td><td>${tc('ML81N')}</td></tr>
<tr><td>Invoice</td><td><code>5105600123</code></td><td>${tc('MIR4')}</td></tr>
</table></div>
<p>Range nomor berbeda di tiap perusahaan, tapi setiap jenis dokumen punya awalan sendiri. Catat semua nomor di tracker proyek supaya satu pembelian bisa dilacak dari awal sampai bayar.</p>`,
keys:['10… PR, 45… PO, 50…/49… material document','Catat nomor dokumen di tracker'],
cp:cp('Vendor menyebut nomor "4500021880". Itu kemungkinan besar nomor…',['PR','PO','Invoice','Aset'],1,'Awalan 45 umumnya PO. Cek di ME23N.')},
{t:'Membaca PO History',html:`
<p>Di ${tc('ME23N')}, klik <b>Other Purchase Order</b> (Shift+F5) untuk membuka PO lain. Pilih item, lalu buka tab <b>Purchase Order History</b> di Item Detail.</p>
<div class="tbl-wrap"><table><tr><th>Kategori</th><th>Arti</th></tr>
<tr><td><b>WE</b></td><td>Goods receipt (movement 101). Barang sudah diterima.</td></tr>
<tr><td><b>RE-L</b></td><td>Invoice sudah diposting di MIRO.</td></tr>
<tr><td><b>Lerf</b></td><td>Service entry sheet untuk jasa sudah dibuat.</td></tr>
</table></div>
<p>Kalau tab PO History tidak muncul, berarti belum ada GR maupun invoice.</p>`,
keys:['ME23N → Other Purchase Order → tab PO History','WE = GR, RE-L = invoice'],
cp:cp('Vendor bertanya apakah invoicenya sudah diproses. Di PO history kamu mencari kategori…',['WE','RE-L','BANF','ME'],1,'RE-L menandakan invoice sudah diposting.')},
{t:'3-way match',html:`
<p>Finance hanya membayar jika <b>PO</b> (yang dipesan), <b>GR</b> (yang diterima), dan <b>Invoice</b> (yang ditagih) cocok. Kalau qty invoice lebih dari qty GR, atau harga di luar toleransi, invoice <b>blocked for payment</b>. Coba sendiri:</p>
<div data-widget="match3"></div>`,
keys:['Qty invoice ≤ qty GR','Harga invoice dalam toleransi PO','Kalau blocked: cari penyebab di PO history'],
cp:cp('PO 10 pcs, GR 10 pcs, invoice 10 pcs tetapi harga 8% lebih mahal (toleransi 2%). Hasilnya?',['Siap dibayar','Blocked karena harga di luar toleransi','PO dibatalkan','Stok bertambah'],1,'Selisih harga di luar toleransi juga memblokir invoice.')},
{t:'Memantau PR dan PO',html:`
<div class="tbl-wrap"><table><tr><th>Kebutuhan</th><th>T-code</th><th>Tips</th></tr>
<tr><td>Status PR (approve? sudah PO?)</td><td>${tc('ME5A')}</td><td>Isi Purchasing Group atau WBS</td></tr>
<tr><td>PO yang belum diterima</td><td>${tc('ME2N')} / ${tc('ME2L')}</td><td>Selection parameters <code>WE101</code></td></tr>
<tr><td>PO per material</td><td>${tc('ME2M')}</td><td>Isi material number</td></tr>
<tr><td>Detail satu PO</td><td>${tc('ME23N')}</td><td>Tab PO History</td></tr>
</table></div>
<p>Di hasil ME2N, sort kolom <b>Deliv. Date</b> agar PO yang terlambat terlihat paling atas.</p>`,
keys:['ME5A untuk PR','ME2N + WE101 untuk PO belum datang','Sort tanggal kirim untuk prioritas follow up'],
cp:cp('Selection parameter di ME2N untuk PO yang belum diterima?',['WE101','RE101','PO101','GR001'],0,'WE101 = open goods receipt.')},
{t:'Barang vs jasa',html:`
<p>Barang diterima dengan ${tc('MIGO')} movement 101. Jasa (instalasi, commissioning) memakai <b>Service Entry Sheet</b> di ${tc('ML81N')} setelah pekerjaan selesai dan ada BAST. Di S/4HANA perusahaanmu mungkin memakai aplikasi Fiori <i>Manage Service Entry Sheets</i>.</p>
<div class="callout bad"><b>Kesalahan umum</b>Posting GR sebelum barang dicek fisik, qty GR lebih banyak dari surat jalan, atau PR tanpa WBS yang benar.</div>`,
keys:['Barang → MIGO 101','Jasa → Service Entry Sheet + BAST'],
cp:cp('Vendor jasa instalasi sudah selesai bekerja. Penerimaannya dicatat di…',['MIGO 101','ML81N service entry','MB52','MI04'],1,'Jasa memakai service entry sheet.')}
],
quiz:[
{q:'Di PO history, kategori "WE" berarti…',o:['Invoice diposting','Goods receipt sudah dilakukan','PO dihapus','PR di-release'],a:1,e:'WE = goods receipt.'},
{q:'Qty invoice 10, GR 8. Status invoice?',o:['Dibayar penuh','Blocked for payment','Otomatis dibatalkan','Dibayar 8'],a:1,e:'Qty invoice melebihi GR.'},
{q:'Untuk melihat apakah PR sudah dijadikan PO, kamu memakai…',o:['ME5A / ME53N','MB52','MI20','AS03'],a:0,e:'ME5A/ME53N menampilkan status dan nomor PO.'},
{q:'ME51N: setelah mengisi material, apa yang membuat Short Text terisi?',o:['Save','Enter','F8','F3'],a:1,e:'Enter memuat data dari material master.'},
{q:'Siapa yang menjalankan MIRO?',o:['Admin proyek','Gudang','Finance (AP)','Vendor'],a:2,e:'Verifikasi invoice adalah tugas Finance.'}
]},
{id:4,title:'MIGO & Movement Type',dur:'30 mnt',sum:'Layar MIGO, movement type 101/201/221/261/311, dan cara membatalkan dokumen yang salah.',tcs:['MIGO','MB51','MB03'],
note:'Buat contoh situasi nyata di proyekmu untuk masing-masing movement type 101, 201, 221, 261, 311.',
objs:['Membaca layar MIGO: baris atas, header, item overview, item detail','Memilih movement type yang tepat','Membatalkan dokumen yang salah dengan benar'],
lessons:[
{t:'Mengenal layar MIGO',html:`
<ol class="steps">
<li><b>Baris atas</b>: dropdown <b>Action</b> (A01 Goods Receipt, A07 Goods Issue, A08 Transfer Posting, A03 Cancellation, A04 Display), dropdown <b>Reference</b> (R01 Purchase Order, R02 Material Document, R10 Other), nomor dokumen referensi, dan movement type.</li>
<li><b>Header</b> tab General: Document Date, Posting Date, <b>Delivery Note</b> (isi nomor surat jalan), Header Text.</li>
<li><b>Item Overview</b>: tabel item. Untuk GR terhadap PO, setelah nomor PO diisi dan <b>Enter</b>, item terisi otomatis dari PO. Ubah qty sesuai barang yang benar-benar datang.</li>
<li><b>Item Detail</b>: tab Material, Quantity, Where (plant, sloc), Account Assignment (WBS/cost center untuk GI), Purchase Order Data. Centang <b>Item OK</b>.</li>
<li>Klik <b>Check</b>. Jika status bar menampilkan "Document is O.K.", klik <b>Post</b> (Ctrl+S).</li>
</ol>
<div class="callout warn"><b>Default movement type</b>MIGO mengisi movement type otomatis dari pilihan Action: A01 + R01 → 101, A07 + R10 → <b>201</b>. Untuk pengeluaran ke proyek kamu harus mengubahnya ke 221.</div>`,
keys:['Action + Reference + nomor dokumen + movement type','Enter setelah nomor PO → item terisi','Qty sesuai surat jalan, Item OK, Check, Post'],
cp:cp('Gudang menerima 8 dari 10 pcs yang dipesan. Setelah MIGO mengisi item dari PO (10 pcs), kamu…',['Langsung Post 10','Ubah qty menjadi 8 sesuai surat jalan, lalu Item OK, Check, Post','Batalkan MIGO','Buat PO baru'],1,'GR harus sesuai barang yang benar-benar diterima.')},
{t:'Movement type wajib hafal',html:`
<div class="tbl-wrap"><table><tr><th>Mvt</th><th>Arti</th><th>Wajib diisi</th><th>Contoh di proyek</th><th>Batal</th></tr>
<tr><td><b>101</b></td><td>GR terhadap PO</td><td>Nomor PO</td><td>Bearing dari vendor diterima gudang</td><td>102</td></tr>
<tr><td><b>201</b></td><td>GI ke cost center</td><td>Cost center</td><td>Oli untuk perawatan rutin Line 3</td><td>202</td></tr>
<tr><td><b>221</b></td><td>GI ke proyek/WBS</td><td>WBS element</td><td>Bearing dipasang di conveyor proyek</td><td>222</td></tr>
<tr><td><b>261</b></td><td>GI ke order</td><td>Order number</td><td>Sparepart untuk work order PM</td><td>262</td></tr>
<tr><td><b>311</b></td><td>Transfer antar sloc</td><td>Sloc tujuan</td><td>Gudang Sparepart → Gudang Proyek</td><td>312</td></tr>
</table></div>
<p>Polanya: movement pembatalan biasanya <b>angka berikutnya</b> (101→102, 221→222).</p>`,
keys:['101 GR · 201 cost center · 221 WBS · 261 order · 311 transfer','Batal = +1'],
cp:cp('Material diambil dari gudang dan dipasang di proyek berstruktur WBS. Movement type?',['201','221','261','311'],1,'221 = GI ke project/WBS.')},
{t:'Latihan memilih movement type',html:`<div data-widget="mvpick"></div>`,
keys:['Lihat ke mana biaya harus masuk, lalu pilih movement type'],
cp:cp('Material proyek dipindah dari Gudang Sparepart 1101 ke Gudang Proyek 1102 (plant sama). Movement type?',['101','201','311','221'],2,'311 = transfer antar storage location.')},
{t:'Membatalkan dokumen yang salah',html:`
<ol class="steps">
<li>Cari nomor dokumen yang salah di ${tc('MB51')} (filter material, movement type, tanggal).</li>
<li>Buka ${tc('MIGO')} → Action <b>A03 Cancellation</b> → Reference <b>R02 Material Document</b> → masukkan nomor dokumen → Enter.</li>
<li>Centang Item OK, Check, lalu Post. SAP membuat dokumen pembalik (misalnya 222 untuk 221).</li>
<li>Posting ulang dengan data yang benar. Catat kedua nomor dokumen dan alasannya di tracker.</li>
</ol>
<div class="callout warn"><b>Batas periode</b>Jika periode posting sudah ditutup Finance, koordinasikan dulu sebelum mengoreksi.</div>
<div class="callout bad"><b>Kesalahan paling mahal</b>Mengeluarkan material proyek dengan 201. Biayanya tidak muncul di CJI3 dan biaya produksi jadi lebih mahal.</div>`,
keys:['MB51 cari dokumen → MIGO A03 + R02','Posting ulang dengan benar, catat alasan'],
cp:cp('Di MIGO, kombinasi untuk membatalkan dokumen material adalah…',['A01 + R01','A03 Cancellation + R02 Material Document','A07 + R10','A04 + R01'],1,'A03 + R02 dengan nomor material document.')}
],
quiz:[
{q:'Pindah stok dari 1101 ke 1102 di plant yang sama?',o:['101','201','311','261'],a:2,e:'311.'},
{q:'Movement pembatalan untuk 101 adalah…',o:['102','201','122','111'],a:0,e:'102.'},
{q:'MIGO A07 + R10 mengisi movement default 201. Untuk proyek kamu harus…',o:['Membiarkan 201','Mengganti ke 221 dan mengisi WBS di tab Account Assignment','Mengganti ke 101','Mengisi PO'],a:1,e:'221 + WBS.'},
{q:'Tombol di MIGO untuk memeriksa dokumen tanpa memposting?',o:['Check','Post','Hold','Exit'],a:0,e:'Check → "Document is O.K."'},
{q:'Sparepart untuk work order maintenance 4000123 dikeluarkan dengan…',o:['261','201','221','101'],a:0,e:'261 = GI ke order.'}
]},
{id:5,title:'Inventory & Stock Opname',dur:'30 mnt',sum:'MB52, MMBE, MB51 dan alur opname MI01 sampai MI07.',tcs:['MB52','MMBE','MB51','MI01','MI04','MI20'],
note:'Tulis SOP opname versimu: kapan cut-off, siapa tim hitung, siapa yang boleh menjalankan MI07, dan dokumen apa yang dilampirkan.',
objs:['Memilih laporan stok yang tepat','Menjalankan alur opname dari dokumen sampai selisih','Menyiapkan opname supaya selisih kecil'],
lessons:[
{t:'Tiga laporan stok',html:`
<div class="tbl-wrap"><table><tr><th>T-code</th><th>Menjawab pertanyaan</th><th>Tips</th></tr>
<tr><td>${tc('MB52')}</td><td>"Apa saja stok di Gudang 1101?"</td><td>Filter plant + sloc, export ke Excel</td></tr>
<tr><td>${tc('MMBE')}</td><td>"Bearing 300012457 ada di mana saja?"</td><td>Satu material, semua lokasi dan tipe stok</td></tr>
<tr><td>${tc('MB51')}</td><td>"Siapa mengambil bearing ini, kapan, ke WBS mana?"</td><td>Filter material + movement type + tanggal</td></tr>
</table></div>
<p>Tipe stok: <b>Unrestricted</b> (bebas dipakai), <b>Quality Inspection</b> (menunggu QC), <b>Blocked</b> (ditahan).</p>`,
keys:['MB52 per gudang','MMBE per material','MB51 riwayat pergerakan'],
cp:cp('Ingin tahu riwayat siapa saja yang mengeluarkan material tertentu ke WBS bulan ini?',['MMBE','MB52','MB51','MI01'],2,'MB51 menampilkan daftar material document.')},
{t:'Alur opname',html:`<p>Klik setiap langkah.</p><div data-widget="flow" data-flow="opname"></div>`,
keys:['MI01 → MI21 → hitung → MI04 → MI11 → MI20 → MI07','Posting block membekukan stok buku'],
cp:cp('Apa fungsi Posting Block di MI01?',['Menghapus stok','Membekukan GR/GI pada item selama opname','Mengunci user','Membuat PO'],1,'Posting block mencegah pergerakan barang pada item selama penghitungan.')},
{t:'Persiapan sebelum hari H',html:`<div data-widget="check" data-list="prepOpname"></div>`,
keys:['Semua GR/GI diposting sebelum cut-off','Tim dua orang, lokasi berlabel'],
cp:cp('Kenapa semua GI harus diposting sebelum dokumen opname dibuat?',['Supaya laporan rapi','Agar stok buku akurat; GI yang tertunda akan terlihat sebagai selisih palsu','Wajib dari vendor','Tidak penting'],1,'Transaksi tertunda membuat stok buku tidak sama dengan fisik.')},
{t:'Hitung buta & menangani selisih',html:`
<p>Lembar hitung dari ${tc('MI21')} sengaja tidak menampilkan qty buku, agar tim mencatat apa yang benar-benar ada. Selisih baru terlihat di ${tc('MI20')}.</p>
<ol class="steps"><li>Selisih besar → hitung ulang (${tc('MI11')}).</li><li>Cek ${tc('MB51')}: ada pengambilan yang belum di-GI?</li><li>Buat berita acara dan minta approval.</li><li>${tc('MI07')} dijalankan oleh user berwenang.</li></ol>
<div class="callout bad"><b>Jangan</b>Menambal selisih dengan GR palsu atau menghapus item dari dokumen opname.</div>`,
keys:['Hitung buta agar jujur','Selisih → recount → investigasi → berita acara → MI07'],
cp:cp('MI20 menunjukkan selisih -1 pcs. Langkah pertama?',['Langsung MI07','Investigasi: recount MI11 dan cek MB51','GR 101 agar cocok','Hapus dokumen'],1,'Investigasi dulu, baru posting setelah approval.')}
],
quiz:[
{q:'Dokumen opname dibuat dengan…',o:['MI04','MI01','MI07','MI20'],a:1,e:'MI01.'},
{q:'Daftar selisih sebelum diposting dilihat di…',o:['MI20','MI21','MB52','MI11'],a:0,e:'MI20.'},
{q:'Stok yang menunggu pemeriksaan QC masuk tipe…',o:['Unrestricted','Quality Inspection','Blocked','Consignment'],a:1,e:'Quality inspection.'},
{q:'Siapa yang boleh menjalankan MI07?',o:['Siapa saja','User dengan otorisasi setelah approval','Vendor','Tim hitung'],a:1,e:'MI07 mengubah nilai persediaan.'},
{q:'Hasil hitung diinput dengan…',o:['MI04','MI01','MB52','MIGO'],a:0,e:'MI04 = enter inventory count.'}
]},
{id:6,title:'Aset Mesin & CAPEX',dur:'25 mnt',sum:'CAPEX vs OPEX, Asset under Construction, kapitalisasi, penyusutan, dan peranmu.',tcs:['AS03','AW01N','AR01','AIAB','AIBU'],
note:'Daftar dokumen kapitalisasi yang diminta Finance di perusahaanmu, dan siapa PIC-nya.',
objs:['Membedakan CAPEX dan OPEX','Memahami siklus AuC sampai aset final','Membaca AS03 dan AW01N','Tahu batas peran'],
lessons:[
{t:'CAPEX vs OPEX',html:`
<div class="grid g2">
<div class="card"><b>CAPEX</b><p>Menambah atau memperbarui aset dengan manfaat lebih dari satu tahun: mesin baru, conveyor baru, renovasi besar. Dicatat sebagai aset lalu disusutkan.</p></div>
<div class="card"><b>OPEX</b><p>Biaya operasional rutin: penggantian sparepart, perbaikan kecil, oli. Langsung menjadi biaya cost center bulan itu.</p></div>
</div>`,
keys:['CAPEX → aset → disusutkan','OPEX → biaya bulan berjalan'],
cp:cp('Pemasangan conveyor baru di Line 3 termasuk…',['OPEX','CAPEX','Bukan keduanya','Biaya vendor'],1,'Aset baru dengan manfaat > 1 tahun = CAPEX.')},
{t:'Siklus aset proyek',html:`<p>Klik setiap langkah.</p><div data-widget="flow" data-flow="aset"></div>`,
keys:['Budget → WBS & AuC → biaya → commissioning → settlement → aset aktif'],
cp:cp('Biaya mesin baru sebelum selesai dikumpulkan di…',['Cost center produksi','WBS / Asset under Construction','Material master','Vendor'],1,'Biaya CAPEX dikumpulkan di WBS/AuC.')},
{t:'Membaca data aset',html:`
<div class="tbl-wrap"><table><tr><th>T-code</th><th>Isi yang dibaca</th></tr>
<tr><td>${tc('AS03')}</td><td>Master aset: deskripsi, asset class, cost center, lokasi, tanggal kapitalisasi, umur manfaat</td></tr>
<tr><td>${tc('AW01N')}</td><td>Asset Explorer: nilai perolehan (APC), penyusutan direncanakan vs diposting, nilai buku</td></tr>
<tr><td>${tc('AR01')}</td><td>Asset balances: daftar aset per class, cost center, atau lokasi</td></tr>
</table></div>`,
keys:['AS03 master aset','AW01N nilai & penyusutan','AR01 daftar aset'],
cp:cp('Untuk melihat nilai perolehan dan penyusutan satu aset dipakai…',['AW01N','MB52','ME2N','MI20'],0,'AW01N Asset Explorer.')},
{t:'Settlement AuC & peranmu',html:`
<p>${tc('AIAB')} menentukan distribution rule (biaya AuC dibagi ke aset final mana), lalu ${tc('AIBU')} memposting settlement. Keduanya dijalankan Finance. Setelah itu aset final mulai disusutkan.</p>
<div class="callout"><b>Peranmu</b>Siapkan BAST, laporan commissioning, rincian biaya (CJI3/AW01N), usulan pemecahan aset, lokasi, cost center pemakai, foto, dan nomor tag. Cek data di AS03/AW01N, lalu serahkan ke Finance.</div>
<div class="callout bad"><b>Kesalahan umum</b>Biaya perawatan rutin masuk AuC, atau kapitalisasi terlambat setelah mesin dipakai produksi.</div>`,
keys:['AIAB/AIBU oleh Finance','Kamu menyiapkan dokumen','Kapitalisasi tepat waktu'],
cp:cp('Kenapa AuC belum disusutkan?',['Lupa diinput','AuC tidak disusutkan sampai dikapitalisasi ke aset final','Nilainya kecil','Belum ada PO'],1,'Penyusutan mulai setelah settlement.')}
],
quiz:[
{q:'Siapa biasanya menjalankan AIBU?',o:['Admin proyek','Gudang','Finance / asset accountant','Vendor'],a:2,e:'Settlement adalah transaksi Finance.'},
{q:'Penggantian sparepart rutin termasuk…',o:['CAPEX','OPEX','AuC','Aset final'],a:1,e:'OPEX.'},
{q:'Laporan daftar aset per cost center?',o:['AR01','AW01N','AIAB','CJI5'],a:0,e:'AR01.'},
{q:'Dokumen yang kamu siapkan untuk kapitalisasi?',o:['Hanya foto','BAST, commissioning, rincian biaya, pemecahan aset, lokasi, tag','Lembar opname','PO history saja'],a:1,e:'Paket lengkap untuk Finance.'},
{q:'Mesin sudah dipakai produksi sejak Oktober tapi masih AuC. Risikonya?',o:['Tidak ada','Penyusutan terlambat dan laporan keuangan tidak tepat','Stok bertambah','PO terhapus'],a:1,e:'Kapitalisasi harus tepat waktu.'}
]},
{id:7,title:'Biaya Proyek, Kurva S & RAG',dur:'30 mnt',sum:'WBS di CJ20N, actual CJI3, komitmen CJI5, KSB1, dan status progres proyek.',tcs:['CJ20N','CJI3','CJI5','KSB1','KOB1'],
note:'Buat template laporan mingguanmu: bagian apa saja, data dari T-code apa, dan kapan dikirim.',
objs:['Membaca struktur WBS','Menghitung sisa budget = Budget − Actual − Komitmen','Membuat Kurva S dan menentukan status RAG'],
lessons:[
{t:'Struktur WBS',html:`
<div class="tbl-wrap"><table><tr><th>WBS</th><th>Deskripsi</th><th class="n">Budget (contoh)</th></tr>
<tr><td><code>P-26-014</code></td><td><b>Instalasi Conveyor Line 3</b> (project definition)</td><td class="n">850.000.000</td></tr>
<tr><td><code>P-26-014.01</code></td><td>Engineering & desain</td><td class="n">60.000.000</td></tr>
<tr><td><code>P-26-014.02</code></td><td>Material mekanikal</td><td class="n">420.000.000</td></tr>
<tr><td><code>P-26-014.03</code></td><td>Jasa instalasi</td><td class="n">250.000.000</td></tr>
<tr><td><code>P-26-014.04</code></td><td>Elektrikal & commissioning</td><td class="n">120.000.000</td></tr>
</table></div>
<p>Di ${tc('CJ20N')} kamu biasanya hanya melihat struktur. Perubahan struktur dan budget dilakukan project controller/Finance.</p>`,
keys:['Project definition → WBS level 2 per paket pekerjaan','Pilih WBS sesuai jenis biaya'],
cp:cp('Kabel untuk panel MCC proyek ini sebaiknya dibebankan ke WBS…',['P-26-014.01','P-26-014.02','P-26-014.03','P-26-014.04'],3,'Kabel termasuk elektrikal (.04).')},
{t:'Budget, actual, komitmen',html:`
<div class="tbl-wrap"><table><tr><th>Angka</th><th>Sumber</th><th>Arti</th></tr>
<tr><td>Budget</td><td>CJ20N / laporan budget</td><td>Batas biaya yang disetujui</td></tr>
<tr><td>Actual</td><td>${tc('CJI3')}</td><td>Biaya yang sudah terjadi: GR, GI 221, SES, invoice</td></tr>
<tr><td>Komitmen</td><td>${tc('CJI5')}</td><td>PO yang belum diterima/ditagih</td></tr>
</table></div>
<div data-widget="budget"></div>
<p>Biaya per cost center: ${tc('KSB1')}. Internal order: ${tc('KOB1')}. Saat pertama membuka CJI3/CJI5, SAP meminta <b>Database profile</b>; pilih yang dipakai timmu.</p>`,
keys:['Sisa = Budget − Actual − Komitmen','Komitmen ikut mengurangi budget'],
cp:cp('Budget 500 jt, actual 320 jt, komitmen 150 jt. Sisa bebas?',['180 jt','30 jt','330 jt','150 jt'],1,'500 − 320 − 150 = 30 jt.')},
{t:'Kurva S & status RAG',html:`
<p>Kurva S membandingkan progres <b>rencana kumulatif</b> dengan <b>aktual kumulatif</b>. SPI (Schedule Performance Index) = aktual ÷ rencana. Ubah angka aktual dan lihat statusnya:</p>
<div data-widget="scurve"></div>
<div class="callout warn"><b>Ambang RAG</b>Contoh: Green ≥ 0,95; Amber 0,85–0,95; Red &lt; 0,85. Pakai aturan PMO di perusahaanmu.</div>`,
keys:['SPI = aktual ÷ rencana','RAG memberi peringatan dini'],
cp:cp('Rencana kumulatif 40%, aktual 36%. SPI dan status (ambang contoh)?',['0,90 – Amber','1,11 – Green','0,36 – Red','0,40 – Red'],0,'36 ÷ 40 = 0,90 → Amber.')},
{t:'Isi laporan mingguan',html:`
<ol class="steps">
<li><b>Ringkasan</b>: RAG, progres rencana vs aktual, SPI.</li>
<li><b>Biaya</b>: budget, actual (CJI3), komitmen (CJI5), sisa, prediksi akhir.</li>
<li><b>Pembelian</b>: PR menunggu approval (ME5A), PO belum datang (ME2N WE101), invoice tertahan.</li>
<li><b>Material</b>: stok sloc proyek (MB52), pemakaian minggu ini (MB51 mvt 221).</li>
<li><b>Isu & tindakan</b>: apa, PIC, tenggat.</li>
<li><b>K3 & keamanan pangan</b>: izin kerja, temuan HSE/QA.</li>
</ol>`,
keys:['Setiap angka punya sumber T-code','Isu selalu dengan PIC dan tenggat'],
cp:cp('Data "PO belum datang" untuk laporan mingguan diambil dari…',['ME2N dengan WE101','MI20','AW01N','KSB1'],0,'ME2N + WE101.')}
],
quiz:[
{q:'Budget 850 jt, actual 610 jt, komitmen 230 jt. Sisa?',o:['240 jt','10 jt','620 jt','230 jt'],a:1,e:'10 jt.'},
{q:'PO yang barangnya belum datang terlihat di…',o:['CJI3','CJI5','KSB1','AS03'],a:1,e:'CJI5 = komitmen.'},
{q:'Rencana 53%, aktual 44%. SPI ≈ …',o:['0,83','1,20','0,53','0,44'],a:0,e:'44 ÷ 53 ≈ 0,83.'},
{q:'Biaya per cost center dilihat di…',o:['KSB1','CJI3','KOB1','ME2N'],a:0,e:'KSB1.'},
{q:'Siapa biasanya mengubah struktur WBS dan budget?',o:['Admin proyek','Project controller / Finance','Vendor','Gudang'],a:1,e:'Kamu umumnya hanya melihat.'}
]},
{id:8,title:'Rutinitas Harian, PWO & K3',dur:'20 mnt',sum:'Jadwal kerja SAP, database PWO, document control, PM, dan keamanan pangan/K3.',tcs:['IW33','IW38','IE03','ME5A'],
note:'Susun rutinitas harian dan mingguanmu sendiri, lengkap dengan T-code yang dipakai.',
objs:['Punya rutinitas SAP harian dan mingguan','Menghubungkan database PWO dengan dokumen SAP','Membaca work order PM untuk koordinasi'],
lessons:[
{t:'Checklist rutin',html:`<p>Checklist ini tersimpan di browsermu. Pakai sebagai rutinitas kerja.</p><div data-widget="check" data-list="routine"></div>`,
keys:['Harian: PR, PO datang, catat nomor dokumen','Mingguan: CJI3/CJI5, Kurva S, stok proyek'],
cp:cp('Tugas harian yang paling mencegah jejak dokumen hilang?',['Mencatat nomor PR/PO/GR baru ke database PWO di hari yang sama','Membuat variant baru','Mengganti password','Membuka MB52'],0,'Catat langsung agar setiap pembelian bisa dilacak.')},
{t:'Database PWO & improvement',html:`
<div class="tbl-wrap"><table><tr><th>Kolom</th><th>Contoh</th></tr>
<tr><td>No. PWO</td><td>PWO-26-0142</td></tr>
<tr><td>Judul & area</td><td>Instalasi Conveyor Line 3 – Area Packing</td></tr>
<tr><td>Objek biaya SAP</td><td>WBS P-26-014 / IO 700000231</td></tr>
<tr><td>PR → PO → GR/SES → Invoice</td><td>10004587 → 4500021873 → 5000187342 → 5105600140</td></tr>
<tr><td>Status & RAG</td><td>Instalasi 60% · Amber</td></tr>
<tr><td>PIC & update</td><td>Hendra · 04.11.2026</td></tr>
<tr><td>Dokumen pendukung</td><td>Link folder: penawaran, BAST, izin kerja, foto</td></tr>
</table></div>`,
keys:['Database PWO menghubungkan pekerjaan lapangan dengan dokumen SAP'],
cp:cp('Kolom paling penting untuk menghubungkan PWO dengan laporan biaya SAP?',['Foto','Objek biaya SAP (WBS/IO)','Nama vendor','Warna RAG'],1,'WBS/IO menghubungkan PWO ke CJI3/KOB1.')},
{t:'Document control',html:`
<ul><li>Penamaan file konsisten: <code>PWO-26-0142_PO-4500021873_BAST_2026-11-04.pdf</code>.</li><li>Satu sumber kebenaran: versi final di satu folder bersama.</li><li>Setiap dokumen SAP yang diposting dicatat nomornya di hari yang sama.</li></ul>`,
keys:['Nama file: PWO_nomor SAP_jenis_tanggal'],
cp:cp('Nama file yang paling baik?',['scan1.pdf','PWO-26-0142_PO-4500021873_BAST_2026-11-04.pdf','final_final2.pdf','dokumen baru.pdf'],1,'Memuat PWO, nomor SAP, jenis, dan tanggal.')},
{t:'Plant Maintenance untuk koordinasi',html:`
<div class="tbl-wrap"><table><tr><th>T-code</th><th>Gunanya</th></tr>
<tr><td>${tc('IE03')}</td><td>Data mesin/equipment</td></tr>
<tr><td>${tc('IW33')}</td><td>Satu work order maintenance</td></tr>
<tr><td>${tc('IW38')}</td><td>Daftar work order</td></tr>
</table></div>`,
keys:['IE03 equipment, IW33 order, IW38 daftar order'],
cp:cp('Ingin melihat semua work order di Line 3 bulan ini?',['IW38','IE03','MB52','CJ20N'],0,'IW38.')},
{t:'Keamanan pangan & K3',html:`
<p>SAP tidak mencatat izin kerja, tapi pekerjaan proyek di pabrik pangan wajib memenuhi aturan ini. Pastikan dokumennya lengkap sebelum vendor masuk:</p>
<ul><li>Izin kerja, termasuk izin kerja panas untuk las/gerinda.</li><li>Induksi K3 & GMP untuk pekerja vendor, APD lengkap.</li><li>Kontrol alat dan material: tidak ada kaca/serpihan, daftar alat masuk-keluar.</li><li>Area disekat dan dibersihkan, dicek QA sebelum produksi berjalan lagi.</li></ul>`,
keys:['Izin kerja + induksi + kontrol alat + clearance QA'],
cp:cp('Sebelum vendor mengelas di area produksi, yang wajib ada…',['PO history','Izin kerja panas & induksi K3/GMP','MI20','AW01N'],1,'Pekerjaan panas butuh izin dan pengawasan HSE/QA.')}
],
quiz:[
{q:'Kapan nomor dokumen SAP dicatat ke database PWO?',o:['Akhir bulan','Hari yang sama','Saat audit','Saat vendor menagih'],a:1,e:'Langsung.'},
{q:'Data mesin/equipment dilihat di…',o:['IE03','IW38','MB52','ME23N'],a:0,e:'IE03.'},
{q:'Setelah pekerjaan vendor di area produksi selesai, sebelum produksi jalan lagi…',o:['Langsung jalan','Area dibersihkan dan dicek QA','Buat PR','Opname'],a:1,e:'Clearance QA wajib.'},
{q:'Data minggu ini tentang pemakaian material proyek diambil dari…',o:['MB51 mvt 221','ME5A','AR01','IW38'],a:0,e:'MB51 filter 221.'},
{q:'Satu sumber kebenaran untuk dokumen proyek artinya…',o:['Semua dokumen di email','Versi final di satu folder bersama','Setiap orang simpan sendiri','Dicetak saja'],a:1,e:'Satu folder bersama.'}
]}
];

/* ===================== FLOWS / LISTS / CARDS / QUIZ / CASES ===================== */
const FLOWS={
p2p:[
{t:'1. PR',c:'ME51N',who:'Kamu (admin proyek)',d:'Buat Purchase Requisition berdasarkan permintaan Project Supervisor: material/jasa, qty, tanggal butuh, plant, account assignment (P + WBS).',chk:'WBS benar, spesifikasi jelas, lampiran penawaran/gambar jika perlu.'},
{t:'2. Approval',c:'ME54N',who:'Atasan / pemegang budget',d:'PR di-release sesuai strategi approval. Pantau statusnya di ME5A.',chk:'Kalau tertahan lama, follow up approver dengan nomor PR.'},
{t:'3. PO',c:'ME21N',who:'Procurement',d:'Procurement memilih vendor, menegosiasikan harga, dan membuat PO dengan referensi PR.',chk:'Cek di ME23N: qty, harga, tanggal kirim, WBS sama dengan PR.'},
{t:'4. Kirim',c:'ME2N',who:'Vendor → Gudang',d:'Vendor mengirim barang dengan surat jalan. Kamu memantau PO yang belum datang (WE101).',chk:'Follow up PO yang melewati delivery date.'},
{t:'5. GR / SES',c:'MIGO / ML81N',who:'Gudang / kamu',d:'Barang diterima dengan MIGO 101 setelah dicek fisik. Jasa dicatat dengan service entry sheet setelah BAST.',chk:'Qty sesuai surat jalan, nomor surat jalan di Delivery Note.'},
{t:'6. Invoice',c:'MIRO',who:'Finance (AP)',d:'Finance memposting invoice dan SAP menjalankan 3-way match.',chk:'Jika blocked, bantu cari penyebab di PO history.'},
{t:'7. Bayar',c:'F110',who:'Finance (Treasury)',d:'Pembayaran sesuai termin. Invoice blocked tidak ikut dibayar.',chk:'Vendor menanyakan pembayaran? Cek PO history dulu.'}
],
opname:[
{t:'MI01',c:'MI01',who:'Admin / gudang',d:'Buat dokumen per plant + sloc, isi daftar material. Centang Posting Block.',chk:'Semua GR/GI sudah diposting sebelum dokumen dibuat.'},
{t:'MI21',c:'MI21',who:'Admin',d:'Cetak lembar hitung. Qty buku tidak ditampilkan (hitung buta).',chk:'Bagi lembar per rak, satu tim dua orang.'},
{t:'Hitung',c:'–',who:'Tim hitung',d:'Hitung barang di lokasi, tulis qty dan paraf.',chk:'Barang rusak/tanpa label dicatat terpisah.'},
{t:'MI04',c:'MI04',who:'Admin',d:'Input hasil hitung ke dokumen opname.',chk:'Satuan harus sama (PC, M, KG).'},
{t:'MI11',c:'MI11',who:'Admin / tim',d:'Recount item yang selisihnya besar.',chk:'Cek juga MB51 untuk transaksi tertunda.'},
{t:'MI20',c:'MI20',who:'Admin',d:'Daftar selisih qty dan nilai. Bahan berita acara.',chk:'Export ke Excel, lampirkan ke berita acara.'},
{t:'MI07',c:'MI07',who:'User berwenang',d:'Posting selisih setelah disetujui.',chk:'Butuh otorisasi dan approval.'}
],
aset:[
{t:'Budget',c:'–',who:'Management / Finance',d:'Proposal CAPEX disetujui beserta nilai budget.',chk:'Simpan nomor approval CAPEX.'},
{t:'WBS & AuC',c:'CJ20N / AS01',who:'Project controller / Finance',d:'Dibuat WBS proyek dan aset AuC untuk menampung biaya.',chk:'Catat nomor WBS dan AuC.'},
{t:'Pembelian',c:'ME51N / MIGO',who:'Kamu + Procurement',d:'PR/PO dengan account assignment ke WBS (P) atau aset (A).',chk:'Biaya CAPEX tidak masuk cost center.'},
{t:'Biaya',c:'CJI3 / AW01N',who:'Kamu (monitor)',d:'Biaya terkumpul di WBS lalu di-settle ke AuC secara periodik.',chk:'Rekonsiliasi dengan tracker tiap bulan.'},
{t:'Commissioning',c:'–',who:'Supervisor, QA, Produksi',d:'Mesin diuji dan diserahterimakan (BAST).',chk:'BAST dan laporan commissioning ditandatangani.'},
{t:'Settlement',c:'AIAB / AIBU',who:'Finance',d:'Biaya AuC dipindahkan ke aset final.',chk:'Siapkan rincian pemecahan aset.'},
{t:'Aset aktif',c:'AS03 / AW01N',who:'Finance + kamu',d:'Aset final mulai disusutkan.',chk:'Pasang tag aset, cek lokasi dan cost center.'}
]};
const LISTS={
prepOpname:['Umumkan cut-off: tidak ada GR/GI setelah jam yang disepakati','Pastikan semua surat jalan sudah di-GR dan semua pengambilan sudah di-GI','Rapikan dan beri label lokasi rak','Siapkan tim hitung (2 orang per tim)','Buat dokumen MI01 dengan Posting Block dan cetak MI21','Koordinasi HSE/QA jika menghitung di area produksi'],
routine:['Harian: cek ME5A untuk PR proyek yang belum di-approve','Harian: catat nomor PR/PO/GR/SES baru ke database PWO','Harian: cek ME2N (WE101) untuk barang yang dijadwalkan datang','Mingguan: export CJI3 & CJI5 per proyek','Mingguan: update Kurva S dan status RAG','Mingguan: cek MB52 sloc proyek, material menganggur > 30 hari','Mingguan: cek invoice tertahan bersama Finance','Bulanan: rekonsiliasi AuC (AW01N) dengan tracker CAPEX','Bulanan: siapkan dokumen kapitalisasi proyek yang sudah BAST']
};
const CARDS=[
['ME51N','Create Purchase Requisition','Beli','Membuat PR untuk material/jasa proyek.'],['ME52N','Change Purchase Requisition','Beli','Mengubah PR yang belum diproses.'],['ME53N','Display Purchase Requisition','Beli','Melihat detail PR dan statusnya.'],['ME5A','List of Purchase Requisitions','Beli','Memantau banyak PR: status release dan nomor PO.'],['ME54N','Release Purchase Requisition','Beli','Approval PR (oleh approver).'],['ME21N','Create Purchase Order','Beli','Membuat PO (oleh Procurement).'],['ME22N','Change Purchase Order','Beli','Mengubah PO (oleh Procurement).'],['ME23N','Display Purchase Order','Beli','Melihat PO dan PO history (WE, RE-L).'],['ME2N','PO by Document Number','Beli','Daftar PO, WE101 untuk PO belum diterima.'],['ME2L','PO by Vendor','Beli','Daftar PO per vendor.'],['ME2M','PO by Material','Beli','Daftar PO per material.'],['MIGO','Goods Movement','Stok','Semua pergerakan barang: GR, GI, transfer, cancel.'],['ML81N','Service Entry Sheet','Beli','Mencatat penerimaan jasa.'],['MIRO','Enter Incoming Invoice','Beli','Posting invoice vendor (Finance).'],['MIR4','Display Invoice Document','Beli','Melihat invoice yang sudah diposting.'],['MB52','Warehouse Stocks','Stok','Stok per plant/sloc, mudah di-export.'],['MMBE','Stock Overview','Stok','Stok satu material di semua lokasi.'],['MB51','Material Document List','Stok','Riwayat pergerakan barang.'],['MB03','Display Material Document','Stok','Melihat satu dokumen GR/GI.'],['MM03','Display Material','Data induk','Detail material master.'],['MI01','Create Phys. Inventory Doc','Opname','Membuat dokumen opname.'],['MI21','Print Phys. Inventory Doc','Opname','Mencetak lembar hitung.'],['MI04','Enter Inventory Count','Opname','Input hasil hitung.'],['MI11','Recount','Opname','Hitung ulang item tertentu.'],['MI20','Difference List','Opname','Daftar selisih opname.'],['MI07','Post Inventory Difference','Opname','Posting selisih (butuh otorisasi).'],['AS03','Display Asset','Aset','Master data aset.'],['AW01N','Asset Explorer','Aset','Nilai perolehan dan penyusutan.'],['AR01','Asset Balances','Aset','Daftar/register aset.'],['AIAB','AuC Distribution Rule','Aset','Aturan pembagian AuC (Finance).'],['AIBU','AuC Settlement','Aset','Settlement AuC ke aset final (Finance).'],['CJ20N','Project Builder','Proyek','Struktur proyek dan WBS.'],['CJI3','Project Actual Line Items','Proyek','Biaya aktual proyek.'],['CJI5','Project Commitment Line Items','Proyek','Komitmen (PO belum terealisasi).'],['KSB1','Cost Center Actual Line Items','Proyek','Biaya per cost center.'],['KOB1','Order Actual Line Items','Proyek','Biaya per internal order.'],['IE03','Display Equipment','PM','Data mesin/equipment.'],['IW33','Display PM Order','PM','Detail work order maintenance.'],['IW38','List of PM Orders','PM','Daftar work order.']
];
const QBANK=[
{c:'Movement',q:'Material proyek diambil dan dibebankan ke WBS P-26-014.02. Movement type?',o:['201','221','261','101'],a:1,e:'221 = GI ke project/WBS.'},
{c:'Movement',q:'Oli untuk perawatan rutin mesin produksi, ke cost center Line 3.',o:['221','311','201','261'],a:2,e:'201 = GI ke cost center.'},
{c:'Movement',q:'Sparepart untuk work order maintenance 4000123.',o:['261','201','221','101'],a:0,e:'261 = GI ke order.'},
{c:'Movement',q:'Barang dari PO vendor diterima gudang.',o:['311','101','201','102'],a:1,e:'101 = GR terhadap PO.'},
{c:'Movement',q:'Kamu salah posting 221 dan membatalkannya. Movement pembalik otomatis?',o:['220','222','202','102'],a:1,e:'Pembatalan 221 = 222.'},
{c:'Movement',q:'Memindahkan stok dari sloc 1101 ke 1102 dalam plant yang sama.',o:['311','301','221','101'],a:0,e:'311.'},
{c:'Movement',q:'Di MIGO, Action untuk membatalkan dokumen material adalah…',o:['A01','A03','A07','A08'],a:1,e:'A03 = Cancellation dengan R02.'},
{c:'T-code',q:'PR proyek dibuat 3 hari lalu. Kamu ingin tahu apakah sudah jadi PO.',o:['ME5A / ME53N','MIGO','MB52','KSB1'],a:0,e:'ME5A/ME53N.'},
{c:'T-code',q:'Vendor: "Invoice kami sudah masuk?" Cara cek tercepat?',o:['ME23N tab PO history (RE-L)','MB51','MI20','CJ20N'],a:0,e:'RE-L di PO history.'},
{c:'T-code',q:'Bearing 300012457 ada di gudang mana saja?',o:['MB52','MMBE','MB51','MM03'],a:1,e:'MMBE.'},
{c:'T-code',q:'Laporan stok lengkap Gudang Proyek 1102 untuk di-export.',o:['MB52','MMBE','ME2N','AS03'],a:0,e:'MB52.'},
{c:'T-code',q:'Membuat PR baru untuk material proyek.',o:['ME21N','ME51N','MIGO','MIRO'],a:1,e:'ME51N.'},
{c:'T-code',q:'Laporan biaya aktual proyek per WBS.',o:['CJI3','CJI5','KSB1','AR01'],a:0,e:'CJI3.'},
{c:'T-code',q:'Daftar semua aset mesin di cost center Line 2.',o:['AR01','AS03','AIBU','MB52'],a:0,e:'AR01.'},
{c:'Pembelian',q:'Invoice 10 pcs, GR baru 8 pcs. Apa yang terjadi?',o:['Langsung dibayar','Invoice blocked sampai qty sesuai','PO dihapus','Stok bertambah 2'],a:1,e:'3-way match gagal.'},
{c:'Pembelian',q:'Selection parameter ME2N untuk PO belum diterima?',o:['WE101','RE101','PO101','GR001'],a:0,e:'WE101.'},
{c:'Pembelian',q:'Jasa commissioning selesai dan BAST ditandatangani. Langkah berikutnya?',o:['MIGO 101','Service entry sheet (ML81N)','MI04','AIBU'],a:1,e:'Service entry sheet.'},
{c:'Pembelian',q:'Di ME51N, A = P. SAP minta WBS. Diisi di mana?',o:['Header','Tab Account Assignment di Item Detail','Short Text','Tab Valuation'],a:1,e:'Tab Account Assignment.'},
{c:'Opname',q:'Fungsi Posting Block di MI01?',o:['Menghapus stok','Membekukan pergerakan item selama opname','Mengunci user','Membuat PO'],a:1,e:'Posting block.'},
{c:'Opname',q:'MI20 menunjukkan selisih -1 pcs. Yang pertama dilakukan?',o:['Langsung MI07','Investigasi (MB51, recount MI11) lalu berita acara','GR 101 agar cocok','Hapus dokumen'],a:1,e:'Investigasi dulu.'},
{c:'Opname',q:'Siapa yang boleh menjalankan MI07?',o:['Siapa saja','User dengan otorisasi setelah approval','Vendor','Tim hitung'],a:1,e:'Butuh otorisasi.'},
{c:'Aset',q:'Biaya mesin baru sebelum selesai dikumpulkan di…',o:['Cost center','AuC / WBS','Material master','Vendor'],a:1,e:'WBS/AuC.'},
{c:'Aset',q:'Peranmu dalam kapitalisasi aset…',o:['Menjalankan AIBU','Menyiapkan dokumen dan mengecek data','Mengubah umur manfaat','Menghapus AuC'],a:1,e:'Finance menjalankan transaksi aset.'},
{c:'Proyek',q:'Budget 500 jt, actual 320 jt, komitmen 150 jt. PR baru 40 jt?',o:['Aman, sisa 180 jt','Melebihi sisa 30 jt, eskalasi dulu','Sisa 30 jt, aman','Tidak perlu dihitung'],a:1,e:'Sisa 30 jt < 40 jt.'},
{c:'Navigasi',q:'Di dalam ME23N kamu mengetik MB52 lalu Enter dan tidak terjadi apa-apa. Kenapa?',o:['Tidak punya otorisasi','Harus pakai /nMB52','SAP error','MB52 tidak ada'],a:1,e:'Dari dalam transaksi wajib /n atau /o.'},
{c:'Navigasi',q:'Pesan kuning (W) saat Save artinya…',o:['Gagal','Warning: baca lalu Enter untuk lanjut','Sukses','Logoff'],a:1,e:'Warning tidak memblokir.'}
];
const OBANK=[
{c:'Urutan',q:'Urutkan alur procure to pay:',items:['ME51N – buat PR','Release/approval PR','ME21N – buat PO','MIGO 101 – goods receipt','MIRO – invoice verification','Pembayaran vendor']},
{c:'Urutan',q:'Urutkan transaksi stock opname:',items:['MI01 – buat dokumen','MI21 – cetak lembar hitung','MI04 – input hasil hitung','MI11 – recount (jika perlu)','MI20 – daftar selisih','MI07 – posting selisih']},
{c:'Urutan',q:'Urutkan siklus aset proyek:',items:['Budget CAPEX disetujui','Biaya dikumpulkan di WBS/AuC','Commissioning & BAST','Settlement AIAB/AIBU','Aset final mulai disusutkan']},
{c:'Urutan',q:'Urutkan langkah GR di MIGO:',items:['Pilih A01 Goods Receipt + R01 Purchase Order','Isi nomor PO lalu Enter','Isi Delivery Note dan sesuaikan qty','Centang Item OK','Check','Post']}
];
const CASES=[
{id:'c1',title:'Invoice vendor tertahan',tag:'Pembelian',scene:'Bu Ratna dari Finance: "Invoice PT Mitra Teknik untuk PO 4500021873 senilai 10 pcs bearing tidak bisa dibayar, statusnya blocked." Vendor sudah dua kali menanyakan pembayaran.',
steps:[
{q:'Apa yang kamu buka pertama kali?',o:[['ME23N, cek PO history PO 4500021873',1,'Tepat. PO history menunjukkan GR dan invoice sekaligus.'],['MIRO, ubah invoice',0,'MIRO ranah Finance. Cari penyebabnya dulu.'],['MB52 Gudang Sparepart',0,'MB52 hanya menunjukkan stok.']]},
{q:'PO history: WE 8 pcs, RE-L 10 pcs. Penyebab block?',o:[['Qty invoice lebih besar dari qty GR',1,'Benar. Baru 8 pcs yang diterima.'],['Harga PO salah',0,'Data menunjukkan selisih qty.'],['Rekening vendor salah',0,'Tidak terkait 3-way match.']]},
{q:'Gudang memastikan 2 pcs sisanya sudah datang minggu lalu tapi surat jalannya terselip. Tindakan?',o:[['Minta gudang posting MIGO 101 untuk 2 pcs dengan surat jalan itu, lalu kabari Finance',1,'Tepat. Setelah GR lengkap, invoice bisa di-release.'],['Minta Finance tetap bayar',0,'Tanpa GR, dokumen tidak cocok.'],['Buat PO baru 2 pcs',0,'Menggandakan pembelian.']]}
]},
{id:'c2',title:'Biaya material tidak muncul di proyek',tag:'Movement type',scene:'Pak Hendra: "Di CJI3 biaya belt conveyor belum masuk ke P-26-014.02, padahal sudah dipasang minggu lalu."',
steps:[
{q:'Laporan yang membantu melacak pengeluarannya?',o:[['MB51, filter material dan tanggal',1,'Benar.'],['ME5A',0,'ME5A untuk PR.'],['AR01',0,'AR01 untuk aset.']]},
{q:'Di MB51 ternyata dikeluarkan dengan 201 ke cost center 11PRD310. Artinya?',o:[['Biaya masuk cost center produksi, bukan WBS',1,'Tepat.'],['Nanti otomatis pindah',0,'SAP tidak memindahkan otomatis.'],['Barang belum keluar',0,'Barang sudah keluar.']]},
{q:'Periode masih terbuka. Koreksinya?',o:[['MIGO A03 cancel dokumen 201 (terbentuk 202), lalu posting 221 ke WBS P-26-014.02',1,'Benar. Catat kedua nomor dan alasannya.'],['Posting 221 lagi tanpa membatalkan',0,'Biaya tercatat ganda.'],['Ubah laporan di Excel',0,'Data SAP tetap salah.']]}
]},
{id:'c3',title:'Selisih stock opname',tag:'Opname',scene:'MI20 menunjukkan coupling motor 300015577 selisih -3 pcs (Rp 2.250.000). Kepala gudang ingin opname ditutup hari ini.',
steps:[
{q:'Langkah pertama?',o:[['Recount (MI11) dan cek fisik ulang',1,'Tepat.'],['Langsung MI07',0,'Berisiko dan biasanya tidak diizinkan.'],['GR 101 3 pcs',0,'Manipulasi stok.']]},
{q:'Recount tetap kurang 3. Apa yang dicek di SAP?',o:[['MB51: transaksi coupling beberapa hari terakhir',1,'Ternyata teknisi mengambil 3 pcs tanpa GI.'],['ME2N WE101',0,'Untuk PO.'],['AW01N',0,'Untuk aset.']]},
{q:'Teknisi mengakui 3 pcs dipakai untuk proyek P-26-014. Penyelesaian?',o:[['Selesaikan opname sesuai prosedur dengan berita acara, lalu posting GI 221 sesuai arahan Finance agar tidak dobel',1,'Tepat. Perbaiki juga prosedur pengambilan barang.'],['Abaikan',0,'Biaya proyek kurang tercatat.'],['Hapus item dari dokumen',0,'Pelanggaran kontrol.']]}
]},
{id:'c4',title:'Jasa instalasi belum dibayar',tag:'Jasa',scene:'PT Duta Konveyor selesai jasa instalasi (PO jasa 4500021915). Gudang mencoba MIGO tapi error. Vendor mengeluh tagihan tidak diproses.',
steps:[
{q:'Kenapa MIGO gagal?',o:[['PO jasa diterima lewat service entry sheet, bukan MIGO',1,'Benar.'],['Gudang tak punya otorisasi',0,'Penyebab utamanya jenis PO.'],['PO dihapus',0,'Tidak ada indikasi.']]},
{q:'Dokumen yang harus ada sebelum SES?',o:[['BAST yang ditandatangani supervisor',1,'Tepat.'],['Lembar hitung MI21',0,'Untuk opname.'],['Surat jalan',0,'Jasa tidak memakai surat jalan.']]},
{q:'Setelah SES diposting dan di-approve?',o:[['Finance memposting invoice dan 3-way match terhadap SES',1,'Benar.'],['Kamu posting MIRO',0,'Tugas Finance.'],['Buat PO baru',0,'Tidak perlu.']]}
]},
{id:'c5',title:'Proyek mendekati over budget',tag:'Biaya proyek',scene:'Budget P-26-014 = Rp 850 jt. CJI3 actual Rp 610 jt, CJI5 komitmen Rp 230 jt. Supervisor minta PR kabel tambahan Rp 45 jt.',
steps:[
{q:'Sisa budget bebas sebelum PR baru?',o:[['Rp 10 jt',1,'850 − 610 − 230 = 10 jt.'],['Rp 240 jt',0,'Komitmen juga mengikat budget.'],['Rp 620 jt',0,'Salah hitung.']]},
{q:'Tindakan yang tepat?',o:[['Informasikan bahwa PR 45 jt melebihi sisa, siapkan data untuk tambahan budget atau perubahan scope',1,'Tepat.'],['Pakai WBS proyek lain',0,'Temuan audit.'],['Pecah PR jadi kecil-kecil',0,'Tidak diperbolehkan.']]},
{q:'Status RAG biaya di laporan mingguan?',o:[['Amber/Red dengan penjelasan dan rencana tindakan',1,'Laporan harus jujur.'],['Green',0,'Sisa 1% adalah risiko nyata.'],['Tidak dilaporkan',0,'Wajib dilaporkan.']]}
]},
{id:'c6',title:'Kapitalisasi mesin filling baru',tag:'Aset',scene:'Mesin Filling Line 2 dipakai produksi sejak 1 Oktober. Biaya masih di AuC 4000012-0. Finance minta dokumen kapitalisasi minggu ini.',
steps:[
{q:'Cara cek total biaya AuC?',o:[['AW01N untuk aset 4000012-0',1,'Benar.'],['MB52',0,'Untuk stok.'],['ME5A',0,'Untuk PR.']]},
{q:'Dokumen yang kamu siapkan?',o:[['BAST, commissioning, rincian biaya, pemecahan aset, lokasi & cost center, foto, tag',1,'Lengkap.'],['Foto saja',0,'Kurang.'],['Lembar opname',0,'Tidak relevan.']]},
{q:'Siapa menjalankan AIAB/AIBU dan kenapa segera?',o:[['Finance; aset sudah dipakai sejak Oktober sehingga penyusutan harus dimulai tepat waktu',1,'Tepat.'],['Kamu, tidak ada tenggat',0,'Salah.'],['Vendor',0,'Tidak punya akses.']]}
]}
];
/* ===================== MORE CASE STUDIES ===================== */
CASES.push(
{id:'c7',title:'PR ditolak approver',tag:'Pembelian',scene:'Approver menolak PR 10004583 (plat stainless 4 lembar) dengan catatan: "WBS salah, ini untuk renovasi mixing bukan conveyor." PR dibuat dengan WBS P-26-014.02.',
steps:[
{q:'Apa yang kamu cek pertama?',o:[['Konfirmasi ke pemohon (Rudi) untuk proyek mana plat itu dipakai, lalu cek WBS proyek mixing di CJ20N/F4',1,'Benar. Pastikan objek biaya yang benar sebelum mengubah.'],['Langsung buat PR baru dengan WBS acak',0,'Jangan menebak WBS.'],['Abaikan penolakan',0,'PR tidak akan diproses.']]},
{q:'Ternyata untuk proyek mixing (P-26-009.02). PR belum di-release. Tindakan?',o:[['Ubah WBS di ME52N tab Account Assignment, tulis alasan di item text, lalu minta approval ulang',1,'Tepat. PR yang belum di-release masih bisa diubah.'],['Biarkan, nanti Finance pindahkan',0,'Koreksi di awal jauh lebih murah.'],['Ubah di PO',0,'Belum ada PO.']]},
{q:'Bagaimana mencegah hal ini berulang?',o:[['Daftar WBS per proyek di database PWO dan cek ulang WBS sebelum Save',1,'Kontrol sederhana yang efektif.'],['Selalu pakai WBS level atas',0,'Laporan per paket pekerjaan jadi tidak akurat.'],['Minta approver tidak teliti',0,'Bukan solusi.']]}
]},
{id:'c8',title:'Barang datang tidak sesuai spesifikasi',tag:'Penerimaan',scene:'Motor gearbox 3 kW untuk proyek datang, tapi name plate menunjukkan 2,2 kW. GR sudah terlanjur diposting kemarin oleh gudang (mvt 101, PO ber-account assignment P).',
steps:[
{q:'Langkah pertama?',o:[['Tahan barang (jangan dipasang), foto name plate, kabari supervisor, QA, dan Procurement',1,'Amankan bukti dan cegah barang salah terpasang.'],['Pasang saja, nanti diganti',0,'Risiko kualitas dan keselamatan.'],['Buang barangnya',0,'Barang milik perusahaan, ada nilai.']]},
{q:'Bagaimana mengoreksi di SAP?',o:[['Retur ke vendor dengan movement pembalik GR (misalnya 122 return delivery atau cancel 102) sesuai prosedur gudang, lalu vendor kirim ulang',1,'Biaya di WBS ikut terkoreksi saat GR dibalik.'],['Biarkan GR, bayar invoice',0,'Kamu membayar barang yang salah.'],['GI 221 ke WBS',0,'Memperparah kesalahan.']]},
{q:'Apa dampaknya ke invoice vendor?',o:[['Setelah GR dibalik, invoice untuk barang itu tidak lolos 3-way match sampai barang yang benar diterima',1,'Benar. Ini melindungi perusahaan.'],['Invoice tetap dibayar',0,'Tidak ada GR yang cocok.'],['Invoice otomatis dibatalkan vendor',0,'Vendor yang harus merevisi.']]}
]},
{id:'c9',title:'Material sisa setelah proyek selesai',tag:'Inventory',scene:'Proyek conveyor selesai. Di area kerja tersisa 18 M kabel NYY dan 30 baut M12 yang sudah di-GI 221 ke WBS proyek. Supervisor ingin dikembalikan ke gudang.',
steps:[
{q:'Movement yang tepat untuk mengembalikan material dari WBS ke stok?',o:[['222 (pembalik 221) ke WBS yang sama, masuk ke sloc gudang',1,'Biaya di WBS berkurang sesuai nilai yang dikembalikan.'],['101',0,'101 untuk penerimaan dari PO.'],['311',0,'311 hanya pindah antar sloc untuk stok.']]},
{q:'Sebelum posting, apa yang dicek?',o:[['Kondisi fisik (layak pakai), qty sebenarnya, dan dokumen GI asalnya di MB51',1,'Material rusak tidak dikembalikan sebagai stok layak.'],['Tidak perlu cek',0,'Data stok bisa kacau.'],['Harga terbaru dari vendor',0,'Bukan prioritas.']]},
{q:'Proyek sudah ditutup secara teknis oleh Finance. Apa yang perlu diperhatikan?',o:[['Koordinasi dengan Finance karena WBS yang sudah TECO/closed bisa menolak posting',1,'Status WBS menentukan apakah posting masih bisa.'],['Posting ke WBS proyek lain',0,'Salah objek biaya.'],['Simpan tanpa dokumen',0,'Stok tak tercatat.']]}
]},
{id:'c10',title:'Kontraktor mengelas tanpa izin di area produksi',tag:'K3 & keamanan pangan',scene:'Saat jalan di Line 3, kamu melihat teknisi vendor mulai menggerinda bracket di dekat conveyor yang masih berjalan. Tidak ada izin kerja panas yang tertempel, dan produk terbuka berada 3 meter dari lokasi.',
steps:[
{q:'Tindakan pertama?',o:[['Hentikan pekerjaan dengan sopan (stop work), amankan area, panggil HSE dan supervisor',1,'Keselamatan dan keamanan pangan lebih dulu.'],['Biarkan, nanti lapor',0,'Risiko kebakaran dan kontaminasi serpihan logam.'],['Foto saja lalu pergi',0,'Bahaya tetap berlangsung.']]},
{q:'Risiko keamanan pangan utamanya?',o:[['Serpihan logam dan percikan mengkontaminasi produk terbuka',1,'Benar. Produk di sekitar perlu dievaluasi QA.'],['Tidak ada risiko',0,'Salah.'],['Hanya kebisingan',0,'Bukan risiko utama.']]},
{q:'Sebelum pekerjaan dilanjutkan?',o:[['Izin kerja panas terbit, area disekat, produk dipindah/ditutup, fire watch siap, lalu clearance QA setelah selesai',1,'Prosedur lengkap mencegah kejadian berulang.'],['Cukup izin lisan supervisor',0,'Tidak memenuhi prosedur.'],['Kerja malam saja',0,'Risiko tetap sama.']]}
]},
{id:'c11',title:'PR urgent, vendor minta kirim sebelum PO',tag:'Pembelian',scene:'Bearing urgent untuk proyek. PR 10004587 belum di-approve. Vendor menelepon: "Barang bisa dikirim hari ini, PO menyusul saja."',
steps:[
{q:'Jawabanmu ke vendor?',o:[['Sopan menolak: barang hanya diterima dengan PO resmi (no PO, no delivery). Informasikan PO sedang diproses',1,'Kebijakan ini melindungi perusahaan dan vendor.'],['Silakan kirim',0,'Barang tanpa PO tidak bisa di-GR dan berisiko tidak dibayar.'],['Minta kirim ke rumah',0,'Melanggar prosedur.']]},
{q:'Cara mempercepat proses yang benar?',o:[['Follow up approver dengan nomor PR dan alasan urgensi, kabari Procurement agar siap membuat PO begitu PR di-release',1,'Percepat di jalur resmi.'],['Buat PO sendiri',0,'Bukan wewenangmu.'],['Pecah PR',0,'Tidak diperbolehkan.']]},
{q:'Kalau gudang ternyata sudah menerima barang tanpa PO?',o:[['Barang dikarantina, jangan dipakai; laporkan ke Procurement agar PO diproses, baru GR terhadap PO',1,'Tidak ada GR tanpa dokumen dasar.'],['GR dengan PO lain',0,'Salah dokumen.'],['Pakai saja',0,'Tidak terkendali.']]}
]},
{id:'c12',title:'Laporan mingguan: SPI turun, biaya naik',tag:'Laporan',scene:'Minggu 7: progres rencana 53%, aktual 44%. CJI3 actual 610 jt, komitmen 230 jt dari budget 850 jt. Vendor instalasi kekurangan tenaga.',
steps:[
{q:'SPI dan status jadwal (ambang contoh)?',o:[['SPI ≈ 0,83 → Red',1,'44 ÷ 53 ≈ 0,83.'],['SPI 1,2 → Green',0,'Terbalik.'],['SPI 0,53 → Amber',0,'Salah hitung.']]},
{q:'Status biaya?',o:[['Sisa bebas 10 jt (≈1%) → Amber/Red, risiko tinggi',1,'850 − 610 − 230 = 10 jt.'],['Aman, sisa 240 jt',0,'Komitmen diabaikan.'],['Over budget 230 jt',0,'Salah hitung.']]},
{q:'Isi bagian "Isu & tindakan" yang baik?',o:[['Isu: kekurangan tenaga vendor; Tindakan: rencana percepatan dari vendor, PIC Hendra, tenggat Jumat; Biaya: kajian tambahan budget atau scope',1,'Spesifik, ada PIC dan tenggat.'],['"Proyek agak telat"',0,'Terlalu umum.'],['Tidak dilaporkan agar tidak panik',0,'Menutupi risiko.']]}
]},
{id:'c13',title:'BAST hilang saat audit',tag:'Document control',scene:'Auditor meminta bukti BAST untuk SES 1000034401 (jasa instalasi tahap 1, Rp 120 jt). Dokumen tidak ada di folder proyek.',
steps:[
{q:'Di mana kamu mencari jejaknya?',o:[['Database PWO (nomor SES & link), email persetujuan, ML81N/ME23N untuk nomor referensi (External Number) di SES',1,'External Number di SES biasanya berisi nomor BAST.'],['Tanya auditor',0,'Auditor meminta bukti darimu.'],['Buat BAST baru dengan tanggal lama',0,'Pemalsuan dokumen.']]},
{q:'Nomor BAST ditemukan, file aslinya ada di email supervisor. Lalu?',o:[['Simpan ke folder proyek dengan penamaan standar dan tautkan di database PWO, lalu serahkan ke auditor',1,'Pulihkan dan rapikan jejak dokumen.'],['Kirim screenshot chat saja',0,'Kurang sah.'],['Abaikan',0,'Temuan audit.']]},
{q:'Pencegahan ke depan?',o:[['Wajib unggah BAST sebelum SES diposting dan cantumkan nomornya di External Number',1,'Kontrol preventif.'],['Simpan semua di laptop pribadi',0,'Risiko hilang.'],['Cetak saja',0,'Tidak cukup.']]}
]},
{id:'c14',title:'Mesin lama dibongkar saat renovasi',tag:'Aset',scene:'Renovasi ruang mixing membongkar Mixer 500L lama (aset 1100987). Mesin dijual ke pengepul besi tua. Finance belum tahu.',
steps:[
{q:'Kenapa Finance perlu tahu?',o:[['Aset harus di-retire (dihapus) dari asset register agar nilai buku dan penyusutan berhenti',1,'Tanpa retirement, aset "hantu" tetap tercatat.'],['Tidak perlu, sudah dijual',0,'Data aset jadi salah.'],['Hanya untuk pajak',0,'Juga untuk laporan aset.']]},
{q:'Dokumen yang kamu siapkan?',o:[['Berita acara pembongkaran, nomor aset dari AS03/tag, foto, bukti penjualan/nilai jual, persetujuan management',1,'Lengkap untuk proses retirement.'],['Foto saja',0,'Kurang.'],['PO baru',0,'Tidak relevan.']]},
{q:'Siapa yang memposting retirement di SAP?',o:[['Finance / asset accountant',1,'Sesuai batas peran.'],['Admin proyek',0,'Bukan wewenangmu.'],['Pengepul',0,'Tidak punya akses.']]}
]},
{id:'c15',title:'Vendor kirim lebih banyak dari PO',tag:'Penerimaan',scene:'Vendor kabel mengirim 130 M padahal sisa PO 120 M. Gudang bertanya apakah semua bisa diterima.',
steps:[
{q:'Apa yang terjadi kalau GR 130 M dicoba di MIGO?',o:[['Error "PO quantity exceeded" jika tidak ada toleransi over-delivery',1,'Toleransi diatur di PO (tab Delivery).'],['Diterima otomatis',0,'Tidak tanpa toleransi.'],['Stok bertambah 130',0,'Ditolak sistem.']]},
{q:'Tindakan yang benar?',o:[['GR 120 M, catat kelebihan 10 M di berita acara, Procurement memutuskan retur atau tambah PO',1,'Sesuai dasar PO.'],['Simpan 10 M tanpa dokumen',0,'Stok tidak tercatat.'],['GR 130 M dengan PO lain',0,'Salah dokumen.']]},
{q:'Siapa yang bisa mengubah toleransi atau qty PO?',o:[['Procurement melalui ME22N',1,'Bukan gudang atau admin.'],['Gudang',0,'Tidak berwenang.'],['Vendor',0,'Tidak punya akses.']]}
]}
);

/* ===================== KATALOG MODUL: builder ===================== */
const tcCell=c=>/\s/.test(c)?`<b>${c}</b>`:tc(c);
function L(t,o){
  let h='';
  (o.p||[]).forEach(x=>h+=`<p>${x}</p>`);
  if(o.flow) h+=`<div class="pflow" role="list" aria-label="Alur proses">${o.flow.map((s,i)=>`<div class="pf" role="listitem"><span class="pf-n">${i+1}</span><b>${s[0]}</b>${s[1]?`<small>${s[1]}</small>`:''}</div>`).join('')}</div>`;
  if(o.tc) h+=`<div class="tbl-wrap"><table><tr><th style="width:34%">T-code / app</th><th>Fungsi</th></tr>${o.tc.map(r=>`<tr><td>${r[0].split(' / ').map(tcCell).join(' ')}</td><td>${r[1]}</td></tr>`).join('')}</table></div>`;
  if(o.integ) h+=`<div class="callout"><b>Integrasi</b>${o.integ}</div>`;
  if(o.tip) h+=`<div class="callout warn"><b>Di lapangan</b>${o.tip}</div>`;
  return {t,html:h,keys:o.keys,cp:cp(...o.cp),tcRows:o.tc||[],flow:o.flow||null};
}
const QZ=a=>a.map(x=>cp(...x));

/* ===================== FINANCE ===================== */
const MODS_FIN=[
{id:'fi-gl',code:'FI-GL',cat:'fin',title:'FI – General Ledger & Laporan Keuangan',dur:'35 mnt',
sum:'Company code, akun G/L, dokumen jurnal, tutup buku, dan laporan neraca serta laba rugi.',tcs:['FS00','FB50','FB03','FAGLL03','F.01'],
objs:['Memahami struktur FI: company code, chart of accounts, tahun fiskal, periode','Membaca dan memposting dokumen jurnal (header, line item, posting key)','Menjalankan langkah tutup buku bulanan','Menarik neraca, laba rugi, dan trial balance'],
note:'Tulis tiga langkah tutup buku yang paling sering terlambat di timmu, dan siapa pemiliknya.',
lessons:[
L('Struktur FI dan dokumen akuntansi',{p:['FI mencatat semua transaksi keuangan per <b>company code</b> (satu badan hukum). Akun G/L diambil dari <b>chart of accounts</b>, dan setiap posting masuk ke <b>periode</b> dalam tahun fiskal. Di S/4HANA, semua posting FI dan CO tersimpan di satu tabel, <b>Universal Journal (ACDOCA)</b>, sehingga angka FI dan CO selalu sama.','Setiap dokumen punya <b>header</b> (tanggal dokumen, tanggal posting, document type, referensi) dan <b>line item</b> (akun, debit/kredit lewat posting key, jumlah, objek biaya). Document type menandai sumbernya: SA jurnal umum, KR invoice vendor tanpa PO, RE invoice vendor dari MIRO, KZ pembayaran vendor manual, ZP pembayaran dari F110, DR invoice customer, DZ penerimaan customer, AA transaksi aset, WE goods receipt.'],
tc:[['FS00','Membuat/menampilkan master akun G/L di level chart of accounts dan company code'],['FB03','Menampilkan dokumen akuntansi'],['FAGLL03 / FAGLL03H','Line item akun G/L (open item, cleared item, semua item)'],['FAGLB03','Saldo akun per periode'],['Manage Journal Entries','App Fiori untuk mencari, menampilkan, dan me-reverse jurnal']],
keys:['Company code = entitas hukum; semua posting FI ada di dalamnya','Dokumen = header + line item; total debit harus sama dengan kredit','Document type menunjukkan asal posting (SA, KR, DR, WE, AA)'],
cp:['Kamu melihat dokumen dengan document type KR. Kemungkinan besar dokumen ini berasal dari…',['Invoice vendor','Penerimaan uang dari customer','Penyusutan aset','Goods issue ke cost center'],0,'KR = vendor invoice. Pembayaran vendor memakai KZ, customer invoice DR.']}),
L('Posting jurnal dan tutup buku bulanan',{p:['Jurnal manual dibuat dengan <b>FB50</b> (atau app Post General Journal Entries). Biasakan <b>Simulate</b> sebelum Post untuk melihat akun lawan, pajak, dan objek CO yang terisi. Jurnal yang salah tidak dihapus, melainkan <b>di-reverse</b> dengan FB08 lalu diposting ulang, supaya jejak audit tetap ada.','Tutup buku adalah rangkaian langkah dengan urutan tetap. Langkah yang tertunda di satu tim (misalnya GR yang belum diposting gudang) akan membuat angka akhir bulan salah.'],
flow:[['Cut-off transaksi','GR, GI, invoice diposting'],['Accrual','FBS1, reverse otomatis F.81'],['Penyusutan','AFAB dari tim aset'],['Revaluasi valas','FAGL_FCV'],['Regroup GR/IR','F.19'],['Settlement CO','KO88, CJ88'],['Tutup periode','OB52 / Manage Posting Periods']],
tc:[['FB50','Posting jurnal G/L'],['FB08','Reverse dokumen'],['FBS1 / F.81','Accrual dan pembalikannya di awal periode berikutnya'],['FAGL_FCV','Revaluasi saldo valuta asing'],['OB52','Buka/tutup periode posting (biasanya hanya tim GL lead)']],
integ:'Sebagian besar jurnal tidak dibuat oleh tim GL. GR (MIGO) mendebit persediaan dan mengkredit GR/IR, MIRO mengkredit vendor, billing SD mendebit piutang, payroll memposting beban gaji, dan AFAB memposting penyusutan.',
keys:['Simulate sebelum Post','Koreksi dengan reverse (FB08), bukan hapus','Tutup buku berurutan: cut-off → accrual → depresiasi → revaluasi → settlement → tutup periode'],
cp:['Jurnal biaya listrik Rp 12 jt terposting ke akun yang salah dan periodenya masih terbuka. Langkah yang benar?',['Ubah nomor akun langsung di FB02','Reverse dengan FB08, lalu posting ulang dengan akun benar','Hapus dokumen','Biarkan dan koreksi tahun depan'],1,'Akun dan jumlah tidak bisa diubah di FB02. Reverse lalu posting ulang menjaga jejak audit.']}),
L('Laporan keuangan',{p:['Neraca dan laba rugi disusun dari saldo G/L menurut <b>Financial Statement Version (FSV)</b>, yaitu susunan baris laporan (aset lancar, liabilitas, pendapatan, HPP, dan seterusnya). Satu chart of accounts bisa punya beberapa FSV, misalnya untuk manajemen dan untuk pajak.','<b>Trial balance</b> dipakai untuk memastikan semua akun seimbang sebelum laporan final. Selisih biasanya ditelusuri dengan line item (FAGLL03) sampai ke dokumen sumbernya di MM, SD, atau aset.'],
tc:[['F.01 / S_ALR_87012284','Neraca dan laba rugi berdasarkan FSV'],['S_ALR_87012277','Saldo akun G/L (trial balance)'],['Trial Balance','App Fiori trial balance dengan drill-down'],['Display Financial Statement','App Fiori laporan keuangan']],
tip:'Sebelum mengirim laporan, bandingkan saldo GR/IR, persediaan, dan aset dengan laporan sub-ledger (MB5L untuk persediaan, AR01 untuk aset). Kalau beda, ada posting yang belum lengkap.',
keys:['FSV menentukan susunan baris neraca/laba rugi','Trial balance dulu, laporan final kemudian','Selisih ditelusuri lewat line item sampai dokumen sumber'],
cp:['Saldo persediaan di neraca berbeda dari total nilai stok di laporan MM. Langkah pertama yang masuk akal?',['Posting jurnal penyesuaian sebesar selisih','Bandingkan line item akun persediaan dengan laporan sub-ledger dan cari dokumen yang tidak cocok','Ubah FSV','Abaikan karena wajar'],1,'Telusuri dulu penyebabnya. Jurnal penyesuaian tanpa investigasi menutupi masalah.']})
],
quiz:QZ([
['Tabel tunggal yang menyimpan posting FI dan CO di S/4HANA adalah…',['BKPF','ACDOCA','EKKO','MARA'],1,'ACDOCA = Universal Journal.'],
['T-code untuk memposting jurnal G/L manual?',['FB60','FB50','F-28','FS00'],1,'FB50 = enter G/L account document.'],
['Mengapa dokumen salah di-reverse, bukan dihapus?',['SAP tidak punya tombol hapus untuk dokumen terposting dan jejak audit harus tetap ada','Agar lebih cepat','Karena periode tertutup','Supaya nomor dokumen hilang'],0,'Dokumen terposting bersifat permanen; koreksi lewat dokumen pembalik.'],
['Accrual akhir bulan biasanya dibalik otomatis di awal bulan berikutnya dengan…',['F.81','F110','MIRO','KO88'],0,'FBS1 membuat accrual, F.81 membalikkannya.'],
['Apa fungsi Financial Statement Version?',['Mengatur susunan baris neraca dan laba rugi','Membuka periode','Membuat akun G/L','Mengatur hak akses'],0,'FSV = struktur laporan keuangan.']
])},

{id:'fi-ap',code:'FI-AP',cat:'fin',title:'FI – Accounts Payable (Hutang)',dur:'30 mnt',
sum:'Master vendor, invoice dengan dan tanpa PO, pembayaran otomatis F110, dan monitoring hutang.',tcs:['BP','FB60','MIRO','F110','FBL1N'],
objs:['Memahami data vendor (business partner) yang dipakai AP','Memposting invoice dengan PO (MIRO) dan tanpa PO (FB60)','Menjalankan pembayaran manual dan otomatis','Memantau dan menganalisis hutang vendor'],
note:'Catat langkah yang kamu lakukan saat vendor bertanya "invoice kami kapan dibayar?".',
lessons:[
L('Master vendor dan akun rekonsiliasi',{p:['Di S/4HANA, vendor dibuat sebagai <b>Business Partner (BP)</b> dengan role FI vendor (FLVN00) dan purchasing (FLVN01). Di ECC dipakai XK01/FK01. Data penting untuk AP: <b>reconciliation account</b> (akun hutang di G/L), <b>payment terms</b> (misalnya 30 hari), <b>payment methods</b>, data bank, dan NPWP.','Hutang tidak diposting langsung ke akun G/L hutang. Posting masuk ke akun vendor (sub-ledger), lalu SAP otomatis meneruskannya ke reconciliation account. Itulah sebabnya akun hutang di G/L selalu sama dengan total saldo vendor.'],
tc:[['BP','Membuat/mengubah business partner vendor (S/4HANA)'],['XK03 / FK03','Menampilkan vendor (ECC)'],['FK10N','Saldo vendor per periode'],['Manage Supplier Master Data','App Fiori data vendor']],
tip:'Perubahan rekening bank vendor adalah titik rawan fraud. Banyak perusahaan mewajibkan dual control (orang kedua mengonfirmasi perubahan, misalnya dengan FK08 di ECC).',
keys:['Vendor = BP dengan role FLVN00/FLVN01','Reconciliation account menghubungkan sub-ledger vendor ke G/L','Payment terms menentukan tanggal jatuh tempo'],
cp:['Total saldo semua vendor Rp 4,2 M. Berapa saldo akun G/L hutang dagang (reconciliation account) jika tidak ada posting lain ke akun itu?',['Bisa berbeda jauh','Rp 4,2 M, karena posting vendor otomatis masuk ke reconciliation account','Nol','Tergantung FSV'],1,'Reconciliation account tidak bisa diposting langsung, sehingga selalu sama dengan sub-ledger.']}),
L('Invoice vendor: dengan PO dan tanpa PO',{p:['Invoice untuk barang/jasa yang ada PO-nya diposting di <b>MIRO</b> (Logistics Invoice Verification). SAP mencocokkan PO, GR, dan invoice (3-way match). Jika qty atau harga di luar toleransi, invoice tersimpan tapi <b>blocked for payment</b> dan baru bisa dibayar setelah dirilis (MRBR) atau dikoreksi.','Invoice tanpa PO, misalnya listrik, sewa, atau jasa profesional, diposting di <b>FB60</b> langsung ke akun biaya dan objek CO (cost center/WBS). Jika data belum lengkap, simpan sebagai <b>park</b> (FV60) agar bisa dicek atasan sebelum diposting.'],
flow:[['Invoice diterima','cek PO / tanpa PO'],['MIRO atau FB60','isi tanggal, jumlah, pajak'],['Simulate','cek akun & objek biaya'],['Post / Park','nomor dokumen'],['Blocked?','MRBR untuk rilis']],
tc:[['MIRO','Invoice dengan referensi PO (3-way match)'],['FB60','Invoice vendor tanpa PO'],['FB65','Credit memo vendor'],['FV60','Park invoice untuk direview'],['MRBR','Rilis invoice yang blocked']],
integ:'MIRO memakai data PO (MM) dan GR (MIGO). Invoice blocked hampir selalu berarti GR belum lengkap atau harga PO berbeda, jadi solusinya ada di tim pembelian/gudang.',
keys:['Ada PO → MIRO; tanpa PO → FB60','Blocked for payment = 3-way match gagal','Park (FV60) untuk invoice yang perlu direview'],
cp:['Tagihan sewa gudang bulanan (tidak ada PO) masuk. T-code yang tepat?',['MIRO','FB60','F-28','ME21N'],1,'FB60 dipakai untuk invoice vendor tanpa PO.']}),
L('Pembayaran dan monitoring hutang',{p:['Pembayaran rutin dijalankan dengan <b>Automatic Payment Program (F110)</b>: isi parameter (company code, payment method, tanggal pembayaran berikutnya, vendor), buat <b>proposal</b>, review dan edit, jalankan <b>payment run</b>, lalu buat file bank (DME) atau cetak. Invoice yang blocked otomatis tidak ikut.','Pembayaran manual memakai <b>F-53</b> (posting outgoing payment dan langsung meng-clear invoice). Untuk memantau hutang, pakai <b>FBL1N</b>: open items, cleared items, jatuh tempo, dan payment block.'],
flow:[['Parameter F110','tanggal, vendor, metode'],['Proposal','daftar usulan bayar'],['Review','hapus/blok item'],['Payment run','dokumen ZP'],['File bank','DME / cetak']],
tc:[['F110','Automatic payment program'],['F-53','Outgoing payment manual'],['FBL1N','Line item vendor (open/cleared)'],['F-44','Clearing manual akun vendor'],['F-48','Down payment ke vendor'],['S_ALR_87012078','Analisis jatuh tempo hutang (aging)']],
tip:'Saat vendor menanyakan pembayaran: cari invoice di FBL1N. Jika masih open, cek kolom payment block dan jatuh tempo. Jika sudah cleared, nomor clearing document adalah bukti bayar.',
keys:['F110: parameter → proposal → run → file bank','F-53 untuk bayar manual dan langsung clearing','FBL1N untuk menjawab status invoice'],
cp:['Di F110, sebuah invoice tidak muncul di proposal walaupun sudah jatuh tempo. Penyebab yang paling mungkin?',['Invoice punya payment block (misalnya blocked dari MIRO)','Vendor punya NPWP','Invoice sudah di-park lalu diposting','Periode terbuka'],0,'Payment block membuat invoice dikecualikan dari proposal F110.']})
],
quiz:QZ([
['Di S/4HANA, vendor dibuat dengan…',['XK01','BP (Business Partner)','MM01','FS00'],1,'Vendor dan customer adalah business partner.'],
['Invoice jasa konsultan tanpa PO diposting dengan…',['MIRO','FB60','MIGO','F110'],1,'FB60.'],
['Invoice dari MIRO berstatus blocked for payment. Artinya…',['Sudah dibayar','Ada selisih qty/harga terhadap PO atau GR di luar toleransi','Vendor diblokir permanen','Periode ditutup'],1,'3-way match gagal.'],
['Langkah F110 yang memungkinkan review sebelum bayar adalah…',['Parameter','Proposal','Payment run','Print'],1,'Proposal bisa diedit sebelum payment run.'],
['Laporan untuk melihat invoice vendor yang masih terbuka dan jatuh temponya?',['FBL1N','FBL5N','MB52','KSB1'],0,'FBL1N = vendor line items.']
])},

{id:'fi-ar',code:'FI-AR',cat:'fin',title:'FI – Accounts Receivable (Piutang)',dur:'30 mnt',
sum:'Master customer, invoice dari SD dan manual, penerimaan pembayaran, dunning, dan aging piutang.',tcs:['BP','FB70','F-28','FBL5N','F150'],
objs:['Memahami data customer di BP dan hubungannya dengan SD','Mengenali invoice dari billing SD dan invoice manual','Memposting penerimaan pembayaran dan clearing','Memantau piutang, aging, dan dunning'],
note:'Tulis apa yang kamu lakukan jika customer membayar kurang dari nilai invoice.',
lessons:[
L('Master customer dan alur piutang',{p:['Customer dibuat sebagai <b>BP</b> dengan role FI customer (FLCU00) dan sales (FLCU01). Data AR penting: reconciliation account piutang, payment terms, dunning procedure, dan data kredit (dikelola FSCM Credit Management).','Sebagian besar piutang lahir otomatis dari <b>billing SD (VF01)</b>: saat billing diposting, SAP membuat dokumen akuntansi (document type RV) yang mendebit piutang customer dan mengkredit pendapatan serta PPN keluaran.'],
flow:[['Sales order','VA01'],['Delivery & PGI','VL01N'],['Billing','VF01 → dokumen RV'],['Piutang open','FBL5N'],['Pembayaran','F-28 → clearing']],
tc:[['BP','Membuat/mengubah customer'],['XD03 / FD03','Menampilkan customer (ECC)'],['FD10N','Saldo customer per periode'],['FB70','Invoice customer manual (non-SD), misalnya sewa'],['FB75','Credit memo customer manual']],
keys:['Customer = BP dengan role FLCU00/FLCU01','Billing SD otomatis membuat piutang (RV)','FB70 hanya untuk invoice di luar SD'],
cp:['Perusahaan menyewakan sebagian gudang ke pihak lain dan menagih tiap bulan tanpa proses penjualan. Invoice dibuat dengan…',['VF01','FB70','MIRO','FB60'],1,'FB70 untuk invoice customer tanpa proses SD.']}),
L('Penerimaan pembayaran dan clearing',{p:['Pembayaran customer diposting dengan <b>F-28</b> (Post Incoming Payments): isi bank, jumlah, customer, lalu pilih invoice yang dibayar sehingga statusnya menjadi cleared. Di banyak perusahaan, langkah ini otomatis dari <b>bank statement elektronik</b> (FF_5) dengan aturan pencocokan.','Jika pembayaran kurang, ada dua pilihan: <b>partial payment</b> (invoice tetap open, pembayaran tercatat sebagai item terpisah) atau <b>residual item</b> (invoice di-clear dan sisa tagihan dibuat sebagai item baru). Selisih kecil bisa dibebankan ke akun selisih sesuai toleransi.'],
tc:[['F-28','Incoming payment dan clearing'],['F-32','Clearing manual akun customer'],['FBL5N','Line item customer (open/cleared)'],['F-29','Down payment dari customer'],['Manage Customer Line Items','App Fiori line item customer']],
tip:'Selalu minta bukti transfer berisi nomor invoice. Pembayaran tanpa referensi paling sering menjadi unapplied cash yang menggantung berbulan-bulan.',
keys:['F-28 = terima pembayaran sekaligus clearing invoice','Partial payment vs residual item','Bank statement elektronik mengotomatiskan clearing'],
cp:['Customer membayar Rp 90 jt untuk invoice Rp 100 jt dan berjanji melunasi sisanya bulan depan. Kamu ingin invoice lama tertutup dan sisa Rp 10 jt muncul sebagai item baru. Pilihan di F-28?',['Partial payment','Residual item','Reverse invoice','Write-off'],1,'Residual item meng-clear invoice asli dan membuat item baru untuk sisanya.']}),
L('Aging, dunning, dan kualitas piutang',{p:['<b>Aging</b> mengelompokkan piutang berdasarkan umur jatuh tempo (belum jatuh tempo, 1–30, 31–60, 61–90, > 90 hari). Laporan ini dipakai untuk menentukan prioritas penagihan dan cadangan kerugian piutang.','<b>Dunning (F150)</b> mengirim surat pengingat bertingkat sesuai dunning procedure. Untuk proses penagihan yang lebih terstruktur (worklist, promise to pay, dispute), perusahaan memakai FSCM Collections dan Dispute Management.'],
tc:[['S_ALR_87012178','Analisis jatuh tempo piutang (aging)'],['F150','Dunning run'],['FBL5N','Open item per customer, filter jatuh tempo'],['FD32 / UKM_BP','Data kredit customer (ECC / S/4 FSCM)']],
integ:'Status kredit customer dipakai SD saat sales order dibuat. Piutang lewat jatuh tempo bisa membuat order baru otomatis tertahan (credit block).',
keys:['Aging = dasar prioritas penagihan','F150 untuk surat pengingat bertingkat','Piutang macet memengaruhi credit check di SD'],
cp:['Sales mengeluh order customer A tertahan, padahal stok ada. Hal yang perlu kamu cek di AR?',['Apakah customer punya piutang lewat jatuh tempo atau melewati limit kredit','Harga material','Movement type','Jadwal F110'],0,'Credit block di SD biasanya dipicu oleh limit kredit atau piutang overdue.']})
],
quiz:QZ([
['Billing SD yang diposting membuat dokumen akuntansi dengan document type…',['KR','RV','SA','WE'],1,'RV = billing document transfer.'],
['Invoice customer manual tanpa SD memakai…',['FB70','FB60','VF01','F-53'],0,'FB70.'],
['T-code untuk memposting penerimaan pembayaran customer dan clearing?',['F-53','F-28','F110','FB08'],1,'F-28 = incoming payment.'],
['Laporan untuk melihat piutang per kelompok umur?',['S_ALR_87012178','MB52','ME2N','CJI3'],0,'Customer open items due date analysis.'],
['Fungsi F150?',['Pembayaran vendor','Dunning (surat pengingat bertingkat)','Penyusutan','Settlement order'],1,'F150 = dunning run.']
])},

{id:'co',code:'CO',cat:'fin',title:'CO – Controlling',dur:'40 mnt',
sum:'Cost center, profit center, internal order, dan product costing untuk analisis biaya internal.',tcs:['KS03','KSB1','KE5Z','KO03','CK11N'],
objs:['Membedakan cost center, profit center, dan internal order','Membaca laporan plan vs actual','Memahami budget dan settlement internal order','Memahami standard cost dan variance produksi'],
note:'Pilih satu cost center di unitmu. Tulis tiga biaya terbesarnya dan siapa yang bisa memengaruhinya.',
lessons:[
L('Cost Center Accounting',{p:['<b>Cost center</b> adalah unit yang menanggung biaya, misalnya Produksi Line 1, Gudang, atau HR. Cost center disusun dalam <b>standard hierarchy</b> di bawah satu <b>controlling area</b>. Biaya masuk lewat <b>cost element</b>: primary (dari akun G/L seperti gaji, listrik) dan secondary (alokasi internal, misalnya assessment biaya utilitas ke departemen lain).','Siklus bulanan: plan biaya (KP06), posting aktual dari FI/MM/HR, alokasi (assessment/distribution), lalu analisis <b>plan vs actual</b>.'],
tc:[['KS01 / KS03','Membuat / menampilkan cost center'],['KP06','Planning biaya per cost element'],['KSB1','Line item biaya aktual cost center'],['S_ALR_87013611','Laporan plan/actual per cost center'],['KSU5','Menjalankan assessment']],
keys:['Cost center = tempat biaya, bukan tempat laba','Primary dari G/L, secondary dari alokasi internal','KSB1 untuk menelusuri sampai dokumen sumber'],
cp:['Manajer gudang bertanya kenapa biaya cost center-nya naik Rp 30 jt bulan ini. Laporan pertama yang paling membantu?',['KSB1 untuk line item biaya cost center tersebut','MB52','F110','VA05'],0,'KSB1 menampilkan setiap posting beserta dokumen asalnya.']}),
L('Profit Center Accounting',{p:['<b>Profit center</b> mengukur kinerja (pendapatan dan biaya) per unit bisnis, produk, atau wilayah. Di S/4HANA, profit center terisi otomatis di setiap line item Universal Journal: dari material (master plant), cost center, WBS, atau sales order.','Dengan profit center, manajemen bisa membuat laba rugi internal per lini produk. <b>Segment</b> di atas profit center dipakai untuk pelaporan segmen sesuai standar akuntansi.'],
tc:[['KE51 / KE53','Membuat / menampilkan profit center'],['KE5Z','Line item aktual profit center'],['KCH1','Profit center group/hierarki'],['Profit Center – Actuals','App Fiori analisis profit center']],
integ:'Profit center diturunkan dari objek lain. Jika profit center di master material atau cost center salah, laporan laba per lini produk ikut salah walaupun posting FI benar.',
keys:['Profit center = ukuran kinerja (laba)','Diisi otomatis dari material, cost center, WBS, sales order','Segment untuk pelaporan eksternal'],
cp:['Laporan laba per lini produk menunjukkan pendapatan produk A masuk ke profit center produk B. Penyebab yang paling mungkin?',['Profit center di master material A salah diisi','KSB1 rusak','Customer salah','F110 belum jalan'],0,'Profit center pada line item penjualan diturunkan dari master material.']}),
L('Internal Order',{p:['<b>Internal order</b> menampung biaya kegiatan sementara: event marketing, perbaikan besar, atau proyek CAPEX kecil. Order bisa diberi <b>budget</b> (KO22) sehingga SAP memberi peringatan atau menolak posting jika budget terlampaui (availability control).','Di akhir periode, biaya order di-<b>settle</b> ke penerima akhir (cost center, aset/AuC, atau G/L) sesuai <b>settlement rule</b>. Order investasi biasanya di-settle ke AuC, lalu ke aset final.'],
flow:[['KO01','buat order + settlement rule'],['KO22','budget'],['Posting biaya','PO, GI, jurnal'],['KOB1','monitor actual'],['KO88','settlement'],['TECO/close','order ditutup']],
tc:[['KO01 / KO03','Membuat / menampilkan internal order'],['KO22','Budget order'],['KOB1','Line item aktual order'],['KO88 / KO8G','Settlement satu / banyak order'],['S_ALR_87012993','Laporan plan/actual order']],
keys:['Internal order untuk kegiatan sementara','Budget + availability control mencegah overspending','Settlement memindahkan biaya ke penerima akhir'],
cp:['Event pameran selesai dan biaya Rp 75 jt masih di internal order. Supaya masuk ke cost center Marketing, yang dilakukan adalah…',['Settlement order (KO88) ke cost center Marketing','Hapus order','Jurnal manual FB50','Tidak perlu, sudah otomatis'],0,'Settlement memindahkan biaya ke penerima di settlement rule.']}),
L('Product Costing',{p:['<b>Product costing</b> menghitung biaya standar produk dari <b>BOM</b> (bahan) dan <b>routing</b> (aktivitas mesin/tenaga kerja dengan tarif dari cost center), ditambah overhead lewat costing sheet. Cost estimate dibuat dengan <b>CK11N</b>, lalu di-<b>mark & release</b> (CK24) menjadi standard price di master material.','Saat produksi, biaya aktual production order dibandingkan dengan standar. Selisihnya (<b>variance</b>, dihitung KKS2) di-settle ke laba rugi. Variance besar menandakan resep, routing, harga beli, atau efisiensi produksi tidak sesuai rencana.'],
flow:[['BOM + routing','data PP'],['CK11N','cost estimate'],['CK24','mark & release'],['Produksi','actual cost order'],['KKS2','variance'],['KO88','settle ke P&L']],
tc:[['CK11N / CK13N','Membuat / menampilkan cost estimate'],['CK24','Mark & release standard price'],['KKS2','Variance production order'],['CKMLCP','Actual costing (material ledger) di akhir periode']],
integ:'Product costing bergantung pada data PP (BOM, routing, work center) dan harga beli MM. Kesalahan qty di BOM langsung membuat standard cost salah.',
keys:['Standard cost = BOM + routing + overhead','CK11N lalu CK24 untuk menjadi harga standar','Variance = actual – standar, dianalisis tiap periode'],
cp:['Variance production order produk X selalu negatif besar karena pemakaian gula 10% lebih tinggi dari standar. Area yang perlu dicek pertama?',['Qty komponen di BOM dan pencatatan GI ke order','Data vendor','Setting F110','Profit center hierarki'],0,'Variance bahan berasal dari BOM yang tidak akurat atau pemakaian aktual yang lebih tinggi.']})
],
quiz:QZ([
['Biaya listrik bulanan untuk area Gudang dicatat ke…',['Cost center Gudang','Profit center','Customer','Material'],0,'Cost center menampung biaya unit.'],
['Objek CO yang mengukur laba per lini produk?',['Cost center','Profit center','Internal order','Cost element'],1,'Profit center.'],
['T-code settlement internal order?',['KO88','KSB1','CK11N','KE51'],0,'KO88.'],
['Standard price dirilis ke master material dengan…',['CK11N','CK24','KKS2','KP06'],1,'CK24 mark & release.'],
['Line item aktual cost center dilihat di…',['KSB1','KOB1','KE5Z','CJI3'],0,'KSB1.']
])},

{id:'tr',code:'TR',cat:'fin',title:'TR – Treasury: Kas, Bank & Likuiditas',dur:'30 mnt',
sum:'House bank, bank statement, cash position, liquidity forecast, dan transaksi treasury.',tcs:['FF_5','FF67','FF7A','FF7B','FTR_CREATE'],
objs:['Memahami house bank dan akun bank di SAP','Memproses bank statement dan rekonsiliasi','Membaca cash position dan liquidity forecast','Mengenal transaksi treasury dan pengelolaan risiko'],
note:'Tulis jadwal harian proses bank statement di perusahaanmu dan siapa yang menindaklanjuti item yang tidak cocok.',
lessons:[
L('House bank dan bank statement',{p:['Setiap rekening perusahaan dicatat sebagai <b>house bank + account ID</b> yang terhubung ke akun G/L bank. Biasanya ada akun utama bank dan beberapa <b>clearing account</b> (misalnya incoming dan outgoing) untuk menampung transaksi yang belum dicocokkan.','<b>Bank statement elektronik</b> (MT940/CAMT.053) diimpor dengan FF_5. SAP membaca baris mutasi, mencocokkan dengan invoice atau pembayaran (misalnya dari nomor referensi), lalu memposting dan meng-clear otomatis. Baris yang tidak cocok diproses manual (FEBAN).'],
flow:[['Impor statement','FF_5'],['Auto-matching','posting + clearing'],['Sisa tidak cocok','FEBAN'],['Rekonsiliasi','saldo bank = G/L']],
tc:[['FF_5','Impor bank statement elektronik'],['FF67','Bank statement manual'],['FEBAN','Postprocessing statement yang belum cocok'],['Manage Bank Accounts','App Fiori bank account management (S/4)'],['Bank Statement Monitor','App Fiori status statement per bank']],
keys:['House bank + account ID ↔ akun G/L bank','Clearing account menampung transaksi belum cocok','FF_5 impor otomatis, FEBAN untuk sisa'],
cp:['Saldo akun G/L bank berbeda dengan mutasi rekening koran. Yang paling sering menjadi penyebab?',['Baris bank statement yang belum diproses atau belum dicocokkan','FSV salah','Material master','Profit center'],0,'Item di clearing account yang belum diproses membuat saldo berbeda.']}),
L('Cash position dan liquidity forecast',{p:['<b>Cash position</b> menunjukkan posisi kas hari ini dan beberapa hari ke depan berdasarkan saldo bank dan transaksi yang segera terjadi. <b>Liquidity forecast</b> melihat lebih jauh: piutang yang akan masuk, hutang yang akan jatuh tempo, PO, dan sales order.','Data dikelompokkan dalam <b>planning level</b> dan <b>planning group</b> (misalnya vendor lokal, vendor impor, customer domestik). Transaksi yang belum ada di sistem (misalnya rencana pajak) bisa dimasukkan sebagai <b>memo record</b> (FF63).'],
tc:[['FF7A','Cash position'],['FF7B','Liquidity forecast'],['FF63','Memo record'],['Cash Position / Cash Flow Analyzer','App Fiori cash management S/4']],
integ:'Forecast mengambil data dari AP (jatuh tempo invoice), AR (perkiraan penerimaan), MM (PO), dan SD (sales order). Data jatuh tempo yang salah di modul lain membuat forecast kas meleset.',
keys:['Cash position = jangka sangat pendek','Liquidity forecast = mingguan/bulanan dari AP, AR, MM, SD','Memo record untuk rencana yang belum ada dokumennya'],
cp:['Treasury ingin tahu apakah kas cukup untuk pembayaran vendor besar dua minggu lagi. Laporan yang paling tepat?',['Liquidity forecast (FF7B)','MB52','KSB1','FBL3N'],0,'Liquidity forecast menggabungkan arus masuk dan keluar ke depan.']}),
L('Transaksi treasury dan risiko',{p:['Modul Treasury & Risk Management mencatat <b>deal</b> seperti deposito berjangka, pinjaman, dan forward valas dengan FTR_CREATE. Setiap deal punya siklus: kontrak → settlement → posting ke FI → jatuh tempo.','Pembayaran keluar dalam jumlah besar biasanya lewat <b>Bank Communication Management (BCM)</b>: file pembayaran dari F110 dikumpulkan, disetujui berjenjang, lalu dikirim ke bank. Ini mengurangi risiko pembayaran ganda atau tidak sah.'],
tc:[['FTR_CREATE','Membuat deal treasury'],['FTR_EDIT','Mengubah/menampilkan deal'],['BNK_APP','Approval batch pembayaran (BCM)'],['TPM1','Valuasi akhir periode transaksi keuangan']],
tip:'Pisahkan peran pembuat deal, approver, dan yang memposting ke FI (segregation of duties). Ini sering menjadi temuan audit treasury.',
keys:['Deal: kontrak → settlement → posting → jatuh tempo','BCM menambah approval berjenjang untuk pembayaran','Pisahkan peran pembuat dan approver'],
cp:['Kenapa pembayaran hasil F110 sebaiknya lewat approval BCM sebelum dikirim ke bank?',['Agar ada kontrol berjenjang dan mencegah pembayaran tidak sah atau ganda','Agar invoice ter-clear','Agar periode tertutup','Tidak ada manfaatnya'],0,'BCM menambah lapisan kontrol sebelum uang keluar.']})
],
quiz:QZ([
['T-code impor bank statement elektronik?',['FF_5','F110','FB50','MIRO'],0,'FF_5.'],
['Laporan posisi kas hari ini dan beberapa hari ke depan?',['FF7A','FF7B','FBL1N','F.01'],0,'FF7A cash position.'],
['Transaksi yang belum ada dokumennya tapi perlu masuk forecast dicatat sebagai…',['Memo record (FF63)','Purchase order','Accrual','Dunning'],0,'Memo record.'],
['Deal deposito berjangka dibuat dengan…',['FTR_CREATE','ME21N','FB60','KO01'],0,'FTR_CREATE.'],
['Baris bank statement yang tidak otomatis cocok diproses di…',['FEBAN','MB51','VA02','IW38'],0,'FEBAN postprocessing.']
])},

{id:'fscm',code:'FSCM',cat:'fin',title:'FSCM – Credit, Dispute & Collections',dur:'30 mnt',
sum:'Credit management, dispute management, dan collections management untuk piutang yang sehat.',tcs:['UKM_BP','UKM_CASE','UDM_DISPUTE','UDM_SPECIALIST'],
objs:['Mengatur limit kredit dan memahami credit check di sales order','Mencatat dan menyelesaikan dispute piutang','Bekerja dengan worklist collections dan promise to pay'],
note:'Tulis tiga alasan dispute yang paling sering dari customer-mu dan siapa yang menyelesaikannya.',
lessons:[
L('Credit management',{p:['Setiap customer punya <b>credit segment</b> di BP (role UKM000) berisi <b>credit limit</b>, <b>risk class</b>, dan score. Saat sales order atau delivery dibuat, SD menjalankan <b>credit check</b>: jika exposure (piutang + order terbuka) melebihi limit atau ada piutang overdue, dokumen diberi <b>credit block</b>.','Credit analyst memutuskan dokumen yang tertahan: rilis, tolak, atau minta jaminan. Keputusan tercatat di <b>documented credit decision</b> sehingga bisa diaudit.'],
flow:[['Sales order','VA01'],['Credit check','limit & overdue'],['Credit block','order tertahan'],['Review','UKM_CASE'],['Rilis / tolak','order lanjut']],
tc:[['UKM_BP','Data kredit business partner'],['UKM_CASE','Credit case / documented credit decision'],['UKM_MY_DCDS','Daftar keputusan kredit milik saya'],['VKM1 / VKM3','Rilis dokumen SD yang diblokir (ECC)']],
keys:['Credit segment: limit, risk class, score','Credit check di SD menghasilkan credit block','Keputusan rilis terdokumentasi'],
cp:['Exposure customer Rp 480 jt, limit Rp 500 jt. Order baru Rp 50 jt dibuat. Apa yang terjadi?',['Order masuk credit block karena exposure menjadi Rp 530 jt','Order langsung jalan','Customer dihapus','Invoice dibatalkan'],0,'Exposure baru melewati limit sehingga credit check menahan order.']}),
L('Dispute management',{p:['<b>Dispute case</b> dibuat saat customer menolak membayar sebagian/seluruh invoice, misalnya karena harga tidak sesuai, barang rusak, atau qty kurang. Case bisa dibuat langsung dari residual item di F-28 atau dari FBL5N.','Case punya <b>reason</b>, <b>root cause</b>, nominal sengketa, dan orang yang bertanggung jawab (sales, gudang, QC). Saat selesai, hasilnya bisa credit memo, write-off, atau customer membayar penuh. Laporan dispute membantu menemukan masalah berulang.'],
tc:[['UDM_DISPUTE','Mengelola dispute case'],['FBL5N','Membuat dispute dari line item customer'],['Manage Dispute Cases','App Fiori dispute']],
integ:'Penyelesaian dispute sering butuh data dari SD (harga, delivery), QM (barang rusak), dan LE (bukti terima). Credit memo dibuat di SD lalu diposting ke AR.',
keys:['Dispute = alasan + root cause + penanggung jawab','Bisa dibuat dari pembayaran kurang (residual)','Hasil: credit memo, write-off, atau bayar penuh'],
cp:['Customer membayar kurang Rp 5 jt karena 10 karton rusak saat diterima. Langkah yang tepat?',['Buat dispute case dengan reason barang rusak dan libatkan gudang/QC','Langsung write-off','Hapus invoice','Blok customer selamanya'],0,'Dispute case mendokumentasikan dan mengarahkan penyelesaian ke pihak yang tepat.']}),
L('Collections management',{p:['Collections management membuat <b>worklist</b> harian untuk collector berdasarkan <b>collection strategy</b> (misalnya prioritas nilai overdue tertinggi atau customer berisiko tinggi).','Collector menelepon customer, mencatat hasilnya, dan merekam <b>promise to pay</b>. Jika janji tidak ditepati, item naik prioritas di worklist berikutnya. Supervisor memantau beban kerja dan hasil tiap collector.'],
tc:[['UDM_SPECIALIST','Worklist collector'],['UDM_SUPERVISOR','Monitoring dan pembagian worklist'],['Process Receivables','App Fiori untuk collector']],
keys:['Collection strategy menentukan prioritas','Promise to pay tercatat dan dipantau','Supervisor memantau worklist tim'],
cp:['Customer berjanji membayar Jumat. Apa yang sebaiknya dicatat di sistem?',['Promise to pay dengan tanggal dan nominal','Tidak perlu dicatat','Dispute case','Credit memo'],0,'Promise to pay membuat tindak lanjut otomatis jika janji tidak dipenuhi.']})
],
quiz:QZ([
['Credit block di sales order biasanya disebabkan oleh…',['Exposure melewati limit atau ada piutang overdue','Harga material','Movement type','Profit center'],0,'Credit check.'],
['Dispute case dikelola dengan…',['UDM_DISPUTE','UKM_BP','F110','MIRO'],0,'UDM_DISPUTE.'],
['Worklist harian collector ada di…',['UDM_SPECIALIST','FB60','KO88','CK11N'],0,'UDM_SPECIALIST.'],
['Data credit limit customer di S/4HANA disimpan di…',['Credit segment business partner (UKM_BP)','Master material','Cost center','Vendor'],0,'UKM_BP.'],
['Promise to pay berguna untuk…',['Memantau janji bayar dan menaikkan prioritas jika tidak ditepati','Memblokir vendor','Menutup periode','Menghitung penyusutan'],0,'Bagian collections management.']
])}
];

/* ===================== LOGISTIK & HR ===================== */
const MODS_LOG=[
{id:'sd',code:'SD',cat:'log',title:'SD – Sales & Distribution',dur:'40 mnt',
sum:'Order to cash: struktur penjualan, sales order, pricing, delivery, billing, dan retur.',tcs:['VA01','VA03','VL01N','VF01','VA05'],
objs:['Memahami sales area dan master data penjualan','Mengikuti alur order to cash dan document flow','Membuat sales order dengan pricing dan tanggal yang benar','Memproses delivery, PGI, billing, dan retur'],
note:'Tulis urutan dokumen order to cash di perusahaanmu beserta siapa yang membuat tiap dokumen.',
lessons:[
L('Struktur organisasi & master data penjualan',{p:['Penjualan terjadi dalam <b>sales area</b> = sales organization + distribution channel + division. Contoh: sales org 1000, channel 10 (modern trade), division 00. Pengiriman dilakukan dari <b>shipping point</b> di plant.','Master data utama: <b>customer (BP)</b> dengan data sales area (payment terms, incoterms, partner function sold-to/ship-to/bill-to/payer), <b>material</b> dengan view Sales, dan <b>condition record</b> harga/diskon.'],
tc:[['BP','Customer dengan data sales area'],['VK11 / VK13','Membuat / menampilkan condition record harga'],['VD51','Customer-material info (kode material versi customer)'],['MM03','View Sales: Sales Org dan Sales: General/Plant']],
keys:['Sales area = sales org + channel + division','Partner function: sold-to, ship-to, bill-to, payer','Harga dari condition record (VK11)'],
cp:['Customer modern trade punya banyak gudang tujuan, tetapi tagihan dikirim ke kantor pusat. Partner function apa yang membedakan alamat kirim dan alamat tagih?',['Ship-to dan bill-to','Vendor dan plant','Sales org dan division','Sold-to dan material'],0,'Ship-to = tujuan kirim, bill-to = penerima tagihan.']}),
L('Alur order to cash',{p:['Satu transaksi penjualan menghasilkan rangkaian dokumen yang saling terhubung. <b>Document flow</b> (tombol di VA03/VL03N/VF03) menunjukkan seluruh rantai: order, delivery, transfer order/picking, goods issue, billing, dan dokumen akuntansi.','Setiap langkah punya pemilik: sales admin membuat order, gudang memproses delivery dan PGI, billing dibuat sales admin atau otomatis (VF04), dan AR menerima pembayaran.'],
flow:[['Inquiry/quotation','VA11 / VA21'],['Sales order','VA01'],['Delivery','VL01N'],['Picking & PGI','mvt 601'],['Billing','VF01'],['Pembayaran','F-28']],
tc:[['VA01 / VA02 / VA03','Membuat / mengubah / menampilkan sales order'],['VA05','Daftar sales order'],['VL01N','Outbound delivery dengan referensi order'],['VF01','Billing document'],['VF04','Billing due list (kolektif)']],
integ:'PGI (movement type 601) mengurangi stok dan memposting HPP di FI. Billing memposting piutang dan pendapatan. Jadi satu order menyentuh MM, LE, FI, dan CO-PA.',
keys:['Order → delivery → PGI (601) → billing → pembayaran','Document flow menunjukkan status seluruh rantai','PGI = stok berkurang + HPP; billing = piutang + pendapatan'],
cp:['Customer bilang barang sudah diterima tapi belum ada tagihan. Di document flow sales order terlihat delivery dan goods issue selesai. Langkah yang belum dilakukan?',['Billing (VF01)','Sales order','Picking','Credit check'],0,'Setelah PGI, langkah berikutnya adalah billing.']}),
L('Membuat sales order',{p:['Di VA01 pilih <b>order type</b> (OR = standard order) dan sales area. Isi sold-to, ship-to, <b>PO number customer</b>, requested delivery date, lalu item material dan qty. SAP otomatis menghitung harga (condition type harga seperti PR00, atau PPR0 di S/4HANA, lalu diskon dan pajak), menjalankan <b>availability check (ATP)</b>, dan credit check.','Perhatikan <b>incompletion log</b>: jika data wajib belum lengkap (misalnya payment terms atau harga), order tersimpan tapi tidak bisa dikirim atau ditagih. Cek juga blok (credit block, delivery block, billing block) di header.'],
tc:[['VA01','Create sales order'],['V.02','Daftar order yang belum lengkap (incomplete)'],['VA14L','Sales document blocked for delivery'],['CO09','Availability overview material']],
tip:'Selalu isi PO number customer. Banyak customer menolak invoice tanpa nomor PO mereka, dan nomor ini memudahkan rekonsiliasi pembayaran.',
keys:['OR = standard order','Pricing, ATP, dan credit check berjalan otomatis','Incompletion log dan blok harus bersih sebelum kirim'],
cp:['Order tersimpan dengan pesan "Document is incomplete". Akibatnya?',['Order mungkin tidak bisa di-deliver atau ditagih sampai datanya dilengkapi','Order otomatis terhapus','Stok langsung berkurang','Tidak ada akibat'],0,'Incompletion log memblokir proses berikutnya sesuai konfigurasi.']}),
L('Delivery, billing, dan retur',{p:['Delivery (VL01N) dibuat dari order yang jatuh tempo kirim. Gudang melakukan picking (bisa lewat transfer order WM/EWM), packing, lalu <b>Post Goods Issue</b>. Monitor semua delivery dengan VL06O.','Billing (VF01) mengambil harga dari order dan qty dari delivery. Untuk retur: buat <b>returns order</b> (order type RE), returns delivery dan goods receipt (mvt 651), lalu <b>credit memo</b> untuk customer.'],
flow:[['VL01N','delivery'],['Picking','TO / warehouse task'],['PGI','601'],['VF01','billing F2'],['Retur','RE → 651 → credit memo']],
tc:[['VL01N / VL02N','Membuat / mengubah delivery, termasuk PGI'],['VL06O','Outbound delivery monitor'],['VF01 / VF03','Membuat / menampilkan billing'],['VF11','Membatalkan billing']],
keys:['PGI dilakukan di delivery','Billing = harga dari order, qty dari delivery','Retur: RE order → 651 → credit memo'],
cp:['Billing sudah dibuat tetapi harga salah. Cara koreksi yang benar?',['Batalkan billing dengan VF11, perbaiki harga/kondisi, lalu billing ulang','Ubah jumlah di FB02','Hapus delivery','Buat sales order baru tanpa membatalkan'],0,'Billing dibatalkan dengan VF11 sehingga dokumen akuntansinya ikut dibalik.']})
],
quiz:QZ([
['Sales area terdiri dari…',['Sales org + distribution channel + division','Plant + sloc','Company code + plant','Customer + material'],0,'Sales area.'],
['Movement type saat PGI delivery penjualan?',['101','601','261','311'],1,'601.'],
['T-code membuat billing document?',['VF01','VL01N','VA01','MIRO'],0,'VF01.'],
['Laporan untuk memantau outbound delivery?',['VL06O','ME2N','MB52','CJI3'],0,'VL06O.'],
['Urutan yang benar…',['VA01 → VL01N → PGI → VF01','VF01 → VA01 → VL01N','VL01N → VA01 → VF01','VA01 → VF01 → VL01N'],0,'Order, delivery, PGI, billing.']
])},

{id:'pp',code:'PP',cat:'log',title:'PP – Production Planning',dur:'35 mnt',
sum:'BOM, work center, routing, MRP, planned order, production order, dan konfirmasi produksi.',tcs:['CS03','MD04','MD01N','CO01','CO11N'],
objs:['Memahami master data produksi: BOM, work center, routing','Menjalankan dan membaca hasil MRP (MD04)','Membuat, merilis, dan mengonfirmasi production order','Menutup order dan memahami settlement'],
note:'Pilih satu produk. Tulis komponen BOM utamanya dan work center yang dilalui.',
lessons:[
L('Master data produksi',{p:['<b>BOM</b> (bill of material) berisi komponen dan qty untuk membuat satu produk. <b>Work center</b> adalah mesin atau line produksi dengan kapasitas dan tarif aktivitas. <b>Routing</b> berisi urutan operasi di work center beserta waktu standar.','BOM dan routing dihubungkan oleh <b>production version</b>. View MRP di master material menentukan cara perencanaan: MRP type (PD), lot size, safety stock, dan in-house production time.'],
tc:[['CS01 / CS03','Membuat / menampilkan BOM'],['CR01 / CR03','Membuat / menampilkan work center'],['CA01 / CA03','Membuat / menampilkan routing'],['C223','Production version']],
integ:'BOM dan routing juga dipakai CO untuk menghitung standard cost (CK11N). Kesalahan qty BOM berdampak ke perencanaan dan biaya sekaligus.',
keys:['BOM = apa yang dibutuhkan','Routing = bagaimana dan di mana dibuat','Production version menghubungkan keduanya'],
cp:['Produksi selalu kekurangan kemasan karena pemakaian riil 1.050 pcs per 1.000 produk, sedangkan BOM mencatat 1.000. Apa yang perlu diperbaiki?',['Qty atau scrap komponen kemasan di BOM','Routing','Data vendor','Profit center'],0,'BOM menentukan kebutuhan komponen di MRP.']}),
L('MRP dan MD04',{p:['<b>MRP</b> membandingkan kebutuhan (sales order, forecast/PIR dari MD61, reservasi) dengan stok dan penerimaan yang sudah direncanakan. Jika kurang, MRP membuat <b>planned order</b> (produksi sendiri) atau <b>purchase requisition</b> (beli).','<b>MD04</b> (stock/requirements list) adalah layar paling penting planner: daftar kebutuhan dan penerimaan per tanggal dengan stok tersedia berjalan, ditambah <b>exception message</b> seperti "reschedule in" atau "start date in the past".'],
flow:[['PIR / sales order','MD61, VA01'],['MRP run','MD01N / MD02'],['MD04','evaluasi + exception'],['Konversi','planned order → production order / PR']],
tc:[['MD61','Planned independent requirements (forecast)'],['MD01N','MRP Live (S/4HANA)'],['MD02','MRP satu material'],['MD04','Stock/requirements list'],['MD07','Stock/requirements list kolektif (banyak material sekaligus)'],['MD06','MRP list kolektif, hanya untuk MRP klasik (MD01/MD02)']],
keys:['MRP: kebutuhan vs stok + penerimaan','Hasil: planned order atau purchase requisition','MD04 + exception message = alat kerja harian planner'],
cp:['Di MD04 muncul exception "Reschedule in" untuk sebuah PO bahan baku. Artinya…',['Penerimaan PO itu terlalu lambat; perlu dimajukan agar stok tidak minus','PO harus dihapus','Stok berlebih','Tidak ada masalah'],0,'Reschedule in = majukan tanggal penerimaan.']}),
L('Production order sampai penutupan',{p:['Planned order dikonversi menjadi <b>production order</b> (CO40) atau dibuat langsung dengan <b>CO01</b>. Setelah di-<b>release</b>, shop floor bisa mengambil komponen (GI 261, sering lewat backflush) dan melaporkan hasil dengan <b>konfirmasi CO11N</b>.','Barang jadi diterima ke gudang dengan GR 101 terhadap order (bisa otomatis saat konfirmasi). Setelah selesai, order di-<b>TECO</b>, variance dihitung, dan biaya di-settle (KO88).'],
flow:[['CO01 / CO40','buat order'],['Release','status REL'],['GI 261','komponen'],['CO11N','konfirmasi'],['GR 101','barang jadi'],['TECO + settle','KO88']],
tc:[['CO01 / CO02 / CO03','Membuat / mengubah / menampilkan production order'],['CO40','Konversi planned order'],['CO11N','Konfirmasi operasi'],['COOIS','Daftar production order (info system)'],['COHV','Mass processing order']],
keys:['Order harus REL sebelum GI dan konfirmasi','GI 261 komponen, GR 101 barang jadi','TECO lalu settlement'],
cp:['Operator tidak bisa melakukan konfirmasi di CO11N untuk order baru. Penyebab yang paling mungkin?',['Order belum di-release','BOM terlalu panjang','Customer belum bayar','Periode FI tertutup'],0,'Konfirmasi butuh status REL.']})
],
quiz:QZ([
['Laporan kebutuhan vs stok per material untuk planner?',['MD04','MB52','ME5A','FBL1N'],0,'MD04.'],
['Output MRP untuk material yang dibeli dari vendor?',['Purchase requisition','Production order','Sales order','Billing'],0,'Purchase requisition.'],
['Konfirmasi produksi dengan…',['CO11N','CO01','CS03','MD61'],0,'CO11N.'],
['Movement type komponen dikeluarkan ke production order?',['261','101','601','221'],0,'261.'],
['Routing berisi…',['Urutan operasi di work center dan waktu standar','Daftar komponen','Harga jual','Data customer'],0,'Routing.']
])},

{id:'qm',code:'QM',cat:'log',title:'QM – Quality Management',dur:'30 mnt',
sum:'Inspection lot, result recording, usage decision, dan quality notification.',tcs:['QA32','QE51N','QA11','QM01'],
objs:['Memahami master data inspeksi','Memproses inspection lot dari GR sampai usage decision','Mencatat keluhan dengan quality notification'],
note:'Tulis tiga karakteristik inspeksi yang paling penting untuk bahan baku di perusahaanmu.',
lessons:[
L('Master data QM',{p:['QM aktif per material lewat view <b>Quality Management</b> dengan <b>inspection type</b>: 01 (GR dari pembelian), 04 (GR dari produksi), 89 (inspeksi lain). Jika aktif, GR masuk ke stok <b>quality inspection</b>, bukan unrestricted.','Apa yang diperiksa ditentukan oleh <b>inspection plan</b> (QP01) berisi <b>master inspection characteristic</b> (QS21) seperti kadar air, warna, berat, ditambah <b>sampling procedure</b> (berapa sampel).'],
tc:[['QS21 / QS23','Master inspection characteristic'],['QP01 / QP03','Inspection plan'],['QDV1','Sampling procedure'],['MM02 (view QM)','Mengaktifkan inspection type di material']],
keys:['Inspection type 01 = GR pembelian, 04 = GR produksi','GR material QM masuk ke stok quality inspection','Inspection plan + karakteristik + sampling'],
cp:['Setelah GR, bahan baku tidak muncul di stok unrestricted tetapi di quality inspection. Kenapa?',['Material punya inspection type 01 aktif sehingga harus diperiksa QC dulu','GR gagal','Vendor diblokir','Material salah'],0,'Itu perilaku normal QM.']}),
L('Inspection lot sampai usage decision',{p:['GR membuat <b>inspection lot</b> otomatis. QC melihat lot terbuka di worklist <b>QA32</b>, mengambil sampel, dan mencatat hasil per karakteristik (<b>QE51N</b>).','Keputusan akhir adalah <b>usage decision</b> (QA11): accept atau reject. Di tab stock posting, stok dipindah dari quality inspection ke unrestricted, blocked, scrap, atau retur ke vendor.'],
flow:[['GR 101','lot dibuat'],['QA32','worklist'],['QE51N','hasil uji'],['QA11','usage decision'],['Stock posting','unrestricted / blocked']],
tc:[['QA32','Worklist inspection lot'],['QE51N','Result recording'],['QA11','Usage decision'],['QA33','Daftar inspection lot']],
integ:'Sampai usage decision, stok QI tidak bisa dipakai produksi atau dikirim. Lot yang menumpuk di QA32 sering menjadi penyebab material "ada tapi tidak bisa dipakai".',
keys:['Lot dibuat otomatis saat GR','Hasil dicatat per karakteristik','Usage decision menentukan nasib stok'],
cp:['Produksi butuh bahan yang sudah lolos uji lab, tapi stoknya masih di QI. Apa yang belum dilakukan QC?',['Usage decision dengan stock posting ke unrestricted (QA11)','GR ulang','Membuat PO','Konfirmasi produksi'],0,'Usage decision memindahkan stok ke unrestricted.']}),
L('Quality notification',{p:['<b>Quality notification</b> (QM01) mencatat masalah mutu: keluhan customer (Q1), keluhan ke vendor (Q2), atau masalah internal (Q3). Isinya defect, penyebab, tugas perbaikan, dan penanggung jawab, mirip format 8D.','Notifikasi bisa dibuat dari usage decision (reject) atau dari keluhan customer. Laporan notifikasi membantu menilai kinerja vendor dan masalah berulang.'],
tc:[['QM01 / QM02 / QM03','Membuat / mengubah / menampilkan notification'],['QM10','Daftar notification'],['QGA2','Menampilkan hasil inspeksi']],
keys:['Q1 customer, Q2 vendor, Q3 internal','Isi: defect, cause, task, responsible','Dasar evaluasi vendor dan perbaikan berulang'],
cp:['Bahan dari vendor berulang kali gagal uji kadar air. Dokumen QM yang tepat untuk menindaklanjuti ke vendor?',['Quality notification ke vendor (Q2)','Sales order','Production order','Cost center'],0,'Q2 untuk keluhan ke vendor.']})
],
quiz:QZ([
['Inspection type untuk GR dari pembelian?',['01','04','89','101'],0,'01.'],
['Worklist inspection lot?',['QA32','QM01','MD04','VL06O'],0,'QA32.'],
['Result recording dengan…',['QE51N','QA11','QS21','QP01'],0,'QE51N.'],
['Usage decision memindahkan stok QI ke…',['Unrestricted, blocked, atau scrap sesuai keputusan','Vendor otomatis','Cost center','Sales order'],0,'Stock posting.'],
['Keluhan customer dicatat sebagai notification tipe…',['Q1','Q2','Q3','M1'],0,'Q1.']
])},

{id:'pm',code:'PM',cat:'log',title:'PM – Plant Maintenance',dur:'35 mnt',
sum:'Functional location, equipment, notification, work order, dan preventive maintenance.',tcs:['IE03','IW21','IW31','IW41','IP10'],
objs:['Memahami struktur objek teknis','Menjalankan corrective maintenance dari notification sampai TECO','Mengatur preventive maintenance plan'],
note:'Tulis satu mesin kritis di plant-mu dan jadwal perawatan preventifnya.',
lessons:[
L('Objek teknis',{p:['<b>Functional location</b> (IL01) adalah posisi di plant, misalnya PLANT1-LINE3-CONV. <b>Equipment</b> (IE01) adalah mesin fisik yang dipasang di posisi itu dan bisa dipindah. Equipment punya data pabrikan, nomor seri, cost center, dan bisa terhubung ke aset FI-AA.','<b>Measuring point</b> (IK01) mencatat pembacaan seperti jam operasi atau suhu, yang bisa memicu perawatan berbasis kondisi.'],
tc:[['IL01 / IL03','Functional location'],['IE01 / IE03','Equipment'],['IK01 / IK11','Measuring point / measurement document'],['IH01','Struktur objek teknis']],
keys:['Functional location = posisi, equipment = mesin fisik','Equipment bisa dipindah antar lokasi','Measuring point untuk perawatan berbasis kondisi'],
cp:['Motor conveyor dicopot dan dipasang di line lain. Objek mana yang berpindah?',['Equipment','Functional location','Plant','Cost element'],0,'Equipment dipasang/dilepas dari functional location.']}),
L('Corrective maintenance',{p:['Masalah dilaporkan dengan <b>notification</b> (IW21): M2 untuk kerusakan, M1 untuk permintaan perawatan. Planner mengubahnya menjadi <b>maintenance order</b> (IW31, misalnya PM01) dengan operasi, tenaga kerja, dan komponen sparepart.','Komponen stok membuat reservasi dan diambil dengan GI 261. Teknisi melapor dengan <b>konfirmasi</b> (IW41). Setelah selesai, order di-<b>TECO</b> dan biaya di-settle ke cost center pemilik mesin.'],
flow:[['IW21','notification'],['IW31','order'],['Release','REL'],['GI 261','sparepart'],['IW41','konfirmasi'],['TECO','settle biaya']],
tc:[['IW21 / IW28','Membuat / daftar notification'],['IW31 / IW32 / IW33','Membuat / mengubah / menampilkan order'],['IW41','Konfirmasi waktu kerja'],['IW38 / IW39','Daftar order (change/display)']],
integ:'Sparepart diambil dari MM (reservasi, GI 261), jasa luar lewat PR/PO, dan biaya order di-settle ke CO. Order yang tidak di-TECO membuat biaya menggantung.',
keys:['Notification → order → release → GI → konfirmasi → TECO','GI sparepart ke order memakai 261','Settle biaya ke cost center pemilik mesin'],
cp:['Teknisi butuh bearing dari gudang untuk order perbaikan 4000123. Movement type?',['261','201','221','101'],0,'GI ke order = 261.']}),
L('Preventive maintenance',{p:['<b>Maintenance plan</b> (IP41 untuk single cycle) menjadwalkan pekerjaan rutin, misalnya pelumasan setiap 30 hari atau ganti belt setiap 2.000 jam operasi. Isi pekerjaan diambil dari <b>task list</b> (IA05).','<b>IP10</b> menjadwalkan plan pertama kali. Setelah itu <b>IP30</b> (deadline monitoring, biasanya background job) otomatis membuat order sesuai jadwal.'],
tc:[['IA05 / IA01','Task list general / equipment'],['IP41 / IP42','Maintenance plan single / strategy'],['IP10','Penjadwalan plan'],['IP30','Deadline monitoring'],['IP24','Overview jadwal']],
keys:['Task list = isi pekerjaan','Maintenance plan = kapan dikerjakan','IP10 untuk mulai, IP30 untuk otomatis'],
cp:['Plan pelumasan sudah dibuat tapi tidak pernah muncul order. Kemungkinan besar…',['Plan belum dijadwalkan (IP10) atau IP30 tidak berjalan','Equipment salah warna','Customer belum bayar','BOM kosong'],0,'Plan harus dijadwalkan agar membuat order.']})
],
quiz:QZ([
['Laporan kerusakan mesin dibuat dengan…',['IW21','IW31','IP10','IE01'],0,'IW21.'],
['Konfirmasi pekerjaan maintenance?',['IW41','CO11N','QA11','VL02N'],0,'IW41.'],
['Mesin fisik yang bisa dipindah dicatat sebagai…',['Equipment','Functional location','Work center','Storage bin'],0,'Equipment.'],
['Penjadwalan pertama maintenance plan?',['IP10','IP41','IA05','IW38'],0,'IP10.'],
['Daftar maintenance order untuk dimonitor?',['IW38 / IW39','ME2N','MB51','FBL5N'],0,'IW38/IW39.']
])},

{id:'wm',code:'WM/EWM',cat:'log',title:'WM / EWM – Warehouse Management',dur:'35 mnt',
sum:'Storage type, bin, transfer order, warehouse task, dan monitor gudang.',tcs:['LS03N','LT01','LT12','LX02','/SCWM/MON'],
objs:['Memahami struktur gudang: warehouse number, storage type, bin','Membuat dan mengonfirmasi transfer order (WM)','Mengenal proses EWM: warehouse task, warehouse order, monitor'],
note:'Gambar sketsa gudangmu: storage type dan contoh nama bin.',
lessons:[
L('Struktur gudang',{p:['IM (MIGO, MB52) tahu stok di level <b>storage location</b>. WM/EWM menambah detail sampai <b>storage bin</b> (rak/posisi). Strukturnya: <b>warehouse number</b> → <b>storage type</b> (misalnya rak tinggi, bulk, area staging) → storage section → <b>bin</b>. Stok di satu bin disebut <b>quant</b>.','Classic WM (LE-WM) ada di ECC dan masih bisa dipakai sementara di S/4HANA sebagai compatibility. Arah SAP sekarang adalah <b>EWM</b>, baik embedded di S/4HANA maupun decentralized.'],
tc:[['LS01N / LS03N','Membuat / menampilkan storage bin'],['LX02','Stok per bin (WM)'],['LS26','Stok per material di gudang'],['/SCWM/MON','Warehouse monitor EWM']],
keys:['Sloc (IM) vs bin (WM/EWM)','Warehouse number → storage type → bin','Quant = stok di satu bin'],
cp:['MB52 menunjukkan 100 karton di sloc 1001, tetapi picker tidak tahu raknya. Data apa yang dibutuhkan?',['Stok per bin dari WM/EWM (misalnya LX02)','Data vendor','Billing','Cost center'],0,'Lokasi rak ada di level bin.']}),
L('Transfer order (WM)',{p:['Setiap perpindahan fisik di WM dieksekusi dengan <b>transfer order (TO)</b>. GR dari MIGO membuat <b>transfer requirement</b> untuk putaway; delivery penjualan membutuhkan TO untuk picking (LT03).','TO menentukan bin asal dan tujuan sesuai strategi (misalnya putaway ke bin kosong terdekat, picking FIFO). Setelah barang benar-benar dipindah, TO harus <b>dikonfirmasi</b> (LT12). TO yang belum dikonfirmasi membuat stok di sistem dan fisik berbeda.'],
flow:[['GR / delivery','TR atau kebutuhan'],['LT01 / LT03','buat TO'],['Pindah fisik','scan bin'],['LT12','konfirmasi']],
tc:[['LT01','Membuat transfer order manual'],['LT03','TO untuk outbound delivery'],['LT12','Konfirmasi TO'],['LB10','Daftar transfer requirement'],['LT21','Menampilkan satu transfer order'],['LT22 / LT23 / LT24','Daftar TO per storage type / per nomor TO / per material'],['LT10','Membuat TO dari stock list untuk pindah bin']],
keys:['Semua perpindahan bin lewat TO','Putaway dan picking mengikuti strategi','TO harus dikonfirmasi'],
cp:['Barang sudah dipindah ke rak, tetapi sistem masih menunjukkan stok di area penerimaan. Kemungkinan…',['TO belum dikonfirmasi (LT12)','PO belum dibuat','Billing belum jalan','Material dihapus'],0,'Konfirmasi TO memperbarui posisi stok.']}),
L('Proses EWM',{p:['Di EWM, unit kerjanya adalah <b>warehouse task</b> (WT), dikelompokkan menjadi <b>warehouse order</b> untuk satu operator. Dokumen masuk/keluar adalah <b>inbound/outbound delivery</b> EWM. Operator bekerja dengan perangkat RF (scanner) lewat <b>/SCWM/RFUI</b>.','<b>Warehouse monitor</b> (/SCWM/MON) adalah pusat kontrol: WT terbuka, wave, stok per bin, dan pengecualian. Fitur lanjutan: wave management, slotting, labor management, dan yard management.'],
flow:[['Inbound delivery','/SCWM/PRDI'],['Unloading & GR',''],['Putaway WT','RF scanner'],['Outbound','/SCWM/PRDO'],['Wave & picking WT',''],['Loading & GI','']],
tc:[['/SCWM/MON','Warehouse monitor'],['/SCWM/PRDI','Inbound delivery'],['/SCWM/PRDO','Outbound delivery'],['/SCWM/RFUI','Layar RF untuk operator'],['/SCWM/PI_PROCESS','Physical inventory EWM']],
keys:['WT = tugas pindah, WO = paket tugas operator','/SCWM/MON pusat kontrol gudang','Operator memakai RF (/SCWM/RFUI)'],
cp:['Supervisor gudang ingin melihat semua warehouse task yang belum selesai pagi ini. Tempat paling tepat?',['Warehouse monitor /SCWM/MON','MB52','VA05','KSB1'],0,'Monitor EWM menampilkan WT terbuka.']})
],
quiz:QZ([
['Level lokasi paling detail di WM/EWM?',['Storage bin','Storage location','Plant','Company code'],0,'Bin.'],
['Konfirmasi transfer order WM?',['LT12','LT01','LX02','MIGO'],0,'LT12.'],
['Pusat kontrol EWM?',['/SCWM/MON','MD04','ME2N','F110'],0,'/SCWM/MON.'],
['Di EWM, tugas memindahkan barang disebut…',['Warehouse task','Purchase order','Inspection lot','Billing'],0,'Warehouse task.'],
['Stok per bin di classic WM dilihat dengan…',['LX02','MB52','FBL1N','CS03'],0,'LX02.']
])},

{id:'le',code:'LE',cat:'log',title:'LE – Logistics Execution: Shipping & Transport',dur:'30 mnt',
sum:'Outbound dan inbound delivery, picking, packing, PGI, shipment, dan biaya angkut.',tcs:['VL10','VL01N','VL06O','VL31N','VT01N'],
objs:['Memproses outbound delivery secara kolektif','Mengelola inbound delivery dari vendor','Membuat shipment dan menghitung biaya angkut'],
note:'Tulis alur pengiriman dari gudangmu ke customer terbesar, termasuk siapa yang membuat dokumen.',
lessons:[
L('Shipping: outbound delivery',{p:['Delivery dibuat per <b>shipping point</b>. Untuk volume tinggi, gunakan <b>VL10</b> (delivery due list) untuk membuat banyak delivery sekaligus dari order yang jatuh tempo.','Langkah setelahnya: <b>picking</b> (qty dipilih, lewat WM/EWM jika ada), <b>packing</b> ke handling unit (HU) seperti karton/palet, lalu <b>PGI</b>. Monitor VL06O membantu melihat delivery yang belum picking, belum PGI, atau belum ditagih.'],
flow:[['VL10','buat delivery kolektif'],['Picking','qty picked'],['Packing','HU'],['PGI','601'],['VL06O','monitor']],
tc:[['VL10','Delivery due list'],['VL01N / VL02N','Delivery tunggal / ubah + PGI'],['VL06O','Outbound delivery monitor'],['HU02','Handling unit']],
keys:['Delivery per shipping point','VL10 untuk proses kolektif','Picking → packing → PGI'],
cp:['Gudang ingin membuat delivery untuk 120 sales order yang jatuh tempo hari ini sekaligus. Transaksi yang tepat?',['VL10 (delivery due list)','VA01','VF01','MIGO'],0,'VL10 memproses delivery secara kolektif.']}),
L('Inbound delivery',{p:['Untuk vendor besar atau impor, perusahaan memakai <b>inbound delivery</b> (VL31N) sebagai pemberitahuan pengiriman (ASN) berdasarkan PO. Dengan dokumen ini gudang tahu barang apa yang akan datang dan kapan.','Saat barang tiba, GR diposting terhadap inbound delivery (VL32N atau MIGO dengan referensi inbound delivery). Jika ada WM/EWM, putaway mengikuti inbound delivery.'],
tc:[['VL31N / VL32N','Membuat / mengubah inbound delivery'],['VL06I','Inbound delivery monitor'],['MIGO','GR dengan referensi inbound delivery']],
integ:'Inbound delivery terhubung ke PO (MM) dan, jika vendor memakai Ariba Network, bisa dibuat otomatis dari ship notice vendor.',
keys:['Inbound delivery = pemberitahuan barang datang','GR terhadap inbound delivery','Monitor dengan VL06I'],
cp:['Kontainer impor dijadwalkan datang minggu depan. Dokumen yang membantu gudang menyiapkan tempat dan tenaga?',['Inbound delivery (VL31N) berdasarkan PO','Billing','Credit memo','Production order'],0,'Inbound delivery memberi visibilitas kedatangan.']}),
L('Transportation',{p:['<b>Shipment</b> (VT01N) mengelompokkan beberapa delivery dalam satu truk/rute, mencatat forwarding agent, waktu loading, dan status perjalanan.','<b>Shipment cost</b> (VI01) menghitung biaya angkut dari tarif, lalu biaya diteruskan ke FI/MM untuk pembayaran ke transporter. Di S/4HANA, perencanaan transport yang lebih kompleks memakai <b>SAP TM</b> (freight order, optimasi rute).'],
tc:[['VT01N / VT02N','Membuat / mengubah shipment'],['VT11','Daftar shipment'],['VI01','Shipment cost'],['Freight Order (TM)','Dokumen transport di SAP TM']],
keys:['Shipment = beberapa delivery dalam satu angkutan','Shipment cost untuk biaya angkut','SAP TM untuk perencanaan transport lanjutan'],
cp:['Satu truk membawa 6 delivery ke 6 toko. Dokumen yang menyatukan keenam delivery ini?',['Shipment (VT01N)','Sales order','Billing','Inspection lot'],0,'Shipment.']})
],
quiz:QZ([
['Membuat banyak delivery sekaligus dari order jatuh tempo?',['VL10','VL31N','VT01N','VF04'],0,'VL10.'],
['Inbound delivery dibuat dengan…',['VL31N','VL01N','VA01','ME21N'],0,'VL31N.'],
['Dokumen yang menyatukan beberapa delivery dalam satu truk?',['Shipment','Handling unit','Billing','PIR'],0,'Shipment.'],
['Biaya angkut dihitung dengan…',['VI01','F110','KO88','MIRO'],0,'Shipment cost.'],
['Monitor outbound delivery?',['VL06O','VL06I','MD04','QA32'],0,'VL06O.']
])},

{id:'cs',code:'CS',cat:'log',title:'CS – Customer Service',dur:'30 mnt',
sum:'Installed base, kontrak servis, service notification, service order, dan repair.',tcs:['IQ03','VA41','IW51','IW31','DP90'],
objs:['Memahami installed base dan kontrak servis','Memproses servis lapangan dari notification sampai billing','Memproses repair barang customer'],
note:'Tulis jenis layanan purna jual di perusahaanmu: garansi, kontrak, atau berbayar per kunjungan.',
lessons:[
L('Installed base dan kontrak',{p:['CS memakai objek PM untuk barang yang ada di tempat customer: <b>equipment</b> dengan data customer dan garansi, serta <b>serial number</b> (IQ01/IQ03).','<b>Service contract</b> (VA41) mencatat layanan yang dijual (misalnya perawatan 4 kali setahun), periode, harga, dan objek yang dicakup. Kontrak menentukan apakah servis ditagih atau gratis.'],
tc:[['IQ01 / IQ03','Serial number'],['IE03','Equipment dengan data customer'],['VA41 / VA43','Membuat / menampilkan service contract'],['BGM1','Master warranty']],
keys:['Equipment + serial number = installed base','Service contract mengatur cakupan dan harga','Garansi menentukan biaya ditagih atau tidak'],
cp:['Customer menelepon minta perbaikan mesin. Data pertama yang dicek untuk menentukan perlu ditagih atau tidak?',['Garansi dan service contract untuk equipment/serial number tersebut','Saldo bank','Harga beli material','BOM produksi'],0,'Garansi dan kontrak menentukan penagihan.']}),
L('Servis lapangan',{p:['Keluhan dicatat sebagai <b>service notification</b> (IW51, misalnya S1). Teknisi dijadwalkan lewat <b>service order</b> (IW31, misalnya SM01/SM02) yang berisi pekerjaan, sparepart, dan waktu.','Setelah konfirmasi, biaya order bisa ditagihkan dengan <b>resource-related billing</b> (DP90): SAP membuat permintaan billing dari jam kerja dan material yang dipakai, lalu billing SD (VF01).'],
flow:[['IW51','notification'],['IW31','service order'],['Kerjakan','sparepart + jam'],['IW41','konfirmasi'],['DP90','billing request'],['VF01','invoice']],
tc:[['IW51 / IW52','Service notification'],['IW31','Service order'],['IW41','Konfirmasi'],['DP90','Resource-related billing']],
keys:['Notification → service order → konfirmasi → billing','DP90 menagih berdasarkan biaya aktual','Integrasi kuat dengan PM, MM, SD'],
cp:['Servis selesai dengan 3 jam kerja dan 2 sparepart. Agar customer ditagih sesuai pemakaian aktual, gunakan…',['Resource-related billing (DP90) lalu billing','FB60','MIRO','KO88 ke cost center'],0,'DP90 mengubah biaya aktual menjadi tagihan.']}),
L('Repair barang customer',{p:['Untuk barang yang dikirim customer ke bengkel, dibuat <b>repair order</b> di SD (order type untuk repair, misalnya RAS). Barang diterima dengan returns delivery, diperiksa, lalu diputuskan: perbaiki, ganti, atau kembalikan.','Service order untuk perbaikan dibuat otomatis dari repair order. Setelah selesai, barang dikirim balik dan ditagih sesuai hasil pemeriksaan dan garansi.'],
tc:[['VA01 (repair order)','Order repair di SD'],['VL01N','Pengiriman kembali ke customer'],['IW33','Service order perbaikan']],
keys:['Repair order di SD','Terima → periksa → perbaiki → kirim balik → tagih','Garansi memengaruhi tagihan'],
cp:['Pompa customer dikirim ke bengkel untuk diperbaiki. Dokumen pembuka proses ini?',['Repair order di SD','Purchase order','Production order','Asset master'],0,'Repair order memulai alur repair.']})
],
quiz:QZ([
['Service contract dibuat dengan…',['VA41','VA01','ME31K','IW21'],0,'VA41.'],
['Service notification untuk keluhan customer?',['IW51','QM01','IW21','VL31N'],0,'IW51.'],
['Penagihan berdasarkan jam dan material aktual?',['DP90','VF11','F110','CK24'],0,'DP90.'],
['Installed base di CS terdiri dari…',['Equipment dan serial number di lokasi customer','Cost center','Vendor','Bin gudang'],0,'Installed base.'],
['Barang customer yang diperbaiki di bengkel diawali dengan…',['Repair order','PIR','Inbound delivery vendor','Asset transfer'],0,'Repair order.']
])},

{id:'lo',code:'LO',cat:'log',title:'LO – Logistics General',dur:'30 mnt',
sum:'Material master, batch management, klasifikasi, variant configuration, dan laporan logistik.',tcs:['MM01','MM03','MSC3N','CL02','MC.9'],
objs:['Membuat dan membaca material master dengan view yang tepat','Mengelola batch dan klasifikasi','Mengenal variant configuration dan laporan LIS'],
note:'Tulis material type yang paling sering kamu temui dan view apa yang wajib diisi.',
lessons:[
L('Material master',{p:['Material master dipakai semua modul logistik. Datanya tersusun dalam <b>view</b> per level organisasi: Basic Data (client), Sales (sales org), Purchasing dan MRP (plant), Storage (plant/sloc), Accounting (valuation area).','<b>Material type</b> menentukan view dan perilaku: ROH bahan baku, HALB setengah jadi, FERT barang jadi, HAWA barang dagang, ERSA sparepart, NLAG non-stock. Salah material type sering berarti salah akun G/L saat posting.'],
tc:[['MM01 / MM02 / MM03','Membuat / mengubah / menampilkan material'],['MM60','Daftar material'],['MM17','Mass maintenance material'],['MMBE','Stok overview']],
keys:['View per level organisasi','Material type mengatur view dan akun','Data master yang rapi = proses lancar'],
cp:['Tim sales tidak bisa membuat order untuk material baru, padahal material sudah ada. Penyebab yang paling mungkin?',['View Sales untuk sales org/channel tersebut belum dibuat','Material type salah warna','Vendor belum dibuat','Periode tertutup'],0,'Sales order butuh view Sales di sales area terkait.']}),
L('Batch dan klasifikasi',{p:['<b>Batch</b> mengelompokkan stok dengan sifat sama, misalnya tanggal produksi dan kedaluwarsa. Wajib untuk makanan, farmasi, dan kimia agar bisa ditelusuri (traceability) dan dipakai FEFO.','Sifat batch dicatat lewat <b>klasifikasi</b>: characteristic (CT04) dikumpulkan dalam class (CL02), lalu nilainya diisi per batch. <b>Batch where-used</b> (MB56) menunjukkan ke mana saja batch bahan baku dipakai, penting saat recall.'],
tc:[['MSC1N / MSC3N','Membuat / menampilkan batch'],['CT04','Characteristic'],['CL02','Class'],['MB56','Batch where-used list']],
keys:['Batch = traceability + FEFO','Characteristic → class → nilai per batch','MB56 untuk recall'],
cp:['Ada keluhan kontaminasi pada satu batch gula. Kamu harus tahu produk jadi mana saja yang memakai batch itu. Laporan yang tepat?',['Batch where-used (MB56)','MB52','FBL5N','KSB1'],0,'MB56 menelusuri pemakaian batch.']}),
L('Variant configuration dan laporan logistik',{p:['<b>Variant configuration</b> dipakai untuk produk dengan banyak pilihan (misalnya mesin dengan pilihan voltase dan warna). Satu material configurable dengan super BOM dan aturan (dependencies) menggantikan ratusan nomor material.','<b>LIS</b> (Logistics Information System) menyediakan analisis standar: stok (MC.9), pembelian (MCE1), penjualan (MCTA). Di S/4HANA, banyak analisis pindah ke app Fiori analitik berbasis CDS.'],
tc:[['CU41','Configuration profile'],['CU50','Simulasi konfigurasi'],['MC.9','Analisis stok per plant/material'],['MCTA','Analisis penjualan per customer']],
keys:['Variant configuration: satu material, banyak pilihan','LIS untuk analisis logistik standar','S/4: analitik Fiori berbasis CDS'],
cp:['Perusahaan menjual 300 kombinasi conveyor (panjang, lebar, motor). Pendekatan master data yang efisien?',['Variant configuration dengan satu material configurable','300 material terpisah','Satu material tanpa pilihan','Pakai teks bebas di sales order'],0,'Variant configuration menghindari ledakan nomor material.']})
],
quiz:QZ([
['Material type untuk barang jadi?',['FERT','ROH','ERSA','HAWA'],0,'FERT.'],
['Laporan untuk recall batch?',['MB56','MM60','CU50','VL10'],0,'MB56.'],
['Characteristic dibuat dengan…',['CT04','CL02','MSC1N','MM01'],0,'CT04.'],
['View Purchasing dan MRP berada di level…',['Plant','Client','Sales org','Company code'],0,'Plant.'],
['Produk dengan banyak kombinasi pilihan dikelola dengan…',['Variant configuration','Batch','Profit center','Dunning'],0,'Variant configuration.']
])},

{id:'hcm',code:'HCM',cat:'hr',title:'HCM – Human Capital Management',dur:'40 mnt',
sum:'Organizational management, personnel administration, time management, dan payroll.',tcs:['PPOME','PA40','PA30','PA61','PA03'],
objs:['Membaca struktur organisasi (org unit, position, job)','Mengelola data karyawan dengan infotype','Mencatat data waktu dan absensi','Memahami siklus payroll sampai posting ke FI'],
note:'Tulis infotype yang paling sering kamu ubah dan dokumen pendukung yang diminta.',
lessons:[
L('Organizational management',{p:['Struktur organisasi terdiri dari <b>organizational unit</b> (departemen), <b>position</b> (kursi, misalnya Staff Admin Proyek 1), dan <b>job</b> (deskripsi umum, misalnya Staff Admin). Karyawan (person) menduduki position; position melapor ke position atasan.','Relasi ini dipakai untuk alur approval (cuti, PR, workflow), pelaporan headcount, dan penentuan cost center gaji.'],
tc:[['PPOCE','Membuat struktur organisasi'],['PPOME','Mengubah struktur organisasi'],['PPOSE','Menampilkan struktur'],['S_AHR_61016528','Laporan struktur organisasi']],
keys:['Org unit → position → person','Job = deskripsi umum, position = kursi spesifik','Struktur dipakai untuk approval dan headcount'],
cp:['Karyawan baru akan menggantikan staff yang resign di kursi yang sama. Objek mana yang tetap dan diisi orang baru?',['Position','Job','Org unit baru','Cost element'],0,'Position tetap, pemegangnya berganti.']}),
L('Personnel administration dan infotype',{p:['Data karyawan disimpan dalam <b>infotype</b> bernomor dengan periode berlaku. Yang paling sering: 0000 Actions, 0001 Organizational Assignment, 0002 Personal Data, 0006 Address, 0007 Planned Working Time, 0008 Basic Pay, 0009 Bank Details.','Peristiwa seperti hiring, mutasi, promosi, dan terminasi dijalankan sebagai <b>personnel action</b> (PA40) yang membuka infotype terkait secara berurutan. Perubahan satuan dilakukan di PA30, dan tampilan di PA20.'],
tc:[['PA40','Personnel action (hiring, mutasi, resign)'],['PA30','Maintain infotype'],['PA20','Display infotype'],['PA10','Personnel file']],
tip:'Gunakan tanggal berlaku yang tepat. Mengubah record lama (Change) menimpa sejarah; untuk kenaikan gaji gunakan Copy dengan tanggal mulai baru agar riwayat tetap ada.',
keys:['Infotype = blok data dengan periode berlaku','PA40 untuk peristiwa, PA30 untuk perubahan','Jaga riwayat dengan Copy + tanggal baru'],
cp:['Gaji karyawan naik mulai 1 Januari. Cara yang benar di infotype 0008?',['Copy record dengan tanggal mulai 01.01 dan isi gaji baru','Change record lama sehingga gaji lama hilang','Hapus infotype 0008','Buat karyawan baru'],0,'Copy menjaga riwayat gaji.']}),
L('Time management',{p:['Jadwal kerja karyawan ada di infotype 0007 (work schedule rule). Ketidakhadiran dicatat di <b>2001 Absences</b> (cuti, sakit), kehadiran khusus di <b>2002 Attendances</b> (dinas luar, training), dan lembur di 2005 atau lewat time evaluation.','Banyak perusahaan memakai <b>CATS</b> (CAT2) untuk timesheet, yang juga bisa membebankan jam kerja ke proyek (WBS) atau order. <b>Time evaluation</b> (PT60) menghitung saldo cuti, lembur, dan hasil waktu untuk payroll.'],
tc:[['PA61','Maintain time data'],['PT50','Quota overview (saldo cuti)'],['CAT2','Timesheet CATS'],['PT60','Time evaluation']],
integ:'Hasil time evaluation dibaca payroll. Timesheet CATS ke WBS/order juga mengalirkan biaya tenaga kerja ke PS dan CO.',
keys:['0007 jadwal, 2001 absen, 2002 hadir khusus','CATS untuk timesheet ke proyek','Time evaluation menyiapkan data payroll'],
cp:['Karyawan cuti tahunan 3 hari. Infotype yang dipakai?',['2001 Absences','0008 Basic Pay','0006 Address','0009 Bank Details'],0,'Cuti = absence.']}),
L('Payroll',{p:['Payroll berjalan per <b>payroll area</b> (misalnya bulanan). Siklusnya dikendalikan <b>control record</b> (PA03): release payroll (data master terkunci), jalankan simulasi dan payroll run, cek hasil, koreksi bila perlu, lalu exit.','Setelah selesai: posting ke FI (beban gaji, hutang gaji, pajak, BPJS), file transfer bank, dan slip gaji. Nama T-code payroll memakai kode negara, misalnya PC00_Mxx_CALC, dengan xx sesuai country version.'],
flow:[['PA03','release'],['Simulasi','cek error'],['Payroll run','PC00_Mxx_CALC'],['Cek hasil','koreksi'],['Exit','PA03'],['Posting FI','PC00_M99_CIPE'],['Bank & slip','transfer + slip']],
tc:[['PA03','Control record payroll'],['PC00_Mxx_CALC','Payroll run (xx = kode negara)'],['PC00_Mxx_CEDT','Slip gaji'],['PC00_M99_CIPE','Posting run ke FI'],['PC_PAYRESULT','Menampilkan hasil payroll']],
integ:'Posting payroll membuat jurnal FI ke akun beban per cost center (dari infotype 0001) dan hutang ke bank, kantor pajak, serta BPJS.',
keys:['Control record mengunci periode: release → run → exit','Simulasi dulu sebelum run sebenarnya','Posting ke FI dan transfer bank setelah exit'],
cp:['Setelah payroll di-release (PA03), HR ingin mengubah gaji pokok untuk periode yang sedang diproses. Apa yang terjadi?',['Perubahan untuk periode itu terkunci sampai status diubah ke correction','Bisa diubah bebas','Payroll terhapus','Karyawan otomatis terminasi'],0,'Release mengunci master data periode berjalan.']})
],
quiz:QZ([
['Hiring karyawan baru dijalankan dengan…',['PA40','PA20','PPOSE','PA03'],0,'PA40.'],
['Infotype gaji pokok?',['0008','0002','2001','0009'],0,'0008.'],
['Timesheet ke proyek memakai…',['CATS (CAT2)','MIGO','VA01','IW31'],0,'CATS.'],
['Control record payroll?',['PA03','PA30','PT60','PPOME'],0,'PA03.'],
['Kursi spesifik dalam organisasi disebut…',['Position','Job','Payroll area','Infotype'],0,'Position.']
])}
];

/* ===================== TEKNIS ===================== */
const MODS_TECH=[
{id:'basis',code:'BASIS',cat:'tech',title:'Basis – Administrasi Sistem SAP',dur:'35 mnt',
sum:'Landscape, client, work process, user, background job, monitoring, dan transport.',tcs:['SU01','SM37','SM50','ST22','STMS'],
objs:['Memahami landscape DEV-QAS-PRD dan konsep client','Mengelola user dan background job','Memantau kesehatan sistem','Mengelola transport dan pemeliharaan'],
note:'Tulis checklist monitoring harian yang akan kamu jalankan setiap pagi.',
lessons:[
L('Arsitektur dan landscape',{p:['Landscape standar terdiri dari tiga sistem: <b>DEV</b> (development dan konfigurasi), <b>QAS</b> (testing), dan <b>PRD</b> (produksi). Perubahan berpindah lewat <b>transport</b>, tidak dikerjakan langsung di PRD.','Satu sistem punya beberapa <b>client</b> (misalnya 000, 100, 800) yang memisahkan data bisnis. Server aplikasi menjalankan <b>work process</b>: dialog (user online), background (job), update, spool (cetak), dan enqueue (lock). Database S/4HANA adalah SAP HANA.'],
tc:[['SM50 / SM66','Work process lokal / global'],['SM51','Daftar application server'],['SCC4','Pengaturan client'],['DBACOCKPIT','Monitoring database']],
keys:['DEV → QAS → PRD lewat transport','Client memisahkan data dalam satu sistem','Work process: dialog, background, update, spool, enqueue'],
cp:['Konsultan ingin mengubah konfigurasi langsung di PRD karena "cuma sedikit". Prinsip yang benar?',['Ubah di DEV, uji di QAS, transport ke PRD','Langsung di PRD agar cepat','Ubah di QAS saja','Minta user mengubah sendiri'],0,'Jalur transport menjaga kontrol perubahan.']}),
L('User, job, dan monitoring',{p:['User dibuat di <b>SU01</b> dan diberi role dari <b>PFCG</b>. Kunci/buka user, reset password, dan validitas user juga di SU01. Saat user mengeluh "tidak punya akses", minta mereka menjalankan <b>SU53</b> setelah error.','Proses berat dijalankan sebagai <b>background job</b> (SM36) dan dipantau di <b>SM37</b>. Monitoring harian: job gagal (SM37), short dump (ST22), system log (SM21), update terhenti (SM13), lock menggantung (SM12), dan spool (SP01).'],
tc:[['SU01','User maintenance'],['SM36 / SM37','Definisi / monitor background job'],['ST22','ABAP runtime error (dump)'],['SM21','System log'],['SM12 / SM13','Lock entries / update requests'],['ST03N','Workload analysis']],
tip:'Jangan menghapus lock di SM12 tanpa memastikan user pemiliknya sudah tidak bekerja. Lock yang dihapus saat transaksi berjalan bisa membuat data tidak konsisten.',
keys:['SU01 user, PFCG role, SU53 cek otorisasi','SM37 untuk job, ST22 untuk dump','Checklist harian: SM37, ST22, SM21, SM13, SM12'],
cp:['Laporan stok mingguan otomatis tidak terkirim pagi ini. Tempat pertama yang dicek?',['SM37 untuk status background job','MB52','SU01','VA05'],0,'Job terjadwal dipantau di SM37.']}),
L('Transport dan pemeliharaan',{p:['Perubahan dikumpulkan dalam <b>transport request</b> (SE09/SE10): workbench (objek repository/ABAP) dan customizing (konfigurasi). Request di-release lalu di-import ke QAS dan PRD lewat <b>STMS</b> sesuai jadwal dan approval.','Pemeliharaan rutin: support package (SPAM/SAINT), update kernel, system refresh QAS dari PRD, backup dan restore, serta pengujian setelah upgrade.'],
flow:[['SE09/SE10','buat & release request'],['STMS','import ke QAS'],['Uji','user acceptance'],['Approval','change board'],['STMS','import ke PRD']],
tc:[['SE09 / SE10','Transport organizer'],['STMS','Transport management system'],['SPAM / SAINT','Support package / add-on'],['SE01','Transport organizer (extended)']],
keys:['Workbench vs customizing request','Release → import QAS → uji → import PRD','Support package dan kernel diuji dulu di non-PRD'],
cp:['Import ke PRD gagal karena objek bergantung pada request lain yang belum di-import. Pelajaran utamanya?',['Urutan dan dependensi transport harus dicek sebelum import','Import ulang terus sampai berhasil','Ubah langsung di PRD','Hapus request'],0,'Urutan transport penting.']})
],
quiz:QZ([
['Monitor background job?',['SM37','SU01','ST22','SE38'],0,'SM37.'],
['Short dump dilihat di…',['ST22','SM21','SM12','SPAM'],0,'ST22.'],
['Transport antar sistem dikelola di…',['STMS','SCC4','PFCG','SM50'],0,'STMS.'],
['User melaporkan error otorisasi. Transaksi yang diminta dijalankan user?',['SU53','SU01','ST03N','SM13'],0,'SU53.'],
['Urutan landscape standar?',['DEV → QAS → PRD','PRD → QAS → DEV','QAS → DEV → PRD','Hanya PRD'],0,'Tiga tingkat.']
])},

{id:'abap',code:'ABAP',cat:'tech',title:'ABAP – Pemrograman SAP',dur:'40 mnt',
sum:'ABAP Workbench, Data Dictionary, laporan ALV, form, enhancement, BAPI, dan ABAP modern.',tcs:['SE80','SE11','SE38','SE37','SE18'],
objs:['Mengenal alat ABAP Workbench dan ADT','Membuat laporan dengan selection screen dan ALV','Memahami form output','Memperluas standar SAP dengan aman'],
note:'Tulis satu kebutuhan laporan di timmu yang bisa dibuat sebagai program ALV.',
lessons:[
L('Workbench dan Data Dictionary',{p:['Program ABAP dibuat di <b>SE38</b>/<b>SE80</b> atau di Eclipse dengan <b>ABAP Development Tools (ADT)</b>, yang menjadi standar untuk S/4HANA. <b>Data Dictionary</b> (SE11) mendefinisikan tabel, struktur, data element, dan domain.','Tabel standar yang sering dipakai: MARA (material), EKKO/EKPO (PO), VBAK/VBAP (sales order), BKPF/ACDOCA (akuntansi), MSEG/MATDOC (dokumen material).'],
tc:[['SE38 / SE80','Editor program / object navigator'],['SE11','Data Dictionary'],['SE16N','Menampilkan isi tabel'],['SE37','Function module'],['SE24','Class builder']],
keys:['ADT (Eclipse) untuk pengembangan modern','SE11 untuk tabel/struktur','Kenali tabel standar per modul'],
cp:['Programmer ingin tahu struktur field tabel EKPO. Transaksi yang tepat?',['SE11','SM37','STMS','PA30'],0,'SE11 Data Dictionary.']}),
L('Laporan dan form',{p:['Laporan klasik terdiri dari <b>selection screen</b> (PARAMETERS, SELECT-OPTIONS), pengambilan data dengan <b>Open SQL</b>, dan output <b>ALV</b> (misalnya CL_SALV_TABLE) yang memberi sort, filter, total, dan export otomatis.','Dokumen cetak (PO, invoice, surat jalan) dibuat dengan <b>SmartForms</b>, <b>Adobe Forms</b> (SFP), atau SAPscript (lama). Form dipanggil oleh output determination dokumen.'],
tc:[['SE38','Program laporan'],['SMARTFORMS','SmartForms'],['SFP','Adobe Forms'],['NACE','Output determination (ECC)']],
tip:'Ambil hanya field dan baris yang dibutuhkan (hindari SELECT *) dan jangan SELECT di dalam LOOP. Dua kesalahan ini penyebab utama laporan lambat.',
keys:['Selection screen + Open SQL + ALV','Form: SmartForms / Adobe Forms','Performa: hindari SELECT * dan SELECT di LOOP'],
cp:['Laporan custom sangat lambat. Kode berisi SELECT SINGLE di dalam LOOP 50.000 baris. Perbaikan utama?',['Ambil data sekaligus (FOR ALL ENTRIES / JOIN) di luar loop','Tambah RAM','Hapus ALV','Jalankan di QAS'],0,'Akses database di dalam loop sangat mahal.']}),
L('Enhancement dan ABAP modern',{p:['Standar SAP tidak diubah langsung (modification). Logika tambahan dipasang lewat <b>enhancement</b>: user exit, customer exit, <b>BAdI</b> (SE18 definisi, SE19 implementasi), dan enhancement point. Integrasi program memakai <b>BAPI</b>, misalnya BAPI_PO_CREATE1.','Di S/4HANA, arah pengembangan adalah <b>clean core</b>: CDS view untuk model data, <b>RAP</b> (RESTful ABAP Programming) untuk aplikasi dan API, released API, serta pemeriksaan kode dengan ATC.'],
tc:[['SE18 / SE19','BAdI definition / implementation'],['CMOD / SMOD','Customer exit (lama)'],['BAPI','BAPI explorer'],['ATC','ABAP Test Cockpit'],['/h','Mengaktifkan debugger']],
keys:['Jangan modifikasi standar; gunakan enhancement','BAPI untuk integrasi','S/4: CDS + RAP + clean core'],
cp:['User ingin validasi tambahan saat PO disimpan. Pendekatan yang benar?',['Implementasi BAdI/enhancement yang disediakan untuk PO','Mengubah kode standar SAP','Membuat tabel baru','Menonaktifkan validasi standar'],0,'Enhancement menjaga upgrade tetap aman.']})
],
quiz:QZ([
['Data Dictionary?',['SE11','SE38','SM37','PFCG'],0,'SE11.'],
['Output tabel interaktif dengan sort dan export di program ABAP?',['ALV','SAPscript','IDoc','BAdI'],0,'ALV.'],
['Implementasi BAdI dibuat di…',['SE19','SE11','SE16N','STMS'],0,'SE19.'],
['Model data modern di S/4HANA dibuat dengan…',['CDS view','SAPscript','Batch input','Customer exit'],0,'CDS.'],
['BAPI dipakai untuk…',['Memanggil fungsi bisnis SAP secara terstandar dari program lain','Mencetak form','Monitoring job','Mengatur client'],0,'BAPI = API bisnis.']
])},

{id:'fiori',code:'FIORI',cat:'tech',title:'Fiori / UI5',dur:'30 mnt',
sum:'Fiori launchpad, jenis app, katalog dan role, OData, serta pengembangan SAPUI5 dan Fiori elements.',tcs:['/UI2/FLP','/IWFND/MAINT_SERVICE','/IWFND/ERROR_LOG'],
objs:['Mengenal Fiori launchpad dan jenis app','Mengatur akses app lewat katalog dan role','Memahami dasar pengembangan SAPUI5 dan Fiori elements'],
note:'Tulis tiga transaksi GUI di timmu yang punya padanan app Fiori.',
lessons:[
L('Fiori launchpad',{p:['<b>Fiori launchpad</b> adalah halaman awal berbasis browser berisi <b>tile</b> app. Isinya diatur dengan <b>spaces & pages</b> (sebelumnya groups) sesuai role user.','Jenis app: <b>transactional</b> (membuat/mengubah, misalnya Manage Purchase Orders), <b>analytical</b> (KPI dan grafik), dan <b>fact sheet</b> (ringkasan objek). Banyak T-code GUI tetap bisa dibuka dari launchpad sebagai app GUI for HTML.'],
tc:[['/UI2/FLP','Membuka Fiori launchpad'],['Fiori Apps Reference Library','Katalog resmi app Fiori dan padanan T-code-nya'],['/UI2/FLPD_CUST','Launchpad designer (lama)']],
keys:['Launchpad = tile sesuai role','Transactional, analytical, fact sheet','Fiori Apps Reference Library untuk mencari app'],
cp:['User ingin tahu app Fiori pengganti ME23N. Sumber yang paling tepat?',['Fiori Apps Reference Library','SM37','SE11','ST22'],0,'Library memetakan app ke T-code.']}),
L('Akses app: katalog, role, OData',{p:['App tampil jika user punya <b>business catalog</b> lewat role PFCG (di S/4: business role). Katalog berisi app; role memberi otorisasi data di backend.','Hampir semua app berbicara dengan backend lewat <b>OData service</b>. Service harus diaktifkan di <b>/IWFND/MAINT_SERVICE</b>. Error saat app dibuka sering terlihat di <b>/IWFND/ERROR_LOG</b>.'],
tc:[['PFCG','Role dengan katalog Fiori'],['/IWFND/MAINT_SERVICE','Aktivasi OData service'],['/IWFND/ERROR_LOG','Log error gateway'],['/UI2/FLIA','Fiori launchpad intent analysis']],
keys:['Katalog di role menentukan tile','OData service harus aktif','Cek error di /IWFND/ERROR_LOG'],
cp:['Tile muncul tetapi app menampilkan error saat dibuka. Langkah cek yang masuk akal?',['Cek /IWFND/ERROR_LOG dan status OData service','Hapus user','Import transport acak','Restart PC user'],0,'Error app biasanya dari service atau otorisasi backend.']}),
L('Pengembangan SAPUI5 dan Fiori elements',{p:['<b>SAPUI5</b> adalah framework JavaScript SAP dengan pola MVC (view XML, controller JS, model OData/JSON). Developer bekerja di <b>SAP Business Application Studio</b> atau VS Code dengan Fiori tools.','<b>Fiori elements</b> menghasilkan app standar (List Report, Object Page, Overview Page) dari anotasi CDS tanpa banyak kode UI, sehingga konsisten dan mudah dipelihara.'],
tc:[['Business Application Studio','IDE cloud untuk Fiori/UI5'],['Fiori tools','Generator dan preview app'],['SE80 / ADT','Repository BSP untuk deploy app ke ABAP']],
keys:['SAPUI5: MVC + OData','Fiori elements dari anotasi CDS','BAS / Fiori tools untuk pengembangan'],
cp:['Tim butuh app daftar dokumen dengan filter dan halaman detail standar secepatnya. Pendekatan yang efisien?',['Fiori elements List Report + Object Page dari CDS beranotasi','Menulis SAPUI5 dari nol','Membuat SAPscript','Program batch input'],0,'Fiori elements mempercepat app standar.']})
],
quiz:QZ([
['Aktivasi OData service?',['/IWFND/MAINT_SERVICE','SE11','SM37','STMS'],0,'Gateway service maintenance.'],
['Tile Fiori yang tampil ditentukan oleh…',['Katalog di role user','Warna browser','Client','Kernel'],0,'Role dan katalog.'],
['Jenis app untuk KPI dan grafik?',['Analytical','Transactional','Fact sheet','Batch'],0,'Analytical.'],
['App standar dari anotasi CDS dibuat dengan…',['Fiori elements','SAPscript','LSMW','IDoc'],0,'Fiori elements.'],
['Log error gateway?',['/IWFND/ERROR_LOG','ST22 saja','SM12','SU01'],0,'/IWFND/ERROR_LOG.']
])},

{id:'grc',code:'GRC',cat:'tech',title:'Security & GRC',dur:'35 mnt',
sum:'Konsep otorisasi, role PFCG, segregation of duties, GRC Access Control, dan audit log.',tcs:['PFCG','SU53','SUIM','ST01','GRAC_SPM'],
objs:['Memahami authorization object dan role','Menganalisis masalah otorisasi','Memahami SoD dan GRC Access Control','Mendukung audit keamanan'],
note:'Tulis dua kombinasi akses di perusahaanmu yang berisiko jika dipegang satu orang.',
lessons:[
L('Konsep otorisasi',{p:['Akses dikendalikan oleh <b>authorization object</b> dengan field, misalnya M_BEST_BSA (document type PO, aktivitas create/change/display). Nilai object dikumpulkan dalam <b>role</b> (PFCG) yang menghasilkan profile, lalu role diberikan ke user.','Jenis role: single, composite (gabungan), dan derived (turunan dengan nilai organisasi berbeda, misalnya per plant). Prinsipnya <b>least privilege</b>: user hanya mendapat akses yang dibutuhkan pekerjaannya.'],
tc:[['PFCG','Role maintenance'],['SU24','Default object per transaksi'],['SU53','Pemeriksaan otorisasi terakhir yang gagal'],['ST01 / STAUTHTRACE','Authorization trace'],['SUIM','Laporan user, role, dan otorisasi']],
keys:['Object → role → user','Derived role untuk variasi organisasi','Least privilege'],
cp:['User di plant 1100 juga bisa membuat PO untuk plant 1200 padahal tidak boleh. Yang perlu diperbaiki?',['Nilai field plant di role (misalnya derived role per plant)','Password user','Kernel','Layout ALV'],0,'Nilai organisasi di role terlalu luas.']}),
L('Segregation of duties dan GRC Access Control',{p:['<b>SoD</b> mencegah satu orang menguasai proses dari awal sampai akhir. Contoh risiko: membuat vendor + membayar vendor, membuat PO + memposting GR, mengubah master gaji + menjalankan payroll.','<b>GRC Access Control</b> membantu dengan Access Risk Analysis (cek konflik sebelum role diberikan), Access Request Management (permintaan akses dengan approval), Emergency Access Management (firefighter dengan log), dan Business Role Management.'],
tc:[['GRAC_SPM','Emergency access (firefighter)'],['NWBC (GRC)','Akses ke modul GRC Access Control'],['Access Risk Analysis','Laporan konflik SoD per user/role']],
keys:['SoD = pisahkan peran yang berisiko','Cek risiko sebelum memberi akses','Firefighter untuk akses darurat yang tercatat'],
cp:['Seorang staff purchasing diminta juga memposting GR karena gudang kekurangan orang. Risikonya?',['Konflik SoD: satu orang bisa membuat PO dan mengakui penerimaan barang','Tidak ada risiko','Hanya masalah performa','Masalah lisensi saja'],0,'PO + GR oleh satu orang membuka peluang fraud.']}),
L('Audit dan pemantauan keamanan',{p:['<b>Security audit log</b> mencatat aktivitas penting seperti login gagal, perubahan user, dan penggunaan transaksi kritis. Di S/4HANA dikonfigurasi dengan RSAU_CONFIG dan dibaca dengan RSAU_READ_LOG (sebelumnya SM19/SM20).','Kegiatan rutin: user access review berkala, penonaktifan user yang resign, review user dengan SAP_ALL, dan review log firefighter. GRC Process Control dan Risk Management membantu mendokumentasikan kontrol dan pengujiannya.'],
tc:[['RSAU_CONFIG','Konfigurasi security audit log'],['RSAU_READ_LOG','Membaca audit log'],['SUIM','User dengan role/profil kritis'],['SU10','Mass user maintenance (lock/unlock)']],
keys:['Audit log untuk aktivitas kritis','Access review berkala','User resign segera dikunci'],
cp:['Auditor bertanya siapa saja yang punya profil SAP_ALL di PRD. Laporan yang tepat?',['SUIM (user berdasarkan profil)','MB52','FBL1N','SM37'],0,'SUIM menjawab pertanyaan akses.']})
],
quiz:QZ([
['Role dibuat dan dikelola di…',['PFCG','SU53','SM37','SE11'],0,'PFCG.'],
['Transaksi untuk melihat cek otorisasi yang gagal?',['SU53','SU01','STMS','ST22'],0,'SU53.'],
['Contoh konflik SoD?',['Membuat vendor dan membayar vendor oleh orang yang sama','Melihat laporan stok','Login dua kali','Mengubah password'],0,'SoD klasik.'],
['Akses darurat yang tercatat di GRC disebut…',['Firefighter / Emergency Access Management','Derived role','Client copy','Variant'],0,'EAM.'],
['Laporan user dan otorisasi?',['SUIM','MD04','VA05','KSB1'],0,'SUIM.']
])},

{id:'bw',code:'BW/BI',cat:'tech',title:'BW / BI – Business Warehouse & Analytics',dur:'30 mnt',
sum:'Ekstraksi data, model BW, process chain, query, Analysis for Office, SAC, dan embedded analytics.',tcs:['RSA1','RSPC','RSA3'],
objs:['Memahami alur data dari sumber ke laporan','Membuat dan memakai query untuk analisis','Memantau load data dan process chain'],
note:'Tulis satu KPI yang kamu pantau tiap bulan dan dari modul SAP mana datanya berasal.',
lessons:[
L('Konsep dan alur data',{p:['BW mengumpulkan data dari ERP dan sumber lain untuk analisis historis. Data diambil lewat <b>DataSource/extractor</b> (bisa diuji di RSA3 pada sistem sumber), diubah dengan <b>transformation</b>, dan dimuat oleh <b>DTP</b> ke objek seperti <b>aDSO</b>. Untuk pelaporan, beberapa objek digabung di <b>CompositeProvider</b>.','Platform saat ini: BW/4HANA (on-premise) dan <b>SAP Datasphere</b> (cloud). Untuk laporan operasional real-time, S/4HANA punya <b>embedded analytics</b> berbasis CDS tanpa perlu BW.'],
flow:[['Sumber','S/4, file, cloud'],['DataSource','ekstraksi'],['Transformation','aturan'],['DTP','load'],['aDSO','penyimpanan'],['CompositeProvider','query']],
tc:[['RSA1','Data Warehousing Workbench'],['RSA3','Extractor checker (di sistem sumber)'],['BW Modeling Tools','Pemodelan di Eclipse']],
keys:['DataSource → transformation → DTP → aDSO','CompositeProvider untuk reporting','Embedded analytics untuk operasional real-time'],
cp:['Manajer butuh tren penjualan 5 tahun digabung dengan data e-commerce eksternal. Platform yang lebih cocok?',['Data warehouse (BW/4HANA atau Datasphere)','Transaksi VA05','SE16N','MB52'],0,'Analisis historis lintas sumber = data warehouse.']}),
L('Query dan visualisasi',{p:['<b>Query</b> (BW Query di Eclipse, dulu BEx Query Designer) mendefinisikan baris, kolom, filter, variabel, dan key figure terhitung. Satu query bisa dipakai di banyak front end.','Front end yang umum: <b>Analysis for Office</b> (add-in Excel untuk analisis pivot), <b>SAP Analytics Cloud</b> (dashboard, story, planning), dan app Fiori analitik untuk embedded analytics.'],
tc:[['BW Query (Eclipse)','Mendesain query'],['Analysis for Office','Analisis query di Excel'],['SAP Analytics Cloud','Dashboard dan story'],['Query Browser','App Fiori untuk query CDS']],
keys:['Query = definisi analisis yang bisa dipakai ulang','Analysis for Office untuk pengguna Excel','SAC untuk dashboard dan planning'],
cp:['Tim finance terbiasa Excel dan ingin drill-down data BW dengan pivot. Alat yang paling cocok?',['Analysis for Office','SM37','SE38','FB50'],0,'Add-in Excel untuk query BW.']}),
L('Operasional BW',{p:['Load data dijadwalkan dalam <b>process chain</b> (RSPC): ekstraksi, load, aktivasi, lalu refresh. Analis BI perlu memeriksa status chain setiap pagi, karena chain gagal berarti dashboard menampilkan data lama.','Prinsip kualitas data: rekonsiliasi angka BW dengan laporan sumber (misalnya total penjualan BW vs VA05/FI), tangani delta yang terlewat, dan dokumentasikan definisi KPI.'],
tc:[['RSPC','Process chain maintenance & monitor'],['RSMO','Monitor load (lama)'],['RSRT','Uji eksekusi query']],
keys:['Process chain gagal = data dashboard basi','Rekonsiliasi dengan sistem sumber','Definisi KPI terdokumentasi'],
cp:['Dashboard penjualan pagi ini masih menampilkan angka kemarin lusa. Pengecekan pertama?',['Status process chain di RSPC','Password user','Material master','Kernel'],0,'Load yang gagal membuat data tidak terbarui.']})
],
quiz:QZ([
['Monitor process chain?',['RSPC','RSA3','SM12','PA03'],0,'RSPC.'],
['Menguji extractor di sistem sumber?',['RSA3','RSA1','RSRT','ST22'],0,'RSA3.'],
['Add-in Excel untuk query BW?',['Analysis for Office','SmartForms','SAP GUI scripting','NACE'],0,'Analysis for Office.'],
['Objek pelaporan yang menggabungkan beberapa provider?',['CompositeProvider','DataSource','Transport','Variant'],0,'CompositeProvider.'],
['Laporan operasional real-time di S/4HANA tanpa BW memakai…',['Embedded analytics berbasis CDS','SAPscript','Batch input','IDoc'],0,'Embedded analytics.']
])},

{id:'pi',code:'PI/PO/CPI',cat:'tech',title:'PI/PO & Cloud Integration',dur:'30 mnt',
sum:'IDoc, RFC, PI/PO, Integration Suite (CPI), iFlow, dan monitoring integrasi.',tcs:['WE02','BD87','SM59','SXMB_MONI'],
objs:['Mengenal teknologi integrasi SAP','Memantau dan memproses ulang IDoc','Memahami PI/PO dan Cloud Integration'],
note:'Gambar satu alur integrasi di perusahaanmu: sistem asal, middleware, sistem tujuan.',
lessons:[
L('IDoc dan RFC',{p:['<b>IDoc</b> adalah format dokumen elektronik SAP (misalnya ORDERS untuk PO, INVOIC untuk invoice, MATMAS untuk material). Status IDoc: hijau (53 berhasil diposting di inbound), merah (51 error aplikasi), dan lain-lain.','<b>RFC</b> menghubungkan sistem SAP secara langsung; tujuannya didefinisikan di SM59. Partner profile (WE20) mengatur IDoc apa yang dikirim/diterima dari partner mana.'],
tc:[['WE02 / WE05','Monitor IDoc'],['BD87','Proses ulang IDoc'],['WE19','Test tool IDoc'],['WE20','Partner profile'],['SM59','RFC destination']],
keys:['IDoc = dokumen elektronik terstandar','Status 51 = error aplikasi, 53 = sukses','BD87 untuk reprocess setelah data diperbaiki'],
cp:['IDoc order dari customer berstatus 51 karena material tidak dikenal. Setelah material mapping diperbaiki, langkah berikutnya?',['Proses ulang IDoc dengan BD87','Hapus IDoc','Buat ulang customer','Restart server'],0,'Reprocess dengan BD87.']}),
L('SAP PI/PO',{p:['<b>Process Integration / Process Orchestration</b> adalah middleware on-premise. Desain antarmuka dan mapping dibuat di <b>Enterprise Services Repository</b>; konfigurasi pengirim, penerima, dan routing di <b>Integration Directory</b>.','<b>Adapter</b> menghubungkan berbagai protokol: IDoc, RFC, SOAP, REST, file/SFTP, JDBC, AS2. Monitoring pesan di Message Monitor (PIMON) atau SXMB_MONI.'],
tc:[['SXMB_MONI','Monitor pesan (ABAP stack)'],['PIMON','Monitoring PI/PO (Java)'],['ESR / ID','Repository dan directory']],
keys:['ESR = desain, ID = konfigurasi','Adapter untuk banyak protokol','Pantau pesan gagal setiap hari'],
cp:['Pesan PO ke vendor gagal karena server SFTP vendor mati. Setelah server hidup, tindakan yang tepat?',['Resend pesan dari monitor','Buat PO baru','Hapus vendor','Ubah mapping'],0,'Pesan gagal karena koneksi bisa dikirim ulang.']}),
L('Cloud Integration (Integration Suite)',{p:['<b>SAP Integration Suite</b> di BTP berisi <b>Cloud Integration</b> (dulu CPI), API Management, Event Mesh, dan Integration Advisor. Alur integrasi dibuat sebagai <b>iFlow</b> berbasis web.','SAP menyediakan <b>prepackaged integration content</b>, misalnya SuccessFactors Employee Central ↔ S/4HANA, Ariba ↔ S/4HANA, sehingga proyek tidak mulai dari nol. Monitoring ada di Monitor Message Processing.'],
tc:[['Integration Suite','Desain iFlow di BTP'],['Monitor Message Processing','Status pesan CPI'],['API Management','Publikasi dan keamanan API'],['Event Mesh','Integrasi berbasis event']],
keys:['iFlow = alur integrasi di cloud','Gunakan konten standar SAP bila ada','Event Mesh untuk integrasi berbasis event'],
cp:['Perusahaan memakai SuccessFactors dan S/4HANA dan ingin data karyawan tersinkron. Langkah awal yang efisien?',['Pakai prepackaged integration content di Integration Suite','Tulis program file manual','Input ulang data','Gunakan email'],0,'Konten standar mempercepat integrasi.']})
],
quiz:QZ([
['Memproses ulang IDoc error?',['BD87','WE20','SM59','SE11'],0,'BD87.'],
['Definisi koneksi RFC?',['SM59','WE02','SXMB_MONI','PFCG'],0,'SM59.'],
['Status IDoc inbound yang berhasil diposting?',['53','51','64','02'],0,'53.'],
['Alur integrasi di Cloud Integration disebut…',['iFlow','Variant','Infotype','Wave'],0,'iFlow.'],
['Di PI/PO, mapping dan desain interface dibuat di…',['Enterprise Services Repository','Integration Directory','SU01','SE16N'],0,'ESR.']
])}
];

/* ===================== SOLUSI PENDUKUNG ===================== */
const MODS_CLOUD=[
{id:'sf',code:'SF',cat:'cloud',title:'SAP SuccessFactors',dur:'30 mnt',
sum:'Cloud HR: Employee Central, recruiting, onboarding, performance, learning, dan administrasi.',tcs:['Employee Central','Admin Center'],
objs:['Mengenal modul SuccessFactors','Mengikuti proses talent dari recruiting sampai performance','Memahami administrasi dan integrasi'],
note:'Tulis proses HR yang masih manual di perusahaanmu dan modul SF yang bisa membantu.',
lessons:[
L('Modul SuccessFactors',{p:['SuccessFactors adalah suite HR berbasis cloud. Intinya <b>Employee Central</b> (data karyawan, organisasi, posisi). Modul talent: Recruiting, Onboarding, Performance & Goals, Compensation, Succession & Development, dan Learning. Penggajian bisa memakai Employee Central Payroll.','Banyak perusahaan memakai model hybrid: data inti di SF, sedangkan payroll dan biaya tetap di S/4HANA, dengan integrasi otomatis.'],
tc:[['Employee Central','Data inti karyawan'],['Recruiting / Onboarding','Rekrutmen sampai hari pertama'],['Performance & Goals','Target dan penilaian'],['Learning','Pelatihan dan sertifikasi']],
keys:['Employee Central = inti','Modul talent terhubung satu sama lain','Model hybrid dengan S/4HANA umum dipakai'],
cp:['Data struktur organisasi dan posisi karyawan di SuccessFactors disimpan di modul…',['Employee Central','Learning','Recruiting','Ariba'],0,'Employee Central.']}),
L('Proses talent',{p:['Recruiting: <b>job requisition</b> disetujui → lowongan dipublikasi → kandidat melamar → interview → <b>offer</b>. Kandidat yang diterima masuk ke Onboarding untuk dokumen dan persiapan hari pertama, lalu menjadi karyawan di Employee Central.','Performance: target (goals) ditetapkan di awal tahun, <b>performance form</b> berjalan dalam route map (self-assessment, penilaian atasan, kalibrasi), lalu hasilnya dipakai untuk kompensasi dan succession.'],
flow:[['Job requisition','approval'],['Kandidat','apply & interview'],['Offer','diterima'],['Onboarding','dokumen'],['Employee Central','karyawan aktif'],['Goals & performance','tahunan']],
tc:[['Job Requisition','Permintaan rekrutmen'],['Performance Form','Formulir penilaian'],['Calibration','Penyelarasan nilai']],
keys:['Requisition → kandidat → offer → onboarding','Goals dan performance form per siklus','Hasil penilaian dipakai kompensasi'],
cp:['Kandidat sudah menandatangani offer. Modul berikutnya yang menangani dokumen dan persiapan hari pertama?',['Onboarding','Compensation','Learning','Employee Central Payroll'],0,'Onboarding.']}),
L('Administrasi dan integrasi',{p:['Pengaturan dilakukan di <b>Admin Center</b>: Manage Permission Roles (role-based permissions/RBP), Manage Data, Import Employee Data, business rules, dan konfigurasi workflow.','Integrasi ke S/4HANA (misalnya replikasi karyawan dan cost center) memakai Integration Suite dengan konten standar. Perubahan konfigurasi diuji dulu di instance test lalu dipindah dengan Instance Sync.'],
tc:[['Admin Center','Pusat administrasi'],['Manage Permission Roles','Role-based permissions'],['Import Employee Data','Upload data massal'],['Instance Sync','Memindahkan konfigurasi antar instance']],
keys:['Admin Center = pusat konfigurasi','RBP mengatur siapa melihat apa','Integrasi lewat Integration Suite'],
cp:['Manajer bisa melihat data gaji karyawan di divisi lain. Area yang perlu diperbaiki?',['Role-based permissions (target population)','Learning catalog','Job requisition','Goal plan'],0,'RBP mengatur populasi data yang boleh dilihat.']})
],
quiz:QZ([
['Inti data karyawan di SF?',['Employee Central','Recruiting','Concur','Ariba'],0,'EC.'],
['Hak akses di SF diatur dengan…',['Role-based permissions','PFCG','SU01','GRC firefighter'],0,'RBP.'],
['Modul untuk pelatihan dan sertifikasi?',['Learning','Compensation','Onboarding','Succession'],0,'Learning.'],
['Konfigurasi dipindah dari instance test ke produksi dengan…',['Instance Sync','STMS','SE09','BD87'],0,'Instance Sync.'],
['Urutan recruiting yang benar?',['Requisition → kandidat → offer → onboarding','Offer → requisition → onboarding','Onboarding → offer','Kandidat → payroll → offer'],0,'Alur rekrutmen.']
])},

{id:'ariba',code:'ARIBA',cat:'cloud',title:'SAP Ariba',dur:'30 mnt',
sum:'Ariba Network, sourcing, kontrak, guided buying, dan kolaborasi PO-invoice dengan supplier.',tcs:['Ariba Network','Sourcing','Guided Buying'],
objs:['Mengenal solusi Ariba dan Ariba Network','Menjalankan source to contract','Memahami kolaborasi PO, ship notice, dan invoice dengan supplier'],
note:'Tulis kategori belanja di perusahaanmu yang cocok untuk sourcing event kompetitif.',
lessons:[
L('Solusi Ariba',{p:['Ariba adalah suite procurement berbasis cloud. Komponennya: <b>Ariba Network</b> (jaringan supplier), <b>Sourcing</b> (RFI/RFP/RFQ dan auction), <b>Contracts</b>, <b>Buying & Invoicing</b> serta <b>Guided Buying</b> (belanja karyawan), dan <b>Supplier Lifecycle & Performance</b> (registrasi dan kualifikasi supplier).','Ariba sering dipasang berdampingan dengan S/4HANA: S/4 tetap untuk PO, GR, dan akuntansi, sedangkan Ariba untuk sourcing, kolaborasi, dan supplier.'],
tc:[['Ariba Network','Kolaborasi dokumen dengan supplier'],['Sourcing','Event RFQ dan auction'],['Contracts','Workspace kontrak'],['Guided Buying','Belanja karyawan sesuai kebijakan']],
keys:['Network, Sourcing, Contracts, Buying, SLP','Berdampingan dengan S/4HANA','Fokus kolaborasi dan kepatuhan belanja'],
cp:['Perusahaan ingin supplier mendaftar sendiri, melengkapi dokumen legal, dan dikualifikasi sebelum boleh ikut tender. Solusi Ariba yang tepat?',['Supplier Lifecycle & Performance','Guided Buying','Ariba Network invoice','Contracts'],0,'SLP menangani registrasi dan kualifikasi supplier.']}),
L('Source to contract',{p:['Buyer membuat <b>sourcing event</b> (misalnya RFQ) dengan item, kriteria, dan jadwal. Supplier mengajukan penawaran lewat Ariba. Buyer membandingkan, bisa menjalankan beberapa ronde atau auction, lalu <b>award</b>.','Hasil award dituangkan dalam <b>contract workspace</b> (dokumen, approval, tanda tangan) dan bisa menjadi kontrak/katalog yang dipakai saat belanja berikutnya.'],
flow:[['Kebutuhan','spesifikasi'],['Sourcing event','RFQ / auction'],['Penawaran','supplier'],['Award','evaluasi'],['Contract','workspace'],['Katalog','dipakai belanja']],
tc:[['Sourcing Event','RFQ/RFP/auction'],['Contract Workspace','Kontrak dan approval'],['Catalog','Harga dan item hasil kontrak']],
keys:['Event → penawaran → award → kontrak','Auction untuk persaingan harga','Kontrak menjadi katalog'],
cp:['Setelah award tender kemasan, langkah agar harga baru otomatis dipakai saat user belanja?',['Buat kontrak dan publikasikan sebagai katalog','Kirim email ke semua user','Ubah harga di MIRO','Buat sales order'],0,'Kontrak/katalog menjaga harga terpakai.']}),
L('Kolaborasi PO sampai invoice',{p:['PO dari S/4HANA dikirim ke supplier lewat <b>Ariba Network</b>. Supplier mengirim <b>order confirmation</b>, lalu <b>ship notice (ASN)</b> saat barang dikirim, dan terakhir <b>invoice elektronik</b> yang divalidasi terhadap PO.','Dokumen dari supplier masuk otomatis ke S/4 (misalnya ASN menjadi inbound delivery, invoice menjadi dokumen MIRO). Koneksi standar memakai <b>Cloud Integration Gateway</b> / Integration Suite.'],
flow:[['PO S/4','dikirim'],['Order confirmation','supplier'],['Ship notice','inbound delivery'],['GR','MIGO'],['e-Invoice','MIRO otomatis'],['Status bayar','terlihat supplier']],
tc:[['Ariba Network','Inbox dokumen supplier'],['Cloud Integration Gateway','Koneksi S/4 ↔ Ariba']],
integ:'Kolaborasi ini mengurangi entri manual di MM dan AP: invoice supplier yang sudah divalidasi di network lebih jarang blocked.',
keys:['PO → confirmation → ASN → invoice','Dokumen supplier masuk otomatis ke S/4','Supplier bisa melihat status pembayaran'],
cp:['Ship notice supplier di Ariba Network biasanya menjadi dokumen apa di S/4HANA?',['Inbound delivery','Sales order','Asset','Cost center'],0,'ASN → inbound delivery.']})
],
quiz:QZ([
['Jaringan kolaborasi dengan supplier?',['Ariba Network','Employee Central','IBP','Fiori launchpad'],0,'Ariba Network.'],
['Event tender harga dibuat di…',['Ariba Sourcing','Concur','C4C','Basis'],0,'Sourcing.'],
['Belanja karyawan sesuai kebijakan memakai…',['Guided Buying','Auction','Dispute','Shipment'],0,'Guided Buying.'],
['Ship notice dari supplier disebut juga…',['ASN','PIR','TO','IDoc 51'],0,'Advance ship notice.'],
['Koneksi standar S/4HANA ke Ariba?',['Cloud Integration Gateway / Integration Suite','SM37','SE38','FF_5'],0,'CIG.']
])},

{id:'concur',code:'CONCUR',cat:'cloud',title:'SAP Concur',dur:'25 mnt',
sum:'Expense report, travel request dan booking, invoice non-PO, audit, serta posting ke ERP.',tcs:['Expense','Travel','Invoice'],
objs:['Membuat expense report sesuai kebijakan','Memahami travel request dan booking','Memahami Concur Invoice dan integrasi ke FI'],
note:'Tulis tiga aturan kebijakan perjalanan dinas di perusahaanmu yang sering dilanggar.',
lessons:[
L('Expense',{p:['Karyawan membuat <b>expense report</b> untuk biaya dinas: tiket, hotel, makan, transport. Struk difoto (ExpenseIt membaca otomatis), transaksi kartu kredit korporat masuk sendiri, dan setiap baris diberi expense type serta objek biaya (cost center/WBS).','Report melewati <b>workflow approval</b> (atasan, lalu audit/finance). Kebijakan dicek otomatis: misalnya batas makan per hari atau kewajiban struk di atas nominal tertentu.'],
flow:[['Foto struk','ExpenseIt'],['Expense report','expense type + cost object'],['Submit','cek kebijakan'],['Approval','atasan'],['Audit','finance'],['Posting & reimburse','ERP']],
tc:[['Expense','Expense report'],['ExpenseIt','Baca struk otomatis'],['Corporate card feed','Transaksi kartu korporat']],
keys:['Struk + expense type + cost object','Kebijakan dicek otomatis','Approval berjenjang sebelum dibayar'],
cp:['Biaya dinas untuk proyek P-26-014 sebaiknya dibebankan ke…',['WBS proyek tersebut sebagai cost object','Cost center pribadi','Vendor','Tidak perlu diisi'],0,'Biaya proyek harus ke WBS.']}),
L('Travel request dan booking',{p:['Perusahaan yang mewajibkan persetujuan awal memakai <b>travel request</b>: tujuan, tanggal, estimasi biaya, dan alasan. Setelah disetujui, karyawan memesan tiket dan hotel di <b>Concur Travel</b> sesuai kebijakan (kelas penerbangan, batas tarif hotel).','Data booking otomatis menjadi bagian expense report, sehingga pelaporan biaya dan perbandingan dengan estimasi lebih mudah.'],
tc:[['Request','Persetujuan awal perjalanan'],['Travel','Pemesanan tiket dan hotel'],['TripIt','Itinerary perjalanan']],
keys:['Request → approval → booking','Kebijakan travel diterapkan saat booking','Booking mengalir ke expense'],
cp:['Hotel yang dipilih melebihi batas tarif kebijakan. Apa yang biasanya terjadi di Concur Travel?',['Muncul peringatan kebijakan dan perlu alasan/approval tambahan','Booking otomatis dibatalkan tanpa info','Tidak ada pengaruh','Gaji dipotong otomatis'],0,'Pelanggaran kebijakan ditandai dan butuh justifikasi.']}),
L('Invoice, audit, dan integrasi',{p:['<b>Concur Invoice</b> dipakai untuk tagihan non-PO (misalnya langganan, utilitas): invoice dipindai, divalidasi, disetujui, lalu dikirim ke ERP untuk dibayar.','Data yang sudah disetujui diekspor ke S/4HANA/ECC sebagai jurnal (beban, hutang karyawan atau vendor), lengkap dengan cost center/WBS. Laporan analitik membantu melihat pola biaya dan pelanggaran kebijakan.'],
tc:[['Invoice','Invoice non-PO'],['Audit rules','Aturan audit otomatis'],['Intelligence / Analytics','Laporan biaya']],
integ:'Concur memakai master cost center, WBS, dan karyawan dari SAP, lalu mengirim jurnal kembali ke FI. Cost object yang tidak aktif di SAP akan membuat posting gagal.',
keys:['Invoice non-PO dengan approval','Posting ke FI dengan cost object','Analitik untuk kepatuhan kebijakan'],
cp:['Expense report sudah disetujui tetapi gagal diposting ke SAP karena WBS sudah ditutup. Penyebabnya ada di…',['Status cost object di SAP (WBS closed)','Foto struk','Kartu kredit','Kebijakan hotel'],0,'Cost object harus aktif di ERP.']})
],
quiz:QZ([
['Membaca struk otomatis di Concur?',['ExpenseIt','Guided Buying','RSPC','QA32'],0,'ExpenseIt.'],
['Persetujuan awal perjalanan dinas?',['Travel request','Expense type','Dunning','Shipment'],0,'Request.'],
['Invoice non-PO di Concur?',['Concur Invoice','MIRO','VF01','KO88'],0,'Concur Invoice.'],
['Expense report dikirim ke SAP sebagai…',['Jurnal FI dengan cost object','Sales order','Material master','IDoc ORDERS'],0,'Posting FI.'],
['Kenapa setiap baris expense butuh cost object?',['Agar biaya masuk ke cost center/WBS yang benar','Agar struk lebih jelas','Untuk tiket pesawat','Tidak penting'],0,'Pembebanan biaya.']
])},

{id:'crm',code:'CRM/C4C',cat:'cloud',title:'SAP CRM / Sales & Service Cloud (C4C)',dur:'25 mnt',
sum:'Account, lead, opportunity, quote, pipeline, ticket service, dan integrasi ke S/4HANA.',tcs:['Account','Lead','Opportunity','Ticket'],
objs:['Mengenal objek CRM: account, contact, lead, opportunity','Mengelola pipeline penjualan','Mengelola ticket layanan dan SLA'],
note:'Tulis tahapan penjualan (sales stage) yang dipakai timmu.',
lessons:[
L('Objek CRM',{p:['SAP CRM (on-premise) dan <b>SAP Sales Cloud / Service Cloud</b> (C4C, bagian dari SAP Customer Experience) mengelola hubungan dengan customer sebelum dan sesudah transaksi. Objek inti: <b>account</b> (perusahaan), <b>contact</b> (orang), <b>activity</b> (kunjungan, telepon, email).','Account di CRM biasanya tersinkron dengan business partner customer di S/4HANA agar data penjualan dan piutang konsisten.'],
tc:[['Account / Contact','Data customer dan orang'],['Activity','Kunjungan, telepon, tugas'],['Visit planning','Rencana kunjungan sales lapangan']],
keys:['Account = perusahaan, contact = orang','Activity mencatat interaksi','Sinkron dengan BP di S/4HANA'],
cp:['Sales mengunjungi pembeli di toko ritel. Interaksi ini dicatat sebagai…',['Activity (visit) pada account','Billing','Inspection lot','Asset'],0,'Activity.']}),
L('Lead to quote',{p:['<b>Lead</b> adalah minat awal yang belum terkualifikasi. Setelah dikualifikasi menjadi <b>opportunity</b> dengan nilai, probabilitas, sales stage, dan tanggal perkiraan closing. Kumpulan opportunity membentuk <b>pipeline</b> dan forecast.','Opportunity yang matang menghasilkan <b>quote</b>; harga bisa diambil dari S/4HANA. Quote yang disetujui customer diteruskan menjadi sales order di S/4.'],
flow:[['Lead','minat'],['Kualifikasi',''],['Opportunity','nilai & stage'],['Quote','harga S/4'],['Sales order','S/4HANA']],
tc:[['Lead','Minat awal'],['Opportunity','Peluang terkualifikasi'],['Pipeline / Forecast','Analisis penjualan'],['Sales Quote','Penawaran harga']],
keys:['Lead → opportunity → quote → order','Pipeline untuk forecast','Order eksekusi di S/4HANA'],
cp:['Manajer sales ingin memperkirakan pendapatan kuartal depan. Data CRM yang paling relevan?',['Pipeline opportunity dengan nilai, stage, dan probabilitas','Daftar contact','Ticket service','Material master'],0,'Pipeline = dasar forecast.']}),
L('Service dan integrasi',{p:['Di Service Cloud, keluhan masuk sebagai <b>ticket</b> dari email, portal, telepon, atau chat. Ticket punya prioritas, <b>SLA</b> (batas waktu respons/penyelesaian), dan bisa memakai knowledge base.','Integrasi dengan S/4HANA (lewat Integration Suite) membawa account, material, harga, status order, dan invoice, sehingga agen bisa menjawab pertanyaan customer tanpa membuka banyak sistem.'],
tc:[['Ticket','Kasus layanan'],['SLA','Target waktu respons'],['Knowledge Base','Artikel solusi']],
keys:['Ticket dengan prioritas dan SLA','Knowledge base mempercepat solusi','Integrasi memberi gambaran 360° customer'],
cp:['Agen layanan perlu melihat status pengiriman order customer saat menangani ticket. Hal yang memungkinkan?',['Integrasi C4C dengan S/4HANA (status order/delivery)','Membuka SM37','Membuat PO','Menjalankan F110'],0,'Integrasi data order.']})
],
quiz:QZ([
['Minat awal yang belum terkualifikasi?',['Lead','Opportunity','Quote','Ticket'],0,'Lead.'],
['Dasar forecast penjualan di CRM?',['Pipeline opportunity','Ticket','Activity','Contact'],0,'Pipeline.'],
['Batas waktu respons ticket?',['SLA','MRP','ATP','FSV'],0,'SLA.'],
['Quote yang disetujui diteruskan menjadi…',['Sales order di S/4HANA','Purchase order','Production order','Asset'],0,'Sales order.'],
['Objek untuk perusahaan customer?',['Account','Contact','Lead','Activity'],0,'Account.']
])},

{id:'ibp',code:'SCM/IBP',cat:'cloud',title:'SAP SCM / Integrated Business Planning',dur:'30 mnt',
sum:'S&OP, demand planning, supply planning, inventory optimization, dan integrasi dengan S/4HANA.',tcs:['IBP Excel add-in','Demand','Supply','S&OP'],
objs:['Mengenal cakupan perencanaan supply chain dan IBP','Membuat dan mengevaluasi forecast','Memahami supply planning dan siklus S&OP'],
note:'Tulis siklus S&OP bulanan di perusahaanmu: siapa hadir dan keputusan apa yang diambil.',
lessons:[
L('Cakupan SCM dan IBP',{p:['Perencanaan supply chain dulu memakai SAP APO (on-premise). Penggantinya adalah <b>SAP IBP</b> (cloud) dengan modul S&OP, Demand, Supply (Response & Supply), Inventory, dan Supply Chain Control Tower.','Planner bekerja terutama di <b>Excel add-in IBP</b> (planning view) dan app web untuk alert, analitik, dan proses.'],
tc:[['IBP Excel add-in','Planning view'],['Planner Workspaces','Ruang kerja planner'],['Control Tower','Visibilitas dan alert supply chain']],
keys:['APO (lama) → IBP (cloud)','Modul: S&OP, Demand, Supply, Inventory','Excel add-in sebagai alat utama planner'],
cp:['Alat utama planner IBP untuk melihat dan mengubah angka rencana adalah…',['Excel add-in (planning view)','SE38','MIGO','FB50'],0,'Planning view di Excel.']}),
L('Demand planning',{p:['Forecast statistik dihitung dari histori penjualan dengan model seperti moving average, exponential smoothing, atau metode lain. Planner lalu menambah masukan pasar (promosi, produk baru) menjadi <b>consensus demand</b>.','Kualitas forecast diukur dengan error, misalnya <b>MAPE</b> dan bias. Demand sensing memakai sinyal jangka pendek (order terbaru) untuk koreksi minggu-minggu terdekat.'],
tc:[['Statistical forecasting','Model forecast'],['Consensus demand','Angka sepakat sales-marketing-ops'],['Forecast error (MAPE, bias)','Ukuran akurasi']],
keys:['Forecast statistik + input pasar = consensus','Ukur akurasi dengan MAPE dan bias','Demand sensing untuk jangka pendek'],
cp:['Forecast produk A selalu lebih tinggi dari realisasi 3 bulan berturut-turut. Indikator yang menunjukkan ini?',['Bias positif','MAPE nol','Safety stock','Lead time'],0,'Bias menunjukkan kecenderungan over/under forecast.']}),
L('Supply planning dan S&OP',{p:['Supply planning menyeimbangkan permintaan dengan kapasitas, stok, dan pasokan, memakai heuristic atau optimizer. Hasilnya rencana produksi dan distribusi yang realistis.','<b>S&OP</b> adalah siklus bulanan: product review → demand review → supply review → pre-S&OP → executive S&OP. Rencana yang disepakati dikirim ke S/4HANA (misalnya sebagai PIR) dan menjadi masukan MRP.'],
flow:[['Product review',''],['Demand review','consensus'],['Supply review','kapasitas'],['Pre-S&OP','skenario'],['Executive S&OP','keputusan'],['Ke S/4','PIR → MRP']],
tc:[['Supply heuristic / optimizer','Rencana pasokan'],['Scenario planning','Simulasi what-if'],['Integrasi S/4','Data master & PIR']],
integ:'IBP menerima master data, stok, dan order dari S/4HANA, lalu mengirim rencana kembali. MRP di S/4 (PP) mengeksekusi rencana menjadi planned order dan PR.',
keys:['Supply plan menyeimbangkan demand dan kapasitas','S&OP bulanan berakhir di keputusan eksekutif','Hasil IBP menjadi input MRP di S/4'],
cp:['Rencana S&OP sudah disetujui. Bagaimana rencana itu dieksekusi di S/4HANA?',['Dikirim sebagai PIR lalu MRP membuat planned order/PR','Ditulis manual di email','Diposting sebagai jurnal FI','Tidak dieksekusi'],0,'IBP → PIR → MRP.']})
],
quiz:QZ([
['Pengganti cloud untuk SAP APO?',['SAP IBP','SAP Concur','SAP Ariba','SAP BW'],0,'IBP.'],
['Angka forecast yang disepakati lintas fungsi?',['Consensus demand','Safety stock','Bias','PIR negatif'],0,'Consensus demand.'],
['Ukuran akurasi forecast?',['MAPE','ATP','SLA','APC'],0,'MAPE.'],
['Tahap terakhir siklus S&OP?',['Executive S&OP','Product review','Demand review','Supply review'],0,'Executive.'],
['Rencana IBP masuk ke MRP S/4 sebagai…',['PIR (planned independent requirements)','Billing','Invoice','Dispute'],0,'PIR.']
])}
];

/* ===================== KATALOG LENGKAP, ROLE & MIGRASI ===================== */
const CATS=[
 {id:'dasar',t:'Dasar SAP',d:'Fondasi untuk semua role: navigasi, data induk, struktur organisasi.'},
 {id:'fin',t:'Finance',d:'Akuntansi keuangan, controlling, treasury, dan manajemen piutang.'},
 {id:'log',t:'Logistik',d:'Pembelian, persediaan, penjualan, produksi, mutu, perawatan, gudang, proyek.'},
 {id:'hr',t:'Human Resources',d:'Organisasi, data karyawan, waktu kerja, dan payroll.'},
 {id:'tech',t:'Teknis',d:'Administrasi sistem, pemrograman, UI, keamanan, analitik, integrasi.'},
 {id:'cloud',t:'Solusi pendukung',d:'Aplikasi cloud SAP yang melengkapi S/4HANA.'}];
const LEG_MAP={1:['nav','NAV','dasar','Navigasi SAP GUI'],2:['org','ORG','dasar','Data Induk & Struktur Organisasi'],3:['mm-pur','MM-PUR','log','MM – Pembelian: Procure to Pay'],4:['mm-im','MM-IM','log','MM – Inventory: MIGO & Movement Type'],5:['mm-pi','MM-PI','log','MM – Stok & Stock Opname'],6:['fi-aa','FI-AA','fin','FI-AA – Asset Accounting'],7:['ps','PS','log','PS – Project System: WBS, Biaya & Kurva S'],8:['ps-ops','PS-OPS','log','Rutinitas Admin Proyek, PWO & K3']};
LEGACY_MODS.forEach(m=>{const x=LEG_MAP[m.id];m.legacy=m.id;Object.assign(m,{id:x[0],code:x[1],cat:x[2],title:x[3]});});
(()=>{const aa=LEGACY_MODS.find(m=>m.id==='fi-aa');
 aa.sum='Master aset, AuC, kapitalisasi, penyusutan, transfer, dan retirement aset tetap.';
 aa.lessons.push(L('Siklus aset dari sisi Finance',{p:['Tim aset di Finance mengelola seluruh umur aset: <b>akuisisi</b> (aset dibuat di AS01 dan nilai masuk lewat MIRO, F-90, atau settlement AuC), <b>penyusutan</b> bulanan dengan <b>AFAB</b> berdasarkan depreciation key dan umur manfaat, <b>transfer</b> nilai ke aset lain dalam satu company code (ABUMN) atau antar company code (ABT1N); pindah cost center cukup dengan mengubah data time-dependent di AS02, dan <b>retirement</b> saat aset dijual atau dibuang (ABAON dengan pendapatan, ABAVN tanpa pendapatan).','Satu aset bisa punya beberapa <b>depreciation area</b>, misalnya buku komersial dan pajak, dengan umur dan metode berbeda. Asset Explorer (AW01N) menampilkan nilai per area dan per tahun.'],
 flow:[['AS01','master aset'],['Akuisisi','MIRO / F-90 / AIBU'],['AFAB','penyusutan bulanan'],['ABUMN','transfer'],['ABAON / ABAVN','retirement'],['AJAB','tutup tahun aset']],
 tc:[['AS01 / AS02 / AS03','Membuat / mengubah / menampilkan aset'],['AFAB','Depreciation run'],['ABUMN','Transfer aset dalam company code'],['ABAON / ABAVN','Retirement dengan / tanpa pendapatan'],['AR01','Asset balances (daftar aset)']],
 integ:'Penyusutan AFAB memposting beban ke cost center di master aset. Jika aset dipindah fisik tanpa memperbarui cost center di AS02, beban penyusutan jatuh ke departemen yang salah.',
 keys:['Akuisisi → penyusutan → transfer → retirement','AFAB dijalankan tiap bulan saat tutup buku','Depreciation area: komersial vs pajak'],
 cp:['Mesin lama dijual ke pihak lain seharga Rp 20 jt. Transaksi aset yang tepat?',['Retirement dengan pendapatan (ABAON / atau via FI customer)','ABAVN scrapping','AFAB','AS02 ubah deskripsi'],0,'Penjualan aset = retirement dengan revenue.']}));
 aa.quiz.push(cp('Depreciation run bulanan dijalankan dengan…',['AFAB','AIBU','AS03','F110'],0,'AFAB.'));})();
const ALLMODS=[...LEGACY_MODS,...MODS_FIN,...MODS_LOG,...MODS_TECH,...MODS_CLOUD];
const ORDER=['nav','org','fi-gl','fi-ap','fi-ar','fi-aa','co','tr','fscm','mm-pur','mm-im','mm-pi','sd','pp','qm','pm','wm','le','ps','ps-ops','cs','lo','hcm','basis','abap','fiori','grc','bw','pi','sf','ariba','concur','crm','ibp'];
const MODULES=ORDER.map(id=>ALLMODS.find(m=>m.id===id));
const MOD=Object.fromEntries(MODULES.map(m=>[m.id,m]));
MODULES.forEach((m,i)=>{m.no=i+1;});

/* ---------- ROLE / ARAH KARIR ---------- */
const RGRP=[['ops','Logistik & operasional'],['fin','Finance'],['hr','HR'],['tech','Teknis & data']];
const ROLES=[
{id:'wh',grp:'ops',t:'Warehouse Analyst',d:'Mengelola penerimaan, penyimpanan, picking, dan akurasi stok gudang.',tasks:['Memantau putaway dan picking','Menjaga akurasi stok per bin','Menangani selisih dan opname'],w:['wm','mm-im','mm-pi'],g:['nav','org','le'],p:['mm-pur','qm','sd','lo']},
{id:'inv',grp:'ops',t:'Inventory Analyst',d:'Menganalisis level stok, perputaran, selisih, dan nilai persediaan.',tasks:['Analisis stok lambat & kedaluwarsa','Rekonsiliasi nilai persediaan','Koordinasi opname'],w:['mm-im','mm-pi','lo'],g:['nav','org','mm-pur'],p:['wm','pp','fi-gl','bw']},
{id:'proc',grp:'ops',t:'Procurement Analyst',d:'Mengelola PR sampai PO, vendor, harga, dan kinerja pemasok.',tasks:['Memproses PR menjadi PO','Sourcing & negosiasi harga','Follow up pengiriman vendor'],w:['mm-pur','ariba'],g:['nav','org','mm-im'],p:['fi-ap','qm','co','lo']},
{id:'log',grp:'ops',t:'Logistics Analyst',d:'Merencanakan dan memantau pengiriman, transportasi, dan distribusi.',tasks:['Delivery & shipment','Biaya angkut','Kinerja on-time delivery'],w:['le','sd','wm'],g:['nav','org','mm-im','lo'],p:['mm-pur','pp','ibp']},
{id:'sales',grp:'ops',t:'Sales Admin',d:'Memproses order penjualan sampai penagihan dan melayani pertanyaan customer.',tasks:['Membuat sales order','Memantau delivery & billing','Menangani retur'],w:['sd','crm'],g:['nav','org','le','fscm'],p:['fi-ar','mm-im','cs','lo']},
{id:'ppc',grp:'ops',t:'Production Planner (PPIC)',d:'Merencanakan produksi dan kebutuhan material dengan MRP.',tasks:['Membaca MD04 & exception','Membuat & merilis production order','Menyeimbangkan kapasitas'],w:['pp','mm-im'],g:['nav','org','qm','ibp'],p:['mm-pur','pm','co','lo']},
{id:'qc',grp:'ops',t:'Quality Control / QA',d:'Memeriksa mutu bahan dan produk, mengambil keputusan rilis, dan menangani keluhan.',tasks:['Inspection lot & hasil uji','Usage decision','Quality notification'],w:['qm'],g:['nav','org','mm-im','lo'],p:['pp','mm-pur','pm','sd']},
{id:'mp',grp:'ops',t:'Maintenance Planner',d:'Merencanakan perawatan korektif dan preventif mesin.',tasks:['Notification & work order','Preventive plan','Sparepart & biaya order'],w:['pm','mm-im'],g:['nav','org','mm-pur'],p:['co','fi-aa','qm','cs']},
{id:'proj',grp:'ops',t:'Project Admin',d:'Administrasi proyek: PR/PO, penerimaan, biaya WBS, aset, dan laporan progres.',tasks:['PR, PO, GR untuk proyek','Monitoring biaya & Kurva S','Dokumen kapitalisasi aset'],w:['ps','ps-ops','mm-pur','mm-im'],g:['nav','org','mm-pi'],p:['fi-aa','co','pm','fiori']},
{id:'scp',grp:'ops',t:'Supply Chain Planner',d:'Menyusun forecast, rencana pasokan, dan memimpin siklus S&OP.',tasks:['Demand planning','Supply planning','Persiapan rapat S&OP'],w:['ibp','pp'],g:['nav','org','sd','mm-im'],p:['le','mm-pur','bw']},
{id:'svc',grp:'ops',t:'Customer Service Admin',d:'Menangani servis purna jual, kontrak servis, dan repair.',tasks:['Service notification & order','Kontrak & garansi','Penagihan servis'],w:['cs','sd'],g:['nav','org','crm'],p:['pm','fi-ar','le','mm-im']},
{id:'fin',grp:'fin',t:'Finance / Accountant',d:'Mencatat transaksi, tutup buku, dan menyusun laporan keuangan.',tasks:['Jurnal & accrual','Tutup buku bulanan','Laporan keuangan'],w:['fi-gl','fi-ap','fi-ar','fi-aa'],g:['nav','org','co'],p:['tr','fscm','mm-pur','sd','bw']},
{id:'apar',grp:'fin',t:'AP / AR Specialist',d:'Memproses invoice vendor, pembayaran, penagihan, dan penerimaan customer.',tasks:['MIRO / FB60','Payment run F110','Penerimaan & aging piutang'],w:['fi-ap','fi-ar'],g:['nav','org','fi-gl'],p:['mm-pur','sd','tr','fscm','concur']},
{id:'ctrl',grp:'fin',t:'Controller / Cost Analyst',d:'Menganalisis biaya, anggaran, profitabilitas, dan variance produksi.',tasks:['Plan vs actual cost center','Internal order & budget','Standard cost & variance'],w:['co','fi-gl'],g:['nav','org','fi-aa','ps'],p:['pp','mm-im','sd','bw']},
{id:'treas',grp:'fin',t:'Treasury & Credit Analyst',d:'Mengelola kas, bank, likuiditas, limit kredit, dan penagihan.',tasks:['Bank statement & rekonsiliasi','Cash position & forecast','Credit limit & collections'],w:['tr','fscm'],g:['nav','org','fi-ar','fi-gl'],p:['fi-ap','sd','bw']},
{id:'hr',grp:'hr',t:'HR & Payroll Admin',d:'Mengelola data karyawan, absensi, dan penggajian.',tasks:['Personnel action & infotype','Absensi & cuti','Proses payroll bulanan'],w:['hcm','sf'],g:['nav','org'],p:['fi-gl','co','concur','fiori']},
{id:'abap',grp:'tech',t:'ABAP / Fiori Developer',d:'Membangun laporan, form, enhancement, dan aplikasi Fiori.',tasks:['Laporan ALV & form','BAdI & BAPI','App Fiori/UI5'],w:['abap','fiori'],g:['nav','org','basis'],p:['pi','bw','grc','mm-pur','sd']},
{id:'basis',grp:'tech',t:'Basis Administrator',d:'Menjaga sistem SAP tetap sehat, aman, dan up to date.',tasks:['Monitoring harian','User & job','Transport & upgrade'],w:['basis','grc'],g:['nav','org'],p:['abap','fiori','pi','bw']},
{id:'sec',grp:'tech',t:'Security & GRC Analyst',d:'Mengelola role, akses, SoD, dan dukungan audit.',tasks:['Desain role PFCG','Analisis SoD','Access review & audit'],w:['grc','basis'],g:['nav','org'],p:['fi-gl','mm-pur','hcm','abap']},
{id:'bi',grp:'tech',t:'BI / Data Analyst',d:'Menyediakan data, laporan, dan dashboard untuk keputusan bisnis.',tasks:['Query & dashboard','Monitoring load data','Rekonsiliasi KPI'],w:['bw'],g:['nav','org','fi-gl','co'],p:['sd','mm-im','abap','ibp']}
];
const REL={w:['Kompetensi inti','rel-w','Inti pekerjaan role ini. Kuasai lebih dulu.','Inti'],g:['Kompetensi general','rel-g','Dipakai umum sehari-hari, termasuk dasar SAP.','General'],p:['Pendukung','rel-p','Membantu memahami proses tetangga. Pelajari setelah inti & general.','Pendukung'],a:['Add-on','rel-p','Modul tambahan pilihanmu di luar role.','Add-on']};
function roleOf(){return ROLES.find(r=>r.id===S.role)||null;}
function relOf(mid,r){r=r===undefined?roleOf():r;if(!r)return null;return r.w.includes(mid)?'w':r.g.includes(mid)?'g':r.p.includes(mid)?'p':null;}
function relOrAdd(mid){return relOf(mid)||((S.addons||[]).includes(mid)?'a':null);}
function rolePath(r){const f=r.g.filter(x=>x==='nav'||x==='org');return [...f,...r.w,...r.g.filter(x=>!f.includes(x)),...r.p];}
function relPill(k){return k?`<span class="pill ${REL[k][1]}">${REL[k][3]}</span>`:'';}

/* ---------- studi kasus keputusan → modul ---------- */
const CASE_MOD={'Pembelian':'mm-pur','Jasa':'mm-pur','Movement type':'mm-im','Penerimaan':'mm-im','Opname':'mm-pi','Inventory':'mm-pi','Aset':'fi-aa','Biaya proyek':'ps','Laporan':'ps','K3 & keamanan pangan':'ps-ops','Document control':'ps-ops'};
CASES.forEach(c=>{c.mod=CASE_MOD[c.tag]||'ps-ops';});

/* ---------- migrasi progres versi lama (modul 1–8) ---------- */
(()=>{if(S.v3)return;['les','mq','notes'].forEach(k=>{const o=S[k]||{};Object.keys(o).forEach(key=>{const x=LEG_MAP[key];if(x){o[x[0]]=o[key];delete o[key];}});S[k]=o;});
 const had=Object.keys(S.les).length||Object.keys(S.sims||{}).length;if(!S.role&&had)S.role='proj';S.v3=true;save();})();

/* ===================== PRAKTIK PER BAB (1): T-code bab lama + studi kasus bab ===================== */
// T-code penting untuk bab modul lama (dipakai simulator bab, studi kasus, glosarium, flashcard)
const LEG_TC={
nav:[[['SU3','Mengatur data user sendiri: bahasa, format tanggal, default'],['SESSION_MANAGER','Menu awal SAP Easy Access']],[['ME23N','Menampilkan PO, latihan membaca bagian layar'],['SU3','Data user sendiri']],[['ME5A','Daftar PR'],['MB52','Stok gudang'],['MMBE','Stock overview']],[['ME2N','Laporan PO: F8 untuk execute'],['MM03','Display material: F4 untuk mencari']],[['ME2N','Laporan dengan multiple selection dan variant'],['MB51','Riwayat dokumen material dengan variant']],[['MB52','Laporan stok yang sering di-export'],['SMEN','SAP Easy Access dan Favorites']]],
org:[[['MM03','Data induk material'],['ME23N','Data transaksi: PO']],[['MMBE','Stok per company code, plant, dan sloc'],['CJ20N','Struktur proyek dan WBS']],[['MM03','Material master'],['XK03','Data vendor (ECC)'],['KS03','Cost center']],[['CJ20N','WBS untuk account assignment P'],['KS03','Cost center untuk account assignment K'],['IW33','Order maintenance untuk account assignment F']]],
'mm-pur':[[['ME51N','Membuat PR'],['ME21N','Membuat PO (procurement)'],['MIGO','Goods receipt'],['MIRO','Invoice verification']],[['ME51N','Membuat purchase requisition'],['ME52N','Mengubah PR sebelum diproses']],[['ME53N','Menampilkan PR'],['ME23N','Menampilkan PO'],['MB03','Menampilkan dokumen material']],[['ME23N','PO dan tab PO history'],['ME2M','Riwayat PO per material']],[['MIRO','Posting invoice dengan 3-way match'],['MIR4','Menampilkan invoice']],[['ME5A','Daftar dan status PR'],['ME2N','Daftar PO, filter WE101']],[['ML81N','Service entry sheet untuk jasa'],['MIGO','Goods receipt untuk barang']]],
'mm-im':[[['MIGO','Goods movement'],['MB03','Menampilkan dokumen material']],[['MIGO','Posting GR/GI dengan movement type'],['MB51','Riwayat movement type per material']],[['MIGO','Memilih movement type yang tepat'],['MMBE','Cek stok sesudah posting']],[['MIGO','Cancellation A03 + R02'],['MB51','Mencari dokumen yang salah']]],
'mm-pi':[[['MB52','Stok per gudang'],['MMBE','Stok satu material di semua lokasi'],['MB51','Riwayat pergerakan']],[['MI01','Membuat dokumen opname'],['MI04','Input hasil hitung'],['MI20','Daftar selisih'],['MI07','Posting selisih']],[['MI01','Membuat dokumen opname dengan posting block'],['MI21','Mencetak lembar hitung']],[['MI11','Recount'],['MI20','Daftar selisih untuk berita acara']]],
'fi-aa':[[['AS03','Menampilkan aset'],['AR01','Daftar aset per cost center']],[['CJ20N','WBS proyek CAPEX'],['AW01N','Asset Explorer: nilai AuC']],[['AS03','Data master aset'],['AW01N','Nilai dan penyusutan per tahun']],[['AIAB','Distribusi biaya AuC'],['AIBU','Settlement AuC ke aset final']]],
ps:[[['CJ20N','Project Builder: struktur WBS'],['CJ03','Menampilkan project definition']],[['CJI3','Biaya aktual proyek'],['CJI5','Komitmen proyek'],['KSB1','Biaya cost center']],[['CJI3','Data aktual untuk Kurva S'],['CJ20N','Progres dan tanggal WBS']],[['CJI3','Export biaya mingguan'],['CJI5','Export komitmen mingguan'],['KOB1','Biaya internal order']]],
'ps-ops':[[['ME5A','Cek PR proyek setiap hari'],['ME2N','PO yang dijadwalkan datang']],[['ME5A','Nomor PR untuk database PWO'],['ME2N','Nomor PO untuk database PWO']],[['ME23N','PO sebagai dokumen kontrol'],['ML81N','Service entry sheet (BAST jasa)']],[['IW21','Membuat notifikasi'],['IW38','Daftar work order'],['IW33','Menampilkan work order']],[['IW21','Melaporkan temuan/kerusakan'],['IW38','Memantau order perbaikan']]]
};
LEGACY_MODS.forEach(m=>{const t=LEG_TC[m.id];if(t)m.lessons.forEach((l,i)=>{if(!l.tcRows&&t[i])l.tcRows=t[i];});});

// Studi kasus per bab: [skenario, pertanyaan, [jawaban benar, umpan balik], [salah, umpan balik], [salah, umpan balik]]
const BABCASE={
nav:[
['Hari pertamamu. IT mengirim akses PRD dan QAS. Supervisor minta kamu "coba-coba dulu" membuat PR untuk latihan.','Kamu login ke sistem mana untuk latihan?',['QAS / client training','Tepat. QAS dibuat untuk testing tanpa risiko ke data asli.'],['PRD','PRD berisi data asli; PR latihan akan ikut diproses Procurement.'],['Pakai user rekan yang sudah biasa','Setiap posting tercatat atas nama user. Jangan berbagi user.']],
['Setelah klik Save, status bar kuning bertuliskan "Delivery date cannot be met".','Apa arti pesan ini?',['Warning: dokumen bisa disimpan setelah Enter, tapi perlu ditindaklanjuti','Tepat. Kuning = warning, tidak memblokir.'],['Error: dokumen gagal total','Error berwarna merah dan tidak bisa disimpan.'],['Sukses: abaikan saja','Warning tetap perlu dibaca dan dikomunikasikan.']],
['Kamu sedang di ME23N dan ingin cek stok di MB52 tanpa kehilangan layar PO.','Perintah yang tepat di command field?',['/oMB52','Tepat. /o membuka session baru, PO tetap terbuka.'],['MB52','Dari dalam transaksi, T-code tanpa /n atau /o ditolak.'],['/nMB52','/n menutup ME23N dan membuka MB52 di jendela yang sama.']],
['Di layar filter ME2N kamu sudah mengisi semua kriteria. Laporan belum muncul.','Tombol mana yang menjalankan laporan?',['F8 (Execute)','Tepat. F8 menjalankan laporan dari selection screen.'],['F3 (Back)','F3 kembali ke layar sebelumnya.'],['F4','F4 membuka daftar pilihan untuk field.']],
['Setiap Senin kamu menarik ME2N dengan filter yang sama: P05, plant 1100, WE101.','Cara paling efisien?',['Simpan filter sebagai variant, lalu panggil dengan Get Variant','Tepat. Variant menghemat waktu dan mencegah salah filter.'],['Ketik ulang semua filter setiap minggu','Bisa, tapi lambat dan rawan salah.'],['Minta IT membuat laporan baru','Tidak perlu; variant sudah cukup.']],
['Supervisor minta daftar stok Gudang Proyek dalam Excel setiap Jumat.','Langkah yang tepat setelah MB52 tampil?',['Export ALV ke spreadsheet','Tepat. Export menjaga angka sama dengan SAP.'],['Screenshot layar lalu ketik ulang di Excel','Rawan salah ketik dan lambat.'],['Kirim nomor material saja','Supervisor butuh qty dan nilai, bukan hanya nomor.']]
],
org:[
['Rekan bertanya kenapa PO bisa "salah vendor" padahal vendor di master sudah benar.','Mana yang termasuk data transaksi?',['Purchase order','Tepat. PO adalah transaksi yang memakai data induk.'],['Vendor master','Vendor adalah data induk.'],['Material master','Material adalah data induk.']],
['Ada dua pabrik: Cikarang (1100) dan Surabaya (1200). Kamu mau GR barang untuk Cikarang.','Data organisasi mana yang harus benar di GR?',['Plant 1100 dan storage location tujuan','Tepat. Stok tercatat per plant dan sloc.'],['Company code saja','Company code terlalu tinggi; stok dicatat di plant/sloc.'],['Purchasing group','Purchasing group tidak menentukan lokasi stok.']],
['Kamu harus membuat PR bearing, tapi tidak yakin satuan dan buyer default-nya.','Data yang kamu baca dulu?',['Material master (MM03): base unit dan purchasing group','Tepat. Material master memuat data itu.'],['Laporan MB51','MB51 adalah riwayat pergerakan.'],['Tanya vendor','Data internal ada di SAP.']],
['Kabel 50 M untuk panel baru proyek Conveyor Line 3.','Account assignment yang tepat?',['P + WBS proyek','Tepat. Biaya proyek masuk ke WBS.'],['K + cost center produksi','Biaya proyek akan bercampur dengan biaya operasional.'],['Tanpa account assignment','Barang akan menjadi stok, bukan biaya proyek.']]
],
'mm-pur':[
['Supervisor bertanya kenapa barang yang dia minta minggu lalu belum datang.','Urutan dokumen mana yang benar?',['PR → approval → PO → GR → invoice → bayar','Tepat. Ini alur procure to pay.'],['PO → PR → GR','PO dibuat dari PR yang sudah disetujui.'],['GR → PO → PR','GR baru mungkin setelah PO.']],
['PR 10 bearing untuk proyek. Kamu mengisi A = P tapi SAP menolak save.','Apa yang kurang?',['WBS di tab Account Assignment','Tepat. A = P wajib WBS.'],['Nomor vendor','Vendor tidak wajib di PR.'],['Harga final','Harga diisi Procurement di PO.']],
['Atasan bertanya nomor dokumen dari sebuah pengiriman yang kamu terima kemarin.','Nomor 5000187342 kemungkinan besar dokumen apa?',['Dokumen material GR','Tepat. Seri 50xxxx umumnya dokumen material GR.'],['Purchase order','PO berseri 45xxxxxxxx.'],['Purchase requisition','PR berseri 10xxxxxx.']],
['Vendor menanyakan apakah invoice mereka sudah diterima Finance.','Di mana kamu cek?',['ME23N tab PO history (baris RE-L)','Tepat. RE-L menunjukkan invoice tercatat.'],['MB52','MB52 hanya stok.'],['ME51N','ME51N untuk membuat PR.']],
['Invoice 10 pcs, GR baru 8 pcs, harga sama.','Status invoice?',['Blocked for payment sampai GR lengkap','Tepat. Qty invoice melebihi GR.'],['Langsung dibayar','3-way match gagal.'],['Otomatis dihapus','Invoice tetap tersimpan, hanya diblok.']],
['Rapat mingguan butuh daftar PO proyek yang belum datang.','Parameter yang dipakai di ME2N?',['WE101 (open goods receipt)','Tepat.'],['RE101','Bukan parameter penerimaan barang.'],['Tanpa filter','Hasilnya terlalu banyak.']],
['Jasa commissioning selesai dan BAST ditandatangani.','Penerimaan jasa dicatat dengan…',['Service entry sheet (ML81N)','Tepat. Jasa tidak di-GR lewat MIGO.'],['MIGO 101','MIGO untuk barang.'],['MI04','MI04 untuk opname.']]
],
'mm-im':[
['Gudang mau menerima barang PO tapi bingung pilihan di MIGO.','Kombinasi yang benar?',['A01 Goods Receipt + R01 Purchase Order','Tepat.'],['A07 + R10','Itu goods issue.'],['A03 + R02','Itu pembatalan.']],
['Teknisi mengambil 50 M kabel untuk panel proyek P-26-014.04.','Movement type?',['221 ke WBS','Tepat. 221 = GI ke proyek.'],['201','201 untuk cost center.'],['261','261 untuk order.']],
['Grease untuk pelumasan rutin mesin Line 3.','Movement type?',['201 ke cost center Line 3','Tepat. Biaya operasional rutin.'],['221','Bukan proyek.'],['311','311 hanya memindah lokasi.']],
['GI 221 terposting ke WBS yang salah kemarin.','Cara koreksi yang benar?',['Cancel dengan A03 + R02, lalu posting ulang','Tepat. Pembatalan otomatis memakai 222.'],['Posting 101 untuk mengembalikan','101 untuk GR PO.'],['Biarkan, koreksi di Excel','SAP dan laporan akan berbeda.']]
],
'mm-pi':[
['Teknisi butuh 6 coupling; Gudang Sparepart bilang kosong.','Laporan tercepat untuk melihat lokasi lain?',['MMBE','Tepat. Satu material di semua lokasi.'],['MB52','MB52 per gudang.'],['ME2N','Itu daftar PO.']],
['Opname Gudang Sparepart besok. Dokumen sudah dibuat di MI01.','Langkah setelah menghitung fisik?',['MI04 input hasil hitung','Tepat.'],['MI07 posting selisih langsung','Investigasi dan approval dulu.'],['MI01 lagi','Dokumen sudah ada.']],
['Gudang masih menerima barang saat tim sedang menghitung.','Pencegahan yang tepat?',['Cut-off dan posting block di dokumen opname','Tepat.'],['Hitung dua kali','Tetap tidak menghentikan pergerakan.'],['Abaikan','Hasil opname tidak valid.']],
['MI20 menunjukkan selisih -3 pcs coupling.','Langkah pertama?',['Investigasi: cek MB51, recount MI11','Tepat.'],['Langsung MI07','Selisih belum diverifikasi.'],['GR 101 3 pcs','Tidak ada PO yang diterima.']]
],
'fi-aa':[
['Proyek membeli mesin filling baru Rp 1,2 M yang dipakai lebih dari 5 tahun.','Klasifikasi biayanya?',['CAPEX, dikumpulkan di WBS/AuC','Tepat.'],['OPEX ke cost center','Mesin baru bernilai besar adalah aset.'],['Biaya sparepart','Bukan konsumsi rutin.']],
['Biaya mesin baru tersebar di PO material, jasa, dan instalasi.','Biaya dikumpulkan di…',['WBS lalu di-settle ke AuC','Tepat.'],['Langsung ke aset final','Aset final dibuat setelah commissioning.'],['Cost center produksi','Akan menjadi beban, bukan aset.']],
['Auditor menanyakan lokasi dan cost center aset 1200345.','Transaksi untuk membaca data aset?',['AS03','Tepat.'],['MM03','Itu material.'],['ME23N','Itu PO.']],
['Mesin sudah commissioning dan BAST ditandatangani.','Peranmu dalam kapitalisasi?',['Menyiapkan dokumen dan rincian biaya untuk Finance','Tepat. Finance yang menjalankan AIBU.'],['Menjalankan AIBU sendiri','Biasanya hak Finance.'],['Mengubah umur manfaat','Itu keputusan Finance.']],
['Conveyor dipindah dari Line 1 ke Line 2 sejak Agustus, data SAP belum berubah.','Akibatnya?',['Penyusutan masih dibebankan ke cost center Line 1','Tepat. Perlu transfer/ubah cost center.'],['Tidak ada akibat','Laporan biaya per line akan salah.'],['Aset otomatis dihapus','SAP tidak tahu pemindahan fisik.']]
],
ps:[
['Proyek Conveyor Line 3 punya WBS engineering, material, jasa, elektrikal.','Kabel panel masuk ke WBS…',['Elektrikal & commissioning (.04)','Tepat.'],['Engineering (.01)','Itu untuk desain.'],['Project definition P-26-014','Biaya tidak diposting ke project definition.']],
['Budget 850 jt, actual 610 jt, komitmen 230 jt.','Sisa bebas?',['Rp 10 jt','Tepat. 850 − 610 − 230.'],['Rp 240 jt','Komitmen belum dikurangi.'],['Rp 620 jt','Salah hitung.']],
['Minggu 7: rencana 53%, aktual 44%.','Status RAG?',['Red (SPI ≈ 0,83)','Tepat.'],['Green','Deviasi besar.'],['Amber','SPI di bawah 0,85 = Red.']],
['Laporan mingguan harus dikirim Jumat pagi.','Data biaya diambil dari…',['CJI3 dan CJI5','Tepat. Actual dan komitmen.'],['MB52','Itu stok.'],['ME51N','Itu membuat PR.']]
],
'ps-ops':[
['Senin pagi, kamu mulai rutinitas admin proyek.','Cek harian pertama yang paling penting?',['ME5A: PR proyek yang belum di-approve','Tepat.'],['MI20','Opname tidak harian.'],['AIBU','Kapitalisasi tidak harian.']],
['Supervisor minta nomor PO untuk semua pekerjaan improvement bulan ini.','Sumber yang kamu update?',['Database PWO dengan nomor PR/PO/GR/SES','Tepat.'],['Ingatan saja','Rawan hilang.'],['Email lama','Sulit ditelusuri.']],
['Auditor meminta bukti BAST untuk SES jasa instalasi.','Yang seharusnya ada?',['Arsip BAST yang terhubung dengan nomor PO/SES','Tepat.'],['Hanya nomor SES','Butuh bukti fisik/scan.'],['Foto pekerjaan saja','BAST tetap dibutuhkan.']],
['Conveyor Line 3 sering macet dan kamu perlu koordinasi perbaikan.','Dokumen yang dibuat?',['Notifikasi PM (IW21)','Tepat.'],['PR baru','PR bukan laporan kerusakan.'],['MIGO 201','Itu GI.']],
['Kontraktor mengelas di area produksi tanpa izin kerja panas.','Tindakan?',['Hentikan pekerjaan dan minta izin kerja panas serta pengamanan area','Tepat. K3 dan keamanan pangan didahulukan.'],['Biarkan karena dikejar target','Risiko kebakaran dan kontaminasi.'],['Foto lalu lanjut kerja','Bahaya tetap ada.']]
],
'fi-gl':[
['Rekan Finance melihat dokumen dengan document type WE di akun persediaan.','Asal dokumen itu?',['Goods receipt dari MM','Tepat.'],['Pembayaran vendor','Itu KZ.'],['Invoice customer','Itu DR/RV.']],
['Jurnal listrik terposting ke akun sewa; periode masih terbuka.','Koreksi yang benar?',['Reverse FB08 lalu posting ulang','Tepat.'],['Ubah akun di FB02','Akun tidak bisa diubah.'],['Hapus dokumen','Dokumen terposting tidak bisa dihapus.']],
['CFO meminta laba rugi bulan Oktober versi manajemen.','Yang menentukan susunan barisnya?',['Financial Statement Version','Tepat.'],['Company code','Tidak menentukan susunan laporan.'],['Posting key','Itu debit/kredit.']]
],
'fi-ap':[
['Vendor mengirim email minta ganti rekening bank.','Langkah aman?',['Verifikasi lewat kontak resmi dan dual control sebelum mengubah BP','Tepat. Ini titik rawan fraud.'],['Langsung ubah sesuai email','Bisa jadi phishing.'],['Abaikan','Pembayaran berikutnya bisa gagal.']],
['Invoice jasa konsultan pajak tanpa PO.','Transaksi?',['FB60','Tepat.'],['MIRO','Butuh PO.'],['F-28','Itu penerimaan customer.']],
['Vendor bertanya kenapa invoice yang jatuh tempo belum dibayar F110.','Cek pertama?',['FBL1N: payment block dan jatuh tempo','Tepat.'],['MB52','Bukan urusan stok.'],['VA03','Itu sales order.']]
],
'fi-ar':[
['Customer baru dibuat oleh Sales, tapi billing gagal posting ke FI.','Data AR yang mungkin kosong?',['Reconciliation account / data company code customer','Tepat.'],['Harga material','Itu SD.'],['Movement type','Itu MM.']],
['Customer transfer Rp 90 jt untuk invoice Rp 100 jt, sisanya bulan depan.','Pilihan di F-28 agar invoice lama tertutup?',['Residual item','Tepat.'],['Partial payment','Invoice tetap open.'],['Write-off','Customer masih akan bayar.']],
['Piutang customer A sudah 95 hari lewat jatuh tempo.','Tindakan?',['Prioritaskan penagihan, kirim dunning, koordinasi dengan sales/credit','Tepat.'],['Tunggu saja','Risiko gagal bayar naik.'],['Hapus invoice','Tidak boleh tanpa approval write-off.']]
],
co:[
['Biaya cost center Gudang naik 30 jt bulan ini.','Langkah analisis pertama?',['KSB1 line item untuk cari dokumen penyebab','Tepat.'],['Tambah budget','Belum tahu penyebabnya.'],['Abaikan','Kenaikan harus dijelaskan.']],
['Laba produk A terlihat rendah, ternyata pendapatannya masuk profit center B.','Cek di mana?',['Profit center di master material A','Tepat.'],['Saldo bank','Tidak terkait.'],['Data vendor','Tidak terkait.']],
['Budget internal order event 100 jt, actual sudah 98 jt, ada PO baru 5 jt.','Yang terjadi dengan availability control aktif?',['Peringatan/penolakan karena budget terlampaui','Tepat.'],['PO lolos tanpa info','Availability control memeriksa budget.'],['Order otomatis ditutup','Tidak.']],
['Variance order produksi biskuit selalu besar untuk gula.','Area cek pertama?',['Qty gula di BOM dan GI ke order','Tepat.'],['Data customer','Tidak terkait.'],['Payment terms','Tidak terkait.']]
],
tr:[
['Pagi ini bank statement Mandiri tidak semuanya cocok otomatis.','Baris yang tersisa diproses di…',['FEBAN','Tepat.'],['FB50 manual','Bisa dobel posting.'],['F110','Itu payment run.']],
['Pembayaran pajak besar 3 minggu lagi belum ada dokumennya.','Agar masuk forecast kas?',['Buat memo record (FF63)','Tepat.'],['Abaikan','Forecast meleset.'],['Posting jurnal sekarang','Belum terjadi.']],
['Batch pembayaran 2 M dari F110 siap dikirim ke bank.','Kontrol yang tepat?',['Approval berjenjang di BCM sebelum dikirim','Tepat.'],['Langsung kirim','Tanpa kontrol.'],['Kirim via email','Tidak aman.']]
],
fscm:[
['Order customer tertahan, sales mendesak dirilis karena customer penting.','Langkah yang benar?',['Credit analyst menilai exposure dan mencatat keputusan rilis','Tepat.'],['Sales merilis sendiri','Melanggar kontrol kredit.'],['Hapus credit limit','Menghilangkan kontrol.']],
['Customer bayar kurang 5 jt karena harga di invoice berbeda dengan kontrak.','Dokumentasikan sebagai…',['Dispute case dengan reason harga','Tepat.'],['Write-off','Belum diselidiki.'],['Credit memo langsung','Perlu verifikasi dulu.']],
['Customer berjanji bayar Jumat.','Dicatat sebagai…',['Promise to pay','Tepat.'],['Dispute','Tidak ada sengketa.'],['Tidak perlu dicatat','Tidak bisa dipantau.']]
]
};

/* ===================== PRAKTIK PER BAB (2): studi kasus bab Logistik, HR, Teknis, Cloud ===================== */
Object.assign(BABCASE,{
sd:[
['Customer modern trade punya 12 DC, tetapi tagihan selalu ke kantor pusat.','Bagaimana mengatur partner-nya?',['Sold-to/bill-to/payer kantor pusat, ship-to per DC','Tepat.'],['Buat 12 customer terpisah tanpa relasi','Tagihan akan tersebar.'],['Isi alamat DC di teks order','Delivery memakai ship-to, bukan teks.']],
['Customer komplain barang sudah diterima tapi belum ada invoice.','Cek di mana dulu?',['Document flow sales order','Tepat. Lihat apakah billing sudah dibuat.'],['MB52','Hanya stok.'],['FB60','Itu invoice vendor.']],
['Order tersimpan dengan "Document is incomplete".','Tindakan?',['Lengkapi data di incompletion log sebelum delivery','Tepat.'],['Abaikan','Order bisa tidak terkirim.'],['Hapus order','Tidak perlu, cukup dilengkapi.']],
['Billing sudah dibuat, tapi diskon customer lupa dimasukkan.','Koreksi yang benar?',['VF11 batalkan billing, perbaiki kondisi, billing ulang','Tepat.'],['Ubah jurnal di FB02','Jumlah tidak bisa diubah.'],['Kirim credit memo tanpa analisis','Bisa, tapi pembatalan lebih bersih jika belum dibayar.']]
],
pp:[
['Produksi selalu kurang kemasan 5% dibanding rencana MRP.','Akar masalah yang paling mungkin?',['Qty atau scrap di BOM tidak sesuai pemakaian riil','Tepat.'],['Harga kemasan','Tidak memengaruhi qty.'],['Routing','Routing berisi operasi, bukan komponen.']],
['MD04 gula: available -3.000 KG pada 10.11, PO datang 12.11 dengan "Reschedule in".','Tindakan planner?',['Minta purchasing memajukan PO ke ≤ 10.11','Tepat.'],['Batalkan PO','Malah tambah kurang.'],['Abaikan exception','Produksi bisa berhenti.']],
['Operator tidak bisa konfirmasi CO11N untuk order baru.','Penyebab?',['Order belum di-release','Tepat.'],['BOM kosong','Tetap bisa konfirmasi jika REL.'],['Customer belum bayar','Tidak terkait.']]
],
qm:[
['Bahan baku baru harus selalu diperiksa QC saat datang.','Setting yang dibutuhkan?',['Inspection type 01 aktif di view QM material','Tepat.'],['Ubah movement type ke 201','Tidak terkait.'],['Blokir vendor','Bukan solusi.']],
['Gula lolos uji lab, tapi produksi tidak bisa memakainya.','Yang belum dilakukan?',['Usage decision dengan stock posting ke unrestricted','Tepat.'],['GR ulang','Barang sudah diterima.'],['Membuat PO','Tidak perlu.']],
['Vendor tepung tiga kali gagal uji kadar air.','Dokumen tindak lanjut?',['Quality notification Q2 ke vendor','Tepat.'],['Q1','Q1 untuk keluhan customer.'],['Sales order','Tidak terkait.']]
],
pm:[
['Motor conveyor dipindah dari Line 3 ke Line 1.','Yang perlu diupdate?',['Pemasangan equipment ke functional location Line 1','Tepat.'],['Buat functional location baru','Posisi sudah ada.'],['Tidak perlu','Riwayat dan biaya jadi salah.']],
['Bearing perlu diambil gudang untuk order perbaikan 4000123.','Movement type?',['261','Tepat.'],['201','Itu cost center.'],['221','Itu proyek.']],
['Plan pelumasan dibuat, tapi tidak pernah muncul order.','Cek?',['Penjadwalan IP10 dan job IP30','Tepat.'],['BOM produk','Tidak terkait.'],['Data vendor','Tidak terkait.']]
],
wm:[
['Picker tidak tahu rak mana yang menyimpan 500010.','Laporan?',['Stok per bin (LX02)','Tepat.'],['MB52','Hanya sampai sloc.'],['VA05','Daftar sales order.']],
['Barang sudah dipindah ke rak picking, sistem masih di rak tinggi.','Penyebab?',['TO belum dikonfirmasi (LT12)','Tepat.'],['GR belum diposting','Barang sudah di gudang.'],['Material master salah','Tidak terkait.']],
['Supervisor ingin melihat semua warehouse task terbuka di EWM.','Tempat?',['/SCWM/MON','Tepat.'],['MB51','Riwayat dokumen material.'],['ME2N','Daftar PO.']]
],
le:[
['120 order jatuh tempo kirim hari ini.','Cara membuat delivery?',['VL10 kolektif','Tepat.'],['VL01N satu per satu','Lambat.'],['VA01','Itu membuat order.']],
['Kontainer impor datang minggu depan, gudang perlu persiapan.','Dokumen?',['Inbound delivery berdasarkan PO','Tepat.'],['Outbound delivery','Itu untuk pengiriman keluar.'],['Billing','Tidak terkait.']],
['Satu truk membawa 6 delivery ke 6 toko.','Dokumen penyatu?',['Shipment (VT01N)','Tepat.'],['Sales order gabungan','Tidak perlu.'],['Handling unit','HU untuk kemasan.']]
],
cs:[
['Customer minta perbaikan mesin yang dibeli 8 bulan lalu.','Cek pertama?',['Garansi dan kontrak servis equipment/serial','Tepat.'],['Saldo bank','Tidak terkait.'],['BOM produksi','Tidak terkait.']],
['Servis selesai: 3 jam kerja dan 2 sparepart, tidak dalam garansi.','Penagihan?',['DP90 resource-related billing lalu VF01','Tepat.'],['FB60','Itu invoice vendor.'],['Tidak ditagih','Di luar garansi harus ditagih.']],
['Pompa customer dikirim ke bengkel.','Dokumen pembuka?',['Repair order di SD','Tepat.'],['PO ke vendor','Belum perlu.'],['Production order','Bukan produksi baru.']]
],
lo:[
['Sales tidak bisa membuat order untuk material baru.','Penyebab?',['View Sales untuk sales area belum dibuat','Tepat.'],['Vendor belum ada','Tidak terkait penjualan.'],['Periode FI tertutup','Tidak memblokir order.']],
['Ada keluhan kontaminasi dari satu batch gula.','Laporan untuk menelusuri produk jadi?',['MB56 batch where-used','Tepat.'],['MB52','Hanya stok.'],['MM60','Daftar material.']],
['Perusahaan menjual 300 kombinasi conveyor.','Pendekatan master data?',['Variant configuration','Tepat.'],['300 material terpisah','Sulit dirawat.'],['Teks bebas','Tidak terkontrol.']]
],
hcm:[
['Staf admin resign, penggantinya mengisi kursi yang sama.','Objek yang tetap?',['Position','Tepat.'],['Person','Orangnya berganti.'],['Org unit baru','Tidak perlu.']],
['Kenaikan gaji berlaku 1 Januari.','Cara di infotype 0008?',['Copy record dengan tanggal mulai baru','Tepat.'],['Change record lama','Riwayat hilang.'],['Delete lalu buat baru','Riwayat hilang.']],
['Karyawan sakit 2 hari dengan surat dokter.','Infotype?',['2001 Absences','Tepat.'],['2002 Attendances','Itu kehadiran khusus.'],['0006','Itu alamat.']],
['Simulasi payroll menunjukkan error untuk 3 karyawan.','Langkah?',['Perbaiki data, simulasi ulang sebelum payroll run','Tepat.'],['Lanjut payroll run','Error akan ikut.'],['Exit payroll','Periode belum benar.']]
],
basis:[
['Konsultan ingin mengubah konfigurasi langsung di PRD.','Jawabanmu?',['Ubah di DEV, uji di QAS, transport ke PRD','Tepat.'],['Boleh jika sedikit','Melanggar kontrol perubahan.'],['Ubah di QAS saja','PRD tetap berbeda.']],
['Job laporan stok pagi gagal.','Cek?',['SM37 log job','Tepat.'],['SU01','Itu user.'],['STMS','Itu transport.']],
['Import ke PRD gagal karena objek dari request lain belum ada.','Pelajaran?',['Periksa urutan dan dependensi transport','Tepat.'],['Import terus sampai berhasil','Bisa merusak.'],['Ubah manual di PRD','Melanggar kontrol.']]
],
abap:[
['Programmer perlu tahu field di tabel EKPO.','Transaksi?',['SE11','Tepat.'],['SM37','Job.'],['PA30','HR.']],
['Laporan custom lambat; ada SELECT di dalam LOOP.','Perbaikan?',['Ambil data sekaligus di luar loop','Tepat.'],['Tambah server','Tidak menyelesaikan akar masalah.'],['Hapus ALV','Tidak terkait.']],
['User ingin validasi tambahan saat PO disimpan.','Pendekatan?',['Implementasi BAdI/enhancement','Tepat.'],['Ubah kode standar','Merusak upgrade.'],['Matikan validasi','Tidak aman.']]
],
fiori:[
['User mencari app pengganti ME23N.','Sumber?',['Fiori Apps Reference Library','Tepat.'],['SM37','Tidak terkait.'],['SE11','Tidak terkait.']],
['Tile muncul tapi app error saat dibuka.','Cek?',['/IWFND/ERROR_LOG dan status OData service','Tepat.'],['Hapus user','Tidak perlu.'],['Restart PC','Jarang menyelesaikan.']],
['Butuh app daftar + detail standar secepatnya.','Pendekatan?',['Fiori elements List Report + Object Page','Tepat.'],['SAPUI5 dari nol','Lebih lama.'],['SAPscript','Itu form cetak.']]
],
grc:[
['User plant 1100 bisa membuat PO untuk plant 1200.','Perbaikan?',['Batasi nilai plant di role (derived role)','Tepat.'],['Ganti password','Tidak terkait.'],['Hapus user','Berlebihan.']],
['Staff purchasing diminta ikut posting GR.','Risiko?',['Konflik SoD PO + GR','Tepat.'],['Tidak ada','Ada risiko fraud.'],['Hanya lisensi','Bukan hanya lisensi.']],
['Auditor bertanya siapa yang punya SAP_ALL di PRD.','Laporan?',['SUIM','Tepat.'],['MB52','Tidak terkait.'],['SM37','Tidak terkait.']]
],
bw:[
['Manajer butuh tren 5 tahun digabung data e-commerce.','Platform?',['Data warehouse (BW/4HANA atau Datasphere)','Tepat.'],['VA05','Hanya order SAP.'],['SE16N','Bukan alat analisis.']],
['Finance terbiasa Excel dan ingin pivot data BW.','Alat?',['Analysis for Office','Tepat.'],['SM37','Tidak terkait.'],['FB50','Tidak terkait.']],
['Dashboard pagi masih angka dua hari lalu.','Cek?',['Process chain di RSPC','Tepat.'],['Password user','Tidak terkait.'],['Material master','Tidak terkait.']]
],
pi:[
['IDoc order dari customer status 51: material tidak dikenal.','Setelah mapping diperbaiki?',['Proses ulang dengan BD87','Tepat.'],['Hapus IDoc','Order hilang.'],['Buat order manual dan biarkan IDoc','Bisa dobel.']],
['Pesan PO ke vendor gagal karena SFTP vendor mati.','Setelah server hidup?',['Resend pesan dari monitor','Tepat.'],['Buat PO baru','Dobel PO.'],['Ubah mapping','Tidak perlu.']],
['Perusahaan ingin sinkron SuccessFactors ↔ S/4.','Langkah awal?',['Pakai prepackaged content di Integration Suite','Tepat.'],['Input ulang manual','Rawan salah.'],['Kirim file via email','Tidak aman.']]
],
sf:[
['HR ingin data posisi dan organisasi di cloud.','Modul?',['Employee Central','Tepat.'],['Learning','Untuk pelatihan.'],['Recruiting','Untuk rekrutmen.']],
['Kandidat menandatangani offer.','Modul berikutnya?',['Onboarding','Tepat.'],['Compensation','Belum saatnya.'],['Succession','Tidak terkait.']],
['Manajer melihat data gaji divisi lain.','Perbaikan?',['Role-based permissions (target population)','Tepat.'],['Learning catalog','Tidak terkait.'],['Goal plan','Tidak terkait.']]
],
ariba:[
['Supplier baru harus registrasi dan lolos kualifikasi sebelum tender.','Solusi?',['Supplier Lifecycle & Performance','Tepat.'],['Guided Buying','Untuk belanja karyawan.'],['Contracts','Setelah award.']],
['Tender kemasan selesai di-award.','Agar harga baru dipakai user?',['Kontrak lalu katalog','Tepat.'],['Email ke user','Tidak terkontrol.'],['Ubah harga di MIRO','Salah tempat.']],
['Supplier mengirim ship notice di Ariba Network.','Menjadi apa di S/4?',['Inbound delivery','Tepat.'],['Sales order','Tidak.'],['Asset','Tidak.']]
],
concur:[
['Biaya dinas untuk proyek P-26-014.','Cost object?',['WBS proyek','Tepat.'],['Cost center pribadi','Biaya proyek salah tempat.'],['Kosong','Posting gagal.']],
['Hotel melebihi batas kebijakan.','Yang terjadi?',['Peringatan dan butuh justifikasi/approval','Tepat.'],['Booking batal diam-diam','Tidak.'],['Gaji dipotong','Tidak.']],
['Expense report gagal posting karena WBS sudah ditutup.','Penyebab?',['Status cost object di SAP','Tepat.'],['Foto struk','Tidak terkait.'],['Kartu kredit','Tidak terkait.']]
],
crm:[
['Sales mengunjungi buyer toko ritel.','Dicatat sebagai?',['Activity (visit) pada account','Tepat.'],['Billing','Tidak.'],['Lead','Customer sudah ada.']],
['Manajer ingin perkiraan pendapatan kuartal depan.','Data?',['Pipeline opportunity','Tepat.'],['Daftar contact','Tidak cukup.'],['Ticket','Itu service.']],
['Agen perlu status kirim order saat menjawab ticket.','Yang memungkinkan?',['Integrasi C4C ↔ S/4HANA','Tepat.'],['SM37','Tidak terkait.'],['F110','Tidak terkait.']]
],
ibp:[
['Planner ingin mengubah angka rencana per SKU.','Alat utama?',['Excel add-in IBP','Tepat.'],['SE38','Tidak.'],['MIGO','Tidak.']],
['Forecast produk A selalu lebih tinggi dari realisasi.','Indikator?',['Bias positif','Tepat.'],['MAPE nol','Tidak mungkin.'],['Lead time','Tidak terkait.']],
['Rencana S&OP disetujui direksi.','Eksekusi di S/4?',['PIR → MRP','Tepat.'],['Email ke gudang','Tidak terintegrasi.'],['Jurnal FI','Tidak terkait.']]
]
});

/* ---------- Istilah kunci per modul (glosarium) ---------- */
const TERMS={
nav:[['Client','Unit data terpisah dalam satu sistem SAP, misalnya 800'],['Command field','Kotak di kiri atas untuk mengetik T-code'],['Variant','Filter tersimpan di layar seleksi'],['ALV','Tabel laporan SAP dengan sort, filter, total, export'],['/n · /o','Pindah transaksi di jendela sama · buka di jendela baru']],
org:[['Company code','Entitas hukum'],['Plant','Pabrik/lokasi operasional'],['Storage location (sloc)','Lokasi gudang di dalam plant'],['Account assignment','Ke mana biaya dibebankan: K, P, F, A']],
'mm-pur':[['PR','Purchase Requisition, permintaan pembelian internal'],['PO','Purchase Order, pesanan resmi ke vendor'],['3-way match','Pencocokan PO, GR, dan invoice'],['SES','Service Entry Sheet, penerimaan jasa'],['WE101','Parameter ME2N untuk PO yang belum diterima']],
'mm-im':[['GR','Goods Receipt'],['GI','Goods Issue'],['Movement type','Kode jenis pergerakan stok, misalnya 101, 201, 221, 261, 311'],['Dokumen material','Bukti posting pergerakan stok']],
'mm-pi':[['Posting block','Membekukan pergerakan item selama opname'],['Hitung buta','Lembar hitung tanpa qty buku'],['Recount','Hitung ulang item selisih']],
'fi-aa':[['CAPEX','Belanja modal yang menjadi aset'],['AuC','Asset under Construction'],['APC','Nilai perolehan aset'],['Depreciation area','Area penyusutan: komersial, pajak']],
ps:[['WBS','Work Breakdown Structure'],['Komitmen','Nilai PO yang mengikat budget'],['SPI','Schedule Performance Index = aktual ÷ rencana'],['RAG','Status Red-Amber-Green']],
'ps-ops':[['PWO','Project Work Order / database pekerjaan proyek'],['BAST','Berita Acara Serah Terima'],['Izin kerja panas','Izin K3 untuk pengelasan/pemotongan']],
'fi-gl':[['Universal Journal (ACDOCA)','Tabel tunggal FI dan CO di S/4HANA'],['Document type','Jenis dokumen: SA, KR, RE, KZ, ZP, DR, DZ, WE, AA'],['Posting period','Periode akuntansi yang dibuka/ditutup'],['FSV','Financial Statement Version']],
'fi-ap':[['Reconciliation account','Akun G/L penampung saldo vendor/customer'],['Payment terms','Syarat jatuh tempo'],['Payment block','Penahan pembayaran pada invoice'],['Payment run','Proses F110']],
'fi-ar':[['Residual item','Sisa tagihan yang dibuat sebagai item baru'],['Partial payment','Pembayaran sebagian, invoice tetap open'],['Dunning','Surat pengingat bertingkat'],['Aging','Umur piutang']],
co:[['Cost center','Unit penanggung biaya'],['Profit center','Unit pengukur laba'],['Internal order','Penampung biaya kegiatan sementara'],['Settlement','Pemindahan biaya ke penerima akhir'],['Variance','Selisih aktual vs standar']],
tr:[['House bank','Bank perusahaan di SAP'],['Cash position','Posisi kas jangka sangat pendek'],['Liquidity forecast','Perkiraan arus kas'],['Memo record','Catatan rencana kas tanpa dokumen']],
fscm:[['Credit exposure','Piutang + order terbuka'],['Credit block','Penahan order karena kredit'],['Dispute case','Kasus sengketa tagihan'],['Promise to pay','Janji bayar customer']],
sd:[['Sales area','Sales org + channel + division'],['Ship-to / sold-to','Penerima barang / pemesan'],['PGI','Post Goods Issue (mvt 601)'],['Document flow','Rantai dokumen penjualan'],['Incompletion log','Daftar data wajib yang belum diisi']],
pp:[['BOM','Bill of Material'],['Routing','Urutan operasi produksi'],['MRP','Material Requirements Planning'],['Planned order','Usulan produksi dari MRP'],['TECO','Technically completed']],
qm:[['Inspection lot','Lot pemeriksaan yang dibuat otomatis'],['Usage decision','Keputusan terima/tolak lot'],['QI stock','Stok yang masih diperiksa']],
pm:[['Functional location','Posisi teknis di plant'],['Equipment','Mesin fisik'],['Notification','Laporan masalah/permintaan'],['Maintenance plan','Jadwal perawatan preventif']],
wm:[['Storage bin','Posisi rak'],['Quant','Stok di satu bin'],['Transfer order','Perintah pindah barang (WM)'],['Warehouse task','Tugas pindah barang (EWM)']],
le:[['Shipping point','Titik pengiriman'],['Inbound delivery','Pemberitahuan barang datang'],['Shipment','Kumpulan delivery dalam satu angkutan'],['Handling unit','Kemasan seperti karton/palet']],
cs:[['Installed base','Equipment di lokasi customer'],['Service contract','Kontrak layanan'],['Resource-related billing','Penagihan berdasarkan biaya aktual']],
lo:[['Material type','Jenis material: ROH, HALB, FERT, ERSA'],['Batch','Kelompok stok dengan sifat sama'],['FEFO','First expired, first out'],['Variant configuration','Produk dengan banyak pilihan']],
hcm:[['Infotype','Blok data karyawan'],['Personnel action','Peristiwa: hiring, mutasi, resign'],['Payroll area','Kelompok penggajian'],['Control record','Pengendali periode payroll']],
basis:[['Landscape','DEV → QAS → PRD'],['Work process','Proses server: dialog, background, update'],['Transport request','Paket perubahan antar sistem'],['Short dump','Runtime error ABAP']],
abap:[['Data Dictionary','Definisi tabel dan struktur'],['BAdI','Titik enhancement'],['BAPI','API bisnis SAP'],['CDS view','Model data S/4HANA']],
fiori:[['Launchpad','Halaman awal tile Fiori'],['Business catalog','Kumpulan app untuk role'],['OData','Protokol data untuk app'],['Fiori elements','App standar dari anotasi']],
grc:[['Authorization object','Objek pengendali akses'],['Role (PFCG)','Kumpulan otorisasi'],['SoD','Segregation of duties'],['Firefighter','Akses darurat tercatat']],
bw:[['DataSource','Sumber ekstraksi'],['aDSO','Objek penyimpanan BW'],['Process chain','Urutan load terjadwal'],['Query','Definisi analisis']],
pi:[['IDoc','Dokumen elektronik SAP'],['RFC','Remote Function Call'],['iFlow','Alur integrasi Cloud Integration'],['Adapter','Penghubung protokol']],
sf:[['Employee Central','Inti data karyawan cloud'],['RBP','Role-based permissions'],['Performance form','Formulir penilaian']],
ariba:[['Ariba Network','Jaringan supplier'],['Sourcing event','Tender RFQ/auction'],['ASN','Advance ship notice']],
concur:[['Expense report','Laporan biaya dinas'],['Travel request','Persetujuan awal perjalanan'],['Cost object','Cost center/WBS untuk biaya']],
crm:[['Lead','Minat awal'],['Opportunity','Peluang terkualifikasi'],['Pipeline','Kumpulan peluang'],['SLA','Target waktu layanan']],
ibp:[['S&OP','Sales & Operations Planning'],['Consensus demand','Forecast yang disepakati'],['MAPE','Ukuran error forecast'],['PIR','Planned independent requirement']]
};

/* ===================== PENYELARASAN DENGAN TUTORIAL SAP NYATA =====================
   Diselaraskan dengan tutorial kerja SAP (ME51N, ME54N/ME55, MIGO GR/GI, MB21, MB52, MB51/MB90,
   transfer posting, scrapping, MI31–MI07, ML81N, MD01N/MD04, setup SAP GUI). Identitas perusahaan
   pada tutorial tidak dipakai; semua contoh memakai data fiktif JACIWEY. */
const addHtml=(mid,i,html,rows)=>{const l=MOD_L(mid)[i];l.html+=html;if(rows)l.tcRows=[...(l.tcRows||[]),...rows];};
const MOD_L=mid=>LEGACY_MODS.find(m=>m.id===mid).lessons;
const box=(t,h)=>`<div class="callout"><b>${t}</b>${h}</div>`;
const warnBox=(t,h)=>`<div class="callout warn"><b>${t}</b>${h}</div>`;

/* ---------- NAV: setup SAP GUI ---------- */
addHtml('nav',0,box('Setup awal yang dianjurkan','Setelah login pertama: atur <b>Theme</b> dan ukuran font di SAP GUI Options, susun folder <b>Favorites</b> per pekerjaan (misalnya Inventory, PR-PO, Report), dan aktifkan <b>Extras → Settings → Display technical names</b> supaya T-code tampil di pohon SAP menu. Data default seperti plant, format tanggal, dan bahasa diatur di <code>SU3</code> (System → User Profile → Own Data).'));
addHtml('nav',2,warnBox('Batas session','SAP GUI biasanya membatasi maksimal <b>6 session</b> per login. <code>/o</code> menambah session; <code>/n</code> menutup transaksi aktif dan menggantinya dengan T-code yang kamu ketik di session yang sama.'));

/* ---------- MM-PUR: ME51N lebih rinci ---------- */
addHtml('mm-pur',1,`<h4>Detail yang sering terlewat</h4>
<div class="tbl-wrap"><table><tr><th style="width:28%">Bagian</th><th>Yang perlu diperhatikan</th></tr>
<tr><td><b>Document type</b></td><td>Banyak perusahaan membuat jenis PR sendiri dengan rentang nomor berbeda, misalnya PR Inventory (barang masuk stok), PR Opex (biaya operasional), PR Capex (investasi), PR dari MRP. Jenis PR ikut menentukan strategi approval.</td></tr>
<tr><td><b>Header Note</b></td><td>Catatan untuk satu PR, misalnya calon vendor yang belum terdaftar di SAP atau alasan pembelian.</td></tr>
<tr><td><b>A (Acct. Assignment Cat.)</b></td><td>K = cost center (wajib <b>G/L Account</b> dan <b>Cost Center</b>, pesan error "Enter G/L Account" bila kosong), F = order (misalnya internal order CAPEX/AuC), A = asset, P = WBS, kosong = stok.</td></tr>
<tr><td><b>I (Item Category)</b></td><td>Kosong = barang standar. <b>D = Service</b> untuk jasa: qty biasanya 1 AU, short text maks. 40 karakter, sewa bulanan dibuat satu baris per bulan, detail pekerjaan di item text.</td></tr>
<tr><td><b>Material Group, PGr, Requisitioner</b></td><td>Jika ada nomor material, material group dan data lain tersalin dari material master. Tanpa material, isi short text, material group, dan purchasing group sendiri.</td></tr>
<tr><td><b>Desired Vendor</b></td><td>Diisi bila vendor sudah terdaftar. Harga estimasi diisi di tab <b>Valuation</b>.</td></tr>
<tr><td><b>Release strategy</b></td><td>Klik <b>Check</b>. Jika muncul "No messages issued during check", buka tab <b>Release strategy</b> di header dan pastikan strateginya muncul. PR tanpa strategi tidak bisa di-approve.</td></tr></table></div>
${box('Setelah Save','Status bar menampilkan "Purchase requisition number … created". Catat nomornya; status awal PR adalah <b>blocked</b> (belum di-release) sampai semua approver menyetujui.')}`,
 [['ME51N','Create Purchase Requisition'],['ME52N','Ubah PR (tombol Display/Change)'],['ME5A','Daftar PR, untick Closed agar hanya yang open']]);

/* ---------- MM-PUR: SES lebih rinci ---------- */
addHtml('mm-pur',6,`<h4>Langkah ML81N di lapangan</h4>
<div class="pflow" role="list"><div class="pf" role="listitem"><span class="pf-n">1</span><b>Other Purchase Order</b><small>pilih PO jasa + item</small></div><div class="pf"><span class="pf-n">2</span><b>Create entry sheet</b><small>Short Text, External Number (BAST)</small></div><div class="pf"><span class="pf-n">3</span><b>Adopt services</b><small>bisa per persentase, mis. 50% → 0,5 AU</small></div><div class="pf"><span class="pf-n">4</span><b>Accept. Data</b><small>tanggal dokumen & posting</small></div><div class="pf"><span class="pf-n">5</span><b>Save → Release</b><small>accept = GR jasa di background</small></div></div>
${box('Yang perlu diingat','Satu entry sheet untuk satu baris PO. Setelah di-release (accept), SAP membuat dokumen material di background, jadi <b>PO history</b> di ME23N menampilkan SES dan GR-nya. Membatalkan release butuh alasan. Daftar SES dicari dengan <code>ML84</code>, slip dicetak dari dokumen materialnya dengan <code>MB90</code>.')}`,
 [['ML84','Daftar service entry sheet'],['MB90','Cetak slip dokumen material (GR/GI/SES)']]);

/* ---------- MM-IM: MIGO lebih rinci ---------- */
addHtml('mm-im',0,`<h4>Field MIGO yang sering dipakai</h4>
<div class="tbl-wrap"><table><tr><th style="width:30%">Field</th><th>Isi</th></tr>
<tr><td>Document Date / Posting Date</td><td>Document date = tanggal dokumen dibuat. Posting date = tanggal barang benar-benar bergerak (datang, diambil, dipindah).</td></tr>
<tr><td>Delivery Note, Bill of Lading</td><td>GR: nomor surat jalan vendor. Ikut tampil di laporan.</td></tr>
<tr><td>Material Slip, Doc. Header Text</td><td>GI/transfer: nomor slip/WO dan keterangan, misalnya alasan pemindahan status.</td></tr>
<tr><td>Print + 3 Collective Slip</td><td>Cetak satu slip per dokumen (default). Slip bisa dicetak ulang dengan <code>MB90</code>.</td></tr>
<tr><td>Tab Where: Goods Recipient, Unloading Point</td><td>Nama penerima/pengambil barang dan lokasi bongkar.</td></tr>
<tr><td>Tab PO Data: Del. Completed Ind.</td><td><b>1 Set automatically</b>: item PO tertutup bila qty GR = qty PO. <b>2 Set</b>: tutup item walau qty kurang (vendor tidak sanggup kirim sisa). <b>3 Do not set</b>.</td></tr></table></div>
${box('Check dulu, baru Post','Klik <b>Check</b>. Pesan kuning seperti "Deficit of PO ordered quantity" hanya informasi bahwa GR belum penuh. Jika "Document is O.K.", klik Post: status bar menampilkan nomor dokumen material (GR biasanya 50xxxxxxxx, GI 49xxxxxxxx). Tombol <b>Hold</b> menyimpan draft yang bisa dibuka lagi dari Overview.')}`,
 [['MB90','Cetak ulang slip GR/GI'],['MB51','Cari dokumen per user, plant, sloc, movement type']]);

/* ---------- MM-PI: MB52 & opname lebih rinci ---------- */
addHtml('mm-pi',0,`<h4>Opsi layar seleksi MB52</h4><p>Selain Plant dan Storage Location, MB52 bisa difilter per <b>Material Type</b> (misalnya hanya sparepart), Material Group, dan Purchasing Group. Di bagian Settings ada <b>No zero stock lines</b>, <b>Display batch stocks</b>, dan <b>Do not display values</b>. Pilih <b>Non-hierarchical representation</b> agar hasilnya tabel ALV yang mudah di-export. Susun kolom lewat <b>Change Layout</b> lalu simpan sebagai layout <i>user-specific</i>.</p>`,
 [['MB52','Display Warehouse Stocks of Material'],['MMBE','Stock overview + alamat rak (storage bin)']]);
addHtml('mm-pi',2,box('Posting block vs freeze book inventory','<b>Set Posting Block</b>: item tidak bisa ditransaksikan sampai hasil hitung diinput. <b>Freeze Book Inventory</b>: SAP mengunci (capture) qty buku saat dokumen dibuat, tetapi transaksi masih bisa berjalan. Pilih sesuai kebijakan opname perusahaan.'));
addHtml('mm-pi',3,box('Posting selisih','MI07 memakai movement <b>701</b> (selisih lebih / surplus) dan <b>702</b> (selisih kurang / shortage) secara otomatis. Setiap item selisih wajib diberi <b>Reason for movement</b>. Hasil posting: "Diffs in phys. inv. doc. … posted with m. doc. 49…".'));

/* ---------- PP: MD01N ---------- */
const ppL=MODS_LOG.find(m=>m.id==='pp').lessons[1];
ppL.html+=box('Menjalankan MD01N secara manual','Setelah go-live, MRP berjalan otomatis lewat background job. MD01N dijalankan manual bila perlu hasil segera. Isi Plant (dan MRP Controller bila hanya sebagian material). <b>Planning mode 1</b> (Adapt planning data) mempertahankan usulan lama yang belum di-firm dan menambah yang baru; <b>planning mode 3</b> menghapus lalu membuat ulang semua usulan yang tidak firm. Usulan "firm" adalah usulan MRP yang sudah diubah user, jadi tidak ditimpa MRP. Setelah itu evaluasi di MD04 atau MD07 (lampu merah-kuning-hijau). MRP Live tidak membuat MRP list, jadi MD05/MD06 hanya terisi bila perusahaan masih menjalankan MRP klasik.');

/* ---------- PELAJARAN BARU ---------- */
MOD_L('mm-pur').push(L('Release PR (ME54N, ME55) dan PO dari PR',{p:['PR yang baru dibuat berstatus <b>blocked</b>. Approver me-release sesuai <b>release strategy</b>: daftar <b>release code</b> berurutan, misalnya Supervisor → Manager → General Manager, yang ditentukan oleh jenis PR, nilai, plant, dan purchasing group. Satu kode baru bisa release setelah kode sebelumnya selesai.','<b>ME54N</b> (single release): buka PR lewat <i>Other Purchase Requisition</i>, buka tab <b>Release strategy</b> di header, klik ikon <b>Release</b> di baris kode milikmu, lalu Save. Status bar: "Release effected with release code …". <b>ME55</b> (collective release): isi Release Code dan filter (purchasing group, plant), lihat daftar PR, cek estimasi harga, lalu release beberapa PR sekaligus. Setelah semua kode selesai, release indicator menjadi <b>2 RFQ/purchase order</b> dan Procurement bisa membuat PO di <b>ME21N</b> dengan referensi PR.'],
 flow:[['ME51N','PR blocked'],['ME54N / ME55','release kode 1'],['Release kode berikutnya','sesuai strategi'],['Indicator 2','boleh di-PO'],['ME21N','PO dari PR']],
 tc:[['ME54N','Release satu PR'],['ME55','Collective release PR'],['SBWP','Business Workplace (inbox approval)'],['ME21N','Create Purchase Order dengan referensi PR'],['ME53N','Display PR + status release']],
 tip:'Sebelum release, buka detail PR: cek estimasi harga (tab Valuation), account assignment, dan header note. Approver bertanggung jawab atas angka yang ia setujui.',
 keys:['PR baru = blocked sampai semua release code selesai','ME54N satu PR, ME55 banyak PR sekaligus','Indicator 2 RFQ/purchase order = siap dibuat PO (ME21N)'],
 cp:['Release strategy PR punya kode 01 Supervisor dan 02 Manager. Manager mencoba release lebih dulu. Apa yang terjadi?',['Ditolak karena release prerequisite (kode Supervisor) belum terpenuhi','Langsung jadi PO','PR terhapus','Kode Supervisor otomatis terlewati'],0,'Release berurutan sesuai strategi.']}));
MOD_L('mm-im').push(L('Reservasi dan GI dari reservasi (MB21, MIGO R09)',{p:['<b>Reservasi</b> adalah permintaan pengambilan barang dari gudang yang dibuat sebelum barang diambil, misalnya teknisi butuh sparepart minggu depan. Gudang bisa menyiapkan barang, dan MRP ikut menghitungnya sebagai kebutuhan.','Di <b>MB21</b> isi Base Date (kapan dibutuhkan), Movement Type (misalnya 201 untuk cost center) dan Plant. Di layar berikutnya isi Goods Recipient, Cost Center, lalu daftar material, qty, dan storage location. Saat barang diambil, gudang memposting GI di <b>MIGO A07 Goods Issue + R09 Reservation</b> dengan nomor reservasi: item, movement type, dan cost center terisi otomatis.'],
 flow:[['MB21','buat reservasi'],['MB25','gudang cek daftar'],['MIGO A07 + R09','GI dari reservasi'],['MB90','cetak slip GI']],
 tc:[['MB21','Create Reservation'],['MB22','Change Reservation (hapus item)'],['MB25','Daftar reservasi'],['MIGO','A07 Goods Issue + R09 Reservation']],
 tip:'Satu dokumen GI bisa mengambil beberapa reservasi sekaligus, jadi nomor reservasi di MIGO bisa hilang setelah Enter. Itu normal.',
 keys:['Reservasi = permintaan barang sebelum diambil','MB21 → MIGO A07 + R09','Data cost center dan movement type ikut dari reservasi'],
 cp:['Teknisi sudah membuat reservasi 0000001950 untuk 2 V-belt. Gudang mengeluarkan barangnya. Kombinasi MIGO yang tepat?',['A07 Goods Issue + R09 Reservation','A01 Goods Receipt + R01 Purchase Order','A08 Transfer Posting + R10 Other','A03 Cancellation + R02 Material Document'],0,'GI dari reservasi memakai referensi R09.']}));
MOD_L('mm-im').push(L('Ubah status stok dan scrapping (343/344, 551/555)',{p:['Barang rusak tidak boleh dipakai, tetapi juga belum tentu langsung dibuang. Langkah umumnya: pindahkan dulu ke <b>blocked stock</b> dengan <b>MIGO A08 Transfer Posting + R10 Other</b>, movement <b>344</b> (unrestricted → blocked). Isi alasan di Doc. Header Text. Movement <b>343</b> adalah kebalikannya (blocked → unrestricted). Cek dulu dan sesudahnya di MB52.','Jika barang memang dibuang, posting <b>scrapping</b> dengan <b>MIGO A07 Goods Issue + R10 Other</b>: <b>551</b> dari unrestricted, <b>555</b> dari blocked stock. Scrapping membebankan nilai barang ke cost center dan biasanya wajib <b>Reason for Movement</b>. Beberapa perusahaan memakai movement custom (kode Z), jadi tanyakan kode dan alasan yang berlaku ke Finance.'],
 flow:[['MB52','cek stok & sloc'],['MIGO 344','unrestricted → blocked'],['Keputusan','perbaiki / buang'],['MIGO 555','scrap dari blocked'],['MB52','cek ulang']],
 tc:[['MIGO','A08 Transfer Posting, mvt 343/344'],['MIGO','A07 Goods Issue, mvt 551/555 (scrapping)'],['MB52','Cek perubahan status stok']],
 tip:'Scrapping mengurangi nilai persediaan dan menambah biaya. Pastikan ada berita acara dan approval sebelum posting.',
 keys:['344 = unrestricted → blocked, 343 = sebaliknya','551 scrap dari unrestricted, 555 dari blocked','Scrapping butuh cost center dan reason for movement'],
 cp:['10 roller penyok sudah dipindah ke blocked stock dan diputuskan dibuang. Movement type scrapping yang tepat?',['555','551','344','311'],0,'Barangnya ada di blocked stock, jadi scrapping dari blocked = 555.']}));
MOD_L('mm-pi').push(L('Dokumen opname massal dan posting selisih (MI31, MI07)',{p:['Untuk gudang dengan ratusan item, dokumen opname dibuat massal dengan <b>MI31</b>: pilih plant, storage location, material type/group, dan tipe stok yang dihitung (unrestricted, quality inspection, blocked). Opsi <b>Select data and issue log</b> menampilkan daftar dulu sebelum dokumen dibuat; <b>Generate batch input</b> untuk jumlah sangat besar. Urutkan berdasarkan storage bin agar lembar hitung mengikuti rak.','Setelah hitung: <b>MI04</b> input hasil (centang <b>Zero count</b> untuk item yang memang nol), <b>MI05</b> ubah hitungan, <b>MI06</b> tampilkan, <b>MI22</b> daftar dokumen per material/status, <b>MI20</b> daftar selisih (book qty, counted qty, difference qty & amount). <b>MI07</b> memposting selisih dengan alasan per item; SAP memakai movement <b>701</b> untuk surplus dan <b>702</b> untuk shortage.'],
 flow:[['MI31','buat dokumen massal'],['MI21','cetak lembar hitung'],['MI04','input hasil'],['MI20','analisis selisih'],['MI07','posting + reason'],['MIGO','display dokumen 701/702']],
 tc:[['MI31','Create PI documents (batch)'],['MI02','Change/hapus dokumen opname'],['MI22','Daftar dokumen opname'],['MI05','Change count'],['MI06','Display count'],['MI07','Post difference']],
 tip:'Qty 0 yang dikosongkan berbeda dengan qty 0 yang dicentang Zero count. Item kosong dianggap belum dihitung.',
 keys:['MI31 untuk dokumen opname dalam jumlah besar','MI04 → MI20 → MI07','Selisih: 701 surplus, 702 shortage, wajib reason'],
 cp:['Hasil hitung roller 12 PC, stok buku 15 PC. Saat MI07, movement type apa yang dibuat SAP?',['702 (shortage)','701 (surplus)','551','101'],0,'Hitungan lebih kecil dari buku = kekurangan = 702.']}));

/* ---------- studi kasus bab baru ---------- */
BABCASE['mm-pur'].push(['PR jasa kalibrasi Rp 18 jt dari QC menunggu approval. Kamu Supervisor (kode 01). Di ME54N kamu lihat estimasi harga Rp 180 jt, padahal penawaran vendor Rp 18 jt.','Tindakan yang tepat?',['Jangan release; kembalikan ke pembuat untuk memperbaiki harga/qty','Approver harus mengecek angka sebelum menyetujui.'],['Release saja, nanti Procurement yang koreksi','Strategi approval bisa naik ke level lebih tinggi karena nilai salah.'],['Release lalu hapus PR','Tidak perlu; cukup minta revisi.']]);
BABCASE['mm-im'].push(['Teknisi butuh 2 V-belt untuk perawatan Line 3 minggu depan. Gudang ingin barangnya disiapkan dulu.','Dokumen yang dibuat lebih dulu?',['Reservasi di MB21 (movement 201, cost center Line 3)','Gudang tahu kebutuhan dan MRP ikut menghitung.'],['Langsung GI 201 hari ini','Barang belum diambil; stok akan berkurang terlalu cepat.'],['PR di ME51N','Barang tersedia di gudang, tidak perlu dibeli.']]);
BABCASE['mm-im'].push(['5 bearing ditemukan berkarat di rak. QC minta barang tidak dipakai sambil menunggu keputusan.','Langkah yang tepat?',['MIGO A08 movement 344 ke blocked stock dengan alasan di header text','Barang tidak bisa dipakai, tapi masih tercatat sebagai stok.'],['Scrapping 551 langsung','Belum diputuskan dibuang.'],['Biarkan di unrestricted','Barang rusak bisa terpakai produksi.']]);
BABCASE['mm-pi'].push(['MI20 menunjukkan coupling selisih −3 PC dan bearing +2 PC. Berita acara sudah disetujui.','Saat MI07, apa yang harus diisi?',['Reason for movement per item; SAP membuat 702 untuk coupling dan 701 untuk bearing','Movement otomatis sesuai arah selisih, alasan wajib diisi.'],['Pilih movement 551 untuk semua','551 adalah scrapping, bukan selisih opname.'],['Tidak perlu alasan','Alasan dibutuhkan untuk audit.']]);

/* ---------- kuis tambahan ---------- */
const qAdd=(mid,arr)=>{const m=LEGACY_MODS.find(x=>x.id===mid)||MODS_LOG.find(x=>x.id===mid);arr.forEach(q=>m.quiz.push(cp(...q)));};
qAdd('mm-pur',[['T-code untuk release banyak PR sekaligus?',['ME55','ME54N','ME5A','ME21N'],0,'ME55 = collective release.'],['Item category untuk PR jasa?',['D (Service)','K','P','Kosong'],0,'D = service.']]);
qAdd('mm-im',[['GI dari reservasi di MIGO memakai referensi…',['R09 Reservation','R01 Purchase Order','R10 Other','R02 Material Document'],0,'R09.'],['Movement untuk memindah stok unrestricted ke blocked?',['344','343','311','551'],0,'344.']]);
qAdd('mm-pi',[['Movement type untuk selisih opname kurang (shortage)?',['702','701','551','262'],0,'702.']]);
qAdd('pp',[['Planning mode MD01N yang menghapus dan membuat ulang semua usulan yang tidak firm?',['3','1','2','0'],0,'Mode 3 = delete and recreate.']]);

/* ---------- alur, glosarium ---------- */
FLOWS.opname[6].d='Posting selisih setelah disetujui. SAP memakai 701 (surplus) / 702 (shortage); isi reason per item.';
TERMS['mm-pur'].push(['Release strategy','Urutan approval PR (release code) sesuai jenis, nilai, plant'],['Release indicator','Status PR: X blocked, 2 = boleh dibuat RFQ/PO'],['Item category D','Item jasa (service) di PR/PO']);
TERMS['mm-im'].push(['Reservasi','Permintaan pengambilan barang sebelum barang diambil (MB21)'],['Del. Completed Ind.','Penanda item PO selesai diterima'],['Goods Recipient','Nama penerima/pengambil barang di MIGO'],['Blocked stock','Stok yang ditahan, tidak bisa dipakai']);
TERMS['mm-pi'].push(['Zero count','Penanda bahwa hasil hitung memang nol'],['Freeze book inventory','Membekukan qty buku saat dokumen opname dibuat']);

/* ===================== PENGAYAAN & KOREKSI MATERI (crosscheck Nov 2026) =====================
   Bab dan baris T-code tambahan per modul. Semua contoh tetap memakai data fiktif JACIWEY. */
const lessonOf=(mid,i)=>MOD[mid].lessons[i];
const addTc=(mid,i,rows)=>{const l=lessonOf(mid,i),k=l.html.lastIndexOf('</table>');if(k<0)return;
  l.html=l.html.slice(0,k)+rows.map(r=>`<tr><td>${r[0].split(' / ').map(tcCell).join(' ')}</td><td>${r[1]}</td></tr>`).join('')+l.html.slice(k);l.tcRows=[...(l.tcRows||[]),...rows];};
const addBox=(mid,i,t,h,warn)=>{lessonOf(mid,i).html+=`<div class="callout${warn?' warn':''}"><b>${t}</b>${h}</div>`;};
const addLesson=(mid,l,quiz)=>{MOD[mid].lessons.push(l);(quiz||[]).forEach(q=>MOD[mid].quiz.push(cp(...q)));};
const mvTable=(head,rows)=>`<div class="tbl-wrap"><table><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<td style="white-space:nowrap"><b>${c}</b></td>`).join('')}</tr>`).join('')}</table></div>`;

/* ---------- NAV ---------- */
addBox('nav',2,'Perintah lain di command field','<code>/i</code> menutup session yang sedang aktif. <code>/o</code> tanpa T-code menampilkan daftar session yang sedang terbuka. Riwayat T-code yang pernah kamu ketik bisa dibuka lewat panah kecil di ujung command field.');

/* ---------- FI-GL ---------- */
addLesson('fi-gl',L('Posting key dan document type',{p:[
 'Setiap line item dokumen akuntansi punya <b>posting key</b> dua digit yang menentukan jenis akun dan sisi debit/kredit. Yang paling sering terlihat: <b>40</b> debit akun G/L dan <b>50</b> kredit akun G/L; <b>31</b> kredit vendor (invoice masuk), <b>21</b> debit vendor (credit memo), <b>25</b> debit vendor (pembayaran keluar); <b>01</b> debit customer (invoice), <b>11</b> kredit customer (credit memo), <b>15</b> kredit customer (pembayaran masuk); <b>70</b> debit aset dan <b>75</b> kredit aset.',
 'Di layar FB50, FB60, dan FB70 kamu cukup memilih Debit/Credit dan SAP mengisi posting key-nya. Posting key tetap tampil di FB03 dan laporan line item, jadi berguna untuk membaca dokumen yang dibuat modul lain.',
 '<b>Document type</b> melengkapi gambaran itu. Selain SA, KR, KZ, DR, DZ, AA, dan WE, kamu akan sering bertemu <b>RE</b> (invoice dari MIRO), <b>ZP</b> (pembayaran dari payment run F110), <b>RV</b> (billing SD), <b>WA</b> (goods issue), <b>WL</b> (goods issue untuk delivery), dan <b>AF</b> (posting penyusutan). Setiap document type punya rentang nomor sendiri.'],
 tc:[['FB03','Menampilkan dokumen: header, posting key, dan line item'],['FBL3N / FAGLL03','Line item akun G/L'],['FB02','Mengubah dokumen terposting (hanya teks, assignment, dan sejenisnya)'],['FBV0','Memposting dokumen yang di-park'],['F-03','Clearing akun G/L (misalnya akun perantara)'],['FBRA','Reset cleared items, membuka kembali clearing yang salah']],
 tip:'Document type dan rentang nomor bisa dikustom perusahaan. Minta daftar document type yang berlaku ke tim GL sebelum menyimpulkan asal sebuah dokumen.',
 keys:['Posting key 40/50 untuk G/L; 31/21/25 vendor; 01/11/15 customer; 70/75 aset','RE = invoice MIRO, ZP = pembayaran F110, AF = penyusutan','FBRA membuka kembali clearing yang salah'],
 cp:['Di FB03 kamu melihat line item akun vendor dengan posting key 31. Artinya…',['Kredit ke akun vendor: hutang bertambah karena invoice masuk','Debit ke akun vendor karena pembayaran','Debit akun G/L biaya','Kredit ke akun customer'],0,'31 = kredit vendor (invoice). Pembayaran keluar memakai 25.']}),
 [['Posting key untuk mendebit akun G/L?',['40','50','31','15'],0,'40 debit G/L, 50 kredit G/L.'],['Invoice vendor yang diposting lewat MIRO biasanya memakai document type…',['RE','KR','DZ','SA'],0,'RE = invoice dari Logistics Invoice Verification; KR untuk FB60.']]);

/* ---------- FI-AP ---------- */
addBox('fi-ap',1,'Pajak pada invoice','PPN masukan ditentukan oleh <b>tax code</b> yang dipilih di invoice. Pajak yang dipotong dari vendor, misalnya PPh atas jasa, dihitung lewat <b>withholding tax</b>: tipe dan kodenya disimpan di master vendor, lalu muncul di tab Withholding Tax saat MIRO atau FB60. Kode pajak adalah konfigurasi perusahaan, jadi ikuti daftar dari tim pajak.',true);
addTc('fi-ap',2,[['F-54','Clearing down payment vendor dengan invoice'],['FBRA','Reset clearing pembayaran yang salah']]);

/* ---------- FI-AA ---------- */
addTc('fi-aa',4,[['ABT1N','Transfer aset antar company code'],['F-92','Retirement aset dengan penjualan ke customer'],['S_ALR_87011990','Asset history sheet (mutasi nilai aset per periode)'],['AJAB','Tutup tahun buku aset']]);

/* ---------- CO ---------- */
addLesson('co',L('Alokasi biaya dan activity type',{p:[
 'Biaya cost center pendukung (utilitas, gedung, IT) dibagi ke cost center lain di akhir bulan. <b>Distribution</b> (KSV5) memindahkan primary cost dengan cost element aslinya, sehingga penerima tetap melihat "biaya listrik". <b>Assessment</b> (KSU5) memakai secondary cost element khusus alokasi, sehingga penerima melihat satu baris "alokasi utilitas". Dasar pembaginya bisa persentase tetap atau <b>statistical key figure</b> seperti luas area atau jumlah karyawan.',
 '<b>Activity type</b> adalah jasa yang dihasilkan cost center, misalnya jam mesin atau jam tenaga kerja, dengan tarif per satuan (KP26). Saat produksi mengonfirmasi jam di production order, cost center produksi dikredit dan order didebit sebesar jam × tarif. Koreksi salah pembebanan biaya primary dilakukan dengan manual reposting (KB11N), bukan dengan mengubah dokumen FI.',
 'Di S/4HANA, cost element tidak lagi dibuat terpisah. Primary dan secondary cost element adalah akun G/L dengan tipe akun yang sesuai dan dikelola di FS00.'],
 flow:[['Posting primer','FI, MM, HR'],['KB11N','koreksi pembebanan'],['KSV5 / KSU5','distribution / assessment'],['KB21N','alokasi aktivitas'],['KSB1','analisis hasil']],
 tc:[['KSV5','Menjalankan distribution aktual'],['KSU5','Menjalankan assessment aktual'],['KP26','Tarif activity type per cost center'],['KB21N','Direct activity allocation'],['KB11N','Manual reposting biaya primary'],['KB31N','Input statistical key figure aktual']],
 integ:'Tarif activity type dipakai product costing (CK11N) untuk menghitung biaya konversi. Tarif yang tidak diperbarui membuat standard cost dan variance produksi ikut meleset.',
 keys:['Distribution mempertahankan cost element asli; assessment memakai secondary','Activity type = jasa cost center dengan tarif (KP26)','S/4HANA: cost element adalah akun G/L (FS00)'],
 cp:['Biaya listrik pabrik ingin dibagi ke tiga cost center produksi dan tetap terlihat sebagai "biaya listrik" di laporan penerima. Cara alokasi yang tepat?',['Distribution (KSV5)','Assessment (KSU5)','Settlement order (KO88)','Jurnal manual FB50 tiap bulan'],0,'Distribution memindahkan primary cost dengan cost element aslinya.']}),
 [['Tarif activity type per cost center diisi di…',['KP26','KP06','KS01','KO22'],0,'KP26 = activity type/price planning.'],['Di S/4HANA, cost element dikelola sebagai…',['Akun G/L di FS00','Master tersendiri di KA01 saja','Profit center','Internal order'],0,'Cost element = akun G/L dengan tipe akun cost element.']]);

/* ---------- MM-PUR ---------- */
addLesson('mm-pur',L('Sumber pasokan, kontrak, dan jenis PO',{p:[
 'Sebelum PR menjadi PO, Procurement menentukan <b>sumber pasokan</b>. Datanya tersimpan di <b>purchasing info record</b> (harga, lead time, dan syarat satu vendor untuk satu material), <b>source list</b> (vendor yang boleh atau wajib dipakai dalam periode tertentu), dan <b>outline agreement</b>: contract untuk harga atau kuantitas yang disepakati setahun, dan scheduling agreement untuk pengiriman terjadwal. Jika belum ada sumber, buyer meminta penawaran lewat RFQ, memasukkan quotation, lalu membandingkan harga.',
 'Jenis PO mengikuti kebutuhannya: <b>NB</b> standard PO, <b>FO</b> framework order untuk jasa atau biaya berulang dengan batas nilai dan masa berlaku, dan <b>UB</b> stock transport order untuk memindahkan stok antar plant. Item category menambah variasi proses: <b>K</b> consignment (stok milik vendor sampai dipakai), <b>L</b> subcontracting (komponen dikirim ke vendor untuk dikerjakan), <b>D</b> service, dan <b>B</b> limit.'],
 flow:[['PR di-release','ME54N / ME55'],['Cek sumber','info record, source list, kontrak'],['RFQ & quotation','ME41, ME47, ME49'],['PO','ME21N / ME59N'],['Pantau','ME2N, ME2K']],
 tc:[['ME11 / ME13','Membuat / menampilkan purchasing info record'],['ME01 / ME03','Maintain / display source list'],['ME31K / ME33K','Membuat / menampilkan contract'],['ME41','Membuat RFQ'],['ME47','Memasukkan quotation vendor'],['ME49','Perbandingan harga quotation'],['ME57','Assign dan proses PR menjadi PO'],['ME59N','Membuat PO otomatis dari PR'],['ME2K','Daftar PO per account assignment (cost center, WBS, order)']],
 tip:'PR yang lama tidak menjadi PO sering kali bukan karena buyer lambat, tetapi karena sumber pasokan belum ada. Lampirkan penawaran atau usulan vendor di PR supaya proses RFQ lebih singkat.',
 keys:['Info record = harga & syarat per vendor-material','Contract untuk harga jangka panjang, RFQ bila belum ada sumber','NB standard, FO framework, UB stock transport'],
 cp:['Kemasan karton dibeli tiap bulan dari vendor yang sama dengan harga yang sudah disepakati untuk satu tahun. Dokumen pembelian yang menyimpan kesepakatan itu?',['Contract (outline agreement) di ME31K','RFQ di ME41','PR baru setiap bulan dengan harga manual','Reservasi MB21'],0,'Contract menyimpan harga/kuantitas yang disepakati; PO bulanan dibuat dengan referensi contract.']}),
 [['Data harga dan lead time satu vendor untuk satu material disimpan di…',['Purchasing info record','Source list','Release strategy','Material group'],0,'Info record (ME11/ME13).'],['Jenis PO untuk memindahkan stok antar plant?',['UB (stock transport order)','NB','FO','D'],0,'UB = stock transport order.']]);

/* ---------- MM-IM ---------- */
(()=>{const l=L('Movement type lain yang sering muncul',{p:[
 'Selain 101, 201, 221, 261, dan 311, laporan MB51 akan menampilkan banyak movement type lain. Kamu tidak perlu menghafal semuanya, tetapi perlu bisa membacanya agar tahu apa yang terjadi pada stok.'],
 tc:[['MB51','Riwayat dokumen material, filter per movement type'],['MMBE','Cek tipe stok sebelum dan sesudah posting'],['MIGO','Posting dan pembatalan pergerakan barang']],
 tip:'Movement 501 dan 561 menambah stok tanpa PO. Di banyak perusahaan keduanya dibatasi ketat karena melewati kontrol pembelian, jadi jangan memakainya untuk "menambal" stok.',
 keys:['122/161 retur ke vendor, 301/309 transfer posting, 321 QI → unrestricted','501 dan 561 menambah stok tanpa PO, penggunaannya dibatasi','601 PGI penjualan, 641 stock transport order'],
 cp:['Di MB51 terlihat movement 122 untuk bearing dari PO 4500021873. Apa yang terjadi?',['Barang yang sudah di-GR dikembalikan ke vendor','Barang dipindah ke blocked stock','GR kedua untuk PO yang sama','Selisih opname'],0,'122 = return delivery ke vendor dengan referensi PO/GR.']});
 l.html=l.html.replace('<div class="tbl-wrap">',mvTable(['Mvt','Arti','Catatan'],[
  ['103 / 105','GR ke GR blocked stock / rilis dari GR blocked stock','Barang diterima bersyarat, belum menjadi stok milik sendiri sampai 105'],
  ['122','Return delivery ke vendor','Mengembalikan barang yang sudah di-GR, dengan referensi PO'],
  ['161','GR untuk item retur di PO','Item PO bertanda returns; stok berkurang'],
  ['301','Transfer plant ke plant (satu langkah)','Untuk dua langkah dipakai 303 lalu 305'],
  ['309','Transfer material ke material','Mengubah nomor material, misalnya koreksi salah kode'],
  ['321 / 322','Quality inspection → unrestricted / sebaliknya','Biasanya terjadi lewat usage decision QM'],
  ['501','GR tanpa PO','Penerimaan tanpa referensi pembelian'],
  ['511','GR barang gratis (free of charge)','Tidak ada nilai pembelian'],
  ['541 / 543','Kirim komponen ke subkontraktor / pemakaian komponen','543 terposting otomatis saat GR 101 barang subkontrak'],
  ['561','Saldo awal stok','Dipakai saat go-live atau migrasi data'],
  ['551 / 553 / 555','Scrapping dari unrestricted / QI / blocked','Wajib cost center dan alasan'],
  ['601 / 641','PGI delivery penjualan / GI stock transport order','641 memindahkan stok ke stock in transit'],
  ['701 / 702','Selisih opname lebih / kurang','Dibuat otomatis oleh MI07']])+'<div class="tbl-wrap">');
 addLesson('mm-im',l,[['Movement type untuk mengembalikan barang yang sudah di-GR ke vendor?',['122','102','161','311'],0,'122 = return delivery; 102 membatalkan dokumen GR.'],['Stok quality inspection dilepas ke unrestricted dengan movement…',['321','322','343','344'],0,'321 = QI ke unrestricted.']]);})();

/* ---------- MM-PI ---------- */
addLesson('mm-pi',L('Cycle counting dan opname tanpa dokumen',{p:[
 'Opname tahunan menghentikan gudang berhari-hari. <b>Cycle counting</b> membaginya menjadi hitungan kecil sepanjang tahun: setiap material diberi indikator cycle counting (A, B, C, …) di material master, dan indikator itu menentukan berapa kali setahun material dihitung. Material bernilai tinggi atau cepat bergerak dihitung lebih sering.',
 'MICN membuat dokumen opname untuk material yang sudah jatuh tempo hitung. Langkah berikutnya sama: cetak, hitung, MI04, MI20, MI07. Untuk koreksi cepat satu item yang sudah disetujui, tersedia transaksi satu langkah: <b>MI09</b> memasukkan hasil hitung tanpa dokumen opname sebelumnya, dan <b>MI10</b> membuat dokumen, hitungan, dan posting selisih sekaligus.'],
 flow:[['Indikator CC','material master'],['MICN','dokumen untuk item jatuh tempo'],['Hitung','sebagian rak'],['MI04 → MI20','input & selisih'],['MI07','posting']],
 tc:[['MICN','Membuat dokumen opname cycle counting'],['MI09','Input hasil hitung tanpa referensi dokumen'],['MI10','Dokumen, hitungan, dan posting selisih dalam satu langkah'],['MI24','Daftar dokumen opname'],['MIDO','Overview opname per material']],
 tip:'MI10 melewati tahap review selisih. Pakai hanya bila kebijakan perusahaan mengizinkan dan berita acara sudah disetujui.',
 keys:['Cycle counting = opname bertahap sepanjang tahun','Indikator CC menentukan frekuensi hitung','MI09/MI10 untuk proses singkat, tetap butuh approval'],
 cp:['Gudang ingin bearing bernilai tinggi dihitung empat kali setahun tanpa menutup gudang. Pendekatan yang tepat?',['Cycle counting dengan indikator CC di material master dan MICN','Opname tahunan MI31 untuk semua material','GR 561 setiap ada selisih','Menghapus stok lalu input ulang'],0,'Cycle counting menjadwalkan hitungan berkala per kelas material.']}),
 [['T-code untuk membuat dokumen opname cycle counting?',['MICN','MI31','MI20','MB52'],0,'MICN.']]);

/* ---------- SD ---------- */
addLesson('sd',L('Pricing, item category, dan dokumen koreksi',{p:[
 'Harga di sales order dihitung dengan <b>condition technique</b>: pricing procedure berisi urutan condition type, dan setiap condition type mencari condition record yang cocok (misalnya harga per customer dan material) lewat access sequence. Urutan umumnya: harga dasar, diskon atau surcharge, ongkos angkut, lalu pajak keluaran. Tab Conditions di item menunjukkan angka mana yang ditemukan dan mana yang tidak.',
 '<b>Item category</b> menentukan perilaku item: TAN item standar yang dikirim dan ditagih, TANN item gratis (free goods), TAD item jasa. <b>Schedule line</b> di bawahnya menentukan tanggal dan qty yang dikonfirmasi serta apakah item relevan untuk MRP dan delivery.',
 'Koreksi tagihan tanpa retur barang memakai <b>credit memo request</b> atau <b>debit memo request</b> di VA01 (order type CR dan DR), yang lalu ditagih menjadi credit memo (billing type G2) atau debit memo (L2). Invoice biasa memakai F2, pembatalan billing S1, dan pro forma F5 atau F8.'],
 flow:[['Condition record','VK11'],['Sales order','harga otomatis'],['Cek tab Conditions','harga, diskon, pajak'],['Billing F2','VF01'],['Koreksi','CR/DR → G2/L2']],
 tc:[['VK11 / VK12 / VK13','Membuat / mengubah / menampilkan condition record'],['VA01','Order type OR, RE, CR (credit memo request), DR (debit memo request)'],['VKM1','Rilis dokumen yang kena credit block'],['VF05','Daftar billing document'],['VF31','Output (cetak/kirim) billing document'],['V/LD','Pricing report: daftar condition record yang berlaku']],
 integ:'Setiap condition type punya account key yang menentukan akun pendapatan, diskon, atau pajak di FI. Harga yang benar tetapi condition type yang salah bisa masuk ke akun yang keliru.',
 keys:['Pricing procedure → condition type → condition record','Item category dan schedule line mengatur perilaku item','Koreksi nilai: credit/debit memo request → G2/L2'],
 cp:['Customer ditagih Rp 2 jt terlalu tinggi karena diskon promosi terlewat. Barang tidak dikembalikan. Dokumen yang tepat?',['Credit memo request, lalu credit memo (G2)','Returns order RE dan GR 651','Membatalkan delivery','Mengubah harga di invoice yang sudah diposting'],0,'Koreksi nilai tanpa retur barang memakai credit memo.']}),
 [['Billing type untuk credit memo?',['G2','F2','L2','S1'],0,'G2 credit memo, L2 debit memo, F2 invoice.'],['Di mana kamu melihat rincian harga, diskon, dan pajak sebuah item sales order?',['Tab Conditions','Tab Shipping','Incompletion log','Document flow'],0,'Tab Conditions menampilkan hasil pricing.']]);

/* ---------- PP ---------- */
addLesson('pp',L('Parameter MRP dan strategi perencanaan',{p:[
 'Hasil MRP ditentukan oleh parameter di view MRP material master. <b>MRP type</b>: PD (MRP berdasarkan kebutuhan), VB (reorder point manual), ND (tidak direncanakan). <b>Lot size</b>: EX (sesuai kebutuhan), FX (jumlah tetap), HB (isi sampai stok maksimum). Ditambah safety stock, planned delivery time untuk barang beli, dan in-house production time untuk barang buatan sendiri.',
 '<b>Planning strategy</b> menentukan kapan produksi dimulai. Strategi 10 dan 40 adalah make-to-stock: produksi berdasarkan forecast (PIR), lalu sales order memakai stok yang ada. Strategi 20 adalah make-to-order: produksi baru dimulai setelah ada sales order dan stoknya terikat ke order itu.',
 'Industri proses seperti makanan dan minuman sering memakai <b>process order</b> (PP-PI) dengan master recipe sebagai pengganti production order dan routing. Alur intinya sama: release, GI komponen, konfirmasi, GR barang jadi.'],
 tc:[['MM02 (view MRP 1–4)','MRP type, lot size, safety stock, lead time, strategy group'],['MD07','Stock/requirements list kolektif per MRP controller'],['MD11','Membuat planned order manual'],['CO41','Konversi planned order secara kolektif'],['CO15','Konfirmasi di level order'],['COR1 / COR3','Membuat / menampilkan process order (PP-PI)'],['CM01','Beban kapasitas work center']],
 integ:'Planned delivery time di material master dipakai MRP untuk menghitung tanggal PR. Jika angkanya lebih pendek dari lead time vendor yang sebenarnya, barang selalu terlambat walau MRP berjalan benar.',
 keys:['MRP type PD/VB/ND dan lot size EX/FX/HB','Strategi 10/40 make-to-stock, 20 make-to-order','Process order untuk industri proses'],
 cp:['Biskuit diproduksi berdasarkan forecast bulanan dan sales order dipenuhi dari stok gudang. Ini contoh strategi…',['Make-to-stock (misalnya strategi 10 atau 40)','Make-to-order (strategi 20)','Reorder point VB','Tanpa perencanaan ND'],0,'Produksi berdasarkan forecast untuk stok = make-to-stock.']}),
 [['Lot size yang memesan persis sebesar kebutuhan?',['EX','FX','HB','VB'],0,'EX = lot-for-lot.'],['Evaluasi kolektif hasil MRP Live per MRP controller memakai…',['MD07','MD06','MD61','CO11N'],0,'MRP Live tidak membuat MRP list, jadi dipakai stock/requirements list (MD04/MD07).']]);

/* ---------- QM ---------- */
addBox('qm',0,'Inspection type lain','Selain 01, 04, dan 89: <b>03</b> inspeksi selama produksi (in-process), <b>05</b> GR lainnya, <b>06</b> retur dari customer, <b>08</b> stock transfer, dan <b>09</b> inspeksi berulang untuk batch yang mendekati kedaluwarsa.');
addTc('qm',1,[['QA12 / QA13','Mengubah / menampilkan usage decision'],['QE01','Result recording untuk satu inspection lot'],['QF11','Mencatat defect pada inspection lot'],['QC21','Membuat quality certificate untuk inspection lot']]);

/* ---------- PM ---------- */
addTc('pm',1,[['IW22 / IW23','Mengubah / menampilkan notification'],['IW29','Daftar notification (display)'],['IW42','Konfirmasi keseluruhan: waktu, material, dan aktivitas'],['IW47','Daftar konfirmasi']]);
addBox('pm',1,'Breakdown dan indikator keandalan','Centang <b>Breakdown</b> dan isi waktu mulai serta selesai kerusakan di notification. Dari data itu SAP menghitung <b>MTTR</b> (rata-rata lama perbaikan) dan <b>MTBR</b> (rata-rata waktu antar perbaikan), yang bisa dilihat di MCJB untuk equipment dan MCJC untuk functional location. Tanpa data breakdown yang disiplin, kedua angka ini tidak bermakna.');
addTc('pm',2,[['IP43','Maintenance plan multiple counter'],['IP16','Daftar maintenance plan'],['IK17','Daftar measurement document']]);

/* ---------- PS ---------- */
addLesson('ps',L('Siklus proyek di PS: dari struktur sampai settlement',{p:[
 'Proyek dibuat di Project Builder (CJ20N) dari <b>project definition</b>, lalu dipecah menjadi <b>WBS element</b> sebagai penampung biaya dan budget. Jika jadwal perlu dikelola rinci, di bawah WBS dibuat <b>network</b> dengan <b>activity</b> (pekerjaan, durasi, kebutuhan material atau jasa) dan <b>milestone</b>.',
 'Status mengendalikan apa yang boleh dilakukan: <b>CRTD</b> baru bisa direncanakan, <b>REL</b> boleh menerima biaya (PR, PO, GI, timesheet), <b>TECO</b> pekerjaan selesai dan hanya menerima biaya susulan, <b>CLSD</b> tertutup. PR dengan account assignment P ditolak bila WBS belum REL atau tidak ditandai sebagai account assignment element.',
 'Budget diisi sebagai original budget (CJ30), dirilis (CJ32), dan bisa ditambah lewat supplement (CJ37). <b>Availability control</b> membandingkan budget dengan actual + komitmen: saat mendekati batas muncul warning, dan saat terlampaui posting ditolak. Di akhir periode, biaya WBS di-settle (CJ88) ke AuC, aset, atau cost center sesuai settlement rule.'],
 flow:[['CJ20N','definition, WBS, network'],['CJ30 / CJ32','budget & release'],['REL','status dirilis'],['Eksekusi','PR, PO, GR, GI 221'],['CJI3 / CJI5','actual & komitmen'],['CJ88','settlement'],['TECO → CLSD','penutupan']],
 tc:[['CJ20N','Project Builder: definition, WBS, network, milestone'],['CJ30 / CJ32','Original budget / release budget'],['CJ37','Budget supplement'],['S_ALR_87013558','Laporan budget / actual / commitment / sisa'],['CN41N','Structure overview proyek'],['CN25','Konfirmasi network activity'],['CJ88 / CJ8G','Settlement proyek tunggal / kolektif']],
 integ:'Komitmen di CJI5 lahir dari PR dan PO di MM; actual dari GR, GI 221, SES, invoice, dan timesheet CATS. Settlement CJ88 ke AuC adalah titik temu PS dengan FI-AA.',
 keys:['Definition → WBS → network/activity → milestone','CRTD → REL → TECO → CLSD','Budget + availability control menahan overspending; CJ88 untuk settlement'],
 cp:['PR untuk material proyek ditolak dengan pesan bahwa WBS tidak bisa menerima posting. Penyebab yang paling mungkin?',['WBS masih berstatus CRTD (belum REL) atau bukan account assignment element','Budget cost center habis','Material belum punya view Sales','Vendor belum dipilih'],0,'Hanya WBS yang sudah REL dan bertanda account assignment yang bisa dibebani.']}),
 [['Status proyek yang mengizinkan PR, PO, dan GI dibebankan ke WBS?',['REL','CRTD','CLSD','LKD'],0,'REL = released.'],['Fitur PS yang menolak posting ketika actual + komitmen melampaui budget?',['Availability control','Release strategy','Posting block opname','Credit check'],0,'Availability control.']]);

/* ---------- HCM ---------- */
addBox('hcm',3,'Payroll Indonesia','Country version Indonesia memakai kode <b>34</b>, sehingga payroll dijalankan dengan <code>PC00_M34_CALC</code> dan simulasinya dengan <code>PC00_M34_CALC_SIMU</code>. Data pajak penghasilan karyawan (termasuk status PTKP) disimpan di infotype <b>0241 Tax Indonesia</b>, dan data jaminan sosial di infotype <b>0242</b>. Tarif dan aturan pajak berubah mengikuti regulasi, jadi perhitungannya selalu diverifikasi tim payroll.');

/* ---------- BASIS ---------- */
addTc('basis',1,[['SM04 / AL08','Daftar user yang sedang login (server ini / semua server)'],['SM02','Membuat system message untuk semua user'],['SP01','Spool request (hasil cetak)'],['SU3','User mengatur data default miliknya sendiri']]);

/* ---------- glosarium ---------- */
TERMS['fi-gl'].push(['Posting key','Kode dua digit penentu jenis akun dan debit/kredit, misalnya 40, 50, 31']);
TERMS['co'].push(['Activity type','Jasa cost center (jam mesin, jam kerja) dengan tarif'],['Assessment / distribution','Alokasi biaya antar cost center di akhir periode']);
TERMS['mm-pur'].push(['Info record','Harga dan syarat satu vendor untuk satu material'],['Outline agreement','Contract atau scheduling agreement jangka panjang'],['Source list','Daftar vendor yang boleh/wajib dipakai']);
TERMS['mm-pi'].push(['Cycle counting','Opname bertahap sepanjang tahun sesuai kelas material']);
TERMS['sd'].push(['Condition record','Data harga/diskon yang dicari saat pricing'],['Item category','Penentu perilaku item, misalnya TAN, TANN'],['Credit memo','Dokumen pengurang tagihan customer']);
TERMS['pp'].push(['Planning strategy','Make-to-stock (10, 40) atau make-to-order (20)'],['Lot size','Aturan jumlah pesan/produksi: EX, FX, HB'],['Process order','Order produksi untuk industri proses (PP-PI)']);
TERMS['pm'].push(['MTTR / MTBR','Rata-rata lama perbaikan / waktu antar perbaikan']);
TERMS['ps'].push(['Availability control','Pengecekan budget terhadap actual + komitmen'],['Network & activity','Struktur jadwal pekerjaan di bawah WBS'],['REL / TECO / CLSD','Status proyek: dirilis, selesai teknis, ditutup']);

/* ===================== PENGAYAAN DARI REFERENSI TIM (Nov 2026) =====================
   Referensi: ringkasan T-code produksi/MM, administrasi user, order-to-cash SD, SPRO, dan siklus manajemen aset. */
addLesson('org',L('SPRO: dari mana struktur organisasi berasal',{p:[
 'Company code, plant, storage location, dan kode lain tidak dibuat oleh user harian. Semuanya dikonfigurasi oleh konsultan atau tim IT lewat transaksi <b>SPRO</b>, pintu masuk ke <b>SAP Reference IMG</b> (Implementation Guide). IMG berbentuk pohon: Enterprise Structure, Cross-Application Components, Financial Accounting, Controlling, Materials Management, Sales and Distribution, dan seterusnya.',
 'Struktur organisasi dibuat dalam dua langkah. <b>Definition</b> membuat unitnya: company code, plant, storage location, purchasing organization, sales organization. <b>Assignment</b> menghubungkannya: plant ke company code, purchasing organization ke company code dan plant, sales organization ke company code. <b>Purchasing organization</b> adalah unit yang bernegosiasi dan berkontrak dengan vendor; <b>purchasing group</b> adalah buyer atau tim buyer di dalamnya.',
 'Setiap perubahan konfigurasi direkam dalam <b>customizing transport request</b>: dibuat di DEV, diuji di QAS, lalu di-import ke PRD. SPRO dipakai di S/4HANA on-premise dan private cloud. S/4HANA Cloud Public Edition memakai alat konfigurasi cloud tersendiri, dan jalur menu IMG bisa berbeda antar rilis.'],
 flow:[['SPRO','SAP Reference IMG'],['Definition','buat unit organisasi'],['Assignment','hubungkan antar unit'],['Transport request','rekam perubahan'],['Uji alur','PR → PO → GR → invoice']],
 tc:[['SPRO','Customizing: membuka SAP Reference IMG'],['OX10','Definisi plant (konfigurasi)'],['OX09','Definisi storage location (konfigurasi)'],['OX08','Definisi purchasing organization (konfigurasi)'],['OX18','Assign plant ke company code (konfigurasi)'],['SE10','Transport organizer untuk request konfigurasi']],
 tip:'User harian umumnya tidak punya akses SPRO, apalagi di PRD. Kalau kamu butuh storage location atau purchasing group baru, ajukan change request ke tim IT dengan alasan bisnisnya.',
 keys:['SPRO → SAP Reference IMG = tempat konfigurasi','Definition lalu Assignment','Perubahan lewat transport request: DEV → QAS → PRD'],
 cp:['Proyek baru butuh storage location khusus di Plant 1100. Cara yang benar untuk mendapatkannya?',['Ajukan ke tim IT; dikonfigurasi lewat SPRO di DEV lalu di-transport ke PRD','Buat sendiri di MM01','Pakai storage location lain dan catat manual di Excel','Minta gudang membuatnya di MIGO'],0,'Unit organisasi adalah konfigurasi, bukan master data atau transaksi.']}),
 [['Transaksi pintu masuk ke konfigurasi SAP (Implementation Guide)?',['SPRO','SU01','SE38','MM01'],0,'SPRO membuka SAP Reference IMG.'],['Unit yang bernegosiasi dan berkontrak dengan vendor adalah…',['Purchasing organization','Purchasing group','Storage location','Shipping point'],0,'Purchasing group adalah buyer di dalam purchasing organization.']]);

addLesson('basis',L('Administrasi user: dari SU01 sampai review akses',{p:[
 'Lima istilah dasarnya: <b>user</b> adalah orang atau sistem yang login; <b>role</b> adalah kumpulan menu dan izin untuk satu pekerjaan; <b>authorization</b> adalah izin melakukan aktivitas tertentu pada authorization object; <b>profile</b> adalah bentuk teknis yang dihasilkan saat role di-generate; <b>user group</b> adalah kategori untuk membagi pengelolaan dan pelaporan user.',
 'User dibuat di SU01: isi user ID, lengkapi tab Address (nama, kontak), tab Logon Data (user type, password awal, masa berlaku, user group), lalu tab Roles. <b>User type</b> Dialog dipakai orang yang login interaktif; System, Communication, dan Service dipakai antarmuka dan job. Role sendiri dibuat di PFCG: susun menu, maintain authorizations, generate profile, assign ke user, lalu user comparison.',
 'Akses diberikan lewat role, bukan dengan menempelkan profile langsung ke user. Karyawan yang resign tidak dihapus: user dikunci dan diberi tanggal akhir masa berlaku agar jejak audit tetap ada. Akses ditinjau berkala dengan SUIM, misalnya daftar user per role atau user yang bisa menjalankan transaksi tertentu.'],
 flow:[['SU01','buat user'],['Assign role','mis. Z_SD_DISPLAY'],['PFCG','generate profile'],['Tes akses','SU53 bila gagal'],['SUIM','pantau berkala'],['Kunci user','saat resign']],
 tc:[['SU01 / SU01D','Membuat dan mengelola user / menampilkan user'],['SU10','Mengelola banyak user sekaligus'],['PFCG','Membuat role dan generate profile'],['SU53','Analisis error otorisasi terakhir'],['SU56','Menampilkan authorization buffer user'],['SU02','Profile otorisasi manual (cara lama)'],['SUIM','User information system: laporan user, role, otorisasi']],
 integ:'Tabel yang sering diminta auditor: <b>USR02</b> (data logon: status kunci, login terakhir), <b>AGR_USERS</b> (role per user), <b>AGR_1251</b> (nilai otorisasi dalam role), <b>AGR_TCODES</b> (T-code dalam role), dan <b>UST04</b> (profile per user). Tabel dibaca lewat SE16N dengan akses terbatas.',
 keys:['User → role → profile; akses diberi lewat role','SU01: Address, Logon Data, Roles','User resign dikunci dan diberi tanggal akhir, bukan dihapus'],
 cp:['Seorang staff resign hari ini. Tindakan yang tepat pada user SAP-nya?',['Kunci user dan isi tanggal akhir masa berlaku di SU01','Hapus user supaya lisensi kembali','Biarkan aktif untuk dipakai penggantinya','Ganti nama user menjadi nama pengganti'],0,'User tidak dihapus dan tidak diwariskan; setiap posting harus bisa ditelusuri ke satu orang.']}),
 [['Tabel yang menyimpan penugasan role ke user?',['AGR_USERS','AGR_TCODES','MARA','EKKO'],0,'AGR_USERS.'],['User type untuk orang yang login interaktif lewat SAP GUI?',['Dialog','System','Communication','Reference'],0,'Dialog.']]);

addLesson('pm',L('Siklus manajemen aset: taksonomi, strategi, dan suku cadang',{p:[
 'Manajemen aset dimulai dari <b>taksonomi</b>: functional location disusun berlapis (plant, area, line, unit) sehingga setiap mesin punya alamat teknis. Banyak perusahaan mengikuti ISO 14224 untuk menyusun hierarki dan data kegagalan. Setelah itu dibuat <b>work center</b> PM, yaitu regu pelaksana (mekanik, listrik) dengan kapasitas dan cost center, lalu <b>equipment</b> yang dipasang di functional location dan ditautkan ke work center.',
 '<b>Strategi perawatan</b> ditentukan per mesin: berbasis waktu, berbasis pemakaian (counter jam operasi), atau berbasis kondisi. Dasarnya bisa rekomendasi pabrikan, analisis keandalan (RCM), atau rutinitas inspeksi prediktif. Strategi itu dituangkan ke maintenance plan yang dijadwalkan, dan order terbentuk otomatis sesuai jadwal atau dibuat manual saat ada kerusakan.',
 '<b>Suku cadang</b> dikelola sebagai material (umumnya material type ERSA) dengan parameter stok minimum, maksimum, dan reorder point di view MRP. Daftar suku cadang per mesin disimpan di <b>equipment BOM</b>, sehingga planner bisa memilih komponen langsung saat menyusun order. Kebutuhan beli menjadi PR, lalu mengikuti alur approval, PO, dan GR seperti pembelian lain. Saat mesin dipensiunkan, equipment dinonaktifkan dan asetnya di-retire lewat FI-AA.'],
 flow:[['IL01','functional location'],['IR01','work center'],['IE01','equipment'],['IP01 → IP10','plan & jadwal'],['MM01 / IB01','suku cadang & BOM'],['IW31 / IW32','order'],['Retire','IE02 + FI-AA']],
 tc:[['IL01 / IL02 / IL03','Membuat / mengubah / menampilkan functional location'],['IR01 / IR03','Membuat / menampilkan work center PM'],['IE01 / IE02','Membuat / mengubah equipment'],['IB01','Membuat equipment BOM (daftar suku cadang mesin)'],['IP01','Membuat maintenance plan'],['IP10','Menjadwalkan maintenance plan'],['ME53N / ME55','Menampilkan PR suku cadang / release kolektif'],['IW31 / IW32','Membuat / mengubah order']],
 integ:'Parameter stok suku cadang dipakai MRP untuk membuat PR otomatis. Reservasi dari order PM ikut dihitung sebagai kebutuhan, jadi order yang direncanakan lebih awal memberi waktu bagi pembelian.',
 keys:['Functional location → work center → equipment','Strategi: waktu, pemakaian, atau kondisi','Suku cadang: material ERSA + min/max + equipment BOM'],
 cp:['Planner ingin langsung melihat daftar suku cadang sebuah conveyor saat menyusun order perbaikan. Data apa yang harus disiapkan?',['Equipment BOM untuk conveyor tersebut (IB01)','Maintenance plan IP10','Measuring point IK01','Inspection plan QP01'],0,'Equipment BOM menautkan suku cadang ke mesin.']}),
 [['Regu pelaksana perawatan dengan kapasitas dan cost center dicatat sebagai…',['Work center (IR01)','Functional location','Maintenance plan','Notification'],0,'Work center PM dibuat di IR01.'],['Daftar suku cadang per mesin disimpan di…',['Equipment BOM','Task list','Measuring point','Source list'],0,'Equipment BOM (IB01).']]);

/* tambahan baris dan catatan */
addBox('mm-pur',0,'MM dari sudut pandang produksi','Alur lengkapnya tidak berhenti di pembayaran: kebutuhan → PR → PO → GR → inspeksi atau stok → GI → pemakaian produksi. MM bukan hanya modul pembelian; ia memberi visibilitas atas ketersediaan, persediaan, dan pemakaian material. Material yang tepat, jumlah yang tepat, dan waktu yang tepat membuat produksi tidak terhenti. Integrasinya dengan PP terlihat di dua titik: MRP membuat PR dari kebutuhan produksi, dan komponen dikeluarkan ke production order dengan GI 261.');
addTc('mm-pur',8,[['ME42 / ME43','Mengubah / menampilkan RFQ'],['ME22N','Mengubah PO']]);
addBox('mm-im',3,'T-code lama dan return delivery','Di ECC ada transaksi terpisah untuk tiap pergerakan: MB01 (GR terhadap PO), MB1A (goods issue), MB1B (transfer posting), MB1C (GR lainnya), MBST (pembatalan), dan MBRL (return delivery per dokumen material). Di S/4HANA semuanya dikerjakan di MIGO. Mengembalikan barang ke vendor memakai Action <b>A02 Return Delivery</b> + Reference <b>R02 Material Document</b>, yang memposting movement 122.',true);
addTc('pp',3,[['MD01','MRP klasik untuk satu plant (masih tersedia di S/4HANA)'],['MF50','Planning table untuk repetitive manufacturing'],['MFBF','Konfirmasi backflush repetitive manufacturing']]);
addTc('le',0,[['VL10B','Membuat delivery untuk purchase order (stock transport order) yang jatuh tempo']]);
addBox('sd',4,'Output dan account determination','<b>Output determination</b> membuat dokumen bisnis secara otomatis, misalnya konfirmasi order, surat jalan, dan invoice. Di ECC aturannya memakai condition technique (NACE); di S/4HANA banyak yang beralih ke output management berbasis BRFplus. <b>Account determination</b> (VKOA) menentukan akun pendapatan dari kombinasi sales organization, kelompok akun customer dan material, serta account key di pricing, sehingga billing terposting ke akun yang benar tanpa dipilih manual.');

TERMS['org'].push(['Purchasing organization','Unit yang bernegosiasi dan berkontrak dengan vendor'],['SPRO / IMG','Transaksi dan panduan konfigurasi SAP']);
TERMS['basis'].push(['User type','Dialog untuk orang; System, Communication, Service untuk antarmuka'],['User group','Kategori pengelolaan user']);
TERMS['pm'].push(['Equipment BOM','Daftar suku cadang sebuah mesin'],['Work center (PM)','Regu pelaksana perawatan']);

/* ===================== STUDI KASUS ROLE (lintas modul) ===================== */
// [roleId, judul, skenario, [[pertanyaan, [benar, fb], [salah, fb], [salah, fb]], ...]]
const ROLECASE_SRC=[
['wh','Akhir bulan di Gudang FG','Tanggal 30, gudang FG penuh. Ada 40 delivery yang harus keluar hari ini, 3 truk bahan baku datang, dan cycle count rak 001 menunjukkan selisih 12 karton.',[
 ['Delivery mana yang diproses dulu?',['Delivery dengan tanggal kirim hari ini, dibuat kolektif dengan VL10 lalu picking FIFO','Tepat. Prioritas tanggal kirim dan proses kolektif.'],['Delivery dengan nilai terbesar saja','Customer lain akan terlambat.'],['Tunggu bahan baku selesai diterima','Pengiriman tertunda tanpa alasan.']],
 ['Truk bahan baku datang saat staf sibuk picking. Langkah aman?',['GR di MIGO dengan qty sesuai surat jalan, putaway dikonfirmasi setelah barang di rak','Tepat. Stok sistem dan fisik tetap sinkron.'],['Turunkan barang, GR besok','Stok tidak tercatat, MRP salah.'],['GR dulu sesuai PO walau qty berbeda','GR harus sesuai fisik.']],
 ['Selisih cycle count 12 karton. Sebelum posting selisih?',['Cek TO yang belum dikonfirmasi dan riwayat MB51, lalu recount','Tepat. Selisih sering karena TO belum dikonfirmasi.'],['Langsung posting selisih','Belum diinvestigasi.'],['Abaikan karena kecil','Selisih harus dijelaskan.']]]],
['inv','Stok tinggi tapi line berhenti','Nilai persediaan naik 18% dalam 3 bulan, tapi produksi berhenti karena kemasan habis. Direktur minta analisis.',[
 ['Analisis pertama?',['Kelompokkan stok per material dan umur (slow moving, kedaluwarsa) dari MB52/MC.9','Tepat. Cari stok yang menumpuk.'],['Potong semua PO','Bisa memperparah kekurangan.'],['Tambah gudang','Tidak menyelesaikan masalah.']],
 ['Kemasan habis padahal ada PO. Cek?',['MD04 untuk melihat tanggal PO vs kebutuhan dan exception','Tepat.'],['FBL1N','Itu hutang vendor.'],['VA05','Itu sales order.']],
 ['Ditemukan 2 batch biskuit mendekati kedaluwarsa. Tindakan?',['Prioritaskan keluar (FEFO), koordinasi sales untuk promosi','Tepat.'],['Biarkan sampai kedaluwarsa','Kerugian penuh.'],['Pindah ke sloc lain','Tidak mengubah umur.']]]],
['proc','Bahan baku naik, vendor telat','Harga gula naik 12%, vendor utama telat 5 hari, dan Finance mengeluh 9 invoice blocked bulan ini.',[
 ['Vendor utama telat. Tindakan?',['Follow up PO lewat ME2N WE101, cari alternatif vendor untuk kebutuhan mendesak','Tepat.'],['Batalkan semua PO','Pasokan berhenti.'],['Tunggu saja','Produksi berisiko.']],
 ['Untuk kontrak gula 6 bulan ke depan?',['Sourcing event kompetitif (RFQ) lalu kontrak','Tepat.'],['Tunjuk langsung vendor termurah tahun lalu','Harga sudah berubah.'],['Beli harian di pasar','Tidak terkontrol.']],
 ['9 invoice blocked. Penyebab yang paling sering?',['Harga PO tidak diupdate atau GR belum lengkap','Tepat. Cek PO history dan harga PO.'],['Finance salah input semua','Biasanya akar ada di PO/GR.'],['Vendor salah semua','Perlu dicek dulu.']]]],
['log','Pengiriman Lebaran','Volume kirim naik 2 kali menjelang Lebaran. Truk terbatas dan biaya angkut naik.',[
 ['Cara mengoptimalkan truk?',['Gabungkan delivery per rute dalam shipment (VT01N)','Tepat.'],['Satu truk per order','Mahal.'],['Kirim setelah Lebaran','Customer kehabisan stok.']],
 ['Biaya angkut harus dialokasikan.',['Shipment cost (VI01) diteruskan ke FI','Tepat.'],['Dicatat di Excel saja','Tidak masuk laporan biaya.'],['Dibebankan ke customer tanpa kontrak','Tidak sesuai kontrak.']],
 ['Ada 15 delivery belum PGI sore hari.',['Cek VL06O, pastikan picking selesai lalu PGI','Tepat.'],['Billing dulu','Billing setelah PGI.'],['Hapus delivery','Order tidak terkirim.']]]],
['sales','Order besar dari key account','Key account memesan 3.000 karton dengan diskon khusus, kirim ke 3 DC, minta tiba dalam 5 hari.',[
 ['Sebelum janji tanggal kirim?',['Cek ketersediaan (ATP) dan status kredit customer','Tepat.'],['Langsung janji 5 hari','Bisa tidak terpenuhi.'],['Tanya gudang lewat chat saja','Tidak terdokumentasi.']],
 ['Order masuk credit block.',['Koordinasi dengan credit analyst untuk keputusan rilis','Tepat.'],['Ubah limit sendiri','Melanggar kontrol.'],['Buat order baru','Akan terblok juga.']],
 ['Diskon khusus harus dipakai.',['Gunakan condition record diskon yang disetujui','Tepat.'],['Ubah harga manual tiap order','Rawan salah dan audit.'],['Tulis di teks order','Tidak dihitung.']]]],
['ppc','Mesin rusak di tengah minggu','Mesin oven Line 2 rusak 2 hari. Order produksi 6.000 karton minggu ini terancam.',[
 ['Langkah pertama planner?',['Koordinasi PM untuk estimasi perbaikan, lalu jadwalkan ulang order dan cek kapasitas line lain','Tepat.'],['Biarkan jadwal','Rencana tidak realistis.'],['Batalkan semua order','Berlebihan.']],
 ['Bahan baku untuk order yang mundur?',['Cek MD04 agar PO bisa ditunda/dimajukan sesuai jadwal baru','Tepat.'],['Biarkan datang','Stok menumpuk.'],['Batalkan PO','Bisa kekurangan nanti.']],
 ['Order yang sudah dimulai harus dihentikan sebagian.',['Konfirmasi qty aktual, sisanya dijadwal ulang','Tepat.'],['TECO tanpa konfirmasi','Biaya dan stok salah.'],['Hapus order','Riwayat hilang.']]]],
['qc','Keluhan customer: biskuit melempem','Customer modern trade mengeluhkan 50 karton biskuit melempem dari batch B2611.',[
 ['Dokumen pertama?',['Quality notification Q1 dengan batch B2611','Tepat.'],['Q2','Itu ke vendor.'],['Email saja','Tidak terdokumentasi.']],
 ['Telusuri bahan yang dipakai batch tersebut.',['Batch where-used / traceability','Tepat.'],['MB52','Hanya stok sekarang.'],['ME2N','Daftar PO.']],
 ['Ternyata kemasan dari vendor X bocor.',['Q2 ke vendor dan perketat inspeksi GR kemasan','Tepat.'],['Ganti vendor tanpa data','Perlu bukti.'],['Tidak ada tindakan','Masalah berulang.']]]],
['mp','Breakdown berulang','Conveyor Line 3 breakdown 4 kali bulan ini karena bearing.',[
 ['Data untuk analisis?',['Riwayat notifikasi & order di IW38/IW28 untuk equipment itu','Tepat.'],['MB52','Hanya stok.'],['F110','Tidak terkait.']],
 ['Pencegahan?',['Tambah maintenance plan pelumasan/ganti bearing berkala','Tepat.'],['Tunggu rusak lagi','Reaktif.'],['Beli conveyor baru langsung','Belum dianalisis.']],
 ['Bearing sering kosong saat dibutuhkan.',['Koordinasi safety stock/reorder point dengan inventory','Tepat.'],['Simpan di laci teknisi','Stok tak tercatat.'],['Beli tiap ada kerusakan','Lambat.']]]],
['proj','Proyek renovasi mendekati over budget','Renovasi Mixing: budget 1,2 M, actual 900 jt, komitmen 260 jt. Supervisor minta PR tambahan 80 jt.',[
 ['Sisa budget bebas?',['Rp 40 jt, PR 80 jt melebihi','Tepat. 1.200 − 900 − 260 = 40.'],['Rp 300 jt','Komitmen belum dikurangi.'],['Rp 120 jt','Salah hitung.']],
 ['Tindakanmu?',['Eskalasi ke supervisor/pemilik budget sebelum PR dibuat','Tepat.'],['Buat PR saja','Over budget.'],['Pecah PR jadi kecil','Menghindari kontrol.']],
 ['Ditemukan biaya proyek masuk cost center produksi.',['Telusuri KSB1 dan minta koreksi posting ke WBS','Tepat.'],['Biarkan','Biaya proyek tidak lengkap.'],['Catat di Excel','SAP tetap salah.']]]],
['scp','Siklus S&OP bulan ini','Forecast biskuit bias +15% tiga bulan berturut-turut; kapasitas produksi terbatas.',[
 ['Tindakan untuk forecast?',['Review model statistik dan input sales di demand review','Tepat.'],['Biarkan','Stok berlebih.'],['Turunkan semua 15% tanpa analisis','Bisa salah untuk SKU lain.']],
 ['Demand melebihi kapasitas.',['Supply review: skenario lembur, outsourcing, atau prioritas SKU','Tepat.'],['Abaikan kapasitas','Rencana tidak realistis.'],['Tolak semua order baru','Kehilangan penjualan.']],
 ['Rencana disetujui di executive S&OP.',['Kirim PIR ke S/4 untuk MRP','Tepat.'],['Email rencana ke gudang','Tidak terintegrasi.'],['Simpan di Excel','Tidak dieksekusi.']]]],
['svc','Kontrak servis yang terlupa','Customer mengklaim kunjungan servis kuartal ini gratis sesuai kontrak, teknisi sudah menagih.',[
 ['Cek?',['Service contract (VA43) dan cakupan equipment','Tepat.'],['Saldo bank','Tidak terkait.'],['MB52','Tidak terkait.']],
 ['Kontrak memang mencakup kunjungan ini.',['Batalkan tagihan dan koreksi billing','Tepat.'],['Tetap tagih','Melanggar kontrak.'],['Diskon 50%','Tetap salah.']],
 ['Agar tidak terulang?',['Pastikan service order terhubung ke kontrak sehingga billing otomatis benar','Tepat.'],['Ingatkan teknisi lisan','Tidak sistemik.'],['Hapus kontrak','Salah.']]]],
['fin','Tutup buku Oktober','Hari kerja ke-2 bulan November. GR/IR besar, beberapa accrual belum dibuat, dan aset baru belum disusutkan.',[
 ['Urutan yang benar?',['Cut-off → accrual → depresiasi → revaluasi → settlement → tutup periode','Tepat.'],['Tutup periode dulu','Posting tertunda tidak bisa masuk.'],['Laporan dulu baru accrual','Angka belum lengkap.']],
 ['Aset baru belum disusutkan.',['Pastikan kapitalisasi lalu jalankan AFAB','Tepat.'],['Jurnal manual penyusutan','Sub-ledger aset tidak sinkron.'],['Tunda ke tahun depan','Laporan salah.']],
 ['Saldo GR/IR besar dan lama.',['Analisis per PO: GR tanpa invoice atau invoice tanpa GR, koordinasi dengan purchasing','Tepat.'],['Hapus saldo','Tidak boleh tanpa analisis.'],['Biarkan','Laporan menyesatkan.']]]],
['apar','Minggu sibuk AP/AR','Hari ini: payment run mingguan, 3 customer membayar tanpa referensi, satu vendor minta ganti rekening.',[
 ['Sebelum payment run F110?',['Review proposal: invoice blocked, vendor bermasalah, nilai besar','Tepat.'],['Langsung run','Tanpa kontrol.'],['Bayar semua manual','Tidak efisien.']],
 ['Pembayaran tanpa referensi.',['Cocokkan dengan open item FBL5N dan konfirmasi ke customer','Tepat.'],['Taruh di akun selisih','Unapplied cash menumpuk.'],['Kembalikan uang','Tidak perlu.']],
 ['Vendor minta ganti rekening.',['Verifikasi lewat kontak resmi dan dual control','Tepat.'],['Ganti langsung','Risiko fraud.'],['Tolak tanpa cek','Pembayaran bisa gagal.']]]],
['ctrl','Margin turun','Margin kotor biskuit turun 4 poin. CFO minta penjelasan dalam 2 hari.',[
 ['Analisis pertama?',['Bandingkan standard cost vs actual dan variance production order (KKS2)','Tepat.'],['Potong biaya marketing','Belum tahu penyebab.'],['Ubah harga jual','Prematur.']],
 ['Variance terbesar di bahan gula.',['Cek harga beli dan pemakaian vs BOM','Tepat.'],['Ubah standard tanpa analisis','Menutupi masalah.'],['Abaikan','Margin terus turun.']],
 ['Ditemukan biaya utilitas salah alokasi.',['Perbaiki assessment cycle cost center','Tepat.'],['Jurnal manual tiap bulan','Tidak berkelanjutan.'],['Biarkan','Laporan salah.']]]],
['treas','Kas menipis','Forecast menunjukkan kas negatif dalam 3 minggu karena piutang besar belum masuk.',[
 ['Data forecast?',['FF7B liquidity forecast dari AP, AR, PO, SO','Tepat.'],['MB52','Tidak terkait.'],['Saldo hari ini saja','Tidak cukup.']],
 ['Piutang besar overdue.',['Koordinasi collections: worklist & promise to pay','Tepat.'],['Tunggu','Kas makin tipis.'],['Write-off','Belum perlu.']],
 ['Customer berisiko memesan lagi.',['Tinjau credit limit dan risk class','Tepat.'],['Naikkan limit','Risiko naik.'],['Abaikan','Exposure bertambah.']]]],
['hr','Payroll bulan ini','Ada 12 karyawan baru, 3 promosi, dan perubahan tarif BPJS bulan ini.',[
 ['Urutan aman?',['Lengkapi personnel action & infotype → release → simulasi → run → exit','Tepat.'],['Run langsung','Data belum lengkap.'],['Exit dulu','Periode tertutup.']],
 ['Promosi berlaku tanggal 15.',['Copy 0008/0001 dengan tanggal mulai 15','Tepat.'],['Change record lama','Riwayat hilang.'],['Bayar manual','Tidak tercatat.']],
 ['Setelah payroll selesai?',['Posting ke FI dan file transfer bank','Tepat.'],['Hanya cetak slip','Gaji tidak dibayar.'],['Hapus hasil','Salah.']]]],
['abap','Laporan stok lambat','Laporan custom stok berjalan 25 menit dan sering dump di akhir bulan.',[
 ['Langkah pertama?',['Cek ST22 untuk dump dan analisis performa (SQL trace/ATC)','Tepat.'],['Tambah server','Belum tahu penyebab.'],['Hapus laporan','User butuh.']],
 ['Ditemukan SELECT di dalam LOOP.',['Ambil data sekaligus (JOIN/FOR ALL ENTRIES) atau CDS','Tepat.'],['Biarkan','Tetap lambat.'],['Pindah ke background tanpa perbaikan','Masalah tetap.']],
 ['User minta versi Fiori.',['Fiori elements dari CDS view','Tepat.'],['Screenshot laporan','Tidak interaktif.'],['SAPscript','Untuk form cetak.']]]],
['basis','Pagi yang kacau','Pagi ini: 5 job gagal, user tidak bisa login, dan ada request transport darurat.',[
 ['Prioritas pertama?',['Masalah login (dampak luas): cek SM21, lock user, sistem','Tepat.'],['Transport darurat','Bisa menunggu.'],['Job laporan','Dampak lebih kecil.']],
 ['Job gagal.',['Cek SM37 log, perbaiki penyebab, jadwalkan ulang','Tepat.'],['Hapus job','Laporan hilang.'],['Abaikan','Data basi.']],
 ['Transport darurat ke PRD.',['Pastikan diuji di QAS dan disetujui sebelum import','Tepat.'],['Import langsung','Risiko.'],['Ubah manual di PRD','Melanggar kontrol.']]]],
['sec','Audit akses tahunan','Auditor menemukan 4 user dengan kombinasi PO + GR dan 2 user SAP_ALL di PRD.',[
 ['Laporan untuk bukti?',['SUIM dan Access Risk Analysis','Tepat.'],['MB52','Tidak terkait.'],['SM37','Tidak terkait.']],
 ['User SAP_ALL.',['Cabut, ganti dengan role sesuai tugas / firefighter','Tepat.'],['Biarkan','Temuan audit.'],['Ganti password','Tidak mengurangi akses.']],
 ['Konflik PO + GR karena kekurangan staf.',['Mitigasi: review berkala dan approval kompensasi','Tepat.'],['Abaikan','Risiko fraud.'],['Hapus semua akses','Operasional berhenti.']]]],
['bi','Angka tidak cocok','Dashboard penjualan menunjukkan 5% lebih tinggi daripada laporan Finance.',[
 ['Langkah pertama?',['Rekonsiliasi definisi KPI dan sumber (billing vs order)','Tepat.'],['Ubah dashboard agar sama','Menutupi masalah.'],['Abaikan','Kepercayaan hilang.']],
 ['Ternyata ada load delta yang dobel.',['Perbaiki request/DTP dan reload data','Tepat.'],['Biarkan','Angka salah.'],['Hapus semua data','Berlebihan.']],
 ['Agar tidak terulang?',['Monitoring process chain dan cek rekonsiliasi otomatis','Tepat.'],['Cek manual setahun sekali','Terlambat.'],['Tidak perlu','Bisa terulang.']]]]
];
const ROLECASES=ROLECASE_SRC.map(([rid,title,scene,steps])=>({id:'r-'+rid,role:rid,kind:'role',title,tag:'Role',scene,
  steps:steps.map(([q,...o])=>({q:q||'Tindakan yang tepat?',o:shuffle(o.map((x,i)=>[x[0],i===0?1:0,x[1]]))}))}));
/* ===================== SIMULATOR DATA ===================== */
const TODAY='04.11.2026';
const KNOWN={ME51N:'Create Purchase Requisition',ME52N:'Change Purchase Requisition',ME53N:'Display Purchase Requisition',ME5A:'List Display of Purchase Requisitions',ME21N:'Create Purchase Order',ME22N:'Change Purchase Order',ME23N:'Display Purchase Order',ME2N:'Purchasing Documents per Document Number',ME2L:'Purchasing Documents per Vendor',ME2M:'Purchasing Documents per Material',MIGO:'Goods Movement',ML81N:'Service Entry Sheet',MIRO:'Enter Incoming Invoice',MB52:'Display Warehouse Stocks of Material',MMBE:'Stock Overview',MB51:'Material Document List',MB03:'Display Material Document',MM03:'Display Material',MI01:'Create Physical Inventory Document',MI21:'Print Physical Inventory Document',MI04:'Enter Inventory Count',MI11:'Recount',MI20:'List of Inventory Differences',MI07:'Post Inventory Difference',AS03:'Display Asset',AW01N:'Asset Explorer',AR01:'Asset Balances',AIAB:'AuC Distribution Rule',AIBU:'AuC Settlement',CJ20N:'Project Builder',CJI3:'Display Project Actual Cost Line Items',CJI5:'Display Project Commitment Line Items',KSB1:'Display Actual Cost Line Items for Cost Centers',KOB1:'Display Actual Cost Line Items for Orders',IE03:'Display Equipment',IW33:'Display PM Order',IW38:'Change PM Orders: Selection',ME54N:'Release Purchase Requisition',XK03:'Display Vendor',KS03:'Display Cost Center',CJ13:'Display WBS Element',KO03:'Display Internal Order'};
const MAT={
'300012457':{d:'BEARING SKF 6205-2RS',u:'PC',mg:'4105',p:185000,pg:'P03'},
'300012458':{d:'BEARING SKF 6206-2RS',u:'PC',mg:'4105',p:210000,pg:'P03'},
'300019920':{d:'V-BELT B-52',u:'PC',mg:'4110',p:95000,pg:'P03'},
'300015577':{d:'COUPLING MOTOR FCL-140',u:'PC',mg:'4120',p:750000,pg:'P03'},
'300022105':{d:'KABEL NYY 4X16',u:'M',mg:'4200',p:550000,pg:'P05'},
'300031150':{d:'ROLLER CONVEYOR D89X500',u:'PC',mg:'4130',p:450000,pg:'P03'},
'300045001':{d:'BELT CONVEYOR EP400',u:'PC',mg:'4130',p:148000000,pg:'P05'},
'300040220':{d:'MOTOR GEARBOX 3KW',u:'PC',mg:'4140',p:49250000,pg:'P05'}
};
const F4={
knttp:[['K','Cost center'],['P','Project (WBS element)'],['F','Order'],['A','Asset']],
matnr:Object.entries(MAT).map(([k,v])=>[k,v.d]),
werks:[['1100','Pabrik Cikarang'],['1200','Pabrik Surabaya']],
lgort:[['1101','Gudang Sparepart'],['1102','Gudang Proyek'],['1103','Gudang Bahan Baku']],
ekgrp:[['P01','Bahan baku'],['P03','MRO / sparepart'],['P05','Project & Engineering']],
posid:[['P-26-014','Instalasi Conveyor Line 3'],['P-26-014.01','Engineering & desain'],['P-26-014.02','Material mekanikal'],['P-26-014.03','Jasa instalasi'],['P-26-014.04','Elektrikal & commissioning'],['P-26-009.02','Renovasi Mixing – sipil']],
bwart:[['101','GR goods receipt'],['102','GR reversal'],['201','GI for cost center'],['221','GI for project'],['261','GI for order'],['311','TF trfr within plant'],['343','TF blocked to unrestr.'],['344','TF unrestr. to blocked'],['551','GI scrapping'],['555','GI scrapping from blocked'],['701','GR phys. inventory: surplus (MI07)'],['702','GI phys. inventory: shortage (MI07)']],
grund:[['0001','Rusak / cacat'],['0002','Kedaluwarsa'],['0003','Hilang'],['0004','Salah hitung'],['0005','Obsolete']],
rsnum:[['0000001950','V-BELT B-52 · 11PRD310'],['0000001951','BEARING SKF 6205-2RS · 11PRD300']],
elikz:[['1','Set automatically'],['2','Set'],['3','Do not set']],
selpa:[['WE101','Open goods receipt'],['WE103','Open GR, delivery date reached'],['','(kosong) tanpa filter status']],
pspid:[['P-26-014','Instalasi Conveyor Line 3'],['P-26-009','Renovasi Ruang Mixing']],
bukrs:[['1000','PT JACIWEY Indonesia']],
dbprof:[['000000000001','Standard (all fields)'],['000000000012','Cost and commitment']],
ebeln:[['4500021873','PT Mitra Teknik Abadi'],['4500021880','CV Sinar Elektrik'],['4500021902','PT Duta Konveyor'],['4500021915','PT Duta Konveyor (jasa commissioning)']],
anln1:[['4000012','Mesin Filling Line 2 (AuC)'],['4000009','Renovasi Mixing (AuC)'],['1200345','Conveyor Line 1']],
kostl:[['11PRD300','Produksi Line 1'],['11PRD310','Produksi Line 3'],['11PRD320','Produksi Line 2'],['11ENG100','Engineering']],
equnr:[['10004521','Conveyor Line 3'],['10004388','Filling Machine Line 2'],['10003990','Mixer 2000L']],
mblnr:[['4900061498','03.11.2026 · 201 · ROLLER CONVEYOR'],['4900061210','21.10.2026 · 221 · ROLLER CONVEYOR'],['5000187001','28.10.2026 · 101 · ROLLER CONVEYOR']]
};
const ACT=[['A01','Goods Receipt'],['A07','Goods Issue'],['A08','Transfer Posting'],['A03','Cancellation'],['A04','Display']];
const REF=[['R01','Purchase Order'],['R02','Material Document'],['R09','Reservation'],['R10','Other']];
const FAVS=['ME51N','ME53N','ME54N','ME55','ME21N','ME5A','ME23N','ME2N','ML81N','MIGO','MB21','MB52','MMBE','MB51','MM03','MI01','MI04','MI20','CJI3','CJI5','KSB1','AS03','AW01N','IW38'];
const TREE=[
{l:'Logistics',c:[{l:'Materials Management',c:[
  {l:'Purchasing',c:[
    {l:'Purchase Requisition',c:[['ME51N','Create'],['ME53N','Display'],{l:'List Displays',c:[['ME5A','General']]}]},
    {l:'Purchase Order',c:[['ME21N','Create Vendor/Supplying Plant Known'],['ME23N','Display'],{l:'List Displays',c:[['ME2N','By PO Number'],['ME2L','By Vendor'],['ME2M','By Material']]}]},{l:'Service Entry Sheet',c:[['ML81N','Maintain']]}]},
  {l:'Inventory Management',c:[{l:'Goods Movement',c:[['MIGO','Goods Movement (MIGO)']]},{l:'Environment',c:[{l:'Stock',c:[['MMBE','Stock Overview'],['MB52','Warehouse Stocks']]},{l:'List Displays',c:[['MB51','Material Documents']]}]}]},
  {l:'Physical Inventory',c:[{l:'Physical Inventory Document',c:[['MI01','Create']]},{l:'Inventory Count',c:[['MI04','Enter']]},{l:'Difference',c:[['MI07','Post']]},{l:'Environment',c:[['MI20','Difference List']]}]},
  {l:'Material Master',c:[{l:'Material',c:[['MM03','Display Current']]}]}]},
  {l:'Plant Maintenance',c:[{l:'Maintenance Processing',c:[{l:'Order',c:[{l:'List Editing',c:[['IW38','Change']]}]}]}]}]},
{l:'Accounting',c:[
  {l:'Financial Accounting',c:[{l:'Fixed Assets',c:[{l:'Asset',c:[['AS03','Display']]},['AW01N','Asset Explorer']]}]},
  {l:'Controlling',c:[{l:'Cost Center Accounting',c:[{l:'Information System',c:[{l:'Line Items',c:[['KSB1','Actuals']]}]}]}]},
  {l:'Project System',c:[{l:'Project',c:[['CJ20N','Project Builder']]},{l:'Information System',c:[{l:'Financials',c:[{l:'Line Items',c:[['CJI3','Actual Costs/Revenues'],['CJI5','Commitments']]}]}]}]}]}
];

/* ---------- helpers for scenario definitions ---------- */
function dParse(s){const m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s||'').trim());if(!m)return null;const d=new Date(+m[3],+m[2]-1,+m[1]);return d.getDate()==+m[1]&&d.getMonth()==+m[2]-1?d:null;}
const DATE_FUT={fn:v=>{const d=dParse(v);if(!d)return {sap:'Enter date in format DD.MM.YYYY',idn:'Format tanggal SAP adalah DD.MM.YYYY, contoh 12.11.2026.'};if(d<dParse(TODAY))return {sap:'Delivery date is in the past',idn:'Tanggal butuh tidak boleh sebelum hari ini.'};return null;}};
const matFill=(pre,v)=>{const M=MAT[norm(v[pre+'mat'])];return M?{[pre+'txt']:M.d,[pre+'un']:M.u,[pre+'mg']:M.mg,[pre+'price']:M.p.toLocaleString('id-ID')}:null;};
const NEED_ENTER=(what)=>({fn:v=>v?null:{sap:'Press Enter to adopt the data',idn:`Kamu belum menekan Enter. Tekan Enter setelah mengisi ${what} supaya SAP memuat data pendukungnya.`}});

/* ---------- MIGO screen builder ---------- */
function migoTitle(v){return ({A01:'Goods Receipt',A07:'Goods Issue',A08:'Transfer Posting',A03:'Cancellation',A04:'Display'}[v.act]||'Goods Movement')+' '+({R01:'Purchase Order',R02:'Material Document',R09:'Reservation',R10:'Other'}[v.ref]||'');}
function migoDefault(v){
  const k=v.act+'|'+v.ref; const map={'A01|R01':'101','A07|R10':'201','A08|R10':'311','A03|R02':'','A07|R09':''};
  v.bwart=map[k]??v.bwart;
  ['it.0.mat','it.0.txt','it.0.qty','it.0.un','it.0.lgort','it.0.werks','it.0.poqty','it.0.po','it.0.vendor','it.0.stock','it.0.wbs','it.0.ok','it.0.umlgo','it.0.wbs_po','_acctP','_stockSel','it.0.insmk','it.0.wempf','it.0.grund','it.0.kostl','it.0.elikz','rsnum'].forEach(f=>delete v[f]);
}
function migoScreen(o){
  return {title:migoTitle,go:'save',checkOk:'Document is O.K.',saveLabel:'Post',
  def:Object.assign({act:'A01',ref:'R01',bwart:'101',bldat:TODAY,budat:TODAY},o.def||{}),
  blocks:[
    {t:'bar',fields:[{id:'act',t:'sel',opts:ACT,redraw:1,onChange:migoDefault,l:'Action'},{id:'ref',t:'sel',opts:REF,redraw:1,onChange:migoDefault,l:'Reference'},{id:'po',l:'Purchase Order',w:12,f4:'ebeln',ph:'Purchase Order',show:v=>v.ref==='R01'},{id:'mblnr',l:'Material Document',w:12,ph:'Material Doc.',f4:'mblnr',show:v=>v.ref==='R02'},{id:'rsnum',l:'Reservation',w:12,ph:'Reservation',f4:'rsnum',show:v=>v.ref==='R09'},{id:'bwart',l:'Movement Type',w:4,f4:'bwart',lab:'Mvt',redraw:1}]},
    {t:'tabs',key:'hdr',title:'Header',tabs:[{l:'General',fields:[{id:'bldat',l:'Document Date',w:10},{id:'budat',l:'Posting Date',w:10},{id:'lfsnr',l:'Delivery Note',w:16,show:v=>v.act==='A01'},{id:'frbnr',l:'Bill of Lading',w:16,show:v=>v.act==='A01'},{id:'xblnr',l:'Material Slip',w:16,show:v=>v.act!=='A01'},{id:'bktxt',l:'HeaderText',w:24}]}]},
    {t:'items',key:'it',title:'Item Overview',rows:1,cols:[
      {id:'line',l:'Line',ro:1,v:r=>r+1},{id:'txt',l:'Mat. Short Text',ro:1},{id:'ok',l:'OK',t:'chk'},
      {id:'mat',l:'Material',w:11,f4:'matnr',show:v=>v.ref==='R10'},{id:'qty',l:'Qty in UnE',w:7},{id:'un',l:'EUn',ro:1},
      {id:'werks',l:'Plnt',w:5,f4:'werks',show:v=>v.ref==='R10'},{id:'lgort',l:'SLoc',w:5,f4:'lgort'},{id:'umlgo',l:'Recv. SLoc',w:5,f4:'lgort',show:v=>norm(v.bwart)==='311'}]},
    {t:'tabs',key:'det',title:v=>'Line 1  '+(v['it.0.txt']||''),tabs:[
      {l:'Material',fields:[{id:'it.0.mat',l:'Material',t:v=>v.ref==='R10'?'txt':'ro',w:11,f4:'matnr'},{id:'it.0.txt',l:'Short text',t:'ro'}]},
      {l:'Quantity',fields:[{id:'it.0.qty',l:'Qty in Unit of Entry',w:8},{id:'it.0.poqty',l:'Qty Ordered',t:'ro',show:v=>v.ref==='R01'}]},
      {l:'Where',fields:[{id:'bwart',l:'Movement Type',t:'ro'},{id:'it.0.werks',l:'Plant',t:v=>v.ref==='R10'?'txt':'ro',w:5,f4:'werks'},{id:'it.0.lgort',l:'Storage Location',w:5,f4:'lgort'},{id:'it.0.stock',l:'Stock type',t:'ro',show:v=>!v._stockSel},{id:'it.0.insmk',l:'Stock type',t:'sel',opts:[['','Unrestricted use'],['2','Quality inspection'],['3','Blocked stock']],show:v=>!!v._stockSel},{id:'it.0.umlgo',l:'Receiving Stor. Loc.',w:5,f4:'lgort',show:v=>norm(v.bwart)==='311'},{id:'it.0.wempf',l:'Goods recipient',w:14},{id:'it.0.grund',l:'Reason for Movement',w:5,f4:'grund',show:v=>['551','555','344','343'].includes(norm(v.bwart))}]},
      {l:'Account Assignment',show:v=>['201','221','261','551','555'].includes(norm(v.bwart))||!!v._acctP,fields:[{id:'it.0.wbs_po',l:'WBS Element (from PO)',t:'ro',show:v=>!!v._acctP},{id:'it.0.kostl',l:'Cost Center',w:10,f4:'kostl',show:v=>['201','551','555'].includes(norm(v.bwart))},{id:'it.0.wbs',l:'WBS Element',w:14,f4:'posid',show:v=>norm(v.bwart)==='221'},{id:'it.0.aufnr',l:'Order',w:10,f4:'pmord',show:v=>norm(v.bwart)==='261'}]},
      {l:'Purchase Order Data',show:v=>v.ref==='R01',fields:[{id:'it.0.po',l:'Purchase Order',t:'ro'},{id:'it.0.vendor',l:'Vendor',t:'ro'},{id:'it.0.elikz',l:'Del.Completed Ind.',t:'sel',opts:F4.elikz}]}],
     foot:[{id:'it.0.ok',l:'Item OK',t:'chk'}]}
  ],
  onEnter:o.onEnter,expect:o.expect,hints:o.hints||{},ok:o.ok};
}

/* ---------- ALV data ---------- */
const ALV_PO_OPEN={cols:[{id:'po',l:'Purch.Doc.'},{id:'it',l:'Item'},{id:'vend',l:'Vendor/supplying plant'},{id:'txt',l:'Short Text'},{id:'qty',l:'PO Quantity',num:1},{id:'oun',l:'OUn'},{id:'open',l:'Still to be delivered (qty)',num:1},{id:'dd',l:'Deliv. Date',date:1}],
rows:[{po:'4500021880',it:'10',vend:'CV Sinar Elektrik',txt:'KABEL NYY 4X16',qty:200,oun:'M',open:120,dd:'06.11.2026'},{po:'4500021902',it:'10',vend:'PT Duta Konveyor',txt:'BELT CONVEYOR EP400',qty:1,oun:'PC',open:1,dd:'20.11.2026'},{po:'4500021873',it:'10',vend:'PT Mitra Teknik Abadi',txt:'BEARING SKF 6205-2RS',qty:10,oun:'PC',open:10,dd:'28.10.2026'}]};
const ALV_PO_MULTI={cols:[{id:'po',l:'Purch.Doc.'},{id:'it',l:'Item'},{id:'vend',l:'Vendor/supplying plant'},{id:'txt',l:'Short Text'},{id:'qty',l:'PO Quantity',num:1},{id:'oun',l:'OUn'},{id:'open',l:'Still to be delivered (qty)',num:1},{id:'inv',l:'Still to be invoiced (qty)',num:1}],
rows:[{po:'4500021850',it:'10',vend:'PT Baja Inox',txt:'PLAT STAINLESS 316 2MM',qty:12,oun:'LBR',open:0,inv:0},{po:'4500021861',it:'10',vend:'CV Mur Baut Jaya',txt:'BAUT M12X40 SS',qty:400,oun:'PC',open:0,inv:400},{po:'4500021873',it:'10',vend:'PT Mitra Teknik Abadi',txt:'BEARING SKF 6205-2RS',qty:10,oun:'PC',open:10,inv:10},{po:'4500021880',it:'10',vend:'CV Sinar Elektrik',txt:'KABEL NYY 4X16',qty:200,oun:'M',open:120,inv:120}]};
const ALV_CJI3={cols:[{id:'wbs',l:'WBS Element'},{id:'ce',l:'Cost Elem.'},{id:'cen',l:'Cost element name'},{id:'val',l:'Val/COArea Crcy',num:1},{id:'ref',l:'Ref Document'},{id:'pd',l:'Posting Date',date:1},{id:'txt',l:'Name / Text'}],
rows:[{wbs:'P-26-014.01',ce:'640100',cen:'Jasa engineering',val:45000000,ref:'5105600088',pd:'12.09.2026',txt:'PT Rancang Teknik – desain'},
{wbs:'P-26-014.02',ce:'510100',cen:'Material proyek',val:164000000,ref:'4900060011',pd:'18.09.2026',txt:'Frame conveyor (GI 221)'},
{wbs:'P-26-014.02',ce:'510100',cen:'Material proyek',val:98500000,ref:'5000186120',pd:'02.10.2026',txt:'Motor gearbox 3 kW x2'},
{wbs:'P-26-014.02',ce:'510100',cen:'Material proyek',val:50000000,ref:'4900060455',pd:'09.10.2026',txt:'Roller set (GI 221)'},
{wbs:'P-26-014.03',ce:'640200',cen:'Jasa instalasi',val:120000000,ref:'1000034401',pd:'10.10.2026',txt:'Instalasi tahap 1 (SES)'},
{wbs:'P-26-014.03',ce:'640200',cen:'Jasa instalasi',val:60000000,ref:'1000034488',pd:'27.10.2026',txt:'Instalasi tahap 2 (SES)'},
{wbs:'P-26-014.04',ce:'510100',cen:'Material proyek',val:44000000,ref:'5000186990',pd:'30.10.2026',txt:'Kabel NYY 4x16 80 M'},
{wbs:'P-26-014.04',ce:'510100',cen:'Material proyek',val:28500000,ref:'4900060870',pd:'31.10.2026',txt:'Panel MCC (GI 221)'}]};
const ALV_CJI5={cols:[{id:'wbs',l:'WBS Element'},{id:'po',l:'Ref Document'},{id:'txt',l:'Name / Text'},{id:'val',l:'Val/COArea Crcy',num:1},{id:'dd',l:'Debit Date',date:1}],
rows:[{wbs:'P-26-014.04',po:'4500021880',txt:'Kabel NYY 4x16 – sisa 120 M',val:66000000,dd:'06.11.2026'},{wbs:'P-26-014.02',po:'4500021902',txt:'Belt conveyor EP400',val:148000000,dd:'20.11.2026'},{wbs:'P-26-014.03',po:'4500021915',txt:'Jasa commissioning',val:16000000,dd:'25.11.2026'}]};
const ALV_MI20={cols:[{id:'mat',l:'Material'},{id:'txt',l:'Material Description'},{id:'sl',l:'SLoc'},{id:'book',l:'Book quantity',num:1},{id:'cnt',l:'Counted qty',num:1},{id:'diff',l:'Difference qty',num:1},{id:'bun',l:'BUn'},{id:'val',l:'Diff. value (IDR)',num:1}],
rows:[{mat:'300012457',txt:'BEARING SKF 6205-2RS',sl:'1101',book:6,cnt:5,diff:-1,bun:'PC',val:-185000},{mat:'300019920',txt:'V-BELT B-52',sl:'1101',book:12,cnt:12,diff:0,bun:'PC',val:0}]};

/* ---------- SCENARIOS ---------- */
const SIMS=[
{id:'s0',title:'Navigasi dasar: /n, /o, menu',mod:1,lvl:'Dasar',
brief:{from:'Latihan hari pertama',msg:'Biasakan berpindah transaksi. Buka daftar PR, pindah ke laporan stok gudang, buka stock overview di jendela baru, lalu kembali ke layar awal.'},
steps:[
{k:'nav',tc:'ME5A',pre:null,instr:'Dari SAP Easy Access, buka daftar PR (ME5A). Kamu bisa mengetik di command field atau mencarinya di SAP menu: Logistics → Materials Management → Purchasing → Purchase Requisition → List Displays.'},
{k:'nav',tc:'MB52',pre:'n',instr:'Kamu sekarang di dalam ME5A. Pindah ke laporan stok gudang (MB52) di jendela yang sama.'},
{k:'nav',tc:'MMBE',pre:'o',instr:'Buka Stock Overview (MMBE) di jendela/session baru supaya MB52 tetap terbuka.'},
{k:'nav',tc:'',pre:'n',instr:'Kembali ke SAP Easy Access (keluar dari transaksi) dengan satu perintah.'},
{k:'q',instr:'Perintah mana yang menutup semua session tanpa konfirmasi dan tanpa menyimpan?',o:['/nex','/n','/nend','/o'],a:0,e:'/nex langsung logoff. Hindari kalau ada data yang belum disimpan.'}
]},
{id:'s8',title:'Multiple selection & variant',mod:1,lvl:'Dasar',
brief:{from:'Bu Sari, Procurement (via email)',msg:'Tolong cek status 4 PO di lampiran Excel ini: mana yang barangnya belum lengkap datang? Sekalian simpan variant untuk laporan PO proyek yang belum diterima, biar tiap Senin tinggal pakai.'},
attach:{t:'xl',title:'PO_cek_status.xlsx',rows:['4500021850','4500021861','4500021873','4500021880']},
steps:[
{k:'tx',tc:'ME2N',instr:'Buka ME2N. Masukkan 4 nomor PO lewat Multiple selection (ikon ⇨ di samping Purchasing Document), lalu Execute (F8). Kosongkan Selection Parameters agar semua status tampil.',
screens:[
{title:'Purchasing Documents per Document Number',sel:1,go:'exec',def:{listu:'BEST',ekorg:'1000'},blocks:selME2N(),
 expect:{ebeln_multi:{fn:(v,V)=>{const L=(V.ebeln_multi||[]).map(norm).sort().join();return L==='4500021850,4500021861,4500021873,4500021880'?null:{sap:'Enter selection: Purchasing Document (multiple selection)',idn:'Masukkan keempat nomor PO dari lampiran lewat tombol Multiple selection. Salin kolom di lampiran, lalu tempel di kotak Upload from clipboard.'};}},selpa:''},
 hints:{ebeln_multi:'Klik ⇨ di samping Purchasing Document',selpa:'Biarkan kosong'}},
{title:'Purchasing Documents per Document Number',blocks:[{t:'alv',key:'pom',data:ALV_PO_MULTI}]}]},
{k:'q',instr:'Dari hasil ALV, berapa PO yang barangnya masih belum lengkap diterima (Still to be delivered > 0)?',o:['1','2','3','4'],a:1,e:'4500021873 (10 PC) dan 4500021880 (120 M). Tip: pilih kolom Still to be delivered lalu Sort descending.'},
{k:'tx',tc:'ME2N',instr:'Sekarang buka ME2N lagi (/n), isi Purchasing Group P05, Plant 1100, Selection Parameters WE101, lalu simpan sebagai variant dengan Ctrl+S (Save as Variant).',
screens:[{title:'Purchasing Documents per Document Number',sel:1,go:'variant',def:{listu:'BEST',ekorg:'1000'},blocks:selME2N(),expect:{ekgrp:'P05',werks:'1100',selpa:'WE101'},hints:{ekgrp:'Tim Project & Engineering',selpa:'Open goods receipt'}}]},
{k:'q',instr:'Minggu depan, bagaimana memakai variant tadi?',o:['Get Variant (Shift+F5), pilih variant, lalu F8','Isi ulang semua field','Minta Procurement','Buka /nex'],a:0,e:'Get Variant memuat filter yang tersimpan.'}
]},
{id:'s9',title:'Cek data material (MM03)',mod:2,lvl:'Dasar',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Sebelum PR, tolong cek material bearing SKF 6205-2RS: satuan dasarnya apa, dan default purchasing group-nya siapa di Pabrik Cikarang?'},
steps:[
{k:'tx',tc:'MM03',instr:'Buka MM03, cari material dengan F4, Enter, lalu pilih view yang dibutuhkan (Basic Data 1 dan Purchasing).',
screens:[
{title:'Display Material (Initial Screen)',go:'enter',popupOnGo:'views',blocks:[{t:'group',title:'',fields:[{id:'mat',l:'Material',w:12,f4:'matnr'}]}],
 expect:{mat:'300012457'},hints:{mat:'F4 → cari "6205"'},
 popups:{views:{title:'Select View(s)',fields:[{id:'m.bd1',l:'Basic Data 1',t:'chk'},{id:'m.bd2',l:'Basic Data 2',t:'chk'},{id:'m.pur',l:'Purchasing',t:'chk'},{id:'m.mrp',l:'MRP 1',t:'chk'},{id:'m.acc',l:'Accounting 1',t:'chk'},{id:'m.werks',l:'Plant (Organizational Levels)',w:6,f4:'werks'}],
   expect:{'m.bd1':true,'m.pur':true,'m.werks':{fn:(x,V)=>V['m.pur']&&norm(x)!=='1100'?{sap:'Enter plant for view Purchasing',idn:'View Purchasing butuh plant (Organizational Levels). Isi 1100.'}:null}},next:true}}},
{title:'Display Material 300012457 (Spare part)',blocks:[{t:'tabs',key:'views',tabs:[
  {l:'Basic data 1',fields:[{id:'x1',l:'Material',t:'ro',v:'300012457'},{id:'x2',l:'Description',t:'ro',v:'BEARING SKF 6205-2RS'},{id:'x3',l:'Base Unit of Measure',t:'ro',v:'PC'},{id:'x4',l:'Material Group',t:'ro',v:'4105 Bearing'},{id:'x5',l:'Old material number',t:'ro',v:'SKF-6205-2RS'},{id:'x6',l:'Gross Weight',t:'ro',v:'0,12 KG'}]},
  {l:'Purchasing',show:v=>v['m.pur'],fields:[{id:'y1',l:'Plant',t:'ro',v:'1100'},{id:'y2',l:'Purchasing Group',t:'ro',v:'P03 MRO / sparepart'},{id:'y3',l:'Order Unit',t:'ro',v:'PC'},{id:'y4',l:'GR Processing Time',t:'ro',v:'1 days'},{id:'y5',l:'Planned Deliv. Time',t:'ro',v:'14 days'}]}]}]}]},
{k:'q',instr:'Apa base unit material ini?',o:['PC','KG','M','BOX'],a:0,e:'Base Unit of Measure = PC (pieces), terlihat di view Basic data 1.'},
{k:'q',instr:'Default purchasing group di view Purchasing adalah P03 (MRO). Untuk PR proyek, kamu tetap boleh mengisi P05?',o:['Ya, PR proyek boleh diarahkan ke buyer proyek (P05) sesuai aturan perusahaan','Tidak, harus selalu sama dengan master','Purchasing group tidak penting','Harus dikosongkan'],a:0,e:'Default master hanya usulan. Ikuti aturan pembagian buyer di perusahaanmu. Perhatikan juga Planned Deliv. Time 14 hari.'}
]},
{id:'s1',title:'Buat PR material proyek (ME51N)',mod:3,lvl:'Menengah',
brief:{from:'Pak Hendra, Project Supervisor (WhatsApp)',msg:'Tolong buatkan PR 10 pcs bearing SKF 6205-2RS untuk proyek Conveyor Line 3, bebankan ke WBS material mekanikal. Barang dibutuhkan tanggal 12.11.2026, kirim ke Gudang Sparepart Cikarang. Buyer-nya tim Project & Engineering. Requisitioner isi nama saya: HENDRA.'},
steps:[
{k:'tx',tc:'ME51N',instr:'Buka ME51N. Isi baris item 10 di Item Overview, tekan Enter, lalu lengkapi tab Account Assignment dan Contact Person di Item Detail. Check, lalu Save.',
screens:[{title:'Create Purchase Requisition',go:'save',checkOk:'No messages issued during check',def:{bsart:'NB'},
blocks:[
 {t:'bar',fields:[{id:'bsart',l:'Document type',t:'sel',opts:[['NB','Purchase Requisition'],['FO','Framework Requisition']]},{id:'srcdet',l:'Source determination',t:'chk'}]},
 {t:'items',key:'it',title:'Item Overview',rows:3,cols:[{id:'itm',l:'Itm',ro:1,v:r=>(r+1)*10},{id:'knttp',l:'A',w:2,f4:'knttp'},{id:'pstyp',l:'I',w:2},{id:'mat',l:'Material',w:11,f4:'matnr'},{id:'txt',l:'Short Text',ro:1},{id:'qty',l:'Quantity',w:6},{id:'un',l:'Un',ro:1},{id:'date',l:'Deliv. Date',w:10},{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'SLoc',w:5,f4:'lgort'},{id:'ekgrp',l:'PGr',w:4,f4:'ekgrp'}]},
 {t:'tabs',key:'det',title:v=>'Item  [ 10 ]  '+(v['it.0.mat']||'')+'  '+(v['it.0.txt']||''),tabs:[
   {l:'Material Data',fields:[{id:'it.0.mat',l:'Material',t:'ro'},{id:'it.0.txt',l:'Short text',t:'ro'},{id:'it.0.mg',l:'Material Group',t:'ro'}]},
   {l:'Quantities/Dates',fields:[{id:'it.0.qty',l:'Quantity',w:8},{id:'it.0.date',l:'Delivery date',w:10}]},
   {l:'Valuation',fields:[{id:'it.0.price',l:'Valuation Price (IDR)',t:'ro'}]},
   {l:'Account Assignment',fields:[{id:'it.0.knttp',l:'Acct Assignment Cat.',t:'ro'},{id:'it.0.wbs',l:'WBS Element',w:14,f4:'posid'},{id:'it.0.gl',l:'G/L Account',t:'ro'},{id:'it.0.unload',l:'Unloading Point',w:14}]},
   {l:'Contact Person',fields:[{id:'it.0.afnam',l:'Requisitioner',w:12},{id:'it.0.bednr',l:'Tracking Number',w:10}]}]}
],
onEnter:v=>{const out={};if(v['it.0.mat']){const f=matFill('it.0.',v);if(!f)return {msg:['E',`Material ${v['it.0.mat']} does not exist`],explain:'Nomor material tidak ditemukan. Pakai F4 untuk mencari.'};Object.assign(out,f);}
  if(norm(v['it.0.knttp'])==='P')out['it.0.gl']='510100';
  return {fill:out,msg:out['it.0.txt']&&norm(v['it.0.knttp'])==='P'&&!v['it.0.wbs']?['I','Item 10: enter account assignment on tab Account Assignment']:null};},
expect:{bsart:'NB','it.0.knttp':'P','it.0.mat':'300012457','it.0.txt':NEED_ENTER('material'),'it.0.qty':'10','it.0.date':DATE_FUT,'it.0.werks':'1100','it.0.lgort':'1101','it.0.ekgrp':'P05',
  'it.0.wbs':{eq:'P-26-014.02',sap:'Enter WBS element',idn:'Karena A = P, SAP wajib meminta WBS. Buka tab Account Assignment di Item Detail. WBS material mekanikal adalah P-26-014.02 (F4).'},'it.0.afnam':{eq:'HENDRA',idn:'Isi nama pemohon di tab Contact Person → Requisitioner.'}},
hints:{'it.0.knttp':'Proyek → P','it.0.mat':'F4 → "6205"','it.0.date':'Tanggal dari brief','it.0.ekgrp':'Project & Engineering','it.0.wbs':'Tab Account Assignment','it.0.afnam':'Tab Contact Person'},
warn:v=>{const d=dParse(v['it.0.date']);return d&&d<dParse('18.11.2026')?{sap:'Delivery date cannot be met (planned delivery time 14 days)',idn:'Ini warning, bukan error. Lead time vendor 14 hari sehingga tanggal 12.11.2026 kemungkinan tidak terkejar. Tekan Enter untuk tetap menyimpan, lalu kabari Procurement dan supervisor bahwa barang mendesak.'}:null;},
ok:'Purchase requisition number 10004587 created'}]},
{k:'q',instr:'PR 10004587 tersimpan dengan warning lead time. Tindakan yang paling tepat setelah ini?',o:['Kabari Procurement & supervisor bahwa PR mendesak (lead time 14 hari), lalu pantau di ME5A','Buat PR kedua supaya cepat','Hapus PR','Tidak perlu apa-apa'],a:0,e:'Warning adalah sinyal untuk dikomunikasikan. Pantau release dan nomor PO di ME5A.'}
]},
{id:'s2',title:'Follow up PO belum datang',mod:3,lvl:'Menengah',
brief:{from:'Persiapan rapat mingguan',msg:'Besok rapat progres. Butuh daftar PO proyek (Purchasing Group P05) di Pabrik Cikarang yang barangnya belum diterima, lalu cek detail PO kabel CV Sinar Elektrik.'},
steps:[
{k:'tx',tc:'ME2N',instr:'Buka ME2N, isi filter, lalu Execute (F8). Di hasil ALV, coba sort kolom Deliv. Date.',
screens:[{title:'Purchasing Documents per Document Number',sel:1,go:'exec',def:{listu:'BEST',ekorg:'1000'},blocks:selME2N(),expect:{ekgrp:'P05',werks:'1100',selpa:'WE101'},hints:{ekgrp:'Project & Engineering',werks:'Pabrik Cikarang',selpa:'F4 → Open goods receipt'}},
 {title:'Purchasing Documents per Document Number',blocks:[{t:'alv',key:'po',data:ALV_PO_OPEN}]}]},
{k:'q',instr:'Hari ini 04.11.2026. PO mana yang paling mendesak di-follow up? (Tip: klik judul kolom Deliv. Date lalu Sort ascending.)',o:['4500021873','4500021880','4500021902'],a:0,e:'Delivery date 28.10.2026 sudah lewat dan belum ada barang yang diterima.'},
{k:'tx',tc:'ME23N',instr:'Buka ME23N, klik Other Purchase Order, masukkan PO kabel (F4), lalu buka tab Purchase Order History di Item Detail.',
screens:[{title:'Standard PO 4500021902 Created by SARI',go:null,blocks:[{t:'note',html:'<p>ME23N membuka PO yang terakhir kamu lihat (4500021902). Gunakan tombol <b>Other Purchase Order</b> (Shift+F5) di toolbar untuk membuka PO lain.</p>'}],
  tbx:[{l:'Other Purchase Order',k:'otherpo'}],popups:{otherpo:{title:'Select Document',fields:[{id:'m.po',l:'Purchase Order',w:12,f4:'ebeln'}],expect:{'m.po':{eq:'4500021880',idn:'Brief meminta PO kabel dari CV Sinar Elektrik. Pakai F4.'}},next:true}},expect:{}},
 {title:'Standard PO 4500021880 Created by SARI',goal:s=>s.tabs.det===5,goalMsg:'Tab Purchase Order History dibuka',
  blocks:[{t:'kv',rows:[['Vendor','100125 CV Sinar Elektrik'],['Doc. date','21.10.2026'],['Purch. Group','P05'],['Plant','1100']]},
  {t:'table',title:'Item Overview',h:['Itm','A','Material','Short Text','PO Quantity','OUn','Deliv. Date','Net Price','Plnt','SLoc'],r:[['10','P','300022105','KABEL NYY 4X16','200','M','06.11.2026','550.000','1100','1102']]},
  {t:'tabs',key:'det',title:'Item  [ 10 ] 300022105, KABEL NYY 4X16',tabs:[
   {l:'Material Data',fields:[{id:'z1',l:'Material Group',t:'ro',v:'4200 Kabel'}]},
   {l:'Quantities/Weights',fields:[{id:'z2',l:'PO Quantity',t:'ro',v:'200 M'}]},
   {l:'Delivery Schedule',table:{h:['Deliv. Date','Sched. Qty','GR Qty'],r:[['06.11.2026','200','80']]}},
   {l:'Invoice',fields:[{id:'z3',l:'Inv. Receipt',t:'ro',v:'X'},{id:'z4',l:'GR-Bsd IV',t:'ro',v:'X'}]},
   {l:'Account Assignment',fields:[{id:'z5',l:'WBS Element',t:'ro',v:'P-26-014.04'},{id:'z6',l:'G/L Account',t:'ro',v:'510100'}]},
   {l:'Purchase Order History',table:{h:['Sh. Text','MvT','Material Doc.','Posting Date','Quantity','OUn','Amount (IDR)'],r:[['WE','101','5000186990','30.10.2026','80','M','44.000.000'],['RE-L','','5105600123','02.11.2026','80','M','44.000.000'],['Total goods receipt','','','','80','M','44.000.000'],['Total invoice receipt','','','','80','M','44.000.000']]}}]}]}]},
{k:'q',instr:'Dari PO history, berapa kabel yang masih harus dikirim vendor, dan apakah invoicenya aman?',o:['120 M; invoice 80 M = GR 80 M, jadi 3-way match cocok','80 M; invoice belum ada','200 M; invoice blocked','0 M; selesai'],a:0,e:'Dipesan 200 M, WE 80 M, sisa 120 M. RE-L 80 M sama dengan GR, jadi tidak di-block.'}
]},
{id:'s3',title:'Goods receipt sebagian (MIGO 101)',mod:4,lvl:'Menengah',
brief:{from:'Pak Joko, Gudang',msg:'Bearing dari PT Mitra Teknik datang, tapi vendor baru kirim sebagian. Surat jalan terlampir. Fisik sudah dicek, kondisi baik. Masuk ke Gudang Sparepart ya.'},
attach:{t:'sj',title:'Surat Jalan SJ-MTA/1125',rows:[['No. SJ','SJ-MTA/1125'],['Tanggal','04.11.2026'],['Ref. PO','4500021873'],['Barang','BEARING SKF 6205-2RS'],['Qty kirim','8 PC'],['Catatan','Sisa 2 PC menyusul']]},
steps:[
{k:'tx',tc:'MIGO',instr:'Buka MIGO. Pastikan A01 Goods Receipt + R01 Purchase Order, isi nomor PO lalu Enter. Isi Delivery Note, sesuaikan qty dengan surat jalan, centang Item OK, Check, lalu Post.',
screens:[migoScreen({
 onEnter:v=>{if(v.ref!=='R01')return null;if(!v.po)return {msg:['E','Enter a purchase order number'],explain:'Isi nomor PO di field sebelah Reference.'};
  if(norm(v.po)!=='4500021873')return {msg:['E',`Purchase order ${v.po}: no open items for goods receipt in this simulation`],explain:'Cek nomor PO di surat jalan.'};
  if(v['it.0.txt'])return null;
  return {fill:{'it.0.mat':'300012457','it.0.txt':'BEARING SKF 6205-2RS','it.0.qty':'10','it.0.poqty':'10 PC','it.0.un':'PC','it.0.lgort':'1101','it.0.werks':'1100','it.0.stock':'Unrestricted use','it.0.po':'4500021873 / 10','it.0.vendor':'100118 PT Mitra Teknik Abadi'},msg:['I','Item data adopted from purchase order 4500021873'],explain:'Item terisi otomatis dari PO dengan qty yang dipesan (10). Sekarang sesuaikan dengan barang yang benar-benar datang.'};},
 expect:{act:'A01',ref:'R01',po:'4500021873',bwart:'101','it.0.txt':NEED_ENTER('nomor PO'),lfsnr:{eq:'SJ-MTA/1125',idn:'Isi nomor surat jalan di tab General → Delivery Note.'},'it.0.qty':{eq:'8',idn:'Qty GR harus sesuai barang yang datang di surat jalan (8 PC), bukan qty PO.'},'it.0.lgort':'1101','it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK di tabel item atau di bawah Item Detail.'}},
 hints:{po:'Lihat surat jalan',lfsnr:'Tab General','it.0.qty':'Sesuai surat jalan','it.0.ok':'Centang OK'},
 ok:'Material document 5000187342 posted'})]},
{k:'q',instr:'Setelah GR ini, apa yang terlihat di PO history ME23N dan apa dampaknya jika vendor menagih 10 pcs sekarang?',o:['WE 8 PC; invoice 10 PC akan blocked sampai sisa 2 PC diterima','WE 10 PC; invoice langsung dibayar','RE-L 8 PC; tidak ada dampak','Tidak ada yang berubah'],a:0,e:'GR 8 PC tercatat sebagai WE. Invoice 10 PC melebihi GR sehingga 3-way match gagal.'}
]},
{id:'s4',title:'Keluarkan material ke WBS (MIGO 221)',mod:4,lvl:'Menengah',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Teknisi butuh 4 pcs bearing SKF 6205-2RS untuk dipasang di conveyor sekarang. Ambil dari Gudang Sparepart Cikarang, bebankan ke WBS material mekanikal proyek Line 3.'},
steps:[
{k:'tx',tc:'MIGO',instr:'Buka MIGO. Ubah ke A07 Goods Issue + R10 Other. Perhatikan movement type default, isi item, tekan Enter, lalu isi WBS di tab Account Assignment. Item OK, Check, Post.',
screens:[migoScreen({
 onEnter:v=>{if(v.ref!=='R10'||!v['it.0.mat'])return null;const M=MAT[norm(v['it.0.mat'])];if(!M)return {msg:['E',`Material ${v['it.0.mat']} does not exist`],explain:'Pakai F4 untuk mencari material.'};return {fill:{'it.0.txt':M.d,'it.0.un':M.u,'it.0.stock':'Unrestricted use'}};},
 expect:{act:{eq:'A07',idn:'Pengeluaran barang = A07 Goods Issue.'},ref:{eq:'R10',idn:'GI tanpa dokumen referensi = R10 Other.'},bwart:{eq:'221',idn:'Default untuk Goods Issue adalah 201 (cost center). Untuk proyek ganti ke 221.'},'it.0.mat':'300012457','it.0.txt':NEED_ENTER('material'),'it.0.qty':'4','it.0.werks':'1100','it.0.lgort':'1101',
  'it.0.wbs':{eq:'P-26-014.02',sap:'Enter WBS element',idn:'Movement 221 wajib WBS. Buka tab Account Assignment di Item Detail.'},'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 hints:{act:'A07 Goods Issue',ref:'R10 Other',bwart:'Proyek → 221','it.0.mat':'F4 → "6205"','it.0.wbs':'Tab Account Assignment'},
 ok:'Material document 4900061520 posted'})]},
{k:'q',instr:'Ternyata hanya 3 pcs yang dipakai, 1 pcs kembali ke gudang. Koreksi yang benar?',o:['Posting 222 untuk 1 pcs ke WBS yang sama (atau cancel lewat A03 lalu posting ulang 3 pcs)','Posting 101 untuk 1 pcs','Ubah angka stok di MB52','Biarkan, nanti beres saat opname'],a:0,e:'222 membalikkan 221 dan mengembalikan biaya dari WBS ke stok.'}
]},
{id:'s5',title:'Stock opname Gudang Sparepart',mod:5,lvl:'Lanjut',
brief:{from:'Bu Ratna, Finance',msg:'Akhir bulan kita opname Gudang Sparepart (1101) Cikarang, tanggal hitung 30.11.2026, pakai posting block. Material yang dihitung: 300012457 dan 300019920. Setelah hitung, input hasilnya dan kirim daftar selisih.'},
steps:[
{k:'tx',tc:'MI01',instr:'Buka MI01. Isi initial screen, Enter, lalu masukkan dua material di daftar item, Enter, Save.',
screens:[
{title:'Create Physical Inventory Document: Initial Screen',go:'enter',def:{bldat:TODAY},blocks:[{t:'group',title:'Document data',fields:[{id:'bldat',l:'Document Date',w:10},{id:'gidat',l:'Planned Count Date',w:10},{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,f4:'lgort'}]},{t:'group',title:'Other information',fields:[{id:'sperr',l:'Posting Block',t:'chk'},{id:'zstat',l:'Freeze Book Inv. Balance',t:'chk'},{id:'xblni',l:'Phys. Inventory Ref.',w:14}]}],
 expect:{gidat:{fn:v=>dParse(v)&&norm(v)==='30.11.2026'?null:{sap:'Check entry in field Planned Count Date',idn:'Tanggal hitung dari brief: 30.11.2026 (format DD.MM.YYYY).'}},werks:'1100',lgort:'1101',sperr:{eq:true,idn:'Brief minta posting block supaya stok buku dibekukan.'}},hints:{gidat:'30.11.2026',sperr:'Centang'}},
{title:'Create Physical Inventory Document: New Items',go:'save',blocks:[{t:'kv',rows:[['Plant',v=>v.werks],['Storage Location',v=>v.lgort],['Planned count date',v=>v.gidat],['Posting block',v=>v.sperr?'X':'']]},
 {t:'items',key:'mi',title:'Items',rows:4,cols:[{id:'itm',l:'Item',ro:1,v:r=>String(r+1).padStart(3,'0')},{id:'mat',l:'Material',w:11,f4:'matnr'},{id:'txt',l:'Material Description',ro:1},{id:'batch',l:'Batch',w:8},{id:'st',l:'S',ro:1,v:()=>'1'}]}],
 onEnter:v=>{const out={};for(let r=0;r<4;r++){const m=v[`mi.${r}.mat`];if(m){const M=MAT[norm(m)];if(!M)return {msg:['E',`Material ${m} does not exist in plant 1100`]};out[`mi.${r}.txt`]=M.d;}}return {fill:out};},
 expect:{'mi.0.mat':'300012457','mi.1.mat':'300019920','mi.0.txt':NEED_ENTER('material'),'mi.1.txt':NEED_ENTER('material')},hints:{'mi.0.mat':'Dari brief','mi.1.mat':'Dari brief'},ok:'Phys. inv. doc. 100000356 created'}]},
{k:'q',instr:'Kenapa Posting Block dicentang?',o:['Membekukan GR/GI pada item tersebut selama opname','Menghapus stok lama','Mengunci user lain','Membuat PO otomatis'],a:0,e:'Dengan posting block, stok buku tidak berubah selama tim menghitung.'},
{k:'tx',tc:'MI04',attach:{t:'sheet',title:'Lembar hitung MI21 – dok. 100000356',rows:[['001','300012457 BEARING SKF 6205-2RS','5 PC'],['002','300019920 V-BELT B-52','12 PC']]},instr:'Lembar hitung sudah kembali (lihat lampiran). Buka MI04, masukkan nomor dokumen opname, Enter, isi qty, lalu Save.',
screens:[
{title:'Enter Inventory Count: Initial Screen',go:'enter',def:{gjahr:'2026',zldat:'30.11.2026'},blocks:[{t:'group',title:'',fields:[{id:'iblnr',l:'Phys. Inventory Doc.',w:12},{id:'gjahr',l:'Fiscal Year',w:5},{id:'zldat',l:'Count Date',w:10}]}],expect:{iblnr:{eq:'100000356',idn:'Nomor dokumen dari MI01 tadi: 100000356.'}},hints:{iblnr:'Nomor dari MI01'}},
{title:'Enter Inventory Count 100000356: Overview',go:'save',blocks:[{t:'items',key:'ct',title:'Items',rows:2,cols:[{id:'itm',l:'Item',ro:1,v:r=>['001','002'][r]},{id:'mat',l:'Material',ro:1,v:r=>['300012457','300019920'][r]},{id:'txt',l:'Material Description',ro:1,v:r=>['BEARING SKF 6205-2RS','V-BELT B-52'][r]},{id:'qty',l:'Quantity',w:7},{id:'un',l:'UnE',ro:1,v:()=>'PC'},{id:'zc',l:'ZC',t:'chk'}]}],
 expect:{'ct.0.qty':{eq:'5',idn:'Lihat lembar hitung: bearing 5 PC.'},'ct.1.qty':{eq:'12',idn:'Lihat lembar hitung: V-belt 12 PC.'}},ok:'Count entered for phys. inv. doc. 100000356'}]},
{k:'tx',tc:'MI20',instr:'Jalankan daftar selisih untuk plant dan sloc tersebut (F8).',
screens:[{title:'List of Inventory Differences',sel:1,go:'exec',def:{gjahr:'2026'},blocks:[{t:'group',title:'Database selections',fields:[{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,f4:'lgort'},{id:'iblnr',l:'Physical Inventory Document',w:12},{id:'gjahr',l:'Fiscal Year',w:5}]}],expect:{werks:'1100',lgort:'1101'}},
 {title:'List of Inventory Differences',blocks:[{t:'alv',key:'mi20',data:ALV_MI20}]}]},
{k:'q',instr:'Ada selisih -1 pcs bearing (−Rp 185.000). Langkah berikutnya?',o:['Investigasi (MB51, recount MI11), berita acara, lalu MI07 oleh user berwenang','Langsung MI07 sendiri','GR 101 satu pcs agar cocok','Hapus dokumen opname'],a:0,e:'Selisih diposting setelah investigasi dan approval.'}
]},
{id:'s6',title:'Cek biaya & komitmen proyek',mod:7,lvl:'Lanjut',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Berapa biaya aktual dan komitmen proyek P-26-014 sampai sekarang? Budget kita Rp 850 juta. Saya mau tahu masih aman atau tidak.'},
steps:[
{k:'tx',tc:'CJI3',instr:'Buka CJI3. Isi Database profile di popup, isi Project, Execute. Di ALV, klik judul kolom Val/COArea Crcy lalu tombol Σ untuk total.',
popup:{once:'dbprof',title:'Database Profile',fields:[{id:'m.prof',l:'Database prof.',w:14,f4:'dbprof'}],expect:{'m.prof':{eq:'000000000001',idn:'Pakai profil standar 000000000001 (F4).'}}},
screens:[{title:'Display Actual Cost Line Items for Projects',sel:1,go:'exec',blocks:selCJI(),expect:{pspid:'P-26-014'},hints:{pspid:'F4 → Conveyor Line 3'}},
 {title:'Display Actual Cost Line Items for Projects',goal:s=>(s.alv.act||{}).sum==='val',goalMsg:'Total dihitung dengan Σ',blocks:[{t:'alv',key:'act',data:ALV_CJI3}]}]},
{k:'q',instr:'Berapa total biaya aktual proyek (hasil Σ)?',o:['Rp 610.000.000','Rp 312.500.000','Rp 850.000.000','Rp 230.000.000'],a:0,e:'Σ kolom Val/COArea Crcy = 610.000.000.'},
{k:'tx',tc:'CJI5',instr:'Sekarang lihat komitmen (PO yang belum terealisasi) di CJI5. Database profile sudah tersimpan dari tadi.',
popup:{once:'dbprof'},
screens:[{title:'Display Commitment Line Items for Projects',sel:1,go:'exec',blocks:selCJI(),expect:{pspid:'P-26-014'}},
 {title:'Display Commitment Line Items for Projects',blocks:[{t:'alv',key:'com',data:ALV_CJI5}]}]},
{k:'q',instr:'Berapa sisa budget yang benar-benar bebas?',o:['Rp 10.000.000','Rp 240.000.000','Rp 620.000.000','Rp 230.000.000'],a:0,e:'850 − 610 − 230 = 10 jt. Laporkan sebagai risiko (Amber) ke supervisor.'}
]},
{id:'s7',title:'Cek nilai AuC sebelum kapitalisasi',mod:6,lvl:'Menengah',
brief:{from:'Bu Ratna, Finance',msg:'Sebelum settlement, tolong cek nilai AuC Mesin Filling Line 2 (aset 4000012 sub 0, company code 1000). Cocokkan dengan tracker CAPEX-mu.'},
steps:[
{k:'tx',tc:'AW01N',instr:'Buka AW01N, isi company code, asset, sub-number, lalu Enter. Lihat tab Planned values dan Posted values.',
screens:[{title:'Asset Explorer',go:'enter',def:{gjahr:'2026'},blocks:[{t:'group',title:'',fields:[{id:'bukrs',l:'Company Code',w:5,f4:'bukrs'},{id:'anln1',l:'Asset',w:10,f4:'anln1'},{id:'anln2',l:'Sub-number',w:4},{id:'gjahr',l:'Fiscal Year',w:5}]}],expect:{bukrs:'1000',anln1:'4000012',anln2:'0'}},
 {title:'Asset Explorer',blocks:[{t:'kv',rows:[['Asset','4000012-0  Mesin Filling Line 2'],['Asset class','4000 Asset under Construction'],['Cost center','11PRD320 Produksi Line 2'],['Capitalized on','–']]},
 {t:'tabs',key:'aw',tabs:[
  {l:'Planned values',table:{h:['Value','Fiscal year start','Change','Year end'],r:[['Acquisition value','0','1.245.000.000','1.245.000.000'],['Ordinary depreciation','0','0','0'],['Net book value','0','1.245.000.000','1.245.000.000']]}},
  {l:'Posted values',table:{h:['Value','Fiscal year start','Change','Year end'],r:[['Acquisition value','0','1.245.000.000','1.245.000.000'],['Ordinary depreciation','0','0','0'],['Net book value','0','1.245.000.000','1.245.000.000']]}},
  {l:'Transactions',table:{h:['Asset val. date','Trans. type','Text','Amount'],r:[['30.06.2026','100','Settlement WBS P-26-007','820.000.000'],['30.09.2026','100','Settlement WBS P-26-007','425.000.000']]}}]}]}]},
{k:'q',instr:'Kenapa penyusutan AuC masih Rp 0?',o:['AuC tidak disusutkan sampai di-settle ke aset final','Sistem error','Nilainya terlalu kecil','Belum ada PO'],a:0,e:'Penyusutan mulai setelah AIBU memindahkan nilai ke aset final.'},
{k:'q',instr:'Siapa yang menjalankan AIAB/AIBU dan apa peranmu?',o:['Finance menjalankan; kamu menyiapkan BAST, rincian biaya, dan pemecahan aset','Kamu menjalankan semuanya','Vendor mesin','Gudang'],a:0,e:'Sesuai batas peran: kamu melihat data dan menyiapkan dokumen.'}
]}
];
function selME2N(){return [
 {t:'group',title:'Purchasing Documents',fields:[{id:'ebeln',l:'Purchasing Document',w:12,multi:1,to:1,f4:'ebeln'},{id:'bsart2',l:'Document Type',w:5,to:1}]},
 {t:'group',title:'Program Data / Selection',fields:[{id:'lifnr',l:'Vendor',w:10,to:1},{id:'ekorg',l:'Purchasing Organization',w:5},{id:'ekgrp',l:'Purchasing Group',w:5,f4:'ekgrp'},{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'listu',l:'Scope of List',w:8},{id:'selpa',l:'Selection Parameters',w:8,f4:'selpa'},{id:'bedat',l:'Document Date',w:10,to:1}]}];}
function selCJI(){return [
 {t:'group',title:'Project/WBS Element/Network/Activity',fields:[{id:'pspid',l:'Project',w:12,f4:'pspid',to:1},{id:'posid',l:'WBS Element',w:14,f4:'posid',to:1},{id:'nplnr',l:'Network/Order',w:10,to:1}]},
 {t:'group',title:'Cost Element / Posting Data',fields:[{id:'kstar',l:'Cost Element',w:8,to:1},{id:'budat',l:'Posting Date',w:10,to:1}]},
 {t:'group',title:'Settings',fields:[{id:'layout',l:'Layout',w:12}]}];}
/* ===================== ADDITIONAL SCENARIOS ===================== */
const ALV_MB51={cols:[{id:'doc',l:'Mat. Doc.'},{id:'pd',l:'Pstng Date',date:1},{id:'mvt',l:'MvT'},{id:'mat',l:'Material'},{id:'txt',l:'Material Description'},{id:'sl',l:'SLoc'},{id:'qty',l:'Quantity',num:1},{id:'bun',l:'BUn'},{id:'obj',l:'Cost Ctr / WBS'},{id:'usr',l:'User Name'}],
rows:[{doc:'4900061498',pd:'03.11.2026',mvt:'201',mat:'300031150',txt:'ROLLER CONVEYOR D89X500',sl:'1101',qty:-6,bun:'PC',obj:'11PRD310',usr:'JOKO'},
{doc:'5000187001',pd:'28.10.2026',mvt:'101',mat:'300031150',txt:'ROLLER CONVEYOR D89X500',sl:'1101',qty:10,bun:'PC',obj:'PO 4500021790',usr:'JOKO'},
{doc:'4900061210',pd:'21.10.2026',mvt:'221',mat:'300031150',txt:'ROLLER CONVEYOR D89X500',sl:'1101',qty:-2,bun:'PC',obj:'P-26-014.02',usr:'ANDRE'}]};
const ALV_ME5A={cols:[{id:'pr',l:'Purch.Req.'},{id:'it',l:'Item'},{id:'txt',l:'Short Text'},{id:'qty',l:'Quantity',num:1},{id:'un',l:'Un'},{id:'dd',l:'Deliv. Date',date:1},{id:'rel',l:'Release status'},{id:'po',l:'Purch.Doc.'},{id:'req',l:'Requisnr.'}],
rows:[{pr:'10004550',it:'10',txt:'BELT CONVEYOR EP400',qty:1,un:'PC',dd:'20.11.2026',rel:'Released',po:'4500021902',req:'HENDRA'},
{pr:'10004561',it:'10',txt:'KABEL NYY 4X16',qty:200,un:'M',dd:'06.11.2026',rel:'Released',po:'4500021880',req:'HENDRA'},
{pr:'10004579',it:'10',txt:'JASA COMMISSIONING CONVEYOR L3',qty:1,un:'AU',dd:'25.11.2026',rel:'Released',po:'4500021915',req:'HENDRA'},
{pr:'10004583',it:'10',txt:'PLAT STAINLESS 316 2MM',qty:4,un:'LBR',dd:'30.11.2026',rel:'Not released',po:'',req:'RUDI'},
{pr:'10004587',it:'10',txt:'BEARING SKF 6205-2RS',qty:10,un:'PC',dd:'12.11.2026',rel:'Not released',po:'',req:'HENDRA'}]};
const ALV_MB52={cols:[{id:'mat',l:'Material'},{id:'txt',l:'Material Description'},{id:'sl',l:'SLoc'},{id:'unr',l:'Unrestricted',num:1},{id:'bun',l:'BUn'},{id:'val',l:'Value Unrestricted (IDR)',num:1},{id:'qi',l:'In Quality Insp.',num:1},{id:'blk',l:'Blocked',num:1}],
rows:[{mat:'300022105',txt:'KABEL NYY 4X16',sl:'1102',unr:20,bun:'M',val:11000000,qi:0,blk:0},
{mat:'300031150',txt:'ROLLER CONVEYOR D89X500',sl:'1102',unr:4,bun:'PC',val:1800000,qi:0,blk:0},
{mat:'300015577',txt:'COUPLING MOTOR FCL-140',sl:'1102',unr:6,bun:'PC',val:4500000,qi:0,blk:0},
{mat:'300040220',txt:'MOTOR GEARBOX 3KW',sl:'1102',unr:0,bun:'PC',val:0,qi:0,blk:1},
{mat:'300050310',txt:'BAUT M12X40 SS',sl:'1102',unr:150,bun:'PC',val:1350000,qi:0,blk:0}]};
const ALV_KSB1={cols:[{id:'pd',l:'Posting Date',date:1},{id:'ce',l:'Cost Elem.'},{id:'cen',l:'Cost element name'},{id:'val',l:'Val.in RC (IDR)',num:1},{id:'ref',l:'Ref Document'},{id:'mvt',l:'MvT'},{id:'txt',l:'Name / Text'}],
rows:[{pd:'02.11.2026',ce:'510200',cen:'Sparepart & consumable',val:1250000,ref:'4900061402',mvt:'201',txt:'GREASE EP2 5 KG'},
{pd:'03.11.2026',ce:'510200',cen:'Sparepart & consumable',val:2700000,ref:'4900061498',mvt:'201',txt:'ROLLER CONVEYOR D89X500 x6'},
{pd:'03.11.2026',ce:'520100',cen:'Jasa perbaikan',val:3500000,ref:'5105600201',mvt:'',txt:'PT Servis Mesin – repair gearbox'},
{pd:'04.11.2026',ce:'510200',cen:'Sparepart & consumable',val:6600000,ref:'4900061512',mvt:'201',txt:'KABEL NYY 4X16 x12 M'}]};
const ALV_IW38={cols:[{id:'ord',l:'Order'},{id:'ty',l:'Type'},{id:'txt',l:'Description'},{id:'eq',l:'Equipment'},{id:'bs',l:'Bas. start',date:1},{id:'st',l:'System status'},{id:'wc',l:'Main WorkCtr'}],
rows:[{ord:'4000123',ty:'PM01',txt:'Breakdown – ganti bearing conveyor',eq:'10004521',bs:'03.11.2026',st:'REL',wc:'MEKANIK1'},
{ord:'4000131',ty:'PM02',txt:'Preventive – pelumasan & cek belt',eq:'10004521',bs:'10.11.2026',st:'CRTD',wc:'MEKANIK1'},
{ord:'4000135',ty:'PM02',txt:'Kalibrasi sensor metal detector',eq:'10004521',bs:'12.11.2026',st:'REL',wc:'ELEKTRIK'},
{ord:'4000098',ty:'PM01',txt:'Repair motor conveyor',eq:'10004521',bs:'20.10.2026',st:'TECO',wc:'MEKANIK2'}]};
const ALV_CJI3_AFTER={cols:ALV_CJI3.cols,rows:ALV_CJI3.rows.concat([{wbs:'P-26-014.02',ce:'510100',cen:'Material proyek',val:148000000,ref:'5000187360',pd:'04.11.2026',txt:'Belt conveyor EP400 (GR 101, PO acct. P)'}])};

const migoMatEnter=(stock)=>v=>{if(v.ref!=='R10'||!v['it.0.mat'])return null;const M=MAT[norm(v['it.0.mat'])];if(!M)return {msg:['E',`Material ${v['it.0.mat']} does not exist`],explain:'Pakai F4 untuk mencari material.'};return {fill:{'it.0.txt':M.d,'it.0.un':M.u,'it.0.stock':stock||'Unrestricted use'}};};
const NONEMPTY=(idn)=>({fn:v=>String(v||'').trim()?null:{sap:'Fill in all required entry fields',idn}});

SIMS.push(
{id:'s12',title:'Cek status PR proyek (ME5A)',mod:3,lvl:'Dasar',
brief:{from:'Pak Hendra, Project Supervisor',msg:'PR-PR proyek conveyor sudah sampai mana? Saya mau tahu mana yang belum di-approve, dan yang sudah jadi PO nomornya berapa. Tampilkan juga PR yang sudah dikonversi jadi PO.'},
steps:[
{k:'tx',tc:'ME5A',instr:'Buka ME5A, isi Purchasing Group dan Plant, centang "Closed requisitions" agar PR yang sudah jadi PO ikut tampil, lalu Execute.',
screens:[{title:'List Display of Purchase Requisitions',sel:1,go:'exec',blocks:[
  {t:'group',title:'Selection',fields:[{id:'banfn',l:'Purchase Requisition',w:10,to:1,multi:1},{id:'ekgrp',l:'Purchasing Group',w:5,f4:'ekgrp'},{id:'matnr',l:'Material',w:11,to:1,f4:'matnr'},{id:'werks',l:'Plant',w:5,f4:'werks'}]},
  {t:'group',title:'Processing status',fields:[{id:'assig',l:'Assigned Purchase Requisitions',t:'chk'},{id:'closed',l:'Closed Requisitions',t:'chk'},{id:'relonly',l:'Released Reqs Only',t:'chk'}]}],
 def:{assig:true},expect:{ekgrp:'P05',werks:'1100',closed:{eq:true,idn:'Centang Closed Requisitions supaya PR yang sudah jadi PO ikut tampil.'},relonly:{eq:false,idn:'Jangan centang Released Reqs Only, nanti PR yang belum di-approve tidak tampil.'}},hints:{ekgrp:'Project & Engineering',closed:'Centang'}},
 {title:'List Display of Purchase Requisitions',blocks:[{t:'alv',key:'pr',data:ALV_ME5A}]}]},
{k:'q',instr:'PR mana yang masih menunggu approval? (Tip: pilih kolom Release status lalu Sort.)',o:['10004587 dan 10004583','10004550 saja','Semua sudah di-approve','10004561 dan 10004579'],a:0,e:'Dua PR berstatus Not released dan belum punya nomor PO.'},
{k:'q',instr:'PR bearing 10004587 dibutuhkan 12.11.2026 tapi belum di-approve. Tindakan terbaik?',o:['Follow up approver dengan nomor PR dan alasan urgensinya, sambil kabari Procurement','Buat PR baru','Tunggu saja','Minta vendor kirim tanpa PO'],a:0,e:'Nomor PR + alasan urgensi mempercepat approval. Tanpa release, Procurement tidak bisa membuat PO.'}
]},
{id:'s13',title:'Service entry jasa commissioning (ML81N)',mod:3,lvl:'Lanjut',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Commissioning conveyor oleh PT Duta Konveyor sudah selesai. BAST nomor BAST/26/1104 sudah ditandatangani hari ini. Tolong buatkan service entry sheet untuk PO jasanya supaya vendor bisa ditagih.'},
attach:{t:'sj',title:'BAST/26/1104',rows:[['No. BAST','BAST/26/1104'],['Tanggal','04.11.2026'],['Ref. PO','4500021915'],['Pekerjaan','Commissioning conveyor Line 3'],['Progres','100% (1 AU)'],['Ditandatangani','Hendra (Project Supervisor)']]},
steps:[
{k:'tx',tc:'ML81N',instr:'Buka ML81N. Klik Other Purchase Order, pilih PO jasa, lalu buat entry sheet: isi Short Text, External Number (nomor BAST), qty jasa, centang Accept, lalu Save.',
screens:[
{title:'Service Entry Sheet for PO 4500021880',go:null,blocks:[{t:'note',html:'<p>ML81N membuka PO terakhir yang kamu pakai. Gunakan <b>Other Purchase Order</b> untuk memilih PO jasa yang benar.</p>'}],
 tbx:[{l:'Other Purchase Order',k:'otherpo'}],popups:{otherpo:{title:'Select Purchase Order',fields:[{id:'m.po',l:'Purchase Order',w:12,f4:'ebeln'}],expect:{'m.po':{eq:'4500021915',idn:'Pilih PO jasa commissioning dari PT Duta Konveyor (lihat BAST).'}},next:true}},expect:{}},
{title:'Create Entry Sheet: PO 4500021915 / 10',go:'save',def:{bldat:TODAY,'sv.0.qty':''},blocks:[
  {t:'kv',rows:[['Purchase Order','4500021915 / 10'],['Vendor','100140 PT Duta Konveyor'],['Item text','Jasa commissioning conveyor L3'],['WBS Element','P-26-014.03'],['Value limit','16.000.000 IDR']]},
  {t:'group',title:'Entry sheet header',fields:[{id:'ktext',l:'Short Text',w:30},{id:'lblne',l:'External Number',w:16},{id:'bldat',l:'Document Date',w:10},{id:'lzvon',l:'Period',w:10,to:1}]},
  {t:'items',key:'sv',title:'Services',rows:1,cols:[{id:'ln',l:'Line',ro:1,v:()=>'10'},{id:'srv',l:'Service No.',ro:1,v:()=>'3000045'},{id:'txt',l:'Short Text',ro:1,v:()=>'COMMISSIONING CONVEYOR LINE 3'},{id:'qty',l:'Quantity',w:6},{id:'un',l:'Un',ro:1,v:()=>'AU'},{id:'pr',l:'Gross Price',ro:1,v:()=>'16.000.000'}]},
  {t:'group',title:'Acceptance',fields:[{id:'accept',l:'Accept data (flag hijau)',t:'chk'}]}],
 expect:{ktext:NONEMPTY('Isi Short Text, misalnya "Commissioning conveyor L3".'),lblne:{eq:'BAST/26/1104',idn:'Isi nomor BAST di External Number sebagai bukti pekerjaan.'},'sv.0.qty':{eq:'1',idn:'Progres 100% = 1 AU sesuai BAST.'},accept:{eq:true,sap:'Entry sheet not accepted',idn:'Centang Accept agar entry sheet diterima dan bisa ditagih. Di beberapa perusahaan acceptance dilakukan atasan.'}},
 hints:{ktext:'Bebas, jelaskan pekerjaannya',lblne:'Nomor BAST','sv.0.qty':'1',accept:'Centang'},ok:'Entry sheet 1000034561 saved (accepted)'}]},
{k:'q',instr:'Setelah SES diterima, apa yang terjadi berikutnya?',o:['Finance memposting invoice di MIRO dan mencocokkannya dengan SES','Gudang melakukan MIGO 101','Kamu membuat PO baru','Tidak ada'],a:0,e:'SES berfungsi seperti GR untuk jasa. Invoice dicocokkan dengan SES (3-way match).'},
{k:'q',instr:'Biaya 16 jt di CJI5 (komitmen) sekarang pindah ke mana?',o:['Menjadi actual di CJI3 pada WBS P-26-014.03','Tetap di CJI5 sampai bayar','Masuk cost center','Hilang'],a:0,e:'Saat SES diterima, komitmen berubah menjadi biaya aktual di WBS.'}
]},
{id:'s10',title:'Lacak & koreksi GI yang salah',mod:4,lvl:'Lanjut',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Roller conveyor (300031150) 6 pcs yang dipasang kemarin kok tidak muncul di biaya proyek? Tolong cek dan perbaiki. Periode posting November masih terbuka.'},
steps:[
{k:'tx',tc:'MB51',instr:'Buka MB51, cari pergerakan material roller di Pabrik Cikarang, lalu Execute.',
screens:[{title:'Material Document List',sel:1,go:'exec',blocks:[
  {t:'group',title:'Item Data',fields:[{id:'matnr',l:'Material',w:11,f4:'matnr',to:1},{id:'werks',l:'Plant',w:5,f4:'werks',to:1},{id:'lgort',l:'Storage Location',w:5,f4:'lgort',to:1},{id:'bwart',l:'Movement Type',w:4,f4:'bwart',to:1}]},
  {t:'group',title:'Header Data',fields:[{id:'budat',l:'Posting Date',w:10,to:1},{id:'usnam',l:'User Name',w:10}]}],
 expect:{matnr:'300031150',werks:'1100'},hints:{matnr:'F4 → "roller"'}},
 {title:'Material Document List',blocks:[{t:'alv',key:'mb51',data:ALV_MB51}]}]},
{k:'q',instr:'Dokumen mana yang menyebabkan biaya tidak masuk proyek?',o:['4900061498 – mvt 201 ke cost center 11PRD310','5000187001 – mvt 101','4900061210 – mvt 221 ke WBS','Tidak ada yang salah'],a:0,e:'Roller proyek dikeluarkan dengan 201 ke cost center produksi, sehingga tidak muncul di CJI3.'},
{k:'tx',tc:'MIGO',instr:'Batalkan dokumen 4900061498: MIGO → A03 Cancellation + R02 Material Document, isi nomor dokumen, Enter. Tulis alasan di HeaderText, Item OK, Check, Post.',
screens:[migoScreen({def:{act:'A03',ref:'R02',bwart:''},
 onEnter:v=>{if(v.ref!=='R02')return null;if(!v.mblnr)return {msg:['E','Enter a material document number'],explain:'Isi nomor material document yang mau dibatalkan.'};if(norm(v.mblnr)!=='4900061498')return {msg:['E',`Material document ${v.mblnr} cannot be cancelled in this scenario`],explain:'Batalkan dokumen yang salah: 4900061498.'};
  if(v['it.0.txt'])return null;return {fill:{bwart:'202','it.0.mat':'300031150','it.0.txt':'ROLLER CONVEYOR D89X500','it.0.qty':'6','it.0.un':'PC','it.0.lgort':'1101','it.0.werks':'1100','it.0.stock':'Unrestricted use','it.0.kostl':'11PRD310'},msg:['I','Data adopted from material document 4900061498'],explain:'SAP mengisi item dari dokumen asli dan memakai movement 202 (pembalik 201).'};},
 expect:{act:{eq:'A03',idn:'Pembatalan = A03 Cancellation.'},ref:{eq:'R02',idn:'Referensinya dokumen material = R02.'},mblnr:'4900061498','it.0.txt':NEED_ENTER('nomor dokumen'),bktxt:NONEMPTY('Tulis alasan pembatalan di HeaderText, misalnya "Salah mvt 201, repost 221".'),'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 hints:{mblnr:'Dari MB51',bktxt:'Tab General → HeaderText'},ok:'Material document 4900061533 posted (mvt 202)'})]},
{k:'tx',tc:'MIGO',instr:'Posting ulang dengan benar: A07 Goods Issue + R10 Other, movement 221, material roller 6 PC dari Gudang Sparepart Cikarang ke WBS material mekanikal.',
screens:[migoScreen({onEnter:migoMatEnter(),
 expect:{act:'A07',ref:'R10',bwart:{eq:'221',idn:'Proyek → 221.'},'it.0.mat':'300031150','it.0.txt':NEED_ENTER('material'),'it.0.qty':'6','it.0.werks':'1100','it.0.lgort':'1101','it.0.wbs':{eq:'P-26-014.02',sap:'Enter WBS element',idn:'Tab Account Assignment → WBS material mekanikal.'},'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 hints:{bwart:'221','it.0.wbs':'Tab Account Assignment'},ok:'Material document 4900061534 posted'})]},
{k:'q',instr:'Apa yang wajib kamu catat setelah koreksi ini?',o:['Nomor dokumen salah, pembalik (4900061533), dan posting ulang (4900061534) beserta alasannya, lalu kabari supervisor/Finance','Cukup nomor terakhir','Tidak perlu dicatat','Hanya kabari vendor'],a:0,e:'Jejak koreksi lengkap memudahkan audit dan rekonsiliasi biaya.'}
]},
{id:'s11',title:'Transfer stok ke Gudang Proyek (MIGO 311)',mod:4,lvl:'Menengah',
brief:{from:'Pak Joko, Gudang',msg:'Supervisor minta 20 M kabel NYY 4x16 dipindah dari Gudang Sparepart ke Gudang Proyek supaya dekat area kerja Line 3. Barang fisik sudah dipindah, tolong posting di SAP.'},
steps:[
{k:'tx',tc:'MIGO',instr:'Pilih A08 Transfer Posting + R10 Other. Periksa movement type, isi material, qty, plant, sloc asal, dan sloc tujuan (Receiving). Enter, Item OK, Check, Post.',
screens:[migoScreen({onEnter:migoMatEnter(),
 expect:{act:{eq:'A08',idn:'Pindah lokasi = A08 Transfer Posting.'},ref:'R10',bwart:{eq:'311',idn:'Transfer antar sloc dalam satu plant = 311.'},'it.0.mat':'300022105','it.0.txt':NEED_ENTER('material'),'it.0.qty':'20','it.0.werks':'1100','it.0.lgort':{eq:'1101',idn:'Sloc asal = Gudang Sparepart 1101.'},'it.0.umlgo':{eq:'1102',idn:'Sloc tujuan (Receiving) = Gudang Proyek 1102. Ada di kolom Recv. SLoc atau tab Where.'},'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 hints:{'it.0.mat':'F4 → "kabel"','it.0.umlgo':'Tab Where'},ok:'Material document 4900061540 posted'})]},
{k:'q',instr:'Apakah transfer 311 ini menambah biaya proyek di CJI3?',o:['Tidak. 311 hanya memindahkan lokasi stok; biaya proyek muncul saat GI 221 (atau GR dengan account assignment P)','Ya, langsung masuk WBS','Ya, masuk cost center','Masuk AuC'],a:0,e:'Transfer posting tidak mengubah objek biaya. Stok tetap stok sampai dikeluarkan.'}
]},
{id:'s14',title:'Laporan stok Gudang Proyek (MB52)',mod:5,lvl:'Dasar',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Untuk rapat mingguan, tolong kirim daftar stok material di Gudang Proyek (1102) Cikarang dalam Excel. Tandai juga kalau ada barang yang diblokir.'},
steps:[
{k:'tx',tc:'MB52',instr:'Buka MB52, isi Plant dan Storage Location, Execute. Di ALV, export ke spreadsheet.',
screens:[{title:'Display Warehouse Stocks of Material',sel:1,go:'exec',blocks:[
  {t:'group',title:'Database Selections',fields:[{id:'matnr',l:'Material',w:11,to:1,f4:'matnr'},{id:'werks',l:'Plant',w:5,to:1,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,to:1,f4:'lgort'}]},
  {t:'group',title:'Display Options',fields:[{id:'nozero',l:'No zero stock lines',t:'chk'},{id:'withval',l:'Display Values',t:'chk'}]}],
 def:{withval:true},expect:{werks:'1100',lgort:{eq:'1102',idn:'Brief minta Gudang Proyek = 1102.'}},hints:{lgort:'Gudang Proyek'}},
 {title:'Display Warehouse Stocks of Material',goal:s=>!!(s.alv.stk||{}).exported,goalMsg:'Laporan diexport ke spreadsheet',blocks:[{t:'alv',key:'stk',data:ALV_MB52}]}]},
{k:'q',instr:'Material apa yang berstatus Blocked, dan apa tindak lanjutnya?',o:['Motor gearbox 3KW (1 PC): koordinasi QA/gudang, cek kerusakan dan klaim ke vendor','Kabel NYY: pakai saja','Baut M12: buang','Tidak ada yang blocked'],a:0,e:'Blocked stock tidak bisa dipakai. Cari penyebabnya dan putuskan klaim/retur bersama QA dan Procurement.'},
{k:'q',instr:'Pakai Σ di kolom Value Unrestricted. Berapa total nilai stok bebas di Gudang Proyek?',o:['Rp 18.650.000','Rp 11.000.000','Rp 20.000.000','Rp 4.500.000'],a:0,e:'11.000.000 + 1.800.000 + 4.500.000 + 0 + 1.350.000 = 18.650.000.'}
]},
{id:'s15',title:'Cari lokasi stok material (MMBE)',mod:5,lvl:'Dasar',
brief:{from:'Teknisi proyek (lewat Pak Hendra)',msg:'Butuh 6 pcs coupling motor FCL-140 sekarang. Gudang Sparepart bilang kosong. Tolong cek di SAP ada di mana saja.'},
steps:[
{k:'tx',tc:'MMBE',instr:'Buka MMBE, isi material (F4), lalu Execute.',
screens:[{title:'Stock Overview: Company Code/Plant/Storage Location/Batch',sel:1,go:'exec',blocks:[{t:'group',title:'Database Selections',fields:[{id:'matnr',l:'Material',w:11,f4:'matnr'},{id:'werks',l:'Plant',w:5,f4:'werks',to:1},{id:'lgort',l:'Storage Location',w:5,f4:'lgort',to:1}]}],expect:{matnr:'300015577'},hints:{matnr:'F4 → "coupling"'}},
 {title:'Stock Overview: Basic List',blocks:[{t:'kv',rows:[['Material','300015577 COUPLING MOTOR FCL-140'],['Base Unit','PC']]},
  {t:'table',title:'Stock overview',h:['Client/Company Code/Plant/Storage Location','Unrestricted use','Qual. inspection','Blocked','On-Order Stock'],r:[['▾ Full','12','3','0','10'],['  ▾ 1000 PT JACIWEY Indonesia','12','3','0','10'],['    ▾ 1100 Pabrik Cikarang','6','3','0','10'],['        1101 Gudang Sparepart','0','3','0',''],['        1102 Gudang Proyek','6','0','0',''],['    ▾ 1200 Pabrik Surabaya','6','0','0','0'],['        1201 Gudang Sparepart SBY','6','0','0','']]}]}]},
{k:'q',instr:'Dari mana 6 pcs bisa diambil paling cepat?',o:['Gudang Proyek 1102 Cikarang (6 PC unrestricted): GI langsung dari 1102','Gudang Sparepart 1101 (3 PC quality inspection)','Surabaya, karena lebih banyak','Tunggu on-order 10 PC'],a:0,e:'Stok unrestricted di plant yang sama paling cepat. Stok quality inspection belum boleh dipakai.'},
{k:'q',instr:'Apa arti 3 PC di kolom Qual. inspection di Gudang Sparepart?',o:['Barang sudah diterima tapi masih menunggu keputusan QC, belum boleh dipakai','Barang rusak permanen','Barang dipesan','Barang milik vendor'],a:0,e:'QI stock harus di-release QA (usage decision) dulu sebelum menjadi unrestricted.'}
]},
{id:'s16',title:'Verifikasi data aset (AS03)',mod:6,lvl:'Menengah',
brief:{from:'Bu Ratna, Finance (persiapan audit aset)',msg:'Saat cek fisik, Conveyor Line 1 dengan tag aset 1200345 ternyata sudah dipindah ke Line 2 sejak Agustus. Tolong cek data aset di SAP (company code 1000) dan siapkan apa yang perlu dikoreksi.'},
steps:[
{k:'tx',tc:'AS03',instr:'Buka AS03, isi Asset, Sub-number, Company Code, Enter. Periksa tab General, Time-dependent, dan Deprec. Areas.',
screens:[{title:'Display Asset: Initial screen',go:'enter',blocks:[{t:'group',title:'',fields:[{id:'anln1',l:'Asset',w:10,f4:'anln1'},{id:'anln2',l:'Sub-number',w:4},{id:'bukrs',l:'Company Code',w:5,f4:'bukrs'}]}],def:{anln2:'0',bukrs:'1000'},expect:{anln1:'1200345',anln2:'0',bukrs:'1000'}},
 {title:'Display Asset: Master data',goal:s=>s.tabs.as===1,goalMsg:'Tab Time-dependent diperiksa',blocks:[{t:'kv',rows:[['Asset','1200345-0  Conveyor Line 1'],['Class','3100 Machinery']]},
  {t:'tabs',key:'as',tabs:[
   {l:'General',fields:[{id:'g1',l:'Description',t:'ro',v:'CONVEYOR LINE 1 – PACKING'},{id:'g2',l:'Inventory Number',t:'ro',v:'TAG-1200345'},{id:'g3',l:'Capitalized on',t:'ro',v:'15.03.2019'},{id:'g4',l:'Last inventory on',t:'ro',v:'12.11.2025'}]},
   {l:'Time-dependent',fields:[{id:'t1',l:'Cost Center',t:'ro',v:'11PRD300 Produksi Line 1'},{id:'t2',l:'Plant',t:'ro',v:'1100'},{id:'t3',l:'Location',t:'ro',v:'L1-PACK'},{id:'t4',l:'Valid from',t:'ro',v:'15.03.2019'}]},
   {l:'Deprec. Areas',table:{h:['Area','Description','DKey','UseLife','ODep Start'],r:[['01','Book depreciation','LINS','10','01.03.2019'],['15','Tax depreciation','LINS','8','01.03.2019']]}}]}]}]},
{k:'q',instr:'Data mana yang tidak sesuai kondisi fisik?',o:['Cost center 11PRD300 dan Location L1-PACK di tab Time-dependent (mesin sudah di Line 2)','Capitalized on','Use life','Inventory number'],a:0,e:'Pemindahan mesin mengubah cost center pemakai dan lokasi, sehingga penyusutan sejak Agustus terbebankan ke line yang salah.'},
{k:'q',instr:'Tindakan yang sesuai batas peranmu?',o:['Siapkan berita acara pemindahan + foto + tanggal pindah, kirim ke Finance untuk koreksi data aset (cost center/lokasi)','Ubah sendiri di AS02','Abaikan karena masih satu plant','Ganti tag aset'],a:0,e:'Perubahan master aset dilakukan Finance. Kamu menyiapkan bukti dan tanggal efektifnya.'}
]},
{id:'s17',title:'Lacak biaya salah masuk cost center (KSB1)',mod:7,lvl:'Lanjut',
brief:{from:'Controller produksi (via Bu Ratna)',msg:'Biaya cost center Produksi Line 3 (11PRD310) minggu ini naik sekitar Rp 14 juta. Tolong cek apakah ada material proyek conveyor yang salah dibebankan ke cost center.'},
steps:[
{k:'tx',tc:'KSB1',instr:'Buka KSB1, isi Cost Center dan Posting Date mulai 01.11.2026, Execute. Di ALV, coba Σ dan filter kolom MvT.',
screens:[{title:'Display Actual Cost Line Items for Cost Centers: Initial Screen',sel:1,go:'exec',def:{kokrs:'1000'},blocks:[
  {t:'group',title:'Cost Center',fields:[{id:'kostl',l:'Cost Center',w:10,f4:'kostl',to:1},{id:'kstar',l:'Cost Element',w:8,to:1}]},
  {t:'group',title:'Posting Data',fields:[{id:'budat',l:'Posting Date',w:10,to:1}]},
  {t:'group',title:'Settings',fields:[{id:'kokrs',l:'Controlling Area',w:5},{id:'layout',l:'Layout',w:12}]}],
 expect:{kostl:{eq:'11PRD310',idn:'Cost center Produksi Line 3 = 11PRD310 (F4).'},budat:{fn:v=>dParse(v)&&norm(v)==='01.11.2026'?null:{sap:'Check entry in field Posting Date',idn:'Mulai tanggal 01.11.2026 (format DD.MM.YYYY).'}}},hints:{kostl:'F4 → Line 3',budat:'01.11.2026'}},
 {title:'Display Actual Cost Line Items for Cost Centers',blocks:[{t:'alv',key:'ksb',data:ALV_KSB1}]}]},
{k:'q',instr:'Baris mana yang kemungkinan material proyek salah dibebankan ke cost center?',o:['4900061498 (roller x6) dan 4900061512 (kabel 12 M), keduanya mvt 201','Grease EP2','Jasa perbaikan gearbox','Semua baris'],a:0,e:'Roller dan kabel NYY adalah material proyek conveyor, seharusnya 221 ke WBS. Grease dan jasa perbaikan memang biaya rutin.'},
{k:'q',instr:'Langkah koreksi yang benar?',o:['Cancel kedua dokumen di MIGO (A03 + R02) lalu posting ulang 221 ke WBS yang sesuai, koordinasi dengan Finance','Minta controller mengabaikan','Ubah angka di KSB1','Buat PR baru'],a:0,e:'Sama seperti skenario "Lacak & koreksi GI yang salah": batalkan, posting ulang, catat jejaknya.'}
]},
{id:'s18',title:'Cek work order maintenance (IW38)',mod:8,lvl:'Dasar',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Vendor proyek akan bekerja di Conveyor Line 3 tanggal 09–13.11.2026. Tolong cek work order maintenance yang masih open di equipment itu supaya jadwal tidak bentrok.'},
steps:[
{k:'tx',tc:'IW38',instr:'Buka IW38, centang status Outstanding dan In process, isi Planning Plant dan Equipment conveyor Line 3, Execute.',
screens:[{title:'Change PM Orders: Selection of Orders',sel:1,go:'exec',def:{outst:true,inproc:true},blocks:[
  {t:'group',title:'Order Status',fields:[{id:'outst',l:'Outstanding',t:'chk'},{id:'inproc',l:'In process',t:'chk'},{id:'compl',l:'Completed',t:'chk'},{id:'hist',l:'Historical',t:'chk'}]},
  {t:'group',title:'Selection',fields:[{id:'auart',l:'Order Type',w:5,to:1},{id:'iwerk',l:'Planning Plant',w:5,f4:'werks'},{id:'equnr',l:'Equipment',w:10,f4:'equnr',to:1},{id:'gstrp',l:'Basic start',w:10,to:1}]}],
 expect:{outst:true,inproc:true,iwerk:'1100',equnr:{eq:'10004521',idn:'Equipment Conveyor Line 3 = 10004521 (F4).'}},hints:{equnr:'F4 → Conveyor Line 3'}},
 {title:'Change PM Orders: List of Orders',blocks:[{t:'alv',key:'pm',data:ALV_IW38}]}]},
{k:'q',instr:'Order mana yang jadwalnya bentrok dengan pekerjaan vendor 09–13.11.2026?',o:['4000131 (10.11) dan 4000135 (12.11)','4000123 saja','4000098','Tidak ada'],a:0,e:'Basic start 10.11 dan 12.11 berada di rentang kerja vendor. 4000098 sudah TECO (selesai secara teknis).'},
{k:'q',instr:'Tindak lanjut yang tepat?',o:['Koordinasi dengan maintenance planner untuk geser jadwal atau gabungkan pekerjaan, lalu atur izin kerja dan isolasi energi bersama','Batalkan order maintenance sendiri','Biarkan dua tim bekerja bersamaan tanpa koordinasi','Minta vendor menunda tanpa alasan'],a:0,e:'Koordinasi jadwal mencegah bentrok dan risiko K3 di area produksi.'}
]},
{id:'s19',title:'Satu hari kerja: GR PO proyek & cek biaya',mod:8,lvl:'Lanjut',
brief:{from:'Ujian praktik (disarankan Mode ujian)',msg:'PT Duta Konveyor mengirim belt conveyor EP400 (1 PC) untuk PO 4500021902 dengan surat jalan SJ-DK/0458. Barang langsung ditaruh di Gudang Proyek. Posting GR-nya, lalu cek dampaknya ke biaya proyek P-26-014.'},
attach:{t:'sj',title:'Surat Jalan SJ-DK/0458',rows:[['No. SJ','SJ-DK/0458'],['Tanggal','04.11.2026'],['Ref. PO','4500021902'],['Barang','BELT CONVEYOR EP400'],['Qty kirim','1 PC']]},
steps:[
{k:'tx',tc:'MIGO',instr:'Posting goods receipt untuk PO di surat jalan. Perhatikan tab Account Assignment setelah Enter.',
screens:[migoScreen({
 onEnter:v=>{if(v.ref!=='R01')return null;if(!v.po)return {msg:['E','Enter a purchase order number'],explain:'Isi nomor PO.'};
  if(norm(v.po)!=='4500021902')return {msg:['E',`Purchase order ${v.po}: no open items for goods receipt in this simulation`],explain:'Cek nomor PO di surat jalan.'};
  if(v['it.0.txt'])return null;
  return {fill:{_acctP:true,'it.0.mat':'300045001','it.0.txt':'BELT CONVEYOR EP400','it.0.qty':'1','it.0.poqty':'1 PC','it.0.un':'PC','it.0.lgort':'','it.0.werks':'1100','it.0.stock':'– (consumption, acct. assignment P)','it.0.po':'4500021902 / 10','it.0.vendor':'100140 PT Duta Konveyor','it.0.wbs_po':'P-26-014.02'},msg:['I','Item data adopted from purchase order 4500021902'],explain:'PO ini punya account assignment P. Lihat tab Account Assignment: WBS terbawa dari PO.'};},
 expect:{act:'A01',ref:'R01',po:'4500021902',bwart:'101','it.0.txt':NEED_ENTER('nomor PO'),lfsnr:'SJ-DK/0458','it.0.qty':'1','it.0.lgort':{eq:'1102',idn:'Barang ditaruh di Gudang Proyek 1102 (unloading).'},'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 ok:'Material document 5000187360 posted'})]},
{k:'q',instr:'PO ini memakai account assignment P. Setelah GR, apa yang terjadi?',o:['Biaya langsung jadi actual di WBS P-26-014.02; tidak perlu GI 221','Barang masuk stok, biaya muncul saat GI 221','Biaya masuk cost center','Belum ada biaya sampai invoice'],a:0,e:'GR untuk PO ber-account assignment langsung membebankan biaya ke objeknya (WBS).'},
{k:'tx',tc:'CJI3',instr:'Buka CJI3 untuk proyek P-26-014. Hitung total actual dengan Σ.',
popup:{once:'dbprof',title:'Database Profile',fields:[{id:'m.prof',l:'Database prof.',w:14,f4:'dbprof'}],expect:{'m.prof':{eq:'000000000001',idn:'Pakai profil standar 000000000001 (F4).'}}},
screens:[{title:'Display Actual Cost Line Items for Projects',sel:1,go:'exec',blocks:selCJI(),expect:{pspid:'P-26-014'}},
 {title:'Display Actual Cost Line Items for Projects',goal:s=>(s.alv.act2||{}).sum==='val',goalMsg:'Total dihitung dengan Σ',blocks:[{t:'alv',key:'act2',data:ALV_CJI3_AFTER}]}]},
{k:'q',instr:'Total actual sekarang Rp 758 jt. Komitmen PO belt (148 jt) sudah tidak di CJI5. Berapa sisa budget bebas (budget 850 jt, komitmen sebelumnya 230 jt)?',o:['Tetap Rp 10 jt: komitmen berpindah menjadi actual','Rp 92 jt','Rp 158 jt','Minus Rp 138 jt'],a:0,e:'850 − 758 − (230 − 148 = 82) = 10 jt. GR tidak mengubah sisa budget, hanya memindahkan komitmen menjadi actual.'}
]}
);
/* ===================== MORE SCENARIOS (batch 3) ===================== */
Object.assign(MAT,{
'300045002':{d:'BELT FOOD GRADE PU 2MM',u:'M',mg:'4130',p:1250000,pg:'P05'},
'300050310':{d:'BAUT M12X40 SS',u:'PC',mg:'4150',p:9000,pg:'P03'}
});
F4.matnr=Object.entries(MAT).map(([k,v])=>[k,v.d]);
F4.ebeln.push(['4500021925','PT Food Belt Indonesia'],['4500021790','PT Roller Jaya']);
F4.aufnr=[['700000231','Improvement Line 2 – guarding'],['700000245','Improvement Line 1 – dust collector']];
F4.banfn=[['10004587','BEARING SKF 6205-2RS'],['10004583','PLAT STAINLESS 316 2MM']];
F4.iblnr=[['100000357','Gudang Sparepart – coupling'],['100000358','Recount 100000357']];
F4.insmk=[['','Unrestricted use'],['2','Quality inspection'],['3','Blocked stock']];
KNOWN.MI11='Recount Physical Inventory Document';KNOWN.ME2M='Purchasing Documents per Material';KNOWN.KOB1='Display Actual Cost Line Items for Orders';
FAVS.push('ME52N','ME2M','MI11','KOB1');

const ALV_ME2M={cols:[{id:'po',l:'Purch.Doc.'},{id:'it',l:'Item'},{id:'bd',l:'Doc. Date',date:1},{id:'vend',l:'Vendor/supplying plant'},{id:'qty',l:'PO Quantity',num:1},{id:'oun',l:'OUn'},{id:'np',l:'Net Price (IDR)',num:1},{id:'open',l:'Still to be delivered (qty)',num:1}],
rows:[{po:'4500020911',it:'10',bd:'12.03.2026',vend:'PT Mitra Teknik Abadi',qty:20,oun:'PC',np:178000,open:0},{po:'4500021345',it:'10',bd:'06.06.2026',vend:'CV Bearindo Sejahtera',qty:10,oun:'PC',np:172500,open:0},{po:'4500021612',it:'20',bd:'14.08.2026',vend:'PT Mitra Teknik Abadi',qty:6,oun:'PC',np:181000,open:0},{po:'4500021873',it:'10',bd:'21.10.2026',vend:'PT Mitra Teknik Abadi',qty:10,oun:'PC',np:185000,open:10}]};
const ALV_MB51W={cols:[{id:'doc',l:'Mat. Doc.'},{id:'pd',l:'Pstng Date',date:1},{id:'mvt',l:'MvT'},{id:'mat',l:'Material'},{id:'txt',l:'Material Description'},{id:'sl',l:'SLoc'},{id:'qty',l:'Quantity',num:1},{id:'bun',l:'BUn'},{id:'obj',l:'WBS Element'},{id:'val',l:'Amount (IDR)',num:1}],
rows:[{doc:'4900061505',pd:'02.11.2026',mvt:'221',mat:'300050310',txt:'BAUT M12X40 SS',sl:'1102',qty:-40,bun:'PC',obj:'P-26-014.02',val:360000},
{doc:'4900061520',pd:'04.11.2026',mvt:'221',mat:'300012457',txt:'BEARING SKF 6205-2RS',sl:'1101',qty:-4,bun:'PC',obj:'P-26-014.02',val:740000},
{doc:'4900061525',pd:'04.11.2026',mvt:'221',mat:'300022105',txt:'KABEL NYY 4X16',sl:'1102',qty:-30,bun:'M',obj:'P-26-014.04',val:16500000},
{doc:'4900061534',pd:'04.11.2026',mvt:'221',mat:'300031150',txt:'ROLLER CONVEYOR D89X500',sl:'1101',qty:-6,bun:'PC',obj:'P-26-014.02',val:2700000},
{doc:'4900061511',pd:'03.11.2026',mvt:'221',mat:'300015577',txt:'COUPLING MOTOR FCL-140',sl:'1102',qty:-2,bun:'PC',obj:'P-26-009.02',val:1500000}]};
const ALV_MI20B={cols:ALV_MI20.cols,rows:[{mat:'300015577',txt:'COUPLING MOTOR FCL-140',sl:'1101',book:6,cnt:5,diff:-1,bun:'PC',val:-750000}]};
const ALV_KOB1={cols:[{id:'pd',l:'Posting Date',date:1},{id:'ce',l:'Cost Elem.'},{id:'cen',l:'Cost element name'},{id:'val',l:'Val.in RC (IDR)',num:1},{id:'ref',l:'Ref Document'},{id:'txt',l:'Name / Text'}],
rows:[{pd:'15.09.2026',ce:'640100',cen:'Jasa engineering',val:8500000,ref:'5105600099',txt:'Desain guarding Line 2'},{pd:'02.10.2026',ce:'510100',cen:'Material proyek',val:21400000,ref:'5000186210',txt:'Plat & profil stainless'},{pd:'16.10.2026',ce:'640200',cen:'Jasa instalasi',val:32000000,ref:'1000034420',txt:'Fabrikasi & pasang guarding (SES)'},{pd:'28.10.2026',ce:'510100',cen:'Material proyek',val:6500000,ref:'4900061340',txt:'Baut, engsel, interlock switch'}]};

SIMS.push(
{id:'s20',title:'Login pertama & ganti password',mod:1,lvl:'Dasar',forceLogon:true,
brief:{from:'Email IT Helpdesk',msg:'Selamat bergabung! User SAP kamu sudah aktif. Client: 800 · User: ANDRE.P · Password awal: Init2026! · Bahasa: EN. Saat login pertama kamu wajib mengganti password (minimal 8 karakter, ada huruf dan angka). Jangan bagikan password ke siapa pun.'},
steps:[
{k:'logon',initPw:'Init2026!',instr:'Login dengan data dari email IT, lalu buat password baru di popup Change Password.'},
{k:'q',instr:'Rekan kerja minta pinjam user-mu karena user-nya terkunci. Apa yang kamu lakukan?',o:['Tolak; minta dia menghubungi IT untuk reset. Semua posting tercatat atas nama user','Pinjamkan sebentar','Kasih password lewat chat','Login-kan untuknya'],a:0,e:'User adalah identitas digital. Posting dengan user orang lain melanggar kontrol dan menyulitkan audit.'},
{k:'nav',tc:'ME23N',pre:null,instr:'Buka ME23N lewat SAP Menu: Logistics → Materials Management → Purchasing → Purchase Order → Display (double-click), atau ketik di command field.'},
{k:'act',instr:'Seseorang bertanya "kamu sedang di transaksi apa?". Cari tahu kode transaksi layar ini lewat menu System → Status.',goal:s=>s.flags.statusSeen==='ME23N'},
{k:'q',instr:'Kenapa System → Status berguna saat melapor masalah ke IT?',o:['Menampilkan client, user, dan kode transaksi yang sedang dipakai sehingga IT bisa melacak masalah','Untuk mengganti password','Untuk menghapus data','Untuk membuat PO'],a:0,e:'Lampirkan screenshot System → Status dan pesan error saat membuat tiket IT.'}
]},
{id:'s21',title:'Ubah PR sebelum approval (ME52N)',mod:3,lvl:'Menengah',
brief:{from:'Pak Hendra, Project Supervisor',msg:'PR bearing 10004587 belum di-approve. Ternyata butuhnya 12 pcs, dan tanggal bisa mundur ke 20.11.2026. Tolong ubah PR-nya dan tulis alasannya di item text.'},
steps:[
{k:'tx',tc:'ME52N',instr:'Buka ME52N, klik Other Purchase Requisition, pilih PR 10004587. Ubah Quantity dan Deliv. Date di item 10, tulis alasan di tab Texts, lalu Save.',
screens:[
{title:'Change Purchase Requisition 10004583',go:null,blocks:[{t:'note',html:'<p>ME52N membuka PR terakhir yang kamu lihat (10004583). Pakai <b>Other Purchase Requisition</b> (Shift+F5).</p>'}],tbx:[{l:'Other Purchase Requisition',k:'otherpr'}],popups:{otherpr:{title:'Select Document',fields:[{id:'m.pr',l:'Purchase Requisition',w:10,f4:'banfn'}],expect:{'m.pr':{eq:'10004587',idn:'PR bearing = 10004587.'}},next:true}},expect:{}},
{title:'Change Purchase Requisition 10004587',go:'save',checkOk:'No messages issued during check',
 def:{bsart:'NB','it.0.knttp':'P','it.0.mat':'300012457','it.0.txt':'BEARING SKF 6205-2RS','it.0.qty':'10','it.0.un':'PC','it.0.date':'12.11.2026','it.0.werks':'1100','it.0.lgort':'1101','it.0.ekgrp':'P05','it.0.wbs':'P-26-014.02','it.0.rel':'Not released'},
 blocks:[{t:'bar',fields:[{id:'bsart',l:'Document type',t:'sel',opts:[['NB','Purchase Requisition']]}]},
  {t:'items',key:'it',title:'Item Overview',rows:1,cols:[{id:'itm',l:'Itm',ro:1,v:()=>'10'},{id:'knttp',l:'A',ro:1},{id:'mat',l:'Material',ro:1},{id:'txt',l:'Short Text',ro:1},{id:'qty',l:'Quantity',w:6},{id:'un',l:'Un',ro:1},{id:'date',l:'Deliv. Date',w:10},{id:'werks',l:'Plant',ro:1},{id:'lgort',l:'SLoc',ro:1},{id:'ekgrp',l:'PGr',ro:1}]},
  {t:'tabs',key:'det',title:'Item  [ 10 ]  300012457  BEARING SKF 6205-2RS',tabs:[
   {l:'Quantities/Dates',fields:[{id:'it.0.qty',l:'Quantity',w:8},{id:'it.0.date',l:'Delivery date',w:10}]},
   {l:'Account Assignment',fields:[{id:'it.0.wbs',l:'WBS Element',t:'ro'}]},
   {l:'Texts',fields:[{id:'it.0.note',l:'Item text',w:34}]},
   {l:'Status',fields:[{id:'it.0.rel',l:'Release status',t:'ro'},{id:'z9',l:'Purchase order',t:'ro',v:'–'}]}]}],
 expect:{'it.0.qty':{eq:'12',idn:'Brief: kebutuhan jadi 12 pcs.'},'it.0.date':{eq:'20.11.2026',idn:'Tanggal baru 20.11.2026 (DD.MM.YYYY).'},'it.0.note':NONEMPTY('Tulis alasan perubahan di tab Texts → Item text, misalnya "Qty 10→12 & tgl mundur, req. Hendra".')},
 hints:{'it.0.note':'Tab Texts'},ok:'Purchase requisition 10004587 changed'}]},
{k:'q',instr:'Kalau PR sudah di-release dan sudah dijadikan PO, apakah kamu masih bisa mengubahnya di ME52N?',o:['Tidak. Perubahan dilakukan Procurement di PO (ME22N); PR yang sudah jadi PO terkunci','Ya, kapan saja','Ya, asal pakai /o','Harus buat PR baru dan hapus PO'],a:0,e:'Setelah jadi PO, dokumen yang mengikat vendor adalah PO. Perubahan qty/tanggal dikoordinasikan dengan Procurement.'},
{k:'q',instr:'Kenapa alasan perubahan perlu ditulis di item text?',o:['Supaya approver dan Procurement paham konteksnya dan ada jejak audit','Wajib agar SAP bisa save','Supaya harga turun','Tidak perlu'],a:0,e:'Item text memberi konteks dan jejak perubahan.'}
]},
{id:'s22',title:'Riwayat harga material (ME2M)',mod:3,lvl:'Dasar',
brief:{from:'Bu Sari, Procurement',msg:'Untuk negosiasi PO bearing berikutnya: bearing SKF 6205-2RS selama 2026 dibeli dari vendor mana saja dan berapa harga per pcs? Cek PO per material di Pabrik Cikarang.'},
steps:[
{k:'tx',tc:'ME2M',instr:'Buka ME2M, isi Material dan Plant, kosongkan Selection Parameters, Execute. Di ALV, sort kolom Net Price.',
screens:[{title:'Purchasing Documents per Material',sel:1,go:'exec',def:{listu:'BEST'},blocks:[
  {t:'group',title:'Material',fields:[{id:'matnr',l:'Material',w:11,f4:'matnr',to:1,multi:1},{id:'werks',l:'Plant',w:5,f4:'werks',to:1}]},
  {t:'group',title:'Program Data / Selection',fields:[{id:'listu',l:'Scope of List',w:8},{id:'selpa',l:'Selection Parameters',w:8,f4:'selpa'},{id:'bedat',l:'Document Date',w:10,to:1}]}],
 expect:{matnr:'300012457',werks:'1100',selpa:{eq:'',idn:'Kosongkan Selection Parameters agar PO yang sudah selesai juga tampil.'}},hints:{matnr:'F4 → 6205'}},
 {title:'Purchasing Documents per Material',blocks:[{t:'alv',key:'me2m',data:ALV_ME2M}]}]},
{k:'q',instr:'Vendor dengan harga per pcs terendah di 2026?',o:['CV Bearindo Sejahtera – Rp 172.500','PT Mitra Teknik Abadi – Rp 185.000','PT Mitra Teknik Abadi – Rp 178.000','Tidak ada data'],a:0,e:'Pilih kolom Net Price lalu Sort ascending: 172.500 dari CV Bearindo (PO 4500021345).'},
{k:'q',instr:'Harga PO terakhir naik 7% dibanding termurah. Informasi ini paling berguna untuk…',o:['Bahan negosiasi Procurement atau pertimbangan vendor alternatif','Mengubah PO sendiri','Membatalkan PR','Tidak berguna'],a:0,e:'Riwayat harga dari ME2M adalah data pendukung negosiasi. Keputusan vendor tetap di Procurement.'}
]},
{id:'s23',title:'GR ke stok Quality Inspection',mod:4,lvl:'Menengah',
brief:{from:'Bu Wulan, QA',msg:'Belt food grade dari PO 4500021925 (PT Food Belt Indonesia) akan kontak langsung dengan produk, jadi wajib diperiksa QA dulu. Barang datang 30 M dengan surat jalan SJ-FB/0771. Posting GR ke stok Quality inspection di Gudang Proyek.'},
attach:{t:'sj',title:'Surat Jalan SJ-FB/0771',rows:[['No. SJ','SJ-FB/0771'],['Ref. PO','4500021925'],['Barang','BELT FOOD GRADE PU 2MM'],['Qty kirim','30 M'],['Sertifikat','COA & food contact declaration terlampir']]},
steps:[
{k:'tx',tc:'MIGO',instr:'GR terhadap PO. Setelah Enter, ubah Stock type di tab Where menjadi Quality inspection, isi Delivery Note, Item OK, Check, Post.',
screens:[migoScreen({
 onEnter:v=>{if(v.ref!=='R01')return null;if(!v.po)return {msg:['E','Enter a purchase order number'],explain:'Isi nomor PO.'};if(norm(v.po)!=='4500021925')return {msg:['E',`Purchase order ${v.po}: no open items for goods receipt in this simulation`],explain:'Lihat surat jalan.'};if(v['it.0.txt'])return null;
  return {fill:{'it.0.mat':'300045002','it.0.txt':'BELT FOOD GRADE PU 2MM','it.0.qty':'30','it.0.poqty':'30 M','it.0.un':'M','it.0.lgort':'1102','it.0.werks':'1100','it.0.insmk':'','it.0.po':'4500021925 / 10','it.0.vendor':'100152 PT Food Belt Indonesia',_stockSel:true},msg:['I','Item data adopted from purchase order 4500021925']};},
 expect:{act:'A01',ref:'R01',po:'4500021925',bwart:'101','it.0.txt':NEED_ENTER('nomor PO'),lfsnr:'SJ-FB/0771','it.0.qty':'30','it.0.insmk':{eq:'2',sap:'Check entry in field Stock Type',idn:'QA minta barang masuk stok Quality inspection (2). Ada di tab Where → Stock type.'},'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 hints:{'it.0.insmk':'Tab Where → Stock type'},ok:'Material document 5000187375 posted'})]},
{k:'q',instr:'Teknisi minta belt itu dipasang besok pagi. Boleh langsung dikeluarkan?',o:['Belum. Tunggu QA memberi keputusan (release ke unrestricted, misalnya transfer 321). Stok QI tidak bisa di-GI','Boleh, pakai 221','Boleh, pakai 311','Boleh kalau supervisor setuju lisan'],a:0,e:'Stok Quality inspection tidak tersedia untuk dipakai sampai QA melepasnya.'}
]},
{id:'s24',title:'Vendor kirim lebih dari PO',mod:4,lvl:'Lanjut',
brief:{from:'Pak Joko, Gudang',msg:'Kabel NYY 4x16 dari CV Sinar Elektrik datang 130 M, surat jalan SJ-SE/2290 untuk PO 4500021880. Tolong posting GR-nya.'},
attach:{t:'sj',title:'Surat Jalan SJ-SE/2290',rows:[['No. SJ','SJ-SE/2290'],['Ref. PO','4500021880'],['Barang','KABEL NYY 4X16'],['Qty kirim','130 M']]},
steps:[
{k:'tx',tc:'MIGO',instr:'Posting GR terhadap PO. Perhatikan qty yang masih terbuka di PO dan pesan dari SAP jika qty melebihi PO. Tulis catatan di HeaderText.',
screens:[migoScreen({
 onEnter:v=>{if(v.ref!=='R01')return null;if(!v.po)return {msg:['E','Enter a purchase order number']};if(norm(v.po)!=='4500021880')return {msg:['E',`Purchase order ${v.po}: no open items for goods receipt in this simulation`]};if(v['it.0.txt'])return null;
  return {fill:{'it.0.mat':'300022105','it.0.txt':'KABEL NYY 4X16','it.0.qty':'120','it.0.poqty':'200 M (open 120 M)','it.0.un':'M','it.0.lgort':'1102','it.0.werks':'1100','it.0.stock':'Unrestricted use','it.0.po':'4500021880 / 10','it.0.vendor':'100125 CV Sinar Elektrik'},msg:['I','Item data adopted from purchase order 4500021880'],explain:'SAP mengusulkan qty yang masih terbuka: 120 M.'};},
 expect:{act:'A01',ref:'R01',po:'4500021880',bwart:'101','it.0.txt':NEED_ENTER('nomor PO'),lfsnr:'SJ-SE/2290',
  'it.0.qty':{fn:v=>{const n=+String(v).replace(',','.');if(n>120)return {sap:`PO quantity exceeded by ${n-120} M : 300022105 4500021880 00010`,idn:'Qty melebihi sisa PO (120 M) dan tidak ada toleransi over-delivery. Terima maksimal 120 M; kelebihan 10 M dikembalikan atau dikoordinasikan dengan Procurement.'};if(n!==120)return {sap:'Check entry in field Qty in Unit of Entry',idn:'Barang yang datang 130 M; terima sesuai sisa PO, yaitu 120 M.'};return null;}},
  bktxt:NONEMPTY('Tulis catatan di HeaderText, misalnya "Lebih kirim 10 M, retur ke vendor".'),'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 hints:{'it.0.qty':'Sisa PO',bktxt:'Tab General'},ok:'Material document 5000187380 posted'})]},
{k:'q',instr:'Apa yang dilakukan dengan kelebihan 10 M?',o:['Jangan diterima di SAP; buat catatan/berita acara, kabari Procurement untuk retur atau amendment PO','Simpan di gudang tanpa dokumen','Posting GR 10 M tanpa PO','Buang'],a:0,e:'Barang tanpa dasar PO tidak boleh masuk stok. Procurement memutuskan retur atau tambahan PO.'}
]},
{id:'s25',title:'Laporan pemakaian material mingguan (MB51)',mod:5,lvl:'Menengah',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Untuk laporan mingguan, saya butuh daftar material yang dikeluarkan ke proyek (movement 221) di Pabrik Cikarang periode 01.11.2026 s.d. 04.11.2026. Pisahkan juga yang masuk ke WBS elektrikal (.04).'},
steps:[
{k:'tx',tc:'MB51',instr:'Isi Plant, Movement Type 221, dan Posting Date dari–sampai, Execute. Lalu pakai Filter di kolom WBS Element untuk P-26-014.04.',
screens:[{title:'Material Document List',sel:1,go:'exec',blocks:[
  {t:'group',title:'Item Data',fields:[{id:'matnr',l:'Material',w:11,f4:'matnr',to:1},{id:'werks',l:'Plant',w:5,f4:'werks',to:1},{id:'lgort',l:'Storage Location',w:5,f4:'lgort',to:1},{id:'bwart',l:'Movement Type',w:4,f4:'bwart',to:1}]},
  {t:'group',title:'Header Data',fields:[{id:'budat',l:'Posting Date',w:10,to:1},{id:'usnam',l:'User Name',w:10}]}],
 expect:{werks:'1100',bwart:'221',budat:{eq:'01.11.2026',idn:'Mulai 01.11.2026.'},budat_to:{eq:'04.11.2026',idn:'Isi field "to" di sebelah Posting Date: 04.11.2026.'}},hints:{bwart:'221',budat_to:'Field kedua (to)'}},
 {title:'Material Document List',goal:s=>!!((s.alv.mb51w||{}).flt),goalMsg:'Filter diterapkan',blocks:[{t:'alv',key:'mb51w',data:ALV_MB51W}]}]},
{k:'q',instr:'Dengan filter P-26-014.04, material apa yang keluar ke WBS elektrikal?',o:['Kabel NYY 4x16, 30 M (Rp 16,5 jt)','Bearing 4 PC','Roller 6 PC','Coupling 2 PC'],a:0,e:'Hanya dokumen 4900061525 yang ke P-26-014.04.'},
{k:'q',instr:'Ada satu baris ke WBS P-26-009.02 (proyek renovasi mixing). Apa artinya untuk laporan proyek conveyor?',o:['Tidak dihitung di proyek conveyor; pastikan memang untuk proyek mixing, kalau salah WBS segera koreksi','Masukkan ke conveyor juga','Hapus barisnya','Tidak penting'],a:0,e:'Laporan per proyek harus memakai WBS yang benar. Konfirmasi ke PIC jika ragu.'}
]},
{id:'s26',title:'Recount opname (MI11 → MI04 → MI20)',mod:5,lvl:'Lanjut',
brief:{from:'Bu Ratna, Finance',msg:'Dokumen opname 100000357 (coupling motor di Gudang Sparepart) selisih -3 PC. Sebelum posting, lakukan recount: buat dokumen recount, input hasil hitung ulang, lalu cek daftar selisih lagi.'},
steps:[
{k:'tx',tc:'MI11',instr:'Buka MI11, masukkan dokumen 100000357, Enter, tandai item 001 untuk recount, lalu Save.',
screens:[
{title:'Recount Physical Inventory Document: Initial Screen',go:'enter',def:{gjahr:'2026',bldat:TODAY},blocks:[{t:'group',title:'',fields:[{id:'iblnr',l:'Phys. Inventory Doc.',w:12,f4:'iblnr'},{id:'gjahr',l:'Fiscal Year',w:5},{id:'bldat',l:'Recount Date',w:10}]}],expect:{iblnr:'100000357'}},
{title:'Recount Physical Inventory Document 100000357: Overview',go:'save',blocks:[{t:'items',key:'rc',title:'Items',rows:1,cols:[{id:'sel',l:'Recount',t:'chk'},{id:'itm',l:'Item',ro:1,v:()=>'001'},{id:'mat',l:'Material',ro:1,v:()=>'300015577'},{id:'txt',l:'Material Description',ro:1,v:()=>'COUPLING MOTOR FCL-140'},{id:'cnt',l:'Counted',ro:1,v:()=>'3'},{id:'un',l:'BUn',ro:1,v:()=>'PC'}]}],
 expect:{'rc.0.sel':{eq:true,sap:'Select at least one item',idn:'Centang kolom Recount di item 001.'}},ok:'Recount document 100000358 created'}]},
{k:'tx',tc:'MI04',attach:{t:'sheet',title:'Lembar hitung ulang – dok. 100000358',rows:[['001','300015577 COUPLING MOTOR FCL-140','5 PC (2 PC ditemukan di rak B-04)']]},instr:'Input hasil recount ke dokumen recount (bukan dokumen lama).',
screens:[
{title:'Enter Inventory Count: Initial Screen',go:'enter',def:{gjahr:'2026',zldat:TODAY},blocks:[{t:'group',title:'',fields:[{id:'iblnr',l:'Phys. Inventory Doc.',w:12,f4:'iblnr'},{id:'gjahr',l:'Fiscal Year',w:5},{id:'zldat',l:'Count Date',w:10}]}],expect:{iblnr:{eq:'100000358',idn:'Hasil recount diinput ke dokumen recount 100000358.'}}},
{title:'Enter Inventory Count 100000358: Overview',go:'save',blocks:[{t:'items',key:'ct',title:'Items',rows:1,cols:[{id:'itm',l:'Item',ro:1,v:()=>'001'},{id:'mat',l:'Material',ro:1,v:()=>'300015577'},{id:'txt',l:'Material Description',ro:1,v:()=>'COUPLING MOTOR FCL-140'},{id:'qty',l:'Quantity',w:7},{id:'un',l:'UnE',ro:1,v:()=>'PC'},{id:'zc',l:'ZC',t:'chk'}]}],expect:{'ct.0.qty':{eq:'5',idn:'Hasil recount: 5 PC.'}},ok:'Count entered for phys. inv. doc. 100000358'}]},
{k:'tx',tc:'MI20',instr:'Jalankan daftar selisih untuk dokumen recount.',
screens:[{title:'List of Inventory Differences',sel:1,go:'exec',def:{gjahr:'2026'},blocks:[{t:'group',title:'Database selections',fields:[{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,f4:'lgort'},{id:'iblnr',l:'Physical Inventory Document',w:12,f4:'iblnr'},{id:'gjahr',l:'Fiscal Year',w:5}]}],expect:{iblnr:'100000358'}},
 {title:'List of Inventory Differences',blocks:[{t:'alv',key:'mi20b',data:ALV_MI20B}]}]},
{k:'q',instr:'Selisih turun dari -3 menjadi -1 PC (−Rp 750.000). Langkah selanjutnya?',o:['Cek MB51 untuk pengambilan tanpa GI, buat berita acara, minta approval, lalu MI07 oleh user berwenang','Recount lagi sampai 0','Hapus selisih','GR 1 PC'],a:0,e:'Recount mengurangi selisih. Sisa selisih diinvestigasi lalu diposting sesuai prosedur.'}
]},
{id:'s27',title:'Cek harga PO untuk invoice blocked',mod:3,lvl:'Menengah',
brief:{from:'Bu Ratna, Finance',msg:'Invoice PT Mitra Teknik untuk PO 4500021873 menagih Rp 195.000/pcs dan ter-block karena harga. Tolong cek harga di PO dan siapkan penjelasan untuk Procurement.'},
steps:[
{k:'tx',tc:'ME23N',instr:'Buka ME23N, Other Purchase Order, buka PO 4500021873, lalu tab Conditions di Item Detail.',
screens:[
{title:'Standard PO 4500021880 Created by SARI',go:null,blocks:[{t:'note',html:'<p>Gunakan <b>Other Purchase Order</b> (Shift+F5) untuk membuka PO yang diminta.</p>'}],tbx:[{l:'Other Purchase Order',k:'otherpo'}],popups:{otherpo:{title:'Select Document',fields:[{id:'m.po',l:'Purchase Order',w:12,f4:'ebeln'}],expect:{'m.po':'4500021873'},next:true}},expect:{}},
{title:'Standard PO 4500021873 Created by SARI',goal:s=>s.tabs.det===3,goalMsg:'Tab Conditions dibuka',
 blocks:[{t:'kv',rows:[['Vendor','100118 PT Mitra Teknik Abadi'],['Doc. date','21.10.2026'],['Purch. Group','P05'],['Plant','1100']]},
 {t:'table',title:'Item Overview',h:['Itm','A','Material','Short Text','PO Quantity','OUn','Deliv. Date','Net Price','Plnt'],r:[['10','P','300012457','BEARING SKF 6205-2RS','10','PC','28.10.2026','185.000','1100']]},
 {t:'tabs',key:'det',title:'Item  [ 10 ] 300012457, BEARING SKF 6205-2RS',tabs:[
  {l:'Material Data',fields:[{id:'z1',l:'Material Group',t:'ro',v:'4105 Bearing'}]},
  {l:'Quantities/Weights',fields:[{id:'z2',l:'PO Quantity',t:'ro',v:'10 PC'}]},
  {l:'Delivery',fields:[{id:'z3',l:'Overdeliv. Tol.',t:'ro',v:'0 %'},{id:'z4',l:'Underdel. Tol.',t:'ro',v:'0 %'}]},
  {l:'Conditions',table:{h:['CnTy','Name','Amount','Crcy','per','UoM','Condition value'],r:[['PB00','Gross Price','185.000','IDR','1','PC','1.850.000'],['NAVS','Net value incl. tax','203.500','IDR','1','PC','2.035.000']]}},
  {l:'Purchase Order History',table:{h:['Sh. Text','MvT','Material Doc.','Quantity','OUn','Amount (IDR)'],r:[['WE','101','5000187342','8','PC','1.480.000'],['RE-L','','5105600140 (blocked)','8','PC','1.560.000']]}}]}]}]},
{k:'q',instr:'Harga di PO Rp 185.000, invoice Rp 195.000. Selisihnya?',o:['Rp 10.000/pcs ≈ 5,4%, di luar toleransi sehingga blocked','Tidak ada selisih','Rp 1.000/pcs','20%'],a:0,e:'(195.000 − 185.000) ÷ 185.000 ≈ 5,4%.'},
{k:'q',instr:'Langkah yang benar?',o:['Kirim data PO (Conditions + PO history) ke Procurement; vendor merevisi invoice/credit note, atau Procurement mengubah PO jika kenaikan harga disetujui','Minta Finance membayar saja','Ubah harga PO sendiri','Batalkan GR'],a:0,e:'Harga adalah kesepakatan Procurement–vendor. Admin menyiapkan data.'}
]},
{id:'s28',title:'Biaya internal order improvement (KOB1)',mod:7,lvl:'Menengah',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Improvement guarding Line 2 pakai internal order 700000231 dengan budget Rp 75 juta. Tolong cek biaya aktualnya sampai sekarang dan statusnya aman atau tidak.'},
steps:[
{k:'tx',tc:'KOB1',instr:'Buka KOB1, isi Order, Execute, lalu Σ di kolom nilai.',
screens:[{title:'Display Actual Cost Line Items for Orders: Initial Screen',sel:1,go:'exec',def:{kokrs:'1000'},blocks:[
  {t:'group',title:'Order',fields:[{id:'aufnr',l:'Order',w:10,f4:'aufnr',to:1},{id:'kstar',l:'Cost Element',w:8,to:1}]},
  {t:'group',title:'Posting Data',fields:[{id:'budat',l:'Posting Date',w:10,to:1}]},
  {t:'group',title:'Settings',fields:[{id:'kokrs',l:'Controlling Area',w:5},{id:'layout',l:'Layout',w:12}]}],
 expect:{aufnr:{eq:'700000231',idn:'Internal order improvement Line 2 = 700000231 (F4).'}}},
 {title:'Display Actual Cost Line Items for Orders',goal:s=>(s.alv.kob||{}).sum==='val',goalMsg:'Total dihitung dengan Σ',blocks:[{t:'alv',key:'kob',data:ALV_KOB1}]}]},
{k:'q',instr:'Total actual dan statusnya terhadap budget Rp 75 jt?',o:['Rp 68,4 jt (91%) – Amber, sisa Rp 6,6 jt','Rp 32 jt – Green','Rp 75 jt – habis','Rp 21,4 jt'],a:0,e:'8,5 + 21,4 + 32 + 6,5 = 68,4 jt, atau 91% dari budget. Cek juga komitmen yang belum terealisasi sebelum menambah pembelian.'}
]}
);
/* ===================== MODE BEBAS (SANDBOX) ===================== */
MAT['300050400']={d:'PLAT STAINLESS 316 2MM',u:'LBR',mg:'4150',p:1850000,pg:'P05'};
F4.matnr=Object.entries(MAT).map(([k,v])=>[k,v.d]);
F4.pmord=[['4000123','Breakdown – conveyor Line 3 (PM01)'],['4000131','Preventive – pelumasan (PM02)'],['700000231','Improvement Line 2 (internal order)'],['700000245','Improvement Line 1 (internal order)']];
F4.mblnr.push(['4900061512','04.11.2026 · 201 · KABEL NYY 4X16']);
const VEND={'300012457':'100118 PT Mitra Teknik Abadi','300012458':'100118 PT Mitra Teknik Abadi','300019920':'100118 PT Mitra Teknik Abadi','300015577':'100118 PT Mitra Teknik Abadi','300022105':'100125 CV Sinar Elektrik','300045001':'100140 PT Duta Konveyor','300040220':'100140 PT Duta Konveyor','300045002':'100152 PT Food Belt Indonesia','300050400':'100163 PT Baja Inox','300050310':'100171 CV Mur Baut Jaya','300031150':'100184 PT Roller Jaya'};
const SLOCS={'1100':['1101','1102','1103'],'1200':['1201']};
const SL_NAME={'1101':'Gudang Sparepart','1102':'Gudang Proyek','1103':'Gudang Bahan Baku','1201':'Gudang Sparepart SBY'};
const VALID={kostl:()=>F4.kostl.map(x=>x[0]),wbs:()=>F4.posid.map(x=>x[0]).filter(x=>x.includes('.')),order:()=>F4.pmord.map(x=>x[0]),asset:()=>['4000012','4000009'],ekgrp:()=>F4.ekgrp.map(x=>x[0])};

function sbxSeed(){
  const st={};const put=(m,sl,u,q,b)=>st[m+'|'+sl]={unr:u||0,qi:q||0,blk:b||0};
  put('300012457','1101',6);put('300012458','1101',4);put('300019920','1101',12);put('300015577','1101',0,3);put('300015577','1102',6);
  put('300022105','1101',40);put('300022105','1102',20);put('300031150','1101',4);put('300031150','1102',4);put('300050310','1102',150);put('300040220','1102',0,0,1);
  const it=(o)=>Object.assign({it:'10',werks:'1100',lgort:'',knttp:'',obj:'',gr:0,iv:null},o);
  const d={v:2,stock:st,res:[],
   pr:[{no:'10004583',mat:'300050400',qty:4,date:'30.11.2026',werks:'1100',lgort:'1102',ekgrp:'P05',knttp:'P',obj:'P-26-009.02',rel:'Not released',po:'',req:'RUDI',user:false}],
   po:[{no:'4500021873',vend:VEND['300012457'],ekgrp:'P05',bedat:'21.10.2026',items:[it({mat:'300012457',qty:10,price:185000,lgort:'1101',deliv:'28.10.2026'})]},
       {no:'4500021880',vend:VEND['300022105'],ekgrp:'P05',bedat:'21.10.2026',items:[it({mat:'300022105',qty:200,price:550000,lgort:'1102',knttp:'P',obj:'P-26-014.04',gr:80,iv:{no:'5105600123',qty:80,blocked:false},deliv:'06.11.2026'})]},
       {no:'4500021902',vend:VEND['300045001'],ekgrp:'P05',bedat:'15.10.2026',items:[it({mat:'300045001',qty:1,price:148000000,lgort:'1102',knttp:'P',obj:'P-26-014.02',deliv:'20.11.2026'})]},
       {no:'4500021925',vend:VEND['300045002'],ekgrp:'P05',bedat:'28.10.2026',items:[it({mat:'300045002',qty:30,price:1250000,lgort:'1102',deliv:'05.11.2026'})]}],
   docs:[{no:'4900061498',pd:'03.11.2026',mvt:'201',mat:'300031150',qty:-6,sl:'1101',obj:'11PRD310',ref:'',usr:'JOKO',val:2700000},
         {no:'5000187001',pd:'28.10.2026',mvt:'101',mat:'300031150',qty:10,sl:'1101',obj:'',ref:'4500021790',usr:'JOKO',val:4500000},
         {no:'4900061210',pd:'21.10.2026',mvt:'221',mat:'300031150',qty:-2,sl:'1101',obj:'P-26-014.02',ref:'',usr:'ANDRE.P',val:900000},
         {no:'5000186990',pd:'30.10.2026',mvt:'101',mat:'300022105',qty:80,sl:'1102',obj:'P-26-014.04',ref:'4500021880',usr:'JOKO',val:44000000}],
   cost:ALV_CJI3.rows.map(r=>({obj:r.wbs,ce:r.ce,cen:r.cen,val:r.val,ref:r.ref,pd:r.pd,txt:r.txt})).concat(ALV_KSB1.rows.map(r=>({obj:'11PRD310',ce:r.ce,cen:r.cen,val:r.val,ref:r.ref,pd:r.pd,txt:r.txt}))),
   nums:{pr:10004600,po:4500022000,mdi:5000188000,mdo:4900062100,iv:5105600300,zinv:12000100,zopx:13000100,zcpx:14000100,res:1960},log:[],flags:{}};
  d.pr.push({no:'13000098',bsart:'ZOPX',mat:'300022105',qty:20,date:'28.11.2026',werks:'1100',lgort:'',ekgrp:'P03',knttp:'K',obj:'11PRD310',rel:'',po:'',req:'DEDI',done:['S1'],user:false,htxt:'Kabel cadangan panel Line 3'});
  d.pr.forEach(prUpg);return d;
}
/* PR: jenis dokumen, strategi release (S1 → M1 → G1 bila nilai ≥ Rp 50 jt) */
const PRTYPE={NB:['Purchase Requisition','pr'],ZINV:['PR Inventory (ke stok)','zinv'],ZOPX:['PR Opex (biaya)','zopx'],ZCPX:['PR Capex (investasi)','zcpx']};
const RCODE={S1:'Supervisor',M1:'Manager',G1:'General Manager'};
const prVal=p=>p.qty*(p.price||MAT[p.mat].p);
const prStrat=p=>prVal(p)>=5e7?['S1','M1','G1']:['S1','M1'];
const prNext=p=>p.strat.find(c=>!p.done.includes(c));
const prFull=p=>p.done.length===p.strat.length;
const prRel=p=>prFull(p)?'Released':p.done.length?'Partially released':'Not released';
const prInd=p=>prFull(p)?'2  RFQ/purchase order':'X  Blocked';
const stratTxt=codes=>codes.map(c=>c+' '+RCODE[c]).join(' → ');
function prUpg(p){if(!p.bsart)p.bsart='NB';if(!p.price)p.price=MAT[p.mat].p;if(!p.strat)p.strat=prStrat(p);if(!p.done)p.done=p.rel==='Released'?[...p.strat]:[];p.rel=prRel(p);}
function DB(){const d=S.sandbox;
  if(!d||!d.v||d.v>2){S.sandbox=sbxSeed();save();return S.sandbox;}
  if(d.v===1){d.res=d.res||[];d.nums=Object.assign({zinv:12000100,zopx:13000100,zcpx:14000100,res:1960},d.nums);d.pr.forEach(prUpg);d.v=2;save();}
  return d;}
const sbxSave=()=>save();
const stk=(m,sl)=>{const d=DB();const k=m+'|'+sl;return d.stock[k]||(d.stock[k]={unr:0,qi:0,blk:0});};
const nextNo=k=>String(++DB().nums[k]);
const userNm=()=>norm(SIM&&SIM.lv&&SIM.lv.user)||LOGON_USER;
const sbxLog=(t,no,x)=>{const d=DB();d.log.unshift({t,no,x});d.log=d.log.slice(0,30);};
const flag=k=>{DB().flags[k]=true;};
const E=(sap,idn,id)=>({err:{sap,idn,id}});
const findPO=no=>DB().po.find(p=>p.no===norm(no));
const fmtRp=n=>Number(n).toLocaleString('id-ID');
const ACT_NAME={A01:'Goods Receipt',A07:'Goods Issue',A08:'Transfer Posting',A03:'Cancellation'};

function startFree(){
  SIM={free:true,sc:{id:'free',title:'Simulator bebas – latihan SAP sesukamu',mod:'Bebas',brief:{from:'',msg:''},steps:[]},step:0,scr:0,where:LOGGED?'easy':'logon',other:null,vals:{},lv:{client:'800',lang:'EN'},tabs:{},alv:{},
    msg:['I',LOGGED?'SAP Easy Access':'Log on to the system'],explain:null,errId:null,modal:null,menu:null,warnOk:false,txDone:false,flags:{},errors:0,hints:0,done:false,tree:{0:true,f:true},sessions:1,ftx:null,confirmReset:false};
  DB(); location.hash='simulator'; drawSim();
}
function openFree(tc,mode){
  const def=SBX[tc]; resetTx(); SIM.where='tx'; SIM.other=null; SIM.ftx={tc,screens:def.screens(),keep:def.keep}; SIM.scr=0;
  Object.assign(SIM.vals,defaults(SIM.ftx.screens[0]));
  setMsg('I',(mode==='o'?'New session: ':'')+(KNOWN[tc]||tc),def.tip?{t:'i',m:def.tip}:null);
  if(def.popup&&!SIM.flags[def.popup.once]) SIM.modal={type:'popup',p:def.popup,err:null};
  flag('open_'+tc); sbxSave();
}
function resetFree(){const keep={};(SIM.ftx.keep||[]).forEach(k=>keep[k]=SIM.vals[k]);const tc=SIM.ftx.tc;SIM.ftx.screens=SBX[tc].screens();SIM.scr=0;SIM.vals=Object.assign({},defaults(SIM.ftx.screens[0]),keep);SIM.tabs={};SIM.alv={};}
const alvScreen=(title,key,cols,rows,extra)=>({title,blocks:[...(extra||[]),{t:'alv',key,data:{cols,rows}}]});

/* ---------- validation helpers ---------- */
function vMat(v,id){const m=norm(v);if(!m)return E('Enter a material number','Isi nomor material (F4 untuk mencari).',id);if(!MAT[m])return E(`Material ${m} does not exist`,'Nomor material tidak ada. Pakai F4.',id);return null;}
function vPlant(v,id){const w=norm(v);if(!w)return E('Enter a plant','Isi plant, misalnya 1100 Pabrik Cikarang.',id);if(!SLOCS[w])return E(`Plant ${w} does not exist`,'Plant yang ada: 1100 (Cikarang) dan 1200 (Surabaya).',id);return null;}
function vSloc(w,v,id,req){const l=norm(v);if(!l)return req?E('Enter a storage location','Storage location wajib untuk transaksi ini.',id):null;if(!(SLOCS[norm(w)]||[]).includes(l))return E(`Storage location ${l} does not exist in plant ${norm(w)}`,`Sloc di plant ${norm(w)}: ${(SLOCS[norm(w)]||[]).join(', ')}.`,id);return null;}
function vQty(v,id){const n=+String(v||'').replace(',','.');if(!(n>0))return [null,E('Enter a quantity greater than zero','Qty harus lebih dari 0.',id)];return [n,null];}
function vDate(v,id,future){const d=dParse(v);if(!d)return E('Enter date in format DD.MM.YYYY','Format tanggal SAP: DD.MM.YYYY.',id);if(future&&d<dParse(TODAY))return E('Delivery date is in the past','Tanggal tidak boleh sebelum hari ini ('+TODAY+').',id);return null;}
function vObj(knttp,v,id){const o=norm(v);
  if(knttp==='P'){if(!o)return E('Enter WBS element','Account assignment P wajib WBS element (tab Account Assignment).',id);if(o==='P-26-014'||o==='P-26-009')return E(`${o} is a project definition, not a WBS element`,'Pilih WBS level bawah, misalnya P-26-014.02.',id);if(!VALID.wbs().includes(o))return E(`WBS element ${o} does not exist`,'Pakai F4 untuk memilih WBS.',id);}
  if(knttp==='K'){if(!o)return E('Enter cost center','Account assignment K wajib cost center.',id);if(!VALID.kostl().includes(o))return E(`Cost center ${o} does not exist`,'Pakai F4.',id);}
  if(knttp==='F'){if(!o)return E('Enter order','Account assignment F wajib nomor order.',id);if(!VALID.order().includes(o))return E(`Order ${o} does not exist`,'Pakai F4.',id);}
  if(knttp==='A'){if(!o)return E('Enter asset','Account assignment A wajib nomor aset.',id);if(!VALID.asset().includes(o))return E(`Asset ${o} does not exist in company code 1000`,'Pakai aset AuC 4000012 atau 4000009.',id);}
  return null;}

/* ---------- transactions ---------- */
const SBX={
ME51N:{tip:'Pilih Document type dulu (ZINV ke stok, ZOPX biaya cost center, ZCPX investasi). Isi item, Enter, lengkapi tab Account Assignment, Check, lalu Save. Strategi release muncul di tab header Release strategy.',screens:()=>[{title:'Create Purchase Requisition',go:'save',checkOk:'No messages issued during check',def:{bsart:'NB'},req:['it.0.mat','it.0.qty','it.0.date','it.0.werks','it.0.ekgrp'],
 blocks:[{t:'bar',fields:[{id:'bsart',l:'Document type',t:'sel',opts:Object.entries(PRTYPE).map(([k,v])=>[k,v[0]])},{id:'srcdet',l:'Source determination',t:'chk'}]},
  {t:'tabs',key:'hd',title:'Header',tabs:[{l:'Header Note',fields:[{id:'htxt',l:'Header Note',w:40}]},{l:'Release strategy',fields:[{id:'rstrat',l:'Release strategy',t:'ro'},{id:'rind',l:'Release indicator',t:'ro'}]}]},
  {t:'items',key:'it',title:'Item Overview',rows:1,cols:[{id:'itm',l:'Itm',ro:1,v:()=>'10'},{id:'knttp',l:'A',w:2,f4:'knttp'},{id:'mat',l:'Material',w:11,f4:'matnr'},{id:'txt',l:'Short Text',ro:1},{id:'qty',l:'Quantity',w:6},{id:'un',l:'Un',ro:1},{id:'date',l:'Deliv. Date',w:10},{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'SLoc',w:5,f4:'lgort'},{id:'ekgrp',l:'PGr',w:4,f4:'ekgrp'}]},
  {t:'tabs',key:'det',title:v=>'Item  [ 10 ]  '+(v['it.0.mat']||'')+'  '+(v['it.0.txt']||''),tabs:[
   {l:'Material Data',fields:[{id:'it.0.mat',l:'Material',t:'ro'},{id:'it.0.txt',l:'Short text',t:'ro'},{id:'it.0.mg',l:'Material Group',t:'ro'}]},
   {l:'Quantities/Dates',fields:[{id:'it.0.qty',l:'Quantity',w:8},{id:'it.0.date',l:'Delivery date',w:10}]},
   {l:'Valuation',fields:[{id:'it.0.price',l:'Valuation Price (IDR)',t:'ro'}]},
   {l:'Account Assignment',fields:[{id:'it.0.knttp',l:'Acct Assignment Cat.',t:'ro'},{id:'it.0.obj',l:'WBS / Cost Ctr / Order / Asset',w:14,f4:'posid'},{id:'it.0.gl',l:'G/L Account',t:'ro'}]},
   {l:'Contact Person',fields:[{id:'it.0.afnam',l:'Requisitioner',w:12}]}]}],
 onEnter:v=>{const out={};if(v['it.0.mat']){const f=matFill('it.0.',v);if(!f)return {msg:['E',`Material ${norm(v['it.0.mat'])} does not exist`],explain:'Pakai F4 untuk mencari material.'};Object.assign(out,f);}const k=norm(v['it.0.knttp']);out['it.0.gl']=k==='P'||k==='F'?'510100':k==='K'?'510200':k==='A'?'(asset)':'';const M=MAT[norm(v['it.0.mat'])],q=+String(v['it.0.qty']||'').replace(',','.');if(M&&q>0){const st=prStrat({qty:q,price:M.p});out.rstrat=stratTxt(st);out.rind='X  Blocked';}return {fill:out};},
 onGo:v=>{const k=norm(v['it.0.knttp']);
  if(!['','K','P','F','A'].includes(k))return E(`Account assignment category ${k} does not exist`,'Pilihan: kosong (stok), K, P, F, A (F4).','it.0.knttp');
  const bs=v.bsart||'NB';const allow={ZINV:[''],ZOPX:['K','F'],ZCPX:['A','P','F']}[bs];
  if(allow&&!allow.includes(k))return E(`Account assignment category ${k||'(blank)'} not allowed with document type ${bs}`,{ZINV:'ZINV untuk barang masuk stok: kosongkan kolom A.',ZOPX:'ZOPX untuk biaya: pakai K (cost center) atau F (order).',ZCPX:'ZCPX untuk investasi: pakai A (asset), P (WBS), atau F (internal order).'}[bs],'it.0.knttp');
  let e=vMat(v['it.0.mat'],'it.0.mat');if(e)return e;
  const [q,eq]=vQty(v['it.0.qty'],'it.0.qty');if(eq)return eq;
  e=vDate(v['it.0.date'],'it.0.date',true);if(e)return e;
  e=vPlant(v['it.0.werks'],'it.0.werks');if(e)return e;
  e=vSloc(v['it.0.werks'],v['it.0.lgort'],'it.0.lgort',k==='');if(e)return e;
  const g=norm(v['it.0.ekgrp']);if(!g)return E('Enter purchasing group','Isi purchasing group (F4).','it.0.ekgrp');if(!VALID.ekgrp().includes(g))return E(`Purchasing group ${g} does not exist`,'Pakai F4.','it.0.ekgrp');
  e=vObj(k,v['it.0.obj'],'it.0.obj');if(e)return e;
  if(k===''&&norm(v['it.0.obj']))return E('Account assignment object not allowed without category','Untuk pembelian ke stok, kosongkan objek di tab Account Assignment (atau isi kolom A).','it.0.obj');
  const d=dParse(v['it.0.date']);const lead=new Date(dParse(TODAY).getTime()+14*864e5);
  if(d<lead&&!SIM.warnOk)return {warn:{sap:'Delivery date cannot be met (planned delivery time 14 days)',idn:'Warning: PR tetap bisa disimpan dengan Enter. Kabari Procurement bahwa barang mendesak.'}};
  const no=nextNo(PRTYPE[bs][1]);const M=MAT[norm(v['it.0.mat'])];
  const pr={no,bsart:bs,mat:norm(v['it.0.mat']),qty:q,price:M.p,date:v['it.0.date'],werks:norm(v['it.0.werks']),lgort:norm(v['it.0.lgort']),ekgrp:g,knttp:k,obj:norm(v['it.0.obj']),po:'',req:norm(v['it.0.afnam'])||userNm(),user:true,htxt:String(v.htxt||'').trim()};prUpg(pr);
  DB().pr.unshift(pr);
  sbxLog('PR',no,`${bs} · ${M.d} ${q} ${M.u}${k?` · ${k} ${norm(v['it.0.obj'])}`:' · stok'}`);flag('pr');sbxSave();
  return {reset:true,msg:['S',`Purchase requisition number ${no} created`],explain:{t:'s',m:`PR ${no} (${bs}, nilai Rp ${fmtRp(prVal(pr))}) tersimpan dengan status blocked. Strategi release: ${stratTxt(pr.strat)}. Release di ME54N (satu PR) atau ME55 (banyak PR), lalu buat PO di ME21N dengan referensi PR ini.`}};}}]},
ME53N:{tip:'Klik Other Purchase Requisition (Shift+F5) dan pilih PR (F4).',screens:()=>[{title:'Display Purchase Requisition',go:null,blocks:[{t:'note',html:'<p>Klik <b>Other Purchase Requisition</b> (Shift+F5) dan pilih PR. Tab <b>Release strategy</b> menunjukkan kode mana yang sudah dan belum release.</p>'}],tbx:[{l:'Other Purchase Requisition',k:'otherpr'}],
 popups:{otherpr:{title:'Select Document',fields:[{id:'m.pr',l:'Purchase Requisition',w:10,f4:'sbx_pr'}],onOk:v=>{const p=findPR(v['m.pr']);if(!p)return {err:`Purchase requisition ${norm(v['m.pr'])||'(blank)'} does not exist`};return {screen:prScreen(p,false),msg:['S',`Purchase requisition ${p.no} displayed`]};}}}}]},
ME54N:{tip:'Di perusahaan, setiap release code dipegang orang yang berbeda. Di Simulator bebas kamu memerankan semua approver, tapi urutan kodenya tetap berlaku.',screens:()=>[{title:'Release Purchase Requisition',go:null,blocks:[{t:'note',html:'<p>Klik <b>Other Purchase Requisition</b> (Shift+F5) dan pilih PR yang menunggu release (F4 menampilkan status setiap PR).</p>'}],tbx:[{l:'Other Purchase Requisition',k:'otherpr'}],
 popups:{otherpr:{title:'Select Document',fields:[{id:'m.pr',l:'Purchase Requisition',w:10,f4:'sbx_pr'}],onOk:v=>{const p=findPR(v['m.pr']);if(!p)return {err:`Purchase requisition ${norm(v['m.pr'])||'(blank)'} does not exist`};const sc=prScreen(p,true);return {screen:sc,msg:prFull(p)?['I',`Purchase requisition ${p.no} is already completely released`]:['S',`Purchase requisition ${p.no}: release possible with code ${prNext(p)}`]};}}}}]},
ME55:{tip:'Pilih release code, F8, centang PR yang mau di-release, lalu Save.',screens:()=>[{title:'Collective Release of Purchase Requisitions',sel:1,go:'exec',req:['frgco'],def:{werks:'1100'},blocks:[{t:'group',title:'Release',fields:[{id:'frgco',l:'Release Code',w:3,f4:'rcode'},{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'ekgrp',l:'Purchasing Group',w:5,f4:'ekgrp'}]}],
 onGo:v=>{const c=norm(v.frgco);if(!c)return E('Enter release code','Isi Release Code (S1, M1, atau G1).','frgco');if(!RCODE[c])return E(`Release code ${c} does not exist`,'Pakai F4.','frgco');
  const L=DB().pr.filter(p=>!p.po&&prNext(p)===c&&(!v.werks||p.werks===norm(v.werks))&&(!v.ekgrp||p.ekgrp===norm(v.ekgrp)));
  if(!L.length)return {msg:['I',`No purchase requisitions to be released with code ${c}`],explain:{t:'i',m:'Tidak ada PR yang sedang menunggu kode ini. Ingat: M1 baru muncul setelah S1 release, G1 setelah M1.'}};
  return {screen:{title:`Collective Release of Purchase Requisitions – Code ${c} ${RCODE[c]}`,go:'save',blocks:[{t:'note',html:`<p>Centang kolom <b>Rel.</b> pada PR yang disetujui, lalu Save. Cek nilai dan account assignment sebelum release.</p>`},
   {t:'items',key:'cr',title:`${L.length} purchase requisition(s)`,rows:L.length,cols:[{id:'sel',l:'Rel.',t:'chk'},{id:'pr',l:'Purch.Req.',ro:1,v:r=>L[r].no},{id:'ty',l:'Type',ro:1,v:r=>L[r].bsart},{id:'tx',l:'Short Text',ro:1,v:r=>MAT[L[r].mat].d},{id:'q',l:'Quantity',ro:1,v:r=>L[r].qty+' '+MAT[L[r].mat].u},{id:'val',l:'Total value (IDR)',ro:1,v:r=>fmtRp(prVal(L[r]))},{id:'aa',l:'A / object',ro:1,v:r=>L[r].knttp?L[r].knttp+' '+L[r].obj:'stok'},{id:'st',l:'Strategy',ro:1,v:r=>L[r].strat.join('→')}]}],
   onGo:w=>{const pick=L.filter((p,r)=>w[`cr.${r}.sel`]);if(!pick.length)return E('No purchase requisition selected','Centang kolom Rel. pada PR yang akan di-release.');
    pick.forEach(p=>{p.done.push(c);p.rel=prRel(p);sbxLog('Release',p.no,`ME55 · kode ${c}${prFull(p)?' · full release':''}`);});flag('rel');flag('me55');sbxSave();
    const full=pick.filter(prFull).map(p=>p.no);
    return {reset:true,msg:['S',`Release effected with release code ${c} for ${pick.length} purchase requisition(s)`],explain:{t:'s',m:full.length?`PR ${full.join(', ')} sudah full release (indicator 2) dan siap dibuat PO di ME21N.`:`PR berikutnya menunggu kode ${prNext(pick[0])}.`}};}},msg:['S',`${L.length} purchase requisition(s) selected`]};}}]},
ME21N:{tip:'Isi Purchase Requisition (referensi) lalu Enter: item tersalin dari PR. Lengkapi vendor dan Net Price, lalu Save. Hanya PR yang sudah full release yang bisa dijadikan PO.',screens:()=>[{title:'Create Purchase Order',go:'save',checkOk:'No messages issued during check',def:{bsart:'NB',ekorg:'1000',bukrs:'1000'},req:['banfn','lifnr'],
 blocks:[{t:'bar',fields:[{id:'bsart',l:'Order type',t:'sel',opts:[['NB','Standard PO']]},{id:'lifnr',l:'Vendor',w:8,f4:'sbx_lifnr'}]},
  {t:'tabs',key:'ph',title:'Header',tabs:[{l:'Org. Data',fields:[{id:'ekorg',l:'Purch. Org.',t:'ro'},{id:'ekgrp',l:'Purch. Group',w:4,f4:'ekgrp'},{id:'bukrs',l:'Company Code',t:'ro'}]}]},
  {t:'group',title:'Document Overview: purchase requisition reference',fields:[{id:'banfn',l:'Purchase Requisition',w:10,f4:'sbx_prrel'}]},
  {t:'items',key:'po',title:'Item Overview',rows:1,cols:[{id:'itm',l:'Itm',ro:1,v:()=>'10'},{id:'knttp',l:'A',ro:1},{id:'mat',l:'Material',ro:1},{id:'txt',l:'Short Text',ro:1},{id:'qty',l:'PO Quantity',w:6},{id:'un',l:'OUn',ro:1},{id:'date',l:'Deliv. Date',w:10},{id:'price',l:'Net Price',w:10},{id:'werks',l:'Plnt',ro:1},{id:'lgort',l:'SLoc',ro:1},{id:'pr',l:'Purch.Req.',ro:1}]},
  {t:'tabs',key:'pd',title:'Item  [ 10 ]',tabs:[{l:'Account Assignment',fields:[{id:'po.0.knttp',l:'Acct Assignment Cat.',t:'ro'},{id:'po.0.obj',l:'Object',t:'ro'}]},{l:'Conditions',fields:[{id:'po.0.price',l:'PB00 Gross Price (IDR)',w:10}]}]}],
 onEnter:v=>{if(!v.banfn)return null;const p=findPR(v.banfn);if(!p)return {msg:['E',`Purchase requisition ${norm(v.banfn)} does not exist`],explain:'Pakai F4: hanya PR yang full release dan belum jadi PO yang tampil.'};
  if(!prFull(p))return {msg:['E',`Purchase requisition ${p.no} item 00010 not released`],explain:`PR ini baru release ${p.done.length?p.done.join(', '):'0 kode'} dari ${p.strat.join(' → ')}. Selesaikan release di ME54N/ME55 dulu.`};
  if(p.po)return {msg:['E',`Purchase requisition ${p.no} item 00010 already ordered (PO ${p.po})`],explain:'Satu PR hanya dijadikan satu PO di simulator ini. Cek PO-nya di ME23N.'};
  if(v['po.0.pr']===p.no)return null;const M=MAT[p.mat];
  return {fill:{'po.0.knttp':p.knttp,'po.0.mat':p.mat,'po.0.txt':M.d,'po.0.qty':String(p.qty),'po.0.un':M.u,'po.0.date':p.date,'po.0.price':String(p.price),'po.0.werks':p.werks,'po.0.lgort':p.lgort,'po.0.pr':p.no,'po.0.obj':p.obj||'(stock)',lifnr:(VEND[p.mat]||'').split(' ')[0],ekgrp:p.ekgrp},msg:['I',`Item data adopted from purchase requisition ${p.no}`]};},
 onGo:v=>{const p=findPR(v.banfn);if(!p)return E('Enter a purchase requisition as reference','Di Simulator bebas, PO dibuat dari PR yang sudah full release. Isi nomor PR lalu Enter.','banfn');
  if(!prFull(p))return E(`Purchase requisition ${p.no} item 00010 not released`,'Selesaikan release di ME54N/ME55 dulu.','banfn');if(p.po)return E(`Purchase requisition ${p.no} item 00010 already ordered`,'PR ini sudah punya PO '+p.po+'.','banfn');
  if(v['po.0.pr']!==p.no)return E('Press Enter to adopt the requisition items','Tekan Enter setelah mengisi nomor PR.','banfn');
  const ven=F4.sbx_lifnr().find(x=>x[0]===norm(v.lifnr));if(!norm(v.lifnr))return E('Enter vendor','Isi vendor (F4).','lifnr');if(!ven)return E(`Vendor ${norm(v.lifnr)} does not exist`,'Pakai F4.','lifnr');
  const [q,eq]=vQty(v['po.0.qty'],'po.0.qty');if(eq)return eq;const pr=+String(v['po.0.price']||'').replace(/\./g,'').replace(',','.');if(!(pr>0))return E('Enter a net price','Isi Net Price per unit.','po.0.price');
  let e=vDate(v['po.0.date'],'po.0.date',true);if(e)return e;
  if(q>p.qty&&!SIM.warnOk)return {warn:{sap:`Quantity ordered exceeds requisitioned quantity by ${q-p.qty} ${MAT[p.mat].u}`,idn:'Warning: PO lebih besar dari PR. Pastikan ada persetujuan; Enter untuk lanjut.'}};
  const no=nextNo('po');p.po=no;
  DB().po.unshift({no,vend:ven[0]+' '+ven[1],ekgrp:norm(v.ekgrp)||p.ekgrp,bedat:TODAY,pr:p.no,items:[{it:'10',mat:p.mat,qty:q,price:pr,werks:p.werks,lgort:p.lgort||(p.werks==='1100'?'1102':'1201'),knttp:p.knttp,obj:p.obj,gr:0,iv:null,deliv:v['po.0.date']}]});
  sbxLog('PO',no,`dari PR ${p.no} · ${ven[1]} · Rp ${fmtRp(q*pr)}`);flag('po');sbxSave();
  return {reset:true,msg:['S',`Standard PO created under the number ${no}`],explain:{t:'s',m:`PO ${no} ke ${ven[1]} dibuat dari PR ${p.no}. Cek di ME23N (tab PO History) dan ME5A (centang Closed Requisitions). Saat barang datang, terima di MIGO A01 + R01.`}};}}]},
MB21:{tip:'Reservasi = permintaan barang sebelum diambil. Isi Base Date, movement type (201 cost center, 221 WBS, 261 order), penerima, objek biaya, material, lalu Save.',screens:()=>[{title:'Create Reservation',go:'save',def:{bdter:TODAY,bwart:'201',werks:'1100'},req:['rs.0.mat','rs.0.qty'],
 blocks:[{t:'group',title:'Reference',fields:[{id:'bdter',l:'Base Date',w:10},{id:'bwart',l:'Movement Type',w:4,f4:'bwres'},{id:'werks',l:'Plant',w:5,f4:'werks'}]},
  {t:'group',title:'Account assignment',fields:[{id:'wempf',l:'Goods recipient',w:12},{id:'kostl',l:'Cost Center',w:10,f4:'kostl',show:v=>norm(v.bwart)==='201'},{id:'wbs',l:'WBS Element',w:14,f4:'posid',show:v=>norm(v.bwart)==='221'},{id:'aufnr',l:'Order',w:10,f4:'pmord',show:v=>norm(v.bwart)==='261'}]},
  {t:'items',key:'rs',title:'Items',rows:1,cols:[{id:'itm',l:'Item',ro:1,v:()=>'1'},{id:'mat',l:'Material',w:11,f4:'matnr'},{id:'txt',l:'Description',ro:1},{id:'qty',l:'Quantity',w:6},{id:'un',l:'UnE',ro:1},{id:'lgort',l:'SLoc',w:5,f4:'lgort'}]}],
 onEnter:v=>{const m=v['rs.0.mat'];if(!m)return null;const M=MAT[norm(m)];if(!M)return {msg:['E',`Material ${norm(m)} does not exist`],explain:'Pakai F4.'};return {fill:{'rs.0.txt':M.d,'rs.0.un':M.u}};},
 onGo:v=>{let e=vDate(v.bdter,'bdter');if(e)return e;const bw=norm(v.bwart);if(!['201','221','261'].includes(bw))return E(`Movement type ${bw||'(blank)'} not allowed for reservations here`,'Pakai 201 (cost center), 221 (WBS), atau 261 (order).','bwart');
  e=vPlant(v.werks,'werks');if(e)return e;const k={201:'K',221:'P',261:'F'}[bw],fid={201:'kostl',221:'wbs',261:'aufnr'}[bw];e=vObj(k,v[fid],fid);if(e)return e;
  e=vMat(v['rs.0.mat'],'rs.0.mat');if(e)return e;if(!v['rs.0.txt'])return E('Press Enter to check the item','Tekan Enter setelah mengisi material.','rs.0.mat');
  const [q,eq]=vQty(v['rs.0.qty'],'rs.0.qty');if(eq)return eq;e=vSloc(v.werks,v['rs.0.lgort'],'rs.0.lgort',true);if(e)return e;
  const no=String(++DB().nums.res).padStart(10,'0'),m=norm(v['rs.0.mat']),M=MAT[m];
  DB().res.unshift({no,bdter:v.bdter,bwart:bw,werks:norm(v.werks),obj:norm(v[fid]),wempf:norm(v.wempf),mat:m,qty:q,lgort:norm(v['rs.0.lgort']),done:false});
  sbxLog('Reservasi',no,`${M.d} ${q} ${M.u} · ${bw} → ${norm(v[fid])} · tgl ${v.bdter}`);flag('res');sbxSave();
  return {reset:true,msg:['S',`Document ${no} posted`],explain:{t:'s',m:`Reservasi ${no} tersimpan; stok belum berkurang. Saat barang diambil, posting di MIGO A07 Goods Issue + R09 Reservation dengan nomor ini.`}};}}]},
ME5A:{tip:'Kosongkan filter untuk melihat semua PR, centang Closed Requisitions agar PR yang sudah jadi PO ikut tampil.',screens:()=>[{title:'List Display of Purchase Requisitions',sel:1,go:'exec',def:{assig:true},blocks:[
  {t:'group',title:'Selection',fields:[{id:'banfn',l:'Purchase Requisition',w:10},{id:'ekgrp',l:'Purchasing Group',w:5,f4:'ekgrp'},{id:'matnr',l:'Material',w:11,f4:'matnr'},{id:'werks',l:'Plant',w:5,f4:'werks'}]},
  {t:'group',title:'Processing status',fields:[{id:'assig',l:'Assigned Purchase Requisitions',t:'chk'},{id:'closed',l:'Closed Requisitions',t:'chk'},{id:'relonly',l:'Released Reqs Only',t:'chk'}]}],
 onGo:v=>{let r=DB().pr.filter(p=>(!v.banfn||p.no===norm(v.banfn))&&(!v.ekgrp||p.ekgrp===norm(v.ekgrp))&&(!v.matnr||p.mat===norm(v.matnr))&&(!v.werks||p.werks===norm(v.werks))&&(v.closed||!p.po)&&(!v.relonly||p.rel==='Released'));
  if(!r.length)return {msg:['I','No purchase requisitions found'],explain:{t:'i',m:'Tidak ada PR sesuai filter. Coba centang Closed Requisitions atau kosongkan filter.'}};
  return {screen:alvScreen('List Display of Purchase Requisitions','pr',ALV_ME5A.cols,r.map(p=>({pr:p.no,it:'10',txt:MAT[p.mat].d,qty:p.qty,un:MAT[p.mat].u,dd:p.date,rel:p.rel,po:p.po,req:p.req}))),msg:['S',`${r.length} entries selected`]};}}]},
ME2N:{tip:'Selection Parameters WE101 = hanya PO yang belum diterima penuh.',screens:()=>[{title:'Purchasing Documents per Document Number',sel:1,go:'exec',def:{listu:'BEST',ekorg:'1000'},blocks:selME2N(),
 onGo:v=>{const multi=(v.ebeln_multi||[]).map(norm);const rows=[];
  DB().po.forEach(p=>p.items.forEach(i=>{const open=i.qty-i.gr;if(v.ebeln&&p.no!==norm(v.ebeln))return;if(multi.length&&!multi.includes(p.no))return;if(v.ekgrp&&p.ekgrp!==norm(v.ekgrp))return;if(v.werks&&i.werks!==norm(v.werks))return;if(norm(v.selpa)==='WE101'&&open<=0)return;
   rows.push({po:p.no,it:i.it,vend:p.vend.replace(/^\d+ /,''),txt:MAT[i.mat].d,qty:i.qty,oun:MAT[i.mat].u,open,dd:i.deliv});}));
  if(!rows.length)return {msg:['I','No purchasing documents found'],explain:{t:'i',m:'Tidak ada PO sesuai filter.'}};
  return {screen:alvScreen('Purchasing Documents per Document Number','po',ALV_PO_OPEN.cols,rows),msg:['S',`${rows.length} entries selected`]};}}]},
ME23N:{tip:'Pakai Other Purchase Order (Shift+F5) untuk membuka PO. Lihat tab Purchase Order History untuk GR dan invoice.',screens:()=>[{title:'Display Purchase Order',go:null,blocks:[{t:'note',html:'<p>Klik <b>Other Purchase Order</b> (Shift+F5) dan pilih PO (F4 menampilkan semua PO di sistem latihan).</p>'}],tbx:[{l:'Other Purchase Order',k:'otherpo'}],
 popups:{otherpo:{title:'Select Document',fields:[{id:'m.po',l:'Purchase Order',w:12,f4:'sbx_po'}],onOk:v=>{const p=findPO(v['m.po']);if(!p)return {err:`Purchase order ${norm(v['m.po'])||'(blank)'} does not exist`};flag('me23n');sbxSave();return {screen:poScreen(p),msg:['S',`Standard PO ${p.no} displayed`]};}}}}]},
MIGO:{keep:['act','ref','bwart'],tip:'Action + Reference menentukan jenis transaksi: A01/R01 GR terhadap PO, A07/R10 goods issue atau scrapping (551/555), A07/R09 GI dari reservasi, A08/R10 transfer (311) atau ubah status stok (343/344), A03/R02 pembatalan. Enter dulu, lalu Item OK, Check, Post.',screens:()=>[migoFree()]},
MB52:{tip:'Isi Plant (dan Storage Location bila perlu), lalu F8.',screens:()=>[{title:'Display Warehouse Stocks of Material',sel:1,go:'exec',def:{werks:'1100'},blocks:[{t:'group',title:'Database Selections',fields:[{id:'matnr',l:'Material',w:11,f4:'matnr'},{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,f4:'lgort'}]},{t:'group',title:'Display Options',fields:[{id:'nozero',l:'No zero stock lines',t:'chk'}]}],
 onGo:v=>{const rows=Object.entries(DB().stock).map(([k,s])=>{const [m,sl]=k.split('|');return {m,sl,s};}).filter(x=>(!v.matnr||x.m===norm(v.matnr))&&(!v.lgort||x.sl===norm(v.lgort))&&(!v.werks||(SLOCS[norm(v.werks)]||[]).includes(x.sl))&&(!v.nozero||x.s.unr+x.s.qi+x.s.blk>0))
   .sort((a,b)=>a.sl.localeCompare(b.sl)||a.m.localeCompare(b.m)).map(x=>({mat:x.m,txt:MAT[x.m].d,sl:x.sl,unr:x.s.unr,bun:MAT[x.m].u,val:x.s.unr*MAT[x.m].p,qi:x.s.qi,blk:x.s.blk}));
  flag('stock');sbxSave();if(!rows.length)return {msg:['I','No stocks found for the selection']};
  return {screen:alvScreen('Display Warehouse Stocks of Material','stk',ALV_MB52.cols,rows),msg:['S',`${rows.length} entries selected`]};}}]},
MMBE:{tip:'Isi material lalu F8.',screens:()=>[{title:'Stock Overview: Company Code/Plant/Storage Location/Batch',sel:1,go:'exec',req:['matnr'],blocks:[{t:'group',title:'Database Selections',fields:[{id:'matnr',l:'Material',w:11,f4:'matnr'},{id:'werks',l:'Plant',w:5,f4:'werks'}]}],
 onGo:v=>{const e=vMat(v.matnr,'matnr');if(e)return e;const m=norm(v.matnr);const S0=Object.entries(DB().stock).filter(([k])=>k.startsWith(m+'|')).map(([k,s])=>({sl:k.split('|')[1],s}));
  const on=DB().po.reduce((a,p)=>a+p.items.filter(i=>i.mat===m&&!i.knttp).reduce((b,i)=>b+(i.qty-i.gr),0),0);
  const sum=f=>S0.reduce((a,x)=>a+x.s[f],0);const rows=[['▾ Full',sum('unr'),sum('qi'),sum('blk'),on]];
  Object.keys(SLOCS).forEach(w=>{const L=S0.filter(x=>SLOCS[w].includes(x.sl));if(!L.length)return;const s=f=>L.reduce((a,x)=>a+x.s[f],0);rows.push([`  ▾ ${w} ${w==='1100'?'Pabrik Cikarang':'Pabrik Surabaya'}`,s('unr'),s('qi'),s('blk'),w==='1100'?on:0]);L.forEach(x=>rows.push([`      ${x.sl} ${SL_NAME[x.sl]}`,x.s.unr,x.s.qi,x.s.blk,'']));});
  flag('stock');sbxSave();
  return {screen:{title:'Stock Overview: Basic List',blocks:[{t:'kv',rows:[['Material',`${m} ${MAT[m].d}`],['Base Unit',MAT[m].u]]},{t:'table',title:'Stock overview',h:['Client/Company Code/Plant/Storage Location','Unrestricted use','Qual. inspection','Blocked','On-Order Stock'],r:rows.map(r=>r.map(String))}]},msg:['S','Stock overview displayed']};}}]},
MB51:{tip:'Filter material, movement type, dan tanggal. Kosongkan untuk melihat semua dokumen.',screens:()=>[{title:'Material Document List',sel:1,go:'exec',def:{werks:'1100'},blocks:[{t:'group',title:'Item Data',fields:[{id:'matnr',l:'Material',w:11,f4:'matnr'},{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,f4:'lgort'},{id:'bwart',l:'Movement Type',w:4,f4:'bwart'}]},{t:'group',title:'Header Data',fields:[{id:'budat',l:'Posting Date',w:10,to:1},{id:'usnam',l:'User Name',w:10}]}],
 onGo:v=>{const f=dParse(v.budat),t=dParse(v.budat_to);const rows=DB().docs.filter(d=>(!v.matnr||d.mat===norm(v.matnr))&&(!v.lgort||d.sl===norm(v.lgort))&&(!v.bwart||d.mvt===norm(v.bwart))&&(!v.usnam||d.usr===norm(v.usnam))&&(!f||dParse(d.pd)>=f)&&(!t||dParse(d.pd)<=t))
   .map(d=>({doc:d.no,pd:d.pd,mvt:d.mvt,mat:d.mat,txt:MAT[d.mat].d,sl:d.sl,qty:d.qty,bun:MAT[d.mat].u,obj:d.obj||d.ref,usr:d.usr+(d.cancelled?' (cancelled)':'')}));
  if(!rows.length)return {msg:['I','No material documents found']};
  return {screen:alvScreen('Material Document List','mb51',ALV_MB51.cols,rows),msg:['S',`${rows.length} entries selected`]};}}]},
CJI3:{popup:{once:'dbprof',title:'Database Profile',fields:[{id:'m.prof',l:'Database prof.',w:14,f4:'dbprof'}],expect:{'m.prof':{eq:'000000000001',idn:'Pakai profil standar 000000000001 (F4).'}},cancelToEasy:true,cancelMsg:'Database profile not selected'},tip:'Isi Project (P-26-014 atau P-26-009) atau WBS tertentu, lalu F8. Pakai Σ untuk total.',
 screens:()=>[{title:'Display Actual Cost Line Items for Projects',sel:1,go:'exec',req:['pspid'],blocks:selCJI(),
 onGo:v=>{const key=norm(v.posid)||norm(v.pspid);if(!key)return E('Enter a project or WBS element','Isi Project, misalnya P-26-014.','pspid');if(!F4.pspid.some(x=>key.startsWith(x[0])))return E(`Project ${key} does not exist`,'Pakai F4.','pspid');
  const rows=DB().cost.filter(c=>c.obj.startsWith(key)).map(c=>({wbs:c.obj,ce:c.ce,cen:c.cen,val:c.val,ref:c.ref,pd:c.pd,txt:c.txt}));flag('cji3');sbxSave();
  if(!rows.length)return {msg:['I','No line items found']};return {screen:alvScreen('Display Actual Cost Line Items for Projects','act',ALV_CJI3.cols,rows),msg:['S',`${rows.length} entries selected`]};}}]},
CJI5:{popup:{once:'dbprof',title:'Database Profile',fields:[{id:'m.prof',l:'Database prof.',w:14,f4:'dbprof'}],expect:{'m.prof':{eq:'000000000001',idn:'Pakai profil standar 000000000001 (F4).'}},cancelToEasy:true,cancelMsg:'Database profile not selected'},tip:'Komitmen = sisa PO ber-account assignment P yang belum diterima.',
 screens:()=>[{title:'Display Commitment Line Items for Projects',sel:1,go:'exec',req:['pspid'],blocks:selCJI(),
 onGo:v=>{const key=norm(v.posid)||norm(v.pspid);if(!key)return E('Enter a project or WBS element','Isi Project.','pspid');const rows=[];
  DB().po.forEach(p=>p.items.forEach(i=>{if(i.knttp==='P'&&i.obj.startsWith(key)&&i.qty>i.gr)rows.push({wbs:i.obj,po:p.no,txt:`${MAT[i.mat].d} – sisa ${i.qty-i.gr} ${MAT[i.mat].u}`,val:(i.qty-i.gr)*i.price,dd:i.deliv});}));
  if(!rows.length)return {msg:['I','No commitments found']};return {screen:alvScreen('Display Commitment Line Items for Projects','com',ALV_CJI5.cols,rows),msg:['S',`${rows.length} entries selected`]};}}]},
KSB1:{tip:'Isi cost center (F4), lalu F8.',screens:()=>[{title:'Display Actual Cost Line Items for Cost Centers: Initial Screen',sel:1,go:'exec',req:['kostl'],def:{kokrs:'1000'},blocks:[{t:'group',title:'Cost Center',fields:[{id:'kostl',l:'Cost Center',w:10,f4:'kostl'}]},{t:'group',title:'Settings',fields:[{id:'kokrs',l:'Controlling Area',w:5}]}],
 onGo:v=>{const k=norm(v.kostl);if(!k)return E('Enter a cost center','Isi cost center.','kostl');if(!VALID.kostl().includes(k))return E(`Cost center ${k} does not exist`,'Pakai F4.','kostl');
  const rows=DB().cost.filter(c=>c.obj===k).map(c=>({pd:c.pd,ce:c.ce,cen:c.cen,val:c.val,ref:c.ref,mvt:'',txt:c.txt}));if(!rows.length)return {msg:['I','No line items found']};
  return {screen:alvScreen('Display Actual Cost Line Items for Cost Centers','ksb',ALV_KSB1.cols,rows),msg:['S',`${rows.length} entries selected`]};}}]},
MM03:{tip:'Isi material lalu Enter.',screens:()=>[{title:'Display Material (Initial Screen)',go:'enter',req:['mat'],blocks:[{t:'group',title:'',fields:[{id:'mat',l:'Material',w:12,f4:'matnr'}]}],
 onGo:v=>{const e=vMat(v.mat,'mat');if(e)return e;const m=norm(v.mat),M=MAT[m];const tot=Object.entries(DB().stock).filter(([k])=>k.startsWith(m+'|')).reduce((a,[,s])=>a+s.unr+s.qi+s.blk,0);
  return {screen:{title:`Display Material ${m}`,blocks:[{t:'tabs',key:'mm',tabs:[{l:'Basic data 1',fields:[{id:'x1',l:'Description',t:'ro',v:M.d},{id:'x2',l:'Base Unit of Measure',t:'ro',v:M.u},{id:'x3',l:'Material Group',t:'ro',v:M.mg}]},{l:'Purchasing',fields:[{id:'x4',l:'Purchasing Group',t:'ro',v:M.pg},{id:'x5',l:'Usual vendor',t:'ro',v:VEND[m]||'-'},{id:'x6',l:'Planned Deliv. Time',t:'ro',v:'14 days'}]},{l:'Accounting 1',fields:[{id:'x7',l:'Moving price (IDR)',t:'ro',v:fmtRp(M.p)},{id:'x8',l:'Total stock (all types)',t:'ro',v:`${tot} ${M.u}`}]}]}]},msg:['S','Material displayed']};}}]}
};
KNOWN.ME55='Collective Release of Purchase Requisitions';KNOWN.MB21='Create Reservation';KNOWN.MB22='Change Reservation';KNOWN.MB25='Reservation List';KNOWN.MI31='Create Phys. Inventory Documents (Batch)';KNOWN.MI22='Display Phys. Inv. Documents for Material';KNOWN.ML84='List Display of Service Entry Sheets';KNOWN.MB90='Output from Goods Movements';
const findPR=no=>DB().pr.find(p=>p.no===norm(no));
F4.sbx_pr=()=>DB().pr.map(p=>[p.no,`${p.bsart} · ${MAT[p.mat].d} ${p.qty} ${MAT[p.mat].u} · ${p.rel}${p.po?' · PO '+p.po:prFull(p)?'':' · tunggu '+prNext(p)}`]);
F4.sbx_prrel=()=>DB().pr.filter(p=>prFull(p)&&!p.po).map(p=>[p.no,`${p.bsart} · ${MAT[p.mat].d} ${p.qty} ${MAT[p.mat].u}`]);
F4.sbx_res=()=>DB().res.filter(r=>!r.done).map(r=>[r.no,`${MAT[r.mat].d} ${r.qty} ${MAT[r.mat].u} · ${r.bwart} ${r.obj} · ${r.bdter}`]);
F4.sbx_lifnr=()=>[...F4.lifnr,...[...new Set(Object.values(VEND))].map(x=>[x.split(' ')[0],x.replace(/^\d+ /,'')])].filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i);
F4.rcode=Object.entries(RCODE);
F4.bwres=[['201','GI for cost center'],['221','GI for project'],['261','GI for order']];
function prScreen(p,rel){const M=MAT[p.mat];const pend=p.strat.filter(c=>!p.done.includes(c));
  const sc={title:`${rel?'Release':'Display'} Purchase Requisition ${p.no}`,go:rel&&pend.length?'save':null,
   blocks:[{t:'kv',rows:[['Document type',`${p.bsart} ${PRTYPE[p.bsart][0]}`],['Item 10',`${p.mat} ${M.d} · ${p.qty} ${M.u} · deliv. ${p.date}`],['Valuation price',`IDR ${fmtRp(p.price)} / ${M.u} · total IDR ${fmtRp(prVal(p))}`],['Acct. assignment',p.knttp?`${p.knttp} · ${p.obj}`:`(stock) · sloc ${p.lgort}`],['Requisitioner',p.req],['Header note',p.htxt||'-']]},
    {t:'tabs',key:'rs',title:'Header',tabs:[{l:'Release strategy',table:{h:['Code','Description','Status'],r:p.strat.map(c=>[c,RCODE[c],p.done.includes(c)?'✓ released':c===prNext(p)?'⏳ release possible':'🔒 waiting'])},
      fields:[...(rel?pend.map(c=>({id:'rl.'+c,l:`Release – ${c} ${RCODE[c]}`,t:'chk'})):[]),{id:'z_ind',l:'Release indicator',t:'ro',v:prInd(p)}]},
     {l:'Status',fields:[{id:'z_rel',l:'Processing status',t:'ro',v:p.rel},{id:'z_po',l:'Purchase order',t:'ro',v:p.po||'–'}]}]}]};
  if(rel&&pend.length)sc.onGo=v=>{const tick=p.strat.filter(c=>v['rl.'+c]);if(!tick.length)return E('No data changed','Centang Release di baris kode yang akan di-release, lalu Save.');
    const exp=pend.slice(0,tick.length);if(tick.join()!==exp.join())return E('Release prerequisites not fulfilled',`Kode harus berurutan: ${p.strat.join(' → ')}. Berikutnya ${prNext(p)}.`,'rl.'+tick.find((c,i)=>c!==exp[i]));
    p.done.push(...tick);p.rel=prRel(p);sbxLog('Release',p.no,`ME54N · kode ${tick.join(', ')}${prFull(p)?' · full release':''}`);flag('rel');sbxSave();
    return {reset:true,msg:['S',`Release effected with release code ${tick.join(', ')} · Purchase requisition ${p.no} changed`],explain:{t:'s',m:prFull(p)?`Semua kode selesai. Release indicator = 2 (RFQ/purchase order): PR ${p.no} siap dibuat PO di ME21N.`:`PR masih blocked. Berikutnya menunggu ${prNext(p)} ${RCODE[prNext(p)]}.`}};};
  return sc;}
F4.sbx_po=()=>DB().po.map(p=>[p.no,p.vend.replace(/^\d+ /,'')+' · '+p.items.map(i=>MAT[i.mat].d).join(', ')]);
F4.sbx_doc=()=>DB().docs.filter(d=>!d.cancelled&&CANCELABLE.includes(d.mvt)).map(d=>[d.no,`${d.pd} · ${d.mvt} · ${MAT[d.mat].d} ${d.qty}`]);

function poScreen(p){const i=p.items[0],M=MAT[i.mat];
  const hist=DB().docs.filter(d=>d.ref===p.no&&['101','102'].includes(d.mvt)).map(d=>['WE',d.mvt,d.no,d.pd,String(d.qty),M.u,fmtRp(d.val)]);
  if(i.iv)hist.push(['RE-L','',i.iv.no+(i.iv.blocked?' (blocked)':''),TODAY,String(i.iv.qty),M.u,fmtRp(i.iv.qty*i.price)]);
  return {title:`Standard PO ${p.no} Created by SARI`,blocks:[{t:'kv',rows:[['Vendor',p.vend],['Doc. date',p.bedat],['Purch. Group',p.ekgrp],['Plant',i.werks]]},
   {t:'table',title:'Item Overview',h:['Itm','A','Material','Short Text','PO Quantity','OUn','Deliv. Date','Net Price','Plnt','SLoc'],r:[[i.it,i.knttp,i.mat,M.d,String(i.qty),M.u,i.deliv,fmtRp(i.price),i.werks,i.lgort]]},
   {t:'tabs',key:'det',title:`Item  [ ${i.it} ] ${i.mat}, ${M.d}`,tabs:[
    {l:'Quantities/Weights',fields:[{id:'q1',l:'PO Quantity',t:'ro',v:`${i.qty} ${M.u}`},{id:'q2',l:'Still to be delivered',t:'ro',v:`${i.qty-i.gr} ${M.u}`}]},
    {l:'Delivery',fields:[{id:'q3',l:'Overdeliv. Tol.',t:'ro',v:'0 %'},{id:'q4',l:'Deliv. Compl.',t:'ro',v:i.gr>=i.qty?'X':''}]},
    {l:'Account Assignment',fields:[{id:'q5',l:'Acct Assignment Cat.',t:'ro',v:i.knttp||'(stock)'},{id:'q6',l:'Object',t:'ro',v:i.obj||'-'}]},
    {l:'Conditions',table:{h:['CnTy','Name','Amount','Crcy','per','UoM'],r:[['PB00','Gross Price',fmtRp(i.price),'IDR','1',M.u]]}},
    {l:'Purchase Order History',table:{h:['Sh. Text','MvT','Material Doc.','Posting Date','Quantity','OUn','Amount (IDR)'],r:hist.length?hist:[['(no history yet)','','','','','','']]}}]}]};}

const CANCELABLE=['101','201','221','261','311','343','344','551','555'];
const revMvt=m=>m==='343'?'344':m==='344'?'343':String(+m+1);
const GI_MVT={'201':['K','it.0.kostl','510200','Sparepart & consumable','KSB1'],'221':['P','it.0.wbs','510100','Material proyek','CJI3'],'261':['F','it.0.aufnr','510200','Sparepart & consumable','order'],'551':['K','it.0.kostl','519000','Biaya scrap persediaan','KSB1'],'555':['K','it.0.kostl','519000','Biaya scrap persediaan','KSB1']};
const SRC_T=bw=>bw==='555'||bw==='343'?'blk':'unr';
const STN={unr:'Unrestricted-use',qi:'Quality inspection',blk:'Blocked stock'};
function migoFree(){
  const s=migoScreen({def:{}});
  s.blocks[0].fields.forEach(f=>{if(f.id==='po')f.f4='sbx_po';if(f.id==='mblnr')f.f4='sbx_doc';if(f.id==='rsnum')f.f4='sbx_res';});
  s.req=['po','it.0.qty'];
  const findRes=no=>DB().res.find(r=>r.no.replace(/^0+/,'')===norm(no).replace(/^0+/,''));
  s.onEnter=v=>{
    if(!ACT_NAME[v.act])return {msg:['E',`Action ${v.act} is not available in Simulator bebas`],explain:'Gunakan A01, A07, A08, atau A03.'};
    if(v.act==='A01'){if(v.ref!=='R01')return {msg:['E','Goods receipt in Simulator bebas needs reference R01 Purchase Order'],explain:'Pilih R01 Purchase Order.'};
      if(!v.po)return {msg:['E','Enter a purchase order number'],explain:'Isi nomor PO (F4).'};const p=findPO(v.po);if(!p)return {msg:['E',`Purchase order ${norm(v.po)} does not exist`],explain:'Pakai F4 untuk melihat PO yang ada.'};
      const i=p.items[0],open=i.qty-i.gr;if(open<=0)return {msg:['E',`PO ${p.no}: no open items for goods receipt (delivery completed)`],explain:'PO ini sudah diterima penuh.'};
      if(v['it.0.po']===p.no+' / 10')return null;
      return {fill:{'it.0.mat':i.mat,'it.0.txt':MAT[i.mat].d,'it.0.qty':String(open),'it.0.poqty':`${i.qty} ${MAT[i.mat].u} (open ${open})`,'it.0.un':MAT[i.mat].u,'it.0.lgort':i.lgort,'it.0.werks':i.werks,'it.0.po':p.no+' / 10','it.0.vendor':p.vend,_acctP:!!i.knttp,'it.0.wbs_po':i.obj,_stockSel:!i.knttp,'it.0.insmk':'','it.0.elikz':'1','it.0.stock':i.knttp?'– (consumption, acct. assignment '+i.knttp+')':'Unrestricted use'},msg:['I',`Item data adopted from purchase order ${p.no}`]};}
    if(v.act==='A03'){if(v.ref!=='R02')return {msg:['E','Cancellation needs reference R02 Material Document']};const d=DB().docs.find(x=>x.no===norm(v.mblnr));
      if(!d)return {msg:['E',`Material document ${norm(v.mblnr)||'(blank)'} does not exist`],explain:'Pakai F4 atau cari di MB51.'};if(d.cancelled)return {msg:['E',`Material document ${d.no} has already been cancelled`]};if(!CANCELABLE.includes(d.mvt))return {msg:['E',`Movement type ${d.mvt} cannot be cancelled here`]};
      return {fill:{bwart:revMvt(d.mvt),'it.0.mat':d.mat,'it.0.txt':MAT[d.mat].d,'it.0.qty':String(Math.abs(d.qty)),'it.0.un':MAT[d.mat].u,'it.0.lgort':d.sl,'it.0.werks':'1100','it.0.stock':'Unrestricted use'},msg:['I',`Data adopted from material document ${d.no}`]};}
    if(v.act==='A07'&&v.ref==='R09'){const r=findRes(v.rsnum);if(!norm(v.rsnum))return {msg:['E','Enter a reservation number'],explain:'Isi nomor reservasi (F4) dari MB21.'};
      if(!r)return {msg:['E',`Reservation ${norm(v.rsnum)} does not exist`],explain:'Pakai F4 atau buat dulu di MB21.'};if(r.done)return {msg:['E',`Reservation ${r.no} has already been withdrawn completely`],explain:`Sudah diambil dengan dokumen ${r.mblnr||''}.`};
      if(v['it.0.txt'])return null;const M=MAT[r.mat],g=GI_MVT[r.bwart];
      return {fill:{bwart:r.bwart,'it.0.mat':r.mat,'it.0.txt':M.d,'it.0.qty':String(r.qty),'it.0.un':M.u,'it.0.werks':r.werks,'it.0.lgort':r.lgort,'it.0.stock':'Unrestricted use','it.0.wempf':r.wempf,[g[1]]:r.obj},msg:['I',`Data adopted from reservation ${r.no}`]};}
    if(v.ref!=='R10')return {msg:['E',`${ACT_NAME[v.act]} in Simulator bebas needs reference ${v.act==='A07'?'R10 Other or R09 Reservation':'R10 Other'}`]};
    if(v['it.0.mat']){const M=MAT[norm(v['it.0.mat'])];if(!M)return {msg:['E',`Material ${norm(v['it.0.mat'])} does not exist`],explain:'Pakai F4.'};return {fill:{'it.0.txt':M.d,'it.0.un':M.u,'it.0.stock':SRC_T(norm(v.bwart))==='blk'?'Blocked stock':'Unrestricted use'}};}
    return null;};
  s.onGo=v=>{
    const okI=()=>v['it.0.ok']?null:E('No items selected – set Item OK','Centang Item OK di tabel item atau di bawah detail item.','it.0.ok');
    const usr=userNm();
    if(v.act==='A01'){const p=findPO(v.po);if(!p)return E('Enter a purchase order number','Isi nomor PO lalu Enter.','po');if(!v['it.0.txt'])return E('Press Enter to adopt the purchase order items','Tekan Enter setelah mengisi nomor PO.','po');
      const i=p.items[0],M=MAT[i.mat],open=i.qty-i.gr;const [q,eq]=vQty(v['it.0.qty'],'it.0.qty');if(eq)return eq;
      if(norm(v.bwart)!=='101')return E(`Movement type ${norm(v.bwart)} is not allowed for goods receipt for purchase order`,'GR terhadap PO = 101.','bwart');
      if(q>open)return E(`PO quantity exceeded by ${q-open} ${M.u} : ${i.mat} ${p.no} 00010`,`Sisa PO hanya ${open} ${M.u} dan tidak ada toleransi over-delivery.`,'it.0.qty');
      let e=vSloc(i.werks,v['it.0.lgort'],'it.0.lgort',!i.knttp);if(e)return e;e=okI();if(e)return e;
      if(q<open&&!SIM.warnOk&&v['it.0.elikz']!=='2')return {warn:{sap:`Deficit of PO Ordered quantity ${open-q} ${M.u} : ${i.mat} ${p.no} 00010`,idn:'Info: GR belum memenuhi qty PO; sisanya tetap terbuka. Enter untuk lanjut posting. Jika vendor tidak akan mengirim sisanya, set Del.Completed Ind. = 2 di tab Purchase Order Data.'}};
      const no=nextNo('mdi');i.gr+=q;if(v['it.0.elikz']==='2')i.qty=i.gr;
      if(!i.knttp){const s0=stk(i.mat,norm(v['it.0.lgort']));const t=v['it.0.insmk']==='2'?'qi':v['it.0.insmk']==='3'?'blk':'unr';s0[t]+=q;}
      else{const P=i.knttp==='P';DB().cost.push({obj:i.obj,ce:P?'510100':'510200',cen:P?'Material proyek':'Sparepart & consumable',val:q*i.price,ref:no,pd:TODAY,txt:`${M.d} (GR 101, PO ${p.no})`});}
      DB().docs.unshift({no,pd:TODAY,mvt:'101',mat:i.mat,qty:q,sl:norm(v['it.0.lgort']),obj:i.obj,ref:p.no,usr,val:q*i.price,ins:v['it.0.insmk']||''});
      sbxLog('GR',no,`PO ${p.no} · ${M.d} ${q} ${M.u}${i.knttp?' → '+i.obj:' → sloc '+norm(v['it.0.lgort'])+(v['it.0.insmk']==='2'?' (QI)':v['it.0.insmk']==='3'?' (blocked)':'')}`);flag('gr');sbxSave();
      return {reset:true,msg:['S',`Material document ${no} posted`],explain:{t:'s',m:(i.knttp?`Biaya ${fmtRp(q*i.price)} langsung masuk ke ${i.obj} (${i.knttp==='P'?'CJI3':'KSB1'}).`:`Stok bertambah ${q} ${M.u} (cek MMBE/MB52).`)+` Sisa PO: ${i.qty-i.gr} ${M.u}${v['it.0.elikz']==='2'?' (item ditutup dengan Del.Completed)':''}.`}};}
    if(v.act==='A03'){const d=DB().docs.find(x=>x.no===norm(v.mblnr));if(!d||!v['it.0.txt'])return E('Enter a material document and press Enter','Isi nomor dokumen lalu Enter.','mblnr');let e=okI();if(e)return e;
      const M=MAT[d.mat],q=Math.abs(d.qty),take=(sl,t)=>{const s0=stk(d.mat,sl);if(s0[t]<q)return E(`Deficit of SL ${STN[t]} ${q-s0[t]} ${M.u} : ${d.mat} 1100 ${sl}`,'Stok hasil dokumen ini sudah terpakai sehingga tidak bisa dibatalkan penuh.','it.0.qty');s0[t]-=q;return null;};
      if(d.mvt==='101'&&!d.obj){e=take(d.sl,d.ins==='2'?'qi':d.ins==='3'?'blk':'unr');if(e)return e;}
      if(d.mvt==='311'){e=take(d.to,'unr');if(e)return e;stk(d.mat,d.sl).unr+=q;}
      if(d.mvt==='344'){e=take(d.sl,'blk');if(e)return e;stk(d.mat,d.sl).unr+=q;}
      if(d.mvt==='343'){e=take(d.sl,'unr');if(e)return e;stk(d.mat,d.sl).blk+=q;}
      if(GI_MVT[d.mvt])stk(d.mat,d.sl)[SRC_T(d.mvt)]+=q;
      if(d.mvt==='101'&&d.ref){const p=findPO(d.ref);if(p)p.items[0].gr-=q;}
      const rm=revMvt(d.mvt),no=nextNo(d.mvt==='101'?'mdi':'mdo');
      DB().cost.filter(c=>c.ref===d.no).forEach(c=>DB().cost.push({obj:c.obj,ce:c.ce,cen:c.cen,val:-c.val,ref:no,pd:TODAY,txt:`Reversal of ${d.no}`}));
      d.cancelled=true;DB().docs.unshift({no,pd:TODAY,mvt:rm,mat:d.mat,qty:-d.qty,sl:d.sl,obj:d.obj,ref:d.ref,usr,val:d.val,rev:d.no});
      sbxLog('Cancel',no,`Batal ${d.no} (mvt ${d.mvt} → ${rm}) · ${M.d} ${q} ${M.u}${v.bktxt?' · '+v.bktxt:''}`);flag('cancel');sbxSave();
      return {reset:true,msg:['S',`Material document ${no} posted`],explain:{t:'s',m:`Dokumen ${d.no} dibatalkan dengan movement ${rm}. Stok dan biaya sudah dibalik; cek MB51 / MMBE.`}};}
    // GI, transfer, scrapping, GI dari reservasi
    const res=v.ref==='R09'?findRes(v.rsnum):null;
    if(v.ref==='R09'&&(!res||res.done||!v['it.0.txt']))return E('Enter a reservation number and press Enter','Isi nomor reservasi (F4) lalu Enter.','rsnum');
    const bw=norm(v.bwart);
    if(v.act==='A07'&&!GI_MVT[bw])return E(`Movement type ${bw||'(blank)'} is not allowed with action Goods Issue`,'Goods Issue: 201 (cost center), 221 (WBS), 261 (order), 551 (scrapping dari unrestricted), 555 (scrapping dari blocked).','bwart');
    if(v.act==='A08'&&!['311','343','344'].includes(bw))return E(`Movement type ${bw||'(blank)'} is not allowed with action Transfer Posting`,'Transfer Posting: 311 (antar sloc), 344 (unrestricted → blocked), 343 (blocked → unrestricted).','bwart');
    let e=vMat(v['it.0.mat'],'it.0.mat');if(e)return e;const m=norm(v['it.0.mat']),M=MAT[m];
    if(!v['it.0.txt'])return E('Press Enter to check the item','Tekan Enter setelah mengisi material.','it.0.mat');
    const [q,eq]=vQty(v['it.0.qty'],'it.0.qty');if(eq)return eq;
    e=vPlant(v['it.0.werks'],'it.0.werks');if(e)return e;e=vSloc(v['it.0.werks'],v['it.0.lgort'],'it.0.lgort',true);if(e)return e;
    const sl=norm(v['it.0.lgort']),s0=stk(m,sl),src=SRC_T(bw),g=GI_MVT[bw];
    if(bw==='311'){const to=norm(v['it.0.umlgo']);e=vSloc(v['it.0.werks'],to,'it.0.umlgo',true);if(e)return e;if(to===sl)return E('Receiving storage location must differ from issuing storage location','Isi sloc tujuan yang berbeda (tab Where).','it.0.umlgo');}
    if(g){e=vObj(g[0],v[g[1]],g[1]);if(e)return e;}
    if((bw==='551'||bw==='555')&&!norm(v['it.0.grund']))return E('Enter reason for movement','Scrapping wajib Reason for Movement (tab Where, F4).','it.0.grund');
    if(s0[src]<q)return E(`Deficit of SL ${STN[src]} ${q-s0[src]} ${M.u} : ${m} ${norm(v['it.0.werks'])} ${sl}`,`Stok ${STN[src]} di sloc ${sl} hanya ${s0[src]} ${M.u}.${src==='unr'&&s0.blk?` Ada ${s0.blk} ${M.u} di blocked stock (untuk scrap pakai 555).`:''}${src==='blk'&&s0.unr?` Stok unrestricted ${s0.unr} ${M.u}: pindahkan dulu dengan 344 atau scrap dengan 551.`:''}`,'it.0.qty');
    e=okI();if(e)return e;
    const no=nextNo('mdo');s0[src]-=q;let obj='',to='';
    if(bw==='311'){to=norm(v['it.0.umlgo']);stk(m,to).unr+=q;}
    else if(bw==='344'){s0.blk+=q;obj='→ blocked';}
    else if(bw==='343'){s0.unr+=q;obj='→ unrestricted';}
    else{obj=norm(v[g[1]]);DB().cost.push({obj,ce:g[2],cen:g[3],val:q*M.p,ref:no,pd:TODAY,txt:`${M.d} x${q} (GI ${bw}${res?', res. '+res.no:''})`});}
    if(res){res.done=true;res.mblnr=no;}
    DB().docs.unshift({no,pd:TODAY,mvt:bw,mat:m,qty:-q,sl,obj:obj||(to?'→ '+to:''),to,ref:res?res.no:'',usr,val:q*M.p,grund:norm(v['it.0.grund'])});
    const kind=res?'GI (R09)':bw==='311'?'Transfer':bw==='344'||bw==='343'?'Status stok':g&&bw[0]==='5'?'Scrap':'GI';
    sbxLog(kind,no,`${M.d} ${q} ${M.u} · ${sl}${to?' → '+to:' '+obj}`);flag(res?'gires':bw==='311'?'tr311':bw==='344'||bw==='343'?'blk':bw[0]==='5'?'scrap':bw==='221'?'gi221':'gi');sbxSave();
    const ex=bw==='311'?`Stok pindah ${sl} → ${to}. Tidak ada biaya baru.`:bw==='344'?`${q} ${M.u} pindah ke blocked stock di ${sl}: masih tercatat dan bernilai, tapi tidak bisa dipakai. Cek kolom Blocked di MB52.`:bw==='343'?`${q} ${M.u} kembali ke unrestricted di ${sl}.`:`Stok ${STN[src]} ${sl} berkurang ${q} ${M.u}; biaya ${fmtRp(q*M.p)} masuk ke ${obj} (${g[4]}).${res?` Reservasi ${res.no} selesai.`:''}`;
    return {reset:true,msg:['S',`Material document ${no} posted`],explain:{t:'s',m:ex}};};
  return s;
}

/* ---------- coach panel & other-party actions ---------- */
const MISSIONS=[['pr','Buat PR di ME51N (coba ZOPX + K cost center atau ZINV ke stok)'],['rel','Release PR di ME54N sesuai urutan kode (S1 → M1 → G1)'],['me55','Release beberapa PR sekaligus di ME55'],['po','Buat PO dari PR yang sudah full release di ME21N'],['me23n','Buka PO di ME23N dan baca tab PO History'],['gr','Terima barang dari PO di MIGO (A01 + R01)'],['res','Buat reservasi di MB21'],['gires','Keluarkan barang dari reservasi (MIGO A07 + R09)'],['blk','Tahan barang rusak ke blocked stock (A08, mvt 344)'],['scrap','Scrapping barang rusak (A07, mvt 551/555)'],['tr311','Pindahkan stok antar gudang (A08, mvt 311)'],['cancel','Batalkan dokumen yang salah (A03 + R02)'],['stock','Cek dampaknya di MMBE atau MB52'],['cji3','Cek biaya proyek di CJI3'],['invoice','Simulasikan invoice vendor dan lihat 3-way match di ME23N']];
function freeCoachH(){
  const d=DB();const F=d.flags;const done=MISSIONS.filter(m=>F[m[0]]).length;
  const exp=SIM.explain?(typeof SIM.explain==='object'?SIM.explain:{t:SIM.msg[0].toLowerCase(),m:SIM.explain}):null;
  const prs=d.pr.filter(p=>!prFull(p)).slice(0,4);const rdy=d.pr.filter(p=>prFull(p)&&!p.po).slice(0,4);
  const ivs=d.po.filter(p=>{const i=p.items[0];return i.gr>0&&(!i.iv||i.iv.qty<i.qty);}).slice(0,4);
  return `<div class="card"><h4>Simulator bebas</h4><p style="font-size:13.5px;margin:0">Lakukan transaksi apa saja. Setiap posting mengubah data latihan (stok, PO, dokumen, biaya) dan tersimpan di browser ini. Transaksi yang tersedia: ${Object.keys(SBX).map(tc).join(' ')}</p></div>
  ${exp&&(S.simMode==='guided'||exp.t==='s')?`<div class="explain ${exp.t==='e'?'':exp.t}"><b>${exp.t==='e'?'Arti pesan error':exp.t==='w'?'Arti warning':exp.t==='s'?'Berhasil':'Info'}:</b> ${esc(exp.m)}</div>`:''}
  <div class="card"><h4>Ide latihan <span class="pill ${done===MISSIONS.length?'ok':''}" style="margin-left:6px">${done}/${MISSIONS.length}</span></h4><ul class="glist">${MISSIONS.map(m=>`<li class="${F[m[0]]?'ok':''}"><span class="gk">${F[m[0]]?'✓':''}</span><span>${esc(m[1])}</span></li>`).join('')}</ul></div>
  <div class="card"><h4>Aksi pihak lain (simulasi)</h4><p class="muted" style="font-size:12.5px;margin:0 0 6px">Di Simulator bebas kamu memerankan approver (ME54N/ME55) dan Procurement (ME21N) sendiri. Vendor disimulasikan dengan tombol.</p>
   ${prs.length?prs.map(p=>`<div class="spread" style="padding:5px 0;border-bottom:1px dashed var(--line);font-size:13px"><span>PR <b>${p.no}</b> · ${esc(MAT[p.mat].d)} ${p.qty} ${MAT[p.mat].u}</span><span class="pill">tunggu ${prNext(p)}</span></div>`).join(''):'<p class="muted" style="font-size:13px;margin:4px 0">Tidak ada PR yang menunggu release.</p>'}
   ${rdy.map(p=>`<div class="spread" style="padding:5px 0;border-bottom:1px dashed var(--line);font-size:13px"><span>PR <b>${p.no}</b> · full release</span><span class="pill ok">siap ME21N</span></div>`).join('')}
   ${ivs.map(p=>`<div class="spread" style="padding:5px 0;border-bottom:1px dashed var(--line);font-size:13px"><span>PO <b>${p.no}</b> · GR ${p.items[0].gr}/${p.items[0].qty}</span><button class="btn sm ghost" data-sbx="invoice:${p.no}">Vendor kirim invoice</button></div>`).join('')}</div>
  <div class="card"><h4>Dokumen terakhir</h4>${d.log.length?`<ul class="glist">${d.log.slice(0,7).map(l=>`<li><span class="pill" style="min-width:58px;justify-content:center">${esc(l.t)}</span><span><b>${esc(l.no)}</b><small>${esc(l.x)}</small></span></li>`).join('')}</ul>`:'<p class="muted" style="font-size:13px;margin:0">Belum ada dokumen yang kamu buat.</p>'}
   <div class="row" style="margin-top:10px"><button class="btn sm ghost" data-sbx="reset">${SIM.confirmReset?'Klik lagi untuk reset semua data':'Reset data latihan'}</button></div></div>
  <div class="mode-sw" role="group" aria-label="Mode bantuan"><button data-mode="guided" class="${S.simMode==='guided'?'on':''}">Dengan penjelasan</button><button data-mode="exam" class="${S.simMode==='exam'?'on':''}">Tanpa penjelasan</button></div>`;
}
function sbxAction(a){
  const d=DB();const [k,arg]=a.split(':');
  if(k==='reset'){if(!SIM.confirmReset){SIM.confirmReset=true;return drawSim();}S.sandbox=sbxSeed();save();SIM.confirmReset=false;SIM.where='easy';resetTx();setMsg('S','Training data reset',{t:'s',m:'Semua data latihan kembali ke kondisi awal.'});return drawSim();}
  SIM.confirmReset=false;
  if(k==='invoice'){const p=d.po.find(x=>x.no===arg);if(!p)return;const i=p.items[0];const no=String(++d.nums.iv);i.iv={no,qty:i.qty,blocked:i.qty>i.gr};
    sbxLog('Invoice',no,`PO ${p.no} · ditagih ${i.qty}, GR ${i.gr} → ${i.iv.blocked?'BLOCKED':'OK'}`);flag('invoice');sbxSave();
    setMsg(i.iv.blocked?'W':'S',`Invoice ${no} posted by Finance – ${i.iv.blocked?'blocked for payment':'released for payment'} (simulation)`,{t:i.iv.blocked?'w':'s',m:i.iv.blocked?`Vendor menagih ${i.qty} tapi GR baru ${i.gr}. 3-way match gagal sehingga invoice di-block. Lihat PO history di ME23N, lalu selesaikan GR sisanya bila barang sudah datang.`:'Qty invoice = qty GR, invoice siap dibayar.'});return drawSim();}
}
/* ===================== STUDI KASUS TERPADU (pertanyaan + praktik SAP) ===================== */
const KQ=(instr,opts,e)=>{const ix=shuffle(opts.map((_,i)=>i));return {k:'q',instr,o:ix.map(i=>opts[i][0]),a:ix.indexOf(0),e,fb:ix.map(i=>opts[i][1])};};
const otherPO=(po,last)=>({title:`Standard PO ${last} Created by SARI`,go:null,blocks:[{t:'note',html:'<p>Gunakan <b>Other Purchase Order</b> (Shift+F5) untuk membuka PO yang dibutuhkan.</p>'}],tbx:[{l:'Other Purchase Order',k:'otherpo'}],popups:{otherpo:{title:'Select Document',fields:[{id:'m.po',l:'Purchase Order',w:12,f4:'ebeln'}],expect:{'m.po':po},next:true}},expect:{}});
SIMS.push(
{id:'k1',kase:true,title:'Invoice tertahan: investigasi sampai tuntas',mod:3,lvl:'Lanjut',
brief:{from:'Bu Ratna, Finance',msg:'Invoice PT Mitra Teknik untuk PO 4500021873 (10 pcs bearing) blocked for payment. Vendor sudah menelepon dua kali dan mengancam menahan pengiriman berikutnya. Tolong cari penyebabnya dan bereskan.'},
steps:[
KQ('Langkah pertama yang paling tepat?',[['Buka ME23N dan baca PO history PO 4500021873',null],['Minta Finance membayar saja supaya vendor tenang','Membayar invoice yang tidak cocok melanggar kontrol 3-way match dan bisa jadi temuan audit.'],['Telepon vendor dan minta invoice dibatalkan','Belum tahu penyebabnya; bisa jadi masalahnya di pihak kita.'],['Buat PO baru untuk vendor','Tidak menyelesaikan invoice yang tertahan.']],'PO history menunjukkan GR dan invoice sekaligus, jadi penyebab block langsung terlihat.'),
{k:'tx',tc:'ME23N',instr:'Buka PO 4500021873 lewat Other Purchase Order, lalu buka tab Purchase Order History.',
screens:[otherPO('4500021873','4500021880'),
{title:'Standard PO 4500021873 Created by SARI',goal:s=>s.tabs.det===3,goalMsg:'Tab Purchase Order History dibuka',blocks:[{t:'kv',rows:[['Vendor','100118 PT Mitra Teknik Abadi'],['Doc. date','21.10.2026'],['Purch. Group','P05'],['Plant','1100']]},
 {t:'table',title:'Item Overview',h:['Itm','A','Material','Short Text','PO Quantity','OUn','Deliv. Date','Net Price','Plnt','SLoc'],r:[['10','','300012457','BEARING SKF 6205-2RS','10','PC','28.10.2026','185.000','1100','1101']]},
 {t:'tabs',key:'det',title:'Item  [ 10 ] 300012457, BEARING SKF 6205-2RS',tabs:[{l:'Quantities/Weights',fields:[{id:'z1',l:'PO Quantity',t:'ro',v:'10 PC'},{id:'z2',l:'Still to be delivered',t:'ro',v:'2 PC'}]},{l:'Delivery',fields:[{id:'z3',l:'Overdeliv. Tol.',t:'ro',v:'0 %'}]},{l:'Conditions',table:{h:['CnTy','Name','Amount','Crcy','per','UoM'],r:[['PB00','Gross Price','185.000','IDR','1','PC']]}},
  {l:'Purchase Order History',table:{h:['Sh. Text','MvT','Material Doc.','Posting Date','Quantity','OUn','Amount (IDR)'],r:[['WE','101','5000187342','04.11.2026','8','PC','1.480.000'],['RE-L','','5105600140 (blocked)','04.11.2026','10','PC','1.850.000']]}}]}]}]},
KQ('Apa penyebab invoice di-block?',[['Qty invoice (10) lebih besar dari qty GR (8)',null],['Harga invoice berbeda dari PO','Harga di Conditions 185.000, sama dengan invoice (1.850.000 ÷ 10).'],['Vendor salah nomor rekening','Bukan bagian dari 3-way match.'],['PO sudah kedaluwarsa','Tidak ada indikasi itu di PO.']],'3-way match gagal karena baru 8 PC yang diterima.'),
KQ('Gudang menemukan surat jalan susulan SJ-MTA/1131 untuk 2 PC sisanya; barang sudah ada di rak sejak kemarin. Tindakanmu?',[['Posting GR 2 PC terhadap PO dengan surat jalan susulan',null],['Minta Finance tetap membayar 10 PC','Tanpa GR, stok dan dokumen tidak cocok.'],['Ubah qty invoice menjadi 8','Invoice adalah wewenang Finance dan dokumen vendor.'],['Buat PO baru 2 PC','Menggandakan pembelian.']],'GR susulan membuat qty GR = qty invoice.'),
{k:'tx',tc:'MIGO',attach:{t:'sj',title:'Surat Jalan SJ-MTA/1131',rows:[['No. SJ','SJ-MTA/1131'],['Ref. PO','4500021873'],['Barang','BEARING SKF 6205-2RS'],['Qty kirim','2 PC']]},instr:'Posting GR 2 PC terhadap PO 4500021873 ke Gudang Sparepart 1101 dengan surat jalan susulan.',
screens:[migoScreen({onEnter:v=>{if(v.ref!=='R01')return null;if(norm(v.po)!=='4500021873')return {msg:['E',`Purchase order ${v.po||''}: no open items for goods receipt in this simulation`]};if(v['it.0.txt'])return null;return {fill:{'it.0.mat':'300012457','it.0.txt':'BEARING SKF 6205-2RS','it.0.qty':'2','it.0.poqty':'10 PC (open 2)','it.0.un':'PC','it.0.lgort':'1101','it.0.werks':'1100','it.0.stock':'Unrestricted use','it.0.po':'4500021873 / 10','it.0.vendor':'100118 PT Mitra Teknik Abadi'},msg:['I','Item data adopted from purchase order 4500021873']};},
 expect:{act:'A01',ref:'R01',po:'4500021873',bwart:'101','it.0.txt':NEED_ENTER('nomor PO'),lfsnr:{eq:'SJ-MTA/1131',idn:'Isi nomor surat jalan susulan.'},'it.0.qty':'2','it.0.lgort':'1101','it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},ok:'Material document 5000187402 posted'})]},
KQ('Apa yang kamu sampaikan ke Finance?',[['GR sudah lengkap 10 PC (5000187342 + 5000187402); invoice bisa di-release untuk pembayaran',null],['Tidak perlu memberi tahu, nanti sistem jalan sendiri','Invoice yang sudah blocked biasanya perlu di-release Finance; informasikan agar cepat diproses.'],['Minta vendor kirim invoice baru','Invoice lama sudah benar 10 PC.'],['Minta Finance membatalkan invoice','Tidak perlu.']],'Komunikasikan nomor dokumen agar Finance bisa me-release invoice dan vendor dibayar.')
]},
{id:'k2',kase:true,title:'Biaya proyek bocor ke cost center',mod:7,lvl:'Lanjut',
brief:{from:'Controller produksi & Pak Hendra',msg:'Controller: "Biaya cost center Line 3 (11PRD310) naik Rp 14 juta minggu ini." Pak Hendra: "Kabel 12 M untuk panel MCC proyek kok belum muncul di CJI3?" Periode November masih terbuka.'},
steps:[
KQ('Dari mana kamu mulai?',[['Cek KSB1 untuk cost center 11PRD310 mulai 01.11.2026',null],['Langsung cancel semua GI minggu ini','Belum tahu mana yang salah; GI rutin yang benar ikut terbatalkan.'],['Minta controller memindahkan biaya manual di Excel','Data SAP tetap salah.'],['Abaikan, nanti beres saat closing','Laporan proyek dan produksi sama-sama salah.']],'KSB1 menunjukkan baris biaya beserta dokumen sumbernya.'),
{k:'tx',tc:'KSB1',instr:'Buka KSB1, isi cost center dan tanggal mulai 01.11.2026, Execute.',
screens:[{title:'Display Actual Cost Line Items for Cost Centers: Initial Screen',sel:1,go:'exec',def:{kokrs:'1000'},blocks:[{t:'group',title:'Cost Center',fields:[{id:'kostl',l:'Cost Center',w:10,f4:'kostl',to:1}]},{t:'group',title:'Posting Data',fields:[{id:'budat',l:'Posting Date',w:10,to:1}]}],expect:{kostl:'11PRD310',budat:{eq:'01.11.2026',idn:'Mulai 01.11.2026.'}}},
 {title:'Display Actual Cost Line Items for Cost Centers',blocks:[{t:'alv',key:'ksb',data:ALV_KSB1}]}]},
KQ('Dokumen mana yang merupakan kabel proyek?',[['4900061512 – KABEL NYY 4X16 x12 M, mvt 201',null],['4900061498 – roller','Itu juga material proyek, tapi kasus ini fokus ke kabel panel MCC.'],['4900061402 – grease','Grease untuk pelumasan rutin memang biaya cost center.'],['5105600201 – jasa perbaikan','Itu jasa perbaikan rutin, benar di cost center.']],'Kabel untuk panel MCC proyek seharusnya 221 ke WBS P-26-014.04.'),
{k:'tx',tc:'MIGO',instr:'Batalkan 4900061512: A03 Cancellation + R02 Material Document, Enter, tulis alasan di HeaderText, Item OK, Post.',
screens:[migoScreen({def:{act:'A03',ref:'R02',bwart:''},onEnter:v=>{if(v.ref!=='R02')return null;if(norm(v.mblnr)!=='4900061512')return {msg:['E',`Material document ${v.mblnr||''} cannot be cancelled in this scenario`],explain:'Batalkan dokumen kabel 4900061512.'};if(v['it.0.txt'])return null;return {fill:{bwart:'202','it.0.mat':'300022105','it.0.txt':'KABEL NYY 4X16','it.0.qty':'12','it.0.un':'M','it.0.lgort':'1102','it.0.werks':'1100','it.0.stock':'Unrestricted use','it.0.kostl':'11PRD310'},msg:['I','Data adopted from material document 4900061512']};},
 expect:{act:'A03',ref:'R02',mblnr:'4900061512','it.0.txt':NEED_ENTER('nomor dokumen'),bktxt:NONEMPTY('Tulis alasan, misalnya "Salah mvt 201, repost 221 ke .04".'),'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},ok:'Material document 4900061545 posted (mvt 202)'})]},
{k:'tx',tc:'MIGO',instr:'Posting ulang: A07 + R10, movement 221, kabel 300022105 12 M dari Gudang Proyek 1102 ke WBS elektrikal.',
screens:[migoScreen({onEnter:migoMatEnter(),expect:{act:'A07',ref:'R10',bwart:{eq:'221',idn:'Proyek → 221.'},'it.0.mat':'300022105','it.0.txt':NEED_ENTER('material'),'it.0.qty':'12','it.0.werks':'1100','it.0.lgort':'1102','it.0.wbs':{eq:'P-26-014.04',sap:'Enter WBS element',idn:'Panel MCC = WBS elektrikal P-26-014.04.'},'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},ok:'Material document 4900061546 posted'})]},
KQ('Isi laporan koreksi yang baik?',[['Biaya Rp 6,6 jt pindah dari CC 11PRD310 ke WBS P-26-014.04; dokumen 4900061512 dibatalkan (4900061545) dan diposting ulang (4900061546); roller 4900061498 masih perlu dicek',null],['"Sudah dibetulkan"','Tidak ada jejak nomor dokumen.'],['Hanya lapor ke vendor','Vendor tidak terkait.'],['Tidak perlu laporan','Controller dan supervisor perlu tahu.']],'Laporan dengan nomor dokumen memudahkan rekonsiliasi dan audit.')
]},
{id:'k3',kase:true,title:'Line berhenti: butuh coupling sekarang',mod:4,lvl:'Menengah',
brief:{from:'Supervisor produksi Line 3 (panik)',msg:'Conveyor Line 3 berhenti, coupling motor FCL-140 pecah! Teknisi maintenance butuh 2 pcs SEKARANG untuk work order breakdown 4000123. Gudang Sparepart bilang kosong.'},
steps:[
KQ('Apa yang kamu lakukan pertama?',[['Cek ketersediaan stok di MMBE',null],['Buat PR urgent','Lead time minimal 14 hari; line tidak bisa menunggu.'],['Ambil coupling dari mesin lain','Membuat mesin lain berisiko berhenti.'],['Telepon vendor minta kirim tanpa PO','Melanggar prosedur dan tetap butuh waktu.']],'Stok mungkin ada di lokasi lain.'),
{k:'tx',tc:'MMBE',instr:'Cek stok coupling 300015577 di semua lokasi.',
screens:[{title:'Stock Overview: Company Code/Plant/Storage Location/Batch',sel:1,go:'exec',blocks:[{t:'group',title:'Database Selections',fields:[{id:'matnr',l:'Material',w:11,f4:'matnr'}]}],expect:{matnr:'300015577'}},
 {title:'Stock Overview: Basic List',blocks:[{t:'kv',rows:[['Material','300015577 COUPLING MOTOR FCL-140'],['Base Unit','PC']]},{t:'table',title:'Stock overview',h:['Client/Company Code/Plant/Storage Location','Unrestricted use','Qual. inspection','Blocked','On-Order Stock'],r:[['▾ Full','12','3','0','10'],['    ▾ 1100 Pabrik Cikarang','6','3','0','10'],['        1101 Gudang Sparepart','0','3','0',''],['        1102 Gudang Proyek','6','0','0',''],['    ▾ 1200 Pabrik Surabaya','6','0','0','0']]}]}]},
KQ('Dari mana 2 pcs diambil?',[['Gudang Proyek 1102 (6 PC unrestricted), dengan sepengetahuan supervisor proyek',null],['Gudang Sparepart 1101 (3 PC quality inspection)','Stok QI belum di-release QA, tidak boleh dipakai.'],['Pabrik Surabaya','Butuh transfer antar plant, terlalu lama.'],['Tunggu on-order 10 PC','Line tidak bisa menunggu.']],'Stok unrestricted di plant yang sama paling cepat.'),
KQ('Movement type yang tepat?',[['261 ke work order 4000123',null],['221 ke WBS proyek','Coupling dipakai untuk breakdown maintenance, bukan proyek. Biayanya masuk order PM.'],['201 ke cost center','Ada work order, jadi biaya dibebankan ke order (261).'],['311','311 hanya memindahkan lokasi.']],'261 = GI ke order; biaya breakdown tercatat di work order.'),
{k:'tx',tc:'MIGO',instr:'Keluarkan 2 PC coupling dari Gudang Proyek ke order 4000123 (movement 261, order di tab Account Assignment).',
screens:[migoScreen({onEnter:migoMatEnter(),expect:{act:'A07',ref:'R10',bwart:{eq:'261',idn:'GI ke order = 261.'},'it.0.mat':'300015577','it.0.txt':NEED_ENTER('material'),'it.0.qty':'2','it.0.werks':'1100','it.0.lgort':{eq:'1102',idn:'Ambil dari Gudang Proyek 1102.'},'it.0.aufnr':{eq:'4000123',sap:'Enter order',idn:'Tab Account Assignment → Order 4000123.'},'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},ok:'Material document 4900061550 posted'})]},
KQ('Stok proyek terpakai 2 PC untuk maintenance. Tindak lanjutnya?',[['Kabari supervisor proyek dan buat PR pengganti (replenish) agar kebutuhan proyek tetap aman',null],['Diamkan saja','Proyek bisa kekurangan material saat dibutuhkan.'],['Ubah hasil opname nanti','Manipulasi stok.'],['Pindahkan 2 PC dari QI ke proyek','QI belum di-release QA.']],'Komunikasi + replenishment menjaga proyek tetap jalan.')
]},
{id:'k4',kase:true,title:'Persiapan opname akhir tahun Gudang Proyek',mod:5,lvl:'Lanjut',
brief:{from:'Bu Ratna, Finance',msg:'Opname akhir tahun Gudang Proyek (1102) Cikarang dijadwalkan 31.12.2026. Tolong cek daftar stoknya dulu, bereskan yang menggantung, lalu buat dokumen opname dengan posting block untuk semua material di sloc itu.'},
steps:[
{k:'tx',tc:'MB52',instr:'Tampilkan stok Gudang Proyek 1102.',
screens:[{title:'Display Warehouse Stocks of Material',sel:1,go:'exec',blocks:[{t:'group',title:'Database Selections',fields:[{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,f4:'lgort'}]}],expect:{werks:'1100',lgort:'1102'}},
 {title:'Display Warehouse Stocks of Material',blocks:[{t:'alv',key:'stk',data:ALV_MB52}]}]},
KQ('Ada stok yang "menggantung"?',[['Ya: motor gearbox 1 PC blocked. Putuskan retur/klaim/scrap bersama QA dan Procurement sebelum opname',null],['Tidak ada','Kolom Blocked menunjukkan 1 PC.'],['Pindahkan sendiri ke unrestricted','Keputusan kualitas adalah wewenang QA.'],['Hapus dari SAP','Tidak ada fungsi "hapus stok"; itu manipulasi.']],'Stok blocked yang dibiarkan sering menjadi temuan saat opname.'),
KQ('Material mana yang masuk dokumen opname?',[['Semua material di sloc 1102, termasuk yang blocked; opname menghitung semua tipe stok',null],['Hanya yang unrestricted','Stok blocked/QI juga harus dihitung.'],['Hanya yang nilainya besar','Opname tahunan mencakup semua material di lokasi itu.'],['Tidak perlu daftar','Dokumen opname butuh daftar item.']],'Masukkan kelima material sesuai urutan MB52.'),
{k:'tx',tc:'MI01',instr:'Buat dokumen opname: tanggal hitung 31.12.2026, plant 1100, sloc 1102, posting block. Lalu isi lima material sesuai urutan MB52, Enter, Save.',
screens:[
{title:'Create Physical Inventory Document: Initial Screen',go:'enter',def:{bldat:TODAY},blocks:[{t:'group',title:'Document data',fields:[{id:'bldat',l:'Document Date',w:10},{id:'gidat',l:'Planned Count Date',w:10},{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,f4:'lgort'}]},{t:'group',title:'Other information',fields:[{id:'sperr',l:'Posting Block',t:'chk'}]}],
 expect:{gidat:{eq:'31.12.2026',idn:'Tanggal hitung 31.12.2026.'},werks:'1100',lgort:'1102',sperr:{eq:true,idn:'Centang Posting Block.'}}},
{title:'Create Physical Inventory Document: New Items',go:'save',blocks:[{t:'items',key:'mi',title:'Items',rows:5,cols:[{id:'itm',l:'Item',ro:1,v:r=>String(r+1).padStart(3,'0')},{id:'mat',l:'Material',w:11,f4:'matnr'},{id:'txt',l:'Material Description',ro:1},{id:'st',l:'S',ro:1,v:()=>'1'}]}],
 onEnter:v=>{const out={};for(let r=0;r<5;r++){const m=v[`mi.${r}.mat`];if(m){const M=MAT[norm(m)];if(!M)return {msg:['E',`Material ${m} does not exist in plant 1100`]};out[`mi.${r}.txt`]=M.d;}}return {fill:out};},
 expect:{'mi.0.mat':'300022105','mi.1.mat':'300031150','mi.2.mat':'300015577','mi.3.mat':'300040220','mi.4.mat':'300050310','mi.0.txt':NEED_ENTER('material')},ok:'Phys. inv. doc. 100000360 created'}]},
KQ('Kapan posting block berakhir?',[['Setelah hasil hitung diinput dan selisih diposting; selama itu jangan ada GR/GI untuk item tersebut',null],['Besok pagi otomatis','Tidak berdasarkan waktu.'],['Tidak pernah','Block berakhir setelah proses opname selesai.'],['Saat vendor datang','Tidak terkait vendor.']],'Umumkan cut-off ke gudang dan proyek agar tidak ada transaksi tertunda.')
]},
{id:'k5',kase:true,title:'Proyek mendekati over budget',mod:7,lvl:'Lanjut',
brief:{from:'Pak Hendra, Project Supervisor',msg:'Saya butuh kabel tambahan Rp 45 juta untuk proyek P-26-014. Tolong buatkan PR hari ini ya, budget kita kan Rp 850 juta.'},
steps:[
KQ('Sebelum membuat PR, apa yang kamu lakukan?',[['Cek actual (CJI3) dan komitmen (CJI5) proyek untuk tahu sisa budget',null],['Langsung buat PR','Berisiko melampaui budget tanpa persetujuan.'],['Tanya vendor harga terbaru','Tidak menjawab soal budget.'],['Tolak tanpa alasan','Keputusan harus berbasis data.']],'Data biaya menentukan apakah PR boleh diproses.'),
{k:'tx',tc:'CJI3',instr:'Buka CJI3 (database profile 000000000001), project P-26-014, lalu Σ kolom nilai.',
popup:{once:'dbprof',title:'Database Profile',fields:[{id:'m.prof',l:'Database prof.',w:14,f4:'dbprof'}],expect:{'m.prof':{eq:'000000000001',idn:'Pakai profil standar 000000000001 (F4).'}}},
screens:[{title:'Display Actual Cost Line Items for Projects',sel:1,go:'exec',blocks:selCJI(),expect:{pspid:'P-26-014'}},
 {title:'Display Actual Cost Line Items for Projects',goal:s=>(s.alv.act||{}).sum==='val',goalMsg:'Total dihitung dengan Σ',blocks:[{t:'alv',key:'act',data:ALV_CJI3}]}]},
{k:'tx',tc:'CJI5',instr:'Sekarang lihat komitmen di CJI5 untuk project yang sama.',popup:{once:'dbprof'},
screens:[{title:'Display Commitment Line Items for Projects',sel:1,go:'exec',blocks:selCJI(),expect:{pspid:'P-26-014'}},{title:'Display Commitment Line Items for Projects',blocks:[{t:'alv',key:'com',data:ALV_CJI5}]}]},
KQ('Actual 610 jt, komitmen 230 jt. Berapa sisa dan apakah PR 45 jt aman?',[['Sisa 10 jt; PR 45 jt melebihi sisa 35 jt',null],['Sisa 240 jt; aman','Komitmen PO juga mengikat budget.'],['Sisa 620 jt; aman','Salah hitung.'],['Sisa 0; tidak bisa apa-apa','Sisa 10 jt, dan ada opsi tambahan budget.']],'850 − 610 − 230 = 10 jt.'),
KQ('Tindakan yang tepat?',[['Sampaikan data ke Pak Hendra: perlu tambahan budget (supplement) atau perubahan scope sebelum PR diproses',null],['Buat PR dengan WBS proyek lain yang masih ada budget','Memindahkan biaya ke proyek lain adalah temuan audit.'],['Pecah PR jadi 5 × 9 jt','Memecah PR untuk menghindari kontrol tidak diperbolehkan.'],['Buat PR ke cost center produksi','Salah objek biaya, dan CAPEX jadi OPEX.']],'Admin memberi data; keputusan budget ada di pemilik proyek/controller.'),
KQ('Status biaya di laporan mingguan?',[['Red/Amber dengan penjelasan: sisa 1%, kebutuhan tambahan 45 jt, menunggu keputusan budget',null],['Green','Sisa 1% dengan kebutuhan tambahan adalah risiko nyata.'],['Tidak dilaporkan','Menutupi risiko.'],['Green tapi dengan catatan kecil','Status harus mencerminkan risiko.']],'Peringatan dini membantu management memutuskan tepat waktu.')
]},
{id:'k6',kase:true,title:'Barang food-grade datang, dokumen belum lengkap',mod:4,lvl:'Menengah',
brief:{from:'Bu Wulan, QA',msg:'Belt food grade PO 4500021925 datang 30 M (SJ-FB/0771). COA ada, tapi food contact declaration dari vendor belum dikirim. Belt ini akan kontak langsung dengan produk.'},
attach:{t:'sj',title:'Surat Jalan SJ-FB/0771',rows:[['No. SJ','SJ-FB/0771'],['Ref. PO','4500021925'],['Barang','BELT FOOD GRADE PU 2MM'],['Qty kirim','30 M'],['Dokumen','COA ada · food contact declaration BELUM']]},
steps:[
KQ('Bagaimana penerimaan barang ini di SAP?',[['GR ke stok Quality inspection; QA menahan sampai dokumen lengkap',null],['Tolak seluruh barang di depan pintu','Barang fisik sesuai PO; masalahnya dokumen, jadi cukup ditahan di QI.'],['GR ke unrestricted supaya cepat dipakai','Bisa terpakai sebelum lolos QA, berisiko keamanan pangan.'],['Jangan di-GR, simpan saja','Barang tanpa GR tidak tercatat dan invoice tidak bisa diproses.']],'QI stock memastikan barang tercatat tetapi tidak bisa dipakai.'),
{k:'tx',tc:'MIGO',instr:'GR terhadap PO 4500021925, stock type Quality inspection (tab Where), Delivery Note, Item OK, Post.',
screens:[migoScreen({onEnter:v=>{if(v.ref!=='R01')return null;if(norm(v.po)!=='4500021925')return {msg:['E',`Purchase order ${v.po||''}: no open items for goods receipt in this simulation`]};if(v['it.0.txt'])return null;return {fill:{'it.0.mat':'300045002','it.0.txt':'BELT FOOD GRADE PU 2MM','it.0.qty':'30','it.0.poqty':'30 M','it.0.un':'M','it.0.lgort':'1102','it.0.werks':'1100','it.0.insmk':'','it.0.po':'4500021925 / 10','it.0.vendor':'100152 PT Food Belt Indonesia',_stockSel:true},msg:['I','Item data adopted from purchase order 4500021925']};},
 expect:{act:'A01',ref:'R01',po:'4500021925',bwart:'101','it.0.txt':NEED_ENTER('nomor PO'),lfsnr:'SJ-FB/0771','it.0.qty':'30','it.0.insmk':{eq:'2',sap:'Check entry in field Stock Type',idn:'Tab Where → Stock type: 2 Quality inspection.'},'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},ok:'Material document 5000187375 posted'})]},
KQ('Vendor tidak bisa mengirim declaration dalam 7 hari, padahal instalasi dijadwalkan lusa. Tindakanmu?',[['Eskalasi ke QA & Procurement; QA memutuskan (tahan/blocked/retur), Procurement menagih dokumen ke vendor; update jadwal di laporan & database PWO',null],['Pakai saja, dokumen menyusul','Melanggar persyaratan keamanan pangan.'],['Pindahkan ke unrestricted sendiri','Usage decision adalah wewenang QA.'],['Pasang di area non-food tanpa izin QA','Tetap perlu keputusan QA.']],'Risiko jadwal dikomunikasikan, bukan diakali.'),
KQ('Di mana COA dan nantinya declaration disimpan?',[['Folder proyek dengan penamaan standar + nomor material document 5000187375, dan ditautkan di database PWO',null],['Laptop pribadi','Tidak bisa diakses tim dan auditor.'],['Tidak perlu disimpan','Dokumen wajib untuk audit keamanan pangan.'],['Dikirim balik ke vendor','Perusahaan wajib menyimpan salinannya.']],'Document control yang rapi mempercepat audit.')
]}
);

/* ===================== SKENARIO MODUL INTI: SD, FI, PP, WM ===================== */
SIMS.forEach(s=>{if(typeof s.mod==='number')s.mod=LEG_MAP[s.mod][0];});
Object.assign(KNOWN,{VA01:'Create Sales Order',VA02:'Change Sales Order',VA03:'Display Sales Order',VA05:'List of Sales Orders',VL01N:'Create Outbound Delivery with Order Reference',VL02N:'Change Outbound Delivery',VL06O:'Outbound Delivery Monitor',VF01:'Create Billing Document',VF03:'Display Billing Document',
 FB60:'Enter Incoming Invoices',FB50:'Enter G/L Account Document',FB03:'Display Document','F-53':'Post Outgoing Payments',FBL1N:'Vendor Line Item Display',FBL5N:'Customer Line Item Display',F110:'Automatic Payment Transactions',
 MD04:'Display Stock/Requirements Situation',MD01N:'MRP Live',CO01:'Create Production Order',CO03:'Display Production Order',CO11N:'Enter Time Ticket for Production Order',
 LT01:'Create Transfer Order',LT12:'Confirm Transfer Order',LX02:'Stock List'});
FAVS.push('VA01','VL01N','VF01','FB60','F-53','FBL1N','MD04','CO01','LT01','LT12','LX02');
TREE[0].c.push(
 {l:'Sales and Distribution',c:[{l:'Sales',c:[{l:'Order',c:[['VA01','Create'],['VA03','Display']]}]},{l:'Shipping and Transportation',c:[{l:'Outbound Delivery',c:[['VL01N','Create - Single Document']]}]},{l:'Billing',c:[{l:'Billing Document',c:[['VF01','Create']]}]}]},
 {l:'Production',c:[{l:'MRP',c:[{l:'Evaluations',c:[['MD04','Stock/Reqmts List']]}]},{l:'Shop Floor Control',c:[{l:'Order',c:[{l:'Create',c:[['CO01','With Material']]}]}]}]},
 {l:'Logistics Execution',c:[{l:'Internal Whse Processes',c:[{l:'Stock Transfer',c:[{l:'Create Transfer Order',c:[['LT01','No Source Object']]}]},{l:'Confirm',c:[['LT12','Transfer Order – Single Document']]}]},{l:'Information System',c:[{l:'Warehouse',c:[['LX02','Stock per Bin']]}]}]});
TREE[1].c[0].c.push({l:'Accounts Payable',c:[{l:'Document Entry',c:[['FB60','Invoice'],['F-53','Outgoing Payment – Post']]},{l:'Account',c:[['FBL1N','Display/Change Line Items']]}]});
const FG={'500010':{d:'BISKUIT KELAPA 200G (KARTON)',u:'CAR',p:96000},'500011':{d:'BISKUIT COKLAT 200G (KARTON)',u:'CAR',p:99000},'500020':{d:'WAFER VANILA 150G (KARTON)',u:'CAR',p:84000}};
Object.assign(F4,{auart:[['OR','Standard Order'],['RE','Returns'],['QT','Quotation']],vkorg:[['1000','Sales Org Indonesia']],vtweg:[['10','Modern trade'],['20','General trade']],spart:[['00','Cross-division']],
 kunnr:[['200145','PT Sumber Retail – Kantor Pusat'],['200146','PT Sumber Retail – DC Cibitung'],['200210','CV Toko Makmur']],matfg:Object.entries(FG).map(([k,v])=>[k,v.d]),
 vstel:[['1100','Shipping Point Cikarang']],vbeln:[['10000871','PT Sumber Retail · 120 CAR']],vbelnd:[['80001542','Delivery PT Sumber Retail · 120 CAR']],
 lifnr:[['100230','PT Lift Prima'],['100118','PT Mitra Teknik Abadi'],['100125','CV Sinar Elektrik']],saknr:[['610300','Beban sewa peralatan'],['610100','Beban listrik'],['510200','Sparepart & consumable']],hkont:[['111210','Bank Mandiri – outgoing'],['111310','Bank BCA – outgoing']],
 matpp:[['500010','BISKUIT KELAPA 200G (KARTON)'],['400020','GULA PASIR'],['400031','TEPUNG TERIGU']],auartpp:[['PP01','Standard production order']],
 lgnum:[['110','Gudang FG Cikarang']],bwlvs:[['999','Manual stock transfer'],['101','GR for purchase order'],['601','GI for delivery']],lgtyp:[['001','High rack'],['002','Picking area'],['902','GR area']],tanum:[['4711','500010 · 40 CAR · 001 → 002']]});
F4.kostl.push(['11WH100','Gudang FG']);F4.lgort.push(['1001','Gudang Barang Jadi']);
const numv=s=>{const t=String(s??'').trim().replace(/\s/g,'');if(!t)return NaN;return +(t.includes(',')?t.replace(/\./g,'').replace(',','.'):t.replace(/\./g,''));};
const AMT=(n,idn,sap)=>({eq:String(n),fn:x=>numv(x)===n?null:{sap:sap||(String(x??'').trim()?'Check entry in field Amount':'Fill in all required entry fields'),idn}});
const ALV_FBL1N={cols:[{id:'doc',l:'DocumentNo'},{id:'ty',l:'Type'},{id:'ref',l:'Reference'},{id:'dd',l:'Net due dt',date:1},{id:'val',l:'Amount in LC',num:1},{id:'blk',l:'Pmnt block'},{id:'txt',l:'Text'}],
 rows:[{doc:'1900004377',ty:'KR',ref:'INV-LP-0870',dd:'05.11.2026',val:12500000,blk:'A',txt:'Sewa forklift Okt – dispute jam operasi'},{doc:'1900004601',ty:'KR',ref:'INV-LP-0925',dd:'14.12.2026',val:7500000,blk:'',txt:'Servis forklift'}]};
const ALV_LX02={cols:[{id:'typ',l:'Typ'},{id:'bin',l:'StorageBin'},{id:'mat',l:'Material'},{id:'txt',l:'Material Description'},{id:'qty',l:'Avail. stock',num:1},{id:'bun',l:'BUn'},{id:'gr',l:'GR Date',date:1}],
 rows:[{typ:'001',bin:'001-02-03',mat:'500010',txt:'BISKUIT KELAPA 200G (KARTON)',qty:160,bun:'CAR',gr:'28.10.2026'},{typ:'001',bin:'001-05-01',mat:'500010',txt:'BISKUIT KELAPA 200G (KARTON)',qty:240,bun:'CAR',gr:'15.10.2026'},{typ:'001',bin:'001-07-02',mat:'500010',txt:'BISKUIT KELAPA 200G (KARTON)',qty:200,bun:'CAR',gr:'02.11.2026'},{typ:'002',bin:'P-01-04',mat:'500010',txt:'BISKUIT KELAPA 200G (KARTON)',qty:40,bun:'CAR',gr:'28.10.2026'}]};

SIMS.push(
{id:'d1',title:'Buat sales order standar (VA01)',mod:'sd',lvl:'Menengah',
brief:{from:'Bu Sinta, Key Account Manager',msg:'PT Sumber Retail (sold-to 200145) pesan 120 karton Biskuit Kelapa 200g, nomor PO mereka PO-SR-7781. Kirim ke DC Cibitung mereka (ship-to 200146), diminta tiba 18.11.2026. Pakai order standar, sales org 1000, channel modern trade, division 00.'},
steps:[
{k:'tx',tc:'VA01',instr:'Buka VA01. Isi order type dan sales area, Enter. Di overview isi sold-to, ship-to, cust. reference, tanggal kirim, lalu baris item. Enter untuk memuat harga, lalu Save.',
screens:[
 {title:'Create Sales Documents',go:'enter',blocks:[{t:'group',title:'',fields:[{id:'auart',l:'Order Type',w:4,f4:'auart'}]},{t:'group',title:'Organizational Data',fields:[{id:'vkorg',l:'Sales Organization',w:5,f4:'vkorg'},{id:'vtweg',l:'Distribution Channel',w:3,f4:'vtweg'},{id:'spart',l:'Division',w:3,f4:'spart'}]}],
  expect:{auart:{eq:'OR',idn:'Order standar = OR (Standard Order).'},vkorg:'1000',vtweg:{eq:'10',idn:'Modern trade = channel 10.'},spart:'00'},hints:{auart:'F4 → Standard Order',vtweg:'Modern trade'}},
 {title:'Create Standard Order: Overview',go:'save',
  blocks:[{t:'group',title:'',fields:[{id:'kunnr',l:'Sold-To Party',w:10,f4:'kunnr'},{id:'kunwe',l:'Ship-To Party',w:10,f4:'kunnr'},{id:'bstkd',l:'Cust. Reference',w:20},{id:'vdatu',l:'Req. deliv.date',w:10}]},
   {t:'items',key:'it',title:'All Items',rows:3,cols:[{id:'itm',l:'Item',ro:1,v:r=>(r+1)*10},{id:'mat',l:'Material',w:9,f4:'matfg'},{id:'qty',l:'Order Quantity',w:6},{id:'un',l:'SU',ro:1},{id:'txt',l:'Description',ro:1},{id:'net',l:'Net value',ro:1}]}],
  onEnter:v=>{const out={};if(v.kunnr&&!v.kunwe)out.kunwe=v.kunnr;const m=v['it.0.mat'];
   if(m){const f=FG[norm(m)];if(!f)return {msg:['E',`Material ${m} is not defined for sales org.1000, distr.chan.10, language EN`],explain:'Material tidak ada di sales area ini. Pakai F4.'};
    out['it.0.txt']=f.d;out['it.0.un']=f.u;const q=numv(v['it.0.qty']);if(q>0)out['it.0.net']=(q*f.p).toLocaleString('id-ID');}
   return {fill:out,msg:out['it.0.net']?['S','Pricing carried out: PR00 96.000 IDR / CAR']:null,explain:out.kunwe&&!v.kunwe?{t:'i',m:'SAP mengisi ship-to sama dengan sold-to. Brief meminta kirim ke DC Cibitung, jadi ubah ke 200146.'}:null};},
  expect:{kunnr:'200145',kunwe:{eq:'200146',idn:'Barang dikirim ke DC Cibitung (ship-to 200146), bukan ke kantor pusat.'},bstkd:{eq:'PO-SR-7781',idn:'Nomor PO customer wajib diisi di Cust. Reference agar invoice diterima customer.'},vdatu:{eq:'18.11.2026',idn:'Tanggal kirim dari brief: 18.11.2026.'},'it.0.mat':'500010','it.0.qty':'120','it.0.txt':NEED_ENTER('material')},
  hints:{kunnr:'Kantor pusat',kunwe:'DC Cibitung','it.0.mat':'F4 → biskuit kelapa'},ok:'Standard Order 10000871 has been saved'}]},
{k:'q',instr:'Order 10000871 tersimpan. Siapa yang akan menerima tagihan dan siapa yang menerima barang?',o:['Tagihan ke 200145 (kantor pusat), barang ke 200146 (DC Cibitung)','Keduanya ke 200146','Keduanya ke 200145','Tagihan ke DC, barang ke kantor pusat'],a:0,e:'Partner function memisahkan sold-to/bill-to/payer dengan ship-to.'},
{k:'q',instr:'Apa fungsi Cust. Reference PO-SR-7781?',o:['Mencatat nomor PO customer agar invoice cocok dengan dokumen mereka','Nomor dokumen SAP otomatis','Kode diskon','Nomor delivery'],a:0,e:'Banyak customer modern trade menolak invoice tanpa nomor PO mereka.'}
]},
{id:'d2',title:'Kirim & tagih order (VL01N → VF01)',mod:'sd',lvl:'Lanjut',
brief:{from:'Pak Dimas, Supervisor Gudang FG',msg:'Order 10000871 PT Sumber Retail sudah di-pick lengkap 120 karton dan truk siap. Tolong buat delivery dari shipping point 1100, isi picked qty, lalu Post Goods Issue. Setelah itu buatkan billing-nya.'},
steps:[
{k:'tx',tc:'VL01N',instr:'Buka VL01N, isi shipping point dan nomor order, Enter. Isi Picked Qty, lalu klik Post Goods Issue.',
screens:[
 {title:'Create Outbound Delivery with Order Reference',go:'enter',def:{ledat:TODAY},blocks:[{t:'group',title:'',fields:[{id:'vstel',l:'Shipping Point',w:5,f4:'vstel'},{id:'ledat',l:'Selection Date',w:10}]},{t:'group',title:'Sales Order Data',fields:[{id:'vbeln',l:'Order',w:10,f4:'vbeln'}]}],
  expect:{vstel:'1100',vbeln:{eq:'10000871',idn:'Nomor order dari brief: 10000871 (F4).'}},hints:{vbeln:'F4 → PT Sumber Retail'}},
 {title:'Outbound Delivery Create: Overview',go:'save',saveLabel:'Post Goods Issue',blocks:[{t:'kv',rows:[['Ship-To Party','200146 PT Sumber Retail – DC Cibitung'],['Planned GI','17.11.2026'],['Delivery date','18.11.2026']]},
   {t:'items',key:'dl',title:'Item Overview · Picking',rows:1,cols:[{id:'itm',l:'Item',ro:1,v:()=>'10'},{id:'mat',l:'Material',ro:1,v:()=>'500010'},{id:'txt',l:'Description',ro:1,v:()=>'BISKUIT KELAPA 200G (KARTON)'},{id:'qty',l:'Deliv. Qty',ro:1,v:()=>'120'},{id:'un',l:'SU',ro:1,v:()=>'CAR'},{id:'sloc',l:'SLoc',ro:1,v:()=>'1001'},{id:'pikmg',l:'Picked Qty',w:6}]}],
  expect:{'dl.0.pikmg':{eq:'120',idn:'Picked qty harus sama dengan delivery qty (120) sebelum PGI. Kalau kurang, SAP tidak mengizinkan goods issue untuk qty penuh.'}},hints:{'dl.0.pikmg':'Sama dengan Deliv. Qty'},ok:'Outbound Delivery 80001542 has been saved'}]},
{k:'q',instr:'Apa yang terjadi di sistem saat Post Goods Issue?',o:['Stok FG di sloc 1001 berkurang 120 CAR (mvt 601) dan HPP terposting di FI','Customer langsung ditagih','PO ke vendor dibuat','Tidak ada perubahan stok'],a:0,e:'PGI = movement type 601: stok berkurang dan dokumen akuntansi HPP vs persediaan terbentuk.'},
{k:'tx',tc:'VF01',instr:'Buka VF01, isi nomor delivery di baris pertama, Enter. Periksa payer dan nilai, lalu Save.',
screens:[
 {title:'Create Billing Document',go:'enter',blocks:[{t:'items',key:'bd',title:'Documents to be processed',rows:3,cols:[{id:'doc',l:'Document',w:10,f4:'vbelnd'}]}],expect:{'bd.0.doc':{eq:'80001542',idn:'Billing dibuat dari delivery 80001542 (bukan dari nomor order).'}},hints:{'bd.0.doc':'Nomor delivery dari langkah sebelumnya'}},
 {title:'Invoice (F2) Create: Overview of Billing Items',go:'save',blocks:[{t:'kv',rows:[['Payer','200145 PT Sumber Retail – Kantor Pusat'],['Billing Date','04.11.2026'],['Net Value','11.520.000 IDR'],['Tax Amount (PPN 11%)','1.267.200 IDR']]},
   {t:'table',title:'Billing items',h:['Item','Material','Description','Billed Qty','SU','Net value'],r:[['10','500010','BISKUIT KELAPA 200G (KARTON)','120','CAR','11.520.000']]}],ok:'Document 90003310 has been saved'}]},
{k:'q',instr:'Setelah billing 90003310 disimpan, piutang tercatat atas nama siapa dan berapa nilainya?',o:['Customer 200145 sebesar Rp 12.787.200 (net + PPN)','Customer 200146 sebesar Rp 11.520.000','Vendor 100230','Belum ada piutang sampai customer bayar'],a:0,e:'Billing memposting piutang ke payer: 11.520.000 + 1.267.200 = 12.787.200.'}
]},
{id:'f1',title:'Posting invoice vendor tanpa PO (FB60)',mod:'fi-ap',lvl:'Menengah',
brief:{from:'Bu Ratna, Finance AP Lead',msg:'Tolong posting invoice PT Lift Prima (vendor 100230) no. INV-LP-0911 tanggal 03.11.2026, sewa forklift November Rp 15.000.000 (tanpa PPN untuk latihan ini). Bebankan ke akun 610300 beban sewa peralatan, cost center Gudang FG 11WH100.'},
steps:[
{k:'tx',tc:'FB60',instr:'Buka FB60. Isi data header (vendor, tanggal invoice, amount, reference), lalu baris G/L: akun, amount, cost center. Pastikan saldo nol, lalu Post.',
screens:[{title:'Enter Vendor Invoice: Company Code 1000',go:'save',saveLabel:'Post',def:{budat:TODAY},
 blocks:[{t:'group',title:'Basic data',fields:[{id:'lifnr',l:'Vendor',w:10,f4:'lifnr'},{id:'bldat',l:'Invoice date',w:10},{id:'budat',l:'Posting Date',w:10},{id:'wrbtr',l:'Amount',w:14},{id:'xblnr',l:'Reference',w:16},{id:'sgtxt',l:'Text',w:30}]},
  {t:'items',key:'gl',title:'Items',rows:2,cols:[{id:'saknr',l:'G/L acct',w:8,f4:'saknr'},{id:'dc',l:'D/C',ro:1,v:()=>'Debit'},{id:'amt',l:'Amount in doc.curr.',w:12},{id:'kostl',l:'Cost center',w:9,f4:'kostl'}]}],
 expect:{lifnr:'100230',bldat:{eq:'03.11.2026',idn:'Invoice date = tanggal di dokumen vendor (03.11.2026).'},wrbtr:AMT(15000000,'Amount header = total tagihan vendor, Rp 15.000.000.'),xblnr:{eq:'INV-LP-0911',idn:'Nomor invoice vendor di Reference mencegah invoice yang sama diposting dua kali.'},
  'gl.0.saknr':{eq:'610300',idn:'Sewa peralatan = 610300 (F4).'},'gl.0.amt':AMT(15000000,'Total baris G/L harus sama dengan amount header. Indikator saldo harus nol sebelum Post.','Balance in transaction currency'),'gl.0.kostl':{eq:'11WH100',idn:'Akun beban butuh cost center. Gudang FG = 11WH100.'}},
 hints:{lifnr:'F4 → Lift Prima','gl.0.saknr':'F4 → sewa','gl.0.kostl':'F4 → Gudang FG'},ok:'Document 1900004512 was posted in company code 1000'}]},
{k:'q',instr:'Payment terms vendor ini 30 hari dari invoice date. Kapan invoice jatuh tempo?',o:['03.12.2026','04.12.2026','03.11.2026','30.11.2026'],a:0,e:'03.11.2026 + 30 hari = 03.12.2026. F110 akan mengambilnya pada payment run yang melewati tanggal itu.'},
{k:'q',instr:'Kenapa invoice ini memakai FB60, bukan MIRO?',o:['Tidak ada PO; sewa bulanan dibebankan langsung ke akun biaya dan cost center','FB60 lebih cepat','MIRO hanya untuk impor','Vendor tidak punya NPWP'],a:0,e:'MIRO untuk invoice dengan referensi PO (3-way match). Tanpa PO → FB60.'}
]},
{id:'f2',title:'Bayar vendor manual & cek sisa hutang (F-53, FBL1N)',mod:'fi-ap',lvl:'Lanjut',
brief:{from:'Bu Ratna, Finance AP Lead',msg:'PT Lift Prima minta pembayaran INV-LP-0911 (Rp 15.000.000) hari ini lewat Bank Mandiri (akun 111210). Jangan ikut bayar INV-LP-0870, masih dispute jam operasi. Setelah itu cek berapa sisa hutang kita ke vendor ini.'},
steps:[
{k:'tx',tc:'F-53',instr:'Buka F-53. Isi bank, amount, dan vendor di Open item selection, lalu klik Process Open Items (Enter). Pilih hanya invoice yang dibayar, lalu Post.',
screens:[
 {title:'Post Outgoing Payments: Header Data',go:'enter',def:{bldat:TODAY,budat:TODAY,bukrs:'1000',blart:'KZ'},
  blocks:[{t:'group',title:'',fields:[{id:'bldat',l:'Document Date',w:10},{id:'blart',l:'Type',t:'ro'},{id:'bukrs',l:'Company Code',w:5},{id:'budat',l:'Posting Date',w:10}]},{t:'group',title:'Bank data',fields:[{id:'hkont',l:'Account',w:8,f4:'hkont'},{id:'wrbtr',l:'Amount',w:14}]},{t:'group',title:'Open item selection',fields:[{id:'agkon',l:'Account',w:10,f4:'lifnr'},{id:'agkoa',l:'Account Type',t:'ro'}]}],
  onEnter:()=>({fill:{agkoa:'K'}}),
  expect:{hkont:{eq:'111210',idn:'Bank Mandiri outgoing = 111210.'},wrbtr:AMT(15000000,'Amount pembayaran = Rp 15.000.000.'),agkon:{eq:'100230',idn:'Vendor yang dibayar: PT Lift Prima 100230.'}},hints:{hkont:'F4 → Mandiri',agkon:'F4 → Lift Prima'}},
 {title:'Post Outgoing Payments Process open items',go:'save',saveLabel:'Post',blocks:[{t:'kv',rows:[['Entered','15.000.000 IDR'],['Assigned','dihitung dari item yang dipilih'],['Not assigned','harus 0 sebelum Post']]},
   {t:'items',key:'op',title:'Open items · Vendor 100230',rows:2,cols:[{id:'sel',l:'Select',t:'chk'},{id:'belnr',l:'Document',ro:1,v:r=>['1900004512','1900004377'][r]},{id:'xblnr',l:'Reference',ro:1,v:r=>['INV-LP-0911','INV-LP-0870'][r]},{id:'bldat',l:'Doc. Date',ro:1,v:r=>['03.11.2026','06.10.2026'][r]},{id:'amt',l:'Net amount',ro:1,v:r=>['15.000.000','12.500.000'][r]}]}],
  expect:{'op.0.sel':{eq:true,sap:'Difference too large for clearing',idn:'Pilih INV-LP-0911 supaya pembayaran 15 jt ter-assign. Not assigned harus 0.'},'op.1.sel':{eq:false,sap:'Difference too large for clearing',idn:'INV-LP-0870 masih dispute dan tidak dibayar. Jika ikut dipilih, assigned 27,5 jt tidak sama dengan entered 15 jt.'}},ok:'Document 1500003321 was posted in company code 1000'}]},
{k:'tx',tc:'FBL1N',instr:'Buka FBL1N untuk vendor 100230, company code 1000, Open items. Execute, lalu hitung total dengan Σ di kolom Amount in LC.',
screens:[
 {title:'Vendor Line Item Display',sel:1,go:'exec',def:{bukrs:'1000',xopsel:true},blocks:[{t:'group',title:'Vendor selection',fields:[{id:'lifnr',l:'Vendor account',w:10,f4:'lifnr',to:1},{id:'bukrs',l:'Company code',w:5,to:1}]},{t:'group',title:'Line item selection',fields:[{id:'xopsel',l:'Open items',t:'chk'},{id:'xclsel',l:'Cleared items',t:'chk'},{id:'xaisel',l:'All items',t:'chk'}]}],
  expect:{lifnr:'100230',bukrs:'1000'},hints:{lifnr:'Lift Prima'}},
 {title:'Vendor Line Item Display',goal:s=>(s.alv.op||{}).sum==='val',goalMsg:'Total hutang terbuka dihitung dengan Σ',blocks:[{t:'alv',key:'op',data:ALV_FBL1N}]}]},
{k:'q',instr:'Berapa sisa hutang terbuka ke PT Lift Prima, dan kenapa INV-LP-0870 punya payment block A?',o:['Rp 20.000.000; A = diblok manual untuk pembayaran karena masih dispute, sehingga F110 tidak membayarnya','Rp 35.000.000; A = sudah dibayar','Rp 7.500.000; A = retur barang','Rp 12.500.000; A = reversal'],a:0,e:'12,5 jt + 7,5 jt = 20 jt. Invoice 0911 sudah cleared oleh F-53 sehingga tidak muncul lagi di open items.'}
]},
{id:'p1',title:'Baca kebutuhan material di MD04',mod:'pp',lvl:'Menengah',
brief:{from:'Pak Yoga, Kepala PPIC',msg:'Produksi biskuit minggu depan naik. Tolong cek situasi gula pasir (400020) di plant 1100: kapan stoknya mulai tidak cukup, dan apa yang harus kita minta ke purchasing?'},
steps:[
{k:'tx',tc:'MD04',instr:'Buka MD04, isi material dan plant, Enter. Baca kolom Available qty dan Exception.',
screens:[
 {title:'Stock/Requirements List: Initial Screen',go:'enter',blocks:[{t:'group',title:'Individual Access',fields:[{id:'matnr',l:'Material',w:10,f4:'matpp'},{id:'werks',l:'Plant',w:5,f4:'werks'}]}],expect:{matnr:{eq:'400020',idn:'Gula pasir = 400020 (F4).'},werks:'1100'},hints:{matnr:'F4 → gula'}},
 {title:'Stock/Requirements List as of 09:42 hrs',blocks:[{t:'kv',rows:[['Material','400020 GULA PASIR'],['MRP type','PD  MRP'],['Plant','1100'],['Base Unit','KG']]},
   {t:'table',title:'Receipts / requirements',h:['Date','MRP element','MRP element data','Rec./reqd qty','Available qty','Exception'],r:[['04.11.2026','Stock','','','8.000',''],['06.11.2026','OrdRes','1000452/0010','-6.000','2.000',''],['10.11.2026','DepReq','0000031207 PlOrd.','-5.000','-3.000',''],['12.11.2026','POitem','4500021960/00010','10.000','7.000','10 Reschedule in'],['16.11.2026','DepReq','0000031215 PlOrd.','-4.000','3.000','']]}]}]},
{k:'q',instr:'Kapan stok gula pertama kali tidak cukup?',o:['10.11.2026 (available -3.000 KG)','06.11.2026','12.11.2026','Tidak pernah kurang'],a:0,e:'Setelah kebutuhan planned order 31207 pada 10.11, available menjadi -3.000 KG.'},
{k:'q',instr:'Exception "Reschedule in" pada PO 4500021960 artinya dan tindak lanjutnya?',o:['PO datang terlambat dari kebutuhan; minta purchasing memajukan pengiriman ke ≤ 10.11.2026','PO harus dibatalkan','Stok berlebih, tunda PO','Ubah BOM biskuit'],a:0,e:'Reschedule in = majukan tanggal penerimaan agar tidak terjadi kekurangan.'}
]},
{id:'p2',title:'Buat production order (CO01)',mod:'pp',lvl:'Menengah',
brief:{from:'Pak Yoga, Kepala PPIC',msg:'Buatkan production order standar untuk 2.400 karton Biskuit Kelapa 200g (500010) di plant 1100, harus selesai 13.11.2026.'},
steps:[
{k:'tx',tc:'CO01',instr:'Buka CO01, isi material, plant, order type, Enter. Di header isi total qty dan tanggal selesai, Enter untuk penjadwalan, lalu Save.',
screens:[
 {title:'Production order Create: Initial Screen',go:'enter',blocks:[{t:'group',title:'',fields:[{id:'matnr',l:'Material',w:10,f4:'matpp'},{id:'werks',l:'Production Plant',w:5,f4:'werks'},{id:'auart',l:'Order Type',w:5,f4:'auartpp'}]}],
  expect:{matnr:'500010',werks:'1100',auart:{eq:'PP01',idn:'Order produksi standar = PP01.'}},hints:{matnr:'F4 → biskuit kelapa'}},
 {title:'Production order Create: Header',go:'save',blocks:[{t:'kv',rows:[['Material','500010 BISKUIT KELAPA 200G (KARTON)'],['Status','CRTD MANC NMAT']]},
   {t:'group',title:'Quantities',fields:[{id:'gamng',l:'Total Qty',w:8},{id:'gmein',l:'Unit',t:'ro'}]},{t:'group',title:'Dates/Times',fields:[{id:'gltrp',l:'Finish (Basic)',w:10},{id:'gstrp',l:'Start (Basic)',t:'ro'},{id:'term',l:'Scheduling type',t:'ro'}]}],
  def:{gmein:'CAR',term:'Backwards'},onEnter:v=>v.gltrp&&dParse(v.gltrp)?{fill:{gstrp:'11.11.2026'},msg:['S','Scheduling carried out (backwards)']}:null,
  expect:{gamng:AMT(2400,'Total qty dari brief: 2.400 karton.'),gltrp:{eq:'13.11.2026',idn:'Tanggal selesai dari brief: 13.11.2026.'}},ok:'Order number 1000468 saved'}]},
{k:'q',instr:'Order 1000468 berstatus CRTD. Apa yang harus terjadi sebelum gudang bisa mengeluarkan bahan dan operator bisa konfirmasi?',o:['Order di-release (status REL)','Order di-TECO','Billing dibuat','Tidak perlu apa-apa'],a:0,e:'GI 261 dan konfirmasi CO11N membutuhkan status REL.'},
{k:'q',instr:'Dengan scheduling backwards, kenapa start date terisi 11.11.2026?',o:['SAP menghitung mundur dari tanggal selesai berdasarkan waktu di routing','Karena hari ini 11.11','Tanggal acak','Karena customer meminta'],a:0,e:'Backward scheduling: start = finish dikurangi lead time produksi.'}
]},
{id:'w1',title:'Transfer order antar bin (LT01 → LT12)',mod:'wm',lvl:'Menengah',
brief:{from:'Pak Dimas, Supervisor Gudang FG',msg:'Area picking Biskuit Kelapa (500010) hampir kosong. Pindahkan 40 karton dari rak tinggi (storage type 001, bin 001-02-03) ke area picking (type 002, bin P-01-04) di warehouse 110, plant 1100 sloc 1001. Setelah barang dipindah, konfirmasi TO-nya.'},
steps:[
{k:'tx',tc:'LT01',instr:'Buka LT01. Isi warehouse, movement type 999, material, qty, plant/sloc, Enter. Isi source dan destination, lalu Save.',
screens:[
 {title:'Create Transfer Order: Initial Screen',go:'enter',blocks:[{t:'group',title:'',fields:[{id:'lgnum',l:'Warehouse Number',w:4,f4:'lgnum'},{id:'bwlvs',l:'Movement Type',w:4,f4:'bwlvs'}]},{t:'group',title:'Material',fields:[{id:'matnr',l:'Material',w:10,f4:'matpp'},{id:'anfme',l:'Requested Qty',w:6},{id:'werks',l:'Plant / Storage Loc.',w:5,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,f4:'lgort'}]}],
  expect:{lgnum:'110',bwlvs:{eq:'999',idn:'Pemindahan manual antar bin memakai movement type WM 999.'},matnr:'500010',anfme:'40',werks:'1100',lgort:'1001'},hints:{bwlvs:'F4 → Manual stock transfer',lgort:'Gudang Barang Jadi'}},
 {title:'Create Transfer Order: Generate 1 Items',go:'save',blocks:[{t:'group',title:'Source data (From)',fields:[{id:'vltyp',l:'Storage Type',w:4,f4:'lgtyp'},{id:'vlpla',l:'Storage Bin',w:10}]},{t:'group',title:'Destination data (To)',fields:[{id:'nltyp',l:'Storage Type',w:4,f4:'lgtyp'},{id:'nlpla',l:'Storage Bin',w:10}]}],
  expect:{vltyp:'001',vlpla:'001-02-03',nltyp:'002',nlpla:{eq:'P-01-04',idn:'Tujuan area picking: bin P-01-04.'}},ok:'Transfer order 0000004711 created'}]},
{k:'tx',tc:'LT12',instr:'Barang sudah dipindah fisik. Buka LT12, isi nomor TO dan warehouse, Enter. Isi actual qty, lalu Save.',
screens:[
 {title:'Confirm Transfer Order: Initial Screen',go:'enter',blocks:[{t:'group',title:'',fields:[{id:'tanum',l:'Transfer Order Number',w:10,f4:'tanum'},{id:'lgnum',l:'Warehouse Number',w:4,f4:'lgnum'}]}],expect:{tanum:{eq:'4711',idn:'Nomor TO dari langkah sebelumnya (F4).'},lgnum:'110'}},
 {title:'Confirm Transfer Order: Overview',go:'save',blocks:[{t:'items',key:'to',title:'Items',rows:1,cols:[{id:'itm',l:'Item',ro:1,v:()=>'0001'},{id:'mat',l:'Material',ro:1,v:()=>'500010'},{id:'src',l:'Source',ro:1,v:()=>'001 / 001-02-03'},{id:'dst',l:'Destination',ro:1,v:()=>'002 / P-01-04'},{id:'qty',l:'Source target qty',ro:1,v:()=>'40'},{id:'act',l:'Dest. actual qty',w:6}]}],
  expect:{'to.0.act':{eq:'40',idn:'Isi qty yang benar-benar dipindah: 40 CAR.'}},ok:'Transfer order 0000004711 confirmed'}]},
{k:'q',instr:'Apa akibatnya jika TO tidak dikonfirmasi padahal barang sudah dipindah?',o:['Sistem masih mencatat 40 CAR di bin 001-02-03 sehingga picker dan laporan stok per bin salah','Stok plant berkurang 40','PO otomatis dibuat','Tidak ada akibat'],a:0,e:'Konfirmasi TO yang memindahkan quant di sistem.'}
]},
{id:'w2',title:'Cari bin untuk picking FIFO (LX02)',mod:'wm',lvl:'Dasar',
brief:{from:'Pak Dimas, Supervisor Gudang FG',msg:'Ada delivery 200 karton Biskuit Kelapa (500010). Gudang memakai FIFO. Tolong cek stok per bin di warehouse 110 dan tentukan bin rak tinggi mana yang diambil duluan.'},
steps:[
{k:'tx',tc:'LX02',instr:'Buka LX02, isi warehouse dan material, Execute. Sort kolom GR Date ascending.',
screens:[
 {title:'Stock List',sel:1,go:'exec',blocks:[{t:'group',title:'',fields:[{id:'lgnum',l:'Warehouse Number',w:4,f4:'lgnum'},{id:'lgtyp',l:'Storage Type',w:4,f4:'lgtyp',to:1},{id:'matnr',l:'Material',w:10,f4:'matpp',to:1}]}],expect:{lgnum:'110',matnr:'500010'}},
 {title:'Stock List',blocks:[{t:'alv',key:'bin',data:ALV_LX02}]}]},
{k:'q',instr:'Dengan FIFO, bin rak tinggi mana yang diambil pertama?',o:['001-05-01 (GR 15.10.2026, 240 CAR)','001-07-02 (GR terbaru)','001-02-03','P-01-04'],a:0,e:'FIFO = barang yang paling lama diterima keluar lebih dulu.'},
{k:'q',instr:'Berapa total stok 500010 di warehouse 110?',o:['640 CAR','600 CAR','400 CAR','200 CAR'],a:0,e:'160 + 240 + 200 + 40 = 640 CAR.'}
]}
);

/* ===================== SIMULATOR DARI TUTORIAL KERJA (t1–t5) ===================== */
F4.banfn.push(['10004601','KABEL NYY 4X16 · menunggu release S1']);
F4.iblnr.push(['100000360','Gudang Sparepart – opname November']);
const ALV_MI20T={cols:ALV_MI20.cols,rows:[{mat:'300015577',txt:'COUPLING MOTOR FCL-140',sl:'1101',book:8,cnt:5,diff:-3,bun:'PC',val:-2250000},{mat:'300012457',txt:'BEARING SKF 6205-2RS',sl:'1101',book:15,cnt:17,diff:2,bun:'PC',val:370000},{mat:'300019920',txt:'V-BELT B-52',sl:'1101',book:12,cnt:12,diff:0,bun:'PC',val:0}]};
const mtxt=m=>(MAT[m]||{}).d||'';
SIMS.push(
{id:'t1',title:'Release PR sebagai Supervisor (ME54N)',mod:'mm-pur',lvl:'Menengah',
brief:{from:'Notifikasi workflow SAP',msg:'PR 10004601 (KABEL NYY 4X16, 80 M, cost center 11PRD310) menunggu release kode S1 (Supervisor Produksi). Strateginya: S1 Supervisor → M1 Manager Produksi. Cek isi PR, lalu release dengan kode milikmu saja.'},
steps:[
{k:'tx',tc:'ME54N',instr:'Buka ME54N, klik Other Purchase Requisition dan pilih PR 10004601. Di tab Release strategy centang Release hanya di baris kode S1, lalu Save.',
screens:[
{title:'Release Purchase Requisition 10004596',go:null,blocks:[{t:'note',html:'<p>ME54N membuka PR terakhir yang kamu proses. Pakai <b>Other Purchase Requisition</b> (Shift+F5) untuk memilih PR yang menunggu approval.</p>'}],tbx:[{l:'Other Purchase Requisition',k:'otherpr'}],popups:{otherpr:{title:'Select Document',fields:[{id:'m.pr',l:'Purchase Requisition',w:10,f4:'banfn'}],expect:{'m.pr':{eq:'10004601',idn:'PR yang menunggu release: 10004601 (F4).'}},next:true}},expect:{}},
{title:'Release Purchase Requisition 10004601',go:'save',
 blocks:[{t:'kv',rows:[['Document type','ZOPX PR Opex'],['Item 10','KABEL NYY 4X16 · 80 M · Rp 44.000.000'],['Acct. assignment','K · G/L 640500 · Cost center 11PRD310'],['Header note','Penggantian kabel panel Line 3 (berita acara kerusakan terlampir)']]},
  {t:'tabs',key:'hdr',title:'Header',tabs:[{l:'Release strategy',table:{h:['Code','Description','Status'],r:[['S1','Supervisor Produksi','⏳ menunggu'],['M1','Manager Produksi','🔒 menunggu S1']]},fields:[{id:'rel.S1',l:'Release – S1 Supervisor Produksi',t:'chk'},{id:'rel.M1',l:'Release – M1 Manager Produksi',t:'chk'},{id:'z1',l:'Release indicator',t:'ro',v:'X  Blocked'}]},{l:'Texts',fields:[{id:'z2',l:'Header Note',t:'ro',v:'Penggantian kabel panel Line 3'}]}]}],
 expect:{'rel.S1':{eq:true,sap:'No release code selected',idn:'Centang Release di baris S1 (kode milikmu).'},'rel.M1':{fn:v=>v?{sap:'Release prerequisites not fulfilled',idn:'M1 milik Manager dan baru bisa setelah S1. Jangan release kode orang lain.'}:null}},
 hints:{'rel.S1':'Tab Release strategy'},ok:'Release effected with release code S1 · Purchase requisition 10004601 changed'}]},
{k:'q',instr:'Setelah kamu release S1, apa status PR 10004601?',o:['Masih blocked (indicator X) sampai Manager release M1; setelah itu indicator 2 dan boleh dibuat PO','Langsung jadi PO','Indicator 2, siap PO','PR tertutup'],a:0,e:'PR baru bisa dijadikan PO setelah semua kode di strategi selesai.'},
{k:'q',instr:'Kamu approver dengan 15 PR menunggu. T-code yang lebih efisien?',o:['ME55 (collective release)','ME54N satu per satu','ME51N','ME5A lalu release dari sana'],a:0,e:'ME55 menampilkan daftar PR untuk kode release-mu dan bisa release banyak PR sekaligus.'}
]},
{id:'t2',title:'Reservasi lalu GI dari reservasi (MB21 → MIGO R09)',mod:'mm-im',lvl:'Menengah',
brief:{from:'Pak Dedi, Teknisi Maintenance',msg:'Minggu depan (20.11.2026) saya ganti 2 V-belt B-52 di Line 3 (cost center 11PRD310). Tolong buat reservasi dari Gudang Sparepart 1101 supaya barangnya disiapkan. Penerima: Dedi.'},
steps:[
{k:'tx',tc:'MB21',instr:'Buka MB21. Isi Base Date 20.11.2026, Movement Type 201, Plant 1100, Enter. Isi Goods Recipient, Cost Center, lalu material, qty, dan storage location. Enter, lalu Save.',
screens:[
{title:'Create Reservation: Initial Screen',go:'enter',def:{bdter:TODAY},blocks:[{t:'group',title:'Reference',fields:[{id:'bdter',l:'Base Date',w:10},{id:'bwart',l:'Movement Type',w:4,f4:'bwart'},{id:'werks',l:'Plant',w:5,f4:'werks'}]}],
 expect:{bdter:{eq:'20.11.2026',idn:'Base Date = tanggal barang dibutuhkan (20.11.2026).'},bwart:{eq:'201',idn:'Pemakaian untuk cost center = 201.'},werks:'1100'},hints:{bdter:'Tanggal butuh',bwart:'201'}},
{title:'Create Reservation: New Items',go:'save',
 blocks:[{t:'group',title:'Movement Type 201',fields:[{id:'wempf',l:'Goods recipient',w:12},{id:'kostl',l:'Cost Center',w:10,f4:'kostl'}]},
  {t:'items',key:'rs',title:'Items',rows:2,cols:[{id:'itm',l:'Item',ro:1,v:r=>String(r+1)},{id:'mat',l:'Material',w:11,f4:'matnr'},{id:'txt',l:'Description',ro:1},{id:'qty',l:'Quantity',w:6},{id:'un',l:'UnE',ro:1},{id:'lgort',l:'SLoc',w:5,f4:'lgort'}]}],
 onEnter:v=>{const out={};for(let r=0;r<2;r++){const m=v[`rs.${r}.mat`];if(m){const M=MAT[norm(m)];if(!M)return {msg:['E',`Material ${m} does not exist in plant 1100`]};out[`rs.${r}.txt`]=M.d;out[`rs.${r}.un`]=M.u;}}return {fill:out};},
 expect:{wempf:{eq:'DEDI',idn:'Goods recipient = Dedi.'},kostl:{eq:'11PRD310',idn:'Line 3 = 11PRD310 (F4).'},'rs.0.mat':{eq:'300019920',idn:'V-belt B-52 = 300019920 (F4).'},'rs.0.txt':NEED_ENTER('material'),'rs.0.qty':'2','rs.0.lgort':'1101'},
 hints:{kostl:'F4 → Line 3','rs.0.mat':'F4 → "V-BELT"'},ok:'Document 0000001950 posted'}]},
{k:'q',instr:'Tanggal 20.11 teknisi datang mengambil barang. Gudang memposting GI dengan referensi apa?',o:['MIGO A07 Goods Issue + R09 Reservation, nomor 0000001950','A01 + R01','A07 + R10 dan isi ulang semua data','MB21 lagi'],a:0,e:'R09 menyalin material, qty, cost center, dan movement type dari reservasi.'},
{k:'tx',tc:'MIGO',instr:'Di MIGO pilih A07 Goods Issue dan R09 Reservation, isi nomor reservasi, Enter. Isi Goods recipient di tab Where bila perlu, centang Item OK, Check, lalu Post.',
screens:[migoScreen({onEnter:v=>{if(v.ref!=='R09')return null;if(norm(v.rsnum).replace(/^0+/,'')!=='1950')return {msg:['E',`Reservation ${v.rsnum||''} does not exist`],explain:'Nomor reservasi dari MB21: 0000001950 (F4).'};if(v['it.0.txt'])return null;return {fill:{bwart:'201','it.0.mat':'300019920','it.0.txt':mtxt('300019920'),'it.0.qty':'2','it.0.un':'PC','it.0.werks':'1100','it.0.lgort':'1101','it.0.stock':'Unrestricted use','it.0.kostl':'11PRD310','it.0.wempf':'DEDI'},msg:['I','Data adopted from reservation 0000001950'],explain:'Item, movement 201, dan cost center tersalin dari reservasi.'};},
 expect:{act:{eq:'A07',idn:'Pengeluaran barang = A07 Goods Issue.'},ref:{eq:'R09',idn:'Ada reservasi, jadi referensinya R09 Reservation.'},rsnum:{eq:'0000001950',idn:'Nomor reservasi dari MB21.'},'it.0.txt':NEED_ENTER('nomor reservasi'),'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 hints:{act:'A07',ref:'R09 Reservation',rsnum:'F4'},ok:'Material document 4900062018 posted'})]}
]},
{id:'t3',title:'Pindahkan barang rusak ke blocked stock (344)',mod:'mm-im',lvl:'Menengah',
brief:{from:'Bu Rina, QC',msg:'5 PC BEARING SKF 6205-2RS di Gudang Sparepart 1101 berkarat. Tolong tahan dulu (jangan sampai dipakai produksi) sambil kami putuskan dibuang atau dikembalikan. Tulis alasannya di dokumen.'},
steps:[
{k:'q',instr:'Movement type yang tepat untuk menahan stok tanpa membuangnya?',o:['344 – unrestricted ke blocked','551 – scrapping','311 – pindah sloc','202 – batal GI'],a:0,e:'344 mengubah status stok menjadi blocked; qty dan nilai tetap ada.'},
{k:'tx',tc:'MIGO',instr:'MIGO: A08 Transfer Posting + R10 Other, movement 344. Isi alasan di HeaderText, isi material, qty, plant, sloc, Enter, centang Item OK, lalu Post.',
screens:[migoScreen({onEnter:migoMatEnter(),
 expect:{act:{eq:'A08',idn:'Ubah status stok = A08 Transfer Posting.'},ref:'R10',bwart:{eq:'344',idn:'Unrestricted → blocked = 344.'},bktxt:NONEMPTY('Tulis alasan di HeaderText, misalnya "Berkarat, tahan QC".'),'it.0.mat':'300012457','it.0.txt':NEED_ENTER('material'),'it.0.qty':'5','it.0.werks':'1100','it.0.lgort':'1101','it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 hints:{bwart:'344',bktxt:'Alasan'},ok:'Material document 4900062025 posted'})]},
{k:'q',instr:'Di MB52, di kolom mana 5 PC bearing itu sekarang muncul?',o:['Blocked','Unrestricted','Quality Inspection','Tidak muncul lagi'],a:0,e:'Stok pindah ke kolom Blocked; nilainya tetap tercatat sampai di-scrap atau dikembalikan (343).'}
]},
{id:'t4',title:'Scrapping dari blocked stock (555)',mod:'mm-im',lvl:'Lanjut',
brief:{from:'Bu Rina, QC',msg:'Berita acara sudah ditandatangani: 10 PC ROLLER CONVEYOR (300031150) yang ada di blocked stock Gudang 1101 dibuang. Biaya ke cost center Line 3 (11PRD310), alasan: rusak/cacat.'},
steps:[
{k:'tx',tc:'MIGO',instr:'MIGO: A07 Goods Issue + R10 Other, movement 555. Isi material, qty, plant, sloc, Enter. Di tab Where isi Reason for Movement, di tab Account Assignment isi Cost Center. Item OK, lalu Post.',
screens:[migoScreen({onEnter:migoMatEnter('Blocked stock'),
 expect:{act:{eq:'A07',idn:'Scrapping adalah goods issue = A07.'},ref:'R10',bwart:{eq:'555',idn:'Barang ada di blocked stock, jadi scrapping memakai 555 (551 untuk unrestricted).'},'it.0.mat':'300031150','it.0.txt':NEED_ENTER('material'),'it.0.qty':'10','it.0.werks':'1100','it.0.lgort':'1101','it.0.grund':{eq:'0001',sap:'Enter reason for movement',idn:'Tab Where → Reason for Movement 0001 Rusak/cacat (F4).'},'it.0.kostl':{eq:'11PRD310',sap:'Enter cost center',idn:'Tab Account Assignment → 11PRD310.'},'it.0.ok':{eq:true,sap:'No items selected – set Item OK',idn:'Centang Item OK.'}},
 hints:{bwart:'555','it.0.grund':'Tab Where','it.0.kostl':'Tab Account Assignment'},ok:'Material document 4900062027 posted'})]},
{k:'q',instr:'Apa dampak scrapping ke laporan?',o:['Stok dan nilai persediaan berkurang; biaya masuk ke cost center 11PRD310','Hanya stok berkurang, nilai tetap','Tidak ada dampak biaya','Vendor otomatis mengganti'],a:0,e:'Scrapping = GI ke biaya. Karena itu butuh approval dan berita acara.'}
]},
{id:'t5',title:'Analisis & posting selisih opname (MI20 → MI07)',mod:'mm-pi',lvl:'Lanjut',
brief:{from:'Pak Yusuf, Kepala Gudang',msg:'Opname dokumen 100000360 sudah dihitung dan berita acara disetujui. Cek daftar selisihnya, lalu posting selisih dengan alasan: coupling hilang (0003), bearing salah hitung saat GR sebelumnya (0004).'},
steps:[
{k:'tx',tc:'MI20',instr:'Buka MI20, isi Plant, Storage Location, dan dokumen 100000360, lalu Execute (F8).',
screens:[{title:'List of Inventory Differences',sel:1,go:'exec',def:{gjahr:'2026'},blocks:[{t:'group',title:'Database selections',fields:[{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'Storage Location',w:5,f4:'lgort'},{id:'iblnr',l:'Physical Inventory Document',w:12,f4:'iblnr'},{id:'gjahr',l:'Fiscal Year',w:5}]}],expect:{werks:'1100',lgort:'1101',iblnr:{eq:'100000360',idn:'Dokumen dari brief: 100000360.'}}},
 {title:'List of Inventory Differences',blocks:[{t:'alv',key:'mi20b',data:ALV_MI20T}]}]},
{k:'q',instr:'Movement type apa yang dibuat SAP untuk coupling (−3) dan bearing (+2)?',o:['Coupling 702 (shortage), bearing 701 (surplus)','Keduanya 701','Coupling 701, bearing 702','Keduanya 551'],a:0,e:'MI07 otomatis memilih 701 untuk selisih lebih dan 702 untuk selisih kurang.'},
{k:'tx',tc:'MI07',instr:'Buka MI07, isi dokumen 100000360, Enter. Isi Reason untuk setiap item yang selisih, lalu Save (Post).',
screens:[
{title:'Post Inventory Difference: Initial Screen',go:'enter',def:{gjahr:'2026',budat:TODAY},blocks:[{t:'group',title:'',fields:[{id:'iblnr',l:'Phys. Inventory Doc.',w:12,f4:'iblnr'},{id:'gjahr',l:'Fiscal Year',w:5},{id:'budat',l:'Posting Date',w:10}]}],expect:{iblnr:{eq:'100000360',idn:'Dokumen opname 100000360.'}}},
{title:'Post Inventory Difference 100000360: Overview',go:'save',saveLabel:'Post',
 blocks:[{t:'items',key:'df',title:'Items with differences',rows:2,cols:[{id:'itm',l:'Item',ro:1,v:r=>['001','002'][r]},{id:'mat',l:'Material',ro:1,v:r=>['300015577','300012457'][r]},{id:'txt',l:'Material Description',ro:1,v:r=>['COUPLING MOTOR FCL-140','BEARING SKF 6205-2RS'][r]},{id:'dq',l:'Difference qty',ro:1,v:r=>['-3','2'][r]},{id:'mv',l:'MvT',ro:1,v:r=>['702','701'][r]},{id:'grund',l:'Reason',w:5,f4:'grund'}]}],
 expect:{'df.0.grund':{eq:'0003',sap:'Enter reason for movement',idn:'Coupling: 0003 Hilang (sesuai berita acara).'},'df.1.grund':{eq:'0004',sap:'Enter reason for movement',idn:'Bearing: 0004 Salah hitung.'}},
 hints:{'df.0.grund':'F4','df.1.grund':'F4'},ok:'Diffs in phys. inv. doc. 100000360 posted with m. doc. 4900062031'}]}
]}
);

/* ===================== PRAKTIK PER BAB, ROLE, UJIAN & LOG NILAI ===================== */
S.att=S.att||{};S.cpf=S.cpf||{};S.addons=S.addons||[];
function logAtt(key,score){(S.att[key]=S.att[key]||[]).push({s:Math.round(score),t:Date.now()});save();}
function attOf(key){const a=S.att[key]||[];return {n:a.length,first:a.length?a[0].s:null,best:a.length?Math.max(...a.map(x=>x.s)):null,last:a.length?a[a.length-1]:null,all:a};}
const plain=s=>String(s||'').replace(/<[^>]+>/g,'');
const isCode=c=>/^[A-Z0-9_\-\.\/]+$/.test(c)&&/[A-Z]/.test(c)&&!/XX/.test(c)&&!['SLA','ADT','ESR','ID'].includes(c);
const NOT_TC=['SLA','ADT','ESR','ID','API'];
const isNavCode=c=>isCode(c)&&c[0]!=='/'&&c.length<=20&&!NOT_TC.includes(c);
const rowCodes=r=>r[0].split(' / ').map(x=>x.trim());

/* ---------- daftarkan semua T-code materi ke command field ---------- */
MODULES.forEach(m=>m.lessons.forEach(l=>(l.tcRows||[]).forEach(r=>rowCodes(r).forEach(c=>{if(isNavCode(c)&&!KNOWN[c])KNOWN[c]=plain(r[1]);}))));

/* ---------- simulator bab ---------- */
const BAB_SIM={nav:{0:['s20'],2:['s0'],4:['s8']},org:{2:['s9']},'mm-pur':{1:['s1','s21'],3:['s22'],4:['s27'],5:['s12','s2'],6:['s13'],7:['t1']},'mm-im':{0:['s3','s23','s24'],1:['s4'],2:['s11'],3:['s10'],4:['t2'],5:['t3','t4']},'mm-pi':{0:['s14','s15','s25'],1:['s5'],3:['s26'],4:['t5']},'fi-aa':{2:['s16'],3:['s7']},ps:{1:['s6','s28'],3:['s17']},'ps-ops':{0:['s19'],3:['s18']},sd:{2:['d1'],3:['d2']},'fi-ap':{1:['f1'],2:['f2']},pp:{1:['p1'],2:['p2']},wm:{0:['w2'],1:['w1']}};
const APPPRAC={};const BAB={};
MODULES.forEach(m=>{BAB[m.id]=m.lessons.map((l,i)=>{
  const mapped=((BAB_SIM[m.id]||{})[i]||[]).filter(id=>SIMS.find(s=>s.id===id));
  mapped.forEach(id=>{const s=SIMS.find(x=>x.id===id);s.bab=i;s.kind='bab';s.back='modul-'+m.id;});
  const sims=mapped.slice();let app=null;
  const nav=[...new Set((l.tcRows||[]).flatMap(r=>rowCodes(r).filter(isNavCode).map(c=>c+'|'+plain(r[1]))))].slice(0,3).map(x=>x.split('|'));
  const kc=(BABCASE[m.id]||[])[i];
  if(!sims.length&&nav.length){const id=`b-${m.id}-${i}`;
    SIMS.push({id,mod:m.id,bab:i,kind:'bab',gen:true,back:'modul-'+m.id,lvl:'Bab '+(i+1),title:`Bab ${i+1}: ${l.t}`,
      brief:{from:'Latihan bab '+(i+1)+' · '+m.code,msg:(kc?kc[0]+' ':'')+'Tugasmu: buka transaksi yang tepat untuk setiap kebutuhan di panel Tugas, lalu jawab pertanyaan penutup.'},
      steps:[...nav.map(([c,d],k)=>({k:'nav',tc:c,pre:null,instr:`Buka transaksi untuk: ${d}.${k?' Kamu sedang di dalam transaksi, jadi pakai /n + T-code.':''} Petunjuk: lihat tabel T-code di bab ${i+1}.`})),
        {k:'q',instr:l.cp.q,o:l.cp.o,a:l.cp.a,e:l.cp.e}]});sims.push(id);}
  else if(!sims.length){app=`a-${m.id}-${i}`;APPPRAC[app]={id:app,mod:m.id,bab:i,title:`Bab ${i+1}: ${l.t}`,rows:(l.tcRows||[]).map(r=>[r[0],plain(r[1])]),flow:l.flow};}
  /* studi kasus bab */
  const steps=[];
  if(kc)steps.push({q:kc[1],o:shuffle(kc.slice(2).map((x,j)=>[x[0],j===0?1:0,x[1]]))});
  const rows=(l.tcRows||[]);const others=m.lessons.flatMap((x,j)=>j===i?[]:(x.tcRows||[])).concat(rows.slice(1));
  if(rows.length&&others.length>=2){const r=rows[0];const ds=shuffle(others.filter(o=>o[0]!==r[0])).slice(0,2);
    steps.push({q:`Untuk kebutuhan "${plain(r[1])}", transaksi/app mana yang kamu pakai?`,o:shuffle([[r[0],1,'Tepat. '+plain(r[1])+'.'],...ds.map(d=>[d[0],0,`${d[0]} dipakai untuk: ${plain(d[1])}.`])])});}
  const cs={id:`bc-${m.id}-${i}`,kind:'bab',mod:m.id,bab:i,title:`Bab ${i+1}: ${l.t}`,tag:m.code,scene:kc?kc[0]:l.cp.q,steps,back:'modul-'+m.id};
  return {sims,app,case:cs};});});
const BABCASES=MODULES.flatMap(m=>BAB[m.id].map(b=>b.case));

/* ---------- simulator & studi kasus role ---------- */
const ROLESIM={};
ROLES.forEach(r=>{
  const mods=[...r.w,...r.g.filter(x=>x!=='nav'&&x!=='org')].slice(0,4);const steps=[];const briefs=[];
  for(const mid of mods){if(briefs.length>=3)break;
    const full=SIMS.find(s=>s.mod===mid&&!s.kase&&!s.gen&&!s.forceLogon&&s.kind==='bab'&&!['s0','s8','s19'].includes(s.id));
    if(full){briefs.push(`(${briefs.length+1}) ${MOD[mid].code} – ${full.brief.from}: ${full.brief.msg}`);steps.push(...full.steps);}
    else{const rows=MOD[mid].lessons.flatMap(l=>l.tcRows||[]);const codes=[...new Set(rows.flatMap(r=>rowCodes(r).filter(isNavCode).map(c=>c+'|'+plain(r[1]))))].slice(0,2).map(x=>x.split('|'));
      if(!codes.length)continue;const q=MOD[mid].quiz[0];
      briefs.push(`(${briefs.length+1}) ${MOD[mid].code}: cek cepat transaksi ${codes.map(c=>c[0]).join(' dan ')} lalu jawab satu pertanyaan.`);
      steps.push(...codes.map(([c,d])=>({k:'nav',tc:c,pre:null,instr:`${MOD[mid].code}: buka transaksi untuk ${d}. Dari dalam transaksi pakai /n.`})),{k:'q',instr:q.q,o:q.o,a:q.a,e:q.e});}}
  if(!steps.length)return;
  const id='rs-'+r.id;SIMS.push({id,role:r.id,kind:'role',mod:null,back:'jalur',lvl:'Role',title:`Satu hari kerja: ${r.t}`,brief:{from:'Hari kerja sebagai '+r.t,msg:briefs.join(' ')},steps});ROLESIM[r.id]=id;});
function roleSims(r){const path=rolePath(r);return [ROLESIM[r.id],...SIMS.filter(s=>s.kase&&path.includes(s.mod)).map(s=>s.id)].filter(Boolean);}
function roleCases(r){const path=rolePath(r);return [...ROLECASES.filter(c=>c.role===r.id),...CASES.filter(c=>path.includes(c.mod))];}
CASES.forEach(c=>{c.kind='role';});
SIMS.filter(s=>s.kase).forEach(s=>{s.kind='role';s.back='jalur';});
const ALLCASES=[...CASES,...ROLECASES,...BABCASES];

/* ---------- ujian akhir modul & role ---------- */
function tcQs(m,n){const rows=m.lessons.flatMap(l=>l.tcRows||[]);if(rows.length<4)return [];return shuffle(rows).slice(0,n).map(r=>{const ds=shuffle(rows.filter(x=>x!==r)).slice(0,3).map(x=>x[0]);return cp(`T-code/app untuk: ${plain(r[1])}?`,[r[0],...ds],0,`${r[0]} = ${plain(r[1])}.`);});}
function modExamPool(m){return [...m.quiz,...m.lessons.map(l=>l.cp),...tcQs(m,3)].map(q=>Object.assign({},q,{mod:m.id}));}
function roleExamPool(r){return roleCore(r).flatMap(id=>modExamPool(MOD[id]));}

/* ---------- glosarium ---------- */
const MVT=[['101','GR terhadap PO'],['102','Pembatalan GR'],['201','GI ke cost center'],['202','Pembatalan 201'],['221','GI ke proyek/WBS'],['222','Pembatalan 221'],['261','GI ke order'],['262','Pembatalan 261'],['311','Transfer antar sloc'],['601','GI untuk delivery penjualan'],['651','GR retur customer'],['122','Return delivery ke vendor'],['161','GR untuk item retur di PO'],['301','Transfer plant ke plant (satu langkah)'],['309','Transfer material ke material'],['321','Quality inspection ke unrestricted'],['343','Blocked ke unrestricted'],['344','Unrestricted ke blocked'],['501','GR tanpa PO'],['551','Scrapping dari unrestricted'],['555','Scrapping dari blocked stock'],['561','Saldo awal stok'],['641','GI stock transport order'],['701','Selisih opname lebih (surplus)'],['702','Selisih opname kurang (shortage)']];
const GLOSS=(()=>{const map={};const add=(k,d,t,mid)=>{const key=t+'|'+k;if(!map[key])map[key]={k,d,t,mods:[]};if(!map[key].mods.includes(mid))map[key].mods.push(mid);};
  MODULES.forEach(m=>{m.lessons.forEach(l=>(l.tcRows||[]).forEach(r=>rowCodes(r).forEach(c=>add(c,plain(r[1]),isCode(c)?'T-code':'App',m.id))));(TERMS[m.id]||[]).forEach(([k,d])=>add(k,d,'Istilah',m.id));});
  MVT.forEach(([k,d])=>add(k,d,'Movement type','mm-im'));
  return Object.values(map).sort((a,b)=>a.k.localeCompare(b.k));})();
/* ===================== SIMULATOR ENGINE ===================== */
let SIM=null; let LOGGED=false; const LOGON_USER='ANDRE.P';
const stepOf=()=>SIM&&!SIM.free?SIM.sc.steps[SIM.step]:null;
const curTc=()=>SIM.where==='tx'?(SIM.free?SIM.ftx.tc:SIM.sc.steps[SIM.txStep].tc):SIM.where==='other'?SIM.other:'SESSION_MANAGER';
const scrOf=()=>{if(SIM&&SIM.free)return SIM.where==='tx'&&SIM.ftx?SIM.ftx.screens[SIM.scr]:null;if(!SIM||SIM.where!=='tx'||SIM.txStep==null)return null;const st=SIM.sc.steps[SIM.txStep];return st&&st.screens?st.screens[SIM.scr]:null;};
const live=()=>SIM&&(SIM.free||SIM.txStep===SIM.step);
const fT=f=>typeof f.t==='function'?f.t(SIM.vals):(f.t||'txt');
const shown=x=>!x.show||x.show(SIM.vals);
const blocksOf=s=>typeof s.blocks==='function'?s.blocks(SIM.vals):(s.blocks||[]);
const fid=id=>'f_'+id.replace(/[^a-zA-Z0-9]/g,'_');
const txt=(x)=>typeof x==='function'?x(SIM.vals):x;

/* ---------- icons (simple own glyphs, 16px) ---------- */
const sv=(b,w=16)=>`<svg width="${w}" height="${w}" viewBox="0 0 16 16" aria-hidden="true">${b}</svg>`;
const ICO={
 enter:sv('<circle cx="8" cy="8" r="7" fill="#3aa350" stroke="#24733a"/><path d="M4.5 8.2l2.4 2.4 4.6-5" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'),
 save:sv('<rect x="2" y="2" width="12" height="12" rx="1" fill="#8aa6c8" stroke="#4d6d93"/><rect x="4.5" y="2.5" width="7" height="4" fill="#fff"/><rect x="4" y="9" width="8" height="4.5" fill="#dfe8f2"/>'),
 back:sv('<circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#8a97a6"/><path d="M9.5 4.5L6 8l3.5 3.5M12 4.5L8.5 8 12 11.5" fill="none" stroke="#3aa350" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
 exit:sv('<circle cx="8" cy="8" r="7" fill="#fff" stroke="#8a97a6"/><path d="M8 12V5M5 7.5L8 4.5l3 3" fill="none" stroke="#e48a1a" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'),
 cancel:sv('<circle cx="8" cy="8" r="7" fill="#fff" stroke="#8a97a6"/><path d="M5.3 5.3l5.4 5.4M10.7 5.3l-5.4 5.4" stroke="#d03a3a" stroke-width="1.9" stroke-linecap="round"/>'),
 print:sv('<rect x="4" y="2" width="8" height="4" fill="#fff" stroke="#6b7c90"/><rect x="2" y="6" width="12" height="6" rx="1" fill="#a9b7c8" stroke="#6b7c90"/><rect x="4" y="10" width="8" height="4" fill="#fff" stroke="#6b7c90"/>'),
 find:sv('<circle cx="6.5" cy="6.5" r="4" fill="#e9f2fb" stroke="#5b6f86" stroke-width="1.5"/><path d="M9.5 9.5L14 14" stroke="#5b6f86" stroke-width="2" stroke-linecap="round"/>'),
 findn:sv('<circle cx="6" cy="6" r="3.5" fill="#e9f2fb" stroke="#5b6f86" stroke-width="1.4"/><path d="M8.6 8.6l3 3" stroke="#5b6f86" stroke-width="1.8" stroke-linecap="round"/><path d="M11 3h4M13 1v4" stroke="#3aa350" stroke-width="1.4"/>'),
 first:sv('<path d="M4 3v10M13 3L6 8l7 5z" fill="#8ea3bb" stroke="#5b6f86"/>'),prev:sv('<path d="M11 3L4 8l7 5z" fill="#8ea3bb" stroke="#5b6f86"/>'),next:sv('<path d="M5 3l7 5-7 5z" fill="#8ea3bb" stroke="#5b6f86"/>'),last:sv('<path d="M12 3v10M3 3l7 5-7 5z" fill="#8ea3bb" stroke="#5b6f86"/>'),
 session:sv('<rect x="1.5" y="3" width="10" height="8" fill="#fff" stroke="#5b6f86"/><rect x="1.5" y="3" width="10" height="2" fill="#4d7fbf"/><circle cx="12.5" cy="11.5" r="3" fill="#f2b705" stroke="#b78600"/><path d="M12.5 10v3M11 11.5h3" stroke="#5a3d00" stroke-width="1.2"/>'),
 shortcut:sv('<rect x="2" y="2" width="12" height="12" fill="#fff" stroke="#5b6f86"/><path d="M5 11l6-6M7 5h4v4" fill="none" stroke="#2f6fb3" stroke-width="1.6"/>'),
 help:sv('<circle cx="8" cy="8" r="7" fill="#e8eef5" stroke="#7d8da0"/><path d="M6 6.2c0-1.2 1-2 2.1-2s2 .8 2 1.9c0 1.4-2 1.5-2 3" fill="none" stroke="#3b5675" stroke-width="1.5" stroke-linecap="round"/><circle cx="8.1" cy="11.6" r=".9" fill="#3b5675"/>'),
 layout:sv('<rect x="1.5" y="2" width="13" height="10" rx="1" fill="#fff" stroke="#5b6f86"/><rect x="3" y="3.5" width="3" height="7" fill="#e04b4b"/><rect x="6.5" y="3.5" width="3" height="7" fill="#3aa350"/><rect x="10" y="3.5" width="3" height="7" fill="#3b7dd8"/><rect x="5" y="12.5" width="6" height="2" fill="#7d8da0"/>'),
 exec:sv('<circle cx="8" cy="8.5" r="6" fill="#fff" stroke="#4b6584" stroke-width="1.4"/><path d="M8 5v3.7l2.6 1.6" fill="none" stroke="#3aa350" stroke-width="1.7" stroke-linecap="round"/><rect x="6.5" y="1" width="3" height="1.6" fill="#4b6584"/>'),
 check:sv('<rect x="2" y="2" width="12" height="12" fill="#fff" stroke="#7d8da0"/><path d="M4.5 8.2l2.3 2.3 4.6-5" fill="none" stroke="#3aa350" stroke-width="1.8"/>'),
 post:sv('<rect x="2" y="2" width="12" height="12" rx="1" fill="#8aa6c8" stroke="#4d6d93"/><rect x="4.5" y="2.5" width="7" height="4" fill="#fff"/><rect x="4" y="9" width="8" height="4.5" fill="#dfe8f2"/>'),
 doc:sv('<path d="M3 1.5h7l3 3v10H3z" fill="#fff" stroke="#5b6f86"/><path d="M10 1.5v3h3" fill="none" stroke="#5b6f86"/><path d="M5 7h6M5 9.5h6M5 12h4" stroke="#8ea3bb"/>'),
 folder:sv('<path d="M1.5 4h5l1.5 1.5h6.5v8h-13z" fill="#f2c94c" stroke="#b78a1a"/>'),
 folderO:sv('<path d="M1.5 4h5l1.5 1.5h6.5v2H4.5l-3 6z" fill="#f2c94c" stroke="#b78a1a"/><path d="M4.5 7.5H15l-3 6H1.5z" fill="#f7da7a" stroke="#b78a1a"/>'),
 tx:sv('<rect x="2" y="3" width="12" height="10" fill="#fff" stroke="#5b6f86"/><rect x="2" y="3" width="12" height="2.2" fill="#4d7fbf"/><path d="M4 8h8M4 10.5h5" stroke="#8ea3bb"/>'),
 star:sv('<path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.4L8 11.2 4.1 13.4l.9-4.4-3.3-3 4.4-.5z" fill="#f2c94c" stroke="#b78a1a"/>'),
 f4:sv('<path d="M4 6l4 4 4-4" fill="none" stroke="#2c4561" stroke-width="1.6"/>',12),
 multi:sv('<path d="M2 8h9M8 4.5L11.5 8 8 11.5" fill="none" stroke="#2c4561" stroke-width="1.6"/><path d="M13.5 3v10" stroke="#2c4561" stroke-width="1.4"/>',12),
 sortA:sv('<path d="M4 13V3M1.5 5.5L4 3l2.5 2.5" fill="none" stroke="#2c4561" stroke-width="1.5"/><text x="8" y="7" font-size="6" fill="#2c4561" font-family="Arial">A</text><text x="8" y="14" font-size="6" fill="#2c4561" font-family="Arial">Z</text>'),
 sortD:sv('<path d="M4 3v10M1.5 10.5L4 13l2.5-2.5" fill="none" stroke="#2c4561" stroke-width="1.5"/><text x="8" y="7" font-size="6" fill="#2c4561" font-family="Arial">Z</text><text x="8" y="14" font-size="6" fill="#2c4561" font-family="Arial">A</text>'),
 filter:sv('<path d="M1.5 2.5h13l-5 6v5l-3 1.5V8.5z" fill="#d8e4f1" stroke="#2c4561"/>'),
 sum:sv('<path d="M12 3H4l4.5 5L4 13h8" fill="none" stroke="#2c4561" stroke-width="1.7" stroke-linejoin="round"/>'),
 xls:sv('<rect x="2" y="2" width="12" height="12" rx="1" fill="#2e7d4f"/><path d="M5 5l6 6M11 5l-6 6" stroke="#fff" stroke-width="1.7"/>'),
 reset:sv('<path d="M3 8a5 5 0 1 0 1.5-3.5" fill="none" stroke="#2c4561" stroke-width="1.5"/><path d="M2.5 2v3.5H6" fill="none" stroke="#2c4561" stroke-width="1.5"/>'),
 otherdoc:sv('<path d="M3 1.5h7l3 3v10H3z" fill="#fff" stroke="#5b6f86"/><circle cx="9" cy="10" r="2.6" fill="none" stroke="#2c4561" stroke-width="1.3"/><path d="M11 12l2 2" stroke="#2c4561" stroke-width="1.5"/>'),
 variant:sv('<rect x="2" y="2" width="12" height="12" rx="1" fill="#8aa6c8" stroke="#4d6d93"/><rect x="4.5" y="2.5" width="7" height="4" fill="#fff"/><path d="M5 11h6" stroke="#fff" stroke-width="1.5"/>'),
 newpw:sv('<rect x="3" y="7" width="10" height="7" rx="1" fill="#f2c94c" stroke="#b78a1a"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="#6b7c90" stroke-width="1.5"/>'),
 S:sv('<rect x="1" y="1" width="14" height="14" rx="2" fill="#3aa350"/><path d="M4.3 8.2l2.4 2.4 4.8-5.2" fill="none" stroke="#fff" stroke-width="1.9"/>'),
 E:sv('<circle cx="8" cy="8" r="7" fill="#d93131"/><path d="M5.2 5.2l5.6 5.6M10.8 5.2l-5.6 5.6" stroke="#fff" stroke-width="1.9"/>'),
 W:sv('<path d="M8 1.2L15 14H1z" fill="#f2b705" stroke="#b78600"/><path d="M8 5.5v4.2" stroke="#3a2a00" stroke-width="1.8"/><circle cx="8" cy="11.8" r="1" fill="#3a2a00"/>'),
 I:sv('<circle cx="8" cy="8" r="7" fill="#3b7dd8"/><path d="M8 7v5" stroke="#fff" stroke-width="2"/><circle cx="8" cy="4.6" r="1.1" fill="#fff"/>')
};

function startSim(id){
  const sc=SIMS.find(s=>s.id===id); if(!sc) return renderSimHome();
  SIM={sc,step:0,scr:0,where:(LOGGED&&!sc.forceLogon)?'easy':'logon',other:null,vals:{},lv:{client:'800',lang:'EN'},tabs:{},alv:{},msg:['I',(LOGGED&&!sc.forceLogon)?'SAP Easy Access':'Log on to the system'],explain:null,errId:null,modal:null,menu:null,
       warnOk:false,txDone:false,navDone:false,qDone:null,flags:{},errors:0,hints:0,hintOn:false,done:false,tree:{0:true,'f':true},sessions:1};
  if(sc.forceLogon) LOGGED=false;
  location.hash='simulator'; drawSim();
}
function defsOf(scr){
  const m={}; if(!scr) return m;
  blocksOf(scr).forEach(b=>{
    (b.fields||[]).forEach(f=>{m[f.id]={def:f,l:f.l||f.lab||f.id};if(f.to)m[f.id+'_to']={def:f,l:f.l+' (to)'};if(f.multi)m[f.id+'_multi']={def:f,l:f.l+' (multiple selection)'};});
    if(b.t==='items') for(let r=0;r<b.rows;r++) b.cols.forEach(c=>{m[`${b.key}.${r}.${c.id}`]={def:c,l:`${c.l} (item ${r+1})`};});
    if(b.t==='tabs'){b.tabs.forEach((t,ti)=>(t.fields||[]).forEach(f=>{const prev=m[f.id];m[f.id]=prev?{def:f,l:f.l}:{def:f,l:f.l,tab:ti,tabkey:b.key};}));(b.foot||[]).forEach(f=>{m[f.id]=m[f.id]||{def:f,l:f.l};});}
  });
  Object.entries(scr.popups||{}).forEach(([k,p])=>(p.fields||[]).forEach(f=>m[f.id]={def:f,l:f.l}));
  if(SIM&&SIM.modal&&SIM.modal.type==='popup')(SIM.modal.p.fields||[]).forEach(f=>m[f.id]={def:f,l:f.l});
  return m;
}
function specCheck(id,spec,scr){
  const v=SIM.vals[id]; const D=defsOf(scr)[id]; const label=D?D.l:id;
  if(spec&&typeof spec==='object'&&spec.fn){const r=spec.fn(v,SIM.vals);if(!r)return null;return typeof r==='string'?{id,sap:`Check entry in field ${label}`,idn:r}:{id,...r};}
  const want=spec&&typeof spec==='object'&&'eq' in spec?spec.eq:spec;
  let ok; if(typeof want==='boolean') ok=!!v===want; else ok=norm(v)===norm(want);
  if(ok) return null;
  const empty=typeof want==='boolean'?!v:!String(v??'').trim();
  const hint=(scr&&scr.hints&&scr.hints[id])?` Petunjuk: ${scr.hints[id]}.`:'';
  return {id,sap:(spec&&spec.sap)||(empty?`Fill in all required entry fields`:`Check entry in field ${label}`),
    idn:((spec&&spec.idn)?spec.idn+' ':'')+(empty?`Field "${label}" masih kosong.`:`Isi "${label}" belum sesuai permintaan di brief.`)+hint+(empty?'':' Catatan: di SAP asli, nilai yang valid tapi keliru tetap bisa tersimpan, jadi selalu cek ulang sebelum Save.')};
}
function validate(scr,expect){const ex=expect||scr.expect||{};for(const [id,spec] of Object.entries(ex)){const e=specCheck(id,spec,scr);if(e)return e;}return null;}
function defaults(scr){const d=Object.assign({},scr.def||{});blocksOf(scr).forEach(b=>{if(b.t==='items')for(let r=0;r<b.rows;r++)b.cols.forEach(c=>{if(c.ro&&c.v){d[`${b.key}.${r}.${c.id}`]=c.v(r);}});});return d;}
function setMsg(t,m,ex){SIM.msg=[t,m];SIM.explain=ex||null;}
function reqIds(){const s=scrOf();if(!s||!live())return new Set();return new Set(Object.keys(s.expect||{}).concat(s.req||[]));}

/* ---------- logon ---------- */
function doLogon(){
  const L=SIM.lv, st=stepOf(), strict=st&&st.k==='logon';
  const bad=(m,ex,id)=>{SIM.errors++;SIM.errId='lv.'+id;setMsg('E',m,ex);drawSim();};
  if(norm(L.client)!=='800') return bad(`Client ${L.client||'   '} is not available in this system`,'Client yang tersedia di sistem latihan ini adalah 800 (lihat email IT / brief).','client');
  if(!String(L.user||'').trim()) return bad('Enter a user name','User name belum diisi.','user');
  if(!String(L.pw||'').trim()) return bad('Enter a password','Password belum diisi.','pw');
  if(strict&&(norm(L.user)!==LOGON_USER||String(L.pw)!==st.initPw)) {SIM.lv.pw='';return bad('Name or password is incorrect (repeat logon)','User atau password salah. Perhatikan huruf besar/kecil pada password. Setelah beberapa kali salah, user bisa terkunci dan harus di-reset IT.','pw');}
  if(!['EN','ID'].includes(norm(L.lang||'EN'))) return bad(`Language ${L.lang} is not defined in the system`,'Bahasa yang terpasang: EN atau ID.','lang');
  SIM.errId=null;
  if(strict){SIM.modal={type:'pw',err:null};SIM.vals['m.npw']='';SIM.vals['m.rpw']='';setMsg('I','Initial password: choose a new password');return drawSim();}
  finishLogon();
}
function finishLogon(){LOGGED=true;SIM.where='easy';SIM.modal=null;const st=stepOf();if(st&&st.k==='logon')SIM.navDone=true;setMsg('S',`Welcome ${norm(SIM.lv.user)||LOGON_USER} – last logon ${TODAY} 07:58:12`,st&&st.k==='logon'?{t:'s',m:'Login berhasil dan password baru tersimpan.'}:null);drawSim();}
function pwOk(){
  const n=String(SIM.vals['m.npw']||''),r=String(SIM.vals['m.rpw']||''),st=stepOf();const M=SIM.modal;
  const fail=m=>{SIM.errors++;M.err=m;drawSim();};
  if(!n) return fail('Enter a new password');
  if(n!==r) return fail('The two passwords are not identical – Kedua password tidak sama.');
  if(n===st.initPw) return fail('Choose a password that is different from your last 5 passwords');
  if(n.length<8) return fail('Password must be at least 8 characters long');
  if(!/\d/.test(n)) return fail('Password must contain at least one digit');
  if(!/[A-Za-z]/.test(n)) return fail('Password must contain at least one letter');
  setMsg('S','Password was changed');finishLogon();
}
function logoff(hard){
  LOGGED=false;SIM.where='logon';SIM.modal=null;SIM.menu=null;SIM.lv={client:'800',lang:'EN',user:SIM.lv.user};SIM.sessions=1;
  if(SIM.free||(SIM.txStep===SIM.step&&!SIM.txDone))resetTx();
  setMsg(hard?'W':'I',hard?'All sessions closed (/nex) – unsaved data lost':'Logged off',hard?{t:'w',m:'/nex menutup semua session tanpa konfirmasi. Data yang belum disimpan hilang. Login lagi untuk melanjutkan.'}:{t:'i',m:'Kamu sudah logoff. Login lagi untuk melanjutkan.'});
  const st=stepOf(); if(st&&st.k==='nav'&&st.tc==='EX'&&hard) SIM.navDone=true;
  drawSim();
}

/* ---------- command field ---------- */
function runCmd(raw){
  SIM.menu=null;
  if(SIM.where==='logon'){setMsg('W','Log on to the system first',{t:'i',m:'Isi Client, User, Password, lalu tekan Enter atau ikon centang hijau.'});return drawSim();}
  let v=norm(raw); if(!v) return;
  let mode='plain';
  if(v.startsWith('/N')){mode='n';v=v.slice(2);} else if(v.startsWith('/O')){mode='o';v=v.slice(2);}
  const st=stepOf();
  if(v==='EX'&&mode==='n') return logoff(true);
  if(v==='END'&&mode==='n'){SIM.modal={type:'confirm',title:'Log Off',text:'Unsaved data will be lost. Do you want to log off?'};return drawSim();}
  if(mode==='n'&&v===''){
    const wasIn=SIM.where!=='easy';
    SIM.where='easy';SIM.other=null;SIM.modal=null;
    if(st&&st.k==='nav'&&st.tc===''&&wasIn){SIM.navDone=true;setMsg('S','SAP Easy Access','Benar. /n tanpa T-code keluar dari transaksi dan kembali ke layar awal.');}
    else if(st&&st.k==='tx'&&live()&&SIM.scr>0&&!SIM.txDone){setMsg('W','Data was not saved','Kamu keluar sebelum menyimpan. Buka transaksi lagi untuk mengulang langkah ini.');resetTx();}
    else setMsg('I','SAP Easy Access');
    return drawSim();
  }
  if(mode==='plain'&&SIM.where!=='easy'){SIM.errors++;setMsg('E',`Function code cannot be selected`,`Kamu sedang berada di dalam transaksi. Ketik /n${v} (jendela yang sama) atau /o${v} (jendela baru).`);return drawSim();}
  if(!KNOWN[v]){SIM.errors++;setMsg('E',`Transaction ${v} does not exist`,'Cek ejaan T-code. Lihat flashcard atau cheat sheet kalau lupa.');return drawSim();}
  if(mode==='o') SIM.sessions=Math.min(6,SIM.sessions+1);
  if(SIM.free){ if(typeof SBX!=='undefined'&&SBX[v]){openFree(v,mode);} else {SIM.where='other';SIM.other=v;setMsg('I',`${v} – ${KNOWN[v]}`,{t:'i',m:`${v} belum tersedia di Simulator bebas. Transaksi yang bisa dipakai: ${Object.keys(SBX).join(', ')}.`});} return drawSim(); }
  if(st&&st.k==='nav'&&v===st.tc){
    const okPre=!st.pre||st.pre===mode;
    SIM.where='other';SIM.other=v;
    if(okPre){SIM.navDone=true;setMsg('S',`${v} – ${KNOWN[v]}`,mode==='o'?'Benar. /o membuka session baru; jendela sebelumnya tetap terbuka.':mode==='n'?'Benar. /n menutup transaksi lama dan membuka yang baru di jendela yang sama.':`Benar. ${v} terbuka langsung dari Easy Access (tanpa /n karena kamu belum berada di dalam transaksi).`);}
    else {SIM.errors++;setMsg('W',`${v} – ${KNOWN[v]}`,st.pre==='o'?'Transaksi terbuka di jendela yang sama sehingga transaksi sebelumnya tertutup. Langkah ini meminta jendela baru (/o). Coba lagi dengan /o.':'Coba lagi dengan perintah yang diminta.');}
    return drawSim();
  }
  if(st&&st.k==='tx'&&v===st.tc&&!SIM.txDone){openTx(mode);return drawSim();}
  SIM.where='other';SIM.other=v;
  if(st&&!['q','act'].includes(st.k)){SIM.errors++;setMsg('W',`${v} – ${KNOWN[v]}`,`Transaksi ini terbuka, tapi bukan yang dibutuhkan langkah ini. Baca lagi "Tugas sekarang".`);}
  else setMsg('S',`${v} – ${KNOWN[v]}`);
  drawSim();
}
function resetTx(){SIM.scr=0;SIM.vals={};SIM.tabs={};SIM.alv={};SIM.warnOk=false;SIM.errId=null;}
function openTx(mode){
  const st=stepOf(); resetTx(); SIM.where='tx'; SIM.other=null; SIM.txStep=SIM.step;
  Object.assign(SIM.vals,defaults(st.screens[0]));
  setMsg('I',(mode==='o'?'New session: ':'')+(KNOWN[st.tc]||st.tc));
  if(st.popup&&!(st.popup.once&&SIM.flags[st.popup.once])){const p=st.popup.fields?st.popup:SIMS.flatMap(s=>s.steps).find(x=>x.popup&&x.popup.once===st.popup.once&&x.popup.fields).popup;SIM.modal={type:'popup',p,err:null};}
  checkGoal();
}
function advanceScreen(){
  if(SIM.free){SIM.scr++;const n=scrOf();if(n)Object.assign(SIM.vals,defaults(n));return;}
  const st=SIM.sc.steps[SIM.txStep]; const s=st.screens[SIM.scr];
  if(s.ok) setMsg('S',s.ok,null);
  if(SIM.scr<st.screens.length-1){SIM.scr++;const n=st.screens[SIM.scr];Object.assign(SIM.vals,defaults(n));SIM.warnOk=false;SIM.errId=null;if(!n.go&&!n.goal&&!(n.tbx)) SIM.txDone=true;
    const al=blocksOf(n).find(x=>x.t==='alv');if(al&&!s.ok)setMsg('S',`${al.data.rows.length} entries selected`,null);}
  else SIM.txDone=true;
  checkGoal();
}
function checkGoal(){const s=scrOf();if(s&&s.goal&&live()&&!SIM.txDone&&s.goal(SIM)){SIM.txDone=true;if(s.goalMsg)SIM.explain={t:'s',m:s.goalMsg+'. Langkah selesai.'};}}

/* ---------- actions ---------- */
function act(a){
  if(SIM.done) return;
  SIM.menu=null;
  if(SIM.modal){ if(a==='enter'||a==='exec') modalOk(); else if(a==='back'||a==='cancel') {closeModal();} return drawSim(); }
  if(SIM.where==='logon'){ if(a==='enter'||a==='save') return doLogon(); setMsg('W','Log on to the system first');return drawSim(); }
  if(['print','find','findn','shortcut','layout','first','prev','next','last'].includes(a)){setMsg('I','Function not available in the simulation',null);return drawSim();}
  if(a==='help'){setMsg('I','F1 help: place the cursor on a field and press F1',{t:'i',m:'Di SAP asli, F1 di sebuah field menampilkan penjelasan field itu. Di simulator, gunakan panel Tugas sekarang.'});return drawSim();}
  if(a==='session'){SIM.sessions=Math.min(6,SIM.sessions+1);setMsg('S',`New session opened (${SIM.sessions} of 6)`,{t:'i',m:'Sama seperti /o. Di SAP asli, jendela baru muncul dengan layar Easy Access.'});return drawSim();}
  if(a==='exit'||a==='cancel') a='back';
  if(SIM.where==='tx'&&!live()&&a!=='back'){setMsg('W','Function not possible',stepOf().k==='q'?{t:'i',m:'Jawab dulu pertanyaan cek di panel kiri. Kamu tetap bisa membaca layar ini, membuka tab, dan memakai toolbar ALV.'}:{t:'w',m:'Layar ini milik langkah sebelumnya. Buka transaksi berikutnya lewat command field (ingat /n dari dalam transaksi).'});return drawSim();}
  if(a==='back'){ if(SIM.where==='easy'){setMsg('I','SAP Easy Access');return drawSim();}
    if(SIM.where==='tx'&&live()&&SIM.scr>0&&!SIM.txDone&&scrOf().go!=='save'){SIM.scr--;setMsg('I','Back');return drawSim();}
    if(SIM.where==='tx'&&live()&&!SIM.txDone){setMsg('W','Data was not saved','F3 keluar tanpa menyimpan. Buka transaksi lagi untuk mengulang.');resetTx();}
    SIM.where='easy';SIM.other=null; if(!SIM.explain)setMsg('I','SAP Easy Access'); return drawSim(); }
  const scr=scrOf();
  if(!scr){ if(a==='enter'){return drawSim();} setMsg('W','Function not possible on this screen',SIM.where==='easy'?'Buka transaksi dulu lewat command field atau SAP menu.':null); return drawSim(); }
  if(SIM.txDone){setMsg('I',SIM.msg[1]);return drawSim();}
  if(a==='enter'){
    let r=scr.onEnter?scr.onEnter(SIM.vals):null;
    if(r&&r.msg&&r.msg[0]==='E'){SIM.errors++;setMsg('E',r.msg[1],r.explain||null);return drawSim();}
    if(r&&r.fill)Object.assign(SIM.vals,r.fill);
    if(SIM.warnPending){SIM.warnPending=null;SIM.warnOk=true;return complete(scr);}
    if(scr.go==='enter') return complete(scr);
    if(r&&r.msg)setMsg(r.msg[0],r.msg[1],r.explain||null); else if(r&&r.explain)setMsg('I',SIM.msg[1],r.explain);
    else setMsg('S',' ',null);
    SIM.errId=null; return drawSim();
  }
  if(a==='check'){ const e=validate(scr); if(e){SIM.errors++;SIM.errId=e.id;setMsg('E',e.sap,e.idn);} else {SIM.errId=null;setMsg('S',scr.checkOk||'No errors found',null);} return drawSim(); }
  if(a==='save'&&scr.sel){
    if(scr.go==='variant'){const e=validate(scr);if(e){SIM.errors++;SIM.errId=e.id;setMsg('E',e.sap,e.idn);return drawSim();}}
    SIM.modal={type:'variant',err:null}; return drawSim();
  }
  if(a==='save'&&SIM.warnPending){SIM.warnPending=null;SIM.warnOk=true;return complete(scr);}
  if(scr.tbx&&scr.tbx.some(b=>b.k===a)){SIM.modal={type:'popup',p:scr.popups[a],err:null,key:a};return drawSim();}
  if(a!==scr.go){
    const want={save:'Save/Post (Ctrl+S)',exec:'Execute (F8)',enter:'Enter',variant:'Save as Variant (Ctrl+S)'}[scr.go];
    setMsg('W','Function not possible',scr.go?`Layar ini diselesaikan dengan ${want}.`:(scr.tbx?'Pakai tombol di application toolbar (misalnya Other Purchase Order).':null)); return drawSim();
  }
  complete(scr);
}
function complete(scr){
  if(scr.onGo){
    if(scr.onEnter&&scr.go!=='enter'){const r0=scr.onEnter(SIM.vals);if(r0&&r0.msg&&r0.msg[0]==='E'){SIM.errors++;setMsg('E',r0.msg[1],r0.explain||null);return drawSim();}if(r0&&r0.fill){for(const [k,v] of Object.entries(r0.fill)){if(SIM.vals[k]===undefined||SIM.vals[k]==='')SIM.vals[k]=v;}}}
    const r=scr.onGo(SIM.vals)||{};
    if(r.err){SIM.errors++;SIM.errId=r.err.id||null;setMsg(r.err.t||'E',r.err.sap,r.err.idn);return drawSim();}
    SIM.errId=null;
    if(r.warn&&!SIM.warnOk){SIM.warnPending=scr.go;setMsg('W',r.warn.sap,r.warn.idn);return drawSim();}
    SIM.warnOk=false;
    if(r.popup){SIM.modal={type:'popup',p:r.popup,err:null};return drawSim();}
    if(r.screen){SIM.ftx.screens[SIM.scr+1]=r.screen;SIM.ftx.screens.length=SIM.scr+2;SIM.scr++;Object.assign(SIM.vals,defaults(r.screen));setMsg(r.msg?r.msg[0]:'S',r.msg?r.msg[1]:'Data displayed',r.explain||null);return drawSim();}
    if(r.reset){resetFree();}
    if(r.msg)setMsg(r.msg[0],r.msg[1],r.explain||null);
    return drawSim();
  }
  if(scr.onEnter&&scr.go!=='enter'){const r=scr.onEnter(SIM.vals);if(r&&r.msg&&r.msg[0]==='E'){SIM.errors++;setMsg('E',r.msg[1],r.explain||null);return drawSim();}if(r&&r.fill){for(const [k,v] of Object.entries(r.fill)){if(SIM.vals[k]===undefined||SIM.vals[k]==='')SIM.vals[k]=v;}}}
  const e=validate(scr);
  if(e){SIM.errors++;SIM.errId=e.id;setMsg('E',e.sap,e.idn);return drawSim();}
  SIM.errId=null;
  if(scr.warn&&!SIM.warnOk){const w=scr.warn(SIM.vals);if(w){SIM.warnPending=scr.go;setMsg('W',w.sap,w.idn);return drawSim();}}
  SIM.warnOk=false;
  if(scr.popupOnGo){SIM.modal={type:'popup',p:scr.popups[scr.popupOnGo],err:null};return drawSim();}
  advanceScreen(); drawSim();
}
function closeModal(){
  const M=SIM.modal; if(!M) return;
  if(M.type==='multi')delete SIM.vals['_multi_edit'];
  if(M.type==='pw'){SIM.modal=null;SIM.lv.pw='';setMsg('W','Password change cancelled – logon not possible',{t:'w',m:'Saat login pertama, password wajib diganti. Login ulang.'});return;}
  SIM.modal=M.back||null;
  if(M.type==='popup'&&M.p.cancelToEasy){SIM.where='easy';resetTx();setMsg('W',M.p.cancelMsg||'Cancelled');return;}
  const st=stepOf(); if(M.type==='popup'&&st&&st.popup&&!SIM.flags[st.popup.once]){SIM.where='easy';resetTx();setMsg('W','Database profile not selected','Tanpa database profile, CJI3/CJI5 tidak bisa dibuka. Buka lagi transaksinya.');}
}
function modalOk(){
  const M=SIM.modal; if(!M) return;
  if(M.type==='f4'){SIM.modal=M.back||null;return;}
  if(M.type==='status'||M.type==='info'){SIM.modal=null;return;}
  if(M.type==='confirm'){SIM.modal=null;logoff(false);return;}
  if(M.type==='pw'){pwOk();return;}
  if(M.type==='multi'){const vals=(SIM.vals['_multi_edit']||[]).map(x=>String(x).trim()).filter(Boolean);SIM.vals[M.fid+'_multi']=vals;delete SIM.vals['_multi_edit'];SIM.modal=M.back||null;setMsg('S',vals.length?`${vals.length} values copied to selection`:'Selection cleared');return;}
  if(M.type==='filter'){const st=SIM.alv[M.key];const v=String(SIM.vals['_flt']||'').trim();st.flt=v?{col:M.col,v}:null;delete SIM.vals['_flt'];SIM.modal=null;setMsg('S',v?`Filter set: ${v}`:'Filter removed');checkGoal();return;}
  if(M.type==='variant'){const n=norm(SIM.vals['_vname']),d=String(SIM.vals['_vdesc']||'').trim();if(!n||!d){M.err='Enter variant name and meaning (Isi Variant Name dan Description).';return;}SIM.modal=null;setMsg('S',`Variant ${n} saved`,{t:'s',m:'Variant tersimpan. Minggu depan pakai Get Variant (Shift+F5).'});const scr=scrOf();if(scr&&scr.go==='variant'){advanceScreen();}return;}
  if(M.type==='popup'){
    const p=M.p; const e=validate(scrOf()||{},p.expect||{});
    if(e){SIM.errors++;M.err=e.sap+' — '+e.idn;return;}
    if(p.onOk){const r=p.onOk(SIM.vals);if(r&&r.err){SIM.errors++;M.err=r.err;return;}SIM.modal=null;if(p.once)SIM.flags[p.once]=true;if(r&&r.screen){SIM.ftx.screens[SIM.scr+1]=r.screen;SIM.ftx.screens.length=SIM.scr+2;SIM.scr++;Object.assign(SIM.vals,defaults(r.screen));}if(r&&r.msg)setMsg(r.msg[0],r.msg[1],r.explain||null);return;}
    if(p.once)SIM.flags[p.once]=true;
    SIM.modal=null; const st=stepOf();
    if(st&&st.popup&&st.popup.once)SIM.flags[st.popup.once]=true;
    if(p.next){advanceScreen();} else setMsg('I',p.title+': '+Object.keys(p.expect||{}).map(k=>SIM.vals[k]).join(' '));
    return;
  }
}
function openStatus(){
  const tcd=curTc();
  SIM.modal={type:'status',tcd,title:SIM.where==='easy'?'SAP Easy Access':screenTitle()};
  if(SIM.where!=='easy')SIM.flags.statusSeen=tcd;
}

/* ---------- rendering helpers ---------- */
function fieldClasses(id){const c=[];if(SIM.errId===id)c.push('err');if(S.simMode==='guided'&&SIM.nextId===id)c.push('nextf');if(SIM._req&&SIM._req.has(id))c.push('reqin');return c.join(' ');}
function ctlH(f,id){
  id=id||f.id; const t=fT(f); const v=SIM.vals[id]; const cls=fieldClasses(id);
  if(t==='ro'){const val=v!=null&&v!==''?v:(f.v!=null?(typeof f.v==='function'?f.v(SIM.vals):f.v):'');return `<span class="ro" data-ro="${esc(id)}">${esc(val)}</span>`;}
  if(t==='sel')return `<select id="${fid(id)}" data-f="${esc(id)}" class="${cls}" aria-label="${esc(f.l||id)}">${(f.blank?'<option value=""></option>':'')}${f.opts.map(o=>`<option value="${o[0]}" ${v===o[0]?'selected':''}>${o[0]} ${o[1]}</option>`).join('')}</select>`;
  if(t==='chk')return `<input type="checkbox" id="${fid(id)}" data-f="${esc(id)}" class="${cls}" ${v?'checked':''} aria-label="${esc(f.l||id)}">`;
  let h=`<input type="${t==='pw'?'password':'text'}" id="${fid(id)}" data-f="${esc(id)}" class="${cls}" value="${esc(v??'')}" style="width:calc(${(f.w||12)+3}ch + ${cls.includes('reqin')?14:0}px)" placeholder="${esc(f.ph||'')}" autocomplete="off" spellcheck="false" aria-label="${esc(f.l||id)}">`;
  if(f.f4)h+=`<button class="f4" data-f4="${esc(id)}" data-k4="${f.f4}" title="Possible entries (F4)" tabindex="-1">${ICO.f4}</button>`;
  return h;
}
function fieldRow(f){
  if(!shown(f))return '';
  let ctl=ctlH(f);
  if(f.to)ctl+=`<span class="to">to</span>`+ctlH(Object.assign({},f),f.id+'_to');
  if(f.multi){const on=(SIM.vals[f.id+'_multi']||[]).length;ctl+=`<button class="msel ${on?'on':''} ${fieldClasses(f.id+'_multi')}" data-multi="${esc(f.id)}" title="Multiple selection">${ICO.multi}</button>${on?`<span class="to">${on} nilai</span>`:''}`;}
  if(fT(f)==='chk')return `<div class="fld cb">${ctl}<label for="${fid(f.id)}">${esc(f.l||'')}</label></div>`;
  return `<div class="fld"><label for="${fid(f.id)}">${esc(f.l||'')}</label><div class="inp">${ctl}</div></div>`;
}
function blockH(b){
  if(!shown(b))return '';
  if(b.t==='group')return `<fieldset class="gb">${b.title?`<legend>${esc(b.title)}</legend>`:''}<div class="fgrid ${b.fields.some(f=>f.to||f.multi)||scrOf()&&scrOf().sel?'one':''}">${b.fields.map(fieldRow).join('')}</div></fieldset>`;
  if(b.t==='bar')return `<div class="gbar">${b.fields.filter(shown).map(f=>`${f.t==='sel'?'':`<label for="${fid(f.id)}">${esc(f.lab||f.l||'')}</label>`}<span class="inp" style="display:inline-flex;gap:3px;align-items:center;position:relative">${ctlH(f)}</span>`).join(' ')}</div>`;
  if(b.t==='note')return `<div class="scr-note">${b.html}</div>`;
  if(b.t==='kv')return `<fieldset class="gb"><div class="fgrid">${b.rows.map(r=>`<div class="fld"><label>${esc(r[0])}</label><div class="inp"><span class="ro">${esc(typeof r[1]==='function'?r[1](SIM.vals):r[1])}</span></div></div>`).join('')}</div></fieldset>`;
  if(b.t==='table')return `${b.title?`<div class="blk-h">${esc(b.title)}</div>`:''}<div style="overflow-x:auto;margin-bottom:10px"><table class="it"><tr><th class="rs"></th>${b.h.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${b.r.map(r=>`<tr><td class="rs"></td>${r.map(c=>`<td class="rot">${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>`;
  if(b.t==='items'){
    const cols=b.cols.filter(shown);
    return `<div class="blk-h"><span>${esc(b.title||'Items')}</span></div><div style="overflow-x:auto;margin-bottom:10px"><table class="it"><tr><th class="rs"></th>${cols.map(c=>`<th>${esc(c.l)}</th>`).join('')}</tr>${Array.from({length:b.rows},(_,r)=>`<tr><td class="rs"></td>${cols.map(c=>{const id=`${b.key}.${r}.${c.id}`;if(c.ro)return `<td class="rot" data-ro="${esc(id)}">${esc(SIM.vals[id]??'')}</td>`;if(c.t==='chk')return `<td style="text-align:center">${ctlH({t:'chk',l:c.l},id)}</td>`;return `<td><span class="inp" style="display:inline-flex;gap:2px;align-items:center">${ctlH(c,id)}</span></td>`;}).join('')}</tr>`).join('')}</table></div>`;
  }
  if(b.t==='tabs'){
    const tabs=b.tabs.map((t,i)=>({t,i})).filter(x=>shown(x.t)); let cur=SIM.tabs[b.key]; if(cur==null||!tabs.some(x=>x.i===cur))cur=tabs[0].i;
    const needTab=(()=>{const D=defsOf(scrOf()||{});const n=SIM.nextId&&D[SIM.nextId];return S.simMode==='guided'&&n&&n.tabkey===b.key?n.tab:null;})();
    const T=b.tabs[cur];
    let body=''; if(T.fields)body+=`<div class="fgrid">${T.fields.map(fieldRow).join('')}</div>`; if(T.table)body+=blockH({t:'table',h:T.table.h,r:T.table.r}); if(T.html)body+=T.html;
    const foot=(b.foot||[]).map(fieldRow).join('');
    return `${b.title?`<div class="blk-h"><span>${esc(txt(b.title))}</span></div>`:''}<div class="tabs" role="tablist">${tabs.map(x=>`<button role="tab" aria-selected="${x.i===cur}" class="${x.i===cur?'on':''} ${needTab===x.i&&x.i!==cur?'need':''}" data-tab="${b.key}" data-ti="${x.i}">${esc(x.t.l)}</button>`).join('')}</div><div class="tab-body">${body}${foot?`<div style="border-top:1px solid #c3d1e0;margin-top:8px;padding-top:6px">${foot}</div>`:''}</div>`;
  }
  if(b.t==='alv')return alvH(b);
  return '';
}
const dnum=s=>{const d=dParse(s);return d?d.getTime():0;};
function alvH(b){
  const D=b.data; const st=SIM.alv[b.key]||(SIM.alv[b.key]={col:null,dir:0,flt:null,sum:null});
  let rows=D.rows.slice();
  if(st.flt)rows=rows.filter(r=>String(r[st.flt.col]).toLowerCase().includes(st.flt.v.toLowerCase()));
  if(st.col&&st.dir){const c=D.cols.find(x=>x.id===st.col);rows.sort((a,z)=>{const A=a[st.col],Z=z[st.col];const r=c.num?A-Z:c.date?dnum(A)-dnum(Z):String(A).localeCompare(String(Z));return r*st.dir;});}
  const fmt=(c,v)=>c.num?Number(v).toLocaleString('id-ID'):v;
  const sumRow=st.sum?`<tr class="sum"><td class="rs"></td>${D.cols.map((c,i)=>`<td class="${c.num?'n':''}">${c.id===st.sum?'Σ '+rows.reduce((s,r)=>s+Number(r[c.id]||0),0).toLocaleString('id-ID'):(i===0?'Total':'')}</td>`).join('')}</tr>`:'';
  const lab=S.simMode==='guided';
  const B=(k,ic,l,t)=>`<button class="abtn" data-alv="${k}" data-key="${b.key}" title="${t}">${ic}${lab?`<span>${l}</span>`:''}</button>`;
  return `<div class="alv-tb" role="toolbar" aria-label="ALV toolbar">${B('asc',ICO.sortA,'Sort','Sort in Ascending Order')}${B('desc',ICO.sortD,'Sort','Sort in Descending Order')}<span class="tsep"></span>${B('filter',ICO.filter,'Filter','Set Filter')}${B('sum',ICO.sum,'Total','Total (Σ)')}<span class="tsep"></span>${B('export',ICO.xls,'Spreadsheet','Export → Spreadsheet')}${st.flt||st.sum||st.dir?B('reset',ICO.reset,'Reset','Reset layout'):''}
    <span class="info">${st.col?`Kolom: ${esc(D.cols.find(c=>c.id===st.col).l)} · `:'Klik judul kolom untuk memilih · '}${rows.length} baris${st.flt?' (filter)':''}</span></div>
  <div style="overflow-x:auto"><table class="it alv"><tr><th class="rs"></th>${D.cols.map(c=>`<th class="${st.col===c.id?'sel':''} ${c.num?'n':''}" data-alvcol="${c.id}" data-key="${b.key}" tabindex="0">${esc(c.l)}${st.col===c.id&&st.dir?(st.dir>0?' ▲':' ▼'):''}</th>`).join('')}</tr>
  ${rows.map(r=>`<tr><td class="rs"></td>${D.cols.map(c=>`<td class="rot ${c.num?'n':''} ${st.col===c.id?'sel':''}">${esc(fmt(c,r[c.id]))}</td>`).join('')}</tr>`).join('')}${sumRow}</table></div>`;
}
function alvAct(a,key,col){
  const st=SIM.alv[key]; const b=blocksOf(scrOf()).find(x=>x.key===key); const D=b.data;
  if(col){st.col=col;setMsg('I',`Column selected: ${D.cols.find(c=>c.id===col).l}`);return;}
  if(a==='reset'){SIM.alv[key]={col:null,dir:0,flt:null,sum:null};setMsg('I','Layout reset');return;}
  if(a==='export'){st.exported=true;setMsg('S','Data was exported to spreadsheet (simulation)',{t:'i',m:'Di SAP asli muncul dialog pilihan format lalu file .xlsx tersimpan di komputermu.'});checkGoal();return;}
  if(!st.col){setMsg('W','Select at least one column',{t:'w',m:'Klik judul kolom dulu, lalu pilih fungsi ALV.'});return;}
  const c=D.cols.find(x=>x.id===st.col);
  if(a==='asc'||a==='desc'){st.dir=a==='asc'?1:-1;setMsg('S',`Sorted by ${c.l}`);}
  if(a==='sum'){if(!c.num){setMsg('W','Totals can only be created for numeric columns',{t:'w',m:'Σ hanya bisa untuk kolom angka. Pilih kolom nilai/qty.'});return;}st.sum=st.sum===c.id?null:c.id;setMsg('S',st.sum?`Total calculated for ${c.l}`:'Total removed');}
  if(a==='filter'){SIM.vals['_flt']=st.flt&&st.flt.col===c.id?st.flt.v:'';SIM.modal={type:'filter',key,col:c.id,l:c.l};}
  checkGoal();
}
function treeH(nodes,path){
  return `<ul class="tree ${path===''?'root':''}">${nodes.map((n,i)=>{const p=path+'/'+i;
    if(Array.isArray(n))return `<li><button data-tcode="${n[0]}" title="Double-click untuk membuka">${ICO.tx}<span><code>${n[0]}</code> – ${esc(n[1])}</span></button></li>`;
    const open=SIM.tree[p]; return `<li><button data-tree="${p}" aria-expanded="${!!open}"><span style="width:9px;font-size:9px">${open?'▼':'▶'}</span>${open?ICO.folderO:ICO.folder}${esc(n.l)}</button>${open?treeH(n.c,p):''}</li>`;}).join('')}</ul>`;
}
function modalH(){
  const M=SIM.modal; if(!M) return '';
  const ok=(l='Continue')=>`<button class="abtn" data-dlg="ok" title="Enter">${ICO.enter}<span>${l}</span></button>`, cx=`<button class="abtn" data-dlg="cancel" title="Cancel (F12)">${ICO.cancel}<span>Cancel</span></button>`;
  let t='',b='',f=ok()+cx;
  const err=M.err?`<div class="dlg-err">${ICO.E}<span>${esc(M.err)}</span></div>`:'';
  if(M.type==='f4'){
    const list=(typeof F4[M.k]==='function'?F4[M.k]():F4[M.k])||[]; const q=(M.q||'').toLowerCase(); const hits=list.filter(o=>(o[0]+' '+o[1]).toLowerCase().includes(q));
    t=`${esc(M.l)} (1)  ${hits.length} Entries found`;
    b=`<div class="tabs"><button class="on">Restrictions</button></div><div class="tab-body"><div class="fld"><label for="f4q">Search term</label><div class="inp"><input type="text" id="f4q" value="${esc(M.q||'')}" placeholder="*6205*" style="width:22ch;text-transform:none" autocomplete="off"></div></div></div>
    <div class="hit"><table class="it" style="min-width:100%"><tr><th class="rs"></th><th>Key</th><th>Description</th></tr>${hits.map(o=>`<tr data-pick="${esc(o[0])}" tabindex="0"><td class="rs"></td><td class="rot">${esc(o[0]||'(blank)')}</td><td>${esc(o[1])}</td></tr>`).join('')}</table></div><div style="font-size:12px;color:#3c5470;margin-top:6px">Klik/Enter pada satu baris untuk memilih.</div>`;
    f=cx;
  } else if(M.type==='multi'){
    const cur=SIM.vals['_multi_edit']||(SIM.vals['_multi_edit']=(SIM.vals[M.fid+'_multi']||[]).slice());
    t=`Multiple Selection for ${esc(M.l)}`;
    b=`<div class="tabs"><button class="on">Select Single Values (${cur.filter(Boolean).length})</button><button disabled>Select Ranges</button><button disabled>Exclude Single Values</button></div><div class="tab-body">
    <table class="it" style="min-width:100%"><tr><th class="rs"></th><th style="width:40px"></th><th>Single value</th></tr>${Array.from({length:Math.max(6,cur.length+1)},(_,i)=>`<tr><td class="rs"></td><td class="rot">=</td><td><input type="text" data-mrow="${i}" value="${esc(cur[i]||'')}" style="width:100%" autocomplete="off"></td></tr>`).join('')}</table>
    <div style="margin-top:10px"><label for="mpaste" style="font-weight:700">Upload from clipboard (Shift+F12)</label><div style="font-size:12px;color:#3c5470">Simulasi: tempel (Ctrl+V) kolom dari Excel di kotak ini.</div><textarea id="mpaste" rows="3" style="width:100%" placeholder="Tempel di sini"></textarea></div></div>`;
    f=`<button class="abtn" data-dlg="ok" title="Copy (F8)">${ICO.exec}<span>Copy</span></button><button class="abtn" data-dlg="clearm">${ICO.cancel}<span>Delete Entire Selection</span></button>${cx}`;
  } else if(M.type==='variant'){
    t='ABAP: Save as Variant';
    b=`<fieldset class="gb"><legend>Variant Attributes</legend><div class="fld"><label for="f__vname">Variant Name</label><div class="inp">${ctlH({w:16},'_vname')}</div></div><div class="fld"><label for="f__vdesc">Meaning</label><div class="inp">${ctlH({w:28},'_vdesc')}</div></div></fieldset><div style="font-size:12px;color:#3c5470">Tips: nama diawali Z, misalnya ZPO_OPEN_P05.</div>${err}`;
    f=`<button class="abtn" data-dlg="ok" title="Save">${ICO.save}<span>Save</span></button>${cx}`;
  } else if(M.type==='filter'){
    t='Determine values for filter criteria';
    b=`<div class="fld"><label for="f__flt">${esc(M.l)}</label><div class="inp">${ctlH({w:18},'_flt')}</div></div><div style="font-size:12px;color:#3c5470;margin-top:6px">Baris yang mengandung teks ini akan ditampilkan. Kosongkan untuk menghapus filter.</div>`;
  } else if(M.type==='popup'){
    t=esc(M.p.title); b=`<div class="fgrid" style="grid-template-columns:1fr">${M.p.fields.map(fieldRow).join('')}</div>${err}`;
  } else if(M.type==='pw'){
    t='SAP: Change Password';
    b=`<div style="display:flex;gap:10px;margin-bottom:10px">${ICO.I}<span>Password awal harus diganti. Minimal 8 karakter, mengandung huruf dan angka, berbeda dari password lama.</span></div><div class="fld"><label for="f_m_npw">New Password</label><div class="inp">${ctlH({t:'pw',w:16},'m.npw')}</div></div><div class="fld"><label for="f_m_rpw">Repeat Password</label><div class="inp">${ctlH({t:'pw',w:16},'m.rpw')}</div></div>${err}`;
    f=ok('Confirm')+cx;
  } else if(M.type==='confirm'){
    t=esc(M.title); b=`<div style="display:flex;gap:10px">${ICO.W}<span>${esc(M.text)}</span></div>`; f=ok('Yes')+`<button class="abtn" data-dlg="cancel">${ICO.cancel}<span>No</span></button>`;
  } else if(M.type==='status'){
    t='System: Status';
    const row=(a,v)=>`<div class="fld"><label>${a}</label><div class="inp"><span class="ro">${esc(v)}</span></div></div>`;
    b=`<fieldset class="gb"><legend>Usage data</legend><div class="fgrid one">${row("Client","800")}${row('User',norm(SIM.lv.user)||LOGON_USER)}${row('Language','EN')}${row('System date',TODAY)}</div></fieldset>
       <fieldset class="gb"><legend>Repository data</legend><div class="fgrid" style="grid-template-columns:1fr">${row('Transaction',M.tcd)}${row('Screen title',M.title)}</div></fieldset>`;
    f=ok('OK');
  }
  return `<div class="dlg-wrap"><div class="dlg" role="dialog" aria-modal="true" aria-label="${t}"><div class="dlg-t"><span>${t}</span><button data-dlg="cancel" aria-label="Tutup">✕</button></div><div class="dlg-b">${b}</div><div class="dlg-f">${f}</div></div></div>`;
}

/* ---------- guide (coach) ---------- */
function guideItems(){
  if(SIM.where==='logon'){const st=stepOf();const strict=st&&st.k==='logon';return [{id:'lv.client',ok:norm(SIM.lv.client)==='800',l:'Client: 800'},{id:'lv.user',ok:strict?norm(SIM.lv.user)===LOGON_USER:!!String(SIM.lv.user||'').trim(),l:`User: ${LOGON_USER}`},{id:'lv.pw',ok:!!SIM.lv.pw,l:strict?'Password awal (dari email IT)':'Password (bebas di simulasi)'},{id:'lv.lang',ok:['EN','ID'].includes(norm(SIM.lv.lang)),l:'Logon Language: EN'}];}
  const scr=scrOf(); if(!scr||!live()||stepDone()) return [];
  let ex=scr.expect||{}; if(SIM.modal&&SIM.modal.type==='popup') ex=SIM.modal.p.expect||{};
  const D=defsOf(scr);
  return Object.entries(ex).map(([id,spec])=>{const ok=!specCheck(id,spec,scr);const d=D[id];return {id,ok,l:d?d.l:id,where:d&&d.tab!=null?`tab ${blocksOf(scr).find(b=>b.key===d.tabkey).tabs[d.tab].l}`:'',hint:(scr.hints||{})[id]};});
}
function computeNext(){const g=guideItems().find(x=>!x.ok);SIM.nextId=g?g.id:null;SIM._req=reqIds();}
function guideH(){
  const items=guideItems(); if(!items.length) return '';
  const nx=items.find(x=>!x.ok);
  return `<ul class="glist" id="glist">${items.map(x=>`<li class="${x.ok?'ok':''} ${nx&&nx.id===x.id?'nx':''}"><span class="gk">${x.ok?'✓':''}</span><span>${esc(x.l)}${x.where?` <small>di ${esc(x.where)}</small>`:''}${SIM.hintOn&&x.hint?`<small>Petunjuk: ${esc(x.hint)}</small>`:''}</span></li>`).join('')}</ul>`;
}
function refreshGuide(){
  computeNext();
  const g=$('#glist'); if(g){const tmp=document.createElement('div');tmp.innerHTML=guideH();const n=tmp.firstElementChild;if(n)g.replaceWith(n);}
  $$('.gui .nextf').forEach(e=>e.classList.remove('nextf'));
  if(S.simMode==='guided'&&SIM.nextId){const sel=SIM.nextId.endsWith('_multi')?`[data-multi="${SIM.nextId.slice(0,-6)}"]`:`[data-f="${SIM.nextId}"]`;const el=$(sel);if(el)el.classList.add('nextf');}
}
function attachH(a){
  if(!a) return '';
  if(a.t==='xl') return `<div class="att"><div class="att-h"><span><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"/></svg>${esc(a.title)}</span><button class="linkbtn" id="copyCol">Salin kolom</button></div><table class="xl"><tr><th>A · ${esc(a.col||'No. PO')}</th></tr>${a.rows.map(r=>`<tr><td>${r}</td></tr>`).join('')}</table></div>`;
  if(a.t==='sj') return `<div class="att"><div class="att-h"><span><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"/></svg>${esc(a.title)}</span></div><table>${a.rows.map(r=>`<tr><td class="muted">${esc(r[0])}</td><td><b>${esc(r[1])}</b></td></tr>`).join('')}</table></div>`;
  if(a.t==='sheet') return `<div class="att"><div class="att-h"><span><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.4 3.4 0 0 1 4.8 4.8l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"/></svg>${esc(a.title)}</span></div><table><tr>${(a.h||['Item','Material','Hitung']).map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${a.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>`;
  return '';
}
function stepDone(){const st=stepOf();if(!st)return false;if(st.k==='nav'||st.k==='logon')return SIM.navDone;if(st.k==='tx')return SIM.txDone&&live();if(st.k==='q')return SIM.qDone!=null;if(st.k==='act')return !!st.goal(SIM);return false;}
function coachH(){
  if(SIM.free) return freeCoachH();
  const sc=SIM.sc, st=stepOf(), n=sc.steps.length;
  const dots=sc.steps.map((_,i)=>`<i class="${i<SIM.step||SIM.done?'d':i===SIM.step?'c':''}"></i>`).join('');
  let task='';
  if(SIM.done){
    const stars=SIM.errors===0&&SIM.hints===0?3:SIM.errors<=3?2:1;
    task=`<div class="card"><h4>Skenario selesai</h4><div class="stars">${'★'.repeat(stars)}<i>${'★'.repeat(3-stars)}</i></div><p style="font-size:14px">Kesalahan: <b>${SIM.errors}</b> · Petunjuk dipakai: <b>${SIM.hints}</b> · Mode: ${S.simMode==='guided'?'Panduan':'Ujian'}</p><p style="font-size:13.5px" class="muted">${stars===3?'Sempurna. Coba mode Ujian untuk menguji diri tanpa panduan.':'Ulangi sampai tanpa kesalahan, lalu coba mode Ujian.'}</p><div class="row"><button class="btn sm" id="simAgain">Ulangi</button><button class="btn sm ghost" id="simNextSc">Skenario berikutnya →</button><button class="btn sm ghost" id="simList">Daftar</button></div></div>`;
  } else if(st.k==='q'){
    const ans=SIM.qDone;
    task=`<div class="card"><h4>Pertanyaan cek</h4><p style="font-size:14px;margin-top:0">${esc(st.instr)}</p>${st.o.map((o,j)=>`<button class="opt ${ans!=null?(j===st.a?(ans===st.a?'right':''):(j===ans?'wrong':'')):''}" data-qj="${j}" ${ans===st.a?'disabled':''}>${esc(o)}</button>`).join('')}
    ${ans!=null?`<div class="exp"><b style="color:${ans===st.a?'var(--ok)':'var(--bad)'}">${ans===st.a?'Benar.':'Belum tepat, coba lagi.'}</b> ${ans===st.a?esc(st.e):(st.fb&&st.fb[ans]?esc(st.fb[ans]):'')}</div>`:''}
    ${ans===st.a?`<button class="btn sm" id="nextStep" style="margin-top:10px">${SIM.step===n-1?'Selesai':'Lanjut →'}</button>`:''}<p class="muted" style="font-size:12px;margin:8px 0 0">Layar SAP di samping tetap bisa dibaca dan dipakai (sort, Σ, tab).</p></div>`;
  } else {
    const done=stepDone();
    const exp=SIM.explain?(typeof SIM.explain==='object'?SIM.explain:{t:SIM.msg[0].toLowerCase(),m:SIM.explain}):null;
    const showGuide=S.simMode==='guided'&&!done&&(SIM.where==='logon'||(SIM.where==='tx'&&live()));
    task=`<div class="card"><h4>Tugas sekarang</h4><p style="font-size:14px;margin-top:0">${esc(SIM.where==='logon'&&st.k!=='logon'?'Login dulu ke sistem (client 800, user '+LOGON_USER+', password bebas di simulasi), lalu: '+st.instr:st.instr)}</p>
      ${showGuide?guideH():''}
      ${S.simMode==='guided'&&st.k==='tx'&&SIM.where!=='logon'&&(SIM.where!=='tx'||!live())&&!done?`<p class="muted" style="font-size:13px">Petunjuk: T-code yang dibutuhkan diawali <code>${st.tc.slice(0,2)}…</code>${SIM.where!=='easy'?' (ingat /n dari dalam transaksi)':''}</p>`:''}
      ${exp&&(S.simMode==='guided'||exp.t==='s')?`<div class="explain ${exp.t==='e'?'':exp.t}" style="margin-top:10px"><b>${exp.t==='e'?'Arti pesan error':exp.t==='w'?'Arti warning':exp.t==='s'?'Bagus':'Info'}:</b> ${esc(exp.m)}</div>`:''}
      ${done?`<div class="explain s" style="margin-top:10px"><b>Langkah ${SIM.step+1} selesai.</b> ${st.k==='tx'&&st.screens.some(x=>x.ok)?'Catat nomor dokumen di status bar ke tracker.':st.k==='tx'?'Baca hasil di layar, lalu lanjut.':''}</div><button class="btn sm" id="nextStep" style="margin-top:10px">${SIM.step===n-1?'Selesai':'Lanjut →'}</button>`:
      `<div class="row" style="margin-top:10px">${showGuide&&SIM.where==='tx'?`<button class="btn sm ghost" id="hintBtn">${SIM.hintOn?'Petunjuk aktif':'Tampilkan petunjuk'}</button>`:''}</div>`}
    </div>`;
  }
  return `<div class="card brief"><div class="spread"><span class="from">${esc(sc.brief.from)}</span><span class="pill">${sc.lvl}</span></div><blockquote>${esc(sc.brief.msg)}</blockquote>${attachH(sc.attach)}${st&&st.attach&&!SIM.done?attachH(st.attach):''}
   <div style="font-size:12px;color:var(--muted);margin-top:10px">Langkah ${Math.min(SIM.step+1,n)} dari ${n}</div><div class="stepdots">${dots}</div></div>
   ${task}
   <div class="mode-sw" role="group" aria-label="Mode simulator"><button data-mode="guided" class="${S.simMode==='guided'?'on':''}">Mode panduan</button><button data-mode="exam" class="${S.simMode==='exam'?'on':''}">Mode ujian</button></div>`;
}
function logonH(){
  const L=SIM.lv; const c=id=>`${SIM.errId==='lv.'+id?'err':''} ${S.simMode==='guided'&&SIM.nextId==='lv.'+id?'nextf':''}`;
  const inp=(id,type,w)=>`<input type="${type}" id="lv_${id}" data-lv="${id}" class="${c(id)} reqin" value="${esc(L[id]||'')}" style="width:calc(${w+2}ch + 16px)" autocomplete="off" spellcheck="false">`;
  return `<div class="logon"><div>
   <div class="fld"><label for="lv_client">Client</label><div class="inp">${inp('client','text',5)}</div></div><div class="sp"></div>
   <div class="fld"><label for="lv_user">User</label><div class="inp">${inp('user','text',14)}</div></div>
   <div class="fld"><label for="lv_pw">Password</label><div class="inp">${inp('pw','password',14)}</div></div><div class="sp"></div>
   <div class="fld"><label for="lv_lang">Logon Language</label><div class="inp">${inp('lang','text',4)}</div></div></div>
   <div class="info-box"><div class="h">Information</div><div class="b">Welcome to the JACIWEY training system (simulation).<br><br>Akademi SAP JACIWEY · client 800.<br>Data di sistem ini fiktif. Jangan memakai user/password kantor yang asli.</div></div></div>`;
}
function guiBodyH(){
  if(SIM.where==='logon') return logonH();
  if(SIM.where==='easy'){
    return `<div class="ea"><div class="ea-tree"><ul class="tree root"><li><button data-tree="f" aria-expanded="${!!SIM.tree.f}"><span style="width:9px;font-size:9px">${SIM.tree.f?'▼':'▶'}</span>${ICO.star}Favorites</button>${SIM.tree.f?`<ul class="tree">${FAVS.map(c=>`<li><button data-tcode="${c}">${ICO.tx}<span><code>${c}</code> – ${esc(KNOWN[c])}</span></button></li>`).join('')}</ul>`:''}</li>
      <li><button data-tree="0" aria-expanded="${!!SIM.tree[0]}"><span style="width:9px;font-size:9px">${SIM.tree[0]?'▼':'▶'}</span>${SIM.tree[0]?ICO.folderO:ICO.folder}SAP Menu</button>${SIM.tree[0]?treeH(TREE,'0'):''}</li></ul></div>
      <div class="ea-pic"><div class="jcw"><div class="jcw-w">JACIWEY</div><div class="jcw-s">SAP Training System · Client 800</div></div></div></div>`;
  }
  if(SIM.where==='other'){return `<div class="scr-note">Layar <b>${esc(SIM.other)} – ${esc(KNOWN[SIM.other]||'')}</b> terbuka.<br>${SIM.sc&&SIM.sc.gen?'Transaksi yang benar sudah terbuka. Isi layar transaksi ini dilatih di skenario lengkap (simulator role dan bab lain)':'Simulator tidak melatih isi layar ini'}${stepOf()&&stepOf().k==='nav'?'; fokus langkah ini adalah memilih dan membuka transaksi yang tepat':''}. Pakai command field: <code>/n</code> + T-code (jendela yang sama), <code>/o</code> + T-code (jendela baru), atau <code>/n</code> saja untuk kembali.</div>`;}
  const scr=scrOf(); return blocksOf(scr).map(blockH).join('');
}
function appBarH(){
  if(SIM.where==='logon') return `<div class="gw-app"><button class="abtn" data-k="newpw" title="New password">${ICO.newpw}<span>New password</span></button></div>`;
  if(SIM.where==='easy') return `<div class="gw-app"><button class="abtn" data-k="fav" title="Favorites">${ICO.star}<span>Favorites</span></button><button class="abtn" data-k="otherm" title="Other menu">${ICO.folder}<span>Other menu</span></button></div>`;
  const scr=scrOf(); if(!scr) return '<div class="gw-app"></div>';
  const b=[];
  if(scr.sel){b.push(`<button class="abtn" data-k="exec" title="Execute (F8)">${ICO.exec}<span>Execute</span></button>`);b.push(`<button class="abtn" data-k="save" title="Save as Variant (Ctrl+S)">${ICO.variant}<span>Save as Variant…</span></button>`);}
  else {
    (scr.tbx||[]).forEach(x=>b.push(`<button class="abtn" data-k="${x.k}" title="${esc(x.l)} (Shift+F5)">${ICO.otherdoc}<span>${esc(x.l)}</span></button>`));
    if(scr.go==='save'){b.push(`<button class="abtn" data-k="check" title="Check">${ICO.check}<span>Check</span></button>`);b.push(`<button class="abtn" data-k="save" title="${scr.saveLabel||'Save'} (Ctrl+S)">${ICO.post}<span>${scr.saveLabel||'Save'}</span></button>`);}
    if(scr.go==='exec')b.push(`<button class="abtn" data-k="exec" title="Execute (F8)">${ICO.exec}<span>Execute</span></button>`);
  }
  return `<div class="gw-app">${b.join('')}</div>`;
}
function screenTitle(){if(SIM.where==='logon')return 'SAP';if(SIM.where==='easy')return 'SAP Easy Access';if(SIM.where==='other')return KNOWN[SIM.other]||SIM.other;return txt(scrOf().title);}
const MENUOBJ={ME51N:'Purchase Requisition',ME52N:'Purchase Requisition',ME5A:'Program',ME21N:'Purchase Order',ME23N:'Purchase Order',ME2N:'Program',ME2M:'Program',MIGO:'Goods Receipt',ML81N:'Service Entry Sheet',MB51:'Program',MB52:'Program',MMBE:'Program',MM03:'Material',MI01:'Physical Inventory Document',MI04:'Physical Inventory Document',MI11:'Physical Inventory Document',MI20:'Program',CJI3:'Program',CJI5:'Program',KSB1:'Program',KOB1:'Program',AW01N:'Asset',AS03:'Asset',IW38:'Program'};
function menuBarH(){
  let items;
  if(SIM.where==='logon') items=['User','System','Help'];
  else if(SIM.where==='easy') items=['Menu','Edit','Favorites','Extras','System','Help'];
  else {const t=curTc();items=[MENUOBJ[t]||'Program','Edit','Goto','Extras','Environment','System','Help'];}
  const drop=SIM.menu==='System'?`<div class="mdrop" style="left:${SIM.where==='logon'?'86px':'auto'}">${SIM.where==='logon'?'<button disabled>Create Session</button><button disabled>Status...</button>':`<button data-mi="session">Create Session <small>/o</small></button><button data-mi="endses">End Session <small>/i</small></button><hr><button data-mi="status">Status...</button><hr><button data-mi="logoff">Log Off <small>/nend</small></button>`}</div>`
   :SIM.menu==='Help'?`<div class="mdrop"><button data-mi="apphelp">Application Help</button><button data-mi="apphelp">SAP Library</button><button data-mi="apphelp">Glossary</button></div>`:SIM.menu?`<div class="mdrop"><button disabled>${esc(SIM.menu)}: tidak dilatih di simulator</button></div>`:'';
  return `<div class="gw-menu"><span class="mi-ic">☰</span>${items.map(x=>`<button class="mi ${SIM.menu===x?'open':''}" data-menu="${x}"><u>${x[0]}</u>${x.slice(1)}</button>`).join('')}<span class="gw-win" aria-hidden="true"><span>▁</span><span>▢</span><span>✕</span></span>${drop}</div>`;
}
function toolbarH(){
  const lg=SIM.where==='logon';
  const I=(k,ic,t,dis)=>`<button class="ib" data-k="${k}" title="${t}" ${dis?'disabled':''}>${ic}</button>`;
  return `<div class="gw-tool">${I('enter',ICO.enter,'Enter')}<div class="cmdbox"><input id="cmd" aria-label="Command field" autocomplete="off" spellcheck="false" ${lg?'disabled':''}><span class="dd">▼</span></div><span style="color:#2c4561;font-size:12px;margin-right:4px">«</span>
   ${I('save',ICO.save,'Save (Ctrl+S)',lg)}<span class="tsep"></span>${I('back',ICO.back,'Back (F3)',lg)}${I('exit',ICO.exit,'Exit (Shift+F3)',lg)}${I('cancel',ICO.cancel,'Cancel (F12)',lg)}<span class="tsep"></span>
   ${I('print',ICO.print,'Print (Ctrl+P)',true)}${I('find',ICO.find,'Find (Ctrl+F)',true)}${I('findn',ICO.findn,'Find next',true)}<span class="tsep"></span>
   ${I('first',ICO.first,'First page',true)}${I('prev',ICO.prev,'Previous page',true)}${I('next',ICO.next,'Next page',true)}${I('last',ICO.last,'Last page',true)}<span class="tsep"></span>
   ${I('session',ICO.session,'Create New Session',lg)}${I('shortcut',ICO.shortcut,'Generate a Shortcut',true)}<span class="tsep"></span>${I('help',ICO.help,'Help (F1)')}${I('layout',ICO.layout,'Customize Local Layout (Alt+F12)')}</div>`;
}
function drawSim(){
  const a=document.activeElement; const focusId=a&&a.dataset?(a.dataset.f||(a.dataset.lv?'lv:'+a.dataset.lv:null)||a.id):null; const selPos=a&&(a.type==='text')?a.selectionStart:null;
  computeNext();
  const v=$('#view');
  v.innerHTML=`<div class="spread"><div><h1 style="font-size:28px">${esc(SIM.sc.title)}</h1><div class="meta">${SIM.free?'Simulator SAP GUI · Simulator bebas':SIM.sc.kind==='role'&&!SIM.sc.mod?'Simulator role · '+(ROLES.find(r=>r.id===SIM.sc.role)||{}).t:SIM.sc.kase?'Studi kasus + praktik SAP · '+MOD[SIM.sc.mod].code:'Simulator SAP GUI · '+MOD[SIM.sc.mod].code+(SIM.sc.bab!=null?' · Bab '+(SIM.sc.bab+1):'')}</div></div><a class="btn ghost sm" href="#${SIM.sc.back||(SIM.sc.kase?'studi-kasus':'simulator')}" id="simExit">← ${SIM.sc.back&&SIM.sc.back.startsWith('modul-')?'Kembali ke modul':SIM.sc.back==='jalur'?'Jalur saya':SIM.sc.kase?'Studi kasus':'Daftar skenario'}</a></div>
  <div class="sim-layout" style="margin-top:14px">
    <div class="coach" id="coach">${coachH()}</div>
    <div class="gui ${S.simMode==='guided'?'guided':''}" id="gui">
      ${menuBarH()}${toolbarH()}
      <div class="gw-title">${esc(screenTitle())}</div>
      ${appBarH()}
      <div class="gw-body" id="guiBody">${guiBodyH()}</div>
      <div class="gw-status" role="status"><div class="msg">${SIM.msg[1].trim()?`<span class="si">${ICO[SIM.msg[0]]}</span>`:''}<span>${esc(SIM.msg[1])}</span></div><span class="seg">PRD (${SIM.sessions}) 800 ▾</span><span class="seg">${SIM.where==='logon'?'':curTc()}</span><span class="seg">sapprd01</span><span class="seg">INS</span></div>
      ${modalH()}
    </div>
  </div>`;
  bindSim();
  refreshGuide();
  if(SIM.modal){const f=$('.dlg input');if(f)f.focus();}
  else if(focusId&&focusId.startsWith('lv:')&&$(`[data-lv="${focusId.slice(3)}"]`)){$(`[data-lv="${focusId.slice(3)}"]`).focus();}
  else if(focusId&&$(`[data-f="${focusId}"]`)){const el=$(`[data-f="${focusId}"]`);el.focus();if(selPos!=null&&el.setSelectionRange)try{el.setSelectionRange(selPos,selPos);}catch(e){}}
  else if(SIM.where==='logon'){const first=['user','pw'].find(k=>!SIM.lv[k])||'user';const el=$(`[data-lv="${first}"]`);el&&el.focus();}
  else if(SIM.where!=='tx'||SIM.txDone) $('#cmd').focus();
}
function bindSim(){
  $$('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;
    if(k==='newpw'){setMsg('I','Enter user and current password first, then choose New password',{t:'i',m:'Di skenario Login, SAP otomatis meminta password baru saat login pertama.'});return drawSim();}
    if(k==='fav'||k==='otherm'){setMsg('I','Function not available in the simulation');return drawSim();}
    if(k==='enter'&&document.activeElement&&document.activeElement.id==='cmd'&&$('#cmd').value){return runCmd($('#cmd').value);}
    if(k==='enter'&&$('#cmd')&&$('#cmd').value&&SIM.where!=='logon'){return runCmd($('#cmd').value);}
    act(k);});
  $$('[data-menu]').forEach(b=>b.onclick=e=>{e.stopPropagation();SIM.menu=SIM.menu===b.dataset.menu?null:b.dataset.menu;drawSim();});
  $$('[data-mi]').forEach(b=>b.onclick=()=>{const k=b.dataset.mi;SIM.menu=null;
    if(k==='session')return act('session');
    if(k==='endses'){if(SIM.sessions>1){SIM.sessions--;setMsg('I','Session closed');}else{SIM.modal={type:'confirm',title:'Log Off',text:'This is the last session. Unsaved data will be lost. Do you want to log off?'};}return drawSim();}
    if(k==='status'){openStatus();return drawSim();}
    if(k==='logoff'){SIM.modal={type:'confirm',title:'Log Off',text:'Unsaved data will be lost. Do you want to log off?'};return drawSim();}
    if(k==='apphelp'){setMsg('I','Application help is not available in the simulation');return drawSim();}});
  $('#gui').addEventListener('click',e=>{if(SIM.menu&&!e.target.closest('.gw-menu')){SIM.menu=null;drawSim();}},{once:true});
  $$('[data-lv]').forEach(el=>{el.oninput=()=>{SIM.lv[el.dataset.lv]=el.value;if(SIM.errId==='lv.'+el.dataset.lv){SIM.errId=null;el.classList.remove('err');}refreshGuide();};});
  $$('#gui [data-f]').forEach(el=>{
    const h=()=>{const id=el.dataset.f;const val=el.type==='checkbox'?el.checked:el.value;SIM.vals[id]=val;
      $$(`[data-f="${id}"]`).forEach(o=>{if(o!==el){if(o.type==='checkbox')o.checked=val;else o.value=val;}});
      const scr=scrOf();const D=scr&&defsOf(scr)[id];const f=D&&D.def;
      if(SIM.errId===id){SIM.errId=null;el.classList.remove('err');}
      if(f&&f.onChange)f.onChange(SIM.vals);
      if(f&&f.redraw&&(el.tagName==='SELECT'||el.type==='checkbox'))drawSim(); else refreshGuide();};
    el.addEventListener(el.tagName==='SELECT'||el.type==='checkbox'?'change':'input',h);
    if(el.type==='text'){const scr=scrOf();const D=scr&&defsOf(scr)[el.dataset.f];if(D&&D.def&&D.def.redraw)el.addEventListener('change',()=>drawSim());}
  });
  $$('[data-f4]').forEach(b=>b.onclick=()=>{const D=defsOf(scrOf()||{});const id=b.dataset.f4;SIM.modal={type:'f4',fid:id,k:b.dataset.k4,l:(D[id]&&D[id].l)||id,q:'',back:SIM.modal&&SIM.modal.type!=='f4'?SIM.modal:null};drawSim();});
  $$('[data-multi]').forEach(b=>b.onclick=()=>{const D=defsOf(scrOf());SIM.modal={type:'multi',fid:b.dataset.multi,l:D[b.dataset.multi].l};drawSim();});
  $$('[data-tab]').forEach(b=>b.onclick=()=>{SIM.tabs[b.dataset.tab]=+b.dataset.ti;checkGoal();drawSim();});
  $$('[data-alv]').forEach(b=>b.onclick=()=>{alvAct(b.dataset.alv,b.dataset.key);drawSim();});
  $$('[data-alvcol]').forEach(b=>{b.onclick=()=>{alvAct(null,b.dataset.key,b.dataset.alvcol);drawSim();};b.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();b.click();}};});
  $$('[data-tree]').forEach(b=>b.onclick=()=>{SIM.tree[b.dataset.tree]=!SIM.tree[b.dataset.tree];drawSim();});
  $$('[data-tcode]').forEach(b=>{b.ondblclick=()=>runCmd(b.dataset.tcode);b.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();runCmd(b.dataset.tcode);}};b.onclick=()=>{if(S.simMode==='guided'){runCmd(b.dataset.tcode);}else{setMsg('I',`${b.dataset.tcode} selected – double-click to start`);drawSim();}};});
  $$('[data-mode]').forEach(b=>b.onclick=()=>{S.simMode=b.dataset.mode;save();drawSim();});
  $$('[data-sbx]').forEach(b=>b.onclick=()=>sbxAction(b.dataset.sbx));
  $('#hintBtn')&&($('#hintBtn').onclick=()=>{if(!SIM.hintOn){SIM.hintOn=true;SIM.hints++;}drawSim();});
  $('#nextStep')&&($('#nextStep').onclick=nextStep);
  $('#simAgain')&&($('#simAgain').onclick=()=>startSim(SIM.sc.id));
  $('#simNextSc')&&($('#simNextSc').onclick=()=>{const i=SIMS.findIndex(s=>s.id===SIM.sc.id);startSim(SIMS[(i+1)%SIMS.length].id);});
  $('#simList')&&($('#simList').onclick=()=>{SIM=null;renderSimHome();});
  $('#simExit').onclick=e=>{e.preventDefault();const k=SIM.sc.kase;SIM=null;if(k){location.hash='studi-kasus';renderCaseHome();}else renderSimHome();};
  $('#copyCol')&&($('#copyCol').onclick=async()=>{const t=SIM.sc.attach.rows.join('\n');try{await navigator.clipboard.writeText(t);$('#copyCol').textContent='Tersalin ✓';}catch(e){$('#copyCol').textContent='Blok teks lalu Ctrl+C';}});
  $$('[data-qj]').forEach(b=>b.onclick=()=>{const st=stepOf();const j=+b.dataset.qj;if(SIM.qDone===st.a)return;SIM.qDone=j;if(j!==st.a)SIM.errors++;drawSim();});
  $$('[data-dlg]').forEach(b=>b.onclick=()=>{const k=b.dataset.dlg;
    if(k==='cancel'){closeModal();drawSim();return;}
    if(k==='clearm'){SIM.vals['_multi_edit']=[];drawSim();return;}
    if(k==='ok'){modalOk();if(SIM)drawSim();}});
  const q=$('#f4q'); if(q){q.oninput=()=>{SIM.modal.q=q.value.replace(/\*/g,'');const pos=q.selectionStart;drawSim();const n=$('#f4q');n.focus();n.setSelectionRange(pos,pos);};}
  $$('[data-pick]').forEach(r=>{const pick=()=>{const M=SIM.modal;SIM.vals[M.fid]=r.dataset.pick;SIM.modal=M.back||null;setMsg('I',`${r.dataset.pick||'(blank)'} selected`);if(SIM.errId===M.fid)SIM.errId=null;const D=defsOf(scrOf()||{})[M.fid];if(D&&D.def&&D.def.onChange)D.def.onChange(SIM.vals);drawSim();const el=$(`[data-f="${M.fid}"]`);if(el)el.focus();};r.onclick=pick;r.ondblclick=pick;r.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();pick();}};});
  $$('[data-mrow]').forEach(i=>i.oninput=()=>{SIM.vals['_multi_edit'][+i.dataset.mrow]=i.value;});
  const mp=$('#mpaste'); if(mp) mp.oninput=()=>{const L=mp.value.split(/[\r\n\t,;]+/).map(s=>s.trim()).filter(Boolean);if(!L.length)return;const cur=(SIM.vals['_multi_edit']||[]).filter(Boolean);SIM.vals['_multi_edit']=[...new Set([...cur,...L])];setMsg('S',`${L.length} entries uploaded from clipboard`);drawSim();};
}
function nextStep(){
  SIM.step++; SIM.navDone=false; SIM.qDone=null; SIM.hintOn=false; SIM.explain=null;
  if(SIM.step>=SIM.sc.steps.length){SIM.step=SIM.sc.steps.length-1;finishSim();return drawSim();}
  const st=stepOf();
  if(st.k==='tx'||st.k==='nav'){SIM.txDone=false; if(SIM.where!=='logon')setMsg('I',SIM.where==='easy'?'SAP Easy Access':'Ready',null);}
  drawSim();
}
function finishSim(){SIM.done=true;const stars=SIM.errors===0&&SIM.hints===0?3:SIM.errors<=3?2:1;const k=SIM.sc.id;const prev=typeof S.sims[k]==='number'?S.sims[k]:(S.sims[k]?1:0);S.sims[k]=Math.max(prev,stars);logAtt('sim:'+k,stars);save();renderNav('simulator');}
document.addEventListener('keydown',e=>{
  if(!SIM||!$('#gui')) return;
  const inDlg=e.target.closest&&e.target.closest('.dlg');
  if(SIM.modal){
    if(e.key==='Escape'||e.key==='F12'){e.preventDefault();closeModal();drawSim();}
    else if(e.key==='F8'||(e.key==='Enter'&&e.target.tagName!=='TEXTAREA'&&!(e.target.dataset&&e.target.dataset.pick!=null)&&e.target.tagName!=='BUTTON')){if(SIM.modal.type==='f4')return;e.preventDefault();modalOk();if(SIM)drawSim();}
    else if(e.key==='F4'&&inDlg&&e.target.dataset.f){const D=defsOf(scrOf()||{});const id=e.target.dataset.f;const def=D[id]&&D[id].def;if(def&&def.f4){e.preventDefault();SIM.modal={type:'f4',fid:id,k:def.f4,l:def.l,q:'',back:SIM.modal};drawSim();}}
    return;
  }
  const inGui=e.target.closest&&e.target.closest('#gui');
  if(e.key==='F8'){e.preventDefault();act('exec');}
  else if(e.key==='F3'&&e.shiftKey){e.preventDefault();act('exit');}
  else if(e.key==='F3'){e.preventDefault();act('back');}
  else if(e.key==='F12'){e.preventDefault();act('cancel');}
  else if(e.key==='F1'){e.preventDefault();act('help');}
  else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();act('save');}
  else if(e.key==='F5'&&e.shiftKey){const s=scrOf();if(s&&s.tbx){e.preventDefault();act(s.tbx[0].k);}}
  else if(e.key==='F4'&&inGui){const id=e.target.dataset&&e.target.dataset.f;const D=defsOf(scrOf()||{});const def=id&&D[id]&&D[id].def;e.preventDefault();if(def&&def.f4){SIM.modal={type:'f4',fid:id,k:def.f4,l:D[id].l,q:''};drawSim();}else{setMsg('I','No input help is available');drawSim();}}
  else if(e.key==='Enter'&&inGui){if(e.target.id==='cmd'){e.preventDefault();runCmd(e.target.value);}else if(e.target.dataset&&(e.target.dataset.f!=null||e.target.dataset.lv!=null)){e.preventDefault();act('enter');}}
});
function renderSimHome(){
  SIM=null;
  const r=roleOf();const bab=SIMS.filter(s=>s.kind==='bab');const done=SIMS.filter(s=>simStars(s.id)>0).length;
  const mods=MODULES.filter(m=>BAB[m.id].some(b=>b.sims.length||b.app));
  const mine=r?mods.filter(m=>relOf(m.id,r)||S.addons.includes(m.id)):[];const other=mods.filter(m=>!mine.includes(m));
  const modBlock=m=>{const items=BAB[m.id].map((b,i)=>[...b.sims.map(id=>simCard(SIMS.find(x=>x.id===id))),b.app?appCard(b.app):''].join('')).join('');
    const n=BAB[m.id].filter(b=>b.sims.some(id=>simStars(id)>0)||(b.app&&simStars(b.app)>0)).length;
    return `<details class="simgrp"><summary><b>${esc(m.code)}</b> ${esc(shortT(m))} ${relPill(relOf(m.id))}<span class="muted" style="margin-left:auto;font-size:13px">${n}/${m.lessons.length} bab dipraktikkan</span></summary><div class="scen-list" style="margin:10px 0 4px">${items}</div></details>`;};
  $('#view').innerHTML=`<h1>Simulator SAP GUI</h1>
  <p class="lead">Ada tiga jenis latihan: <b>simulator role</b> (satu hari kerja lintas modul sesuai role), <b>simulator per bab</b> (sesuai isi setiap bab di modul), dan <b>Simulator bebas</b>. ${done} latihan sudah kamu selesaikan.</p>
  <div class="card" style="margin-top:14px;border:2px solid var(--accent)"><div class="spread"><div><b style="font-family:var(--font-d);font-size:20px">Latihan SAP sesukamu, tanpa skenario</b><p style="margin:4px 0 0;max-width:70ch">Sistem latihan dengan data yang saling terhubung dan tersimpan di akunmu: buat PR (ME51N) dan dapat nomornya, release sebagai approver (ME54N/ME55), buat PO dari PR yang sudah full release (ME21N), terima barang, buat reservasi, keluarkan barang, tahan barang rusak, scrap, lalu lihat dampaknya di stok dan biaya. SAP menolak isian yang salah seperti aslinya.</p></div><button class="btn" id="freeBtn">Buka Simulator bebas</button></div></div>
  <div class="grid g2" style="margin-top:12px">
   <div class="callout" style="margin:0"><b>Cara main</b>Login sekali per sesi browser (client 800). Ketik T-code di command field (contoh <code>ME51N</code>, dari dalam transaksi <code>/nMIGO</code>) atau double-click di Favorites/SAP Menu. Shortcut: <code>Enter</code>, <code>F8</code>, <code>Ctrl+S</code>, <code>F3</code>, <code>F4</code>, <code>F12</code>, <code>Shift+F5</code>. Menu <b>System → Status</b> juga berfungsi.</div>
   <div class="callout warn" style="margin:0"><b>Dua mode</b>Panduan: checklist field, sorotan field berikutnya, label di toolbar ALV, penjelasan pesan. Ujian: tanpa bantuan dan ikon saja, seperti di SAP asli.</div>
  </div>
  
  
  ${r?`<h2>Simulator role: ${esc(r.t)}</h2><div class="scen-list">${roleSims(r).map(id=>simCard(SIMS.find(x=>x.id===id))).join('')}</div>`:`<div class="outpath" style="margin-top:18px">Pilih role untuk membuka simulator role (satu hari kerja). <a href="#role">Pilih role</a></div>`}
  <h2>Simulator per bab</h2><p class="muted" style="max-width:72ch">Setiap bab di setiap modul punya latihannya sendiri. Bab yang memakai SAP GUI berisi transaksi lengkap atau latihan memilih transaksi; bab aplikasi cloud berisi latihan alur dan aplikasi.</p>
  ${mine.length?`<h3 style="margin:16px 0 8px;font-size:17px;font-weight:500">Modul jalurmu</h3>${mine.map(modBlock).join('')}<h3 style="margin:22px 0 8px;font-size:17px;font-weight:500">Modul lain</h3>`:''}
  ${other.map(modBlock).join('')}
  <p class="muted" style="font-size:13px;margin-top:22px">Simulator meniru alur dan susunan layar SAP GUI dengan ikon buatan sendiri. Detail tampilan bisa berbeda di sistem perusahaanmu.</p>`;
  bindSimCards();
  $('#freeBtn').onclick=()=>startFree();
}
function simCard(s){const stars=simStars(s.id);return `<button class="scen" data-sim="${s.id}"><span class="row"><span class="pill">${s.lvl}</span>${stars?`<span class="pill ok">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</span>`:''}</span><b>${esc(s.title)}</b><small>${[...new Set(s.steps.filter(x=>!['q','act'].includes(x.k)).map(x=>x.k==='logon'?'Logon':(x.tc||'/n')))].join(' → ')} · ${s.steps.length} langkah</small></button>`;}
function bindSimCards(){$$('[data-sim]').forEach(b=>b.onclick=()=>startSim(b.dataset.sim));$$('[data-app]').forEach(b=>b.onclick=()=>playApp(b.dataset.app));}

/* ===================== MASKOT CICUUU & AWEYY ===================== */
const MASC_B64={"cic":{"normal":"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","senang":"UklGRtpgAABXRUJQVlA4WAoAAAAQAAAAoAEABwIAQUxQSCMlAAAB/yckSPD/eGtEpO4jENs2kiTZZd/TuMo/4a52N/YSiOj/BABAOxYRJ3+WqpKqOtWL+jb3vurahzGqj6pAd7+nta7odegHvzXVMeI/k17Ym7pfcCD1wOxBpG9EYiBpR9LGA82wh2ofYsx2TZJO9lSTItobDitj1n3BSmr/pPWqAWlh4++FAEma7Mhkd0A7kIqMSoGruzEOMEkN2jOQBEASKUVB20ZOwh/2zR8AImICVDnqnjQdoRrMe/913Fr0xOue5HYL91GmComAU5Cm1EEFi6ZSLnQLB8ZqKvEIxlGZOFI9IunsoAJ2PNgClbagAso4EKXrjbZtVW6zbRtznQJRSbLAYsm2ZCbJlh0zhpOLcocZb77gZmZm/gUPMzMzM13MECYHTFHs2uuHqap0zt7n4YiYAG/Yti12mv/fcV1T9z4fd3d3d3d3d3d3d3evPi70UzdK0QSIlVA07gkQIbpk5j5fZEEH5p5Zw/a8iYgJ4J2KJRE8VSS5e+wpuAOyBJECV5VHncLMqbFz//E/4Sg1siaMHJ95+Z+/goV4k5oP3xvoG698xyRBSgk5tZse2Lera+VT//pXn5dHG+Gj28GZXbzr6XumCCnhOvTMB0bABf/8Wz5vsWbhuXmCCXds8SP3r08H1x13fGSKgEHA/s3H/5PizC4fvINQASQFdPhoBSWBLJv84fUEjKsG+4ePoxhTs/GdhApXlwXqehNPANflMwNDQeKazvsPkkWZP3rZjeuV84WzpABffY1mxvW6/kgdRRjsIFwf8P57jkWeRPMCMq476PlNZBHm6uWGJXMnxF0Tc27Yde5IjClsGEA3ghP6Zoh50T1m6MbwH0HxZWEbra0ePwSKNkY+PIdz48H+bgVFF/S1yDW7gkXbuwNDiJb8q64Ik9dahMhS3OPMLhGc1lYzoluXtBO3lhi7FWFOADNaKia3xBeM7MLVkiu6YssQOC0W00dRbMn7uminjKDIumrLCEwQ4UZ7ta6fmFagJhBttBjL2sTI8YmYgl3T4LSzGmO7LqJ2iGx8AlckOZt3gmij2DIYFFmBWwhZOyAwNUUUGKF93d3dOG3evxWLLJig3YIsgBeeAubeFjGwsYZod2OY+La2gfP+N0BF56PNM1hbeO29Kk7bJRRdHSlevUwoNvnyz/JH/t67qA29r644SVq3TgDGDlcLTT7yi6f5E//ol3G1SCws12SdYA08ruRLF1FHML2hjhUY/fPerN/1pybkbi2Q079NOB0YdKzSVFRZWMKtI0RmwgsLzq7I3GcGDy3hfmOBrEIQHSg4MEhcQYOOddZMUNgODjKn8cFHNiLdSG0mo3N7a8S2OgdnrhepmK4tAusODRJk1yExMUoHyyPLaXQQYBVCsYEU6N0zTLgOb2Z0dL0vriwMHcA7R6D+zAtKWScQbH30w2MEXeGMddHJxujhuHLmFuloMX/bICqkzckrgagceOIkCGDniW7UQYT6ITymoKeOOgln+P03KWB54zmZrgCBytKmHsioTBqd3iCyqxmd7uff7CkgnNHUuEopUN+ylXAOmh1Xw2MqsNjVcab6TesKSEhcvUR136nH3gJ1mJifQ/Fkqt6qoA7DqWzpQ0WTb2DhpzA6XWzbh8UT9E2xChWoCo8AiVXp1WmiesMQ6ryrVnEVHshXAyxYUDTZrtUpGpsqMbA6nfl+jyeY73GtCgL9Fy6HOIP5AWJ6HGfVnq1XpSLJFI81/SiiqqxeMTDQdC8MsbAUj6xCIjvNDFQYNnoYxSKytZowrNFLYXhzGouGR5Ssb1UB/RvrRQEEIimqjXiSb/hErFjQJVQU0ZT3niDEkrHlIym6A3hc4TqYuSJJ9N5UOAl3kGIK+qrEs6xwuKMegseVQjQFGkRQYuTpj461S9dQq3QFlUV3bywp1I4TrHBXnvjRHefkrZEEBL9G+91AUj6maBjz+1EkMbKfSAZe/L3zuiFJEJwrrSKQDxze1a0WhIVDZ8Ou0KZjAgS9Jlk08MFlornWHQvkf/7T8mtJODhXTg5nVJduWWuAejf20trp+XRXY/iFC2h7bovdhoHUydv+fhGhEVGVaKD33w4OQlLTuXLNvrmqzZ2aqWB9Gdd0b4kZV9xuip3jvVtcPnFK7E4ggLdv+rmVeEA9nhYHsWggF9fs6+s9fHhwfLGfa4drSLRW6mTGlUdOb46/ONZaa7I73PZrtyGPhdi2JiiKAqe7QzRwvDacNTS6rmfLbVPdY3UABweErtF+aZeBAVy6vDVyaO3SeDv5wB/YQk48923BogjGiGv1xK/+Dc1tqGYAASFWs4QZfNoX3n3TdkoCGBFtrCGWLWewE48DuINEHkqQJPd97O2AjKgKxZFV88aDX4HIU9HRjKhaDY8hsWk9FhfJrpKv1imybnsVYsjYv9EjE81yTvW7IghGcVJ9uIs4MtJdIo5rCVepxpAu92zEE02MLMaQhXWTpLpC4yQeP9APSjRgjCgWKW9x9D9B+1dSrrfi0aPLOoFbqoldO7HYgfoSrnSb24Hip1Ij4Z1eIriqlIN6DO08g1JuqdZU5MiP4ZZuztEpLHJgFle6iZG1RK7C4CxJ771HCJHD2lmUcPLsmLkiZ3yGxB+oELdiuCf1RPRWlHr/S6hSTx45zgCp39OIGzXrJwlKOWN+P4oahvaS+D64l8itdaUe9KLIqaae04XHzZ41KO1g51BQxAROdYfEE8ubsIiBtaR/7yBxqxIAoZixWgmQ1fF4EZvnUeq57VOIF2PfQvLJOdlwRQuMmJP+Q93EjCgDRdTWS4FKNV7U7FkqAcToXjxWjLmDePqFxnEittGPkg8YjRlRDipmysKoGayVA42KR4qanK670k/s3oXFCdT345QBs1tRrFS6KQl7iVZXOeAoUmTb33DKQx0Ag8ijxBf+ZMepA52b+11RYk8/j2oBceiWFXl8yDYf2rGaIPQ89Q2i5MW9iHrQOHX+fYsO2fb/bVhdgHePveoRsu+AURvKN0yumCLDNg5m1IjOFg/E5saWqUYw+pZAMWHMZNSLYuawm8WDGDiD6gXw+b733GNBqvZg1IyissuxWDBOLBPqBsTg/DseC6r/CaOW3NTftDgwTp1x1RDybPrzHgWi9y85NWXf6ysxIDU3b6aklM2eqQQ+tM9QOQFMTVrpub64UnNRUgZb/9M1U8lZ84vDosx84IiFkuP1ngFKTPnMm7GS88YOucoL4NUxU5lJb83XXJSYIjxzyVRinH1vgpJTNvAOSsz0/Ji5yg0sff2iqaiccytrKT2DDb2D0hbfGM1cZQcWHpozFZSdf3ccUXoG630TVkzOp85kTgnia7++qmLKwpeHRSmqB3soZOe1MEgpKp94CCsi8dKUXGUI8FahAoJ78YxS1Blb74XUs4irHMEGlyhga+4zRDkqtw9lQYUD+yhNcC2PUbh2efAAwcoSsf5WVDTyiVFKVK8fEYWruQuoPIFDm4IKpsmdhKxM2bwNKxb5wGbKVZvDi+bkOaxEUeB0b7BCgYO4ShRgeZZCVXNqI+WqMXJbsWRhoatkIVQOE4rEmPWyBSb6KVBRPUHIyhVj+0GsSBoLlK4+uAMVycxwCcP6LBSHc8uYW9kCx2fcCgO2m1O2inWTqDCcPsrYag+FKeYWUAlT30soCmPvjhJGgZu7XQUBIxWnjB2tUZTOKOVs71BRWBg8iZcwxuxxVAwwsZ1SNtQWKUhRrZYz0FMU/1NUVtZYUTjzPaiMEdONoEIIur0eShnYt5tCENkGytqh6WIAq5Q2ZEXx//3//6Ua2vVNispApOdrm4tT5YDzXMNVzxw/WRLG1Da1jFjY8nIARE0rSlJkoa5plQVcnKxnPJwvC9mFvVgNI2b3oZJwpqljxdos5ZlhNQwElYa40EJ1zGKjRPqHqV/leqFpKo25cVS7QHMYpyz1wB+xULq4zp76x1mzIFzPfMK9dAn6r9v/rRWG/dbiy4Syxe23l18gFESwT+35opUv+rGPyymM145/qYz5iZ/NmsXx8recMS9f/twvKhSF88l/j1O+nP+771OMcgYvIMpXcbFSdRWBa/88ZW3j0DT5L2xqAS9pAvXtfbhyTTDYqFHeKlAbxZVnztYDNVTeIJg63kd+m2tigfJ3bP0Irnxyxo8ME1T2yNmyjCuHLDC0tUFJvGm2mzzODswQVArJ6VmcB+WKaPb/aB+hQkksqy6NE/JEzqFvc0KF0ljO8J5BLD/gsbtwzyiRBRP7BgjKi8ktDYKJctmdye24ckBi7PAgnlE6y9m2t04ONqkP4BgltJzG7CxodRk9ewZBlNTy7MBmXKtITt/yLE55LWe0F/dVo8C2GaPcFlQ2jaFV4tiuXbjKLRDDR0bR6mBkdoAgym9ndCaTVsOFkbqLUtyZuhvrOLdzf+2CU5Ir8Lf7UKeF7K/9oBnu7iEEVznlHkJwdw+VT41indbU7yz+qZckycyE+xVSaRSuimRmki7954/VUac5/+OxmYPPffwT3/0b//3MO+/16ArcAV1FJYx2aZdjV/rZt1/66z/8iU989L71rO7p0Wzo9HK3qExOck0jBNUrAbNdHZtj65At7B0P3EVHK4oJCA5Qy6Cy9dhYRt/ebVUFd0O1CiARVnonAzuvHsxQkrA7ASQKLQmaXO/cxl59888+MbJBfSqypcX9fQ3SpVPbXKUbhJRY6ioC3IF/+4ZP/KgfmUV1Cfa2v5xaEbt9lzpkItImcVNj/oEPetpCTSLa37kHEkME7SrDgIcf6nHVJRZ+9j9uTkW5iotPBKM+feXbR6xkBGtbqEax/T84ZSoVmGlTqwZ/+49sEkrEGDqDahWp/cv/7lJpWNg6h1GvyhZ+7GkPZSHvzahfZTM/8WySlYOFxq+BaheCz/z4cx7KQN73a99MLRt85sef8xA/WfUXPuFWy5AlU99zxEP0suZDf6Tu1LTB937HiilygTNjRn3r/PyPO55nZv7+UO+s/NQvO55fIjTfBVHnulZ+4peQRwtmFhHX0gGlniRdC1zv/eSvOLE2wg5G/u4YECzxzAxlklqFa+UnftkjFRD5uyMBl6ngKN0EpKkSh4BQS3Ct/MQvm0WJNBcJw7jyzde/+Pe/7uuf3EuwVDM48Uvf+PXf9vf9oxM1AMeRbgTXez9uHiGzlWVec8CMjl/+1Nmv/4PPnb0IzH7vkw1PNbg88PTTb/+VT/vEoeM3DUwuNbgygHRduM5/B0l0gq3ub6MrCJAZsNFcOTjc3PzkpxzAjBB0769PJ9v0HH7TTcnaOMDw3tnKyMlt/T2Au67QVQg29MF4bMTEmgMohCBjd+P8wsCLyxuzKYAQ7oC5P/dbIdE+uI2laYaZHBxgaGz97Vt7Zqe50h0kIOht74rFxVhvAwpyd0dpWDo8evrQhRQgAQ9cp9Tz+90ovcRHfyodpQAgCQ9Apbb98Oy+3XWrALgLMj1wJ1EVR06QytzZnjh34tEfXk4Xz6QAbpJ4rRamRkhw3fcZhA5XL/PAlWMb+6o7bxnL+scBsrT17XhUmt/wvzcbTPz/A7/x5V/+y29+FiCREPnKK+llFt79XbEcrhSIANDXbdM3b51f7JMufFFcyH7sA/7vid/6vT/8+bdNX1hOSUySuIYZBnhSsTOyI66pCYJz5fDyun954fuJ7fSPfvu/v+GEMHO3kHLNAwFQOgW0s8X1KIHjYPcT39Y6nrgUgsT1KCTwVJKZuJ4lgcUH4XS46JqFwDoJkIhCE94dYYYT4wYrbdT1yFjeJtIILB9cots1GDwBIto3xkKXI1gdx0S8O12OQAGjysswgboWg0Cg4ovWJVxdiWBzzTG6wLGD63SlztkjW3SJ0z1nMXUfW71DqSk6uooXDvRNYuoqJLb7pjEia/JwFWWZiiUkbG4HukpnazszKTIWQF2Cy+8DmYoExM7AFB66BIm0fwYjshYYm9p453wFP/dvT27rBRUKYvvIYEZ3KGem5zRSZCx0PfnE5t4aVz3/4l/6tmkyFQk45/fNYOoCyIYObmJE1sLALz+TQbiK3N3/+R5QoQi2jvXLgqpdgPkDY7iIrHz25x4lIF3FQ7MZ/PNP17EiARnnJpsk1c5ZPbUGIq5S+PDDOBnXlJm7+KBPvQ2VCnIaQ8faSIo0GQv753ERW+nh07jRwpvvoHQD6XNvv4AHizHJOP6GcyBiK+99jmaFFprIMisZ5KyMLKUVXLElnObcaDBi7Le86xkt1timqVwA49zffMsJAhZTktE4eHAbV4Tk058gWItki33IyiYYk8MffWIdrngKTuvAI882CCLCxqGjbrTauLRkpoIBkiaLDz0wR5BiSJg3Dj789DpOnJ31oJZJPDVMKJ4gnN3ffX8XweJHZq0DDz67iktxsjBwCm8d+PF/ppwtULvn1m/qdxQ5IeHI/22s4RLRXrudtlr20KIXElLA7vzhgwSkWJFwX33wGJhEtEWl2h5xfI9ZIQEWmPqO50bAUZSExODwfzsuUeKy7OElFRVS4NixuzYN4S7FhZB7Onf4uRQ8pdxF/2OoqEA4I5vu++AGCFJEBDdrHXzH2VvByCj99EVR5EaAxYfumasSpDgQJGwcees6kIRA7B33dsm378UKDAx3Ni3ed2oId6zoJBxO7um5H8yUUoZn32gX4s91oSIDhFM7+fjtQ+CoyCQHvfLWU4AriDJ0XvmnqE3BPzeDFRwYgfr+fXdvX4vjQgUkGUZj5uW9/RMoE4WZ8Yy72iNffwdeeCAc1qy750M7AYJUMAEH1ve95chCiokiNW5+h3ardqdiADACLJyY279/kAJuTe0feXX/DiRBFKpY848bQW1iaTeKApDcYc3Gk3fuGnQVh0yjvY+fHBU4EmUrfvyUtwmfvUfEo4wm9D/1UwOuAtn3qydTSBQoY2n8IKhN3LfOLRpAphCO/IWJQnnwh7mJEChp0VVpl1hYJCLNndqxj90lUSBL//CWSUiCyglDDdrklXsrrigQcmf+vuPLIxTt8MA79m/hSGWE2Lvb2wLceosTgxaA7R9+ZCu4ikUG6/seOLwKLpVQFsZ/tCuoHfKRZxuuwpNCdvL0zP6NECSKVnK2e8+ffnwGD8VD0KEZrB3ge+YpOnNn7gfuHwZ3iSKWHBj8qz0pUuHgoZs2a3K64KTAxB3ftkxAorCFnO2H39gLVjgYXV3eDlEbo8ilwPxHj+7OHFH0wVkaeLSGqWjk1QM9qHU4N1WaKiwL1B783p0QjAgUxvk/2A6mYkG+527a6Zwcp6iE17Z/5yP1gBGJkvunH6uDFQuuj4y7WiemDopClgI3fe+BaYIRkaHp5//K3b1ghWI+chBvQ+i+y0MRKTB48tA0QcSlRM8tT56ugwoEOLYPtQyxNIMKR4Fsx5FJmhLxGei77cGNBBWIfPjjXa42bDlePAb7H14GEzEqBfqWj03gKgzwXz4aWofX1heOM/XgPWMEEauSs/DwMVyFIb/tFNYGdvU0VSQWGN4xRiBq5WjnbA/FAZPj3jo4PI8Vh0TlpmmCLG7AAt2LGyErBkTvPV2oVWJ4nAJt0r9jHYgIFtWlCUIoBvDbT9J6rx0kFIUx+8GtVaLZGT55s1zFEHqe7A3KSc7JHldB0Hj2FqFoEqz91ptkxWDcdpJWAUNVClHOq+/igZj2QOXF4CoEb3xrb8ivsbYYAqPnmi5FFQZnapkXAfiTt5K3MXMK5Z+oL23OTES3GNm3AMo/C/t+EOVEqOwg/0X/0QUCcd51aCvuuYdXnp3MDfrwvHN8TQ/RHhito/yTH7/PlZPYOObKN4FwRZsAgfLOvP8XyAuWdpNzCJyYF3I873D7Pkx59YxiOaZATUhRh+NVed5lnNoxch8m5Jc7i5O4E/mivnMKi5sYH1BOCpzsCZZbZuu2I5GA/fvrRN44aDkBu9eS2wqfaRJIQXdemLPYHV6z3OrV3Ap87n8g0lCsHG4oxEwcPEXIS+S1GF9BJKM27roLixja6pXlprwiTOKk5L3v0oxaxvM7plxE71xevfQiTkqK9rm2K2azl8nJG7fhOST8LCItja0dQryM+SFydjblkrUvIxK0iUULXz+E5QNVkbuy9XO4p4dYHSHexrRyy2PXY5PmJOnRcRSrwCsjqCwylnoQSWphPiXW4syZ8uBd3y3gaSILa8EVJ0w7lKTZsjtGooqLLwei3czP8yX40t+2EAn7xKCFWA2mllN/f76gr1yquNJFvvRIanEy9l20kIexZT+WK+HtCZG2z/WbogTL2+TrQztRjgj2NFDKiOYrLVOclOUE3eSo5AdnEWlrjUmiLDYmclOesOLzJK8YPGQxwrdewJRPnkovDFddyWPpQ8uWQ3LGghG9ixemEckr63nSlD9AELGXvzVbIYmbj68S68vTKIXkm2NSjGllZLuTxmJuiizC+FTTUCJZ6yNYfNn7L4yLVJb9uQqKLfmLXV0omfzMLVhkucIb0yKh/U90SYURcoKv0YPSSeH1ZbLCeDsfpP+ESGgF/ximQnA9/x8IuRBuv4QSCufewUAxMHoSRcAuD36QYCklX/4QRdlsE8c7VxBp1f34MCqGOKrZ/02ELKmQH7nTiSi/4yIitWqPDrpFE+wnZIkFLE2iaPKuMRepLfrW4/lSUYukCGSXFxukt0L3hxVyRE22m7dmhwiGyr24kgtxx36UH3j/zbhaYKEfK5w1R/fglmA+dSJPRO8krZRtHI0AdFdIcmcNuSprCdz6XkRQE++kmZiseZ44rdVtH44K59zunqUYHJl3y5Huamtsow8rXtciQWk2t5s8vWkUtUCc7aXwFg69h0hxBbu7FpQXrmPdoRUw2UBFk2/DLcmA3f3kpw/R4lZGBLtJ91oF5YU3RlErjMU2Kl7Ki9w09i3SShlDIaHoQWsTrndtboj5NagFMDGMima+5cN4opmPPUzICejDaaHoO2OhYAr28QW3RIPsqaNYLqhZX6LFM6lR+O5Fd1JdvnYLyoWMqeN4K3zrKCqeMpHwXiEfjUPjqAWB2SPUvSI3766FVsDiWu2Tl2LDIuLGZbzcMN0QMG5eaAnW6pETQZVAqh7InBaK5UVi2FVLu+5cMLadoMU944QI7J5EKbe3q6nVl+n2mdYYw1uJCicmGyS8M9nD6pP4wcxb0x5HFN7576+knPhvb8tXH1s/L1cLxPkjMYCvvomnG3wpWB78hrvRkunJOCijqw8UX3zSREuNMzJuBGZnvzLSGtnlJ7kxwBdeqaCWMH+WG4LiyyNyWnt2A90AcM5oDWqFnL3bfiNAvDdrtLjvcYn6X7w9MYRaIg7M+Y2A7NIXxmitfO0lE/W/88o7jVYx2iNuAIoXJuRqhYx9m6ZYqLtT0d7SCKKl1nguOJFsrXRzlq0Uy3hnnWit6D+F4iBr7ZMp1cSZQUKR9N7mNa7WePbGCxbigHO8YaTb+VFUIL3XO++0NtC3h4g2M7r4FkZx5QPLFaklrtYjS6Z4iG4+UGBRPdZAtOjkHox4bqyjdLtYoGDnn0EiVzH5Iyg/ApNH6daVbPZjKop486SR+/JJMnJTydYQlmp2aZri2shxU07yrpE+lB9Ag+69RXFt61Bq5D79LiJXt7q4RoKKITg4bSEnUedryhVxcsk81fpvpqCy0SGM3Hs+fdnI00D/KdJMifaRpMXw7YNNkbMYqb9p5GxjjlTfXqGgGQubnhtafyEoZ5yDTfM0O3EHoRj3+GVE7t2vPo/nDOxdJMlkA3hWALN7v/5dMXKWZ4NflJGzYqGXJLcwQREDM2fuIX+x9vw5cldJ8xnM0yskvdOoAEbfKMrPs4ufU/4g+r9Eeitp/g+eFYALwriGfZ+5RA4HO/dXUsxmpg0V4PwQIn9fw6vKIwh/6WV5ahkv3myB6789j5G7pIFvyPKJ//4ZkoushyS7zkzc7QFdA7o+/6Y8nzx0z5HW3vT/MI3ocGfnJtFOH/hQxclp9xfGzZVSIVz6LkSnNzbvEmqD/I7DbnkF5y5NKKXU9P862WFyFm8bxGnr8M1VlFvitTl5SgX/UdRhGtzag2ij4NhQIM/f3rTWlUzC3z1KRgeb++QQgfaG/beiPDOxQDrL/a8PoM6R0xipgtoiuu7t91yTPz9UR8nExUcwOlaBrcsDtFtMTbnIc9eld2ZI5lD/L8OoUwz6D+01V5uc7jr5/2J/FaWRfOln6VQR2HpiGhftlc9tRLmnlbPTpLHg+BjWEVJg8uCiaL/3Huvy/IOvVWoojXbsQ3SgLDD2oftnCNYuOVNdgQLUpf9REwms0DiCaL9okt30yAGjA8XcOCoC1+tvrkHpQ3b7tHeAnPEP3rFdBHUAXSMUpT8/ap488t330HaZk5347mcGCSbaLqbHKUydvTzmShzBqRHUFhnA1kO7q7joyMokqDD0tb7MEwcmGk47LQPmnvyODzYIiI5UJqdAfWYCJY3Y/O6nPOQkwIP3H31gqAlORmeauRcKrFvrSRP8rd/fQrmYLgO2vHQcwDE6s1nfkWEUqVS9d9CVLrKF7zhk4rUK5E2vNqZu3V8FgiQ6U+KR04hiVTh6Cwkbst/5GxNXaaDggLN5++3zKwBBGR1rXHpo2IsGsj0NLFVkz3/3Kp1M4IErK5o+dtP0ZYAgGZ3r4W//g8uBwlVQQ8HTRDb6/b1JYLdz5dD+5pnFm0cro00ggBkd7G6Nf/wORSyyhQpKlDf9zgSdtX1HnzXu2KfLjQqAQ0aHG7OzWCEBW/cnCiyeWA4d1LNzgWsGkETnNz/VBC8qZgdJYseFS6zG4OGTX6TQtw2FNBG6khCr2FSdXkEFJkaPGUqRWMp47cJanCJXGGiQlpJZPAz6//IrOEWfKS2iKlg916T4haeEaM+8922xkJEFsgjAUVL8ywu//dmyGAjWZpsEjwFEMiqw97svveG7g8fA8UtbGJHooCQweP8Pu2TrRFCBy4/P3mZUR1EdTIOplEQzEVBC++U9DYUKAWwcjj6JnUUUGN9xFUvG+shKhhlVUm799diDWx0TjK5ScKPvzw5giIrpTGQo5px77wEE0+uoQILlQ/1rmKig+uyX8GgTjf511CFNKW4wY3NgCRdV1Gl+6SKoomHzM+wWRRYJtFq4RDWVuHwZl6pXMNoZVjgpYeTxpWUkKqvDxc8u45XLjDOLQkWTW+tte6jAL7z5paxyMf2m/eKKAoXrT6AkPfcvKYZVHSf0jwRUoSQuH5/BdDU7s9dbIAFr/N9e8CAqrzs7qYEqk6EmibiyZI0X5LqORALLw5dPZ7gyqrHZ2jxelUxzTSSu2jnd5nqVcGPu9JOjd98KnlKVpfTA4ytVafHlaXLMwvUSHHj1saO3ABgZFdoYGr4Zq0IXhy9TUAFGe37/vg3ALRCo1LqZj/i1u1V5TB//NSRWBAkH0r1vPjLdwkyZqNopY28MRvV1ffpP0FSnSeaGdi6eeXwZSEScf+C7N1AFQvimiqtDpF1mZixePPXCEveBo5Q4f+/PvAOjEgcWfrHXb0z2miRIbBdc7D02vHkLgCujqm/eSRAV2fmen6yZbmTD71QHYR3coL2RaXNibHg+AXCTMiq6WJqiSovveDyg6wpMr3+M2S6j88a59aX9owG/7ybAgExUdllzGbMKRej+qfudG7y8/v6hDaSzhxcE2plckdE5URAV/9KgEFXawuSPbnC7HlnrxXNDq0BwrtYcJFKqvvztJ01Ua/Od98t1HUhv7eeKSQdJKNAdGv8ejKrt3DfkXL+UdJDSDt2kQv0NpsolFhbR9WFph25UvnG6inn/XfgNiO6F8WYFw5m/oa42a1UxqJDSFS2tm9XMU+r8RjV7N53E+F/eLataxr3fjqUSxs98TvUK1R/eGFLqq3+uclmY/MXuoGQSd/3OvapY8nseQqSz+PHPwmIi5STlh+CjG92S6vYPRDFx8nblBgxMuZPSEmYWDTFyvJmHJk7WXbnhhkhrwxGKQjBO/dVJcu27/+fHgpQDMiRSPLRTomjsLGG5KHDvr84RbPUZDUcpRvvsBKhgMuaHd/AsF6Rw+PvvtmCrTLSHlklzIz06hysUSDKdPLCByN3C4Dd/dNpdWjUKzs6JETzNCM7yq0s4KojkLO47g4traIGDP/QBcK0SOXp1apsu3ph7055FHJc6TAo4q/t710BcUykMPf7kLjkudZiCnPTYIwcxdXEEOP7I43NAwDpIwo3lZx/sw8Q1t8D0gw/uBQLWOQrBjPTYI48tYKKrl5MdfeifTx/pgYBQ27TLYPPQPz/wcgMT16FwZm85dGq6AkGg9gl5Ykz+93/uuYCLrl8OR9ccf2RpgwB3QGqVhO+6NPIPv/WfL6W4uE7NnWzT4ocWFzLAHaTWSLvMoDnS8/C/v34JQ9SCnjSpzt62fX7fEFcNV0jXcMdAmAFs9B17sQ8wo5OlANWJ2w4dnjeuDAgH6RoSYLaL7EzP47O9IBPloRSAxuLs7tNrzQa6r8CvJq69sjZwYHVpcBWUGZ0uEYDtm3s33zJZHzau7lczOq401Rx+aebUCCAT5aIQAVjbUGX7rZMZXRunr+affz57/3ebnd848cL8pW3AxSoVcgdGBhpHD08u1L5ypnfb0NVap5eCdgZfWqF1aQvMJEpJyS5zdVHbvTwgoPnKv/1S9hHvNzIeABIIosgmNR2gb3f9k2/07d/ZLeDSZM88onOCAiWmdEWgtWZIRFACd1pqBkjUprKruTtmEpGVcJd0NUm80z0AVlA4IJA7AABQJgGdASqhAQgCPmEsk0YkIqahKXNayNAMCWVu/DVP6ZA+Mslrcrjv2ZP4AfoB/ANIA/QD+AQIB+AFypgR9fsmZN96f0vQmwH+y4rC4PQM6n85X/Z9Z/699gr9benR5jP3R9YX0sf231I/57/ueta/yP/o9in9l+tH/q3/g/dv4Cf5L/iv//7AH//9QD/odYv1s/x34//qF6nf3j/P/3/9rv1180H27+j/ND9vvhOyt1sPx76N9Pe+n59agv5N/RvB92wAAv0/+7edF9b51+IL+p3/H8sTxM/w3++9gH+R/2L/Xf438zPp1/0f/b5v/z3/b/+j3B/5T/Uv+T/g/8174XsI/c72IP1g/5f5/nHcht49/P6bLzOvf649745i+2z2KFs30LCdZMg5u+wLjDpa+CGvE0D3J7h0okFOCA0GFzGKiKubOonKaDhxEjjUvySRjltxqZtx/ymSQeIJ18EtEcPZ8SyHeCW0uxfbZ5bcD8XgxEa1v3m6Q9Ii/J93UCPeeYEPN0xpC1mik6MTnsabn9riJtr7mgdxEPvijvNbGVj6Mdp+jdKJHHbbjvWIR4Em1P2rwWlQZt1QZGj3LrVv1lfVNgeYWXc49Qb9MytYDSf3H9MSO/bwuPyiNQ4vaZ+QjOkfWmJDWoOYTFPFssviPs5s8IRP6SRx3J7YW3T/r2vp53a8UD9iR/j85zBZ89qn3zs36JxYmctcEoaJ3aWpiSCGzYIXm7g6EGKwuSiFagZp9CaXWl2L7bIROf8MASEomqpVx/b5QBTUdg+fxiZxw78o4L8LQfV6RMcpRA0sXf1iJHHcngjh+PZhtxsez5YiJPlu0et8Zg8HFlu0TwmuwRypzQS+GZY1wBcu5nw0djtZaZuaKy/nwYwXME0Bj2o9we7J7h0mR+DV9Urrn7BGyDJ2D7S66SVLt2xRNo9J/ujfPimwj/6loAdg9xHgo49wvOS9V25WL7YqOmNZIe4tZWR7hIX1tkULe+jtl2/+WCynFyhnxcY4k/Twa0qkKHCH6j/Wj998HKRWosIKUewZoM00QJDAFtf5C9iPuvGJJqukyPdPz6w9yVph5WO/oAPucvfJv5cbOSZYzzaHG547alE4T9DWg9z6H4/4OvwI4nBhkRLkkkT8xPP5KgTI9ye1/Qr0B/zvNhpxhNr9fBBHHvS9gUhcyFv3EVqMBohk6pLuiOx7aP0V9ojA99Cyd/4bq7T26EQSC4Faw2HQR/DcWuTXCwWIEosINXg4yqhqCTzTU87FT/imIC6IOEIDWBtkvtgUq3c+45+t+w1eGhEGhAwevGknRwnhCIX4zV+HxCmOVvA3nUSODbl0QME94CTgtuxpFt7GGuU4h1x2uBUNqk0mEXXhvuUwIfIlmYXSVdsrWEh6Q0N6SLCljDP9F/AcWIuVy04b7Xd67zYWMqJXxfxAEOeda6MnitaLZibQAdF/VOLEFmCxF/Bn2T2wOE/ewwcunr5jNB/tfWHife9Xz7rggcIoNLzPm71o/wRam/c4XY1TX29BD8eWdkE6Hm/ZlEYjzC6aT2cRjbWyBALrSxXvcG3XNE/Lfs+U3rwUs5+375QAsjaVnlMov4jEVAomJ9l85WMfDe5ffe2e1yM5dze/N7maF3bf+XieFDBiaDTUmkNBO2hy58wSiCQDcd3et1m4dZ/8d6c3/EUDOaATDRADpgvv3+CAOx2JIPHDHGWmN/1s+5HOyGbjIzNMlfNzDcN59/byT0GnQKoI4lWZ6Ator9EIXN4gvnSR59MhG+o2X+PSxMhp2nkPA6RuuNBYwGphuQnTKBi1zSF2xC+yPeDIbqILp9dCqKf9aDG31iebE/1X6eKRT86JY963D7BvUrnIKk/4qpaKOkQjv/MxFEWS9h2T9e+iy2rVOCw8JDylO7nbRzb9u1BqdrH5vwREkBkCuMfeyrsAalMwVF9q4qNHcMqWPQQP5n/mORX/BB9pT+akMmZ+bkBJpkGNoC/BKrVwrUN8VwTvvhstBpcnsijCk5DFRz7oaUSIffdlCUpCcIM2SwLAHWlsQwq7cf0MSEV2boO+Zx9uoXljmOdB0F5mRHl2ACzXOyyksGvpn39bpRI3vJcHbQgSMjqIjN71ebMWKyDliye2ekt/+wDbBsDeqXTuoQZ8XrSeSnzyC1fIYRgFf729G+9F49np9Ms3YSI6MWaGiz+3kyrF9XiReOaGvtzpltZcMJFOT4ND3Blp6reADOHtZJAdumyaBgLpT1skFlaUsIjjUVJp9AGk15eTTuYAn7HR1mpYlmDSh7fW6RDJgSdCX7wj/R4hPUMm5YUaYgWENL118pJQQ0vF2lIeI+MVu5L9W6JLSVl022NobRd4cnDyShjpa2y25yklB7iickcG+7BEUYQ/D3KW3jzm1UsYx3+IzmQE/Hefd8S7NT2ZBZSM+2UIj/y8ecZzE64gbZsHJyncO4nID6jrGgIX5B1nXKSw7IrC+QaZ0btL4kRvRysDnBUHRmxRYkOQiUVDDp/gDSEtVhfBkbVKB88ISFQYZNfWORlC8Rrt5hPgK+X96q6ii39fw1uGH7a4/oH2sYW93FACnapPEFxFk9WXAWTp0YeKUNF9rLPz9czcrpB7Q8YIhFxTcUT89UxB2pLjjqI51peDzwt0IEtNYROUhv7Ih1y9vDP2rNHBy3Ts2H93Pw3I+3BtF7Psf1NcXTituPjnlFmtoXBs0r+x5VXO28PLlCBSXXX9yVrqufjurT7SHPyCq+4Yk0Ug7onvSHHX7frhy0gPNNOxfbyu8eH9OiXYENNzGUgCT8oX17Twd1duo7AhZORqe4WHf0bAhA0VV81dW/GZHiUkelSDexJdFtcdaLi3Q+VFf94KxAJ+ZKx9QJ3CRNR8vKBtdgPuHQS1dP14jDxzirDjuT3DSTt9jvMIpbSpGKllPdR8+7Q7YXgLZ3pTbPYoYekVEfBUa6ZBNKF+G+2dDoeS8pa/+mw4/YwQ+cDas7OvSMXpv1zJg3Af9eQKBzRPq2cLpRI43+A3oSLINNePYGSnCHX/ssYhQlfVDw/ZRaIIpdpbuILUQ1S7wwHJ2Zk1wCunkkXf6F0q97LEdLTbPYodKJHG2B/jwk8Kyc7ZGQ3He60UVntppD2OFH1JEmN+pUvVdo9qQX/RHjpRI47TAAD+9gP6lioUWd6Ue2psMcRFh6E1JzHWpeGF/J+Vl+JS+cfcnpjTF6+5+8hPVP6Ltr+YA1XNwsWy0mgHrKPzhu0Yk2oKObTUalyNAxzBFNaga2FOY2vzIm/efLHZU7vpgTTsJj+rfM4LtcX+Es0uSqXAwSRmyHJXAkWnPiK7+SPkFU1yrnkUlGpPKp3azvvOmo/2/fQY/xfI1rXgNdRbYVlnXPyCEvbs68ACzw4Zmy/6JIgAkn20LZTdHx/4KPUssYzowmeso2qdjqEw6SWSLTZRuLzr+rUkFznqYOI60sVL/Mm7OEmcqEQV4as1asKOwuukrblvJZXH86oCFL/GHy2PAv1buyonbxFDL9W0qdNY1a1qH+2k3srabNBqtciQXguVlqtxeHdoIBDM10Q88/isn/Fyfu8Eyn/M6YqS1yDeXdCbFXrmKb33H5XaqqDAArI5/vo8vMK7FKn9DvtnbfP//rJCDL+o0tivoCpM/13Hy+zP/N6vx3YYiqZOj3LJStQWGsms3ja2BHs+TQyGllSnFTyPbUAoBpH2HYHsoh8/F2zacXoul6Ea+sAv6Je0wH5RyPjaaAuZPG+fwBYOtpbE21geo/MqRSjXOXSKqFMWDfQuGxGjcDscf/H+fKvgFQNbt44l2G9Irk+1iW0grkbMLPL0swjStgiuWjQ+hwGyXo3zYDA+5X05pASnaiAvgF/NdTL+V6r6v5PPBrz5/sNvfmAGzmI2O83Kfeb2iNFdUoOyQ2DUGKfFFu7Zy9rcWGPE1p6o2O4ftb3i5shtcnruUlJpR8GA7vwzh5uJUSYBs0g458DfbW2bBNRQlGDmd4Dg/SNC6XC8BpIELHIdEnKpft6I6y3tNcXmoglZWyD2J/mLrCjw3I9a3Ji8yBcVkN8PJn2Vr/Y2K0FelPiIWoT3ywYAe9E7tH68NojDKR50lU0v3I4OJc+C7lUGUvA3ikggRd51rDTucZhLsxttqicerYI+K6uIQGoABn/h291LysBuSAMWE7Y1Er6aO+MHupXxbbMUV9kxkvCDatmtU0SmwE3PpoEdRCcT0Bv6JKaA5G2ZfFBzhPSGakQvuK1mQ2+tTwF8av4hjXVLOqiN5Sdwe71qNDj+pDi3gt/+sCAP134CzsXnR+89JiC57wtK3S0qJZBsQHpaSJlJ9+Bj0/udgL/3sl3TJLjwHpSnjLrSsFqCBC+/7Fci3uH9prDOmJ8GtQAD7mFh8fh4vLtArvRQgCwoBERCIbz8Iy6wYuz3Vcd+KDGBt/J518ahd7JlawhosK3dtYiVaeLAimXd3SnVHn0mnxsHh0BwGjR0m8U8hv7FQvVwE4PxaI4dzyduxCMgEos0xPTJpqVJ9RjO7SpbtpitrpH3KRg914mM3uhoJ1RIgs8YXEMUm5wXu5tj75taRYxzf+vTua+0CqHoadl/Nrz0U05mc2Yk8P4q8CIclyZ/rJSGC5UvGQk9jPV9EKY9ZuB4vRF2Iv2yQZEQMu/vP2n19wn1WDWt1BzloGeebIZdJ4aq6946siI2wAI59GywHtvSEHDuyOjb0HpOIGiXCC+GXwNka6gRGUd3hhZXwvaL6AvWYRKml8qCoyqniiaPgiTbhUcbISR2gQ7HaVv5rmTYICuWnr1kgU2I2U09TsKZpJYqp72eE/IzQ9oft4bJe5FwpD2Pbsi1qIX5jTPTppadl9+d+WRIxlGJUnK7pNOnPu6zCWysRYeDdm6KEjtpoKzk4CGbct2nYHiFqzTgKFAVX/F+F8+pjLefkY9g35L4x9rRuAqque9gjFxzO/e8kYYCUFO2N539KuQeVLQj8WQr+YryuWnssCC2jLRqDxnmEYFRHZIeOIhtjz1hqEgIbNSdBEGcckqvSEdQhziZCCpCfJTgR8Xsv86R7aoMxaVKqz8Ds2WM+s+cHKg42AArq0er58ftkQkJmG+7q/R7W2MVa4s///WO7bl4zfpJBtyfjISOO38NIs3QBXQwI7pPszUubPEGBD8xzM8Fq+WQg7Hls5wEHidFTxd9rXdtUrZw90UVlvM78MJfgio37pobsczLfgQvTUfLFX0hJUbClzLRKVEAWOxy3VhWWNKElDrE4t6Jp1aGHNrjF/GePwYr1zbBKpce9KFvOXWEtXl0yFWdIf7m7MR5y4J1io9yquEGrdIl0MivoZTGxkEYa/lT6yhB0m+HnlUMJjhCjNpNkYz50W4W4v1OWoML5Fk0rdvDrVvX7PX9ZtDSRW0ACU7zh0cfhY30XBNFsrpUoCxJp5x2CzuzkJa8BXvidzXXa1dGFjygY/0dadHSKrZHdMzBfHwza6sJDLHSwo8MBQmf5OR+58l8vmCL0ow76ZcaBmCzAKHBYloI7reQ1wK9CQeT9+s8cxIDGTlpXFZuRARAaMPLvTaHe3aVq3bxKSWylJtXHkEDJaAK82pcIl/43yoAYxDDm5GyrcLPLOBz24eo0d5RcbbwwsxYbfHv7QaVSmUEVSH0Jl/eLsirk2ULlqtMZblMJLFhHkd+tIjlTooudv3D5s7SprhPm8iOjmn0MXWt1lipLXPOMFkGncM8OzYPzLwo3Y105wUFi8GizE7bUryJRwKyKlcIJcIzOZbBfZ/S+wyjPxeuYDYl+9y++dEYOTIFu+IMHXTco8kHRvwt5gTG9xL9ReKFmkQqm4811KkuxqrTTVWEcdi/U5NaZJmYhC/qpiV+gSoAB1M2H5mPvLs3C5JnI96OT8YzaHRIeI/+oAfqR5fJTasERLGf50C+jIVowBuu6YYScay/BaC55bAvVYDVzZXk90BFJsIHNsZdTTJL83iNztNRgW7ZpFFgs7HARwTiC75BSGRiSEUSEN9ACzYMlA4M7ONdJGJZZakWL/ZPqmbbjydk1RNndiChdRlx9IGWE/OBsX/sVixzOLlytLCFLS8mP4ab2Rj5he4o5L97kHJw0M3bTFfe7kugaRAvlH7b2n5Vg5nkt/ykShXjIgtqPmjyscJmea8EkMbbyZ0mOLGlCVkeuYznBb4+6pV+2yqwJXWUeYOmmxpAANuivr0vqYXRpisjMZGlrC8BBYIYZngsaC7lsfeDZ3GmgX/JKhb2tWuYav9aaSUp41wVs6x2MY7gSVMwjAvNz8qbIyDAl2tSsL8/K8i1slINHfujEFMUPjHPL1v//BYkB8Y6zel8VSpVzIE1vJMyFoBlRBqXPIfar4wCjoWe2a5NrjAVk3hCh6C71Z9GDhGa4QGvMSB88j69nMWJrp4gTtic8qwt7hbgsnOfsYXzo/5mwZAtP14F/AM+mx6kzyDAy2OKmrLNVmH38u7cwGso078IHBXYWLCs3NezGyEphvqdJBVmnBmCQS+4eSpn+8MgKx+anpO8RTRtarQgAjQGfzFavBveFrfSZwXCP0HdPJDfvJtZspJirR0VRylP3roe3cvKpdqpZBKqxC+5of2nb8144p2x1VpmK2PqBswBF/0AdEGNBxKouOBTxh6fWumzG0HZwocy4jnz23qLe0cz/M/gWQhgz3Ynd/znNxjBWjxqG7jNjg5ExUo4fJvWW4HsJjDNXNY9SiLFI2oj17Z+ciyLl5JmnhE5yCaPBLx7F5V3YxQWrzs+KFK4sFusEJqei2XL8gkUEA2ng2JzlUZF97o7EeUzsB0+BTlG22wINLy1fJShY+nFYzae/trvvQcBAoeJzo1wmKDAdaKIeqXYl/udABVGCFUxsDVhvrCfmxrcfklnpAz8Gnk0taEQS+pQ+49NgDHtJc04aC6v0Ovb1PCys8ct6He4t/oMs8ic81NjAUzEah2cyew32mWqKChum/bChQeemC/ERQ0CIQEd/OMKCsWdNitsFVqws9efMwMt1GAiYDPnJ6dCRlx+Ds8aTBuwCH3k1OTElCYjo7xDNidgLJeHxT0CAt36NId7/lhpKpu2I5fy1Ov+Pi+paDDINEDF8dAu+SHdtMq1w5jx9cIJpvXw3aZxZVfYGbF3wZAjjphqVSYrqOEV/TnF4jjEVka0osvAFMgoqne8d9EWZj2kYaJB37Rp/NKL1EFAQE5Tio9VtGVHzSrhJ3ObrbsJc/J04su0fR4pppwe07QVAXSQMQAno++oSbiyrWANq/bqNSGQM6oJvEdOid/0AOmv8z6ivddKgAWc9OjuFcf8HD7Qk9sJz2AQt9bNzyQ9XfLcwIYnA4RzVw/orMaYSdvauPEsfeD6Gh5Mr+cntIljugyMgEtCTfZso8NRu6XWiOUhm3+Aq3KBvUtImmt/vGxo5SjZkBeYm2+Noe6qlVKpI+b4P98FflABc/1NsEpgKkeTxzMwyIvnkvmrqZP4wp9HTdTJVEd/l5xNVxgLfAago2p8LmHivkqc/f/KQ7K+gHUzC41ruZ2jMEIEYotUxpv3vfusBIBz7yEa3JB++YNOn5FindDR9cjJrPBOLMS+UyvqqHVOXEjV3Wbr45wr1n2So3+FDl+sArOLD/Kwu0ej/fQvK8db7zKL1Q+FOKpIQnEncTLlxkiSQPPJi1Snj1aZuwm3lHugIRELjfQ4jKaDrqHvhB6TdpxlC3Y/tVUfCQAwf23fPpKY3UcPPCX27HJ9QteopCJiTAKUlM1xsaEyuFx6i0IkZY5LGPNziKjgJVBJR67GBcAHGtlt8UE+mjTUfVmOYjXGMKihrw249NU91loKLUXxnsi1Fm1cNY4siw7Cm9hoTIvqn+oZHIK7J8NGWxzGyiaJp2qFX5Qr+67WA16RUk1Ec5qqQkojBiu5L4XHIwcVwVfHBi01E260EgxX3CmPYaztuS7H3jSG2dK2qWbG7WDKFGhi3dNljLo8LHo5Fxcie3iRPsztmHZJWymdQlf/qLkNIPEPdQmMfsMogmigalRm2r8BOkDg5P9FykCsJ1pTG3BVJoxOuSS/cU2AVGdA/+1mZ90VMKKH+ioNUk97QDrJNFtNNS8tBgqW+R9KOSljdeCXqYXrWST+of7mxdiyl+W0axbE68Mea93x8u+jaDAr5W/fPaOCT217obroaAtUc2bnyDsV5v8VZE2/Qms44OF449C87FL2+7tciPS7VUemG89BTM2wrMrB20HhD7+HAbydwM1xXws+iOk1FILE4RzLB+FJzxV3QdSGvlZBngFUuhyJYb5Oh9pBkJlqnBU1naachLwdFw93v3c3x8oQXB91/hVJ6ToTwN/PoTgvVdQcVRt1uqe/b9A7f9xKQIUHHUMEC7xhN6ZRtGfacZ86iPsI1um27fYlMyD5OdSiPCSMLds5srblYAUxzjV23UY9D3jFfF5BN9bMZxdIGuCsP0NQQfzuyfxSSsQBLkQuwy0n89gYZA9BjTVI6eYeM5tm0c47RU0kVMIR/9YhoxwQN0Egn0zIPkvurvUr4/bufl8IhzmfiJfM71tZDo7SXzkUXDQlZNbUqb0K+pae/WJNxQHZ18lGJ2vl37h7VoBHHnVEM7K4YwyW+HMx5fXAy9XIkgi3xM8UsRxSm7qSK7HBehmfOcPgbqCIIl3bXaQvsD+5DgrcV1RWLslzdvSgLCbSyRPgQ6xmd5rMVUv4j3a1KNqdw7q0JLiv57QBSgFoV004jJGE1/3tLlTXaGIbKPi4UuVkd/S15OY/ZkBi2LHfFJlN0qyx9khmpD+93GuAYfGkPt6lvMGj/gbcXLIa5/P24HRcPMFXODgLu+9lpwb79Mz7wsUKAfacqTref8DSubudkBkKBO7vkcVFg5OOzZbOZTe0OVtCCkNAJLW+xe5QgLIxIlxjAYvAKWGhm/MT8jVUFvvfKzlENNnHWFewrmpIucYIzNuTfruEtiQusFYe28n4YplHww6heRLLm/qe3ALLkxw7W6qZSHF9+8aixNdRdO6gnXVYSTIXxdRMG0DxoLWxvUb5ifwXVX4e5yj6lWTUGkdZJzzqv889zm83CuGan9gS0jUXTxKuyiqxImYfmnTOHpJLFVas/EBGNuZ+aBiUrnJwXB35N2GCyzavUnzaVjRIczZBqMc3ruk/k6niPwe2bO1SD39vqOCWSz1iq+wB9b/XFRd0D3oSapY8x/FdqlkJ1GrrhKIESUgFT4MVRQDCK/q2GxVXCro/90KCZPhSsRTFLSr8Xjz4fA2VGHKobiW/cqCN4+pLER5fIAW0bxnKwfR1chtn61cqQ4ltiyqFao0aSB2pQr5vMYvSNlRorT7DgCvaWuZO3CkPNpFckYs4YiluniqzbxzFx1jdyRDF+HxGWKg179bBQ+hMMRu4pbossPasg/aG30CGM/rnOSS0Zggs/uITPRNpvHFxgh18+ahjc7yKFSwXQgD7rDJNOVqiRvJG5ijxPPo1WGqxvzaESKZIV9RYSnjG31sYB5X06UYuPRankpteI/HUi6H0Ro7nug6SEPF7Y3FNqggd7fDFQYWl0EVD25r3EGk4pQZHaS5DGIBcap2QBsljvbxNXT20YHSApWva/ehngbRZvsObUhqG5JaExz2DW1Px0sdFTZu9PTQAJxFTQiP9+FlGNPWBCtl61919jqjGoJ3xhRmcUXY/475uSpRcCVgbi0GhU33I3R5VRLGMj5Rm5DQtNEzQSw4ziPPh66bdboWhZR4gELj3YNMqTrH5RJYlP9Z5QYsqbHsJL8f8AW13QjjQbsQ/dV7Jg0YW4w9YKePq+qBmtHe4Vwihr4VKl6frqTqFSmyGOKuvBPPDQvr7T6uCqSH9V50I6PygELBmQHahf2PQ1aUKikwHfKGBUCHIoKcay4v/YPVSIJAuMi4wb9KDahcjvnu1H09vQJjAKsRJpkIyWEZ7Zeuz77bQl3Hk1Q5f3k7XpitKNsX7K2gtZIXRnUhjtP75MTdoN1CnV4mz1CQolaphNZbq01Sr7rBynOVkOBpsVez8VXOzd0o6UJQQmTXJkoCMUokSuOPnIPbup/Q9t8Ttbbq667YLWAEWkRxqxlt/9ii6a124buKa7OfiNNx6hpcjdK/mhdp3maXe3UqkGjpEVzkRc8KUHpMlpgcYbT0j88gRQNmg8jYgGdymhIxEG34TBTGx6NsaQETVpCcp7Nybv98IKxYn5X7aYDr1OLWzQ3Zu99S82mHm205ophEzuNDi1Ni60LPIiDAMu9COz5fRWzU1wwxK76xuEFYKjTMLb2h3K2zAyAQ2zz+7yO8s3cXNlDqXPHKwFUl3Q0TGMQhQ1NySnqaPMJ1Fw/FhRdupp6+clAEfOgycmHstvQ9WoOEEejpvJgZAZo3WVo1zQ2DSCZYsaQNESjNCA1jkRas0kZdj7lOIJsNQMlGx2da6AxdFHkUyPB1IFSc/ViJDoMELVK4zrKXDf5gUpzy7k65FIYsJT18xeXeWZSV0+PcROmHBx+aPJYP+XmQpQLoNE36GdxTe5gDfBnjnjIYsBvsr3BX66NmBzEacuKivVPSFaI0ALlV+7hbmnIua3DiBOlBj4CVjYVcSCMOxAO/vfpLeLQEFh7SsUgLBE/QeZ9ruAQJLvC97nqnytn7qGCbanlWX4RbEPzbFXzKkbar5cBGl81CvFN8hyKJztxUnWTf/kJPHpc1XTEuIgpUYVOIEvthDAFqVwnN+keanHLhjhB1OUtZRjD2jEgfeRvnuz0MNmnnyqDZ2OmmdkX8KJMhPthPOEAw+P4AI7cZspv1K78wMsep/9+33g6AtApG3il6If7NoB3E3870tL8ORsyJJ09WVItgw6Z4TVigEla+zFDyCVxKsEPz17GlqCZCcoydlj0HrGoLAO8qNZecTMxny2geoKGTSdBxVfHvox73gS/lt+ieWu4FS4rE/iSG0/sZEQKNXuEadYJ7B6wTq4Qo5geeNVpZqyh0hRecPfzCo6KGarkCnXt6/n5KZg05ETqWlRllByjtfJBDbTTxnLd6Y/J1gcdXWotEUsI/q5x3V9BarevtgsOsLDUGAbKCroZesdwcjVMCfdf79Z2j5MpkPTw5PKaqyzHRd/RRaPsW5iCvQaCUkgMrHa+mmZUvspk5vjtbQmyQ5q6TRXfNw+6tqEVoJl7MJe2Trhb86/uOGx2/6FYvutxP+bCnkfG+avm0dt0xMVH1h2D58hJRje1A9Ey7xC9kQiNR1McDFTVHbrOCKtqzUfS5DzjqUtn+k9WXDc3t7JBH5CM+hnJYo9jS1AeghL4bD9x1PxArfJPxE9PAL/QqeTyGG6xKkiuVjhx7MQa9TjDNRKXtjCukHFLg1k5LDY2dmYnLzFdxPscDeRaQh9gCCD7GRIanZ/Doz3dTuSH8bDDFxw3yilFz90NSkK2ZpMfWdYvOZiw0Rd5pwAbQzqU8qbJOPRL8QRiy+wPM19ObCAd8DMYii1mjDCsRopW1+sVyowS2/fl2OXykD1qsEV3pY/KCJ2E9SPsH4iXaFoTehw2tks7XjpLY+QBrGFyGukIS/ZPE51cgH47k3ukR9SPOqZeD/RLohk33/0si1ya70DNsBk5EUSlsZTee75pO07p3ZSDvKG48nJS7qhw0qOph6gjJ84iGtU4SX16W2eZtacz0i+SFHBiaAULie5JG8SIKkBrBiubpkqTQOTZz6xAkoYQ3vSwu7CVcubz0Z9MmPQjpM9oCFYUzEmhP1jVHyDwLixeEOWtpVK9uu5QmmluqfLhwsbFczPRPmgEMmQ4FyfuWxQ5+IHzMhz6pE3KFPPMPt0h8jbgQhnJkCqSc2roqqXmB0tdk4k1JPsDZOidvRnfCYYEzHx+Dc4A5Lbu3DhOj1/HFuK3OAAZn44aurg9SxTUrxnx8KqhzhbX5+OHC+UlE3U2i/ZntCNL2g76LNmYC1T2yB4+AEq+geah3YXSbHt84N9IIE9munf3S2x4TqQYJ11bc0IZ6atWqJh/zZtU4co1xWoFxbcEywaZ3cjkfH+2Gr6xfyBhisI0i4Du7ZiKDzajmFOO1pvyTJbcBHY5PAQ++hVBr4yTDh/IxhIIMKkf/fGGNM3sKyxIqojAB4JsjuCizw2GPQGfo9aXDIYzYWTIqb1hHiauG5s3maZvod6xjmuXr1MKjDXQRYmoDqE4Dvwfv7rYp0u/BnFsjoc62hpbZ2CT5oGkzcFe+2Gcw8/VqNF7oWZn5WVCBzhtN05/s5DaDTEuxzRvllvhW+Z6kV3G7uWxCGOUX+39HDxq0d4g1gWkFfkOo0RUaoWysAquSRuOspGurrSBigXJBVi4RzGGqfzzkdeHDQ+3xrJMJvq8qAqAPlqPEbfXBz/Zv1Rc/PjqEil++jFucWDFuKlwEx/g+GO/oBnY4lc3M0Ju9h3yQHYD4yEB9nWY6RLg9mqgqm6qanmp8u92fO4MAIA8L+zLN4FOz8QoWDd42Yn7arm2y80kQ85CX5/G9kLbHGPY1vWMDtQjq8tv50gpOv2AG1UPh/KKke/wdSe1r5ajZ2BeTNbuUZ/txBs1qsn9+NrrZ+Tv4h+LBEh6CsSXY4MJQ8I+wQ4YKDktQaW8TeE02G0Fh+Q5fQE/PiVFXl51II4TTwMu9jk/ODwAATWnrAtNBUVS/XIQ3mtDh7zDD8nWLZTMpOmyP4/BTck2oSAEpilbqxCLwXtNCRjUV7UDpw960r7qXfX9Y8WUfHmpLiTNH93fOIoAGloUGACMm/Ph3KvhOZbIeCB9jrSC6hpdBChoXZYv42/b58fktD7y5KBiOUDfVypmamNgKHEntUk/+OfON3PM6BYePXkzGyixX488PJTGuuhGkwMsdzZUZUaBOf7jwnDzujbjXW37+kbxke42IxXEcjyGMVlVY7e4CvQ8hNyZug6OSyyYV2y5MnN6zbyrU49Wll/qGUr7m6+pV+bKR3J49sYh7GjutUxvzzuR68DBY1dQP7OyQv0+WTsyF/FpY9OSY7E1ge2aW6vZwp98zFZK6s/M+3b7JUWGi7+8AbMMi6JezROfoyCfCtpu560AZ6QEGq6gDhLuhnuVBILAuxtpHjhDK3DkT4lPEpVWB5e7K5EEAl9TLIA3KExZKKwRJlpvlkV4aNlfsbwpSXkDVTvWCxUcINoJLrhR2enUVXittWjrlgBbhcuKO5BWUTXNeWNjfBN4Vl/c/CJLBGSoBouMQpd6AVm5+C0/eyAXAF5e4qTWVMI0pzDMAdLCC5TBmbrmO6b8Y4yFiDRzIpdmoHYZtXlKaFIOS+oZdFPf/r4Z/5k/jmYG3rjn0iujBze9W2l7BG9y8g1L+S89onGLonjV8DPlMRFAk7IrldcCM/yAKZNf/ij863ihfJfNOG3z/5rPFbl2L5X5hUgzzWy4aKb5EE6IYDao/hKtp4KilrvVl+yRLzRZ9lC3iB17JJneQpxsAuBw5NnGFQ+vrY8NBbSNH7hB2qkSSZZtPMsm6HN2lIMI38uqc79N8adz7jxNpdAiee4DwAo6BXqci6qF08Nao1EIG0W8AJl4l8pvk82482wZ+rf6/6kwWe1Nfd6ZUiKrr7dg4AEf/U2h5S5x/eVvSEaX1T2QVQS+C646JuNtKGbOtgeX3qoKWX4y4kj/0O5I0qWH1RBYI7fk2yl8b4VeruUvJQXupUH7t39eVdEjpkjmVcFI0p6UomfzNa3Fo1uHVJpaF1d7yewgYRRXbPow2TteLWL/rmEaUE4zoFisnoVu8D/i9i9FH5UquWsxgPsEIwUOUikVGeldH1/bl+W6jhRCss3xKD7hWKhBFQHy7OQVG5j9dkwNwr2jowdnESXldM18GOQpkcmi/8K4wX2dgbWNmbf1z190vJP/Rb/+DojCRqHu1ZXlvIbk5HLCdERmaxPehHt33ToGQy2AeOMENsecE4QSSlA49PpEUqHGVfjlnh4klAD2PR5aB4pEYGkPUtqbvw1J8dG5t0P7pw+ooySIXcnq4vAlKTR+rEoPMUESlR5B1DtXc9hKnxfVHrgnU4dJw7M7ayUXCb2s9dCgzqPg/z8F6Jp5URTl0uc+mo/Y+QACAhdQ6wPWgriO4dN7AqLKegFh996keVaXZygzxrJLMcf/c9dd2kdRdDfwN6At9azaceq1rN/794xubTqqKZJjNZxb7aLZwPeLB9lkGZd1WgFBAZlt8Ph2eanL4w29MlbtR/0jiGtb7zlqsuRzV/foIPZ+dvyrQHRq43suLOOVPFImf4nsZyCnkgACvuishQCg/qcIFLwtssXGOpQfuxxhASH0riGHG9f8g2HfkXapbq2GaTP5exFFQ0/7nAtluIVKgLd9wgS4LnsLVqHUxs7PeM44BPXWAev6EIxrqED52enXFKPkXoNPHwMma3wJap7TsV+uAHG1hmYtNb6fkrgzIsHoaTksQF5dSxRMWpq7WKmVI2mM7csR8SJLSHUKWb1ZyvFDJk52HuKQGMWWAwMfnhLxIhg6ZkCx9fNqcoP2j8Pp0j3UymXZfM59ozF6u0LItwOcBg8tJiw5Y0AgeYweZt+BcK4j+r9NS7m++HACTKhfKhAWFgiYxOGOiNgXJuRL0BoSZkC9Q7f5xBx/VIYSINia2D5iMFf1DFlIX/NlLRZm2zezlITdRZf6IGrAhP7rR9b2WnbcfsmD9SOf8cQM5Dmhkuf/W5MnSETrwrt0MKnwqVPoAfUcgfoz2axgcSKKNgoKAJ+4vrQIZOtSwzNggsYbR11rV0TqkkZ1sMACE2Bi/gRUBDfyC6v4lYSgOwupB7YyCherxZ6VcyPLyxFjaSpTMLTzklRpvoDcJ7eankwsCpUpEVPhp9AAnA9t/0luhCinYZ8lJkKAkKGcAmmkU29WCQO88lplgtHh8nL1UBcmfH2mMVIXWALA/nJ6mht+OwNbjDw3/Zf5Pu8txNM+HJvN5ACCqUJQ7yULzdSLp3SZIvE+0w6LAKI5/mcYdiJIXkjQghB7PoUo+qXlJ+LdoP45RaWLt7Tl+RZuyWTFq8S46cSLl/z1ngFIDPFJwQI2kEI/fOufdX5vBKurWVAGcJ8fPfGRpA9nKO2do3W51Ndn90R4zhnm6I4gBM7d48lfhGPB0BdSNCHxxFV35VCCNuZOqx3U0l2f/ogit+9go/5KN75ubiIgA5eyEwgKRNsxq4zyOTkJWgslwpDUZPuyOgeh9IyG9KfoleBLeKq93WZzpLLHuunfne4Gla8P34p7WUHIpUXyEyXt8tGFtD0XmSJynahuz97myrRaAC4621hPcqR/TiBbnGGGHI7LHR7/mF3pLSx7yC4GWOPm2kW5WAud/BhrKEpOaaU/RSsNuswgN6GAmrYKIn1ZUaV4y2rdcPJx7Tc0a7RwWU4C9bwmXXOphP3DD0VqVGIw1395jF5TnXxVfVx4Xy11hYDLTrledo0uMYWyiDdEcKKCnouIyR6Y41oWeOr8BbK4vsuW53hh1GrG4P7kcA3BpZYExK6j8/PSCnMG7+ai/qG2V0f8GcccX4ze7i94cv4JKQqd9BK8JI3oEq1PmD4YBlWq5Un2EbCyuW7Jnl/x+EJL2vXgJd5A0BRgwQ3NezM4aT4MhXLNvrBJyYvKwToy/VT1mJprWIPLwBv3luRLAeDVmBK5jUgSHv1RMDRq4htkbOnJtXfr2r2+mJZua/lsyUAAKK6lR1W1wb7N7OKqP4MXVid9Zn0Ep9kgRvOHR9Bll0kurHvKNN9RMOmZ7o1BHfDloyIYvDvgRgmpxW+V18TnIOXHXynCVCClcEfAcPRTL4/OteJVQKsOQJ0JoOmIstRphP3t+29yIkgKqUtRvuwj2Xu4h33moGZ0dh+51ueX42TKgRhb51qWzD4J3raItk2ycGR8McPhgOVbI1oqv0zGfBqkcB5JwN/u2KQQC3t9/Jj6V52eodXcM4SA+WVk0EX9YxixfRN76AheekZ2pWvKbAXfnB8mnkDnBD4Qm605e4PObwLL3mNgULuOro1H+KBVQf5UB2loLSyAB7bsgt6be19HQmpGZg/IiW/2+EofQYabAlDClIPB25VVJept2O2wasGYR3wqpDGNr/bFKCrlMkDhO/TILpWArGWIM7rezCA5EBYPs9qr/37wiZCnM0XC/rNZF3rnIIiMpVscej1YH6f7Wx7DZAeSpH99Rk/3Z4EwV9Xjw7ssD2oS8+uoSUOYd1ynCmMu1mA2ypZvuxB4vT74UPfQP4vgDkLtqtEb1Gi9Wj1Q5zEXirIz2/eNjYc1um496Qjd81P9cRguBxxVSVkDgRIaB3JqW8fcVKkDhN8MI98pIUMvmO6xYEkJktOFNzB/bi79cYnmRkqQSaKlW3icrfjdXspFFzIqG0rSGpt0pZyZELioDsUmSXFE158OmjQfuYHtRCTfxy8Utax+YQjiRC9+dFsfSM6LXCM+xCg/zLwRKTbLOh8hl1pXssf0K5l+YDHhIGYo8rbV25t4MdbIEF1mTMvaBfcUQRzynMbW+j4wJlF4S59q5VVIPSY59gGV1H1Ts8+1UFGd3TjKpy4I3HO7FeTvoOd/xvTSFkLdFZWFXGnk8Evxne1nYWzWtjdCNyk3v/FeDKHy+QUZ3wIIzZlT8lFjv0/m5ashKFLVemV2yguyMwcJ1dQVHvCSre4mhCztqJyBCdYUGXfoeeo014LC/j0KJjjuwravbTXbv56rI5vo4U4kBQ+TW4N6ERRkfuXIekdK5h876Zrr+sEMuebfcAHceDEZBqPsMD4oEQcvLSQF/6grWppdHNtsCQTUZw9GBzPrfG7foyxaZcfRdPFoBQElhDyOH7Ix84VTUWvdc6RUrtwIU3vaMg/oJy3n1hzCHQlQBhHpEIGpDkv047DbPbx8t2MIdh4F+sotGDkqCDwZZrvbdC/81qjqP3ev3IgjjyOEAusP6wTww+2B/BnK55VnoA8WyCyDteSOfBNX+uvU0+Na59wHNIW1sUDxjhpCQP3Ea74PXu30/9dbVLyRRFQS93FbGWel35ydA3w6sleNddGwn2rdjUDS+BsXBX0QXrY/NYzJuwpKuyv+fjRmGVKUhqs+KQJUAZ7jhtNaWwObgjupRognXeIjVxADq/0Knh+yFb+Q3ktG5qr5k9rna+vFbNNoBmABlpJazjtT86XJEUl5syJyOQlbvuEY9n9//MJQ+9CcRg38XdQb2RqSPjmPnjt/uQedtzIwQPpEkz0YZLau121c7JrFkaRCe6aW0wcAQ1aKfz79otMpC7tGONfPLYlzQrfYqt6zUb2SD7hKJXwQjtY66rTHMR84vOWTvAJUA8W1mATPiGy7YJMt2wTvh7713bQJji5B4Mfe7EaJrYyYYYGcwyArFauXTUxOWkGbxpI0QmqqLmma+UOTt/PRs3l6b+HgUKA/qBd41RXP8Dwt4fO/cm/xXzIoKAF/QLjLjBIii34nNGJOLodOm0oGJi2dlhSmp6OH12UbA1OwL21cEZBsJ7ElhZ/DlaMRQfmmecZ1o0xC8yngjNrpsoAPSelm+2SbAGL/p65hf4qkpDmgOx/YpPtZr4qDzwVIPkkfmpvmAG8FDf7H3J7YkKxGnKN4R3yQ6KL9SNZXypGP7T00lLSTRcQabG3+L6hnmWwFSSp9Cl06jCzOQRMecUlObYTNnakkfVXx2WDB0nvTwtHVdsoruUEDJbO4rIG3ZA17RqF/FJ8Qd6R+DHZL2clR0roChK7dYtO6QGq7gXPsQtMmC1NyJwPgJu0cm2nBNPAeevHZ9oGzdKSBIIdnDaacGE/JXAmpXoYEu+APyHqYd0OSxHw3RUcAjop9u55iU7/A45U39oO5VFnahn+A3NWZZmsW/1AnFiWF5I5KwBtQvvh0lYFLPwMCAeFi56ZfGi+4tt5APoAGFsmql1Htu6m9X8xER6XLmiaufKXtUPT3lcCkCobQ2GxvOrfl41v3JoGjF0GanG8pLwrJrPY0Gzj6bVaLATpR2AXw/BbzKz+F8bR3MK/YrOpppVW73aU0Y3wIce3Z44NGodh7i+6LEFgNZsvY7O55K5UgBL4lYry2edm5jHv7HHHujKkL5oqm9eNm2sGTgwqMmncsaMtRPLv7REMN+56cfqh+yyLYDQEPquEBsJMARvs+XTcXjvLW2o3VTIivpy4PMTmX2OanWEHTCizJS9O9ejnVYrFiiZB41tH55BDtE6cwQA9o1EvTaNPw/TvRKloQ8pbkTsBdZZ/wu9N3T/V7Pcg+zDR4vyH5BYWACf7URnKpLixnC/2qxrC6FJ0klEhFLH/BGuCNcZ/JMBOwYVVY8LiZITCKNGkCRwp67WKPQK3F8eaWlLroZGkZ8nmy2M2rM92sE3rEn3a/m7agduQcddv0l08dt3GabMO71aSISLGpT8vpcLlPGBPtVfeMN+TTvwaUN7kufQfHfpaOZDs04of56nAxgvn+NwnpvTj+dPdA26hG/vsjvdY9KsyWR3BqA6rgrbv2XJdnKPaGzkxjVNXpO7pz/xjjDosi1zaVqJ7qhu/Ex3anXAYU3vZ2J5EYkp1YAMX69g4qx8vqPbGgsWHDgB9pEowC8/+QvpYZ0xyb9HbCWgcL9inW95IvTofzUmmfik5t0VclRgQpKkH8Di5lBO1UDr3la9A3OqMWAOHFLg8Um7fG7BtsW5OKU5AdezwFu4S5zKjDRucx4kKchDm0OC0SKPXfjM+1y/b3UtL16YWcNQ/hcBvyWxuZMaxBDK7pTMRBlupDrYGYG1rSACGthvs/ZV6JKai+LPVYeRwOuz6rCeTnM1RLdnfnKysq49Jkg7m7KtSOkHhitVKmItYbAe0M7pgA4I1xW1MwVnGzYas40BnaNoH/hzyn1gHCGl5aUb4Iuj6pb1eaQBTmIebHn+czdiRHOI19KwNQqEP9mH4wWg1eOnRwBISJqRAJehxKJPseaiofrV1LcU7l7zngn5HHNfvxoq8ZmI3U14D18rpnmmUKM1B6+5z3bQQAfFtUam8JXtACpTt/6JfOWuEBn+kDksuVGUpf1BGuxI1k76gGe/p3WFj4cy2O8F4DqKQkO6hy7R1ngv+3IlzkBoAAXPNBoE5EEkOLVTP5XnjAw7wB+yTQnH1HeUYLUdm5IbM6x/vc3bDvSV+GLL1iEXBRccorM4zZHu4R8CUSs6uKPOWkKkNKg6EebIn3mC0QfpDRsoTa3Uk3WARYHwil+FwdjEJlCBbOPNYt8xYiIswBBAgV/0Ae5trI5lo5ew5p6On3ONPJM6qhlofiJQeDIpoh4h960hsT6apw1ybTIileB99KAkB1qg9dCwQfQZL3YYWags2Ymz3GxIbPabP3JBMe8BzKZjgU1GfoRwIhqdYP/dNcK3zHoBbXU4WvYWWyYHI6JDy7kINvjMLaFBvmCSoIY3OnpkSsEk29VCqBL/U+f2s3kCpDam7xHdjIa9MLfHSyQqTdtTNTQI7/voe3Q7/xrerkM0rO+aEmXJAn+464fyqBzSoUFcEGwRAW+GHwZ0d+rIFtE6+looC9jGcJ1DIgAANiZn8TWG1GJGrLXiT8Uek3XXgnnhnUnD46J083gpbIuWvvXsOBN8J70UtxPyAWmqCWBfyUzHKUo1/IQMfSAs5gp9A6dYgvKC15DuTNe6fnFpy1PhP+jUmPUneHHYnMuIdwsMSxt+uILANJmZEhUxh7tmB5tfH6tZl7i7QGEWvmWjTK5RHYrFVIaBHrD0IYAcExTEaK6DJKOSESgjlK3RIVpVM8WQC8TF0UOPFz4U09T1yJ08+2uhXTiPxOJjS1qp74CQoiU835VEYPOUzlNcfd07zlYjceYkGXyDX/+1UZZJ0jh21ArmhOM6ypfFTrsHcgmXaV9gF+Wy18m4O7GXS6qx/LkVqZ+L36p2iWKbfiIzZlghJjMPtxiBL0zcq5sF0uBvgD2phowvB2MbyGQtASxkQ+ePedbjCLt52AU3h+WFCBIC9JLTx9lVambEVXquPggd9okavRPmcPeXbkZyjOxyqW66KSl5AyQiRIMMmxuKfyWejqVcZZRxLh0IAAALLHdvJQvQCWbO8pnJEZe1W617Pc2urVLkxo6YIMZI7/8jEV8WzuQTUK05UfZo8BmiuFV0r1CkRY+zBVxUehhWFZ87DIBO0gzuW534n6cJQij1LeiXF5vz/bA+PBp3MWKvNxT0j8mfHo+fCOFq6Gyx3iCbWaxl2nCQ2K4zbmX0n4g/m+E9PFwn1F9jSburdDk7ozccotkzVhnniKpSrxKXHUTS3CD6HMfEUz2ZNCc3LqvXPiYzF7T46zc+5TUhqmen5OTFpuuTnHBjQ/nc9rM4v21Bd1UyIejehOGIiovgy3BNELbGydkJ1o/qfkszZRNssPXq46UzgxEdUJ1EzMkk17sdAhtQH5D/voX0PMsj3/vrEmOARsPk+fAosggAAAAAAA==","kedip":"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","pakar":"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","ava":"UklGRtgTAABXRUJQVlA4WAoAAAAQAAAAbwAAbwAAQUxQSMgGAAABoEVteyEJ+v786V7btm3btm3btm3btm3btu2dSfJ/F9PdlarOnr2NiAlAVQEAhz5WAA4NFgx/1FYtaN+Iw6S7rQhpjrjRHyefmRy+T0Sw8+/kdnCN8TiU/wZ+My9afeEgp5ED9uNIkOacmQIjf98QXpqnGO5OBjMOTAHXFIdbGMlEbgMnzRDXTTHJgwwkjQtCmwL3yhCmxNMB1whAO3lM8h4DSQZuAd8QwRg/0kjSIi9rw9UnGGViiAPgMdOHDOx0RmMUs5qx8yDvHBlam8fOv24JqLSw+E+M7Bj5KFxjFmE3Bj4/IbS+bcm7ZwGw/F+M7Jz4kpOGeGzB0I2Bn0wNX5NicRvkwAnj7GdM7Gr8ZiRIU47qiZHfLQ5f1xJMkfyRNPYapoFrhuJWxl4YObAxfE1LMtEik7FX4wLQRgj0baaemJg2hJdepGsXh6n/pZHG3gM3h2/IaD/QeqMl7goRQJx67xy6inqvTgTj/T6kauDxDXGYbrASLfGclmsJOrdHHHGEUccZYQR09n6MTDdCG6FYhomVLfJiACPNtua+p93z4Ptff/Xld7989eXTVx+39TJTeWCRQcsQ+SykER7bM1QjA+8/6+GvmHPw3atP/JnG6omfjwBpxol5mDg0hhBjspTMUooxhMTsxsGp4ZrgcA9jFsYQE3NaisGyMHEpaAMEeJ0pT/MDt4BvxPCfl+PQRjjMGMxKcQO0AYqVmFjGxBfRRI/tGQph/GZkSBOOLMjA1HD1KW5kLAQTl4DWJsCrTKUI3Aa+AaN+RyvHoQ1wmDaV5FpobYrlmFjKxFcFtXvsyVAM458TwNUmJxWExnlF61I8yFiOyE3ga1LswMhyJr45gpNaHCb91awgjLwIWtPDjCxq5GLQGhRrM7KsiW8M7ySbyDDvWyoMIzeCz6ZYmYmlTfbhqCK5RJ5hLA4jt4XPpFiZiQWyV71IHofbLRSIiUtAsziM8xutRMEuyeSxKSNLnPjJMJAcimssFIlmc0MzCEb4lKlMgXvCZ3CYi8YyR94NzeCxHmOhEt9WSI6DGApl/GN8uBznlss4Zw6HhxgLxci14KsJnijZ2nke/9/z2H/OkyVbN4fieoZSmS0IreZxdLGMNg1cjs0Zi/XbeDkUi9EKFfkEBNWdjvYrrUyBR6NdTTzm/8sKFflwC1rFAZv+TGOhjc/PCF8B7dNJY7Ejf1ob6nqa4QlGY8EjuS+gvfzOyLIn421jQ3tgZOkt8P3F4bqlFEJMVqoUQ4hm5K7iuvC/8J8vXzrLSZd5lt/l+Fte+ppWpndvO2/PdReadFRUv5GxRGbLoqvrQdUPi8OZWKbvZ5RhVJ2g9xa2ZWSZE18bHQ5VPVZN0WgphmDlSCEmIyMfaTlXQbHgrzHEyLImDrUQB3gVnPSGmb7jUPviyWMP/dNSGSJfPvrWD/8iSeNFcL1N+Q/55ZOXbDnziADWZrQSBL4zDjDMRIvsfuNbv5GnQXua5sQt5hkRQ8W3sS1T6r/AtydH22GoG3+ZvfeE9NRR1DsB4LENGfttkK9PAAXEqVdkFO9V0N1jld8Y+soiHxgTiq7i1GsHcU6GVPaY5S0G659IXtSCQ0YHAE4ywGOMe2ixTyzwz00gDhkFI8wwyyiAZIACu0YG64dIPjITVJBRsfmXkd+c1IZkgAjme5oMqWnR+MN+Co+cinXY8dFhXQ5A0d7vCzKmBllMtEsnBRxyirTfYSBtgMcjswLjHvEJGaM1IwWSjy0IeEFWh2kijaRFmyMTxAMj7fgxyRBrs5DI8NDKgHPI7DDlQAcmXpULEA+MuP69f7KRH58yAyAO2QUjfWtpCBnzAaIAptjulmi1GL84ZYORAVHUqTieoRPrANQBY+wzWE+yNxYC0BbUKm70D5nqE0VryasG2cDXdh8L0FqgWDRGq0uB+Z4jGWuzRH629xhwrg54nMpYk2L0M8kUjQ1Mgfx8PUDrEDfcB5bqcA7LfkpLbKoF8qYJoDXAY0vGGhQ4IjGwySnyizXgJJ+4Yd9jyqYY9zZaYsMDeTCcZIPHXgy5FDN/xGBsfEq8ACrZHCb+i5ZHMd13DOxHCzwDKrngcB9jFodpP2dknwaeD5VcHtsx5HAy6nuM7NvAI6G5FAuaZRDF7QzsXxvkVtBMguE+Y6qm2JeB/Wzp30nE5YHDw4yVVGYK0fqKkTdAM3mcxVDJ4T5G9nnkytBcu1dTbMXIfk/28bAimfaoJni1AExcE9oQxbIxsQD2flskz54ZLmMoABOXhObZtYpg1G9oJQg8Dz7PiVUUqzCxhIlvDCuSQXFDtfMtFIHGuaAZBM8zEVZQOCDqDAAAMDYAnQEqcABwAD5VIo5Eo6IhFTmHoDgFRLIAYC4mSEpQ1gf1W8nHs7l88no88wDnneYD+Tf6L1mfxA90f+L9QD+09Q56AHl2ftz8GP9m/9HpW5pz/Yu1H/Kfkz+0HsP5bviUpCmLxU8AeAF6778nb82W9Aj2Y+q/9DjZ+wHsAfqx/yPKy8Kfz72AP55/Yv+X6kn0/6DP0H/P/+v/R/AP/Mv6x/yP7x2w/3A9lD9Y0yWrz9ArJ4OqvZSVzQ2OtzsLsJHFKlrZLw+VDg0c3FqzFfd4jd7rfS1AazXZtB0sf3D95ZCcEA9OITuFRoDJipo/DvnyBwCGR5coXP5DEmVuf7PVY17y5p7WAdH0+sbXfOTsOR6cD3gDkyvXPZS4fSYJdku7Hg+WQ+2cR3zT5ePGzwdaQwVHG3jSrHu7+6BYW0S1SlUsGO4Vs46n1U8q4BnZZIWmc513yw2zhYrlfKu8qfdl158vfn07qSkjBFjjXF+tsScaTqnj3LxrZEc/tjnpPKpgVMcgBsVzMG8ObE6uP/wSzbvTOOZJ6lcHuk3UItgQ0tNbTBiVaeU+CK542IYiEiVHvmQtwB+aAAD+8uE3ojhm5cUfU0yL9Zjl3LcxF6kixTIyu1T+vClKPAzHO6bqA/YXAmxmX3GBrJIxButFEajnNJUazzm/NituR6dRKV+b+rPm+YardYA7/uYGZhtdxLXKfyVsFWrTYv/Y593XARu3gPogYRIYJ8M/JZwby1xuhLXY4IpPCVoW2gd8NI/YdXGf4fQQC16tWTIjjglYu2heCoL9PLesYqUWp8+ju86BTIDIWIbsQgj/IgHpvnzvne0FAiSVYFhh38n01/y6wSSYWgsaI8zuM8SYt2EHcrpPZb4esszKJP5sZlPYJK0gytWSdjKUJUjuJSZ9ks7Ixqt6bBLWpIFvRi2+qngi6E8fBJBJLZqp3vRjnuFwHMOskPDGVmzcCfM629ZKcdWN1iplCWcXntIXTb6t/79e88VqxhbtLT3ycGfkHIpIWrUWKuAh9P7BDHaiO/KiH9drlMUrXGme4DkAWi6g7vxG9DKjTknV5NN80hrB08v+pddo5dIi9k9ZecS/Ntmc1buFey+V8cLHa8e24Px9hiClXVTVbEwKKUmg4oQVAyymZoF92C3bD1PHpS6rnTmHAMNqn+pQlFLmVg77FaVSODZkda9I4sLTc4iovee3qzniiwsQljOkAe/Syq93FnJ6hDCaM8RT514KUU14Q+dwqvMdW3twgBwjzy+f60JwSOYEvHQYTbcBB3x3RWV2lzSHIjPYugbqPOxtsI09qC5ssh9W7JGxHlosQfMYnPG0uZ8d/5d/oR94Mpdz2HjpitTnw2YoBBP7MHouCshrvR5WiZnKTnfh/Y/tYU+9/KR0qnjCiwSSYhbokxpRQvg9wK+aTGv+ezdjnt8hWl7kCxLlCjywBmMhtqYGVjFaxCPH4sWtVBUC42bi9ieUVKI1iUqbQQrfn3Zokt9o9M1kEd+XSEu7mEZINc0HharfK8qkzmUpUFmcZ+395zohXaqP7r6J9hVypsqYT9JPwb593sqE5rGE3TE7BqyxwkafCmpfUVgn2jqH3WztDwy3XcKM8gifUiL+Hx1Zbr+IsVOkrXyRLF+54teI8LdsW5URPwdwui7xTU8mJ2V/okVKD2gniyzt1AXSLC5/BgASy+XfjuMdWCk6wPFGudP0zZ1FbUJaL9QlkBnEXD5uoEou0PRIEVcSdskp7l2dWGzd/yi3NfQ8+VTvNLU6qonNsBHLEmkoaCBVfnqT3zNRkXrHtlgXec0tsITRDC3FFhbitZjhc8Efc9B4dC1X2peJp4BN/dIR2g6CIkXVjTGEdP1cVC+2Hw92LFzHYImYk5+TyQ1m+AkjkaF/d/CGwzjUxpJaL3434RwNOhchymT/9f4M24L9ouWeoij39/vyGKPEH885L06hf8/fvgFlJyMwIUKCKrn37DXy4Vyw6/6F/yUe7xrxqJvRz71R5TXx2AQPppsYwCU8tXzPXfX2QBEGyX3hSd5xGLbu2v/nYSDmF0ZcLNBRXoIWadFKqe568wfzi4BVu/iZIfSi1x8fScGhnHhCI35tua2VHs/CBQI6/C703QHbrM3Skd5hvw5T7jp72s1Zcj+tBFqaKijxhgDodoc9M508iJJnZ7Rf1vcVWFqfxd1nVp8f2Wr87yo9KwlofM0GwGWaOT7Vm+Og4+AULVa/Lz837Lieh63kaD1nzgHxZ8M7Jrhy3UqouG8Ea//fQ3a4akufsQaeo9juSIF9ettSXzdt/Wgc2VgsY9i+R8Uqphvrzzk8bdVK+mf2s7rS/A6NbxG3PWx42BIE3v9FzdIiqTAzat92TqZXvGmU2qFUNS1/NRUkzJMLpF/IoVtCYYWGrhwXyK9ryH2sNyy2ln3kbjUz+SLL5PUPdEuvUFREEWbPMcQZ2Yfp+eliGEV25RfGg9g8gaqx3MzgounEdGTU5d+9mtmWSU1f2j19UYZh3Krdn0WhgiwwyBFWwJHZflNGnGhngCTbzPeEx6bZavjb8kO8UVUvnxw7MK3qzhDielSZ+LE2butHsfT9jOZBpAJqh20pq8hle4JKkWBHLtZKDyKxzZAZqJkPip+lT0k+8msJ3Mn0dvnyV8AExxzn59v5DwPjOfWRyl812Q4zf8N5acqgNY0ZygiMRSG9+WCUDeL2mKrMCZCPRn0TTlWV+hN+iraw787mqEpiL3w5QlLQ0V3Xy93DIwYTLF4oES0zG2S9Gf8AGpVhsdurEigTYU2yoJgC3Owk0VU/9XQeRxSUNu+4qcN2TILl6gOGdxpTeM7BUd6WJZkD/iJH+0fQeuBBHEdllvBjJifmELJhQuEddBZsJol3cHttunMjSicibMdwVt4kMstj4dPza4NTveR7SzxQeV16/S1qSfycchCqW8vdub3VsMKpkVRxEsVbqAVzQ2Z0AQMgeYzLvleNc38G2WLkm57hLNnZMiBCvQGtGCsO2xmejnhf+TT3x75iIrwXfj6fsQ0Jf/j3TH615T//h1sYAy8n2exz+Cl3ASZCvHjmcqcX/ofxElrW/Mf//NErIcrOfSs+6ua3j1MUzSPDbpnidx0J9vgfofTnDs54F3aThnbH8hnCZ+b/hIZ8ncNs/LNtXXPjeYOp3hreSlb9HIwo0nXhor0ezuIW6ZDOFMg2T4qjBRUnoxffI3X+lT2rJpBSkclcxZ4/bGPlYLpfnsZGrarIoDIHmuXOcPsRxVM7hLxu1nfkhH4Xd/Oooqx3NIgC5xlDemzOe46g3Q+H2G6gmsGClwGYrWgyS6vmgAndzBm2K/1TU1vFXwequCn4RUU3TRL6Fadz+TNjwY97o+f0xUw15t+czYFe2QOsA7QkB7mtWML3tP0vpok6Pn/N9e//cP//ttn//gsKbheHz5t4libtmd1o5koynV2GEDAvLZf/u8YUTUti0+yYPiiM+dStetnfhClPsCcLz1Vxg/QKUUdnM9nlP0qQgvjdv39pDjjwKy6s+R0zoFmG/G4xTUs4SlujlY7uqfnH4+4WmFRrXTW5W3Qu0vlMabnrmF+2x7EHZGyMOHj33NC3u8zOW+lwCJvAaVbm8KMOLJbf5xPNWwQGjmtbqsNsBQj+yeHzee9FiLfXsQNMbRJDkuXEZYHjbIM3C9XQ/+4Decn14ahGFEXeoJS1NnGcAnruy3zO58ZNFAOB88FY2Sjv307/d6Z9aeNDjRlt8IzM8rbm8NrtZ2+574nhqF2z5S+0BSwYyB03lqfemHeF1oKTiOEe69Pz2730q/9IcIv/inVBVGbQ9FQ7NGn2SgGu2jg+iEXvc0ypMsfSY2rRnfce5O2WI7HIV4PE4HEL9x7+ZXLUiJcSet8UzcDDYxkiK/iv0L74yZkZbG+ko/VFdCYqSSpZdQR28M1NAkB8JoPDLP4Rf4kgSgkTpvpUn3NQWDZ7nKwWZW+oD5MEWjBr/6pUbWPVdHs7sjvzbcV6yeaJHO/8Ow4Dh5O/gfrNuqYNhhjKJgzf1JfF0b5pMJTcXWMvzeH1iPqJ2We6K8lyfuqf4zEJ/RCNLVtJhOVYL3AeCQWWxA/d5vZSPttTbhUwTmD5iV+gjXhsJYUyh1FkwXmO+fTzubM5L87LcCWU+XhyAqJe7dsozTOUIMH/zww7+lPsrgkdCswhAvSr3QLUtT5R1BuWttpwAph8Tr3G1g8u9GSukAjUwaNJoU67zCRpzxhUhccgFXOtmq6ne0YzDflq5PmB24saB83a/tNbtqibefC6SKwVo1VccZ+Vpn5UxSXfNrO8d/WnPVZLUFh/z4lb640c7NsCm9we3y8J+GKXGnEoqPB+Mu+a21F+pa43RwNLIZyWtzhN1FUO1UeS5wufGg77aYclUmcgp1+4Lt4SB7yjjsAA"},"awe":{"tenang":"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","senang":"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","kedip":"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","mint":"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"}};
const MSRC={cic:{},awe:{}}, MNAME={cic:'Cicuuu',awe:'Aweyy'}, MDIM={cic:[417,520],awe:[465,480]};
for(const w in MASC_B64)for(const x in MASC_B64[w]){const d=MASC_B64[w][x];let u='data:image/webp;base64,'+d;
  try{const b=atob(d),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);u=URL.createObjectURL(new Blob([a],{type:'image/webp'}));}catch(e){}
  MSRC[w][x]=u;new Image().src=u;}
const MLINES={
 home:{cic:['Psst, jawaban benar di percobaan pertama itu dapat EXP. Baca materinya pelan-pelan dulu, ya.','Lupa kode material? Taruh kursor di field-nya, lalu tekan F4.','Sudah di dalam transaksi? Pakai /n atau /o di depan T-code supaya bisa pindah.','Kejar ★★★ di simulator bab, EXP-nya jadi penuh!','Setiap 5 EXP bisa jadi 1 koin. Tukar di menu EXP & Reward, ya.'],
       awe:['Tenang, role bisa diganti kapan saja. Progresmu tetap aman.','Pelan-pelan saja. Satu bab selesai tetap satu langkah maju.','Kalau muncul warning kuning, baca dulu pesannya, baru tekan Enter.','Semua data di sini fiktif, jadi kamu bebas mencoba tanpa takut salah.']},
 reward:{cic:['Psst, kumpulkan EXP dulu, tukar jadi koin, lalu pilih reward favoritmu di sini!','Koinmu belum cukup? Kejar ★★★ di simulator, EXP-nya paling besar.','Reward kecil atau nabung buat yang besar? Bebas, kamu yang pilih!'],
         awe:['Tenang, setelah menukar, tunjukkan kode voucher ke admin JACIWEY. Kami yang proses.','Koin yang sudah ditukar tidak bisa dikembalikan, jadi pilih dengan mantap.','Status awal voucher: menunggu konfirmasi JACIWEY. Kami kabari setelahnya.']},
 declare:{awe:[]}};
const MIDX={};
const STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8l2.6 6.9 7.3.4-5.7 4.6 1.9 7.1L12 16.8l-6.1 4 1.9-7.1L2.1 9.1l7.3-.4z"/></svg>';
const sparks='<span class="spark s1">'+STAR+'</span><span class="spark s2">'+STAR+'</span><span class="spark s3">'+STAR+'</span>';
const masc=(w,x)=>`<button type="button" class="masc masc-${w}" data-masc="${w}" data-def="${x}" aria-label="${MNAME[w]}. Klik untuk menyapa"><img src="${MSRC[w][x]}" data-x="${x}" alt="" width="${MDIM[w][0]}" height="${MDIM[w][1]}" draggable="false"></button>`;
const bubble=(ctx,w,text)=>`<div class="bubble" data-bubble data-who="${w}"><b>${MNAME[w]}</b><span>${text||MLINES[ctx][w][0]}</span></div>`;
const stage=ctx=>`<div class="stage" data-ctx="${ctx}" data-auto>${bubble(ctx,'cic')}<div class="stage-duo">${sparks}${masc('cic','normal')}${masc('awe','tenang')}</div><p class="stage-hint">Klik Cicuuu atau Aweyy</p></div>`;
const duo=(ctx,head,w,text)=>`<div class="duo" data-ctx="${ctx}" data-auto>${masc('cic',ctx==='reward'?'senang':'pakar')}<div class="duo-mid">${head||''}${bubble(ctx,w||'cic',text)}</div>${masc('awe','tenang')}${sparks}</div>`;
function mascSet(b,x){const im=b.firstElementChild;if(!im||im.dataset.x===x)return;im.dataset.x=x;im.src=MSRC[b.dataset.masc][x];}
function mascSay(host,w){const L=MLINES[host.dataset.ctx]&&MLINES[host.dataset.ctx][w],bb=host.querySelector('[data-bubble]');if(!bb||!L||!L.length)return;
  const k=host.dataset.ctx+w;MIDX[k]=((MIDX[k]??(bb.dataset.who===w?0:-1))+1)%L.length;
  bb.dataset.who=w;bb.firstElementChild.textContent=MNAME[w];bb.lastElementChild.textContent=L[MIDX[k]];bb.classList.remove('pop');void bb.offsetWidth;bb.classList.add('pop');}
function mascCheer(b,ms){mascSet(b,'senang');b.classList.remove('hop');void b.offsetWidth;b.classList.add('hop');clearTimeout(b._t);b._t=setTimeout(()=>{b._t=0;mascSet(b,b.dataset.def);},ms||2400);}
document.addEventListener('click',e=>{const b=e.target.closest('.masc');if(!b)return;mascCheer(b);const h=b.closest('[data-ctx]');if(h){h._hold=Date.now()+20000;h.querySelector('[data-bubble]')?.setAttribute('aria-live','polite');mascSay(h,b.dataset.masc);}});
document.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse')return;const b=e.target.closest('.masc');if(b&&!b._t&&!b.contains(e.relatedTarget))mascSet(b,'kedip');});
document.addEventListener('pointerout',e=>{if(e.pointerType!=='mouse')return;const b=e.target.closest('.masc');if(b&&!b._t&&!b.contains(e.relatedTarget))mascSet(b,b.dataset.def);});
const MQ_RM=window.matchMedia('(prefers-reduced-motion:reduce)');
setInterval(()=>{if(MQ_RM.matches||document.hidden)return;const a=$$('.masc').filter(b=>!b._t&&!b.matches(':hover'));if(!a.length)return;const b=a[Math.floor(Math.random()*a.length)];mascSet(b,'kedip');setTimeout(()=>{if(!b._t&&!b.matches(':hover'))mascSet(b,b.dataset.def);},560);},3600);
setInterval(()=>{if(MQ_RM.matches||document.hidden)return;$$('[data-ctx][data-auto]').forEach(h=>{if((h._hold||0)>Date.now())return;const bb=h.querySelector('[data-bubble]');if(!bb)return;bb.setAttribute('aria-live','off');const w=bb.dataset.who==='cic'?'awe':'cic',b=h.querySelector('.masc-'+w);if(!b)return;mascSay(h,w);if(!b._t){mascSet(b,'senang');b._t=setTimeout(()=>{b._t=0;mascSet(b,b.dataset.def);},1500);}});},9000);

/* ===================== EXP, KOIN & REWARD =====================
   Semua EXP dihitung ulang dari progres (tidak bisa dobel).
   Maksimum total tepat 25.000 EXP bila semua modul, role, ujian, kartu, dan misi selesai sempurna. */
const EXP_MAX=25000, COIN_RATE=5, FREE_EXP=20;
const EXPW={read:5,cp:10,bsim:30,bcase:20,mx:60,rsim:50,rcase:40,rx:80,rdone:50};
const EXP_LABEL={read:'Membaca satu bab',cp:'Cek pemahaman bab benar di percobaan pertama',bsim:'Simulator bab (proporsional bintang, ★★★ penuh)',bcase:'Studi kasus bab (proporsional skor)',mx:'Ujian akhir modul (proporsional nilai terbaik)',rsim:'Simulator role (proporsional bintang)',rcase:'Studi kasus role (proporsional skor)',rx:'Ujian akhir role (proporsional nilai terbaik)',rdone:'Bonus role tuntas (semua modul inti & general dikuasai)'};
const REWARDS=[
 ['cl','Cover Letter',50,'Satu cover letter yang disesuaikan dengan lowongan tujuanmu.','doc','mail'],
 ['lb','Banner LinkedIn',100,'Desain banner profil LinkedIn.','doc','banner'],
 ['cv','1 CV gratis',150,'Satu CV ATS-friendly.','doc','cv'],
 ['lr','Rebranding LinkedIn',350,'Siap rework LinkedIn kamu untuk tampil lebih menarik.','doc','rebrand'],
 ['pm','PPT make over',500,'Merapikan desain presentasi yang sudah kamu punya.','ppt','pptfix','Maks. 10 slide'],
 ['pt','PPT Personal',1000,'PPT untuk tugas/project/sidang kamu.','ppt','ppt','Maks. 15 slide'],
 ['pp','PPT Portfolio',1250,'Portfolio dalam bentuk PPT/PDF.','ppt','pptport'],
 ['pa','+ Panel Admin',1500,'Add-on panel admin buat website portfolio atau website custom dasarmu, tanpa coding sendiri.','web','admin'],
 ['pw','Portfolio Web',3000,'Portfolio dalam bentuk website (tanpa panel admin).','web','web'],
 ['wb','Web Custom Basic',3500,'Website fungsional yang disesuaikan dengan kebutuhan kamu.','web','webcode'],
 ['ps','Platform Belajar Psikotes',600,'Akses ke platform belajar Psikotes-nya JACIWEY.','pkt','psiko'],
 ['ck','Career Lite',750,'Paket Career-nya JACIWEY nih. Penasaran? Cek informasinya di Instagram jaciwey.studio.','pkt','case'],
 ['kt','Career Kit',3600,'Paket Career-nya JACIWEY nih. Penasaran? Cek informasinya di Instagram jaciwey.studio.','pkt','casek'],
 ['kp','Career Kit Plus',4000,'Paket Career-nya JACIWEY nih. Penasaran? Cek informasinya di Instagram jaciwey.studio.','pkt','rocket']];
const RWCAT=[['doc','Dokumen karier'],['ppt','Presentasi'],['web','Website'],['pkt','Belajar & paket Career']];
const RWICO={
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7.5 9 6 9-6"/>',
 banner:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="7.5" cy="12" r="2"/><path d="M12.5 10.5h6M12.5 13.5h4"/>',
 cv:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="10.5" cy="12" r="2"/><path d="M7.2 18c.5-1.8 1.7-2.7 3.3-2.7s2.8.9 3.3 2.7"/>',
 rebrand:'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c.8-3.6 3-5.5 6-5.5 1.5 0 2.8.5 3.8 1.3"/><path d="m18 10 1 2.7 2.7 1-2.7 1-1 2.7-1-2.7-2.7-1 2.7-1z"/>',
 pptfix:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/><path d="m12 6.8.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/>',
 ppt:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8M8 12.5V10M12 12.5V7.5M16 12.5v-3.5"/>',
 pptport:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/><rect x="8" y="8.5" width="8" height="4.5" rx="1"/><path d="M10.5 8.5v-1.2h3v1.2"/>',
 web:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M5.5 6.5h.01M8.5 6.5h.01"/><circle cx="8.5" cy="14.5" r="2"/><path d="M13.5 13h5M13.5 16h3.5"/>',
 webcode:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M5.5 6.5h.01M8.5 6.5h.01"/><path d="m10 12.5-2 2 2 2M14 12.5l2 2-2 2"/>',
 admin:'<path d="M4 7h9M19 7h1M4 12h2M12 12h8M4 17h8M18 17h2"/><circle cx="16" cy="7" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="15" cy="17" r="2.2"/>',
 psiko:'<circle cx="7" cy="7" r="3.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><path d="m7 13.5 3.8 6.5H3.2z"/><path d="M14 17h6.5M17.25 13.75v6.5"/>',
 case:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
 casek:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="m9 13.5 2.2 2.2 3.8-4"/>',
 rocket:'<path d="M12 15.5c-1.8-1.2-3.2-3.3-3.2-6.3 0-3 1.5-5.5 3.2-7.2 1.7 1.7 3.2 4.2 3.2 7.2 0 3-1.4 5.1-3.2 6.3z"/><circle cx="12" cy="8.5" r="1.5"/><path d="m8.9 11.5-2.9 3 .8 3.5 3-2.8M15.1 11.5l2.9 3-.8 3.5-3-2.8M12 18.5V22"/>'};
const COIN='<svg class="coin-i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#c98a00"/><circle cx="12" cy="11" r="10" fill="#f6c343"/><circle cx="12" cy="11" r="7.3" fill="none" stroke="#e0a81c" stroke-width="1.2"/><path d="M12 5.8l1.55 3.45 3.75.35-2.85 2.45.85 3.65L12 13.8l-3.3 1.9.85-3.65L6.7 9.6l3.75-.35z" fill="#fff"/></svg>';
let RW_JUST=null;
S.wallet=S.wallet||{conv:0,spent:0,red:[]};S.cardOk=S.cardOk||{};

let _EXPU=null;
function expUnits(){
  if(_EXPU)return _EXPU;const U=new Map();
  const add=(k,t,grp,f)=>{if(!U.has(k))U.set(k,{k,t,w:EXPW[t],grp,f,roles:new Set()});return U.get(k);};
  MODULES.forEach(m=>{m.lessons.forEach((l,i)=>{const b=BAB[m.id][i];
    add(`rd:${m.id}:${i}`,'read','mod:'+m.id,()=>(S.les[m.id]||0)>i?1:0);
    add(`cp:${m.id}:${i}`,'cp','mod:'+m.id,()=>S.cpf[m.id+':'+i]===1?1:0);
    add(`bs:${m.id}:${i}`,'bsim','mod:'+m.id,()=>Math.max(0,...b.sims.map(simStars),b.app?simStars(b.app):0)/3);
    add(`bc:${m.id}:${i}`,'bcase','mod:'+m.id,()=>Math.min(1,(S.cases[b.case.id]||0)/b.case.steps.length));});
   add('mx:'+m.id,'mx','mod:'+m.id,()=>Math.min(100,S.mq[m.id]||0)/100);});
  ROLES.forEach(r=>{
    roleSims(r).forEach(id=>add('rs:'+id,'rsim','role',()=>simStars(id)/3).roles.add(r.id));
    roleCases(r).forEach(c=>add('rc:'+c.id,'rcase','role',()=>Math.min(1,(S.cases[c.id]||0)/c.steps.length)).roles.add(r.id));
    add('rx:'+r.id,'rx','role',()=>Math.min(100,(S.quiz.r||{})[r.id]||0)/100).roles.add(r.id);
    add('rt:'+r.id,'rdone','role',()=>roleCore(r).every(id=>mastery(MOD[id]).done)?1:0).roles.add(r.id);});
  const L=[...U.values()];
  const pool=EXP_MAX-2*ALLCARDS.length-FREE_EXP*MISSIONS.length;
  const W=L.reduce((a,u)=>a+u.w,0);
  L.forEach(u=>{const x=u.w*pool/W;u.max=Math.floor(x);u.fr=x-u.max;});
  let left=pool-L.reduce((a,u)=>a+u.max,0);
  [...L].sort((a,b)=>b.fr-a.fr).slice(0,left).forEach(u=>u.max++);
  _EXPU={list:L,pool,k:pool/W};return _EXPU;
}
const uEarn=u=>Math.floor(u.max*Math.max(0,Math.min(1,u.f()))+1e-9);
function expState(){
  S.wallet=S.wallet||{conv:0,spent:0,red:[]};S.cardOk=S.cardOk||{};
  const {list}=expUnits();const o={mod:0,modMax:0,role:0,roleMax:0};
  list.forEach(u=>{const e=uEarn(u);if(u.grp==='role'){o.role+=e;o.roleMax+=u.max;}else{o.mod+=e;o.modMax+=u.max;}});
  o.cardH=ALLCARDS.filter(c=>S.cards[c[0]]).length;o.cardO=ALLCARDS.filter(c=>S.cards[c[0]]&&S.cardOk[c[0]]).length;o.cardMax=2*ALLCARDS.length;
  const F=(S.sandbox&&S.sandbox.flags)||{};o.free=MISSIONS.filter(m=>F[m[0]]).length*FREE_EXP;o.freeMax=MISSIONS.length*FREE_EXP;
  o.total=o.mod+o.role+o.cardH+o.cardO+o.free;o.max=o.modMax+o.roleMax+o.cardMax+o.freeMax;
  o.avail=Math.max(0,o.total-S.wallet.conv);o.coins=Math.floor(S.wallet.conv/COIN_RATE)-S.wallet.spent;
  return o;
}
function roleExp(r){const {list}=expUnits();const P=rolePath(r);let max=0,got=0,own=0;
  list.forEach(u=>{const inR=u.grp==='role'?u.roles.has(r.id):P.includes(u.grp.slice(4));if(!inR)return;max+=u.max;got+=uEarn(u);if(u.grp==='role')own+=u.max;});
  return {max,got,own,mods:max-own};}
function modExp(id){const {list}=expUnits();let max=0,got=0;list.forEach(u=>{if(u.grp==='mod:'+id){max+=u.max;got+=uEarn(u);}});return {max,got};}
const fmtN=n=>Number(n).toLocaleString('id-ID');
function expPill(){const e=expState();return `<span class="part" title="EXP">${fmtN(e.total)} XP</span>`;}

function renderReward(){
  const e=expState();const {k}=expUnits();const r=roleOf();const W=S.wallet;
  const conv=Math.floor(e.avail/COIN_RATE)*COIN_RATE;const just=RW_JUST;RW_JUST=null;
  const row=(t,got,max)=>`<tr><td>${t}</td><td class="num">${fmtN(got)}</td><td class="num">${fmtN(max)}</td><td style="width:28%"><div class="bar"><i style="width:${max?Math.round(got/max*100):0}%"></i></div></td></tr>`;
  const rolesT=ROLES.map(x=>{const R=roleExp(x);return `<tr class="${r&&r.id===x.id?'hl':''}"><td>${esc(x.t)}${r&&r.id===x.id?' <span class="pill ac">jalurmu</span>':''}</td><td class="num">${fmtN(R.mods)}</td><td class="num">${fmtN(R.own)}</td><td class="num"><b>${fmtN(R.max)}</b></td><td class="num">${fmtN(R.got)}</td></tr>`;}).join('');
  $('#view').innerHTML=`<h1>EXP & Reward</h1>
  <p class="lead">EXP dihitung otomatis dari progresmu: bab, cek pemahaman, simulator, studi kasus, ujian, flashcard, dan Simulator bebas. Batas maksimal <b>${fmtN(EXP_MAX)} EXP</b> bila semua role dan semua uji selesai sempurna. Setiap <b>${COIN_RATE} EXP</b> bisa ditukar menjadi <b>1 koin</b> untuk reward dari JACIWEY.</p>
  <div class="wallet"><div><div class="k">EXP terkumpul</div><div class="v">${fmtN(e.total)}<small>/ ${fmtN(EXP_MAX)} EXP</small></div><div class="bar"><i style="width:${Math.min(100,e.total/EXP_MAX*100)}%"></i></div></div>
   <div><div class="k">Saldo koin</div><div class="v">${COIN}${fmtN(e.coins)}<small>koin</small></div><div class="k">${fmtN(e.avail)} EXP belum ditukar · ${fmtN(W.spent)} koin terpakai</div></div>
   <button class="btn" id="xpConv" ${conv?'':'disabled'}>Tukar ${fmtN(conv)} EXP → ${fmtN(conv/COIN_RATE)} koin</button></div>
  ${duo('reward','<h2>Tukar koin</h2>',just?'cic':null,just?'Yeay! Voucher kamu sudah jadi. Tunjukkan kodenya ke admin JACIWEY, ya.':null)}
  ${just?`<div class="shop-ok" role="status"><span>Voucher <code>${just.code}</code> untuk <b>${esc(just.t)}</b> berhasil dibuat. Tunjukkan kode ini ke admin JACIWEY.</span></div>`:''}
  <p class="shop-note">Penukaran membuat kode voucher. Tunjukkan kodenya ke admin JACIWEY untuk diproses; status awalnya <i>Menunggu konfirmasi JACIWEY</i>. Koin yang sudah ditukar tidak bisa dikembalikan.</p>
  ${RWCAT.map(([c,t])=>{const L=REWARDS.filter(x=>x[4]===c).sort((p,q)=>p[2]-q[2]);return `<h3 class="shop-cat">${t} <span>${L.length} reward</span></h3><div class="rw-grid">${L.map(x=>{const can=e.coins>=x[2];return `<article class="rw ${can?'can':''}"><div class="rw-top"><span class="rw-ic ${c==='ppt'||c==='pkt'?'lav':''}">${svg(RWICO[x[5]])}</span><span class="coin">${COIN}${fmtN(x[2])} <small>koin</small></span></div><b>${esc(x[1])}</b>${x[6]?`<span class="pill rw-lim">${x[6]}</span>`:''}<p>${esc(x[3])}</p>${can?'':`<div class="rw-need"><div class="bar"><i style="width:${Math.max(0,Math.min(100,e.coins/x[2]*100))}%"></i></div>Kurang ${fmtN(x[2]-e.coins)} koin lagi</div>`}<button class="btn sm ${can?'':'ghost'}" data-rw="${x[0]}" ${can?'':'disabled'}>${can?'Tukar sekarang':'Koin belum cukup'}</button></article>`;}).join('')}</div>`;}).join('')}
  ${W.red.length?`<h2>Voucher saya</h2><div class="tbl-wrap"><table><tr><th>Kode voucher</th><th>Reward</th><th class="num">Koin</th><th>Tanggal</th><th>Status</th></tr>${W.red.map(v=>`<tr><td><code>${v.code}</code></td><td>${esc(v.t)}</td><td class="num">${fmtN(v.cost)}</td><td>${fmtD(v.at)}</td><td><span class="pill">${esc(v.st)}</span></td></tr>`).join('')}</table></div>`:''}
  <h2>Rincian EXP</h2><div class="tbl-wrap"><table><tr><th>Sumber</th><th class="num">Diperoleh</th><th class="num">Maks.</th><th></th></tr>
   ${row(`Modul (${MODULES.length} modul: bab, cek pemahaman, simulator & studi kasus bab, ujian modul)`,e.mod,e.modMax)}${row('Praktik & ujian khusus role (simulator, studi kasus, ujian role, bonus tuntas)',e.role,e.roleMax)}
   ${row(`Flashcard ditandai hafal (1 EXP per kartu, ${ALLCARDS.length} kartu)`,e.cardH,ALLCARDS.length)}${row('Flashcard hafal yang lulus uji (+1 EXP per kartu)',e.cardO,ALLCARDS.length)}${row(`Misi Simulator bebas (${FREE_EXP} EXP per misi)`,e.free,e.freeMax)}
   <tr><td><b>Total</b></td><td class="num"><b>${fmtN(e.total)}</b></td><td class="num"><b>${fmtN(e.max)}</b></td><td></td></tr></table></div>
  <h2>Nilai setiap aktivitas</h2><div class="tbl-wrap"><table><tr><th>Aktivitas</th><th class="num">EXP penuh</th></tr>${Object.keys(EXPW).map(t=>`<tr><td>${EXP_LABEL[t]}</td><td class="num">± ${fmtN(Math.round(EXPW[t]*k))}</td></tr>`).join('')}
   <tr><td>Flashcard: tandai hafal / lulus uji kartu hafal</td><td class="num">1 + 1</td></tr><tr><td>Satu misi Simulator bebas</td><td class="num">${FREE_EXP}</td></tr></table></div>
  <h2>EXP per role</h2><p class="muted" style="font-size:14px">Modul yang sama dipakai banyak role, jadi EXP modul hanya dihitung sekali. Angka di bawah adalah EXP yang bisa kamu kumpulkan dengan menuntaskan satu role secara sempurna.</p>
  <div class="tbl-wrap"><table><tr><th>Role</th><th class="num">Dari modul jalur</th><th class="num">Khusus role</th><th class="num">Total role</th><th class="num">Diperoleh</th></tr>${rolesT}</table></div>`;
  $('#xpConv')&&($('#xpConv').onclick=()=>{const c=Math.floor(expState().avail/COIN_RATE)*COIN_RATE;if(!c)return;W.conv+=c;save();renderReward();renderNav('reward');});
  $$('[data-rw]').forEach(b=>b.onclick=()=>{const x=REWARDS.find(y=>y[0]===b.dataset.rw);if(expState().coins<x[2])return;
    if(b.dataset.ok!=='1'){b.dataset.ok='1';b.textContent=`Yakin tukar ${fmtN(x[2])} koin?`;b.classList.add('warnbtn');return;}
    const code='JCW-'+Date.now().toString(36).slice(-4).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase();
    W.spent+=x[2];W.red.unshift({code,id:x[0],t:x[1]+(x[6]?' ('+x[6].toLowerCase()+')':''),cost:x[2],at:Date.now(),st:'Menunggu konfirmasi JACIWEY'});save();RW_JUST={code,t:x[1]};renderReward();renderNav('reward');$$('.duo .masc').forEach(m=>mascCheer(m,3200));$('.duo').scrollIntoView({block:'start',behavior:'smooth'});});
}
/* ===================== MASTERY & PROGRESS ===================== */
function simStars(id){const r=S.sims[id];return typeof r==='number'?r:(r?1:0);}
function babState(mid,i){const b=BAB[mid][i];return {sim:b.sims.some(id=>simStars(id)>0)||(!!b.app&&simStars(b.app)>0),kasus:S.cases[b.case.id]!=null,b};}
function mastery(m){
  const L=m.lessons.length, les=Math.min(S.les[m.id]||0,L), q=S.mq[m.id]||0;
  const bs=m.lessons.map((_,i)=>babState(m.id,i)); const simB=bs.filter(x=>x.sim).length, caseB=bs.filter(x=>x.kasus).length;
  const pct=Math.round(les/L*40+simB/L*15+caseB/L*15+(q>=80?30:q/80*15));
  return {L,les,q,qok:q>=80,simB,caseB,done:les>=L&&q>=80,pct,ex:attOf('mx:'+m.id)};
}
function roleCore(r){return [...new Set([...r.g.filter(x=>x==='nav'||x==='org'),...r.w,...r.g])];}
function progress(){
  const r=roleOf(); const core=r?roleCore(r):ORDER.slice();
  const ms=core.map(id=>mastery(MOD[id])); const done=ms.filter(x=>x.done).length;
  const pct=Math.round(ms.reduce((a,x)=>a+x.pct,0)/ms.length);
  const all=MODULES.filter(m=>mastery(m).done).length;
  const s=SIMS.filter(x=>simStars(x.id)>0).length+Object.keys(APPPRAC).filter(id=>simStars(id)>0).length, c=Object.keys(S.cases).length, k=Object.values(S.cards).filter(Boolean).length;
  const q=r?((S.quiz.r||{})[r.id]||0):(S.quiz.best||0);
  return {core:core.length,done,pct,all,s,c,k,q,r};
}
const shortT=m=>m.title.includes(' – ')?m.title.split(' – ').slice(1).join(' – '):m.title;
const catName=id=>(CATS.find(c=>c.id===id)||{}).t||'';
const durMin=ids=>ids.reduce((a,id)=>a+(parseInt(MOD[id].dur)||0),0);
const fmtD=t=>t?new Date(t).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}):'–';
const sc=v=>v==null?'–':v+'%';
function rolesFor(mid,k){return ROLES.filter(r=>r[k].includes(mid));}
function nextIn(ids){return ids.map(id=>MOD[id]).find(m=>!mastery(m).done);}

/* ===================== NAV & ROUTER ===================== */
const svg=d=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const NICO={
 home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
 route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 monitor:'<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
 case:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>',
 exam:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
 cards:'<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
 book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
 term:'<rect x="2" y="3" width="20" height="18" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 13.5-1.5 8.5 5-3 5 3-1.5-8.5"/>',
 chart:'<path d="M3 3v18h18"/><path d="M8 17v-4M13 17V8M18 17v-6"/>',
 doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 shield:'<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="M12 8v5M12 16v.5"/>'};
const ni=k=>svg(NICO[k]);
function renderNav(cur){
  const r=roleOf(), p=progress();
  const it=(h,t,n,badge)=>`<a href="#${h}" class="${cur===h?'on':''}"><span class="num">${n}</span><span>${t}</span>${badge||''}</a>`;
  const mb=m=>{const M=mastery(m);return M.done?`<span class="done" title="Dikuasai">${ni('check')}</span>`:(M.les?`<span class="part">${M.les}/${M.L}</span>`:'');};
  const mi=(id,k)=>{const m=MOD[id];return `<a href="#modul-${id}" class="${cur==='modul-'+id?'on':''}" title="${REL[k][0]}"><span class="rdot ${k==='a'?'p':k}"></span><span class="num code">${m.code}</span><span>${esc(shortT(m))}</span>${mb(m)}</a>`;};
  let h='<div class="nav-group">Mulai</div>'+it('beranda','Beranda',ni('home'))+it('jalur','Jalur saya',ni('route'),r?`<span class="part">${p.done}/${p.core}</span>`:'')+it('role',r?'Ganti role':'Pilih role',ni('user'))+it('modul','Katalog modul',ni('grid'),`<span class="part">${MODULES.length}</span>`);
  if(r) h+=`<div class="nav-group">Modul jalurmu</div>`+rolePath(r).map(id=>mi(id,relOf(id,r))).join('');
  else h+=`<div class="nav-group">Modul</div><a href="#role"><span class="num">${ni('info')}</span><span>Pilih role agar modulmu tampil di sini</span></a>`;
  const adds=S.addons.filter(id=>!r||!relOf(id,r));if(adds.length)h+=`<div class="nav-group">Add-on</div>`+adds.map(id=>mi(id,'a')).join('');
  if(cur.startsWith('modul-')&&!relOrAdd(cur.slice(6))){const m=MOD[cur.slice(6)];if(m)h+=`<div class="nav-group">Sedang dibuka</div><a href="#${cur}" class="on"><span class="num code">${m.code}</span><span>${esc(shortT(m))}</span>${mb(m)}</a>`;}
  h+='<div class="nav-group">Praktik</div>'+it('simulator','Simulator SAP GUI',ni('monitor'))+it('studi-kasus','Studi Kasus',ni('case'))+
     '<div class="nav-group">Uji & hafalan</div>'+it('kuis','Ujian',ni('exam'))+it('flashcard','Flashcard',ni('cards'))+it('glosarium','Glosarium',ni('book'))+it('simulator-bebas','Simulator bebas',ni('term'))+
     '<div class="nav-group">Hasil & referensi</div>'+it('reward','EXP & Reward',ni('award'),expPill())+it('report','Report nilai',ni('chart'))+it('referensi','Cheat sheet',ni('doc'));
  $('#nav').innerHTML=h;
  $('#sideProg').innerHTML=`<b>${r?'Jalur '+esc(r.t):'Progres belajar'}</b> <span style="float:right" class="mono">${p.pct}%</span><div class="bar"><i style="width:${p.pct}%"></i></div><div style="margin-top:6px;color:var(--muted);font-size:12px">${r?`${p.done}/${p.core} modul kompetensi dikuasai`:`${p.all}/${MODULES.length} modul dikuasai`} · ${p.s} latihan · ${p.c} kasus</div>`;
  const br=$('#brandRole'); if(br) br.textContent='JACIWEY · '+(r?r.t:'Semua role & modul');
}
let MODV=null, JV='komp';
function route(){
  const h=(location.hash||'#beranda').slice(1);
  if(h!=='simulator') SIM=null;
  window.scrollTo(0,0);
  let nav=h;
  if(h.startsWith('modul-')){const k=h.slice(6);const m=MOD[k]||(LEG_MAP[k]&&MOD[LEG_MAP[k][0]]);if(!m){location.hash='modul';return;}if(m.id!==k){history.replaceState(null,'','#modul-'+m.id);}renderModule(m.id);nav='modul-'+m.id;}
  else if(h.startsWith('role-')){if(!ROLES.find(r=>r.id===h.slice(5))){location.hash='role';return;}renderRoleDetail(h.slice(5));nav='role';}
  else if(h==='role') renderRoles();
  else if(h==='jalur'){if(!roleOf()){location.hash='role';return;}renderPath();}
  else if(h==='modul') renderCatalog();
  else if(h==='simulator'){ if(!SIM) renderSimHome(); else if(SIM.free) nav='simulator-bebas'; }
  else if(h==='simulator-bebas'){ startFree(); return; }
  else if(h==='reward') renderReward();
  else if(h==='kuis') renderQuizHome();
  else if(h==='flashcard') renderCards($('#view'));
  else if(h==='glosarium') renderGloss($('#view'));
  else if(h==='studi-kasus') renderCaseHome();
  else if(h==='report') renderReport();
  else if(h==='referensi') renderRef();
  else {renderHome();nav='beranda';}
  renderNav(nav); renderCrumb(nav);
  if(!SIM){const v=$('#view');v.classList.remove('enter');void v.offsetWidth;v.classList.add('enter');}
  $('#side').classList.remove('open');
}
window.addEventListener('hashchange',route);
function go(h){if(location.hash==='#'+h)route();else location.hash=h;}
function renderCrumb(h){const el=$('#crumb');if(!el)return;const L={'simulator-bebas':'Simulator bebas',reward:'EXP & Reward',simulator:'Simulator SAP GUI','studi-kasus':'Studi Kasus',kuis:'Ujian',flashcard:'Flashcard',glosarium:'Glosarium',report:'Report nilai',referensi:'Cheat sheet',role:'Pilih role',jalur:'Jalur saya',modul:'Katalog modul'};
  const parts=[];const hh=(location.hash||'').slice(1);
  if(h.startsWith('modul-')){const m=MOD[h.slice(6)];parts.push(['modul','Katalog modul'],[null,m?`${m.code} · ${shortT(m)}`:'Modul']);}
  else if(hh.startsWith('role-')){const r=ROLES.find(x=>x.id===hh.slice(5));parts.push(['role','Pilih role'],[null,r?r.t:'']);}
  else parts.push([null,L[h]||'Beranda']);
  el.innerHTML=`<a href="#beranda">Akademi SAP</a>`+parts.map(([k,t])=>`<span class="sep">›</span>${k?`<a href="#${k}">${esc(t)}</a>`:`<span class="cur">${esc(t)}</span>`}`).join('');}

/* ===================== SHARED PIECES ===================== */
function mchips(M){return `<div class="mchips"><span class="pill ${M.les>=M.L?'ok':M.les?'ac':''}">Bab ${M.les}/${M.L}</span><span class="pill ${M.simB>=M.L?'ok':M.simB?'ac':''}">Simulator ${M.simB}/${M.L}</span><span class="pill ${M.caseB>=M.L?'ok':M.caseB?'ac':''}">Kasus ${M.caseB}/${M.L}</span><span class="pill ${M.qok?'ok':M.q?'warn':''}">Ujian ${M.q?M.q+'%':'–'}</span></div>`;}
function relRow(id){const m=MOD[id],M=mastery(m);return `<a class="relrow" href="#modul-${id}"><span class="c">${m.code}</span><b>${esc(shortT(m))}</b><span class="st ${M.done?'ok':''}">${M.done?'✓ Dikuasai':(M.les||M.q)?M.pct+'%':m.dur}</span></a>`;}
function relCols(r){return `<div class="relcols">${['w','g','p'].map(k=>{const ids=r[k];const d=ids.filter(id=>mastery(MOD[id]).done).length;return `<div class="relcol"><h3>${REL[k][0]} <span style="font-size:13px;color:var(--meta);font-weight:400">${d}/${ids.length}</span></h3><p>${REL[k][2]}</p>${ids.map(relRow).join('')}</div>`;}).join('')}</div>`;}
function roleCard(r){return `<a class="rolecard ${S.role===r.id?'on':''}" href="#role-${r.id}"><span class="row" style="justify-content:space-between"><b>${esc(r.t)}</b>${S.role===r.id?'<span class="pill ok">Jalurmu</span>':''}</span><small>${esc(r.d)}</small><span class="cnt"><span class="pill rel-w">${r.w.length} inti</span><span class="pill rel-g">${r.g.length} general</span><span class="pill rel-p">${r.p.length} pendukung</span></span></a>`;}
function modCard(m){const M=mastery(m),k=relOrAdd(m.id);return `<a class="card modcard" href="#modul-${m.id}"><div class="top"><span class="code">${m.code} · ${m.dur}</span><span class="row" style="gap:4px">${relPill(k)}${M.done?'<span class="pill ok">Dikuasai</span>':''}</span></div><h3>${esc(shortT(m))}</h3><p>${m.sum}</p>${mchips(M)}<div class="bar"><i style="width:${M.pct}%"></i></div><div class="tcs">${m.tcs.slice(0,5).map(c=>/\s/.test(c)?'':tc(c)).join('')}</div></a>`;}
function caseCard(c){const s=S.cases[c.id];return `<button class="scen" data-case="${c.id}"><span class="row"><span class="pill">${c.kind==='bab'?'Studi kasus bab':c.kind==='role'&&c.role?'Studi kasus role':c.mod?MOD[c.mod].code:'Role'}</span>${s!=null?`<span class="pill ok">Skor ${s}/${c.steps.length}</span>`:''}</span><b>${esc(c.title)}</b><small>${c.steps.length} keputusan</small></button>`;}
function appCard(id){const a=APPPRAC[id],st=simStars(id);return `<button class="scen" data-app="${id}"><span class="row"><span class="pill">Latihan alur & aplikasi</span>${st?`<span class="pill ok">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span>`:''}</span><b>${esc(a.title)}</b><small>${a.rows.length} aplikasi${a.flow?' · '+a.flow.length+' langkah alur':''}</small></button>`;}
function bindCases(root){$$('[data-case]',root||document).forEach(b=>b.onclick=()=>playCase(b.dataset.case));}
function bindAll(root){bindSimCards();bindCases(root);}

/* ===================== HOME ===================== */
function renderHome(){
  const r=roleOf(), p=progress();
  const howto=`<h2>Panduan belajar</h2><div class="guide">${[
    ['Pilih role','Platform menyaring kompetensi inti, general, dan pendukung sesuai arah karirmu. Role bisa diganti kapan saja tanpa kehilangan progres.'],
    ['Pelajari per bab','Baca materi, lalu jawab cek pemahaman. Jawaban benar di percobaan pertama memberi EXP, jadi baca dengan teliti.'],
    ['Praktik di setiap bab','Kerjakan simulator bab sampai ★★★ dan studi kasus bab. Simulator menolak isian yang salah seperti SAP asli dan menjelaskan artinya.'],
    ['Ujian akhir modul','Modul dianggap dikuasai setelah semua bab selesai dan nilai ujian akhir ≥ 80%. Kamu boleh mengulang; nilai pertama dan tertinggi tercatat di Report.'],
    ['Tuntaskan jalur role','Selesaikan simulator role ("Satu hari kerja"), studi kasus role, dan ujian akhir role di menu Jalur saya.'],
    ['Hafalkan & eksplorasi','Tandai T-code yang sudah hafal di Flashcard lalu uji. Pakai Simulator bebas untuk mencoba alur PR → release → PO → GR dengan nomor dokumenmu sendiri.'],
    ['Kumpulkan EXP',`Semua aktivitas memberi EXP (maks. ${fmtN(EXP_MAX)}). Tukar ${COIN_RATE} EXP = 1 koin, lalu tukarkan koin dengan reward JACIWEY di menu EXP & Reward.`]
  ].map((g,i)=>`<div class="g-step"><span class="g-n">${i+1}</span><b>${g[0]}</b><p>${g[1]}</p></div>`).join('')}</div>`;
  const note=`<div class="declare" data-ctx="declare">${masc('awe','tenang')}<div><b>Deklarasi materi</b><p>Materi, contoh, dan simulator di Akademi SAP JACIWEY disusun sebagai <b>panduan umum</b> berdasarkan alur proses dan transaksi standar SAP (SAP ECC dan SAP S/4HANA) serta praktik kerja yang lazim di perusahaan. Setiap perusahaan mengonfigurasi SAP sesuai kebutuhannya, sehingga jenis dokumen, rentang nomor, movement type khusus (kode Z), strategi approval, nama field, tampilan menu, hak akses, hingga T-code custom <b>bisa berbeda</b> dengan yang kamu temui di sini.</p><p>Semua nama perusahaan, vendor, material, karyawan, dan nomor dokumen bersifat fiktif. Sebelum bekerja di sistem produktif, ikuti SOP, user manual, dan arahan key user atau tim IT di perusahaanmu, dan jangan memakai user, password, atau data asli kantor di platform latihan ini.</p></div></div>`;
  if(!r){
    $('#view').innerHTML=`<div class="hero"><div><h1>Belajar SAP <em>sesuai arah karirmu</em></h1>
      <p class="lead">${MODULES.length} modul dari Finance, Logistik, HR, Teknis, sampai solusi cloud. Pilih role, lalu platform menyusun <b>kompetensi inti</b> dan <b>kompetensi general</b> yang perlu kamu kuasai, supaya kamu tidak kewalahan.</p>
      <div class="row" style="margin-top:28px"><a class="btn pri" href="#role">Pilih arah karir</a><a class="btn ghost" href="#modul">Jelajahi per modul</a></div>
      <div class="facts"><span><b>${MODULES.reduce((a,m)=>a+m.lessons.length,0)}</b> bab</span><span><b>${ROLES.length}</b> role</span><span><b>${GLOSS.length}</b> entri glosarium</span><span><b>${fmtN(EXP_MAX)}</b> EXP untuk dikumpulkan</span></div></div>
      ${stage('home')}</div>
    <aside class="loop" aria-label="Siklus belajar setiap bab"><h3>Satu bab, satu siklus</h3><p>Setiap bab di setiap modul berjalan dengan urutan yang sama.</p>
       <ol><li><i>1</i><span><b>Materi</b><small>konsep, alur proses, T-code</small></span></li>
        <li><i>2</i><span><b>Cek pemahaman</b><small>benar di percobaan pertama = EXP</small></span></li>
        <li><i>3</i><span><b>Simulator SAP GUI</b><small>layar dan pesan seperti sistem asli</small></span><code>ME51N</code></li>
        <li><i>4</i><span><b>Studi kasus</b><small>keputusan di situasi kerja nyata</small></span></li>
        <li class="end"><i>${ni('check')}</i><span><b>Ujian akhir modul</b><small>nilai ≥ 80% = modul dikuasai</small></span></li></ol></aside>
    ${note}${howto}
    <h2>Pilih arah karirmu</h2><p class="muted" style="max-width:72ch">Klik role untuk melihat kompetensi inti, general, dan pendukungnya sebelum memilih. Kamu bisa ganti role kapan saja; progres modul tetap tersimpan.</p>
    ${RGRP.map(([g,t])=>`<h3 style="margin:20px 0 0;font-size:17px;font-weight:500">${t}</h3><div class="rolegrid">${ROLES.filter(x=>x.grp===g).map(roleCard).join('')}</div>`).join('')}`;return;}
  const core=roleCore(r), next=nextIn(core)||nextIn(rolePath(r));
  const cnt=k=>`${r[k].filter(id=>mastery(MOD[id]).done).length}/${r[k].length}`;
  $('#view').innerHTML=`<div class="hero"><div><h1>${p.done>=p.core?'Kompetensimu lengkap':'Lanjutkan jalurmu'}</h1>
    <p class="lead">${next?`Berikutnya: <b>${next.code} · ${esc(shortT(next))}</b>. ${next.sum}`:'Semua modul kompetensi sudah dikuasai. Ikuti ujian akhir role atau tambahkan modul add-on.'}</p>
    <div class="row" style="margin-top:20px">${next?`<a class="btn pri" href="#modul-${next.id}">${mastery(next).les?'Lanjutkan':'Mulai'}: ${next.code}</a>`:`<a class="btn pri" href="#jalur">Buka ujian role</a>`}<a class="btn ghost" href="#jalur">Buka jalur saya</a></div></div>
    <div class="card"><div class="spread"><b style="font-size:18px">Progres kompetensi</b><span class="pill ${p.pct>=80?'ok':p.pct>=30?'warn':''}">${p.pct}%</span></div><div class="bar" style="height:10px;margin:10px 0 14px"><i style="width:${p.pct}%"></i></div>
      <div class="relmini"><div>${relPill('w')}<span>${cnt('w')} modul</span></div><div>${relPill('g')}<span>${cnt('g')} modul</span></div><div>${relPill('p')}<span>${cnt('p')} modul</span></div><div><span>Ujian akhir role terbaik</span><b style="color:var(--ink)">${p.q}%</b></div></div>
      <a class="xpline" href="#reward"><span>EXP jalur ini</span><b>${fmtN(roleExp(r).got)} / ${fmtN(roleExp(r).max)}</b><span class="muted">· total ${fmtN(expState().total)} EXP · ${fmtN(expState().coins)} koin</span></a></div></div>
  ${duo('home')}
  <h2>Kompetensi untuk ${esc(r.t)}</h2><p class="muted" style="max-width:72ch">${esc(r.d)} <a href="#role-${r.id}">Detail role</a> · <a href="#role">ganti role</a></p>
  ${relCols(r)}
  ${howto}
  <h2>Di luar jalurmu</h2><p class="muted" style="max-width:72ch">Modul lain bisa ditambahkan sebagai <b>add-on</b>. Kamu tetap mendapat materi, simulator dan studi kasus per bab, serta ujian akhir modulnya.</p>
  <div class="row"><a class="btn ghost" href="#modul">Buka katalog semua modul</a></div>${note}`;
}

/* ===================== ROLES ===================== */
function renderRoles(){
  const r=roleOf();
  $('#view').innerHTML=`<h1>${r?'Ganti role':'Pilih role'}</h1><p class="lead">Setiap role punya <b>kompetensi inti</b> (inti pekerjaan), <b>kompetensi general</b> (dipakai umum sehari-hari, termasuk dasar SAP), dan modul <b>pendukung</b>. Klik role untuk melihat detailnya.</p>
  ${r?`<div class="outpath" style="margin-top:14px">Jalurmu sekarang: <b>${esc(r.t)}</b>. Progres modul tetap tersimpan jika kamu berganti role. <button class="btn sm ghost" id="noRole">Belajar tanpa role</button></div>`:''}
  ${RGRP.map(([g,t])=>`<h2>${t}</h2><div class="rolegrid">${ROLES.filter(x=>x.grp===g).map(roleCard).join('')}</div>`).join('')}
  <p class="muted" style="margin-top:22px">Role kamu tidak ada? Pilih yang paling dekat, atau <a href="#modul">jelajahi katalog per modul</a>.</p>`;
  $('#noRole')&&($('#noRole').onclick=()=>{S.role=null;save();location.hash='modul';});
}
function renderRoleDetail(id){
  const r=ROLES.find(x=>x.id===id), mine=S.role===id, core=roleCore(r);
  $('#view').innerHTML=`<header class="pagehero">
   <div class="spread" style="align-items:flex-end"><h1>${esc(r.t)}</h1>${mine?'<span class="pill ok">Jalur aktifmu</span>':''}</div><div class="meta">Arah karir · ${RGRP.find(g=>g[0]===r.grp)[1]}</div><p class="lead">${esc(r.d)}</p>
   <div class="row" style="margin-top:14px">${mine?`<a class="btn pri" href="#jalur">Buka jalurku</a>`:`<button class="btn pri" id="pickRole">Jadikan jalur saya</button>`}<a class="btn ghost" href="#role">← Semua role</a></div></header>
  <div class="grid g3" style="margin-top:18px"><div class="stat"><b>${core.length} modul</b><span>kompetensi inti + general (± ${Math.round(durMin(core)/60*10)/10} jam materi)</span></div><div class="stat"><b>${roleSims(r).length} simulator · ${roleCases(r).length} kasus</b><span>praktik khusus role</span></div><div class="stat"><b>${GLOSS.filter(g=>g.mods.some(x=>rolePath(r).includes(x))).length} entri</b><span>glosarium & flashcard role</span></div></div>
  <h2>Tugas yang biasa dikerjakan</h2><ul>${r.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
  <h2>Kompetensi yang perlu kamu kuasai</h2>${relCols(r)}`;
  $('#pickRole')&&($('#pickRole').onclick=()=>{S.role=id;JV='komp';save();location.hash='jalur';});
}

/* ===================== JALUR SAYA (hub role) ===================== */
function renderPath(){
  const r=roleOf(), p=progress(), core=roleCore(r), next=nextIn(core)||nextIn(rolePath(r));
  const tabs=[['komp','Kompetensi'],['sim','Simulator role'],['kasus','Studi kasus role'],['glos','Glosarium'],['fc','Flashcard'],['ujian','Ujian akhir role']];
  const ex=attOf('rx:'+r.id);
  $('#view').innerHTML=`<header class="pagehero"><div class="spread" style="align-items:flex-end"><h1>${esc(r.t)}</h1><span class="pill">${p.pct}%</span></div>
   <p class="lead">${p.done}/${p.core} modul kompetensi (inti + general) dikuasai · ujian akhir role: pertama ${sc(ex.first)}, tertinggi ${sc(ex.best)}.</p>
   <div class="row" style="margin-top:14px">${next?`<a class="btn pri" href="#modul-${next.id}">${mastery(next).les?'Lanjutkan':'Mulai'}: ${next.code}</a>`:''}<a class="btn ghost" href="#role">Ganti role</a></div></header>
  <div class="chips" id="jvTabs" style="margin-top:18px">${tabs.map(([k,t])=>`<button class="chip ${JV===k?'on':''}" data-jv="${k}">${t}</button>`).join('')}</div><div id="jvBody"></div>`;
  $$('#jvTabs .chip').forEach(b=>b.onclick=()=>{JV=b.dataset.jv;$$('#jvTabs .chip').forEach(x=>x.classList.toggle('on',x===b));drawJV();});
  drawJV();
}
function pathRows(ids,k,start){const next=nextIn(roleCore(roleOf()));return `<div class="pathlist">${ids.map((id,i)=>{const m=MOD[id],M=mastery(m);return `<a href="#modul-${id}" class="${next&&next.id===id?'next':''}"><span class="n ${M.done?'ok':''}">${M.done?'✓':start+i}</span><span class="c">${m.code}</span><span class="t"><b>${esc(shortT(m))}</b><small>${m.dur} · Bab ${M.les}/${M.L} · Simulator ${M.simB}/${M.L} · Kasus ${M.caseB}/${M.L} · Ujian ${M.q?M.q+'%':'–'}</small></span><span class="r">${relPill(k)}</span></a>`;}).join('')}</div>`;}
function drawJV(){
  const r=roleOf(), el=$('#jvBody'); const f=r.g.filter(x=>x==='nav'||x==='org'), g=r.g.filter(x=>!f.includes(x)), adds=S.addons.filter(id=>!relOf(id,r));
  if(JV==='komp'){let n=1;const part=(t,d,ids,k)=>{if(!ids.length)return '';const h=`<h2>${t}</h2><p class="muted" style="max-width:72ch">${d}</p>${pathRows(ids,k,n)}`;n+=ids.length;return h;};
    el.innerHTML=part('1 · Dasar SAP','Fondasi navigasi dan data induk, bagian dari kompetensi general.',f,'g')+part('2 · Kompetensi inti',REL.w[2],r.w,'w')+part('3 · Kompetensi general',REL.g[2],g,'g')+part('4 · Pendukung (opsional)',REL.p[2],r.p,'p')+
      (adds.length?part('Add-on pilihanmu',REL.a[2],adds,'a'):`<p class="muted" style="margin-top:18px">Ingin belajar modul lain? Buka <a href="#modul">katalog</a> dan klik "Tambah sebagai add-on" di halaman modulnya.</p>`);}
  else if(JV==='sim'){el.innerHTML=`<p class="muted" style="max-width:72ch;margin-top:14px">Simulator role menggabungkan beberapa transaksi lintas modul seperti satu hari kerja ${esc(r.t)}, berbeda dengan simulator per bab di dalam modul.</p><div class="scen-list">${roleSims(r).map(id=>simCard(SIMS.find(x=>x.id===id))).join('')}</div>`;bindAll(el);}
  else if(JV==='kasus'){el.innerHTML=`<p class="muted" style="max-width:72ch;margin-top:14px">Studi kasus lintas modul untuk situasi nyata role ini. Studi kasus per bab ada di halaman masing-masing modul.</p><div class="scen-list">${roleCases(r).map(caseCard).join('')}</div>`;bindAll(el);}
  else if(JV==='glos') renderGloss(el,{embed:true,scope:'jalur'});
  else if(JV==='fc') renderCards(el,{embed:true});
  else if(JV==='ujian') drawRoleExam(el);
}
function drawRoleExam(el){
  const r=roleOf(), ex=attOf('rx:'+r.id), pool=roleExamPool(r);
  el.innerHTML=`<div class="card" style="margin-top:14px"><b style="font-size:18px">Ujian akhir role ${esc(r.t)}</b><p>20 soal acak dari ${roleCore(r).length} modul kompetensi inti dan general (${pool.length} soal di bank). Lulus ≥ 80%.</p>
   <div class="grid g3"><div class="stat"><b>${sc(ex.first)}</b><span>nilai percobaan pertama</span></div><div class="stat"><b>${sc(ex.best)}</b><span>nilai tertinggi</span></div><div class="stat"><b>${ex.n}×</b><span>percobaan · terakhir ${fmtD(ex.last&&ex.last.t)}</span></div></div>
   <div class="row" style="margin-top:12px"><button class="btn" id="rxGo">${ex.n?'Ulangi ujian':'Mulai ujian'}</button></div></div><div id="rxArea"></div>`;
  $('#rxGo').onclick=()=>{const qs=shuffle(pool).slice(0,20).map(q=>Object.assign(shufQ(q),{mod:q.mod}));runMC($('#rxArea'),qs,s=>{S.quiz.r=S.quiz.r||{};S.quiz.r[r.id]=Math.max(S.quiz.r[r.id]||0,s);logAtt('rx:'+r.id,s);renderNav('jalur');},true);$('#rxArea').scrollIntoView({behavior:'smooth'});};
}

/* ===================== CATALOG ===================== */
let CATV=null;
function renderCatalog(){
  const r=roleOf(); if(!CATV||(!r&&CATV.f==='jalur'))CATV={f:r?'jalur':'all',q:''};
  const draw=()=>{const q=CATV.q.toLowerCase();const hit=m=>!q||(m.code+' '+m.title+' '+m.sum+' '+m.tcs.join(' ')).toLowerCase().includes(q);
    let body='';
    if(CATV.f==='jalur'&&r){body=['w','g','p'].map(k=>{const ms=r[k].map(id=>MOD[id]).filter(hit);return ms.length?`<section class="catsec"><h2>${REL[k][0]}</h2><p>${REL[k][2]}</p><div class="grid g3">${ms.map(modCard).join('')}</div></section>`:'';}).join('');
      const ad=S.addons.filter(id=>!relOf(id,r)).map(id=>MOD[id]).filter(hit);if(ad.length)body+=`<section class="catsec"><h2>Add-on</h2><p>${REL.a[2]}</p><div class="grid g3">${ad.map(modCard).join('')}</div></section>`;}
    else body=CATS.map(c=>{const ms=MODULES.filter(m=>m.cat===c.id&&hit(m));return ms.length?`<section class="catsec"><h2>${c.t} <span style="font-size:15px;color:var(--meta);font-weight:400">${ms.length} modul</span></h2><p>${c.d}</p><div class="grid g3">${ms.map(modCard).join('')}</div></section>`:'';}).join('');
    $('#catBody').innerHTML=body||'<p class="muted" style="margin-top:18px">Tidak ada modul yang cocok.</p>';};
  $('#view').innerHTML=`<h1>Katalog modul SAP</h1><p class="lead">${MODULES.length} modul dalam ${CATS.length} kelompok. Setiap bab berisi materi, cek pemahaman, simulator bab, dan studi kasus bab. Setiap modul ditutup dengan ujian akhir.</p>
  ${r?'':`<div class="outpath" style="margin-top:14px">Belum memilih role. <a href="#role">Pilih arah karir</a> agar katalog menandai kompetensi inti, general, dan pendukung untukmu.</div>`}
  <div class="chips" id="catF">${r?`<button class="chip ${CATV.f==='jalur'?'on':''}" data-f="jalur">Jalur ${esc(r.t)}</button>`:''}<button class="chip ${CATV.f==='all'?'on':''}" data-f="all">Semua modul (${MODULES.length})</button></div>
  <div class="filt"><input id="catQ" placeholder="Cari modul atau T-code, misal MIGO, FB60, payroll" value="${esc(CATV.q)}" aria-label="Cari modul" style="min-width:300px"></div>
  <div id="catBody"></div>`;
  $$('#catF .chip').forEach(b=>b.onclick=()=>{CATV.f=b.dataset.f;$$('#catF .chip').forEach(x=>x.classList.toggle('on',x===b));draw();});
  $('#catQ').oninput=e=>{CATV.q=e.target.value;draw();};
  draw();
}

/* ===================== MODULE: bab → materi, simulator bab, studi kasus bab → ujian akhir ===================== */
function renderModule(id){
  const m=MOD[id];
  if(!MODV||MODV.id!==m.id){const M=mastery(m);MODV={id:m.id,view:M.les>=M.L?'exam':'l'+Math.min(M.les,M.L-1)};}
  drawModule(m);
}
function modSeq(m){const r=roleOf();return r&&relOf(m.id,r)?rolePath(r):ORDER;}
function drawModule(m){
  const M=mastery(m); const v=MODV.view; const r=roleOf(), k=relOrAdd(m.id);
  const seq=modSeq(m), ix=seq.indexOf(m.id); const prev=MOD[seq[ix-1]], next=MOD[seq[ix+1]];
  const lockX=M.les<M.L;
  const toc=m.lessons.map((l,i)=>{const st=i<M.les?'ok':i===M.les?'cur':'lock';const B=babState(m.id,i);const pd=(B.sim?1:0)+(B.kasus?1:0);
    return `<button data-lv="l${i}" class="${v==='l'+i?'on':''}" ${i>M.les?'disabled':''}><span class="st ${st}">${st==='ok'?'✓':''}</span><span>Bab ${i+1}. ${esc(l.t)}</span></button>
    <button data-lv="p${i}" class="sub ${v==='p'+i?'on':''}" ${i>=M.les?'disabled':''}><span class="st ${pd===2?'ok':i<M.les?'cur':'lock'}">${pd===2?'✓':''}</span><span>Simulator & studi kasus bab ${i+1} <small>(${pd}/2)</small></span></button>`;}).join('')+
   `<div class="lt-h">Penutup modul</div><button data-lv="exam" class="${v==='exam'?'on':''}" ${lockX?'disabled':''}><span class="st ${M.qok?'ok':lockX?'lock':'cur'}">${M.qok?'✓':''}</span><span>Ujian akhir modul${M.q?` (${M.q}%)`:''}</span></button>`+
   `<button data-lv="note" class="${v==='note'?'on':''}"><span class="st ${S.notes[m.id]?'ok':''}">${S.notes[m.id]?'✓':''}</span><span>Catatan saya</span></button>`;
  let body='';
  if(v[0]==='l'){
    const i=+v.slice(1), l=m.lessons[i];
    body=`<div class="lesson-h"><h2>Bab ${i+1}. ${esc(l.t)}</h2><span class="pill">Bab ${i+1} dari ${M.L}</span></div>
    ${i===0?`<div class="objs">${m.objs.map(o=>`<div>${esc(o)}</div>`).join('')}</div>`:''}
    <div class="prose">${l.html}</div>
    <div class="keypts"><b>Poin kunci</b><ul>${l.keys.map(k=>`<li>${esc(k)}</li>`).join('')}</ul></div>
    <div class="cp" id="cpBox"></div>`;
  } else if(v[0]==='p'){
    const i=+v.slice(1), B=BAB[m.id][i], st=babState(m.id,i);
    body=`<div class="lesson-h"><h2>Praktik bab ${i+1}: ${esc(m.lessons[i].t)}</h2><span class="pill ${st.sim&&st.kasus?'ok':''}">${(st.sim?1:0)+(st.kasus?1:0)}/2 selesai</span></div>
    <p class="muted">Latihan ini khusus untuk isi bab ${i+1}. Selesaikan keduanya sebelum lanjut ke bab berikutnya.</p>
    <h3 class="ph">1 · Simulator bab ${st.sim?'<span class="pill ok">Selesai</span>':''}</h3><div class="scen-list">${B.sims.map(id=>simCard(SIMS.find(x=>x.id===id))).join('')}${B.app?appCard(B.app):''}</div>
    <h3 class="ph">2 · Studi kasus bab ${st.kasus?'<span class="pill ok">Selesai</span>':''}</h3><div class="scen-list">${caseCard(B.case)}</div>
    <div class="row" style="margin-top:18px">${i<M.L-1?`<button class="btn sm" data-lv="l${i+1}" ${i+1>M.les?'disabled':''}>Lanjut ke bab ${i+2} →</button>`:`<button class="btn sm" data-lv="exam" ${lockX?'disabled':''}>Buka ujian akhir modul →</button>`}</div>`;
  } else if(v==='exam'){
    const ex=M.ex, pool=modExamPool(m);
    body=`<div class="lesson-h"><h2>Ujian akhir ${m.code}</h2><span class="pill ${M.qok?'ok':''}">Lulus ≥ 80%</span></div>
    <p>Ujian mencakup semua bab: soal konsep, cek pemahaman tiap bab, dan T-code. ${pool.length} soal, urutan dan opsi diacak.</p>
    <div class="grid g3"><div class="stat"><b>${sc(ex.first)}</b><span>nilai pertama</span></div><div class="stat"><b>${sc(ex.best!=null?ex.best:(M.q||null))}</b><span>nilai tertinggi</span></div><div class="stat"><b>${ex.n}×</b><span>percobaan · terakhir ${fmtD(ex.last&&ex.last.t)}</span></div></div>
    <div class="row" style="margin:12px 0"><button class="btn" id="mxGo">${ex.n?'Ulangi ujian':'Mulai ujian'}</button></div><div id="mq"></div>`;
  } else if(v==='note'){
    body=`<div class="lesson-h"><h2>Catatan saya</h2><span class="pill">Tersimpan di browser ini</span></div><p>${esc(m.note)}</p><textarea class="note" id="noteTa" placeholder="Tulis di sini…">${esc(S.notes[m.id]||'')}</textarea><p class="muted" style="font-size:13px" id="noteSt"></p>`;
  }
  const wl=rolesFor(m.id,'w'); const isAdd=S.addons.includes(m.id);
  let banner='';
  if(r&&!relOf(m.id,r)){const wd=r.w.filter(id=>mastery(MOD[id]).done).length;banner=`<div class="outpath">${isAdd?`Modul ini add-on di jalur <b>${esc(r.t)}</b>.`:`Modul ini di luar jalur <b>${esc(r.t)}</b>. ${wd>=r.w.length?'Kompetensi intimu sudah selesai, silakan eksplor.':`Kami sarankan selesaikan kompetensi inti dulu (${wd}/${r.w.length}).`}`} <button class="btn sm ghost" id="addOn">${isAdd?'Hapus dari add-on':'Tambah sebagai add-on'}</button></div>`;}
  else if(!r&&!isAdd){banner=`<div class="outpath">Belum memilih role. <button class="btn sm ghost" id="addOn">Tambah sebagai add-on</button> <a href="#role">Pilih role</a></div>`;}
  $('#view').innerHTML=`<header class="pagehero">
  <div class="spread" style="align-items:flex-end"><h1>${esc(m.title)}</h1><span class="row" style="gap:6px">${k?relPill(k):''}${M.done?'<span class="pill ok">Modul dikuasai</span>':''}</span></div>
  <div class="meta">${m.code} · ${catName(m.cat)} · ${m.dur}</div>
  <p class="lead">${m.sum}</p>
  <div class="row" style="margin-top:12px">${mchips(M)}<span class="muted" style="font-size:13px">${M.done?'Modul dikuasai.':'Syarat dikuasai: semua bab lulus cek pemahaman dan ujian akhir ≥ 80%.'}</span></div>
  ${wl.length?`<p style="margin:10px 0 0;font-size:13px">Kompetensi inti untuk: ${wl.map(x=>`<a href="#role-${x.id}">${esc(x.t)}</a>`).join(', ')}</p>`:''}</header>
  ${banner}
  <div class="mod-layout"><nav class="ltoc" aria-label="Daftar bab"><div class="lt-h">Bab</div>${toc}</nav><div class="lesson">${body}
  <div class="foot-nav">${prev?`<a class="btn ghost" href="#modul-${prev.id}">← ${prev.code}</a>`:'<span></span>'}${next?`<a class="btn ghost" href="#modul-${next.id}">${next.code}: ${esc(shortT(next))} →</a>`:`<a class="btn ghost" href="#${r?'jalur':'kuis'}">${r?'Jalur saya':'Ujian'} →</a>`}</div></div></div>`;
  $$('[data-lv]').forEach(b=>b.onclick=()=>{MODV.view=b.dataset.lv;drawModule(m);window.scrollTo({top:0});});
  $('#addOn')&&($('#addOn').onclick=()=>{S.addons=isAdd?S.addons.filter(x=>x!==m.id):[...S.addons,m.id];save();drawModule(m);renderNav('modul-'+m.id);});
  initWidgets($('#view'));
  bindAll($('#view'));
  if(matchMedia('(max-width:900px)').matches){const on=$('.ltoc .on');on&&on.scrollIntoView({block:'nearest',inline:'center'});}
  if(v[0]==='l') drawCheckpoint(m,+v.slice(1));
  if(v==='exam'){$('#mxGo').onclick=()=>{const qs=shuffle(modExamPool(m)).map(q=>shufQ(q));runMC($('#mq'),qs,s=>{S.mq[m.id]=Math.max(S.mq[m.id]||0,s);logAtt('mx:'+m.id,s);renderNav('modul-'+m.id);const rs=$('#mcRes');if(rs&&s>=80&&next)rs.insertAdjacentHTML('beforeend',`<div style="margin-top:8px"><a class="btn sm" href="#modul-${next.id}">Lanjut ke ${next.code} →</a></div>`);},true);};}
  if(v==='note'){const ta=$('#noteTa');let t;ta.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{S.notes[m.id]=ta.value;save();$('#noteSt').textContent='Tersimpan.';},400);};}
}
function drawCheckpoint(m,i){
  const M=mastery(m); const passed=i<M.les; const box=$('#cpBox'); const c=m.lessons[i].cp; const key=m.id+':'+i;
  const q=box._q||(box._q=shufQ(c));
  const nextBtn=`<button class="btn sm" id="cpNext">Lanjut ke simulator & studi kasus bab ${i+1} →</button>`;
  const goP=()=>{MODV.view='p'+i;drawModule(m);window.scrollTo({top:0});};
  if(passed&&!box._retry){box.innerHTML=`<div class="cp-h">Cek pemahaman ✓</div><p style="margin:0 0 10px">${esc(c.q)}</p><div class="exp"><b style="color:var(--ok)">Sudah lulus.</b> Jawaban: ${esc(c.o[c.a])}. ${esc(c.e)}</div><div class="row" style="margin-top:10px">${nextBtn}<button class="btn sm ghost" id="cpRetry">Coba jawab lagi</button></div>`;
    $('#cpNext').onclick=goP;$('#cpRetry').onclick=()=>{box._retry=true;box._q=shufQ(c);drawCheckpoint(m,i);};return;}
  box.innerHTML=`<div class="cp-h">Cek pemahaman</div><p style="margin:0 0 6px">${esc(q.q)}</p><p class="muted" style="font-size:13px;margin:0 0 6px">Jawab benar untuk membuka praktik bab ini dan bab berikutnya.</p>${q.o.map((o,j)=>`<button class="opt" data-j="${j}">${esc(o)}</button>`).join('')}<div id="cpFb"></div>`;
  $$('.opt',box).forEach(b=>b.onclick=()=>{
    const j=+b.dataset.j, ok=j===q.a;
    if(S.cpf[key]==null){S.cpf[key]=ok?1:0;save();}
    $$('.opt',box).forEach(x=>{x.disabled=true;});b.classList.add(ok?'right':'wrong');
    if(ok){S.les[m.id]=Math.max(S.les[m.id]||0,i+1);save();renderNav('modul-'+m.id);
      $('#cpFb').innerHTML=`<div class="exp"><b style="color:var(--ok)">Benar.</b> ${esc(q.e)}</div><div class="row" style="margin-top:10px">${nextBtn}</div>`;$('#cpNext').onclick=goP;
    } else {
      $('#cpFb').innerHTML=`<div class="exp"><b style="color:var(--bad)">Belum tepat.</b> Baca lagi bagian di atas, terutama poin kunci, lalu coba lagi. Urutan pilihan akan diacak.</div><button class="btn sm ghost" id="cpAgain" style="margin-top:10px">Coba lagi</button>`;
      $('#cpAgain').onclick=()=>{box._q=shufQ(c);drawCheckpoint(m,i);};}
  });
}

/* ===================== LATIHAN ALUR & APLIKASI (bab non-SAP GUI) ===================== */
function playApp(id){
  const a=APPPRAC[id], m=MOD[a.mod]; let tries=0;
  const opts=shuffle(a.rows.map(r=>r[1]));let order=a.flow?shuffle(a.flow.map(f=>f[0])):null;if(order&&order.join()===a.flow.map(f=>f[0]).join())order.reverse();
  const draw=(res)=>{
    $('#view').innerHTML=`<div class="spread"><div><h1 style="font-size:28px">${esc(a.title)}</h1><div class="meta">Simulator bab · ${m.code} · Bab ${a.bab+1}</div></div><button class="btn ghost sm" id="apBack">← Kembali ke modul</button></div>
    <p class="lead">Aplikasi ini tidak berjalan di SAP GUI, jadi latihannya mensimulasikan pekerjaan nyata: memilih aplikasi untuk tiap kebutuhan${a.flow?' dan menyusun urutan proses':''}.</p>
    <div class="card" style="margin-top:14px"><b>Tugas 1 · Cocokkan aplikasi dengan kebutuhannya</b>${a.rows.map((r,i)=>`<div class="chk" style="align-items:center"><span style="min-width:200px"><b>${esc(r[0])}</b></span><select data-i="${i}" aria-label="Fungsi ${esc(r[0])}" style="flex:1"><option value="">pilih fungsi</option>${opts.map(o=>`<option ${res&&res.sel[i]===o?'selected':''}>${esc(o)}</option>`).join('')}</select><span class="apr" style="width:80px">${res?(res.sel[i]===r[1]?'<span class="pill ok">Benar</span>':'<span class="pill bad">Salah</span>'):''}</span></div>`).join('')}</div>
    ${a.flow?`<div class="card" style="margin-top:14px"><b>Tugas 2 · Susun urutan proses</b><ol class="order-list">${order.map((t,i)=>`<li class="${res?(t===a.flow[i][0]?'right':'wrong'):''}"><span class="ix">${i+1}</span><span class="tx">${esc(t)}</span><button class="mv" data-u="${i}" aria-label="Naikkan" ${i===0?'disabled':''}>↑</button><button class="mv" data-d="${i}" aria-label="Turunkan" ${i===order.length-1?'disabled':''}>↓</button></li>`).join('')}</ol></div>`:''}
    <div class="row" style="margin-top:14px"><button class="btn" id="apChk">Periksa</button><span id="apRes">${res?res.msg:''}</span></div>`;
    const sel=()=>$$('select[data-i]').map(s=>s.value);
    $('#apBack').onclick=()=>{MODV={id:a.mod,view:'p'+a.bab};go('modul-'+a.mod);};
    $$('[data-u]').forEach(b=>b.onclick=()=>{const i=+b.dataset.u;const s=sel();[order[i-1],order[i]]=[order[i],order[i-1]];draw({sel:s,msg:'',keep:1});});
    $$('[data-d]').forEach(b=>b.onclick=()=>{const i=+b.dataset.d;const s=sel();[order[i+1],order[i]]=[order[i],order[i+1]];draw({sel:s,msg:'',keep:1});});
    if(res&&res.keep){$$('.apr').forEach(x=>x.innerHTML='');$$('.order-list li').forEach(x=>x.className='');}
    $('#apChk').onclick=()=>{tries++;const s=sel();const okA=a.rows.filter((r,i)=>s[i]===r[1]).length;const okF=a.flow?order.filter((t,i)=>t===a.flow[i][0]).length:0;const tot=a.rows.length+(a.flow?a.flow.length:0);const pct=Math.round((okA+okF)/tot*100);
      let msg;if(pct===100){const stars=tries===1?3:tries<=3?2:1;S.sims[id]=Math.max(simStars(id),stars);logAtt('sim:'+id,stars);save();renderNav('modul-'+a.mod);msg=`<span class="pill ok">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</span> Semua benar. <button class="btn sm" id="apDone">Kembali ke praktik bab</button>`;}
      else msg=`<span class="pill warn">${pct}% benar</span> Perbaiki yang salah lalu periksa lagi.`;
      draw({sel:s,msg});$('#apDone')&&($('#apDone').onclick=()=>{MODV={id:a.mod,view:'p'+a.bab};go('modul-'+a.mod);});};
  };
  location.hash!=='#simulator'&&history.replaceState(null,'',location.hash);
  draw();window.scrollTo(0,0);
}

/* ===================== STUDI KASUS ===================== */
function renderCaseHome(){
  const r=roleOf();
  const mods=MODULES.filter(m=>r?(relOf(m.id,r)||S.addons.includes(m.id)):true);
  $('#view').innerHTML=`<h1>Studi Kasus</h1><p class="lead">Dua tingkat studi kasus: <b>studi kasus role</b> (lintas modul, sesuai pekerjaanmu) dan <b>studi kasus per bab</b> (sesuai isi tiap bab di modul). Setiap pilihan punya umpan balik.</p>
  ${r?`<h2>Studi kasus role: ${esc(r.t)}</h2><div class="scen-list">${roleCases(r).map(caseCard).join('')}</div>
  <h2>Kasus terpadu (keputusan + praktik SAP)</h2><div class="scen-list">${roleSims(r).filter(id=>id.startsWith('k')).map(id=>simCard(SIMS.find(x=>x.id===id))).join('')||'<p class="muted">Belum ada kasus terpadu untuk modul jalur ini.</p>'}</div>`:
  `<div class="outpath" style="margin-top:14px">Pilih role untuk membuka studi kasus role. <a href="#role">Pilih role</a></div><h2>Studi kasus lintas modul</h2><div class="scen-list">${[...ROLECASES,...CASES].map(caseCard).join('')}</div>`}
  <h2>Studi kasus per bab</h2><p class="muted" style="max-width:72ch">${r?'Modul jalurmu dan add-on.':'Semua modul.'} Studi kasus bab juga ada di menu praktik setiap bab di halaman modul.</p>
  ${mods.map(m=>`<details class="simgrp"><summary><b>${m.code}</b> ${esc(shortT(m))} ${relPill(relOrAdd(m.id))}<span class="muted" style="margin-left:auto;font-size:13px">${mastery(m).caseB}/${m.lessons.length} bab</span></summary><div class="scen-list" style="margin:10px 0 4px">${BAB[m.id].map(b=>caseCard(b.case)).join('')}</div></details>`).join('')}`;
  bindAll($('#view'));
}
function playCase(id){
  const c=ALLCASES.find(x=>x.id===id);let i=0,score=0,firstTry=true;const log=[];
  const back=()=>{if(c.back&&c.back.startsWith('modul-')){MODV={id:c.mod,view:'p'+c.bab};go(c.back);}else if(c.kind==='role'&&roleOf()&&location.hash==='#jalur'){JV='kasus';route();}else renderCaseHome();};
  const label=c.kind==='bab'?`Studi kasus bab · ${MOD[c.mod].code} · Bab ${c.bab+1}`:c.role?'Studi kasus role':'Studi kasus · '+c.tag;
  const draw=(fb)=>{const st=c.steps[i];
    $('#view').innerHTML=`<div class="spread"><div><h1 style="font-size:28px">${esc(c.title)}</h1><div class="meta">${label}</div></div><button class="btn ghost sm" id="csBack">← Kembali</button></div>
    <div class="card case-scene" style="margin-top:14px"><b>Situasi</b><p>${esc(c.scene)}</p></div>
    ${log.length?`<div class="case-log">${log.map(l=>`<p>✓ ${esc(l)}</p>`).join('')}</div>`:''}
    ${st?`<div class="q"><div class="q-h">Keputusan ${i+1} dari ${c.steps.length}: ${esc(st.q)}</div>${st.o.map((o,j)=>`<button class="opt" data-j="${j}">${esc(o[0])}</button>`).join('')}${fb?`<div class="exp">${fb}</div>`:''}</div>`:
    `<div class="result"><b style="font-size:20px">Kasus selesai</b><p>Benar pada percobaan pertama: <b>${score}/${c.steps.length}</b>.</p><div class="row"><button class="btn sm" id="csAgain">Ulangi</button><button class="btn sm ghost" id="csList">${c.kind==='bab'?'Kembali ke praktik bab':'Kasus lain'}</button></div></div>`}`;
    $('#csBack').onclick=back;
    if(!st){S.cases[c.id]=Math.max(S.cases[c.id]||0,score);logAtt('case:'+c.id,score/c.steps.length*100);renderNav((location.hash||'#').slice(1));$('#csAgain').onclick=()=>playCase(id);$('#csList').onclick=back;return;}
    $$('.opt').forEach(b=>b.onclick=()=>{const o=st.o[+b.dataset.j];
      if(o[1]){if(firstTry)score++;log.push(o[0]+' — '+o[2]);i++;firstTry=true;draw();}
      else{firstTry=false;draw(`<b style="color:var(--bad)">Kurang tepat.</b> ${esc(o[2])} Coba pilih lagi.`);}});};
  draw();window.scrollTo(0,0);
}

/* ===================== GLOSARIUM ===================== */
function renderGloss(root,opt){
  opt=opt||{};const r=roleOf();let scope=opt.scope||(r?'jalur':'all'),type='Semua',q='';
  const inScope=g=>scope==='all'||(scope==='jalur'?g.mods.some(x=>rolePath(r).includes(x)||S.addons.includes(x)):g.mods.includes(scope));
  const types=['Semua','T-code','App','Istilah','Movement type'];
  root.innerHTML=`${opt.embed?'':`<h1>Glosarium</h1><p class="lead">${GLOSS.length} entri T-code, aplikasi, istilah, dan movement type. Daftar ini disusun otomatis dari isi materi, jadi setiap T-code atau istilah baru di materi langsung muncul di sini dan di flashcard.</p>`}
  <div class="filt" style="margin-top:14px">${opt.embed?'':`<select id="glS" aria-label="Cakupan">${r?`<option value="jalur">Jalur ${esc(r.t)} + add-on</option>`:''}<option value="all">Semua modul</option>${MODULES.map(m=>`<option value="${m.id}">${m.code} · ${esc(shortT(m))}</option>`).join('')}</select>`}<input id="glQ" placeholder="Cari kode atau istilah" aria-label="Cari glosarium"></div>
  <div class="chips" id="glT">${types.map(t=>`<button class="chip ${t===type?'on':''}" data-t="${t}">${t}</button>`).join('')}</div><p class="muted" id="glN" style="font-size:13px"></p><div id="glL"></div>`;
  const draw=()=>{const list=GLOSS.filter(g=>inScope(g)&&(type==='Semua'||g.t===type)&&(!q||(g.k+' '+g.d).toLowerCase().includes(q)));
    $('#glN',root).textContent=`${list.length} entri · ${list.filter(g=>S.cards[g.k]).length} sudah ditandai hafal`;
    $('#glL',root).innerHTML=list.length?`<div class="tbl-wrap"><table><tr><th style="width:24%">Kode / istilah</th><th style="width:13%">Jenis</th><th>Arti</th><th style="width:16%">Modul</th><th style="width:12%"></th></tr>${list.map(g=>`<tr><td>${g.t==='T-code'||g.t==='Movement type'?tc(esc(g.k)):`<b>${esc(g.k)}</b>`}</td><td><span class="pill">${g.t}</span></td><td>${esc(g.d)}</td><td>${g.mods.map(x=>`<a href="#modul-${x}">${MOD[x].code}</a>`).join(', ')}</td><td>${g.t==='Istilah'?'':`<button class="linkbtn" data-gk="${esc(g.k)}">${S.cards[g.k]?'✓ Hafal':'Tandai hafal'}</button>`}</td></tr>`).join('')}</table></div>`:'<p class="muted">Tidak ada entri yang cocok.</p>';
    $$('[data-gk]',root).forEach(b=>b.onclick=()=>{S.cards[b.dataset.gk]=!S.cards[b.dataset.gk];save();draw();});};
  $('#glS',root)&&($('#glS',root).value=scope,$('#glS',root).onchange=e=>{scope=e.target.value;draw();});
  $('#glQ',root).oninput=e=>{q=e.target.value.toLowerCase();draw();};
  $$('#glT .chip',root).forEach(b=>b.onclick=()=>{type=b.dataset.t;$$('#glT .chip',root).forEach(x=>x.classList.toggle('on',x===b));draw();});
  draw();
}

/* ===================== REPORT ===================== */
let DL=null;try{window.claude&&window.claude.use&&window.claude.use('downloads').then(d=>{DL=d;const b=$('#rpCsv');if(b)b.hidden=!d;}).catch(()=>{});}catch(e){}
function reportRows(){const r=roleOf();const ids=r?[...rolePath(r),...S.addons.filter(x=>!relOf(x,r))]:[];const act=MODULES.filter(m=>!ids.includes(m.id)&&(S.les[m.id]||S.att['mx:'+m.id]||S.mq[m.id])).map(m=>m.id);
  return [...ids,...act].map(id=>{const m=MOD[id],M=mastery(m);const cps=m.lessons.map((_,i)=>S.cpf[id+':'+i]).filter(x=>x!=null);
    const bs=BAB[id];const stars=bs.map(b=>Math.max(0,...b.sims.map(simStars),b.app?simStars(b.app):0)).filter(x=>x>0);const cs=bs.map(b=>S.cases[b.case.id]!=null?Math.round(S.cases[b.case.id]/b.case.steps.length*100):null).filter(x=>x!=null);
    return {id,m,M,k:relOrAdd(id),cp:cps.length?`${cps.filter(x=>x).length}/${cps.length}`:'–',stars:stars.length?(stars.reduce((a,x)=>a+x,0)/stars.length).toFixed(1):null,cs:cs.length?Math.round(cs.reduce((a,x)=>a+x,0)/cs.length):null,ex:M.ex,best:M.ex.best!=null?M.ex.best:(M.q||null)};});}
function renderReport(){
  const r=roleOf(),p=progress(),rows=reportRows();const rx=r?attOf('rx:'+r.id):null;
  const firsts=rows.map(x=>x.ex.first).filter(x=>x!=null),bests=rows.map(x=>x.best).filter(x=>x!=null);const avg=a=>a.length?Math.round(a.reduce((s,x)=>s+x,0)/a.length):null;
  const status=x=>x.M.done?'<span class="pill ok">Dikuasai</span>':x.best!=null&&x.best<80?'<span class="pill warn">Ujian belum lulus</span>':x.M.les?'<span class="pill ac">Berjalan</span>':'<span class="pill">Belum mulai</span>';
  const allAtt=Object.entries(S.att).flatMap(([k,a])=>a.map(x=>({k,...x}))).sort((a,b)=>b.t-a.t).slice(0,12);
  const attName=k=>{const [t,id]=[k.split(':')[0],k.slice(k.indexOf(':')+1)];if(t==='mx')return 'Ujian akhir '+MOD[id].code;if(t==='rx')return 'Ujian akhir role '+((ROLES.find(x=>x.id===id)||{}).t||'');if(t==='case'){const c=ALLCASES.find(x=>x.id===id);return 'Studi kasus: '+(c?c.title:id);}if(t==='sim'){const s=SIMS.find(x=>x.id===id)||APPPRAC[id];return 'Simulator: '+(s?s.title:id);}return k;};
  const attVal=x=>x.k.startsWith('sim:')?'★'.repeat(x.s)+'☆'.repeat(3-x.s):x.s+'%';
  $('#view').innerHTML=`<h1>Report nilai</h1><p class="lead">Penilaian per modul: cek pemahaman tiap bab, simulator bab, studi kasus bab, dan ujian akhir (nilai percobaan pertama dan nilai tertinggi).${r?` Role: <b>${esc(r.t)}</b>.`:''}</p>
  <div class="grid g3" style="margin-top:16px"><div class="card stat"><b>${p.pct}%</b><span>progres ${r?'kompetensi role':'keseluruhan'}</span></div><div class="card stat"><b>${r?p.done+'/'+p.core:p.all+'/'+MODULES.length}</b><span>modul dikuasai</span></div><div class="card stat"><b>${sc(avg(firsts))} → ${sc(avg(bests))}</b><span>rata-rata ujian modul: pertama → tertinggi</span></div>
  ${r?`<div class="card stat"><b>${sc(rx.first)} → ${sc(rx.best)}</b><span>ujian akhir role (${rx.n}× percobaan)</span></div>`:''}<div class="card stat"><b>${p.s}</b><span>simulator diselesaikan</span></div><div class="card stat"><b>${p.c}</b><span>studi kasus diselesaikan</span></div></div>
  <div class="row" style="margin-top:14px"><button class="btn sm ghost" id="rpCsv" ${DL?'':'hidden'}>Unduh CSV</button><button class="btn sm ghost" id="rpPrint">Cetak / simpan PDF</button></div>
  <h2>Nilai per modul</h2>
  ${rows.length?`<div class="tbl-wrap"><table class="rptbl"><tr><th>Modul</th><th>Bab</th><th>Cek pemahaman<br><small>benar di percobaan pertama</small></th><th>Simulator bab<br><small>selesai · rata² bintang</small></th><th>Studi kasus bab<br><small>selesai · rata² skor</small></th><th>Ujian: pertama</th><th>Ujian: tertinggi</th><th>Percobaan</th><th>Terakhir</th><th>Status</th></tr>
  ${rows.map(x=>`<tr><td><a href="#modul-${x.id}"><b>${x.m.code}</b></a> ${relPill(x.k)}<br><small>${esc(shortT(x.m))}</small></td><td class="n">${x.M.les}/${x.M.L}</td><td class="n">${x.cp}</td><td class="n">${x.M.simB}/${x.M.L}${x.stars?` · ${x.stars}★`:''}</td><td class="n">${x.M.caseB}/${x.M.L}${x.cs!=null?` · ${x.cs}%`:''}</td><td class="n">${sc(x.ex.first)}</td><td class="n"><b>${sc(x.best)}</b>${x.best!=null?`<div class="mbar"><i style="width:${x.best}%"></i>${x.ex.first!=null?`<s style="left:${x.ex.first}%"></s>`:''}</div>`:''}</td><td class="n">${x.ex.n}</td><td>${fmtD(x.ex.last&&x.ex.last.t)}</td><td>${status(x)}</td></tr>`).join('')}</table></div>
  <p class="muted" style="font-size:12.5px">Garis tipis di bar = nilai pertama; bar biru = nilai tertinggi. Nilai pertama hanya tercatat untuk ujian yang dikerjakan setelah fitur report aktif.</p>`:'<p class="muted">Belum ada data. Pilih role atau mulai satu modul.</p>'}
  <h2>Aktivitas terakhir</h2>${allAtt.length?`<div class="tbl-wrap"><table><tr><th>Tanggal</th><th>Aktivitas</th><th>Hasil</th></tr>${allAtt.map(x=>`<tr><td>${new Date(x.t).toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</td><td>${esc(attName(x.k))}</td><td>${attVal(x)}</td></tr>`).join('')}</table></div>`:'<p class="muted">Belum ada aktivitas yang dinilai.</p>'}`;
  $('#rpPrint').onclick=()=>window.print();
  $('#rpCsv').onclick=()=>{const h=['Modul','Kode','Kategori role','Bab selesai','Cek pemahaman benar pertama','Simulator bab selesai','Studi kasus bab selesai','Skor kasus rata2','Ujian pertama','Ujian tertinggi','Percobaan','Terakhir','Dikuasai'];
    const csv=[h,...rows.map(x=>[shortT(x.m),x.m.code,x.k?REL[x.k][0]:'',`${x.M.les}/${x.M.L}`,x.cp,`${x.M.simB}/${x.M.L}`,`${x.M.caseB}/${x.M.L}`,x.cs??'',x.ex.first??'',x.best??'',x.ex.n,x.ex.last?new Date(x.ex.last.t).toISOString().slice(0,10):'',x.M.done?'Ya':'Tidak'])].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    DL&&DL.save({filename:'report-akademi-sap.csv',data:'\ufeff'+csv}).catch(()=>{});};
}

/* ===================== UJIAN (hub) ===================== */
function renderQuizHome(){
  const r=roleOf();const ids=r?[...roleCore(r),...S.addons.filter(x=>!relOf(x,r))]:ORDER;
  const cats=[...['Movement','T-code','Pembelian','Opname','Aset','Proyek','Navigasi'].map(c=>[c,c,QBANK.filter(q=>q.c===c).length]),['Urutan','Urutan transaksi',OBANK.length]];
  const rx=r?attOf('rx:'+r.id):null;
  $('#view').innerHTML=`<h1>Ujian</h1><p class="lead">Setiap modul punya <b>ujian akhir modul</b>. ${r?`Role ${esc(r.t)} juga punya <b>ujian akhir role</b> dari semua kompetensi inti dan general.`:'Pilih role untuk membuka ujian akhir role.'}</p>
  ${r?`<div class="card" style="margin-top:14px"><div class="spread"><b style="font-size:18px">Ujian akhir role · ${esc(r.t)}</b><button class="btn sm" id="toRx">Buka ujian role</button></div><p class="muted" style="margin:6px 0 0">Nilai pertama ${sc(rx.first)} · tertinggi ${sc(rx.best)} · ${rx.n}× percobaan</p></div>`:''}
  <h2>Ujian akhir modul</h2><div class="tbl-wrap"><table><tr><th>Modul</th><th>Syarat</th><th>Pertama</th><th>Tertinggi</th><th>Percobaan</th><th></th></tr>${ids.map(id=>{const m=MOD[id],M=mastery(m);return `<tr><td><b>${m.code}</b> ${relPill(relOrAdd(id))}<br><small>${esc(shortT(m))}</small></td><td>${M.les>=M.L?'<span class="pill ok">Terbuka</span>':`<span class="pill">Bab ${M.les}/${M.L}</span>`}</td><td>${sc(M.ex.first)}</td><td><b>${sc(M.ex.best!=null?M.ex.best:(M.q||null))}</b></td><td>${M.ex.n}</td><td><button class="linkbtn" data-mx="${id}">${M.les>=M.L?'Kerjakan':'Buka modul'}</button></td></tr>`;}).join('')}</table></div>
  <h2>Bank soal latihan MM & proyek</h2><div class="card"><div class="chips" id="qcats">${cats.map((c,i)=>`<button class="chip ${i===0?'on':''}" data-c="${c[0]}">${c[1]} <span style="opacity:.7">(${c[2]})</span></button>`).join('')}</div><div class="row"><button class="btn" id="qStart">Mulai latihan</button><span style="font-size:13px;color:var(--muted)">Latihan tidak memengaruhi nilai.</span></div></div><div id="qArea"></div>`;
  $('#toRx')&&($('#toRx').onclick=()=>{JV='ujian';location.hash='jalur';});
  $$('[data-mx]').forEach(b=>b.onclick=()=>{const m=MOD[b.dataset.mx],M=mastery(m);MODV={id:m.id,view:M.les>=M.L?'exam':'l'+Math.min(M.les,M.L-1)};location.hash='modul-'+m.id;});
  let cat='Movement';$$('#qcats .chip').forEach(b=>b.onclick=()=>{cat=b.dataset.c;$$('#qcats .chip').forEach(x=>x.classList.toggle('on',x===b));});
  $('#qStart').onclick=()=>startQuiz(cat);
}
function startQuiz(cat){
  let mc=[],ord=[];
  if(cat==='Urutan')ord=OBANK.slice(); else mc=QBANK.filter(q=>q.c===cat).map(shufQ);
  const total=mc.length+ord.length;let done=0,correct=0;const area=$('#qArea');
  area.innerHTML=`<div id="qMC"></div><div id="qORD"></div><div class="result" id="qFinal" hidden></div>`;
  const finish=()=>{if(done<total)return;const s=Math.round(correct/total*100);const f=$('#qFinal');f.hidden=false;f.innerHTML=`<b style="font-size:20px">Skor: ${correct}/${total} (${s}%)</b><p>Latihan selesai.</p><button class="btn sm" id="qRe">Ulangi</button>`;$('#qRe').onclick=()=>startQuiz(cat);f.scrollIntoView({behavior:'smooth',block:'center'});};
  const mcEl=$('#qMC');
  mcEl.innerHTML=mc.map((q,i)=>`<div class="q" data-i="${i}"><div class="q-h">${i+1}. ${esc(q.q)}</div>${q.o.map((o,j)=>`<button class="opt" data-j="${j}">${esc(o)}</button>`).join('')}<div class="exp" hidden></div></div>`).join('');
  $$('.q',mcEl).forEach(box=>{const q=mc[+box.dataset.i];$$('.opt',box).forEach(b=>b.onclick=()=>{const ok=+b.dataset.j===q.a;$$('.opt',box).forEach(x=>{x.disabled=true;if(+x.dataset.j===q.a)x.classList.add('right');});if(!ok)b.classList.add('wrong');const ex=$('.exp',box);ex.hidden=false;ex.innerHTML=`<b style="color:${ok?'var(--ok)':'var(--bad)'}">${ok?'Benar.':'Belum tepat.'}</b> ${esc(q.e)}`;done++;if(ok)correct++;finish();});});
  const oEl=$('#qORD');
  ord.forEach((o,oi)=>{const box=document.createElement('div');box.className='q';oEl.appendChild(box);let cur=shuffle(o.items);if(cur.join()===o.items.join())cur=cur.reverse();let locked=false;
    const draw=()=>{box.innerHTML=`<div class="q-h">${mc.length+oi+1}. ${esc(o.q)}</div><ol class="order-list">${cur.map((t,i)=>`<li class="${locked?(t===o.items[i]?'right':'wrong'):''}"><span class="ix">${i+1}</span><span class="tx">${esc(t)}</span>${locked?'':`<button class="mv" data-u="${i}" aria-label="Naikkan" ${i===0?'disabled':''}>↑</button><button class="mv" data-d="${i}" aria-label="Turunkan" ${i===cur.length-1?'disabled':''}>↓</button>`}</li>`).join('')}</ol>${locked?`<div class="exp">Urutan benar: ${o.items.map((t,i)=>`${i+1}) ${esc(t)}`).join(' → ')}</div>`:'<button class="btn sm" data-chk>Periksa urutan</button>'}`;
      $$('[data-u]',box).forEach(b=>b.onclick=()=>{const i=+b.dataset.u;[cur[i-1],cur[i]]=[cur[i],cur[i-1]];draw();});
      $$('[data-d]',box).forEach(b=>b.onclick=()=>{const i=+b.dataset.d;[cur[i+1],cur[i]]=[cur[i],cur[i+1]];draw();});
      const c=$('[data-chk]',box);if(c)c.onclick=()=>{locked=true;const ok=cur.join('|')===o.items.join('|');done++;if(ok)correct++;draw();finish();};};
    draw();});
  area.scrollIntoView({behavior:'smooth',block:'start'});
}
function shufQ(q){const idx=shuffle(q.o.map((_,i)=>i));return {q:q.q,o:idx.map(i=>q.o[i]),a:idx.indexOf(q.a),e:q.e};}
/* ===================== MC QUIZ ===================== */
function runMC(el,qs,onDone){
  let answered=0,correct=0;
  el.innerHTML=qs.map((q,i)=>`<div class="q" data-i="${i}"><div class="q-h">${i+1}. ${esc(q.q)}</div>${q.o.map((o,j)=>`<button class="opt" data-j="${j}">${esc(o)}</button>`).join('')}<div class="exp" hidden></div></div>`).join('')+`<div class="result" id="mcRes" hidden></div>`;
  $$('.q',el).forEach(box=>{const q=qs[+box.dataset.i];
    $$('.opt',box).forEach(b=>b.onclick=()=>{const j=+b.dataset.j,ok=j===q.a;
      $$('.opt',box).forEach(x=>{x.disabled=true;if(+x.dataset.j===q.a)x.classList.add('right');});if(!ok)b.classList.add('wrong');
      const ex=$('.exp',box);ex.hidden=false;ex.innerHTML=`<b style="color:${ok?'var(--ok)':'var(--bad)'}">${ok?'Benar.':'Belum tepat.'}</b> ${esc(q.e)}`;
      answered++;if(ok)correct++;
      if(answered===qs.length){const r=$('#mcRes',el);r.hidden=false;const sc=Math.round(correct/qs.length*100);
        r.innerHTML=`Skor: <b>${correct}/${qs.length}</b> (${sc}%). ${sc>=80?'<span class="pill ok">Lulus</span>':'<span class="pill bad">Belum lulus</span> Baca ulang pelajaran terkait lalu coba lagi.'} <button class="btn sm ghost" id="mcAgain">Ulangi</button>`;
        $('#mcAgain',el).onclick=()=>runMC(el,qs.map(x=>shufQ(x)),onDone);onDone&&onDone(sc);r.scrollIntoView({behavior:'smooth',block:'center'});}
    });});
}

/* ===================== WIDGETS ===================== */
function initWidgets(root){$$('[data-widget]',root).forEach(w=>{const f=WIDGETS[w.dataset.widget];f&&f(w);});}
const WIDGETS={
flow(w){const steps=FLOWS[w.dataset.flow];let cur=0;const seen=new Set([0]);
  function draw(){const s=steps[cur];
    w.innerHTML=`<div class="flow" role="tablist">${steps.map((x,i)=>`<button role="tab" aria-selected="${i===cur}" class="${i===cur?'on':''} ${seen.has(i)&&i!==cur?'seen':''}" data-i="${i}"><b>${x.t}</b><small>${x.c}</small></button>`).join('')}</div>
    <div class="flow-detail"><div class="spread"><b style="font-family:var(--font-d);font-size:18px">${s.t}</b><span>${s.c!=='–'?s.c.split(' / ').map(c=>tc(c)).join(' '):''}</span></div><p>${s.d}</p><dl><dt>Dikerjakan oleh</dt><dd>${s.who}</dd><dt>Yang kamu cek</dt><dd>${s.chk}</dd></dl>
    <div class="row" style="margin-top:10px"><button class="btn sm ghost" data-nav="-1" ${cur===0?'disabled':''}>← Sebelumnya</button><button class="btn sm" data-nav="1" ${cur===steps.length-1?'disabled':''}>Berikutnya →</button><span class="muted" style="font-size:12.5px">${seen.size}/${steps.length} langkah dibaca</span></div></div>`;
    $$('.flow button',w).forEach(b=>b.onclick=()=>{cur=+b.dataset.i;seen.add(cur);draw();});
    $$('[data-nav]',w).forEach(b=>b.onclick=()=>{cur+=+b.dataset.nav;seen.add(cur);draw();});}
  draw();},
hotspot(w){
  const Z=[['cmd','Command field (tempat mengetik T-code)'],['status','Status bar (pesan sukses/warning/error)'],['title','Title bar (nama transaksi)'],['app','Application toolbar (tombol khusus transaksi)'],['work','Area kerja (field isian)'],['menu','Menu bar']];
  let i=0,score=0,tries=0;
  w.className='wid';
  const draw=(fb)=>{w.innerHTML=`<div class="wid-h">Latihan: klik bagian layar yang diminta</div>
    ${i<Z.length?`<p style="margin:0 0 8px">Klik: <b>${Z[i][1]}</b> <span class="muted" style="font-size:13px">(${i+1}/${Z.length})</span></p>`:`<p style="margin:0 0 8px"><span class="pill ok">Selesai</span> Benar pada percobaan pertama: <b>${score}/${Z.length}</b>. <button class="linkbtn" id="hsAgain">Ulangi</button></p>`}
    <div class="hs">
      <div class="hs-menu" data-z="menu"><span>Menu</span><span>Edit</span><span>Goto</span><span>System</span><span>Help</span></div>
      <div class="hs-std"><span class="hs-cmd" data-z="cmd" aria-label="command field"></span><span class="hs-ic"></span><span class="hs-ic"></span><span class="hs-ic"></span><span class="hs-ic"></span></div>
      <div class="hs-title" data-z="title">Display Purchase Order 4500021880</div>
      <div class="hs-app" data-z="app"><span>Other Purchase Order</span><span>Display/Change</span><span>Print Preview</span></div>
      <div class="hs-work" data-z="work"><div><span style="width:120px">Vendor</span><i></i></div><div><span style="width:120px">Doc. date</span><i></i></div><div><span style="width:120px">Purch. Group</span><i></i></div></div>
      <div class="hs-status" data-z="status"><span class="st-ic st-S"></span>Document 4500021880 displayed</div>
    </div>${fb||''}`;
    $('#hsAgain',w)&&($('#hsAgain',w).onclick=()=>{i=0;score=0;tries=0;draw();});
    if(i>=Z.length)return;
    $$('[data-z]',w).forEach(el=>el.onclick=e=>{e.stopPropagation();const z=el.dataset.z;
      if(z===Z[i][0]){if(tries===0)score++;el.classList.add('z-ok');tries=0;i++;setTimeout(()=>draw(`<p class="exp" style="margin-top:8px"><b style="color:var(--ok)">Benar.</b></p>`),350);}
      else{tries++;el.classList.add('z-bad');setTimeout(()=>el.classList.remove('z-bad'),600);const f=$('.hsfb',w)||w.appendChild(Object.assign(document.createElement('p'),{className:'exp hsfb'}));f.innerHTML=`<b style="color:var(--bad)">Bukan itu.</b> Yang kamu klik adalah ${Z.find(x=>x[0]===z)[1].split(' (')[0]}.`;}
    });};
  draw();},
match3(w){
  w.className='wid';
  w.innerHTML=`<div class="wid-h">Simulasi 3-way match</div>
  <div class="inputs"><label>PO: qty dipesan<input type="number" id="m_po" value="10"></label><label>PO: harga/unit (Rp)<input type="number" id="m_pp" value="185000"></label><label>GR: qty diterima<input type="number" id="m_gr" value="8"></label><label>Invoice: qty ditagih<input type="number" id="m_iq" value="10"></label><label>Invoice: harga/unit (Rp)<input type="number" id="m_ip" value="185000"></label><label>Toleransi harga (%)<input type="number" id="m_tol" value="2"></label></div><div class="result" id="m_res"></div>
  <p class="muted" style="font-size:13px">Coba buat invoice lolos dengan mengubah qty GR. Toleransi sebenarnya diatur di konfigurasi SAP.</p>`;
  const calc=()=>{const g=id=>+$('#'+id,w).value||0;const po=g('m_po'),pp=g('m_pp'),gr=g('m_gr'),iq=g('m_iq'),ip=g('m_ip'),tol=g('m_tol');const rows=[];
    const qOk=iq<=gr;rows.push([qOk,`Qty invoice (${iq}) ${qOk?'≤':'>'} qty GR (${gr})`]);const grOk=gr<=po;rows.push([grOk,`Qty GR (${gr}) ${grOk?'≤':'>'} qty PO (${po})`]);
    const dev=pp?((ip-pp)/pp*100):0;const pOk=Math.abs(dev)<=tol;rows.push([pOk,`Selisih harga ${dev.toFixed(1)}% ${pOk?'dalam':'di luar'} toleransi ${tol}%`]);const all=rows.every(r=>r[0]);
    $('#m_res',w).innerHTML=rows.map(r=>`<div>${r[0]?'<span class="pill ok">OK</span>':'<span class="pill bad">Tidak cocok</span>'} ${r[1]}</div>`).join('')+`<div style="margin-top:8px"><b>Hasil:</b> ${all?'<span class="pill ok">Siap dibayar</span>':'<span class="pill bad">Blocked for payment</span> Finance menahan invoice sampai dokumen dikoreksi.'}</div>`;};
  $$('input',w).forEach(i=>i.oninput=calc);calc();},
mvpick(w){
  w.className='wid';
  const items=[['Kabel 50 M diambil teknisi untuk panel baru proyek (WBS P-26-014.04)','221'],['Gudang menerima belt conveyor dari PO 4500021902','101'],['Grease untuk pelumasan rutin mesin produksi (cost center Line 3)','201'],['Sparepart untuk work order breakdown maintenance 4000123','261'],['Material proyek dipindah dari Gudang Sparepart 1101 ke Gudang Proyek 1102','311'],['GR bearing ternyata salah qty, perlu dibatalkan','102']];
  const opts=['101','102','201','221','261','311'];
  w.innerHTML=`<div class="wid-h">Pilih movement type untuk tiap situasi</div>`+items.map((it,i)=>`<div class="chk" style="align-items:center"><span style="flex:1">${it[0]}</span><select data-i="${i}" aria-label="Movement type situasi ${i+1}" style="font:14px var(--font-m);padding:5px;border-radius:6px;border:1px solid var(--line);background:var(--surface-2);color:var(--ink)"><option value="">pilih</option>${opts.map(o=>`<option>${o}</option>`).join('')}</select><span class="mvr" style="width:90px"></span></div>`).join('')+`<div class="row" style="margin-top:10px"><button class="btn sm" id="mvCheck">Periksa jawaban</button><span id="mvScore"></span></div>`;
  $('#mvCheck',w).onclick=()=>{let c=0;$$('select',w).forEach(s=>{const ok=s.value===items[+s.dataset.i][1];if(ok)c++;s.parentElement.querySelector('.mvr').innerHTML=ok?'<span class="pill ok">Benar</span>':`<span class="pill bad">${items[+s.dataset.i][1]}</span>`;});$('#mvScore',w).textContent=`${c}/${items.length} benar`;};},
check(w){
  w.className='wid';const key=w.dataset.list;const L=LISTS[key];S.check[key]=S.check[key]||{};
  const draw=()=>{w.innerHTML=`<div class="wid-h">Checklist</div>`+L.map((t,i)=>`<label class="chk"><input type="checkbox" data-i="${i}" ${S.check[key][i]?'checked':''}><span>${t}</span></label>`).join('')+`<div class="row" style="margin-top:8px"><button class="linkbtn" id="ckReset">Kosongkan checklist</button></div>`;
    $$('input',w).forEach(c=>c.onchange=()=>{S.check[key][c.dataset.i]=c.checked;save();});$('#ckReset',w).onclick=()=>{S.check[key]={};save();draw();};};
  draw();},
budget(w){
  w.className='wid';
  w.innerHTML=`<div class="wid-h">Kalkulator sisa budget proyek</div><div class="inputs"><label>Budget (Rp)<input type="number" id="b_b" value="850000000"></label><label>Actual – CJI3 (Rp)<input type="number" id="b_a" value="610000000"></label><label>Komitmen – CJI5 (Rp)<input type="number" id="b_c" value="230000000"></label><label>PR baru yang diminta (Rp)<input type="number" id="b_n" value="45000000"></label></div><div class="result" id="b_res"></div>`;
  const calc=()=>{const g=id=>+$('#'+id,w).value||0;const b=g('b_b'),a=g('b_a'),c=g('b_c'),n=g('b_n');const rest=b-a-c;const after=rest-n;const used=b?((a+c)/b*100):0;
    const st=after<0?['bad','Melebihi budget: eskalasi ke supervisor/pemilik budget sebelum PR dibuat']:(after/b<0.05?['warn','Sisa tipis (< 5%): beri peringatan di laporan']:['ok','Aman']);
    $('#b_res',w).innerHTML=`<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))"><div class="stat"><b>${rp(rest)}</b><span>sisa bebas sekarang</span></div><div class="stat"><b>${used.toFixed(1)}%</b><span>terpakai + terikat</span></div><div class="stat"><b style="color:var(--${st[0]==='ok'?'ok':st[0]==='warn'?'warn':'bad'})">${rp(after)}</b><span>sisa setelah PR baru</span></div></div><div style="margin-top:8px"><span class="pill ${st[0]}">${st[0]==='ok'?'Green':st[0]==='warn'?'Amber':'Red'}</span> ${st[1]}</div>`;};
  $$('input',w).forEach(i=>i.oninput=calc);calc();},
scurve(w){
  w.className='wid';const plan=[2,5,10,18,28,40,53,65,76,86,94,100];let act=[2,4,9,15,24,33,44,null,null,null,null,null];
  const draw=()=>{
    w.innerHTML=`<div class="wid-h">Kurva S Proyek P-26-014 (progres kumulatif %)</div><div id="sc_svg"></div><div class="tbl-wrap scurve-tbl"><table><tr><th>Minggu</th>${plan.map((_,i)=>`<th class="n">W${i+1}</th>`).join('')}</tr><tr><td>Rencana</td>${plan.map(p=>`<td class="n">${p}</td>`).join('')}</tr><tr><td>Aktual</td>${act.map((a,i)=>`<td class="n"><input type="number" min="0" max="100" data-i="${i}" value="${a??''}" aria-label="Aktual minggu ${i+1}"></td>`).join('')}</tr></table></div><div class="result" id="sc_res"></div>`;
    $$('input',w).forEach(inp=>inp.onchange=()=>{const v=inp.value===''?null:Math.max(0,Math.min(100,+inp.value));act[+inp.dataset.i]=v;draw();});
    const W=640,H=230,pl=36,pb=26,pt=10,pr=22;const x=i=>pl+i*(W-pl-pr)/(plan.length-1),y=v=>pt+(100-v)*(H-pt-pb)/100;
    let g='';for(let v=0;v<=100;v+=25){g+=`<line x1="${pl}" x2="${W-pr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${pl-6}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="var(--muted)">${v}</text>`;}
    plan.forEach((_,i)=>{g+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--muted)">W${i+1}</text>`;});
    const pp=plan.map((v,i)=>`${x(i)},${y(v)}`).join(' ');const ai=act.map((v,i)=>v==null?null:[i,v]).filter(Boolean);const ap=ai.map(([i,v])=>`${x(i)},${y(v)}`).join(' ');const last=ai[ai.length-1];
    $('#sc_svg',w).innerHTML=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Kurva S rencana vs aktual">${g}<polygon points="${x(0)},${y(0)} ${pp} ${x(plan.length-1)},${y(0)}" fill="var(--accent)" opacity=".08"/><polyline points="${pp}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>${ai.length?`<polyline points="${ap}" fill="none" stroke="var(--accent)" stroke-width="3"/>`:''}${last?`<circle cx="${x(last[0])}" cy="${y(last[1])}" r="5" fill="var(--accent)"/><text x="${x(last[0])+8}" y="${y(last[1])+14}" font-size="12" fill="var(--ink)" font-weight="600">${last[1]}%</text>`:''}<g font-size="12" fill="var(--ink)"><line x1="${pl+8}" x2="${pl+30}" y1="${pt+8}" y2="${pt+8}" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/><text x="${pl+36}" y="${pt+12}">Rencana</text><line x1="${pl+100}" x2="${pl+122}" y1="${pt+8}" y2="${pt+8}" stroke="var(--accent)" stroke-width="3"/><text x="${pl+128}" y="${pt+12}">Aktual</text></g></svg>`;
    if(last){const p=plan[last[0]],a=last[1],spi=a/p;const s=spi>=0.95?['ok','Green','Sesuai jadwal']:spi>=0.85?['warn','Amber','Sedikit terlambat, perlu rencana percepatan']:['bad','Red','Terlambat signifikan, eskalasi ke Project Manager'];
      $('#sc_res',w).innerHTML=`Minggu ${last[0]+1}: rencana <b>${p}%</b>, aktual <b>${a}%</b>, deviasi <b>${(a-p).toFixed(0)}%</b>, SPI <b>${spi.toFixed(2)}</b> → <span class="pill ${s[0]}">${s[1]}</span> ${s[2]}.`;}
    else $('#sc_res',w).textContent='Isi minimal satu angka aktual.';};
  draw();}
};

/* ===================== FLASHCARDS ===================== */
const CARD_MOD={Beli:'mm-pur',Stok:'mm-im','Data induk':'org',Opname:'mm-pi',Aset:'fi-aa',Proyek:'ps',PM:'pm'};
const ALLCARDS=(()=>{const out=CARDS.map(c=>[c[0],c[1],CARD_MOD[c[2]]||'mm-im',c[3]]);const seen=new Set(out.map(c=>c[0]));
  MVT.forEach(([k,d])=>{seen.add(k);out.push([k,'Movement type '+k,'mm-im',d]);});
  MODULES.forEach(m=>m.lessons.forEach(l=>(l.tcRows||[]).forEach(([codes,desc])=>codes.split(' / ').forEach(c=>{c=c.trim();if(!isCode(c)||seen.has(c))return;seen.add(c);out.push([c,KNOWN[c]||(m.code+' · '+shortT(m)),m.id,desc.replace(/<[^>]+>/g,'')]);}))));return out;})();
function renderCards(root,opt){
  root=root||$('#view');opt=opt||{};
  const r=roleOf();let cat=r?'jalur':'all',q='',hideKnown=false,mode='cards';
  const inCat=c=>cat==='all'||(cat==='jalur'?(!!relOf(c[2],r)||S.addons.includes(c[2])):c[2]===cat);
  const shell=()=>{root.innerHTML=`${opt.embed?'':`<h1>Flashcard</h1><p class="lead">${ALLCARDS.length} kartu T-code dan movement type, disusun otomatis dari materi semua modul. Mode <b>Kartu</b> untuk membaca dan membalik. Mode <b>Latihan ketik</b>: baca fungsinya, ketik kodenya. Mode <b>Uji kartu hafal</b> menguji semua kartu yang sudah kamu tandai hafal.</p><div class="callout" style="margin:10px 0 0"><b>EXP flashcard</b>Tandai kartu hafal = <b>1 EXP</b>. Kartu hafal yang dijawab benar di Uji kartu hafal = <b>+1 EXP</b> lagi. Setiap kartu dihitung satu kali.</div>`}
    <div class="chips"><button class="chip ${mode==='cards'?'on':''}" data-m="cards">Kartu</button><button class="chip ${mode==='drill'?'on':''}" data-m="drill">Latihan ketik</button><button class="chip ${mode==='test'?'on':''}" data-m="test">Uji kartu hafal</button></div>
    <div class="filt"><label for="fcCat" class="muted" style="font-size:13px">Kartu dari</label><select id="fcCat">${r?`<option value="jalur" ${cat==='jalur'?'selected':''}>Jalur ${esc(r.t)} + add-on</option>`:''}<option value="all" ${cat==='all'?'selected':''}>Semua modul</option>${MODULES.filter(m=>ALLCARDS.some(c=>c[2]===m.id)).map(m=>`<option value="${m.id}" ${cat===m.id?'selected':''}>${m.code} · ${esc(shortT(m))}</option>`).join('')}</select></div><div id="fcArea"></div>`;
    $$('[data-m]',root).forEach(b=>b.onclick=()=>{mode=b.dataset.m;shell();});$('#fcCat',root).onchange=e=>{cat=e.target.value;shell();};mode==='cards'?cardsView():drillView(mode==='test');};
  const cardsView=()=>{
    $('#fcArea').innerHTML=`<div class="filt"><input id="fcQ" value="${esc(q)}" placeholder="Cari T-code / fungsi" aria-label="Cari flashcard"><label style="font-size:13px"><input type="checkbox" id="fcHide" ${hideKnown?'checked':''}> Sembunyikan yang sudah hafal</label></div>
    <p id="fcCount" style="font-size:13px;color:var(--muted)"></p><div class="fc-grid" id="fcGrid"></div>`;
    const draw=()=>{const list=ALLCARDS.filter(c=>inCat(c)&&(!q||(c[0]+c[1]+c[3]).toLowerCase().includes(q))&&(!hideKnown||!S.cards[c[0]]));const pool=ALLCARDS.filter(inCat);
      $('#fcCount').textContent=`${pool.filter(c=>S.cards[c[0]]).length}/${pool.length} kartu sudah hafal · ${list.length} ditampilkan`;
      $('#fcGrid').innerHTML=list.map(c=>`<div><button class="fc ${S.cards[c[0]]?'known':''}" data-c="${c[0]}" aria-label="Kartu ${c[0]}"><div class="fc-in"><div class="fc-f"><span class="code">${c[0]}</span><small>${MOD[c[2]].code} · klik untuk membalik</small></div><div class="fc-b"><b>${esc(c[1])}</b><span>${esc(c[3])}</span></div></div></button><div class="fc-tools"><span style="color:var(--muted)">${MOD[c[2]].code}</span><button class="linkbtn" data-k="${c[0]}">${S.cards[c[0]]?'✓ Hafal':'Tandai hafal'}</button></div></div>`).join('')||'<p>Tidak ada kartu yang cocok.</p>';
      $$('.fc').forEach(b=>b.onclick=()=>b.classList.toggle('flip'));
      $$('[data-k]',$('#fcGrid')).forEach(b=>b.onclick=()=>{S.cards[b.dataset.k]=!S.cards[b.dataset.k];save();draw();renderNav('flashcard');});};
    $('#fcQ').oninput=e=>{q=e.target.value.toLowerCase();draw();};$('#fcHide').onchange=e=>{hideKnown=e.target.checked;draw();};draw();};
  const drillView=(test)=>{
    const deck=test?shuffle(ALLCARDS.filter(c=>inCat(c)&&S.cards[c[0]])):shuffle(ALLCARDS.filter(inCat)).slice(0,10);let i=0,score=0,answered=false,gain=0;
    if(test&&!deck.length){$('#fcArea').innerHTML=`<div class="card drill"><h3>Belum ada kartu hafal</h3><p>Tandai kartu sebagai hafal di mode Kartu (1 EXP per kartu), lalu kembali ke sini untuk menguji semuanya sekaligus.</p></div>`;return;}
    const draw=(fb)=>{const c=deck[i];
      $('#fcArea').innerHTML=i<deck.length?`<div class="card drill"><div class="spread"><span class="pill">${i+1}/${deck.length}</span><span class="muted" style="font-size:13px">Skor ${score}</span></div><h3>${esc(c[1])}</h3><p>${esc(c[3])}</p><label for="drIn" class="muted" style="font-size:13px">Ketik T-code-nya lalu Enter</label><input id="drIn" autocomplete="off" spellcheck="false" ${answered?'disabled':''}>${fb||''}<div class="row" style="margin-top:10px">${answered?'<button class="btn sm" id="drNext">Berikutnya →</button>':'<button class="btn sm" id="drChk">Periksa</button><button class="btn sm ghost" id="drSkip">Lewati</button>'}</div></div>`
      :`<div class="card drill"><h3>Selesai</h3><p>Skor <b>${score}/${deck.length}</b>. ${test?`Kartu hafal yang lulus uji untuk pertama kali: <b>+${gain} EXP</b>. ${score<deck.length?'Kartu yang salah bisa diuji lagi kapan saja.':''}`:score>=8?'Hafalanmu kuat.':'Ulangi beberapa kali sampai ≥ 8.'}</p><button class="btn sm" id="drAgain">${test?'Uji lagi':'Latihan lagi'}</button></div>`;
      const inp=$('#drIn');if(inp&&!answered)inp.focus();
      const check=(skip)=>{const ok=!skip&&norm(inp.value)===c[0];let plus='';if(ok){score++;if(test){if(!S.cardOk[c[0]]){S.cardOk[c[0]]=true;gain++;plus=' <span class="pill ok">+1 EXP</span>';}}else if(!S.cards[c[0]]){S.cards[c[0]]=true;plus=' <span class="pill ok">ditandai hafal · +1 EXP</span>';}save();}answered=true;draw(`<div class="exp" style="margin-top:10px"><b style="color:${ok?'var(--ok)':'var(--bad)'}">${ok?'Benar':'Jawaban'}: ${c[0]}</b> – ${esc(c[1])}${plus}</div>`);};
      $('#drChk')&&($('#drChk').onclick=()=>check(false));$('#drSkip')&&($('#drSkip').onclick=()=>check(true));
      inp&&(inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(!answered)check(false);}});
      $('#drNext')&&($('#drNext').onclick=()=>{i++;answered=false;draw();});$('#drNext')&&$('#drNext').focus();
      $('#drAgain')&&($('#drAgain').onclick=()=>drillView(test));};
    draw();};
  shell();
}

/* ===================== REFERENCE ===================== */
function renderRef(){
  const byCat={};CARDS.forEach(c=>{(byCat[c[2]]=byCat[c[2]]||[]).push(c);});
  const want=[['membuat PR','ME51N'],['cek status PR / apakah sudah jadi PO','ME5A, ME53N'],['release (approve) PR','ME54N, ME55','ME55 untuk banyak PR sekaligus'],['membuat PO dari PR yang sudah full release','ME21N','referensi PR'],['minta barang gudang disiapkan','MB21','lalu MIGO A07 + R09'],['menahan barang rusak','MIGO','A08 + R10, mvt 344'],['membuang (scrap) barang','MIGO','A07 + R10, mvt 551 / 555'],['melihat PO dan apakah sudah GR/invoice','ME23N','(tab PO history)'],['daftar PO yang belum datang','ME2N, ME2L','+ WE101'],['menerima barang','MIGO','A01 + R01, mvt 101'],['menerima jasa','ML81N'],['mengeluarkan barang ke proyek','MIGO','A07 + R10, mvt 221 + WBS'],['membatalkan dokumen barang','MIGO','A03 + R02'],['cek stok satu gudang','MB52'],['cek stok satu material di semua lokasi','MMBE'],['riwayat pergerakan barang','MB51'],['opname','MI01, MI21, MI04, MI11, MI20, MI07','(berurutan)'],['biaya aktual proyek','CJI3'],['komitmen proyek','CJI5'],['biaya cost center','KSB1'],['data & nilai aset','AS03, AW01N, AR01'],['work order maintenance','IW33, IW38']];
  $('#view').innerHTML=`<h1>Cheat sheet SAP</h1><p class="lead">Satu halaman untuk dibuka saat bekerja. Semua T-code standar; cocokkan dengan akses di perusahaanmu.</p><div class="filt"><label for="refMod" class="muted" style="font-size:13px">T-code & app untuk</label><select id="refMod">${roleOf()?`<option value="jalur">Jalur ${esc(roleOf().t)}</option>`:''}<option value="all">Semua modul</option>${MODULES.map(m=>`<option value="${m.id}">${m.code} · ${esc(shortT(m))}</option>`).join('')}</select></div><div id="refTc"></div><h2 style="margin-top:36px">Detail MM & proyek</h2>
  <h2>Movement type</h2><div class="tbl-wrap"><table><tr><th>Mvt</th><th>Arti</th><th>Objek wajib</th><th>Batal</th></tr><tr><td><b>101</b></td><td>GR terhadap PO</td><td>PO</td><td>102</td></tr><tr><td><b>201</b></td><td>GI ke cost center</td><td>Cost center</td><td>202</td></tr><tr><td><b>221</b></td><td>GI ke proyek/WBS</td><td>WBS</td><td>222</td></tr><tr><td><b>261</b></td><td>GI ke order</td><td>Order</td><td>262</td></tr><tr><td><b>311</b></td><td>Transfer antar sloc</td><td>Sloc tujuan</td><td>312</td></tr><tr><td><b>344</b></td><td>Unrestricted → blocked stock</td><td>Alasan (header text)</td><td>343</td></tr><tr><td><b>343</b></td><td>Blocked → unrestricted</td><td>–</td><td>344</td></tr><tr><td><b>551 / 555</b></td><td>Scrapping dari unrestricted / blocked</td><td>Cost center + reason</td><td>552 / 556</td></tr><tr><td><b>701 / 702</b></td><td>Selisih opname lebih / kurang (dibuat MI07)</td><td>Reason per item</td><td>lewat dokumen opname</td></tr></table></div>
  <h2>"Saya ingin…" → T-code</h2><div class="tbl-wrap"><table><tr><th>Saya ingin…</th><th>T-code</th><th>Catatan</th></tr>${want.map(r=>`<tr><td>${r[0]}</td><td>${r[1].split(', ').map(tc).join(' ')}</td><td>${r[2]||''}</td></tr>`).join('')}</table></div>
  <h2>Navigasi & ALV</h2><div class="tbl-wrap"><table><tr><th>Perintah</th><th>Fungsi</th></tr><tr><td><code>/nXXXX</code></td><td>Pindah transaksi di jendela yang sama</td></tr><tr><td><code>/oXXXX</code></td><td>Buka di jendela baru</td></tr><tr><td><code>Enter · F4 · F8 · F3 · Ctrl+S</code></td><td>Validasi · Pilihan · Execute · Back · Save</td></tr><tr><td>Multiple selection</td><td>Tempel daftar nomor dari Excel (Shift+F12)</td></tr><tr><td>Variant</td><td>Ctrl+S di layar filter; Get Variant: Shift+F5</td></tr><tr><td>ALV</td><td>Klik judul kolom → Sort / Filter / Σ / Export</td></tr></table></div>
  <h2>T-code MM & proyek per kategori</h2><div class="grid g2">${Object.entries(byCat).map(([k,v])=>`<div class="card"><b style="font-family:var(--font-d);font-size:17px">${k}</b>${v.map(c=>`<div style="display:flex;gap:10px;padding:5px 0;border-bottom:1px solid var(--line);font-size:14px"><span style="min-width:62px">${tc(c[0])}</span><span>${c[3]}</span></div>`).join('')}</div>`).join('')}</div>
  <h2>Glosarium</h2><div class="tbl-wrap"><table>${[['PR','Purchase Requisition, permintaan pembelian internal'],['PO','Purchase Order, pesanan resmi ke vendor'],['GR','Goods Receipt, penerimaan barang'],['GI','Goods Issue, pengeluaran barang'],['SES','Service Entry Sheet, penerimaan jasa'],['3-way match','Pencocokan PO, GR, dan invoice sebelum bayar'],['WBS','Work Breakdown Structure, struktur paket pekerjaan proyek'],['AuC','Asset under Construction, aset dalam pengerjaan'],['APC','Acquisition and Production Cost, nilai perolehan aset'],['ALV','Tampilan tabel laporan SAP dengan sort, filter, total, export'],['Komitmen','Nilai PO yang mengikat budget tapi belum terealisasi'],['SPI','Schedule Performance Index = aktual ÷ rencana'],['RAG','Red-Amber-Green, status ringkas proyek'],['Sloc','Storage location, lokasi gudang di dalam plant'],['BAST','Berita Acara Serah Terima']].map(r=>`<tr><td style="width:150px"><b>${r[0]}</b></td><td>${r[1]}</td></tr>`).join('')}</table></div>`;
  const drawRef=()=>{const v=$('#refMod').value;const r=roleOf();const ids=v==='all'?ORDER:v==='jalur'?rolePath(r):[v];
    $('#refTc').innerHTML=ids.map(id=>{const m=MOD[id];const rows=m.lessons.flatMap(l=>l.tcRows||[]);if(!rows.length)return '';return `<h3 style="margin:22px 0 6px;font-size:17px;font-weight:500">${m.code} · ${esc(shortT(m))} ${relPill(relOf(id))}</h3><div class="tbl-wrap"><table><tr><th style="width:34%">T-code / app</th><th>Fungsi</th></tr>${rows.map(r=>`<tr><td>${r[0].split(' / ').map(tcCell).join(' ')}</td><td>${r[1]}</td></tr>`).join('')}</table></div>`;}).join('')||'<p class="muted">Modul ini memakai referensi detail di bawah.</p>';};
  $('#refMod').onchange=drawRef;drawRef();
}

/* ===================== INIT ===================== */
$('#brandMark').innerHTML=`<img src="${MSRC.cic.ava}" alt="" width="42" height="42">`;
$('#menuBtn').onclick=()=>{const s=$('#side');s.classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',s.classList.contains('open'));};
const closeMenu=()=>{$('#side').classList.remove('open');$('#menuBtn').setAttribute('aria-expanded','false');};
$('#nav').addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#side').classList.contains('open')){closeMenu();$('#menuBtn').focus();}});
route();
