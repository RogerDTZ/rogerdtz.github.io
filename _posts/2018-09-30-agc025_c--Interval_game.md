---
layout: post
mathjax: true
title: 【AGC025C】Interval Game
date: 2018-09-30-08:06:00
tag: [贪心]
---
* content
{:toc}
# Description

　　A站在数轴上的原点，B有$n$个线段

　　游戏分为$n$个阶段：每次B从还未选择的线段中选择一个，然后A必须走到该线段之中（可以站在端点上）

　　$n$个阶段结束后，A会再走回原点

　　B可以任意规定线段拿出来的顺序，然后A会以最优的策略走完全程，也就是A走的总路程会尽可能的少

　　问A总路程的最大值？



# Solution

　　这题让我联想到火车那一题转化之后的情况：那题使用了DP解决站在左右端点的情况。然而那题的人只能往右走，而本题的人可以左右走，所以并不适用

　　首先明确A的策略：如果选择线段包含本身，A一定不动，不动肯定不会更劣；否则，走到目标线段中，靠近自己的一个端点上，执行这种策略不会更劣

　　先不说那些包含当前位置的线段：如果A在线段的右边，那么A会走到右端点；如果在左边，那么A会走到左端点

　　我们要最大化A走的距离，一个最暴力直观的想法，就是让A反复横跳：先尽可能地让A往左走，再尽可能地让A往右走。要做到这一点，我们先选择右端点最小的线段，再选择左端点最大的线段，然后重复上述过程，并模拟A的走路过程即可。具体实现上，用两个set按左端点和右端点同步维护剩余未选的线段

　　**直觉**告诉我们：出发点有两种决策：先往左和先往右。因此，我们将第一步往左和第一步往右的两种情况的答案取$max$输出。具体是为什么？我也不是特别清楚，应该是因为这样能覆盖到所有较优情况吧......

# Summary

　　使最小值最大的问题，如果尝试用贪心解决，就想想如何构造最坏情况，使得“最小”的决策方式最劣

# Code

```c++
#include <cstdio>
#include <set>
#define mp make_pair
#define FR first
#define SE second
using namespace std;
typedef long long ll;
typedef pair<int,int> pii;
const int N=100010;
int n;
int a[N][2];
set<pii> l,r;
inline ll max(ll x,ll y){
	return x>y?x:y;
}
void readData(){
	scanf("%d",&n);
	for(int i=1;i<=n;i++)
		scanf("%d%d",&a[i][0],&a[i][1]);
	a[n+1][0]=0; a[n+1][1]=0;
}
void addseg(int i){
	l.insert(mp(a[i][0],i));
	r.insert(mp(a[i][1],i));
}
void remseg(int i){
	l.erase(l.find(mp(a[i][0],i)));
	r.erase(r.find(mp(a[i][1],i)));
}
void initSet(){
	for(int i=1;i<=n;i++)
		addseg(i);
}
void move(int &cur,ll &sum,int t){
	if(a[t][0]<=cur&&cur<=a[t][1])
		return;
	else if(cur<a[t][0]){
		sum+=a[t][0]-cur;
		cur=a[t][0];
	}
	else{
		sum+=cur-a[t][1];
		cur=a[t][1];
	}
}
void goleft(int &cur,ll &sum){
	static set<pii>::iterator it;
	it=r.begin();	
	int id=(*it).SE;
	move(cur,sum,id);
	remseg(id);
}
void goright(int &cur,ll &sum){
	static set<pii>::iterator it;
	it=l.end();
	it--;
	int id=(*it).SE;
	move(cur,sum,id);
	remseg(id);
}
ll solve(int f){
	ll res=0;
	int cur=0;
	initSet();
	for(int i=1;i<=n;i++)
		if(i&1^f)
			goleft(cur,res);
		else
			goright(cur,res);
	move(cur,res,n+1);
	return res;
}
int main(){
	readData();
	printf("%lld\n",max(solve(0),solve(1)));
	return 0;
}
```

