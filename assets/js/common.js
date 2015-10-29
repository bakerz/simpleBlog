$(function(){
	// change page height
	$('body').css('height', $(window).get(0).innerHeight);
	$(window).resize(function() {
		$('body').css('height', $(window).get(0).innerHeight);
	});

	// switch file category tag
	$('#slide-panel .guid-item').on('click', function() {
		var page = $(this).data('page');
		$('#slide-panel .page-item').hide();
		$('#slide-panel').find('.' + page).show();
	});

	// click slider-btn to show or hide slider-panel
	$('#slider').on('click', function() {
		if($('#icon-slider').hasClass('fullscreen')) {
			$('#icon-slider').removeClass('fullscreen');
			$('#slide-panel').animate({
				marginLeft: '0'
			}, {
				duration: 300,
				queue: false,
				complete: function() {
					$('.contents-box').removeClass('fullscreen');
				}
			});
		} else {
			$('#icon-slider').addClass('fullscreen');
			$('#slide-panel').animate({
				marginLeft: '-640px'
			}, {
				duration: 300,
				queue: false,
				complete: function() {
					$('.contents-box').addClass('fullscreen');
				}
			});
		}
	});

	// show back2top-btn
	$('#contents').scroll(function(){
	    var t = $(this).scrollTop();
	    if( t >= 10) {
	    	if(!$('#back2top').is(":visible")){
		    	$('#back2top').show();
	    	}
	    } else {
	    	$('#back2top').hide();
	    }
	});

	// back to top
	$('#back2top').click(function() {
		$('#contents').animate({
			scrollTop: '0'
		}, 700);
	});

	// side index-list
	$('#index-btn').click(function() {
		if($(this).hasClass('show')){
			$(this).removeClass('show');
			$('#index-panel').animate({
				right: '-100px'
			}, 300).dequeue();
		} else {
			$(this).addClass('show');
			$('#index-panel').animate({
				right: '0'
			}, 300).dequeue();
		}
	});

	// use jquery-pjax
	$('.x-pjax').on('click', function() {
		$(this).addClass('active').siblings().removeClass('active');
	});
	$(document).pjax('[data-pjax] a, a[data-pjax]', '#contents', { 
		fragment: '#contents',
		timeout: 10000
	});
	$(document).on('pjax:end', function() {
		pjaxEnd();
	});

	// 获取标签
	$.getJSON('/simplex/data/post.json', function(data) {
		var html = "",
			len = data.size,
			datas = data.datas;
		for(var i in data.datas) {
			if(datas[i].tags.length > 0) {
				for(var j in datas[i].tags) {
					html += datas[i].tags[j] + ',';
				}
			}
		}
		//$('.tags-box').html(html);
	});

	// get article by tag
	$('.tags-all span').on('click', function() {
		var key = $(this).data('tag');
		$.getJSON('/simplex/data/post.json', function(data) {
			var count = 0,
				datas = data.datas,
				html = '<h2>标签：'+ key +'</h2><ul>';
			$.each(datas, function(i, item) {
				for(var i in item.tags) {
					if(item.tags[i] == key) {
						html += '<li class="x-pjax"><a href="/simplex'+item.url+'" data-pjax>'+item.title+'</a></li>';
						count++;
					}
				}
			});
			if(count > 0) {
				html += '</ul>';
				$('.tags-box').html(html);
			}
		});
	});

	// get article by category
	$('.category-all span').on('click', function() {
		var key = $(this).data('category');
		$.getJSON('/simplex/data/post.json', function(data) {
			var count = 0,
				datas = data.datas,
				html = '<h2>分类：'+ key +'</h2><ul>';
			$.each(datas, function(i, item) {
				if(item.category){
					if(item.category == key) {
						html += '<li class="x-pjax"><a href="/simplex'+item.url+'" data-pjax>'+item.title+'</a></li>';
						count++;
					}
				}
			});
			if(count > 0) {
				html += '</ul>';
				$('.category-box').html(html);
			}
		});
	});

	pjaxEnd();
});

function pjaxEnd(){
	// catalogue automatic hide in mobile
	if($(window).width() <= 640) {
		$('#slide-panel').animate({
			marginLeft: '-640px'
		}, 500).dequeue();
		$('#icon-slider').addClass('fullscreen');
	}

	// open page in new tab
	$('a[href^="http"]').each(function() {
		$(this).attr('target', '_blank');
	});

	// code highlight
	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
}