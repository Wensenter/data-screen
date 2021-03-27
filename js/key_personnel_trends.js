//组件菜单切换
$('.left .title span').click(function(){
    $(this).addClass('active').siblings().removeClass('active')
})

// 基础请求参数
let d = new Date()
let date = d.getFullYear()+"-" + (d.getMonth()+1) + "-" + d.getDate();
let [year, month, day] = date.split("-");
let day1 = new Date(year, 0, 0);
let day2 = new Date(year, month - 1, day);
let now = (day2 - day1) / (1000 * 60 * 60 * 24)
let ChartPostData = {keyCategory:'',latelyDayNum:now}

// 活跃曲线
SEThyqxChart(ChartPostData)
let HourWaringsXData = [],HourWaringsYData = []
function SEThyqxChart (postData) {
    getHourWarings(res=>{
        let {data} = res
        HourWaringsXData = []
        HourWaringsYData = []
        data.map(item=>{
            HourWaringsXData.push(item.hour+':00')
            HourWaringsYData.push(item.warnNum)
        })
        hyqxChart.clear()
        setHYQXOption(HourWaringsXData,HourWaringsYData)
        hyqxChart.setOption(hyqxOption,true)
    },postData)
}
let hyqxChart = echarts3.init(document.getElementById('hyqx'))

let hyqxOption = {}
    

let mySwiper = null,_data = '';
getWaringPersons(res=>{
    let {data} = res
    if(data.length === 0){
        return
    }
    _data = data
    loadPic(data)
    // 高风险预警人员swiper
    mySwiper = new Swiper ('.pic-swiper', {
        loop: true, // 循环模式选项
        slidesPerView:3,
        centeredSlides:true,
    })  

    loadMsg(data)

    let d = $('.gfxyj .ctx li')
    for(let i = 0,l = d.length; i<l;i++){
        yjLamp(d.eq(i))
    }
    yjSwiper(data)
})

// 加载预警人员照片
function loadPic(data){
    data.forEach(e => {
        let h = $('<div class="swiper-slide">') 
        let t = `<a href="javascript:;" data-idCard="${e.idCard}" data-zdryId="${e.zdryId}" class="img-shadow toInfo">
                    <span class='score'>
                        <span class='num'>${e.score}</span>
                    </span>
                    <img src="${e.picUrl}" alt="">
                </a> `
            h.html(t)
        $('.gfxyjry .ctx .swiper-wrapper').append(h)
    });
    ToInfo()
}

//进入人员信息档案
function ToInfo() {
    $('.gfxyjry').delegate('.toInfo','click',function(){
        let idCard = $(this).attr('data-idCard')
        let zdryId = $(this).attr('data-zdryId')
        sessionStorage.setItem('idCard',JSON.stringify(idCard))
        sessionStorage.setItem('zdryId',JSON.stringify(zdryId))
        window.open('./electronic_personnel_file.html')
    })
}

// 加载高风险预警信息
function loadMsg(data){
    data.forEach((e,i) => {
        let h = $('<li>') 
        if(i == 0){
            h.addClass('active') 
        }
        let t = `<span class="text">
                    <span class="no-lamp">${e.msg}</span>
                    <span class="lamp">${e.msg}</span>
                </span>
                 <span class="time">${e.time}</span>`
            h.html(t)
        $('.gfxyj .ctx .yj-list').append(h)
    });
}

// 高风险预警 轮播
let count = 0,timer = '';
function yjSwiper(data,i=1) {
    $('.gfxyjry .info .name').text(data[i-1].name)
    $('.gfxyjry .info .type').text(data[i-1].type)
    $('.gfxyjry .id').text(data[i-1].idCard)
    $('.gfxyjry .address').text(data[i-1].address)

    let l = 5;

    timer = setInterval(()=>{
        $('.yj-list li').eq(i).addClass('active').siblings().removeClass('active')
        $('.yj-list li').eq(i).find('.lamp').css({
            'transform':'translateX('+ 0 +'px)'
        })
        $('.gfxyjry .info .name').text(data[i].name)
        $('.gfxyjry .info .type').text(data[i].type)
        $('.gfxyjry .id').text(data[i].idCard)
        $('.gfxyjry .address').text(data[i].address)
        count = 0
        mySwiper.slideNext()
        if(i == l){
            i = -1
        }
        i++

    },3000)
    
}

