class AppBar extends HTMLElement {
  static get observedAttributes() {
    return ["brand"];
  }

  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        width: 100%;
        padding: 16px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        flex-wrap: wrap;
        background-color: #7b8fb9;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .brand-name {
        font-size: 1.5rem;
        color: #003eb3;
        margin: 0;
        flex: 1;
        min-width: 150px;
        padding: 24px 50px;
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "brand" && oldValue !== newValue) {
      console.log(`Brand name changed from "${oldValue}" to "${newValue}"`);
      this.render();
    }
  }

  render() {
    const brandName = this.getAttribute("brand");

    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div>
        <h1 class="brand-name">${brandName}</h1>
      </div>
    `;
  }
}

customElements.define("app-bar", AppBar);
