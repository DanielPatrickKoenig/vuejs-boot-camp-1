var v4vPlugin = (function(){

    
    

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

        function createStage(containerID){
            var stageID = containerID+"_v4v_svg";
            var pElement = document.getElementById(containerID);
            if(document.getElementById(stageID) != undefined){
                pElement.removeChild(document.getElementById(stageID));
            }
            return v4v.stage(false,0, 0, pElement.getBoundingClientRect().width, pElement.getBoundingClientRect().height, pElement, stageID);
            //return v4v.stage(false,0, 0, Number(pElement.style.width.split("px")[0]), Number(pElement.style.height.split("px")[0]), pElement, stageID);
        }

        function getWidth(stage){
            //return stage.getElement().parentNode.getBoundingClientRect().width;
            return stage.getElement().getAttribute("width");

        }

        function getHeight(stage){
            //return stage.getElement().parentNode.getBoundingClientRect().height;
            return stage.getElement().getAttribute("height");
        }
        
        

        this.makeBarChart = function(_data,containerID,title){

            var stage = createStage(containerID);
            var values = [];
            var labels = [];
            var colors = []
            var highestVal = -999999999999;
            for(var d in _data){
                labels.push(d);
                values.push(_data[d]);
                if(_data[d]>highestVal){
                    highestVal = _data[d];
                }
                colors.push(getColors()[0]);
            }
            var barChart = v4v.bar(stage, values, colors, 0, 0, title, labels, getWidth(stage), getHeight(stage), stage.getElement().getBoundingClientRect().width/4, highestVal);

            

            
            
        }

        

        this.makePortionFillChart = function(_data,containerID,style){
            var stage = createStage(containerID);
            var values = [];
            var labels = [];
            var colors = [];
            var highestVal = -999999999999;
            var cIndex = 0;
            for(var d in _data){
                labels.push(d);
                values.push(_data[d]);
                if(_data[d]>highestVal){
                    highestVal = _data[d];
                }
                colors.push(getColors()[cIndex]);
                cIndex++;
            }

            var portionFill = v4v.portionFill(stage, style.shape, values ,colors, 0, 0, labels,style.title, getWidth(stage), getHeight(stage));

            
        }

        this.makeShapeFillChart = function(_data,containerID,style){
            var stage;
            var portionFill;
            if(checkForExistingChart(containerID) && UTILITY.EnableAnimation){



                _data.onUpdate = function(){

                    stage = createStage(containerID);
            
                    portionFill = v4v.singleMetricPortionFill(stage, style.shape, chartMatrix[containerID].value, chartMatrix[containerID].total,getColors()[0],0,0,style.title, getWidth(stage), getHeight(stage),3);
                    // var cData = getBasicColumChartData(copyObject(chartMatrix[containerID]));

                    // Plotly.newPlot(containerID, [cData], _layout);
                    //console.log("animating ******")
                }

                TweenLite.to(chartMatrix[containerID],1,_data);

                
            }
            else{
                chartMatrix[containerID] = _data;
                stage = createStage(containerID);
            
                portionFill = v4v.singleMetricPortionFill(stage, style.shape, _data.value, _data.total,getColors()[0],0,0,style.title, getWidth(stage), getHeight(stage),3);
            }
            //var stage = createStage(containerID);
            
            //var portionFill = v4v.singleMetricPortionFill(stage, style.shape, _data.value, _data.total,getColors()[0],0,0,style.title,document.getElementById(containerID).getBoundingClientRect().width,document.getElementById(containerID).getBoundingClientRect().height,3);
            //var portionFill = v4v.portionFill(stage, style.shape, values ,colors, 0, 0, labels,style.title,document.getElementById(containerID).getBoundingClientRect().width, document.getElementById(containerID).getBoundingClientRect().height);

            
        }

        this.makeGuageChart = function(_data,containerID,style){
            var stage = createStage(containerID);
            var wide = getWidth(stage);
            var high = getHeight(stage);
            var size = wide>high ? high : wide;
            size*=.8;
            var guage = v4v.guage(stage, _data.value, [getColors()[0]], wide/2, high/2, style.title, size, size-size*.9, _data.total, 0, true);

            
        }

        

        this.makeSymbolStack = function(_data,containerID,style){
            var stage = createStage(containerID);
            var values = [];
            var labels = [];
            var colors = [];
            var highestVal = -999999999999;
            var cIndex = 0;
            var totalVals = 0;
            var shapes = [];
            for(var d in _data){
                labels.push(d);
                values.push(_data[d]);
                totalVals += _data[d];
                if(_data[d]>highestVal){
                    highestVal = _data[d];
                }
                colors.push(getColors()[cIndex]);
                if(style.symbols.join != undefined){
                    shapes.push(style.symbols[cIndex]);
                }
                else{
                    shapes.push(style.symbols);
                }
                cIndex++;
            }
            var wide = getWidth(stage);
            var high = getHeight(stage);
            // console.log("WIDTH of GROUP = "+wide);
            // console.log("HEIGHT of GROUP = "+high);
            
            console.log("WIDTH of GROUP = "+wide);
            console.log("HEIGHT of GROUP = "+high);
            var dataScale = 100/totalVals>1 ? 1 : 100/totalVals;
            var stack = v4v.symbolStack(stage, values, shapes,colors,style.title,labels,0,0,wide,high,dataScale);
        }

        this.makeSymbolFrames = function(_data,containerID,style){
            var stage;
            var portionFill;
            if(checkForExistingChart(containerID) && UTILITY.EnableAnimation){



                _data.onUpdate = function(){

                    stage = createStage(containerID);
            
                    symbolFrames = v4v.symbolFrames(stage, style.frames, chartMatrix[containerID].value, chartMatrix[containerID].total,getColors()[0],style.title,0,0,getWidth(stage), getHeight(stage),3);
                    // var cData = getBasicColumChartData(copyObject(chartMatrix[containerID]));

                    // Plotly.newPlot(containerID, [cData], _layout);
                    //console.log("animating ******")
                }

                TweenLite.to(chartMatrix[containerID],1,_data);

                
            }
            else{
                chartMatrix[containerID] = _data;
                stage = createStage(containerID);
            
                symbolFrames = v4v.symbolFrames(stage, style.frames, _data.value, _data.total,getColors()[0],style.title,0,0,getWidth(stage), getHeight(stage),3);
            }
            
        }


        function checkForExistingChart(containerID){
            var _exists = document.getElementById(containerID + "_v4v_svg") != undefined;
            if(_exists){
                
                document.getElementById(containerID).removeChild(document.getElementById(containerID + "_v4v_svg"));
                

            }

            return _exists;
        }



        

        


    }
    return new _Plugin();
})();