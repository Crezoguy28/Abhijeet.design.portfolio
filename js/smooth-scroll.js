/* =========================================================
   SMOOTH SCROLL
   Single scroll controller
========================================================= */

window.addEventListener("load", () => {

    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined" ||
        typeof ScrollSmoother === "undefined"
    ) {
        console.warn(
            "GSAP ScrollSmoother is not available."
        );

        return;
    }


    gsap.registerPlugin(
        ScrollTrigger,
        ScrollSmoother
    );


    const smoother =
        ScrollSmoother.create({

            wrapper:
                "#smooth-wrapper",

            content:
                "#smooth-content",

            smooth:
                1.05,

            effects:
                false,

            normalizeScroll:
                false,

            smoothTouch:
                0

        });


    window.crezoguySmoother =
        smoother;


    /* -----------------------------------------------------
       REFRESH
    ----------------------------------------------------- */

    const refresh =
        () => {

            requestAnimationFrame(() => {

                ScrollTrigger.refresh();

            });

        };


    refresh();


    /* -----------------------------------------------------
       RESIZE
    ----------------------------------------------------- */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    refresh,
                    250
                );

        },
        {
            passive: true
        }
    );


    /* -----------------------------------------------------
       LOAD
    ----------------------------------------------------- */

    window.addEventListener(
        "load",
        refresh,
        {
            once: true
        }
    );

});