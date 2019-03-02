---
layout: post
title: 【AGC014E】 Blue and Red Tree
tag: [并查集]
categories: 2017国家集训队作业
date: 2018-09-04
mathjax: true
---
## Description

给定一棵$n$个节点的蓝边树，再给定一棵$n$个节点的红边树。请通过若干次操作将蓝树变成红树。操作要求和过程如下：

1.选定一条边全为蓝色的路径；

2.将路径上的一条蓝边断开，并将路径的两个端点之间连一条红边。

问能否实现目标。


<!-- more -->
## Solution

我们发现这个过程只会做恰好$n-1$次，因为每次都会减少一条蓝边、增加一条红边。

考虑红树上的一条边$(u,v)$，显然在蓝树上操作时，我们选择了一条以$u$和$v$为端点的路径，才造就了这条边。因此红树上的每条边和蓝树上的每次操作一一对应。

我们相当于要以某种顺序执行这些操作：对于操作$(u,v)$，保证操作前$u$和$v$连通，然后我们断开$u$到$v$路径上的一条边。问所有操作能否执行完。

如果我们要执行一个操作A，那么对于当下该路径上的所有边，我们只能断开只有A占用的边。形式化地讲，如果对于每一个未执行操作，都将路径上的边+1；那么当前我们只能断开边权为1的边。

我们想用树剖的方式维护并模拟这个操作，但这非常难实现。因为寻找边权为1的边这个操作，或许还需要树套树来维护，非常麻烦。

正难则反，考虑整个过程反向进行：

对于最后一次操作，树上一定只剩下一条边$(u,v)$，且最后一次操作也是$(u,v)$。考虑倒数第二次操作，它要么是$(u,z)$，$z$是从最后一次操作的$(u,v)$这条边延伸出的另一条边$(v,z)$，要么是另成的一条独立的边$(x,y)$.....

手玩一会，我们发现：如果把两棵树建在一起，那么每次可操作的边，就是两棵树中都存在的边。操作完之后，我们把操作边的两个端点缩点，继续重复上述操作。如果操作能够执行恰好$n-1$次，则有解，否则无解。

接下来关键是怎么实现。我们根据想的方法，将两棵树实实在在地建在一起。用$n$个set维护每个点的出边到达点，用一个map维护两两点之间边的数量。如果某两个点之间的连边数量等于2，则肯定这条边在两棵树中间都出席那了，我们将这两个点组成的边塞进队列里，表示这个队列里的边在当前都可以操作。接下来，我们不断从队头拿出边，进行缩点操作：启发式合并set，删边或加边直接操作set和map就好。

时间复杂度$\mathcal O(n \log^2 n)$



## Code

```c++
#include <cstdio>
#include <set>
#include <queue>
#include <map>
#define mp make_pair
using namespace std;
typedef long long ll;
typedef pair<int,int> pii;
typedef set<int> si;
typedef set<int>::iterator sit;
const int N=100005;
int n;
int bl[N];
si s[N];
queue<pii> q;
map<ll,int> g;
inline void swap(int &x,int &y){
	x^=y^=x^=y;
}	
int find(int u){
	return bl[u]==u?u:(bl[u]=find(bl[u]));
}
inline ll getID(int x,int y){
	if(x>y) swap(x,y);
	return 1ll*n*y+x;
}
void addEdge(int u,int v){
	s[u].insert(v);
	s[v].insert(u);
	ll eid=getID(u,v);
	int t=g[eid]+1;
	g[eid]++;
	if(t==2)
		q.push(mp(u,v));
}
void removeEdge(int u,int v){
	s[u].erase(v);
	s[v].erase(u);
	g.erase(getID(u,v));
}
void readData(){
	scanf("%d",&n);
	int u,v;
	for(int i=1;i<=(n-1)<<1;i++){
		scanf("%d%d",&u,&v);
		addEdge(u,v);
	}
}
bool solve(){
	for(int i=1;i<=n;i++) bl[i]=i;
	for(int i=1;i<n;i++){
		int u,v;
		if(q.empty())
			return false;
		u=q.front().first;
		v=q.front().second;
		q.pop();
		u=find(u); 
		v=find(v);
		if(s[u].size()>s[v].size())
			swap(u,v);
		bl[u]=v;
		removeEdge(u,v);
		for(sit i=s[u].begin(),j;i!=s[u].end();i=j){
			j=i;
			j++;
			int x=*i;
			x=find(x);
			removeEdge(u,x);
			addEdge(v,x);
		}
	}
	return true;
}
int main(){
	readData();
	puts(solve()?"YES":"NO");
	return 0;
}
```



