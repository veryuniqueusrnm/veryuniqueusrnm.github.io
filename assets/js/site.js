var Cufon = {
    // just for if cufon called somewhere, dont trow exception
    replace: function () {
        //console.log('cufon called!');
    }
};
var IE = /*@cc_on!@*/false;
var IE5 = (IE && (navigator['appVersion'].indexOf('MSIE 5') > 0)) ? true : false;
var IE6 = (IE && (navigator['appVersion'].indexOf('MSIE 6') > 0)) ? true : false;
var IE7 = (IE && (navigator['appVersion'].indexOf('MSIE 7') > 0)) ? true : false;
var IE8 = (IE && (navigator['appVersion'].indexOf('MSIE 8') > 0)) ? true : false;
var IE9 = (IE && (navigator['appVersion'].indexOf('MSIE 9') > 0)) ? true : false;


if (IE5 || IE6 || IE7 || IE8) {
    var console = { log: function () { } };
}

var site = function () {

    $(document).ready(function () {
        site.initialize();
    });

    return {

        hint: {
            htpl: '<div class="hint" id="hint">' + ((IE6) ? '<iframe frameborder="0" scrolling="no"></iframe>' : '') + '<div class="bg"></div><div class="inner">##hint##</div></div>',
            html: '',
            obj: null,
            show: function (o, e) {
                if (this.obj) { this.obj.remove(); }
                if (!o.hint) {
                    o.hint = o.title;
                    o.title = '';
                }
                this.html = String(this.htpl).split('##hint##').join(o.hint);
                this.obj = $(this.html);
                $('body').append(this.obj);
                this.obj.css({ 'left': e.pageX + 'px', 'top': (e.pageY - $('body').offset().top - this.obj.height()) + 'px' });
                $(o).mousemove(function (e) {
                    site.hint.obj.css({ 'left': e.pageX + 'px', 'top': (e.pageY - $('body').offset().top - site.hint.obj.height()) + 'px' });
                });
            },
            hide: function () {
                if (this.obj) {
                    this.obj.remove();
                }
            }
        },
        // /hint

        // showImage
        showImage: function (imgURL) {

            // new gallery
            var img = imgURL.split('/').pop().split('.').join('_');
            $('div#galleryhidden div.item a.' + img).trigger('click');
            return true;
            // /new gallery


            var imgPos = 0;

            var _phoneImages = phone_images.split(',');
            if (_phoneImages.length > 1) {
                // ha tobb kep van es lapozhato

                $('div#popupwrp a.next').unbind().click(function (e) {
                    e.preventDefault();

                    imgPos++;
                    if (imgPos > _phoneImages.length - 1) {
                        imgPos = 0;
                    }
                    _showPic(_phoneImages[imgPos]);

                });
                $('div#popupwrp a.prev').unbind().click(function (e) {
                    e.preventDefault();

                    imgPos--;
                    if (imgPos < 0) {
                        imgPos = _phoneImages.length - 1;
                    }
                    _showPic(_phoneImages[imgPos]);

                });

            } else {
                // ha csak 1 kep van
                $('div#popupwrp a.prev, div#popupwrp a.next').hide();
                $('div#popupwrp div.info').css('margin-left', 50);
            }

            /* ----------- kep lapozo ---------- */
            function _showPic(_imgURL) {
                $('div#popupwrp div.imageBox div.image img').attr({ 'src': _imgURL });
            }
            /* ----------- kep lapozo ---------- */


            $('div#popupwrp div.imageBox div.image img').attr({ 'src': _phoneImages[imgPos], 'title': 'Kattints a bezáráshoz' }).css({ width: 'auto', height: '', margin: '0 auto' }).click(function (e) {
                setTimeout(function () {
                    $('div#popupwrp a.prev, div#popupwrp a.next').show();
                    $('div#popupwrp div.info').css('margin-left', 0);
                }, 500);
                $("div#popupwrp div.popup a.close").click();
            });
            $('div#popupwrp div.imageBox span.title').html($(this).attr('title'));
            $('div#popupwrp div.imageBox span.description').html($(this).find('img').attr('alt'));
            $('div#popupwrp div.imageBox span.counter').empty();

            var _img = new Image();
            _img.onload = function () {
                if (_img.height > 420) {
                    $('div#popupwrp div.imageBox').addClass('big');
                }
                setTimeout(function () {
                    $('div#popupwrp div.imageBox div.image img, div#popupwrp div.imageBox div.viewer div.info div.image').css({ width: _img.width, height: _img.height + 'px', overflow: 'visible' });
                }, 1);

                if (IE6) {
                    site.pngFix($('div#popupwrp div.imageBox div.image img'));
                }


            }
            _img.src = _phoneImages[imgPos];

            $('<div id="fader"></div>').appendTo('body').fadeTo(500, 0.5, function () {
                if (IE)
                    $('div#popupwrp div.imageBox').show();
                else
                    $('div#popupwrp div.imageBox').fadeIn();

            });

            return false;

        },
        // /showImage

        // IE fixes
        IEfix: function () {
            if (IE) {
                setTimeout(function () {
                }, 10);
            }
            return false;
        },
        IE6fix: function () {
            if (IE6) {

                // png fix
                var pngFixElements = $('.item_phone img')
                    .add('div.submenu div.additional div.promo a.device img')
                    .add('body.mobilelist div.cont div.mobile img:not(.featured)')
                    .add('.box_product img')
                    .add('#news-scroll ul.items li img');

                site.pngFix(pngFixElements);
            }
            return false;
        },
        IE7fix: function () {
            if (IE) {
                var orderButton = $('body.mobilelist div.cont div.toolbar a.order');
                orderButton.find('span').css('float', 'left');
                orderButton.css('width', orderButton.width());
                orderButton.find('span').css('float', 'right');
                $('div.cont div.questionlist > ul, div.cont div.goodtoknow > ul').each(function () {
                    var _QLh = 0;
                    $(this).find('li').each(function () {
                        _QLh += $(this).height();
                    });
                    $(this).height(_QLh);
                });
            }
        },
        // /IE fixes
        
        pngFix: function (el) {
            el.each(function () {
                if ($(this).is('img')) {
                    $(this)[0].style.cssText = 'filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src="' + $(this).attr('src') + '")';
                    $(this).attr('src', '/i/none.gif');
                } else {
                    $(this).find('img')[0].style.cssText = 'filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src="' + $(this).attr('src') + '")';
                    $(this).find('img')[0].attr('src', '/i/none.gif');
                }
            });
        },
        selMainPage: function () {
            if ($('#selMainPage').length > 0) {
                $('#selMainPage').insertBefore('.container');
                setTimeout(function () {
                    var sMP = $('#selMainPage');
                    sMP.slideDown(300).find('.close').click(function (e) {
                        setCookie($(this).attr('rel'), 1, 365 * 5);
                        var h = -sMP.outerHeight() - parseInt(sMP.css('margin-bottom'));
                        sMP.animate({ marginTop: h, opacity: 0 }, 250, function () {
                            sMP.remove();
                        });
                        return false;
                    });
                    sMP.find('.ok').click(function () {
                        setCookie('startPage', $(this).attr('rel'), 365 * 5);
                        var h = -sMP.outerHeight() - parseInt(sMP.css('margin-bottom'));
                        sMP.animate({ marginTop: h, opacity: 0 }, 250, function () {
                            sMP.remove();
                        });
                        return false;
                    });
                }, 500);
            }
        },
        slider: function (selector, opts, content) {
            var _this = this;
            var obj = $(selector);
            obj.slider({
                range: 'min',
                min: opts.minmax[0],
                max: opts.minmax[1],
                value: opts.value || opts.minmax[0],
                step: opts.step || 1,
                slide: function (event, ui) {
                    if (typeof (opts.options) != 'undefined') {
                        event.target.children[0].value = "";
                        $(event.target).next('div.desc').find('p').html("&nbsp;");
                        for (var i in opts.options) {
                            if (opts.options[i] == content[ui.value]) {
                                event.target.children[0].value = i;
                                $(event.target).next('div.desc').find('p').html(content[ui.value]);
                                break;
                            }
                        }
                    } else {
                        event.target.children[0].value = content[ui.value];
                        //event.target.children[1].value = ui.values[1];
                    }
                },
                change: function (event, ui) {
                    _this.counter.update(-8, obj.attr('id'));
                }
            });
            obj.find('.min').val((opts.value && content[opts.value]) || content[0]);
            //obj.find('.max').val((opts.values && opts.values[1]) || opts.minmax[1]);
        },
        counter: function () {
            var display = '#soho-form-counter span';
            var cache = [];
            var maxtime = [];
            function gettotal() {
                return parseFloat($(display).html());
            }
            function update(number, id) { // id nem #id, csak azonosito. Akar 'name=' is lehet tobb radio eseten.
                if (cache[id]) return; // csak az elso kitoltesnel fut az update
                cache[id] = 1;
                $(display).text(gettotal() + (number));
            }
            return {
                update: update,
                addinputs: function (array) {
                    $.each(array, function (index, value) {
                        if ($.inArray(value, maxtime) == -1) {
                            maxtime.push(value);
                        }
                        $('[name*="' + value + '"]').one('click', function () {
                            update(-8, value);
                        });
                    })
                },
                settime: function () {
                    $(display).html(maxtime.length * 8);
                }
            }
        }(),
        initialize: function () {

            var a = null;
            var obj = null;
            var tmp = null;
            var sid = null;

            // common settings
            $('a._blank').click(function () {
                window.open(this.href);
                this.blur();
                return false;
            });
            $('input.autocomplete, form.autocomplete').attr('autocomplete', 'off');
            // /common settings

            // setashomepage
            $('div.setashomepage a').click(function () {
                if (IE) {
                    this.style.behavior = 'url(#default#homepage)';
                    this.setHomePage(this.href);
                } else {
                }
                return false;
            });
            // setashomepage

            // addtofavorites
            $('div.addtofavorites a').click(function () {
                if (window.sidebar) {
                    window.sidebar.addPanel(document.title, this.href, "");
                } else if (window.external) {
                    window.external.AddFavorite(this.href, document.title);
                }
                return false;
            });
            // addtofavorites

            // .opener
            $('.opener').click(function () {
                this.blur();
                $(this).closest('.openable').toggleClass('open');
                return false;
            });
            // /.opener

            // head.menu megadropdown
			setTimeout(function() {
				$('div.head div.menu > ul > li:gt(1) div.submenu').addClass('reverse');
				$('div.head div.menu > ul > li').each(function(i) {
					var sm = $(this).find('div.submenu').eq(0);
					var smmi = $(this).find('div.submenu div.menuitems ul').eq(0);
					var fullwidth = false;

					//$(this).css({backgroundPosition: '-' + String($(this).offset().left - $('div.head div.menu').offset().left + 120 - 10) + 'px 0px'});

					var smmi2 = $('<ul></ul>');
					tmp = false;
					if (!sm.parent().parent().parent().hasClass('has-single-column-submenu')) {
						sm.find('div.menuitems ul li').each(function() {
							if (($(this).offset().top+$(this).outerHeight() - smmi.offset().top > 234) || tmp) {
								$(this).appendTo(smmi2);
								tmp = true;
							}
						});
						if (tmp) {
							smmi.after(smmi2);
						}
					}

					if (sm.width() == 940) {
						fullwidth = true;
					}

					if (sm.length > 0) {
						var sm_mi = $(this).find('div.submenu > div.menuitems').eq(0);
						var sm_ad = $(this).find('div.submenu > div.additional').eq(0);
						sm.find('div.promo').each(function(i) {
							$(this).addClass((i%2==0) ? 'odd' : 'even');
						});

						if ((sm_mi.length < 0) && (sm_ad.length < 0)) {$(this).addClass('nosubmenu');}

					} else {
						$(this).addClass('nosubmenu');
					}

					if (!fullwidth && !sm.parent().parent().parent().hasClass('has-single-column-submenu')) {
						var pos = $(this).offset().left - $('div.head div.menu').offset().left - (Math.floor((sm.width() - 188) / 188) * 188);
						if (Math.floor(sm.width() / 188) == 1) {
							pos = pos - 10;
						}
						if (pos < -120) {
							pos = -120;
						} else if (pos + sm.width() + 130 > 940) {
							pos = pos - ((pos + sm.width() + 130) - 940);
						}
//						if (pos + sm.width() < $(this).offset().left - $('div.head div.menu').offset().left + $(this).innerWidth()+10) {
//							pos += 40;
//						}
						sm.css({left: pos});
						sm.find('div.submenu-end').css({right: -10});
						sm.addClass('col' + Math.floor(sm.width() / 188));
					}

					$(this).mouseenter(function(e) {
						e.preventDefault();
						e.stopPropagation();
//						$(this).stop().animate({
//							opacity:1
//						}, 150, function() {
							sm.find('div.submenu-end').show();
							sm.show();
							$(this).addClass('hover');
//						});
					}).mouseleave(function(e) {
						sm.find('div.submenu-end').hide();
						sm.hide();
						$(this).removeClass('hover');//.stop();
					});

				});

				// sidemenu
				$('div.side div.menu li.open > a b').append('<ins class="open"></ins>');
				$('div.side div.menu li.active > a b').append('<ins class="topleft"></ins><ins class="botleft"></ins>');

				if($('div.head div.menu.has-single-column-submenu').size() > 0){
					$('div.head div.menu.has-single-column-submenu ul li div.menuitems').each(function(){
						var $li = $(this).parent().parent();
						//$li.css('background-position', '0 0');
					});
				}

			}, 500);
			// /head.menu megadropdown

            // borderbox
            $('div.cont div.borderbox').each(function () {
                $(this).prepend('<div class="bg"><div class="tl"></div><div class="t"></div><div class="tr"></div><div class="r"></div><div class="br"></div><div class="b"></div><div class="bl"></div><div class="l"></div></div>');
            });
            // /borderbox

            // highlight
            $('div.content p.highlight1, div.content p.highlight2, div.content p.highlight3, div.content p.highlight4').each(function () {
                $(this).wrap('<div class="highlight ' + this.className + '"></div>');
            });
            // /highlight

            // tabsheet handling
            if (document.location.toString().indexOf('pdf=1') == -1) {
                $('div.cont div.tabsheet').each(function () {
                    $(this).addClass('tabsheetHandler');
                    if (($(this).parents('.tabsheetHandler').length == 0) && (!$(this).hasClass('nojs'))) {
                        var tmp = '';
                        $(this).find('div.tab').each(function (i) {
                            tmp += '<li class="t' + i + '"><a href="#" class="' + this.className.split('tab').join('') + ' tab t' + i + '"><b>' + $.trim($(this).text()) + '</b></a></li>';
                            $(this).remove();
                        });
                        $(this).prepend('<div class="tabs"><ul>' + tmp + '</ul></div>');
                        $(this).find('div.sheet').each(function (i) {
                            $(this).addClass('s' + i);
                        });
                        if (this.className.indexOf('ts') < 0) {
                            $(this).addClass('ts0');
                        }
                    }
                });
            }
            $('div.cont .tabsheetHandler .tab').live('click', function () {
                this.blur();
                $(this).parent().find('input').blur();
                var ts0 = $(this).parents('.tabsheetHandler').eq(0).attr('class').split('ts')[1];
                ts0 = (ts0) ? ts0.substr(0, 1) : '';
                var ts1 = $(this).attr('class').split('tab t')[1];
                ts1 = (ts1) ? ts1.substr(0, 1) : '';
                $(this).parents('.tabsheetHandler').eq(0).removeClass('ts' + ts0);
                $(this).parents('.tabsheetHandler').eq(0).addClass('ts' + ts1);

                if ($(this).hasClass('ajax')) {
                    var sheet = $(this).parents('.tabsheetHandler').eq(0).find('.sheet.s' + ts1);
                    //onTabChange($(this).parents('.tabsheet').eq(0).find('.sheet.s'+ts1));
                    var sheetIndex = String(sheet.attr('class')).split('sheet s')[1];
                    //					alert(sheetIndex);
                }
                site.IEfix();
                if (this.nodeName.toLowerCase() == 'a') {
                    return false;
                }
            });
            $('div.cont .tabsheetHandler .force').trigger('click');
            // /tabsheet handling

            // tabshee4 handling (closable tabs)
            if ($('div.cont .tabsheet4').length > 0) {
                $('div.cont .tabsheet4 .openSearch, div.cont .tabsheet4 .tab').click(function (e) {
                    e.preventDefault();
                    var s = $('.tabsheet4 div.sheet');

                    if (s.hasClass('closed')) {
                        s.removeClass('closed');
                        $('div.cont .tabsheet4 .openSearch').addClass('up');
                    } else {
                        // ha a ki/becsuko gomb
                        if ($(this).hasClass('openSearch')) {
                            s.addClass('closed');
                            $('div.cont .tabsheet4 .openSearch').removeClass('up');
                        }
                    }

                });
            }
            // /tabshee4 handling (closable tabs)

            // slideDown
            $('.slide-content').wrap('<div class="slide-hide" style="display:none;"></div>');
            $('.slide-title').bind('click', function (e) {
                $(this).toggleClass('open').next().slideToggle();
            });

            // slideDown2
            $('.grey-slide-content').each(function (i) {
                $(this).wrap('<div class="grey-slide-hide" style="display:none;"></div>');
            });

            $('.slide-group .grey-slide-hide').eq(0).show()
                .prev('.grey-slide-title').addClass('open');

            $('.grey-slide-title, .green-slide-title').bind('click', function (e) {
                $(this).toggleClass('open').next().slideToggle();
            });

            // custom scrollbar
            if ($('.tinyscrollbar').length) {
                $('.tinyscrollbar').tinyscrollbar({ sizethumb: 21 })
            }
            // condense floated items
            $('.condensed').each(function () {
                obj = $(this);
                a = Array();
                tmp = null;
                obj.find('> *').each(function (i) {
                    if (a[$(this).offset().left]) {
                        tmp = a[$(this).offset().left];
                        $(this).css({ 'marginTop': - ($(this).offset().top - (tmp.offset().top + tmp.outerHeight()) - 2 * ($(this).outerHeight(true) - $(this).height())) + 'px' });
                    }
                    a[$(this).offset().left] = $(this);
                });
            });
            // condense floated items

            // table handling
            $('div.content table')
                .not('.normal')
                .not('div.content table.hipernet-table-1-slider1')
                .not('div.content table.hipernet-table-1-lime-slider1')
                .not('div.content table.hipernet-table-2-slider1')
                .not('div.content table.hipernet-table-3-slider1')
                .not('div.content table.hipernet-table-1-fullwide')
                .not('div.content table.hipernet-table-1-lime-fullwide')
                .not('div.content table.hipernet-table-2-fullwide')
                .not('div.content table.hipernet-table-3-fullwide')
                .not('div.content table.hipernet-table-3-private-fullwide')
                .each(function () {
                    $(this).wrap('<div class="table ' + $(this).attr('class') + '"></div>');
                    $(this).find('tbody tr:first').addClass('first');
                    if (!$(this).hasClass('lines')) {
                        if ($(this).find('tbody tr.odd, tbody tr.even').length == 0) {
                            $(this).find('tbody tr').each(function (i) {
                                $(this).addClass((i % 2 == 0) ? 'odd' : 'even');
                            });
                        }
                    }
                    $(this).find('tbody td').each(function () {
                        if (($(this).attr('colspan') > 1) && !$(this).hasClass('center')) { $(this).addClass('center'); }
                        if (($(this).attr('rowspan') > 1) && !$(this).hasClass('middle')) { $(this).addClass('middle'); }
                    });

                    if ($(this).hasClass('detailed')) {
                        $(this).find('tr td a.bull.dn').click(function () {
                            this.blur();
                            $(this).toggleClass('dn').toggleClass('up');
                            $(this).parents('tr:eq(0)').next('tr.details').toggleClass('closed');
                            return false;
                        });
                        $(this).find('tr.details').addClass('closed');
                    }
                });
            // /table handling

            // form handling
            if ($('div.content form').length > 0) {
                $('div.content > form div.field, div.content > div.inner > form div.field').addClass('rounded');
                $('div.content form input:file').each(function () {
                    $(this).parents('div.file').eq(0).find('input:text').attr('readonly', 'readonly');
                    $(this).parents('div.file').eq(0).find('input:text').attr('value', $(this).attr('value').split('/').pop().split('\\').pop());
                    $(this).mouseout(function () {
                        $(this).parents('div.file').eq(0).find('input:text').attr('value', $(this).attr('value').split('/').pop().split('\\').pop());
                    });
                });
            }
            $('div.cont select:not([multiple]):not(.hidden)').each(function () {
                $(this).parent().find('input:text').attr('readonly', 'readonly');
                $(this).parent().find('input:text').attr('value', $(this).find('option:selected').text());
                $(this).parent().find('span.optiontext').text($(this).find('option:selected').text());
                $(this).change(function () {
                    $(this).parent().find('input:text').attr('value', $(this).find('option:selected').text());
                    $(this).parent().find('span.optiontext').text($(this).find('option:selected').text());
                });
            });
            // /form handling

            // rounded handling
            if (!IE6) {
                $('div.cont div.promo').prepend('<div class="tl"></div><div class="bl"></div>');
                $('div.content div.sider div.box').prepend('<div class="tl"></div><div class="bl"></div><div class="tr"></div><div class="br"></div>');
                $('img.rounded').wrap('<div class="rounded"></div>');
                $('.rounded:parent').append('<div class="tl"></div><div class="bl"></div><div class="tr"></div><div class="br"></div>');
                $('.roundedleft').append('<div class="tl"></div><div class="bl"></div>');
                $('.roundedright').append('<div class="tr"></div><div class="br"></div>');
            }
            // /rounded handling

            // hint
            $('.hashint[title!=""]').hover(
                function (e) {
                    site.hint.show(this, e);
                },
                function () {
                    site.hint.hide();
                }
            );
            // /hint

            // slider
            if ($('.slider').length > 0) {

                var sliderMin = parseInt($('#min-price').val());
                var sliderMax = parseInt($('#max-price').val());
                var sliderMinInit = parseInt($('#min-price-init').val()) || sliderMin;
                var sliderMaxInit = parseInt($('#max-price-init').val()) || sliderMax;
                var _price_span = $('.mobile-price span.price');
                var _price_span_pos = 0;

                $('.slider').slider({
                    range: true,
                    values: [sliderMinInit, sliderMaxInit],
                    step: 1000,
                    min: sliderMin,
                    max: sliderMax,
                    slide: function (event, ui) {

                        var minPercent = (ui.values[0] * 100) / (sliderMax - sliderMin);
                        var maxPercent = (ui.values[1] * 100) / (sliderMax - sliderMin);

                        _price_span.html(ui.values[0] + ' Ft – ' + ui.values[1] + ' Ft');
                        $('#min-price').val(ui.values[0]);
                        $('#max-price').val(ui.values[1]);

                        _price_span_pos = (minPercent + (maxPercent - minPercent) / 2) / 100 * 338 - parseInt(_price_span.width()) / 2;

                        if (_price_span_pos < 0) {
                            _price_span_pos = 0;
                        } else if (_price_span_pos > 338 - parseInt(_price_span.width())) {
                            _price_span_pos = 338 - parseInt(_price_span.width());
                        }

                        _price_span.css('margin-left', _price_span_pos);
                    }
                });

                _price_span.html(sliderMinInit + ' Ft – ' + sliderMaxInit + ' Ft');
                var minPercent = (sliderMin * 100) / (sliderMax - sliderMin);
                var maxPercent = (sliderMax * 100) / (sliderMax - sliderMin);

                _price_span_pos = (minPercent + (maxPercent - minPercent) / 2) / 100 * 338 - parseInt(_price_span.width()) / 2;

                if (_price_span_pos < 0) {
                    _price_span_pos = 0;
                } else if (_price_span_pos > 338 - parseInt(_price_span.width())) {
                    _price_span_pos = 338 - parseInt(_price_span.width());
                }

                _price_span.css('margin-left', _price_span_pos);

            }

            // surveymonkey bezaro cucc
            $('#survey-close').click(function (e) {
                e.preventDefault();
                $('#surveyMonkeyInfo').hide();
                setCookie($(this).attr("class"), 1, 365 * 5);
            });

            // one-image popup
            if ($('a.zoomable').length > 0) {
                $('a.zoomable').click(function (e) {
                    e.preventDefault();
                    $('div#popupwrp a.next, div#popupwrp a.prev').css('visibility', 'hidden');
                    $('div#popupwrp div.imageBox div.image img').attr({ 'src': $(this).attr('href'), 'title': 'Click anywhere to close' }).click(function (e) {
                        setTimeout(function () {
                            $('div#popupwrp a.prev, div#popupwrp a.next').show();
                            $('div#popupwrp div.info').css('margin-left', 0);
                        }, 500);
                        $("div#popupwrp div.popup a.close").click();
                    });
                    var imgbox = $('#popupwrp .imageBox');
                    $('span.title', imgbox).html($(this).attr('title'));
                    $('span.description', imgbox).html($(this).find('img').attr('alt'));
                    $('span.counter', imgbox).empty();

                    $('<div id="fader"></div>').appendTo('body').fadeTo(500, 0.5, function () {
                        if (IE)
                            $('#popupwrp div.imageBox').show();
                        else
                            $('#popupwrp div.imageBox').fadeIn();
                    });

                });
            }

            // gallery close
            $('#fader').live('click', function (e) {
                setTimeout(function () {
                    var pw = $('#popupwrp');
                    $('a.prev, a.next', pw).show();
                    $('div.info', pw).css('margin-left', 0);
                }, 500);
                $("#popupwrp .popup .close").click();
            })

            $('ul#order-select-menu li').each(function () {
            });

            if ($('#login').length > 0) {
                $('#login').submit(function () {
                    this.blur();
                    var $UserName = $('#UserName');
                    var $Password = $('#Password');

                    $('#tollogin .field.error').removeClass('error');
                    if ('' == $UserName.val()) {
                        $UserName.closest('.field').addClass('error');
                    }
                    if ('' == $Password.val()) {
                        $Password.closest('.field').addClass('error');
                    }
                    if (('' == $UserName.val()) || ('' == $Password.val())) {
                        return false;
                    }
                });
            }

            site.selMainPage();
            scroller();
            site.IEfix();
            site.IE6fix();
            site.IE7fix();
            site.pageTracker();
            Overlay.initialize();

        }, // /initialize

    }
    // /return

}();
// /site

