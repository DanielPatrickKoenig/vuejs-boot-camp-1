var PlotlyPlugin = (function(){

    

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
            var _layout = {
                title: style.title,
                font: {
                    size: 16
                }
            }
            if(checkForExistingChart(containerID) && UTILITY.EnableAnimation){



                _data.onUpdate = function(){

                    
                    var cData = getBasicColumChartData(copyObject(chartMatrix[containerID]));

                    Plotly.newPlot(containerID, [cData], _layout);
                }

                TweenLite.to(chartMatrix[containerID],.5,_data);

                
            }
            else{
                chartMatrix[containerID] = _data;
                var cData = getBasicColumChartData(_data);
                Plotly.newPlot(containerID, [cData], _layout);
            }

            
            return cData;
        }

        this.makePieChart = function(_data,containerID,style){

            var layout = {
              //height: 400,
              //width: 500,
              title:style.title
            };

            

            if(checkForExistingChart(containerID) && UTILITY.EnableAnimation){
                var r = {rotation:0};
                _data.onUpdate = function(){

                    
                    var data = getPieChartData(copyObject(chartMatrix[containerID]));
                    data[0].rotation = r.rotation;

                    console.log(r.rotation);

                    Plotly.newPlot(containerID, data, layout);
                }

                //TweenLite.to(r,.5,{rotation:360});

                TweenLite.to(chartMatrix[containerID],.5,_data);



                // console.log(chartMatrix[containerID]);

                // var data = getPieChartData(_data);
                // console.log('B');
                // console.log(data);

                // Plotly.newPlot(containerID, data, layout);

            }
            
            else{
                chartMatrix[containerID] = _data;
                var data = getPieChartData(_data);
                console.log('A');
                console.log(data);
                Plotly.newPlot(containerID, data, layout);
            }

            
        }

        this.makeLineChart = function(dataSets, containerID,style){
            // console.log("############# DATA SET ##############");
            // console.log(dataSets);
            // console.log("############# DATA SET ##############");
            var data = getDataSets(dataSets,true);
            // console.log("############# DATA ##############");
            // console.log(data);
            // console.log("############# DATA ##############");
            //chartData = data;

            chartMatrix[containerID] = data;

            var layout = {barmode: 'group',title: style.title};

            if(checkForExistingChart(containerID)){
                Plotly.newPlot(containerID, data, layout);
            }
            else{
                Plotly.newPlot(containerID, data, layout);
            }
        }

        this.makeMultiColumChart = function(dataSets, containerID,style){
            // console.log("############# DATA SET ##############");
            // console.log(dataSets);
            // console.log("############# DATA SET ##############");
            var data = getDataSets(dataSets);
            // console.log("############# DATA ##############");
            // console.log(data);
            // console.log("############# DATA ##############");
            //chartData = data;

            chartMatrix[containerID] = data;

            var layout = {barmode: 'group',title: style.title};

            if(checkForExistingChart(containerID)){
                Plotly.newPlot(containerID, data, layout);
            }
            else{
                Plotly.newPlot(containerID, data, layout);
            }
        }

        this.makeScatterPlot = function(dataSets, containerID,style){
            var data = [];
            var lowestA = 9999999999999;
            var highestA = -9999999999999;
            var lowestB = 9999999999999;
            var highestB = -9999999999999;
            for(var n = 0;n<dataSets.length;n++){
                var aList = [];
                var bList = [];
                var labels = [];
                for(var i in dataSets[n].x){
                    if(dataSets[n].x[i]>highestA){
                        highestA = dataSets[n].x[i];
                    }
                    if(dataSets[n].x[i]<lowestA){
                        lowestA = dataSets[n].x[i];
                    }
                    aList.push(dataSets[n].x[i]);
                    if(dataSets[n].y[i]>highestB){
                        highestB = dataSets[n].y[i];
                    }
                    if(dataSets[n].y[i]<lowestB){
                        lowestB = dataSets[n].y[i];
                    }
                    bList.push(dataSets[n].y[i]);
                    labels.push(i);
                }
                var scatterColors = [];
                for(var m = 0;m<aList.length;m++){
                    scatterColors.push(getColors()[n]);
                }
                console.log(scatterColors);
                var trace = {
                  x: aList,
                  y: bList,
                  mode: 'markers',
                  type: 'scatter',
                  name: 'Team '+n.toString(),
                  text: labels,
                  marker: { size: 12, color:scatterColors }
                };
                data.push(trace);
            }
            

            // var trace2 = {
            //   x: dataSets.v.a,
            //   y: dataSets.v.b,
            //   mode: 'markers',
            //   type: 'scatter',
            //   name: 'Team B',
            //   text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
            //   marker: { size: 12 }
            // };

            //console.log({trace1:trace1});

            //var data = [trace1];

            var layout = {
              xaxis: {
                range: [ lowestA-((highestA-lowestA)*.1), highestA+((highestA-lowestA)*.1) ]
              },
              yaxis: {
                range: [lowestB-((highestB-lowestB)*.1), highestB+((highestB-lowestB)*.1)]
              },
              title:style.title
            };

            Plotly.newPlot(containerID, data, layout);
        }

        

        function copyObject(_data){
            var copiedData = {};
            for(var d in _data){
                if(d.toString() != '_gsTweenID' && d.toString() != 'onUpdate'){
                    copiedData[d] = _data[d];
                }
                
            }
            return copiedData;
        }

        function checkForExistingChart(containerID){
            var _exists = $('#'+containerID+' .plot-container').length>0;
            if(_exists){
                // TweenLite.to($('#'+containerID),.5,{opacity:0,onUpdate:function(){
                //     console.log($('#'+containerID).css('opacity'));
                // }});
                // TweenLite.to(testObj,.5,{x:1,onUpdate:function(){
                //     console.log(testObj.x);
                // }});
                Plotly.purge(containerID);

            }

            return _exists;
        }

        function getDataSets(dataSets, lineMode){
            var data = [];

            for(var i = 0;i<dataSets.length;i++){
                var dataItem = {};
                var labels = [];
                var values = [];

                for(var v in dataSets[i].data){
                    //labels.push(v.split(dataSets[i].name+" ")[1]);
                    labels.push(v);
                    values.push(dataSets[i].data[v]);
                }

                var dataItem = {};

                if(lineMode){
                    dataItem = {
                        x:labels,
                        y:values,
                        name:dataSets[i].name,
                        mode:"lines"
                        
                    };
                }
                else{
                    dataItem = {
                        x:labels,
                        y:values,
                        name:dataSets[i].name,
                        type:"bar"
                    };
                }
                data.push(dataItem);
            }
            //console.log(data);
            return data;
        }
        

        function getBasicColumChartData(_data){
            //
            var labels = [];
            var values = [];

            for(var v in _data){
                labels.push(v);
                values.push(_data[v]);
            }
            //console.log(labels);
            //console.log(values);

            cData = {
                type: 'bar',
                x: labels,//["A","B","C","D"],
                y: values,//[5, 10, 2, 8],
                marker: {
                    color:getColors(1),
                    line: {
                        width: 0
                    }
                }
            }
            console.log(cData);
            return cData;
        }

        function getPieChartData(_data){
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
            var data = [{
              values: values,
              labels: labels,
              marker:{colors:getColors(values.length)},
              type: 'pie',
              uid:'437a97',
              hole: .4,
              rotation:0
            }];
            return data;
        }


    }
    return new _Plugin();
})();
