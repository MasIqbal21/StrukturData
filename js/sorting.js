/* =====================================================
   SORTLAB — Sorting Data
   Bagian 1: ALGORITHMS  — dipakai halaman MATERI
             (nama, deskripsi, badge kompleksitas, pseudocode
             umum). Statis, tidak dieksekusi.
   Bagian 2: CASE_ALGORITHMS — dipakai halaman STUDI KASUS
             (Sistem Informasi Kelas). Tiap entri punya
             build(data, kunci, arah) yang mengembalikan
             {steps, comparisons, swaps, result} — dijalankan
             sekali secara sinkron, lalu diputar langkah demi
             langkah oleh js/app.js.
   ===================================================== */

// ==========================
// 1. ALGORITHMS (Materi)
// ==========================

const ALGORITHMS = {

    bubble: {
        name: "Bubble Sort",
        description: "Membandingkan elemen-elemen bersebelahan secara berulang dan menukarnya jika urutannya salah, sehingga nilai terbesar \"menggelembung\" ke akhir array pada tiap putaran.",
        badges: [
            { text: "O(n²)" },
            { text: "O(1)" },
            { text: "STABLE", type: "stable" }
        ],
        pseudocode: [
            "for i = 0 → n-2",
            "  for j = 0 → n-i-2",
            "    if arr[j] > arr[j+1]",
            "      swap(arr[j], arr[j+1])",
            "return arr"
        ]
    },

    exchange: {
        name: "Exchange Sort",
        description: "Membandingkan setiap elemen dengan seluruh elemen setelahnya, lalu menukar posisinya jika elemen acuan lebih besar. Mirip Bubble Sort, namun tanpa batasan elemen harus bersebelahan.",
        badges: [
            { text: "O(n²)" },
            { text: "O(1)" },
            { text: "UNSTABLE", type: "unstable" }
        ],
        pseudocode: [
            "for i = 0 → n-2",
            "  for j = i+1 → n-1",
            "    if arr[i] > arr[j]",
            "      swap(arr[i], arr[j])",
            "return arr"
        ]
    },

    selection: {
        name: "Selection Sort",
        description: "Mencari elemen terkecil dari bagian array yang belum terurut pada setiap putaran, lalu menukarnya ke posisi terdepan bagian tersebut.",
        badges: [
            { text: "O(n²)" },
            { text: "O(1)" },
            { text: "UNSTABLE", type: "unstable" }
        ],
        pseudocode: [
            "for i = 0 → n-2",
            "  min = i",
            "  for j = i+1 → n-1",
            "    if arr[j] < arr[min]",
            "      min = j",
            "  swap(arr[i], arr[min])",
            "return arr"
        ]
    },

    insertion: {
        name: "Insertion Sort",
        description: "Membangun array terurut satu elemen pada satu waktu, dengan menyisipkan tiap elemen baru ke posisi yang tepat di antara elemen-elemen yang sudah terurut.",
        badges: [
            { text: "O(n²)" },
            { text: "O(1)" },
            { text: "STABLE", type: "stable" }
        ],
        pseudocode: [
            "for i = 1 → n-1",
            "  j = i",
            "  while j > 0 and arr[j-1] > arr[j]",
            "    swap(arr[j-1], arr[j]); j = j-1",
            "return arr"
        ]
    },

    shell: {
        name: "Shell Sort",
        description: "Pengembangan dari Insertion Sort yang membandingkan elemen dengan jarak (gap) tertentu terlebih dahulu, lalu mengecilkan gap tersebut secara bertahap hingga menjadi 1.",
        badges: [
            { text: "O(n²)" },
            { text: "O(1)" },
            { text: "UNSTABLE", type: "unstable" }
        ],
        pseudocode: [
            "gap = ⌊n/2⌋",
            "while gap > 0",
            "  for i = gap → n-1",
            "    j = i",
            "    while j ≥ gap and arr[j-gap] > arr[j]",
            "      swap(arr[j-gap], arr[j]); j = j-gap",
            "  gap = ⌊gap/2⌋",
            "return arr"
        ]
    },

    quick: {
        name: "Quick Sort",
        description: "Memilih sebuah pivot, lalu membagi array menjadi dua bagian (lebih kecil dan lebih besar dari pivot) secara rekursif hingga seluruh array terurut.",
        badges: [
            { text: "O(n²)" },
            { text: "O(log n)" },
            { text: "UNSTABLE", type: "unstable" }
        ],
        pseudocode: [
            "quickSort(low, high)",
            "  if low < high",
            "    pivot = arr[high]; i = low-1",
            "    for j = low → high-1",
            "      if arr[j] < pivot",
            "        i++; swap(arr[i], arr[j])",
            "    swap(arr[i+1], arr[high]); pi = i+1",
            "    quickSort(low, pi-1)",
            "    quickSort(pi+1, high)"
        ]
    },

    radix: {
        name: "Radix Sort",
        description: "Mengurutkan bilangan bulat non-negatif berdasarkan nilai digitnya, dimulai dari digit satuan, dengan mendistribusikannya ke 10 bucket (0–9) pada tiap putaran.",
        badges: [
            { text: "O(n·k)" },
            { text: "O(n+k)" },
            { text: "STABLE", type: "stable" }
        ],
        pseudocode: [
            "max = getMax(arr)",
            "for exp = 1; max/exp > 0; exp *= 10",
            "  for each num in arr",
            "    digit = ⌊num/exp⌋ mod 10",
            "    bucket[digit].push(num)",
            "  arr = concat(bucket[0..9])",
            "  clear buckets",
            "return arr"
        ]
    }

};

