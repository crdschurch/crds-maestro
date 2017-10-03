/* Work around for timing issue in which Flickity ImagesLoaded initializes
 * before Imgix has created src attributes on img tags, therefore it doesn't
 * correctly resize the cards after Imgix is finished.  So detect that and callback */

/* global imagesLoaded */

export default function (images, callback) {
  function forEach(array, callbackfunc) {
    for (let i = 0; i < array.length; i += 1) {
      callbackfunc.call(this, i, array[i]);
    }
  }

  forEach(images, (index, img) => {
    console.log(img);
    const attributeCheck = setInterval(() => {
      if (img.hasAttribute('src')) {
        clearInterval(attributeCheck);
        imagesLoaded(img, callback);
      }
    }, 100);
  });
}
