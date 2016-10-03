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
})