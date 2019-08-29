
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
'use strict';

function noop() { }
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function children(element) {
    return Array.from(element.childNodes);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function flush() {
    const seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment) {
        $$.update($$.dirty);
        run_all($$.before_update);
        $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    if (component.$$.fragment) {
        run_all(component.$$.on_destroy);
        component.$$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        component.$$.on_destroy = component.$$.fragment = null;
        component.$$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal, prop_names) {
    const parent_component = current_component;
    set_current_component(component);
    const props = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props: prop_names,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, props, (key, value) => {
            if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    $$.bound[key](value);
                if (ready)
                    make_dirty(component, key);
            }
        })
        : props;
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment($$.ctx);
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error(`'target' is a required option`);
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn(`Component was already destroyed`); // eslint-disable-line no-console
        };
    }
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var svelteDiagrams = createCommonjsModule(function (module, exports) {
function noop(){}function run(t){return t()}function blank_object(){return Object.create(null)}function run_all(t){t.forEach(run);}function is_function(t){return "function"==typeof t}function safe_not_equal(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function insert(t,e,n){t.insertBefore(e,n||null);}function detach(t){t.parentNode.removeChild(t);}function element(t){return document.createElement(t)}function attr(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n);}function children(t){return Array.from(t.childNodes)}let current_component;function set_current_component(t){current_component=t;}Object.defineProperty(exports,"__esModule",{value:!0});const dirty_components=[],binding_callbacks=[],render_callbacks=[],flush_callbacks=[],resolved_promise=Promise.resolve();let update_scheduled=!1;function schedule_update(){update_scheduled||(update_scheduled=!0,resolved_promise.then(flush));}function add_render_callback(t){render_callbacks.push(t);}function flush(){const t=new Set;do{for(;dirty_components.length;){const t=dirty_components.shift();set_current_component(t),update(t.$$);}for(;binding_callbacks.length;)binding_callbacks.pop()();for(let e=0;e<render_callbacks.length;e+=1){const n=render_callbacks[e];t.has(n)||(n(),t.add(n));}render_callbacks.length=0;}while(dirty_components.length);for(;flush_callbacks.length;)flush_callbacks.pop()();update_scheduled=!1;}function update(t){t.fragment&&(t.update(t.dirty),run_all(t.before_update),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_update.forEach(add_render_callback));}const outroing=new Set;function transition_in(t,e){t&&t.i&&(outroing.delete(t),t.i(e));}function mount_component(t,e,n){const{fragment:o,on_mount:r,on_destroy:c,after_update:a}=t.$$;o.m(e,n),add_render_callback(()=>{const e=r.map(run).filter(is_function);c?c.push(...e):run_all(e),t.$$.on_mount=[];}),a.forEach(add_render_callback);}function destroy_component(t,e){t.$$.fragment&&(run_all(t.$$.on_destroy),t.$$.fragment.d(e),t.$$.on_destroy=t.$$.fragment=null,t.$$.ctx={});}function make_dirty(t,e){t.$$.dirty||(dirty_components.push(t),schedule_update(),t.$$.dirty=blank_object()),t.$$.dirty[e]=!0;}function init(t,e,n,o,r,c){const a=current_component;set_current_component(t);const l=e.props||{},s=t.$$={fragment:null,ctx:null,props:c,update:noop,not_equal:r,bound:blank_object(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:blank_object(),dirty:null};let u=!1;s.ctx=n?n(t,l,(e,n)=>{s.ctx&&r(s.ctx[e],s.ctx[e]=n)&&(s.bound[e]&&s.bound[e](n),u&&make_dirty(t,e));}):l,s.update(),u=!0,run_all(s.before_update),s.fragment=o(s.ctx),e.target&&(e.hydrate?s.fragment.l(children(e.target)):s.fragment.c(),e.intro&&transition_in(t.$$.fragment),mount_component(t,e.target,e.anchor),flush()),set_current_component(a);}class SvelteComponent{$destroy(){destroy_component(this,1),this.$destroy=noop;}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1);}}$set(){}}function create_fragment(t){var e;return {c(){attr(e=element("div"),"class","diagram pie-chart svelte-kbtrsz"),attr(e,"style",t.style);},m(t,n){insert(t,e,n);},p(t,n){t.style&&attr(e,"style",n.style);},i:noop,o:noop,d(t){t&&detach(e);}}}function instance(t,e,n){let{data:o=[],legends:r=[],size:c="150px",style:a=""}=e,l=0,s=0;return n("style",a+="background: conic-gradient("),o.forEach(function(t){l+=t;}),o.forEach(function(t,e){n("style",a+=`${r[e].color} ${s}deg `),n("style",a+=`${s+=t/l*360}deg,`);}),n("style",a=a.slice(0,-1)+");"),n("style",a+=`width: ${c}; height: ${c};`),t.$set=t=>{"data"in t&&n("data",o=t.data),"legends"in t&&n("legends",r=t.legends),"size"in t&&n("size",c=t.size),"style"in t&&n("style",a=t.style);},{data:o,legends:r,size:c,style:a}}class PieChart extends SvelteComponent{constructor(t){super(),init(this,t,instance,create_fragment,safe_not_equal,["data","legends","size","style"]);}}exports.PieChart=PieChart;

});

