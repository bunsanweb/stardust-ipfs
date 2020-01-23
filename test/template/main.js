import * as Template from "http://localhost:10000/template.js";
import * as Checker from "http://localhost:10000/checker.js";

{
  const stardust = Template.newStardust();
  //console.debug(template.documentElement.outerHTML);
  console.assert(Checker.checkStardust(stardust),
                 "Check template itself is already stardust document");

  const link = stardust.createElement("a");
  link.href = "./relative.txt";
  stardust.querySelector("article[slot=stardust]").append(link);
  console.assert(!Checker.checkStardust(stardust),
                 "relative form url is invalid in href");
  
  link.href = "https://example.com/complete.txt";
  console.assert(Checker.checkStardust(stardust),
                 "complete form url is valid in href");

  const script = stardust.createElement("script");
  script.src = "./relative.js";
  stardust.head.append(script);
  console.assert(!Checker.checkStardust(stardust),
                 "relative form url is invalid in src");

  script.src = "https://example.com/complete.js";
  console.assert(Checker.checkStardust(stardust),
                 "relative form url is alid in src");  
}