// ==========================
// 2. CASE_ALGORITHMS (Studi Kasus — Sistem Informasi Kelas)
// ==========================

// Perbandingan generik dua mahasiswa berdasarkan kunci (nim/nama/nilai)
// dan arah (asc/desc). Dipakai oleh seluruh algoritma comparison-based.
function cmpStudents(a, b, key, order){

    let res;

    if(key === "nama") res = a.nama.localeCompare(b.nama, "id");
    else res = a[key] - b[key];

    return order === "desc" ? -res : res;

}

// ---------- Bubble Sort ----------

const BUBBLE_CODE = [
    "function bubbleSort(data, kunci, arah):",
    "  n ← panjang(data)",
    "  untuk i dari 0 sampai n-2:",
    "    untuk j dari 0 sampai n-i-2:",
    "      jika data[j] > data[j+1]:",
    "        tukar(data[j], data[j+1])",
    "    // posisi n-i-1 sudah terurut",
    "  kembalikan data"
];

function bubbleBuild(dataArr, key, order){

    const arr = dataArr.slice();
    const n = arr.length;

    let comparisons = 0, swaps = 0;
    let sortedIdx = [];

    const steps = [];

    function snap(extra){
        steps.push(Object.assign({
            array: arr.slice(), sorted: sortedIdx.slice(), comparisons, swaps,
            compare: [], swap: [], active: null, note: "", line: 0
        }, extra));
    }

    snap({ line:0, note:"Mulai — bandingkan pasangan data bersebelahan dari kiri ke kanan." });

    for(let i = 0; i < n - 1; i++){

        for(let j = 0; j < n - i - 1; j++){

            comparisons++;
            const willSwap = cmpStudents(arr[j], arr[j+1], key, order) > 0;

            snap({ line:4, compare:[j, j+1], note:`Bandingkan posisi ${j} dengan posisi ${j+1}.` });

            if(willSwap){
                const t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
                swaps++;
                snap({ line:5, swap:[j, j+1], note:`Tukar posisi ${j} dan ${j+1}.` });
            }

        }

        sortedIdx.push(n - 1 - i);
        snap({ line:6, sorted: sortedIdx.slice(), note:`Posisi ${n-1-i} sudah pasti benar.` });

    }

    sortedIdx = arr.map((_, idx) => idx);
    snap({ line:7, sorted: sortedIdx.slice(), note:"Selesai — seluruh data terurut." });

    return { steps, comparisons, swaps, result: arr };

}

