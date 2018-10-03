---
layout: post
mathjax: true
title: 【AGC023C】Paint Machines
date: 2018-10-03-19:40:00
tag: [数论---组合数学]
---

* content
{:toc}
# Description

　　[题目链接](https://beta.atcoder.jp/contests/agc023/tasks/agc023_c)



# Solution

　　一开始自以为是地想到了isn的做法，然而好像由于某些原因咕咕咕了

　　考虑对于每一个$k$，计算出有多少排列满足恰好在其第$k$次染色时序列变为全黑

　　先考虑前$k$个操作的分布位置，最后统计时乘上$k!$即可

　　对于前$k$个操作位置的布局$a_1<a_2<...<a_k$，我们可以发现如下规律：

* $a_1=1,\  a_k=n-1$
* 对于$i=1...k-1$，满足$a_{i+1}-a_i\le 1$

　　也就是对于$1...n-1$这些位置，$1$和$n-1$必选，且中间的两两元素间隔不可以超过$1$

　　直接统计不好搞，我们考虑用组合意义快速计算：将间隔看成一个球，一共有$n-1-k$个球；现有$k-1$个空位，每个位置只能放一个球。只要计算出这个问题的答案，我们就等价地求出了前$k$个操作位置的合法布局方案数

　　显然，这个值就是${ k-1 \choose n-1-k}$

　　确定了前$k$个元素，再使用组合意义补上后面的$n-1-k$个元素，我们可以计算出**在$k$次操作以内**填涂完毕的排列个数$f_k={k-1 \choose n-1-k}k!(n-1-k)!$

　　则**恰好在第$k$次操作时**填涂完毕的排列个数就是$g_k=f_k-f_{k-1}$

　　有了$g_k$，计算的答案的部分就很简单了

# Code

```c++
#include <cstdio>
using namespace std;
const int N=1000010;
const int MOD=1e9+7;
int n;
int fact[N],iact[N];
int f[N];
int fmi(int x,int y){
	int res=1;
	for(;y;x=1ll*x*x%MOD,y>>=1)
		if(y&1)
			res=1ll*res*x%MOD;
	return res;
}
void init(){
	fact[0]=fact[1]=1;
	for(int i=2;i<=n;i++) fact[i]=1ll*fact[i-1]*i%MOD;
	iact[0]=iact[1]=1;
	iact[n]=fmi(fact[n],MOD-2);
	for(int i=n-1;i>=2;i--) iact[i]=1ll*iact[i+1]*(i+1)%MOD;
}
inline int C(int n,int m){
	return m<=n?1ll*fact[n]*iact[m]%MOD*iact[n-m]%MOD:0;
}
void solve(){
	int ans=0,last=0;
	for(int k=(n+1)>>1;k<n;k++){
		int f=1ll*C(k-1,n-1-k)*fact[k]%MOD*fact[n-1-k]%MOD;
		int num=(f-last)%MOD;
		last=f;
		(ans+=1ll*num*k%MOD)%=MOD;
	}
	printf("%d\n",ans<0?ans+MOD:ans);
}
int main(){
	scanf("%d",&n);
	init();
	solve();
	return 0;
}
```

