const catalogPoints = [
    {
        id: 1,
        title: "Пункт умной переработки",
        rating: 5.0,
        tags: [
            { name: "Бумага", class: "card-type-paper" },
            { name: "Пластик", class: "card-type-plastic" },
            { name: "Стекло", class: "card-type-glass" }
        ],
        address: "Россия, Свердловская область, Екатеринбург, посёлок Большой Шарташский Каменный Карьер, 8",
        hours: "Пн - Вс: 11:00 - 20:00",
        image: "/front/img/geo.png",
        clockImage: "/front/img/clock.png",
        isFavorite: true,
        addedAt: Date.now() - 1000000 // ~16 мин назад
    },
    {
        id: 2,
        title: "Ярмарка редких вещей 'Полочки'",
        rating: 4.2,
        tags: [
            { name: "Бумага", class: "card-type-paper" }
        ],
        address: "Россия, Свердловская область, Екатеринбург, проспект Ленина, 101",
        hours: "Пн - Вс: 11:00 - 20:00",
        image: "/front/img/geo.png",
        clockImage: "/front/img/clock.png",
        isFavorite: false,
        addedAt: null
    },
    {
        id: 3,
        title: "Эко-центр Зелёный'",
        rating: 3.5,
        tags: [
            { name: "Пластик", class: "card-type-plastic" },
            { name: "Стекло", class: "card-type-glass" }
        ],
        address: "Екатеринбург, ул. Экологическая, 25",
        hours: "Пн-Пт: 09:00 - 18:00",
        image: "/front/img/geo.png",
        clockImage: "/front/img/clock.png",
        isFavorite: false,
        addedAt: null
    },
    {
        id: 4,
        title: "Контейнер La Roche-Posay для упаковки от косметики в пункте выдачи Lamoda",
        rating: 4.8,
        tags: [
            {name: "Пластик", class: "card-type-plastic"}
        ],
        address: "Россия, Свердловская область, Екатеринбург, ул. Советская, 25",
        hours: "Пн - Вс: 10:00 - 22:00",
        image: "/front/img/geo.png",
        clockImage: "/front/img/clock.png",
        isFavorite: true,
        addedAt: Date.now() - 100000000
    },
    {
        id: 5,
        title: "Сбор макулатуры в помощь бездомным животным",
        rating: 5.0,
        tags: [
            {name: "Бумага", class: "card-type-paper"}
        ],
        address: "Россия, Свердловская область, Екатеринбург, метро 'Площадь 1905 года'",
        hours: "Пн - Вс: 12:00 - 17:00",
        image: "/front/img/geo.png",
        clockImage: "/front/img/clock.png",
        isFavorite: true,
        addedAt: Date.now() - 10000000000
    }
];
// Мои пункты (с полями isFavorite и rating для редактирования)
let myPoints = [
    {
        id: 101,
        title: "Мой пункт приёма",
        rating: 5.0,
        tags: [
            { name: "Бумага", class: "card-type-paper" }
        ],
        address: "Екатеринбург, ул. Моя, 10",
        hours: "Круглосуточно",
        geoImg: "/front/img/geo.png",
        clockImg: "/front/img/clock.png",
        isUserPoint: true,
        isFavorite: false
    }
];

// Объединяем все пункты для удобства работы
function getAllPoints() {
    return [...catalogPoints, ...myPoints];
}

