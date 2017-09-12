import imgixImagesLoaded from '../../web/static/js/imgixImagesLoaded';

describe('imgixImagesLoaded()', function () {

  var foo = {
    bar: function () {
      //do nothing
      console.log("foobar");
    }
  }

  window.imagesLoaded = function imagesLoaded( img, callback ) {
    callback();
  }
  var img; 
  
  beforeEach(function () {
    img = document.createElement("img");
    document.body.appendChild(img);
    setTimeout(function () {
      img.setAttribute("src", "//image.com/1");
    }, 500);
  });

  it("should call callback when src attribute appears", function (done) {
    spyOn(foo, 'bar');

    spyOn(window, 'imagesLoaded').and.callFake(function(img, callback) {
      callback();
    });
    var images = document.querySelectorAll('img');
    imgixImagesLoaded(images, () => {
      foo.bar();
    });
    
    setTimeout(function() {
      done();
      expect(foo.bar).toHaveBeenCalled();
    }, 1000);
  });
});
