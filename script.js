
window.addEventListener("load", () => {

    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    // =========================================
    // SCROLL EFFECT SETTINGS
    // =========================================

    // Particles completely scatter after
    // scrolling 30% of the viewport height.
    // const SCROLL_DISTANCE = window.innerHeight * 0.30;
    let SCROLL_DISTANCE = window.innerHeight * 0.30;

    // Scroll position where the effect starts.
    const SCROLL_TRIGGER = 0;

    // Maximum distance particles can scatter.
    const SCATTER_DISTANCE_MIN = 80;
    const SCATTER_DISTANCE_MAX = 300;


    // =========================================
    // PARTICLE
    // =========================================

    class Particle {

        constructor(effect, x, y, color) {

            this.effect = effect;

            // Starting position
            this.x = Math.random() * effect.width;
            this.y = Math.random() * effect.height;

            // Original image position
            this.originX = x;
            this.originY = y;

            this.color = color;

            this.size = effect.gap;

            // Particle velocity
            this.vx = 0;
            this.vy = 0;

            // Movement settings
            this.ease = 0.08;
            this.friction = 0.90;


            // =========================================
            // RANDOM SCATTER DIRECTION
            // =========================================

            const angle =
                Math.random() * Math.PI * 2;

            const distance =
                SCATTER_DISTANCE_MIN +
                Math.random() *
                (
                    SCATTER_DISTANCE_MAX -
                    SCATTER_DISTANCE_MIN
                );


            this.scatterX =
                Math.cos(angle) * distance;

            this.scatterY =
                Math.sin(angle) * distance;


            // Mouse interaction
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.force = 0;
            this.angle = 0;
        }


        // =========================================
        // DRAW
        // =========================================

        draw(context) {

            context.fillStyle = this.color;

            context.fillRect(
                this.x,
                this.y,
                this.size,
                this.size
            );
        }


        // =========================================
        // UPDATE
        // =========================================

        update() {

            // =========================================
            // SCROLL POSITION
            // =========================================

            const scrollAmount =
                this.effect.scrollProgress;


            // Target position based on scroll
            const targetX =
                this.originX +
                this.scatterX *
                scrollAmount;

            const targetY =
                this.originY +
                this.scatterY *
                scrollAmount;


            // =========================================
            // MOUSE INTERACTION
            // =========================================

            this.dx =
                this.effect.mouse.x -
                this.x;

            this.dy =
                this.effect.mouse.y -
                this.y;


            this.distance =
                this.dx * this.dx +
                this.dy * this.dy;


            // Prevent division by zero
            if (
                this.distance <
                this.effect.mouse.radius
            ) {

                this.force =
                    -this.effect.mouse.radius /
                    Math.max(
                        this.distance,
                        1
                    );


                this.angle =
                    Math.atan2(
                        this.dy,
                        this.dx
                    );


                this.vx +=
                    this.force *
                    Math.cos(this.angle);

                this.vy +=
                    this.force *
                    Math.sin(this.angle);
            }


            // =========================================
            // FRICTION
            // =========================================

            this.vx *= this.friction;
            this.vy *= this.friction;


            // =========================================
            // MOVE TOWARDS SCROLL TARGET
            // =========================================

            this.x +=
                this.vx +
                (
                    targetX -
                    this.x
                ) *
                this.ease;


            this.y +=
                this.vy +
                (
                    targetY -
                    this.y
                ) *
                this.ease;
        }
    }


    // =========================================
    // EFFECT
    // =========================================

    class Effect {

        constructor(width, height) {

            this.width = width;
            this.height = height;

            this.particlesArray = [];

            // 0 = original image
            // 1 = completely scattered
            this.scrollProgress = 0;


            this.hero =
                document.getElementById("home");


            this.image =
                document.getElementById("image1");


            // Particle spacing
            this.gap = 2;


            // =========================================
            // MOUSE
            // =========================================

            this.mouse = {

                radius: 1500,

                x: width / 2,
                y: height / 2
            };


            // =========================================
            // MOUSE MOVE
            // =========================================

            window.addEventListener(
                "mousemove",
                event => {

                    this.mouse.x =
                        event.clientX;

                    this.mouse.y =
                        event.clientY;
                }
            );
        }


        // =========================================
        // CREATE PARTICLES
        // =========================================

        init(context) {

            context.clearRect(
                0,
                0,
                this.width,
                this.height
            );


            // =========================================
            // IMAGE SCALE
            // =========================================

            const scale =
                Math.min(
                    this.width /
                    this.image.width,

                    this.height /
                    this.image.height,

                    1
                );


            const imageWidth =
                this.image.width *
                scale;


            const imageHeight =
                this.image.height *
                scale;


            const x =
                (
                    this.width -
                    imageWidth
                ) / 2;


            const y =
                (
                    this.height -
                    imageHeight
                ) / 2;


            // =========================================
            // DRAW IMAGE TEMPORARILY
            // =========================================

            context.drawImage(
                this.image,
                x,
                y,
                imageWidth,
                imageHeight
            );


            // =========================================
            // READ IMAGE PIXELS
            // =========================================

            const pixels =
                context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data;


            // =========================================
            // CREATE PARTICLES
            // =========================================

            for (
                let y = 0;
                y < this.height;
                y += this.gap
            ) {

                for (
                    let x = 0;
                    x < this.width;
                    x += this.gap
                ) {

                    const index =
                        (
                            y *
                            this.width +
                            x
                        ) * 4;


                    const alpha =
                        pixels[index + 3];


                    if (alpha > 50) {

                        const red =
                            pixels[index];

                        const green =
                            pixels[index + 1];

                        const blue =
                            pixels[index + 2];


                        const color =
                            `rgb(
                                ${red},
                                ${green},
                                ${blue}
                            )`;


                        this.particlesArray.push(
                            new Particle(
                                this,
                                x,
                                y,
                                color
                            )
                        );
                    }
                }
            }


            // Remove temporary image
            context.clearRect(
                0,
                0,
                this.width,
                this.height
            );
        }


        // =========================================
        // DRAW PARTICLES
        // =========================================

        draw(context) {

            this.particlesArray.forEach(
                particle => {

                    particle.draw(
                        context
                    );
                }
            );
        }


        // =========================================
        // UPDATE PARTICLES
        // =========================================

        update() {

            this.particlesArray.forEach(
                particle => {

                    particle.update();
                }
            );
        }
    }


    // =========================================
    // CREATE EFFECT
    // =========================================

    const effect =
        new Effect(
            canvas.width,
            canvas.height
        );


    effect.init(ctx);


    // =========================================
    // SCROLL PROGRESS
    // =========================================

    function updateScrollProgress() {

        const scrollY =
            window.scrollY;


        const progress =
            (
                scrollY -
                SCROLL_TRIGGER
            ) /
            SCROLL_DISTANCE;


        effect.scrollProgress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );
    }


    // =========================================
    // SCROLL LISTENER
    // =========================================

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        {
            passive: true
        }
    );


    // Initial state
    updateScrollProgress();


    // =========================================
    // ANIMATION LOOP
    // =========================================

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        effect.draw(ctx);

        effect.update();


        requestAnimationFrame(
            animate
        );
    }


    animate();


    // =========================================
    // RESIZE
    // =========================================

    window.addEventListener(
        "resize",
        () => {

            canvas.width =
                window.innerWidth;

            canvas.height =
                window.innerHeight;


            effect.width =
                canvas.width;

            effect.height =
                canvas.height;


            effect.mouse.x =
                canvas.width / 2;

            effect.mouse.y =
                canvas.height / 2;


            // Recalculate 30% viewport distance
            SCROLL_DISTANCE =
                window.innerHeight * 0.30;


            // Rebuild particles
            effect.particlesArray = [];

            effect.init(ctx);

            updateScrollProgress();
        }
    );

});
/* =========================================================
   AREA OF EXPERTISE — CINEMATIC SCROLL ANIMATION
========================================================= */