// ---------- Exchange Sort ----------

const EXCHANGE_CODE = [
    "function exchangeSort(data, kunci, arah):",
    "  n ← panjang(data)",
    "  untuk i dari 0 sampai n-2:",
    "    untuk j dari i+1 sampai n-1:",
    "      jika data[i] > data[j]:",
    "        tukar(data[i], data[j])",
    "    // posisi i sudah pasti benar",
    "  kembalikan data"
];

function exchangeBuild(dataArr, key, order){

    const arr = dataArr.slice();
    const n = arr.length;

    let comparisons = 0, swaps = 0;
    let sortedIdx = [];

    const steps = [];

    function snap(extra){
        steps.push(Object.assign({
            array: arr.slice(), sorted: sortedIdx.slice(), comparisons, swaps,
            compare: [], swap: [], active: null, note: "", line: 0
        }, extra));
    }

    snap({ line:0, note:"Mulai — setiap posisi dibandingkan dengan seluruh posisi setelahnya." });

    for(let i = 0; i < n - 1; i++){

        for(let j = i + 1; j < n; j++){

            comparisons++;
            const willSwap = cmpStudents(arr[i], arr[j], key, order) > 0;

            snap({ line:4, compare:[i, j], active:i, note:`Bandingkan posisi ${i} dengan posisi ${j}.` });

            if(willSwap){
                const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
                swaps++;
                snap({ line:5, swap:[i, j], active:i, note:`Tukar posisi ${i} dan ${j}.` });
            }

        }

        sortedIdx.push(i);
        snap({ line:6, sorted: sortedIdx.slice(), note:`Posisi ${i} sudah pasti benar.` });

    }

    sortedIdx = arr.map((_, idx) => idx);
    snap({ line:7, sorted: sortedIdx.slice(), note:"Selesai — seluruh data terurut." });

    return { steps, comparisons, swaps, result: arr };

}

// ---------- Selection Sort ----------

const SELECTION_CODE = [
    "function selectionSort(data, kunci, arah):",
    "  n ← panjang(data)",
    "  untuk i dari 0 sampai n-2:",
    "    min ← i",
    "    untuk j dari i+1 sampai n-1:",
    "      jika data[j] < data[min]:",
    "        min ← j",
    "    tukar(data[i], data[min])",
    "  kembalikan data"
];

function selectionBuild(dataArr, key, order){

    const arr = dataArr.slice();
    const n = arr.length;

    let comparisons = 0, swaps = 0;
    let sortedIdx = [];

    const steps = [];

    function snap(extra){
        steps.push(Object.assign({
            array: arr.slice(), sorted: sortedIdx.slice(), comparisons, swaps,
            compare: [], swap: [], active: null, note: "", line: 0
        }, extra));
    }

    snap({ line:0, note:"Mulai — cari data terkecil/terbesar dari bagian yang belum terurut." });

    for(let i = 0; i < n - 1; i++){

        let min = i;
        snap({ line:3, active:i, note:`Anggap posisi ${i} sebagai kandidat sementara.` });

        for(let j = i + 1; j < n; j++){

            comparisons++;
            snap({ line:5, active:min, compare:[j], note:`Bandingkan posisi ${j} dengan kandidat saat ini (posisi ${min}).` });

            if(cmpStudents(arr[j], arr[min], key, order) < 0){
                min = j;
                snap({ line:6, active:min, note:`Posisi ${j} menjadi kandidat baru.` });
            }

        }

        if(min !== i){
            const t = arr[i]; arr[i] = arr[min]; arr[min] = t;
            swaps++;
        }

        sortedIdx.push(i);
        snap({ line:7, swap:[i, min], sorted: sortedIdx.slice(), note:`Tukar posisi ${i} dengan posisi ${min}. Posisi ${i} sudah pasti benar.` });

    }

    sortedIdx = arr.map((_, idx) => idx);
    snap({ line:8, sorted: sortedIdx.slice(), note:"Selesai — seluruh data terurut." });

    return { steps, comparisons, swaps, result: arr };

}

