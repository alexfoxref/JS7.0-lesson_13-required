window.addEventListener('DOMContentLoaded', () => {

    'use strict';

    // переменные для блока с ajax
    let form = document.querySelector('.main-form'),
        contactForm = document.getElementById('form'),
        input = form.getElementsByTagName('input'),
        contactInput = contactForm.getElementsByTagName('input'),
        statusMessage = document.createElement('div'),
        overlayForm = document.querySelector('.overlay-form'),
        popupFormTitle = document.querySelector('.popup-form-title'),
        popupFormStatus = document.querySelector('.popup-form-status');

        statusMessage.classList.add('status-img');
    // переменные для блока с ajax

// Tabs

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', (event) => {
        let target = event.target;

        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

// Timer

    // Задали дату окончания
    let deadline = '2019-06-10';

    // Определяем сколько осталось часов, минут и секнд до даты
    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date());

        if (t > 0) {
            let seconds = Math.floor((t/1000) % 60),
                minutes = Math.floor((t/1000/60) % 60),
                hours = Math.floor((t/1000/60/60) % 24),
                days = Math.floor(t/1000/60/60/24);

            return {
                'total' : t + '',
                'days' : days + '',
                'hours' : hours + '',
                'minutes' : minutes + '',
                'seconds' : seconds + ''
            };
        } else {
            return {
                'total' : '0',
                'days' : '0',
                'hours' : '0',
                'minutes' : '0',
                'seconds' : '0'
            }
        }   
    }

    // Задаем часы
    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            days = timer.querySelector('.days'),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);

            for (let key in t) {
                if (t[key].length < 2 && key != 'days') {
                    t[key] = '0' + t[key];
                }
            }
            switch (t.days) {
                case '0':
                    t.days = '';
                    break;
                case '1':
                    t.days += ' day';
                    break;
                default:
                    t.days += ' days';
                    break;
            }

            days.textContent = t.days;
            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('timer', deadline);

// Плавная прокрутка пунктов меню

    let menuPanel = document.querySelector('ul'),
        menuItems = document.querySelectorAll('li > a'),
        overlay = document.querySelector('.overlay'),
        refs = [
            document.querySelector('.info-header'),
            document.querySelector('.slider-title'),
            document.querySelector('.counter-title'),
            document.querySelector('.contact-form')
        ];

    menuItems.forEach((item) => {
        item.classList.add('menu-item');
    });

    menuPanel.addEventListener('click', (event) => {
        event.preventDefault();
        if (!overlay.classList.contains('activeOverlay')) {
            let target = event.target;

            if (target && target.classList.contains('menu-item')) {
                
                // давно придуманный велосипед
                // for (let i = 0; i < menuItems.length; i++) {
                //     if (target == menuItems[i]) {
                //         document.querySelector(menuItems[i].getAttribute('href')).scrollIntoView({
                //             behavior: 'smooth',
                //             block: 'start'
                //         });
                //     }
                // }
    
                // мой велосипед (смещается начальное положение, если кликнуть на кнопку, пока идет предыдущее движение)
                for (let i = 0; i < menuItems.length; i++) {
                    if (target == menuItems[i]) {
                        let margin = 20,
                            startDistance = refs[i].getBoundingClientRect().top - menuPanel.clientHeight - margin;
                    
                        if (i == 0) {
                            margin = 60;
                        }

                        function moveBySteps(distance, time, interval, numStep, id) {
                            let colSteps = Math.floor(time/interval) + 1;
                        
                            if (colSteps%2 == 0) {
                                colSteps += 1;
                            }
                        
                            let coord = [],
                                num = Math.floor(colSteps/2) + 1;
                        
                            coord[colSteps] = parseFloat(distance);
                            coord[1] = 0;
                            coord[num] = parseFloat(distance/2);
                        
                            let acceleration = parseFloat((4 * distance)/Math.pow(time, 2));
                        
                            for (let i = 2; i < (Math.floor(colSteps/2) + 1); i++) {
                                coord[i] = parseFloat(acceleration * Math.pow(((i - 1) * interval), 2)/2);
                            }
                        
                            let dif = num;
                        
                            for (let i = (num + 1); i < colSteps; i++) {
                                coord[i] = parseFloat( coord[i - 1] + (coord[dif] - coord[dif - 1]) );
                                dif--;
                            }
                                        
                            let delta = 0,
                                steps = [];

                            for (let i = 1; i < colSteps; i++) {
                                steps[i] = Math.floor(coord[i + 1] - coord[i] + delta);
                                delta = parseFloat(parseFloat(coord[i + 1] - coord[i] + delta) - steps[i]);
                            }
                        
                            if (steps[numStep] !== undefined) {
                                scrollBy(0, steps[numStep]);
                            } else {
                                clearInterval(id);
                            }
                        }
        
                        function moveByStepsAnimation() {
                            let n = 1,
                                t = 1000,
                                int = 10,
                                idi = setInterval(function() {
                                    moveBySteps(startDistance, t, int, n, idi);
                                    n++;
                                }, int);
                        }

                        moveByStepsAnimation();
                    }
                } 
            }
        }
    });

