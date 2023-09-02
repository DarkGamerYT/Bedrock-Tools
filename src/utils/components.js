/**
 * @typedef {{ text?: string; back?: boolean; settings?: boolean; }} HeaderOptions
 * @typedef {{ tabs: string[] }} TabsOptions
 * @typedef {{ text?: string; id: string; selected?: boolean; onClick: () => any; }} TabOptions
 * @typedef {{ elements: string[] }} ElementsOptions
 * @typedef {{
    type: "button" | "toggle" | "text" | "tab" | "element" | "dropdown" | "input" | "textbox" | "upload";
    title?: string;
    subtitle?: string;
    text?: string | {
        id?: string;
        body?: string;   
    };
    id?: string;
    onClick?: () => any;
    onChange?: () => any;
    style?: "primary" | "secondary" | "destructive" | "hero" | "code";
    icon?: string;
    toggled?: boolean;
    accept?: string;
    useTitle?: boolean;
    startHeight?: number;
    space?: number;
    default?: string;
    placeholder?: string;
    value?: string;
    selected?: number;
    items?: string[];
    input?: {
        type?: "text" | "number";
        min?: number;
        max?: number;
    };
  }} ElementOptions
 * @typedef {{ title?: string; body?: string; footer?: string }} ModalOptions
 */

const Functions = {
    button: () => window.sound.play( "ui.click" ),
    toggle: (element) => {
        window.sound.play( "ui.click" );
        let value = element.getAttribute( "value" ) == "true";
        element.setAttribute( "value", !value );
    
        if (!value) element.className = "toggle toggleOn";
        else element.className = "toggle toggleOff";
    },
};

