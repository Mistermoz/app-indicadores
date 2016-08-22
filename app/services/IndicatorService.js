(function () {
  'use strict';

  angular.module('app').service('IndicatorService', IndicatorService);

  function IndicatorService($http, $q) {
  	return({
        getAll: getAll
    });

	  function getAll(indicadores) {
      var promises = [];

      angular.forEach(indicadores, function (value, key) {
        var deffered  = $q.defer();

        $http.get('http://mindicador.cl/api/' + value + '').
        success(function(data){
            deffered.resolve(data);
        }).
        error(function(error){
            deffered.reject();
        });

        promises.push(deffered.promise);
      });

      return $q.all(promises).then( function (response) {
        return( response );
      }, function ( response ) {
        if (
          ! angular.isObject( response.data ) ||
          ! response.data.message
          ) {
          return( $q.reject( "An unknown error occurred." ) );
        }
        return( $q.reject( response.data.message ) );
      });
    }
  }
})();