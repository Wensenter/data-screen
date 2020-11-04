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

    let baseSize = 1000000,size = 80;
    const MAX_SIZE = 2.5,MIN_SIZE = 1;
    map.on('load',function(){
        addSources();
    })

    let numSize,sizeArr = [];
    function addSources(){
        $.ajax({
            url:'../json/geoJson.json',
            type:'GET',
            success:function(res){
                map.addSource("fillSource", {
                    "type": "geojson",
                    "data": res
                });
                addLayers()
            }
        })
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
                    }
                });                
            }
        })
    }

    function addLayers() {
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