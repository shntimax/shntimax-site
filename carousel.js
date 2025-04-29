window.addEventListener("load", () => {
  const container = document.querySelector(".stories-container");
  const track = document.querySelector(".stories-track");
  const items = document.querySelectorAll(".story-item");

  // Only proceed if we're on the stories page (where .stories-container exists)
  if (!container || !track || items.length === 0) {
    return; // Exit if not on the stories page
  }

  // Prepare items for infinite looping
  const allItems = Array.from(items);
  const itemCount = allItems.length;
  const itemHeights = allItems.map(item => item.getBoundingClientRect().height);
  const gap = 200; // Gap between items
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

      // Calculate text opacity (1 at center, 0 at top/bottom)
      const textOpacity = 1 - distanceFromCenter;

      // Infinite loop: reposition items as they move out of view
      let shouldReposition = false;
      if (itemTop > viewportHeight + itemRect.height) {
        positions[index] -= totalCycleHeight;
        shouldReposition = true;
      } else if (itemTop < -itemRect.height - 100) {
        positions[index] += totalCycleHeight;
        shouldReposition = true;
      }

      // Update the item's position instantly to avoid intermediate states
      if (shouldReposition) {
        const newTop = positions[index] - container.getBoundingClientRect().top;
        const newCenter = newTop + itemRect.height / 2;
        const newDistanceFromCenter = Math.abs(newCenter - viewportHeight / 2) / (viewportHeight / 2);
        const newScale = 1 + (0.3 * (1 - newDistanceFromCenter));
        const newCurveOffset = 100 * (1 - newDistanceFromCenter * newDistanceFromCenter);

        gsap.set(item, {
          y: positions[index],
          x: newCurveOffset,
          scale: newScale,
        });
        gsap.set(item.querySelector(".story-text"), { opacity: 0 });
      } else {
        gsap.to(item, {
          y: positions[index],
          scale: scale,
          x: curveOffset,
          duration: 0.3,
          ease: "power1.out",
          overwrite: true,
        });
        gsap.to(item.querySelector(".story-text"), {
          opacity: textOpacity,
          duration: 0.3,
          ease: "power1.out",
          overwrite: true,
        });
      }
    });
  };

  // Handle trackpad scrolling (desktop)
  let scrollVelocity = 0;
  container.addEventListener("wheel", (e) => {
    e.preventDefault(); // Prevent default scrolling only on the stories container
    const delta = e.deltaY * 0.5; // Adjust scroll speed
    scrollVelocity = delta;

    positions = positions.map(pos => pos - scrollVelocity);
    updateItems();
  });

  // Handle touch scrolling (mobile)
  let touchStartY = 0;
  let touchLastY = 0;
  container.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
    touchLastY = touchStartY;
  });

  container.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Prevent default scrolling only on the stories container
    const touchY = e.touches[0].clientY;
    const delta = (touchLastY - touchY) * 0.5; // Adjust touch sensitivity
    scrollVelocity = delta;

    positions = positions.map(pos => pos - scrollVelocity);
    updateItems();

    touchLastY = touchY;
  });

  container.addEventListener("touchend", () => {
    scrollVelocity = 0; // Reset velocity on touch end
  });

  // Initial update
  updateItems();
});