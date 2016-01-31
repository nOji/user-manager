/*
|--------------------------------------------------------------------------
| DOM Manipulation Helper Functions
| From TodoMVC Source Code
|--------------------------------------------------------------------------
|
*/
(function (window) {
  'use strict';

  // Get element(s) by CSS selector:
  window._qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };
  window._qsa = function (selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  // addEventListener wrapper:
  window._on = function (target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
  };

  // Attach a handler to event for all elements that match the selector,
  // now or in the future, based on a root element
  window._delegate = function (target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target;
      var potentialElements = window._qsa(selector, target);
      var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

      if (hasMatch) {
        handler.call(targetElement, event);
      }
    }

    // https://developer.mozilla.org/en-US/docs/Web/Events/blur
    var useCapture = type === 'blur' || type === 'focus';

    window._on(target, type, dispatchEvent, useCapture);
  };

  // Find the element's parent with the given tag name:
  // $parent(qs('a'), 'div');
  window._parent = function (element, tagName) {
    if (!element.parentNode || element.parentNode===document) {
      return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
      return element.parentNode;
    }
    return window._parent(element.parentNode, tagName);
  };

  window.indexOf = function(array, value) {
    return Array.prototype.indexOf.call(array, value);
  }
})(window);
