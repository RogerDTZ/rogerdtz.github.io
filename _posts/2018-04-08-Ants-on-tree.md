---
layout: post
title: Ants on tree
date: 2018-04-08
mathjax: true
---
* content
{:toc}

# Description

从前有一个策略游戏, 叫做 蚂蚁上树
游戏中有一棵 nn 个节点, 以 11 为根的有根树
初始始每个节点都为空,  游戏系统会进行两种操作 : 
1 x , 表示往 xx 节点放入一只睡眠状态中的蚂蚁 
2 x , 表示从 xx 节点取出一只睡眠状态中的蚂蚁 
**(对于操作2, 保证取出前该点至少有一只蚂蚁)**
每次操作后, 玩家要进行一轮游戏 : 
游戏有无穷的时间, 每一时刻, 系统会 **依次执行** 下述五个操作
1) 让玩家选择 任意多只(可以为 0 只) 睡眠状态中的蚂蚁
2) 所有亢奋状态的蚂蚁朝根结点方向移动一步
3) 若某一时刻 ≥2≥2只 **亢奋状态** 的蚂蚁处在同一节点, 游戏失败
4) 到达根节点的蚂蚁进入睡眠状态. 
5) 当前时刻被玩家选择的蚂蚁进入亢奋状态
6) 若所有蚂蚁都在根节点, 游戏结束
游戏不允许失败, 玩家的游戏目的是 : 使游戏结束时, 最后一只到达根节点的蚂蚁到达时间最早.
每轮游戏后, 系统会自动将树恢复成玩家该轮游戏前的局面, 然后进行下一次取/放蚂蚁的操作.



## Input

第一行两个数 n,mn,m 表示树的点数和操作数
第 2−n2−n 行, 第 ii 行一个数 fifi 表示 ii 节点的父亲
接下来 mm 行, 每行两个数表示系统的操作
若为 1 x , 表示往 xx 节点放入一只睡眠状态中的蚂蚁 
若为 2 x , 表示从 xx 节点取出一只睡眠状态中的蚂蚁 

## Output

输出 mm 行, 表示每轮游戏在最优策略下
最后一只到达根节点的蚂蚁到达的最早时间
**(特别的, 如果所有蚂蚁都在根节点, 或者没有蚂蚁, 输出 0)**

## Sample Input

```
4 5
1
2
2
1 1
1 3
1 4
1 2
2 3
```

## Sample Output

```
0
3
4
4
3
```

## HINT

对于样例输出第四行的解释 : 
第一时刻触碰位于 2, 3 的那只蚂蚁, 他们进入亢奋状态但没有移动
第二时刻触碰位于 4 的那只蚂蚁, 然后位于 2, 3 的蚂蚁分别爬到 1, 2,  然后爬到 1 的蚂蚁进入睡眠状态, 之后 4 进入亢奋状态.
第三时刻不触碰蚂蚁,  当前位于 2, 4 的蚂蚁分别爬到 1, 2,  爬到 1 的这只蚂蚁进入睡眠状态
第四时刻不触碰蚂蚁,  当前位于 2 的蚂蚁爬到 1 并进入睡眠状态,  然后游戏结束
数据范围 :
对于 30%的数据, $n,m≤3000$
对于另外 30% 的数据, $n≤5000$
对于另外 5% 的数据, 树的最大深度为 2
对于另外 10% 的数据, 数据的生成方式如下 $fi=rand()%(i−1)+1$
对于 100% 的数据 :
$2≤n≤10^5$
$1≤m≤10^5$
$1≤fi<i,i=2..n$

$1≤x≤n$



# Solution

​	这题看起来很复杂，考场上我想了个反推的模拟，还写挂了，看起来并不对。

​	考虑每个蚂蚁往上走的过程，是一激活就停不下来的。那么如果两只蚂蚁到达根节点的时间相同，那么它们必定在某一处会相撞。

​	那么问题等价于为每一只蚂蚁挑一个至少为其深度的到达时间，使得每只蚂蚁的到达时间唯一，且最大时间最小。

​	我们应该按深度从小到大考虑每一个深度$i$的$sum_i$只蚂蚁，给同一深度的$sum_i$只蚂蚁挑连续一段的到达时间$[i,i+sum_i)$

​	可是我们发现，不同深度挑选的区间一旦有重复，就意味着有蚂蚁会同时刻到达终点，也就是早就会撞上，因此挑选的区间必须互相不重叠。

​	那么每个深度的区间开头位置往往取不到$i$，因为前面会顺延下来造成推移。

​	答案求的其实是最靠后的一个区间的结束位置，记每个深度为$i$的节点到达时间区间为$[start_i,start_i+sum_i)$，那么实际上$ans=max \{ start_i+sum_i-1\}$。

​	然而维护$start$太难了，下面证明实际上$ans=max\{i+a_i-1\},i>0$，其中$a_i$表示深度大于等于$i$的蚂蚁个数。

