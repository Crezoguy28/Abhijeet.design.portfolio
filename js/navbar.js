/* =========================================================
   NAVBAR
   Responsive mobile / tablet navigation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if (!hamburger || !navLinks) {
        return;
    }


    /* =====================================================
       CONFIG
    ===================================================== */

    const MOBILE_NAV_MAX_WIDTH = 1100;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const navigationLinks =
        navLinks.querySelectorAll(".nav-link");


    /* =====================================================
       STATE
    ===================================================== */

    let menuOpen = false;


    /* =====================================================
       OPEN MENU
    ===================================================== */

    function openMenu() {

        if (menuOpen) {
            return;
        }

        menuOpen = true;

        navLinks.classList.add("active");

        hamburger.setAttribute(
            "aria-expanded",
            "true"
        );

        hamburger.setAttribute(
            "aria-label",
            "Close menu"
        );

        document.body.classList.add("menu-open");
    }


    /* =====================================================
       CLOSE MENU
    ===================================================== */

    function closeMenu() {

        menuOpen = false;

        navLinks.classList.remove("active");

        hamburger.setAttribute(
            "aria-expanded",
            "false"
        );

        hamburger.setAttribute(
            "aria-label",
            "Open menu"
        );

        document.body.classList.remove("menu-open");
    }


    /* =====================================================
       TOGGLE
    ===================================================== */

    function toggleMenu() {

        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }


    /* =====================================================
       HAMBURGER CLICK
    ===================================================== */

    hamburger.addEventListener(
        "click",
        toggleMenu
    );


    /* =====================================================
       NAVIGATION LINK CLICK
    ===================================================== */

    navigationLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                closeMenu();

            }
        );

    });


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            if (!menuOpen) {
                return;
            }

            closeMenu();

            hamburger.focus();

        }
    );


    /* =====================================================
       RESIZE
       If viewport returns to desktop, close mobile menu.
    ===================================================== */

    let resizeTimer = null;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {

                if (
                    window.innerWidth >
                    MOBILE_NAV_MAX_WIDTH
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