document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. NAVEGACIÓN SPA
    // ==========================================
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    const pageButtons = document.querySelectorAll('[data-page]');

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
        
            if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
            }
        if (pageId === 'resumen-inversion') {
            setTimeout(initResumenInversion, 200);
        }
        if (pageId === 'resumen-inversion') {
            setTimeout(initEstimacionAzure, 200);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(link.getAttribute('data-page'));
        });
    });

    pageButtons.forEach(btn => {
        if (!btn.classList.contains('nav-links')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showPage(btn.getAttribute('data-page'));
            });
        }
    });

    // ==========================================
    // 2. MENÚ MÓVIL
    // ==========================================
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const mobileLogo = document.getElementById('mobileLogo');

    function openMenu() {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (mobileLogo) mobileLogo.style.display = 'none';
    }

    function closeMenu() {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
        if (window.innerWidth <= 1024 && mobileLogo) {
            setTimeout(() => { mobileLogo.style.display = 'block'; }, 300);
        }
    }

    mobileBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    closeMenuBtn.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) && 
            !mobileBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // ==========================================
    // 3. MODO OSCURO
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    
    function updateThemeIcon(theme) {
        const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
        if (themeToggle) themeToggle.querySelector('i').className = `fa-solid ${icon}`;
    }
    
    const savedTheme = localStorage.getItem('tittanium-theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    function toggleTheme() {
        const current = document.body.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('tittanium-theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // ==========================================
    // 4. ANIMACIÓN DE NÚMEROS
    // ==========================================
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 1500;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = Math.floor(current);
                }
            }, 16);
        });
        
        // También animar contadores del stats-bar
        const counters = document.querySelectorAll('.counter-num');
        counters.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 1500;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = Math.floor(current);
                }
            }, 16);
        });
    };

    // ==========================================
    // 5. OBSERVER
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-number') || entry.target.classList.contains('counter-num')) {
                    animateNumbers();
                }
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-number, .counter-num, .dashboard-card').forEach(el => {
        observer.observe(el);
    });

    // ==========================================
    // 6. GRÁFICO CHART.JS
    // ==========================================
    function initChart() {
        const canvas = document.getElementById('cloudChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (window.cloudChartInstance) {
            window.cloudChartInstance.destroy();
        }
        
        window.cloudChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1 Año', '3 Años', '5 Años'],
                datasets: [
                    {
                        label: 'On-premise',
                        data: [12000, 21000, 30000],
                        backgroundColor: '#9CA3AF',
                        borderRadius: 8
                    },
                    {
                        label: 'Nube',
                        data: [7000, 10000, 13000],
                        backgroundColor: '#3d4f39',
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => '$' + (value/1000) + 'k'
                        }
                    }
                }
            }
        });
    }
    
    // ==========================================
    // 7b. GRÁFICO DE IMPACTO (Datos / BI)
    // ==========================================
    function initImpactChart() {
        const canvas = document.getElementById('impactChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (window.impactChartInstance) {
            window.impactChartInstance.destroy();
        }
        
        window.impactChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Conversión Leads', 'Ventas Cruzadas', 'Satisfacción Cliente', 'Tickets Repetitivos', 'Tiempo Resolución', 'Deserción Clientes'],
                datasets: [{
                    label: 'Mejora (%)',
                    data: [35, 28, 60, 45, 30, 20],
                    backgroundColor: [
                        '#3d4f39',
                        '#5a6e55',
                        '#3d4f39',
                        '#5a6e55',
                        '#3d4f39',
                        '#5a6e55'
                    ],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => (ctx.raw > 0 ? '+' : '') + ctx.raw + '% de mejora'
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 80,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    // ==========================================
    // 7. TABS DE SERVICIOS
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
            
            if (tabId === 'nube') {
                setTimeout(initChart, 300);
            }
            if (tabId === 'datos') {
                setTimeout(initImpactChart, 300);
            }
        });
    });

    // ==========================================
    // TOGGLE TABLA COMPARATIVA DE PLANES
    // ==========================================
    const toggleBtn = document.getElementById('toggleComparisonTableBtn');
    const tableWrapper = document.getElementById('comparisonTableWrapper');
    if (toggleBtn && tableWrapper) {
        toggleBtn.addEventListener('click', () => {
            const isExpanded = tableWrapper.classList.toggle('expanded');
            if (isExpanded) {
                toggleBtn.innerHTML = `Ocultar Detalle <i class="fa-solid fa-chevron-up"></i>`;
            } else {
                toggleBtn.innerHTML = `Mostrar Todo <i class="fa-solid fa-chevron-down"></i>`;
            }
        });
    }
});

