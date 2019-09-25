$(document).ajaxError(function () {

});

$(document).ready(function () {
    var cartWidgetSelector = '#shopping-cart-widget';
    var cartWidgetMenuSelector = '#shopping-cart-menu-widget';

    /*страница продукта*/
    var priceElement = $('#result-price'); //итоговая цена на странице продукта
    var basePrice = parseFloat($('#base-price').val()); //базовая цена на странице продукта
    var quantityElement = $('#product-quantity');

    /*корзина*/

    var shippingCostElement = $('#cart-shipping-cost');
    var cartFullCostElement = $('#cart-full-cost');
    var cartFullCostWithShippingElement = $('#cart-full-cost-with-shipping');

    function showNotify(element, result, message) {
        if ($.isFunction($.fn.notify)) {
            $("#notifications").notify({message: {text: message}, 'type': result}).show();
        }
    }

    function updatePrice() {
        var _basePrice = basePrice;
        var variants = [];
        var varElements = $('select[name="ProductVariant[]"]');
        /* выбираем вариант, меняющий базовую цену максимально*/
        var hasBasePriceVariant = false;
        $.each(varElements, function (index, elem) {
            var varId = elem.value;
            if (varId) {
                var option = $(elem).find('option[value="' + varId + '"]');
                var variant = {amount: option.data('amount'), type: option.data('type')};
                switch (variant.type) {
                    case 2: // base price
                        // еще не было варианта
                        if (!hasBasePriceVariant) {
                            _basePrice = variant.amount;
                            hasBasePriceVariant = true;
                        }
                        else {
                            if (_basePrice < variant.amount) {
                                _basePrice = variant.amount;
                            }
                        }
                        break;
                }
            }
        });
        var newPrice = _basePrice;
        $.each(varElements, function (index, elem) {
            var varId = elem.value;
            if (varId) {
                var option = $(elem).find('option[value="' + varId + '"]');
                var variant = {amount: option.data('amount'), type: option.data('type')};
                variants.push(variant);
                switch (variant.type) {
                    case 0: // sum
                        newPrice += variant.amount;
                        break;
                    case 1: // percent
                        newPrice += _basePrice * ( variant.amount / 100);
                        break;
                }
            }
        });

        priceElement.html(parseFloat(newPrice.toFixed(2)));
    }

    $('select[name="ProductVariant[]"]').change(function () {
        updatePrice();
    });


    $('.product-quantity-increase').click(function () {
        quantityElement.val(parseInt(quantityElement.val()) + 1);
    });

    $('.product-quantity-decrease').click(function () {
        if (parseInt(quantityElement.val()) > 1) {
            quantityElement.val(parseInt(quantityElement.val()) - 1);
        }
    });

    quantityElement.change(function (event) {
        var el = $(this);
        quantity = parseInt(el.val());

        if (quantity <= 0 || isNaN(quantity)) {
            quantity = 1;
        }
		price=parseInt($('#product-price').html());
		$('#product-price-total').html(price*quantity);
        el.val(quantity);
    });

    function updateCartWidget() {
        $(cartWidgetSelector).load($('#cart-widget').data('cart-widget-url'));
        $(cartWidgetMenuSelector).load($('#cart-menu-widget').data('cart-widget-url'));
    }

    $('#add-product-to-cart').click(function (e) {
        e.preventDefault();

        var button = $(this);
        var form = $(this).parents('form');
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: form.serialize(),
            url: form.attr('action'),
            success: function (data) {
                if (data.result) {
                    updateCartWidget();
                }
                showNotify(button, data.result ? 'success' : 'danger', data.data);
            }
        }).always(function () {
			id = button.attr("href");
			$(".js-product"+id)
				.clone()
				.css({'position' : 'absolute', 'z-index' : '11100', top: button.offset().top-5, left:button.offset().left-100})
				.appendTo("body")
				.animate({opacity: 0.05,
					left: $(".js-basket").offset().left-0,
					top: $(".js-basket").offset().top-0,
					width: 50}, 500, function() {
					$(this).remove();
				});					
        });
    });

    $('body').on('click', '.quick-add-product-to-cart', function (e) {
        e.preventDefault();
        var el = $(this);
        var data = {'Product[id]': el.data('product-id')};
        data[yupeTokenName] = yupeToken;
		
        id = el.attr("href");
        $(".js-product"+id)
            .clone()
            .css({'position' : 'absolute', 'z-index' : '11100', top: el.offset().top-5, left:el.offset().left-100})
            .appendTo("body")
            .animate({opacity: 0.05,
                left: $(".js-basket").offset().left-0,
                top: $(".js-basket").offset().top-0,
                width: 50}, 500, function() {
                $(this).remove();
            });		
		
        $.ajax({
            url: el.data('cart-add-url'),
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.result) {
                    updateCartWidget();
                }
                showNotify(el, data.result ? 'success' : 'danger', data.data);
            }
        });
    });


    /*cart*/

    function getCoupons() {
        var coupons = [];
        $.each($('.coupon-input'), function (index, elem) {
            var $elem = $(elem);
            coupons.push({
                code: $elem.data('code'),
                name: $elem.data('name'),
                value: $elem.data('value'),
                type: $elem.data('type'),
                min_order_price: $elem.data('min-order-price'),
                free_shipping: $elem.data('free-shipping')
            })
        });
        return coupons;
    }

    function updatePositionSumPrice(tr,data) {
        var count = parseInt(tr.find('.position-count').val());
        var price = parseFloat(tr.find('.position-price').text());
        // tr.find('.position-sum-price').html(price * count);
        tr.find('.position-sum-price').html(data.data.product_price);
        updateCartTotalCost();
    }

    function changePositionQuantity(productId, quantity, install, sections, tr) {
        var data = {'quantity': quantity, 'id': productId, 'install': install, 'sections': sections};
        data[yupeTokenName] = yupeToken;
        $.ajax({
            url: yupeCartUpdateUrl,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.result) {
                    updateCartWidget();
					updatePositionSumPrice(tr,data);
                }
            }
        });
    }

    $('.cart-quantity-increase').click(function () {
        var target = $($(this).data('target'));
        target.val(parseInt(target.val()) + 1).trigger('change');
    });

    $('.cart-quantity-decrease').click(function () {
        var target = $($(this).data('target'));
        if (parseInt(target.val()) > 1) {
            target.val(parseInt(target.val()) - 1).trigger('change');
        }
    });

    $('.cart-delete-product').click(function (e) {
        e.preventDefault();
        var el = $(this);
        var data = {'id': el.data('position-id')};
        data[yupeTokenName] = yupeToken;
        $.ajax({
            url: yupeCartDeleteProductUrl,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.result) {
                    el.parents('.basket-table__row').remove();
                    updateCartTotalCost();
                    if ($('.basket-table__row').length > 0) {
                        updateCartWidget();
                    } else {
                        $('#cart-body').html(yupeCartEmptyMessage);
                    }
                }
            }
        });
    });

    $('.position-count,.install-types-cart').change(function () {
        var tr = $(this).parents('.basket-table__row');
        var quantity = parseInt(tr.find('.position-count').val());
        var install = tr.find('.install-types-cart option:selected').val();
        var sections = tr.find('.sections_amount').val();
        var productId = tr.find('.position-id').val();
        if (quantity <= 0 || isNaN(quantity)) {
            quantity = 1;
            tr.find('.position-count').val(quantity);
        }

        // updatePositionSumPrice(tr);
        changePositionQuantity(productId, quantity, install, sections, tr);
    });
	/*$('.install-types-cart').change(function () {
        var tr = $(this).parents('.basket-table__row');
        var quantity = parseInt(tr.find('.position-count').val());
        var install = $(this).find('.install-types-cart option:selected').val();
        var productId = tr.find('.position-id').val();
        if (quantity <= 0 || isNaN(quantity)) {
            quantity = 1;
            tr.find('.position-count').val(quantity);
        }

        // updatePositionSumPrice(tr);
        changePositionQuantity(productId, quantity, install, tr);
    });*/

    $('input[name="Order[delivery_id]"]').change(function () {
        updateShippingCost();
    });

    function getCartTotalCost() {
        var cost = 0;
        $.each($('.position-sum-price'), function (index, elem) {
            cost += parseFloat($(elem).text());
        });
        var delta = 0;
        var coupons = getCoupons();
        $.each(coupons, function (index, el) {
            if (cost >= el.min_order_price) {
                switch (el.type) {
                    case 0: // руб
                        delta += parseFloat(el.value);
                        break;
                    case 1: // %
                        delta += (parseFloat(el.value) / 100) * cost;
                        break;
                }
            }
        });

        return delta > cost ? 0 : cost - delta;
    }

    function updateCartTotalCost() {
        cartFullCostElement.html(getCartTotalCost());
        refreshDeliveryTypes();
        updateShippingCost();
        updateFullCostWithShipping();
    }

    function refreshDeliveryTypes() {
        var cartTotalCost = getCartTotalCost();
        $.each($('input[name="Order[delivery_id]"]'), function (index, el) {
            var elem = $(el);
            var availableFrom = elem.data('available-from');
            if (availableFrom.length && parseFloat(availableFrom) >= cartTotalCost) {
                if (elem.prop('checked')) {
                    checkFirstAvailableDeliveryType();
                }
                elem.prop('disabled', true);
            } else {
                elem.prop('disabled', false);
            }
        });
    }

    function checkFirstAvailableDeliveryType() {
        $('input[name="Order[delivery_id]"]:not(:disabled):first').prop('checked', true);
    }


    function getShippingCost() {
		delivery_price=0;
		delivery=0;
		delivery_weight=0;
		$('.basket-table__row').each(function(a){
			weight=$(this).find('.product_weight').val();
			amount=$(this).find('.position-count').val();
			delivery_weight+=(weight*amount);
		});
		if(delivery_weight<50&&delivery_weight>0){
			delivery_price=500;
			delivery=500;
		}else if(delivery_weight>=50&&delivery_weight<100){
			delivery_price=1000;
			delivery=1000;
		}else if(delivery_weight>=100&&delivery_weight<200){
			delivery_price=1500;
			delivery=1500;
		}else if(delivery_weight>=200&&delivery_weight<500){
			delivery_price=2000;
			delivery=2000;
		}else{
			delivery_price='персональный расчёт';
			delivery=0;
		}		
		$('.delivery-price').html(delivery_price);
		return delivery;
        var cartTotalCost = getCartTotalCost();
        var coupons = getCoupons();
        var freeShipping = false;
        $.each(coupons, function (index, el) {
            if (el.free_shipping && cartTotalCost >= el.min_order_price) {
                freeShipping = true;
            }
        });
        if (freeShipping) {
            return 0;
        }
        var selectedDeliveryType = $('input[name="Order[delivery_id]"]:checked');
        if (!selectedDeliveryType[0]) {
            return 0;
        }
        if (parseInt(selectedDeliveryType.data('separate-payment')) || parseFloat(selectedDeliveryType.data('free-from')) <= cartTotalCost) {
            return 0;
        } else {
            return parseFloat(selectedDeliveryType.data('price'));
        }
    }

    function updateShippingCost() {
        shippingCostElement.html(getShippingCost());
        updateFullCostWithShipping();
    }

    function updateFullCostWithShipping() {
        cartFullCostWithShippingElement.html(getShippingCost() + getCartTotalCost());
    }

    refreshDeliveryTypes();
    //checkFirstAvailableDeliveryType();
    //updateFullCostWithShipping();
    //updateCartTotalCost();

    function updateAllCosts() {
        updateCartTotalCost();
    }

    checkFirstAvailableDeliveryType();
    updateAllCosts();

    $('#start-payment').on('click', function () {
        $('.payment-method-radio:checked').parents('.payment-method').find('form').submit();
    });

    $('body').on('click', '.clear-cart', function (e) {
        e.preventDefault();
        var data = {};
        data[yupeTokenName] = yupeToken;
        $.ajax({
            url: '/coupon/clear',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.result) {
                    updateCartWidget();
                }
            }
        });
    });

    $('#add-coupon-code').click(function (e) {
        e.preventDefault();
        var code = $('#coupon-code').val();
        var button = $(this);
        if (code) {
            var data = {'code': code};
            data[yupeTokenName] = yupeToken;
            $.ajax({
                url: '/coupon/add',
                type: 'post',
                data: data,
                dataType: 'json',
                success: function (data) {
                    if (data.result) {
                        window.location.reload();
                    }
                    showNotify(button, data.result ? 'success' : 'danger', data.data.join('; '));
                }
            });
            $('#coupon-code').val('');
        }
    });

    $('.coupon .close').click(function (e) {
        e.preventDefault();
        var code = $(this).siblings('input[type="hidden"]').data('code');
        var data = {'code': code};
        data[yupeTokenName] = yupeToken;
        $.ajax({
            url: '/coupon/remove',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                showNotify(this, data.result ? 'success' : 'danger', data.data);
                if (data.result) {
                    updateAllCosts();
                }
            }
        });
    });

    $('#coupon-code').keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
            $('#add-coupon-code').click();
        }
    });

    $('.order-form').submit(function () {
        $(this).find("button[type='submit']").prop('disabled', true);
    });
});
function orderSend(form, data, hasError) {
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
				setTimeout(function(){$('#order-form').remove();$('h1').html(response.data)},3000);
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