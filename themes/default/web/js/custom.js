var view_class='';
$(document).ready(function(){
	$('body').on('click', '.my-btn--compare,.page-box-content .refresh-icon', function (e) {
        e.preventDefault();
        var el = $(this);
        var data = {'Product[id]': el.data('product-id')};
        data[yupeTokenName] = yupeToken;
        $.ajax({
            url: '/cart/addcomparsion',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
				$("#notifications").html(data.data).fadeIn(600).delay(1500).fadeOut(600);
				$('#comparsion-block').load($('#comparsion-block').data('comparsion-widget-url'));
            }
        });
    });

	$('body').on('click', '.js-del-slide', function (e) {
        e.preventDefault();
        var el = $(this);
        var data = {'id': el.attr('position-id')};
        data[yupeTokenName] = yupeToken;
        $.ajax({
            url: '/cart/deletecomparsion',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
				el.parents('.compare-slider__slide').remove();
            }
        });
    });	
	$('#sections-amount').change(function(){
		sections=$(this).val();
		$.post($(this).data('url'),{
			'sections': sections,
			'install_type': $('.install-types option:selected').val(),
			'CSRF_TOKEN': yupeToken
		}, function (response) {
			$('#product-price-total').html(response.price);
		}, 'json');		
	});
	$('.install-types').change(function(){
		install_types=$(this).val();
		$.post($(this).data('url'),{
			'sections': $('#sections-amount').val(),
			'install_type': install_types,
			'CSRF_TOKEN': yupeToken
		}, function (response) {
			$('#product-price-total').html(response.price);
		}, 'json');				
	});
	sort="price.desc";
	$(document).on('change','#sort-variants',function(){
		sort=$(this).val();
		sortAttr=$(this).attr("data-sort");
		$.fn.yiiListView.update("product-list",{data:{sortAttr:sortAttr,sort:sort}});  
	});

    /*header nav*/
   $('.js-nav-btn').on('click',function(e){
        e.preventDefault();
        $('.js-nav-content').slideToggle(300);
    });

   $(document).on('click','.js-dropdown-btn',function(e){
        e.preventDefault();
        $(this).toggleClass('active');
		$(this).siblings('.js-dropdown-content').slideToggle(300);        
    });




    //////tabs
    $(function () {
        $('[data-container="tabs"]').each(function () {
            var $this = $(this);

            $this.find('[data-section="tabs"]').eq(0).addClass('is-active');
            $this.find('[data-action="tabs"]').eq(0).addClass('is-active');
        });

        $(document).on('click', '[data-action="tabs"]', function () {
            var $action = $(this),
                $container = $action.closest('[data-container="tabs"]'),
                $section = $('[data-section="tabs"]', $container);

            $action.addClass('is-active').siblings('[data-action="tabs"]').removeClass('is-active');
            $section.removeClass('is-active').siblings('[data-id="' + $action.data('type') + '"]').addClass('is-active');
        });
    });

    //custom form
    $('.select-wrap select,.product-desc__choose-box input[type="number"]').styler();



    $(".js-popup").fancybox({
        padding:0
    });

    $(".js-gallery").fancybox({
		btnTpl:{
			close:"<button data-fancybox-close=\"\" class=\"fancybox-button fancybox-button--close\" ><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z\"></path></svg></button>",
			arrowLeft:"<button data-fancybox-prev=\"\" class=\"fancybox-button fancybox-button--arrow_left\"><div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z\"></path></svg></div></button>",
			arrowRight:"<button data-fancybox-next=\"\" class=\"fancybox-button fancybox-button--arrow_right\" ><div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z\"></path></svg></div></button>",
		},
		infobar: false,
		buttons : ["close"],
    });



    $('.js-show-search-link').on('click' , function (e) {
        e.preventDefault();
        $(this).siblings('.js-show-search-content').slideDown();
    });

    $('.js-close-search').on('click' , function (e) {
        e.preventDefault();
        $(this).closest('.js-show-search-content').slideUp();
    });
    ///*toogle*/
    $('.js-toggle-btn').on('click',function(e){
        e.preventDefault();
        $(this).toggleClass('active');
        $(this).siblings('.js-toggle-content').slideToggle(300);
    });





    //var price1 = $("#price1").text();


    //Number(price1.replace(/\D+/g,''));






    //console.log(price1)


    //if ($(".sidebar li").hasClass("active")) {
    //    $(".sidebar li.active").find(".js-toggle-content").show();
    //}



    //function windowSize(){
    //    if (window.outerWidth < 1050){
    //        $('.catalog-nav__name').on('click',function(){
    //            $(this).siblings('.catalog-nav__menu').slideToggle(300);
    //        });
    //
    //        $('.catalog-nav__menu > li i').on('click',function(){
    //            $(this).siblings('.catalog-nav__menu > li ul').slideToggle(300);
    //            $(this).toggleClass("active");
    //        });
    //
    //        $('.basket-prev i').on('click',function(){
    //            $(".basket-prev__hidden").slideToggle(300);
    //            //$(this).toggleClass("active");
    //        });
    //
    //
    //    }
    //}
    //$(window).on('load resize',windowSize);


    if (window.outerWidth < 768){
        $('.products-list__box').removeClass('products-list__box--list');
    }




    //if (window.outerWidth < 768){
    if($('.header__bottom').length > 0){
        //fixed-block
        (function(){  // анонимная функция (function(){ })(), чтобы переменные "a" и "b" не стали глобальными
            var a = document.querySelector('.header__bottom'), b = null;  // селектор блока, который нужно закрепить
            window.addEventListener('scroll', Ascroll, false);
            document.body.addEventListener('scroll', Ascroll, false);  // если у html и body высота равна 100%
            function Ascroll() {
                if (b == null) {  // добавить потомка-обёртку, чтобы убрать зависимость с соседями
                    var Sa = getComputedStyle(a, ''), s = '';
                    for (var i = 0; i < Sa.length; i++) {  // перечислить стили CSS, которые нужно скопировать с родителя
                        if (Sa[i].indexOf('overflow') == 0 || Sa[i].indexOf('padding') == 0 || Sa[i].indexOf('border') == 0 || Sa[i].indexOf('outline') == 0 || Sa[i].indexOf('box-shadow') == 0 || Sa[i].indexOf('background') == 0) {
                            s += Sa[i] + ': ' +Sa.getPropertyValue(Sa[i]) + '; '
                        }
                    }
                    b = document.createElement('div');  // создать потомка
                    b.style.cssText = s + ' box-sizing: border-box; width: ' + a.offsetWidth + 'px;';
                    a.insertBefore(b, a.firstChild);  // поместить потомка в цепляющийся блок первым
                    var l = a.childNodes.length;
                    for (var i = 1; i < l; i++) {  // переместить во вновь созданного потомка всех остальных потомков (итого: создан потомок-обёртка, внутри которого по прежнему работают скрипты)
                        b.appendChild(a.childNodes[1]);
                    }
                    a.style.height = b.getBoundingClientRect().height + 'px';  // если под скользящим элементом есть другие блоки, можно своё значение
                    a.style.padding = '0';
                    a.style.border = '0';  // если элементу присвоен padding или border
                }
                if (a.getBoundingClientRect().top <= 0) { // elem.getBoundingClientRect() возвращает в px координаты элемента относительно верхнего левого угла области просмотра окна браузера
                    b.className = 'sticky';
                } else {
                    b.className = '';
                }
                window.addEventListener('resize', function() {
                    a.children[0].style.width = getComputedStyle(a, '').width
                }, false);  // если изменить размер окна браузера, измениться ширина элемента
            }
        })();
    }
    //}





    /*slider-gallery*/
    // $('.js-gallery').fancybox({
    //    padding:10
    //});



	// var scrollTo = function() {
     //   var anchor = $(this).attr("href");
     //   var hAnchor = $(anchor).offset().top;
        //скролим
   //     $('html,body').animate( { scrollTop: hAnchor }, 700 );
  //      return false;
 //   };
 //   $(function(){
 //       $('.navigation a').on('click', scrollTo);
  //  });
	
	
	

    //считаем слайды
    //var $status = $('.pagingInfo');
    //var $slickElement = $('.slideshow');
    //
    //$slickElement.on('init reInit afterChange', function (event, slick, currentSlide) {
    //    //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
    //    var i = (currentSlide ? currentSlide : 0) + 1;
    //    $status.text(i + '/' + slick.slideCount);
    //});
    //
    //$slickElement.slick({
    //    autoplay: false,
    //    dots: false
    //});




    ///*main-slider*/
    //$('.js-main-slider').slick({
    //  //  autoplay: true,
    //  //  autoplaySpeed: 3000,
    //  //  slidesToShow: 6,
    //   //     slidesToScroll: 1,
    //   //     responsive: [
    //    //    {
    //    //        breakpoint: 1200,
    //     //       settings: {
    //     //           slidesToShow: 4,
    //    //            slidesToScroll: 1
    //    //        }
    //    //    },
    //     //   {
    //     //       breakpoint: 991,
    //     //       settings: {
    //      //          slidesToShow: 3,
    //      //          slidesToScroll: 1
    //     //       }
    //     //   },
    //     //   {
    //      //      breakpoint: 768,
    //      //      settings: {
    //      //          slidesToShow: 1,
    //      //          slidesToScroll: 1
    //     //       }
    //    //    }
    //    //],
    //       // focusOnSelect :  true
