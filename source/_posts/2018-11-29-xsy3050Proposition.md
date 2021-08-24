---
layout: post
mathjax: true
title: Proposition
date: 2018-11-29 19:10:00
tag: [DP,FWT,表达式求值]
---
# Description

　　![](http://xsy.gdgzez.com.cn/JudgeOnline/upload/attachment/image/20170223/20170223194931_14046.png)

　　公式$Q$满足：

1. $Q$中的运算符共有$n$个
2. 不论$x_i$如何取值，$P$总为真

　　$n \le 70,\ k \le 4,\ $询问总数$q \le 500$


<!-- more -->
# Solution

　　如果直接从“是否恒为真”的角度去统计，做法会比较困难。考虑到$k$较小，我们可以通过一个取巧的方式：我们枚举所有$x$的取值情况，判断结果是否都为真即可

　　首先，考虑统计$Q$：总共有$2^k$种$x$的赋值方式，每一种方式都对应了$Q$是真还是假，因此每一个$Q$唯一对应了

一个$2^{2^k}$的二进制数，表示在每一种赋值方式中$Q$的真假。我们称这个二进制数位特征值。考虑DP出每一个特征值的$Q$的数量，具体而言：

　　设$f_{i,j}$表示：已经使用符号数为$i$、特征值为$j$的$Q$的数量

$$
f_{i,j}=f_{i-1,\neg j}+\sum_{k=0}^{i-1}\sum_{a\rightarrow b=j}f_{k,a}*f_{i-1-k,b}
$$

　　直接DP的复杂度为$O(n^22^{2^{k+1}}))$，无法处理$k=4$时的情况

　　注意到某一个$\sum$的形式是二元运算卷积，考虑使用FWT加速这个转移

　　$a \rightarrow b\Leftrightarrow\neg a \or b$

　　对于每一个$f_k$，我们记录对它进行FWT后的结果，再记录先对其下标取反后FWT的结果，转移时，第二个$\sum$就省去了枚举，线性扫一遍即可

　　时间复杂度$O(n^22^{2^k})$

　　考虑如何回答一个询问$P$：我们可以枚举$x$的所有取值，计算在当前枚举情况下，$Q$为真时的结果是否为真以及$Q$为假时的结果是否为真。这样，我们就可以得到对于符合要求的$Q$的相应限制：$Q$的特征值的某一位可以是什么（不可以是什么）。有了上述DP的结果，我们只需要枚举所有特征值并统计合法的$Q$总数即可

　　这一步要用到表达式求值



# Code

```c++
#include <cstdio>
#include <cstring>
using namespace std;
const int MOD=1e9+7;
const int L=4010;
int n,m;
int sz1,sz2;
inline int in(int x,int i){
    return (x>>i)&1;
}
inline int bit(int i){
    return (1<<i);
}
void fwt(int n,int *a,int f){
    int u,v;
    for(int i=2;i<=n;i<<=1)
        for(int j=0;j<n;j+=i)
            for(int k=0;k<(i>>1);k++){
                u=a[j+k];
                v=a[j+(i>>1)+k];
                if(!f)
                    a[j+(i>>1)+k]=(u+v)%MOD;
                else
                    a[j+(i>>1)+k]=(v-u)%MOD;
            }
}
void readData(){
    scanf("%d%d",&n,&m);
    sz1=(1<<m);
    sz2=(1<<sz1);
}
int f[75][66000],r[75][66000],g[75][66000];
void calcArray(int i){
    memcpy(g[i],f[i],sizeof(int)*sz2);
    fwt(sz2,f[i],1);
    for(int s=0;s<sz2;s++) r[i][(sz2-1)^s]=f[i][s];
    fwt(sz2,r[i],0);
}
void dp(){
    for(int i=0;i<m;i++)
        for(int s2=0;s2<sz2;s2++){
            bool flag=true;
            for(int s1=0;s1<sz1;s1++)
                if(in(s1,i)^in(s2,s1)){
                    flag=false;
                    break;
                }
            f[0][s2]+=flag;
        }
    fwt(sz2,f[0],0);
    calcArray(0);
    for(int i=1;i<=n;i++){
        memcpy(f[i],r[i-1],sizeof(int)*sz2);
        for(int k=0;k<i;k++)
            for(int s=0;s<sz2;s++) 
                (f[i][s]+=1ll*r[k][s]*g[i-1-k][s]%MOD)%=MOD;
        calcArray(i);
    }
}
void translate(int n,char *str,int &len,int *a){
    static int sta[L],top;
    len=0;
    top=0;
    for(int i=0;i<n;i++){
        if(str[i]=='(')
            sta[++top]='(';
        else if(str[i]==')'){
            while(sta[top]!='(')
                a[++len]=sta[top--];
            top--;
        }
        else if(str[i]=='x'||str[i]=='Q')
            a[++len]=(str[i]=='x')?(str[++i]-'1'):m;
        else{
            while(top&&sta[top]!='(')
                a[++len]=sta[top--];
            sta[++top]=str[i];
            if(str[i]=='-')
                i++;
        }
    }
    for(;top;top--)
        if(sta[top]!='(')
            a[++len]=sta[top];
}
bool express(int len,int *a,int xv,bool qv){
    static bool sta[L];
    static int top;
    top=0;
    for(int i=1;i<=len;i++)
        if(a[i]<=m)
            sta[++top]=(a[i]<m)?in(xv,a[i]):qv;
        else{
            if(a[i]=='~')
                sta[top]=(!sta[top]);
            else{
                bool y=sta[top--];
                bool x=sta[top--];
                sta[++top]=(!x)|y;
            }
        }
    return sta[top];
}
void answerQuery(){
    int m,ans;
    static char str[L];
    static int a[L],len;
    static int can[20];
    scanf("%d",&m);
    for(int i=1;i<=m;i++){
        scanf("%s",str);
        translate(strlen(str),str,len,a);
        for(int s=0;s<sz1;s++){
            can[s]=0;
            can[s]+=express(len,a,s,false);
            can[s]+=2*express(len,a,s,true);
        }
        ans=0;
        for(int s2=0;s2<sz2;s2++){
            bool flag=true;
            for(int s1=0;s1<sz1;s1++)
                if(!in(can[s1],in(s2,s1))){
                    flag=false;
                    break;
                }
            if(flag)
                (ans+=f[n][s2])%=MOD;
        }
        printf("%d\n",ans>=0?ans:ans+MOD);
    }
}
int main(){
    readData();
    dp();
    answerQuery();
    return 0;
}
```

