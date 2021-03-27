/**
 * 请求参数
 */
//人员类别统计
let catePostData = {category1:'A1',category2:'A1-01'}
//风险热力
let riskHotPostData = {
  areaCode: '6201',
  category1: 'A1',
  category2: 'A1-01'
}
// 群体态势
let groupPostData = {category1:'A1',category2:'A1-A0'}

$(function(){
  $('.animates div').map((index,item)=>{
    $(item).addClass('hasload')
  })
})
// 群体态势
doPostForGroup(groupPostData)
function doPostForGroup(groupPostData) {
  let xData = [],activeData = [], totalData = []
  getGroupSituation(res=>{
    let {data} = res
    data.forEach(item=>{
      xData.push(item.areaName)
      activeData.push(item.activeCount)
      totalData.push(item.totalCount)
    })
    setQTTSOption(xData,activeData,totalData)
    mafatsChart.clear();
    mafatsChart.setOption(newOption)
  },groupPostData)
}

let mafatsChart = echarts3.init(document.getElementById('mafats'))

let newOption = {}

//设置EchartsOption
function setQTTSOption(xData,activeData,totalData) {
  newOption = {
    tooltip: {
    },
    legend: {
      data: ['活跃度', '总人数'],
      right: '20px',
      top: '9px',
      itemHeight: 6,
      itemWidth: 40,
      textStyle: {
        color: '#62C2D2'
      }
    },
    grid: {
      width: '842px',
      left: '17px',
      right: '20px',
      top: '46px',
      bottom: '10px',
      containLabel: true
    },
    xAxis: {
      position: 'bottom',
      type: 'category',
      data: xData,
      axisLine: {
        show: false,
        lineStyle: {
          color: '#fff',
          opacity: 0.2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#fff',
        margin: 10,
      }
    },
    yAxis: [
      {
        type: 'value',
        boundaryGap: false,
        axisLine: {
          show: true,
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#22DFFF',
            opacity: 0.2
          }
        },
        axisLabel: {
          color: '#fff'
        },
        axisLabel: {
          color: "#62c2d2",
          inside: true,
          margin: -18
        }
      }
    ],
    series: [
      {
        name: '活跃度',
        type: 'line',
        smooth: true, // smooth
        data: activeData,
        barGap: '20%',
        barWidth: '10px',
        itemStyle: {
          color: '#FFCD07',
          barBorderRadius: 2
        }
      },
      {
        name: '总人数',
        type: 'bar',
        data: totalData,
        barWidth: '16px',
        barGap: '20%',
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#02D8FF' // 0% 处的颜色
              }, {
                offset: 1, color: '#0070A4' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            barBorderRadius: 7,
          }
        },
        emphasis: { // hover
          itemStyle: {
            color: '#02D8FF'
          }
        },
        lableLine: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 1, color: '#02D8FF' // 0% 处的颜色
            }, {
              offset: 0, color: '#0070A4' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          },
          barBorderRadius: 7
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(34, 223, 255, .1)',
          barBorderRadius: 7
        }
      }
    ]
  }
}

//风险热力
postForHotData(riskHotPostData)
function postForHotData(riskHotPostData) {
  getRiskHotSpots(res=>{
    let {data} = res
    $('#fxrl .city').text(data.areaName)
    $('#fxrl .stree').text("街道预警："+data.warningNum+"条")
    $('#fxrl .done').text("处置反馈："+data.feedbackNum+"条")
  },riskHotPostData)
}


