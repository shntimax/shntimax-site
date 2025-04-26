window.addEventListener("load", () => {
  const container = document.querySelector(".stories-container");
  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  if (!container || !track || items.length === 0) {
    console.error("Container, track, or items not found!");
    return;
  }

  // Prepare items for infinite looping
  const allItems = Array.from(items);
  const itemCount = allItems.length;
  const itemHeights = allItems.map(item => item.getBoundingClientRect().height);
  const gap = 40; // Gap between items (adjust as needed)
  let positions = [];
  let cumulativeHeight = 0;

  // Calculate initial positions with proper gaps
  allItems.forEach((item, index) => {
    positions[index] = cumulativeHeight;
    cumulativeHeight += itemHeights[index] + gap;
  });

  // Set initial positions
  allItems.forEach((item, index) => {
    gsap.set(item, { y: positions[index] });
  });

  // Update positions, scaling, and curved motion for all items
  const updateItems = () => {
    const viewportHeight = container.clientHeight;

    allItems.forEach((item, index) => {
      let itemY = positions[index];
      const itemRect = item.getBoundingClientRect();
      const itemTop = itemY - container.getBoundingClientRect().top;
      const itemCenter = itemTop + itemRect.height / 2;

      // Infinite loop: reposition items as they move out of view
      let newY = positions[index];
      let shouldReposition = false;

      if (itemTop > viewportHeight + itemRect.height) {
        // Item is below the viewport, move it to the top
        const topmostY = Math.min(...positions.filter((_, i) => i !== index));
        newY = topmostY - (itemRect.height + gap);
        shouldReposition = true;
      } else if (itemTop < -itemRect.height - 100) { // Increased buffer to ensure item is fully out of view
        // Item is above the viewport, move it to the bottom
        const bottommostY = Math.max(...positions.filter((_, i) => i !== index));
        newY = bottommostY + (itemRect.height + gap);
        shouldReposition = true;
      }

      if (shouldReposition) {
        // Instantly reposition the item while hidden
        gsap.set(item, { opacity: 0 });
        positions[index] = newY;
        gsap.set(item, { y: positions[index] });
        gsap.to(item, {
          opacity: 1,
          duration: 0.1,
          ease: "power1.out",
        });
      }

      // Calculate position relative to viewport center (0 = center, 1 = top/bottom)
      const updatedTop = positions[index] - container.getBoundingClientRect().top;
      const updatedCenter = updatedTop + itemRect.height / 2;
      const distanceFromCenter = Math.abs(updatedCenter - viewportHeight / 2) / (viewportHeight / 2);
      const scale = 1 + (0.3 * (1 - distanceFromCenter)); // Scale from 1 to 1.3
      const curveOffset = 100 * (1 - distanceFromCenter * distanceFromCenter); // Curve radius

      // Smoothly animate the x position and scale (only if not repositioning)
      if (!shouldReposition) {
        gsap.to(item, {
          x: curveOffset,
          scale: scale,
          duration: 0.3,
          ease: "power1.out",
          overwrite: true,
        });
      }
    });
  };

  // Handle trackpad scrolling
  let scrollVelocity = 0;
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.5; // Adjust scroll speed
    scrollVelocity = delta;

    // Update positions based on scroll
    positions = positions.map(pos => pos - scrollVelocity);

    updateItems(); // Update positions, scaling, and loop on scroll
  });

  // Initial update
  updateItems();
});