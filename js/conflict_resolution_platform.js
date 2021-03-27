//组件菜单切换
$('.left .title span').click(function(){
    $(this).addClass('active').siblings().removeClass('active')
})

// 命案发案 作案成因切换
function switchForMZ(type) {
    switch (type) {
        case 'zacy':
            $('#zacy').show()
            $('#sshr').hide()
            SetzacyChart()
            break;
        case 'sshr':
            $('#zacy').hide()
            $('#sshr').show()
            SetsshrChart()
            break;
    }
}

// 命案发案态势
SETmafatsChart()
let mafatsXData = [], mafatsYData = []
function SETmafatsChart (postData={}) {
    getCrimeSituation(function(res){
        let { data } = res
        mafatsXData = {crimeCaseNum:[],solveCrimeNum:[]}
        mafatsYData = []
        data.map(item=>{
            mafatsXData.crimeCaseNum.push(item.crimeCaseNum)
            mafatsXData.solveCrimeNum.push(item.solveCrimeNum)
            mafatsYData.push(item.areaName)
        })
        mafatsChart.clear()
        setMAFATSOption(mafatsXData,mafatsYData)
        mafatsChart.setOption(mafatsOption)
    },postData)
}
let mafatsChart = echarts3.init(document.getElementById('mafats'))
let mafatsOption = {}

// 作案成因分析
SetzacyChart()
let zacyXData = [],zacyYData = []
function SetzacyChart(postData={}) {
    getCrimeReason(function(res){
        let { data } = res
        zacyXData = []
        zacyYData = []
        data.map(item=>{
            zacyXData.push(item.reason)
            zacyYData.push(item.reasonPercentage)
        })
        zacyChart.clear()
        setZACYOption(zacyXData,zacyYData)
        zacyChart.setOption(zacyOption)
    },postData)
}
let zacyChart = echarts3.init(document.getElementById('zacy1'))
let zacyOption = {}


// 施受害人分析
// SetsshrChart()
let sshr1XData = [],sshr1YData = [],sshr2XData = [],sshr2YData = [],sshrChart1 = null, sshrChart2 = null
function SetsshrChart(postData={}) {
    getPersonCount(function(res){
        let { data } = res
        sshr1XData = []
        sshr1YData = {maleNum:[],femaleNum:[]}
        sshr2XData = []
        sshr2YData = {maleNum:[],femaleNum:[]}
        let temp = ``
        data.victimList.map(item=>{
            sshr1XData.push(item.ageGroup)
            sshr1YData.maleNum.push(-item.maleNum)
            sshr1YData.femaleNum.push(-item.femaleNum)
            temp =`<span>${item.ageGroup}</span>` + temp
        })
        $('#sshr .labelY').empty().html(temp)
        data.suspectList.map(item=>{
            sshr2XData.push(item.ageGroup)
            sshr2YData.maleNum.push(item.maleNum)
            sshr2YData.femaleNum.push(item.femaleNum)
        })
        if(!sshrChart1) {
            sshrChart1 = echarts3.init(document.getElementById('zacyorsshr-1'))
        }
        if(!sshrChart2) {
            sshrChart2 = echarts3.init(document.getElementById('zacyorsshr-2'))
        }
        sshrChart1.clear()
        sshrChart2.clear()
        setSSHR1Option(sshr1XData,sshr1YData)
        setSSHR2Option(sshr2XData,sshr2YData)

        sshrChart1.setOption(sshrOption1)
        sshrChart2.setOption(sshrOption2)

    },postData)
}
let sshrOption1 = {};
let sshrOption2 = {};


// 风险化解态势

SetfxhjtsChart()
let fxhjtsXData = [],fxhjtsYData = {findNum:[],warningNum:[],resolveNum:[]}
function SetfxhjtsChart(postData={}) {
    getRiskResolveSituation(function(res){
        let { data } = res
        fxhjtsXData = []
        fxhjtsYData = {findNum:[],warningNum:[],resolveNum:[]}
        data.map(item=>{
            fxhjtsXData.push(item.areaName)
            fxhjtsYData.findNum.push(item.findNum)
            fxhjtsYData.warningNum.push(item.warningNum)
            fxhjtsYData.resolveNum.push(item.resolveNum)
        })
        fxhjtsChart.clear()
        setFXHJTSOption(fxhjtsXData,fxhjtsYData)
        fxhjtsChart.setOption(fxhjtsOption)
    },postData)
}
let fxhjtsChart = echarts3.init(document.getElementById('fxtshj'))
let fxhjtsOption = {}

