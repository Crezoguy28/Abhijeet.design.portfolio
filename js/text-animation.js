/* =========================================================
   TEXT REVEAL ANIMATION
   Reusable character-by-character scroll reveal
========================================================= */

window.addEventListener("load", () => {

    gsap.registerPlugin(ScrollTrigger);

    const elements = document.querySelectorAll(
        ".text-reveal, .section-title"
    );

    if (elements.length) {

        /* =====================================================
           SPLIT TEXT INTO CHARACTERS
        ===================================================== */

        elements.forEach((element) => {

            const text = element.textContent.trim();

            if (!text) return;

            element.setAttribute("aria-label", text);

            element.textContent = "";

            [...text].forEach((character) => {

                const span = document.createElement("span");

                span.textContent =
                    character === " "
                        ? "\u00A0"
                        : character;

                span.className = "text-reveal-char";

                span.setAttribute(
                    "aria-hidden",
                    "true"
                );

                element.appendChild(span);

            });


            /* =================================================
               GET CHARACTERS
            ================================================= */

            const chars = element.querySelectorAll(
                ".text-reveal-char"
            );


            /* =================================================
               INITIAL STATE
            ================================================= */

            gsap.set(chars, {
                y: 24,
                opacity: 0,
                filter: "blur(7px)"
            });


            /* =================================================
               SCROLL REVEAL
            ================================================= */

            gsap.to(chars, {

                y: 0,
                opacity: 1,
                filter: "blur(0px)",

                duration: 0.85,
                stagger: 0.018,

                ease: "power3.out",

                scrollTrigger: {

                    trigger: element,

                    start: "top 90%",

                    toggleActions:
                        "play none none reverse"
                }

            });

        });

    }


    /* =====================================================
       ABOUT SECTION — WORD REVEAL
    ===================================================== */

    const aboutSection =
        document.querySelector(".about");

    if (aboutSection) {

        /* -----------------------------------------
           ABOUT INTRO HEADING
        ----------------------------------------- */

        const aboutHeading =
            aboutSection.querySelector(".content-title");

        if (aboutHeading) {

            const originalHTML =
                aboutHeading.innerHTML;

            /*
             * Preserve the existing highlight element
             * while wrapping normal text into words.
             */

            const temp =
                document.createElement("div");

            temp.innerHTML = originalHTML;


            const processNode = (node) => {

                if (node.nodeType === Node.TEXT_NODE) {

                    return node.textContent
                        .split(/(\s+)/)
                        .map((part) => {

                            if (/^\s+$/.test(part)) {
                                return part;
                            }

                            const span =
                                document.createElement("span");

                            span.className =
                                "about-heading-word";

                            span.textContent = part;

                            return span;

                        });

                }


                if (node.nodeType === Node.ELEMENT_NODE) {

                    const wrapper =
                        document.createElement(
                            node.tagName
                        );

                    [...node.attributes].forEach(
                        (attr) => {

                            wrapper.setAttribute(
                                attr.name,
                                attr.value
                            );

                        }
                    );


                    [...node.childNodes].forEach(
                        (child) => {

                            processNode(child)
                                .forEach((result) => {

                                    wrapper.appendChild(
                                        typeof result === "string"
                                            ? document.createTextNode(result)
                                            : result
                                    );

                                });

                        }
                    );

                    return [wrapper];

                }

                return [];

            };


            aboutHeading.innerHTML = "";


            [...temp.childNodes].forEach(
                (node) => {

                    processNode(node)
                        .forEach((result) => {

                            aboutHeading.appendChild(
                                typeof result === "string"
                                    ? document.createTextNode(result)
                                    : result
                            );

                        });

                }
            );


            const headingWords =
                aboutHeading.querySelectorAll(
                    ".about-heading-word"
                );

            const highlightedWords =
                aboutHeading.querySelectorAll(
                    ".highlight"
                );


            /* -----------------------------------------
               INITIAL STATE
            ----------------------------------------- */

            gsap.set(
                [...headingWords, ...highlightedWords],
                {
                    opacity: 0,
                    y: 18,
                    filter: "blur(5px)"
                }
            );


            /* -----------------------------------------
               WORD REVEAL
            ----------------------------------------- */

            gsap.to(
                [...headingWords, ...highlightedWords],
                {

                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",

                    duration: 0.8,
                    stagger: 0.05,

                    ease: "power2.out",

                    scrollTrigger: {

                        trigger: aboutHeading,

                        start: "top 90%",

                        toggleActions:
                            "play none none reverse"
                    }

                }
            );

        }


        /* =====================================================
           ABOUT — IMAGE POP REVEAL
        ===================================================== */

        const aboutImage =
            aboutSection.querySelector(
                ".about-image-reveal"
            );

        if (aboutImage) {

            gsap.set(aboutImage, {
                opacity: 0,
                scale: 0.92,
                y: 30
            });


            gsap.to(aboutImage, {

                opacity: 1,
                scale: 1,
                y: 0,

                duration: 1,

                ease: "power3.out",

                scrollTrigger: {

                    trigger: aboutImage,

                    start: "top 60%",

                    toggleActions:
                        "play none none reverse"
                }

            });

        }

    }

});