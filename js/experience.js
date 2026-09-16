gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".experience");
    const sidebar = document.querySelector(".experience-sidebar");

    if (!section || !sidebar) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
        const pinTrigger = ScrollTrigger.create({
            trigger: section,
            start: "top 120px",
            end: "bottom 90%",
            pin: sidebar,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true
        });

        requestAnimationFrame(() => {
            pinTrigger.refresh();
            ScrollTrigger.refresh();
        });

        return () => pinTrigger.kill();
    });

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
});