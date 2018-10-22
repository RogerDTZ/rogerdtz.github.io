---
layout: post
mathjax: true
title: 【AGC019D】Shift and Flip
date: 2018-10-22-15:11:00
tag: [方案特征,可做未做]
---
* content
{:toc}
# Description

　　有两个长度相等的01串$B$和$A$，你可以花费1的代价做下面的某一个操作：

* 将$B$循环左移一位或循环右移一位
* 若$A$的某一位是1，你可以把$B$此时对应的那位翻转

　　求最少花费多少代价，才能把$B$变得和$A$完全一样？（无解输出-1）



# Solution

　　我们把每个串看做一个01环

　　总要有个出发点，我们不如枚举$B$最后哪一位$B_x$对齐了$A_0$，这样，$B$的哪些位需要翻转就可以唯一确定，并直接计算翻转操作的次数了。我们只需要考虑：如何旋转$B$才能使得每一个需要翻转的位有机会翻转

　　我们可以对$A$上的每一个位置$i$处理出它与逆时针第一个1的距离$l_i$以及它与顺时针第一个1的距离$r_i$。看回$B$中需要翻转的位，它们肯定会要求在旋转的时候让它们与这两个选择的一种有重合的机会。

　　考虑逆时针旋转归零的过程，顺时针同理。如果某个需要翻转的位置逆时针第一个1与其距离不超过$x$，显然它们会在旋转的过程中自然地得到一个机会翻转，因此我们不需要额外考虑它。除去这些自然满足的需求位置，剩余位置要么要求归零后多转$l_i-x$再归零，要么要求开始旋转前先反向多转$r_i$再转回来。

　　问题转化为我们有$k$个二元组$(a_i,b_i)$，我们要从每一个二元组选一个数，请最小化这个值：选择的$a$的最大值加上选择的$b$的最大值

　　这个数没有什么很好的特性，我们直接暴力计算，钦定$a$不超过多少，然后计算$b$的最小值：按$a_i$从小到大排序，枚举$1\dots i$选$a$、$i+1\dots k$选$b$的答案，更新即可。实现上，排序+后缀max就可以实现

　　这样，顺时针归零的代价就是：需要翻转的位数+$x$+$2(maxa+maxb)$，单次计算复杂度为$O(n \log n)$。我们用同样的思路可以计算出反向旋转的代价

　　最后，取每种情况的最小值即可



# Summary

　　如果一种操作是另一种操作的前提，后者可能有固定的最少执行次数，只需要考虑前一种操作要如何走才能满足每一个固定操作的前提即可



# Code

```c++
#include <cstdio>
#include <algorithm>
#include <cstring>
using namespace std;
const int N=2010;
const int INF=1e9;
int n;
int a[N],b[N];
int originSum,targetSum;
inline int min(int x,int y){
    return x<y?x:y;
}
inline int max(int x,int y){
    return x>y?x:y;
}
void readData(){
    static char str[N];
    scanf("%s",str);
    n=strlen(str);
    for(int i=0;i<n;i++){
        b[i]=(str[i]=='1');
        originSum+=b[i];
    }
    scanf("%s",str);
    for(int i=0;i<n;i++){
        a[i]=(str[i]=='1');
        targetSum+=a[i];
    }
}
int l[N],r[N];
void init(){
    for(int i=0;i<n;i++) l[i]=INF,r[i]=INF;
    for(int t=0,i=0,d=INF;t<=3*n;t++,i=(i+1)%n){
        if(a[i])
            d=0;
        else
            d++;
        l[i]=min(l[i],d);
    }
    for(int t=0,i=n-1,d=INF;t<=3*n;t++,i=(i-1+n)%n){
        if(a[i])
            d=0;
        else
            d++;
        r[i]=min(r[i],d);
    }
}
struct Data{
    int l,r;
}s[N];
int scnt;
bool cmpL(const Data &a,const Data &b){
    return a.l<b.l;
}
int calc(int x){
    int cnt=0;
    int res=INF;
    static int back[N];
    scnt=0;
    for(int i=0;i<n;i++)
        if(b[i]!=a[(i-x+n)%n]){
            cnt++;
            if(l[i]>x)
                s[++scnt]=(Data){l[i]-x,r[i]};
        }
    sort(s+1,s+1+scnt,cmpL);
    back[scnt+1]=0;
    for(int i=scnt;i>=1;i--)
        back[i]=max(back[i+1],s[i].r);
    for(int i=0;i<=scnt;i++)
        res=min(res,x+(s[i].l*2)+(back[i+1]*2));
    scnt=0;
    for(int i=0;i<n;i++)
        if(b[i]!=a[(i-x+n)%n]){
            if(r[i]>(n-x))
                s[++scnt]=(Data){l[i],r[i]-(n-x)};
        }
    sort(s+1,s+1+scnt,cmpL);
    back[scnt+1]=0;
    for(int i=scnt;i>=1;i--)
        back[i]=max(back[i+1],s[i].r);
    for(int i=0;i<=scnt;i++)
        res=min(res,(n-x)+(s[i].l*2)+(back[i+1]*2));
    return res+cnt;
}
void solve(){
    int ans=INF;
    for(int i=0;i<n;i++)
        ans=min(ans,calc(i));
    printf("%d\n",ans);
}
int main(){
    readData();
    if(!targetSum){
        puts(!originSum?"0":"-1");
        return 0;
    }
    init();
    solve();
    return 0;
}
```

 