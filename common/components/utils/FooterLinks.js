// @flow

type DLAB_FOOTER_LINK = {|
  u: string,
  n: string
|};

export type FooterLink = {|
  url: string,
  name: string
|};

class FooterLinks {
  static list(): $ReadOnlyArray<FooterLink> {
    try {
      const envFooterData:string = window.DLAB_FOOTER_LINKS;
      const envLinks: $ReadOnlyArray<DLAB_FOOTER_LINK> = JSON.parse(_.unescape(envFooterData));
      return envLinks.map( (link:DLAB_FOOTER_LINK) => ({url:link.u, name:link.n}));
    } catch(ex) {
      console.error("Failed to parse footer links. ", ex);
      return [];
    }
  }
}

export default FooterLinks;
