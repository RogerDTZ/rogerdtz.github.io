---
layout: post
mathjax: true
title: Dexterity
date: 2018-12-14 08:01:50
tag: [贪心,字符串---后缀树,可做未做]
---
# Description

　　你和对手将要进行$n$次石头剪刀布的游戏。在第$i$局中，若你赢则你获得$a_i$分，若双方平局则你获得$b_i$分，若你输则你不得分

　　已知对手的猜拳策略固定，且恰为给出的一个长度为$n$的字符串$S$的某个轮换

　　若你采取最优策略，在最坏情况下你至少能得多少分？你的猜拳策略可以根据已知的对手序列灵活调整

　　$n \le 10^5$




<!-- more -->
# Solution

　　我们首要任务是弄清楚自己的最优策略与最劣情况的限制：若当前对局已经进行了若干轮，即我已知了对手目前的猜拳序列，我可以确定对手下一步可能出的是什么、对手猜拳序列的结果有哪些。根据“最劣情况”这一限制，我不可以在对手猜拳之后再决定出哪个，我只能选一个最优的手势，使得对手出的每种情况的导出的后续结果的最小值最大

　　考虑上述策略如何用算法描述。注意到与对手猜拳的过程也是我逐步确定对手序列的过程，因此我们使用一棵Trie树插入$S$的所有循环移位，则此时每个局面相当于一条到叶路径。对于一个点$u$，我们计算$f_u$，表示已知当前对手猜拳序列为根节点走到$u$的边序列时，后续最优决策的最劣值。我枚举下一步自己出的手势$c_0$，再计算对手出每一种手势$c$时最优值的最小值，即：

$$
\min_{v\in son _u}\{vs(c_0,v)+f_v\}
$$

　　其中$vs(a,b)$表示我出$a$、对手出$b$时，我的得分

　　此时我们可以决定哪一个手势较优，



# Summary

　　二维坐标的行走问题，不妨在切比雪夫坐标意义下再考虑考虑：我们可以通过切比雪夫坐标独立计算两个维度的决策，将二者相乘以计算总方案。这种方法在时间复杂度的意义上有某种质的飞跃



# Code

