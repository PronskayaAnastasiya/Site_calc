import { priceFormatter } from "./formatters.js";
import { priceFormatterDecimals } from "./formatters.js";

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
    //Общая сумма кредита
    const totalAmount = cleaveCost.getRawValue() - cleaveDownPayment.getRawValue();
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

const sliderCost = document.getElementById('slider-cost');
noUiSlider.create(sliderCost, {
    start: 12000000,
    connect: 'lower',
    step: 100000,
    tooltips: true,
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

sliderCost.noUiSlider.on('update', function () {
    const sliderValue = sliderCost.noUiSlider.get();
    inputCost.value = sliderValue;
    calcMortgage();
}); 