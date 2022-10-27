import { priceFormatter } from "./formatters.js";
import { priceFormatterDecimals } from "./formatters.js";

const maxPrice = 100000000;

//Инпуты
const inputCost = document.querySelector('#input-cost');
const inputDownPayment = document.querySelector("#input-downpayment");
const inputTerm = document.querySelector('#input-term')
const form = document.querySelector('#form');
const totalCost = document.querySelector('#total-cost');
const totalMonthPayment = document.querySelector("#total-month-payment");

//console.log(inputCost, inputDownPayment, inputTerm);


//Cleave опции форматирования 
const cleavePriceSetting = {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: ' '
};

//Запускаем форматрирование cleave
const cleaveCost = new Cleave(inputCost, cleavePriceSetting);
const cleaveDownPayment = new Cleave(inputDownPayment, cleavePriceSetting);
const cleaveTerm = new Cleave(inputTerm, cleavePriceSetting);

//Сумма кредита
calcMortgage()

//Отображениеи рссчет суммы кредита 
form.addEventListener('input', function () {
    //Сумма кредита
    calcMortgage();
});

function calcMortgage() {

    let cost = cleaveCost.getRawValue();
    if (cost > maxPrice) {
        cost = maxPrice;
    }
    //Общая сумма кредита
    const totalAmount = cost - cleaveDownPayment.getRawValue();
    totalCost.innerText = priceFormatter.format(totalAmount);

    //Ставка по кредиту
    const creditRate = +document.querySelector('input[name="program"]:checked').value;
    const monthRate = creditRate / 12;
    console.log(monthRate);

    //Срок ипотеки
    const years = +cleaveTerm.getRawValue();
    const months = years * 12;

    //Рассчет ежемесячного платежа
    const monthPayment = (totalAmount * monthRate) / (1 - (1 + monthRate) * (1 - months));

    //Отображение ежемесячногоплатежа
    totalMonthPayment.innerText = priceFormatterDecimals.format(monthPayment);
}


//SliderCost
const sliderCost = document.getElementById('slider-cost');
noUiSlider.create(sliderCost, {
    start: 12000000,
    connect: 'lower',
    step: 100000,
    //tooltips: true,
    range: {
        'min': 0,
        '50%': [10000000, 1000000],
        'max': 100000000
    },
    format: wNumb({
        decimals: 0,
        thousand: ' ',
        suffix: '',
    })
});
sliderCost.noUiSlider.on('slide', function () {
    const sliderValue = sliderCost.noUiSlider.get();
    inputCost.value = sliderValue;
    calcMortgage();
});


//Slider Downpayment
const sliderDownpayment = document.getElementById('slider-downpayment');
noUiSlider.create(sliderDownpayment, {
    start: 498000,
    connect: 'lower',
    step: 100000,
    //tooltips: true,
    range: {
        'min': 0,
        'max': 1000000
    },
    format: wNumb({
        decimals: 0,
        thousand: ' ',
        suffix: '',
    })
});
sliderDownpayment.noUiSlider.on('slide', function () {
    const sliderValue = sliderDownpayment.noUiSlider.get();
    inputDownPayment.value = sliderValue;
    calcMortgage();
});

//Slider Term
const sliderTerm = document.getElementById('slider-term');
noUiSlider.create(sliderTerm, {
    start: 12,
    connect: 'lower',
    step: 1,
    tooltips: true,
    range: {
        'min': 1,
        'max': 30
    },
    format: wNumb({
        decimals: 0,
        thousand: ' ',
        suffix: '',
    })
});
sliderTerm.noUiSlider.on('slide', function () {
    const sliderValue = sliderTerm.noUiSlider.get();
    inputTerm.value = sliderValue;
    calcMortgage();
});


//Форматирование InputCost
inputCost.addEventListener('input', function () {
    const value = +cleaveCost.getRawValue();

    //Обновляем range slider
    sliderCost.noUiSlider.set(value);

    //Проверка на макс цену
    if (value > maxPrice) {
        inputCost.closest('.param__details').classList.add('param__details--error');
    } else {
        inputCost.closest('.param__details').classList.remove('param__details--error');
    }

    //Зависимость значений downpayment от input cost
    const percentMin = value * 0.15;
    const percentMax = value * 0.9;

    sliderDownpayment.noUiSlider.updateOptions({
        range: {
            min: percentMin,
            max: percentMax,
        },
    });


});

inputCost.addEventListener('change', function () {
    const value = +cleaveCost.getRawValue();
    if (value > maxPrice) {
        inputCost.closest('.param__details').classList.remove('param__details--error');
        cleaveCost.setRawValue(maxPrice);
    }
});