export const HasClass = (el, classToCheck) => {
    return el.classList.contains(classToCheck);
  };
  
export const SetVendors = (element, property, value) => {
    element.style['-webkit-' + property] = value;
    element.style['-moz-' + property] = value;
    element.style['-ms-' + property] = value;
    element.style['-o-' + property] = value;
    element.style[property] = value;
};
