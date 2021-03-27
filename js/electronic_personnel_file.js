/**
 * 获取页面路径参数值
 */
function getParams(key) {

    var result = {};
    var paramStr = encodeURI(window.document.location.search);
    if (paramStr) {
        paramStr = paramStr.substring(1);
        var params = paramStr.split('&');
        for (var p = 0; p < params.length; p++) {
            result[params[p].split('=')[0]] = unescape(params[p].split('=')[1]);
        }
    }
    return result[key];
}

let idCard = getParams('idCard');
let zdryId = getParams('zdryId');
if (!idCard) {
    idCard = JSON.parse(sessionStorage.getItem('idCard'));
}
if (!zdryId) {
    zdryId = JSON.parse(sessionStorage.getItem('zdryId'));
}

// 风险指数/风险趋势数据
let fxqsXData = [],fxqsSData = [],fxqsScore = [];
let fxqsPopChart = null,fxqsPopOption = {};
getRiskTrend(res=>{
    fxqsXData = []
    fxqsSData = []
    fxqsScore = []
    let {data} = res
    data.map(item=>{
        fxqsXData.push(item.time)
        fxqsSData.push({value:item.score,reason:item.reason})
        fxqsScore.push(item.score)
    })
    let xData = fxqsScore   //.sort()
    let len = xData.length
    if (len > 0) {
        let nowIndex = len - 1;
        let lastIndex = len - 2;
        if (len == 1) {
            lastIndex = 0;
        }
        if (xData[nowIndex]) {
            $('.risk-ctx .number').text(xData[nowIndex] * 1);
        }
        if (xData[lastIndex]) {
            $('.arrow .num').text(xData[lastIndex] * 1);
        }
        if (len > 1 && xData[nowIndex]*1 < xData[lastIndex]*1) {
            $('#riskArrow').attr('src', './img/electronic_personnel_file/arrow_down.png');
        } else {
            $('#riskArrow').attr('src', './img/electronic_personnel_file/arrow.png');
        }
    }
 },zdryId)

// 风险趋势弹窗
$('.risk').click(function(){
    $('.fxqs-pop').show()
    if(!fxqsPopChart){
        fxqsPopChart = echarts3.init(document.getElementById('fxqs-pop'))
    }
    fxqsPopChart.clear()
    setFXQSOption(fxqsXData,fxqsSData)
    fxqsPopChart.setOption(fxqsPopOption,true)
})

$('.fxqs-pop .close').click(function(){
    $('.fxqs-pop').hide()
})

