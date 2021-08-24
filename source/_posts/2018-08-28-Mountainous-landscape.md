---
layout: post
title: Mountainous landscape
date: 2018-08-28
mathjax: true
tag: [二分答案,凸包]
---
## Description

现在在平面上给你一条折线 $P_1P_2 \cdots P_n$ 。 $x$ 坐标是严格单调递增的。对于每一段折线 $P_iP_{i+1}$ ，请你找一个最小的 $j$ ，使得 $j \gt i$ 且CJB走在 $P_iP_{i+1}$ 上能看到折线 $P_jP_{j+1}$ 的任何一个点。注意，CJB的高度无限趋于0但不可忽略。也就是说，请找一条编号最小的折线 $P_jP_{j+1}$ 使得 $j \gt i$ 且线段 $P_jP_{j+1}$相交。


<!-- more -->
## Solution

首先手玩。

考虑每一条射线$\alpha=(P_i,P_{i+1})$的答案，其实就是最小的$j$，满足$j>i$且$P_{j+1}$严格在该射线上方。

有效的、需要考虑的$P_{j+1}$，一定在由$(i,n]$这些点构成的凸包上。我们相当于要判定一条射线$\alpha$与凸包是否有交，并找到交线的具体位置。

第一个问题很好解决，二分凸包上最逼近射线$\alpha$斜率的点，若其在射线上方则凸包与射线有交，否则直接无解。

关键是第二个问题。我们知道射线与凸包有交，甚至可以知道具体是哪一条凸包边与射线相交，却不知道是哪一条原边与射线有交，无法输出答案。我们发现这个凸包的信息已经不足以解决我们的问题了，但我们可以二分继续做：如果按相同方法判定左凸包也与射线有交，那么显然答案在左边，递归左凸包计算，并返回其的答案；否则，只能到右凸包里寻找答案。

单次询问复杂度$\mathcal O(log^2)$。

关键思路是无法确定具体方案的时候，考虑利用存在性二分答案。另一个Tips是有关线段树的二分问题，不要总想着用二分套线段树，而应该想想能否用线段树上二分，后者一般是两个$log$，而前者是三个$log$。



## Code

```c++
#include <cstdio>
#include <vector>
#define pb push_back
using namespace std;
namespace IO{
	const int S=10000005;
	char buffer[S];
	int pos;
	void Load(){
		pos=0;
		fread(buffer,1,S,stdin);
	}
	char getChar(){
		return buffer[pos++];
	}
	int getInt(){
		int x=0,f=1;
		char c=getChar();
		while(c<'0'||c>'9'){if(c=='-')f=-1;c=getChar();}
		while('0'<=c&&c<='9'){x=x*10+c-'0';c=getChar();}
		return x*f;
	}
}
using IO::getInt;
const int N=100005;
const double EPS=1e-6;
typedef long long ll;
typedef vector<int> vi;
int n;
struct Dot{ int x,y; }a[N];
bool slope_dec(int i,int j,int k){
	return 1ll*(a[j].y-a[i].y)*(a[k].x-a[j].x)>1ll*(a[j].x-a[i].x)*(a[k].y-a[j].y);
}
double slope(int i,int j){
	return 1.0*(a[j].y-a[i].y)/(a[j].x-a[i].x);
}
void getline(int i,int j,double &k,double &b){
	k=slope(i,j);
	b=a[i].y-k*a[i].x;
}
namespace SEG{
	const int S=N*2;
	int rt,sz;
	int ch[S][2];
	vi hull[S];
	int top[S];
	double k,b;
	void build(int &u,int l,int r){
		u=++sz;
		hull[u]=vi(r-l+2);
		top[u]=0;
		for(int i=l;i<=r+1;i++){
			while(top[u]>=2&&!slope_dec(hull[u][top[u]-2],hull[u][top[u]-1],i))
				top[u]--;
			hull[u][top[u]++]=i;
		}
		hull[u].resize(top[u]);
		if(l==r)
			return;
		int mid=(l+r)>>1;
		build(ch[u][0],l,mid);
		build(ch[u][1],mid+1,r);
	}
	void set(double _k,double _b){
		k=_k;
		b=_b;
	}
	int find(int u){
		int l=0,r=top[u]-2,mid;
		while(l<=r){
			int mid=(l+r)>>1;
			if(slope(hull[u][mid],hull[u][mid+1])>k)
				l=mid+1;
			else
				r=mid-1;
		}
		int who=hull[u][r+1];
		return (k*a[who].x+b+EPS<=a[who].y)?who-1:0;
	}
	int query(int u,int l,int r,int L,int R){
		int mid=(l+r)>>1;
		if(L<=l&&r<=R){
			if(l==r) 
				return find(u);
			if(!find(u))
				return 0;
			if(find(ch[u][0]))
				return query(ch[u][0],l,mid,L,R);
			else
				return query(ch[u][1],mid+1,r,L,R);
		}
		if(R<=mid)
			return query(ch[u][0],l,mid,L,R);
		else if(mid<L)
			return query(ch[u][1],mid+1,r,L,R);
		else{
			int left=query(ch[u][0],l,mid,L,mid);
			if(left)
				return left;
			return query(ch[u][1],mid+1,r,mid+1,R);
		}
	}
}
void readData(){
	n=getInt();
	for(int i=1;i<=n;i++)
		a[i].x=getInt(), a[i].y=getInt();
}
void solve(){
	for(int i=1;i<n;i++)
		if(i<=n-2){
			double k,b;		
			getline(i,i+1,k,b);
			SEG::set(k,b);
			printf("%d ",SEG::query(SEG::rt,1,n-1,i+1,n-1));
		}
		else 
			printf("0 ");
	puts("");
}
int main(){
	IO::Load();
	readData();		
	SEG::build(SEG::rt,1,n-1);
	solve();
	return 0;
}
```

