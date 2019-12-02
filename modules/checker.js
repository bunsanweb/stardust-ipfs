// Validator of publishing Stardust document
export const checkStardust = (doc) => {
  if (!isHTMLDocument(doc)) return false;
  if (!hasSlotStardust(doc)) return false;
  if (!allAbsoluteHref(doc)) return false;
  if (!allAbsoluteSrc(doc)) return false;
  return true;
};

// conditions
const isHTMLDocument = doc =>
      doc.nodeType === doc.DOCUMENT_NODE &&
      doc.doctype.name === "html";
const hasSlotStardust = doc =>
      doc.querySelectorAll(`article[slot=stardust]`).length === 1;
const allAbsoluteHref = doc =>
      [...doc.querySelectorAll("[href]")].every(
        link => link.href === link.getAttribute("href"));
const allAbsoluteSrc = doc =>
      [...doc.querySelectorAll("[src]")].every(
        link => link.src === link.getAttribute("src"));

                                                
