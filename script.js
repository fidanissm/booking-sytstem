// ==========================================================================
// 1. QLOVAL MƏLUMAT BAZASI (MOCK DATA)
// ==========================================================================
const fakeLocations = [
    { city: "Bakı", code: "GYD", country: "Azərbaycan" },
    { city: "İstanbul", code: "IST", country: "Türkiyə" },
    { city: "Dubay", code: "DXB", country: "BƏƏ" },
    { city: "London", code: "LHR", country: "Böyük Britaniya" },
    { city: "Paris", code: "CDG", country: "Fransa" },
    { city: "Frankfurt", code: "FRA", country: "Almaniya" },
    { city: "Nyu-York", code: "JFK", country: "ABŞ" },
    { city: "Tokio", code: "HND", country: "Yaponiya" },
    { city: "Roma", code: "FCO", country: "İtaliya" },
    { city: "Milan", code: "MXP", country: "İtaliya" }
];

const mockFlights = [
    { id: 1, airline: "AZAL", flightNo: "J2-810", origin: "Bakı", dest: "İstanbul", depTime: "10:30", arrTime: "13:40", duration: "3s 10d", price: 350 },
    { id: 2, airline: "Turkish Airlines", flightNo: "TK-333", origin: "Bakı", dest: "İstanbul", depTime: "14:15", arrTime: "17:25", duration: "3s 10d", price: 420 },
    { id: 3, airline: "Pegasus", flightNo: "PC-444", origin: "Bakı", dest: "İstanbul", depTime: "21:00", arrTime: "00:15", duration: "3s 15d", price: 210 },
    { id: 4, airline: "AZAL", flightNo: "J2-111", origin: "Bakı", dest: "Dubay", depTime: "08:00", arrTime: "11:00", duration: "3s 00d", price: 560 },
    { id: 5, airline: "Air France", flightNo: "AF-223", origin: "Bakı", dest: "Paris", depTime: "06:15", arrTime: "11:30", duration: "6s 15d", price: 780 }
];

const currencyRates = { "AZN": { rate: 1.0, sign: "₼" }, "USD": { rate: 0.59, sign: "$" }, "EUR": { rate: 0.55, sign: "€" } };

window.formatPrice = function(priceInAZN) {
    const cur = localStorage.getItem('userCurrency') || 'AZN';
    const data = currencyRates[cur] || currencyRates["AZN"];
    return `${(priceInAZN * data.rate).toFixed(0)} ${data.sign}`;
}

