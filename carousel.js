document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".stories-container");
  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  if (!container || !track || items.length === 0) {
    console.error("Container, track, or items not found!");
    return;
  }

  // Clone items for infinite looping
  const itemCount = items.length;
  const originalItems = Array.from(items);
  const originalHeight = originalItems.reduce((sum, item) => sum + item.getBoundingClientRect().height + 20, 0); // 20px gap
  for (let i = 0; i < itemCount * 2; i++) {
    const clone = originalItems[i % itemCount].cloneNode(true);
    track.appendChild(clone);
  }

  // Set up infinite looping with trackpad control
  const totalHeight = originalHeight; // Height of original items
  let currentY = 0;

  // Update positions and scaling for all items
  const updateItems = () => {
    const allItems = document.querySelectorAll(".story-item");
    const viewportHeight = container.clientHeight;

    allItems.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemTop = itemRect.top - container.getBoundingClientRect().top;
      const itemCenter = itemTop + itemRect.height / 2;

      // Reset x position if the item is off-screen
      if (itemTop < -itemRect.height || itemTop > viewportHeight) {
        gsap.set(item, { x: 0 });
      }

      // Calculate position relative to viewport center (0 = center, 1 = top/bottom)
      const distanceFromCenter = Math.abs(itemCenter - viewportHeight / 2) / (viewportHeight / 2);
      const scale = 1 + (0.3 * (1 - distanceFromCenter)); // Scale from 1 to 1.3
      const curveOffset = 50 * (1 - distanceFromCenter * distanceFromCenter); // Parabolic curve

      // Smoothly animate the x position and scale
      gsap.to(item, {
        scale: scale,
        x: curveOffset,
        duration: 0.3,
        ease: "power1.out",
      });
    });
  };

  // Handle trackpad scrolling
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.5; // Adjust scroll speed
    currentY -= delta;

    // Seamless infinite loop using modulo
    currentY = ((currentY % totalHeight) + totalHeight) % totalHeight - totalHeight;

    // Update track position smoothly
    gsap.to(track, {
      y: currentY,
      duration: 0.3,
      ease: "power1.out",
    });

    updateItems(); // Update scaling and position on scroll
  });

  // Initial update
  updateItems();
});