// 风险化解状况
getRiskResolveCount(res=>{
    let {data} = res
    $('.hjzk .find .num').text(data.findClue)
    $('.hjzk .icon-early-warning .num').text(data.triggerWarning)
    $('.hjzk .defuse .num').text(data.resolveWarning)
    $('.hjzk .pending .num').text(data.todayTodo)
})


// 爆点预警
let _data = '',listLength = 0;
let count = 0,timer = '';
getBurstWarning(res=>{
    let {data} = res
    if(data.length === 0){
        return false
    }
    listLength = data.length
    _data = data
    loadMsg(data)

    let d = $('.bdyj .ctx li')
    for(let i = 0,l = d.length; i<l;i++){
        yjLamp(d.eq(i))
    }
    yjSwiper(data)
})

// 高风险预警 轮播
function yjSwiper(data,i=1) {
    let l = listLength - 1;
    timer = setInterval(()=>{
        $('.yj-list li').eq(i).addClass('active').siblings().removeClass('active')
        $('.yj-list li').eq(i).find('.lamp').css({
            'transform':'translateX('+ 0 +'px)'
        })

        count = 0
        if(i >= l){
            console.log(1)
            i = -1
        }
        i++

    },3000)
    
}

// 加载高风险预警信息
function loadMsg(data){
    data.forEach((e,i) => {
        let h = $('<li>') 
        if(i == 0){
            h.addClass('active') 
        }
        let t = `<span class="text">
                    <span class="no-lamp">${e.title}</span>
                    <span class="lamp">${e.title}</span>
                </span>
                 <span class="time">${e.warningTime} <img class="location" src="../img/conflict_resolution_platform/icon-location.png" /></span>`
            h.html(t)
        $('.bdyj .ctx .yj-list').append(h)
    });
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

//情报来源
SETfkldChart()
let radarIndicator = [],radarData = [];
function SETfkldChart (postData = {}) {
    getIntelligenceSource(res=>{
        let {data} = res
        let _data = []
        for (let item in data) {
            _data.push(item)
        }
        radarIndicator = []
        radarData = []
        // 找出最大值
        let max = _data[0];
        console.log(max)
        for (let i = 0; i < _data.length - 1; i++) {
            max = max < _data[i+1] ? _data[i+1] : max
        }
        for (let item in data) {
            radarIndicator.push(
                {
                    name:item,
                    max:max
                }
            )
            radarData.push(item)
        }
        setQBLYption(radarIndicator,radarData)
        qblyChart.setOption(qblyOption)
    },postData)
} 
let qblyChart = echarts3.init(document.getElementById('qbly'))
let qblyOption = {}




// let qblyChart = echarts3.init(document.getElementById('qbly'))

// let qblyOption = {
//     tooltip: {
//         trigger: 'axis'
//     },
//     radar: {
//         indicator: [
//             { name: '110警情', max: 650},
//             { name: '监所', max: 160}, // 标签设置为红色
//             { name: '社区摸排（治安户长上报）', max: 300},
//             { name: 'JW发现', max: 380},
//         ],
//         name:{
//             textStyle:{
//                 fontSize:16,
//                 color: '#fff'
//             }
//         },
//         splitLine:{
//             lineStyle:{
//                 color:'#22DFFF',
//                 opacity:0.5
//             }
//         },
//         splitArea:{
//             areaStyle:{
//                 color:'rgba(255,255,255,0)'
//             }
//         },
//         axisLine:{
//             lineStyle: {
//                 color: '#22DFFF',
//                 opacity: 0.5
//             }
//         }
//     },
//     series: [{
//         type: 'radar',
//         tooltip: {
//             trigger: 'item'
//         },
//         areaStyle: {
//             color:'#22DFFF',
//             opacity: 0.5
//         },
//         lineStyle:{
//             color:'#1FDCFE'
//         },
//         itemStyle:{
//             opacity:0
//         },
//         data: [
//             {
//                 value: [265,100,90,127],
//                 name:'数据分布'
//             }
//         ]
//     }]
// }

// qblyChart.setOption(qblyOption)

//echarts option 设置
function setMAFATSOption() {
    mafatsOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['发案', '破案'],
            right: '20px',
            top: '9px',
            textStyle:{
                color:'#fff'
            }
        },
        grid: {
            left: '17px',
            right: '20px',
            top: '46px',
            bottom:'0',
            containLabel: true
        },
        xAxis: {
            position: 'top',
            type: 'value',
            boundaryGap: false,
            axisLine:{
                show: false
            },
            axisTick:{
                show: false
            },
            splitLine:{
                lineStyle:{
                    color:'#22DFFF',
                    opacity: 0.2 
                }
            },
            axisLabel:{
                color: '#fff'
            }
        },
        yAxis: {
            type: 'category',
            inverse: true,
            data: mafatsYData,
            axisTick:{
                show: false
            },
            axisLine:{
                show: true,
                lineStyle:{
                    color:'#22DFFF',
                    opacity: 0.2
                }
            },
            axisLabel:{
                color: '#fff'
            }
        },
        series: [
            {
                name: '发案',
                type: 'bar',
                data: mafatsXData.crimeCaseNum,
                barGap: '20%',
                barWidth:'10px',
                itemStyle:{
                    color:{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 1, color: '#F09C18' // 0% 处的颜色
                        }, {
                            offset: 0, color: '#FFD273' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    },
                    barBorderRadius: 2
                },
            },
            {
                name: '破案',
                type: 'bar',
                data: mafatsXData.solveCrimeNum,
                barWidth:'10px',
                barGap: '20%',
                itemStyle:{
                    color:{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 1, color: '#1961DD' // 0% 处的颜色
                        }, {
                            offset: 0, color: '#4DE4FF' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    },
                    barBorderRadius: 2
                },
            }
        ]
    };
}