​	首先根节点的蚂蚁全部忽略掉不考虑。

​	设深度为$i$的蚂蚁们被分配到的区间是最后的。

​	如果开头位置取到了$i$，那么$i+a_i-1$可以贡献到答案，并且发现其他情况时都不可能贡献到比这个还大的位置。

​	如果开头位置没有取到$i$，说明这个区间被顺延了，根据贪心策略，这个区间一定紧挨着上一个区间，以此类推形成一个连通块。设连通块最前端的区间是给$j$取的，而且此区间的开始位置一定是最好情况：刚好取到$j$，所以$j+a_j-1$可以贡献到$i$的结尾位置。

​	所以用线段树维护一下$i+a_i-1$就好了。

```c++
#include <cstdio>
#include <set>
using namespace std;
const int N=100005,M=200005;
namespace IO{
	const int SIZE=10000000;
	char buffer[SIZE];
	int pos;
	void init(){fread(buffer,1,SIZE,stdin);}
	char getch(){return buffer[pos++];}
	int getInt(){
		char c=getch(); int x=0,f=1;
		while(c<'0'||c>'9'){if(c=='-')f=-f;c=getch();}
		while('0'<=c&&c<='9'){x=x*10+c-'0';c=getch();}
		return x*f;
	}
}
int n,m,antcnt,a[N];
int h[N],tot,dep[N],maxdep;
struct Edge{int v,next;}e[M];
struct Data{
	int x;
	Data(){}
	Data(int _x){x=_x;}
	friend bool operator < (const Data &a,const Data &b){
		if(dep[a.x]!=dep[b.x])
			return dep[a.x]<dep[b.x];
		return a.x<b.x;
	}
};
set<Data> s;
inline int max(int x,int y){return x>y?x:y;}
inline void addEdge(int u,int v){e[++tot].v=v;e[tot].next=h[u];h[u]=tot;}
void dfs(int u,int fa){
	maxdep=max(maxdep,dep[u]);
	for(int i=h[u],v;i;i=e[i].next)
		if((v=e[i].v)!=fa){
			dep[v]=dep[u]+1;
			dfs(v,u);
		}
}
namespace SEG{
	int rt,sz,ch[N*2][2],maxs[N*2],tag[N*2];
	void addtag(int u,int x){
		maxs[u]+=x;
		tag[u]+=x;
	}
	inline void pushup(int u){maxs[u]=max(maxs[ch[u][0]],maxs[ch[u][1]]);}
	inline void pushdown(int u){
		if(tag[u]){
			addtag(ch[u][0],tag[u]);
			addtag(ch[u][1],tag[u]);
			tag[u]=0;
		}
	}
	void build(int &u,int l,int r){
		u=++sz;
		maxs[u]=r;
		if(l==r) return;
		int mid=(l+r)>>1;
		build(ch[u][0],l,mid);
		build(ch[u][1],mid+1,r);
	}
	void modify(int u,int l,int r,int L,int R,int x){
		if(L<=l&&r<=R){
			addtag(u,x);
			return;
		}
		pushdown(u);
		int mid=(l+r)>>1;
		if(L<=mid) modify(ch[u][0],l,mid,L,R,x);
		if(mid<R) modify(ch[u][1],mid+1,r,L,R,x);
		pushup(u);
	}
	int query(int u,int l,int r,int L,int R){
		if(L<=l&&r<=R) return maxs[u];
		pushdown(u);
		int mid=(l+r)>>1;
		if(R<=mid) return query(ch[u][0],l,mid,L,R);
		else if(mid<L) return query(ch[u][1],mid+1,r,L,R);
		else return max(query(ch[u][0],l,mid,L,mid),query(ch[u][1],mid+1,r,mid+1,R));
	}
}
int main(){
	freopen("input.in","r",stdin);
	IO::init();
	n=IO::getInt();
	m=IO::getInt();
	for(int i=2;i<=n;i++){
		int x=IO::getInt();
		addEdge(x,i);
	}
	dfs(1,0);
	int opt,x;
	SEG::build(SEG::rt,0,maxdep);
	for(int i=1;i<=m;i++){
		opt=IO::getInt();
		x=IO::getInt();
		if(opt==1){
			a[x]++; antcnt++;
			if(a[x]==1) s.insert(Data(x));
		}
		else{
			a[x]--; antcnt--;
			if(!a[x]) s.erase(s.find(Data(x)));
		}
		if(x!=1)
			SEG::modify(SEG::rt,0,maxdep,0,dep[x],opt==1?1:-1);
		if(!antcnt||a[1]==antcnt)
			printf("0\n");
		else{
			set<Data>::iterator pos=s.end();
			pos--;
			printf("%d\n",SEG::query(SEG::rt,0,maxdep,0,dep[(*pos).x]));
		}
	}
	return 0;
}
```



​	