(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();var Q,Je;class yt extends Error{}yt.prototype.name="InvalidTokenError";function gs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function vs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return gs(t)}catch{return atob(t)}}function _r(i,t){if(typeof i!="string")throw new yt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new yt(`Invalid token specified: missing part #${e+1}`);let r;try{r=vs(s)}catch(o){throw new yt(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(r)}catch(o){throw new yt(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const ys="mu:context",he=`${ys}:change`;class bs{constructor(t,e){this._proxy=$s(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ge extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new bs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(he,t),t}detach(t){this.removeEventListener(he,t)}}function $s(i,t){return new Proxy(i,{get:(s,r,o)=>r==="then"?void 0:Reflect.get(s,r,o),set:(s,r,o,n)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,o);const a=Reflect.set(s,r,o,n);if(a){let u=new CustomEvent(he,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:r,oldValue:l,value:o}),t.dispatchEvent(u)}else console.log(`Context['${r}] was not set to ${o}`);return a}})}function _s(i,t){const e=xr(t,i);return new Promise((s,r)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function xr(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return xr(i,r.host)}class xs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function wr(i="mu:message"){return(t,...e)=>t.dispatchEvent(new xs(e,i))}class ve{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[s,...r]=e;this._context.value=s,r.forEach(o=>o.then(n=>{n.length&&this.consume(n)}))}}}const de="mu:auth:jwt",Ar=class Er extends ve{constructor(t,e){super((s,r)=>this.update(s,r),t,Er.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:r,redirect:o}=t[1];return[As(r),ae(o)]}case"auth/signout":return[Es(e.user),ae(this._redirectForLogin)];case"auth/redirect":return[e,ae(this._redirectForLogin,{next:window.location.href})];default:const s=t[0];throw new Error(`Unhandled Auth message "${s}"`)}}};Ar.EVENT_TYPE="auth:message";let kr=Ar;const Sr=wr(kr.EVENT_TYPE);function ae(i,t){return new Promise((e,s)=>{if(i){const r=window.location.href,o=new URL(i,r);t&&Object.entries(t).forEach(([n,l])=>o.searchParams.set(n,l)),console.log("Redirecting to ",i),window.location.assign(o)}e([])})}class ws extends ge{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=ot.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new kr(this.context,this.redirect).attach(this)}}class it{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(de),t}}class ot extends it{constructor(t){super();const e=_r(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new ot(t);return localStorage.setItem(de,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(de);return t?ot.authenticate(t):new it}}function As(i){return{user:ot.authenticate(i),token:i}}function Es(i){return{user:i&&i.authenticated?it.deauthenticate(i):i,token:""}}function ks(i){return i&&i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function Ss(i){return i.authenticated?_r(i.token||""):{}}const w=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:ot,Provider:ws,User:it,dispatch:Sr,headers:ks,payload:Ss},Symbol.toStringTag,{value:"Module"}));function Pr(i,t,e){const s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});i.dispatchEvent(s)}function Lt(i,t,e){const s=i.target;Pr(s,t,e)}function ue(i,t="*"){return i.composedPath().find(r=>{const o=r;return o.tagName&&o.matches(t)})||void 0}const Ps=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:Pr,originalTarget:ue,relay:Lt},Symbol.toStringTag,{value:"Module"}));function ye(i,...t){const e=i.map((r,o)=>o?[t[o-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const Cs=new DOMParser;function B(i,...t){const e=t.map(l),s=i.map((a,u)=>{if(u===0)return[a];const f=e[u-1];return f instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[f,a]}).flat().join(""),r=Cs.parseFromString(s,"text/html"),o=r.head.childElementCount?r.head.children:r.body.children,n=new DocumentFragment;return n.replaceChildren(...o),e.forEach((a,u)=>{if(a instanceof Node){const f=n.querySelector(`ins#mu-html-${u}`);if(f){const d=f.parentNode;d?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),n;function l(a,u){if(a===null)return"";switch(typeof a){case"string":return Ye(a);case"bigint":case"boolean":case"number":case"symbol":return Ye(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,d=a.map(l);return f.replaceChildren(...d),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ye(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Gt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:o};return s;function r(n){const l=n.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function o(...n){e.adoptedStyleSheets=n}}let Os=(Q=class extends HTMLElement{constructor(){super(),this._state={},Gt(this).template(Q.template).styles(Q.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Lt(i,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var i,t;for(const e of((i=this.submitSlot)==null?void 0:i.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(i){this._state=i||{},Ts(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}get submitSlot(){var i;const t=(i=this.shadowRoot)==null?void 0:i.querySelector('slot[name="submit"]');return t||null}},Q.template=B`
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
  `,Q.styles=ye`
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
  `,Q);function Ts(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;case"date":r instanceof Date?n.value=r.toISOString().substr(0,10):n.value=r;break;default:n.value=r;break}}}return i}const be=Object.freeze(Object.defineProperty({__proto__:null,Element:Os},Symbol.toStringTag,{value:"Module"})),Cr=class Or extends ve{constructor(t){super((e,s)=>this.update(e,s),t,Or.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];return Ns(s,r)}case"history/redirect":{const{href:s,state:r}=t[1];return js(s,r)}}}};Cr.EVENT_TYPE="history:message";let $e=Cr;class Ze extends ge{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=zs(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(!this._root||s.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),_e(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new $e(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function zs(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Ns(i,t={}){return history.pushState(t,"",i),{location:document.location,state:history.state}}function js(i,t={}){return history.replaceState(t,"",i),{location:document.location,state:history.state}}const _e=wr($e.EVENT_TYPE),Ms=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ze,Provider:Ze,Service:$e,dispatch:_e},Symbol.toStringTag,{value:"Module"}));class A{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Ge(this._provider,t);this._effects.push(r),e(r)}else _s(this._target,this._contextLabel).then(r=>{const o=new Ge(r,t);this._provider=r,this._effects.push(o),r.attach(n=>this._handleChange(n)),e(o)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ge{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Tr=class zr extends HTMLElement{constructor(){super(),this._state={},this._user=new it,this._authObserver=new A(this,"blazing:auth"),Gt(this).template(zr.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Rs(r,this._state,e,this.authorization).then(o=>ft(o,this)).then(o=>{const n=`mu-rest-form:${s}`,l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:o,url:r}});this.dispatchEvent(l)}).catch(o=>{const n="mu-rest-form:error",l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ft(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ke(this.src,this.authorization).then(e=>{this._state=e,ft(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ke(this.src,this.authorization).then(r=>{this._state=r,ft(r,this)});break;case"new":s&&(this._state={},ft({},this));break}}};Tr.observedAttributes=["src","new","action"];Tr.template=B`
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
  `;function Ke(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function ft(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;default:n.value=r;break}}}return i}function Rs(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Nr=class jr extends ve{constructor(t,e){super(e,t,jr.EVENT_TYPE,!1)}};Nr.EVENT_TYPE="mu:message";let Mr=Nr;class Ls extends ge{constructor(t,e,s){super(e),this._user=new it,this._updateFn=t,this._authObserver=new A(this,s)}connectedCallback(){const t=new Mr(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Us=Object.freeze(Object.defineProperty({__proto__:null,Provider:Ls,Service:Mr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=globalThis,xe=Mt.ShadowRoot&&(Mt.ShadyCSS===void 0||Mt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,we=Symbol(),Xe=new WeakMap;let Rr=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==we)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(xe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Xe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Xe.set(e,t))}return t}toString(){return this.cssText}};const Is=i=>new Rr(typeof i=="string"?i:i+"",void 0,we),Ds=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new Rr(e,i,we)},Hs=(i,t)=>{if(xe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Mt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Qe=xe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Is(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:qs,defineProperty:Vs,getOwnPropertyDescriptor:Bs,getOwnPropertyNames:Fs,getOwnPropertySymbols:Ws,getPrototypeOf:Js}=Object,nt=globalThis,tr=nt.trustedTypes,Ys=tr?tr.emptyScript:"",er=nt.reactiveElementPolyfillSupport,bt=(i,t)=>i,Ut={toAttribute(i,t){switch(t){case Boolean:i=i?Ys:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ae=(i,t)=>!qs(i,t),rr={attribute:!0,type:String,converter:Ut,reflect:!1,useDefault:!1,hasChanged:Ae};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),nt.litPropertyMetadata??(nt.litPropertyMetadata=new WeakMap);let et=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=rr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Vs(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=Bs(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const l=r?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??rr}static _$Ei(){if(this.hasOwnProperty(bt("elementProperties")))return;const t=Js(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(bt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bt("properties"))){const e=this.properties,s=[...Fs(e),...Ws(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Qe(r))}else t!==void 0&&e.push(Qe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Hs(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var s;const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Ut).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var s,r;const o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const l=o.getPropertyOptions(n),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((s=l.converter)==null?void 0:s.fromAttribute)!==void 0?l.converter:Ut;this._$Em=n,this[n]=a.fromAttribute(e,l.type)??((r=this._$Ej)==null?void 0:r.get(n))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const o=this.constructor,n=this[t];if(s??(s=o.getPropertyOptions(t)),!((s.hasChanged??Ae)(n,e)||s.useDefault&&s.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r){const{wrapped:l}=n,a=this[o];l!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(s)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};et.elementStyles=[],et.shadowRootOptions={mode:"open"},et[bt("elementProperties")]=new Map,et[bt("finalized")]=new Map,er?.({ReactiveElement:et}),(nt.reactiveElementVersions??(nt.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=globalThis,Dt=It.trustedTypes,sr=Dt?Dt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Lr="$lit$",j=`lit$${Math.random().toFixed(9).slice(2)}$`,Ur="?"+j,Zs=`<${Ur}>`,F=document,_t=()=>F.createComment(""),xt=i=>i===null||typeof i!="object"&&typeof i!="function",Ee=Array.isArray,Gs=i=>Ee(i)||typeof i?.[Symbol.iterator]=="function",le=`[ 	
\f\r]`,mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ir=/-->/g,or=/>/g,D=RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),nr=/'/g,ar=/"/g,Ir=/^(?:script|style|textarea|title)$/i,Ks=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),gt=Ks(1),at=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),lr=new WeakMap,q=F.createTreeWalker(F,129);function Dr(i,t){if(!Ee(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return sr!==void 0?sr.createHTML(t):t}const Xs=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=mt;for(let l=0;l<e;l++){const a=i[l];let u,f,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,f=n.exec(a),f!==null);)c=n.lastIndex,n===mt?f[1]==="!--"?n=ir:f[1]!==void 0?n=or:f[2]!==void 0?(Ir.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=D):f[3]!==void 0&&(n=D):n===D?f[0]===">"?(n=r??mt,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,u=f[1],n=f[3]===void 0?D:f[3]==='"'?ar:nr):n===ar||n===nr?n=D:n===ir||n===or?n=mt:(n=D,r=void 0);const h=n===D&&i[l+1].startsWith("/>")?" ":"";o+=n===mt?a+Zs:d>=0?(s.push(u),a.slice(0,d)+Lr+a.slice(d)+j+h):a+j+(d===-2?l:h)}return[Dr(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let pe=class Hr{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[u,f]=Xs(t,e);if(this.el=Hr.createElement(u,s),q.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=q.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Lr)){const c=f[n++],h=r.getAttribute(d).split(j),m=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:m[2],strings:h,ctor:m[1]==="."?ti:m[1]==="?"?ei:m[1]==="@"?ri:Kt}),r.removeAttribute(d)}else d.startsWith(j)&&(a.push({type:6,index:o}),r.removeAttribute(d));if(Ir.test(r.tagName)){const d=r.textContent.split(j),c=d.length-1;if(c>0){r.textContent=Dt?Dt.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],_t()),q.nextNode(),a.push({type:2,index:++o});r.append(d[c],_t())}}}else if(r.nodeType===8)if(r.data===Ur)a.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(j,d+1))!==-1;)a.push({type:7,index:o}),d+=j.length-1}o++}}static createElement(t,e){const s=F.createElement("template");return s.innerHTML=t,s}};function lt(i,t,e=i,s){var r,o;if(t===at)return t;let n=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=xt(t)?void 0:t._$litDirective$;return n?.constructor!==l&&((o=n?._$AO)==null||o.call(n,!1),l===void 0?n=void 0:(n=new l(i),n._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=n:e._$Cl=n),n!==void 0&&(t=lt(i,n._$AS(i,t.values),n,s)),t}let Qs=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??F).importNode(e,!0);q.currentNode=r;let o=q.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new ke(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new si(o,this,t)),this._$AV.push(u),a=s[++l]}n!==a?.index&&(o=q.nextNode(),n++)}return q.currentNode=F,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},ke=class qr{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=lt(this,t,e),xt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==at&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Gs(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&xt(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=pe.createElement(Dr(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(s);else{const n=new Qs(o,this),l=n.u(this.options);n.p(s),this.T(l),this._$AH=n}}_$AC(t){let e=lr.get(t.strings);return e===void 0&&lr.set(t.strings,e=new pe(t)),e}k(t){Ee(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new qr(this.O(_t()),this.O(_t()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Kt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=lt(this,t,e,0),n=!xt(t)||t!==this._$AH&&t!==at,n&&(this._$AH=t);else{const l=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=lt(this,l[s+a],e,a),u===at&&(u=this._$AH[a]),n||(n=!xt(u)||u!==this._$AH[a]),u===_?t=_:t!==_&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ti=class extends Kt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},ei=class extends Kt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},ri=class extends Kt{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=lt(this,t,e,0)??_)===at)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},si=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){lt(this,t)}};const cr=It.litHtmlPolyfillSupport;cr?.(pe,ke),(It.litHtmlVersions??(It.litHtmlVersions=[])).push("3.3.0");const ii=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const o=e?.renderBefore??null;s._$litPart$=r=new ke(t.insertBefore(_t(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis;let st=class extends et{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ii(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return at}};st._$litElement$=!0,st.finalized=!0,(Je=wt.litElementHydrateSupport)==null||Je.call(wt,{LitElement:st});const hr=wt.litElementPolyfillSupport;hr?.({LitElement:st});(wt.litElementVersions??(wt.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oi={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:Ae},ni=(i=oi,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function Vr(i){return(t,e)=>typeof e=="object"?ni(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Br(i){return Vr({...i,state:!0,attribute:!1})}function ai(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function li(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Fr={};(function(i){var t=(function(){var e=function(d,c,h,m){for(h=h||{},m=d.length;m--;h[d[m]]=c);return h},s=[1,9],r=[1,10],o=[1,11],n=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,m,v,g,b,re){var S=b.length-1;switch(g){case 1:return new v.Root({},[b[S-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[b[S-1],b[S]]);break;case 4:case 5:this.$=b[S];break;case 6:this.$=new v.Literal({value:b[S]});break;case 7:this.$=new v.Splat({name:b[S]});break;case 8:this.$=new v.Param({name:b[S]});break;case 9:this.$=new v.Optional({},[b[S-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:o,15:n},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let m=function(v,g){this.message=v,this.hash=g};throw m.prototype=Error,new m(c,h)}},parse:function(c){var h=this,m=[0],v=[null],g=[],b=this.table,re="",S=0,Be=0,us=2,Fe=1,ps=g.slice.call(arguments,1),$=Object.create(this.lexer),U={yy:{}};for(var se in this.yy)Object.prototype.hasOwnProperty.call(this.yy,se)&&(U.yy[se]=this.yy[se]);$.setInput(c,U.yy),U.yy.lexer=$,U.yy.parser=this,typeof $.yylloc>"u"&&($.yylloc={});var ie=$.yylloc;g.push(ie);var fs=$.options&&$.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ms=function(){var X;return X=$.lex()||Fe,typeof X!="number"&&(X=h.symbols_[X]||X),X},k,I,P,oe,K={},Nt,N,We,jt;;){if(I=m[m.length-1],this.defaultActions[I]?P=this.defaultActions[I]:((k===null||typeof k>"u")&&(k=ms()),P=b[I]&&b[I][k]),typeof P>"u"||!P.length||!P[0]){var ne="";jt=[];for(Nt in b[I])this.terminals_[Nt]&&Nt>us&&jt.push("'"+this.terminals_[Nt]+"'");$.showPosition?ne="Parse error on line "+(S+1)+`:
`+$.showPosition()+`
Expecting `+jt.join(", ")+", got '"+(this.terminals_[k]||k)+"'":ne="Parse error on line "+(S+1)+": Unexpected "+(k==Fe?"end of input":"'"+(this.terminals_[k]||k)+"'"),this.parseError(ne,{text:$.match,token:this.terminals_[k]||k,line:$.yylineno,loc:ie,expected:jt})}if(P[0]instanceof Array&&P.length>1)throw new Error("Parse Error: multiple actions possible at state: "+I+", token: "+k);switch(P[0]){case 1:m.push(k),v.push($.yytext),g.push($.yylloc),m.push(P[1]),k=null,Be=$.yyleng,re=$.yytext,S=$.yylineno,ie=$.yylloc;break;case 2:if(N=this.productions_[P[1]][1],K.$=v[v.length-N],K._$={first_line:g[g.length-(N||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(N||1)].first_column,last_column:g[g.length-1].last_column},fs&&(K._$.range=[g[g.length-(N||1)].range[0],g[g.length-1].range[1]]),oe=this.performAction.apply(K,[re,Be,S,U.yy,P[1],v,g].concat(ps)),typeof oe<"u")return oe;N&&(m=m.slice(0,-1*N*2),v=v.slice(0,-1*N),g=g.slice(0,-1*N)),m.push(this.productions_[P[1]][0]),v.push(K.$),g.push(K._$),We=b[m[m.length-2]][m[m.length-1]],m.push(We);break;case 3:return!0}}return!0}},u=(function(){var d={EOF:1,parseError:function(h,m){if(this.yy.parser)this.yy.parser.parseError(h,m);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,m=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),m.length-1&&(this.yylineno-=m.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:m?(m.length===v.length?this.yylloc.first_column:0)+v[v.length-m.length].length-m[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var m,v,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),v=c[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],m=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),m)return m;if(this._backtrack){for(var b in g)this[b]=g[b];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,m,v;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),b=0;b<g.length;b++)if(m=this._input.match(this.rules[g[b]]),m&&(!h||m[0].length>h[0].length)){if(h=m,v=b,this.options.backtrack_lexer){if(c=this.test_match(m,g[b]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[v]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,m,v,g){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d})();a.lexer=u;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof li<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Fr);function tt(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Wr={Root:tt("Root"),Concat:tt("Concat"),Literal:tt("Literal"),Splat:tt("Splat"),Param:tt("Param"),Optional:tt("Optional")},Jr=Fr.parser;Jr.yy=Wr;var ci=Jr,hi=Object.keys(Wr);function di(i){return hi.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Yr=di,ui=Yr,pi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Zr(i){this.captures=i.captures,this.re=i.re}Zr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var fi=ui({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(pi,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Zr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),mi=fi,gi=Yr,vi=gi({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),yi=vi,bi=ci,$i=mi,_i=yi;Ct.prototype=Object.create(null);Ct.prototype.match=function(i){var t=$i.visit(this.ast),e=t.match(i);return e||!1};Ct.prototype.reverse=function(i){return _i.visit(this.ast,i)};function Ct(i){var t;if(this?t=this:t=Object.create(Ct.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=bi.parse(i),t}var xi=Ct,wi=xi,Ai=wi;const Ei=ai(Ai);var ki=Object.defineProperty,Gr=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&ki(t,e,r),r};const Kr=class extends st{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>gt` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new Ei(r.path)})),this._historyObserver=new A(this,e),this._authObserver=new A(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),gt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Sr(this,"auth/redirect"),gt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):gt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),gt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),o=s+e;for(const n of this._cases){const l=n.route.match(o);if(l)return{...n,path:s,params:l,query:r}}}redirect(t){_e(this,"history/redirect",{href:t})}};Kr.styles=Ds`
    :host,
    main {
      display: contents;
    }
  `;let Ht=Kr;Gr([Br()],Ht.prototype,"_user");Gr([Br()],Ht.prototype,"_match");const Si=Object.freeze(Object.defineProperty({__proto__:null,Element:Ht,Switch:Ht},Symbol.toStringTag,{value:"Module"})),Xr=class fe extends HTMLElement{constructor(){if(super(),Gt(this).template(fe.template).styles(fe.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Xr.template=B` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;Xr.styles=ye`
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
  `;const Qr=class me extends HTMLElement{constructor(){super(),this._array=[],Gt(this).template(me.template).styles(me.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(ts("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ue(t,"button.add")?Lt(t,"input-array:add"):ue(t,"button.remove")&&Lt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Pi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Qr.template=B`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Qr.styles=ye`
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
  `;function Pi(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(ts(e)))}function ts(i,t){const e=i===void 0?B`<input />`:B`<input value="${i}" />`;return B`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Ot(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ci=Object.defineProperty,Oi=Object.getOwnPropertyDescriptor,Ti=(i,t,e,s)=>{for(var r=Oi(t,e),o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Ci(t,e,r),r};class L extends st{constructor(t){super(),this._pending=[],this._observer=new A(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Ti([Vr()],L.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,Se=Rt.ShadowRoot&&(Rt.ShadyCSS===void 0||Rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pe=Symbol(),dr=new WeakMap;let es=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Se&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=dr.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&dr.set(e,t))}return t}toString(){return this.cssText}};const zi=i=>new es(typeof i=="string"?i:i+"",void 0,Pe),O=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1]),i[0]);return new es(e,i,Pe)},Ni=(i,t)=>{if(Se)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const s=document.createElement("style"),r=Rt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},ur=Se?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return zi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ji,defineProperty:Mi,getOwnPropertyDescriptor:Ri,getOwnPropertyNames:Li,getOwnPropertySymbols:Ui,getPrototypeOf:Ii}=Object,Xt=globalThis,pr=Xt.trustedTypes,Di=pr?pr.emptyScript:"",Hi=Xt.reactiveElementPolyfillSupport,$t=(i,t)=>i,qt={toAttribute(i,t){switch(t){case Boolean:i=i?Di:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ce=(i,t)=>!ji(i,t),fr={attribute:!0,type:String,converter:qt,reflect:!1,useDefault:!1,hasChanged:Ce};Symbol.metadata??=Symbol("metadata"),Xt.litPropertyMetadata??=new WeakMap;let rt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=fr){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Mi(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=Ri(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const l=r?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??fr}static _$Ei(){if(this.hasOwnProperty($t("elementProperties")))return;const t=Ii(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($t("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($t("properties"))){const e=this.properties,s=[...Li(e),...Ui(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(ur(r))}else t!==void 0&&e.push(ur(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ni(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(s.converter?.toAttribute!==void 0?s.converter:qt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:qt;this._$Em=r;const l=n.fromAttribute(e,o.type);this[r]=l??this._$Ej?.get(r)??l,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){const r=this.constructor,o=this[t];if(s??=r.getPropertyOptions(t),!((s.hasChanged??Ce)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,o]of s){const{wrapped:n}=o,l=this[r];n!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((s=>s.hostUpdate?.())),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};rt.elementStyles=[],rt.shadowRootOptions={mode:"open"},rt[$t("elementProperties")]=new Map,rt[$t("finalized")]=new Map,Hi?.({ReactiveElement:rt}),(Xt.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oe=globalThis,Vt=Oe.trustedTypes,mr=Vt?Vt.createPolicy("lit-html",{createHTML:i=>i}):void 0,rs="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,ss="?"+M,qi=`<${ss}>`,W=document,At=()=>W.createComment(""),Et=i=>i===null||typeof i!="object"&&typeof i!="function",Te=Array.isArray,Vi=i=>Te(i)||typeof i?.[Symbol.iterator]=="function",ce=`[ 	
\f\r]`,vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,gr=/-->/g,vr=/>/g,H=RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yr=/'/g,br=/"/g,is=/^(?:script|style|textarea|title)$/i,Bi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),p=Bi(1),ct=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),$r=new WeakMap,V=W.createTreeWalker(W,129);function os(i,t){if(!Te(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return mr!==void 0?mr.createHTML(t):t}const Fi=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=vt;for(let l=0;l<e;l++){const a=i[l];let u,f,d=-1,c=0;for(;c<a.length&&(n.lastIndex=c,f=n.exec(a),f!==null);)c=n.lastIndex,n===vt?f[1]==="!--"?n=gr:f[1]!==void 0?n=vr:f[2]!==void 0?(is.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=H):f[3]!==void 0&&(n=H):n===H?f[0]===">"?(n=r??vt,d=-1):f[1]===void 0?d=-2:(d=n.lastIndex-f[2].length,u=f[1],n=f[3]===void 0?H:f[3]==='"'?br:yr):n===br||n===yr?n=H:n===gr||n===vr?n=vt:(n=H,r=void 0);const h=n===H&&i[l+1].startsWith("/>")?" ":"";o+=n===vt?a+qi:d>=0?(s.push(u),a.slice(0,d)+rs+a.slice(d)+M+h):a+M+(d===-2?l:h)}return[os(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class kt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[u,f]=Fi(t,e);if(this.el=kt.createElement(u,s),V.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=V.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(rs)){const c=f[n++],h=r.getAttribute(d).split(M),m=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:m[2],strings:h,ctor:m[1]==="."?Ji:m[1]==="?"?Yi:m[1]==="@"?Zi:Qt}),r.removeAttribute(d)}else d.startsWith(M)&&(a.push({type:6,index:o}),r.removeAttribute(d));if(is.test(r.tagName)){const d=r.textContent.split(M),c=d.length-1;if(c>0){r.textContent=Vt?Vt.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],At()),V.nextNode(),a.push({type:2,index:++o});r.append(d[c],At())}}}else if(r.nodeType===8)if(r.data===ss)a.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(M,d+1))!==-1;)a.push({type:7,index:o}),d+=M.length-1}o++}}static createElement(t,e){const s=W.createElement("template");return s.innerHTML=t,s}}function ht(i,t,e=i,s){if(t===ct)return t;let r=s!==void 0?e._$Co?.[s]:e._$Cl;const o=Et(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??=[])[s]=r:e._$Cl=r),r!==void 0&&(t=ht(i,r._$AS(i,t.values),r,s)),t}class Wi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??W).importNode(e,!0);V.currentNode=r;let o=V.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new Tt(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new Gi(o,this,t)),this._$AV.push(u),a=s[++l]}n!==a?.index&&(o=V.nextNode(),n++)}return V.currentNode=W,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ht(this,t,e),Et(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==ct&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Vi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&Et(this._$AH)?this._$AA.nextSibling.data=t:this.T(W.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=kt.createElement(os(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const o=new Wi(r,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=$r.get(t.strings);return e===void 0&&$r.set(t.strings,e=new kt(t)),e}k(t){Te(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new Tt(this.O(At()),this.O(At()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Qt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=x}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=ht(this,t,e,0),n=!Et(t)||t!==this._$AH&&t!==ct,n&&(this._$AH=t);else{const l=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=ht(this,l[s+a],e,a),u===ct&&(u=this._$AH[a]),n||=!Et(u)||u!==this._$AH[a],u===x?t=x:t!==x&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!r&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ji extends Qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}}class Yi extends Qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}}class Zi extends Qt{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=ht(this,t,e,0)??x)===ct)return;const s=this._$AH,r=t===x&&s!==x||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==x&&(s===x||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Gi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ht(this,t)}}const Ki=Oe.litHtmlPolyfillSupport;Ki?.(kt,Tt),(Oe.litHtmlVersions??=[]).push("3.3.1");const Xi=(i,t,e)=>{const s=e?.renderBefore??t;let r=s._$litPart$;if(r===void 0){const o=e?.renderBefore??null;s._$litPart$=r=new Tt(t.insertBefore(At(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ze=globalThis;class C extends rt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Xi(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ct}}C._$litElement$=!0,C.finalized=!0,ze.litElementHydrateSupport?.({LitElement:C});const Qi=ze.litElementPolyfillSupport;Qi?.({LitElement:C});(ze.litElementVersions??=[]).push("4.2.1");const to={};function eo(i,t,e){const[s,r]=i;switch(s){case"driver/request":return[t,ro(r,e).then(n=>["driver/response",n])];case"driver/response":return{...t,driver:r};case"driver/update":return[t,so(r,e).then(n=>["driver/response",n])];case"drivers/request":return[t,io(e).then(n=>["drivers/response",n])];case"drivers/response":return{...t,drivers:r};case"team/request":return[t,oo(r,e).then(n=>["team/response",n])];case"team/response":return{...t,team:r};case"team/update":return[t,no(r,e).then(n=>["team/response",n])];case"teams/request":return[t,ao(e).then(n=>["teams/response",n])];case"teams/response":return{...t,teams:r};case"track/request":return[t,lo(r,e).then(n=>["track/response",n])];case"track/response":return{...t,track:r};case"track/update":return[t,co(r,e).then(n=>["track/response",n])];case"tracks/request":return[t,ho(e).then(n=>["tracks/response",n])];case"tracks/response":return{...t,tracks:r};case"favorites/request":return[t,uo(r,e).then(n=>["favorites/response",n])];case"favorites/response":return{...t,favorites:r};default:const o=s;throw new Error(`Unhandled message "${o}"`)}}function ro(i,t){return fetch(`/api/drivers/${i.number}`,{headers:w.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e;throw"No JSON in response body"})}function so(i,t){return fetch(`/api/drivers/${i.number}`,{method:"PUT",headers:{"Content-Type":"application/json",...w.headers(t)},body:JSON.stringify(i.data)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e;throw"No JSON in response body"})}function io(i){return fetch("/api/cards/category/drivers",{headers:w.headers(i)}).then(t=>t.status===200?t.json():[]).then(t=>t||[])}function oo(i,t){return fetch(`/api/constructors/${i.teamName}`,{headers:w.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e;throw"No JSON in response body"})}function no(i,t){return fetch(`/api/constructors/${i.teamName}`,{method:"PUT",headers:{"Content-Type":"application/json",...w.headers(t)},body:JSON.stringify(i.data)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e;throw"No JSON in response body"})}function ao(i){return fetch("/api/cards/category/constructors",{headers:w.headers(i)}).then(t=>t.status===200?t.json():[]).then(t=>t||[])}function lo(i,t){return fetch(`/api/tracks/${i.trackName}`,{headers:w.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e;throw"No JSON in response body"})}function co(i,t){return fetch(`/api/tracks/${i.trackName}`,{method:"PUT",headers:{"Content-Type":"application/json",...w.headers(t)},body:JSON.stringify(i.data)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e;throw"No JSON in response body"})}function ho(i){return fetch("/api/cards/category/schedule",{headers:w.headers(i)}).then(t=>t.status===200?t.json():[]).then(t=>t||[])}function uo(i,t){return fetch(`/api/profiles/${i.userid}/favorites`,{headers:w.headers(t)}).then(e=>e.status===200?e.json():[]).then(e=>e||[])}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const po={attribute:!0,type:String,converter:qt,reflect:!1,hasChanged:Ce},fo=(i=po,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function y(i){return(t,e)=>typeof e=="object"?fo(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function E(i){return y({...i,state:!0,attribute:!1})}const mo=O`
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
`,z={styles:mo};var go=Object.defineProperty,zt=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&go(t,e,r),r};const Ue=class Ue extends C{constructor(){super(...arguments),this.loggedIn=!1,this.isFavorited=!1,this._authObserver=new A(this,"lum:auth")}render(){return p`
      <header>
        <div class="title-section">
          <h1><a href="/app">${this.name}</a></h1>
          ${this.identifier?this.renderLikeButton():p``}
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
    `}renderSignOutButton(){return p`
      <button
        class="sign-btn"
        @click=${t=>{Ps.relay(t,"auth:message",["auth/signout"]),setTimeout(()=>location.reload(),500)}}
      >
        Sign Out
      </button>
    `}renderSignInButton(){return p`
      <button class="sign-btn" onclick="location.href='/app/login';">
        Sign In
      </button>
    `}renderLikeButton(){return p`
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
    `}get authorization(){return this._user?w.headers(this._user):{}}async handleLikeClick(t){const e=t.target,s=e.checked;if(!this.userid||!this.identifier)return;const r=s?`/api/profiles/${this.userid}/favorites/${this.identifier}`:`/api/profiles/${this.userid}/favorites/${this.identifier}`,o=s?"POST":"DELETE";try{(await fetch(r,{method:o,headers:this.authorization})).ok?this.isFavorited=s:(e.checked=!s,this.isFavorited=!s)}catch(n){console.error("Error updating favorite:",n),e.checked=!s,this.isFavorited=!s}}async checkIfFavorited(t){if(this.identifier)try{const e=await fetch(`/api/profiles/${t}/favorites`,{headers:this.authorization});if(e.ok){const s=await e.json();this.isFavorited=s.some(r=>r._id===this.identifier)}}catch(e){console.error("Error checking favorites:",e)}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;this._user=e,e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username,this.identifier&&this.checkIfFavorited(e.username)):(this.loggedIn=!1,this.userid=void 0)})}updated(){const t=this.shadowRoot?.querySelector("#theme-toggle"),e=localStorage.getItem("darkMode")==="true";t&&(t.checked=e)}};Ue.styles=[z.styles,O`
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
    `];let R=Ue;zt([y()],R.prototype,"name");zt([y()],R.prototype,"identifier");zt([E()],R.prototype,"loggedIn");zt([E()],R.prototype,"userid");zt([E()],R.prototype,"isFavorited");var vo=Object.defineProperty,G=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&vo(t,e,r),r};const Ie=class Ie extends C{getHrefWithCardId(){if(!this.href)return"";const t=this.href.includes("?")?"&":"?";return this.cardId?`${this.href}${t}cardId=${this.cardId}`:this.href}render(){return this.backgroundImg?p`
        <div class="card" style="background-image: url(${this.backgroundImg});">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
        </div>
      `:this.img?p`
        <div class="card">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
          <img src="${this.img}" />
        </div>
      `:this.icon?p`
        <div class="card">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
          <svg class="icon"><use href="${this.icon}" /></svg>
        </div>
      `:p`
        <div class="card">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
        </div>
      `}};Ie.styles=[z.styles,O`
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
    `];let T=Ie;G([y()],T.prototype,"backgroundImg");G([y()],T.prototype,"img");G([y()],T.prototype,"icon");G([y()],T.prototype,"href");G([y()],T.prototype,"label");G([y()],T.prototype,"category");G([y()],T.prototype,"cardId");var yo=Object.defineProperty,Ne=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&yo(t,e,r),r};const Ft=class Ft extends C{constructor(){super(...arguments),this._cards=[],this._authObserver=new A(this,"lum:auth")}render(){const e=[...this.cards??this._cards].sort((r,o)=>r.orderNumber-o.orderNumber);function s(r){return r.backImg?p`
          <card-element
            href="${r.link}"
            label="${r.label}"
            backgroundImg="${r.backImg}"
            cardId="${r._id}"
          ></card-element>
        `:r.img?p`
          <card-element
            href="${r.link}"
            label="${r.label}"
            img="${r.img}"
            cardId="${r._id}"
          ></card-element>
        `:r.icon?p`
          <card-element
            href="${r.link}"
            label="${r.label}"
            icon="${r.icon}"
            cardId="${r._id}"
          ></card-element>
        `:p`
          <card-element
            href="${r.link}"
            label="${r.label}"
            cardId="${r._id}"
          ></card-element>
        `}return p`
      <article class="grid">
        <main>${e.map(s)}</main>
      </article>
    `}get authorization(){return this._user?w.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,!this.cards&&this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this._cards=e)})}};Ft.uses=Ot({"card-element":T}),Ft.styles=[z.styles,O`
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
    `];let J=Ft;Ne([y()],J.prototype,"src");Ne([y({attribute:!1})],J.prototype,"cards");Ne([E()],J.prototype,"_cards");var bo=Object.defineProperty,$o=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&bo(t,e,r),r};const Wt=class Wt extends C{constructor(){super(...arguments),this._authObserver=new A(this,"lum:auth")}render(){return this.userid?p`
      <deck-element src="/api/profiles/${this.userid}/favorites"></deck-element>
    `:p`<p>Loading favorites...</p>`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?this.userid=e.username:this.userid=void 0})}};Wt.uses={"deck-element":J},Wt.styles=[z.styles,O`
      :host {
        display: contents;
      }
    `];let Bt=Wt;$o([E()],Bt.prototype,"userid");var _o=Object.defineProperty,je=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&_o(t,e,r),r};const Jt=class Jt extends L{constructor(){super("lum:model"),this.data=null,this.showEditModal=!1,this._modelObserver=new A(this,"lum:model"),this._authObserver=new A(this,"lum:auth"),this.handleSubmit=t=>{const e=t.detail,s=this.data?.number,r=this.reconstructDriver(e);this.dispatchMessage(["driver/update",{number:s,data:r}]),this.showEditModal=!1}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)}),this._modelObserver.observe(t=>{t.driver&&(this.data=t.driver)})}render(){if(!this.data)return p`<p>Loading driver data...</p>`;const t=this.data;return p`
      <article>
        <figure>
          <img src="${t.imageSrc}" alt="Driver Portrait" />
        </figure>
        <main>
          <h2>Bio</h2>
          <p>${t.bio}</p>
          <h2>Standings</h2>
          <ul>
            <li><strong>Current Team:</strong> ${t.team}</li>
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
      <footer>
        <div class="footer-brand">Luminance™</div>
        <button class="sign-btn" @click="${()=>this.showEditModal=!0}">Edit</button>
      </footer>
      ${this.showEditModal?this.renderEditModal():null}
    `}renderEditModal(){const t=this.data;if(!t)return null;const e=(s,r,o="")=>{const n=o?`${o}.${s}`:s;if(typeof r=="object"&&r!==null)return p`
          <fieldset>
            <h3>${this.formatLabel(s)}</h3>
            ${Object.entries(r).map(([l,a])=>e(l,a,n))}
          </fieldset>
        `;{const l=typeof r=="number"?"number":"text",a=r===0?"0":r||"";return p`
          <label>
            <span>${this.formatLabel(s)}</span>
            <input 
              type="${l}" 
              name="${n}"
              value="${a}"
            />
          </label>
        `}};return p`
      <div class="modal-overlay" @click="${()=>this.showEditModal=!1}">
        <div class="modal" @click="${s=>s.stopPropagation()}">
          <div class="modal-header">
            <h2>Edit Driver</h2>
            <button
              class="close-btn"
              @click="${()=>this.showEditModal=!1}"
            >
              ✕
            </button>
          </div>
          <div class="modal-content">
            <mu-form
              .init=${t}
              @mu-form:submit=${this.handleSubmit}>
              ${Object.entries(t).map(([s,r])=>s==="imageSrc"||s==="name"||s==="_id"?null:e(s,r))}
            </mu-form>
          </div>
        </div>
      </div>
    `}formatLabel(t){return t.replace(/([A-Z])/g," $1").replace(/_/g," ").split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" ")}reconstructDriver(t){const e={...this.data};return Object.entries(t).forEach(([s,r])=>{const o=s.split("-");let n=e;for(let l=0;l<o.length-1;l++){const a=o[l];n[a]||(n[a]={}),n=n[a]}n[o[o.length-1]]=r}),e}get authorization(){return this._user?w.headers(this._user):{}}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.data=e)})}};Jt.uses=Ot({"mu-form":be.Element}),Jt.styles=[z.styles,O`
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
    `];let dt=Jt;je([y()],dt.prototype,"src");je([E()],dt.prototype,"data");je([E()],dt.prototype,"showEditModal");var xo=Object.defineProperty,Me=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&xo(t,e,r),r};const Yt=class Yt extends L{constructor(){super("lum:model"),this.data=null,this.showEditModal=!1,this._modelObserver=new A(this,"lum:model"),this._authObserver=new A(this,"lum:auth"),this.handleSubmit=t=>{const e=t.detail,s=this.data?.teamName,r=this.reconstructTeam(e);this.dispatchMessage(["team/update",{teamName:s,data:r}]),this.showEditModal=!1}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)}),this._modelObserver.observe(t=>{t.team&&(this.data=t.team)})}render(){if(!this.data)return p`<p>Loading team data...</p>`;const t=this.data;return p`
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
            ${t.drivers.map(e=>p`
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
      <footer>
        <div class="footer-brand">Luminance™</div>
        <button class="sign-btn" @click="${()=>this.showEditModal=!0}">Edit</button>
      </footer>
      ${this.showEditModal?this.renderEditModal():null}
    `}get authorization(){return this._user?w.headers(this._user):{}}renderEditModal(){const t=this.data;if(!t)return null;const e=(s,r,o="")=>{const n=o?`${o}.${s}`:s;if(typeof r=="object"&&r!==null&&!Array.isArray(r))return p`
          <fieldset>
            <h3>${this.formatLabel(s)}</h3>
            ${Object.entries(r).map(([l,a])=>e(l,a,n))}
          </fieldset>
        `;if(Array.isArray(r))return null;{const l=typeof r=="number"?"number":"text",a=r===0?"0":r||"";return p`
          <label>
            <span>${this.formatLabel(s)}</span>
            <input 
              type="${l}" 
              name="${n}"
              value="${a}"
            />
          </label>
        `}};return p`
      <div class="modal-overlay" @click="${()=>this.showEditModal=!1}">
        <div class="modal" @click="${s=>s.stopPropagation()}">
          <div class="modal-header">
            <h2>Edit Team</h2>
            <button
              class="close-btn"
              @click="${()=>this.showEditModal=!1}"
            >
              ✕
            </button>
          </div>
          <div class="modal-content">
            <mu-form
              .init=${t}
              @mu-form:submit=${this.handleSubmit}>
              ${Object.entries(t).map(([s,r])=>s==="imageSrc"||s==="_id"?null:s==="drivers"&&Array.isArray(r)?p`
                    <fieldset>
                      <h3>Drivers</h3>
                      ${r.map((o,n)=>p`
                        <fieldset style="border: 1px solid var(--color-accent); margin-bottom: 1rem;">
                          <h3>Driver ${n+1}: ${o.name}</h3>
                          <label>
                            <span>Car Number</span>
                            <input 
                              type="number" 
                              name="drivers[${n}].carNumber"
                              value="${o.carNumber}"
                            />
                          </label>
                          <label>
                            <span>Name</span>
                            <input 
                              type="text" 
                              name="drivers[${n}].name"
                              value="${o.name}"
                            />
                          </label>
                          <label>
                            <span>Joined Team</span>
                            <input 
                              type="text" 
                              name="drivers[${n}].joinedTeam"
                              value="${o.joinedTeam}"
                            />
                          </label>
                        </fieldset>
                      `)}
                    </fieldset>
                  `:e(s,r))}
            </mu-form>
          </div>
        </div>
      </div>
    `}formatLabel(t){return t.replace(/([A-Z])/g," $1").replace(/_/g," ").split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" ")}reconstructTeam(t){const e=JSON.parse(JSON.stringify(this.data));return Object.entries(t).forEach(([s,r])=>{const o=s.match(/^drivers\[(\d+)\]\.(\w+)$/);if(o){const[,a,u]=o,f=parseInt(a,10);e.drivers&&e.drivers[f]&&(e.drivers[f][u]=r);return}const n=s.split(".");let l=e;for(let a=0;a<n.length-1;a++){const u=n[a];l[u]||(l[u]={}),l=l[u]}l[n[n.length-1]]=r}),e}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.data=e)})}};Yt.uses=Ot({"mu-form":be.Element}),Yt.styles=[z.styles,O`
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      article > figure {
        background: var(--color-background);
        border: 2px solid var(--color-accent);
        border-radius: 6px;
        max-width: 50%;
        margin-inline: auto;
        margin-top: 2rem;
        margin-bottom: 70px;
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
    `];let ut=Yt;Me([y()],ut.prototype,"src");Me([E()],ut.prototype,"data");Me([E()],ut.prototype,"showEditModal");var wo=Object.defineProperty,Re=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&wo(t,e,r),r};const Zt=class Zt extends L{constructor(){super("lum:model"),this.data=null,this.showEditModal=!1,this._modelObserver=new A(this,"lum:model"),this._authObserver=new A(this,"lum:auth"),this.handleSubmit=t=>{const e=t.detail,s=this.data?.trackName,r=this.reconstructTrack(e);this.dispatchMessage(["track/update",{trackName:s,data:r}]),this.showEditModal=!1}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)}),this._modelObserver.observe(t=>{t.track&&(this.data=t.track)})}render(){if(!this.data)return p`<p>Loading track data...</p>`;const t=this.data;return p`
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
                  ${t.tireCompounds.map(e=>p`<li>${e}</li>`)}
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
      <footer>
        <div class="footer-brand">Luminance™</div>
        <button class="sign-btn" @click="${()=>this.showEditModal=!0}">Edit</button>
      </footer>
      ${this.showEditModal?this.renderEditModal():null}
    `}get authorization(){return this._user?w.headers(this._user):{}}renderEditModal(){const t=this.data;if(!t)return null;const e=(s,r,o="")=>{const n=o?`${o}.${s}`:s;if(typeof r=="object"&&r!==null&&!Array.isArray(r))return p`
          <fieldset>
            <h3>${this.formatLabel(s)}</h3>
            ${Object.entries(r).map(([l,a])=>e(l,a,n))}
          </fieldset>
        `;if(Array.isArray(r)){const l=r.join(", ");return p`
          <label>
            <span>${this.formatLabel(s)} <strong>(comma-separated)</strong></span>
            <input 
              type="text" 
              name="${n}"
              value="${l}"
              placeholder="Enter values separated by commas (e.g., Soft, Medium, Hard)"
            />
          </label>
        `}else{const l=typeof r=="number"?"number":"text",a=r===0?"0":r||"";return p`
          <label>
            <span>${this.formatLabel(s)}</span>
            <input 
              type="${l}" 
              name="${n}"
              value="${a}"
            />
          </label>
        `}};return p`
      <div class="modal-overlay" @click="${()=>this.showEditModal=!1}">
        <div class="modal" @click="${s=>s.stopPropagation()}">
          <div class="modal-header">
            <h2>Edit Track</h2>
            <button
              class="close-btn"
              @click="${()=>this.showEditModal=!1}"
            >
              ✕
            </button>
          </div>
          <div class="modal-content">
            <mu-form
              .init=${t}
              @mu-form:submit=${this.handleSubmit}>
              ${Object.entries(t).map(([s,r])=>s==="imageSrc"||s==="name"||s==="trackName"||s==="figure"||s==="_id"?null:e(s,r))}
            </mu-form>
          </div>
        </div>
      </div>
    `}formatLabel(t){return t.replace(/([A-Z])/g," $1").replace(/_/g," ").split(" ").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" ")}reconstructTrack(t){const e={...this.data};return Object.entries(t).forEach(([s,r])=>{const o=s.split("-");let n=e;for(let a=0;a<o.length-1;a++){const u=o[a];n[u]||(n[u]={}),n=n[u]}const l=o[o.length-1];Array.isArray(this.data[o[0]])||o.length===1&&Array.isArray(this.data[s])?n[l]=String(r).split(",").map(a=>a.trim()):typeof this.data[s]=="number"?n[l]=isNaN(Number(r))?r:Number(r):n[l]=r}),e}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.data=e)})}};Zt.uses=Ot({"mu-form":be.Element}),Zt.styles=[z.styles,O`
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
    `];let pt=Zt;Re([y()],pt.prototype,"src");Re([E()],pt.prototype,"data");Re([E()],pt.prototype,"showEditModal");var Ao=Object.defineProperty,te=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Ao(t,e,r),r};const De=class De extends C{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}handleChange(t){const e=t.target,s=e?.name,r=e?.value,o=this.formData;switch(s){case"username":this.formData={...o,username:r};break;case"password":this.formData={...o,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this?.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}render(){return p`
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
    `}};De.styles=[z.styles,O`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let Y=De;te([E()],Y.prototype,"formData");te([y()],Y.prototype,"api");te([y()],Y.prototype,"redirect");te([E()],Y.prototype,"error");var Eo=Object.defineProperty,ns=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Eo(t,e,r),r};const He=class He extends C{constructor(){super(...arguments),this.api="/auth/login",this.redirect="/app"}connectedCallback(){super.connectedCallback(),customElements.get("login-form")||customElements.define("login-form",Y)}render(){return p`
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
    `}};He.styles=[z.styles,O`
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
    `];let St=He;ns([y()],St.prototype,"api");ns([y()],St.prototype,"redirect");var ko=Object.defineProperty,ee=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&ko(t,e,r),r};const qe=class qe extends C{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password&&this.formData.confirmPassword&&this.formData.password===this.formData.confirmPassword)}handleChange(t){const e=t.target,s=e?.name,r=e?.value,o=this.formData;switch(s){case"username":this.formData={...o,username:r};break;case"password":this.formData={...o,password:r};break;case"confirmPassword":this.formData={...o,confirmPassword:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this?.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.formData.username,password:this.formData.password})}).then(e=>{if(e.status!==201)throw"Signup failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}render(){return p`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Sign Up</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}};qe.styles=[z.styles,O`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let Z=qe;ee([E()],Z.prototype,"formData");ee([y()],Z.prototype,"api");ee([y()],Z.prototype,"redirect");ee([E()],Z.prototype,"error");var So=Object.defineProperty,as=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&So(t,e,r),r};const Ve=class Ve extends C{constructor(){super(...arguments),this.api="/auth/register",this.redirect="/app"}connectedCallback(){super.connectedCallback(),customElements.get("signup-form")||customElements.define("signup-form",Z)}render(){return p`
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
    `}};Ve.styles=[z.styles,O`
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
    `];let Pt=Ve;as([y()],Pt.prototype,"api");as([y()],Pt.prototype,"redirect");var Po=Object.defineProperty,Co=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Po(t,e,r),r};class ls extends L{constructor(){super("lum:model"),this.loaded=!1}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["drivers/request",{}])}render(){const t=this.model?.drivers??[];return p`
      <header-element name="Drivers"></header-element>
      <deck-element .cards=${t}></deck-element>
    `}}Co([y({type:Boolean})],ls.prototype,"loaded");var Oo=Object.defineProperty,To=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Oo(t,e,r),r};class cs extends L{constructor(){super("lum:model"),this.loaded=!1}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["teams/request",{}])}render(){const t=this.model?.teams??[];return p`
      <header-element name="Constructors"></header-element>
      <deck-element .cards=${t}></deck-element>
    `}}To([y({type:Boolean})],cs.prototype,"loaded");var zo=Object.defineProperty,No=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&zo(t,e,r),r};class hs extends L{constructor(){super("lum:model"),this.loaded=!1}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["tracks/request",{}])}render(){const t=this.model?.tracks??[];return p`
      <header-element name="Schedule"></header-element>
      <deck-element .cards=${t}></deck-element>
    `}}No([y({type:Boolean})],hs.prototype,"loaded");var jo=Object.defineProperty,ds=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&jo(t,e,r),r};class Le extends L{constructor(){super("lum:model"),this.loaded=!1}connectedCallback(){super.connectedCallback(),new A(this,"lum:auth").observe(e=>{this.user=e.user,this.user?.username&&this.dispatchMessage(["favorites/request",{userid:this.user.username}])})}render(){const t=this.model?.favorites??[];return p`
      <header-element name="Favorites"></header-element>
      <deck-element .cards=${t}></deck-element>
    `}}ds([y({type:Boolean})],Le.prototype,"loaded");ds([y({type:Object})],Le.prototype,"user");const Mo={"A Albon":23,"A Alonso":14,"K Antonelli":12,"O Bearman":50,"G Bortoleto":5,"F Colapinto":43,"P Gasly":10,"I Hadjar":39,"L Hamilton":44,"N Hulkenberg":27,"L Lawson":30,"C Leclerc":16,"L Norris":4,"E Ocon":31,"O Piastri":81,"G Russel":63,"C Sainz":55,"L Stroll":18,"Y Tsunoda":22,"M Verstappen":1},Ro=[{path:"/app/login",view:()=>p`<login-element></login-element>`},{path:"/app/signup",view:()=>p`<signup-element></signup-element>`},{path:"/app/schedule",view:()=>p`<tracks-view></tracks-view>`},{path:"/app/constructors",view:()=>p`<teams-view></teams-view>`},{path:"/app/drivers",view:()=>p`<drivers-view></drivers-view>`},{path:"/app/favorites",view:()=>p`<favorites-view></favorites-view>`},{path:"/app/schedule/:label",view:(i,t)=>p`
      <header-element name="${i.label}" identifier="${t?.get("cardId")}"></header-element>
      <track-element src="/api/tracks/${i.label}"></track-element>
    `},{path:"/app/constructors/:label",view:(i,t)=>p`
      <header-element name="${i.label}" identifier="${t?.get("cardId")}"></header-element>
      <team-element src="/api/constructors/${i.label}"></team-element>
    `},{path:"/app/drivers/:label",view:(i,t)=>p`
      <header-element name="${i.label}" identifier="${t?.get("cardId")}"></header-element>
      <driver-element src="/api/drivers/${Mo[i.label]}"></driver-element>
    `},{path:"/app",view:()=>p`
        <header-element name="Luminance"></header-element>
        <deck-element src="/api/cards/category/mainPages"></deck-element>`},{path:"/",redirect:"/app"}];Ot({"mu-auth":w.Provider,"mu-history":Ms.Provider,"mu-switch":class extends Si.Element{constructor(){super(Ro,"lum:history","lum:auth")}},"mu-store":class extends Us.Provider{constructor(){super(eo,to,"lum:auth")}},"card-element":T,"deck-element":J,"driver-element":dt,"favorites-element":Bt,"header-element":R,"login-element":St,"signup-element":Pt,"drivers-view":ls,"teams-view":cs,"tracks-view":hs,"favorites-view":Le,"team-element":ut,"track-element":pt});
