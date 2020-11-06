//组件菜单切换
$('.left .title span').click(function(){
    $(this).addClass('active').siblings().removeClass('active')
})

// 活跃曲线
let hyqxChart = echarts.init(document.getElementById('hyqx'))

hyqxOption = {
    grid:{
        top:'10px',
        bottom:'20px',
        left:'40px',
        right:'20px'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        axisTick:{
            inside:true
        },
        axisLine:{
            lineStyle:{
                color:'#22DFFF'
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
                color:'#22DFFF'
            }
        },
        axisLine:{ //y轴
            show:false
        },
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
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
hyqxChart.setOption(hyqxOption)
    

let mySwiper = null
$.ajax({
    url:'../json/yj.json',
    type:'get',
    success:function(d){
        let {state,data} = d
        if(state == 200){
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
        }
    }
})

// 加载预警人员照片
function loadPic(data){
    data.forEach(e => {
        let h = $('<div class="swiper-slide">') 
        let t = `<a href="#" class="img-shadow">
                    <img src="${e.picUrl}" alt="">
                </a> `
            h.html(t)
        $('.gfxyjry .ctx .swiper-wrapper').append(h)
    });
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
let count = 0
function yjSwiper(data) {
    $('.gfxyjry .info .name').text(data[0].name)
    $('.gfxyjry .info .type').text(data[0].type)
    $('.gfxyjry .info .id').text(data[0].id)
    $('.gfxyjry .info .address').text(data[0].address)

    let l = 5, i = 1;

    setInterval(()=>{
        $('.yj-list li').eq(i).addClass('active').siblings().removeClass('active')
        $('.yj-list li').eq(i).find('.lamp').css({
            'transform':'translateX('+ 0 +'px)'
        })
        $('.gfxyjry .info .name').text(data[i].name)
        $('.gfxyjry .info .type').text(data[i].type)
        $('.gfxyjry .info .id').text(data[i].id)
        $('.gfxyjry .info .address').text(data[i].address)
        count = 0
        mySwiper.slideNext()
        if(i == l){
            i = -1
        }
        i++

    },3000)
    
}

//高风险预警 走马灯
function yjLamp(el){
    let w = el.find('.text'), nl = el.find('.no-lamp'), l = el.find('.lamp');
    if(w.width()>=nl.width()+1){
        return
    }else{
        // let i = count
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
let fkldChart = echarts.init(document.getElementById('fkld'))

fkldOption = {
    tooltip: {
        trigger: 'axis'
    },
    radar: {
        indicator: [
            { name: '国保人员', max: 6500},
            { name: '在逃人员', max: 16000},
            { name: '涉恐人员', max: 30000},
            { name: '涉稳人员', max: 38000},
            { name: '涉毒人员', max: 52000},
            { name: '前科人员', max: 25000},
            { name: '精神病人', max: 25000},
            { name: '其他人员', max: 25000},
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
                value: [4300, 10000, 28000, 35000, 50000, 19000, 1200, 5060],
                name:'数据分布'
            }
        ]
    }]
}

fkldChart.setOption(fkldOption)

//预警分布
let yjfbChart = echarts.init(document.getElementById('yjfb'))

yjfbOption = {
    grid:{
        top:'40px',
        bottom:'20px',
        left:'40px',
        right:'20px'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['高风险','已解决'],
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
            data: ['兰州', '嘉峪关', '金昌', '白银', '天水', '酒泉', '张掖', '武威', '定西', '陇南', '平凉', '庆阳', '临夏', '甘南']
        }
    ],
    yAxis: {
        type: 'value',
        axisTick:{ //y轴刻度线
            show:false,
        },
        splitLine:{
            lineStyle:{
                color:'#22DFFF'
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
            name: '已解决',
            type: 'bar',
            stack:'one',
            data: [320, 332, 301, 334, 390, 330, 320, 120, 320, 332, 301, 334, 390, 330, 320, 120],
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
            data: [320, 332, 301, 334, 390, 330, 320, 120, 320, 332, 301, 334, 390, 330, 320, 120],
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

yjfbChart.setOption(yjfbOption)

//风控状态
let a = 555,b = 1455,c = 1234;d = 666;
let sum = a + b + c + d;
let ca,cb,cc,cd;
ca = ((a/sum).toFixed(2))*150
cb = ((b/sum).toFixed(2))*150
cc = ((c/sum).toFixed(2))*150
cd = ((d/sum).toFixed(2))*150
console.log(ca,cb,cc,cd)
hRender(21,55,48,25)