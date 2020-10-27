$(document).on('DOMContentLoaded', () => {
    $('.head__slider-for').slick({
      slidesToShow: 1,
      // slidesToScroll: 1,
      prevArrow: $('.prev'),
      nextArrow: $('.next'),
      fade: true,
      centerMode: true,
     
    });
    $('.head__slider-nav').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: '.head__slider-for',
      dots: false,
      centerMode: true,
      focusOnSelect: true,
      vertical: true,
      arrows: false,
      
      
    });
  });
  
  