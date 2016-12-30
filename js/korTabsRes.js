;(function($) {

    // значение по умолчаниюf
    var defaults = {
        breakpoint: false, // ширина окна в пикселях, при котором происходит трансвормация в список
        fade: false // еффект растворения
    };

    // актуальные настройки, глобальные
    var options;


    $.fn.korTabsRes = function(params){

        // при многократном вызове функции настройки будут сохранятся, и замещаться при необходимости
        options = $.extend({}, defaults, options, params);
        var windowWidth = $(window).width();
        var wrapElem = this.parent();
        var tabsElem = this.children(".tabs");
        var containerTab = this.children(".container-tab");
        var tabElem = containerTab.children(".tab");

        this.addClass("kortabs-wrap");

        //Перезагрузка страницы после изменения ориентации экрана или размера экрана
        var ratio = window.innerWidth/window.innerHeight;
        var orientation = ratio < 1 ? 'vertical' : 'horizontal';

        $(window).resize(function() {

            windowWidth = $(window).width();

            location.reload();

            var resizeRatio = window.innerWidth/window.innerHeight;
            var resizeOrientation = resizeRatio < 1 ? 'vertical' : 'horizontal';

            if (resizeOrientation != orientation ) {
                location.reload();
            }
        });


        var sumWidthElem = 0; // общая длина табов включая отступы

        tabsElem.children('li').each(function(i,elem){
           $(elem).outerWidth(true);
            sumWidthElem = sumWidthElem + $(elem).outerWidth(true);
        });

        // если общая длина табов (sumWidthElem) <= ширине окна
        // и предопределенная ширина окна при которой происходит трансформация (options.breakpoint) <= ширине окна
        // и ширина родителя >= общей длине табов (sumWidthElem)
        // переключение на мобильный вид табов не происходит (kortabsMobile = false) иначе происходит (kortabsMobile = true)

        var kortabsMobile;

        if((sumWidthElem <= windowWidth) && (options.breakpoint <= windowWidth) && (wrapElem.innerWidth() >= sumWidthElem)) {
            kortabsMobile = false;
        } else {
            kortabsMobile = true;
        }

        var korselect;

        if(kortabsMobile){
            this.css("position", "relative");
            tabsElem.hide();
            tabsElem.css("position", "absolute");
            tabsElem.children('li').css("display","block");

            //Добавляем селект
            tabsElem.before(function() {
                return "<div class='korselect clearfix'><span>" + tabsElem.children('li.active').text() + "</span><i class='fa fa-caret-down' aria-hidden='true'></div>";
            });

            korselect = tabsElem.prev(); //Селект .korselect

            tabsElem.addClass("kortabs").css("top", korselect.outerHeight(true)); //Отступ списка на высоту селекта
            korselect.click(function(){
                tabsElem.toggle();
            });

        }
        //else {
            //tabsElem.children('li').css("display","inline-block");
        //}

        // отображение соответствующего вкладке контента
        var indexElem;

        tabsElem.children('li').click(function(){
            tabsElem.children('li').removeClass("active");
            indexElem = tabsElem.children('li').index(this);
            //console.log(indexElem);
            $(this).addClass("active");
            if(kortabsMobile){
                tabsElem.hide();
                korselect.children("span").text($(this).text());
            }

            if(options.fade) {
                containerTab.children(".tab.active").fadeOut(200, function(){
                    tabElem.removeClass("active");
                    tabElem.eq(indexElem).fadeIn(100);
                    tabElem.eq(indexElem).addClass("active");
                });
            } else {
                tabElem.removeClass("active");
                tabElem.eq(indexElem).addClass("active");
            }
        });

        // отображение предварительно скрытых вкладок
        this.css("visibility", "visible");

        return this;
    };

})(jQuery);