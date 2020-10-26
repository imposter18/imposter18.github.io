$(document).on('DOMContentLoaded', () => {
    $('.slider-for').slick({
      slidesToShow: 1,
      // slidesToScroll: 1,
      prevArrow: $('.prev'),
      nextArrow: $('.next'),
      fade: true,
      centerMode: true,
     
    });
    $('.slider-nav').slick({
      slidesToShow: 3,
      // slidesToScroll: 1,
      asNavFor: '.slider-for',
      dots: false,
      centerMode: true,
      focusOnSelect: true,
      vertical: true,
      arrows: false,
      
      
    });
  });
  
