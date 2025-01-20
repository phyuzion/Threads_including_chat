 

// Control of the functions exists
    $.fn.exists = function () { return this.length > 0; };

//*********************************************
//  CHECK THE DEVICE AND BROWSER SUPPORTS FIRST
//*********************************************

// Check the device for mobile or desktop
    var mobile = false,
        parallaxWorking = null;
    function checkTheDevice() {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 992 ) {
                mobile = true;
                document.body.classList.add("mobile");
                document.querySelectorAll('.animated').forEach(el => el.classList.add("visible"));
            }
        else{ 
            mobile = false;
            document.body.classList.remove("mobile");
        }
    }
//Run the device control and check with window resize
    checkTheDevice();

// Check the browsers
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
        // Firefox 1.0+
        isFirefox = typeof InstallTrigger != 'undefined',
        // Safari 3.0+ "[object HTMLElementConstructor]"
        isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification),
        // Internet Explorer 6-11
        isIE = /*@cc_on!@*/false || !!document.documentMode,
        // Edge 20+
        isEdge = !isIE && !!window.StyleMedia,
        // Chrome 1+
        isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
        // Blink engine detection
        isBlink = (isChrome || isOpera) && !!window.CSS,
        // Parallax effects for selected browsers
        isParallaxBrowsers =  (isOpera || isFirefox || isBlink || isChrome);

//Give their background images
//Get all data-bg and data-bg-sm attributes
    var lazyItem = document.querySelectorAll("[data-bg]");
        function getBG(){
            lazyItem.forEach(function(item){
                if (item.hasAttribute("data-bg-sm") && mobile === true && !item.classList.contains("bg-mobiled")) {
                    var bgSM = item.getAttribute("data-bg-sm");
                    item.classList.add("bg-mobiled");
                    item.style.backgroundImage = 'url('+bgSM+')';
                } else if (item.hasAttribute("data-bg-sm") && mobile === false && item.classList.contains("bg-mobiled")){
                    var bgLG = item.getAttribute("data-bg");
                    item.classList.remove("bg-mobiled");
                    item.style.backgroundImage = 'url('+bgLG+')';
                }
            });
        }
    //Run the function
    getBG();


//Start all lazy loads
    lazyLoadAll = "[data-bg]:not(.bg-mobiled), [data-src]";
    var peraLazyLoad = new LazyLoad({
        elements_selector: lazyLoadAll,
    });
    window.lazyLoadOptions = {
        threshold: 0,
        // Assign the callbacks defined above
    };

