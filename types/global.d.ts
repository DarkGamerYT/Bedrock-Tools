interface Route {
    name: string;
    route: string;
    component(): string;
    metadata: {
        rpc?: string;
        onLoad?(): any;
    };
};

interface ToastOptions {
    title?: string;
    body?: string;
    icon?: string;
    timeout?: number;
    instant?: boolean;
    onClick?(): any;
};

declare const BedrockTools: {
    version: string;
    startTime: number;

    requestFacet(facet: string): any;

    logger: {
        info: (...data: any) => void;
        debug: (...data: any) => void;
        error: (...data: any) => void;
    };

    loadUI(route: Route, isBack?: boolean): Promise<void>;
    loadModal(component: string): void;
    clearModal(): void;

    sendToast(options: ToastOptions): void;
};

interface HeaderOptions {
    label: string;
    back?: boolean;
    settings?: boolean;
};

interface TagOptions {
    label: string;
    style?: (
        "neutral" |
        "primary" |
        "informative" |
        "notice" |
        "destructive" |
        "purple"
    )
};

interface TabsOptions { tabs: string[]; };
interface TabOptions {
    text?: string;
    icon?: string;
    id: string;
    selected?: boolean;
    onClick: () => any;
};

interface ElementsOptions { elements: string[] };

interface ModalOptions {
    header: string;
    body?: string;
    icon?: string;
    close?: boolean;
    bodyElements?: string[];
    elements?: string[]
};

interface ElementOptions {
    title?: string;
    subtitle?: string;
    tag?: string;
    space?: string;
};

interface ButtonElementOptions {
    id: string;
    label: string;
    icon?: string;
    variant?: "primary" | "secondary" | "destructive" | "hero" | "purple";
    sound?: string;
    disabled?: boolean;
    onClick(): string;
};

interface SwitchElementOptions {
    id: string;
    label: string;
    description?: string;
    toggled?: boolean;
    disabled?: boolean;
    onChange(): string;
};

interface CheckboxElementOptions {
    id: string;
    label: string;
    description?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange(): string;
};

interface SliderElementOptions {
    id: string;
    label: string;
    description?: string;
    min?: number;
    max?: number;
    value?: number;
    percentage?: boolean;
    disabled?: boolean;
    onChange(): string;
};

interface InputElementOptions {
    id: string;
    label?: string;
    description?: string;
    type?: string;
    min?: number;
    max?: number;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange(): string;
};

interface DropdownElementOptions {
    id: string;
    label: string;
    description?: string;
    items?: string[];
    selected?: number;
    inline?: boolean;
    disabled?: boolean;
    onChange(): string;
};

interface RadioGroupElementOptions {
    id: string;
    label: string;
    items: {
        label: string;
        description?: string;
    }[];
    selected?: number;
    disabled?: boolean;
    onChange(): string;
};

interface PanelButtonElementOptions {
    id: string;
    label?: string;
    description?: string;
    buttons: string[];
};

interface ToggleElementOptions {
    id: string;
    label: string;
    description?: string;
    items: {
        label: string;
        description?: string;
        icon?: string | {
            selected?: string;
            unselected?: string;
        };
    }[];
    selected?: number;
    disabled?: boolean;
    onChange(): string;
};

interface TextElementOptions {
    id: string;
    label: string;
    description?: string;
    default?: string;
    useLabel?: boolean;
    style?: "code";
};

interface TextboxElementOptions {
    id: string;
    label: string;
    startHeight?: number;
};

interface UploadElementOptions {
    id: string;
    label: string;
    label: {
        id: string;
        body: string;
    };
    accepts?: string;
    onChange(): string;
};

const elementsOptions: {
    "element": ElementOptions,
    "button": ButtonElementOptions,
    "switch": SwitchElementOptions,
    "checkbox": CheckboxElementOptions,
    "slider": SliderElementOptions,
    "input": InputElementOptions,
    "dropdown": DropdownElementOptions,
    "radiogroup": RadioGroupElementOptions,
    "panelbutton": PanelButtonElementOptions,
    "toggle": ToggleElementOptions,

    "text": TextElementOptions,
    "textbox": TextboxElementOptions,
    "upload": UploadElementOptions,
};

declare const Components: {
    createHeader(options: HeaderOptions): string;
    createTag(options: TagOptions): string;
    createModal(options: ModalOptions): string;
    createTabs(options: TabsOptions): string;
    createTab(options: TabOptions): string;
    createElements(options: ElementsOptions): string;
    createElement<T extends keyof typeof elementsOptions>(
        type: T,
        options: typeof elementsOptions[T]
    ): string;
};