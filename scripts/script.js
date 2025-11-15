/**************************************************** 
 * Определение с какого устройства открывается сайт
*/

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i)
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows()
        );
    }
};

/**************************************************** */

if (isMobile.any()) {
    document.body.classList.add('_touch')

    let menuArrows = document.querySelectorAll('.menu__arrow');
    if (menuArrows.length > 0)
        for (let index = 0; index < menuArrows.length; index++) {
            const menuArrow = menuArrows[index];
            menuArrow.addEventListener('click', function (e) {
                menuArrow.parentElement.classList.toggle('_active');
            })
        }
} else {
    document.body.classList.add('_pc')
}

// Прокрутка к разделам

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener('click', onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY - document.querySelector('header').offsetHeight;

            if (iconMenu.classList.contains('_active')) {
                document.body.classList.remove('_lock')
                iconMenu.classList.remove('_active');
                menuBody.classList.remove('_active');
            }

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }
}

/********************************************** */
// Меню

const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
    iconMenu.addEventListener('click', function (e) {
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    });
}

/********************************************** */

const form = document.getElementById('calcForm');
const resultBlock = document.getElementById('result');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const gender = form.gender.value; // 'male' или 'female'
    const age = parseInt(form.age.value, 10);
    const weight = parseFloat(form.weight.value);
    const height = parseFloat(form.height.value);
    const activity = parseFloat(form.activity.value);
    const goal = form.goal.value;

    // ==== BMR ====
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // ==== TDEE (поддержание веса) ====
    let tdee = bmr * activity;

    // ==== Цель: сушка или набор массы ====
    let targetCalories = tdee;
    if (goal === 'loss') {
        targetCalories -= 500; // дефицит
    } else if (goal === 'gain') {
        targetCalories += 500; // профицит
    }

    // ==== Расчёт БЖУ ====
    const protein = Math.round(weight * 2); // 2 г белка на кг веса
    const fat = Math.round(gender === 'male' ? weight * 1 : weight * 0.9); // жиры

    let carbsCalories = targetCalories - (protein * 4 + fat * 9);
    let carbs = Math.round(carbsCalories / 4);

    // ==== Минимум углеводов ====
    if (carbs < 100) {
        carbs = 100;
        carbsCalories = carbs * 4;
        targetCalories = protein * 4 + fat * 9 + carbsCalories; // корректируем общую калорийность
    }

    // ==== Округляем калории ====
    const calories = Math.round(targetCalories);

    // ==== Вывод результата с калорийностью БЖУ ====
    resultBlock.innerHTML = `
        <h2>Результаты расчёта:</h2>
        <div class="result-row"><span>Калории:</span> <strong>${calories}</strong></div>
        <div class="result-row"><span>Белки (г):</span> <strong>${protein} (${protein * 4} ккал)</strong></div>
        <div class="result-row"><span>Жиры (г):</span> <strong>${fat} (${fat * 9} ккал)</strong></div>
        <div class="result-row"><span>Углеводы (г):</span> <strong>${carbs} (${carbs * 4} ккал)</strong></div>
    `;
});
