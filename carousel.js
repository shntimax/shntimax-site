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

  // Set up infinite looping with trackpad control
  const totalHeight = track.scrollHeight / 3; // Height of original items
  let currentY = 0;

  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.5; // Adjust scroll speed
    currentY -= delta;

    // Seamless infinite loop
    if (currentY <= -totalHeight) {
      currentY += totalHeight; // Wrap to top
    } else if (currentY >= 0) {
      currentY -= totalHeight; // Wrap to bottom
    }

    gsap.set(track, { y: currentY });
  });

  // Enlarge effect for items (apply to all items, including clones)
  const allItems = document.querySelectorAll(".story-item");
  allItems.forEach((item) => {
    gsap.to(item, {
      scale: 1.3,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: item,
        start: "top 60%",
        end: "top 40%",
        scrub: 0.5,
        toggleActions: "play reverse play reverse",
        immediateRender: false,
      },
    });
  });

  // Refresh ScrollTrigger to account for cloned items
  ScrollTrigger.refresh();
});