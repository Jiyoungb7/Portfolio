$(document).ready(function () {
    // 초기 실행, 이벤트 바인딩
    controlMouse();
    initAnimations();
    initMenu();
    initAllSwipers();
    handleDetailPage();
});

// 마우스 우클릭, 드래그 방지
function controlMouse() {
    $(document).on("contextmenu selectstart", function () {
        return false;
    });
}

// 로딩 화면, 타이틀
function initAnimations() {
    $(window).on('load', function () {
        setTimeout(function () {
            $('.load').fadeOut(300);
            $("section").fadeIn(500);
            $(".tit h3, .tit p").addClass("active");
            $(".rolling_wrap").css("opacity", "1");
        }, 500);
    });
}

// 상단 메뉴
function initMenu() {
    var BP = 1024;
    var $header = $("header");
    var $mui = $header.find(".mui");

    // 햄버거 열고 닫기
    $mui.on("click", function () {
        var open = !$header.hasClass("nav-open");
        $header.toggleClass("nav-open", open);
        $("body").toggleClass("nav-open", open);
        $mui.attr("aria-expanded", open ? "true" : "false");
    });

    // 모바일: 메뉴 클릭 시 닫기 (서브 토글 제외)
    $header.find(".menu a").on("click", function (e) {
        var $li = $(this).closest("li");

        // 서브가 있는 항목은 모바일에서 토글로
        if (window.innerWidth <= BP && $li.hasClass("has-sub")) return;

        if (window.innerWidth <= BP) {
            $header.removeClass("nav-open");
            $("body").removeClass("nav-open");
            $mui.attr("aria-expanded", "false");
        }
    });

    // 모바일: 서브메뉴 토글
    $header.find(".has-sub > a").on("click", function (e) {
        if (window.innerWidth > BP) return; // PC는 hover
        e.preventDefault();

        var $li = $(this).parent();
        var open = !$li.hasClass("open");
        $li.toggleClass("open", open);
        $(this).attr("aria-expanded", open ? "true" : "false");
    });

    // 리사이즈 시 정리
    $(window).on("resize", function () {
        if (window.innerWidth > BP) {
            $header.removeClass("nav-open");
            $("body").removeClass("nav-open");
            $header.find(".has-sub").removeClass("open");
            $header.find(".has-sub > a").attr("aria-expanded", "false");
            $mui.attr("aria-expanded", "false");
        }
    });
}

// Swiper 슬라이더 통합 초기화
function initAllSwipers() {
    // 상세페이지 내의 슬라이드들 자동 루프 초기화
    $(".detailPage_slide_wrap").each(function (index, element) {
        // 현재 슬라이더의 형제 요소인 next/prev 버튼을 찾음
        const nextBtn = $(element).siblings(".swiper-button-next")[0];
        const prevBtn = $(element).siblings(".swiper-button-prev")[0];

        new Swiper(element, {
            slidesPerView: 1,
            spaceBetween: 0,
            observer: true,
            observeParents: true,
            loop: true,
            navigation: {
                nextEl: nextBtn,
                prevEl: prevBtn,
            },
        });
    });

    // 메인 페이지 등에 .slide_wrap이 있을 경우 초기화
    if ($(".slide_wrap").length > 0) {
        new Swiper(".slide_wrap", {
            loop: true,
            centeredSlides: true,
            autoplay: { delay: 1800, disableOnInteraction: false },
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 24 },
                768: { slidesPerView: 2, spaceBetween: 40 },
                1024: { slidesPerView: 3, spaceBetween: 80 }
            }
        });
    }
}

// 상세페이지 팝업 열기/닫기 로직
function handleDetailPage() {
    // 썸네일 클릭 시 열기
    $(".thumbnail").click(function () {
        const targetDetail = $(this).siblings(".detailPage");

        targetDetail.addClass("active");
        $("body").css("overflow", "hidden"); // 스크롤 방지

        // 팝업 열 때 스크롤 위치 초기화
        targetDetail.find(".detailPage_slide_wrap, .swiper-slide").scrollTop(0);
    });

    // 배경 클릭 시 닫기
    $(".detailPage").click(function () {
        $(this).removeClass("active");
        $("body").css("overflow-y", "scroll");
    });

    // 팝업 내부 이미지나 버튼 클릭 시 닫히지 않도록 방지
    $(".detailPage img, .swiper-button-next, .swiper-button-prev").click(function (e) {
        e.stopPropagation();
    });

    // 슬라이드 이미지 클릭 시 상단으로 이동 (기존 기능 유지)
    $(".detailPage_slide_wrap img").click(function () {
        $(this).closest(".detailPage").animate({ scrollTop: 0 }, 300);
    });
}