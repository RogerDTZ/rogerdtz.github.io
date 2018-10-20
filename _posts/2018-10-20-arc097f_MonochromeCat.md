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

　　由于此时树上的每一个点都是必要的，因此在行走的过程中，每个点至少会被遍历一次，这让我们联想到了路径覆盖树的形式。猜想是否总存在一种从某个叶子出发、在某个叶子结束的路径，满足操作步数最优。具体来说，我们从树上的一个叶子出发，按最优的顺序（dfn序）逐个走向每一个叶子，每走一步都相当于执行一次1.操作；在这个基础上，对于每一个点，考虑其被执行1.操作的次数以及初始颜色后，我们可以唯一决定是否要对其额外进行一次2.操作

　　观察这个形式得出：除了选定的起始叶子和终止叶子的路径上的边只单向经过一次，其余边都往返经过两次。考虑在确定起点终点时，用每条边都经过两次时的答案，调整到当前的答案



# Summary

　　题目要求我们使用某一些操作执行最少次数来达成目标，一种思路是探究操作的规律和方向，一种思路是如果确定终止局面后计算步数的形式是某一种模型，我们直接DP填终止局面求步数最小值即可

　　问题形式如果是两个经典模型的叠加，考虑原模型的性质在叠加模型中是否也适用

　　两个排列通过交换相邻元素，最少步数等于终止排列相对于原排列的逆序对个数



# Code

```c++
#include <cstdio>
using namespace std;
const int N=2010;
const int INF=1e9;
int n;
int p[2][N];
int preSum[2][N][N*2];
inline void updateMin(int &x,int y){
	x=(y<x)?y:x;
}
void readData(){
	scanf("%d",&n);
	static char str[5];
	int x;
	for(int i=1;i<=n*2;i++){
		scanf("%s%d",str,&x);
		p[str[0]=='W'][x]=i;
	}
}
void initPrefix(){
	for(int k=0;k<2;k++){
		for(int j=n;j>=1;j--){
			for(int i=1;i<=n*2;i++){
				preSum[k][j][i]=preSum[k][j+1][i];
				if(i>=p[k][j])
					preSum[k][j][i]++;
			}
		}
	}
}
int f[N][N];
void dp(){
	for(int a=0;a<=n;a++)
		for(int b=0;b<=n;b++)
			f[a][b]=INF;
	f[0][0]=0;
	for(int i=0;i<2*n;i++){
		for(int a=0,b;a<=i;a++){
			b=i-a;
			if(a<=n&&b<=n){
				if(a<n) // fill a+1
					updateMin(f[a+1][b],f[a][b]+preSum[0][a+2][p[0][a+1]-1]+preSum[1][b+1][p[0][a+1]-1]);
				if(b<n) // fill b+1
					updateMin(f[a][b+1],f[a][b]+preSum[0][a+1][p[1][b+1]-1]+preSum[1][b+2][p[1][b+1]-1]);
			}
		}
	}
	printf("%d\n",f[n][n]);
}
int main(){
	readData();
	initPrefix();
	dp();
	return 0;
}
```

 