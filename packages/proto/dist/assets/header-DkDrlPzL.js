import{i as h,O as g,x as s,r as p,a as u,e as f,n as v,b as d}from"./reset.css-DFjQgTct.js";var b=Object.defineProperty,n=(l,e,t,x)=>{for(var i=void 0,o=l.length-1,c;o>=0;o--)(c=l[o])&&(i=c(e,t,i)||i);return i&&b(e,t,i),i};const a=class a extends h{constructor(){super(...arguments),this.loggedIn=!1,this._authObserver=new g(this,"blazing:auth")}render(){return s`
      <header>
        <h1><a href="./index.html">${this.name}</a></h1>
        <div class="welcome-section">
          <div class="user-profile">
            <svg class="helmet-icon">
              <use href="./icons/utilities.svg#helmet-utility" />
            </svg>
            <div>Hello ${this.userid||"Racer"}</div>
          </div>
          <div class="button-group">
            <label class="switch" onchange="toggleDM(event)">
              <input type="checkbox" autocomplete="off" id="theme-toggle" />
              <svg class="icon">
                <use href="./icons/utilities.svg#light-mode-utility" />
              </svg>
              <span class="slider"></span>
            </label>
            ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
          </div>
        </div>
      </header>
    `}renderSignOutButton(){return s`
      <button
        class="sign-btn"
        @click=${e=>{f.relay(e,"auth:message",["auth/signout"]),setTimeout(()=>location.reload(),500)}}
      >
        Sign Out
      </button>
    `}renderSignInButton(){return s`
      <button class="sign-btn" onclick="location.href='/login.html';">
        Sign In
      </button>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{const{user:t}=e;t&&t.authenticated?(this.loggedIn=!0,this.userid=t.username):(this.loggedIn=!1,this.userid=void 0)})}updated(){const e=this.shadowRoot?.querySelector("#theme-toggle"),t=localStorage.getItem("darkMode")==="true";e&&(e.checked=t)}};a.styles=[p.styles,u`
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

      header h1 {
        font-size: var(--size-type-xxlarge);
      }

      header h1 a {
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
    `];let r=a;n([v()],r.prototype,"name");n([d()],r.prototype,"loggedIn");n([d()],r.prototype,"userid");export{r as H};
