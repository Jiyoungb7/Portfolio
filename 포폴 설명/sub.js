$(document).ready(function () {
    // DOM이 준비되면(HTML이 모두 로드되어 요소 선택 가능할 때) 실행

    controlMouse();        // 우클릭/드래그(선택) 방지 이벤트 등록
    initAnimations();      // 로딩 후 타이틀 등장 애니메이션 처리
    initSubBar();          // ✅ (subpage 모바일용) header 아래 subbar 복제 생성
    initMenu();            // 햄버거 메뉴 열고 닫기 + 모바일 서브 토글
    initAllSwipers();      // 페이지에 있는 모든 Swiper 슬라이더 초기화
    handleDetailPage();    // 썸네일 클릭 -> 상세 팝업 열기/닫기 이벤트
});

// =========================
// 마우스 우클릭, 드래그 방지
// =========================
function controlMouse() {
    // contextmenu: 우클릭 메뉴
    // selectstart: 텍스트 선택 시작
    // 둘 다 false 반환하면 기본 동작 막힘
    $(document).on("contextmenu selectstart", function () {
        return false;
    });
}

// =========================
// 로딩 화면/타이틀 애니메이션
// =========================
function initAnimations() {
    // window load: 이미지 등 리소스까지 로드 완료 후 실행
    $(window).on('load', function () {
        setTimeout(function () {
            // .load 요소가 있다면 페이드아웃(로딩 오버레이)
            $('.load').fadeOut(300);

            // section을 페이드인(처음엔 숨겨져 있는 구조를 가정)
            $("section").fadeIn(500);

            // 타이틀 텍스트에 active를 붙여 CSS 트랜지션 시작
            $(".tit h3, .tit p").addClass("active");

            // (다른 페이지에서 쓰는 요소) rolling_wrap 보이기
            $(".rolling_wrap").css("opacity", "1");
        }, 500); // 0.5초 후 실행(연출 타이밍)
    });
}

/* =========================
   ✅ header 높이를 CSS 변수(--headerH)로 동기화
   - subbar를 header 바로 아래에 정확히 붙이기 위함
========================= */
function syncHeaderHeight() {
    // header 실제 높이(패딩 포함)를 가져옴
    var h = $("header").outerHeight() || 0;

    // CSS 변수로 저장: :root { --headerH: ... }
    document.documentElement.style.setProperty("--headerH", h + "px");
}

/* =========================
   ✅ subpage면 모바일에서 서브를 “일반 화면”에 고정 노출시키는 subbar 생성
   - 원래 PC는 hover로 sub 바가 나오지만,
   - 모바일은 hover가 없으니 아예 header 밑에 서브메뉴를 고정으로 복제해 붙이는 방식
========================= */
function initSubBar() {
    // 최초 1회 header 높이 동기화
    syncHeaderHeight();

    // 화면 리사이즈될 때마다 header 높이 다시 계산(모바일 주소창 등 영향)
    $(window).on("resize", syncHeaderHeight);

    // body에 subpage 클래스가 없으면(서브 페이지가 아니면) subbar 만들지 않음
    if (!$("body").hasClass("subpage")) return;

    // 이미 subbar가 있다면 중복 생성 방지
    if ($(".subbar").length) return;

    // 원본 서브메뉴(ul.sub)를 찾음: Career(has-sub) 아래의 .sub
    var $originSub = $(".has-sub > .sub").first();
    if (!$originSub.length) return; // 없으면 종료(에러 방지)

    // 서브 ul을 복제(clone)해서 subbar로 사용
    var $cloneSub = $originSub.clone();

    // subbar(네비게이션) 컨테이너 생성
    var $subbar = $('<nav class="subbar" aria-label="Career sub navigation"></nav>');

    // subbar에 복제한 ul.sub를 넣기
    $subbar.append($cloneSub);

    // header 바로 뒤에 subbar 삽입
    $("header").after($subbar);
}

