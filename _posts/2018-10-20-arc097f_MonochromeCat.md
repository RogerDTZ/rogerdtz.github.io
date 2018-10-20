---
layout: post
mathjax: true
title: 【ARC097F】Monochrome Cat
date: 2018-10-20-16:42:00
tag: [DP---树形DP,方案特征]
---
* content
{:toc}
# Description

　　有一棵$n$个节点的树，每个节点初始时要么是白色，要么是黑色

　　现在你可以任意挑一个点站上去，任意做下列两种操作的一种，直到所有点变为黑色为止：

1. 将当前所在点反色
2. 走到与当前点$u$相邻的某个点$v$，然后令$v$反色

　　问最少执行多少次操作才能达成目标？

　　$n \le 10^5$



# Solution

　　首先，排除冗余部分：如果这棵无根树的某一个子树内没有任何白点，我们完全可以忽略其不计，因为没有必要走进去，也没有必要从里面走出来

　　我们将冗余子树删去后，必定得到一棵叶子全白的树，原问题等价于在这棵树上进行操作

　　由于此时树上的每一个点都是必要的，因此在行走的过程中，每个点至少会被遍历一次，这让我们联想到了路径覆盖树的形式。猜想是否总存在一种从某个叶子出发、在某个叶子结束的路径，满足操作步数最优。具体来说，我们从树上的一个叶子出发，按最优的顺序（先走完子树内叶子再出去）逐个走向每一个叶子，每走一步都相当于执行一次1.操作；在这个基础上，对于每一个点，考虑其被执行1.操作的次数以及初始颜色后，我们可以唯一决定是否要对其额外进行一次2.操作

　　为什么最优解一定有起终都在叶子的路径呢？如果最优点的路径的两端不在叶子上，我们可以重复将端点下移，直到到达叶子节点为止。拿终点举例，起点同理：

![]({{site.url}}/assets/images/arc097f/01.jpg)

　　（虽然说不转化好像也能做，不过这样看问题会比较舒服）

　　观察这个形式得出：除了选定的起始叶子和终止叶子的路径上的边只单向经过一次，其余边都往返经过两次。考虑在确定起点终点时，用从某一个点出发再走回这个点的答案，调整到当前的答案

　　后者的答案中，我们恰好做$2(n-1)$次1.操作。记一个点的奇偶性为其度数的奇偶性，则2.操作的操作次数即奇黑的点数+偶白的点数。算出这个值$S$

　　如果确定一条出发点和终止点为两个不同叶子节点的路径，记其边长为$len$，则答案等于$S$减去$len$次1.操作（不需要返回），减去路径上奇黑的点数和偶白的点数后（撤销），再加上路径上偶黑的点数和不算终点的奇白的点数，因为这条路径上的每个点（除了终点）相对于原来都少做了一次1.操作，因此原来要额外做2.的现在不用做，原来不用做2.的现在要额外做。由于终点的“进入次数”并没有变化，所以它和$S$中的状态是一样的

　　现在我们只需要统计过叶路径的最大值。一条过叶路径的权值定义为（记$cnt$为点数，即$len+1$）

$$
(cnt-1)+(奇黑+偶白)-(偶黑+(奇白-1))\\
=cnt+(奇黑+偶白)-(偶黑+奇白)
$$

　　树上DP记录每一个$u$到叶子节点的这一段路径的权值最大值，在每一个点考虑合并两个最大值即可



# Code

```c++
#include <cstdio>
#include <cstdlib>
using namespace std;
const int N=100010;
const int INF=1e9;
int n,originN;
int deg[N];
int h[N],tot;
struct Edge{
	int v,next;
}e[N*2];
int col[N]; // 0:black 1:white
int whiteSum,firstWhite;
inline int min(int x,int y){
	return x<y?x:y;
}
inline int max(int x,int y){
	return x>y?x:y;
}
void addEdge(int u,int v){
	e[++tot]=(Edge){v,h[u]}; h[u]=tot;
	e[++tot]=(Edge){u,h[v]}; h[v]=tot;
}
void readData(){
	scanf("%d",&n);
	originN=n;
	int u,v;
	for(int i=1;i<n;i++){
		scanf("%d%d",&u,&v);
		addEdge(u,v);
	}
	static char str[N];
	scanf("%s",str+1);
	for(int i=1;i<=n;i++){
		col[i]=(str[i]=='W');
		whiteSum+=col[i];
		if(col[i]&&!firstWhite)
			firstWhite=i;
	}
}
bool del[N];
bool haveWhite[N];
int originNeed;
int maxMinus;
int f[N];
void deleteUseless(int u,int fa){
	haveWhite[u]=(col[u]==1);
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa){
			deleteUseless(v,u);
			if(!haveWhite[v]){
				n--;
				del[v]=true;
			}
			else{
				haveWhite[u]|=haveWhite[v];
				deg[u]++;
				deg[v]++;
			}
		}
}
int getRoot(){
	for(int u=1;u<=originN;u++)
		if(!del[u]&&deg[u]>1)
			return u;
	return -1; // unexpected
}
void dfs(int u,int fa){
	int type=(col[u]&1)^(deg[u]&1);
	originNeed+=(type==1);
	f[u]=-INF;
	bool haveSon=false;
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa&&!del[v]){
			haveSon=true;
			dfs(v,u);
			if(f[u]!=-INF)
				maxMinus=max(maxMinus,f[u]+f[v]);
			f[u]=max(f[u],f[v]+1+(type==1)-(type==0));
		}
	if(!haveSon) // leaf
		f[u]=1+(type==1)-(type==0);
}
void check(){
	if(whiteSum<=1){
		printf("%d\n",whiteSum);
		exit(0);
	}
	if(n==2){
		puts("2");
		exit(0);
	}
}
int main(){
	readData();
	check();
	deleteUseless(firstWhite,0);
	check();
	originNeed=(n-1)*2; // for each edge twice
	maxMinus=-INF;
	int rt=getRoot();
	dfs(rt,0);
	printf("%d\n",originNeed-maxMinus);
	return 0;
}
```

 