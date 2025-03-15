var Cufon = {
	// just for if cufon called somewhere, dont trow exception
	replace : function(){
		//console.log('cufon called!');
	}
};

/* main promo rotator */
(function($){

	$.fn.mainPromoRotator = function(options){

		return this.each(function(index, element){
			var currentPromoIndex = 0;
			var prevPromoIndex = 0;
			var animated = false;
			var $element = $(element);
			var $promos = $element.find('div.promos ul li');
			var numPromos = $promos.size();
			var timer;
			var numLoadedImages = 0;

			var onMenuItemClick = function(event){
				changePromo($(this).parent().index());

				event.stopPropagation();
				event.preventDefault();
			};

			var getDelayValue = function($promo){
				return Number($promo.attr('data-delay')) == 0 ? 5000 : Number($promo.attr('data-delay')) * 1000;
			};

			var changePromo = function(promoIndex){
				var $currentPromo, $prevPromo, delay;

				if(currentPromoIndex == promoIndex){
					return;
				}

				currentPromoIndex = promoIndex;
				$prevPromo = $element.find('div.promos ul li').eq(prevPromoIndex);
				$currentPromo = $element.find('div.promos ul li').eq(promoIndex);
				$element.removeClass('dark-theme light-theme').addClass($currentPromo.attr('class'));

				$promos.each(function(i, promo){
					var $this = $(this);
					$this.stop();

					if(i == prevPromoIndex){
						$this.css('z-index', numPromos + 1);
					}else if(i == currentPromoIndex){
						$this.css({
							'z-index' : numPromos + 2,
							'opacity' : 0
						});
					}else{
						$this.css('z-index', i);
					}
				});

				$currentPromo.animate({
					'opacity' : 1
				}, 700, function(){
					animated = false;
				});

				prevPromoIndex = currentPromoIndex;

				$element.find('ul.menuItems li.active').removeClass('active');
				$element.find('ul.menuItems li').eq(currentPromoIndex).addClass('active');
				Cufon.replace($element.find('ul.menuItems li a'));
				nextItemTiming(getDelayValue($currentPromo));
			};

			var nextItemTiming = function(delay){
				clearTimeout(timer);
				timer = setTimeout(function(){
					if(currentPromoIndex < numPromos - 1){
						changePromo(currentPromoIndex + 1);
					}else{
						changePromo(0);
					}
				}, delay);
			};

			var setMenuItemsScrollable = function(){
				var menuitemsListW = 0;
				var scrollable;

				Cufon.replace($element.find('ul.menuItems li a'));

				$element.find('ul.menuItems').jcarousel({
					animation: 700,
					easing: 'easeOutExpo'
				});

				$element.find('ul.menuItems li').each(function(){
					menuitemsListW += $(this).outerWidth();
				});

				scrollable = menuitemsListW > $element.find('.jcarousel-clip').width();

				if(scrollable){
					$element.addClass('menuitems-scrollable');
				}else{
					$element.find('ul.menuItems')
						.width($element.find('.jcarousel-clip').width() + 700)
						.append(
							$('<li class="placeholder"></li>')
								.width(700)
								.css('padding', 0)
						);
				}
			};

			setMenuItemsScrollable();
			$element.find('ul.menuItems a').click(onMenuItemClick);
			$element.find('ul.menuItems li:first-child').addClass('active');
			$element.find('div.promos ul li:first-child').show().css('z-index', numPromos);
			nextItemTiming(getDelayValue($element.find('div.promos ul li:first-child')));
		});

	};

})(jQuery);
/* /main promo rotator */