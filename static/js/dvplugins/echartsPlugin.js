var EChartsPlugin = (function(){
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
        

        this.makeBarChart = function(_data,containerID,style){
            var myChart = echarts.init(document.getElementById(containerID));
            
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

            var option = {
                title: {
                    text: style['title']
                },
                tooltip: {},
                legend: {
                    data: 'Legend'
                },
                xAxis: {
                    data: labels
                },
                yAxis: {},
                series: [{                    
                    name: 'Sales',
                    type: 'bar',
                    data: values
                }]
            };

            myChart.setOption(option);
        }

        this.makePieChart = function(_data,containerID,style){
            var myChart = echarts.init(document.getElementById(containerID));

            var pieData = [];

            var sortedLabels = [];
            for(var v in _data){
                sortedLabels.push(v);
            }

            var sl = sortedLabels.sort();

            for(var i = 0;i<sl.length;i++){                               
                pieData.push({
                    name: sl[i],
                    value: _data[sl[i]]                    
                });
            }
            
            var option = {
                title: {
                    text: style['title']
                },
                tooltip: {},
                legend: {
                    data: 'Legend'
                },                                              
                series: [{                    
                    name: 'Sales',
                    type: 'pie',     
                    selectedMode: 'single',               
                    data: pieData                    
                }]
            };

            myChart.setOption(option);
        }

        this.makeScatterPlot = function(dataSets, containerID,style){
            var myChart = echarts.init(document.getElementById(containerID));
            var dataList = [];            
                        
            for (var i = 0; i < Object.keys(dataSets[0].x).length; i++) {
                dataList.push([Object.values(dataSets[0].x)[i].toFixed(0), Object.values(dataSets[0].y)[i].toFixed(0), Object.keys(dataSets[0].x)[i]]);                
            }            
                        
            option = {
                title: {
                    text: style['title']
                },
                xAxis: {},
                yAxis: {},
                tooltip : {                    
                    showDelay : 0,
                    formatter : function (params) {
                        if (params.value.length > 1) {
                            return params.value[2] + ':<br/>x: ' + params.value[0] + '<br/>y: ' + params.value[1];
                        }
                        else {
                            return params.value[2] + ':<br/>x: ' + params.value[0] + '<br/>y: ' + params.value[1];
                        }
                    },
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    }
                },
                series: [{
                    symbolSize: 20,
                    data: dataList,                    
                    type: 'scatter'
                }]
            };
            myChart.setOption(option);
        }

        this.makeLineChart = function(_data,containerID,style){
            var myChart = echarts.init(document.getElementById(containerID));
            
            var labels = [];
            var values = [];

            for (var i = 0; i < Object.keys(_data[0].x).length; i++) {
                labels.push(Object.keys(_data[0].x)[i]);
                values.push(Object.values(_data[0].x)[i]);                
            }           

            option = {
                title: {
                    text: style['title']
                },
                tooltip: {
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: labels
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    // options for smoothing line and area fill below
                    smooth: true,
                    areaStyle: {},
                    ///////
                    symbolSize: 15,
                    data: values,
                    type: 'line'
                }]
            };

            myChart.setOption(option);
        }




        this.makeShapeFillChart = function(dataSets, containerID,style){
            this.makePieChart(dataSets, containerID,style);
        }
      

    }
    return new _Plugin();
})();