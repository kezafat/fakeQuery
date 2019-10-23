const $ = (function () {
  let fakeQuery = function (selector) {
    if (!selector) return;
    //If it is an event, return the selector.target so we can manipulate the $(event)
    if (selector.target) {
      this.elems = [selector.target];
      return this;
    }
    // If already instance of fakeQuery
    if (typeof selector === 'object') {
      this.elems = [selector];
      return this;
    }
    // Create element or return win, doc or querySelectorAll
    switch (selector[0]) {
      case '<':
        let matchChar = selector.match(/<([\w-]*)>/);
        if (matchChar === null || matchChar === undefined) {
          throw 'Cannot create element - pass in < eltype >';
        }
        let nodeToCreate = matchChar[0].replace('<', '').replace('>', '');
        this.elems = [document.createElement(nodeToCreate)];
        return this;
      default:
        // 2 edge cases, document and window (return them if that is passed in)
        if (selector === 'document') {
          this.elems = [document];
          return this;
        } else if (selector === 'window') {
          this.elems = [window];
          return this;
        } else {
          this.elems = document.querySelectorAll(selector);
          return this;
        }
    }
  };
  fakeQuery.prototype.each = function (callback) {
    if (!callback || typeof callback !== 'function') return;
    for (let i = 0; i < this.elems.length; i++) {
      callback(this.elems[i], i);
    }
    return this;
  }
  fakeQuery.prototype.hide = function (element) {
    this.each(function (item) {
      item.style = 'display:none';
    })
    return this;
  }
  fakeQuery.prototype.show = function (element) {
    this.each(function (item) {
      item.style = '';
    })
    return this;
  }
  fakeQuery.prototype.addClass = function (className) {
    // Pass in single class or several classes delimited by space
    this.each(function (item) {
      let exploded = className.split(' ');
      try {
        exploded.map(className => item.classList.add(className))
      } catch{
        // If blank it will throw if u try to add to classList
        //Cannot set blank class value so do nothing
      }
    });
    return this;
  }
  fakeQuery.prototype.removeClass = function (className) {
    this.each(function (item, index) {
      // Explode string on ' ' and remove each entry from element class attribute
      let exploded = className.split(' ');
      exploded.map(className => item.classList.remove(className))
    });
    return this;
  }
  fakeQuery.prototype.html = function (str) {
    this.each(function (item) {
      item.innerHTML = str;
    });
    return this;
  }
  fakeQuery.prototype.append = function (element) {
    // If template literals are passed in
    if (typeof element === 'string') {
      this.elems[0].append(element);
      return this;
    }
    // If real nodelist is passed in
    this.each(function (item, index) {
      item.append(element.elems[index]);
    });
    return this;
  }
  fakeQuery.prototype.prepend = function (element) {
    this.elems[0].prepend(element.elems[0])
    return this;
  }
  fakeQuery.prototype.parent = function (selector) {
    return this.elems[0].parentNode;
  }
  fakeQuery.prototype.toggle = function (className) {
    this.each(function (item) {
      item.classList.toggle(className);
    })
    return this;
  }
  fakeQuery.prototype.attr = function (attributeName, attributeValue = '') {
    // $(selector).attr('data-style') returns data-style attribute value
    // $(selector).attr('data-style', 'border-round') sets data-style of selector to border-round
    if (arguments.length === 1) {
      return this.elems[0].getAttribute(attributeName);
    } else {
      this.elems[0].setAttribute(attributeName, attributeValue)
    }
    return this;
  }
  fakeQuery.prototype.val = function (value = "") {
    // If only one selector, respond with value
    if (this.elems.length <= 1) {
      return this.elems[0].value || this.elems[0].innerHTML;
    }
    // If chain of selectors, respond with array of objayz
    let res = [];
    this.each(function (item) {
      let name = item.getAttribute('class');
      res.push({ [name]: item.value || item.innerHTML });
    })
    return res
  }
  fakeQuery.prototype.delete = function () {
    this.each(function (item) {
      item.remove()
    })
  }
  fakeQuery.prototype.find = function (findEl) {
    // Great for finding things inside given element.
    // Example: $('.registration-form').find('.editableInput') - Returns array of all matching elements
    let res = [];
    this.each(function (parent) {
      res.push(parent.querySelectorAll(findEl))
    })
    // Return real array instead of nodelist so you can map instead of forEach
    return [...res[0]];
  }
  // Instansiate and return fakeQuery so we don't have to do "new $() everytime"
  let fakeQueryInstance = function (selector) {
    return new fakeQuery(selector);
  };
  return fakeQueryInstance;
})();

// Put this baby on window (pollute it yeaaaah!)
window.$ = $;

// If you'd rather import it and keep it off the window object.
// export default $;