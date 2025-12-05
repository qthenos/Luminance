import { Auth, Events, Observer } from "@calpoly/mustang";
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css.ts";

export class HeaderElement extends LitElement {
  @property()
  name?: string;

  @property()
  identifier?: string;

  @state()
  loggedIn = false;

  @state()
  userid?: string;

  @state()
  isFavorited = false;

  override render() {
    return html`
      <header>
        <div class="title-section">
          <h1><a href="/app">${this.name}</a></h1>
          ${this.identifier ? this.renderLikeButton() : html``}
        </div>
        <div class="welcome-section">
          <div class="user-profile">
            <svg class="helmet-icon">
              <use href="/icons/utilities.svg#helmet-utility" />
            </svg>
            <div>Hello ${this.userid || "Racer"}</div>
          </div>
          <div class="button-group">
            <label class="switch" onchange="toggleDM(event)">
              <input type="checkbox" autocomplete="off" id="theme-toggle" />
              <svg class="icon">
                <use href="/icons/utilities.svg#light-mode-utility" />
              </svg>
              <span class="slider"></span>
            </label>
            ${this.loggedIn
              ? this.renderSignOutButton()
              : this.renderSignInButton()}
          </div>
        </div>
      </header>
    `;
  }

  static styles = [
    reset.styles,
    css`
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--size-spacing-medium);

        background-color: var(--color-primary);
        color: var(--color-highlight);

        font-family: var(--font-family-display);

        border-bottom: 10px solid var(--color-accent);
        border-radius: 0 0 10px 10px;
      }

      .title-section {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .title-section .heart-container {
        transform: translateY(3px);
      }

      .title-section h1 {
        font-size: var(--size-type-xxlarge);
      }

      .title-section h1 a {
        color: var(--color-highlight);
        text-decoration: none;
      }

      header h2 {
        font-size: var(--size-type-small);
      }

      header label svg {
        width: 28px;
        fill: var(--color-highlight);
      }

      .user-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0px;
      }

      .user-profile .helmet-icon {
        width: 50px;
        height: 50px;
        fill: var(--color-highlight);
        stroke: var(--color-highlight);
        stroke-width: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-accent);
        border-radius: 50%;
      }

      .welcome-section {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        font-size: var(--size-type-large);
        padding: 0;
        border-radius: 6px;
      }

      .button-group {
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: auto;
        border: 2px solid var(--color-accent);
        border-radius: 8px;
        padding: 4px 6px;
        align-items: center;
      }

      .switch {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: auto;
        height: 34px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: relative;
        cursor: pointer;
        display: inline-block;
        width: 36px;
        height: 21px;
        background-color: var(--color-accent);
        -webkit-transition: 0.4s;
        transition: 0.4s;
        flex-shrink: 0;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 15px;
        width: 15px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
      }

      input:checked ~ .slider:before {
        -webkit-transform: translateX(15px);
        -ms-transform: translateX(15px);
        transform: translateX(15px);
      }

      .sign-btn {
        padding: 4px 8px;
        background-color: var(--color-accent);
        color: var(--color-highlight);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: var(--font-family-display);
        font-size: var(--size-type-small);
        transition: background-color 0.3s;
        font-size: var(--size-type-medium);
      }

      .sign-btn:hover {
        opacity: 0.8;
      }

      .heart-container {
        --heart-color: var(--color-highlight);
        position: relative;
        width: 25px;
        height: 25px;
        transition: 0.3s;
      }

      .heart-container .checkbox {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 20;
        cursor: pointer;
      }

      .heart-container .svg-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .heart-container .svg-outline,
      .heart-container .svg-filled {
        fill: var(--heart-color);
        position: absolute;
      }

      .heart-container .svg-filled {
        animation: keyframes-svg-filled 1s;
        display: none;
      }

      .heart-container .svg-celebrate {
        position: absolute;
        animation: keyframes-svg-celebrate 0.5s;
        animation-fill-mode: forwards;
        display: none;
        stroke: var(--heart-color);
        fill: var(--heart-color);
        stroke-width: 2px;
      }

      .heart-container .checkbox:checked ~ .svg-container .svg-filled {
        display: block;
      }

      .heart-container .checkbox:checked ~ .svg-container .svg-celebrate {
        display: block;
      }

      @keyframes keyframes-svg-filled {
        0% {
          transform: scale(0);
        }

        25% {
          transform: scale(1.2);
        }

        50% {
          transform: scale(1);
          filter: brightness(1.5);
        }
      }

      @keyframes keyframes-svg-celebrate {
        0% {
          transform: scale(0);
        }

        50% {
          opacity: 1;
          filter: brightness(1.5);
        }

        100% {
          transform: scale(1.4);
          opacity: 0;
          display: none;
        }
      }
    `,
  ];

