function hRender(v,b,n,m){
    let Canvas = document.getElementById('Canvas')
    let context = Canvas.getContext("2d")

    // 微风险
    h = v + b + n + m + 15;
    context.save()
    context.fillStyle = 'rgba(101, 205, 239, 0.7)';
    context.strokeStyle = 'rgba(255,255,255,0)';
    context.lineWidth = 1;
    context.translate(103,h);

    context.beginPath();
    context.moveTo(-67,-m)
    context.lineTo(-35,-(m+5))
    context.lineTo(35,-(m+5))
    context.lineTo(67,-m)
    context.lineTo(0,0)
    context.closePath();
    context.stroke();
    context.fill()

    context.beginPath();
    context.strokeStyle = '#65CDEF';
    context.lineWidth = 3;
    context.moveTo(-67,-m)
    context.lineTo(-35,-(m+5))
    context.lineTo(35,-(m+5))
    context.lineTo(67,-m)
    context.lineTo(35,-(m-14))
    context.lineTo(-35,-(m-14))
    context.closePath();
    context.stroke();

    context.beginPath();
    context.lineWidth = 1;
    context.setLineDash([3,5]);
    context.moveTo(-35,-(m+5));
    context.lineTo(0,0);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.setLineDash([3,5]);
    context.moveTo(35,-(m+5));
    context.lineTo(0,0);
    context.closePath();
    context.stroke();

    //低风险
    g = v + b + n + 10
    context.restore()
    context.save()
    
    context.fillStyle = 'rgba(255, 212, 64, 0.7)';
    context.strokeStyle = 'rgba(255,255,255,0)';
    context.lineWidth = 1;
    context.translate(103,g);

    context.beginPath();
    context.moveTo(-67,0)
    context.lineTo(-103,-n)
    context.lineTo(-52,-(n+13))
    context.lineTo(52,-(n+13))
    context.lineTo(103,-n)
    context.lineTo(67,0)
    context.lineTo(34,12)
    context.lineTo(-34,12)
    context.lineTo(-67,0)
    context.closePath();
    context.stroke();
    context.fill()

    context.beginPath();
    context.strokeStyle = '#FFD440';
    context.lineWidth = 3;
    context.moveTo(-103,-n)
    context.lineTo(-52,-(n+13))
    context.lineTo(52,-(n+13))
    context.lineTo(103,-n);
    context.lineTo(52,-(n-23))
    context.lineTo(-52,-(n-23))
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(-67,0)
    context.lineTo(-34,-5)
    context.lineTo(34,-5)
    context.lineTo(67,0);
    context.lineTo(34,12)
    context.lineTo(-34,12)
    context.closePath();
    context.stroke();

    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(-67,0)
    context.lineTo(-103,-n)
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(67,0)
    context.lineTo(103,-n)
    context.closePath();
    context.stroke();

    context.beginPath();
    context.lineWidth = 1;
    context.setLineDash([3,5]);
    context.moveTo(-34,-5);
    context.lineTo(-52,-(n+13));
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(34,-5);
    context.lineTo(52,-(n+13));
    context.closePath();
    context.stroke();

    //中风险
    f = v + b + 5
    context.restore()
    context.save()
    
    context.fillStyle = 'rgba(233, 112, 26, 0.7)';
    context.strokeStyle = 'rgba(255,255,255,0)';
    context.lineWidth = 1;
    context.translate(103,f);

    context.beginPath();
    context.moveTo(-103,0)
    context.lineTo(-68,-b)
    context.lineTo(-36,-(b+11))
    context.lineTo(36,-(b+11))
    context.lineTo(68,-b)
    context.lineTo(103,0)
    context.lineTo(53,20)
    context.lineTo(-53,20)
    context.lineTo(-103,0)
    context.closePath();
    context.stroke();
    context.fill()

    context.beginPath();
    context.strokeStyle = '#EF741F';
    context.lineWidth = 3;
    context.moveTo(-68,-b)
    context.lineTo(-36,-(b+11))
    context.lineTo(36,-(b+11))
    context.lineTo(68,-b)
    context.lineTo(36,-(b-14))
    context.lineTo(-36,-(b-14))
    context.lineTo(-68,-b)
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(-103,0)
    context.lineTo(-53,-15)
    context.lineTo(53,-15)
    context.lineTo(103,0)
    context.lineTo(53,20)
    context.lineTo(-53,20)
    context.lineTo(-103,0)
    context.closePath();
    context.stroke();

    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(-68,-b)
    context.lineTo(-103,0)
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(68,-b)
    context.lineTo(103,0)
    context.closePath();
    context.stroke();

    context.beginPath();
    context.lineWidth = 1;
    context.setLineDash([3,5]);
    context.moveTo(-36,-(b-14));
    context.lineTo(-53,20);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(36,-(b-14));
    context.lineTo(53,20);
    context.closePath();
    context.stroke();

    //高风险
    context.restore()
    context.save()
    context.fillStyle = 'rgba(243, 51, 35, 0.7)';
    context.strokeStyle = 'rgba(255,255,255,0)';
    context.lineWidth = 1;
    context.translate(103,v);
    context.moveTo(-66,0)
    context.beginPath();
    context.lineTo(0,-v)
    context.lineTo(67,0)
    context.lineTo(33,12)
    context.lineTo(-33,12)
    context.lineTo(-67,0)
    context.closePath();
    context.stroke();
    context.fill()

    context.moveTo(-67,0)
    context.beginPath();
    context.strokeStyle = '#F33323';
    context.lineWidth = 3;
    context.lineTo(-33,12)
    context.lineTo(33,12)
    context.lineTo(67,0)
    context.lineTo(33,-12);
    context.lineTo(-33,-12);
    context.lineTo(-67,0);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.lineWidth = 1;
    context.moveTo(0,-v);
    context.lineTo(-67,0);
    context.stroke();
    
    context.moveTo(0,-v);
    context.lineTo(67,0);  
    context.lineTo(0,-v); 
    context.stroke();

    context.beginPath();
    context.lineWidth = 1;
    context.setLineDash([3,5]);
    context.moveTo(0,-v);
    context.lineTo(-33,12);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(0,-v);
    context.lineTo(33,12);
    context.closePath();
    context.stroke();

    
}

// $(function(){
//     hRender(67,40,35,72)
// })