/* Work around for timing issue in which Flickity ImagesLoaded initializes
 * before Imgix has created src attributes on img tags, therefore it doesn't
 * correctly resize the cards after Imgix is finished.  So detect that and callback */

/* global imagesLoaded */

export default function (images, callback) {
  images.forEach((img) => {
    const attributeCheck = setInterval(() => {
      if (img.hasAttribute('src')) {
        clearInterval(attributeCheck);
        imagesLoaded(img, () => {
          callback();
        });
      }
    }, 100);
  });
}