//Add active class to ".link-active" a elements.
    var url = window.location.href;
    var lastPart = url.replace(/.*\//, ""); 
    document.querySelectorAll('a.link-active[href="'+ lastPart + '"]').forEach( function(elem){
        elem.classList.add("active");
    });

    //*********************************************
    //  CUSTOMIZABLE SLIDER FOR ALL THEME
    //*********************************************

        //Custom slider - usable for everything
        if ($(".custom-slider").exists()) {
            $('.custom-slider').each(function(){
                var $this = $(this);
                $($this).slick({
                    //Default Options
                    fade: true,
                    dots: false,
                    arrows: false,
                    autoplay: false,
                    autoplaySpeed: 3000,
                    pauseOnHover: true,
                    lazyLoad: 'ondemand',
                    infinite: true,
                    rtl: false,
                    edgeFriction: 0.35,
                    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                    touchThreshold: 150,
                    speed: 400,
                    waitForAnimate: true,
                    slidesToShow: 1,
                    initialSlide: 0,
                    draggable: false,
                    adaptiveHeight: true,
                    variableWidth: false,
                    prevArrow: '<div class="slider-prev d-flex align-items-center justify-content-center"></div>',
                    nextArrow: '<div class="slider-next d-flex align-items-center justify-content-center"></div>',
                    appendDots:$("#home").find('.dots-container, .dots-container-1, .dots-container-2, .dots-container-3, .dots-container-4'),
                    centerMode: false,
                    slidesToScroll: 1,
                    setPosition: 1,
                    swipe: true,
                    touchMove: true,
                    rows: 0,
                    responsive: [{
                          breakpoint: 992,
                          settings: { slidesToShow: 1, slidesToScroll: 1 }
                        }, {
                          breakpoint: 600,
                          settings: { slidesToShow: 1, slidesToScroll: 1 }
                        }
                    ]
                }).on('afterChange', function(event, slick, currentSlide, prevSlide){
                    var items = $($this).find('.animate'),
                        current = $($this).find('.slick-current .animate'),
                        nCurrent = $($this).find('.slick-slide:not(.slick-current) .animate');
                    Waypoint.refreshAll();
                    $(current).each(function() {
                        var item = $(this), animation = item.data('animation'), animationDelay = item.data('animation-delay');
                        setTimeout(function(){ item.addClass( animation + " visibleme" ); }, animationDelay);
                    });
                    $(nCurrent).each(function() {
                        var item = $(this), animation = item.data('animation');
                        item.removeClass( animation + "visibleme" );
                    });
                    $('.slick-current video').each(function () {this.play();});
                    $('.slick-slide:not(.slick-current) video').each(function () {this.pause();});
                    $($this).find('.slick-current .zoom-timer').addClass("scaling");
                    document.querySelectorAll(".slick-current animate").forEach(element => {
                        element.beginElement();
                    });
                    $.each(slick.$dots, (i, el) => {
                        $(el).find('li').eq(currentSlide).addClass('slick-active').find('button');
                    })
                }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
                    Waypoint.refreshAll();
                    var items = $($this).find('.animate'),
                        nCurrent = $($this).find('.slick-slide:not(.slick-current) .animate');
                    var nCurrent = $($this).find('.slick-slide:not(.slick-current) .animate') ,items = $($this).find('.animate');
                    $(nCurrent).each(function() {
                        var item = $(this), animation = item.data('animation'), animationDelay = item.data('animation-delay');
                        $(item).removeClass( animation + " visibleme" );
                    });
                    $($this).find('.zoom-timer').removeClass("scaling");
                    //Change navigation detail colors with slide
                    var nextItem = $('[data-slick-index=' + nextSlide + ']');
                    if ($(nextItem).hasClass("nav-to--dark")) {$(".modern-nav").removeClass("details-white").addClass("details-dark")}
                    if ($(nextItem).hasClass("nav-to--white")) {$(".modern-nav").removeClass("details-dark").addClass("details-white")}
                });
            });
            //Block drag the .custom-slider when sliding images.
            $('.custom-slider').on('touchstart touchmove touchend', function(){ $('.custom-slider').slick("slickSetOption", "swipe", true);});
            $(".custom-slider").find(".slick-current .zoom-timer").addClass("scaling");
            //Work for window load
            $('.custom-slider .slick-current .animate').each(function() {
                var item = $(this), animation = item.data('animation'), animationDelay = item.data('animation-delay');
                $(item).removeClass(animation);
                setTimeout(function(){ item.addClass( animation + " visibleme" ); }, animationDelay);
            });
            //Next&Prev with external buttons
            $("[data-slider-control]").on("click", function(){
                var sliderName = $(this).attr("data-slider-control");
                if ($(this).data('slider-dir') === 'prev') {
                    $(sliderName).slick('slickPrev');
                } if ($(this).data('slider-dir') === 'next') {
                    $(sliderName).slick('slickNext');
                }
            });
        }




