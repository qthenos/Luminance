(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var K,Ne;class dt extends Error{}dt.prototype.name="InvalidTokenError";function ei(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function si(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ei(t)}catch{return atob(t)}}function as(r,t){if(typeof r!="string")throw new dt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=r.split(".")[e];if(typeof i!="string")throw new dt(`Invalid token specified: missing part #${e+1}`);let s;try{s=si(i)}catch(n){throw new dt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new dt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const ii="mu:context",se=`${ii}:change`;class ri{constructor(t,e){this._proxy=ni(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ls extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ri(t,this),this.style.display="contents"}attach(t){return this.addEventListener(se,t),t}detach(t){this.removeEventListener(se,t)}}function ni(r,t){return new Proxy(r,{get:(i,s,n)=>s==="then"?void 0:Reflect.get(i,s,n),set:(i,s,n,o)=>{const l=r[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(i,s,n,o);if(a){let d=new CustomEvent(se,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function oi(r,t){const e=cs(t,r);return new Promise((i,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>i(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function cs(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const i=t.closest(e);if(i)return i;const s=t.getRootNode();if(s instanceof ShadowRoot)return cs(r,s.host)}class ai extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function hs(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ai(e,r))}class le{constructor(t,e,i="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=i,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const i=e.detail;this.consume(i)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[i,...s]=e;this._context.value=i,s.forEach(n=>n.then(o=>{o.length&&this.consume(o)}))}}}const ie="mu:auth:jwt",us=class ds extends le{constructor(t,e){super((i,s)=>this.update(i,s),t,ds.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:s,redirect:n}=t[1];return[ci(s),Qt(n)]}case"auth/signout":return[hi(e.user),Qt(this._redirectForLogin)];case"auth/redirect":return[e,Qt(this._redirectForLogin,{next:window.location.href})];default:const i=t[0];throw new Error(`Unhandled Auth message "${i}"`)}}};us.EVENT_TYPE="auth:message";let ps=us;const fs=hs(ps.EVENT_TYPE);function Qt(r,t){return new Promise((e,i)=>{if(r){const s=window.location.href,n=new URL(r,s);t&&Object.entries(t).forEach(([o,l])=>n.searchParams.set(o,l)),console.log("Redirecting to ",r),window.location.assign(n)}e([])})}class li extends ls{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=tt.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ps(this.context,this.redirect).attach(this)}}class gt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ie),t}}class tt extends gt{constructor(t){super();const e=as(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new tt(t);return localStorage.setItem(ie,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ie);return t?tt.authenticate(t):new gt}}function ci(r){return{user:tt.authenticate(r),token:r}}function hi(r){return{user:r&&r.authenticated?gt.deauthenticate(r):r,token:""}}function ui(r){return r&&r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function di(r){return r.authenticated?as(r.token||""):{}}const at=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:tt,Provider:li,User:gt,dispatch:fs,headers:ui,payload:di},Symbol.toStringTag,{value:"Module"}));function gs(r,t,e){const i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});r.dispatchEvent(i)}function Nt(r,t,e){const i=r.target;gs(i,t,e)}function re(r,t="*"){return r.composedPath().find(s=>{const n=s;return n.tagName&&n.matches(t)})||void 0}const pi=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:gs,originalTarget:re,relay:Nt},Symbol.toStringTag,{value:"Module"}));function ce(r,...t){const e=r.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let i=new CSSStyleSheet;return i.replaceSync(e),i}const fi=new DOMParser;function B(r,...t){const e=t.map(l),i=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),s=fi.parseFromString(i,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Le(a);case"bigint":case"boolean":case"number":case"symbol":return Le(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Le(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Vt(r,t={mode:"open"}){const e=r.attachShadow(t),i={template:s,styles:n};return i;function s(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),i}function n(...o){e.adoptedStyleSheets=o}}K=class extends HTMLElement{constructor(){super(),this._state={},Vt(this).template(K.template).styles(K.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,i=t.value;e&&(this._state[e]=i)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Nt(r,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var r,t;for(const e of((r=this.submitSlot)==null?void 0:r.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(r){this._state=r||{},gi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}get submitSlot(){var r;const t=(r=this.shadowRoot)==null?void 0:r.querySelector('slot[name="submit"]');return t||null}},K.template=B`
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
  `,K.styles=ce`
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
  `;function gi(r,t){const e=Object.entries(r);for(const[i,s]of e){const n=t.querySelector(`[name="${i}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;case"date":s instanceof Date?o.value=s.toISOString().substr(0,10):o.value=s;break;default:o.value=s;break}}}return r}const ms=class vs extends le{constructor(t){super((e,i)=>this.update(e,i),t,vs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:i,state:s}=t[1];return vi(i,s)}case"history/redirect":{const{href:i,state:s}=t[1];return yi(i,s)}}}};ms.EVENT_TYPE="history:message";let he=ms;class Ue extends ls{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=mi(t);if(e){const i=new URL(e.href);i.origin===this.context.value.location.origin&&(!this._root||i.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ue(e,"history/navigate",{href:i.pathname+i.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new he(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function mi(r){const t=r.currentTarget,e=i=>i.tagName=="A"&&i.href;if(r.button===0)if(r.composed){const s=r.composedPath().find(e);return s||void 0}else{for(let i=r.target;i;i===t?null:i.parentElement)if(e(i))return i;return}}function vi(r,t={}){return history.pushState(t,"",r),{location:document.location,state:history.state}}function yi(r,t={}){return history.replaceState(t,"",r),{location:document.location,state:history.state}}const ue=hs(he.EVENT_TYPE),_i=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ue,Provider:Ue,Service:he,dispatch:ue},Symbol.toStringTag,{value:"Module"}));class P{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,i)=>{if(this._provider){const s=new Ie(this._provider,t);this._effects.push(s),e(s)}else oi(this._target,this._contextLabel).then(s=>{const n=new Ie(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ie{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ys=class _s extends HTMLElement{constructor(){super(),this._state={},this._user=new gt,this._authObserver=new P(this,"blazing:auth"),Vt(this).template(_s.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",i=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;$i(s,this._state,e,this.authorization).then(n=>lt(n,this)).then(n=>{const o=`mu-rest-form:${i}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[i]:n,url:s}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,s=e.value;i&&(this._state[i]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},lt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Me(this.src,this.authorization).then(e=>{this._state=e,lt(e,this)}))})}attributeChangedCallback(t,e,i){switch(t){case"src":this.src&&i&&i!==e&&!this.isNew&&Me(this.src,this.authorization).then(s=>{this._state=s,lt(s,this)});break;case"new":i&&(this._state={},lt({},this));break}}};ys.observedAttributes=["src","new","action"];ys.template=B`
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
  `;function Me(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function lt(r,t){const e=Object.entries(r);for(const[i,s]of e){const n=t.querySelector(`[name="${i}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return r}function $i(r,t,e="PUT",i={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...i},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const bi=class $s extends le{constructor(t,e){super(e,t,$s.EVENT_TYPE,!1)}};bi.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,de=Tt.ShadowRoot&&(Tt.ShadyCSS===void 0||Tt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),ze=new WeakMap;let bs=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(de&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=ze.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ze.set(e,t))}return t}toString(){return this.cssText}};const wi=r=>new bs(typeof r=="string"?r:r+"",void 0,pe),xi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new bs(e,r,pe)},Ai=(r,t)=>{if(de)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=Tt.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},je=de?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return wi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ei,defineProperty:Si,getOwnPropertyDescriptor:ki,getOwnPropertyNames:Pi,getOwnPropertySymbols:Ci,getPrototypeOf:Oi}=Object,et=globalThis,He=et.trustedTypes,Ti=He?He.emptyScript:"",De=et.reactiveElementPolyfillSupport,pt=(r,t)=>r,Lt={toAttribute(r,t){switch(t){case Boolean:r=r?Ti:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},fe=(r,t)=>!Ei(r,t),Be={attribute:!0,type:String,converter:Lt,reflect:!1,useDefault:!1,hasChanged:fe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),et.litPropertyMetadata??(et.litPropertyMetadata=new WeakMap);let J=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Si(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=ki(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s?.call(this);n?.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;const t=Oi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){const e=this.properties,i=[...Pi(e),...Ci(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(je(s))}else t!==void 0&&e.push(je(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ai(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){var i;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:Lt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var i,s;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const l=n.getPropertyOptions(o),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((i=l.converter)==null?void 0:i.fromAttribute)!==void 0?l.converter:Lt;this._$Em=o,this[o]=a.fromAttribute(e,l.type)??((s=this._$Ej)==null?void 0:s.get(o))??null,this._$Em=null}}requestUpdate(t,e,i){var s;if(t!==void 0){const n=this.constructor,o=this[t];if(i??(i=n.getPropertyOptions(t)),!((i.hasChanged??fe)(o,e)||i.useDefault&&i.reflect&&o===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(i)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[pt("elementProperties")]=new Map,J[pt("finalized")]=new Map,De?.({ReactiveElement:J}),(et.reactiveElementVersions??(et.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,It=Ut.trustedTypes,Ve=It?It.createPolicy("lit-html",{createHTML:r=>r}):void 0,ws="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,xs="?"+N,Ri=`<${xs}>`,V=document,mt=()=>V.createComment(""),vt=r=>r===null||typeof r!="object"&&typeof r!="function",ge=Array.isArray,Ni=r=>ge(r)||typeof r?.[Symbol.iterator]=="function",te=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qe=/-->/g,Fe=/>/g,z=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),We=/'/g,Ye=/"/g,As=/^(?:script|style|textarea|title)$/i,Li=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ht=Li(1),st=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ge=new WeakMap,H=V.createTreeWalker(V,129);function Es(r,t){if(!ge(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ve!==void 0?Ve.createHTML(t):t}const Ui=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ct?f[1]==="!--"?o=qe:f[1]!==void 0?o=Fe:f[2]!==void 0?(As.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=z):f[3]!==void 0&&(o=z):o===z?f[0]===">"?(o=s??ct,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?z:f[3]==='"'?Ye:We):o===Ye||o===We?o=z:o===qe||o===Fe?o=ct:(o=z,s=void 0);const h=o===z&&r[l+1].startsWith("/>")?" ":"";n+=o===ct?a+Ri:u>=0?(i.push(d),a.slice(0,u)+ws+a.slice(u)+N+h):a+N+(u===-2?l:h)}return[Es(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};let ne=class Ss{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ui(t,e);if(this.el=Ss.createElement(d,i),H.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=H.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(ws)){const c=f[o++],h=s.getAttribute(u).split(N),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Mi:p[1]==="?"?zi:p[1]==="@"?ji:qt}),s.removeAttribute(u)}else u.startsWith(N)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(As.test(s.tagName)){const u=s.textContent.split(N),c=u.length-1;if(c>0){s.textContent=It?It.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],mt()),H.nextNode(),a.push({type:2,index:++n});s.append(u[c],mt())}}}else if(s.nodeType===8)if(s.data===xs)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(N,u+1))!==-1;)a.push({type:7,index:n}),u+=N.length-1}n++}}static createElement(t,e){const i=V.createElement("template");return i.innerHTML=t,i}};function it(r,t,e=r,i){var s,n;if(t===st)return t;let o=i!==void 0?(s=e._$Co)==null?void 0:s[i]:e._$Cl;const l=vt(t)?void 0:t._$litDirective$;return o?.constructor!==l&&((n=o?._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=o:e._$Cl=o),o!==void 0&&(t=it(r,o._$AS(r,t.values),o,i)),t}let Ii=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??V).importNode(e,!0);H.currentNode=s;let n=H.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new me(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Hi(n,this,t)),this._$AV.push(d),a=i[++l]}o!==a?.index&&(n=H.nextNode(),o++)}return H.currentNode=V,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},me=class ks{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),vt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ni(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=ne.createElement(Es(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(i);else{const o=new Ii(n,this),l=o.u(this.options);o.p(i),this.T(l),this._$AH=o}}_$AC(t){let e=Ge.get(t.strings);return e===void 0&&Ge.set(t.strings,e=new ne(t)),e}k(t){ge(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new ks(this.O(mt()),this.O(mt()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},qt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=$}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=it(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==st,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=it(this,l[i+a],e,a),d===st&&(d=this._$AH[a]),o||(o=!vt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Mi=class extends qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},zi=class extends qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},ji=class extends qt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??$)===st)return;const i=this._$AH,s=t===$&&i!==$||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==$&&(i===$||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Hi=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}};const Ke=Ut.litHtmlPolyfillSupport;Ke?.(ne,me),(Ut.litHtmlVersions??(Ut.litHtmlVersions=[])).push("3.3.0");const Di=(r,t,e)=>{const i=e?.renderBefore??t;let s=i._$litPart$;if(s===void 0){const n=e?.renderBefore??null;i._$litPart$=s=new me(t.insertBefore(mt(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yt=globalThis;let Q=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Di(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}};Q._$litElement$=!0,Q.finalized=!0,(Ne=yt.litElementHydrateSupport)==null||Ne.call(yt,{LitElement:Q});const Ze=yt.litElementPolyfillSupport;Ze?.({LitElement:Q});(yt.litElementVersions??(yt.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bi={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:fe},Vi=(r=Bi,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),i==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(i==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+i)};function Ps(r){return(t,e)=>typeof e=="object"?Vi(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Cs(r){return Ps({...r,state:!0,attribute:!1})}function qi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Fi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Os={};(function(r){var t=(function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},i=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,y,Gt){var A=y.length-1;switch(g){case 1:return new m.Root({},[y[A-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new m.Literal({value:y[A]});break;case 7:this.$=new m.Splat({name:y[A]});break;case 8:this.$=new m.Param({name:y[A]});break;case 9:this.$=new m.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:i,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],y=this.table,Gt="",A=0,Oe=0,Js=2,Te=1,Xs=g.slice.call(arguments,1),_=Object.create(this.lexer),I={yy:{}};for(var Kt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Kt)&&(I.yy[Kt]=this.yy[Kt]);_.setInput(c,I.yy),I.yy.lexer=_,I.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Zt=_.yylloc;g.push(Zt);var Qs=_.options&&_.options.ranges;typeof I.yy.parseError=="function"?this.parseError=I.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ti=function(){var G;return G=_.lex()||Te,typeof G!="number"&&(G=h.symbols_[G]||G),G},x,M,S,Jt,Y={},Ct,T,Re,Ot;;){if(M=p[p.length-1],this.defaultActions[M]?S=this.defaultActions[M]:((x===null||typeof x>"u")&&(x=ti()),S=y[M]&&y[M][x]),typeof S>"u"||!S.length||!S[0]){var Xt="";Ot=[];for(Ct in y[M])this.terminals_[Ct]&&Ct>Js&&Ot.push("'"+this.terminals_[Ct]+"'");_.showPosition?Xt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+Ot.join(", ")+", got '"+(this.terminals_[x]||x)+"'":Xt="Parse error on line "+(A+1)+": Unexpected "+(x==Te?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(Xt,{text:_.match,token:this.terminals_[x]||x,line:_.yylineno,loc:Zt,expected:Ot})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+x);switch(S[0]){case 1:p.push(x),m.push(_.yytext),g.push(_.yylloc),p.push(S[1]),x=null,Oe=_.yyleng,Gt=_.yytext,A=_.yylineno,Zt=_.yylloc;break;case 2:if(T=this.productions_[S[1]][1],Y.$=m[m.length-T],Y._$={first_line:g[g.length-(T||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(T||1)].first_column,last_column:g[g.length-1].last_column},Qs&&(Y._$.range=[g[g.length-(T||1)].range[0],g[g.length-1].range[1]]),Jt=this.performAction.apply(Y,[Gt,Oe,A,I.yy,S[1],m,g].concat(Xs)),typeof Jt<"u")return Jt;T&&(p=p.slice(0,-1*T*2),m=m.slice(0,-1*T),g=g.slice(0,-1*T)),p.push(this.productions_[S[1]][0]),m.push(Y.$),g.push(Y._$),Re=y[p[p.length-2]][p[p.length-1]],p.push(Re);break;case 3:return!0}}return!0}},d=(function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(p=this._input.match(this.rules[g[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=y,this.options.backtrack_lexer){if(c=this.test_match(p,g[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof Fi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Os);function Z(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Ts={Root:Z("Root"),Concat:Z("Concat"),Literal:Z("Literal"),Splat:Z("Splat"),Param:Z("Param"),Optional:Z("Optional")},Rs=Os.parser;Rs.yy=Ts;var Wi=Rs,Yi=Object.keys(Ts);function Gi(r){return Yi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Ns=Gi,Ki=Ns,Zi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ls(r){this.captures=r.captures,this.re=r.re}Ls.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(i,s){typeof t[s+1]>"u"?e[i]=void 0:e[i]=decodeURIComponent(t[s+1])}),e};var Ji=Ki({Concat:function(r){return r.children.reduce((function(t,e){var i=this.visit(e);return{re:t.re+i.re,captures:t.captures.concat(i.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Zi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ls({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Xi=Ji,Qi=Ns,tr=Qi({Concat:function(r,t){var e=r.children.map((function(i){return this.visit(i,t)}).bind(this));return e.some(function(i){return i===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),er=tr,sr=Wi,ir=Xi,rr=er;St.prototype=Object.create(null);St.prototype.match=function(r){var t=ir.visit(this.ast),e=t.match(r);return e||!1};St.prototype.reverse=function(r){return rr.visit(this.ast,r)};function St(r){var t;if(this?t=this:t=Object.create(St.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=sr.parse(r),t}var nr=St,or=nr,ar=or;const lr=qi(ar);var cr=Object.defineProperty,Us=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&cr(t,e,s),s};const Is=class extends Q{constructor(t,e,i=""){super(),this._cases=[],this._fallback=()=>ht` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new lr(s.path)})),this._historyObserver=new P(this,e),this._authObserver=new P(this,i)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ht` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(fs(this,"auth/redirect"),ht` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ht` <h1>Authenticating</h1> `;if("redirect"in e){const i=e.redirect;if(typeof i=="string")return this.redirect(i),ht` <h1>Redirecting to ${i}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:i}=t,s=new URLSearchParams(e),n=i+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:i,params:l,query:s}}}redirect(t){ue(this,"history/redirect",{href:t})}};Is.styles=xi`
    :host,
    main {
      display: contents;
    }
  `;let Mt=Is;Us([Cs()],Mt.prototype,"_user");Us([Cs()],Mt.prototype,"_match");const hr=Object.freeze(Object.defineProperty({__proto__:null,Element:Mt,Switch:Mt},Symbol.toStringTag,{value:"Module"})),Ms=class oe extends HTMLElement{constructor(){if(super(),Vt(this).template(oe.template).styles(oe.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ms.template=B` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;Ms.styles=ce`
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
  `;const zs=class ae extends HTMLElement{constructor(){super(),this._array=[],Vt(this).template(ae.template).styles(ae.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(js("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const i=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(i)}}}),this.addEventListener("click",t=>{re(t,"button.add")?Nt(t,"input-array:add"):re(t,"button.remove")&&Nt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ur(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const i=Array.from(this.children).indexOf(e);this._array.splice(i,1),e.remove()}}};zs.template=B`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;zs.styles=ce`
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
  `;function ur(r,t){t.replaceChildren(),r.forEach((e,i)=>t.append(js(e)))}function js(r,t){const e=r===void 0?B`<input />`:B`<input value="${r}" />`;return B`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Hs(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var dr=Object.defineProperty,pr=Object.getOwnPropertyDescriptor,fr=(r,t,e,i)=>{for(var s=pr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&dr(t,e,s),s};class gr extends Q{constructor(t){super(),this._pending=[],this._observer=new P(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([i,s])=>{console.log("Dispatching queued event",s,i),i.dispatchEvent(s)}),e.setEffect(()=>{var i;if(console.log("View effect",this,e,(i=this._context)==null?void 0:i.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const i=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",i),e.dispatchEvent(i)):(console.log("Queueing message event",i),this._pending.push([e,i]))}ref(t){return this.model?this.model[t]:void 0}}fr([Ps()],gr.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,ve=Rt.ShadowRoot&&(Rt.ShadyCSS===void 0||Rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ye=Symbol(),Je=new WeakMap;let Ds=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==ye)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ve&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Je.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Je.set(e,t))}return t}toString(){return this.cssText}};const mr=r=>new Ds(typeof r=="string"?r:r+"",void 0,ye),C=(r,...t)=>{const e=r.length===1?r[0]:t.reduce(((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1]),r[0]);return new Ds(e,r,ye)},vr=(r,t)=>{if(ve)r.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const i=document.createElement("style"),s=Rt.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},Xe=ve?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return mr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:yr,defineProperty:_r,getOwnPropertyDescriptor:$r,getOwnPropertyNames:br,getOwnPropertySymbols:wr,getPrototypeOf:xr}=Object,Ft=globalThis,Qe=Ft.trustedTypes,Ar=Qe?Qe.emptyScript:"",Er=Ft.reactiveElementPolyfillSupport,ft=(r,t)=>r,zt={toAttribute(r,t){switch(t){case Boolean:r=r?Ar:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},_e=(r,t)=>!yr(r,t),ts={attribute:!0,type:String,converter:zt,reflect:!1,useDefault:!1,hasChanged:_e};Symbol.metadata??=Symbol("metadata"),Ft.litPropertyMetadata??=new WeakMap;let X=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ts){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&_r(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=$r(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s?.call(this);n?.call(this,o),this.requestUpdate(t,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ts}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=xr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,i=[...br(e),...wr(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(Xe(s))}else t!==void 0&&e.push(Xe(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vr(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const n=(i.converter?.toAttribute!==void 0?i.converter:zt).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:zt;this._$Em=s;const l=o.fromAttribute(e,n.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){const s=this.constructor,n=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??_e)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,n]of i){const{wrapped:o}=n,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((i=>i.hostUpdate?.())),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[ft("elementProperties")]=new Map,X[ft("finalized")]=new Map,Er?.({ReactiveElement:X}),(Ft.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $e=globalThis,jt=$e.trustedTypes,es=jt?jt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Bs="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,Vs="?"+L,Sr=`<${Vs}>`,q=document,_t=()=>q.createComment(""),$t=r=>r===null||typeof r!="object"&&typeof r!="function",be=Array.isArray,kr=r=>be(r)||typeof r?.[Symbol.iterator]=="function",ee=`[ 	
\f\r]`,ut=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ss=/-->/g,is=/>/g,j=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),rs=/'/g,ns=/"/g,qs=/^(?:script|style|textarea|title)$/i,Pr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),v=Pr(1),rt=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),os=new WeakMap,D=q.createTreeWalker(q,129);function Fs(r,t){if(!be(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return es!==void 0?es.createHTML(t):t}const Cr=(r,t)=>{const e=r.length-1,i=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ut;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ut?f[1]==="!--"?o=ss:f[1]!==void 0?o=is:f[2]!==void 0?(qs.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=s??ut,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?j:f[3]==='"'?ns:rs):o===ns||o===rs?o=j:o===ss||o===is?o=ut:(o=j,s=void 0);const h=o===j&&r[l+1].startsWith("/>")?" ":"";n+=o===ut?a+Sr:u>=0?(i.push(d),a.slice(0,u)+Bs+a.slice(u)+L+h):a+L+(u===-2?l:h)}return[Fs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class bt{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Cr(t,e);if(this.el=bt.createElement(d,i),D.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=D.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(Bs)){const c=f[o++],h=s.getAttribute(u).split(L),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Tr:p[1]==="?"?Rr:p[1]==="@"?Nr:Wt}),s.removeAttribute(u)}else u.startsWith(L)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(qs.test(s.tagName)){const u=s.textContent.split(L),c=u.length-1;if(c>0){s.textContent=jt?jt.emptyScript:"";for(let h=0;h<c;h++)s.append(u[h],_t()),D.nextNode(),a.push({type:2,index:++n});s.append(u[c],_t())}}}else if(s.nodeType===8)if(s.data===Vs)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(L,u+1))!==-1;)a.push({type:7,index:n}),u+=L.length-1}n++}}static createElement(t,e){const i=q.createElement("template");return i.innerHTML=t,i}}function nt(r,t,e=r,i){if(t===rt)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl;const n=$t(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=nt(r,s._$AS(r,t.values),s,i)),t}class Or{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??q).importNode(e,!0);D.currentNode=s;let n=D.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new kt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Lr(n,this,t)),this._$AV.push(d),a=i[++l]}o!==a?.index&&(n=D.nextNode(),o++)}return D.currentNode=q,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class kt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),$t(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==rt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):kr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&$t(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=bt.createElement(Fs(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const n=new Or(s,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=os.get(t.strings);return e===void 0&&os.set(t.strings,e=new bt(t)),e}k(t){be(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new kt(this.O(_t()),this.O(_t()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Wt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=b}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(n===void 0)t=nt(this,t,e,0),o=!$t(t)||t!==this._$AH&&t!==rt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=nt(this,l[i+a],e,a),d===rt&&(d=this._$AH[a]),o||=!$t(d)||d!==this._$AH[a],d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Tr extends Wt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Rr extends Wt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Nr extends Wt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??b)===rt)return;const i=this._$AH,s=t===b&&i!==b||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==b&&(i===b||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Lr{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}}const Ur=$e.litHtmlPolyfillSupport;Ur?.(bt,kt),($e.litHtmlVersions??=[]).push("3.3.1");const Ir=(r,t,e)=>{const i=e?.renderBefore??t;let s=i._$litPart$;if(s===void 0){const n=e?.renderBefore??null;i._$litPart$=s=new kt(t.insertBefore(_t(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const we=globalThis;class E extends X{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ir(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return rt}}E._$litElement$=!0,E.finalized=!0,we.litElementHydrateSupport?.({LitElement:E});const Mr=we.litElementPolyfillSupport;Mr?.({LitElement:E});(we.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zr={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:_e},jr=(r=zr,t,e)=>{const{kind:i,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),i==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),i==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(i==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+i)};function w(r){return(t,e)=>typeof e=="object"?jr(r,t,e):((i,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,i),o?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function O(r){return w({...r,state:!0,attribute:!1})}const Hr=C`
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
`,R={styles:Hr};var Dr=Object.defineProperty,Pt=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Dr(t,e,s),s};const xe=class xe extends E{constructor(){super(...arguments),this.loggedIn=!1,this.isFavorited=!1,this._authObserver=new P(this,"lum:auth")}render(){return v`
      <header>
        <div class="title-section">
          <h1><a href="/app">${this.name}</a></h1>
          ${this.identifier?this.renderLikeButton():v``}
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
    `}renderSignOutButton(){return v`
      <button
        class="sign-btn"
        @click=${t=>{pi.relay(t,"auth:message",["auth/signout"]),setTimeout(()=>location.reload(),500)}}
      >
        Sign Out
      </button>
    `}renderSignInButton(){return v`
      <button class="sign-btn" onclick="location.href='/app/login';">
        Sign In
      </button>
    `}renderLikeButton(){return v`
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
    `}get authorization(){return this._user?at.headers(this._user):{}}async handleLikeClick(t){const e=t.target,i=e.checked;if(!this.userid||!this.identifier)return;const s=i?`/api/profiles/${this.userid}/favorites/${this.identifier}`:`/api/profiles/${this.userid}/favorites/${this.identifier}`,n=i?"POST":"DELETE";try{(await fetch(s,{method:n,headers:this.authorization})).ok?this.isFavorited=i:(e.checked=!i,this.isFavorited=!i)}catch(o){console.error("Error updating favorite:",o),e.checked=!i,this.isFavorited=!i}}async checkIfFavorited(t){if(this.identifier)try{const e=await fetch(`/api/profiles/${t}/favorites`,{headers:this.authorization});if(e.ok){const i=await e.json();this.isFavorited=i.some(s=>s._id===this.identifier)}}catch(e){console.error("Error checking favorites:",e)}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;this._user=e,e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username,this.identifier&&this.checkIfFavorited(e.username)):(this.loggedIn=!1,this.userid=void 0)})}updated(){const t=this.shadowRoot?.querySelector("#theme-toggle"),e=localStorage.getItem("darkMode")==="true";t&&(t.checked=e)}};xe.styles=[R.styles,C`
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
    `];let U=xe;Pt([w()],U.prototype,"name");Pt([w()],U.prototype,"identifier");Pt([O()],U.prototype,"loggedIn");Pt([O()],U.prototype,"userid");Pt([O()],U.prototype,"isFavorited");var Br=Object.defineProperty,W=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Br(t,e,s),s};const Ae=class Ae extends E{getHrefWithCardId(){if(!this.href)return"";const t=this.href.includes("?")?"&":"?";return this.cardId?`${this.href}${t}cardId=${this.cardId}`:this.href}render(){return this.backgroundImg?v`
        <div class="card" style="background-image: url(${this.backgroundImg});">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
        </div>
      `:this.img?v`
        <div class="card">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
          <img src="${this.img}" />
        </div>
      `:this.icon?v`
        <div class="card">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
          <svg class="icon"><use href="${this.icon}" /></svg>
        </div>
      `:v`
        <div class="card">
          <a href="${this.getHrefWithCardId()}">${this.label}</a>
        </div>
      `}};Ae.styles=[R.styles,C`
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
    `];let k=Ae;W([w()],k.prototype,"backgroundImg");W([w()],k.prototype,"img");W([w()],k.prototype,"icon");W([w()],k.prototype,"href");W([w()],k.prototype,"label");W([w()],k.prototype,"category");W([w()],k.prototype,"cardId");var Vr=Object.defineProperty,Ws=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Vr(t,e,s),s};const Dt=class Dt extends E{constructor(){super(...arguments),this.cards=[],this._authObserver=new P(this,"lum:auth")}render(){const{cards:t}=this,e=[...t].sort((s,n)=>s.orderNumber-n.orderNumber);function i(s){return s.backImg?v`
          <card-element
            href="${s.link}"
            label="${s.label}"
            backgroundImg="${s.backImg}"
            cardId="${s._id}"
          ></card-element>
        `:s.img?v`
          <card-element
            href="${s.link}"
            label="${s.label}"
            img="${s.img}"
            cardId="${s._id}"
          ></card-element>
        `:s.icon?v`
          <card-element
            href="${s.link}"
            label="${s.label}"
            icon="${s.icon}"
            cardId="${s._id}"
          ></card-element>
        `:v`
          <card-element
            href="${s.link}"
            label="${s.label}"
            cardId="${s._id}"
          ></card-element>
        `}return v`
      <article class="grid">
        <main>${e.map(i)}</main>
      </article>
    `}get authorization(){return this._user?at.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.cards=e)})}};Dt.uses=Hs({"card-element":k}),Dt.styles=[R.styles,C`
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
    `];let ot=Dt;Ws([w()],ot.prototype,"src");Ws([O()],ot.prototype,"cards");var qr=Object.defineProperty,Fr=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&qr(t,e,s),s};const Bt=class Bt extends E{constructor(){super(...arguments),this._authObserver=new P(this,"lum:auth")}render(){return this.userid?v`
      <deck-element src="/api/profiles/${this.userid}/favorites"></deck-element>
    `:v`<p>Loading favorites...</p>`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?this.userid=e.username:this.userid=void 0})}};Bt.uses={"deck-element":ot},Bt.styles=[R.styles,C`
      :host {
        display: contents;
      }
    `];let Ht=Bt;Fr([O()],Ht.prototype,"userid");var Wr=Object.defineProperty,Ys=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Wr(t,e,s),s};const Ee=class Ee extends E{constructor(){super(...arguments),this.data=null,this._authObserver=new P(this,"lum:auth")}render(){if(!this.data)return v`<p>Loading driver data...</p>`;const t=this.data;return v`
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
    `}get authorization(){return this._user?at.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.data=e)})}};Ee.styles=[R.styles,C`
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
    `];let wt=Ee;Ys([w()],wt.prototype,"src");Ys([O()],wt.prototype,"data");var Yr=Object.defineProperty,Gs=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Yr(t,e,s),s};const Se=class Se extends E{constructor(){super(...arguments),this.data=null,this._authObserver=new P(this,"lum:auth")}render(){if(!this.data)return v`<p>Loading team data...</p>`;const t=this.data;return v`
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
            ${t.drivers.map(e=>v`
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
    `}get authorization(){return this._user?at.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.data=e)})}};Se.styles=[R.styles,C`
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
    `];let xt=Se;Gs([w()],xt.prototype,"src");Gs([O()],xt.prototype,"data");var Gr=Object.defineProperty,Ks=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Gr(t,e,s),s};const ke=class ke extends E{constructor(){super(...arguments),this.data=null,this._authObserver=new P(this,"lum:auth")}render(){if(!this.data)return v`<p>Loading track data...</p>`;const t=this.data;return v`
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
                  ${t.tireCompounds.map(e=>v`<li>${e}</li>`)}
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
    `}get authorization(){return this._user?at.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{e&&(this.data=e)})}};ke.styles=[R.styles,C`
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
    `];let At=ke;Ks([w()],At.prototype,"src");Ks([O()],At.prototype,"data");var Kr=Object.defineProperty,Yt=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Kr(t,e,s),s};const Pe=class Pe extends E{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}handleChange(t){const e=t.target,i=e?.name,s=e?.value,n=this.formData;switch(i){case"username":this.formData={...n,username:s};break;case"password":this.formData={...n,password:s};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this?.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:i}=e,s=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:i,redirect:this.redirect}]});console.log("dispatching message",s),this.dispatchEvent(s)}).catch(e=>{console.log(e),this.error=e.toString()})}render(){return v`
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
    `}};Pe.styles=[R.styles,C`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let F=Pe;Yt([O()],F.prototype,"formData");Yt([w()],F.prototype,"api");Yt([w()],F.prototype,"redirect");Yt([O()],F.prototype,"error");var Zr=Object.defineProperty,Zs=(r,t,e,i)=>{for(var s=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(s=o(t,e,s)||s);return s&&Zr(t,e,s),s};const Ce=class Ce extends E{constructor(){super(...arguments),this.api="/auth/login",this.redirect="/app"}connectedCallback(){super.connectedCallback(),customElements.get("login-form")||customElements.define("login-form",F)}render(){return v`
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
    `}};Ce.styles=[R.styles,C`
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
    `];let Et=Ce;Zs([w()],Et.prototype,"api");Zs([w()],Et.prototype,"redirect");const Jr={"A Albon":23,"A Alonso":14,"K Antonelli":12,"O Bearman":50,"G Bortoleto":5,"F Colapinto":43,"P Gasly":10,"I Hadjar":39,"L Hamilton":44,"N Hulkenberg":27,"L Lawson":30,"C Leclerc":16,"L Norris":4,"E Ocon":31,"O Piastri":81,"G Russel":63,"C Sainz":55,"L Stroll":18,"Y Tsunoda":22,"M Verstappen":1},Xr=[{path:"/app/login",view:()=>v`<login-element></login-element>`},{path:"/app/schedule",view:()=>v`
      <header-element name="Schedule"></header-element>
      <deck-element src="/api/cards/category/schedule"></deck-element>
    `},{path:"/app/constructors",view:()=>v`
      <header-element name="Constructors"></header-element>
      <deck-element src="/api/cards/category/constructors"></deck-element>
    `},{path:"/app/drivers",view:()=>v`
      <header-element name="Drivers"></header-element>
      <deck-element src="/api/cards/category/drivers"></deck-element>
    `},{path:"/app/favorites",view:()=>v`
      <header-element name="Favorites"></header-element>
      <favorites-element></favorites-element>
    `},{path:"/app/schedule/:label",view:(r,t)=>v`
      <header-element name="${r.label}" identifier="${t?.get("cardId")}"></header-element>
      <track-element src="/api/tracks/${r.label}"></track-element>
    `},{path:"/app/constructors/:label",view:(r,t)=>v`
      <header-element name="${r.label}" identifier="${t?.get("cardId")}"></header-element>
      <team-element src="/api/constructors/${r.label}"></team-element>
    `},{path:"/app/drivers/:label",view:(r,t)=>v`
      <header-element name="${r.label}" identifier="${t?.get("cardId")}"></header-element>
      <driver-element src="/api/drivers/${Jr[r.label]}"></driver-element>
    `},{path:"/app",view:()=>v`
        <header-element name="Luminance"></header-element>
        <deck-element src="/api/cards/category/mainPages"></deck-element>`},{path:"/",redirect:"/app"}];Hs({"mu-auth":at.Provider,"mu-history":_i.Provider,"mu-switch":class extends hr.Element{constructor(){super(Xr,"lum:history","lum:auth")}},"card-element":k,"deck-element":ot,"driver-element":wt,"favorites-element":Ht,"header-element":U,"login-element":Et,"team-element":xt,"track-element":At});
