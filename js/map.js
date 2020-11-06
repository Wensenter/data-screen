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
     * 初始化地图实例
     */
    var map = new minemap.Map({
        container: 'map',
        style: 'https://mineservice.minedata.cn/service/solu/style/id/12878', /*底图样式*/
        center: [100.40,35.53], /*地图中心点*/
        zoom: 5.05, /*地图默认缩放等级*/
        pitch: 0, /*地图俯仰角度*/
        maxZoom: 17, /*地图最大缩放等级*/
        minZoom: 3 , /*地图最小缩放等级*/
        logoControl: false
    });

    let baseSize = 1000000,size = 80,mapLoading = false;
    const MAX_SIZE = 2.5,MIN_SIZE = 1;

    map.on('load',function(){
        addGanSuGeometry() //绘制甘肃区域高亮
        mapLoading = true
    })


    //绘制甘肃区域高亮
    function addGanSuGeometry() {
        $.ajax({
            url:'../json/geoJson.json',
            type:'GET',
            success:function(res){
                map.addSource("fillSource", {
                    "type": "geojson",
                    "data": res
                });
                map.addLayer({
                    "id": "fillLayer",
                    "type": "fill",
                    "source": "fillSource",
                    "layout": {
                        "visibility": "visible",
                    },
                    "paint": {
                        "fill-color": "#1773B4",
                        "fill-opacity": 0.8,
                        "fill-outline-color": "#017FA7"
                    },
                });
                addScatterSources();
            }
        })
    }

    let numSize,sizeArr = [];
    // 首次加载
    function addScatterSources(){
        $.ajax({
            url:"../json/city.json",
            type:"get",
            success:function(res){
                let {rows} = res
                let jsonFeatures = [];
                rows.map(e=>{
                    numSize = (e.people_count_2010/baseSize).toFixed(2)*1;
                    if(numSize < MIN_SIZE){
                        numSize = MIN_SIZE
                    }
                    if(numSize > MAX_SIZE){
                        numSize = MAX_SIZE
                    }
                    sizeArr.push([numSize,numSize])
                    jsonFeatures.push({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [e.lng,e.lat]
                        },
                        "properties": {
                            "kind": numSize,
                            "title":(numSize*100).toFixed(0,10)
                        }
                    })
                })
                sizeArr.sort()
                map.addSource('points', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': jsonFeatures
                    },
                    // cluster: true,
                    // clusterMaxZoom: 15, /* 最大聚合层级 */
                    // clusterRadius: 50, /* 聚合半径 */
                });   
                
                addScatterLayers()
            }
        })
    }

    function addScatterLayers() {
        map.addImage('pulsing-dot', pulsingDot, {
            pixelRatio: 2
        });
        map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
                "text-field": "{title}",
                'icon-image': 'pulsing-dot',
                "icon-size": {
                    "property":"kind",
                    "base":1,
                    "stops":sizeArr
                },
                "text-size":14,
                "icon-allow-overlap": true,  //图标允许压盖
                "text-allow-overlap": true,   //图标覆盖文字允许压盖
            }
        });
    }

    // 户籍分布图
    function addScatter1Sources() {
        map.removeSource('points')
        $.ajax({
            url:"../json/city.json",
            type:"get",
            success:function(res){
                let {rows} = res
                let jsonFeatures = [];
                rows.map(e=>{
                    numSize = (e.people_count_2010/baseSize).toFixed(2)*1;
                    if(numSize < MIN_SIZE){
                        numSize = MIN_SIZE
                    }
                    if(numSize > MAX_SIZE){
                        numSize = MAX_SIZE
                    }
                    sizeArr.push([numSize,numSize])
                    jsonFeatures.push({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [e.lng,e.lat]
                        },
                        "properties": {
                            "kind": numSize,
                            "title":(numSize*100).toFixed(0,10)
                        }
                    })
                })
                sizeArr.sort()
                map.addSource('points', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': jsonFeatures
                    },
                    // cluster: true,
                    // clusterMaxZoom: 15, /* 最大聚合层级 */
                    // clusterRadius: 50, /* 聚合半径 */
                });   
                
                addScatter1Layers()
            }
        })
    }

    function addScatter1Layers() {
        map.removeImage('pulsing-dot')
        map.removeLayer('points')
        map.addImage('pulsing-dot', pulsingDot, {
            pixelRatio: 2
        });
        map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
                "text-field": "{title}",
                'icon-image': 'pulsing-dot',
                "icon-size": {
                    "property":"kind",
                    "base":1,
                    "stops":sizeArr
                },
                "text-size":14,
                "icon-allow-overlap": true,  //图标允许压盖
                "text-allow-overlap": true,   //图标覆盖文字允许压盖
            }
        });
    }

    // 赴京流向图
    let echartslayer = minemap.Template.create({map: map, type: 'od'});
    function addLine1Sources() {
        if(!mapLoading) return
        $.ajax({
            url:'../json/line1.json',
            type:'get',
            success:function(res){
                let {data} = res;
                data.map(e=>{
                    to = '北京';
                    e.unshift(40.2539)
                    e.unshift(116.4551)
                    e.splice(4,0,to)
                })
               let series = getSeries(data)
               let option = getOption(series);

               map.zoomTo(3)
                echartslayer.chart.setOption(option);
            }
        })
    }

     // 定义一个CustomLayerInterface来在地图上绘制脉冲点
     var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // 在图层添加到地图时获取获取canvas context
        onAdd: function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },

        // 每帧渲染时调用
        render: function () {
            var duration = 1000;
            var t = (performance.now() % duration) / duration;

            var radius = (size / 2) * 0.3;
            var outerRadius = (size / 2) * 0.7 * t + radius;
            var context = this.context;

            // 画外围圆
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );
            context.fillStyle = 'rgba(242, 233, 30,' + (1 - t) + ')';
            context.fill();

            // 画内圈圆
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = 'rgba(242, 233, 30, 1)';
            context.strokeStyle = 'yellow';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // 从canvas中更新图片数据
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;

            // 不断地重新绘制地图，导致平滑的动画点
            map.triggerRepaint();

            // 返回`true`让映射知道图像已经更新
            return true;
        }
    };

    // 飞线图数据处理
    function getSeries(data) {
        var scatterData = [];
        var lineData = [];
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var name = item[4];
            var dest = item[5];
            var count = item[6];

            if (count < min) {
                min = count;
            }
            if (count > max) {
                max = count;
            }
            scatterData.push({
                name: dest,
                count: count,
                value: item.slice(2, 4)
            });
            lineData.push({
                name: name,
                count: count,
                dest: dest,
                coords: [item.slice(0, 2), item.slice(2, 4)]
            });
        }

        return [{
            name: 'bgLine',
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 1,
            lineStyle: {
                normal: {
                    color: '#FFF800',
                    width: 2,
                    opacity: 0.5,
                    curveness: 0.2
                }
            },
            data: lineData
        }, {
            name: 'scatter',
            type: 'scatter',
            coordinateSystem: 'GLMap',
            zlevel: 2,

            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            symbolSize: 10,
            itemStyle: {
                normal: {
                    show: true,
                    color: '#FFF800'
                }
            },
            data: scatterData
        }, {
            name: 'sLine',
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 3,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.4,
                symbolSize: 4
            },
            lineStyle: {
                normal: {
                    color: '#FFF800',
                    width: 0,
                    curveness: 0.2
                }
            },
            data: lineData
        }, {
            name: 'lLine',
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 4,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.4,
                opacity: 0.08,
                symbolSize: 15
            },
            lineStyle: {
                normal: {
                    color: '#FFF800',
                    width: 0,
                    curveness: 0.2
                }
            },
            data: lineData
        }
        ];
    }

    // 设置echatrs Option
    function getOption(series) {
        return {
            GLMap: {
                roam: true
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0)',
                formatter: function (param) {
                    return param.data.name + '->' + param.data.dest + ': ' + param.data.count;
                }
            },
            series: series
        };
    }

    //