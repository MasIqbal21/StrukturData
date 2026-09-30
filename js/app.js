/* =====================================================
   SORTLAB — App Engine
   1. Materi: render + section switching
   2. Studi Kasus / Data Mahasiswa: roster CRUD
   3. Studi Kasus / Visualisasi Sorting: step playback
   4. Studi Kasus / Bandingkan Algoritma: live comparison
   ===================================================== */

function escapeHtml(str){

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}

// ==========================
// 1. PAGE SECTIONS (Materi / Studi Kasus)
// ==========================

const materiSection = document.getElementById("materiSection");
const studiKasusSection = document.getElementById("studiKasusSection");
const materiGrid = document.getElementById("materiGrid");

function showSection(name){

    materiSection.classList.toggle("hidden", name !== "materi");
    studiKasusSection.classList.toggle("hidden", name !== "studikasus");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.section === name);
    });

    window.scrollTo(0, 0);

}

function renderMateri(){

    materiGrid.innerHTML = Object.values(ALGORITHMS)
        .map(algo => `
            <div class="materi-card">
                <h3>${algo.name}</h3>
                <div class="badges">${
                    algo.badges
                        .map(b => `<div class="badge${b.type ? " " + b.type : ""}">${b.text}</div>`)
                        .join("")
                }</div>
                <p>${algo.description}</p>
                <pre class="materi-pre">${algo.pseudocode.map(escapeHtml).join("\n")}</pre>
            </div>
        `)
        .join("");

}

// ==========================
// 2b. MATERI — Visualisasi Interaktif (angka acak + SORTI)
// ==========================

const SORTI_MATERI = createSorti("sortiCharacterMateri");

const materiAlgoTabs = document.querySelectorAll("#materiAlgoTabs .sub-tab");
const btnMateriShuffle = document.getElementById("btnMateriShuffle");

const materiBarsBox = document.getElementById("materiBars");
const materiNoteBar = document.getElementById("materiNoteBar");

const materiCodeTitle = document.getElementById("materiCodeTitle");
const materiCodeBlock = document.getElementById("materiCodeBlock");

const materiCompareCount = document.getElementById("materiCompareCount");
const materiOpsLabel = document.getElementById("materiOpsLabel");
const materiOpsCount = document.getElementById("materiOpsCount");
const materiStepCount = document.getElementById("materiStepCount");

const materiPrev = document.getElementById("materiPrev");
const materiPlay = document.getElementById("materiPlay");
const materiNext = document.getElementById("materiNext");
const materiReset = document.getElementById("materiReset");
const materiProgress = document.getElementById("materiProgress");
const materiSpeed = document.getElementById("materiSpeed");

let materiAlgo = "bubble";
let materiNumbers = [];
let materiRun = null;
let materiStepIndex = 0;
let materiPlaying = false;
let materiTimer = null;
let materiBarEls = [];

function randomMateriNumbers(){

    const n = 7;
    const arr = [];

    for(let i = 0; i < n; i++) arr.push(Math.floor(Math.random() * 85) + 10);

    return arr;

}

function ensureMateriBars(values){

    materiBarsBox.innerHTML = "";
    materiBarEls = [];

    values.forEach(() => {

        const bar = document.createElement("div");
        bar.className = "mbar";
        bar.innerHTML = `<span class="val"></span><div class="fill"></div>`;

        materiBarsBox.appendChild(bar);

        materiBarEls.push({
            el: bar,
            val: bar.querySelector(".val"),
            fill: bar.querySelector(".fill")
        });

    });

}

function renderMateriCode(lines){

    materiCodeBlock.innerHTML = lines
        .map((line, idx) => `<div class="code-line" id="materiLine${idx + 1}">${escapeHtml(line)}</div>`)
        .join("");

}

function highlightMateriLine(line){

    materiCodeBlock.querySelectorAll(".code-line").forEach(el => el.classList.remove("active"));
    document.getElementById(`materiLine${line + 1}`)?.classList.add("active");

}

function renderMateriStep(step){

    const maxV = Math.max(...step.array.map(s => s.nilai), 1);

    for(let i = 0; i < step.array.length; i++){

        const v = step.array[i].nilai;
        const b = materiBarEls[i];

        b.val.textContent = v;
        b.fill.style.height = Math.round((v / maxV) * 120 + 40) + "px";

        let state = "";
        if(step.sorted.includes(i)) state = "sorted";
        if(step.compare.includes(i)) state = "compare";
        if(step.active === i) state = "active";
        if(step.pivot === i) state = "pivot";
        if(step.swap.includes(i)) state = "swap";

        b.el.dataset.state = state;

    }

    highlightMateriLine(step.line);

    materiCompareCount.textContent = step.comparisons;
    materiOpsCount.textContent = step.swaps;
    materiStepCount.textContent = `${materiStepIndex + 1} / ${materiRun.steps.length}`;
    materiProgress.textContent = `${materiStepIndex + 1} / ${materiRun.steps.length}`;

    materiNoteBar.innerHTML = step.note;

    materiPrev.disabled = materiStepIndex <= 0;
    materiNext.disabled = materiStepIndex >= materiRun.steps.length - 1;

    if(step.swap.length){
        SORTI_MATERI.set("swap");
    } else if(step.compare.length){
        SORTI_MATERI.set("right");
    } else if(step.pivot !== null && step.pivot !== undefined){
        SORTI_MATERI.set("explain");
    } else {
        SORTI_MATERI.set("think");
    }

    if(materiStepIndex >= materiRun.steps.length - 1){
        SORTI_MATERI.set("success");
    }

}

