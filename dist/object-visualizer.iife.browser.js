var ObjectVisualizer = (() => {
  var __defineProperty = Object.defineProperty;
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __markAsModule = (target) => {
    return __defineProperty(target, "__esModule", {value: true});
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defineProperty(target, name, {get: all[name], enumerable: true});
  };

  // src/index.js
  var require_src = __commonJS((exports) => {
    __export(exports, {
      mount: () => mount_default
    });
  });

  // node_modules/vue/dist/vue.esm-browser.js
  function makeMap(str, expectsLowerCase) {
    const map2 = Object.create(null);
    const list = str.split(",");
    for (let i = 0; i < list.length; i++) {
      map2[list[i]] = true;
    }
    return expectsLowerCase ? (val) => !!map2[val.toLowerCase()] : (val) => !!map2[val];
  }
  const PatchFlagNames = {
    [1]: `TEXT`,
    [2]: `CLASS`,
    [4]: `STYLE`,
    [8]: `PROPS`,
    [16]: `FULL_PROPS`,
    [32]: `HYDRATE_EVENTS`,
    [64]: `STABLE_FRAGMENT`,
    [128]: `KEYED_FRAGMENT`,
    [256]: `UNKEYED_FRAGMENT`,
    [1024]: `DYNAMIC_SLOTS`,
    [512]: `NEED_PATCH`,
    [-1]: `HOISTED`,
    [-2]: `BAIL`
  };
  const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl";
  const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
  const range = 2;
  function generateCodeFrame(source, start = 0, end = source.length) {
    const lines = source.split(/\r?\n/);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
      count += lines[i].length + 1;
      if (count >= start) {
        for (let j = i - range; j <= i + range || end > count; j++) {
          if (j < 0 || j >= lines.length)
            continue;
          const line = j + 1;
          res.push(`${line}${" ".repeat(3 - String(line).length)}|  ${lines[j]}`);
          const lineLength = lines[j].length;
          if (j === i) {
            const pad = start - (count - lineLength) + 1;
            const length = Math.max(1, end > count ? lineLength - pad : end - start);
            res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
          } else if (j > i) {
            if (end > count) {
              const length = Math.max(Math.min(end - count, lineLength), 1);
              res.push(`   |  ` + "^".repeat(length));
            }
            count += lineLength + 1;
          }
        }
        break;
      }
    }
    return res.join("\n");
  }
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:(.+)/;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        res += normalizeClass(value[i]) + " ";
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot";
  const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
  const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
  const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
  const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
  const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
  function looseEqual(a, b) {
    if (a === b)
      return true;
    const isObjectA = isObject(a);
    const isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        const isArrayA = isArray(a);
        const isArrayB = isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every((e, i) => looseEqual(e, b[i]));
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime();
        } else if (!isArrayA && !isArrayB) {
          const keysA = Object.keys(a);
          const keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every((key) => looseEqual(a[key], b[key]));
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b);
    } else {
      return false;
    }
  }
  function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
  }
  const toDisplayString = (val) => {
    return val == null ? "" : isObject(val) ? JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (val instanceof Map) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
          entries[`${key} =>`] = val2;
          return entries;
        }, {})
      };
    } else if (val instanceof Set) {
      return {
        [`Set(${val.size})`]: [...val.values()]
      };
    } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
      return String(val);
    }
    return val;
  };
  const EMPTY_OBJ = Object.freeze({});
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const onRE = /^on[^a-z]/;
  const isOn = (key) => onRE.test(key);
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const isArray = Array.isArray;
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isReservedProp = /* @__PURE__ */ makeMap("key,ref,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
  const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  });
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction((str) => {
    return str.replace(hyphenateRE, "-$1").toLowerCase();
  });
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
  const invokeArrayFns = (fns, arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](arg);
    }
  };
  const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      value
    });
  };
  const toNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  function defaultOnError(error) {
    throw error;
  }
  function createCompilerError(code, loc, messages, additionalMessage) {
    const msg = (messages || errorMessages)[code] + (additionalMessage || ``);
    const error = new SyntaxError(String(msg));
    error.code = code;
    error.loc = loc;
    return error;
  }
  const errorMessages = {
    [0]: "Illegal comment.",
    [1]: "CDATA section is allowed only in XML context.",
    [2]: "Duplicate attribute.",
    [3]: "End tag cannot have attributes.",
    [4]: "Illegal '/' in tags.",
    [5]: "Unexpected EOF in tag.",
    [6]: "Unexpected EOF in CDATA section.",
    [7]: "Unexpected EOF in comment.",
    [8]: "Unexpected EOF in script.",
    [9]: "Unexpected EOF in tag.",
    [10]: "Incorrectly closed comment.",
    [11]: "Incorrectly opened comment.",
    [12]: "Illegal tag name. Use '&lt;' to print '<'.",
    [13]: "Attribute value was expected.",
    [14]: "End tag name was expected.",
    [15]: "Whitespace was expected.",
    [16]: "Unexpected '<!--' in comment.",
    [17]: `Attribute name cannot contain U+0022 ("), U+0027 ('), and U+003C (<).`,
    [18]: "Unquoted attribute value cannot contain U+0022 (\"), U+0027 ('), U+003C (<), U+003D (=), and U+0060 (`).",
    [19]: "Attribute name cannot start with '='.",
    [21]: "'<?' is allowed only in XML context.",
    [22]: "Illegal '/' in tags.",
    [23]: "Invalid end tag.",
    [24]: "Element is missing end tag.",
    [25]: "Interpolation end sign was not found.",
    [26]: "End bracket for dynamic directive argument was not found. Note that dynamic directive argument cannot contain spaces.",
    [27]: `v-if/v-else-if is missing expression.`,
    [28]: `v-else/v-else-if has no adjacent v-if.`,
    [29]: `v-for is missing expression.`,
    [30]: `v-for has invalid expression.`,
    [31]: `v-bind is missing expression.`,
    [32]: `v-on is missing expression.`,
    [33]: `Unexpected custom directive on <slot> outlet.`,
    [34]: `Mixed v-slot usage on both the component and nested <template>.When there are multiple named slots, all slots should use <template> syntax to avoid scope ambiguity.`,
    [35]: `Duplicate slot names found. `,
    [36]: `Extraneous children found when component already has explicitly named default slot. These children will be ignored.`,
    [37]: `v-slot can only be used on components or <template> tags.`,
    [38]: `v-model is missing expression.`,
    [39]: `v-model value must be a valid JavaScript member expression.`,
    [40]: `v-model cannot be used on v-for or v-slot scope variables because they are not writable.`,
    [41]: `Error parsing JavaScript expression: `,
    [42]: `<KeepAlive> expects exactly one child component.`,
    [43]: `"prefixIdentifiers" option is not supported in this build of compiler.`,
    [44]: `ES module mode is not supported in this build of compiler.`,
    [45]: `"cacheHandlers" option is only supported when the "prefixIdentifiers" option is enabled.`,
    [46]: `"scopeId" option is only supported in module mode.`
  };
  const FRAGMENT = Symbol(`Fragment`);
  const TELEPORT = Symbol(`Teleport`);
  const SUSPENSE = Symbol(`Suspense`);
  const KEEP_ALIVE = Symbol(`KeepAlive`);
  const BASE_TRANSITION = Symbol(`BaseTransition`);
  const OPEN_BLOCK = Symbol(`openBlock`);
  const CREATE_BLOCK = Symbol(`createBlock`);
  const CREATE_VNODE = Symbol(`createVNode`);
  const CREATE_COMMENT = Symbol(`createCommentVNode`);
  const CREATE_TEXT = Symbol(`createTextVNode`);
  const CREATE_STATIC = Symbol(`createStaticVNode`);
  const RESOLVE_COMPONENT = Symbol(`resolveComponent`);
  const RESOLVE_DYNAMIC_COMPONENT = Symbol(`resolveDynamicComponent`);
  const RESOLVE_DIRECTIVE = Symbol(`resolveDirective`);
  const WITH_DIRECTIVES = Symbol(`withDirectives`);
  const RENDER_LIST = Symbol(`renderList`);
  const RENDER_SLOT = Symbol(`renderSlot`);
  const CREATE_SLOTS = Symbol(`createSlots`);
  const TO_DISPLAY_STRING = Symbol(`toDisplayString`);
  const MERGE_PROPS = Symbol(`mergeProps`);
  const TO_HANDLERS = Symbol(`toHandlers`);
  const CAMELIZE = Symbol(`camelize`);
  const SET_BLOCK_TRACKING = Symbol(`setBlockTracking`);
  const PUSH_SCOPE_ID = Symbol(`pushScopeId`);
  const POP_SCOPE_ID = Symbol(`popScopeId`);
  const WITH_SCOPE_ID = Symbol(`withScopeId`);
  const WITH_CTX = Symbol(`withCtx`);
  const helperNameMap = {
    [FRAGMENT]: `Fragment`,
    [TELEPORT]: `Teleport`,
    [SUSPENSE]: `Suspense`,
    [KEEP_ALIVE]: `KeepAlive`,
    [BASE_TRANSITION]: `BaseTransition`,
    [OPEN_BLOCK]: `openBlock`,
    [CREATE_BLOCK]: `createBlock`,
    [CREATE_VNODE]: `createVNode`,
    [CREATE_COMMENT]: `createCommentVNode`,
    [CREATE_TEXT]: `createTextVNode`,
    [CREATE_STATIC]: `createStaticVNode`,
    [RESOLVE_COMPONENT]: `resolveComponent`,
    [RESOLVE_DYNAMIC_COMPONENT]: `resolveDynamicComponent`,
    [RESOLVE_DIRECTIVE]: `resolveDirective`,
    [WITH_DIRECTIVES]: `withDirectives`,
    [RENDER_LIST]: `renderList`,
    [RENDER_SLOT]: `renderSlot`,
    [CREATE_SLOTS]: `createSlots`,
    [TO_DISPLAY_STRING]: `toDisplayString`,
    [MERGE_PROPS]: `mergeProps`,
    [TO_HANDLERS]: `toHandlers`,
    [CAMELIZE]: `camelize`,
    [SET_BLOCK_TRACKING]: `setBlockTracking`,
    [PUSH_SCOPE_ID]: `pushScopeId`,
    [POP_SCOPE_ID]: `popScopeId`,
    [WITH_SCOPE_ID]: `withScopeId`,
    [WITH_CTX]: `withCtx`
  };
  function registerRuntimeHelpers(helpers) {
    Object.getOwnPropertySymbols(helpers).forEach((s) => {
      helperNameMap[s] = helpers[s];
    });
  }
  const locStub = {
    source: "",
    start: {line: 1, column: 1, offset: 0},
    end: {line: 1, column: 1, offset: 0}
  };
  function createRoot(children, loc = locStub) {
    return {
      type: 0,
      children,
      helpers: [],
      components: [],
      directives: [],
      hoists: [],
      imports: [],
      cached: 0,
      temps: 0,
      codegenNode: void 0,
      loc
    };
  }
  function createVNodeCall(context, tag, props, children, patchFlag, dynamicProps, directives, isBlock = false, disableTracking = false, loc = locStub) {
    if (context) {
      if (isBlock) {
        context.helper(OPEN_BLOCK);
        context.helper(CREATE_BLOCK);
      } else {
        context.helper(CREATE_VNODE);
      }
      if (directives) {
        context.helper(WITH_DIRECTIVES);
      }
    }
    return {
      type: 13,
      tag,
      props,
      children,
      patchFlag,
      dynamicProps,
      directives,
      isBlock,
      disableTracking,
      loc
    };
  }
  function createArrayExpression(elements, loc = locStub) {
    return {
      type: 17,
      loc,
      elements
    };
  }
  function createObjectExpression(properties, loc = locStub) {
    return {
      type: 15,
      loc,
      properties
    };
  }
  function createObjectProperty(key, value) {
    return {
      type: 16,
      loc: locStub,
      key: isString(key) ? createSimpleExpression(key, true) : key,
      value
    };
  }
  function createSimpleExpression(content, isStatic, loc = locStub, isConstant = false) {
    return {
      type: 4,
      loc,
      isConstant,
      content,
      isStatic
    };
  }
  function createCompoundExpression(children, loc = locStub) {
    return {
      type: 8,
      loc,
      children
    };
  }
  function createCallExpression(callee, args = [], loc = locStub) {
    return {
      type: 14,
      loc,
      callee,
      arguments: args
    };
  }
  function createFunctionExpression(params, returns = void 0, newline = false, isSlot = false, loc = locStub) {
    return {
      type: 18,
      params,
      returns,
      newline,
      isSlot,
      loc
    };
  }
  function createConditionalExpression(test, consequent, alternate, newline = true) {
    return {
      type: 19,
      test,
      consequent,
      alternate,
      newline,
      loc: locStub
    };
  }
  function createCacheExpression(index, value, isVNode2 = false) {
    return {
      type: 20,
      index,
      value,
      isVNode: isVNode2,
      loc: locStub
    };
  }
  const isBuiltInType = (tag, expected) => tag === expected || tag === hyphenate(expected);
  function isCoreComponent(tag) {
    if (isBuiltInType(tag, "Teleport")) {
      return TELEPORT;
    } else if (isBuiltInType(tag, "Suspense")) {
      return SUSPENSE;
    } else if (isBuiltInType(tag, "KeepAlive")) {
      return KEEP_ALIVE;
    } else if (isBuiltInType(tag, "BaseTransition")) {
      return BASE_TRANSITION;
    }
  }
  const nonIdentifierRE = /^\d|[^\$\w]/;
  const isSimpleIdentifier = (name) => !nonIdentifierRE.test(name);
  const memberExpRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\[[^\]]+\])*$/;
  const isMemberExpression = (path) => {
    if (!path)
      return false;
    return memberExpRE.test(path.trim());
  };
  function getInnerRange(loc, offset, length) {
    const source = loc.source.substr(offset, length);
    const newLoc = {
      source,
      start: advancePositionWithClone(loc.start, loc.source, offset),
      end: loc.end
    };
    if (length != null) {
      newLoc.end = advancePositionWithClone(loc.start, loc.source, offset + length);
    }
    return newLoc;
  }
  function advancePositionWithClone(pos, source, numberOfCharacters = source.length) {
    return advancePositionWithMutation(extend({}, pos), source, numberOfCharacters);
  }
  function advancePositionWithMutation(pos, source, numberOfCharacters = source.length) {
    let linesCount = 0;
    let lastNewLinePos = -1;
    for (let i = 0; i < numberOfCharacters; i++) {
      if (source.charCodeAt(i) === 10) {
        linesCount++;
        lastNewLinePos = i;
      }
    }
    pos.offset += numberOfCharacters;
    pos.line += linesCount;
    pos.column = lastNewLinePos === -1 ? pos.column + numberOfCharacters : numberOfCharacters - lastNewLinePos;
    return pos;
  }
  function assert(condition, msg) {
    if (!condition) {
      throw new Error(msg || `unexpected compiler condition`);
    }
  }
  function findDir(node, name, allowEmpty = false) {
    for (let i = 0; i < node.props.length; i++) {
      const p2 = node.props[i];
      if (p2.type === 7 && (allowEmpty || p2.exp) && (isString(name) ? p2.name === name : name.test(p2.name))) {
        return p2;
      }
    }
  }
  function findProp(node, name, dynamicOnly = false, allowEmpty = false) {
    for (let i = 0; i < node.props.length; i++) {
      const p2 = node.props[i];
      if (p2.type === 6) {
        if (dynamicOnly)
          continue;
        if (p2.name === name && (p2.value || allowEmpty)) {
          return p2;
        }
      } else if (p2.name === "bind" && p2.exp && isBindKey(p2.arg, name)) {
        return p2;
      }
    }
  }
  function isBindKey(arg, name) {
    return !!(arg && arg.type === 4 && arg.isStatic && arg.content === name);
  }
  function hasDynamicKeyVBind(node) {
    return node.props.some((p2) => p2.type === 7 && p2.name === "bind" && (!p2.arg || p2.arg.type !== 4 || !p2.arg.isStatic));
  }
  function isText(node) {
    return node.type === 5 || node.type === 2;
  }
  function isVSlot(p2) {
    return p2.type === 7 && p2.name === "slot";
  }
  function isTemplateNode(node) {
    return node.type === 1 && node.tagType === 3;
  }
  function isSlotOutlet(node) {
    return node.type === 1 && node.tagType === 2;
  }
  function injectProp(node, prop, context) {
    let propsWithInjection;
    const props = node.type === 13 ? node.props : node.arguments[2];
    if (props == null || isString(props)) {
      propsWithInjection = createObjectExpression([prop]);
    } else if (props.type === 14) {
      const first = props.arguments[0];
      if (!isString(first) && first.type === 15) {
        first.properties.unshift(prop);
      } else {
        props.arguments.unshift(createObjectExpression([prop]));
      }
      propsWithInjection = props;
    } else if (props.type === 15) {
      let alreadyExists = false;
      if (prop.key.type === 4) {
        const propKeyName = prop.key.content;
        alreadyExists = props.properties.some((p2) => p2.key.type === 4 && p2.key.content === propKeyName);
      }
      if (!alreadyExists) {
        props.properties.unshift(prop);
      }
      propsWithInjection = props;
    } else {
      propsWithInjection = createCallExpression(context.helper(MERGE_PROPS), [
        createObjectExpression([prop]),
        props
      ]);
    }
    if (node.type === 13) {
      node.props = propsWithInjection;
    } else {
      node.arguments[2] = propsWithInjection;
    }
  }
  function toValidAssetId(name, type) {
    return `_${type}_${name.replace(/[^\w]/g, "_")}`;
  }
  const decodeRE = /&(gt|lt|amp|apos|quot);/g;
  const decodeMap = {
    gt: ">",
    lt: "<",
    amp: "&",
    apos: "'",
    quot: '"'
  };
  const defaultParserOptions = {
    delimiters: [`{{`, `}}`],
    getNamespace: () => 0,
    getTextMode: () => 0,
    isVoidTag: NO,
    isPreTag: NO,
    isCustomElement: NO,
    decodeEntities: (rawText) => rawText.replace(decodeRE, (_, p1) => decodeMap[p1]),
    onError: defaultOnError
  };
  function baseParse(content, options = {}) {
    const context = createParserContext(content, options);
    const start = getCursor(context);
    return createRoot(parseChildren(context, 0, []), getSelection(context, start));
  }
  function createParserContext(content, options) {
    return {
      options: extend({}, defaultParserOptions, options),
      column: 1,
      line: 1,
      offset: 0,
      originalSource: content,
      source: content,
      inPre: false,
      inVPre: false
    };
  }
  function parseChildren(context, mode, ancestors) {
    const parent = last(ancestors);
    const ns = parent ? parent.ns : 0;
    const nodes = [];
    while (!isEnd(context, mode, ancestors)) {
      const s = context.source;
      let node = void 0;
      if (mode === 0 || mode === 1) {
        if (!context.inVPre && startsWith(s, context.options.delimiters[0])) {
          node = parseInterpolation(context, mode);
        } else if (mode === 0 && s[0] === "<") {
          if (s.length === 1) {
            emitError(context, 5, 1);
          } else if (s[1] === "!") {
            if (startsWith(s, "<!--")) {
              node = parseComment(context);
            } else if (startsWith(s, "<!DOCTYPE")) {
              node = parseBogusComment(context);
            } else if (startsWith(s, "<![CDATA[")) {
              if (ns !== 0) {
                node = parseCDATA(context, ancestors);
              } else {
                emitError(context, 1);
                node = parseBogusComment(context);
              }
            } else {
              emitError(context, 11);
              node = parseBogusComment(context);
            }
          } else if (s[1] === "/") {
            if (s.length === 2) {
              emitError(context, 5, 2);
            } else if (s[2] === ">") {
              emitError(context, 14, 2);
              advanceBy(context, 3);
              continue;
            } else if (/[a-z]/i.test(s[2])) {
              emitError(context, 23);
              parseTag(context, 1, parent);
              continue;
            } else {
              emitError(context, 12, 2);
              node = parseBogusComment(context);
            }
          } else if (/[a-z]/i.test(s[1])) {
            node = parseElement(context, ancestors);
          } else if (s[1] === "?") {
            emitError(context, 21, 1);
            node = parseBogusComment(context);
          } else {
            emitError(context, 12, 1);
          }
        }
      }
      if (!node) {
        node = parseText(context, mode);
      }
      if (isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          pushNode(nodes, node[i]);
        }
      } else {
        pushNode(nodes, node);
      }
    }
    let removedWhitespace = false;
    if (mode !== 2) {
      if (!context.inPre) {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node.type === 2) {
            if (!/[^\t\r\n\f ]/.test(node.content)) {
              const prev = nodes[i - 1];
              const next = nodes[i + 1];
              if (!prev || !next || prev.type === 3 || next.type === 3 || prev.type === 1 && next.type === 1 && /[\r\n]/.test(node.content)) {
                removedWhitespace = true;
                nodes[i] = null;
              } else {
                node.content = " ";
              }
            } else {
              node.content = node.content.replace(/[\t\r\n\f ]+/g, " ");
            }
          }
        }
      } else if (parent && context.options.isPreTag(parent.tag)) {
        const first = nodes[0];
        if (first && first.type === 2) {
          first.content = first.content.replace(/^\r?\n/, "");
        }
      }
    }
    return removedWhitespace ? nodes.filter(Boolean) : nodes;
  }
  function pushNode(nodes, node) {
    if (node.type === 2) {
      const prev = last(nodes);
      if (prev && prev.type === 2 && prev.loc.end.offset === node.loc.start.offset) {
        prev.content += node.content;
        prev.loc.end = node.loc.end;
        prev.loc.source += node.loc.source;
        return;
      }
    }
    nodes.push(node);
  }
  function parseCDATA(context, ancestors) {
    advanceBy(context, 9);
    const nodes = parseChildren(context, 3, ancestors);
    if (context.source.length === 0) {
      emitError(context, 6);
    } else {
      advanceBy(context, 3);
    }
    return nodes;
  }
  function parseComment(context) {
    const start = getCursor(context);
    let content;
    const match = /--(\!)?>/.exec(context.source);
    if (!match) {
      content = context.source.slice(4);
      advanceBy(context, context.source.length);
      emitError(context, 7);
    } else {
      if (match.index <= 3) {
        emitError(context, 0);
      }
      if (match[1]) {
        emitError(context, 10);
      }
      content = context.source.slice(4, match.index);
      const s = context.source.slice(0, match.index);
      let prevIndex = 1, nestedIndex = 0;
      while ((nestedIndex = s.indexOf("<!--", prevIndex)) !== -1) {
        advanceBy(context, nestedIndex - prevIndex + 1);
        if (nestedIndex + 4 < s.length) {
          emitError(context, 16);
        }
        prevIndex = nestedIndex + 1;
      }
      advanceBy(context, match.index + match[0].length - prevIndex + 1);
    }
    return {
      type: 3,
      content,
      loc: getSelection(context, start)
    };
  }
  function parseBogusComment(context) {
    const start = getCursor(context);
    const contentStart = context.source[1] === "?" ? 1 : 2;
    let content;
    const closeIndex = context.source.indexOf(">");
    if (closeIndex === -1) {
      content = context.source.slice(contentStart);
      advanceBy(context, context.source.length);
    } else {
      content = context.source.slice(contentStart, closeIndex);
      advanceBy(context, closeIndex + 1);
    }
    return {
      type: 3,
      content,
      loc: getSelection(context, start)
    };
  }
  function parseElement(context, ancestors) {
    const wasInPre = context.inPre;
    const wasInVPre = context.inVPre;
    const parent = last(ancestors);
    const element = parseTag(context, 0, parent);
    const isPreBoundary = context.inPre && !wasInPre;
    const isVPreBoundary = context.inVPre && !wasInVPre;
    if (element.isSelfClosing || context.options.isVoidTag(element.tag)) {
      return element;
    }
    ancestors.push(element);
    const mode = context.options.getTextMode(element, parent);
    const children = parseChildren(context, mode, ancestors);
    ancestors.pop();
    element.children = children;
    if (startsWithEndTagOpen(context.source, element.tag)) {
      parseTag(context, 1, parent);
    } else {
      emitError(context, 24, 0, element.loc.start);
      if (context.source.length === 0 && element.tag.toLowerCase() === "script") {
        const first = children[0];
        if (first && startsWith(first.loc.source, "<!--")) {
          emitError(context, 8);
        }
      }
    }
    element.loc = getSelection(context, element.loc.start);
    if (isPreBoundary) {
      context.inPre = false;
    }
    if (isVPreBoundary) {
      context.inVPre = false;
    }
    return element;
  }
  const isSpecialTemplateDirective = /* @__PURE__ */ makeMap(`if,else,else-if,for,slot`);
  function parseTag(context, type, parent) {
    const start = getCursor(context);
    const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source);
    const tag = match[1];
    const ns = context.options.getNamespace(tag, parent);
    advanceBy(context, match[0].length);
    advanceSpaces(context);
    const cursor = getCursor(context);
    const currentSource = context.source;
    let props = parseAttributes(context, type);
    if (context.options.isPreTag(tag)) {
      context.inPre = true;
    }
    if (!context.inVPre && props.some((p2) => p2.type === 7 && p2.name === "pre")) {
      context.inVPre = true;
      extend(context, cursor);
      context.source = currentSource;
      props = parseAttributes(context, type).filter((p2) => p2.name !== "v-pre");
    }
    let isSelfClosing = false;
    if (context.source.length === 0) {
      emitError(context, 9);
    } else {
      isSelfClosing = startsWith(context.source, "/>");
      if (type === 1 && isSelfClosing) {
        emitError(context, 4);
      }
      advanceBy(context, isSelfClosing ? 2 : 1);
    }
    let tagType = 0;
    const options = context.options;
    if (!context.inVPre && !options.isCustomElement(tag)) {
      const hasVIs = props.some((p2) => p2.type === 7 && p2.name === "is");
      if (options.isNativeTag && !hasVIs) {
        if (!options.isNativeTag(tag))
          tagType = 1;
      } else if (hasVIs || isCoreComponent(tag) || options.isBuiltInComponent && options.isBuiltInComponent(tag) || /^[A-Z]/.test(tag) || tag === "component") {
        tagType = 1;
      }
      if (tag === "slot") {
        tagType = 2;
      } else if (tag === "template" && props.some((p2) => {
        return p2.type === 7 && isSpecialTemplateDirective(p2.name);
      })) {
        tagType = 3;
      }
    }
    return {
      type: 1,
      ns,
      tag,
      tagType,
      props,
      isSelfClosing,
      children: [],
      loc: getSelection(context, start),
      codegenNode: void 0
    };
  }
  function parseAttributes(context, type) {
    const props = [];
    const attributeNames = new Set();
    while (context.source.length > 0 && !startsWith(context.source, ">") && !startsWith(context.source, "/>")) {
      if (startsWith(context.source, "/")) {
        emitError(context, 22);
        advanceBy(context, 1);
        advanceSpaces(context);
        continue;
      }
      if (type === 1) {
        emitError(context, 3);
      }
      const attr = parseAttribute(context, attributeNames);
      if (type === 0) {
        props.push(attr);
      }
      if (/^[^\t\r\n\f />]/.test(context.source)) {
        emitError(context, 15);
      }
      advanceSpaces(context);
    }
    return props;
  }
  function parseAttribute(context, nameSet) {
    const start = getCursor(context);
    const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source);
    const name = match[0];
    if (nameSet.has(name)) {
      emitError(context, 2);
    }
    nameSet.add(name);
    if (name[0] === "=") {
      emitError(context, 19);
    }
    {
      const pattern = /["'<]/g;
      let m;
      while (m = pattern.exec(name)) {
        emitError(context, 17, m.index);
      }
    }
    advanceBy(context, name.length);
    let value = void 0;
    if (/^[\t\r\n\f ]*=/.test(context.source)) {
      advanceSpaces(context);
      advanceBy(context, 1);
      advanceSpaces(context);
      value = parseAttributeValue(context);
      if (!value) {
        emitError(context, 13);
      }
    }
    const loc = getSelection(context, start);
    if (!context.inVPre && /^(v-|:|@|#)/.test(name)) {
      const match2 = /(?:^v-([a-z0-9-]+))?(?:(?::|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(name);
      const dirName = match2[1] || (startsWith(name, ":") ? "bind" : startsWith(name, "@") ? "on" : "slot");
      let arg;
      if (match2[2]) {
        const isSlot = dirName === "slot";
        const startOffset = name.indexOf(match2[2]);
        const loc2 = getSelection(context, getNewPosition(context, start, startOffset), getNewPosition(context, start, startOffset + match2[2].length + (isSlot && match2[3] || "").length));
        let content = match2[2];
        let isStatic = true;
        if (content.startsWith("[")) {
          isStatic = false;
          if (!content.endsWith("]")) {
            emitError(context, 26);
          }
          content = content.substr(1, content.length - 2);
        } else if (isSlot) {
          content += match2[3] || "";
        }
        arg = {
          type: 4,
          content,
          isStatic,
          isConstant: isStatic,
          loc: loc2
        };
      }
      if (value && value.isQuoted) {
        const valueLoc = value.loc;
        valueLoc.start.offset++;
        valueLoc.start.column++;
        valueLoc.end = advancePositionWithClone(valueLoc.start, value.content);
        valueLoc.source = valueLoc.source.slice(1, -1);
      }
      return {
        type: 7,
        name: dirName,
        exp: value && {
          type: 4,
          content: value.content,
          isStatic: false,
          isConstant: false,
          loc: value.loc
        },
        arg,
        modifiers: match2[3] ? match2[3].substr(1).split(".") : [],
        loc
      };
    }
    return {
      type: 6,
      name,
      value: value && {
        type: 2,
        content: value.content,
        loc: value.loc
      },
      loc
    };
  }
  function parseAttributeValue(context) {
    const start = getCursor(context);
    let content;
    const quote = context.source[0];
    const isQuoted = quote === `"` || quote === `'`;
    if (isQuoted) {
      advanceBy(context, 1);
      const endIndex = context.source.indexOf(quote);
      if (endIndex === -1) {
        content = parseTextData(context, context.source.length, 4);
      } else {
        content = parseTextData(context, endIndex, 4);
        advanceBy(context, 1);
      }
    } else {
      const match = /^[^\t\r\n\f >]+/.exec(context.source);
      if (!match) {
        return void 0;
      }
      const unexpectedChars = /["'<=`]/g;
      let m;
      while (m = unexpectedChars.exec(match[0])) {
        emitError(context, 18, m.index);
      }
      content = parseTextData(context, match[0].length, 4);
    }
    return {content, isQuoted, loc: getSelection(context, start)};
  }
  function parseInterpolation(context, mode) {
    const [open, close] = context.options.delimiters;
    const closeIndex = context.source.indexOf(close, open.length);
    if (closeIndex === -1) {
      emitError(context, 25);
      return void 0;
    }
    const start = getCursor(context);
    advanceBy(context, open.length);
    const innerStart = getCursor(context);
    const innerEnd = getCursor(context);
    const rawContentLength = closeIndex - open.length;
    const rawContent = context.source.slice(0, rawContentLength);
    const preTrimContent = parseTextData(context, rawContentLength, mode);
    const content = preTrimContent.trim();
    const startOffset = preTrimContent.indexOf(content);
    if (startOffset > 0) {
      advancePositionWithMutation(innerStart, rawContent, startOffset);
    }
    const endOffset = rawContentLength - (preTrimContent.length - content.length - startOffset);
    advancePositionWithMutation(innerEnd, rawContent, endOffset);
    advanceBy(context, close.length);
    return {
      type: 5,
      content: {
        type: 4,
        isStatic: false,
        isConstant: false,
        content,
        loc: getSelection(context, innerStart, innerEnd)
      },
      loc: getSelection(context, start)
    };
  }
  function parseText(context, mode) {
    const endTokens = ["<", context.options.delimiters[0]];
    if (mode === 3) {
      endTokens.push("]]>");
    }
    let endIndex = context.source.length;
    for (let i = 0; i < endTokens.length; i++) {
      const index = context.source.indexOf(endTokens[i], 1);
      if (index !== -1 && endIndex > index) {
        endIndex = index;
      }
    }
    const start = getCursor(context);
    const content = parseTextData(context, endIndex, mode);
    return {
      type: 2,
      content,
      loc: getSelection(context, start)
    };
  }
  function parseTextData(context, length, mode) {
    const rawText = context.source.slice(0, length);
    advanceBy(context, length);
    if (mode === 2 || mode === 3 || rawText.indexOf("&") === -1) {
      return rawText;
    } else {
      return context.options.decodeEntities(rawText, mode === 4);
    }
  }
  function getCursor(context) {
    const {column, line, offset} = context;
    return {column, line, offset};
  }
  function getSelection(context, start, end) {
    end = end || getCursor(context);
    return {
      start,
      end,
      source: context.originalSource.slice(start.offset, end.offset)
    };
  }
  function last(xs) {
    return xs[xs.length - 1];
  }
  function startsWith(source, searchString) {
    return source.startsWith(searchString);
  }
  function advanceBy(context, numberOfCharacters) {
    const {source} = context;
    advancePositionWithMutation(context, source, numberOfCharacters);
    context.source = source.slice(numberOfCharacters);
  }
  function advanceSpaces(context) {
    const match = /^[\t\r\n\f ]+/.exec(context.source);
    if (match) {
      advanceBy(context, match[0].length);
    }
  }
  function getNewPosition(context, start, numberOfCharacters) {
    return advancePositionWithClone(start, context.originalSource.slice(start.offset, numberOfCharacters), numberOfCharacters);
  }
  function emitError(context, code, offset, loc = getCursor(context)) {
    if (offset) {
      loc.offset += offset;
      loc.column += offset;
    }
    context.options.onError(createCompilerError(code, {
      start: loc,
      end: loc,
      source: ""
    }));
  }
  function isEnd(context, mode, ancestors) {
    const s = context.source;
    switch (mode) {
      case 0:
        if (startsWith(s, "</")) {
          for (let i = ancestors.length - 1; i >= 0; --i) {
            if (startsWithEndTagOpen(s, ancestors[i].tag)) {
              return true;
            }
          }
        }
        break;
      case 1:
      case 2: {
        const parent = last(ancestors);
        if (parent && startsWithEndTagOpen(s, parent.tag)) {
          return true;
        }
        break;
      }
      case 3:
        if (startsWith(s, "]]>")) {
          return true;
        }
        break;
    }
    return !s;
  }
  function startsWithEndTagOpen(source, tag) {
    return startsWith(source, "</") && source.substr(2, tag.length).toLowerCase() === tag.toLowerCase() && /[\t\r\n\f />]/.test(source[2 + tag.length] || ">");
  }
  function hoistStatic(root, context) {
    walk(root, context, new Map(), isSingleElementRoot(root, root.children[0]));
  }
  function isSingleElementRoot(root, child) {
    const {children} = root;
    return children.length === 1 && child.type === 1 && !isSlotOutlet(child);
  }
  function walk(node, context, resultCache, doNotHoistNode = false) {
    let hasHoistedNode = false;
    let hasRuntimeConstant = false;
    const {children} = node;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === 1 && child.tagType === 0) {
        let staticType;
        if (!doNotHoistNode && (staticType = getStaticType(child, resultCache)) > 0) {
          if (staticType === 2) {
            hasRuntimeConstant = true;
          }
          child.codegenNode.patchFlag = -1 + ` /* HOISTED */`;
          child.codegenNode = context.hoist(child.codegenNode);
          hasHoistedNode = true;
          continue;
        } else {
          const codegenNode = child.codegenNode;
          if (codegenNode.type === 13) {
            const flag = getPatchFlag(codegenNode);
            if ((!flag || flag === 512 || flag === 1) && !hasDynamicKeyOrRef(child) && !hasCachedProps()) {
              const props = getNodeProps(child);
              if (props) {
                codegenNode.props = context.hoist(props);
              }
            }
          }
        }
      } else if (child.type === 12) {
        const staticType = getStaticType(child.content, resultCache);
        if (staticType > 0) {
          if (staticType === 2) {
            hasRuntimeConstant = true;
          }
          child.codegenNode = context.hoist(child.codegenNode);
          hasHoistedNode = true;
        }
      }
      if (child.type === 1) {
        walk(child, context, resultCache);
      } else if (child.type === 11) {
        walk(child, context, resultCache, child.children.length === 1);
      } else if (child.type === 9) {
        for (let i2 = 0; i2 < child.branches.length; i2++) {
          walk(child.branches[i2], context, resultCache, child.branches[i2].children.length === 1);
        }
      }
    }
    if (!hasRuntimeConstant && hasHoistedNode && context.transformHoist) {
      context.transformHoist(children, context, node);
    }
  }
  function getStaticType(node, resultCache = new Map()) {
    switch (node.type) {
      case 1:
        if (node.tagType !== 0) {
          return 0;
        }
        const cached = resultCache.get(node);
        if (cached !== void 0) {
          return cached;
        }
        const codegenNode = node.codegenNode;
        if (codegenNode.type !== 13) {
          return 0;
        }
        const flag = getPatchFlag(codegenNode);
        if (!flag && !hasDynamicKeyOrRef(node) && !hasCachedProps()) {
          let returnType2 = 1;
          for (let i = 0; i < node.children.length; i++) {
            const childType = getStaticType(node.children[i], resultCache);
            if (childType === 0) {
              resultCache.set(node, 0);
              return 0;
            } else if (childType === 2) {
              returnType2 = 2;
            }
          }
          if (returnType2 !== 2) {
            for (let i = 0; i < node.props.length; i++) {
              const p2 = node.props[i];
              if (p2.type === 7 && p2.name === "bind" && p2.exp && (p2.exp.type === 8 || p2.exp.isRuntimeConstant)) {
                returnType2 = 2;
              }
            }
          }
          if (codegenNode.isBlock) {
            codegenNode.isBlock = false;
          }
          resultCache.set(node, returnType2);
          return returnType2;
        } else {
          resultCache.set(node, 0);
          return 0;
        }
      case 2:
      case 3:
        return 1;
      case 9:
      case 11:
      case 10:
        return 0;
      case 5:
      case 12:
        return getStaticType(node.content, resultCache);
      case 4:
        return node.isConstant ? node.isRuntimeConstant ? 2 : 1 : 0;
      case 8:
        let returnType = 1;
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          if (isString(child) || isSymbol(child)) {
            continue;
          }
          const childType = getStaticType(child, resultCache);
          if (childType === 0) {
            return 0;
          } else if (childType === 2) {
            returnType = 2;
          }
        }
        return returnType;
      default:
        return 0;
    }
  }
  function hasDynamicKeyOrRef(node) {
    return !!(findProp(node, "key", true) || findProp(node, "ref", true));
  }
  function hasCachedProps(node) {
    {
      return false;
    }
  }
  function getNodeProps(node) {
    const codegenNode = node.codegenNode;
    if (codegenNode.type === 13) {
      return codegenNode.props;
    }
  }
  function getPatchFlag(node) {
    const flag = node.patchFlag;
    return flag ? parseInt(flag, 10) : void 0;
  }
  function createTransformContext(root, {prefixIdentifiers = false, hoistStatic: hoistStatic2 = false, cacheHandlers = false, nodeTransforms = [], directiveTransforms = {}, transformHoist = null, isBuiltInComponent = NOOP, expressionPlugins = [], scopeId = null, ssr = false, onError = defaultOnError}) {
    const context = {
      prefixIdentifiers,
      hoistStatic: hoistStatic2,
      cacheHandlers,
      nodeTransforms,
      directiveTransforms,
      transformHoist,
      isBuiltInComponent,
      expressionPlugins,
      scopeId,
      ssr,
      onError,
      root,
      helpers: new Set(),
      components: new Set(),
      directives: new Set(),
      hoists: [],
      imports: new Set(),
      temps: 0,
      cached: 0,
      identifiers: {},
      scopes: {
        vFor: 0,
        vSlot: 0,
        vPre: 0,
        vOnce: 0
      },
      parent: null,
      currentNode: root,
      childIndex: 0,
      helper(name) {
        context.helpers.add(name);
        return name;
      },
      helperString(name) {
        return `_${helperNameMap[context.helper(name)]}`;
      },
      replaceNode(node) {
        {
          if (!context.currentNode) {
            throw new Error(`Node being replaced is already removed.`);
          }
          if (!context.parent) {
            throw new Error(`Cannot replace root node.`);
          }
        }
        context.parent.children[context.childIndex] = context.currentNode = node;
      },
      removeNode(node) {
        if (!context.parent) {
          throw new Error(`Cannot remove root node.`);
        }
        const list = context.parent.children;
        const removalIndex = node ? list.indexOf(node) : context.currentNode ? context.childIndex : -1;
        if (removalIndex < 0) {
          throw new Error(`node being removed is not a child of current parent`);
        }
        if (!node || node === context.currentNode) {
          context.currentNode = null;
          context.onNodeRemoved();
        } else {
          if (context.childIndex > removalIndex) {
            context.childIndex--;
            context.onNodeRemoved();
          }
        }
        context.parent.children.splice(removalIndex, 1);
      },
      onNodeRemoved: () => {
      },
      addIdentifiers(exp) {
      },
      removeIdentifiers(exp) {
      },
      hoist(exp) {
        context.hoists.push(exp);
        const identifier = createSimpleExpression(`_hoisted_${context.hoists.length}`, false, exp.loc, true);
        identifier.hoisted = exp;
        return identifier;
      },
      cache(exp, isVNode2 = false) {
        return createCacheExpression(++context.cached, exp, isVNode2);
      }
    };
    return context;
  }
  function transform(root, options) {
    const context = createTransformContext(root, options);
    traverseNode(root, context);
    if (options.hoistStatic) {
      hoistStatic(root, context);
    }
    if (!options.ssr) {
      createRootCodegen(root, context);
    }
    root.helpers = [...context.helpers];
    root.components = [...context.components];
    root.directives = [...context.directives];
    root.imports = [...context.imports];
    root.hoists = context.hoists;
    root.temps = context.temps;
    root.cached = context.cached;
  }
  function createRootCodegen(root, context) {
    const {helper} = context;
    const {children} = root;
    const child = children[0];
    if (children.length === 1) {
      if (isSingleElementRoot(root, child) && child.codegenNode) {
        const codegenNode = child.codegenNode;
        if (codegenNode.type === 13) {
          codegenNode.isBlock = true;
          helper(OPEN_BLOCK);
          helper(CREATE_BLOCK);
        }
        root.codegenNode = codegenNode;
      } else {
        root.codegenNode = child;
      }
    } else if (children.length > 1) {
      root.codegenNode = createVNodeCall(context, helper(FRAGMENT), void 0, root.children, `${64} /* ${PatchFlagNames[64]} */`, void 0, void 0, true);
    }
  }
  function traverseChildren(parent, context) {
    let i = 0;
    const nodeRemoved = () => {
      i--;
    };
    for (; i < parent.children.length; i++) {
      const child = parent.children[i];
      if (isString(child))
        continue;
      context.parent = parent;
      context.childIndex = i;
      context.onNodeRemoved = nodeRemoved;
      traverseNode(child, context);
    }
  }
  function traverseNode(node, context) {
    context.currentNode = node;
    const {nodeTransforms} = context;
    const exitFns = [];
    for (let i2 = 0; i2 < nodeTransforms.length; i2++) {
      const onExit = nodeTransforms[i2](node, context);
      if (onExit) {
        if (isArray(onExit)) {
          exitFns.push(...onExit);
        } else {
          exitFns.push(onExit);
        }
      }
      if (!context.currentNode) {
        return;
      } else {
        node = context.currentNode;
      }
    }
    switch (node.type) {
      case 3:
        if (!context.ssr) {
          context.helper(CREATE_COMMENT);
        }
        break;
      case 5:
        if (!context.ssr) {
          context.helper(TO_DISPLAY_STRING);
        }
        break;
      case 9:
        for (let i2 = 0; i2 < node.branches.length; i2++) {
          traverseNode(node.branches[i2], context);
        }
        break;
      case 10:
      case 11:
      case 1:
      case 0:
        traverseChildren(node, context);
        break;
    }
    let i = exitFns.length;
    while (i--) {
      exitFns[i]();
    }
  }
  function createStructuralDirectiveTransform(name, fn) {
    const matches2 = isString(name) ? (n) => n === name : (n) => name.test(n);
    return (node, context) => {
      if (node.type === 1) {
        const {props} = node;
        if (node.tagType === 3 && props.some(isVSlot)) {
          return;
        }
        const exitFns = [];
        for (let i = 0; i < props.length; i++) {
          const prop = props[i];
          if (prop.type === 7 && matches2(prop.name)) {
            props.splice(i, 1);
            i--;
            const onExit = fn(node, prop, context);
            if (onExit)
              exitFns.push(onExit);
          }
        }
        return exitFns;
      }
    };
  }
  const PURE_ANNOTATION = `/*#__PURE__*/`;
  function createCodegenContext(ast, {mode = "function", prefixIdentifiers = mode === "module", sourceMap = false, filename = `template.vue.html`, scopeId = null, optimizeBindings = false, runtimeGlobalName = `Vue`, runtimeModuleName = `vue`, ssr = false}) {
    const context = {
      mode,
      prefixIdentifiers,
      sourceMap,
      filename,
      scopeId,
      optimizeBindings,
      runtimeGlobalName,
      runtimeModuleName,
      ssr,
      source: ast.loc.source,
      code: ``,
      column: 1,
      line: 1,
      offset: 0,
      indentLevel: 0,
      pure: false,
      map: void 0,
      helper(key) {
        return `_${helperNameMap[key]}`;
      },
      push(code, node) {
        context.code += code;
      },
      indent() {
        newline(++context.indentLevel);
      },
      deindent(withoutNewLine = false) {
        if (withoutNewLine) {
          --context.indentLevel;
        } else {
          newline(--context.indentLevel);
        }
      },
      newline() {
        newline(context.indentLevel);
      }
    };
    function newline(n) {
      context.push("\n" + `  `.repeat(n));
    }
    return context;
  }
  function generate(ast, options = {}) {
    const context = createCodegenContext(ast, options);
    const {mode, push, prefixIdentifiers, indent, deindent, newline, scopeId, ssr} = context;
    const hasHelpers = ast.helpers.length > 0;
    const useWithBlock = !prefixIdentifiers && mode !== "module";
    {
      genFunctionPreamble(ast, context);
    }
    if (!ssr) {
      push(`function render(_ctx, _cache) {`);
    } else {
      push(`function ssrRender(_ctx, _push, _parent, _attrs) {`);
    }
    indent();
    if (useWithBlock) {
      push(`with (_ctx) {`);
      indent();
      if (hasHelpers) {
        push(`const { ${ast.helpers.map((s) => `${helperNameMap[s]}: _${helperNameMap[s]}`).join(", ")} } = _Vue`);
        push(`
`);
        newline();
      }
    }
    if (ast.components.length) {
      genAssets(ast.components, "component", context);
      if (ast.directives.length || ast.temps > 0) {
        newline();
      }
    }
    if (ast.directives.length) {
      genAssets(ast.directives, "directive", context);
      if (ast.temps > 0) {
        newline();
      }
    }
    if (ast.temps > 0) {
      push(`let `);
      for (let i = 0; i < ast.temps; i++) {
        push(`${i > 0 ? `, ` : ``}_temp${i}`);
      }
    }
    if (ast.components.length || ast.directives.length || ast.temps) {
      push(`
`);
      newline();
    }
    if (!ssr) {
      push(`return `);
    }
    if (ast.codegenNode) {
      genNode(ast.codegenNode, context);
    } else {
      push(`null`);
    }
    if (useWithBlock) {
      deindent();
      push(`}`);
    }
    deindent();
    push(`}`);
    return {
      ast,
      code: context.code,
      map: context.map ? context.map.toJSON() : void 0
    };
  }
  function genFunctionPreamble(ast, context) {
    const {ssr, prefixIdentifiers, push, newline, runtimeModuleName, runtimeGlobalName} = context;
    const VueBinding = runtimeGlobalName;
    const aliasHelper = (s) => `${helperNameMap[s]}: _${helperNameMap[s]}`;
    if (ast.helpers.length > 0) {
      {
        push(`const _Vue = ${VueBinding}
`);
        if (ast.hoists.length) {
          const staticHelpers = [
            CREATE_VNODE,
            CREATE_COMMENT,
            CREATE_TEXT,
            CREATE_STATIC
          ].filter((helper) => ast.helpers.includes(helper)).map(aliasHelper).join(", ");
          push(`const { ${staticHelpers} } = _Vue
`);
        }
      }
    }
    genHoists(ast.hoists, context);
    newline();
    push(`return `);
  }
  function genAssets(assets, type, {helper, push, newline}) {
    const resolver = helper(type === "component" ? RESOLVE_COMPONENT : RESOLVE_DIRECTIVE);
    for (let i = 0; i < assets.length; i++) {
      const id = assets[i];
      push(`const ${toValidAssetId(id, type)} = ${resolver}(${JSON.stringify(id)})`);
      if (i < assets.length - 1) {
        newline();
      }
    }
  }
  function genHoists(hoists, context) {
    if (!hoists.length) {
      return;
    }
    context.pure = true;
    const {push, newline, helper, scopeId, mode} = context;
    newline();
    hoists.forEach((exp, i) => {
      if (exp) {
        push(`const _hoisted_${i + 1} = `);
        genNode(exp, context);
        newline();
      }
    });
    context.pure = false;
  }
  function isText$1(n) {
    return isString(n) || n.type === 4 || n.type === 2 || n.type === 5 || n.type === 8;
  }
  function genNodeListAsArray(nodes, context) {
    const multilines = nodes.length > 3 || nodes.some((n) => isArray(n) || !isText$1(n));
    context.push(`[`);
    multilines && context.indent();
    genNodeList(nodes, context, multilines);
    multilines && context.deindent();
    context.push(`]`);
  }
  function genNodeList(nodes, context, multilines = false, comma = true) {
    const {push, newline} = context;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (isString(node)) {
        push(node);
      } else if (isArray(node)) {
        genNodeListAsArray(node, context);
      } else {
        genNode(node, context);
      }
      if (i < nodes.length - 1) {
        if (multilines) {
          comma && push(",");
          newline();
        } else {
          comma && push(", ");
        }
      }
    }
  }
  function genNode(node, context) {
    if (isString(node)) {
      context.push(node);
      return;
    }
    if (isSymbol(node)) {
      context.push(context.helper(node));
      return;
    }
    switch (node.type) {
      case 1:
      case 9:
      case 11:
        assert(node.codegenNode != null, `Codegen node is missing for element/if/for node. Apply appropriate transforms first.`);
        genNode(node.codegenNode, context);
        break;
      case 2:
        genText(node, context);
        break;
      case 4:
        genExpression(node, context);
        break;
      case 5:
        genInterpolation(node, context);
        break;
      case 12:
        genNode(node.codegenNode, context);
        break;
      case 8:
        genCompoundExpression(node, context);
        break;
      case 3:
        genComment(node, context);
        break;
      case 13:
        genVNodeCall(node, context);
        break;
      case 14:
        genCallExpression(node, context);
        break;
      case 15:
        genObjectExpression(node, context);
        break;
      case 17:
        genArrayExpression(node, context);
        break;
      case 18:
        genFunctionExpression(node, context);
        break;
      case 19:
        genConditionalExpression(node, context);
        break;
      case 20:
        genCacheExpression(node, context);
        break;
      case 21:
        break;
      case 22:
        break;
      case 23:
        break;
      case 24:
        break;
      case 25:
        break;
      case 26:
        break;
      case 10:
        break;
      default: {
        assert(false, `unhandled codegen node type: ${node.type}`);
        const exhaustiveCheck = node;
        return exhaustiveCheck;
      }
    }
  }
  function genText(node, context) {
    context.push(JSON.stringify(node.content), node);
  }
  function genExpression(node, context) {
    const {content, isStatic} = node;
    context.push(isStatic ? JSON.stringify(content) : content, node);
  }
  function genInterpolation(node, context) {
    const {push, helper, pure} = context;
    if (pure)
      push(PURE_ANNOTATION);
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(`)`);
  }
  function genCompoundExpression(node, context) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (isString(child)) {
        context.push(child);
      } else {
        genNode(child, context);
      }
    }
  }
  function genExpressionAsPropertyKey(node, context) {
    const {push} = context;
    if (node.type === 8) {
      push(`[`);
      genCompoundExpression(node, context);
      push(`]`);
    } else if (node.isStatic) {
      const text = isSimpleIdentifier(node.content) ? node.content : JSON.stringify(node.content);
      push(text, node);
    } else {
      push(`[${node.content}]`, node);
    }
  }
  function genComment(node, context) {
    {
      const {push, helper, pure} = context;
      if (pure) {
        push(PURE_ANNOTATION);
      }
      push(`${helper(CREATE_COMMENT)}(${JSON.stringify(node.content)})`, node);
    }
  }
  function genVNodeCall(node, context) {
    const {push, helper, pure} = context;
    const {tag, props, children, patchFlag, dynamicProps, directives, isBlock, disableTracking} = node;
    if (directives) {
      push(helper(WITH_DIRECTIVES) + `(`);
    }
    if (isBlock) {
      push(`(${helper(OPEN_BLOCK)}(${disableTracking ? `true` : ``}), `);
    }
    if (pure) {
      push(PURE_ANNOTATION);
    }
    push(helper(isBlock ? CREATE_BLOCK : CREATE_VNODE) + `(`, node);
    genNodeList(genNullableArgs([tag, props, children, patchFlag, dynamicProps]), context);
    push(`)`);
    if (isBlock) {
      push(`)`);
    }
    if (directives) {
      push(`, `);
      genNode(directives, context);
      push(`)`);
    }
  }
  function genNullableArgs(args) {
    let i = args.length;
    while (i--) {
      if (args[i] != null)
        break;
    }
    return args.slice(0, i + 1).map((arg) => arg || `null`);
  }
  function genCallExpression(node, context) {
    const {push, helper, pure} = context;
    const callee = isString(node.callee) ? node.callee : helper(node.callee);
    if (pure) {
      push(PURE_ANNOTATION);
    }
    push(callee + `(`, node);
    genNodeList(node.arguments, context);
    push(`)`);
  }
  function genObjectExpression(node, context) {
    const {push, indent, deindent, newline} = context;
    const {properties} = node;
    if (!properties.length) {
      push(`{}`, node);
      return;
    }
    const multilines = properties.length > 1 || properties.some((p2) => p2.value.type !== 4);
    push(multilines ? `{` : `{ `);
    multilines && indent();
    for (let i = 0; i < properties.length; i++) {
      const {key, value} = properties[i];
      genExpressionAsPropertyKey(key, context);
      push(`: `);
      genNode(value, context);
      if (i < properties.length - 1) {
        push(`,`);
        newline();
      }
    }
    multilines && deindent();
    push(multilines ? `}` : ` }`);
  }
  function genArrayExpression(node, context) {
    genNodeListAsArray(node.elements, context);
  }
  function genFunctionExpression(node, context) {
    const {push, indent, deindent, scopeId, mode} = context;
    const {params, returns, body, newline, isSlot} = node;
    if (isSlot) {
      push(`_${helperNameMap[WITH_CTX]}(`);
    }
    push(`(`, node);
    if (isArray(params)) {
      genNodeList(params, context);
    } else if (params) {
      genNode(params, context);
    }
    push(`) => `);
    if (newline || body) {
      push(`{`);
      indent();
    }
    if (returns) {
      if (newline) {
        push(`return `);
      }
      if (isArray(returns)) {
        genNodeListAsArray(returns, context);
      } else {
        genNode(returns, context);
      }
    } else if (body) {
      genNode(body, context);
    }
    if (newline || body) {
      deindent();
      push(`}`);
    }
    if (isSlot) {
      push(`)`);
    }
  }
  function genConditionalExpression(node, context) {
    const {test, consequent, alternate, newline: needNewline} = node;
    const {push, indent, deindent, newline} = context;
    if (test.type === 4) {
      const needsParens = !isSimpleIdentifier(test.content);
      needsParens && push(`(`);
      genExpression(test, context);
      needsParens && push(`)`);
    } else {
      push(`(`);
      genNode(test, context);
      push(`)`);
    }
    needNewline && indent();
    context.indentLevel++;
    needNewline || push(` `);
    push(`? `);
    genNode(consequent, context);
    context.indentLevel--;
    needNewline && newline();
    needNewline || push(` `);
    push(`: `);
    const isNested = alternate.type === 19;
    if (!isNested) {
      context.indentLevel++;
    }
    genNode(alternate, context);
    if (!isNested) {
      context.indentLevel--;
    }
    needNewline && deindent(true);
  }
  function genCacheExpression(node, context) {
    const {push, helper, indent, deindent, newline} = context;
    push(`_cache[${node.index}] || (`);
    if (node.isVNode) {
      indent();
      push(`${helper(SET_BLOCK_TRACKING)}(-1),`);
      newline();
    }
    push(`_cache[${node.index}] = `);
    genNode(node.value, context);
    if (node.isVNode) {
      push(`,`);
      newline();
      push(`${helper(SET_BLOCK_TRACKING)}(1),`);
      newline();
      push(`_cache[${node.index}]`);
      deindent();
    }
    push(`)`);
  }
  const prohibitedKeywordRE = new RegExp("\\b" + "do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments,typeof,void".split(",").join("\\b|\\b") + "\\b");
  const stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;
  function validateBrowserExpression(node, context, asParams = false, asRawStatements = false) {
    const exp = node.content;
    if (!exp.trim()) {
      return;
    }
    try {
      new Function(asRawStatements ? ` ${exp} ` : `return ${asParams ? `(${exp}) => {}` : `(${exp})`}`);
    } catch (e) {
      let message = e.message;
      const keywordMatch = exp.replace(stripStringRE, "").match(prohibitedKeywordRE);
      if (keywordMatch) {
        message = `avoid using JavaScript keyword as property name: "${keywordMatch[0]}"`;
      }
      context.onError(createCompilerError(41, node.loc, void 0, message));
    }
  }
  const transformExpression = (node, context) => {
    if (node.type === 5) {
      node.content = processExpression(node.content, context);
    } else if (node.type === 1) {
      for (let i = 0; i < node.props.length; i++) {
        const dir = node.props[i];
        if (dir.type === 7 && dir.name !== "for") {
          const exp = dir.exp;
          const arg = dir.arg;
          if (exp && exp.type === 4 && !(dir.name === "on" && arg)) {
            dir.exp = processExpression(exp, context, dir.name === "slot");
          }
          if (arg && arg.type === 4 && !arg.isStatic) {
            dir.arg = processExpression(arg, context);
          }
        }
      }
    }
  };
  function processExpression(node, context, asParams = false, asRawStatements = false) {
    {
      validateBrowserExpression(node, context, asParams, asRawStatements);
      return node;
    }
  }
  const transformIf = createStructuralDirectiveTransform(/^(if|else|else-if)$/, (node, dir, context) => {
    return processIf(node, dir, context, (ifNode, branch, isRoot) => {
      return () => {
        if (isRoot) {
          ifNode.codegenNode = createCodegenNodeForBranch(branch, 0, context);
        } else {
          let parentCondition = ifNode.codegenNode;
          while (parentCondition.alternate.type === 19) {
            parentCondition = parentCondition.alternate;
          }
          parentCondition.alternate = createCodegenNodeForBranch(branch, ifNode.branches.length - 1, context);
        }
      };
    });
  });
  function processIf(node, dir, context, processCodegen) {
    if (dir.name !== "else" && (!dir.exp || !dir.exp.content.trim())) {
      const loc = dir.exp ? dir.exp.loc : node.loc;
      context.onError(createCompilerError(27, dir.loc));
      dir.exp = createSimpleExpression(`true`, false, loc);
    }
    if (dir.exp) {
      validateBrowserExpression(dir.exp, context);
    }
    if (dir.name === "if") {
      const branch = createIfBranch(node, dir);
      const ifNode = {
        type: 9,
        loc: node.loc,
        branches: [branch]
      };
      context.replaceNode(ifNode);
      if (processCodegen) {
        return processCodegen(ifNode, branch, true);
      }
    } else {
      const siblings = context.parent.children;
      const comments = [];
      let i = siblings.indexOf(node);
      while (i-- >= -1) {
        const sibling = siblings[i];
        if (sibling && sibling.type === 3) {
          context.removeNode(sibling);
          comments.unshift(sibling);
          continue;
        }
        if (sibling && sibling.type === 9) {
          context.removeNode();
          const branch = createIfBranch(node, dir);
          if (comments.length) {
            branch.children = [...comments, ...branch.children];
          }
          sibling.branches.push(branch);
          const onExit = processCodegen && processCodegen(sibling, branch, false);
          traverseNode(branch, context);
          if (onExit)
            onExit();
          context.currentNode = null;
        } else {
          context.onError(createCompilerError(28, node.loc));
        }
        break;
      }
    }
  }
  function createIfBranch(node, dir) {
    return {
      type: 10,
      loc: node.loc,
      condition: dir.name === "else" ? void 0 : dir.exp,
      children: node.tagType === 3 ? node.children : [node]
    };
  }
  function createCodegenNodeForBranch(branch, index, context) {
    if (branch.condition) {
      return createConditionalExpression(branch.condition, createChildrenCodegenNode(branch, index, context), createCallExpression(context.helper(CREATE_COMMENT), [
        '"v-if"',
        "true"
      ]));
    } else {
      return createChildrenCodegenNode(branch, index, context);
    }
  }
  function createChildrenCodegenNode(branch, index, context) {
    const {helper} = context;
    const keyProperty = createObjectProperty(`key`, createSimpleExpression(index + "", false));
    const {children} = branch;
    const firstChild = children[0];
    const needFragmentWrapper = children.length !== 1 || firstChild.type !== 1;
    if (needFragmentWrapper) {
      if (children.length === 1 && firstChild.type === 11) {
        const vnodeCall = firstChild.codegenNode;
        injectProp(vnodeCall, keyProperty, context);
        return vnodeCall;
      } else {
        return createVNodeCall(context, helper(FRAGMENT), createObjectExpression([keyProperty]), children, `${64} /* ${PatchFlagNames[64]} */`, void 0, void 0, true, false, branch.loc);
      }
    } else {
      const vnodeCall = firstChild.codegenNode;
      if (vnodeCall.type === 13 && (firstChild.tagType !== 1 || vnodeCall.tag === TELEPORT)) {
        vnodeCall.isBlock = true;
        helper(OPEN_BLOCK);
        helper(CREATE_BLOCK);
      }
      injectProp(vnodeCall, keyProperty, context);
      return vnodeCall;
    }
  }
  const transformFor = createStructuralDirectiveTransform("for", (node, dir, context) => {
    const {helper} = context;
    return processFor(node, dir, context, (forNode) => {
      const renderExp = createCallExpression(helper(RENDER_LIST), [
        forNode.source
      ]);
      const keyProp = findProp(node, `key`);
      const isStableFragment = forNode.source.type === 4 && forNode.source.isConstant;
      const fragmentFlag = isStableFragment ? 64 : keyProp ? 128 : 256;
      forNode.codegenNode = createVNodeCall(context, helper(FRAGMENT), void 0, renderExp, `${fragmentFlag} /* ${PatchFlagNames[fragmentFlag]} */`, void 0, void 0, true, !isStableFragment, node.loc);
      return () => {
        let childBlock;
        const isTemplate = isTemplateNode(node);
        const {children} = forNode;
        const needFragmentWrapper = children.length > 1 || children[0].type !== 1;
        const slotOutlet = isSlotOutlet(node) ? node : isTemplate && node.children.length === 1 && isSlotOutlet(node.children[0]) ? node.children[0] : null;
        const keyProperty = keyProp ? createObjectProperty(`key`, keyProp.type === 6 ? createSimpleExpression(keyProp.value.content, true) : keyProp.exp) : null;
        if (slotOutlet) {
          childBlock = slotOutlet.codegenNode;
          if (isTemplate && keyProperty) {
            injectProp(childBlock, keyProperty, context);
          }
        } else if (needFragmentWrapper) {
          childBlock = createVNodeCall(context, helper(FRAGMENT), keyProperty ? createObjectExpression([keyProperty]) : void 0, node.children, `${64} /* ${PatchFlagNames[64]} */`, void 0, void 0, true);
        } else {
          childBlock = children[0].codegenNode;
          childBlock.isBlock = !isStableFragment;
          if (childBlock.isBlock) {
            helper(OPEN_BLOCK);
            helper(CREATE_BLOCK);
          }
        }
        renderExp.arguments.push(createFunctionExpression(createForLoopParams(forNode.parseResult), childBlock, true));
      };
    });
  });
  function processFor(node, dir, context, processCodegen) {
    if (!dir.exp) {
      context.onError(createCompilerError(29, dir.loc));
      return;
    }
    const parseResult = parseForExpression(dir.exp, context);
    if (!parseResult) {
      context.onError(createCompilerError(30, dir.loc));
      return;
    }
    const {addIdentifiers, removeIdentifiers, scopes} = context;
    const {source, value, key, index} = parseResult;
    const forNode = {
      type: 11,
      loc: dir.loc,
      source,
      valueAlias: value,
      keyAlias: key,
      objectIndexAlias: index,
      parseResult,
      children: node.tagType === 3 ? node.children : [node]
    };
    context.replaceNode(forNode);
    scopes.vFor++;
    const onExit = processCodegen && processCodegen(forNode);
    return () => {
      scopes.vFor--;
      if (onExit)
        onExit();
    };
  }
  const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  const stripParensRE = /^\(|\)$/g;
  function parseForExpression(input, context) {
    const loc = input.loc;
    const exp = input.content;
    const inMatch = exp.match(forAliasRE);
    if (!inMatch)
      return;
    const [, LHS, RHS] = inMatch;
    const result = {
      source: createAliasExpression(loc, RHS.trim(), exp.indexOf(RHS, LHS.length)),
      value: void 0,
      key: void 0,
      index: void 0
    };
    {
      validateBrowserExpression(result.source, context);
    }
    let valueContent = LHS.trim().replace(stripParensRE, "").trim();
    const trimmedOffset = LHS.indexOf(valueContent);
    const iteratorMatch = valueContent.match(forIteratorRE);
    if (iteratorMatch) {
      valueContent = valueContent.replace(forIteratorRE, "").trim();
      const keyContent = iteratorMatch[1].trim();
      let keyOffset;
      if (keyContent) {
        keyOffset = exp.indexOf(keyContent, trimmedOffset + valueContent.length);
        result.key = createAliasExpression(loc, keyContent, keyOffset);
        {
          validateBrowserExpression(result.key, context, true);
        }
      }
      if (iteratorMatch[2]) {
        const indexContent = iteratorMatch[2].trim();
        if (indexContent) {
          result.index = createAliasExpression(loc, indexContent, exp.indexOf(indexContent, result.key ? keyOffset + keyContent.length : trimmedOffset + valueContent.length));
          {
            validateBrowserExpression(result.index, context, true);
          }
        }
      }
    }
    if (valueContent) {
      result.value = createAliasExpression(loc, valueContent, trimmedOffset);
      {
        validateBrowserExpression(result.value, context, true);
      }
    }
    return result;
  }
  function createAliasExpression(range2, content, offset) {
    return createSimpleExpression(content, false, getInnerRange(range2, offset, content.length));
  }
  function createForLoopParams({value, key, index}) {
    const params = [];
    if (value) {
      params.push(value);
    }
    if (key) {
      if (!value) {
        params.push(createSimpleExpression(`_`, false));
      }
      params.push(key);
    }
    if (index) {
      if (!key) {
        if (!value) {
          params.push(createSimpleExpression(`_`, false));
        }
        params.push(createSimpleExpression(`__`, false));
      }
      params.push(index);
    }
    return params;
  }
  const isStaticExp = (p2) => p2.type === 4 && p2.isStatic;
  const defaultFallback = createSimpleExpression(`undefined`, false);
  const trackSlotScopes = (node, context) => {
    if (node.type === 1 && (node.tagType === 1 || node.tagType === 3)) {
      const vSlot = findDir(node, "slot");
      if (vSlot) {
        const slotProps = vSlot.exp;
        context.scopes.vSlot++;
        return () => {
          context.scopes.vSlot--;
        };
      }
    }
  };
  const buildClientSlotFn = (props, children, loc) => createFunctionExpression(props, children, false, true, children.length ? children[0].loc : loc);
  function buildSlots(node, context, buildSlotFn = buildClientSlotFn) {
    context.helper(WITH_CTX);
    const {children, loc} = node;
    const slotsProperties = [];
    const dynamicSlots = [];
    const buildDefaultSlotProperty = (props, children2) => createObjectProperty(`default`, buildSlotFn(props, children2, loc));
    let hasDynamicSlots = context.scopes.vSlot > 0 || context.scopes.vFor > 0;
    const onComponentSlot = findDir(node, "slot", true);
    if (onComponentSlot) {
      const {arg, exp} = onComponentSlot;
      slotsProperties.push(createObjectProperty(arg || createSimpleExpression("default", true), buildSlotFn(exp, children, loc)));
    }
    let hasTemplateSlots = false;
    let hasNamedDefaultSlot = false;
    const implicitDefaultChildren = [];
    const seenSlotNames = new Set();
    for (let i = 0; i < children.length; i++) {
      const slotElement = children[i];
      let slotDir;
      if (!isTemplateNode(slotElement) || !(slotDir = findDir(slotElement, "slot", true))) {
        if (slotElement.type !== 3) {
          implicitDefaultChildren.push(slotElement);
        }
        continue;
      }
      if (onComponentSlot) {
        context.onError(createCompilerError(34, slotDir.loc));
        break;
      }
      hasTemplateSlots = true;
      const {children: slotChildren, loc: slotLoc} = slotElement;
      const {arg: slotName = createSimpleExpression(`default`, true), exp: slotProps, loc: dirLoc} = slotDir;
      let staticSlotName;
      if (isStaticExp(slotName)) {
        staticSlotName = slotName ? slotName.content : `default`;
      } else {
        hasDynamicSlots = true;
      }
      const slotFunction = buildSlotFn(slotProps, slotChildren, slotLoc);
      let vIf;
      let vElse;
      let vFor;
      if (vIf = findDir(slotElement, "if")) {
        hasDynamicSlots = true;
        dynamicSlots.push(createConditionalExpression(vIf.exp, buildDynamicSlot(slotName, slotFunction), defaultFallback));
      } else if (vElse = findDir(slotElement, /^else(-if)?$/, true)) {
        let j = i;
        let prev;
        while (j--) {
          prev = children[j];
          if (prev.type !== 3) {
            break;
          }
        }
        if (prev && isTemplateNode(prev) && findDir(prev, "if")) {
          children.splice(i, 1);
          i--;
          let conditional = dynamicSlots[dynamicSlots.length - 1];
          while (conditional.alternate.type === 19) {
            conditional = conditional.alternate;
          }
          conditional.alternate = vElse.exp ? createConditionalExpression(vElse.exp, buildDynamicSlot(slotName, slotFunction), defaultFallback) : buildDynamicSlot(slotName, slotFunction);
        } else {
          context.onError(createCompilerError(28, vElse.loc));
        }
      } else if (vFor = findDir(slotElement, "for")) {
        hasDynamicSlots = true;
        const parseResult = vFor.parseResult || parseForExpression(vFor.exp, context);
        if (parseResult) {
          dynamicSlots.push(createCallExpression(context.helper(RENDER_LIST), [
            parseResult.source,
            createFunctionExpression(createForLoopParams(parseResult), buildDynamicSlot(slotName, slotFunction), true)
          ]));
        } else {
          context.onError(createCompilerError(30, vFor.loc));
        }
      } else {
        if (staticSlotName) {
          if (seenSlotNames.has(staticSlotName)) {
            context.onError(createCompilerError(35, dirLoc));
            continue;
          }
          seenSlotNames.add(staticSlotName);
          if (staticSlotName === "default") {
            hasNamedDefaultSlot = true;
          }
        }
        slotsProperties.push(createObjectProperty(slotName, slotFunction));
      }
    }
    if (!onComponentSlot) {
      if (!hasTemplateSlots) {
        slotsProperties.push(buildDefaultSlotProperty(void 0, children));
      } else if (implicitDefaultChildren.length) {
        if (hasNamedDefaultSlot) {
          context.onError(createCompilerError(36, implicitDefaultChildren[0].loc));
        } else {
          slotsProperties.push(buildDefaultSlotProperty(void 0, implicitDefaultChildren));
        }
      }
    }
    let slots = createObjectExpression(slotsProperties.concat(createObjectProperty(`_`, createSimpleExpression(`1`, false))), loc);
    if (dynamicSlots.length) {
      slots = createCallExpression(context.helper(CREATE_SLOTS), [
        slots,
        createArrayExpression(dynamicSlots)
      ]);
    }
    return {
      slots,
      hasDynamicSlots
    };
  }
  function buildDynamicSlot(name, fn) {
    return createObjectExpression([
      createObjectProperty(`name`, name),
      createObjectProperty(`fn`, fn)
    ]);
  }
  const directiveImportMap = new WeakMap();
  const transformElement = (node, context) => {
    if (!(node.type === 1 && (node.tagType === 0 || node.tagType === 1))) {
      return;
    }
    return function postTransformElement() {
      const {tag, props} = node;
      const isComponent = node.tagType === 1;
      const vnodeTag = isComponent ? resolveComponentType(node, context) : `"${tag}"`;
      const isDynamicComponent = isObject(vnodeTag) && vnodeTag.callee === RESOLVE_DYNAMIC_COMPONENT;
      let vnodeProps;
      let vnodeChildren;
      let vnodePatchFlag;
      let patchFlag = 0;
      let vnodeDynamicProps;
      let dynamicPropNames;
      let vnodeDirectives;
      let shouldUseBlock = isDynamicComponent || !isComponent && (tag === "svg" || tag === "foreignObject" || findProp(node, "key", true));
      if (props.length > 0) {
        const propsBuildResult = buildProps(node, context);
        vnodeProps = propsBuildResult.props;
        patchFlag = propsBuildResult.patchFlag;
        dynamicPropNames = propsBuildResult.dynamicPropNames;
        const directives = propsBuildResult.directives;
        vnodeDirectives = directives && directives.length ? createArrayExpression(directives.map((dir) => buildDirectiveArgs(dir, context))) : void 0;
      }
      if (node.children.length > 0) {
        if (vnodeTag === KEEP_ALIVE) {
          shouldUseBlock = true;
          patchFlag |= 1024;
          if (node.children.length > 1) {
            context.onError(createCompilerError(42, {
              start: node.children[0].loc.start,
              end: node.children[node.children.length - 1].loc.end,
              source: ""
            }));
          }
        }
        const shouldBuildAsSlots = isComponent && vnodeTag !== TELEPORT && vnodeTag !== KEEP_ALIVE;
        if (shouldBuildAsSlots) {
          const {slots, hasDynamicSlots} = buildSlots(node, context);
          vnodeChildren = slots;
          if (hasDynamicSlots) {
            patchFlag |= 1024;
          }
        } else if (node.children.length === 1 && vnodeTag !== TELEPORT) {
          const child = node.children[0];
          const type = child.type;
          const hasDynamicTextChild = type === 5 || type === 8;
          if (hasDynamicTextChild && !getStaticType(child)) {
            patchFlag |= 1;
          }
          if (hasDynamicTextChild || type === 2) {
            vnodeChildren = child;
          } else {
            vnodeChildren = node.children;
          }
        } else {
          vnodeChildren = node.children;
        }
      }
      if (patchFlag !== 0) {
        {
          if (patchFlag < 0) {
            vnodePatchFlag = patchFlag + ` /* ${PatchFlagNames[patchFlag]} */`;
          } else {
            const flagNames = Object.keys(PatchFlagNames).map(Number).filter((n) => n > 0 && patchFlag & n).map((n) => PatchFlagNames[n]).join(`, `);
            vnodePatchFlag = patchFlag + ` /* ${flagNames} */`;
          }
        }
        if (dynamicPropNames && dynamicPropNames.length) {
          vnodeDynamicProps = stringifyDynamicPropNames(dynamicPropNames);
        }
      }
      node.codegenNode = createVNodeCall(context, vnodeTag, vnodeProps, vnodeChildren, vnodePatchFlag, vnodeDynamicProps, vnodeDirectives, !!shouldUseBlock, false, node.loc);
    };
  };
  function resolveComponentType(node, context, ssr = false) {
    const {tag} = node;
    const isProp = node.tag === "component" ? findProp(node, "is") : findDir(node, "is");
    if (isProp) {
      const exp = isProp.type === 6 ? isProp.value && createSimpleExpression(isProp.value.content, true) : isProp.exp;
      if (exp) {
        return createCallExpression(context.helper(RESOLVE_DYNAMIC_COMPONENT), [
          exp
        ]);
      }
    }
    const builtIn = isCoreComponent(tag) || context.isBuiltInComponent(tag);
    if (builtIn) {
      if (!ssr)
        context.helper(builtIn);
      return builtIn;
    }
    context.helper(RESOLVE_COMPONENT);
    context.components.add(tag);
    return toValidAssetId(tag, `component`);
  }
  function buildProps(node, context, props = node.props, ssr = false) {
    const {tag, loc: elementLoc} = node;
    const isComponent = node.tagType === 1;
    let properties = [];
    const mergeArgs = [];
    const runtimeDirectives = [];
    let patchFlag = 0;
    let hasRef = false;
    let hasClassBinding = false;
    let hasStyleBinding = false;
    let hasHydrationEventBinding = false;
    let hasDynamicKeys = false;
    const dynamicPropNames = [];
    const analyzePatchFlag = ({key, value}) => {
      if (key.type === 4 && key.isStatic) {
        const name = key.content;
        if (!isComponent && isOn(name) && name.toLowerCase() !== "onclick" && name !== "onUpdate:modelValue") {
          hasHydrationEventBinding = true;
        }
        if (value.type === 20 || (value.type === 4 || value.type === 8) && getStaticType(value) > 0) {
          return;
        }
        if (name === "ref") {
          hasRef = true;
        } else if (name === "class" && !isComponent) {
          hasClassBinding = true;
        } else if (name === "style" && !isComponent) {
          hasStyleBinding = true;
        } else if (name !== "key" && !dynamicPropNames.includes(name)) {
          dynamicPropNames.push(name);
        }
      } else {
        hasDynamicKeys = true;
      }
    };
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (prop.type === 6) {
        const {loc, name, value} = prop;
        if (name === "ref") {
          hasRef = true;
        }
        if (name === "is" && tag === "component") {
          continue;
        }
        properties.push(createObjectProperty(createSimpleExpression(name, true, getInnerRange(loc, 0, name.length)), createSimpleExpression(value ? value.content : "", true, value ? value.loc : loc)));
      } else {
        const {name, arg, exp, loc} = prop;
        const isBind = name === "bind";
        const isOn2 = name === "on";
        if (name === "slot") {
          if (!isComponent) {
            context.onError(createCompilerError(37, loc));
          }
          continue;
        }
        if (name === "once") {
          continue;
        }
        if (name === "is" || isBind && tag === "component" && isBindKey(arg, "is")) {
          continue;
        }
        if (isOn2 && ssr) {
          continue;
        }
        if (!arg && (isBind || isOn2)) {
          hasDynamicKeys = true;
          if (exp) {
            if (properties.length) {
              mergeArgs.push(createObjectExpression(dedupeProperties(properties), elementLoc));
              properties = [];
            }
            if (isBind) {
              mergeArgs.push(exp);
            } else {
              mergeArgs.push({
                type: 14,
                loc,
                callee: context.helper(TO_HANDLERS),
                arguments: [exp]
              });
            }
          } else {
            context.onError(createCompilerError(isBind ? 31 : 32, loc));
          }
          continue;
        }
        const directiveTransform = context.directiveTransforms[name];
        if (directiveTransform) {
          const {props: props2, needRuntime} = directiveTransform(prop, node, context);
          !ssr && props2.forEach(analyzePatchFlag);
          properties.push(...props2);
          if (needRuntime) {
            runtimeDirectives.push(prop);
            if (isSymbol(needRuntime)) {
              directiveImportMap.set(prop, needRuntime);
            }
          }
        } else {
          runtimeDirectives.push(prop);
        }
      }
    }
    let propsExpression = void 0;
    if (mergeArgs.length) {
      if (properties.length) {
        mergeArgs.push(createObjectExpression(dedupeProperties(properties), elementLoc));
      }
      if (mergeArgs.length > 1) {
        propsExpression = createCallExpression(context.helper(MERGE_PROPS), mergeArgs, elementLoc);
      } else {
        propsExpression = mergeArgs[0];
      }
    } else if (properties.length) {
      propsExpression = createObjectExpression(dedupeProperties(properties), elementLoc);
    }
    if (hasDynamicKeys) {
      patchFlag |= 16;
    } else {
      if (hasClassBinding) {
        patchFlag |= 2;
      }
      if (hasStyleBinding) {
        patchFlag |= 4;
      }
      if (dynamicPropNames.length) {
        patchFlag |= 8;
      }
      if (hasHydrationEventBinding) {
        patchFlag |= 32;
      }
    }
    if ((patchFlag === 0 || patchFlag === 32) && (hasRef || runtimeDirectives.length > 0)) {
      patchFlag |= 512;
    }
    return {
      props: propsExpression,
      directives: runtimeDirectives,
      patchFlag,
      dynamicPropNames
    };
  }
  function dedupeProperties(properties) {
    const knownProps = new Map();
    const deduped = [];
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      if (prop.key.type === 8 || !prop.key.isStatic) {
        deduped.push(prop);
        continue;
      }
      const name = prop.key.content;
      const existing = knownProps.get(name);
      if (existing) {
        if (name === "style" || name === "class" || name.startsWith("on")) {
          mergeAsArray(existing, prop);
        }
      } else {
        knownProps.set(name, prop);
        deduped.push(prop);
      }
    }
    return deduped;
  }
  function mergeAsArray(existing, incoming) {
    if (existing.value.type === 17) {
      existing.value.elements.push(incoming.value);
    } else {
      existing.value = createArrayExpression([existing.value, incoming.value], existing.loc);
    }
  }
  function buildDirectiveArgs(dir, context) {
    const dirArgs = [];
    const runtime = directiveImportMap.get(dir);
    if (runtime) {
      dirArgs.push(context.helperString(runtime));
    } else {
      context.helper(RESOLVE_DIRECTIVE);
      context.directives.add(dir.name);
      dirArgs.push(toValidAssetId(dir.name, `directive`));
    }
    const {loc} = dir;
    if (dir.exp)
      dirArgs.push(dir.exp);
    if (dir.arg) {
      if (!dir.exp) {
        dirArgs.push(`void 0`);
      }
      dirArgs.push(dir.arg);
    }
    if (Object.keys(dir.modifiers).length) {
      if (!dir.arg) {
        if (!dir.exp) {
          dirArgs.push(`void 0`);
        }
        dirArgs.push(`void 0`);
      }
      const trueExpression = createSimpleExpression(`true`, false, loc);
      dirArgs.push(createObjectExpression(dir.modifiers.map((modifier) => createObjectProperty(modifier, trueExpression)), loc));
    }
    return createArrayExpression(dirArgs, dir.loc);
  }
  function stringifyDynamicPropNames(props) {
    let propsNamesString = `[`;
    for (let i = 0, l = props.length; i < l; i++) {
      propsNamesString += JSON.stringify(props[i]);
      if (i < l - 1)
        propsNamesString += ", ";
    }
    return propsNamesString + `]`;
  }
  const transformSlotOutlet = (node, context) => {
    if (isSlotOutlet(node)) {
      const {children, loc} = node;
      const {slotName, slotProps} = processSlotOutlet(node, context);
      const slotArgs = [
        context.prefixIdentifiers ? `_ctx.$slots` : `$slots`,
        slotName
      ];
      if (slotProps) {
        slotArgs.push(slotProps);
      }
      if (children.length) {
        if (!slotProps) {
          slotArgs.push(`{}`);
        }
        slotArgs.push(createFunctionExpression([], children, false, false, loc));
      }
      node.codegenNode = createCallExpression(context.helper(RENDER_SLOT), slotArgs, loc);
    }
  };
  function processSlotOutlet(node, context) {
    let slotName = `"default"`;
    let slotProps = void 0;
    const name = findProp(node, "name");
    if (name) {
      if (name.type === 6 && name.value) {
        slotName = JSON.stringify(name.value.content);
      } else if (name.type === 7 && name.exp) {
        slotName = name.exp;
      }
    }
    const propsWithoutName = name ? node.props.filter((p2) => p2 !== name) : node.props;
    if (propsWithoutName.length > 0) {
      const {props, directives} = buildProps(node, context, propsWithoutName);
      slotProps = props;
      if (directives.length) {
        context.onError(createCompilerError(33, directives[0].loc));
      }
    }
    return {
      slotName,
      slotProps
    };
  }
  const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
  const transformOn = (dir, node, context, augmentor) => {
    const {loc, modifiers, arg} = dir;
    if (!dir.exp && !modifiers.length) {
      context.onError(createCompilerError(32, loc));
    }
    let eventName;
    if (arg.type === 4) {
      if (arg.isStatic) {
        const rawName = arg.content;
        const normalizedName = rawName.startsWith(`vnode`) ? capitalize(camelize(rawName)) : capitalize(rawName);
        eventName = createSimpleExpression(`on${normalizedName}`, true, arg.loc);
      } else {
        eventName = createCompoundExpression([`"on" + (`, arg, `)`]);
      }
    } else {
      eventName = arg;
      eventName.children.unshift(`"on" + (`);
      eventName.children.push(`)`);
    }
    let exp = dir.exp;
    if (exp && !exp.content.trim()) {
      exp = void 0;
    }
    let isCacheable = !exp;
    if (exp) {
      const isMemberExp = isMemberExpression(exp.content);
      const isInlineStatement = !(isMemberExp || fnExpRE.test(exp.content));
      const hasMultipleStatements = exp.content.includes(`;`);
      {
        validateBrowserExpression(exp, context, false, hasMultipleStatements);
      }
      if (isInlineStatement || isCacheable && isMemberExp) {
        exp = createCompoundExpression([
          `${isInlineStatement ? `$event` : `(...args)`} => ${hasMultipleStatements ? `{` : `(`}`,
          exp,
          hasMultipleStatements ? `}` : `)`
        ]);
      }
    }
    let ret = {
      props: [
        createObjectProperty(eventName, exp || createSimpleExpression(`() => {}`, false, loc))
      ]
    };
    if (augmentor) {
      ret = augmentor(ret);
    }
    if (isCacheable) {
      ret.props[0].value = context.cache(ret.props[0].value);
    }
    return ret;
  };
  const transformBind = (dir, node, context) => {
    const {exp, modifiers, loc} = dir;
    const arg = dir.arg;
    if (!exp || exp.type === 4 && !exp.content) {
      context.onError(createCompilerError(31, loc));
    }
    if (modifiers.includes("camel")) {
      if (arg.type === 4) {
        if (arg.isStatic) {
          arg.content = camelize(arg.content);
        } else {
          arg.content = `${context.helperString(CAMELIZE)}(${arg.content})`;
        }
      } else {
        arg.children.unshift(`${context.helperString(CAMELIZE)}(`);
        arg.children.push(`)`);
      }
    }
    return {
      props: [
        createObjectProperty(arg, exp || createSimpleExpression("", true, loc))
      ]
    };
  };
  const transformText = (node, context) => {
    if (node.type === 0 || node.type === 1 || node.type === 11 || node.type === 10) {
      return () => {
        const children = node.children;
        let currentContainer = void 0;
        let hasText = false;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (isText(child)) {
            hasText = true;
            for (let j = i + 1; j < children.length; j++) {
              const next = children[j];
              if (isText(next)) {
                if (!currentContainer) {
                  currentContainer = children[i] = {
                    type: 8,
                    loc: child.loc,
                    children: [child]
                  };
                }
                currentContainer.children.push(` + `, next);
                children.splice(j, 1);
                j--;
              } else {
                currentContainer = void 0;
                break;
              }
            }
          }
        }
        if (!hasText || children.length === 1 && (node.type === 0 || node.type === 1 && node.tagType === 0)) {
          return;
        }
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (isText(child) || child.type === 8) {
            const callArgs = [];
            if (child.type !== 2 || child.content !== " ") {
              callArgs.push(child);
            }
            if (!context.ssr && child.type !== 2) {
              callArgs.push(`${1} /* ${PatchFlagNames[1]} */`);
            }
            children[i] = {
              type: 12,
              content: child,
              loc: child.loc,
              codegenNode: createCallExpression(context.helper(CREATE_TEXT), callArgs)
            };
          }
        }
      };
    }
  };
  const transformOnce = (node, context) => {
    if (node.type === 1 && findDir(node, "once", true)) {
      context.helper(SET_BLOCK_TRACKING);
      return () => {
        if (node.codegenNode) {
          node.codegenNode = context.cache(node.codegenNode, true);
        }
      };
    }
  };
  const transformModel = (dir, node, context) => {
    const {exp, arg} = dir;
    if (!exp) {
      context.onError(createCompilerError(38, dir.loc));
      return createTransformProps();
    }
    const expString = exp.type === 4 ? exp.content : exp.loc.source;
    if (!isMemberExpression(expString)) {
      context.onError(createCompilerError(39, exp.loc));
      return createTransformProps();
    }
    const propName = arg ? arg : createSimpleExpression("modelValue", true);
    const eventName = arg ? arg.type === 4 && arg.isStatic ? `onUpdate:${arg.content}` : createCompoundExpression(['"onUpdate:" + ', arg]) : `onUpdate:modelValue`;
    const props = [
      createObjectProperty(propName, dir.exp),
      createObjectProperty(eventName, createCompoundExpression([`$event => (`, exp, ` = $event)`]))
    ];
    if (dir.modifiers.length && node.tagType === 1) {
      const modifiers = dir.modifiers.map((m) => (isSimpleIdentifier(m) ? m : JSON.stringify(m)) + `: true`).join(`, `);
      const modifiersKey = arg ? arg.type === 4 && arg.isStatic ? `${arg.content}Modifiers` : createCompoundExpression([arg, ' + "Modifiers"']) : `modelModifiers`;
      props.push(createObjectProperty(modifiersKey, createSimpleExpression(`{ ${modifiers} }`, false, dir.loc, true)));
    }
    return createTransformProps(props);
  };
  function createTransformProps(props = []) {
    return {props};
  }
  function getBaseTransformPreset(prefixIdentifiers) {
    return [
      [
        transformOnce,
        transformIf,
        transformFor,
        ...[transformExpression],
        transformSlotOutlet,
        transformElement,
        trackSlotScopes,
        transformText
      ],
      {
        on: transformOn,
        bind: transformBind,
        model: transformModel
      }
    ];
  }
  function baseCompile(template, options = {}) {
    const onError = options.onError || defaultOnError;
    const isModuleMode = options.mode === "module";
    {
      if (options.prefixIdentifiers === true) {
        onError(createCompilerError(43));
      } else if (isModuleMode) {
        onError(createCompilerError(44));
      }
    }
    const prefixIdentifiers = false;
    if (options.cacheHandlers) {
      onError(createCompilerError(45));
    }
    if (options.scopeId && !isModuleMode) {
      onError(createCompilerError(46));
    }
    const ast = isString(template) ? baseParse(template, options) : template;
    const [nodeTransforms, directiveTransforms] = getBaseTransformPreset();
    transform(ast, extend({}, options, {
      prefixIdentifiers,
      nodeTransforms: [
        ...nodeTransforms,
        ...options.nodeTransforms || []
      ],
      directiveTransforms: extend({}, directiveTransforms, options.directiveTransforms || {})
    }));
    return generate(ast, extend({}, options, {
      prefixIdentifiers
    }));
  }
  const noopDirectiveTransform = () => ({props: []});
  const V_MODEL_RADIO = Symbol(`vModelRadio`);
  const V_MODEL_CHECKBOX = Symbol(`vModelCheckbox`);
  const V_MODEL_TEXT = Symbol(`vModelText`);
  const V_MODEL_SELECT = Symbol(`vModelSelect`);
  const V_MODEL_DYNAMIC = Symbol(`vModelDynamic`);
  const V_ON_WITH_MODIFIERS = Symbol(`vOnModifiersGuard`);
  const V_ON_WITH_KEYS = Symbol(`vOnKeysGuard`);
  const V_SHOW = Symbol(`vShow`);
  const TRANSITION = Symbol(`Transition`);
  const TRANSITION_GROUP = Symbol(`TransitionGroup`);
  registerRuntimeHelpers({
    [V_MODEL_RADIO]: `vModelRadio`,
    [V_MODEL_CHECKBOX]: `vModelCheckbox`,
    [V_MODEL_TEXT]: `vModelText`,
    [V_MODEL_SELECT]: `vModelSelect`,
    [V_MODEL_DYNAMIC]: `vModelDynamic`,
    [V_ON_WITH_MODIFIERS]: `withModifiers`,
    [V_ON_WITH_KEYS]: `withKeys`,
    [V_SHOW]: `vShow`,
    [TRANSITION]: `Transition`,
    [TRANSITION_GROUP]: `TransitionGroup`
  });
  let decoder;
  function decodeHtmlBrowser(raw) {
    (decoder || (decoder = document.createElement("div"))).innerHTML = raw;
    return decoder.textContent;
  }
  const isRawTextContainer = /* @__PURE__ */ makeMap("style,iframe,script,noscript", true);
  const parserOptions = {
    isVoidTag,
    isNativeTag: (tag) => isHTMLTag(tag) || isSVGTag(tag),
    isPreTag: (tag) => tag === "pre",
    decodeEntities: decodeHtmlBrowser,
    isBuiltInComponent: (tag) => {
      if (isBuiltInType(tag, `Transition`)) {
        return TRANSITION;
      } else if (isBuiltInType(tag, `TransitionGroup`)) {
        return TRANSITION_GROUP;
      }
    },
    getNamespace(tag, parent) {
      let ns = parent ? parent.ns : 0;
      if (parent && ns === 2) {
        if (parent.tag === "annotation-xml") {
          if (tag === "svg") {
            return 1;
          }
          if (parent.props.some((a) => a.type === 6 && a.name === "encoding" && a.value != null && (a.value.content === "text/html" || a.value.content === "application/xhtml+xml"))) {
            ns = 0;
          }
        } else if (/^m(?:[ions]|text)$/.test(parent.tag) && tag !== "mglyph" && tag !== "malignmark") {
          ns = 0;
        }
      } else if (parent && ns === 1) {
        if (parent.tag === "foreignObject" || parent.tag === "desc" || parent.tag === "title") {
          ns = 0;
        }
      }
      if (ns === 0) {
        if (tag === "svg") {
          return 1;
        }
        if (tag === "math") {
          return 2;
        }
      }
      return ns;
    },
    getTextMode({tag, ns}) {
      if (ns === 0) {
        if (tag === "textarea" || tag === "title") {
          return 1;
        }
        if (isRawTextContainer(tag)) {
          return 2;
        }
      }
      return 0;
    }
  };
  const transformStyle = (node) => {
    if (node.type === 1) {
      node.props.forEach((p2, i) => {
        if (p2.type === 6 && p2.name === "style" && p2.value) {
          node.props[i] = {
            type: 7,
            name: `bind`,
            arg: createSimpleExpression(`style`, true, p2.loc),
            exp: parseInlineCSS(p2.value.content, p2.loc),
            modifiers: [],
            loc: p2.loc
          };
        }
      });
    }
  };
  const parseInlineCSS = (cssText, loc) => {
    const normalized = parseStringStyle(cssText);
    return createSimpleExpression(JSON.stringify(normalized), false, loc, true);
  };
  function createDOMCompilerError(code, loc) {
    return createCompilerError(code, loc, DOMErrorMessages);
  }
  const DOMErrorMessages = {
    [47]: `v-html is missing expression.`,
    [48]: `v-html will override element children.`,
    [49]: `v-text is missing expression.`,
    [50]: `v-text will override element children.`,
    [51]: `v-model can only be used on <input>, <textarea> and <select> elements.`,
    [52]: `v-model argument is not supported on plain elements.`,
    [53]: `v-model cannot used on file inputs since they are read-only. Use a v-on:change listener instead.`,
    [54]: `Unnecessary value binding used alongside v-model. It will interfere with v-model's behavior.`,
    [55]: `v-show is missing expression.`,
    [56]: `<Transition> expects exactly one child element or component.`,
    [57]: `Tags with side effect (<script> and <style>) are ignored in client component templates.`
  };
  const transformVHtml = (dir, node, context) => {
    const {exp, loc} = dir;
    if (!exp) {
      context.onError(createDOMCompilerError(47, loc));
    }
    if (node.children.length) {
      context.onError(createDOMCompilerError(48, loc));
      node.children.length = 0;
    }
    return {
      props: [
        createObjectProperty(createSimpleExpression(`innerHTML`, true, loc), exp || createSimpleExpression("", true))
      ]
    };
  };
  const transformVText = (dir, node, context) => {
    const {exp, loc} = dir;
    if (!exp) {
      context.onError(createDOMCompilerError(49, loc));
    }
    if (node.children.length) {
      context.onError(createDOMCompilerError(50, loc));
      node.children.length = 0;
    }
    return {
      props: [
        createObjectProperty(createSimpleExpression(`textContent`, true, loc), exp || createSimpleExpression("", true))
      ]
    };
  };
  const transformModel$1 = (dir, node, context) => {
    const baseResult = transformModel(dir, node, context);
    if (!baseResult.props.length || node.tagType === 1) {
      return baseResult;
    }
    if (dir.arg) {
      context.onError(createDOMCompilerError(52, dir.arg.loc));
    }
    function checkDuplicatedValue() {
      const value = findProp(node, "value");
      if (value) {
        context.onError(createDOMCompilerError(54, value.loc));
      }
    }
    const {tag} = node;
    if (tag === "input" || tag === "textarea" || tag === "select") {
      let directiveToUse = V_MODEL_TEXT;
      let isInvalidType = false;
      if (tag === "input") {
        const type = findProp(node, `type`);
        if (type) {
          if (type.type === 7) {
            directiveToUse = V_MODEL_DYNAMIC;
          } else if (type.value) {
            switch (type.value.content) {
              case "radio":
                directiveToUse = V_MODEL_RADIO;
                break;
              case "checkbox":
                directiveToUse = V_MODEL_CHECKBOX;
                break;
              case "file":
                isInvalidType = true;
                context.onError(createDOMCompilerError(53, dir.loc));
                break;
              default:
                checkDuplicatedValue();
                break;
            }
          }
        } else if (hasDynamicKeyVBind(node)) {
          directiveToUse = V_MODEL_DYNAMIC;
        } else {
          checkDuplicatedValue();
        }
      } else if (tag === "select") {
        directiveToUse = V_MODEL_SELECT;
      } else if (tag === "textarea") {
        checkDuplicatedValue();
      }
      if (!isInvalidType) {
        baseResult.needRuntime = context.helper(directiveToUse);
      }
    } else {
      context.onError(createDOMCompilerError(51, dir.loc));
    }
    baseResult.props = baseResult.props.filter((p2) => {
      if (p2.key.type === 4 && p2.key.content === "modelValue") {
        return false;
      }
      return true;
    });
    return baseResult;
  };
  const isEventOptionModifier = /* @__PURE__ */ makeMap(`passive,once,capture`);
  const isNonKeyModifier = /* @__PURE__ */ makeMap(`stop,prevent,self,ctrl,shift,alt,meta,exact,left,middle,right`);
  const isKeyboardEvent = /* @__PURE__ */ makeMap(`onkeyup,onkeydown,onkeypress`, true);
  const generateModifiers = (modifiers) => {
    const keyModifiers = [];
    const nonKeyModifiers = [];
    const eventOptionModifiers = [];
    for (let i = 0; i < modifiers.length; i++) {
      const modifier = modifiers[i];
      if (isEventOptionModifier(modifier)) {
        eventOptionModifiers.push(modifier);
      } else {
        if (isNonKeyModifier(modifier)) {
          nonKeyModifiers.push(modifier);
        } else {
          keyModifiers.push(modifier);
        }
      }
    }
    return {
      keyModifiers,
      nonKeyModifiers,
      eventOptionModifiers
    };
  };
  const transformClick = (key, event) => {
    const isStaticClick = key.type === 4 && key.isStatic && key.content.toLowerCase() === "onclick";
    return isStaticClick ? createSimpleExpression(event, true) : key.type !== 4 ? createCompoundExpression([
      `(`,
      key,
      `).toLowerCase() === "onclick" ? "${event}" : (`,
      key,
      `)`
    ]) : key;
  };
  const transformOn$1 = (dir, node, context) => {
    return transformOn(dir, node, context, (baseResult) => {
      const {modifiers} = dir;
      if (!modifiers.length)
        return baseResult;
      let {key, value: handlerExp} = baseResult.props[0];
      const {keyModifiers, nonKeyModifiers, eventOptionModifiers} = generateModifiers(modifiers);
      if (nonKeyModifiers.includes("right")) {
        key = transformClick(key, `onContextmenu`);
      }
      if (nonKeyModifiers.includes("middle")) {
        key = transformClick(key, `onMouseup`);
      }
      if (nonKeyModifiers.length) {
        handlerExp = createCallExpression(context.helper(V_ON_WITH_MODIFIERS), [
          handlerExp,
          JSON.stringify(nonKeyModifiers)
        ]);
      }
      if (keyModifiers.length && (key.type === 8 || !key.isStatic || isKeyboardEvent(key.content))) {
        handlerExp = createCallExpression(context.helper(V_ON_WITH_KEYS), [
          handlerExp,
          JSON.stringify(keyModifiers)
        ]);
      }
      if (eventOptionModifiers.length) {
        handlerExp = createObjectExpression([
          createObjectProperty("handler", handlerExp),
          createObjectProperty("options", createObjectExpression(eventOptionModifiers.map((modifier) => createObjectProperty(modifier, createSimpleExpression("true", false)))))
        ]);
      }
      return {
        props: [createObjectProperty(key, handlerExp)]
      };
    });
  };
  const transformShow = (dir, node, context) => {
    const {exp, loc} = dir;
    if (!exp) {
      context.onError(createDOMCompilerError(55, loc));
    }
    return {
      props: [],
      needRuntime: context.helper(V_SHOW)
    };
  };
  const warnTransitionChildren = (node, context) => {
    if (node.type === 1 && node.tagType === 1) {
      const component = context.isBuiltInComponent(node.tag);
      if (component === TRANSITION) {
        return () => {
          if (node.children.length && hasMultipleChildren(node)) {
            context.onError(createDOMCompilerError(56, {
              start: node.children[0].loc.start,
              end: node.children[node.children.length - 1].loc.end,
              source: ""
            }));
          }
        };
      }
    }
  };
  function hasMultipleChildren(node) {
    const children = node.children = node.children.filter((c) => c.type !== 3);
    const child = children[0];
    return children.length !== 1 || child.type === 11 || child.type === 9 && child.branches.some(hasMultipleChildren);
  }
  const ignoreSideEffectTags = (node, context) => {
    if (node.type === 1 && node.tagType === 0 && (node.tag === "script" || node.tag === "style")) {
      context.onError(createDOMCompilerError(57, node.loc));
      context.removeNode();
    }
  };
  const DOMNodeTransforms = [
    transformStyle,
    ...[warnTransitionChildren]
  ];
  const DOMDirectiveTransforms = {
    cloak: noopDirectiveTransform,
    html: transformVHtml,
    text: transformVText,
    model: transformModel$1,
    on: transformOn$1,
    show: transformShow
  };
  function compile(template, options = {}) {
    return baseCompile(template, extend({}, parserOptions, options, {
      nodeTransforms: [
        ignoreSideEffectTags,
        ...DOMNodeTransforms,
        ...options.nodeTransforms || []
      ],
      directiveTransforms: extend({}, DOMDirectiveTransforms, options.directiveTransforms || {}),
      transformHoist: null
    }));
  }
  const targetMap = new WeakMap();
  const effectStack = [];
  let activeEffect;
  const ITERATE_KEY = Symbol("iterate");
  const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
  function isEffect(fn) {
    return fn && fn._isEffect === true;
  }
  function effect(fn, options = EMPTY_OBJ) {
    if (isEffect(fn)) {
      fn = fn.raw;
    }
    const effect2 = createReactiveEffect(fn, options);
    if (!options.lazy) {
      effect2();
    }
    return effect2;
  }
  function stop(effect2) {
    if (effect2.active) {
      cleanup(effect2);
      if (effect2.options.onStop) {
        effect2.options.onStop();
      }
      effect2.active = false;
    }
  }
  let uid = 0;
  function createReactiveEffect(fn, options) {
    const effect2 = function reactiveEffect(...args) {
      if (!effect2.active) {
        return options.scheduler ? void 0 : fn(...args);
      }
      if (!effectStack.includes(effect2)) {
        cleanup(effect2);
        try {
          enableTracking();
          effectStack.push(effect2);
          activeEffect = effect2;
          return fn(...args);
        } finally {
          effectStack.pop();
          resetTracking();
          activeEffect = effectStack[effectStack.length - 1];
        }
      }
    };
    effect2.id = uid++;
    effect2._isEffect = true;
    effect2.active = true;
    effect2.raw = fn;
    effect2.deps = [];
    effect2.options = options;
    return effect2;
  }
  function cleanup(effect2) {
    const {deps} = effect2;
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect2);
      }
      deps.length = 0;
    }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
  }
  function resetTracking() {
    const last2 = trackStack.pop();
    shouldTrack = last2 === void 0 ? true : last2;
  }
  function track(target, type, key) {
    if (!shouldTrack || activeEffect === void 0) {
      return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Set());
    }
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
      if (activeEffect.options.onTrack) {
        activeEffect.options.onTrack({
          effect: activeEffect,
          target,
          type,
          key
        });
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    const effects = new Set();
    const add2 = (effectsToAdd) => {
      if (effectsToAdd) {
        effectsToAdd.forEach((effect2) => {
          if (effect2 !== activeEffect || !shouldTrack) {
            effects.add(effect2);
          }
        });
      }
    };
    if (type === "clear") {
      depsMap.forEach(add2);
    } else if (key === "length" && isArray(target)) {
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 >= newValue) {
          add2(dep);
        }
      });
    } else {
      if (key !== void 0) {
        add2(depsMap.get(key));
      }
      const isAddOrDelete = type === "add" || type === "delete" && !isArray(target);
      if (isAddOrDelete || type === "set" && target instanceof Map) {
        add2(depsMap.get(isArray(target) ? "length" : ITERATE_KEY));
      }
      if (isAddOrDelete && target instanceof Map) {
        add2(depsMap.get(MAP_KEY_ITERATE_KEY));
      }
    }
    const run = (effect2) => {
      if (effect2.options.onTrigger) {
        effect2.options.onTrigger({
          effect: effect2,
          target,
          key,
          type,
          newValue,
          oldValue,
          oldTarget
        });
      }
      if (effect2.options.scheduler) {
        effect2.options.scheduler(effect2);
      } else {
        effect2();
      }
    };
    effects.forEach(run);
  }
  const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
  const get = /* @__PURE__ */ createGetter();
  const shallowGet = /* @__PURE__ */ createGetter(false, true);
  const readonlyGet = /* @__PURE__ */ createGetter(true);
  const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
  const arrayInstrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    arrayInstrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  function createGetter(isReadonly2 = false, shallow = false) {
    return function get2(target, key, receiver) {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw" && receiver === (isReadonly2 ? target["__v_readonly"] : target["__v_reactive"])) {
        return target;
      }
      const targetIsArray = isArray(target);
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol(key) ? builtInSymbols.has(key) : key === `__proto__` || key === `__v_isRef`) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (shallow) {
        return res;
      }
      if (isRef(res)) {
        return targetIsArray ? res : res.value;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    };
  }
  const set = /* @__PURE__ */ createSetter();
  const shallowSet = /* @__PURE__ */ createSetter(true);
  function createSetter(shallow = false) {
    return function set2(target, key, value, receiver) {
      const oldValue = target[key];
      if (!shallow) {
        value = toRaw(value);
        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }
      const hadKey = hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    };
  }
  function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function has(target, key) {
    const result = Reflect.has(target, key);
    track(target, "has", key);
    return result;
  }
  function ownKeys(target) {
    track(target, "iterate", ITERATE_KEY);
    return Reflect.ownKeys(target);
  }
  const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
  };
  const readonlyHandlers = {
    get: readonlyGet,
    has,
    ownKeys,
    set(target, key) {
      {
        console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    },
    deleteProperty(target, key) {
      {
        console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    }
  };
  const shallowReactiveHandlers = extend({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
  });
  const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
  });
  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function get$1(target, key, wrap) {
    target = toRaw(target);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      track(target, "get", key);
    }
    track(target, "get", rawKey);
    const {has: has2, get: get2} = getProto(target);
    if (has2.call(target, key)) {
      return wrap(get2.call(target, key));
    } else if (has2.call(target, rawKey)) {
      return wrap(get2.call(target, rawKey));
    }
  }
  function has$1(key) {
    const target = toRaw(this);
    const rawKey = toRaw(key);
    if (key !== rawKey) {
      track(target, "has", key);
    }
    track(target, "has", rawKey);
    const has2 = getProto(target).has;
    return has2.call(target, key) || has2.call(target, rawKey);
  }
  function size(target) {
    target = toRaw(target);
    track(target, "iterate", ITERATE_KEY);
    return Reflect.get(getProto(target), "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    const result = proto.add.call(target, value);
    if (!hadKey) {
      trigger(target, "add", value, value);
    }
    return result;
  }
  function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const {has: has2, get: get2, set: set2} = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get2.call(target, key);
    const result = set2.call(target, key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value, oldValue);
    }
    return result;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const {has: has2, get: get2, delete: del} = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get2 ? get2.call(target, key) : void 0;
    const result = del.call(target, key);
    if (hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = target instanceof Map ? new Map(target) : new Set(target);
    const result = getProto(target).clear.call(target);
    if (hadItems) {
      trigger(target, "clear", void 0, void 0, oldTarget);
    }
    return result;
  }
  function createForEach(isReadonly2, shallow) {
    return function forEach(callback, thisArg) {
      const observed = this;
      const target = toRaw(observed);
      const wrap = isReadonly2 ? toReadonly : shallow ? toShallow : toReactive;
      !isReadonly2 && track(target, "iterate", ITERATE_KEY);
      function wrappedCallback(value, key) {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      }
      return getProto(target).forEach.call(target, wrappedCallback);
    };
  }
  function createIterableMethod(method, isReadonly2, shallow) {
    return function(...args) {
      const target = toRaw(this);
      const isMap = target instanceof Map;
      const isPair = method === "entries" || method === Symbol.iterator && isMap;
      const isKeyOnly = method === "keys" && isMap;
      const innerIterator = getProto(target)[method].apply(target, args);
      const wrap = isReadonly2 ? toReadonly : shallow ? toShallow : toReactive;
      !isReadonly2 && track(target, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
      return {
        next() {
          const {value, done} = innerIterator.next();
          return done ? {value, done} : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
      }
      return type === "delete" ? false : this;
    };
  }
  const mutableInstrumentations = {
    get(key) {
      return get$1(this, key, toReactive);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations = {
    get(key) {
      return get$1(this, key, toShallow);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations = {
    get(key) {
      return get$1(this, key, toReadonly);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations[method] = createIterableMethod(method, true, false);
    shallowInstrumentations[method] = createIterableMethod(method, false, true);
  });
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = shallow ? shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }
  const mutableCollectionHandlers = {
    get: createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: createInstrumentationGetter(true, false)
  };
  function checkIdentityKeys(target, has2, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has2.call(target, rawKey)) {
      const type = toRawType(target);
      console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? `as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
    }
  }
  const collectionTypes = new Set([Set, Map, WeakMap, WeakSet]);
  const isObservableType = /* @__PURE__ */ makeMap("Object,Array,Map,Set,WeakMap,WeakSet");
  const canObserve = (value) => {
    return !value["__v_skip"] && isObservableType(toRawType(value)) && !Object.isFrozen(value);
  };
  function reactive(target) {
    if (target && target["__v_isReadonly"]) {
      return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers);
  }
  function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers);
  }
  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers);
  }
  function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, readonlyCollectionHandlers);
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers) {
    if (!isObject(target)) {
      {
        console.warn(`value cannot be made reactive: ${String(target)}`);
      }
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    if (hasOwn(target, isReadonly2 ? "__v_readonly" : "__v_reactive")) {
      return isReadonly2 ? target["__v_readonly"] : target["__v_reactive"];
    }
    if (!canObserve(target)) {
      return target;
    }
    const observed = new Proxy(target, collectionTypes.has(target.constructor) ? collectionHandlers : baseHandlers);
    def(target, isReadonly2 ? "__v_readonly" : "__v_reactive", observed);
    return observed;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isProxy(value) {
    return isReactive(value) || isReadonly(value);
  }
  function toRaw(observed) {
    return observed && toRaw(observed["__v_raw"]) || observed;
  }
  function markRaw(value) {
    def(value, "__v_skip", true);
    return value;
  }
  const convert = (val) => isObject(val) ? reactive(val) : val;
  function isRef(r) {
    return r ? r.__v_isRef === true : false;
  }
  function ref(value) {
    return createRef(value);
  }
  function shallowRef(value) {
    return createRef(value, true);
  }
  function createRef(rawValue, shallow = false) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    let value = shallow ? rawValue : convert(rawValue);
    const r = {
      __v_isRef: true,
      get value() {
        track(r, "get", "value");
        return value;
      },
      set value(newVal) {
        if (hasChanged(toRaw(newVal), rawValue)) {
          rawValue = newVal;
          value = shallow ? newVal : convert(newVal);
          trigger(r, "set", "value", {newValue: newVal});
        }
      }
    };
    return r;
  }
  function triggerRef(ref2) {
    trigger(ref2, "set", "value", {newValue: ref2.value});
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  function customRef(factory) {
    const {get: get2, set: set2} = factory(() => track(r, "get", "value"), () => trigger(r, "set", "value"));
    const r = {
      __v_isRef: true,
      get value() {
        return get2();
      },
      set value(v) {
        set2(v);
      }
    };
    return r;
  }
  function toRefs(object) {
    if (!isProxy(object)) {
      console.warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = {};
    for (const key in object) {
      ret[key] = toRef(object, key);
    }
    return ret;
  }
  function toRef(object, key) {
    return {
      __v_isRef: true,
      get value() {
        return object[key];
      },
      set value(newVal) {
        object[key] = newVal;
      }
    };
  }
  function computed(getterOrOptions) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
      setter = () => {
        console.warn("Write operation failed: computed value is readonly");
      };
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    let dirty = true;
    let value;
    let computed2;
    const runner = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!dirty) {
          dirty = true;
          trigger(computed2, "set", "value");
        }
      }
    });
    computed2 = {
      __v_isRef: true,
      effect: runner,
      get value() {
        if (dirty) {
          value = runner();
          dirty = false;
        }
        track(computed2, "get", "value");
        return value;
      },
      set value(newValue) {
        setter(newValue);
      }
    };
    return computed2;
  }
  const stack = [];
  function pushWarningContext(vnode) {
    stack.push(vnode);
  }
  function popWarningContext() {
    stack.pop();
  }
  function warn(msg, ...args) {
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(appWarnHandler, instance, 11, [
        msg + args.join(""),
        instance && instance.proxy,
        trace.map(({vnode}) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
        trace
      ]);
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last2 = normalizedStack[0];
      if (last2 && last2.vnode === currentVNode) {
        last2.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({vnode, recurseCount}) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  const ErrorTypeStrings = {
    ["bc"]: "beforeCreate hook",
    ["c"]: "created hook",
    ["bm"]: "beforeMount hook",
    ["m"]: "mounted hook",
    ["bu"]: "beforeUpdate hook",
    ["u"]: "updated",
    ["bum"]: "beforeUnmount hook",
    ["um"]: "unmounted hook",
    ["a"]: "activated hook",
    ["da"]: "deactivated hook",
    ["ec"]: "errorCaptured hook",
    ["rtc"]: "renderTracked hook",
    ["rtg"]: "renderTriggered hook",
    [0]: "setup function",
    [1]: "render function",
    [2]: "watcher getter",
    [3]: "watcher callback",
    [4]: "watcher cleanup function",
    [5]: "native event handler",
    [6]: "component event handler",
    [7]: "vnode hook",
    [8]: "directive hook",
    [9]: "transition hook",
    [10]: "app errorHandler",
    [11]: "app warnHandler",
    [12]: "ref function",
    [13]: "async component loader",
    [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/vue-next"
  };
  function callWithErrorHandling(fn, instance, type, args) {
    let res;
    try {
      res = args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
    return res;
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
  function handleError(err, instance, type) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = ErrorTypeStrings[type];
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo)) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      const appErrorHandler = instance.appContext.config.errorHandler;
      if (appErrorHandler) {
        callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
        return;
      }
    }
    logError(err, type, contextVNode);
  }
  function logError(err, type, contextVNode) {
    {
      const info = ErrorTypeStrings[type];
      if (contextVNode) {
        pushWarningContext(contextVNode);
      }
      warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
      console.error(err);
      if (contextVNode) {
        popWarningContext();
      }
    }
  }
  const queue = [];
  const postFlushCbs = [];
  const p = Promise.resolve();
  let isFlushing = false;
  let isFlushPending = false;
  const RECURSION_LIMIT = 100;
  function nextTick(fn) {
    return fn ? p.then(fn) : p;
  }
  function queueJob(job) {
    if (!queue.includes(job)) {
      queue.push(job);
      queueFlush();
    }
  }
  function invalidateJob(job) {
    const i = queue.indexOf(job);
    if (i > -1) {
      queue[i] = null;
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      postFlushCbs.push(cb);
    } else {
      postFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function queueFlush() {
    if (!isFlushing && !isFlushPending) {
      isFlushPending = true;
      nextTick(flushJobs);
    }
  }
  function flushPostFlushCbs(seen) {
    if (postFlushCbs.length) {
      const cbs = [...new Set(postFlushCbs)];
      postFlushCbs.length = 0;
      {
        seen = seen || new Map();
      }
      for (let i = 0; i < cbs.length; i++) {
        {
          checkRecursiveUpdates(seen, cbs[i]);
        }
        cbs[i]();
      }
    }
  }
  const getId = (job) => job.id == null ? Infinity : job.id;
  function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    let job;
    {
      seen = seen || new Map();
    }
    queue.sort((a, b) => getId(a) - getId(b));
    while ((job = queue.shift()) !== void 0) {
      if (job === null) {
        continue;
      }
      {
        checkRecursiveUpdates(seen, job);
      }
      callWithErrorHandling(job, null, 14);
    }
    flushPostFlushCbs(seen);
    isFlushing = false;
    if (queue.length || postFlushCbs.length) {
      flushJobs(seen);
    }
  }
  function checkRecursiveUpdates(seen, fn) {
    if (!seen.has(fn)) {
      seen.set(fn, 1);
    } else {
      const count = seen.get(fn);
      if (count > RECURSION_LIMIT) {
        throw new Error("Maximum recursive updates exceeded. You may have code that is mutating state in your component's render function or updated hook or watcher source function.");
      } else {
        seen.set(fn, count + 1);
      }
    }
  }
  let isHmrUpdating = false;
  const hmrDirtyComponents = new Set();
  {
    const globalObject = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
    globalObject.__VUE_HMR_RUNTIME__ = {
      createRecord: tryWrap(createRecord),
      rerender: tryWrap(rerender),
      reload: tryWrap(reload)
    };
  }
  const map = new Map();
  function registerHMR(instance) {
    const id = instance.type.__hmrId;
    let record = map.get(id);
    if (!record) {
      createRecord(id);
      record = map.get(id);
    }
    record.add(instance);
  }
  function unregisterHMR(instance) {
    map.get(instance.type.__hmrId).delete(instance);
  }
  function createRecord(id) {
    if (map.has(id)) {
      return false;
    }
    map.set(id, new Set());
    return true;
  }
  function rerender(id, newRender) {
    const record = map.get(id);
    if (!record)
      return;
    Array.from(record).forEach((instance) => {
      if (newRender) {
        instance.render = newRender;
      }
      instance.renderCache = [];
      isHmrUpdating = true;
      instance.update();
      isHmrUpdating = false;
    });
  }
  function reload(id, newComp) {
    const record = map.get(id);
    if (!record)
      return;
    Array.from(record).forEach((instance) => {
      const comp = instance.type;
      if (!hmrDirtyComponents.has(comp)) {
        extend(comp, newComp);
        for (const key in comp) {
          if (!(key in newComp)) {
            delete comp[key];
          }
        }
        hmrDirtyComponents.add(comp);
        queuePostFlushCb(() => {
          hmrDirtyComponents.delete(comp);
        });
      }
      if (instance.parent) {
        queueJob(instance.parent.update);
      } else if (instance.appContext.reload) {
        instance.appContext.reload();
      } else if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        console.warn("[HMR] Root or manually mounted instance modified. Full reload required.");
      }
    });
  }
  function tryWrap(fn) {
    return (id, arg) => {
      try {
        return fn(id, arg);
      } catch (e) {
        console.error(e);
        console.warn(`[HMR] Something went wrong during Vue component hot-reload. Full reload required.`);
      }
    };
  }
  let currentRenderingInstance = null;
  function setCurrentRenderingInstance(instance) {
    currentRenderingInstance = instance;
  }
  let accessedAttrs = false;
  function markAttrsAccessed() {
    accessedAttrs = true;
  }
  function renderComponentRoot(instance) {
    const {type: Component, parent, vnode, proxy, withProxy, props, slots, attrs, emit: emit2, renderCache} = instance;
    let result;
    currentRenderingInstance = instance;
    {
      accessedAttrs = false;
    }
    try {
      let fallthroughAttrs;
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        result = normalizeVNode(instance.render.call(proxyToUse, proxyToUse, renderCache));
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if (attrs === props) {
          markAttrsAccessed();
        }
        result = normalizeVNode(render2.length > 1 ? render2(props, {
          get attrs() {
            markAttrsAccessed();
            return attrs;
          },
          slots,
          emit: emit2
        }) : render2(props, null));
        fallthroughAttrs = Component.props ? attrs : getFallthroughAttrs(attrs);
      }
      let root = result;
      let setRoot = void 0;
      if (true) {
        ;
        [root, setRoot] = getChildRoot(result);
      }
      if (Component.inheritAttrs !== false && fallthroughAttrs && Object.keys(fallthroughAttrs).length) {
        if (root.shapeFlag & 1 || root.shapeFlag & 6) {
          root = cloneVNode(root, fallthroughAttrs);
        } else if (!accessedAttrs && root.type !== Comment) {
          const allAttrs = Object.keys(attrs);
          const eventAttrs = [];
          const extraAttrs = [];
          for (let i = 0, l = allAttrs.length; i < l; i++) {
            const key = allAttrs[i];
            if (isOn(key)) {
              if (!key.startsWith("onUpdate:")) {
                eventAttrs.push(key[2].toLowerCase() + key.slice(3));
              }
            } else {
              extraAttrs.push(key);
            }
          }
          if (extraAttrs.length) {
            warn(`Extraneous non-props attributes (${extraAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes.`);
          }
          if (eventAttrs.length) {
            warn(`Extraneous non-emits event listeners (${eventAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`);
          }
        }
      }
      const scopeId = vnode.scopeId;
      const treeOwnerId = parent && parent.type.__scopeId;
      const slotScopeId = treeOwnerId && treeOwnerId !== scopeId ? treeOwnerId + "-s" : null;
      if (scopeId || slotScopeId) {
        const extras = {};
        if (scopeId)
          extras[scopeId] = "";
        if (slotScopeId)
          extras[slotScopeId] = "";
        root = cloneVNode(root, extras);
      }
      if (vnode.dirs) {
        if (!isElementRoot(root)) {
          warn(`Runtime directive used on component with non-element root node. The directives will not function as intended.`);
        }
        root.dirs = vnode.dirs;
      }
      if (vnode.transition) {
        if (!isElementRoot(root)) {
          warn(`Component inside <Transition> renders non-element root node that cannot be animated.`);
        }
        root.transition = vnode.transition;
      }
      if (setRoot) {
        setRoot(root);
      } else {
        result = root;
      }
    } catch (err) {
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    currentRenderingInstance = null;
    return result;
  }
  const getChildRoot = (vnode) => {
    if (vnode.type !== Fragment) {
      return [vnode, void 0];
    }
    const rawChildren = vnode.children;
    const dynamicChildren = vnode.dynamicChildren;
    const children = rawChildren.filter((child) => {
      return !(isVNode(child) && child.type === Comment);
    });
    if (children.length !== 1) {
      return [vnode, void 0];
    }
    const childRoot = children[0];
    const index = rawChildren.indexOf(childRoot);
    const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : null;
    const setRoot = (updatedRoot) => {
      rawChildren[index] = updatedRoot;
      if (dynamicIndex !== null)
        dynamicChildren[dynamicIndex] = updatedRoot;
    };
    return [normalizeVNode(childRoot), setRoot];
  };
  const getFallthroughAttrs = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const isElementRoot = (vnode) => {
    return vnode.shapeFlag & 6 || vnode.shapeFlag & 1 || vnode.type === Comment;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const {props: prevProps, children: prevChildren} = prevVNode;
    const {props: nextProps, children: nextChildren, patchFlag} = nextVNode;
    if ((prevChildren || nextChildren) && isHmrUpdating) {
      return true;
    }
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (patchFlag > 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key]) {
            return true;
          }
        }
      }
    } else if (!optimized) {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key]) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({vnode, parent}, el) {
    while (parent && parent.subTree === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    }
  }
  const isSuspense = (type) => type.__isSuspense;
  const SuspenseImpl = {
    __isSuspense: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, rendererInternals) {
      if (n1 == null) {
        mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, rendererInternals);
      } else {
        patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, optimized, rendererInternals);
      }
    },
    hydrate: hydrateSuspense
  };
  const Suspense = SuspenseImpl;
  function mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, rendererInternals) {
    const {p: patch, o: {createElement}} = rendererInternals;
    const hiddenContainer = createElement("div");
    const suspense = n2.suspense = createSuspenseBoundary(n2, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, optimized, rendererInternals);
    patch(null, suspense.subTree, hiddenContainer, null, parentComponent, suspense, isSVG, optimized);
    if (suspense.deps > 0) {
      patch(null, suspense.fallbackTree, container, anchor, parentComponent, null, isSVG, optimized);
      n2.el = suspense.fallbackTree.el;
    } else {
      suspense.resolve();
    }
  }
  function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, optimized, {p: patch}) {
    const suspense = n2.suspense = n1.suspense;
    suspense.vnode = n2;
    const {content, fallback} = normalizeSuspenseChildren(n2);
    const oldSubTree = suspense.subTree;
    const oldFallbackTree = suspense.fallbackTree;
    if (!suspense.isResolved) {
      patch(oldSubTree, content, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, optimized);
      if (suspense.deps > 0) {
        patch(oldFallbackTree, fallback, container, anchor, parentComponent, null, isSVG, optimized);
        n2.el = fallback.el;
      }
    } else {
      patch(oldSubTree, content, container, anchor, parentComponent, suspense, isSVG, optimized);
      n2.el = content.el;
    }
    suspense.subTree = content;
    suspense.fallbackTree = fallback;
  }
  let hasWarned = false;
  function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, optimized, rendererInternals, isHydrating = false) {
    if (!hasWarned) {
      hasWarned = true;
      console[console.info ? "info" : "log"](`<Suspense> is an experimental feature and its API will likely change.`);
    }
    const {p: patch, m: move, um: unmount, n: next, o: {parentNode}} = rendererInternals;
    const getCurrentTree = () => suspense.isResolved || suspense.isHydrating ? suspense.subTree : suspense.fallbackTree;
    const {content, fallback} = normalizeSuspenseChildren(vnode);
    const suspense = {
      vnode,
      parent,
      parentComponent,
      isSVG,
      optimized,
      container,
      hiddenContainer,
      anchor,
      deps: 0,
      subTree: content,
      fallbackTree: fallback,
      isHydrating,
      isResolved: false,
      isUnmounted: false,
      effects: [],
      resolve() {
        {
          if (suspense.isResolved) {
            throw new Error(`resolveSuspense() is called on an already resolved suspense boundary.`);
          }
          if (suspense.isUnmounted) {
            throw new Error(`resolveSuspense() is called on an already unmounted suspense boundary.`);
          }
        }
        const {vnode: vnode2, subTree, fallbackTree, effects, parentComponent: parentComponent2, container: container2} = suspense;
        if (suspense.isHydrating) {
          suspense.isHydrating = false;
        } else {
          let {anchor: anchor2} = suspense;
          if (fallbackTree.el) {
            anchor2 = next(fallbackTree);
            unmount(fallbackTree, parentComponent2, suspense, true);
          }
          move(subTree, container2, anchor2, 0);
        }
        const el = vnode2.el = subTree.el;
        if (parentComponent2 && parentComponent2.subTree === vnode2) {
          parentComponent2.vnode.el = el;
          updateHOCHostEl(parentComponent2, el);
        }
        let parent2 = suspense.parent;
        let hasUnresolvedAncestor = false;
        while (parent2) {
          if (!parent2.isResolved) {
            parent2.effects.push(...effects);
            hasUnresolvedAncestor = true;
            break;
          }
          parent2 = parent2.parent;
        }
        if (!hasUnresolvedAncestor) {
          queuePostFlushCb(effects);
        }
        suspense.isResolved = true;
        suspense.effects = [];
        const onResolve = vnode2.props && vnode2.props.onResolve;
        if (isFunction(onResolve)) {
          onResolve();
        }
      },
      recede() {
        suspense.isResolved = false;
        const {vnode: vnode2, subTree, fallbackTree, parentComponent: parentComponent2, container: container2, hiddenContainer: hiddenContainer2, isSVG: isSVG2, optimized: optimized2} = suspense;
        const anchor2 = next(subTree);
        move(subTree, hiddenContainer2, null, 1);
        patch(null, fallbackTree, container2, anchor2, parentComponent2, null, isSVG2, optimized2);
        const el = vnode2.el = fallbackTree.el;
        if (parentComponent2 && parentComponent2.subTree === vnode2) {
          parentComponent2.vnode.el = el;
          updateHOCHostEl(parentComponent2, el);
        }
        const onRecede = vnode2.props && vnode2.props.onRecede;
        if (isFunction(onRecede)) {
          onRecede();
        }
      },
      move(container2, anchor2, type) {
        move(getCurrentTree(), container2, anchor2, type);
        suspense.container = container2;
      },
      next() {
        return next(getCurrentTree());
      },
      registerDep(instance, setupRenderEffect) {
        if (suspense.isResolved) {
          queueJob(() => {
            suspense.recede();
          });
        }
        const hydratedEl = instance.vnode.el;
        suspense.deps++;
        instance.asyncDep.catch((err) => {
          handleError(err, instance, 0);
        }).then((asyncSetupResult) => {
          if (instance.isUnmounted || suspense.isUnmounted) {
            return;
          }
          suspense.deps--;
          instance.asyncResolved = true;
          const {vnode: vnode2} = instance;
          {
            pushWarningContext(vnode2);
          }
          handleSetupResult(instance, asyncSetupResult);
          if (hydratedEl) {
            vnode2.el = hydratedEl;
          }
          setupRenderEffect(instance, vnode2, hydratedEl ? parentNode(hydratedEl) : parentNode(instance.subTree.el), hydratedEl ? null : next(instance.subTree), suspense, isSVG, optimized);
          updateHOCHostEl(instance, vnode2.el);
          {
            popWarningContext();
          }
          if (suspense.deps === 0) {
            suspense.resolve();
          }
        });
      },
      unmount(parentSuspense, doRemove) {
        suspense.isUnmounted = true;
        unmount(suspense.subTree, parentComponent, parentSuspense, doRemove);
        if (!suspense.isResolved) {
          unmount(suspense.fallbackTree, parentComponent, parentSuspense, doRemove);
        }
      }
    };
    return suspense;
  }
  function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, optimized, rendererInternals, hydrateNode) {
    const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement("div"), null, isSVG, optimized, rendererInternals, true);
    const result = hydrateNode(node, suspense.subTree, parentComponent, suspense, optimized);
    if (suspense.deps === 0) {
      suspense.resolve();
    }
    return result;
  }
  function normalizeSuspenseChildren(vnode) {
    const {shapeFlag, children} = vnode;
    if (shapeFlag & 32) {
      const {default: d, fallback} = children;
      return {
        content: normalizeVNode(isFunction(d) ? d() : d),
        fallback: normalizeVNode(isFunction(fallback) ? fallback() : fallback)
      };
    } else {
      return {
        content: normalizeVNode(children),
        fallback: normalizeVNode(null)
      };
    }
  }
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && !suspense.isResolved) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  function withCtx(fn, ctx = currentRenderingInstance) {
    if (!ctx)
      return fn;
    return function renderFnWithContext() {
      const owner = currentRenderingInstance;
      setCurrentRenderingInstance(ctx);
      const res = fn.apply(null, arguments);
      setCurrentRenderingInstance(owner);
      return res;
    };
  }
  let currentScopeId = null;
  const scopeIdStack = [];
  function pushScopeId(id) {
    scopeIdStack.push(currentScopeId = id);
  }
  function popScopeId() {
    scopeIdStack.pop();
    currentScopeId = scopeIdStack[scopeIdStack.length - 1] || null;
  }
  function withScopeId(id) {
    return (fn) => withCtx(function() {
      pushScopeId(id);
      const res = fn.apply(this, arguments);
      popScopeId();
      return res;
    });
  }
  const isTeleport = (type) => type.__isTeleport;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
  const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (isString(targetSelector)) {
      if (!select) {
        warn(`Current renderer does not support string target for Teleports. (missing querySelector renderer option)`);
        return null;
      } else {
        const target = select(targetSelector);
        if (!target) {
          warn(`Failed to locate Teleport target with selector "${targetSelector}".`);
        }
        return target;
      }
    } else {
      if (!targetSelector) {
        warn(`Invalid Teleport target: ${targetSelector}`);
      }
      return targetSelector;
    }
  };
  const TeleportImpl = {
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals) {
      const {mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: {insert, querySelector, createText, createComment}} = internals;
      const disabled = isTeleportDisabled(n2.props);
      const {shapeFlag, children} = n2;
      if (n1 == null) {
        const placeholder = n2.el = createComment("teleport start");
        const mainAnchor = n2.anchor = createComment("teleport end");
        insert(placeholder, container, anchor);
        insert(mainAnchor, container, anchor);
        const target = n2.target = resolveTarget(n2.props, querySelector);
        const targetAnchor = n2.targetAnchor = createText("");
        if (target) {
          insert(targetAnchor, target);
        } else {
          warn("Invalid Teleport target on mount:", target, `(${typeof target})`);
        }
        const mount = (container2, anchor2) => {
          if (shapeFlag & 16) {
            mountChildren(children, container2, anchor2, parentComponent, parentSuspense, isSVG, optimized);
          }
        };
        if (disabled) {
          mount(container, mainAnchor);
        } else if (target) {
          mount(target, targetAnchor);
        }
      } else {
        n2.el = n1.el;
        const mainAnchor = n2.anchor = n1.anchor;
        const target = n2.target = n1.target;
        const targetAnchor = n2.targetAnchor = n1.targetAnchor;
        const wasDisabled = isTeleportDisabled(n1.props);
        const currentContainer = wasDisabled ? container : target;
        const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
        if (n2.dynamicChildren) {
          patchBlockChildren(n1.dynamicChildren, n2.dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG);
        } else if (!optimized) {
          patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG);
        }
        if (disabled) {
          if (!wasDisabled) {
            moveTeleport(n2, container, mainAnchor, internals, 1);
          }
        } else {
          if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
            const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
            if (nextTarget) {
              moveTeleport(n2, nextTarget, null, internals, 0);
            } else {
              warn("Invalid Teleport target on update:", target, `(${typeof target})`);
            }
          } else if (wasDisabled) {
            moveTeleport(n2, target, targetAnchor, internals, 1);
          }
        }
      }
    },
    remove(vnode, {r: remove2, o: {remove: hostRemove}}) {
      const {shapeFlag, children, anchor} = vnode;
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          remove2(children[i]);
        }
      }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
  };
  function moveTeleport(vnode, container, parentAnchor, {o: {insert}, m: move}, moveType = 2) {
    if (moveType === 0) {
      insert(vnode.targetAnchor, container, parentAnchor);
    }
    const {el, anchor, shapeFlag, children, props} = vnode;
    const isReorder = moveType === 2;
    if (isReorder) {
      insert(el, container, parentAnchor);
    }
    if (!isReorder || isTeleportDisabled(props)) {
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, parentAnchor, 2);
        }
      }
    }
    if (isReorder) {
      insert(anchor, container, parentAnchor);
    }
  }
  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, optimized, {o: {nextSibling, parentNode, querySelector}}, hydrateChildren) {
    const target = vnode.target = resolveTarget(vnode.props, querySelector);
    if (target) {
      const targetNode = target._lpa || target.firstChild;
      if (vnode.shapeFlag & 16) {
        if (isTeleportDisabled(vnode.props)) {
          vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, optimized);
          vnode.targetAnchor = targetNode;
        } else {
          vnode.anchor = nextSibling(node);
          vnode.targetAnchor = hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, optimized);
        }
        target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
      }
    }
    return vnode.anchor && nextSibling(vnode.anchor);
  }
  const Teleport = TeleportImpl;
  const COMPONENTS = "components";
  const DIRECTIVES = "directives";
  function resolveComponent(name) {
    return resolveAsset(COMPONENTS, name) || name;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol();
  function resolveDynamicComponent(component) {
    if (isString(component)) {
      return resolveAsset(COMPONENTS, component, false) || component;
    } else {
      return component || NULL_DYNAMIC_COMPONENT;
    }
  }
  function resolveDirective(name) {
    return resolveAsset(DIRECTIVES, name);
  }
  function resolveAsset(type, name, warnMissing = true) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
      let camelized, capitalized;
      const registry = instance[type];
      let res = registry[name] || registry[camelized = camelize(name)] || registry[capitalized = capitalize(camelized)];
      if (!res && type === COMPONENTS) {
        const self2 = instance.type;
        const selfName = self2.displayName || self2.name;
        if (selfName && (selfName === name || selfName === camelized || selfName === capitalized)) {
          res = self2;
        }
      }
      if (warnMissing && !res) {
        warn(`Failed to resolve ${type.slice(0, -1)}: ${name}`);
      }
      return res;
    } else {
      warn(`resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`);
    }
  }
  const Fragment = Symbol("Fragment");
  const Text = Symbol("Text");
  const Comment = Symbol("Comment");
  const Static = Symbol("Static");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  let shouldTrack$1 = 1;
  function setBlockTracking(value) {
    shouldTrack$1 += value;
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    const vnode = createVNode(type, props, children, patchFlag, dynamicProps, true);
    vnode.dynamicChildren = currentBlock || EMPTY_ARR;
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
    if (currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    if (n2.shapeFlag & 6 && hmrDirtyComponents.has(n2.type)) {
      return false;
    }
    return n1.type === n2.type && n1.key === n2.key;
  }
  let vnodeArgsTransformer;
  function transformVNodeArgs(transformer) {
    vnodeArgsTransformer = transformer;
  }
  const createVNodeWithArgsTransform = (...args) => {
    return _createVNode(...vnodeArgsTransformer ? vnodeArgsTransformer(args, currentRenderingInstance) : args);
  };
  const InternalObjectKey = `__vInternal`;
  const normalizeKey = ({key}) => key != null ? key : null;
  const normalizeRef = ({ref: ref2}) => {
    return ref2 != null ? isArray(ref2) ? ref2 : [currentRenderingInstance, ref2] : null;
  };
  const createVNode = createVNodeWithArgsTransform;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      if (!type) {
        warn(`Invalid vnode type when creating vnode: ${type}.`);
      }
      type = Comment;
    }
    if (isVNode(type)) {
      return cloneVNode(type, props, children);
    }
    if (isFunction(type) && "__vccOpts" in type) {
      type = type.__vccOpts;
    }
    if (props) {
      if (isProxy(props) || InternalObjectKey in props) {
        props = extend({}, props);
      }
      let {class: klass, style} = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject(style)) {
        if (isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
    if (shapeFlag & 4 && isProxy(type)) {
      type = toRaw(type);
      warn(`Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with \`markRaw\` or using \`shallowRef\` instead of \`ref\`.`, `
Component that was made reactive: `, type);
    }
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      children: null,
      component: null,
      suspense: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null
    };
    if (vnode.key !== vnode.key) {
      warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
    }
    normalizeChildren(vnode, children);
    if (shouldTrack$1 > 0 && !isBlockNode && currentBlock && patchFlag !== 32 && (patchFlag > 0 || shapeFlag & 128 || shapeFlag & 64 || shapeFlag & 4 || shapeFlag & 2)) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function cloneVNode(vnode, extraProps, children) {
    const props = extraProps ? vnode.props ? mergeProps(vnode.props, extraProps) : extend({}, extraProps) : vnode.props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props,
      key: props && normalizeKey(props),
      ref: extraProps && extraProps.ref ? normalizeRef(extraProps) : vnode.ref,
      scopeId: vnode.scopeId,
      children: vnode.children,
      target: vnode.target,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      patchFlag: extraProps ? vnode.dynamicChildren ? vnode.patchFlag | 16 : -2 : vnode.patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition: vnode.transition,
      component: vnode.component,
      suspense: vnode.suspense,
      el: vnode.el,
      anchor: vnode.anchor
    };
    if (children) {
      normalizeChildren(cloned, children);
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createStaticVNode(content, numberOfNodes) {
    const vnode = createVNode(Static, null, content);
    vnode.staticCount = numberOfNodes;
    return vnode;
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray(child)) {
      return createVNode(Fragment, null, child);
    } else if (typeof child === "object") {
      return child.el === null ? child : cloneVNode(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const {shapeFlag} = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if ((shapeFlag & 1 || shapeFlag & 64) && children.default) {
        normalizeChildren(vnode, children.default());
        return;
      } else {
        type = 32;
        if (!children._ && !(InternalObjectKey in children)) {
          children._ctx = currentRenderingInstance;
        }
      }
    } else if (isFunction(children)) {
      children = {default: children, _ctx: currentRenderingInstance};
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  const handlersRE = /^on|^vnode/;
  function mergeProps(...args) {
    const ret = extend({}, args[0]);
    for (let i = 1; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (handlersRE.test(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (existing !== incoming) {
            ret[key] = existing ? [].concat(existing, toMerge[key]) : incoming;
          }
        } else {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function emit(instance, event, ...args) {
    const props = instance.vnode.props || EMPTY_OBJ;
    {
      const options = normalizeEmitsOptions(instance.type.emits);
      if (options) {
        if (!(event in options)) {
          const propsOptions = normalizePropsOptions(instance.type)[0];
          if (!propsOptions || !(`on` + capitalize(event) in propsOptions)) {
            warn(`Component emitted event "${event}" but it is neither declared in the emits option nor as an "on${capitalize(event)}" prop.`);
          }
        } else {
          const validator = options[event];
          if (isFunction(validator)) {
            const isValid = validator(...args);
            if (!isValid) {
              warn(`Invalid event arguments: event validation failed for event "${event}".`);
            }
          }
        }
      }
    }
    let handler = props[`on${capitalize(event)}`];
    if (!handler && event.startsWith("update:")) {
      event = hyphenate(event);
      handler = props[`on${capitalize(event)}`];
    }
    if (handler) {
      callWithAsyncErrorHandling(handler, instance, 6, args);
    }
  }
  function normalizeEmitsOptions(options) {
    if (!options) {
      return;
    } else if (isArray(options)) {
      if (options._n) {
        return options._n;
      }
      const normalized = {};
      options.forEach((key) => normalized[key] = null);
      def(options, "_n", normalized);
      return normalized;
    } else {
      return options;
    }
  }
  function isEmitListener(emits, key) {
    return isOn(key) && (hasOwn(emits = normalizeEmitsOptions(emits), key[2].toLowerCase() + key.slice(3)) || hasOwn(emits, key.slice(2)));
  }
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = {};
    def(attrs, InternalObjectKey, 1);
    setFullProps(instance, rawProps, props, attrs);
    {
      validateProps(props, instance.type);
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {props, attrs, vnode: {patchFlag}} = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = normalizePropsOptions(instance.type);
    if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          const key = propsToUpdate[i];
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              attrs[key] = value;
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value);
            }
          } else {
            attrs[key] = value;
          }
        }
      }
    } else {
      setFullProps(instance, rawProps, props, attrs);
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(options, rawProps || EMPTY_OBJ, key, void 0);
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key)) {
            delete attrs[key];
          }
        }
      }
    }
    trigger(instance, "set", "$attrs");
    if (rawProps) {
      validateProps(props, instance.type);
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = normalizePropsOptions(instance.type);
    const emits = instance.type.emits;
    if (rawProps) {
      for (const key in rawProps) {
        const value = rawProps[key];
        if (isReservedProp(key)) {
          continue;
        }
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          props[camelKey] = value;
        } else if (!emits || !isEmitListener(emits, key)) {
          attrs[key] = value;
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(options, rawCurrentProps, key, rawCurrentProps[key]);
      }
    }
  }
  function resolvePropValue(options, props, key, value) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        value = opt.type !== Function && isFunction(defaultValue) ? defaultValue() : defaultValue;
      }
      if (opt[0]) {
        if (!hasOwn(props, key) && !hasDefault) {
          value = false;
        } else if (opt[1] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  function normalizePropsOptions(comp) {
    if (comp.__props) {
      return comp.__props;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        const [props, keys] = normalizePropsOptions(raw2);
        extend(normalized, props);
        if (keys)
          needCastKeys.push(...keys);
      };
      if (comp.extends) {
        hasExtends = true;
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        hasExtends = true;
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      return comp.__props = EMPTY_ARR;
    }
    if (isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        if (!isString(raw[i])) {
          warn(`props must be strings when using array syntax.`, raw[i]);
        }
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      if (!isObject(raw)) {
        warn(`invalid props options`, raw);
      }
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? {type: opt} : opt;
          if (prop) {
            const booleanIndex = getTypeIndex(Boolean, prop.type);
            const stringIndex = getTypeIndex(String, prop.type);
            prop[0] = booleanIndex > -1;
            prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
            if (booleanIndex > -1 || hasOwn(prop, "default")) {
              needCastKeys.push(normalizedKey);
            }
          }
        }
      }
    }
    const normalizedEntry = [normalized, needCastKeys];
    comp.__props = normalizedEntry;
    return normalizedEntry;
  }
  function getType(ctor) {
    const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : "";
  }
  function isSameType(a, b) {
    return getType(a) === getType(b);
  }
  function getTypeIndex(type, expectedTypes) {
    if (isArray(expectedTypes)) {
      for (let i = 0, len = expectedTypes.length; i < len; i++) {
        if (isSameType(expectedTypes[i], type)) {
          return i;
        }
      }
    } else if (isFunction(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1;
    }
    return -1;
  }
  function validateProps(props, comp) {
    const rawValues = toRaw(props);
    const options = normalizePropsOptions(comp)[0];
    for (const key in options) {
      let opt = options[key];
      if (opt == null)
        continue;
      validateProp(key, rawValues[key], opt, !hasOwn(rawValues, key));
    }
  }
  function validatePropName(key) {
    if (key[0] !== "$") {
      return true;
    } else {
      warn(`Invalid prop name: "${key}" is a reserved property.`);
    }
    return false;
  }
  function validateProp(name, value, prop, isAbsent) {
    const {type, required, validator} = prop;
    if (required && isAbsent) {
      warn('Missing required prop: "' + name + '"');
      return;
    }
    if (value == null && !prop.required) {
      return;
    }
    if (type != null && type !== true) {
      let isValid = false;
      const types2 = isArray(type) ? type : [type];
      const expectedTypes = [];
      for (let i = 0; i < types2.length && !isValid; i++) {
        const {valid, expectedType} = assertType(value, types2[i]);
        expectedTypes.push(expectedType || "");
        isValid = valid;
      }
      if (!isValid) {
        warn(getInvalidTypeMessage(name, value, expectedTypes));
        return;
      }
    }
    if (validator && !validator(value)) {
      warn('Invalid prop: custom validator check failed for prop "' + name + '".');
    }
  }
  const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
  function assertType(value, type) {
    let valid;
    const expectedType = getType(type);
    if (isSimpleType(expectedType)) {
      const t = typeof value;
      valid = t === expectedType.toLowerCase();
      if (!valid && t === "object") {
        valid = value instanceof type;
      }
    } else if (expectedType === "Object") {
      valid = toRawType(value) === "Object";
    } else if (expectedType === "Array") {
      valid = isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid,
      expectedType
    };
  }
  function getInvalidTypeMessage(name, value, expectedTypes) {
    let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
    const expectedType = expectedTypes[0];
    const receivedType = toRawType(value);
    const expectedValue = styleValue(value, expectedType);
    const receivedValue = styleValue(value, receivedType);
    if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
      message += ` with value ${expectedValue}`;
    }
    message += `, got ${receivedType} `;
    if (isExplicable(receivedType)) {
      message += `with value ${receivedValue}.`;
    }
    return message;
  }
  function styleValue(value, type) {
    if (type === "String") {
      return `"${value}"`;
    } else if (type === "Number") {
      return `${Number(value)}`;
    } else {
      return `${value}`;
    }
  }
  function isExplicable(type) {
    const explicitTypes = ["string", "number", "boolean"];
    return explicitTypes.some((elem) => type.toLowerCase() === elem);
  }
  function isBoolean(...args) {
    return args.some((elem) => elem.toLowerCase() === "boolean");
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks3 = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        if (target.isUnmounted) {
          return;
        }
        pauseTracking();
        setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        setCurrentInstance(null);
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks3.unshift(wrappedHook);
      } else {
        hooks3.push(wrappedHook);
      }
    } else {
      const apiName = `on${capitalize(ErrorTypeStrings[type].replace(/ hook$/, ""))}`;
      warn(`${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`);
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => !isInSSRComponentSetup && injectHook(lifecycle, hook, target);
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook("bu");
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook("bum");
  const onUnmounted = createHook("um");
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  const onErrorCaptured = (hook, target = currentInstance) => {
    injectHook("ec", hook, target);
  };
  function useTransitionState() {
    const state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: new Map()
    };
    onMounted(() => {
      state.isMounted = true;
    });
    onBeforeUnmount(() => {
      state.isUnmounting = true;
    });
    return state;
  }
  const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: {
      mode: String,
      appear: Boolean,
      persisted: Boolean,
      onBeforeEnter: Function,
      onEnter: Function,
      onAfterEnter: Function,
      onEnterCancelled: Function,
      onBeforeLeave: Function,
      onLeave: Function,
      onAfterLeave: Function,
      onLeaveCancelled: Function,
      onBeforeAppear: Function,
      onAppear: Function,
      onAfterAppear: Function,
      onAppearCancelled: Function
    },
    setup(props, {slots}) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      let prevTransitionKey;
      return () => {
        const children = slots.default && getTransitionRawChildren(slots.default(), true);
        if (!children || !children.length) {
          return;
        }
        if (children.length > 1) {
          warn("<transition> can only be used on a single element or component. Use <transition-group> for lists.");
        }
        const rawProps = toRaw(props);
        const {mode} = rawProps;
        if (mode && !["in-out", "out-in", "default"].includes(mode)) {
          warn(`invalid <transition> mode: ${mode}`);
        }
        const child = children[0];
        if (state.isLeaving) {
          return emptyPlaceholder(child);
        }
        const innerChild = getKeepAliveChild(child);
        if (!innerChild) {
          return emptyPlaceholder(child);
        }
        const enterHooks = innerChild.transition = resolveTransitionHooks(innerChild, rawProps, state, instance);
        const oldChild = instance.subTree;
        const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
        let transitionKeyChanged = false;
        const {getTransitionKey} = innerChild.type;
        if (getTransitionKey) {
          const key = getTransitionKey();
          if (prevTransitionKey === void 0) {
            prevTransitionKey = key;
          } else if (key !== prevTransitionKey) {
            prevTransitionKey = key;
            transitionKeyChanged = true;
          }
        }
        if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
          const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
          setTransitionHooks(oldInnerChild, leavingHooks);
          if (mode === "out-in") {
            state.isLeaving = true;
            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              instance.update();
            };
            return emptyPlaceholder(child);
          } else if (mode === "in-out") {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
              el._leaveCb = () => {
                earlyRemove();
                el._leaveCb = void 0;
                delete enterHooks.delayedLeave;
              };
              enterHooks.delayedLeave = delayedLeave;
            };
          }
        }
        return child;
      };
    }
  };
  const BaseTransition = BaseTransitionImpl;
  function getLeavingNodesForType(state, vnode) {
    const {leavingVNodes} = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
      leavingVNodesCache = Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
  }
  function resolveTransitionHooks(vnode, {appear, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled}, state, instance) {
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook = (hook, args) => {
      hook && callWithAsyncErrorHandling(hook, instance, 9, args);
    };
    const hooks3 = {
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el._leaveCb) {
          el._leaveCb(true);
        }
        const leavingVNode = leavingVNodesCache[key];
        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
          leavingVNode.el._leaveCb();
        }
        callHook(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        const done = el._enterCb = (cancelled) => {
          if (called)
            return;
          called = true;
          if (cancelled) {
            callHook(cancelHook, [el]);
          } else {
            callHook(afterHook, [el]);
          }
          if (hooks3.delayedLeave) {
            hooks3.delayedLeave();
          }
          el._enterCb = void 0;
        };
        if (hook) {
          hook(el, done);
          if (hook.length <= 1) {
            done();
          }
        } else {
          done();
        }
      },
      leave(el, remove2) {
        const key2 = String(vnode.key);
        if (el._enterCb) {
          el._enterCb(true);
        }
        if (state.isUnmounting) {
          return remove2();
        }
        callHook(onBeforeLeave, [el]);
        let called = false;
        const done = el._leaveCb = (cancelled) => {
          if (called)
            return;
          called = true;
          remove2();
          if (cancelled) {
            callHook(onLeaveCancelled, [el]);
          } else {
            callHook(onAfterLeave, [el]);
          }
          el._leaveCb = void 0;
          if (leavingVNodesCache[key2] === vnode) {
            delete leavingVNodesCache[key2];
          }
        };
        leavingVNodesCache[key2] = vnode;
        if (onLeave) {
          onLeave(el, done);
          if (onLeave.length <= 1) {
            done();
          }
        } else {
          done();
        }
      }
    };
    return hooks3;
  }
  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }
  function getKeepAliveChild(vnode) {
    return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
  }
  function setTransitionHooks(vnode, hooks3) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      setTransitionHooks(vnode.component.subTree, hooks3);
    } else {
      vnode.transition = hooks3;
    }
  }
  function getTransitionRawChildren(children, keepComment = false) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === Fragment) {
        if (child.patchFlag & 128)
          keyedFragmentCount++;
        ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
      } else if (keepComment || child.type !== Comment) {
        ret.push(child);
      }
    }
    if (keyedFragmentCount > 1) {
      for (let i = 0; i < ret.length; i++) {
        ret[i].patchFlag = -2;
      }
    }
    return ret;
  }
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  const KeepAliveImpl = {
    name: `KeepAlive`,
    __isKeepAlive: true,
    inheritRef: true,
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number]
    },
    setup(props, {slots}) {
      const cache = new Map();
      const keys = new Set();
      let current = null;
      const instance = getCurrentInstance();
      const parentSuspense = instance.suspense;
      const sharedContext = instance.ctx;
      const {renderer: {p: patch, m: move, um: _unmount, o: {createElement}}} = sharedContext;
      const storageContainer = createElement("div");
      sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
        const instance2 = vnode.component;
        move(vnode, container, anchor, 0, parentSuspense);
        patch(instance2.vnode, vnode, container, anchor, instance2, parentSuspense, isSVG, optimized);
        queuePostRenderEffect(() => {
          instance2.isDeactivated = false;
          if (instance2.a) {
            invokeArrayFns(instance2.a);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
        }, parentSuspense);
      };
      sharedContext.deactivate = (vnode) => {
        const instance2 = vnode.component;
        move(vnode, storageContainer, null, 1, parentSuspense);
        queuePostRenderEffect(() => {
          if (instance2.da) {
            invokeArrayFns(instance2.da);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
          instance2.isDeactivated = true;
        }, parentSuspense);
      };
      function unmount(vnode) {
        resetShapeFlag(vnode);
        _unmount(vnode, instance, parentSuspense);
      }
      function pruneCache(filter) {
        cache.forEach((vnode, key) => {
          const name = getName(vnode.type);
          if (name && (!filter || !filter(name))) {
            pruneCacheEntry(key);
          }
        });
      }
      function pruneCacheEntry(key) {
        const cached = cache.get(key);
        if (!current || cached.type !== current.type) {
          unmount(cached);
        } else if (current) {
          resetShapeFlag(current);
        }
        cache.delete(key);
        keys.delete(key);
      }
      watch(() => [props.include, props.exclude], ([include, exclude]) => {
        include && pruneCache((name) => matches(include, name));
        exclude && pruneCache((name) => matches(exclude, name));
      });
      let pendingCacheKey = null;
      const cacheSubtree = () => {
        if (pendingCacheKey) {
          cache.set(pendingCacheKey, instance.subTree);
        }
      };
      onBeforeMount(cacheSubtree);
      onBeforeUpdate(cacheSubtree);
      onBeforeUnmount(() => {
        cache.forEach((cached) => {
          const {subTree, suspense} = instance;
          if (cached.type === subTree.type) {
            resetShapeFlag(subTree);
            const da = subTree.component.da;
            da && queuePostRenderEffect(da, suspense);
            return;
          }
          unmount(cached);
        });
      });
      return () => {
        pendingCacheKey = null;
        if (!slots.default) {
          return null;
        }
        const children = slots.default();
        let vnode = children[0];
        if (children.length > 1) {
          {
            warn(`KeepAlive should contain exactly one component child.`);
          }
          current = null;
          return children;
        } else if (!isVNode(vnode) || !(vnode.shapeFlag & 4)) {
          current = null;
          return vnode;
        }
        const comp = vnode.type;
        const name = getName(comp);
        const {include, exclude, max} = props;
        if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
          return current = vnode;
        }
        const key = vnode.key == null ? comp : vnode.key;
        const cachedVNode = cache.get(key);
        if (vnode.el) {
          vnode = cloneVNode(vnode);
        }
        pendingCacheKey = key;
        if (cachedVNode) {
          vnode.el = cachedVNode.el;
          vnode.component = cachedVNode.component;
          if (vnode.transition) {
            setTransitionHooks(vnode, vnode.transition);
          }
          vnode.shapeFlag |= 512;
          keys.delete(key);
          keys.add(key);
        } else {
          keys.add(key);
          if (max && keys.size > parseInt(max, 10)) {
            pruneCacheEntry(keys.values().next().value);
          }
        }
        vnode.shapeFlag |= 256;
        current = vnode;
        return vnode;
      };
    }
  };
  const KeepAlive = KeepAliveImpl;
  function getName(comp) {
    return comp.displayName || comp.name;
  }
  function matches(pattern, name) {
    if (isArray(pattern)) {
      return pattern.some((p2) => matches(p2, name));
    } else if (isString(pattern)) {
      return pattern.split(",").indexOf(name) > -1;
    } else if (pattern.test) {
      return pattern.test(name);
    }
    return false;
  }
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    injectHook(type, hook, keepAliveRoot, true);
    onUnmounted(() => {
      remove(keepAliveRoot[type], hook);
    }, target);
  }
  function resetShapeFlag(vnode) {
    let shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 256) {
      shapeFlag -= 256;
    }
    if (shapeFlag & 512) {
      shapeFlag -= 512;
    }
    vnode.shapeFlag = shapeFlag;
  }
  const isInternalKey = (key) => key[0] === "_" || key === "$stable";
  const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => withCtx((props) => {
    if (currentInstance) {
      warn(`Slot "${key}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`);
    }
    return normalizeSlotValue(rawSlot(props));
  }, ctx);
  const normalizeObjectSlots = (rawSlots, slots) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key))
        continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        {
          warn(`Non-function value encountered for slot "${key}". Prefer function slots for better performance.`);
        }
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    if (!isKeepAlive(instance.vnode)) {
      warn(`Non-function value encountered for default slot. Prefer function slots for better performance.`);
    }
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const initSlots = (instance, children) => {
    if (instance.vnode.shapeFlag & 32) {
      if (children._ === 1) {
        instance.slots = children;
        def(children, "_", 1);
      } else {
        normalizeObjectSlots(children, instance.slots = {});
      }
    } else {
      instance.slots = {};
      if (children) {
        normalizeVNodeSlots(instance, children);
      }
    }
    def(instance.slots, InternalObjectKey, 1);
  };
  const updateSlots = (instance, children) => {
    const {vnode, slots} = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      if (children._ === 1) {
        if (isHmrUpdating) {
          extend(slots, children);
        } else if (!(vnode.patchFlag & 1024)) {
          needDeletionCheck = false;
        } else {
          extend(slots, children);
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = {default: 1};
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
          delete slots[key];
        }
      }
    }
  };
  const isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text");
  function validateDirectiveName(name) {
    if (isBuiltInDirective(name)) {
      warn("Do not use built-in directive ids as custom directive id: " + name);
    }
  }
  function withDirectives(vnode, directives) {
    const internalInstance = currentRenderingInstance;
    if (internalInstance === null) {
      warn(`withDirectives can only be used inside render functions.`);
      return vnode;
    }
    const instance = internalInstance.proxy;
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      const hook = binding.dir[name];
      if (hook) {
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
      }
    }
  }
  function createAppContext() {
    return {
      config: {
        isNativeTag: NO,
        devtools: true,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        isCustomElement: NO,
        errorHandler: void 0,
        warnHandler: void 0
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null)
    };
  }
  function createAppAPI(render2, hydrate2) {
    return function createApp2(rootComponent, rootProps = null) {
      if (rootProps != null && !isObject(rootProps)) {
        warn(`root props passed to app.mount() must be an object.`);
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = new Set();
      let isMounted = false;
      const app = {
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
          {
            warn(`app.config cannot be replaced. Modify individual options instead.`);
          }
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) {
            warn(`Plugin has already been applied to target app.`);
          } else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else {
            warn(`A plugin must either be a function or an object with an "install" function.`);
          }
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            } else {
              warn("Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : ""));
            }
          }
          return app;
        },
        component(name, component) {
          {
            validateComponentName(name, context.config);
          }
          if (!component) {
            return context.components[name];
          }
          if (context.components[name]) {
            warn(`Component "${name}" has already been registered in target app.`);
          }
          context.components[name] = component;
          return app;
        },
        directive(name, directive) {
          {
            validateDirectiveName(name);
          }
          if (!directive) {
            return context.directives[name];
          }
          if (context.directives[name]) {
            warn(`Directive "${name}" has already been registered in target app.`);
          }
          context.directives[name] = directive;
          return app;
        },
        mount(rootContainer, isHydrate) {
          if (!isMounted) {
            const vnode = createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            {
              context.reload = () => {
                render2(cloneVNode(vnode), rootContainer);
              };
            }
            if (isHydrate && hydrate2) {
              hydrate2(vnode, rootContainer);
            } else {
              render2(vnode, rootContainer);
            }
            isMounted = true;
            app._container = rootContainer;
            return vnode.component.proxy;
          } else {
            warn(`App has already been mounted.
If you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. \`const createMyApp = () => createApp(App)\``);
          }
        },
        unmount() {
          if (isMounted) {
            render2(null, app._container);
          } else {
            warn(`Cannot unmount an app that is not mounted.`);
          }
        },
        provide(key, value) {
          if (key in context.provides) {
            warn(`App already provides property with key "${String(key)}". It will be overwritten with the new value.`);
          }
          context.provides[key] = value;
          return app;
        }
      };
      return app;
    };
  }
  let hasMismatch = false;
  const isSVGContainer = (container) => /svg/.test(container.namespaceURI) && container.tagName !== "foreignObject";
  const isComment = (node) => node.nodeType === 8;
  function createHydrationFunctions(rendererInternals) {
    const {mt: mountComponent, p: patch, o: {patchProp: patchProp2, nextSibling, parentNode, remove: remove2, insert, createComment}} = rendererInternals;
    const hydrate2 = (vnode, container) => {
      if (!container.hasChildNodes()) {
        warn(`Attempting to hydrate existing markup but container is empty. Performing full mount instead.`);
        patch(null, vnode, container);
        return;
      }
      hasMismatch = false;
      hydrateNode(container.firstChild, vnode, null, null);
      flushPostFlushCbs();
      if (hasMismatch && true) {
        console.error(`Hydration completed but contains mismatches.`);
      }
    };
    const hydrateNode = (node, vnode, parentComponent, parentSuspense, optimized = false) => {
      const isFragmentStart = isComment(node) && node.data === "[";
      const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, isFragmentStart);
      const {type, ref: ref2, shapeFlag} = vnode;
      const domType = node.nodeType;
      vnode.el = node;
      let nextNode = null;
      switch (type) {
        case Text:
          if (domType !== 3) {
            nextNode = onMismatch();
          } else {
            if (node.data !== vnode.children) {
              hasMismatch = true;
              warn(`Hydration text mismatch:
- Client: ${JSON.stringify(node.data)}
- Server: ${JSON.stringify(vnode.children)}`);
              node.data = vnode.children;
            }
            nextNode = nextSibling(node);
          }
          break;
        case Comment:
          if (domType !== 8 || isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = nextSibling(node);
          }
          break;
        case Static:
          if (domType !== 1) {
            nextNode = onMismatch();
          } else {
            nextNode = node;
            const needToAdoptContent = !vnode.children.length;
            for (let i = 0; i < vnode.staticCount; i++) {
              if (needToAdoptContent)
                vnode.children += nextNode.outerHTML;
              if (i === vnode.staticCount - 1) {
                vnode.anchor = nextNode;
              }
              nextNode = nextSibling(nextNode);
            }
            return nextNode;
          }
          break;
        case Fragment:
          if (!isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, optimized);
          }
          break;
        default:
          if (shapeFlag & 1) {
            if (domType !== 1 || vnode.type !== node.tagName.toLowerCase()) {
              nextNode = onMismatch();
            } else {
              nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, optimized);
            }
          } else if (shapeFlag & 6) {
            const container = parentNode(node);
            const hydrateComponent = () => {
              mountComponent(vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), optimized);
            };
            const loadAsync = vnode.type.__asyncLoader;
            if (loadAsync) {
              loadAsync().then(hydrateComponent);
            } else {
              hydrateComponent();
            }
            nextNode = isFragmentStart ? locateClosingAsyncAnchor(node) : nextSibling(node);
          } else if (shapeFlag & 64) {
            if (domType !== 8) {
              nextNode = onMismatch();
            } else {
              nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, optimized, rendererInternals, hydrateChildren);
            }
          } else if (shapeFlag & 128) {
            nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, isSVGContainer(parentNode(node)), optimized, rendererInternals, hydrateNode);
          } else {
            warn("Invalid HostVNode type:", type, `(${typeof type})`);
          }
      }
      if (ref2 != null && parentComponent) {
        setRef(ref2, null, parentComponent, parentSuspense, vnode);
      }
      return nextNode;
    };
    const hydrateElement = (el, vnode, parentComponent, parentSuspense, optimized) => {
      optimized = optimized || !!vnode.dynamicChildren;
      const {props, patchFlag, shapeFlag, dirs} = vnode;
      if (patchFlag !== -1) {
        if (props) {
          if (!optimized || (patchFlag & 16 || patchFlag & 32)) {
            for (const key in props) {
              if (!isReservedProp(key) && isOn(key)) {
                patchProp2(el, key, null, props[key]);
              }
            }
          } else if (props.onClick) {
            patchProp2(el, "onClick", null, props.onClick);
          }
        }
        let vnodeHooks;
        if (vnodeHooks = props && props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHooks, parentComponent, vnode);
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
        }
        if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
          queueEffectWithSuspense(() => {
            vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
            dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
          }, parentSuspense);
        }
        if (shapeFlag & 16 && !(props && (props.innerHTML || props.textContent))) {
          let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, optimized);
          let hasWarned2 = false;
          while (next) {
            hasMismatch = true;
            if (!hasWarned2) {
              warn(`Hydration children mismatch in <${vnode.type}>: server rendered element contains more child nodes than client vdom.`);
              hasWarned2 = true;
            }
            const cur = next;
            next = next.nextSibling;
            remove2(cur);
          }
        } else if (shapeFlag & 8) {
          if (el.textContent !== vnode.children) {
            hasMismatch = true;
            warn(`Hydration text content mismatch in <${vnode.type}>:
- Client: ${el.textContent}
- Server: ${vnode.children}`);
            el.textContent = vnode.children;
          }
        }
      }
      return el.nextSibling;
    };
    const hydrateChildren = (node, vnode, container, parentComponent, parentSuspense, optimized) => {
      optimized = optimized || !!vnode.dynamicChildren;
      const children = vnode.children;
      const l = children.length;
      let hasWarned2 = false;
      for (let i = 0; i < l; i++) {
        const vnode2 = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
        if (node) {
          node = hydrateNode(node, vnode2, parentComponent, parentSuspense, optimized);
        } else {
          hasMismatch = true;
          if (!hasWarned2) {
            warn(`Hydration children mismatch in <${container.tagName.toLowerCase()}>: server rendered element contains fewer child nodes than client vdom.`);
            hasWarned2 = true;
          }
          patch(null, vnode2, container, null, parentComponent, parentSuspense, isSVGContainer(container));
        }
      }
      return node;
    };
    const hydrateFragment = (node, vnode, parentComponent, parentSuspense, optimized) => {
      const container = parentNode(node);
      const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, optimized);
      if (next && isComment(next) && next.data === "]") {
        return nextSibling(vnode.anchor = next);
      } else {
        hasMismatch = true;
        insert(vnode.anchor = createComment(`]`), container, next);
        return next;
      }
    };
    const handleMismatch = (node, vnode, parentComponent, parentSuspense, isFragment) => {
      hasMismatch = true;
      warn(`Hydration node mismatch:
- Client vnode:`, vnode.type, `
- Server rendered DOM:`, node, node.nodeType === 3 ? `(text)` : isComment(node) && node.data === "[" ? `(start of fragment)` : ``);
      vnode.el = null;
      if (isFragment) {
        const end = locateClosingAsyncAnchor(node);
        while (true) {
          const next2 = nextSibling(node);
          if (next2 && next2 !== end) {
            remove2(next2);
          } else {
            break;
          }
        }
      }
      const next = nextSibling(node);
      const container = parentNode(node);
      remove2(node);
      patch(null, vnode, container, next, parentComponent, parentSuspense, isSVGContainer(container));
      return next;
    };
    const locateClosingAsyncAnchor = (node) => {
      let match = 0;
      while (node) {
        node = nextSibling(node);
        if (node && isComment(node)) {
          if (node.data === "[")
            match++;
          if (node.data === "]") {
            if (match === 0) {
              return nextSibling(node);
            } else {
              match--;
            }
          }
        }
      }
      return node;
    };
    return [hydrate2, hydrateNode];
  }
  let supported;
  let perf;
  function startMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
      perf.mark(`vue-${type}-${instance.uid}`);
    }
  }
  function endMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
      const startTag = `vue-${type}-${instance.uid}`;
      const endTag = startTag + `:end`;
      perf.mark(endTag);
      perf.measure(`<${formatComponentName(instance, instance.type)}> ${type}`, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
    }
  }
  function isSupported() {
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function createDevEffectOptions(instance) {
    return {
      scheduler: queueJob,
      onTrack: instance.rtc ? (e) => invokeArrayFns(instance.rtc, e) : void 0,
      onTrigger: instance.rtg ? (e) => invokeArrayFns(instance.rtg, e) : void 0
    };
  }
  const queuePostRenderEffect = queueEffectWithSuspense;
  const setRef = (rawRef, oldRawRef, parentComponent, parentSuspense, vnode) => {
    let value;
    if (!vnode) {
      value = null;
    } else {
      if (vnode.shapeFlag & 4) {
        value = vnode.component.proxy;
      } else {
        value = vnode.el;
      }
    }
    const [owner, ref2] = rawRef;
    if (!owner) {
      warn(`Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.`);
      return;
    }
    const oldRef = oldRawRef && oldRawRef[1];
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    if (oldRef != null && oldRef !== ref2) {
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (hasOwn(setupState, oldRef)) {
          queuePostRenderEffect(() => {
            setupState[oldRef] = null;
          }, parentSuspense);
        }
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }
    if (isString(ref2)) {
      refs[ref2] = value;
      if (hasOwn(setupState, ref2)) {
        queuePostRenderEffect(() => {
          setupState[ref2] = value;
        }, parentSuspense);
      }
    } else if (isRef(ref2)) {
      ref2.value = value;
    } else if (isFunction(ref2)) {
      callWithErrorHandling(ref2, parentComponent, 12, [
        value,
        refs
      ]);
    } else {
      warn("Invalid template ref type:", value, `(${typeof value})`);
    }
  };
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function createHydrationRenderer(options) {
    return baseCreateRenderer(options, createHydrationFunctions);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const {insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, forcePatchProp: hostForcePatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent} = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, optimized = false) => {
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const {type, ref: ref2, shapeFlag} = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, isSVG);
          } else {
            patchStaticNode(n1, n2, container, isSVG);
          }
          break;
        case Fragment:
          processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          break;
        default:
          if (shapeFlag & 1) {
            processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          } else if (shapeFlag & 6) {
            processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          } else if (shapeFlag & 64) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
          } else if (shapeFlag & 128) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
          } else {
            warn("Invalid VNode type:", type, `(${typeof type})`);
          }
      }
      if (ref2 != null && parentComponent) {
        setRef(ref2, n1 && n1.ref, parentComponent, parentSuspense, n2);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, isSVG) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
    };
    const patchStaticNode = (n1, n2, container, isSVG) => {
      if (n2.children !== n1.children) {
        const anchor = hostNextSibling(n1.anchor);
        removeStaticNode(n1);
        [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
      } else {
        n2.el = n1.el;
        n2.anchor = n1.anchor;
      }
    };
    const moveStaticNode = (vnode, container, anchor) => {
      let cur = vnode.el;
      const end = vnode.anchor;
      while (cur && cur !== end) {
        const next = hostNextSibling(cur);
        hostInsert(cur, container, anchor);
        cur = next;
      }
      hostInsert(end, container, anchor);
    };
    const removeStaticNode = (vnode) => {
      let cur = vnode.el;
      while (cur && cur !== vnode.anchor) {
        const next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(vnode.anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      isSVG = isSVG || n2.type === "svg";
      if (n1 == null) {
        mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      } else {
        patchElement(n1, n2, parentComponent, parentSuspense, isSVG, optimized);
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      let el;
      let vnodeHook;
      const {type, props, shapeFlag, transition, scopeId, patchFlag, dirs} = vnode;
      if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
        el = vnode.el = hostCloneNode(vnode.el);
      } else {
        el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is);
        if (shapeFlag & 8) {
          hostSetElementText(el, vnode.children);
        } else if (shapeFlag & 16) {
          mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", optimized || !!vnode.dynamicChildren);
        }
        if (props) {
          for (const key in props) {
            if (!isReservedProp(key)) {
              hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
          if (vnodeHook = props.onVnodeBeforeMount) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
          }
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
        }
        if (scopeId) {
          hostSetScopeId(el, scopeId);
        }
        const treeOwnerId = parentComponent && parentComponent.type.__scopeId;
        if (treeOwnerId && treeOwnerId !== scopeId) {
          hostSetScopeId(el, treeOwnerId + "-s");
        }
        if (transition && !transition.persisted) {
          transition.beforeEnter(el);
        }
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || transition && !transition.persisted || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          transition && !transition.persisted && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, optimized) => {
      const el = n2.el = n1.el;
      let {patchFlag, dynamicChildren, dirs} = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      if (isHmrUpdating) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, isSVG);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || hostForcePatchProp && hostForcePatchProp(el, key)) {
                hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      }
      const areChildrenSVG = isSVG && n2.type !== "foreignObject";
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG);
        if (parentComponent && parentComponent.type.__hmrId) {
          traverseStaticChildren(n1, n2);
        }
      } else if (!optimized) {
        patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 6 ? hostParentNode(oldVNode.el) : fallbackContainer;
        patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, true);
      }
    };
    const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
      if (oldProps !== newProps) {
        for (const key in newProps) {
          if (isReservedProp(key))
            continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev || hostForcePatchProp && hostForcePatchProp(el, key)) {
            hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let {patchFlag, dynamicChildren} = n2;
      if (patchFlag > 0) {
        optimized = true;
      }
      if (isHmrUpdating) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, optimized);
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren) {
          patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG);
          if (parentComponent && parentComponent.type.__hmrId) {
            traverseStaticChildren(n1, n2);
          }
        } else {
          patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, optimized);
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
        } else {
          mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
      if (instance.type.__hmrId) {
        registerHMR(instance);
      }
      {
        pushWarningContext(initialVNode);
        startMeasure(instance, `mount`);
      }
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        startMeasure(instance, `init`);
      }
      setupComponent(instance);
      {
        endMeasure(instance, `init`);
      }
      if (instance.asyncDep) {
        if (!parentSuspense) {
          warn("async setup() is used without a suspense boundary!");
          return;
        }
        parentSuspense.registerDep(instance, setupRenderEffect);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }
        return;
      }
      setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
      {
        popWarningContext();
        endMeasure(instance, `mount`);
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          {
            pushWarningContext(n2);
          }
          updateComponentPreRender(instance, n2, optimized);
          {
            popWarningContext();
          }
          return;
        } else {
          instance.next = n2;
          invalidateJob(instance.update);
          instance.update();
        }
      } else {
        n2.component = n1.component;
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
      instance.update = effect(function componentEffect() {
        if (!instance.isMounted) {
          let vnodeHook;
          const {el, props} = initialVNode;
          const {bm, m, a, parent} = instance;
          {
            startMeasure(instance, `render`);
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          {
            endMeasure(instance, `render`);
          }
          if (bm) {
            invokeArrayFns(bm);
          }
          if (vnodeHook = props && props.onVnodeBeforeMount) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          if (el && hydrateNode) {
            {
              startMeasure(instance, `hydrate`);
            }
            hydrateNode(initialVNode.el, subTree, instance, parentSuspense);
            {
              endMeasure(instance, `hydrate`);
            }
          } else {
            {
              startMeasure(instance, `patch`);
            }
            patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
            {
              endMeasure(instance, `patch`);
            }
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (vnodeHook = props && props.onVnodeMounted) {
            queuePostRenderEffect(() => {
              invokeVNodeHook(vnodeHook, parent, initialVNode);
            }, parentSuspense);
          }
          if (a && initialVNode.shapeFlag & 256) {
            queuePostRenderEffect(a, parentSuspense);
          }
          instance.isMounted = true;
        } else {
          let {next, bu, u, parent, vnode} = instance;
          let originNext = next;
          let vnodeHook;
          {
            pushWarningContext(next || instance.vnode);
          }
          if (next) {
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          {
            startMeasure(instance, `render`);
          }
          const nextTree = renderComponentRoot(instance);
          {
            endMeasure(instance, `render`);
          }
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          next.el = vnode.el;
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          if (instance.refs !== EMPTY_OBJ) {
            instance.refs = {};
          }
          {
            startMeasure(instance, `patch`);
          }
          patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, isSVG);
          {
            endMeasure(instance, `patch`);
          }
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(() => {
              invokeVNodeHook(vnodeHook, parent, next, vnode);
            }, parentSuspense);
          }
          {
            popWarningContext();
          }
        }
      }, createDevEffectOptions(instance));
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      if (instance.type.__hmrId) {
        optimized = false;
      }
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children);
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const {patchFlag, shapeFlag} = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, optimized);
      }
      if (oldLength > newLength) {
        unmountChildren(c1, parentComponent, parentSuspense, true, commonLength);
      } else {
        mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, commonLength);
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, optimized);
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, optimized);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG);
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            if (keyToNewIndexMap.has(nextChild.key)) {
              warn(`Duplicate keys found during update:`, JSON.stringify(nextChild.key), `Make sure keys are unique.`);
            }
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++)
          newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, optimized);
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG);
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const {el, type, transition, children, shapeFlag} = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const {leave, delayLeave, afterLeave} = transition;
          const remove3 = () => hostInsert(el, container, anchor);
          const performLeave = () => {
            leave(el, () => {
              remove3();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove3, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false) => {
      const {type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs} = vnode;
      if (ref2 != null && parentComponent) {
        setRef(ref2, null, parentComponent, parentSuspense, null);
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      let vnodeHook;
      if (vnodeHook = props && props.onVnodeBeforeUnmount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(dynamicChildren, parentComponent, parentSuspense);
        } else if (shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (shapeFlag & 64) {
          vnode.type.remove(vnode, internals);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if ((vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const {type, el, anchor, transition} = vnode;
      if (type === Fragment) {
        removeFragment(el, anchor);
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const {leave, delayLeave} = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      if (instance.type.__hmrId) {
        unregisterHMR(instance);
      }
      const {bum, effects, update, subTree, um, da, isDeactivated} = instance;
      if (bum) {
        invokeArrayFns(bum);
      }
      if (update) {
        stop(update);
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (effects) {
        queuePostRenderEffect(() => {
          for (let i = 0; i < effects.length; i++) {
            stop(effects[i]);
          }
        }, parentSuspense);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      if (da && !isDeactivated && instance.vnode.shapeFlag & 256) {
        queuePostRenderEffect(da, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      if (parentSuspense && !parentSuspense.isResolved && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved) {
        parentSuspense.deps--;
        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      return hostNextSibling(vnode.anchor || vnode.el);
    };
    const traverseStaticChildren = (n1, n2) => {
      const ch1 = n1.children;
      const ch2 = n2.children;
      if (isArray(ch1) && isArray(ch2)) {
        for (let i = 0; i < ch1.length; i++) {
          const c1 = ch1[i];
          const c2 = ch2[i];
          if (isVNode(c1) && isVNode(c2) && c2.shapeFlag & 1 && !c2.dynamicChildren) {
            if (c2.patchFlag <= 0) {
              c2.el = c1.el;
            }
            traverseStaticChildren(c1, c2);
          }
        }
      }
    };
    const render2 = (vnode, container) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(container._vnode || null, vnode, container);
      }
      flushPostFlushCbs();
      container._vnode = vnode;
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate2;
    let hydrateNode;
    if (createHydrationFns) {
      [hydrate2, hydrateNode] = createHydrationFns(internals);
    }
    return {
      render: render2,
      hydrate: hydrate2,
      createApp: createAppAPI(render2, hydrate2)
    };
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p2[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = (u + v) / 2 | 0;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }
  const invoke = (fn) => fn();
  function watchEffect(effect2, options) {
    return doWatch(effect2, null, options);
  }
  const INITIAL_WATCHER_VALUE = {};
  function watch(source, cb, options) {
    if (!isFunction(cb)) {
      warn(`\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`);
    }
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, {immediate, deep, flush, onTrack, onTrigger} = EMPTY_OBJ, instance = currentInstance) {
    if (!cb) {
      if (immediate !== void 0) {
        warn(`watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`);
      }
      if (deep !== void 0) {
        warn(`watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`);
      }
    }
    const warnInvalidSource = (s) => {
      warn(`Invalid watch source: `, s, `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`);
    };
    let getter;
    if (isArray(source)) {
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return traverse(s);
        } else if (isFunction(s)) {
          return callWithErrorHandling(s, instance, 2);
        } else {
          warnInvalidSource(s);
        }
      });
    } else if (isRef(source)) {
      getter = () => source.value;
    } else if (isReactive(source)) {
      getter = () => source;
      deep = true;
    } else if (isFunction(source)) {
      if (cb) {
        getter = () => callWithErrorHandling(source, instance, 2);
      } else {
        getter = () => {
          if (instance && instance.isUnmounted) {
            return;
          }
          if (cleanup2) {
            cleanup2();
          }
          return callWithErrorHandling(source, instance, 3, [onInvalidate]);
        };
      }
    } else {
      getter = NOOP;
      warnInvalidSource(source);
    }
    if (cb && deep) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    let cleanup2;
    const onInvalidate = (fn) => {
      cleanup2 = runner.options.onStop = () => {
        callWithErrorHandling(fn, instance, 4);
      };
    };
    let oldValue = isArray(source) ? [] : INITIAL_WATCHER_VALUE;
    const applyCb = cb ? () => {
      if (instance && instance.isUnmounted) {
        return;
      }
      const newValue = runner();
      if (deep || hasChanged(newValue, oldValue)) {
        if (cleanup2) {
          cleanup2();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onInvalidate
        ]);
        oldValue = newValue;
      }
    } : void 0;
    let scheduler;
    if (flush === "sync") {
      scheduler = invoke;
    } else if (flush === "pre") {
      scheduler = (job) => {
        if (!instance || instance.isMounted) {
          queueJob(job);
        } else {
          job();
        }
      };
    } else {
      scheduler = (job) => queuePostRenderEffect(job, instance && instance.suspense);
    }
    const runner = effect(getter, {
      lazy: true,
      computed: true,
      onTrack,
      onTrigger,
      scheduler: applyCb ? () => scheduler(applyCb) : scheduler
    });
    recordInstanceBoundEffect(runner);
    if (applyCb) {
      if (immediate) {
        applyCb();
      } else {
        oldValue = runner();
      }
    } else {
      runner();
    }
    return () => {
      stop(runner);
      if (instance) {
        remove(instance.effects, runner);
      }
    };
  }
  function instanceWatch(source, cb, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? () => publicThis[source] : source.bind(publicThis);
    return doWatch(getter, cb.bind(publicThis), options, this);
  }
  function traverse(value, seen = new Set()) {
    if (!isObject(value) || seen.has(value)) {
      return value;
    }
    seen.add(value);
    if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], seen);
      }
    } else if (value instanceof Map) {
      value.forEach((v, key) => {
        traverse(value.get(key), seen);
      });
    } else if (value instanceof Set) {
      value.forEach((v) => {
        traverse(v, seen);
      });
    } else {
      for (const key in value) {
        traverse(value[key], seen);
      }
    }
    return value;
  }
  function provide(key, value) {
    if (!currentInstance) {
      {
        warn(`provide() can only be used inside setup().`);
      }
    } else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue) {
    const instance = currentInstance || currentRenderingInstance;
    if (instance) {
      const provides = instance.provides;
      if (key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return defaultValue;
      } else {
        warn(`injection "${String(key)}" not found.`);
      }
    } else {
      warn(`inject() can only be used inside setup() or functional components.`);
    }
  }
  function createDuplicateChecker() {
    const cache = Object.create(null);
    return (type, key) => {
      if (cache[key]) {
        warn(`${type} property "${key}" is already defined in ${cache[key]}.`);
      } else {
        cache[key] = type;
      }
    };
  }
  function applyOptions(instance, options, deferredData = [], deferredWatch = [], asMixin = false) {
    const {
      mixins,
      extends: extendsOptions,
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      components,
      directives,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeUnmount,
      unmounted,
      renderTracked,
      renderTriggered,
      errorCaptured
    } = options;
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    const globalMixins = instance.appContext.mixins;
    if (!asMixin) {
      callSyncHook("beforeCreate", options, publicThis, globalMixins);
      applyMixins(instance, globalMixins, deferredData, deferredWatch);
    }
    if (extendsOptions) {
      applyOptions(instance, extendsOptions, deferredData, deferredWatch, true);
    }
    if (mixins) {
      applyMixins(instance, mixins, deferredData, deferredWatch);
    }
    const checkDuplicateProperties = createDuplicateChecker();
    {
      const propsOptions = normalizePropsOptions(options)[0];
      if (propsOptions) {
        for (const key in propsOptions) {
          checkDuplicateProperties("Props", key);
        }
      }
    }
    if (injectOptions) {
      if (isArray(injectOptions)) {
        for (let i = 0; i < injectOptions.length; i++) {
          const key = injectOptions[i];
          ctx[key] = inject(key);
          {
            checkDuplicateProperties("Inject", key);
          }
        }
      } else {
        for (const key in injectOptions) {
          const opt = injectOptions[key];
          if (isObject(opt)) {
            ctx[key] = inject(opt.from, opt.default);
          } else {
            ctx[key] = inject(opt);
          }
          {
            checkDuplicateProperties("Inject", key);
          }
        }
      }
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          ctx[key] = methodHandler.bind(publicThis);
          {
            checkDuplicateProperties("Methods", key);
          }
        } else {
          warn(`Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`);
        }
      }
    }
    if (dataOptions) {
      if (!isFunction(dataOptions)) {
        warn(`The data option must be a function. Plain object usage is no longer supported.`);
      }
      if (asMixin) {
        deferredData.push(dataOptions);
      } else {
        resolveData(instance, dataOptions, publicThis);
      }
    }
    if (!asMixin) {
      if (deferredData.length) {
        deferredData.forEach((dataFn) => resolveData(instance, dataFn, publicThis));
      }
      {
        const rawData = toRaw(instance.data);
        for (const key in rawData) {
          checkDuplicateProperties("Data", key);
          if (key[0] !== "$" && key[0] !== "_") {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => rawData[key],
              set: NOOP
            });
          }
        }
      }
    }
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        if (get2 === NOOP) {
          warn(`Computed property "${key}" has no getter.`);
        }
        const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
          warn(`Write operation failed: computed property "${key}" is readonly.`);
        };
        const c = computed$1({
          get: get2,
          set: set2
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
        {
          checkDuplicateProperties("Computed", key);
        }
      }
    }
    if (watchOptions) {
      deferredWatch.push(watchOptions);
    }
    if (!asMixin && deferredWatch.length) {
      deferredWatch.forEach((watchOptions2) => {
        for (const key in watchOptions2) {
          createWatcher(watchOptions2[key], ctx, publicThis, key);
        }
      });
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      for (const key in provides) {
        provide(key, provides[key]);
      }
    }
    if (components) {
      extend(instance.components, components);
    }
    if (directives) {
      extend(instance.directives, directives);
    }
    if (!asMixin) {
      callSyncHook("created", options, publicThis, globalMixins);
    }
    if (beforeMount) {
      onBeforeMount(beforeMount.bind(publicThis));
    }
    if (mounted) {
      onMounted(mounted.bind(publicThis));
    }
    if (beforeUpdate) {
      onBeforeUpdate(beforeUpdate.bind(publicThis));
    }
    if (updated) {
      onUpdated(updated.bind(publicThis));
    }
    if (activated) {
      onActivated(activated.bind(publicThis));
    }
    if (deactivated) {
      onDeactivated(deactivated.bind(publicThis));
    }
    if (errorCaptured) {
      onErrorCaptured(errorCaptured.bind(publicThis));
    }
    if (renderTracked) {
      onRenderTracked(renderTracked.bind(publicThis));
    }
    if (renderTriggered) {
      onRenderTriggered(renderTriggered.bind(publicThis));
    }
    if (beforeUnmount) {
      onBeforeUnmount(beforeUnmount.bind(publicThis));
    }
    if (unmounted) {
      onUnmounted(unmounted.bind(publicThis));
    }
  }
  function callSyncHook(name, options, ctx, globalMixins) {
    callHookFromMixins(name, globalMixins, ctx);
    const baseHook = options.extends && options.extends[name];
    if (baseHook) {
      baseHook.call(ctx);
    }
    const mixins = options.mixins;
    if (mixins) {
      callHookFromMixins(name, mixins, ctx);
    }
    const selfHook = options[name];
    if (selfHook) {
      selfHook.call(ctx);
    }
  }
  function callHookFromMixins(name, mixins, ctx) {
    for (let i = 0; i < mixins.length; i++) {
      const fn = mixins[i][name];
      if (fn) {
        fn.call(ctx);
      }
    }
  }
  function applyMixins(instance, mixins, deferredData, deferredWatch) {
    for (let i = 0; i < mixins.length; i++) {
      applyOptions(instance, mixins[i], deferredData, deferredWatch, true);
    }
  }
  function resolveData(instance, dataFn, publicThis) {
    const data = dataFn.call(publicThis, publicThis);
    if (isPromise(data)) {
      warn(`data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`);
    }
    if (!isObject(data)) {
      warn(`data() should return an object.`);
    } else if (instance.data === EMPTY_OBJ) {
      instance.data = reactive(data);
    } else {
      extend(instance.data, data);
    }
  }
  function createWatcher(raw, ctx, publicThis, key) {
    const getter = () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        watch(getter, handler);
      } else {
        warn(`Invalid watch handler specified by key "${raw}"`, handler);
      }
    } else if (isFunction(raw)) {
      watch(getter, raw.bind(publicThis));
    } else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      } else {
        watch(getter, raw.handler.bind(publicThis), raw);
      }
    } else {
      warn(`Invalid watch option: "${key}"`);
    }
  }
  function resolveMergedOptions(instance) {
    const raw = instance.type;
    const {__merged, mixins, extends: extendsOptions} = raw;
    if (__merged)
      return __merged;
    const globalMixins = instance.appContext.mixins;
    if (!globalMixins.length && !mixins && !extendsOptions)
      return raw;
    const options = {};
    globalMixins.forEach((m) => mergeOptions(options, m, instance));
    extendsOptions && mergeOptions(options, extendsOptions, instance);
    mixins && mixins.forEach((m) => mergeOptions(options, m, instance));
    mergeOptions(options, raw, instance);
    return raw.__merged = options;
  }
  function mergeOptions(to, from, instance) {
    const strats = instance.appContext.config.optionMergeStrategies;
    for (const key in from) {
      if (strats && hasOwn(strats, key)) {
        to[key] = strats[key](to[key], from[key], instance.proxy, key);
      } else if (!hasOwn(to, key)) {
        to[key] = from[key];
      }
    }
  }
  const publicPropertiesMap = extend(Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => shallowReadonly(i.props),
    $attrs: (i) => shallowReadonly(i.attrs),
    $slots: (i) => shallowReadonly(i.slots),
    $refs: (i) => shallowReadonly(i.refs),
    $parent: (i) => i.parent && i.parent.proxy,
    $root: (i) => i.root && i.root.proxy,
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => () => queueJob(i.update),
    $nextTick: () => nextTick,
    $watch: (i) => instanceWatch.bind(i)
  });
  const PublicInstanceProxyHandlers = {
    get({_: instance}, key) {
      const {ctx, setupState, data, props, accessCache, type, appContext} = instance;
      if (key === "__v_skip") {
        return true;
      }
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 0:
              return setupState[key];
            case 1:
              return data[key];
            case 3:
              return ctx[key];
            case 2:
              return props[key];
          }
        } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
          accessCache[key] = 0;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 1;
          return data[key];
        } else if ((normalizedProps = normalizePropsOptions(type)[0]) && hasOwn(normalizedProps, key)) {
          accessCache[key] = 2;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 3;
          return ctx[key];
        } else {
          accessCache[key] = 4;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance, "get", key);
          markAttrsAccessed();
        }
        return publicGetter(instance);
      } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 3;
        return ctx[key];
      } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
        return globalProperties[key];
      } else if (currentRenderingInstance && key.indexOf("__v") !== 0) {
        if (data !== EMPTY_OBJ && key[0] === "$" && hasOwn(data, key)) {
          warn(`Property ${JSON.stringify(key)} must be accessed via $data because it starts with a reserved character and is not proxied on the render context.`);
        } else {
          warn(`Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`);
        }
      }
    },
    set({_: instance}, key, value) {
      const {data, setupState, ctx} = instance;
      if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        setupState[key] = value;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
      } else if (key in instance.props) {
        warn(`Attempting to mutate prop "${key}". Props are readonly.`, instance);
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        warn(`Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`, instance);
        return false;
      } else {
        if (key in instance.appContext.config.globalProperties) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            value
          });
        } else {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({_: {data, setupState, accessCache, ctx, type, appContext}}, key) {
      let normalizedProps;
      return accessCache[key] !== void 0 || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = normalizePropsOptions(type)[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    }
  };
  {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
      warn(`Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`);
      return Reflect.ownKeys(target);
    };
  }
  const RuntimeCompiledPublicInstanceProxyHandlers = extend({}, PublicInstanceProxyHandlers, {
    get(target, key) {
      if (key === Symbol.unscopables) {
        return;
      }
      return PublicInstanceProxyHandlers.get(target, key, target);
    },
    has(_, key) {
      const has2 = key[0] !== "_" && !isGloballyWhitelisted(key);
      if (!has2 && PublicInstanceProxyHandlers.has(_, key)) {
        warn(`Property ${JSON.stringify(key)} should not start with _ which is a reserved prefix for Vue internals.`);
      }
      return has2;
    }
  });
  function createRenderContext(instance) {
    const target = {};
    Object.defineProperty(target, `_`, {
      configurable: true,
      enumerable: false,
      get: () => instance
    });
    Object.keys(publicPropertiesMap).forEach((key) => {
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: false,
        get: () => publicPropertiesMap[key](instance),
        set: NOOP
      });
    });
    const {globalProperties} = instance.appContext.config;
    Object.keys(globalProperties).forEach((key) => {
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: false,
        get: () => globalProperties[key],
        set: NOOP
      });
    });
    return target;
  }
  function exposePropsOnRenderContext(instance) {
    const {ctx, type} = instance;
    const propsOptions = normalizePropsOptions(type)[0];
    if (propsOptions) {
      Object.keys(propsOptions).forEach((key) => {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => instance.props[key],
          set: NOOP
        });
      });
    }
  }
  function exposeSetupStateOnRenderContext(instance) {
    const {ctx, setupState} = instance;
    Object.keys(toRaw(setupState)).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    });
  }
  const emptyAppContext = createAppContext();
  let uid$1 = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid$1++,
      vnode,
      parent,
      appContext,
      type: vnode.type,
      root: null,
      next: null,
      subTree: null,
      update: null,
      render: null,
      proxy: null,
      withProxy: null,
      effects: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      accessCache: null,
      renderCache: [],
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      components: Object.create(appContext.components),
      directives: Object.create(appContext.directives),
      suspense,
      asyncDep: null,
      asyncResolved: false,
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      emit: null
    };
    {
      instance.ctx = createRenderContext(instance);
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  const setCurrentInstance = (instance) => {
    currentInstance = instance;
  };
  const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
  function validateComponentName(name, config) {
    const appIsNativeTag = config.isNativeTag || NO;
    if (isBuiltInTag(name) || appIsNativeTag(name)) {
      warn("Do not use built-in or reserved HTML elements as component id: " + name);
    }
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false) {
    isInSSRComponentSetup = isSSR;
    const {props, children, shapeFlag} = instance.vnode;
    const isStateful = shapeFlag & 4;
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isInSSRComponentSetup = false;
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    const Component = instance.type;
    {
      if (Component.name) {
        validateComponentName(Component.name, instance.appContext.config);
      }
      if (Component.components) {
        const names = Object.keys(Component.components);
        for (let i = 0; i < names.length; i++) {
          validateComponentName(names[i], instance.appContext.config);
        }
      }
      if (Component.directives) {
        const names = Object.keys(Component.directives);
        for (let i = 0; i < names.length; i++) {
          validateDirectiveName(names[i]);
        }
      }
    }
    instance.accessCache = {};
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
    {
      exposePropsOnRenderContext(instance);
    }
    const {setup} = Component;
    if (setup) {
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      currentInstance = instance;
      pauseTracking();
      const setupResult = callWithErrorHandling(setup, instance, 0, [shallowReadonly(instance.props), setupContext]);
      resetTracking();
      currentInstance = null;
      if (isPromise(setupResult)) {
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult);
          });
        } else {
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult);
      }
    } else {
      finishComponentSetup(instance);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      instance.render = setupResult;
    } else if (isObject(setupResult)) {
      if (isVNode(setupResult)) {
        warn(`setup() should not return VNodes directly - return a render function instead.`);
      }
      instance.setupState = reactive(setupResult);
      {
        exposeSetupStateOnRenderContext(instance);
      }
    } else if (setupResult !== void 0) {
      warn(`setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`);
    }
    finishComponentSetup(instance);
  }
  let compile$1;
  function registerRuntimeCompiler(_compile) {
    compile$1 = _compile;
  }
  function finishComponentSetup(instance, isSSR) {
    const Component = instance.type;
    if (!instance.render) {
      if (compile$1 && Component.template && !Component.render) {
        {
          startMeasure(instance, `compile`);
        }
        Component.render = compile$1(Component.template, {
          isCustomElement: instance.appContext.config.isCustomElement || NO
        });
        {
          endMeasure(instance, `compile`);
        }
        Component.render._rc = true;
      }
      if (!Component.render) {
        if (!compile$1 && Component.template) {
          warn(`Component provided template option but runtime compilation is not supported in this build of Vue. Use "vue.esm-browser.js" instead.`);
        } else {
          warn(`Component is missing template or render function.`);
        }
      }
      instance.render = Component.render || NOOP;
      if (instance.render._rc) {
        instance.withProxy = new Proxy(instance.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
      }
    }
    {
      currentInstance = instance;
      applyOptions(instance, Component);
      currentInstance = null;
    }
  }
  const attrHandlers = {
    get: (target, key) => {
      {
        markAttrsAccessed();
      }
      return target[key];
    },
    set: () => {
      warn(`setupContext.attrs is readonly.`);
      return false;
    },
    deleteProperty: () => {
      warn(`setupContext.attrs is readonly.`);
      return false;
    }
  };
  function createSetupContext(instance) {
    {
      return Object.freeze({
        get attrs() {
          return new Proxy(instance.attrs, attrHandlers);
        },
        get slots() {
          return shallowReadonly(instance.slots);
        },
        get emit() {
          return (event, ...args) => instance.emit(event, ...args);
        }
      });
    }
  }
  function recordInstanceBoundEffect(effect2) {
    if (currentInstance) {
      (currentInstance.effects || (currentInstance.effects = [])).push(effect2);
    }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function formatComponentName(instance, Component, isRoot = false) {
    let name = isFunction(Component) ? Component.displayName || Component.name : Component.name;
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.vue$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance && instance.parent) {
      const registry = instance.parent.components;
      for (const key in registry) {
        if (registry[key] === Component) {
          name = key;
          break;
        }
      }
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function computed$1(getterOrOptions) {
    const c = computed(getterOrOptions);
    recordInstanceBoundEffect(c.effect);
    return c;
  }
  function defineComponent(options) {
    return isFunction(options) ? {setup: options} : options;
  }
  function defineAsyncComponent(source) {
    if (isFunction(source)) {
      source = {loader: source};
    }
    const {
      loader,
      loadingComponent,
      errorComponent,
      delay = 200,
      timeout,
      suspensible = true,
      onError: userOnError
    } = source;
    let pendingRequest = null;
    let resolvedComp;
    let retries = 0;
    const retry = () => {
      retries++;
      pendingRequest = null;
      return load();
    };
    const load = () => {
      let thisRequest;
      return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
        err = err instanceof Error ? err : new Error(String(err));
        if (userOnError) {
          return new Promise((resolve, reject) => {
            const userRetry = () => resolve(retry());
            const userFail = () => reject(err);
            userOnError(err, userRetry, userFail, retries + 1);
          });
        } else {
          throw err;
        }
      }).then((comp) => {
        if (thisRequest !== pendingRequest && pendingRequest) {
          return pendingRequest;
        }
        if (!comp) {
          warn(`Async component loader resolved to undefined. If you are using retry(), make sure to return its return value.`);
        }
        if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
          comp = comp.default;
        }
        if (comp && !isObject(comp) && !isFunction(comp)) {
          throw new Error(`Invalid async component load result: ${comp}`);
        }
        resolvedComp = comp;
        return comp;
      }));
    };
    return defineComponent({
      __asyncLoader: load,
      name: "AsyncComponentWrapper",
      setup() {
        const instance = currentInstance;
        if (resolvedComp) {
          return () => createInnerComp(resolvedComp, instance);
        }
        const onError = (err) => {
          pendingRequest = null;
          handleError(err, instance, 13);
        };
        if (suspensible && instance.suspense || false) {
          return load().then((comp) => {
            return () => createInnerComp(comp, instance);
          }).catch((err) => {
            onError(err);
            return () => errorComponent ? createVNode(errorComponent, {error: err}) : null;
          });
        }
        const loaded = ref(false);
        const error = ref();
        const delayed = ref(!!delay);
        if (delay) {
          setTimeout(() => {
            delayed.value = false;
          }, delay);
        }
        if (timeout != null) {
          setTimeout(() => {
            if (!loaded.value) {
              const err = new Error(`Async component timed out after ${timeout}ms.`);
              onError(err);
              error.value = err;
            }
          }, timeout);
        }
        load().then(() => {
          loaded.value = true;
        }).catch((err) => {
          onError(err);
          error.value = err;
        });
        return () => {
          if (loaded.value && resolvedComp) {
            return createInnerComp(resolvedComp, instance);
          } else if (error.value && errorComponent) {
            return createVNode(errorComponent, {
              error: error.value
            });
          } else if (loadingComponent && !delayed.value) {
            return createVNode(loadingComponent);
          }
        };
      }
    });
  }
  function createInnerComp(comp, {vnode: {props, children}}) {
    return createVNode(comp, props, children);
  }
  function h(type, propsOrChildren, children) {
    if (arguments.length === 2) {
      if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (isVNode(children)) {
        children = [children];
      }
      return createVNode(type, propsOrChildren, children);
    }
  }
  const useCSSModule = (name = "$style") => {
    {
      const instance = getCurrentInstance();
      if (!instance) {
        warn(`useCSSModule must be called inside setup()`);
        return EMPTY_OBJ;
      }
      const modules = instance.type.__cssModules;
      if (!modules) {
        warn(`Current instance does not have CSS modules injected.`);
        return EMPTY_OBJ;
      }
      const mod = modules[name];
      if (!mod) {
        warn(`Current instance does not have CSS module named "${name}".`);
        return EMPTY_OBJ;
      }
      return mod;
    }
  };
  const ssrContextKey = Symbol(`ssrContext`);
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      if (!ctx) {
        warn(`Server rendering context not provided. Make sure to only call useSsrContext() conditionally in the server build.`);
      }
      return ctx;
    }
  };
  function renderList(source, renderItem) {
    let ret;
    if (isArray(source) || isString(source)) {
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(source[i], i);
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i);
      }
    } else if (isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(source, renderItem);
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i);
        }
      }
    } else {
      ret = [];
    }
    return ret;
  }
  function toHandlers(obj) {
    const ret = {};
    if (!isObject(obj)) {
      warn(`v-on with no argument expects an object value.`);
      return ret;
    }
    for (const key in obj) {
      ret[`on${capitalize(key)}`] = obj[key];
    }
    return ret;
  }
  function renderSlot(slots, name, props = {}, fallback) {
    let slot = slots[name];
    if (slot && slot.length > 1) {
      warn(`SSR-optimized slot function detected in a non-SSR-optimized render function. You need to mark this component with $dynamic-slots in the parent template.`);
      slot = () => [];
    }
    return openBlock(), createBlock(Fragment, {key: props.key}, slot ? slot(props) : fallback ? fallback() : [], slots._ ? 64 : -2);
  }
  function createSlots(slots, dynamicSlots) {
    for (let i = 0; i < dynamicSlots.length; i++) {
      const slot = dynamicSlots[i];
      if (isArray(slot)) {
        for (let j = 0; j < slot.length; j++) {
          slots[slot[j].name] = slot[j].fn;
        }
      } else if (slot) {
        slots[slot.name] = slot.fn;
      }
    }
    return slots;
  }
  const version = "3.0.0-beta.20";
  const _toDisplayString = toDisplayString;
  const _camelize = camelize;
  const ssrUtils = null;
  const svgNS = "http://www.w3.org/2000/svg";
  const doc = typeof document !== "undefined" ? document : null;
  let tempContainer;
  let tempSVGContainer;
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, isSVG, is) => isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? {is} : void 0),
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    cloneNode(el) {
      return el.cloneNode(true);
    },
    insertStaticContent(content, parent, anchor, isSVG) {
      const temp = isSVG ? tempSVGContainer || (tempSVGContainer = doc.createElementNS(svgNS, "svg")) : tempContainer || (tempContainer = doc.createElement("div"));
      temp.innerHTML = content;
      const first = temp.firstChild;
      let node = first;
      let last2 = node;
      while (node) {
        last2 = node;
        nodeOps.insert(node, parent, anchor);
        node = temp.firstChild;
      }
      return [first, last2];
    }
  };
  function patchClass(el, value, isSVG) {
    if (value == null) {
      value = "";
    }
    if (isSVG) {
      el.setAttribute("class", value);
    } else {
      const transitionClasses = el._vtc;
      if (transitionClasses) {
        value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
      }
      el.className = value;
    }
  }
  function patchStyle(el, prev, next) {
    const style = el.style;
    if (!next) {
      el.removeAttribute("style");
    } else if (isString(next)) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else {
      for (const key in next) {
        setStyle(style, key, next[key]);
      }
      if (prev && !isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
  }
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = _camelize(rawName);
    if (name !== "filter" && name in style) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      const isBoolean2 = isSpecialBooleanAttr(key);
      if (value == null || isBoolean2 && value === false) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, isBoolean2 ? "" : value);
      }
    }
  }
  function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (key === "innerHTML" || key === "textContent") {
      if (prevChildren) {
        unmountChildren(prevChildren, parentComponent, parentSuspense);
      }
      el[key] = value == null ? "" : value;
      return;
    }
    if (key === "value" && el.tagName !== "PROGRESS") {
      el._value = value;
      el.value = value == null ? "" : value;
      return;
    }
    if (value === "" && typeof el[key] === "boolean") {
      el[key] = true;
    } else if (value == null && typeof el[key] === "string") {
      el[key] = "";
    } else {
      try {
        el[key] = value;
      } catch (e) {
        {
          warn(`Failed setting prop "${key}" on <${el.tagName.toLowerCase()}>: value ${value} is invalid.`, e);
        }
      }
    }
  }
  let _getNow = Date.now;
  if (typeof document !== "undefined" && _getNow() > document.createEvent("Event").timeStamp) {
    _getNow = () => performance.now();
  }
  let cachedNow = 0;
  const p$1 = Promise.resolve();
  const reset = () => {
    cachedNow = 0;
  };
  const getNow = () => cachedNow || (p$1.then(reset), cachedNow = _getNow());
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const name = rawName.slice(2).toLowerCase();
    const prevOptions = prevValue && "options" in prevValue && prevValue.options;
    const nextOptions = nextValue && "options" in nextValue && nextValue.options;
    const invoker = prevValue && prevValue.invoker;
    const value = nextValue && "handler" in nextValue ? nextValue.handler : nextValue;
    if (prevOptions || nextOptions) {
      const prev = prevOptions || EMPTY_OBJ;
      const next = nextOptions || EMPTY_OBJ;
      if (prev.capture !== next.capture || prev.passive !== next.passive || prev.once !== next.once) {
        if (invoker) {
          removeEventListener(el, name, invoker, prev);
        }
        if (nextValue && value) {
          const invoker2 = createInvoker(value, instance);
          nextValue.invoker = invoker2;
          addEventListener(el, name, invoker2, next);
        }
        return;
      }
    }
    if (nextValue && value) {
      if (invoker) {
        prevValue.invoker = null;
        invoker.value = value;
        nextValue.invoker = invoker;
        invoker.lastUpdated = getNow();
      } else {
        addEventListener(el, name, createInvoker(value, instance), nextOptions || void 0);
      }
    } else if (invoker) {
      removeEventListener(el, name, invoker, prevOptions || void 0);
    }
  }
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      const timeStamp = e.timeStamp || _getNow();
      if (timeStamp >= invoker.lastUpdated - 1) {
        callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
      }
    };
    invoker.value = initialValue;
    initialValue.invoker = invoker;
    invoker.lastUpdated = getNow();
    return invoker;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map((fn) => (e2) => !e2._stopped && fn(e2));
    } else {
      return value;
    }
  }
  const nativeOnRE = /^on[a-z]/;
  const forcePatchProp = (_, key) => key === "value";
  const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
    switch (key) {
      case "class":
        patchClass(el, nextValue, isSVG);
        break;
      case "style":
        patchStyle(el, prevValue, nextValue);
        break;
      default:
        if (isOn(key)) {
          if (!key.startsWith("onUpdate:")) {
            patchEvent(el, key, prevValue, nextValue, parentComponent);
          }
        } else if (shouldSetAsProp(el, key, nextValue, isSVG)) {
          patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
        } else {
          if (key === "true-value") {
            el._trueValue = nextValue;
          } else if (key === "false-value") {
            el._falseValue = nextValue;
          }
          patchAttr(el, key, nextValue, isSVG);
        }
        break;
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML") {
        return true;
      }
      if (key in el && nativeOnRE.test(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (nativeOnRE.test(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const TRANSITION$1 = "transition";
  const ANIMATION = "animation";
  const Transition = (props, {slots}) => h(BaseTransition, resolveTransitionProps(props), slots);
  Transition.displayName = "Transition";
  const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  };
  const TransitionPropsValidators = Transition.props = extend({}, BaseTransition.props, DOMTransitionPropsValidators);
  function resolveTransitionProps(rawProps) {
    let {name = "v", type, css = true, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to`} = rawProps;
    const baseProps = {};
    for (const key in rawProps) {
      if (!(key in DOMTransitionPropsValidators)) {
        baseProps[key] = rawProps[key];
      }
    }
    if (!css) {
      return baseProps;
    }
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const {onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled} = baseProps;
    const finishEnter = (el, isAppear, done) => {
      removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
      removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
      done && done();
    };
    const finishLeave = (el, done) => {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
      done && done();
    };
    const makeEnterHook = (isAppear) => {
      return (el, done) => {
        const hook = isAppear ? onAppear : onEnter;
        const resolve = () => finishEnter(el, isAppear, done);
        hook && hook(el, resolve);
        nextFrame(() => {
          removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
          addTransitionClass(el, isAppear ? appearToClass : enterToClass);
          if (!(hook && hook.length > 1)) {
            if (enterDuration) {
              setTimeout(resolve, enterDuration);
            } else {
              whenTransitionEnds(el, type, resolve);
            }
          }
        });
      };
    };
    return extend(baseProps, {
      onBeforeEnter(el) {
        onBeforeEnter && onBeforeEnter(el);
        addTransitionClass(el, enterActiveClass);
        addTransitionClass(el, enterFromClass);
      },
      onBeforeAppear(el) {
        onBeforeAppear && onBeforeAppear(el);
        addTransitionClass(el, appearActiveClass);
        addTransitionClass(el, appearFromClass);
      },
      onEnter: makeEnterHook(false),
      onAppear: makeEnterHook(true),
      onLeave(el, done) {
        const resolve = () => finishLeave(el, done);
        addTransitionClass(el, leaveActiveClass);
        addTransitionClass(el, leaveFromClass);
        nextFrame(() => {
          removeTransitionClass(el, leaveFromClass);
          addTransitionClass(el, leaveToClass);
          if (!(onLeave && onLeave.length > 1)) {
            if (leaveDuration) {
              setTimeout(resolve, leaveDuration);
            } else {
              whenTransitionEnds(el, type, resolve);
            }
          }
        });
        onLeave && onLeave(el, resolve);
      },
      onEnterCancelled(el) {
        finishEnter(el, false);
        onEnterCancelled && onEnterCancelled(el);
      },
      onAppearCancelled(el) {
        finishEnter(el, true);
        onAppearCancelled && onAppearCancelled(el);
      },
      onLeaveCancelled(el) {
        finishLeave(el);
        onLeaveCancelled && onLeaveCancelled(el);
      }
    });
  }
  function normalizeDuration(duration) {
    if (duration == null) {
      return null;
    } else if (isObject(duration)) {
      return [NumberOf(duration.enter), NumberOf(duration.leave)];
    } else {
      const n = NumberOf(duration);
      return [n, n];
    }
  }
  function NumberOf(val) {
    const res = toNumber(val);
    validateDuration(res);
    return res;
  }
  function validateDuration(val) {
    if (typeof val !== "number") {
      warn(`<transition> explicit duration is not a valid number - got ${JSON.stringify(val)}.`);
    } else if (isNaN(val)) {
      warn(`<transition> explicit duration is NaN - the duration expression might be incorrect.`);
    }
  }
  function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
    (el._vtc || (el._vtc = new Set())).add(cls);
  }
  function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
    const {_vtc} = el;
    if (_vtc) {
      _vtc.delete(cls);
      if (!_vtc.size) {
        el._vtc = void 0;
      }
    }
  }
  function nextFrame(cb) {
    requestAnimationFrame(() => {
      requestAnimationFrame(cb);
    });
  }
  function whenTransitionEnds(el, expectedType, cb) {
    const {type, timeout, propCount} = getTransitionInfo(el, expectedType);
    if (!type) {
      return cb();
    }
    const endEvent = type + "end";
    let ended = 0;
    const end = () => {
      el.removeEventListener(endEvent, onEnd);
      cb();
    };
    const onEnd = (e) => {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(endEvent, onEnd);
  }
  function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    const getStyleProperties = (key) => (styles[key] || "").split(", ");
    const transitionDelays = getStyleProperties(TRANSITION$1 + "Delay");
    const transitionDurations = getStyleProperties(TRANSITION$1 + "Duration");
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(ANIMATION + "Delay");
    const animationDurations = getStyleProperties(ANIMATION + "Duration");
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    if (expectedType === TRANSITION$1) {
      if (transitionTimeout > 0) {
        type = TRANSITION$1;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION$1 : ANIMATION : null;
      propCount = type ? type === TRANSITION$1 ? transitionDurations.length : animationDurations.length : 0;
    }
    const hasTransform = type === TRANSITION$1 && /\b(transform|all)(,|$)/.test(styles[TRANSITION$1 + "Property"]);
    return {
      type,
      timeout,
      propCount,
      hasTransform
    };
  }
  function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
  }
  function toMs(s) {
    return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
  }
  const positionMap = new WeakMap();
  const newPositionMap = new WeakMap();
  const TransitionGroupImpl = {
    name: "TransitionGroup",
    props: extend({}, TransitionPropsValidators, {
      tag: String,
      moveClass: String
    }),
    setup(props, {slots}) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      let prevChildren;
      let children;
      onUpdated(() => {
        if (!prevChildren.length) {
          return;
        }
        const moveClass = props.moveClass || `${props.name || "v"}-move`;
        if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
          return;
        }
        prevChildren.forEach(callPendingCbs);
        prevChildren.forEach(recordPosition);
        const movedChildren = prevChildren.filter(applyTranslation);
        forceReflow();
        movedChildren.forEach((c) => {
          const el = c.el;
          const style = el.style;
          addTransitionClass(el, moveClass);
          style.transform = style.webkitTransform = style.transitionDuration = "";
          const cb = el._moveCb = (e) => {
            if (e && e.target !== el) {
              return;
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener("transitionend", cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          };
          el.addEventListener("transitionend", cb);
        });
      });
      return () => {
        const rawProps = toRaw(props);
        const cssTransitionProps = resolveTransitionProps(rawProps);
        const tag = rawProps.tag || Fragment;
        prevChildren = children;
        children = slots.default ? getTransitionRawChildren(slots.default()) : [];
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.key != null) {
            setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
          } else {
            warn(`<TransitionGroup> children must be keyed.`);
          }
        }
        if (prevChildren) {
          for (let i = 0; i < prevChildren.length; i++) {
            const child = prevChildren[i];
            setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
            positionMap.set(child, child.el.getBoundingClientRect());
          }
        }
        return createVNode(tag, null, children);
      };
    }
  };
  delete TransitionGroupImpl.props.mode;
  const TransitionGroup = TransitionGroupImpl;
  function callPendingCbs(c) {
    const el = c.el;
    if (el._moveCb) {
      el._moveCb();
    }
    if (el._enterCb) {
      el._enterCb();
    }
  }
  function recordPosition(c) {
    newPositionMap.set(c, c.el.getBoundingClientRect());
  }
  function applyTranslation(c) {
    const oldPos = positionMap.get(c);
    const newPos = newPositionMap.get(c);
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
      const s = c.el.style;
      s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
      s.transitionDuration = "0s";
      return c;
    }
  }
  function forceReflow() {
    return document.body.offsetHeight;
  }
  function hasCSSTransform(el, root, moveClass) {
    const clone = el.cloneNode();
    if (el._vtc) {
      el._vtc.forEach((cls) => {
        cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
      });
    }
    moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
    clone.style.display = "none";
    const container = root.nodeType === 1 ? root : root.parentNode;
    container.appendChild(clone);
    const {hasTransform} = getTransitionInfo(clone);
    container.removeChild(clone);
    return hasTransform;
  }
  const getModelAssigner = (vnode) => {
    const fn = vnode.props["onUpdate:modelValue"];
    return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
    e.target.composing = true;
  }
  function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
      target.composing = false;
      trigger$1(target, "input");
    }
  }
  function trigger$1(el, type) {
    const e = document.createEvent("HTMLEvents");
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }
  const vModelText = {
    beforeMount(el, {value, modifiers: {lazy, trim, number}}, vnode) {
      el.value = value == null ? "" : value;
      el._assign = getModelAssigner(vnode);
      const castToNumber = number || el.type === "number";
      addEventListener(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing)
          return;
        let domValue = el.value;
        if (trim) {
          domValue = domValue.trim();
        } else if (castToNumber) {
          domValue = toNumber(domValue);
        }
        el._assign(domValue);
      });
      if (trim) {
        addEventListener(el, "change", () => {
          el.value = el.value.trim();
        });
      }
      if (!lazy) {
        addEventListener(el, "compositionstart", onCompositionStart);
        addEventListener(el, "compositionend", onCompositionEnd);
        addEventListener(el, "change", onCompositionEnd);
      }
    },
    beforeUpdate(el, {value, modifiers: {trim, number}}, vnode) {
      el._assign = getModelAssigner(vnode);
      if (document.activeElement === el) {
        if (trim && el.value.trim() === value) {
          return;
        }
        if ((number || el.type === "number") && toNumber(el.value) === value) {
          return;
        }
      }
      el.value = value == null ? "" : value;
    }
  };
  const vModelCheckbox = {
    beforeMount(el, binding, vnode) {
      setChecked(el, binding, vnode);
      el._assign = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        const modelValue = el._modelValue;
        const elementValue = getValue(el);
        const checked = el.checked;
        const assign = el._assign;
        if (isArray(modelValue)) {
          const index = looseIndexOf(modelValue, elementValue);
          const found = index !== -1;
          if (checked && !found) {
            assign(modelValue.concat(elementValue));
          } else if (!checked && found) {
            const filtered = [...modelValue];
            filtered.splice(index, 1);
            assign(filtered);
          }
        } else {
          assign(getCheckboxValue(el, checked));
        }
      });
    },
    beforeUpdate(el, binding, vnode) {
      el._assign = getModelAssigner(vnode);
      setChecked(el, binding, vnode);
    }
  };
  function setChecked(el, {value, oldValue}, vnode) {
    el._modelValue = value;
    if (isArray(value)) {
      el.checked = looseIndexOf(value, vnode.props.value) > -1;
    } else if (value !== oldValue) {
      el.checked = looseEqual(value, getCheckboxValue(el, true));
    }
  }
  const vModelRadio = {
    beforeMount(el, {value}, vnode) {
      el.checked = looseEqual(value, vnode.props.value);
      el._assign = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        el._assign(getValue(el));
      });
    },
    beforeUpdate(el, {value, oldValue}, vnode) {
      el._assign = getModelAssigner(vnode);
      if (value !== oldValue) {
        el.checked = looseEqual(value, vnode.props.value);
      }
    }
  };
  const vModelSelect = {
    mounted(el, {value}, vnode) {
      setSelected(el, value);
      el._assign = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(getValue);
        el._assign(el.multiple ? selectedVal : selectedVal[0]);
      });
    },
    beforeUpdate(el, _binding, vnode) {
      el._assign = getModelAssigner(vnode);
    },
    updated(el, {value}) {
      setSelected(el, value);
    }
  };
  function setSelected(el, value) {
    const isMultiple = el.multiple;
    if (isMultiple && !isArray(value)) {
      warn(`<select multiple v-model> expects an Array value for its binding, but got ${Object.prototype.toString.call(value).slice(8, -1)}.`);
      return;
    }
    for (let i = 0, l = el.options.length; i < l; i++) {
      const option = el.options[i];
      const optionValue = getValue(option);
      if (isMultiple) {
        option.selected = looseIndexOf(value, optionValue) > -1;
      } else {
        if (looseEqual(getValue(option), value)) {
          el.selectedIndex = i;
          return;
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }
  function getValue(el) {
    return "_value" in el ? el._value : el.value;
  }
  function getCheckboxValue(el, checked) {
    const key = checked ? "_trueValue" : "_falseValue";
    return key in el ? el[key] : checked;
  }
  const vModelDynamic = {
    beforeMount(el, binding, vnode) {
      callModelHook(el, binding, vnode, null, "beforeMount");
    },
    mounted(el, binding, vnode) {
      callModelHook(el, binding, vnode, null, "mounted");
    },
    beforeUpdate(el, binding, vnode, prevVNode) {
      callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
    },
    updated(el, binding, vnode, prevVNode) {
      callModelHook(el, binding, vnode, prevVNode, "updated");
    }
  };
  function callModelHook(el, binding, vnode, prevVNode, hook) {
    let modelToUse;
    switch (el.tagName) {
      case "SELECT":
        modelToUse = vModelSelect;
        break;
      case "TEXTAREA":
        modelToUse = vModelText;
        break;
      default:
        switch (el.type) {
          case "checkbox":
            modelToUse = vModelCheckbox;
            break;
          case "radio":
            modelToUse = vModelRadio;
            break;
          default:
            modelToUse = vModelText;
        }
    }
    const fn = modelToUse[hook];
    fn && fn(el, binding, vnode, prevVNode);
  }
  const systemModifiers = ["ctrl", "shift", "alt", "meta"];
  const modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
  };
  const withModifiers = (fn, modifiers) => {
    return (event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers))
          return;
      }
      return fn(event, ...args);
    };
  };
  const keyNames = {
    esc: "escape",
    space: " ",
    up: "arrow-up",
    left: "arrow-left",
    right: "arrow-right",
    down: "arrow-down",
    delete: "backspace"
  };
  const withKeys = (fn, modifiers) => {
    return (event) => {
      if (!("key" in event))
        return;
      const eventKey = hyphenate(event.key);
      if (!modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
        return;
      }
      return fn(event);
    };
  };
  const vShow = {
    beforeMount(el, {value}, {transition}) {
      el._vod = el.style.display === "none" ? "" : el.style.display;
      if (transition && value) {
        transition.beforeEnter(el);
      } else {
        setDisplay(el, value);
      }
    },
    mounted(el, {value}, {transition}) {
      if (transition && value) {
        transition.enter(el);
      }
    },
    updated(el, {value, oldValue}, {transition}) {
      if (!value === !oldValue)
        return;
      if (transition) {
        if (value) {
          transition.beforeEnter(el);
          setDisplay(el, true);
          transition.enter(el);
        } else {
          transition.leave(el, () => {
            setDisplay(el, false);
          });
        }
      } else {
        setDisplay(el, value);
      }
    },
    beforeUnmount(el, {value}) {
      setDisplay(el, value);
    }
  };
  function setDisplay(el, value) {
    el.style.display = value ? el._vod : "none";
  }
  const rendererOptions = extend({patchProp, forcePatchProp}, nodeOps);
  let renderer;
  let enabledHydration = false;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  function ensureHydrationRenderer() {
    renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
    enabledHydration = true;
    return renderer;
  }
  const render = (...args) => {
    ensureRenderer().render(...args);
  };
  const hydrate = (...args) => {
    ensureHydrationRenderer().hydrate(...args);
  };
  const createApp = (...args) => {
    const app = ensureRenderer().createApp(...args);
    {
      injectNativeTagCheck(app);
    }
    const {mount} = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container)
        return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      container.innerHTML = "";
      const proxy = mount(container);
      container.removeAttribute("v-cloak");
      return proxy;
    };
    return app;
  };
  const createSSRApp = (...args) => {
    const app = ensureHydrationRenderer().createApp(...args);
    {
      injectNativeTagCheck(app);
    }
    const {mount} = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (container) {
        return mount(container, true);
      }
    };
    return app;
  };
  function injectNativeTagCheck(app) {
    Object.defineProperty(app.config, "isNativeTag", {
      value: (tag) => isHTMLTag(tag) || isSVGTag(tag),
      writable: false
    });
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      if (!res) {
        warn(`Failed to mount app: mount target selector returned null.`);
      }
      return res;
    }
    return container;
  }
  var runtimeDom = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    render,
    hydrate,
    createApp,
    createSSRApp,
    Transition,
    TransitionGroup,
    vModelText,
    vModelCheckbox,
    vModelRadio,
    vModelSelect,
    vModelDynamic,
    withModifiers,
    withKeys,
    vShow,
    reactive,
    ref,
    readonly,
    unref,
    isRef,
    toRef,
    toRefs,
    isProxy,
    isReactive,
    isReadonly,
    customRef,
    triggerRef,
    shallowRef,
    shallowReactive,
    shallowReadonly,
    markRaw,
    toRaw,
    computed: computed$1,
    watch,
    watchEffect,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted,
    onActivated,
    onDeactivated,
    onRenderTracked,
    onRenderTriggered,
    onErrorCaptured,
    provide,
    inject,
    nextTick,
    defineComponent,
    defineAsyncComponent,
    getCurrentInstance,
    h,
    createVNode,
    cloneVNode,
    mergeProps,
    isVNode,
    Fragment,
    Text,
    Comment,
    Static,
    Teleport,
    Suspense,
    KeepAlive,
    BaseTransition,
    withDirectives,
    useCSSModule,
    useSSRContext,
    ssrContextKey,
    createRenderer,
    createHydrationRenderer,
    queuePostFlushCb,
    warn,
    handleError,
    callWithErrorHandling,
    callWithAsyncErrorHandling,
    resolveComponent,
    resolveDirective,
    resolveDynamicComponent,
    registerRuntimeCompiler,
    useTransitionState,
    resolveTransitionHooks,
    setTransitionHooks,
    getTransitionRawChildren,
    withCtx,
    renderList,
    toHandlers,
    renderSlot,
    createSlots,
    pushScopeId,
    popScopeId,
    withScopeId,
    openBlock,
    createBlock,
    setBlockTracking,
    createTextVNode,
    createCommentVNode,
    createStaticVNode,
    transformVNodeArgs,
    version,
    toDisplayString: _toDisplayString,
    camelize: _camelize,
    ssrUtils
  });
  const compileCache = Object.create(null);
  function compileToFunction(template, options) {
    if (!isString(template)) {
      if (template.nodeType) {
        template = template.innerHTML;
      } else {
        warn(`invalid template option: `, template);
        return NOOP;
      }
    }
    const key = template;
    const cached = compileCache[key];
    if (cached) {
      return cached;
    }
    if (template[0] === "#") {
      const el = document.querySelector(template);
      if (!el) {
        warn(`Template element not found or is empty: ${template}`);
      }
      template = el ? el.innerHTML : ``;
    }
    const {code} = compile(template, extend({
      hoistStatic: true,
      onError(err) {
        {
          const message = `Template compilation error: ${err.message}`;
          const codeFrame = err.loc && generateCodeFrame(template, err.loc.start.offset, err.loc.end.offset);
          warn(codeFrame ? `${message}
${codeFrame}` : message);
        }
      }
    }, options));
    const render2 = new Function("Vue", code)(runtimeDom);
    return compileCache[key] = render2;
  }
  registerRuntimeCompiler(compileToFunction);

  // src/util.js
  const toString = (...args) => Object.prototype.toString.call(...args).slice(8, -1);

  // src/components/UndefinedWrapper.js
  var UndefinedWrapper_default = {
    props: {
      data: {
        required: true,
        validator(data) {
          return toString(data) === "Undefined";
        }
      },
      name: {
        required: true,
        type: String
      }
    },
    template: `
    <span class="undefined">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="value">undefined</span>
    </span>
  `.trim()
  };

  // src/components/NullWrapper.js
  var NullWrapper_default = {
    props: {
      data: {
        required: true,
        validator(data) {
          return toString(data) === "Null";
        }
      },
      name: {
        required: true,
        type: String
      }
    },
    template: `
    <span class="null">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="value">null</span>
    </span>
  `.trim()
  };

  // src/components/BooleanWrapper.js
  var BooleanWrapper_default = {
    props: {
      data: {
        required: true,
        validator(data) {
          return toString(data) === "Boolean";
        }
      },
      name: {
        required: true,
        type: String
      }
    },
    template: `
    <span class="boolean">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="value">{{ data }}</span>
    </span>
  `.trim()
  };

  // src/components/NumberWrapper.js
  var NumberWrapper_default = {
    props: {
      data: {
        required: true,
        validator(data) {
          return toString(data) === "Number";
        }
      },
      name: {
        required: true,
        type: String
      }
    },
    template: `
    <span class="number">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="value">{{ data }}</span>
    </span>
  `.trim()
  };

  // src/components/StringWrapper.js
  var StringWrapper_default = {
    props: {
      data: {
        required: true,
        validator(data) {
          return toString(data) === "String";
        }
      },
      name: {
        required: true,
        type: String
      }
    },
    template: `
    <span class="string">
      <span class="key">{{ name }}</span>
      <span v-if="name !== ''" class="separator">:&nbsp;</span>
      <span class="quotes">"</span>
      <span class="value">{{ data }}</span>
      <span class="quotes">"</span>
    </span>
  `.trim()
  };

  // src/hooks.js
  function useExpand(props = {collapseSignal, expandSignal}) {
    const isExpanding = ref(false);
    const expandOrCollapse = () => {
      isExpanding.value = !isExpanding.value;
    };
    const innerCollapseSignal = ref(false);
    const collapseRecursive = (ev) => {
      isExpanding.value = false;
      innerCollapseSignal.value = !innerCollapseSignal.value;
    };
    watch(() => props.collapseSignal, collapseRecursive);
    const innerExpandSignal = ref(false);
    const expandRecursive = () => {
      isExpanding.value = true;
      innerExpandSignal.value = !innerExpandSignal.value;
    };
    watch(() => props.expandSignal, expandRecursive);
    const handleClick = (ev) => {
      if (ev.metaKey === true && ev.shiftKey === true) {
        collapseRecursive(ev);
      } else if (ev.metaKey === true) {
        expandRecursive(ev);
      } else {
        expandOrCollapse(ev);
      }
    };
    return {
      isExpanding,
      innerCollapseSignal,
      innerExpandSignal,
      handleClick
    };
  }

  // src/components/ArrayWrapper.js
  var ArrayWrapper_default = ArrayWrapper = {
    name: "array-wrapper",
    props: {
      data: {
        required: true,
        validator(data) {
          return toString(data) === "Array";
        }
      },
      name: {
        required: true,
        type: String
      },
      collapseSignal: {
        default: false,
        type: Boolean
      },
      expandSignal: {
        default: false,
        type: Boolean
      }
    },
    setup(props) {
      const {
        isExpanding,
        innerExpandSignal,
        innerCollapseSignal,
        handleClick
      } = useExpand(props);
      return {
        representingType: toString(props.data),
        isExpanding,
        innerExpandSignal,
        innerCollapseSignal,
        handleClick
      };
    },
    components: {},
    template: `
    <span class="array">
      <span
        class="indicator"
        @click="handleClick"
      >{{ isExpanding ? '▼' : '▶' }}</span>
      <span
        class="key"
        @click="handleClick"
      >{{ name === '' ? '' : name }}</span>
      <span
        class="separator"
        @click="handleClick"
      >{{ name === '' ? '' : ': ' }}</span>
      <span
        class="count"
        @click="handleClick"
      >
        {{ isExpanding === false && data.length >= 2 ? '(' + data.length + ')' : '' }}
      </span>
      <span
        class="preview"
        @click="handleClick"
      >
        {{ isExpanding ? 'Array(' + data.length + ')' : '[...]' }}
      </span>

      <span v-show="isExpanding" class="value">
        <wrapper
          v-for="(value, index) of data"
          :name="index + ''"
          :data="data[index]"
          :expand-signal="innerExpandSignal"
          :collapse-signal="innerCollapseSignal"
        ></wrapper>
      </span>
    </span>
  `
  };

  // src/components/ObjectWrapper.js
  var ObjectWrapper_default = ObjectWrapper = {
    name: "object-wrapper",
    props: {
      data: {
        required: true,
        validator(data) {
          return toString(data) === "Object";
        }
      },
      name: {
        required: true,
        type: String
      },
      collapseSignal: {
        default: false,
        type: Boolean
      },
      expandSignal: {
        default: false,
        type: Boolean
      }
    },
    setup(props) {
      const {
        isExpanding,
        innerExpandSignal,
        innerCollapseSignal,
        handleClick
      } = useExpand(props);
      return {
        representingType: toString(props.data),
        isExpanding,
        innerExpandSignal,
        innerCollapseSignal,
        handleClick
      };
    },
    components: {},
    template: `
    <span class="object">
      <span
        class="indicator"
        @click="handleClick"
      >{{ isExpanding ? '▼' : '▶' }}</span>
      <span
        class="key"
        @click="handleClick"
      >{{ name === '' ? '' : name }}</span>
      <span
        class="separator"
        @click="handleClick"
      >
        {{ name === '' ? '' : ': ' }}
      </span>
      <span
        class="preview"
        @click="handleClick"
      >
        {{ isExpanding ? '' : '{...}' }}
      </span>

      <span v-show="isExpanding" class="value">
        <wrapper
          v-for="key of Object.keys(data).sort()"
          class="value"
          :name="key"
          :data="data[key]"
          :expand-signal="innerExpandSignal"
          :collapse-signal="innerCollapseSignal"
        ></wrapper>
      </span>
    </span>
  `
  };

  // src/components/Wrapper.js
  const types = new Set([
    "Undefined",
    "Null",
    "Boolean",
    "Number",
    "String",
    "Array",
    "Object"
  ]);
  const Wrapper = {
    name: "wrapper",
    props: {
      data: {
        required: true,
        validator(data) {
          return types.has(toString(data));
        }
      },
      name: {
        required: true,
        type: String
      },
      collapseSignal: {
        default: false,
        type: Boolean
      },
      expandSignal: {
        default: false,
        type: Boolean
      }
    },
    setup(props) {
      return {
        representingType: toString(props.data)
      };
    },
    components: {
      UndefinedWrapper: UndefinedWrapper_default,
      NullWrapper: NullWrapper_default,
      BooleanWrapper: BooleanWrapper_default,
      NumberWrapper: NumberWrapper_default,
      StringWrapper: StringWrapper_default,
      ArrayWrapper: ArrayWrapper_default,
      ObjectWrapper: ObjectWrapper_default
    },
    template: `
    <undefined-wrapper
      v-if="representingType === 'Undefined'"
      :name="name"
      :data="data"
    ></undefined-wrapper>

    <null-wrapper
      v-else-if="representingType === 'Null'"
      :name="name"
      :data="data"
    ></null-wrapper>

    <boolean-wrapper
      v-else-if="representingType === 'Boolean'"
      :name="name"
      :data="data"
    ></boolean-wrapper>

    <number-wrapper
      v-else-if="representingType === 'Number'"
      :name="name"
      :data="data"
    ></number-wrapper>

    <string-wrapper
      v-else-if="representingType === 'String'"
      :name="name"
      :data="data"
    ></string-wrapper>

    <array-wrapper
      v-else-if="representingType === 'Array'"
      :name="name"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
    ></array-wrapper>

    <object-wrapper
      v-else-if="representingType === 'Object'"
      :name="name"
      :data="data"
      :collapse-signal="collapseSignal"
      :expand-signal="expandSignal"
    ></object-wrapper>
  `
  };
  ArrayWrapper_default.components.Wrapper = Wrapper;
  ObjectWrapper_default.components.Wrapper = Wrapper;
  var Wrapper_default = Wrapper;

  // src/mount.js
  var mount_default = (data, el, options = {
    rootName: ""
  }) => {
    el.classList.add("object-visualizer");
    createApp(Wrapper_default, {data, name: options.rootName}).mount(el);
  };
  return require_src();
})();