// ==========================================================================
// 2. TOAST BİLDİRİŞ SİSTEMİ
// ==========================================================================
window.showToast = function(message, type = "success") {
    let container = document.getElementById('toast-box');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-box';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="${type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

// ==========================================================================
// 3. NAVBAR VƏ INTEGRAL PROFIL SEÇİMİ (TƏHLÜKƏSİZ KLİK SİSTEMİ)
// ==========================================================================
function manageNavbarState() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const currentCur = localStorage.getItem('userCurrency') || 'AZN';
    const isDark = localStorage.getItem('darkMode') === 'enabled';

    navLinks.innerHTML = `
        <li><a href="index.html" id="nav-home">Ana Səhifə</a></li>
        <li><a href="ucuslar.html" id="nav-flights">Uçuşlar</a></li>
        <li><a href="seat-selection.html" id="nav-seats">Yer Seçimi</a></li>
        <li><a href="flight-status.html" id="nav-radar">Canlı Radar</a></li>
        <li><a href="kampaniyalar.html" id="nav-promo">Kampaniyalar</a></li>
        <li><a href="komek.html" id="nav-help">Kömək</a></li>
        <li><select id="currency-switcher" class="nav-control-item">
            <option value="AZN" ${currentCur === 'AZN' ? 'selected' : ''}>₼ AZN</option>
            <option value="USD" ${currentCur === 'USD' ? 'selected' : ''}>$ USD</option>
            <option value="EUR" ${currentCur === 'EUR' ? 'selected' : ''}>€ EUR</option>
        </select></li>
        <li><button type="button" id="dark-mode-toggle" class="nav-control-item">${isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>'}</button></li>
        <li><a href="daxil-ol.html" class="login-btn" id="nav-login">Daxil ol</a></li>
    `;

    const page = window.location.pathname.split("/").pop();
    if (page === "index.html" || page === "") document.getElementById('nav-home')?.classList.add('active');
    if (page === "ucuslar.html") document.getElementById('nav-flights')?.classList.add('active');
    if (page === "seat-selection.html") document.getElementById('nav-seats')?.classList.add('active');
    if (page === "flight-status.html") document.getElementById('nav-radar')?.classList.add('active');
    if (page === "kampaniyalar.html") document.getElementById('nav-promo')?.classList.add('active');
    if (page === "komek.html") document.getElementById('nav-help')?.classList.add('active');

    document.getElementById('currency-switcher').addEventListener('change', function() {
        localStorage.setItem('userCurrency', this.value);
        window.location.reload();
    });

    document.getElementById('dark-mode-toggle').addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            this.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            this.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    // Profil düyməsini linklərdən tam ayırırıq (Nested xətası həll olundu)
    const user = localStorage.getItem('activeUser');
    const lastItem = navLinks.querySelector('li:last-child');

    if (user && lastItem) {
        const name = user.split('@')[0].toUpperCase();
        lastItem.innerHTML = `
            <div style="position: relative; display: inline-block;">
                <div class="user-profile-menu" id="profile-menu-trigger">
                    <i class="fa-regular fa-circle-user"></i> ${name} <i class="fa-solid fa-chevron-down" style="font-size:0.7rem; margin-left:2px;"></i>
                </div>
                <ul class="profile-dropdown" id="my-profile-dropdown">
                    <li><a href="profil.html"><i class="fa-solid fa-sliders"></i> Kabinetim</a></li>
                    <li><a href="ai-assistant.html"><i class="fa-solid fa-robot"></i> AI Bələdçi & Mil</a></li>
                    <li><div id="logout-btn" style="color:#ef4444; font-weight:600; cursor:pointer;"><i class="fa-solid fa-arrow-right-from-bracket"></i> Çıxış</div></li>
                </ul>
            </div>
        `;

        const trigger = document.getElementById('profile-menu-trigger');
        const dropdown = document.getElementById('my-profile-dropdown');

        if (trigger && dropdown) {
            trigger.addEventListener('click', function() {
                dropdown.classList.toggle('show-dropdown');
            });

            document.addEventListener('click', function(e) {
                if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('show-dropdown');
                }
            });
        }

        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('activeUser');
            window.location.href = 'index.html';
        });
    }
}

