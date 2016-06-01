var $popupTip, $popupWrapper;
$(function(){
	initFancyBox();
});
$(document).ready(function() {

	//validation

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
					
				}
			});
		});
	};




	var gallery = $('.js-gallery'),
		gallery__pager = $('.gallery__pager');

	gallery.slick({
		arrows: false,
		asNavFor: '.gallery__pager',
		fade: true,
		swipe: false
	});
	gallery__pager.slick({
		arrows: false,
		slidesToShow: 3,
		slidesToScroll: 3,
		variableWidth: true,
		focusOnSelect: true,
		asNavFor: '.js-gallery'
	});

	$('.accordion .h2').each(function(){
		var link = $(this),
		    content = link.next('ul');
		if(link.parent().hasClass('no-accord')) {
			//link.parent().addClass('active');
			//content.show();
		}
		if (content.find('li').hasClass('active')) {
			link.parent().addClass('active');
			content.show();
		}

		link.on('click',function(){
			var this_ = $(this),
				parent = this_.parent(),
				content = this_.next('ul');

			if(parent.hasClass('no-accord')) return;
			
			if(parent.hasClass('active')){
				parent.removeClass('active');
				content.stop(true, true).slideToggle();
			}else {
				parent.addClass('active').siblings().not('.no-accord').removeClass('active');
				content.stop(true, true).slideDown().parent().siblings().not('.no-accord').find('ul').stop(true, true).slideUp();
			}
		});
	});

	$(window).on('load', function(){
		if($(window).width() <= 999) {
			$('.accordion').find('.left_nav_block:first-child').removeClass('no-accord');
			$('.accordion').find('.left_nav_block ul').hide().parent().removeClass('active');
		} else {
			$('.accordion').find('.left_nav_block:first-child').addClass('no-accord');
			$('.accordion').find('.left_nav_block.active ul').show().parent().addClass('active');
		}
	});
	$(window).on('resize', function(){
		if($(window).width() <= 999) {
			$('.accordion').find('.left_nav_block:first-child').removeClass('no-accord');
			$('.accordion').find('.left_nav_block ul').hide().parent().removeClass('active');

		} else {
			$('.accordion').find('.left_nav_block:first-child').addClass('no-accord').find('> ul').show();
			$('.accordion').find('.left_nav_block.active ul').show().parent().addClass('active');
		}
	});
	$('.js-anchor').on('click', function(){
	  	if($(this)[0].hasAttribute('data-tab')){
			var attr = $(this).data('tab');
			$('.js-tab').find('[data-link="'+attr+ '"]').trigger('click');
		}
		var anchor = $(this).data('anchor'),
			anchor__top = $('.'+anchor).offset().top;

			$('html, body').animate({
				scrollTop: anchor__top
			}, 300);
	});

	$('.slides_list').carouFredSel({
		prev: '.pagination .prev_btn',
		next: '.pagination .next_btn',
		items: 1,
		responsive: true,
		mousewheel: false,
		swipe: { 
			onMouse: true,
			onTouch: true
		},
		pagination: {
			container: '.pagin ul',
			anchorBuilder: false
		},
		auto: {
			timeoutDuration: 5000
		}
	});

	//map
	if ($('#map').length) {
        /*function initialize() {
            var mapOptions = {
                zoom: 14,
                disableDefaultUI: true,
                scrollwheel: false,
                panControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                scaleControl: true,
                center: new google.maps.LatLng(55.872686, 37.43495)
            };

            map = new google.maps.Map(document.getElementById('map-canvas'),
              mapOptions);
            var image = '/bitrix/templates/lidamebel/images/marker.png';
            var myLatLng = new google.maps.LatLng(55.872686, 37.43495);
            var beachMarker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: image,
		title:"г. Москва, ул. Свободы, 103, стр. 8"
            });
        }
        google.maps.event.addDomListener(window, 'load', initialize);*/
	var myMap;

	var mapinit = false;

	function init () {
		if (!mapinit) {
			mapinit = true;
		    myMap = new ymaps.Map('map', {
		        center: [55.872686, 37.43495],
		        zoom: 14,
		        controls: ['zoomControl']
		    }),
		    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
		    	balloonContent: '<span class="img__bg"></span><p class="ymap__title">ООО "Юнипром" </p><h3>Адрес</h3><p> Москва, ул. Свободы, 103, стр. 8, оф. 1 (территория спортивного центра «Русь»)</p><h3>Телефоны:</h3><p>+7 (495) 902-51-05<br>+7 (916) 47-00-768</p><h3>Время работы</h3><p>Пн-Пт, 9:00-18:00 (офис/склад)<br>Сб-Вс, 10:00-12:00 (склад)</p>'
		    },{
		    	iconLayout: 'default#image',
		    	iconImageHref: 'images/pin.png',
			iconImageSize: [65, 71],
			iconImageOffset: [-30, -71]
		    });
		    myMap.geoObjects.add(myPlacemark);
		    myMap.behaviors.disable('scrollZoom');
		}
	}
    };

	// tabs
	function tab() {
       $(".js-tab").each(function(){
				var tab_link = $(this).find("a");
				var tab_item = $(this).find("li");
				var tab_cont = $(this).parents(".js-tab-group").find(".js-tab-cont");
				tab_cont.hide();
				tab_item.first().addClass("is-active");
				$(this).parents(".js-tab-group").find(".js-tab1").show();
				tab_link.on("click", function() {
					var index = $(this).data("link");
					tab_item.removeClass("is-active");
					$(this).parent().addClass("is-active");
					tab_cont.hide();
					$(this).parents(".js-tab-group").find("."+index).show();
					if ($(this).parents(".js-tab-group").find("."+index).find('.js-scroll').length) {
						$(this).parents(".js-tab-group").find("."+index).find('.js-scroll').jScrollPane();
					}
					if ($('#map').length) {
						init();
					}
					return false;
				});
		});
  	}
  	setTimeout(function(){tab();},100);
  	

	$popupTip = $('.popup-tip.by-css');
	$popupWrapper = $('#popup-wrapper');


	$popupTip.click(function() {
		$popupWrapper.toggleClass('active');
	});

	$('.sort_nav ul li a').click(function() {
		$(this).toggleClass('up');
	});