function materiGoTo(idx){

    if(!materiRun) return;

    materiStepIndex = Math.max(0, Math.min(materiRun.steps.length - 1, idx));
    renderMateriStep(materiRun.steps[materiStepIndex]);

}

function materiStepForward(){

    if(!materiRun) return false;

    if(materiStepIndex >= materiRun.steps.length - 1){ materiPause(); return false; }

    materiStepIndex++;
    renderMateriStep(materiRun.steps[materiStepIndex]);

    return true;

}

function materiStepBack(){

    if(!materiRun || materiStepIndex <= 0) return;

    materiStepIndex--;
    renderMateriStep(materiRun.steps[materiStepIndex]);

}

function materiTick(){

    if(!materiPlaying) return;

    const ok = materiStepForward();
    if(!ok) return;

    materiTimer = setTimeout(materiTick, Number(materiSpeed.value));

}

function materiPlayFn(){

    if(!materiRun) return;

    if(materiStepIndex >= materiRun.steps.length - 1) materiStepIndex = 0;

    materiPlaying = true;
    materiPlay.textContent = "⏸ Jeda";

    clearTimeout(materiTimer);
    materiTimer = setTimeout(materiTick, Number(materiSpeed.value));

}

function materiPause(){

    materiPlaying = false;
    materiPlay.textContent = "▶ Putar";
    clearTimeout(materiTimer);

}

function runMateriViz(){

    materiPause();

    const algo = CASE_ALGORITHMS[materiAlgo];
    const dataObjs = materiNumbers.map(n => ({ nilai: n }));

    materiRun = algo.build(dataObjs, "nilai", "asc");

    materiCodeTitle.textContent = `${algo.name} — Pseudocode`;
    materiOpsLabel.textContent = algo.opsLabel;

    renderMateriCode(algo.code);
    ensureMateriBars(materiNumbers);

    SORTI_MATERI.set("think");
    materiGoTo(0);

}

materiAlgoTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        materiAlgoTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        materiAlgo = tab.dataset.algo;
        runMateriViz();

    });

});

btnMateriShuffle.addEventListener("click", () => {

    materiNumbers = randomMateriNumbers();
    runMateriViz();

});

materiPlay.addEventListener("click", () => materiPlaying ? materiPause() : materiPlayFn());
materiNext.addEventListener("click", () => { materiPause(); materiStepForward(); });
materiPrev.addEventListener("click", () => { materiPause(); materiStepBack(); });
materiReset.addEventListener("click", () => { materiPause(); if(materiRun) materiGoTo(0); });

// ==========================
// 2. DATA MAHASISWA (roster CRUD)
// ==========================

const STORAGE_KEY = "sortlab-roster-v1";

const DEFAULT_STUDENTS = [
    { nim: "2401001", nama: "Rangga Saputra",      nilai: 78 },
    { nim: "2401002", nama: "Ayu Lestari",          nilai: 92 },
    { nim: "2401003", nama: "Budi Santoso",         nilai: 65 },
    { nim: "2401004", nama: "Citra Dewi Pratiwi",   nilai: 88 },
    { nim: "2401005", nama: "Dimas Prakoso",        nilai: 71 },
    { nim: "2401006", nama: "Elang Nugraha",        nilai: 83 },
    { nim: "2401007", nama: "Fitriani Handayani",   nilai: 59 },
    { nim: "2401008", nama: "Gilang Ramadhan",      nilai: 95 }
];

let students = [];

function loadStudents(){

    try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw){
            const parsed = JSON.parse(raw);
            if(Array.isArray(parsed)) { students = parsed; return; }
        }
    }catch(e){ /* penyimpanan tidak tersedia, pakai data bawaan */ }

    students = DEFAULT_STUDENTS.slice();

}

function saveStudents(){

    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); }
    catch(e){ /* abaikan jika penyimpanan gagal */ }

}

const rosterBody = document.getElementById("rosterBody");
const rosterCount = document.getElementById("rosterCount");

