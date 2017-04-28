$(document).ready(function(){
	
	
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
	function Wish(){
		var trigger = $('.wish-link');

		trigger.each(function(){
			var _ = $(this);
			_.on('click',function(e){
				e.preventDefault();
				if(!_.hasClass('wished')){
					_.addClass('wished');
				}
				else{
					_.removeClass('wished');
				}
			})
		})

	} Wish();
	
	if($('#map-delivery').length){

		ymaps.ready(init);
		function init() {
			var wrap = $('#map-delivery');
			myMap = new ymaps.Map("map-delivery", {
					center: [55.73, 37.75],
					zoom: 9,
					controls: ['smallMapDefaultSet'],
				}, {

					balloonMaxWidth: 200
				}),
					moscowPolygon,
			    	moscowPolygon250;
				myMap.behaviors.disable(['rightMouseButtonMagnifier','ruler','scrollZoom']);
				myMap.controls.remove('typeSelector');
				myMap.controls.remove('searchControl');
				myMap.controls.remove('GeolocationControl');

			function onPolygonLoad250 (json) {
				moscowPolygon250 = new ymaps.Polygon(json.coordinates, {},{
					fillColor: '#e5ec0990',
					strokeWidth: 0
				});
				myMap.geoObjects.add(moscowPolygon250);
			}
			function onPolygonLoad (json) {
				moscowPolygon = new ymaps.Polygon(json.coordinates, {},{
					fillColor: '#0fe84d80',
					strokeWidth: 0
				});
				myMap.geoObjects.add(moscowPolygon);
			}
			$.ajax({
				url: '/local/templates/main/js/moscow20.json',
				dataType: 'json',
				success: $.proxy(onPolygonLoad250)
			});
			$.ajax({
				url: './js/moscow.json',
				dataType: 'json',
				success: $.proxy(onPolygonLoad)
			});
			return myMap
		}
	}
	AddressInput();
});
var ьнplacemark,myMap;
function AddressInput(){
	var addresBlock = $('.delivery-form'),
		serviceUrl = "https://suggestions.dadata.ru/suggestions/api/4_1/rs",
		token = "c1dfceac2bc6837d11061b8e48f5e6abcaf72adb",
		type = "ADDRESS";

	addresBlock.each(function(){
		var _ = $(this),
			value, house,lat,lon,
			$region = _.find(".address-region"),
			$search = _.find(".js-velivery-btn");
		$region.suggestions({
			serviceUrl: serviceUrl,
			token: token,
			type: type,
			hint: false,
			count: 7,
  			addon: "clear",
			onSelect: function(suggestion) {
		  		value = suggestion;
		  		house = suggestion.data.house;
		  		if(house != null){
					$search.removeClass('disabled');
					lat = suggestion.data.geo_lat;
					lon = suggestion.data.geo_lon;
		  			AddPlacemark(lat,lon,myMap)
					if("unrestricted_value" in suggestion){
						var address = suggestion.unrestricted_value;
						$.ajax({
							type: "POST",
							url: "/local/templates/main/ajax/distance.php",
							data: "address=" + suggestion.unrestricted_value,
							dataType: "json",
							success: function(res){
								var addr_input = _.find('.addr_dist');
								addr_input.val(res.distance);
								get_max_value();
							}
						});
					}
		  		}else{
		  			$search.addClass('disabled');
		  		}
			}
		});
	});
}
function AddPlacemark(lat,lon,myMap){
	// с большой вероятностью строчка ниже удалит еще и области, а не только метку
	myMap.geoObjects.removeAll();
	var placemark = new ymaps.Placemark([lat,lon]);
	myMap.geoObjects.add(placemark);
	// в теории эта строчка прведет карту к масштабу, который захватит и области и метку, если она выхожит далеко за пределы, но т.к. обастей я без сервера не увижу, пока все плохо
	myMap.setBounds(myMap.geoObjects.getBounds());
}