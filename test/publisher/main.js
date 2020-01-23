import * as Publisher from "http://localhost:10000/publisher.js";
import * as Template from "http://localhost:10000/template.js";
import "https://cdn.jsdelivr.net/npm/ipfs/dist/index.js";
//console.log(window.Ipfs);

const main = async () => {
  console.info("[INFO] IPFS node spawn several logs includes WebSocket Errors");
  const node = new Ipfs({
    repo: `ipfs-${Math.random()}`,
    relay: {enabled: true, hop: {enabled: true, active: true}},
  });
  await node.ready;
  window.ipfsNode = node;
  //console.debug("IPFS version:", (await node.version()).version);
  //console.debug(`Peer ID:`, (await node.id()).id);
  
  const opts = {
    // uncheck published here, it is a responsibility of put-ipfs.js
    put: {checkReached: false,}, 
  };
  
  const publisher = new Publisher.StardustPublisher(
    null, ["xx-target", "xx-tags"], node);
  //console.debug(publisher.pageHtml);
  const published = [], archived = [];
  publisher.addEventListener("published",  ev => {
    published.push(ev.detail.url);
    //console.debug("Event Published:", ev.detail.url);
  });
  publisher.addEventListener("archived",  ev => {
    archived.push(ev.detail.url);
    //console.debug("Event Archived:", ev.detail.url);
  });
  
  const s1 = newStardust(
    "https://example.com/foo.js", ["javascript", "cache-control"]);
  const s2 = newStardust(
    "https://example.com/bar.js", ["javascript", "library"]);
  
  const s1url = await publisher.publish(s1);
  //console.debug("s1", s1url);
  //console.debug("page", publisher.pageHtml);
  console.assert(published[0] === s1url, "s1url");
  console.assert(
    publisher.pageDoc.querySelector("a[rel=stardust]").href ===
      s1url, "link to s1");
  console.assert(
    publisher.pageDoc.querySelector("a[slot=xx-target]").href ===
      "https://example.com/foo.js", "s1 xx-target");
  console.assert(
    publisher.pageDoc.querySelector("[slot=xx-tags]").textContent ===
      "javascript cache-control ", "s1 xx-names");

  const p1url = await publisher.archivePage();
  //console.debug("p1", p1url);
  //console.debug("page", publisher.pageHtml);
  console.assert(archived[0] === p1url, "p1url");
  console.assert(
    publisher.pageDoc.querySelectorAll("a[rel=stardust]").length === 0,
    "stardust links in new page");
  console.assert(
    publisher.pageDoc.querySelector("head link[rel=prev]").href === p1url,
    "prev link in new page");
  console.assert(
    publisher.pageDoc.querySelector("a[slot=stardust-page-prev]").href ===
      p1url, "prev page link in new page");

  const s2url = await publisher.publish(s2);
  //console.debug("s2", s2url);
  //console.debug("page", publisher.pageHtml);
  console.assert(published[1] === s2url, "s2url");
  console.assert(
    publisher.pageDoc.querySelector("a[rel=stardust]").href ===
      s2url, "link to s2");
  console.assert(
    publisher.pageDoc.querySelector("a[slot=xx-target]").href ===
      "https://example.com/bar.js", "s2 xx-target");
  console.assert(
    publisher.pageDoc.querySelector("[slot=xx-tags]").textContent ===
      "javascript library ", "s2 xx-names");
  
  if (typeof window.finish === "function") window.finish();
};
main().catch(err => console.error(err.message));

function newStardust(targetUrl, tagList) {
  const stardust = Template.newStardust();
  const body = stardust.querySelector("article[slot=stardust]");
  const target = stardust.createElement("a");
  target.href = targetUrl;
  target.textContent = new URL(targetUrl).pathname;
  target.slot = "xx-target";
  const tags = stardust.createElement("footer");
  for (const t of tagList) {
    const span = stardust.createElement("span");
    span.append(t);
    tags.append(span, " ");
  }
  tags.slot = "xx-tags";
  body.append(target, tags);
  return stardust;
}
