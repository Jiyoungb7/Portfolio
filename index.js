$(function () {
    const BP = 1024;
    const sliders = ["#slide1", "#slide2", "#slide3"];

    // ----- slick -----
    const slickOpt = {
        infinite: true,
        arrows: true,
        draggable: true,
        dots: true,
        adaptiveHeight: true,
    };

    function initSlick() {
        sliders.forEach((sel) => {
            const $el = $(sel);
            if ($el.hasClass("slick-initialized")) return;

            const opt =
                sel === "#slide3"
                    ? { ...slickOpt, adaptiveHeight: false }   // slide3 고정
                    : slickOpt;

            $el.slick(opt);

            $el.off(".a11yfix").on("beforeChange.a11yfix", () => {
                const active = document.activeElement;
                if (active && $el[0].contains(active)) active.blur();
            });
        });
    }

    function refreshSlick() {
        sliders.forEach((sel) => {
            const $el = $(sel);
            if ($el.hasClass("slick-initialized")) $el.slick("setPosition");
        });
    }

    initSlick();

    // ----- fullPage v2.9.7 -----
    function initFullpage() {
        if ($("html").hasClass("fp-enabled")) return;

        const careerMenu = document.querySelector('.menu li[data-menuanchor="section7"]');

        $("#fullpage").fullpage({
            anchors: ["section1", "section2", "section3", "section4", "section5", "section6", "section7", "section8"],
            menu: ".menu",
            navigation: true,
            scrollingSpeed: 1000,
            autoScrolling: true,
            fitToSection: true,

            // ✅ 추가: 모바일(<=1024)에서는 fullpage 자동 해제(자연 스크롤)
            responsiveWidth: 1024,
            responsiveHeight: 700,
            afterResponsive: function (isResponsive) {
                // 슬릭 레이아웃도 같이 재정렬
                setTimeout(refreshSlick, 80);
            },

            afterRender: function () {
                setTimeout(refreshSlick, 80);
            },

            // ✅ v2: afterLoad(anchorLink, index)
            afterLoad: function (anchorLink, index) {
                requestAnimationFrame(refreshSlick);

                if (!careerMenu) return;
                if (anchorLink === "section7") careerMenu.classList.add("is-open");
                else careerMenu.classList.remove("is-open");
            },

            // ✅ v2: onLeave(index, nextIndex, direction)
            onLeave: function (index, nextIndex, direction) {
                if (nextIndex === 3) $(".bar").addClass("active");
                else $(".bar").removeClass("active");
            },
        });
    }


    initFullpage();

    // resize 시 slick만 정리
    const debounce = (fn, wait = 200) => {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        };
    };

    $(window).on("resize", debounce(refreshSlick, 250));
    $(window).on("load", () => setTimeout(refreshSlick, 100));

    // ----- 햄버거 -----
    const headerEl = document.querySelector("header");
    const muiBtn = document.querySelector(".mui");
    const menuLinks = document.querySelectorAll("header .menu a");

    if (muiBtn) {
        muiBtn.addEventListener("click", () => {
            const open = headerEl.classList.toggle("nav-open");
            document.body.classList.toggle("nav-open", open);
            muiBtn.setAttribute("aria-expanded", open ? "true" : "false");
        });

        menuLinks.forEach((a) => {
            a.addEventListener("click", () => {
                headerEl.classList.remove("nav-open");
                document.body.classList.remove("nav-open");
                muiBtn.setAttribute("aria-expanded", "false");
            });
        });
    }
});
