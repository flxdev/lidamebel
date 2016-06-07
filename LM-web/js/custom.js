	function declOfNum(number, titles) {
		cases = [2, 0, 1, 1, 1, 2];
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
	}

	function setCookie(name, value, path, options) {
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
			updatedCookie += "; " + "path=" + path;
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
		setCookie(name, "", '/catalog/', {
			expires: -1
		});
	}

	function getCookie(name) {
		var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

$(document).ready( function() {
	function itemOpen() {
		$('.js-item-open').unbind('click');
		$('.js-open-all-items').unbind('click');
		eClick();
		var parent 	= $('.js-item'),
			block 	= parent.find('.js-item-text');
		if(getCookie('ShowAll')=="Y"){
			parent.addClass('is-active');
			block.slideDown(400);
		}
	}

	function eClick() {
		$('.js-item').each(function() {
			var this_ = $(this),
				block = this_.find('.js-item-text');
			if (this_.hasClass('is-active')) {
				block.show();
			}
		});
		$('.js-item-open').on('click', function() {
			var this_ 	= $(this),
				parents = this_.parents('.js-items'),
				parent 	= parents.find('.js-item'),
				block 	= parent.find('.js-item-text');
			if (!parent.hasClass('is-active')) {
				parent.addClass('is-active');
				block.slideDown(400);
				$('.js-open-all-items').prop('checked', true);
				setCookie('ShowAll', 'Y', '/catalog/');
			}
			else {
				deleteCookie('ShowAll');
				parent.removeClass('is-active');
				block.slideUp(400);
				$('.js-open-all-items').prop('checked', false);
			}
			return false;
		});
		$('.js-open-all-items').on('click', function() {
			var this_ 	= $(this),
				parent 	= $('.js-item'),
				block 	= parent.find('.js-item-text');
			if (this_.is(':checked')) {
				setCookie('ShowAll', 'Y', '/catalog/');
				parent.addClass('is-active');
				block.slideDown(400);
			}
			else {
				deleteCookie('ShowAll');
				parent.removeClass('is-active');
				block.slideUp(400);
			}
		});
	} eClick();

	if(getCookie('ShowAll')=="Y"){
		$('.js-open-all-items').trigger('click');
	}

	$('.js-stock-items').on('click', function() {
		if ( $(this).is(':checked')) {
			setCookie('BITRIX_SM_STOCK', 'Y', '/catalog/');
		}
		else {
			deleteCookie('BITRIX_SM_STOCK');
		}
		if ( !$(this).hasClass('section')) {
			$.ajax({
				url: delPrm(window.location.href, 'brand'),
				success: function(data){
					replace = $(data).find('.ajax-catalog__area').html();
					$('.ajax-catalog__area').html(replace);
					SortBtn();
					itemOpen();
					spiner();
					addToBasket();
				}
			});
		}
	});

	if(getCookie('BITRIX_SM_STOCK')=="Y"){
		$('.js-stock-items').prop( "checked", true );
	}


	// spiner
	function spiner() {
		var number = $('.js-spiner');
		number.each(function(){
			if(!$(this).hasClass('init')){
				var max_number = +($(this).attr('data-max-number'));
				var min_number = +($(this).attr('data-min-number'));
				var koef = +($(this).attr('data-koef'));
				var forms = jQuery.parseJSON($(this).attr('data-forms'));
				var total_block = $(this).find('.and-that span');
				var input = $(this).find('input');
				var plus = $(this).find('.js-plus');
				var minus = $(this).find('.js-minus');
				var timeout;
				var string;
				var countbasketid = input.attr('id');
				plus.on('click', function(){
					var val = +(input.val());
					if (val >= max_number) {
						return false;
					}
					else {
						val += min_number;
						input.val(val);
						string = val*koef;
						string = string + ' ' + declOfNum(string, forms);
						total_block.html(string);
					}
					input.trigger('input');
					return false;
				});
				minus.on('click', function(){
					var val = +(input.val());
					if (val > min_number) {
						val -= min_number;
						input.val(val);
						string = val*koef;
						string = string + ' ' + declOfNum(string, forms);
						total_block.html(string);
					}
					else {
						input.val(min_number);
						total_block.html(min_number*koef);
						return false;
					}
					input.trigger('input');
					return false;
				});
				input.on("input", function(){
					var val = +$(this).val();
					if(val%min_number!==0){
						clearTimeout(timeout);
						timeout = setTimeout(function() {
							val = Math.round(val/min_number)*min_number;
							input.val(val);
							string = val*koef;
							string = string + ' ' + declOfNum(string, forms);
							total_block.html(string);
						}, 500);
					} else {
						string = val*koef;
						string = string + ' ' + declOfNum(string, forms);
						total_block.html(string);
					}
					if (val > max_number) {
						val = max_number;
						$(this).val(val);
						string = val*koef;
						string = string + ' ' + declOfNum(string, forms);
						total_block.html(string);
					}
					if (val == '' || val < min_number) {
						clearTimeout(timeout);
						timeout = setTimeout(function() {
							val = min_number;
							$(this).val(val);
							string = val*koef;
							string = string + ' ' + declOfNum(string, forms);
							total_block.html(string);
						}, 500);
					}
					if(input.hasClass('in-cart')){
						clearTimeout(timeout);
						timeout = setTimeout(function() {
							BX.showWait();
							var countbasketcount = input.val();
							countbasketcount = Math.round(countbasketcount/min_number)*min_number;
							var ajaxcount = countbasketid + '&ajaxbasketcount=' + countbasketcount;
							ajaxpost("/include/basket.php", ajaxcount, ".ajax-cart__area");
						}, 500);
					}
					if(input.hasClass('in-cart-del')){
						clearTimeout(timeout);
						timeout = setTimeout(function() {
							BX.showWait();
							var countbasketcount = input.val();
							countbasketcount = Math.round(countbasketcount/min_number)*min_number;
							var ajaxcount = countbasketid + '&ajaxbasketcount=' + countbasketcount;
							ajaxpost("/include/basket.php", ajaxcount, ".ajax-cart__area", function () {showsAccord();} );
						}, 500);
					}
				});
				input[0].onkeypress = function(e) {
					e = e || event;
					if (e.ctrlKey || e.altKey || e.metaKey) return;
					var chr = getChar(e);
					if (chr == null) return;
					if (chr < '0' || chr > '9') {
						return false;
					}
				};
				$(this).addClass('init');
			} else {
				return;
			}
		});
	}
	spiner();

	function ajaxpost(urlres, datares, wherecontent, callback){
		$.ajax({
			type: "POST",
			url: urlres,
			data: datares,
			dataType: "html",
			success: function(fillter){
				$(wherecontent).html(fillter);
				BX.closeWait();
				spiner();
				deleteProducts();
				if (!(callback && callback instanceof Function && typeof callback === 'function')) {
					return false;
				}
				callback(fillter);
			}
		});
	}

	function getChar(event) {
		if (event.which == null) {
			if (event.keyCode < 32) return null;
			return String.fromCharCode(event.keyCode); // IE
		}
		if (event.which != 0 && event.charCode != 0) {
			if (event.which < 32) return null;
			return String.fromCharCode(event.which);
		}
		return null;
	}

	function parseUrlQuery() {
		var data = {};
		if(location.search) {
			var pair = (location.search.substr(1)).split('&');
			for(var i = 0; i < pair.length; i ++) {
				var param = pair[i].split('=');
				data[param[0]] = param[1];
			}
		}
		return data;
	}

	function delPrm(Url,Prm) {
		var a=Url.split('?');
		if(a[1]){
			var re = new RegExp('(\\?|&)'+Prm+'=[^&]+','g');
			Url=('?'+a[1]).replace(re,'');
			Url=Url.replace(/^&|\?/,'');
			var dlm=(Url==='')? '': '?';
			return a[0]+dlm+Url;
		} else {
			return Url;
		}
	};

	$('select.js-multiple-select.brand').on("change",function() {
		var val = $(this).val(),
			arUrlParams =  delPrm(location.href, 'brand');
			arUrlParams = arUrlParams.split('?');
		if(arUrlParams[1]){
			var url = delPrm(location.href, 'brand') + '&brand='+val;
		}else{
			var url = delPrm(location.href, 'brand') + '?brand='+val;
		}
		$.ajax({
			url: url + '&ajax=Y',
			success: function(data){
				if( $(data).find('.items_equip.js-items.ajax').length > 0 ){
					replace = $(data).find('.items_equip.js-items.ajax').html();
					$('.items_equip.js-items.ajax').html(replace);
					itemOpen();
				} else if( $(data).find('.ajax-catalog__area').length > 0 ){
					replace = $(data).find('.ajax-catalog__area').html();
					$('.ajax-catalog__area').html(replace);
					SortBtn();
					itemOpen();
					spiner();
					addToBasket();
				}
			}
		});
	});

	$('select.min').on("change",function() {
		//var input = $(this).find("input");
		var val = $(this).val(),
			arr = parseUrlQuery();
		if(typeof arr.sort != 'undefined' && typeof arr != 'undefined'){
			if(val != "" && val){
				window.location.search = 'sort='+arr.sort+'&direction='+val;
			}else{
				window.location.search = 'sort='+arr.sort;
			}
		}else if(val != "" && val){
			window.location.search = 'direction='+val;
		}else{
			window.location = window.location.pathname;
		}
		//console.log(val);
	});
	$('select.place').on("change",function() {
		$(this).closest("form").submit();
	});

	function isHistoryApiAvailable() {
		return !!(window.history && history.pushState);
	}

	function SortBtn(){
		$('.js-sortin-item').on('click', function() {
			var this_ = $(this),
				parent = this_.parents('.js-sorting'),
				history_parent = this_.parents('.js-histoy'),
				item = parent.find('.js-sortin-item'),
				active = ('is-active'),
				activeTop = ('is-active-top'),
				url,
				sort_table,
				path,
				area = this_.parents('.scrolling__area').find('#product-table');

			area.addClass('ajaxed');
			if(this_.attr("data-sort")){
				var sort = this_.data("sort"),
					order = this_.data("order");
				sort_table = '?sort='+sort+'&order='+order;
				path = window.location.pathname;
				if(order == "asc"){
					this_.data('order', 'desc');
				}
				if(order == "desc"){
					this_.data('order', 'asc');
				}
			}
			if (!this_.hasClass(active)) {
				item.removeClass(active).removeClass(activeTop);
				this_.addClass(active);
			}
			else if (!this_.hasClass(activeTop)) {
				this_.removeClass(active).toggleClass(activeTop);
			}
			if(isHistoryApiAvailable()){
				if(sort_table && sort_table.length>0){
					url = path + sort_table;
				}else{
					url = $(this).attr('href');
				}
				$.ajax({
					url: url + '&ajax=Y',
					success: function(data){
						replace = $(data).find('.ajax-catalog__area').html();
						$('.ajax-catalog__area').html(replace);

						if(history_parent.length){
							SortBtn();
							accord();
							history_accord();
						} else if(sort_table && sort_table.length) {
							spiner();
							addToBasket();
							area.removeClass('ajaxed');
						} else {
							SortBtn();
							itemOpen();
							spiner();
							addToBasket();
						}
					}
				});

				if(url != window.location){
					window.history.pushState(null, null, url);
				}

				return false;
			}
		});
	}
	SortBtn();

	$(window).bind('popstate', function() {
		$.ajax({
			url:     window.location.href,
			success: function(data) {
			replace = $(data).find('.ajax-catalog__area').html();
			$('.ajax-catalog__area').html(replace);
			SortBtn();
			itemOpen();
			spiner();
			addToBasket();
			}
		});
	});

	$('.change-tpl').on('click', function(){
		var tpl = $(this).data('tpl'),
			btn = $(this),
			url = delPrm(window.location.href, 'brand');
		$.ajax({
			type: "POST",
			url: url,
			data: 'catalog_tpl=' + tpl,
			dataType: "html",
			success: function(fillter){
				$('.view__item').removeClass('is-active');
				$(btn).parent('.view__item').addClass('is-active');
				replace = $(fillter).find('.ajax-catalog__area').html();
				$('.ajax-catalog__area').html(replace);
				SortBtn();
				itemOpen();
				spiner();
				addToBasket();
			}
		});
		return false;
	});

	$('.change-tpl-cart').on('click', function(){
		var tpl = $(this).data('tpl'),
			btn = $(this);
		BX.showWait();
		$.ajax({
			type: "POST",
			url: window.location.href,
			data: 'cart_tpl=' + tpl,
			dataType: "html",
			success: function(fillter){
				$('.view__item').removeClass('is-active');
				$(btn).parent('.view__item').addClass('is-active');
				replace = $(fillter).find('.ajax-cart__area').html();
				$('.ajax-cart__area').html(replace);
				BX.closeWait();
				spiner();
				deleteProducts();

			}
		});
		return false;
	});

	$('.change-tpl-search').on('click', function(){
		var tpl = $(this).data('tpl'),
			btn = $(this);
		$.ajax({
			type: "POST",
			url: "/include/search.php",
			data: 'search_tpl=' + tpl,
			dataType: "html",
			success: function(fillter){
				$('.view__item').removeClass('is-active');
				$(btn).parent('.view__item').addClass('is-active');
				$('.ajax-search-input').trigger('input');
			}
		});
		return false;
	});
	function added(button, count) {
		var spin = button;

		spin.each(function(){
			var _ = $(this),
				btnAdd = '<button onclick="location.href=\'/basket/\';" class="btn btn_small"><i class="ico ico_add"></i>Добавлено</button>',
				btn = _.find('.btn_basket'),
				row = _.parents('.product-table__row'),
				parent = _.parents('.spinner__state'),
				spiner = _.parent('.spiner'),
				forms = jQuery.parseJSON(spiner.attr('data-forms')),
				btnCount = '<button onclick="location.href=\'/basket/\';" class="btn btn_small">' + count + ' ' + declOfNum(count, forms) + '</button>';
				if(row.hasClass('add') && _.hasClass('count')) {
					row.addClass('is-added');
					parent.empty().append(btnCount);
					return
				} else if(row.hasClass('add')) {
					row.addClass('is-added');
					parent.empty().append(btnAdd);
					return
				}

				//btn.on('click', function(){
					row.addClass('is-added');
					parent.empty().append(btnAdd).addClass('add');
					setTimeout(function(){
						parent.empty().append(btnCount).addClass('count');
					},2000);
				//});

		});
	};
	function addToBasket(){
		var b_ = $('.addtobasket');
		b_.each(function(){
			if(!$(this).hasClass('init')){
				$(this).addClass('init');
				$(this).on('click', function(){
					var $this = $(this),
						spiner = $this.parent(".spiner.js-spiner"),
						block = spiner.parent(".item__bot"),
						ajaxaddid = $(this).data('id'),
						str = '<button onclick="location.href=\'/basket/\';" class="btn btn_small added"><i class="ico ico_add"></i>Добавлено</button>',
						count = $(this).parent().find('.js-price-input').val();
						if($this.hasClass('line')){
							var block = spiner.parent(".point__right"),
								str = '<button onclick="location.href=\'/basket/\';" class="btn btn_small added in-list"><i class="ico ico_add"></i>Добавлено</button>';
						}
						if($this.hasClass('text')){
							var block = spiner.parent(".point__right"),
								str = '<button onclick="location.href=\'/basket/\';" class="btn btn_small added in-text"><i class="ico ico_add"></i>Добавлено</button>';
						}
						if($this.hasClass('inner')){
							var block = spiner.parent(".product__right"),
								str = '<button onclick="location.href=\'/basket/\';" class="btn btn_small added"><i class="ico ico_add"></i>Добавлено</button>';
						}
					$.ajax({
						type: "POST",
						url: "/bitrix/templates/ekt/includes/ru/small_basket.php",
						data: 'ajaxaction=add' + '&ajaxaddid=' + ajaxaddid + '&count=' + count,
						dataType: "html",
						success: function(){
							if($this.hasClass('short')){
								added($this, count);
							} else {
								spiner.hide();
								block.append(str);
							}
							/*
							setTimeout(function(){
								$('.btn_small.added').hide();
								spiner.show();
							},5000);
							$('.ajax-small-basket-menu').html(fillter);
							*/
						}
					});

					return false;
				});
			} else {
				return;
			}
		});
	}
	addToBasket();

	// delete products
	function deleteProducts(){
		$('.js-products').each(function() {
			var this_  	= $(this),
				btn 	= this_.find('.js-delete'),
				open 	= this_.find('.js-open'),
				reest 	= this_.find('.js-reest'),
				wrap 	= this_.find('.js-prod-wrap'),
				restoreAll =  this_.find('.js-prod-wrap .btn-open'),
				isLoad = this_.find('.js-scroll');
			btn.on('click', function() {
				// removal imitation
				var parent 	= $(this).parents('.js-products-item');
				parent.remove();
				// scroll height
				BX.showWait();
				var data = $(this).data("link");
				var ajaxcount = data;
				ajaxpost("/include/basket.php", ajaxcount, ".ajax-cart__area");

				setInterval(function() {
					var pane 		= this_.find('.jspPane'),
						paneHeight 	= pane.height(),
						cont 		= this_.find('.jspContainer');
					cont.css('height', paneHeight);
				}, 1);
				isLoad.addClass('is-load');
			});
			open.on('click', function() {
				this_.toggleClass('is-active');
				$(this).toggleClass('is-active');
				if (this_.hasClass('is-active')) {
					wrap.slideDown(300);
						setInterval(function() {
						var pane 		= this_.find('.jspPane'),
							paneHeight 	= pane.height(),
							cont 		= this_.find('.jspContainer');
						cont.css('height', paneHeight);
					}, 1);
				}
				else {
					wrap.slideUp(300);
				}
			});
			reest.on('click', function() {
				// add imitation
				var parent 	= $(this).parents('.js-products-item');
				parent.remove();
				// scroll height
				BX.showWait();
				var data = $(this).data("link");
				var ajaxcount = data;
				ajaxpost("/include/basket.php", ajaxcount, ".ajax-cart__area", function () {showsAccord();} );

				setInterval(function() {
					var pane 		= this_.find('.jspPane'),
						paneHeight 	= pane.height(),
						cont 		= this_.find('.jspContainer');
					cont.css('height', paneHeight);
				}, 1);
				isLoad.addClass('is-load');
			});
			restoreAll.on('click', function(){
				var names;
				names = getNames(reest);
				var ajaxcount = 'action=restoreAll&params='+names;
				ajaxpost("/include/basket.php", ajaxcount, ".ajax-cart__area", function () {showsAccord();} );
			});
		});
	}
	deleteProducts();

	function getNames(selector) {
		var names = [];
		$(selector).each(function() {
			names.push($(this).data('id'));
		});
		return names;
	}
	function showsAccord(){
		$('.js-products.is-delete').addClass('is-active');
		$('.js-products.is-delete').find('.js-prod-wrap').show();
	}

	function refreshinput(){

		$('.js-refresh-input').on('click', function() {
			var this_ 	= $(this),
				input 	= $('.js-search-input'),
				popup 	= this_.parents('.js-popup'),
				parent 	= this_.parents('.js-popup-par'),
				ajax_wrap = this_.parents('.js-popup').find('.search-wrap');
			if (input.val().length == 0) {
				$('.popup__in').removeClass('is-active');
				$('body').removeClass('is-hidden');
				parent.removeClass('is-open');
				popup.fadeOut(300);
				$('#srch-frm').trigger('reset');
				$('#srch').hide();
			}
			else {
				input.val("");
				ajax_wrap.empty();
			}
		});
		$('.popup').on('click', function(){
			if($(this).parents('.js-popup-par').hasClass('search')){
				$(this).find('.search-wrap').empty();
				$(this).find('.js-search-input').val('');
				$('#srch-frm').trigger('reset');
				$('#srch').hide();
			}
		});
	}
	refreshinput();


	$('.js-open-popup').on('click', function(){
		$('#srch').show();
		Placeholder();
		setTimeout(function(){
			$('.ajax-search-input').focus();
		},200);
	});

	$('input[name="type"]', '#srch-frm').on('click', function(){
		$('.ajax-search-input').trigger('input');
	});

	var timeout;
	$('.ajax-search-input').on('input', function(){
		var query = $(this).val(),
			_ = $(this),
			wrap = $(this).parents('.popup__in.is-active').find('.search-wrap'),
			type = $('input[name="type"]:checked', '#srch-frm').val();
		query = encodeURIComponent(query);
		clearTimeout(timeout);

		if(wrap.children().children().length === 0){
			wrap.empty();
			wrap.append('<div class="loader"></div>')
		} else {
			wrap.addClass('loader__pull')
		};
		timeout = setTimeout(function() {
			$.ajax({
				type: "POST",
				url: "/include/search.php",
				data: 'query=' + query + '&type=' + type,
				dataType: "html",
				success: function(fillter){
					$(wrap).html(fillter);
					spiner();
					itemOpen();
					addToBasket();
					wrap.removeClass('loader__pull');
				}
			});
		}, 1000);
		return false;
	});

	var ajax_load_status = 'N';
	$('.popup').on('scroll', function(){
		if($('.search-loader').data('page') < $('.search-loader').data('count')){
			var wH = $(window).height() + 20;
			var s = $('.js-popup-par').find('.search-wrap')[0].getBoundingClientRect().bottom;
			if(wH === s || wH > s){
				$('.search-loader').attr('style', 'opacity: 1; display:block;');
				if(ajax_load_status == 'N'){
					ajax_load();
				}
			}
		}
	});
	function ajax_load(){
		ajax_load_status = 'Y';
		var cur_page = $('.search-loader').data('page'),
			next_page = cur_page + 1,
			num_pagen = $('.search-loader').data('num');
			query_page =  $('.search-loader').data('query');
			type_page =  $('.search-loader').data('type');
		$('.search-loader').data('page', next_page);
		var url = '/include/search.php?PAGEN_' + num_pagen + '=' + next_page + '&query=' + query_page + '&type=' + type_page;
		$.ajax({
			url: url,
			data: {},
			dataType : "html",
			success: function (data, textStatus) {
			if($(data).find('.items.js-items').length){
				var data2 = $(data).find('.items.js-items').html();
				$('.items.js-items').append(data2);
			}else{
				var data2 = $(data).find('.srch-container').html();
				$('.srch-container').append(data2);
			}
				ajax_load_status = 'N';
				$('.search-loader').attr('style', 'opacity: 0; display:none;');
				spiner();
				itemOpen();
				addToBasket();
			}
		});
	}

	function triggerTabsSearch(){
		var check = $('.search-form__row').find('input:checked');
		if(check.val() === '1'){
			check.parents('.search-form__row').find('#srch').hide();
		}

		var lbl = $('.search-form__row').find('label');

		lbl.each(function(){
			var _ = $(this);
			_.on('click', function(){
				if($(this).find('input').val() === '1'){
					$(this).parents('.search-form__row').find('#srch').hide();
				}else {
					$(this).parents('.search-form__row').find('#srch').show();
				}
				Placeholder();
			});
		});
	}
	triggerTabsSearch();

	function accord() {
		$('.js-accord').each(function() {
			var this_ 	= $(this),
				block 	= this_.find('.js-accord-block'),
				input 	= this_.find('input, select');
			if (this_.hasClass('is-active')) {
				block.show();
			}
			input.on('change', function() {
				var this_ 	= $(this),
					parent 	= this_.parents('.js-accord');
				if (this_.val().length > 0) {
					parent.addClass('is-chenge')
				}
				else {
					parent.removeClass('is-chenge');
				};
			});
		});
		$('.js-accord-but').on('click', function() {
			var this_ 		= $(this),
				parent 		= this_.parents('.js-accord'),
				blockThis 	= parent.find('.js-accord-block'),
				accord 		= $('.js-accord'),
				block 		= accord.find('.js-accord-block');
			if (!parent.parents('.filter__block').hasClass('js-filter-block')) {
				//console.log('k');
				if (!parent.hasClass('is-active')) {
					accord.removeClass('is-active');
					block.stop().slideUp(250);
					parent.addClass('is-active');
					blockThis.stop().slideDown(250);
				}
				else {
					parent.removeClass('is-active');
					blockThis.stop().slideUp(250);
				}
			}
			else {
				if (!parent.hasClass('is-active')) {
					parent.addClass('is-active');
					blockThis.stop().slideDown(250);
				}
				else {
					parent.removeClass('is-active');
					blockThis.stop().slideUp(250);
				}
			}
			return false;
		});
	} accord();

	$('.js-accord .btn, .js-history-op').on('click',function(event) {
		event.stopPropagation();
	});

	function history_accord(){
		$('.js-accord .btn, .js-history-op').on('click',function(event) {
			event.stopPropagation();
		});
		$('.js-histoy').each(function() {
			var this_ 		= $(this),
				btn 		= this_.find('.js-history-op'),
				accord 		= this_.find('.js-accord'),
				tAcc 		= this_.find('.js-accord-but'),
				block 		= accord.find('.js-accord-block');
			btn.on('click', function() {
				var this_ 		= $(this),
					parent 		= this_.parents('.js-histoy'),
					classVal 	= parent.find('.js-accord.is-active').size(),
					clValLast 	= parent.find('.js-accord').size();
				if (!this_.hasClass('is-active')) {
					this_.addClass('is-active');
					this_.find('span').text('Cвернуть всю историю');
				}
				else {
					this_.removeClass('is-active');
					this_.find('span').text('Развернуть всю историю');
				}
				setTimeout(function(){
					if (!accord.hasClass('is-active')) {
						accord.addClass('is-active');
						block.stop().slideDown(250);
					}
					else if (classVal < clValLast) {
						accord.addClass('is-active');
						block.stop().slideDown(250);
					}
					else {
						accord.removeClass('is-active');
						block.stop().slideUp(250);
						btn.removeClass('is-active');
					}
					//console.log(classVal);
				}, 1);
				return false;
			});
			tAcc.on('click', function() {
				btn.removeClass('is-active');
				btn.find('span').text('Развернуть всю историю');
			});
		});
	}
	history_accord();


	(function(){
		if($('#perspective').length) {
			function scrollY() {
				return window.pageYOffset || docElem.scrollTop;
			}

			function mobilecheck() {
				var check = false;
				(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
				return check;
			}
			var docElem = window.document.documentElement,
			// support transitions
			support = Modernizr.csstransitions,
			// transition end event name
			transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'transition': 'transitionend'
			},
			transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
			docscroll = 0,
			// click event (if mobile use touchstart)
			clickevent = mobilecheck() ? 'touchstart' : 'mouseenter';

			function init() {
			var showMenu = $(".showMenu"),
				perspectiveWrapper = $('#perspective'),
				container = $('.container_n'),
				contentWrapper = $('.wrappers'),
				navi = $('.outer-nav'),
				attr;

				var timer;

				showMenu.on(clickevent, function(ev){
					//if ($(this).hasClass('open')) return
					attr = $(this).data('anim');
					ev.stopPropagation();
					ev.preventDefault();
					docscroll = scrollY();
					contentWrapper.css('top', (docscroll * -1) + 'px');
					$('html, body').scrollTop = 0;
					if(perspectiveWrapper.hasClass('modalview')){
						perspectiveWrapper.removeClass('modalview');
					}
					if(perspectiveWrapper.hasClass('effect-right')){
						perspectiveWrapper.removeClass('effect-right');
					}
					if(perspectiveWrapper.hasClass('effect-left')){
						perspectiveWrapper.removeClass('effect-left');
					}
					timer = setTimeout(function(){
						perspectiveWrapper.addClass('animate')
						perspectiveWrapper.addClass('modalview').addClass(attr);
					}, 500);
					//$(this).addClass('open');
				});

				showMenu.on("mouseleave", function(ev) {
					clearTimeout(timer)
					if (perspectiveWrapper.hasClass('animate')) {
						setTimeout(function(){
							perspectiveWrapper.removeClass('modalview').removeClass(attr);
						}, 210);
						$('html, body').scrollTop = docscroll;
						contentWrapper.css('top', '0px');
						perspectiveWrapper.removeClass('animate')

					}
					//$(this).delay(500).removeClass('open');
				});

				if(mobilecheck()) {
					perspectiveWrapper.on("touchstart", function(ev) {
						clearTimeout(timer)
						if (perspectiveWrapper.hasClass('animate')) {
							setTimeout(function(){
								perspectiveWrapper.removeClass('modalview').removeClass(attr);
							}, 210);
							$('html, body').scrollTop = docscroll;
							contentWrapper.css('top', '0px');
							perspectiveWrapper.removeClass('animate')

						}
						//$(this).delay(500).removeClass('open');
					});
				} else {
					perspectiveWrapper.on(clickevent, function(ev){
						return false;
					})
				}
			}

			init();
		}
	})();


	galleryImg();
	$(window).resize(function(){
		galleryImg();
	});
	function galleryImg() {

		$(".full-height").height($(window).height() - $('.header').height() - $('.footer').height() - 30);

		$('.slider_image')
		 		.width($('.wrap-container').width())
				.height($('.wrap-container').height());

		// Centered Vertically
		$('.valign').each(function(){
			$(this).css('padding-top', ($(this).parents('.slider_image').height()/2) - $('.thumb-nav').height());
			var left = ($(this).parents('.slider_image').width()/2 - $(this).width()/2);
			//if (left <=50) left = 50;
			$(this).css('left', left);

			//$(this).css('width', ($('.homepage').width()));
		});

		$('.img-fit').each(function(){
			var bg_main = $(this);
			var wrapper = $(this).parents('.slider_image');
			var wrapperWidth = $('.wrap-container').width();
			var wrapperHeight = $('.wrap-container').height() - $('.header').height()-$('.footer').height();

			bg_main
				.width(wrapperWidth)
				.height(wrapperHeight)
		});
	};

	$('.bx-filter-param-label').on('click', function(event){

		if($(this).hasClass("disabled")){
			return false;
			event.preventDefault();
		}
	});

	//form callback scroll to top after click

	function topCallback(){
		var accords = $('.accordions');
		if(accords.hasClass('is-contact')){
			var btn = accords.find('.js-accord-but');
			btn.on('click', function(){
			console.log(true)
				var _ = $(this),
				    t = accords.offset().top;

				setTimeout(function(){
					if(!_.parent().hasClass('is-active')) return false;
					$('html, body').animate({
						scrollTop: t
					}, 800);
				},250);
			});
		}
	}
	topCallback();

	//preload button

	$('.cab_dan').find('.btn').on('click', function(e){
		$(this).parent().addClass('sub');
		//e.preventDefault()
	});

	$('.js-fansy-gallery').fancybox({
		padding		: 0,
		openEffect  : 'fade',
		closeEffect : 'fade',
		maxHeight	: 650,
		autoHeight : true,
		autoWidth : true,
		nextEffect  : 'fade',
		prevEffect  : 'fade',
		margin: 100,
		beforeShow: function () {
			setTimeout(function(){
				$('.fancybox-wrap').addClass('is-active');
			}, 1);
			$('.fancybox-overlay, .fancybox-close').bind("click", function (e) {
				$('.fancybox-wrap').removeClass('is-active');
			});
			$('.fancybox-wrap').bind('click', function(event) {
				event.stopPropagation();
			});
		},
		onClosed: function() {
			$('.fancybox-wrap').removeClass('is-active');
		}
	});

	//placeholder
	function Placeholder(){
		var _ = $('.search-form__row').find('.radiobutton'),
		    val = _.find('input:checked').val(),
		    val = parseInt(val),
		    text1 = 'Введите название или артикул товара',
		    text2 = 'Введите ваш запрос';


		if(val === 2) {
			$('.js-search-input').attr('placeholder', text1);
		} else {
			$('.js-search-input').attr('placeholder', text2);
		}
	};
	Placeholder();


	(function($){
	    $.fn.imgLoad = function(callback) {
	        return this.each(function() {
	            if (callback) {
	                if (this.complete || /*for IE 10-*/ $(this).height() > 0) {
	                    callback.apply(this);
	                }
	                else {
	                    $(this).on('load', function(){
	                        callback.apply(this);
	                    });
	                }
	            }
	        });
	    };
	})(jQuery);
	$('img').imgLoad(function(){
    		//$(this).css('opacity', '1');
		$(this).animate(
			{
			opacity: "1"
		},250);
	});

	$('.nav__block').hover(function () {
		if ( $(this).find('.ul-o').length <= 0 && !$(this).hasClass('checked')) {
			$(this).addClass('checked');
			var block = $(this),
			icon = $(this).find('.nav__arr'),
			url = '/include/catalog_section_child.php',
			data = icon.data('id');
			$.ajax({
				type: "POST",
				url: url,
				data: "PARENT_ID="+data,
				dataType: "html",
				success: function(fillter){
					$(block).append(fillter);
				}
			});
		}
	});

	//table scroller
	(function(){
		var table_area = $('.js-scrolling__area'),
			scroller = table_area.find('.product-table-scroller__content'),
			table = table_area.find('.product-table').width(),
			container = table_area.find('.product__container-table'),
			tableScroll = table_area.find('#product-table'),
			hidden = table_area.find('.product-table-bar__scroll');

		// scroller.css('width', table - 291);
		if(container.hasClass('product__container-full')) {
			scroller.css('width', table);
		} else {
			scroller.css('width', table - 291);
		}

		if(table <= table_area.width()) {
			$('.product-table-scroller').addClass('product-table-scroller_hidden')
		} else {
			$('.product-table-scroller').removeClass('product-table-scroller_hidden');
		}

		scroller.parent().on('scroll', function(e){
			container.add(hidden).scrollLeft($(e.target).scrollLeft());
		});

		tableScroll.parent().on('scroll', function(e){
			scroller.parent().add(hidden).scrollLeft($(e.target).scrollLeft());
		});

		$('.product-table__cell_fake').each(function(){
			var _ = $(this),
				parent = _.parent(),
				pH = parent.height();

			_.css('height', pH);
		});

		$(document).scroll(function() {
			var scroll 		= $(this).scrollTop();
			if ($('#js-sheet').length) {
				$('#js-sheet').each(function () {
					var this_ 		= $(this),
						head 		= this_.find('.product__container-bar'),
						headHeight = head.innerHeight(),
						footer = this_.find('.product-table-scroller'),
						headPos 	= this_.offset(),
						footerPos = this_.offset(),
						widthSheet 	= this_.width(),
						heightSheet = this_.height(),
						point 		= headPos.top + (heightSheet - 278),
						pointScroller = headPos.top + heightSheet;

					if (scroll >= headPos.top) {
						head.addClass('is-fixed');
						head.width(widthSheet);
						if(scroll >= point) {
							head.addClass('is-opacity');
						}
						else {
							head.removeClass('is-opacity');
						}
					}
					else {
						head.removeClass('is-fixed');
					}


					if(scroll + $(window).height() >= headPos.top + headHeight) {
						footer.addClass('is-fixed');
						if(container.hasClass('product__container-full')) {
							footer.width(widthSheet);
						} else {
							footer.width(widthSheet-291);
						}
						if(scroll + $(window).height() >= pointScroller) {
							footer.addClass('is-absolute');
						}
						else {
							footer.removeClass('is-absolute');
						}
					} else {
						footer.removeClass('is-fixed');
					}

				});
			};
		});
		$(window).resize(function() {
			if ($('#js-sheet').length) {
				$('#js-sheet').each(function () {
					var this_ 		= $(this),
						head 		= this_.find('.product__container-bar'),
						footer = this_.find('.product-table-scroller')
						widthSheet 	= this_.width();
						head.width(widthSheet);
						if(container.hasClass('product__container-full')) {
							footer.width(widthSheet);
						} else {
							footer.width(widthSheet-291);
						}
				});
			};


			if(table <= table_area.width()) {
				$('.product-table-scroller').addClass('product-table-scroller_hidden');
			} else {
				$('.product-table-scroller').removeClass('product-table-scroller_hidden');
			}
		});

		if($('.slider-for__slide').length){
			$('.slider-for__slide .zoom_in').each(function(){
				$(this).parent().easyZoom({
					parent: '.product__slider'
				});
			});
			$('.slider-for__slide').on('click', function(event){ event.preventDefault(); });
		}

	})();

	function tech(){
		if($('.tech').length){
			$('.tech-item').fancybox({
				padding		: 30,
				openEffect  : 'fade',
				closeEffect : 'fade',
				maxWidth	: 800,
				nextEffect  : 'fade',
				prevEffect  : 'fade',
				beforeShow: function () {
					setTimeout(function(){
						$('.fancybox-wrap').addClass('is-active');
					}, 1);
					$('.fancybox-overlay, .fancybox-close').bind("click", function (e) {
						$('.fancybox-wrap').removeClass('is-active');
					});
					$('.fancybox-wrap').bind('click', function(event) {
						event.stopPropagation();
					});
				},
				onClosed: function() {
					$('.fancybox-wrap').removeClass('is-active');
				}
			})
		}
	};
	tech();

});