//选择高风险预警
let _index = '';
let selectFlag = false;
$('.yj-list').delegate('li','click',function(){
    _index = $(this).index()
    selectFlag = true
    clearInterval(timer)
    $('.yj-list li').eq(_index).addClass('active').siblings().removeClass('active')
    $('.yj-list li').eq(_index).find('.lamp').css({
        'transform':'translateX('+ 0 +'px)'
    })
    $('.gfxyjry .info .name').text(_data[_index].name)
    $('.gfxyjry .info .type').text(_data[_index].type)
    $('.gfxyjry .id').text(_data[_index].idCard)
    $('.gfxyjry .address').text(_data[_index].address)
    mySwiper.slideTo(_index)
})

$('.yj-list').mouseleave(function(){
    if(selectFlag){
        _index+=1
        let timer0 = setTimeout(()=>{
            selectFlag = false
            yjSwiper(_data,_index)
            clearTimeout(timer0)
        },0)   
    }
})

//高风险预警 走马灯
function yjLamp(el){
    let w = el.find('.text'), nl = el.find('.no-lamp'), l = el.find('.lamp');
    if(w.width()>=nl.width()+1){
        return
    }else{
        l.css({
            'transform':'translateX('+ count +'px)'
        })
        timer = setInterval(()=>{
            l.css({
                'transform': 'translateX('+ count +'px)'
            })
            if(count < -l.width()){
                count = w.width()
            }
            count-=1
        },100)
    }
}

//风控雷达
SETfkldChart(ChartPostData)
let radarIndicator = [],radarData = [];
function SETfkldChart (postData = {}) {
    getRadarStatis(res=>{
        let {data} = res
        radarIndicator = []
        radarData = []
        // 找出最大值
        let max = data[0].waringRatio;
        for (let i = 0; i < data.length - 1; i++) {
            max = max < data[i+1].waringRatio ? data[i+1].waringRatio : max
        }
        data.map(item=>{
            radarIndicator.push(
                {
                    name:item.categoryName,
                    max:max
                }
            )
            radarData.push(item.waringRatio*1)
        })
        setFKLDOption(radarIndicator,radarData)
        fkldChart.setOption(fkldOption)
    },postData)
} 
let fkldChart = echarts3.init(document.getElementById('fkld'))

let fkldOption = {}


//预警分布
SETyjfbChart(ChartPostData)
let yjXData = [], yjTotalYData = [], yjHighYData = []
function SETyjfbChart (postData={}) {
    getWaringDistribute(function(res){
        let { data } = res
        yjXData = []
        yjTotalYData = []
        yjHighYData = []
        data.map(item=>{
            let name = item.areaName.slice(0,item.areaName.length-1)
            yjXData.push(name)
            yjTotalYData.push(item.num)
            yjHighYData.push(item.highNum)

        })
        yjfbChart.clear()
        setYJFBOption(yjXData,yjTotalYData, yjHighYData)
        yjfbChart.setOption(yjfbOption)
    },postData)
}
let yjfbChart = echarts3.init(document.getElementById('yjfb'))

let yjfbOption = {}


//风控状态
getRiskStatus(function(res){
    let {high,middle,low,litte} = res
    if(!high){
        high = 0
    }
    if(!middle){
        middle = 0
    }
    if(!low){
        low = 0
    }
    if(!litte){
        litte = 0
    }
    $('.fkzt .zt-data li').eq(0).text(high)
    $('.fkzt .zt-data li').eq(1).text(middle)
    $('.fkzt .zt-data li').eq(2).text(low)
    $('.fkzt .zt-data li').eq(3).text(litte)
    let sum = high + middle + low + litte;
    let ca,cb,cc,cd;
    ca = ((high/sum).toFixed(2))*200
    cb = ((middle/sum).toFixed(2))*200
    cc = ((low/sum).toFixed(2))*200
    cd = ((litte/sum).toFixed(2))*200
    hRender(ca,cb,cc,cd)
},'')

