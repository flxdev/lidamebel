/* Function for ours ajax inquiry  */
function ajaxpostshow(urlres, datares, wherecontent){
	$.ajax({
		type: "POST",
		url: urlres,
		data: datares,
		dataType: "html",
		beforeSend: function(){
				var elementheight = $(wherecontent).height();
				$(wherecontent).prepend('');
				$('.ajaxloader').css('height', elementheight);
				$('.ajaxloader').prepend('');
			},
		success: function(fillter){
				$(wherecontent).html(fillter);
		}
	});
}

/* For add to cart */
$(".addtobasket").live("click",function(){
	var addbasketid = $(this).attr('id'),
		target_block = $(this).data('block'),
		target_php = $(this).data('php'),
		target_popup = $(this).data('popup');

	ajaxpostshow(target_php, addbasketid, target_block);
	if(target_popup == 'yes'){
		OpenWin('cart_popup');
	}
	return false;
});

function setCookie(name, value, options) {
	options = options || {};

	var expires = options.expires;

	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);

	var updatedCookie = name + "=" + value;

	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie;
}

function deleteCookie(name) {
	setCookie(name, "", {
		expires: -1
	});
}

function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

/* For order-status */
$(document).on("click", ".formsubscrube", function(){
	var formsubscrube = $(this).parents("form").serialize(),
		target_block = $(this).data('block'),
		target_php = $(this).data('php');
	formsubscrube = formsubscrube + '&action=ajax';
	ajaxpostshow(target_php, formsubscrube, target_block);
	return false;
});
$(document).ready(function() {
	(function(){
		if ($(".js-input-tel").length) {
				$(".js-input-tel").mask("+9 (999) 999-99-99");
			}
	})();
	//validation
	function ajaxSubmit(form){
		var formsubscrube = $(form).serialize(),
			target_block = $(form).data('block'),
			target_php = $(form).data('php'),
			formsubscrube = formsubscrube;
			ajaxpostshow(target_php, formsubscrube, target_block);
		return false;
	}

	var form_validate = $('.js-validate');
	if (form_validate.length) {
		form_validate.each(function () {
			var form_this = $(this);
			$.validate({
				form : form_this,
				borderColorOnError : true,
				scrollToTopOnError : false,
				validateOnBlur : true,
				onSuccess: function($form){
					ajaxSubmit($form);
					if($form.hasClass("quick")){
						yaCounter25231718.reachGoal('zakazat_click');
					}
					if($form.hasClass("callback")){
						yaCounter25231718.reachGoal('perezvonite');
					}
					return false;
				}
			});
		});
	};

	$('.review__like-action').each(function(){
		var _this = $(this),
			ID = $(this).data('id'),
			pos = $(this).find('.pos'),
			neg = $(this).find('.neg'),
			val,
			str;
		var date = new Date;
			date.setDate(date.getDate() + 365);

		var like_val = getCookie('LIKE['+ID+']');

		if(like_val === undefined){
			pos.on('click', function(){
				val = parseInt($(this).html()) + 1;
				_this.addClass('inactive');
				$(this).addClass('active');
				$(this).html(val);
				setCookie("LIKE["+ID+"]", "YES", {
					expires: date,
					path: '/'
				});
				$.ajax({
					type: "POST",
					url: '/bitrix/templates/lidamebel_new/ajax/review_helpful.php',
					data: {
						'ID' : ID,
						'VALUE' : val,
						'TYPE' : 'YES'
					}
				});
			});

			neg.on('click', function(){
				val = parseInt($(this).html()) + 1;
				_this.addClass('inactive');
				$(this).addClass('active');
				$(this).html(val);
				setCookie("LIKE["+ID+"]", "NO", {
					expires: date,
					path: '/'
				});
				$.ajax({
					type: "POST",
					url: '/bitrix/templates/lidamebel_new/ajax/review_helpful.php',
					data: {
						'ID' : ID,
						'VALUE' : val,
						'TYPE' : 'NO'
					}
				});
			});
		} else {
			_this.addClass('inactive');

			if(like_val === "YES"){
				pos.addClass('active');
			}else{
				neg.addClass('active');
			}
		}
	});
});