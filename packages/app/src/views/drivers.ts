import { View } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "../messages";
import { Model } from "../model";
import { property } from "lit/decorators.js";

export class DriversView extends View<Model, Msg> {
  @property({ type: Boolean })
  loaded = false;

  constructor() {
    super("lum:model");
  }

  connectedCallback() {
    super.connectedCallback();

    // On connect, request the drivers list (example message)
    this.dispatchMessage([
      "drivers/request",
      {}
    ]);
  }

  render() {
    const cards = this.model?.drivers ?? [];
    return html`
      <header-element name="Drivers"></header-element>
      <deck-element .cards=${cards}></deck-element>
    `;
  }
}
