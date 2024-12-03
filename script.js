document.addEventListener('DOMContentLoaded', function() {
    // Örnek abonelik verileri
    const subscriptions = [
        {
            name: "Netflix",
            category: "Video",
            price: "89.90",
            renewalDate: "2024-03-15",
            icon: "fas fa-film"
        },
        {
            name: "Spotify",
            category: "Müzik",
            price: "34.90",
            renewalDate: "2024-03-20",
            icon: "fas fa-music"
        },
        {
            name: "Xbox Game Pass",
            category: "Oyun",
            price: "59.90",
            renewalDate: "2024-03-18",
            icon: "fas fa-gamepad"
        },
        {
            name: "GitHub Pro",
            category: "Yazılım",
            price: "79.90",
            renewalDate: "2024-03-22",
            icon: "fas fa-code"
        },
        {
            name: "LinkedIn Premium",
            category: "İş",
            price: "119.90",
            renewalDate: "2024-03-25",
            icon: "fab fa-linkedin"
        }
    ];

    // Abonelikleri listele
    const subscriptionsList = document.querySelector('.subscriptions');
    
    function renderSubscriptions(subs) {
        subscriptionsList.innerHTML = subs.map(sub => `
            <div class="subscription-card">
                <div class="sub-icon">
                    <i class="${sub.icon}"></i>
                </div>
                <div class="sub-info">
                    <h3>${sub.name}</h3>
                    <p>${sub.category}</p>
                </div>
                <div class="sub-price">
                    <h4>₺${sub.price}</h4>
                    <p>Yenileme: ${formatDate(sub.renewalDate)}</p>
                </div>
            </div>
        `).join('');
    }

    // Tarih formatla
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR');
    }

    // Filtreleme işlevi
    const filterButtons = document.querySelectorAll('.subscription-filters button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.textContent;
            if (category === 'Tümü') {
                renderSubscriptions(subscriptions);
            } else {
                const filtered = subscriptions.filter(sub => sub.category === category);
                renderSubscriptions(filtered);
            }
        });
    });

    // İlk yükleme
    renderSubscriptions(subscriptions);

    // Arama işlevi
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = subscriptions.filter(sub => 
            sub.name.toLowerCase().includes(searchTerm) || 
            sub.category.toLowerCase().includes(searchTerm)
        );
        renderSubscriptions(filtered);
    });

    // Modal işlemleri
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Yeni Abonelik Ekle</h2>
                <button class="close-modal">&times;</button>
            </div>
            <form class="subscription-form">
                <div class="form-group">
                    <label for="name">Platform Adı</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="category">Kategori</label>
                    <select id="category" required>
                        <option value="Eğlence">Eğlence</option>
                        <option value="Müzik">Müzik</option>
                        <option value="Video">Video</option>
                        <option value="İş">İş</option>
                        <option value="Eğitim">Eğitim</option>
                        <option value="Spor">Spor</option>
                        <option value="Oyun">Oyun</option>
                        <option value="Yazılım">Yazılım</option>
                        <option value="Depolama">Depolama</option>
                        <option value="Haberler">Haberler</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="price">Aylık Ücret (₺)</label>
                    <input type="number" id="price" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="renewalDate">Yenileme Tarihi</label>
                    <input type="date" id="renewalDate" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary cancel-btn">İptal</button>
                    <button type="submit" class="btn btn-primary">Kaydet</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Modal açma/kapama işlemleri
    const addButton = document.querySelector('.add-subscription');
    const closeButton = modal.querySelector('.close-modal');
    const cancelButton = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('.subscription-form');

    addButton.addEventListener('click', () => {
        modal.style.display = 'block';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            form.reset();
        }, 300);
    }

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Yeni abonelik ekleme
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newSubscription = {
            name: form.querySelector('#name').value,
            category: form.querySelector('#category').value,
            price: form.querySelector('#price').value,
            renewalDate: form.querySelector('#renewalDate').value,
            icon: getIconForCategory(form.querySelector('#category').value)
        };

        subscriptions.push(newSubscription);
        renderSubscriptions(subscriptions);
        closeModal();

        // Toplam tutarı güncelle
        updateTotalAmount();
    });

    // Kategori için icon seç
    function getIconForCategory(category) {
        const icons = {
            'Eğlence': 'fas fa-smile',
            'Müzik': 'fas fa-music',
            'Video': 'fas fa-film',
            'İş': 'fas fa-briefcase',
            'Eğitim': 'fas fa-graduation-cap',
            'Spor': 'fas fa-running',
            'Oyun': 'fas fa-gamepad',
            'Yazılım': 'fas fa-code',
            'Depolama': 'fas fa-cloud',
            'Haberler': 'fas fa-newspaper'
        };
        return icons[category] || 'fas fa-star';
    }

    // Toplam tutarı güncelle
    function updateTotalAmount() {
        const total = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.price), 0);
        const totalElement = document.querySelector('.summary-cards .card:first-child p');
        totalElement.textContent = `₺${total.toFixed(2)}`;
    }

    // İlk yüklemede toplam tutarı göster
    updateTotalAmount();

    // Sayfa geçişleri için
    const menuItems = document.querySelectorAll('.sidebar nav li');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Aktif menü öğesini güncelle
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // İlgili içerik bölümünü göster
            contentSections.forEach(section => section.classList.remove('active'));
            contentSections[index].classList.add('active');
        });
    });

    // Bütçe daire grafiğini güncelle
    function updateBudgetChart() {
        const circle = document.querySelector('.circular-chart .circle');
        const percentage = 65; // Bu değer dinamik olarak hesaplanacak
        const perimeter = 100; // SVG path uzunluğu
        
        if (circle) {
            circle.style.strokeDasharray = `${percentage} ${perimeter}`;
            document.querySelector('.circular-chart .percentage').textContent = `${percentage}%`;
        }
    }

    // SVG gradient tanımı
    const svg = document.querySelector('.circular-chart');
    if (svg) {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        gradient.setAttribute("id", "gradient");
        gradient.innerHTML = `
            <stop offset="0%" stop-color="var(--gradient-start)" />
            <stop offset="100%" stop-color="var(--gradient-end)" />
        `;
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
        
        updateBudgetChart();
    }

    // Kategori bazlı harcamaları hesapla ve göster
    function renderCategoryExpenses() {
        const categoryExpenses = subscriptions.reduce((acc, sub) => {
            if (!acc[sub.category]) {
                acc[sub.category] = {
                    total: 0,
                    count: 0,
                    icon: getIconForCategory(sub.category)
                };
            }
            acc[sub.category].total += parseFloat(sub.price);
            acc[sub.category].count += 1;
            return acc;
        }, {});

        const categoryContainer = document.querySelector('.category-expenses');
        if (categoryContainer) {
            categoryContainer.innerHTML = Object.entries(categoryExpenses)
                .map(([category, data]) => `
                    <div class="category-card">
                        <div class="category-icon">
                            <i class="${data.icon}"></i>
                        </div>
                        <div class="category-info">
                            <h4>${category}</h4>
                            <div class="category-stats">
                                <div class="stat">
                                    <span class="stat-label">Toplam</span>
                                    <span class="stat-value">₺${data.total.toFixed(2)}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Abonelik</span>
                                    <span class="stat-value">${data.count}</span>
                                </div>
                            </div>
                            <div class="category-progress">
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${(data.total / getTotalBudget() * 100).toFixed(1)}%"></div>
                                </div>
                                <span class="progress-text">${(data.total / getTotalBudget() * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                `).join('');
        }
    }

    // Toplam bütçeyi al
    function getTotalBudget() {
        return subscriptions.reduce((total, sub) => total + parseFloat(sub.price), 0);
    }

    // İlk yüklemede kategori kartlarını göster
    renderCategoryExpenses();

    // Ay seçimi değiştiğinde kategori kartlarını güncelle
    const monthSelector = document.querySelector('.month-selector');
    if (monthSelector) {
        monthSelector.addEventListener('change', renderCategoryExpenses);
    }

    // İstatistik grafiklerini oluştur
    function createCharts() {
        // Aylık harcama grafiği
        const monthlyCtx = document.getElementById('monthlyChart');
        if (monthlyCtx) {
            new Chart(monthlyCtx, {
                type: 'line',
                data: {
                    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
                    datasets: [{
                        label: 'Aylık Harcama',
                        data: [350, 380, 420, 390, 400, 450],
                        borderColor: 'rgb(99, 102, 241)',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--text-color')
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: value => '₺' + value,
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--text-color')
                            },
                            grid: {
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--border-color')
                            }
                        },
                        x: {
                            ticks: {
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--text-color')
                            },
                            grid: {
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--border-color')
                            }
                        }
                    }
                }
            });
        }

        // Kategori dağılımı grafiği
        const categoryCtx = document.getElementById('categoryChart');
        if (categoryCtx) {
            const categoryData = subscriptions.reduce((acc, sub) => {
                if (!acc[sub.category]) {
                    acc[sub.category] = 0;
                }
                acc[sub.category] += parseFloat(sub.price);
                return acc;
            }, {});

            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        data: Object.values(categoryData),
                        backgroundColor: [
                            '#4F46E5',
                            '#7C3AED',
                            '#EC4899',
                            '#F59E0B',
                            '#10B981',
                            '#3B82F6',
                            '#6366F1'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--text-color')
                            }
                        }
                    }
                }
            });
        }
    }

    // Takvim işlevselliği
    function initializeCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const eventsList = document.querySelector('.events-list');
        const currentMonthElement = document.querySelector('.current-month');
        const prevMonthButton = document.querySelector('.prev-month');
        const nextMonthButton = document.querySelector('.next-month');

        let currentDate = new Date();

        function renderCalendar() {
            if (!calendarGrid) return;

            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const startingDay = firstDay.getDay();
            const monthDays = lastDay.getDate();

            currentMonthElement.textContent = firstDay.toLocaleDateString('tr-TR', { 
                month: 'long', 
                year: 'numeric' 
            });

            let calendarHTML = `
                <div class="calendar-days">
                    <div>Pzt</div>
                    <div>Sal</div>
                    <div>Çar</div>
                    <div>Per</div>
                    <div>Cum</div>
                    <div>Cmt</div>
                    <div>Paz</div>
                </div>
                <div class="calendar-dates">
            `;

            for (let i = 0; i < startingDay; i++) {
                calendarHTML += '<div class="calendar-date empty"></div>';
            }

            for (let day = 1; day <= monthDays; day++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const hasEvent = subscriptions.some(sub => {
                    const renewalDate = new Date(sub.renewalDate);
                    return renewalDate.getDate() === day && 
                           renewalDate.getMonth() === date.getMonth() &&
                           renewalDate.getFullYear() === date.getFullYear();
                });

                calendarHTML += `
                    <div class="calendar-date ${hasEvent ? 'has-event' : ''}">
                        ${day}
                        ${hasEvent ? '<div class="event-indicator"></div>' : ''}
                    </div>
                `;
            }

            calendarHTML += '</div>';
            calendarGrid.innerHTML = calendarHTML;

            // Yaklaşan ödemeleri göster
            renderUpcomingEvents();
        }

        function renderUpcomingEvents() {
            if (!eventsList) return;

            const today = new Date();
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(today.getDate() + 30);

            const upcomingEvents = subscriptions
                .filter(sub => {
                    const renewalDate = new Date(sub.renewalDate);
                    return renewalDate >= today && renewalDate <= thirtyDaysFromNow;
                })
                .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));

            eventsList.innerHTML = upcomingEvents.map(sub => `
                <div class="event-item">
                    <div class="event-icon">
                        <i class="${sub.icon}"></i>
                    </div>
                    <div class="event-details">
                        <h4>${sub.name}</h4>
                        <p>${formatDate(sub.renewalDate)} - ₺${sub.price}</p>
                    </div>
                </div>
            `).join('') || '<p class="no-events">30 gün içinde ödeme yok</p>';
        }

        if (prevMonthButton && nextMonthButton) {
            prevMonthButton.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });

            nextMonthButton.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
        }

        renderCalendar();
    }

    // Tema değiştirme işlevselliği
    function initializeTheme() {
        const themeSelect = document.getElementById('theme-select');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        // Sayfa yüklendiğinde kaydedilmiş temayı uygula
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeSelect.value = savedTheme;

        // Tema değiştiğinde
        themeSelect.addEventListener('change', function(e) {
            const newTheme = e.target.value;
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Grafikleri yeniden oluştur
            createCharts();
        });
    }

    // DOM yüklendiğinde tema işlevselliğini başlat
    initializeTheme();

    // DOM yüklendiğinde grafikleri ve takvimi başlat
    createCharts();
    initializeCalendar();

    // Kategori dağılımı grafiğini oluştur
    function createPaymentDistributionChart() {
        const ctx = document.getElementById('paymentDistributionChart');
        if (ctx) {
            const categoryData = subscriptions.reduce((acc, sub) => {
                if (!acc[sub.category]) {
                    acc[sub.category] = 0;
                }
                acc[sub.category] += parseFloat(sub.price);
                return acc;
            }, {});

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        data: Object.values(categoryData),
                        backgroundColor: [
                            '#4F46E5',
                            '#7C3AED',
                            '#EC4899',
                            '#F59E0B',
                            '#10B981',
                            '#3B82F6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--text-color')
                            }
                        }
                    }
                }
            });
        }
    }

    // DOM yüklendiğinde grafikleri başlat
    createPaymentDistributionChart();

    // Hatırlatıcı modal işlemleri
    function initializeReminderModal() {
        const reminderModal = document.getElementById('reminderModal');
        const setReminderBtn = document.querySelector('.set-reminder-btn');
        const closeBtn = reminderModal.querySelector('.close-modal');
        const cancelBtn = reminderModal.querySelector('.cancel-reminder');
        const form = reminderModal.querySelector('.reminder-form');
        const subscriptionSelect = document.getElementById('subscription-select');

        // Abonelik seçeneklerini doldur
        function populateSubscriptions() {
            subscriptionSelect.innerHTML = subscriptions.map(sub => `
                <option value="${sub.name}">${sub.name} - ₺${sub.price}</option>
            `).join('');
        }

        // Modal'ı aç
        setReminderBtn.addEventListener('click', () => {
            populateSubscriptions();
            reminderModal.style.display = 'block';
            requestAnimationFrame(() => {
                reminderModal.classList.add('active');
            });
        });

        // Modal'ı kapat
        function closeModal() {
            reminderModal.classList.remove('active');
            setTimeout(() => {
                reminderModal.style.display = 'none';
                form.reset();
            }, 300);
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        reminderModal.addEventListener('click', (e) => {
            if (e.target === reminderModal) closeModal();
        });

        // Form gönderimi
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const reminder = {
                subscription: subscriptionSelect.value,
                time: document.getElementById('reminder-time').value,
                notifications: {
                    email: form.querySelector('[name="notification-email"]').checked,
                    push: form.querySelector('[name="notification-push"]').checked
                }
            };

            // Hatırlatıcıyı kaydet
            saveReminder(reminder);
            closeModal();

            // Başarılı mesajı göster
            showNotification('Hatırlatıcı başarıyla ayarlandı!');
        });
    }

    // Hatırlatıcıyı kaydet
    function saveReminder(reminder) {
        let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        reminders.push(reminder);
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }

    // Bildirim göster
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // DOM yüklendiğinde hatırlatıcı modalını başlat
    initializeReminderModal();

    // Hatırlatıcı listesi ve gün detayları için fonksiyonlar
    function initializeCalendarFeatures() {
        // Hatırlatıcı listesi toggle işlevi
        const toggleButton = document.querySelector('.toggle-reminders');
        const remindersContent = document.querySelector('.reminders-content');
        
        toggleButton.addEventListener('click', () => {
            remindersContent.classList.toggle('expanded');
            toggleButton.querySelector('i').classList.toggle('fa-chevron-up');
        });

        // Hatırlatıcıları göster
        function renderReminders() {
            const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
            const remindersContainer = document.querySelector('.reminders-content');
            
            if (reminders.length === 0) {
                remindersContainer.innerHTML = `
                    <div class="reminder-item">
                        <p class="no-reminders">Henüz hatırlatıcı eklenmemiş</p>
                    </div>
                `;
                return;
            }

            remindersContainer.innerHTML = reminders.map(reminder => `
                <div class="reminder-item">
                    <div class="reminder-info">
                        <h4>${reminder.subscription}</h4>
                        <p>${getReminderTimeText(reminder.time)}</p>
                    </div>
                    <div class="reminder-actions">
                        <button onclick="editReminder('${reminder.subscription}')" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteReminder('${reminder.subscription}')" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Hatırlatıcı zaman metnini al
        function getReminderTimeText(time) {
            const times = {
                'same-day': 'Aynı gün',
                '1-day': '1 gün önce',
                '3-days': '3 gün önce',
                '1-week': '1 hafta önce'
            };
            return times[time] || time;
        }

        // Gün detayları
        function initializeDayDetails() {
            const calendarDates = document.querySelectorAll('.calendar-date');
            const dayDetailModal = document.getElementById('dayDetailModal');
            const closeModalBtn = dayDetailModal.querySelector('.close-modal');

            calendarDates.forEach(date => {
                date.addEventListener('click', () => showDayDetails(date));
            });

            closeModalBtn.addEventListener('click', () => {
                dayDetailModal.classList.remove('active');
            });

            dayDetailModal.addEventListener('click', (e) => {
                if (e.target === dayDetailModal) {
                    dayDetailModal.classList.remove('active');
                }
            });
        }

        function showDayDetails(dateElement) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dateElement.textContent);
            const dayEvents = getDayEvents(date);
            const modal = document.getElementById('dayDetailModal');
            
            // Tarih bilgisini güncelle
            modal.querySelector('.detail-date').textContent = date.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Toplam tutarı hesapla ve göster
            const totalAmount = dayEvents.reduce((sum, event) => sum + parseFloat(event.price), 0);
            modal.querySelector('.total-amount').textContent = `Toplam: ₺${totalAmount.toFixed(2)}`;

            // Ödemeleri listele
            const paymentsContainer = modal.querySelector('.day-payments');
            if (dayEvents.length === 0) {
                paymentsContainer.innerHTML = '<p class="no-events">Bu tarihte ödeme bulunmuyor</p>';
            } else {
                paymentsContainer.innerHTML = dayEvents.map(event => `
                    <div class="day-event-item">
                        <div class="event-icon">
                            <i class="${event.icon}"></i>
                        </div>
                        <div class="event-info">
                            <h4>${event.name}</h4>
                            <p>${event.category}</p>
                        </div>
                        <div class="event-amount">
                            <span>₺${event.price}</span>
                        </div>
                    </div>
                `).join('');
            }

            // Modalı göster
            modal.classList.add('active');
        }

        function getDayEvents(date) {
            return subscriptions.filter(sub => {
                const renewalDate = new Date(sub.renewalDate);
                return renewalDate.getDate() === date.getDate() &&
                       renewalDate.getMonth() === date.getMonth() &&
                       renewalDate.getFullYear() === date.getFullYear();
            });
        }

        // Hatırlatıcı işlemleri
        window.editReminder = function(subscriptionName) {
            const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
            const reminder = reminders.find(r => r.subscription === subscriptionName);
            if (!reminder) return;

            // Modal'ı aç ve değerleri doldur
            const modal = document.getElementById('reminderModal');
            const form = modal.querySelector('.reminder-form');
            
            form.querySelector('#subscription-select').value = reminder.subscription;
            form.querySelector('#reminder-time').value = reminder.time;
            form.querySelector('[name="notification-email"]').checked = reminder.notifications.email;
            form.querySelector('[name="notification-push"]').checked = reminder.notifications.push;

            modal.classList.add('active');
        };

        window.deleteReminder = function(subscriptionName) {
            if (confirm('Bu hatırlatıcıyı silmek istediğinizden emin misiniz?')) {
                let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
                reminders = reminders.filter(r => r.subscription !== subscriptionName);
                localStorage.setItem('reminders', JSON.stringify(reminders));
                renderReminders();
                showNotification('Hatırlatıcı silindi');
            }
        };

        // İlk yüklemede hatırlatıcıları göster
        renderReminders();
        initializeDayDetails();
    }

    // DOM yüklendiğinde özellikleri başlat
    initializeCalendarFeatures();
}); 