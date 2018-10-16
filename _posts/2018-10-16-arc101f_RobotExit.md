---
layout: post
mathjax: true
title: 【ARC101F】Robots and Exits
date: 2018-10-16-16:14:00
tag: [转化,DP]
---
* content
{:toc}
# Description

　　数轴上的整点有若干个启动的机器人，还有若干个出口，它们互不重叠

　　每次你可以命令所有启动的机器人向左走或者向右走，当一个机器人走到出口时会停机，不再接受指令。

　　当所有机器人停止时，游戏结束

　　问结束后，机器人的停机位置有多少种局面



# Solution

　　除去只有一种出口可能的机器人——它们对局面无贡献。我们只考虑那些左右都存在出口的机器人，显然它们只能从左边最近的出口和右边最近的出口两种选择

　　对于操作序列，记向左-1，向右+1。考虑一个机器人，其决策状态只和历史最小值和历史最大值有关，且它的最终出口是谁只和历史最小值的绝对值和历史最大值谁先不小于它与左出口的距离和它与右出口的距离

　　对于一个与左出口距离为$a$，与右出口距离为$b$的机器人，我们在一个二维平面上用一个点$(a,b)$表示。如果将历史最小值和历史最大值刻画出来，我们相当于从原点$(0,0)$引出一条折线，每次它可以向上或向右走一个单位，若其先到达某一个点$(a,b)$的$y=b$这条直线，则相当于令该点对应的机器人的结果为右出口；相应的，如果先碰到$x=a$，则令该点对应的机器人的结果为左出口。且我们发现，折线不可能同时满足两种情况

　　我们已经成功地转化了问题。现在，我们只需要统计：对于一条只能向上或向右走的折线，它的下方的点有多少种情况，就能统计局面个数，因为折线下方的点的局面唯一对应了全局的一个局面

　　运用最小表示法的思想，对于同一种局面，我们仅在折线紧贴在下方的点的情况时才将该局面计入答案，即一条折线令该点$(a,b)$从右出口走出（在直线下方），当且仅当该直线经过了关键点$(a-1,b)$

　　设$f_i$表示：折线的末端在$i$的关键点，且下一步即将向右走时，方案数有多少。加上后面的限制是为了防止在同一个$x$坐标上多次决策造成重复统计。转移显然是直接统计$i$的关键点的左下方的关键点的$f$的和

　　由于关键点相当于在原图上整体向左移动了一格，我们完全可以在原来的点上跑DP，这样还可以省去一些特判



# Code

```c++
#include <cstdio>
#include <algorithm>
using namespace std;
const int N=100010;
const int INF=1e9;
const int MOD=1e9+7;
int n,m;
int a[N],b[N];
struct Point{
	int x,y;
	friend bool operator == (const Point &a,const Point &b){
		return a.x==b.x&&a.y==b.y;
	}
}p[N];
int d[N],dcnt;
int f[N];
void readData(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=n;i++) scanf("%d",&a[i]);
	for(int i=1;i<=m;i++) scanf("%d",&b[i]);
}
void initDis(){
	int cnt=1;
	p[1]=(Point){0,0};
	for(int i=1,j;i<=n;i++){
		j=upper_bound(b+1,b+1+m,a[i])-b;
		if(1<j&&j<=m)
			p[++cnt]=(Point){a[i]-b[j-1],b[j]-a[i]};
	}
	p[++cnt]=(Point){INF,INF};
	n=cnt;
}
void Diz(){
	for(int i=1;i<=n;i++)
		d[++dcnt]=p[i].y;
	sort(d+1,d+1+dcnt);
	dcnt=unique(d+1,d+1+dcnt)-d-1;
	for(int i=1;i<=n;i++)
		p[i].y=lower_bound(d+1,d+1+dcnt,p[i].y)-d;
}
namespace BIT{
	int n;
	int a[N];
	void setup(int _n){
		n=_n;
	}
	void add(int u,int x){
		for(;u&&u<=n;u+=u&-u)
			(a[u]+=x)%=MOD;
	}
	int que(int u){
		int res=0;
		for(;u;u-=u&-u)
			(res+=a[u])%=MOD;
		return res;
	}
}
bool cmpByX(const Point &a,const Point &b){
	if(a.x!=b.x)
		return a.x<b.x;
	return a.y<b.y;
}
void solve(){
	sort(p+1,p+1+n,cmpByX);
	n=unique(p+1,p+1+n)-p-1;
	BIT::setup(dcnt);
	BIT::add(p[1].y,1);
	for(int i=2,j;i<=n;i=j){
		for(j=i;j<=n&&p[j].x==p[i].x;j++);
		for(int k=i;k<j;k++)
			f[k]=BIT::que(p[k].y-1);
		for(int k=i;k<j;k++)
			BIT::add(p[k].y,f[k]);
	}
	printf("%d\n",f[n]);
}
int main(){
	readData();
	initDis();
	Diz();
	solve();
	return 0;
}
```

 