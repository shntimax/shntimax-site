document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const container = document.querySelector(".stories-container");
  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  if (!container || !track || items.length === 0) {
    console.error("Container, track, or items not found!");
    return;
  }

  // Clone items for infinite looping (double the content)
  const itemCount = items.length;
  for (let i = 0; i < itemCount; i++) {
    const clone = items[i].cloneNode(true);
    track.appendChild(clone);
  }

  // Set up seamless infinite looping
  const totalHeight = track.scrollHeight / 2; // Height of original items
  let scrollPos = 0;

  gsap.to(track, {
    y: () => -(totalHeight),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: () => `+=${totalHeight}`,
      scrub: true,
      pin: true,
      onUpdate: (self) => {
        scrollPos = self.progress * totalHeight;
        if (scrollPos >= totalHeight) {
          gsap.set(track, { y: 0 }); // Reset position
          self.progress = 0; // Reset scroll progress
        }
      },
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
        start: "top 70%", // Start scaling earlier
        end: "top 30%",   // Peak at middle, then shrink
        scrub: 1,         // Smooth scaling tied to scroll
        toggleActions: "play reverse play reverse",
        markers: false,   // Set to true for debugging
      },
    });
  });

  // Handle trackpad scrolling
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    container.scrollTop += e.deltaY;
  });
});