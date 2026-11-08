# Changelog

Most fixes below were **found on one shop** (COS in this round) but are written as **general rules that run on every shop**, not as a shop list. That is the design: a fix is only worth keeping if it also makes sense on other shops.

How far each change was checked: the reading rules are covered by the unit tests (`test-classify.js`). The behaviour in the browser was checked on the shop where the problem showed up. It was **not** re-run on all shops after each change, so a change that helps one shop could in principle affect another. Please report anything odd (popup → "Something wrong? Copy report").

## 1.27: category links that look like product links, and a popup made for phones
- Links to a category (for example a big picture on a home page that leads to "T-shirts") were sometimes treated as one product, because the address starts with "/t". The category page lists many products, so its first material was shown as if it belonged to the picture. The "/t" rule now only counts as a product address when it is a real "/t/" folder. Found on Uniqlo, applies to every shop.
- The popup now fills the screen on phones and tablets (Firefox for Android): larger text, a larger on/off button and menu, and tap targets of at least 48 px. On desktop it looks the same as before.

## 1.26 and 1.25: choose what happens to items that are not natural
- New **"Hide nothing, labels only"** mode: every item is read and gets a label, nothing is hidden. Natural items get the green label, plastic-based ones a "✖ Contains …" label, unreadable ones a grey "?" label. Works the same on every shop.
- The two checkboxes in the popup became **one choice with three options**: hide plastic and unclear items (default) / hide only plastic items / hide nothing, labels only. Old settings carry over.

## 1.24: featured products shown as a big picture
- A big picture of one product that stands alone at the top of a list (not inside the repeating grid) now gets a label too. Only used once the page is clearly a product list, so lookbook pages stay untouched.

## 1.23: materials of other products on the page
- The "you may also like" data on a page is no longer read as this product's materials. A product without its own material list is now correctly "not readable", instead of borrowing a neighbour's materials.

## 1.22: product pages opened from a list
- In shops that change the page without reloading it, the product page still held the data of the list. That page is now downloaded again and read on its own, so the label belongs to the product you are looking at.

## 1.21: materials stored as data instead of text
- Some shops keep the composition as data (a material name with a percentage and a "shell"/"lining" type) instead of text like "100% cashmere". These are now read like a normal composition list, including which part is the lining. Fixes cashmere coats that showed only their lining ("TENCEL").

## 1.20: private windows
- In private windows nothing is stored (no cache, no shop notes). Everything still works while the tab is open.

## 1.18 to 1.19 (not itemised)
- Fixes for shops that put an empty link on top of the picture, and sheepskin / shearling counted as natural. Details were not kept per version.

## 1.17 and earlier
- First public version: material reading in 10 languages, labels, certification card, per-shop off switch, keep-space mode for shops whose list moves, pause when a shop restricts access.
