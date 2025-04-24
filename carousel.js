document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const container = document.querySelector(".stories-container");
  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  if (!container || !track || items.length === 0) {
    console.error("Container, track, or items not found!");
    return;
  }

  // Clone items for infinite looping
  const itemCount = items.length;
  for (let i = 0; i < itemCount * 2; i++) {
    const clone = items[i % itemCount].cloneNode(true);
    track.appendChild(clone);
  }

  // Set up infinite vertical scrolling
  const totalHeight = track.scrollHeight / 3; // Height of original items
  let scrollDirection = 1; // 1 for down, -1 for up

  const animateLoop = () => {
    gsap.to(track, {
      y: `+=${-totalHeight * scrollDirection}`,
      ease: "none",
      duration: 10,
      onComplete: () => {
        // Reset position seamlessly
        gsap.set(track, { y: 0 });
        animateLoop(); // Restart the animation
      },
    });
  };

  // Start the loop animation
  animateLoop();

  // Update scroll direction based on trackpad input
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    scrollDirection = e.deltaY > 0 ? 1 : -1; // Down or up
  });

  // Enlarge effect for items (apply to all items, including clones)
  const allItems = document.querySelectorAll(".story-item");
  allItems.forEach((item) => {
    gsap.to(item, {
      scale: 1.3,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: item,
        start: "top 60%", // Start scaling earlier
        end: "top 40%",   // Peak near center
        scrub: 0.5,
        toggleActions: "play reverse play reverse",
        immediateRender: false,
      },
    });
  });

  // Refresh ScrollTrigger to account for cloned items
  ScrollTrigger.refresh();
});