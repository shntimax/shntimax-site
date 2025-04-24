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

  // Set up seamless infinite looping
  const totalHeight = track.scrollHeight / 2; // Height of original items
  gsap.to(track, {
    y: `-=${totalHeight}px`,
    ease: "none",
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: () => `+=${totalHeight}`,
      scrub: true,
      pin: true,
      modifiers: {
        y: (y) => {
          const yNum = parseFloat(y);
          return ((yNum % totalHeight) + totalHeight) % totalHeight - totalHeight;
        },
      },
    },
  });

  // Enlarge effect for items in the middle (apply to all items, including clones)
  const allItems = document.querySelectorAll(".story-item");
  allItems.forEach((item) => {
    gsap.to(item, {
      scale: 1.3, // Slightly larger scaling for visibility
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: item,
        start: "top center", // Start scaling when item reaches center
        end: "bottom center", // End when it leaves center
        scrub: 0.5, // Smoother scaling
      },
    });
  });

  // Handle trackpad scrolling
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    container.scrollTop += e.deltaY;
  });
});