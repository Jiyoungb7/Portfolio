$(function () {
  // ✅ DOM(HTML) 로딩이 끝난 뒤 실행되는 "문서 준비 완료" 이벤트
  // jQuery의 $(document).ready(...) 축약형

  // -----------------------------
  // 1) BEST 슬라이더(slick) 초기화
  // -----------------------------
  if ($.fn.slick) {
    // ✅ slick 플러그인이 로드되어 있는지 확인
    // (CDN이 실패했거나 slick이 없으면 에러 방지)

    $(".bestwrap").slick({
      // ✅ .bestwrap 안의 자식 div들을 슬라이드로 만들어줌

      slidesToShow: 3,
      // ✅ 한 화면에 3개 슬라이드 보여주기

      slidesToScroll: 1,
      // ✅ 한 번 넘길 때 1개씩 이동

      autoplay: true,
      // ✅ 자동 재생

      autoplaySpeed: 2000,
      // ✅ 자동 재생 속도(2초마다 이동)

      responsive: [
        // ✅ 화면 너비에 따라 보여주는 슬라이드 개수 조절

        { breakpoint: 1250, settings: { slidesToShow: 2 } },
        // ✅ 화면이 1250px 이하이면 2개씩 보여줌

        { breakpoint: 768, settings: { slidesToShow: 1 } },
        // ✅ 화면이 768px 이하이면 1개씩 보여줌(모바일)
      ],
    });
  }

  // -----------------------------
  // 2) 자주 쓰는 DOM 요소를 변수에 캐싱
  // -----------------------------
  const $win = $(window);
  // ✅ 윈도우(스크롤/리사이즈 이벤트 대상)

  const $headerWrap = $(".headerwrap");
  // ✅ 헤더 전체 래퍼(스크롤 시 sticky 클래스 토글)

  const $topBtn = $("#topBtn");
  // ✅ 우측 하단 Top 버튼

  const $logo = $("header h1 img");
  // ✅ 헤더 로고 이미지

  const $login = $(".login img");
  // ✅ 로그인 아이콘 이미지

  const $bag = $(".bag img");
  // ✅ 장바구니 아이콘 이미지

  const $heart = $(".heart img");
  // ✅ 찜(하트) 아이콘 이미지


  // -----------------------------
  // 3) 테마(다크/라이트)에 따라 바뀔 이미지 경로 모음
  // -----------------------------
  const assets = {
    dark: {
      // ✅ (메인 비디오 위) 투명 헤더일 때 = 흰색 로고/아이콘
      logo: "./이미지/톤28로고_화이트.png",
      login: "./이미지/픽토그램/login.png",
      bag: "./이미지/픽토그램/bag.png",
      heart: "./이미지/픽토그램/heart.png",
    },
    light: {
      // ✅ (스크롤했거나 모바일) sticky 상태일 때 = 컬러 로고/아이콘
      logo: "./이미지/톤28로고_컬러.png",
      login: "./이미지/픽토그램/login2.png",
      bag: "./이미지/픽토그램/bag2.png",
      heart: "./이미지/픽토그램/heart2.png",
    },
  };

  let currentTheme = null;
  // ✅ 현재 적용된 테마 기록
  // 같은 테마를 반복 적용하지 않도록(불필요한 DOM 변경 방지)

  function setTheme(theme) {
    // ✅ theme: "dark" 또는 "light"

    if (currentTheme === theme) return;
    // ✅ 이미 같은 테마면 아무 것도 안 함(최적화)

    currentTheme = theme;
    // ✅ 현재 테마 업데이트

    // ✅ 이미지 src 교체로 테마 전환 효과
    $logo.attr("src", assets[theme].logo);
    $login.attr("src", assets[theme].login);
    $bag.attr("src", assets[theme].bag);
    $heart.attr("src", assets[theme].heart);
  }

  function isMobile() {
    // ✅ 현재 화면이 모바일(768px 이하)인지 검사
    // CSS의 @media (max-width: 768px) 기준과 맞춤
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function updateHeader() {
    // ✅ 헤더 상태(스티키/테마)를 현재 스크롤/화면폭에 따라 업데이트

    const scrolled = $win.scrollTop() > 0;
    // ✅ 스크롤이 0보다 크면(맨 위가 아니면) true

    const sticky = isMobile() || scrolled;
    // ✅ 모바일이면 무조건 sticky
    // ✅ 또는 데스크탑이라도 스크롤하면 sticky

    $headerWrap.toggleClass("sticky", sticky);
    // ✅ sticky가 true면 .sticky 클래스 추가, false면 제거
    // (CSS에서 .headerwrap.sticky가 배경/글자색 바꿔줌)

    setTheme(sticky ? "light" : "dark");
    // ✅ sticky 상태면 라이트(컬러 로고/아이콘)
    // ✅ 맨 위(투명 헤더)면 다크(화이트 로고/아이콘)
  }

  function updateTopBtn() {
    // ✅ Top 버튼 노출/숨김
    $topBtn.toggle($win.scrollTop() >= 200);
    // ✅ 스크롤이 200px 이상이면 보이고, 아니면 숨김
  }

  // -----------------------------
  // 4) 페이지 진입 직후 최초 1회 상태 세팅
  // -----------------------------
  updateHeader();
  // ✅ 처음 로딩했을 때(스크롤 위치/모바일 여부에 따라) 헤더 상태 반영

  updateTopBtn();
  // ✅ 처음 로딩했을 때 Top 버튼도 조건에 맞게 반영

  // -----------------------------
  // 5) 스크롤할 때마다 헤더/Top 버튼 갱신
  // -----------------------------
  $win.on("scroll", function () {
    updateHeader(); // ✅ 헤더 sticky 및 로고/아이콘 테마 변경
    updateTopBtn(); // ✅ Top 버튼 표시/숨김
  });

  // -----------------------------
  // 6) 창 크기 바뀔 때(반응형) 헤더만 재판단
  // -----------------------------
  $win.on("resize", function () {
    updateHeader();
    // ✅ 모바일/데스크탑 전환되는 순간 테마/스티키 상태 즉시 갱신
  });

  // -----------------------------
  // 7) Top 버튼 클릭 시 부드럽게 맨 위로 이동
  // -----------------------------
  $topBtn.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    // ✅ 0.5초 동안 부드럽게 상단으로 스크롤
    // (브라우저별 스크롤 대상이 html/body 다를 수 있어 둘 다 지정)
  });
});
