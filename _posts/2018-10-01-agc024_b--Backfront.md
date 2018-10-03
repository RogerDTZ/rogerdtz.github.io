---
layout: post
mathjax: true
title: 【AGC024B】Backfront
date: 2018-10-01-10:41:43
tag: [贪心]
---
* content
{:toc}
# Description

 　　给一个长度为$n$的序列，满足其为一个排列

 　　现要求用最少步数将其排序，每一步可以将一个数提到序列的首位或者末尾

 　　求最少步数？

 　　$1 \le n \le 2 * 10^5$



# Solution

　　考虑最暴力的整理过程：对于$i=n...1$，如果$i$不在首位，则将其提到首位

　　但这样只使用了前提的操作；同样地，我们可以提出一个后提的做法。但显然两者都不是最优的

　　考虑综合二者，发现每个合法的整理都是这样一个过程：将一部分数字前提，一部分数字后提，而未操作的数字自然呈连续上升状态。我们发现，前提的数字一定属于形如$[1,x]$的区间，后提的数字一定属于形如$[y,n]$的区间。因此，重复$i=x...1$和$i=y...n$做前提后提即可。相应地，我们要保证$(x,y)$这些数具有一个在原序列上的相对顺序与权值相对顺序相同的性质。

　　规定了$x$和$y$且$(x,y)$的数字满足性质时，步数上界显然是$x+(n-y+1)$。但有没有可能更小呢？就是说会不会在前提的过程中减少了后提的次数、在后提的时候减少了前提的次数呢？我们发现在这种情况发生时，$(x,y)$这个区间总是能向两端扩展。也就是只要我们找到了$(x,y)$区间的最大宽度，我们一定能覆盖到所有最优情况

　　接下来使用一个$O(n)$的DP计算最长连续上升子序列的长度就可以了



# Summary

　　如果题目给出了一个目标，要求你使用某种方式构造最优解，而又感觉无从下手时，不妨先找到每一种可行方案的共同点和本质模式，然后在模式的层面上想怎么构造才能最优。

# Code

```c++
#include <cstdio>
#include <unordered_map>
using namespace std;
const int N=200010;
int n;
int a[N],f[N];
inline void updmax(int &x,int y){
	x=(x>=y)?x:y;
}
void readData(){
	scanf("%d",&n);
	for(int i=1;i<=n;i++) scanf("%d",&a[i]);
}
void solve(){
	int ans=0;
	for(int i=n;i>=1;i--){
		f[a[i]]=f[a[i]+1]+1;
		updmax(ans,f[a[i]]);
	}
	printf("%d\n",n-ans);
}
int main(){
	readData();
	solve();
	return 0;
}
```
