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
        center: [103.40,36.03], /*地图中心点*/
        zoom: 6, /*地图默认缩放等级*/
        pitch: 0, /*地图俯仰角度*/
        maxZoom: 17, /*地图最大缩放等级*/
        minZoom: 3 , /*地图最小缩放等级*/
        logoControl: false
    });