$.fn.embedVideoPlayer = function (videoData, thumbData, titleData) {
    swfobject.embedSWF("/assets/swf/player.swf", "flashcontent", "390", "220", "9.0.0", "/assets/swf/expressInstall.swf", { video: videoData, thumb: thumbData, title: titleData, colors: "0B9CD5,FFFFFF", autoplay: true }, { allowfullscreen: true, wmode: "transparent", bgcolor: "#FFFFFF", menu: true }, { id: "flashplayer" });
    return $(this);
};

$(function () {
    // toolbar archive dropdown select
    $("div.cont div.content div.toolbar div.archive div.archiveList div.drop").click(function () {
        $(this).toggleClass('on');
    });

    // popup closer
    $("#popupwrp .popup a.close").each(function () {
        $(this).click(function (e) {
            e.preventDefault();
            if (IE) {
                $('#popupwrp .popup, .androidApp').hide(0, function () {
                    $('#fader').fadeOut(function () {
                        $(this).remove();
                    })
                    $(this).find('object').remove();
                });
            }
            else {
                $('#popupwrp .popup, .androidApp').fadeOut(function () {
                    $('#fader').fadeOut(function () {
                        $(this).remove();
                    })
                });
            }
        });
    });

    // gallery image popup
    if ($(".cont .content .imageList").length > 0) {
        var _gallery = Array();
        var _selected = 0;
        $(".cont .content .imageList img").each(function () {
            _selected = 0;
            var _index = _gallery.length;
            var _name = ($(this).attr('src')).replace("164x112", "471x322");
            $(this).attr('index', _index);
            $(this).attr('view', _name);
            _gallery[_index] = $(this);
            _gallery[_index].click(function (e) {
                e.preventDefault();
                _selected = parseInt($(this).attr('index'));
                if (_selected == 0)
                    $('#popupwrp .imageBox a.prev').addClass('first');
                else
                    $('#popupwrp .imageBox a.prev').removeClass('first');
                if (_selected == (_gallery.length - 1))
                    $('#popupwrp .imageBox a.next').addClass('last');
                else
                    $('#popupwrp .imageBox a.next').removeClass('last');

                $('#popupwrp .imageBox .image img').attr({ 'src': $(this).attr('view'), 'title': 'Click anywhere to close' }).click(function (e) {
                    setTimeout(function () {
                        $('#popupwrp a.prev, #popupwrp a.next').show();
                        $('#popupwrp .info').css('margin-left', 0);
                    }, 500);
                    $("#popupwrp .popup a.close").click();
                });
                $('#popupwrp .imageBox span.title').html($(this).attr('title'));
                $('#popupwrp .imageBox span.description').html($(this).attr('alt'));
                $('#popupwrp .imageBox span.counter').html((_selected + 1) + '/' + (_gallery.length));

                $('<div id="fader"></div>').appendTo('body').fadeTo(500, 0.5, function () {
                    if (IE)
                        $('#popupwrp .imageBox').show();
                    else
                        $('#popupwrp .imageBox').fadeIn();
                });
            });
        });

        // previous image
        $('#popupwrp .imageBox a.prev').click(function (e) {
            e.preventDefault();
            if (!$(this).hasClass('first')) {
                _selected -= 1;

                // disable multiple clicks on both direction
                $('#popupwrp .imageBox a.prev').addClass('first');
                if (!$('#popupwrp .imageBox a.next').hasClass('last')) $('#popupwrp .imageBox a.next').addClass('last');

                $('#popupwrp .imageBox .info').fadeOut(function () {
                    $('#popupwrp .imageBox span.title').html(_gallery[_selected].attr('title'));
                    $('#popupwrp .imageBox span.description').html(_gallery[_selected].attr('alt'));
                    $('#popupwrp .imageBox .image img').attr({ 'src': _gallery[_selected].attr('view'), 'title': 'Click anywhere to close' }).click(function (e) {
                        setTimeout(function () {
                            $('#popupwrp a.prev, #popupwrp a.next').show();
                            $('#popupwrp .info').css('margin-left', 0);
                        }, 500);
                        $("#popupwrp .popup a.close").click();
                    });
                    $('#popupwrp .imageBox span.counter').html((_selected + 1) + '/' + (_gallery.length));

                    $('#popupwrp .imageBox .info').fadeIn(function () {
                        if (_gallery.length != 1) $('#popupwrp .imageBox a.next').removeClass('last');
                        if (_selected > 0) $('#popupwrp .imageBox a.prev').removeClass('first');
                    });
                });
            }
        });

        // next image
        $('#popupwrp .imageBox a.next').click(function (e) {
            e.preventDefault();
            if (!$(this).hasClass('last')) {
                _selected += 1;

                // disable multiple clicks on both direction
                if (!$('#popupwrp .imageBox a.prev').hasClass('first')) $('#popupwrp .imageBox a.prev').addClass('first');
                $('#popupwrp .imageBox a.next').addClass('last');

                $('#popupwrp .imageBox .info').fadeOut(function () {
                    $('#popupwrp .imageBox span.title').html(_gallery[_selected].attr('title'));
                    $('#popupwrp .imageBox span.description').html(_gallery[_selected].attr('alt'));
                    $('#popupwrp .imageBox .image img').attr({ 'src': _gallery[_selected].attr('view'), 'title': 'Click anywhere to close' }).click(function (e) {
                        setTimeout(function () {
                            $('#popupwrp a.prev, #popupwrp a.next').show();
                            $('#popupwrp .info').css('margin-left', 0);
                        }, 500);
                        $("#popupwrp .popup a.close").click();
                    });
                    $('#popupwrp .imageBox span.counter').html((_selected + 1) + '/' + (_gallery.length));

                    $('#popupwrp .imageBox .info').fadeIn(function () {
                        if (_selected < (_gallery.length - 1)) $('#popupwrp .imageBox a.next').removeClass('last');
                        if (_gallery.length != 1) $('#popupwrp .imageBox a.prev').removeClass('first');
                    });
                });
            }
        });
    }

    // gallery video popup
    if ($(".cont .videoList").length > 0) {
        var _videoGallery = Array();
        var _selected = 0;
        $(".cont .videoList .item").each(function () {
            _selected = 0;
            var _index = _videoGallery.length;
            var _title = $(this).find('img').attr('title');
            var _name = ($(this).find('img').attr('src')).replace("164x112", "300x240");
            var _video = $(this).find('img').attr('longdesc');

            $(this).attr('index', _index);
            $(this).attr('title', _title);
            $(this).attr('thumb', _name);
            $(this).attr('video', _video);

            _videoGallery[_index] = $(this);

            _videoGallery[_index].click(function (e) {
                e.preventDefault();
                _selected = parseInt($(this).attr('index'));
                if (_selected == 0)
                    $('#popupwrp .videoBox a.prev').addClass('first');
                else
                    $('#popupwrp .videoBox a.prev').removeClass('first');
                if (_selected == (_videoGallery.length - 1))
                    $('#popupwrp .videoBox a.next').addClass('last');
                else
                    $('#popupwrp .videoBox a.next').removeClass('last');

                var vb = $('#popupwrp .videoBox');
                $('span.title', vb).html($(this).attr('title'));
                $('.video', vb).html('<div id="flashcontent"></div>');
                $('.video', vb).embedVideoPlayer(($(this).attr('video')), ($(this).attr('thumb')), ($(this).attr('title')));

                $('<div id="fader"></div>').appendTo('body').fadeTo(500, 0.5, function () {
                    if (IE)
                        $('#popupwrp .videoBox').show();
                    else
                        $('#popupwrp .videoBox').fadeIn();
                });
            });
        });

        // previous image
        $('#popupwrp .videoBox a.prev').click(function (e) {
            e.preventDefault();
            if (!$(this).hasClass('first')) {
                _selected -= 1;

                // disable multiple clicks on both direction
                $('#popupwrp .videoBox a.prev').addClass('first');
                if (!$('#popupwrp .videoBox a.next').hasClass('last')) $('#popupwrp .videoBox a.next').addClass('last');

                $('#popupwrp .videoBox .info').fadeOut(function () {
                    $('#popupwrp .videoBox span.title').html(_videoGallery[_selected].attr('title'));
                    $('#popupwrp .videoBox .video').html('<div id="flashcontent"></div>');
                    $('#popupwrp .videoBox .video').embedVideoPlayer((_videoGallery[_selected].attr('video')), (_videoGallery[_selected].attr('thumb')), _videoGallery[_selected].attr('title'));

                    $('#popupwrp .videoBox .info').fadeIn(function () {
                        if (_videoGallery.length != 1) $('#popupwrp .videoBox a.next').removeClass('last');
                        if (_selected > 0) $('#popupwrp .videoBox a.prev').removeClass('first');
                    });
                });
            }
        });

        // next image
        $('#popupwrp .videoBox a.next').click(function (e) {
            e.preventDefault();
            if (!$(this).hasClass('last')) {
                _selected += 1;

                // disable multiple clicks on both direction
                if (!$('#popupwrp .videoBox a.prev').hasClass('first')) $('#popupwrp .videoBox a.prev').addClass('first');
                $('#popupwrp .videoBox a.next').addClass('last');

                $('#popupwrp .videoBox .info').fadeOut(function () {
                    $('#popupwrp .videoBox span.title').html(_videoGallery[_selected].attr('title'));
                    $('#popupwrp .videoBox .video').html('<div id="flashcontent"></div>');
                    $('#popupwrp .videoBox .video').embedVideoPlayer((_videoGallery[_selected].attr('video')), (_videoGallery[_selected].attr('thumb')), _videoGallery[_selected].attr('title'));

                    $('#popupwrp .videoBox .info').fadeIn(function () {
                        if (_selected < (_videoGallery.length - 1)) $('#popupwrp .videoBox a.next').removeClass('last');
                        if (_videoGallery.length != 1) $('#popupwrp .videoBox a.prev').removeClass('first');
                    });
                });
            }
        });
    }
});