/*
	$('.left_nav  ul > li > a').click(function() {
		act = false;
		if ($(this).parent().hasClass("active")) {
			act = true;
		}
		;
		$(this).parent().parent().find('li.active').removeClass("active").find('>ul').slideUp();
		$(this).parent().addClass('active');
		if (!act) {
			$(this).parent().find('>ul').slideDown();
		}
		else {
			$(this).parent().removeClass("active")
		}
		;
		return false;
	});
*/

    $('#article').jScrollPane();
	
	$('#about').jScrollPane();


	$('.scroll-pane').each(function(){
		var api = $(this).data('jsp');
	    var throttleTimeout;
	    $(window).on('resize', function(){
	    	if(!throttleTimeout) {
	    		throttleTimeout = setTimeout(function(){
	    			api.reinitialise();
	    			throttleTimeout = null;
	    		},50);
	    	}
	    });
	});
	$('.article_slider .bxslider').bxSlider({
		auto: true,
		mode: 'fade',
		captions: true
	});

	$('.certificates-rotator').bxSlider({
		auto: true,
		captions: true
	});
	
	// $('.viewed_slider').bxSlider({
	// 	auto: false,
	// 	minSlides: 1,
	// 	maxSlides: 3,
	// 	slideWidth: 210,
	// 	slideMargin: 0,
	// 	infiniteLoop: false
	// });
	$('.viewed_slider').slick({
		slidesToScroll: 1,
		slidesToShow: 3,
		infinite: false,
		responsive: [
			{
				breakpoint: 1000,
				settings: {
					slidesToShow: 4
				}
			},
			{
				breakpoint: 831,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1
				}
			}
		]
	});
	(function(){
		window.addEventListener('resize', function(){
			if(window.innerWidth && parseInt(window.innerWidth) < 639) {
				if($('.news__gallery').hasClass('slick-initialized')) return false;
				$('.news__gallery').slick();
			} else {
				$('.news__gallery').slick('unslick');
			}
		});

		window.addEventListener('load', function(){
			if(window.innerWidth && parseInt(window.innerWidth) < 639) {
				if($('.news__gallery').hasClass('slick-initialized')) return false;
				$('.news__gallery').slick();
			} else {
				$('.news__gallery').slick('unslick');
			}
		});
	})();
		
	
	$('.minus').click(function() {
		var $input = $(this).parent().find('input');
		var count = parseInt($input.val()) - 1;
		count = count < 1 ? 1 : count;
		$input.val(count);
		$input.change();
		return false;
	});

	$('.plus').click(function() {
		var $input = $(this).parent().find('input');
		$input.val(parseInt($input.val()) + 1);
		$input.change();
		return false;
	});
	
	// $('.useful_slider').bxSlider({
	// 	mode: 'fade',
	// 	auto: true,
	// 	autoHover: true,
	// 	minSlides: 3,
	// 	maxSlides: 3
	// });
	$('.useful_slider').on('init', function(){
		setTimeout(function(){
			navi();
		},500);
	});
	function navi() {
		var bullet = $('.useful_slider .slick-dots').width();
		$('.useful_slider .slick-prev').css('margin-left', -(bullet/2) - 20);
		$('.useful_slider .slick-next').css('margin-right', -(bullet/2) -20);
	};
	//navi();
	$(window).on('resize', function(){
		navi();
	});
	$('.useful_slider').slick({
		dots: true,
		fade: true,
		slidesToShow: 1,
		responsive: [
			{
				breakpoint: 1000,
				settings: {
					slidesToShow: 3,
					fade: false
				}
			},
			{
				breakpoint: 736,
				settings: {
					slidesToShow: 2,
					slidesToScroll:2,
					fade: false
				}
			},
			{
				breakpoint: 375,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					fade: false
				}
			}
		]
	})

	$('.product_gallery').bxSlider({
		auto: false,

		autoHover: true,
		pagerCustom: '#bx-gallery-pager',
		mode: "fade"
	});

	$('.vertical_slider').bxSlider({
		auto: true,

		autoHover: true,
		mode: 'vertical',
		slideWidth: 208,
		minSlides: 2,
		slideMargin: 12
	});
	
	$('.sidebar_slider .bxslider').bxSlider({
		pagerCustom: '#bx-pager',
		auto: true,

		autoHover: true,
		mode: "fade"
	});
	
	$('.propose_slider').bxSlider({
		slideWidth: 207,
		auto: true,

		autoHover: true,
		minSlides: 1,
		maxSlides: 4
	});
	
	$('.popup .close').click(function() {
		$('#overlay').fadeOut();
		$(this).parent().fadeOut('slow');
		return false;
	});
	
	$('#cart_popup .popup .close').click(function() {
		$('#overlay').fadeOut();
		$(this).parent().fadeOut('slow');
		return false;
	});

	$('.popup .back_link').click(function() {
		$('#overlay').fadeOut();
		$(this).parent().fadeOut('slow');
		return false;
	});			
	$('.search input[type=text], .call_form input[type=text], .review_form input[type=text]')
			.bind('focus', Function("if(this.value==this.defaultValue) this.value=''"))
			.bind('blur', Function("if(this.value=='') this.value=this.defaultValue"));

	//// google map
	if ($('#gmap1, #gmap2').length) {
		mapInit();
	} 
	
	//// tabs
	$("#tabs").tabs({
		select: function(event, ui) {
			if (ui.index == 1) {
				map2Init();
			}
		}
	});
	
	//// slider
	if ($('.js-mainSlider').length) {
		$('.js-mainSlider li').each(function(i) {
			$(this).attr('rel', i)
		});

		$('.js-mainSlider').carouFredSel({
			prev: '.slide_pagination .prev_btn',
			next: '.slide_pagination .next_btn',
			items: 1,
			responsive: true,
			mousewheel: false,
			adaptiveHeight: true,
			auto: false,
			swipe: { 
				onMouse: true,
				onTouch: true
			},
			pagination: {
				container: '.pagination ul',
				anchorBuilder: false
			},
			scroll: {
				onBefore: function(data) {
					$('.text_wrapper .text:visible').fadeTo(500, 0, function() {
						$(this).hide();
					})
					$('.text_wrapper .text').eq(data.items.visible.attr('rel')).show().fadeTo(500, 1);
				}
			},
			// auto: {
			// 	timeoutDuration: 5000
			// }
		});
		function frameSize(){
			var fWidth = +$('.border').width(),
				pWidth = +$('.pagination').width();

			var total = fWidth - pWidth - 60;

			$('.border__right').css('width', total);

		};
		frameSize();
		$(window).on('resize', function(){
			frameSize();
		});
	}

	//// rating
	$('.js-rating').each(function(){
		var hoverTimeout,
			_ = $(this),
			li = _.find('li'),
			a = li.find('a');
		li.hover(function() {
			if (!$(this).parents('.js-rating').hasClass('active')) {
				$(this).parents('.js-rating').find('li').removeClass('active');
				$(this).addClass('active');
				$(this).prevAll().addClass('active');
				
				clearTimeout(hoverTimeout);
			}
		}, function() {
			if (!$(this).parents('.js-rating').hasClass('active')) {
				var self = $(this);
				hoverTimeout = setTimeout(function() {
					self.parents('.js-rating').find('li').removeClass('active');
				}, 100);
			}
		});
		
		a.click(function() {
			clearTimeout(hoverTimeout);
		
			$(this).parents('.js-rating').addClass('active');
			
			$(this).parents('.js-rating').find('li').removeClass('active');
			$(this).parent().addClass('active');
			$(this).parent().prevAll().addClass('active');
			return false;
		});
	});

	// fake ajax reviews
	$('.reviews .review').slice(1).hide();
	$('.view_all').click(function() {
		$('.reviews .review:not(:visible)').slice(0, 5).slideDown();
		return false;
	});

	$(function(){
		$('.ng-table').ngResponsiveTables({
	    	smallPaddingCharNo: 13,
	    	mediumPaddingCharNo: 18,
	    	largePaddingCharNo: 30
	  	});
	  	$('.filter, .product__article .js-tab-group .tabs').scrollTabs({
	  		left_arrow_size: 0,
      		right_arrow_size: 0,
	  	});
	  	if($('.review').length) {
	  		$('.review_carousel-item').fancybox();
	  	}
	  	function placehold() {
	  		$('.holder').each(function(){
	  			var _ = $(this),
	  				hold = $(this).parents('.field').find('.field__title');

	  			_.on('input', function(){
	  				if($(this).val().length !== 0) {
	  					hold.hide();
	  				} else {
	  					hold.show();
	  				}
	  			});
	  			if($(this).val().length !== 0) {
  					hold.hide();
  				} else {
  					hold.show();
  				}
	  		});
	  	};
	  	placehold();

	  	//dropzone
	    var dropfile = $("#mydropzone");

	    if(dropfile.length) {
	        Dropzone.options.mydropzone = {
	        	paramName: "file",
	            uploadMultiple: true,
	            maxFilesize: 15,
	            dictDefaultMessage: "",
	            addRemoveLinks: true,
	            dictRemoveFile: '',
	            createImageThumbnails: true,
	            thumbnailWidth: 73,
				thumbnailHeight: 68,
				previewTemplate: '<div class="dz-preview dz-file-preview"><div class="dz-details"><img data-dz-thumbnail /></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-success-mark"><span>✔</span></div><div class="dz-error-mark"><span>✘</span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div>'
	        }
	    }

	    $('.popups .close').click(function() {
			$(this).parents('.popups').fadeOut('slow');
			$('body').removeClass('space');
			return false;
		});
	});

});

