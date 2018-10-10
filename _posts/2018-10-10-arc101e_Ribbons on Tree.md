---
layout: post
mathjax: true
title: 【ARC101E】Ribbons on Tree
date: 2018-10-10-21:48:00
tag: [DP---树形DP,容斥原理]
---
* content
{:toc}
# Description

　　给定一棵有$n$个节点的树，满足$n$为偶数。初始时，每条边都为白色

　　现在请你将这些点两两配对成$\frac n2$个无序点对。每个点对之间的的路径都会被染成黑色

　　求有多少种配对方案，使得树上没有白边？

　　$n \le 5000$



# Solution

　　直接DP的话，设$f_{u,i}$表示$u$子树内配对完成，有$i$个点向外请求配对。这个的复杂度大概是$O(n^3)$的，因为合并两个子树的地方的复杂度降不下来，必须要枚举完成

　　于是我们想到了容斥的做法：我们可以枚举一些边，钦定它们不能被染黑，然后统计此时的配对方案数。最后，按枚举的边数的奇偶性确定容斥系数即可

　　具体地说，记总边集为$E$，我们相当于求：

$$
ans=\sum_{T\subseteq E}(-1)^{\mid T \mid}F(T)
$$

　　其中$F(T)$表示钦定$T$中的边不可以染黑时，全局的配对方案数

　　考虑单独计算$F(T)$的过程：我们可以视为从原树中将这些边删去，对于剩余的$\mid T \mid +1$个连通块，记其大小分别为$s_1,s_2,...,s_{\mid T\mid +1}$，则易得：

$$
F(T)=\sum_{i=1}^{\mid T\mid +1}g(s_i)\\
g(n)=\begin{cases}
(n-1)(n-3)...1 &2\mid n\\
0 &\text{else}
\end{cases}
$$

　　考虑使用树形DP同步计算出所有的$T$的$F(T)$之和

　　考虑到中间进行计算的时候很有可能使用两个数相乘得到方案的方式转移，因此我们不能将正负两种情况的数记录在一个值里边，必须分开DP，因此状态中要体现当前已删边条数的奇偶性

　　同时，DP时我们要考虑是否要划分出一个新的连通块。这意味着我们要记录这个连通块的大小。方便起见，我们记录当前树根$u$所在的连通块大小即可

　　至此我们得出状态：$f_{u,i,0/1}$表示以$u$为根的子树中，$u$所在连通块大小为$i$时，当$u$子树中的所有边组成$E$时，对于0：$\mid T \mid$为偶数；1：$\mid T \mid$为奇数，$\sum_{T \subseteq E}F(T)$为多少

　　考虑DP中合并当前根$u$和新子树$v$的过程，我们枚举$i$和$j$，合并$f_{u,i}$与$f_{v,j}$：

1.  保留边$(u,v)$：$f_{u,i,a}*f_{v,j,b}\rightarrow f'_{u,i+j,a\;\text{xor}\;b}$
2.  删去边$(u,v)$：$f_{u,i,a}*f_{v,j,b}*g(j)\rightarrow f'_{u,i,a\;\text{xor}\;b\;\text{xor}\;1}$

　　注意，我们只在断掉一个连通块的最上面一条边时，才将$g$乘入方案数中，如2.所示，因为在合并一个连通块的过程中，我们还无法确定其$g$值

　　最后，统计$\sum_if_{1,i,0}g(i)$和$\sum_{i} f_{1,i,1}g(i)$，就可以得到容斥式子中，正贡献之和、负贡献之和的绝对值，直接做减法即可。由于上一段提到的原因，$f$贡献进$\sum$时要乘上$g$



# Code

```c++
#include <cstdio>
using namespace std;
typedef long long ll;
const int N=5010;
const int MOD=1e9+7;
int n;
int h[N],tot;
struct Edge{
	int v,next;
}e[N*2];
int g[N];
int size[N];
int f[N][N][2];
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
}
void init(){
	g[0]=1;
	for(int i=2;i<=n;i+=2)
		g[i]=1ll*g[i-2]*(i-1)%MOD;
}
void dp_dfs(int u,int fa){
	size[u]=1;
	f[u][1][0]=1;
	static ll c[N][2];
	for(int I=h[u],v;I;I=e[I].next)
		if((v=e[I].v)!=fa){
			dp_dfs(v,u);
			for(int i=1;i<=size[u]+size[v];i++) c[i][0]=c[i][1]=0;
			for(int i=1;i<=size[u];i++)
				for(int j=1;j<=size[v];j++)
					for(int a=0;a<2;a++)
						for(int b=0;b<2;b++){
							static int t;
							t=1ll*f[u][i][a]*f[v][j][b]%MOD;
							c[i+j][a^b]+=t;
							if(!(j&1))
								c[i][a^b^1]+=1ll*t*g[j]%MOD;
						}
			size[u]+=size[v];
			for(int i=1;i<=size[u];i++){
				f[u][i][0]=c[i][0]%MOD;
				f[u][i][1]=c[i][1]%MOD;
			}
		}
}
int solve(){
	int sum[2]={0,0};
	for(int i=0;i<=n;i+=2)
		for(int j=0;j<2;j++)
			(sum[j]+=1ll*f[1][i][j]*g[i]%MOD)%=MOD;
	int res=(sum[0]-sum[1])%MOD;
	return res<0?res+MOD:res;
}
int main(){
	readData();
	init();
	dp_dfs(1,0);
	printf("%d\n",solve());
	return 0;
}
```

