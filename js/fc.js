function hRender(v,b,n,m){

    let Canvas = document.getElementById('Canvas')
    let context = Canvas.getContext("2d")
    Canvas.height=Canvas.height;
    let H = Canvas.height
    let W = Canvas.width
    let sum = v+b+n+m
    // 各区域色块颜色
    let colorArea = {
        v:{
            area: 'rgba(101, 205, 239, 0.7)',
            line: '#65CDEF'
        },
        b:{
            area: 'rgba(255, 212, 64, 0.7)',
            line: '#FFD440'
        },
        n:{
            area: 'rgba(233, 112, 26, 0.7)',
            line: '#E9701A'
        },
        m:{
            area: 'rgba(243, 51, 35, 0.7)',
            line: '#F33323'
        }
    }
    // 分割线默认颜色
    let uDivisionColor = 'rgba(0,0,0,0.6)'
    let dDivisionColor = 'rgba(0,0,0,0.6)'
    // 确定分割线颜色
    if((m/sum) == 0.5){
        dDivisionColor = colorArea.v.line
        uDivisionColor = colorArea.b.line
    }else if((m/sum) > 0.5){
        dDivisionColor = colorArea.v.line
        uDivisionColor = colorArea.v.line
    }else if(((m+n)/sum) == 0.5){
        dDivisionColor = colorArea.b.line
        uDivisionColor = colorArea.n.line
    }else if(((m+n)/sum) > 0.5){
        dDivisionColor = colorArea.b.line
        uDivisionColor = colorArea.b.line
    }else if(((m+n+b)/sum) == 0.5){
        dDivisionColor = colorArea.n.line
        uDivisionColor = colorArea.m.line
    }else if(((m+n+b)/sum) > 0.5){
        dDivisionColor = colorArea.n.line
        uDivisionColor = colorArea.n.line
    }else{
        dDivisionColor = colorArea.m.line
        uDivisionColor = colorArea.m.line
    }
    let offsetH = 2
    let baseOption = {
        H,W,offsetH
    }
    /**
     * 框架
     * 每个块相隔4像素
    */
    context.restore()
    context.save()
    context.strokeStyle = dDivisionColor;
    context.lineWidth = 3;
    context.translate(W/2,H);

    context.beginPath();
    context.moveTo(-102,-H/2+offsetH);
    context.lineTo(-51,-(H/2+16)+offsetH);
    context.lineTo(51,-(H/2+16)+offsetH);
    context.lineTo(102,-H/2+offsetH);
    context.lineTo(51,-(H/2-16)+offsetH);
    context.lineTo(-51,-(H/2-16)+offsetH);
    context.closePath();
    context.stroke();

    // context.beginPath();
    // context.strokeStyle = '#E9701A'
    // context.lineWidth = 1;
    // context.moveTo(0,0);
    // context.lineTo(-102,-H/2+offsetH);
    // context.closePath();
    // context.stroke();

    // context.beginPath();
    // context.moveTo(0,0);
    // context.lineTo(102,-H/2+offsetH);
    // context.closePath();
    // context.stroke();

    context.beginPath();
    context.setLineDash([3,5]);
    context.lineWidth = 1;
    context.moveTo(0,0);
    context.lineTo(51,-(H/2-16)+offsetH);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(-51,-(H/2-16)+offsetH);
    context.closePath();
    context.stroke();

    context.restore()
    context.save()
    context.strokeStyle = uDivisionColor;
    context.lineWidth = 3;
    context.translate(W/2,0);

    context.beginPath();
    context.moveTo(-102,H/2-offsetH);
    context.lineTo(-51,(H/2-16)-offsetH);
    context.lineTo(51,(H/2-16)-offsetH);
    context.lineTo(102,H/2-offsetH);
    context.lineTo(51,(H/2+16)-offsetH);
    context.lineTo(-51,(H/2+16)-offsetH);
    context.closePath();
    context.stroke();

    // context.beginPath();
    // context.strokeStyle = '#E9701A'
    // context.lineWidth = 1;
    // context.moveTo(0,0);
    // context.lineTo(-102,H/2-offsetH);
    // context.closePath();
    // context.stroke();

    // context.beginPath();
    // context.moveTo(0,0);
    // context.lineTo(102,H/2-offsetH);
    // context.closePath();
    // context.stroke();

    context.beginPath();
    context.setLineDash([3,5]);
    context.lineWidth = 1;
    context.moveTo(0,0);
    context.lineTo(-51,(H/2+16)-offsetH);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(51,(H/2+16)-offsetH);
    context.closePath();
    context.stroke();

    /**
     * 上色
    */
    let vComputed = computedMix(m,sum,H,W)
    let vPreComputed = computedMix((m+4),sum,H,W)
    let bComputed = computedMix((m+n),sum,H,W)
    let bPreComputed = computedMix((m+n+4),sum,H,W)
    let nComputed = computedMix((m+n+b),sum,H,W)
    let nPreComputed = computedMix((m+n+b+4),sum,H,W)
    let mComputed = computedMix((v+b+n+m),sum,H,W)

    // 微风险
    context.restore()
    context.save()
    context.translate(W/2,H);

    if(vComputed.mixy > H/2){
        isUTransboundary(context,colorArea.v,vComputed,baseOption,true)
    }else{
        context.beginPath();
        context.fillStyle = colorArea.v.area
        context.lineWidth = 1;
        context.moveTo(0,0);
        context.lineTo(-vComputed.mixx,-vComputed.mixy);
        context.lineTo(-(vComputed.mixx-vComputed.mixOffsetx),-(vComputed.mixy+vComputed.mixOffsety));
        context.lineTo((vComputed.mixx-vComputed.mixOffsetx),-(vComputed.mixy+vComputed.mixOffsety));
        context.lineTo(vComputed.mixx,-vComputed.mixy);
        context.closePath();
        context.fill();

        context.beginPath();
        context.strokeStyle = colorArea.v.line;
        context.lineWidth = 3;
        context.moveTo(-vComputed.mixx,-vComputed.mixy);
        context.lineTo(-(vComputed.mixx-vComputed.mixOffsetx),-(vComputed.mixy+vComputed.mixOffsety));
        context.lineTo((vComputed.mixx-vComputed.mixOffsetx),-(vComputed.mixy+vComputed.mixOffsety));
        context.lineTo(vComputed.mixx,-vComputed.mixy);
        context.lineTo((vComputed.mixx-vComputed.mixOffsetx),-(vComputed.mixy-vComputed.mixOffsety));
        context.lineTo(-(vComputed.mixx-vComputed.mixOffsetx),-(vComputed.mixy-vComputed.mixOffsety));
        context.closePath();
        context.stroke();
    }

    // 低风险
    context.restore()
    context.save()
    context.translate(W/2,H);

    if(vComputed.mixy < H/2 && bComputed.mixy > H/2){
        isUTransboundary(context,colorArea.b,bComputed,baseOption,false,vPreComputed)
    }else if(vComputed.mixy < H/2 && bComputed.mixy < H/2){
        context.beginPath();
        context.strokeStyle = colorArea.b.line;
        context.lineWidth = 3;
        context.moveTo(-vPreComputed.mixx,-vPreComputed.mixy);
        context.lineTo(-(vPreComputed.mixx-vPreComputed.mixOffsetx),-(vPreComputed.mixy+vPreComputed.mixOffsety));
        context.lineTo((vPreComputed.mixx-vPreComputed.mixOffsetx),-(vPreComputed.mixy+vPreComputed.mixOffsety));
        context.lineTo(vPreComputed.mixx,-vPreComputed.mixy);
        context.lineTo((vPreComputed.mixx-vPreComputed.mixOffsetx),-(vPreComputed.mixy-vPreComputed.mixOffsety));
        context.lineTo(-(vPreComputed.mixx-vPreComputed.mixOffsetx),-(vPreComputed.mixy-vPreComputed.mixOffsety));
        context.closePath();
        context.stroke();

        context.beginPath();
        context.strokeStyle = colorArea.b.line;
        context.lineWidth = 3;
        context.moveTo(-bComputed.mixx,-bComputed.mixy);
        context.lineTo(-(bComputed.mixx-bComputed.mixOffsetx),-(bComputed.mixy+bComputed.mixOffsety));
        context.lineTo((bComputed.mixx-bComputed.mixOffsetx),-(bComputed.mixy+bComputed.mixOffsety));
        context.lineTo(bComputed.mixx,-bComputed.mixy);
        context.lineTo((bComputed.mixx-bComputed.mixOffsetx),-(bComputed.mixy-bComputed.mixOffsety));
        context.lineTo(-(bComputed.mixx-bComputed.mixOffsetx),-(bComputed.mixy-bComputed.mixOffsety));
        context.closePath();
        context.stroke();

        context.beginPath();
        context.fillStyle = colorArea.b.area;
        context.lineWidth = 1;
        context.moveTo(-vPreComputed.mixx,-vPreComputed.mixy);
        context.lineTo(-bComputed.mixx,-bComputed.mixy);
        context.lineTo(-(bComputed.mixx-bComputed.mixOffsetx),-(bComputed.mixy+bComputed.mixOffsety));
        context.lineTo((bComputed.mixx-bComputed.mixOffsetx),-(bComputed.mixy+bComputed.mixOffsety));
        context.lineTo(bComputed.mixx,-bComputed.mixy);
        context.lineTo(vPreComputed.mixx,-vPreComputed.mixy);
        context.lineTo((vPreComputed.mixx-vPreComputed.mixOffsetx),-(vPreComputed.mixy-vPreComputed.mixOffsety));
        context.lineTo(-(vPreComputed.mixx-vPreComputed.mixOffsetx),-(vPreComputed.mixy-vPreComputed.mixOffsety));
        context.closePath();
        context.fill();
    }else if(vComputed.mixy > H/2){
        isDTransboundary(context,colorArea.b,bComputed,baseOption,false,vPreComputed)
    }

    //中风险
    context.restore()
    context.save()
    context.translate(W/2,H);

    if(bComputed.mixy < H/2 && nComputed.mixy > H/2){
        isUTransboundary(context,colorArea.n,nComputed,baseOption,false,bPreComputed)
    }else if(bComputed.mixy < H/2 && nComputed.mixy < H/2){
        context.beginPath();
        context.strokeStyle = colorArea.n.line;
        context.lineWidth = 3;
        context.moveTo(-bPreComputed.mixx,-bPreComputed.mixy);
        context.lineTo(-(bPreComputed.mixx-bPreComputed.mixOffsetx),-(bPreComputed.mixy+bPreComputed.mixOffsety));
        context.lineTo((bPreComputed.mixx-bPreComputed.mixOffsetx),-(bPreComputed.mixy+bPreComputed.mixOffsety));
        context.lineTo(bPreComputed.mixx,-bPreComputed.mixy);
        context.lineTo((bPreComputed.mixx-bPreComputed.mixOffsetx),-(bPreComputed.mixy-bPreComputed.mixOffsety));
        context.lineTo(-(bPreComputed.mixx-bPreComputed.mixOffsetx),-(bPreComputed.mixy-bPreComputed.mixOffsety));
        context.closePath();
        context.stroke();

        context.beginPath();
        context.strokeStyle = colorArea.n.line;
        context.lineWidth = 3;
        context.moveTo(-nComputed.mixx,-nComputed.mixy);
        context.lineTo(-(nComputed.mixx-nComputed.mixOffsetx),-(nComputed.mixy+nComputed.mixOffsety));
        context.lineTo((nComputed.mixx-nComputed.mixOffsetx),-(nComputed.mixy+nComputed.mixOffsety));
        context.lineTo(nComputed.mixx,-nComputed.mixy);
        context.lineTo((nComputed.mixx-nComputed.mixOffsetx),-(nComputed.mixy-nComputed.mixOffsety));
        context.lineTo(-(nComputed.mixx-nComputed.mixOffsetx),-(nComputed.mixy-nComputed.mixOffsety));
        context.closePath();
        context.stroke();

        context.beginPath();
        context.fillStyle = colorArea.n.area;
        context.lineWidth = 1;
        context.moveTo(-bPreComputed.mixx,-bPreComputed.mixy);
        context.lineTo(-nComputed.mixx,-nComputed.mixy);
        context.lineTo(-(nComputed.mixx-nComputed.mixOffsetx),-(nComputed.mixy+nComputed.mixOffsety));
        context.lineTo((nComputed.mixx-nComputed.mixOffsetx),-(nComputed.mixy+nComputed.mixOffsety));
        context.lineTo(nComputed.mixx,-nComputed.mixy);
        context.lineTo(bPreComputed.mixx,-bPreComputed.mixy);
        context.lineTo((bPreComputed.mixx-bPreComputed.mixOffsetx),-(bPreComputed.mixy-bPreComputed.mixOffsety));
        context.lineTo(-(bPreComputed.mixx-bPreComputed.mixOffsetx),-(bPreComputed.mixy-bPreComputed.mixOffsety));
        context.closePath();
        context.fill();
    }else if(bComputed.mixy > H/2){
        isDTransboundary(context,colorArea.n,nComputed,baseOption,false,bPreComputed)
    }

    // 高风险
    context.restore()
    context.save()
    context.translate(W/2,H);

    if(nComputed.mixy < H/2 && mComputed.mixy > H/2){
        isUTransboundary(context,colorArea.m,mComputed,baseOption,false,nPreComputed)
    }else if(nComputed.mixy < H/2 && mComputed.mixy < H/2){
        context.beginPath();
        context.strokeStyle = colorArea.m.line;
        context.lineWidth = 3;
        context.moveTo(-nPreComputed.mixx,-nPreComputed.mixy);
        context.lineTo(-(nPreComputed.mixx-nPreComputed.mixOffsetx),-(nPreComputed.mixy+nPreComputed.mixOffsety));
        context.lineTo((nPreComputed.mixx-nPreComputed.mixOffsetx),-(nPreComputed.mixy+nPreComputed.mixOffsety));
        context.lineTo(nPreComputed.mixx,-nPreComputed.mixy);
        context.lineTo((nPreComputed.mixx-nPreComputed.mixOffsetx),-(nPreComputed.mixy-nPreComputed.mixOffsety));
        context.lineTo(-(nPreComputed.mixx-nPreComputed.mixOffsetx),-(nPreComputed.mixy-nPreComputed.mixOffsety));
        context.closePath();
        context.stroke();

        context.beginPath();
        context.strokeStyle = colorArea.m.line;
        context.lineWidth = 3;
        context.moveTo(-mComputed.mixx,-mComputed.mixy);
        context.lineTo(-(mComputed.mixx-mComputed.mixOffsetx),-(mComputed.mixy+mComputed.mixOffsety));
        context.lineTo((mComputed.mixx-mComputed.mixOffsetx),-(mComputed.mixy+mComputed.mixOffsety));
        context.lineTo(mComputed.mixx,-mComputed.mixy);
        context.lineTo((mComputed.mixx-mComputed.mixOffsetx),-(mComputed.mixy-mComputed.mixOffsety));
        context.lineTo(-(mComputed.mixx-mComputed.mixOffsetx),-(mComputed.mixy-mComputed.mixOffsety));
        context.closePath();
        context.stroke();

        context.beginPath();
        context.fillStyle = colorArea.m.area;
        context.lineWidth = 1;
        context.moveTo(-nPreComputed.mixx,-nPreComputed.mixy);
        context.lineTo(-mComputed.mixx,-mComputed.mixy);
        context.lineTo(-(mComputed.mixx-mComputed.mixOffsetx),-(mComputed.mixy+mComputed.mixOffsety));
        context.lineTo((mComputed.mixx-mComputed.mixOffsetx),-(mComputed.mixy+mComputed.mixOffsety));
        context.lineTo(mComputed.mixx,-mComputed.mixy);
        context.lineTo(nPreComputed.mixx,-nPreComputed.mixy);
        context.lineTo((nPreComputed.mixx-nPreComputed.mixOffsetx),-(nPreComputed.mixy-nPreComputed.mixOffsety));
        context.lineTo(-(nPreComputed.mixx-nPreComputed.mixOffsetx),-(nPreComputed.mixy-nPreComputed.mixOffsety));
        context.closePath();
        context.fill();
    }else if(nComputed.mixy > H/2){
        isDTransboundary(context,colorArea.m,mComputed,baseOption,false,nPreComputed)
    }
}

