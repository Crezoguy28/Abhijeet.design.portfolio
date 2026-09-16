window.addEventListener("load", () => {

    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    // =========================================
    // SCROLL EFFECT SETTINGS
    // =========================================

    let SCROLL_DISTANCE = window.innerHeight * 0.30;

    const SCROLL_TRIGGER = 0;

    const SCATTER_DISTANCE_MIN = 80;
    const SCATTER_DISTANCE_MAX = 300;


    // =========================================
    // PARTICLE
    // =========================================

    class Particle {

        constructor(effect, x, y, color) {

            this.effect = effect;

            this.x = Math.random() * effect.width;
            this.y = Math.random() * effect.height;

            this.originX = x;
            this.originY = y;

            this.color = color;

            this.size = effect.gap;

            this.vx = 0;
            this.vy = 0;

            this.ease = 0.065;
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

            const scrollAmount =
                this.effect.scrollProgress;


            // =========================================
            // SCROLL TARGET
            // =========================================

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
            // MOVE
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

            this.scrollProgress = 0;

            this.hero =
                document.getElementById("home");

            this.image =
                document.getElementById("image1");

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
            // TEMPORARY IMAGE
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


            SCROLL_DISTANCE =
                window.innerHeight * 0.30;


            effect.particlesArray = [];

            effect.init(ctx);

            updateScrollProgress();
        }
    );

});