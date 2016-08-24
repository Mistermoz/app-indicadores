(function () {
  'use strict';

  angular.module('app').controller('HomeController', HomeController);

  function HomeController(IndicatorService, myConfig, $scope) {
    var vm = this;

    vm.ind = myConfig.indicators;

    vm.loading = false;

    vm.chartOpen = '';

    vm.data = [];

    vm.option = {
	    chart: {
	        type: 'discreteBarChart',
	        height: 450,
	        width: 900,
	        margin : {
	            top: 20,
	            right: 0,
	            bottom: 50,
	            left: 60
	        },
	        x: function(d){ return d.label; },
	        y: function(d){ return d.value; },
	        showValues: false,
	        transitionDuration: 500,
	        xAxis: {
	        	axisLabel: 'Días'
	        },
	        yAxis: {
	            axisLabel: '$',
	            tickFormat: function(d){
                  return '$' + d3.format('.')(d);
              	},
	        },
	        yDomain: [600,800],
	        tooltip: {
                contentGenerator: function (e) {
					var series = e.series[0];
					if (series.value === null) {return;}
					var rows = 
						"<tr>" +
						"<td class='x-value'>" + e.data.type + "</td>" + 
						"</tr>" +
						"<tr>" +
						"<td class='key'>" + 'Valor: ' + "</td>" +
						"<td class='x-value'><strong>" + (series.value?series.value:0) + "</strong></td>" +
						"</tr>" +
						"<tr>" +
						"<td class='key'>" + 'Variación: ' + "</td>" +
						"<td class='x-value'><strong>" + (Math.abs(e.data.variation)?Math.abs(e.data.variation):0) + "</strong></td>" +
						"</tr>";

					return "<table>" +
						"<tbody>" + 
						rows + 
						"</tbody>" +
						"</table>";
                } 
            },
            noData: 'Cargando...'
	    }
	};

	vm.options = [];

    vm.getIndicators = function () {
    	vm.loading = true;

    	IndicatorService.getAll(myConfig.indicators).then(function (data) {
	    	angular.forEach(data, function (value, key) {
	    		var list = [];

    			for (var i = 0, len = value.serie.length, last = 0; i < len; i++) {
    				var d = new Date(value.serie[i].fecha);
    				var lbl = d.getDate();
    				if(value.codigo === 'ipc' || value.codigo === 'utm') {
    					var now = new Date().getFullYear();
    					lbl = d.getMonth() + 1;

    					if(d.getFullYear() !== now) break;
    				}
    				var tmp = {};
    				var variation = 0;
    				var val = 0;
    				var next = i + 1;

    				if(i !== (len -1)) {
    					variation = value.serie[i].valor - value.serie[next].valor;	
    				}

    				if(value.codigo === 'ipc') {
    					val = value.serie[i].valor.toFixed(1);
						variation = variation.toFixed(2);
					}else {
						val = value.serie[i].valor;
						variation = variation.toFixed(0);
					}

					tmp = {
	    				'label': lbl,
	    				'value': val,
	    				'type': value.codigo,
	    				'variation': variation
	    			};

	    			list.push(tmp);
	    			last = i;

	    			if(value.codigo === 'dolar' || value.codigo === 'euro' || value.codigo === 'uf') {
	    				if(lbl === 1) break;
	    			}
				}

				vm.data[key][0].values = vm.sort(list);

				if(value.codigo === 'dolar' || value.codigo === 'euro' || value.codigo === 'uf') {
    				vm.options[key].chart.yDomain = [parseInt((vm.data[key][0].values[0].value - 20)), parseInt((vm.data[key][0].values[last].value + 20))];
    			}

    			if(value.codigo === 'utm') {
    				vm.options[key].chart.yDomain = [44000, 47000];
    				vm.options[key].chart.xAxis.axisLabel = 'Meses';
    			}

    			if(value.codigo === 'ipc') {
    				vm.options[key].chart.yDomain = [0, 1];
    				vm.options[key].chart.yAxis.axisLabel = '%';
    				vm.options[key].chart.xAxis.axisLabel = 'Meses';
    				vm.options[key].chart.yAxis.tickFormat = function(d){
	                  return d3.format('.')(d);
	              	};
    			}
	    	});

	    	vm.loading = false;
	    }, function( errorMessage ) {
	          console.warn( errorMessage );
	      }
	    );
    };

    vm.showChart = function (key) {
    	vm.chartOpen = key;
    };

    vm.sort = function (obj) {
    	var listOrder = obj.slice(0);
		listOrder.sort(function(a,b) {
		    return a.label - b.label;
		});

		return listOrder;
    };

	vm.init = function() {
		for(var i = 0; i < myConfig.indicators.length; i++) {
			var a = [{
		    'key': myConfig.indicators[i],
		    'values': []
			}];
			vm.data.push(a);

			vm.options[i] = angular.copy(vm.option);
		}

		vm.getIndicators();
	};

	vm.init();
  }
})();