// ==========================================
// 7c. ANIMACIÓN DE ESCRITURA (TYPING EFFECT)
// ==========================================
const typingTextEl = document.getElementById('typing-text');
if (typingTextEl) {
    const phrases = [
        "para transformar tu negocio",
        "para expandir tu empresa"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        if (isDeleting) {
            typingTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 40;
        } else {
            typingTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }
    setTimeout(type, 1000);
}

// ==========================================
// 8. FORZAR SCROLL AL TOPE
// ==========================================
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// ==========================================
// 9. RESUMEN INVERSION (graficos agrupados ajustables + tabla totales)
//    Precios oficiales Azure Retail Prices API - region East US (consumo, pago por uso)
//    Para agregar un recurso nuevo: añadir un objeto al array RECURSOS.
// ==========================================
const RECURSOS = [
    {
        id: 'blob',
        nombre: 'Blob Storage',
        icono: 'fa-database',
        capDefecto: 3.3,          // TB (cotizacion del proyecto)
        capMax: 10,
        redundancias: {           // USD por GB-mes (East US, consumo, vigente)
            'LRS': 0.019136,
            'GRS': 0.0421,
            'ZRS': 0.0423,
            'RA-GZRS': 0.05382
        },
        sel: 'LRS'
    },
    {
        id: 'files',
        nombre: 'Azure Files (backup)',
        icono: 'fa-folder-open',
        capDefecto: 1.0,
        capMax: 10,
        redundancias: {
            'LRS': 0.0632,
            'GRS': 0.0647,
            'ZRS': 0.0647
        },
        sel: 'LRS'
    }
];

const CFG = {
    region: 'East US',
    fechaPrecios: '2026-07',
    trm: 4100,                 // COP por USD (editable en UI)
    implementacionCOP: 1700000, // Puesta en marcha (sin IVA en la base; IVA se aplica aparte)
    iva: 0.19
};

function fmtCOP(n) {
    return '$' + Math.round(n).toLocaleString('es-CO');
}
function fmtUSD(n) {
    return 'USD $' + n.toFixed(2);
}

// Costo mensual de un recurso en COP
function costoRecursoCOP(rec) {
    const usdGB = rec.redundancias[rec.sel];
    const tb = parseFloat(rec.capActual);
    const usdMes = usdGB * 1024 * tb;       // 1 TB = 1024 GB
    return usdMes * CFG.trm;
}

let resumenCharts = {};

function initResumenInversion() {
    const cont = document.getElementById('recursosContainer');
    const trmInput = document.getElementById('trmInput');
    if (!cont) return;
    if (trmInput) CFG.trm = parseFloat(trmInput.value) || CFG.trm;

    // Estado inicial de capacidad por recurso
    RECURSOS.forEach(r => { r.capActual = r.capDefecto; });

    function render() {
        cont.innerHTML = '';
        RECURSOS.forEach((rec, idx) => {
            const card = document.createElement('div');
            card.className = 'dashboard-card recurso-card';
            const redBtns = Object.keys(rec.redundancias).map(rd =>
                `<button class="red-btn ${rd === rec.sel ? 'active' : ''}" data-rec="${rec.id}" data-red="${rd}">${rd}</button>`
            ).join('');
            card.innerHTML = `
                <div class="recurso-head">
                    <h3><i class="fa-solid ${rec.icono}"></i> ${rec.nombre}</h3>
                    <span class="recurso-cost" id="cost-${rec.id}"></span>
                </div>
                <div class="slider-row">
                    <label>Capacidad: <strong id="capval-${rec.id}">${rec.capActual.toFixed(1)} TB</strong></label>
                    <input type="range" class="cap-slider" id="slider-${rec.id}" min="0.1" max="${rec.capMax}" step="0.1" value="${rec.capActual}">
                </div>
                <div class="red-group">${redBtns}</div>
                <div class="recurso-chart-wrap"><canvas id="chart-${rec.id}"></canvas></div>
            `;
            cont.appendChild(card);
        });

        // Eventos sliders
        RECURSOS.forEach(rec => {
            const sl = document.getElementById('slider-' + rec.id);
            sl.addEventListener('input', e => {
                rec.capActual = parseFloat(e.target.value);
                document.getElementById('capval-' + rec.id).textContent = rec.capActual.toFixed(1) + ' TB';
                update();
            });
        });
        // Eventos redundancia
        cont.querySelectorAll('.red-btn').forEach(b => {
            b.addEventListener('click', () => {
                const rec = RECURSOS.find(r => r.id === b.dataset.rec);
                rec.sel = b.dataset.red;
                update();
            });
        });

        update();
    }

    function update() {
        // Costos
        RECURSOS.forEach(rec => {
            const cost = costoRecursoCOP(rec);
            const el = document.getElementById('cost-' + rec.id);
            if (el) el.innerHTML = `${fmtCOP(cost)} <span class="muted">/mes (${fmtUSD(rec.redundancias[rec.sel] * 1024 * rec.capActual)})</span>`;
            // Marcar boton activo
            cont.querySelectorAll(`.red-btn[data-rec="${rec.id}"]`).forEach(b => b.classList.toggle('active', b.dataset.red === rec.sel));
            // Redibujar chart
            drawRecursoChart(rec);
        });
        renderTotals();
    }

    function drawRecursoChart(rec) {
        const canvas = document.getElementById('chart-' + rec.id);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const labels = Object.keys(rec.redundancias);
        const data = labels.map(rd => {
            const usdMes = rec.redundancias[rd] * 1024 * parseFloat(rec.capActual);
            return usdMes * CFG.trm;
        });
        const colors = labels.map(rd => rd === rec.sel ? '#3d4f39' : '#C9D2C4');
        if (resumenCharts[rec.id]) resumenCharts[rec.id].destroy();
        resumenCharts[rec.id] = new Chart(ctx, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Costo mensual (COP)', data, backgroundColor: colors, borderRadius: 6 }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { callback: v => fmtCOP(v) } } }
            }
        });
    }

    function renderTotals() {
        const grid = document.getElementById('totalsGrid');
        const totalAzure = RECURSOS.reduce((s, r) => s + costoRecursoCOP(r), 0);
        const implConIVA = CFG.implementacionCOP * (1 + CFG.iva);
        const mes1 = implConIVA + totalAzure;
        const mes2 = totalAzure;
        grid.innerHTML = `
            <div class="total-item"><span>Recursos en nube (Azure, sin IVA)</span><strong>${fmtCOP(totalAzure)}/mes</strong></div>
            <div class="total-item"><span>Puesta en marcha (con IVA 19%)</span><strong>${fmtCOP(implConIVA)}</strong></div>
            <div class="total-item total-mes1"><span><strong>Mes 1</strong> (implementación + nube)</span><strong>${fmtCOP(mes1)}</strong></div>
            <div class="total-item total-mes2"><span><strong>Mes 2+</strong> (solo nube)</span><strong>${fmtCOP(mes2)}/mes</strong></div>
        `;
    }

    // TRM en vivo
    if (trmInput) {
        trmInput.addEventListener('input', () => {
            CFG.trm = parseFloat(trmInput.value) || CFG.trm;
            update();
        });
    }

    render();
}

// Estimación desde share de Azure Calculator
function initEstimacionAzure() {
    const canvas = document.getElementById('estAzureChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (window.estAzureChartInstance) {
        window.estAzureChartInstance.destroy();
    }

    window.estAzureChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Azure Files', 'Azure Backup', 'Soporte'],
            datasets: [
                {
                    data: [94.57, 18.82, 0],
                    backgroundColor: ['#3d4f39', '#5a6e55', '#9CA3AF'],
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 8
                    }
                }
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw(chart) {
                const { ctx, chartArea: { width, height, top, left } } = chart;
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const x = left + width / 2;
                const y = top + height / 2;
                ctx.fillStyle = '#111827';
                ctx.font = 'bold 18px system-ui, -apple-system, Segoe UI, Roboto';
                ctx.fillText('USD 113.39', x, y - 8);
                ctx.fillStyle = '#6B7280';
                ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto';
                ctx.fillText('por mes', x, y + 14);
                ctx.restore();
            }
        }]
    });
}