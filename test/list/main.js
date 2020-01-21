import * as Template from "http://localhost:10000/template.js";
import * as List from "http://localhost:10000/list.js";

{
  const page = List.newStardustPage();

  const s1 = newStardust(
    "https://example.com/foo.js", ["javascript", "cache-control"]);
  const s2 = newStardust(
    "https://example.com/bar.js", ["javascript", "library"]);

  List.addStardustLink(
    page, "https://example.net/s1/",
    s1.querySelectorAll("[slot=xx-target],[slot=xx-tags]"));

  List.addStardustLink(
    page, "https://example.net/s2/",
    s2.querySelectorAll("[slot=xx-target],[slot=xx-tags]"));

  List.setPrevPage(page, "https://example.net/p0/"); 

  //console.log(page.documentElement.outerHTML);
  console.assert(
    page.querySelector(
      "li:nth-child(2) a[slot=stardust-page-link]").href ===
      "https://example.net/s1/", "latter added is former: s1");
  console.assert(
    page.querySelector(
      "li:nth-child(1) a[slot=stardust-page-link]").href ===
      "https://example.net/s2/", "latter added is former: s2");

  // embedded slots
  console.assert(
    page.querySelector(
      "li:nth-child(2) a[slot=xx-target]").href ===
      "https://example.com/foo.js", "s1 xx-target");
  console.assert(
    page.querySelector(
      "li:nth-child(2) [slot=xx-tags]").textContent ===
      "javascript cache-control ", "s1 xx-tags");
  
  console.assert(
    page.querySelector(
      "li:nth-child(1) a[slot=xx-target]").href ===
      "https://example.com/bar.js", "s2 xx-target");
  console.assert(
    page.querySelector(
      "li:nth-child(1) [slot=xx-tags]").textContent ===
      "javascript library ", "s2 xx-tags");
}

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