```c++
#include <cstdio>
using namespace std;
const int INF=1e9;
const int MOD=1e9+7;
const int N=1010;
int n;
int a,b;
int m;
struct Point{
    int x,y;
}p[N];
int mnx,mxx,mny,mxy;
inline int abs(int x){
    return x>=0?x:-x;
}
inline int max(int x,int y){
    return x>y?x:y;
}
inline int min(int x,int y){
    return x<y?x:y;
}
int fastPow(int x,int y){
    int res=1;
    for(;y;x=1ll*x*x%MOD,y>>=1)
        if(y&1)
            res=1ll*res*x%MOD;
    return res;
}
int fact[10010],iact[10010];
void initFact(int n){
    fact[0]=1;
    for(int i=1;i<=n;i++) fact[i]=1ll*fact[i-1]*i%MOD;
    iact[0]=iact[1]=1;
    iact[n]=fastPow(fact[n],MOD-2);
    for(int i=n-1;i>=2;i--) iact[i]=1ll*iact[i+1]*(i+1)%MOD;
}
inline int C(int n,int m){
    return (0<=m&&m<=n)?1ll*fact[n]*iact[m]%MOD*iact[n-m]%MOD:0;
}
void readData(){
    scanf("%d%d%d%d",&n,&a,&b,&m);
    mnx=INF; mxx=-INF;
    mny=INF; mxy=-INF;
    int x,y;
    for(int i=1;i<=n;i++){
        scanf("%d%d",&x,&y);
        p[i]=(Point){x+y,x-y};
        mnx=min(mnx,p[i].x-m);
        mxx=max(mxx,p[i].x+m);
        mny=min(mny,p[i].y-m);
        mxy=max(mxy,p[i].y+m);
    }
}
int calc1(int l,int r){
    int sumx=0,sumy=0;
    for(int x=mnx;x<=mxx;x++){
        int t=1;
        for(int i=l;i<=r;i++)
            t=1ll*t*(((x-p[i].x)&1)==(m&1)?C(m,(m-abs(x-p[i].x))>>1):0)%MOD;
        (sumx+=t)%=MOD;
    }
    for(int y=mny;y<=mxy;y++){
        int t=1;
        for(int i=l;i<=r;i++)
            t=1ll*t*(((y-p[i].y)&1)==(m&1)?C(m,(m-abs(y-p[i].y))>>1):0)%MOD;
        (sumy+=t)%=MOD;
    }
    return 1ll*sumx*sumy%MOD;
}
int calc2(int l1,int r1,int l2,int r2){
    int sumx=0,sumy=0;
    for(int x=mnx;x<=mxx;x++){
        int t=1;
        for(int i=l1;i<=r1;i++)
            t=1ll*t*(((x-p[i].x)&1)==(m&1)?C(m,(m-abs(x-p[i].x))>>1):0)%MOD;
        for(int i=l2;i<=r2;i++)
            t=1ll*t*(((x-p[i].x)&1)==(m&1)?C(m,(m-abs(x-p[i].x))>>1):0)%MOD;
        (sumx+=t)%=MOD;
    }
    for(int y=mny;y<=mxy;y++){
        int t=1;
        for(int i=l1;i<=r1;i++)
            t=1ll*t*(((y-p[i].y)&1)==(m&1)?C(m,(m-abs(y-p[i].y))>>1):0)%MOD;
        for(int i=l2;i<=r2;i++)
            t=1ll*t*(((y-p[i].y)&1)==(m&1)?C(m,(m-abs(y-p[i].y))>>1):0)%MOD;
        (sumy+=t)%=MOD;
    }
    return 1ll*sumx*sumy%MOD;
}
int calc3(int l1,int r1,int l2,int r2,int l3,int r3){
    int sumx=0,sumy=0;
    for(int x=mnx;x<=mxx;x++){
        int t=1;
        for(int i=l1;i<=r1;i++)
            t=1ll*t*(((x-p[i].x)&1)==(m&1)?C(m,(m-abs(x-p[i].x))>>1):0)%MOD;
        for(int i=l2;i<=r2;i++)
            t=1ll*t*(((x-p[i].x)&1)==(m&1)?C(m,(m-abs(x-p[i].x))>>1):0)%MOD;
        for(int i=l3;i<=r3;i++)
            t=1ll*t*(((x-p[i].x)&1)==(m&1)?C(m,(m-abs(x-p[i].x))>>1):0)%MOD;
        (sumx+=t)%=MOD;
    }
    for(int y=mny;y<=mxy;y++){
        int t=1;
        for(int i=l1;i<=r1;i++)
            t=1ll*t*(((y-p[i].y)&1)==(m&1)?C(m,(m-abs(y-p[i].y))>>1):0)%MOD;
        for(int i=l2;i<=r2;i++)
            t=1ll*t*(((y-p[i].y)&1)==(m&1)?C(m,(m-abs(y-p[i].y))>>1):0)%MOD;
        for(int i=l3;i<=r3;i++)
            t=1ll*t*(((y-p[i].y)&1)==(m&1)?C(m,(m-abs(y-p[i].y))>>1):0)%MOD;
        (sumy+=t)%=MOD;
    }
    return 1ll*sumx*sumy%MOD;
}
void solve(){
    int t[3];
    t[0]=calc1(1,a);
    t[1]=calc1(a+1,a+b);
    t[2]=calc1(a+b+1,n);
    int ans=1ll*t[0]*t[1]%MOD*t[2]%MOD;
    (ans-=1ll*t[2]*calc2(1,a,a+1,a+b)%MOD)%=MOD;
    (ans-=1ll*t[1]*calc2(1,a,a+b+1,n)%MOD)%=MOD;
    (ans-=1ll*t[0]*calc2(a+1,a+b,a+b+1,n)%MOD)%=MOD;
    (ans+=2ll*calc3(1,a,a+1,a+b,a+b+1,n)%MOD)%=MOD;
    printf("%d\n",ans>=0?ans:ans+MOD);
}
int main(){
    readData();
    initFact(10000);
    solve();
    return 0;
}
```

