---
title: Multiple of Nine
mathjax: true
date: 2019-06-25 16:13:32
tags: [转化]
---

# Description

求满足以下条件的长度为$n$的字符串个数，对$10^9+7$取模

1. 每一位都是‘0’...‘9’
2. 对于给定的$m$个区间，要求每个区间的字符串代表的十进制数（忽略前导零后）都是$9$的倍数

$n \le 10^9$，$m \le 15$

<!-- more -->

# Solution

首先，一个数被$9$整除，当且仅当数位之和被$9$整除。限制转化为每个区间内的数加起来后模9必须为0

如果按区间来逐个考虑的话，会非常麻烦，各种关系没法理清

考虑转化成前缀和的形式，对于某一种方案，记其模$9$意义下的前缀和为$s_i$

对于一个区间$[l,r]$，我们要求$s_r=s_{l-1}$。把$s_r$和$s_{l-1}$标记为关键点。为了方便，把$s_0$和$s_n$也标记为关键点。

对所有关键点离散化，记关键点总数为$q$。下面的$s$仅考虑这些关键点

限制转化为：某些关键点的值必须相同，即它们本质相同、值是绑定的，将他们称为一组

下面考虑计算一种$s$序列的方案数

对于一个长度为$x$的字符串，满足其模$9$余$r$的填法共有
$$
\frac{10^x - 1}{9} + [r=0]
$$
种

对于某一种序列$s$，其方案数就是
$$
\prod_{i=2}^{q}\frac{10^{pos_i-pos_{i-1}} - 1}{9} + [s_i=s_{i-1}]
$$
可以这样计算方案数：初始时，答案是一个基数
$$
\prod_{i=2}^{q}\frac{10^{pos_i-pos_{i-1}} - 1}{9}
$$
如果$s_i==s_{i-1}$，那么答案就要乘上修正值
$$
\frac {\frac{10^{pos_i-pos_{i-1}} - 1}{9}+1} {\frac{10^{pos_i-pos_{i-1}} - 1}{9}}
$$
问题转化为把所有组染上$0\dots 8$这9种颜色，同种颜色内的组会对答案产生额外贡献：把这种颜色的所有组的所有元素放回序列中，如果两个元素在原序列上是相邻的，就乘上相应的修正值

我们可以预处理出每一种集合的组染上同一种颜色时产生的贡献，然后进行$O(9\times 3^n)$的子集DP即可

如果把$s_0$和$s_n$都设为关键点，最后的组数可能到达17，导致复杂度爆炸。因此我们单独处理一下首尾的情况，尾部直接乘上答案即可，而首部的情况，就是与$s_0$所在的组必须是0，在DP数组里预赋值，然后进行正常DP即可，这样组数就不会超过15，可以通过本题

# Code

```c++
#include <cstdio>
#include <map>
#include <vector>
#include <algorithm>

#define FR first
#define SE second

#define INV(x) FastPow(x,MOD-2)

using std::swap;
using std::map;
using std::vector;

const int MOD=1e9+7;
const int INV9=111111112;
const int M=15+5;
const int S=32768+10; // 2^M

inline int bas2(int i){
	return 1<<(i-1);
}
inline int bit2(int s,int i){
	return (s>>(i-1))&1;
}
int FastPow(int x,int y){
	int res=1;
	for(;y;x=1ll*x*x%MOD,y>>=1)
		if(y&1)
			res=1ll*res*x%MOD;
	return res;
}

int n,m;
int seg[M][2];
int a[M*2],acnt;
map<int,int> who;
int val[M*2][2];
int dsu[M*2],bcnt;
int coef[S][2];
vector<int> pos[M];

void ReadData(){
	scanf("%d%d",&n,&m);
	for(int i=1;i<=m;i++)
		scanf("%d%d",&seg[i][0],&seg[i][1]);
}

void InitSeg(){
	map<int,bool> cut;
	cut[0]=true;
	for(int i=1;i<=m;i++){
		cut[seg[i][0]-1]=true;
		cut[seg[i][1]]=true;
	}
	acnt=-1;
	for(map<int,bool>::iterator it=cut.begin();it!=cut.end();it++)
		a[++acnt]=it->FR;
	for(int i=1;i<=acnt;i++)
		who[a[i]]=i;
	for(int i=1;i<=acnt;i++){
		val[i][0]=1ll*(FastPow(10,a[i]-a[i-1])-1)*INV9%MOD;
		val[i][1]=1ll*(val[i][0]+1)*INV(val[i][0])%MOD;
	}
}

int FindDSU(int x){
	return (dsu[x]==x)?x:(dsu[x]=FindDSU(dsu[x]));
}
void Merge(int x,int y){
	x=FindDSU(x);
	y=FindDSU(y);
	if(x==y)
		return;
	if(x<y)
		swap(x,y);
	dsu[x]=y;
}

void Lock(){
	for(int i=0;i<=acnt;i++) dsu[i]=i;
	for(int i=1;i<=m;i++)
		Merge(who[seg[i][0]-1],who[seg[i][1]]);
	map<int,int> id;
	for(int i=0;i<=acnt;i++) id[i]=-1;
	bcnt=-1;
	for(int i=0;i<=acnt;i++){
		int d=FindDSU(i);
		if(id[d]==-1)
			id[d]=++bcnt;
	}
	for(int i=0;i<=acnt;i++)
		pos[id[dsu[i]]].push_back(i);
}

void CalcCoef(){
	int stateCnt=1<<bcnt;
	for(int s=0;s<stateCnt;s++){
		coef[s][0]=coef[s][1]=1;
		static bool exist[M*2];
		for(int i=0;i<=acnt;i++) exist[i]=false;
		for(int i=1;i<=bcnt;i++)
			if(bit2(s,i)){
				for(int j=0;j<int(pos[i].size());j++)
					exist[pos[i][j]]=true;
			}
		for(int i=1;i<=acnt;i++)
			if(exist[i-1]&&exist[i])
				coef[s][0]=1ll*coef[s][0]*val[i][1]%MOD;
		for(int j=0;j<int(pos[0].size());j++)
			exist[pos[0][j]]=true;
		for(int i=1;i<=acnt;i++)
			if(exist[i-1]&&exist[i])
				coef[s][1]=1ll*coef[s][1]*val[i][1]%MOD;
	}
}

void DP(){
	static int f[10][S];
	f[0][0]=1;
	int stateCnt=1<<bcnt;
	for(int i=1;i<=9;i++)
		for(int j=0;j<stateCnt;j++)
			for(int k=j;;k=(k-1)&j){
				(f[i][j]+=1ll*f[i-1][k]*coef[j-k][i==1]%MOD)%=MOD;
				if(!k)
					break;
			}
	int ans=f[9][stateCnt-1];
	for(int i=1;i<=acnt;i++)
		ans=1ll*ans*val[i][0]%MOD;
	ans=1ll*ans*FastPow(10,n-a[acnt])%MOD;
	printf("%d\n",ans>=0?ans:ans+MOD);
}

int main(){
	ReadData();
	InitSeg();
	Lock();
	CalcCoef();
	DP();
	return 0;
}
```

