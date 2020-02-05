
const safeEventTarget = () => {
  try {
    new (class extends window.EventTarget {})();
    return window.EventTarget;
  } catch (error) {
    // WebKit fails to use EventTarget constructor
    return class EventTarget {
      constructor() {
        this.listeners = {};
      }
      addEventListener(type, listener, opts) {
        if (!(type in this.listeners)) this.listeners[type] = [];
        const index = this.listeners[type].findIndex(
          ([l, opts]) => l === listener);
        if (index < 0) this.listeners[type].push([listener, opts]);
      }
      removeEventListener(type, listener, opts) {
        if (!(type in this.listeners)) return;
        const index = this.listeners[type].findIndex(
          ([l, opts]) => l === listener);
        if (index >= 0) this.listeners[type].splice(index, 1);
      }
      dispatchEvent(event) {
        if (!(event.type in this.listeners)) return true;
        const listeners = this.listeners[event.type].slice();
        for (const [listener, opts] of listeners) {
          if (opts instanceof Object && opts.once) {
            const index = this.listeners[event.type].findIndex(
              ([l, opts]) => l === listener);
            this.listeners[event.type].splice(index, 1);
          }
          listener.call(this, event);
        }
        return !event.defaultPrevented;
      }
    };
  }
};

export const EventTarget = safeEventTarget();