// ---------- Insertion Sort ----------

const INSERTION_CODE = [
    "function insertionSort(data, kunci, arah):",
    "  n ← panjang(data)",
    "  // data[0] dianggap sudah terurut",
    "  untuk i dari 1 sampai n-1:",
    "    kunci_baris ← data[i]",
    "    j ← i - 1",
    "    selama j ≥ 0 dan data[j] > kunci_baris:",
    "      data[j+1] ← data[j]",
    "      j ← j - 1",
    "    data[j+1] ← kunci_baris",
    "  kembalikan data"
];

function insertionBuild(dataArr, key, order){

    const arr = dataArr.slice();
    const n = arr.length;

    let comparisons = 0, swaps = 0;

    const steps = [];

    function snap(sortedIdx, extra){
        steps.push(Object.assign({
            array: arr.slice(), sorted: sortedIdx, comparisons, swaps,
            compare: [], swap: [], active: null, note: "", line: 0
        }, extra));
    }

    snap([0], { line:2, note:"Elemen pertama dianggap sudah terurut." });

    for(let i = 1; i < n; i++){

        const keyVal = arr[i];
        let j = i - 1;

        const sortedRange = [];
        for(let k = 0; k < i; k++) sortedRange.push(k);

        snap(sortedRange, { line:4, active:i, note:`Ambil data baris ke-${i} sebagai kunci.` });

        while(j >= 0){

            comparisons++;
            const cond = cmpStudents(arr[j], keyVal, key, order) > 0;

            snap(sortedRange, { line:6, active:i, compare:[j], note:`Bandingkan posisi ${j} dengan kunci.` });

            if(!cond) break;

            arr[j+1] = arr[j];
            swaps++;
            snap(sortedRange, { line:7, active:i, swap:[j+1], note:`Geser data dari posisi ${j} ke ${j+1}.` });

            j--;

        }

        arr[j+1] = keyVal;

        const newSorted = [];
        for(let m = 0; m <= i; m++) newSorted.push(m);

        snap(newSorted, { line:9, swap:[j+1], note:`Sisipkan kunci di posisi ${j+1}.` });

    }

    const full = arr.map((_, idx) => idx);
    snap(full, { line:10, note:"Selesai — seluruh data terurut." });

    return { steps, comparisons, swaps, result: arr };

}

// ---------- Shell Sort ----------

const SHELL_CODE = [
    "function shellSort(data, kunci, arah):",
    "  n ← panjang(data)",
    "  gap ← n div 2",
    "  selama gap > 0:",
    "    untuk i dari gap sampai n-1:",
    "      temp ← data[i]; j ← i",
    "      selama j ≥ gap dan data[j-gap] > temp:",
    "        data[j] ← data[j-gap]; j ← j-gap",
    "      data[j] ← temp",
    "    gap ← gap div 2",
    "  kembalikan data"
];