  renderSignOutButton() {
    return html`
      <button
        class="sign-btn"
        @click=${(e: UIEvent) => {
          Events.relay(e, "auth:message", ["auth/signout"]);
          setTimeout(() => location.reload(), 500);
        }}
      >
        Sign Out
      </button>
    `;
  }

  renderSignInButton() {
    return html`
      <button class="sign-btn" onclick="location.href='/app/login';">
        Sign In
      </button>
    `;
  }

  renderLikeButton() {
    return html`
      <div class="heart-container" title="Like">
        <input
          type="checkbox"
          class="checkbox"
          id="Give-It-An-Id"
          .checked=${this.isFavorited}
          @change=${this.handleLikeClick}
        />
        <div class="svg-container">
          <svg
            viewBox="0 0 24 24"
            class="svg-outline"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"
            ></path>
          </svg>
          <svg
            viewBox="0 0 24 24"
            class="svg-filled"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"
            ></path>
          </svg>
          <svg
            class="svg-celebrate"
            width="100"
            height="100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="10,10 20,20"></polygon>
            <polygon points="10,50 20,50"></polygon>
            <polygon points="20,80 30,70"></polygon>
            <polygon points="90,10 80,20"></polygon>
            <polygon points="90,50 80,50"></polygon>
            <polygon points="80,80 70,70"></polygon>
          </svg>
        </div>
      </div>
    `;
  }

  _authObserver = new Observer<Auth.Model>(this, "lum:auth");
  _user?: Auth.User;

  get authorization() {
    return this._user ? Auth.headers(this._user) : {};
  }

  private async handleLikeClick(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (!this.userid || !this.identifier) return;

    const endpoint = isChecked
      ? `/api/profiles/${this.userid}/favorites/${this.identifier}`
      : `/api/profiles/${this.userid}/favorites/${this.identifier}`;

    const method = isChecked ? "POST" : "DELETE";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: this.authorization,
      });

      if (!response.ok) {
        checkbox.checked = !isChecked;
        this.isFavorited = !isChecked;
      } else {
        this.isFavorited = isChecked;
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      checkbox.checked = !isChecked;
      this.isFavorited = !isChecked;
    }
  }

  private async checkIfFavorited(userid: string) {
    if (!this.identifier) return;

    try {
      const response = await fetch(`/api/profiles/${userid}/favorites`, {
        headers: this.authorization,
      });

      if (response.ok) {
        const favorites = await response.json();
        this.isFavorited = favorites.some(
          (card: any) => card._id === this.identifier,
        );
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      const { user } = auth;
      this._user = user;

      if (user && user.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
        if (this.identifier) {
          this.checkIfFavorited(user.username);
        }
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });
  }

  override updated() {
    // Sync the checkbox with the stored dark mode preference after each render
    const themeToggle = this.shadowRoot?.querySelector(
      "#theme-toggle",
    ) as HTMLInputElement;
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (themeToggle) {
      themeToggle.checked = isDarkMode;
    }
  }
}
