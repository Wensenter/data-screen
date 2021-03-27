const port = location.port
// 'http://192.168.4.250:1236'
// 'http://localhost:'+port
const BASE_URL = 'http://localhost:'+port
const KEY_PERSON = '/json/keyPerson'
const MURDER_DISPUTE = '/json/murderDispute'
const KeyEvent = '/json/keyEvent'

// 风控状态
function getRiskStatus (fun,keyCategory='') {
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/riskStatus?keyCategory='+keyCategory,
        type:'post',
        contentType:'application/json',
        error:function(error){
            var error = JSON.stringify(error)
            console.log('error:'+error)
        },
        success:function(res){
            fun(res)
        }
    })
}

//重点/关注人员总数
function getPersonFlagNum(fun,data={}) {
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/personFlagNum',
        type:'post',
        contentType:'application/json',
        error:function(error){
           
        },
        success:function(res){
            fun(res)
        }
    })
}

//重点/关注人员类别统计
function getCategoryStatis (fun,data={}) {
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/categoryStatis',
        type:'post',
        contentType:'application/json',
        error:function(error){
           
        },
        success:function(res){
            fun(res)
        }
    })
}

//活跃曲线
function getHourWarings (fun,data={}) {
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/hourWarings',
        type:'post',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
           
        },
        success:function(res){
            fun(res)
        }
    })
}

//区县户籍分布图
function getResidenceDistribute (fun,keyCategory='') {
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/residenceDistribute?keyCategory='+keyCategory,
        type:'post',
        contentType:'application/json',
        error:function(error){
           
        },
        success:function(res){
            fun(res)
        }
    })
}

// 市区的户籍分布
function getCityResidenceDistribute (fun,keyCategory='') {
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/cityResidenceDistribute?keyCategory='+keyCategory,
        type:'post',
        contentType:'application/json',
        error:function(error){
           
        },
        success:function(res){
            fun(res)
        }
    })
}

//轨迹统计图
/**
trailType 类型：1、赴京 2、来兰 3、离甘
keyCategory;//重点人员类型
latelyDayNum;//最近多少天
 */
function getTrailStatis (fun,data={}) {
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/trailStatis',
        type:'post',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
           
        },
        success:function(res){
            fun(res)
        }
    })
}

//预警分布
function getWaringDistribute (fun, data={}) {
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/waringDistribute',
        type:'post',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
           
        },
        success:function(res){
            fun(res)
        }
    })
}

//高风险预警人员和预警信息
function getWaringPersons (fun, data={}) {
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/waringPersons.json',
        type:'get',
        dataType:'json',
        contentType:'application/json',
        error:function(error){

        },
        success:function(res){
            fun(res)
        }
    })
}

//风控雷达
function getRadarStatis (fun, data={}) {
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/radarStatis.json',
        type:'get',
        data:dataJson,
        dataType:'json',
        contentType:'application/json',
        error:function(error){

        },
        success:function(res){
            console.log(res)
            fun(res)
        }
    })
}

//电子档案表格
function getBasicInfo  (fun, zdryId='') {
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/basicInfo?zdryId='+zdryId,
        type:'post',
        dataType:'json',
        contentType:'application/json',
        error:function(error){
           
        },
        success:function(res){
            fun(res)
        }
    })
}

