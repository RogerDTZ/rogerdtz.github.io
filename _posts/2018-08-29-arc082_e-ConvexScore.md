---
layout: post
title: 【ARC082E】ConvexScore
tag: [转换]
categories: 2017国家集训队作业
date: 2018-08-29
mathjax: true
---
* content
{:toc}
## Description

给定二维直角坐标系上的N个点$(X_i,Y_i)$,定义一个有N个点中的部分点所构成点集为“凸点集”，当且仅当该集合内的所有点恰好构成一个面积为正的凸多边形（每个内角严格小于180°）

对于每一个凸点集S，设这N个在该点集对应凸多边形内（包括边界）的数量为m，则该凸点集对答案的贡献的为$2^{m-\mid S\mid }$，求这N个点中每一个凸点集对答案的贡献之和。

由于最终答案可能非常大，你只需输出答案在模998244353意义下的结果。



## Solution

　　看起来很吓人。

　　我们先定义一个由点集到凸包外壳集的函数：$f(S)$表示点集$S$的凸包外壳点集。

　　对于某一个点集$S\cup T$，其中凸包外壳为$S$，内含点集为$T$，则其凸包外壳$f(S+T)=S$。整个凸包对答案的贡献为$2^{\mid T\mid }$，即$T$的子集个数。对于子集$T'\subset T$，$f(S+T')$都为$S$。我们相当于统计外壳固定时，有多少种点集不影响外壳。

　　那么我们不就相当于把每一个凸包点集都枚举了恰好一次吗？反向考虑，任意一个有效凸包点集$A$，我们发现其仅会在固定$f(A)$这个凸包外壳统计答案的时候贡献恰好一次。

　　所以总答案变成：原图有多少个凸包....

　　有效凸包数，等于总非空点集数，减去单点凸包$N$，减去双点凸包$N \choose 2$，再减去共线凸包个数。最后一个部分可以用最小/大表示法计算，即枚举每个共线凸包编号最小/大的两个点，计算这两个点的直线，再判断使用比这两个点编号大/小的点能与这两个点组成多少个共线凸包。

　　这题要怎么说啊，首先要对那个2的幂敏感，看出子集个数的概念。如果正面想求和意义实在行不通，不妨尝试从元素贡献来反向考虑。



## Code

```c++
#include <cstdio>
using namespace std;
const int N=205;
const int MOD=998244353;
int n;
struct Point{
	int x,y;
	Point(){}
	Point(int _x,int _y){
		x=_x; y=_y;
	}
	friend Point operator - (Point a,Point b){
		return Point(a.x-b.x,a.y-b.y);
	}
}a[N];
int pow2[N];
void readData(){
	scanf("%d",&n);
	for(int i=1;i<=n;i++)
		scanf("%d%d",&a[i].x,&a[i].y);
}
void initPow(){
	pow2[0]=1;
	for(int i=1;i<=n;i++)
		pow2[i]=(pow2[i-1]<<1)%MOD;
}
int cross(Point a,Point b){
	return a.x*b.y-a.y*b.x;
}
bool on_line(int i,int j,int k){
	return cross(a[j]-a[i],a[k]-a[i])==0;
}
void solve(){
	int ans=(1ll*pow2[n]-(1ll*n*(n-1)/2)-n-1)%MOD;
	for(int i=2;i<n;i++)
		for(int j=i+1;j<=n;j++){
			int sum=0;
			for(int k=1;k<i;k++)	
				if(on_line(i,j,k))
					sum++;
			(ans-=pow2[sum]-1)%=MOD;
		}
	printf("%d\n",ans<0?ans+MOD:ans);
}
int main(){
	readData();
	initPow();
	solve();
	return 0;
}
```

​	