//重点/关注人员总数
let TotalType ='',TotalObj = {};
getPersonFlagNum(function(res){
    let {data} = res
    data.map(item=>{
        let num = ('00000000'+item.num).slice(-8)
        TotalObj[item.personFlag] = num
    })
    TotalType = TotalObj.keyTotal
    let lis = $('.zdorgz .ctx .num-plate li');
    for(let i = 0, len = TotalType.length; i<len; i++){
        lis.eq(i).text(TotalType[i])
    }
})

//重点/关注人员类别统计
let StatisType = 'keyNum',StatisObj = {}, TypeArray = ['A4','A6','A7','A1','A5','A3','A2','A8'];
getCategoryStatis(function(res){
    let {data} = res 
    data.map(item=>{
        StatisObj[item.category] = item
    })
    let StatisLis = $('.zdorgz .ctx .info-card li');
    for(let i = 0, len = StatisLis.length; i < len; i++){
        if(!StatisObj[TypeArray[i]]){
            StatisLis.eq(i).find('.num').text(0)
        }else{
            StatisLis.eq(i).find('.num').text(StatisObj[TypeArray[i]][StatisType])
        }
    }
})

//重点/关注人员切换
$('.zdorgz .title span').click(function(){
    let index = $(this).index()
    if(index === 1){
        TotalType = TotalObj.keyTotal
        StatisType = 'keyNum'
    }else if(index === 2){
        TotalType = TotalObj.focusTotal
        StatisType = 'focusNum'
    }
    let lis = $('.zdorgz .ctx .num-plate li');
    for(let i = 0, len = TotalType.length; i<len; i++){
        lis.eq(i).text(TotalType[i])
    }
    let StatisLis = $('.zdorgz .ctx .info-card li');
    for(let i = 0, len = StatisLis.length; i < len; i++){
        if(!StatisObj[TypeArray[i]]){
            StatisLis.eq(i).find('.num').text(0)
        }else{
            StatisLis.eq(i).find('.num').text(StatisObj[TypeArray[i]][StatisType])
        }
    }
})

//切换人员
$('.menu .personType a').click(function(){
    let type = $(this).attr('data-type')
    switch(type){
        case 'zt':
            checkPersonnelData('A4')
        break;
        case 'qk':
            checkPersonnelData('A6')
        break;
        case 'jsb':
            checkPersonnelData('A7')
        break;
        case 'gb':
            checkPersonnelData('A1')
        break;
        case 'sd':
            checkPersonnelData('A5')
        break;
        case 'sw':
            checkPersonnelData('A3')
        break;
        case 'sk':
            checkPersonnelData('A2')
        break;
        case 'qt':
            checkPersonnelData('A8')
        break;
        case 'qb':
            checkPersonnelData()
        break;
    }
})

function checkPersonnelData (type='') {
    ChartPostData.keyCategory = type
    //风控状态
    getRiskStatus(function(res){
        let {high,middle,low,litte} = res
        if(!high){
            high = 0
        }
        if(!middle){
            middle = 0
        }
        if(!low){
            low = 0
        }
        if(!litte){
            litte = 0
        }
        $('.fkzt .zt-data li').eq(0).text(high)
        $('.fkzt .zt-data li').eq(1).text(middle)
        $('.fkzt .zt-data li').eq(2).text(low)
        $('.fkzt .zt-data li').eq(3).text(litte)
        let sum = high + middle + low + litte;
        let ca,cb,cc,cd;
        ca = ((high/sum).toFixed(2))*200
        cb = ((middle/sum).toFixed(2))*200
        cc = ((low/sum).toFixed(2))*200
        cd = ((litte/sum).toFixed(2))*200
        hRender(ca,cb,cc,cd)
    },type)

    //活跃曲线
    SEThyqxChart(ChartPostData)

    //预警分布
    SETyjfbChart(ChartPostData)
}