//电子档案图片、音频
function getAudioVideo  (fun, zdryId='') {
    zdryId = '8a330fa27078773101707a40f6d53174'
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/audioVideo?zdryId='+zdryId,
        type:'post',
        dataType:'json',
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 电子档案-风险指数
function getRiskTrend  (fun, zdryId='') {
    // zdryId = '8a330fa27078773101707a40f6d53174'
    // '/riskTrend?zdryId='+zdryId
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/riskTrend.json',
        type:'get',
        dataType:'json',
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 电子档案-管控信息
function getControlInfos  (fun, zdryId='') {
    zdryId = '8a330fa27078773101707a40f6d53174'
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/controlInfos?zdryId='+zdryId,
        type:'post',
        dataType:'json',
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 电子档案-预警信息
function getWaringList  (fun, zdryId='') {
    zdryId = '8a330fa27078773101707a40f6d53174'
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/waringList?zdryId='+zdryId,
        type:'post',
        dataType:'json',
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 电子档案-轨迹信息
function getTravelInfos (fun, idCard='') {
    idCard = '410222197002214019'
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/travelInfos?idCard='+idCard,
        type:'post',
        dataType:'json',
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 户籍分布图-人员详情
function getPageKeyPersons (fun, data={}) {
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/pageKeyPersons',
        type:'post',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

//轨迹弹框-轨迹详情 
function getPagePersonTrail (fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+KEY_PERSON+'/pagePersonTrail',
        type:'post',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 案发态势
function getCrimeSituation (fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/crimeSituation.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 作案成因
function getCrimeReason(fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/crimeReason.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 施受害人
function getPersonCount(fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/personCount.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 风险化解态势
function getRiskResolveSituation(fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/riskResolveSituation.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 风险化解状况
function getRiskResolveCount(fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/riskResolveCount.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 爆点预警
function getBurstWarning(fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/burstWarning.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 情报来源
function getIntelligenceSource(fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/intelligenceSource.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

//案件分布图-市区
function getcityCaseDistribute (fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/cityCaseDistribute.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

//案件分布图-区县
function getCaseDistribute (fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/caseDistribute.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

//预警分布图-市区
function getCityWarningDistribute (fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/cityWarningDistribute.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

//预警分布图-区县
function getWarningDistribute (fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+MURDER_DISPUTE+'/warningDistribute.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 全省线索，全省预警
function getCountInfo (fun, data={}){
    let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+KeyEvent+'/countInfo.json',
        type:'get',
        dataType:'json',
        data:dataJson,
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 风险热力
function getRiskHotSpots (fun, data={}){
    // let dataJson = JSON.stringify(data)
    let {areaCode,category1,category2} = data
    $.ajax({
        url:BASE_URL+KeyEvent+'/riskHotSpots.json?areaCode='+areaCode+'&category1='+category1+'&category2='+category2,
        type:'get',
        dataType:'json',
        // data:dataJson,
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 风险热力
function getRiskHotSpots (fun, data={}){
    // let dataJson = JSON.stringify(data)
    let {areaCode,category1,category2} = data
    $.ajax({
        url:BASE_URL+KeyEvent+'/riskHotSpots.json?areaCode='+areaCode+'&category1='+category1+'&category2='+category2,
        type:'get',
        dataType:'json',
        // data:dataJson,
        contentType:'application/json',
        error:function(error){
        console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 风控日历
function getWarningCalendar (fun, data={}){
    // let dataJson = JSON.stringify(data)
    let {year, month} = data
    $.ajax({
        url:BASE_URL+KeyEvent+'/warningCalendar.json?year='+year+'&month='+month,
        type:'get',
        dataType:'json',
        // data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 人员类别统计
function getCategoryCount (fun, data={}){
    // let dataJson = JSON.stringify(data)
    let {category1, category2} = data
    $.ajax({
        url:BASE_URL+KeyEvent+'/categoryCount.json?category1='+category1+'&category2='+category2,
        type:'get',
        dataType:'json',
        // data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

// 群体态势
function getGroupSituation (fun, data={}){
    // let dataJson = JSON.stringify(data)
    let {category1, category2} = data
    $.ajax({
        url:BASE_URL+KeyEvent+'/groupSituation.json?category1='+category1+'&category2='+category2,
        type:'get',
        dataType:'json',
        // data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}

//风险分布图-市区
function getCityRiskDistribute (fun, data={}){
    // let dataJson = JSON.stringify(data)
    $.ajax({
        url:BASE_URL+KeyEvent+'/cityRiskDistribute.json',
        type:'get',
        dataType:'json',
        // data:dataJson,
        contentType:'application/json',
        error:function(error){
            console.log(error)
        },
        success:function(res){
            fun(res)
        }
    })
}