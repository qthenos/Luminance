import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer, define, Form, View } from "@calpoly/mustang";
import reset from "../styles/reset.css.ts";
import { Msg } from "../messages";
import { Model } from "../model";

export class TrackElement extends View<Model, Msg> {
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
    
    // Watch the model for track updates
    this._modelObserver.observe((model: Model) => {
      if (model.track) {
        this.data = model.track;
      }
    });
  }

  _modelObserver = new Observer<Model>(this, "lum:model");

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
        margin-bottom: 70px;
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
    `,
  ];

  _authObserver = new Observer<Auth.Model>(this, "lum:auth");
  _user?: Auth.User;

  get authorization() {
    return this._user ? Auth.headers(this._user) : {};
  }

  renderEditModal() {
    const d = this.data;
    if (!d) return null;

    const renderField = (key: string, value: any, path: string = ''): any => {
      const fieldPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return html`
          <fieldset>
            <h3>${this.formatLabel(key)}</h3>
            ${Object.entries(value).map(([k, v]) => renderField(k, v, fieldPath))}
          </fieldset>
        `;
      } else if (Array.isArray(value)) {
        // Handle arrays as comma-separated text
        const arrayValue = value.join(', ');
        return html`
          <label>
            <span>${this.formatLabel(key)} <strong>(comma-separated)</strong></span>
            <input 
              type="text" 
              name="${fieldPath}"
              value="${arrayValue}"
              placeholder="Enter values separated by commas (e.g., Soft, Medium, Hard)"
            />
          </label>
        `;
      } else {
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
            <h2>Edit Track</h2>
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
                if (key === 'imageSrc' || key === 'name' || key === 'trackName' || key === 'figure' || key === '_id') {
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
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private handleSubmit = (e: any) => {
    const formData = e.detail;
    const trackName = this.data?.trackName;
    
    const updatedTrack = this.reconstructTrack(formData);
    
    this.dispatchMessage([
      "track/update",
      {
        trackName: trackName,
        data: updatedTrack
      }
    ]);
    
    this.showEditModal = false;
  }

  private reconstructTrack(formData: Record<string, any>): any {
    const track = { ...this.data };
    
    Object.entries(formData).forEach(([key, value]) => {
      const parts = key.split('-');
      let current = track;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      const finalKey = parts[parts.length - 1];
      
      // Check if this field should be an array in the original data
      if (Array.isArray(this.data[parts[0]]) || 
          (parts.length === 1 && Array.isArray(this.data[key]))) {
        // Convert comma-separated string back to array
        current[finalKey] = String(value).split(',').map((item: string) => item.trim());
      } else {
        // Convert to appropriate type based on original value
        const originalValue = this.data[key];
        if (typeof originalValue === 'number') {
          current[finalKey] = isNaN(Number(value)) ? value : Number(value);
        } else {
          current[finalKey] = value;
        }
      }
    });
    
    return track;
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
