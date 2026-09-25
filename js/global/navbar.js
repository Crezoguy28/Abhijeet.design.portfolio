/* =========================================================
   NAVBAR
   GSAP ScrollSmoother / ScrollTrigger compatible
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const header = document.querySelector(".site-header");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if (!header) return;


    /* =====================================================
       HEADER HIDE / SHOW
    ===================================================== */

    let lastScroll = 0;
    let ticking = false;

    const threshold = 5;


    function updateHeader() {

        /*
            ScrollTrigger gives us the actual scroll
            position even when ScrollSmoother is active.
        */

        const currentScroll =
            Math.max(
                0,
                window.scrollY ||
                window.pageYOffset ||
                0
            );


        /* Always visible at very top */

        if (currentScroll <= 20) {

            header.classList.remove(
                "header-hidden"
            );

            lastScroll = currentScroll;

            ticking = false;

            return;
        }


        const difference =
            currentScroll - lastScroll;


        /* Ignore very small movement */

        if (Math.abs(difference) < threshold) {

            ticking = false;

            return;
        }


        /* -----------------------------------------------
           SCROLL DOWN
        ------------------------------------------------ */

        if (difference > 0) {

            header.classList.add(
                "header-hidden"
            );

        }


        /* -----------------------------------------------
           SCROLL UP
        ------------------------------------------------ */

        else {

            header.classList.remove(
                "header-hidden"
            );

        }


        lastScroll = currentScroll;

        ticking = false;
    }


    function requestHeaderUpdate() {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(
            updateHeader
        );
    }


    /*
        Native scroll listener.

        This also works as fallback if GSAP is
        temporarily unavailable.
    */

    window.addEventListener(
        "scroll",
        requestHeaderUpdate,
        {
            passive: true
        }
    );


    /*
        ScrollTrigger update.

        This is important when ScrollSmoother
        controls the scrolling.
    */

    function connectScrollTrigger() {

        if (
            typeof ScrollTrigger ===
            "undefined"
        ) {

            return false;
        }


        ScrollTrigger.addEventListener(
            "update",
            requestHeaderUpdate
        );


        return true;
    }


    /*
        Connect immediately if available.
    */

    connectScrollTrigger();


    /*
        Also connect after the page has loaded.
    */

    window.addEventListener(
        "load",
        () => {

            connectScrollTrigger();

            requestHeaderUpdate();

        }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (!hamburger || !navLinks) {
        return;
    }


    const MOBILE_MAX = 1100;

    const links =
        navLinks.querySelectorAll(
            ".nav-link"
        );

    let menuOpen = false;


    /* =====================================================
       OPEN MENU
    ===================================================== */

    function openMenu() {

        if (menuOpen) return;

        menuOpen = true;


        navLinks.classList.add(
            "active"
        );


        hamburger.setAttribute(
            "aria-expanded",
            "true"
        );


        hamburger.setAttribute(
            "aria-label",
            "Close menu"
        );


        document.body.classList.add(
            "menu-open"
        );


        /*
            Never hide header while menu
            is open.
        */

        header.classList.remove(
            "header-hidden"
        );
    }


    /* =====================================================
       CLOSE MENU
    ===================================================== */

    function closeMenu() {

        menuOpen = false;


        navLinks.classList.remove(
            "active"
        );


        hamburger.setAttribute(
            "aria-expanded",
            "false"
        );


        hamburger.setAttribute(
            "aria-label",
            "Open menu"
        );


        document.body.classList.remove(
            "menu-open"
        );
    }


    /* =====================================================
       HAMBURGER
    ===================================================== */

    hamburger.addEventListener(
        "click",
        () => {

            if (menuOpen) {

                closeMenu();

            } else {

                openMenu();

            }

        }
    );


    /* =====================================================
       NAV LINKS
    ===================================================== */

    links.forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                menuOpen
            ) {

                closeMenu();

                hamburger.focus();

            }

        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(() => {

                    if (
                        window.innerWidth >
                        MOBILE_MAX
                    ) {

                        closeMenu();

                    }

                }, 100);

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    closeMenu();

});