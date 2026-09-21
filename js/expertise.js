/* =========================================================
   AREA OF EXPERTISE

   DESKTOP  > 1024px
   → GSAP cinematic animation

   TABLET/MOBILE <= 1024px
   → NO GSAP PINNING
   → lightweight viewport pop reveal

   This prevents the desktop animation from running on
   smaller screens.
========================================================= */

window.addEventListener("load", () => {

    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) {
        return;
    }


    gsap.registerPlugin(ScrollTrigger);


    const section =
        document.querySelector("#expertise");

    const devices =
        document.querySelectorAll(
            ".expertise-device"
        );


    if (
        !section ||
        devices.length < 3
    ) {
        return;
    }


    const left =
        devices[0];

    const phone =
        devices[1];

    const right =
        devices[2];


    /* =====================================================
       BREAKPOINT
    ===================================================== */

    const DESKTOP_MIN_WIDTH =
        1025;


    /* =====================================================
       CHECK DESKTOP
    ===================================================== */

    function isDesktop() {

        return (
            window.innerWidth >=
            DESKTOP_MIN_WIDTH
        );
    }


    /* =====================================================
       DESKTOP VALUES
    ===================================================== */

    function getDesktopValues() {

        const vw =
            window.innerWidth;


        return {

            phoneStartY: "108vh",

            phoneEndY: 0,

            phoneStartScale: 1.08,

            phoneEndScale: 0.90,


            sideStartY: "108vh",

            leftX:
                -vw * 0.25,

            rightX:
                vw * 0.25,


            sideStartScale:
                0.16,

            sideEndScale:
                0.90,


            entranceDuration:
                2.6,

            settleDuration:
                0.6,

            scrollLen:
                1550
        };
    }


    /* =====================================================
       KILL DESKTOP ANIMATION
    ===================================================== */

    function killDesktopAnimation() {

        const trigger =
            ScrollTrigger.getById(
                "expertiseST"
            );


        if (trigger) {
            trigger.kill();
        }


        gsap.killTweensOf([
            left,
            phone,
            right
        ]);
    }


    /* =====================================================
       MOBILE / TABLET
       Lightweight reveal
    ===================================================== */

    let mobileObserver = null;


    function setupMobileAnimation() {

        killDesktopAnimation();


        /* ---------------------------------------------
           Reset GSAP transforms completely
        --------------------------------------------- */

        gsap.set(
            devices,
            {
                clearProps:
                    "x,y,xPercent,yPercent,z,scale,rotationX,rotationY,rotationZ,opacity,transform"
            }
        );


        devices.forEach(
            device => {

                device.classList.remove(
                    "is-visible"
                );

            }
        );


        /* ---------------------------------------------
           IntersectionObserver
        --------------------------------------------- */

        if (mobileObserver) {

            mobileObserver.disconnect();

            mobileObserver = null;
        }


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
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -8% 0px"
                }
            );


        devices.forEach(
            device => {

                mobileObserver.observe(
                    device
                );

            }
        );
    }


    /* =====================================================
       DESKTOP ANIMATION
    ===================================================== */

    function setupDesktopAnimation() {

        if (mobileObserver) {

            mobileObserver.disconnect();

            mobileObserver = null;
        }


        killDesktopAnimation();


        const v =
            getDesktopValues();


        /* ---------------------------------------------
           PHONE INITIAL STATE
        --------------------------------------------- */

        gsap.set(
            phone,
            {

                xPercent: -50,

                yPercent: -50,

                x: 0,

                y: v.phoneStartY,

                scale:
                    v.phoneStartScale,

                transformPerspective:
                    1400,

                transformOrigin:
                    "50% 50%",

                rotationX: 0,

                rotationY: 0,

                rotationZ: 0,

                z: 80,

                zIndex: 10,

                opacity: 1,

                force3D: true

            }
        );


        /* ---------------------------------------------
           LEFT INITIAL STATE
        --------------------------------------------- */

        gsap.set(
            left,
            {

                xPercent: -50,

                yPercent: -50,

                x: 0,

                y: v.sideStartY,

                z: -100,

                scale:
                    v.sideStartScale,

                transformPerspective:
                    1400,

                transformOrigin:
                    "50% 50%",

                rotationX: 18,

                rotationY: 0,

                rotationZ: 0,

                opacity: 1,

                zIndex: 4,

                force3D: true

            }
        );


        /* ---------------------------------------------
           RIGHT INITIAL STATE
        --------------------------------------------- */

        gsap.set(
            right,
            {

                xPercent: -50,

                yPercent: -50,

                x: 0,

                y: v.sideStartY,

                z: -100,

                scale:
                    v.sideStartScale,

                transformPerspective:
                    1400,

                transformOrigin:
                    "50% 50%",

                rotationX: 18,

                rotationY: 0,

                rotationZ: 0,

                opacity: 1,

                zIndex: 4,

                force3D: true

            }
        );


        /* =================================================
           TIMELINE
        ================================================= */

        const tl =
            gsap.timeline({

                defaults: {
                    ease: "none"
                },

                scrollTrigger: {

                    id: "expertiseST",

                    trigger: section,

                    start: "top top",

                    end:
                        `+=${v.scrollLen}`,

                    scrub: 1.5,

                    pin: true,

                    anticipatePin: 1,

                    invalidateOnRefresh: true,

                    fastScrollEnd: false

                }

            });


        /* =================================================
           PHONE
        ================================================= */

        tl.to(
            phone,
            {

                y: v.phoneEndY,

                scale:
                    v.phoneEndScale,

                duration:
                    v.entranceDuration,

                ease:
                    "power3.inOut"

            }
        );


        /* =================================================
           LEFT
        ================================================= */

        tl.to(
            left,
            {

                x:
                    v.leftX,

                y: -4,

                z: 0,

                scale:
                    v.sideEndScale,

                rotationX: 0,

                rotationY: -2,

                rotationZ: -7,

                duration:
                    v.entranceDuration,

                ease:
                    "power3.inOut"

            },
            "<"
        );


        /* =================================================
           RIGHT
        ================================================= */

        tl.to(
            right,
            {

                x:
                    v.rightX,

                y: -4,

                z: 0,

                scale:
                    v.sideEndScale,

                rotationX: 0,

                rotationY: 2,

                rotationZ: 7,

                duration:
                    v.entranceDuration,

                ease:
                    "power3.inOut"

            },
            "<"
        );


        /* =================================================
           SETTLE
        ================================================= */

        tl.to(
            [left, right],
            {

                y: -4,

                duration:
                    v.settleDuration,

                ease:
                    "power2.out"

            }
        );


        tl.to(
            phone,
            {

                y: -12,

                duration:
                    v.settleDuration,

                ease:
                    "power2.out"

            },
            "<"
        );


        /* =================================================
           HOLD
        ================================================= */

        tl.to(
            {},
            {
                duration: 0.6
            }
        );
    }


    /* =====================================================
       BUILD CORRECT MODE
    ===================================================== */

    function build() {

        if (isDesktop()) {

            setupDesktopAnimation();

        } else {

            setupMobileAnimation();

        }


        ScrollTrigger.refresh();
    }


    /* =====================================================
       INITIAL BUILD
    ===================================================== */

    build();


    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer = null;

    let previousDesktopState =
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

                        const currentDesktopState =
                            isDesktop();


                        /*
                         * Only rebuild when crossing
                         * the actual animation breakpoint.
                         *
                         * This avoids unnecessary
                         * GSAP recreation.
                         */

                        if (
                            currentDesktopState !==
                            previousDesktopState
                        ) {

                            previousDesktopState =
                                currentDesktopState;

                            build();

                            return;
                        }


                        /*
                         * Desktop needs new X positions
                         * when viewport width changes.
                         */

                        if (
                            currentDesktopState
                        ) {

                            build();

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
            !reducedMotion.matches
        ) {

            build();

            return;
        }


        killDesktopAnimation();


        if (mobileObserver) {

            mobileObserver.disconnect();

            mobileObserver = null;
        }


        gsap.set(
            devices,
            {
                clearProps:
                    "x,y,xPercent,yPercent,z,scale,rotationX,rotationY,rotationZ"
            }
        );


        devices.forEach(
            device => {

                device.classList.add(
                    "is-visible"
                );

            }
        );


        ScrollTrigger.refresh();
    }


    reducedMotion.addEventListener?.(
        "change",
        handleReducedMotion
    );


    handleReducedMotion();

});