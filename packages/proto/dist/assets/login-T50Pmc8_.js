import{i as m,x as p,r as l,a as f,b as u,n as d,d as b,c as g}from"./reset.css-DFjQgTct.js";var v=Object.defineProperty,i=(h,r,t,o)=>{for(var e=void 0,a=h.length-1,c;a>=0;a--)(c=h[a])&&(e=c(r,t,e)||e);return e&&v(r,t,e),e};const n=class n extends m{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}handleChange(r){const t=r.target,o=t?.name,e=t?.value,a=this.formData;switch(o){case"username":this.formData={...a,username:e};break;case"password":this.formData={...a,password:e};break}}handleSubmit(r){r.preventDefault(),this.canSubmit&&fetch(this?.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==200)throw"Login failed";return t.json()}).then(t=>{const{token:o}=t,e=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:o,redirect:this.redirect}]});console.log("dispatching message",e),this.dispatchEvent(e)}).catch(t=>{console.log(t),this.error=t.toString()})}render(){return p`
      <form
        @change=${r=>this.handleChange(r)}
        @submit=${r=>this.handleSubmit(r)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}};n.styles=[l.styles,f`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let s=n;i([u()],s.prototype,"formData");i([d()],s.prototype,"api");i([d()],s.prototype,"redirect");i([u()],s.prototype,"error");b({"mu-auth":g.Provider,"login-form":s});
