---
layout: post
title: 【ARC076F】Exhausted
date: 2018-08-17
mathjax: true
tag: 贪心
categories: [2017国家集训队作业]
---
* content
{:toc}
## Description

​	[题目链接](https://arc076.contest.atcoder.jp/tasks/arc076_d)



## Solution

​	场上尝试使用优化建图网络流实现，结果T到怀疑人生。

​	鉴于这是个匹配问题，考虑用贪心做一下。

​	先退一步，想一下如果每一个人只有$[1,l_i]$单个限制时怎么匹配。

​	我们应该对所有人按$l_i$从小到大排序。从前往后扫一次，能放则放，就能做到最大匹配。

​	再加上$[r_i,m]$这一种选择，要怎么做？

​	上面的贪心法，如果只考虑靠左端的匹配，是正确的；但不被匹配的人，显然要单独拉出，做一次按$r$的与上一个样的贪心。我们能不能在进行左端贪心的时候，保证剩余的人在第二次右端贪心时全局最优呢？有一种直接的想法，就是剩余人的$r$要尽可能的小，这样才能最大化匹配成功率。

​	依然按$l_i$从小到大排序，能放则放；如果不能放呢？这时候我们要考虑多一些东西了，我们还有一种选择，就是用当前的人**替代**掉之前选择的一个人。如果当前人能替代已选择的某一个人，应该满足一个条件，就是当前人的$r$要大于已经选择的某一个人的$r$。如果这样一个人存在，显然用将那个人的位置空出来，让当前人进去，而让那个人不填更加优，因为这样可以使未填的人的$r$尽可能小，最大化匹配成功率。

​	因此对于已选择的人，关于$r$维护一个小根堆。如果能加则加，否则和堆顶的$r$进行比较，能替换则替换。

​	最后对于未选择的人，进行一次从右向左对于$r$的贪心即可。



## Code

```c++
#include <cstdio>
#include <algorithm>
#include <queue>
using namespace std;
const int N=200005;
int n,m;
struct People{
    int l,r,id;
    friend bool operator < (People a,People b){
        return a.r>b.r;
    }
}a[N],b[N];
bool inq[N];
int cnt;
priority_queue<People> q;
bool cmpl(const People &a,const People &b){
    return a.l<b.l;
}
bool cmpr(const People &a,const People &b){
    return a.r>b.r;
}
int main(){
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++)
        scanf("%d%d",&a[i].l,&a[i].r);
    sort(a+1,a+1+n,cmpl);
    int nowl=0,nowr=m+1,last;
    for(int i=1;i<=n;i++){
        a[i].id=i;
        if(nowl+1<=a[i].l){
            nowl++;
            q.push(a[i]);
            inq[i]=true;
        }
        else if(!q.empty()){
            People best=q.top();
            if(a[i].r>best.r){
                q.pop();
                inq[best.id]=false;
                q.push(a[i]);
                inq[i]=true;
            }
        }
    }
    for(int i=1;i<=n;i++)
        if(!inq[i])
            b[++cnt]=a[i];
    sort(b+1,b+1+cnt,cmpr);
    for(int i=1;i<=cnt&&nowr-1!=nowl;i++)
        if(nowr-1>=b[i].r)
            nowr--;
    printf("%d\n",n-(nowl+(m-nowr+1)));
    return 0;
}
```

