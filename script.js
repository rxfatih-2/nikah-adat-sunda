/* ============================================
   UNDANGAN DENI & NOVI — Main Script
   ============================================ */

/* ────────────────────────────────────────────
   1. GUEST NAME DARI URL
   ──────────────────────────────────────────── */
const guestName = new URLSearchParams(location.search).get('to') || 'Tamu Undangan';
document.getElementById('guestNameDisplay').textContent = guestName;
if (guestName !== 'Tamu Undangan') {
    document.getElementById('inputName').value = guestName;
}

/* ────────────────────────────────────────────
   2. AUDIO
   ──────────────────────────────────────────── */
const bgAudio = document.getElementById('bgAudio');
const audioIcon = document.getElementById('audioIcon');
const audioContainer = document.getElementById('audioContainer');

let isAudioPlaying = false;
let audioFailed = false;

bgAudio.addEventListener('error', () => {
    audioFailed = true;
    audioContainer.classList.add('hidden');
    console.warn('[Audio] Backsound gagal load — cek URL / koneksi');
});

function startAudio() {
    if (audioFailed || isAudioPlaying) return;
    bgAudio.volume = 0.55;
    bgAudio.play().then(() => {
        isAudioPlaying = true;
        audioIcon.classList.remove('fa-music');
        audioIcon.classList.add('fa-pause');
        audioContainer.classList.remove('hidden');
    }).catch(() => { /* browser blok, tunggu gesture lain */ });
}

// Unlock di gesture pertama apa pun
['click', 'keydown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, startAudio, { passive: true });
});
document.addEventListener('scroll', startAudio, { once: true, passive: true });

function openInvitation() {
    const cover = document.getElementById('openingCover');
    document.body.classList.remove('lock-scroll');
    document.documentElement.classList.remove('lock-scroll');
    cover.classList.add('cover-exit');

    bgAudio.volume = 0.55;
    bgAudio.play().then(() => {
        isAudioPlaying = true;
        audioIcon.classList.remove('fa-music');
        audioIcon.classList.add('fa-pause');
        audioContainer.classList.remove('hidden');
    }).catch(err => console.log('[Audio] Play gagal:', err));

    setTimeout(() => { cover.style.display = 'none'; }, 950);
}

function toggleAudio() {
    if (audioFailed) return;
    if (isAudioPlaying) {
        bgAudio.pause();
        isAudioPlaying = false;
        audioIcon.classList.remove('fa-pause');
        audioIcon.classList.add('fa-music');
        showToast('Musik dimatikan');
    } else {
        bgAudio.play().then(() => {
            isAudioPlaying = true;
            audioIcon.classList.remove('fa-music');
            audioIcon.classList.add('fa-pause');
            showToast('Musik diputar');
        }).catch(() => showToast('Gagal memutar musik'));
    }
}

/* ────────────────────────────────────────────
   3. COUNTDOWN
   ──────────────────────────────────────────── */
const targetDate = new Date('2026-11-28T08:00:00+07:00').getTime();

function updateCountdown() {
    const diff = targetDate - Date.now();
    if (diff <= 0) return;
    document.getElementById('cdDays').textContent  = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('cdMins').textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cdSecs').textContent  = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ────────────────────────────────────────────
   4. LIGHTBOX
   ──────────────────────────────────────────── */
function openLightbox(src) {
    document.getElementById('lightboxImg').src = src;
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('lightboxImg').src = '';
}

/* ────────────────────────────────────────────
   5. COPY TO CLIPBOARD
   ──────────────────────────────────────────── */
function copyToClipboard(text, label) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Nomor ${label} disalin`);
        }).catch(() => fallbackCopy(text, label));
    } else {
        fallbackCopy(text, label);
    }
}

function fallbackCopy(text, label) {
    const tmp = document.createElement('textarea');
    tmp.value = text;
    tmp.style.position = 'fixed';
    tmp.style.opacity = '0';
    document.body.appendChild(tmp);
    tmp.select();
    tmp.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
        showToast(`Nomor ${label} disalin`);
    } catch (e) {
        showToast('Gagal menyalin');
    }
    document.body.removeChild(tmp);
}

/* ────────────────────────────────────────────
   6. TOAST
   ──────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add('opacity-0');
        toast.classList.remove('opacity-100');
    }, 2500);
}

/* ────────────────────────────────────────────
   7. GOOGLE CALENDAR
   ──────────────────────────────────────────── */
function addToCalendar() {
    const title = encodeURIComponent('Pernikahan Deni & Novi');
    const details = encodeURIComponent('Akad Nikah & Resepsi Pernikahan Deni Ramdani & Novi Nuraini');
    const location = encodeURIComponent('Gedung Parahyangan, Jl. Raya Pajajaran No. 88, Bandung');
    const start = '20261128T010000Z';
    const end   = '20261128T090000Z';
    window.open(
        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`,
        '_blank'
    );
}