window.addEventListener("load", () => {

    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) {
        console.warn("GSAP / ScrollTrigger not loaded.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);


    /* ---------------------------------------------------------
       ELEMENTS
    --------------------------------------------------------- */

    const section =
        document.querySelector(".expertise");

    const title =
        document.querySelector(".expertise-title");

    const devices =
        document.querySelectorAll(".expertise-device");


    if (
        !section ||
        !title ||
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


    /* ---------------------------------------------------------
       TITLE CHARACTER SPLIT
    --------------------------------------------------------- */

    const titleText =
        title.textContent.trim();

    title.setAttribute(
        "aria-label",
        titleText
    );

    title.textContent = "";


    [...titleText].forEach(character => {

        const span =
            document.createElement("span");

        span.textContent =
            character === " "
                ? "\u00A0"
                : character;

        span.className =
            "expertise-title-char";

        span.setAttribute(
            "aria-hidden",
            "true"
        );

        title.appendChild(span);
    });


    const titleChars =
        title.querySelectorAll(
            ".expertise-title-char"
        );


    /* ---------------------------------------------------------
       RESPONSIVE VALUES
    --------------------------------------------------------- */

    function getValues() {

        const vw =
            window.innerWidth;


        // if (vw <= 600) {

        //     return {

        //         phoneEnterScale: 1.02,

        //         phoneExitScale: 0.88,

        //         leftX: -vw * 0.27,

        //         rightX: vw * 0.27,

        //         sideStartScale: 0.10,

        //         sideEndScale: 0.78,

        //         scrollLen: 3800
        //     };
        // }


        // if (vw <= 992) {

        //     return {

        //         phoneEnterScale: 1.04,

        //         phoneExitScale: 0.89,

        //         leftX: -vw * 0.28,

        //         rightX: vw * 0.28,

        //         sideStartScale: 0.10,

        //         sideEndScale: 0.84,

        //         scrollLen: 4100
        //     };
        // }


        return {

            phoneEnterScale: 1.05,

            phoneExitScale: 0.90,

            leftX: -vw * 0.25,

            rightX: vw * 0.25,

            sideStartScale: 0.10,

            sideEndScale: 0.90,

            scrollLen: 1000,
        };
    }


    /* ---------------------------------------------------------
       BUILD ANIMATION
    --------------------------------------------------------- */

    function buildExpertiseAnimation() {

        const existing =
            ScrollTrigger.getById(
                "expertiseST"
            );

        if (existing) {
            existing.kill();
        }


        gsap.killTweensOf([
            left,
            phone,
            right,
            title,
            titleChars
        ]);


        const values =
            getValues();


        /* =====================================================
           INITIAL PHONE
        ===================================================== */

        gsap.set(phone, {

            xPercent: -50,
            yPercent: -50,

            x: 0,

            y: "105vh",

            scale:
                values.phoneEnterScale,

            transformPerspective: 140,

            transformOrigin:
                "50% 50%",

            zIndex: 10,

            opacity: 1,

            force3D: true
        });


        /* =====================================================
           INITIAL LEFT SCREEN
           Hidden behind phone
        ===================================================== */

        gsap.set(left, {

            xPercent: -50,
            yPercent: -50,

            x: 0,
            y: 0,

            z: -160,

            scale:
                values.sideStartScale,

            transformPerspective: 1400,

            transformOrigin:
                "50% 50%",

            rotationY: 0,

            rotationX: 24,

            rotationZ: 0,

            opacity: 0,

            zIndex: 4,

            force3D: true
        });


        /* =====================================================
           INITIAL RIGHT SCREEN
           Hidden behind phone
        ===================================================== */

        gsap.set(right, {

            xPercent: -50,
            yPercent: -50,

            x: 0,
            y: 0,

            z: -160,

            scale:
                values.sideStartScale,

            transformPerspective: 1400,

            transformOrigin:
                "50% 50%",

            rotationY: 0,

            rotationX: 24,

            rotationZ: 0,

            opacity: 0,

            zIndex: 4,

            force3D: true
        });


        /* =====================================================
           TITLE
        ===================================================== */

        gsap.set(title, {

            y: 34,

            opacity: 1,

            zIndex: 2
        });


        gsap.set(titleChars, {

            y: 24,

            opacity: 0,

            filter: "blur(7px)"
        });


        /* =====================================================
           TIMELINE
        ===================================================== */

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
                        `+=${values.scrollLen}`,

                    scrub: 0.1,

                    pin: true,

                    anticipatePin: 1,

                    invalidateOnRefresh: true,

                    fastScrollEnd: false
                }
            });


        /* =====================================================
           PHASE 1
           PHONE ENTERS
        ===================================================== */

        tl.to(phone, {

            y: 0,

            duration: 2.8,

            ease: "power3.out"
        });


        /* Breathing room */

        tl.to({}, {

            duration: 0.75
        });


        /* =====================================================
           PHASE 2
           PHONE SHRINKS
           SIDE SCREENS EMERGE
        ===================================================== */

        tl.to(phone, {

            scale:
                values.phoneExitScale,

            y: -8,

            duration: 2.8,

            ease: "power2.inOut"
        });


        /* LEFT */

        tl.to(
            left,
            {

                x:
                    values.leftX,

                z: 0,

                scale:
                    values.sideEndScale,

                rotationX: 0,

                rotationY: -2,

                rotationZ: -7,

                opacity: 1,

                duration: 3.2,

                ease: "power3.inOut"
            },

            "<+0.08"
        );


        /* RIGHT */

        tl.to(
            right,
            {

                x:
                    values.rightX,

                z: 0,

                scale:
                    values.sideEndScale,

                rotationX: 0,

                rotationY: 2,

                rotationZ: 7,

                opacity: 1,

                duration: 3.2,

                ease: "power3.inOut"
            },

            "<"
        );


        /* =====================================================
           PHASE 3
           TITLE REVEAL
        ===================================================== */

        tl.to(
            titleChars,
            {

                y: 0,

                opacity: 1,

                filter:
                    "blur(0px)",

                duration: 1.4,

                stagger: 0.035,

                ease: "power3.out"
            },

            "-=1.0"
        );


        tl.to(
            title,
            {

                y: 0,

                duration: 1.1,

                ease: "power3.out"
            },

            "<"
        );


        /* =====================================================
           PHASE 4
           MICRO SETTLE
        ===================================================== */

        tl.to(
            [left, right],
            {

                y: -4,

                duration: 1.0,

                ease: "power2.out"
            }
        );


        tl.to(
            phone,
            {

                y: -12,

                duration: 1.0,

                ease: "power2.out"
            },

            "<"
        );


        /* Final hold */

        tl.to({}, {

            duration: 1.8
        });
    }


    buildExpertiseAnimation();


    /* ---------------------------------------------------------
       RESIZE
    --------------------------------------------------------- */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer =
                setTimeout(() => {

                    buildExpertiseAnimation();

                    ScrollTrigger.refresh();

                }, 220);
        },
        {
            passive: true
        }
    );

});

