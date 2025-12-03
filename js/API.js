
        // Функция для переключения страниц
        function showPage(pageId) {
            // Скрыть все страницы
            const pages = document.querySelectorAll('.page-content');
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Показать выбранную страницу
            document.getElementById(pageId + '-page').classList.add('active');
            
            // Обновить активную ссылку в навигации
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.textContent === getPageName(pageId)) {
                    link.classList.add('active');
                }
            });
            
            // Прокрутить вверх
            window.scrollTo(0, 0);
            
            // Если показываем страницу профиля, показываем вкладку "Данные"
            if (pageId === 'profile') {
                showProfileTab('data');
            }
        }
        
        // Функция для получения названия страницы по ID
        function getPageName(pageId) {
            const pageNames = {
                'main': 'Главная',
                'about': 'О компании',
                'contacts': 'Контакты',
                'profile': 'Профиль',
                'order': 'Заказать перевозку'
            };
            
            return pageNames[pageId] || 'Главная';
        }
        
        // Функция переключения вкладок профиля
        function showProfileTab(tabName) {
            // Убираем активный класс у всех кнопок
            const navButtons = document.querySelectorAll('.profile-nav-btn');
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс нажатой кнопке
            document.querySelector(`.profile-nav-btn[onclick*="${tabName}"]`).classList.add('active');
            
            // Скрываем все вкладки
            const tabs = document.querySelectorAll('.profile-tab');
            tabs.forEach(tab => tab.style.display = 'none');
            
            // Показываем выбранную вкладку
            document.getElementById(`profile-${tabName}`).style.display = 'block';
            
            // Если открыли вкладку заказов, обновляем статистику
            if (tabName === 'orders') {
                updateProfileOrderStats();
            }
        }
        
        // Функция обновления статистики заказов в профиле
        function updateProfileOrderStats() {
            // Здесь будет логика обновления статистики
            // Пока заглушка
            document.getElementById('profile-total-orders-count').textContent = '0';
            document.getElementById('profile-processing-orders-count').textContent = '0';
            document.getElementById('profile-in-transit-orders-count').textContent = '0';
            document.getElementById('profile-delivered-orders-count').textContent = '0';
        }
        
        // Функция сброса фильтров в профиле
        function resetProfileFilters() {
            document.getElementById('profile-status-filter').value = 'Все заказы';
            document.getElementById('profile-period-filter').value = 'Все время';
            document.getElementById('profile-search-input').value = '';
            console.log('Фильтры профиля сброшены');
        }
        
        // Обработчик формы профиля
        function handleProfileSubmit(event) {
            event.preventDefault();
            
            const currentPassword = document.getElementById('profile-current-password').value;
            const newPassword = document.getElementById('profile-new-password').value;
            const confirmPassword = document.getElementById('profile-confirm-password').value;
            
            // Проверка на смену пароля
            if (currentPassword || newPassword || confirmPassword) {
                if (newPassword !== confirmPassword) {
                    alert('Новый пароль и подтверждение не совпадают');
                    return false;
                }
                if (newPassword.length < 6) {
                    alert('Новый пароль должен содержать минимум 6 символов');
                    return false;
                }
            }
            
            // Здесь будет логика сохранения данных профиля
            alert('Изменения сохранены!');
            return false;
        }
        
        // Функция для имитации авторизации
        function loginUser() {
            document.getElementById('unauth-buttons').style.display = 'none';
            document.getElementById('auth-user-buttons').style.display = 'flex';
        }
        
        function logout() {
            document.getElementById('unauth-buttons').style.display = 'flex';
            document.getElementById('auth-user-buttons').style.display = 'none';
            showPage('main');
        }
        
        // Функции для работы с модальными окнами авторизации и регистрации
        function openLoginModal() {
            document.getElementById('loginModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeLoginModal() {
            document.getElementById('loginModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        function openRegisterModal() {
            document.getElementById('registerModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeRegisterModal() {
            document.getElementById('registerModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        function switchToRegister() {
            closeLoginModal();
            openRegisterModal();
        }
        
        function switchToLogin() {
            closeRegisterModal();
            openLoginModal();
        }
        
        // Функции для модальных окон регистрации с SMS
        function openConfirmRegisterCodeModal() {
            document.getElementById('confirmRegisterCodeModal').classList.add('active');
            document.body.style.overflow = 'hidden';
            startRegisterTimer();
        }
        
        function closeConfirmRegisterCodeModal() {
            document.getElementById('confirmRegisterCodeModal').classList.remove('active');
            document.body.style.overflow = 'auto';
            resetRegisterTimer();
        }
        
        function backToRegister() {
            closeConfirmRegisterCodeModal();
            openRegisterModal();
        }
        
        // Функция для перемещения между полями ввода кода при регистрации
        function moveToNextRegister(currentIndex, event) {
            const input = event.target;
            const value = input.value;
            
            if (value.length === 1 && currentIndex < 4) {
                document.getElementById(`reg-sms-code-${currentIndex + 1}`).focus();
            }
            
            if (event.inputType === 'deleteContentBackward' && currentIndex > 1 && value.length === 0) {
                document.getElementById(`reg-sms-code-${currentIndex - 1}`).focus();
            }
        }
        
        // Таймер для повторной отправки кода при регистрации
        let registerTimerInterval;
        let registerTimerSeconds = 59;
        
        function startRegisterTimer() {
            clearInterval(registerTimerInterval);
            registerTimerSeconds = 59;
            
            const resendCodeElement = document.getElementById('reg-resend-code');
            resendCodeElement.classList.add('disabled');
            
            registerTimerInterval = setInterval(() => {
                const timerElement = document.getElementById('reg-sms-timer');
                timerElement.textContent = `Пожалуйста подождите... ${registerTimerSeconds} сек`;
                
                if (registerTimerSeconds <= 0) {
                    clearInterval(registerTimerInterval);
                    timerElement.textContent = 'Код не пришел?';
                    resendCodeElement.classList.remove('disabled');
                }
                
                registerTimerSeconds--;
            }, 1000);
        }
        
        function resetRegisterTimer() {
            clearInterval(registerTimerInterval);
            document.getElementById('reg-sms-timer').textContent = 'Пожалуйста подождите... 59 сек';
            document.getElementById('reg-resend-code').classList.add('disabled');
        }
        
        // Функция для повторной отправки кода при регистрации
        function resendRegisterCode() {
            const resendCodeElement = document.getElementById('reg-resend-code');
            
            if (resendCodeElement.classList.contains('disabled')) {
                return;
            }
            
            console.log('Повторная отправка кода для регистрации');
            startRegisterTimer();
            alert('Код отправлен повторно!');
        }
        
        // Функция для проверки введенного кода при регистрации
        function verifyRegisterCode() {
            const code1 = document.getElementById('reg-sms-code-1').value;
            const code2 = document.getElementById('reg-sms-code-2').value;
            const code3 = document.getElementById('reg-sms-code-3').value;
            const code4 = document.getElementById('reg-sms-code-4').value;
            
            const fullCode = code1 + code2 + code3 + code4;
            
            if (fullCode.length !== 4) {
                alert('Пожалуйста, введите полный код из 4 цифр');
                return;
            }
            
            console.log('Проверка кода регистрации:', fullCode);
            alert('Регистрация подтверждена! Вы успешно зарегистрировались.');
            closeConfirmRegisterCodeModal();
            loginUser();
        }
        
        // Функции для работы с модальными окнами восстановления пароля
        function openForgotPasswordModal() {
            closeLoginModal();
            document.getElementById('forgotPasswordModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeForgotPasswordModal() {
            document.getElementById('forgotPasswordModal').classList.remove('active');
            document.body.style.overflow = 'auto';
            openLoginModal();
        }
        
        function openConfirmCodeModal() {
            document.getElementById('confirmCodeModal').classList.add('active');
            document.body.style.overflow = 'hidden';
            startTimer();
        }
        
        function closeConfirmCodeModal() {
            document.getElementById('confirmCodeModal').classList.remove('active');
            document.body.style.overflow = 'auto';
            resetTimer();
        }
        
        function backToForgotPassword() {
            closeConfirmCodeModal();
            openForgotPasswordModal();
        }
        
        // Функция для отправки кода восстановления
        function sendRecoveryCode() {
            const contact = document.getElementById('recovery-contact').value;
            
            if (!contact) {
                alert('Заполните поле с телефоном или email');
                return;
            }
            
            console.log('Отправка кода восстановления на:', contact);
            closeForgotPasswordModal();
            openConfirmCodeModal();
        }
        
        // Функция для перемещения между полями ввода кода
        function moveToNext(currentIndex, event) {
            const input = event.target;
            const value = input.value;
            
            if (value.length === 1 && currentIndex < 4) {
                document.getElementById(`sms-code-${currentIndex + 1}`).focus();
            }
            
            if (event.inputType === 'deleteContentBackward' && currentIndex > 1 && value.length === 0) {
                document.getElementById(`sms-code-${currentIndex - 1}`).focus();
            }
        }
        
        // Таймер для повторной отправки кода
        let timerInterval;
        let timerSeconds = 59;
        
        function startTimer() {
            clearInterval(timerInterval);
            timerSeconds = 59;
            
            const resendCodeElement = document.getElementById('resend-code');
            resendCodeElement.classList.add('disabled');
            
            timerInterval = setInterval(() => {
                const timerElement = document.getElementById('sms-timer');
                timerElement.textContent = `Пожалуйста подождите... ${timerSeconds} сек`;
                
                if (timerSeconds <= 0) {
                    clearInterval(timerInterval);
                    timerElement.textContent = 'Код не пришел?';
                    resendCodeElement.classList.remove('disabled');
                }
                
                timerSeconds--;
            }, 1000);
        }
        
        function resetTimer() {
            clearInterval(timerInterval);
            document.getElementById('sms-timer').textContent = 'Пожалуйста подождите... 59 сек';
            document.getElementById('resend-code').classList.add('disabled');
        }
        
        // Функция для повторной отправки кода
        function resendCode() {
            const resendCodeElement = document.getElementById('resend-code');
            
            if (resendCodeElement.classList.contains('disabled')) {
                return;
            }
            
            console.log('Повторная отправка кода');
            startTimer();
            alert('Код отправлен повторно!');
        }
        
        // Функция для проверки введенного кода
        function verifyCode() {
            const code1 = document.getElementById('sms-code-1').value;
            const code2 = document.getElementById('sms-code-2').value;
            const code3 = document.getElementById('sms-code-3').value;
            const code4 = document.getElementById('sms-code-4').value;
            
            const fullCode = code1 + code2 + code3 + code4;
            
            if (fullCode.length !== 4) {
                alert('Пожалуйста, введите полный код из 4 цифр');
                return;
            }
            
            console.log('Проверка кода:', fullCode);
            alert('Код подтвержден! Теперь вы можете создать новый пароль.');
            closeConfirmCodeModal();
        }
        
        // Функции для отображения ошибок в формах авторизации/регистрации
        function showError(inputId, message) {
            const input = document.getElementById(inputId);
            const errorElement = document.getElementById(inputId + '-error');
            
            if (input && errorElement) {
                input.classList.add('error');
                errorElement.textContent = message;
                errorElement.classList.add('show');
                errorElement.style.display = 'block';
            }
        }
        
        function clearError(inputId) {
            const input = document.getElementById(inputId);
            const errorElement = document.getElementById(inputId + '-error');
            
            if (input && errorElement) {
                input.classList.remove('error');
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                errorElement.style.display = 'none';
            }
        }
        
        function clearAllErrors() {
            const errorMessages = document.querySelectorAll('.error-message');
            const inputs = document.querySelectorAll('.auth-input');
            
            errorMessages.forEach(error => {
                error.textContent = '';
                error.classList.remove('show');
                error.style.display = 'none';
            });
            
            inputs.forEach(input => {
                input.classList.remove('error');
            });
        }
        
        // Функции для отображения ошибок в форме заказа
        function showOrderError(inputId, message) {
            const input = document.getElementById(inputId);
            const errorElement = document.getElementById(inputId + '-error');
            
            if (input && errorElement) {
                input.classList.add('error');
                errorElement.textContent = message;
                errorElement.classList.add('show');
                errorElement.style.display = 'block';
            }
        }
        
        function clearOrderError(inputId) {
            const input = document.getElementById(inputId);
            const errorElement = document.getElementById(inputId + '-error');
            
            if (input && errorElement) {
                input.classList.remove('error');
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                errorElement.style.display = 'none';
            }
        }
        
        function clearAllOrderErrors() {
            const errorMessages = document.querySelectorAll('.order-error-message');
            const inputs = document.querySelectorAll('#orderForm input, #orderForm textarea, #orderForm select');
            
            errorMessages.forEach(error => {
                error.textContent = '';
                error.classList.remove('show');
                error.style.display = 'none';
            });
            
            inputs.forEach(input => {
                input.classList.remove('error');
            });
        }
        
        // Обработчики форм
        function handleLogin() {
            const login = document.getElementById('auth-login').value;
            const password = document.getElementById('auth-password').value;
            
            clearAllErrors();
            
            let hasError = false;
            
            if (!login) {
                showError('auth-login', 'Заполните это поле');
                hasError = true;
            }
            
            if (!password) {
                showError('auth-password', 'Заполните это поле');
                hasError = true;
            }
            
            if (hasError) {
                return;
            }
            
            const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!phoneRegex.test(login.replace(/\s/g, '')) && !emailRegex.test(login)) {
                showError('auth-login', 'Введите корректный телефон или email');
                return;
            }
            
            console.log('Попытка входа с:', login);
            alert('Вход выполнен успешно!');
            closeLoginModal();
            loginUser();
        }
        
        function handleRegister() {
            const firstName = document.getElementById('reg-firstName').value;
            const lastName = document.getElementById('reg-lastName').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirmPassword').value;
            const agreeTerms = document.getElementById('reg-agreeTerms').checked;
            
            clearAllErrors();
            
            let hasError = false;
            
            if (!firstName) {
                showError('reg-firstName', 'Заполните это поле');
                hasError = true;
            }
            
            if (!lastName) {
                showError('reg-lastName', 'Заполните это поле');
                hasError = true;
            }
            
            if (!email) {
                showError('reg-email', 'Заполните это поле');
                hasError = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('reg-email', 'Введите корректный email');
                hasError = true;
            }
            
            if (!phone) {
                showError('reg-phone', 'Заполните это поле');
                hasError = true;
            }
            
            if (!password) {
                showError('reg-password', 'Заполните это поле');
                hasError = true;
            } else if (password.length < 6) {
                showError('reg-password', 'Пароль должен содержать не менее 6 символов');
                hasError = true;
            }
            
            if (!confirmPassword) {
                showError('reg-confirmPassword', 'Заполните это поле');
                hasError = true;
            } else if (password !== confirmPassword) {
                showError('reg-confirmPassword', 'Пароли не совпадают');
                hasError = true;
            }
            
            if (!agreeTerms) {
                alert('Необходимо согласиться с условиями использования');
                return;
            }
            
            if (hasError) {
                return;
            }
            
            console.log('Попытка регистрации с данными:', { firstName, lastName, email, phone });
            closeRegisterModal();
            openConfirmRegisterCodeModal();
        }
        
        // Обновленная функция handleOrderSubmit с валидацией
        function handleOrderSubmit(event) {
            event.preventDefault();
            
            clearAllOrderErrors();
            
            const senderName = document.getElementById('sender-name').value;
            const senderPhone = document.getElementById('sender-phone').value;
            const cargoDescription = document.getElementById('cargo-description').value;
            const cargoWeight = document.getElementById('cargo-weight').value;
            const cargoVolume = document.getElementById('cargo-volume').value;
            const cargoType = document.getElementById('cargo-type').value;
            const shippingDate = document.getElementById('shipping-date').value;
            const pickupAddress = document.getElementById('pickup-address').value;
            const deliveryAddress = document.getElementById('delivery-address').value;
            
            let hasError = false;
            
            if (!senderName) {
                showOrderError('sender-name', 'Заполните это поле');
                hasError = true;
            }
            
            if (!senderPhone) {
                showOrderError('sender-phone', 'Заполните это поле');
                hasError = true;
            }
            
            if (!cargoDescription) {
                showOrderError('cargo-description', 'Заполните это поле');
                hasError = true;
            }
            
            if (!cargoWeight || parseFloat(cargoWeight) <= 0) {
                showOrderError('cargo-weight', 'Введите корректный вес');
                hasError = true;
            }
            
            if (!cargoVolume || parseFloat(cargoVolume) <= 0) {
                showOrderError('cargo-volume', 'Введите корректный объем');
                hasError = true;
            }
            
            if (!cargoType) {
                showOrderError('cargo-type', 'Выберите тип груза');
                hasError = true;
            }
            
            if (!shippingDate) {
                showOrderError('shipping-date', 'Выберите дату отправки');
                hasError = true;
            }
            
            if (!pickupAddress) {
                showOrderError('pickup-address', 'Заполните это поле');
                hasError = true;
            }
            
            if (!deliveryAddress) {
                showOrderError('delivery-address', 'Заполните это поле');
                hasError = true;
            }
            
            if (hasError) {
                alert('Пожалуйста, заполните все обязательные поля корректно');
                return false;
            }
            
            alert('Заказ успешно оформлен! Наш менеджер свяжется с вами в течение 30 минут.');
            showPage('main');
            
            return false;
        }
        
        function handleContactSubmit(event) {
            event.preventDefault();
            
            alert('Сообщение успешно отправлено! Мы ответим вам в ближайшее время.');
            document.getElementById('contactForm').reset();
            
            return false;
        }
        
        // Функции для страницы "Мои заказы" в профиле
        function toggleOrdersVisibility(hasOrders) {
            const ordersTable = document.getElementById('profile-orders-table');
            const noOrdersMessage = document.getElementById('profile-no-orders-message');
            
            if (hasOrders) {
                if (ordersTable) ordersTable.style.display = 'block';
                if (noOrdersMessage) noOrdersMessage.style.display = 'none';
            } else {
                if (ordersTable) ordersTable.style.display = 'none';
                if (noOrdersMessage) noOrdersMessage.style.display = 'block';
            }
        }
        
        function viewOrder(orderId) {
            alert(`Просмотр заказа ${orderId}`);
        }
        
        function trackOrder(orderId) {
            alert(`Отслеживание заказа ${orderId}`);
        }
        
        // Закрытие модальных окон при клике вне их
        document.addEventListener('click', function(event) {
            const modals = ['loginModal', 'registerModal', 'forgotPasswordModal', 'confirmCodeModal', 'confirmRegisterCodeModal'];
            
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (event.target === modal) {
                    if (modalId === 'loginModal') closeLoginModal();
                    if (modalId === 'registerModal') closeRegisterModal();
                    if (modalId === 'forgotPasswordModal') closeForgotPasswordModal();
                    if (modalId === 'confirmCodeModal') closeConfirmCodeModal();
                    if (modalId === 'confirmRegisterCodeModal') closeConfirmRegisterCodeModal();
                }
            });
        });
        
        // Закрытие модальных окон при нажатии Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeLoginModal();
                closeRegisterModal();
                closeForgotPasswordModal();
                closeConfirmCodeModal();
                closeConfirmRegisterCodeModal();
            }
        });
        
        // Инициализация - показать главную страницу при загрузке
        document.addEventListener('DOMContentLoaded', function() {
            // Установить сегодняшнюю дату в поле даты отправки
            const today = new Date().toISOString().split('T')[0];
            const shippingDate = document.getElementById('shipping-date');
            if (shippingDate) {
                shippingDate.min = today;
            }
            
            // Назначить обработчики событий для форм
            const loginBtn = document.querySelector('#loginModal .auth-btn');
            if (loginBtn) {
                loginBtn.addEventListener('click', handleLogin);
            }
            
            const registerBtn = document.querySelector('#registerModal .auth-btn.register-btn');
            if (registerBtn) {
                registerBtn.addEventListener('click', handleRegister);
            }
            
            const orderForm = document.getElementById('orderForm');
            if (orderForm) {
                orderForm.addEventListener('submit', handleOrderSubmit);
            }
            
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', handleContactSubmit);
            }
            
            // Назначить обработчики для ссылок переключения между модальными окнами
            const switchToRegisterLink = document.querySelector('#loginModal .auth-link a');
            if (switchToRegisterLink) {
                switchToRegisterLink.addEventListener('click', switchToRegister);
            }
            
            const switchToLoginLink = document.querySelector('#registerModal .auth-link a');
            if (switchToLoginLink) {
                switchToLoginLink.addEventListener('click', switchToLogin);
            }
            
            // Обработчик для ссылки "Забыли пароль?"
            const forgotPasswordLink = document.querySelector('#loginModal .auth-forgot-password');
            if (forgotPasswordLink) {
                forgotPasswordLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    openForgotPasswordModal();
                });
            }
            
            // Обработчик для кнопки восстановления пароля
            const recoveryBtn = document.querySelector('#forgotPasswordModal .recovery-btn');
            if (recoveryBtn) {
                recoveryBtn.addEventListener('click', sendRecoveryCode);
            }
            
            // Обработчик для кнопки подтверждения кода
            const verifyBtn = document.querySelector('#confirmCodeModal .continue-btn');
            if (verifyBtn) {
                verifyBtn.addEventListener('click', verifyCode);
            }
            
            // Обработчик для кнопки "Назад" в окне подтверждения кода
            const backBtn = document.querySelector('#confirmCodeModal .back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', backToForgotPassword);
            }
            
            // Обработчик для кнопки повторной отправки кода
            const resendLink = document.querySelector('#confirmCodeModal .resend-code a');
            if (resendLink) {
                resendLink.addEventListener('click', resendCode);
            }
            
            // Обработчик для кнопки подтверждения регистрации
            const verifyRegisterBtn = document.querySelector('#confirmRegisterCodeModal .continue-btn');
            if (verifyRegisterBtn) {
                verifyRegisterBtn.addEventListener('click', verifyRegisterCode);
            }
            
            // Обработчик для кнопки "Назад" в окне подтверждения регистрации
            const backRegisterBtn = document.querySelector('#confirmRegisterCodeModal .back-btn');
            if (backRegisterBtn) {
                backRegisterBtn.addEventListener('click', backToRegister);
            }
            
            // Обработчик для кнопки повторной отправки кода в регистрации
            const resendRegisterLink = document.querySelector('#confirmRegisterCodeModal .resend-code a');
            if (resendRegisterLink) {
                resendRegisterLink.addEventListener('click', resendRegisterCode);
            }
            
            // Инициализация фильтров для страницы профиля
            const profileStatusFilter = document.getElementById('profile-status-filter');
            const profilePeriodFilter = document.getElementById('profile-period-filter');
            const profileSearchInput = document.getElementById('profile-search-input');
            
            if (profileStatusFilter) {
                profileStatusFilter.addEventListener('change', filterProfileOrders);
            }
            
            if (profilePeriodFilter) {
                profilePeriodFilter.addEventListener('change', filterProfileOrders);
            }
            
            if (profileSearchInput) {
                profileSearchInput.addEventListener('input', filterProfileOrders);
            }
            
            // По умолчанию показываем сообщение об отсутствии заказов
            toggleOrdersVisibility(false);
            updateProfileOrderStats();
        });
        
        // Функция фильтрации заказов в профиле
        function filterProfileOrders() {
            console.log('Фильтрация заказов в профиле');
        }