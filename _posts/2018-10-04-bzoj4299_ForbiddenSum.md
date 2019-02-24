---
layout: post
mathjax: true
title: 【BZOJ4299】ForbiddenSum
date: 2018-10-04-15:58:00
tag: [数据结构---主席树,思考题,好题,凑数]
---

* content
{:toc}
# Description

![img](http://xsy.gdgzez.com.cn/JudgeOnline/upload/attachment/image/20150405/20150405135244_95164.jpg)

![img](http://xsy.gdgzez.com.cn/JudgeOnline/upload/attachment/image/20150405/20150405135326_88408.jpg)



# Solution

　　考虑如何计算一个确定集合的值

　　将集合内的元素从小到大排序后，我们从前往后逐个加入新元素，考虑答案的改变：

* 集合为空时，值显然为1

* 现在我们已知$ans_{i-1}$，要求出$ans_i$，记第$i$个数数为$a_{i}$。设前$i$个数构成集合的值为$ans_i$，这意味着前$i$个元素可以组成$[0,ans_i)$中的所有数。考虑新加入的$a_i$对可行区间的影响：

	* $a_i \le ans_{i-1}$：我们发现$[0,ans_{i-1})$这一段会整体向右平移$a_i$，从而使得$[a_i,ans_i+a_i)$也可以被组合出来。我们还发现，在保证$a$递增时，$ans_{i-1}+a_i$这个位置就是$ans_{i}$

	* $a_i>ans_{i-1}$：想要把$a_i$这个数和之前的数组合生成新的数，最小也只能得到$a_i$，而$a_i>ans_{i-1}$，这意味着$ans_{i-1}$这个位置依然不能被组合得到。因此$ans_{i}=ans_{i-1}$。

		由于递增，显然之后的所有$ans$都将等于$ans_{i-1}$

　　由此，若$1...i$都没有出现过第二种情况，则$ans_i$可以表示为$1+\sum_{k=1}^ia_k$

　　想要求答案，我们应找到一个最小的$i$，使得$a_i>1+\sum_{k=1}^{i-1}a_k$，此时$ans_{i-1}$就是答案

　　在$O(n)$的做法，我们逐步模拟每一个$i$，判断第二种情况并停止即可

　　然后我就懵逼了，这玩意没有二分性，于是我就想到了用树套树之类的方法维护区间是否存在不合法......到头说来，树套树根本不支持在两维的情况下实现合并两端区间信息的操作。我就卡在这里卡到了比赛结束

　　实际上，我们不仅可以一步一步地模拟，还可以跳着模拟。具体来说，原本我们从$ans_{i-1}$推到$ans_i$，要考虑$a_i$是否不超过$1+\sum_{k=1}^{i-1}a_k$；而现在我们可以将结论推广，对于$j>i$，只要其满足$a_j \le 1+\sum_{k=1}^{i}a_k$，我们就可以从$ans_i$直接跳到$ans_j$。具体要怎么分析呢？直接套用第一种情况的思路：只要新值不超过当前的第一段可行范围，这个值加入集合后，就可以帮助第一段可行范围向右无缝增长；更何况处理到新值时，可行范围还在不断增长，所以显然如果一次性处理到新值，我们在中途都不会触碰到界限。

　　我们发现第一种模拟方法其实是狭义的，而后者是广义的，前者包含于后者

　　这样一来，我们可以每次跳多步，以此来加速过程。假设当前$1...i$都没有发生第二种情况，也就是我们拿着$ans_i$，转移时，我们找到一个最大的$j$使得$a_j\le ans_i$，并令$ans_j$为$ans_i+\sum_{k=i+1}^ja_k$，对$j$重复上述过程，直到没有新的$j$满足情况、或者走完了整个序列位置

　　如此操作，步数有没有保证呢？有，而且很快。转移的长度（或者说是速度）取决于$ans_i$，当$ans_i$足够大时，$j$就直接溜完了整个序列；如果想要将其卡到最慢，也就是每次令$j=i+1$，$a_{j+1}$必须大过$ans_i$，也就是翻一倍。由此，步数不会超过$O(\log \sum a)$，完全可以接受

　　至于二分$j$的过程，我们使用一个主席树维护区间权值和，在二分出最大的$a_j$时顺带统计$a_j$左边的权值之和，以准备更新$ans$。实际实现计算$ans_j$时不需要用$ans_i+\sum_{k=i+1}^j$辅以“判断小于等于某个值得最大值”这种计算方式，太过麻烦；我们不需要真正去找到$j$，直接按上述方法，二分时计算出出权值在$ans_i$以内的值之和。如果这个和等于$ans_i$说明本次操作一点长进都没有，$j=i$，退出；否则将$ans$设为这个新的和。我们相当于把下标的概念模糊掉，以方便实现

　　

# Summary

　　树套树一般不能在要求其统计两维数据的情况下，指定第一维时在第二维里合并数据

　　如果感觉$O(n)$一步一步模拟已经足够简单无法简化时，考虑转移本身是否不一定要逐个元素走，而是存在一种广义的转移：找到一个当前可转移的最远状态，使得中间经历的所有转移都合法，并直接模拟中间的所有转移



# Code

```c++
#include <cstdio>
#include <algorithm>
using namespace std;
const int N=100010;
int n;
int a[N];
int dcnt,d[N];
namespace SEG{
	const int S=N*18;
	int rt[N],sz;
	int ch[S][2];
	int sum[S];
	inline int copy(int u){
		int v=++sz;
		ch[v][0]=ch[u][0]; ch[v][1]=ch[u][1];
		sum[v]=sum[u];
		return v;
	}
	void insert(int u,int &v,int l,int r,int pos){
		v=copy(u);
		sum[v]+=d[pos];
		if(l==r)
			return;
		int mid=(l+r)>>1;
		if(pos<=mid)
			insert(ch[u][0],ch[v][0],l,mid,pos);
		else 
			insert(ch[u][1],ch[v][1],mid+1,r,pos);
	}
	int findright(int u,int v,int l,int r){
		if(sum[v]-sum[u]==0)
			return -1;
		if(l==r)
			return l;
		int mid=(l+r)>>1;
		if(sum[ch[v][1]]-sum[ch[u][1]])
			return findright(ch[u][1],ch[v][1],mid+1,r);
		else
			return findright(ch[u][0],ch[v][0],l,mid);
	}
	int binary_find(int u,int v,int l,int r,int r_val){ 
		if(sum[v]-sum[u]==0)
			return -1;
		if(l==r)
			return d[l]<=r_val?(sum[v]-sum[u]?l:-1):-1;
		int mid=(l+r)>>1;
		int res=-1;
		if(r_val<=d[mid])
			res=binary_find(ch[u][0],ch[v][0],l,mid,r_val);
		else
			res=binary_find(ch[u][1],ch[v][1],mid+1,r,r_val);
		if(res==-1&&d[mid]<=r_val)
			res=findright(ch[u][0],ch[v][0],l,mid);
		return res;
	}
	int query(int u,int v,int l,int r,int L,int R){
		if(L>R)
			return 0;
		if(L<=l&&r<=R)
			return sum[v]-sum[u];
		int mid=(l+r)>>1;
		if(R<=mid)
			return query(ch[u][0],ch[v][0],l,mid,L,R);
		else if(mid<L)
			return query(ch[u][1],ch[v][1],mid+1,r,L,R);
		else
			return query(ch[u][0],ch[v][0],l,mid,L,mid)+query(ch[u][1],ch[v][1],mid+1,r,mid+1,R);
	}
}
void readData(){
	scanf("%d",&n);
	for(int i=1;i<=n;i++) scanf("%d",&a[i]);
}
void Diz(){
	for(int i=1;i<=n;i++) d[i]=a[i];
	sort(d+1,d+1+n);
	dcnt=unique(d+1,d+1+n)-d-1;
	for(int i=1;i<=n;i++)
		a[i]=lower_bound(d+1,d+1+dcnt,a[i])-d;
}
void buildSeg(){
	for(int i=1;i<=n;i++) 
		SEG::insert(SEG::rt[i-1],SEG::rt[i],1,dcnt,a[i]);
}
int solve(int l,int r){
	int res=1,d_cur,d_last=0;
	while(true){
		d_cur=SEG::binary_find(SEG::rt[l-1],SEG::rt[r],1,dcnt,res);
		if(d_cur==-1||d_cur<=d_last)
			break;
		res+=SEG::query(SEG::rt[l-1],SEG::rt[r],1,dcnt,d_last+1,d_cur);
		d_last=d_cur;
	}
	return res;
}
void answerQuery(){
	int q,l,r;
	scanf("%d",&q);
	for(int i=1;i<=q;i++){
		scanf("%d%d",&l,&r);
		printf("%d\n",solve(l,r));
	}
}
int main(){
	readData();
	Diz();
	buildSeg();
	answerQuery();
	return 0;
}
```

