﻿
// Изначально был выбран вариант парсинга txt-файла со словарём и внесением данных в массив, однако оказалось сложным сделать этот метод полностью кросс-браузерным без node.js
// Поэтому был выбран вариант добавления данных в код. Для голосового ввода использована библиотека webspeechkit.js


var lastLetter;

var historyBlock = [],
    histor = [];

var towns = ['Абакан','Агинское','Агрыз','Азов','Айхал','Алапаевск','Алдан','Александров','Алексеевка','Альметьевск','Амурск',
    'Анадырь','Анапа','Ангарск','Андижан','Ахалцихе','Аксай','Актау','Актюбинск','Алма-Ата','Аркалык','Астана','Атбасар','Апатиты',
    'Арзамас','Армавир','Арсеньев','Артём','Архангельск','Асбест','Асино','Астрахань','Ачинск','Аша','Балаково','Балахна','Балашов',
    'Барнаул','Белгород','Белебей','Белово','Белокуриха','Белорецк','Белореченск','Белоярский','Березники','Бийск','Билярск','Биробиджан',
    'Благовещенск','Бобров','Богучар','Бологое','Борисоглебск','Боровичи','Бородино','Братск','Брянск','Бугульма','Бугуруслан','Бузулук',
    'Буй','Байконур','Балхаш','Баку','Батуми','Барановичи','Березино','Бобруйск','Брагин','Браслав','Брест','Бухара','Бишкек','Валдай',
    'Ванадзор','Витебск','Воложин','Владивосток','Владикавказ','Владимир','Волгоград','Волгодонск','Вологда','Волоколамск','Воркута','Воронеж',
    'Воскресенск','Воткинск','Выборг','Выкса','Вытегра','Вышний Волочёк','Вязьма','Вятские Поляны','Гагарин','Галич','Гдов','Геленджик',
    'Глазов','Гурьев','Гори','Гюмри','Гомель','Гродно','Горно-Алтайск','Грозный','Губкин','Губкинский','Гуково','Гусь-Хрустальный','Дальнегорск',
    'Дальнереченск','Дербент','Дзержинск','Димитровград','Дмитров','Домодедово','Джамбул','Джезказган','Джетыгара','Джелал-Абад','Душанбе',
    'Егорьевск','Екатеринбург','Ейск','Елабуга','Елец','Енисейск','Ессентуки','Ефремов','Ереван','Железногорск','Жлобин','Заводоуковск',
    'Зарайск','Заринск','Зеленогорск','Златоуст','Зыряновск','Зестафони','Зугдиди','Ибреси','Иваново','Ижевск','Ирбит','Иркутск','Истра','Ишим',
    'Йошкар-Ола','Казань','Калининград','Калуга','Каменка','Каменск','Камень-на-Оби','Камышин','Кандалакша','Каневская','Канск','Карасук',
    'Карачаевск','Карпинск','Касимов','Качканар','Кемерово','Кизилюрт','Кингисепп','Кинешма','Киров','Кировск','Кисловодск','Кутаиси','Карши',
    'Копыль','Коканд','Карабалык','Караганда','Кзыл-Орда','Кокчетав','Кустанай','Каракол','Ковдор','Ковров','Когалым','Коломна','Колпашево',
    'Кольчугино','Комсомольск-на-Амуре','Костомукша','Кострома','Котлас','Красновишерск','Красногорск','Краснодар','Краснокаменск','Красноярск',
    'Кропоткин','Кувандык','Кудымкар','Кузнецк','Куйбышев','Кумертау','Кунгур','Курган','Курск','Кущёвская','Кызыл','Кыштым','Лабинск',
    'Лазоревское','Лангепас','Лесосибирск','Ливны','Ликино-Дулёво','Липецк','Лиски','Луга','Лысьва','Людиново','Лянтор','Лисаковск','Луки','Минск',
    'Могилёв','Мозырь','Мстиславль','Мядель','Магадан','Магнитогорск','Майкоп','Максатиха','Малая Вишера','Махачкала','Мегион','Междуреченск',
    'Миасс','Минусинск','Мирный','Михайловка','Мичуринск','Можайск','Можга','Мончегорск','Моршанск','Москва','Мосолово','Муравленко','Мурманск',
    'Муром','Мценск','Надым','Назарово','Назрань','Нальчик','Наро-Фоминск','Нарьян-Мар','Находка','Невинномысск','Нерюнгри','Нефтекамск','Нефтеюганск',
    'Нижневартовск','Нижнекамск','Нижнеудинск','Новгород','Никольск','Новокузнецк','Новомосковск','Новороссийск','Новосибирск','Новотроицк',
    'Новоуральск','Новочеркасск','Новый Уренгой','Ногинск','Норильск','Ноябрьск','Нягань','Нарын','Навои','Орша','Осиповичи','Осиповка','Ош',
    'Обнинск','Озёрск','Октябрьский','Омск','Омутнинск','Орёл','Оренбург','Орехово-Зуево','Орск','Островной','Отрадная','Очёр','Павловский Посад',
    'Пангоды','Пенза','Первоуральск','Переславль-Залесский','Пермь','Петрозаводск','Петропавловск-Камчатский','Подольск','Покачи','Приозерск',
    'Прокопьевск','Псков','Пятигорск','Павлодар','Петропавловск','Поти','Пинск','Полоцк','Риддер','Рыбачье','Радужный','Раменское','Ржев','Родники',
    'Россошь','Ростов-на-Дону','Рубцовск','Рыбинск','Рязань','Салават','Салехард','Сальск','Самара','Санкт-Петербург','Саранск','Сарапул','Саратов',
    'Саров','Сатка','Саяногорск','Северодвинск','Североуральск','Сегежа','Селижарово','Семёнов','Серов','Серпухов','Скопин','Славгород','Смоленск',
    'Снежинск','Советск','Совгань','Соликамск','Сочи','Ставрополь','Старый Оскол','Стерлитамак','Стрежевой','Ступино','Суворов','Сургут','Сухиничи',
    'Сызрань','Сыктывкар','Сарыагач','Семипалатинск','Степногорск','Самтредиа','Самарканд','Сухуми','Судженск','Свислочь','Слоним','Сметаничи',
    'Солигорск','Талды-Курган','Талас','Термез','Ташкент','Темиртау','Туркестан','Тбилиси','Тагил','Таганрог','Талдом','Тамбов','Тбилисская','Тверь',
    'Темрюк','Тихвин','Тихорецк','Тобольск','Тольятти','Томск','Тотьма','Туапсе','Тула','Тулун','Туринск','Тында','Тюмень','Углич','Ужур','Улан-Удэ',
    'Ульяновск','Уни','Урай','Усинск','Усолье-Сибирское','Уссурийск','Усть-Илимск','Усть-Мая','Уфа','Ухта','Уральск','Усть-Каменогорск','Ургенч',
    'Улан-Батор','Устюг','Уфалей','Хабаровск','Ханты-Мансийск','Холмск','Хромтау','Худжанд','Цхинвали','Чимкент','Чолпон-Ата','Чайковский','Чапаевск',
    'Чебоксары','Челябинск','Череповец','Черкесск','Черногорск','Чернушка','Черняховск','Чистополь','Чита','Чусовой','Шадринск','Шарья','Шарыпово',
    'Шатура','Шахты','Шемордан','Шумиха','Щучинск','Электросталь','Элиста','Экибастуз','Эрдэнэт','Югорск','Южно-Сахалинск','Южноуральск','Юрга','Юрюзань',
    'Якутск','Ярославль','Ярцево'];


