/**
 * Updated all svgs in the document to use an absolute URL to appease Firefox and IE
 */
export default function() {
  const baseUrl = window.location.href.replace(window.location.hash, "");
  [].slice.call(document.querySelectorAll("use[*|href]")).filter((element) => {
    var attr = element.getAttribute("xlink:href");
    return (attr !== null && attr.indexOf("#") === 0);
  }).forEach((element) => {
    element.setAttribute("xlink:href", `${baseUrl}${element.getAttribute("xlink:href")}`);
  });
}
