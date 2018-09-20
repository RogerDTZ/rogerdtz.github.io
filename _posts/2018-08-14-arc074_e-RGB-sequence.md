---
layout: post
title: 【ARC074E】 RGB sequence
date: 2018-08-14
mathjax: true
categories: [2017国家集训队作业]
tags: [计数问题,DP---计数DP]
---
* content
{:toc}
## Description

​	一排$n$个格子，每个格子可以涂三种颜色的一种。现在给出$m$个形如“$[l,r]$中必须恰好有$x$种颜色"的限制（$1 \le l \le r \le n,  1 \le x \le 3$）。

​	求一共有多少种满足所有限制的合法涂色方案。

​	答案对$10^9+7$取模。



## Solution

​	首先要想到状态表示法，如何表示才能适应这些限制呢？由于是限制颜色种类数，可以考虑最早出现位置这类套路。

​	设$f_{i,j,k}$表示：当前走完$1...i$，在$i$左边最靠右的、与$i$颜色不同的位置为$j$，在$j$左边最靠右的、与$i$和$j$颜色不同的位置为$k$时，目前合法染色方案数是多少。

​	逐步计算$f_1,f_2,...$。

​	接下来考虑限制。考虑在转移的时候逐一枚举限制来判断新状态是否合法。

​	则总复杂度是$\mathcal O(n^3m)$的。还有3倍常数，显然不够优秀。

​	然而这只是臆想做法，具体我也没实现出来，因为枚举限制的时候，限制的区间和$i,j,k$的位置的关系实在太多，不好写。	

​	实际上，对于一个$[l,r]$的限制，它只需要去管$i==r$的那些状态是否合法即可。如果$i<r$，那么显然还没有考虑的必要（都没填完$[l,r]$，考虑什么呢？）。如果$r<i$那么已经晚了。所以每个条件至多被枚举一次。

​	因此总复杂度是$\mathcal O (n^2(n+m))$的。

​	所以下次觉得枚举限制条件十分复杂且时间复杂度爆炸的时候，不妨想一想限制条件或许只针对特定对象才起效果或必要，这样就可以减少总枚举次数，优化复杂度。

​	



## Code

```c++
#include <cstdio>
#include <algorithm>
#include <vector>
#define pb push_back
#define mp make_pair
using namespace std;
typedef pair<int,int> pii;
const int N=310;
const int MOD=1e9+7;
int n,m;
int f[N][N][N];
vector<pii> lis[N];
void readData(){
	scanf("%d%d",&n,&m);
	int l,r,x;
	for(int i=1;i<=m;i++){
		scanf("%d%d%d",&l,&r,&x);
		lis[r].pb(mp(l,x));
	}
}
void dp(){
	f[1][0][0]=1;
	for(int i=1;i<=n;i++){
		for(int d=0,sz=lis[i].size();d<sz;d++){
			int l=lis[i][d].first,x=lis[i][d].second;
			for(int j=0;j<i;j++)
				for(int k=0;k<=(j-(j>0));k++){
					if(x==1){
						if(l<=j) f[i][j][k]=0;
					}
					else if(x==2){
						if(l<=k||j<l) f[i][j][k]=0;
					}
					else{
						if(k<l) f[i][j][k]=0;
					}
				}
		}
		if(i==n) break;
		for(int j=0;j<i;j++)
			for(int k=0;k<=(j-(j>0));k++)
				if(f[i][j][k]){
					(f[i+1][j][k]+=f[i][j][k])%=MOD;	
					(f[i+1][i][k]+=f[i][j][k])%=MOD;
					(f[i+1][i][j]+=f[i][j][k])%=MOD;
				}
	}
	int ans=0;
	for(int j=0;j<n;j++)
		for(int k=0;k<=(j-(j>0));k++)
			(ans+=f[n][j][k])%=MOD;
	ans=1LL*ans*3%MOD;
	printf("%d\n",ans<0?ans+MOD:ans);
}
int main(){
	readData();
	dp();
	return 0;
}

```

