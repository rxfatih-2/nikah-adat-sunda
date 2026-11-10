/* ============================================
   UNDANGAN DENI & NOVI — Script
   ============================================ */

/* ─── 1. GUEST NAME ─── */
const guestName = new URLSearchParams(location.search).get('to') || 'Tamu Undangan';
document.getElementById('guestNameDisplay').textContent = guestName;
if (guestName !== 'Tamu Undangan') {
    document.getElementById('inputName').value = guestName;
}

/* ─── 2. SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('revealed');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── 3. AUDIO ─── */
const bgAudio = document.getElementById('bgAudio');
const audioIcon = document.getElementById('audioIcon');
const audioContainer = document.getElementById('audioContainer');
let isAudioPlaying = false;
let audioFailed = false;

bgAudio.addEventListener('error', () => {
    audioFailed = true;
    audioContainer.classList.add('hidden');
    console.warn('[Audio] gagal load');
});

function startAudio() {
    if (audioFailed || isAudioPlaying) return;
    bgAudio.volume = 0.5;
    bgAudio.play().then(() => {
        isAudioPlaying = true;
        audioIcon.classList.remove('fa-music');
        audioIcon.classList.add('fa-pause');
        audioContainer.classList.remove('hidden');
    }).catch(() => {});
}

['click', 'keydown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, startAudio, { passive: true });
});
document.addEventListener('scroll', startAudio, { once: true, passive: true });

function openInvitation() {
    const cover = document.getElementById('openingCover');
    document.body.classList.remove('lock-scroll');
    cover.classList.add('cover-exit');

    bgAudio.volume = 0.5;
    bgAudio.play().then(() => {
        isAudioPlaying = true;
        audioIcon.classList.remove('fa-music');
        audioIcon.classList.add('fa-pause');
        audioContainer.classList.remove('hidden');
    }).catch(err => console.log('[Audio]', err));

    setTimeout(() => { cover.style.display = 'none'; }, 1000);
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

/* ─── 4. COUNTDOWN ─── */
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

/* ─── 5. PETALS (subtle) ─── */
(function initPetals() {
    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const petalColors = ['#F5DCDC', '#F0D0D0', '#FCF3F2', '#EAC8C8'];

    class Petal {
        constructor() { this.reset(true); }
        reset(initial = false) {
            this.x = Math.random() * w;
            this.y = initial ? Math.random() * h : -20;
            this.size = Math.random() * 6 + 5;
            this.speedY = Math.random() * 0.6 + 0.4;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 1 - 0.5;
            this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.opacity = Math.random() * 0.3 + 0.35;
        }
        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;
            this.angle += this.spin;
            if (this.y > h + 20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const petals = Array.from({ length: 18 }, () => new Petal());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        petals.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ─── 6. LIGHTBOX ─── */
function openLightbox(src) {
    document.getElementById('lightboxImg').src = src;
    const m = document.getElementById('lightboxModal');
    m.classList.remove('hidden');
    m.classList.add('flex');
}
function closeLightbox() {
    const m = document.getElementById('lightboxModal');
    m.classList.add('hidden');
    m.classList.remove('flex');
    document.getElementById('lightboxImg').src = '';
}

/* ─── 7. COPY ─── */
function copyToClipboard(text, label) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => showToast(`Nomor ${label} disalin`))
            .catch(() => fallbackCopy(text, label));
    } else fallbackCopy(text, label);
}
function fallbackCopy(text, label) {
    const t = document.createElement('textarea');
    t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select(); t.setSelectionRange(0, 99999);
    try { document.execCommand('copy'); showToast(`Nomor ${label} disalin`); }
    catch(e) { showToast('Gagal menyalin'); }
    document.body.removeChild(t);
}

/* ─── 8. TOAST ─── */
let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toastNotification');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.remove('opacity-0'); t.classList.add('opacity-100');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        t.classList.add('opacity-0'); t.classList.remove('opacity-100');
    }, 2500);
}

/* ─── 9. CALENDAR ─── */
function addToCalendar() {
    const p = encodeURIComponent;
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${p('Pernikahan Deni & Novi')}&dates=20261128T010000Z/20261128T090000Z&details=${p('Akad & Resepsi')}&location=${p('Gedung Parahyangan, Bandung')}`, '_blank');
}

/* ─── 10. RSVP ─── */
const WISH_KEY = 'deni_novi_wishes_v4';
const initialWishes = [
    { name: 'Kang Cecep & Kel.', attendance: 'Hadir', wish: 'Wilujeng kasep sareng geulis. Mugia dipaparin kabarokahan dina rumah tanggana.', time: '2 jam lalu' },
    { name: 'Teh Rina Melati',   attendance: 'Hadir', wish: 'Selamat Novi & Deni. Semoga acaranya lancar dan bahagia selalu.', time: '5 jam lalu' },
    { name: 'Dimas Prakoso',     attendance: 'Ragu-ragu', wish: 'Selamat menempuh hidup baru. Semoga sakinah, mawaddah, warahmah.', time: '1 hari lalu' }
];

function loadWishes() {
    let wishes = initialWishes;
    try {
        const s = localStorage.getItem(WISH_KEY);
        if (s) wishes = JSON.parse(s);
    } catch(e) {}
    renderWishes(wishes);
}

function renderWishes(wishes) {
    const feed = document.getElementById('wishFeedList');
    document.getElementById('wishCountBadge').textContent = wishes.length + ' ucapan';
    feed.innerHTML = '';
    wishes.forEach(item => {
        const initials = item.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
        const row = document.createElement('div');
        row.className = 'border-b border-line py-4';
        row.innerHTML = `
            <div class="flex items-baseline justify-between gap-3 mb-1.5">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="w-7 h-7 flex items-center justify-center rounded-full bg-rose-soft text-rose-deep text-[9px] font-medium shrink-0">${initials}</span>
                    <span class="text-[13px] text-ink truncate">${esc(item.name)}</span>
                </div>
                <span class="text-[8px] uppercase tracking-wider text-rose shrink-0">${esc(item.attendance)}</span>
            </div>
            <p class="text-[12px] text-muted leading-relaxed pl-9">${esc(item.wish)}</p>
            <p class="text-[9px] text-muted/60 text-right mt-1.5">${esc(item.time || 'Baru saja')}</p>
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
        const s = localStorage.getItem(WISH_KEY);
        if (s) wishes = JSON.parse(s);
    } catch(e) {}

    wishes.unshift({ name, attendance, wish, time: 'Baru saja' });
    try { localStorage.setItem(WISH_KEY, JSON.stringify(wishes)); } catch(e) {}

    renderWishes(wishes);
    document.getElementById('inputWish').value = '';
    showToast('Ucapan terkirim');
}

function esc(str) {
    return String(str).replace(/[&<>'"]/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
    }[c]));
}

/* ─── INIT ─── */
document.getElementById('rsvpForm').addEventListener('submit', handleRSVPSubmit);
loadWishes();
