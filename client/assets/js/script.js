$(document).ready(function () {

    // toggle mobile menu
    $('[data-toggle="toggle-nav"]').on('click', function () {
        $(this).closest('nav').find($(this).attr('data-target')).toggleClass('hidden');
        return false;
    });

    // feather icons
    feather.replace();

    // smooth scroll
    var scroll = new SmoothScroll('a[href*="#"]');

    // tiny slider
    $('#slider-1').slick({
        infinite: true,
        prevArrow: $('.prev'),
        nextArrow: $('.next'),
    });

    $('#slider-2').slick({
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        centerMode: true,
        customPaging: function (slider, i) {
            return '<div class="bg-white br-round w-1 h-1 opacity-50 mt-5" id=' + i + '> </div>'
        },
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 1
            }
        }, ]
    });
});

window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
  
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var angle = 0;
  
    function drawRandomShape() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.random() + ')';
      var shapeType = Math.random() < 0.5 ? 'rect' : 'circle';
      if (shapeType === 'rect') {
        ctx.fillRect(-20, -20, Math.random() * 40, Math.random() * 40);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, Math.random() * 20, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  
    function drawFadingLine() {
      var startX = Math.random() * canvas.width;
      var startY = Math.random() * canvas.height;
      var endX = Math.random() * canvas.width;
      var endY = Math.random() * canvas.height;
      var opacity = Math.random();
  
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'rgba(0, 0, 0, ' + opacity + ')';
      ctx.stroke();
    }
  
    function animate() {
      drawRandomShape();
      drawFadingLine();
      angle += 0.02;
      requestAnimationFrame(animate);
    }
  
    animate();
  };
  