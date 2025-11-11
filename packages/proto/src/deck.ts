import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { define, Auth, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.ts";
import { Card } from "./models/card.ts";
import { CardElement } from "./card.ts";

export class DeckElement extends LitElement {
  static uses = define({
    "card-element": CardElement,
  });

  @property()
  src?: string;

  @state()
  cards: Array<Card> = [];

  render() {
    const { cards } = this;

    function renderCard(c: Card) {
      if (c.backImg) {
        return html`
          <card-element
            href="${c.link}"
            label="${c.label}"
            backgroundImg="${c.backImg}"
          ></card-element>
        `;
      } else if (c.img) {
        return html`
          <card-element
            href="${c.link}"
            label="${c.label}"
            img="${c.img}"
          ></card-element>
        `;
      } else if (c.icon) {
        return html`
          <card-element
            href="${c.link}"
            label="${c.label}"
            icon="${c.icon}"
          ></card-element>
        `;
      } else {
        return html`
          <card-element href="${c.link}" label="${c.label}"></card-element>
        `;
      }
    }

    return html` ${cards.map(renderCard)} `;
  }

  static styles = [
    reset.styles,
    css`
      :host {
        display: contents;
      }

      card-element {
        display: block;
      }
    `,
  ];

  _authObserver = new Observer<Auth.Model>(this, "blazing:auth");
  _user?: Auth.User;

  get authorization() {
    return this._user ? Auth.headers(this._user) : {};
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      if (this.src) this.hydrate(this.src);
    });
  }

  hydrate(src: string) {
    fetch(src, { headers: this.authorization })
      .then((res) => res.json())
      .then((json: object) => {
        if (json) {
          this.cards = json as Array<Card>;
        }
      });
  }
}
