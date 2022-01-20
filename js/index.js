$(document).ready(function(){
  // Слайдер тренеров
  if ($('.slider-coach').length > 0) {
    $('.slider-coach').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      dots: true,
      prevArrow: '<button class="slick-btn prev"><img src="img/btn-prev.png"></button>',
      nextArrow: '<button class="slick-btn next"><img src="img/btn-next.png"></button>',
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  }

  // Увеличение отзывов
  $('.review-block').on('mouseover', function() {
    if ($(window).width() <= 991) return;
    if ($('.review-block:visible').length > 4) return;

    $(this).css('transform', 'scale(1.2)');
    $(this).parent().nextAll().each((i, el) => {
      $(el).find('.review-block').css({
        transform: 'translate(25px)',
      });
    });
    $(this).parent().prevAll().each((i, el) => {
      $(el).find('.review-block').css({
        transform: 'translate(-25px)',
      });
    });
  });
  $('.review-block').on('mouseout', function() {
    if ($(window).width() <= 991) return;

    $('.review-block').css({
      transform: 'scale(1)',
      transformOrigin: 'center',
      transform: 'translate(0px)',
    });
  });

  // Больше отзывов
  if ($('.review-block').length < 5) {
    $('.more-reviews').remove();
  }
  $('.more-reviews').on('click', function() {
    $('.review-block').css('transition', 'none');
    $('.review-block').slideDown();
    $(this).fadeOut();
  });

  // Кнопка наверх
  $(window).on("scroll", function() {
    let isMobile = $(window).width() <= 768;
    let height = $(window).height();
    if ($(window).scrollTop() > height && !isMobile) {

      $('.btn-top').show({
        duration: 'fast',
        complete: () => {
          $('.btn-top').css('transition', '0.2s');
        }
      });
    } else {
      $('.btn-top').hide({
        duration: 'fast',
        complete: () => {
          $('.btn-top').css('transition', '0s');
        }
      });
    }
  });

  // Меню
  $('body').on('click', '.nav-button:not(.open)', function(){
    let $this = $(this);
    $this.toggleClass('open');
    $('.nav-mini').toggleClass('open');
    setTimeout(() => {
      $('body').one('click', function() {
        $this.removeClass('open');
        $('.nav-mini').removeClass('open');
      });
    });
  });

  // Select
  $('.select').on('click', 'p', function() {
    if ($(this).hasClass('disabled')) return;
    
    let $select = $(this).parent();
    setTimeout(() => {
      $select.find('.select-list').removeClass('d-none');
    });
  });
  $(document).on('click', function() {
    $('.select-list').addClass('d-none');
  });

  $('.select').on('click', '.item', function() {
    let $select = $(this).closest('.select');
    
    let val = $(this).data('value');
    $select.find('input').val(val).trigger('change');

    let name = $(this).text();
    $select.find('p').text(name);
  });
});

function dateFormat(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  let yy = date.getFullYear();

  return `${dd}.${mm}.${yy}`;
}

$.fn.setCursorPosition = function(pos) {
  if ($(this).get(0).setSelectionRange) {
    $(this).get(0).setSelectionRange(pos, pos);
  } else if ($(this).get(0).createTextRange) {
    var range = $(this).get(0).createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
};