function renderRoster(){

    rosterBody.innerHTML = "";

    if(students.length === 0){

        const tr = document.createElement("tr");
        tr.className = "empty-row";
        tr.innerHTML = '<td colspan="5">Belum ada data mahasiswa. Tambahkan dari form di atas.</td>';
        rosterBody.appendChild(tr);

    } else {

        students.forEach((s, idx) => {

            const tr = document.createElement("tr");

            tr.innerHTML =
                `<td>${idx + 1}</td>` +
                `<td class="nim">${escapeHtml(s.nim)}</td>` +
                `<td>${escapeHtml(s.nama)}</td>` +
                `<td class="nilai">${escapeHtml(s.nilai)}</td>` +
                `<td><button class="del-btn" data-nim="${escapeHtml(s.nim)}">Hapus</button></td>`;

            rosterBody.appendChild(tr);

        });

    }

    rosterCount.textContent = students.length + " mahasiswa";

    rosterBody.querySelectorAll(".del-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const nim = btn.getAttribute("data-nim");
            students = students.filter(s => s.nim !== nim);

            saveStudents();
            renderRoster();
            populateCompareSelects();

        });

    });

}

const addForm = document.getElementById("addForm");
const formError = document.getElementById("formError");

addForm.addEventListener("submit", e => {

    e.preventDefault();

    const nim = document.getElementById("inNim").value.trim();
    const nama = document.getElementById("inNama").value.trim();
    const nilaiRaw = document.getElementById("inNilai").value.trim();

    formError.textContent = "";

    if(!nim || !nama || nilaiRaw === ""){
        formError.textContent = "NIM, nama, dan nilai wajib diisi.";
        return;
    }

    const nilai = Number(nilaiRaw);

    if(isNaN(nilai) || nilai < 0 || nilai > 100){
        formError.textContent = "Nilai harus berupa angka 0–100.";
        return;
    }

    if(students.some(s => s.nim === nim)){
        formError.textContent = `NIM ${nim} sudah terdaftar.`;
        return;
    }

    students.push({ nim, nama, nilai });

    saveStudents();
    renderRoster();
    populateCompareSelects();

    addForm.reset();

});

// ==========================
// 3. SUB-TABS (Data / Sort / Compare views)
// ==========================

const subTabs = document.querySelectorAll("#subTabs .sub-tab");
const skViews = {
    data: document.getElementById("view-data"),
    sort: document.getElementById("view-sort"),
    compare: document.getElementById("view-compare")
};

subTabs.forEach(btn => {

    btn.addEventListener("click", () => {

        pauseSort();
        pauseRace();

        subTabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        Object.keys(skViews).forEach(k => skViews[k].classList.remove("active"));
        skViews[btn.dataset.view].classList.add("active");

    });

});

// ==========================
// 3b. SORT MODE TOGGLE (Tunggal / Race)
// ==========================

const sortModeTabs = document.querySelectorAll("#sortModeToggle .sub-tab");
const soloModePanel = document.getElementById("soloModePanel");
const raceModePanel = document.getElementById("raceModePanel");

sortModeTabs.forEach(btn => {

    btn.addEventListener("click", () => {

        pauseSort();
        pauseRace();

        sortModeTabs.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const mode = btn.dataset.mode;
        soloModePanel.classList.toggle("hidden", mode !== "solo");
        raceModePanel.classList.toggle("hidden", mode !== "race");

    });

});

// ==========================
// 4. VISUALISASI SORTING
// ==========================

const selAlgo = document.getElementById("selAlgo");
const selKey = document.getElementById("selKey");
const selOrder = document.getElementById("selOrder");
const btnRun = document.getElementById("btnRun");
const chipStatus = document.getElementById("chipStatus");
const algoNote = document.getElementById("algoNote");

const skOperationTitle = document.getElementById("skOperationTitle");
const skOperationDesc = document.getElementById("skOperationDesc");
const skCompareCount = document.getElementById("skCompareCount");
const skOpsLabel = document.getElementById("skOpsLabel");
const skOpsCount = document.getElementById("skOpsCount");
const skStepCount = document.getElementById("skStepCount");

const slotsBox = document.getElementById("slotsBox");
const noteBar = document.getElementById("noteBar");

const btnPrev = document.getElementById("btnPrev");
const btnPlay = document.getElementById("btnPlay");
const btnNext = document.getElementById("btnNext");
const btnReset = document.getElementById("btnReset");
const progressEl = document.getElementById("progressEl");
const speedInput = document.getElementById("speedInput");

const btnApply = document.getElementById("btnApply");
const applyNote = document.getElementById("applyNote");

const skCodeTitle = document.getElementById("skCodeTitle");
const skCodeBlock = document.getElementById("skCodeBlock");

let currentRun = null;
let stepIndex = 0;
let playing = false;
let playTimer = null;
let slotEls = [];

const TAG_TEXT = { compare: "dibandingkan", swap: "digeser/tukar", active: "acuan", sorted: "terurut", pivot: "pivot" };

function updateAlgoNote(){

    const algo = CASE_ALGORITHMS[selAlgo.value];

    if(algo.numericOnly){
        selKey.value = "nilai";
        selKey.disabled = true;
        algoNote.textContent = "Radix Sort pada studi kasus ini hanya mengurutkan berdasarkan Nilai (bilangan 0–100).";
    } else {
        selKey.disabled = false;
        algoNote.textContent = "";
    }

}

selAlgo.addEventListener("change", updateAlgoNote);

function renderSkCode(lines){

    skCodeBlock.innerHTML = lines
        .map((line, idx) => `<div class="code-line" id="skLine${idx + 1}">${escapeHtml(line)}</div>`)
        .join("");

}

