window.addEventListener("load", () => {

    gsap.registerPlugin(
        ScrollTrigger,
        ScrollSmoother
    );

    const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",

        smooth: 1.4,
        effects: true,
        normalizeScroll: true,
        smoothTouch: 0.1
    });

    ScrollTrigger.refresh();

});