$(window).load(function() {
	$('.preloader').hide();
});

$(document).click(function(e) {

	if (!$(e.target).parents('#popup-wrapper').length) {
		if ($popupWrapper.hasClass('active')) {
			$popupWrapper.removeClass('active');
		}
	}
});

	function initFancyBox(){
		if($('.product__gallery a[rel]').length){
			$('.product__gallery a[rel]').fancybox();
		}
		if($('#article a[rel]').length){
			$('#article a[rel]').fancybox();
		}
		if($('.certificates-rotator').length){
			$('.certificates-rotator a').fancybox();
		}
	}

// function OpenWin(id) {
// 	$('#overlay').fadeIn(400);
// 	$('#' + id).fadeIn(400);
// }
function OpenWin(id) {
	$('#' + id).fadeIn(400);
	$('body').addClass('space');
}
function mapInit() {
	/*var latlng = new google.maps.LatLng(55.873741, 37.434072);
	var mapOptions = {
		zoom: 12,  
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP, 
		panControl:false,
		streetViewControl:false,
		mapTypeControl:false, 
		scaleControl: false,
		scrollwheel: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.LEFT_CENTER
		}
	}; 
	var map = new google.maps.Map(document.getElementById('gmap1'), mapOptions); 
	var image = new google.maps.MarkerImage('/bitrix/templates/lidamebel/images/pin.png', 
		new google.maps.Size(65, 71), 
		new google.maps.Point(0,0), 
		new google.maps.Point(28, 50)
	); 
	var marker1 = new google.maps.Marker({
		position: new google.maps.LatLng(55.873741, 37.434072),
		map: map,
		icon: image  
	});  */
	ymaps.ready(function () {
	    var myMap = new ymaps.Map('gmap1', {
			center: [55.873741, 37.434072],
			zoom: 14,
			controls: ['zoomControl']
		}),
		myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
			//hintContent: 'г. Москва, ул. Свободы, 103, стр. 8',
			//balloonContent: 'г. Москва, ул. Свободы, 103, стр. 8'
		},{
			iconLayout: 'default#image',
			iconImageHref: 'images/pin.png',
			iconImageSize: [65, 71],
			iconImageOffset: [-30, -71]
		});
		myMap.geoObjects.add(myPlacemark);
		myMap.behaviors.disable('scrollZoom');
	});
}