function highlightSkLine(line){

    skCodeBlock.querySelectorAll(".code-line").forEach(el => el.classList.remove("active"));
    document.getElementById(`skLine${line + 1}`)?.classList.add("active");

}

function ensureSlots(n){

    slotsBox.innerHTML = "";
    slotEls = [];

    for(let i = 0; i < n; i++){

        const row = document.createElement("div");
        row.className = "slot-row";

        row.innerHTML = `
            <span class="pos">#${i}</span>
            <span class="nim"></span>
            <span class="nama"></span>
            <span class="nilai"></span>
            <span class="tag"></span>
        `;

        slotsBox.appendChild(row);

        slotEls.push({
            row,
            nim: row.querySelector(".nim"),
            nama: row.querySelector(".nama"),
            nilai: row.querySelector(".nilai"),
            tag: row.querySelector(".tag")
        });

    }

}

function renderStep(step){

    for(let i = 0; i < step.array.length; i++){

        const stu = step.array[i];
        const el = slotEls[i];

        el.nim.textContent = stu.nim;
        el.nama.textContent = stu.nama;
        el.nilai.textContent = stu.nilai;

        let state = "";
        if(step.sorted.includes(i)) state = "sorted";
        if(step.compare.includes(i)) state = "compare";
        if(step.active === i) state = "active";
        if(step.pivot === i) state = "pivot";
        if(step.swap.includes(i)) state = "swap";

        el.row.dataset.state = state;
        el.tag.textContent = state ? TAG_TEXT[state] : "";

    }

    highlightSkLine(step.line);

    skCompareCount.textContent = step.comparisons;
    skOpsCount.textContent = step.swaps;
    skStepCount.textContent = `${stepIndex + 1} / ${currentRun.steps.length}`;

    noteBar.innerHTML = step.note;

    progressEl.textContent = `${stepIndex + 1} / ${currentRun.steps.length}`;
    btnPrev.disabled = stepIndex <= 0;
    btnNext.disabled = stepIndex >= currentRun.steps.length - 1;

    if(step.swap.length){
        swapping();
    } else if(step.compare.length){
        compareRight();
    } else if(step.pivot !== null && step.pivot !== undefined){
        explaining();
    } else {
        thinking();
    }

    if(stepIndex >= currentRun.steps.length - 1){
        finishSort();
        btnApply.disabled = false;
    }

}

function goTo(idx){

    if(!currentRun) return;

    stepIndex = Math.max(0, Math.min(currentRun.steps.length - 1, idx));
    renderStep(currentRun.steps[stepIndex]);

}

function stepForwardSort(){

    if(!currentRun) return false;

    if(stepIndex >= currentRun.steps.length - 1){ pauseSort(); return false; }

    stepIndex++;
    renderStep(currentRun.steps[stepIndex]);

    return true;

}

function stepBackSort(){

    if(!currentRun || stepIndex <= 0) return;

    stepIndex--;
    renderStep(currentRun.steps[stepIndex]);

}

function tickSort(){

    if(!playing) return;

    const ok = stepForwardSort();
    if(!ok) return;

    playTimer = setTimeout(tickSort, Number(speedInput.value));

}

function playSort(){

    if(!currentRun) return;

    if(stepIndex >= currentRun.steps.length - 1) stepIndex = 0;

    playing = true;
    btnPlay.textContent = "⏸ Jeda";

    clearTimeout(playTimer);
    playTimer = setTimeout(tickSort, Number(speedInput.value));

}

function pauseSort(){

    playing = false;
    btnPlay.textContent = "▶ Putar";
    clearTimeout(playTimer);

}

function runVisualization(){

    pauseSort();

    if(students.length < 2){
        chipStatus.textContent = "Butuh minimal 2 mahasiswa";
        return;
    }

    const algoKey = selAlgo.value;
    const algo = CASE_ALGORITHMS[algoKey];
    const key = selKey.value;
    const order = selOrder.value;

    currentRun = algo.build(students, key, order);

    skCodeTitle.textContent = `${algo.name} — Pseudocode`;
    skOpsLabel.textContent = algo.opsLabel;

    renderSkCode(algo.code);
    ensureSlots(students.length);

    skOperationTitle.textContent = "BERJALAN";
    skOperationDesc.textContent = `Menjalankan ${algo.name} pada data mahasiswa saat ini.`;

    chipStatus.textContent = `${currentRun.steps.length} langkah · ${currentRun.comparisons} perbandingan · ${currentRun.swaps} ${algo.opsLabel.toLowerCase()}`;

    btnApply.disabled = true;
    applyNote.textContent = "";

    thinking();
    goTo(0);

}

function applyOrder(){

    if(!currentRun) return;

    students = currentRun.result.map(s => ({ nim: s.nim, nama: s.nama, nilai: s.nilai }));

    saveStudents();
    renderRoster();
    populateCompareSelects();

    const keyLabel = selKey.value === "nilai" ? "Nilai" : (selKey.value === "nama" ? "Nama" : "NIM");
    const orderLabel = selOrder.value === "asc" ? "naik" : "turun";

    applyNote.textContent = `Urutan diterapkan ke Data Mahasiswa (${keyLabel} ${orderLabel}).`;

}

