---
layout: post
mathjax: true
title: 【ARC100D】Equal Cut
date: 2018-10-11 16:47:00
tag: [二分,贪心,思考题]
---
# Description

　　给定一个长度为$n$的序列$a_i$，你要将这个序列划分为4段非空的连续子序列

　　定义一段子序列的权值为其所有元素之和，请最小化这四段子序列的极差

　　$n \le 2 * 10^5,\ a_i\le 10^9$


<!-- more -->
# Solution

　　尝试使用二分答案并钦定最小值以限制最大值的套路，但失败。因为我们无法在确认划分方案之前就定下最小值，所以这样根本没有出路

　　由于段数很少，我们考虑直接枚举三个切点的位置。直接枚举时间复杂度为$O(n^3)$，我们需要更快的枚举方式。更快的方式一般是先确定某一个位置，再在这个位置确定的前提下，快速求解其他位置的最优方案。自然，先确定最左切点或最右切点的做法并不能很好地简化问题；因此，我们考虑枚举中间的切点

　　设中间切点的位置为$p$，其应该满足$p \in (1,n)$。此时左切点的选择范围是$[1,p)$，右切点的选择范围是$(p,n)$

　　考虑如何最小化每一段的和的极差：假设我们确定了左切点的位置，那么我们可以得到两个段序列的和；确定右边后同理。我们可以证明：只要左切点选择的位置使得其产生的两个序列极差最小，且右切点选择的位置使得其产生序列的极差也最小，那么此时全局的4个序列的极差也是最小的

　　简单证明如下：由于某一边的两个值的和一定，因此如果一个值增大，那么另一个值必定减小；如果我们想让某一边的两个值极差最小，那么它们都会趋向于向和的一半靠拢。如果我们令左右两组数都往各自的中心靠拢以获得各自的最小极差，我们会发现，此时全局的最大值和最小值也会慢慢靠拢，且两组都靠拢时，全局的极差最小。可以发现，其余情况都没有上述情况优

　　因此我们只需要枚举中间的切点，在其左右各自二分出取最小极差时最大值和最小值，拿两个最大值的最大值减去两个最小值的最小值更新答案即可

　　时间复杂度$O(n \log n)$



# Summary

　　如果题目的决策步数是一个定值且较小，我们应该从直接枚举的方面入手

　　如果直接枚举行不通，考虑钦定一个比较关键的步骤的决策，然后用某种方法快速计算出此时做完其他决策后的最优解，并更新答案



# Code

```c++
#include <cstdio>
using namespace std;
typedef long long ll;
const int N=200010;
const ll LINF=1ll<<60;
int n;
ll s[N];
template<class T> void updmin(T &x,T y){
	x=(y<x)?y:x;
}
template<class T> T max(T x,T y){
	return x>y?x:y;
}
template<class T> T min(T x,T y){
	return x<y?x:y;
}
template<class T> T abs(T x){
	return x>=0?x:-x;
}
void readData(){
	scanf("%d",&n);
	for(int i=1;i<=n;i++){
		scanf("%lld",&s[i]);
		s[i]+=s[i-1];
	}
}
void find(int pl,int pr,ll &mn,ll &mx){
	int l=pl,r=pr-1,mid;
	while(l<=r){
		mid=(l+r)>>1;
		if((s[mid]-s[pl-1])>=(s[pr]-s[mid]))
			r=mid-1;
		else 
			l=mid+1;
	}
	ll best=LINF,x,y;
	x=s[l]-s[pl-1];
	y=s[pr]-s[l];
	if(abs(x-y)<best){
		best=abs(x-y);
		mn=min(x,y);
		mx=max(x,y);
	}
	if(l>pl){
		l--;
		x=s[l]-s[pl-1];
		y=s[pr]-s[l];
		if(abs(x-y)<best){
			best=abs(x-y);
			mn=min(x,y);
			mx=max(x,y);
		}
	}
}
void solve(){
	ll ans=LINF;
	ll lmn,lmx,rmn,rmx,cur;
	for(int p=2;p<n;p++){
		find(1,p,lmn,lmx);
		find(p+1,n,rmn,rmx);
		cur=max(lmx,rmx)-min(lmn,rmn);
		updmin(ans,cur);
	}
	printf("%lld\n",ans);
}
int main(){
	readData();
	solve();
	return 0;
}
```