function setZACYOption() {
    zacyOption = {
        barWidth: '20px',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'none'
            },
        },
        legend: {
           show: false
        },
        grid: {
            left: '15%',
            right: '4%',
            bottom: '10%',
            top:'10%',
            containLabel: false
        },
        xAxis: [
            {
                type: 'category',
                data:zacyXData,
                axisTick:{
                    show: false
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        color:'#22DFFF',
                        opacity: 0.2
                    }
                },
                axisLabel:{
                    color: '#fff'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLine:{
                    show: false
                },
                axisTick:{
                    show: false
                },
                splitLine:{
                    lineStyle:{
                        color:'#22DFFF',
                        opacity: 0.2 
                    }
                },
                axisLabel:{
                    color: '#fff',
                    formatter:'{value}%'
                },
            }
        ],
        series: [
            {
                type: 'bar',
                label: {
                    show: false,
                    position: 'left'
                },
                data: zacyYData,
                itemStyle:{
                    color: '#1FC2FF',
                    barBorderRadius: 3
                },
            }
        ]
    }
}

function setSSHR1Option() {
    sshrOption1 = {
        barWidth:'10px',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter:function(params) {
                 let result = "<div>" + params[0].axisValue + "</div>";
                 params.forEach(function(item, index) {
                   result +=
                     '<span style="display:inline-block;margin-right:5px;margin-bottom:2px;border-radius:10px;width:9px;height:9px;background:'+
                     item.color +
                     '"></span>';
                   result += item.seriesName + "：" + (Math.abs(item.data)) + "<br>";
                 });
                 return result;
             },
        },
        legend: {
            data: ['受害人(男)','受害人(女)'],
            textStyle:{
                color: '#fff'
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: false
        },
        xAxis: [
            {
                type: 'value',
                axisLine:{
                    show: false
                },
                axisTick:{
                    show: false
                },
                splitLine:{
                    lineStyle:{
                        color:'#22DFFF',
                        opacity: 0.2 
                    }
                },
                axisLabel:{
                    color: '#fff'
                }
            }
        ],
        yAxis: [
            {
                show: false,
                type: 'category',
                axisTick: {
                    show: false
                },
                position:'right',
                data: sshr1XData,
                axisTick:{
                    show: false
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        color:'#22DFFF',
                        opacity: 0.2
                    }
                },
                axisLabel:{
                    color: '#fff'
                }
            }
        ],
        series: [
            {
                name: '受害人(男)',
                type: 'bar',
                stack: '受害人',
                label: {
                    show: false,
                    position: 'left'
                },
                itemStyle:{
                    color: '#FFB414'
                },
                data: sshr1YData.maleNum
            },
            {
                name: '受害人(女)',
                type: 'bar',
                stack: '受害人',
                label: {
                    show: false,
                    position: 'left'
                },
                data: sshr1YData.femaleNum,
                itemStyle:{
                    color: '#D0FF14'
                },
            }
        ]
    };
}

