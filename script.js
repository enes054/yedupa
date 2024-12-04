document.addEventListener('DOMContentLoaded', function() {
    // Tarih formatlama fonksiyonu
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Firebase yapılandırması
    const firebaseConfig = {
        apiKey: "AIzaSyD5optNArVeFgIBDeqUMclNUuU2G3LglHk",
        authDomain: "yedupaweb.firebaseapp.com",
        projectId: "yedupaweb",
        storageBucket: "yedupaweb.firebasestorage.app",
        messagingSenderId: "263453072531",
        appId: "1:263453072531:web:787dea2a63f2d60f148166",
        measurementId: "G-0ESN7T2PKR"
    };

    // Firebase'i başlat
    firebase.initializeApp(firebaseConfig);

    // Firebase servislerini tanımla
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();
    const analytics = firebase.analytics();

    // UI elementleri
    const appContainer = document.querySelector('.app-container');
    const authModal = document.getElementById('authModal');

    // Giriş formunu dinle
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
            console.log("Başarıyla giriş yapıldı!");
        } catch (error) {
            console.error("Giriş hatası:", error);
            alert("Giriş yapılamadı: " + error.message);
        }
    });

    // Kayıt formunu dinle
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        const name = document.getElementById('registerName').value;

        if (password !== passwordConfirm) {
            alert("Şifreler eşleşmiyor!");
            return;
        }

        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(result.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Kayıt başarılı!");
        } catch (error) {
            console.error("Kayıt hatası:", error);
            alert("Kayıt yapılamadı: " + error.message);
        }
    });

    // Google ile giriş
    let isGoogleAuthInProgress = false; // Giriş işlemi durumunu takip etmek için

    const googleLoginBtn = document.querySelector('.google-login');
    googleLoginBtn.addEventListener('click', async () => {
        if (isGoogleAuthInProgress) {
            console.log('Giriş işlemi zaten devam ediyor...');
            return;
        }

        try {
            isGoogleAuthInProgress = true;
            googleLoginBtn.disabled = true; // Butonu devre dışı bırak
            
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            
            if (result.additionalUserInfo.isNewUser) {
                await db.collection('users').doc(result.user.uid).set({
                    name: result.user.displayName,
                    email: result.user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            showNotification('Google ile giriş başarılı!');
        } catch (error) {
            if (error.code !== 'auth/cancelled-popup-request') {
                showNotification('Google ile giriş yapılamadı: ' + error.message, 'error');
            }
            console.error("Google giriş hatası:", error);
        } finally {
            isGoogleAuthInProgress = false;
            googleLoginBtn.disabled = false; // Butonu tekrar aktif et
        }
    });

    // Google butonu için loading durumu ekleyelim
    function updateGoogleButton(loading = false) {
        const googleBtn = document.querySelector('.google-login');
        if (loading) {
            googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş yapılıyor...';
            googleBtn.disabled = true;
        } else {
            googleBtn.innerHTML = '<i class="fab fa-google"></i> Google ile Giriş Yap';
            googleBtn.disabled = false;
        }
    }

    // Örnek abonelik verileri
    const subscriptions = [
        {
            name: "Netflix",
            category: "Video",
            price: "89.90",
            renewalDate: "2024-03-15",
            icon: "fas fa-film"
        }
    ];

    // Auth durumunu kontrol et
    auth.onAuthStateChanged(function(user) {
        console.log("Auth durumu değişti:", user ? "Kullanıcı giriş yapmış" : "Kullanıcı giriş yapmamış");
        
        // Her durumda app container'ı göster
        appContainer.style.display = 'block';
        // Her durumda auth modal'ı gizle
        authModal.style.display = 'none';

        if (user) {
            // Kullanıcı giriş yapmışsa
            // Normal profil menüsünü göster
            const profileMenu = document.querySelector('.profile-menu');
            if (profileMenu) {
                profileMenu.innerHTML = `
                    <img src="https://via.placeholder.com/40" alt="Profil" class="profile-img">
                    <div class="profile-dropdown">
                        <div class="profile-header">
                            <span class="profile-name">${user.displayName || 'Kullanıcı'}</span>
                            <span class="profile-email">${user.email}</span>
                        </div>
                        <a href="#" class="profile-link"><i class="fas fa-user"></i> Profilim</a>
                        <a href="#settings-section" class="settings-link"><i class="fas fa-cog"></i> Ayarlar</a>
                        <a href="#" class="sign-out-btn"><i class="fas fa-sign-out-alt"></i> Çıkış</a>
                    </div>
                `;
            }
            
            // Çıkış butonunu dinle
            const signOutBtn = document.querySelector('.sign-out-btn');
            if (signOutBtn) {
                signOutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await auth.signOut();
                    } catch (error) {
                        console.error('Çıkış yapılırken hata:', error);
                    }
                });
            }

            renderSubscriptions(subscriptions);
            initializeProfileFeatures();
        } else {
            // Kullanıcı giriş yapmamışsa
            // Giriş butonunu göster
            const profileMenu = document.querySelector('.profile-menu');
            if (profileMenu) {
                profileMenu.innerHTML = `
                    <div class="login-button" style="cursor: pointer; padding: 8px 16px; background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end)); color: white; border-radius: 8px;">
                        <i class="fas fa-sign-in-alt"></i> Giriş Yap
                    </div>
                `;
                
                // Giriş butonuna tıklandığında modalı göster
                const loginButton = profileMenu.querySelector('.login-button');
                if (loginButton) {
                    loginButton.addEventListener('click', () => {
                        authModal.style.display = 'flex';
                    });
                }
            }
        }
    });

    // Modal kapatma butonunu dinle
    const closeModalBtn = authModal.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }

    // Modal dışına tıklandığında kapat
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // İlk yüklemede auth durumunu kontrol et
    if (auth.currentUser) {
        appContainer.classList.add('show');
        authModal.classList.remove('show');
    } else {
        appContainer.classList.add('show');
        // Modal'ı otomatik gösterme
        authModal.classList.remove('show');
    }

    // Abonelikleri listele
    function renderSubscriptions(subs) {
        const subscriptionsList = document.querySelector('.subscriptions');
        if (subscriptionsList) {
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
    }

    // Debug için konsol logları
    console.log("Script yüklendi");
    console.log("Firebase başlatıldı:", firebase.apps.length > 0);
    console.log("Auth servisi mevcut:", !!auth);
    console.log("DOM elementleri:", {
        appContainer: !!appContainer,
        authModal: !!authModal,
        loginForm: !!loginForm,
        registerForm: !!registerForm
    });
    console.log("Auth durumu:", auth.currentUser);
    console.log("Modal görünürlük:", authModal?.style.display);
    console.log("Container görünürlük:", appContainer?.style.display);

    // Profil ve ayarlar işlevleri
    function initializeProfileFeatures() {
        const profileMenu = document.querySelector('.profile-dropdown');
        const profileImg = document.querySelector('.profile-img');
        const signOutBtn = document.querySelector('.profile-dropdown .fa-sign-out-alt').parentElement;

        // Profil bilgilerini güncelle
        function updateProfileUI(user) {
            // Profil fotoğrafını güncelle
            if (user.photoURL) {
                profileImg.src = user.photoURL;
            }

            // Profil menüsünü güncelle
            const profileName = document.querySelector('.profile-name');
            if (profileName) {
                profileName.textContent = user.displayName || user.email;
            }
        }

        // Çıkış yap
        signOutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await auth.signOut();
                showNotification('Başarıyla çıkış yapıldı');
            } catch (error) {
                console.error('Çıkış yapılırken hata:', error);
                showNotification('Çıkış yapılamadı: ' + error.message, 'error');
            }
        });

        // Tema değiştirme
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            // Kaydedilmiş temayı yükle
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeSelect.value = savedTheme;

            themeSelect.addEventListener('change', (e) => {
                const theme = e.target.value;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                showNotification('Tema değiştirildi');
            });
        }

        // Bildirim izinleri
        const notificationBtn = document.querySelector('.notification-permission-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', async () => {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        notificationBtn.innerHTML = '<i class="fas fa-bell"></i> İzin Verildi';
                        notificationBtn.classList.add('permission-granted');
                        notificationBtn.disabled = true;
                        showNotification('Bildirim izni verildi');
                    }
                } catch (error) {
                    console.error('Bildirim izni alınamadı:', error);
                    showNotification('Bildirim izni alınamadı', 'error');
                }
            });
        }

        // Profil bilgilerini güncelleme
        const profileEmailInput = document.querySelector('.settings-group input[type="email"]');
        if (profileEmailInput) {
            profileEmailInput.value = auth.currentUser?.email || '';
        }

        // Şifre değiştirme
        const changePasswordBtn = document.querySelector('.change-password');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', async () => {
                const newPassword = prompt('Yeni şifrenizi girin:');
                if (newPassword) {
                    try {
                        await auth.currentUser.updatePassword(newPassword);
                        showNotification('Şifre başarıyla güncellendi');
                    } catch (error) {
                        console.error('Şifre güncellenemedi:', error);
                        showNotification('Şifre güncellenemedi: ' + error.message, 'error');
                    }
                }
            });
        }

        // Kullanıcı oturumu değiştiğinde profili güncelle
        auth.onAuthStateChanged(user => {
            if (user) {
                updateProfileUI(user);
            }
        });
    }

    // Menü geçişleri için
    const menuItems = document.querySelectorAll('.sidebar nav li');
    const contentSections = document.querySelectorAll('.content-section');

    // Her menü öğesine tıklama olayı ekle
    menuItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Aktif menü öğesini güncelle
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // İlgili içerik bölümünü göster
            contentSections.forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });
            contentSections[index].classList.add('active');
            contentSections[index].style.display = 'block';

            console.log(`${index}. menü öğesine tıklandı`);
        });
    });

    // Ayarlar linkini özel olarak dinle
    const settingsLink = document.querySelector('.settings-link');
    const settingsSection = document.getElementById('settings-section');

    if (settingsLink && settingsSection) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Tüm bölümleri gizle
            contentSections.forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });
            // Ayarlar bölümünü göster
            settingsSection.classList.add('active');
            settingsSection.style.display = 'block';
            
            // Menü seçimini güncelle
            menuItems.forEach(item => item.classList.remove('active'));
            menuItems[menuItems.length - 1].classList.add('active');
        });
    }

    // İlk yüklemede ana sayfayı göster
    contentSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    contentSections[0].classList.add('active');
    contentSections[0].style.display = 'block';
    menuItems[0].classList.add('active');
}); 