---
layout: post
title: 【AGC011E】Increasing Number
date: 2018-09-25-16:53:00
category: 2017国家集训队作业
tag: [思考题]
---

* content
{:toc}
# Description

　　如果一个十进制非负整数的所有数位从高位到低位是不减的，我们称它为“上升数”，例如$1558,11,3,0$都是上升数，而$10,20170312$则不是

　　给定整数$N$，求最小的$k$使得$N$能被表示为$k$个上升数之和

　　$1 \le N \le 10^{50000}$



# Solution

　　题目让我们把$N$拆分成尽可能少的上升数之和

　　注意到上升数之和并没有什么可以深究的地方，因此我们应该转而研究上升数本身

　　观察上升数的构成，它的每个数位随着数位的降低而不降。这启发我们：如果对于一个上升数，把每个数位的数看成该位置的高度，整个数看起来就像是一个右斜的金字塔

　　而且金字塔的高度不会超过9

　　那么每个上升数，不就是9个数位全为1的数之和么？

　　我们称由$k$个$1$组成的数为$f_k$。特别地，$f_0=0$。我们有通项公式
$$
f_i=\frac{10^i-1}{9}
$$
　　则每个上升数可以表示成$\sum_{i=1}^9f_{a_i}\;\;\;(0\le a_i)$

　　考虑答案为$k$时，$k$个上升数组成了$N$。我们发现了一个等式，等式通过转化经常能发现玄机。我们把它写出来：
　　
$$
\begin{aligned}
N&=\sum_{i=1}^k\sum_{j=1}^9f_{a_{i,j}}\\
&=\sum_{i=1}^k\sum_{j=1}^9\frac{10^{a_{i,j}}-1}{9}\\
9N+9k&=\sum_{i=1}^k\sum_{j=1}^910^{a_{i,j}}\\
9N+9k&=\sum_{i=1}^{9k}10^{b_i}
\end{aligned}
$$

　　倒数第二步时，我们发现这两个求和，等价于$9k$次单独操作，因此将$a_{i,j}$展平成$b_i$，问题等价

　　这是什么意思呢？右边和式每加一个项，相当于和的某一位+1

　　那么加$9k$次，等价于这个数数位之和恰好等于$9k$

　　那么问题变成，寻找最小的$k$，使得$9N+9k$的数位之和等于$9k$

　　注意到第一步我们表示上升数时，$a_i$可以取到0，这意味着表示每个上升数所需的$f$小于等于$9$

　　将概念顺移下来，判定条件就会变成：$9N+9k$的位数只要不超过$9k$即可

　　使用高精度模拟枚举$k$从1开始往上走的过程。每次对$9N$这个数加上9，时间复杂度均摊$O(1)$。可以证明，当$k$超过$N$的位数时，等式就不可能成立了。因此枚举的上界也有保证。总复杂度为$O(n)$



# Code

```c++
#include <cstdio>
#include <cstring>
using namespace std;
const int N=10000050;
int a[N];
int dsum;
void readData(){
    static char inp[N];
    scanf("%s",inp+1);
    a[0]=strlen(inp+1);
    for(int i=1;i<=a[0];i++)
        a[i]=inp[a[0]-i+1]-'0';
}
void multiply(int x){
    int k=0;
    for(int i=1;i<=a[0];i++){
        a[i]=x*a[i]+k;
        k=a[i]/10;
        a[i]%=10;
    }
    while(k){
        a[++a[0]]=k%10;
        k/=10;
    }
}
void plus(int x){
    int k=0;
    for(int i=1;i<=a[0];i++){
        dsum-=a[i];
        a[i]=a[i]+(i==1?x:0)+k;
        k=a[i]/10;
        a[i]%=10;
        dsum+=a[i];
        if(!k)
            return;
    }
    while(k){
        a[++a[0]]=k%10;
        k/=10;
        dsum+=a[a[0]];
    }
}
int solve(){
    for(int i=1;i<=a[0];i++) dsum+=a[i];
    for(int k=1;;k++){
        plus(9);
        if(dsum<=9*k)
            return k;
    }
}
int main(){
    readData();
    multiply(9);
    printf("%d\n",solve());
    return 0;
}
```

