module.exports = {
    isTransitioning: false,
    routes: [],
    history: {
        list: [],
        async go(path) {
            window.logger.debug( "[ROUTER] Replacing path to", path );

            this.list.push( path );
            const route = BedrockTools.router.routes.find((r) => r.route == path);
            BedrockTools.router.isTransitioning = true;

            if (!route) return BedrockTools.loadUI(BedrockTools.router.routes.find((r) => r.route == "/empty_route"));
            await BedrockTools.loadUI( route );
        },
        async goBack() {
            if (this.list.length <= 1 || BedrockTools.router.isTransitioning) return;
            window.logger.debug( "[ROUTER] Going back." );
            
            this.list.pop();
            if (!this.list[this.list.length - 1]) return;
            const route = BedrockTools.router.routes.find((r) => r.route == this.list[this.list.length - 1]);
            if (!route) return BedrockTools.loadUI(BedrockTools.router.routes.find((r) => r.route == "/empty_route"), true);
            
            BedrockTools.router.isTransitioning = true;
            await BedrockTools.loadUI( route, true );
        },
    },
};