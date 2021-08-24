---
title: 【CF666】Monster Invaders
mathjax: true
date: 2020-08-31 22:36:06
tags: 博弈论
---

# Description

有$n$堆石子，每堆有$a_i$个。两个人轮流操作，每次从一堆非空的石子堆取走一个，且不能选择上一个人操作过的石子堆。最后一个能操作的人胜利。

给定局面，求先手胜还是先手负。

多组数据。

<!-- more -->

# Solution

观察到特殊情况：如果有一堆石子数$a_k$大于剩余所有元素之和，那么先手先取第$k$堆，后手只能取其他的某一堆，先手再取第$k$堆...最后一定先手胜

如果局面不是这种特殊情况，那么每一个操作者一定不会去操作非最大的元素，不然就有可能在下一轮给对面出现特殊情况，就输了

所以双方会一直对峙，最终胜负由总石子数的奇偶性确定

# Code

```c++
#include <cstdio>
#include <algorithm>

typedef long long LL;

const int N = 1000000 + 10;

int n;
int r1, r2, r3, d;
int a[N];
LL b[N][2], s[N][2];

void Init(){
	scanf("%d", &n);
	scanf("%d%d%d%d", &r1, &r2, &r3, &d);
	for(int i = 1; i <= n; i++)
		scanf("%d", &a[i]);
}

void Prework(){
	for(int i = 1; i <= n; i++){
		b[i][0] = 1ll * std::min(r1, r3) * a[i] + r3;
		b[i][1] = std::min(1ll * r2, 1ll * std::min(r1, r3) * a[i] + r1) + std::min(r1, std::min(r2, r3));
		s[i][0] = std::min(s[i - 1][0] + b[i][0], 1ll << 61);
		s[i][1] = s[i - 1][1] + std::min(b[i][0], b[i][1]);
	}
}

void Solve(){
	LL lf[2] = {-d, b[1][0]};
	LL minf = lf[0];
	LL ans = 1ll * d * (n - 1) + s[n][0];
	for(int i = 2; i <= n; i++){
		LL nf = d + std::min(lf[1] + b[i][0], minf + 3ll * d * (i - 1) + s[i][1]);
		lf[0] = lf[1];
		lf[1] = nf;
		minf = std::min(minf, lf[0] - 3ll * d * (i - 1) - s[i - 1][1]);
		if(i < n){
			ans = std::min(ans, lf[0] + 1ll * d * ((n - i + 1)  * 2 - 1) + b[n][0] + s[n - 1][1] - s[i - 1][1]);
			ans = std::min(ans, lf[0] + 1ll * d * ((n - i + 1)  * 2 + 1) + b[n][1] + s[n - 1][1] - s[i - 1][1]);
		}
	}
	printf("%lld\n", std::min(lf[1], ans));
}

int main(){
	Init();
	Prework();
	Solve();
	return 0;
}
```