// ==========================================================================
// 4. BİLET SATIŞI VƏ DİNAMİK FAKTURA SİSTEMİ
// ==========================================================================
window.buyTicket = function(flightId, basePriceAZN, flightClass = 'economy') {
    if (!localStorage.getItem('activeUser')) {
        window.showToast('Bilet almaq üçün giriş etməlisiniz!', 'error');
        setTimeout(() => window.location.href = 'daxil-ol.html', 1500);
        return;
    }

    const taxAZN = basePriceAZN * 0.12;
    const totalAZN = basePriceAZN + taxAZN;

    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="invoice-modal-box">
            <h3 style="color:#3b82f6; margin-bottom:15px;"><i class="fa-solid fa-id-card"></i> Sərnişin Məlumatları</h3>
            <form id="invoice-final-form">
                <div class="invoice-form-group"><label>Ad</label><input type="text" required></div>
                <div class="invoice-form-group"><label>Soyad</label><input type="text" required></div>
                <div class="invoice-form-group"><label>Pasport Seriyası</label><input type="text" placeholder="AZE0000000" required></div>
                <div class="invoice-breakdown">
                    <div class="invoice-line"><span>Tarif (${flightClass}):</span><b>${window.formatPrice(basePriceAZN)}</b></div>
                    <div class="invoice-line"><span>Dövlət Rüsumu (12%):</span><b>${window.formatPrice(taxAZN)}</b></div>
                    <hr style="margin:10px 0; border:none; border-top:1px dashed #cbd5e1;">
                    <div class="invoice-line" style="font-size:1.1rem; font-weight:700;"><span>Yekun:</span><span style="color:#10b981;">${window.formatPrice(totalAZN)}</span></div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button type="button" class="book-btn" style="background:#64748b;" onclick="document.getElementById('checkout-modal').remove()">Ləğv Et</button>
                    <button type="submit" class="book-btn" style="background:#10b981;">Ödənişi Təsdiqlə</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('invoice-final-form').addEventListener('submit', function(e) {
        e.preventDefault();
        let balance = parseFloat(localStorage.getItem('userBalance') || '1000');
        if (balance < totalAZN) { window.showToast('Virtual balansınız yetərsizdir!', 'error'); return; }

        balance -= totalAZN;
        localStorage.setItem('userBalance', balance.toFixed(2));
        
        let currentMiles = parseInt(localStorage.getItem('userMiles') || '0');
        currentMiles += Math.floor(totalAZN * 0.1);
        localStorage.setItem('userMiles', currentMiles);

        let adminSales = JSON.parse(localStorage.getItem('adminSales') || '[]');
        const flight = mockFlights.find(f => f.id === flightId);
        adminSales.push({ price: totalAZN, dest: flight.dest });
        localStorage.setItem('adminSales', JSON.stringify(adminSales));

        let myTickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
        myTickets.push({
            ...flight,
            ticketId: "TKT-" + Math.floor(100000 + Math.random() * 900000),
            class: flightClass,
            paid: totalAZN,
            date: new Date().toLocaleDateString(),
            seat: Math.floor(1 + Math.random() * 30) + "A"
        });
        localStorage.setItem('userTickets', JSON.stringify(myTickets));

        document.getElementById('checkout-modal').remove();
        window.showToast('Bilet uğurla alındı!');
        setTimeout(() => window.location.href = 'profil.html', 1200);
    });
}

// ==========================================================================
// 5. BONUS ŞANS ÇARXI FUNKSİYASI
// ==========================================================================
window.spinLuckyWheel = function() {
    if (!localStorage.getItem('activeUser')) { window.showToast('Əvvəlcə giriş etməlisiniz!', 'error'); return; }
    const wheel = document.getElementById('lucky-wheel-graphic');
    const spinBtn = document.getElementById('spin-btn-element');
    if (!wheel) return;

    spinBtn.disabled = true;
    const deg = Math.floor(3000 + Math.random() * 3000);
    wheel.style.transform = `rotate(${deg}deg)`;

    setTimeout(() => {
        let bal = parseFloat(localStorage.getItem('userBalance') || '1000');
        localStorage.setItem('userBalance', (bal + 100).toFixed(2));
        window.showToast(`🎉 Təbriklər! Balansınıza 100 ₼ virtual pul əlavə olundu!`);
        spinBtn.disabled = false;
    }, 4000);
}

