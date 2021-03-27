    /**
     * 全局参数设置
     */
     minemap.domainUrl = 'https://minedata.cn';
     minemap.dataDomainUrl = ['https://datahive.minedata.cn','https://datahive01.minedata.cn','https://datahive02.minedata.cn','https://datahive03.minedata.cn','https://datahive04.minedata.cn'];
     minemap.spriteUrl = 'https://minedata.cn/minemapapi/v2.1.0/sprite/sprite';
     minemap.serviceUrl = 'https://mineservice.minedata.cn/service/';
 
     /**
      * appKey、solution设置
      */
     minemap.appKey = '16be596e00c44c86bb1569cb53424dc9';
     minemap.solution = 12877;

     /**
      * 其他参数
      */
     // 热力风险请求参数
    let riskHotPostData_map = {
        areaCode: '6201',
        category1: 'A1',
        category2: 'A1-01'
    }
    // 散点图/户籍分布请求参数
    let mapChartPostData = {}
     /**
      * 初始化地图实例
      */
     var map = new minemap.Map({
         container: 'map',
         style: './json/style.json',
         center: [110.40,36.53], /*地图中心点*/
         zoom: 6, /*地图默认缩放等级*/
         pitch: 40, /*地图俯仰角度*/
         maxZoom: 17, /*地图最大缩放等级*/
         minZoom: 4 , /*地图最小缩放等级*/
         logoControl: false
     });
     map.dragRotate.disable();
 
 
     let mapLoading = false;
     let echartslayer = minemap.Template.create({map: map, type: 'od'});
 
     map.on('load',function(){
         addGanSuGeometry() //绘制甘肃区域高亮
         showScatter(mapChartPostData) 
         mapLoading = true
     })
 
     //地图缩放
     let tempZoom = 0
     let curZoom = 0
     let preZoom = 0
     let scatterType = 'case'
     const changeZoom = 8
     map.on("zoom", function(){
         curZoom = this.getZoom()
         // 根据zoom请求市区县数据
         if(curZoom > changeZoom){
             if(tempZoom <= changeZoom){
                 tempZoom = curZoom
                 getCaseDistribute (res=>{ 
                     let {data} = res
                     let scatterSeries = getScatterSeries(data);
                     let scatterOption = getScatterOption(scatterSeries);
                 
                     resetEchrats(scatterOption)
                 },scatterType)
             }
         }else{
             if(tempZoom > changeZoom){
                 tempZoom = curZoom
                 getcityCaseDistribute (res=>{
                     let {data} = res
                     let scatterSeries = getScatterSeries(data);
                     let scatterOption = getScatterOption(scatterSeries);
                 
                     resetEchrats(scatterOption)
                 },scatterType)
             }
         }
     });
     
    //绘制甘肃区域高亮
    function addGanSuGeometry() {
        map.addSource("gansu_map", {
            "type": "geojson",
            "data": "../json/620000_full.json"
        });
        map.addSource("gansu_map_border", {
            "type": "geojson",
            "data": "../json/620000.json"
        });
                //其它覆盖层
                map.addLayer({
                    "id": "gansu_map",
                    "type": "fill",
                    "source": "gansu_map",
                    "layout": {
                        "visibility": "visible",
                    },
                    "paint": {
                        "fill-color": "#236083",
                        "fill-opacity": 1,
                        "fill-outline-color": "#0091be"
                    },
                    // "minzoom": 3,
                    // "maxzoom": 8
                });
                map.addLayer({
                    "id": "gansu_map_border",
                    "type": "line",
                    "source": "gansu_map_border",
                    "layout": {
                        "visibility": "visible",
                    },
                    "paint": {
                        "line-width": 1,
                        "line-color":"#0091be",
                        "line-opacity":0.9,
                        "line-translate":[0,6],
                        "line-dasharray":[2,1]
                    },
                    // "minzoom": 3,
                    // "maxzoom": 17
                });
                map.addLayer({
                    "id": "gansu_map_border_01",
                    "type": "line",
                    "source": "gansu_map_border",
                    "layout": {
                        "visibility": "visible",
                    },
                    "paint": {
                        "line-width": 1,
                        "line-color":"#0091be",
                        "line-opacity":0.3,
                        "line-translate":[0,12],
                        "line-dasharray":[2,1]
                    },
                    // "minzoom": 3,
                    // "maxzoom": 17
                });
                map.addLayer({
                    "id": "gansu_map_border_02",
                    "type": "line",
                    "source": "gansu_map_border",
                    "layout": {
                        "visibility": "visible",
                    },
                    "paint": {
                        "line-width": 1,
                        "line-color":"#0091be",
                        "line-opacity":0.7,
                        "line-translate":[0,18],
                        "line-dasharray":[2,1]
                    },
                    // "minzoom": 3,
                    // "maxzoom": 17
                });
    }
 
    // 初始化散点图
    let scatterData = []
    const MAX_SIZE = 10
    function showScatter(postData) {
        map.zoomTo(5)
        //风险分布图-市区
        getCityRiskDistribute( res=>{
            let {data} = res
            let scatterSeries = getScatterSeries(data);
            let scatterOption = getScatterOption(scatterSeries);
        
            resetEchrats(scatterOption)
        },postData)
    }
    // 设置散点图series
    function getScatterSeries (data) {
        scatterData = [];
        data.map(item=>{
            scatterData.push({
                areaCode:item.areaCode,
                type:'personnel',
                name: item.areaName,
                value: [item.lon,item.lat,item.num]
            })
        })
        return {
            name: 'scatter',
            type: 'effectScatter',
            coordinateSystem: 'GLMap',
            zlevel: 1,

            label: {
                normal: {
                    show: true,
                    position: 'bottom',
                    formatter: function(param){
                        return param.data.value[2] + '\n' + param.data.name
                    }
                }
            },
            symbolSize: function(val){  
                return val[2]*10 > MAX_SIZE ? MAX_SIZE : val[2]*10
            },
            encode:{
                value:2
            },
            hoverAnimation: true,
            showEffectOn: 'render',
            rippleEffect: {
                scale: 5,
                brushType: 'stroke'
            },
            itemStyle: {
                normal: {
                    show: true,
                    shadowBlur: 10,
                    color: '#FFF800'
                }
            },
            data: scatterData
        }
    }
    // 设置散点图option
    function getScatterOption (series) {
        return {
            GLMap: {
                roam: true
            },
            tooltip: {
                show: false,
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0)',
                formatter: function (param) {
                    return param.data.name + '->' + param.data.dest + ': ' + param.data.count;
                }
            },
            series: series
        };
    }
 
    //echarts重绘
    function resetEchrats (option) {
        if(echartslayer){
            echartslayer.remove()
        }
        echartslayer = minemap.Template.create({map: map, type: 'od'});
        echartslayer.chart.setOption(option)
        //echarts 点击事件
        echartslayer.chart.on('click',function(param){
            //风险热力
            console.log(param)
            riskHotPostData_map.areaCode = param.data.areaCode
            getRiskHotSpots(res=>{
                let {data} = res
                $('#fxrl .city').text(data.areaName)
                $('#fxrl .stree').text("街道预警："+data.warningNum+"条")
                $('#fxrl .done').text("处置反馈："+data.feedbackNum+"条")
            },riskHotPostData_map)
            
        })
    }
// 一类
$('.animates div').click(function(){
    showScatter(mapChartPostData)
})

// 二类
$('.pTypeData>ul>li').click(e => { // 交互
    showScatter(mapChartPostData)
})