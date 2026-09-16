/* =========================================================
   CASE STUDIES — CINEMATIC CARD STACK
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

    const section = document.querySelector(".case-studies");
    const cards = gsap.utils.toArray(".case-card");

    if (!section || cards.length < 2) {
        return;
    }

    /* -----------------------------------------
       INITIAL STATE
    ----------------------------------------- */

    gsap.set(cards, {
        y: 0,
        scale: 1,
        opacity: 1,
        x: 0
    });

    /* -----------------------------------------
       CINEMATIC STACK
    ----------------------------------------- */

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${(cards.length - 1) * 850 + 400}`,
            pin: true,
            pinSpacing: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    cards.forEach((card, index) => {

        if (index === 0) {
            return;
        }

        const previousCard = cards[index - 1];

        /* Next card rises from below */
        timeline.fromTo(
            card,
            {
                y: () => window.innerHeight * 0.75,
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

        /* Previous card settles slightly backward */
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

        /* Small cinematic pause */
        timeline.to(
            {},
            {
                duration: 0.35
            }
        );
    });

});