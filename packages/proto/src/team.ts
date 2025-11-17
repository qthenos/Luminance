import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.ts";

export class TeamElement extends LitElement {
  @property()
  src?: string;

  @state()
  data: any = null;

  override render() {
    if (!this.data) {
      return html`<p>Loading team data...</p>`;
    }

    const d = this.data;

    return html`
      <article>
        <figure>
          <img
            src="${d.imageSrc}"
            alt="Sideprofile of team car facing right."
            width="400"
          />
        </figure>
        <main>
          <h2>Ranking:</h2>
          <ul>
            <li>WCC Position: ${d.ranking.wccPosition}</li>
            <li>Current Points: ${d.ranking.currentPoints}</li>
          </ul>
          <h2>Drivers</h2>
          <ul>
            ${d.drivers.map(
              (driver: any) => html`
                <li>
                  ${driver.name}
                  <ul>
                    <li>Car Number: ${driver.carNumber}</li>
                    <li>Joined Team: ${driver.joinedTeam}</li>
                  </ul>
                </li>
              `,
            )}
          </ul>
        </main>
      </article>
    `;
  }

  static styles = [
    reset.styles,
    css`
      article > figure {
        background: var(--color-background);
        border: 2px solid var(--color-accent);
        border-radius: 6px;
        max-width: 50%;
        margin-inline: auto;
        margin-top: 2rem;
        margin-bottom: 2rem;
      }

      article > figure img {
        width: 100%;
        height: auto;
        display: block;
      }

      article > main {
        background: var(--color-background);
        border: 2px solid var(--color-accent);
        border-radius: 6px;
      }

      article ul {
        list-style: disc;
        padding-left: 2em;
      }

      article ul ul {
        list-style: circle;
        padding-left: 2em;
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
          this.data = json;
        }
      });
  }
}
