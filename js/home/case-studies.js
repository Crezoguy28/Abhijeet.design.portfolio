/* =========================================================
   CASE STUDIES

   DESKTOP > 1024px
   → cinematic GSAP card stack

   TABLET/MOBILE <= 1024px
   → no pinning
   → no GSAP card animation
   → lightweight viewport reveal
========================================================= */

window.addEventListener("load", () => {

    const section =
        document.querySelector(".case-studies");

    const cards =
        document.querySelectorAll(".case-card");


    if (
        !section ||
        !cards.length
    ) {
        return;
    }


    const DESKTOP_BREAKPOINT =
        1025;


    let desktopTimeline = null;

    let mobileObserver = null;


    /* =====================================================
       MODE
    ===================================================== */

    function isDesktop() {

        return (
            window.innerWidth >=
            DESKTOP_BREAKPOINT
        );
    }


    /* =====================================================
       CLEAN GSAP
    ===================================================== */

    function destroyDesktop() {

        if (desktopTimeline) {

            desktopTimeline.scrollTrigger?.kill();

            desktopTimeline.kill();

            desktopTimeline = null;
        }


        if (
            typeof gsap !== "undefined"
        ) {

            gsap.killTweensOf(cards);


            gsap.set(
                cards,
                {
                    clearProps:
                        "transform,opacity"
                }
            );
        }
    }


    /* =====================================================
       CLEAN MOBILE OBSERVER
    ===================================================== */

    function destroyMobile() {

        if (mobileObserver) {

            mobileObserver.disconnect();

            mobileObserver = null;
        }
    }


    /* =====================================================
       MOBILE / TABLET
    ===================================================== */

    function setupMobile() {

        destroyDesktop();

        destroyMobile();


        /* ---------------------------------------------
           Reset cards
        --------------------------------------------- */

        cards.forEach(
            card => {

                card.classList.remove(
                    "is-visible"
                );

            }
        );


        /* ---------------------------------------------
           Viewport reveal
        --------------------------------------------- */

        mobileObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            mobileObserver.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.10,

                    rootMargin:
                        "0px 0px -8% 0px"
                }
            );


        cards.forEach(
            card => {

                mobileObserver.observe(
                    card
                );

            }
        );
    }


    /* =====================================================
       DESKTOP
    ===================================================== */

    function setupDesktop() {

        destroyMobile();

        destroyDesktop();


        if (
            typeof gsap === "undefined" ||
            typeof ScrollTrigger === "undefined"
        ) {
            return;
        }


        gsap.registerPlugin(
            ScrollTrigger
        );


        /* ---------------------------------------------
           Initial state
        --------------------------------------------- */

        gsap.set(
            cards,
            {
                y: 0,

                scale: 1,

                opacity: 1,

                x: 0
            }
        );


        /* ---------------------------------------------
           Timeline
        --------------------------------------------- */

        desktopTimeline =
            gsap.timeline({

                scrollTrigger: {

                    trigger:
                        section,

                    start:
                        "top top",

                    end:
                        () =>
                            `+=${(
                                (cards.length - 1) *
                                850
                            ) + 400}`,

                    pin: true,

                    pinSpacing: true,

                    scrub: 1.1,

                    anticipatePin: 1,

                    invalidateOnRefresh: true

                }

            });


        /* ---------------------------------------------
           Cards
        --------------------------------------------- */

        cards.forEach(
            (
                card,
                index
            ) => {

                if (
                    index === 0
                ) {
                    return;
                }


                const previousCard =
                    cards[
                        index - 1
                    ];


                /* -------------------------------------
                   Next card enters
                ------------------------------------- */

                desktopTimeline.fromTo(

                    card,

                    {

                        y:
                            () =>
                                window.innerHeight *
                                0.75,

                        x: 0,

                        scale: 1,

                        opacity: 1

                    },

                    {

                        y: 0,

                        x: 0,

                        scale: 1,

                        opacity: 1,

                        duration: 1,

                        ease: "none"

                    }
                );


                /* -------------------------------------
                   Previous card settles
                ------------------------------------- */

                desktopTimeline.to(

                    previousCard,

                    {

                        y: -12,

                        x: 0,

                        scale: 0.95,

                        opacity: 1,

                        duration: 1,

                        ease: "none"

                    },

                    "<"
                );


                /* -------------------------------------
                   Small pause
                ------------------------------------- */

                desktopTimeline.to(

                    {},

                    {

                        duration: 0.35

                    }
                );

            }
        );


        ScrollTrigger.refresh();
    }


    /* =====================================================
       BUILD
    ===================================================== */

    function build() {

        if (
            isDesktop()
        ) {

            setupDesktop();

        } else {

            setupMobile();

        }
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    build();


    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer = null;

    let previousMode =
        isDesktop();


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        const currentMode =
                            isDesktop();


                        /*
                         * Crossing 1024px:
                         * completely switch animation system.
                         */

                        if (
                            currentMode !==
                            previousMode
                        ) {

                            previousMode =
                                currentMode;

                            build();

                            return;
                        }


                        /*
                         * Desktop:
                         * recalculate GSAP geometry.
                         */

                        if (
                            currentMode &&
                            desktopTimeline
                        ) {

                            ScrollTrigger.refresh();
                        }

                    },
                    250
                );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    function handleReducedMotion() {

        if (
            reducedMotion.matches
        ) {

            destroyDesktop();

            destroyMobile();


            cards.forEach(
                card => {

                    card.classList.add(
                        "is-visible"
                    );

                }
            );

            return;
        }


        build();
    }

    
    reducedMotion.addEventListener?.(
        "change",
        handleReducedMotion
    );


    handleReducedMotion();

});