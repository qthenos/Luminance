import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "../styles/reset.css.ts";
import { SignupFormElement } from "../auth/signup-form";

export class SignupElement extends LitElement {
  @property()
  api: string = "/auth/register";

  @property()
  redirect: string = "/app";

  override connectedCallback() {
    super.connectedCallback();
    // Define SignupFormElement if not already defined
    if (!customElements.get("signup-form")) {
      customElements.define("signup-form", SignupFormElement);
    }
  }

  override render() {
    return html`
      <div class="signup-container">
        <h2>Create Account</h2>
        <main class="signup-card">
          <signup-form api="${this.api}" redirect="${this.redirect}">
            <label>
              <span>Username:</span>
              <input name="username" autocomplete="off" />
            </label>
            <label>
              <span>Password:</span>
              <input type="password" name="password" />
            </label>
            <label>
              <span>Confirm Password:</span>
              <input type="password" name="confirmPassword" />
            </label>
          </signup-form>
        </main>
        <p>
          Already have an account? <a href="/app/login">Log in instead</a>
        </p>
      </div>
    `;
  }

  static styles = [
    reset.styles,
    css`
      .signup-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: var(--size-spacing-medium);
        background-color: var(--color-surface);
      }

      h2 {
        font-size: var(--size-type-xlarge);
        color: var(--color-highlight);
        margin-bottom: var(--size-spacing-large);
      }

      .signup-card {
        background-color: var(--color-primary);
        border: 2px solid var(--color-accent);
        border-radius: 10px;
        padding: var(--size-spacing-large);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 300px;
      }

      label {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--size-spacing-medium);
        gap: 8px;
      }

      label span {
        color: var(--color-highlight);
        font-weight: 500;
      }

      input {
        padding: 8px 12px;
        border: 1px solid var(--color-accent);
        border-radius: 4px;
        font-size: var(--size-type-medium);
        background-color: var(--color-surface);
        color: var(--color-highlight);
      }

      input:focus {
        outline: none;
        border-color: var(--color-highlight);
        box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
      }

      p {
        text-align: center;
        margin-top: var(--size-spacing-large);
        color: var(--color-highlight);
      }

      a {
        color: var(--color-accent);
        text-decoration: none;
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }
    `,
  ];
}
