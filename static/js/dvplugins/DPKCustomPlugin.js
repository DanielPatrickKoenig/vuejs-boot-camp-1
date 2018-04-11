var DPKCustomPlugin = (function(){

    function Counter(_stage,_val,_color,_x,_y, _title, _prefix, _suffix, _max, _min, _showPercentage,_showPie){

        var showPercentage = _showPercentage;
        var max = _max == undefined ? 100 : _max;
        var min = _min == undefined ? 0 : _min;
        var _value = ((_val-min)/(max-min))*100;

        var outerGroup = v4v.g(_stage,_stage.getElement().getBoundingClientRect().width,0);
        
        
        var group = v4v.g(_stage, _x, _y);

        var prefix = _prefix;
        var suffix = _suffix;

        var iconSizeRatio = .9;

        var hasImage = prefix.toLowerCase().split("url(").length>1;

        
        
        var textValueLabel = v4v.text(_stage, 0,0,"0");

        

        group.getElement().appendChild(textValueLabel.getElement());

        outerGroup.getElement().appendChild(group.getElement());

        var textHight = textValueLabel.getElement().getBoundingClientRect().height;
        var _scale = (_stage.getElement().getBoundingClientRect().height/textHight)*.8;
        //textValueLabel.attr("x", (textValueLabel.getElement().getBoundingClientRect().width/-2));
        textValueLabel.attr("y", (textValueLabel.getElement().getBoundingClientRect().height*.85));
        group.attr("transform","scale("+_scale.toString()+","+_scale.toString()+")");

        var labelScale = .3;

        // var pGroup = v4v.g(_stage,0,0);
        // var textPrefixLabel = v4v.text(_stage, 0,0,prefix);
        // pGroup.getElement().appendChild(textPrefixLabel.getElement());
        // textPrefixLabel.attr("y",textPrefixLabel.getElement().getBoundingClientRect().height*.6);
        // pGroup.attr("transform","scale("+(_scale*labelScale).toString()+","+(_scale*labelScale).toString()+")");

        // outerGroup.getElement().appendChild(pGroup.getElement());

        var sGroup = v4v.g(_stage,0,0);
        var textSuffixLabel = v4v.text(_stage, 0,0,_title);
        sGroup.getElement().appendChild(textSuffixLabel.getElement());
        sGroup.attr("transform","translate(0,"+(_stage.getElement().getBoundingClientRect().height-(textSuffixLabel.getElement().getBoundingClientRect().height*.8)).toString()+")");
        //textSuffixLabel.attr("y",textSuffixLabel.getElement().getBoundingClientRect().height);
        textSuffixLabel.attr("transform","scale("+(_scale*labelScale).toString()+","+(_scale*labelScale).toString()+")");
        sGroup.attr("transform","translate(0,"+(_stage.getElement().getBoundingClientRect().height-(textSuffixLabel.getElement().getBoundingClientRect().height*.5)).toString()+")");

        outerGroup.getElement().appendChild(sGroup.getElement());
        
        var piePath;



        if(hasImage){
            var img = v4v.image(_stage,{x:(_stage.getElement().getBoundingClientRect().height-(_stage.getElement().getBoundingClientRect().height*iconSizeRatio))/2,y:(_stage.getElement().getBoundingClientRect().height-(_stage.getElement().getBoundingClientRect().height*iconSizeRatio))/2,width:_stage.getElement().getBoundingClientRect().height*iconSizeRatio,height:_stage.getElement().getBoundingClientRect().height*iconSizeRatio,href:prefix.split("url(").join("").split(")").join("")});
            outerGroup.attr("transform","translate("+_stage.getElement().getBoundingClientRect().height.toString()+",0)");
        }
        else if(_showPie){
            var pieBG = v4v.circle(_stage,0,0,1);
            piePath = v4v.path(_stage,{},[{x:0,y:0,r:0},{x:0,y:1,r:0},{x:1,y:0,r:0}]);
            outerGroup.attr("transform","translate("+_stage.getElement().getBoundingClientRect().height.toString()+",0)");
            pieBG.attr("cx",_stage.getElement().getBoundingClientRect().height/2);
            pieBG.attr("cy",_stage.getElement().getBoundingClientRect().height/2);
            pieBG.attr("r",(_stage.getElement().getBoundingClientRect().height*iconSizeRatio)/2);
            pieBG.attr("style","opacity:.3;");
            piePath.attr("d",getPiePath(.1));
        }
        
        

        this.getElement = function(){
            return group.getElement();
        }

        this.update = function(_updatedValue, _updatedMax, _updatedMin){

            if(_updatedMax != undefined){
                max = _updatedMax;
            }
            if(_updatedMin != undefined){
                min = _updatedMin;
            }
            //console.log(max);
            var targetRatio = max-min == 0 ? 0 : ((_updatedValue-min)/(max-min));
            var updatedValue = targetRatio*100;
            var targetVal = _showPercentage ? _value : _val;
            animationPoint.animate({x:targetVal}, 1000, "in", function(){}, onMotion);
        }

        var animationPoint = v4v.point(0,0,0);
        this.update(_val);
        

        function onMotion(){
            
            
            var displayMax = showPercentage ? 100 : max;
            var displayMin = showPercentage ? 0 : min;
            var displaySuffix = showPercentage ? "%" : "";

            var beforeText = prefix != undefined  ? prefix : "";
            var afterText = suffix != undefined ? suffix : "";

            if(hasImage){
                beforeText = "";
            }

            
            textValueLabel.getElement().textContent = beforeText + Math.round(animationPoint.x).toString() + afterText;
            if(_showPie){
                var ratio = _showPercentage ? animationPoint.x : (animationPoint.x/_max)*100;
                piePath.attr("d",getPiePath(ratio));
            }
            
            //textValueLabel.getElement().textContent = beforeText+Math.round(animationPoint.x).toString()+afterText;
            
            //textValueLabel.attr("x", (textValueLabel.getElement().getBoundingClientRect().width/-2));
            //textValueLabel.attr("y", (textValueLabel.getElement().getBoundingClientRect().height/2));
            
        }

        function getPiePath(_v){
            var pieSize = _stage.getElement().getBoundingClientRect().height*iconSizeRatio;

            var pieChartPath = "M "+(_stage.getElement().getBoundingClientRect().height/2).toString()+" "+(_stage.getElement().getBoundingClientRect().height/2).toString();
            var knotches = 300;
            for(var i =0;i<knotches;i++){
                var xVal = v4v.orbit(_stage.getElement().getBoundingClientRect().height/2,pieSize/2,(((_v/100)*360)/knotches)*i,"cos");
                var yVal = v4v.orbit(_stage.getElement().getBoundingClientRect().height/2,pieSize/2,(((_v/100)*360)/knotches)*i,"sin");
                pieChartPath+=" L "+xVal.toString()+" "+yVal.toString();
            }
            return pieChartPath;
        }


    }

    function _Plugin(){
        
        this.makeBarChart = PlotlyPlugin.makeBarChart;
        this.makePieChart = PlotlyPlugin.makePieChart;
        this.makeMultiColumChart = PlotlyPlugin.makeMultiColumChart;
        this.makeScatterPlot = PlotlyPlugin.makeScatterPlot;
        this.makeLineChart = PlotlyPlugin.makeLineChart;
        
        this.makePortionFillChart = v4vPlugin.makePortionFillChart;
        this.makeShapeFillChart = v4vPlugin.makeShapeFillChart;
        this.makeGuageChart = v4vPlugin.makeGuageChart;
        this.makeSymbolStack = v4vPlugin.makeSymbolStack;
        this.makeSymbolFrames = v4vPlugin.makeSymbolFrames;
        // this.makeGuageChart = function(_data,containerID,style){
        //     var stage = createStage(containerID);
        //     var wide = getWidth(stage);
        //     var high = getHeight(stage);
        //     var suf = style.title;
        //     var counter = new Counter(stage, _data.value, getColors()[0], wide/2, high/2, style.title, style.prefix, style.suffix, _data.total, 0, style.suffix=="%", false);
        // }
        this.makeCounterChart = function(_data,containerID,style){
            var stage = createStage(containerID);
            var wide = getWidth(stage);
            var high = getHeight(stage);
            
            var counter = new Counter(stage, _data.value, getColors()[0], wide/2, high/2, style.title, style.prefix, style.suffix, _data.total, 0, style.suffix=="%", style.prefix==" ");
        }

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

    }
    return new _Plugin();
})();
