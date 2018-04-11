var UIPlugin = (function(){
    function _Plugin(){
        var testObj = {x:0,y:0};
        var chartMatrix = {};
        this.makeDropdown = function(_data,containerID,style){
            document.getElementById(containerID).innerHTML = "";
            var blankStage = v4v.stage();
            var selectElement = blankStage.makeXHTML("select",{style:"width:100%;"/*,cssClass:style.cssClass*/});
            for(var i = 0;i<_data.options.length;i++){
                var option = blankStage.makeXHTML("option",{value:i});
                option.innerHTML = _data.options[i].label;
                selectElement.appendChild(option);
            }
            //selectElement.innerHTML = _data.value;
            selectElement.addEventListener("change",function(e){
                var val = Number(e.currentTarget.value);
                //console.log(val);
                DATA_BROWSER.setDataFromPath(_data.template,(_data.valueString).split(","),_data.options[val]);
                _data.handler();
            });
            document.getElementById(containerID).appendChild(selectElement);
        }

        this.makeRadioBlock = function(_data,containerID,style){
            document.getElementById(containerID).innerHTML = "";
            var blankStage = v4v.stage();
            var listElement = blankStage.makeXHTML("ul",{style:"width:100%;"/*,cssClass:style.cssClass*/});
            for(var i = 0;i<_data.options.length;i++){
                var option = blankStage.makeXHTML("li",{value:i.toString()});

                option.innerHTML = "<label value='"+i.toString()+"'><input type='radio' value='"+i.toString()+"' name='radio_"+containerID+"' />"+_data.options[i].label+"</label>";
                listElement.appendChild(option);

                option.addEventListener("change",function(e){
                    var val = Number(e.currentTarget.getAttribute("value"));
                    //alert(val);
                    DATA_BROWSER.setDataFromPath(_data.template,(_data.valueString).split(","),_data.options[val]);
                    _data.handler();

                });
            }

            document.getElementById(containerID).appendChild(listElement);

        }

        this.makeChackboxBlock = function(_data,containerID,style){
            
        }

        this.makeSymbolFrames = function(_data,containerID,style){
            var stage;
            var portionFill;
            var stageID = containerID + "_v4v_svg";
            var stage = v4v.stage();

            var drawCarousel = function(_d){
                
                var content = stage.makeXHTML("div",{id:stageID,style:"width:100%;height:100%;overflow:hidden;"});
                document.getElementById(containerID).appendChild(content);
                var contentList = stage.makeXHTML("ul",{style:"margin:0;padding:0;margin-left:"+(Math.floor((_d.value/_d.total)*style.frames.length)*(content.getBoundingClientRect().width*-1)).toString()+"px;width:"+(content.getBoundingClientRect().width*style.frames.length).toString()+"px;height:100%;"});
                content.appendChild(contentList);
                for(var i = 0;i<style.frames.length;i++){
                    var contentListItem = stage.makeXHTML("li",{style:"float:left;display:block;padding:0;margin:0;background-repeat:no-repeat;background-size:cover;background-position:center center;background-image:"+style.frames[i]+";width:"+content.getBoundingClientRect().width.toString()+"px;height:100%;"});
                    contentList.appendChild(contentListItem);
                }
            }

            

            

            if(checkForExistingChart(containerID) && UTILITY.EnableAnimation){
                //
                //alert("exists");
                drawCarousel(chartMatrix[containerID]);
                var content = document.getElementById(stageID);
                TweenLite.to(document.getElementById(stageID).getElementsByTagName("ul")[0],2,{marginLeft:Math.floor((_data.value/_data.total)*style.frames.length)*(content.getBoundingClientRect().width*-1)});

                // TweenLite.to(document.getElementById(stageID).getElementsByTagName("ul")[0],1,{opacity:0,onComplete:function(){
                //     document.getElementById(stageID).getElementsByTagName("ul")[0].style.marginLeft = (Math.floor((_data.value/_data.total)*style.frames.length)*(content.getBoundingClientRect().width*-1)).toString()+"px";
                //     TweenLite.to(document.getElementById(stageID).getElementsByTagName("ul")[0],1,{opacity:1});
                // }});

            }
            else{
                drawCarousel(_data);
            }

            chartMatrix[containerID] = _data;

            
            
        }

        function getWidth(stage){
            //return stage.getElement().parentNode.getBoundingClientRect().width;
            return stage.getElement().getAttribute("width");

        }

        function getHeight(stage){
            //return stage.getElement().parentNode.getBoundingClientRect().height;
            return stage.getElement().getAttribute("height");
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