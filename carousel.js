window.onload = () => {
  gsap.registerPlugin(ScrollTrigger);

  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  if (!track || items.length === 0) {
    console.error("Track or items not found!");
    return;
  }

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
};