//切换时间
$('.menu .dateType a').click(function(){
    $(this).addClass('active').parent().siblings().find('a').removeClass('active')
    let type = $(this).attr('data-type')
    checkDate(type)
})

function checkDate (date) {
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
    ChartPostData.latelyDayNum = type
    checkDateData(ChartPostData)
}

function checkDateData (postData) {

    //活跃曲线
    SEThyqxChart(postData)

    //预警分布
    SETyjfbChart(postData)

    //风控雷达
    SETfkldChart(postData)

}

//echart Option 设置
function setHYQXOption () {
    hyqxOption = {
        grid:{
            top:'10px',
            bottom:'20px',
            left:'40px',
            right:'20px'
        },
        tooltip:{
            show: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: HourWaringsXData,
            axisTick:{
                inside:true
            },
            axisLine:{
                lineStyle:{
                    color:'#22DFFF',
                    opacity: 0.2
                }
            }
        },
        yAxis: {
            type: 'value',
            axisTick:{ //y轴刻度线
                show:false,
            },
            splitLine:{
                lineStyle:{
                    color:'#22DFFF',
                    opacity: 0.2
                }
            },
            axisLine:{ //y轴
                show:false
            },
        },
        series: [{
            data: HourWaringsYData,
            type: 'line',
            areaStyle: {
                color:{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 1, color: 'rgba(31,88,191,0)' // 0% 处的颜色
                    }, {
                        offset: 0, color: 'rgba(31,220,254,0.67)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            },
            lineStyle:{
                color:'#65CDEF'
            },
            smooth: true
        }],
        textStyle:{
            color:'#fff',
            fontSize:16
        },
    };
}

function setYJFBOption (yjXData,yjTotalYData, yjHighYData) {
    yjfbOption = {
        grid:{
            top:'25px',
            bottom:'20px',
            left:'60px',
            right:'20px'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['高风险','总数'],
            right:'0',
            top:'0',
            textStyle:{
                color:'#fff',
                fontSize:12
            }
        },
        xAxis: [
            {
                type: 'category',
                data: yjXData
            }
        ],
        yAxis: {
            type: 'value',
            axisTick:{ //y轴刻度线
                show:false,
            },
            splitLine:{
                lineStyle:{
                    color:'#22DFFF',
                    opacity: 0.2
                }
            },
            axisLine:{ //y轴
                show:false
            },
        },
        textStyle:{
            color:'#fff',
            fontSize:16
        },
        series:[
            {
                name: '总数',
                type: 'bar',
                stack:'one',
                data: yjTotalYData,
                barWidth:25,    
                itemStyle:{
                    color:{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 1, color: '#008ACA' // 0% 处的颜色
                        }, {
                            offset: 0, color: '#02D8FF' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    },
                    barBorderRadius: 2,    
                }
            },
            {
                name: '高风险',
                type: 'bar',
                stack:'one',
                data: yjHighYData,
                barWidth: 25, 
                itemStyle:{
                    color:{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 1, color: '#00DB95' // 0% 处的颜色
                        }, {
                            offset: 0, color: '#0AFFA0' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    },
                    barBorderRadius: 2,
                }
            }
        ]
    }
}

function setFKLDOption () {
    fkldOption = {
        tooltip: {
            trigger: 'axis'
        },
        radar: {
            indicator: radarIndicator,
            name:{
                textStyle:{
                    fontSize:16,
                    color: '#fff'
                }
            },
            splitLine:{
                lineStyle:{
                    color:'#22DFFF',
                    opacity:0.5
                }
            },
            splitArea:{
                areaStyle:{
                    color:'rgba(255,255,255,0)'
                }
            },
            axisLine:{
                lineStyle: {
                    color: '#22DFFF',
                    opacity: 0.5
                }
            }
        },
        series: [{
            type: 'radar',
            tooltip: {
                trigger: 'item'
            },
            areaStyle: {
                color:'#22DFFF',
                opacity: 0.5
            },
            lineStyle:{
                color:'#1FDCFE'
            },
            itemStyle:{
                opacity:0
            },
            data: [
                {
                    value: radarData,
                    name:'数据分布'
                }
            ]
        }]
    }
    
}