//Window on load function
    function onLoadFunction(e){

        //Body ready
        document.body.classList.add("ready");

        //Call youtube functions if page has an embed player
        var youtubeEmbedElement = document.getElementById("youtubeVideo") || false;
        if (youtubeEmbedElement) {
            youtubeVideo();
        }

        //Hide loader
        var pageLoader = document.querySelector('.page-loader') || false,
            pageLoaderItem = document.querySelector('.loader') || false;
        if (pageLoader){
            setTimeout(function() {
                pageLoader.classList.add("page-loader--fading-out");
                pageLoaderItem.classList.add("page-loader--fading-out");
            }, 100);
            setTimeout(function() {
                pageLoader.classList.remove("page-loader--fading-out");
                pageLoader.classList.add("page-loader--hidden");
            }, 800);
        }

        setParallax();
        animatedItems();
        animatedConts();
        getBG();


        //See links inside the page for smooth scroll
        $( "a[href^='#']:not([href='#']):not(.no-scroll):not([data-slide]):not([data-toggle])" ).on('click touch', function(event) {
            var $anchor = $(this), headerOffset = $('.modern-nav').data("offset"), $target = $($anchor).attr('href');
            event.preventDefault();
            if($($target).length){
                if($('.modern-nav').length){
                    $('html, body').stop().animate({
                        scrollTop : $($anchor.attr('href')).offset().top - headerOffset + "px"
                    }, 920, 'easeInOutExpo');
                } else{
                    $('html, body').stop().animate({ scrollTop : $($anchor.attr('href')).offset().top });
                }
            }
        });
        //Back to top
        $( "a[href='#top'], a[href='#home']" ).on('click', function() {
            $('html, body').stop().animate({ scrollTop : 0 }, 920, 'easeInOutExpo');
        });
    };
//Trigger load function when window loaded
    window.addEventListener("load", onLoadFunction);

//Window resize function
    function resizeFunction(e){
        //Check the device & size
        checkTheDevice();
        //Change background size according to window size
        getBG();
        //Set parallax
        setParallax();
    };

//Run the window resize function
    window.addEventListener("resize", resizeFunction);

// Youtube Player Functions
    // Youtube Player Functions
    function youtubeVideo(){
        var youtubeEmbedElement = document.getElementById("youtubeVideo") || false;
        if (youtubeEmbedElement && rdy) {
            // Add YouTube API script
            var tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            var player;
            var videoId = youtubeEmbedElement.dataset.videoId;
            var startSeconds = youtubeEmbedElement.getAttribute("data-startAt");
            var endSeconds = youtubeEmbedElement.getAttribute("data-endAt");

            onYouTubeIframeAPIReady = function () {
                player = new YT.Player("youtubeVideo", {
                    videoId: videoId, // YouTube Video ID
                    playerVars: {
                      autoplay: 1, // Auto-play the video on load
                      autohide: 1, // Hide video controls when playing
                      disablekb: 1,
                      controls: 0, // Hide pause/play buttons in player
                      showinfo: 0, // Hide the video title
                      modestbranding: 1, // Hide the Youtube Logo
                      loop: 1, // Run the video in a loop
                      fs: 0, // Hide the full screen button
                      rel: 0, // Disable related videos
                      modestbranding: 0,
                      playsinline: 1,
                      enablejsapi: 1,
                      start: startSeconds,
                      end: endSeconds
                    },
                    events: {
                        onReady: function (e) {
                            e.target.mute();
                            e.target.playVideo();
                            e.target.setPlaybackQuality('highres');
                            setTimeout( function(){
                                document.body.classList.add("youtube-video-ready")
                            }, 1200);
                        },
                        onStateChange: function (e) {
                            if (e.data === YT.PlayerState.PLAYING) {
                                document.getElementById("youtubeVideo").classList.add("loaded");
                            }
                            if (e.data === YT.PlayerState.ENDED) {
                                // Loop from starting point
                                player.seekTo(startSeconds);
                            }
                            if (e.data == YT.PlayerState.BUFFERING) {
                                e.target.setPlaybackQuality('highres');
                            }
                        }
                    }
                });
                var muteButton = document.querySelector(".muteToggle") || false;
                if (muteButton) {
                    muteButton.addEventListener("click", function(){
                        if (player.isMuted()) {
                            player.unMute();
                            muteButton.classList.add("active");
                            muteButton.querySelectorAll("i").forEach(function(icon){icon.classList.add("active")});
                        } else{
                            player.mute();
                            muteButton.classList.remove("active");
                            muteButton.querySelectorAll("i").forEach(function(icon){icon.classList.remove("active")});
                        }
                    });
                }
                var playButton = document.querySelector(".playToggle") || false;
                if (playButton) {
                    playButton.addEventListener("click", function(){
                        var state = player.getPlayerState();
                        if (state == 1) {
                            pause();
                        }
                        if (state == 2) {
                            play();
                        }
                    });
                }
                function pause(){
                    player.pauseVideo();
                    if (playButton) {playButton.classList.add("active"); playButton.querySelectorAll("i").forEach(function(icon){icon.classList.add("active")});}
                }
                function play(){
                    player.playVideo();
                    if (playButton) {playButton.classList.remove("active"); playButton.querySelectorAll("i").forEach(function(icon){icon.classList.remove("active")});}
                }
                window.addEventListener('blur', pause);
                window.addEventListener('focus', play);
            };
        }
    }

    // init Isotope
        var $grid = $('.grid-layout');
        $($grid).each(function(){
            var $gridFilterStart = $(this).attr("data-default-filter");
            $(this).isotope({
                filter: $gridFilterStart
            });
            $grid.find(">"+$gridFilterStart).addClass("active");
            var cont = document.querySelector("[data-default-filter]") || false;
            if (cont) {
                var elems = cont.querySelectorAll("[data-type]");
                elems.forEach(el => el.removeAttribute("data-fslightbox"));
                cont.querySelectorAll(".item.active [data-type]").forEach(el => el.setAttribute('data-fslightbox', 'portfolio'));
                refreshFsLightbox();
            }
        });
    // filter items on button click
        $('[data-filter]').on('click', function() {
            var filterValue = $(this).attr('data-filter'),
                targetID = $(this).attr("data-target-layout");
                $(targetID).isotope({ 
                    filter: filterValue,
                    itemSelector: ".item",
                    transitionDuration: '0.8s',
                });
            $("[data-filter]").each(function(){
                var tar = $(this).attr("data-target-layout");
                if (tar === targetID) { $(this).removeClass("active"); }
            });
            $(this).addClass("active");
            $(targetID).find(".item").removeClass("active");
            $(targetID).find(filterValue).addClass("active");
            setTimeout( function(){ if (isParallaxBrowsers && mobile === false) { setParallax(); } }, 800);
            var cont = document.querySelector("[data-default-filter]") || false;
            if (cont) {
                var elems = cont.querySelectorAll("[data-type]");
                elems.forEach(el => el.removeAttribute("data-fslightbox"));
                cont.querySelectorAll(".item.active [data-type]").forEach(el => el.setAttribute('data-fslightbox', 'portfolio'));
                refreshFsLightbox();
            }
            return false;
        });

    // Re-layout isotope when window resizing
        $(window).resize(function(){ $($grid).isotope('layout'); });

