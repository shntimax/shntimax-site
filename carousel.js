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
  for (let i = 0; i < itemCount; i++) {
    const clone = items[i].cloneNode(true);
    track.appendChild(clone);
  }

  // Set up infinite vertical scrolling motion
  const totalHeight = track.scrollHeight / 2; // Half the height since we doubled the items
  gsap.to(track, {
    y: -totalHeight,
    ease: "none",
    repeat: -1, // Infinite loop
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: () => `+=${totalHeight}`,
      scrub: true,
      pin: true,
    },
  });

  // Enlarge effect for items in the middle (apply to all items, including clones)
  const allItems = document.querySelectorAll(".story-item");
  allItems.forEach((item) => {
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

  // Handle trackpad scrolling
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    container.scrollTop += e.deltaY;
  });
});