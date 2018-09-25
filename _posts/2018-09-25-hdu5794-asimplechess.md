---
layout: post
title: 【HDU5794】A Simple Chess
date: 2018-09-25-20:32:00
tags: [最小表示法,数论---Lucas定理,DP---计数DP]
mathjax: true
---
* content
{:toc}
# Description

[原题链接](http://acm.hdu.edu.cn/showproblem.php?pid=5794)

　　从$(1,1)$走到$(n,m)$，每次只能往右上方走“日”字对角

　　某一些点不可走

　　求方案数？



# Solution

　　联想一道题：[BZOJ3782](https://www.lydsy.com/JudgeOnline/problem.php?id=3782)，做法几乎一样

　　先假设我们有一个函数$s(x,y)$，表示从$(0,0)$走到$(x,y)$有多少种走法

　　设$f_a$表示从$(1,1)$走到第$a$个障碍物处，中途不经过其他障碍物的走法方案数

　　考虑容斥。从全集里面扣去不合法的路径

　　全集为$s(a_x-1,a_y-1)$

　　对于任意一条不合法的路径，我们都要找到一个唯一确定的特征，用那个特征来统计

　　我们运用最小表示法，枚举每一个障碍点$b$，删去那些以$b$作为第一个碰到的障碍物的不合法路径。也就是先不碰其他障碍走到$b$，再肆无忌惮地走到$a$

　　则有

$$
f_a=s(a_x-1,a_y-1)-\sum_{b}f_b * s(b_x-a_x,b_y-a_y)
$$

　　下面关键是如何实现$s(d_x,d_y)$这个函数

　　考虑每一步，都是在某一个方向推进2格，另一个方向推进1格。设一共在$x$上走了$n_x$步，在$y$上走了$n_y$步，则

$$
\begin{aligned}
2n_x+n_y&=d_x\\
2n_y+n_x&=d_y
\end{aligned}
$$

　　不妨设$d_x\ge d_y$（否则可以交换二者，这一步是为了尽可能排除潜在的负数），解二元方程组得：

$$
\begin{aligned}
n_x&=\frac{2d_x-d_y}{3}\\
n_y&=d_x-2n_x
\end{aligned}
$$

　　在解方程的过程中，我们发现如果当前计算的情况有解，那么局面必须满足$d_x+d_y\mod3=0$

　　同时，最终计算出来的$n_x$和$n_y$都不能为负数

　　现在我们得知了往各个方向走2格的次数。此时问题又变成了经典的走格子计数，方案数为${n_x+n_y\choose n_x}$



# Code

　　假装自己过了

```c++
#include <cstdio>
#include <algorithm>
using namespace std;
typedef long long ll;
const int N=110;
const int MOD=110119;
ll n,m;
int o;
struct Point{
	ll x,y;
};
Point a[N];
int f[N];
int fact[MOD],iact[MOD];
int fmi(int x,int y){
	int res=1;
	for(;y;x=1ll*x*x%MOD,y>>=1)
		if(y&1)
			res=1ll*res*x%MOD;
	return res;
}
void readData(){
	scanf("%lld%lld%d",&n,&m,&o);
	for(int i=1;i<=o;i++)
		scanf("%lld%lld",&a[i].x,&a[i].y);
}
void init(){
	fact[0]=fact[1]=1;
	for(int i=2;i<MOD;i++) fact[i]=1ll*fact[i-1]*i%MOD;
	iact[0]=iact[1]=1;
	iact[MOD-1]=fmi(fact[MOD-1],MOD-2);
	for(int i=MOD-2;i>=2;i--) iact[i]=1ll*iact[i+1]*(i+1)%MOD;
}
int C(ll n,ll m){
	if(m>n)
		return 0;
	if(n<MOD)
		return 1ll*fact[n]*iact[m]%MOD*iact[n-m]%MOD;
	return 1ll*C(n/MOD,m/MOD)*C(n%MOD,m%MOD)%MOD;
}
int calc(ll dx,ll dy){
	if((dx+dy)%3!=0)
		return 0;
	if(dx<dy)
		swap(dx,dy);
	ll nx=(2*dx-dy)/3,ny=dx-2*nx;
	if(nx<0||ny<0)
		return 0;
	return C(nx+ny,nx);
}
bool cmpByRectGo(const Point &a,const Point &b){
	if(a.x!=b.x)
		return a.x<b.x;
	return a.y<b.y;
}
void solve(){
	a[++o]=(Point){n,m};
	sort(a+1,a+1+o,cmpByRectGo);
	for(int i=1;i<=o;i++){
		f[i]=calc(a[i].x-1,a[i].y-1);
		for(int j=1;j<i;j++)
			if(a[j].x<=a[i].x&&a[j].y<=a[i].y)
				(f[i]-=1ll*f[j]*calc(a[i].x-a[j].x,a[i].y-a[j].y)%MOD)%=MOD;
	}
	printf("%d\n",f[o]<0?f[o]+MOD:f[o]);
}
int main(){
	readData();
	init();
	solve();
	return 0;
}
```

