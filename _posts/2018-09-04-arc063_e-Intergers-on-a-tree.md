---
layout: post
title: 【ARC063E】 Intergers on a tree
date: 2018-09-04
tag: [思考题]
categories: 2017国家集训队作业
mathjax: true
---
* content
{:toc}
## Description

给定一棵$n$个点的树，其中若干个点的权值已经给出。现在请为剩余点填入一个值，使得相邻两个点的差的绝对值恰好为1。请判断能否实现，如果能，请将方案一并输出。



## Solution

卡了一会，终于想出来了。

首先从深度奇偶性和权值奇偶性这一方面考虑：如果所有已知点的权值与深度的奇偶性关系不全一样，则一定无解。

然后考虑怎么构造。如果用已填点将树分成若干块，显然每一块是独立的，现在考虑单独一块。

直接想有一点困难，所以我们先尝试考虑每一个空点$u$能填什么数：考虑这一个块中的一个有值点，其权值为$x$，如果它到$u$距离为$2k$，那么$u$的权值范围就有$x-2k,x-2k+2,...,x,...,x+2k-1,x+2k$；如果它到$u$距离为$2k+1$，那么$u$的权值范围就为$x-2k-1,x-2k+1,x-2k+3...,x+2k-1,x+2k+1$。

考虑所有的有值点，那么$u$的权值范围就是这些范围的交$S$。也就是说，只要$u$填$S$中的权值，单看$u$而言就一定能填出满足所有有值点的方案。若$S$为空则全局无解。

可是对于每个空点，我们到底选$S$中的哪个权值填入呢？注意到如果随便填的话，可能会出现跳跃的问题。

我画了几个例子。构造例子的方法是先弄一棵填好权值的合法树，再指定有值位置。当我用上述方法考虑空点的$S$时，我们发现：当且仅当将每一个点都取其$S$中的最小值时有解（或都取最大值），原问题才有解，这种填法即一种合法方案；否则无解。

口胡证明：考虑一个点$u$的取值集合$S$，它其实是一个范围$[l,r]$，但中间的取值是每隔1取一个的。对于任意一个与$u$相邻的点$v$，记其权值范围为$[l',r']$，则其权值边界的跨度都不会超过1，即有$l'=l\pm1$和$r'=r \pm1$，注意两者不是互不相关的。为什么？$S$记录的是每一个有值点$x$到这个点对应的权值范围的交。走多一步，意味着空隙翻转（原来是跳一次取一次的），对于走近了的$x$，其权值范围以$x$为中心向内空隙翻转，对于走远了的$x$，其权值范围向外空隙翻转；也就是一个多了两端，一个少了两端。仔细分析，$S$的边界变化也不会超过1.

如果有解，那么这样填数一定能够满足条件------我们是贴着边界走的，而有值点本身也在边界上。如果这样填都不能满足，显然全局无解。

因此我们对每个点取$S$的最小值，判断是否合法即可。

至于$S$最小值的计算方法，这里有一个技巧：对于每个点$u$，我们直接维护所有有值点$x$对应的范围的左端点的最大值，即$x-dis$的最大值。这样一来，如果真正意义上$S$交集不为空，那么这个值就是$u$的取值。否则，这个值无论如何都会使得后面的判定出错不合法，毕竟取值不满足所有的有值点。


​	



## Code

```c++
#include <cstdio>
#include <cstring>
using namespace std;
const int N=100005;
const int INF=1e9;
int n,m;
int a[N];
int h[N],tot,dep[N];
struct Edge{
	int v,next;
}e[N*2];
int f[N],g[N],ans[N];
inline int max(int x,int y){
	return x>y?x:y;
}
inline int abs(int x){
	return x>=0?x:-x;
}
void addEdge(int u,int v){
	e[++tot]=(Edge){v,h[u]}; h[u]=tot;
	e[++tot]=(Edge){u,h[v]}; h[v]=tot;
}
void readData(){
	scanf("%d",&n);
	int u,v;
	for(int i=1;i<n;i++){
		scanf("%d%d",&u,&v);
		addEdge(u,v);
	}
	memset(a,-1,sizeof a);
	scanf("%d",&m);
	for(int i=1;i<=m;i++){
		scanf("%d%d",&u,&v);
		a[u]=v;	
	}
}
void mark_dfs(int u,int fa){
	dep[u]=dep[fa]+1;
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa)
			mark_dfs(v,u);
}
bool firstCheck(){
	mark_dfs(1,0);
	int flag=-1;
	for(int u=1;u<=n;u++)
		if(a[u]!=-1){
			if(flag==-1)
				flag=(a[u]^dep[u])&1;
			else if(((a[u]^dep[u])&1)!=flag)
				return false;
		}
	return true;
}
void dp_dfs1(int u,int fa){
	f[u]=(a[u]!=-1)?a[u]:-INF;
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa){
			dp_dfs1(v,u);
			f[u]=max(f[u],f[v]-1);
		}
}
bool dp_dfs2(int u,int fa){
	if(a[u]!=-1)
		g[u]=a[u];
	ans[u]=(a[u]!=-1)?a[u]:max(f[u],g[u]);
	if(fa&&abs(ans[u]-ans[fa])!=1)
		return false;
	static int ch[N],cnt;			
	static int l[N],r[N];
	cnt=0;
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa)
			ch[++cnt]=v;
	l[0]=g[u]+1; r[cnt+1]=-INF;		
	for(int i=1;i<=cnt;i++)
		l[i]=max(l[i-1],f[ch[i]]);
	for(int i=cnt;i>=1;i--)
		r[i]=max(r[i+1],f[ch[i]]);
	for(int i=1;i<=cnt;i++)
		g[ch[i]]=max(l[i-1],r[i+1])-2;
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa){
			if(dp_dfs2(v,u)==false)
				return false;
			if(abs(ans[u]-ans[v])!=1)
				return false;
		}
	return true;
}
bool solve(){
	dp_dfs1(1,0);
	g[1]=-INF;
	if(dp_dfs2(1,0)==false)
		return false;
	puts("Yes");
	for(int i=1;i<=n;i++)
		printf("%d\n",ans[i]);
	return true;
}
int main(){
	readData();
	if(!firstCheck()||!solve()){
		puts("No");
		return 0;
	}
	return 0;
}
```

