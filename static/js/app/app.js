const app = new Vue({
  // create your Vue Object
  el: '#main',
  data:{
    averages:{},
    totalKey:'TOTAL',
    masterKey:'master',
    verticalIndex:-1,
    horizontalIndex:-1,
    loadedData:{},
    genreKey:"master",
    regionKey:"TOTAL",
    chartManifest:[
        {
            types:[UTILITY.PIE_BASIC],
            parser:function(d){
                var dataOutput = {};
                for(var _d in d.averages[app.genreKey]){
                    if(_d != app.totalKey){
                        dataOutput[_d] = d.averages[app.genreKey][_d];
                    }
                }
                return dataOutput;
            },
            title:"",
            classes:[]

        },
        {
            types:[UTILITY.LINE],
            parser:function(d){
                var dataOutput = [];
                
                var yearList = [];
                for(var _d in d.years){
                    yearList.push(_d);
                }
                yearList = yearList.sort();
                var regions = [];
                for(var r in d.years[yearList[0]]){
                    if(r != app.totalKey){
                        regions.push(r);
                    }
                    
                }
                for(var j = 0;j<regions.length;j++){
                    var dta = {data:{},name:regions[j]};
                    for(var i = 0;i<yearList.length;i++){
                    //for(var _d in d.years){
                        //var dta = {data:{},name:"TOTAL"};

                        dta.data[yearList[i]] = d.years[yearList[i]][regions[j]];
                       

                        //dataOutput[_d] = d.years[_d]["TOTAL"];
                    }
                    dataOutput.push(dta);
                }
                
                
                
                return dataOutput;
            },
            title:"Sales by Year",
            classes:["half-width"]

        },
        {
            types:[UTILITY.BAR_BASIC],
            parser:function(d){
                var dataOutput = {};
                for(var _d in d.averages){
                    if(_d != app.masterKey){
                        dataOutput[_d] = d.averages[_d][app.regionKey];
                    }
                }
                return dataOutput;
            },
            title:"",
            classes:["time-lapse-line-chart"]

        }
        // {
        //     types:[UTILITY.PIE_BASIC,UTILITY.BAR_BASIC],
        //     parser:function(d){
        //         return {Steak:d.data.beef_total,Chicken:d.data.chicken_total};
        //     },
        //     title:"Steak vs Chicken",
        //     classes:["half-width"]

        // }
    ],
    chartClassName:'simulator-chart'
  },
    methods:{            
        refresh:function(updateOutput){
            var _output = updateOutput == undefined ? app.loadedData : updateOutput;
            processChart(app,_output);
        },
        generateID:function(){
            return "chart"+Math.random().toString().split(".").join("")+"-"+Math.random().toString().split(".").join("")+"-"+Math.random().toString().split(".").join("");
        },
        assignClasses:function(item){
            var cList = ['simulator-chart'];
            if(item.classes!=undefined){
                for(var i = 0;i<item.classes.length;i++){
                    cList.push(item.classes[i]);
                }
            }
            return cList.join(" ");
        }
    },
  delimiters: ['<%', '%>']
});

// use axios for xhr
axios.get(GETDATA)
  .then(response => {
    //console.log(response.data);
    //document.getElementById('main').innerHTML = response.data;
    app.loadedData = response.data;
    app.averages = response.data.averages;

    UTILITY.setVueByID("main",app);
    processChart(app,response.data);
  })


function processChart(v,d){
    $("."+v.chartClassName).each(function(){
        var chartData = v.chartManifest[Number($(this).attr("chart-index"))].parser(d);
        var altPlugin = v.chartManifest[Number($(this).attr("chart-index"))].plugin;
        var shape = v.chartManifest[Number($(this).attr("chart-index"))].shape;
        //var style = shape == undefined ? {title:$(this).attr("title")} : {title:$(this).attr("title"),shape:shape};
        var frames = v.chartManifest[Number($(this).attr("chart-index"))].frames;
        var symbols = v.chartManifest[Number($(this).attr("chart-index"))].symbols;
        var style = {title:$(this).attr("title"),shape:shape,frames:frames,symbols:symbols}
        UTILITY.renderChart(chartData,style,$(this).attr("id"),$(this).attr("chart-types").split(","),altPlugin);
    });
}
