document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  // Set up vertical scrolling motion
  gsap.to(track, {
    y: () => -(track.scrollHeight - window.innerHeight),
    ease: "none",
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: () => `+=${track.scrollHeight - window.innerHeight}`,
      scrub: true,
      pin: true,
    },
  });

  // Enlarge effect for items in the middle
  items.forEach((item) => {
    gsap.to(item, {
      scale: 1.2, // Enlarge to 120% when centered
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: item,
        start: "top 80%", // Start scaling when item reaches 80% from top
        end: "top 20%",   // Peak at 50%, then shrink
        scrub: true,
        toggleActions: "play reverse play reverse",
      },
    });
  });
});