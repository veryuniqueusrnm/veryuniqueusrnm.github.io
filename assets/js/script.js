// Debugging stuff
$(document).ready(function() {
    if (typeof jQuery !== 'undefined') {
        console.log("jQuery is loaded.");
        console.log("jQuery version:", jQuery.fn.jquery);
        if (jQuery.noConflict) {
            console.log("jQuery is in noConflict mode.");
        }
    } else {
        console.log("jQuery is not loaded.");
    }
});

// Cufon fix
var Cufon = {
	// Just for if cufon called somewhere, dont trow exception
	replace : function(){
		//console.log('cufon called!');
	}
};

// Get commit info
$(document).ready(function () {
    const username = "veryuniqueusrnm";
    const repo = "veryuniqueusrnm.github.io";
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits`;

    $.getJSON(apiUrl, function (data) {
        if (!data || data.length === 0) return;

        const latestCommit = data[0];
        const commitId = latestCommit.sha.substring(0, 7);
        const commitDate = new Date(latestCommit.commit.author.date).toLocaleDateString();
        const commitMessage = latestCommit.commit.message;
        const commitUrl = latestCommit.html_url;

        $("#commit-info").html(
            `Latest commit: <strong><a class="link" href="${commitUrl}" target="_blank">${commitId}</a></strong> // ${commitDate}`
        );
    }).fail(function () {
        console.error("Failed to fetch commit data.");
    });
});

/* MainPromoRotator (2011) */
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

// Script to display device details
$(document).ready(function () {
    function getBrowserAndDeviceDetails() {
        var userAgent = navigator.userAgent;
        var browserName, deviceType;

        // Detect browser
        if (userAgent.indexOf("Firefox") > -1) {
            browserName = "Mozilla Firefox";
        } else if (userAgent.indexOf("SamsungBrowser") > -1) {
            browserName = "Samsung Internet";
        } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            browserName = "Opera";
        } else if (userAgent.indexOf("Trident") > -1) {
            browserName = "Microsoft Internet Explorer";
        } else if (userAgent.indexOf("Edge") > -1) {
            browserName = "Microsoft Edge";
        } else if (userAgent.indexOf("Chrome") > -1) {
            browserName = "Google Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            browserName = "Apple Safari";
        } else {
            browserName = "Unknown Browser";
        }

        // Detect device
        if (/Mobi|Android/i.test(userAgent)) {
            deviceType = "Mobile";
        } else if (/Tablet|iPad/i.test(userAgent)) {
            deviceType = "Tablet";
        } else {
            deviceType = "Desktop";
        }

        return `You are using ${browserName} on a ${deviceType} device.`;
    }
    
    $("#browserDetails").text(getBrowserAndDeviceDetails());
});

//Jquery Include HTML
$(document).ready(function () {
    function includeHTML() {
        $('[include-html]').each(function () {
            var $this = $(this);
            var file = $this.attr('include-html');
            if (file) {
                $.ajax({
                    url: file,
                    method: 'GET',
                    success: function (data) {
                        $this.html(data);
                        console.log('Successfully included:', file);
                    },
                    error: function () {
                        console.error('Failed to include:', file);
                        $this.html('<div class="fallback">Content could not be loaded, using fallback. Please try again later.</div>');
                    },
                    complete: function () {
                        $this.removeAttr('include-html');
                        includeHTML();
                    }
                });
            }
        });
    }

    includeHTML();
});

$('<style>').prop('type', 'text/css').html(`
    .fallback {
        padding: 20px;
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
        border-radius: 5px;
        text-align: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        margin: 10px 0;
    }
`).appendTo('head');