// 仪表盘 -全省线索 全省预警
let qsxsData = 0, qsyjData = 0;
getCountInfo(res=>{
  let {data} = res
  $('.watch-charts.charts1 .count').text(data.clue.count)
  $('.watch-charts.charts2 .count').text(data.warning.count)
  qsxsData = data.clue.percent
  qsyjData = data.warning.percent

  let qsxsCharts = echarts.init(document.getElementById("qsxs"), null, { renderer: 'svg' })
  let WatchOption = {
    tooltip: {
      // formatter: '{a} <br/>{b} : {c}%'
    },
    series: [{
      name: '全省线索',
      type: 'gauge',
      progress: {
        show: true
      },
      axisLine: {
        show: false,
        lineStyle: { // 渡线样式
          color: [[.2, '#62c2d2'], [.4, '#62c2d2'], [.6, '#62c2d2'], [.8, '#62c2d2'], [1, '#62c2d2']],
          width: 3
        }
      },
      pointer: { // 指针样式
        width: 1,
        color: "#62c2d2",
        length: "40%"
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}'
      },
      splitLine: { // 分割线样式
        length: 5,
        color: "#62c2d2",
        lineStyle: {
          color: "#62c2d2",
          opacity: .2
        }
      },
      axisLabel: { // 刻度标签
        show: true,
        distance: 3,
        fontSize: 6,
      },
      axisTick: { //刻度样式
        show: true,
        splitNumber: 1,
        length: 5,
        lineStyle: {
          color: "#62c2d2",
          opacity: .7,
          width: 1,
          type: "solid"
        }
      },
      detail: { //仪表盘详情
        offsetCenter: [0, "60%"],
        color: '#22DFFF',
        fontSize: 9,
        formatter: "{value}%"
      },
      data: [{
        value: qsxsData
      }]
    }]
  };
  qsxsCharts.setOption(WatchOption)

  let qsyjCharts = echarts.init(document.getElementById("qsyj"), null, { renderer: 'svg' })
  let WatchOption1 = {
    tooltip: {
      // formatter: '{a} <br/>{b} : {c}%'
    },
    series: [{
      name: '全省预警',
      type: 'gauge',
      progress: {
        show: true
      },
      axisLine: {
        show: false,
        lineStyle: { // 渡线样式
          color: [[.2, '#62c2d2'], [.4, '#62c2d2'], [.6, '#62c2d2'], [.8, '#62c2d2'], [1, '#62c2d2']],
          width: 3
        }
      },
      pointer: { // 指针样式
        width: 1,
        color: "#62c2d2",
        length: "40%"
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}'
      },
      splitLine: { // 分割线样式
        length: 5,
        color: "#62c2d2",
        lineStyle: {
          color: "#62c2d2",
          opacity: .2
        }
      },
      axisLabel: { // 刻度标签
        show: true,
        distance: 3,
        fontSize: 6,
      },
      axisTick: { //刻度样式
        show: true,
        splitNumber: 1,
        length: 5,
        lineStyle: {
          color: "#62c2d2",
          opacity: .7,
          width: 1,
          type: "solid"
        }
      },
      detail: { //仪表盘详情
        offsetCenter: [0, "60%"],
        fontSize: 9,
        color: '#22DFFF',
        formatter: "{value}%"
      },
      data: [{
        value: qsyjData
      }]
    }]
  };
  qsyjCharts.setOption(WatchOption1)
})

// 爆点预警
getBurstWarning(res=>{
  let temp = '<ul>'
  let {data} = res
  data.forEach(item=>{
    temp += '<li><a href="#"><span>'+item.title+'</span><span>'+item.warningTime+'</span></a></li>'
  })
  temp += '</ul>'
  $('#bdyj').html(temp)
})

