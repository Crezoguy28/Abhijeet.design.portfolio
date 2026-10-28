/* =========================================================
   WORK PAGE — CAROUSEL + WEBSITE PREVIEWS
   File: js/pages/work.js
   ========================================================= */

(() => {
    "use strict";

    function initWorkPage() {
        /* =====================================================
           1. PROJECT CAROUSEL
        ===================================================== */

        const stage = document.querySelector("#work-stage");
        const carousel = document.querySelector("#work-carousel");

        if (stage && carousel) {
            const allCards = Array.from(
                carousel.querySelectorAll(".work-card")
            );

            const filters = Array.from(
                document.querySelectorAll(".work-filter")
            );

            const prevButton = document.querySelector("#work-prev");
            const nextButton = document.querySelector("#work-next");
            const replayButton = document.querySelector("#work-replay");
            const resetButton = document.querySelector("#work-close");

            let activeFilter = "all";
            let visibleCards = [...allCards];
            let activeIndex = 0;

            let pointerStartX = 0;
            let pointerStartY = 0;
            let isDragging = false;
            let hasDragged = false;
            let suppressClick = false;
            let suppressClickFrame = 0;

            const DRAG_THRESHOLD = 45;

            function renderCarousel() {
                const total = visibleCards.length;

                allCards.forEach((card) => {
                    card.style.zIndex = "";
                });

                if (!total) {
                    if (prevButton) prevButton.hidden = true;
                    if (nextButton) nextButton.hidden = true;
                    return;
                }

                activeIndex =
                    ((activeIndex % total) + total) % total;

                visibleCards.forEach((card, index) => {
                    let position = index - activeIndex;

                    if (position > total / 2) position -= total;
                    if (position < -total / 2) position += total;

                    card.dataset.position =
                        Math.abs(position) > 2
                            ? "hidden"
                            : String(position);

                    card.classList.toggle(
                        "is-featured",
                        position === 0
                    );

                    card.setAttribute(
                        "aria-current",
                        position === 0 ? "true" : "false"
                    );

                    card.style.zIndex =
                        position === 0 ? "6" : "";
                });

                const showNavigation = total > 1;

                if (prevButton) {
                    prevButton.hidden = !showNavigation;
                }

                if (nextButton) {
                    nextButton.hidden = !showNavigation;
                }
            }

            function goNext() {
                if (visibleCards.length < 2) return;

                activeIndex++;
                renderCarousel();
            }

            function goPrevious() {
                if (visibleCards.length < 2) return;

                activeIndex--;
                renderCarousel();
            }

            if (nextButton) {
                nextButton.addEventListener("click", goNext);
            }

            if (prevButton) {
                prevButton.addEventListener("click", goPrevious);
            }

            allCards.forEach((card) => {
                card.addEventListener("click", () => {
                    if (suppressClick) {
                        suppressClick = false;
                        return;
                    }

                    const index = visibleCards.indexOf(card);

                    if (index === -1) return;

                    activeIndex = index;
                    renderCarousel();
                });
            });

            /* Drag and swipe */

            stage.addEventListener("pointerdown", (event) => {
                if (
                    event.target.closest(
                        ".work-arrow, .work-control, .work-filter"
                    )
                ) {
                    return;
                }

                pointerStartX = event.clientX;
                pointerStartY = event.clientY;
                isDragging = true;
                hasDragged = false;
            });

            stage.addEventListener("pointermove", (event) => {
                if (!isDragging) return;

                const deltaX = event.clientX - pointerStartX;
                const deltaY = event.clientY - pointerStartY;

                if (
                    Math.abs(deltaX) > 8 &&
                    Math.abs(deltaX) > Math.abs(deltaY)
                ) {
                    hasDragged = true;
                }
            });

            function finishDrag(event) {
                if (!isDragging) return;

                isDragging = false;

                const deltaX = event.clientX - pointerStartX;
                const deltaY = event.clientY - pointerStartY;

                if (
                    hasDragged &&
                    Math.abs(deltaX) > DRAG_THRESHOLD &&
                    Math.abs(deltaX) > Math.abs(deltaY)
                ) {
                    suppressClick = true;

                    if (deltaX < 0) {
                        goNext();
                    } else {
                        goPrevious();
                    }

                    if (suppressClickFrame) {
                        cancelAnimationFrame(suppressClickFrame);
                    }

                    suppressClickFrame = requestAnimationFrame(() => {
                        suppressClickFrame = requestAnimationFrame(() => {
                            suppressClick = false;
                            suppressClickFrame = 0;
                        });
                    });
                }

                hasDragged = false;
            }

            stage.addEventListener("pointerup", finishDrag);
            stage.addEventListener("pointercancel", finishDrag);

            /* Category filters */

            function applyFilter(filter) {
                activeFilter = filter;

                filters.forEach((button) => {
                    const isActive =
                        button.dataset.filter === filter;

                    button.classList.toggle("is-active", isActive);

                    button.setAttribute(
                        "aria-pressed",
                        isActive ? "true" : "false"
                    );
                });

                visibleCards = allCards.filter((card) => {
                    return (
                        filter === "all" ||
                        card.dataset.category === filter
                    );
                });

                allCards.forEach((card) => {
                    card.hidden = !visibleCards.includes(card);
                    card.dataset.position = "hidden";
                    card.setAttribute("aria-current", "false");
                    card.style.zIndex = "";
                });

                activeIndex = 0;
                renderCarousel();
            }

            filters.forEach((button) => {
                button.addEventListener("click", () => {
                    applyFilter(button.dataset.filter || "all");
                });
            });

            /* Replay animation */

            function replayAnimation() {
                stage.classList.remove("is-replaying");
                void stage.offsetWidth;
                stage.classList.add("is-replaying");

                window.setTimeout(() => {
                    stage.classList.remove("is-replaying");
                }, 750);
            }

            if (replayButton) {
                replayButton.addEventListener(
                    "click",
                    replayAnimation
                );
            }

            /* Reset carousel */

            if (resetButton) {
                resetButton.addEventListener("click", () => {
                    applyFilter("all");

                    const kioskIndex = visibleCards.findIndex(
                        (card) =>
                            card.dataset.project === "perfect-kiosk"
                    );

                    activeIndex =
                        kioskIndex >= 0
                            ? kioskIndex
                            : Math.max(
                                0,
                                Math.min(2, visibleCards.length - 1)
                            );

                    renderCarousel();
                    replayAnimation();
                });
            }

            /* Initialize carousel */

            allCards.forEach((card) => {
                card.hidden = false;
            });

            applyFilter(activeFilter);

            const initialIndex = visibleCards.findIndex(
                (card) =>
                    card.dataset.project === "perfect-kiosk"
            );

            activeIndex =
                initialIndex >= 0
                    ? initialIndex
                    : Math.max(
                        0,
                        Math.min(2, visibleCards.length - 1)
                    );

            renderCarousel();
        }

        /* =====================================================
           2. WEBSITE SCREENSHOT HOVER SCROLL

           - Automatically scrolls the screenshot on hover.
           - Uses a linear animation for consistent speed.
           - Smoothly returns to the top on pointer leave.
           - Does not intercept wheel or trackpad events.
        ===================================================== */

        const section = document.querySelector("#selected-projects");

        const websiteCards = section
            ? Array.from(
                section.querySelectorAll(".work-card--website")
            )
            : [];

        websiteCards.forEach((card) => {
            const image = card.querySelector(
                ".work-card__website-image"
            );

            const viewport = card.querySelector(
                ".work-card__website-viewport"
            );

            if (!image || !viewport) return;

            let maxScroll = 0;
            let resizeObserver = null;
            let measurementFrame = 0;

            /*
             * Calculate how far the screenshot can travel vertically.
             */
            function measureScrollRange() {
                if (measurementFrame) {
                    cancelAnimationFrame(measurementFrame);
                }

                measurementFrame = requestAnimationFrame(() => {
                    measurementFrame = 0;

                    maxScroll = Math.max(
                        0,
                        image.offsetHeight - viewport.clientHeight
                    );

                    /*
                     * Reset before measuring/starting a new animation
                     * so previous transforms do not affect positioning.
                     */
                    image.style.transition = "none";
                    image.style.transform =
                        "translate3d(0, 0, 0)";

                    /*
                     * Force the browser to apply the reset before
                     * setting the next transition.
                     */
                    void image.offsetHeight;

                    if (viewport.matches(":hover")) {
                        startPreviewScroll();
                    }
                });
            }

            /*
             * Automatically move from the top to the bottom.
             * Increase the speed by lowering SPEED_PIXELS_PER_SECOND.
             */
            function startPreviewScroll() {
                if (maxScroll <= 1) return;

                const SPEED_PIXELS_PER_SECOND = 150;

                const duration = Math.max(
                    1.5,
                    maxScroll / SPEED_PIXELS_PER_SECOND
                );

                image.style.transition =
                    `transform ${duration}s linear`;

                image.style.transform =
                    `translate3d(0, -${maxScroll}px, 0)`;
            }

            /*
             * Smoothly return to the screenshot's starting position.
             */
            function resetToTop() {
                image.style.transition =
                    "transform 0.55s ease-out";

                image.style.transform =
                    "translate3d(0, 0, 0)";
            }

            image.style.willChange = "transform";
            image.style.transform = "translate3d(0, 0, 0)";

            /*
             * Wait until the image is loaded before measuring its height.
             */
            if (image.complete && image.naturalWidth > 0) {
                requestAnimationFrame(measureScrollRange);
            } else {
                image.addEventListener(
                    "load",
                    measureScrollRange,
                    { once: true }
                );
            }

            image.addEventListener("error", () => {
                card.classList.add("has-preview-image-error");
            });

            viewport.addEventListener(
                "pointerenter",
                startPreviewScroll
            );

            viewport.addEventListener(
                "pointerleave",
                resetToTop
            );

            viewport.addEventListener(
                "pointercancel",
                resetToTop
            );

            /*
             * Recalculate when the viewport or image dimensions change.
             */
            if ("ResizeObserver" in window) {
                resizeObserver = new ResizeObserver(
                    measureScrollRange
                );

                resizeObserver.observe(viewport);
                resizeObserver.observe(image);
            } else {
                window.addEventListener(
                    "resize",
                    measureScrollRange
                );
            }
        });

        /* =====================================================
           3. WEBSITE PREVIEW MODAL
        ===================================================== */

        const modal = document.querySelector(
            "#work-preview-modal"
        );

        if (!section || !modal) return;

        const dialog = modal.querySelector(
            ".work-preview-modal__dialog"
        );

        const title = modal.querySelector(
            "#work-preview-title"
        );

        const frame = modal.querySelector(
            "#work-preview-frame"
        );

        const fallback = modal.querySelector(
            ".work-preview-modal__fallback"
        );

        const closeButtons = modal.querySelectorAll(
            "[data-close-preview]"
        );

        let previousFocus = null;
        let previousBodyOverflow = "";

        const websiteProjects = {
            intraceller: {
                title: "IntraCeller",
                url: ""
            },

            believ8: {
                title: "Believ8",
                url: ""
            }
        };

        function openPreview(projectKey, trigger) {
            const project = websiteProjects[projectKey];

            if (
                !project ||
                !dialog ||
                !title ||
                !frame ||
                !fallback
            ) {
                return;
            }

            previousFocus = trigger;
            title.textContent = project.title;

            frame.src = "about:blank";
            frame.hidden = true;

            fallback.replaceChildren();
            fallback.hidden = false;

            const card = trigger.closest(
                ".work-card--website"
            );

            const sourceImage = card
                ? card.querySelector(
                    ".work-card__website-image"
                )
                : null;

            if (project.url) {
                frame.hidden = false;
                fallback.hidden = true;
                frame.src = project.url;
            } else if (
                sourceImage &&
                sourceImage.currentSrc
            ) {
                const previewImage =
                    document.createElement("img");

                previewImage.src = sourceImage.currentSrc;

                previewImage.alt =
                    `${project.title} website preview`;

                Object.assign(previewImage.style, {
                    display: "block",
                    width: "100%",
                    maxWidth: "1200px",
                    height: "auto",
                    maxHeight: "75vh",
                    objectFit: "contain",
                    objectPosition: "top center",
                    margin: "0 auto",
                    borderRadius: "10px"
                });

                fallback.appendChild(previewImage);

                const note = document.createElement("p");

                note.textContent =
                    "Screenshot preview — live website URL not configured.";

                Object.assign(note.style, {
                    textAlign: "center",
                    marginTop: "12px",
                    fontSize: "13px",
                    opacity: "0.7"
                });

                fallback.appendChild(note);
            } else {
                const message =
                    document.createElement("p");

                message.textContent =
                    "Website screenshot unavailable. Check the project's image path.";

                fallback.appendChild(message);
            }

            previousBodyOverflow =
                document.body.style.overflow;

            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");

            document.body.classList.add(
                "work-preview-open"
            );

            document.body.style.overflow = "hidden";

            dialog.focus();
        }

        function closePreview() {
            if (!modal.classList.contains("is-open")) {
                return;
            }

            modal.classList.remove("is-open");

            modal.setAttribute("aria-hidden", "true");

            document.body.classList.remove(
                "work-preview-open"
            );

            document.body.style.overflow =
                previousBodyOverflow;

            frame.src = "about:blank";

            if (
                previousFocus &&
                typeof previousFocus.focus === "function"
            ) {
                previousFocus.focus();
            }
        }

        section.querySelectorAll("[data-preview]").forEach(
            (button) => {
                button.addEventListener("click", () => {
                    openPreview(
                        button.dataset.preview,
                        button
                    );
                });
            }
        );

        closeButtons.forEach((button) => {
            button.addEventListener(
                "click",
                closePreview
            );
        });

        document.addEventListener("keydown", (event) => {
            if (!modal.classList.contains("is-open")) {
                return;
            }

            if (event.key === "Escape") {
                closePreview();
                return;
            }

            if (event.key !== "Tab") return;

            const focusable = Array.from(
                modal.querySelectorAll(
                    'button:not([disabled]), a[href], iframe:not([hidden])'
                )
            ).filter(
                (element) => element.offsetParent !== null
            );

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        });
    }

    /* =====================================================
       4. INITIALIZE
    ===================================================== */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initWorkPage,
            { once: true }
        );
    } else {
        initWorkPage();
    }
})();