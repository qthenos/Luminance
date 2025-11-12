import{i as u,x as a,r as b,a as f,n as o,O as m,d as $,c as y,b as x}from"./reset.css-DFjQgTct.js";var k=Object.defineProperty,l=(d,i,t,e)=>{for(var r=void 0,n=d.length-1,c;n>=0;n--)(c=d[n])&&(r=c(i,t,r)||r);return r&&k(i,t,r),r};const g=class g extends u{render(){return this.backgroundImg?a`
        <div class="card" style="background-image: url(${this.backgroundImg});">
          <a href="${this.href}">${this.label}</a>
        </div>
      `:this.img?a`
        <div class="card">
          <a href="${this.href}">${this.label}</a>
          <img src="${this.img}" />
        </div>
      `:this.icon?a`
        <div class="card">
          <a href="${this.href}">${this.label}</a>
          <svg class="icon"><use href="${this.icon}" /></svg>
        </div>
      `:a`
        <div class="card">
          <a href="${this.href}">${this.label}</a>
        </div>
      `}};g.styles=[b.styles,f`
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
    `];let s=g;l([o()],s.prototype,"backgroundImg");l([o()],s.prototype,"img");l([o()],s.prototype,"icon");l([o()],s.prototype,"href");l([o()],s.prototype,"label");l([o()],s.prototype,"category");var z=Object.defineProperty,v=(d,i,t,e)=>{for(var r=void 0,n=d.length-1,c;n>=0;n--)(c=d[n])&&(r=c(i,t,r)||r);return r&&z(i,t,r),r};const p=class p extends u{constructor(){super(...arguments),this.cards=[],this._authObserver=new m(this,"blazing:auth")}render(){const{cards:i}=this;function t(e){return e.backImg?a`
          <card-element
            href="${e.link}"
            label="${e.label}"
            backgroundImg="${e.backImg}"
          ></card-element>
        `:e.img?a`
          <card-element
            href="${e.link}"
            label="${e.label}"
            img="${e.img}"
          ></card-element>
        `:e.icon?a`
          <card-element
            href="${e.link}"
            label="${e.label}"
            icon="${e.icon}"
          ></card-element>
        `:a`
          <card-element href="${e.link}" label="${e.label}"></card-element>
        `}return a` ${i.map(t)} `}get authorization(){return this._user?y.headers(this._user):{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(i=>{this._user=i.user,this.src&&this.hydrate(this.src)})}hydrate(i){fetch(i,{headers:this.authorization}).then(t=>t.json()).then(t=>{t&&(this.cards=t)})}};p.uses=$({"card-element":s}),p.styles=[b.styles,f`
      :host {
        display: contents;
      }

      card-element {
        display: block;
      }
    `];let h=p;v([o()],h.prototype,"src");v([x()],h.prototype,"cards");export{s as C,h as D};