btnRun.addEventListener("click", runVisualization);
btnPlay.addEventListener("click", () => playing ? pauseSort() : playSort());
btnNext.addEventListener("click", () => { pauseSort(); stepForwardSort(); });
btnPrev.addEventListener("click", () => { pauseSort(); stepBackSort(); });
btnReset.addEventListener("click", () => { pauseSort(); if(currentRun) goTo(0); });
btnApply.addEventListener("click", applyOrder);

// ==========================
// 4c. SORTING GANDA (RACE) — dua algoritma berjalan bersamaan
// ==========================

const raceAlgoA = document.getElementById("raceAlgoA");
const raceAlgoB = document.getElementById("raceAlgoB");
const raceKey = document.getElementById("raceKey");
const raceOrder = document.getElementById("raceOrder");
const btnRaceRun = document.getElementById("btnRaceRun");
const raceChipStatus = document.getElementById("raceChipStatus");
const raceAlgoNote = document.getElementById("raceAlgoNote");

const raceNoteBar = document.getElementById("raceNoteBar");
const raceWinnerBanner = document.getElementById("raceWinnerBanner");

const raceBtnPrev = document.getElementById("raceBtnPrev");
const raceBtnPlay = document.getElementById("raceBtnPlay");
const raceBtnNext = document.getElementById("raceBtnNext");
const raceBtnReset = document.getElementById("raceBtnReset");
const raceProgressEl = document.getElementById("raceProgressEl");
const raceSpeedInput = document.getElementById("raceSpeedInput");

const raceBtnApply = document.getElementById("raceBtnApply");
const raceApplyNote = document.getElementById("raceApplyNote");

const SORTI_RACE = createSorti("sortiCharacterRace");

function getRaceCol(suffix){

    return {
        colEl: document.getElementById("raceCol" + suffix),
        nameEl: document.getElementById("raceName" + suffix),
        crown: document.getElementById("raceCrown" + suffix),
        finBadge: document.getElementById("raceFin" + suffix),
        compEl: document.getElementById("raceComp" + suffix),
        opsLabelEl: document.getElementById("raceOpsLabel" + suffix),
        opsEl: document.getElementById("raceOps" + suffix),
        codeEl: document.getElementById("raceCode" + suffix),
        slotsBox: document.getElementById("raceSlots" + suffix),
        slotEls: [],
        run: null
    };

}

const raceCols = { A: getRaceCol("A"), B: getRaceCol("B") };

let raceIndex = 0;
let racePlaying = false;
let raceTimer = null;

function populateRaceSelects(){

    const options = Object.keys(CASE_ALGORITHMS)
        .map(k => `<option value="${k}">${CASE_ALGORITHMS[k].name}</option>`)
        .join("");

    const prevA = raceAlgoA.value || "bubble";
    const prevB = raceAlgoB.value || "insertion";

    raceAlgoA.innerHTML = options;
    raceAlgoB.innerHTML = options;

    raceAlgoA.value = prevA;
    raceAlgoB.value = prevB;

}

function updateRaceKeyLock(){

    const aNumeric = CASE_ALGORITHMS[raceAlgoA.value].numericOnly;
    const bNumeric = CASE_ALGORITHMS[raceAlgoB.value].numericOnly;

    if(aNumeric || bNumeric){
        raceKey.value = "nilai";
        raceKey.disabled = true;
        raceAlgoNote.textContent = "Radix Sort hanya bisa mengurutkan berdasarkan Nilai (bilangan 0–100).";
    } else {
        raceKey.disabled = false;
        raceAlgoNote.textContent = "";
    }

}

raceAlgoA.addEventListener("change", updateRaceKeyLock);
raceAlgoB.addEventListener("change", updateRaceKeyLock);

function ensureRaceSlots(col, n){

    col.slotsBox.innerHTML = "";
    col.slotEls = [];

    for(let i = 0; i < n; i++){

        const row = document.createElement("div");
        row.className = "slot-row";

        row.innerHTML = `
            <span class="pos">#${i}</span>
            <span class="nim"></span>
            <span class="nama"></span>
            <span class="nilai"></span>
            <span class="tag"></span>
        `;

        col.slotsBox.appendChild(row);

        col.slotEls.push({
            row,
            nim: row.querySelector(".nim"),
            nama: row.querySelector(".nama"),
            nilai: row.querySelector(".nilai"),
            tag: row.querySelector(".tag")
        });

    }

}

function renderRaceCode(col, lines){

    col.codeEl.innerHTML = lines
        .map((line, idx) => `<div class="code-line" id="${col.codeEl.id}Line${idx + 1}">${escapeHtml(line)}</div>`)
        .join("");

}

function highlightRaceLine(col, line){

    col.codeEl.querySelectorAll(".code-line").forEach(el => el.classList.remove("active"));
    document.getElementById(`${col.codeEl.id}Line${line + 1}`)?.classList.add("active");

}

