$(function () {
  // slick
  if ($.fn.slick) {
    $(".bestwrap").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
        { breakpoint: 1250, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
      ],
    });
  }

  const $win = $(window);
  const $headerWrap = $(".headerwrap");
  const $topBtn = $("#topBtn");

  const $logo = $("header h1 img");
  const $login = $(".login img");
  const $bag = $(".bag img");
  const $heart = $(".heart img");

  const assets = {
    dark: {
      logo: "./이미지/톤28로고_화이트.png",
      login: "./이미지/픽토그램/login.png",
      bag: "./이미지/픽토그램/bag.png",
      heart: "./이미지/픽토그램/heart.png",
    },
    light: {
      logo: "./이미지/톤28로고_컬러.png",
      login: "./이미지/픽토그램/login2.png",
      bag: "./이미지/픽토그램/bag2.png",
      heart: "./이미지/픽토그램/heart2.png",
    },
  };

  let currentTheme = null;

  function setTheme(theme) {
    if (currentTheme === theme) return;
    currentTheme = theme;

    $logo.attr("src", assets[theme].logo);
    $login.attr("src", assets[theme].login);
    $bag.attr("src", assets[theme].bag);
    $heart.attr("src", assets[theme].heart);
  }

  function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function updateHeader() {
    const scrolled = $win.scrollTop() > 0;
    const sticky = isMobile() || scrolled;

    $headerWrap.toggleClass("sticky", sticky);
    setTheme(sticky ? "light" : "dark");
  }

  function updateTopBtn() {
    $topBtn.toggle($win.scrollTop() >= 200);
  }

  // 최초 1회
  updateHeader();
  updateTopBtn();

  // 스크롤
  $win.on("scroll", function () {
    updateHeader();
    updateTopBtn();
  });

  $win.on("resize", function () {
    updateHeader();
  });

  $topBtn.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });
});
