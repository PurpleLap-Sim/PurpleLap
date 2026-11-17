const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");

const root = path.join(__dirname, "..");
const lists = new Map([
  ["photograph-credits", []],
  ["product-photo-credits", []],
  ["site-artwork-credits", []],
]);
global.document = {
  getElementById(id) {
    return lists.has(id) ? { append: (item) => lists.get(id).push(item) } : null;
  },
  createElement(tagName) {
    return {
      tagName,
      children: [],
      append(...items) {
        this.children.push(...items);
      },
    };
  },
  createTextNode(text) {
    return { text };
  },
};

const creditsModule = path.join(root, "photo-credits.js");
delete require.cache[creditsModule];
const credits = require(creditsModule);
delete global.document;
delete require.cache[creditsModule];

function visit(node, callback) {
  if (!node || typeof node !== "object") return;
  callback(node);
  for (const child of node.children || []) visit(child, callback);
}

test("all local images used by the site have a photo credit entry", () => {
  const creditedFiles = new Set([
    ...credits.photographs,
    ...credits.productPhotos,
    ...credits.siteArtwork,
  ].map((item) => item.file));
  const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
  const uncreditedFiles = new Set();

  for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(path.join(root, htmlFile), "utf8");
    for (const match of html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
      const source = match[1];
      if (/^(?:https?:|data:|\/|#)/i.test(source)) continue;
      if (!creditedFiles.has(source)) uncreditedFiles.add(source);
    }
  }

  assert.deepEqual([...uncreditedFiles], []);
});

test("photo-credit listings include every product image and link images in new tabs", () => {
  const actualProducts = fs.readdirSync(path.join(root, "assets/wheels"))
    .filter((file) => file.endsWith(".png"))
    .map((file) => `assets/wheels/${file}`)
    .sort();
  const creditedProducts = credits.productPhotos.map((item) => item.file).sort();

  assert.deepEqual(creditedProducts, actualProducts);

  for (const listItems of lists.values()) {
    for (const row of listItems) {
      visit(row, (node) => {
        if (node.tagName !== "a") return;
        assert.equal(node.target, "_blank");
        assert.equal(node.rel, "noopener noreferrer");
      });
    }
  }
});

test("HTML pages no longer place attribution labels beside images", () => {
  const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html"));

  for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(path.join(root, htmlFile), "utf8");
    assert.doesNotMatch(html, /class=["'][^"']*\b(?:photo-credit|product-photo-credit)\b/);
    assert.doesNotMatch(html, /Photo:\s|Photo by\s|MANUFACTURER PRODUCT PHOTO/);
  }
});

test("footers provide a shared link to the credits page", () => {
  const siteUi = fs.readFileSync(path.join(root, "site-ui.js"), "utf8");
  assert.match(siteUi, /photo-credits-link/);
  assert.match(siteUi, /photoCreditsLink\.href = 'photo-credits\.html'/);
});
