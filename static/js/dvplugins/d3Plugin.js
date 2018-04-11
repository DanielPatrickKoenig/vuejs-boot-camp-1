var d3Plugin = (function(){
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

        this.makeBubbleChart = function(_data,containerID,style){
            for(var i = document.getElementById(containerID).children.length-1;i>=0;i--){
                document.getElementById(containerID).removeChild(document.getElementById(containerID).children[i]);
            }
            var idMatrix = {};
            for(var _d in _data){
                idMatrix[_d.split(" ").join("").toLowerCase()] = _d;
            }
            console.log(idMatrix);
            var data = {bubbleData: _data};

            (function() {
                var isRunning = true;
                
                var containerElement = document.querySelector("#"+containerID);
                var dims = containerElement.getBoundingClientRect();
                var diameter = dims.width>dims.height ? dims.height : dims.width;


                var svg = d3.select("#"+containerID).append('svg')
                    .attr('width', diameter)
                    .attr('height', diameter);

                var bubble = d3.layout.pack()
                    .size([diameter, diameter])
                    .value(function(d) {return d.size;}) 
                    .padding(3);

                function drawBubbles(m) {

                    var nodes = bubble.nodes(processData(m))
                        .filter(function(d) { return !d.children; }); 

                    var vis = svg.selectAll('circle')
                        .data(nodes, function(d) { return d.name; });

                    var duration = 500;
                    var delay = 0;

                    vis.transition()
                        .duration(duration)
                        .delay(function(d, i) {delay = i * 7; return delay;}) 
                        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
                        .attr('r', function(d) { return d.r; })
                        .style('opacity', 1); 

                    vis.enter().append('circle')
                        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
                        .attr('r', function(d) { return 0; })
                        .attr('class', function(d) { return d.className; })
                        .transition()
                        .duration(duration * 0)
                        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
                        .attr('r', function(d) { return d.r; })
                        .style('opacity', 1);

                    vis.exit()
                        .transition()
                        .duration(duration)
                        .attr('transform', function(d) { 
                            var dy = d.y - diameter/2;
                            var dx = d.x - diameter/2;
                            var theta = Math.atan2(dy,dx);
                            var destX = diameter * (1 + Math.cos(theta) )/ 2;
                            var destY = diameter * (1 + Math.sin(theta) )/ 2; 
                            return 'translate(' + destX + ',' + destY + ')'; })
                        .attr('r', function(d) { return 0; })
                        .remove();
                }



                
                

                drawBubbles(data);

                var offset = {top:containerElement.getBoundingClientRect().top,left:containerElement.getBoundingClientRect().left};

                var emptyStage = v4v.stage();

                var allCircles = containerElement.getElementsByTagName("circle");
                var colorIndex = 0;
                for(var i = 0;i<allCircles.length;i++){
                    allCircles[i].setAttribute("fill",getColors()[colorIndex]);
                    colorIndex++;
                    if(colorIndex>=getColors().length){
                        colorIndex = 0;
                    }
                }
                setTimeout(function(){
                    for(var i = document.getElementById(containerID).getElementsByTagName("table").length-1;i>=0;i--){
                        document.getElementById(containerID).removeChild(document.getElementById(containerID).getElementsByTagName("table")[i]);
                    }
                    for(var i = 0;i<allCircles.length;i++){
                        var cDims = allCircles[i].getBoundingClientRect();
                        var cDiv = emptyStage.makeXHTML("table",{style:"text-align:center;position:absolute;border-radius:"+(cDims.width/2)+"px;width:"+cDims.width+"px;height:"+cDims.height+"px;left:"+(cDims.left-offset.left)+"px;top:"+(cDims.top-offset.top)+"px;"});
                        cDiv.innerHTML = "<tr><td valign='middle' style='color:#ffffff;height:100%;padding:0 "+(cDims.width/24).toString()+"px;;font-size:"+(cDims.width/8).toString()+"px;'>"+idMatrix[allCircles[i].getAttribute("class")]+" ("+_data[idMatrix[allCircles[i].getAttribute("class")]]+")"+"</td><tr>";
                        containerElement.appendChild(cDiv);
                    }
                },100);
                


                function processData(data) {
                    if(!data) return;

                    var obj = data.bubbleData;

                    var newDataSet = [];

                    for(var prop in obj) {
                        newDataSet.push({name: prop, className: prop.toLowerCase().replace(/ /g,''), size: obj[prop]});
                    }
                    return {children: newDataSet};
                }
                
            })();
            
        }
        
        

        


    }
    return new _Plugin();
})();