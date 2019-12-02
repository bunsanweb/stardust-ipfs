import {checkStardust} from "./checker.js";
import {newStardustPage, setPrevPage, addStardustLink} from "./link.js";
import {put} from "./put-ipfs/put-ipfs.js";

// IPFS based Stardust Publisher
// - pageDoc: HTMLDocument
// - slots: list of slot names to embedded in page
// - node: IPFS node
// - options.docimpl: DOMImplementation instance
// - options.put: put-ipfs.js options (gateway, fetchImpl, trial, ...)
export const StardustPublisher = class extends EventTarget {
  constructor(pageDoc, slots, node, options = {}) {
    this.pageDoc = pageDoc || newStardustPage(options);
    this.slots = slots; 
    this.node = node;
    this.options = options;
    // TBD: last-update date
  }

  get linkCount() {
    return this.pageDoc.querySelectorAll("a[slot=stardust-page-link]").length;
  }

  get pageHtml() {
    return `<!doctype htm>\n${this.pageDoc.documentElement.outerHTML}`;
  }
  get pageBuffer() {
    return new TextEncoder().encode(this.pageHtml);
  }
  
  async publish(stardustDoc) {
    if (!checkStardust(stardustDoc)) {
      throw Error("document is unsatisfied for Stardust");
    }
    const html = `<!doctype htm>\n${stardustDoc.documentElement.outerHTML}`;
    const bundle = {"index.html": html};
    const urlPromise = put(this.node, bundle, this.options.put);

    const main = stardustDoc.querySelector("article[slot=stardust]");
    const query = this.slots.map(slot => `[slot="${slot}"]`).join(",");
    const slotteds = [...main.querySelectorAll(query)];
    const url = await urlPromise;
    addStardustLink(this.pageDoc, url, slotteds);
    
    this.dispatchEvent("published", new Event("published"));
    return url;
  }

  async archivePage() {
    const bundle = {"index.html": this.pageHtml};
    const url = await put(this.node, bundle, this.options.put);
    const doc = newStardustPage(this.options);
    setPrevPage(doc, url);
    this.pageDoc = doc;
    this.dispatchEvent("archived", new Event("archived"));
    return url;
  }

  asPesponse(init = {}) {
    const buffer = this.pageBuffer;
    const headers = Object.assign(
      Object.fromEntries(new Headers(init.headers).entries()), {
        "content-type": "text/html;charset=utf-8",
        "content-length": `${buffer.byteLength}`,
      });
    return new Response(buffer, Object.assign({}, init, {headers}));
  }
};

