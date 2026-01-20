/* 문서 로드 후 실행(jQuery DOM Ready) */
$(function () {
    const BP = 1024; // breakpoint(현재는 직접 쓰진 않지만 반응형 기준으로 둔 값)
    const sliders = ["#slide1", "#slide2", "#slide3"]; // slick 적용할 섹션들

    // =========================
    // slick 초기 옵션
    // =========================
    const slickOpt = {
        infinite: true, // 무한 루프
        arrows: true, // 좌/우 화살표
        draggable: true, // 드래그로 넘기기
        dots: true, // 하단 점(dot) 네비게이션
        adaptiveHeight: true, // 슬라이드 높이를 콘텐츠에 맞게 자동 조절
    };

    // slick 초기화 함수
    function initSlick() {
        sliders.forEach((sel) => {
            const $el = $(sel);

            // 이미 slick이 적용된 경우 중복 초기화 방지
            if ($el.hasClass("slick-initialized")) return;

            // slide3는 adaptiveHeight를 false로(높이 변화로 인한 레이아웃 흔들림 방지)
            const opt = sel === "#slide3" ? { ...slickOpt, adaptiveHeight: false } : slickOpt;

            // slick 적용
            $el.slick(opt);

            // 접근성/포커스 튐 방지:
            // 슬라이드 변경 직전에 포커스가 슬라이더 내부에 있으면 blur 처리
            $el.off(".a11yfix").on("beforeChange.a11yfix", () => {
                const active = document.activeElement;
                if (active && $el[0].contains(active)) active.blur();
            });
        });
    }

    // slick 레이아웃 재계산(특히 resize/afterRender 시 필요)
    function refreshSlick() {
        sliders.forEach((sel) => {
            const $el = $(sel);
            if ($el.hasClass("slick-initialized")) $el.slick("setPosition");
        });
    }

    // 최초 slick 초기화
    initSlick();

    // =========================
    // fullPage.js 초기화
    // (v2.9.7 기준 콜백 시그니처 사용)
    // =========================
    function initFullpage() {
        // 이미 fullPage가 켜져 있으면 중복 초기화 방지
        if ($("html").hasClass("fp-enabled")) return;

        // Career 메뉴 li(서브바 열림 상태 클래스 제어용)
        const careerMenu = document.querySelector('.menu li[data-menuanchor="section7"]');

        $("#fullpage").fullpage({
            // 각 섹션의 anchor 이름
            anchors: [
                "section1",
                "section2",
                "section3",
                "section4",
                "section5",
                "section6",
                "section7",
                "section8",
            ],

            // 메뉴와 fullPage를 연결(메뉴 클릭 시 해당 섹션으로 이동 + active 처리)
            menu: ".menu",

            // 우측 네비게이션 점 표시
            navigation: true,

            // 섹션 전환 속도
            scrollingSpeed: 1000,

            // fullPage의 핵심 옵션: 자동 스냅 스크롤
            autoScrolling: true,
            fitToSection: true,

            // ✅ 반응형: 화면이 작아지면 fullPage를 자동으로 “해제”하고 자연 스크롤로 전환
            responsiveWidth: 1024,
            responsiveHeight: 700,

            // 반응형 모드로 바뀌는 순간 호출
            afterResponsive: function (isResponsive) {
                // slick도 레이아웃이 깨질 수 있어, 살짝 딜레이 후 재정렬
                setTimeout(refreshSlick, 80);
            },

            // fullPage가 렌더 완료됐을 때
            afterRender: function () {
                setTimeout(refreshSlick, 80);
            },

            // ✅ v2: afterLoad(anchorLink, index)
            // 섹션 진입 완료 시 호출
            afterLoad: function (anchorLink, index) {
                // 다음 프레임에 slick 위치 재정렬(레이아웃 안정)
                requestAnimationFrame(refreshSlick);

                // Career 섹션에 들어가면 서브바가 열리도록 is-open 클래스 부여
                if (!careerMenu) return;
                if (anchorLink === "section7") careerMenu.classList.add("is-open");
                else careerMenu.classList.remove("is-open");
            },

            // ✅ v2: onLeave(index, nextIndex, direction)
            // 섹션에서 나갈 때(다음 섹션으로 이동 직전)
            onLeave: function (index, nextIndex, direction) {
                // nextIndex가 3이면 section3(Skills)로 들어가는 중
                // → 진행바 애니메이션 시작(active 클래스 부여)
                if (nextIndex === 3) $(".bar").addClass("active");
                else $(".bar").removeClass("active");
            },
        });
    }

    // fullPage 최초 실행
    initFullpage();

    // =========================
    // resize 최적화(디바운스)
    // =========================

    // 디바운스 유틸: resize 이벤트가 연속으로 올 때 마지막 한 번만 실행
    const debounce = (fn, wait = 200) => {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        };
    };

    // 창 크기 변경 시 slick 위치 재정렬
    $(window).on("resize", debounce(refreshSlick, 250));

    // 로드 완료 후에도 한 번 더(이미지 로딩 등으로 사이즈 달라질 수 있음)
    $(window).on("load", () => setTimeout(refreshSlick, 100));

    // =========================
    // 모바일 햄버거 메뉴 토글
    // =========================
    const headerEl = document.querySelector("header");
    const muiBtn = document.querySelector(".mui");
    const menuLinks = document.querySelectorAll("header .menu a");

    if (muiBtn) {
        // 햄버거 클릭 시:
        // header.nav-open / body.nav-open 토글
        // aria-expanded도 상태에 맞게 변경(접근성)
        muiBtn.addEventListener("click", () => {
            const open = headerEl.classList.toggle("nav-open");
            document.body.classList.toggle("nav-open", open);
            muiBtn.setAttribute("aria-expanded", open ? "true" : "false");
        });

        // 메뉴 링크 클릭 시 메뉴 자동 닫기
        menuLinks.forEach((a) => {
            a.addEventListener("click", () => {
                headerEl.classList.remove("nav-open");
                document.body.classList.remove("nav-open");
                muiBtn.setAttribute("aria-expanded", "false");
            });
        });
    }
});
