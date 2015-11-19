// JavaScript Document

function init($) {

    $(".autreLangue a").each(function(index, element) {
        var theLink = $(this);
        if($("body").attr("id") === theLink.attr("class")){
            theLink.toggleClass("on");
        }
    });


    if ($(".autreLangue a.mobile").is(":visible")){
        var tog = 0;
        $(".autreLangue a.mobile").click(function(e){
            e.preventDefault();
            if(tog == 0){
                $(this).css({"background-position": "center -36px","background-color": "#333"}).siblings("a").not(".on").animate({height: '40px', }, 800).css({borderBottom : "1px solid #666"});
                tog = 1;
            } else {
                $(".autreLangue a").each(function() {
                    theLink = $(this).not(".on").not(".mobile");
                    if ($(".autreLangue a.on").css("position") == "absolute"){
                        theLink.animate({height: '0'}, 500, function(){
                            $(".autreLangue a.mobile").css({"background-position": "center 16px","background-color": "transparent"});
                        }).css({borderBottom : "none"});
                    };
                });
                tog = 0;
            };
        });
    }



    $("#searchsubmit").click(function(e){
        $(this).parent().submit();
    });

/************** Accueil ****************/


    if ($("body").hasClass("home")) {

        $(".menuMain a:eq('0')").addClass("on");


        if(!$('.WE').hasClass("samedi")) {
            $('#slide1 .bxslider').bxSlider({
                controls: false,
                pagerSelector: '#slide1 .pager',
                auto: true,
                pause: 7000,
                speed: 800
            });
        } else {
            $('#slide1 .bxslider').bxSlider({
                controls: false,
                pagerSelector: '#slide1 .pager',
                auto: false,
                pause: 7000,
                speed: 800
            });
        }


        $('#slide3 .bxslider').bxSlider({
            pagerType: 'short',
            pagerSelector: '#slide3 .pager',
            nextText: 'Suivant',
            prevText: 'Précédant',
            nextSelector: '#slide3 .next',
            prevSelector: '#slide3 .prev'
        });

        $('.togglePlus').click(function(e) {
            e.preventDefault();
            $(this).children("span").each(function(){
                $(this).toggleClass("on");
            });
            $(this).prev('#toggle').slideToggle(1000);
        });
        
    }//if

	$(".blockAlbumTeasers .teasers a:eq(1)").css({float: "right"});

/************** menuMain ****************/
    locator = location.href;

    $(".menuMain a").each(function() {
        theButton = $(this);
        
        if(locator == theButton.attr("href")){
            theButton.addClass("on");
            }
    });


    $(".meteo").mouseenter(function(){
        $(".villes").slideDown(1000, function(){
            $(".villes p").each(function(){
                $(this).slideDown(800);
            });
        });
    });

    $(".villes").add("#header").mouseleave(function(){
        $(".villes p").slideUp(600, function(){
        $(".villes").slideUp(500);
        });
    });

/************** Col droite ****************/

    $(".RC, .CBC, .VC, .AL, .HL").mCustomScrollbar({
        scrollButtons:{
            enable:true
        },
        theme: "dark"
    });

    $(".selector a").click(function(e){
        e.preventDefault();
        leButton = $(this);
        leButton.parent("div").next().children("div").hide();
        leButton.toggleClass("on").siblings("a").removeClass("on")
            .parent("div").next()
            .children("div:eq('" + leButton.index() + "')")
            .show("fast");
    });


    if($(".selecteurFils").hasClass("samedi") ){
        $(".selecteurFils .selector a:eq(0)").trigger("click");
    } else {
        $(".selecteurFils .selector a:eq(1)").trigger("click")
    }

    if($("body").hasClass("category-a-l-affiche")){
        $(".selecteurFils .selector a:eq(2)").trigger("click");
    }

    if($(".filsNouvelles").hasClass("fr")){
        $(".filsNouvelles .selector a:eq(0)").trigger("click");
    } else {
        $(".filsNouvelles .selector a:eq(1)").trigger("click")
    }

/************** posts ****************/

    $(".align-center").width($(".align-center").children("img").width());
    


    $(".post-meta .contact").click(function(e){
        e.preventDefault();
        if($(".post-meta .courriel").is(":visible")){
            $(".post-meta .courriel").fadeOut(1000)
        }else{
            position = $(this).position();
            $(".post-meta .courriel").css({left: "" + position.left + "px"}).fadeIn(1000)
        }
    });
    
    $(".post-meta .courriel").mouseleave(function(){
        $(".post-meta .courriel").fadeOut(1000)
    });

    $("#searchform .field").focus(function(){$(this).val("")});
    
    $(".netiquette h5 a").click(function(e){
        e.preventDefault();
        if($(".full").is(":hidden")){
            $(".full").slideDown(1000); 
        } else {
            $(".full").slideUp(1000); 
        }
    });


    $(".category-question .addthis_toolbox:eq(1)").hide();

/************** page émission ****************/

    $(".emission a.btn").click(function(e){
        e.preventDefault();
        theDiv = $("div.animateur");
        if((theDiv.is(":visible"))){
            $(this).toggleClass("on");
            theDiv.slideUp(1000);
        } else {
            $(this).toggleClass("on");
            theDiv.slideDown(1000);
        }
    });

    $(".animateur a.an").click(function(e){
        e.preventDefault();
        btn = $(this);
        theDiv = $("div.animateur div");
        theDiv.hide();
        $(".animateur a.an").toggleClass("on", false);
        btn.toggleClass("on");
        $("div.animateur div").eq(btn.index()).show();
    });

$(".animateur a.an").eq(0).trigger("click");
/**************      ****************/

    $(document).on("click", "a[data-media-id]", function (event) {
        var $link = $(this),
            mediaId = $link.attr("data-media-id"),
            mediaImage = $link.attr("data-media-image"),
            mediaLocale = $link.attr("data-media-locale"),
            mediaAppCode = $link.attr("data-media-appCode") ? $link.attr("data-media-appCode") : 'medianet';

        window.open("/console.php?id=" + mediaId + "&image=" + mediaImage + "&locale=" + mediaLocale + "&appCode=" + mediaAppCode, 'ecoutez', 'toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,history=no,resizable=yes,width=680,height=380');

        event.preventDefault();
    });



    $("figure.image").css("width", function(){
        theNum = $(this).find("img").attr("width");
    });




    /*TABS*/
    var $lienOnglet=$(".tabsContainer .navOnglets a");
    var hash=window.location.hash;

    $lienOnglet.click(function(){
        var url=$(this).attr("href").replace('#','');
        $lienOnglet.removeClass('active');
        $('.tabsContainer .tabContent').hide();
        $(this).addClass('active');
        $('.tabsContainer #contenu-'+url).show();
    });

    if(hash!="") {
    $(".tabsContainer .navOnglets a[href='"+hash+"']").click();
    }
    else{
    $(".tabsContainer .navOnglets a.active").click();
    }



    /*Collapsing button*/
    $("#es-ES .Blind").before("<a href='#' class='theTrigger'>Mas &raquo;</a>");
    $("#es-ES .theTrigger").click(function(e){
        e.preventDefault();
        var theBlind = $(this).next(".Blind");
        var theTrigger = $(this);
        if(theBlind.is(":visible")){
            theBlind.slideUp(400, function(){

                theTrigger.text("Mas »");
            });
        } else{
            theBlind.slideDown(1000, function(){
            theTrigger.text("Menos »")
            });
        }
    });



}; /** init() **/




