# VictorySync website CMS

Open `https://www.victorysync.com/cms` and connect with a GitHub fine grained personal access token. Give the token access only to `adamkamelmahgoub/victorysyncllc` with **Contents: Read and write**. The CMS keeps the token in memory for the current tab only. GitHub handles authorization; the website does not have an admin password or stored token.

Select any of the 18 marketing pages, then click text, an image, or a link in the preview. Hold **Alt** while clicking to select a surrounding section. You can edit text, image source and alt text, link targets, inline styles, and visibility. The Sections tab adds, edits, reorders, and removes additional page sections with images and calls to action. The SEO tab edits that page's title and description; social titles and descriptions follow them. The Media tab uploads an image to the repository and inserts its URL into the selected image. A draft is saved in the current browser's local storage until it is published or discarded.

**Publish changes** commits `client/public/cms/content.json` to `main`. Vercel builds the site again. The prerender step applies published edits before saving the HTML for each marketing page, so text and SEO changes appear in raw HTML without JavaScript. GitHub's file history provides earlier versions and the CMS links to it.

The CMS checks the file SHA before publishing and refuses to overwrite another editor's changes. Image uploads create separate commits. Keep the token private; revoke it in GitHub settings if it is lost. The `/cms` route has an `X-Robots-Tag: noindex, nofollow` header and is absent from the sitemap.

The editor handles existing page elements and their styles. Adding new React components, changing business logic, or changing the form and checkout workflows still requires a code change. DOM selector keys may need review after substantial layout code changes because moving elements can change their paths.