// ==========================================================================
// 6. DOM LOAD INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('darkMode') === 'enabled') document.body.classList.add('dark-mode');
    
    // Navbarı dərhal aktivləşdiririk
    manageNavbarState();
    
    // Autocomplete quraşdırılması
    const originInput = document.getElementById('origin');
    const destInput = document.getElementById('destination');
    const origList = document.getElementById('origin-suggestions');
    const destList = document.getElementById('destination-suggestions');

    if (originInput && origList) {
        originInput.addEventListener('input', function() {
            const text = this.value.toLowerCase().trim();
            origList.innerHTML = '';
            if (text.length === 0) { origList.classList.add('hidden'); return; }
            const filtered = fakeLocations.filter(l => l.city.toLowerCase().includes(text));
            if (filtered.length > 0) {
                origList.classList.remove('hidden');
                filtered.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<div><b>${item.city}</b>, ${item.country}</div> <span class="airport-code">${item.code}</span>`;
                    li.addEventListener('click', () => { originInput.value = item.city; origList.classList.add('hidden'); });
                    origList.appendChild(li);
                });
            } else { origList.classList.add('hidden'); }
        });
    }

    if (destInput && destList) {
        destInput.addEventListener('input', function() {
            const text = this.value.toLowerCase().trim();
            destList.innerHTML = '';
            if (text.length === 0) { destList.classList.add('hidden'); return; }
            const filtered = fakeLocations.filter(l => l.city.toLowerCase().includes(text));
            if (filtered.length > 0) {
                destList.classList.remove('hidden');
                filtered.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<div><b>${item.city}</b>, ${item.country}</div> <span class="airport-code">${item.code}</span>`;
                    li.addEventListener('click', () => { destInput.value = item.city; destList.classList.add('hidden'); });
                    destList.appendChild(li);
                });
            } else { destList.classList.add('hidden'); }
        });
    }

    // Index.html Axtarış düyməsi
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const from = document.getElementById('origin').value;
            const to = document.getElementById('destination').value;
            const fClass = document.getElementById('flight-class').value;
            const results = document.getElementById('results');
            const loader = document.getElementById('loader');

            results.innerHTML = '';
            loader.classList.remove('hidden');

            setTimeout(() => {
                loader.classList.add('hidden');
                const matched = mockFlights.filter(f => f.origin.toLowerCase() === from.toLowerCase() && f.dest.toLowerCase() === to.toLowerCase());

                if (matched.length > 0) {
                    matched.forEach(f => {
                        let calculatedPrice = fClass === "business" ? f.price * 2 : f.price;
                        results.innerHTML += `
                            <div class="flight-card">
                                <div class="airline-info">
                                    <i class="fa-solid fa-plane-departure airline-logo"></i>
                                    <div class="airline-name"><h3>${f.airline}</h3><p>${f.flightNo} | <b style="color:#1e3a8a; text-transform:uppercase;">${fClass}</b></p></div>
                                </div>
                                <div class="flight-time">
                                    <div><div class="time">${f.depTime}</div><div class="city">${f.origin}</div></div>
                                    <div class="route-line"><div class="duration">${f.duration}</div></div>
                                    <div><div class="time">${f.arrTime}</div><div class="city">${f.dest}</div></div>
                                </div>
                                <div class="flight-price-zone">
                                    <h2 id="p-tag-${f.id}" data-base="${calculatedPrice}">${window.formatPrice(calculatedPrice)}</h2>
                                    <div class="promo-box">
                                        <input type="text" id="p-in-${f.id}" placeholder="Promokod">
                                        <button type="button" onclick="applyPromo(${f.id}, 'p-in-${f.id}', 'p-tag-${f.id}')">Ok</button>
                                    </div>
                                    <button type="button" class="book-btn" style="margin-top:10px;" onclick="buyTicket(${f.id}, ${calculatedPrice}, '${fClass}')">Bilet Al</button>
                                </div>
                            </div>`;
                    });
                } else {
                    results.innerHTML = `<p style="text-align:center; padding:30px; background:var(--bg-card); border-radius:10px; width:100%;">Uçuş tapılmadı.</p>`;
                }
            }, 1000);
        });
    }
});

window.applyPromo = function(flightId, inputId, priceId) {
    const promoCode = document.getElementById(inputId).value.trim();
    const priceTag = document.getElementById(priceId);
    if (!priceTag) return;
    const basePrice = parseFloat(priceTag.dataset.base);

    if (promoCode === "IST20") {
        const newPrice = basePrice * 0.8;
        priceTag.innerText = window.formatPrice(newPrice);
        window.showToast('20% Endirim tətbiq olundu!');
    } else { window.showToast('Keçərsiz promokod!', 'error'); }
}
window.copyPromoCode = function(code) { navigator.clipboard.writeText(code).then(() => { window.showToast(`Kopyalandı: ${code}`); }); }
window.startLiveChatSim = function() { window.showToast("Dəstək xətti başladı. Operator qoşulur..."); }