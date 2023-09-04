declare namespace BedrockTools {
    interface Route {
        name: string;
        route: string;
        component(): string;
        rpc?: string;
        extra?(): void;
    }

    const version: string;
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

    const functions: {
        onClick: {};
        onChange: {};
    };

    function loadUI(route: Route, isBack?: boolean): Promise<void>;
    function loadModal(component: string): void;

    interface ToastOptions {
        title?: string;
        body?: string;
        icon?: string;
        timeout?: number;
        instant?: boolean;
        onClick: () => {};
    }
    function sendToast(options: ToastOptions): void;
}