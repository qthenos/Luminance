import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer, define, Form, View } from "@calpoly/mustang";
import reset from "../styles/reset.css.ts";
import { Msg } from "../messages";
import { Model } from "../model";

export class DriverElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element
  });

  @property()
  src?: string;

  @state()
  data: any = null;

  @state()
  showEditModal: boolean = false;

  constructor() {
    super("lum:model");
  }

  override connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      if (this.src) this.hydrate(this.src);
    });
    
    // Watch the model for driver updates
    this._modelObserver.observe((model: Model) => {
      if (model.driver) {
        this.data = model.driver;
      }
    });
  }

  _modelObserver = new Observer<Model>(this, "lum:model");

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
            <li><strong>Current Team:</strong> ${d.team}</li>
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
      <footer>
        <div class="footer-brand">Luminance™</div>
        <button class="sign-btn" @click="${() => (this.showEditModal = true)}">Edit</button>
      </footer>
      ${this.showEditModal ? this.renderEditModal() : null}
    `;
  }

  static styles = [
    reset.styles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

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
        margin-bottom: 70px;
      }

      article > figure {
        margin-right: auto;
        width: 200px;
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
        color: var(--color-text);
      }

      article > main h2 {
        text-align: center;
      }

      footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.5rem;
        border-top: 5px solid var(--color-accent);
        background-color: var(--color-primary);
        z-index: 100;
      }

      .footer-brand {
        font-family: var(--font-family-display);
        font-size: var(--size-type-medium);
        color: var(--color-accent);
        line-height: 1;
        border: 2px solid var(--color-accent);
        padding: 0.5rem 1rem;
        border-radius: 4px;
      }

      .sign-btn {
        padding: 0.75rem 1.5rem;
        background-color: var(--color-accent);
        color: var(--color-highlight);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: var(--font-family-display);
        font-size: var(--size-type-medium);
        transition: opacity 0.3s;
      }

      .sign-btn:hover {
        opacity: 0.8;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal {
        border: 2px solid var(--color-accent);
        border-radius: 6px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        color: var(--color-text);
        background-color: var(--color-primary);
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--color-accent);
      }

      .modal-header h2 {
        margin: 0;
        font-size: var(--size-type-xlarge);
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--color-accent);
        padding: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s;
      }

      .close-btn:hover {
        opacity: 0.7;
      }

      .modal-content {
        padding: 1.5rem;
        display: grid;
        grid-template-columns: 1fr;
      }

      mu-form {
        display: contents;
      }

      mu-form label {
        display: block;
        margin-bottom: 1rem;
      }

      mu-form label span {
        display: block;
        color: var(--color-accent);
        font-family: var(--font-family-display);
        font-weight: bold;
        margin-bottom: 0.5rem;
        font-size: var(--size-type-small);
      }

      mu-form input,
      mu-form select,
      mu-form textarea {
        display: block;
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--color-accent);
        border-radius: 4px;
        background-color: var(--color-primary);
        color: var(--color-text);
        font-family: var(--font-family-body);
        box-sizing: border-box;
      }

      mu-form input:focus,
      mu-form select:focus,
      mu-form textarea:focus {
        outline: none;
        border-color: var(--color-highlight);
        box-shadow: 0 0 0 2px rgba(var(--color-highlight-rgb), 0.2);
      }

      mu-form fieldset {
        border: 2px solid var(--color-accent) !important;
        border-radius: 4px !important;
        padding: 1rem !important;
        margin-bottom: 1rem !important;
        display: block !important;
        box-sizing: border-box !important;
      }

      mu-form fieldset h3 {
        margin: 0 0 1rem 0;
        color: var(--color-accent);
        font-family: var(--font-family-display);
        font-size: var(--size-type-medium);
      }

      @media (max-width: 1024px) {
        article > figure {
          width: 140px;
          padding: 8px;
        }

        article > figure img {
          max-width: 124px;
        }

        article > .number {
          padding: 8px;
        }

        article > .number svg {
          width: 70px;
          height: 170px;
        }

        article > .number p {
          font-size: var(--size-type-xlarge);
        }
      }

      @media (max-width: 768px) {
        article > figure {
          width: 100px;
          padding: 6px;
        }

        article > figure img {
          max-width: 88px;
        }

        article > .number {
          max-height: 400px;
          padding: 6px;
        }

        article > .number svg {
          width: 50px;
          height: 120px;
        }

        article > .number p {
          font-size: var(--size-type-large);
        }
      }
    `,
  ];

  _authObserver = new Observer<Auth.Model>(this, "lum:auth");
  _user?: Auth.User;

  renderEditModal() {
    const d = this.data;
    if (!d) return null;

    // Generate form fields dynamically from the data structure
    const renderField = (key: string, value: any, path: string = ''): any => {
      const fieldPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        // Render as a fieldset for nested objects
        return html`
          <fieldset>
            <h3>${this.formatLabel(key)}</h3>
            ${Object.entries(value).map(([k, v]) => renderField(k, v, fieldPath))}
          </fieldset>
        `;
      } else {
        // Render as a label + input for primitive values
        const inputType = typeof value === 'number' ? 'number' : 'text';
        const displayValue = value === 0 ? '0' : (value || '');
        return html`
          <label>
            <span>${this.formatLabel(key)}</span>
            <input 
              type="${inputType}" 
              name="${fieldPath}"
              value="${displayValue}"
            />
          </label>
        `;
      }
    };

    return html`
      <div class="modal-overlay" @click="${() => (this.showEditModal = false)}">
        <div class="modal" @click="${(e: Event) => e.stopPropagation()}">
          <div class="modal-header">
            <h2>Edit Driver</h2>
            <button
              class="close-btn"
              @click="${() => (this.showEditModal = false)}"
            >
              ✕
            </button>
          </div>
          <div class="modal-content">
            <mu-form
              .init=${d}
              @mu-form:submit=${this.handleSubmit}>
              ${Object.entries(d).map(([key, value]) => {
                // Skip image-related fields and ObjectID
                if (key === 'imageSrc' || key === 'name' || key === '_id' || key == 'number') {
                  return null;
                }
                return renderField(key, value);
              })}
            </mu-form>
          </div>
        </div>
      </div>
    `;
  }

  private formatLabel(text: string): string {
    // Convert camelCase or snake_case to Title Case
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private handleSubmit = (e: any) => {
    const formData = e.detail;
    const driverNumber = this.data?.number;
    
    // Reconstruct the full driver object with updated values
    const updatedDriver = this.reconstructDriver(formData);
    
    // Dispatch the update message
    this.dispatchMessage([
      "driver/update",
      {
        number: driverNumber,
        data: updatedDriver
      }
    ]);
    
    // Close the modal
    this.showEditModal = false;
  }

  private reconstructDriver(formData: Record<string, any>): any {
    const driver = { ...this.data };
    
    Object.entries(formData).forEach(([key, value]) => {
      const parts = key.split('-');
      let current = driver;
      
      // Navigate/create nested structure
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      // Set the final value
      current[parts[parts.length - 1]] = value;
    });
    
    return driver;
  }

  get authorization() {
    return this._user ? Auth.headers(this._user) : {};
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