function shellBuild(dataArr, key, order){

    const arr = dataArr.slice();
    const n = arr.length;

    let comparisons = 0, swaps = 0;

    const steps = [];

    function snap(extra){
        steps.push(Object.assign({
            array: arr.slice(), sorted: [], comparisons, swaps,
            compare: [], swap: [], active: null, note: "", line: 0
        }, extra));
    }

    snap({ line:0, note:"Mulai — bandingkan data berjarak gap, lalu perkecil gap secara bertahap." });

    let gap = Math.floor(n / 2);
    snap({ line:2, note:`Gap awal = ${gap}.` });

    while(gap > 0){

        snap({ line:3, note:`Gap saat ini = ${gap}.` });

        for(let i = gap; i < n; i++){

            const temp = arr[i];
            let j = i;

            snap({ line:5, active:i, note:`Ambil data pada posisi ${i}.` });

            while(j >= gap){

                comparisons++;
                const cond = cmpStudents(arr[j-gap], temp, key, order) > 0;

                snap({ line:6, active:i, compare:[j-gap, j], note:`Bandingkan posisi ${j-gap} dengan posisi ${j} (gap ${gap}).` });

                if(!cond) break;

                arr[j] = arr[j-gap];
                swaps++;
                snap({ line:7, active:i, swap:[j], note:`Geser data dari posisi ${j-gap} ke ${j}.` });

                j -= gap;

            }

            arr[j] = temp;
            snap({ line:8, active:i, swap:[j], note:`Tempatkan data pada posisi ${j}.` });

        }

        gap = Math.floor(gap / 2);

    }

    const full = arr.map((_, idx) => idx);
    snap({ line:10, sorted: full, note:"Selesai — seluruh data terurut." });

    return { steps, comparisons, swaps, result: arr };

}

// ---------- Quick Sort ----------

const QUICK_CODE = [
    "function quickSort(data, low, high):",
    "  jika low < high:",
    "    pivot ← data[high]; i ← low-1",
    "    untuk j dari low sampai high-1:",
    "      jika data[j] < pivot:",
    "        i ← i+1; tukar(data[i], data[j])",
    "    tukar(data[i+1], data[high])",
    "  kembalikan data"
];

function quickBuild(dataArr, key, order){

    const arr = dataArr.slice();
    const n = arr.length;

    let comparisons = 0, swaps = 0;
    let sortedIdx = [];

    const steps = [];

    function snap(extra){
        steps.push(Object.assign({
            array: arr.slice(), sorted: sortedIdx.slice(), comparisons, swaps,
            compare: [], swap: [], active: null, pivot: null, note: "", line: 0
        }, extra));
    }

    snap({ line:0, note:"Mulai — pilih pivot, lalu bagi data menjadi dua bagian." });

    function partitionSort(low, high){

        if(low < high){

            const pivot = arr[high];
            let i = low - 1;

            snap({ line:2, pivot:high, note:`Pilih pivot pada posisi ${high}.` });

            for(let j = low; j < high; j++){

                comparisons++;
                snap({ line:4, pivot:high, compare:[j], note:`Bandingkan posisi ${j} dengan pivot.` });

                if(cmpStudents(arr[j], pivot, key, order) < 0){

                    i++;

                    if(i !== j){
                        const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
                        swaps++;
                    }

                    snap({ line:5, pivot:high, swap:[i, j], note:`Pindahkan posisi ${j} ke bagian kiri (posisi ${i}).` });

                }

            }

            if(i + 1 !== high){
                const t = arr[i+1]; arr[i+1] = arr[high]; arr[high] = t;
                swaps++;
            }

            const p = i + 1;
            sortedIdx.push(p);
            snap({ line:6, sorted: sortedIdx.slice(), swap:[p, high], note:`Tempatkan pivot ke posisi akhirnya (posisi ${p}).` });

            partitionSort(low, p - 1);
            partitionSort(p + 1, high);

        } else if(low === high && low >= 0 && low < n){

            sortedIdx.push(low);
            snap({ line:1, sorted: sortedIdx.slice(), note:`Posisi ${low} hanya berisi satu data, otomatis terurut.` });

        }

    }

    partitionSort(0, n - 1);

    sortedIdx = arr.map((_, idx) => idx);
    snap({ line:7, sorted: sortedIdx.slice(), note:"Selesai — seluruh data terurut." });

    return { steps, comparisons, swaps, result: arr };

}

