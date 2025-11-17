import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.ts";

export class TrackElement extends LitElement {
  @property()
  src?: string;

  @state()
  data: any = null;

  override render() {
    if (!this.data) {
      return html`<p>Loading track data...</p>`;
    }

    const d = this.data;

    return html`
      <article>
        <h2>${d.cityName}</h2>
        <main>
          <div>
            <h2>Details:</h2>
            <ul>
              <li>DRS Zones: ${d.drsZones}</li>
              <li>Turns: ${d.turns}</li>
              <li>
                Tire Compounds Available:
                <ol>
                  ${d.tireCompounds.map((t: any) => html`<li>${t}</li>`)}
                </ol>
              </li>
              <li>First GP: ${d.firstGP}</li>
              <li>Circuit Length: ${d.circuitLen}</li>
              <li>Number of laps: ${d.numLaps}</li>
              <li>Race Distance: ${d.raceDistance}</li>
              <li>
                Lap Record:
                <ul class="indented">
                  <li>${d.lapRecord.time}</li>
                  <li>${d.lapRecord.driver} (${d.lapRecord.year})</li>
                </ul>
              </li>
            </ul>
          </div>
          <figure>
            <img src="${d.figure.src}" alt="Circuit Image" width="400" />
            <figcaption>${d.figure.caption}</figcaption>
          </figure>
        </main>
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

      article > main {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      article > main div {
        flex: 1 1 auto;
        border: 2px solid var(--color-accent);
        border-radius: 6px;
        padding: var(--size-spacing-small);
        background: var(--color-background);
      }

      article > main figure {
        margin-left: auto;
        max-width: 30%;
        background: var(--color-background);
        border: 2px solid var(--color-accent);
        border-radius: 6px;
        padding: 10px;
        color: var(--color-accent);
        text-align: center;
      }

      .indented {
        list-style: square;
        padding-left: 1.5rem;
      }

      .indented > li {
        padding-left: 0.75rem;
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
