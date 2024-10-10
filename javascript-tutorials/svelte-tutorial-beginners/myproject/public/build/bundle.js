
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

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

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
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
	 * @returns {(event: any) => void} */
	function self(fn) {
		return function (event) {
			// @ts-ignore
			if (event.target === this) fn.call(this, event);
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
	 * @returns {unknown[]} */
	function get_binding_group_value(group, __value, checked) {
		const value = new Set();
		for (let i = 0; i < group.length; i += 1) {
			if (group[i].checked) value.add(group[i].__value);
		}
		if (!checked) {
			value.delete(__value);
		}
		return Array.from(value);
	}

	/**
	 * @param {HTMLInputElement[]} group
	 * @returns {{ p(...inputs: HTMLInputElement[]): void; r(): void; }}
	 */
	function init_binding_group(group) {
		/**
		 * @type {HTMLInputElement[]} */
		let _inputs;
		return {
			/* push */ p(...inputs) {
				_inputs = inputs;
				_inputs.forEach((input) => group.push(input));
			},
			/* remove */ r() {
				_inputs.forEach((input) => group.splice(group.indexOf(input), 1));
			}
		};
	}

	/** @returns {number} */
	function to_number(value) {
		return value === '' ? null : +value;
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
	function select_option(select, value, mounting) {
		for (let i = 0; i < select.options.length; i += 1) {
			const option = select.options[i];
			if (option.__value === value) {
				option.selected = true;
				return;
			}
		}
		if (!mounting || value !== undefined) {
			select.selectedIndex = -1; // no option should be selected
		}
	}

	function select_value(select) {
		const selected_option = select.querySelector(':checked');
		return selected_option && selected_option.__value;
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

	// keyed each functions:

	/** @returns {void} */
	function destroy_block(block, lookup) {
		block.d(1);
		lookup.delete(block.key);
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

	/* src\Modal.svelte generated by Svelte v4.2.19 */
	const file$2 = "src\\Modal.svelte";

	// (11:0) {#if showModal}
	function create_if_block$1(ctx) {
		let div1;
		let div0;
		let p;
		let t1;
		let t2;
		let button;
		let current;
		let mounted;
		let dispose;
		const default_slot_template = /*#slots*/ ctx[3].default;
		const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

		const block = {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				p = element("p");
				p.textContent = "Hey there ...";
				t1 = space();
				if (default_slot) default_slot.c();
				t2 = space();
				button = element("button");
				button.textContent = "Close";
				add_location(p, file$2, 14, 12, 509);
				attr_dev(button, "type", "button");
				add_location(button, file$2, 17, 12, 619);
				attr_dev(div0, "class", "modal svelte-14supvx");
				add_location(div0, file$2, 12, 8, 437);
				attr_dev(div1, "class", "backdrop svelte-14supvx");
				toggle_class(div1, "promo", /*isPromo*/ ctx[1]);
				add_location(div1, file$2, 11, 4, 383);
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, p);
				append_dev(div0, t1);

				if (default_slot) {
					default_slot.m(div0, null);
				}

				append_dev(div0, t2);
				append_dev(div0, button);
				current = true;

				if (!mounted) {
					dispose = listen_dev(button, "click", self(/*click_handler*/ ctx[4]), false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				if (default_slot) {
					if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
						update_slot_base(
							default_slot,
							default_slot_template,
							ctx,
							/*$$scope*/ ctx[2],
							!current
							? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
							: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
							null
						);
					}
				}

				if (!current || dirty & /*isPromo*/ 2) {
					toggle_class(div1, "promo", /*isPromo*/ ctx[1]);
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
					detach_dev(div1);
				}

				if (default_slot) default_slot.d(detaching);
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block$1.name,
			type: "if",
			source: "(11:0) {#if showModal}",
			ctx
		});

		return block;
	}

	function create_fragment$2(ctx) {
		let t;
		let main;
		let current;
		let if_block = /*showModal*/ ctx[0] && create_if_block$1(ctx);

		const block = {
			c: function create() {
				if (if_block) if_block.c();
				t = space();
				main = element("main");
				add_location(main, file$2, 22, 0, 708);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert_dev(target, t, anchor);
				insert_dev(target, main, anchor);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				if (/*showModal*/ ctx[0]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*showModal*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$1(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(t.parentNode, t);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o: function outro(local) {
				transition_out(if_block);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t);
					detach_dev(main);
				}

				if (if_block) if_block.d(detaching);
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
		validate_slots('Modal', slots, ['default']);
		let { showModal = false } = $$props;
		let { isPromo = false } = $$props;
		const writable_props = ['showModal', 'isPromo'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
		});

		function click_handler(event) {
			bubble.call(this, $$self, event);
		}

		$$self.$$set = $$props => {
			if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
			if ('isPromo' in $$props) $$invalidate(1, isPromo = $$props.isPromo);
			if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
		};

		$$self.$capture_state = () => ({ showModal, isPromo });

		$$self.$inject_state = $$props => {
			if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
			if ('isPromo' in $$props) $$invalidate(1, isPromo = $$props.isPromo);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [showModal, isPromo, $$scope, slots, click_handler];
	}

	class Modal extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, { showModal: 0, isPromo: 1 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Modal",
				options,
				id: create_fragment$2.name
			});
		}

		get showModal() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set showModal(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get isPromo() {
			throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set isPromo(value) {
			throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\AddPersonForm.svelte generated by Svelte v4.2.19 */
	const file$1 = "src\\AddPersonForm.svelte";

	function create_fragment$1(ctx) {
		let form;
		let input0;
		let t0;
		let input1;
		let t1;
		let label0;
		let t3;
		let input2;
		let t4;
		let br0;
		let t5;
		let input3;
		let t6;
		let br1;
		let t7;
		let input4;
		let t8;
		let br2;
		let t9;
		let label1;
		let t11;
		let select;
		let option0;
		let option1;
		let option2;
		let option3;
		let t16;
		let button;
		let binding_group;
		let mounted;
		let dispose;
		binding_group = init_binding_group(/*$$binding_groups*/ ctx[8][0]);

		const block = {
			c: function create() {
				form = element("form");
				input0 = element("input");
				t0 = space();
				input1 = element("input");
				t1 = space();
				label0 = element("label");
				label0.textContent = "Skills:-";
				t3 = space();
				input2 = element("input");
				t4 = text(" Fighting\r\n    ");
				br0 = element("br");
				t5 = space();
				input3 = element("input");
				t6 = text(" Sneaking\r\n    ");
				br1 = element("br");
				t7 = space();
				input4 = element("input");
				t8 = text(" Running\r\n    ");
				br2 = element("br");
				t9 = space();
				label1 = element("label");
				label1.textContent = "Belt Colour:-";
				t11 = space();
				select = element("select");
				option0 = element("option");
				option0.textContent = "Black";
				option1 = element("option");
				option1.textContent = "Orange";
				option2 = element("option");
				option2.textContent = "Brown";
				option3 = element("option");
				option3.textContent = "White";
				t16 = space();
				button = element("button");
				button.textContent = "Add Person";
				attr_dev(input0, "type", "text");
				attr_dev(input0, "placeholder", "Name");
				add_location(input0, file$1, 27, 4, 631);
				attr_dev(input1, "type", "number");
				attr_dev(input1, "placeholder", "Age");
				add_location(input1, file$1, 28, 4, 695);
				attr_dev(label0, "for", "skills");
				add_location(label0, file$1, 29, 4, 759);
				attr_dev(input2, "type", "checkbox");
				input2.__value = "fighting";
				set_input_value(input2, input2.__value);
				add_location(input2, file$1, 33, 4, 1018);
				add_location(br0, file$1, 34, 4, 1095);
				attr_dev(input3, "type", "checkbox");
				input3.__value = "sneaking";
				set_input_value(input3, input3.__value);
				add_location(input3, file$1, 35, 4, 1107);
				add_location(br1, file$1, 36, 4, 1184);
				attr_dev(input4, "type", "checkbox");
				input4.__value = "running";
				set_input_value(input4, input4.__value);
				add_location(input4, file$1, 37, 4, 1196);
				add_location(br2, file$1, 38, 4, 1271);
				attr_dev(label1, "for", "beltColour");
				add_location(label1, file$1, 39, 4, 1283);
				option0.__value = "black";
				set_input_value(option0, option0.__value);
				add_location(option0, file$1, 41, 8, 1392);
				option1.__value = "orange";
				set_input_value(option1, option1.__value);
				add_location(option1, file$1, 42, 8, 1438);
				option2.__value = "brown";
				set_input_value(option2, option2.__value);
				add_location(option2, file$1, 43, 8, 1486);
				option3.__value = "white";
				set_input_value(option3, option3.__value);
				add_location(option3, file$1, 44, 8, 1532);
				attr_dev(select, "id", "beltColour");
				if (/*beltColour*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
				add_location(select, file$1, 40, 4, 1334);
				add_location(button, file$1, 46, 4, 1589);
				add_location(form, file$1, 26, 0, 579);
				binding_group.p(input2, input3, input4);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, form, anchor);
				append_dev(form, input0);
				set_input_value(input0, /*name*/ ctx[0]);
				append_dev(form, t0);
				append_dev(form, input1);
				set_input_value(input1, /*age*/ ctx[2]);
				append_dev(form, t1);
				append_dev(form, label0);
				append_dev(form, t3);
				append_dev(form, input2);
				input2.checked = ~(/*skills*/ ctx[3] || []).indexOf(input2.__value);
				append_dev(form, t4);
				append_dev(form, br0);
				append_dev(form, t5);
				append_dev(form, input3);
				input3.checked = ~(/*skills*/ ctx[3] || []).indexOf(input3.__value);
				append_dev(form, t6);
				append_dev(form, br1);
				append_dev(form, t7);
				append_dev(form, input4);
				input4.checked = ~(/*skills*/ ctx[3] || []).indexOf(input4.__value);
				append_dev(form, t8);
				append_dev(form, br2);
				append_dev(form, t9);
				append_dev(form, label1);
				append_dev(form, t11);
				append_dev(form, select);
				append_dev(select, option0);
				append_dev(select, option1);
				append_dev(select, option2);
				append_dev(select, option3);
				select_option(select, /*beltColour*/ ctx[1], true);
				append_dev(form, t16);
				append_dev(form, button);

				if (!mounted) {
					dispose = [
						listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
						listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
						listen_dev(input2, "change", /*input2_change_handler*/ ctx[7]),
						listen_dev(input3, "change", /*input3_change_handler*/ ctx[9]),
						listen_dev(input4, "change", /*input4_change_handler*/ ctx[10]),
						listen_dev(select, "change", /*select_change_handler*/ ctx[11]),
						listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[4]), false, true, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*name*/ 1 && input0.value !== /*name*/ ctx[0]) {
					set_input_value(input0, /*name*/ ctx[0]);
				}

				if (dirty & /*age*/ 4 && to_number(input1.value) !== /*age*/ ctx[2]) {
					set_input_value(input1, /*age*/ ctx[2]);
				}

				if (dirty & /*skills*/ 8) {
					input2.checked = ~(/*skills*/ ctx[3] || []).indexOf(input2.__value);
				}

				if (dirty & /*skills*/ 8) {
					input3.checked = ~(/*skills*/ ctx[3] || []).indexOf(input3.__value);
				}

				if (dirty & /*skills*/ 8) {
					input4.checked = ~(/*skills*/ ctx[3] || []).indexOf(input4.__value);
				}

				if (dirty & /*beltColour*/ 2) {
					select_option(select, /*beltColour*/ ctx[1]);
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(form);
				}

				binding_group.r();
				mounted = false;
				run_all(dispose);
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

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('AddPersonForm', slots, []);
		let dispatch = createEventDispatcher();
		let name;
		let beltColour;
		let age;

		// let fighting = false;
		// let sneaking = false;
		// let running = false;
		let skills = [];

		const handleSubmit = () => {
			// console.log(name, beltColour, age, skills);
			const person = {
				name,
				beltColour,
				age,
				skills,
				id: Math.random()
			};

			dispatch("addPerson", person);
		};

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddPersonForm> was created with unknown prop '${key}'`);
		});

		const $$binding_groups = [[]];

		function input0_input_handler() {
			name = this.value;
			$$invalidate(0, name);
		}

		function input1_input_handler() {
			age = to_number(this.value);
			$$invalidate(2, age);
		}

		function input2_change_handler() {
			skills = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
			$$invalidate(3, skills);
		}

		function input3_change_handler() {
			skills = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
			$$invalidate(3, skills);
		}

		function input4_change_handler() {
			skills = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
			$$invalidate(3, skills);
		}

		function select_change_handler() {
			beltColour = select_value(this);
			$$invalidate(1, beltColour);
		}

		$$self.$capture_state = () => ({
			createEventDispatcher,
			dispatch,
			name,
			beltColour,
			age,
			skills,
			handleSubmit
		});

		$$self.$inject_state = $$props => {
			if ('dispatch' in $$props) dispatch = $$props.dispatch;
			if ('name' in $$props) $$invalidate(0, name = $$props.name);
			if ('beltColour' in $$props) $$invalidate(1, beltColour = $$props.beltColour);
			if ('age' in $$props) $$invalidate(2, age = $$props.age);
			if ('skills' in $$props) $$invalidate(3, skills = $$props.skills);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			name,
			beltColour,
			age,
			skills,
			handleSubmit,
			input0_input_handler,
			input1_input_handler,
			input2_change_handler,
			$$binding_groups,
			input3_change_handler,
			input4_change_handler,
			select_change_handler
		];
	}

	class AddPersonForm extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "AddPersonForm",
				options,
				id: create_fragment$1.name
			});
		}
	}

	/* src\App.svelte generated by Svelte v4.2.19 */

	const { console: console_1 } = globals;
	const file = "src\\App.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[6] = list[i];
		return child_ctx;
	}

	// (34:0) <Modal {showModal} on:click={toggleModal}>
	function create_default_slot(ctx) {
		let addpersonform;
		let current;
		addpersonform = new AddPersonForm({ $$inline: true });
		addpersonform.$on("addPerson", /*addPerson*/ ctx[4]);

		const block = {
			c: function create() {
				create_component(addpersonform.$$.fragment);
			},
			m: function mount(target, anchor) {
				mount_component(addpersonform, target, anchor);
				current = true;
			},
			p: noop,
			i: function intro(local) {
				if (current) return;
				transition_in(addpersonform.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(addpersonform.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				destroy_component(addpersonform, detaching);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_default_slot.name,
			type: "slot",
			source: "(34:0) <Modal {showModal} on:click={toggleModal}>",
			ctx
		});

		return block;
	}

	// (76:1) {:else}
	function create_else_block(ctx) {
		let p;

		const block = {
			c: function create() {
				p = element("p");
				p.textContent = "There are no people to show ...";
				add_location(p, file, 76, 2, 1759);
			},
			m: function mount(target, anchor) {
				insert_dev(target, p, anchor);
			},
			p: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(p);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_else_block.name,
			type: "else",
			source: "(76:1) {:else}",
			ctx
		});

		return block;
	}

	// (70:3) {#if person.beltColour === "black"}
	function create_if_block(ctx) {
		let p;
		let strong;

		const block = {
			c: function create() {
				p = element("p");
				strong = element("strong");
				strong.textContent = "Master Ninja";
				add_location(strong, file, 70, 7, 1559);
				add_location(p, file, 70, 4, 1556);
			},
			m: function mount(target, anchor) {
				insert_dev(target, p, anchor);
				append_dev(p, strong);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(p);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_if_block.name,
			type: "if",
			source: "(70:3) {#if person.beltColour === \\\"black\\\"}",
			ctx
		});

		return block;
	}

	// (67:1) {#each people as person (person.id)}
	function create_each_block(key_1, ctx) {
		let div;
		let h4;
		let t0_value = /*person*/ ctx[6].name + "";
		let t0;
		let t1;
		let t2;
		let p;
		let t3_value = /*person*/ ctx[6].age + "";
		let t3;
		let t4;
		let t5_value = /*person*/ ctx[6].beltColour + "";
		let t5;
		let t6;
		let t7;
		let button;
		let t9;
		let mounted;
		let dispose;
		let if_block = /*person*/ ctx[6].beltColour === "black" && create_if_block(ctx);

		function click_handler(...args) {
			return /*click_handler*/ ctx[5](/*person*/ ctx[6], ...args);
		}

		const block = {
			key: key_1,
			first: null,
			c: function create() {
				div = element("div");
				h4 = element("h4");
				t0 = text(t0_value);
				t1 = space();
				if (if_block) if_block.c();
				t2 = space();
				p = element("p");
				t3 = text(t3_value);
				t4 = text(" years old, ");
				t5 = text(t5_value);
				t6 = text(" belt.");
				t7 = space();
				button = element("button");
				button.textContent = "Delete";
				t9 = space();
				add_location(h4, file, 68, 3, 1488);
				add_location(p, file, 72, 3, 1607);
				add_location(button, file, 73, 3, 1668);
				add_location(div, file, 67, 2, 1478);
				this.first = div;
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, h4);
				append_dev(h4, t0);
				append_dev(div, t1);
				if (if_block) if_block.m(div, null);
				append_dev(div, t2);
				append_dev(div, p);
				append_dev(p, t3);
				append_dev(p, t4);
				append_dev(p, t5);
				append_dev(p, t6);
				append_dev(div, t7);
				append_dev(div, button);
				append_dev(div, t9);

				if (!mounted) {
					dispose = listen_dev(button, "click", click_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				if (dirty & /*people*/ 2 && t0_value !== (t0_value = /*person*/ ctx[6].name + "")) set_data_dev(t0, t0_value);

				if (/*person*/ ctx[6].beltColour === "black") {
					if (if_block) ; else {
						if_block = create_if_block(ctx);
						if_block.c();
						if_block.m(div, t2);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (dirty & /*people*/ 2 && t3_value !== (t3_value = /*person*/ ctx[6].age + "")) set_data_dev(t3, t3_value);
				if (dirty & /*people*/ 2 && t5_value !== (t5_value = /*person*/ ctx[6].beltColour + "")) set_data_dev(t5, t5_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				if (if_block) if_block.d();
				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(67:1) {#each people as person (person.id)}",
			ctx
		});

		return block;
	}

	function create_fragment(ctx) {
		let modal;
		let t0;
		let main;
		let button;
		let t2;
		let each_blocks = [];
		let each_1_lookup = new Map();
		let current;
		let mounted;
		let dispose;

		modal = new Modal({
				props: {
					showModal: /*showModal*/ ctx[0],
					$$slots: { default: [create_default_slot] },
					$$scope: { ctx }
				},
				$$inline: true
			});

		modal.$on("click", /*toggleModal*/ ctx[2]);
		let each_value = ensure_array_like_dev(/*people*/ ctx[1]);
		const get_key = ctx => /*person*/ ctx[6].id;
		validate_each_keys(ctx, each_value, get_each_context, get_key);

		for (let i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
		}

		let each_1_else = null;

		if (!each_value.length) {
			each_1_else = create_else_block(ctx);
		}

		const block = {
			c: function create() {
				create_component(modal.$$.fragment);
				t0 = space();
				main = element("main");
				button = element("button");
				button.textContent = "Open Modal";
				t2 = space();

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				if (each_1_else) {
					each_1_else.c();
				}

				add_location(button, file, 65, 1, 1385);
				attr_dev(main, "class", "svelte-1knh9dm");
				add_location(main, file, 64, 0, 1376);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				mount_component(modal, target, anchor);
				insert_dev(target, t0, anchor);
				insert_dev(target, main, anchor);
				append_dev(main, button);
				append_dev(main, t2);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(main, null);
					}
				}

				if (each_1_else) {
					each_1_else.m(main, null);
				}

				current = true;

				if (!mounted) {
					dispose = listen_dev(button, "click", /*toggleModal*/ ctx[2], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				const modal_changes = {};
				if (dirty & /*showModal*/ 1) modal_changes.showModal = /*showModal*/ ctx[0];

				if (dirty & /*$$scope*/ 512) {
					modal_changes.$$scope = { dirty, ctx };
				}

				modal.$set(modal_changes);

				if (dirty & /*handleClick, people*/ 10) {
					each_value = ensure_array_like_dev(/*people*/ ctx[1]);
					validate_each_keys(ctx, each_value, get_each_context, get_key);
					each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, destroy_block, create_each_block, null, get_each_context);

					if (!each_value.length && each_1_else) {
						each_1_else.p(ctx, dirty);
					} else if (!each_value.length) {
						each_1_else = create_else_block(ctx);
						each_1_else.c();
						each_1_else.m(main, null);
					} else if (each_1_else) {
						each_1_else.d(1);
						each_1_else = null;
					}
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(modal.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(modal.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(t0);
					detach_dev(main);
				}

				destroy_component(modal, detaching);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].d();
				}

				if (each_1_else) each_1_else.d();
				mounted = false;
				dispose();
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
		let showModal = false;

		const toggleModal = () => {
			$$invalidate(0, showModal = !showModal);
		};

		let people = [
			{
				name: "Yoshi",
				beltColour: "black",
				age: 25,
				id: 1
			},
			{
				name: "Mario",
				beltColour: "orange",
				age: 45,
				id: 2
			},
			{
				name: "Luigi",
				beltColour: "brown",
				age: 35,
				id: 3
			}
		];

		const handleClick = (e, id) => {
			// delete the person from people
			$$invalidate(1, people = people.filter(person => person.id != id));

			console.log(e);
		};

		// let num = 53;
		const addPerson = e => {
			// console.log(e.detail);
			// people.push(e.detail);
			const person = e.detail;

			$$invalidate(1, people = [person, ...people]);
			$$invalidate(0, showModal = false);
		};

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
		});

		const click_handler = (person, e) => handleClick(e, person.id);

		$$self.$capture_state = () => ({
			Modal,
			AddPersonForm,
			showModal,
			toggleModal,
			people,
			handleClick,
			addPerson
		});

		$$self.$inject_state = $$props => {
			if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
			if ('people' in $$props) $$invalidate(1, people = $$props.people);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [showModal, people, toggleModal, handleClick, addPerson, click_handler];
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
