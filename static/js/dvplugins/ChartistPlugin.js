var ChartistPlugin = (function(){
    function _Plugin(){
        function getColors(range){;
            var _fullList = UTILITY.ColorList;
            var _colors = _fullList;
            if(range != undefined){
                if(range==1){
                    _colors = _fullList[1];
                }
                else{
                    _colors = [];
                    var _range = range>_fullList.length ? range : _fullList.length;
                    for(var i = 0;i<_range;i++){
                        _colors.push(_fullList[i]);
                    }
                }
            }
            return _colors;
        }

        var testObj = {x:0,y:0};
        var chartMatrix = {};
        
        this.makeMultiColumChart = function(dataSets, containerID,style){
            //console.log(dataSets);


            var data = [];

            for(var i = 0;i<dataSets.length;i++){
                var dataItem = {};
                var labels = [];
                var values = [];

                for(var v in dataSets[i].data){
                    labels.push(v.split(dataSets[i].name+" ")[1]);
                    values.push(dataSets[i].data[v]);
                }

                var dataItem = {
                    labels:labels,
                    values:values,
                    name:dataSets[i].name,
                    type:"bar"
                };
                data.push(dataItem);

            }

            var series = [];

            for(var j = 0;j<data.length;j++){
                series[j] = [];
                for(var k = 0;k<data[j].values.length;k++){
                    series[j].push(data[j].values[k]);
                }
            }



            new Chartist.Bar('#'+containerID, {
              labels: data[0].labels,
              series: series
            }, {
              seriesBarDistance: 10,
              axisX: {
                offset: 60
              },
              axisY: {
                offset: 80,
                labelInterpolationFnc: function(value) {
                  return value + ' CHF'
                },
                scaleMinSpace: 15
              }
            });
            
        }

        this.makeBarChart = function(_data,containerID,style){
            var labels = [];
            var values = [];

            var sortedLabels = [];
            for(var v in _data){
                sortedLabels.push(v);
            }

            var sl = sortedLabels.sort();

            for(var i = 0;i<sl.length;i++){
                labels.push(sl[i]);
                values.push(_data[sl[i]]);
            }
            new Chartist.Bar('#'+containerID, {
              labels: labels,
              series: values
            }, {
              distributeSeries: true
            });
        }

        this.makePieChart = function(_data,containerID,style){
            var labels = [];
            var values = [];

            var sortedLabels = [];
            for(var v in _data){
                sortedLabels.push(v);
            }

            var sl = sortedLabels.sort();

            for(var i = 0;i<sl.length;i++){
                labels.push(sl[i]);
                values.push(_data[sl[i]]);
            }

            var data = {
              labels: labels,
              series: values
            };

            var options = {
              labelInterpolationFnc: function(value) {
                return value[0]
              }
            };

            var responsiveOptions = [
              ['screen and (min-width: 640px)', {
                chartPadding: 30,
                labelOffset: 100,
                labelDirection: 'explode',
                labelInterpolationFnc: function(value) {
                  return value;
                }
              }],
              ['screen and (min-width: 1024px)', {
                labelOffset: 80,
                chartPadding: 20
              }]
            ];

            new Chartist.Pie('#'+containerID, data, options, responsiveOptions);
            

            
        }

        this.makeScatterPlot = function(dataSets, containerID,style){
            var dataList = [];
            var lowestA = 9999999999999;
            var highestA = -9999999999999;
            
            var lowestB = 9999999999999;
            var highestB = -9999999999999;
            var labels = [];
            for(var i in dataSets.x){
                if(dataSets.x[i]>highestA){
                    highestA = dataSets.x[i];
                }
                if(dataSets.x[i]<lowestA){
                    lowestA = dataSets.x[i];
                }
                
                if(dataSets.y[i]>highestB){
                    highestB = dataSets.y[i];
                }
                if(dataSets.y[i]<lowestB){
                    lowestB = dataSets.y[i];
                }
                dataList.push({x:dataSets.x[i]/100,y:dataSets.y[i]/1000});
                labels.push(i);
            }
            new Chartist.Line('#'+containerID, {
              labels: [],
              series: [
                dataList
              ]
            }, {
              low: 0,
              showLine: false,
              axisX: {
                showLabel: false,
                offset: 0
              },
              axisY: {
                showLabel: false,
                offset: 0
              }
            });
        }

        this.makeShapeFillChart = function(dataSets, containerID,style){
            this.makePieChart(dataSets, containerID,style);
        }

        


    }
    return new _Plugin();
})();