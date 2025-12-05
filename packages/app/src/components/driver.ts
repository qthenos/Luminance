import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";
import reset from "../styles/reset.css.ts";

export class DriverElement extends LitElement {
  @property()
  src?: string;

  @state()
  data: any = null;

  override render() {
    if (!this.data) {
      return html`<p>Loading driver data...</p>`;
    }

    const d = this.data;

    return html`
      <article>
        <figure>
          <img src="${d.imageSrc}" alt="Driver Portrait" />
        </figure>
        <main>
          <h2>Bio</h2>
          <p>${d.bio}</p>
          <h2>Standings</h2>
          <ul>
            <li><strong>Current Team:</strong> ${d.standings.team}</li>
            <li><strong>Points:</strong> ${d.standings.points}</li>
            <li><strong>Position:</strong> ${d.standings.position}</li>
          </ul>
          <h2>Stats</h2>
          <ul>
            <li>
              <strong>Grand Prix Entered:</strong> ${d.stats.grandPrixEntered}
            </li>
            <li><strong>Career Points:</strong> ${d.stats.careerPoints}</li>
            <li>
              <strong>Highest Race Finish:</strong> ${d.stats.highestRaceFinish}
            </li>
            <li><strong>Podiums:</strong> ${d.stats.podiums}</li>
            <li>
              <strong>Highest Grid Position:</strong> ${d.stats
                .highestGridPosition}
            </li>
            <li><strong>Pole Positions:</strong> ${d.stats.polePositions}</li>
            <li>
              <strong>World Championships:</strong> ${d.stats
                .worldChampionships}
            </li>
            <li><strong>DNFs:</strong> ${d.stats.dnfs}</li>
          </ul>
        </main>
        <div class="number">
          <svg class="top">
            <use href="/icons/designs.svg#racing-lines-top-design" />
          </svg>
          <p>${d.number}</p>
          <svg class="bot">
            <use href="/icons/designs.svg#racing-lines-bot-design" />
          </svg>
        </div>
      </article>
    `;
  }

  static styles = [
    reset.styles,
    css`
      article > h2 {
        text-align: center;
        font-family: var(--font-family-body);
        font-size: var(--size-type-xxlarge);
      }

      article {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-top: 20px;
      }

      article > figure {
        margin-right: auto;
        width: 200px;
        background: var(--color-darg-background);
        border: 2px solid var(--color-accent);
        border-radius: 6px;
        padding: 10px;
        color: var(--color-accent);
      }

      article > figure img {
        max-width: 180px;
      }

      article > .number {
        margin-left: auto;
        max-height: 580px;
        background: var(--color-darg-background);
        border: 2px solid var(--color-accent);
        border-radius: 6px;
        padding: 10px;
        color: var(--color-accent);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      article > .number p {
        rotate: 90deg;
        font-family: var(--font-family-display);
        font-size: var(--size-type-xxlarge);
      }

      article > .number svg {
        width: 100px;
        height: 242px;
        fill: var(--color-accent);
      }

      article > .number .top {
        rotate: 180deg;
      }

      article > main {
        flex: 1 1 auto;
        border: 2px solid var(--color-accent);
        border-radius: 6px;
        padding: var(--size-spacing-small);
        background: var(--color-darg-background);
        color: var(--color-text);
      }

      article > main h2 {
        text-align: center;
      }
    `,
  ];

  _authObserver = new Observer<Auth.Model>(this, "lum:auth");
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