function setSSHR2Option() {
    sshrOption2 = {
        barWidth:'10px',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter:function(params) {
                 let result = "<div>" + params[0].axisValue + "</div>";
                 params.forEach(function(item, index) {
                   result +=
                     '<span style="display:inline-block;margin-right:5px;margin-bottom:2px;border-radius:10px;width:9px;height:9px;background:'+
                     item.color +
                     '"></span>';
                   result += item.seriesName + "：" + (Math.abs(item.data)) + "<br>";
                 });
                 return result;
             },
        },
        legend: {
            data: ['受害人(男)','受害人(女)'],
            textStyle:{
                color: '#fff'
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: false
        },
        xAxis: [
            {
                type: 'value',
                axisLine:{
                    show: false
                },
                axisTick:{
                    show: false
                },
                splitLine:{
                    lineStyle:{
                        color:'#22DFFF',
                        opacity: 0.2 
                    }
                },
                axisLabel:{
                    color: '#fff'
                }
            }
        ],
        yAxis: [
            {
                show: false,
                type: 'category',
                axisTick: {
                    show: false
                },
                position:'right',
                data: sshr2XData,
                axisTick:{
                    show: false
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        color:'#22DFFF',
                        opacity: 0.2
                    }
                },
                axisLabel:{
                    color: '#fff'
                }
            }
        ],
        series: [
            {
                name: '受害人(男)',
                type: 'bar',
                stack: '受害人',
                label: {
                    show: false,
                    position: 'left'
                },
                itemStyle:{
                    color: '#1773B4'
                },
                data: sshr2YData.maleNum
            },
            {
                name: '受害人(女)',
                type: 'bar',
                stack: '受害人',
                label: {
                    show: false,
                    position: 'left'
                },
                data: sshr2YData.femaleNum,
                itemStyle:{
                    color: '#1FCCFE'
                },
            }
        ]
    };
}

function setFXHJTSOption() {
    fxhjtsOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter:function(params) {
                 let result = "<div>" + params[0].axisValue + "</div>";
                 params.forEach(function(item, index) {
                   result +=
                     '<span style="display:inline-block;margin-right:5px;margin-bottom:2px;border-radius:10px;width:9px;height:9px;background:'+
                     item.color +
                     '"></span>';
                   result += item.seriesName + "：" + (Math.abs(item.data)) + "<br>";
                 });
                 return result;
             },
        },
        legend: {
            data: ['发现','预警','化解'],
            textStyle:{
                color: '#fff'
            },
            top:'0',
            right:'0'
        },
        grid: {
            left: '5%',
            right: '4%',
            bottom: '10%',
            containLabel: false
        },
        xAxis: [
            {
                type: 'category',
                data:fxhjtsXData,
                axisTick:{
                    show: false
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        color:'#22DFFF',
                        opacity: 0.2
                    }
                },
                axisLabel:{
                    color: '#fff'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLine:{
                    show: false
                },
                axisTick:{
                    show: false
                },
                splitLine:{
                    lineStyle:{
                        color:'#22DFFF',
                        opacity: 0.2 
                    }
                },
                axisLabel:{
                    color: '#fff'
                }
            }
        ],
        series: [
            {
                name: '发现',
                type: 'bar',
                stack: '受害人',
                label: {
                    show: false,
                    position: 'left'
                },
                itemStyle:{
                    color: '#1FCCFE',
                    borderRadius: 3
                },
                barWidth:20,
                data: fxhjtsYData.findNum,
            },
            {
                name: '预警',
                type: 'bar',
                stack: '受害人',
                label: {
                    show: false,
                    position: 'left'
                },
                data: fxhjtsYData.warningNum,
                itemStyle:{
                    color: '#FE921F',
                    barBorderRadius: 3
                },
            },
            {
                name: '化解',
                type: 'bar',
                stack: '受害人',
                label: {
                    show: false,
                    position: 'left'
                },
                data: fxhjtsYData.resolveNum,
                itemStyle:{
                    color: '#0EF38F',
                    barBorderRadius: 3
                },
            }
        ]
    }
}

function setQBLYption() {
    qblyOption = {
        tooltip: {
            trigger: 'axis'
        },
        radar: {
            indicator: [
                { name: '110警情', max: 650},
                { name: '监所', max: 160}, // 标签设置为红色
                { name: '社区摸排（治安户长上报）', max: 300},
                { name: 'JW发现', max: 380},
            ],
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
                    value: [265,100,90,127],
                    name:'数据分布'
                }
            ]
        }]
    }
}