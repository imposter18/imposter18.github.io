// import  "./parts/slick.min.js";

$(document).on('DOMContentLoaded', () => {
    $('.head__slider-for').slick({
      slidesToShow: 1,
      
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
      // focusOnSelect
    });

    $('.articl__slier-for').slick({
      dots: false,
      prevArrow: $('.articl__prev'),
      nextArrow: $('.articl__next'),
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true,
      
    });

  });
  
  