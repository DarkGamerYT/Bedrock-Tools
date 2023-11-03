const Functions = {
    button: () => sound.play( "ui.click" ),

    /**
     * @param { HTMLElement } element 
     * @param { boolean } value
     */
    switch: (element, value) => {
        sound.play( "ui.click" );
        element.setAttribute( "value", value.toString() );
        if (value) element.className = "switchThumb switchThumbOn";
        else element.className = "switchThumb switchThumbOff";
    },
};

module.exports = {
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
        backElement.style.position = "absolute";
        backElement.style.left = "0";
        // @ts-ignore
        backElement.style["-webkit-app-region"] = "no-drag";
        if (options?.back) {
            const back = document.createElement( "div" );
            back.className = "headerButton";
            back.innerHTML = `<img src="assets/arrow_back.png" draggable="false" style="image-rendering: pixelated;">`;
            back.id = "back";

            backElement.append( back );
        };

        header__.append( backElement );

        const headerTitle = document.createElement( "div" );
        headerTitle.className = "headerTitle";
        headerTitle.innerHTML = `<div class="headerTitle_">${options.label}</div>`;
        header__.append( headerTitle )

        const space = document.createElement( "div" );
        space.style.alignItems = "center";
        space.style.display = "flex";
        space.style.flexDirection = "row";
        space.style.position = "absolute";
        space.style.right = "0";
        // @ts-ignore
        space.style["-webkit-app-region"] = "no-drag";

        if (options?.settings) {
            const settings = document.createElement( "div" );
            settings.className = "headerButton";
            settings.innerHTML = `<img src="assets/settings.png" draggable="false" style="image-rendering: pixelated; width: calc(8*var(--base2Scale));">`;
            settings.id = "settings";

            const divider = document.createElement( "dev" );
            divider.style.width = "2px";
            divider.style.height = "16px";
            divider.style.marginRight = "4px";
            divider.style.marginLeft = "4px";
            divider.style.backgroundColor = "lightgray";
            
            space.append( settings );
            space.append( divider );
        };

        const main = document.createElement( "div" );
        main.style.display = "flex";
        main.style.flexDirection = "row";
        main.style.marginRight = "0.4rem";
        main.style.marginLeft = "0.4rem";

        const close = document.createElement( "div" );
        close.className = "headerButton";
        close.style.marginRight = "0";
        close.style.marginLeft = "0";
        close.innerHTML = `<img src="assets/close.png" draggable="false" style="image-rendering: pixelated; width: 10px; height: 10px;">`;
        close.id = "closeApp";

        const maximize = document.createElement( "div" );
        maximize.className = "headerButton";
        maximize.style.marginRight = "0";
        maximize.style.marginLeft = "0";
        maximize.innerHTML = `<img src="assets/maximize.png" draggable="false" style="image-rendering: pixelated; width: 10px; height: 10px;">`;
        maximize.id = "maximizeApp";

        const minimize = document.createElement( "div" );
        minimize.className = "headerButton";
        minimize.style.marginRight = "0";
        minimize.style.marginLeft = "0";
        minimize.innerHTML = `<img src="assets/minimize.png" draggable="false" style="image-rendering: pixelated; width: 10px; height: 10px;">`;
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
     * @param { TagOptions } options
     * @returns { string }
     */
    createTag: (options) => {
        let style;
        let color;
        switch(options?.style) {
            default:
            case "neutral": style = "#1e1e1f"; color = "#ffffff"; break;
            case "primary": style = "#6cc349"; color = "#1e1e1f"; break;
            case "informative": style = "#8cb3ff"; color = "#1e1e1f"; break;
            case "notice": style = "#ffe866"; color = "#1e1e1f"; break;
            case "destructive": style = "#ff8080"; color = "#1e1e1f"; break;
            case "purple": style = "#AC90F3"; color = "#1e1e1f"; break;
        };

        return (
            `<div style="padding-right: 2px;align-self: flex-start;">
                <div
                    style="background-color: ${style};color: ${color};padding-left: 0.4rem;padding-right: 0.4rem;"
                ><div style="font-size: 14px;font-weight: 400;line-height: 18px;">${options.label}</div></div>
            </div>`
        );
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
        functions.onClick[options?.id] = options?.onClick;
        return (
            `<div
                class="oreUIButton oreUIButtonTab ${options?.selected ? "tabPressed" : ""}"
                style="width: 100%;"
                onClick='if(${!options?.selected}) { sound.play( "ui.click" ); functions.onClick["${options?.id}"](this); }'
                id="${options?.id ?? ""}"
            >
                <div class="oreUIButton_ oreUIButtonTabBackground" style="height: 2.5rem;">
                    <div class="oreUISpecular"></div>
                    <div class="oreUISpecular"></div>
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
                                <div class="_oreUIButton___">${options.label}</div>
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
     * @param { "button" | "switch" | "text" | "element" | "dropdown" | "input" | "textbox" | "panelbutton" | "slider" | "toggle" | "checkbox" | "radiogroup" | "upload" } type
     * @param { ElementOptions } options
     * @returns { string }
     */
    createElement: (type, options) => {
        switch(type) {
            case "element": {
                return (
                    `<div class="element_">
                        <div style="display: flex;flex-direction: row;gap: 8px;align-items: center;margin-top: ${options?.space ?? 12}px;">
                            <span class="elementHeader">${options.label}</span>
                            ${options?.tag ?? ""}
                        </div>
                        ${options?.description ? `<span class="elementSubtitle">${options.description}</span>` : ""}
                    </div>`
                );
            };

            case "panelbutton": {
                return (
                    `<div class="element">
                        ${options?.label ? `<span class="elementTitle">${options?.label}</span>` : ""}
                        ${options?.description ? `<span class="elementSubtitle">${options.description}</span>` : ""}
                        <div style="margin-top: 4px;margin-bottom: 4px;flex-direction: row;gap: 4px;">
                            ${options.buttons.map((b) => `<div style="width: 100%;">${b}</div>`).join("")}
                        </div>
                    </div>`
                );
            };

            case "dropdown": {
                /**
                 * @param { MouseEvent } e
                 */
                const event = (e) => {
                    /**
                     * @type { HTMLElement }
                     */
                    // @ts-ignore
                    const target = e.target;
                    if (
                        !target.classList.contains( "dropdownElement" )
                        && !target.classList.contains( "dropdownOption" )
                        || (
                            target.classList.contains( "dropdownElement" )
                            && !target.id.includes( options?.id )
                        )
                    ) {
                        const dropdownOptions = document.getElementById( options?.id + "-items" );
                        const dropdownE = document.getElementById( options?.id + "-element" );
                        const dropdownElement = document.getElementById( options?.id );
                        dropdownElement.setAttribute( "opened", "false" );
                        dropdownOptions.style.display = "none";
                        dropdownE.style.zIndex = "1";

                        document.removeEventListener("click", event);
                        console.log(e.target);
                    };
                };

                let selected = options?.selected ?? 0;
                functions.onChange[options?.id] = options?.onChange ?? (() => {});

                /**
                 * 
                 * @param { HTMLElement } e 
                 */
                functions.onClick[options?.id] = (e) => {
                    const element = document.getElementById(options.id + "-dropdown");
                    if(element.className.includes("dropdownDisabled")) return;
                    
                    sound.play( "ui.click" );
                    const dropdownOptions = document.getElementById( `${options?.id}-items` );
                    const dropdownE = document.getElementById( options?.id + "-element" );
                    if (!dropdownOptions || !dropdownE) return;
                    
                    let opened = e.getAttribute( "opened" ) == "true";
                    if (!opened) {
                        dropdownOptions.style.display = "block";
                        e.setAttribute( "opened", "true" );
                        dropdownE.style.zIndex = "10";
                    };

                    document.addEventListener("click", event);
                };

                const buildItems = () => options?.items?.map(
                    (i, index) => (
                        `<div class="dropdownOption ${selected == index ? "selected" : "" }" onClick="functions.onClick['${options?.id}-item'](${index})">
                            <div>${i}</div>
                            <img class="dropdownOptionCheck" src="assets/check_icon.png">
                        </div>`
                    )
                ).join( "" )

                functions.onClick[options?.id + "-item"] = (s = 0) => {
                    sound.play( "ui.modal_hide" );
                    const dropdownOptions = document.getElementById( options?.id + "-items" );
                    const dropdownItems = document.getElementById( options?.id + "-itemList" );
                    const dropdownE = document.getElementById( options?.id + "-element" );
                    const dropdownElement = document.getElementById( options?.id );
                    if (!dropdownOptions || !dropdownItems || !dropdownE || !dropdownElement) return;

                    dropdownElement.setAttribute( "opened", "false" );
                    dropdownOptions.style.display = "none";
                    dropdownE.style.zIndex = "1";

                    selected = s;
                    dropdownElement.setAttribute( "value", selected.toString() );
                    // @ts-ignore
                    document.getElementById( options?.id + "-text" ).innerText = options.items.find((i, index) => selected == index);
                    dropdownItems.innerHTML = buildItems();
                    document.removeEventListener("click", event);
                    functions.onChange[options?.id]({ value: selected });
                };

                return (
                    `<div class="element" style="z-index: 1;" id="${options?.id}-element">
                        <div style="${options?.inline ? "flex-direction: row;place-content: space-between;align-items: center;margin-top: -4px;margin-bottom: -4px;" : ""}">
                            <div>
                                <span class="elementTitle">${options?.label ?? ""}</span>
                                ${options?.description ? `<span class="elementSubtitle">${options?.description}</span>` : ""}
                            </div>
                            <div
                                id="${options.id + "-dropdown"}"
                                class="dropdown oreUIButtonSecondary ${options?.disabled ? "dropdownDisabled" : ""}"
                                style="${options?.inline ? "width: 180px;margin-top: 4px;": "width: 100%;"} margin-bottom: 4px;"
                            >
                                <div class="oreUIButton_ oreUIButtonSecondaryBackground">
                                    <div class="oreUISpecular"></div>
                                    <div class="oreUISpecular"></div>
                                    <div style="width: 100%">
                                        <div class="dropdownElement" id="${options?.id}" opened="false" value="${selected}" onClick="functions.onClick['${options?.id}'](this);">
                                            <div style="pointer-events: none;" id="${options?.id}-text">${options?.items?.find((i, index) => selected == index) ?? "Please select an option..."}</div>
                                            <img style="pointer-events: none;" src="assets/arrow_down.png">
                                        </div>
                                        <div class="dropdownOptions" id="${options?.id}-items" style="display: none;">
                                            <div id="${options?.id}-itemList">${buildItems()}</div>
                                            <div style="height: 2px;background-color: #8c8d90;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                );
            };

            case "input": {
                functions.onChange[options?.id] = options?.onChange ?? (() => {});
                return (
                    `<div class="element">
                        ${options?.label ? `<span class="elementTitle">${options?.label}</span>` : `<div style="margin: 6px 0;"></div>`}
                        <input
                            id="${options?.id ?? ""}"
                            type="${options?.type ?? "text"}"
                            min="${options?.min ?? 0}"
                            max="${options?.max ?? Infinity}"
                            placeholder="${options?.placeholder ?? ""}"
                            value="${options?.value ?? ""}"
                            ${options?.disabled ? "disabled" : ""}
                            onChange="functions.onChange['${options?.id}'](this);"
                        ></input>
                        ${options?.description ? `<div style="color: #d0d1d4;font-size: 0.8rem;margin-bottom: 4px;margin-top: 4px;">${options.description}</div>` : ""}
                    </div>`
                );
            };

            case "textbox": {
                return (
                    `<div class="element">
                        <span class="elementTitle">${options.label}</span>
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
                functions.onChange[options?.id] = options?.onChange ?? (() => {});
                return (
                    `<div class="element">
                        <span class="elementTitle">${options.label}</span>
                        <div class="dropdown oreUIButtonSecondary">
                            <div class="oreUIButton_ oreUIButtonSecondaryBackground">
                                <div class="oreUISpecular"></div>
                                <div class="oreUISpecular"></div>
                                <label
                                    style="font-size: 13px;cursor: pointer;width: auto;display: flex;gap: 8px;height: inherit;align-items: center;padding: 0 6px;"
                                    id="${options?.text?.// @ts-ignore
                                    id ?? ""}"
                                    for="${options?.id ?? ""}"
                                >
                                    <img src="assets/import.png" draggable="false" style="image-rendering: pixelated; height: 22px; width: 24px;">
                                    <div style="font-family: 'MinecraftFive';color: black;font-weight: bold;font-size: 10px;text-overflow: ellipsis;overflow: hidden;height: inherit;">${options?.text?.// @ts-ignore
                                    body ?? ""}</div>
                                </label>
                                <input
                                    name="packType"
                                    class="_oreUIButton"
                                    style="display: none;"
                                    type="file"
                                    accept="${options?.accepts ?? ""}"
                                    id="${options?.id ?? ""}"
                                    onChange='functions.onChange["${options?.id}"](this);'
                                    onClick="sound.play( 'ui.click' );"
                                />
                            </div>
                        </div>
                    </div>`
                );
            };

            case "switch": {
                let toggled = options?.toggled ?? false;
                functions.onChange[options.id] = options?.onChange ?? (() => {});
                functions.onClick[options.id + "-switch"] = (e) => {
                    const thumb = document.getElementById(options.id + "-thumb");
                    if(!e.className.includes("switchDisabled")) {
                        toggled = !toggled;
                        Functions.switch(thumb, toggled);
                        functions.onChange[options.id]({ value: toggled, id: options.id });
                    };
                };

                return (
                    `<div class="element">
                        <div style="flex-direction: unset;margin-top: 4px;margin-bottom: 4px;align-items: center;justify-content: space-between;">
                            <div style="align-self: center;">
                                <span class="elementTitle">${options.label}</span>
                                ${options?.description ? `<span class="elementSubtitle">${options.description}</span>` : ""}
                            </div>
                            <div
                                class="switch ${options?.disabled ? "switchDisabled": ""}"
                                id="${options.id}"
                                value="${toggled}"
                                onClick="functions.onClick['${options.id}-switch'](this);"
                                style="flex-direction: row;user-select: none;"
                            >
                                <div class="switchBackgrounds">
                                    <div style="flex-direction: row;height: 100%;">
                                        <div class="switchBackground switchBackgroundOn">
                                            <div><img src="assets/onImage.png" style="height: 12px;width: 2px;image-rendering: pixelated;"></div>
                                            <div class="oreUISpecular"></div>
                                            <div class="oreUISpecular"></div>
                                        </div>
                                        <div class="switchBackground switchBackgroundOff">
                                            <div><img src="assets/offImage.png" style="height: 10px;width: 10px;image-rendering: pixelated;"></div>
                                            <div class="oreUISpecular"></div>
                                            <div class="oreUISpecular"></div>
                                        </div>
                                    </div>
                                    <div class="switchThumb ${toggled ? "switchThumbOn" : "switchThumbOff"}" id="${options.id + "-thumb"}">
                                        <div class="switchThumb_">
                                            <div class="switchThumbBackground">
                                                <div class="oreUISpecular sliderSpecular"></div>
                                                <div class="oreUISpecular sliderSpecular"></div>
                                            </div>
                                            <div class="switchShadow"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                );
            };

            case "checkbox": {
                let checked = options?.checked ?? false;
                functions.onChange[options.id] = options?.onChange ?? (() => {});
                functions.onClick[options.id + "-check"] = (e) => {
                    const check = document.getElementById(options.id + "-check");
                    if(!e.className.includes("checkboxDisabled")) {
                        sound.play( "ui.click" );
                        checked = !checked;
                        check.style.display = checked ? "flex" : "none";
                        functions.onChange[options.id]({ value: checked, id: options.id });
                    };
                };
                
                return (
                    `<div class="element">
                        <div style="flex-direction: unset;margin-top: 4px;margin-bottom: 4px;align-items: center;">
                            <div
                                class="checkbox ${options.disabled ? "checkboxDisabled" : ""}"
                                onClick="functions.onClick['${options.id}-check'](this);"
                                value=${checked}
                            >
                                <div class="oreUISpecular"></div>
                                <div class="oreUISpecular"></div>
                                <div
                                    class="checkboxCheck"
                                    id="${options.id + "-check"}"
                                    style="display: ${checked ? "flex" : "none"};"
                                >
                                    <img src="assets/check_icon.png" style="height: 12px;width: 16px;image-rendering: pixelated;">
                                </div>
                            </div>
                            <div>
                                <span class="elementTitle">${options.label}</span>
                                ${options?.description ? `<span class="elementSubtitle">${options.description}</span>` : ""}
                            </div>
                        </div>
                    </div>`
                );
            };

            case "button": {
                let style;
                let background;
                switch(options?.variant) {
                    default:
                    case "primary": style = "oreUIButtonPrimary"; background = "oreUIButtonPrimaryBackground"; break;
                    case "secondary": style = "oreUIButtonSecondary"; background = "oreUIButtonSecondaryBackground"; break;
                    case "destructive": style = "oreUIButtonDestructive"; background = "oreUIButtonDestructiveBackground"; break;
                    case "purple": style = "oreUIButtonPurple"; background = "oreUIButtonPurpleBackground"; break;
                    case "purple_hero": style = "oreUIButtonHero oreUIButtonPurple"; background = "oreUIButtonPurpleBackground"; break;
                    case "hero": style = "oreUIButtonHero oreUIButtonPrimary"; background = "oreUIButtonPrimaryBackground"; break;
                };

                functions.onClick[options.id] = options?.onClick ?? (() => {});
                functions.onClick[options.id + "-button"] = (e) => {
                    if (!e.className.includes("buttonDisabled")) {
                        sound.play(options?.sound ?? "ui.click");
                        functions.onClick[options.id](e);
                    };
                };

                return (
                    `<div class="oreUIButton ${style} ${options?.disabled ? "buttonDisabled" : ""}" onClick='functions.onClick["${options?.id}-button"](this);' id="${options?.id ?? ""}">
                        <div class="oreUIButton_ ${background}">
                            <div class="oreUISpecular"></div>
                            <div class="oreUISpecular"></div>
                            <div class="_oreUIButton">
                                <div class="_oreUIButton_">
                                    <div class="_oreUIButton__">
                                        ${options?.icon ? `<img src="${options.icon}" style="width: 24px;margin-right: 0.4rem;">` : ""}
                                        <div class="_oreUIButton___">${options.label}</div>
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
                                <span class="elementTitle" id="${options?.useLabel && options?.id ? options?.id : ""}">${options.label}</span>
                                ${
                                    options?.style == "code"
                                    ? `<pre style="margin-top: 4px;"><code class="hljs" id="${!options?.useLabel && options?.id ? options?.id : ""}">${options?.default ?? ""}</code></pre>`
                                    : `<span class="elementSubtitle" id="${!options?.useLabel && options?.id ? options?.id : ""}">${options?.description ?? ""}</span>`
                                }
                            </div>
                        </div>
                    </div>`
                )
            };

            case "toggle": {
                functions.onChange[options?.id] = options?.onChange ?? (() => {});

                let selected = options?.selected ?? 0;
                const buildItems = () => options.items.map(
                    (i, index) => {
                        const isSelected = selected == index;
                        const icon = typeof i.icon == "string" ? i.icon : (isSelected ? i.icon?.selected : i.icon?.unselected);
                        return (
                            `<div
                                class="oreUIButton ${isSelected ? "oreUIToggleSelected" : "oreUIButtonSecondary"}"
                                style="width: 100%;margin-left: -1px;margin-right: -1px;"
                                onClick="functions.onClick['${options.id}-item'](this, ${index})"
                            >
                                <div class="oreUIButton_ ${isSelected ? "oreUIToggleSelectedBackground" : "oreUIButtonSecondaryBackground"}" style="height: 2.5rem;">
                                    <div class="oreUISpecular"></div>
                                    <div class="oreUISpecular"></div>
                                    <div class="_oreUIButton">
                                        <div class="_oreUIButton_">
                                            <div class="_oreUIButton__">
                                                ${
                                                    i?.icon
                                                    ? `<div>
                                                        <img style="height: 24px; width: 24px;" src="${icon}" draggable="false">
                                                    </div>
                                                    <div style="height: 0.8rem; width: 0.8rem;"></div>`
                                                    : ""
                                                }
                                                <div class="_oreUIButton___">${i.label}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ${isSelected ? `<div class="toggleSelected"></div>` : ""}
                            </div>`
                        );
                    },
                ).join( "" );
                const getDescription = () => {
                    const item = options.items.filter((i, index) => selected == index)[0]
                    return item?.description ? `<div style="color: #d0d1d4;font-size: 0.8rem;margin-bottom: 4px;margin-top: 2px;">${item.description}</div>` : "";
                };

                functions.onClick[options?.id + "-item"] = (e, s = 0) => {
                    const toggleElement = document.getElementById(options.id + "-items");
                    if (toggleElement.className.includes("toggleDisabled")) return;
                    sound.play( "ui.click" );

                    selected = s;
                    document.getElementById(options.id).setAttribute("value", selected.toString());
                    document.getElementById(options.id + "-items").innerHTML = buildItems();
                    document.getElementById(options.id + "-description").innerHTML = getDescription();
                    functions.onChange[options?.id]({ value: selected });
                };

                return (
                    `<div class="element" id="${options.id}" value="${selected}">
                        <span class="elementTitle">${options.label}</span>
                        ${options?.description ? `<span class="elementSubtitle">${options.description}</span>` : ""}
                        <div
                            class="${options?.disabled ? "toggleDisabled" : ""}"
                            style="flex-direction: row;margin-top: 4px;margin-bottom: 4px;"
                            id="${options.id + "-items"}"
                        >${buildItems()}</div>
                        <div id="${options.id + "-description"}">${getDescription()}</div>
                    </div>`
                );
            };

            case "radiogroup": {
                functions.onChange[options?.id] = options?.onChange ?? (() => {});

                let selected = options?.selected ?? 0;
                const buildItems = () => options.items.map(
                    (i, index) => {
                        const isSelected = selected == index;
                        return (
                            `<div style="flex-direction: unset;margin-top: 8px;margin-bottom: 8px;align-items: center;height: 24px;">
                                <div class="radioGroup" onClick="functions.onClick['${options.id}-item'](${index});">
                                    <div class="oreUISpecular"></div>
                                    <div class="oreUISpecular"></div>
                                    <div class="radioGroupCheck" style="display: ${isSelected ? "flex" : "none"};">
                                        <div style="height: 6px;width: 6px;background-color: white;"></div>
                                    </div>
                                </div>
                                <div>
                                    <span class="elementTitle">${i.label}</span>
                                    ${i?.description ? `<span class="elementSubtitle">${i.description}</span>` : ""}
                                </div>
                            </div>`
                        );
                    },
                ).join( "" );

                functions.onClick[options.id + "-item"] = (s = 0) => {
                    const radioGroupElement = document.getElementById(options.id + "-items");
                    if(!radioGroupElement.className.includes("radioGroupDisabled")) {
                        sound.play( "ui.modal_hide" );
                        
                        selected = s;
                        document.getElementById(options.id).setAttribute("value", selected.toString());
                        document.getElementById(options.id + "-items").innerHTML = buildItems();
                        functions.onChange[options.id]({ value: selected, id: options.id });
                    };
                };

                return (
                    `<div class="element" id="${options.id}" value="${selected}">
                        <span class="elementTitle">${options.label}</span>
                        <div
                            class="${options?.disabled ? "radioGroupDisabled" : ""}"
                            style="margin-top: 4px;margin-bottom: 4px;"
                            id="${options.id + "-items"}"
                        >${buildItems()}</div>
                    </div>`
                );
            };

            case "slider": {
                functions.onChange[options?.id] = options?.onChange ?? (() => {});

                const min = options?.min ?? 0;
                const max = options?.max ?? 100;
                let value = Number(options?.value) ?? 0;
                functions.onChange[options.id + "-slider"] = (e) => {
                    const slider = document.getElementById(options.id);
                    if(!slider.className.includes("sliderDisabled")) value = e.value;
                    else e.value = value;

                    const progress = (100 * value) / max;
                    document.getElementById(options.id + "-progress").style.clipPath = `inset(0px ${100 - progress}% 0px 0px)`;
                    document.getElementById(options.id + "-thumb").style.left = `${progress}%`;
                    document.getElementById(options.id + "-progressText").innerText = options?.percentage ? (progress + "%") : value.toString();
                    functions.onChange[options.id]({ value });
                };

                return (
                    `<div class="element">
                        <div style="display: flex;flex-direction: row;justify-content: space-between;">
                            <span class="elementTitle">${options.label}</span>
                            <span class="elementTitle" id="${options.id}-progressText">${options?.percentage ? `${(100 * value) / max}%` : value}</span>
                        </div>
                        ${options?.description ? `<span class="elementSubtitle">${options.description}</span>` : ""}
                        <div class="slider ${options?.disabled ? "sliderDisabled" : ""}" id="${options.id}">
                            <div style="height: 1.4rem;margin-top: 8px;justify-content: center;">
                                <div class="sliderLeftProgress">
                                    <div class="oreUISpecular"></div>
                                    <div class="oreUISpecular"></div>
                                </div>
                                <div id="${options.id}-progress" class="sliderProgress" style="clip-path: inset(0px ${100 - ((100 * value) / max)}% 0px 0px);">
                                    <div class="oreUISpecular"></div>
                                    <div class="oreUISpecular"></div>
                                </div>
                                <div id="${options.id}-thumb" class="sliderThumb" style="left: ${(100 * value) / max}%;">
                                    <div class="sliderThumbBackground">
                                        <div class="oreUISpecular sliderSpecular"></div>
                                        <div class="oreUISpecular sliderSpecular"></div>
                                    </div>
                                    <div class="sliderShadow"></div>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="${min}"
                                max="${max}"
                                value="${value}"
                                class="hiddenSlider"
                                onInput="functions.onChange['${options.id + "-slider"}'](this);"
                            >
                        </div>
                    </div>`
                );
            };

            default: return "";
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
                        <div class="oreUISpecular"></div>
                        <div class="oreUISpecular"></div>
                        <div style="width: 2.4rem; height: 2.4rem;"></div>
                        <div style="flex: 1 1 0;"></div>
                        <div style="font-size: 14px;">${options.label}</div>
                        <div style="flex: 1 1 0;"></div>
                        <div style="width: 2.4rem ;height: 2.4rem;">
                            ${
                                options?.close
                                ? (
                                    `<div class="ModalHeaderButton" onClick="sound.play( 'ui.click' );BedrockTools.clearModal();">
                                        <img src="assets/cross_white.png" draggable="false" style="image-rendering: pixelated;">
                                    </div>`
                                )
                                : ""
                            }
                        </div>
                    </div>
                    <div style="height: var(--base2Scale); width: 100%; background-color: #313233;"></div>
                    <div style="background-color: #313233;">
                        ${
                            options?.body
                            ? (
                                `<div style="flex-direction: row;padding: 16px;justify-content: center;align-items: center;">
                                    ${options?.icon ? `<img src="${options.icon}" style="height: 112px; width: 112px;"><div style="width: 2.4rem ;height: 2.4rem;"></div>` : ""}
                                    <div style="color: #ffffff;font-family: NotoSans;font-size: 13px;">${options?.body}</div>
                                </div>`
                            )
                            : ""
                        }
                        
                        ${options?.bodyElements ? options?.bodyElements.join( "" ): ""}
                    </div>
                    ${
                        options?.elements
                        ? `<div style="background-color: #48494a;user-select: none;">${options?.elements.join( "" )}</div>`
                        : ""
                    }
                </div>
            </div>`
        );
    },
};