/* ────────────────────────────────────────────
   8. RSVP + WISH FEED
   ──────────────────────────────────────────── */
const WISH_KEY = 'deni_novi_wishes_v3';

const initialWishes = [
    { name: 'Kang Cecep & Kel.', attendance: 'Hadir',     wish: 'Wilujeng kasep sareng geulis. Mugia dipaparin kasehatan, kalancaran, sareng kabarokahan dina rumah tanggana.', time: '2 jam lalu' },
    { name: 'Teh Rina Melati',   attendance: 'Hadir',     wish: 'Selamat ya Novi & Deni. Semoga acaranya lancar sampai hari H dan bahagia selalu.', time: '5 jam lalu' },
    { name: 'Dimas Prakoso',     attendance: 'Ragu-ragu', wish: 'Selamat menempuh hidup baru. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.', time: '1 hari lalu' }
];

function loadWishes() {
    let wishes = initialWishes;
    try {
        const saved = localStorage.getItem(WISH_KEY);
        if (saved) wishes = JSON.parse(saved);
    } catch (e) { /* ignore */ }
    renderWishes(wishes);
}

function renderWishes(wishes) {
    const feed = document.getElementById('wishFeedList');
    document.getElementById('wishCountBadge').textContent = wishes.length + ' ucapan';
    feed.innerHTML = '';

    wishes.forEach(item => {
        const initials = item.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const row = document.createElement('div');
        row.className = 'border-b border-line py-4';
        row.innerHTML = `
            <div class="flex items-baseline justify-between gap-3 mb-1.5">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="text-[9px] w-7 h-7 flex items-center justify-center rounded-full bg-blush text-rose shrink-0 font-medium">${initials}</span>
                    <span class="text-[13px] md:text-[14px] text-ink truncate">${escapeHTML(item.name)}</span>
                </div>
                <span class="text-[8px] md:text-[9px] uppercase tracking-wider text-muted shrink-0">${escapeHTML(item.attendance)}</span>
            </div>
            <p class="text-[12px] md:text-[13px] text-muted leading-relaxed pl-9">${escapeHTML(item.wish)}</p>
            <p class="text-[9px] text-muted/60 text-right mt-1.5">${escapeHTML(item.time || 'Baru saja')}</p>
        `;
        feed.appendChild(row);
    });
}

function handleRSVPSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('inputName').value.trim();
    const attendance = document.getElementById('inputAttendance').value;
    const wish = document.getElementById('inputWish').value.trim();
    if (!name || !wish) return;

    let wishes = initialWishes;
    try {
        const saved = localStorage.getItem(WISH_KEY);
        if (saved) wishes = JSON.parse(saved);
    } catch (e) { /* ignore */ }

    wishes.unshift({ name, attendance, wish, time: 'Baru saja' });
    try {
        localStorage.setItem(WISH_KEY, JSON.stringify(wishes));
    } catch (e) { /* quota penuh, ignore */ }

    renderWishes(wishes);
    document.getElementById('inputWish').value = '';
    showToast('Ucapan terkirim');
}

function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[c]));
}

/* ────────────────────────────────────────────
   9. FORM SUBMIT BINDING
   ──────────────────────────────────────────── */
document.getElementById('rsvpForm').addEventListener('submit', handleRSVPSubmit);

/* ────────────────────────────────────────────
   10. INIT
   ──────────────────────────────────────────── */
loadWishes();
