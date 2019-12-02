// Template for publishing Stardust document
const docImpl = options => options.docimpl || document.implementation;

export const newStardust = (options = {}) => {
  const doc = createDocument(options);
  // TBD: 
  return doc;
};

const createDocument = options => {
  const doc = docImpl(options).createHTMLDocument("");
  const charset = doc.createElement("meta");
  charset.setAttribute("charset", "utf-8");
  doc.head.prepend(charset);

  // Stardust document has a `article[slot=stardust]` as a container 
  const article = document.createElement("article");
  article.slot = "stardust";
  doc.body.append(article);
  
  return doc;
};
