module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("carousel.js");
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};