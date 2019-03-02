---
layout: post
title: AliceAndBob
date: 2018-08-06
mathjax: true
tags: 字符串---Trie
---
## Description

​	XSY1759


<!-- more -->
## Solution

​	肯定是离线对每个子树求答案。

​	考虑对每个子树建出所包含的值的Trie树，这点用启发式算法实现即可，即每个元素会被插入$\mathcal O(\log n)$次Trie树。

​	假设我们现在在求某棵子树的答案，并已得到这颗Trie树。我们相当于对子树中的每一个值$x$，求出$g(x)$表示$x$与子树中其他值异或起来的最小值。这棵子树的答案即$\max g(x)$。

​	定义一个权值$x$的分歧点$u$为：若$x$与权值$y$形成了$g(x)$，则$u$为Trie上$x$与$y$的第一个分歧点。

​	维护$f_i$表示对于分歧点为$i$的值$x$，$\max g(x)$是多少。考虑新插入一个值$x$，会对插入时走过的链上的$f$带来什么变化。

​	假设插入时遍历到了点$i$。若下一步的去向已经有了节点，这就说明：去向的子树中会有至少2个值，那么左边的所有值的分歧点一定不是$i$，因此对$f_i$无贡献，将$f_i$暂且设为-1；但若另一个方向恰好只包含1个权值$y$，那么我们在插入完成回溯到$i$时，用$y$这个值在去向子树中贪心走一遍，赋到$f_i$中。

​	若下一步的去向没有节点，那么如果另一个方向没有权值，则$f_i=-1$；若有，则用$x$在另一个方向贪心走一遍，赋到$f_i$上。

​	答案即所有$f_i$的$\max$，实现时计算完目前的$f_i$后，上推即可。

​	单次插入的复杂度为$\mathcal O(\log_2^2 n)$（插入链的长度为一个log，在每个位置都或许要贪心走一下）

​	所以总时间复杂度是$\mathcal O(n \log_2^3 n)$

​	

## Code	

```c++
#include <cstdio>
#include <vector>
#define pb push_back
using namespace std;
const int N=100005,B=17;
int n,w[N],m,ans[N];
vector<int> q[N];
int size[N],son[N],dfntm,dfn[N][2],who[N];
int h[N],tot;
struct Edge{int v,next;}e[N*2];
inline void addEdge(int u,int v){
	e[++tot]=(Edge){v,h[u]}; h[u]=tot;
	e[++tot]=(Edge){u,h[v]}; h[v]=tot;
}
namespace T{
	const int S=N*18;
	int rt,sz;
	int ch[S][2],cnt[S],val[S];
	int f[S];
	void clear(){
		sz=rt=0;
	}
	inline void pushup(int u){
		if(ch[u][0]) f[u]=max(f[u],f[ch[u][0]]);
		if(ch[u][1]) f[u]=max(f[u],f[ch[u][1]]);
	}
	int match(int u,int x,int k){
		int res=0;
		for(;k>=0;k--){
			int c=(x>>k)&1;
			if(ch[u][c]) u=ch[u][c];
			else u=ch[u][c^1],res+=(1<<k);
		}
		return res;
	}
	void insert(int &u,int x,int k){
		if(!u){
			u=++sz;
			f[u]=-1;
			ch[u][0]=ch[u][1]=0;
			cnt[u]=0;
		}
		cnt[u]++; val[u]=x;
		if(k==-1){
			f[u]=cnt[u]>1?0:-1;	
			return;
		}
		int c=(x>>k)&1;
		insert(ch[u][c],x,k-1);	
		f[u]=-1;
		if(ch[u][0]&&ch[u][1]){	
			if(cnt[ch[u][0]]==1)
				f[u]=max(f[u],(1<<k)+match(ch[u][1],val[ch[u][0]],k-1));
			if(cnt[ch[u][1]]==1)
				f[u]=max(f[u],(1<<k)+match(ch[u][0],val[ch[u][1]],k-1));
		}
		pushup(u);
	}
	int get(){return rt?f[rt]:-1;}
}
void readData(){
	scanf("%d",&n);
	for(int i=1;i<=n;i++) scanf("%d",w+i);
	int u,v;
	for(int i=1;i<n;i++){
		scanf("%d%d",&u,&v);
		addEdge(u,v);
	}
	scanf("%d",&m);
	for(int i=1,x;i<=m;i++){
		scanf("%d",&x);
		q[x].pb(i);
	}
}
void devide(int u,int fa){
	dfn[u][0]=++dfntm;
	who[dfntm]=u;
	size[u]=1;
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa){
			devide(v,u);
			size[u]+=size[v];
			if(!son[u]||size[v]>size[son[u]])
				son[u]=v;
		}
	dfn[u][1]=dfntm;
}
void solve(int u,int fa){
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa&&v!=son[u]){
			solve(v,u);
			T::clear();
		}
	if(son[u])
		solve(son[u],u);
	T::insert(T::rt,w[u],B);
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa&&v!=son[u]){
			for(int j=dfn[v][0];j<=dfn[v][1];j++)
				T::insert(T::rt,w[who[j]],B);
		}
	int best=T::get();
	int sz=q[u].size();
	for(int i=0;i<sz;i++) ans[q[u][i]]=best;
}
int main(){
	readData();
	devide(1,0);
	solve(1,0);		
	for(int i=1;i<=m;i++) printf("%d\n",ans[i]);
	return 0;
}

```

​	

​	