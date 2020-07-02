// Stardust Link Page document
const docImpl = options => options.docimpl || document.implementation;

export const newStardustPage = (options = {}) => {
  const doc = docImpl(options).createHTMLDocument("");
  const charset = doc.createElement("meta");
  charset.setAttribute("charset", "utf-8");
  doc.head.prepend(charset);
  
  const page = doc.createElement("article");
  page.slot = "stardust-page";
  doc.body.append(page);

  const ul = doc.createElement("ul");
  page.append(ul);

  const footer = doc.createElement("footer");
  page.append(footer);
  
  return doc;
};

export const setPrevPage = (doc, prevUrl) => {
  if (doc.querySelector("link[rel=prev]")) return;
  const link = doc.createElement("link");
  link.rel = "prev";
  link.href = prevUrl;
  doc.head.append(link);
  const pageLink = doc.createElement("a");
  pageLink.slot = "stardust-page-prev";
  pageLink.textContent = "prev";
  pageLink.href = prevUrl;
  const footer = doc.querySelector(
    "article[slot=stardust-page] > footer:last-child");
  footer.append(pageLink);
};

export const addStardustLink = (doc, url, slotteds = []) => {
  const link = doc.createElement("a");
  link.rel = "stardust";
  link.href = url;
  link.slot = "stardust-page-link";
  link.textContent = url;
  const embeds = Array.from(
    slotteds, slotted => doc.importNode(slotted, true));

  // TBD: list item structure
  const div = doc.createElement("div");
  div.className = "link-to-stardust";
  div.append(link, ...embeds);
  
  const li = doc.createElement("li");  
  li.append(div);
  
  const container = doc.querySelector("article[slot=stardust-page] ul");
  container.prepend(li);  
};