var site = function () {
    var $ = jQuery;

    function initLayout() {
        activerPopUp();
        replaceBrokenImage();
        initColorBox();
    }

    function activerPopUp() {
        $("a[data-popUp='true']").click(function (e) {
            e.preventDefault();

            var monUrl = $(this).attr('href');
            var nomFenetre = $(this).attr('data-nomFenetre');
            var newWindow = window.open(monUrl, nomFenetre, 'toolbar=no,directories=no,status=no,menubar=no,scrollbars=yes,history=no,resizable=yes,width=990,height=438');
        });
    }

    function replaceBrokenImage() {
        $(window).load(function () {
            $("img").each(function () {
                var image = $(this);
                var placeholder = image.attr('data-placeholder');
                if ((image.context.naturalWidth == 0 || image.readyState == 'uninitialized') && placeholder) {
                    $(image).unbind("error").attr("src", placeholder).addClass('phBrokenImage');
                }
            });
        });
    }

    function initColorBox() {
        $(".inline.colorbox").colorbox({ inline: true, opacity: 0.85 });
    }

    //CONTACT
    function initContact() {
        var $form = $("#formContact"),
            $button = $("#submitForm");
        
        validate($form);

        $button.click(function (e) {
            e.preventDefault();
            
            if (validate($form) == true) {
                $form.submit();
            }
        });

        $form.on('keypress', 'input, textarea', function (e) {
            if (e.which == 13) {
                $button.click();
            }
        });
    }

    //valide une adresse courriel
    function isEmail(email) {
        // Regex from jquery-validate
        var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
        return regex.test(email);
    }

    function validate(form) {
        var valid = true;

        form.find("li,div").removeClass('invalid');

        //verifie que tous les champs requis sont completes
        form.find("input[data-required='yes'],textarea[data-required='yes']").each(function () {
            if ($.trim($(this).val()) == "") {
                $(this).parent().addClass('invalid');
                valid = false;
            }
        });


        //valide les adresses courriel
        form.find("input[data-type='courriel']").each(function () {
            if (!isEmail($(this).val())) {
                $(this).parent().addClass('invalid');
                valid = false;
            }
        });

        return valid;
    }

    function centrerHauteurImageGalleria($element, srcImg) {
        $element.attr('src', srcImg);
        $element.imagesLoaded(function () {
            var hauteurImage = $element.height();
            $element.css('margin-top', -(hauteurImage / 2) + 84 + 'px');
            $element.css('visibility', 'visible');
        });
    }

    function loadGalleria(id, $idJquery, $callToAction, data) {
        Galleria.ready(function () {
            if ($(this._original.target).attr('id') == id) {
                var gallery = this;
                $callToAction.click(function (e) {
                    e.preventDefault();
                    gallery.openLightbox();
                });
            }
        }).run($idJquery, {
            dataSource: data, height: 453, width: 500
        });



    }


    return {
        initLayout: initLayout,
        initContact: initContact,
        centrerHauteurImageGalleria: centrerHauteurImageGalleria,
        loadGalleria: loadGalleria
    };
} ();