function renderRaceColumnStep(col, step){

    for(let i = 0; i < step.array.length; i++){

        const stu = step.array[i];
        const el = col.slotEls[i];

        el.nim.textContent = stu.nim;
        el.nama.textContent = stu.nama;
        el.nilai.textContent = stu.nilai;

        let state = "";
        if(step.sorted.includes(i)) state = "sorted";
        if(step.compare.includes(i)) state = "compare";
        if(step.active === i) state = "active";
        if(step.pivot === i) state = "pivot";
        if(step.swap.includes(i)) state = "swap";

        el.row.dataset.state = state;
        el.tag.textContent = state ? TAG_TEXT[state] : "";

    }

    highlightRaceLine(col, step.line);

    col.compEl.textContent = step.comparisons;
    col.opsEl.textContent = step.swaps;

}

function raceMaxLen(){

    return Math.max(raceCols.A.run.steps.length, raceCols.B.run.steps.length);

}

function renderRace(){

    const maxLen = raceMaxLen();

    const stepA = raceCols.A.run.steps[Math.min(raceIndex, raceCols.A.run.steps.length - 1)];
    const stepB = raceCols.B.run.steps[Math.min(raceIndex, raceCols.B.run.steps.length - 1)];

    renderRaceColumnStep(raceCols.A, stepA);
    renderRaceColumnStep(raceCols.B, stepB);

    const doneA = raceIndex >= raceCols.A.run.steps.length - 1;
    const doneB = raceIndex >= raceCols.B.run.steps.length - 1;

    raceCols.A.finBadge.classList.toggle("show", doneA);
    raceCols.B.finBadge.classList.toggle("show", doneB);
    raceCols.A.finBadge.textContent = `selesai di langkah ${raceCols.A.run.steps.length}`;
    raceCols.B.finBadge.textContent = `selesai di langkah ${raceCols.B.run.steps.length}`;

    raceNoteBar.innerHTML =
        `<div><b>${raceCols.A.nameEl.textContent}:</b> ${stepA.note}</div>` +
        `<div style="margin-top:6px;"><b>${raceCols.B.nameEl.textContent}:</b> ${stepB.note}</div>`;

    raceProgressEl.textContent = `${raceIndex + 1} / ${maxLen}`;
    raceBtnPrev.disabled = raceIndex <= 0;
    raceBtnNext.disabled = raceIndex >= maxLen - 1;

    if(stepA.swap.length || stepB.swap.length) SORTI_RACE.set("swap");
    else if(stepA.compare.length || stepB.compare.length) SORTI_RACE.set("right");
    else SORTI_RACE.set("think");

    const atEnd = raceIndex >= maxLen - 1;

    raceCols.A.colEl.classList.remove("winner");
    raceCols.B.colEl.classList.remove("winner");
    raceCols.A.crown.classList.remove("show");
    raceCols.B.crown.classList.remove("show");
    raceWinnerBanner.classList.remove("show");

    if(atEnd){
        showRaceWinner();
        raceBtnApply.disabled = false;
        SORTI_RACE.set("success");
    }

}

function showRaceWinner(){

    const opsA = raceCols.A.run.comparisons + raceCols.A.run.swaps;
    const opsB = raceCols.B.run.comparisons + raceCols.B.run.swaps;
    const nameA = raceCols.A.nameEl.textContent;
    const nameB = raceCols.B.nameEl.textContent;

    if(opsA === opsB){
        raceWinnerBanner.innerHTML = `⚖️ <b>Sama cepat</b> — ${nameA} dan ${nameB} sama-sama melakukan ${opsA} operasi (perbandingan + tukar/geser) untuk data ini.`;
    } else {
        const bWins = opsB < opsA;
        const winCol = bWins ? raceCols.B : raceCols.A;
        const winName = bWins ? nameB : nameA;
        const loseName = bWins ? nameA : nameB;
        const opsWin = Math.min(opsA, opsB);
        const opsLose = Math.max(opsA, opsB);

        winCol.colEl.classList.add("winner");
        winCol.crown.classList.add("show");

        raceWinnerBanner.innerHTML = `🏆 <b>${winName} lebih cepat</b> pada data ini — ${opsWin} operasi, dibanding ${loseName} yang butuh ${opsLose} operasi.`;
    }

    raceWinnerBanner.classList.add("show");

}

function raceGoTo(idx){

    if(!raceCols.A.run) return;

    raceIndex = Math.max(0, Math.min(raceMaxLen() - 1, idx));
    renderRace();

}

function raceStepForward(){

    if(!raceCols.A.run) return false;

    if(raceIndex >= raceMaxLen() - 1){ pauseRace(); return false; }

    raceIndex++;
    renderRace();

    return true;

}

function raceStepBack(){

    if(!raceCols.A.run || raceIndex <= 0) return;

    raceIndex--;
    renderRace();

}