const Components = {
    /**
     * @param { HeaderOptions } options
     * @returns { string }
     */
    createHeader: (options) => {
        const header = document.createElement( "div" );
        const header_ = document.createElement( "div" );
        const header__ = document.createElement( "div" );
        header.className = "header";
        header_.className = "header_";
        header__.className = "header__";

        const backElement = document.createElement( "div" );
        backElement.style = "position: absolute; left: 0; -webkit-app-region: no-drag;";
        if (options?.back) {
            const back = document.createElement( "div" );
            back.className = "headerButton";
            back.innerHTML = `<img src="assets/imgs/icons/arrow_back.png" draggable="false" style="image-rendering: pixelated;">`;
            back.id = "back";

            backElement.append( back );
        };

        header__.append( backElement );

        const headerTitle = document.createElement( "div" );
        headerTitle.className = "headerTitle";
        headerTitle.innerHTML = `<div class="headerTitle_">${options?.text ?? ""}</div>`;
        header__.append( headerTitle )

        const space = document.createElement( "div" );
        space.style = "align-items: center;display: flex;flex-direction: row;position: absolute;right: 0;-webkit-app-region: no-drag;";

        if (false) {
            const settings = document.createElement( "div" );
            settings.className = "headerButton";
            settings.innerHTML = `<img src="assets/imgs/icons/import.png" draggable="false" style="image-rendering: pixelated; height: 22px; width: 24px;">`;
            settings.id = "update";

            const divider = document.createElement( "dev" );
            divider.style = "width: 2px;height: 16px;margin-right: 4px;margin-left: 4px;background-color: lightgray;"
            
            space.append( settings );
            space.append( divider );
        };

        if (options?.settings) {
            const settings = document.createElement( "div" );
            settings.className = "headerButton";
            settings.innerHTML = `<img src="assets/imgs/icons/settings.png" draggable="false" style="image-rendering: pixelated; width: calc(8*var(--base2Scale));">`;
            settings.id = "settings";

            const divider = document.createElement( "dev" );
            divider.style = "width: 2px;height: 16px;margin-right: 4px;margin-left: 4px;background-color: lightgray;"
            
            space.append( settings );
            space.append( divider );
        };

        const main = document.createElement( "div" );
        main.style = "display: flex; flex-direction: row; margin-right: 0.4rem; margin-left: 0.4rem;";

        const close = document.createElement( "div" );
        close.className = "headerButton";
        close.style = "margin-right: 0; margin-left: 0;";
        close.innerHTML = `<img src="assets/imgs/icons/close.png" draggable="false" style="image-rendering: pixelated; width: 10px; height: 10px;">`;
        close.id = "closeApp";

        const maximize = document.createElement( "div" );
        maximize.className = "headerButton";
        maximize.style = "margin-right: 0; margin-left: 0;";
        maximize.innerHTML = `<img src="assets/imgs/icons/maximize.png" draggable="false" style="image-rendering: pixelated; width: 10px; height: 10px;">`;
        maximize.id = "maximizeApp";

        const minimize = document.createElement( "div" );
        minimize.className = "headerButton";
        minimize.style = "margin-right: 0; margin-left: 0;";
        minimize.innerHTML = `<img src="assets/imgs/icons/minimize.png" draggable="false" style="image-rendering: pixelated; width: 10px; height: 10px;">`;
        minimize.id = "minimizeApp";
        
        main.append( minimize );
        main.append( maximize );    
        main.append( close );

        space.append( main );
        header__.append( space );
        header_.append( header__ );

        const headerShadow = document.createElement( "div" );
        headerShadow.className = "headerShadow";
        header_.append( headerShadow );

        header.append( header_ );
        return header.outerHTML;
    },
    
    /**
     * @param { TabsOptions } options
     * @returns { string }
     */
    createTabs: (options) => {
        return (
            `<div class="skOQQ">
                ${options.tabs.join( "" )}
            </div>`
        );
    },

    /**
     * @param { TabOptions } options
     * @returns { string }
     */
    createTab: (options) => {
        window.functions.onClick[options?.id] = options?.onClick;
        return (
            `<div
                class="oreUIButton oreUIButtonTab ${options?.selected ? "tabPressed" : ""}"
                style="width: 100%;"
                onClick='if(${!options?.selected}) { Functions.button(this); window.functions.onClick["${options?.id}"](this); }'
                id="${options?.id ?? ""}"
            >
                <div class="oreUIButton_ oreUIButtonTabBackground" style="height: 2.5rem;">
                    <div class="oreUISpecular oreUIButton_One"></div>
                    <div class="oreUISpecular oreUIButton_Two"></div>
                    <div class="_oreUIButton">
                        <div class="_oreUIButton_">
                            <div class="_oreUIButton__">
                                ${
                                    options?.icon
                                    ? `<div>
                                        <img style="height: 24px; width: 24px;" src="${options.icon}" draggable="false">
                                        ${
                                            options?.selected
                                            ? `<div style="left: 0; position: absolute;"><div class="iconHighlight"></div></div>`
                                            : ""
                                        }
                                    </div>
                                    <div style="height: 0.8rem; width: 0.8rem;"></div>`
                                    : ""
                                }
                                <div class="_oreUIButton___">${options?.text ?? ""}</div>
                            </div>
                        </div>
                    </div>
                </div>
                ${
                    options?.selected
                    ? `<div style="bottom: 0; display: block; height: 2px; position: absolute; width: 4.8rem; background-color: #ffffff;"></div>`
                    : ""
                }
            </div>`
        );
    },

    /**
     * @param { ElementsOptions } options
     * @returns { string }
     */
    createElements: (options) => {
        return (
            `<div class="elements">
                ${options.elements.join( "" )}
            </div>`
        );
    },
    
    /**
     * @param { ElementOptions } options
     * @returns { string }
     */
    createElement: (options) => {
        switch(options?.type) {
            case "element": {
                return (
                    `<div class="element_" id="${options?.id ?? ""}">
                        <span class="elementHeader" style="margin-top: ${options?.space ?? 16}px;">${options?.title ?? ""}</span>
                        <span class="elementSubtitle">${options?.subtitle ?? ""}</span>
                    </div>`
                );
            };

            case "dropdown": {
                window.functions.onChange[options?.id] = options?.onChange ?? (() => {});
                return (
                    `<div class="element">
                        <span class="elementTitle">${options?.title ?? ""}</span>
                        <div class="dropdown oreUIButtonSecondary">
                            <div class="oreUIButton_ oreUIButtonSecondaryBackground">
                                <div class="oreUISpecular oreUIButton_One"></div>
                                <div class="oreUISpecular oreUIButton_Two"></div>
                                <select
                                    name="${options?.id ?? ""}"
                                    id="${options?.id ?? ""}"
                                    onChange='window.functions.onChange["${options?.id}"](this);'
                                    onClick='Functions.button(this);'
                                    class="_oreUIButton"
                                >
                                    ${options.items.map((i, index) => `<option ${options?.selected == index ? "selected" : "" } value="${index}">${i}</option>`)}
                                </select>
                            </div>
                        </div>
                    </div>`
                );
            };

            case "input": {
                window.functions.onChange[options?.id] = options?.onChange ?? (() => {});
                return (
                    `<div class="element">
                        ${options?.title ? `<span class="elementTitle">${options?.title}</span>` : `<div style="margin-top: 12px;"></div>`}
                        <input
                            id="${options?.id ?? ""}"
                            type="${options?.input?.type ?? "text"}"
                            min="${options?.input?.min ?? 0}"
                            max="${options?.input?.max ?? Infinity}"
                            placeholder="${options?.placeholder ?? ""}"
                            value="${options?.value ?? ""}"
                            onChange='window.functions.onChange["${options?.id}"](this);'
                        ></input>
                    </div>`
                );
            };

            case "textbox": {
                return (
                    `<div class="element">
                        <span class="elementTitle">${options?.title ?? ""}</span>
                        <textarea
                            role="textbox"
                            contenteditable=""
                            id="${options?.id ?? ""}"
                            style="height: 100%;min-height: ${options?.startHeight ?? 25}px;max-height: 512px;width: 100%;min-width: 100%;max-width: 100%;display: list-item;margin-bottom: 12px;padding-right: 0px;font-size: 16px;resize: none;"
                        ></textarea>
                    </div>`
                );
            };

            case "upload": {
                window.functions.onChange[options?.id] = options?.onChange ?? (() => {});
                return (
                    `<div class="element">
                        <span class="elementTitle">${options?.title ?? ""}</span>
                        <div class="dropdown oreUIButtonSecondary">
                            <div class="oreUIButton_ oreUIButtonSecondaryBackground">
                                <div class="oreUISpecular oreUIButton_One"></div>
                                <div class="oreUISpecular oreUIButton_Two"></div>
                                <label
                                    style="font-size: 13px;cursor: pointer;width: auto;display: flex;gap: 8px;align-items: center;"
                                    id="${options?.text?.id ?? ""}"
                                    for="${options?.id ?? ""}"
                                >
                                    <img src="assets/imgs/icons/import.png" draggable="false" style="image-rendering: pixelated; height: 22px; width: 24px;">
                                    <div style="font-family: 'MinecraftFive';color: black;font-weight: bold;font-size: 10px;">${options?.text?.body ?? ""}</div>
                                </label>
                                <input
                                    name="packType"
                                    class="_oreUIButton"
                                    style="display: none;"
                                    type="file"
                                    accept=".${options?.accept ?? ""}"
                                    id="${options?.id ?? ""}"
                                    onChange='window.functions.onChange["${options?.id}"](this);'
                                    onClick="Functions.button(this);"
                                />
                            </div>
                        </div>
                    </div>`
                );
            };

            case "toggle": {
                window.functions.onClick[options?.id] = options?.onClick ?? (() => {});
                return (
                    `<div class="element">
                        <div style="flex-direction: unset;margin-top: 8px;margin-bottom: 8px;">
                            <div>
                                <span class="${options?.subtitle ? "elementTitle_" : "elementTitle__"}">${options?.title ?? ""}</span>
                                <span class="elementSubtitle">${options?.subtitle ?? ""}</span>
                            </div>
                            <div
                                class="toggle ${options.toggled ? "toggleOn" : "toggleOff"}"
                                id="${options?.id ?? ""}"
                                value=${options.toggled ?? false}
                                onClick='if(className != "toggle toggleDisabled") { Functions.toggle(this); window.functions.onClick["${options?.id}"](this); }'
                            ></div>
                        </div>
                    </div>`
                );
            };

            case "button": {
                let style = "oreUIButtonPrimary";
                let background = "oreUIButtonPrimaryBackground";
                switch(options?.style) {
                    case "primary": style = "oreUIButtonPrimary"; background = "oreUIButtonPrimaryBackground"; break;
                    case "secondary": style = "oreUIButtonSecondary"; background = "oreUIButtonSecondaryBackground"; break;
                    case "destructive": style = "oreUIButtonDestructive"; background = "oreUIButtonDestructiveBackground"; break;
                    case "hero": style = "oreUIButtonHero"; background = "oreUIButtonHeroBackground"; break;
                };

                window.functions.onClick[options?.id] = options?.onClick ?? (() => {});
                return (
                    `<div class="oreUIButton ${style}" onClick='window.functions.onClick["${options?.id}"](this);' id="${options?.id ?? ""}">
                        <div class="oreUIButton_ ${background}">
                            <div class="oreUISpecular oreUIButton_One"></div>
                            <div class="oreUISpecular oreUIButton_Two"></div>
                            <div class="_oreUIButton">
                                <div class="_oreUIButton_">
                                    <div class="_oreUIButton__">
                                        <div class="_oreUIButton___">${options?.text ?? ""}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                );
            };

            case "text": {
                return (
                    `<div class="element">
                        <div style="flex-direction: unset;margin-top: 8px;margin-bottom: 12px;">
                            <div style="width: 100%;">
                                <span class="elementTitle" id="${options?.useTitle && options?.id ? options?.id : ""}">${options?.title ?? ""}</span>
                                ${
                                    options?.style == "code"
                                    ? `<pre><code class="hljs" id="${!options?.useTitle && options?.id ? options?.id : ""}">${options?.default ?? ""}</code></pre>`
                                    : `<span class="elementSubtitle" id="${!options?.useTitle && options?.id ? options?.id : ""}">${options?.subtitle ?? ""}</span>`
                                }
                            </div>
                        </div>
                    </div>`
                )
            };
        };
    },

    /**
     * @param { ModalOptions } options
     * @returns { string }
     */
    createModal: (options) => {
        return (
            `<div class="popup_">
                <div class="popup__">
                    <div class="popup___">
                        <div class="oreUISpecular oreUIButton_One"></div>
                        <div class="oreUISpecular oreUIButton_Two"></div>
                        <div style="width: 2.4rem; height: 2.4rem;"></div>
                        <div style="flex: 1 1 0;"></div>
                        <div style="font-size: 14px;">${options?.title ?? ""}</div>
                        <div style="flex: 1 1 0;"></div>
                        <div style="width: 2.4rem ;height: 2.4rem;"></div>
                    </div>
                    <div style="height: var(--base2Scale); width: 100%; background-color: #313233;"></div>
                    <div style="background-color: #313233; flex: 0 1 auto; color: #ffffff;">
                        ${options?.body ?? ""}
                    </div>
                    ${
                        options?.footer
                        ? (
                            `<div style="flex-direction: row; background-color: #48494a; padding: 0.6rem;">
                                <div class="oreUISpecular" style="border-top-width: var(--base2Scale);"></div>
                                <div class="oreUISpecular" style="border-bottom-width: var(--base2Scale);"></div>
                                ${options.footer}
                            </div>`
                        )
                        : ""
                    }
                </div>
            </div>`
        );
    },
};
