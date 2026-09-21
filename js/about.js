/* =========================================================
   ABOUT
   Lightweight viewport reveal

   Desktop + mobile use the same lightweight reveal.
   No heavy desktop animation is required here.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const about =
        document.querySelector(".about");

    if (!about) {
        return;
    }


    const elements = [
        ...about.querySelectorAll(
            ".about-header, .about-image-reveal, .about-content"
        )
    ];


    if (!elements.length) {
        return;
    }


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reducedMotion) {

        elements.forEach(element => {
            element.classList.add("is-visible");
        });

        return;
    }


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    elements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(30px)";

        element.style.transition =
            "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), " +
            "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";

    });


    /* =====================================================
       VIEWPORT OBSERVER
    ===================================================== */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.style.opacity =
                        "1";


                    entry.target.style.transform =
                        "translateY(0)";


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -8% 0px"
            }
        );


    elements.forEach(
        element => observer.observe(element)
    );

});