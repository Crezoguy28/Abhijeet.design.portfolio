/* =========================================================
   TESTIMONIALS — CINEMATIC CARD STACK
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

    const section =
        document.querySelector(".testimonials");

    const cards =
        gsap.utils.toArray(".testimonial-card");

    if (!section || cards.length < 2) {
        return;
    }


    /* =====================================================
       DESKTOP ONLY
       >=1025px

       Existing cinematic animation preserved.
    ===================================================== */

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {

        gsap.set(cards, {
            y: 0,
            x: 0,
            scale: 1,
            opacity: 1
        });


        const timeline =
            gsap.timeline({

                scrollTrigger: {

                    trigger: section,

                    start: "top top",

                    end:
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


        cards.forEach(
            (card, index) => {

                if (index === 0) {
                    return;
                }


                const previousCard =
                    cards[index - 1];


                /* -----------------------------------------
                   Next card rises from below
                ----------------------------------------- */

                timeline.fromTo(

                    card,

                    {
                        y: () =>
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


                /* -----------------------------------------
                   Previous card settles
                ----------------------------------------- */

                timeline.to(

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


                /* -----------------------------------------
                   Cinematic pause
                ----------------------------------------- */

                timeline.to(
                    {},
                    {
                        duration: 0.35
                    }
                );

            }
        );


        requestAnimationFrame(() => {

            ScrollTrigger.refresh();

        });


        return () => {

            timeline.kill();

            gsap.set(
                cards,
                {
                    clearProps:
                        "transform,opacity"
                }
            );

        };

    });


    /* =====================================================
       REFRESH AFTER RESIZE / ORIENTATION
    ===================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );

            resizeTimer =
                setTimeout(() => {

                    ScrollTrigger.refresh();

                }, 250);

        },
        {
            passive: true
        }
    );

});