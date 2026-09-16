window.addEventListener("load", () => {

    gsap.registerPlugin(ScrollTrigger);


    /* =========================================================
       EXPERTISE SECTION
       Sequence:
       1. Phone enters from bottom
       2. Short hold
       3. Phone shrinks
       4. Left + right screens emerge
       5. Micro settle
       6. Final hold
    ========================================================= */

    const section = document.querySelector("#expertise");
    const devices = document.querySelectorAll(".expertise-device");

    if (!section || devices.length < 3) return;

    const left = devices[0];
    const phone = devices[1];
    const right = devices[2];


    /* =========================================================
       RESPONSIVE VALUES
    ========================================================= */

    function getValues() {

        const vw = window.innerWidth;


        /* -------------------------
           MOBILE
        ------------------------- */

        if (vw <= 600) {

            return {
                phoneEnterScale: 1.02,
                phoneExitScale: 0.88,

                leftX: -vw * 0.27,
                rightX: vw * 0.27,

                sideStartScale: 0.10,
                sideEndScale: 0.78,

                scrollLen: 1500
            };

        }


        /* -------------------------
           TABLET
        ------------------------- */

        if (vw <= 992) {

            return {
                phoneEnterScale: 1.04,
                phoneExitScale: 0.89,

                leftX: -vw * 0.28,
                rightX: vw * 0.28,

                sideStartScale: 0.10,
                sideEndScale: 0.84,

                scrollLen: 1550
            };

        }


        /* -------------------------
           DESKTOP
        ------------------------- */

        return {
            phoneEnterScale: 1.05,
            phoneExitScale: 0.90,

            leftX: -vw * 0.25,
            rightX: vw * 0.25,

            sideStartScale: 0.10,
            sideEndScale: 0.90,

            scrollLen: 1450
        };

    }


    /* =========================================================
       BUILD ANIMATION
    ========================================================= */

    function build() {

        /* -------------------------
           CLEAN PREVIOUS INSTANCE
        ------------------------- */

        ScrollTrigger.getById("expertiseST")?.kill();

        gsap.killTweensOf([
            left,
            phone,
            right
        ]);


        const v = getValues();


        /* =====================================================
           PHONE INITIAL STATE
        ===================================================== */

        gsap.set(phone, {

            xPercent: -50,
            yPercent: -50,

            x: 0,
            y: "105vh",

            scale: v.phoneEnterScale,

            transformPerspective: 1400,
            transformOrigin: "50% 50%",

            zIndex: 10,
            opacity: 1,

            force3D: true

        });


        /* =====================================================
           LEFT SCREEN INITIAL STATE
        ===================================================== */

        gsap.set(left, {

            xPercent: -50,
            yPercent: -50,

            x: 0,
            y: 0,

            z: -160,

            scale: v.sideStartScale,

            transformPerspective: 1400,
            transformOrigin: "50% 50%",

            rotationY: 0,
            rotationX: 24,
            rotationZ: 0,

            opacity: 0,

            zIndex: 4,

            force3D: true

        });


        /* =====================================================
           RIGHT SCREEN INITIAL STATE
        ===================================================== */

        gsap.set(right, {

            xPercent: -50,
            yPercent: -50,

            x: 0,
            y: 0,

            z: -160,

            scale: v.sideStartScale,

            transformPerspective: 1400,
            transformOrigin: "50% 50%",

            rotationY: 0,
            rotationX: 24,
            rotationZ: 0,

            opacity: 0,

            zIndex: 4,

            force3D: true

        });


        /* =====================================================
           MAIN TIMELINE
        ===================================================== */

        const tl = gsap.timeline({

            defaults: {
                ease: "none"
            },

            scrollTrigger: {

                id: "expertiseST",

                trigger: section,

                start: "top top",

                end: `+=${v.scrollLen}`,

                scrub: 1.5,

                pin: true,

                anticipatePin: 1,

                invalidateOnRefresh: true,

                fastScrollEnd: false

            }

        });


        /* =====================================================
           01 — PHONE ENTERS
        ===================================================== */

        tl.to(phone, {

            y: 0,

            duration: 1.2,

            ease: "power3.out"

        });


        /* =====================================================
           02 — SHORT HOLD
        ===================================================== */

        tl.to({}, {

            duration: 0.35

        });


        /* =====================================================
           03 — PHONE SHRINKS
        ===================================================== */

        tl.to(phone, {

            scale: v.phoneExitScale,

            y: -8,

            duration: 1.5,

            ease: "power2.inOut"

        });


        /* =====================================================
           04 — LEFT SCREEN EMERGES
        ===================================================== */

        tl.to(
            left,
            {

                x: v.leftX,

                z: 0,

                scale: v.sideEndScale,

                rotationX: 0,
                rotationY: -2,
                rotationZ: -7,

                opacity: 1,

                duration: 1.8,

                ease: "power3.inOut"

            },
            "<+0.05"
        );


        /* =====================================================
           05 — RIGHT SCREEN EMERGES
        ===================================================== */

        tl.to(
            right,
            {

                x: v.rightX,

                z: 0,

                scale: v.sideEndScale,

                rotationX: 0,
                rotationY: 2,
                rotationZ: 7,

                opacity: 1,

                duration: 1.8,

                ease: "power3.inOut"

            },
            "<"
        );


        /* =====================================================
           06 — SIDE SCREEN MICRO SETTLE
        ===================================================== */

        tl.to(
            [left, right],
            {

                y: -4,

                duration: 0.6,

                ease: "power2.out"

            }
        );


        /* =====================================================
           07 — PHONE MICRO SETTLE
        ===================================================== */

        tl.to(
            phone,
            {

                y: -12,

                duration: 0.6,

                ease: "power2.out"

            },
            "<"
        );


        /* =====================================================
           08 — FINAL HOLD
        ===================================================== */

        tl.to({}, {

            duration: 0.6

        });

    }


    /* =========================================================
       INITIAL BUILD
    ========================================================= */

    build();


    /* =========================================================
       RESIZE HANDLING
    ========================================================= */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {

                build();

                ScrollTrigger.refresh();

            }, 220);

        },
        {
            passive: true
        }
    );


    /* =========================================================
       REDUCED MOTION
    ========================================================= */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    function applyReducedMotion() {

        if (!reducedMotion.matches) return;

        ScrollTrigger.getById("expertiseST")?.kill();

        const v = getValues();


        /* -------------------------
           PHONE
        ------------------------- */

        gsap.set(phone, {

            xPercent: -50,
            yPercent: -50,

            x: 0,
            y: -12,

            scale: 0.90,

            z: 80,

            opacity: 1

        });


        /* -------------------------
           LEFT
        ------------------------- */

        gsap.set(left, {

            xPercent: -50,
            yPercent: -50,

            x: v.leftX,
            y: -4,

            z: 0,

            scale: v.sideEndScale,

            rotationX: 0,
            rotationY: -2,
            rotationZ: -7,

            opacity: 1

        });


        /* -------------------------
           RIGHT
        ------------------------- */

        gsap.set(right, {

            xPercent: -50,
            yPercent: -50,

            x: v.rightX,
            y: -4,

            z: 0,

            scale: v.sideEndScale,

            rotationX: 0,
            rotationY: 2,
            rotationZ: 7,

            opacity: 1

        });

    }


    reducedMotion.addEventListener?.(
        "change",
        applyReducedMotion
    );


    applyReducedMotion();

});