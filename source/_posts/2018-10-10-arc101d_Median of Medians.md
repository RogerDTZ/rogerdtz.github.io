---
layout: post
mathjax: true
title: 【ARC101D】Median of Medians
date: 2018-10-10 19:16:00
tag: [转化,二分答案,好题]
---
# Description

　　给定一个长度为$n$的序列$a_i$

　　将所有连续子序列（共$\frac{n*(n+1)}{2}$个）的中位数组成一个新的序列，求这个序列的中位数

　　$n \le 10^5,\ a_i\le 10^6$


<!-- more -->
# Solution

　　如果直接考虑答案中位数是怎么得到的，思路会特别绕，要考虑太多东西

　　考虑转化中位数的定义：对于一个长度为$n$的序列$a$，其中位数$m$应该满足下列条件：

1. 在序列中，不小于$m$的元素个数不少于$\lceil\frac{n}2\rceil$
2. $m$要尽可能大

　　显然，我们已经可以看出这个可二分的形式。考虑二分最终的答案$ans$，判定时，我们相当于在一个长度为$\frac{n*(n+1)}{2}$的序列中，求有多少个元素$\ge ans$；换句话说，我们要求解有多少原序列的连续子序列满足其中位数大于等于$ans$

　　考虑转化形如“一个序列的中位数$\ge x$”的条件：记这个序列不小于$x$的元素个数为$a$，其余元素个数为$b$，则对应回来，二者应该满足$a \ge b$

　　于是这个问题就变成了一个经典的问题：以区间内黑白点的个数谁多谁少来定义区间的权值。我们令整个序列中$\ge ans$的权值为$1$，其余的权值为$-1$，求解前缀和后，我们可以利用树状数组快速计算区间和大于等于0的区间个数

　　综上，我们可以在$O(n \log n \log10^6)$的时间内用二分答案解决这个中位数的问题



# Summary

　　如果题目围绕一个传统定义的或者新定义的概念展开，尝试将这个定义转化为多个等价的、更适宜算法解决的约束条件

# Code

```c++
#include <cstdio>
using namespace std;
const int N=100010;
typedef long long ll;
int n;
ll subsum;
int a[N],maxa;
int b[N];
inline int max(int x,int y){
	return x>y?x:y;
}
void readData(){
	scanf("%d",&n);
	subsum=1ll*n*(n+1)/2;
	for(int i=1;i<=n;i++){
		scanf("%d",&a[i]);
		maxa=max(maxa,a[i]);
	}
}
namespace BIT{
	int n;
	int a[N*2];
	void setup(int _n){
		n=_n;
		for(int i=1;i<=n;i++) a[i]=0;
	}
	void add(int u,int x=1){
		for(;u&&u<=n;u+=u&-u)
			a[u]+=x;
	}
	int que(int u){
		int res=0;
		for(;u;u-=u&-u)
			res+=a[u];
		return res;
	}
}
ll calc(int x){
	b[0]=0;
	for(int i=1;i<=n;i++){
		b[i]=(a[i]>=x)?1:-1;
		b[i]+=b[i-1];
	}
	BIT::setup(2*n+1);
	BIT::add(n+1);
	ll res=0;
	for(int i=1;i<=n;i++){
		res+=BIT::que(b[i]+(n+1));
		BIT::add(b[i]+(n+1));
	}
	return res;
}
bool judge(int x){
	return calc(x)>=((subsum+1)>>1);
}
int solve(){
	int l=1,r=maxa,mid;
	while(l<=r){
		mid=(l+r)>>1;
		if(judge(mid))
			l=mid+1;
		else
			r=mid-1;
	}
	return r;
}
int main(){
	readData();
	printf("%d\n",solve());
	return 0;
}
```