function raceTick(){

    if(!racePlaying) return;

    const ok = raceStepForward();
    if(!ok) return;

    raceTimer = setTimeout(raceTick, Number(raceSpeedInput.value));

}

function playRace(){

    if(!raceCols.A.run) return;

    if(raceIndex >= raceMaxLen() - 1) raceIndex = 0;

    racePlaying = true;
    raceBtnPlay.textContent = "⏸ Jeda";

    clearTimeout(raceTimer);
    raceTimer = setTimeout(raceTick, Number(raceSpeedInput.value));

}

function pauseRace(){

    racePlaying = false;
    raceBtnPlay.textContent = "▶ Putar";
    clearTimeout(raceTimer);

}

function runRace(){

    pauseRace();

    if(students.length < 2){
        raceChipStatus.textContent = "Butuh minimal 2 mahasiswa";
        return;
    }

    const algoAKey = raceAlgoA.value;
    const algoBKey = raceAlgoB.value;
    const algoA = CASE_ALGORITHMS[algoAKey];
    const algoB = CASE_ALGORITHMS[algoBKey];
    const key = raceKey.value;
    const order = raceOrder.value;

    raceCols.A.run = algoA.build(students, key, order);
    raceCols.B.run = algoB.build(students, key, order);

    raceCols.A.nameEl.textContent = algoA.name;
    raceCols.B.nameEl.textContent = algoB.name;

    raceCols.A.opsLabelEl.textContent = algoA.opsLabel;
    raceCols.B.opsLabelEl.textContent = algoB.opsLabel;

    renderRaceCode(raceCols.A, algoA.code);
    renderRaceCode(raceCols.B, algoB.code);

    ensureRaceSlots(raceCols.A, students.length);
    ensureRaceSlots(raceCols.B, students.length);

    raceChipStatus.textContent = `${algoA.name}: ${raceCols.A.run.steps.length} langkah · ${algoB.name}: ${raceCols.B.run.steps.length} langkah`;

    raceBtnApply.disabled = true;
    raceApplyNote.textContent = "";

    SORTI_RACE.set("think");
    raceIndex = 0;
    raceGoTo(0);

}

function applyRaceOrder(){

    if(!raceCols.A.run) return;

    students = raceCols.A.run.result.map(s => ({ nim: s.nim, nama: s.nama, nilai: s.nilai }));

    saveStudents();
    renderRoster();
    populateCompareSelects();

    raceApplyNote.textContent = "Urutan diterapkan ke Data Mahasiswa.";

}

btnRaceRun.addEventListener("click", runRace);
raceBtnPlay.addEventListener("click", () => racePlaying ? pauseRace() : playRace());
raceBtnNext.addEventListener("click", () => { pauseRace(); raceStepForward(); });
raceBtnPrev.addEventListener("click", () => { pauseRace(); raceStepBack(); });
raceBtnReset.addEventListener("click", () => { pauseRace(); if(raceCols.A.run) raceGoTo(0); });
raceBtnApply.addEventListener("click", applyRaceOrder);

// ==========================
// 5. BANDINGKAN ALGORITMA
// ==========================

const COMPLEXITY_TABLE = [
    { key: "bubble",    avg: "O(n²)",     worst: "O(n²)",   space: "O(1)",     stable: "Ya" },
    { key: "exchange",  avg: "O(n²)",     worst: "O(n²)",   space: "O(1)",     stable: "Tidak" },
    { key: "selection", avg: "O(n²)",     worst: "O(n²)",   space: "O(1)",     stable: "Tidak" },
    { key: "insertion", avg: "O(n²)",     worst: "O(n²)",   space: "O(1)",     stable: "Ya" },
    { key: "shell",     avg: "O(n^1.3)",  worst: "O(n²)",   space: "O(1)",     stable: "Tidak" },
    { key: "quick",     avg: "O(n log n)",worst: "O(n²)",   space: "O(log n)", stable: "Tidak" },
    { key: "radix",     avg: "O(n·k)",    worst: "O(n·k)",  space: "O(n+k)",   stable: "Ya" }
];

const compareTableBody = document.getElementById("compareTableBody");

function renderCompareTable(){

    compareTableBody.innerHTML = COMPLEXITY_TABLE
        .map(row => `
            <tr>
                <td>${CASE_ALGORITHMS[row.key].name}</td>
                <td>${row.avg}</td>
                <td>${row.worst}</td>
                <td>${row.space}</td>
                <td>${row.stable}</td>
            </tr>
        `)
        .join("");

}

const cmpAlgoA = document.getElementById("cmpAlgoA");
const cmpAlgoB = document.getElementById("cmpAlgoB");
const cmpKey = document.getElementById("cmpKey");
const cmpOrder = document.getElementById("cmpOrder");
const btnCompareRun = document.getElementById("btnCompareRun");

const resultGrid = document.getElementById("resultGrid");
const resultVerdict = document.getElementById("resultVerdict");