function scroller() {
    // scrollozhato tartalmak
    var scroll = $('#news-scroll, #apps-scroll');

    scroll.each(function () {

        var el = $(this);

        var elWidth = el.find('ul.items li:eq(0)').width();
        var pagePositions = new Array();
        pagePositions[0] = 0;
        var currentPage = 0;
        var k = 1;
        var pager = '';
        var pagerwidth = 0;
        var itemPerPage = 5;

        // fel oldalszelesseg
        if (el.hasClass('narrow')) {
            itemPerPage = 3;
            elWidth = 174;
        }

        // kis blokk
        if (el.hasClass('mini')) {
            itemPerPage = 1;
            elWidth = 338;
        }

        // egy elem per lap
        if (el.hasClass('one')) {
            itemPerPage = 1;
        }

        // lapozo anim
        function gotoPage(page) {
            $('ul.items', el).stop().animate({ 'margin-left': -1 * pagePositions[page] }, 300);
            $('.indicator ul li:eq(' + page + ')', el).addClass('sel').siblings().removeClass('sel');
        }


        // lap poziciok meghatarozasa
        $('ul.items li', el).each(function (j) {

            if (j % itemPerPage == 0 && j > 0) {

                if ($(this).nextAll().length >= itemPerPage) {

                    pagePositions[k] = elWidth * k * itemPerPage;

                } else {

                    pagePositions[k] = elWidth * ((k - 1) * itemPerPage + $(this).nextAll().length + 1);

                }
                k++;

            }


        });

        // ha dupla magas
        // ket sorba torjuk a felenel
        if (el.hasClass('double')) {
            $('ul.items li', el).eq(Math.ceil($('ul.items li', el).length / 2)).css('clear', 'left');

            // levagjuk a pagePositions "maradekat"
            pagePositions = pagePositions.slice(0, Math.ceil($('ul.items li', el).length / 2));
        }


        // lapszamok
        if (pagePositions.length > 1) {
            for (i = 0; i < pagePositions.length; i++) {
                pager += '<li><a href="#">' + i + '. oldal</a></li>';
            }
        } else {
            $('a.pager', el).hide();
        }

        $('div.indicator ul', el).html(pager).find('li:eq(0)').addClass('sel');

        $('div.indicator ul li', el).each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                currentPage = $("div.indicator ul li", el).index(this);
                gotoPage(currentPage);

            });
            pagerwidth += $(this).outerWidth();
        });


        // lapozo kozeprerendezes
        $('div.indicator ul', el).css({
            'width': pagerwidth,
            'margin-left': -1 * pagerwidth / 2
        });

        // lapozo gombok
        $('.prevPage', el).click(function (e) {

            e.preventDefault();
            if (currentPage > 0) {
                currentPage--;
                gotoPage(currentPage);
            }

        });

        $('.nextPage', el).click(function (e) {

            e.preventDefault();
            if (currentPage < pagePositions.length - 1) {
                currentPage++;
                gotoPage(currentPage);
            }

        });
    });
}

