const generateElement = (type, elementClass, textContent, attributes) => {
  const element = document.createElement(type);
  if (elementClass) element.setAttribute('class', elementClass);
  if (textContent) element.textContent = textContent;
  for (let attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
  return element;
}

export default generateElement;