//	 prevArrow: '<button class="slider-nav-btn  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
  //      nextArrow: '<button class="slider-nav-btn slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',,
    //    //fade: false,
    //    arrows:true,
    //    dots:true
    //});



    $('.js-projects-slider').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        prevArrow: '<button class="slider-nav-btn  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:true,
        dots:false
    });


    $('.js-gallery-project').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ],
        prevArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:true,
        dots:false
    });


    $('.js-compare-slider').slick({
        autoplay: false,
        autoplaySpeed: 3000,
        slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        prevArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:true,
        accessibility:false,
        dots:false
    });











    $('.js-prod-slider').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        prevArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:true,
        dots:false

    });




    $('.js-product-slider-top').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
            slidesToScroll: 1,
        prevArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:false,
        dots:false,
        asNavFor: ".js-product-slider-bottom"
    });




    $('.js-product-slider-bottom').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ],
        focusOnSelect :  true,
        prevArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--no-bg slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:true,
        dots:false,
        asNavFor: ".js-product-slider-top"
    });









    $('.js-our-clients').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 5,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        prevArrow: '<button class="slider-nav-btn slider-nav-btn--light  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--light slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:true,
        dots:false
    });




    $('.js-review-slider').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        prevArrow: '<button class="slider-nav-btn  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:true,
        dots:false
    });


    $('.js-articles-slider').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        prevArrow: '<button class="slider-nav-btn slider-nav-btn--light  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--light  slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:true,
        dots:false
    });

    ///*main-slider*/
    $('.js-main-slider').slick({
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
	    prevArrow: '<button class="slider-nav-btn  slider-nav-btn--left" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow: '<button class="slider-nav-btn slider-nav-btn--right" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        arrows:false,
        dots:true
    });



    $('.js-sort-view a').each(function(){
        $(this).on('click' , function (e) {
            e.preventDefault();

            $('.js-sort-view a').removeClass('active')
            $(this).addClass('active');
        })
    });

    $(document).on('click',".js-list" , function (e) {
        e.preventDefault();
        $(this).closest('.products-list__one #product-list').find('.products-list__box').addClass('products-list__box--list');
		view_class='products-list__box--list';
		$(this).addClass('active');
		$('.js-table').removeClass('active');
    });

    $(document).on('click',".js-table" , function (e) {
        e.preventDefault();
        $(this).closest('.products-list__one #product-list').find('.products-list__box').removeClass('products-list__box--list');
		view_class='';
		$(this).addClass('active');
		$('.js-list').removeClass('active');		
    });


    ///   scroll   /
    //var scrollTo = function() {
    //    var anchor = $(this).attr("href");
    //    var hAnchor = $(anchor).offset().top;
    //    //скролим
    //    $('html,body').animate( { scrollTop: hAnchor }, 700 );
    //    return false;
    //};
    //$(function(){
    //    $('.navigation a').on('click', scrollTo);
    //});
    //
    //
    //$('.navigation-menu').on('click',function(){
    //    $('.navigation').slideToggle();
    //});
    //$('.navigation li a').on('click',function(){
    //    $('.navigation').slideUp();
    //});


    //$('.catalog-section__content-col:gt(3)').css('display' , 'none');
    //$('.js-show-more').on('click' , function(e){
    //    e.preventDefault();
    //    $('.catalog-section__content-col:gt(3)').slideToggle(300);
    //    $(this).toggleClass('active');
    //    if($(this).hasClass('active')){
    //        $(this).html('свернуть');
    //    }else{
    //        $(this).html('Показать все');
    //    }
    //});
    var heightHeader = $('.header').outerHeight();
    var heightFooter = $('.footer').outerHeight();
    var sumHeightFooterHeader = heightHeader+heightFooter

    $('.page-box-content').css(
        'min-height' , 'calc(100vh - ' + sumHeightFooterHeader+'px'
    )
	$(".js-review-popup").fancybox({
		padding: 0,
		type:'ajax',
		autoSize:true,
		wrapCSS: 'review-modal',
		beforeLoad: function () {
			var url = $(this.element).attr("data-url");
			this.href = url;
		},	
		btnTpl:{
			close:"<button data-fancybox-close=\"\" class=\"fancybox-button fancybox-button--close\" ><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z\"></path></svg></button>",
			arrowLeft:"<button data-fancybox-prev=\"\" class=\"fancybox-button fancybox-button--arrow_left\"><div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z\"></path></svg></div></button>",
			arrowRight:"<button data-fancybox-next=\"\" class=\"fancybox-button fancybox-button--arrow_right\" ><div><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z\"></path></svg></div></button>",
		},
		infobar: false,
		buttons : ["close"],	
	  baseTpl:
		'<div class="fancybox-container aaaddd" role="dialog" tabindex="-1">' +
		'<div class="fancybox-bg"></div>' +
		'<div class="fancybox-inner">' +
		'<div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div>' +
		'<div class="fancybox-toolbar">{{buttons}}</div>' +
		'<div class="fancybox-navigation">{{arrows}}</div>' +
		'<div class="fancybox-stage"></div>' +
		'<div class="fancybox-caption"></div>' +
		"</div>" +
		"</div>",	
	});
});
function feedbackSendForm(form, data, hasError) {
	$('#notifications').html("");
    $.ajax({
        url: form[0].action,
        type: 'POST',
		dataType: 'json',
        data: form.serialize(),
        success: function (response) {
            if (response.result) {
                document.getElementById($(form[0]).attr('id')).reset();
				$('#notifications').html(response.data);
            }else{
				$('#notifications').append('<ul class="text-left"></ul>');
				$.each(response.data,function(e,k){
					$('#notifications').find('ul').append('<li>'+k+'</li>');
				});
			}
			$('#notifications').fadeIn().delay(3000).fadeOut();
        },
        error: function () {
        }
    });
    return false;
}
function reviewSend(form, data, hasError) {
	var formData = new FormData($('#review-form')[0]);
	$('#notifications').html("");
    $.ajax({
        url: form[0].action,
        type: 'POST',
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
        success: function (response) {
            if (JSON.parse(response).result) {
                document.getElementById($(form[0]).attr('id')).reset();
				$('#notifications').html(JSON.parse(response).data);
            }else{
				$('#notifications').append('<ul class="text-left"></ul>');
				$.each(JSON.parse(response).data,function(e,k){
					$('#notifications').find('ul').append('<li>'+k+'</li>');
				});
			}
			$('#notifications').fadeIn().delay(3000).fadeOut();
        },
        error: function () {
        }
    });
    return false;
}
function projectSendForm(form, data, hasError) {
	$('#notifications').html("");
    $.ajax({
        url: form[0].action,
        type: 'POST',
		dataType: 'json',
        data: form.serialize(),
        success: function (response) {
            if (response.result) {
                document.getElementById($(form[0]).attr('id')).reset();
				$('#notifications').html(response.data);
            }else{
				$('#notifications').append('<ul class="text-left"></ul>');
				$.each(response.data,function(e,k){
					$('#notifications').find('ul').append('<li>'+k+'</li>');
				});
			}
			$('#notifications').fadeIn().delay(3000).fadeOut();
        },
        error: function () {
        }
    });
    return false;
}
function init(map) {
	if(document.getElementById(map)==null){
		return false;
	}
	myMap = new ymaps.Map(map, {
		center: [55.753994, 37.622093],
		zoom: 9
	});
	myMap.behaviors.disable('scrollZoom'); 
	ymaps.geocode(scheme_address, {
		results: 1
	}).then(function (res) {
			var firstGeoObject = res.geoObjects.get(0),
				coords = firstGeoObject.geometry.getCoordinates(),
				bounds = firstGeoObject.properties.get('boundedBy');
			firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
			firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());
			myMap.geoObjects.add(firstGeoObject);
			myMap.setBounds(bounds, {
				checkZoomRange: true
			});
			$('#'+map).addClass('active');
		});
}