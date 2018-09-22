---
layout: post
title: 【AGC010D】 Decrementing
tag: [博弈论]
categories: [2017国家集训队作业]
date: 2018-09-11
mathjax: true
---
* content
{:toc}
## Solution

日常博弈论做不出来。



首先，数值全部为1的局面先手必败。

在接下来的过程中，我们只关注那些大于1的数值。

按照官方题解的思路，首先想一个简化版的问题：没有除的操作，其余相同。那么局面结果显然和所有值的和的奇偶性有关。

回到原问题。我们发现，当局面中有2个或更多奇数，其余为偶数时，我们对任意一个元素进行一次完整操作，仅仅会将一个元素从奇变偶，或从偶变奇。原因？只要有奇数存在，所有数的GCD必定是奇数。所以当全局除以GCD时，奇数还是奇数，偶数还是偶数，因为它们的2没有被除去。不论操作的是偶数还是奇数，都必定会留下至少一个奇数存在。因此变动也就只发生在操作的数上。暂且称之为A性质。

如果先手手上全是奇数，那么必败。全1时显然必败。根据A，先手对任意数进行操作，将会出现一个偶数，那么后手可以把这个偶数变回奇数。如此反复，必定先手败。

根据题目给的性质：初始时GCD为1。这意味着初始局面必定有1个或以上的奇数。

接下来，对局面按偶数的个数分类：

（1）有奇数个偶数：必胜。证明：先手先操作一个偶数，那么此时局面中有2+个奇数，以及偶数个偶数，符合A，则变化只发生在操作数上。如果后手操作一个偶数变奇数，那么先手再操作一个奇数变偶数；如果后手操作一个奇数变成偶数，那么先手可以再操作这个数变成奇数（既然后手能操作，那么操作前数肯定$\ge 3$）。如此进行，某个时刻后手操作前将会有没有偶数，即全为奇数。我们已经证明此时先手必败。

（2）有偶数个偶数：如果没有奇数，先手任意操作时，-1后出现一个奇数，大概理解为满足A，则都会使得后手有（1）的局面，即先手必败。如果有2+个奇数，此时满足A，先手任做一次操作，都会使后手有（1），先手必败。如果恰好有1个奇数，这时候我们无法推理什么，但是此时我们发现，如果先手操作某一个偶数，那么就直接输了，所以先手只有1种选择：操作那个奇数。于是问题就变成模拟了。我们递归处理，直到遇到上述情况位置。由于每次GCD至少是2，于是层数就是$\mathcal O(\log)$的。



在这稍微总结一下：博弈论题一般是要发现一些逼迫方法，并从这些角度来考虑必胜策略。



## Code

```c++
#include <cstdio>
#include <iostream>
using namespace std;
namespace IO{
    const int S=10000000;
    char buf[S];
    int pos;
    void load(){
        fread(buf,1,S,stdin);
        pos=0;
    }
    char getChar(){
        return buf[pos++];
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
int n;
int a[N];
void readData(){
    n=getInt();
    for(int i=1;i<=n;i++)
        a[i]=getInt();
}
int gcd(int x,int y){
    if(x<y) swap(x,y);
    for(int z=x%y;z;x=y,y=z,z=x%y);
    return y;
}
void simulate(int who){
    static int sum[2],oddpos;
    bool all1flag=true;
    sum[0]=sum[1]=0;
    for(int i=1;i<=n;i++)
        if(a[i]!=1){
            all1flag=false;
            sum[a[i]&1]++;
            if(a[i]&1)
                oddpos=i;
        }
    if(all1flag)
        throw who^1;
    if(sum[0]&1)
        throw who;
    if(sum[1]>1)
        throw who^1;
    if(sum[1]==0)
        throw who^1;
    a[oddpos]--;
    int g=-1;
    for(int i=1;i<=n;i++)
        if(a[i]!=1){
            if(g==-1)
                g=a[i];
            else
                g=gcd(g,a[i]);
        }
    for(int i=1;i<=n;i++)
        if(a[i]!=1)
            a[i]/=g;
    simulate(who^1);
}
int main(){
    IO::load();
    readData();
    try{
        simulate(1);
    }
    catch(int e){
        puts(e?"First":"Second");
    }
    return 0;
}
```