function checkAnswer() {
    var answer,
        ans = document.querySelector('input[id="answer"]:valid').value;

        // исправляем баг с голосовым вводом (пробел в конце)
    if ( ans.charAt(ans.length - 1) === ' ' ) { ans = ans.slice(0, -1); }

        // определяем первую и последнюю букву введённого слова
    var answerFirstLetter = ans.charAt(0).toLowerCase(),
        answerLastLetter = ans.charAt(ans.length - 1);

    if( isException(answerLastLetter) ) {
        answerLastLetter = ans.charAt(ans.length - 2).toUpperCase();
    } else {
        answerLastLetter = answerLastLetter.toUpperCase();
    }

        // определяем первый ли город, если нет - определяем последнюю букву всей цепочки
    if ( histor.length > 0 ){
        lastLetter = histor[histor.length - 1].charAt(histor[histor.length - 1].length - 1);
        if( isException(lastLetter) ){
            lastLetter = histor[histor.length - 1].charAt(histor[histor.length - 1].length - 2);
        }
    }

        // если последняя буква цепочки не совпадает с первой введённого слова, выдаём ошибку
    if ( histor.length > 1 && answerFirstLetter !==  lastLetter) {

        switchStyle('#FCE0DB');
        document.getElementById('comp_answer').innerHTML = "<b style='color: red;'>Город должен начинаться с буквы " + lastLetter.toUpperCase() +"!</b>";

        // если город уже был, сообщаем
    } else if ( histor.length > 1 && isUsed(ans) ) {

        switchStyle('#FCE0DB');
        document.getElementById('comp_answer').innerHTML = "<b style='color: red;'>Этот город уже был!</b>";

        // если совпадает - запускаем обработку
    } else if (histor.length < 1 || answerFirstLetter ===  lastLetter) {
        histor.push(ans);
        document.querySelector('input[id="answer"]').value = '';
        answer = ans;
        placeAndRender(answer);
        postApp();
    }

    function postApp() {

        var humanAnswer = '<span style="color:green">' + answer.charAt(0).toUpperCase() + answer.slice(1) + '</span><br>'
        historyBlock.push(humanAnswer);

        for (i = 0; i < towns.length; i++) {

                // удаляем из словаря города игрока, если такие есть
            if ( answer.toLowerCase() === towns[i].toLowerCase() ) {
                towns.splice(i, 1);
            }

                // ищем совпадения
            if (answerLastLetter === towns[i].charAt(0)) {

                placeAndRender(towns[i]);

                document.getElementById('comp_answer').innerHTML = towns[i];

                switchStyle('#DCF9DC');

                historyBlock.push('<span style="color:red">' + towns[i] + '</span><br>');
                histor.push(towns[i]);

                towns.splice(i, 1);
                break;

                // если прошел весь цикл и не было ни одного подходящего города - победа игрока
            } else if (answerLastLetter !== towns[i].charAt(0) && i === towns.length - 1) {
                switchStyle('#DCF9DC');
                document.getElementById('comp_answer').innerHTML = "<b style='color: green;'>Вы победили... Всего городов: " + histor.length + "</b>";
                document.getElementById('send').disabled = true;
            }
        }

            // вывод истории игры
        document.getElementById('history_cell').innerHTML = historyBlock.join('');
    }

    // функция проверки последней бувы слова
    function isException(letter) {
        if( letter === 'ё' ||
            letter === 'й' ||
            letter === 'ъ' ||
            letter === 'ы' ||
            letter === 'ь' ||
            letter === 'э' ){
            return true;
        }
    }

    // функция проверки города на повторение
    function isUsed(town) {
        for ( i = 0 ; i < histor.length ; i++ ){
            if ( town.toLowerCase() === histor[i].toLowerCase() ){
                return true;
            }
        }
    }

    // функция установки метки и рендера видимой области
    function placeAndRender(obj) {
        var myGeocoder = ymaps.geocode(obj);
        myGeocoder.then(
            function (res) {
                myMap.geoObjects.add(res.geoObjects.get(0));
                myMap.setBounds(myMap.geoObjects.getBounds());
            },
            function (err) {
                return false;
            }
        );
    }

    // функция смена фона
    function switchStyle(param) {
        document.getElementsByClassName('comp-answer')[0].style.backgroundColor = param;
    }
}