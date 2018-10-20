---
layout: post
mathjax: true
title: 【ARC096E】Sorted and sorted
date: 2018-10-20-12:00:00
tag: [DP,逆序对]
---
* content
{:toc}
# Description

　　有$n$个白球，标号$1\dots n$。同理有$n$个黑球

　　现在这$2n$个球被排成了一行

　　每次你可以交换相邻的两个球。问至少要操作多少次，才可以使得局面中相同颜色的球标号递增

　　$n \le 2000$



# Solution

　　一开始总是在想探究具体操作有什么规律

　　实际上，应该从全局上看。考虑一个排列，若只使用交换相邻元素的方式排序，则最少交换次数等于排列的逆序对个数。这个结论可以推广：对于一些元素，它们组成了一个排列，若给出目标排列，则达到目标的最少交换次数等于这样的有序对$(a,b)$的对数：$a$与$b$在初始时的先后顺序与终止时的先后顺序不同

　　因此，如果我们确定了终止时的局面，最小步数是确定的。考虑到终止局面必定是两个递增的序列嵌套在一起，因此我们使用DP填写终止局面，并求相对于初始局面的逆序对最小值

　　设$f_{i,j}$表示终止局面的前$i+j$位，已经填写了白球的$1\dots i$，黑球的$1 \dots j$，前$i+j$位相对于原序列的逆序对个数最少是多少

　　转移显然，枚举下一位是$白_{i+1}$还是$黑_{j+1}$，然后直接查询这个新元素在原序列位置的左边有多少还未填的元素，就等于新填入元素带来的逆序对个数



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

 