var $popupTip, $popupWrapper, mymapdelivery, dplcmrk;
$(function () {
	initFancyBox();
});
$(document).ready(function () {
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

	//selectable
	function selects() {
		$('.select').fancySelect({
			optionTemplate: function (optionEl) {
				return '<a href="' + optionEl.data('link') + '">' + optionEl.text() + '</a>';
			}
		});
	}

	if ($('.select')) {
		selects();
	}

	$(".select-cust__drop-scroller .scroll").jScrollPane({
		height: 260,
		mouseWheelSpeed: 120
	});

	function filterToggle() {
		var trigger = $(".search-filter__trigger"),
			action = trigger.parent().find(".search-filter__action");

		trigger.on("click", function (event) {

			event.stopPropagation();

			if ($(this).hasClass("open")) {
				$(this).removeClass("open");
				action.removeClass("open");
			} else {
				$(this).addClass("open");
				action.addClass("open");
			}
		});

		trigger.parent().on("click", function (event) {
			event.stopPropagation();
		});

		$(document).on("click", function () {
			trigger.removeClass("open");
			action.removeClass("open");
		});

		$(window).on("resize", function () {
			if ($(window).width() > 1024) {
				trigger.removeClass("open");
				action.removeClass("open");
			}
		})
	}

	filterToggle();


	//custom select for yandex filter
	function selectY() {
		var select = $('.select-cust'),
			trigger = select.find('.select-cust__trigger'),
			drop = select.find(".select-cust__drop"),
			dropItem = drop.find(".item"),
			vl = drop.find('input:checked').next().find('span').text();

		trigger.find('span').text(vl);


		trigger.on("click", function (event) {
			var _ = $(this);

			event.stopPropagation();

			if (_.hasClass("open")) {
				_.removeClass("open");
				drop.removeClass("open");
			} else {
				_.addClass("open");
				drop.addClass("open");
			}
		});

		dropItem.on("click", function () {
			var _ = $(this),
				val = _.find('label span').text();
			trigger.find('span').text(val);

			trigger.removeClass("open");
			drop.removeClass("open");
		});

		$(document).on("click", function () {
			trigger.removeClass("open");
			drop.removeClass("open");
		})

	}

	selectY();
	$('.left_nav_block:nth-child(3)').addClass("no-accord2");
	$('.accordion .h2').each(function () {
		var link = $(this),
			content = link.next('ul'),
			parent = link.parent();


		if (content.find('li.active').length && !link.parent().hasClass('no-accord')) {
			content.parent().find('ul').show();
			content.find('.active').parents('.left_nav_block').addClass('active').siblings().removeClass('active');
			//$('li.active').find('> ul').show();
		} else {
			$('li.active').find('> ul').show();
		}

		link.on('click', function () {
			var this_ = $(this),
				parent = this_.parent(),
				content = this_.next('ul');

			if (parent.hasClass('no-accord')) return;

			if (parent.hasClass('active')) {
				parent.removeClass('active');
				content.stop(true, true).slideToggle();
			} else {
				parent.addClass('active').siblings().not('.no-accord').removeClass('active');
				content.stop(true, true).slideDown().parent().siblings().not('.no-accord').find('ul').stop(true, true).slideUp();

			}
		});
	});

	$(window).on('load', function () {
		if ($(window).width() <= 999) {
			$('.accordion').find('.left_nav_block:first-child').removeClass('no-accord');
			$('.accordion').find('.left_nav_block > ul').hide();
			$('.accordion').find('.left_nav_block').removeClass('active').find('> ul').hide();
		} else {
			$('.accordion').find('.left_nav_block:first-child').addClass('no-accord');
			$('.accordion').find('.left_nav_block ul .active').show();
		}
	});
	$(window).on('resize', function () {
		if ($(window).width() <= 999) {
			$('.accordion').find('.left_nav_block:first-child').removeClass('no-accord');
			//$('.accordion').find('.left_nav_block .active ul').hide();
			$('.accordion').find('.left_nav_block').removeClass('active').find('> ul').hide()

		} else {
			$('.accordion').find('.left_nav_block:first-child').addClass('no-accord').find('> ul').show();
			$('.accordion').find('.left_nav_block ul .active').show();
			$('.accordion').find('.left_nav_block ul .active > ul').show();
			$('.accordion').find('.left_nav_block li.active').parents('.left_nav_block').addClass('active').find(' > ul').show();
		}
	});
	function Accord2(){
		var elem = $('.accordion').find('.left_nav_block.no-accord2');
		// elem.find(' ul ul').hide();
		elem.find('ul ul').hide();
		elem.find(' li.active > ul').show();

	}Accord2();
	$('.js-anchor').on('click', function () {
		if ($(this)[0].hasAttribute('data-tab')) {
			var attr = $(this).data('tab');
			$('.js-tab').find('[data-link="' + attr + '"]').trigger('click');
		}
		var anchor = $(this).data('anchor'),
			anchor__top = $('.' + anchor).offset().top;

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
		 var image = '/bitrix/templates/lidamebel_new/images/marker.png';
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

		function init() {
			if (!mapinit) {
				mapinit = true;
				myMap = new ymaps.Map('map', {
					center: [55.872686, 37.43495],
					zoom: 14,
					controls: ['zoomControl']
				}),
					myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
						balloonContent: '<div class="b-overlay"><span class="img__bg"></span><p class="ymap__title">ООО "Юнипром" </p><h3>Адрес</h3><p> Москва, ул. Свободы, 103, стр. 8, оф. 1 (территория спортивного центра «Русь»)</p><h3>Телефоны:</h3><p>+7 (495) 902-51-05<br>+7 (916) 47-00-768</p><h3>Время работы</h3><p>Пн-Пт, 9:00-18:00 (офис/склад)<br>Сб-Вс, 9:00-18:00 (склад)</p></div>'
					}, {
						iconLayout: 'default#image',
						iconImageHref: '/bitrix/templates/lidamebel_new/images/pin.png',
						iconImageSize: [65, 71],
						iconImageOffset: [-30, -71]
					});
				myMap.geoObjects.add(myPlacemark);
				myMap.behaviors.disable('scrollZoom');
			}
		}
	}
	;

	// tabs
	function tab() {
		$(".js-tab").each(function () {
			var tab_link = $(this).find("a");
			var tab_item = $(this).find("li");
			var tab_cont = $(this).parents(".js-tab-group").find(".js-tab-cont");
			tab_cont.hide();
			tab_item.first().addClass("is-active");
			$(this).parents(".js-tab-group").find(".js-tab1").show();
			tab_link.on("click", function () {
				var index = $(this).data("link");
				tab_item.removeClass("is-active");
				$(this).parent().addClass("is-active");
				tab_cont.hide();
				$(this).parents(".js-tab-group").find("." + index).show();
				if ($(this).parents(".js-tab-group").find("." + index).find('.js-scroll').length) {
					$(this).parents(".js-tab-group").find("." + index).find('.js-scroll').jScrollPane();
				}
				if ($('#map').length) {
					init();
				}
				return false;
			});
		});
	}

	setTimeout(function () {
		tab();
	}, 100);


	$popupTip = $('.popup-tip.by-css');
	$popupWrapper = $('#popup-wrapper');


	$popupTip.on('click', function () {
		$popupWrapper.toggleClass('active');
	});

	$('.sort_nav ul li a').on('click', function () {
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


	$('.jspScrollable').each(function () {
		var api = $(this).data('jsp');
		var throttleTimeout;
		$(window).on('resize', function () {
			if (!throttleTimeout) {
				throttleTimeout = setTimeout(function () {
					api.reinitialise();
					throttleTimeout = null;
				}, 50);
			}
		});
	});
	$('.article_slider .bxslider').bxSlider({
		auto: true,
		mode: 'fade',
		captions: true
	});

	$('.certificates-rotator').bxSlider({
		//auto: true,
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
	(function () {
		function inits() {
			if (window.matchMedia('(max-width: 639px)').matches) {
				if (!$('.news__gallery').hasClass('ready')) {
					$('.news__gallery').on('init', function () {
						$(this).addClass('ready');
					});
					$('.news__gallery').slick();
				}
			} else {
				if ($('.news__gallery').hasClass('ready')) {
					$('.news__gallery').slick('unslick');
					$('.news__gallery').removeClass('ready');
				}
			}
		}

		inits();


		window.addEventListener('resize', function () {
			inits();
		});
	})();


	$('.minus').click(function () {
		var $input = $(this).parent().find('input');
		var count = parseInt($input.val()) - 1;
		count = count < 1 ? 1 : count;
		$input.val(count);
		$input.change();
		return false;
	});

	$('.plus').click(function () {
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
	$('.useful_slider').each(function () {
		var _this = $(this);
		_this.slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			slide: '.useful_item',
			arrows: true,
			dots: true,
			prevArrow: '<span class="slick-prev"><i class="fa fa-arrow-left"></i></span>',
			nextArrow: '<span class="slick-next"><i class="fa fa-arrow-right"></i></span>',
			appendArrows: $('.slider-nav', _this),
			appendDots: $('.slider-nav', _this),
			customPaging: function (slider, i) {
				return '<a href="javascript:;"></a>';
			},
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
						slidesToScroll: 2,
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
	});

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

	function propose() {
		$('.propose_slider').each(function () {
			var _this = $(this);
			$(this).slick({
				slidesToShow: 4,
				slidesToScroll: 4,
				slide: '.slide',
				arrows: true,
				dots: true,
				prevArrow: '<span class="slick-prev"><i class="fa fa-arrow-left"></i></span>',
				nextArrow: '<span class="slick-next"><i class="fa fa-arrow-right"></i></span>',
				appendArrows: $('.slider-nav', _this),
				appendDots: $('.slider-nav', _this),
				customPaging: function (slider, i) {
					return '<a href="javascript:;"></a>';
				},
				responsive: [
					{
						breakpoint: 830,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 1,
							arrows: true
						}
					},
					{
						breakpoint: 735,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 1,
							dots: false
						}
					},
					{
						breakpoint: 640,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1,
							arrows: true,
							dots: false
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
							dots: false
						}
					}
				]
			});
		});

	}

	propose();

	/*$('.propose_slider').bxSlider({
	 slideWidth: 207,
	 auto: true,

	 autoHover: true,
	 minSlides: 1,
	 maxSlides: 4
	 });*/

	$('.popup .close').click(function () {
		$('#overlay').fadeOut();
		$(this).parent().fadeOut('slow');
		return false;
	});

	$('#cart_popup .popup .close').click(function () {
		$('#overlay').fadeOut();
		$(this).parent().fadeOut('slow');
		return false;
	});

	$('.popups .back_link').on('click', function () {
		$(this).parents('.popups').fadeOut('slow');
		$('body').removeClass('space');
		$('html').removeAttr('style');
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
		select: function (event, ui) {
			if (ui.index == 1) {
				map2Init();
			}
		}
	});

	//// slider
	if ($('.js-mainSlider').length) {
		$('.js-mainSlider li').each(function (i) {
			$(this).attr('rel', i)
		});
		$('.main_slider .pagination li').each(function (i) {
			$(this).attr('rel', i)
		});
		/*$('.js-mainSlider').carouFredSel({
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
		 });*/
		$('.js-mainSlider').each(function () {
			var _this = $(this);
			$(this).slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				slide: 'li',
				arrows: true,
				dots: true,
				prevArrow: '<span class="slick-prev"><i class="fa fa-arrow-left"></i></span>',
				nextArrow: '<span class="slick-next"><i class="fa fa-arrow-right"></i></span>',
				appendArrows: $('.slider-nav', _this),
				appendDots: $('.slider-nav', _this),
				customPaging: function (slider, i) {
					return '<a href="javascript:;"></a>';
				},
				asNavFor: '.text_wrapper',
				autoplay: true,
				autoplaySpeed: 3000,
			});
		});
		$('.text_wrapper').slick({
			fade: true,
			arrows: false,
			asNavFor: '.js-mainSlider',
			adaptiveHeight: true
		});
		function frameSize() {
			var fWidth = +$('.border').width(),
				pWidth = +$('.slider-nav').width();

			var total = fWidth - pWidth - 83;

			$('.border__right').css('width', total);

		};
		frameSize();
		$(window).on('resize', function () {
			frameSize();
		});
	}

	//// rating
	$('.js-rating').each(function () {
		var hoverTimeout,
			_ = $(this),
			li = _.find('li'),
			a = li.find('a');
		li.hover(function () {
			if (!$(this).parents('.js-rating').hasClass('active')) {
				$(this).parents('.js-rating').find('li').removeClass('active');
				$(this).addClass('active');
				$(this).prevAll().addClass('active');

				clearTimeout(hoverTimeout);
			}
		}, function () {
			if (!$(this).parents('.js-rating').hasClass('active')) {
				var self = $(this);
				hoverTimeout = setTimeout(function () {
					self.parents('.js-rating').find('li').removeClass('active');
				}, 100);
			}
		});

		a.click(function () {
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
	$('.view_all').click(function () {
		$('.reviews .review:not(:visible)').slice(0, 5).slideDown();
		return false;
	});

	$(function () {
		function toggleMenu() {
			var menu = $('.menu'),
				overlay = $('.mobile__overlay'),
				close = overlay.find('.closes');

			menu.on('click', function () {
				overlay.fadeIn(150);
				$('body').addClass('space');
				$('html').css('overflow', 'hidden');
			});
			close.on('click', function () {
				overlay.fadeOut(150);
				$('body').removeClass('space');
				$('html').removeAttr('style');
			});
		}

		toggleMenu();
		$('.ng-table').each(function () {
			$(this).ngResponsiveTables({
				smallPaddingCharNo: 13,
				mediumPaddingCharNo: 18,
				largePaddingCharNo: 30
			});
		});
		if ($('.show_more').length) {
			$('.show_more').showMore({
				speedDown: 300,
				speedUp: 300,
				height: '120px',
				showText: 'Читать весь отзыв',
				hideText: 'Свернуть'
			})
		}
		if (!head.mobile) {
			$('.filter, .product__article .js-tab-group .tabs').scrollTabs({
				left_arrow_size: 0,
				right_arrow_size: 0,
			});
		}
		if ($('.review').length) {
			$('.review_carousel-item').fancybox({
				padding: 0,
				margin: 0,
				afterLoad: function () {
					swipes();
				}
			});
		}
		function placehold() {
			$('.holder').each(function () {
				var _ = $(this),
					hold = $(this).parents('.field').find('.field__title'),
					vals = _.val();

				hold.on('click', function () {
					_.focus();
				});

				_.on('input', function () {
					if ($(this).val().length !== 0) {
						hold.hide();
					} else {
						hold.show();
					}
				});
				if ($(this).val().length !== 0) {
					hold.hide();
				} else {
					hold.show();
				}
			});
		};
		placehold();

		$('.products_small_block').slick({
			slidesToShow: 4,
			slidesToScroll: 4,
			arrows: true,
			swipeToSlide: true,
			responsive: [
				{
					breakpoint: 831,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1,
						arrows: true
					}
				},
				{
					breakpoint: 640,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
						arrows: true
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: true
					}
				}
			]
		});

		//dropzone
		var dropfile = $("#mydropzone");

		if (dropfile.length) {
			Dropzone.options.mydropzone = {
				init: function () {
					this.on("addedfile", function (file) {
					});
					this.on("success", function (file) {
					});
					this.on("removedfile", function (file) {
						$.ajax({
							type: "POST",
							url: "/fileupl.php",
							data: "del=" + file['name'],
							dataType: "html"
						});
					});
				},
				acceptedFiles: 'image/*',
				uploadMultiple: false,
				paramName: "file",
				maxFilesize: 15,
				dictDefaultMessage: "",
				addRemoveLinks: true,
				dictRemoveFile: '',
				createImageThumbnails: true,
				thumbnailWidth: 73,
				thumbnailHeight: 68,
				dictInvalidFileType: 'Данный формат файла не поддерживается.',
				previewTemplate: '<div class="dz-preview dz-file-preview"><div class="dz-details"><img data-dz-thumbnail /></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-success-mark"><span>✔</span></div><div class="dz-error-mark"><span>✘</span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div>'
			}
		}

		$('.popups .close').click(function () {
			$(this).parents('.popups').fadeOut('slow');
			$('body').removeClass('space');
			$('html').removeAttr('style');
			return false;
		});
		$('.keyup').each(function () {
			$(this)[0].onkeypress = function (e) {
				e = e || event;
				if (e.ctrlKey || e.altKey || e.metaKey) return;
				var chr = getChar(e);
				if (chr == null) return;
				if (chr < '0' || chr > '9') {
					return false;
				}
			};
		});


		function getChar(event) {
			if (event.which == null) {
				if (event.keyCode < 32) return null;
				return String.fromCharCode(event.keyCode) // IE
			}
			if (event.which != 0 && event.charCode != 0) {
				if (event.which < 32) return null;
				return String.fromCharCode(event.which)
			}
			return null;
		}

		function descr() {
			$('.r-descr').each(function () {
				var _ = $(this),
					item = _.find('li'),
					a = item.find('a'),
					status = _.next(),
					sItem = status.find('span'),
					inputs = _.parent().find('input'),
					timeout;


				if (_.find('li.active').length) {
					var index = +_.find('li.active').last().index();
					sItem.eq(index).addClass('status').siblings().removeClass('status');
					inputs.val(index + 1);
				}

				item.on('mouseenter', function () {
					clearTimeout(timeout);
					var index = $(this).index();
					sItem.eq(index).addClass('status').siblings().removeClass('status');
				});
				item.on('mouseleave', function () {
					timeout = setTimeout(function () {
						if (_.find('li.active').length) {
							var index = _.find('li.active').last().index();
							sItem.eq(index).addClass('status').siblings().removeClass('status');
						} else {
							sItem.removeClass('status');
						}
					}, 100);
				});
				a.on('click', function () {
					inputs.val($(this).parents('.rating').find('.active').length);
				});
			});
		}

		descr();

	});

	if ($('#map-delivery').length) {

		ymaps.ready(init);
		function init() {
			if (!$('#map-delivery').hasClass('init')) {
				$('#map-delivery').addClass('init')
				var wrap = $('#map-delivery');
				var mapdelivery = new ymaps.Map("map-delivery", {
						center: [55.73, 37.75],
						zoom: 9,
						controls: ['smallMapDefaultSet'],
					}, {

						balloonMaxWidth: 200
					}),
					moscowPolygon,
					moscowPolygon250;
				mapdelivery.behaviors.disable(['rightMouseButtonMagnifier', 'ruler', 'scrollZoom']);
				mapdelivery.controls.remove('typeSelector');
				mapdelivery.controls.remove('searchControl');
				mapdelivery.controls.remove('GeolocationControl');
				mymapdelivery = mapdelivery;
				var deliveryPlacemark = new ymaps.Placemark;
				deliveryPlacemark.options.set({
					iconLayout: 'default#image',
					iconImageHref: '/bitrix/templates/lidamebel_new/images/pin.png',
					iconImageSize: [65, 71],
					iconImageOffset: [-30, -70]
				});
				dplcmrk = deliveryPlacemark;
				mymapdelivery.geoObjects.add(dplcmrk);
				return mymapdelivery, mymapdelivery.geoObjects
			}

		}
	}
	AddressInput();

	var productPreview = document.querySelectorAll('.js-preview');
	productPrev = new PreviewPop(productPreview);
});
function AddressInput() {
	var addresBlock = $('.delivery-form'),
		serviceUrl = "https://suggestions.dadata.ru/suggestions/api/4_1/rs",
		token = "cbe87f04ccd3589f671dc797c04032e6ba0d30ba",
		type = "ADDRESS";
	$('.delivery-form .field__body').append('<div class="delivery-noty"></div>')
	var noty = $('.delivery-noty');
	addresBlock.each(function () {
		var _ = $(this),
			value, house, street, lat, lon,
			$region = _.find(".address-region"),
			$search = _.find(".js-velivery-btn"),
			$distanceRes = $('#delivery_distance'),
			$distancePrice = $('#delivery_price'),
			$distanceName = $('#delivery_address');
		$region.suggestions({
			serviceUrl: serviceUrl,
			token: token,
			type: type,
			hint: false,
			count: 7,
			addon: "clear",
			constraints: {
				locations: {country: "Россия"}
			},
			onSelect: function (suggestion) {
				value = suggestion;
				house = suggestion.data.house;
				city = suggestion.data.city;
				street = suggestion.data.street;
				chekval(house, city, street, noty)
				if (house != null && street != 0) {
					$search.removeClass('disabled');
					lat = suggestion.data.geo_lat;
					lon = suggestion.data.geo_lon;
					AddPlacemark(lat, lon, mymapdelivery, dplcmrk)

					if ("unrestricted_value" in suggestion) {
						var address = suggestion.unrestricted_value;
						$.ajax({
							type: "POST",
							url: "/bitrix/templates/lidamebel_new/ajax/distance.php",
							data: "address=" + address,
							dataType: "json",
							success: function (res) {
								var res = JSON.parse(res);
								ShowDistance(res.region_kladr_id, res.beltway_distance, $distanceRes, $distanceName, suggestion.value, $distancePrice);
							}
						});
					}
				} else {
					$search.addClass('disabled');
				}

			}
		});
	});
}
function chekval(house, city, street, noty) {
	if (city == null && street == null && house == null) {
		noty.text('Введите город')
	} else if (city != null && street == null && house == null) {
		noty.text('Введите улицу')
	} else if (city !== null && street != null && house == null) {
		noty.text('Введите дом')
	} else {
		noty.text('')
	}
}
//в принйипе, можешь расширить эту функцию , чтобы пихать инфу во все поля
function ShowDistance(region, km, container, containername, name, price) {
	// console.log(km)
	var box = $('.box_attention-mapresult');
	containername.text(name + '*')
	if (km != 0) {
		var pricecalc = 1250 + (30 * km);
		price.text('' + pricecalc + ' рублей');
		container.text('' + km + ' км от МКАД')
		$('#delivery_annotation').css('display', 'none');
	} else {
		if (region == 7700000000000) {
			price.text('1250 руб.');
			container.text('В пределах МКАД');
			$('#delivery_annotation').css('display', 'none');
		} else if (region == 5000000000000) {
			var pricecalc = 1250 + (30 * km);
			price.text('' + pricecalc + ' рублей');
			container.text('' + km + ' км от МКАД')
			$('#delivery_annotation').css('display', 'none')
		} else {
			price.text('Уточняйте у менеджера');
			container.text('');
			$('#delivery_annotation').css('display', 'block');
		}
	}


	box.show();

}

function AddPlacemark(lat, lon, mymapdelivery, placemark) {
	// mymapdelivery.panTo([lat,lon],{
	// 	flying: true
	// }
	// );

	placemark.geometry.setCoordinates([lat, lon]);
	mymapdelivery.setCenter([lat, lon])

}

$(window).load(function () {
	$('.preloader').hide();
});

$(document).click(function (e) {

	if (!$(e.target).parents('#popup-wrapper').length) {
		if ($popupWrapper.hasClass('active')) {
			$popupWrapper.removeClass('active');
		}
	}
});

function initFancyBox() {
	if ($('.product__gallery a[rel]').length) {
		$('.product__gallery a[rel]').fancybox({
			padding: 0,
			margin: 0,
			afterLoad: function () {
				swipes();
			}
		});
	}
	if ($('#article a[rel]').length) {
		$('#article a[rel]').fancybox({
			padding: 0,
			margin: 0,
			afterLoad: function () {
				swipes();
			}
		});
	}
	if ($('.certificates-rotator').length) {
		$('.certificates-rotator a').fancybox({
			padding: 0,
			margin: 0,
			afterLoad: function () {
				swipes();
			}
		});
	}
}
function swipes() {

	var lastX = 0;
	var touchEvents = false;

	$(".fancybox-wrap").on("touchstart", function (event) {
		var e = event.originalEvent;
		touchEvents = false;
		lastX = e.touches[0].pageX;
	});
	$(".fancybox-wrap").on('touchmove', function (event) {
		var e = event.originalEvent;
		event.preventDefault();
		if (!touchEvents) {
			if (e.touches[0].pageX > lastX + 150) {
				$.fancybox.prev();
			} else if (e.touches[0].pageX < lastX - 150) {
				$.fancybox.next();
			}
		}

	});
}
// function OpenWin(id) {
// 	$('#overlay').fadeIn(400);
// 	$('#' + id).fadeIn(400);
// }
function OpenWin(id) {
	$('#' + id).fadeIn(400);
	$('body').addClass('space');
	$('html').css('overflow', 'hidden');
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
	 var image = new google.maps.MarkerImage('/bitrix/templates/lidamebel_new/images/pin.png',
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
			}, {
				iconLayout: 'default#image',
				iconImageHref: '/bitrix/templates/lidamebel_new/images/pin.png',
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
		 var image = new google.maps.MarkerImage('/bitrix/templates/lidamebel_new/images/pin.png',
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
		setTimeout(function () {
			var myMap = new ymaps.Map('gmap2', {
					center: [55.872599, 37.434887],
					zoom: 14,
					controls: ['zoomControl']
				}),
				myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
					//hintContent: 'г. Москва, ул. Свободы, 103, стр. 8',
					//balloonContent: 'г. Москва, ул. Свободы, 103, стр. 8'
				}, {
					iconLayout: 'default#image',
					iconImageHref: '/bitrix/templates/lidamebel_new/images/pin.png',
					iconImageSize: [65, 71],
					iconImageOffset: [-30, -71]
				});
			myMap.geoObjects.add(myPlacemark);
			myMap.behaviors.disable('scrollZoom');
		}, 300);
	}
}

// function PreviewPop(el){
// 	this.el = el;
// 	this.options = {
// 		modal: 'preview-popup',
// 		bodyCls: 'space',
// 		bodyCls2: 'blur',
// 		showModal: 'open-modal',
// 		closeModal: '.closeel',
// 		contentCont: '.js-prev-popup',
// 		preload: '.preloader',
// 		prlCls: 'success'
// 	}
// 	this.prev;
// 	this.init();
// }
// PreviewPop.prototype = {
// 	init: function(){
// 		this.body = document.body;
// 		this.modal = document.getElementById(this.options.modal);
// 		this.preloader = this.modal.querySelector(this.options.preload);
// 		this.contentContainer = this.modal.querySelector(this.options.contentCont);
// 		this.elements = this.el;
// 		this.eventHandler();
// 	},
// 	eventHandler: function(){
// 		var self = this;
// 		var lng = this.elements.length;
// 		for(i = 0; i < lng; i++){
// 			this.elements[i].addEventListener('click', function(event){
// 				var val = this.getAttribute('data-target');
// 				self.openModal(val);
// 				self.addCloseEvent();
// 			});
// 		}
// 	},
// 	openModal: function(target){
// 		this.modal.classList.add(this.options.showModal);
// 		this.body.classList.add(this.options.bodyCls);
// 		this.body.classList.add(this.options.bodyCls2);
// 		if(target != this.prev){
// 			this.ajxRequest(target);
// 		}else{
// 			this.preloader.classList.add(this.options.prlCls);
// 		}
// 		this.closeSel = this.modal.querySelector(this.options.closeModal);
// 	},
// 	addCloseEvent: function(){
// 		var self = this;
// 		this.closeSel.onclick = function() {
// 			self.closeModal();
// 		}
// 		this.modal.onclick = function() {
// 			self.closeModal();
// 		}
// 		this.contentContainer.onclick = function(e) {
// 			e.stopPropagation()
// 		}
// 	},
// 	closeModal: function(){
// 		var self = this;
// 		this.modal.classList.remove(this.options.showModal);
// 		this.body.classList.remove(this.options.bodyCls);
// 		this.body.classList.remove(this.options.bodyCls2);
// 		setTimeout(function(){
// 			self.preloader.classList.remove(self.options.prlCls);
// 		},300)
// 	},
// 	ajxRequest: function(link){
// 		var self = this;
// 		var loader = this.preloader;
// 		var cont = this.contentContainer;
// 		$.ajax({
// 			url: '/bitrix/templates/lidamebel_new/ajax/fast_view.php',
// 			data: {'ID' : link},
// 			dataType: "html",
// 			error: function(){
//
// 			},
// 			success: function(content) {
// 				var mainContent = $(content).html();
// 				$(cont).html(mainContent).promise().done(function(){
// 					Wish();
// 					addtobasket();
// 					var gallery = $('.js-gallery'),
// 						gallery__pager = $('.gallery__pager');
//
// 					gallery.slick({
// 						arrows: false,
// 						asNavFor: '.gallery__pager',
// 						fade: true,
// 						swipe: false
// 					});
// 					gallery__pager.slick({
// 						arrows: false,
// 						slidesToShow: 3,
// 						slidesToScroll: 3,
// 						variableWidth: true,
// 						focusOnSelect: true,
// 						asNavFor: '.js-gallery'
// 					});
// 					loader.classList.add(self.options.prlCls);
// 					self.prev = link;
// 				});
// 			}
// 		})
// 	}
//
// }
function PreviewPop(el){
	this.el = el;
	this.options = {
		modal: 'preview-popup',
		bodyCls: 'space',
		bodyCls2: 'blur',
		showModal: 'open-modal',
		closeModal: '.closeel',
		contentCont: '.js-prev-popup',
		preload: '.preloader',
		prlCls: 'success',
		arr: ".arr"
	};
	this.prev;
	this.init();
}
PreviewPop.prototype = {
	init: function(){
		this.body = document.body;
		this.modal = document.getElementById(this.options.modal);
		this.preloader = this.modal.querySelector(this.options.preload);
		this.contentContainer = this.modal.querySelector(this.options.contentCont);

		this.elements = this.el;
		this.eventHandler();
	},
	eventHandler: function(){
		var self = this;
		var lng = this.elements.length;
		for(i = 0; i < lng; i++){
			this.elements[i].addEventListener('click', function(event){
				var val = this.getAttribute('data-target');
				self.openModal(val);
				self.addCloseEvent();
			});
		}
	},
	openModal: function(target){
		this.modal.classList.add(this.options.showModal);
		this.body.classList.add(this.options.bodyCls);
		this.body.classList.add(this.options.bodyCls2);

		if(target != this.prev){
			this.ajxRequest(target);
		}else{
			this.preloader.classList.add(this.options.prlCls);
		}
		this.closeSel = this.modal.querySelector(this.options.closeModal);
	},
	addPrevNext: function(){
		this.arrows = this.modal.querySelectorAll(this.options.arr);
		if(this.arrows.length){
			for(i=0;i<this.arrows.length;i++){
				var arr = this.arrows[i];
				var arrT = arr.getAttribute('data-target');
				if(arrT === null){
					arr.classList.add('disabled');
				}else{
					this.addClickBlk(arr,arrT);
				}
			}
		}
	},
	addClickBlk: function(elem,target){
		var self = this;
		elem.addEventListener('click',function(event){
			event.preventDefault();
			self.ajxRequest(target);
		});
	},
	addCloseEvent: function(){
		var self = this;
		this.closeSel.onclick = function() {
			self.closeModal();
		}
		this.modal.onclick = function() {
			self.closeModal();
		}
		this.contentContainer.onclick = function(e) {
			e.stopPropagation()
		}
	},
	closeModal: function(){
		var self = this;
		this.modal.classList.remove(this.options.showModal);
		this.body.classList.remove(this.options.bodyCls);
		this.body.classList.remove(this.options.bodyCls2);
		setTimeout(function(){
			self.preloader.classList.remove(self.options.prlCls);
		},300)
	},
	ajxRequest: function(link){
		var self = this;
		var loader = this.preloader;
		var cont = this.contentContainer;
		$.ajax({
			// url: link,
			url: '/bitrix/templates/lidamebel_new/ajax/fast_view.php',
			data: {'ID' : link}, // , 'data' : JSON.stringify(fast_view_obj)
			dataType: "html",
			beforeSend: function(){
				loader.classList.remove(self.options.prlCls);
			},
			error: function(){

			},
			success: function(content) {
				var mainContent = $(content).html();
				$(cont).html(mainContent).promise().done(function(){
					Wish();
					addtobasket();
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
					setTimeout(function(){
						loader.classList.add(self.options.prlCls);
					},100)

					self.prev = link;
					self.addPrevNext();
				});
			}
		})
	}
}
$(function () {
	$('#ms_container').find('form').on('submit', function () {
		var $ys_container = $('#ys_container'),
			ms_val = $('#title-search-input').val();


		$ys_container.find('.ya-site-form__input-text').val(ms_val);
		$ys_container.find('.ya-site-form__submit').click();

		return (false);
	})
});
function cont() {
	if(typeof BX === "function" && BX.admin !== undefined){

	}else{
		$('body').bind('contextmenu', function(e) {
			return false;
		});
	}

}cont();