function populateCompareSelects(){

    const options = Object.keys(CASE_ALGORITHMS)
        .map(k => `<option value="${k}">${CASE_ALGORITHMS[k].name}</option>`)
        .join("");

    const prevA = cmpAlgoA.value || "bubble";
    const prevB = cmpAlgoB.value || "insertion";

    cmpAlgoA.innerHTML = options;
    cmpAlgoB.innerHTML = options;

    cmpAlgoA.value = prevA;
    cmpAlgoB.value = prevB || "insertion";

}

function updateCompareKeyLock(){

    const aNumeric = CASE_ALGORITHMS[cmpAlgoA.value].numericOnly;
    const bNumeric = CASE_ALGORITHMS[cmpAlgoB.value].numericOnly;

    if(aNumeric || bNumeric){
        cmpKey.value = "nilai";
        cmpKey.disabled = true;
    } else {
        cmpKey.disabled = false;
    }

}

cmpAlgoA.addEventListener("change", updateCompareKeyLock);
cmpAlgoB.addEventListener("change", updateCompareKeyLock);

function runCompare(){

    if(students.length < 2){
        resultVerdict.textContent = "Butuh minimal 2 mahasiswa untuk membandingkan.";
        resultGrid.style.display = "none";
        return;
    }

    const algoAKey = cmpAlgoA.value;
    const algoBKey = cmpAlgoB.value;
    const algoA = CASE_ALGORITHMS[algoAKey];
    const algoB = CASE_ALGORITHMS[algoBKey];
    const key = cmpKey.value;
    const order = cmpOrder.value;

    const rA = algoA.build(students, key, order);
    const rB = algoB.build(students, key, order);

    const totalA = rA.comparisons + rA.swaps;
    const totalB = rB.comparisons + rB.swaps;
    const maxVal = Math.max(rA.comparisons, rA.swaps, totalA, rB.comparisons, rB.swaps, totalB, 1);

    resultGrid.style.display = "grid";

    document.getElementById("cardATitle").firstChild.textContent = algoA.name + " ";
    document.getElementById("cardBTitle").firstChild.textContent = algoB.name + " ";
    document.getElementById("aOpsLbl").textContent = algoA.opsLabel;
    document.getElementById("bOpsLbl").textContent = algoB.opsLabel;

    document.getElementById("aNumComp").textContent = rA.comparisons;
    document.getElementById("aNumOps").textContent = rA.swaps;
    document.getElementById("aNumTotal").textContent = totalA;
    document.getElementById("bNumComp").textContent = rB.comparisons;
    document.getElementById("bNumOps").textContent = rB.swaps;
    document.getElementById("bNumTotal").textContent = totalB;

    document.getElementById("aBarComp").style.width = (rA.comparisons / maxVal * 100) + "%";
    document.getElementById("aBarOps").style.width = (rA.swaps / maxVal * 100) + "%";
    document.getElementById("aBarTotal").style.width = (totalA / maxVal * 100) + "%";
    document.getElementById("bBarComp").style.width = (rB.comparisons / maxVal * 100) + "%";
    document.getElementById("bBarOps").style.width = (rB.swaps / maxVal * 100) + "%";
    document.getElementById("bBarTotal").style.width = (totalB / maxVal * 100) + "%";

    const cardA = document.getElementById("cardA");
    const cardB = document.getElementById("cardB");
    const tagAWin = document.getElementById("tagAWin");
    const tagBWin = document.getElementById("tagBWin");

    cardA.classList.remove("winner-card");
    cardB.classList.remove("winner-card");
    tagAWin.classList.remove("show");
    tagBWin.classList.remove("show");

    if(totalA === totalB){
        resultVerdict.innerHTML = `⚖️ Untuk ${students.length} data mahasiswa saat ini, <b>kedua algoritma sama cepat</b>: masing-masing melakukan ${totalA} total operasi.`;
    } else {
        const bWins = totalB < totalA;
        const winCard = bWins ? cardB : cardA;
        const winTag = bWins ? tagBWin : tagAWin;
        const winName = bWins ? algoB.name : algoA.name;
        const opsWin = Math.min(totalA, totalB);
        const opsLose = Math.max(totalA, totalB);

        winCard.classList.add("winner-card");
        winTag.classList.add("show");

        resultVerdict.innerHTML = `🏆 Untuk ${students.length} data mahasiswa saat ini, <b>${winName} lebih cepat</b> — hanya ${opsWin} total operasi, dibanding ${opsLose} operasi pada algoritma satunya. Hasil ini bisa berbeda tergantung seberapa acak susunan data.`;
    }

}

btnCompareRun.addEventListener("click", runCompare);

// ==========================
// INITIALIZE
// ==========================

window.onload = () => {

    renderMateri();
    showSection("materi");

    materiNumbers = randomMateriNumbers();
    runMateriViz();

    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", e => {
            e.preventDefault();
            showSection(link.dataset.section);
        });

    });

    document.getElementById("ctaBtn").addEventListener("click", () =>
        showSection("studikasus")
    );

    loadStudents();
    renderRoster();

    updateAlgoNote();
    renderCompareTable();
    populateCompareSelects();
    updateCompareKeyLock();

    populateRaceSelects();
    updateRaceKeyLock();

    idle();

};