function setCookie(c_name, value, expiredays, path, domain) {
    expiredays = parseInt(expiredays);
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value)
        + ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString())
        + ";path=" + (typeof (path) == "undefined" ? "/" : path)
        + (typeof (domain) != 'undefined' ? ";domain=" + domain : "");
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

// overlay handling
Overlay = new function () {

    var _tmp = null;

    // overlay main elements
    var _overlayTpl = '<div class="overlay"><div class="cover"></div></div>';

    var _overlayDOM = null;
    var _contentDOM = null;

    this.overlayShow = function () {
        if (!_overlayDOM) {
            _overlayDOM = $(_overlayTpl);
            _overlayDOM.find('div.cover').click(function () {
                Overlay.overlayHide();
            });
            $('body').append(_overlayDOM);
        }
        _overlayDOM.width($('body').width()).height($(document).height());
        _overlayDOM.addClass('show');
        if (IE6) { $('select').css({ visibility: 'hidden' }); }
    };

    this.overlayHide = function () {
        Overlay.contentHide();
        _overlayDOM.removeClass('show');
        if (IE6) { $('select').css({ visibility: 'visible' }); }
        $(window).unbind('keyup');
    };

    this.contentShow = function () {
        if (_contentDOM != null) {
            Overlay.overlayShow();
            _overlayDOM.append(_contentDOM);
            //_contentDOM.css({top: Math.round(Math.max($(document).scrollTop() + $(window).height() / 2 - _contentDOM.outerHeight() / 2 - 8, 32)) + 'px'});
            site.IEfix();
        }
    };

    this.contentHide = function () {
        if (_contentDOM != null) { _contentDOM.remove(); }
        _contentDOM = null;
    };

    // direct
    var _directItems = Array();
    var _directTpl = '' +
        '<div class="content media direct">' +
        ' <div class="top"></div>' +
        ' <div class="inner cont">' +
        '  <div class="media">##media##</div>' +
        '  <div class="title">##title##</div>' +
        '  <div class="paging">##paging##<div class="prev"></div><div class="next"></div></div>' +
        '  <div class="close"></div>' +
        ' </div>' +
        ' <div class="bot"></div>' +
        ((IE) ? ' <div class="bg"></div>' : '') +
        '</div>';

    this.directShow = function (objIndex, items) {

        /*		if (typeof items == 'string') {
                    alert(items);
                } else {
                    alert(items[0].href);
                }*/

        // remove visible overlay content
        Overlay.contentHide();

        // build overlay html code
        var directHtml = _directTpl;

        if (!items || (items.length == 0)) {
            if (!_directItems || (_directItems.length == 0)) {
                return false;
            }
        } else {
            if (typeof items == 'string') {
                eval('_directItems = ' + items + ';');
            } else {
                _directItems = items;
            }
        }
        objIndex = Math.max(0, Math.min(_directItems.length, objIndex));
        var directObj = _directItems[objIndex].href;
        var objType = String(directObj).split('&')[0].split('?')[0].split('.').pop().substr(0, 3);
        var objVars = { title: _directItems[objIndex].title || '' };
        if (_directItems.length > 1) {
            directHtml = directHtml.split('class="content media direct"').join('class="content media"');
        }
        directHtml = directHtml.split('##title##').join(objVars.title);
        directHtml = (_directItems.length > 1) ? directHtml.split('##paging##').join((objIndex + 1) + ' / ' + _directItems.length) : directHtml.split('<div class="paging">##paging##<div class="prev"></div><div class="next"></div></div>').join('');
        switch (objType) {
            case 'jpg':
            case 'gif':
            case 'png':
            case 'bmp':
                directHtml = directHtml.split('##media##').join('<img src="' + directObj + '" alt="" />');
                break;
            case 'flv':
                directHtml = directHtml.split('##media##').join('<embed src="swf/player-licensed.swf" width="480" height="320" flashvars="file=' + directObj + '&amp;backcolor=87A520&amp;frontcolor=000000&amp;lightcolor=ffffff&amp;screencolor=000000&amp;autostart=true" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" quality="high" name="overlayvideo" id="overlayvideo" type="application/x-shockwave-flash">');
                break;
            default:
                directHtml = directHtml.split('##media##').join('not supported media format');
                break;
        }

        // create DOM object
        _contentDOM = $(directHtml);

        // setting interactive elements and events
        _contentDOM.find('div.prev').addClass((objIndex == 0) ? 'hidden' : '').click(function () {
            Overlay.directShow((_directItems.length + objIndex - 1) % _directItems.length);
        });
        _contentDOM.find('div.next').addClass((objIndex == _directItems.length - 1) ? 'hidden' : '').click(function () {
            Overlay.directShow((objIndex + 1) % _directItems.length);
        });
        _contentDOM.find('div.close').click(function () {
            Overlay.overlayHide();
        });

        // show overlay content
        Overlay.contentShow();

    }
    // /direct

    // media
    var _mediaItems = Array();
    var _mediaTpl = '' +
        '<div class="overlaycontent">' +
        ' <div class="media">' +
        '  <div class="inner">' +
        '   <div class="image">##media##</div>' +
        '   <div class="zoom hidden"></div><div class="prev"></div><div class="next"></div><div class="close"></div>' +
        '  </div>' +
        ((IE) ? '  <div class="shadow"></div>' : '') +
        ' </div>' +
        ' <div class="medialarge hidden">' +
        '  <div class="inner">' +
        '   <div class="image">##media##</div>' +
        '   <div class="close"></div>' +
        '  </div>' +
        ' </div>' +
        '</div>';

    this.mediaAdd = function (obj) {
        _mediaItems.push(obj);
    };

    this.mediaShow = function (objIndex) {
        // remove visible overlay content
        Overlay.contentHide();

        // build overlay html code
        var mediaHtml = _mediaTpl;
        var mediaObj = _mediaItems[objIndex];
        var objType = String(mediaObj.attr('href')).split('&')[0].split('?')[0].split('.').pop().substr(0, 3);
        try {
            eval('var objVars = {' + String(mediaObj.attr('rel')) + '}');
        } catch (e) {
            objVars = {};
        }

        objVars.title = objVars.title || '';
        objVars.info = objVars.info || '';
        objVars.lead = objVars.lead || '';

        switch (objType) {
            case 'jpg':
            case 'jpe':
            case 'gif':
            case 'png':
            case 'bmp':
                mediaHtml = mediaHtml.split('##media##').join('<img src="' + mediaObj.attr('href') + '" alt="" />');
                break;
            case 'flv':
                mediaHtml = mediaHtml.split('##media##').join('<embed src="swf/player-licensed.swf" width="480" height="320" flashvars="file=' + mediaObj.attr('href') + '&amp;backcolor=5DA2CE&amp;frontcolor=000000&amp;lightcolor=ffffff&amp;screencolor=000000&amp;autostart=true" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" quality="high" name="overlayvideo" id="overlayvideo" type="application/x-shockwave-flash">');
                break;
            case 'm3d':
                mediaHtml = mediaHtml.split('##media##').join('<a id="m3d" class="Magic360" rel="speed: 50; autospin-speed:80; columns: 72; initialize-on: load; magnify: false; filename:Large-{col}.jpg;"><img src="' + mediaObj.data('path') + 'Large-01.jpg" /></a>');
                //				mediaHtml = mediaHtml.split('##media##').join('<div id="m3d"></div>');
                break;
            default:
                mediaHtml = mediaHtml.split('##media##').join('not supported media format');
                break;
        }

        // create DOM object
        _contentDOM = $(mediaHtml);

        // setting interactive elements and events
        _contentDOM.find('div.prev').addClass((objIndex == 0) ? 'hidden' : '').click(function () {
            Overlay.mediaShow((_mediaItems.length + objIndex - 1) % _mediaItems.length);
        });
        _contentDOM.find('div.next').addClass((objIndex == _mediaItems.length - 1) ? 'hidden' : '').click(function () {
            Overlay.mediaShow((objIndex + 1) % _mediaItems.length);
        });
        _contentDOM.find('div.media div.close').click(function () {
            Overlay.overlayHide();
        });

        $(window).keyup(function (e) {
            switch (e.keyCode) {
                case 37:	// left
                    Overlay.mediaShow((_mediaItems.length + objIndex - 1) % _mediaItems.length);
                    break;

                case 39:	// right
                    Overlay.mediaShow((objIndex + 1) % _mediaItems.length);
                    break;

                case 27:	// escape
                    Overlay.overlayHide();
                    break;
            }
        });

        if (!mediaObj.hasClass('nolarge')) {
            _contentDOM.find('div.media div.inner').mousemove(function (e) {
                Overlay.mediazoomPositioning(e);
            });
            _contentDOM.find('div.media div.image, div.media div.zoom').click(function (e) {
                _contentDOM.find('div.medialarge').removeClass('hidden');
                _contentDOM.find('div.media').addClass('hidden');
                Overlay.medialargePositioning(e);
            });
        } else {
            _contentDOM.find('div.media div.image').addClass('nolarge');
        }

        _contentDOM.find('div.medialarge div.inner').mousemove(function (e) {
            Overlay.medialargePositioning(e);
        });
        _contentDOM.find('div.medialarge div.image, div.medialarge div.close').click(function () {
            _contentDOM.find('div.medialarge').addClass('hidden');
            _contentDOM.find('div.media').removeClass('hidden');
        });

        // positioning
        Overlay.mediaPositioning();
        $(window).resize(function () {
            Overlay.mediaPositioning();
        });

        // show overlay content
        Overlay.contentShow();

        if ('m3d' == objType) {
            Magic360.start('m3d');
        }

    };

    this.mediaPositioning = function () {
        var ww = $(window).width();
        var wh = $(window).height();
        _contentDOM.find('div.media').css({ left: Math.round(ww / 2 - wh / 3) + 'px', top: '0px', width: Math.round(wh / 3 * 2) + 'px', height: wh + 'px' });
    };

    this.mediazoomPositioning = function (e) {
        var image = _contentDOM.find('div.media div.image');
        var mx = e.pageX;
        var my = e.pageY;
        var x = mx - _contentDOM.find('div.media div.inner').offset().left;
        var y = my - _contentDOM.find('div.media div.inner').offset().top;
        var ix0 = image.offset().left;
        var iy0 = image.offset().top;
        var ix1 = ix0 + image.find('img').width();
        var iy1 = iy0 + image.find('img').height();
        if ((ix0 <= mx) && (mx <= ix1) && (iy0 <= my) && (my <= iy1)) {
            _contentDOM.find('div.zoom').removeClass('hidden');
        } else {
            _contentDOM.find('div.zoom').addClass('hidden');
        }
        _contentDOM.find('div.media div.inner div.zoom').css({ left: Math.min(Math.max(x, 75), image.find('img').width() - 75) + 'px', top: y + 'px' });
    };

    this.medialargePositioning = function (e) {
        var ww = $(window).width();
        var wh = $(window).height();
        var ow = ww; //_contentDOM.find('div.medialarge div.inner').width();
        var oh = wh; //_contentDOM.find('div.medialarge div.inner').height();
        var iw = 1200;
        var ih = 1800;
        var x = e.pageX - _contentDOM.find('div.medialarge div.inner').offset().left;
        var y = e.pageY - _contentDOM.find('div.medialarge div.inner').offset().top;
        var l = (ow > iw) ? Math.round((ow - iw) / 2) : Math.round((x / ow) * (ow - iw));
        var t = (oh > ih) ? Math.round((oh - ih) / 2) : Math.round((y / oh) * (oh - ih));
        _contentDOM.find('div.medialarge').css({ width: ww + 'px', height: wh + 'px' });
        _contentDOM.find('div.medialarge div.inner div.image').css({ left: l + 'px', top: t + 'px' });
        _contentDOM.find('div.medialarge div.inner div.close').css({ left: x + 'px', top: y + 'px' });
    };
    // /media

    // initialize
    this.initialize = function () {
        _tmp = 0;

        // media
        $('div.gallery div.item').each(function () {
            //			var _a = $(this).find('a img').parents('a').eq(0);
            var _a = $(this).find('a').eq(0);
            Overlay.mediaAdd(_a);
            $(this).find('a').each(function () {
                if (_a.attr('href') == $(this).attr('href')) {
                    this.index = _tmp;
                    this.ok = true;

                    if ($(this).hasClass('Magic360')) {
                        $(this).mousedown(function () {
                            this.ok = true;
                            this.down = true;
                        });
                        $(this).mouseup(function () {
                            this.down = false;
                        });
                        $(this).mousemove(function () {
                            if (this.down) {
                                this.ok = false;
                                _gaq.push(['_trackEvent', 'magic3d', 'drag']);
                            }
                        });
                    }

                    $(this).click(function () {
                        this.blur();
                        if ($(this).hasClass('Magic360')) { _gaq.push(['_trackEvent', 'magic3d', 'click']); }
                        if (!this.ok) { this.ok = true; return false; }
                        Overlay.mediaShow(this.index);
                        return false;
                    });
                }
            });
            _tmp++;
        });

        // direct
        $('div.cont a.directshow').each(function () {
            $(this).click(function () {
                this.blur();
                Overlay.directShow(0, [{ href: this.href, title: this.title }]);
                return false;
            });
        });
    };
    // initialize

}();
// /overlay handling

