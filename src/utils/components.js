const Components = {
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
            back.innerHTML = `<img src="/src/assets/imgs/icons/arrow_back.png" style="image-rendering: pixelated;">`;
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

        if (options?.settings) {
            const settings = document.createElement( "div" );
            settings.className = "headerButton";
            settings.innerHTML = `<img src="/src/assets/imgs/icons/settings.png" style="image-rendering: pixelated; width: calc(8*var(--base2Scale));">`;
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
        close.innerHTML = `<img src="/src/assets/imgs/icons/close.png" style="image-rendering: pixelated; width: 10px; height: 10px;">`;
        close.id = "closeApp";

        const maximize = document.createElement( "div" );
        maximize.className = "headerButton";
        maximize.style = "margin-right: 0; margin-left: 0;";
        maximize.innerHTML = `<img src="/src/assets/imgs/icons/maximize.png" style="image-rendering: pixelated; width: 10px; height: 10px;">`;
        maximize.id = "maximizeApp";

        const minimize = document.createElement( "div" );
        minimize.className = "headerButton";
        minimize.style = "margin-right: 0; margin-left: 0;";
        minimize.innerHTML = `<img src="/src/assets/imgs/icons/minimize.png" style="image-rendering: pixelated; width: 10px; height: 10px;">`;
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
    
    createTabs: (options) => {
        return (
            `<div class="skOQQ">${options.tabs.join( "" )}</div>`
        );
    },

    createTab: (options) => {
        return (
            `<div
                class="oreUIButton oreUIButtonTab ${options?.selected ? "tabPressed" : ""}"
                style="width: 100%;"
                onClick='(${options?.onClick?.toString()})(this)\nwindow.sound.play( "ui.click" )'
                id="${options?.id ?? ""}"
            >
                <div class="oreUIButton_ oreUIButtonTabBackground">
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
    },

    createElements: (options) => {
        return (
            `<div class="elements">${options.elements.join( "" )}</div>`
        );
    },
    
    createElement: (options) => {
        switch(options?.type) {
            case "tab": {
                return (
                    `<div class="oreUITab" onClick='(${options?.onClick?.toString()})(this)' id="${options?.id ?? ""}">
                    <div class="oreUISpecular oreUITab_One"></div>
                    <div class="oreUISpecular oreUITab_Two"></div>
                    <div class="_oreUITab" />
                        <div class="_oreUITab_">${options?.title ?? ""}</div>
                    </div>`
                );
            };

            case "element": {
                return (
                    `<div class="element_" id="${options?.id ?? ""}">
                        <span class="elementHeader" style="margin-top: ${options?.space ?? 16}px;">${options?.title ?? ""}</span>
                        <span class="elementSubtitle">${options?.subtitle ?? ""}</span>
                    </div>`
                );
            };

            case "dropdown": {
                return (
                    `<div class="element">
                        <span class="elementTitle">${options?.title ?? ""}</span>
                        <div class="dropdown oreUIButtonSecondary">
                            <div class="oreUIButton_ oreUIButtonSecondaryBackground">
                                <div class="oreUISpecular oreUIButton_One"></div>
                                <div class="oreUISpecular oreUIButton_Two"></div>
                                <select name="${options?.id ?? ""}" onChange='(${options?.onChange?.toString()})(this)' id="${options?.id ?? ""}" onClick='window.sound.play( "ui.click" )' class="_oreUIButton">
                                    ${options.items.map((i, index) => `<option value="${index}">${i}</option>`)}
                                </select>
                            </div>
                        </div>
                    </div>`
                );
            };

            case "input": {
                return (
                    `<div class="element">
                        <span class="elementTitle">${options?.title ?? ""}</span>
                        <input
                            id="${options?.id ?? ""}"
                            type="${options?.input?.type ?? "text"}"
                            min="${options?.input?.min ?? 0}"
                            max="${options?.input?.max ?? Infinity}"
                            placeholder="${options?.placeholder ?? ""}"
                            value="${options?.value ?? ""}"
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
                return (
                    `<div class="element">
                        <span class="elementTitle">${options?.title ?? ""}</span>
                        <div class="dropdown oreUIButtonSecondary">
                            <div class="oreUIButton_ oreUIButtonSecondaryBackground">
                                <div class="oreUISpecular oreUIButton_One"></div>
                                <div class="oreUISpecular oreUIButton_Two"></div>
                                <label
                                    style="font-size: 13px;cursor: pointer;width: 100%;text-align: center;"
                                    id="${options?.text?.id ?? ""}"
                                    for="${options?.id ?? ""}"
                                >${options?.text?.body ?? ""}</label>
                                <input
                                    name="packType"
                                    class="_oreUIButton"
                                    style="display: none;"
                                    type="file"
                                    accept=".${options?.accept ?? ""}"
                                    id="${options?.id ?? ""}"
                                    onChange='(${options?.onChange?.toString()})(this)'
                                />
                            </div>
                        </div>
                    </div>`
                );
            };

            case "toggle": {
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
                                onClick='(${options?.onClick?.toString()})(this)'
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
                    case "hero": style = "oreUIButtonHero"; background = "oreUIButtonHeroBackground"; break;
                };

                return (
                    `<div class="oreUIButton ${style}" onClick='(${options?.onClick?.toString()})(this)' id="${options?.id ?? ""}">
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
