import { View, Observer, Auth } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "../messages";
import { Model } from "../model";
import { property } from "lit/decorators.js";

export class FavoritesView extends View<Model, Msg> {
  @property({ type: Boolean })
  loaded = false;

  @property({ type: Object })
  user?: Auth.User;

  constructor() {
    super("lum:model");
  }

  connectedCallback() {
    super.connectedCallback();

    // Observe auth to get user info
    const authObs = new Observer<Auth.Model>(this, "lum:auth");
    authObs.observe((auth: Auth.Model) => {
      this.user = auth.user;
      if (this.user?.username) {
        this.dispatchMessage([
          "favorites/request",
          { userid: this.user.username }
        ]);
      }
    });
  }

  render() {
    const cards = this.model?.favorites ?? [];
    return html`
      <header-element name="Favorites"></header-element>
      <deck-element .cards=${cards}></deck-element>
    `;
  }
}
