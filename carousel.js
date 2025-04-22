document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const container = document.querySelector(".stories-container");
  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  if (!container || !track || items.length === 0) {
    console.error("Container, track, or items not found!");
    return;
  }

  // Set up vertical scrolling motion with GSAP
  gsap.to(track, {
    y: () => -(track.scrollHeight - container.clientHeight),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: () => `+=${track.scrollHeight - container.clientHeight}`,
      scrub: true,
      pin: true,
    },
  });

  // Enlarge effect for items in the middle
  items.forEach((item) => {
    gsap.to(item, {
      scale: 1.2,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
        toggleActions: "play reverse play reverse",
      },
    });
  });

  // Add wheel event listener for trackpad support
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    container.scrollTop += e.deltaY; // Adjust scroll position based on trackpad input
  });
});