// @flow

class utils {
  // Navigate browser to the top of the page
  static navigateToTopOfPage(): void {
    window.scrollTo(0, 0);
  }

  // Put string html content into a format that dangerouslySetInnerHTML accepts
  static unescapeHtml(html: string): string {
    let escapeEl = document.createElement("textarea");
    escapeEl.innerHTML = html;
    return escapeEl.textContent;
  }

  // Use singular or plural form of word depending on if there are 1 of the item it references
  static pluralize(singular: string, plural: string, count: number): string {
    return count === 1 ? singular : plural;
  }
}

export default utils;
