window.addEventListener("load", () => {

    gsap.registerPlugin(ScrollTrigger);


    /* =========================================================
       ABOUT — STATS FADE IN UP
    ========================================================= */

    const stats = document.querySelectorAll(".about-stats .stat");

    if (stats.length) {

        gsap.fromTo(
            stats,
            {
                y: 30,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,

                duration: 0.8,
                stagger: 0.18,

                ease: "power3.out",

                scrollTrigger: {
                    trigger: ".about-stats",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );

    }
    /* =========================================================
       ABOUT — ORGANIC / FLUID IMAGE REVEAL
    ========================================================= */

    const visual = document.querySelector(".about-fluid-reveal");
    const wobble = document.querySelector(".about-fluid-reveal__wobble");
    const image = document.querySelector(".about-fluid-reveal__image");

    if (!visual || !wobble || !image) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) {

        gsap.set(wobble, {
            scale: 1
        });

        gsap.set(image, {
            scale: 1
        });

        return;
    }

    gsap.set(wobble, {
        scale: 0.08,
        xPercent: -3,
        yPercent: 4
    });

    gsap.set(image, {
        scale: 1.08,
        transformOrigin: "50% 50%"
    });

    const fluidReveal = gsap.timeline({

        scrollTrigger: {

            trigger: visual,

            start: "top 78%",

            end: "bottom 42%",

            scrub: 2,

            invalidateOnRefresh: true,

            fastScrollEnd: false
        }

    });

});