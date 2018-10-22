---
layout: post
mathjax: true
title: 【ARC096E】Every thing on it
date: 2018-10-22-19:11:00
tag: [容斥原理,计数问题]
---
* content
{:toc}
# Description

 　　给定$n$个元素，一共有$2^n$个生成子集

　　求有多少种子集族，满足每一个元素都至少被包含在两个集合之中



# Solution

　　肯定是使用容斥

　　总方案数为$2^{2^n}$。设满足$1\dots i$号元素要么不出现，要么只出现在一个集合的子集族数量为$f_i$，则有
$$
\text{ans}=2^{2^n}-\sum_{i=1}^n(-1)^i{n \choose i}f_i
$$
　　如何求$f_i$呢？它很难用一个式子表示出来，但题目允许我们用$O(n)$的时间计算每一个$f_i$，因此考虑将$f_i$拆分每一种情况，再对每一种情况求和

　　考虑$f_i$表示的每一个情况，我们要找到唯一对应的特征：有多少个子集包含了$1\dots i$？设$g_{i,j}$表示在$f_i$意义下，有多少子集族满足恰好$j$个集合包含$1\dots i$中的元素

　　$g_{i,j}$的计算思路可以这么解释：

1. 将不超过$i$个元素（特别地，可以为0个元素），分配到$j$个非空集合，有多少种方法？设为$w_{i,j}$
2. 这$j$个集合各自的后$n-i$中元素可以任意选择
3. 除了这$j$个必选的集合，其余可以被选择的集合的前$1\dots i$项都必须为0。记这些集合的数量为$k$，则我们有$2^k$种选法

　　综上，有：
$$
f_i=\sum_{j=0}^ig_{i,j}\\
g_{i,j}=w_{i,j} * (2^{n-i})^j * 2^{2^{n-i}}
$$
　　实际计算时，要把每一个$g_{i,j}$共有的一项$2^{2^{n-i}}$提出，减小常数

　　$w_{i,j}$怎么求？这个意义等价于将$i+1$个元素划分成$j+1$个集合，然后将$i+1$所在的集合当做“不出现在原问题中的集合的元素”组成的集合，删去。也就是$w_{i,j}=S2_{i+1,j+1}$

　　如果预处理做的完善，时间复杂度为$O(n^2)$。我这里直接做快速幂了，使用上面的提项优化后，速度还算过得去



# Summary

　　求解东西复杂，在时间复杂度允许的情况下，拆分成每一个量化情况，然后对方案数求和。每一个量化情况可能与原问题的直观思维毫无关系，关键是要对每一种情况找到唯一对应的一个特征，统计的时候就枚举特征、计算每个特征的方案数



# Code

```c++
#include <cstdio>
using namespace std;
const int N=3010;
int n;
int MOD;
int fact[N],iact[N];
int s[N][N];
int fastPow(int x,int y,int MOD=::MOD){
	int res=1;
	for(;y;x=1ll*x*x%MOD,y>>=1)
		if(y&1)
			res=1ll*res*x%MOD;
	return res;
}
void readData(){
	scanf("%d%d",&n,&MOD);
}
void initMath(int n){
	fact[0]=fact[1]=1;
	for(int i=2;i<=n;i++) fact[i]=1ll*fact[i-1]*i%MOD;
	iact[0]=iact[1]=1;
	iact[n]=fastPow(fact[n],MOD-2);
	for(int i=n-1;i>=2;i--) iact[i]=1ll*iact[i+1]*(i+1)%MOD;
}
inline int C(int n,int m){
	return (0<=m&&m<=n)?1ll*fact[n]*iact[m]%MOD*iact[n-m]%MOD:0;
}
void initStirling(int n){ // prefix of each line
	for(int i=0;i<=n;i++) s[i][0]=1;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=i;j++)
			s[i][j]=(1ll*s[i-1][j]*(j+1)%MOD+s[i-1][j-1])%MOD;
}
void calc(){
	int ans=fastPow(2,fastPow(2,n,MOD-1));
	int f;
	for(int i=1;i<=n;i++){
		f=0;
		for(int j=0;j<=i;j++)
			(f+=1ll*s[i][j]*fastPow(fastPow(2,n-i),j)%MOD)%=MOD;
		f=1ll*f*fastPow(2,fastPow(2,n-i,MOD-1))%MOD;
		(ans+=((i&1)?-1ll:1ll)*C(n,i)*f%MOD)%=MOD;
	}
	printf("%d\n",ans>=0?ans:ans+MOD);
}
int main(){
	readData();
	initMath(n);
	initStirling(n);
	calc();
	return 0;
}
```

 