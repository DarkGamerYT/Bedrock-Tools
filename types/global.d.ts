declare namespace BedrockTools {
    const version: string;
    const startTime: number;
    
    interface Route {
        name: string;
        route: string;
        component: () => string;
        metadata: {
            rpc?: string;
            onLoad?: () => any;
        };
    }

    const router: {
        isTransitioning: boolean;
        routes: Route[];
        history: {
            list: string[];
            go(path: string): Promise<void>;
            goBack(): Promise<void>;
        };
    };

    const sound: { play(id: string): void; };
    const settings: {
        get(key: string): any;
        set(key: string, value: any): void;
    };
    const localisation: {
        getLocale: () => string;
        getLangs: () => string[];
        translate: (id: string) => string;
        translateWithParameters: (id: string, params: string[]) => string;
    };

    const functions: {
        onClick: {};
        onChange: {};
    };

    function loadUI(route: Route, isBack?: boolean): Promise<void>;
    function loadModal(component: string): void;
    function clearModal(): void;

    interface ToastOptions {
        title?: string;
        body?: string;
        icon?: string;
        timeout?: number;
        instant?: boolean;
        onClick?: () => any;
    }
    function sendToast(options: ToastOptions): void;
}