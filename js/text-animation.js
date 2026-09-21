/* =========================================================
   TEXT REVEAL ANIMATION
   Word-based cinematic reveal
========================================================= */

window.addEventListener("load", () => {

    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);


    /* =====================================================
       HERO — CINEMATIC LOAD REVEAL

       Hello I'm → Product → Designer → Crezoguy
    ===================================================== */

    const heroEyebrow =
        document.querySelector("#hero-eyebrow");

    const heroTitles =
        document.querySelectorAll(".hero-reveal");

    const heroBrand =
        document.querySelector("#hero-brand");

    const heroTimeline =
        gsap.timeline();


    /* -----------------------------------------------------
       HELLO I'M
    ----------------------------------------------------- */

    if (heroEyebrow) {

        gsap.set(heroEyebrow, {
            opacity: 0,
            y: 35,
            scale: 0.96,
            filter: "blur(8px)"
        });

        heroTimeline.to(heroEyebrow, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",

            duration: 1.1,

            ease: "power3.out"
        });
    }


    /* -----------------------------------------------------
       PRODUCT + DESIGNER
    ----------------------------------------------------- */

    if (heroTitles.length) {

        gsap.set(heroTitles, {
            opacity: 0,
            y: 90,
            scale: 0.94,
            filter: "blur(10px)"
        });

        heroTimeline.to(heroTitles, {

            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",

            duration: 1.4,

            stagger: 0.22,

            ease: "power4.out"

        }, "-=0.05");
    }


    /* -----------------------------------------------------
       CREZOGUY
    ----------------------------------------------------- */

    if (heroBrand) {

        gsap.set(heroBrand, {
            opacity: 0,
            y: 40,
            scale: 0.96,
            filter: "blur(8px)"
        });

        heroTimeline.to(heroBrand, {

            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",

            duration: 1.1,

            ease: "power3.out"

        }, "-=0.05");
    }


    /* =====================================================
       GENERAL TEXT REVEAL
       WORD BASED — NEVER CHARACTER BASED
    ===================================================== */

    const elements = document.querySelectorAll(
        ".text-reveal, .section-title"
    );


    /* =====================================================
       SPLIT TEXT INTO WORDS
       Preserves nested HTML such as:

       <span class="highlight">...</span>

       This is important for gradient text.
    ===================================================== */

    function splitTextIntoWords(element) {

        if (
            element.dataset.wordsSplit === "true"
        ) {
            return Array.from(
                element.querySelectorAll(
                    ".text-reveal-word"
                )
            );
        }


        const originalHTML =
            element.innerHTML;

        const temp =
            document.createElement("div");

        temp.innerHTML =
            originalHTML;


        const words = [];


        function processNode(node) {

            /* -----------------------------------------
               TEXT NODE
            ----------------------------------------- */

            if (
                node.nodeType ===
                Node.TEXT_NODE
            ) {

                return node.textContent
                    .split(/(\s+)/)
                    .map(part => {

                        if (
                            /^\s+$/.test(part)
                        ) {
                            return document.createTextNode(
                                part
                            );
                        }

                        if (!part) {
                            return document.createTextNode("");
                        }


                        const span =
                            document.createElement(
                                "span"
                            );

                        span.className =
                            "text-reveal-word";

                        span.textContent =
                            part;

                        span.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                        words.push(span);

                        return span;
                    });
            }


            /* -----------------------------------------
               ELEMENT NODE
            ----------------------------------------- */

            if (
                node.nodeType ===
                Node.ELEMENT_NODE
            ) {

                const wrapper =
                    document.createElement(
                        node.tagName
                    );


                [...node.attributes].forEach(
                    attribute => {

                        wrapper.setAttribute(
                            attribute.name,
                            attribute.value
                        );

                    }
                );


                [...node.childNodes].forEach(
                    child => {

                        processNode(child)
                            .forEach(result => {

                                wrapper.appendChild(
                                    result
                                );

                            });

                    }
                );


                return [wrapper];
            }


            return [];
        }


        element.innerHTML = "";


        [...temp.childNodes].forEach(
            node => {

                processNode(node)
                    .forEach(result => {

                        element.appendChild(
                            result
                        );

                    });

            }
        );


        element.dataset.wordsSplit =
            "true";


        element.setAttribute(
            "aria-label",
            element.textContent.trim()
        );


        return words;
    }


    /* =====================================================
       APPLY GENERAL WORD REVEAL
    ===================================================== */

    elements.forEach(element => {

        /*
         * Don't process hero load-reveal elements again.
         */

        if (
            element.closest(".hero-heading")
        ) {
            return;
        }


        const words =
            splitTextIntoWords(element);


        if (!words.length) {
            return;
        }


        gsap.set(words, {

            y: 24,

            opacity: 0,

            filter: "blur(6px)"
        });


        gsap.to(words, {

            y: 0,

            opacity: 1,

            filter: "blur(0px)",

            duration: 0.75,

            stagger: 0.075,

            ease: "power3.out",

            scrollTrigger: {

                trigger: element,

                start: "top 90%",

                toggleActions:
                    "play none none reverse",

                invalidateOnRefresh: true
            }
        });

    });


    /* =====================================================
       ABOUT SECTION — WORD REVEAL
    ===================================================== */

    const aboutSection =
        document.querySelector(".about");


    if (aboutSection) {

        const aboutHeading =
            aboutSection.querySelector(
                ".content-title"
            );


        if (aboutHeading) {

            const originalHTML =
                aboutHeading.innerHTML;


            const temp =
                document.createElement("div");

            temp.innerHTML =
                originalHTML;


            const headingWords = [];


            function processAboutNode(node) {

                if (
                    node.nodeType ===
                    Node.TEXT_NODE
                ) {

                    return node.textContent
                        .split(/(\s+)/)
                        .map(part => {

                            if (
                                /^\s+$/.test(part)
                            ) {
                                return document.createTextNode(
                                    part
                                );
                            }


                            const span =
                                document.createElement(
                                    "span"
                                );

                            span.className =
                                "about-heading-word";

                            span.textContent =
                                part;

                            headingWords.push(
                                span
                            );

                            return span;

                        });
                }


                if (
                    node.nodeType ===
                    Node.ELEMENT_NODE
                ) {

                    const wrapper =
                        document.createElement(
                            node.tagName
                        );


                    [...node.attributes].forEach(
                        attribute => {

                            wrapper.setAttribute(
                                attribute.name,
                                attribute.value
                            );

                        }
                    );


                    [...node.childNodes].forEach(
                        child => {

                            processAboutNode(child)
                                .forEach(result => {

                                    wrapper.appendChild(
                                        result
                                    );

                                });

                        }
                    );


                    return [wrapper];
                }


                return [];
            }


            aboutHeading.innerHTML = "";


            [...temp.childNodes].forEach(
                node => {

                    processAboutNode(node)
                        .forEach(result => {

                            aboutHeading.appendChild(
                                result
                            );

                        });

                }
            );


            const highlightedWords =
                aboutHeading.querySelectorAll(
                    ".highlight"
                );


            const animationTargets = [
                ...headingWords,
                ...highlightedWords
            ];


            gsap.set(
                animationTargets,
                {
                    opacity: 0,
                    y: 18,
                    filter: "blur(5px)"
                }
            );


            gsap.to(
                animationTargets,
                {

                    opacity: 1,

                    y: 0,

                    filter: "blur(0px)",

                    duration: 0.8,

                    stagger: 0.06,

                    ease: "power2.out",

                    scrollTrigger: {

                        trigger:
                            aboutHeading,

                        start:
                            "top 90%",

                        toggleActions:
                            "play none none reverse",

                        invalidateOnRefresh:
                            true
                    }
                }
            );
        }


        /* =================================================
           ABOUT IMAGE
        ================================================= */

        const aboutImage =
            aboutSection.querySelector(
                ".about-image-reveal"
            );


        if (aboutImage) {

            gsap.set(
                aboutImage,
                {
                    opacity: 0,
                    scale: 0.92,
                    y: 30
                }
            );


            gsap.to(
                aboutImage,
                {

                    opacity: 1,

                    scale: 1,

                    y: 0,

                    duration: 1,

                    ease: "power3.out",

                    scrollTrigger: {

                        trigger:
                            aboutImage,

                        start:
                            "top 60%",

                        toggleActions:
                            "play none none reverse",

                        invalidateOnRefresh:
                            true
                    }
                }
            );
        }
    }


    /* =====================================================
       FINAL REFRESH
    ===================================================== */

    requestAnimationFrame(() => {

        ScrollTrigger.refresh();

    });

});