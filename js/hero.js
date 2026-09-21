window.addEventListener("load", () => {

    const canvas = document.getElementById("canvas1");
    const ctx = canvas?.getContext("2d", {
        alpha: true
    });

    const hero = document.getElementById("home");
    const image = document.getElementById("image1");

    if (!canvas || !ctx || !hero || !image) return;


    /* =========================================================
       SETTINGS
    ========================================================= */

    let SCROLL_DISTANCE =
        window.innerHeight * 0.30;

    const SCROLL_TRIGGER = 2;

    const SCATTER_DISTANCE_MIN = 80;
    const SCATTER_DISTANCE_MAX = 300;


    /* =========================================================
       PARTICLE SETTINGS
       
       IMPORTANT:
       sampleGap = image sampling density
       particleSize = actual rendered pixel size

       They are intentionally independent so reducing the
       visual particle size does NOT automatically increase
       the processing cost.
    ========================================================= */

    const DESKTOP_SAMPLE_GAP = 2;
    const MOBILE_SAMPLE_GAP = 1;

    const DESKTOP_PARTICLE_SIZE = 2.5;
    const MOBILE_PARTICLE_SIZE = 1;


    /* =========================================================
       PARTICLE
    ========================================================= */

    class Particle {

        constructor(
            effect,
            x,
            y,
            color
        ) {

            this.effect = effect;

            this.x =
                Math.random() *
                effect.width;

            this.y =
                Math.random() *
                effect.height;

            this.originX = x;
            this.originY = y;

            this.color = color;

            /*
             * Visual size is independent from
             * sampling density.
             */
            this.size =
                effect.particleSize;

            this.vx = 0;
            this.vy = 0;

            this.ease =
                effect.isMobile
                    ? 0.12
                    : 0.10;

            this.friction = 0.90;


            /* -------------------------------------------------
               RANDOM SCATTER
            ------------------------------------------------- */

            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                SCATTER_DISTANCE_MIN +
                Math.random() *
                (
                    SCATTER_DISTANCE_MAX -
                    SCATTER_DISTANCE_MIN
                );


            this.scatterX =
                Math.cos(angle) *
                distance;

            this.scatterY =
                Math.sin(angle) *
                distance;


            this.dx = 0;
            this.dy = 0;

            this.distance = 0;
            this.force = 0;
            this.angle = 0;
        }


        /* =====================================================
           DRAW
        ===================================================== */

        draw(context) {

            context.fillStyle =
                this.color;

            context.fillRect(
                this.x,
                this.y,
                this.size,
                this.size
            );
        }


        /* =====================================================
           UPDATE
        ===================================================== */

        update() {

            const scrollAmount =
                this.effect.scrollProgress;


            const targetX =
                this.originX +
                this.scatterX *
                scrollAmount;

            const targetY =
                this.originY +
                this.scatterY *
                scrollAmount;


            /* -------------------------------------------------
               MOUSE
            ------------------------------------------------- */

            if (!this.effect.isMobile) {

                this.dx =
                    this.effect.mouse.x -
                    this.x;

                this.dy =
                    this.effect.mouse.y -
                    this.y;

                this.distance =
                    this.dx * this.dx +
                    this.dy * this.dy;


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
                        Math.cos(
                            this.angle
                        );

                    this.vy +=
                        this.force *
                        Math.sin(
                            this.angle
                        );
                }
            }


            /* -------------------------------------------------
               FRICTION
            ------------------------------------------------- */

            this.vx *=
                this.friction;

            this.vy *=
                this.friction;


            /* -------------------------------------------------
               MOVEMENT
            ------------------------------------------------- */

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


    /* =========================================================
       EFFECT
    ========================================================= */

    class Effect {

        constructor(
            width,
            height
        ) {

            this.width = width;
            this.height = height;

            this.particlesArray = [];

            this.scrollProgress = 0;

            this.hero = hero;

            this.image = image;


            /* -------------------------------------------------
               RESPONSIVE MODE
            ------------------------------------------------- */

            this.isMobile =
                window.innerWidth <= 600;


            this.updateParticleSettings();


            /* -------------------------------------------------
               MOUSE
            ------------------------------------------------- */

            this.mouse = {

                radius: 0,

                x:
                    width / 2,

                y:
                    height / 2
            };


            window.addEventListener(
                "mousemove",
                event => {

                    if (
                        this.isMobile
                    ) {
                        return;
                    }


                    this.mouse.x =
                        event.clientX;

                    this.mouse.y =
                        event.clientY;

                },
                {
                    passive: true
                }
            );
        }


        /* =====================================================
           PARTICLE SETTINGS
        ===================================================== */

        updateParticleSettings() {

            this.isMobile =
                window.innerWidth <= 600;


            /*
             * Sampling density.
             *
             * 2px keeps the character detailed.
             * It is now sampled only inside the character
             * bounds, NOT across the entire canvas.
             */
            this.sampleGap =
                this.isMobile
                    ? MOBILE_SAMPLE_GAP
                    : DESKTOP_SAMPLE_GAP;


            /*
             * Actual visual pixel size.
             *
             * Mobile is intentionally much smaller.
             */
            this.particleSize =
                this.isMobile
                    ? MOBILE_PARTICLE_SIZE
                    : DESKTOP_PARTICLE_SIZE;
        }


        /* =====================================================
           RESPONSIVE MODE
        ===================================================== */

        updateMode() {

            this.updateParticleSettings();

            this.mouse.radius = 0;

            /*
             * Update existing particle size immediately
             * without recreating the entire particle system.
             */
            this.particlesArray.forEach(
                particle => {

                    particle.size =
                        this.particleSize;
                }
            );
        }


        /* =====================================================
           CHARACTER LAYOUT
        ===================================================== */

        getCharacterLayout() {

            const sourceWidth =
                this.image.naturalWidth ||
                this.image.width;

            const sourceHeight =
                this.image.naturalHeight ||
                this.image.height;


            if (
                !sourceWidth ||
                !sourceHeight
            ) {
                return null;
            }


            const sourceRatio =
                sourceWidth /
                sourceHeight;


            /* =================================================
               MOBILE
            ================================================= */

            if (this.isMobile) {

                const targetWidth =
                    Math.min(
                        this.width * 0.96,
                        430
                    );


                const targetHeight =
                    targetWidth /
                    sourceRatio;


                return {

                    width:
                        targetWidth,

                    height:
                        targetHeight,

                    x:
                        (
                            this.width -
                            targetWidth
                        ) / 2,

                    y:
                        Math.min(
                            this.height * 0.22,
                            170
                        )
                };
            }


            /* =================================================
               DESKTOP / TABLET
            ================================================= */

            const scale =
                Math.min(

                    this.width /
                    sourceWidth,

                    this.height /
                    sourceHeight,

                    1
                );


            const width =
                sourceWidth *
                scale;

            const height =
                sourceHeight *
                scale;


            return {

                width,

                height,

                x:
                    (
                        this.width -
                        width
                    ) / 2,

                y:
                    (
                        this.height -
                        height
                    ) / 2
            };
        }


        /* =====================================================
           CREATE PARTICLES
           
           IMPORTANT PERFORMANCE FIX:
           
           Previously the code scanned:
           
           0 → canvas width
           0 → canvas height
           
           even though most of that area was transparent.

           Now only the actual character bounds are sampled.
        ===================================================== */

        init(context) {

            this.particlesArray = [];


            context.clearRect(
                0,
                0,
                this.width,
                this.height
            );


            const layout =
                this.getCharacterLayout();


            if (!layout) {
                return;
            }


            /* -------------------------------------------------
               DRAW CHARACTER TO CANVAS
            ------------------------------------------------- */

            context.drawImage(

                this.image,

                layout.x,
                layout.y,

                layout.width,
                layout.height

            );


            /* -------------------------------------------------
               CHARACTER BOUNDS
               
               Clamp to canvas.
            ------------------------------------------------- */

            const startX =
                Math.max(
                    0,
                    Math.floor(
                        layout.x
                    )
                );


            const startY =
                Math.max(
                    0,
                    Math.floor(
                        layout.y
                    )
                );


            const endX =
                Math.min(
                    this.width,
                    Math.ceil(
                        layout.x +
                        layout.width
                    )
                );


            const endY =
                Math.min(
                    this.height,
                    Math.ceil(
                        layout.y +
                        layout.height
                    )
                );


            const sampleWidth =
                Math.max(
                    1,
                    endX -
                    startX
                );


            const sampleHeight =
                Math.max(
                    1,
                    endY -
                    startY
                );


            /* -------------------------------------------------
               READ ONLY CHARACTER PIXELS
            ------------------------------------------------- */

            const pixels =
                context.getImageData(
                    startX,
                    startY,
                    sampleWidth,
                    sampleHeight
                ).data;


            /* -------------------------------------------------
               CREATE PARTICLES
            ------------------------------------------------- */

            const gap =
                this.sampleGap;


            for (
                let y = 0;
                y < sampleHeight;
                y += gap
            ) {

                for (
                    let x = 0;
                    x < sampleWidth;
                    x += gap
                ) {

                    const index =
                        (
                            y *
                            sampleWidth +
                            x
                        ) * 4;


                    const alpha =
                        pixels[
                            index + 3
                        ];


                    if (
                        alpha > 50
                    ) {

                        const red =
                            pixels[
                                index
                            ];

                        const green =
                            pixels[
                                index + 1
                            ];

                        const blue =
                            pixels[
                                index + 2
                            ];


                        const color =
                            `rgb(${red},${green},${blue})`;


                        this.particlesArray.push(

                            new Particle(

                                this,

                                startX + x,

                                startY + y,

                                color

                            )
                        );
                    }
                }
            }


            /* -------------------------------------------------
               CLEAR SOURCE IMAGE
            ------------------------------------------------- */

            context.clearRect(
                0,
                0,
                this.width,
                this.height
            );
        }


        /* =====================================================
           DRAW
        ===================================================== */

        draw(context) {

            this.particlesArray.forEach(
                particle => {

                    particle.draw(
                        context
                    );

                }
            );
        }


        /* =====================================================
           UPDATE
        ===================================================== */

        update() {

            this.particlesArray.forEach(
                particle => {

                    particle.update();

                }
            );
        }
    }


    /* =========================================================
       CREATE EFFECT
    ========================================================= */

    const effect =
        new Effect(
            1,
            1
        );


    /* =========================================================
       SCROLL PROGRESS
    ========================================================= */

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


    /* =========================================================
       CANVAS RESIZE
    ========================================================= */

    function resizeCanvas() {

        const rect =
            hero.getBoundingClientRect();


        canvas.width =
            Math.max(
                1,
                Math.round(
                    rect.width
                )
            );


        canvas.height =
            Math.max(
                1,
                Math.round(
                    rect.height
                )
            );


        effect.width =
            canvas.width;

        effect.height =
            canvas.height;


        effect.updateMode();


        effect.mouse.x =
            canvas.width / 2;

        effect.mouse.y =
            canvas.height / 2;


        SCROLL_DISTANCE =
            Math.max(
                canvas.height * 0.30,
                200
            );


        effect.init(ctx);


        updateScrollProgress();
    }


    /* =========================================================
       ANIMATION LOOP
    ========================================================= */

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        effect.update();

        effect.draw(ctx);


        requestAnimationFrame(
            animate
        );
    }


    /* =========================================================
       INITIALIZE
    ========================================================= */

    function initialize() {

        resizeCanvas();

        animate();
    }


    if (
        image.complete
    ) {

        initialize();

    } else {

        image.addEventListener(
            "load",
            initialize,
            {
                once: true
            }
        );
    }


    /* =========================================================
       SCROLL
    ========================================================= */

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        {
            passive: true
        }
    );


    /* =========================================================
       RESPONSIVE RESIZE
    ========================================================= */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        resizeCanvas();

                    },
                    150
                );

        },
        {
            passive: true
        }
    );

});