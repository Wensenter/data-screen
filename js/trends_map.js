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
        style: './json/style.json',
        center: [100.40,34.53], /*地图中心点*/
        zoom: 6, /*地图默认缩放等级*/
        pitch: 40, /*地图俯仰角度*/
        maxZoom: 17, /*地图最大缩放等级*/
        minZoom: 4 , /*地图最小缩放等级*/
        logoControl: false
    });
    map.dragRotate.disable();


    let mapLoading = false;
    let echartslayer = minemap.Template.create({map: map, type: 'od'});
    //map-echarts配置基础参数
    let md = new Date()
    let mdate = md.getFullYear()+"-" + (md.getMonth()+1) + "-" + md.getDate();
    let [myear, mmonth, mday] = mdate.split("-");
    let mday1 = new Date(myear, 0, 0);
    let mday2 = new Date(myear, mmonth - 1, mday);
    let mnow = (mday2 - mday1) / (1000 * 60 * 60 * 24)
    let mapChartType = 'hj';
    let mapChartPostData = {trailType:1,keyCategory:'',latelyDayNum:mnow};
    let coordinatesArr = [
        [91.380248, 43.003426],
        [111.089059, 43.003426],
        [111.089059, 31.018956],
        [91.380248, 31.018956]
    ]

    map.on('load',function(){
        //AddShadow(coordinatesArr)//绘制发光阴影层
        addGanSuGeometry() //绘制甘肃区域高亮
        showScatter(mapChartPostData) 
        mapLoading = true
    })

    //地图缩放
    let tempZoom = 0
    let curZoom = 0
    let preZoom = 0
    const changeZoom = 8
    map.on("zoom", function(){
        curZoom = this.getZoom()
        // 根据zoom请求市区县数据
        if(curZoom > changeZoom){
            if(tempZoom <= changeZoom){
                tempZoom = curZoom
                getResidenceDistribute (res=>{
                    let {data} = res
                    let scatterSeries = getScatterSeries(data);
                    let scatterOption = getScatterOption(scatterSeries);
                
                    resetEchrats(scatterOption)
                },mapChartPostData.keyCategory)
            }
        }else{
            if(tempZoom > changeZoom){
                tempZoom = curZoom
                getCityResidenceDistribute (res=>{
                    let {data} = res
                    let scatterSeries = getScatterSeries(data);
                    let scatterOption = getScatterOption(scatterSeries);
                
                    resetEchrats(scatterOption)
                },mapChartPostData.keyCategory)
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

    //绘制阴影层
    function AddShadow (arr) {
        let canvas = document.getElementById('canvasID');
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = '../img/public/map-shadow.png';
        setTimeout(()=>{
            canvas.height = canvas.height
            ctx.drawImage(img,0,0,950,722,0,0,950,722)
            let cs = map.getSource('canvas-source')
            if(cs){
                console.log(1)
                map.removeSource('canvas-source')
            }
            map.addSource('canvas-source', {
                type: 'canvas',
                canvas: 'canvasID',
                coordinates: arr
            });
            let cl = map.getLayer('canvas-layer')
            if(cl){
                map.removeLayer('canvas-layer')
            }
            map.addLayer({
                id: 'canvas-layer',
                type: 'raster',
                source: 'canvas-source'
            });
        },100)
    }

    //切换图表
    $('.menu .chart a').off('click').click(function(){
        $(this).addClass('active').parent().siblings().find('a').removeClass('active')
        let type = $(this).attr('data-type')
        mapChartType = type;
        switch(type){
            case 'hj':
                showScatter(mapChartPostData)
            break;
            case 'fj':
                mapChartPostData.trailType = 1
                addLineSources(mapChartPostData)
            break;
            case 'll':
                mapChartPostData.trailType = 2
                addLineSources(mapChartPostData)
            break;
            case 'lg':
                mapChartPostData.trailType = 3
                addLineSources(mapChartPostData)
            break;
        }
    })

    //切换人员
    $('.menu .personType a').off('click').click(function(){
        $(this).addClass('active').parent().siblings().find('a').removeClass('active')
        let type = $(this).attr('data-type')
        switch(type){
            case 'zt':
                checkoutPerson('A4')
            break;
            case 'qk':
                checkoutPerson('A6')
            break;
            case 'jsb':
                checkoutPerson('A7')
            break;
            case 'gb':
                checkoutPerson('A1')
            break;
            case 'sd':
                checkoutPerson('A5')
            break;
            case 'sw':
                checkoutPerson('A3')
            break;
            case 'sk':
                checkoutPerson('A2')
            break;
            case 'qt':
                checkoutPerson('A8')
            break;
            case 'qb':
                checkoutPerson()
            break;
        }
    })
    function checkoutPerson (type = '') {
        mapChartPostData.keyCategory = type
        if(mapChartType == 'hj'){
            showScatter(mapChartPostData) 
        }else{
            addLineSources(mapChartPostData)
        }
    }

    //切换时间
    $('.menu .dateType a').off('click').click(function(){
        $(this).addClass('active').parent().siblings().find('a').removeClass('active')
        let type = $(this).attr('data-type')
        checkoutDate(type)
    })

    function checkoutDate (date) {
        let type = '30'
        if(date === '0'){
            let d = new Date()
            let date = d.getFullYear()+"-" + (d.getMonth()+1) + "-" + d.getDate();
            let [year, month, day] = date.split("-");
            let day1 = new Date(year, 0, 0);
            let day2 = new Date(year, month - 1, day);
            type = (day2 - day1) / (1000 * 60 * 60 * 24)
        }else {
            type = date
        }
        mapChartPostData.latelyDayNum = type*1
        if(mapChartType == 'hj'){
            showScatter(mapChartPostData) 
        }else{
            addLineSources(mapChartPostData)
        }
    }

    // 飞线图
    function addLineSources(postData) {
        if(!mapLoading) return
        map.zoomTo(4)
        getTrailStatis(res=>{
            let {data} = res
            let series = getLineSeries(data)
            let option = getLineOption(series);
            resetEchrats(option)
        },postData)
    }


    // 飞线图数据处理
    function getLineSeries(data) {
        var scatterData = [];
        var lineData = [];
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var name = item.fromCity;
            var dest = item.toCity;
            var count = item.num;
            var fromCode = item.fromCode;
            var toCode = item.toCode;

            if (count < min) {
                min = count;
            }
            if (count > max) {
                max = count;
            }
            scatterData.push({
                name: name,
                count: count,
                dest: dest,
                value: [item.fromLon,item.fromLat]
            });
            scatterData.push({
                name: dest,
                value: [item.toLon,item.toLat]
            });
            lineData.push({
                type:'trajectory',
                name: name,
                count: count,
                dest: dest,
                fromCode,
                toCode,
                coords: [[item.fromLon,item.fromLat],[item.toLon,item.toLat]]
            });
        }
        scatterData = getUnique(scatterData)

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
            type: 'effectScatter',
            coordinateSystem: 'GLMap',
            zlevel: 2,

            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: function(val){
                        return val.data.name
                    }
                }
            },
            symbolSize: 10,
            rippleEffect:{
                scale: 5,
                brushType: 'stroke'
            },
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
                period: 4,
                trailLength: 0.4,
                symbolSize: 2
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
        , {
            name: 'lLine',
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 4,
            effect: {
                show: true,
                period: 4,
                trailLength: 0.4,
                opacity: 0.08,
                symbolSize: 10
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
    function getLineOption(series) {
        return {
            GLMap: {
                roam: true
            },
            tooltip: {
                show: true,
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0)',
                formatter: function (param) {
                    if(param.data.dest){
                        return param.data.name + '->' + param.data.dest + ': ' + param.data.count;
                    }else {
                        return param.data.count
                    }
                }
            },
            series: series
        };
    }

    // 初始化散点图
    let scatterData = []
    const MAX_SIZE = 10
    function showScatter(postData) {
        //户籍分布图
        map.zoomTo(5)
        getCityResidenceDistribute (res=>{
            let {data} = res
            let scatterSeries = getScatterSeries(data);
            let scatterOption = getScatterOption(scatterSeries);
        
            resetEchrats(scatterOption)
        },postData.keyCategory)
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
            let zoom = map.getCenter()
            let type = param.data.type
            let isCity = zoom > changeZoom ? 0 : 1
            let areaCode = param.data.areaCode
            let toCode = param.data.toCode
            let fromCode = param.data.fromCode
            handleEchartClick(type,isCity,areaCode,toCode,fromCode)
            
        })
    }
    // table基础参数
    const _pageSize = 10;
    let maxSize = ''
    // echarts 事件处理
    function handleEchartClick (type,isCity,areaCode,toCode,fromCode) {
        let keyPostData = {
            isCity,
            areaCode,
            pageNo:1,
            pageSize:_pageSize,
            flag:1,
            keyCategory:mapChartPostData.keyCategory
        }
        let TravelPostData = {
            pageNo:1,
            pageSize:_pageSize,
            toCode,
            fromCode,
            latelyDayNum:mapChartPostData.latelyDayNum,
            keyCategory:mapChartPostData.keyCategory
        }
        $('.'+type+'-pop').show()
        // 人员详情/重点关注
        if(type === 'personnel'){
            $('#personnel-pop li').eq(0).addClass('active').siblings().removeClass('active')
            initPage($('#personnel-pageInfo'),$('#personnel-pop'),keyPostData,function(){
                getPageKeyPersonsPage(keyPostData)
            })
            // 人员详情切换
            $('#personnel-pop li').off('click').click(function(){
                $(this).addClass('active').siblings().removeClass('active')
                let type = $(this).attr('data-type')*1
                keyPostData.flag = type
                getPageKeyPersonsPage(keyPostData)
            })
        }else if(type === "trajectory"){
            initPage($('#trajectory-pageInfo'),$('#trajectory-pop'),TravelPostData,function(){
                getPagePersonTrailPage(TravelPostData)
            })
        }
    }

    $('.pop-wrap .close').off('click').click(function(){
        $(this).parent().parent().parent().hide()
    })

    //刷新|生成分页信息|自定义属性pageIndex表示当前页面索引
    function refreshPageInfo(pageEl,tableWrapEl,pageCount,data,pageIndex,render) {
        let pageSize = Math.ceil(pageCount/_pageSize)
        tableWrapEl.find('.dataSum').text(pageCount)
        tableWrapEl.find('.pageSum').text(pageSize)
        let tmpPageIndex = 0
        pageEl.html('')
        var li = $('<li><a page="1">&laquo;</a></li>')
        pageEl.append(li)
        // 总页数小于等于10页，全部显示
        if (pageSize <= 10) {
            for (var i = 1; i <= pageSize; i++) {
                var li = $('<li><a page="' + i + '">' + i + '</a></li>')
                addActive(li, i, pageIndex)
                pageEl.append(li)
            }
            // 当前页是前10页
        } else if (pageIndex < 10) {
            for (var i = 1; i <= 10; i++) {
                var li = $('<li><a page="' + i + '">' + i + '</a></li>')
                addActive(li, i, pageIndex)
                pageEl.append(li)
            }
            pageEl.append('<li><a>...</a></li>')
            pageEl.append('<li><a page=' + pageSize + '>' + pageSize + '</a></li>')
            // 当前页面是最后10页
        } else if (pageSize - pageIndex < 10) {
            if (pageSize - 10 > 1) {
                pageEl.append('<li><a page="1">1</a></li>')
                pageEl.append('<li><a>...</a></li>')
            }
            for (var i = pageSize - 10; i <= pageSize; i++) {
                var li = $('<li><a page="' + i + '">' + i + '</a></li>')
                addActive(li, i, pageIndex)
                pageEl.append(li)
                if (i == 1) {
                    pageEl.append('<li><a>...</a></li>')
                }
            }
        } else {
            // 当前页面基于所有页面中间位置
            // 初始化页面基准坐标
            if (tmpPageIndex == 0) {
                tmpPageIndex = pageIndex
            }
            // 当页面索引达到最前或最后时，需要重新设置页面基准坐标
            if (tmpPageIndex <= pageIndex - 5 || tmpPageIndex >= pageIndex + 5) {
                tmpPageIndex = pageIndex
            }
            pageEl.append('<li><a page="1">1</a></li>')
            pageEl.append('<li><a>...</a></li>')
            for (var i = tmpPageIndex*1 - 5; i <= tmpPageIndex*1 + 5; i++) {
                console.log(i)
                var li = $('<li><a page="' + i + '">' + i + '</a></li>')
                addActive(li, i, pageIndex)
                pageEl.append(li)
            }
            pageEl.append('<li><a>...</a></li>')
            pageEl.append('<li><a page=' + pageSize + '>' + pageSize + '</a></li>')
        }
        var li = $('<li><a page="' + pageSize + '">&raquo;</a></li>')
        pageEl.append(li)
        tableWrapEl.find('table tbody').html('')
        data.map(item=>{
            tr = render(item)
            tableWrapEl.find('table').append(tr)
        })
    }

    // 添加分页按钮焦点
    function addActive(li, i, pageIndex) {
        if (i == pageIndex) {
            li.addClass('active')
        }
    }

    // 初始化table
    function initPage (pageEl,popEl,postData,getPagefun) {
        getPagefun(postData)
        pageEl.undelegate();
        pageEl.delegate('a','click',function(){
            let num = $(this).attr('page')
            postData.pageNo = num
            getPagefun(postData)
        })
        popEl.find('.stairs input').bind('keydown',function(e){
        　  let theEvent = e || window.event;
            let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        　　 if (code == 13) {
                let toIndex = ''; 
                if($(this).val()){
                    console.log(maxSize);
                    if( $(this).val() >= maxSize ) {
                        toIndex = maxSize
                    }else if( $(this).val() <= 1) {
                        toIndex = 1
                    }else{
                        toIndex = $(this).val()
                    }
                    $(this).val(toIndex)
                    $(this).blur()
                    postData.pageNo = toIndex
                    getPagefun(postData)
                }
            }
        })
    }

    // 获取散点图点的数据
    function getPageKeyPersonsPage (postData) {
        getPageKeyPersons(res=>{
            let {rows,total} = res
            let flagJson = {
                "1": "重点",
                "2": "关注",
                "3": "常规"
            }
            let riskLevelJson = {
                "1":"高风险",
                "2":"中风险",
                "3":"低风险",
                "4":"微风险"
            }
            refreshPageInfo($('#personnel-pageInfo'),$('#personnel-pop'),total,rows,postData.pageNo,function(item){
                let tr = $('<tr>')
                let temp = ``;
                temp+=` <td>${item['name']?item['name']:''}</td>`
                temp+=` <td>${item['residenceAddr']?item['residenceAddr']:''}</td>`
                temp+=` <td>${item['controlUnit']?item['controlUnit']:''}</td>`
                temp+=` <td>${item['personnelCategory']?item['personnelCategory']:''}</td>`
                temp+=` <td>${flagJson[item['flag']]?flagJson[item['flag']]:''}</td>`
                temp+=` <td>${item['score']?item['score']:''}</td>`
                temp+=` <td>${riskLevelJson[item['riskLevel']]?riskLevelJson[item['riskLevel']]:''}</td>`
                tr.html(temp)
                return tr
            })
            maxSize = Math.ceil((total/rows.length))
        },postData)
    }

    // 获取飞线图数据
    function getPagePersonTrailPage (postData) {
        getPagePersonTrail(res=>{
            let {rows,total} = res
            let flagJson = {
                "1": "重点",
                "2": "关注",
                "3": "常规"
            }
            let riskLevelJson = {
                "1":"高风险",
                "2":"中风险",
                "3":"低风险",
                "4":"微风险"
            }
            refreshPageInfo($('#trajectory-pageInfo'),$('#trajectory-pop'),total,rows,postData.pageNo,function(item){
                let tr = $('<tr>')
                let temp = ``;
                temp+=` <td>${item['personName']?item['personName']:''}</td>`
                temp+=` <td>${item['personnelCategory']?item['personnelCategory']:''}</td>`
                temp+=` <td>${flagJson[item['flag']]?flagJson[item['flag']]:''}</td>`
                temp+=` <td>${item['score']?item['score']:''}</td>`
                temp+=` <td>${riskLevelJson[item['riskLevel']]?riskLevelJson[item['riskLevel']]:''}</td>`
                temp+=` <td>${item['travelTime']?item['travelTime']:''}</td>`
                temp+=` <td>${item['content']?item['content']:''}</td>`
                tr.html(temp)
                return tr
            })
            maxSize = Math.ceil((total/rows.length))
        },postData)
    }

    // 数组中对象去重
    function getUnique(arr) {
        const map = {};
        arr.forEach(item => {
            const obj = {};
            Object.keys(item).sort().map(key => obj[key] = item[key]);
            map[JSON.stringify(obj)] = item;
        });
        return Object.keys(map).map(key => JSON.parse(key));
    }