unwrapExports(svelteDiagrams);
var svelteDiagrams_1 = svelteDiagrams.PieChart;

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".diagram.pie-chart.svelte-kbtrsz{border-radius:50%}";
styleInject(css);

/* src\App.svelte generated by Svelte v3.9.1 */

const file = "src\\App.svelte";

function create_fragment(ctx) {
	var h1, t1, h2, t3, current;

	var piechart = new svelteDiagrams_1({
		props: { data: ctx.data, legends: ctx.legends },
		$$inline: true
	});

	return {
		c: function create() {
			h1 = element("h1");
			h1.textContent = "Svelte diagrams";
			t1 = space();
			h2 = element("h2");
			h2.textContent = "Browser usage";
			t3 = space();
			piechart.$$.fragment.c();
			add_location(h1, file, 33, 0, 599);
			add_location(h2, file, 35, 0, 627);
		},

		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},

		m: function mount(target, anchor) {
			insert(target, h1, anchor);
			insert(target, t1, anchor);
			insert(target, h2, anchor);
			insert(target, t3, anchor);
			mount_component(piechart, target, anchor);
			current = true;
		},

		p: function update(changed, ctx) {
			var piechart_changes = {};
			if (changed.data) piechart_changes.data = ctx.data;
			if (changed.legends) piechart_changes.legends = ctx.legends;
			piechart.$set(piechart_changes);
		},

		i: function intro(local) {
			if (current) return;
			transition_in(piechart.$$.fragment, local);

			current = true;
		},

		o: function outro(local) {
			transition_out(piechart.$$.fragment, local);
			current = false;
		},

		d: function destroy(detaching) {
			if (detaching) {
				detach(h1);
				detach(t1);
				detach(h2);
				detach(t3);
			}

			destroy_component(piechart, detaching);
		}
	};
}

function instance($$self) {
	

  let data = [63.37, 15.05, 4.49, 3.75, 3.57, 2.58];
  let legends = [
    {
      title: 'Chrome',
      color: '#ffc107',
    },
    {
      title: 'Safari',
      color: '#29b6f6',
    },
    {
      title: 'Firefox',
      color: '#ff5722',
    },
    {
      title: 'Samsung Internet',
      color: '#ab47bc',
    },
    {
      title: 'UC Browser',
      color: '#fff176',
    },
    {
      title: 'Opera',
      color: '#d32f2f',
    },
  ];

	return { data, legends };
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, []);
	}
}

var app = new App({
  target: document.body
});

module.exports = app;
//# sourceMappingURL=bundle.js.map