//风险趋势弹窗echarts
function setFXQSOption(fxqsXData,fxqsSData) {
    fxqsPopOption = {
        grid:{
            top:'37px',
            bottom:'47px',
            left:'80px',
            right:'100px'
        },
        tooltip:{
            formatter:function(params) {
                console.log(params)
                let result = "";
                result +=
                '<span style="display:inline-block;margin-right:5px;margin-bottom:2px;border-radius:10px;width:9px;height:9px;background:'+
                params.color +
                '"></span>';
                result += params.name + "：" + params.data.value + "<br>";
                result +=  '<p style="width:auto;height:auto;word-break: break-all;">' + params.data.reason + '</p>'
                return result;
            },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: fxqsXData,
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
            data: fxqsSData,
            type: 'line',
            areaStyle: {
                color:{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 1, color: 'rgba(254,199,31,0)' // 0% 处的颜色
                    }, {
                        offset: 0, color: 'rgba(254,199,31,0.67)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            },
            lineStyle:{
                color:'#FEE61F'
            },
            smooth: true
        }],
        textStyle:{
            color:'#62C2D2',
            fontSize:16
        },
    }
}

// 管控管理弹窗
$('.gkgl').click(function(){
    $('.gkgl-pop').show()
    getControlInfos(res=>{
        let {data} = res,pageCount = 4;
        handlePopData (data,pageCount,$('#gkgl-pageInfo'),$('#gkgl-pop'),function(item){
            let tr = $('<tr>')
            let temp = ``;
            temp+=` <td>${item['visitName']?item['visitName']:''}</td>`
            temp+=` <td>${item['visitTime']?item['visitTime']:''}</td>`
            temp+=` <td>${item['status']?item['status']:''}</td>`
            temp+=` <td>${item['visitUnit']?item['visitUnit']:''}</td>`
            temp+=` <td>${item['visitRecord']?item['visitRecord']:''}</td>`
            tr.html(temp)
            return tr
        })
    },zdryId)
})

$('.gkgl-pop .close').click(function(){
    $('.gkgl-pop').hide()
})

// 预警信息弹窗
let levelJson = {
    '1':'高',
    '2':'中',
    '3':'低',
    '4':'微'
}
$('.yjxx').click(function(){
    $('.yjxx-pop').show()
    getWaringList(res=>{
        let {data} = res,pageCount = 5;
        handlePopData (data,pageCount,$('#yjxx-pageInfo'),$('#yjxx-pop'),function(item){
            let tr = $('<tr>')
            let temp = ``;
            temp+=` <td>${item['waringNo']?item['waringNo']:''}</td>`
            temp+=` <td>${item['score']?item['score']:''}</td>`
            temp+=` <td>${levelJson[item['level']]?levelJson[item['level']]:''}</td>`
            temp+=` <td>${item['warningTime']?item['warningTime']:''}</td>`
            temp+=` <td>${item['dynamicTime']?item['dynamicTime']:''}</td>`
            temp+=` <td>${item['dynamicContent']?item['dynamicContent']:''}</td>`
            temp+=` <td>${item['department']?item['department']:''}</td>`
            temp+=` <td>${item['dealContent']?item['dealContent']:''}</td>`
            tr.html(temp)
            return tr
        })
    },zdryId)
})

$('.yjxx-pop .close').click(function(){
    $('.yjxx-pop').hide()
})

// 轨迹信息弹窗
$('.gjxx').click(function(){
    $('.gjxx-pop').show()
    getTravelInfos(res=>{
        let {data} = res,pageCount = 5;
        handlePopData (data,pageCount,$('#gjxx-pageInfo'),$('#gjxx-pop'),function(item){
            let tr = $('<tr>')
            let temp = ``;
            temp+=` <td>${item['travelTime']?item['travelTime']:''}</td>`
            temp+=` <td>${item['dynamicSituation']?item['dynamicSituation']:''}</td>`
            temp+=` <td>${item['content']?item['content']:''}</td>`
            tr.html(temp)
            return tr
        })
    },idCard)
})

$('.gjxx-pop .close').click(function(){
    $('.gjxx-pop').hide()
})

//刷新|生成分页信息|自定义属性page表示当前页面索引
function refreshPageInfo(el,tableWrapEl,pageCount,data,pageIndex,render) {
    let len = data.length
    let pageSize = Math.ceil(len/pageCount)
    let pageEl = el
    let tmpPageIndex = 0
    tableWrapEl.find('.pageSum').text(pageSize)
    tableWrapEl.find('.dataSum').text(len)
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
    let curData = data.slice((pageIndex-1)*pageCount,(pageIndex)*pageCount)
    curData.map(item=>{
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

//电子档案表格
let flagJson = {
    '1':'重点',
    '2':'关注',
    '3':'常规'
},
genderJson = {
    '1':'男',
    '2':'女'
};
dataFromJson = {
    "1":"大情报平台",
    "2":"一标三实"
}
getBasicInfo(res=>{
    Object.keys(res).forEach(key=>{
        if(key === 'flag'){
            res[key] = flagJson[res[key]]
        }
        if(key === 'gender'){
            res[key] = genderJson[res[key]]
        }
        if(key === 'dataFrom'){
            res[key] = dataFromJson[res[key]]
        }
        $('table .'+key).text(res[key]?res[key]:'')
    })
},zdryId, idCard)

//电子档案图片、音频
getAudioVideo(res=>{
    let VideoSrc = res.audioVideoPrefix+'/'+res.gaitVideo
    let AudioSrc = res.audioVideoPrefix+'/'+res.voiceFragment
    $('.video video').attr('src',VideoSrc)
    $('.audio audio').attr('src',AudioSrc)
    let pics = [];
    pics.push({picUrl:res.backgroundPhoto1});
    pics.push({picUrl:res.backgroundPhoto0});
    pics.push({picUrl:res.backgroundPhoto2});
    loadPic(pics);

},zdryId,idCard)


// 加载预警人员照片
function loadPic(data){
    data.forEach(e => {
        let h = $('<div class="swiper-slide">') 
        let t = `<a href="javascript:;" class="img-shadow">
                    <img src="${e.picUrl ? e.picUrl : '../img/electronic_personnel_file/default.png'}" alt="">
                </a> `
            h.html(t)
        $('.body .left .swiper-wrapper').append(h)
        // 高风险预警人员swiper
        setTimeout(()=>{
            mySwiper = new Swiper ('.pic-swiper', {
                loop: false, // 循环模式选项
                slidesPerView:3,
                centeredSlides:true,
                initialSlide:1,
                slideToClickedSlide: true,
                allowTouchMove: false
            }) 
        },0)
    });
}

// 播放视频资源
$('.video').click(function(){
    if($('.video').hasClass('playing')){
        videoPause()
    }else {
        videoPlaying()
    }
})

function videoPlaying() {
    $('.video').addClass('playing')
    let vedio = $('.video').find('video')[0]
    if (vedio) {
        vedio.play()
    }
}

function videoPause() {
    $('.video').removeClass('playing')
    let vedio = $('.video').find('video')[0]
    if (vedio) {
        vedio.pause()
    }
}

// 播放音频资源
$('.audio').click(function(){
    if($('.audio').hasClass('playing')){
        audioPause()
    }else {
        audioPlaying()
    }
})

function audioPlaying() {
    $('.audio').addClass('playing')
    let audio = $('.audio').find('audio')[0]
    audio.play()
}

function audioPause() {
    $('.audio').removeClass('playing')
    let audio = $('.audio').find('audio')[0]
    audio.pause()
}

// 处理弹窗table数据
function handlePopData (data,pageCount,pageEl,popEl,render) {
    let maxSize = Math.ceil(data.length/pageCount)
    refreshPageInfo(pageEl,popEl,pageCount,data,1,render)
    pageEl.delegate('a','click',function(){
        let num = $(this).attr('page')
        refreshPageInfo(pageEl,popEl,pageCount,data,num,render)
    })
    popEl.find('.stairs input').bind('keydown',function(e){
    　  let theEvent = e || window.event;
        let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    　　 if (code == 13) {
            let toIndex = ''; 
            if($(this).val()){
                if( $(this).val() >= maxSize ) {
                    toIndex = maxSize
                }
                if( $(this).val() <= 1) {
                    toIndex = 1
                }
                $(this).val(toIndex)
                $(this).blur()
                refreshPageInfo(pageEl,popEl,pageCount,data,toIndex,render)
            }
        }
    })
}