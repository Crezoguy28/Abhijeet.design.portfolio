/* =========================================================
   10. EXPERIENCE
   Desktop:
   - Left sidebar stays centered in viewport
   - Right content scrolls normally
   - Pin ends when the right content reaches the
     bottom boundary of the left sidebar

   Tablet / Mobile:
   - No pinning
   - Normal document flow
========================================================= */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    const section =
        document.querySelector(".experience");

    const sidebar =
        document.querySelector(".experience-sidebar");

    if (!section || !sidebar) return;


    const mm = gsap.matchMedia();


    /* =====================================================
       DESKTOP ONLY
       >=1025px
    ===================================================== */

    mm.add("(min-width: 1025px)", () => {

        const getEndDistance = () => {

            const sectionHeight =
                section.offsetHeight;

            const viewportCenter =
                window.innerHeight / 2;

            const sidebarHeight =
                sidebar.offsetHeight;

            /*
             * Sidebar is centered in viewport.
             *
             * Pin must stop when the bottom of the
             * experience section reaches the bottom
             * edge of the centered sidebar.
             */

            return Math.max(
                0,
                sectionHeight -
                viewportCenter -
                (sidebarHeight / 2)
            );
        };


        const pinTrigger =
            ScrollTrigger.create({

                trigger: section,

                /*
                 * Put sidebar exactly at the
                 * vertical center of viewport.
                 */

                start: "top 30%",

                /*
                 * Dynamic end based on actual
                 * section + sidebar dimensions.
                 */

                end: () => {
                    return `+=${getEndDistance()}`;
                },

                pin: sidebar,

                pinSpacing: false,

                anticipatePin: 1,

                invalidateOnRefresh: true

            });


        /*
         * Recalculate after layout/images/fonts
         * have finished loading.
         */

        requestAnimationFrame(() => {

            pinTrigger.refresh();

            ScrollTrigger.refresh();

        });


        window.addEventListener(
            "load",
            () => {

                pinTrigger.refresh();

                ScrollTrigger.refresh();

            },
            { once: true }
        );


        /*
         * Cleanup when switching below breakpoint.
         */

        return () => {

            pinTrigger.kill();

        };

    });


    /* =====================================================
       GLOBAL REFRESH
    ===================================================== */

    window.addEventListener(
        "load",
        () => {

            ScrollTrigger.refresh();

        },
        { once: true }
    );

});