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
  const gap = 150; // Gap between items
  let positions = [];
  let cumulativeHeight = 0;

  // Calculate initial positions with proper gaps
  allItems.forEach((item, index) => {
    positions[index] = cumulativeHeight;
    cumulativeHeight += itemHeights[index] + gap;
  });

  // Total height of one full cycle (used for wrapping)
  const totalCycleHeight = cumulativeHeight;

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

      // Calculate position relative to viewport center (0 = center, 1 = top/bottom)
      const updatedTop = positions[index] - container.getBoundingClientRect().top;
      const updatedCenter = updatedTop + itemRect.height / 2;
      const distanceFromCenter = Math.abs(updatedCenter - viewportHeight / 2) / (viewportHeight / 2);
      const scale = 1 + (0.3 * (1 - distanceFromCenter)); // Scale from 1 to 1.3
      const curveOffset = 100 * (1 - distanceFromCenter * distanceFromCenter); // Curve radius

      // Infinite loop: reposition items as they move out of view
      let shouldReposition = false;
      if (itemTop > viewportHeight + itemRect.height) {
        // Item is below the viewport, move it to the top
        positions[index] -= totalCycleHeight;
        shouldReposition = true;
      } else if (itemTop < -itemRect.height - 100) {
        // Item is above the viewport, move it to the bottom
        positions[index] += totalCycleHeight;
        shouldReposition = true;
      }

      // Update the item's position instantly to avoid intermediate states
      if (shouldReposition) {
        // Recalculate position after repositioning
        const newTop = positions[index] - container.getBoundingClientRect().top;
        const newCenter = newTop + itemRect.height / 2;
        const newDistanceFromCenter = Math.abs(newCenter - viewportHeight / 2) / (viewportHeight / 2);
        const newScale = 1 + (0.3 * (1 - newDistanceFromCenter));
        const newCurveOffset = 100 * (1 - newDistanceFromCenter * newDistanceFromCenter);

        // Instantly set all properties to match the new position
        gsap.set(item, {
          y: positions[index],
          x: newCurveOffset,
          scale: newScale,
        });
      } else {
        // Smoothly animate the x position and scale for items not being repositioned
        gsap.to(item, {
          y: positions[index],
          scale: scale,
          x: curveOffset,
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