//Work .active-inview elements with inview classes.
    inView('.active-inview')
        .on('enter', el => {
            el.classList.add("inview");
        })
        .on('exit', el => {
            el.classList.remove("inview");
    });

//Get active class with parents
    var getActive = document.querySelectorAll(".get-active");
    getActive.forEach(function(elem){
        const directParentHasClass = elem.parentElement.classList.contains('active');
        if (directParentHasClass) {
            elem.classList.add("active");
        } else{
            elem.classList.remove("active")
        }
        document.addEventListener("click", function(){
            const directParentHasClass = elem.parentElement.classList.contains('active');
            if (directParentHasClass) {
                elem.classList.add("active");
            } else{
                elem.classList.remove("active")
            }
        });
        
    });

//Get text color from data-color attribute.
    var colorItem = document.querySelectorAll("[data-color]");
    Array.prototype.forEach.call(colorItem, function(el){
        var colorOfElem = el.dataset.color;
        el.style.color = colorOfElem;
    });

//Get background color from data-bgcolor attribute.
    var bgColorItem = document.querySelectorAll("[data-bgcolor]");
    Array.prototype.forEach.call(bgColorItem, function(el){
        var bgColorOfElem = el.dataset.bgcolor;
        el.style.backgroundColor = bgColorOfElem;
    });

//Get border color from data-bcolor attribute.
    var bColorItem = document.querySelectorAll("[data-bcolor]");
    Array.prototype.forEach.call(bColorItem, function(el){
        var bColorOfElem = el.dataset.bcolor;
        el.style.borderColor = bColorOfElem;
    });

