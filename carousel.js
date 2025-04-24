window.addEventListener("load", () => {
  const container = document.querySelector(".stories-container");
  const previousItem = document.querySelector(".story-previous");
  const currentItem = document.querySelector(".story-current");
  const nextItem = document.querySelector(".story-next");

  if (!container || !previousItem || !currentItem || !nextItem) {
    console.error("Container or story items not found!", {
      container: !!container,
      previousItem: !!previousItem,
      currentItem: !!currentItem,
      nextItem: !!nextItem,
    });
    return;
  }

  // "Database" of stories
  const stories = [
    { href: "/blog/story1/", img: "https://via.placeholder.com/300x200?text=Story+1", text: "A peaceful sunset..." },
    { href: "/blog/story2/", img: "https://via.placeholder.com/300x200?text=Story+2", text: "A quiet morning..." },
    { href: "/blog/story3/", img: "https://via.placeholder.com/300x200?text=Story+3", text: "A starry night..." },
    { href: "/blog/story4/", img: "https://via.placeholder.com/300x200?text=Story+4", text: "A calm ocean..." },
  ];

  let currentIndex = 0;
  const totalStories = stories.length;

  // Function to update story content and positions
  const updateStories = () => {
    // Calculate indices for previous and next stories
    const previousIndex = (currentIndex - 1 + totalStories) % totalStories;
    const nextIndex = (currentIndex + 1) % totalStories;

    // Update content
    previousItem.href = stories[previousIndex].href;
    previousItem.querySelector("img").src = stories[previousIndex].img;
    previousItem.querySelector("p").textContent = stories[previousIndex].text;

    currentItem.href = stories[currentIndex].href;
    currentItem.querySelector("img").src = stories[currentIndex].img;
    currentItem.querySelector("p").textContent = stories[currentIndex].text;

    nextItem.href = stories[nextIndex].href;
    nextItem.querySelector("img").src = stories[nextIndex].img;
    nextItem.querySelector("p").textContent = stories[nextIndex].text;

    // Animate positions and scaling
    gsap.to(previousItem, {
      y: "-100%", // Move up so only the bottom corner is visible
      scale: 0.7,
      duration: 0.5,
      ease: "power1.out",
    });

    gsap.to(currentItem, {
      y: "0%", // Centered
      scale: 1.2, // Large in the middle
      duration: 0.5,
      ease: "power1.out",
    });

    gsap.to(nextItem, {
      y: "100%", // Move down so only the top corner is visible
      scale: 0.7,
      duration: 0.5,
      ease: "power1.out",
    });
  };

  // Handle trackpad scrolling
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY;

    if (delta > 0) {
      // Scroll down, move to next story
      currentIndex = (currentIndex + 1) % totalStories;
    } else if (delta < 0) {
      // Scroll up, move to previous story
      currentIndex = (currentIndex - 1 + totalStories) % totalStories;
    }

    updateStories();
  });

  // Initial update
  updateStories();
});