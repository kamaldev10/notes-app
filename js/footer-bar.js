class FooterBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
            <style>
                :host {
                display: block;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                background-color: #7b8fb9;
                                           

                }

                div {
                display: flex;
                padding: 16px 20px;
                color: #003eb3;
                align-items: center;
                justify-content: center;
                font-weight: bold;

                }
            </style>
            <div>
                <slot> Ali Musthafa Kamal &copy;2025 </slot>                
            <div>
            `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  setFooterContent(content) {
    const footerContentSlot = this.shadowRoot.querySelector(
      'slot[name="footer-content"]'
    );

    const slotContent = document.createElement("div");
    slotContent.setAttribute("slot", "footer-content");
    slotContent.innerHTML = content;

    footerContentSlot.parentNode.appendChild(slotContent);
  }
}

customElements.define("footer-bar", FooterBar);