//Stay when click on this items.
    document.querySelectorAll('.stay').forEach(el =>
        el.addEventListener("click", function(elem){elem.preventDefault();})
    );

//Animated items
    var animatedItems = function() {
        if ( mobile === false && rdy ) {
            //Animations for single items
            var elems = document.querySelectorAll(".animated");
            Array.prototype.forEach.call(elems, function(el){
                if (el.getBoundingClientRect().top < window.scrollY && !document.body.classList.contains("animation-page")) {
                    el.classList.remove("animated");
                    el.removeAttribute("data-animation");
                    el.removeAttribute("data-animation-delay");
                } else{
                    elems = document.querySelectorAll(".animated");
                    inView(".animated").on('enter', elem => {
                        if (!el.classList.contains("visible")) {
                            var delay = elem.getAttribute('data-animation-delay'),
                                animation = elem.getAttribute('data-animation');
                            setTimeout(function() {elem.classList.add(animation, "visible");}, delay);
                        }
                    });
                    inView.offset({
                        top: 0,
                        bottom: 0,
                    });
                }
            });
        }
    }

//Animated items according to containers
    var animatedConts = function() {
        if ( mobile === false && rdy ) {
            //Animations for single items
            var elems = document.querySelectorAll(".animated-group");
            Array.prototype.forEach.call(elems, function(el){
                inView(".animated-group").on('enter', elem => {
                    var inels = elem.querySelectorAll(".animated");
                    Array.prototype.forEach.call(inels, function(els){
                        if (!els.classList.contains("visible")) {
                            var delay = els.getAttribute('data-animation-delay'),
                                animation = els.getAttribute('data-animation');
                            setTimeout(function() {els.classList.add(animation, "visible");}, delay);
                        }
                    });
                });
                inView.offset({
                    top: 0,
                    bottom: 150,
                });
            });
        }
    }

//Counters
    const counters = document.querySelectorAll('.fact');
    const speed = 500;
    counters.forEach( counter => {
        const animate = () => {
            const value = +counter.getAttribute('data-source');
            const data = +counter.innerText;
            const time = value / speed;
            if(data < value && rdy) {
                counter.innerText = Math.ceil(data + time);
                setTimeout(animate, 1);
            }else{
                counter.innerText = value;
            }
        }
        inView(".fact").on('enter', elem => {
            animate();
        });
    });

//Get active class for Bootstrap Accordions
    var accBar = document.querySelectorAll(".acc-bar");
    accBar.forEach(e => e.addEventListener("click", function(){
        var inActiveBars = document.querySelectorAll("[aria-expanded='false']");
            inActiveBars.forEach(elem => elem.classList.remove("active"));
        if (e.getAttribute("aria-expanded") === "true") {e.classList.add("active")}
    }));

//Progress Bars
    inView('.progress-bar').on('enter', el => {
        var dataSource = el.getAttribute("aria-valuenow");
        el.style.width = dataSource + "%";
    });
//Popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
         return new bootstrap.Popover(popoverTriggerEl)
    });
//Run parallax effect and get parallax containers
//Will be fired according to desktop and mobile
    function setParallax(){
        var parallaxElem = document.querySelector(".parallax") || false;
        if (mobile === false && parallaxElem) {
            var parallaxElem = document.querySelectorAll(".parallax");
            Array.prototype.forEach.call(parallaxElem, function(elem){
                elem.parentNode.classList.add('has-parallax');
                if (elem.classList.contains("disabled")) {
                    elem.classList.remove("disabled");
                }
            });
            //Run skrollr effects
            var s = skrollr.init({
                forceHeight: false,
                smoothScrolling: false
            });
            parallaxWorking = true;
        } else if(mobile === true && parallaxElem && parallaxWorking === true){
            var parallaxElem = document.querySelectorAll(".parallax");
            Array.prototype.forEach.call(parallaxElem, function(elem){
                elem.parentNode.classList.add('has-parallax');
                elem.classList.add("disabled");
            });
            skrollr.init().destroy();
            parallaxWorking = false;
        }
    }

    
