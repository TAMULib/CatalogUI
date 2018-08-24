app.controller('TestHoldingController', function ($controller, $scope, WsApi, $sanitize, $q) {

    angular.extend(this, $controller('AbstractController', {$scope: $scope}));

    $scope.holdings = [];

    $scope.buttons = [];

    $scope.buttonConfigs = [];

    $scope.loading = false;

    $scope.getHoldingInfo = function(bibId) {
        $scope.loading = true;
        var holdingPromise = WsApi.fetch({
                'endpoint': '/private/queue',
                'controller': 'catalog-access',
                'method': 'get-holdings',
                'httpMethod': 'GET',
                'query': {'bibId':bibId}}).then(
                    function(result) {
                        var response = angular.fromJson(result.body);
//                        $scope.holdings = response.payload['ArrayList<CatalogHolding>'];
                        return response.payload['ArrayList<CatalogHolding>'];
                    }
                );

        var buttonPromise = WsApi.fetch({
                'endpoint': '/private/queue',
                'controller': 'catalog-access',
                'method': 'get-buttons',
                'httpMethod': 'GET',
                'query': {'bibId':bibId}}).then(
                    function(result) {
                        var response = angular.fromJson(result.body);
                        return response.payload['HashMap'];
                    }
                );

        var buttonConfigPromise = WsApi.fetch({
                'endpoint': '/private/queue',
                'controller': 'catalog-access',
                'method': 'get-button-config',
                'httpMethod': 'GET'}).then(
                    function(result) {
                        var response = angular.fromJson(result.body);
                        return response.payload['ArrayList<PersistedButton>'];
                    }
                );

        $q.all([holdingPromise,buttonPromise,buttonConfigPromise]).then(function(result) {
            $scope.holdings = result[0];
            $scope.buttons = result[1];
            $scope.buttonConfigs = result[2];
            $scope.loading = false;

            $scope.getHoldingButton = function(mfhd,linkText) {
                var holdingButton = false;
                $.each($scope.buttons, function(k,v) {
                    $.each(v,function(i,button) {
                        if (k==mfhd && button.linkText === linkText) {
                            console.log(linkText);
                            holdingButton = button;
                            return;
                        }
                    });
                    if (holdingButton) {
                        return;
                    }
                });
                console.log(holdingButton);
                return holdingButton;
            };
        });


    };

});