// 星期格式设置
function setDayLint(date) {
  var dayLint
  switch (new Date(date).getDay()) {
    case 0:
      dayLint = '日'
      break;
    case 1:
      dayLint = '一'
      break;
    case 2:
      dayLint = '二'
      break;
    case 3:
      dayLint = '三'
      break;
    case 4:
      dayLint = '四'
      break;
    case 5:
      dayLint = '五'
      break;
    case 6:
      dayLint = '六'
      break;
    default:
      break;
  }
  return dayLint
}
$("#View .layui-laydate-content").hover(e => {
  console.log("x: " +e.screenX+ "y: " +e.screenY)
})
// 日历组件 
// 初始化加载当前月重大事件
let markobj = {}
let arrEvent = []
let _d = new Date()
let month = _d.getMonth()+1
let year = _d.getFullYear()
getWarningCalendar(res=>{
  let {data} = res
  data.forEach(item=>{
    let d = item.day > 9 ? item.day : '0'+item.day;
    let m = item.month > 9 ? item.month : '0'+item.month
    let _key = item.year+'-'+m+'-'+d
    markobj[_key] = ''
    arrEvent.push({Cid:_key,events:item.msg})
  })
  layui.use(['laydate', 'element'], function () {
    let {laydate, element} = layui;
    let preMonth = '',preYear = '';
    //执行一个laydate实例
    let ins1 = laydate.render({
      elem: '#candarComp', //指定元素
      ready: function(date) {
        thHTML = $('.layui-laydate-content th')
        for(let i = 0; i < thHTML.length; i++) {
          thHTML[i].innerHTML = "周 " + thHTML[i].innerHTML
        }
      },
      change: function(value,dates) {
        if(preMonth !== dates.month || preYear !== dates.year){
          preMonth = dates.month
          preYear = dates.year
          getWarningCalendar(res=>{
            let {data} = res
            data.forEach(item=>{
              let d = item.day > 9 ? item.day : '0'+item.day;
              let m = item.month > 9 ? item.month : '0'+item.month
              let _key = item.year+'-'+m+'-'+d
              ins1.config.mark[_key] = ''
              ins1.config.arrEvent.push({Cid:_key,events:item.msg})
            })
          },{year:preYear,month:preMonth})
        }
      },
      done: (value, dates, endDate) => {
        const {year, month, date} = dates
        let itemEvents = ''
        $("#View").css("display", "flex")
        for(let i = 0, len = ins1.config.arrEvent.length; i < len; i++){
            let item = ins1.config.arrEvent[i];
            if(item.Cid === value) {
              itemEvents = item.events
            }
        }
        let zl = getZangli(value);
        let tmp = GetLunarDay(year,month,date)
        let nl = tmp.split(' ')
        lay('#View').html(`
          <div>
            <span class="f">${year} 年 ${month} 月</span>
            <span class="s">${date}</span>
            <span class="t">周 ${setDayLint(value)}</span>
            <span class="e"> ${itemEvents} </span>
          </div>
          <ul>
            <li>
              <p>农历 ${nl[0]}</p>
              <span>${nl[1]}</span>
            </li>  
            <li>
              <p>回历 己亥年</p>
              <span>七月初一</span>
            </li>  
            <li>
              <p>藏历 ${zl.year}年</p>
              <span>${zl.month}月(${zl.tMonth}月)${zl.day}</span>
            </li> 
          </ul>
        `);
      },
      position: 'static', 
      mark: markobj,
      trigger: 'click',
      theme: '#22DFFF28',
      color: '#62c2d2',
      showBottom: false,
      arrEvent: arrEvent // 添加事件到此处
    });
    
  });
},{year,month})

window.document.addEventListener('click',function(){
  $("#View").css("display","none")
})
//人员选择
/**
 * 人员类型选择
 */
// 二类
$('.pTypeData>ul>li').click(e => { // 交互
  // 人员类别统计
  doPostForCate(catePostData)
  //风险热力
  postForHotData(riskHotPostData)
  // 群体态势
  doPostForGroup(groupPostData)

  for(let i = 0; i < $('.pTypeData>ul').children().length; i++) {
    let item = $('.pTypeData>ul').children()[i]
    if($(item)[0].className === 'isSelected') {
      $(item)[0].className = '';
      break;
    }
  }
  $(e.target).addClass('isSelected')
})

// 一类
let translatePos = [
  {left:'191px',top:'-30px'},
  {left:'-30px',top:'30px'},
  {left:'233px',top:'133px'},
  {left:'96px',top:'70px'},
]
let initIndex = 6, preIndex = 3
$('.animates div').click(function(){
  // 人员类别统计
  doPostForCate(catePostData)
  //风险热力
  postForHotData(riskHotPostData)
  // 群体态势
  doPostForGroup(groupPostData)

  // 切换动画
  let _index = $(this).index() - initIndex
  let {left, top} = translatePos[_index]
  $('.animates div').eq(preIndex).css({
    'transform':'translate('+left+','+top+') scale(calc(60/140))'
  })
  $(this).css({
    'transform':'translate(96px,70px) scale(calc(1))'
  })
  let temp =  translatePos[_index]
  translatePos[_index] = translatePos[preIndex]
  translatePos[preIndex] = temp
  preIndex = _index
})

//人员类别统计
doPostForCate(catePostData)
function doPostForCate(catePostData) {
  getCategoryCount(res=>{
    let {data} = res
    $('.ryzs .count').text(data.totalPerson)
    $('.yjs .count').text(data.totalWarning)
    $('.hys .count').text(data.activePercentage+'%')
    $('.keyPerson .count').text(data.keyPerson)
    $('.attentionPerson .count').text(data.attentionPerson)
    $('.normalPerson .count').text(data.normalPerson)
  },catePostData)
}
