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

        
        this.makeWildCardChart = function(_data,containerID,style){
            var defaultColor = "#000000";
            var secondaryColor = "#CCCCCC";
            var defaultOpacity = 1;
            var secondaryOpacity = .2;
            var _structurs = {
                PIE:"pie",
                COLUMN:"column",
                BAR:"bar",
                ART:"art",
                MAP:"map",
                LINE:"line",
                BUBBLE:"bubble",
                SCATTER:"scatter"
            };
            var particleCount = 300;//_data.particles;
            var pointSize = 3;
            var stage;
            var particleList = [];
            var coords = [];
            var speedBase = 2;
            //console.log(checkForExistingChart(containerID));
            if(checkForExistingChart(containerID) && UTILITY.EnableAnimation){
                stage = createStage(containerID);
                coords = chartMatrix[containerID];
                //console.log("################## USING EXISTING DATA SET ######################");
            }
            else{
                stage = createStage(containerID);
                for(var i = 0;i<particleCount;i++){
                    coords.push({x:Math.random()*getWidth(stage),y:Math.random()*getHeight(stage),opacity:1,fill:"#000000",r:1});
                }
                chartMatrix[containerID] = coords;
                //console.log("################## USING NEW DATA SET ######################");
            }

            //console.log(chartMatrix);
            
            for(var i = 0;i<coords.length;i++){
                particleList.push(v4v.circle(stage,{cx:coords[i].x,cy:coords[i].y,r:1,particle:i.toString()}));
                particleList[i].attr("r",coords[i].r);
                particleList[i].getElement().style.opacity = coords[i].opacity;
                particleList[i].getElement().style.fill = coords[i].fill;
                
            }

            var helperID = containerID+"_helper";
            if(document.getElementById(helperID) != undefined){

                document.getElementById(helperID).parentNode.removeChild(document.getElementById(helperID))

            }

            var reConfigure = function(index,xVal,yVal,opacity,fill,r){
                document.getElementById(containerID).style.opacity = 0;
                var _opacity = opacity != undefined ? opacity : 1;
                var _fill = fill != undefined ? fill : defaultColor;
                var _r = r != undefined ? r : 1;
                
                var startSpeed = {x:(Math.random()*(speedBase/2))+(speedBase/4),y:(Math.random()*(speedBase/2))+(speedBase/4)};
                var finishSpeed = {x:speedBase-startSpeed.x,y:speedBase-startSpeed.y};
                var easeType = Sine;
                var initialDelay = 0;
                TweenLite.to(coords[index],startSpeed.x,{delay:initialDelay,x:Math.random()*getWidth(stage),onUpdate:function(index){
                    particleList[index].attr("cx",coords[index].x);
                    document.getElementById(containerID).style.opacity = 1;
                },onUpdateParams:[index],onComplete:function(index){
                    //console.log(index);
                    TweenLite.to(coords[index],finishSpeed.x,{x:xVal,onUpdate:function(index){
                        particleList[index].attr("cx",coords[index].x);
                    },onUpdateParams:[index],ease: easeType.easeInOut});
                },onCompleteParams:[index],ease: easeType.easeOut});

                TweenLite.to(coords[index],startSpeed.y,{delay:initialDelay,r:1,fill:defaultColor,opacity:1,y:Math.random()*getHeight(stage),onUpdate:function(_index){
                    particleList[index].attr("cy",coords[index].y);
                    particleList[index].attr("r",coords[index].r);
                    particleList[index].getElement().style.opacity = coords[index].opacity;
                    particleList[index].getElement().style.fill = coords[index].fill;
                },onUpdateParams:[index],onComplete:function(_index){
                    TweenLite.to(coords[index],finishSpeed.y,{r:_r,fill:_fill,opacity:_opacity,y:yVal,onUpdate:function(index){
                        particleList[index].attr("cy",coords[index].y);
                        particleList[index].attr("r",coords[index].r);
                        particleList[index].getElement().style.opacity = coords[index].opacity;
                        particleList[index].getElement().style.fill = coords[index].fill;
                    },onUpdateParams:[index],ease: easeType.easeInOut});
                },onCompleteParams:[index],ease: easeType.easeInOut});

                // TweenLite.to(coords[index],.3+(Math.random()*.4),{x:xVal,onUpdate:function(_index){
                //     particleList[_index].attr("cx",coords[_index].x);
                // },onUpdateParams:[index],ease: Math.random()>.5 ? Circ.easeIn : Circ.easeOut});

                // TweenLite.to(coords[index],.3+(Math.random()*.4),{y:yVal,onUpdate:function(_index){
                //     particleList[_index].attr("cy",coords[_index].y);
                // },onUpdateParams:[index],ease: Math.random()>.5 ? Circ.easeIn : Circ.easeOut});
            }


            
            switch(_data.structure){
                case _structurs.PIE:{
                    pointSize = 2;
                    var total = _data.total;
                    var value = _data.value;
                    var ratio = value/total;
                    var maxAngle = 360*ratio;
                    var center = {x:getWidth(stage)/2,y:getHeight(stage)/2};
                    var radius = center.x>center.y ? center.y*.45 : center.x*.45;
                    // for(var i = 0;i<particleList.length;i++){
                    //     var xVal = v4v.orbit(center.x,radius,(maxAngle/particleList.length)*i,"cos");
                    //     var yVal = v4v.orbit(center.y,radius,(maxAngle/particleList.length)*i,"sin");
                    //     reConfigure(i,xVal,yVal);
                    // }

                    for(var i = 0;i<particleList.length;i++){
                        var angle = (360/particleList.length)*i;
                        var xVal = v4v.orbit(center.x,radius,angle,"cos");
                        var yVal = v4v.orbit(center.y,radius,angle,"sin");
                        var opacity = defaultOpacity;
                        var fill = defaultColor;
                        if(angle>maxAngle){
                            opacity = secondaryOpacity;
                            fill = secondaryColor;
                        }
                        reConfigure(i,xVal,yVal,opacity,fill,pointSize);
                    }
                    //var label = v4v.text(stage,0,0,Math.round(ratio*100).toString()+"%");
                    var label = v4v.text(stage,0,0,(Math.round(value*100)/100).toString()+" / "+total.toString());
                    label.attr("x",(getWidth(stage)/2)-(label.getElement().getBoundingClientRect().width/2));
                    label.attr("y",(getHeight(stage)/2)+(label.getElement().getBoundingClientRect().height/2));
                    label.getElement().style.opacity = 0;
                    TweenLite.to(label.getElement(),speedBase/5,{delay:(speedBase/5)*4,opacity:1});

                    break;
                }
                case _structurs.COLUMN:{
                    break;
                }
                case _structurs.BAR:{
                    pointSize = 3;
                    var values = _data.values;
                    var total = 0;
                    var highest = -999999;
                    var valuesCount = 0;
                    var leftEdge = 150;
                    var topEdge = 10;
                    for(var v in values){
                        highest = values[v]>highest ? values[v] : highest;
                        total+=values[v];
                        valuesCount++;
                    }
                    //console.log(valuesCount);
                    var ratioValues = {};
                    var masterRatio = particleCount/total;
                    var totalRatio = Math.round(total*masterRatio);
                    var highestRatio = Math.round(highest*masterRatio);
                    for(var v in values){
                        ratioValues[v] = Math.round(values[v]*masterRatio);
                    }
                    var vert = 0;
                    var particleIndex = 0;
                    for(var r in ratioValues){
                        for(var i = 0;i<ratioValues[r];i++){
                            if(particleList[particleIndex]!=undefined){
                                particleList[particleIndex].attr("cx",((getWidth(stage)/highestRatio)*i)+leftEdge);
                                particleList[particleIndex].attr("cy",((getHeight(stage)/valuesCount)*vert)+topEdge);
                            }
                            if(coords[particleIndex]!=undefined){
                                var xVal = (((getWidth(stage)-leftEdge)/highestRatio)*i)+leftEdge;
                                var yVal = ((getHeight(stage)/valuesCount)*vert)+topEdge;
                                reConfigure(particleIndex,xVal,yVal,1,getColors()[vert],pointSize);
                                // TweenLite.to(coords[particleIndex],.5,{x:xVal,y:yVal,onUpdate:function(index){
                                //     particleList[index].attr("cx",coords[index].x);
                                //     particleList[index].attr("cy",coords[index].y);
                                // },onUpdateParams:[particleIndex]});
                                //particleList[particleIndex].attr("cx",((getWidth(stage)/highestRatio)*i)+leftEdge);
                                //particleList[particleIndex].attr("cy",((getHeight(stage)/valuesCount)*vert)+topEdge);
                            }
                            particleIndex++;
                        }
                        var label = v4v.text(stage,0,0,r+" ("+(Math.round(values[r]*100)/100).toString()+")");
                        label.attr("y",((getHeight(stage)/valuesCount)*vert)+topEdge+(label.getElement().getBoundingClientRect().height/4));
                        label.getElement().style.opacity = 0;
                        TweenLite.to(label.getElement(),speedBase/5,{delay:(speedBase/5)*4,opacity:1});
                        vert++;
                    }
                    for(var i = particleIndex;i<particleList.length;i++){
                        //particleList[i].attr("cx",leftEdge);
                        //particleList[i].attr("cy",topEdge);
                        var xVal = leftEdge;
                        var yVal = topEdge;
                        reConfigure(i,xVal,yVal,1,getColors()[0],pointSize);
                        // TweenLite.to(coords[i],.5,{x:xVal,y:yVal,onUpdate:function(index){
                        //     particleList[index].attr("cx",coords[index].x);
                        //     particleList[index].attr("cy",coords[index].y);
                        // },onUpdateParams:[i]});
                    }
                    break;
                }
                case _structurs.ART:{
                    break;
                }

                case _structurs.BUBBLE:{
                    document.getElementById(containerID).appendChild(stage.makeXHTML("div",{id:helperID,style:"width:100%;height:100%;visibility:hidden;"}));
                    //TweenLite.to("#"+helperID,0,{opacity:0});
                    d3Plugin.makeBubbleChart(_data.values,helperID,style);
                    setTimeout(function(){
                        var bubbles = document.getElementById(helperID).getElementsByTagName("circle");
                        var bubbleCount = bubbles.length;
                        for(var i = 0;i<bubbles.length;i++){
                            bubbles[i].setAttribute("style","opacity:0;")
                        }
                        var bubbleIndex = 0;
                        var roundComplete = false;
                        for(var i = 0;i<particleList.length;i++){
                            //particleList[i].attr("cx",leftEdge);
                            //particleList[i].attr("cy",topEdge);
                            //var xVal = leftEdge;
                            //var yVal = topEdge;
                            bubbleDims = bubbles[bubbleIndex].getBoundingClientRect();
                            var bubbleSize = roundComplete ? 0 : bubbleDims.width/2 ; 
                            reConfigure(i,bubbleDims.left+(bubbleDims.width/2)-document.getElementById(containerID).getBoundingClientRect().left,bubbleDims.top+(bubbleDims.width/2)-document.getElementById(containerID).getBoundingClientRect().top,1,getColors()[bubbleIndex%getColors().length],bubbleSize);

                            bubbleIndex++;
                            if(bubbleIndex>=bubbles.length){
                                bubbleIndex = 0;
                                roundComplete = true;
                            }
                            // TweenLite.to(coords[i],.5,{x:xVal,y:yVal,onUpdate:function(index){
                            //     particleList[index].attr("cx",coords[index].x);
                            //     particleList[index].attr("cy",coords[index].y);
                            // },onUpdateParams:[i]});
                        }
                        setTimeout(function(){
                            if(document.getElementById(helperID) != undefined && bubbleCount == bubbles.length){
                                document.getElementById(helperID).style.visibility = "visible";
                                TweenLite.to("#"+helperID,0,{opacity:0});
                                //document.getElementById(helperID).style.visibility = "visible";
                                TweenLite.to("#"+helperID,.25,{opacity:1});
                            }
                        },(speedBase*.9)*1000)
                        // for(var i = 0;i<bubbles.length;i++){
                        //     console.log(bubbles[i]);
                        //     bubbles[i].setAttribute("style","opacity:0 !important;")
                        // }
                    },10);
                    
                    
                    break;
                }
                
                case _structurs.MAP:
                case _structurs.LINE:{
                    pointSize = 2;
                    var specialPointSize = 6;
                    var lines = [];
                    var labels = [];
                    var points = [];
                    if(_data.structure == _structurs.LINE){
                        labels = _data.labels;
                        var highestVal = -9999999;
                        var lowestVal = 9999999;
                        for(var i = 0;i<_data.series.length;i++){
                            for(var j = 0;j<_data.series[i].values.length;j++){
                                if(_data.series[i].values[j] > highestVal){
                                    highestVal = _data.series[i].values[j];
                                }
                                if(_data.series[i].values[j] < lowestVal){
                                    lowestVal = _data.series[i].values[j];
                                }
                            }
                        }
                        for(var i = 0;i<_data.series.length;i++){
                            var line = "";
                            if(i==0){
                                //line = "0,0 ";
                            }
                            for(var j = 0;j<_data.series[i].values.length;j++){
                                var _x = (getWidth(stage)/(_data.series[i].values.length-1))*j;
                                var _y = getHeight(stage)-(getHeight(stage)*(((_data.series[i].values[j]-lowestVal)/(highestVal-lowestVal)))/1);
                                if(j>0){
                                    line+=" ";
                                }
                                line+=_x.toString()+","+_y.toString();
                                
                            }
                            
                            lines.push(line); 
                        }
                    }
                    else{
                        points = _data.points;
                        lines = _data.lines;
                    }
                    
                    var points = _data.points;
                    var scale = 1;
                    var lineMatrix = [];
                    var highestX = -999999;
                    var highestY = -999999;
                    var totalDistance = 0;
                    var distanceList = [];
                    var particleGroups = [];
                    for(var i = 0;i<lines.length;i++){
                        var lineSplit = lines[i].split(" ");
                        lineMatrix.push([]);
                        var distance = 0;
                        for(var j = 0;j<lineSplit.length;j++){
                            var _x = Number(lineSplit[j].split(",")[0]);
                            var _y = Number(lineSplit[j].split(",")[1]);
                            if(j>0){
                                distance+=v4v.distance(Number(lineSplit[j-1].split(",")[0]),Number(lineSplit[j-1].split(",")[1]),_x,_y);
                            }

                            if(_x>highestX){
                                highestX = _x;
                            }
                            if(_y>highestY){
                                highestY = _y;
                            }
                            lineMatrix[i].push({x:_x,y:_y});
                        }
                        particleGroups.push([]);
                        
                        totalDistance+=distance;
                        distanceList.push(Number(totalDistance.toString()));
                    }
                    //if(highestX>getWidth(stage)){
                        //scale = getWidth(stage)/highestX;
                    //}
                    //if(highestY*scale>getHeight(stage)){
                        var verticalMargin = 10;
                        scale = _data.structure == _structurs.LINE ? .8 : getHeight(stage)/(highestY+verticalMargin);
                    //}
                    //console.log("Scale = "+scale.toString());
                    totalDistance = totalDistance*scale;
                    for(var i = 0;i<lineMatrix.length;i++){
                        distanceList[i] = distanceList[i]*scale;
                        for(var j = 0;j<lineMatrix[i].length;j++){
                            lineMatrix[i][j].x = lineMatrix[i][j].x*scale;
                            lineMatrix[i][j].y = lineMatrix[i][j].y*scale;
                        }
                    }
                    
                    for(var i = 0;i<coords.length;i++){
                        for(var j = 0;j<distanceList.length;j++){
                            //console.log((totalDistance/coords.length)*i);
                            if((totalDistance/coords.length)*i<distanceList[j]){
                                particleGroups[j].push(coords[i]);
                                j = distanceList.length;
                            }
                        }
                    }
                    var pIndex = 0;
                    var hMargin = /*_data.structure == _structurs.LINE ? 0 :*/ (getWidth(stage)/2)-((highestX*scale)/2);
                    var vMargin = /*_data.structure == _structurs.LINE ? 0 :*/ (verticalMargin/2);
                    for(var i = 0;i<particleGroups.length;i++){
                        var color = _data.structure == _structurs.LINE ? getColors()[i] : defaultColor;
                        for(var j = 0;j<particleGroups[i].length;j++){
                            var opacity = j==0 ? 0 : 1;
                            var position = v4v.pathPlot(j/particleGroups[i].length,lineMatrix[i]);
                            var xVal = position.x;
                            var yVal = position.y;
                            var _size = pointSize;
                            if(_data.structure == _structurs.MAP){
                                for(var k = 0;k<points.length;k++){
                                    if(points[k] == pIndex){
                                        _size = specialPointSize;
                                    }
                                }
                            }
                            reConfigure(pIndex,xVal+hMargin,yVal+vMargin,opacity,color,_size);
                            pIndex++;
                        }
                        //v4v.pathPlot()
                    }


                    if(_data.structure == _structurs.LINE){
                        for(var i = 0;i<labels.length;i++){
                            var label = v4v.text(stage,0,0,labels[i]);
                            label.attr("y",getHeight(stage)-5);
                            label.attr("x",hMargin+(((getWidth(stage))/labels.length)*i) -(label.getElement().getBoundingClientRect().width/2));
                            label.getElement().style.opacity = 0;
                            TweenLite.to(label.getElement(),speedBase/5,{delay:(speedBase/5)*4,opacity:1});
                        }
                    }

                    if(_data.structure == _structurs.MAP && _data.graphic != undefined){
                        var img = v4v.image(stage,{x:0,y:0,width:getWidth(stage),height:getHeight(stage),href:_data.graphic});
                        img.getElement().style.opacity = "0";
                        TweenLite.to(img.getElement(),speedBase/5,{delay:(speedBase/5)*4,opacity:1});
                    }

                    //console.log(pIndex);


                    break;
                }
                case _structurs.SCATTER:{

                    console.log(_data.values);
                    pointSize = 3;
                    var xRange = {lowest:9999990,highest:-9999990,span:0};
                    var yRange = {lowest:9999990,highest:-9999990,span:0};

                    for(var i = 0;i<_data.values.length;i++){
                        if(!isNaN(_data.values[i].x) && !isNaN(_data.values[i].y)){
                            if(_data.values[i].x < xRange.lowest){
                                xRange.lowest = _data.values[i].x;
                            }
                            if(_data.values[i].x > xRange.highest){
                                xRange.highest = _data.values[i].x;
                            }

                            if(_data.values[i].y < yRange.lowest){
                                yRange.lowest = _data.values[i].y;
                            }
                            if(_data.values[i].y > yRange.highest){
                                yRange.highest = _data.values[i].y;
                            }
                        }
                    }

                    xRange.span = xRange.highest-xRange.lowest;

                    yRange.span = yRange.highest-yRange.lowest;

                    console.log(xRange);
                    console.log(yRange);
                    var inset = 45;
                    var textMargin = 5;

                    var liveArea = {width:getWidth(stage)-(inset*2),height:getHeight(stage)-(inset*2)};
                    var areaRatios = {x:liveArea.width/xRange.span,y:liveArea.height/yRange.span};
                    console.log(areaRatios);
                    for(var i = 0;i<particleCount;i++){
                        var _position = {x:0,y:0};
                        if(_data.values.length-1>=i && !isNaN(_data.values[i].x) && !isNaN(_data.values[i].y)){
                            _position.x = inset+((_data.values[i].x-xRange.lowest)*areaRatios.x);
                            _position.y = inset+((_data.values[i].y-yRange.lowest)*areaRatios.y);
                            reConfigure(i,_position.x,getHeight(stage)-_position.y,1,getColors()[0],pointSize);
                        }
                        else{
                            _position.x = Math.random()*getWidth(stage);
                            _position.y = Math.random()*getHeight(stage);
                            reConfigure(i,_position.x,_position.y,0,getColors()[0],pointSize);
                        }

                        //var _position = {x:_data.values}
                    }

                    //borderRect.

                    var borderFade = 1.5;

                    var borderRect = v4v.rect(stage,{x:inset,y:inset,width:getWidth(stage)-(inset*2),height:getHeight(stage)-(inset*2),fill:"transparent",stroke:"rgba(0,0,0,.3)",style:"opacity:0;"});
                    borderRect.attr("stroke-width",.5);
                    borderRect.attr("class","particle-scatter-border");
                    TweenLite.to(borderRect.getElement(),borderFade,{opacity:1,delay:.8});

                    var borderLine1 = v4v.line(stage,{x1:inset,x2:getWidth(stage)-inset,y1:getHeight(stage)/2,y2:getHeight(stage)/2,style:"opacity:0;"});
                    var borderLine2 = v4v.line(stage,{y1:inset,y2:getHeight(stage)-inset,x1:getWidth(stage)/2,x2:getWidth(stage)/2,stroke:"rgba(0,0,0,.3)",style:"opacity:0;"});
                    borderLine1.attr("stroke-width",.5);
                    borderLine2.attr("stroke-width",.5);
                    borderLine1.attr("class","particle-scatter-border");
                    borderLine2.attr("class","particle-scatter-border");
                    TweenLite.to(borderLine1.getElement(),borderFade,{opacity:1,delay:.8});
                    TweenLite.to(borderLine2.getElement(),borderFade,{opacity:1,delay:.8});


                    var labelX1 = v4v.text(stage,inset,inset-textMargin,Math.round(xRange.lowest*100)/100);
                    var labelX2 = v4v.text(stage,inset,inset-textMargin,Math.round((Number(xRange.lowest)+((Number(xRange.highest)-Number(xRange.lowest))/2))*100)/100);
                    var labelX3 = v4v.text(stage,inset,inset-textMargin,Math.round(xRange.highest*100)/100);
                    labelX1.attr("style","opacity:0;");
                    labelX2.attr("style","opacity:0;");
                    labelX3.attr("style","opacity:0;");
                    labelX2.attr("x",(getWidth(stage)/2)-(labelX2.getElement().getBoundingClientRect().width/2));
                    labelX3.attr("x",getWidth(stage)-labelX3.getElement().getBoundingClientRect().width-inset);


                    var labelY1 = v4v.text(stage,inset,inset,Math.round(yRange.highest*100)/100);
                    var labelY2 = v4v.text(stage,inset,inset,Math.round((Number(yRange.lowest)+((Number(yRange.highest)-Number(yRange.lowest))/2))*100)/100);
                    var labelY3 = v4v.text(stage,inset,inset,Math.round(yRange.lowest*100)/100);
                    labelY1.attr("y",inset+(labelY1.getElement().getBoundingClientRect().height));
                    labelY2.attr("y",(getHeight(stage)/2));
                    labelY3.attr("y",getHeight(stage)-inset);
                    labelY1.attr("style","opacity:0;");
                    labelY2.attr("style","opacity:0;");
                    labelY3.attr("style","opacity:0;");
                    labelY1.attr("x",inset-labelY1.getElement().getBoundingClientRect().width-textMargin);
                    labelY2.attr("x",inset-labelY2.getElement().getBoundingClientRect().width-textMargin);
                    labelY3.attr("x",inset-labelY3.getElement().getBoundingClientRect().width-textMargin);


                    TweenLite.to(labelX1.getElement(),borderFade,{opacity:1,delay:.8});
                    TweenLite.to(labelX2.getElement(),borderFade,{opacity:1,delay:.8});
                    TweenLite.to(labelX3.getElement(),borderFade,{opacity:1,delay:.8});
                    TweenLite.to(labelY1.getElement(),borderFade,{opacity:1,delay:.8});
                    TweenLite.to(labelY2.getElement(),borderFade,{opacity:1,delay:.8});
                    TweenLite.to(labelY3.getElement(),borderFade,{opacity:1,delay:.8});


                    

                    //label.getElement().style.opacity = 0;
                    //TweenLite.to(label.getElement(),speedBase/5,{delay:(speedBase/5)*4,opacity:1});




                    break;
                }
                // case _structurs.LINE:{
                //     break;
                // }
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