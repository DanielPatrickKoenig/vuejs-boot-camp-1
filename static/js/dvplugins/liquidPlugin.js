var liquidPlugin = (function(){


    
    

    function _Plugin(){
        function getColors(range){
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

        var hiddenValue = "hiddenValueForAlternativeChartTypes";

        var testObj = {x:0,y:0};
        var chartMatrix = {};

        var baseMargin = 40;

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
        
        

        var self = this;

        this.makeBarChart = function(_data,containerID,style,handler){

            function animateWavePoint(w,t,i,s,j){
                
                // if(chartMatrix[containerID] == s){
                //     TweenLite.to(t,.5+Math.random(),{y:t._y+(Math.random()*waveSize),onComplete:animateWavePoint,onCompleteParams:[t,i,s],onUpdate:function(_i){
                //         var targetElement = document.getElementById(containerID).getElementsByTagName("path")[_i];
                //         if(targetElement != undefined && i<barCount){
                //             targetElement.setAttribute("d",stage.getPathString(pathManifest[_i]));
                //         }
                //     },onUpdateParams:[i]});
                // }

                if(chartMatrix[containerID] == s){
                    if(waveSizes[i]>0){
                        TweenLite.to(w,.5+Math.random(),{d:(Math.random()*waveSizes[i])-(waveSizes[i]/2),onComplete:animateWavePoint,onCompleteParams:[w,t,i,s,j],onUpdate:function(_i,_j){
                            console.log(containerID);
                            if(document.getElementById(containerID) != undefined){
                                var targetElement = document.getElementById(containerID).getElementsByTagName("path")[_i];
                                if(targetElement != undefined && _i<barCount){
                                    //console.log(pathManifest[_i][_j]._y);
                                    //console.log(wavePointManifest[_i][_j].d);
                                    console.log(_i);
                                    pathManifest[_i][_j].y = Number(pathManifest[_i][_j]._y)+Number(wavePointManifest[_i][_j].d);
                                    targetElement.setAttribute("d",stage.getPathString(processPath(pathManifest[_i])));
                                    
                                    //handler()
                                }
                            }
                            

                        },onUpdateParams:[i,j],ease:easeType.easeInOut});
                    
                        waveSizes[i]-=.1;
                    }
                }
                
            }

            function processPath(p){
                var _p = [];
                for(var i = 0;i<p.length;i++){
                    var yVal = p[i].y>getHeight(stage)-(margin+1) ? getHeight(stage)-(margin+1) : p[i].y;
                    _p.push({x:p[i].x,y:yVal,r:p[i].r});
                }

                return _p;

            }

            var easeType = Sine;

            var values = _data;

            

            var stage = createStage(containerID);
            var highest = _data[hiddenValue] != undefined ? _data[hiddenValue] : -9999999;
            var barCount = 0;
            var waveSizes = [];
            for(var v in values)
            {
                if(v.toString() != "_gsTweenID" && v.toString() != hiddenValue){
                    if(values[v]>highest){
                        highest = values[v];
                    }
                    barCount++;
                    waveSizes.push(getHeight(stage)/6);
                }
                
            }

            var barIndex = 0;

            var margin = _data[hiddenValue] != undefined ? 0 : baseMargin;
            var liveArea = {width:getWidth(stage)-(margin*2),height:getHeight(stage)-(margin*2)};
            var waveCount = 6;
            var pathManifest = [];

            //var waveSize = getHeight(stage)/6;
            var tops = [];
            var wavePointManifest = [];

            for(var v in values){
                if(v.toString()!="_gsTweenID" && v.toString() != hiddenValue){
                    var bar = v4v.path(stage,{id:barIndex.toString()+"_"+containerID,fill:getColors()[barIndex]},[{x:0,y:0,r:0},{x:1,y:0,r:0},{x:0,y:1,r:0}]);
                    var leftEdge = margin+((liveArea.width/barCount)*barIndex);
                    var rightEdge = margin+((liveArea.width/barCount)*(barIndex+1));
                    var bottomEdge = getHeight(stage)-margin;
                    var topEdge = chartMatrix[containerID] != undefined ? chartMatrix[containerID].tops[barIndex] : bottomEdge;//bottomEdge - (liveArea.height*(values[v]/highest));
                    var _topEdge = bottomEdge - (liveArea.height*(values[v]/highest));
                    var wavePoints = chartMatrix[containerID] != undefined ? chartMatrix[containerID].waveMatrix[barIndex] : [];
                    var pathList = [];
                    var barSpeed = 1.5;
                    /*
                    if(chartMatrix[containerID] != undefined){
                        pathList = chartMatrix[containerID].list[barIndex];
                        console.log(pathList);


                    }
                    else{
                        //*/
                        pathList.push({x:leftEdge,y:bottomEdge,_y:bottomEdge,r:0});
                        
                        if(chartMatrix[containerID] == undefined){
                            wavePoints.push({d:0,s:0});
                        }
                        pathList.push({x:rightEdge,y:bottomEdge,_y:bottomEdge,r:0});
                        if(chartMatrix[containerID] == undefined){
                            wavePoints.push({d:0,s:0});
                        }
                        pathList.push({x:rightEdge,y:topEdge,_y:topEdge,r:0});
                        if(chartMatrix[containerID] == undefined){
                            wavePoints.push({d:topEdge,s:0});
                        }
                        
                        TweenLite.to(pathList[pathList.length-1],barSpeed,{_y:_topEdge});
                        for(var i = waveCount-1;i>=1;i--){
                            pathList.push({x:leftEdge+(((rightEdge-leftEdge)/waveCount)*i),y:topEdge,_y:topEdge,r:((rightEdge-leftEdge)/waveCount)/2});
                            if(chartMatrix[containerID] == undefined){
                                wavePoints.push({d:topEdge,s:0});
                            }
                            TweenLite.to(pathList[pathList.length-1],barSpeed,{_y:_topEdge});
                        }
                        pathList.push({x:leftEdge,y:topEdge,_y:topEdge,r:0});
                        if(chartMatrix[containerID] == undefined){
                            wavePoints.push({d:topEdge,s:0});
                        }
                        TweenLite.to(pathList[pathList.length-1],barSpeed,{_y:_topEdge,onUpdate:function(){
                            if(handler != undefined){
                                handler(Math.round(((liveArea.height - pathList[pathList.length-1]._y)/liveArea.height)*100).toString()+"%");
                            }
                        }});


                        
                    //}
                    pathManifest.push(pathList);
                    wavePointManifest.push(wavePoints);

                    tops.push(_topEdge);



                    //console.log(pathList);

                    bar.attr("d",stage.getPathString(processPath(pathList)));
                    if(_data[hiddenValue] == undefined){
                        var txt = v4v.text(stage,leftEdge,bottomEdge+(margin/2),v);
                        txt.attr("x",leftEdge+((rightEdge-leftEdge)/2)-(txt.getElement().getBoundingClientRect().width/2));
                    }
                    

                    barIndex++;
                }
                
            }

            chartMatrix[containerID] = {list:pathManifest,id:Math.random().toString().split(".").join("")+Math.random().toString().split(".").join("")+Math.random().toString().split(".").join(""),tops:tops,waveMatrix:wavePointManifest};
            console.log(pathManifest.length);
            for(var i = 0;i<pathManifest.length;i++){
                for(var j = 2;j<pathManifest[i].length;j++){
                    //console.log(pathManifest[i][j]);
                    //if(chartMatrix[containerID] == undefined){
                        animateWavePoint(wavePointManifest[i][j],pathManifest[i][j],i,chartMatrix[containerID],j);
                    //}
                    
                }
                
            }



            

            



            



            // var _layout = {
            //     title: style.title,
            //     font: {
            //         size: 16
            //     }
            // }
            // if(checkForExistingChart(containerID) && UTILITY.EnableAnimation){



            //     _data.onUpdate = function(){

                    
            //         var cData = getBasicColumChartData(copyObject(chartMatrix[containerID]));

            //         Plotly.newPlot(containerID, [cData], _layout);
            //     }

            //     TweenLite.to(chartMatrix[containerID],.5,_data);

                
            // }
            // else{
            //     chartMatrix[containerID] = _data;
            //     var cData = getBasicColumChartData(_data);
            //     Plotly.newPlot(containerID, [cData], _layout);
            // }

            
            // return cData;
        }


        this.makeGuageChart = function(_data,containerID,style){
            var stage = v4v.stage();
            var maskId = containerID+"maskDiv";
            var innerContainerID = containerID+"innerDiv";
            var wide = document.getElementById(containerID).getBoundingClientRect().width;
            var high = document.getElementById(containerID).getBoundingClientRect().height;
            var chartSize = wide > high ? high : wide;
            var paddingString = wide > high ? "left:"+((wide-high)/2).toString()+"px;" : "top:"+((high-wide)/2).toString()+"px;"
            var styleString = "width:"+chartSize+"px;height:"+chartSize+"px;";
            if(document.getElementById(maskId) != undefined){
                document.getElementById(containerID).removeChild(document.getElementById(maskId));
            }
            var msk = stage.makeXHTML("div",{id:maskId,style:styleString+"box-shadow:0 0 4px "+getColors()[0]+" inset;overflow:hidden;border-radius:"+(chartSize/2).toString()+"px;position:absolute;"+paddingString});
            var con = stage.makeXHTML("div",{id:innerContainerID,style:styleString});
            var txt = stage.makeXHTML("div",{style:"color:rgba(255,255,255,1);text-shadow: rgba(0, 0, 0, 1) 0px 0px 5px;position:absolute;width:100%;text-align:center;font-weight:bold;font-size:"+(chartSize/5).toString()+"px;line-height:"+(chartSize/500).toString()+";"});

            

            var barData = {};
            barData.value = _data.value;
            barData[hiddenValue] = _data.total;
            msk.appendChild(con);
            msk.appendChild(txt);
            document.getElementById(containerID).appendChild(msk);
            self.makeBarChart(barData,innerContainerID,style,function(t){
                txt.innerHTML = t.toString();
                txt.style.top = ((chartSize/2)-(txt.getBoundingClientRect().height/2)).toString()+"px";
                txt.innerHTML+="<br /><span style='font-size:"+(chartSize/14).toString()+"px;'>"+style.title+"</span>";
            });

            //document.getElementById(containerID).getElementsByTagName("svg")[0].appendChild(txt);
            //txt.innerHTML = "HELLO";
            //txt.style.top = ((chartSize/2)-(txt.getBoundingClientRect().height/2)).toString()+"px";
            //txt.style
            //txt.setAttribute("x",((chartSize/2)-(txt.getBoundingClientRect().width/2)).toString());
            //txt.setAttribute("y",((chartSize/2)-(txt.getBoundingClientRect().height/2)).toString());

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