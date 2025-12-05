import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";
import reset from "../styles/reset.css.ts";
import { DeckElement } from "./deck.ts";

export class FavoritesElement extends LitElement {
  static uses = { "deck-element": DeckElement };

  @state()
  userid?: string;

  override render() {
    if (!this.userid) {
      return html`<p>Loading favorites...</p>`;
    }

    return html`
      <deck-element src="/api/profiles/${this.userid}/favorites"></deck-element>
    `;
  }

  static styles = [
    reset.styles,
    css`
      :host {
        display: contents;
      }
    `,
  ];

  _authObserver = new Observer<Auth.Model>(this, "lum:auth");

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      const { user } = auth;

      if (user && user.authenticated) {
        this.userid = user.username;
      } else {
        this.userid = undefined;
      }
    });
  }
}