// Модальные окна

    let more = document.querySelector('.more'),
        close = document.querySelector('.popup-close'),
        popup = document.querySelector('.overlay > *'),
        tabBtns = document.querySelectorAll('.description-btn'),
        fade = document.querySelectorAll('.fade')[8];

    document.body.addEventListener('click', (event) => {
        for (let i = 0; i < tabBtns.length; i++) {
            
            if (event.target && (event.target == more || event.target == tabBtns[i])) {
                event.preventDefault();
                more.classList.remove('more-splash');
                tabBtns[i].classList.remove('more-splash');
                fade.classList.remove('fade');
    
                if (/Msie|Edge/i.test(navigator.userAgent)) {
                    more.classList.add('more-splash');
                    tabBtns[i].classList.add('more-splash');
                    fade.classList.add('fade');
                } else if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
                    //js анимация
                    overlay.style.top = '50%';
                    overlay.style.left = '50%';
                    overlay.style.width = '0%';
                    overlay.style.height = '0%';
                    popup.style.left = '-50%';
                    let shadow = 10;

                    if (event.target == more) {
                        more.style.boxShadow = `0 0 ${shadow}px #c78030`;
                    }
                    if (event.target == tabBtns[i]) {
                        tabBtns[i].style.boxShadow = `0 0 ${shadow}px #c78030`;
                    }
    
                    function overlayAnimation (pos1, pos2, int) {
                        let id = setInterval(frameOverlay, int);
    
                        function frameOverlay() {
                            let plus = 1;
    
                            overlay.style.top = `${parseInt(overlay.style.top) - plus}%`;
                            overlay.style.left = `${parseInt(overlay.style.left) - plus}%`;
                            overlay.style.width = `${parseInt(overlay.style.width) + 2 * plus}%`;
                            overlay.style.height = `${parseInt(overlay.style.height) + 2 * plus}%`;
                            if (event.target == more) {
                                more.style.boxShadow = `0 0 ${++shadow}px #c78030`;
                            }
                            if (event.target == tabBtns[i]) {
                                tabBtns[i].style.boxShadow = `0 0 ${++shadow}px #c78030`;
                            }

                            if (parseInt(overlay.style.top) <= pos1) {
                                clearInterval(id);

                                id = setInterval(framePopup, int);

                                function framePopup() {
                                    let plus = 1;

                                    popup.style.left = `${parseInt(popup.style.left) + 2 * plus}%`;
                                
                                    if (parseInt(popup.style.left) >= pos2) {
                                        clearInterval(id);
                                        if (event.target == more) {
                                            shadow = 0;
                                            more.style.boxShadow = `0 0 ${shadow}px #c78030`;                                        }
                                        if (event.target == tabBtns[i]) {
                                            shadow = 0;
                                            tabBtns[i].style.boxShadow = `0 0 ${shadow}px #c78030`;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (event.target == more) {
                        overlayAnimation(3, 44, 20);
                    }
                    if (event.target == tabBtns[i]) {
                        overlayAnimation(0, 50, 5);
                        shadow = 10;
                        tabBtns[i].style.boxShadow = `0 0 ${shadow}px #c78030`;
                    }
                }

                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
                overlay.classList.add('activeOverlay');
            }
        }
    });

    // скрываем при нажатии на крестик
    close.addEventListener('click', () => {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].classList.remove('more-splash');
        }
        document.body.style.overflow = '';
        overlay.classList.remove('activeOverlay');
        //удаляем сообщение блока ajax
        if (form.contains(statusMessage)) {
            statusMessage.innerHTML = '';
            form.removeChild(statusMessage);
        }

    });
    // скрываем при нажатии в область вне модального окна
    overlay.addEventListener('click', (event) => {
        if (event.target && !popup.contains(event.target)) {
            overlay.style.display = 'none';
            more.classList.remove('more-splash');
            for (let i = 0; i < tabBtns.length; i++) {
                tabBtns[i].classList.remove('more-splash');
            }
            document.body.style.overflow = '';
            overlay.classList.remove('activeOverlay');
            //удаляем сообщение блока ajax
            if (form.contains(statusMessage)) {
                statusMessage.innerHTML = '';
                form.removeChild(statusMessage);
            }
        }
    });

//Ограничение ввода в поля телефон

    let siteInputs = document.querySelectorAll('input[name="phone"]');
    for (let i = 0; i < siteInputs.length; i++) {
        siteInputs[i].addEventListener('input', () => {
            let str = siteInputs[i].value;
            while (/[^\+\d]/.test(str)) {
                str = str.replace(/[^\+\d]/g, '');
                siteInputs[i].value = str;
            }
        });
    }

// Формы AJAX

    function sendForm(form, input) {
        //объект стандартных интерпретаций ответа сервера
        let message = {
            loading: 'Загрузка...',
            loadingImg: `<img src="img/refresh-button.svg" width="40" height="40" alt="Загрузка...">`,
            success: 'Спасибо за вашу заявку!',
            successImg: `<img src="img/thumbs-up.svg" width="40" height="40" alt="Спасибо за вашу заявку!">`,
            successImgBig: `<img src="img/thumbs-up.svg" width="200" height="200" alt="Спасибо за вашу заявку!">`,
            failure: 'Что-то пошло не так...',
            failureImg: `<img src="img/delete-button.svg" width="40" height="40" alt="Что-то пошло не так...">`,
            failureImgBig: `<img src="img/delete-button.svg" width="200" height="200" alt="Что-то пошло не так...">`
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            //добавляем картинку в форму и удаляем класс анимации всплывающего окна формы
            form.appendChild(statusMessage);
            overlayForm.classList.remove('fade-form');
            //устанавливаем позицию для картинки
            if (form == contactForm) {
                statusMessage.style.top = '67%';
                statusMessage.style.left = '43%';
            } else {
                statusMessage.style.top = '58%';
                statusMessage.style.left = '54%';
            }

            //формируем запрос в формате json
            function postData(data) {
                return new Promise((resolve, reject) => {
                    let request = new XMLHttpRequest();
    
                    request.open('POST', 'server.php');
                    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                    
                    //слушатель на начало загрузки
                    request.addEventListener('loadstart', () => {
                        loadingPost();
                    });
                    //слушатель на изменение состояния запроса
                    request.addEventListener('readystatechange', () => {
                        // так не работает
                        // if (request.readyState < 4) {
                        //     resolve('loading')} else 
                        if (request.readyState === 4) {
                            if (request.status == 200) {
                                resolve('success');
                            } else {
                                reject('failure');
                            }
                        } 
                    });

                    request.send(data);
                })
            }
            
            //создаем данные в формате json
            let formData = new FormData(form),
                obj = {};
            formData.forEach((value, key) => {
                obj[key] = value;
            });
            let json = JSON.stringify(obj);
            
            //загрузка
            function loadingPost() {
                //класс для условия остановки анимации
                statusMessage.classList.add('loading');
                statusMessage.innerHTML = message.loadingImg;
                //js анимация вращения картинки
                let count = 0,
                    loadingAnimation = setInterval(() => {
                        statusMessage.style.transform = `rotate(${++count}deg)`;
                        if (!statusMessage.classList.contains('loading')) {
                            statusMessage.style.transform = `rotate(0deg)`;
                            clearInterval(loadingAnimation);
                        }
                    }, 10);
            }

            //функция действий при успехе и при неуспехе
            function requestEvent(st) {
                //класс для условия остановки анимации
                statusMessage.classList.remove('loading');
                //вставляем нужную картинку
                statusMessage.innerHTML = message[`${st}Img`];
                //модальное окно с нужной надписью и картинкой
                overlayForm.style.display = 'block';
                overlayForm.classList.add('fade-form');
                popupFormTitle.textContent = message[`${st}`];
                let image = document.createElement('div');
                image.innerHTML = message[`${st}ImgBig`];
                image.classList.add('popup-form-img')
                popupFormStatus.appendChild(image);
                //закрываем модальное окно по клику в любое место и убираем обработчик событий
                function removeListener(event) {
                    overlayForm.style.display = 'none';
                    overlayForm.classList.remove('fade-form');
                    popupFormStatus.removeChild(image);
                    document.body.removeEventListener('click', removeListener);
                }

                document.body.addEventListener('click', removeListener);
            }

            //setTimeout
            function waitTimeout(ms) {
                return new Promise(resolve => {
                    setTimeout(resolve, ms)
                })
            }

            //окончание запроса
            function endPost() {
                for (let i = 0; i < input.length; i++) {
                    input[i].value = '';
                    input[i].addEventListener('input', () => {
                        if (form.contains(statusMessage)) {
                            statusMessage.innerHTML = '';
                            form.removeChild(statusMessage);
                        }
                    });
                }
            }

            postData(json)
                    // так не работает
                    // .then(() => {
                    //     loadingPost()
                    // })
                    .then((succ) => {
                        waitTimeout(1000)
                            .then(() => {requestEvent('success')})
                    })
                    .catch((err) => {
                        waitTimeout(3000)
                            .then(() => {requestEvent('failure')})
                    })
                    .then(() => {
                        endPost()
                    })
        });
    }

    sendForm(form, input);
    sendForm(contactForm, contactInput);

// Адаптивный js Slider

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

    showSlides(slideIndex);

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach(item => {item.style.display = 'none'});
        dots.forEach(item => {item.classList.remove('dot-active')});

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', () => {
        plusSlides(-1);
    });

    next.addEventListener('click', () => {
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', event => {
        dots.forEach((item, index) => {
            if (event.target && event.target == item) {
                currentSlide(index + 1);
            }
        });
    });

// Calc

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = +persons.value,
        daysSum = +restDays.value,
        total = 0;

    totalValue.innerHTML = 0;

    persons.addEventListener('input', function() {
        this.value = this.value.replace(/[\D]|^0/g, '');
        personsSum = +this.value;

        total = (daysSum + personsSum) * 4000;

        if (restDays.value == '' || persons.value == '') {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    restDays.addEventListener('input', function() {
        this.value = this.value.replace(/[\D]|^0/g, '');
        daysSum = +this.value;

        total = (daysSum + personsSum) * 4000;

        if (persons.value == '' || restDays.value == '') {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    place.addEventListener('change', function() {
        if (restDays.value == '' || persons.value == '') {
            totalValue.innerHTML = 0;
        } else {
            let a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }
    });

});