// SVG иконки
const icons = {
    star: `<svg viewBox="0 0 24 24" class="star-svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" class="heart-svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    arrowMore: `<img src="/front/img/arrowMore.png" alt="">`
};

// ==========================================
// 2. LOCALSTORAGE: СОХРАНЕНИЕ И ЗАГРУЗКА
// ==========================================
const STORAGE_KEY = 'sb_user_data';

// Загрузка данных при старте
function loadUserData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        
        // Восстанавливаем избранные и рейтинги для каталога
        if (data.catalog) {
            data.catalog.forEach(savedItem => {
                const point = catalogPoints.find(p => p.id === savedItem.id);
                if (point) {
                    if (savedItem.isFavorite !== undefined) point.isFavorite = savedItem.isFavorite;
                    if (savedItem.rating !== undefined) point.rating = savedItem.rating;
                }
            });
        }
        
        // Восстанавливаем мои пункты
        if (data.myPoints) {
            myPoints = data.myPoints.map(savedPoint => {
                // Ищем существующий или создаём новый
                const existing = myPoints.find(p => p.id === savedPoint.id);
                return existing ? { ...existing, ...savedPoint } : savedPoint;
            });
        }
    }
}

// Сохранение всех изменений
function saveUserData() {
    const data = {
        catalog: catalogPoints.map(p => ({
            id: p.id,
            isFavorite: p.isFavorite,
            rating: p.rating
        })),
        myPoints: myPoints
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ==========================================
// 3. ГЕНЕРАЦИЯ КАРТОЧЕК
// ==========================================

// Генерация интерактивных звёзд (для моих пунктов — кликабельные)
function generateStarsHTML(point, isEditable = false) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        const isFilled = point.rating >= i;
        const fill = isFilled ? '#F4E2B6' : '#E0E0E0';
        
        if (isEditable) {
            // Для моих пунктов: звезда кликабельная, меняет рейтинг
            html += `
                <button class="star-btn" onclick="setRating(${point.id}, ${i})" title="Поставить ${i} звезд">
                    <svg viewBox="0 0 24 24" class="star-svg" style="fill: ${fill}" data-value="${i}">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </button>`;
        } else {
            // Для каталога: просто отображение
            html += `
                <svg viewBox="0 0 24 24" class="star-svg" style="fill: ${fill}">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>`;
        }
    }
    return html;
}

// Генерация карточки (универсальная)
function createCardHTML(point, showHeart = true, isEditable = false) {
    const heartClass = point.isFavorite ? 'active' : '';
    const tagsHTML = point.tags.map(tag => `<li class="${tag.class}">${tag.name}</li>`).join('');
    const starsHTML = generateStarsHTML(point, isEditable);

    return `
        <div class="card" data-id="${point.id}" data-is-user="${point.isUserPoint}">
            <div class="card-name">
                <h3>${point.title}</h3>
                <div class="rating">
                    <div class="rating-block">
                        <div class="stars">
                            ${starsHTML}
                        </div>
                        <span class="score score-default">${point.rating.toFixed(1)}</span>
                        <span class="score score-hover">${point.rating.toFixed(1)}</span>
                    </div>
                    ${showHeart ? `
                    <button class="heart-icon ${heartClass}" onclick="toggleFavorite(${point.id})" title="${point.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}">
                        ${icons.heart}
                    </button>
                    ` : ''}
                </div>
            </div>
            
            <div class="card-type">
                <ul class="card-type-item">
                    ${tagsHTML}
                </ul>
            </div>
            
            <div class="card-place">
                <img src="${point.geoImg}" width="27px" height="40px" alt="">
                <p>${point.address}</p>
            </div>
            
            <div class="card-time">
                <div class="card-time-work">
                    <img src="${point.clockImg}" width="27px" height="27px" alt="">
                    <div class="card-p">
                        <p>Режим работы:</p>
                        <p>${point.hours}</p>
                    </div>
                </div>
                <div class="more">
                    <p>Смотреть больше</p>
                    ${icons.arrowMore}
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// 4. ОБРАБОТЧИКИ ДЕЙСТВИЙ
// ==========================================

// Поиск пункта по ID во всех массивах
function findPointById(id) {
    return catalogPoints.find(p => p.id === id) || myPoints.find(p => p.id === id);
}

// Переключение избранного (сердечко)
function toggleFavorite(id) {
    const point = findPointById(id);
    if (point) {
        point.isFavorite = !point.isFavorite;
        saveUserData();
        renderAll();
    }
}

// Установка рейтинга (только для моих пунктов)
function setRating(pointId, newRating) {
    const point = myPoints.find(p => p.id === pointId);
    if (point) {
        point.rating = newRating;
        saveUserData();
        renderMyPoints(); // Перерисовываем только секцию "Мои пункты"
    }
}

// ==========================================
// 5. ОТРИСОВКА СЕКЦИЙ
// ==========================================

// Рендер ПОСЛЕДНЕГО избранного (в личном кабинете)
function renderLatestFavorite() {
    const container = document.getElementById('latest-favorite-container');
    if (!container) return;
    
    const allPoints = getAllPoints();
    const favorites = allPoints.filter(p => p.isFavorite);
    
    if (favorites.length === 0) {
        container.innerHTML = '<p style="color:#888; padding:15px;">В избранном пока пусто</p>';
        return;
    }
    
    // Последний добавленный (в конце массива)
    const latest = favorites[favorites.length - 1];
    const isEditable = latest.isUserPoint;
    
    container.innerHTML = createCardHTML(latest, true, isEditable);
}

// Рендер "Мои пункты" (с кликабельными звёздами и сердечками)
function renderMyPoints() {
    const container = document.getElementById('my-points-container');
    if (!container) return;
    
    if (myPoints.length === 0) {
        container.innerHTML = '<p style="color:#888; padding:15px;">У вас пока нет добавленных пунктов</p>';
        return;
    }
    
    // isEditable=true: звёзды кликабельные, сердечки показаны
    container.innerHTML = myPoints.map(p => createCardHTML(p, true, true)).join('');
}

// Полный рендер
function renderAll() {
    renderLatestFavorite();
    renderMyPoints();
}

// ==========================================
// 6. ИНИЦИАЛИЗАЦИЯ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Загружаем сохранённые данные
    loadUserData();
    
    // 2. Рисуем интерфейс
    renderAll();
    
    // 3. Обработчик выхода
    const exitBtn = document.querySelector('.exit');
    if (exitBtn) {
        exitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Выйти из аккаунта?')) {
                window.location.href = '/front/html/index.html';
            }
        });
    }
});