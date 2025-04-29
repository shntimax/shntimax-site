window.addEventListener("load", () => {
    const gallery = document.querySelector(".photo-gallery");
    if (!gallery) return;
  
    // Force a reflow to ensure masonry layout applies after images load
    gallery.style.display = "none";
    gallery.offsetHeight; // Trigger reflow
    gallery.style.display = "block";
  });