function initRotator(xml) {
    $tpl = $('.rotator-holder #rotator .item').remove()

    $(xml).find('phone').each(function () {
        var t = $tpl.clone();
        $('h3', t).html('<a href="' + $('url', $(this)).text() + '">' + $('manufacturer', $(this)).text() + ' <strong>' + $('type', $(this)).text() + '</strong></a>');
        $('.price', t).html($('price', $(this)).text());
        $('img', t).attr('src', $('image', $(this)).text());
        $('.btn a', t).attr('href', $('url', $(this)).text());
        $('.tariff', t).html('<a href="' + $('tariff_url', $(this)).text() + '">' + $('tariff', $(this)).text() + '</a>');
        $('.commitment', t).html($('commitment', $(this)).text().split(' és 2').join(' és<br /> 2'));


        if ($('android', $(this)).text() == 'false') {
            $('.android', t).hide()
        }

        if ($('new', $(this)).text() == 'false') {
            $('.new', t).hide()
        }

        /*		var features = $('features', $(this)).text().split(' | ');
        
                for(f in features){
                    $('ul.features',t).append('<li>'+features[f]+'</li>')
                }*/

        $('.rotator-holder #rotator').append(t)
    })

    if ($('#rotator').length < 1) { return false; }

    $('#rotator').cycle({
        fx: 'scrollHorz',
        speed: 'fast',
        timeout: 8000,
        next: '.cycle_next',
        prev: '.cycle_prev'
    });
}

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

