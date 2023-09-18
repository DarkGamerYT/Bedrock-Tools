const Router = {
    isTransitioning: false,
    routes: [],
    history: {
        list: [],
        async go(path) {
            BedrockTools.logger.debug( "[ROUTER] Replacing path to", path );

            this.list.push( path );
            const route = Router.routes.find((r) => r.route == path);
            Router.isTransitioning = true;

            if (!route) return BedrockTools.loadUI(Router.routes.find((r) => r.route == "/empty_route"));
            await BedrockTools.loadUI( route );
        },
        async goBack() {
            if (this.list.length <= 1 || Router.isTransitioning) return;
            BedrockTools.logger.debug( "[ROUTER] Going back." );
            
            this.list.pop();
            if (!this.list[this.list.length - 1]) return;
            const route = Router.routes.find((r) => r.route == this.list[this.list.length - 1]);
            if (!route) return BedrockTools.loadUI(Router.routes.find((r) => r.route == "/empty_route"), true);
            
            Router.isTransitioning = true;
            await BedrockTools.loadUI( route, true );
        },
    },

    addRoute: (...routes) => {
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            if (Router.routes.find((r) => r.route == route.route)) throw new Error( "Route already exists" );
            const defaultRoute = Router.routes.find((r) => r.default == true);
            if (route.default && !defaultRoute) {
                Router.routes.push(route);
                Router.history.go( route.route );
            } else {
                if (route.default) delete route.default;
                Router.routes.push(route);
            };
        };
    },
};

module.exports = Router;