// 计算偏移量
function computedMix(mix,sum,H,W) {
    let pre = mix/sum < 0.05 ? 0.05 :  mix/sum;
    let mixy = pre*H
    let mixx = pre*W
    let mixOffsetx = pre*54*2
    let mixOffsety = pre*32
    return{mixy,mixx,mixOffsetx,mixOffsety}
}

// 跨界处理

function isUTransboundary(context,color,mixComputed,baseOption,isTop,preMixComputed={}) {

    let ux = ( baseOption.H/2 - (mixComputed.mixy - baseOption.H/2) )/baseOption.H * baseOption.W
    let offsetUX = (ux/baseOption.W)*54*2
    let offsetUY = (ux/baseOption.W)*32
    context.strokeStyle = color.line;
    context.fillStyle = color.area;
    if(isTop){
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(0,0);
        context.lineTo(-102,-baseOption.H/2-baseOption.offsetH);
        context.lineTo(-51,-(baseOption.H/2+16)-baseOption.offsetH);
        context.lineTo(51,-(baseOption.H/2+16)-baseOption.offsetH);
        context.lineTo(102,-baseOption.H/2-baseOption.offsetH);
        context.closePath();
        context.stroke();
        context.fill();

        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(-102,-baseOption.H/2-baseOption.offsetH);
        context.lineTo(-ux,-mixComputed.mixy);
        context.lineTo(-(ux-offsetUX),-(mixComputed.mixy+offsetUY));
        context.lineTo((ux-offsetUX),-(mixComputed.mixy+offsetUY));
        context.lineTo(ux,-mixComputed.mixy);
        context.lineTo(102,-baseOption.H/2-baseOption.offsetH);
        context.lineTo(51,-(baseOption.H/2-16)-baseOption.offsetH);
        context.lineTo(-51,-(baseOption.H/2-16)-baseOption.offsetH);
        context.closePath();
        context.stroke();
        context.fill();
    }
    else
    {
        context.beginPath();
        context.strokeStyle = color.line;
        context.lineWidth = 3;
        context.moveTo(-preMixComputed.mixx,-preMixComputed.mixy);
        context.lineTo(-(preMixComputed.mixx-preMixComputed.mixOffsetx),-(preMixComputed.mixy+preMixComputed.mixOffsety));
        context.lineTo((preMixComputed.mixx-preMixComputed.mixOffsetx),-(preMixComputed.mixy+preMixComputed.mixOffsety));
        context.lineTo(preMixComputed.mixx,-preMixComputed.mixy);
        context.lineTo((preMixComputed.mixx-preMixComputed.mixOffsetx),-(preMixComputed.mixy-preMixComputed.mixOffsety));
        context.lineTo(-(preMixComputed.mixx-preMixComputed.mixOffsetx),-(preMixComputed.mixy-preMixComputed.mixOffsety));
        context.closePath();
        context.stroke();

        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(-preMixComputed.mixx,-preMixComputed.mixy);
        context.lineTo(-102,-baseOption.H/2+4-baseOption.offsetH);
        context.lineTo(-51,-(baseOption.H/2+16)-baseOption.offsetH);
        context.lineTo(51,-(baseOption.H/2+16)-baseOption.offsetH);
        context.lineTo(102,-baseOption.H/2+4-baseOption.offsetH);
        context.lineTo(preMixComputed.mixx,-preMixComputed.mixy);
        context.lineTo((preMixComputed.mixx-preMixComputed.mixOffsetx),-(preMixComputed.mixy-preMixComputed.mixOffsety));
        context.lineTo(-(preMixComputed.mixx-preMixComputed.mixOffsetx),-(preMixComputed.mixy-preMixComputed.mixOffsety));
        context.closePath();
        context.fill();

        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(-102,-baseOption.H/2-baseOption.offsetH);
        context.lineTo(-ux,-mixComputed.mixy);
        context.lineTo(-(ux-offsetUX),-(mixComputed.mixy+offsetUY));
        context.lineTo((ux-offsetUX),-(mixComputed.mixy+offsetUY));
        context.lineTo(ux,-mixComputed.mixy);
        context.lineTo(102,-baseOption.H/2-baseOption.offsetH);
        context.lineTo(51,-(baseOption.H/2-16)-baseOption.offsetH);
        context.lineTo(-51,-(baseOption.H/2-16)-baseOption.offsetH);
        context.closePath();
        context.fill();

    }

    context.beginPath();
    context.lineWidth = 3;
    context.moveTo(-ux,-mixComputed.mixy);
    context.lineTo(-(ux-offsetUX),-(mixComputed.mixy+offsetUY));
    context.lineTo((ux-offsetUX),-(mixComputed.mixy+offsetUY));
    context.lineTo(ux,-mixComputed.mixy);
    context.lineTo((ux-offsetUX),-(mixComputed.mixy-offsetUY));
    context.lineTo(-(ux-offsetUX),-(mixComputed.mixy-offsetUY));
    
    context.closePath();
    context.stroke();

}

