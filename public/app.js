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
<tr><td>Company Code</td><td><code>1000</code> PT Contoh Pangan Indonesia</td><td>Entitas legal untuk laporan keuangan</td></tr>
<tr><td>Plant</td><td><code>1100</code> Pabrik Cikarang</td><td>Lokasi pabrik</td></tr>
<tr><td>Storage Location</td><td><code>1101</code> Gudang Sparepart, <code>1102</code> Gudang Proyek</td><td>Lokasi stok di dalam plant</td></tr>
<tr><td>Purchasing Group</td><td><code>P05</code> Project & Engineering</td><td>Buyer/kelompok pembelian</td></tr>
</table></div>
<div class="callout warn"><b>Kode contoh</b>Semua kode di platform ini fiktif. Catat kode asli perusahaanmu saat onboarding.</div>`,
keys:['Company code → Plant → Storage location','Purchasing group = tim buyer'],
cp:cp('"Gudang Proyek" di dalam Pabrik Cikarang adalah contoh…',['Company code','Plant','Storage location','Purchasing group'],2,'Storage location adalah lokasi stok di dalam plant.')},
{t:'Master data yang kamu baca',html:`
<div class="tbl-wrap"><table><tr><th>Data</th><th>Contoh</th><th>Lihat di</th><th>Dipakai untuk</th></tr>
<tr><td>Material</td><td><code>300012457</code> Bearing SKF 6205-2RS</td><td>${tc('MM03')}</td><td>PR, PO, GR, GI, stok</td></tr>
<tr><td>Vendor</td><td><code>200145</code> PT Mitra Teknik Abadi</td><td>${tc('XK03')} / ${tc('BP')}</td><td>PO, invoice</td></tr>
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
<tr><td><b>Leist.</b> / SES</td><td>Service entry untuk jasa.</td></tr>
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
L('Struktur FI dan dokumen akuntansi',{p:['FI mencatat semua transaksi keuangan per <b>company code</b> (satu badan hukum). Akun G/L diambil dari <b>chart of accounts</b>, dan setiap posting masuk ke <b>periode</b> dalam tahun fiskal. Di S/4HANA, semua posting FI dan CO tersimpan di satu tabel, <b>Universal Journal (ACDOCA)</b>, sehingga angka FI dan CO selalu sama.','Setiap dokumen punya <b>header</b> (tanggal dokumen, tanggal posting, document type, referensi) dan <b>line item</b> (akun, debit/kredit lewat posting key, jumlah, objek biaya). Document type menandai sumbernya: SA jurnal umum, KR invoice vendor, KZ pembayaran vendor, DR invoice customer, DZ penerimaan customer, AA transaksi aset, WE goods receipt.'],
tc:[['FS00','Membuat/menampilkan master akun G/L di level chart of accounts dan company code'],['FB03','Menampilkan dokumen akuntansi'],['FAGLL03 / FAGLL03H','Line item akun G/L (open item, cleared item, semua item)'],['FAGLB03','Saldo akun per periode'],['Manage Journal Entries','App Fiori untuk mencari, menampilkan, dan me-reverse jurnal']],
keys:['Company code = entitas hukum; semua posting FI ada di dalamnya','Dokumen = header + line item; total debit harus sama dengan kredit','Document type menunjukkan asal posting (SA, KR, DR, WE, AA)'],
cp:['Kamu melihat dokumen dengan document type KR. Kemungkinan besar dokumen ini berasal dari…',['Invoice vendor','Penerimaan uang dari customer','Penyusutan aset','Goods issue ke cost center'],0,'KR = vendor invoice. Pembayaran vendor memakai KZ, customer invoice DR.']}),
L('Posting jurnal dan tutup buku bulanan',{p:['Jurnal manual dibuat dengan <b>FB50</b> (atau app Post General Journal Entries). Biasakan <b>Simulate</b> sebelum Post untuk melihat akun lawan, pajak, dan objek CO yang terisi. Jurnal yang salah tidak dihapus, melainkan <b>di-reverse</b> dengan FB08 lalu diposting ulang, supaya jejak audit tetap ada.','Tutup buku adalah rangkaian langkah dengan urutan tetap. Langkah yang tertunda di satu tim (misalnya GR yang belum diposting gudang) akan membuat angka akhir bulan salah.'],
flow:[['Cut-off transaksi','GR, GI, invoice diposting'],['Accrual','FBS1, reverse otomatis F.81'],['Penyusutan','AFAB dari tim aset'],['Revaluasi valas','FAGL_FCV'],['Regroup GR/IR','F.19 / FAGL_FCV'],['Settlement CO','KO88, CJ88'],['Tutup periode','OB52 / Manage Posting Periods']],
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
flow:[['Parameter F110','tanggal, vendor, metode'],['Proposal','daftar usulan bayar'],['Review','hapus/blok item'],['Payment run','dokumen KZ'],['File bank','DME / cetak']],
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
L('Membuat sales order',{p:['Di VA01 pilih <b>order type</b> (OR = standard order) dan sales area. Isi sold-to, ship-to, <b>PO number customer</b>, requested delivery date, lalu item material dan qty. SAP otomatis menghitung harga (kondisi PR00, diskon, pajak), menjalankan <b>availability check (ATP)</b>, dan credit check.','Perhatikan <b>incompletion log</b>: jika data wajib belum lengkap (misalnya payment terms atau harga), order tersimpan tapi tidak bisa dikirim atau ditagih. Cek juga blok (credit block, delivery block, billing block) di header.'],
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
tc:[['MD61','Planned independent requirements (forecast)'],['MD01N','MRP Live (S/4HANA)'],['MD02','MRP satu material'],['MD04','Stock/requirements list'],['MD06','Daftar MRP lists dengan exception']],
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
tc:[['QM01 / QM02 / QM03','Membuat / mengubah / menampilkan notification'],['QM10','Daftar notification'],['QGA2','Laporan inspection lot / defect']],
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
tc:[['LT01','Membuat transfer order manual'],['LT03','TO untuk outbound delivery'],['LT12','Konfirmasi TO'],['LB10','Daftar transfer requirement'],['LT22 / LT23','Daftar TO']],
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
tc:[['PPOCE','Membuat struktur organisasi'],['PPOME','Mengubah struktur organisasi'],['PPOSE','Menampilkan struktur'],['S_AHR_61016362','Laporan struktur organisasi']],
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
 aa.lessons.push(L('Siklus aset dari sisi Finance',{p:['Tim aset di Finance mengelola seluruh umur aset: <b>akuisisi</b> (aset dibuat di AS01 dan nilai masuk lewat MIRO, F-90, atau settlement AuC), <b>penyusutan</b> bulanan dengan <b>AFAB</b> berdasarkan depreciation key dan umur manfaat, <b>transfer</b> antar cost center atau company code (ABUMN), dan <b>retirement</b> saat aset dijual atau dibuang (ABAON dengan pendapatan, ABAVN tanpa pendapatan).','Satu aset bisa punya beberapa <b>depreciation area</b>, misalnya buku komersial dan pajak, dengan umur dan metode berbeda. Asset Explorer (AW01N) menampilkan nilai per area dan per tahun.'],
 flow:[['AS01','master aset'],['Akuisisi','MIRO / F-90 / AIBU'],['AFAB','penyusutan bulanan'],['ABUMN','transfer'],['ABAON / ABAVN','retirement'],['AJAB','tutup tahun aset']],
 tc:[['AS01 / AS02 / AS03','Membuat / mengubah / menampilkan aset'],['AFAB','Depreciation run'],['ABUMN','Transfer aset dalam company code'],['ABAON / ABAVN','Retirement dengan / tanpa pendapatan'],['AR01','Asset balances (daftar aset)']],
 integ:'Penyusutan AFAB memposting beban ke cost center di master aset. Jika aset dipindah fisik tanpa ABUMN/perubahan cost center, beban penyusutan jatuh ke departemen yang salah.',
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
'fi-gl':[['Universal Journal (ACDOCA)','Tabel tunggal FI dan CO di S/4HANA'],['Document type','Jenis dokumen: SA, KR, KZ, DR, DZ, WE, AA'],['Posting period','Periode akuntansi yang dibuka/ditutup'],['FSV','Financial Statement Version']],
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
bwart:[['101','GR goods receipt'],['102','GR reversal'],['201','GI for cost center'],['221','GI for project'],['261','GI for order'],['311','TF trfr within plant']],
selpa:[['WE101','Open goods receipt'],['WE103','Open GR, delivery date reached'],['','(kosong) tanpa filter status']],
pspid:[['P-26-014','Instalasi Conveyor Line 3'],['P-26-009','Renovasi Ruang Mixing']],
bukrs:[['1000','PT Contoh Pangan Indonesia']],
dbprof:[['000000000001','Standard (all fields)'],['000000000012','Cost and commitment']],
ebeln:[['4500021873','PT Mitra Teknik Abadi'],['4500021880','CV Sinar Elektrik'],['4500021902','PT Duta Konveyor'],['4500021915','PT Duta Konveyor (jasa commissioning)']],
anln1:[['4000012','Mesin Filling Line 2 (AuC)'],['4000009','Renovasi Mixing (AuC)'],['1200345','Conveyor Line 1']],
kostl:[['11PRD300','Produksi Line 1'],['11PRD310','Produksi Line 3'],['11PRD320','Produksi Line 2'],['11ENG100','Engineering']],
equnr:[['10004521','Conveyor Line 3'],['10004388','Filling Machine Line 2'],['10003990','Mixer 2000L']],
mblnr:[['4900061498','03.11.2026 · 201 · ROLLER CONVEYOR'],['4900061210','21.10.2026 · 221 · ROLLER CONVEYOR'],['5000187001','28.10.2026 · 101 · ROLLER CONVEYOR']]
};
const ACT=[['A01','Goods Receipt'],['A07','Goods Issue'],['A08','Transfer Posting'],['A03','Cancellation'],['A04','Display']];
const REF=[['R01','Purchase Order'],['R02','Material Document'],['R10','Other']];
const FAVS=['ME51N','ME5A','ME23N','ME2N','ML81N','MIGO','MB52','MMBE','MB51','MM03','MI01','MI04','MI20','CJI3','CJI5','KSB1','AS03','AW01N','IW38'];
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
function migoTitle(v){return ({A01:'Goods Receipt',A07:'Goods Issue',A08:'Transfer Posting',A03:'Cancellation',A04:'Display'}[v.act]||'Goods Movement')+' '+({R01:'Purchase Order',R02:'Material Document',R10:'Other'}[v.ref]||'');}
function migoDefault(v){
  const k=v.act+'|'+v.ref; const map={'A01|R01':'101','A07|R10':'201','A08|R10':'311','A03|R02':''};
  v.bwart=map[k]??v.bwart;
  ['it.0.mat','it.0.txt','it.0.qty','it.0.un','it.0.lgort','it.0.werks','it.0.poqty','it.0.po','it.0.vendor','it.0.stock','it.0.wbs','it.0.ok','it.0.umlgo','it.0.wbs_po','_acctP','_stockSel','it.0.insmk'].forEach(f=>delete v[f]);
}
function migoScreen(o){
  return {title:migoTitle,go:'save',checkOk:'Document is O.K.',saveLabel:'Post',
  def:Object.assign({act:'A01',ref:'R01',bwart:'101',bldat:TODAY,budat:TODAY},o.def||{}),
  blocks:[
    {t:'bar',fields:[{id:'act',t:'sel',opts:ACT,redraw:1,onChange:migoDefault,l:'Action'},{id:'ref',t:'sel',opts:REF,redraw:1,onChange:migoDefault,l:'Reference'},{id:'po',l:'Purchase Order',w:12,f4:'ebeln',ph:'Purchase Order',show:v=>v.ref==='R01'},{id:'mblnr',l:'Material Document',w:12,ph:'Material Doc.',f4:'mblnr',show:v=>v.ref==='R02'},{id:'bwart',l:'Movement Type',w:4,f4:'bwart',lab:'Mvt',redraw:1}]},
    {t:'tabs',key:'hdr',title:'Header',tabs:[{l:'General',fields:[{id:'bldat',l:'Document Date',w:10},{id:'budat',l:'Posting Date',w:10},{id:'lfsnr',l:'Delivery Note',w:16},{id:'bktxt',l:'HeaderText',w:24}]}]},
    {t:'items',key:'it',title:'Item Overview',rows:1,cols:[
      {id:'line',l:'Line',ro:1,v:r=>r+1},{id:'txt',l:'Mat. Short Text',ro:1},{id:'ok',l:'OK',t:'chk'},
      {id:'mat',l:'Material',w:11,f4:'matnr',show:v=>v.ref==='R10'},{id:'qty',l:'Qty in UnE',w:7},{id:'un',l:'EUn',ro:1},
      {id:'werks',l:'Plnt',w:5,f4:'werks',show:v=>v.ref==='R10'},{id:'lgort',l:'SLoc',w:5,f4:'lgort'},{id:'umlgo',l:'Recv. SLoc',w:5,f4:'lgort',show:v=>norm(v.bwart)==='311'}]},
    {t:'tabs',key:'det',title:v=>'Line 1  '+(v['it.0.txt']||''),tabs:[
      {l:'Material',fields:[{id:'it.0.mat',l:'Material',t:v=>v.ref==='R10'?'txt':'ro',w:11,f4:'matnr'},{id:'it.0.txt',l:'Short text',t:'ro'}]},
      {l:'Quantity',fields:[{id:'it.0.qty',l:'Qty in Unit of Entry',w:8},{id:'it.0.poqty',l:'Qty Ordered',t:'ro',show:v=>v.ref==='R01'}]},
      {l:'Where',fields:[{id:'bwart',l:'Movement Type',t:'ro'},{id:'it.0.werks',l:'Plant',t:v=>v.ref==='R10'?'txt':'ro',w:5,f4:'werks'},{id:'it.0.lgort',l:'Storage Location',w:5,f4:'lgort'},{id:'it.0.stock',l:'Stock type',t:'ro',show:v=>!v._stockSel},{id:'it.0.insmk',l:'Stock type',t:'sel',opts:[['','Unrestricted use'],['2','Quality inspection'],['3','Blocked stock']],show:v=>!!v._stockSel},{id:'it.0.umlgo',l:'Receiving Stor. Loc.',w:5,f4:'lgort',show:v=>norm(v.bwart)==='311'}]},
      {l:'Account Assignment',show:v=>['201','221','261'].includes(norm(v.bwart))||!!v._acctP,fields:[{id:'it.0.wbs_po',l:'WBS Element (from PO)',t:'ro',show:v=>!!v._acctP},{id:'it.0.kostl',l:'Cost Center',w:10,f4:'kostl',show:v=>norm(v.bwart)==='201'},{id:'it.0.wbs',l:'WBS Element',w:14,f4:'posid',show:v=>norm(v.bwart)==='221'},{id:'it.0.aufnr',l:'Order',w:10,f4:'pmord',show:v=>norm(v.bwart)==='261'}]},
      {l:'Purchase Order Data',show:v=>v.ref==='R01',fields:[{id:'it.0.po',l:'Purchase Order',t:'ro'},{id:'it.0.vendor',l:'Vendor',t:'ro'}]}],
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
  blocks:[{t:'kv',rows:[['Vendor','200178 CV Sinar Elektrik'],['Doc. date','21.10.2026'],['Purch. Group','P05'],['Plant','1100']]},
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
  return {fill:{'it.0.mat':'300012457','it.0.txt':'BEARING SKF 6205-2RS','it.0.qty':'10','it.0.poqty':'10 PC','it.0.un':'PC','it.0.lgort':'1101','it.0.werks':'1100','it.0.stock':'Unrestricted use','it.0.po':'4500021873 / 10','it.0.vendor':'200145 PT Mitra Teknik Abadi'},msg:['I','Item data adopted from purchase order 4500021873'],explain:'Item terisi otomatis dari PO dengan qty yang dipesan (10). Sekarang sesuaikan dengan barang yang benar-benar datang.'};},
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
  {t:'kv',rows:[['Purchase Order','4500021915 / 10'],['Vendor','200210 PT Duta Konveyor'],['Item text','Jasa commissioning conveyor L3'],['WBS Element','P-26-014.03'],['Value limit','16.000.000 IDR']]},
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
  {t:'table',title:'Stock overview',h:['Client/Company Code/Plant/Storage Location','Unrestricted use','Qual. inspection','Blocked','On-Order Stock'],r:[['▾ Full','12','3','0','10'],['  ▾ 1000 PT Contoh Pangan Indonesia','12','3','0','10'],['    ▾ 1100 Pabrik Cikarang','6','3','0','10'],['        1101 Gudang Sparepart','0','3','0',''],['        1102 Gudang Proyek','6','0','0',''],['    ▾ 1200 Pabrik Surabaya','6','0','0','0'],['        1201 Gudang Sparepart SBY','6','0','0','']]}]}]},
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
  return {fill:{_acctP:true,'it.0.mat':'300045001','it.0.txt':'BELT CONVEYOR EP400','it.0.qty':'1','it.0.poqty':'1 PC','it.0.un':'PC','it.0.lgort':'','it.0.werks':'1100','it.0.stock':'– (consumption, acct. assignment P)','it.0.po':'4500021902 / 10','it.0.vendor':'200210 PT Duta Konveyor','it.0.wbs_po':'P-26-014.02'},msg:['I','Item data adopted from purchase order 4500021902'],explain:'PO ini punya account assignment P. Lihat tab Account Assignment: WBS terbawa dari PO.'};},
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
  return {fill:{'it.0.mat':'300045002','it.0.txt':'BELT FOOD GRADE PU 2MM','it.0.qty':'30','it.0.poqty':'30 M','it.0.un':'M','it.0.lgort':'1102','it.0.werks':'1100','it.0.insmk':'','it.0.po':'4500021925 / 10','it.0.vendor':'200233 PT Food Belt Indonesia',_stockSel:true},msg:['I','Item data adopted from purchase order 4500021925']};},
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
  return {fill:{'it.0.mat':'300022105','it.0.txt':'KABEL NYY 4X16','it.0.qty':'120','it.0.poqty':'200 M (open 120 M)','it.0.un':'M','it.0.lgort':'1102','it.0.werks':'1100','it.0.stock':'Unrestricted use','it.0.po':'4500021880 / 10','it.0.vendor':'200178 CV Sinar Elektrik'},msg:['I','Item data adopted from purchase order 4500021880'],explain:'SAP mengusulkan qty yang masih terbuka: 120 M.'};},
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
 blocks:[{t:'kv',rows:[['Vendor','200145 PT Mitra Teknik Abadi'],['Doc. date','21.10.2026'],['Purch. Group','P05'],['Plant','1100']]},
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
const VEND={'300012457':'200145 PT Mitra Teknik Abadi','300012458':'200145 PT Mitra Teknik Abadi','300019920':'200145 PT Mitra Teknik Abadi','300015577':'200145 PT Mitra Teknik Abadi','300022105':'200178 CV Sinar Elektrik','300045001':'200210 PT Duta Konveyor','300040220':'200210 PT Duta Konveyor','300045002':'200233 PT Food Belt Indonesia','300050400':'200251 PT Baja Inox','300050310':'200260 CV Mur Baut Jaya','300031150':'200272 PT Roller Jaya'};
const SLOCS={'1100':['1101','1102','1103'],'1200':['1201']};
const SL_NAME={'1101':'Gudang Sparepart','1102':'Gudang Proyek','1103':'Gudang Bahan Baku','1201':'Gudang Sparepart SBY'};
const VALID={kostl:()=>F4.kostl.map(x=>x[0]),wbs:()=>F4.posid.map(x=>x[0]).filter(x=>x.includes('.')),order:()=>F4.pmord.map(x=>x[0]),asset:()=>['4000012','4000009'],ekgrp:()=>F4.ekgrp.map(x=>x[0])};

function sbxSeed(){
  const st={};const put=(m,sl,u,q,b)=>st[m+'|'+sl]={unr:u||0,qi:q||0,blk:b||0};
  put('300012457','1101',6);put('300012458','1101',4);put('300019920','1101',12);put('300015577','1101',0,3);put('300015577','1102',6);
  put('300022105','1101',40);put('300022105','1102',20);put('300031150','1101',4);put('300031150','1102',4);put('300050310','1102',150);put('300040220','1102',0,0,1);
  const it=(o)=>Object.assign({it:'10',werks:'1100',lgort:'',knttp:'',obj:'',gr:0,iv:null},o);
  return {v:1,stock:st,
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
   nums:{pr:10004600,po:4500022000,mdi:5000188000,mdo:4900062000,iv:5105600300},log:[],flags:{}};
}
function DB(){if(!S.sandbox||S.sandbox.v!==1){S.sandbox=sbxSeed();save();}return S.sandbox;}
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
  SIM={free:true,sc:{id:'free',title:'Mode bebas – latihan SAP sesukamu',mod:'Bebas',brief:{from:'',msg:''},steps:[]},step:0,scr:0,where:LOGGED?'easy':'logon',other:null,vals:{},lv:{client:'800',lang:'EN'},tabs:{},alv:{},
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
ME51N:{tip:'Isi item di Item Overview, tekan Enter, lalu lengkapi tab Account Assignment. Account assignment: kosong (stok), K, P, F, atau A.',screens:()=>[{title:'Create Purchase Requisition',go:'save',checkOk:'No messages issued during check',def:{bsart:'NB'},req:['it.0.mat','it.0.qty','it.0.date','it.0.werks','it.0.ekgrp'],
 blocks:[{t:'bar',fields:[{id:'bsart',l:'Document type',t:'sel',opts:[['NB','Purchase Requisition']]},{id:'srcdet',l:'Source determination',t:'chk'}]},
  {t:'items',key:'it',title:'Item Overview',rows:1,cols:[{id:'itm',l:'Itm',ro:1,v:()=>'10'},{id:'knttp',l:'A',w:2,f4:'knttp'},{id:'mat',l:'Material',w:11,f4:'matnr'},{id:'txt',l:'Short Text',ro:1},{id:'qty',l:'Quantity',w:6},{id:'un',l:'Un',ro:1},{id:'date',l:'Deliv. Date',w:10},{id:'werks',l:'Plant',w:5,f4:'werks'},{id:'lgort',l:'SLoc',w:5,f4:'lgort'},{id:'ekgrp',l:'PGr',w:4,f4:'ekgrp'}]},
  {t:'tabs',key:'det',title:v=>'Item  [ 10 ]  '+(v['it.0.mat']||'')+'  '+(v['it.0.txt']||''),tabs:[
   {l:'Material Data',fields:[{id:'it.0.mat',l:'Material',t:'ro'},{id:'it.0.txt',l:'Short text',t:'ro'},{id:'it.0.mg',l:'Material Group',t:'ro'}]},
   {l:'Quantities/Dates',fields:[{id:'it.0.qty',l:'Quantity',w:8},{id:'it.0.date',l:'Delivery date',w:10}]},
   {l:'Valuation',fields:[{id:'it.0.price',l:'Valuation Price (IDR)',t:'ro'}]},
   {l:'Account Assignment',fields:[{id:'it.0.knttp',l:'Acct Assignment Cat.',t:'ro'},{id:'it.0.obj',l:'WBS / Cost Ctr / Order / Asset',w:14,f4:'posid'},{id:'it.0.gl',l:'G/L Account',t:'ro'}]},
   {l:'Contact Person',fields:[{id:'it.0.afnam',l:'Requisitioner',w:12}]}]}],
 onEnter:v=>{const out={};if(v['it.0.mat']){const f=matFill('it.0.',v);if(!f)return {msg:['E',`Material ${norm(v['it.0.mat'])} does not exist`],explain:'Pakai F4 untuk mencari material.'};Object.assign(out,f);}const k=norm(v['it.0.knttp']);out['it.0.gl']=k==='P'||k==='F'?'510100':k==='K'?'510200':k==='A'?'(asset)':'';return {fill:out};},
 onGo:v=>{const k=norm(v['it.0.knttp']);
  if(!['','K','P','F','A'].includes(k))return E(`Account assignment category ${k} does not exist`,'Pilihan: kosong (stok), K, P, F, A (F4).','it.0.knttp');
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
  const no=nextNo('pr');const M=MAT[norm(v['it.0.mat'])];
  DB().pr.unshift({no,mat:norm(v['it.0.mat']),qty:q,date:v['it.0.date'],werks:norm(v['it.0.werks']),lgort:norm(v['it.0.lgort']),ekgrp:g,knttp:k,obj:norm(v['it.0.obj']),rel:'Not released',po:'',req:norm(v['it.0.afnam'])||userNm(),user:true});
  sbxLog('PR',no,`${M.d} ${q} ${M.u}${k?` · ${k} ${norm(v['it.0.obj'])}`:' · stok'}`);flag('pr');sbxSave();
  return {reset:true,msg:['S',`Purchase requisition number ${no} created`],explain:{t:'s',m:`PR ${no} tersimpan dan menunggu approval. Pakai tombol "Approve → PO" di panel kiri (simulasi approver & Procurement), lalu cek di ME5A atau ME2N.`}};}}]},
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
MIGO:{keep:['act','ref','bwart'],tip:'Action + Reference menentukan jenis transaksi: A01/R01 GR terhadap PO, A07/R10 goods issue, A08/R10 transfer, A03/R02 pembatalan. Enter dulu, lalu Item OK, Check, Post.',screens:()=>[migoFree()]},
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
F4.sbx_po=()=>DB().po.map(p=>[p.no,p.vend.replace(/^\d+ /,'')+' · '+p.items.map(i=>MAT[i.mat].d).join(', ')]);
F4.sbx_doc=()=>DB().docs.filter(d=>!d.cancelled&&['101','201','221','261','311'].includes(d.mvt)).map(d=>[d.no,`${d.pd} · ${d.mvt} · ${MAT[d.mat].d} ${d.qty}`]);

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

function migoFree(){
  const s=migoScreen({def:{}});
  s.blocks[0].fields.forEach(f=>{if(f.id==='po')f.f4='sbx_po';if(f.id==='mblnr')f.f4='sbx_doc';});
  s.req=['po','it.0.qty'];
  s.onEnter=v=>{
    if(!ACT_NAME[v.act])return {msg:['E',`Action ${v.act} is not available in Mode bebas`],explain:'Gunakan A01, A07, A08, atau A03.'};
    if(v.act==='A01'){if(v.ref!=='R01')return {msg:['E','Goods receipt in Mode bebas needs reference R01 Purchase Order'],explain:'Pilih R01 Purchase Order.'};
      if(!v.po)return {msg:['E','Enter a purchase order number'],explain:'Isi nomor PO (F4).'};const p=findPO(v.po);if(!p)return {msg:['E',`Purchase order ${norm(v.po)} does not exist`],explain:'Pakai F4 untuk melihat PO yang ada.'};
      const i=p.items[0],open=i.qty-i.gr;if(open<=0)return {msg:['E',`PO ${p.no}: no open items for goods receipt (delivery completed)`],explain:'PO ini sudah diterima penuh.'};
      if(v['it.0.po']===p.no+' / 10')return null;
      return {fill:{'it.0.mat':i.mat,'it.0.txt':MAT[i.mat].d,'it.0.qty':String(open),'it.0.poqty':`${i.qty} ${MAT[i.mat].u} (open ${open})`,'it.0.un':MAT[i.mat].u,'it.0.lgort':i.lgort,'it.0.werks':i.werks,'it.0.po':p.no+' / 10','it.0.vendor':p.vend,_acctP:i.knttp==='P','it.0.wbs_po':i.obj,_stockSel:!i.knttp,'it.0.insmk':'','it.0.stock':i.knttp?'– (consumption, acct. assignment '+i.knttp+')':'Unrestricted use'},msg:['I',`Item data adopted from purchase order ${p.no}`]};}
    if(v.act==='A03'){if(v.ref!=='R02')return {msg:['E','Cancellation needs reference R02 Material Document']};const d=DB().docs.find(x=>x.no===norm(v.mblnr));
      if(!d)return {msg:['E',`Material document ${norm(v.mblnr)||'(blank)'} does not exist`],explain:'Pakai F4 atau cari di MB51.'};if(d.cancelled)return {msg:['E',`Material document ${d.no} has already been cancelled`]};if(!['101','201','221','261','311'].includes(d.mvt))return {msg:['E',`Movement type ${d.mvt} cannot be cancelled here`]};
      return {fill:{bwart:String(+d.mvt+1),'it.0.mat':d.mat,'it.0.txt':MAT[d.mat].d,'it.0.qty':String(Math.abs(d.qty)),'it.0.un':MAT[d.mat].u,'it.0.lgort':d.sl,'it.0.werks':'1100','it.0.stock':'Unrestricted use'},msg:['I',`Data adopted from material document ${d.no}`]};}
    if(v.ref!=='R10')return {msg:['E',`${ACT_NAME[v.act]} in Mode bebas needs reference R10 Other`]};
    if(v['it.0.mat']){const M=MAT[norm(v['it.0.mat'])];if(!M)return {msg:['E',`Material ${norm(v['it.0.mat'])} does not exist`],explain:'Pakai F4.'};return {fill:{'it.0.txt':M.d,'it.0.un':M.u,'it.0.stock':'Unrestricted use'}};}
    return null;};
  s.onGo=v=>{
    const okI=()=>v['it.0.ok']?null:E('No items selected – set Item OK','Centang Item OK di tabel item atau di bawah detail item.','it.0.ok');
    const usr=userNm();
    if(v.act==='A01'){const p=findPO(v.po);if(!p)return E('Enter a purchase order number','Isi nomor PO lalu Enter.','po');if(!v['it.0.txt'])return E('Press Enter to adopt the purchase order items','Tekan Enter setelah mengisi nomor PO.','po');
      const i=p.items[0],M=MAT[i.mat],open=i.qty-i.gr;const [q,eq]=vQty(v['it.0.qty'],'it.0.qty');if(eq)return eq;
      if(norm(v.bwart)!=='101')return E(`Movement type ${norm(v.bwart)} is not allowed for goods receipt for purchase order`,'GR terhadap PO = 101.','bwart');
      if(q>open)return E(`PO quantity exceeded by ${q-open} ${M.u} : ${i.mat} ${p.no} 00010`,`Sisa PO hanya ${open} ${M.u} dan tidak ada toleransi over-delivery.`,'it.0.qty');
      let e=vSloc(i.werks,v['it.0.lgort'],'it.0.lgort',!i.knttp);if(e)return e;e=okI();if(e)return e;
      const no=nextNo('mdi');i.gr+=q;
      if(!i.knttp){const s0=stk(i.mat,norm(v['it.0.lgort']));const t=v['it.0.insmk']==='2'?'qi':v['it.0.insmk']==='3'?'blk':'unr';s0[t]+=q;}
      else DB().cost.push({obj:i.obj,ce:'510100',cen:'Material proyek',val:q*i.price,ref:no,pd:TODAY,txt:`${M.d} (GR 101, PO ${p.no})`});
      DB().docs.unshift({no,pd:TODAY,mvt:'101',mat:i.mat,qty:q,sl:norm(v['it.0.lgort']),obj:i.obj,ref:p.no,usr,val:q*i.price,ins:v['it.0.insmk']||''});
      sbxLog('GR',no,`PO ${p.no} · ${M.d} ${q} ${M.u}${i.knttp?' → '+i.obj:' → sloc '+norm(v['it.0.lgort'])+(v['it.0.insmk']==='2'?' (QI)':v['it.0.insmk']==='3'?' (blocked)':'')}`);flag('gr');sbxSave();
      return {reset:true,msg:['S',`Material document ${no} posted`],explain:{t:'s',m:i.knttp?`Biaya ${fmtRp(q*i.price)} langsung masuk ke ${i.obj} (cek CJI3) dan komitmen di CJI5 berkurang.`:`Stok bertambah ${q} ${M.u} (cek MMBE/MB52). Sisa PO: ${i.qty-i.gr} ${M.u}.`}};}
    if(v.act==='A03'){const d=DB().docs.find(x=>x.no===norm(v.mblnr));if(!d||!v['it.0.txt'])return E('Enter a material document and press Enter','Isi nomor dokumen lalu Enter.','mblnr');let e=okI();if(e)return e;
      const M=MAT[d.mat],q=Math.abs(d.qty);
      if(d.mvt==='101'&&!d.obj){const s0=stk(d.mat,d.sl);const t=d.ins==='2'?'qi':d.ins==='3'?'blk':'unr';if(s0[t]<q)return E(`Deficit of SL ${t==='unr'?'Unrestricted-use':t==='qi'?'Quality inspection':'Blocked stock'} ${q-s0[t]} ${M.u} : ${d.mat} 1100 ${d.sl}`,'Stok sudah terpakai sehingga GR tidak bisa dibatalkan penuh.','it.0.qty');s0[t]-=q;}
      if(d.mvt==='311'){const s1=stk(d.mat,d.to);if(s1.unr<q)return E(`Deficit of SL Unrestricted-use ${q-s1.unr} ${M.u} : ${d.mat} 1100 ${d.to}`,'Stok di sloc tujuan sudah terpakai.','it.0.qty');s1.unr-=q;stk(d.mat,d.sl).unr+=q;}
      if(['201','221','261'].includes(d.mvt))stk(d.mat,d.sl).unr+=q;
      if(d.mvt==='101'&&d.ref){const p=findPO(d.ref);if(p)p.items[0].gr-=q;}
      const no=nextNo(d.mvt==='101'?'mdi':'mdo');
      DB().cost.filter(c=>c.ref===d.no).forEach(c=>DB().cost.push({obj:c.obj,ce:c.ce,cen:c.cen,val:-c.val,ref:no,pd:TODAY,txt:`Reversal of ${d.no}`}));
      d.cancelled=true;DB().docs.unshift({no,pd:TODAY,mvt:String(+d.mvt+1),mat:d.mat,qty:-d.qty,sl:d.sl,obj:d.obj,ref:d.ref,usr,val:d.val,rev:d.no});
      sbxLog('Cancel',no,`Batal ${d.no} (mvt ${d.mvt} → ${+d.mvt+1}) · ${M.d} ${q} ${M.u}${v.bktxt?' · '+v.bktxt:''}`);flag('cancel');sbxSave();
      return {reset:true,msg:['S',`Material document ${no} posted`],explain:{t:'s',m:`Dokumen ${d.no} dibatalkan dengan movement ${+d.mvt+1}. Stok dan biaya sudah dibalik; cek MB51 / MMBE / CJI3.`}};}
    // GI & transfer
    const bw=norm(v.bwart);
    if(v.act==='A07'&&!['201','221','261'].includes(bw))return E(`Movement type ${bw||'(blank)'} is not allowed with action Goods Issue`,'Untuk Goods Issue pakai 201 (cost center), 221 (WBS), atau 261 (order).','bwart');
    if(v.act==='A08'&&bw!=='311')return E(`Movement type ${bw||'(blank)'} is not allowed with action Transfer Posting`,'Transfer antar sloc dalam satu plant = 311.','bwart');
    let e=vMat(v['it.0.mat'],'it.0.mat');if(e)return e;const m=norm(v['it.0.mat']),M=MAT[m];
    if(!v['it.0.txt'])return E('Press Enter to check the item','Tekan Enter setelah mengisi material.','it.0.mat');
    const [q,eq]=vQty(v['it.0.qty'],'it.0.qty');if(eq)return eq;
    e=vPlant(v['it.0.werks'],'it.0.werks');if(e)return e;e=vSloc(v['it.0.werks'],v['it.0.lgort'],'it.0.lgort',true);if(e)return e;
    const sl=norm(v['it.0.lgort']),s0=stk(m,sl);
    if(bw==='311'){const to=norm(v['it.0.umlgo']);e=vSloc(v['it.0.werks'],to,'it.0.umlgo',true);if(e)return e;if(to===sl)return E('Receiving storage location must differ from issuing storage location','Isi sloc tujuan yang berbeda (tab Where).','it.0.umlgo');}
    if(bw==='201'){e=vObj('K',v['it.0.kostl'],'it.0.kostl');if(e)return e;}
    if(bw==='221'){e=vObj('P',v['it.0.wbs'],'it.0.wbs');if(e)return e;}
    if(bw==='261'){e=vObj('F',v['it.0.aufnr'],'it.0.aufnr');if(e)return e;}
    if(s0.unr<q)return E(`Deficit of SL Unrestricted-use ${q-s0.unr} ${M.u} : ${m} ${norm(v['it.0.werks'])} ${sl}`,`Stok unrestricted di sloc ${sl} hanya ${s0.unr} ${M.u}.${s0.qi?` Ada ${s0.qi} ${M.u} di quality inspection (belum boleh dipakai).`:''} Cek MMBE untuk lokasi lain.`,'it.0.qty');
    e=okI();if(e)return e;
    const no=nextNo('mdo');s0.unr-=q;let obj='',to='';
    if(bw==='311'){to=norm(v['it.0.umlgo']);stk(m,to).unr+=q;}
    else{obj=norm(bw==='201'?v['it.0.kostl']:bw==='221'?v['it.0.wbs']:v['it.0.aufnr']);DB().cost.push({obj,ce:bw==='221'?'510100':'510200',cen:bw==='221'?'Material proyek':'Sparepart & consumable',val:q*M.p,ref:no,pd:TODAY,txt:`${M.d} x${q} (GI ${bw})`});}
    DB().docs.unshift({no,pd:TODAY,mvt:bw,mat:m,qty:-q,sl,obj:obj||(to?'→ '+to:''),to,ref:'',usr,val:q*M.p});
    sbxLog(bw==='311'?'Transfer':'GI',no,`${M.d} ${q} ${M.u} · ${sl}${to?' → '+to:' → '+obj}`);flag(bw==='311'?'tr311':bw==='221'?'gi221':'gi');sbxSave();
    return {reset:true,msg:['S',`Material document ${no} posted`],explain:{t:'s',m:bw==='311'?`Stok pindah ${sl} → ${to}. Tidak ada biaya baru.`:`Stok ${sl} berkurang ${q} ${M.u}; biaya ${fmtRp(q*M.p)} masuk ke ${obj} (${bw==='221'?'CJI3':bw==='201'?'KSB1':'order'}).`}};};
  return s;
}

/* ---------- coach panel & other-party actions ---------- */
const MISSIONS=[['pr','Buat PR di ME51N (coba juga account assignment P + WBS)'],['approve','Setujui PR jadi PO lewat tombol "Approve → PO"'],['me23n','Buka PO di ME23N dan baca tab PO History'],['gr','Terima barang dari PO di MIGO (A01 + R01)'],['gi221','Keluarkan material ke WBS (A07 + R10, mvt 221)'],['tr311','Pindahkan stok antar gudang (A08, mvt 311)'],['cancel','Batalkan dokumen yang salah (A03 + R02)'],['stock','Cek dampaknya di MMBE atau MB52'],['cji3','Cek biaya proyek di CJI3'],['invoice','Simulasikan invoice vendor dan lihat 3-way match di ME23N']];
function freeCoachH(){
  const d=DB();const F=d.flags;const done=MISSIONS.filter(m=>F[m[0]]).length;
  const exp=SIM.explain?(typeof SIM.explain==='object'?SIM.explain:{t:SIM.msg[0].toLowerCase(),m:SIM.explain}):null;
  const prs=d.pr.filter(p=>p.rel==='Not released').slice(0,4);
  const ivs=d.po.filter(p=>{const i=p.items[0];return i.gr>0&&(!i.iv||i.iv.qty<i.qty);}).slice(0,4);
  return `<div class="card"><h4>Mode bebas</h4><p style="font-size:13.5px;margin:0">Lakukan transaksi apa saja. Setiap posting mengubah data latihan (stok, PO, dokumen, biaya) dan tersimpan di browser ini. Transaksi yang tersedia: ${Object.keys(SBX).map(tc).join(' ')}</p></div>
  ${exp&&(S.simMode==='guided'||exp.t==='s')?`<div class="explain ${exp.t==='e'?'':exp.t}"><b>${exp.t==='e'?'Arti pesan error':exp.t==='w'?'Arti warning':exp.t==='s'?'Berhasil':'Info'}:</b> ${esc(exp.m)}</div>`:''}
  <div class="card"><h4>Ide latihan <span class="pill ${done===MISSIONS.length?'ok':''}" style="margin-left:6px">${done}/${MISSIONS.length}</span></h4><ul class="glist">${MISSIONS.map(m=>`<li class="${F[m[0]]?'ok':''}"><span class="gk">${F[m[0]]?'✓':''}</span><span>${esc(m[1])}</span></li>`).join('')}</ul></div>
  <div class="card"><h4>Aksi pihak lain (simulasi)</h4><p class="muted" style="font-size:12.5px;margin:0 0 6px">Yang biasanya dikerjakan approver, Procurement, dan vendor.</p>
   ${prs.length?prs.map(p=>`<div class="spread" style="padding:5px 0;border-bottom:1px dashed var(--line);font-size:13px"><span>PR <b>${p.no}</b> · ${esc(MAT[p.mat].d)} ${p.qty} ${MAT[p.mat].u}</span><button class="btn sm" data-sbx="approve:${p.no}">Approve → PO</button></div>`).join(''):'<p class="muted" style="font-size:13px;margin:4px 0">Tidak ada PR yang menunggu approval. Buat PR di ME51N.</p>'}
   ${ivs.map(p=>`<div class="spread" style="padding:5px 0;border-bottom:1px dashed var(--line);font-size:13px"><span>PO <b>${p.no}</b> · GR ${p.items[0].gr}/${p.items[0].qty}</span><button class="btn sm ghost" data-sbx="invoice:${p.no}">Vendor kirim invoice</button></div>`).join('')}</div>
  <div class="card"><h4>Dokumen terakhir</h4>${d.log.length?`<ul class="glist">${d.log.slice(0,7).map(l=>`<li><span class="pill" style="min-width:58px;justify-content:center">${esc(l.t)}</span><span><b>${esc(l.no)}</b><small>${esc(l.x)}</small></span></li>`).join('')}</ul>`:'<p class="muted" style="font-size:13px;margin:0">Belum ada dokumen yang kamu buat.</p>'}
   <div class="row" style="margin-top:10px"><button class="btn sm ghost" data-sbx="reset">${SIM.confirmReset?'Klik lagi untuk reset semua data':'Reset data latihan'}</button></div></div>
  <div class="mode-sw" role="group" aria-label="Mode bantuan"><button data-mode="guided" class="${S.simMode==='guided'?'on':''}">Dengan penjelasan</button><button data-mode="exam" class="${S.simMode==='exam'?'on':''}">Tanpa penjelasan</button></div>`;
}
function sbxAction(a){
  const d=DB();const [k,arg]=a.split(':');
  if(k==='reset'){if(!SIM.confirmReset){SIM.confirmReset=true;return drawSim();}S.sandbox=sbxSeed();save();SIM.confirmReset=false;SIM.where='easy';resetTx();setMsg('S','Training data reset',{t:'s',m:'Semua data latihan kembali ke kondisi awal.'});return drawSim();}
  SIM.confirmReset=false;
  if(k==='approve'){const p=d.pr.find(x=>x.no===arg);if(!p)return;const no=nextNo('po');p.rel='Released';p.po=no;const M=MAT[p.mat];
    d.po.unshift({no,vend:VEND[p.mat]||'200145 PT Mitra Teknik Abadi',ekgrp:p.ekgrp,bedat:TODAY,items:[{it:'10',mat:p.mat,qty:p.qty,price:M.p,werks:p.werks,lgort:p.lgort||(p.werks==='1100'?'1102':'1201'),knttp:p.knttp==='P'?'P':p.knttp,obj:p.obj,gr:0,iv:null,deliv:p.date}]});
    sbxLog('PO',no,`dari PR ${p.no} · ${VEND[p.mat]||''}`);flag('approve');sbxSave();
    setMsg('S',`PR ${p.no} released · Purchase order ${no} created by Procurement (simulation)`,{t:'s',m:`Approver me-release PR ${p.no} dan Procurement membuat PO ${no} ke ${(VEND[p.mat]||'').replace(/^\d+ /,'')}. Cek di ME5A (centang Closed Requisitions), ME2N, atau ME23N. Lalu terima barangnya di MIGO.`});return drawSim();}
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
{title:'Standard PO 4500021873 Created by SARI',goal:s=>s.tabs.det===3,goalMsg:'Tab Purchase Order History dibuka',blocks:[{t:'kv',rows:[['Vendor','200145 PT Mitra Teknik Abadi'],['Doc. date','21.10.2026'],['Purch. Group','P05'],['Plant','1100']]},
 {t:'table',title:'Item Overview',h:['Itm','A','Material','Short Text','PO Quantity','OUn','Deliv. Date','Net Price','Plnt','SLoc'],r:[['10','','300012457','BEARING SKF 6205-2RS','10','PC','28.10.2026','185.000','1100','1101']]},
 {t:'tabs',key:'det',title:'Item  [ 10 ] 300012457, BEARING SKF 6205-2RS',tabs:[{l:'Quantities/Weights',fields:[{id:'z1',l:'PO Quantity',t:'ro',v:'10 PC'},{id:'z2',l:'Still to be delivered',t:'ro',v:'2 PC'}]},{l:'Delivery',fields:[{id:'z3',l:'Overdeliv. Tol.',t:'ro',v:'0 %'}]},{l:'Conditions',table:{h:['CnTy','Name','Amount','Crcy','per','UoM'],r:[['PB00','Gross Price','185.000','IDR','1','PC']]}},
  {l:'Purchase Order History',table:{h:['Sh. Text','MvT','Material Doc.','Posting Date','Quantity','OUn','Amount (IDR)'],r:[['WE','101','5000187342','04.11.2026','8','PC','1.480.000'],['RE-L','','5105600140 (blocked)','04.11.2026','10','PC','1.850.000']]}}]}]}]},
KQ('Apa penyebab invoice di-block?',[['Qty invoice (10) lebih besar dari qty GR (8)',null],['Harga invoice berbeda dari PO','Harga di Conditions 185.000, sama dengan invoice (1.850.000 ÷ 10).'],['Vendor salah nomor rekening','Bukan bagian dari 3-way match.'],['PO sudah kedaluwarsa','Tidak ada indikasi itu di PO.']],'3-way match gagal karena baru 8 PC yang diterima.'),
KQ('Gudang menemukan surat jalan susulan SJ-MTA/1131 untuk 2 PC sisanya; barang sudah ada di rak sejak kemarin. Tindakanmu?',[['Posting GR 2 PC terhadap PO dengan surat jalan susulan',null],['Minta Finance tetap membayar 10 PC','Tanpa GR, stok dan dokumen tidak cocok.'],['Ubah qty invoice menjadi 8','Invoice adalah wewenang Finance dan dokumen vendor.'],['Buat PO baru 2 PC','Menggandakan pembelian.']],'GR susulan membuat qty GR = qty invoice.'),
{k:'tx',tc:'MIGO',attach:{t:'sj',title:'Surat Jalan SJ-MTA/1131',rows:[['No. SJ','SJ-MTA/1131'],['Ref. PO','4500021873'],['Barang','BEARING SKF 6205-2RS'],['Qty kirim','2 PC']]},instr:'Posting GR 2 PC terhadap PO 4500021873 ke Gudang Sparepart 1101 dengan surat jalan susulan.',
screens:[migoScreen({onEnter:v=>{if(v.ref!=='R01')return null;if(norm(v.po)!=='4500021873')return {msg:['E',`Purchase order ${v.po||''}: no open items for goods receipt in this simulation`]};if(v['it.0.txt'])return null;return {fill:{'it.0.mat':'300012457','it.0.txt':'BEARING SKF 6205-2RS','it.0.qty':'2','it.0.poqty':'10 PC (open 2)','it.0.un':'PC','it.0.lgort':'1101','it.0.werks':'1100','it.0.stock':'Unrestricted use','it.0.po':'4500021873 / 10','it.0.vendor':'200145 PT Mitra Teknik Abadi'},msg:['I','Item data adopted from purchase order 4500021873']};},
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
screens:[migoScreen({onEnter:v=>{if(v.ref!=='R01')return null;if(norm(v.po)!=='4500021925')return {msg:['E',`Purchase order ${v.po||''}: no open items for goods receipt in this simulation`]};if(v['it.0.txt'])return null;return {fill:{'it.0.mat':'300045002','it.0.txt':'BELT FOOD GRADE PU 2MM','it.0.qty':'30','it.0.poqty':'30 M','it.0.un':'M','it.0.lgort':'1102','it.0.werks':'1100','it.0.insmk':'','it.0.po':'4500021925 / 10','it.0.vendor':'200233 PT Food Belt Indonesia',_stockSel:true},msg:['I','Item data adopted from purchase order 4500021925']};},
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
 rows:[{doc:'1900004377',ty:'KR',ref:'INV-LP-0870',dd:'05.11.2026',val:12500000,blk:'R',txt:'Sewa forklift Okt – dispute jam operasi'},{doc:'1900004601',ty:'KR',ref:'INV-LP-0925',dd:'14.12.2026',val:7500000,blk:'',txt:'Servis forklift'}]};
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
{k:'q',instr:'Berapa sisa hutang terbuka ke PT Lift Prima, dan kenapa INV-LP-0870 punya payment block R?',o:['Rp 20.000.000; R = diblok karena masih diperiksa (dispute) sehingga F110 tidak membayarnya','Rp 35.000.000; R = sudah dibayar','Rp 7.500.000; R = retur barang','Rp 12.500.000; R = reversal'],a:0,e:'12,5 jt + 7,5 jt = 20 jt. Invoice 0911 sudah cleared oleh F-53 sehingga tidak muncul lagi di open items.'}
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
const BAB_SIM={nav:{0:['s20'],2:['s0'],4:['s8']},org:{2:['s9']},'mm-pur':{1:['s1','s21'],3:['s22'],4:['s27'],5:['s12','s2'],6:['s13']},'mm-im':{0:['s3','s23','s24'],1:['s4'],2:['s11'],3:['s10']},'mm-pi':{0:['s14','s15','s25'],1:['s5'],3:['s26']},'fi-aa':{2:['s16'],3:['s7']},ps:{1:['s6','s28'],3:['s17']},'ps-ops':{0:['s19'],3:['s18']},sd:{2:['d1'],3:['d2']},'fi-ap':{1:['f1'],2:['f2']},pp:{1:['p1'],2:['p2']},wm:{0:['w2'],1:['w1']}};
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
const MVT=[['101','GR terhadap PO'],['102','Pembatalan GR'],['201','GI ke cost center'],['202','Pembatalan 201'],['221','GI ke proyek/WBS'],['222','Pembatalan 221'],['261','GI ke order'],['262','Pembatalan 261'],['311','Transfer antar sloc'],['601','GI untuk delivery penjualan'],['651','GR retur customer']];
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
  if(SIM.free){ if(typeof SBX!=='undefined'&&SBX[v]){openFree(v,mode);} else {SIM.where='other';SIM.other=v;setMsg('I',`${v} – ${KNOWN[v]}`,{t:'i',m:`${v} belum tersedia di Mode bebas. Transaksi yang bisa dipakai: ${Object.keys(SBX).join(', ')}.`});} return drawSim(); }
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
  if(a.t==='xl') return `<div class="att"><div class="att-h"><span>📎 ${esc(a.title)}</span><button class="linkbtn" id="copyCol">Salin kolom</button></div><table class="xl"><tr><th>A · ${esc(a.col||'No. PO')}</th></tr>${a.rows.map(r=>`<tr><td>${r}</td></tr>`).join('')}</table></div>`;
  if(a.t==='sj') return `<div class="att"><div class="att-h"><span>📎 ${esc(a.title)}</span></div><table>${a.rows.map(r=>`<tr><td class="muted">${esc(r[0])}</td><td><b>${esc(r[1])}</b></td></tr>`).join('')}</table></div>`;
  if(a.t==='sheet') return `<div class="att"><div class="att-h"><span>📎 ${esc(a.title)}</span></div><table><tr>${(a.h||['Item','Material','Hitung']).map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${a.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>`;
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
   <div class="info-box"><div class="h">Information</div><div class="b">Welcome to the PRD training system (simulation).<br><br>Akademi SAP · client 800.<br>Data di sistem ini fiktif. Jangan memakai user/password kantor yang asli.</div></div></div>`;
}
function guiBodyH(){
  if(SIM.where==='logon') return logonH();
  if(SIM.where==='easy'){
    return `<div class="ea"><div class="ea-tree"><ul class="tree root"><li><button data-tree="f" aria-expanded="${!!SIM.tree.f}"><span style="width:9px;font-size:9px">${SIM.tree.f?'▼':'▶'}</span>${ICO.star}Favorites</button>${SIM.tree.f?`<ul class="tree">${FAVS.map(c=>`<li><button data-tcode="${c}">${ICO.tx}<span><code>${c}</code> – ${esc(KNOWN[c])}</span></button></li>`).join('')}</ul>`:''}</li>
      <li><button data-tree="0" aria-expanded="${!!SIM.tree[0]}"><span style="width:9px;font-size:9px">${SIM.tree[0]?'▼':'▶'}</span>${SIM.tree[0]?ICO.folderO:ICO.folder}SAP Menu</button>${SIM.tree[0]?treeH(TREE,'0'):''}</li></ul></div>
      <div class="ea-pic">Akademi SAP · training client 800</div></div>`;
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
  v.innerHTML=`<div class="spread"><div><div class="eyebrow">${SIM.free?'Simulator SAP GUI · Mode bebas':SIM.sc.kind==='role'&&!SIM.sc.mod?'Simulator role · '+(ROLES.find(r=>r.id===SIM.sc.role)||{}).t:SIM.sc.kase?'Studi kasus + praktik SAP · '+MOD[SIM.sc.mod].code:'Simulator SAP GUI · '+MOD[SIM.sc.mod].code+(SIM.sc.bab!=null?' · Bab '+(SIM.sc.bab+1):'')}</div><h1 style="font-size:28px">${esc(SIM.sc.title)}</h1></div><a class="btn ghost sm" href="#${SIM.sc.back||(SIM.sc.kase?'studi-kasus':'simulator')}" id="simExit">← ${SIM.sc.back&&SIM.sc.back.startsWith('modul-')?'Kembali ke modul':SIM.sc.back==='jalur'?'Jalur saya':SIM.sc.kase?'Studi kasus':'Daftar skenario'}</a></div>
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
  $('#view').innerHTML=`<div class="eyebrow">Praktik</div><h1>Simulator SAP GUI</h1>
  <p class="lead">Ada tiga jenis latihan: <b>simulator role</b> (satu hari kerja lintas modul sesuai role), <b>simulator per bab</b> (sesuai isi setiap bab di modul), dan <b>Mode bebas</b>. ${done} latihan sudah kamu selesaikan.</p>
  <div class="card" style="margin-top:14px;border:2px solid var(--accent)"><div class="spread"><div><div class="eyebrow">Mode bebas</div><b style="font-family:var(--font-d);font-size:20px">Latihan SAP sesukamu, tanpa skenario</b><p style="margin:4px 0 0;max-width:70ch">Sistem latihan dengan data yang saling terhubung: buat PR, setujui jadi PO, terima barang, keluarkan ke proyek, pindahkan stok, batalkan dokumen, lalu lihat dampaknya di stok dan biaya proyek. SAP akan menolak isian yang salah seperti aslinya.</p></div><button class="btn" id="freeBtn">Buka Mode bebas</button></div></div>
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
function renderNav(cur){
  const r=roleOf(), p=progress();
  const it=(h,t,n,badge)=>`<a href="#${h}" class="${cur===h?'on':''}"><span class="num">${n}</span><span>${t}</span>${badge||''}</a>`;
  const mb=m=>{const M=mastery(m);return M.done?'<span class="done">✓</span>':(M.les?`<span class="part">${M.les}/${M.L}</span>`:'');};
  const mi=(id,k)=>{const m=MOD[id];return `<a href="#modul-${id}" class="${cur==='modul-'+id?'on':''}" title="${REL[k][0]}"><span class="rdot ${k==='a'?'p':k}"></span><span class="num code">${m.code}</span><span>${esc(shortT(m))}</span>${mb(m)}</a>`;};
  let h='<div class="nav-group">Mulai</div>'+it('beranda','Beranda','⌂')+it('jalur','Jalur saya','→',r?`<span class="part">${p.done}/${p.core}</span>`:'')+it('role',r?'Ganti role':'Pilih role','R')+it('modul','Katalog modul','≡',`<span class="part">${MODULES.length}</span>`);
  if(r) h+=`<div class="nav-group">Modul jalurmu</div>`+rolePath(r).map(id=>mi(id,relOf(id,r))).join('');
  else h+=`<div class="nav-group">Modul</div><a href="#role"><span class="num">i</span><span style="color:var(--meta)">Pilih role agar modulmu tampil di sini</span></a>`;
  const adds=S.addons.filter(id=>!r||!relOf(id,r));if(adds.length)h+=`<div class="nav-group">Add-on</div>`+adds.map(id=>mi(id,'a')).join('');
  if(cur.startsWith('modul-')&&!relOrAdd(cur.slice(6))){const m=MOD[cur.slice(6)];if(m)h+=`<div class="nav-group">Sedang dibuka</div><a href="#${cur}" class="on"><span class="num code">${m.code}</span><span>${esc(shortT(m))}</span>${mb(m)}</a>`;}
  h+='<div class="nav-group">Praktik</div>'+it('simulator','Simulator SAP GUI','SIM')+it('studi-kasus','Studi Kasus','SK')+
     '<div class="nav-group">Uji & hafalan</div>'+it('kuis','Ujian','Q')+it('flashcard','Flashcard','FC')+it('glosarium','Glosarium','GL')+
     '<div class="nav-group">Hasil & referensi</div>'+it('report','Report nilai','RP')+it('referensi','Cheat sheet','REF');
  $('#nav').innerHTML=h;
  $('#sideProg').innerHTML=`<b>${r?'Jalur '+esc(r.t):'Progres belajar'}</b> <span style="float:right" class="mono">${p.pct}%</span><div class="bar"><i style="width:${p.pct}%"></i></div><div style="margin-top:6px;color:var(--muted);font-size:12px">${r?`${p.done}/${p.core} modul kompetensi dikuasai`:`${p.all}/${MODULES.length} modul dikuasai`} · ${p.s} latihan · ${p.c} kasus</div>`;
  const br=$('#brandRole'); if(br) br.textContent=r?r.t:'Semua role & modul';
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
  else if(h==='simulator'){ if(!SIM) renderSimHome(); }
  else if(h==='kuis') renderQuizHome();
  else if(h==='flashcard') renderCards($('#view'));
  else if(h==='glosarium') renderGloss($('#view'));
  else if(h==='studi-kasus') renderCaseHome();
  else if(h==='report') renderReport();
  else if(h==='referensi') renderRef();
  else {renderHome();nav='beranda';}
  renderNav(nav); renderCrumb(nav);
  $('#side').classList.remove('open');
}
window.addEventListener('hashchange',route);
function go(h){if(location.hash==='#'+h)route();else location.hash=h;}
function renderCrumb(h){const el=$('#crumb');if(!el)return;const L={simulator:'Simulator SAP GUI','studi-kasus':'Studi Kasus',kuis:'Ujian',flashcard:'Flashcard',glosarium:'Glosarium',report:'Report nilai',referensi:'Cheat sheet',role:'Pilih role',jalur:'Jalur saya',modul:'Katalog modul'};
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
  const howto=`<h2>Cara belajar di platform ini</h2><div class="path"><span><b>1 · PILIH ROLE</b>Kompetensi inti & general tersaring otomatis</span><span><b>2 · TIAP BAB</b>Materi → cek pemahaman → simulator bab → studi kasus bab</span><span><b>3 · UJIAN AKHIR MODUL</b>Lulus ≥ 80% untuk menguasai modul</span><span><b>4 · ROLE</b>Simulator, studi kasus, glosarium, flashcard, ujian akhir role</span></div>`;
  const note=`<div class="callout warn" style="margin-top:24px"><b>Tentang data di platform ini</b>Semua nomor dokumen, material, vendor, dan customer adalah contoh fiktif. Simulator meniru alur dan susunan layar SAP GUI; T-code yang dipakai adalah T-code standar. Cocokkan akses, T-code, dan kode organisasi dengan tim IT/key user sebelum bekerja di sistem asli.</div>`;
  if(!r){
    $('#view').innerHTML=`<div class="hero"><div><div class="eyebrow">Platform belajar SAP · semua role</div><h1>Belajar SAP sesuai arah karirmu</h1>
      <p class="lead">${MODULES.length} modul dari Finance, Logistik, HR, Teknis, sampai solusi cloud. Pilih role, lalu platform menyusun <b>kompetensi inti</b> dan <b>kompetensi general</b> yang perlu kamu kuasai, supaya kamu tidak kewalahan.</p>
      <div class="row" style="margin-top:20px"><a class="btn pri" href="#role">Pilih arah karir</a><a class="btn ghost" href="#modul">Jelajahi per modul</a></div></div>
      <div class="card"><div class="spread"><b style="font-size:18px">Isi platform</b></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
        <div class="stat"><b>${MODULES.length}</b><span>modul SAP</span></div><div class="stat"><b>${MODULES.reduce((a,m)=>a+m.lessons.length,0)}</b><span>bab, masing-masing dengan simulator & studi kasus</span></div>
        <div class="stat"><b>${ROLES.length}</b><span>role / arah karir</span></div><div class="stat"><b>${GLOSS.length}</b><span>entri glosarium</span></div></div></div></div>
    <h2>Pilih arah karirmu</h2><p class="muted" style="max-width:72ch">Klik role untuk melihat kompetensi inti, general, dan pendukungnya sebelum memilih. Kamu bisa ganti role kapan saja; progres modul tetap tersimpan.</p>
    ${RGRP.map(([g,t])=>`<h3 style="margin:20px 0 0;font-size:17px;font-weight:500">${t}</h3><div class="rolegrid">${ROLES.filter(x=>x.grp===g).map(roleCard).join('')}</div>`).join('')}
    ${howto}${note}`;return;}
  const core=roleCore(r), next=nextIn(core)||nextIn(rolePath(r));
  const cnt=k=>`${r[k].filter(id=>mastery(MOD[id]).done).length}/${r[k].length}`;
  $('#view').innerHTML=`<div class="hero"><div><div class="eyebrow">Jalur belajar · ${esc(r.t)}</div><h1>${p.done>=p.core?'Kompetensimu lengkap':'Lanjutkan jalurmu'}</h1>
    <p class="lead">${next?`Berikutnya: <b>${next.code} · ${esc(shortT(next))}</b>. ${next.sum}`:'Semua modul kompetensi sudah dikuasai. Ikuti ujian akhir role atau tambahkan modul add-on.'}</p>
    <div class="row" style="margin-top:20px">${next?`<a class="btn pri" href="#modul-${next.id}">${mastery(next).les?'Lanjutkan':'Mulai'}: ${next.code}</a>`:`<a class="btn pri" href="#jalur">Buka ujian role</a>`}<a class="btn ghost" href="#jalur">Buka jalur saya</a></div></div>
    <div class="card"><div class="spread"><b style="font-size:18px">Progres kompetensi</b><span class="pill ${p.pct>=80?'ok':p.pct>=30?'warn':''}">${p.pct}%</span></div><div class="bar" style="height:10px;margin:10px 0 14px"><i style="width:${p.pct}%"></i></div>
      <div class="relmini"><div>${relPill('w')}<span>${cnt('w')} modul</span></div><div>${relPill('g')}<span>${cnt('g')} modul</span></div><div>${relPill('p')}<span>${cnt('p')} modul</span></div><div><span>Ujian akhir role terbaik</span><b style="color:var(--ink)">${p.q}%</b></div></div></div></div>
  <h2>Kompetensi untuk ${esc(r.t)}</h2><p class="muted" style="max-width:72ch">${esc(r.d)} <a href="#role-${r.id}">Detail role</a> · <a href="#role">ganti role</a></p>
  ${relCols(r)}
  ${howto}
  <h2>Di luar jalurmu</h2><p class="muted" style="max-width:72ch">Modul lain bisa ditambahkan sebagai <b>add-on</b>. Kamu tetap mendapat materi, simulator dan studi kasus per bab, serta ujian akhir modulnya.</p>
  <div class="row"><a class="btn ghost" href="#modul">Buka katalog semua modul</a></div>${note}`;
}

/* ===================== ROLES ===================== */
function renderRoles(){
  const r=roleOf();
  $('#view').innerHTML=`<div class="eyebrow">Arah karir</div><h1>${r?'Ganti role':'Pilih role'}</h1><p class="lead">Setiap role punya <b>kompetensi inti</b> (inti pekerjaan), <b>kompetensi general</b> (dipakai umum sehari-hari, termasuk dasar SAP), dan modul <b>pendukung</b>. Klik role untuk melihat detailnya.</p>
  ${r?`<div class="outpath" style="margin-top:14px">Jalurmu sekarang: <b>${esc(r.t)}</b>. Progres modul tetap tersimpan jika kamu berganti role. <button class="btn sm ghost" id="noRole">Belajar tanpa role</button></div>`:''}
  ${RGRP.map(([g,t])=>`<h2>${t}</h2><div class="rolegrid">${ROLES.filter(x=>x.grp===g).map(roleCard).join('')}</div>`).join('')}
  <p class="muted" style="margin-top:22px">Role kamu tidak ada? Pilih yang paling dekat, atau <a href="#modul">jelajahi katalog per modul</a>.</p>`;
  $('#noRole')&&($('#noRole').onclick=()=>{S.role=null;save();location.hash='modul';});
}
function renderRoleDetail(id){
  const r=ROLES.find(x=>x.id===id), mine=S.role===id, core=roleCore(r);
  $('#view').innerHTML=`<header class="pagehero"><div class="eyebrow">Arah karir · ${RGRP.find(g=>g[0]===r.grp)[1]}</div>
   <div class="spread" style="align-items:flex-end"><h1>${esc(r.t)}</h1>${mine?'<span class="pill ok">Jalur aktifmu</span>':''}</div><p class="lead">${esc(r.d)}</p>
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
  $('#view').innerHTML=`<header class="pagehero"><div class="eyebrow">Jalur saya</div><div class="spread" style="align-items:flex-end"><h1>${esc(r.t)}</h1><span class="pill">${p.pct}%</span></div>
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
  $('#view').innerHTML=`<div class="eyebrow">Katalog</div><h1>Katalog modul SAP</h1><p class="lead">${MODULES.length} modul dalam ${CATS.length} kelompok. Setiap bab berisi materi, cek pemahaman, simulator bab, dan studi kasus bab. Setiap modul ditutup dengan ujian akhir.</p>
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
  <div class="eyebrow">${m.code} · ${catName(m.cat)} · ${m.dur}</div>
  <div class="spread" style="align-items:flex-end"><h1>${esc(m.title)}</h1><span class="row" style="gap:6px">${k?relPill(k):''}${M.done?'<span class="pill ok">Modul dikuasai</span>':''}</span></div>
  <p class="lead">${m.sum}</p>
  <div class="row" style="margin-top:12px">${mchips(M)}<span class="muted" style="font-size:13px">${M.done?'Modul dikuasai.':'Syarat dikuasai: semua bab lulus cek pemahaman dan ujian akhir ≥ 80%.'}</span></div>
  ${wl.length?`<p style="margin:10px 0 0;font-size:13px">Kompetensi inti untuk: ${wl.map(x=>`<a href="#role-${x.id}" style="color:#fff">${esc(x.t)}</a>`).join(', ')}</p>`:''}</header>
  ${banner}
  <div class="mod-layout"><nav class="ltoc" aria-label="Daftar bab"><div class="lt-h">Bab</div>${toc}</nav><div class="lesson">${body}
  <div class="foot-nav">${prev?`<a class="btn ghost" href="#modul-${prev.id}">← ${prev.code}</a>`:'<span></span>'}${next?`<a class="btn ghost" href="#modul-${next.id}">${next.code}: ${esc(shortT(next))} →</a>`:`<a class="btn ghost" href="#${r?'jalur':'kuis'}">${r?'Jalur saya':'Ujian'} →</a>`}</div></div></div>`;
  $$('[data-lv]').forEach(b=>b.onclick=()=>{MODV.view=b.dataset.lv;drawModule(m);window.scrollTo({top:0});});
  $('#addOn')&&($('#addOn').onclick=()=>{S.addons=isAdd?S.addons.filter(x=>x!==m.id):[...S.addons,m.id];save();drawModule(m);renderNav('modul-'+m.id);});
  initWidgets($('#view'));
  bindAll($('#view'));
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
    $('#view').innerHTML=`<div class="spread"><div><div class="eyebrow">Simulator bab · ${m.code} · Bab ${a.bab+1}</div><h1 style="font-size:28px">${esc(a.title)}</h1></div><button class="btn ghost sm" id="apBack">← Kembali ke modul</button></div>
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
  $('#view').innerHTML=`<div class="eyebrow">Praktik</div><h1>Studi Kasus</h1><p class="lead">Dua tingkat studi kasus: <b>studi kasus role</b> (lintas modul, sesuai pekerjaanmu) dan <b>studi kasus per bab</b> (sesuai isi tiap bab di modul). Setiap pilihan punya umpan balik.</p>
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
    $('#view').innerHTML=`<div class="spread"><div><div class="eyebrow">${label}</div><h1 style="font-size:28px">${esc(c.title)}</h1></div><button class="btn ghost sm" id="csBack">← Kembali</button></div>
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
  root.innerHTML=`${opt.embed?'':`<div class="eyebrow">Hafalan</div><h1>Glosarium</h1><p class="lead">${GLOSS.length} entri T-code, aplikasi, istilah, dan movement type. Daftar ini disusun otomatis dari isi materi, jadi setiap T-code atau istilah baru di materi langsung muncul di sini dan di flashcard.</p>`}
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
  $('#view').innerHTML=`<div class="eyebrow">Hasil belajar</div><h1>Report nilai</h1><p class="lead">Penilaian per modul: cek pemahaman tiap bab, simulator bab, studi kasus bab, dan ujian akhir (nilai percobaan pertama dan nilai tertinggi).${r?` Role: <b>${esc(r.t)}</b>.`:''}</p>
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
  $('#view').innerHTML=`<div class="eyebrow">Uji pemahaman</div><h1>Ujian</h1><p class="lead">Setiap modul punya <b>ujian akhir modul</b>. ${r?`Role ${esc(r.t)} juga punya <b>ujian akhir role</b> dari semua kompetensi inti dan general.`:'Pilih role untuk membuka ujian akhir role.'}</p>
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
  const shell=()=>{root.innerHTML=`${opt.embed?'':`<div class="eyebrow">Hafalan</div><h1>Flashcard</h1><p class="lead">${ALLCARDS.length} kartu T-code dan movement type, disusun otomatis dari materi semua modul. Mode <b>Kartu</b> untuk membaca dan membalik. Mode <b>Latihan ketik</b>: baca fungsinya, ketik kodenya.</p>`}
    <div class="chips"><button class="chip ${mode==='cards'?'on':''}" data-m="cards">Kartu</button><button class="chip ${mode==='drill'?'on':''}" data-m="drill">Latihan ketik</button></div>
    <div class="filt"><label for="fcCat" class="muted" style="font-size:13px">Kartu dari</label><select id="fcCat">${r?`<option value="jalur" ${cat==='jalur'?'selected':''}>Jalur ${esc(r.t)} + add-on</option>`:''}<option value="all" ${cat==='all'?'selected':''}>Semua modul</option>${MODULES.filter(m=>ALLCARDS.some(c=>c[2]===m.id)).map(m=>`<option value="${m.id}" ${cat===m.id?'selected':''}>${m.code} · ${esc(shortT(m))}</option>`).join('')}</select></div><div id="fcArea"></div>`;
    $$('[data-m]',root).forEach(b=>b.onclick=()=>{mode=b.dataset.m;shell();});$('#fcCat',root).onchange=e=>{cat=e.target.value;shell();};mode==='cards'?cardsView():drillView();};
  const cardsView=()=>{
    $('#fcArea').innerHTML=`<div class="filt"><input id="fcQ" value="${esc(q)}" placeholder="Cari T-code / fungsi" aria-label="Cari flashcard"><label style="font-size:13px"><input type="checkbox" id="fcHide" ${hideKnown?'checked':''}> Sembunyikan yang sudah hafal</label></div>
    <p id="fcCount" style="font-size:13px;color:var(--muted)"></p><div class="fc-grid" id="fcGrid"></div>`;
    const draw=()=>{const list=ALLCARDS.filter(c=>inCat(c)&&(!q||(c[0]+c[1]+c[3]).toLowerCase().includes(q))&&(!hideKnown||!S.cards[c[0]]));const pool=ALLCARDS.filter(inCat);
      $('#fcCount').textContent=`${pool.filter(c=>S.cards[c[0]]).length}/${pool.length} kartu sudah hafal · ${list.length} ditampilkan`;
      $('#fcGrid').innerHTML=list.map(c=>`<div><button class="fc ${S.cards[c[0]]?'known':''}" data-c="${c[0]}" aria-label="Kartu ${c[0]}"><div class="fc-in"><div class="fc-f"><span class="code">${c[0]}</span><small>${MOD[c[2]].code} · klik untuk membalik</small></div><div class="fc-b"><b>${esc(c[1])}</b><span>${esc(c[3])}</span></div></div></button><div class="fc-tools"><span style="color:var(--muted)">${MOD[c[2]].code}</span><button class="linkbtn" data-k="${c[0]}">${S.cards[c[0]]?'✓ Hafal':'Tandai hafal'}</button></div></div>`).join('')||'<p>Tidak ada kartu yang cocok.</p>';
      $$('.fc').forEach(b=>b.onclick=()=>b.classList.toggle('flip'));
      $$('[data-k]',$('#fcGrid')).forEach(b=>b.onclick=()=>{S.cards[b.dataset.k]=!S.cards[b.dataset.k];save();draw();renderNav('flashcard');});};
    $('#fcQ').oninput=e=>{q=e.target.value.toLowerCase();draw();};$('#fcHide').onchange=e=>{hideKnown=e.target.checked;draw();};draw();};
  const drillView=()=>{
    const deck=shuffle(ALLCARDS.filter(inCat)).slice(0,10);let i=0,score=0,answered=false;
    const draw=(fb)=>{const c=deck[i];
      $('#fcArea').innerHTML=i<deck.length?`<div class="card drill"><div class="spread"><span class="pill">${i+1}/${deck.length}</span><span class="muted" style="font-size:13px">Skor ${score}</span></div><h3>${esc(c[1])}</h3><p>${esc(c[3])}</p><label for="drIn" class="muted" style="font-size:13px">Ketik T-code-nya lalu Enter</label><input id="drIn" autocomplete="off" spellcheck="false" ${answered?'disabled':''}>${fb||''}<div class="row" style="margin-top:10px">${answered?'<button class="btn sm" id="drNext">Berikutnya →</button>':'<button class="btn sm" id="drChk">Periksa</button><button class="btn sm ghost" id="drSkip">Lewati</button>'}</div></div>`
      :`<div class="card drill"><h3>Selesai</h3><p>Skor <b>${score}/${deck.length}</b>. ${score>=8?'Hafalanmu kuat.':'Ulangi beberapa kali sampai ≥ 8.'}</p><button class="btn sm" id="drAgain">Latihan lagi</button></div>`;
      const inp=$('#drIn');if(inp&&!answered)inp.focus();
      const check=(skip)=>{const ok=!skip&&norm(inp.value)===c[0];if(ok){score++;S.cards[c[0]]=true;save();}answered=true;draw(`<div class="exp" style="margin-top:10px"><b style="color:${ok?'var(--ok)':'var(--bad)'}">${ok?'Benar':'Jawaban'}: ${c[0]}</b> – ${esc(c[1])}</div>`);};
      $('#drChk')&&($('#drChk').onclick=()=>check(false));$('#drSkip')&&($('#drSkip').onclick=()=>check(true));
      inp&&(inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(!answered)check(false);}});
      $('#drNext')&&($('#drNext').onclick=()=>{i++;answered=false;draw();});$('#drNext')&&$('#drNext').focus();
      $('#drAgain')&&($('#drAgain').onclick=drillView);};
    draw();};
  shell();
}

/* ===================== REFERENCE ===================== */
function renderRef(){
  const byCat={};CARDS.forEach(c=>{(byCat[c[2]]=byCat[c[2]]||[]).push(c);});
  const want=[['membuat PR','ME51N'],['cek status PR / apakah sudah jadi PO','ME5A, ME53N'],['melihat PO dan apakah sudah GR/invoice','ME23N','(tab PO history)'],['daftar PO yang belum datang','ME2N, ME2L','+ WE101'],['menerima barang','MIGO','A01 + R01, mvt 101'],['menerima jasa','ML81N'],['mengeluarkan barang ke proyek','MIGO','A07 + R10, mvt 221 + WBS'],['membatalkan dokumen barang','MIGO','A03 + R02'],['cek stok satu gudang','MB52'],['cek stok satu material di semua lokasi','MMBE'],['riwayat pergerakan barang','MB51'],['opname','MI01, MI21, MI04, MI11, MI20, MI07','(berurutan)'],['biaya aktual proyek','CJI3'],['komitmen proyek','CJI5'],['biaya cost center','KSB1'],['data & nilai aset','AS03, AW01N, AR01'],['work order maintenance','IW33, IW38']];
  $('#view').innerHTML=`<div class="eyebrow">Referensi cepat</div><h1>Cheat sheet SAP</h1><p class="lead">Satu halaman untuk dibuka saat bekerja. Semua T-code standar; cocokkan dengan akses di perusahaanmu.</p><div class="filt"><label for="refMod" class="muted" style="font-size:13px">T-code & app untuk</label><select id="refMod">${roleOf()?`<option value="jalur">Jalur ${esc(roleOf().t)}</option>`:''}<option value="all">Semua modul</option>${MODULES.map(m=>`<option value="${m.id}">${m.code} · ${esc(shortT(m))}</option>`).join('')}</select></div><div id="refTc"></div><h2 style="margin-top:36px">Detail MM & proyek</h2>
  <h2>Movement type</h2><div class="tbl-wrap"><table><tr><th>Mvt</th><th>Arti</th><th>Objek wajib</th><th>Batal</th></tr><tr><td><b>101</b></td><td>GR terhadap PO</td><td>PO</td><td>102</td></tr><tr><td><b>201</b></td><td>GI ke cost center</td><td>Cost center</td><td>202</td></tr><tr><td><b>221</b></td><td>GI ke proyek/WBS</td><td>WBS</td><td>222</td></tr><tr><td><b>261</b></td><td>GI ke order</td><td>Order</td><td>262</td></tr><tr><td><b>311</b></td><td>Transfer antar sloc</td><td>Sloc tujuan</td><td>312</td></tr></table></div>
  <h2>"Saya ingin…" → T-code</h2><div class="tbl-wrap"><table><tr><th>Saya ingin…</th><th>T-code</th><th>Catatan</th></tr>${want.map(r=>`<tr><td>${r[0]}</td><td>${r[1].split(', ').map(tc).join(' ')}</td><td>${r[2]||''}</td></tr>`).join('')}</table></div>
  <h2>Navigasi & ALV</h2><div class="tbl-wrap"><table><tr><th>Perintah</th><th>Fungsi</th></tr><tr><td><code>/nXXXX</code></td><td>Pindah transaksi di jendela yang sama</td></tr><tr><td><code>/oXXXX</code></td><td>Buka di jendela baru</td></tr><tr><td><code>Enter · F4 · F8 · F3 · Ctrl+S</code></td><td>Validasi · Pilihan · Execute · Back · Save</td></tr><tr><td>Multiple selection</td><td>Tempel daftar nomor dari Excel (Shift+F12)</td></tr><tr><td>Variant</td><td>Ctrl+S di layar filter; Get Variant: Shift+F5</td></tr><tr><td>ALV</td><td>Klik judul kolom → Sort / Filter / Σ / Export</td></tr></table></div>
  <h2>T-code MM & proyek per kategori</h2><div class="grid g2">${Object.entries(byCat).map(([k,v])=>`<div class="card"><b style="font-family:var(--font-d);font-size:17px">${k}</b>${v.map(c=>`<div style="display:flex;gap:10px;padding:5px 0;border-bottom:1px solid var(--line);font-size:14px"><span style="min-width:62px">${tc(c[0])}</span><span>${c[3]}</span></div>`).join('')}</div>`).join('')}</div>
  <h2>Glosarium</h2><div class="tbl-wrap"><table>${[['PR','Purchase Requisition, permintaan pembelian internal'],['PO','Purchase Order, pesanan resmi ke vendor'],['GR','Goods Receipt, penerimaan barang'],['GI','Goods Issue, pengeluaran barang'],['SES','Service Entry Sheet, penerimaan jasa'],['3-way match','Pencocokan PO, GR, dan invoice sebelum bayar'],['WBS','Work Breakdown Structure, struktur paket pekerjaan proyek'],['AuC','Asset under Construction, aset dalam pengerjaan'],['APC','Acquisition and Production Cost, nilai perolehan aset'],['ALV','Tampilan tabel laporan SAP dengan sort, filter, total, export'],['Komitmen','Nilai PO yang mengikat budget tapi belum terealisasi'],['SPI','Schedule Performance Index = aktual ÷ rencana'],['RAG','Red-Amber-Green, status ringkas proyek'],['Sloc','Storage location, lokasi gudang di dalam plant'],['BAST','Berita Acara Serah Terima']].map(r=>`<tr><td style="width:150px"><b>${r[0]}</b></td><td>${r[1]}</td></tr>`).join('')}</table></div>`;
  const drawRef=()=>{const v=$('#refMod').value;const r=roleOf();const ids=v==='all'?ORDER:v==='jalur'?rolePath(r):[v];
    $('#refTc').innerHTML=ids.map(id=>{const m=MOD[id];const rows=m.lessons.flatMap(l=>l.tcRows||[]);if(!rows.length)return '';return `<h3 style="margin:22px 0 6px;font-size:17px;font-weight:500">${m.code} · ${esc(shortT(m))} ${relPill(relOf(id))}</h3><div class="tbl-wrap"><table><tr><th style="width:34%">T-code / app</th><th>Fungsi</th></tr>${rows.map(r=>`<tr><td>${r[0].split(' / ').map(tcCell).join(' ')}</td><td>${r[1]}</td></tr>`).join('')}</table></div>`;}).join('')||'<p class="muted">Modul ini memakai referensi detail di bawah.</p>';};
  $('#refMod').onchange=drawRef;drawRef();
}

/* ===================== INIT ===================== */
$('#menuBtn').onclick=()=>{const s=$('#side');s.classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',s.classList.contains('open'));};
route();