var map2inited = false;
function map2Init() {
	if (!map2inited) {
		map2inited = true;
	
		/*setTimeout(function() {
			var latlng2 = new google.maps.LatLng(55.872599, 37.434887); 
			var mapOptions2 = {
				zoom: 12,  
				center: latlng2,
				mapTypeId: google.maps.MapTypeId.ROADMAP, 
				panControl:false,
				streetViewControl:false,
				mapTypeControl:false, 
				scaleControl: false,
				scrollwheel: false,
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE,
					position: google.maps.ControlPosition.LEFT_CENTER
				}
			}; 
			var map2 = new google.maps.Map(document.getElementById('gmap2'), mapOptions2); 
			var image = new google.maps.MarkerImage('/bitrix/templates/lidamebel/images/pin.png', 
				new google.maps.Size(65, 71), 
				new google.maps.Point(0,0), 
				new google.maps.Point(28, 50)
			); 
			var marker2 = new google.maps.Marker({
				position: new google.maps.LatLng(55.872599, 37.434887),
				map: map2,
				icon: image  
			});
		}, 300);*/
		setTimeout(function() {
			var myMap = new ymaps.Map('gmap2', {
			    center: [55.872599, 37.434887],
			    zoom: 14,
			    controls: ['zoomControl']
			}),
			myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
				//hintContent: 'г. Москва, ул. Свободы, 103, стр. 8',
				//balloonContent: 'г. Москва, ул. Свободы, 103, стр. 8'
			},{
				iconLayout: 'default#image',
				iconImageHref: 'images/pin.png',
				iconImageSize: [65, 71],
				iconImageOffset: [-30, -71]
			});
			myMap.geoObjects.add(myPlacemark);
			myMap.behaviors.disable('scrollZoom');
		}, 300);
	}
}