//Fade out function
    function fadeOut(el) {
        el.style.opacity = 1;
        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    };

//Fade in function
    function fadeIn(el, display) {
        el.style.opacity = 0;
        el.style.display = display || "block";
        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    };
//Hide with scroll down - Back to top button  elements
    const hideByScroll = document.querySelector(".hide-by-scroll");
    var prevScrollpos = window.scrollY;
    if (window.scrollY < 250) {document.body.classList.add("welcome-home");}
    window.addEventListener("scroll", function() {
        // You can add .hide-on-home class to any fixed item. It will be invisible on home and visible when you scroll down.
        if (window.scrollY > 250) {document.body.classList.remove("welcome-home");}
        else { document.body.classList.add("welcome-home");  }

        if ( hideByScroll){
            // show hide subnav depending on scroll direction
            var currentScrollPos = window.scrollY;
            if (prevScrollpos > currentScrollPos) {
                hideByScroll.classList.remove("hiding");
            } else if (currentScrollPos > 700) {
                document.querySelector(".hide-by-scroll:not(.modern-nav.active):not(.mouseover)").classList.add("hiding");
            }
            prevScrollpos = currentScrollPos;
        }
    });

//Counter animations
    function counterAnimationHandler() {
        const counters = document.querySelectorAll('.counter ')
        counters.forEach(counter => {
        counter.querySelector("span").innerText = '0' //set default counter value
        counter.dataset.count = 0;
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target') //define increase couter to it's data-target
            const count = +counter.dataset.count //define increase couter on innerText

            const increment = target / 200 // define increment as counter increase value / speed

            if (count < target) {
                const newCount = Math.ceil(count + increment);
                counter.dataset.count = newCount;
                counter.querySelector("span").innerText = numberWithCommas(newCount);
                setTimeout(updateCounter, 9);
            } else {
                counter.querySelector("span").innerText = numberWithCommas(target); //if default value is bigger that date-target, show data-target
            }
        }

            updateCounter() //call the function event
        })

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
    inView(".counter").once('enter', elem => {
        counterAnimationHandler();
    });
    inView.offset({
        top: 0,
        bottom: 150,
    });

    
