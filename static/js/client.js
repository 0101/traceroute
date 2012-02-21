(function() {
  var acFilter, initializeDisplay, input, loadingText, output, storage;
  var __slice = Array.prototype.slice;
  input = $('#input');
  output = $('#output');
  initializeDisplay = function(display, headerText) {
    var closeButton, header;
    header = $('<h2/>', {
      text: headerText
    });
    display.append(header);
    display.append($('<div/>', {
      "class": 'inner'
    }));
    closeButton = $('<span/>', {
      "class": 'closeButton'
    });
    closeButton.appendTo(header);
    return closeButton.click(function() {
      display.fadeOut(100);
      return input.focus();
    });
  };
  storage = (function() {
    var commit, ifLS, names;
    if (typeof localStorage !== "undefined" && localStorage !== null) {
      names = (localStorage.names != null ? JSON.parse(localStorage.names) : void 0) || {};
      commit = function() {
        return localStorage.names = JSON.stringify(names);
      };
    }
    ifLS = function(fn) {
      var decoratedFn;
      return decoratedFn = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (typeof localStorage !== "undefined" && localStorage !== null) {
          fn.apply(null, args);
          commit();
          return null;
        }
      };
    };
    return {
      add: ifLS(function(target) {
        return names[target] = 1;
      }),
      remove: ifLS(function(target) {
        return delete names[target];
      }),
      getList: function() {
        var n, _results;
        if (names != null) {
          _results = [];
          for (n in names) {
            _results.push(n);
          }
          return _results;
        } else {
          return [];
        }
      }
    };
  })();
  now.startOutput = function(id) {
    return output.prepend($('<pre/>', {
      id: id
    }));
  };
  now.endOutput = function(id) {
    return $("#" + id).addClass('done');
  };
  now.output = function(id, content, target) {
    var display;
    display = $("#" + id);
    if (display.children().size() === 0) {
      initializeDisplay(display, content);
      return storage.add(target);
    } else {
      return display.find('.inner').append($('<span/>', {
        text: content
      }));
    }
  };
  now.error = function(id, content, target) {
    var display;
    display = $("#" + id).append($('<div/>', {
      "class": 'error',
      text: content
    }));
    setTimeout((function() {
      return display.fadeOut(2000);
    }), 5000);
    return storage.remove(target);
  };
  acFilter = $.ui.autocomplete.filter;
  input.autocomplete({
    source: function(request, response) {
      return response(acFilter(storage.getList(), request.term));
    },
    delay: 10
  });
  input.hide();
  loadingText = $('<span/>', {
    "class": 'loading',
    text: "Please wait..."
  });
  loadingText.insertAfter(input);
  now.ready(function() {
    loadingText.hide();
    input.show().focus();
    return input.keydown(function(e) {
      if (e.keyCode === 13 && input.val() !== '') {
        now.run(input.val());
        return input.val('');
      }
    });
  });
}).call(this);
