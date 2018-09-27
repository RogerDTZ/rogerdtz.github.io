---
layout: post
title: 【ARC082】Sandglass
date: 2018-09-19
tag: [模拟]
categories: 2017国家集训队作业
mathjax: true
---
* content
{:toc}

# Description

​	[题目链接](https://arc082.contest.atcoder.jp/tasks/arc082_d)



# Solution

　　好题

　　题意是维护一个初始值，交替加减一段时间，有上界$m$和下界0（不能超过这两条界限），问对于某一种初始值，在某一个时刻时该值为多少？

　　可以把所有询问按时间排序成一列，然后用线段树区间加减、区间min、max暴力实现，然而我不会做。

　　实际上直接模拟即可。

　　如果按时间增长为横坐标，按该时间的权值为纵坐标，画出对于$[0,m]$的每一种初始值的函数图像，我们会发现，随着时间的增长，函数曲线变得原来越少，也就是图像会不断重叠在一起。

　　形式化地讲，我们可以发现一个重要性质：对于一个在某一时刻触碰到上/下边界的曲线，在这个时刻之后，其函数图像将会和在这个时刻之前已触碰到上/下边界的曲线完全相同。

　　在某一时刻时，我们称一个初始值为“归上”，当且仅当其在这个时刻及以前已经触碰到了上边界；“归下“同理。我们发现，对于任意确定时刻，”归上“的初始值都是$[y,m]$，而"归下"的初始值都是$[0,x]$。而且随着时间推进，$y$单调不增，$x$单调不减。

　　既然询问已经以时间递增的顺序给出，那我们就顺序模拟时间推进，并逐一处理询问。

　　我们要维护的东西有三个："归上"初始值在当前时间的具体取值$up$、“归下”的初始值在当前时间的具体取值$dn$，以及从开始到现在上下移动的总和$sum$。

　　对于一个询问$(t,a)$，假设时间已经模拟到了$t$，如果$a$"归上"，也就是曾经碰到上边界，那么答案就是$up$；如果其"归下"，则答案就是$dn$；否则，$a$从开始到现在没有碰到任何边界，所以其取值直接模拟即可，恰好为$a+sum$。至于”是否曾经触边“的判定，可以维护$sum$有史以来的最大值和最小值，加在$a$上判定与0或m的大小关系即可。

　　对于$up$和$dn$的计算，在初始时令$dn=0$，$up=m$，然后在时间推进的过程中不断对它们进行带边界限制的模拟上下移动，那么我们就可以保证在每一个时刻时，$up$和$dn$都是我们所定义的值。为什么？因为初始时，“归上”恰好只有$m$，"归下"恰好只有0。而之后触碰到上/下边界的所有曲线，都必定在m/0之后触碰，也必定在m/0之后成为"归上"/“归下"。只要一触碰，其函数值就会和m/0相同。于是本质上，我们是在维护$a=0$和$a=m$在任意时刻的取值。

　　形象地讲，这道题就像一个非弹性形变的柱子在管道里上下移动，柱子的”长度“就代表着那一部分从未触边的初始值，而上面和下面空出来的部分，代表着上面这些取值的答案都是柱子的”上端“，下面这些初始值的答案都是柱子的“下端”。为什么会空出来呢？因为曾经被“挤”在一起了，因此这一部分初始值在以后的取值都相同了。那么$up$和$dn$其实就是柱子的上下端。

# Summary

　　如果询问问的东西是同一种问题的不同出发点导出的某个状态，不妨考虑将所有出发点同步模拟，并离线回答询问。有可能一起模拟的过程会存在简化规模、合并不同状态的机会，就像自动机那一题

# Code

```c++
#include <cstdio>
using namespace std;
const int N=100005;
int n,m,q,a[N];
int l,r,sum,summn,summx;
inline int min(int x,int y){
	return x<y?x:y;
}
inline int max(int x,int y){
	return x>y?x:y;
}
inline void move(int &x,int d,int tim){
	x+=d*tim;	
	if(x>m) x=m;
	if(x<0) x=0;
}
void cont(int tim,int d){
	static int lasttim=0;
	int delta=tim-lasttim;
	lasttim=tim;
	sum+=delta*d;
	summn=min(summn,sum);
	summx=max(summx,sum);
	move(l,d,delta);
	move(r,d,delta);
}
int query(int x){
	if(x+summn<=0) return l;
	else if(x+summx>=m) return r;
	else return x+sum;
}
int main(){
	scanf("%d%d",&m,&n);
	for(int i=1;i<=n;i++)
		scanf("%d",a+i);
	scanf("%d",&q);
	l=0; r=m;
	sum=summx=summn=0;
	int i=1,d=-1,x,y;
	while(q--){
		scanf("%d%d",&x,&y);
		for(;i<=n&&a[i]<=x;cont(a[i++],d),d=-d);
		cont(x,d);
		printf("%d\n",query(y));
	}
	return 0;
}
```