//*********************************************
//  NAVIGATION SCRIPTS
//*********************************************

    //Get Navigation class names
        var themeNav = $(".modern-nav"),
            stickyNav = $(".modern-nav.sticky");

    //Call sticky for navigation
        $(stickyNav).sticky({topSpacing:0});

    //Scroll Spy
        var navMenu = document.querySelector(".modern-nav .nav-menu") || false;
        if (navMenu) {
            var inlineLink = navMenu.querySelectorAll("a[href^='#']:not([href='#']):not(.no-scroll):not([data-slide]):not([data-toggle])");
            if (inlineLink) {
                var scrollSpy = new bootstrap.ScrollSpy(document.body, { target: ".modern-nav .nav-menu", offset: 150 });
            }
        }


    //Get class when mouseover
        $(".modern-nav").on("mouseenter", function(){ $(".modern-nav").addClass("mouseover");})
        $(".modern-nav").on("mouseleave", function(){ $(".modern-nav").removeClass("mouseover");});

    //Add scrolled class when scroll down
        function getScrolledClass() {
            if ($(window).scrollTop() > 70) {
                if ($(themeNav).hasClass("sticky") || $(themeNav).hasClass("fixed") ) {
                    $(themeNav).addClass("scrolled");
                    if ($(".modern-nav .top-bar:not(.cookie)").exists() || $(".modern-nav.has-header-cookie-bar .cookie-active").exists() ) {
                        if (mobile === false) {
                            var barH = $(".modern-nav .top-bar").outerHeight();
                            $(themeNav).css({"-webkit-transform":"translateY(-"+ barH + "px" + ")", "transform":"translateY(-" + barH + "px" + ")"});
                        }
                    }
                }
            }
            else {
                $(themeNav).removeClass("scrolled");
                var barH = $(".modern-nav .top-bar").outerHeight();
                $(themeNav).css({"-webkit-transform":"none", "transform":"none"});
            }
        } getScrolledClass();

        var scroll = function () {
            var linkParent =  $(".nav-menu").find("a").parents("li"), linkParentActive = $(".nav-menu").find("a.active").parents("li");
            $(linkParent).removeClass("active");
            $(linkParentActive).addClass("active");
            getScrolledClass();
            if($(window).scrollTop() + $(window).height() === $(document).height()) {
                $(hideByScroll).removeClass('hiding');
            }
        };

        var waiting = false, endScrollHandle;
        $(window).on("scroll", function () {
            if (waiting) { return; }
            waiting = true;
            // clear previous scheduled endScrollHandle
            clearTimeout(endScrollHandle);
            scroll();
            setTimeout(function () {
                waiting = false;
            }, 50);
            // schedule an extra execution of scroll() after 200ms
            // in case the scrolling stops in next 100ms
            endScrollHandle = setTimeout(function () { scroll(); }, 50);
        });

    //Dropdown styles
    $('.modern-nav .dd-toggle').each(function() {
        var showMobileNav = 992,
            $this = $(this),
            nTimer = null;

        //Element over function work for desktops
        $(this).on('mouseenter', function(){
            if ($(window).width() > showMobileNav) {
                window.clearTimeout(nTimer);
                var $this = $(this), $item = $($this).find('>.dropdown-menu');
                $($item).stop(true,true).addClass("d-flex");
                $('.modern-nav .dd-toggle').not($this).not($(this).parents('.dd-toggle')).not($(this).find('.dd-toggle')).find('.dropdown-menu').stop(true,true).removeClass("d-flex").parents().removeClass("showing");

                //Check screen sizes, dropdown width and heights
                var navTop = $(themeNav).offset().top,
                    navHeight = $(themeNav).outerHeight(),
                    itemTop = $($item).offset().top - navTop,
                    itemWidth = $($this).outerWidth(),
                    itemHeight = $($item).outerHeight(),
                    wHeight = $(window).outerHeight(),
                    ofRight = ($(window).outerWidth() - ($item.offset().left + $item.outerWidth())),
                    thisRight = ($(window).outerWidth() - ($this.offset().left + $this.outerWidth())),
                    ofBottom = ($(window).outerHeight() - (itemTop + $item.outerHeight()));
                if (ofRight < 30) {
                    if ($($item).hasClass('mega-menu')) {
                        if ($($item).hasClass('to-center')) { $($item).addClass('to-left centered-lg').removeClass('to-right to-center').css({'right': - thisRight + 10 + 'px' });}
                        if ($($item).hasClass('to-right')) { $($item).addClass('to-left right-lg').removeClass('to-right to-center').css({'right': - thisRight + 10 + 'px' });}
                    }
                    else {$($item).removeClass('to-right to-center').addClass('to-left');}
                } else{
                    if ($($item).hasClass('centered-lg')) { $($item).addClass('to-center').removeClass('to-right to-left centered-lg').css({'right':'auto' });}
                    if ($($item).hasClass('right-lg')) { $($item).addClass('to-right').removeClass('to-left to-center right-lg').css({'right':'auto' });}
                }
                if (ofBottom < 20) {
                    if (!$($item).hasClass('mega-menu')) { $($item).css({'top': (wHeight -  (itemTop + itemHeight)) - 20 + 'px' }) }
                }
            }
        });
        //Element leave function work for desktops
        $(this).on('mouseleave',function(){
            var $this = $(this), $item = $($this).find('.dropdown-menu');
            if ($(window).width() > showMobileNav) {
                nTimer = window.setTimeout( function(){ $($item).removeClass("d-flex"); }, 400);
            }
        });
        // Close dropdown menu when hover another link
        $('.modern-nav .nav-links>li:not(.dd-toggle) a').on('mouseenter', function(){
            if ($(window).width() > showMobileNav) {
                $('.modern-nav .dropdown-menu').stop().hide();
            }
        });
        //work dropdown for mobile devices
        $(this).find(">a:not(.lg)").on("click", function(){
            var elem = $(this);
            if ($(window).width() < showMobileNav) {
                if (elem.next("ul").length ) { $(elem).attr("href", "#"); }
                $($this).find('>.dropdown-menu').stop().slideToggle({duration: 400, easing: "easeInOutQuart"}).parent().toggleClass("showing");
                $('.modern-nav .dd-toggle').not($this).not($(this).parents('.dd-toggle')).not($(this).find('.dd-toggle')).find('.dropdown-menu').stop(true,true).slideUp({duration: 400, easing: "easeInOutQuart"}).parent(".dd-toggle").removeClass("showing");
                return false;
            }
        });
    });
    // Show/Hide mobile navigation
    $('.mobile-nb').on("click", function(){
        $(".modern-nav .mobile-nav-bg").fadeIn(300);
        $('.modern-nav, .modern-nav .nav-menu').addClass("active");
        $('.modern-nav li').removeClass("showing");
        $('.modern-nav .dropdown-menu').hide(300);
        setTimeout( function(){ $('.modern-nav .nav-menu').addClass("animate"); }, 300);
        return false;
    });
    $('.mobile-nav-bg').on("click", function(){
        $('.modern-nav .nav-menu').removeClass("animate");
        $(".modern-nav .mobile-nav-bg").fadeOut(300);
        $('.modern-nav li').removeClass("showing");
        $('.modern-nav .dropdown-menu').slideUp(300);
        setTimeout( function(){ $('.modern-nav, .modern-nav .nav-menu').removeClass("active"); }, 500);
        return false;
    });


    var waiting = false, endScrollHandle;
    window.addEventListener('scroll', function(){
        if (waiting) { return; }
        waiting = true;
        // clear previous scheduled endScrollHandle
        clearTimeout(endScrollHandle);
        scroll();
        setTimeout(function () {
            waiting = false;
        }, 50);
        // schedule an extra execution of scroll() after 200ms
        // in case the scrolling stops in next 100ms
        endScrollHandle = setTimeout(function () { scroll(); }, 50);
    });

