$(document).ready(function () { "use strict";
    // Prevent action on clicking on empty links
    $('a[href="#"]').on('click', function (e) { e.preventDefault(); });

    $('#menu_switcher').click(function (event) {
        $('._header nav > ul').toggleClass('opened');
    });

    $('.default-slider').slick();

    $('.showcase.slider').slick({
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });
    $('.item-cover').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.item-nav',
        adaptiveHeight: true
    });
    $('.item-nav').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.item-cover',
        dots: true,
        centerMode: false,
        focusOnSelect: true
    });

    $('.js-select').select2({
        language: 'ru',
        minimumResultsForSearch: Infinity
    });

    let datepicker = new Datepicker('#delivery_date');

    $('.accordion h5').click(function (item) {
        let _t = $(this);

        _t.toggleClass('opened');
        _t.parent().find('.description').slideToggle();
        console.log('click');
    });

    let totalPrice = $('.basket .total-price span');
    $('.basket .counter .fa-fw').click(function (item) {
        let _t = $(this),
            parent = _t.closest('.item'),
            counter = parent.find('.counter span'),
            price = parent.find('.price span'),
            counterInput = parent.find('input[name="count"]'),
            priceInput = parent.find('input[name="price"]'),
            count = counter.text(),
            answer = false,
            total = price.text();

        if (_t.hasClass('fa-minus-circle') && 1 < count) {
            answer = +count - 1;
            total = (+total / count) * answer;
        } else if (_t.hasClass('fa-plus-circle')) {
            answer = +count + 1;
            total = answer * (+total / count)
        }

        if (answer) {
            counter.text(answer);
            counterInput.val(answer);
            price.text(total)
            priceInput.val(total)
            calculateTotalBasketSum();
        }
    });

    function calculateTotalBasketSum() {
        let sum = 0;
        $('.basket .item .price span').each(function (item) { sum += +$(this).text() })
        totalPrice.text(sum);
    } calculateTotalBasketSum();

    $('.basket').on('click', '.basket-remove', function () { $(this).closest('.item').remove() });

    $('.item[data-options]').each(function (item) {
        let _t = $(this),
            propertiesField = _t.find('.options')[0],
            propertiesHtml = document.createElement('ul'),
            data = JSON.parse(_t.attr('data-options')),
            count = 0;

        for (let property of Object.keys(data)) {
            let li = document.createElement('li'),
                price = '',
                html = '';

            if (typeof data[property] === 'string') {
                price = data[property];
                html = property;
            } else {
                price = data[property].price;
                html = property +'<span>'+ data[property].info +'</span>';
            }

            if (1 === ++count) {
                li.setAttribute('class', 'active');
                propertiesHtml.setAttribute('data-default-price', price);
            }

            li.setAttribute('data-price', price);
            li.innerHTML = html;

            propertiesHtml.appendChild(li);
        }

        propertiesField.appendChild(propertiesHtml);
    });

    $('.options').on('click', 'li', function(event) {
        let _t = $(this),
            optionsList = _t.parent(),
            price = _t.attr('data-price');

        _t.closest('.item').find('.price')[0].innerText = price;

        optionsList.find('li').removeClass('active');
        _t.addClass('active');

        console.log('click!');
    });

    /**
     * ---------------- *
     * Favourites logic *
     * ---------------- *
     */
    let favourites = $('.favourite'),
        favouritesTotal = $('#favourites-total'),
        favouriteData = localStorage.getItem('favourites') ?? []; // Here store array of IDs

    if (typeof favouriteData === 'string') favouriteData = JSON.parse(favouriteData);

    favouriteData.forEach(function (id) { favourites.find('[data-id='+ id +']').addClass('red') });

    $('.favourite a').click(function (event) { event.preventDefault();
        let _t = $(this),
            id = _t.attr('data-id'),
            favouriteClass = $('.favourite a[data-id='+ id +']'),
            index = alreadyInFavourite(id);

        if (-1 !== index) {
            favouriteData.splice(index, 1);
            favouriteClass.removeClass('red');
        } else {
            favouriteData.push(id);
            favouriteClass.addClass('red');
        }

        setNumberToHeart(favouriteData.length);

        localStorage.setItem('favourites', JSON.stringify(favouriteData, null, 2));
    });

    function alreadyInFavourite(id) {
        for (let i = 0; i < favouriteData.length; i++) {
            if (-1 !== favouriteData[i].indexOf(id)) return i;
        }

        return -1;
    }

    function setNumberToHeart(number) {
        if (1 > number) {
            favouritesTotal.fadeOut();
        } else {
            favouritesTotal.fadeIn(100);
            favouritesTotal.text(number);
        }

    } setNumberToHeart(favouriteData.length);
});