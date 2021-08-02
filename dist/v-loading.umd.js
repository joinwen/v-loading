(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VL = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var defineProperty$4 = {exports: {}};

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global$9 =
    // eslint-disable-next-line es/no-global-this -- safe
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () { return this; })() || Function('return this')();

  var objectGetOwnPropertyDescriptor = {};

  var fails$9 = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var fails$8 = fails$9;

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails$8(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var objectPropertyIsEnumerable = {};

  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$1(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;

  var createPropertyDescriptor$3 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var fails$7 = fails$9;
  var classof$1 = classofRaw;

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails$7(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof$1(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$2 = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings
  var IndexedObject$1 = indexedObject;
  var requireObjectCoercible$1 = requireObjectCoercible$2;

  var toIndexedObject$3 = function (it) {
    return IndexedObject$1(requireObjectCoercible$1(it));
  };

  var isObject$5 = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var isObject$4 = isObject$5;

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive$3 = function (input, PREFERRED_STRING) {
    if (!isObject$4(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$4(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject$4(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$4(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var requireObjectCoercible = requireObjectCoercible$2;

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject$4 = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var toObject$3 = toObject$4;

  var hasOwnProperty = {}.hasOwnProperty;

  var has$4 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty.call(toObject$3(it), key);
  };

  var global$8 = global$9;
  var isObject$3 = isObject$5;

  var document$1 = global$8.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS = isObject$3(document$1) && isObject$3(document$1.createElement);

  var documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  var DESCRIPTORS$5 = descriptors;
  var fails$6 = fails$9;
  var createElement = documentCreateElement;

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !DESCRIPTORS$5 && !fails$6(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
    return Object.defineProperty(createElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var DESCRIPTORS$4 = descriptors;
  var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
  var createPropertyDescriptor$2 = createPropertyDescriptor$3;
  var toIndexedObject$2 = toIndexedObject$3;
  var toPrimitive$2 = toPrimitive$3;
  var has$3 = has$4;
  var IE8_DOM_DEFINE$1 = ie8DomDefine;

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  objectGetOwnPropertyDescriptor.f = DESCRIPTORS$4 ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$2(O);
    P = toPrimitive$2(P, true);
    if (IE8_DOM_DEFINE$1) try {
      return $getOwnPropertyDescriptor(O, P);
    } catch (error) { /* empty */ }
    if (has$3(O, P)) return createPropertyDescriptor$2(!propertyIsEnumerableModule$1.f.call(O, P), O[P]);
  };

  var fails$5 = fails$9;

  var replacement = /#|\.prototype\./;

  var isForced$1 = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : typeof detection == 'function' ? fails$5(detection)
      : !!detection;
  };

  var normalize = isForced$1.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced$1.data = {};
  var NATIVE = isForced$1.NATIVE = 'N';
  var POLYFILL = isForced$1.POLYFILL = 'P';

  var isForced_1 = isForced$1;

  var path$7 = {};

  var aFunction$2 = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  var aFunction$1 = aFunction$2;

  // optional / simple context binding
  var functionBindContext = function (fn, that, length) {
    aFunction$1(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var objectDefineProperty = {};

  var isObject$2 = isObject$5;

  var anObject$1 = function (it) {
    if (!isObject$2(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  var DESCRIPTORS$3 = descriptors;
  var IE8_DOM_DEFINE = ie8DomDefine;
  var anObject = anObject$1;
  var toPrimitive$1 = toPrimitive$3;

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  objectDefineProperty.f = DESCRIPTORS$3 ? $defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive$1(P, true);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var DESCRIPTORS$2 = descriptors;
  var definePropertyModule$1 = objectDefineProperty;
  var createPropertyDescriptor$1 = createPropertyDescriptor$3;

  var createNonEnumerableProperty$2 = DESCRIPTORS$2 ? function (object, key, value) {
    return definePropertyModule$1.f(object, key, createPropertyDescriptor$1(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var global$7 = global$9;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var isForced = isForced_1;
  var path$6 = path$7;
  var bind = functionBindContext;
  var createNonEnumerableProperty$1 = createNonEnumerableProperty$2;
  var has$2 = has$4;

  var wrapConstructor = function (NativeConstructor) {
    var Wrapper = function (a, b, c) {
      if (this instanceof NativeConstructor) {
        switch (arguments.length) {
          case 0: return new NativeConstructor();
          case 1: return new NativeConstructor(a);
          case 2: return new NativeConstructor(a, b);
        } return new NativeConstructor(a, b, c);
      } return NativeConstructor.apply(this, arguments);
    };
    Wrapper.prototype = NativeConstructor.prototype;
    return Wrapper;
  };

  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var PROTO = options.proto;

    var nativeSource = GLOBAL ? global$7 : STATIC ? global$7[TARGET] : (global$7[TARGET] || {}).prototype;

    var target = GLOBAL ? path$6 : path$6[TARGET] || (path$6[TARGET] = {});
    var targetPrototype = target.prototype;

    var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
    var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

    for (key in source) {
      FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contains in native
      USE_NATIVE = !FORCED && nativeSource && has$2(nativeSource, key);

      targetProperty = target[key];

      if (USE_NATIVE) if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor(nativeSource, key);
        nativeProperty = descriptor && descriptor.value;
      } else nativeProperty = nativeSource[key];

      // export native or implementation
      sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

      if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

      // bind timers to global for call from export context
      if (options.bind && USE_NATIVE) resultProperty = bind(sourceProperty, global$7);
      // wrap global constructors for prevent changs in this version
      else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
      // make static versions for prototype methods
      else if (PROTO && typeof sourceProperty == 'function') resultProperty = bind(Function.call, sourceProperty);
      // default case
      else resultProperty = sourceProperty;

      // add a flag to not completely full polyfills
      if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty$1(resultProperty, 'sham', true);
      }

      target[key] = resultProperty;

      if (PROTO) {
        VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
        if (!has$2(path$6, VIRTUAL_PROTOTYPE)) {
          createNonEnumerableProperty$1(path$6, VIRTUAL_PROTOTYPE, {});
        }
        // export virtual prototype methods
        path$6[VIRTUAL_PROTOTYPE][key] = sourceProperty;
        // export real prototype methods
        if (options.real && targetPrototype && !targetPrototype[key]) {
          createNonEnumerableProperty$1(targetPrototype, key, sourceProperty);
        }
      }
    }
  };

  var $$4 = _export;
  var DESCRIPTORS$1 = descriptors;
  var objectDefinePropertyModile = objectDefineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  $$4({ target: 'Object', stat: true, forced: !DESCRIPTORS$1, sham: !DESCRIPTORS$1 }, {
    defineProperty: objectDefinePropertyModile.f
  });

  var path$5 = path$7;

  var Object$1 = path$5.Object;

  var defineProperty$3 = defineProperty$4.exports = function defineProperty(it, key, desc) {
    return Object$1.defineProperty(it, key, desc);
  };

  if (Object$1.defineProperty.sham) defineProperty$3.sham = true;

  var parent$3 = defineProperty$4.exports;

  var defineProperty$2 = parent$3;

  var defineProperty$1 = defineProperty$2;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      defineProperty$1(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.es/ecma262/#sec-tointeger
  var toInteger$2 = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  var toInteger$1 = toInteger$2;

  var min$1 = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength$2 = function (argument) {
    return argument > 0 ? min$1(toInteger$1(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var toInteger = toInteger$2;

  var max = Math.max;
  var min = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$1 = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min(integer, length);
  };

  var toIndexedObject$1 = toIndexedObject$3;
  var toLength$1 = toLength$2;
  var toAbsoluteIndex = toAbsoluteIndex$1;

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$1($this);
      var length = toLength$1(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare -- NaN check
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  var hiddenKeys$1 = {};

  var has$1 = has$4;
  var toIndexedObject = toIndexedObject$3;
  var indexOf = arrayIncludes.indexOf;
  var hiddenKeys = hiddenKeys$1;

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has$1(hiddenKeys, key) && has$1(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has$1(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys$1 = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var internalObjectKeys = objectKeysInternal;
  var enumBugKeys = enumBugKeys$1;

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys$1 = Object.keys || function keys(O) {
    return internalObjectKeys(O, enumBugKeys);
  };

  var objectGetOwnPropertySymbols = {};

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

  var DESCRIPTORS = descriptors;
  var fails$4 = fails$9;
  var objectKeys = objectKeys$1;
  var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
  var propertyIsEnumerableModule = objectPropertyIsEnumerable;
  var toObject$2 = toObject$4;
  var IndexedObject = indexedObject;

  // eslint-disable-next-line es/no-object-assign -- safe
  var $assign = Object.assign;
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  var defineProperty = Object.defineProperty;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  var objectAssign = !$assign || fails$4(function () {
    // should have correct order of operations (Edge bug)
    if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty(this, 'b', {
          value: 3,
          enumerable: false
        });
      }
    }), { b: 2 })).b !== 1) return true;
    // should work with symbols and should have deterministic property order (V8 bug)
    var A = {};
    var B = {};
    // eslint-disable-next-line es/no-symbol -- safe
    var symbol = Symbol();
    var alphabet = 'abcdefghijklmnopqrst';
    A[symbol] = 7;
    alphabet.split('').forEach(function (chr) { B[chr] = chr; });
    return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
  }) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
    var T = toObject$2(target);
    var argumentsLength = arguments.length;
    var index = 1;
    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    var propertyIsEnumerable = propertyIsEnumerableModule.f;
    while (argumentsLength > index) {
      var S = IndexedObject(arguments[index++]);
      var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
      }
    } return T;
  } : $assign;

  var $$3 = _export;
  var assign$3 = objectAssign;

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  // eslint-disable-next-line es/no-object-assign -- required for testing
  $$3({ target: 'Object', stat: true, forced: Object.assign !== assign$3 }, {
    assign: assign$3
  });

  var path$4 = path$7;

  var assign$2 = path$4.Object.assign;

  var parent$2 = assign$2;

  var assign$1 = parent$2;

  var assign = assign$1;

  var $$2 = _export;
  var toObject$1 = toObject$4;
  var nativeKeys = objectKeys$1;
  var fails$3 = fails$9;

  var FAILS_ON_PRIMITIVES = fails$3(function () { nativeKeys(1); });

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  $$2({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
    keys: function keys(it) {
      return nativeKeys(toObject$1(it));
    }
  });

  var path$3 = path$7;

  var keys$2 = path$3.Object.keys;

  var parent$1 = keys$2;

  var keys$1 = parent$1;

  var keys = keys$1;

  var path$2 = path$7;
  var global$6 = global$9;

  var aFunction = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn$1 = function (namespace, method) {
    return arguments.length < 2 ? aFunction(path$2[namespace]) || aFunction(global$6[namespace])
      : path$2[namespace] && path$2[namespace][method] || global$6[namespace] && global$6[namespace][method];
  };

  var getBuiltIn = getBuiltIn$1;

  var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  var $$1 = _export;
  var global$5 = global$9;
  var userAgent$1 = engineUserAgent;

  var slice = [].slice;
  var MSIE = /MSIE .\./.test(userAgent$1); // <- dirty ie9- check

  var wrap = function (scheduler) {
    return function (handler, timeout /* , ...arguments */) {
      var boundArgs = arguments.length > 2;
      var args = boundArgs ? slice.call(arguments, 2) : undefined;
      return scheduler(boundArgs ? function () {
        // eslint-disable-next-line no-new-func -- spec requirement
        (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
      } : handler, timeout);
    };
  };

  // ie9- setTimeout & setInterval additional parameters fix
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
  $$1({ global: true, bind: true, forced: MSIE }, {
    // `setTimeout` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
    setTimeout: wrap(global$5.setTimeout),
    // `setInterval` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
    setInterval: wrap(global$5.setInterval)
  });

  var path$1 = path$7;

  var setTimeout$1 = path$1.setTimeout;

  var setTimeout = setTimeout$1;

  var classof = classofRaw;

  // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es/no-array-isarray -- safe
  var isArray$2 = Array.isArray || function isArray(arg) {
    return classof(arg) == 'Array';
  };

  var toPrimitive = toPrimitive$3;
  var definePropertyModule = objectDefineProperty;
  var createPropertyDescriptor = createPropertyDescriptor$3;

  var createProperty$1 = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  var shared$1 = {exports: {}};

  var global$4 = global$9;
  var createNonEnumerableProperty = createNonEnumerableProperty$2;

  var setGlobal$1 = function (key, value) {
    try {
      createNonEnumerableProperty(global$4, key, value);
    } catch (error) {
      global$4[key] = value;
    } return value;
  };

  var global$3 = global$9;
  var setGlobal = setGlobal$1;

  var SHARED = '__core-js_shared__';
  var store$1 = global$3[SHARED] || setGlobal(SHARED, {});

  var sharedStore = store$1;

  var store = sharedStore;

  (shared$1.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.15.2',
    mode: 'pure' ,
    copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
  });

  var id = 0;
  var postfix = Math.random();

  var uid$1 = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var global$2 = global$9;
  var userAgent = engineUserAgent;

  var process = global$2.process;
  var versions = process && process.versions;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    version = match[0] < 4 ? 1 : match[0] + match[1];
  } else if (userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  var engineV8Version = version && +version;

  /* eslint-disable es/no-symbol -- required for testing */

  var V8_VERSION$2 = engineV8Version;
  var fails$2 = fails$9;

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$2(function () {
    var symbol = Symbol();
    // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
    return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
      // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
      !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
  });

  /* eslint-disable es/no-symbol -- required for testing */

  var NATIVE_SYMBOL$1 = nativeSymbol;

  var useSymbolAsUid = NATIVE_SYMBOL$1
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var global$1 = global$9;
  var shared = shared$1.exports;
  var has = has$4;
  var uid = uid$1;
  var NATIVE_SYMBOL = nativeSymbol;
  var USE_SYMBOL_AS_UID = useSymbolAsUid;

  var WellKnownSymbolsStore = shared('wks');
  var Symbol$1 = global$1.Symbol;
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

  var wellKnownSymbol$3 = function (name) {
    if (!has(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
      if (NATIVE_SYMBOL && has(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
      }
    } return WellKnownSymbolsStore[name];
  };

  var isObject$1 = isObject$5;
  var isArray$1 = isArray$2;
  var wellKnownSymbol$2 = wellKnownSymbol$3;

  var SPECIES$1 = wellKnownSymbol$2('species');

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.es/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate$1 = function (originalArray, length) {
    var C;
    if (isArray$1(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || isArray$1(C.prototype))) C = undefined;
      else if (isObject$1(C)) {
        C = C[SPECIES$1];
        if (C === null) C = undefined;
      }
    } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  var fails$1 = fails$9;
  var wellKnownSymbol$1 = wellKnownSymbol$3;
  var V8_VERSION$1 = engineV8Version;

  var SPECIES = wellKnownSymbol$1('species');

  var arrayMethodHasSpeciesSupport$1 = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return V8_VERSION$1 >= 51 || !fails$1(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var $ = _export;
  var fails = fails$9;
  var isArray = isArray$2;
  var isObject = isObject$5;
  var toObject = toObject$4;
  var toLength = toLength$2;
  var createProperty = createProperty$1;
  var arraySpeciesCreate = arraySpeciesCreate$1;
  var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$1;
  var wellKnownSymbol = wellKnownSymbol$3;
  var V8_VERSION = engineV8Version;

  var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
  var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679
  var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });

  var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

  var isConcatSpreadable = function (O) {
    if (!isObject(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray(O);
  };

  var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

  // `Array.prototype.concat` method
  // https://tc39.es/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  $({ target: 'Array', proto: true, forced: FORCED }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    concat: function concat(arg) {
      var O = toObject(this);
      var A = arraySpeciesCreate(O, 0);
      var n = 0;
      var i, k, length, len, E;
      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];
        if (isConcatSpreadable(E)) {
          len = toLength(E.length);
          if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
        } else {
          if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
          createProperty(A, n++, E);
        }
      }
      A.length = n;
      return A;
    }
  });

  var path = path$7;

  var entryVirtual$1 = function (CONSTRUCTOR) {
    return path[CONSTRUCTOR + 'Prototype'];
  };

  var entryVirtual = entryVirtual$1;

  var concat$3 = entryVirtual('Array').concat;

  var concat$2 = concat$3;

  var ArrayPrototype = Array.prototype;

  var concat_1 = function (it) {
    var own = it.concat;
    return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.concat) ? concat$2 : own;
  };

  var parent = concat_1;

  var concat$1 = parent;

  var concat = concat$1;

  var setStyle = function setStyle(ele, obj) {
    for (var _i = 0, _Object$keys = keys(obj); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      ele.style[key] = "".concat(obj[key]);
    }
  };

  var getStyle = function getStyle(ele, attr) {
    return document.defaultView.getComputedStyle(ele)[attr];
  };

  var clearBorder = function clearBorder(ele, data) {
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 600;
    setStyle(ele, {
      "borderBottom": "0 solid transparent",
      "transition": "border-bottom ".concat(duration, "ms")
    });

    setTimeout(function () {
      setStyle(ele, {
        "transition": "none"
      });
      data && (data.phase = -1);
    }, duration);
  };

  var clearHeight = function clearHeight(ele, data) {
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 600;
    var color = getStyle(ele, "backgroundColor");
    setStyle(ele, {
      height: "0",
      background: color,
      transition: "height ".concat(duration, "ms")
    });

    setTimeout(function () {
      setStyle(ele, {
        "transition": "none"
      });
      data && (data.phase = -1);
    }, duration);
  };

  var clearLoadingImg = function clearLoadingImg(ele) {
    setStyle(ele, {
      background: "none"
    });
  };

  var setBorder = function setBorder(ele, value) {
    var _context;

    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#f0f0f0";
    setStyle(ele, {
      "borderBottom": concat(_context = "".concat(value, "px solid ")).call(_context, color),
      transition: "none"
    });
  };

  var setHeight = function setHeight(ele, value) {
    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#f0f0f0";
    setStyle(ele, {
      height: "".concat(value, "px"),
      background: color,
      transition: "none"
    });
  };

  var setLoadingImg = function setLoadingImg(ele) {
    var _context2;

    var src = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "./loading.gif";
    var color = getStyle(ele, "backgroundColor");
    setStyle(ele, {
      background: concat(_context2 = "url(".concat(src, ") center/4em no-repeat ")).call(_context2, color)
    });
  };

  var defaultOptions = {
    max: 80,
    bg: "#f0f0f0",
    cb: function cb() {},
    stage1Begin: function stage1Begin() {},
    stage2Begin: function stage2Begin(ele) {
      setLoadingImg(ele);
    },
    stage1End: function stage1End() {},
    stage2End: function stage2End() {
      clearLoadingImg(ele);
    },
    stage2: function stage2() {},
    duration: 250
  };

  var updateDataInStart = function updateDataInStart(data, e, options) {
    data.start = e.touches[0].pageY;
    data.phase === -1 && (data.phase = 0);
  };

  var updateDataInMove = function updateDataInMove(data, e, options) {
    var move = e.touches[0].pageY,
        start = data.start,
        ele = options.ele;
    data.phase === 0 && (data.phase = 1);

    if (data.phase === 1) {
      data.y = move - start;
      data.positive = data.y >= 0;
      data.negative = !data.positive;
      data.top = ele.scrollTop === 0;
      data.bottom = ele.scrollTop + ele.clientHeight === ele.scrollHeight;
    }
  };

  var VLoading = /*#__PURE__*/function () {
    function VLoading(ele, options) {
      _classCallCheck(this, VLoading);

      this.ele = ele;
      this.options = assign(defaultOptions, options, {
        ele: ele
      });
      this.data = {
        top: false,
        // 是否触顶
        bottom: false,
        // 是否触底
        y: 0,
        // 路程位移
        start: 0,
        // 起点位移
        phase: -1 // 0:touchstart, 1:touchmove, 2:touchend/cancel, -1, no events

      };
      this.insertLoading();
      this.init();
    }

    _createClass(VLoading, [{
      key: "insertLoading",
      value: function insertLoading() {
        var loading = this.options.loading;
        if (loading) return;
        var firstNode = this.ele.firstElementChild,
            div = document.createElement("div");
        this.ele.insertBefore(div, firstNode);
        this.options.loading = div;
      }
    }, {
      key: "init",
      value: function init() {
        var _this = this;

        var ele = this.ele,
            data = this.data,
            loading = this.options.loading,
            cb = this.options.cb,
            max = this.options.max,
            bg = this.options.bg,
            duration = this.options.duration,
            stage1Begin = this.options.stage1Begin,
            stage2Begin = this.options.stage2Begin,
            stage1End = this.options.stage1End,
            stage2End = this.options.stage1End;
        ele.addEventListener("touchstart", function (e) {
          updateDataInStart(data, e, _this.options); // if(data.ing)
          //   return;
          // data.move = true;
          // data.start = e.touches[0].pageY;
        });
        ele.addEventListener("touchmove", function (e) {
          updateDataInMove(data, e, _this.options);

          if (data.phase !== 1) {
            e.preventDefault();
            return;
          }

          if (data.top) {
            if (data.positive) e.preventDefault();
            var y = data.y;

            if (y >= max) {
              y = (y - max) / 2;
              stage2Begin(loading);
              setBorder(loading, y, bg);
            } else {
              stage1Begin(loading);
              setHeight(loading, y, bg);
            }
          } // if(!data.move)
          //   return;
          // let move = e.touches[0].pageY,
          //   deltaY = move - data.start;
          // if(ele.scrollTop === 0) {
          //   if(deltaY > 0 || data.ing)
          //     e.preventDefault();
          //   let y = data.y = deltaY
          //   if(y >= max) {
          //     // y = y < (max + 100) ? (y - max) / 4 : (y-max)/2;
          //     y = (y - max) / 2;
          //     stage2Begin(loading);
          //     setBorder(loading, y, bg);
          //   } else {
          //     stage1Begin(loading);
          //     setHeight(loading, y, bg);
          //   }
          // }

        }, {
          passive: false
        });
        ele.addEventListener("touchend", function (e) {
          if (data.phase !== 1) return;
          var y = data.y;
              data.phase;
          data.start = data.y = 0;
          data.phase = 2;

          if (y > max) {
            clearBorder(loading, null, duration);
            cb(function () {
              stage2End(loading);
              clearHeight(loading, data, duration);
            });
          } else {
            stage1End(loading);
            data.phase = -1;
            clearBorder(loading, data, duration);
            clearHeight(loading, data, duration);
          } // let y = data.y,
          //   move = data.move;
          // data.start = data.y = 0;
          // data.move = false;
          // if(!move)
          //   return;
          // if(y > max) {
          //   clearBorder(loading, duration);
          //   cb(() => {stage2End(loading);clearHeight(loading, duration);data.ing = false;});
          // } else {
          //   stage1End(loading);
          //   data.ing = false;
          //   clearBorder(loading, duration);
          //   clearHeight(loading, duration);
          // }

        });
        ele.addEventListener("touchcancel", function (e) {});
      }
    }]);

    return VLoading;
  }();

  return VLoading;

})));
