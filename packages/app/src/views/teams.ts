import { View } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "../messages";
import { Model } from "../model";
import { property } from "lit/decorators.js";

export class TeamsView extends View<Model, Msg> {
  @property({ type: Boolean })
  loaded = false;

  constructor() {
    super("lum:model");
  }

  connectedCallback() {
    super.connectedCallback();

    // On connect, request the teams list
    this.dispatchMessage([
      "teams/request",
      {}
    ]);
  }

  render() {
    const cards = this.model?.teams ?? [];
    return html`
      <header-element name="Constructors"></header-element>
      <deck-element .cards=${cards}></deck-element>
    `;
  }
}
