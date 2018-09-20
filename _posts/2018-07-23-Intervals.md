---
layout: post
title: Intervals
date: 2018-07-23
mathjax: true
tag: DP
---
* content
{:toc}
## Description

​	在一个长度为m的序列中选出n个区间，这些区间互不包含，且至少有一个区间的左端点为x。

​	问有多少种方案，注意交换两个区间的顺序视为不同方案。

​	答案很大，输出模1000000007后的值。

## Input

​	一行三个整数n,m,x

 ## Output

​	一行一个整数，表示答案 

## Sample Input

​	2 3 3

## Sample Output

​	6

## HINT

​	对于30%的数据，n*m<=20

​	对于100%的数据，n*m<=100000

​	**（实际上，$n,m\le 400$）**





## Solution

​	尝试使用DP解决。

​	每一个区间的构成分两次事件：从某位置开始，并于某一位置关闭。

​	我们想象一下从左往右扫描的过程，当前扫描位置的左端有许多等待关闭的区间，因为区间不可重叠，我们可以得到两个性质：首先显然区间的开始位置不可共用；其次如果我们要关闭一个区间，必然关闭的是开始位置最靠前的区间，因此任意时刻关闭区间的选择是唯一的。

​	设$f_{i,j,k}​$表示当前进行到第$i​$位，已经引出了$j​$个区间（不管是否关闭），并且有$k​$个区间等待关闭。

​	由$f_{i,j,k}$出发，有4种转移：（i+1处是否开启一个区间）\*（i+1处是否关闭最靠前的区间），转移即可。

​	如果i+1即下一个位置是$x$，则只能进行（i+1处必须开启一个区间）*（i+1处是否关闭最靠前的区间）=2种转移。



## Code

```c++
#include <cstdio>
#include <cstring>
using namespace std;
const int MOD=1e9+7;
int n,m,x;
int f[2][405][405];
inline int mul(int x,int y){return 1LL*x*y%MOD;}
inline void upd(int &x,int y){(x+=y)%=MOD;}
inline void swap(int &x,int &y){x^=y^=x^=y;}
int main(){
    scanf("%d%d%d",&m,&n,&x);   
    int u=0,v=1;    
    f[u][0][0]=1;
    for(int i=0;i<n;i++){
        for(int j=0;j<=m;j++)
            for(int k=0;k<=m;k++)
                if(f[u][j][k]){
                    if(j<m) upd(f[v][j+1][k],f[u][j][k]);
                    if(j<m&&k<m) upd(f[v][j+1][k+1],f[u][j][k]);
                    if(i+1!=x&&k) upd(f[v][j][k-1],f[u][j][k]);
                    if(i+1!=x) upd(f[v][j][k],f[u][j][k]);
                }
        swap(u,v);
        memset(f[v],0,sizeof f[v]);
    }
    int mt=1;
    for(int i=1;i<=m;i++) mt=mul(mt,i);
    printf("%d\n",mul(f[u][m][0],mt));
    return 0;
}
```

