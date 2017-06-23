(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (typeof Array.from === 'function' ?
  Array.from :
  require('./polyfill')
);

},{"./polyfill":2}],2:[function(require,module,exports){
// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: http://www.ecma-international.org/ecma-262/6.0/#sec-array.from
module.exports = (function() {
  var isCallable = function(fn) {
    return typeof fn === 'function';
  };
  var toInteger = function (value) {
    var number = Number(value);
    if (isNaN(number)) { return 0; }
    if (number === 0 || !isFinite(number)) { return number; }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  var maxSafeInteger = Math.pow(2, 53) - 1;
  var toLength = function (value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  };
  var iteratorProp = function(value) {
    if(value != null) {
      if(['string','number','boolean','symbol'].indexOf(typeof value) > -1){
        return Symbol.iterator;
      } else if (
        (typeof Symbol !== 'undefined') &&
        ('iterator' in Symbol) &&
        (Symbol.iterator in value)
      ) {
        return Symbol.iterator;
      }
      // Support "@@iterator" placeholder, Gecko 27 to Gecko 35
      else if ('@@iterator' in value) {
        return '@@iterator';
      }
    }
  };
  var getMethod = function(O, P) {
    // Assert: IsPropertyKey(P) is true.
    if (O != null && P != null) {
      // Let func be GetV(O, P).
      var func = O[P];
      // ReturnIfAbrupt(func).
      // If func is either undefined or null, return undefined.
      if(func == null) {
        return void 0;
      }
      // If IsCallable(func) is false, throw a TypeError exception.
      if (!isCallable(func)) {
        throw new TypeError(func + ' is not a function');
      }
      return func;
    }
  };
  var iteratorStep = function(iterator) {
    // Let result be IteratorNext(iterator).
    // ReturnIfAbrupt(result).
    var result = iterator.next();
    // Let done be IteratorComplete(result).
    // ReturnIfAbrupt(done).
    var done = Boolean(result.done);
    // If done is true, return false.
    if(done) {
      return false;
    }
    // Return result.
    return result;
  };

  // The length property of the from method is 1.
  return function from(items /*, mapFn, thisArg */ ) {
    'use strict';

    // 1. Let C be the this value.
    var C = this;

    // 2. If mapfn is undefined, let mapping be false.
    var mapFn = arguments.length > 1 ? arguments[1] : void 0;

    var T;
    if (typeof mapFn !== 'undefined') {
      // 3. else
      //   a. If IsCallable(mapfn) is false, throw a TypeError exception.
      if (!isCallable(mapFn)) {
        throw new TypeError(
          'Array.from: when provided, the second argument must be a function'
        );
      }

      //   b. If thisArg was supplied, let T be thisArg; else let T
      //      be undefined.
      if (arguments.length > 2) {
        T = arguments[2];
      }
      //   c. Let mapping be true (implied by mapFn)
    }

    var A, k;

    // 4. Let usingIterator be GetMethod(items, @@iterator).
    // 5. ReturnIfAbrupt(usingIterator).
    var usingIterator = getMethod(items, iteratorProp(items));

    // 6. If usingIterator is not undefined, then
    if (usingIterator !== void 0) {
      // a. If IsConstructor(C) is true, then
      //   i. Let A be the result of calling the [[Construct]]
      //      internal method of C with an empty argument list.
      // b. Else,
      //   i. Let A be the result of the abstract operation ArrayCreate
      //      with argument 0.
      // c. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C()) : [];

      // d. Let iterator be GetIterator(items, usingIterator).
      var iterator = usingIterator.call(items);

      // e. ReturnIfAbrupt(iterator).
      if (iterator == null) {
        throw new TypeError(
          'Array.from requires an array-like or iterable object'
        );
      }

      // f. Let k be 0.
      k = 0;

      // g. Repeat
      var next, nextValue;
      while (true) {
        // i. Let Pk be ToString(k).
        // ii. Let next be IteratorStep(iterator).
        // iii. ReturnIfAbrupt(next).
        next = iteratorStep(iterator);

        // iv. If next is false, then
        if (!next) {

          // 1. Let setStatus be Set(A, "length", k, true).
          // 2. ReturnIfAbrupt(setStatus).
          A.length = k;

          // 3. Return A.
          return A;
        }
        // v. Let nextValue be IteratorValue(next).
        // vi. ReturnIfAbrupt(nextValue)
        nextValue = next.value;

        // vii. If mapping is true, then
        //   1. Let mappedValue be Call(mapfn, T, «nextValue, k»).
        //   2. If mappedValue is an abrupt completion, return
        //      IteratorClose(iterator, mappedValue).
        //   3. Let mappedValue be mappedValue.[[value]].
        // viii. Else, let mappedValue be nextValue.
        // ix.  Let defineStatus be the result of
        //      CreateDataPropertyOrThrow(A, Pk, mappedValue).
        // x. [TODO] If defineStatus is an abrupt completion, return
        //    IteratorClose(iterator, defineStatus).
        if (mapFn) {
          A[k] = mapFn.call(T, nextValue, k);
        }
        else {
          A[k] = nextValue;
        }
        // xi. Increase k by 1.
        k++;
      }
      // 7. Assert: items is not an Iterable so assume it is
      //    an array-like object.
    } else {

      // 8. Let arrayLike be ToObject(items).
      var arrayLike = Object(items);

      // 9. ReturnIfAbrupt(items).
      if (items == null) {
        throw new TypeError(
          'Array.from requires an array-like object - not null or undefined'
        );
      }

      // 10. Let len be ToLength(Get(arrayLike, "length")).
      // 11. ReturnIfAbrupt(len).
      var len = toLength(arrayLike.length);

      // 12. If IsConstructor(C) is true, then
      //     a. Let A be Construct(C, «len»).
      // 13. Else
      //     a. Let A be ArrayCreate(len).
      // 14. ReturnIfAbrupt(A).
      A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 15. Let k be 0.
      k = 0;
      // 16. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = arrayLike[k];
        if (mapFn) {
          A[k] = mapFn.call(T, kValue, k);
        }
        else {
          A[k] = kValue;
        }
        k++;
      }
      // 17. Let setStatus be Set(A, "length", len, true).
      // 18. ReturnIfAbrupt(setStatus).
      A.length = len;
      // 19. Return A.
    }
    return A;
  };
})();

},{}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _handlebarsBase = require('./handlebars/base');

var base = _interopRequireWildcard(_handlebarsBase);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var _handlebarsSafeString = require('./handlebars/safe-string');

var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

var _handlebarsException = require('./handlebars/exception');

var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

var _handlebarsUtils = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_handlebarsUtils);

var _handlebarsRuntime = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_handlebarsRuntime);

var _handlebarsNoConflict = require('./handlebars/no-conflict');

var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _handlebarsSafeString2['default'];
  hb.Exception = _handlebarsException2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_handlebarsNoConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];


},{"./handlebars/base":4,"./handlebars/exception":7,"./handlebars/no-conflict":17,"./handlebars/runtime":18,"./handlebars/safe-string":19,"./handlebars/utils":20}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('./utils');

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _helpers = require('./helpers');

var _decorators = require('./decorators');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var VERSION = '4.0.10';
exports.VERSION = VERSION;
var COMPILER_REVISION = 7;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1',
  7: '>= 4.0.0'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials, decorators) {
  this.helpers = helpers || {};
  this.partials = partials || {};
  this.decorators = decorators || {};

  _helpers.registerDefaultHelpers(this);
  _decorators.registerDefaultDecorators(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: _logger2['default'],
  log: _logger2['default'].log,

  registerHelper: function registerHelper(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple helpers');
      }
      _utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (_utils.toString.call(name) === objectType) {
      _utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  },

  registerDecorator: function registerDecorator(name, fn) {
    if (_utils.toString.call(name) === objectType) {
      if (fn) {
        throw new _exception2['default']('Arg not supported with multiple decorators');
      }
      _utils.extend(this.decorators, name);
    } else {
      this.decorators[name] = fn;
    }
  },
  unregisterDecorator: function unregisterDecorator(name) {
    delete this.decorators[name];
  }
};

var log = _logger2['default'].log;

exports.log = log;
exports.createFrame = _utils.createFrame;
exports.logger = _logger2['default'];


},{"./decorators":5,"./exception":7,"./helpers":8,"./logger":16,"./utils":20}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultDecorators = registerDefaultDecorators;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _decoratorsInline = require('./decorators/inline');

var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

function registerDefaultDecorators(instance) {
  _decoratorsInline2['default'](instance);
}


},{"./decorators/inline":6}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerDecorator('inline', function (fn, props, container, options) {
    var ret = fn;
    if (!props.partials) {
      props.partials = {};
      ret = function (context, options) {
        // Create a new partials stack frame prior to exec.
        var original = container.partials;
        container.partials = _utils.extend({}, original, props.partials);
        var ret = fn(context, options);
        container.partials = original;
        return ret;
      };
    }

    props.partials[options.args[0]] = options.fn;

    return ret;
  });
};

module.exports = exports['default'];


},{"../utils":20}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  try {
    if (loc) {
      this.lineNumber = line;

      // Work around issue under safari where we can't directly set the column value
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(this, 'column', {
          value: column,
          enumerable: true
        });
      } else {
        this.column = column;
      }
    }
  } catch (nop) {
    /* Ignore if the browser is very particular */
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];


},{}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.registerDefaultHelpers = registerDefaultHelpers;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helpersBlockHelperMissing = require('./helpers/block-helper-missing');

var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

var _helpersEach = require('./helpers/each');

var _helpersEach2 = _interopRequireDefault(_helpersEach);

var _helpersHelperMissing = require('./helpers/helper-missing');

var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

var _helpersIf = require('./helpers/if');

var _helpersIf2 = _interopRequireDefault(_helpersIf);

var _helpersLog = require('./helpers/log');

var _helpersLog2 = _interopRequireDefault(_helpersLog);

var _helpersLookup = require('./helpers/lookup');

var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

var _helpersWith = require('./helpers/with');

var _helpersWith2 = _interopRequireDefault(_helpersWith);

function registerDefaultHelpers(instance) {
  _helpersBlockHelperMissing2['default'](instance);
  _helpersEach2['default'](instance);
  _helpersHelperMissing2['default'](instance);
  _helpersIf2['default'](instance);
  _helpersLog2['default'](instance);
  _helpersLookup2['default'](instance);
  _helpersWith2['default'](instance);
}


},{"./helpers/block-helper-missing":9,"./helpers/each":10,"./helpers/helper-missing":11,"./helpers/if":12,"./helpers/log":13,"./helpers/lookup":14,"./helpers/with":15}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (_utils.isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });
};

module.exports = exports['default'];


},{"../utils":20}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (_utils.isArray(context)) {
        for (var j = context.length; i < j; i++) {
          if (i in context) {
            execIteration(i, i, i === context.length - 1);
          }
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey !== undefined) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });
};

module.exports = exports['default'];


},{"../exception":7,"../utils":20}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

exports['default'] = function (instance) {
  instance.registerHelper('helperMissing', function () /* [args, ]options */{
    if (arguments.length === 1) {
      // A missing field in a {{foo}} construct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });
};

module.exports = exports['default'];


},{"../exception":7}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('if', function (conditional, options) {
    if (_utils.isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });
};

module.exports = exports['default'];


},{"../utils":20}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('log', function () /* message, options */{
    var args = [undefined],
        options = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      args.push(arguments[i]);
    }

    var level = 1;
    if (options.hash.level != null) {
      level = options.hash.level;
    } else if (options.data && options.data.level != null) {
      level = options.data.level;
    }
    args[0] = level;

    instance.log.apply(instance, args);
  });
};

module.exports = exports['default'];


},{}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

exports['default'] = function (instance) {
  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
};

module.exports = exports['default'];


},{}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

exports['default'] = function (instance) {
  instance.registerHelper('with', function (context, options) {
    if (_utils.isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!_utils.isEmpty(context)) {
      var data = options.data;
      if (options.data && options.ids) {
        data = _utils.createFrame(options.data);
        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
      }

      return fn(context, {
        data: data,
        blockParams: _utils.blockParams([context], [data && data.contextPath])
      });
    } else {
      return options.inverse(this);
    }
  });
};

module.exports = exports['default'];


},{"../utils":20}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('./utils');

var logger = {
  methodMap: ['debug', 'info', 'warn', 'error'],
  level: 'info',

  // Maps a given level value to the `methodMap` indexes above.
  lookupLevel: function lookupLevel(level) {
    if (typeof level === 'string') {
      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
      if (levelMap >= 0) {
        level = levelMap;
      } else {
        level = parseInt(level, 10);
      }
    }

    return level;
  },

  // Can be overridden in the host environment
  log: function log(level) {
    level = logger.lookupLevel(level);

    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
      var method = logger.methodMap[level];
      if (!console[method]) {
        // eslint-disable-line no-console
        method = 'log';
      }

      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        message[_key - 1] = arguments[_key];
      }

      console[method].apply(console, message); // eslint-disable-line no-console
    }
  }
};

exports['default'] = logger;
module.exports = exports['default'];


},{"./utils":20}],17:[function(require,module,exports){
(function (global){
/* global window */
'use strict';

exports.__esModule = true;

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
    return Handlebars;
  };
};

module.exports = exports['default'];


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.checkRevision = checkRevision;
exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _base = require('./base');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _base.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  templateSpec.main.decorator = templateSpec.main_d;

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
      if (options.ids) {
        options.ids[0] = true;
      }
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      var ret = templateSpec[i];
      ret.decorator = templateSpec[i + '_d'];
      return ret;
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },
    // An empty object to use as replacement for null-contexts
    nullContext: Object.seal({}),

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      if (options.depths) {
        depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
      } else {
        depths = [context];
      }
    }

    function main(context /*, options*/) {
      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
    }
    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
    return main(context, options);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
      if (templateSpec.usePartial || templateSpec.useDecorators) {
        container.decorators = container.merge(options.decorators, env.decorators);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
      container.decorators = options.decorators;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var currentDepths = depths;
    if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
      currentDepths = [context].concat(depths);
    }

    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
  }

  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    if (options.name === '@partial-block') {
      partial = options.data['partial-block'];
    } else {
      partial = options.partials[options.name];
    }
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  // Use the current closure context to save the partial-block if this partial
  var currentPartialBlock = options.data && options.data['partial-block'];
  options.partial = true;
  if (options.ids) {
    options.data.contextPath = options.ids[0] || options.data.contextPath;
  }

  var partialBlock = undefined;
  if (options.fn && options.fn !== noop) {
    (function () {
      options.data = _base.createFrame(options.data);
      // Wrapper function to get access to currentPartialBlock from the closure
      var fn = options.fn;
      partialBlock = options.data['partial-block'] = function partialBlockWrapper(context) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        // Restore the partial-block from the closure for the execution of the block
        // i.e. the part inside the block of the partial call.
        options.data = _base.createFrame(options.data);
        options.data['partial-block'] = currentPartialBlock;
        return fn(context, options);
      };
      if (fn.partials) {
        options.partials = Utils.extend({}, options.partials, fn.partials);
      }
    })();
  }

  if (partial === undefined && partialBlock) {
    partial = partialBlock;
  }

  if (partial === undefined) {
    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _base.createFrame(data) : {};
    data.root = context;
  }
  return data;
}

function executeDecorators(fn, prog, container, depths, data, blockParams) {
  if (fn.decorator) {
    var props = {};
    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
    Utils.extend(prog, props);
  }
  return prog;
}


},{"./base":4,"./exception":7,"./utils":20}],19:[function(require,module,exports){
// Build out our basic SafeString type
'use strict';

exports.__esModule = true;
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];


},{}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.createFrame = createFrame;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

var badChars = /[&<>"'`=]/g,
    possible = /[&<>"'`=]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/* eslint-disable func-style */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
exports.isFunction = isFunction;

/* eslint-enable func-style */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};

exports.isArray = isArray;
// Older IE versions do not directly support indexOf so we must implement our own, sadly.

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function createFrame(object) {
  var frame = extend({}, object);
  frame._parent = object;
  return frame;
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}


},{}],21:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime')['default'];

},{"./dist/cjs/handlebars.runtime":3}],22:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],23:[function(require,module,exports){
(function (process){
(function (exports) {
'use strict';

const HandlebarsCompiler = require('handlebars/runtime')['default'];
var header = HandlebarsCompiler.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n\n      <!-- Logo -->\n      <a id=\"crds-shared-header-logo\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "\" class=\"navbar-brand logo\">\n        <svg viewBox=\"0 0 578 84\" width=\"578\" height=\"84\">\n          <use xlink:href=\"/assets/svgs/logo-crds.svg#logo-crds\"></use>\n        </svg>\n      </a>\n\n      <!-- Mobile Hamburger Icon -->\n      <a id=\"crds-shared-header-mobile-toggle\" class=\"navbar-left hidden-md hidden-lg hidden-xl\"\n         data-toggle=\"modal\" data-target=\".header .modal\" href=\"#\">\n        <svg class=\"icon icon-1\" viewBox=\"0 0 256 256\">\n          <use xlink:href=\"/assets/svgs/icons.svg#menu\"></use>\n        </svg>\n      </a>\n\n      <!-- Mobile Search Icon -->\n      <a id=\"crds-shared-header-mobile-search\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "search\" class=\"pull-right hidden-md hidden-lg hidden-xl\">\n        <svg class=\"icon icon-1\" viewBox=\"0 0 256 256\">\n          <use xlink:href=\"/assets/svgs/icons.svg#search\"></use>\n        </svg>\n      </a>\n\n      <!-- User Menu -->\n      "
    + ((stack1 = ((helper = (helper = helpers.userMenuContent || (depth0 != null ? depth0.userMenuContent : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userMenuContent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n      <!-- Main Menu -->\n      <div data-main-menu>\n        "
    + ((stack1 = ((helper = (helper = helpers.mainMenuContent || (depth0 != null ? depth0.mainMenuContent : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mainMenuContent","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n      </div>\n\n    </div>\n  </div>\n</div>\n";
},"useData":true});

const HandlebarsCompiler$1 = require('handlebars/runtime')['default'];
var user_menu = HandlebarsCompiler$1.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div data-signed-in\n     class=\"dropdown pull-right profile-menu hidden-xs hidden-sm hide\">\n  <a id=\"crds-shared-header-desktop-toggle\" href=\"javascript:void(0)\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"\n     data-exclude-mobile>\n    <div class=\"profile-picture img-size-2_25 push-center\">\n      <div class=\"profile-picture-default img-circle\"></div>\n      <div class=\"profile-picture-overlay img-circle\" data-user-avatar></div>\n    </div>\n  </a>\n  <ul id=\"crds-shared-header-desktop\" data-user-menu class=\"dropdown-menu\"\n      aria-labelledby=\"user-dropdown\">\n    <li>\n      <a id=\"crds-shared-header-name\" ui-sref=\"profile.personal\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "profile/personal\" data-user-name></a>\n    </li>\n    <li role=\"separator\" class=\"divider\"></li>\n    <li>\n      <a id=\"crds-shared-header-profile\" ui-sref=\"profile.personal\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "profile/personal\">My Profile</a>\n    </li>\n    <li>\n      <a id=\"crds-shared-header-history\" ui-sref=\"giving_history\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "givinghistory\">Giving History</a>\n    </li>\n    <li>\n      <a id=\"crds-shared-header-serve\" ui-sref=\"serve-signup\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "serve-signup\">Sign Up to Serve</a>\n    </li>\n    <li>\n      <a id=\"crds-shared-header-groups\" ui-sref=\"grouptool.mygroups\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "groups/mygroups\">My Groups</a>\n    </li>\n    <li>\n      <a id=\"crds-shared-header-trips\" ui-sref=\"mytrips\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "trips/mytrips\">My Trips</a>\n    </li>\n    <li>\n      <a id=\"crds-shared-header-camps\" ui-sref=\"camps-dashboard\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "mycamps\">My Camps</a>\n    </li>\n    <li>\n      <a id=\"crds-shared-header-childcare\" ui-sref=\"childcare-dashboard\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "childcare\">Childcare</a>\n    </li>\n    <li>\n      <a id=\"crds-shared-header-signout\" ui-sref=\"logout\" href=\""
    + alias4(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "signout\">Sign Out</a>\n    </li>\n  </ul>\n</div>\n";
},"useData":true});

const HandlebarsCompiler$2 = require('handlebars/runtime')['default'];
var sign_in_button = HandlebarsCompiler$2.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<!-- Sign In Button -->\n<li data-signed-out class=\"hide\">\n  <a id=\"crds-shared-header-desktop-signin\" href=\""
    + container.escapeExpression(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "signin\" class=\"btn btn-gray cta\" data-exclude-mobile>\n    Sign In\n  </a>\n</li>\n";
},"useData":true});

const HandlebarsCompiler$3 = require('handlebars/runtime')['default'];
var mobile_menu = HandlebarsCompiler$3.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "<!-- Mobile Menu -->\n<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade mobile-menu\" data-mobile-menu>\n  <a href=\"#\" id=\"dismiss-mobile-nav\" data-dismiss=\"modal\" style=\"display: none;\">Dismiss</a>\n  <div class=\"modal-dialog modal-sm\">\n    <div class=\"modal-content\">\n      <ul>\n        <li data-signed-out><a id=\"crds-shared-header-mobile-signin\" href=\""
    + container.escapeExpression(((helper = (helper = helpers.appEndpoint || (depth0 != null ? depth0.appEndpoint : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appEndpoint","hash":{},"data":data}) : helper)))
    + "signin\">Sign In</a></li>\n        <li data-signed-in>\n          <a id=\"crds-shared-header-mobile-toggle-profile\" role=\"button\" data-toggle=\"collapse\" href=\"#collapse-profile\">\n            <span>My Profile</span>\n            <div class=\"profile-picture img-size-12 push-center\">\n              <div class=\"profile-picture-default img-circle\"></div>\n              <div class=\"profile-picture-overlay img-circle\" data-user-avatar></div>\n            </div>\n          </a>\n          <ul id=\"collapse-profile\" class=\"collapse\">\n            "
    + ((stack1 = ((helper = (helper = helpers.userMenuHTML || (depth0 != null ? depth0.userMenuHTML : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userMenuHTML","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n          </ul>\n          </a>\n        </li>\n        "
    + ((stack1 = ((helper = (helper = helpers.mobileMenuHTML || (depth0 != null ? depth0.mobileMenuHTML : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mobileMenuHTML","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n      </ul>\n    </div>\n  </div>\n</div>\n";
},"useData":true});

const HandlebarsCompiler$4 = require('handlebars/runtime')['default'];
var mobile_menu_item = HandlebarsCompiler$4.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <li>\n    <a role=\"button\" data-toggle=\"collapse\" data-target=\"#"
    + alias4(((helper = (helper = helpers.linkId || (depth0 != null ? depth0.linkId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkId","hash":{},"data":data}) : helper)))
    + "\">\n      "
    + alias4(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "\n      <svg class=\"icon icon-1\" viewBox=\"0 0 256 256\">\n        <use href=\"/assets/svgs/icons.svg#chevron-right\"></use>\n      </svg>\n    </a>\n    <ul id=\""
    + alias4(((helper = (helper = helpers.linkId || (depth0 != null ? depth0.linkId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"linkId","hash":{},"data":data}) : helper)))
    + "\" class=\"collapse\">\n      "
    + ((stack1 = ((helper = (helper = helpers.mobileMenuChildrenHTML || (depth0 != null ? depth0.mobileMenuChildrenHTML : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mobileMenuChildrenHTML","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </ul>\n  </li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <li>"
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.hasChildren : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

const HandlebarsCompiler$5 = require('handlebars/runtime')['default'];
var mobile_menu_child = HandlebarsCompiler$5.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<li>"
    + ((stack1 = ((helper = (helper = helpers.html || (depth0 != null ? depth0.html : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"html","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</li>";
},"useData":true});

var arrayFrom = require('array-from');
var Utilities = (function () {
    /// ----------------------------------------------------------|
    /**
     * @method  constructor
     * @param   {Object}  options
     */
    function Utilities(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
    }
    /**
     * Generate a random string of characters
     *
     * @method randomString
     * @static
     * @return {number}
     */
    Utilities.randomString = function () {
        return Math.random().toString(36).substring(2, 24);
    };
    /**
     * Returns array from collection of nodes or other data-type
     *
     * @method  array
     * @param   {any} collect   NodeList or Array
     */
    Utilities.prototype.array = function (collection) {
        if (collection.constructor === NodeList) {
            return arrayFrom(collection);
        }
        else if (collection.constructor === Array) {
            return collection;
        }
        else {
            return [collection];
        }
    };
    /**
     * Returns Element with random data-underscore-id attr
     *
     * @method  el
     * @param   {Object}  node  DOM Node
     * @return  {Element}
     */
    Utilities.prototype.el = function (node) {
        var id = "_el-" + Utilities.randomString();
        node.setAttribute('data-underscore-id', id);
        return node;
    };
    /**
     * Returns content associated with id value defined in options hash
     *
     * @method  getContentBlock
     * @return  {Promise}
     */
    Utilities.prototype.getContentBlock = function () {
        var id = this.options['contentBlockId'];
        var url = this.apiUrl("api/contentblock/" + id);
        return this.get(url).then(function (response) {
            return JSON.parse(response)['contentBlock'];
        });
    };
    /**
     * Returns content from all defined categories,
     * associated with specific title defined in options hash
     *
     * @method getContentBlockByTitle
     * @return  {Promise}
     */
    Utilities.prototype.getContentBlockByTitle = function () {
        var title = this.options['contentBlockTitle'];
        var categories = this.options['contentBlockCategories'];
        var url = this.apiUrl("api/contentblock?category[]=" + categories.join('&category[]='));
        return this.get(url).then(function (response) {
            var objects = JSON.parse(response)['contentblocks'];
            var contentBlock;
            for (var i = 0; i < objects.length; ++i) {
                if (objects[i]['title'] === title) {
                    contentBlock = objects[i];
                    break;
                }
            }
            return contentBlock;
        });
    };
    /**
     * Returns URL to user's avatar
     *
     * @method getUserAvatarUrl
     * @param {string} id
     * @return  {Promise}
     */
    Utilities.prototype.getUserAvatarUrl = function (id) {
        var url = this.imgUrl(id);
        return this.get(url).then(function (response) {
            return url;
        }).catch(function (error) {
            return 'https://crossroads-media.imgix.net/images/avatar.svg';
        });
    };
    /**
     * Returns fragment prepended with cmsEndpoint
     *
     * @method apiUrl
     * @private
     * @param {string} fragment
     * @return {string}
     */
    Utilities.prototype.apiUrl = function (fragment) {
        var config = window['CRDS'] ? window['CRDS'].SharedHeaderConfig || {} : {};
        return (config.cmsEndpoint || process.env.CRDS_CMS_ENDPOINT) + fragment;
    };
    /**
     * Returns fragment prepended with imgEndpoint
     *
     * @method apiUrl
     * @private
     * @param {string} fragment
     * @return {string}
     */
    Utilities.prototype.imgUrl = function (fragment) {
        var config = window['CRDS'] ? window['CRDS'].SharedHeaderConfig || {} : {};
        return (config.appEndpoint || process.env.CRDS_IMAGE_ENDPOINT) + fragment;
    };
    /**
     * Returns a Promise object for url
     *
     * @method get
     * @private
     * @param {string} url
     */
    Utilities.prototype.get = function (url) {
        // Return a new promise.
        return new Promise(function (resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = function () {
                // This is called even on 404 etc
                // so check the status
                if (req.readyState === XMLHttpRequest.DONE &&
                    req.status === 200 &&
                    req.responseText !== null &&
                    req.responseText.length > 0) {
                    // Resolve the promise with the response text
                    resolve(req.responseText);
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    // reject(Error(req.statusText));
                    reject('Could not get item.');
                }
            };
            // Handle network errors
            req.onerror = function () {
                reject(Error('Network Error'));
            };
            // Make the request
            req.send();
        });
    };
    /**
     * Given a cookie key `name`, returns the value of
     * the cookie or `null`, if the key is not found.
     *
     * @method getCookie
     * @static
     * @param {string} name
     * @return {string}
     */
    Utilities.prototype.getCookie = function (name) {
        var nameLenPlus = (name.length + 1);
        return document.cookie
            .split(';')
            .map(function (c) { return c.trim(); })
            .filter(function (cookie) {
            return cookie.substring(0, nameLenPlus) === name + "=";
        })
            .map(function (cookie) {
            return decodeURIComponent(cookie.substring(nameLenPlus));
        })[0] || null;
    };
    /**
     * Returns Handlebars template + options
     *
     * @method render
     * @static
     * @param {string} name
     * @param {Object} options
     * @return {string}
     */
    Utilities.prototype.render = function (name, options) {
        if (options === void 0) { options = {}; }
        var template;
        switch (name) {
            case 'header':
                template = header;
                break;
            case 'user_menu':
                template = user_menu;
                break;
            case 'sign_in_button':
                template = sign_in_button;
                break;
            case 'mobile_menu':
                template = mobile_menu;
                break;
            case 'mobile_menu_item':
                template = mobile_menu_item;
                break;
            case 'mobile_menu_child':
                template = mobile_menu_child;
                break;
        }
        return template(options);
    };
    return Utilities;
}());

var MobileMenu = (function () {
    /**
     * @method  constructor
     * @param   {string}  mainMenuSelector  Selector associated with the mainMenu
     */
    function MobileMenu(mainMenuSelector) {
        this._html = '';
        this._utils = new Utilities();
        this._mainMenuSelector = mainMenuSelector;
    }
    /**
     * Renders & appends mobile menu to first element matching `selector`
     * Once appended to the document, setup all event listeners
     *
     * @method render
     * @param {string} selector
     */
    MobileMenu.prototype.render = function (selector) {
        var html = this.extract();
        $(selector).append(html);
        this.events();
    };
    /**
     * Setup event listeners & mutation observers for mobile menu
     *
     * @method events
     * @private
     */
    MobileMenu.prototype.events = function () {
        // Close the mobile nav whenever a child link is clicked
        $('.mobile-menu a').click(this.onClick);
        // Ensure no-scroll selector is utilized when the mobile nav is opened
        var el = $('[data-mobile-menu]').first();
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    if (el.hasClass('in')) {
                        $('body').addClass('noscroll');
                    }
                    else {
                        $('body').removeClass('noscroll');
                    }
                }
            });
        });
        observer.observe(el[0], { attributes: true });
    };
    /**
     * Event handler to close the mobile nav whenever a child link is clicked
     *
     * @method onClick
     * @param {Event} e
     */
    MobileMenu.prototype.onClick = function (e) {
        var target = $(e.target);
        var attr = target.data('toggle');
        var id = target.attr('id');
        if (id !== 'dismiss-mobile-nav' && (attr === undefined || attr === null)) {
            $('body').removeClass('modal-open');
            $('.modal-backdrop.fade.in').removeClass('in');
            $('#dismiss-mobile-nav').trigger('click');
        }
    };
    /**
     * Extract individual links from main menu into mobile menu
     *
     * @method  extract
     * @private
     * @return  {string}  Rendered output for mobile menu
     */
    MobileMenu.prototype.extract = function () {
        var _this = this;
        // Step through the main nav's links.
        var links = $(this._mainMenuSelector + " ul.nav > li > a");
        $.each(links, function (i, link) {
            // Don't do anything with the link unless it contains the [data-exclude-mobile] attr
            if (link.getAttribute('data-exclude-mobile') === null) {
                var children = $(link).parent().find('.dropdown-menu a:not([data-exclude-mobile])'), options = {};
                if (children.length > 0) {
                    options = _this.optionsWithChildren(link, children);
                }
                else {
                    options = _this.optionsWithoutChildren(link);
                }
                _this._html += _this._utils.render('mobile_menu_item', options);
            }
        });
        var html = this._utils.render('mobile_menu', {
            userMenuHTML: $('[data-user-menu]').first().html(),
            mobileMenuHTML: this._html
        });
        return html;
    };
    /**
     * Return all children of a node, not marked for exclusion from mobile
     *
     * @method  getChildren
     * @private
     * @param   {Object} node   DOM Node
     * @return  {Object}        Collection of children nodes
     */
    MobileMenu.prototype.getChildren = function (node) {
        return $(node).parent().find('.dropdown .dropdown-menu a:not([data-exclude-mobile])');
    };
    /**
     * Returns object for utils.render() which containing rendered child HTML and related options
     *
     * @method  optionsWithChildren
     * @private
     * @param   {Object}  node      DOM Node
     * @param   {array}   children  Array of children nodes
     */
    MobileMenu.prototype.optionsWithChildren = function (node, children) {
        var _this = this;
        var options = {
            hasChildren: true,
            mobileMenuChildrenHTML: '',
            text: node.innerHTML,
            linkId: "mobile-collapse-" + Utilities.randomString()
        };
        // Loop through the children and store their relevant HTML.
        $.each(children, function (i, child) {
            var args = { html: child.outerHTML };
            options.mobileMenuChildrenHTML += _this._utils.render('mobile_menu_child', args);
        });
        return options;
    };
    /**
     * Return object for utils.render() which contains node's outerHTML
     *
     * @method optionsWithoutChildren
     * @private
     * @param   {Object}  node    DOM Node
     */
    MobileMenu.prototype.optionsWithoutChildren = function (node) {
        return {
            hasChildren: false,
            text: node.outerHTML,
            mobileMenuChildrenHTML: null,
            linkId: null
        };
    };
    return MobileMenu;
}());

var ReactiveAuth = (function () {
    /**
     * Handles watching for changes with the auth cookie and dispatches the appropriate events.
     *
     * @method  constructor
     * @param   {string}  name            the name of the auth cookie that should be watched.
     * @param   {anyFunc} defaultHandler  A default callback for the event listeners.
     */
    function ReactiveAuth(name, defaultHandler) {
        if (name === void 0) { name = 'sessionId'; }
        if (defaultHandler === void 0) { defaultHandler = console.log; }
        this.cookieValRe = new RegExp("(?:(?:^|.*;\\s*)" + name + "\\s*=\\s*([^;]*).*$)|^.*$", '');
        this.cookieVal = this.getCookie();
        this.updateHandler = defaultHandler;
        this.expireHandler = defaultHandler;
    }
    /**
     * Subscribes the client to the events that are dispatched by this class.
     *
     * @method  subscribe
     *
     * @param   {number}  frequency=3000 The frequency in milliseconds that this class will check the
     *     cookie.
     * @param   {anyFunc} updateCb       A specific function that should be called when the
     *     `updateAuth` event is dispatched.
     * @param   {anyFunc} expireCb       A specific function that should be called when the
     *     `expireAuth` event is dispatched.
     *
     * @returns {any}                    The object that identifies the interval that was started.
     */
    ReactiveAuth.prototype.subscribe = function (frequency, updateCb, expireCb) {
        var _this = this;
        if (frequency === void 0) { frequency = 3000; }
        this.createEventListeners(updateCb, expireCb);
        if (this.subscription) {
            clearInterval(this.subscription);
        }
        this.subscription = setInterval(function () {
            var currentBrowserCookieVal = _this.getCookie();
            if (!currentBrowserCookieVal && _this.cookieVal) {
                // The cookie expired
                window.dispatchEvent(new CustomEvent('expireAuth', {
                    detail: {
                        message: 'Auth Cookie Expired',
                        oldValue: _this.cookieVal,
                        currentValue: currentBrowserCookieVal
                    },
                    bubbles: true,
                    cancelable: true
                }));
            }
            else if (_this.cookieVal !== currentBrowserCookieVal) {
                window.dispatchEvent(new CustomEvent('updateAuth', {
                    detail: {
                        message: 'Auth Cookie Updated',
                        oldValue: _this.cookieVal,
                        currentValue: currentBrowserCookieVal
                    },
                    bubbles: true,
                    cancelable: true
                }));
            }
            _this.cookieVal = currentBrowserCookieVal;
        }, frequency);
        return this.subscription;
    };
    /**
     * Unsubscribes the client from the events that this class dispatches.
     *
     * @method unsubscribe
     */
    ReactiveAuth.prototype.unsubscribe = function () {
        clearInterval(this.getSubscription());
        this.subscription = undefined;
        window.removeEventListener('updateAuth');
        window.removeEventListener('expireAuth');
    };
    /**
     * Grabs the current subscription that is active on the window.
     *
     * @method getSubscription
     * @returns {any}            The current interval on window.
     * @throws  {ReferenceError} If the subscription is not found.
     */
    ReactiveAuth.prototype.getSubscription = function () {
        if (!this.subscription) {
            throw new ReferenceError('ReactiveAuth#getSubscription(): No subscriptions found on window. Call subscribe() to create one.');
        }
        return this.subscription;
    };
    /**
     * Creates the event listeners for the `updateAuth` and `expireAuth` events.
     *
     * @method createEventListeners
     * @private
     *
     * @param  {anyFunc} updateCb A specific function that should be called when the `updateAuth`
     *     event is dispatched.
     * @param  {anyFunc} expireCb A specific function that should be called when the `expireAuth`
     *     event is dispatched.
     */
    ReactiveAuth.prototype.createEventListeners = function (updateCb, expireCb) {
        if (updateCb) {
            this.updateHandler = updateCb;
        }
        if (expireCb) {
            this.expireHandler = expireCb;
        }
        window.addEventListener('updateAuth', this.updateHandler, false);
        window.addEventListener('expireAuth', this.expireHandler, false);
    };
    /**
     * Gets the cookie string and isolates the cookie we want using regex replacement.
     *
     * @method getCookie
     * @private
     * @returns {string}  The isolated auth cookie.
     */
    ReactiveAuth.prototype.getCookie = function () {
        return document.cookie.replace(this.cookieValRe, '$1') || undefined;
    };
    return ReactiveAuth;
}());

var AuthListener = (function () {
    /**
     * @method  constructor
     * @param   {Object}  opts  Options hash
     */
    function AuthListener(options) {
        this.options = options;
        this.sessionId = this.options.crdsCookiePrefix + "sessionId";
        this._utils = new Utilities();
        this._reactiveAuth = new ReactiveAuth(this.sessionId);
    }
    /**
     * Every 500ms, if there is a "userId" cookie holding a value, trigger the
     * sign-in process. Otherwise, trigger the sign-out process.
     *
     * @method start
     */
    AuthListener.prototype.start = function () {
        var _this = this;
        // check to see if we already have a cookie.
        if (this._utils.getCookie(this.sessionId)) {
            this.signIn();
        }
        else {
            this.signOut();
        }
        var onUpdate = function (evt) {
            if (evt.detail.currentValue) {
                _this.signIn();
            }
            else {
                _this.signOut();
            }
        };
        var onExpired = function (evt) {
            _this.signOut();
        };
        this._reactiveAuth.subscribe(500, onUpdate, onExpired);
    };
    /**
     * Expose the elements associated with authenticated users & hide the sign-in button
     *
     * @method signIn
     * @private
     */
    AuthListener.prototype.signIn = function () {
        // If there are [data-signed-in] elements with the "hide" class, they will
        // be shown ("hide" class removed).
        if ($('.hide[data-signed-in]').length > 0) {
            var username = this._utils.getCookie('username');
            var userId = this._utils.getCookie('userId');
            $('.hide[data-signed-in]').removeClass('hide');
            // Add the user's name to any [data-user-name] elements, which is stored
            // in a cookie, like the userId.
            $('[data-user-name]').html(username);
            // The user's avatar is available via the CMS, and is attached to any
            // [data-user-avatar] elements.
            this._utils.getUserAvatarUrl(userId).then(function (url) {
                $('[data-user-avatar]').css('background-image', "url('" + url + "')");
            }.bind(this));
        }
        // Any [data-signed-out] elements that do not have the "hide" class already
        // applied, get that applied at this time.
        $('[data-signed-out]:not(.hide)').addClass('hide');
    };
    /**
     * Hide the elements associated with authenticated users, expose the sign-in button
     *
     * @method signOut
     * @private
     */
    AuthListener.prototype.signOut = function () {
        // If there are [data-signed-in] elements without the "hide" class, add it.
        if ($('[data-signed-in]:not(.hide)').length > 0) {
            $('[data-signed-in]:not(.hide)').addClass('hide');
            // Remove the user's name from all [data-user-name] elements.
            $('[data-user-name]').html('');
            // Set the avatar back to the default.
            $('[data-user-avatar]').attr('src', process.env.DEFAULT_USER_AVATAR_URL);
        }
        // Remove the "hide" class from any [data-signed-out] elements.
        $('[data-signed-out].hide').removeClass('hide');
    };
    return AuthListener;
}());

var SharedHeader = (function () {
    /**
     * @method  constructor
     * @param   {Object}  opts  Options hash to override defaults
     */
    function SharedHeader(opts) {
        if (opts === void 0) { opts = {}; }
        this.options = {
            el: '[data-header]',
            contentBlockTitle: 'sharedGlobalHeader',
            contentBlockCategories: ['common'],
            contentBlockId: 564,
            imgEndpoint: 'https://gatewayint.crossroads.net/gateway/api/image/profile/',
            cmsEndpoint: 'https://contentint.crossroads.net/',
            appEndpoint: 'https://int.crossroads.net/',
            crdsCookiePrefix: 'int'
        };
        Object.assign(this.options, opts);
        window['CRDS'].SharedHeaderConfig = this.options;
        this._utils = new Utilities(this.options);
        this.mobileMenu = new MobileMenu('[data-main-menu]');
    }
    /**
     * Once content block is resolved, kick off methods to build desktop and mobile menus
     *
     * @method  render
     */
    SharedHeader.prototype.render = function () {
        var _this = this;
        var el = document.querySelector(this.options.el);
        if (el === null || el === undefined) {
            return;
        }
        if (el.innerText !== '') {
            this.addHeaderClass();
            this.renderContentInline();
            this.renderSignInButton();
            this.mobileMenu.render(this.options.el);
            this.setupEvents();
        }
        else {
            // Retrieve the content block.
            this._utils.getContentBlockByTitle().then(function (contentBlock) {
                _this.addHeaderClass();
                _this.renderContentBlock(contentBlock);
                _this.renderSignInButton();
                _this.mobileMenu.render(_this.options.el);
                _this.setupEvents();
            });
        }
    };
    /**
     * @method  setupEvents
     * @private
     */
    SharedHeader.prototype.setupEvents = function () {
        this.mobileEvents();
        this.modalEvents();
        // Watch for authentication changes.
        new AuthListener(this.options).start();
    };
    /**
     * @method  mobileEvents
     * @private
     */
    SharedHeader.prototype.mobileEvents = function () {
        // Close the mobile nav whenever a child link is clicked
        var els = document.querySelectorAll('.mobile-menu a');
        for (var i = 0; i < els.length; i++) {
            els[i].addEventListener('click', function (e) {
                var attr = this.getAttribute('data-toggle');
                if (attr === undefined || attr === null) {
                    document.body.classList.remove('modal-open');
                    var el = document.querySelectorAll('.modal-backdrop.fade.in');
                    if (el.length > 0) {
                        el[0].classList.remove('in');
                    }
                    document.getElementById('dismiss-mobile-nav').click();
                }
            });
        }
    };
    /**
     * @method  modalEvents
     * @private
     */
    SharedHeader.prototype.modalEvents = function () {
        var el = $('[data-mobile-menu]').first();
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    if (el.hasClass('in')) {
                        $('html').addClass('noscroll');
                        $('body').addClass('noscroll');
                    }
                    else {
                        $('html').removeClass('noscroll');
                        $('body').removeClass('noscroll');
                    }
                }
            });
        });
        observer.observe(el[0], { attributes: true });
    };
    /**
     * Add "header" class to the outer container.
     *
     * @method  addHeaderClass
     * @private
     */
    SharedHeader.prototype.addHeaderClass = function () {
        $(this.options.el).addClass('header');
    };
    /**
     * Render header via content block
     *
     * @method  renderHeaderContent
     * @private
     * @param   {Object}  contentBlock    content block returned from _utils.getContentBlockByTitle()
     */
    SharedHeader.prototype.renderContentBlock = function (contentBlock) {
        var html = contentBlock['content'];
        this.renderHeader(html);
    };
    /**
     * Render header via inline content
     *
     * @method  renderHeaderInline
     * @private
     */
    SharedHeader.prototype.renderContentInline = function () {
        var html = document.querySelector(this.options.el).innerHTML;
        this.renderHeader(html);
    };
    /**
     * Compile user menu, passed HTML and update options.el with the output
     *
     * @method  renderHeader
     * @private
     * @param   {String}  html  main menu content
     */
    SharedHeader.prototype.renderHeader = function (html) {
        var userHTML = this._utils.render('user_menu', {
            appEndpoint: this.options.appEndpoint
        });
        var headerHTML = this._utils.render('header', {
            mainMenuContent: html,
            appEndpoint: this.options.appEndpoint,
            userMenuContent: userHTML
        });
        $(this.options.el).html(headerHTML);
    };
    /**
     * Add the sign in button.
     * This must be done after the main nav is rendered because the button is added to the main nav.
     *
     * @method renderSignInButton
     * @private
     */
    SharedHeader.prototype.renderSignInButton = function () {
        var signInBtnHTML = this._utils.render('sign_in_button', this.options);
        $(this.options.el + ' ul.nav').append(signInBtnHTML);
    };
    return SharedHeader;
}());

var styles = "@charset \"UTF-8\";\n.crds-shared-header {\n  /* stylelint-disable */\n  /* stylelint-enable */\n  /* stylelint-disable */\n  /* stylelint-enable */\n  /* stylelint-disable */\n  /* stylelint-enable */\n  /*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n  /*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\n  /*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\n  /* Utility classes to change color of text */\n  /* Contents:\n** 1. Image styles\n** 2. Text rules\n** 3. Display helpers\n** 4. Vertical positioning\n** 5. Border stuff\n** 6. Corners\n** 7. Stackable floats\n** 8. Vertical Align\n** 9. Maintain aspect Ratio\n** 10. Margin rules\n** 11. Padding rules\n** 12. Misc.\n*/\n  /* 1. Image styles */\n  /* 2. Text rules */\n  /* 3. Display helpers */\n  /* 4. Vertical positioning */\n  /* 5. Border stuff */\n  /* 6. Corners */\n  /* 7. Stackable floats */\n  /* 8. Vertical align */\n  /* 9. Maintain aspect ratio */\n  /* 10. Margin rules */\n  /* 11. Padding rules */\n  /* 12. Misc. */ }\n  .crds-shared-header html {\n    font-family: sans-serif;\n    -ms-text-size-adjust: 100%;\n    -webkit-text-size-adjust: 100%; }\n  .crds-shared-header body {\n    margin: 0; }\n  .crds-shared-header article,\n  .crds-shared-header aside,\n  .crds-shared-header details,\n  .crds-shared-header figcaption,\n  .crds-shared-header figure,\n  .crds-shared-header footer,\n  .crds-shared-header header,\n  .crds-shared-header hgroup,\n  .crds-shared-header main,\n  .crds-shared-header menu,\n  .crds-shared-header nav,\n  .crds-shared-header section,\n  .crds-shared-header summary {\n    display: block; }\n  .crds-shared-header audio,\n  .crds-shared-header canvas,\n  .crds-shared-header progress,\n  .crds-shared-header video {\n    display: inline-block;\n    vertical-align: baseline; }\n  .crds-shared-header audio:not([controls]) {\n    display: none;\n    height: 0; }\n  .crds-shared-header [hidden],\n  .crds-shared-header template {\n    display: none; }\n  .crds-shared-header a {\n    background-color: transparent; }\n  .crds-shared-header a:active,\n  .crds-shared-header a:hover {\n    outline: 0; }\n  .crds-shared-header abbr[title] {\n    border-bottom: 1px dotted; }\n  .crds-shared-header b,\n  .crds-shared-header strong {\n    font-weight: bold; }\n  .crds-shared-header dfn {\n    font-style: italic; }\n  .crds-shared-header h1 {\n    font-size: 2em;\n    margin: 0.67em 0; }\n  .crds-shared-header mark {\n    background: #ff0;\n    color: #000; }\n  .crds-shared-header small {\n    font-size: 80%; }\n  .crds-shared-header sub,\n  .crds-shared-header sup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline; }\n  .crds-shared-header sup {\n    top: -0.5em; }\n  .crds-shared-header sub {\n    bottom: -0.25em; }\n  .crds-shared-header img {\n    border: 0; }\n  .crds-shared-header svg:not(:root) {\n    overflow: hidden; }\n  .crds-shared-header figure {\n    margin: 1em 40px; }\n  .crds-shared-header hr {\n    box-sizing: content-box;\n    height: 0; }\n  .crds-shared-header pre {\n    overflow: auto; }\n  .crds-shared-header code,\n  .crds-shared-header kbd,\n  .crds-shared-header pre,\n  .crds-shared-header samp {\n    font-family: monospace, monospace;\n    font-size: 1em; }\n  .crds-shared-header button,\n  .crds-shared-header input,\n  .crds-shared-header optgroup,\n  .crds-shared-header select,\n  .crds-shared-header textarea {\n    color: inherit;\n    font: inherit;\n    margin: 0; }\n  .crds-shared-header button {\n    overflow: visible; }\n  .crds-shared-header button,\n  .crds-shared-header select {\n    text-transform: none; }\n  .crds-shared-header button,\n  .crds-shared-header html input[type=\"button\"],\n  .crds-shared-header input[type=\"reset\"],\n  .crds-shared-header input[type=\"submit\"] {\n    -webkit-appearance: button;\n    cursor: pointer; }\n  .crds-shared-header button[disabled],\n  .crds-shared-header html input[disabled] {\n    cursor: default; }\n  .crds-shared-header button::-moz-focus-inner,\n  .crds-shared-header input::-moz-focus-inner {\n    border: 0;\n    padding: 0; }\n  .crds-shared-header input {\n    line-height: normal; }\n  .crds-shared-header input[type=\"checkbox\"],\n  .crds-shared-header input[type=\"radio\"] {\n    box-sizing: border-box;\n    padding: 0; }\n  .crds-shared-header input[type=\"number\"]::-webkit-inner-spin-button,\n  .crds-shared-header input[type=\"number\"]::-webkit-outer-spin-button {\n    height: auto; }\n  .crds-shared-header input[type=\"search\"] {\n    -webkit-appearance: textfield;\n    box-sizing: content-box; }\n  .crds-shared-header input[type=\"search\"]::-webkit-search-cancel-button,\n  .crds-shared-header input[type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none; }\n  .crds-shared-header fieldset {\n    border: 1px solid #c0c0c0;\n    margin: 0 2px;\n    padding: 0.35em 0.625em 0.75em; }\n  .crds-shared-header legend {\n    border: 0;\n    padding: 0; }\n  .crds-shared-header textarea {\n    overflow: auto; }\n  .crds-shared-header optgroup {\n    font-weight: bold; }\n  .crds-shared-header table {\n    border-collapse: collapse;\n    border-spacing: 0; }\n  .crds-shared-header td,\n  .crds-shared-header th {\n    padding: 0; }\n  @media print {\n    .crds-shared-header *,\n    .crds-shared-header *:before,\n    .crds-shared-header *:after {\n      background: transparent !important;\n      color: #000 !important;\n      box-shadow: none !important;\n      text-shadow: none !important; }\n    .crds-shared-header a,\n    .crds-shared-header a:visited {\n      text-decoration: underline; }\n    .crds-shared-header a[href]:after {\n      content: \" (\" attr(href) \")\"; }\n    .crds-shared-header abbr[title]:after {\n      content: \" (\" attr(title) \")\"; }\n    .crds-shared-header a[href^=\"#\"]:after,\n    .crds-shared-header a[href^=\"javascript:\"]:after {\n      content: \"\"; }\n    .crds-shared-header pre,\n    .crds-shared-header blockquote {\n      border: 1px solid #999;\n      page-break-inside: avoid; }\n    .crds-shared-header thead {\n      display: table-header-group; }\n    .crds-shared-header tr,\n    .crds-shared-header img {\n      page-break-inside: avoid; }\n    .crds-shared-header img {\n      max-width: 100% !important; }\n    .crds-shared-header p,\n    .crds-shared-header h2,\n    .crds-shared-header h3 {\n      orphans: 3;\n      widows: 3; }\n    .crds-shared-header h2,\n    .crds-shared-header h3 {\n      page-break-after: avoid; }\n    .crds-shared-header .navbar {\n      display: none; }\n    .crds-shared-header .btn > .caret,\n    .crds-shared-header .dropup > .btn > .caret {\n      border-top-color: #000 !important; }\n    .crds-shared-header .label {\n      border: 1px solid #000; }\n    .crds-shared-header .table {\n      border-collapse: collapse !important; }\n      .crds-shared-header .table td,\n      .crds-shared-header .table th {\n        background-color: #fff !important; }\n    .crds-shared-header .table-bordered th,\n    .crds-shared-header .table-bordered td {\n      border: 1px solid #ddd !important; } }\n\n@font-face {\n  font-family: 'Glyphicons Halflings';\n  src: url(twbs-font-path(\"bootstrap/glyphicons-halflings-regular.eot\"));\n  src: url(twbs-font-path(\"bootstrap/glyphicons-halflings-regular.eot?#iefix\")) format(\"embedded-opentype\"), url(twbs-font-path(\"bootstrap/glyphicons-halflings-regular.woff2\")) format(\"woff2\"), url(twbs-font-path(\"bootstrap/glyphicons-halflings-regular.woff\")) format(\"woff\"), url(twbs-font-path(\"bootstrap/glyphicons-halflings-regular.ttf\")) format(\"truetype\"), url(twbs-font-path(\"bootstrap/glyphicons-halflings-regular.svg#glyphicons_halflingsregular\")) format(\"svg\"); }\n  .crds-shared-header .glyphicon {\n    position: relative;\n    top: 1px;\n    display: inline-block;\n    font-family: 'Glyphicons Halflings';\n    font-style: normal;\n    font-weight: normal;\n    line-height: 1;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale; }\n  .crds-shared-header .glyphicon-asterisk:before {\n    content: \"\\002a\"; }\n  .crds-shared-header .glyphicon-plus:before {\n    content: \"\\002b\"; }\n  .crds-shared-header .glyphicon-euro:before,\n  .crds-shared-header .glyphicon-eur:before {\n    content: \"\\20ac\"; }\n  .crds-shared-header .glyphicon-minus:before {\n    content: \"\\2212\"; }\n  .crds-shared-header .glyphicon-cloud:before {\n    content: \"\\2601\"; }\n  .crds-shared-header .glyphicon-envelope:before {\n    content: \"\\2709\"; }\n  .crds-shared-header .glyphicon-pencil:before {\n    content: \"\\270f\"; }\n  .crds-shared-header .glyphicon-glass:before {\n    content: \"\\e001\"; }\n  .crds-shared-header .glyphicon-music:before {\n    content: \"\\e002\"; }\n  .crds-shared-header .glyphicon-search:before {\n    content: \"\\e003\"; }\n  .crds-shared-header .glyphicon-heart:before {\n    content: \"\\e005\"; }\n  .crds-shared-header .glyphicon-star:before {\n    content: \"\\e006\"; }\n  .crds-shared-header .glyphicon-star-empty:before {\n    content: \"\\e007\"; }\n  .crds-shared-header .glyphicon-user:before {\n    content: \"\\e008\"; }\n  .crds-shared-header .glyphicon-film:before {\n    content: \"\\e009\"; }\n  .crds-shared-header .glyphicon-th-large:before {\n    content: \"\\e010\"; }\n  .crds-shared-header .glyphicon-th:before {\n    content: \"\\e011\"; }\n  .crds-shared-header .glyphicon-th-list:before {\n    content: \"\\e012\"; }\n  .crds-shared-header .glyphicon-ok:before {\n    content: \"\\e013\"; }\n  .crds-shared-header .glyphicon-remove:before {\n    content: \"\\e014\"; }\n  .crds-shared-header .glyphicon-zoom-in:before {\n    content: \"\\e015\"; }\n  .crds-shared-header .glyphicon-zoom-out:before {\n    content: \"\\e016\"; }\n  .crds-shared-header .glyphicon-off:before {\n    content: \"\\e017\"; }\n  .crds-shared-header .glyphicon-signal:before {\n    content: \"\\e018\"; }\n  .crds-shared-header .glyphicon-cog:before {\n    content: \"\\e019\"; }\n  .crds-shared-header .glyphicon-trash:before {\n    content: \"\\e020\"; }\n  .crds-shared-header .glyphicon-home:before {\n    content: \"\\e021\"; }\n  .crds-shared-header .glyphicon-file:before {\n    content: \"\\e022\"; }\n  .crds-shared-header .glyphicon-time:before {\n    content: \"\\e023\"; }\n  .crds-shared-header .glyphicon-road:before {\n    content: \"\\e024\"; }\n  .crds-shared-header .glyphicon-download-alt:before {\n    content: \"\\e025\"; }\n  .crds-shared-header .glyphicon-download:before {\n    content: \"\\e026\"; }\n  .crds-shared-header .glyphicon-upload:before {\n    content: \"\\e027\"; }\n  .crds-shared-header .glyphicon-inbox:before {\n    content: \"\\e028\"; }\n  .crds-shared-header .glyphicon-play-circle:before {\n    content: \"\\e029\"; }\n  .crds-shared-header .glyphicon-repeat:before {\n    content: \"\\e030\"; }\n  .crds-shared-header .glyphicon-refresh:before {\n    content: \"\\e031\"; }\n  .crds-shared-header .glyphicon-list-alt:before {\n    content: \"\\e032\"; }\n  .crds-shared-header .glyphicon-lock:before {\n    content: \"\\e033\"; }\n  .crds-shared-header .glyphicon-flag:before {\n    content: \"\\e034\"; }\n  .crds-shared-header .glyphicon-headphones:before {\n    content: \"\\e035\"; }\n  .crds-shared-header .glyphicon-volume-off:before {\n    content: \"\\e036\"; }\n  .crds-shared-header .glyphicon-volume-down:before {\n    content: \"\\e037\"; }\n  .crds-shared-header .glyphicon-volume-up:before {\n    content: \"\\e038\"; }\n  .crds-shared-header .glyphicon-qrcode:before {\n    content: \"\\e039\"; }\n  .crds-shared-header .glyphicon-barcode:before {\n    content: \"\\e040\"; }\n  .crds-shared-header .glyphicon-tag:before {\n    content: \"\\e041\"; }\n  .crds-shared-header .glyphicon-tags:before {\n    content: \"\\e042\"; }\n  .crds-shared-header .glyphicon-book:before {\n    content: \"\\e043\"; }\n  .crds-shared-header .glyphicon-bookmark:before {\n    content: \"\\e044\"; }\n  .crds-shared-header .glyphicon-print:before {\n    content: \"\\e045\"; }\n  .crds-shared-header .glyphicon-camera:before {\n    content: \"\\e046\"; }\n  .crds-shared-header .glyphicon-font:before {\n    content: \"\\e047\"; }\n  .crds-shared-header .glyphicon-bold:before {\n    content: \"\\e048\"; }\n  .crds-shared-header .glyphicon-italic:before {\n    content: \"\\e049\"; }\n  .crds-shared-header .glyphicon-text-height:before {\n    content: \"\\e050\"; }\n  .crds-shared-header .glyphicon-text-width:before {\n    content: \"\\e051\"; }\n  .crds-shared-header .glyphicon-align-left:before {\n    content: \"\\e052\"; }\n  .crds-shared-header .glyphicon-align-center:before {\n    content: \"\\e053\"; }\n  .crds-shared-header .glyphicon-align-right:before {\n    content: \"\\e054\"; }\n  .crds-shared-header .glyphicon-align-justify:before {\n    content: \"\\e055\"; }\n  .crds-shared-header .glyphicon-list:before {\n    content: \"\\e056\"; }\n  .crds-shared-header .glyphicon-indent-left:before {\n    content: \"\\e057\"; }\n  .crds-shared-header .glyphicon-indent-right:before {\n    content: \"\\e058\"; }\n  .crds-shared-header .glyphicon-facetime-video:before {\n    content: \"\\e059\"; }\n  .crds-shared-header .glyphicon-picture:before {\n    content: \"\\e060\"; }\n  .crds-shared-header .glyphicon-map-marker:before {\n    content: \"\\e062\"; }\n  .crds-shared-header .glyphicon-adjust:before {\n    content: \"\\e063\"; }\n  .crds-shared-header .glyphicon-tint:before {\n    content: \"\\e064\"; }\n  .crds-shared-header .glyphicon-edit:before {\n    content: \"\\e065\"; }\n  .crds-shared-header .glyphicon-share:before {\n    content: \"\\e066\"; }\n  .crds-shared-header .glyphicon-check:before {\n    content: \"\\e067\"; }\n  .crds-shared-header .glyphicon-move:before {\n    content: \"\\e068\"; }\n  .crds-shared-header .glyphicon-step-backward:before {\n    content: \"\\e069\"; }\n  .crds-shared-header .glyphicon-fast-backward:before {\n    content: \"\\e070\"; }\n  .crds-shared-header .glyphicon-backward:before {\n    content: \"\\e071\"; }\n  .crds-shared-header .glyphicon-play:before {\n    content: \"\\e072\"; }\n  .crds-shared-header .glyphicon-pause:before {\n    content: \"\\e073\"; }\n  .crds-shared-header .glyphicon-stop:before {\n    content: \"\\e074\"; }\n  .crds-shared-header .glyphicon-forward:before {\n    content: \"\\e075\"; }\n  .crds-shared-header .glyphicon-fast-forward:before {\n    content: \"\\e076\"; }\n  .crds-shared-header .glyphicon-step-forward:before {\n    content: \"\\e077\"; }\n  .crds-shared-header .glyphicon-eject:before {\n    content: \"\\e078\"; }\n  .crds-shared-header .glyphicon-chevron-left:before {\n    content: \"\\e079\"; }\n  .crds-shared-header .glyphicon-chevron-right:before {\n    content: \"\\e080\"; }\n  .crds-shared-header .glyphicon-plus-sign:before {\n    content: \"\\e081\"; }\n  .crds-shared-header .glyphicon-minus-sign:before {\n    content: \"\\e082\"; }\n  .crds-shared-header .glyphicon-remove-sign:before {\n    content: \"\\e083\"; }\n  .crds-shared-header .glyphicon-ok-sign:before {\n    content: \"\\e084\"; }\n  .crds-shared-header .glyphicon-question-sign:before {\n    content: \"\\e085\"; }\n  .crds-shared-header .glyphicon-info-sign:before {\n    content: \"\\e086\"; }\n  .crds-shared-header .glyphicon-screenshot:before {\n    content: \"\\e087\"; }\n  .crds-shared-header .glyphicon-remove-circle:before {\n    content: \"\\e088\"; }\n  .crds-shared-header .glyphicon-ok-circle:before {\n    content: \"\\e089\"; }\n  .crds-shared-header .glyphicon-ban-circle:before {\n    content: \"\\e090\"; }\n  .crds-shared-header .glyphicon-arrow-left:before {\n    content: \"\\e091\"; }\n  .crds-shared-header .glyphicon-arrow-right:before {\n    content: \"\\e092\"; }\n  .crds-shared-header .glyphicon-arrow-up:before {\n    content: \"\\e093\"; }\n  .crds-shared-header .glyphicon-arrow-down:before {\n    content: \"\\e094\"; }\n  .crds-shared-header .glyphicon-share-alt:before {\n    content: \"\\e095\"; }\n  .crds-shared-header .glyphicon-resize-full:before {\n    content: \"\\e096\"; }\n  .crds-shared-header .glyphicon-resize-small:before {\n    content: \"\\e097\"; }\n  .crds-shared-header .glyphicon-exclamation-sign:before {\n    content: \"\\e101\"; }\n  .crds-shared-header .glyphicon-gift:before {\n    content: \"\\e102\"; }\n  .crds-shared-header .glyphicon-leaf:before {\n    content: \"\\e103\"; }\n  .crds-shared-header .glyphicon-fire:before {\n    content: \"\\e104\"; }\n  .crds-shared-header .glyphicon-eye-open:before {\n    content: \"\\e105\"; }\n  .crds-shared-header .glyphicon-eye-close:before {\n    content: \"\\e106\"; }\n  .crds-shared-header .glyphicon-warning-sign:before {\n    content: \"\\e107\"; }\n  .crds-shared-header .glyphicon-plane:before {\n    content: \"\\e108\"; }\n  .crds-shared-header .glyphicon-calendar:before {\n    content: \"\\e109\"; }\n  .crds-shared-header .glyphicon-random:before {\n    content: \"\\e110\"; }\n  .crds-shared-header .glyphicon-comment:before {\n    content: \"\\e111\"; }\n  .crds-shared-header .glyphicon-magnet:before {\n    content: \"\\e112\"; }\n  .crds-shared-header .glyphicon-chevron-up:before {\n    content: \"\\e113\"; }\n  .crds-shared-header .glyphicon-chevron-down:before {\n    content: \"\\e114\"; }\n  .crds-shared-header .glyphicon-retweet:before {\n    content: \"\\e115\"; }\n  .crds-shared-header .glyphicon-shopping-cart:before {\n    content: \"\\e116\"; }\n  .crds-shared-header .glyphicon-folder-close:before {\n    content: \"\\e117\"; }\n  .crds-shared-header .glyphicon-folder-open:before {\n    content: \"\\e118\"; }\n  .crds-shared-header .glyphicon-resize-vertical:before {\n    content: \"\\e119\"; }\n  .crds-shared-header .glyphicon-resize-horizontal:before {\n    content: \"\\e120\"; }\n  .crds-shared-header .glyphicon-hdd:before {\n    content: \"\\e121\"; }\n  .crds-shared-header .glyphicon-bullhorn:before {\n    content: \"\\e122\"; }\n  .crds-shared-header .glyphicon-bell:before {\n    content: \"\\e123\"; }\n  .crds-shared-header .glyphicon-certificate:before {\n    content: \"\\e124\"; }\n  .crds-shared-header .glyphicon-thumbs-up:before {\n    content: \"\\e125\"; }\n  .crds-shared-header .glyphicon-thumbs-down:before {\n    content: \"\\e126\"; }\n  .crds-shared-header .glyphicon-hand-right:before {\n    content: \"\\e127\"; }\n  .crds-shared-header .glyphicon-hand-left:before {\n    content: \"\\e128\"; }\n  .crds-shared-header .glyphicon-hand-up:before {\n    content: \"\\e129\"; }\n  .crds-shared-header .glyphicon-hand-down:before {\n    content: \"\\e130\"; }\n  .crds-shared-header .glyphicon-circle-arrow-right:before {\n    content: \"\\e131\"; }\n  .crds-shared-header .glyphicon-circle-arrow-left:before {\n    content: \"\\e132\"; }\n  .crds-shared-header .glyphicon-circle-arrow-up:before {\n    content: \"\\e133\"; }\n  .crds-shared-header .glyphicon-circle-arrow-down:before {\n    content: \"\\e134\"; }\n  .crds-shared-header .glyphicon-globe:before {\n    content: \"\\e135\"; }\n  .crds-shared-header .glyphicon-wrench:before {\n    content: \"\\e136\"; }\n  .crds-shared-header .glyphicon-tasks:before {\n    content: \"\\e137\"; }\n  .crds-shared-header .glyphicon-filter:before {\n    content: \"\\e138\"; }\n  .crds-shared-header .glyphicon-briefcase:before {\n    content: \"\\e139\"; }\n  .crds-shared-header .glyphicon-fullscreen:before {\n    content: \"\\e140\"; }\n  .crds-shared-header .glyphicon-dashboard:before {\n    content: \"\\e141\"; }\n  .crds-shared-header .glyphicon-paperclip:before {\n    content: \"\\e142\"; }\n  .crds-shared-header .glyphicon-heart-empty:before {\n    content: \"\\e143\"; }\n  .crds-shared-header .glyphicon-link:before {\n    content: \"\\e144\"; }\n  .crds-shared-header .glyphicon-phone:before {\n    content: \"\\e145\"; }\n  .crds-shared-header .glyphicon-pushpin:before {\n    content: \"\\e146\"; }\n  .crds-shared-header .glyphicon-usd:before {\n    content: \"\\e148\"; }\n  .crds-shared-header .glyphicon-gbp:before {\n    content: \"\\e149\"; }\n  .crds-shared-header .glyphicon-sort:before {\n    content: \"\\e150\"; }\n  .crds-shared-header .glyphicon-sort-by-alphabet:before {\n    content: \"\\e151\"; }\n  .crds-shared-header .glyphicon-sort-by-alphabet-alt:before {\n    content: \"\\e152\"; }\n  .crds-shared-header .glyphicon-sort-by-order:before {\n    content: \"\\e153\"; }\n  .crds-shared-header .glyphicon-sort-by-order-alt:before {\n    content: \"\\e154\"; }\n  .crds-shared-header .glyphicon-sort-by-attributes:before {\n    content: \"\\e155\"; }\n  .crds-shared-header .glyphicon-sort-by-attributes-alt:before {\n    content: \"\\e156\"; }\n  .crds-shared-header .glyphicon-unchecked:before {\n    content: \"\\e157\"; }\n  .crds-shared-header .glyphicon-expand:before {\n    content: \"\\e158\"; }\n  .crds-shared-header .glyphicon-collapse-down:before {\n    content: \"\\e159\"; }\n  .crds-shared-header .glyphicon-collapse-up:before {\n    content: \"\\e160\"; }\n  .crds-shared-header .glyphicon-log-in:before {\n    content: \"\\e161\"; }\n  .crds-shared-header .glyphicon-flash:before {\n    content: \"\\e162\"; }\n  .crds-shared-header .glyphicon-log-out:before {\n    content: \"\\e163\"; }\n  .crds-shared-header .glyphicon-new-window:before {\n    content: \"\\e164\"; }\n  .crds-shared-header .glyphicon-record:before {\n    content: \"\\e165\"; }\n  .crds-shared-header .glyphicon-save:before {\n    content: \"\\e166\"; }\n  .crds-shared-header .glyphicon-open:before {\n    content: \"\\e167\"; }\n  .crds-shared-header .glyphicon-saved:before {\n    content: \"\\e168\"; }\n  .crds-shared-header .glyphicon-import:before {\n    content: \"\\e169\"; }\n  .crds-shared-header .glyphicon-export:before {\n    content: \"\\e170\"; }\n  .crds-shared-header .glyphicon-send:before {\n    content: \"\\e171\"; }\n  .crds-shared-header .glyphicon-floppy-disk:before {\n    content: \"\\e172\"; }\n  .crds-shared-header .glyphicon-floppy-saved:before {\n    content: \"\\e173\"; }\n  .crds-shared-header .glyphicon-floppy-remove:before {\n    content: \"\\e174\"; }\n  .crds-shared-header .glyphicon-floppy-save:before {\n    content: \"\\e175\"; }\n  .crds-shared-header .glyphicon-floppy-open:before {\n    content: \"\\e176\"; }\n  .crds-shared-header .glyphicon-credit-card:before {\n    content: \"\\e177\"; }\n  .crds-shared-header .glyphicon-transfer:before {\n    content: \"\\e178\"; }\n  .crds-shared-header .glyphicon-cutlery:before {\n    content: \"\\e179\"; }\n  .crds-shared-header .glyphicon-header:before {\n    content: \"\\e180\"; }\n  .crds-shared-header .glyphicon-compressed:before {\n    content: \"\\e181\"; }\n  .crds-shared-header .glyphicon-earphone:before {\n    content: \"\\e182\"; }\n  .crds-shared-header .glyphicon-phone-alt:before {\n    content: \"\\e183\"; }\n  .crds-shared-header .glyphicon-tower:before {\n    content: \"\\e184\"; }\n  .crds-shared-header .glyphicon-stats:before {\n    content: \"\\e185\"; }\n  .crds-shared-header .glyphicon-sd-video:before {\n    content: \"\\e186\"; }\n  .crds-shared-header .glyphicon-hd-video:before {\n    content: \"\\e187\"; }\n  .crds-shared-header .glyphicon-subtitles:before {\n    content: \"\\e188\"; }\n  .crds-shared-header .glyphicon-sound-stereo:before {\n    content: \"\\e189\"; }\n  .crds-shared-header .glyphicon-sound-dolby:before {\n    content: \"\\e190\"; }\n  .crds-shared-header .glyphicon-sound-5-1:before {\n    content: \"\\e191\"; }\n  .crds-shared-header .glyphicon-sound-6-1:before {\n    content: \"\\e192\"; }\n  .crds-shared-header .glyphicon-sound-7-1:before {\n    content: \"\\e193\"; }\n  .crds-shared-header .glyphicon-copyright-mark:before {\n    content: \"\\e194\"; }\n  .crds-shared-header .glyphicon-registration-mark:before {\n    content: \"\\e195\"; }\n  .crds-shared-header .glyphicon-cloud-download:before {\n    content: \"\\e197\"; }\n  .crds-shared-header .glyphicon-cloud-upload:before {\n    content: \"\\e198\"; }\n  .crds-shared-header .glyphicon-tree-conifer:before {\n    content: \"\\e199\"; }\n  .crds-shared-header .glyphicon-tree-deciduous:before {\n    content: \"\\e200\"; }\n  .crds-shared-header .glyphicon-cd:before {\n    content: \"\\e201\"; }\n  .crds-shared-header .glyphicon-save-file:before {\n    content: \"\\e202\"; }\n  .crds-shared-header .glyphicon-open-file:before {\n    content: \"\\e203\"; }\n  .crds-shared-header .glyphicon-level-up:before {\n    content: \"\\e204\"; }\n  .crds-shared-header .glyphicon-copy:before {\n    content: \"\\e205\"; }\n  .crds-shared-header .glyphicon-paste:before {\n    content: \"\\e206\"; }\n  .crds-shared-header .glyphicon-alert:before {\n    content: \"\\e209\"; }\n  .crds-shared-header .glyphicon-equalizer:before {\n    content: \"\\e210\"; }\n  .crds-shared-header .glyphicon-king:before {\n    content: \"\\e211\"; }\n  .crds-shared-header .glyphicon-queen:before {\n    content: \"\\e212\"; }\n  .crds-shared-header .glyphicon-pawn:before {\n    content: \"\\e213\"; }\n  .crds-shared-header .glyphicon-bishop:before {\n    content: \"\\e214\"; }\n  .crds-shared-header .glyphicon-knight:before {\n    content: \"\\e215\"; }\n  .crds-shared-header .glyphicon-baby-formula:before {\n    content: \"\\e216\"; }\n  .crds-shared-header .glyphicon-tent:before {\n    content: \"\\26fa\"; }\n  .crds-shared-header .glyphicon-blackboard:before {\n    content: \"\\e218\"; }\n  .crds-shared-header .glyphicon-bed:before {\n    content: \"\\e219\"; }\n  .crds-shared-header .glyphicon-apple:before {\n    content: \"\\f8ff\"; }\n  .crds-shared-header .glyphicon-erase:before {\n    content: \"\\e221\"; }\n  .crds-shared-header .glyphicon-hourglass:before {\n    content: \"\\231b\"; }\n  .crds-shared-header .glyphicon-lamp:before {\n    content: \"\\e223\"; }\n  .crds-shared-header .glyphicon-duplicate:before {\n    content: \"\\e224\"; }\n  .crds-shared-header .glyphicon-piggy-bank:before {\n    content: \"\\e225\"; }\n  .crds-shared-header .glyphicon-scissors:before {\n    content: \"\\e226\"; }\n  .crds-shared-header .glyphicon-bitcoin:before {\n    content: \"\\e227\"; }\n  .crds-shared-header .glyphicon-btc:before {\n    content: \"\\e227\"; }\n  .crds-shared-header .glyphicon-xbt:before {\n    content: \"\\e227\"; }\n  .crds-shared-header .glyphicon-yen:before {\n    content: \"\\00a5\"; }\n  .crds-shared-header .glyphicon-jpy:before {\n    content: \"\\00a5\"; }\n  .crds-shared-header .glyphicon-ruble:before {\n    content: \"\\20bd\"; }\n  .crds-shared-header .glyphicon-rub:before {\n    content: \"\\20bd\"; }\n  .crds-shared-header .glyphicon-scale:before {\n    content: \"\\e230\"; }\n  .crds-shared-header .glyphicon-ice-lolly:before {\n    content: \"\\e231\"; }\n  .crds-shared-header .glyphicon-ice-lolly-tasted:before {\n    content: \"\\e232\"; }\n  .crds-shared-header .glyphicon-education:before {\n    content: \"\\e233\"; }\n  .crds-shared-header .glyphicon-option-horizontal:before {\n    content: \"\\e234\"; }\n  .crds-shared-header .glyphicon-option-vertical:before {\n    content: \"\\e235\"; }\n  .crds-shared-header .glyphicon-menu-hamburger:before {\n    content: \"\\e236\"; }\n  .crds-shared-header .glyphicon-modal-window:before {\n    content: \"\\e237\"; }\n  .crds-shared-header .glyphicon-oil:before {\n    content: \"\\e238\"; }\n  .crds-shared-header .glyphicon-grain:before {\n    content: \"\\e239\"; }\n  .crds-shared-header .glyphicon-sunglasses:before {\n    content: \"\\e240\"; }\n  .crds-shared-header .glyphicon-text-size:before {\n    content: \"\\e241\"; }\n  .crds-shared-header .glyphicon-text-color:before {\n    content: \"\\e242\"; }\n  .crds-shared-header .glyphicon-text-background:before {\n    content: \"\\e243\"; }\n  .crds-shared-header .glyphicon-object-align-top:before {\n    content: \"\\e244\"; }\n  .crds-shared-header .glyphicon-object-align-bottom:before {\n    content: \"\\e245\"; }\n  .crds-shared-header .glyphicon-object-align-horizontal:before {\n    content: \"\\e246\"; }\n  .crds-shared-header .glyphicon-object-align-left:before {\n    content: \"\\e247\"; }\n  .crds-shared-header .glyphicon-object-align-vertical:before {\n    content: \"\\e248\"; }\n  .crds-shared-header .glyphicon-object-align-right:before {\n    content: \"\\e249\"; }\n  .crds-shared-header .glyphicon-triangle-right:before {\n    content: \"\\e250\"; }\n  .crds-shared-header .glyphicon-triangle-left:before {\n    content: \"\\e251\"; }\n  .crds-shared-header .glyphicon-triangle-bottom:before {\n    content: \"\\e252\"; }\n  .crds-shared-header .glyphicon-triangle-top:before {\n    content: \"\\e253\"; }\n  .crds-shared-header .glyphicon-console:before {\n    content: \"\\e254\"; }\n  .crds-shared-header .glyphicon-superscript:before {\n    content: \"\\e255\"; }\n  .crds-shared-header .glyphicon-subscript:before {\n    content: \"\\e256\"; }\n  .crds-shared-header .glyphicon-menu-left:before {\n    content: \"\\e257\"; }\n  .crds-shared-header .glyphicon-menu-right:before {\n    content: \"\\e258\"; }\n  .crds-shared-header .glyphicon-menu-down:before {\n    content: \"\\e259\"; }\n  .crds-shared-header .glyphicon-menu-up:before {\n    content: \"\\e260\"; }\n  .crds-shared-header * {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n  .crds-shared-header *:before,\n  .crds-shared-header *:after {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n  .crds-shared-header html {\n    font-size: 10px;\n    -webkit-tap-highlight-color: transparent; }\n  .crds-shared-header body {\n    font-family: \"acumin-pro\", helvetica, arial, sans-serif;\n    font-size: 16px;\n    line-height: 1.5;\n    color: #4d4d4d;\n    background-color: white; }\n  .crds-shared-header input,\n  .crds-shared-header button,\n  .crds-shared-header select,\n  .crds-shared-header textarea {\n    font-family: inherit;\n    font-size: inherit;\n    line-height: inherit; }\n  .crds-shared-header a {\n    color: #0095d9;\n    text-decoration: none; }\n    .crds-shared-header a:hover, .crds-shared-header a:focus {\n      color: #006d9e;\n      text-decoration: underline; }\n    .crds-shared-header a:focus {\n      outline: 5px auto -webkit-focus-ring-color;\n      outline-offset: -2px; }\n  .crds-shared-header figure {\n    margin: 0; }\n  .crds-shared-header img {\n    vertical-align: middle; }\n  .crds-shared-header .img-responsive {\n    display: block;\n    max-width: 100%;\n    height: auto; }\n  .crds-shared-header .img-rounded {\n    border-radius: 4px; }\n  .crds-shared-header .img-thumbnail {\n    padding: 4px;\n    line-height: 1.5;\n    background-color: white;\n    border: 1px solid #ddd;\n    border-radius: 4px;\n    -webkit-transition: all 0.2s ease-in-out;\n    -o-transition: all 0.2s ease-in-out;\n    transition: all 0.2s ease-in-out;\n    display: inline-block;\n    max-width: 100%;\n    height: auto; }\n  .crds-shared-header .img-circle {\n    border-radius: 50%; }\n  .crds-shared-header hr {\n    margin-top: 24px;\n    margin-bottom: 24px;\n    border: 0;\n    border-top: 1px solid #e7e7e7; }\n  .crds-shared-header .sr-only {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    margin: -1px;\n    padding: 0;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    border: 0; }\n  .crds-shared-header .sr-only-focusable:active, .crds-shared-header .sr-only-focusable:focus {\n    position: static;\n    width: auto;\n    height: auto;\n    margin: 0;\n    overflow: visible;\n    clip: auto; }\n  .crds-shared-header [role=\"button\"] {\n    cursor: pointer; }\n  .crds-shared-header h1, .crds-shared-header h2, .crds-shared-header h3, .crds-shared-header h4, .crds-shared-header h5, .crds-shared-header h6,\n  .crds-shared-header .h1, .crds-shared-header .h2, .crds-shared-header .h3, .crds-shared-header .h4, .crds-shared-header .h5, .crds-shared-header .h6 {\n    font-family: inherit;\n    font-weight: 300;\n    line-height: 1.1;\n    color: #151515; }\n    .crds-shared-header h1 small,\n    .crds-shared-header h1 .small, .crds-shared-header h2 small,\n    .crds-shared-header h2 .small, .crds-shared-header h3 small,\n    .crds-shared-header h3 .small, .crds-shared-header h4 small,\n    .crds-shared-header h4 .small, .crds-shared-header h5 small,\n    .crds-shared-header h5 .small, .crds-shared-header h6 small,\n    .crds-shared-header h6 .small,\n    .crds-shared-header .h1 small,\n    .crds-shared-header .h1 .small, .crds-shared-header .h2 small,\n    .crds-shared-header .h2 .small, .crds-shared-header .h3 small,\n    .crds-shared-header .h3 .small, .crds-shared-header .h4 small,\n    .crds-shared-header .h4 .small, .crds-shared-header .h5 small,\n    .crds-shared-header .h5 .small, .crds-shared-header .h6 small,\n    .crds-shared-header .h6 .small {\n      font-weight: normal;\n      line-height: 1;\n      color: #979797; }\n  .crds-shared-header h1, .crds-shared-header .h1,\n  .crds-shared-header h2, .crds-shared-header .h2,\n  .crds-shared-header h3, .crds-shared-header .h3 {\n    margin-top: 24px;\n    margin-bottom: 12px; }\n    .crds-shared-header h1 small,\n    .crds-shared-header h1 .small, .crds-shared-header .h1 small,\n    .crds-shared-header .h1 .small,\n    .crds-shared-header h2 small,\n    .crds-shared-header h2 .small, .crds-shared-header .h2 small,\n    .crds-shared-header .h2 .small,\n    .crds-shared-header h3 small,\n    .crds-shared-header h3 .small, .crds-shared-header .h3 small,\n    .crds-shared-header .h3 .small {\n      font-size: 65%; }\n  .crds-shared-header h4, .crds-shared-header .h4,\n  .crds-shared-header h5, .crds-shared-header .h5,\n  .crds-shared-header h6, .crds-shared-header .h6 {\n    margin-top: 12px;\n    margin-bottom: 12px; }\n    .crds-shared-header h4 small,\n    .crds-shared-header h4 .small, .crds-shared-header .h4 small,\n    .crds-shared-header .h4 .small,\n    .crds-shared-header h5 small,\n    .crds-shared-header h5 .small, .crds-shared-header .h5 small,\n    .crds-shared-header .h5 .small,\n    .crds-shared-header h6 small,\n    .crds-shared-header h6 .small, .crds-shared-header .h6 small,\n    .crds-shared-header .h6 .small {\n      font-size: 75%; }\n  .crds-shared-header h1, .crds-shared-header .h1 {\n    font-size: 2.75rem; }\n  .crds-shared-header h2, .crds-shared-header .h2 {\n    font-size: 2.5rem; }\n  .crds-shared-header h3, .crds-shared-header .h3 {\n    font-size: 2rem; }\n  .crds-shared-header h4, .crds-shared-header .h4 {\n    font-size: 1.75rem; }\n  .crds-shared-header h5, .crds-shared-header .h5 {\n    font-size: 1.375rem; }\n  .crds-shared-header h6, .crds-shared-header .h6 {\n    font-size: 1.1875rem; }\n  .crds-shared-header p {\n    margin: 0 0 12px; }\n  .crds-shared-header .lead {\n    margin-bottom: 24px;\n    font-size: 18px;\n    font-weight: 300;\n    line-height: 1.4; }\n    @media (min-width: 768px) {\n      .crds-shared-header .lead {\n        font-size: 24px; } }\n  .crds-shared-header small,\n  .crds-shared-header .small {\n    font-size: 87%; }\n  .crds-shared-header mark,\n  .crds-shared-header .mark {\n    background-color: #debc73;\n    padding: .2em; }\n  .crds-shared-header .text-left {\n    text-align: left; }\n  .crds-shared-header .text-right {\n    text-align: right; }\n  .crds-shared-header .text-center {\n    text-align: center; }\n  .crds-shared-header .text-justify {\n    text-align: justify; }\n  .crds-shared-header .text-nowrap {\n    white-space: nowrap; }\n  .crds-shared-header .text-lowercase {\n    text-transform: lowercase; }\n  .crds-shared-header .text-uppercase, .crds-shared-header .initialism {\n    text-transform: uppercase; }\n  .crds-shared-header .text-capitalize {\n    text-transform: capitalize; }\n  .crds-shared-header .text-muted {\n    color: #979797; }\n  .crds-shared-header .text-primary {\n    color: #3b6e8f; }\n  .crds-shared-header a.text-primary:hover,\n  .crds-shared-header a.text-primary:focus {\n    color: #2c526b; }\n  .crds-shared-header .text-success {\n    color: white; }\n  .crds-shared-header a.text-success:hover,\n  .crds-shared-header a.text-success:focus {\n    color: #e6e6e6; }\n  .crds-shared-header .text-info {\n    color: white; }\n  .crds-shared-header a.text-info:hover,\n  .crds-shared-header a.text-info:focus {\n    color: #e6e6e6; }\n  .crds-shared-header .text-warning {\n    color: white; }\n  .crds-shared-header a.text-warning:hover,\n  .crds-shared-header a.text-warning:focus {\n    color: #e6e6e6; }\n  .crds-shared-header .text-danger {\n    color: white; }\n  .crds-shared-header a.text-danger:hover,\n  .crds-shared-header a.text-danger:focus {\n    color: #e6e6e6; }\n  .crds-shared-header .bg-primary {\n    color: #fff; }\n  .crds-shared-header .bg-primary {\n    background-color: #3b6e8f; }\n  .crds-shared-header a.bg-primary:hover,\n  .crds-shared-header a.bg-primary:focus {\n    background-color: #2c526b; }\n  .crds-shared-header .bg-success {\n    background-color: #6acc93; }\n  .crds-shared-header a.bg-success:hover,\n  .crds-shared-header a.bg-success:focus {\n    background-color: #44bf77; }\n  .crds-shared-header .bg-info {\n    background-color: #6abccc; }\n  .crds-shared-header a.bg-info:hover,\n  .crds-shared-header a.bg-info:focus {\n    background-color: #44abbf; }\n  .crds-shared-header .bg-warning {\n    background-color: #debc73; }\n  .crds-shared-header a.bg-warning:hover,\n  .crds-shared-header a.bg-warning:focus {\n    background-color: #d4a84a; }\n  .crds-shared-header .bg-danger {\n    background-color: #d96f62; }\n  .crds-shared-header a.bg-danger:hover,\n  .crds-shared-header a.bg-danger:focus {\n    background-color: #cf4939; }\n  .crds-shared-header .page-header {\n    padding-bottom: 11px;\n    margin: 48px 0 24px;\n    border-bottom: 1px solid #e7e7e7; }\n  .crds-shared-header ul,\n  .crds-shared-header ol {\n    margin-top: 0;\n    margin-bottom: 12px; }\n    .crds-shared-header ul ul,\n    .crds-shared-header ul ol,\n    .crds-shared-header ol ul,\n    .crds-shared-header ol ol {\n      margin-bottom: 0; }\n  .crds-shared-header .list-unstyled {\n    padding-left: 0;\n    list-style: none; }\n  .crds-shared-header .list-inline {\n    padding-left: 0;\n    list-style: none;\n    margin-left: -5px; }\n    .crds-shared-header .list-inline > li {\n      display: inline-block;\n      padding-left: 5px;\n      padding-right: 5px; }\n  .crds-shared-header dl {\n    margin-top: 0;\n    margin-bottom: 24px; }\n  .crds-shared-header dt,\n  .crds-shared-header dd {\n    line-height: 1.5; }\n  .crds-shared-header dt {\n    font-weight: bold; }\n  .crds-shared-header dd {\n    margin-left: 0; }\n  .crds-shared-header .dl-horizontal dd:before, .crds-shared-header .dl-horizontal dd:after {\n    content: \" \";\n    display: table; }\n  .crds-shared-header .dl-horizontal dd:after {\n    clear: both; }\n  @media (min-width: 768px) {\n    .crds-shared-header .dl-horizontal dt {\n      float: left;\n      width: 160px;\n      clear: left;\n      text-align: right;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap; }\n    .crds-shared-header .dl-horizontal dd {\n      margin-left: 180px; } }\n  .crds-shared-header abbr[title],\n  .crds-shared-header abbr[data-original-title] {\n    cursor: help;\n    border-bottom: 1px dotted #979797; }\n  .crds-shared-header .initialism {\n    font-size: 90%; }\n  .crds-shared-header blockquote {\n    padding: 12px 24px;\n    margin: 0 0 24px;\n    font-size: 1.1875rem;\n    border-left: 5px solid #b3b3b3; }\n    .crds-shared-header blockquote p:last-child,\n    .crds-shared-header blockquote ul:last-child,\n    .crds-shared-header blockquote ol:last-child {\n      margin-bottom: 0; }\n    .crds-shared-header blockquote footer,\n    .crds-shared-header blockquote small,\n    .crds-shared-header blockquote .small {\n      display: block;\n      font-size: 80%;\n      line-height: 1.5;\n      color: #979797; }\n      .crds-shared-header blockquote footer:before,\n      .crds-shared-header blockquote small:before,\n      .crds-shared-header blockquote .small:before {\n        content: '\\2014 \\00A0'; }\n  .crds-shared-header .blockquote-reverse,\n  .crds-shared-header blockquote.pull-right {\n    padding-right: 15px;\n    padding-left: 0;\n    border-right: 5px solid #b3b3b3;\n    border-left: 0;\n    text-align: right; }\n    .crds-shared-header .blockquote-reverse footer:before,\n    .crds-shared-header .blockquote-reverse small:before,\n    .crds-shared-header .blockquote-reverse .small:before,\n    .crds-shared-header blockquote.pull-right footer:before,\n    .crds-shared-header blockquote.pull-right small:before,\n    .crds-shared-header blockquote.pull-right .small:before {\n      content: ''; }\n    .crds-shared-header .blockquote-reverse footer:after,\n    .crds-shared-header .blockquote-reverse small:after,\n    .crds-shared-header .blockquote-reverse .small:after,\n    .crds-shared-header blockquote.pull-right footer:after,\n    .crds-shared-header blockquote.pull-right small:after,\n    .crds-shared-header blockquote.pull-right .small:after {\n      content: '\\00A0 \\2014'; }\n  .crds-shared-header address {\n    margin-bottom: 24px;\n    font-style: normal;\n    line-height: 1.5; }\n  .crds-shared-header code,\n  .crds-shared-header kbd,\n  .crds-shared-header pre,\n  .crds-shared-header samp {\n    font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace; }\n  .crds-shared-header code {\n    padding: 2px 4px;\n    font-size: 90%;\n    color: #c7254e;\n    background-color: #f9f2f4;\n    border-radius: 4px; }\n  .crds-shared-header kbd {\n    padding: 2px 4px;\n    font-size: 90%;\n    color: #fff;\n    background-color: #333;\n    border-radius: 4px;\n    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25); }\n    .crds-shared-header kbd kbd {\n      padding: 0;\n      font-size: 100%;\n      font-weight: bold;\n      box-shadow: none; }\n  .crds-shared-header pre {\n    display: block;\n    padding: 11.5px;\n    margin: 0 0 12px;\n    font-size: 15px;\n    line-height: 1.5;\n    word-break: break-all;\n    word-wrap: break-word;\n    color: #4d4d4d;\n    background-color: #f5f5f5;\n    border: 1px solid #ccc;\n    border-radius: 4px; }\n    .crds-shared-header pre code {\n      padding: 0;\n      font-size: inherit;\n      color: inherit;\n      white-space: pre-wrap;\n      background-color: transparent;\n      border-radius: 0; }\n  .crds-shared-header .pre-scrollable {\n    max-height: 340px;\n    overflow-y: scroll; }\n  .crds-shared-header .container {\n    margin-right: auto;\n    margin-left: auto;\n    padding-left: 15px;\n    padding-right: 15px; }\n    .crds-shared-header .container:before, .crds-shared-header .container:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .container:after {\n      clear: both; }\n    @media (min-width: 768px) {\n      .crds-shared-header .container {\n        width: 750px; } }\n    @media (min-width: 992px) {\n      .crds-shared-header .container {\n        width: 970px; } }\n    @media (min-width: 1200px) {\n      .crds-shared-header .container {\n        width: 1170px; } }\n  .crds-shared-header .container-fluid {\n    margin-right: auto;\n    margin-left: auto;\n    padding-left: 15px;\n    padding-right: 15px; }\n    .crds-shared-header .container-fluid:before, .crds-shared-header .container-fluid:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .container-fluid:after {\n      clear: both; }\n  .crds-shared-header .row {\n    margin-left: -15px;\n    margin-right: -15px; }\n    .crds-shared-header .row:before, .crds-shared-header .row:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .row:after {\n      clear: both; }\n  .crds-shared-header .col-xs-1, .crds-shared-header .col-sm-1, .crds-shared-header .col-md-1, .crds-shared-header .col-lg-1, .crds-shared-header .col-xs-2, .crds-shared-header .col-sm-2, .crds-shared-header .col-md-2, .crds-shared-header .col-lg-2, .crds-shared-header .col-xs-3, .crds-shared-header .col-sm-3, .crds-shared-header .col-md-3, .crds-shared-header .col-lg-3, .crds-shared-header .col-xs-4, .crds-shared-header .col-sm-4, .crds-shared-header .col-md-4, .crds-shared-header .col-lg-4, .crds-shared-header .col-xs-5, .crds-shared-header .col-sm-5, .crds-shared-header .col-md-5, .crds-shared-header .col-lg-5, .crds-shared-header .col-xs-6, .crds-shared-header .col-sm-6, .crds-shared-header .col-md-6, .crds-shared-header .col-lg-6, .crds-shared-header .col-xs-7, .crds-shared-header .col-sm-7, .crds-shared-header .col-md-7, .crds-shared-header .col-lg-7, .crds-shared-header .col-xs-8, .crds-shared-header .col-sm-8, .crds-shared-header .col-md-8, .crds-shared-header .col-lg-8, .crds-shared-header .col-xs-9, .crds-shared-header .col-sm-9, .crds-shared-header .col-md-9, .crds-shared-header .col-lg-9, .crds-shared-header .col-xs-10, .crds-shared-header .col-sm-10, .crds-shared-header .col-md-10, .crds-shared-header .col-lg-10, .crds-shared-header .col-xs-11, .crds-shared-header .col-sm-11, .crds-shared-header .col-md-11, .crds-shared-header .col-lg-11, .crds-shared-header .col-xs-12, .crds-shared-header .col-sm-12, .crds-shared-header .col-md-12, .crds-shared-header .col-lg-12 {\n    position: relative;\n    min-height: 1px;\n    padding-left: 15px;\n    padding-right: 15px; }\n  .crds-shared-header .col-xs-1, .crds-shared-header .col-xs-2, .crds-shared-header .col-xs-3, .crds-shared-header .col-xs-4, .crds-shared-header .col-xs-5, .crds-shared-header .col-xs-6, .crds-shared-header .col-xs-7, .crds-shared-header .col-xs-8, .crds-shared-header .col-xs-9, .crds-shared-header .col-xs-10, .crds-shared-header .col-xs-11, .crds-shared-header .col-xs-12 {\n    float: left; }\n  .crds-shared-header .col-xs-1 {\n    width: 8.33333%; }\n  .crds-shared-header .col-xs-2 {\n    width: 16.66667%; }\n  .crds-shared-header .col-xs-3 {\n    width: 25%; }\n  .crds-shared-header .col-xs-4 {\n    width: 33.33333%; }\n  .crds-shared-header .col-xs-5 {\n    width: 41.66667%; }\n  .crds-shared-header .col-xs-6 {\n    width: 50%; }\n  .crds-shared-header .col-xs-7 {\n    width: 58.33333%; }\n  .crds-shared-header .col-xs-8 {\n    width: 66.66667%; }\n  .crds-shared-header .col-xs-9 {\n    width: 75%; }\n  .crds-shared-header .col-xs-10 {\n    width: 83.33333%; }\n  .crds-shared-header .col-xs-11 {\n    width: 91.66667%; }\n  .crds-shared-header .col-xs-12 {\n    width: 100%; }\n  .crds-shared-header .col-xs-pull-0 {\n    right: auto; }\n  .crds-shared-header .col-xs-pull-1 {\n    right: 8.33333%; }\n  .crds-shared-header .col-xs-pull-2 {\n    right: 16.66667%; }\n  .crds-shared-header .col-xs-pull-3 {\n    right: 25%; }\n  .crds-shared-header .col-xs-pull-4 {\n    right: 33.33333%; }\n  .crds-shared-header .col-xs-pull-5 {\n    right: 41.66667%; }\n  .crds-shared-header .col-xs-pull-6 {\n    right: 50%; }\n  .crds-shared-header .col-xs-pull-7 {\n    right: 58.33333%; }\n  .crds-shared-header .col-xs-pull-8 {\n    right: 66.66667%; }\n  .crds-shared-header .col-xs-pull-9 {\n    right: 75%; }\n  .crds-shared-header .col-xs-pull-10 {\n    right: 83.33333%; }\n  .crds-shared-header .col-xs-pull-11 {\n    right: 91.66667%; }\n  .crds-shared-header .col-xs-pull-12 {\n    right: 100%; }\n  .crds-shared-header .col-xs-push-0 {\n    left: auto; }\n  .crds-shared-header .col-xs-push-1 {\n    left: 8.33333%; }\n  .crds-shared-header .col-xs-push-2 {\n    left: 16.66667%; }\n  .crds-shared-header .col-xs-push-3 {\n    left: 25%; }\n  .crds-shared-header .col-xs-push-4 {\n    left: 33.33333%; }\n  .crds-shared-header .col-xs-push-5 {\n    left: 41.66667%; }\n  .crds-shared-header .col-xs-push-6 {\n    left: 50%; }\n  .crds-shared-header .col-xs-push-7 {\n    left: 58.33333%; }\n  .crds-shared-header .col-xs-push-8 {\n    left: 66.66667%; }\n  .crds-shared-header .col-xs-push-9 {\n    left: 75%; }\n  .crds-shared-header .col-xs-push-10 {\n    left: 83.33333%; }\n  .crds-shared-header .col-xs-push-11 {\n    left: 91.66667%; }\n  .crds-shared-header .col-xs-push-12 {\n    left: 100%; }\n  .crds-shared-header .col-xs-offset-0 {\n    margin-left: 0%; }\n  .crds-shared-header .col-xs-offset-1 {\n    margin-left: 8.33333%; }\n  .crds-shared-header .col-xs-offset-2 {\n    margin-left: 16.66667%; }\n  .crds-shared-header .col-xs-offset-3 {\n    margin-left: 25%; }\n  .crds-shared-header .col-xs-offset-4 {\n    margin-left: 33.33333%; }\n  .crds-shared-header .col-xs-offset-5 {\n    margin-left: 41.66667%; }\n  .crds-shared-header .col-xs-offset-6 {\n    margin-left: 50%; }\n  .crds-shared-header .col-xs-offset-7 {\n    margin-left: 58.33333%; }\n  .crds-shared-header .col-xs-offset-8 {\n    margin-left: 66.66667%; }\n  .crds-shared-header .col-xs-offset-9 {\n    margin-left: 75%; }\n  .crds-shared-header .col-xs-offset-10 {\n    margin-left: 83.33333%; }\n  .crds-shared-header .col-xs-offset-11 {\n    margin-left: 91.66667%; }\n  .crds-shared-header .col-xs-offset-12 {\n    margin-left: 100%; }\n  @media (min-width: 768px) {\n    .crds-shared-header .col-sm-1, .crds-shared-header .col-sm-2, .crds-shared-header .col-sm-3, .crds-shared-header .col-sm-4, .crds-shared-header .col-sm-5, .crds-shared-header .col-sm-6, .crds-shared-header .col-sm-7, .crds-shared-header .col-sm-8, .crds-shared-header .col-sm-9, .crds-shared-header .col-sm-10, .crds-shared-header .col-sm-11, .crds-shared-header .col-sm-12 {\n      float: left; }\n    .crds-shared-header .col-sm-1 {\n      width: 8.33333%; }\n    .crds-shared-header .col-sm-2 {\n      width: 16.66667%; }\n    .crds-shared-header .col-sm-3 {\n      width: 25%; }\n    .crds-shared-header .col-sm-4 {\n      width: 33.33333%; }\n    .crds-shared-header .col-sm-5 {\n      width: 41.66667%; }\n    .crds-shared-header .col-sm-6 {\n      width: 50%; }\n    .crds-shared-header .col-sm-7 {\n      width: 58.33333%; }\n    .crds-shared-header .col-sm-8 {\n      width: 66.66667%; }\n    .crds-shared-header .col-sm-9 {\n      width: 75%; }\n    .crds-shared-header .col-sm-10 {\n      width: 83.33333%; }\n    .crds-shared-header .col-sm-11 {\n      width: 91.66667%; }\n    .crds-shared-header .col-sm-12 {\n      width: 100%; }\n    .crds-shared-header .col-sm-pull-0 {\n      right: auto; }\n    .crds-shared-header .col-sm-pull-1 {\n      right: 8.33333%; }\n    .crds-shared-header .col-sm-pull-2 {\n      right: 16.66667%; }\n    .crds-shared-header .col-sm-pull-3 {\n      right: 25%; }\n    .crds-shared-header .col-sm-pull-4 {\n      right: 33.33333%; }\n    .crds-shared-header .col-sm-pull-5 {\n      right: 41.66667%; }\n    .crds-shared-header .col-sm-pull-6 {\n      right: 50%; }\n    .crds-shared-header .col-sm-pull-7 {\n      right: 58.33333%; }\n    .crds-shared-header .col-sm-pull-8 {\n      right: 66.66667%; }\n    .crds-shared-header .col-sm-pull-9 {\n      right: 75%; }\n    .crds-shared-header .col-sm-pull-10 {\n      right: 83.33333%; }\n    .crds-shared-header .col-sm-pull-11 {\n      right: 91.66667%; }\n    .crds-shared-header .col-sm-pull-12 {\n      right: 100%; }\n    .crds-shared-header .col-sm-push-0 {\n      left: auto; }\n    .crds-shared-header .col-sm-push-1 {\n      left: 8.33333%; }\n    .crds-shared-header .col-sm-push-2 {\n      left: 16.66667%; }\n    .crds-shared-header .col-sm-push-3 {\n      left: 25%; }\n    .crds-shared-header .col-sm-push-4 {\n      left: 33.33333%; }\n    .crds-shared-header .col-sm-push-5 {\n      left: 41.66667%; }\n    .crds-shared-header .col-sm-push-6 {\n      left: 50%; }\n    .crds-shared-header .col-sm-push-7 {\n      left: 58.33333%; }\n    .crds-shared-header .col-sm-push-8 {\n      left: 66.66667%; }\n    .crds-shared-header .col-sm-push-9 {\n      left: 75%; }\n    .crds-shared-header .col-sm-push-10 {\n      left: 83.33333%; }\n    .crds-shared-header .col-sm-push-11 {\n      left: 91.66667%; }\n    .crds-shared-header .col-sm-push-12 {\n      left: 100%; }\n    .crds-shared-header .col-sm-offset-0 {\n      margin-left: 0%; }\n    .crds-shared-header .col-sm-offset-1 {\n      margin-left: 8.33333%; }\n    .crds-shared-header .col-sm-offset-2 {\n      margin-left: 16.66667%; }\n    .crds-shared-header .col-sm-offset-3 {\n      margin-left: 25%; }\n    .crds-shared-header .col-sm-offset-4 {\n      margin-left: 33.33333%; }\n    .crds-shared-header .col-sm-offset-5 {\n      margin-left: 41.66667%; }\n    .crds-shared-header .col-sm-offset-6 {\n      margin-left: 50%; }\n    .crds-shared-header .col-sm-offset-7 {\n      margin-left: 58.33333%; }\n    .crds-shared-header .col-sm-offset-8 {\n      margin-left: 66.66667%; }\n    .crds-shared-header .col-sm-offset-9 {\n      margin-left: 75%; }\n    .crds-shared-header .col-sm-offset-10 {\n      margin-left: 83.33333%; }\n    .crds-shared-header .col-sm-offset-11 {\n      margin-left: 91.66667%; }\n    .crds-shared-header .col-sm-offset-12 {\n      margin-left: 100%; } }\n  @media (min-width: 992px) {\n    .crds-shared-header .col-md-1, .crds-shared-header .col-md-2, .crds-shared-header .col-md-3, .crds-shared-header .col-md-4, .crds-shared-header .col-md-5, .crds-shared-header .col-md-6, .crds-shared-header .col-md-7, .crds-shared-header .col-md-8, .crds-shared-header .col-md-9, .crds-shared-header .col-md-10, .crds-shared-header .col-md-11, .crds-shared-header .col-md-12 {\n      float: left; }\n    .crds-shared-header .col-md-1 {\n      width: 8.33333%; }\n    .crds-shared-header .col-md-2 {\n      width: 16.66667%; }\n    .crds-shared-header .col-md-3 {\n      width: 25%; }\n    .crds-shared-header .col-md-4 {\n      width: 33.33333%; }\n    .crds-shared-header .col-md-5 {\n      width: 41.66667%; }\n    .crds-shared-header .col-md-6 {\n      width: 50%; }\n    .crds-shared-header .col-md-7 {\n      width: 58.33333%; }\n    .crds-shared-header .col-md-8 {\n      width: 66.66667%; }\n    .crds-shared-header .col-md-9 {\n      width: 75%; }\n    .crds-shared-header .col-md-10 {\n      width: 83.33333%; }\n    .crds-shared-header .col-md-11 {\n      width: 91.66667%; }\n    .crds-shared-header .col-md-12 {\n      width: 100%; }\n    .crds-shared-header .col-md-pull-0 {\n      right: auto; }\n    .crds-shared-header .col-md-pull-1 {\n      right: 8.33333%; }\n    .crds-shared-header .col-md-pull-2 {\n      right: 16.66667%; }\n    .crds-shared-header .col-md-pull-3 {\n      right: 25%; }\n    .crds-shared-header .col-md-pull-4 {\n      right: 33.33333%; }\n    .crds-shared-header .col-md-pull-5 {\n      right: 41.66667%; }\n    .crds-shared-header .col-md-pull-6 {\n      right: 50%; }\n    .crds-shared-header .col-md-pull-7 {\n      right: 58.33333%; }\n    .crds-shared-header .col-md-pull-8 {\n      right: 66.66667%; }\n    .crds-shared-header .col-md-pull-9 {\n      right: 75%; }\n    .crds-shared-header .col-md-pull-10 {\n      right: 83.33333%; }\n    .crds-shared-header .col-md-pull-11 {\n      right: 91.66667%; }\n    .crds-shared-header .col-md-pull-12 {\n      right: 100%; }\n    .crds-shared-header .col-md-push-0 {\n      left: auto; }\n    .crds-shared-header .col-md-push-1 {\n      left: 8.33333%; }\n    .crds-shared-header .col-md-push-2 {\n      left: 16.66667%; }\n    .crds-shared-header .col-md-push-3 {\n      left: 25%; }\n    .crds-shared-header .col-md-push-4 {\n      left: 33.33333%; }\n    .crds-shared-header .col-md-push-5 {\n      left: 41.66667%; }\n    .crds-shared-header .col-md-push-6 {\n      left: 50%; }\n    .crds-shared-header .col-md-push-7 {\n      left: 58.33333%; }\n    .crds-shared-header .col-md-push-8 {\n      left: 66.66667%; }\n    .crds-shared-header .col-md-push-9 {\n      left: 75%; }\n    .crds-shared-header .col-md-push-10 {\n      left: 83.33333%; }\n    .crds-shared-header .col-md-push-11 {\n      left: 91.66667%; }\n    .crds-shared-header .col-md-push-12 {\n      left: 100%; }\n    .crds-shared-header .col-md-offset-0 {\n      margin-left: 0%; }\n    .crds-shared-header .col-md-offset-1 {\n      margin-left: 8.33333%; }\n    .crds-shared-header .col-md-offset-2 {\n      margin-left: 16.66667%; }\n    .crds-shared-header .col-md-offset-3 {\n      margin-left: 25%; }\n    .crds-shared-header .col-md-offset-4 {\n      margin-left: 33.33333%; }\n    .crds-shared-header .col-md-offset-5 {\n      margin-left: 41.66667%; }\n    .crds-shared-header .col-md-offset-6 {\n      margin-left: 50%; }\n    .crds-shared-header .col-md-offset-7 {\n      margin-left: 58.33333%; }\n    .crds-shared-header .col-md-offset-8 {\n      margin-left: 66.66667%; }\n    .crds-shared-header .col-md-offset-9 {\n      margin-left: 75%; }\n    .crds-shared-header .col-md-offset-10 {\n      margin-left: 83.33333%; }\n    .crds-shared-header .col-md-offset-11 {\n      margin-left: 91.66667%; }\n    .crds-shared-header .col-md-offset-12 {\n      margin-left: 100%; } }\n  @media (min-width: 1200px) {\n    .crds-shared-header .col-lg-1, .crds-shared-header .col-lg-2, .crds-shared-header .col-lg-3, .crds-shared-header .col-lg-4, .crds-shared-header .col-lg-5, .crds-shared-header .col-lg-6, .crds-shared-header .col-lg-7, .crds-shared-header .col-lg-8, .crds-shared-header .col-lg-9, .crds-shared-header .col-lg-10, .crds-shared-header .col-lg-11, .crds-shared-header .col-lg-12 {\n      float: left; }\n    .crds-shared-header .col-lg-1 {\n      width: 8.33333%; }\n    .crds-shared-header .col-lg-2 {\n      width: 16.66667%; }\n    .crds-shared-header .col-lg-3 {\n      width: 25%; }\n    .crds-shared-header .col-lg-4 {\n      width: 33.33333%; }\n    .crds-shared-header .col-lg-5 {\n      width: 41.66667%; }\n    .crds-shared-header .col-lg-6 {\n      width: 50%; }\n    .crds-shared-header .col-lg-7 {\n      width: 58.33333%; }\n    .crds-shared-header .col-lg-8 {\n      width: 66.66667%; }\n    .crds-shared-header .col-lg-9 {\n      width: 75%; }\n    .crds-shared-header .col-lg-10 {\n      width: 83.33333%; }\n    .crds-shared-header .col-lg-11 {\n      width: 91.66667%; }\n    .crds-shared-header .col-lg-12 {\n      width: 100%; }\n    .crds-shared-header .col-lg-pull-0 {\n      right: auto; }\n    .crds-shared-header .col-lg-pull-1 {\n      right: 8.33333%; }\n    .crds-shared-header .col-lg-pull-2 {\n      right: 16.66667%; }\n    .crds-shared-header .col-lg-pull-3 {\n      right: 25%; }\n    .crds-shared-header .col-lg-pull-4 {\n      right: 33.33333%; }\n    .crds-shared-header .col-lg-pull-5 {\n      right: 41.66667%; }\n    .crds-shared-header .col-lg-pull-6 {\n      right: 50%; }\n    .crds-shared-header .col-lg-pull-7 {\n      right: 58.33333%; }\n    .crds-shared-header .col-lg-pull-8 {\n      right: 66.66667%; }\n    .crds-shared-header .col-lg-pull-9 {\n      right: 75%; }\n    .crds-shared-header .col-lg-pull-10 {\n      right: 83.33333%; }\n    .crds-shared-header .col-lg-pull-11 {\n      right: 91.66667%; }\n    .crds-shared-header .col-lg-pull-12 {\n      right: 100%; }\n    .crds-shared-header .col-lg-push-0 {\n      left: auto; }\n    .crds-shared-header .col-lg-push-1 {\n      left: 8.33333%; }\n    .crds-shared-header .col-lg-push-2 {\n      left: 16.66667%; }\n    .crds-shared-header .col-lg-push-3 {\n      left: 25%; }\n    .crds-shared-header .col-lg-push-4 {\n      left: 33.33333%; }\n    .crds-shared-header .col-lg-push-5 {\n      left: 41.66667%; }\n    .crds-shared-header .col-lg-push-6 {\n      left: 50%; }\n    .crds-shared-header .col-lg-push-7 {\n      left: 58.33333%; }\n    .crds-shared-header .col-lg-push-8 {\n      left: 66.66667%; }\n    .crds-shared-header .col-lg-push-9 {\n      left: 75%; }\n    .crds-shared-header .col-lg-push-10 {\n      left: 83.33333%; }\n    .crds-shared-header .col-lg-push-11 {\n      left: 91.66667%; }\n    .crds-shared-header .col-lg-push-12 {\n      left: 100%; }\n    .crds-shared-header .col-lg-offset-0 {\n      margin-left: 0%; }\n    .crds-shared-header .col-lg-offset-1 {\n      margin-left: 8.33333%; }\n    .crds-shared-header .col-lg-offset-2 {\n      margin-left: 16.66667%; }\n    .crds-shared-header .col-lg-offset-3 {\n      margin-left: 25%; }\n    .crds-shared-header .col-lg-offset-4 {\n      margin-left: 33.33333%; }\n    .crds-shared-header .col-lg-offset-5 {\n      margin-left: 41.66667%; }\n    .crds-shared-header .col-lg-offset-6 {\n      margin-left: 50%; }\n    .crds-shared-header .col-lg-offset-7 {\n      margin-left: 58.33333%; }\n    .crds-shared-header .col-lg-offset-8 {\n      margin-left: 66.66667%; }\n    .crds-shared-header .col-lg-offset-9 {\n      margin-left: 75%; }\n    .crds-shared-header .col-lg-offset-10 {\n      margin-left: 83.33333%; }\n    .crds-shared-header .col-lg-offset-11 {\n      margin-left: 91.66667%; }\n    .crds-shared-header .col-lg-offset-12 {\n      margin-left: 100%; } }\n  .crds-shared-header table {\n    background-color: transparent; }\n  .crds-shared-header caption {\n    padding-top: 8px;\n    padding-bottom: 8px;\n    color: #979797;\n    text-align: left; }\n  .crds-shared-header th {\n    text-align: left; }\n  .crds-shared-header .table {\n    width: 100%;\n    max-width: 100%;\n    margin-bottom: 24px; }\n    .crds-shared-header .table > thead > tr > th,\n    .crds-shared-header .table > thead > tr > td,\n    .crds-shared-header .table > tbody > tr > th,\n    .crds-shared-header .table > tbody > tr > td,\n    .crds-shared-header .table > tfoot > tr > th,\n    .crds-shared-header .table > tfoot > tr > td {\n      padding: 8px;\n      line-height: 1.5;\n      vertical-align: top;\n      border-top: 1px solid #cacaca; }\n    .crds-shared-header .table > thead > tr > th {\n      vertical-align: bottom;\n      border-bottom: 2px solid #cacaca; }\n    .crds-shared-header .table > caption + thead > tr:first-child > th,\n    .crds-shared-header .table > caption + thead > tr:first-child > td,\n    .crds-shared-header .table > colgroup + thead > tr:first-child > th,\n    .crds-shared-header .table > colgroup + thead > tr:first-child > td,\n    .crds-shared-header .table > thead:first-child > tr:first-child > th,\n    .crds-shared-header .table > thead:first-child > tr:first-child > td {\n      border-top: 0; }\n    .crds-shared-header .table > tbody + tbody {\n      border-top: 2px solid #cacaca; }\n    .crds-shared-header .table .table {\n      background-color: white; }\n  .crds-shared-header .table-condensed > thead > tr > th,\n  .crds-shared-header .table-condensed > thead > tr > td,\n  .crds-shared-header .table-condensed > tbody > tr > th,\n  .crds-shared-header .table-condensed > tbody > tr > td,\n  .crds-shared-header .table-condensed > tfoot > tr > th,\n  .crds-shared-header .table-condensed > tfoot > tr > td {\n    padding: 5px; }\n  .crds-shared-header .table-bordered {\n    border: 1px solid #cacaca; }\n    .crds-shared-header .table-bordered > thead > tr > th,\n    .crds-shared-header .table-bordered > thead > tr > td,\n    .crds-shared-header .table-bordered > tbody > tr > th,\n    .crds-shared-header .table-bordered > tbody > tr > td,\n    .crds-shared-header .table-bordered > tfoot > tr > th,\n    .crds-shared-header .table-bordered > tfoot > tr > td {\n      border: 1px solid #cacaca; }\n    .crds-shared-header .table-bordered > thead > tr > th,\n    .crds-shared-header .table-bordered > thead > tr > td {\n      border-bottom-width: 2px; }\n  .crds-shared-header .table-striped > tbody > tr:nth-of-type(odd) {\n    background-color: #f9f9f9; }\n  .crds-shared-header .table-hover > tbody > tr:hover {\n    background-color: #f5f5f5; }\n  .crds-shared-header table col[class*=\"col-\"] {\n    position: static;\n    float: none;\n    display: table-column; }\n  .crds-shared-header table td[class*=\"col-\"],\n  .crds-shared-header table th[class*=\"col-\"] {\n    position: static;\n    float: none;\n    display: table-cell; }\n  .crds-shared-header .table > thead > tr > td.active,\n  .crds-shared-header .table > thead > tr > th.active,\n  .crds-shared-header .table > thead > tr.active > td,\n  .crds-shared-header .table > thead > tr.active > th,\n  .crds-shared-header .table > tbody > tr > td.active,\n  .crds-shared-header .table > tbody > tr > th.active,\n  .crds-shared-header .table > tbody > tr.active > td,\n  .crds-shared-header .table > tbody > tr.active > th,\n  .crds-shared-header .table > tfoot > tr > td.active,\n  .crds-shared-header .table > tfoot > tr > th.active,\n  .crds-shared-header .table > tfoot > tr.active > td,\n  .crds-shared-header .table > tfoot > tr.active > th {\n    background-color: #f5f5f5; }\n  .crds-shared-header .table-hover > tbody > tr > td.active:hover,\n  .crds-shared-header .table-hover > tbody > tr > th.active:hover,\n  .crds-shared-header .table-hover > tbody > tr.active:hover > td,\n  .crds-shared-header .table-hover > tbody > tr:hover > .active,\n  .crds-shared-header .table-hover > tbody > tr.active:hover > th {\n    background-color: #e8e8e8; }\n  .crds-shared-header .table > thead > tr > td.success,\n  .crds-shared-header .table > thead > tr > th.success,\n  .crds-shared-header .table > thead > tr.success > td,\n  .crds-shared-header .table > thead > tr.success > th,\n  .crds-shared-header .table > tbody > tr > td.success,\n  .crds-shared-header .table > tbody > tr > th.success,\n  .crds-shared-header .table > tbody > tr.success > td,\n  .crds-shared-header .table > tbody > tr.success > th,\n  .crds-shared-header .table > tfoot > tr > td.success,\n  .crds-shared-header .table > tfoot > tr > th.success,\n  .crds-shared-header .table > tfoot > tr.success > td,\n  .crds-shared-header .table > tfoot > tr.success > th {\n    background-color: #6acc93; }\n  .crds-shared-header .table-hover > tbody > tr > td.success:hover,\n  .crds-shared-header .table-hover > tbody > tr > th.success:hover,\n  .crds-shared-header .table-hover > tbody > tr.success:hover > td,\n  .crds-shared-header .table-hover > tbody > tr:hover > .success,\n  .crds-shared-header .table-hover > tbody > tr.success:hover > th {\n    background-color: #57c585; }\n  .crds-shared-header .table > thead > tr > td.info,\n  .crds-shared-header .table > thead > tr > th.info,\n  .crds-shared-header .table > thead > tr.info > td,\n  .crds-shared-header .table > thead > tr.info > th,\n  .crds-shared-header .table > tbody > tr > td.info,\n  .crds-shared-header .table > tbody > tr > th.info,\n  .crds-shared-header .table > tbody > tr.info > td,\n  .crds-shared-header .table > tbody > tr.info > th,\n  .crds-shared-header .table > tfoot > tr > td.info,\n  .crds-shared-header .table > tfoot > tr > th.info,\n  .crds-shared-header .table > tfoot > tr.info > td,\n  .crds-shared-header .table > tfoot > tr.info > th {\n    background-color: #6abccc; }\n  .crds-shared-header .table-hover > tbody > tr > td.info:hover,\n  .crds-shared-header .table-hover > tbody > tr > th.info:hover,\n  .crds-shared-header .table-hover > tbody > tr.info:hover > td,\n  .crds-shared-header .table-hover > tbody > tr:hover > .info,\n  .crds-shared-header .table-hover > tbody > tr.info:hover > th {\n    background-color: #57b3c5; }\n  .crds-shared-header .table > thead > tr > td.warning,\n  .crds-shared-header .table > thead > tr > th.warning,\n  .crds-shared-header .table > thead > tr.warning > td,\n  .crds-shared-header .table > thead > tr.warning > th,\n  .crds-shared-header .table > tbody > tr > td.warning,\n  .crds-shared-header .table > tbody > tr > th.warning,\n  .crds-shared-header .table > tbody > tr.warning > td,\n  .crds-shared-header .table > tbody > tr.warning > th,\n  .crds-shared-header .table > tfoot > tr > td.warning,\n  .crds-shared-header .table > tfoot > tr > th.warning,\n  .crds-shared-header .table > tfoot > tr.warning > td,\n  .crds-shared-header .table > tfoot > tr.warning > th {\n    background-color: #debc73; }\n  .crds-shared-header .table-hover > tbody > tr > td.warning:hover,\n  .crds-shared-header .table-hover > tbody > tr > th.warning:hover,\n  .crds-shared-header .table-hover > tbody > tr.warning:hover > td,\n  .crds-shared-header .table-hover > tbody > tr:hover > .warning,\n  .crds-shared-header .table-hover > tbody > tr.warning:hover > th {\n    background-color: #d9b25e; }\n  .crds-shared-header .table > thead > tr > td.danger,\n  .crds-shared-header .table > thead > tr > th.danger,\n  .crds-shared-header .table > thead > tr.danger > td,\n  .crds-shared-header .table > thead > tr.danger > th,\n  .crds-shared-header .table > tbody > tr > td.danger,\n  .crds-shared-header .table > tbody > tr > th.danger,\n  .crds-shared-header .table > tbody > tr.danger > td,\n  .crds-shared-header .table > tbody > tr.danger > th,\n  .crds-shared-header .table > tfoot > tr > td.danger,\n  .crds-shared-header .table > tfoot > tr > th.danger,\n  .crds-shared-header .table > tfoot > tr.danger > td,\n  .crds-shared-header .table > tfoot > tr.danger > th {\n    background-color: #d96f62; }\n  .crds-shared-header .table-hover > tbody > tr > td.danger:hover,\n  .crds-shared-header .table-hover > tbody > tr > th.danger:hover,\n  .crds-shared-header .table-hover > tbody > tr.danger:hover > td,\n  .crds-shared-header .table-hover > tbody > tr:hover > .danger,\n  .crds-shared-header .table-hover > tbody > tr.danger:hover > th {\n    background-color: #d45c4d; }\n  .crds-shared-header .table-responsive {\n    overflow-x: auto;\n    min-height: 0.01%; }\n    @media screen and (max-width: 767px) {\n      .crds-shared-header .table-responsive {\n        width: 100%;\n        margin-bottom: 18px;\n        overflow-y: hidden;\n        -ms-overflow-style: -ms-autohiding-scrollbar;\n        border: 1px solid #cacaca; }\n        .crds-shared-header .table-responsive > .table {\n          margin-bottom: 0; }\n          .crds-shared-header .table-responsive > .table > thead > tr > th,\n          .crds-shared-header .table-responsive > .table > thead > tr > td,\n          .crds-shared-header .table-responsive > .table > tbody > tr > th,\n          .crds-shared-header .table-responsive > .table > tbody > tr > td,\n          .crds-shared-header .table-responsive > .table > tfoot > tr > th,\n          .crds-shared-header .table-responsive > .table > tfoot > tr > td {\n            white-space: nowrap; }\n        .crds-shared-header .table-responsive > .table-bordered {\n          border: 0; }\n          .crds-shared-header .table-responsive > .table-bordered > thead > tr > th:first-child,\n          .crds-shared-header .table-responsive > .table-bordered > thead > tr > td:first-child,\n          .crds-shared-header .table-responsive > .table-bordered > tbody > tr > th:first-child,\n          .crds-shared-header .table-responsive > .table-bordered > tbody > tr > td:first-child,\n          .crds-shared-header .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n          .crds-shared-header .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n            border-left: 0; }\n          .crds-shared-header .table-responsive > .table-bordered > thead > tr > th:last-child,\n          .crds-shared-header .table-responsive > .table-bordered > thead > tr > td:last-child,\n          .crds-shared-header .table-responsive > .table-bordered > tbody > tr > th:last-child,\n          .crds-shared-header .table-responsive > .table-bordered > tbody > tr > td:last-child,\n          .crds-shared-header .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n          .crds-shared-header .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n            border-right: 0; }\n          .crds-shared-header .table-responsive > .table-bordered > tbody > tr:last-child > th,\n          .crds-shared-header .table-responsive > .table-bordered > tbody > tr:last-child > td,\n          .crds-shared-header .table-responsive > .table-bordered > tfoot > tr:last-child > th,\n          .crds-shared-header .table-responsive > .table-bordered > tfoot > tr:last-child > td {\n            border-bottom: 0; } }\n  .crds-shared-header fieldset {\n    padding: 0;\n    margin: 0;\n    border: 0;\n    min-width: 0; }\n  .crds-shared-header legend {\n    display: block;\n    width: 100%;\n    padding: 0;\n    margin-bottom: 24px;\n    font-size: 24px;\n    line-height: inherit;\n    color: #4d4d4d;\n    border: 0;\n    border-bottom: 1px solid #e5e5e5; }\n  .crds-shared-header label {\n    display: inline-block;\n    max-width: 100%;\n    margin-bottom: 5px;\n    font-weight: bold; }\n  .crds-shared-header input[type=\"search\"] {\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box; }\n  .crds-shared-header input[type=\"radio\"],\n  .crds-shared-header input[type=\"checkbox\"] {\n    margin: 4px 0 0;\n    margin-top: 1px \\9;\n    line-height: normal; }\n  .crds-shared-header input[type=\"file\"] {\n    display: block; }\n  .crds-shared-header input[type=\"range\"] {\n    display: block;\n    width: 100%; }\n  .crds-shared-header select[multiple],\n  .crds-shared-header select[size] {\n    height: auto; }\n  .crds-shared-header input[type=\"file\"]:focus,\n  .crds-shared-header input[type=\"radio\"]:focus,\n  .crds-shared-header input[type=\"checkbox\"]:focus {\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n  .crds-shared-header output {\n    display: block;\n    padding-top: 9px;\n    font-size: 16px;\n    line-height: 1.5;\n    color: #4d4d4d; }\n  .crds-shared-header .form-control {\n    display: block;\n    width: 100%;\n    height: 42px;\n    padding: 8px 10px;\n    font-size: 16px;\n    line-height: 1.5;\n    color: #4d4d4d;\n    background-color: #f4f4f4;\n    background-image: none;\n    border: 1px solid #f4f4f4;\n    border-radius: 0;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n    -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; }\n    .crds-shared-header .form-control:focus {\n      border-color: #8bceed;\n      outline: 0;\n      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(139, 206, 237, 0.6);\n      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(139, 206, 237, 0.6); }\n    .crds-shared-header .form-control::-moz-placeholder {\n      color: #979797;\n      opacity: 1; }\n    .crds-shared-header .form-control:-ms-input-placeholder {\n      color: #979797; }\n    .crds-shared-header .form-control::-webkit-input-placeholder {\n      color: #979797; }\n    .crds-shared-header .form-control::-ms-expand {\n      border: 0;\n      background-color: transparent; }\n    .crds-shared-header .form-control[disabled], .crds-shared-header .form-control[readonly],\n    fieldset[disabled] .crds-shared-header .form-control {\n      background-color: #e7e7e7;\n      opacity: 1; }\n    .crds-shared-header .form-control[disabled],\n    fieldset[disabled] .crds-shared-header .form-control {\n      cursor: not-allowed; }\n  .crds-shared-header textarea.form-control {\n    height: auto; }\n  .crds-shared-header input[type=\"search\"] {\n    -webkit-appearance: none; }\n  @media screen and (-webkit-min-device-pixel-ratio: 0) {\n    .crds-shared-header input[type=\"date\"].form-control,\n    .crds-shared-header input[type=\"time\"].form-control,\n    .crds-shared-header input[type=\"datetime-local\"].form-control,\n    .crds-shared-header input[type=\"month\"].form-control {\n      line-height: 42px; }\n    .crds-shared-header input[type=\"date\"].input-sm, .crds-shared-header .input-group-sm > input[type=\"date\"].form-control, .crds-shared-header .input-group-sm > input[type=\"date\"].input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > input[type=\"date\"].btn,\n    .input-group-sm .crds-shared-header input[type=\"date\"],\n    .crds-shared-header input[type=\"time\"].input-sm, .crds-shared-header .input-group-sm > input[type=\"time\"].form-control, .crds-shared-header .input-group-sm > input[type=\"time\"].input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > input[type=\"time\"].btn,\n    .input-group-sm\n    .crds-shared-header input[type=\"time\"],\n    .crds-shared-header input[type=\"datetime-local\"].input-sm, .crds-shared-header .input-group-sm > input[type=\"datetime-local\"].form-control, .crds-shared-header .input-group-sm > input[type=\"datetime-local\"].input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > input[type=\"datetime-local\"].btn,\n    .input-group-sm\n    .crds-shared-header input[type=\"datetime-local\"],\n    .crds-shared-header input[type=\"month\"].input-sm, .crds-shared-header .input-group-sm > input[type=\"month\"].form-control, .crds-shared-header .input-group-sm > input[type=\"month\"].input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > input[type=\"month\"].btn,\n    .input-group-sm\n    .crds-shared-header input[type=\"month\"] {\n      line-height: 30px; }\n    .crds-shared-header input[type=\"date\"].input-lg, .crds-shared-header .input-group-lg > input[type=\"date\"].form-control, .crds-shared-header .input-group-lg > input[type=\"date\"].input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > input[type=\"date\"].btn,\n    .input-group-lg .crds-shared-header input[type=\"date\"],\n    .crds-shared-header input[type=\"time\"].input-lg, .crds-shared-header .input-group-lg > input[type=\"time\"].form-control, .crds-shared-header .input-group-lg > input[type=\"time\"].input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > input[type=\"time\"].btn,\n    .input-group-lg\n    .crds-shared-header input[type=\"time\"],\n    .crds-shared-header input[type=\"datetime-local\"].input-lg, .crds-shared-header .input-group-lg > input[type=\"datetime-local\"].form-control, .crds-shared-header .input-group-lg > input[type=\"datetime-local\"].input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > input[type=\"datetime-local\"].btn,\n    .input-group-lg\n    .crds-shared-header input[type=\"datetime-local\"],\n    .crds-shared-header input[type=\"month\"].input-lg, .crds-shared-header .input-group-lg > input[type=\"month\"].form-control, .crds-shared-header .input-group-lg > input[type=\"month\"].input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > input[type=\"month\"].btn,\n    .input-group-lg\n    .crds-shared-header input[type=\"month\"] {\n      line-height: 48px; } }\n  .crds-shared-header .form-group {\n    margin-bottom: 15px; }\n  .crds-shared-header .radio,\n  .crds-shared-header .checkbox {\n    position: relative;\n    display: block;\n    margin-top: 10px;\n    margin-bottom: 10px; }\n    .crds-shared-header .radio label,\n    .crds-shared-header .checkbox label {\n      min-height: 24px;\n      padding-left: 20px;\n      margin-bottom: 0;\n      font-weight: normal;\n      cursor: pointer; }\n  .crds-shared-header .radio input[type=\"radio\"],\n  .crds-shared-header .radio-inline input[type=\"radio\"],\n  .crds-shared-header .checkbox input[type=\"checkbox\"],\n  .crds-shared-header .checkbox-inline input[type=\"checkbox\"] {\n    position: absolute;\n    margin-left: -20px;\n    margin-top: 4px \\9; }\n  .crds-shared-header .radio + .radio,\n  .crds-shared-header .checkbox + .checkbox {\n    margin-top: -5px; }\n  .crds-shared-header .radio-inline,\n  .crds-shared-header .checkbox-inline {\n    position: relative;\n    display: inline-block;\n    padding-left: 20px;\n    margin-bottom: 0;\n    vertical-align: middle;\n    font-weight: normal;\n    cursor: pointer; }\n  .crds-shared-header .radio-inline + .radio-inline,\n  .crds-shared-header .checkbox-inline + .checkbox-inline {\n    margin-top: 0;\n    margin-left: 10px; }\n  .crds-shared-header input[type=\"radio\"][disabled], .crds-shared-header input[type=\"radio\"].disabled,\n  fieldset[disabled] .crds-shared-header input[type=\"radio\"],\n  .crds-shared-header input[type=\"checkbox\"][disabled],\n  .crds-shared-header input[type=\"checkbox\"].disabled,\n  fieldset[disabled]\n  .crds-shared-header input[type=\"checkbox\"] {\n    cursor: not-allowed; }\n  .crds-shared-header .radio-inline.disabled,\n  fieldset[disabled] .crds-shared-header .radio-inline,\n  .crds-shared-header .checkbox-inline.disabled,\n  fieldset[disabled]\n  .crds-shared-header .checkbox-inline {\n    cursor: not-allowed; }\n  .crds-shared-header .radio.disabled label,\n  fieldset[disabled] .crds-shared-header .radio label,\n  .crds-shared-header .checkbox.disabled label,\n  fieldset[disabled]\n  .crds-shared-header .checkbox label {\n    cursor: not-allowed; }\n  .crds-shared-header .form-control-static {\n    padding-top: 9px;\n    padding-bottom: 9px;\n    margin-bottom: 0;\n    min-height: 40px; }\n    .crds-shared-header .form-control-static.input-lg, .crds-shared-header .input-group-lg > .form-control-static.form-control, .crds-shared-header .input-group-lg > .form-control-static.input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > .form-control-static.btn, .crds-shared-header .form-control-static.input-sm, .crds-shared-header .input-group-sm > .form-control-static.form-control, .crds-shared-header .input-group-sm > .form-control-static.input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > .form-control-static.btn {\n      padding-left: 0;\n      padding-right: 0; }\n  .crds-shared-header .input-sm, .crds-shared-header .input-group-sm > .form-control, .crds-shared-header .input-group-sm > .input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > .btn {\n    height: 30px;\n    padding: 5px 10px;\n    font-size: 14px;\n    line-height: 1.25;\n    border-radius: 0; }\n  .crds-shared-header select.input-sm, .crds-shared-header .input-group-sm > select.form-control, .crds-shared-header .input-group-sm > select.input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > select.btn {\n    height: 30px;\n    line-height: 30px; }\n  .crds-shared-header textarea.input-sm, .crds-shared-header .input-group-sm > textarea.form-control, .crds-shared-header .input-group-sm > textarea.input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > textarea.btn,\n  .crds-shared-header select[multiple].input-sm, .crds-shared-header .input-group-sm > select[multiple].form-control, .crds-shared-header .input-group-sm > select[multiple].input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > select[multiple].btn {\n    height: auto; }\n  .crds-shared-header .form-group-sm .form-control {\n    height: 30px;\n    padding: 5px 10px;\n    font-size: 14px;\n    line-height: 1.25;\n    border-radius: 0; }\n  .crds-shared-header .form-group-sm select.form-control {\n    height: 30px;\n    line-height: 30px; }\n  .crds-shared-header .form-group-sm textarea.form-control,\n  .crds-shared-header .form-group-sm select[multiple].form-control {\n    height: auto; }\n  .crds-shared-header .form-group-sm .form-control-static {\n    height: 30px;\n    min-height: 38px;\n    padding: 6px 10px;\n    font-size: 14px;\n    line-height: 1.25; }\n  .crds-shared-header .input-lg, .crds-shared-header .input-group-lg > .form-control, .crds-shared-header .input-group-lg > .input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > .btn {\n    height: 48px;\n    padding: 10px 16px;\n    font-size: 19px;\n    line-height: 1.75;\n    border-radius: 0; }\n  .crds-shared-header select.input-lg, .crds-shared-header .input-group-lg > select.form-control, .crds-shared-header .input-group-lg > select.input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > select.btn {\n    height: 48px;\n    line-height: 48px; }\n  .crds-shared-header textarea.input-lg, .crds-shared-header .input-group-lg > textarea.form-control, .crds-shared-header .input-group-lg > textarea.input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > textarea.btn,\n  .crds-shared-header select[multiple].input-lg, .crds-shared-header .input-group-lg > select[multiple].form-control, .crds-shared-header .input-group-lg > select[multiple].input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > select[multiple].btn {\n    height: auto; }\n  .crds-shared-header .form-group-lg .form-control {\n    height: 48px;\n    padding: 10px 16px;\n    font-size: 19px;\n    line-height: 1.75;\n    border-radius: 0; }\n  .crds-shared-header .form-group-lg select.form-control {\n    height: 48px;\n    line-height: 48px; }\n  .crds-shared-header .form-group-lg textarea.form-control,\n  .crds-shared-header .form-group-lg select[multiple].form-control {\n    height: auto; }\n  .crds-shared-header .form-group-lg .form-control-static {\n    height: 48px;\n    min-height: 43px;\n    padding: 11px 16px;\n    font-size: 19px;\n    line-height: 1.75; }\n  .crds-shared-header .has-feedback {\n    position: relative; }\n    .crds-shared-header .has-feedback .form-control {\n      padding-right: 52.5px; }\n  .crds-shared-header .form-control-feedback {\n    position: absolute;\n    top: 0;\n    right: 0;\n    z-index: 2;\n    display: block;\n    width: 42px;\n    height: 42px;\n    line-height: 42px;\n    text-align: center;\n    pointer-events: none; }\n  .crds-shared-header .input-lg + .form-control-feedback, .crds-shared-header .input-group-lg > .form-control + .form-control-feedback, .crds-shared-header .input-group-lg > .input-group-addon + .form-control-feedback, .crds-shared-header .input-group-lg > .input-group-btn > .btn + .form-control-feedback,\n  .crds-shared-header .input-group-lg + .form-control-feedback,\n  .crds-shared-header .form-group-lg .form-control + .form-control-feedback {\n    width: 48px;\n    height: 48px;\n    line-height: 48px; }\n  .crds-shared-header .input-sm + .form-control-feedback, .crds-shared-header .input-group-sm > .form-control + .form-control-feedback, .crds-shared-header .input-group-sm > .input-group-addon + .form-control-feedback, .crds-shared-header .input-group-sm > .input-group-btn > .btn + .form-control-feedback,\n  .crds-shared-header .input-group-sm + .form-control-feedback,\n  .crds-shared-header .form-group-sm .form-control + .form-control-feedback {\n    width: 30px;\n    height: 30px;\n    line-height: 30px; }\n  .crds-shared-header .has-success .help-block,\n  .crds-shared-header .has-success .control-label,\n  .crds-shared-header .has-success .radio,\n  .crds-shared-header .has-success .checkbox,\n  .crds-shared-header .has-success .radio-inline,\n  .crds-shared-header .has-success .checkbox-inline,\n  .crds-shared-header .has-success.radio label,\n  .crds-shared-header .has-success.checkbox label,\n  .crds-shared-header .has-success.radio-inline label,\n  .crds-shared-header .has-success.checkbox-inline label {\n    color: white; }\n  .crds-shared-header .has-success .form-control {\n    border-color: white;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n    .crds-shared-header .has-success .form-control:focus {\n      border-color: #e6e6e6;\n      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px white;\n      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px white; }\n  .crds-shared-header .has-success .input-group-addon {\n    color: white;\n    border-color: white;\n    background-color: #6acc93; }\n  .crds-shared-header .has-success .form-control-feedback {\n    color: white; }\n  .crds-shared-header .has-warning .help-block,\n  .crds-shared-header .has-warning .control-label,\n  .crds-shared-header .has-warning .radio,\n  .crds-shared-header .has-warning .checkbox,\n  .crds-shared-header .has-warning .radio-inline,\n  .crds-shared-header .has-warning .checkbox-inline,\n  .crds-shared-header .has-warning.radio label,\n  .crds-shared-header .has-warning.checkbox label,\n  .crds-shared-header .has-warning.radio-inline label,\n  .crds-shared-header .has-warning.checkbox-inline label {\n    color: white; }\n  .crds-shared-header .has-warning .form-control {\n    border-color: white;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n    .crds-shared-header .has-warning .form-control:focus {\n      border-color: #e6e6e6;\n      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px white;\n      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px white; }\n  .crds-shared-header .has-warning .input-group-addon {\n    color: white;\n    border-color: white;\n    background-color: #debc73; }\n  .crds-shared-header .has-warning .form-control-feedback {\n    color: white; }\n  .crds-shared-header .has-error .help-block,\n  .crds-shared-header .has-error .control-label,\n  .crds-shared-header .has-error .radio,\n  .crds-shared-header .has-error .checkbox,\n  .crds-shared-header .has-error .radio-inline,\n  .crds-shared-header .has-error .checkbox-inline,\n  .crds-shared-header .has-error.radio label,\n  .crds-shared-header .has-error.checkbox label,\n  .crds-shared-header .has-error.radio-inline label,\n  .crds-shared-header .has-error.checkbox-inline label {\n    color: white; }\n  .crds-shared-header .has-error .form-control {\n    border-color: white;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n    .crds-shared-header .has-error .form-control:focus {\n      border-color: #e6e6e6;\n      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px white;\n      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px white; }\n  .crds-shared-header .has-error .input-group-addon {\n    color: white;\n    border-color: white;\n    background-color: #d96f62; }\n  .crds-shared-header .has-error .form-control-feedback {\n    color: white; }\n  .crds-shared-header .has-feedback label ~ .form-control-feedback {\n    top: 29px; }\n  .crds-shared-header .has-feedback label.sr-only ~ .form-control-feedback {\n    top: 0; }\n  .crds-shared-header .help-block {\n    display: block;\n    margin-top: 5px;\n    margin-bottom: 10px;\n    color: #8d8d8d; }\n  @media (min-width: 768px) {\n    .crds-shared-header .form-inline .form-group {\n      display: inline-block;\n      margin-bottom: 0;\n      vertical-align: middle; }\n    .crds-shared-header .form-inline .form-control {\n      display: inline-block;\n      width: auto;\n      vertical-align: middle; }\n    .crds-shared-header .form-inline .form-control-static {\n      display: inline-block; }\n    .crds-shared-header .form-inline .input-group {\n      display: inline-table;\n      vertical-align: middle; }\n      .crds-shared-header .form-inline .input-group .input-group-addon,\n      .crds-shared-header .form-inline .input-group .input-group-btn,\n      .crds-shared-header .form-inline .input-group .form-control {\n        width: auto; }\n    .crds-shared-header .form-inline .input-group > .form-control {\n      width: 100%; }\n    .crds-shared-header .form-inline .control-label {\n      margin-bottom: 0;\n      vertical-align: middle; }\n    .crds-shared-header .form-inline .radio,\n    .crds-shared-header .form-inline .checkbox {\n      display: inline-block;\n      margin-top: 0;\n      margin-bottom: 0;\n      vertical-align: middle; }\n      .crds-shared-header .form-inline .radio label,\n      .crds-shared-header .form-inline .checkbox label {\n        padding-left: 0; }\n    .crds-shared-header .form-inline .radio input[type=\"radio\"],\n    .crds-shared-header .form-inline .checkbox input[type=\"checkbox\"] {\n      position: relative;\n      margin-left: 0; }\n    .crds-shared-header .form-inline .has-feedback .form-control-feedback {\n      top: 0; } }\n  .crds-shared-header .form-horizontal .radio,\n  .crds-shared-header .form-horizontal .checkbox,\n  .crds-shared-header .form-horizontal .radio-inline,\n  .crds-shared-header .form-horizontal .checkbox-inline {\n    margin-top: 0;\n    margin-bottom: 0;\n    padding-top: 9px; }\n  .crds-shared-header .form-horizontal .radio,\n  .crds-shared-header .form-horizontal .checkbox {\n    min-height: 33px; }\n  .crds-shared-header .form-horizontal .form-group {\n    margin-left: -15px;\n    margin-right: -15px; }\n    .crds-shared-header .form-horizontal .form-group:before, .crds-shared-header .form-horizontal .form-group:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .form-horizontal .form-group:after {\n      clear: both; }\n  @media (min-width: 768px) {\n    .crds-shared-header .form-horizontal .control-label {\n      text-align: right;\n      margin-bottom: 0;\n      padding-top: 9px; } }\n  .crds-shared-header .form-horizontal .has-feedback .form-control-feedback {\n    right: 15px; }\n  @media (min-width: 768px) {\n    .crds-shared-header .form-horizontal .form-group-lg .control-label {\n      padding-top: 11px;\n      font-size: 19px; } }\n  @media (min-width: 768px) {\n    .crds-shared-header .form-horizontal .form-group-sm .control-label {\n      padding-top: 6px;\n      font-size: 14px; } }\n  .crds-shared-header .btn {\n    display: inline-block;\n    margin-bottom: 0;\n    font-weight: 300;\n    text-align: center;\n    vertical-align: middle;\n    touch-action: manipulation;\n    cursor: pointer;\n    background-image: none;\n    border: 1px solid transparent;\n    white-space: nowrap;\n    padding: 8px 10px;\n    font-size: 16px;\n    line-height: 1.5;\n    border-radius: 4px;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none; }\n    .crds-shared-header .btn:focus, .crds-shared-header .btn.focus, .crds-shared-header .btn:active:focus, .crds-shared-header .btn:active.focus, .crds-shared-header .btn.active:focus, .crds-shared-header .btn.active.focus {\n      outline: 5px auto -webkit-focus-ring-color;\n      outline-offset: -2px; }\n    .crds-shared-header .btn:hover, .crds-shared-header .btn:focus, .crds-shared-header .btn.focus {\n      color: white;\n      text-decoration: none; }\n    .crds-shared-header .btn:active, .crds-shared-header .btn.active {\n      outline: 0;\n      background-image: none;\n      -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); }\n    .crds-shared-header .btn.disabled, .crds-shared-header .btn[disabled],\n    fieldset[disabled] .crds-shared-header .btn {\n      cursor: not-allowed;\n      opacity: 0.65;\n      filter: alpha(opacity=65);\n      -webkit-box-shadow: none;\n      box-shadow: none; }\n  .crds-shared-header a.btn.disabled,\n  fieldset[disabled] .crds-shared-header a.btn {\n    pointer-events: none; }\n  .crds-shared-header .btn-default {\n    color: white;\n    background-color: #979797;\n    border-color: #979797; }\n    .crds-shared-header .btn-default:focus, .crds-shared-header .btn-default.focus {\n      color: white;\n      background-color: #7e7e7e;\n      border-color: #575757; }\n    .crds-shared-header .btn-default:hover {\n      color: white;\n      background-color: #7e7e7e;\n      border-color: #787878; }\n    .crds-shared-header .btn-default:active, .crds-shared-header .btn-default.active,\n    .open > .crds-shared-header .btn-default.dropdown-toggle {\n      color: white;\n      background-color: #7e7e7e;\n      border-color: #787878; }\n      .crds-shared-header .btn-default:active:hover, .crds-shared-header .btn-default:active:focus, .crds-shared-header .btn-default:active.focus, .crds-shared-header .btn-default.active:hover, .crds-shared-header .btn-default.active:focus, .crds-shared-header .btn-default.active.focus,\n      .open > .crds-shared-header .btn-default.dropdown-toggle:hover,\n      .open > .crds-shared-header .btn-default.dropdown-toggle:focus,\n      .open > .crds-shared-header .btn-default.dropdown-toggle.focus {\n        color: white;\n        background-color: #6c6c6c;\n        border-color: #575757; }\n    .crds-shared-header .btn-default:active, .crds-shared-header .btn-default.active,\n    .open > .crds-shared-header .btn-default.dropdown-toggle {\n      background-image: none; }\n    .crds-shared-header .btn-default.disabled:hover, .crds-shared-header .btn-default.disabled:focus, .crds-shared-header .btn-default.disabled.focus, .crds-shared-header .btn-default[disabled]:hover, .crds-shared-header .btn-default[disabled]:focus, .crds-shared-header .btn-default[disabled].focus,\n    fieldset[disabled] .crds-shared-header .btn-default:hover,\n    fieldset[disabled] .crds-shared-header .btn-default:focus,\n    fieldset[disabled] .crds-shared-header .btn-default.focus {\n      background-color: #979797;\n      border-color: #979797; }\n    .crds-shared-header .btn-default .badge {\n      color: #979797;\n      background-color: white; }\n  .crds-shared-header .btn-primary {\n    color: white;\n    background-color: #3b6e8f;\n    border-color: #3b6e8f; }\n    .crds-shared-header .btn-primary:focus, .crds-shared-header .btn-primary.focus {\n      color: white;\n      background-color: #2c526b;\n      border-color: #162935; }\n    .crds-shared-header .btn-primary:hover {\n      color: white;\n      background-color: #2c526b;\n      border-color: #294d64; }\n    .crds-shared-header .btn-primary:active, .crds-shared-header .btn-primary.active,\n    .open > .crds-shared-header .btn-primary.dropdown-toggle {\n      color: white;\n      background-color: #2c526b;\n      border-color: #294d64; }\n      .crds-shared-header .btn-primary:active:hover, .crds-shared-header .btn-primary:active:focus, .crds-shared-header .btn-primary:active.focus, .crds-shared-header .btn-primary.active:hover, .crds-shared-header .btn-primary.active:focus, .crds-shared-header .btn-primary.active.focus,\n      .open > .crds-shared-header .btn-primary.dropdown-toggle:hover,\n      .open > .crds-shared-header .btn-primary.dropdown-toggle:focus,\n      .open > .crds-shared-header .btn-primary.dropdown-toggle.focus {\n        color: white;\n        background-color: #223f52;\n        border-color: #162935; }\n    .crds-shared-header .btn-primary:active, .crds-shared-header .btn-primary.active,\n    .open > .crds-shared-header .btn-primary.dropdown-toggle {\n      background-image: none; }\n    .crds-shared-header .btn-primary.disabled:hover, .crds-shared-header .btn-primary.disabled:focus, .crds-shared-header .btn-primary.disabled.focus, .crds-shared-header .btn-primary[disabled]:hover, .crds-shared-header .btn-primary[disabled]:focus, .crds-shared-header .btn-primary[disabled].focus,\n    fieldset[disabled] .crds-shared-header .btn-primary:hover,\n    fieldset[disabled] .crds-shared-header .btn-primary:focus,\n    fieldset[disabled] .crds-shared-header .btn-primary.focus {\n      background-color: #3b6e8f;\n      border-color: #3b6e8f; }\n    .crds-shared-header .btn-primary .badge {\n      color: #3b6e8f;\n      background-color: white; }\n  .crds-shared-header .btn-success {\n    color: #fff;\n    background-color: #6acc93;\n    border-color: #57c585; }\n    .crds-shared-header .btn-success:focus, .crds-shared-header .btn-success.focus {\n      color: #fff;\n      background-color: #44bf77;\n      border-color: #287548; }\n    .crds-shared-header .btn-success:hover {\n      color: #fff;\n      background-color: #44bf77;\n      border-color: #39a667; }\n    .crds-shared-header .btn-success:active, .crds-shared-header .btn-success.active,\n    .open > .crds-shared-header .btn-success.dropdown-toggle {\n      color: #fff;\n      background-color: #44bf77;\n      border-color: #39a667; }\n      .crds-shared-header .btn-success:active:hover, .crds-shared-header .btn-success:active:focus, .crds-shared-header .btn-success:active.focus, .crds-shared-header .btn-success.active:hover, .crds-shared-header .btn-success.active:focus, .crds-shared-header .btn-success.active.focus,\n      .open > .crds-shared-header .btn-success.dropdown-toggle:hover,\n      .open > .crds-shared-header .btn-success.dropdown-toggle:focus,\n      .open > .crds-shared-header .btn-success.dropdown-toggle.focus {\n        color: #fff;\n        background-color: #39a667;\n        border-color: #287548; }\n    .crds-shared-header .btn-success:active, .crds-shared-header .btn-success.active,\n    .open > .crds-shared-header .btn-success.dropdown-toggle {\n      background-image: none; }\n    .crds-shared-header .btn-success.disabled:hover, .crds-shared-header .btn-success.disabled:focus, .crds-shared-header .btn-success.disabled.focus, .crds-shared-header .btn-success[disabled]:hover, .crds-shared-header .btn-success[disabled]:focus, .crds-shared-header .btn-success[disabled].focus,\n    fieldset[disabled] .crds-shared-header .btn-success:hover,\n    fieldset[disabled] .crds-shared-header .btn-success:focus,\n    fieldset[disabled] .crds-shared-header .btn-success.focus {\n      background-color: #6acc93;\n      border-color: #57c585; }\n    .crds-shared-header .btn-success .badge {\n      color: #6acc93;\n      background-color: #fff; }\n  .crds-shared-header .btn-info {\n    color: white;\n    background-color: #0095d9;\n    border-color: #0095d9; }\n    .crds-shared-header .btn-info:focus, .crds-shared-header .btn-info.focus {\n      color: white;\n      background-color: #0072a6;\n      border-color: #003d5a; }\n    .crds-shared-header .btn-info:hover {\n      color: white;\n      background-color: #0072a6;\n      border-color: #006b9c; }\n    .crds-shared-header .btn-info:active, .crds-shared-header .btn-info.active,\n    .open > .crds-shared-header .btn-info.dropdown-toggle {\n      color: white;\n      background-color: #0072a6;\n      border-color: #006b9c; }\n      .crds-shared-header .btn-info:active:hover, .crds-shared-header .btn-info:active:focus, .crds-shared-header .btn-info:active.focus, .crds-shared-header .btn-info.active:hover, .crds-shared-header .btn-info.active:focus, .crds-shared-header .btn-info.active.focus,\n      .open > .crds-shared-header .btn-info.dropdown-toggle:hover,\n      .open > .crds-shared-header .btn-info.dropdown-toggle:focus,\n      .open > .crds-shared-header .btn-info.dropdown-toggle.focus {\n        color: white;\n        background-color: #005982;\n        border-color: #003d5a; }\n    .crds-shared-header .btn-info:active, .crds-shared-header .btn-info.active,\n    .open > .crds-shared-header .btn-info.dropdown-toggle {\n      background-image: none; }\n    .crds-shared-header .btn-info.disabled:hover, .crds-shared-header .btn-info.disabled:focus, .crds-shared-header .btn-info.disabled.focus, .crds-shared-header .btn-info[disabled]:hover, .crds-shared-header .btn-info[disabled]:focus, .crds-shared-header .btn-info[disabled].focus,\n    fieldset[disabled] .crds-shared-header .btn-info:hover,\n    fieldset[disabled] .crds-shared-header .btn-info:focus,\n    fieldset[disabled] .crds-shared-header .btn-info.focus {\n      background-color: #0095d9;\n      border-color: #0095d9; }\n    .crds-shared-header .btn-info .badge {\n      color: #0095d9;\n      background-color: white; }\n  .crds-shared-header .btn-warning {\n    color: #fff;\n    background-color: #e09e06;\n    border-color: #c78c05; }\n    .crds-shared-header .btn-warning:focus, .crds-shared-header .btn-warning.focus {\n      color: #fff;\n      background-color: #ae7b05;\n      border-color: #4b3502; }\n    .crds-shared-header .btn-warning:hover {\n      color: #fff;\n      background-color: #ae7b05;\n      border-color: #8c6204; }\n    .crds-shared-header .btn-warning:active, .crds-shared-header .btn-warning.active,\n    .open > .crds-shared-header .btn-warning.dropdown-toggle {\n      color: #fff;\n      background-color: #ae7b05;\n      border-color: #8c6204; }\n      .crds-shared-header .btn-warning:active:hover, .crds-shared-header .btn-warning:active:focus, .crds-shared-header .btn-warning:active.focus, .crds-shared-header .btn-warning.active:hover, .crds-shared-header .btn-warning.active:focus, .crds-shared-header .btn-warning.active.focus,\n      .open > .crds-shared-header .btn-warning.dropdown-toggle:hover,\n      .open > .crds-shared-header .btn-warning.dropdown-toggle:focus,\n      .open > .crds-shared-header .btn-warning.dropdown-toggle.focus {\n        color: #fff;\n        background-color: #8c6204;\n        border-color: #4b3502; }\n    .crds-shared-header .btn-warning:active, .crds-shared-header .btn-warning.active,\n    .open > .crds-shared-header .btn-warning.dropdown-toggle {\n      background-image: none; }\n    .crds-shared-header .btn-warning.disabled:hover, .crds-shared-header .btn-warning.disabled:focus, .crds-shared-header .btn-warning.disabled.focus, .crds-shared-header .btn-warning[disabled]:hover, .crds-shared-header .btn-warning[disabled]:focus, .crds-shared-header .btn-warning[disabled].focus,\n    fieldset[disabled] .crds-shared-header .btn-warning:hover,\n    fieldset[disabled] .crds-shared-header .btn-warning:focus,\n    fieldset[disabled] .crds-shared-header .btn-warning.focus {\n      background-color: #e09e06;\n      border-color: #c78c05; }\n    .crds-shared-header .btn-warning .badge {\n      color: #e09e06;\n      background-color: #fff; }\n  .crds-shared-header .btn-danger {\n    color: #fff;\n    background-color: #d96f62;\n    border-color: #d45c4d; }\n    .crds-shared-header .btn-danger:focus, .crds-shared-header .btn-danger.focus {\n      color: #fff;\n      background-color: #cf4939;\n      border-color: #822a20; }\n    .crds-shared-header .btn-danger:hover {\n      color: #fff;\n      background-color: #cf4939;\n      border-color: #b83c2c; }\n    .crds-shared-header .btn-danger:active, .crds-shared-header .btn-danger.active,\n    .open > .crds-shared-header .btn-danger.dropdown-toggle {\n      color: #fff;\n      background-color: #cf4939;\n      border-color: #b83c2c; }\n      .crds-shared-header .btn-danger:active:hover, .crds-shared-header .btn-danger:active:focus, .crds-shared-header .btn-danger:active.focus, .crds-shared-header .btn-danger.active:hover, .crds-shared-header .btn-danger.active:focus, .crds-shared-header .btn-danger.active.focus,\n      .open > .crds-shared-header .btn-danger.dropdown-toggle:hover,\n      .open > .crds-shared-header .btn-danger.dropdown-toggle:focus,\n      .open > .crds-shared-header .btn-danger.dropdown-toggle.focus {\n        color: #fff;\n        background-color: #b83c2c;\n        border-color: #822a20; }\n    .crds-shared-header .btn-danger:active, .crds-shared-header .btn-danger.active,\n    .open > .crds-shared-header .btn-danger.dropdown-toggle {\n      background-image: none; }\n    .crds-shared-header .btn-danger.disabled:hover, .crds-shared-header .btn-danger.disabled:focus, .crds-shared-header .btn-danger.disabled.focus, .crds-shared-header .btn-danger[disabled]:hover, .crds-shared-header .btn-danger[disabled]:focus, .crds-shared-header .btn-danger[disabled].focus,\n    fieldset[disabled] .crds-shared-header .btn-danger:hover,\n    fieldset[disabled] .crds-shared-header .btn-danger:focus,\n    fieldset[disabled] .crds-shared-header .btn-danger.focus {\n      background-color: #d96f62;\n      border-color: #d45c4d; }\n    .crds-shared-header .btn-danger .badge {\n      color: #d96f62;\n      background-color: #fff; }\n  .crds-shared-header .btn-link {\n    color: #0095d9;\n    font-weight: normal;\n    border-radius: 0; }\n    .crds-shared-header .btn-link, .crds-shared-header .btn-link:active, .crds-shared-header .btn-link.active, .crds-shared-header .btn-link[disabled],\n    fieldset[disabled] .crds-shared-header .btn-link {\n      background-color: transparent;\n      -webkit-box-shadow: none;\n      box-shadow: none; }\n    .crds-shared-header .btn-link, .crds-shared-header .btn-link:hover, .crds-shared-header .btn-link:focus, .crds-shared-header .btn-link:active {\n      border-color: transparent; }\n    .crds-shared-header .btn-link:hover, .crds-shared-header .btn-link:focus {\n      color: #006d9e;\n      text-decoration: underline;\n      background-color: transparent; }\n    .crds-shared-header .btn-link[disabled]:hover, .crds-shared-header .btn-link[disabled]:focus,\n    fieldset[disabled] .crds-shared-header .btn-link:hover,\n    fieldset[disabled] .crds-shared-header .btn-link:focus {\n      color: #979797;\n      text-decoration: none; }\n  .crds-shared-header .btn-lg, .crds-shared-header .btn-group-lg > .btn {\n    padding: 10px 16px;\n    font-size: 19px;\n    line-height: 1.75;\n    border-radius: 4px; }\n  .crds-shared-header .btn-sm, .crds-shared-header .btn-group-sm > .btn {\n    padding: 5px 10px;\n    font-size: 14px;\n    line-height: 1.25;\n    border-radius: 4px; }\n  .crds-shared-header .btn-xs, .crds-shared-header .btn-group-xs > .btn {\n    padding: 1px 5px;\n    font-size: 14px;\n    line-height: 1.25;\n    border-radius: 4px; }\n  .crds-shared-header .btn-block {\n    display: block;\n    width: 100%; }\n  .crds-shared-header .btn-block + .btn-block {\n    margin-top: 5px; }\n  .crds-shared-header input[type=\"submit\"].btn-block,\n  .crds-shared-header input[type=\"reset\"].btn-block,\n  .crds-shared-header input[type=\"button\"].btn-block {\n    width: 100%; }\n  .crds-shared-header .fade {\n    opacity: 0;\n    -webkit-transition: opacity 0.15s linear;\n    -o-transition: opacity 0.15s linear;\n    transition: opacity 0.15s linear; }\n    .crds-shared-header .fade.in {\n      opacity: 1; }\n  .crds-shared-header .collapse {\n    display: none; }\n    .crds-shared-header .collapse.in {\n      display: block; }\n  .crds-shared-header tr.collapse.in {\n    display: table-row; }\n  .crds-shared-header tbody.collapse.in {\n    display: table-row-group; }\n  .crds-shared-header .collapsing {\n    position: relative;\n    height: 0;\n    overflow: hidden;\n    -webkit-transition-property: height, visibility;\n    transition-property: height, visibility;\n    -webkit-transition-duration: 0.35s;\n    transition-duration: 0.35s;\n    -webkit-transition-timing-function: ease;\n    transition-timing-function: ease; }\n  .crds-shared-header .caret {\n    display: inline-block;\n    width: 0;\n    height: 0;\n    margin-left: 2px;\n    vertical-align: middle;\n    border-top: 4px dashed;\n    border-top: 4px solid \\9;\n    border-right: 4px solid transparent;\n    border-left: 4px solid transparent; }\n  .crds-shared-header .dropup,\n  .crds-shared-header .dropdown {\n    position: relative; }\n  .crds-shared-header .dropdown-toggle:focus {\n    outline: 0; }\n  .crds-shared-header .dropdown-menu {\n    position: absolute;\n    top: 100%;\n    left: 0;\n    z-index: 1000;\n    display: none;\n    float: left;\n    min-width: 160px;\n    padding: 5px 0;\n    margin: 2px 0 0;\n    list-style: none;\n    font-size: 16px;\n    text-align: left;\n    background-color: #fff;\n    border: 1px solid #ccc;\n    border: 1px solid rgba(0, 0, 0, 0.15);\n    border-radius: 4px;\n    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n    background-clip: padding-box; }\n    .crds-shared-header .dropdown-menu.pull-right {\n      right: 0;\n      left: auto; }\n    .crds-shared-header .dropdown-menu .divider {\n      height: 1px;\n      margin: 11px 0;\n      overflow: hidden;\n      background-color: #e5e5e5; }\n    .crds-shared-header .dropdown-menu > li > a {\n      display: block;\n      padding: 3px 20px;\n      clear: both;\n      font-weight: normal;\n      line-height: 1.5;\n      color: #4d4d4d;\n      white-space: nowrap; }\n  .crds-shared-header .dropdown-menu > li > a:hover, .crds-shared-header .dropdown-menu > li > a:focus {\n    text-decoration: none;\n    color: #404040;\n    background-color: #f5f5f5; }\n  .crds-shared-header .dropdown-menu > .active > a, .crds-shared-header .dropdown-menu > .active > a:hover, .crds-shared-header .dropdown-menu > .active > a:focus {\n    color: #fff;\n    text-decoration: none;\n    outline: 0;\n    background-color: #3b6e8f; }\n  .crds-shared-header .dropdown-menu > .disabled > a, .crds-shared-header .dropdown-menu > .disabled > a:hover, .crds-shared-header .dropdown-menu > .disabled > a:focus {\n    color: #979797; }\n  .crds-shared-header .dropdown-menu > .disabled > a:hover, .crds-shared-header .dropdown-menu > .disabled > a:focus {\n    text-decoration: none;\n    background-color: transparent;\n    background-image: none;\n    filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n    cursor: not-allowed; }\n  .crds-shared-header .open > .dropdown-menu {\n    display: block; }\n  .crds-shared-header .open > a {\n    outline: 0; }\n  .crds-shared-header .dropdown-menu-right {\n    left: auto;\n    right: 0; }\n  .crds-shared-header .dropdown-menu-left {\n    left: 0;\n    right: auto; }\n  .crds-shared-header .dropdown-header {\n    display: block;\n    padding: 3px 20px;\n    font-size: 14px;\n    line-height: 1.5;\n    color: #979797;\n    white-space: nowrap; }\n  .crds-shared-header .dropdown-backdrop {\n    position: fixed;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    top: 0;\n    z-index: 990; }\n  .crds-shared-header .pull-right > .dropdown-menu {\n    right: 0;\n    left: auto; }\n  .crds-shared-header .dropup .caret,\n  .crds-shared-header .navbar-fixed-bottom .dropdown .caret {\n    border-top: 0;\n    border-bottom: 4px dashed;\n    border-bottom: 4px solid \\9;\n    content: \"\"; }\n  .crds-shared-header .dropup .dropdown-menu,\n  .crds-shared-header .navbar-fixed-bottom .dropdown .dropdown-menu {\n    top: auto;\n    bottom: 100%;\n    margin-bottom: 2px; }\n  @media (min-width: 768px) {\n    .crds-shared-header .navbar-right .dropdown-menu {\n      right: 0;\n      left: auto; }\n    .crds-shared-header .navbar-right .dropdown-menu-left {\n      left: 0;\n      right: auto; } }\n  .crds-shared-header .btn-group,\n  .crds-shared-header .btn-group-vertical {\n    position: relative;\n    display: inline-block;\n    vertical-align: middle; }\n    .crds-shared-header .btn-group > .btn,\n    .crds-shared-header .btn-group-vertical > .btn {\n      position: relative;\n      float: left; }\n      .crds-shared-header .btn-group > .btn:hover, .crds-shared-header .btn-group > .btn:focus, .crds-shared-header .btn-group > .btn:active, .crds-shared-header .btn-group > .btn.active,\n      .crds-shared-header .btn-group-vertical > .btn:hover,\n      .crds-shared-header .btn-group-vertical > .btn:focus,\n      .crds-shared-header .btn-group-vertical > .btn:active,\n      .crds-shared-header .btn-group-vertical > .btn.active {\n        z-index: 2; }\n  .crds-shared-header .btn-group .btn + .btn,\n  .crds-shared-header .btn-group .btn + .btn-group,\n  .crds-shared-header .btn-group .btn-group + .btn,\n  .crds-shared-header .btn-group .btn-group + .btn-group {\n    margin-left: -1px; }\n  .crds-shared-header .btn-toolbar {\n    margin-left: -5px; }\n    .crds-shared-header .btn-toolbar:before, .crds-shared-header .btn-toolbar:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .btn-toolbar:after {\n      clear: both; }\n    .crds-shared-header .btn-toolbar .btn,\n    .crds-shared-header .btn-toolbar .btn-group,\n    .crds-shared-header .btn-toolbar .input-group {\n      float: left; }\n    .crds-shared-header .btn-toolbar > .btn,\n    .crds-shared-header .btn-toolbar > .btn-group,\n    .crds-shared-header .btn-toolbar > .input-group {\n      margin-left: 5px; }\n  .crds-shared-header .btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n    border-radius: 0; }\n  .crds-shared-header .btn-group > .btn:first-child {\n    margin-left: 0; }\n    .crds-shared-header .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n      border-bottom-right-radius: 0;\n      border-top-right-radius: 0; }\n  .crds-shared-header .btn-group > .btn:last-child:not(:first-child),\n  .crds-shared-header .btn-group > .dropdown-toggle:not(:first-child) {\n    border-bottom-left-radius: 0;\n    border-top-left-radius: 0; }\n  .crds-shared-header .btn-group > .btn-group {\n    float: left; }\n  .crds-shared-header .btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n    border-radius: 0; }\n  .crds-shared-header .btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n  .crds-shared-header .btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n    border-bottom-right-radius: 0;\n    border-top-right-radius: 0; }\n  .crds-shared-header .btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n    border-bottom-left-radius: 0;\n    border-top-left-radius: 0; }\n  .crds-shared-header .btn-group .dropdown-toggle:active,\n  .crds-shared-header .btn-group.open .dropdown-toggle {\n    outline: 0; }\n  .crds-shared-header .btn-group > .btn + .dropdown-toggle {\n    padding-left: 8px;\n    padding-right: 8px; }\n  .crds-shared-header .btn-group > .btn-lg + .dropdown-toggle, .crds-shared-header .btn-group-lg.btn-group > .btn + .dropdown-toggle {\n    padding-left: 12px;\n    padding-right: 12px; }\n  .crds-shared-header .btn-group.open .dropdown-toggle {\n    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); }\n    .crds-shared-header .btn-group.open .dropdown-toggle.btn-link {\n      -webkit-box-shadow: none;\n      box-shadow: none; }\n  .crds-shared-header .btn .caret {\n    margin-left: 0; }\n  .crds-shared-header .btn-lg .caret, .crds-shared-header .btn-group-lg > .btn .caret {\n    border-width: 5px 5px 0;\n    border-bottom-width: 0; }\n  .crds-shared-header .dropup .btn-lg .caret, .crds-shared-header .dropup .btn-group-lg > .btn .caret {\n    border-width: 0 5px 5px; }\n  .crds-shared-header .btn-group-vertical > .btn,\n  .crds-shared-header .btn-group-vertical > .btn-group,\n  .crds-shared-header .btn-group-vertical > .btn-group > .btn {\n    display: block;\n    float: none;\n    width: 100%;\n    max-width: 100%; }\n  .crds-shared-header .btn-group-vertical > .btn-group:before, .crds-shared-header .btn-group-vertical > .btn-group:after {\n    content: \" \";\n    display: table; }\n  .crds-shared-header .btn-group-vertical > .btn-group:after {\n    clear: both; }\n  .crds-shared-header .btn-group-vertical > .btn-group > .btn {\n    float: none; }\n  .crds-shared-header .btn-group-vertical > .btn + .btn,\n  .crds-shared-header .btn-group-vertical > .btn + .btn-group,\n  .crds-shared-header .btn-group-vertical > .btn-group + .btn,\n  .crds-shared-header .btn-group-vertical > .btn-group + .btn-group {\n    margin-top: -1px;\n    margin-left: 0; }\n  .crds-shared-header .btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n    border-radius: 0; }\n  .crds-shared-header .btn-group-vertical > .btn:first-child:not(:last-child) {\n    border-top-right-radius: 4px;\n    border-top-left-radius: 4px;\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0; }\n  .crds-shared-header .btn-group-vertical > .btn:last-child:not(:first-child) {\n    border-top-right-radius: 0;\n    border-top-left-radius: 0;\n    border-bottom-right-radius: 4px;\n    border-bottom-left-radius: 4px; }\n  .crds-shared-header .btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n    border-radius: 0; }\n  .crds-shared-header .btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n  .crds-shared-header .btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0; }\n  .crds-shared-header .btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n    border-top-right-radius: 0;\n    border-top-left-radius: 0; }\n  .crds-shared-header .btn-group-justified {\n    display: table;\n    width: 100%;\n    table-layout: fixed;\n    border-collapse: separate; }\n    .crds-shared-header .btn-group-justified > .btn,\n    .crds-shared-header .btn-group-justified > .btn-group {\n      float: none;\n      display: table-cell;\n      width: 1%; }\n    .crds-shared-header .btn-group-justified > .btn-group .btn {\n      width: 100%; }\n    .crds-shared-header .btn-group-justified > .btn-group .dropdown-menu {\n      left: auto; }\n  .crds-shared-header [data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n  .crds-shared-header [data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n  .crds-shared-header [data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n  .crds-shared-header [data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n    position: absolute;\n    clip: rect(0, 0, 0, 0);\n    pointer-events: none; }\n  .crds-shared-header .input-group {\n    position: relative;\n    display: table;\n    border-collapse: separate; }\n    .crds-shared-header .input-group[class*=\"col-\"] {\n      float: none;\n      padding-left: 0;\n      padding-right: 0; }\n    .crds-shared-header .input-group .form-control {\n      position: relative;\n      z-index: 2;\n      float: left;\n      width: 100%;\n      margin-bottom: 0; }\n      .crds-shared-header .input-group .form-control:focus {\n        z-index: 3; }\n  .crds-shared-header .input-group-addon,\n  .crds-shared-header .input-group-btn,\n  .crds-shared-header .input-group .form-control {\n    display: table-cell; }\n    .crds-shared-header .input-group-addon:not(:first-child):not(:last-child),\n    .crds-shared-header .input-group-btn:not(:first-child):not(:last-child),\n    .crds-shared-header .input-group .form-control:not(:first-child):not(:last-child) {\n      border-radius: 0; }\n  .crds-shared-header .input-group-addon,\n  .crds-shared-header .input-group-btn {\n    width: 1%;\n    white-space: nowrap;\n    vertical-align: middle; }\n  .crds-shared-header .input-group-addon {\n    padding: 8px 10px;\n    font-size: 16px;\n    font-weight: normal;\n    line-height: 1;\n    color: #4d4d4d;\n    text-align: center;\n    background-color: transparent;\n    border: 1px solid transparent;\n    border-radius: 0; }\n    .crds-shared-header .input-group-addon.input-sm, .crds-shared-header .input-group-sm > .input-group-addon, .crds-shared-header .input-group-sm > .input-group-btn > .input-group-addon.btn {\n      padding: 5px 10px;\n      font-size: 14px;\n      border-radius: 0; }\n    .crds-shared-header .input-group-addon.input-lg, .crds-shared-header .input-group-lg > .input-group-addon, .crds-shared-header .input-group-lg > .input-group-btn > .input-group-addon.btn {\n      padding: 10px 16px;\n      font-size: 19px;\n      border-radius: 0; }\n    .crds-shared-header .input-group-addon input[type=\"radio\"],\n    .crds-shared-header .input-group-addon input[type=\"checkbox\"] {\n      margin-top: 0; }\n  .crds-shared-header .input-group .form-control:first-child,\n  .crds-shared-header .input-group-addon:first-child,\n  .crds-shared-header .input-group-btn:first-child > .btn,\n  .crds-shared-header .input-group-btn:first-child > .btn-group > .btn,\n  .crds-shared-header .input-group-btn:first-child > .dropdown-toggle,\n  .crds-shared-header .input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n  .crds-shared-header .input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\n    border-bottom-right-radius: 0;\n    border-top-right-radius: 0; }\n  .crds-shared-header .input-group-addon:first-child {\n    border-right: 0; }\n  .crds-shared-header .input-group .form-control:last-child,\n  .crds-shared-header .input-group-addon:last-child,\n  .crds-shared-header .input-group-btn:last-child > .btn,\n  .crds-shared-header .input-group-btn:last-child > .btn-group > .btn,\n  .crds-shared-header .input-group-btn:last-child > .dropdown-toggle,\n  .crds-shared-header .input-group-btn:first-child > .btn:not(:first-child),\n  .crds-shared-header .input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\n    border-bottom-left-radius: 0;\n    border-top-left-radius: 0; }\n  .crds-shared-header .input-group-addon:last-child {\n    border-left: 0; }\n  .crds-shared-header .input-group-btn {\n    position: relative;\n    font-size: 0;\n    white-space: nowrap; }\n    .crds-shared-header .input-group-btn > .btn {\n      position: relative; }\n      .crds-shared-header .input-group-btn > .btn + .btn {\n        margin-left: -1px; }\n      .crds-shared-header .input-group-btn > .btn:hover, .crds-shared-header .input-group-btn > .btn:focus, .crds-shared-header .input-group-btn > .btn:active {\n        z-index: 2; }\n    .crds-shared-header .input-group-btn:first-child > .btn,\n    .crds-shared-header .input-group-btn:first-child > .btn-group {\n      margin-right: -1px; }\n    .crds-shared-header .input-group-btn:last-child > .btn,\n    .crds-shared-header .input-group-btn:last-child > .btn-group {\n      z-index: 2;\n      margin-left: -1px; }\n  .crds-shared-header .nav {\n    margin-bottom: 0;\n    padding-left: 0;\n    list-style: none; }\n    .crds-shared-header .nav:before, .crds-shared-header .nav:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .nav:after {\n      clear: both; }\n    .crds-shared-header .nav > li {\n      position: relative;\n      display: block; }\n      .crds-shared-header .nav > li > a {\n        position: relative;\n        display: block;\n        padding: 10px 15px; }\n        .crds-shared-header .nav > li > a:hover, .crds-shared-header .nav > li > a:focus {\n          text-decoration: none;\n          background-color: #3b6e8f; }\n      .crds-shared-header .nav > li.disabled > a {\n        color: #979797; }\n        .crds-shared-header .nav > li.disabled > a:hover, .crds-shared-header .nav > li.disabled > a:focus {\n          color: #979797;\n          text-decoration: none;\n          background-color: transparent;\n          cursor: not-allowed; }\n    .crds-shared-header .nav .open > a, .crds-shared-header .nav .open > a:hover, .crds-shared-header .nav .open > a:focus {\n      background-color: #3b6e8f;\n      border-color: #0095d9; }\n    .crds-shared-header .nav .nav-divider {\n      height: 1px;\n      margin: 11px 0;\n      overflow: hidden;\n      background-color: #e5e5e5; }\n    .crds-shared-header .nav > li > a > img {\n      max-width: none; }\n  .crds-shared-header .nav-tabs {\n    border-bottom: 1px solid #ddd; }\n    .crds-shared-header .nav-tabs > li {\n      float: left;\n      margin-bottom: -1px; }\n      .crds-shared-header .nav-tabs > li > a {\n        margin-right: 2px;\n        line-height: 1.5;\n        border: 1px solid transparent;\n        border-radius: 4px 4px 0 0; }\n        .crds-shared-header .nav-tabs > li > a:hover {\n          border-color: #e7e7e7 #e7e7e7 #ddd; }\n      .crds-shared-header .nav-tabs > li.active > a, .crds-shared-header .nav-tabs > li.active > a:hover, .crds-shared-header .nav-tabs > li.active > a:focus {\n        color: #737373;\n        background-color: white;\n        border: 1px solid #ddd;\n        border-bottom-color: transparent;\n        cursor: default; }\n  .crds-shared-header .nav-pills > li {\n    float: left; }\n    .crds-shared-header .nav-pills > li > a {\n      border-radius: 4px; }\n    .crds-shared-header .nav-pills > li + li {\n      margin-left: 2px; }\n    .crds-shared-header .nav-pills > li.active > a, .crds-shared-header .nav-pills > li.active > a:hover, .crds-shared-header .nav-pills > li.active > a:focus {\n      color: white;\n      background-color: #3b6e8f; }\n  .crds-shared-header .nav-stacked > li {\n    float: none; }\n    .crds-shared-header .nav-stacked > li + li {\n      margin-top: 2px;\n      margin-left: 0; }\n  .crds-shared-header .nav-justified, .crds-shared-header .nav-tabs.nav-justified {\n    width: 100%; }\n    .crds-shared-header .nav-justified > li, .crds-shared-header .nav-tabs.nav-justified > li {\n      float: none; }\n      .crds-shared-header .nav-justified > li > a, .crds-shared-header .nav-tabs.nav-justified > li > a {\n        text-align: center;\n        margin-bottom: 5px; }\n    .crds-shared-header .nav-justified > .dropdown .dropdown-menu {\n      top: auto;\n      left: auto; }\n    @media (min-width: 768px) {\n      .crds-shared-header .nav-justified > li, .crds-shared-header .nav-tabs.nav-justified > li {\n        display: table-cell;\n        width: 1%; }\n        .crds-shared-header .nav-justified > li > a, .crds-shared-header .nav-tabs.nav-justified > li > a {\n          margin-bottom: 0; } }\n  .crds-shared-header .nav-tabs-justified, .crds-shared-header .nav-tabs.nav-justified {\n    border-bottom: 0; }\n    .crds-shared-header .nav-tabs-justified > li > a, .crds-shared-header .nav-tabs.nav-justified > li > a {\n      margin-right: 0;\n      border-radius: 4px; }\n    .crds-shared-header .nav-tabs-justified > .active > a, .crds-shared-header .nav-tabs.nav-justified > .active > a,\n    .crds-shared-header .nav-tabs-justified > .active > a:hover, .crds-shared-header .nav-tabs.nav-justified > .active > a:hover,\n    .crds-shared-header .nav-tabs-justified > .active > a:focus, .crds-shared-header .nav-tabs.nav-justified > .active > a:focus {\n      border: 1px solid #ddd; }\n    @media (min-width: 768px) {\n      .crds-shared-header .nav-tabs-justified > li > a, .crds-shared-header .nav-tabs.nav-justified > li > a {\n        border-bottom: 1px solid #ddd;\n        border-radius: 4px 4px 0 0; }\n      .crds-shared-header .nav-tabs-justified > .active > a, .crds-shared-header .nav-tabs.nav-justified > .active > a,\n      .crds-shared-header .nav-tabs-justified > .active > a:hover, .crds-shared-header .nav-tabs.nav-justified > .active > a:hover,\n      .crds-shared-header .nav-tabs-justified > .active > a:focus, .crds-shared-header .nav-tabs.nav-justified > .active > a:focus {\n        border-bottom-color: white; } }\n  .crds-shared-header .tab-content > .tab-pane {\n    display: none; }\n  .crds-shared-header .tab-content > .active {\n    display: block; }\n  .crds-shared-header .nav-tabs .dropdown-menu {\n    margin-top: -1px;\n    border-top-right-radius: 0;\n    border-top-left-radius: 0; }\n  .crds-shared-header .navbar {\n    position: relative;\n    min-height: 50px;\n    margin-bottom: 24px;\n    border: 1px solid transparent; }\n    .crds-shared-header .navbar:before, .crds-shared-header .navbar:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .navbar:after {\n      clear: both; }\n    @media (min-width: 768px) {\n      .crds-shared-header .navbar {\n        border-radius: 4px; } }\n  .crds-shared-header .navbar-header:before, .crds-shared-header .navbar-header:after {\n    content: \" \";\n    display: table; }\n  .crds-shared-header .navbar-header:after {\n    clear: both; }\n  @media (min-width: 768px) {\n    .crds-shared-header .navbar-header {\n      float: left; } }\n  .crds-shared-header .navbar-collapse {\n    overflow-x: visible;\n    padding-right: 15px;\n    padding-left: 15px;\n    border-top: 1px solid transparent;\n    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);\n    -webkit-overflow-scrolling: touch; }\n    .crds-shared-header .navbar-collapse:before, .crds-shared-header .navbar-collapse:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .navbar-collapse:after {\n      clear: both; }\n    .crds-shared-header .navbar-collapse.in {\n      overflow-y: auto; }\n    @media (min-width: 768px) {\n      .crds-shared-header .navbar-collapse {\n        width: auto;\n        border-top: 0;\n        box-shadow: none; }\n        .crds-shared-header .navbar-collapse.collapse {\n          display: block !important;\n          height: auto !important;\n          padding-bottom: 0;\n          overflow: visible !important; }\n        .crds-shared-header .navbar-collapse.in {\n          overflow-y: visible; }\n        .navbar-fixed-top .crds-shared-header .navbar-collapse,\n        .navbar-static-top .crds-shared-header .navbar-collapse,\n        .navbar-fixed-bottom .crds-shared-header .navbar-collapse {\n          padding-left: 0;\n          padding-right: 0; } }\n  .crds-shared-header .navbar-fixed-top .navbar-collapse,\n  .crds-shared-header .navbar-fixed-bottom .navbar-collapse {\n    max-height: 340px; }\n    @media (max-device-width: 480px) and (orientation: landscape) {\n      .crds-shared-header .navbar-fixed-top .navbar-collapse,\n      .crds-shared-header .navbar-fixed-bottom .navbar-collapse {\n        max-height: 200px; } }\n  .crds-shared-header .container > .navbar-header,\n  .crds-shared-header .container > .navbar-collapse,\n  .crds-shared-header .container-fluid > .navbar-header,\n  .crds-shared-header .container-fluid > .navbar-collapse {\n    margin-right: -15px;\n    margin-left: -15px; }\n    @media (min-width: 768px) {\n      .crds-shared-header .container > .navbar-header,\n      .crds-shared-header .container > .navbar-collapse,\n      .crds-shared-header .container-fluid > .navbar-header,\n      .crds-shared-header .container-fluid > .navbar-collapse {\n        margin-right: 0;\n        margin-left: 0; } }\n  .crds-shared-header .navbar-static-top {\n    z-index: 1000;\n    border-width: 0 0 1px; }\n    @media (min-width: 768px) {\n      .crds-shared-header .navbar-static-top {\n        border-radius: 0; } }\n  .crds-shared-header .navbar-fixed-top,\n  .crds-shared-header .navbar-fixed-bottom {\n    position: fixed;\n    right: 0;\n    left: 0;\n    z-index: 1030; }\n    @media (min-width: 768px) {\n      .crds-shared-header .navbar-fixed-top,\n      .crds-shared-header .navbar-fixed-bottom {\n        border-radius: 0; } }\n  .crds-shared-header .navbar-fixed-top {\n    top: 0;\n    border-width: 0 0 1px; }\n  .crds-shared-header .navbar-fixed-bottom {\n    bottom: 0;\n    margin-bottom: 0;\n    border-width: 1px 0 0; }\n  .crds-shared-header .navbar-brand {\n    float: left;\n    padding: 13px 15px;\n    font-size: 19px;\n    line-height: 24px;\n    height: 50px; }\n    .crds-shared-header .navbar-brand:hover, .crds-shared-header .navbar-brand:focus {\n      text-decoration: none; }\n    .crds-shared-header .navbar-brand > img {\n      display: block; }\n    @media (min-width: 768px) {\n      .navbar > .container .crds-shared-header .navbar-brand,\n      .navbar > .container-fluid .crds-shared-header .navbar-brand {\n        margin-left: -15px; } }\n  .crds-shared-header .navbar-toggle {\n    position: relative;\n    float: right;\n    margin-right: 15px;\n    padding: 9px 10px;\n    margin-top: 8px;\n    margin-bottom: 8px;\n    background-color: transparent;\n    background-image: none;\n    border: 1px solid transparent;\n    border-radius: 4px; }\n    .crds-shared-header .navbar-toggle:focus {\n      outline: 0; }\n    .crds-shared-header .navbar-toggle .icon-bar {\n      display: block;\n      width: 22px;\n      height: 2px;\n      border-radius: 1px; }\n    .crds-shared-header .navbar-toggle .icon-bar + .icon-bar {\n      margin-top: 4px; }\n    @media (min-width: 768px) {\n      .crds-shared-header .navbar-toggle {\n        display: none; } }\n  .crds-shared-header .navbar-nav {\n    margin: 6.5px -15px; }\n    .crds-shared-header .navbar-nav > li > a {\n      padding-top: 10px;\n      padding-bottom: 10px;\n      line-height: 24px; }\n    @media (max-width: 767px) {\n      .crds-shared-header .navbar-nav .open .dropdown-menu {\n        position: static;\n        float: none;\n        width: auto;\n        margin-top: 0;\n        background-color: transparent;\n        border: 0;\n        box-shadow: none; }\n        .crds-shared-header .navbar-nav .open .dropdown-menu > li > a,\n        .crds-shared-header .navbar-nav .open .dropdown-menu .dropdown-header {\n          padding: 5px 15px 5px 25px; }\n        .crds-shared-header .navbar-nav .open .dropdown-menu > li > a {\n          line-height: 24px; }\n          .crds-shared-header .navbar-nav .open .dropdown-menu > li > a:hover, .crds-shared-header .navbar-nav .open .dropdown-menu > li > a:focus {\n            background-image: none; } }\n    @media (min-width: 768px) {\n      .crds-shared-header .navbar-nav {\n        float: left;\n        margin: 0; }\n        .crds-shared-header .navbar-nav > li {\n          float: left; }\n          .crds-shared-header .navbar-nav > li > a {\n            padding-top: 13px;\n            padding-bottom: 13px; } }\n  .crds-shared-header .navbar-form {\n    margin-left: -15px;\n    margin-right: -15px;\n    padding: 10px 15px;\n    border-top: 1px solid transparent;\n    border-bottom: 1px solid transparent;\n    -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n    margin-top: 4px;\n    margin-bottom: 4px; }\n    @media (min-width: 768px) {\n      .crds-shared-header .navbar-form .form-group {\n        display: inline-block;\n        margin-bottom: 0;\n        vertical-align: middle; }\n      .crds-shared-header .navbar-form .form-control {\n        display: inline-block;\n        width: auto;\n        vertical-align: middle; }\n      .crds-shared-header .navbar-form .form-control-static {\n        display: inline-block; }\n      .crds-shared-header .navbar-form .input-group {\n        display: inline-table;\n        vertical-align: middle; }\n        .crds-shared-header .navbar-form .input-group .input-group-addon,\n        .crds-shared-header .navbar-form .input-group .input-group-btn,\n        .crds-shared-header .navbar-form .input-group .form-control {\n          width: auto; }\n      .crds-shared-header .navbar-form .input-group > .form-control {\n        width: 100%; }\n      .crds-shared-header .navbar-form .control-label {\n        margin-bottom: 0;\n        vertical-align: middle; }\n      .crds-shared-header .navbar-form .radio,\n      .crds-shared-header .navbar-form .checkbox {\n        display: inline-block;\n        margin-top: 0;\n        margin-bottom: 0;\n        vertical-align: middle; }\n        .crds-shared-header .navbar-form .radio label,\n        .crds-shared-header .navbar-form .checkbox label {\n          padding-left: 0; }\n      .crds-shared-header .navbar-form .radio input[type=\"radio\"],\n      .crds-shared-header .navbar-form .checkbox input[type=\"checkbox\"] {\n        position: relative;\n        margin-left: 0; }\n      .crds-shared-header .navbar-form .has-feedback .form-control-feedback {\n        top: 0; } }\n    @media (max-width: 767px) {\n      .crds-shared-header .navbar-form .form-group {\n        margin-bottom: 5px; }\n        .crds-shared-header .navbar-form .form-group:last-child {\n          margin-bottom: 0; } }\n    @media (min-width: 768px) {\n      .crds-shared-header .navbar-form {\n        width: auto;\n        border: 0;\n        margin-left: 0;\n        margin-right: 0;\n        padding-top: 0;\n        padding-bottom: 0;\n        -webkit-box-shadow: none;\n        box-shadow: none; } }\n  .crds-shared-header .navbar-nav > li > .dropdown-menu {\n    margin-top: 0;\n    border-top-right-radius: 0;\n    border-top-left-radius: 0; }\n  .crds-shared-header .navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\n    margin-bottom: 0;\n    border-top-right-radius: 4px;\n    border-top-left-radius: 4px;\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0; }\n  .crds-shared-header .navbar-btn {\n    margin-top: 4px;\n    margin-bottom: 4px; }\n    .crds-shared-header .navbar-btn.btn-sm, .crds-shared-header .btn-group-sm > .navbar-btn.btn {\n      margin-top: 10px;\n      margin-bottom: 10px; }\n    .crds-shared-header .navbar-btn.btn-xs, .crds-shared-header .btn-group-xs > .navbar-btn.btn {\n      margin-top: 14px;\n      margin-bottom: 14px; }\n  .crds-shared-header .navbar-text {\n    margin-top: 13px;\n    margin-bottom: 13px; }\n    @media (min-width: 768px) {\n      .crds-shared-header .navbar-text {\n        float: left;\n        margin-left: 15px;\n        margin-right: 15px; } }\n  @media (min-width: 768px) {\n    .crds-shared-header .navbar-left {\n      float: left !important; }\n    .crds-shared-header .navbar-right {\n      float: right !important;\n      margin-right: -15px; }\n      .crds-shared-header .navbar-right ~ .navbar-right {\n        margin-right: 0; } }\n  .crds-shared-header .navbar-default {\n    background-color: #f8f8f8;\n    border-color: #e7e7e7; }\n    .crds-shared-header .navbar-default .navbar-brand {\n      color: #777; }\n      .crds-shared-header .navbar-default .navbar-brand:hover, .crds-shared-header .navbar-default .navbar-brand:focus {\n        color: #5e5e5e;\n        background-color: transparent; }\n    .crds-shared-header .navbar-default .navbar-text {\n      color: #777; }\n    .crds-shared-header .navbar-default .navbar-nav > li > a {\n      color: #777; }\n      .crds-shared-header .navbar-default .navbar-nav > li > a:hover, .crds-shared-header .navbar-default .navbar-nav > li > a:focus {\n        color: #333;\n        background-color: transparent; }\n    .crds-shared-header .navbar-default .navbar-nav > .active > a, .crds-shared-header .navbar-default .navbar-nav > .active > a:hover, .crds-shared-header .navbar-default .navbar-nav > .active > a:focus {\n      color: #555;\n      background-color: #e7e7e7; }\n    .crds-shared-header .navbar-default .navbar-nav > .disabled > a, .crds-shared-header .navbar-default .navbar-nav > .disabled > a:hover, .crds-shared-header .navbar-default .navbar-nav > .disabled > a:focus {\n      color: #ccc;\n      background-color: transparent; }\n    .crds-shared-header .navbar-default .navbar-toggle {\n      border-color: #ddd; }\n      .crds-shared-header .navbar-default .navbar-toggle:hover, .crds-shared-header .navbar-default .navbar-toggle:focus {\n        background-color: #ddd; }\n      .crds-shared-header .navbar-default .navbar-toggle .icon-bar {\n        background-color: #888; }\n    .crds-shared-header .navbar-default .navbar-collapse,\n    .crds-shared-header .navbar-default .navbar-form {\n      border-color: #e7e7e7; }\n    .crds-shared-header .navbar-default .navbar-nav > .open > a, .crds-shared-header .navbar-default .navbar-nav > .open > a:hover, .crds-shared-header .navbar-default .navbar-nav > .open > a:focus {\n      background-color: #e7e7e7;\n      color: #555; }\n    @media (max-width: 767px) {\n      .crds-shared-header .navbar-default .navbar-nav .open .dropdown-menu > li > a {\n        color: #777; }\n        .crds-shared-header .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover, .crds-shared-header .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\n          color: #333;\n          background-color: transparent; }\n      .crds-shared-header .navbar-default .navbar-nav .open .dropdown-menu > .active > a, .crds-shared-header .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover, .crds-shared-header .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\n        color: #555;\n        background-color: #e7e7e7; }\n      .crds-shared-header .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a, .crds-shared-header .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover, .crds-shared-header .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n        color: #ccc;\n        background-color: transparent; } }\n    .crds-shared-header .navbar-default .navbar-link {\n      color: #777; }\n      .crds-shared-header .navbar-default .navbar-link:hover {\n        color: #333; }\n    .crds-shared-header .navbar-default .btn-link {\n      color: #777; }\n      .crds-shared-header .navbar-default .btn-link:hover, .crds-shared-header .navbar-default .btn-link:focus {\n        color: #333; }\n      .crds-shared-header .navbar-default .btn-link[disabled]:hover, .crds-shared-header .navbar-default .btn-link[disabled]:focus,\n      fieldset[disabled] .crds-shared-header .navbar-default .btn-link:hover,\n      fieldset[disabled] .crds-shared-header .navbar-default .btn-link:focus {\n        color: #ccc; }\n  .crds-shared-header .navbar-inverse {\n    background-color: #222;\n    border-color: #090909; }\n    .crds-shared-header .navbar-inverse .navbar-brand {\n      color: #bdbdbd; }\n      .crds-shared-header .navbar-inverse .navbar-brand:hover, .crds-shared-header .navbar-inverse .navbar-brand:focus {\n        color: #fff;\n        background-color: transparent; }\n    .crds-shared-header .navbar-inverse .navbar-text {\n      color: #bdbdbd; }\n    .crds-shared-header .navbar-inverse .navbar-nav > li > a {\n      color: #bdbdbd; }\n      .crds-shared-header .navbar-inverse .navbar-nav > li > a:hover, .crds-shared-header .navbar-inverse .navbar-nav > li > a:focus {\n        color: #fff;\n        background-color: transparent; }\n    .crds-shared-header .navbar-inverse .navbar-nav > .active > a, .crds-shared-header .navbar-inverse .navbar-nav > .active > a:hover, .crds-shared-header .navbar-inverse .navbar-nav > .active > a:focus {\n      color: #fff;\n      background-color: #090909; }\n    .crds-shared-header .navbar-inverse .navbar-nav > .disabled > a, .crds-shared-header .navbar-inverse .navbar-nav > .disabled > a:hover, .crds-shared-header .navbar-inverse .navbar-nav > .disabled > a:focus {\n      color: #444;\n      background-color: transparent; }\n    .crds-shared-header .navbar-inverse .navbar-toggle {\n      border-color: #333; }\n      .crds-shared-header .navbar-inverse .navbar-toggle:hover, .crds-shared-header .navbar-inverse .navbar-toggle:focus {\n        background-color: #333; }\n      .crds-shared-header .navbar-inverse .navbar-toggle .icon-bar {\n        background-color: #fff; }\n    .crds-shared-header .navbar-inverse .navbar-collapse,\n    .crds-shared-header .navbar-inverse .navbar-form {\n      border-color: #101010; }\n    .crds-shared-header .navbar-inverse .navbar-nav > .open > a, .crds-shared-header .navbar-inverse .navbar-nav > .open > a:hover, .crds-shared-header .navbar-inverse .navbar-nav > .open > a:focus {\n      background-color: #090909;\n      color: #fff; }\n    @media (max-width: 767px) {\n      .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\n        border-color: #090909; }\n      .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\n        background-color: #090909; }\n      .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\n        color: #bdbdbd; }\n        .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover, .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\n          color: #fff;\n          background-color: transparent; }\n      .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a, .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover, .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {\n        color: #fff;\n        background-color: #090909; }\n      .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a, .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover, .crds-shared-header .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n        color: #444;\n        background-color: transparent; } }\n    .crds-shared-header .navbar-inverse .navbar-link {\n      color: #bdbdbd; }\n      .crds-shared-header .navbar-inverse .navbar-link:hover {\n        color: #fff; }\n    .crds-shared-header .navbar-inverse .btn-link {\n      color: #bdbdbd; }\n      .crds-shared-header .navbar-inverse .btn-link:hover, .crds-shared-header .navbar-inverse .btn-link:focus {\n        color: #fff; }\n      .crds-shared-header .navbar-inverse .btn-link[disabled]:hover, .crds-shared-header .navbar-inverse .btn-link[disabled]:focus,\n      fieldset[disabled] .crds-shared-header .navbar-inverse .btn-link:hover,\n      fieldset[disabled] .crds-shared-header .navbar-inverse .btn-link:focus {\n        color: #444; }\n  .crds-shared-header .breadcrumb {\n    padding: 8px 15px;\n    margin-bottom: 24px;\n    list-style: none;\n    background-color: #f5f5f5;\n    border-radius: 4px; }\n    .crds-shared-header .breadcrumb > li {\n      display: inline-block; }\n      .crds-shared-header .breadcrumb > li + li:before {\n        content: \"/ \";\n        padding: 0 5px;\n        color: #ccc; }\n    .crds-shared-header .breadcrumb > .active {\n      color: #979797; }\n  .crds-shared-header .pagination {\n    display: inline-block;\n    padding-left: 0;\n    margin: 24px 0;\n    border-radius: 4px; }\n    .crds-shared-header .pagination > li {\n      display: inline; }\n      .crds-shared-header .pagination > li > a,\n      .crds-shared-header .pagination > li > span {\n        position: relative;\n        float: left;\n        padding: 8px 10px;\n        line-height: 1.5;\n        text-decoration: none;\n        color: #0095d9;\n        background-color: #fff;\n        border: 1px solid #ddd;\n        margin-left: -1px; }\n      .crds-shared-header .pagination > li:first-child > a,\n      .crds-shared-header .pagination > li:first-child > span {\n        margin-left: 0;\n        border-bottom-left-radius: 4px;\n        border-top-left-radius: 4px; }\n      .crds-shared-header .pagination > li:last-child > a,\n      .crds-shared-header .pagination > li:last-child > span {\n        border-bottom-right-radius: 4px;\n        border-top-right-radius: 4px; }\n    .crds-shared-header .pagination > li > a:hover, .crds-shared-header .pagination > li > a:focus,\n    .crds-shared-header .pagination > li > span:hover,\n    .crds-shared-header .pagination > li > span:focus {\n      z-index: 2;\n      color: #006d9e;\n      background-color: #e7e7e7;\n      border-color: #ddd; }\n    .crds-shared-header .pagination > .active > a, .crds-shared-header .pagination > .active > a:hover, .crds-shared-header .pagination > .active > a:focus,\n    .crds-shared-header .pagination > .active > span,\n    .crds-shared-header .pagination > .active > span:hover,\n    .crds-shared-header .pagination > .active > span:focus {\n      z-index: 3;\n      color: #fff;\n      background-color: #3b6e8f;\n      border-color: #3b6e8f;\n      cursor: default; }\n    .crds-shared-header .pagination > .disabled > span,\n    .crds-shared-header .pagination > .disabled > span:hover,\n    .crds-shared-header .pagination > .disabled > span:focus,\n    .crds-shared-header .pagination > .disabled > a,\n    .crds-shared-header .pagination > .disabled > a:hover,\n    .crds-shared-header .pagination > .disabled > a:focus {\n      color: #979797;\n      background-color: #fff;\n      border-color: #ddd;\n      cursor: not-allowed; }\n  .crds-shared-header .pagination-lg > li > a,\n  .crds-shared-header .pagination-lg > li > span {\n    padding: 10px 16px;\n    font-size: 19px;\n    line-height: 1.75; }\n  .crds-shared-header .pagination-lg > li:first-child > a,\n  .crds-shared-header .pagination-lg > li:first-child > span {\n    border-bottom-left-radius: 4px;\n    border-top-left-radius: 4px; }\n  .crds-shared-header .pagination-lg > li:last-child > a,\n  .crds-shared-header .pagination-lg > li:last-child > span {\n    border-bottom-right-radius: 4px;\n    border-top-right-radius: 4px; }\n  .crds-shared-header .pagination-sm > li > a,\n  .crds-shared-header .pagination-sm > li > span {\n    padding: 5px 10px;\n    font-size: 14px;\n    line-height: 1.25; }\n  .crds-shared-header .pagination-sm > li:first-child > a,\n  .crds-shared-header .pagination-sm > li:first-child > span {\n    border-bottom-left-radius: 4px;\n    border-top-left-radius: 4px; }\n  .crds-shared-header .pagination-sm > li:last-child > a,\n  .crds-shared-header .pagination-sm > li:last-child > span {\n    border-bottom-right-radius: 4px;\n    border-top-right-radius: 4px; }\n  .crds-shared-header .pager {\n    padding-left: 0;\n    margin: 24px 0;\n    list-style: none;\n    text-align: center; }\n    .crds-shared-header .pager:before, .crds-shared-header .pager:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .pager:after {\n      clear: both; }\n    .crds-shared-header .pager li {\n      display: inline; }\n      .crds-shared-header .pager li > a,\n      .crds-shared-header .pager li > span {\n        display: inline-block;\n        padding: 5px 14px;\n        background-color: #fff;\n        border: 1px solid #ddd;\n        border-radius: 15px; }\n      .crds-shared-header .pager li > a:hover,\n      .crds-shared-header .pager li > a:focus {\n        text-decoration: none;\n        background-color: #e7e7e7; }\n    .crds-shared-header .pager .next > a,\n    .crds-shared-header .pager .next > span {\n      float: right; }\n    .crds-shared-header .pager .previous > a,\n    .crds-shared-header .pager .previous > span {\n      float: left; }\n    .crds-shared-header .pager .disabled > a,\n    .crds-shared-header .pager .disabled > a:hover,\n    .crds-shared-header .pager .disabled > a:focus,\n    .crds-shared-header .pager .disabled > span {\n      color: #979797;\n      background-color: #fff;\n      cursor: not-allowed; }\n  .crds-shared-header .label {\n    display: inline;\n    padding: .2em .6em .3em;\n    font-size: 75%;\n    font-weight: bold;\n    line-height: 1;\n    color: #4d4d4d;\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: baseline;\n    border-radius: .25em; }\n    .crds-shared-header .label:empty {\n      display: none; }\n    .btn .crds-shared-header .label {\n      position: relative;\n      top: -1px; }\n  .crds-shared-header a.label:hover, .crds-shared-header a.label:focus {\n    color: #fff;\n    text-decoration: none;\n    cursor: pointer; }\n  .crds-shared-header .label-default {\n    background-color: #e7e7e7; }\n    .crds-shared-header .label-default[href]:hover, .crds-shared-header .label-default[href]:focus {\n      background-color: #cecece; }\n  .crds-shared-header .label-primary {\n    background-color: #dbe4ea; }\n    .crds-shared-header .label-primary[href]:hover, .crds-shared-header .label-primary[href]:focus {\n      background-color: #bbccd7; }\n  .crds-shared-header .label-success {\n    background-color: #b6e6ca; }\n    .crds-shared-header .label-success[href]:hover, .crds-shared-header .label-success[href]:focus {\n      background-color: #90d9af; }\n  .crds-shared-header .label-info {\n    background-color: #b6dee6; }\n    .crds-shared-header .label-info[href]:hover, .crds-shared-header .label-info[href]:focus {\n      background-color: #90cdd9; }\n  .crds-shared-header .label-warning {\n    background-color: #f1e4c6; }\n    .crds-shared-header .label-warning[href]:hover, .crds-shared-header .label-warning[href]:focus {\n      background-color: #e8d09c; }\n  .crds-shared-header .label-danger {\n    background-color: #edbab4; }\n    .crds-shared-header .label-danger[href]:hover, .crds-shared-header .label-danger[href]:focus {\n      background-color: #e3958b; }\n  .crds-shared-header .badge {\n    display: inline-block;\n    min-width: 10px;\n    padding: 3px 7px;\n    font-size: 14px;\n    font-weight: bold;\n    color: #fff;\n    line-height: 1;\n    vertical-align: middle;\n    white-space: nowrap;\n    text-align: center;\n    background-color: #979797;\n    border-radius: 10px; }\n    .crds-shared-header .badge:empty {\n      display: none; }\n    .btn .crds-shared-header .badge {\n      position: relative;\n      top: -1px; }\n    .btn-xs .crds-shared-header .badge, .crds-shared-header .btn-group-xs > .btn .crds-shared-header .badge,\n    .btn-group-xs > .btn .crds-shared-header .badge {\n      top: 0;\n      padding: 1px 5px; }\n    .list-group-item.active > .crds-shared-header .badge,\n    .nav-pills > .active > a > .crds-shared-header .badge {\n      color: #0095d9;\n      background-color: #fff; }\n    .list-group-item > .crds-shared-header .badge {\n      float: right; }\n    .list-group-item > .crds-shared-header .badge + .crds-shared-header .badge {\n      margin-right: 5px; }\n    .nav-pills > li > a > .crds-shared-header .badge {\n      margin-left: 3px; }\n  .crds-shared-header a.badge:hover, .crds-shared-header a.badge:focus {\n    color: #fff;\n    text-decoration: none;\n    cursor: pointer; }\n  .crds-shared-header .jumbotron {\n    padding-top: 30px;\n    padding-bottom: 30px;\n    margin-bottom: 30px;\n    color: inherit;\n    background-color: #e7e7e7; }\n    .crds-shared-header .jumbotron h1,\n    .crds-shared-header .jumbotron .h1 {\n      color: inherit; }\n    .crds-shared-header .jumbotron p {\n      margin-bottom: 15px;\n      font-size: 24px;\n      font-weight: 200; }\n    .crds-shared-header .jumbotron > hr {\n      border-top-color: #cecece; }\n    .container .crds-shared-header .jumbotron,\n    .container-fluid .crds-shared-header .jumbotron {\n      border-radius: 4px;\n      padding-left: 15px;\n      padding-right: 15px; }\n    .crds-shared-header .jumbotron .container {\n      max-width: 100%; }\n    @media screen and (min-width: 768px) {\n      .crds-shared-header .jumbotron {\n        padding-top: 48px;\n        padding-bottom: 48px; }\n        .container .crds-shared-header .jumbotron,\n        .container-fluid .crds-shared-header .jumbotron {\n          padding-left: 60px;\n          padding-right: 60px; }\n        .crds-shared-header .jumbotron h1,\n        .crds-shared-header .jumbotron .h1 {\n          font-size: 72px; } }\n  .crds-shared-header .thumbnail {\n    display: block;\n    padding: 4px;\n    margin-bottom: 24px;\n    line-height: 1.5;\n    background-color: white;\n    border: 1px solid #ddd;\n    border-radius: 4px;\n    -webkit-transition: border 0.2s ease-in-out;\n    -o-transition: border 0.2s ease-in-out;\n    transition: border 0.2s ease-in-out; }\n    .crds-shared-header .thumbnail > img,\n    .crds-shared-header .thumbnail a > img {\n      display: block;\n      max-width: 100%;\n      height: auto;\n      margin-left: auto;\n      margin-right: auto; }\n    .crds-shared-header .thumbnail .caption {\n      padding: 9px;\n      color: #4d4d4d; }\n  .crds-shared-header a.thumbnail:hover,\n  .crds-shared-header a.thumbnail:focus,\n  .crds-shared-header a.thumbnail.active {\n    border-color: #0095d9; }\n  .crds-shared-header .alert {\n    padding: 1rem;\n    margin-bottom: 24px;\n    border: 1px solid transparent;\n    border-radius: 0; }\n    .crds-shared-header .alert h4 {\n      margin-top: 0;\n      color: inherit; }\n    .crds-shared-header .alert .alert-link {\n      font-weight: 300; }\n    .crds-shared-header .alert > p,\n    .crds-shared-header .alert > ul {\n      margin-bottom: 0; }\n    .crds-shared-header .alert > p + p {\n      margin-top: 5px; }\n  .crds-shared-header .alert-dismissable,\n  .crds-shared-header .alert-dismissible {\n    padding-right: 21rem; }\n    .crds-shared-header .alert-dismissable .close,\n    .crds-shared-header .alert-dismissible .close {\n      position: relative;\n      top: -2px;\n      right: -21px;\n      color: inherit; }\n  .crds-shared-header .alert-success {\n    background-color: #6acc93;\n    border-color: #6acc93;\n    color: white; }\n    .crds-shared-header .alert-success hr {\n      border-top-color: #57c585; }\n    .crds-shared-header .alert-success .alert-link {\n      color: #e6e6e6; }\n  .crds-shared-header .alert-info {\n    background-color: #6abccc;\n    border-color: #6abccc;\n    color: white; }\n    .crds-shared-header .alert-info hr {\n      border-top-color: #57b3c5; }\n    .crds-shared-header .alert-info .alert-link {\n      color: #e6e6e6; }\n  .crds-shared-header .alert-warning {\n    background-color: #debc73;\n    border-color: #debc73;\n    color: white; }\n    .crds-shared-header .alert-warning hr {\n      border-top-color: #d9b25e; }\n    .crds-shared-header .alert-warning .alert-link {\n      color: #e6e6e6; }\n  .crds-shared-header .alert-danger {\n    background-color: #d96f62;\n    border-color: #d96f62;\n    color: white; }\n    .crds-shared-header .alert-danger hr {\n      border-top-color: #d45c4d; }\n    .crds-shared-header .alert-danger .alert-link {\n      color: #e6e6e6; }\n\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0; }\n  to {\n    background-position: 0 0; } }\n\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0; }\n  to {\n    background-position: 0 0; } }\n  .crds-shared-header .progress {\n    overflow: hidden;\n    height: 24px;\n    margin-bottom: 24px;\n    background-color: #f5f5f5;\n    border-radius: 4px;\n    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); }\n  .crds-shared-header .progress-bar {\n    float: left;\n    width: 0%;\n    height: 100%;\n    font-size: 14px;\n    line-height: 24px;\n    color: #fff;\n    text-align: center;\n    background-color: #3b6e8f;\n    -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n    -webkit-transition: width 0.6s ease;\n    -o-transition: width 0.6s ease;\n    transition: width 0.6s ease; }\n  .crds-shared-header .progress-striped .progress-bar,\n  .crds-shared-header .progress-bar-striped {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-size: 40px 40px; }\n  .crds-shared-header .progress.active .progress-bar,\n  .crds-shared-header .progress-bar.active {\n    -webkit-animation: progress-bar-stripes 2s linear infinite;\n    -o-animation: progress-bar-stripes 2s linear infinite;\n    animation: progress-bar-stripes 2s linear infinite; }\n  .crds-shared-header .progress-bar-success {\n    background-color: #6acc93; }\n    .progress-striped .crds-shared-header .progress-bar-success {\n      background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n      background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n  .crds-shared-header .progress-bar-info {\n    background-color: #0095d9; }\n    .progress-striped .crds-shared-header .progress-bar-info {\n      background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n      background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n  .crds-shared-header .progress-bar-warning {\n    background-color: #e09e06; }\n    .progress-striped .crds-shared-header .progress-bar-warning {\n      background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n      background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n  .crds-shared-header .progress-bar-danger {\n    background-color: #d96f62; }\n    .progress-striped .crds-shared-header .progress-bar-danger {\n      background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n      background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n  .crds-shared-header .media {\n    margin-top: 15px; }\n    .crds-shared-header .media:first-child {\n      margin-top: 0; }\n  .crds-shared-header .media,\n  .crds-shared-header .media-body {\n    zoom: 1;\n    overflow: hidden; }\n  .crds-shared-header .media-body {\n    width: 10000px; }\n  .crds-shared-header .media-object {\n    display: block; }\n    .crds-shared-header .media-object.img-thumbnail {\n      max-width: none; }\n  .crds-shared-header .media-right,\n  .crds-shared-header .media > .pull-right {\n    padding-left: 10px; }\n  .crds-shared-header .media-left,\n  .crds-shared-header .media > .pull-left {\n    padding-right: 10px; }\n  .crds-shared-header .media-left,\n  .crds-shared-header .media-right,\n  .crds-shared-header .media-body {\n    display: table-cell;\n    vertical-align: top; }\n  .crds-shared-header .media-middle {\n    vertical-align: middle; }\n  .crds-shared-header .media-bottom {\n    vertical-align: bottom; }\n  .crds-shared-header .media-heading {\n    margin-top: 0;\n    margin-bottom: 5px; }\n  .crds-shared-header .media-list {\n    padding-left: 0;\n    list-style: none; }\n  .crds-shared-header .list-group {\n    margin-bottom: 20px;\n    padding-left: 0; }\n  .crds-shared-header .list-group-item {\n    position: relative;\n    display: block;\n    padding: 10px 15px;\n    margin-bottom: -1px;\n    background-color: #fff;\n    border: 1px solid #ddd; }\n    .crds-shared-header .list-group-item:first-child {\n      border-top-right-radius: 4px;\n      border-top-left-radius: 4px; }\n    .crds-shared-header .list-group-item:last-child {\n      margin-bottom: 0;\n      border-bottom-right-radius: 4px;\n      border-bottom-left-radius: 4px; }\n  .crds-shared-header a.list-group-item,\n  .crds-shared-header button.list-group-item {\n    color: #555; }\n    .crds-shared-header a.list-group-item .list-group-item-heading,\n    .crds-shared-header button.list-group-item .list-group-item-heading {\n      color: #333; }\n    .crds-shared-header a.list-group-item:hover, .crds-shared-header a.list-group-item:focus,\n    .crds-shared-header button.list-group-item:hover,\n    .crds-shared-header button.list-group-item:focus {\n      text-decoration: none;\n      color: #555;\n      background-color: #f5f5f5; }\n  .crds-shared-header button.list-group-item {\n    width: 100%;\n    text-align: left; }\n  .crds-shared-header .list-group-item.disabled, .crds-shared-header .list-group-item.disabled:hover, .crds-shared-header .list-group-item.disabled:focus {\n    background-color: #e7e7e7;\n    color: #979797;\n    cursor: not-allowed; }\n    .crds-shared-header .list-group-item.disabled .list-group-item-heading, .crds-shared-header .list-group-item.disabled:hover .list-group-item-heading, .crds-shared-header .list-group-item.disabled:focus .list-group-item-heading {\n      color: inherit; }\n    .crds-shared-header .list-group-item.disabled .list-group-item-text, .crds-shared-header .list-group-item.disabled:hover .list-group-item-text, .crds-shared-header .list-group-item.disabled:focus .list-group-item-text {\n      color: #979797; }\n  .crds-shared-header .list-group-item.active, .crds-shared-header .list-group-item.active:hover, .crds-shared-header .list-group-item.active:focus {\n    z-index: 2;\n    color: #fff;\n    background-color: #3b6e8f;\n    border-color: #3b6e8f; }\n    .crds-shared-header .list-group-item.active .list-group-item-heading,\n    .crds-shared-header .list-group-item.active .list-group-item-heading > small,\n    .crds-shared-header .list-group-item.active .list-group-item-heading > .small, .crds-shared-header .list-group-item.active:hover .list-group-item-heading,\n    .crds-shared-header .list-group-item.active:hover .list-group-item-heading > small,\n    .crds-shared-header .list-group-item.active:hover .list-group-item-heading > .small, .crds-shared-header .list-group-item.active:focus .list-group-item-heading,\n    .crds-shared-header .list-group-item.active:focus .list-group-item-heading > small,\n    .crds-shared-header .list-group-item.active:focus .list-group-item-heading > .small {\n      color: inherit; }\n    .crds-shared-header .list-group-item.active .list-group-item-text, .crds-shared-header .list-group-item.active:hover .list-group-item-text, .crds-shared-header .list-group-item.active:focus .list-group-item-text {\n      color: #b5d0e1; }\n  .crds-shared-header .list-group-item-success {\n    color: white;\n    background-color: #6acc93; }\n  .crds-shared-header a.list-group-item-success,\n  .crds-shared-header button.list-group-item-success {\n    color: white; }\n    .crds-shared-header a.list-group-item-success .list-group-item-heading,\n    .crds-shared-header button.list-group-item-success .list-group-item-heading {\n      color: inherit; }\n    .crds-shared-header a.list-group-item-success:hover, .crds-shared-header a.list-group-item-success:focus,\n    .crds-shared-header button.list-group-item-success:hover,\n    .crds-shared-header button.list-group-item-success:focus {\n      color: white;\n      background-color: #57c585; }\n    .crds-shared-header a.list-group-item-success.active, .crds-shared-header a.list-group-item-success.active:hover, .crds-shared-header a.list-group-item-success.active:focus,\n    .crds-shared-header button.list-group-item-success.active,\n    .crds-shared-header button.list-group-item-success.active:hover,\n    .crds-shared-header button.list-group-item-success.active:focus {\n      color: #fff;\n      background-color: white;\n      border-color: white; }\n  .crds-shared-header .list-group-item-info {\n    color: white;\n    background-color: #6abccc; }\n  .crds-shared-header a.list-group-item-info,\n  .crds-shared-header button.list-group-item-info {\n    color: white; }\n    .crds-shared-header a.list-group-item-info .list-group-item-heading,\n    .crds-shared-header button.list-group-item-info .list-group-item-heading {\n      color: inherit; }\n    .crds-shared-header a.list-group-item-info:hover, .crds-shared-header a.list-group-item-info:focus,\n    .crds-shared-header button.list-group-item-info:hover,\n    .crds-shared-header button.list-group-item-info:focus {\n      color: white;\n      background-color: #57b3c5; }\n    .crds-shared-header a.list-group-item-info.active, .crds-shared-header a.list-group-item-info.active:hover, .crds-shared-header a.list-group-item-info.active:focus,\n    .crds-shared-header button.list-group-item-info.active,\n    .crds-shared-header button.list-group-item-info.active:hover,\n    .crds-shared-header button.list-group-item-info.active:focus {\n      color: #fff;\n      background-color: white;\n      border-color: white; }\n  .crds-shared-header .list-group-item-warning {\n    color: white;\n    background-color: #debc73; }\n  .crds-shared-header a.list-group-item-warning,\n  .crds-shared-header button.list-group-item-warning {\n    color: white; }\n    .crds-shared-header a.list-group-item-warning .list-group-item-heading,\n    .crds-shared-header button.list-group-item-warning .list-group-item-heading {\n      color: inherit; }\n    .crds-shared-header a.list-group-item-warning:hover, .crds-shared-header a.list-group-item-warning:focus,\n    .crds-shared-header button.list-group-item-warning:hover,\n    .crds-shared-header button.list-group-item-warning:focus {\n      color: white;\n      background-color: #d9b25e; }\n    .crds-shared-header a.list-group-item-warning.active, .crds-shared-header a.list-group-item-warning.active:hover, .crds-shared-header a.list-group-item-warning.active:focus,\n    .crds-shared-header button.list-group-item-warning.active,\n    .crds-shared-header button.list-group-item-warning.active:hover,\n    .crds-shared-header button.list-group-item-warning.active:focus {\n      color: #fff;\n      background-color: white;\n      border-color: white; }\n  .crds-shared-header .list-group-item-danger {\n    color: white;\n    background-color: #d96f62; }\n  .crds-shared-header a.list-group-item-danger,\n  .crds-shared-header button.list-group-item-danger {\n    color: white; }\n    .crds-shared-header a.list-group-item-danger .list-group-item-heading,\n    .crds-shared-header button.list-group-item-danger .list-group-item-heading {\n      color: inherit; }\n    .crds-shared-header a.list-group-item-danger:hover, .crds-shared-header a.list-group-item-danger:focus,\n    .crds-shared-header button.list-group-item-danger:hover,\n    .crds-shared-header button.list-group-item-danger:focus {\n      color: white;\n      background-color: #d45c4d; }\n    .crds-shared-header a.list-group-item-danger.active, .crds-shared-header a.list-group-item-danger.active:hover, .crds-shared-header a.list-group-item-danger.active:focus,\n    .crds-shared-header button.list-group-item-danger.active,\n    .crds-shared-header button.list-group-item-danger.active:hover,\n    .crds-shared-header button.list-group-item-danger.active:focus {\n      color: #fff;\n      background-color: white;\n      border-color: white; }\n  .crds-shared-header .list-group-item-heading {\n    margin-top: 0;\n    margin-bottom: 5px; }\n  .crds-shared-header .list-group-item-text {\n    margin-bottom: 0;\n    line-height: 1.3; }\n  .crds-shared-header .panel {\n    margin-bottom: 24px;\n    background-color: #fff;\n    border: 1px solid transparent;\n    border-radius: 4px;\n    -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); }\n  .crds-shared-header .panel-body {\n    padding: 15px; }\n    .crds-shared-header .panel-body:before, .crds-shared-header .panel-body:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .panel-body:after {\n      clear: both; }\n  .crds-shared-header .panel-heading {\n    padding: 10px 15px;\n    border-bottom: 1px solid transparent;\n    border-top-right-radius: 3px;\n    border-top-left-radius: 3px; }\n    .crds-shared-header .panel-heading > .dropdown .dropdown-toggle {\n      color: inherit; }\n  .crds-shared-header .panel-title {\n    margin-top: 0;\n    margin-bottom: 0;\n    font-size: 18px;\n    color: inherit; }\n    .crds-shared-header .panel-title > a,\n    .crds-shared-header .panel-title > small,\n    .crds-shared-header .panel-title > .small,\n    .crds-shared-header .panel-title > small > a,\n    .crds-shared-header .panel-title > .small > a {\n      color: inherit; }\n  .crds-shared-header .panel-footer {\n    padding: 10px 15px;\n    background-color: #f5f5f5;\n    border-top: 1px solid #ddd;\n    border-bottom-right-radius: 3px;\n    border-bottom-left-radius: 3px; }\n  .crds-shared-header .panel > .list-group,\n  .crds-shared-header .panel > .panel-collapse > .list-group {\n    margin-bottom: 0; }\n    .crds-shared-header .panel > .list-group .list-group-item,\n    .crds-shared-header .panel > .panel-collapse > .list-group .list-group-item {\n      border-width: 1px 0;\n      border-radius: 0; }\n    .crds-shared-header .panel > .list-group:first-child .list-group-item:first-child,\n    .crds-shared-header .panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\n      border-top: 0;\n      border-top-right-radius: 3px;\n      border-top-left-radius: 3px; }\n    .crds-shared-header .panel > .list-group:last-child .list-group-item:last-child,\n    .crds-shared-header .panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\n      border-bottom: 0;\n      border-bottom-right-radius: 3px;\n      border-bottom-left-radius: 3px; }\n  .crds-shared-header .panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {\n    border-top-right-radius: 0;\n    border-top-left-radius: 0; }\n  .crds-shared-header .panel-heading + .list-group .list-group-item:first-child {\n    border-top-width: 0; }\n  .crds-shared-header .list-group + .panel-footer {\n    border-top-width: 0; }\n  .crds-shared-header .panel > .table,\n  .crds-shared-header .panel > .table-responsive > .table,\n  .crds-shared-header .panel > .panel-collapse > .table {\n    margin-bottom: 0; }\n    .crds-shared-header .panel > .table caption,\n    .crds-shared-header .panel > .table-responsive > .table caption,\n    .crds-shared-header .panel > .panel-collapse > .table caption {\n      padding-left: 15px;\n      padding-right: 15px; }\n  .crds-shared-header .panel > .table:first-child,\n  .crds-shared-header .panel > .table-responsive:first-child > .table:first-child {\n    border-top-right-radius: 3px;\n    border-top-left-radius: 3px; }\n    .crds-shared-header .panel > .table:first-child > thead:first-child > tr:first-child,\n    .crds-shared-header .panel > .table:first-child > tbody:first-child > tr:first-child,\n    .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\n    .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\n      border-top-left-radius: 3px;\n      border-top-right-radius: 3px; }\n      .crds-shared-header .panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\n      .crds-shared-header .panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\n      .crds-shared-header .panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n      .crds-shared-header .panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\n      .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\n      .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\n      .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n      .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\n        border-top-left-radius: 3px; }\n      .crds-shared-header .panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\n      .crds-shared-header .panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\n      .crds-shared-header .panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n      .crds-shared-header .panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\n      .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\n      .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\n      .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n      .crds-shared-header .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\n        border-top-right-radius: 3px; }\n  .crds-shared-header .panel > .table:last-child,\n  .crds-shared-header .panel > .table-responsive:last-child > .table:last-child {\n    border-bottom-right-radius: 3px;\n    border-bottom-left-radius: 3px; }\n    .crds-shared-header .panel > .table:last-child > tbody:last-child > tr:last-child,\n    .crds-shared-header .panel > .table:last-child > tfoot:last-child > tr:last-child,\n    .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\n    .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\n      border-bottom-left-radius: 3px;\n      border-bottom-right-radius: 3px; }\n      .crds-shared-header .panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n      .crds-shared-header .panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n      .crds-shared-header .panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n      .crds-shared-header .panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\n      .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n      .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n      .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n      .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\n        border-bottom-left-radius: 3px; }\n      .crds-shared-header .panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n      .crds-shared-header .panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n      .crds-shared-header .panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n      .crds-shared-header .panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\n      .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n      .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n      .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n      .crds-shared-header .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\n        border-bottom-right-radius: 3px; }\n  .crds-shared-header .panel > .panel-body + .table,\n  .crds-shared-header .panel > .panel-body + .table-responsive,\n  .crds-shared-header .panel > .table + .panel-body,\n  .crds-shared-header .panel > .table-responsive + .panel-body {\n    border-top: 1px solid #cacaca; }\n  .crds-shared-header .panel > .table > tbody:first-child > tr:first-child th,\n  .crds-shared-header .panel > .table > tbody:first-child > tr:first-child td {\n    border-top: 0; }\n  .crds-shared-header .panel > .table-bordered,\n  .crds-shared-header .panel > .table-responsive > .table-bordered {\n    border: 0; }\n    .crds-shared-header .panel > .table-bordered > thead > tr > th:first-child,\n    .crds-shared-header .panel > .table-bordered > thead > tr > td:first-child,\n    .crds-shared-header .panel > .table-bordered > tbody > tr > th:first-child,\n    .crds-shared-header .panel > .table-bordered > tbody > tr > td:first-child,\n    .crds-shared-header .panel > .table-bordered > tfoot > tr > th:first-child,\n    .crds-shared-header .panel > .table-bordered > tfoot > tr > td:first-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n      border-left: 0; }\n    .crds-shared-header .panel > .table-bordered > thead > tr > th:last-child,\n    .crds-shared-header .panel > .table-bordered > thead > tr > td:last-child,\n    .crds-shared-header .panel > .table-bordered > tbody > tr > th:last-child,\n    .crds-shared-header .panel > .table-bordered > tbody > tr > td:last-child,\n    .crds-shared-header .panel > .table-bordered > tfoot > tr > th:last-child,\n    .crds-shared-header .panel > .table-bordered > tfoot > tr > td:last-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n      border-right: 0; }\n    .crds-shared-header .panel > .table-bordered > thead > tr:first-child > td,\n    .crds-shared-header .panel > .table-bordered > thead > tr:first-child > th,\n    .crds-shared-header .panel > .table-bordered > tbody > tr:first-child > td,\n    .crds-shared-header .panel > .table-bordered > tbody > tr:first-child > th,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\n      border-bottom: 0; }\n    .crds-shared-header .panel > .table-bordered > tbody > tr:last-child > td,\n    .crds-shared-header .panel > .table-bordered > tbody > tr:last-child > th,\n    .crds-shared-header .panel > .table-bordered > tfoot > tr:last-child > td,\n    .crds-shared-header .panel > .table-bordered > tfoot > tr:last-child > th,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\n    .crds-shared-header .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\n      border-bottom: 0; }\n  .crds-shared-header .panel > .table-responsive {\n    border: 0;\n    margin-bottom: 0; }\n  .crds-shared-header .panel-group {\n    margin-bottom: 24px; }\n    .crds-shared-header .panel-group .panel {\n      margin-bottom: 0;\n      border-radius: 4px; }\n      .crds-shared-header .panel-group .panel + .panel {\n        margin-top: 5px; }\n    .crds-shared-header .panel-group .panel-heading {\n      border-bottom: 0; }\n      .crds-shared-header .panel-group .panel-heading + .panel-collapse > .panel-body,\n      .crds-shared-header .panel-group .panel-heading + .panel-collapse > .list-group {\n        border-top: 1px solid #ddd; }\n    .crds-shared-header .panel-group .panel-footer {\n      border-top: 0; }\n      .crds-shared-header .panel-group .panel-footer + .panel-collapse .panel-body {\n        border-bottom: 1px solid #ddd; }\n  .crds-shared-header .panel-default {\n    border-color: #ddd; }\n    .crds-shared-header .panel-default > .panel-heading {\n      color: #4d4d4d;\n      background-color: #f5f5f5;\n      border-color: #ddd; }\n      .crds-shared-header .panel-default > .panel-heading + .panel-collapse > .panel-body {\n        border-top-color: #ddd; }\n      .crds-shared-header .panel-default > .panel-heading .badge {\n        color: #f5f5f5;\n        background-color: #4d4d4d; }\n    .crds-shared-header .panel-default > .panel-footer + .panel-collapse > .panel-body {\n      border-bottom-color: #ddd; }\n  .crds-shared-header .panel-primary {\n    border-color: #3b6e8f; }\n    .crds-shared-header .panel-primary > .panel-heading {\n      color: #fff;\n      background-color: #3b6e8f;\n      border-color: #3b6e8f; }\n      .crds-shared-header .panel-primary > .panel-heading + .panel-collapse > .panel-body {\n        border-top-color: #3b6e8f; }\n      .crds-shared-header .panel-primary > .panel-heading .badge {\n        color: #3b6e8f;\n        background-color: #fff; }\n    .crds-shared-header .panel-primary > .panel-footer + .panel-collapse > .panel-body {\n      border-bottom-color: #3b6e8f; }\n  .crds-shared-header .panel-success {\n    border-color: #6acc93; }\n    .crds-shared-header .panel-success > .panel-heading {\n      color: white;\n      background-color: #6acc93;\n      border-color: #6acc93; }\n      .crds-shared-header .panel-success > .panel-heading + .panel-collapse > .panel-body {\n        border-top-color: #6acc93; }\n      .crds-shared-header .panel-success > .panel-heading .badge {\n        color: #6acc93;\n        background-color: white; }\n    .crds-shared-header .panel-success > .panel-footer + .panel-collapse > .panel-body {\n      border-bottom-color: #6acc93; }\n  .crds-shared-header .panel-info {\n    border-color: #6abccc; }\n    .crds-shared-header .panel-info > .panel-heading {\n      color: white;\n      background-color: #6abccc;\n      border-color: #6abccc; }\n      .crds-shared-header .panel-info > .panel-heading + .panel-collapse > .panel-body {\n        border-top-color: #6abccc; }\n      .crds-shared-header .panel-info > .panel-heading .badge {\n        color: #6abccc;\n        background-color: white; }\n    .crds-shared-header .panel-info > .panel-footer + .panel-collapse > .panel-body {\n      border-bottom-color: #6abccc; }\n  .crds-shared-header .panel-warning {\n    border-color: #debc73; }\n    .crds-shared-header .panel-warning > .panel-heading {\n      color: white;\n      background-color: #debc73;\n      border-color: #debc73; }\n      .crds-shared-header .panel-warning > .panel-heading + .panel-collapse > .panel-body {\n        border-top-color: #debc73; }\n      .crds-shared-header .panel-warning > .panel-heading .badge {\n        color: #debc73;\n        background-color: white; }\n    .crds-shared-header .panel-warning > .panel-footer + .panel-collapse > .panel-body {\n      border-bottom-color: #debc73; }\n  .crds-shared-header .panel-danger {\n    border-color: #d96f62; }\n    .crds-shared-header .panel-danger > .panel-heading {\n      color: white;\n      background-color: #d96f62;\n      border-color: #d96f62; }\n      .crds-shared-header .panel-danger > .panel-heading + .panel-collapse > .panel-body {\n        border-top-color: #d96f62; }\n      .crds-shared-header .panel-danger > .panel-heading .badge {\n        color: #d96f62;\n        background-color: white; }\n    .crds-shared-header .panel-danger > .panel-footer + .panel-collapse > .panel-body {\n      border-bottom-color: #d96f62; }\n  .crds-shared-header .embed-responsive {\n    position: relative;\n    display: block;\n    height: 0;\n    padding: 0;\n    overflow: hidden; }\n    .crds-shared-header .embed-responsive .embed-responsive-item,\n    .crds-shared-header .embed-responsive iframe,\n    .crds-shared-header .embed-responsive embed,\n    .crds-shared-header .embed-responsive object,\n    .crds-shared-header .embed-responsive video {\n      position: absolute;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      height: 100%;\n      width: 100%;\n      border: 0; }\n  .crds-shared-header .embed-responsive-16by9 {\n    padding-bottom: 56.25%; }\n  .crds-shared-header .embed-responsive-4by3 {\n    padding-bottom: 75%; }\n  .crds-shared-header .well {\n    min-height: 20px;\n    padding: 19px;\n    margin-bottom: 20px;\n    background-color: white;\n    border: 1px solid #e7e7e7;\n    border-radius: 4px;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05); }\n    .crds-shared-header .well blockquote {\n      border-color: #ddd;\n      border-color: rgba(0, 0, 0, 0.15); }\n  .crds-shared-header .well-lg {\n    padding: 24px;\n    border-radius: 4px; }\n  .crds-shared-header .well-sm {\n    padding: 9px;\n    border-radius: 4px; }\n  .crds-shared-header .close {\n    float: right;\n    font-size: 24px;\n    font-weight: bold;\n    line-height: 1;\n    color: black;\n    text-shadow: 0 1px 0 white;\n    opacity: 0.2;\n    filter: alpha(opacity=20); }\n    .crds-shared-header .close:hover, .crds-shared-header .close:focus {\n      color: black;\n      text-decoration: none;\n      cursor: pointer;\n      opacity: 0.5;\n      filter: alpha(opacity=50); }\n  .crds-shared-header button.close {\n    padding: 0;\n    cursor: pointer;\n    background: transparent;\n    border: 0;\n    -webkit-appearance: none; }\n  .crds-shared-header .modal-open {\n    overflow: hidden; }\n  .crds-shared-header .modal {\n    display: none;\n    overflow: hidden;\n    position: fixed;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    z-index: 1050;\n    -webkit-overflow-scrolling: touch;\n    outline: 0; }\n    .crds-shared-header .modal.fade .modal-dialog {\n      -webkit-transform: translate(0, -25%);\n      -ms-transform: translate(0, -25%);\n      -o-transform: translate(0, -25%);\n      transform: translate(0, -25%);\n      -webkit-transition: -webkit-transform 0.3s ease-out;\n      -moz-transition: -moz-transform 0.3s ease-out;\n      -o-transition: -o-transform 0.3s ease-out;\n      transition: transform 0.3s ease-out; }\n    .crds-shared-header .modal.in .modal-dialog {\n      -webkit-transform: translate(0, 0);\n      -ms-transform: translate(0, 0);\n      -o-transform: translate(0, 0);\n      transform: translate(0, 0); }\n  .crds-shared-header .modal-open .modal {\n    overflow-x: hidden;\n    overflow-y: auto; }\n  .crds-shared-header .modal-dialog {\n    position: relative;\n    width: auto;\n    margin: 10px; }\n  .crds-shared-header .modal-content {\n    position: relative;\n    background-color: #fff;\n    border: 1px solid #999;\n    border: 1px solid rgba(0, 0, 0, 0.2);\n    border-radius: 4px;\n    -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n    background-clip: padding-box;\n    outline: 0; }\n  .crds-shared-header .modal-backdrop {\n    position: fixed;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    z-index: 1040;\n    background-color: #000; }\n    .crds-shared-header .modal-backdrop.fade {\n      opacity: 0;\n      filter: alpha(opacity=0); }\n    .crds-shared-header .modal-backdrop.in {\n      opacity: 0.5;\n      filter: alpha(opacity=50); }\n  .crds-shared-header .modal-header {\n    padding: 15px;\n    border-bottom: 1px solid #e5e5e5; }\n    .crds-shared-header .modal-header:before, .crds-shared-header .modal-header:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .modal-header:after {\n      clear: both; }\n  .crds-shared-header .modal-header .close {\n    margin-top: -2px; }\n  .crds-shared-header .modal-title {\n    margin: 0;\n    line-height: 1.5; }\n  .crds-shared-header .modal-body {\n    position: relative;\n    padding: 15px; }\n  .crds-shared-header .modal-footer {\n    padding: 15px;\n    text-align: right;\n    border-top: 1px solid #e5e5e5; }\n    .crds-shared-header .modal-footer:before, .crds-shared-header .modal-footer:after {\n      content: \" \";\n      display: table; }\n    .crds-shared-header .modal-footer:after {\n      clear: both; }\n    .crds-shared-header .modal-footer .btn + .btn {\n      margin-left: 5px;\n      margin-bottom: 0; }\n    .crds-shared-header .modal-footer .btn-group .btn + .btn {\n      margin-left: -1px; }\n    .crds-shared-header .modal-footer .btn-block + .btn-block {\n      margin-left: 0; }\n  .crds-shared-header .modal-scrollbar-measure {\n    position: absolute;\n    top: -9999px;\n    width: 50px;\n    height: 50px;\n    overflow: scroll; }\n  @media (min-width: 768px) {\n    .crds-shared-header .modal-dialog {\n      width: 600px;\n      margin: 30px auto; }\n    .crds-shared-header .modal-content {\n      -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); }\n    .crds-shared-header .modal-sm {\n      width: 300px; } }\n  @media (min-width: 992px) {\n    .crds-shared-header .modal-lg {\n      width: 900px; } }\n  .crds-shared-header .tooltip {\n    position: absolute;\n    z-index: 1070;\n    display: block;\n    font-family: \"acumin-pro\", helvetica, arial, sans-serif;\n    font-style: normal;\n    font-weight: normal;\n    letter-spacing: normal;\n    line-break: auto;\n    line-height: 1.5;\n    text-align: left;\n    text-align: start;\n    text-decoration: none;\n    text-shadow: none;\n    text-transform: none;\n    white-space: normal;\n    word-break: normal;\n    word-spacing: normal;\n    word-wrap: normal;\n    font-size: 14px;\n    opacity: 0;\n    filter: alpha(opacity=0); }\n    .crds-shared-header .tooltip.in {\n      opacity: 0.9;\n      filter: alpha(opacity=90); }\n    .crds-shared-header .tooltip.top {\n      margin-top: -3px;\n      padding: 5px 0; }\n    .crds-shared-header .tooltip.right {\n      margin-left: 3px;\n      padding: 0 5px; }\n    .crds-shared-header .tooltip.bottom {\n      margin-top: 3px;\n      padding: 5px 0; }\n    .crds-shared-header .tooltip.left {\n      margin-left: -3px;\n      padding: 0 5px; }\n  .crds-shared-header .tooltip-inner {\n    max-width: 200px;\n    padding: 3px 8px;\n    color: #fff;\n    text-align: center;\n    background-color: #000;\n    border-radius: 4px; }\n  .crds-shared-header .tooltip-arrow {\n    position: absolute;\n    width: 0;\n    height: 0;\n    border-color: transparent;\n    border-style: solid; }\n  .crds-shared-header .tooltip.top .tooltip-arrow {\n    bottom: 0;\n    left: 50%;\n    margin-left: -5px;\n    border-width: 5px 5px 0;\n    border-top-color: #000; }\n  .crds-shared-header .tooltip.top-left .tooltip-arrow {\n    bottom: 0;\n    right: 5px;\n    margin-bottom: -5px;\n    border-width: 5px 5px 0;\n    border-top-color: #000; }\n  .crds-shared-header .tooltip.top-right .tooltip-arrow {\n    bottom: 0;\n    left: 5px;\n    margin-bottom: -5px;\n    border-width: 5px 5px 0;\n    border-top-color: #000; }\n  .crds-shared-header .tooltip.right .tooltip-arrow {\n    top: 50%;\n    left: 0;\n    margin-top: -5px;\n    border-width: 5px 5px 5px 0;\n    border-right-color: #000; }\n  .crds-shared-header .tooltip.left .tooltip-arrow {\n    top: 50%;\n    right: 0;\n    margin-top: -5px;\n    border-width: 5px 0 5px 5px;\n    border-left-color: #000; }\n  .crds-shared-header .tooltip.bottom .tooltip-arrow {\n    top: 0;\n    left: 50%;\n    margin-left: -5px;\n    border-width: 0 5px 5px;\n    border-bottom-color: #000; }\n  .crds-shared-header .tooltip.bottom-left .tooltip-arrow {\n    top: 0;\n    right: 5px;\n    margin-top: -5px;\n    border-width: 0 5px 5px;\n    border-bottom-color: #000; }\n  .crds-shared-header .tooltip.bottom-right .tooltip-arrow {\n    top: 0;\n    left: 5px;\n    margin-top: -5px;\n    border-width: 0 5px 5px;\n    border-bottom-color: #000; }\n  .crds-shared-header .popover {\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 1060;\n    display: none;\n    max-width: 276px;\n    padding: 1px;\n    font-family: \"acumin-pro\", helvetica, arial, sans-serif;\n    font-style: normal;\n    font-weight: normal;\n    letter-spacing: normal;\n    line-break: auto;\n    line-height: 1.5;\n    text-align: left;\n    text-align: start;\n    text-decoration: none;\n    text-shadow: none;\n    text-transform: none;\n    white-space: normal;\n    word-break: normal;\n    word-spacing: normal;\n    word-wrap: normal;\n    font-size: 16px;\n    background-color: #fff;\n    background-clip: padding-box;\n    border: 1px solid #ccc;\n    border: 1px solid rgba(0, 0, 0, 0.2);\n    border-radius: 4px;\n    -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);\n    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); }\n    .crds-shared-header .popover.top {\n      margin-top: -10px; }\n    .crds-shared-header .popover.right {\n      margin-left: 10px; }\n    .crds-shared-header .popover.bottom {\n      margin-top: 10px; }\n    .crds-shared-header .popover.left {\n      margin-left: -10px; }\n  .crds-shared-header .popover-title {\n    margin: 0;\n    padding: 8px 14px;\n    font-size: 16px;\n    background-color: #f7f7f7;\n    border-bottom: 1px solid #ebebeb;\n    border-radius: 3px 3px 0 0; }\n  .crds-shared-header .popover-content {\n    padding: 9px 14px; }\n  .crds-shared-header .popover > .arrow, .crds-shared-header .popover > .arrow:after {\n    position: absolute;\n    display: block;\n    width: 0;\n    height: 0;\n    border-color: transparent;\n    border-style: solid; }\n  .crds-shared-header .popover > .arrow {\n    border-width: 11px; }\n  .crds-shared-header .popover > .arrow:after {\n    border-width: 10px;\n    content: \"\"; }\n  .crds-shared-header .popover.top > .arrow {\n    left: 50%;\n    margin-left: -11px;\n    border-bottom-width: 0;\n    border-top-color: #999999;\n    border-top-color: rgba(0, 0, 0, 0.25);\n    bottom: -11px; }\n    .crds-shared-header .popover.top > .arrow:after {\n      content: \" \";\n      bottom: 1px;\n      margin-left: -10px;\n      border-bottom-width: 0;\n      border-top-color: #fff; }\n  .crds-shared-header .popover.right > .arrow {\n    top: 50%;\n    left: -11px;\n    margin-top: -11px;\n    border-left-width: 0;\n    border-right-color: #999999;\n    border-right-color: rgba(0, 0, 0, 0.25); }\n    .crds-shared-header .popover.right > .arrow:after {\n      content: \" \";\n      left: 1px;\n      bottom: -10px;\n      border-left-width: 0;\n      border-right-color: #fff; }\n  .crds-shared-header .popover.bottom > .arrow {\n    left: 50%;\n    margin-left: -11px;\n    border-top-width: 0;\n    border-bottom-color: #999999;\n    border-bottom-color: rgba(0, 0, 0, 0.25);\n    top: -11px; }\n    .crds-shared-header .popover.bottom > .arrow:after {\n      content: \" \";\n      top: 1px;\n      margin-left: -10px;\n      border-top-width: 0;\n      border-bottom-color: #fff; }\n  .crds-shared-header .popover.left > .arrow {\n    top: 50%;\n    right: -11px;\n    margin-top: -11px;\n    border-right-width: 0;\n    border-left-color: #999999;\n    border-left-color: rgba(0, 0, 0, 0.25); }\n    .crds-shared-header .popover.left > .arrow:after {\n      content: \" \";\n      right: 1px;\n      border-right-width: 0;\n      border-left-color: #fff;\n      bottom: -10px; }\n  .crds-shared-header .carousel {\n    position: relative; }\n  .crds-shared-header .carousel-inner {\n    position: relative;\n    overflow: hidden;\n    width: 100%; }\n    .crds-shared-header .carousel-inner > .item {\n      display: none;\n      position: relative;\n      -webkit-transition: 0.6s ease-in-out left;\n      -o-transition: 0.6s ease-in-out left;\n      transition: 0.6s ease-in-out left; }\n      .crds-shared-header .carousel-inner > .item > img,\n      .crds-shared-header .carousel-inner > .item > a > img {\n        display: block;\n        max-width: 100%;\n        height: auto;\n        line-height: 1; }\n      @media all and (transform-3d), (-webkit-transform-3d) {\n        .crds-shared-header .carousel-inner > .item {\n          -webkit-transition: -webkit-transform 0.6s ease-in-out;\n          -moz-transition: -moz-transform 0.6s ease-in-out;\n          -o-transition: -o-transform 0.6s ease-in-out;\n          transition: transform 0.6s ease-in-out;\n          -webkit-backface-visibility: hidden;\n          -moz-backface-visibility: hidden;\n          backface-visibility: hidden;\n          -webkit-perspective: 1000px;\n          -moz-perspective: 1000px;\n          perspective: 1000px; }\n          .crds-shared-header .carousel-inner > .item.next, .crds-shared-header .carousel-inner > .item.active.right {\n            -webkit-transform: translate3d(100%, 0, 0);\n            transform: translate3d(100%, 0, 0);\n            left: 0; }\n          .crds-shared-header .carousel-inner > .item.prev, .crds-shared-header .carousel-inner > .item.active.left {\n            -webkit-transform: translate3d(-100%, 0, 0);\n            transform: translate3d(-100%, 0, 0);\n            left: 0; }\n          .crds-shared-header .carousel-inner > .item.next.left, .crds-shared-header .carousel-inner > .item.prev.right, .crds-shared-header .carousel-inner > .item.active {\n            -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n            left: 0; } }\n    .crds-shared-header .carousel-inner > .active,\n    .crds-shared-header .carousel-inner > .next,\n    .crds-shared-header .carousel-inner > .prev {\n      display: block; }\n    .crds-shared-header .carousel-inner > .active {\n      left: 0; }\n    .crds-shared-header .carousel-inner > .next,\n    .crds-shared-header .carousel-inner > .prev {\n      position: absolute;\n      top: 0;\n      width: 100%; }\n    .crds-shared-header .carousel-inner > .next {\n      left: 100%; }\n    .crds-shared-header .carousel-inner > .prev {\n      left: -100%; }\n    .crds-shared-header .carousel-inner > .next.left,\n    .crds-shared-header .carousel-inner > .prev.right {\n      left: 0; }\n    .crds-shared-header .carousel-inner > .active.left {\n      left: -100%; }\n    .crds-shared-header .carousel-inner > .active.right {\n      left: 100%; }\n  .crds-shared-header .carousel-control {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    width: 15%;\n    opacity: 0.5;\n    filter: alpha(opacity=50);\n    font-size: 20px;\n    color: #fff;\n    text-align: center;\n    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);\n    background-color: transparent; }\n    .crds-shared-header .carousel-control.left {\n      background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n      background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n      background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n      background-repeat: repeat-x;\n      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1); }\n    .crds-shared-header .carousel-control.right {\n      left: auto;\n      right: 0;\n      background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n      background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n      background-image: linear-gradient(to right, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n      background-repeat: repeat-x;\n      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1); }\n    .crds-shared-header .carousel-control:hover, .crds-shared-header .carousel-control:focus {\n      outline: 0;\n      color: #fff;\n      text-decoration: none;\n      opacity: 0.9;\n      filter: alpha(opacity=90); }\n    .crds-shared-header .carousel-control .icon-prev,\n    .crds-shared-header .carousel-control .icon-next,\n    .crds-shared-header .carousel-control .glyphicon-chevron-left,\n    .crds-shared-header .carousel-control .glyphicon-chevron-right {\n      position: absolute;\n      top: 50%;\n      margin-top: -10px;\n      z-index: 5;\n      display: inline-block; }\n    .crds-shared-header .carousel-control .icon-prev,\n    .crds-shared-header .carousel-control .glyphicon-chevron-left {\n      left: 50%;\n      margin-left: -10px; }\n    .crds-shared-header .carousel-control .icon-next,\n    .crds-shared-header .carousel-control .glyphicon-chevron-right {\n      right: 50%;\n      margin-right: -10px; }\n    .crds-shared-header .carousel-control .icon-prev,\n    .crds-shared-header .carousel-control .icon-next {\n      width: 20px;\n      height: 20px;\n      line-height: 1;\n      font-family: serif; }\n    .crds-shared-header .carousel-control .icon-prev:before {\n      content: '\\2039'; }\n    .crds-shared-header .carousel-control .icon-next:before {\n      content: '\\203a'; }\n  .crds-shared-header .carousel-indicators {\n    position: absolute;\n    bottom: 10px;\n    left: 50%;\n    z-index: 15;\n    width: 60%;\n    margin-left: -30%;\n    padding-left: 0;\n    list-style: none;\n    text-align: center; }\n    .crds-shared-header .carousel-indicators li {\n      display: inline-block;\n      width: 10px;\n      height: 10px;\n      margin: 1px;\n      text-indent: -999px;\n      border: 1px solid #fff;\n      border-radius: 10px;\n      cursor: pointer;\n      background-color: #000 \\9;\n      background-color: transparent; }\n    .crds-shared-header .carousel-indicators .active {\n      margin: 0;\n      width: 12px;\n      height: 12px;\n      background-color: #fff; }\n  .crds-shared-header .carousel-caption {\n    position: absolute;\n    left: 15%;\n    right: 15%;\n    bottom: 20px;\n    z-index: 10;\n    padding-top: 20px;\n    padding-bottom: 20px;\n    color: #fff;\n    text-align: center;\n    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6); }\n    .crds-shared-header .carousel-caption .btn {\n      text-shadow: none; }\n  @media screen and (min-width: 768px) {\n    .crds-shared-header .carousel-control .glyphicon-chevron-left,\n    .crds-shared-header .carousel-control .glyphicon-chevron-right,\n    .crds-shared-header .carousel-control .icon-prev,\n    .crds-shared-header .carousel-control .icon-next {\n      width: 30px;\n      height: 30px;\n      margin-top: -10px;\n      font-size: 30px; }\n    .crds-shared-header .carousel-control .glyphicon-chevron-left,\n    .crds-shared-header .carousel-control .icon-prev {\n      margin-left: -10px; }\n    .crds-shared-header .carousel-control .glyphicon-chevron-right,\n    .crds-shared-header .carousel-control .icon-next {\n      margin-right: -10px; }\n    .crds-shared-header .carousel-caption {\n      left: 20%;\n      right: 20%;\n      padding-bottom: 30px; }\n    .crds-shared-header .carousel-indicators {\n      bottom: 20px; } }\n  .crds-shared-header .clearfix:before, .crds-shared-header .clearfix:after {\n    content: \" \";\n    display: table; }\n  .crds-shared-header .clearfix:after {\n    clear: both; }\n  .crds-shared-header .center-block {\n    display: block;\n    margin-left: auto;\n    margin-right: auto; }\n  .crds-shared-header .pull-right {\n    float: right !important; }\n  .crds-shared-header .pull-left {\n    float: left !important; }\n  .crds-shared-header .hide {\n    display: none !important; }\n  .crds-shared-header .show {\n    display: block !important; }\n  .crds-shared-header .invisible {\n    visibility: hidden; }\n  .crds-shared-header .text-hide {\n    font: 0/0 a;\n    color: transparent;\n    text-shadow: none;\n    background-color: transparent;\n    border: 0; }\n  .crds-shared-header .hidden {\n    display: none !important; }\n  .crds-shared-header .affix {\n    position: fixed; }\n\n@-ms-viewport {\n  width: device-width; }\n  .crds-shared-header .visible-xs {\n    display: none !important; }\n  .crds-shared-header .visible-sm {\n    display: none !important; }\n  .crds-shared-header .visible-md {\n    display: none !important; }\n  .crds-shared-header .visible-lg {\n    display: none !important; }\n  .crds-shared-header .visible-xs-block,\n  .crds-shared-header .visible-xs-inline,\n  .crds-shared-header .visible-xs-inline-block,\n  .crds-shared-header .visible-sm-block,\n  .crds-shared-header .visible-sm-inline,\n  .crds-shared-header .visible-sm-inline-block,\n  .crds-shared-header .visible-md-block,\n  .crds-shared-header .visible-md-inline,\n  .crds-shared-header .visible-md-inline-block,\n  .crds-shared-header .visible-lg-block,\n  .crds-shared-header .visible-lg-inline,\n  .crds-shared-header .visible-lg-inline-block {\n    display: none !important; }\n  @media (max-width: 767px) {\n    .crds-shared-header .visible-xs {\n      display: block !important; }\n    .crds-shared-header table.visible-xs {\n      display: table !important; }\n    .crds-shared-header tr.visible-xs {\n      display: table-row !important; }\n    .crds-shared-header th.visible-xs,\n    .crds-shared-header td.visible-xs {\n      display: table-cell !important; } }\n  @media (max-width: 767px) {\n    .crds-shared-header .visible-xs-block {\n      display: block !important; } }\n  @media (max-width: 767px) {\n    .crds-shared-header .visible-xs-inline {\n      display: inline !important; } }\n  @media (max-width: 767px) {\n    .crds-shared-header .visible-xs-inline-block {\n      display: inline-block !important; } }\n  @media (min-width: 768px) and (max-width: 991px) {\n    .crds-shared-header .visible-sm {\n      display: block !important; }\n    .crds-shared-header table.visible-sm {\n      display: table !important; }\n    .crds-shared-header tr.visible-sm {\n      display: table-row !important; }\n    .crds-shared-header th.visible-sm,\n    .crds-shared-header td.visible-sm {\n      display: table-cell !important; } }\n  @media (min-width: 768px) and (max-width: 991px) {\n    .crds-shared-header .visible-sm-block {\n      display: block !important; } }\n  @media (min-width: 768px) and (max-width: 991px) {\n    .crds-shared-header .visible-sm-inline {\n      display: inline !important; } }\n  @media (min-width: 768px) and (max-width: 991px) {\n    .crds-shared-header .visible-sm-inline-block {\n      display: inline-block !important; } }\n  @media (min-width: 992px) and (max-width: 1199px) {\n    .crds-shared-header .visible-md {\n      display: block !important; }\n    .crds-shared-header table.visible-md {\n      display: table !important; }\n    .crds-shared-header tr.visible-md {\n      display: table-row !important; }\n    .crds-shared-header th.visible-md,\n    .crds-shared-header td.visible-md {\n      display: table-cell !important; } }\n  @media (min-width: 992px) and (max-width: 1199px) {\n    .crds-shared-header .visible-md-block {\n      display: block !important; } }\n  @media (min-width: 992px) and (max-width: 1199px) {\n    .crds-shared-header .visible-md-inline {\n      display: inline !important; } }\n  @media (min-width: 992px) and (max-width: 1199px) {\n    .crds-shared-header .visible-md-inline-block {\n      display: inline-block !important; } }\n  @media (min-width: 1200px) {\n    .crds-shared-header .visible-lg {\n      display: block !important; }\n    .crds-shared-header table.visible-lg {\n      display: table !important; }\n    .crds-shared-header tr.visible-lg {\n      display: table-row !important; }\n    .crds-shared-header th.visible-lg,\n    .crds-shared-header td.visible-lg {\n      display: table-cell !important; } }\n  @media (min-width: 1200px) {\n    .crds-shared-header .visible-lg-block {\n      display: block !important; } }\n  @media (min-width: 1200px) {\n    .crds-shared-header .visible-lg-inline {\n      display: inline !important; } }\n  @media (min-width: 1200px) {\n    .crds-shared-header .visible-lg-inline-block {\n      display: inline-block !important; } }\n  @media (max-width: 767px) {\n    .crds-shared-header .hidden-xs {\n      display: none !important; } }\n  @media (min-width: 768px) and (max-width: 991px) {\n    .crds-shared-header .hidden-sm {\n      display: none !important; } }\n  @media (min-width: 992px) and (max-width: 1199px) {\n    .crds-shared-header .hidden-md {\n      display: none !important; } }\n  @media (min-width: 1200px) {\n    .crds-shared-header .hidden-lg {\n      display: none !important; } }\n  .crds-shared-header .visible-print {\n    display: none !important; }\n  @media print {\n    .crds-shared-header .visible-print {\n      display: block !important; }\n    .crds-shared-header table.visible-print {\n      display: table !important; }\n    .crds-shared-header tr.visible-print {\n      display: table-row !important; }\n    .crds-shared-header th.visible-print,\n    .crds-shared-header td.visible-print {\n      display: table-cell !important; } }\n  .crds-shared-header .visible-print-block {\n    display: none !important; }\n    @media print {\n      .crds-shared-header .visible-print-block {\n        display: block !important; } }\n  .crds-shared-header .visible-print-inline {\n    display: none !important; }\n    @media print {\n      .crds-shared-header .visible-print-inline {\n        display: inline !important; } }\n  .crds-shared-header .visible-print-inline-block {\n    display: none !important; }\n    @media print {\n      .crds-shared-header .visible-print-inline-block {\n        display: inline-block !important; } }\n  @media print {\n    .crds-shared-header .hidden-print {\n      display: none !important; } }\n  html {\n    font-size: 10px;\n    -webkit-tap-highlight-color: transparent;\n    font-family: sans-serif;\n    -ms-text-size-adjust: 100%;\n    -webkit-text-size-adjust: 100%; }\n    html input[type=\"button\"] {\n      -webkit-appearance: button;\n      cursor: pointer; }\n    html input[disabled] {\n      cursor: default; }\n  body {\n    margin: 0;\n    font-family: \"acumin-pro\", helvetica, arial, sans-serif;\n    font-size: 16px;\n    line-height: 1.5;\n    color: #4d4d4d;\n    background-color: white; }\n  .modal-backdrop {\n    position: fixed;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    z-index: 1040;\n    background-color: #000; }\n    .modal-backdrop.fade {\n      opacity: 0;\n      filter: alpha(opacity=0); }\n    .modal-backdrop.in {\n      opacity: 0.5;\n      filter: alpha(opacity=50); }\n  :root {\n    font-size: 16px; }\n  :focus {\n    outline: 0; }\n  html {\n    -ms-text-size-adjust: 100%;\n    -webkit-text-size-adjust: 100%; }\n  body {\n    font-family: \"acumin-pro\", helvetica, arial, sans-serif;\n    font-size: 16px;\n    font-weight: 300; }\n  .noscroll {\n    position: relative;\n    height: 100%;\n    overflow: hidden; }\n  hr {\n    margin-top: 1rem;\n    margin-bottom: 1rem; }\n  a > p {\n    cursor: pointer; }\n  img {\n    max-width: 100%; }\n  .crds-shared-header svg.icon, .crds-shared-header .icon.calendar:not(svg), .crds-shared-header .icon.check-circle:not(svg), .crds-shared-header .icon.chevron-down:not(svg), .crds-shared-header .icon.chevron-left:not(svg), .crds-shared-header .icon.chevron-right:not(svg), .crds-shared-header .icon.chevron-up:not(svg), .crds-shared-header .icon.circle-thin:not(svg), .crds-shared-header .icon.close:not(svg), .crds-shared-header .icon.contrast:not(svg), .crds-shared-header .icon.download:not(svg), .crds-shared-header .icon.facebook:not(svg), .crds-shared-header .icon.github:not(svg), .crds-shared-header .icon.instagram:not(svg), .crds-shared-header .icon.menu:not(svg), .crds-shared-header .icon.question-circle:not(svg), .crds-shared-header .icon.screwhead-crds:not(svg), .crds-shared-header .icon.search:not(svg), .crds-shared-header .icon.twitter:not(svg), .crds-shared-header .icon.usd:not(svg), .crds-shared-header .icon.youtube:not(svg) {\n    width: auto;\n    height: 32px;\n    background-size: 32px; }\n    .crds-shared-header svg.icon-1.icon, .crds-shared-header .icon-1.icon.calendar:not(svg), .crds-shared-header .icon-1.icon.check-circle:not(svg), .crds-shared-header .icon-1.icon.chevron-down:not(svg), .crds-shared-header .icon-1.icon.chevron-left:not(svg), .crds-shared-header .icon-1.icon.chevron-right:not(svg), .crds-shared-header .icon-1.icon.chevron-up:not(svg), .crds-shared-header .icon-1.icon.circle-thin:not(svg), .crds-shared-header .icon-1.icon.close:not(svg), .crds-shared-header .icon-1.icon.contrast:not(svg), .crds-shared-header .icon-1.icon.download:not(svg), .crds-shared-header .icon-1.icon.facebook:not(svg), .crds-shared-header .icon-1.icon.github:not(svg), .crds-shared-header .icon-1.icon.instagram:not(svg), .crds-shared-header .icon-1.icon.menu:not(svg), .crds-shared-header .icon-1.icon.question-circle:not(svg), .crds-shared-header .icon-1.icon.screwhead-crds:not(svg), .crds-shared-header .icon-1.icon.search:not(svg), .crds-shared-header .icon-1.icon.twitter:not(svg), .crds-shared-header .icon-1.icon.usd:not(svg), .crds-shared-header .icon-1.icon.youtube:not(svg) {\n      width: auto;\n      height: 16px;\n      background-size: 16px; }\n    .crds-shared-header svg.icon-2.icon, .crds-shared-header .icon-2.icon.calendar:not(svg), .crds-shared-header .icon-2.icon.check-circle:not(svg), .crds-shared-header .icon-2.icon.chevron-down:not(svg), .crds-shared-header .icon-2.icon.chevron-left:not(svg), .crds-shared-header .icon-2.icon.chevron-right:not(svg), .crds-shared-header .icon-2.icon.chevron-up:not(svg), .crds-shared-header .icon-2.icon.circle-thin:not(svg), .crds-shared-header .icon-2.icon.close:not(svg), .crds-shared-header .icon-2.icon.contrast:not(svg), .crds-shared-header .icon-2.icon.download:not(svg), .crds-shared-header .icon-2.icon.facebook:not(svg), .crds-shared-header .icon-2.icon.github:not(svg), .crds-shared-header .icon-2.icon.instagram:not(svg), .crds-shared-header .icon-2.icon.menu:not(svg), .crds-shared-header .icon-2.icon.question-circle:not(svg), .crds-shared-header .icon-2.icon.screwhead-crds:not(svg), .crds-shared-header .icon-2.icon.search:not(svg), .crds-shared-header .icon-2.icon.twitter:not(svg), .crds-shared-header .icon-2.icon.usd:not(svg), .crds-shared-header .icon-2.icon.youtube:not(svg) {\n      width: auto;\n      height: 32px;\n      background-size: 32px; }\n    .crds-shared-header svg.icon-3.icon, .crds-shared-header .icon-3.icon.calendar:not(svg), .crds-shared-header .icon-3.icon.check-circle:not(svg), .crds-shared-header .icon-3.icon.chevron-down:not(svg), .crds-shared-header .icon-3.icon.chevron-left:not(svg), .crds-shared-header .icon-3.icon.chevron-right:not(svg), .crds-shared-header .icon-3.icon.chevron-up:not(svg), .crds-shared-header .icon-3.icon.circle-thin:not(svg), .crds-shared-header .icon-3.icon.close:not(svg), .crds-shared-header .icon-3.icon.contrast:not(svg), .crds-shared-header .icon-3.icon.download:not(svg), .crds-shared-header .icon-3.icon.facebook:not(svg), .crds-shared-header .icon-3.icon.github:not(svg), .crds-shared-header .icon-3.icon.instagram:not(svg), .crds-shared-header .icon-3.icon.menu:not(svg), .crds-shared-header .icon-3.icon.question-circle:not(svg), .crds-shared-header .icon-3.icon.screwhead-crds:not(svg), .crds-shared-header .icon-3.icon.search:not(svg), .crds-shared-header .icon-3.icon.twitter:not(svg), .crds-shared-header .icon-3.icon.usd:not(svg), .crds-shared-header .icon-3.icon.youtube:not(svg) {\n      width: auto;\n      height: 48px;\n      background-size: 48px; }\n    .crds-shared-header svg.icon-4.icon, .crds-shared-header .icon-4.icon.calendar:not(svg), .crds-shared-header .icon-4.icon.check-circle:not(svg), .crds-shared-header .icon-4.icon.chevron-down:not(svg), .crds-shared-header .icon-4.icon.chevron-left:not(svg), .crds-shared-header .icon-4.icon.chevron-right:not(svg), .crds-shared-header .icon-4.icon.chevron-up:not(svg), .crds-shared-header .icon-4.icon.circle-thin:not(svg), .crds-shared-header .icon-4.icon.close:not(svg), .crds-shared-header .icon-4.icon.contrast:not(svg), .crds-shared-header .icon-4.icon.download:not(svg), .crds-shared-header .icon-4.icon.facebook:not(svg), .crds-shared-header .icon-4.icon.github:not(svg), .crds-shared-header .icon-4.icon.instagram:not(svg), .crds-shared-header .icon-4.icon.menu:not(svg), .crds-shared-header .icon-4.icon.question-circle:not(svg), .crds-shared-header .icon-4.icon.screwhead-crds:not(svg), .crds-shared-header .icon-4.icon.search:not(svg), .crds-shared-header .icon-4.icon.twitter:not(svg), .crds-shared-header .icon-4.icon.usd:not(svg), .crds-shared-header .icon-4.icon.youtube:not(svg) {\n      width: auto;\n      height: 64px;\n      background-size: 64px; }\n    .crds-shared-header svg.icon-5.icon, .crds-shared-header .icon-5.icon.calendar:not(svg), .crds-shared-header .icon-5.icon.check-circle:not(svg), .crds-shared-header .icon-5.icon.chevron-down:not(svg), .crds-shared-header .icon-5.icon.chevron-left:not(svg), .crds-shared-header .icon-5.icon.chevron-right:not(svg), .crds-shared-header .icon-5.icon.chevron-up:not(svg), .crds-shared-header .icon-5.icon.circle-thin:not(svg), .crds-shared-header .icon-5.icon.close:not(svg), .crds-shared-header .icon-5.icon.contrast:not(svg), .crds-shared-header .icon-5.icon.download:not(svg), .crds-shared-header .icon-5.icon.facebook:not(svg), .crds-shared-header .icon-5.icon.github:not(svg), .crds-shared-header .icon-5.icon.instagram:not(svg), .crds-shared-header .icon-5.icon.menu:not(svg), .crds-shared-header .icon-5.icon.question-circle:not(svg), .crds-shared-header .icon-5.icon.screwhead-crds:not(svg), .crds-shared-header .icon-5.icon.search:not(svg), .crds-shared-header .icon-5.icon.twitter:not(svg), .crds-shared-header .icon-5.icon.usd:not(svg), .crds-shared-header .icon-5.icon.youtube:not(svg) {\n      width: auto;\n      height: 80px;\n      background-size: 80px; }\n    .crds-shared-header svg.icon-6.icon, .crds-shared-header .icon-6.icon.calendar:not(svg), .crds-shared-header .icon-6.icon.check-circle:not(svg), .crds-shared-header .icon-6.icon.chevron-down:not(svg), .crds-shared-header .icon-6.icon.chevron-left:not(svg), .crds-shared-header .icon-6.icon.chevron-right:not(svg), .crds-shared-header .icon-6.icon.chevron-up:not(svg), .crds-shared-header .icon-6.icon.circle-thin:not(svg), .crds-shared-header .icon-6.icon.close:not(svg), .crds-shared-header .icon-6.icon.contrast:not(svg), .crds-shared-header .icon-6.icon.download:not(svg), .crds-shared-header .icon-6.icon.facebook:not(svg), .crds-shared-header .icon-6.icon.github:not(svg), .crds-shared-header .icon-6.icon.instagram:not(svg), .crds-shared-header .icon-6.icon.menu:not(svg), .crds-shared-header .icon-6.icon.question-circle:not(svg), .crds-shared-header .icon-6.icon.screwhead-crds:not(svg), .crds-shared-header .icon-6.icon.search:not(svg), .crds-shared-header .icon-6.icon.twitter:not(svg), .crds-shared-header .icon-6.icon.usd:not(svg), .crds-shared-header .icon-6.icon.youtube:not(svg) {\n      width: auto;\n      height: 96px;\n      background-size: 96px; }\n  .crds-shared-header .icon:not(svg) {\n    text-indent: 200%;\n    white-space: nowrap;\n    overflow: hidden;\n    display: inline-block;\n    background-size: 32px 32px; }\n  .crds-shared-header svg.icon use {\n    fill: currentColor; }\n  .crds-shared-header .icon.calendar:not(svg), .crds-shared-header .icon.check-circle:not(svg), .crds-shared-header .icon.chevron-down:not(svg), .crds-shared-header .icon.chevron-left:not(svg), .crds-shared-header .icon.chevron-right:not(svg), .crds-shared-header .icon.chevron-up:not(svg), .crds-shared-header .icon.circle-thin:not(svg), .crds-shared-header .icon.close:not(svg), .crds-shared-header .icon.contrast:not(svg), .crds-shared-header .icon.download:not(svg), .crds-shared-header .icon.facebook:not(svg), .crds-shared-header .icon.github:not(svg), .crds-shared-header .icon.instagram:not(svg), .crds-shared-header .icon.menu:not(svg), .crds-shared-header .icon.question-circle:not(svg), .crds-shared-header .icon.screwhead-crds:not(svg), .crds-shared-header .icon.search:not(svg), .crds-shared-header .icon.twitter:not(svg), .crds-shared-header .icon.usd:not(svg), .crds-shared-header .icon.youtube:not(svg) {\n    background-image: url(\"assets/svgs/icons.css.svg\");\n    background-repeat: no-repeat; }\n    .dark-theme .crds-shared-header .icon.calendar:not(svg), .dark-theme .crds-shared-header .icon.check-circle:not(svg), .dark-theme .crds-shared-header .icon.chevron-down:not(svg), .dark-theme .crds-shared-header .icon.chevron-left:not(svg), .dark-theme .crds-shared-header .icon.chevron-right:not(svg), .dark-theme .crds-shared-header .icon.chevron-up:not(svg), .dark-theme .crds-shared-header .icon.circle-thin:not(svg), .dark-theme .crds-shared-header .icon.close:not(svg), .dark-theme .crds-shared-header .icon.contrast:not(svg), .dark-theme .crds-shared-header .icon.download:not(svg), .dark-theme .crds-shared-header .icon.facebook:not(svg), .dark-theme .crds-shared-header .icon.github:not(svg), .dark-theme .crds-shared-header .icon.instagram:not(svg), .dark-theme .crds-shared-header .icon.menu:not(svg), .dark-theme .crds-shared-header .icon.question-circle:not(svg), .dark-theme .crds-shared-header .icon.screwhead-crds:not(svg), .dark-theme .crds-shared-header .icon.search:not(svg), .dark-theme .crds-shared-header .icon.twitter:not(svg), .dark-theme .crds-shared-header .icon.usd:not(svg), .dark-theme .crds-shared-header .icon.youtube:not(svg) {\n      filter: invert(75%);\n      -webkit-filter: invert(75%); }\n  .crds-shared-header .icon.calendar:not(svg) {\n    background-position: 0 0; }\n  .crds-shared-header .icon.check-circle:not(svg) {\n    background-position: 0 5.2631578947368425%; }\n  .crds-shared-header .icon.chevron-down:not(svg) {\n    background-position: 0 10.526315789473685%; }\n  .crds-shared-header .icon.chevron-left:not(svg) {\n    background-position: 0 15.789473684210526%; }\n  .crds-shared-header .icon.chevron-right:not(svg) {\n    background-position: 0 21.05263157894737%; }\n  .crds-shared-header .icon.chevron-up:not(svg) {\n    background-position: 0 26.31578947368421%; }\n  .crds-shared-header .icon.circle-thin:not(svg) {\n    background-position: 0 31.57894736842105%; }\n  .crds-shared-header .icon.close:not(svg) {\n    background-position: 0 36.8421052631579%; }\n  .crds-shared-header .icon.contrast:not(svg) {\n    background-position: 0 42.10526315789474%; }\n  .crds-shared-header .icon.download:not(svg) {\n    background-position: 0 47.36842105263158%; }\n  .crds-shared-header .icon.facebook:not(svg) {\n    background-position: 0 52.63157894736842%; }\n  .crds-shared-header .icon.github:not(svg) {\n    background-position: 0 57.89473684210526%; }\n  .crds-shared-header .icon.instagram:not(svg) {\n    background-position: 0 63.1578947368421%; }\n  .crds-shared-header .icon.menu:not(svg) {\n    background-position: 0 68.42105263157895%; }\n  .crds-shared-header .icon.question-circle:not(svg) {\n    background-position: 0 73.6842105263158%; }\n  .crds-shared-header .icon.screwhead-crds:not(svg) {\n    background-position: 0 78.94736842105263%; }\n  .crds-shared-header .icon.search:not(svg) {\n    background-position: 0 84.21052631578948%; }\n  .crds-shared-header .icon.twitter:not(svg) {\n    background-position: 0 89.47368421052632%; }\n  .crds-shared-header .icon.usd:not(svg) {\n    background-position: 0 94.73684210526316%; }\n  .crds-shared-header .icon.youtube:not(svg) {\n    background-position: 0 100%; }\n  .crds-shared-header .header {\n    height: 3.375rem; }\n    @media only screen and (min-width: 992px) {\n      .crds-shared-header .header {\n        height: auto;\n        padding-top: .625rem; } }\n    .crds-shared-header .header [data-main-menu] [data-exclude-main] {\n      display: none; }\n    .crds-shared-header .header .logo {\n      padding: .5rem 1rem; }\n      .crds-shared-header .header .logo svg {\n        width: 10.625rem;\n        height: 1.5rem; }\n    .crds-shared-header .header .img-size-12 {\n      height: 192px;\n      width: 192px; }\n    .crds-shared-header .header a > svg {\n      pointer-events: none; }\n    .crds-shared-header .header svg use {\n      fill: currentColor; }\n    .crds-shared-header .header ul.nav-pills > li > a.btn-search {\n      height: 3.125em;\n      vertical-align: middle;\n      display: table-cell; }\n      .crds-shared-header .header ul.nav-pills > li > a.btn-search > svg {\n        margin: 0; }\n    .crds-shared-header .header a.hidden-md {\n      display: inline-block;\n      margin-top: 1.125rem; }\n      .crds-shared-header .header a.hidden-md svg {\n        color: #979797; }\n    .crds-shared-header .header a.hidden-md:hover {\n      cursor: pointer; }\n    .crds-shared-header .header .dropdown-menu {\n      border-radius: 4px;\n      margin-left: .5rem;\n      margin-right: .5rem;\n      padding: 1.25rem 0;\n      right: 0;\n      top: 2.5rem; }\n    .crds-shared-header .header .dropdown-menu ul {\n      list-style: none;\n      padding-left: 0; }\n      .crds-shared-header .header .dropdown-menu ul li a {\n        color: #4d4d4d;\n        display: block;\n        padding: .1875rem 1.25rem; }\n      .crds-shared-header .header .dropdown-menu ul li a:hover {\n        background-color: #f1f1f1;\n        color: #4d4d4d;\n        text-decoration: none; }\n      .crds-shared-header .header .dropdown-menu ul .dropdown-header {\n        color: #4d4d4d;\n        font-weight: 700; }\n    .crds-shared-header .header .featured-row:before {\n      position: absolute;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      left: 0;\n      background: #e7e7e7;\n      content: '';\n      display: block;\n      width: 25%;\n      z-index: -1; }\n    .crds-shared-header .header .profile-menu ul {\n      padding: .3125rem 0; }\n    .crds-shared-header .header .profile-menu .img-size-2_25 {\n      width: 2.25rem;\n      height: 2.25rem;\n      color: #e7e7e7;\n      margin: .25rem; }\n    .crds-shared-header .header .profile-picture {\n      position: relative; }\n      .crds-shared-header .header .profile-picture .img-circle {\n        width: 100%;\n        height: 100%;\n        border-style: solid;\n        border-width: 2px;\n        position: absolute;\n        left: 0;\n        top: 0; }\n    .crds-shared-header .header .profile-picture-default {\n      background-image: url(\"//crossroads-media.imgix.net/images/avatar.svg\");\n      background-position: center;\n      background-size: cover; }\n    .crds-shared-header .header .profile-picture-overlay {\n      background-position: center;\n      background-size: cover;\n      position: absolute;\n      right: 0;\n      top: 0; }\n  .crds-shared-header .navbar-brand.logo {\n    left: 50%;\n    margin-top: .25rem;\n    position: absolute;\n    padding-left: 0;\n    transform: translateX(-50%); }\n    @media only screen and (min-width: 992px) {\n      .crds-shared-header .navbar-brand.logo {\n        left: auto;\n        position: static;\n        transform: none; } }\n    .crds-shared-header .navbar-brand.logo svg {\n      width: 10.625rem;\n      height: 1.5rem;\n      color: #979797; }\n  .crds-shared-header .header .btn.btn-gray {\n    color: black;\n    background-color: #e7e7e7;\n    border-color: #e7e7e7;\n    font-size: 16px;\n    line-height: 21px; }\n    .crds-shared-header .header .btn.btn-gray:focus, .crds-shared-header .header .btn.btn-gray.focus {\n      color: black;\n      background-color: #cecece;\n      border-color: #a7a7a7; }\n    .crds-shared-header .header .btn.btn-gray:hover {\n      color: black;\n      background-color: #cecece;\n      border-color: #c8c8c8; }\n    .crds-shared-header .header .btn.btn-gray:active, .crds-shared-header .header .btn.btn-gray.active,\n    .open > .crds-shared-header .header .btn.btn-gray.dropdown-toggle {\n      color: black;\n      background-color: #cecece;\n      border-color: #c8c8c8; }\n      .crds-shared-header .header .btn.btn-gray:active:hover, .crds-shared-header .header .btn.btn-gray:active:focus, .crds-shared-header .header .btn.btn-gray:active.focus, .crds-shared-header .header .btn.btn-gray.active:hover, .crds-shared-header .header .btn.btn-gray.active:focus, .crds-shared-header .header .btn.btn-gray.active.focus,\n      .open > .crds-shared-header .header .btn.btn-gray.dropdown-toggle:hover,\n      .open > .crds-shared-header .header .btn.btn-gray.dropdown-toggle:focus,\n      .open > .crds-shared-header .header .btn.btn-gray.dropdown-toggle.focus {\n        color: black;\n        background-color: #bcbcbc;\n        border-color: #a7a7a7; }\n    .crds-shared-header .header .btn.btn-gray:active, .crds-shared-header .header .btn.btn-gray.active,\n    .open > .crds-shared-header .header .btn.btn-gray.dropdown-toggle {\n      background-image: none; }\n    .crds-shared-header .header .btn.btn-gray.disabled:hover, .crds-shared-header .header .btn.btn-gray.disabled:focus, .crds-shared-header .header .btn.btn-gray.disabled.focus, .crds-shared-header .header .btn.btn-gray[disabled]:hover, .crds-shared-header .header .btn.btn-gray[disabled]:focus, .crds-shared-header .header .btn.btn-gray[disabled].focus,\n    fieldset[disabled] .crds-shared-header .header .btn.btn-gray:hover,\n    fieldset[disabled] .crds-shared-header .header .btn.btn-gray:focus,\n    fieldset[disabled] .crds-shared-header .header .btn.btn-gray.focus {\n      background-color: #e7e7e7;\n      border-color: #e7e7e7; }\n    .crds-shared-header .header .btn.btn-gray .badge {\n      color: #e7e7e7;\n      background-color: black; }\n    .crds-shared-header .header .btn.btn-gray.active, .crds-shared-header .header .btn.btn-gray:active {\n      background: #dadada; }\n      .crds-shared-header .header .btn.btn-gray.active:focus, .crds-shared-header .header .btn.btn-gray:active:focus {\n        box-shadow: none; }\n    .crds-shared-header .header .btn.btn-gray:focus {\n      border-color: #8bceed;\n      box-shadow: 0 0 0 1px #8bceed inset; }\n    .crds-shared-header .header .btn.btn-gray.disabled {\n      opacity: 1;\n      background: white;\n      border-color: white;\n      color: white; }\n      .crds-shared-header .header .btn.btn-gray.disabled.active, .crds-shared-header .header .btn.btn-gray.disabled.active:focus, .crds-shared-header .header .btn.btn-gray.disabled.active:hover, .crds-shared-header .header .btn.btn-gray.disabled:active, .crds-shared-header .header .btn.btn-gray.disabled:active:focus, .crds-shared-header .header .btn.btn-gray.disabled:active:hover, .crds-shared-header .header .btn.btn-gray.disabled:focus, .crds-shared-header .header .btn.btn-gray.disabled:focus:focus, .crds-shared-header .header .btn.btn-gray.disabled:focus:hover, .crds-shared-header .header .btn.btn-gray.disabled:hover, .crds-shared-header .header .btn.btn-gray.disabled:hover:focus, .crds-shared-header .header .btn.btn-gray.disabled:hover:hover {\n        background: white;\n        border-color: white;\n        box-shadow: none; }\n    .crds-shared-header .header .btn.btn-gray.btn-outline {\n      background: transparent;\n      border-style: solid;\n      border-width: 1px;\n      color: #e7e7e7; }\n      .crds-shared-header .header .btn.btn-gray.btn-outline.active, .crds-shared-header .header .btn.btn-gray.btn-outline.active:hover, .crds-shared-header .header .btn.btn-gray.btn-outline.active:focus, .crds-shared-header .header .btn.btn-gray.btn-outline:active, .crds-shared-header .header .btn.btn-gray.btn-outline:active:hover, .crds-shared-header .header .btn.btn-gray.btn-outline:active:focus {\n        background: rgba(254, 254, 254, 0.75);\n        border-color: #e7e7e7;\n        color: #e7e7e7; }\n        .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline.active, .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline.active:hover, .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline.active:focus, .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline:active, .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline:active:hover, .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline:active:focus {\n          background: rgba(12, 12, 12, 0.75);\n          border-color: rgba(231, 231, 231, 0.75); }\n      .crds-shared-header .header .btn.btn-gray.btn-outline.active:focus, .crds-shared-header .header .btn.btn-gray.btn-outline:active:focus {\n        box-shadow: none; }\n      .crds-shared-header .header .btn.btn-gray.btn-outline:focus {\n        border-color: #8bceed;\n        box-shadow: 0 0 0 1px #8bceed inset; }\n      .crds-shared-header .header .btn.btn-gray.btn-outline:hover {\n        background: rgba(253, 253, 253, 0.75); }\n        .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline:hover {\n          background: rgba(23, 23, 23, 0.75); }\n      .crds-shared-header .header .btn.btn-gray.btn-outline.disabled {\n        background: transparent;\n        border-color: white;\n        color: white; }\n        .crds-shared-header .header .btn.btn-gray.btn-outline.disabled.active, .crds-shared-header .header .btn.btn-gray.btn-outline.disabled.active:hover, .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline.disabled.active, .crds-shared-header .header .btn.btn-gray.btn-outline.disabled:active, .crds-shared-header .header .btn.btn-gray.btn-outline.disabled:active:hover, .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline.disabled:active, .crds-shared-header .header .btn.btn-gray.btn-outline.disabled:focus, .crds-shared-header .header .btn.btn-gray.btn-outline.disabled:focus:hover, .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline.disabled:focus, .crds-shared-header .header .btn.btn-gray.btn-outline.disabled:hover, .crds-shared-header .header .btn.btn-gray.btn-outline.disabled:hover:hover, .dark-theme .crds-shared-header .header .btn.btn-gray.btn-outline.disabled:hover {\n          background: transparent;\n          border-color: white;\n          color: white; }\n    .crds-shared-header .header .btn.btn-gray.btn-link {\n      background: none;\n      border-color: transparent;\n      border-style: solid;\n      border-width: 1px;\n      color: #e7e7e7;\n      text-decoration: none; }\n      .crds-shared-header .header .btn.btn-gray.btn-link.active, .crds-shared-header .header .btn.btn-gray.btn-link:active {\n        background: #e7e7e7;\n        border-color: #e7e7e7;\n        color: white; }\n        .crds-shared-header .header .btn.btn-gray.btn-link.active:hover, .crds-shared-header .header .btn.btn-gray.btn-link:active:hover {\n          color: #f2f2f2; }\n        .crds-shared-header .header .btn.btn-gray.btn-link.active:focus, .crds-shared-header .header .btn.btn-gray.btn-link:active:focus {\n          border: 1px solid #e7e7e7;\n          box-shadow: none; }\n      .crds-shared-header .header .btn.btn-gray.btn-link:hover {\n        color: #cecece; }\n      .crds-shared-header .header .btn.btn-gray.btn-link:focus {\n        border: 1px solid #8bceed;\n        box-shadow: 0 0 0 1px #8bceed inset; }\n  .crds-shared-header .header ul.nav-pills > li > a > svg {\n    margin-top: 7px;\n    margin-bottom: -4px; }\n  .crds-shared-header .header ul.nav-pills > li:not(.open) > a:hover:focus:not(.cta) {\n    background-color: #3b6e8f; }\n  .crds-shared-header .header ul.nav-pills > li:not(.open) > a:focus:not(.cta) {\n    background-color: #f1f1f1; }\n  .crds-shared-header .header li {\n    position: static; }\n    .crds-shared-header .header li.push-half-right {\n      margin-right: 12px; }\n    .crds-shared-header .header li > a {\n      margin: 0; }\n      .crds-shared-header .header li > a:not(.cta) {\n        color: #4d4d4d; }\n    .crds-shared-header .header li > a:hover:not(.cta) {\n      background-color: #3b6e8f;\n      color: white; }\n    .crds-shared-header .header li.open > a, .crds-shared-header .header li.open > a:hover, .crds-shared-header .header li.open > a:focus {\n      background-color: #3b6e8f; }\n    .crds-shared-header .header li.open > a:not(.cta) {\n      color: white; }\n  .crds-shared-header .header .mobile-menu li > a:not(.cta) {\n    color: #979797; }\n  .crds-shared-header .mobile-menu {\n    position: fixed;\n    top: 0; }\n    .crds-shared-header .mobile-menu:not(.in) .modal-dialog {\n      -webkit-transform: translate3d(-25vw, 0, 0);\n      transform: translate3d(-25vw, 0, 0); }\n    .crds-shared-header .mobile-menu .modal-dialog {\n      margin: 0;\n      max-width: 80vw; }\n    .crds-shared-header .mobile-menu .modal-content {\n      background-color: #222222;\n      border: none;\n      border-radius: 0;\n      height: 100vh;\n      overflow-x: hidden;\n      overflow-y: auto; }\n      .crds-shared-header .mobile-menu .modal-content li > a {\n        border-bottom: 1px solid #484848;\n        color: #979797;\n        display: block;\n        padding: 1rem;\n        position: relative;\n        transition: all .3s ease; }\n        .crds-shared-header .mobile-menu .modal-content li > a:hover {\n          background-color: #2f2f2f;\n          color: #e7e7e7; }\n        .crds-shared-header .mobile-menu .modal-content li > a:hover, .crds-shared-header .mobile-menu .modal-content li > a:focus {\n          text-decoration: none; }\n        .crds-shared-header .mobile-menu .modal-content li > a svg {\n          position: absolute;\n          top: 50%;\n          right: 1rem;\n          transform: translateY(-50%);\n          transition: transform .3s ease; }\n      .crds-shared-header .mobile-menu .modal-content li [aria-expanded='true'] {\n        box-shadow: inset -7px 0 9px -7px rgba(115, 115, 115, 0.25); }\n        .crds-shared-header .mobile-menu .modal-content li [aria-expanded='true'] svg {\n          transform: rotate(90deg) translateX(-50%); }\n    .crds-shared-header .mobile-menu ul {\n      list-style: none;\n      margin: 0;\n      padding-left: 0; }\n      .crds-shared-header .mobile-menu ul.collapse, .crds-shared-header .mobile-menu ul.collapsing {\n        background-color: #3b3b3b; }\n        .crds-shared-header .mobile-menu ul.collapse a:hover, .crds-shared-header .mobile-menu ul.collapsing a:hover {\n          background-color: #484848; }\n      .crds-shared-header .mobile-menu ul:not(.collapse) li {\n        text-transform: uppercase; }\n  .crds-shared-header .btn {\n    border-radius: 4px;\n    margin-top: 5px;\n    margin-bottom: 5px; }\n    .crds-shared-header .btn.active, .crds-shared-header .btn.active:focus, .crds-shared-header .btn:active, .crds-shared-header .btn:active:focus, .crds-shared-header .btn:focus, .crds-shared-header .btn:focus:focus {\n      box-shadow: none;\n      outline: none; }\n    .crds-shared-header .btn.btn-lg, .crds-shared-header .btn-group-lg > .btn {\n      font-size: 16px;\n      padding: 15px 30px; }\n    .crds-shared-header .btn, .crds-shared-header .btn.btn-md {\n      font-size: 14px;\n      padding: 10px 20px; }\n    .crds-shared-header .btn.btn-sm, .crds-shared-header .btn-group-sm > .btn {\n      font-size: 12px;\n      padding: 6px 18px; }\n    .crds-shared-header .btn.btn-primary {\n      color: white;\n      background-color: #3b6e8f;\n      border-color: #3b6e8f; }\n      .crds-shared-header .btn.btn-primary:focus, .crds-shared-header .btn.btn-primary.focus {\n        color: white;\n        background-color: #2c526b;\n        border-color: #162935; }\n      .crds-shared-header .btn.btn-primary:hover {\n        color: white;\n        background-color: #2c526b;\n        border-color: #294d64; }\n      .crds-shared-header .btn.btn-primary:active, .crds-shared-header .btn.btn-primary.active,\n      .open > .crds-shared-header .btn.btn-primary.dropdown-toggle {\n        color: white;\n        background-color: #2c526b;\n        border-color: #294d64; }\n        .crds-shared-header .btn.btn-primary:active:hover, .crds-shared-header .btn.btn-primary:active:focus, .crds-shared-header .btn.btn-primary:active.focus, .crds-shared-header .btn.btn-primary.active:hover, .crds-shared-header .btn.btn-primary.active:focus, .crds-shared-header .btn.btn-primary.active.focus,\n        .open > .crds-shared-header .btn.btn-primary.dropdown-toggle:hover,\n        .open > .crds-shared-header .btn.btn-primary.dropdown-toggle:focus,\n        .open > .crds-shared-header .btn.btn-primary.dropdown-toggle.focus {\n          color: white;\n          background-color: #223f52;\n          border-color: #162935; }\n      .crds-shared-header .btn.btn-primary:active, .crds-shared-header .btn.btn-primary.active,\n      .open > .crds-shared-header .btn.btn-primary.dropdown-toggle {\n        background-image: none; }\n      .crds-shared-header .btn.btn-primary.disabled:hover, .crds-shared-header .btn.btn-primary.disabled:focus, .crds-shared-header .btn.btn-primary.disabled.focus, .crds-shared-header .btn.btn-primary[disabled]:hover, .crds-shared-header .btn.btn-primary[disabled]:focus, .crds-shared-header .btn.btn-primary[disabled].focus,\n      fieldset[disabled] .crds-shared-header .btn.btn-primary:hover,\n      fieldset[disabled] .crds-shared-header .btn.btn-primary:focus,\n      fieldset[disabled] .crds-shared-header .btn.btn-primary.focus {\n        background-color: #3b6e8f;\n        border-color: #3b6e8f; }\n      .crds-shared-header .btn.btn-primary .badge {\n        color: #3b6e8f;\n        background-color: white; }\n      .crds-shared-header .btn.btn-primary.active, .crds-shared-header .btn.btn-primary:active {\n        background: #34607d; }\n        .crds-shared-header .btn.btn-primary.active:focus, .crds-shared-header .btn.btn-primary:active:focus {\n          box-shadow: none; }\n      .crds-shared-header .btn.btn-primary:focus {\n        border-color: #8bceed;\n        box-shadow: 0 0 0 1px #8bceed inset; }\n      .crds-shared-header .btn.btn-primary.disabled {\n        opacity: 1;\n        background: #7fadca;\n        border-color: #7fadca;\n        color: white; }\n        .crds-shared-header .btn.btn-primary.disabled.active, .crds-shared-header .btn.btn-primary.disabled.active:focus, .crds-shared-header .btn.btn-primary.disabled.active:hover, .crds-shared-header .btn.btn-primary.disabled:active, .crds-shared-header .btn.btn-primary.disabled:active:focus, .crds-shared-header .btn.btn-primary.disabled:active:hover, .crds-shared-header .btn.btn-primary.disabled:focus, .crds-shared-header .btn.btn-primary.disabled:focus:focus, .crds-shared-header .btn.btn-primary.disabled:focus:hover, .crds-shared-header .btn.btn-primary.disabled:hover, .crds-shared-header .btn.btn-primary.disabled:hover:focus, .crds-shared-header .btn.btn-primary.disabled:hover:hover {\n          background: #7fadca;\n          border-color: #7fadca;\n          box-shadow: none; }\n      .crds-shared-header .btn.btn-primary.btn-outline {\n        background: transparent;\n        border-style: solid;\n        border-width: 1px;\n        color: #3b6e8f; }\n        .crds-shared-header .btn.btn-primary.btn-outline.active, .crds-shared-header .btn.btn-primary.btn-outline.active:hover, .crds-shared-header .btn.btn-primary.btn-outline.active:focus, .crds-shared-header .btn.btn-primary.btn-outline:active, .crds-shared-header .btn.btn-primary.btn-outline:active:hover, .crds-shared-header .btn.btn-primary.btn-outline:active:focus {\n          background: rgba(247, 247, 247, 0.75);\n          border-color: #3b6e8f;\n          color: #3b6e8f; }\n          .dark-theme .crds-shared-header .btn.btn-primary.btn-outline.active, .dark-theme .crds-shared-header .btn.btn-primary.btn-outline.active:hover, .dark-theme .crds-shared-header .btn.btn-primary.btn-outline.active:focus, .dark-theme .crds-shared-header .btn.btn-primary.btn-outline:active, .dark-theme .crds-shared-header .btn.btn-primary.btn-outline:active:hover, .dark-theme .crds-shared-header .btn.btn-primary.btn-outline:active:focus {\n            background: rgba(5, 5, 5, 0.75);\n            border-color: rgba(59, 110, 143, 0.75); }\n        .crds-shared-header .btn.btn-primary.btn-outline.active:focus, .crds-shared-header .btn.btn-primary.btn-outline:active:focus {\n          box-shadow: none; }\n        .crds-shared-header .btn.btn-primary.btn-outline:focus {\n          border-color: #8bceed;\n          box-shadow: 0 0 0 1px #8bceed inset; }\n        .crds-shared-header .btn.btn-primary.btn-outline:hover {\n          background: rgba(240, 240, 240, 0.75); }\n          .dark-theme .crds-shared-header .btn.btn-primary.btn-outline:hover {\n            background: rgba(10, 10, 10, 0.75); }\n        .crds-shared-header .btn.btn-primary.btn-outline.disabled {\n          background: transparent;\n          border-color: #7fadca;\n          color: #7fadca; }\n          .crds-shared-header .btn.btn-primary.btn-outline.disabled.active, .crds-shared-header .btn.btn-primary.btn-outline.disabled.active:hover, .dark-theme .crds-shared-header .btn.btn-primary.btn-outline.disabled.active, .crds-shared-header .btn.btn-primary.btn-outline.disabled:active, .crds-shared-header .btn.btn-primary.btn-outline.disabled:active:hover, .dark-theme .crds-shared-header .btn.btn-primary.btn-outline.disabled:active, .crds-shared-header .btn.btn-primary.btn-outline.disabled:focus, .crds-shared-header .btn.btn-primary.btn-outline.disabled:focus:hover, .dark-theme .crds-shared-header .btn.btn-primary.btn-outline.disabled:focus, .crds-shared-header .btn.btn-primary.btn-outline.disabled:hover, .crds-shared-header .btn.btn-primary.btn-outline.disabled:hover:hover, .dark-theme .crds-shared-header .btn.btn-primary.btn-outline.disabled:hover {\n            background: transparent;\n            border-color: #7fadca;\n            color: #7fadca; }\n      .crds-shared-header .btn.btn-primary.btn-link {\n        background: none;\n        border-color: transparent;\n        border-style: solid;\n        border-width: 1px;\n        color: #3b6e8f;\n        text-decoration: none; }\n        .crds-shared-header .btn.btn-primary.btn-link.active, .crds-shared-header .btn.btn-primary.btn-link:active {\n          background: #3b6e8f;\n          border-color: #3b6e8f;\n          color: white; }\n          .crds-shared-header .btn.btn-primary.btn-link.active:hover, .crds-shared-header .btn.btn-primary.btn-link:active:hover {\n            color: #f2f2f2; }\n          .crds-shared-header .btn.btn-primary.btn-link.active:focus, .crds-shared-header .btn.btn-primary.btn-link:active:focus {\n            border: 1px solid #3b6e8f;\n            box-shadow: none; }\n        .crds-shared-header .btn.btn-primary.btn-link:hover {\n          color: #2c526b; }\n        .crds-shared-header .btn.btn-primary.btn-link:focus {\n          border: 1px solid #8bceed;\n          box-shadow: 0 0 0 1px #8bceed inset; }\n      .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary {\n        color: white;\n        background-color: #0095d9;\n        border-color: #0095d9; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.focus {\n          color: white;\n          background-color: #0072a6;\n          border-color: #003d5a; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:hover {\n          color: white;\n          background-color: #0072a6;\n          border-color: #006b9c; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.active,\n        .open > .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.dropdown-toggle {\n          color: white;\n          background-color: #0072a6;\n          border-color: #006b9c; }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:active:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:active:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:active.focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.active:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.active:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.active.focus,\n          .open > .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.dropdown-toggle:hover,\n          .open > .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.dropdown-toggle:focus,\n          .open > .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.dropdown-toggle.focus {\n            color: white;\n            background-color: #005982;\n            border-color: #003d5a; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.active,\n        .open > .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.dropdown-toggle {\n          background-image: none; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled.focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary[disabled]:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary[disabled]:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary[disabled].focus,\n        fieldset[disabled] .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:hover,\n        fieldset[disabled] .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:focus,\n        fieldset[disabled] .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.focus {\n          background-color: #0095d9;\n          border-color: #0095d9; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary .badge {\n          color: #0095d9;\n          background-color: white; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:active {\n          background: #0083c0; }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.active:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:active:focus {\n            box-shadow: none; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary:focus {\n          border-color: #8bceed;\n          box-shadow: 0 0 0 1px #8bceed inset; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled {\n          opacity: 1;\n          background: #5acbff;\n          border-color: #5acbff;\n          color: white; }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled.active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled.active:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled.active:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:active:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:active:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:focus:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:focus:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:hover:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.disabled:hover:hover {\n            background: #5acbff;\n            border-color: #5acbff;\n            box-shadow: none; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline {\n          background: transparent;\n          border-style: solid;\n          border-width: 1px;\n          color: #0095d9; }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.active:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.active:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:active:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:active:focus {\n            background: rgba(246, 248, 249, 0.75);\n            border-color: #0095d9;\n            color: #0095d9; }\n            .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.active, .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.active:hover, .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.active:focus, .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:active, .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:active:hover, .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:active:focus {\n              background: rgba(4, 6, 7, 0.75);\n              border-color: rgba(0, 149, 217, 0.75); }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.active:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:active:focus {\n            box-shadow: none; }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:focus {\n            border-color: #8bceed;\n            box-shadow: 0 0 0 1px #8bceed inset; }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:hover {\n            background: rgba(238, 241, 243, 0.75); }\n            .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline:hover {\n              background: rgba(8, 12, 14, 0.75); }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled {\n            background: transparent;\n            border-color: #5acbff;\n            color: #5acbff; }\n            .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled.active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled.active:hover, .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled.active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled:active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled:active:hover, .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled:active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled:focus:hover, .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled:hover:hover, .dark-theme .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-outline.disabled:hover {\n              background: transparent;\n              border-color: #5acbff;\n              color: #5acbff; }\n        .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-link {\n          background: none;\n          border-color: transparent;\n          border-style: solid;\n          border-width: 1px;\n          color: #0095d9;\n          text-decoration: none; }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-link.active, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-link:active {\n            background: #0095d9;\n            border-color: #0095d9;\n            color: white; }\n            .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-link.active:hover, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-link:active:hover {\n              color: #f2f2f2; }\n            .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-link.active:focus, .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-link:active:focus {\n              border: 1px solid #0095d9;\n              box-shadow: none; }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-link:hover {\n            color: #0072a6; }\n          .dark-theme .crds-shared-header .btn.btn-primary .btn-secondary.btn-link:focus {\n            border: 1px solid #8bceed;\n            box-shadow: 0 0 0 1px #8bceed inset; }\n    .crds-shared-header .btn.btn-secondary {\n      color: white;\n      background-color: #0095d9;\n      border-color: #0095d9; }\n      .crds-shared-header .btn.btn-secondary:focus, .crds-shared-header .btn.btn-secondary.focus {\n        color: white;\n        background-color: #0072a6;\n        border-color: #003d5a; }\n      .crds-shared-header .btn.btn-secondary:hover {\n        color: white;\n        background-color: #0072a6;\n        border-color: #006b9c; }\n      .crds-shared-header .btn.btn-secondary:active, .crds-shared-header .btn.btn-secondary.active,\n      .open > .crds-shared-header .btn.btn-secondary.dropdown-toggle {\n        color: white;\n        background-color: #0072a6;\n        border-color: #006b9c; }\n        .crds-shared-header .btn.btn-secondary:active:hover, .crds-shared-header .btn.btn-secondary:active:focus, .crds-shared-header .btn.btn-secondary:active.focus, .crds-shared-header .btn.btn-secondary.active:hover, .crds-shared-header .btn.btn-secondary.active:focus, .crds-shared-header .btn.btn-secondary.active.focus,\n        .open > .crds-shared-header .btn.btn-secondary.dropdown-toggle:hover,\n        .open > .crds-shared-header .btn.btn-secondary.dropdown-toggle:focus,\n        .open > .crds-shared-header .btn.btn-secondary.dropdown-toggle.focus {\n          color: white;\n          background-color: #005982;\n          border-color: #003d5a; }\n      .crds-shared-header .btn.btn-secondary:active, .crds-shared-header .btn.btn-secondary.active,\n      .open > .crds-shared-header .btn.btn-secondary.dropdown-toggle {\n        background-image: none; }\n      .crds-shared-header .btn.btn-secondary.disabled:hover, .crds-shared-header .btn.btn-secondary.disabled:focus, .crds-shared-header .btn.btn-secondary.disabled.focus, .crds-shared-header .btn.btn-secondary[disabled]:hover, .crds-shared-header .btn.btn-secondary[disabled]:focus, .crds-shared-header .btn.btn-secondary[disabled].focus,\n      fieldset[disabled] .crds-shared-header .btn.btn-secondary:hover,\n      fieldset[disabled] .crds-shared-header .btn.btn-secondary:focus,\n      fieldset[disabled] .crds-shared-header .btn.btn-secondary.focus {\n        background-color: #0095d9;\n        border-color: #0095d9; }\n      .crds-shared-header .btn.btn-secondary .badge {\n        color: #0095d9;\n        background-color: white; }\n      .crds-shared-header .btn.btn-secondary.active, .crds-shared-header .btn.btn-secondary:active {\n        background: #0083c0; }\n        .crds-shared-header .btn.btn-secondary.active:focus, .crds-shared-header .btn.btn-secondary:active:focus {\n          box-shadow: none; }\n      .crds-shared-header .btn.btn-secondary:focus {\n        border-color: #8bceed;\n        box-shadow: 0 0 0 1px #8bceed inset; }\n      .crds-shared-header .btn.btn-secondary.disabled {\n        opacity: 1;\n        background: #5acbff;\n        border-color: #5acbff;\n        color: white; }\n        .crds-shared-header .btn.btn-secondary.disabled.active, .crds-shared-header .btn.btn-secondary.disabled.active:focus, .crds-shared-header .btn.btn-secondary.disabled.active:hover, .crds-shared-header .btn.btn-secondary.disabled:active, .crds-shared-header .btn.btn-secondary.disabled:active:focus, .crds-shared-header .btn.btn-secondary.disabled:active:hover, .crds-shared-header .btn.btn-secondary.disabled:focus, .crds-shared-header .btn.btn-secondary.disabled:focus:focus, .crds-shared-header .btn.btn-secondary.disabled:focus:hover, .crds-shared-header .btn.btn-secondary.disabled:hover, .crds-shared-header .btn.btn-secondary.disabled:hover:focus, .crds-shared-header .btn.btn-secondary.disabled:hover:hover {\n          background: #5acbff;\n          border-color: #5acbff;\n          box-shadow: none; }\n      .crds-shared-header .btn.btn-secondary.btn-outline {\n        background: transparent;\n        border-style: solid;\n        border-width: 1px;\n        color: #0095d9; }\n        .crds-shared-header .btn.btn-secondary.btn-outline.active, .crds-shared-header .btn.btn-secondary.btn-outline.active:hover, .crds-shared-header .btn.btn-secondary.btn-outline.active:focus, .crds-shared-header .btn.btn-secondary.btn-outline:active, .crds-shared-header .btn.btn-secondary.btn-outline:active:hover, .crds-shared-header .btn.btn-secondary.btn-outline:active:focus {\n          background: rgba(246, 248, 249, 0.75);\n          border-color: #0095d9;\n          color: #0095d9; }\n          .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline.active, .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline.active:hover, .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline.active:focus, .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline:active, .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline:active:hover, .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline:active:focus {\n            background: rgba(4, 6, 7, 0.75);\n            border-color: rgba(0, 149, 217, 0.75); }\n        .crds-shared-header .btn.btn-secondary.btn-outline.active:focus, .crds-shared-header .btn.btn-secondary.btn-outline:active:focus {\n          box-shadow: none; }\n        .crds-shared-header .btn.btn-secondary.btn-outline:focus {\n          border-color: #8bceed;\n          box-shadow: 0 0 0 1px #8bceed inset; }\n        .crds-shared-header .btn.btn-secondary.btn-outline:hover {\n          background: rgba(238, 241, 243, 0.75); }\n          .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline:hover {\n            background: rgba(8, 12, 14, 0.75); }\n        .crds-shared-header .btn.btn-secondary.btn-outline.disabled {\n          background: transparent;\n          border-color: #5acbff;\n          color: #5acbff; }\n          .crds-shared-header .btn.btn-secondary.btn-outline.disabled.active, .crds-shared-header .btn.btn-secondary.btn-outline.disabled.active:hover, .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline.disabled.active, .crds-shared-header .btn.btn-secondary.btn-outline.disabled:active, .crds-shared-header .btn.btn-secondary.btn-outline.disabled:active:hover, .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline.disabled:active, .crds-shared-header .btn.btn-secondary.btn-outline.disabled:focus, .crds-shared-header .btn.btn-secondary.btn-outline.disabled:focus:hover, .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline.disabled:focus, .crds-shared-header .btn.btn-secondary.btn-outline.disabled:hover, .crds-shared-header .btn.btn-secondary.btn-outline.disabled:hover:hover, .dark-theme .crds-shared-header .btn.btn-secondary.btn-outline.disabled:hover {\n            background: transparent;\n            border-color: #5acbff;\n            color: #5acbff; }\n      .crds-shared-header .btn.btn-secondary.btn-link {\n        background: none;\n        border-color: transparent;\n        border-style: solid;\n        border-width: 1px;\n        color: #0095d9;\n        text-decoration: none; }\n        .crds-shared-header .btn.btn-secondary.btn-link.active, .crds-shared-header .btn.btn-secondary.btn-link:active {\n          background: #0095d9;\n          border-color: #0095d9;\n          color: white; }\n          .crds-shared-header .btn.btn-secondary.btn-link.active:hover, .crds-shared-header .btn.btn-secondary.btn-link:active:hover {\n            color: #f2f2f2; }\n          .crds-shared-header .btn.btn-secondary.btn-link.active:focus, .crds-shared-header .btn.btn-secondary.btn-link:active:focus {\n            border: 1px solid #0095d9;\n            box-shadow: none; }\n        .crds-shared-header .btn.btn-secondary.btn-link:hover {\n          color: #0072a6; }\n        .crds-shared-header .btn.btn-secondary.btn-link:focus {\n          border: 1px solid #8bceed;\n          box-shadow: 0 0 0 1px #8bceed inset; }\n    .crds-shared-header .btn.btn-gray {\n      color: white;\n      background-color: #737373;\n      border-color: #737373; }\n      .crds-shared-header .btn.btn-gray:focus, .crds-shared-header .btn.btn-gray.focus {\n        color: white;\n        background-color: #5a5a5a;\n        border-color: #333333; }\n      .crds-shared-header .btn.btn-gray:hover {\n        color: white;\n        background-color: #5a5a5a;\n        border-color: #545454; }\n      .crds-shared-header .btn.btn-gray:active, .crds-shared-header .btn.btn-gray.active,\n      .open > .crds-shared-header .btn.btn-gray.dropdown-toggle {\n        color: white;\n        background-color: #5a5a5a;\n        border-color: #545454; }\n        .crds-shared-header .btn.btn-gray:active:hover, .crds-shared-header .btn.btn-gray:active:focus, .crds-shared-header .btn.btn-gray:active.focus, .crds-shared-header .btn.btn-gray.active:hover, .crds-shared-header .btn.btn-gray.active:focus, .crds-shared-header .btn.btn-gray.active.focus,\n        .open > .crds-shared-header .btn.btn-gray.dropdown-toggle:hover,\n        .open > .crds-shared-header .btn.btn-gray.dropdown-toggle:focus,\n        .open > .crds-shared-header .btn.btn-gray.dropdown-toggle.focus {\n          color: white;\n          background-color: #484848;\n          border-color: #333333; }\n      .crds-shared-header .btn.btn-gray:active, .crds-shared-header .btn.btn-gray.active,\n      .open > .crds-shared-header .btn.btn-gray.dropdown-toggle {\n        background-image: none; }\n      .crds-shared-header .btn.btn-gray.disabled:hover, .crds-shared-header .btn.btn-gray.disabled:focus, .crds-shared-header .btn.btn-gray.disabled.focus, .crds-shared-header .btn.btn-gray[disabled]:hover, .crds-shared-header .btn.btn-gray[disabled]:focus, .crds-shared-header .btn.btn-gray[disabled].focus,\n      fieldset[disabled] .crds-shared-header .btn.btn-gray:hover,\n      fieldset[disabled] .crds-shared-header .btn.btn-gray:focus,\n      fieldset[disabled] .crds-shared-header .btn.btn-gray.focus {\n        background-color: #737373;\n        border-color: #737373; }\n      .crds-shared-header .btn.btn-gray .badge {\n        color: #737373;\n        background-color: white; }\n      .crds-shared-header .btn.btn-gray.active, .crds-shared-header .btn.btn-gray:active {\n        background: #666666; }\n        .crds-shared-header .btn.btn-gray.active:focus, .crds-shared-header .btn.btn-gray:active:focus {\n          box-shadow: none; }\n      .crds-shared-header .btn.btn-gray:focus {\n        border-color: #8bceed;\n        box-shadow: 0 0 0 1px #8bceed inset; }\n      .crds-shared-header .btn.btn-gray.disabled {\n        opacity: 1;\n        background: #b3b3b3;\n        border-color: #b3b3b3;\n        color: white; }\n        .crds-shared-header .btn.btn-gray.disabled.active, .crds-shared-header .btn.btn-gray.disabled.active:focus, .crds-shared-header .btn.btn-gray.disabled.active:hover, .crds-shared-header .btn.btn-gray.disabled:active, .crds-shared-header .btn.btn-gray.disabled:active:focus, .crds-shared-header .btn.btn-gray.disabled:active:hover, .crds-shared-header .btn.btn-gray.disabled:focus, .crds-shared-header .btn.btn-gray.disabled:focus:focus, .crds-shared-header .btn.btn-gray.disabled:focus:hover, .crds-shared-header .btn.btn-gray.disabled:hover, .crds-shared-header .btn.btn-gray.disabled:hover:focus, .crds-shared-header .btn.btn-gray.disabled:hover:hover {\n          background: #b3b3b3;\n          border-color: #b3b3b3;\n          box-shadow: none; }\n      .crds-shared-header .btn.btn-gray.btn-outline {\n        background: transparent;\n        border-style: solid;\n        border-width: 1px;\n        color: #737373; }\n        .crds-shared-header .btn.btn-gray.btn-outline.active, .crds-shared-header .btn.btn-gray.btn-outline.active:hover, .crds-shared-header .btn.btn-gray.btn-outline.active:focus, .crds-shared-header .btn.btn-gray.btn-outline:active, .crds-shared-header .btn.btn-gray.btn-outline:active:hover, .crds-shared-header .btn.btn-gray.btn-outline:active:focus {\n          background: rgba(248, 248, 248, 0.75);\n          border-color: #737373;\n          color: #737373; }\n          .dark-theme .crds-shared-header .btn.btn-gray.btn-outline.active, .dark-theme .crds-shared-header .btn.btn-gray.btn-outline.active:hover, .dark-theme .crds-shared-header .btn.btn-gray.btn-outline.active:focus, .dark-theme .crds-shared-header .btn.btn-gray.btn-outline:active, .dark-theme .crds-shared-header .btn.btn-gray.btn-outline:active:hover, .dark-theme .crds-shared-header .btn.btn-gray.btn-outline:active:focus {\n            background: rgba(6, 6, 6, 0.75);\n            border-color: rgba(115, 115, 115, 0.75); }\n        .crds-shared-header .btn.btn-gray.btn-outline.active:focus, .crds-shared-header .btn.btn-gray.btn-outline:active:focus {\n          box-shadow: none; }\n        .crds-shared-header .btn.btn-gray.btn-outline:focus {\n          border-color: #8bceed;\n          box-shadow: 0 0 0 1px #8bceed inset; }\n        .crds-shared-header .btn.btn-gray.btn-outline:hover {\n          background: rgba(241, 241, 241, 0.75); }\n          .dark-theme .crds-shared-header .btn.btn-gray.btn-outline:hover {\n            background: rgba(12, 12, 12, 0.75); }\n        .crds-shared-header .btn.btn-gray.btn-outline.disabled {\n          background: transparent;\n          border-color: #b3b3b3;\n          color: #b3b3b3; }\n          .crds-shared-header .btn.btn-gray.btn-outline.disabled.active, .crds-shared-header .btn.btn-gray.btn-outline.disabled.active:hover, .dark-theme .crds-shared-header .btn.btn-gray.btn-outline.disabled.active, .crds-shared-header .btn.btn-gray.btn-outline.disabled:active, .crds-shared-header .btn.btn-gray.btn-outline.disabled:active:hover, .dark-theme .crds-shared-header .btn.btn-gray.btn-outline.disabled:active, .crds-shared-header .btn.btn-gray.btn-outline.disabled:focus, .crds-shared-header .btn.btn-gray.btn-outline.disabled:focus:hover, .dark-theme .crds-shared-header .btn.btn-gray.btn-outline.disabled:focus, .crds-shared-header .btn.btn-gray.btn-outline.disabled:hover, .crds-shared-header .btn.btn-gray.btn-outline.disabled:hover:hover, .dark-theme .crds-shared-header .btn.btn-gray.btn-outline.disabled:hover {\n            background: transparent;\n            border-color: #b3b3b3;\n            color: #b3b3b3; }\n      .crds-shared-header .btn.btn-gray.btn-link {\n        background: none;\n        border-color: transparent;\n        border-style: solid;\n        border-width: 1px;\n        color: #737373;\n        text-decoration: none; }\n        .crds-shared-header .btn.btn-gray.btn-link.active, .crds-shared-header .btn.btn-gray.btn-link:active {\n          background: #737373;\n          border-color: #737373;\n          color: white; }\n          .crds-shared-header .btn.btn-gray.btn-link.active:hover, .crds-shared-header .btn.btn-gray.btn-link:active:hover {\n            color: #f2f2f2; }\n          .crds-shared-header .btn.btn-gray.btn-link.active:focus, .crds-shared-header .btn.btn-gray.btn-link:active:focus {\n            border: 1px solid #737373;\n            box-shadow: none; }\n        .crds-shared-header .btn.btn-gray.btn-link:hover {\n          color: #5a5a5a; }\n        .crds-shared-header .btn.btn-gray.btn-link:focus {\n          border: 1px solid #8bceed;\n          box-shadow: 0 0 0 1px #8bceed inset; }\n    .crds-shared-header .btn.btn-default {\n      color: white;\n      background-color: #979797;\n      border-color: #979797; }\n      .crds-shared-header .btn.btn-default:focus, .crds-shared-header .btn.btn-default.focus {\n        color: white;\n        background-color: #7e7e7e;\n        border-color: #575757; }\n      .crds-shared-header .btn.btn-default:hover {\n        color: white;\n        background-color: #7e7e7e;\n        border-color: #787878; }\n      .crds-shared-header .btn.btn-default:active, .crds-shared-header .btn.btn-default.active,\n      .open > .crds-shared-header .btn.btn-default.dropdown-toggle {\n        color: white;\n        background-color: #7e7e7e;\n        border-color: #787878; }\n        .crds-shared-header .btn.btn-default:active:hover, .crds-shared-header .btn.btn-default:active:focus, .crds-shared-header .btn.btn-default:active.focus, .crds-shared-header .btn.btn-default.active:hover, .crds-shared-header .btn.btn-default.active:focus, .crds-shared-header .btn.btn-default.active.focus,\n        .open > .crds-shared-header .btn.btn-default.dropdown-toggle:hover,\n        .open > .crds-shared-header .btn.btn-default.dropdown-toggle:focus,\n        .open > .crds-shared-header .btn.btn-default.dropdown-toggle.focus {\n          color: white;\n          background-color: #6c6c6c;\n          border-color: #575757; }\n      .crds-shared-header .btn.btn-default:active, .crds-shared-header .btn.btn-default.active,\n      .open > .crds-shared-header .btn.btn-default.dropdown-toggle {\n        background-image: none; }\n      .crds-shared-header .btn.btn-default.disabled:hover, .crds-shared-header .btn.btn-default.disabled:focus, .crds-shared-header .btn.btn-default.disabled.focus, .crds-shared-header .btn.btn-default[disabled]:hover, .crds-shared-header .btn.btn-default[disabled]:focus, .crds-shared-header .btn.btn-default[disabled].focus,\n      fieldset[disabled] .crds-shared-header .btn.btn-default:hover,\n      fieldset[disabled] .crds-shared-header .btn.btn-default:focus,\n      fieldset[disabled] .crds-shared-header .btn.btn-default.focus {\n        background-color: #979797;\n        border-color: #979797; }\n      .crds-shared-header .btn.btn-default .badge {\n        color: #979797;\n        background-color: white; }\n      .crds-shared-header .btn.btn-default.active, .crds-shared-header .btn.btn-default:active {\n        background: #8a8a8a; }\n        .crds-shared-header .btn.btn-default.active:focus, .crds-shared-header .btn.btn-default:active:focus {\n          box-shadow: none; }\n      .crds-shared-header .btn.btn-default:focus {\n        border-color: #8bceed;\n        box-shadow: 0 0 0 1px #8bceed inset; }\n      .crds-shared-header .btn.btn-default.disabled {\n        opacity: 1;\n        background: #d7d7d7;\n        border-color: #d7d7d7;\n        color: white; }\n        .crds-shared-header .btn.btn-default.disabled.active, .crds-shared-header .btn.btn-default.disabled.active:focus, .crds-shared-header .btn.btn-default.disabled.active:hover, .crds-shared-header .btn.btn-default.disabled:active, .crds-shared-header .btn.btn-default.disabled:active:focus, .crds-shared-header .btn.btn-default.disabled:active:hover, .crds-shared-header .btn.btn-default.disabled:focus, .crds-shared-header .btn.btn-default.disabled:focus:focus, .crds-shared-header .btn.btn-default.disabled:focus:hover, .crds-shared-header .btn.btn-default.disabled:hover, .crds-shared-header .btn.btn-default.disabled:hover:focus, .crds-shared-header .btn.btn-default.disabled:hover:hover {\n          background: #d7d7d7;\n          border-color: #d7d7d7;\n          box-shadow: none; }\n      .crds-shared-header .btn.btn-default.btn-outline {\n        background: transparent;\n        border-style: solid;\n        border-width: 1px;\n        color: #979797; }\n        .crds-shared-header .btn.btn-default.btn-outline.active, .crds-shared-header .btn.btn-default.btn-outline.active:hover, .crds-shared-header .btn.btn-default.btn-outline.active:focus, .crds-shared-header .btn.btn-default.btn-outline:active, .crds-shared-header .btn.btn-default.btn-outline:active:hover, .crds-shared-header .btn.btn-default.btn-outline:active:focus {\n          background: rgba(250, 250, 250, 0.75);\n          border-color: #979797;\n          color: #979797; }\n          .dark-theme .crds-shared-header .btn.btn-default.btn-outline.active, .dark-theme .crds-shared-header .btn.btn-default.btn-outline.active:hover, .dark-theme .crds-shared-header .btn.btn-default.btn-outline.active:focus, .dark-theme .crds-shared-header .btn.btn-default.btn-outline:active, .dark-theme .crds-shared-header .btn.btn-default.btn-outline:active:hover, .dark-theme .crds-shared-header .btn.btn-default.btn-outline:active:focus {\n            background: rgba(8, 8, 8, 0.75);\n            border-color: rgba(151, 151, 151, 0.75); }\n        .crds-shared-header .btn.btn-default.btn-outline.active:focus, .crds-shared-header .btn.btn-default.btn-outline:active:focus {\n          box-shadow: none; }\n        .crds-shared-header .btn.btn-default.btn-outline:focus {\n          border-color: #8bceed;\n          box-shadow: 0 0 0 1px #8bceed inset; }\n        .crds-shared-header .btn.btn-default.btn-outline:hover {\n          background: rgba(245, 245, 245, 0.75); }\n          .dark-theme .crds-shared-header .btn.btn-default.btn-outline:hover {\n            background: rgba(15, 15, 15, 0.75); }\n        .crds-shared-header .btn.btn-default.btn-outline.disabled {\n          background: transparent;\n          border-color: #d7d7d7;\n          color: #d7d7d7; }\n          .crds-shared-header .btn.btn-default.btn-outline.disabled.active, .crds-shared-header .btn.btn-default.btn-outline.disabled.active:hover, .dark-theme .crds-shared-header .btn.btn-default.btn-outline.disabled.active, .crds-shared-header .btn.btn-default.btn-outline.disabled:active, .crds-shared-header .btn.btn-default.btn-outline.disabled:active:hover, .dark-theme .crds-shared-header .btn.btn-default.btn-outline.disabled:active, .crds-shared-header .btn.btn-default.btn-outline.disabled:focus, .crds-shared-header .btn.btn-default.btn-outline.disabled:focus:hover, .dark-theme .crds-shared-header .btn.btn-default.btn-outline.disabled:focus, .crds-shared-header .btn.btn-default.btn-outline.disabled:hover, .crds-shared-header .btn.btn-default.btn-outline.disabled:hover:hover, .dark-theme .crds-shared-header .btn.btn-default.btn-outline.disabled:hover {\n            background: transparent;\n            border-color: #d7d7d7;\n            color: #d7d7d7; }\n      .crds-shared-header .btn.btn-default.btn-link {\n        background: none;\n        border-color: transparent;\n        border-style: solid;\n        border-width: 1px;\n        color: #979797;\n        text-decoration: none; }\n        .crds-shared-header .btn.btn-default.btn-link.active, .crds-shared-header .btn.btn-default.btn-link:active {\n          background: #979797;\n          border-color: #979797;\n          color: white; }\n          .crds-shared-header .btn.btn-default.btn-link.active:hover, .crds-shared-header .btn.btn-default.btn-link:active:hover {\n            color: #f2f2f2; }\n          .crds-shared-header .btn.btn-default.btn-link.active:focus, .crds-shared-header .btn.btn-default.btn-link:active:focus {\n            border: 1px solid #979797;\n            box-shadow: none; }\n        .crds-shared-header .btn.btn-default.btn-link:hover {\n          color: #7e7e7e; }\n        .crds-shared-header .btn.btn-default.btn-link:focus {\n          border: 1px solid #8bceed;\n          box-shadow: 0 0 0 1px #8bceed inset; }\n  .crds-shared-header .btn-option {\n    border-style: solid;\n    border-width: 1px;\n    background-color: #979797;\n    border-color: rgba(151, 151, 151, 0.75);\n    color: white; }\n    .crds-shared-header .btn-option.active, .crds-shared-header .btn-option.active:focus, .crds-shared-header .btn-option.active:hover, .crds-shared-header .btn-option:active, .crds-shared-header .btn-option:active:focus, .crds-shared-header .btn-option:active:hover {\n      box-shadow: none;\n      background-color: #57afa9;\n      border-color: #57afa9;\n      color: white; }\n    .crds-shared-header .btn-option:hover {\n      background-color: #7e7e7e;\n      border-color: rgba(126, 126, 126, 0.75);\n      color: white; }\n    .crds-shared-header .btn-option :focus {\n      border-color: #8bceed;\n      box-shadow: 0 0 0 1px #8bceed inset; }\n    .crds-shared-header .btn-option.btn-outline {\n      background-color: transparent;\n      border-color: rgba(151, 151, 151, 0.75);\n      color: #979797; }\n      .crds-shared-header .btn-option.btn-outline.active, .dark-theme .crds-shared-header .btn-option.btn-outline.active, .crds-shared-header .btn-option.btn-outline:active, .dark-theme .crds-shared-header .btn-option.btn-outline:active, .crds-shared-header .btn-option.btn-outline.active:focus, .dark-theme .crds-shared-header .btn-option.btn-outline.active:focus, .crds-shared-header .btn-option.btn-outline:active:focus, .dark-theme .crds-shared-header .btn-option.btn-outline:active:focus, .crds-shared-header .btn-option.btn-outline.active:hover, .dark-theme .crds-shared-header .btn-option.btn-outline.active:hover, .crds-shared-header .btn-option.btn-outline:active:hover, .dark-theme .crds-shared-header .btn-option.btn-outline:active:hover {\n        background-color: #57afa9;\n        border-color: #57afa9;\n        color: white; }\n      .crds-shared-header .btn-option.btn-outline:hover {\n        background-color: #fcfcfc; }\n        .dark-theme .crds-shared-header .btn-option.btn-outline:hover {\n          background-color: transparent;\n          border-color: rgba(138, 138, 138, 0.75); }\n    .crds-shared-header .btn-option.btn-link {\n      background: none;\n      border-color: transparent;\n      color: #979797;\n      text-decoration: none; }\n      .crds-shared-header .btn-option.btn-link.active, .crds-shared-header .btn-option.btn-link:active {\n        background: #57afa9;\n        border-color: #57afa9;\n        color: white; }\n        .crds-shared-header .btn-option.btn-link.active:hover, .crds-shared-header .btn-option.btn-link:active:hover {\n          color: #f2f2f2; }\n        .crds-shared-header .btn-option.btn-link.active:focus, .crds-shared-header .btn-option.btn-link:active:focus {\n          border-color: #57afa9;\n          box-shadow: none; }\n      .crds-shared-header .btn-option.btn-link:hover {\n        color: #7e7e7e; }\n      .crds-shared-header .btn-option.btn-link:focus {\n        border-color: #8bceed;\n        box-shadow: 0 0 0 1px #8bceed inset; }\n    .crds-shared-header .btn-option.disabled.active, .crds-shared-header .btn-option.disabled.active:focus, .crds-shared-header .btn-option.disabled.active:hover, .crds-shared-header .btn-option.disabled:active, .crds-shared-header .btn-option.disabled:active:focus, .crds-shared-header .btn-option.disabled:active:hover {\n      background-color: #979797;\n      border-color: rgba(151, 151, 151, 0.75);\n      color: white; }\n    .crds-shared-header .btn-option.disabled:hover {\n      background-color: #979797;\n      border-color: rgba(151, 151, 151, 0.75);\n      color: white; }\n    .crds-shared-header .btn-option.disabled.btn-outline.active, .crds-shared-header .btn-option.disabled.btn-outline:active, .crds-shared-header .btn-option.disabled.btn-outline:active:focus, .crds-shared-header .btn-option.disabled.btn-outline:active:hover {\n      background-color: transparent;\n      border-color: rgba(151, 151, 151, 0.75);\n      color: #979797; }\n    .crds-shared-header .btn-option.disabled.btn-outline:hover {\n      background-color: transparent;\n      border-color: rgba(151, 151, 151, 0.75);\n      color: #979797; }\n    .dark-theme .crds-shared-header .btn-option.disabled {\n      opacity: 1; }\n  .crds-shared-header .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle),\n  .crds-shared-header .btn-group-vertical > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n    border-radius: 4px; }\n  .crds-shared-header .btn-group > .btn:last-child:not(:first-child),\n  .crds-shared-header .btn-group-vertical > .btn:last-child:not(:first-child) {\n    border-radius: 4px; }\n  .crds-shared-header .btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle),\n  .crds-shared-header .btn-group-vertical > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n    border-radius: 4px; }\n  .crds-shared-header .btn-group > .btn:not(:last-child) {\n    margin-right: .5rem; }\n  .crds-shared-header .btn-group-vertical {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    flex-direction: column; }\n    .crds-shared-header .btn-group-vertical > .btn:not(:last-child) {\n      margin-bottom: .5rem; }\n    .crds-shared-header .btn-group-vertical > .btn {\n      width: auto; }\n  .crds-shared-header .btn-group-toggle {\n    margin-bottom: 1rem;\n    width: 100%; }\n    .crds-shared-header .btn-group-toggle > .btn {\n      width: 50%; }\n      .crds-shared-header .btn-group-toggle > .btn.btn-option {\n        margin-right: 0; }\n    .crds-shared-header .btn-group-toggle > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n      border-bottom-right-radius: 0;\n      border-top-right-radius: 0; }\n    .crds-shared-header .btn-group-toggle > .btn:last-child:not(:first-child) {\n      border-bottom-left-radius: 0;\n      border-top-left-radius: 0; }\n  .crds-shared-header .btn-group-teal .btn-option {\n    border: 1px solid #57afa9;\n    background: white;\n    color: #57afa9; }\n    .crds-shared-header .btn-group-teal .btn-option:hover {\n      background: white;\n      border-color: #57afa9;\n      color: #57afa9; }\n    .crds-shared-header .btn-group-teal .btn-option.active, .crds-shared-header .btn-group-teal .btn-option:active, .crds-shared-header .btn-group-teal .btn-option:focus:hover {\n      background: #57afa9;\n      border-color: #57afa9;\n      box-shadow: none;\n      color: white; }\n      .crds-shared-header .btn-group-teal .btn-option.active:focus, .crds-shared-header .btn-group-teal .btn-option.active:hover, .crds-shared-header .btn-group-teal .btn-option:active:focus, .crds-shared-header .btn-group-teal .btn-option:active:hover, .crds-shared-header .btn-group-teal .btn-option:focus:hover:focus, .crds-shared-header .btn-group-teal .btn-option:focus:hover:hover {\n        background: #57afa9;\n        border-color: #57afa9;\n        color: white; }\n  .dark-theme .crds-shared-header .btn-group-teal .btn-option {\n    background: transparent; }\n    .dark-theme .crds-shared-header .btn-group-teal .btn-option.active, .dark-theme .crds-shared-header .btn-group-teal .btn-option:active, .dark-theme .crds-shared-header .btn-group-teal .btn-option:focus:hover, .dark-theme .crds-shared-header .btn-group-teal .btn-option.active:focus, .dark-theme .crds-shared-header .btn-group-teal .btn-option:active:focus, .dark-theme .crds-shared-header .btn-group-teal .btn-option.active:hover, .dark-theme .crds-shared-header .btn-group-teal .btn-option:active:hover {\n      background: #57afa9; }\n  .crds-shared-header a.btn.disabled {\n    pointer-events: auto; }\n  .crds-shared-header .btn-group-row {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: nowrap;\n    margin-right: -5px;\n    margin-left: -5px;\n    justify-content: space-between; }\n    .crds-shared-header .btn-group-row .btn-option.btn-flex {\n      min-height: 2rem;\n      flex: 1 1 auto;\n      margin: 4px;\n      padding-left: 1rem;\n      padding-right: 1rem; }\n  .crds-shared-header .btn-group-block {\n    display: flex;\n    flex-flow: column nowrap; }\n    .crds-shared-header .btn-group-block[type='submit'] {\n      font-size: .875rem; }\n    .crds-shared-header .btn-group-block .btn-flex {\n      flex: 1 1 auto;\n      min-height: 3.5rem;\n      margin: 4px 0; }\n    .crds-shared-header .btn-group-block .btn-option.btn-flex {\n      margin-right: 0; }\n    .crds-shared-header .btn-group-block .row > div {\n      position: relative;\n      float: left;\n      width: 50%;\n      min-height: 1px;\n      padding-left: 1rem;\n      padding-right: 1rem; }\n    .crds-shared-header .btn-group-block .row div:first-child:not(:last-child) {\n      text-align: left; }\n    .crds-shared-header .btn-group-block .row div:last-child:not(:first-child) {\n      font-size: 1.5rem;\n      line-height: 1.5;\n      text-align: right; }\n    .crds-shared-header .btn-group-block .btn-circle__icon .fa {\n      padding-right: 8px;\n      vertical-align: middle; }\n    .crds-shared-header .btn-group-block .btn-circle__icon .fa-circle-thin {\n      display: inline-block; }\n    .crds-shared-header .btn-group-block .btn-circle__icon .fa-check-circle {\n      display: none; }\n  .crds-shared-header .dark-theme {\n    background: black;\n    color: #737373; }\n    .crds-shared-header .dark-theme hr {\n      border-top-color: #272727; }\n  .crds-shared-header .inverted {\n    color: white;\n    /* Typography */\n    /* Forms */\n    /* Media objects */\n    /* Tables */ }\n    .crds-shared-header .inverted h1, .crds-shared-header .inverted h2, .crds-shared-header .inverted h3, .crds-shared-header .inverted h4, .crds-shared-header .inverted h5, .crds-shared-header .inverted h6,\n    .crds-shared-header .inverted .page-header,\n    .crds-shared-header .inverted .section-header,\n    .crds-shared-header .inverted .title,\n    .crds-shared-header .inverted .collection-header,\n    .crds-shared-header .inverted .component-header,\n    .crds-shared-header .inverted .list-header {\n      color: white; }\n    .crds-shared-header .inverted .control-label {\n      color: white; }\n    .crds-shared-header .inverted a {\n      color: white;\n      text-decoration: underline; }\n      .crds-shared-header .inverted a:hover {\n        color: rgba(255, 255, 255, 0.3); }\n    .crds-shared-header .inverted .help-block {\n      color: white; }\n    .crds-shared-header .inverted .media-heading {\n      color: white; }\n    .crds-shared-header .inverted .media-meta {\n      color: white; }\n    .crds-shared-header .inverted .table-contrast-bg {\n      background: transparent; }\n  .crds-shared-header .bg-success {\n    background-color: #6acc93;\n    color: white; }\n  .crds-shared-header .bg-info {\n    background-color: #0095d9;\n    color: white; }\n  .crds-shared-header .bg-warning {\n    background-color: #e09e06;\n    color: white; }\n  .crds-shared-header .bg-danger {\n    background-color: #d96f62;\n    color: white; }\n  .crds-shared-header .bg-blue {\n    background-color: #3b6e8f;\n    color: white; }\n  .crds-shared-header .bg-cyan {\n    background-color: #0095d9;\n    color: white; }\n  .crds-shared-header .bg-gray {\n    background-color: #e7e7e7;\n    color: #737373; }\n  .crds-shared-header .bg-charcoal {\n    background-color: #171717;\n    color: #737373; }\n  .crds-shared-header .text-white {\n    color: white; }\n  .crds-shared-header .img-background {\n    background-size: cover;\n    background-position: 50% 50%;\n    background-repeat: no-repeat; }\n  .crds-shared-header .img-background-100 {\n    background-size: 100%;\n    background-position: top left;\n    background-repeat: no-repeat; }\n  .crds-shared-header .img-full-width {\n    width: 100%;\n    height: auto; }\n  .crds-shared-header .img-full-size {\n    width: 100%;\n    height: 100%; }\n  .crds-shared-header .absolute-cover {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0; }\n  .crds-shared-header a.underline,\n  .crds-shared-header .underline {\n    text-decoration: underline; }\n  .crds-shared-header .ellipsis {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n  .crds-shared-header .overflow-hidden {\n    overflow: hidden; }\n  .crds-shared-header .sub {\n    vertical-align: sub; }\n  .crds-shared-header .truncate {\n    max-width: 1px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n  @media only screen and (min-width: 768px) {\n    .crds-shared-header .sm-text-right {\n      text-align: right; }\n    .crds-shared-header .sm-text-left {\n      text-align: left; }\n    .crds-shared-header .sm-text-center {\n      text-align: center; } }\n  @media only screen and (min-width: 992px) {\n    .crds-shared-header .md-text-right {\n      text-align: right; }\n    .crds-shared-header .md-text-left {\n      text-align: left; }\n    .crds-shared-header .md-text-center {\n      text-align: center; } }\n  @media only screen and (min-width: 1200px) {\n    .crds-shared-header .lg-text-right {\n      text-align: right; }\n    .crds-shared-header .lg-text-left {\n      text-align: left; }\n    .crds-shared-header .lg-text-center {\n      text-align: center; } }\n  .crds-shared-header .block {\n    display: block; }\n  .crds-shared-header .relative {\n    position: relative; }\n  .crds-shared-header .inline {\n    display: inline; }\n  .crds-shared-header .inline-block {\n    display: inline-block; }\n  .crds-shared-header .static {\n    position: static; }\n  .crds-shared-header .center {\n    display: inline-block;\n    left: 50%;\n    position: absolute;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    vertical-align: middle; }\n  .crds-shared-header .vertical-center {\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    width: 100%; }\n  .crds-shared-header .vertical-bottom {\n    position: absolute;\n    left: 50%;\n    bottom: 0%;\n    transform: translate(-50%, 0%);\n    width: 100%; }\n  .crds-shared-header .vertical-10 {\n    position: absolute;\n    left: 50%;\n    top: 10%;\n    transform: translate(-50%, -10%);\n    width: 100%; }\n  .crds-shared-header .vertical-20 {\n    position: absolute;\n    left: 50%;\n    top: 20%;\n    transform: translate(-50%, -20%);\n    width: 100%; }\n  .crds-shared-header .vertical-70 {\n    position: absolute;\n    left: 50%;\n    top: 70%;\n    transform: translate(-50%, -70%);\n    width: 100%; }\n  .crds-shared-header .vertical-80 {\n    position: absolute;\n    left: 50%;\n    top: 80%;\n    transform: translate(-50%, -80%);\n    width: 100%; }\n  .crds-shared-header .no-borders {\n    border: 0; }\n  .crds-shared-header .border-bottom {\n    border-bottom: 1px solid #e7e7e7; }\n  .crds-shared-header .border-top {\n    border-top: 1px solid #e7e7e7; }\n  .crds-shared-header .border-sides {\n    border-left: 1px solid #e7e7e7;\n    border-right: 1px solid #e7e7e7; }\n  .crds-shared-header .border-ends {\n    border-top: 1px solid #e7e7e7;\n    border-bottom: 1px solid #e7e7e7; }\n  .crds-shared-header .square-corners {\n    border-radius: 0; }\n  .crds-shared-header .round-corners {\n    border-radius: 4px; }\n  @media only screen and (min-width: 768px) {\n    .crds-shared-header .sm-pull-right {\n      float: right; }\n    .crds-shared-header .sm-pull-left {\n      float: left; } }\n  @media only screen and (min-width: 992px) {\n    .crds-shared-header .md-pull-right {\n      float: right; }\n    .crds-shared-header .md-pull-left {\n      float: left; } }\n  @media only screen and (min-width: 1200px) {\n    .crds-shared-header .lg-pull-right {\n      float: right; }\n    .crds-shared-header .lg-pull-left {\n      float: left; } }\n  .crds-shared-header .sixteen-nine {\n    position: relative; }\n    .crds-shared-header .sixteen-nine:before {\n      display: block;\n      content: ' ';\n      width: 100%;\n      padding-top: 56.25%; }\n    .crds-shared-header .sixteen-nine > .aspect-content {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0; }\n  .crds-shared-header .push {\n    margin: 24px; }\n  .crds-shared-header .push-center {\n    margin: 0 auto; }\n  .crds-shared-header .push-half {\n    margin: 12px; }\n  .crds-shared-header .push-quarter {\n    margin: 6px; }\n  .crds-shared-header .push-top {\n    margin-top: 24px; }\n  .crds-shared-header .push-half-top {\n    margin-top: 12px; }\n  .crds-shared-header .push-quarter-top {\n    margin-top: 6px; }\n  .crds-shared-header .push-right {\n    margin-right: 24px; }\n  .crds-shared-header .push-half-right {\n    margin-right: 12px; }\n  .crds-shared-header .push-quarter-right {\n    margin-right: 6px; }\n  .crds-shared-header .push-bottom {\n    margin-bottom: 24px; }\n  .crds-shared-header .push-half-bottom {\n    margin-bottom: 12px; }\n  .crds-shared-header .push-quarter-bottom {\n    margin-bottom: 6px; }\n  .crds-shared-header .push-left {\n    margin-left: 24px; }\n  .crds-shared-header .push-half-left {\n    margin-left: 12px; }\n  .crds-shared-header .push-quarter-left {\n    margin-left: 6px; }\n  .crds-shared-header .push-sides {\n    margin-right: 24px;\n    margin-left: 24px; }\n  .crds-shared-header .push-ends {\n    margin-top: 24px;\n    margin-bottom: 24px; }\n  .crds-shared-header .push-half-sides {\n    margin-right: 12px;\n    margin-left: 12px; }\n  .crds-shared-header .push-half-ends {\n    margin-top: 12px;\n    margin-bottom: 12px; }\n  .crds-shared-header .push-quarter-sides {\n    margin-right: 6px;\n    margin-left: 6px; }\n  .crds-shared-header .push-quarter-ends {\n    margin-top: 6px;\n    margin-bottom: 6px; }\n  .crds-shared-header .flush {\n    margin: 0; }\n  .crds-shared-header .flush-top {\n    margin-top: 0; }\n  .crds-shared-header .flush-right {\n    margin-right: 0; }\n  .crds-shared-header .flush-bottom {\n    margin-bottom: 0; }\n  .crds-shared-header .flush-left {\n    margin-left: 0; }\n  .crds-shared-header .flush-sides {\n    margin-right: 0;\n    margin-left: 0; }\n  .crds-shared-header .flush-ends {\n    margin-top: 0;\n    margin-bottom: 0; }\n  @media only screen and (max-width: 768px) {\n    .crds-shared-header .mobile-push {\n      margin: 24px; }\n    .crds-shared-header .mobile-push-half {\n      margin: 12px; }\n    .crds-shared-header .mobile-push-quarter {\n      margin: 6px; }\n    .crds-shared-header .mobile-push-top {\n      margin-top: 24px; }\n    .crds-shared-header .mobile-push-half-top {\n      margin-top: 12px; }\n    .crds-shared-header .mobile-push-quarter-top {\n      margin-top: 6px; }\n    .crds-shared-header .mobile-push-right {\n      margin-right: 24px; }\n    .crds-shared-header .mobile-push-half-right {\n      margin-right: 12px; }\n    .crds-shared-header .mobile-push-quarter-right {\n      margin-right: 6px; }\n    .crds-shared-header .mobile-push-bottom {\n      margin-bottom: 24px; }\n    .crds-shared-header .mobile-push-half-bottom {\n      margin-bottom: 12px; }\n    .crds-shared-header .mobile-push-quarter-bottom {\n      margin-bottom: 6px; }\n    .crds-shared-header .mobile-push-left {\n      margin-left: 24px; }\n    .crds-shared-header .mobile-push-half-left {\n      margin-left: 12px; }\n    .crds-shared-header .mobile-push-quarter-left {\n      margin-left: 6px; }\n    .crds-shared-header .mobile-push-sides {\n      margin-right: 24px;\n      margin-left: 24px; }\n    .crds-shared-header .mobile-push-ends {\n      margin-top: 24px;\n      margin-bottom: 24px; }\n    .crds-shared-header .mobile-push-half-sides {\n      margin-right: 12px;\n      margin-left: 12px; }\n    .crds-shared-header .mobile-push-half-ends {\n      margin-top: 12px;\n      margin-bottom: 12px; }\n    .crds-shared-header .mobile-flush {\n      margin: 0; }\n    .crds-shared-header .mobile-flush-top {\n      margin-top: 0; }\n    .crds-shared-header .mobile-flush-right {\n      margin-right: 0; }\n    .crds-shared-header .mobile-flush-bottom {\n      margin-bottom: 0; }\n    .crds-shared-header .mobile-flush-left {\n      margin-left: 0; }\n    .crds-shared-header .mobile-flush-sides {\n      margin-right: 0;\n      margin-left: 0; }\n    .crds-shared-header .mobile-flush-ends {\n      margin-top: 0;\n      margin-bottom: 0; } }\n  .crds-shared-header .hard {\n    padding: 0; }\n  .crds-shared-header .hard-top {\n    padding-top: 0; }\n  .crds-shared-header .hard-right {\n    padding-right: 0; }\n  .crds-shared-header .hard-bottom {\n    padding-bottom: 0; }\n  .crds-shared-header .hard-left {\n    padding-left: 0; }\n  .crds-shared-header .hard-sides {\n    padding-right: 0;\n    padding-left: 0; }\n  .crds-shared-header .hard-ends {\n    padding-top: 0;\n    padding-bottom: 0; }\n  .crds-shared-header .soft {\n    padding: 24px; }\n  .crds-shared-header .soft-half {\n    padding: 12px; }\n  .crds-shared-header .soft-quarter {\n    padding: 6px; }\n  .crds-shared-header .soft-top {\n    padding-top: 24px; }\n  .crds-shared-header .soft-half-top {\n    padding-top: 12px; }\n  .crds-shared-header .soft-quarter-top {\n    padding-top: 6px; }\n  .crds-shared-header .soft-right {\n    padding-right: 24px; }\n  .crds-shared-header .soft-half-right {\n    padding-right: 12px; }\n  .crds-shared-header .soft-quarter-right {\n    padding-right: 6px; }\n  .crds-shared-header .soft-bottom {\n    padding-bottom: 24px; }\n  .crds-shared-header .soft-half-bottom {\n    padding-bottom: 12px; }\n  .crds-shared-header .soft-quarter-bottom {\n    padding-bottom: 6px; }\n  .crds-shared-header .soft-left {\n    padding-left: 24px; }\n  .crds-shared-header .soft-half-left {\n    padding-left: 12px; }\n  .crds-shared-header .soft-quarter-left {\n    padding-left: 6px; }\n  .crds-shared-header .soft-sides {\n    padding-right: 24px;\n    padding-left: 24px; }\n  .crds-shared-header .soft-ends {\n    padding-top: 24px;\n    padding-bottom: 24px; }\n  .crds-shared-header .soft-half-sides {\n    padding-right: 12px;\n    padding-left: 12px; }\n  .crds-shared-header .soft-half-ends {\n    padding-top: 12px;\n    padding-bottom: 12px; }\n  .crds-shared-header .soft-quarter-sides {\n    padding-right: 6px;\n    padding-left: 6px; }\n  .crds-shared-header .soft-quarter-ends {\n    padding-top: 6px;\n    padding-bottom: 6px; }\n  @media only screen and (max-width: 768px) {\n    .crds-shared-header .mobile-hard {\n      padding: 0; }\n    .crds-shared-header .mobile-hard-top {\n      padding-top: 0; }\n    .crds-shared-header .mobile-hard-right {\n      padding-right: 0; }\n    .crds-shared-header .mobile-hard-bottom {\n      padding-bottom: 0; }\n    .crds-shared-header .mobile-hard-left {\n      padding-left: 0; }\n    .crds-shared-header .mobile-hard-sides {\n      padding-right: 0;\n      padding-left: 0; }\n    .crds-shared-header .mobile-hard-ends {\n      padding-top: 0;\n      padding-bottom: 0; }\n    .crds-shared-header .mobile-soft {\n      padding: 24px; }\n    .crds-shared-header .mobile-soft-half {\n      padding: 12px; }\n    .crds-shared-header .mobile-soft-quarter {\n      padding: 6px; }\n    .crds-shared-header .mobile-soft-top {\n      padding-top: 24px; }\n    .crds-shared-header .mobile-soft-half-top {\n      padding-top: 12px; }\n    .crds-shared-header .mobile-soft-quarter-top {\n      padding-top: 6px; }\n    .crds-shared-header .mobile-soft-right {\n      padding-right: 24px; }\n    .crds-shared-header .mobile-soft-half-right {\n      padding-right: 12px; }\n    .crds-shared-header .mobile-soft-quarter-right {\n      padding-right: 6px; }\n    .crds-shared-header .mobile-soft-bottom {\n      padding-bottom: 24px; }\n    .crds-shared-header .mobile-soft-half-bottom {\n      padding-bottom: 12px; }\n    .crds-shared-header .mobile-soft-quarter-bottom {\n      padding-bottom: 6px; }\n    .crds-shared-header .mobile-soft-left {\n      padding-left: 24px; }\n    .crds-shared-header .mobile-soft-half-left {\n      padding-left: 12px; }\n    .crds-shared-header .mobile-soft-quarter-left {\n      padding-left: 6px; }\n    .crds-shared-header .mobile-soft-sides {\n      padding-right: 24px;\n      padding-left: 24px; }\n    .crds-shared-header .mobile-soft-ends {\n      padding-top: 24px;\n      padding-bottom: 24px; }\n    .crds-shared-header .mobile-soft-half-sides {\n      padding-right: 12px;\n      padding-left: 12px; }\n    .crds-shared-header .mobile-soft-half-ends {\n      padding-top: 12px;\n      padding-bottom: 12px; } }\n  .crds-shared-header .pointer {\n    cursor: pointer; }\n  .crds-shared-header .or-divider {\n    margin-top: -41px; }\n    .crds-shared-header .or-divider span {\n      background: white;\n      padding: 5px;\n      vertical-align: middle; }\n  .crds-shared-header .full-width {\n    width: 100%; }\n  .crds-shared-header .nav,\n  .crds-shared-header .pagination,\n  .crds-shared-header .carousel,\n  .crds-shared-header .panel-title a,\n  .crds-shared-header a[ng-click] {\n    cursor: pointer; }\n";

document.write("<style>" + styles + "</style>");
(function () {
    var CRDS = window['CRDS'] || {};
    CRDS.SharedHeader = SharedHeader;
    window['CRDS'] = CRDS;
})();

exports.SharedHeader = SharedHeader;

}((this['crds-shared-header'] = this['crds-shared-header'] || {})));


}).call(this,require('_process'))
},{"_process":22,"array-from":1,"handlebars/runtime":21}]},{},[23]);
