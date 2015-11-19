var sliderDebug = false;
var sliderNum = 1;

jQuery(document).ready(function() {
	jQuery(".slider-widget").each(function() {
		addSlider(this);
	});
});
 
jQuery(window).load(function() {
	for (var k in sliderHash) {
	    // use hasOwnProperty to filter out keys from the Object.prototype
	    if (sliderHash.hasOwnProperty(k)) {
	        sliderHash[k].sizeSlider();
	    }
	}
});

jQuery(window).resize(function() { 
	for (var k in sliderHash) {
	    // use hasOwnProperty to filter out keys from the Object.prototype
	    if (sliderHash.hasOwnProperty(k)) {
	        sliderHash[k].sizeSlider();
	    }
	}
});

function addSlider(container) {
	var newSlider = new slider(container);
	var sliderId = jQuery(container).parent().attr('id');

	if (typeof sliderId === "undefined") {
		sliderId = 'slider-'+sliderNum;
		sliderNum++;
	}

	newSlider.setupSlider();

	sliderHash[sliderId] = newSlider;
}

var slider = function(container) {
	this.container = jQuery(container);

	//attributes
	this.sliderPageType = this.container.attr('pageType');
	this.sliderIsContinuous = this.container.attr('isContinuous');
	this.sliderAutoSlideInterval = this.container.attr('autoslideInterval');
	this.itemNum = 0;
	
	//callbacks
	this.sliderSizeCallback = this.container.attr('sizeCallback');
	this.sliderAnimationCallback = this.container.attr('animationCallback');
	this.sliderArrowCallback = this.container.attr('arrowCallback');

	//html objects
	this.slider = this.container.find('.slider');
	this.containerParent = this.container.parent();
	this.buttonActive = this.container.parent().find('.button.active');
	this.buttonActiveIndex = this.container.parent().find('.buttons .button').index(this.container.parent().find('.buttons .button.active'));
	this.buttonNext = null;
	this.firstArrow = this.container.parent().find('.arrow:first');
	this.lastArrow = this.container.parent().find('.arrow:last');
	
	//variables
	this.lastEventLeftPos = 0;
	if (this.slider.find('.item:last').length > 0)
		this.lastEventLeftPos = this.slider.find('.item:last').position().left;
	
	this.sliderLeftPos = parseInt(this.slider.css('left').replace('px', ''));
	this.containerWidth = this.container.width();
	this.sliderWidth = this.slider.width();
	this.viewport = 'desktop';
	this.sliderTimer = null;

	//methods
	this.setupSlider = function() {
		var sliderItem = this;

		this.sizeSlider();

		this.bindSlider();

		if (this.sliderIsContinuous == 'yes') {
			sliderItem.slider.find('.item:eq(0)').addClass('active');

			sliderItem.slider.find('.item').each(function() {
				var itemIndex = sliderItem.slider.find('.item').index(this);

				jQuery(this).attr('index', itemIndex);
			});
		}

		if (this.sliderAutoSlideInterval != "") {
			sliderItem.sliderTimer = setInterval(function() {
				sliderItem.doSlide(-1);
			}, parseInt(sliderItem.sliderAutoSlideInterval));
		}

		sliderDebugMessage('setupSlider finished');
	}

	this.sizeSlider = function() {		
		var sliderItem = this;

		if (jQuery('body').hasClass('desktop')) {
			this.viewport = 'desktop';
		}
		else if (jQuery('body').hasClass('tablet')) {
			this.viewport = 'tablet';
		}
		else if (jQuery('body').hasClass('mobile')) {
			this.viewport = 'mobile';
		}

		switch(this.viewport) {
			case "desktop":
				this.itemNum = this.container.attr('desktop');
			break;
			case "tablet":
				this.itemNum = this.container.attr('tablet');
			break;
			case "mobile":
				this.itemNum = this.container.attr('mobile');
			break;
		}

		this.container.find('.item').css('width', parseInt(this.container.css('width').replace('px', '')) / this.itemNum);
		
		if (this.container.find('.item').length > 0) {
			this.slider.css('width', (this.container.find('.item').length * (parseInt(this.container.css('width').replace('px', ''))) / this.itemNum)+'px');
		}

		if (this.sliderIsContinuous != 'yes') {
			sliderItem.containerParent.find('.buttons .button.active').removeClass('active');
			sliderItem.containerParent.find('.buttons .button:eq(0)').addClass('active');
		}

		if (typeof this.sliderSizeCallback != 'undefined' && this.sliderSizeCallback != "")
			window[this.sliderSizeCallback]();
		else
			this.slider.css('left', '0px');
	}

	this.bindSlider = function() {
		var sliderItem = this;

		//back
		this.firstArrow.click(function(e) {
			sliderItem.doSlide(1);

			if (sliderItem.sliderTimer != null) {
				clearInterval(sliderItem.sliderTimer);
			}
		});
		//forward
		this.lastArrow.click(function(e) {
			sliderItem.doSlide(-1);

			if (sliderItem.sliderTimer != null) {
				clearInterval(sliderItem.sliderTimer);
			}
		});

		this.containerParent.find('.button').click(function() {
			var nextIndex = sliderItem.containerParent.find('.buttons .button').index(this);
			var currentIndex = sliderItem.containerParent.find('.buttons .button').index(sliderItem.containerParent.find('.buttons .button.active'));
			var diffIndex = currentIndex - nextIndex;

			if (sliderItem.container.find('.slider .item.active').hasClass('first') && diffIndex == -(sliderItem.container.find('.slider .item').length-1)) {
				sliderItem.doSlide(1);
			}
			else if (sliderItem.container.find('.slider .item.active').hasClass('last') && diffIndex == (sliderItem.container.find('.slider .item').length-1)) {
				sliderItem.doSlide(-1);
			}
			else {
				sliderItem.doSlide(diffIndex);
			}

			if (sliderItem.sliderTimer != null) {
				clearInterval(sliderItem.sliderTimer);
			}
		});

		sliderDebugMessage('bindSlider ended');

	}

	this.unbindSlider = function() {
		this.containerParent.find('.arrow').unbind('click');
		this.containerParent.find('.button').unbind('click');
	}

	this.doSlide = function(num) {
		var sliderItem = this;
		
		var doSlide = true;
		sliderItem.buttonActive = sliderItem.containerParent.find('.button.active');
		sliderItem.buttonActiveIndex = sliderItem.containerParent.find('.buttons .button').index(sliderItem.containerParent.find('.buttons .button.active'));
		sliderItem.buttonNext = null;
		sliderItem.lastEventLeftPos = sliderItem.slider.find('.item:last').position().left;
		sliderItem.sliderLeftPos = parseInt(sliderItem.slider.css('left').replace('px', ''));
		sliderItem.containerWidth = sliderItem.container.width();
		sliderItem.sliderWidth = sliderItem.slider.width();

		sliderItem.unbindSlider();

		if ((sliderItem.buttonActiveIndex - num) >= sliderItem.containerParent.find('.buttons .button').length) {
			sliderItem.buttonNext = sliderItem.containerParent.find('.buttons .button:eq(0)');
		}
		else {
			sliderItem.buttonNext = sliderItem.containerParent.find('.buttons .button:eq('+(sliderItem.buttonActiveIndex - num)+')');
		}

		if (sliderItem.sliderIsContinuous == "yes") {
			if (typeof sliderItem.sliderArrowCallback != 'undefined' && sliderItem.sliderArrowCallback != "")
				window[sliderItem.sliderArrowCallback](num);

			sliderItem.buttonActive.removeClass('active');
			sliderItem.buttonNext.addClass('active');

			switch(sliderItem.sliderPageType) {
				case "item":
					//backwards
					if (num > 0) {
						for (i=1;i <= Math.abs(num);i++) {
							var tempItem = sliderItem.slider.find(".item:last");
							tempItem.remove();
							sliderItem.slider.prepend(tempItem);
							sliderItem.slider.css('left', -(sliderItem.container.find('.item:eq(0)').width()*i)+'px');
							
							sliderItem.slider.find(".item.active").removeClass('active');
							sliderItem.slider.find(".item:eq(0)").addClass('active');
						}
						
						sliderItem.slider.animate({
							left: 0
						}, 500, function() {
							sliderItem.bindSlider();

							//sends the slide direction with the function
							if (typeof sliderItem.sliderAnimationCallback != 'undefined' && sliderItem.sliderAnimationCallback != "")
								window[sliderItem.sliderAnimationCallback](num);
						});
					}
					//forwards
					else {
						sliderItem.slider.animate({
							left: (sliderItem.sliderLeftPos + (num *sliderItem.container.find('.item:eq(0)').width()))
						}, 500, function() {
							
							for (i=0;i < Math.abs(num);i++) {
								var tempItem = sliderItem.slider.find(".item:first");
								tempItem.remove();
								sliderItem.slider.append(tempItem);
								sliderItem.slider.css('left', '0px');
								
								sliderItem.slider.find(".item.active").removeClass('active');
								sliderItem.slider.find(".item:eq(0)").addClass('active');
							}
							
							sliderItem.bindSlider();

							//sends the slide direction with the function
							if (typeof sliderItem.sliderAnimationCallback != 'undefined' && sliderItem.sliderAnimationCallback != "")
								window[sliderItem.sliderAnimationCallback](num);
						});
					}

				break;
				default:
					if (num > 0) {
						for (i=1;i <= Math.abs(num);i++) {
							for (var j=0;j < sliderItem.itemNum;j++) {
								var tempItem = sliderItem.slider.find(".item:last");
								tempItem.remove();
								sliderItem.slider.prepend(tempItem);
							}

							sliderItem.slider.css('left', -(sliderItem.container.find('.item:eq(0)').width()*sliderItem.itemNum)+'px');
							
							sliderItem.slider.find(".item.active").removeClass('active');
							sliderItem.slider.find(".item:eq(0)").addClass('active');
						}
						
						sliderItem.slider.animate({
							left: 0
						}, 500, function() {
							sliderItem.bindSlider();

							//sends the slide direction with the function
							if (typeof sliderItem.sliderAnimationCallback != 'undefined' && sliderItem.sliderAnimationCallback != "")
								window[sliderItem.sliderAnimationCallback](num);
						});
					}
					//forwards
					else {
						//console.log(sliderItem.itemNum);

						sliderItem.slider.animate({
							left: (sliderItem.sliderLeftPos + (num *sliderItem.containerWidth))
						}, 500, function() {
							
							for (i=0;i < Math.abs(num);i++) {
								for (var j=0;j < sliderItem.itemNum;j++) {
									var tempItem = jQuery(sliderItem.slider).find(".item:first");
									tempItem.remove();
									sliderItem.slider.append(tempItem);
								}

								sliderItem.slider.css('left', '0px');
								
								sliderItem.slider.find(".item.active").removeClass('active');
								sliderItem.slider.find(".item:eq(0)").addClass('active');
							}
							
							sliderItem.bindSlider();

							//sends the slide direction with the function
							if (typeof sliderItem.sliderAnimationCallback != 'undefined' && sliderItem.sliderAnimationCallback != "")
								window[sliderItem.sliderAnimationCallback](num);
						});
					}
				break;
			}
		}
		else {
			if (num > 0 && sliderItem.sliderLeftPos >= 0) {
				doSlide = false;
			}
			else if (num < 0 && sliderItem.sliderLeftPos < -Math.round(sliderItem.lastEventLeftPos-sliderItem.containerWidth)) {
				doSlide = false;
			}

			if (doSlide) {
				if (typeof sliderItem.sliderArrowCallback != 'undefined' && sliderItem.sliderArrowCallback != "")
					window[sliderItem.sliderArrowCallback](num);

				sliderItem.buttonActive.removeClass('active');
				sliderItem.buttonNext.addClass('active');

				switch(sliderItem.sliderPageType) {
					case "item":
						sliderItem.slider.animate({
							left: (sliderItem.sliderLeftPos + (num * sliderItem.container.find('.item:eq(0)').width()))
						}, 500, function() {
							sliderItem.bindSlider();

							//sends the slide direction with the function
							if (typeof sliderItem.sliderAnimationCallback != 'undefined' && sliderItem.sliderAnimationCallback != "")
								window[sliderItem.sliderAnimationCallback](num);
						});
					break;
					default:
						sliderItem.slider.animate({
							left: (sliderItem.sliderLeftPos + (num *sliderItem.containerWidth))
						}, 500, function() {
							sliderItem.bindSlider();

							//sends the slide direction with the function
							if (typeof sliderItem.sliderAnimationCallback != 'undefined' && sliderItem.sliderAnimationCallback != "")
								window[sliderItem.sliderAnimationCallback](num);
						});
					break;
				}
			}
			else {
				sliderItem.bindSlider();
			}
		}
	}
}

function sliderDebugMessage(message) {
	if (sliderDebug) {
		console.log(message);
	}
}