// ---------- Radix Sort ----------
// Catatan: pada studi kasus ini, Radix Sort hanya mengurutkan berdasarkan
// kolom Nilai (bilangan bulat 0–100) karena algoritma ini bekerja per-digit,
// bukan dengan membandingkan dua data secara langsung.

const RADIX_CODE = [
    "function radixSort(data, kunci=\"nilai\"):",
    "  maks ← nilai_maksimum(data)",
    "  untuk eksponen mulai dari 1 selama maks/eksponen > 0:",
    "    tentukan digit tiap data pada eksponen ini, kelompokkan ke 0–9",
    "    gabungkan kelompok 0..9 jadi data baru",
    "  kembalikan data"
];

function radixBuild(dataArr, key, order){

    const arr = dataArr.slice();
    const n = arr.length;

    let comparisons = 0, swaps = 0;

    const steps = [];

    function snap(extra){
        steps.push(Object.assign({
            array: arr.slice(), sorted: [], comparisons, swaps,
            compare: [], swap: [], active: null, note: "", line: 0
        }, extra));
    }

    snap({ line:0, note:"Mulai — Radix Sort mengurutkan Nilai berdasarkan digitnya, dari digit satuan." });

    const maxVal = Math.max(...arr.map(s => s.nilai), 0);
    snap({ line:1, note:`Nilai maksimum saat ini = ${maxVal}.` });

    const digitOrder = order === "desc"
        ? [9,8,7,6,5,4,3,2,1,0]
        : [0,1,2,3,4,5,6,7,8,9];

    let exp = 1;

    while(Math.floor(maxVal / exp) > 0){

        const place = exp === 1 ? "satuan" : (exp === 10 ? "puluhan" : "ratusan");
        snap({ line:2, note:`Memproses digit tempat ${place}.` });

        const buckets = Array.from({ length: 10 }, () => []);

        for(let idx = 0; idx < n; idx++){

            comparisons++;
            const digit = Math.floor(arr[idx].nilai / exp) % 10;
            buckets[digit].push(arr[idx]);

            snap({ line:3, active:idx, note:`${arr[idx].nama}: nilai ${arr[idx].nilai} → kelompok digit ${digit}.` });

        }

        const newArr = [].concat(...digitOrder.map(d => buckets[d]));
        for(let idx = 0; idx < n; idx++) arr[idx] = newArr[idx];

        swaps += n;
        snap({ line:4, note:"Gabungkan seluruh kelompok (0–9) menjadi urutan data yang baru." });

        exp *= 10;

    }

    const full = arr.map((_, idx) => idx);
    snap({ line:5, sorted: full, note:"Selesai — seluruh data terurut berdasarkan Nilai." });

    return { steps, comparisons, swaps, result: arr };

}

// ---------- Registry ----------

const CASE_ALGORITHMS = {

    bubble: {
        name: "Bubble Sort", opsLabel: "Tukar",
        code: BUBBLE_CODE, build: bubbleBuild, numericOnly: false
    },
    exchange: {
        name: "Exchange Sort", opsLabel: "Tukar",
        code: EXCHANGE_CODE, build: exchangeBuild, numericOnly: false
    },
    selection: {
        name: "Selection Sort", opsLabel: "Tukar",
        code: SELECTION_CODE, build: selectionBuild, numericOnly: false
    },
    insertion: {
        name: "Insertion Sort", opsLabel: "Geser",
        code: INSERTION_CODE, build: insertionBuild, numericOnly: false
    },
    shell: {
        name: "Shell Sort", opsLabel: "Geser",
        code: SHELL_CODE, build: shellBuild, numericOnly: false
    },
    quick: {
        name: "Quick Sort", opsLabel: "Tukar",
        code: QUICK_CODE, build: quickBuild, numericOnly: false
    },
    radix: {
        name: "Radix Sort", opsLabel: "Pindah",
        code: RADIX_CODE, build: radixBuild, numericOnly: true
    }

};
