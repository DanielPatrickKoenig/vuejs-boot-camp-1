var UTILITY = (function(){{
    function UtilityObject(){
            var instanceID = "0060211953685908260280128356130258306208882512510767";
            var vueInstances = {};
            var _self = this;
            var chartData;
            var _PLUGIN;

            this.BAR_BASIC = 'bar_basic'+instanceID;
            this.BAR_GROUP = 'bar_group'+instanceID;
            this.PIE_BASIC = 'pie_basic'+instanceID;
            this.SCATTER_PLOT = 'scatter_plot'+instanceID;
            this.PORTION_FILL = 'portion_fill'+instanceID;
            this.PORTION_FILL_SINGLE_METRIC = 'portion_fill_single_metric'+instanceID;
            this.GUAGE = 'guage'+instanceID;
            this.SHAPE_STACK = 'shape_stack'+instanceID;
            this.FRAMES = 'frames'+instanceID;
            this.LINE = 'line'+instanceID;
            this.COUNTER = 'counter'+instanceID;
            this.LABEL = 'label'+instanceID;
            this.DROPDOWN_CONTROL = 'dropdown'+instanceID;
            this.RADIOBUTTON_CONTROL = 'radiobutton'+instanceID;
            this.CHECKBOX_CONTROL = 'checkbox'+instanceID;
            this.BUBBLE = 'bubble'+instanceID;
            this.WILD_CARD = 'wildcard'+instanceID;


            this.ColorList = ["#97a501","#0179a5","#a50171","#986f3f","#4c585c","#74479e","#b61717"];
            this.EnableAnimation = false;
            this.getChartData = function(){
                return chartData;
            }
            this.getDelimiters = function(){
                return ["<%","%>"];
            }
            this.setVueByID = function(id,v){
                vueInstances[id] = v;
            }
            this.getVueByID = function(id){
                return vueInstances[id];
            }

            this.setPlugin = function(p){
                _PLUGIN = p;
            }

            this.renderChart = function(_data,_styling,_id,_types,altPlugin){
                var chartType = _types[0];
                //var chartType = _type == undefined ? _self.BAR_BASIC : _type;
                var chartPlugin = altPlugin!=undefined ? altPlugin : _PLUGIN;

                
                if($("#"+_id).attr("current-chart-type") != undefined){
                    chartType = $("#"+_id).attr("current-chart-type");
                }
                var compatibleMethhods = [];
                switch(chartType){
                    case _self.BAR_BASIC:{
                        chartPlugin.makeBarChart(_data,_id,_styling);
                        break;
                    }
                    case _self.PIE_BASIC:{
                        chartPlugin.makePieChart(_data,_id,_styling);
                        break;
                    }
                    case _self.BAR_GROUP:{
                        chartPlugin.makeMultiColumChart(_data,_id,_styling);
                        break;
                    }
                    case _self.SCATTER_PLOT:{
                        chartPlugin.makeScatterPlot(_data,_id,_styling);
                        break;
                    }
                    case _self.PORTION_FILL:{
                        chartPlugin.makePortionFillChart(_data,_id,_styling);
                        break;
                    }
                    case _self.PORTION_FILL_SINGLE_METRIC:{
                        chartPlugin.makeShapeFillChart(_data,_id,_styling);
                        break;
                    }
                    case _self.GUAGE:{
                        chartPlugin.makeGuageChart(_data,_id,_styling);
                        break;
                    }
                    case _self.SHAPE_STACK:{
                        chartPlugin.makeSymbolStack(_data,_id,_styling);
                        break;
                    }
                    case _self.FRAMES:{
                        chartPlugin.makeSymbolFrames(_data,_id,_styling);
                        break;
                    }
                    case _self.LINE:{
                        chartPlugin.makeLineChart(_data,_id,_styling);
                        break;
                    }
                    case _self.COUNTER:{
                        chartPlugin.makeCounterChart(_data,_id,_styling);
                        break;
                    }
                    case _self.LABEL:{
                        chartPlugin.makeLabel(_data,_id,_styling);
                        break;
                    }
                    case _self.DROPDOWN_CONTROL:{
                        chartPlugin.makeDropdown(_data,_id,_styling);
                        break;
                    }
                    case _self.RADIOBUTTON_CONTROL:{
                        chartPlugin.makeRadioBlock(_data,_id,_styling);
                        break;
                    }
                    case _self.CHECKBOX_CONTROL:{
                        chartPlugin.makeCheckboxBlock(_data,_id,_styling);
                        break;
                    }
                    case _self.BUBBLE:{
                        chartPlugin.makeBubbleChart(_data,_id,_styling);
                        break;
                    }
                    case _self.WILD_CARD:{
                        chartPlugin.makeWildCardChart(_data,_id,_styling);
                        break;
                    }
                }
                _self.addOptionsButton(_id,_types,_data,_styling,altPlugin);

            }

            this.addOptionsButton = function(_id,methods,_data,_styling,altPlugin) {
                $("#"+_id+" a.chart-options-button").css("display","block");
                if($("#"+_id+" a.chart-options-button").length==0){
                    $("#"+_id).append("<a class='chart-options-button'>options</a><ul class='chart-options-list chart-options-list"+_id+"' style='display:none;'></ul>");
                    $("#"+_id+" a.chart-options-button").click(function(){
                        var methodList = $(this).attr("methods").split(",");
                        $(".chart-options-list"+_id).css("display","block");
                        var htmlList = "";
                        for(var i = 0;i<methodList.length;i++){
                            htmlList+="<li actionid='"+methodList[i]+"'>"+getLabelByID(methodList[i])+"</li>"
                        }
                        $(".chart-options-list"+_id).html(htmlList);

                        $(".chart-options-list"+_id+" > li").click(function(){
                            var selectedChartType = $(this).attr("actionid");
                            _self.renderChart(_data,_styling,_id,[selectedChartType],altPlugin);
                            $("#"+_id).attr("current-chart-type",selectedChartType);
                        });
                    });
                }
                $("#"+_id+" a.chart-options-button").attr("methods",methods.toString())
                if(methods.length==0){
                    $("#"+_id+" a.chart-options-button").css("display","none");
                }

                //document.getElementById(_id).appendChild();
            }

            this.getParameterByName = function(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            }

            this.loadJSON = function(_url,_handler){
                var request = new XMLHttpRequest();
                request.open('GET', _url, true);

                request.onload = function() {
                  if (request.status >= 200 && request.status < 400) {
                    // Success!
                    var data = JSON.parse(request.responseText);
                    if(_handler != undefined){
                        _handler(data);
                    }
                    
                  } else {
                    // We reached our target server, but it returned an error

                  }
                };

                request.onerror = function() {
                  // There was a connection error of some sort
                };

                request.send();
            }

            this.isFunction = function(_f){
                return _f.toString().split(" ").join("").split("function(){").length>1;
                //return _f && {}.toString.call(_f) === '[object Function]';
            }

            this.getChildren = function(node){
                //return node.children;
                var nodeList = [];
                var childList = node.childNodes;
                console.log(childList);
                for(var i = 0;i<childList.length;i++){
                    if(childList[i].nodeName != "#text"){
                        nodeList.push(childList[i]);
                    }
                }
                return nodeList;
            }

            function getLabelByID(_id){
                var _lbl = "";
                switch(_id){
                    case _self.BAR_BASIC:{
                        _lbl = "Bar";
                        break;
                    }
                    case _self.PIE_BASIC:{
                        _lbl = "Pie";
                        break;
                    }
                    case _self.BAR_GROUP:{
                        _lbl = "Bar";
                        break;
                    }
                    case _self.SCATTER_PLOT:{
                        _lbl = "Scatter Plot";
                        break;
                    }
                    case _self.PORTION_FILL:{
                        _lbl = "Portion Fill";
                        break;
                    }
                    case _self.PORTION_FILL_SINGLE_METRIC:{
                        _lbl = "Portion Fill";
                        break;
                    }
                    case _self.GUAGE:{
                        _lbl = "Guage";
                        break;
                    }
                    case _self.SHAPE_STACK:{
                        _lbl = "Shape Stack";
                        break;
                    }
                    case _self.FRAMES:{
                        _lbl = "Frames";
                        break;
                    }
                    case _self.LINE:{
                        _lbl = "Line";
                        break;
                    }
                    case _self.COUNTER:{
                        _lbl = "Counter";
                        break;
                    }
                    case _self.LABEL:{
                        _lbl = "Label";
                        break;
                    }
                    case _self.CHECKBOX_CONTROL:{
                        _lbl = "Control";
                        break;
                    }
                    case _self.BUBBLE:{
                        _lbl = "Bubble";
                        break;
                    }
                    case _self.WILD_CARD:{
                        _lbl = "Wild Card";
                        break;
                    }
                }
                return _lbl;
            }




            
        
        }





        
    }

    return new UtilityObject();
})(this);