// Validate all ".validate-me" forms with animations
    (function () {
        'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.validate-me');

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms).forEach(function (form) {
            var checkValidForEach = function () {
                var invalidElem = form.querySelector("[required]:invalid");
                if (!invalidElem) {
                    form.classList.remove("no-valid");
                }
            }
            form.addEventListener('keyup', checkValidForEach, false); 
            form.addEventListener('change', checkValidForEach, false); 
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    form.classList.add("no-valid");
                    form.querySelector("[required]:invalid").focus();
                    event.preventDefault()
                    event.stopPropagation()
                } else{

                    //Animations for contact form
                    if (form.getAttribute("id") === "contact-form") {
                        var formCont = document.querySelector("#contact-form-container"),
                            formWrapper = document.querySelector(".contact-form-wrapper"),
                            successWrapper = document.querySelector(".success-message-wrapper");
                        //Directly
                        setTimeout(function() {
                            formCont.classList.add("success");
                        }, 0);
                        //After half second
                        setTimeout(function() {
                            formWrapper.classList.add("hidden");
                            successWrapper.classList.remove("hidden");
                        }, 900);
                        //After half second - must be in different function
                        setTimeout(function() {
                            successWrapper.classList.add("ready");
                        }, 900);
                    }

                    //Animations for newsletter form
                    if (form.getAttribute("id") === "newsletter-form") {
                        var newsContainer = document.getElementById("newsletter-container"),
                            newsWrapper = document.getElementById("newsletter-wrapper"),
                            newsSuccesWrapper = document.getElementById("newsletter-success-wrapper"),
                            wrapperH = newsWrapper.offsetHeight;
                        //Add active class firstly
                        newsContainer.classList.add("success");
                        setTimeout(function() {
                            newsContainer.classList.add("hide-form");
                            newsSuccesWrapper.style.height = wrapperH+"px";
                        }, 500);
                        //After 550ms get ready class to show success message
                        setTimeout(function() {
                            newsContainer.classList.add("show-message");
                        }, 550);
                    }
                    
                    event.preventDefault();
                }
            form.classList.add('was-validated')
            }, false)
        })
    })()