// =========================
// 상단 메뉴(햄버거 + 모바일 서브토글)
// =========================
function initMenu() {
    var BP = 1024;              // 모바일/태블릿 분기점
    var $header = $("header");  // header 요소
    var $mui = $header.find(".mui"); // 햄버거 버튼

    // -------------------------
    // 햄버거 열고 닫기
    // -------------------------
    $mui.on("click", function () {
        // 현재 nav-open이 없으면 열기(true), 있으면 닫기(false)
        var open = !$header.hasClass("nav-open");

        // header에 nav-open 토글(메뉴 패널 slide-in/out)
        $header.toggleClass("nav-open", open);

        // body에 nav-open 토글(스크롤 잠금)
        $("body").toggleClass("nav-open", open);

        // 접근성: 버튼이 확장되었는지 aria-expanded 업데이트
        $mui.attr("aria-expanded", open ? "true" : "false");
    });

    // -------------------------
    // 모바일: 메뉴 링크 클릭 시 메뉴 닫기(단, 서브 토글은 제외)
    // -------------------------
    $header.find(".menu a").on("click", function () {
        var $li = $(this).closest("li"); // 클릭된 링크가 속한 li

        // 모바일에서 has-sub(서브가 있는 항목)는 클릭 시 닫히면 안 되고, 토글이 되어야 하므로 return
        if (window.innerWidth <= BP && $li.hasClass("has-sub")) return;

        // 모바일 폭이면 메뉴를 닫는다
        if (window.innerWidth <= BP) {
            $header.removeClass("nav-open");
            $("body").removeClass("nav-open");
            $mui.attr("aria-expanded", "false");
        }
    });

    // -------------------------
    // 모바일: Career(has-sub) 클릭 시 서브메뉴 토글(open)
    // -------------------------
    $header.find(".has-sub > a").on("click", function (e) {
        // PC 폭에서는 hover로 동작하므로 클릭 토글은 하지 않음
        if (window.innerWidth > BP) return;

        // a 기본 이동(링크 점프) 방지
        e.preventDefault();

        var $li = $(this).parent();        // has-sub li
        var open = !$li.hasClass("open");  // 현재 open 상태 반전

        // open 클래스 토글 -> CSS에서 .has-sub.open .sub를 display:flex로 보여줌
        $li.toggleClass("open", open);

        // 접근성: 서브메뉴 펼쳐짐 상태 업데이트
        $(this).attr("aria-expanded", open ? "true" : "false");
    });

    // -------------------------
    // 리사이즈 시 상태 정리
    // -------------------------
    $(window).on("resize", function () {
        // PC 폭으로 올라가면 모바일 열림 상태를 초기화
        if (window.innerWidth > BP) {
            $header.removeClass("nav-open");
            $("body").removeClass("nav-open");
            $header.find(".has-sub").removeClass("open");
            $header.find(".has-sub > a").attr("aria-expanded", "false");
            $mui.attr("aria-expanded", "false");
        }
    });
}

// =========================
// Swiper 슬라이더 통합 초기화
// =========================
function initAllSwipers() {
    // ---------------------------------------
    // 상세 팝업(.detailPage) 안의 슬라이드 초기화
    // ---------------------------------------
    $(".detailPage_slide_wrap").each(function (index, element) {
        // element: 각 Swiper 컨테이너(.detailPage_slide_wrap)

        // 같은 부모(.detailPage) 안에 있는 버튼을 찾음(형제 요소)
        // HTML 구조: slide_wrap 다음에 button-next / button-prev가 siblings로 존재
        const nextBtn = $(element).siblings(".swiper-button-next")[0];
        const prevBtn = $(element).siblings(".swiper-button-prev")[0];

        // Swiper 인스턴스 생성
        new Swiper(element, {
            slidesPerView: 1,      // 한 번에 1장
            spaceBetween: 0,       // 슬라이드 간격 없음
            observer: true,        // DOM 변경 감지(숨김/표시 등)
            observeParents: true,  // 부모 변화도 감지
            loop: true,            // 무한 루프
            navigation: {
                nextEl: nextBtn,   // 다음 버튼
                prevEl: prevBtn,   // 이전 버튼
            },
        });
    });

    // ---------------------------------------
    // 메인 페이지 등에 .slide_wrap이 있을 경우 초기화(다른 페이지 호환용)
    // ---------------------------------------
    if ($(".slide_wrap").length > 0) {
        new Swiper(".slide_wrap", {
            loop: true,           // 무한 루프
            centeredSlides: true, // 가운데 정렬
            autoplay: { delay: 1800, disableOnInteraction: false }, // 자동재생
            breakpoints: {
                // 화면 폭에 따라 보이는 개수/간격 변경
                320: { slidesPerView: 1, spaceBetween: 24 },
                768: { slidesPerView: 2, spaceBetween: 40 },
                1024: { slidesPerView: 3, spaceBetween: 80 }
            }
        });
    }
}

// =========================
// 상세페이지 팝업 열기/닫기 로직
// =========================
function handleDetailPage() {
    // -------------------------
    // 썸네일 클릭 시 팝업 열기
    // -------------------------
    $(".thumbnail").click(function () {
        // 같은 카드 안의 .detailPage를 찾음(썸네일과 형제 관계)
        const targetDetail = $(this).siblings(".detailPage");

        // 팝업 활성화
        targetDetail.addClass("active");

        // body 스크롤 방지(팝업 열린 동안 배경 스크롤 금지)
        $("body").css("overflow", "hidden");

        // 팝업 열 때 스크롤 위치 초기화
        // (detailPage 자체에 스크롤이 생기는 구조 또는 내부 래퍼 스크롤 대비)
        targetDetail.find(".detailPage_slide_wrap, .swiper-slide").scrollTop(0);
    });

    // -------------------------
    // 팝업 배경 클릭 시 닫기
    // -------------------------
    $(".detailPage").click(function () {
        // active 제거 -> CSS로 다시 숨김
        $(this).removeClass("active");

        // 배경 페이지 스크롤 복구
        $("body").css("overflow-y", "scroll");
    });

    // -------------------------
    // 팝업 내부 클릭(이미지/버튼) 시 닫히지 않게 이벤트 전파 막기
    // -------------------------
    $(".detailPage img, .swiper-button-next, .swiper-button-prev").click(function (e) {
        e.stopPropagation(); // 부모(.detailPage) 클릭 이벤트로 올라가는 것을 차단
    });

    // -------------------------
    // 슬라이드 이미지 클릭 시 상단으로 이동(기존 기능 유지)
    // -------------------------
    $(".detailPage_slide_wrap img").click(function () {
        // 가장 가까운 .detailPage를 찾아 그 스크롤을 위로 애니메이션
        $(this).closest(".detailPage").animate({ scrollTop: 0 }, 300);
    });
}