/* Track filetype download and mailto links */
$(document).ready(function () {
    var filetypes = /\.(pdf|doc*|xls*|ppt*|mp3)$/i;
    var baseHref = '';
    if (jQuery('base').attr('href') != undefined) {
        baseHref = jQuery('base').attr('href');
    }
    jQuery('a').each(function () {
        var href = jQuery(this).attr('href');
        if (href && (href.match(/^https?\:/i)) && (!href.match(document.domain))) {
            jQuery(this).click(function () {
                var extLink = href.replace(/^https?\:\/\//i, '');
                _gaq.push(['_trackEvent', 'External', 'Click', extLink]);
                if (jQuery(this).attr('target') != undefined && jQuery(this).attr('target').toLowerCase() != '_blank') {
                    setTimeout(function () { location.href = href; }, 200);
                    return false;
                }
            });
        }
        else if (href && href.match(/^mailto\:/i)) {
            jQuery(this).click(function () {
                var mailLink = href.replace(/^mailto\:/i, '');
                _gaq.push(['_trackEvent', 'Email', 'Click', mailLink]);
            });
        }
        else if (href && href.match(filetypes)) {
            jQuery(this).click(function () {
                var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
                var filePath = href;
                _gaq.push(['_trackEvent', 'Download', 'Click-' + extension, filePath]);
                if (jQuery(this).attr('target') != undefined && jQuery(this).attr('target').toLowerCase() != '_blank') {
                    setTimeout(function () { location.href = baseHref + href; }, 200);
                    return false;
                }
            });
        }
    });
});

/* fix that in ie8 and lower, menu dont visible to hover */
$(document).ready(function () {
	/*if (IE8 || IE7 || IE6)*/ $('body.en .has-single-column-submenu').removeClass('has-single-column-submenu')
});

/* video player */
$(document).ready(function () {
    $("#play-popup-video").each(function (index, element) {
        var _video = $(this).attr('rel');
        $('body').append('<div class="video-centerer"><a class="close" href="javascript:;"></a><div id="video-handler"></div></div>');
        jwplayer("video-handler").setup({
            file: _video,
            flashplayer: "swf/jwplayer/player.swf",
            width: 858,
            height: 483
        });
        $(this).click(function () {
            $('.video-centerer').show();
            jwplayer("video-handler").play();
        });
        $('.video-centerer .close').click(function () {
            $('.video-centerer').hide();
            jwplayer("video-handler").stop();
        });
    });

    $('body').append($('<div id="yt-video-overlay"><div class="vid"><iframe></iframe><a class="close"></a><div class="details-wrapper"><h3></h3><p></p></div></div></div>'));
    var $vw = $('#yt-video-overlay');
    $('*[data-video-embed]').click(function () {
        var $this = $(this);
        $vw.find('iframe').attr('src', $this.data('video-embed') + '&autoplay=1');
        $vw.find('h3').html($this.find('h3').html() || $this.data('video-title') || '');
        //$vw.find('.view').html($(this).find('.view').html());
        $vw.find('p').html($this.find('p.full').html() || $this.data('video-text') || '');
        $vw.show();
    });
    $vw.find('.close').click(function () {
        $vw.find('iframe').attr('src', 'about:blank');
        $vw.hide();
    });

});
/* / video player */