function isDTransboundary(context,color,mixComputed,baseOption,isTop,preMixComputed={}) {
    console.log(mixComputed.mixy);
    console.log('底部跨界了');

    let ux = ( baseOption.H/2 - (mixComputed.mixy - baseOption.H/2) )/baseOption.H * baseOption.W
    let offsetUX = (ux/baseOption.W)*54*2
    let offsetUY = (ux/baseOption.W)*32

    let preUx = ( baseOption.H/2 - (preMixComputed.mixy - baseOption.H/2) )/baseOption.H * baseOption.W
    let preOffsetUX = (preUx/baseOption.W)*54*2
    let preOffsetUY = (preUx/baseOption.W)*35

    context.strokeStyle = color.line;
    context.fillStyle = color.area;
    if(isTop){
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(0,0);
        context.lineTo(-102,-baseOption.H/2-baseOption.offsetH);
        context.lineTo(-51,-(baseOption.H/2+16)-baseOption.offsetH);
        context.lineTo(51,-(baseOption.H/2+16)-baseOption.offsetH);
        context.lineTo(102,-baseOption.H/2-baseOption.offsetH);
        context.closePath();
        context.fill();

        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(-102,-baseOption.H/2-baseOption.offsetH);
        context.lineTo(-ux,-mixComputed.mixy);
        context.lineTo(-(ux-offsetUX),-(mixComputed.mixy+offsetUY));
        context.lineTo((ux-offsetUX),-(mixComputed.mixy+offsetUY));
        context.lineTo(ux,-mixComputed.mixy);
        context.lineTo(102,-baseOption.H/2-baseOption.offsetH);
        context.lineTo(51,-(baseOption.H/2-16)-baseOption.offsetH);
        context.lineTo(-51,-(baseOption.H/2-16)-baseOption.offsetH);
        context.closePath();
        context.fill();
    }
    else
    {
        context.beginPath();
        context.strokeStyle = color.line;
        context.lineWidth = 3;
        context.moveTo(-preUx,-preMixComputed.mixy);
        context.lineTo(-(preUx-preOffsetUX),-(preMixComputed.mixy+preOffsetUY));
        context.lineTo((preUx-preOffsetUX),-(preMixComputed.mixy+preOffsetUY));
        context.lineTo(preUx,-preMixComputed.mixy);
        context.lineTo((preUx-preOffsetUX),-(preMixComputed.mixy-preOffsetUY));
        context.lineTo(-(preUx-preOffsetUX),-(preMixComputed.mixy-preOffsetUY));
        context.closePath();
        context.stroke();

        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(-preUx,-preMixComputed.mixy);
        context.lineTo(-ux,-mixComputed.mixy);
        context.lineTo(-(ux-offsetUX),-(mixComputed.mixy+offsetUY));
        context.lineTo((ux-offsetUX),-(mixComputed.mixy+offsetUY));
        context.lineTo(ux,-mixComputed.mixy);
        context.lineTo(preUx,-preMixComputed.mixy);
        context.lineTo((preUx-preOffsetUX),-(preMixComputed.mixy-preOffsetUY));
        context.lineTo(-(preUx-preOffsetUX),-(preMixComputed.mixy-preOffsetUY));
        context.closePath();
        context.fill();
    }

    context.beginPath();
    context.lineWidth = 3;
    context.moveTo(-ux,-mixComputed.mixy);
    context.lineTo(-(ux-offsetUX),-(mixComputed.mixy+offsetUY));
    context.lineTo((ux-offsetUX),-(mixComputed.mixy+offsetUY));
    context.lineTo(ux,-mixComputed.mixy);
    context.lineTo((ux-offsetUX),-(mixComputed.mixy-offsetUY));
    context.lineTo(-(ux-offsetUX),-(mixComputed.mixy-offsetUY));
    
    context.closePath();
    context.stroke();

}

// $(function(){
//     hRender(155,150,220,137)
// })