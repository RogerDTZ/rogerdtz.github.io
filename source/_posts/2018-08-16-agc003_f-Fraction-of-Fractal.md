---
layout: post
title: 【AGC003F】Fraction of Fractal
date: 2018-08-16
mathjax: true
categories: [2017国家集训队作业]
---
## Description

[原题链接](http://agc003.contest.atcoder.jp/tasks/agc003_f)



<!-- more -->
## Solution

神题。

定义一个上边界或下边界的格子为”上下接口“，当且仅当上下边界该位置的格子都是黑色的。

”左右接口“同理。

首先特判掉$k \le 1 $的情况，答案都是1。

然后特判掉两种情况：上下接口和左右接口同时存在时，答案显然为1；二者皆不存在时，答案就是$s^{k-1}$，其中$s$为给定网格的黑格子数目。

所以接下来我们考虑的问题是：$k\ge 2$，且仅存在上下接口或左右接口。现在我们只考虑前者的情况，后者可以通过旋转原网格来达到同样的效果。

首先来观察2级分形的结构：我们不妨把其中的每一块**1级分形**看做一个**节点**，如果两个相邻1级分形可以互相连通，则视为将其对应节点之间连一条**边**。由此我们对2级分形构造出一张图。

对于3级及其以上分形，**节点**与**边**的定义不再扩展，依然是**1级分形**、表示**1级分形**之间是否连通。

可以发现，由于当前只存在上下接口，因此2级分形的图是由**若干条竖直方向的链**构成的。推广一下，就会发现，对于$k$级分形$(k \ge 2)$对应的图，它们都有着这个性质。

将链看成树，我们就可以运用森林的性质：树的个数等于总点数减去总边数。则连通块个数等于总点数减去总边数。

记$a$表示给定网格样式中，上下两个格子都是黑色的位置有多少，即$\sum [map_{i,j}=map_{i+1,j}='\#']$

记$b$表示上下接口的个数（同一列的两个接口只算1个）	

记$V_k$表示$k$级分形图中**点**的个数，$E_k$表示$k$级分形图中**边**的条数。则有递推式：

- $V_2=s$，$E_2=a$


- $V_k=V_{k-1}*s$，$E_k=E_{k-1}*s+ab^{k-2}$


其中$V$的递推显然，而$E$的含义则是：每个低级分形中边个数乘上扩增倍数，加上低级分形在组合成高级分形时通过上下接口新产生的边数。注意$b$之所以含有一个幂形式，是因为随着分形级数的不断扩增，上下接口的数量也在不断增长。

使用矩阵快速幂计算就做完了。



## Code

```c++
#include <cstdio>
#include <cstring>
using namespace std;
typedef long long ll;
const int N=1005;
const int MOD=1e9+7;
int n,m,blacksum;
ll kk;
char str[N][N];
int map[N][N];
int hcnt,vcnt,lh,lv;
inline void plus(int &x,int y){
	x=(x+y>=MOD)?(x+y-MOD):x+y;
}
inline void swap(int &x,int &y){
	x^=y^=x^=y;
}
inline int fmi(int x,ll y){
	int res=1;
	for(;y;x=1LL*x*x%MOD,y>>=1)
		if(y&1)
			res=1LL*res*x%MOD;
	return res;
}
struct Mat{
	int n,m;
	int a[4][4];
	Mat(){
		memset(a,0,sizeof a);	
	}
	Mat(int _n,int _m){
		n=_n; m=_m;
		clear();
	}
	void setUnit(){
		if(n!=m) return;
		for(int i=1;i<=n;i++)
			a[i][i]=1;
	}
	void clear(){
		for(int i=1;i<=n;i++)
			for(int j=1;j<=m;j++)
				a[i][j]=0;
	}
	friend Mat operator * (Mat u,Mat v){
		Mat res=Mat(u.n,v.m);
		for(int i=1;i<=u.n;i++)
			for(int j=1;j<=v.m;j++)
				for(int k=1;k<=u.m;k++)
					//(res.a[i][j]+=1LL*u.a[i][k]*v.a[k][j]%MOD)%=MOD;
					plus(res.a[i][j],1LL*u.a[i][k]*v.a[k][j]%MOD);
		return res;
	}
}O,T;
void readData(){
	scanf("%d%d%lld",&n,&m,&kk);
	for(int i=1;i<=n;i++){
		scanf("%s",str[i]+1);
		for(int j=1;j<=m;j++)
			blacksum+=(str[i][j]=='#');
	}
}
int getTypeAndInit(){
	for(int i=1;i<=n;i++)
		hcnt+=(str[i][1]=='#'&&str[i][m]=='#');
	for(int j=1;j<=m;j++)
		vcnt+=(str[1][j]=='#'&&str[n][j]=='#');
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++){
			if(j<m)
				lh+=(str[i][j]=='#'&&str[i][j+1]=='#');
			if(i<n)
				lv+=(str[i][j]=='#'&&str[i+1][j]=='#');
		}
	if(hcnt&&vcnt) return 1;
	else if(!hcnt&&!vcnt) return 2;
	if(hcnt){
		swap(hcnt,vcnt);
		swap(lh,lv);
	}
	return 3;
}
void fillMatrix(){
	O=Mat(1,3);
	O.a[1][1]=blacksum; O.a[1][2]=lv; O.a[1][3]=vcnt;
	T=Mat(3,3);
	T.a[1][1]=blacksum;
	T.a[2][2]=blacksum; T.a[3][2]=lv;
	T.a[3][3]=vcnt;
}
Mat mat_fmi(Mat x,ll y){
	Mat res=Mat(x.n,x.n);
	res.setUnit();
	for(;y;x=x*x,y>>=1)
		if(y&1)
			res=res*x;
	return res;
}
void solve(){
	fillMatrix();
	T=mat_fmi(T,kk-2);
	O=O*T;
	int ans=O.a[1][1]-O.a[1][2];
	printf("%d\n",ans<0?ans+MOD:ans);
}
int main(){
	readData();	
	if(kk<=1){
		puts("1");
		return 0;
	}
	int type=getTypeAndInit();
	if(type==1)//whole
		puts("1");
	else if(type==2)//isolated
		printf("%d\n",kk==0?1:fmi(blacksum,kk-1));
	else
		solve();
	return 0;
}
```
