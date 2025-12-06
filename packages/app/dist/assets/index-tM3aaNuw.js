(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var Z,je;class pt extends Error{}pt.prototype.name="InvalidTokenError";function cr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function hr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return cr(t)}catch{return atob(t)}}function us(i,t){if(typeof i!="string")throw new pt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new pt(`Invalid token specified: missing part #${e+1}`);let s;try{s=hr(r)}catch(n){throw new pt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new pt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const ur="mu:context",re=`${ur}:change`;class dr{constructor(t,e){this._proxy=pr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ce extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new dr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(re,t),t}detach(t){this.removeEventListener(re,t)}}function pr(i,t){return new Proxy(i,{get:(r,s,n)=>s==="then"?void 0:Reflect.get(r,s,n),set:(r,s,n,o)=>{const l=i[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(r,s,n,o);if(a){let d=new CustomEvent(re,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function fr(i,t){const e=ds(t,i);return new Promise((r,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function ds(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return ds(i,s.host)}class gr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ps(i="mu:message"){return(t,...e)=>t.dispatchEvent(new gr(e,i))}class he{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[r,...s]=e;this._context.value=r,s.forEach(n=>n.then(o=>{o.length&&this.consume(o)}))}}}const ie="mu:auth:jwt",fs=class gs extends he{constructor(t,e){super((r,s)=>this.update(r,s),t,gs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:s,redirect:n}=t[1];return[vr(s),te(n)]}case"auth/signout":return[yr(e.user),te(this._redirectForLogin)];case"auth/redirect":return[e,te(this._redirectForLogin,{next:window.location.href})];default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};fs.EVENT_TYPE="auth:message";let ms=fs;const vs=ps(ms.EVENT_TYPE);function te(i,t){return new Promise((e,r)=>{if(i){const s=window.location.href,n=new URL(i,s);t&&Object.entries(t).forEach(([o,l])=>n.searchParams.set(o,l)),console.log("Redirecting to ",i),window.location.assign(n)}e([])})}class mr extends ce{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=rt.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ms(this.context,this.redirect).attach(this)}}class st{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ie),t}}class rt extends st{constructor(t){super();const e=us(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new rt(t);return localStorage.setItem(ie,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ie);return t?rt.authenticate(t):new st}}function vr(i){return{user:rt.authenticate(i),token:i}}function yr(i){return{user:i&&i.authenticated?st.deauthenticate(i):i,token:""}}function _r(i){return i&&i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function $r(i){return i.authenticated?us(i.token||""):{}}const S=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:rt,Provider:mr,User:st,dispatch:vs,headers:_r,payload:$r},Symbol.toStringTag,{value:"Module"}));function ys(i,t,e){const r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});i.dispatchEvent(r)}function Lt(i,t,e){const r=i.target;ys(r,t,e)}function ne(i,t="*"){return i.composedPath().find(s=>{const n=s;return n.tagName&&n.matches(t)})||void 0}const br=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:ys,originalTarget:ne,relay:Lt},Symbol.toStringTag,{value:"Module"}));function ue(i,...t){const e=i.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const wr=new DOMParser;function B(i,...t){const e=t.map(l),r=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),s=wr.parseFromString(r,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ie(a);case"bigint":case"boolean":case"number":case"symbol":return Ie(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ie(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Vt(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:n};return r;function s(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function n(...o){e.adoptedStyleSheets=o}}Z=class extends HTMLElement{constructor(){super(),this._state={},Vt(this).template(Z.template).styles(Z.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Lt(i,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var i,t;for(const e of((i=this.submitSlot)==null?void 0:i.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(i){this._state=i||{},xr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}get submitSlot(){var i;const t=(i=this.shadowRoot)==null?void 0:i.querySelector('slot[name="submit"]');return t||null}},Z.template=B`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,Z.styles=ue`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function xr(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;case"date":s instanceof Date?o.value=s.toISOString().substr(0,10):o.value=s;break;default:o.value=s;break}}}return i}const _s=class $s extends he{constructor(t){super((e,r)=>this.update(e,r),t,$s.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];return Er(r,s)}case"history/redirect":{const{href:r,state:s}=t[1];return Sr(r,s)}}}};_s.EVENT_TYPE="history:message";let de=_s;class ze extends ce{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Ar(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(!this._root||r.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),pe(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new de(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function Ar(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function Er(i,t={}){return history.pushState(t,"",i),{location:document.location,state:history.state}}function Sr(i,t={}){return history.replaceState(t,"",i),{location:document.location,state:history.state}}const pe=ps(de.EVENT_TYPE),kr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:ze,Provider:ze,Service:de,dispatch:pe},Symbol.toStringTag,{value:"Module"}));class P{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new He(this._provider,t);this._effects.push(s),e(s)}else fr(this._target,this._contextLabel).then(s=>{const n=new He(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class He{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const bs=class ws extends HTMLElement{constructor(){super(),this._state={},this._user=new st,this._authObserver=new P(this,"blazing:auth"),Vt(this).template(ws.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Pr(s,this._state,e,this.authorization).then(n=>ct(n,this)).then(n=>{const o=`mu-rest-form:${r}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[r]:n,url:s}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ct(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&De(this.src,this.authorization).then(e=>{this._state=e,ct(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&De(this.src,this.authorization).then(s=>{this._state=s,ct(s,this)});break;case"new":r&&(this._state={},ct({},this));break}}};bs.observedAttributes=["src","new","action"];bs.template=B`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function De(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function ct(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return i}function Pr(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const xs=class As extends he{constructor(t,e){super(e,t,As.EVENT_TYPE,!1)}};xs.EVENT_TYPE="mu:message";let Es=xs;class Cr extends ce{constructor(t,e,r){super(e),this._user=new st,this._updateFn=t,this._authObserver=new P(this,r)}connectedCallback(){const t=new Es(this.context,(e,r)=>this._updateFn(e,r,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Or=Object.freeze(Object.defineProperty({__proto__:null,Provider:Cr,Service:Es},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,fe=Rt.ShadowRoot&&(Rt.ShadyCSS===void 0||Rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),qe=new WeakMap;let Ss=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(fe&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&qe.set(e,t))}return t}toString(){return this.cssText}};const Tr=i=>new Ss(typeof i=="string"?i:i+"",void 0,ge),Rr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Ss(e,i,ge)},Nr=(i,t)=>{if(fe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Rt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Be=fe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return Tr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Lr,defineProperty:Mr,getOwnPropertyDescriptor:Ur,getOwnPropertyNames:jr,getOwnPropertySymbols:Ir,getPrototypeOf:zr}=Object,it=globalThis,Ve=it.trustedTypes,Hr=Ve?Ve.emptyScript:"",Fe=it.reactiveElementPolyfillSupport,ft=(i,t)=>i,Mt={toAttribute(i,t){switch(t){case Boolean:i=i?Hr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},me=(i,t)=>!Lr(i,t),We={attribute:!0,type:String,converter:Mt,reflect:!1,useDefault:!1,hasChanged:me};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),it.litPropertyMetadata??(it.litPropertyMetadata=new WeakMap);let Q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=We){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Mr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=Ur(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s?.call(this);n?.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??We}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=zr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,r=[...jr(e),...Ir(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Be(s))}else t!==void 0&&e.push(Be(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Nr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var r;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Mt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var r,s;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const l=n.getPropertyOptions(o),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((r=l.converter)==null?void 0:r.fromAttribute)!==void 0?l.converter:Mt;this._$Em=o,this[o]=a.fromAttribute(e,l.type)??((s=this._$Ej)==null?void 0:s.get(o))??null,this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){const n=this.constructor,o=this[t];if(r??(r=n.getPropertyOptions(t)),!((r.hasChanged??me)(o,e)||r.useDefault&&r.reflect&&o===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(r)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[ft("elementProperties")]=new Map,Q[ft("finalized")]=new Map,Fe?.({ReactiveElement:Q}),(it.reactiveElementVersions??(it.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,jt=Ut.trustedTypes,Ye=jt?jt.createPolicy("lit-html",{createHTML:i=>i}):void 0,ks="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,Ps="?"+L,Dr=`<${Ps}>`,V=document,mt=()=>V.createComment(""),vt=i=>i===null||typeof i!="object"&&typeof i!="function",ve=Array.isArray,qr=i=>ve(i)||typeof i?.[Symbol.iterator]=="function",ee=`[ 	
\f\r]`,ht=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ge=/-->/g,Je=/>/g,z=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ke=/'/g,Ze=/"/g,Cs=/^(?:script|style|textarea|title)$/i,Br=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ut=Br(1),nt=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Xe=new WeakMap,D=V.createTreeWalker(V,129);function Os(i,t){if(!ve(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ye!==void 0?Ye.createHTML(t):t}const Vr=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ht;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ht?f[1]==="!--"?o=Ge:f[1]!==void 0?o=Je:f[2]!==void 0?(Cs.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=z):f[3]!==void 0&&(o=z):o===z?f[0]===">"?(o=s??ht,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?z:f[3]==='"'?Ze:Ke):o===Ze||o===Ke?o=z:o===Ge||o===Je?o=ht:(o=z,s=void 0);const h=o===z&&i[l+1].startsWith("/>")?" ":"";n+=o===ht?a+Dr:u>=0?(r.push(d),a.slice(0,u)+ks+a.slice(u)+L+h):a+L+(u===-2?l:h)}return[Os(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let oe=class Ts{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Vr(t,e);if(this.el=Ts.createElement(d,r),D.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=D.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(ks)){const c=f[o++],h=s.getAttribute(u).split(L),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Wr:p[1]==="?"?Yr:p[1]==="@"?Gr:Ft}),s.removeAttribute(u)}else u.startsWith(L)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Cs.test(s.tagName)){const u=s.textContent.split(L),c=u.length-1;if(c>0){s.textContent=jt?jt.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],mt()),D.nextNode(),a.push({type:2,index:++n});s.append(u[c],mt())}}}else if(s.nodeType===8)if(s.data===Ps)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(L,u+1))!==-1;)a.push({type:7,index:n}),u+=L.length-1}n++}}static createElement(t,e){const r=V.createElement("template");return r.innerHTML=t,r}};function ot(i,t,e=i,r){var s,n;if(t===nt)return t;let o=r!==void 0?(s=e._$Co)==null?void 0:s[r]:e._$Cl;const l=vt(t)?void 0:t._$litDirective$;return o?.constructor!==l&&((n=o?._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=o:e._$Cl=o),o!==void 0&&(t=ot(i,o._$AS(i,t.values),o,r)),t}let Fr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??V).importNode(e,!0);D.currentNode=s;let n=D.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new ye(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Jr(n,this,t)),this._$AV.push(d),a=r[++l]}o!==a?.index&&(n=D.nextNode(),o++)}return D.currentNode=V,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},ye=class Rs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ot(this,t,e),vt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==nt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):qr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=oe.createElement(Os(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(r);else{const o=new Fr(n,this),l=o.u(this.options);o.p(r),this.T(l),this._$AH=o}}_$AC(t){let e=Xe.get(t.strings);return e===void 0&&Xe.set(t.strings,e=new oe(t)),e}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new Rs(this.O(mt()),this.O(mt()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Ft=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=ot(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==nt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=ot(this,l[r+a],e,a),d===nt&&(d=this._$AH[a]),o||(o=!vt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Wr=class extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}},Yr=class extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}},Gr=class extends Ft{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=ot(this,t,e,0)??b)===nt)return;const r=this._$AH,s=t===b&&r!==b||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==b&&(r===b||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Jr=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}};const Qe=Ut.litHtmlPolyfillSupport;Qe?.(oe,ye),(Ut.litHtmlVersions??(Ut.litHtmlVersions=[])).push("3.3.0");const Kr=(i,t,e)=>{const r=e?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const n=e?.renderBefore??null;r._$litPart$=s=new ye(t.insertBefore(mt(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yt=globalThis;let et=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Kr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return nt}};et._$litElement$=!0,et.finalized=!0,(je=yt.litElementHydrateSupport)==null||je.call(yt,{LitElement:et});const ts=yt.litElementPolyfillSupport;ts?.({LitElement:et});(yt.litElementVersions??(yt.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zr={attribute:!0,type:String,converter:Mt,reflect:!1,hasChanged:me},Xr=(i=Zr,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function Ns(i){return(t,e)=>typeof e=="object"?Xr(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ls(i){return Ns({...i,state:!0,attribute:!1})}function Qr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function ti(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ms={};(function(i){var t=(function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},r=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,v,m,_,Jt){var A=_.length-1;switch(m){case 1:return new v.Root({},[_[A-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[_[A-1],_[A]]);break;case 4:case 5:this.$=_[A];break;case 6:this.$=new v.Literal({value:_[A]});break;case 7:this.$=new v.Splat({name:_[A]});break;case 8:this.$=new v.Param({name:_[A]});break;case 9:this.$=new v.Optional({},[_[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(v,m){this.message=v,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],v=[null],m=[],_=this.table,Jt="",A=0,Le=0,nr=2,Me=1,or=m.slice.call(arguments,1),$=Object.create(this.lexer),j={yy:{}};for(var Kt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Kt)&&(j.yy[Kt]=this.yy[Kt]);$.setInput(c,j.yy),j.yy.lexer=$,j.yy.parser=this,typeof $.yylloc>"u"&&($.yylloc={});var Zt=$.yylloc;m.push(Zt);var ar=$.options&&$.options.ranges;typeof j.yy.parseError=="function"?this.parseError=j.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var lr=function(){var K;return K=$.lex()||Me,typeof K!="number"&&(K=h.symbols_[K]||K),K},x,I,k,Xt,J={},Ot,R,Ue,Tt;;){if(I=p[p.length-1],this.defaultActions[I]?k=this.defaultActions[I]:((x===null||typeof x>"u")&&(x=lr()),k=_[I]&&_[I][x]),typeof k>"u"||!k.length||!k[0]){var Qt="";Tt=[];for(Ot in _[I])this.terminals_[Ot]&&Ot>nr&&Tt.push("'"+this.terminals_[Ot]+"'");$.showPosition?Qt="Parse error on line "+(A+1)+`:
`+$.showPosition()+`
Expecting `+Tt.join(", ")+", got '"+(this.terminals_[x]||x)+"'":Qt="Parse error on line "+(A+1)+": Unexpected "+(x==Me?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(Qt,{text:$.match,token:this.terminals_[x]||x,line:$.yylineno,loc:Zt,expected:Tt})}if(k[0]instanceof Array&&k.length>1)throw new Error("Parse Error: multiple actions possible at state: "+I+", token: "+x);switch(k[0]){case 1:p.push(x),v.push($.yytext),m.push($.yylloc),p.push(k[1]),x=null,Le=$.yyleng,Jt=$.yytext,A=$.yylineno,Zt=$.yylloc;break;case 2:if(R=this.productions_[k[1]][1],J.$=v[v.length-R],J._$={first_line:m[m.length-(R||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(R||1)].first_column,last_column:m[m.length-1].last_column},ar&&(J._$.range=[m[m.length-(R||1)].range[0],m[m.length-1].range[1]]),Xt=this.performAction.apply(J,[Jt,Le,A,j.yy,k[1],v,m].concat(or)),typeof Xt<"u")return Xt;R&&(p=p.slice(0,-1*R*2),v=v.slice(0,-1*R),m=m.slice(0,-1*R)),p.push(this.productions_[k[1]][0]),v.push(J.$),m.push(J._$),Ue=_[p[p.length-2]][p[p.length-1]],p.push(Ue);break;case 3:return!0}}return!0}},d=(function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===v.length?this.yylloc.first_column:0)+v[v.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,v,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),v=c[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var _ in m)this[_]=m[_];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,v;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),_=0;_<m.length;_++)if(p=this._input.match(this.rules[m[_]]),p&&(!h||p[0].length>h[0].length)){if(h=p,v=_,this.options.backtrack_lexer){if(c=this.test_match(p,m[_]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[v]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,v,m){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof ti<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Ms);function X(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Us={Root:X("Root"),Concat:X("Concat"),Literal:X("Literal"),Splat:X("Splat"),Param:X("Param"),Optional:X("Optional")},js=Ms.parser;js.yy=Us;var ei=js,si=Object.keys(Us);function ri(i){return si.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Is=ri,ii=Is,ni=/[\-{}\[\]+?.,\\\^$|#\s]/g;function zs(i){this.captures=i.captures,this.re=i.re}zs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var oi=ii({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(ni,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new zs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),ai=oi,li=Is,ci=li({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),hi=ci,ui=ei,di=ai,pi=hi;St.prototype=Object.create(null);St.prototype.match=function(i){var t=di.visit(this.ast),e=t.match(i);return e||!1};St.prototype.reverse=function(i){return pi.visit(this.ast,i)};function St(i){var t;if(this?t=this:t=Object.create(St.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ui.parse(i),t}var fi=St,gi=fi,mi=gi;const vi=Qr(mi);var yi=Object.defineProperty,Hs=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&yi(t,e,s),s};const Ds=class extends et{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>ut` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new vi(s.path)})),this._historyObserver=new P(this,e),this._authObserver=new P(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ut` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(vs(this,"auth/redirect"),ut` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ut` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),ut` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),n=r+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:r,params:l,query:s}}}redirect(t){pe(this,"history/redirect",{href:t})}};Ds.styles=Rr`
    :host,
    main {
      display: contents;
    }
  `;let It=Ds;Hs([Ls()],It.prototype,"_user");Hs([Ls()],It.prototype,"_match");const _i=Object.freeze(Object.defineProperty({__proto__:null,Element:It,Switch:It},Symbol.toStringTag,{value:"Module"})),qs=class ae extends HTMLElement{constructor(){if(super(),Vt(this).template(ae.template).styles(ae.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};qs.template=B` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;qs.styles=ue`
    :host {
      position: relative;
    }
    #is-shown {
      display: none;
    }
    #panel {
      display: none;

      position: absolute;
      right: 0;
      margin-top: var(--size-spacing-small);
      width: max-content;
      padding: var(--size-spacing-small);
      border-radius: var(--size-radius-small);
      background: var(--color-background-card);
      color: var(--color-text);
      box-shadow: var(--shadow-popover);
    }
    :host([open]) #panel {
      display: block;
    }
  `;const Bs=class le extends HTMLElement{constructor(){super(),this._array=[],Vt(this).template(le.template).styles(le.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Vs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{ne(t,"button.add")?Lt(t,"input-array:add"):ne(t,"button.remove")&&Lt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],$i(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};Bs.template=B`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Bs.styles=ue`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function $i(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(Vs(e)))}function Vs(i,t){const e=i===void 0?B`<input />`:B`<input value="${i}" />`;return B`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Fs(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var bi=Object.defineProperty,wi=Object.getOwnPropertyDescriptor,xi=(i,t,e,r)=>{for(var s=wi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&bi(t,e,s),s};class kt extends et{constructor(t){super(),this._pending=[],this._observer=new P(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}xi([Ns()],kt.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt=globalThis,_e=Nt.ShadowRoot&&(Nt.ShadyCSS===void 0||Nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),es=new WeakMap;let Ws=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(_e&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=es.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&es.set(e,t))}return t}toString(){return this.cssText}};const Ai=i=>new Ws(typeof i=="string"?i:i+"",void 0,$e),O=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1]),i[0]);return new Ws(e,i,$e)},Ei=(i,t)=>{if(_e)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const r=document.createElement("style"),s=Nt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},ss=_e?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return Ai(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Si,defineProperty:ki,getOwnPropertyDescriptor:Pi,getOwnPropertyNames:Ci,getOwnPropertySymbols:Oi,getPrototypeOf:Ti}=Object,Wt=globalThis,rs=Wt.trustedTypes,Ri=rs?rs.emptyScript:"",Ni=Wt.reactiveElementPolyfillSupport,gt=(i,t)=>i,zt={toAttribute(i,t){switch(t){case Boolean:i=i?Ri:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},be=(i,t)=>!Si(i,t),is={attribute:!0,type:String,converter:zt,reflect:!1,useDefault:!1,hasChanged:be};Symbol.metadata??=Symbol("metadata"),Wt.litPropertyMetadata??=new WeakMap;let tt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=is){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&ki(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=Pi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s?.call(this);n?.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??is}static _$Ei(){if(this.hasOwnProperty(gt("elementProperties")))return;const t=Ti(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(gt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(gt("properties"))){const e=this.properties,r=[...Ci(e),...Oi(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(ss(s))}else t!==void 0&&e.push(ss(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ei(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const n=(r.converter?.toAttribute!==void 0?r.converter:zt).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=r.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:zt;this._$Em=s;const l=o.fromAttribute(e,n.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){const s=this.constructor,n=this[t];if(r??=s.getPropertyOptions(t),!((r.hasChanged??be)(n,e)||r.useDefault&&r.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[s,n]of r){const{wrapped:o}=n,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((r=>r.hostUpdate?.())),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};tt.elementStyles=[],tt.shadowRootOptions={mode:"open"},tt[gt("elementProperties")]=new Map,tt[gt("finalized")]=new Map,Ni?.({ReactiveElement:tt}),(Wt.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const we=globalThis,Ht=we.trustedTypes,ns=Ht?Ht.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ys="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Gs="?"+M,Li=`<${Gs}>`,F=document,_t=()=>F.createComment(""),$t=i=>i===null||typeof i!="object"&&typeof i!="function",xe=Array.isArray,Mi=i=>xe(i)||typeof i?.[Symbol.iterator]=="function",se=`[ 	
\f\r]`,dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,os=/-->/g,as=/>/g,H=RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ls=/'/g,cs=/"/g,Js=/^(?:script|style|textarea|title)$/i,Ui=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),g=Ui(1),at=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),hs=new WeakMap,q=F.createTreeWalker(F,129);function Ks(i,t){if(!xe(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ns!==void 0?ns.createHTML(t):t}const ji=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=dt;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===dt?f[1]==="!--"?o=os:f[1]!==void 0?o=as:f[2]!==void 0?(Js.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=H):f[3]!==void 0&&(o=H):o===H?f[0]===">"?(o=s??dt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?H:f[3]==='"'?cs:ls):o===cs||o===ls?o=H:o===os||o===as?o=dt:(o=H,s=void 0);const h=o===H&&i[l+1].startsWith("/>")?" ":"";n+=o===dt?a+Li:u>=0?(r.push(d),a.slice(0,u)+Ys+a.slice(u)+M+h):a+M+(u===-2?l:h)}return[Ks(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class bt{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=ji(t,e);if(this.el=bt.createElement(d,r),q.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=q.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Ys)){const c=f[o++],h=s.getAttribute(u).split(M),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?zi:p[1]==="?"?Hi:p[1]==="@"?Di:Yt}),s.removeAttribute(u)}else u.startsWith(M)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Js.test(s.tagName)){const u=s.textContent.split(M),c=u.length-1;if(c>0){s.textContent=Ht?Ht.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],_t()),q.nextNode(),a.push({type:2,index:++n});s.append(u[c],_t())}}}else if(s.nodeType===8)if(s.data===Gs)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(M,u+1))!==-1;)a.push({type:7,index:n}),u+=M.length-1}n++}}static createElement(t,e){const r=F.createElement("template");return r.innerHTML=t,r}}function lt(i,t,e=i,r){if(t===at)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl;const n=$t(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=lt(i,s._$AS(i,t.values),s,r)),t}class Ii{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??F).importNode(e,!0);q.currentNode=s;let n=q.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Pt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new qi(n,this,t)),this._$AV.push(d),a=r[++l]}o!==a?.index&&(n=q.nextNode(),o++)}return q.currentNode=F,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Pt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=lt(this,t,e),$t(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==at&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Mi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&$t(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=bt.createElement(Ks(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{const n=new Ii(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=hs.get(t.strings);return e===void 0&&hs.set(t.strings,e=new bt(t)),e}k(t){xe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new Pt(this.O(_t()),this.O(_t()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Yt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=w}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=lt(this,t,e,0),o=!$t(t)||t!==this._$AH&&t!==at,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=lt(this,l[r+a],e,a),d===at&&(d=this._$AH[a]),o||=!$t(d)||d!==this._$AH[a],d===w?t=w:t!==w&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class zi extends Yt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}}class Hi extends Yt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}}class Di extends Yt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=lt(this,t,e,0)??w)===at)return;const r=this._$AH,s=t===w&&r!==w||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==w&&(r===w||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class qi{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){lt(this,t)}}const Bi=we.litHtmlPolyfillSupport;Bi?.(bt,Pt),(we.litHtmlVersions??=[]).push("3.3.1");const Vi=(i,t,e)=>{const r=e?.renderBefore??t;let s=r._$litPart$;if(s===void 0){const n=e?.renderBefore??null;r._$litPart$=s=new Pt(t.insertBefore(_t(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ae=globalThis;class E extends tt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Vi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return at}}E._$litElement$=!0,E.finalized=!0,Ae.litElementHydrateSupport?.({LitElement:E});const Fi=Ae.litElementPolyfillSupport;Fi?.({LitElement:E});(Ae.litElementVersions??=[]).push("4.2.1");const Wi={};function Yi(i,t,e){const[r,s]=i;switch(r){case"driver/request":return[t,Gi(s,e).then(o=>["driver/response",o])];case"driver/response":return{...t,driver:s};case"drivers/request":return[t,Ji(e).then(o=>["drivers/response",o])];case"drivers/response":return{...t,drivers:s};case"team/request":return[t,Ki(s,e).then(o=>["team/response",o])];case"team/response":return{...t,team:s};case"teams/request":return[t,Zi(e).then(o=>["teams/response",o])];case"teams/response":return{...t,teams:s};case"track/request":return[t,Xi(s,e).then(o=>["track/response",o])];case"track/response":return{...t,track:s};case"tracks/request":return[t,Qi(e).then(o=>["tracks/response",o])];case"tracks/response":return{...t,tracks:s};case"favorites/request":return[t,tn(s,e).then(o=>["favorites/response",o])];case"favorites/response":return{...t,favorites:s};default:const n=r;throw new Error(`Unhandled message "${n}"`)}}function Gi(i,t){return fetch(`/api/drivers/${i.number}`,{headers:S.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e;throw"No JSON in response body"})}function Ji(i){return fetch("/api/cards/category/drivers",{headers:S.headers(i)}).then(t=>t.status===200?t.json():[]).then(t=>t||[])}function Ki(i,t){return fetch(`/api/constructors/${i.teamName}`,{headers:S.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e;throw"No JSON in response body"})}function Zi(i){return fetch("/api/cards/category/constructors",{headers:S.headers(i)}).then(t=>t.status===200?t.json():[]).then(t=>t||[])}function Xi(i,t){return fetch(`/api/tracks/${i.trackName}`,{headers:S.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e;throw"No JSON in response body"})}function Qi(i){return fetch("/api/cards/category/schedule",{headers:S.headers(i)}).then(t=>t.status===200?t.json():[]).then(t=>t||[])}function tn(i,t){return fetch(`/api/profiles/${i.userid}/favorites`,{headers:S.headers(t)}).then(e=>e.status===200?e.json():[]).then(e=>e||[])}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const en={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:be},sn=(i=en,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function y(i){return(t,e)=>typeof e=="object"?sn(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function T(i){return y({...i,state:!0,attribute:!1})}const rn=O`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  body {
    line-height: 1.5;
  }

  img {
    max-width: 100%;
  }

  ul {
    list-style: none;
    padding: 0;
  }
`,N={styles:rn};var nn=Object.defineProperty,Ct=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&nn(t,e,s),s};const ke=class ke extends E{constructor(){super(...arguments),this.loggedIn=!1,this.isFavorited=!1,this._authObserver=new P(this,"lum:auth")}render(){return g`
      <header>
        <div class="title-section">
          <h1><a href="/app">${this.name}</a></h1>
          ${this.identifier?this.renderLikeButton():g``}
        </div>
        <div class="welcome-section">
          <div class="user-profile">
            <svg class="helmet-icon">
              <use href="/icons/utilities.svg#helmet-utility" />
            </svg>
            <div>Hello ${this.userid||"Racer"}</div>
          </div>
          <div class="button-group">
            <label class="switch" onchange="toggleDM(event)">
              <input type="checkbox" autocomplete="off" id="theme-toggle" />
              <svg class="icon">
                <use href="/icons/utilities.svg#light-mode-utility" />
              </svg>
              <span class="slider"></span>
            </label>
            ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
          </div>
        </div>
      </header>
    `}renderSignOutButton(){return g`
      <button
        class="sign-btn"
        @click=${t=>{br.relay(t,"auth:message",["auth/signout"]),setTimeout(()=>location.reload(),500)}}
      >
        Sign Out
      </button>
    `}renderSignInButton(){return g`
      <button class="sign-btn" onclick="location.href='/app/login';">
        Sign In
      </button>
    `}renderLikeButton(){return g`
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
    `}get authorization(){return this._user?S.headers(this._user):{}}async handleLikeClick(t){const e=t.target,r=e.checked;if(!this.userid||!this.identifier)return;const s=r?`/api/profiles/${this.userid}/favorites/${this.identifier}`:`/api/profiles/${this.userid}/favorites/${this.identifier}`,n=r?"POST":"DELETE";try{(await fetch(s,{method:n,headers:this.authorization})).ok?this.isFavorited=r:(e.checked=!r,this.isFavorited=!r)}catch(o){console.error("Error updating favorite:",o),e.checked=!r,this.isFavorited=!r}}async checkIfFavorited(t){if(this.identifier)try{const e=await fetch(`/api/profiles/${t}/favorites`,{headers:this.authorization});if(e.ok){const r=await e.json();this.isFavorited=r.some(s=>s._id===this.identifier)}}catch(e){console.error("Error checking favorites:",e)}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;this._user=e,e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username,this.identifier&&this.checkIfFavorited(e.username)):(this.loggedIn=!1,this.userid=void 0)})}updated(){const t=this.shadowRoot?.querySelector("#theme-toggle"),e=localStorage.getItem("darkMode")==="true";t&&(t.checked=e)}};ke.styles=[N.styles,O`
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
    `];let U=ke;Ct([y()],U.prototype,"name");Ct([y()],U.prototype,"identifier");Ct([T()],U.prototype,"loggedIn");Ct([T()],U.prototype,"userid");Ct([T()],U.prototype,"isFavorited");var on=Object.defineProperty,G=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&on(t,e,s),s};const Pe=class Pe extends E{getHrefWithCardId(){if(!this.href)return"";const t=this.href.includes("?")?"&":"?";return this.cardId?`${this.href}${t}cardId=${this.cardId}`:this.href}render(){return this.backgroundImg?g`
        <div class="card" style="background-image: url(${this.backgroundImg});">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
        </div>
      `:this.img?g`
        <div class="card">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
          <img src="${this.img}" />
        </div>
      `:this.icon?g`
        <div class="card">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
          <svg class="icon"><use href="${this.icon}" /></svg>
        </div>
      `:g`
        <div class="card">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
        </div>
      `}};Pe.styles=[N.styles,O`
      .card {
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

      .card > a {
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

      .card > svg {
        position: absolute;
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        fill: var(--color-highlight);
        opacity: 0.5;
        z-index: 0;
      }

      .card:has(svg, img) > :not(svg, img) {
        position: relative;
        z-index: 1;
      }

      .card > img {
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

      .card:has(img) > a {
        padding: 1px;
      }
    `];let C=Pe;G([y()],C.prototype,"backgroundImg");G([y()],C.prototype,"img");G([y()],C.prototype,"icon");G([y()],C.prototype,"href");G([y()],C.prototype,"label");G([y()],C.prototype,"category");G([y()],C.prototype,"cardId");var an=Object.defineProperty,Ee=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&an(t,e,s),s};const qt=class qt extends E{constructor(){super(...arguments),this._cards=[],this._authObserver=new P(this,"lum:auth")}render(){const e=[...this.cards??this._cards].sort((s,n)=>s.orderNumber-n.orderNumber);function r(s){return s.backImg?g`
          <card-element
            href="${s.link}"
            label="${s.label}"
            backgroundImg="${s.backImg}"
            cardId="${s._id}"
          ></card-element>
        `:s.img?g`
          <card-element
            href="${s.link}"
            label="${s.label}"
            img="${s.img}"
            cardId="${s._id}"
          ></card-element>
        `:s.icon?g`
          <card-element
            href="${s.link}"
            label="${s.label}"
            icon="${s.icon}"
            cardId="${s._id}"
          ></card-element>
        `:g`
          <card-element
            href="${s.link}"
            label="${s.label}"
            cardId="${s._id}"
          ></card-element>
        `}return g`
      <article class="grid">
        <main>${e.map(r)}</main>
      </article>
    `}get authorization(){return this._user?S.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,!this.cards&&this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this._cards=e)})}};qt.uses=Fs({"card-element":C}),qt.styles=[N.styles,O`
      :host {
        display: contents;
      }

      card-element {
        display: block;
      }

      .grid {
        --box-size: 150px;
        --page-grid-gap: var(--size-spacing-medium);

        display: grid;
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--box-size), var(--box-size))
        );
        justify-content: center;
        padding: var(--page-grid-gap);
        gap: var(--page-grid-gap);
        align-items: start;
      }

      .grid > main {
        display: contents;
      }
    `];let W=qt;Ee([y()],W.prototype,"src");Ee([y({attribute:!1})],W.prototype,"cards");Ee([T()],W.prototype,"_cards");var ln=Object.defineProperty,cn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&ln(t,e,s),s};const Bt=class Bt extends E{constructor(){super(...arguments),this._authObserver=new P(this,"lum:auth")}render(){return this.userid?g`
      <deck-element src="/api/profiles/${this.userid}/favorites"></deck-element>
    `:g`<p>Loading favorites...</p>`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?this.userid=e.username:this.userid=void 0})}};Bt.uses={"deck-element":W},Bt.styles=[N.styles,O`
      :host {
        display: contents;
      }
    `];let Dt=Bt;cn([T()],Dt.prototype,"userid");var hn=Object.defineProperty,Zs=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&hn(t,e,s),s};const Ce=class Ce extends E{constructor(){super(...arguments),this.data=null,this._authObserver=new P(this,"lum:auth")}render(){if(!this.data)return g`<p>Loading driver data...</p>`;const t=this.data;return g`
      <article>
        <figure>
          <img src="${t.imageSrc}" alt="Driver Portrait" />
        </figure>
        <main>
          <h2>Bio</h2>
          <p>${t.bio}</p>
          <h2>Standings</h2>
          <ul>
            <li><strong>Current Team:</strong> ${t.standings.team}</li>
            <li><strong>Points:</strong> ${t.standings.points}</li>
            <li><strong>Position:</strong> ${t.standings.position}</li>
          </ul>
          <h2>Stats</h2>
          <ul>
            <li>
              <strong>Grand Prix Entered:</strong> ${t.stats.grandPrixEntered}
            </li>
            <li><strong>Career Points:</strong> ${t.stats.careerPoints}</li>
            <li>
              <strong>Highest Race Finish:</strong> ${t.stats.highestRaceFinish}
            </li>
            <li><strong>Podiums:</strong> ${t.stats.podiums}</li>
            <li>
              <strong>Highest Grid Position:</strong> ${t.stats.highestGridPosition}
            </li>
            <li><strong>Pole Positions:</strong> ${t.stats.polePositions}</li>
            <li>
              <strong>World Championships:</strong> ${t.stats.worldChampionships}
            </li>
            <li><strong>DNFs:</strong> ${t.stats.dnfs}</li>
          </ul>
        </main>
        <div class="number">
          <svg class="top">
            <use href="/icons/designs.svg#racing-lines-top-design" />
          </svg>
          <p>${t.number}</p>
          <svg class="bot">
            <use href="/icons/designs.svg#racing-lines-bot-design" />
          </svg>
        </div>
      </article>
    `}get authorization(){return this._user?S.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.data=e)})}};Ce.styles=[N.styles,O`
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
    `];let wt=Ce;Zs([y()],wt.prototype,"src");Zs([T()],wt.prototype,"data");var un=Object.defineProperty,Xs=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&un(t,e,s),s};const Oe=class Oe extends E{constructor(){super(...arguments),this.data=null,this._authObserver=new P(this,"lum:auth")}render(){if(!this.data)return g`<p>Loading team data...</p>`;const t=this.data;return g`
      <article>
        <figure>
          <img
            src="${t.imageSrc}"
            alt="Sideprofile of team car facing right."
            width="400"
          />
        </figure>
        <main>
          <h2>Ranking:</h2>
          <ul>
            <li>WCC Position: ${t.ranking.wccPosition}</li>
            <li>Current Points: ${t.ranking.currentPoints}</li>
          </ul>
          <h2>Drivers</h2>
          <ul>
            ${t.drivers.map(e=>g`
                <li>
                  ${e.name}
                  <ul>
                    <li>Car Number: ${e.carNumber}</li>
                    <li>Joined Team: ${e.joinedTeam}</li>
                  </ul>
                </li>
              `)}
          </ul>
        </main>
      </article>
    `}get authorization(){return this._user?S.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.data=e)})}};Oe.styles=[N.styles,O`
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
    `];let xt=Oe;Xs([y()],xt.prototype,"src");Xs([T()],xt.prototype,"data");var dn=Object.defineProperty,Qs=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&dn(t,e,s),s};const Te=class Te extends E{constructor(){super(...arguments),this.data=null,this._authObserver=new P(this,"lum:auth")}render(){if(!this.data)return g`<p>Loading track data...</p>`;const t=this.data;return g`
      <article>
        <h2>${t.cityName}</h2>
        <main>
          <div>
            <h2>Details:</h2>
            <ul>
              <li>DRS Zones: ${t.drsZones}</li>
              <li>Turns: ${t.turns}</li>
              <li>
                Tire Compounds Available:
                <ol>
                  ${t.tireCompounds.map(e=>g`<li>${e}</li>`)}
                </ol>
              </li>
              <li>First GP: ${t.firstGP}</li>
              <li>Circuit Length: ${t.circuitLen}</li>
              <li>Number of laps: ${t.numLaps}</li>
              <li>Race Distance: ${t.raceDistance}</li>
              <li>
                Lap Record:
                <ul class="indented">
                  <li>${t.lapRecord.time}</li>
                  <li>${t.lapRecord.driver} (${t.lapRecord.year})</li>
                </ul>
              </li>
            </ul>
          </div>
          <figure>
            <img src="${t.figure.src}" alt="Circuit Image" width="400" />
            <figcaption>${t.figure.caption}</figcaption>
          </figure>
        </main>
      </article>
    `}get authorization(){return this._user?S.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.data=e)})}};Te.styles=[N.styles,O`
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
    `];let At=Te;Qs([y()],At.prototype,"src");Qs([T()],At.prototype,"data");var pn=Object.defineProperty,Gt=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&pn(t,e,s),s};const Re=class Re extends E{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}handleChange(t){const e=t.target,r=e?.name,s=e?.value,n=this.formData;switch(r){case"username":this.formData={...n,username:s};break;case"password":this.formData={...n,password:s};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this?.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:r}=e,s=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:r,redirect:this.redirect}]});console.log("dispatching message",s),this.dispatchEvent(s)}).catch(e=>{console.log(e),this.error=e.toString()})}render(){return g`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}};Re.styles=[N.styles,O`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let Y=Re;Gt([T()],Y.prototype,"formData");Gt([y()],Y.prototype,"api");Gt([y()],Y.prototype,"redirect");Gt([T()],Y.prototype,"error");var fn=Object.defineProperty,tr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&fn(t,e,s),s};const Ne=class Ne extends E{constructor(){super(...arguments),this.api="/auth/login",this.redirect="/app"}connectedCallback(){super.connectedCallback(),customElements.get("login-form")||customElements.define("login-form",Y)}render(){return g`
      <div class="login-container">
        <h2>User Login</h2>
        <main class="login-card">
          <login-form api="${this.api}" redirect="${this.redirect}">
            <label>
              <span>Username:</span>
              <input name="username" autocomplete="off" />
            </label>
            <label>
              <span>Password:</span>
              <input type="password" name="password" />
            </label>
          </login-form>
        </main>
        <p>
          Or did you want to <a href="/app/signup">Sign up as a new user</a>?
        </p>
      </div>
    `}};Ne.styles=[N.styles,O`
      .login-container {
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

      .login-card {
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
    `];let Et=Ne;tr([y()],Et.prototype,"api");tr([y()],Et.prototype,"redirect");var gn=Object.defineProperty,mn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&gn(t,e,s),s};class er extends kt{constructor(){super("lum:model"),this.loaded=!1}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["drivers/request",{}])}render(){const t=this.model?.drivers??[];return g`
      <header-element name="Drivers"></header-element>
      <deck-element .cards=${t}></deck-element>
    `}}mn([y({type:Boolean})],er.prototype,"loaded");var vn=Object.defineProperty,yn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&vn(t,e,s),s};class sr extends kt{constructor(){super("lum:model"),this.loaded=!1}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["teams/request",{}])}render(){const t=this.model?.teams??[];return g`
      <header-element name="Constructors"></header-element>
      <deck-element .cards=${t}></deck-element>
    `}}yn([y({type:Boolean})],sr.prototype,"loaded");var _n=Object.defineProperty,$n=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&_n(t,e,s),s};class rr extends kt{constructor(){super("lum:model"),this.loaded=!1}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["tracks/request",{}])}render(){const t=this.model?.tracks??[];return g`
      <header-element name="Schedule"></header-element>
      <deck-element .cards=${t}></deck-element>
    `}}$n([y({type:Boolean})],rr.prototype,"loaded");var bn=Object.defineProperty,ir=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&bn(t,e,s),s};class Se extends kt{constructor(){super("lum:model"),this.loaded=!1}connectedCallback(){super.connectedCallback(),new P(this,"lum:auth").observe(e=>{this.user=e.user,this.user?.username&&this.dispatchMessage(["favorites/request",{userid:this.user.username}])})}render(){const t=this.model?.favorites??[];return g`
      <header-element name="Favorites"></header-element>
      <deck-element .cards=${t}></deck-element>
    `}}ir([y({type:Boolean})],Se.prototype,"loaded");ir([y({type:Object})],Se.prototype,"user");const wn={"A Albon":23,"A Alonso":14,"K Antonelli":12,"O Bearman":50,"G Bortoleto":5,"F Colapinto":43,"P Gasly":10,"I Hadjar":39,"L Hamilton":44,"N Hulkenberg":27,"L Lawson":30,"C Leclerc":16,"L Norris":4,"E Ocon":31,"O Piastri":81,"G Russel":63,"C Sainz":55,"L Stroll":18,"Y Tsunoda":22,"M Verstappen":1},xn=[{path:"/app/login",view:()=>g`<login-element></login-element>`},{path:"/app/schedule",view:()=>g`<tracks-view></tracks-view>`},{path:"/app/constructors",view:()=>g`<teams-view></teams-view>`},{path:"/app/drivers",view:()=>g`<drivers-view></drivers-view>`},{path:"/app/favorites",view:()=>g`<favorites-view></favorites-view>`},{path:"/app/schedule/:label",view:(i,t)=>g`
      <header-element name="${i.label}" identifier="${t?.get("cardId")}"></header-element>
      <track-element src="/api/tracks/${i.label}"></track-element>
    `},{path:"/app/constructors/:label",view:(i,t)=>g`
      <header-element name="${i.label}" identifier="${t?.get("cardId")}"></header-element>
      <team-element src="/api/constructors/${i.label}"></team-element>
    `},{path:"/app/drivers/:label",view:(i,t)=>g`
      <header-element name="${i.label}" identifier="${t?.get("cardId")}"></header-element>
      <driver-element src="/api/drivers/${wn[i.label]}"></driver-element>
    `},{path:"/app",view:()=>g`
        <header-element name="Luminance"></header-element>
        <deck-element src="/api/cards/category/mainPages"></deck-element>`},{path:"/",redirect:"/app"}];Fs({"mu-auth":S.Provider,"mu-history":kr.Provider,"mu-switch":class extends _i.Element{constructor(){super(xn,"lum:history","lum:auth")}},"mu-store":class extends Or.Provider{constructor(){super(Yi,Wi,"lum:auth")}},"card-element":C,"deck-element":W,"driver-element":wt,"favorites-element":Dt,"header-element":U,"login-element":Et,"drivers-view":er,"teams-view":sr,"tracks-view":rr,"favorites-view":Se,"team-element":xt,"track-element":At});
