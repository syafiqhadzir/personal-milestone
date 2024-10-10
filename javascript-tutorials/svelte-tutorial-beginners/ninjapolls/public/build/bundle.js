
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

	const identity = (x) => x;

	/**
	 * @template T
	 * @template S
	 * @param {T} tar
	 * @param {S} src
	 * @returns {T & S}
	 */
	function assign(tar, src) {
		// @ts-ignore
		for (const k in src) tar[k] = src[k];
		return /** @type {T & S} */ (tar);
	}

	/** @returns {void} */
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

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	let src_url_equal_anchor;

	/**
	 * @param {string} element_src
	 * @param {string} url
	 * @returns {boolean}
	 */
	function src_url_equal(element_src, url) {
		if (element_src === url) return true;
		if (!src_url_equal_anchor) {
			src_url_equal_anchor = document.createElement('a');
		}
		// This is actually faster than doing URL(..).href
		src_url_equal_anchor.href = url;
		return element_src === src_url_equal_anchor.href;
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	/** @returns {void} */
	function validate_store(store, name) {
		if (store != null && typeof store.subscribe !== 'function') {
			throw new Error(`'${name}' is not a store with a 'subscribe' method`);
		}
	}

	function subscribe(store, ...callbacks) {
		if (store == null) {
			for (const callback of callbacks) {
				callback(undefined);
			}
			return noop;
		}
		const unsub = store.subscribe(...callbacks);
		return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
	}

	/** @returns {void} */
	function component_subscribe(component, store, callback) {
		component.$$.on_destroy.push(subscribe(store, callback));
	}

	function create_slot(definition, ctx, $$scope, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, $$scope, fn) {
		return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
	}

	function get_slot_changes(definition, $$scope, dirty, fn) {
		if (definition[2] && fn) {
			const lets = definition[2](fn(dirty));
			if ($$scope.dirty === undefined) {
				return lets;
			}
			if (typeof lets === 'object') {
				const merged = [];
				const len = Math.max($$scope.dirty.length, lets.length);
				for (let i = 0; i < len; i += 1) {
					merged[i] = $$scope.dirty[i] | lets[i];
				}
				return merged;
			}
			return $$scope.dirty | lets;
		}
		return $$scope.dirty;
	}

	/** @returns {void} */
	function update_slot_base(
		slot,
		slot_definition,
		ctx,
		$$scope,
		slot_changes,
		get_slot_context_fn
	) {
		if (slot_changes) {
			const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
			slot.p(slot_context, slot_changes);
		}
	}

	/** @returns {any[] | -1} */
	function get_all_dirty_from_scope($$scope) {
		if ($$scope.ctx.length > 32) {
			const dirty = [];
			const length = $$scope.ctx.length / 32;
			for (let i = 0; i < length; i++) {
				dirty[i] = -1;
			}
			return dirty;
		}
		return -1;
	}

	function null_to_empty(value) {
		return value == null ? '' : value;
	}

	const is_client = typeof window !== 'undefined';

	/** @type {() => number} */
	let now = is_client ? () => window.performance.now() : () => Date.now();

	let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;

	const tasks = new Set();

	/**
	 * @param {number} now
	 * @returns {void}
	 */
	function run_tasks(now) {
		tasks.forEach((task) => {
			if (!task.c(now)) {
				tasks.delete(task);
				task.f();
			}
		});
		if (tasks.size !== 0) raf(run_tasks);
	}

	/**
	 * Creates a new task that runs on each raf frame
	 * until it returns a falsy value or is aborted
	 * @param {import('./private.js').TaskCallback} callback
	 * @returns {import('./private.js').Task}
	 */
	function loop(callback) {
		/** @type {import('./private.js').TaskEntry} */
		let task;
		if (tasks.size === 0) raf(run_tasks);
		return {
			promise: new Promise((fulfill) => {
				tasks.add((task = { c: callback, f: fulfill }));
			}),
			abort() {
				tasks.delete(task);
			}
		};
	}

	/** @type {typeof globalThis} */
	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: // @ts-ignore Node typings have this
			  global;

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} node
	 * @returns {ShadowRoot | Document}
	 */
	function get_root_for_style(node) {
		if (!node) return document;
		const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
		if (root && /** @type {ShadowRoot} */ (root).host) {
			return /** @type {ShadowRoot} */ (root);
		}
		return node.ownerDocument;
	}

	/**
	 * @param {Node} node
	 * @returns {CSSStyleSheet}
	 */
	function append_empty_stylesheet(node) {
		const style_element = element('style');
		// For transitions to work without 'style-src: unsafe-inline' Content Security Policy,
		// these empty tags need to be allowed with a hash as a workaround until we move to the Web Animations API.
		// Using the hash for the empty string (for an empty tag) works in all browsers except Safari.
		// So as a workaround for the workaround, when we append empty style tags we set their content to /* empty */.
		// The hash 'sha256-9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=' will then work even in Safari.
		style_element.textContent = '/* empty */';
		append_stylesheet(get_root_for_style(node), style_element);
		return style_element.sheet;
	}

	/**
	 * @param {ShadowRoot | Document} node
	 * @param {HTMLStyleElement} style
	 * @returns {CSSStyleSheet}
	 */
	function append_stylesheet(node, style) {
		append(/** @type {Document} */ (node).head || node, style);
		return style.sheet;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @returns {void} */
	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @returns {(event: any) => any} */
	function prevent_default(fn) {
		return function (event) {
			event.preventDefault();
			// @ts-ignore
			return fn.call(this, event);
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @returns {void} */
	function set_input_value(input, value) {
		input.value = value == null ? '' : value;
	}

	/**
	 * @returns {void} */
	function set_style(node, key, value, important) {
		if (value == null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, '');
		}
	}

	/**
	 * @returns {void} */
	function toggle_class(element, name, toggle) {
		// The `!!` is required because an `undefined` flag means flipping the current state.
		element.classList.toggle(name, !!toggle);
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	// we need to store the information for multiple documents because a Svelte application could also contain iframes
	// https://github.com/sveltejs/svelte/issues/3624
	/** @type {Map<Document | ShadowRoot, import('./private.d.ts').StyleInformation>} */
	const managed_styles = new Map();

	let active = 0;

	// https://github.com/darkskyapp/string-hash/blob/master/index.js
	/**
	 * @param {string} str
	 * @returns {number}
	 */
	function hash(str) {
		let hash = 5381;
		let i = str.length;
		while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
		return hash >>> 0;
	}

	/**
	 * @param {Document | ShadowRoot} doc
	 * @param {Element & ElementCSSInlineStyle} node
	 * @returns {{ stylesheet: any; rules: {}; }}
	 */
	function create_style_information(doc, node) {
		const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
		managed_styles.set(doc, info);
		return info;
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {number} a
	 * @param {number} b
	 * @param {number} duration
	 * @param {number} delay
	 * @param {(t: number) => number} ease
	 * @param {(t: number, u: number) => string} fn
	 * @param {number} uid
	 * @returns {string}
	 */
	function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
		const step = 16.666 / duration;
		let keyframes = '{\n';
		for (let p = 0; p <= 1; p += step) {
			const t = a + (b - a) * ease(p);
			keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
		}
		const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
		const name = `__svelte_${hash(rule)}_${uid}`;
		const doc = get_root_for_style(node);
		const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
		if (!rules[name]) {
			rules[name] = true;
			stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
		}
		const animation = node.style.animation || '';
		node.style.animation = `${
		animation ? `${animation}, ` : ''
	}${name} ${duration}ms linear ${delay}ms 1 both`;
		active += 1;
		return name;
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {string} [name]
	 * @returns {void}
	 */
	function delete_rule(node, name) {
		const previous = (node.style.animation || '').split(', ');
		const next = previous.filter(
			name
				? (anim) => anim.indexOf(name) < 0 // remove specific animation
				: (anim) => anim.indexOf('__svelte') === -1 // remove all Svelte animations
		);
		const deleted = previous.length - next.length;
		if (deleted) {
			node.style.animation = next.join(', ');
			active -= deleted;
			if (!active) clear_rules();
		}
	}

	/** @returns {void} */
	function clear_rules() {
		raf(() => {
			if (active) return;
			managed_styles.forEach((info) => {
				const { ownerNode } = info.stylesheet;
				// there is no ownerNode if it runs on jsdom.
				if (ownerNode) detach(ownerNode);
			});
			managed_styles.clear();
		});
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {import('./private.js').PositionRect} from
	 * @param {import('./private.js').AnimationFn} fn
	 */
	function create_animation(node, from, fn, params) {
		if (!from) return noop;
		const to = node.getBoundingClientRect();
		if (
			from.left === to.left &&
			from.right === to.right &&
			from.top === to.top &&
			from.bottom === to.bottom
		)
			return noop;
		const {
			delay = 0,
			duration = 300,
			easing = identity,
			// @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
			start: start_time = now() + delay,
			// @ts-ignore todo:
			end = start_time + duration,
			tick = noop,
			css
		} = fn(node, { from, to }, params);
		let running = true;
		let started = false;
		let name;
		/** @returns {void} */
		function start() {
			if (css) {
				name = create_rule(node, 0, 1, duration, delay, easing, css);
			}
			if (!delay) {
				started = true;
			}
		}
		/** @returns {void} */
		function stop() {
			if (css) delete_rule(node, name);
			running = false;
		}
		loop((now) => {
			if (!started && now >= start_time) {
				started = true;
			}
			if (started && now >= end) {
				tick(1, 0);
				stop();
			}
			if (!running) {
				return false;
			}
			if (started) {
				const p = now - start_time;
				const t = 0 + 1 * easing(p / duration);
				tick(t, 1 - t);
			}
			return true;
		});
		start();
		tick(0, 1);
		return stop;
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @returns {void}
	 */
	function fix_position(node) {
		const style = getComputedStyle(node);
		if (style.position !== 'absolute' && style.position !== 'fixed') {
			const { width, height } = style;
			const a = node.getBoundingClientRect();
			node.style.position = 'absolute';
			node.style.width = width;
			node.style.height = height;
			add_transform(node, a);
		}
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {import('./private.js').PositionRect} a
	 * @returns {void}
	 */
	function add_transform(node, a) {
		const b = node.getBoundingClientRect();
		if (a.left !== b.left || a.top !== b.top) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;
			node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
		}
	}

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](https://svelte.dev/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
	 * ```ts
	 * const dispatch = createEventDispatcher<{
	 *  loaded: never; // does not take a detail argument
	 *  change: string; // takes a detail argument of type string, which is required
	 *  optional: number | null; // takes an optional detail argument of type number
	 * }>();
	 * ```
	 *
	 * https://svelte.dev/docs/svelte#createeventdispatcher
	 * @template {Record<string, any>} [EventMap=any]
	 * @returns {import('./public.js').EventDispatcher<EventMap>}
	 */
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail, { cancelable = false } = {}) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
				callbacks.slice().forEach((fn) => {
					fn.call(component, event);
				});
				return !event.defaultPrevented;
			}
			return true;
		};
	}

	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	/**
	 * @param component
	 * @param event
	 * @returns {void}
	 */
	function bubble(component, event) {
		const callbacks = component.$$.callbacks[event.type];
		if (callbacks) {
			// @ts-ignore
			callbacks.slice().forEach((fn) => fn.call(this, event));
		}
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	/**
	 * @type {Promise<void> | null}
	 */
	let promise;

	/**
	 * @returns {Promise<void>}
	 */
	function wait() {
		if (!promise) {
			promise = Promise.resolve();
			promise.then(() => {
				promise = null;
			});
		}
		return promise;
	}

	/**
	 * @param {Element} node
	 * @param {INTRO | OUTRO | boolean} direction
	 * @param {'start' | 'end'} kind
	 * @returns {void}
	 */
	function dispatch(node, direction, kind) {
		node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @returns {void} */
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}

	/**
	 * @returns {void} */
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/**
	 * @type {import('../transition/public.js').TransitionConfig}
	 */
	const null_transition = { duration: 0 };

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {TransitionFn} fn
	 * @param {any} params
	 * @returns {{ start(): void; invalidate(): void; end(): void; }}
	 */
	function create_in_transition(node, fn, params) {
		/**
		 * @type {TransitionOptions} */
		const options = { direction: 'in' };
		let config = fn(node, params, options);
		let running = false;
		let animation_name;
		let task;
		let uid = 0;

		/**
		 * @returns {void} */
		function cleanup() {
			if (animation_name) delete_rule(node, animation_name);
		}

		/**
		 * @returns {void} */
		function go() {
			const {
				delay = 0,
				duration = 300,
				easing = identity,
				tick = noop,
				css
			} = config || null_transition;
			if (css) animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
			tick(0, 1);
			const start_time = now() + delay;
			const end_time = start_time + duration;
			if (task) task.abort();
			running = true;
			add_render_callback(() => dispatch(node, true, 'start'));
			task = loop((now) => {
				if (running) {
					if (now >= end_time) {
						tick(1, 0);
						dispatch(node, true, 'end');
						cleanup();
						return (running = false);
					}
					if (now >= start_time) {
						const t = easing((now - start_time) / duration);
						tick(t, 1 - t);
					}
				}
				return running;
			});
		}
		let started = false;
		return {
			start() {
				if (started) return;
				started = true;
				delete_rule(node);
				if (is_function(config)) {
					config = config(options);
					wait().then(go);
				} else {
					go();
				}
			},
			invalidate() {
				started = false;
			},
			end() {
				if (running) {
					cleanup();
					running = false;
				}
			}
		};
	}

	/**
	 * @param {Element & ElementCSSInlineStyle} node
	 * @param {TransitionFn} fn
	 * @param {any} params
	 * @returns {{ end(reset: any): void; }}
	 */
	function create_out_transition(node, fn, params) {
		/** @type {TransitionOptions} */
		const options = { direction: 'out' };
		let config = fn(node, params, options);
		let running = true;
		let animation_name;
		const group = outros;
		group.r += 1;
		/** @type {boolean} */
		let original_inert_value;

		/**
		 * @returns {void} */
		function go() {
			const {
				delay = 0,
				duration = 300,
				easing = identity,
				tick = noop,
				css
			} = config || null_transition;

			if (css) animation_name = create_rule(node, 1, 0, duration, delay, easing, css);

			const start_time = now() + delay;
			const end_time = start_time + duration;
			add_render_callback(() => dispatch(node, false, 'start'));

			if ('inert' in node) {
				original_inert_value = /** @type {HTMLElement} */ (node).inert;
				node.inert = true;
			}

			loop((now) => {
				if (running) {
					if (now >= end_time) {
						tick(0, 1);
						dispatch(node, false, 'end');
						if (!--group.r) {
							// this will result in `end()` being called,
							// so we don't need to clean up here
							run_all(group.c);
						}
						return false;
					}
					if (now >= start_time) {
						const t = easing((now - start_time) / duration);
						tick(1 - t, t);
					}
				}
				return running;
			});
		}

		if (is_function(config)) {
			wait().then(() => {
				// @ts-ignore
				config = config(options);
				go();
			});
		} else {
			go();
		}

		return {
			end(reset) {
				if (reset && 'inert' in node) {
					node.inert = original_inert_value;
				}
				if (reset && config.tick) {
					config.tick(1, 0);
				}
				if (running) {
					if (animation_name) delete_rule(node, animation_name);
					running = false;
				}
			}
		};
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	/** @returns {void} */
	function outro_and_destroy_block(block, lookup) {
		transition_out(block, 1, 1, () => {
			lookup.delete(block.key);
		});
	}

	/** @returns {void} */
	function fix_and_outro_and_destroy_block(block, lookup) {
		block.f();
		outro_and_destroy_block(block, lookup);
	}

	/** @returns {any[]} */
	function update_keyed_each(
		old_blocks,
		dirty,
		get_key,
		dynamic,
		ctx,
		list,
		lookup,
		node,
		destroy,
		create_each_block,
		next,
		get_context
	) {
		let o = old_blocks.length;
		let n = list.length;
		let i = o;
		const old_indexes = {};
		while (i--) old_indexes[old_blocks[i].key] = i;
		const new_blocks = [];
		const new_lookup = new Map();
		const deltas = new Map();
		const updates = [];
		i = n;
		while (i--) {
			const child_ctx = get_context(ctx, list, i);
			const key = get_key(child_ctx);
			let block = lookup.get(key);
			if (!block) {
				block = create_each_block(key, child_ctx);
				block.c();
			} else {
				// defer updates until all the DOM shuffling is done
				updates.push(() => block.p(child_ctx, dirty));
			}
			new_lookup.set(key, (new_blocks[i] = block));
			if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
		}
		const will_move = new Set();
		const did_move = new Set();
		/** @returns {void} */
		function insert(block) {
			transition_in(block, 1);
			block.m(node, next);
			lookup.set(block.key, block);
			next = block.first;
			n--;
		}
		while (o && n) {
			const new_block = new_blocks[n - 1];
			const old_block = old_blocks[o - 1];
			const new_key = new_block.key;
			const old_key = old_block.key;
			if (new_block === old_block) {
				// do nothing
				next = new_block.first;
				o--;
				n--;
			} else if (!new_lookup.has(old_key)) {
				// remove old block
				destroy(old_block, lookup);
				o--;
			} else if (!lookup.has(new_key) || will_move.has(new_key)) {
				insert(new_block);
			} else if (did_move.has(old_key)) {
				o--;
			} else if (deltas.get(new_key) > deltas.get(old_key)) {
				did_move.add(new_key);
				insert(new_block);
			} else {
				will_move.add(old_key);
				o--;
			}
		}
		while (o--) {
			const old_block = old_blocks[o];
			if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
		}
		while (n) insert(new_blocks[n - 1]);
		run_all(updates);
		return new_blocks;
	}

	/** @returns {void} */
	function validate_each_keys(ctx, list, get_context, get_key) {
		const keys = new Map();
		for (let i = 0; i < list.length; i++) {
			const key = get_key(get_context(ctx, list, i));
			if (keys.has(key)) {
				let value = '';
				try {
					value = `with value '${String(key)}' `;
				} catch (e) {
					// can't stringify
				}
				throw new Error(
					`Cannot have duplicate keys in a keyed each: Keys at index ${keys.get(
					key
				)} and ${i} ${value}are duplicates`
				);
			}
			keys.set(key, i);
		}
	}

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	/**
	 * The current version, as set in package.json.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-version
	 * @type {string}
	 */
	const VERSION = '4.2.19';
	const PUBLIC_VERSION = '4';

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @returns {void}
	 */
	function dispatch_dev(type, detail) {
		document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append_dev(target, node) {
		dispatch_dev('SvelteDOMInsert', { target, node });
		append(target, node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert_dev(target, node, anchor) {
		dispatch_dev('SvelteDOMInsert', { target, node, anchor });
		insert(target, node, anchor);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach_dev(node) {
		dispatch_dev('SvelteDOMRemove', { node });
		detach(node);
	}

	/**
	 * @param {Node} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @param {boolean} [has_prevent_default]
	 * @param {boolean} [has_stop_propagation]
	 * @param {boolean} [has_stop_immediate_propagation]
	 * @returns {() => void}
	 */
	function listen_dev(
		node,
		event,
		handler,
		options,
		has_prevent_default,
		has_stop_propagation,
		has_stop_immediate_propagation
	) {
		const modifiers =
			options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
		if (has_prevent_default) modifiers.push('preventDefault');
		if (has_stop_propagation) modifiers.push('stopPropagation');
		if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');
		dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
		const dispose = listen(node, event, handler, options);
		return () => {
			dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
			dispose();
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr_dev(node, attribute, value) {
		attr(node, attribute, value);
		if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
		else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data_dev(text, data) {
		data = '' + data;
		if (text.data === data) return;
		dispatch_dev('SvelteDOMSetData', { node: text, data });
		text.data = /** @type {string} */ (data);
	}

	function ensure_array_like_dev(arg) {
		if (
			typeof arg !== 'string' &&
			!(arg && typeof arg === 'object' && 'length' in arg) &&
			!(typeof Symbol === 'function' && arg && Symbol.iterator in arg)
		) {
			throw new Error('{#each} only works with iterable values.');
		}
		return ensure_array_like(arg);
	}

	/**
	 * @returns {void} */
	function validate_slots(name, slot, keys) {
		for (const slot_key of Object.keys(slot)) {
			if (!~keys.indexOf(slot_key)) {
				console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
			}
		}
	}

	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 *
	 * Can be used to create strongly typed Svelte components.
	 *
	 * #### Example:
	 *
	 * You have component library on npm called `component-library`, from which
	 * you export a component called `MyComponent`. For Svelte+TypeScript users,
	 * you want to provide typings. Therefore you create a `index.d.ts`:
	 * ```ts
	 * import { SvelteComponent } from "svelte";
	 * export class MyComponent extends SvelteComponent<{foo: string}> {}
	 * ```
	 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
	 * to provide intellisense and to use the component like this in a Svelte file
	 * with TypeScript:
	 * ```svelte
	 * <script lang="ts">
	 * 	import { MyComponent } from "component-library";
	 * </script>
	 * <MyComponent foo={'bar'} />
	 * ```
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 * @template {Record<string, any>} [Slots=any]
	 * @extends {SvelteComponent<Props, Events>}
	 */
	class SvelteComponentDev extends SvelteComponent {
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Props}
		 */
		$$prop_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Events}
		 */
		$$events_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Slots}
		 */
		$$slot_def;

		/** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error("'target' is a required option");
			}
			super();
		}

		/** @returns {void} */
		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn('Component was already destroyed'); // eslint-disable-line no-console
			};
		}

		/** @returns {void} */
		$capture_state() {}

		/** @returns {void} */
		$inject_state() {}
	}

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	/* src\components\Header.svelte generated by Svelte v4.2.19 */
	const file$8 = "src\\components\\Header.svelte";

	function create_fragment$8(ctx) {
		let header;
		let h1;
		let img;
		let img_src_value;

		const block = {
			c: function create() {
				header = element("header");
				h1 = element("h1");
				img = element("img");
				if (!src_url_equal(img.src, img_src_value = "/img/poll_ninja_logo.svg")) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", "Poll Ninja Logo");
				attr_dev(img, "class", "svelte-zmn2ck");
				add_location(img, file$8, 2, 8, 28);
				attr_dev(h1, "class", "svelte-zmn2ck");
				add_location(h1, file$8, 1, 4, 14);
				attr_dev(header, "class", "svelte-zmn2ck");
				add_location(header, file$8, 0, 0, 0);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, header, anchor);
				append_dev(header, h1);
				append_dev(h1, img);
			},
			p: noop,
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(header);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$8.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$8($$self, $$props) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Header', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
		});

		return [];
	}

	class Header extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Header",
				options,
				id: create_fragment$8.name
			});
		}
	}

	/* src\shared\Tabs.svelte generated by Svelte v4.2.19 */
	const file$7 = "src\\shared\\Tabs.svelte";

	function get_each_context$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[4] = list[i];
		return child_ctx;
	}

	// (12:8) {#each items as item}
	function create_each_block$1(ctx) {
		let li;
		let button;
		let t0_value = /*item*/ ctx[4] + "";
		let t0;
		let t1;
		let mounted;
		let dispose;

		function click_handler() {
			return /*click_handler*/ ctx[3](/*item*/ ctx[4]);
		}

		const block = {
			c: function create() {
				li = element("li");
				button = element("button");
				t0 = text(t0_value);
				t1 = space();
				attr_dev(button, "class", "svelte-lsy64d");
				toggle_class(button, "active", /*item*/ ctx[4] === /*activeItem*/ ctx[1]);
				add_location(button, file$7, 13, 16, 273);
				attr_dev(li, "class", "svelte-lsy64d");
				add_location(li, file$7, 12, 12, 251);
			},
			m: function mount(target, anchor) {
				insert_dev(target, li, anchor);
				append_dev(li, button);
				append_dev(button, t0);
				append_dev(li, t1);

				if (!mounted) {
					dispose = listen_dev(button, "click", click_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*item*/ ctx[4] + "")) set_data_dev(t0, t0_value);

				if (dirty & /*items, activeItem*/ 3) {
					toggle_class(button, "active", /*item*/ ctx[4] === /*activeItem*/ ctx[1]);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(li);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block$1.name,
			type: "each",
			source: "(12:8) {#each items as item}",
			ctx
		});

		return block;
	}

	function create_fragment$7(ctx) {
		let div;
		let ul;
		let each_value = ensure_array_like_dev(/*items*/ ctx[0]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		const block = {
			c: function create() {
				div = element("div");
				ul = element("ul");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr_dev(ul, "class", "svelte-lsy64d");
				add_location(ul, file$7, 10, 4, 202);
				attr_dev(div, "class", "tabs svelte-lsy64d");
				add_location(div, file$7, 9, 0, 178);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, ul);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(ul, null);
					}
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*items, activeItem, dispatch*/ 7) {
					each_value = ensure_array_like_dev(/*items*/ ctx[0]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(ul, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}

					each_blocks.length = each_value.length;
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_each(each_blocks, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$7.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$7($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Tabs', slots, []);
		const dispatch = createEventDispatcher();
		let { items } = $$props;
		let { activeItem } = $$props;

		$$self.$$.on_mount.push(function () {
			if (items === undefined && !('items' in $$props || $$self.$$.bound[$$self.$$.props['items']])) {
				console.warn("<Tabs> was created without expected prop 'items'");
			}

			if (activeItem === undefined && !('activeItem' in $$props || $$self.$$.bound[$$self.$$.props['activeItem']])) {
				console.warn("<Tabs> was created without expected prop 'activeItem'");
			}
		});

		const writable_props = ['items', 'activeItem'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
		});

		const click_handler = item => dispatch("tabChange", item);

		$$self.$$set = $$props => {
			if ('items' in $$props) $$invalidate(0, items = $$props.items);
			if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
		};

		$$self.$capture_state = () => ({
			createEventDispatcher,
			dispatch,
			items,
			activeItem
		});

		$$self.$inject_state = $$props => {
			if ('items' in $$props) $$invalidate(0, items = $$props.items);
			if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [items, activeItem, dispatch, click_handler];
	}

	class Tabs extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$7, create_fragment$7, safe_not_equal, { items: 0, activeItem: 1 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Tabs",
				options,
				id: create_fragment$7.name
			});
		}

		get items() {
			throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set items(value) {
			throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get activeItem() {
			throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set activeItem(value) {
			throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/*
	Adapted from https://github.com/mattdesl
	Distributed under MIT License https://github.com/mattdesl/eases/blob/master/LICENSE.md
	*/

	/**
	 * https://svelte.dev/docs/svelte-easing
	 * @param {number} t
	 * @returns {number}
	 */
	function cubicOut(t) {
		const f = t - 1.0;
		return f * f * f + 1.0;
	}

	/**
	 * Animates the opacity of an element from 0 to the current opacity for `in` transitions and from the current opacity to 0 for `out` transitions.
	 *
	 * https://svelte.dev/docs/svelte-transition#fade
	 * @param {Element} node
	 * @param {import('./public').FadeParams} [params]
	 * @returns {import('./public').TransitionConfig}
	 */
	function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
		const o = +getComputedStyle(node).opacity;
		return {
			delay,
			duration,
			easing,
			css: (t) => `opacity: ${t * o}`
		};
	}

	/**
	 * Animates the opacity and scale of an element. `in` transitions animate from an element's current (default) values to the provided values, passed as parameters. `out` transitions animate from the provided values to an element's default values.
	 *
	 * https://svelte.dev/docs/svelte-transition#scale
	 * @param {Element} node
	 * @param {import('./public').ScaleParams} [params]
	 * @returns {import('./public').TransitionConfig}
	 */
	function scale(
		node,
		{ delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}
	) {
		const style = getComputedStyle(node);
		const target_opacity = +style.opacity;
		const transform = style.transform === 'none' ? '' : style.transform;
		const sd = 1 - start;
		const od = target_opacity * (1 - opacity);
		return {
			delay,
			duration,
			easing,
			css: (_t, u) => `
			transform: ${transform} scale(${1 - sd * u});
			opacity: ${target_opacity - od * u}
		`
		};
	}

	/**
	 * The flip function calculates the start and end position of an element and animates between them, translating the x and y values.
	 * `flip` stands for [First, Last, Invert, Play](https://aerotwist.com/blog/flip-your-animations/).
	 *
	 * https://svelte.dev/docs/svelte-animate#flip
	 * @param {Element} node
	 * @param {{ from: DOMRect; to: DOMRect }} fromTo
	 * @param {import('./public.js').FlipParams} params
	 * @returns {import('./public.js').AnimationConfig}
	 */
	function flip(node, { from, to }, params = {}) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;
		const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
		const dx = from.left + (from.width * ox) / to.width - (to.left + ox);
		const dy = from.top + (from.height * oy) / to.height - (to.top + oy);
		const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
		return {
			delay,
			duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
			easing,
			css: (t, u) => {
				const x = u * dx;
				const y = u * dy;
				const sx = t + (u * from.width) / to.width;
				const sy = t + (u * from.height) / to.height;
				return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
			}
		};
	}

	const subscriber_queue = [];

	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 *
	 * https://svelte.dev/docs/svelte-store#writable
	 * @template T
	 * @param {T} [value] initial value
	 * @param {import('./public.js').StartStopNotifier<T>} [start]
	 * @returns {import('./public.js').Writable<T>}
	 */
	function writable(value, start = noop) {
		/** @type {import('./public.js').Unsubscriber} */
		let stop;
		/** @type {Set<import('./private.js').SubscribeInvalidateTuple<T>>} */
		const subscribers = new Set();
		/** @param {T} new_value
		 * @returns {void}
		 */
		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (stop) {
					// store is ready
					const run_queue = !subscriber_queue.length;
					for (const subscriber of subscribers) {
						subscriber[1]();
						subscriber_queue.push(subscriber, value);
					}
					if (run_queue) {
						for (let i = 0; i < subscriber_queue.length; i += 2) {
							subscriber_queue[i][0](subscriber_queue[i + 1]);
						}
						subscriber_queue.length = 0;
					}
				}
			}
		}

		/**
		 * @param {import('./public.js').Updater<T>} fn
		 * @returns {void}
		 */
		function update(fn) {
			set(fn(value));
		}

		/**
		 * @param {import('./public.js').Subscriber<T>} run
		 * @param {import('./private.js').Invalidator<T>} [invalidate]
		 * @returns {import('./public.js').Unsubscriber}
		 */
		function subscribe(run, invalidate = noop) {
			/** @type {import('./private.js').SubscribeInvalidateTuple<T>} */
			const subscriber = [run, invalidate];
			subscribers.add(subscriber);
			if (subscribers.size === 1) {
				stop = start(set, update) || noop;
			}
			run(value);
			return () => {
				subscribers.delete(subscriber);
				if (subscribers.size === 0 && stop) {
					stop();
					stop = null;
				}
			};
		}
		return { set, update, subscribe };
	}

	const PollStore = writable([
	    {
	        id: 1,
	        question: "Python or JavaScript?",
	        answerA: "Python",
	        answerB: "JavaScript",
	        votesA: 9,
	        votesB: 15,
	    },
	]);

	/* src\shared\Card.svelte generated by Svelte v4.2.19 */
	const file$6 = "src\\shared\\Card.svelte";

	function create_fragment$6(ctx) {
		let div;
		let current;
		const default_slot_template = /*#slots*/ ctx[1].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

		const block = {
			c: function create() {
				div = element("div");
				if (default_slot) default_slot.c();
				attr_dev(div, "class", "card svelte-541zoi");
				add_location(div, file$6, 0, 0, 0);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				if (default_slot) {
					default_slot.m(div, null);
				}

				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[0],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
							null
						);
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				if (default_slot) default_slot.d(detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$6.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$6($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Card', slots, ['default']);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
		};

		return [$$scope, slots];
	}

	class Card extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Card",
				options,
				id: create_fragment$6.name
			});
		}
	}

	/* src\shared\Button.svelte generated by Svelte v4.2.19 */
	const file$5 = "src\\shared\\Button.svelte";

	function create_fragment$5(ctx) {
		let button;
		let button_class_value;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[4].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

		const block = {
			c: function create() {
				button = element("button");
				if (default_slot) default_slot.c();
				attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-1dfxs6g"));
				toggle_class(button, "flat", /*flat*/ ctx[1]);
				toggle_class(button, "inverse", /*inverse*/ ctx[2]);
				add_location(button, file$5, 6, 0, 120);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, button, anchor);

				if (default_slot) {
					default_slot.m(button, null);
				}

				current = true;

				if (!mounted) {
					dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[3],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
							null
						);
					}
				}

				if (!current || dirty & /*type*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-1dfxs6g"))) {
					attr_dev(button, "class", button_class_value);
				}

				if (!current || dirty & /*type, flat*/ 3) {
					toggle_class(button, "flat", /*flat*/ ctx[1]);
				}

				if (!current || dirty & /*type, inverse*/ 5) {
					toggle_class(button, "inverse", /*inverse*/ ctx[2]);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(default_slot, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(default_slot, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(button);
				}

				if (default_slot) default_slot.d(detaching);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$5.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$5($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Button', slots, ['default']);
		let { type = "primary" } = $$props;
		let { flat = false } = $$props;
		let { inverse = false } = $$props;
		const writable_props = ['type', 'flat', 'inverse'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
		});

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$props => {
			if ('type' in $$props) $$invalidate(0, type = $$props.type);
			if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
			if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
			if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
		};

		$$self.$capture_state = () => ({ type, flat, inverse });

		$$self.$inject_state = $$props => {
			if ('type' in $$props) $$invalidate(0, type = $$props.type);
			if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
			if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [type, flat, inverse, $$scope, slots, click_handler];
	}

	class Button extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$5, safe_not_equal, { type: 0, flat: 1, inverse: 2 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Button",
				options,
				id: create_fragment$5.name
			});
		}

		get type() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set type(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get flat() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set flat(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get inverse() {
			throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set inverse(value) {
			throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/**
	 * @param {any} obj
	 * @returns {boolean}
	 */
	function is_date(obj) {
		return Object.prototype.toString.call(obj) === '[object Date]';
	}

	/** @returns {(t: any) => any} */
	function get_interpolator(a, b) {
		if (a === b || a !== a) return () => a;
		const type = typeof a;
		if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
			throw new Error('Cannot interpolate values of different type');
		}
		if (Array.isArray(a)) {
			const arr = b.map((bi, i) => {
				return get_interpolator(a[i], bi);
			});
			return (t) => arr.map((fn) => fn(t));
		}
		if (type === 'object') {
			if (!a || !b) throw new Error('Object cannot be null');
			if (is_date(a) && is_date(b)) {
				a = a.getTime();
				b = b.getTime();
				const delta = b - a;
				return (t) => new Date(a + t * delta);
			}
			const keys = Object.keys(b);
			const interpolators = {};
			keys.forEach((key) => {
				interpolators[key] = get_interpolator(a[key], b[key]);
			});
			return (t) => {
				const result = {};
				keys.forEach((key) => {
					result[key] = interpolators[key](t);
				});
				return result;
			};
		}
		if (type === 'number') {
			const delta = b - a;
			return (t) => a + t * delta;
		}
		throw new Error(`Cannot interpolate ${type} values`);
	}

	/**
	 * A tweened store in Svelte is a special type of store that provides smooth transitions between state values over time.
	 *
	 * https://svelte.dev/docs/svelte-motion#tweened
	 * @template T
	 * @param {T} [value]
	 * @param {import('./private.js').TweenedOptions<T>} [defaults]
	 * @returns {import('./public.js').Tweened<T>}
	 */
	function tweened(value, defaults = {}) {
		const store = writable(value);
		/** @type {import('../internal/private.js').Task} */
		let task;
		let target_value = value;
		/**
		 * @param {T} new_value
		 * @param {import('./private.js').TweenedOptions<T>} [opts]
		 */
		function set(new_value, opts) {
			if (value == null) {
				store.set((value = new_value));
				return Promise.resolve();
			}
			target_value = new_value;
			let previous_task = task;
			let started = false;
			let {
				delay = 0,
				duration = 400,
				easing = identity,
				interpolate = get_interpolator
			} = assign(assign({}, defaults), opts);
			if (duration === 0) {
				if (previous_task) {
					previous_task.abort();
					previous_task = null;
				}
				store.set((value = target_value));
				return Promise.resolve();
			}
			const start = now() + delay;
			let fn;
			task = loop((now) => {
				if (now < start) return true;
				if (!started) {
					fn = interpolate(value, new_value);
					if (typeof duration === 'function') duration = duration(value, new_value);
					started = true;
				}
				if (previous_task) {
					previous_task.abort();
					previous_task = null;
				}
				const elapsed = now - start;
				if (elapsed > /** @type {number} */ (duration)) {
					store.set((value = new_value));
					return false;
				}
				// @ts-ignore
				store.set((value = fn(easing(elapsed / duration))));
				return true;
			});
			return task.promise;
		}
		return {
			set,
			update: (fn, opts) => set(fn(target_value, value), opts),
			subscribe: store.subscribe
		};
	}

	/* src\components\PollDetails.svelte generated by Svelte v4.2.19 */

	const { console: console_1$2 } = globals;
	const file$4 = "src\\components\\PollDetails.svelte";

	// (75:12) <Button flat={true} on:click={() => handleDelete(poll.id)}                  >
	function create_default_slot_1(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text("Delete");
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot_1.name,
			type: "slot",
			source: "(75:12) <Button flat={true} on:click={() => handleDelete(poll.id)}                  >",
			ctx
		});

		return block;
	}

	// (54:0) <Card>
	function create_default_slot$1(ctx) {
		let div3;
		let h3;
		let t0_value = /*poll*/ ctx[0].question + "";
		let t0;
		let t1;
		let p;
		let t2;
		let t3;
		let t4;
		let button0;
		let div0;
		let t5;
		let span0;
		let t6_value = /*poll*/ ctx[0].answerA + "";
		let t6;
		let t7;
		let t8_value = /*poll*/ ctx[0].votesA + "";
		let t8;
		let t9;
		let t10;
		let br;
		let t11;
		let button1;
		let div1;
		let t12;
		let span1;
		let t13_value = /*poll*/ ctx[0].answerB + "";
		let t13;
		let t14;
		let t15_value = /*poll*/ ctx[0].votesB + "";
		let t15;
		let t16;
		let t17;
		let div2;
		let button2;
		let current;
		let mounted;
		let dispose;

		button2 = new Button({
				props: {
					flat: true,
					$$slots: { default: [create_default_slot_1] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		button2.$on("click", /*click_handler_2*/ ctx[12]);

		const block = {
			c: function create() {
				div3 = element("div");
				h3 = element("h3");
				t0 = text(t0_value);
				t1 = space();
				p = element("p");
				t2 = text("Total votes: ");
				t3 = text(/*totalVotes*/ ctx[1]);
				t4 = space();
				button0 = element("button");
				div0 = element("div");
				t5 = space();
				span0 = element("span");
				t6 = text(t6_value);
				t7 = text(" (");
				t8 = text(t8_value);
				t9 = text(" votes)");
				t10 = space();
				br = element("br");
				t11 = space();
				button1 = element("button");
				div1 = element("div");
				t12 = space();
				span1 = element("span");
				t13 = text(t13_value);
				t14 = text(" (");
				t15 = text(t15_value);
				t16 = text(" votes)");
				t17 = space();
				div2 = element("div");
				create_component(button2.$$.fragment);
				attr_dev(h3, "class", "svelte-1h2wcy8");
				add_location(h3, file$4, 55, 8, 1819);
				attr_dev(p, "class", "svelte-1h2wcy8");
				add_location(p, file$4, 56, 8, 1853);
				attr_dev(div0, "class", "percent percent-a svelte-1h2wcy8");
				set_style(div0, "width", /*$tweenedA*/ ctx[3] + "%");
				add_location(div0, file$4, 62, 12, 2037);
				attr_dev(span0, "class", "svelte-1h2wcy8");
				add_location(span0, file$4, 63, 12, 2116);
				attr_dev(button0, "type", "button");
				attr_dev(button0, "class", "answer svelte-1h2wcy8");
				add_location(button0, file$4, 57, 8, 1895);
				add_location(br, file$4, 64, 17, 2184);
				attr_dev(div1, "class", "percent percent-b svelte-1h2wcy8");
				set_style(div1, "width", /*$tweenedB*/ ctx[2] + "%");
				add_location(div1, file$4, 70, 12, 2342);
				attr_dev(span1, "class", "svelte-1h2wcy8");
				add_location(span1, file$4, 71, 12, 2421);
				attr_dev(button1, "type", "button");
				attr_dev(button1, "class", "answer svelte-1h2wcy8");
				add_location(button1, file$4, 65, 8, 2200);
				attr_dev(div2, "class", "delete svelte-1h2wcy8");
				add_location(div2, file$4, 73, 8, 2499);
				attr_dev(div3, "class", "poll");
				add_location(div3, file$4, 54, 4, 1791);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div3, anchor);
				append_dev(div3, h3);
				append_dev(h3, t0);
				append_dev(div3, t1);
				append_dev(div3, p);
				append_dev(p, t2);
				append_dev(p, t3);
				append_dev(div3, t4);
				append_dev(div3, button0);
				append_dev(button0, div0);
				append_dev(button0, t5);
				append_dev(button0, span0);
				append_dev(span0, t6);
				append_dev(span0, t7);
				append_dev(span0, t8);
				append_dev(span0, t9);
				append_dev(button0, t10);
				append_dev(div3, br);
				append_dev(div3, t11);
				append_dev(div3, button1);
				append_dev(button1, div1);
				append_dev(button1, t12);
				append_dev(button1, span1);
				append_dev(span1, t13);
				append_dev(span1, t14);
				append_dev(span1, t15);
				append_dev(span1, t16);
				append_dev(div3, t17);
				append_dev(div3, div2);
				mount_component(button2, div2, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false, false),
						listen_dev(button1, "click", /*click_handler_1*/ ctx[11], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if ((!current || dirty & /*poll*/ 1) && t0_value !== (t0_value = /*poll*/ ctx[0].question + "")) set_data_dev(t0, t0_value);
				if (!current || dirty & /*totalVotes*/ 2) set_data_dev(t3, /*totalVotes*/ ctx[1]);

				if (!current || dirty & /*$tweenedA*/ 8) {
					set_style(div0, "width", /*$tweenedA*/ ctx[3] + "%");
				}

				if ((!current || dirty & /*poll*/ 1) && t6_value !== (t6_value = /*poll*/ ctx[0].answerA + "")) set_data_dev(t6, t6_value);
				if ((!current || dirty & /*poll*/ 1) && t8_value !== (t8_value = /*poll*/ ctx[0].votesA + "")) set_data_dev(t8, t8_value);

				if (!current || dirty & /*$tweenedB*/ 4) {
					set_style(div1, "width", /*$tweenedB*/ ctx[2] + "%");
				}

				if ((!current || dirty & /*poll*/ 1) && t13_value !== (t13_value = /*poll*/ ctx[0].answerB + "")) set_data_dev(t13, t13_value);
				if ((!current || dirty & /*poll*/ 1) && t15_value !== (t15_value = /*poll*/ ctx[0].votesB + "")) set_data_dev(t15, t15_value);
				const button2_changes = {};

				if (dirty & /*$$scope*/ 8192) {
					button2_changes.$$scope = { dirty, ctx };
				}

				button2.$set(button2_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(button2.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(button2.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div3);
				}

				destroy_component(button2);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot$1.name,
			type: "slot",
			source: "(54:0) <Card>",
			ctx
		});

		return block;
	}

	function create_fragment$4(ctx) {
		let card;
		let current;

		card = new Card({
				props: {
					$$slots: { default: [create_default_slot$1] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				create_component(card.$$.fragment);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(card, target, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const card_changes = {};

				if (dirty & /*$$scope, poll, $tweenedB, $tweenedA, totalVotes*/ 8207) {
					card_changes.$$scope = { dirty, ctx };
				}

				card.$set(card_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(card.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(card.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(card, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$4.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$4($$self, $$props, $$invalidate) {
		let totalVotes;
		let percentA;
		let percentB;
		let $tweenedB;
		let $tweenedA;
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('PollDetails', slots, []);
		let { poll } = $$props;

		// tweened percentages
		const tweenedA = tweened(0, { duration: 500 });

		validate_store(tweenedA, 'tweenedA');
		component_subscribe($$self, tweenedA, value => $$invalidate(3, $tweenedA = value));
		const tweenedB = tweened(0, { duration: 500 });
		validate_store(tweenedB, 'tweenedB');
		component_subscribe($$self, tweenedB, value => $$invalidate(2, $tweenedB = value));
		console.log($tweenedA, $tweenedB);

		// handling votes
		const handleVote = (option, id) => {
			// dispatch("vote", { option, id });
			// const { option, id } = e.detail;
			PollStore.update(currentPolls => {
				let copiedPolls = [...currentPolls];
				let upvotedPoll = copiedPolls.find(poll => poll.id == id);

				if (option === "a") {
					upvotedPoll.votesA++;
				} else {
					upvotedPoll.votesB++;
				}

				// simplified
				// upvotedPoll.votesA = option === "a" ? upvotedPoll.votesA++;
				// upvotedPoll.votesB = option === "b" ? upvotedPoll.votesB++;
				// polls = copiedPolls; * we don't need this anymore
				return copiedPolls;
			});
		};

		// handling delete
		const handleDelete = id => {
			PollStore.update(currentPolls => {
				return currentPolls.filter(poll => poll.id != id);
			});
		};

		$$self.$$.on_mount.push(function () {
			if (poll === undefined && !('poll' in $$props || $$self.$$.bound[$$self.$$.props['poll']])) {
				console_1$2.warn("<PollDetails> was created without expected prop 'poll'");
			}
		});

		const writable_props = ['poll'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<PollDetails> was created with unknown prop '${key}'`);
		});

		const click_handler = () => handleVote("a", poll.id);
		const click_handler_1 = () => handleVote("b", poll.id);
		const click_handler_2 = () => handleDelete(poll.id);

		$$self.$$set = $$props => {
			if ('poll' in $$props) $$invalidate(0, poll = $$props.poll);
		};

		$$self.$capture_state = () => ({
			Card,
			PollStore,
			Button,
			tweened,
			poll,
			tweenedA,
			tweenedB,
			handleVote,
			handleDelete,
			percentB,
			percentA,
			totalVotes,
			$tweenedB,
			$tweenedA
		});

		$$self.$inject_state = $$props => {
			if ('poll' in $$props) $$invalidate(0, poll = $$props.poll);
			if ('percentB' in $$props) $$invalidate(8, percentB = $$props.percentB);
			if ('percentA' in $$props) $$invalidate(9, percentA = $$props.percentA);
			if ('totalVotes' in $$props) $$invalidate(1, totalVotes = $$props.totalVotes);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*poll*/ 1) {
				// const dispatch = createEventDispatcher();
				// reactive values
				$$invalidate(1, totalVotes = poll.votesA + poll.votesB);
			}

			if ($$self.$$.dirty & /*totalVotes, poll*/ 3) {
				$$invalidate(9, percentA = Math.floor(100 / totalVotes * poll.votesA) || 0);
			}

			if ($$self.$$.dirty & /*totalVotes, poll*/ 3) {
				$$invalidate(8, percentB = Math.floor(100 / totalVotes * poll.votesB) || 0);
			}

			if ($$self.$$.dirty & /*percentA*/ 512) {
				tweenedA.set(percentA);
			}

			if ($$self.$$.dirty & /*percentB*/ 256) {
				tweenedB.set(percentB);
			}
		};

		return [
			poll,
			totalVotes,
			$tweenedB,
			$tweenedA,
			tweenedA,
			tweenedB,
			handleVote,
			handleDelete,
			percentB,
			percentA,
			click_handler,
			click_handler_1,
			click_handler_2
		];
	}

	class PollDetails extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$4, safe_not_equal, { poll: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "PollDetails",
				options,
				id: create_fragment$4.name
			});
		}

		get poll() {
			throw new Error("<PollDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set poll(value) {
			throw new Error("<PollDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\components\PollList.svelte generated by Svelte v4.2.19 */
	const file$3 = "src\\components\\PollList.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[1] = list[i];
		return child_ctx;
	}

	// (28:4) {#each $PollStore as poll (poll.id)}
	function create_each_block(key_1, ctx) {
		let div;
		let polldetails;
		let t;
		let div_intro;
		let div_outro;
		let rect;
		let stop_animation = noop;
		let current;

		polldetails = new PollDetails({
				props: { poll: /*poll*/ ctx[1] },
				$$inline: true
			});

		const block = {
			key: key_1,
			first: null,
			c: function create() {
				div = element("div");
				create_component(polldetails.$$.fragment);
				t = space();
				add_location(div, file$3, 28, 8, 814);
				this.first = div;
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(polldetails, div, null);
				append_dev(div, t);
				current = true;
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				const polldetails_changes = {};
				if (dirty & /*$PollStore*/ 1) polldetails_changes.poll = /*poll*/ ctx[1];
				polldetails.$set(polldetails_changes);
			},
			r: function measure() {
				rect = div.getBoundingClientRect();
			},
			f: function fix() {
				fix_position(div);
				stop_animation();
				add_transform(div, rect);
			},
			a: function animate() {
				stop_animation();
				stop_animation = create_animation(div, rect, flip, { duration: 500 });
			},
			i: function intro(local) {
				if (current) return;
				transition_in(polldetails.$$.fragment, local);

				if (local) {
					add_render_callback(() => {
						if (!current) return;
						if (div_outro) div_outro.end(1);
						div_intro = create_in_transition(div, fade, {});
						div_intro.start();
					});
				}

				current = true;
			},
			o: function outro(local) {
				transition_out(polldetails.$$.fragment, local);
				if (div_intro) div_intro.invalidate();

				if (local) {
					div_outro = create_out_transition(div, scale, {});
				}

				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(polldetails);
				if (detaching && div_outro) div_outro.end();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(28:4) {#each $PollStore as poll (poll.id)}",
			ctx
		});

		return block;
	}

	function create_fragment$3(ctx) {
		let div;
		let each_blocks = [];
		let each_1_lookup = new Map();
		let current;
		let each_value = ensure_array_like_dev(/*$PollStore*/ ctx[0]);
		const get_key = ctx => /*poll*/ ctx[1].id;
		validate_each_keys(ctx, each_value, get_each_context, get_key);

		for (let i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
		}

		const block = {
			c: function create() {
				div = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr_dev(div, "class", "poll-list svelte-31vrvu");
				add_location(div, file$3, 26, 0, 739);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div, null);
					}
				}

				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*$PollStore*/ 1) {
					each_value = ensure_array_like_dev(/*$PollStore*/ ctx[0]);
					group_outros();
					for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
					validate_each_keys(ctx, each_value, get_each_context, get_key);
					each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, fix_and_outro_and_destroy_block, create_each_block, null, get_each_context);
					for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o: function outro(local) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].d();
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$3.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$3($$self, $$props, $$invalidate) {
		let $PollStore;
		validate_store(PollStore, 'PollStore');
		component_subscribe($$self, PollStore, $$value => $$invalidate(0, $PollStore = $$value));
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('PollList', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PollList> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({
			fade,
			scale,
			flip,
			PollStore,
			PollDetails,
			$PollStore
		});

		return [$PollStore];
	}

	class PollList extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "PollList",
				options,
				id: create_fragment$3.name
			});
		}
	}

	/* src\components\CreatePollForm.svelte generated by Svelte v4.2.19 */

	const { console: console_1$1 } = globals;
	const file$2 = "src\\components\\CreatePollForm.svelte";

	// (86:4) <Button type="secondary" flat={true} inverse={false}>
	function create_default_slot(ctx) {
		let t;

		const block = {
			c: function create() {
				t = text("Add Poll");
			},
			m: function mount(target, anchor) {
				insert_dev(target, t, anchor);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot.name,
			type: "slot",
			source: "(86:4) <Button type=\\\"secondary\\\" flat={true} inverse={false}>",
			ctx
		});

		return block;
	}

	function create_fragment$2(ctx) {
		let form;
		let div1;
		let label0;
		let t1;
		let input0;
		let t2;
		let div0;
		let t3_value = /*errors*/ ctx[1].question + "";
		let t3;
		let t4;
		let div3;
		let label1;
		let t6;
		let input1;
		let t7;
		let div2;
		let t8_value = /*errors*/ ctx[1].answerA + "";
		let t8;
		let t9;
		let div5;
		let label2;
		let t11;
		let input2;
		let t12;
		let div4;
		let t13_value = /*errors*/ ctx[1].answerB + "";
		let t13;
		let t14;
		let button;
		let current;
		let mounted;
		let dispose;

		button = new Button({
				props: {
					type: "secondary",
					flat: true,
					inverse: false,
					$$slots: { default: [create_default_slot] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		const block = {
			c: function create() {
				form = element("form");
				div1 = element("div");
				label0 = element("label");
				label0.textContent = "Poll Question:-";
				t1 = space();
				input0 = element("input");
				t2 = space();
				div0 = element("div");
				t3 = text(t3_value);
				t4 = space();
				div3 = element("div");
				label1 = element("label");
				label1.textContent = "Answer A:";
				t6 = space();
				input1 = element("input");
				t7 = space();
				div2 = element("div");
				t8 = text(t8_value);
				t9 = space();
				div5 = element("div");
				label2 = element("label");
				label2.textContent = "Answer B:";
				t11 = space();
				input2 = element("input");
				t12 = space();
				div4 = element("div");
				t13 = text(t13_value);
				t14 = space();
				create_component(button.$$.fragment);
				attr_dev(label0, "for", "question");
				attr_dev(label0, "class", "svelte-1qc7v4e");
				add_location(label0, file$2, 56, 8, 1667);
				attr_dev(input0, "type", "text");
				attr_dev(input0, "name", "question");
				attr_dev(input0, "id", "question");
				attr_dev(input0, "class", "svelte-1qc7v4e");
				add_location(input0, file$2, 57, 8, 1722);
				attr_dev(div0, "class", "error svelte-1qc7v4e");
				add_location(div0, file$2, 63, 8, 1873);
				attr_dev(div1, "class", "form-field svelte-1qc7v4e");
				add_location(div1, file$2, 55, 4, 1633);
				attr_dev(label1, "for", "answerA");
				attr_dev(label1, "class", "svelte-1qc7v4e");
				add_location(label1, file$2, 66, 8, 1967);
				attr_dev(input1, "type", "text");
				attr_dev(input1, "name", "answerA");
				attr_dev(input1, "id", "answerA");
				attr_dev(input1, "class", "svelte-1qc7v4e");
				add_location(input1, file$2, 67, 8, 2015);
				attr_dev(div2, "class", "error svelte-1qc7v4e");
				add_location(div2, file$2, 73, 8, 2163);
				attr_dev(div3, "class", "form-field svelte-1qc7v4e");
				add_location(div3, file$2, 65, 4, 1933);
				attr_dev(label2, "for", "answerB");
				attr_dev(label2, "class", "svelte-1qc7v4e");
				add_location(label2, file$2, 76, 8, 2256);
				attr_dev(input2, "type", "text");
				attr_dev(input2, "name", "answerB");
				attr_dev(input2, "id", "answerB");
				attr_dev(input2, "class", "svelte-1qc7v4e");
				add_location(input2, file$2, 77, 8, 2304);
				attr_dev(div4, "class", "error svelte-1qc7v4e");
				add_location(div4, file$2, 83, 8, 2452);
				attr_dev(div5, "class", "form-field svelte-1qc7v4e");
				add_location(div5, file$2, 75, 4, 2222);
				attr_dev(form, "class", "svelte-1qc7v4e");
				add_location(form, file$2, 54, 0, 1580);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, form, anchor);
				append_dev(form, div1);
				append_dev(div1, label0);
				append_dev(div1, t1);
				append_dev(div1, input0);
				set_input_value(input0, /*fields*/ ctx[0].question);
				append_dev(div1, t2);
				append_dev(div1, div0);
				append_dev(div0, t3);
				append_dev(form, t4);
				append_dev(form, div3);
				append_dev(div3, label1);
				append_dev(div3, t6);
				append_dev(div3, input1);
				set_input_value(input1, /*fields*/ ctx[0].answerA);
				append_dev(div3, t7);
				append_dev(div3, div2);
				append_dev(div2, t8);
				append_dev(form, t9);
				append_dev(form, div5);
				append_dev(div5, label2);
				append_dev(div5, t11);
				append_dev(div5, input2);
				set_input_value(input2, /*fields*/ ctx[0].answerB);
				append_dev(div5, t12);
				append_dev(div5, div4);
				append_dev(div4, t13);
				append_dev(form, t14);
				mount_component(button, form, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
						listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
						listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
						listen_dev(form, "submit", prevent_default(/*submitHandler*/ ctx[2]), false, true, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*fields*/ 1 && input0.value !== /*fields*/ ctx[0].question) {
					set_input_value(input0, /*fields*/ ctx[0].question);
				}

				if ((!current || dirty & /*errors*/ 2) && t3_value !== (t3_value = /*errors*/ ctx[1].question + "")) set_data_dev(t3, t3_value);

				if (dirty & /*fields*/ 1 && input1.value !== /*fields*/ ctx[0].answerA) {
					set_input_value(input1, /*fields*/ ctx[0].answerA);
				}

				if ((!current || dirty & /*errors*/ 2) && t8_value !== (t8_value = /*errors*/ ctx[1].answerA + "")) set_data_dev(t8, t8_value);

				if (dirty & /*fields*/ 1 && input2.value !== /*fields*/ ctx[0].answerB) {
					set_input_value(input2, /*fields*/ ctx[0].answerB);
				}

				if ((!current || dirty & /*errors*/ 2) && t13_value !== (t13_value = /*errors*/ ctx[1].answerB + "")) set_data_dev(t13, t13_value);
				const button_changes = {};

				if (dirty & /*$$scope*/ 256) {
					button_changes.$$scope = { dirty, ctx };
				}

				button.$set(button_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(button.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(button.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(form);
				}

				destroy_component(button);
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$2.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('CreatePollForm', slots, []);
		let dispatch = createEventDispatcher();
		let fields = { question: "", answerA: "", answerB: "" };
		let errors = { question: "", answerA: "", answerB: "" };
		let valid = false;

		const submitHandler = () => {
			valid = true;

			// validate question
			if (fields.question.trim().length < 5) {
				valid = false;
				$$invalidate(1, errors.question = "Question must be at least 5 characters long.", errors);
			} else {
				$$invalidate(1, errors.question = "", errors);
			}

			// validate answer A
			if (fields.question.trim().length < 1) {
				valid = false;
				$$invalidate(1, errors.answerA = "Answer A cannot be empty", errors);
			} else {
				$$invalidate(1, errors.answerA = "", errors);
			}

			// validate answer B
			if (fields.question.trim().length < 1) {
				valid = false;
				$$invalidate(1, errors.answerB = "Answer B cannot be empty", errors);
			} else {
				$$invalidate(1, errors.answerB = "", errors);
			}

			// add new poll
			if (valid) {
				let poll = {
					...fields,
					id: Math.random(),
					votesA: 0,
					votesB: 0
				};

				// save poll to store
				PollStore.update(currentPolls => {
					return [poll, ...currentPolls];
				});

				dispatch("add");
				console.log("valid", fields);
			}
		};

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<CreatePollForm> was created with unknown prop '${key}'`);
		});

		function input0_input_handler() {
			fields.question = this.value;
			$$invalidate(0, fields);
		}

		function input1_input_handler() {
			fields.answerA = this.value;
			$$invalidate(0, fields);
		}

		function input2_input_handler() {
			fields.answerB = this.value;
			$$invalidate(0, fields);
		}

		$$self.$capture_state = () => ({
			PollStore,
			createEventDispatcher,
			Button,
			dispatch,
			fields,
			errors,
			valid,
			submitHandler
		});

		$$self.$inject_state = $$props => {
			if ('dispatch' in $$props) dispatch = $$props.dispatch;
			if ('fields' in $$props) $$invalidate(0, fields = $$props.fields);
			if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
			if ('valid' in $$props) valid = $$props.valid;
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			fields,
			errors,
			submitHandler,
			input0_input_handler,
			input1_input_handler,
			input2_input_handler
		];
	}

	class CreatePollForm extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "CreatePollForm",
				options,
				id: create_fragment$2.name
			});
		}
	}

	/* src\components\Footer.svelte generated by Svelte v4.2.19 */
	const file$1 = "src\\components\\Footer.svelte";

	function create_fragment$1(ctx) {
		let footer;
		let div;

		const block = {
			c: function create() {
				footer = element("footer");
				div = element("div");
				div.textContent = "Copyright 2020-2024 (c) Syafiq Hadzir @ Poll Ninja";
				attr_dev(div, "class", "copyright svelte-1ioxxtp");
				add_location(div, file$1, 1, 4, 14);
				attr_dev(footer, "class", "svelte-1ioxxtp");
				add_location(footer, file$1, 0, 0, 0);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, footer, anchor);
				append_dev(footer, div);
			},
			p: noop,
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(footer);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$1.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$1($$self, $$props) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Footer', slots, []);
		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
		});

		return [];
	}

	class Footer extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Footer",
				options,
				id: create_fragment$1.name
			});
		}
	}

	/* src\App.svelte generated by Svelte v4.2.19 */

	const { console: console_1 } = globals;
	const file = "src\\App.svelte";

	// (28:37) 
	function create_if_block_1(ctx) {
		let createpollform;
		let current;
		createpollform = new CreatePollForm({ $$inline: true });
		createpollform.$on("add", /*handleAdd*/ ctx[3]);

		const block = {
			c: function create() {
				create_component(createpollform.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(createpollform, target, anchor);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(createpollform.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(createpollform.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(createpollform, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block_1.name,
			type: "if",
			source: "(28:37) ",
			ctx
		});

		return block;
	}

	// (26:1) {#if activeItem === "Current Polls"}
	function create_if_block(ctx) {
		let polllist;
		let current;
		polllist = new PollList({ $$inline: true });

		const block = {
			c: function create() {
				create_component(polllist.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(polllist, target, anchor);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(polllist.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(polllist.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(polllist, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block.name,
			type: "if",
			source: "(26:1) {#if activeItem === \\\"Current Polls\\\"}",
			ctx
		});

		return block;
	}

	function create_fragment(ctx) {
		let header;
		let t0;
		let main;
		let tabs;
		let t1;
		let current_block_type_index;
		let if_block;
		let t2;
		let footer;
		let current;
		header = new Header({ $$inline: true });

		tabs = new Tabs({
				props: {
					activeItem: /*activeItem*/ ctx[0],
					items: /*items*/ ctx[1]
				},
				$$inline: true
			});

		tabs.$on("tabChange", /*tabChange*/ ctx[2]);
		const if_block_creators = [create_if_block, create_if_block_1];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*activeItem*/ ctx[0] === "Current Polls") return 0;
			if (/*activeItem*/ ctx[0] === "Add Poll") return 1;
			return -1;
		}

		if (~(current_block_type_index = select_block_type(ctx))) {
			if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
		}

		footer = new Footer({ $$inline: true });

		const block = {
			c: function create() {
				create_component(header.$$.fragment);
				t0 = space();
				main = element("main");
				create_component(tabs.$$.fragment);
				t1 = space();
				if (if_block) if_block.c();
				t2 = space();
				create_component(footer.$$.fragment);
				attr_dev(main, "class", "svelte-1u6u9n4");
				add_location(main, file, 23, 0, 600);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(header, target, anchor);
				insert_dev(target, t0, anchor);
				insert_dev(target, main, anchor);
				mount_component(tabs, main, null);
				append_dev(main, t1);

				if (~current_block_type_index) {
					if_blocks[current_block_type_index].m(main, null);
				}

				insert_dev(target, t2, anchor);
				mount_component(footer, target, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const tabs_changes = {};
				if (dirty & /*activeItem*/ 1) tabs_changes.activeItem = /*activeItem*/ ctx[0];
				tabs.$set(tabs_changes);
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if (~current_block_type_index) {
						if_blocks[current_block_type_index].p(ctx, dirty);
					}
				} else {
					if (if_block) {
						group_outros();

						transition_out(if_blocks[previous_block_index], 1, 1, () => {
							if_blocks[previous_block_index] = null;
						});

						check_outros();
					}

					if (~current_block_type_index) {
						if_block = if_blocks[current_block_type_index];

						if (!if_block) {
							if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
							if_block.c();
						} else {
							if_block.p(ctx, dirty);
						}

						transition_in(if_block, 1);
						if_block.m(main, null);
					} else {
						if_block = null;
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(header.$$.fragment, local);
				transition_in(tabs.$$.fragment, local);
				transition_in(if_block);
				transition_in(footer.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(header.$$.fragment, local);
				transition_out(tabs.$$.fragment, local);
				transition_out(if_block);
				transition_out(footer.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t0);
					detach_dev(main);
					detach_dev(t2);
				}

				destroy_component(header, detaching);
				destroy_component(tabs);

				if (~current_block_type_index) {
					if_blocks[current_block_type_index].d();
				}

				destroy_component(footer, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('App', slots, []);
		let items = ["Current Polls", "Add Poll"];
		let activeItem = "Current Polls";
		const tabChange = e => $$invalidate(0, activeItem = e.detail);

		const handleAdd = e => {
			// const poll = e.detail;
			// polls = [poll, ...polls];
			console.log(e);

			$$invalidate(0, activeItem = "Current Polls");
		};

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({
			Header,
			Tabs,
			PollList,
			CreatePollForm,
			Footer,
			items,
			activeItem,
			tabChange,
			handleAdd
		});

		$$self.$inject_state = $$props => {
			if ('items' in $$props) $$invalidate(1, items = $$props.items);
			if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [activeItem, items, tabChange, handleAdd];
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "App",
				options,
				id: create_fragment.name
			});
		}
	}

	const app = new App({
		target: document.body,
		props: {
			name: 'world'
		}
	});

	return app;

})();
//# sourceMappingURL=bundle.js.map
