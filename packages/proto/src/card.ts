import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

export class CardElement extends LitElement {

    @property()
    backgroundImg?: string;

    @property()
    img?: string;

    @property()
    icon?: string;

    @property()
    href?: string;

    @property()
    label?: string

    override render() {
        if (this.backgroundImg) {
            return html`
                <li style="background-image: url(${this.backgroundImg});">
                    <a href="${this.href}">${this.label}</a>
                </li>
            `;
        } else if (this.img) {
            return html`
                <li>
                    <a href="${this.href}">${this.label}</a>
                    <img src="${this.img}">
                </li>
            `;
        } else if (this.icon) {
            return html`
                <li>
                    <a href="${this.href}">${this.label}</a>
                    <svg class="icon"><use href="${this.icon}" /></svg>
                </li>
            `;
        } else {
            return html`
                <li>
                    <a href="${this.href}">${this.label}</a>
                </li>
            `;
        }
    }

    static styles = [
        reset.styles,
        css`
            li {
                display: flex;
                aspect-ratio: 1 / 1;
                align-items: center;
                justify-content: center;
                border: 2px solid var(--color-accent);
                border-radius: 6px;
                padding: var(--size-spacing-small);
                background: var(--color-background);
                background-size: contain;

                position: relative;
                overflow: hidden;
                align-items: end;
            } 

            li > a {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: var(--size-spacing-small);
                border: 2px solid var(--color-accent);
                border-radius: 6px;
                background: var(--color-highlight-background);
                text-decoration: none;
                color: inherit;
                z-index: 2;
            }

            li > svg {
                position: absolute;
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
                fill: var(--color-highlight);
                opacity: 0.5;
                z-index: 0;
            }

            li:has(svg, img) > :not(svg, img) {
                position: relative;
                z-index: 1;
            }

            li > img {
                top: 0px;
                position: absolute;
                width: 110px;
                height: 110px;
                display: block;
                overflow: clip;
                object-fit: cover;
                object-position: top;
                z-index: 0;
            }

            li:has(img) > a {
                padding: 1px;
            }
        `
    ]
    
}