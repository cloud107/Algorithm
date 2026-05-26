# 质数
不超过N的质数个数约为N/logN。
1. 试除法
2. 埃氏筛
```
bool is_prime(int x) {
    for(int i=2; i*i<=x; i++) {
        if(x%i==0) return false;
    }
    return true;
}
```
3. 线性筛(欧拉筛)
```
int prime[MAXN], cnt, v[MAXN];
void primes(int n) {
    for(int i=2; i<=n; i++) {
        if(!v[i]) prime[++cnt] = i;
        for(int j=1; j<=cnt && i*prime[j]<=n; j++) {
            v[i*prime[j]] = 1;
            if(i%prime[j]==0) break;//i的最小质因子是prime[j],所以i*prime[j]的最小质因子也是prime[j],如果不break,就会把i*prime[j+1]标记多次(因为i*prime[j+1]的最小质因子是prime[j],而不是prime[j+1])
        }
    }
}
```

# 约数
### 算术基本定理的推论

在算术基本定理中，若正整数 $N$ 被唯一分解为

$$
N=p_1^{c_1}p_2^{c_2}\cdots p_m^{c_m},
$$

其中 $c_i$ 都是正整数，$p_i$ 都是质数，且满足 $p_1<p_2<\cdots<p_m$，则 $N$ 的正约数集合可写作：

$$
\left\{p_1^{b_1}p_2^{b_2}\cdots p_m^{b_m}\right\},\quad \text{其中 }0\le b_i\le c_i.
$$

$N$ 的正约数个数为（$\prod$ 表示连乘积符号，与 $\sum$ 类似）：

$$
(c_1+1)(c_2+1)\cdots(c_m+1)=\prod_{i=1}^{m}(c_i+1).
$$

$N$ 的所有正约数的和为：

$$
(1+p_1+p_1^2+\cdots+p_1^{c_1})\cdots(1+p_m+p_m^2+\cdots+p_m^{c_m})
=\prod_{i=1}^{m}\left(\sum_{j=0}^{c_i}(p_i)^j\right)
$$
1. 试除法
2. 试除法的推论:一个数的约数个数<=2*sqrt(n)
3. 倍数法(与埃氏筛类似)
```
vector<int> factor[MAXN];
for(int i=1; i<=n; i++) {
    for(int j=i; j<=n; j+=i) {
        factor[j].push_back(i);
    }
}
```
4. 倍数法的推论:1~n每个数的约数个数的总和约为NlogN
5. 欧拉函数
$$
\varphi(n)=n\prod_{i=1}^{k}(1-\frac{1}{p_i})
$$
```
int phi(int n){//求欧拉函数 
	int ans=n;
	for(int i=2;i<=n/i;i++){
		if(n%i==0){
			ans=ans/i*(i-1);
			while(n%i==0) n/=i;
		}
	}
	if(n>1) ans=ans/n*(n-1);
	return ans;
}
```
6. 积性函数:如果n,m互质,$f(nm) = f(n)f(m)$,则$f$是积性函数,约数个数和约数和都是积性函数,欧拉函数也是积性函数
7. 一些性质
    1. 求1~n中每与n互质的数的和:
    $$
    \forall n>1,\ \sum_{\substack{1\le k\le n\\ \gcd(k,n)=1}} k=\frac{n\varphi(n)}{2}
    $$
    2. 更相减损术:gcd(a,b)=gcd(a-b,b);


### 刷题笔记

#### 题目 P1463 反素数
- 来源：洛谷
- 题目：给定正整数n，求不超过n的最大的反素数(反素数的定义:一个正整数的约数个数多于它前面所有正整数的约数个数)。
- 核心思路：
    - 不超过N的最大反素数就是不超过N的约数个数最多的数中最小的一个.
    - 1~N中每个数的质因子个数不会超过10个,且所有质因子的质数之和不会超过30.
    - x是反质数的必要条件是:x分解质因数为$2^{c_1}3^{c_2}5^{c_3}7^{c_4}11^{c_5}13^{c_6}17^{c_7} 19^{c_8}23^{c_9}29^{c_{10}}$，且$c_1\ge c_2\ge c_3\ge c_4\ge c_5\ge \cdots \ge c_{10} \ge 0$。
    **综上所述:** 使用dfs依次确定每个质因子的指数,满足单调递减总乘积不超过N,计算出对应的数和约数个数，并更新答案。
- 核心代码
```
void dfs(int u, int last, long long num, int cnt) {
    if(cnt>ans_cnt || (cnt==ans_cnt && num<ans)) {
        ans = num;
        ans_cnt = cnt;
    }
    ll res = num;
    for(int i=1; i<=last; i++) {
        if(primes[u] > n / res) break;
        dfs(u+1, i, num*prime[u]^i, cnt*(i+1));
    }
}
```
- 复盘：

---

#### 题目 P2261 余数求和
- 来源：洛谷
- 题目：给定正整数n和k，求$\sum_{i=1}^n k \mod i$。
- 核心思路：
    -  $ k \mod i = k - i \cdot \lfloor k / i \rfloor $,因此$\sum_{i=1}^n k \mod i = nk - \sum_{i=1}^n i \cdot \lfloor k / i \rfloor$。
    -  $ i\in[x,\lfloor k/\lfloor k / x \rfloor \rfloor] $时,$\lfloor k / i \rfloor$的值为$\lfloor k / x \rfloor$，因此可以枚举$x$，计算出对应的区间长度，并乘以$\lfloor k / x \rfloor$，最后加起来即可。
- 核心代码
```
for(int x=1; x<=k; x=gx+1) {
    int gx = k / x ? min(k / (k / x), n) : n;
    ans -= (gx - x + 1) * (k / x) * (x + gx) / 2;
}
```
- 复杂度：$O(\sqrt{k})$
- 复盘：

---

#### 题目 P1072 Hankson 的趣味题
- 来源：洛谷
- 题目：给出四个数a0,a1,b0,b1，求满足$\gcd(x,a0)=a1$且$\gcd(x,b0)=b1$的正整数x的个数。
- 核心思路：
    - 对于每一个质数p来说,a0,a1,b0,b1中p的质数分别是a,b,c,d;x中p的指数为mx
        根据最大公因数的定义:
        a>b|mx只能等于b
        ---|---
        a=b|mx>=a
        a<b|mx无解

        根据最小公倍数的定义:
        c<d|mx只能等于d
        ---|---
        c=d|mx<=d
        c>d|mx无解

        综上所述,有四种情况mx有解
        a>b|c<d|b=d|mx只能等于b且d
        -|-|-|-
        a>b|c=d|b<=d|mx只能等于b且<=d
        a=b|c<d|b<=d|mx只能等于a且d
        a=b|c=d|b<=d|mx可以取b~d之间的任意数
- 核心代码
```
        for(int i = 1; i <= cnt && primes[i] <= b1; i++) {
            if(b1%primes[i]!=0) continue;
                int a = calc(a0, primes[i]);
                int b = calc(a1, primes[i]);
                int c = calc(b0, primes[i]);
                int d = calc(b1, primes[i]); // 用原始 b1 计算
                
                // 无解条件
                if (b > a || d < c) {
                    ans = 0;
                    break;
                }
                
                int res = 0;
                if (a > b) {
                    if (c < d) {
                        if (b == d) res = 1;
                    } else { // c == d
                        if (b <= d) res = 1;
                    }
                } else { // a == b
                    if (c < d) {
                        if (d >= b) res = 1;
                    } else { // c == d
                        if (d >= b) res = d - b + 1;
                    }
                }
            ans *= res;
        }
        cout<<ans<<endl;
```
- 易错点：1. 忽略b1本身是质数的情况 2. 忽略a0不是a1的倍数或者b0不是b1的倍数的情况
- 复盘：

---

#### 题目 2158 仪仗队
- 题目：一个密集点阵,站在左下角的人能看到多少人?
- 来源：洛谷
- 核心思路：对于一个点$(x,y)$来说,如果$\gcd(x,y)=1$，则它能被看到，否则它被$\gcd(x,y)$个点挡住了。题意转化为求2~N中每个数的欧拉函数值的总和。
- 核心代码
```
\\ 欧拉筛求出1~N每个数的欧拉函数值
void euler(int n) {
    for(int i = 2; i<=n; i++) {
        if(v[i] == 0) {
            v[i] = i;
            primes[++cnt] = i;
            phi[i] = i-1;
        }
        for(int j = 1; j<=cnt; j++) {
            if(primes[j] > v[i] || primes[j] > n/i) break;
            v[i*primes[j]] = primes[j];
            phi[i*primes[j]] = phi[i] * (i%primes[j] ? primes[j]-1 : primes[j]);
        }
    }
}
```
- 易错点：记得特判n=0的情况
- 复盘：

# 同余
1. 简化剩余系:1~n中与n互质的数的个数为欧拉函数$\varphi(n)$,它们构成简化剩余系,简化剩余系关于模n的乘法封闭.
2. 费马小定理:如果p是质数且a不是p的倍数,则$a^{p-1}\equiv 1\mod p$。(如果形式是$a^{q} \equiv a\mod p$,则只要求a是正整数)
3. 欧拉定理:如果a和n互质,则$a^{\varphi(n)}\equiv 1\mod n$。
4. 当题目中出现了模数,且需要求解幂运算时,可以考虑使用费马小定理或者欧拉定理来化简幂的指数,从而降低时间复杂度。具体来说,可以先把底数对p取模,然后把指数对$\varphi(n)$取模,最后再进行幂运算。
特别的,a,n不互质且b>$\varphi(n)$时,有$a^b\equiv a^{b\mod \varphi(n)+\varphi(n)}\mod n$。
5. 乘法逆元:如果a和n互质,则存在一个整数x使得$ax\equiv 1\mod n$,这个x就是a模n的乘法逆元。根据费马小定理或者欧拉定理,可以得到$a^{\varphi(n)-1}\equiv a^{-1}\mod n$。当n是质数p时,有$a^{p-2}\equiv a^{-1}\mod p$。

### 刷题笔记
#### 题目 P10496 [ICPC-Hefei 2008 Online] The Luckiest Number
- 来源：洛谷
- 题目：给定正整数L，求仅由8组成的L的倍数中最小的一个。
- 核心思路:
    - $x$ 个 $8$ 连在一起组成的正整数可写作 $8(10^x-1)/9$。题目就是让我们求出一个最小的 $x$，满足 $L \mid 8(10^x-1)/9$。设 $d = \gcd(L, 8)$。

    $$
    L \mid \frac{8(10^x-1)}{9} \iff 9L \mid 8(10^x-1) \iff \frac{9L}{d} \mid 10^x-1 \iff 10^x \equiv 1 \pmod{\frac{9L}{d}}
    $$
    - 引理:若正整数$a$和$n$互质,则满足$a^x\equiv 1\mod n$的最小正整数$x$是$\varphi(n)$的约数。
    - 所以只需要求出$\frac{9L}{d}$的欧拉函数值,然后枚举它的约数,用快速幂判断$10^x\mod \frac{9L}{d}$是否等于1即可。
- 核心代码
```
ll phi(ll n) { //求欧拉函数,可以改成分解质因数的形式
    ll res = n;
    for(ll i = 2; i * i <= n; i++){
        if(n%i==0) res = res*(i-1)/i;
        while(n%i==0) n/=i;
    }
    if(n > 1) res = res * (n-1) / n;
    return res;
}
// 迭代版龟速乘（防溢出）
ll mul(ll a, ll b, ll mod) {
    ll res = 0;
    a %= mod;
    while (b) {
        if (b & 1) res = (res + a) % mod;
        a = (a + a) % mod;
        b >>= 1;
    }
    return res;
}

// 迭代版快速幂（配合龟速乘）
ll fpow(ll a, ll b, ll mod) {
    ll res = 1;
    a %= mod;
    while (b) {
        if (b & 1) res = mul(res, a, mod);
        a = mul(a, a, mod);
        b >>= 1;
    }
    return res;
}
```

- 复盘：

#### 题目 P1082 [NOIP 2012 提高组] 同余方程
- 来源：洛谷
- 题目：给定正整数a,b,求解 $ax\equiv 1\mod b$ 中的最小正整数x。
- 核心思路:
    - 扩展欧几里得算法:如果a和b的最大公约数为d,则存在整数x,y使得$ax+by=d$。如果d=1,则$x$就是$a$模$b$的乘法逆元。

- 核心代码
```
ll exgcd(ll a, ll b, ll &x, ll &y) {
    if(!b) {x=1,y=0;return a;}//此时ax+by=a
    ll d=exgcd(b,a%b,x,y);
    //此时的x,y是上层递归的解,满足bx+(a%b)y=d
    //即bx+(a-(a/b)*b)y=d
    //即ay+b(x-(a/b)*y)=d
    ll t=x;x=y;y=t-(a/b)*y;
    return d;
}
```
- 易错点:b不是质数时不能用费马小定理求乘法逆元,需要用扩展欧几里得算法。
- 复盘：

#### 题目 P4777 【模板】扩展中国剩余定理（EXCRT）
- 来源：洛谷
- 题目：给定n组mi和ai,求满足$x\equiv a_i\mod m_i$的最小非负整数x.
- 核心思路:
    - 扩展中国剩余定理:不要求mi两两互质,设前i-1组方程的解为a1,模数为m1,第i组方程的余数为a2,模数为m2,则
    $$
    x=a1+k1*m1=a2+k2*m2
    $$
    即
    $$
    k1*m1-k2*m2=a2-a1
    $$
    忽略符号
    $$
    k1*m1+k2*m2=a2-a1
    $$
    现在我们的目标是求出最小的非负整数x,所以需要求出k1的最小非负整数解。用扩展欧几里得算法求出$k1*m1+k2*m2=gcd(m1,m2)$的解,设为x0,y0,则解k1的解为x0*(a2-a1)/gcd(m1,m2),有因为k1的解的周期为t=m2/gcd(m1,m2),所以k1的最小非负整数解为$(k1\mod t + t)\mod t$.
    最后更新a1=a1+k1*m1,m1=lcm(m1,m2),继续处理下一组方程即可。
- 核心代码
```
ll excrt() {
    ll a1,a2,n1,n2,k1,k2,d,c,t;
    a1 = a[1];n1 = m[1];
    for(int i = 2; i <= n; i++) {
        a2 = a[i];n2 = m[i];
        d = exgcd(n1,n2,k1,k2);
        c = a2 - a1;
        if(c % d) return -1;
        t = n2/d;
        __int128 K = (__int128)k1 * (c/d);
        K = (K%t+t)%t;
        a1 += n1 * (ll)K;
        n1 = n1 / d * n2;
    }
    return a1;
}
```

# 矩阵乘法
1. 矩阵快速幂:如果题目中出现了矩阵,且需要求解幂运算时,可以考虑使用矩阵快速幂来降低时间复杂度。具体来说,可以把矩阵看作一个线性变换,然后把幂运算转化为多次应用这个线性变换。矩阵快速幂的核心思想是利用二分法来减少乘法的次数,从而达到$O(\log n)$的时间复杂度。

### 刷题笔记

#### 题目 P1939 矩阵加速（数列）
- 来源：洛谷

- 题目描述

    已知一个数列 $a$，它满足：  

    $$
    a_x=
    \begin{cases}
    1 & x \in\{1,2,3\}\\ 
    a_{x-1}+a_{x-3} & x \geq 4
    \end{cases}
    $$

    求 $a$ 数列的第 $n$ 项对 $10^9+7$ 取余的值。
- 核心思路
    - 观察数列的递推关系,可以发现它是一个线性递推数列,可以用矩阵乘法来加速求解。设 $F(n) = {a_{n},a_{n+1},a_{n+2}}$，则有：$F(n) = M \cdot F(n-1)$，其中 $M$ 是转移矩阵。

- 完整代码

```
#include <bits/stdc++.h>
using namespace std;

#define ll long long

const ll mod = 1e9+7;

ll n;

void mul(ll f[3], ll a[3][3]) {
    ll c[3];
    memset(c,0,sizeof(c));
    for(int j = 0; j<3; j++) {
        for(int k = 0; k<3; k++) {
            c[j] = (c[j] + f[k] * a[k][j]) % mod;
        }
    }
    memcpy(f,c,sizeof(c));
} 

void mulself(ll a[3][3]) {
    ll c[3][3];
    memset(c, 0, sizeof(c));
    for(int i = 0; i<3; i++) {
        for(int j = 0; j<3; j++) {
            for(int k = 0; k<3; k++) {
                c[i][j] = (c[i][j] + a[i][k] * a[k][j]) % mod;
            }
        }
    }
    memcpy(a,c,sizeof(c));
}

int main() {
    cin>>n;
    while(n--) {
        ll m;cin>>m;
        ll f[3] = {0,1,1};
        ll a[3][3] = {
            {0,0,1},
            {1,0,0},
            {0,1,1}
        };
        for(;m;m>>=1) {
            if(m&1) mul(f,a);
            mulself(a);
        }
        cout<<f[0]<<endl;
    }
    return 0;
}
```

# 高斯消元与线性空间
1. 高斯消元:如果题目中出现了线性方程组,且需要求解未知数的值时,可以考虑使用高斯消元来降低时间复杂度。具体来说,可以把线性方程组看作一个矩阵,然后通过行变换来把矩阵化为上三角矩阵,最后再通过回代来求解未知数的值。高斯消元的时间复杂度为$O(n^3)$。

### 刷题笔记
#### 题目 P4035 [JSOI2008] 球形空间产生器
- 来源：洛谷
- 题目描述:在n维空间中,给出n+1个点,求出球心坐标
- 核心思路
    - 设球心坐标为$(x_1,x_2,...,x_n)$,则根据球的定义,有以下方程组:
    $$
    \begin{cases}
    (x_1-a_{11})^2+(x_2-a_{12})^2+\cdots+(x_n-a_{1n})^2=(x_1-a_{21})^2+(x_2-a_{22})^2+\cdots+(x_n-a_{2n})^2\\
    (x_1-a_{11})^2+(x_2-a_{12})^2+\cdots+(x_n-a_{1n})^2=(x_1-a_{31})^2+(x_2-a_{32})^2+\cdots+(x_n-a_{3n})^2\\
    \cdots\\
    (x_1-a_{11})^2+(x_2-a_{12})^2+\cdots+(x_n-a_{1n})^2=(x_1-a_{(n+1)1})^2+(x_2-a_{(n+1)2})^2+\cdots+(x_n-a_{(n+1)n})^2
    \end{cases}
    $$
    化简后得到以下线性方程组:
    $$
    \begin{cases}
    2(a_{21}-a_{11})x_1+2(a_{22}-a_{12})x_2+\cdots+2(a_{2n}-a_{1n})x_n=a_{21}^2-a_{11}^2+a_{22}^2-a_{12}^2+\cdots+a_{2n}^2-a_{1n}^2\\
    2(a_{31}-a_{11})x_1+2(a_{32}-a_{12})x_2+\cdots+2(a_{3n}-a_{1n})x_n=a_{31}^2-a_{11}^2+a_{32}^2-a_{12}^2+\cdots+a_{3n}^2-a_{1n}^2\\
    \cdots\\
    2(a_{(n+1)1}-a_{11})x_1+2(a_{(n+1)2}-a_{12})x_2+\cdots+2(a_{(n+1)n}-a_{1n})x_n=a_{(n+1)1}^2-a_{11}^2+a_{(n+1)2}^2-a_{12}^2+\cdots+a_{(n+1)n}^2-a_{1n}^2
    \end{cases}
    $$
    用高斯消元求出未知数的值即可。
- 核心代码
```
// b是增广矩阵的最后一列, c是前n列
for(int i = 1; i<=n; i++) {
    for(int j = i; j<=n; j++) {
        if(c[j][i]) {
            for(int k = 1; k<=n; k++) swap(c[i][k],c[j][k]);
            swap(b[i],b[j]);
        }
    }
    for(int j = i+1; j<=n; j++) {
        if(fabs(c[j][i]) > 1e-8) {
            double rate = c[j][i] / c[i][i];
            for(int k = 1; k<=n; k++) c[j][k] -= rate * c[i][k];
            b[j] -= rate * b[i];
        }
    }
}
for(int i = 1; i<=m; i++) {
    ans[i] = b[i] / c[i][i];
}
```

#### 题目 P10499 开关问题
- 来源：洛谷
- 题目描述:有n个开关,每个开关有一个初始状态和一个目标状态,每个开关还会影响一些其他开关的状态,求最少按几次开关能达到目标状态(每个开关最多只能按一次)。
- 核心思路:
    - 把每个开关看作一个变量,按一次开关相当于对这个变量进行异或操作,最终目标是使所有开关都达到目标状态。这可以转化为一个线性方程组问题,用高斯消元来解决。
    - 设开关的初始状态为0,目标状态为1,每个开关影响的其他开关用一个二进制数来表示,如果第i个开关影响第j个开关,则在第i行第j列上填1,否则填0。最后一列填目标状态与初始状态的异或值。用高斯消元求解这个线性方程组,设自由元的数量是cnt,则答案为$2^{cnt}$。
- 核心代码
```
// a[i]的第零位表示初始状态与目标状态的异或值,第j位表示第i个开关是否影响第j个开关
for(int i = 1; i<=n; i++) {
    for(int j = i+1; j<=n; j++) {
        if(a[j] > a[i]) {
            swap(a[i],a[j]);
        }
    }
    if(a[i] == 0) {ans=1<<(n-i+1),break;}
    if(a[i] == 1) {ans=0;break;}
    for(int k = n; >=1; k--) {
        if((a[i]>>k)&1) {
            for(int j = 1; j<=n; j++) {
                if(i != j && (a[j]>>k)&1) {
                    a[j] ^= a[i];
                }
            }
            break;
        }
    }
}
```

#### P3265 [JLOI2015] 装备购买
- 来源：洛谷
- 题目描述:有n件装备,每件装备有一个价格和m个属性,若一件装备的属性能由已有的装备线性组合成,则这件装备不能买,求买最多装备时的最低总价。
- 核心思路:
    - 先把装备按价格升序排序,再用高斯消元来判断每件装备的属性是否能由已有的装备线性组合成,如果不能,则买这件装备并把它的属性加入到已有的装备中。
    - **设p[j]表示第i列的主元所在行**,初始为0,如果第i件装备的属性在第j列上有1,且p[j]为0,则说明这件装备的属性不能由已有的装备线性组合成,把p[j]更新为i,并把这件装备的价格加入到答案中;如果p[j]不为0,则说明这件装备的属性可以由已有的装备线性组合成,用这件装备的属性去消掉已有装备中第j列上的1。
- 核心代码
```
//p[j]表示第i列的主元所在行,初始为0
for(int i = 1; i<=n; i++) {
    for(int j = 1; j<=m; j++) {
        if(fabs(q[i].a[j])<1e-5) continue;//为什么不用1e-8
        if(!p[j]) {
            p[j] = i;
            cnt++;
            ans += q[i].c;
            break;
        }
        else {
            double rate = q[i].a[j] / q[p[j]].a[j];
            for(int k = j; k<=m; k++) {
                q[i].a[k] -= rate * q[p[j]].a[k];
            }
        }
    }
}
```

# 组合
1. 组合数: $C(n,m)=\frac{n!}{m!(n-m)!}$,可以用动态规划或者预处理阶乘和逆元来求解。
2. $C(n,m)=C(n-1,m)+C(n-1,m-1)$
3. 多重集的排列数:$\frac{n!}{n_1!n_2!\cdots n_k!}$,其中$n_1+n_2+\cdots+n_k=n$
4. 无限集的组合数:$C(n+m-1,m)$,其中n是元素的种类数,m是选取的元素个数。
5. lucas定理:如果p是质数,则$C(n,m)\mod p=C(n/p,m/p)*C(n\mod p,m\mod p)\mod p$。其中$C(n/p,m/p)$可以递归调用lucas定理求解,直到n和m都小于p为止,此时可以直接用动态规划或者预处理阶乘和逆元来求解。
    lucas定理的本质:
    设 $p$ 是一个质数，将 $n$ 和 $m$ 写成 $p$ 进制形式：

    $$
    n = n_k p^k + n_{k-1} p^{k-1} + \cdots + n_1 p + n_0
    $$

    $$
    m = m_k p^k + m_{k-1} p^{k-1} + \cdots + m_1 p + m_0
    $$

    其中 $0 \le n_i, m_i < p$。

    Lucas 定理指出：

    $$
    \binom{n}{m} \equiv \prod_{i=0}^{k} \binom{n_i}{m_i} \pmod p
    $$


### 刷题笔记
#### 题目 P1313 [NOIP 2011 提高组] 计算系数
- 来源：洛谷
- 题目描述:给定 5 个整数，分别为 a,b,k,n,m,求$(by+ax)^k$中$x^n y^m$的系数对10007取余的值。
- 核心思路:
    - 借助$C(n,m)=C(n-1,m)+C(n-1,m-1)$求答案.

- 核心代码
```
c[1][1] = 1;
for(int i = 1; i<=k+1; i++) {
    for(int j = 1; j<=i; j++) {
        c[i][j] = (c[i-1][j-1] * b + c[i-1][j] * a) % 10007;
    }
}

```

#### 题目 P2480 [SDOI2010] 古代猪文
- 来源：洛谷
- 题目描述: 给定n,G,求$G^{\sum_{d|n}C(n,d)}\mod 999911659$
- 核心思路:
    - 根据费马小定理,$G^{\sum_{d|n}C(n,d)}\mod 999911659 = G^{\sum_{d|n}C(n,d)\mod999911658}\mod 999911659$
    - 中国剩余定理:因为999911658是质数的积,所以可以对每个质数求出对应的答案,最后用中国剩余定理合并起来。
    - 借助lucas定理求出$C(n,d)\mod p$的值,其中p是999911659的一个质因数,d是n的一个因数。
    - 其中组合数借助预处理的阶乘和逆元来求解。
- 核心代码
```
#include <bits/stdc++.h>
using namespace std;

#define ll long long

const ll mod = 999911658;

ll n,G,b[5] = {0,2,3,4679,35617},a[5],fare[40000],val;

void init(ll p) {
    fare[0] = 1;
    for(int i = 1; i<p; i++) {
        fare[i] = (fare[i-1] * i)%p;
    }
}

ll fpow(ll a, ll b, ll p) {
    ll res = 1;
    a %= p;
    while(b) {
        if(b&1) res = res*a%p;
        a = a * a % p;
        b>>=1;
    }
    return res;
}

ll C(ll a, ll b, ll p) {
    if(a<b) return 0;
    return fare[a]*fpow(fare[b],p-2,p)*fpow(fare[a-b],p-2,p);
}

ll lucas(ll a, ll b, ll p) {
    if((a<b)) return 0;
    if(!a) return 1;
    return (lucas(a/p,b/p,p)*C(a%p,b%p,p))%p;
}

void CRT() {
    for(int i = 1; i<=4; i++) {
        val = (val + a[i] * (mod / b[i]) * fpow(mod/b[i],b[i]-2,b[i])) % mod;
    }
}

int main() {
    cin >> n >> G;
    if(G%(mod+1)==0) {
        cout<<0;
        return 0;
    }
    for(int k = 1; k<=4; k++) {
        init(b[k]);
        for(int i = 1; i*i<=n; i++) {
            if(n%i) continue;
            a[k] = (a[k]+lucas(n,i,b[k]))%b[k];
            if(i*i!=n) a[k]=(a[k]+lucas(n,n/i,b[k]))%b[k];
        }
    }
    CRT();
    cout<<fpow(G,val,mod+1);
    return 0;
}
```

# 容斥原理
1. 容斥原理:如果有n个集合$A_1,A_2,...,A_n$,则它们的并集的大小为$\sum_{i=1}^n|A_i|-\sum_{i<j}|A_i\cap A_j|+\sum_{i<j<k}|A_i\cap A_j\cap A_k|-...$
2. 容斥原理的应用:如果题目中出现了求满足某些条件的元素的个数时,可以考虑使用容斥原理来求解。具体来说,可以把满足条件的元素看作一个集合,然后用容斥原理来求出这个集合的大小。设满足条件的元素的集合为$A$,则$|A|=\sum_{i=1}^n|A_i|-\sum_{i<j}|A_i\cap A_j|+\sum_{i<j<k}|A_i\cap A_j\cap A_k|-...$。其中$A_i$表示满足第i个条件的元素的集合。有时满足条件的集合不好求,但不满足条件的集合很好求,这时可以先求出不满足条件的集合的大小,然后用总元素个数减去不满足条件的集合的大小即可。设不满足条件i的集合为$B_i$,则$|A|=N-\sum_{i=1}^n|B_i|+\sum_{i<j}|B_i\cap B_j|-\sum_{i<j<k}|B_i\cap B_j\cap B_k|+...$。其中N表示总元素个数。
3. mobius函数:
设正整数 $N$ 按照算术基本定理分解质因数为 $N = p_1^{c_1} p_2^{c_2} \cdots p_m^{c_m}$，定义函数：
莫比乌斯函数是根据容斥原理量身定制的.

$$
\mu(N) = \begin{cases} 
0 & \exists i \in [1, m], c_i > 1 \\
1 & m \equiv 0 \pmod 2, \forall i \in [1, m], c_i = 1 \\
-1 & m \equiv 1 \pmod 2, \forall i \in [1, m], c_i = 1
\end{cases}
$$

### 刷题笔记
#### 题目 CF451E Devu and Flowers
- 来源：Codeforces
- 题目描述:给定n个盒子,每个盒子里有fi朵花,从中选出s朵花,问有多少种选法.
- 核心思路:
    - 显然不考虑数量约数的组合数为$C(s+n-1,n-1)$
    - 设不满足条件i的集合为$B_i$,则$|B_i|=C(s-fi+n-2,n-1)$,因为至少要从第i个盒子里选出fi+1朵花,所以剩下的花数为s-fi-1,剩下的盒子数为n,所以是$C(s-fi-1+n-1,n-1)=C(s-fi+n-2,n-1)$。
    - 同理,设不满足条件i和j的集合为$B_i\cap B_j$,则$|B_i\cap B_j|=C(s-fi-fj+n-3,n-1)$,因为至少要从第i个盒子里选出fi+1朵花,从第j个盒子里选出fj+1朵花,所以剩下的花数为s-fi-fj-2,剩下的盒子数为n,所以是$C(s-fi-fj-2+n-1,n-1)=C(s-fi-fj+n-3,n-1)$。
    - 由容斥原理可得答案为$C(s+n-1,n-1)-\sum_{i=1}^nC(s-fi+n-2,n-1)+\sum_{i<j}C(s-fi-fj+n-3,n-1)-...$。
- 核心代码
```
#include<bits/stdc++.h>
using namespace std;

#define ll long long

const ll mod = 1e9+7;

ll n,s,inv[30],a[30],ans;

ll fpow(ll a,ll b,ll p) {
    ll res = 1;
    while(b) {
        if(b&1) res = res*a%p;
        a = a*a%p;
        b>>=1;
    }
    return res;
}

void init() { // 预处理逆元求组合数
    for(int i = 1; i<=20; i++) {
        inv[i] = fpow(i,mod-2,mod);
    }
}

ll C(ll a, ll b, ll p) {
    if(a < 0 || b < 0 || a < b) return 0;
    a%=p;//这里用了lucas定理
    if(a == 0 || b == 0) return 1;
    ll ans = 1;
    for(int i = a; i>a-b; i--) ans = (ans * i) % p;
    for(int i = 1; i<=b; i++) ans = ans * inv[i] % p;
    return ans;
}

int main() {
    cin>>n>>s;
    for(int i = 1; i<=n; i++) cin>>a[i];
    init();
    for(int i = 0;i< 1<<n;i++) { //i的二进制表示的每一位表示是否减去对应的a[j+1],这样恰好枚举了所有的子集
        if(!i) {
            ans = (ans + C(n+s-1,n-1,mod))%mod;
        }
        else {
            ll p = 0;
            ll t = n+s;
            for(int j = 0; j<n; j++) {
                if(i>>j&1) {
                    p++;
                    t -= a[j+1];
                }
            }
            t-=p+1;
            if(p&1) ans = (ans - C(t,n-1,mod)) % mod;
            else ans = (ans + C(t,n-1,mod)) % mod;
        }
    }
    cout<<(ans+mod)%mod;
    return 0;
}
```

#### P3455 [POI 2007] ZAP-Queries
- 来源：洛谷
- 题目描述:给定a,b,k,求满足$1\leq x\leq a,1\leq y\leq b, gcd(x,y)=k$的整数对的个数。
- 核心思路:
    - 即求满足$1\leq x\leq a/k,1\leq y\leq b/k, gcd(x,y)=1$的整数对的个数。
    - 先求gcd(x,y)无限制的整数对的个数,即$a/k*b/k$,再用容斥原理减去gcd(x,y)有一个质因数p的整数对的个数,再加上gcd(x,y)有两个质因数p和q的整数对的个数,以此类推。此时系数就是mobius函数的值,所以答案为$\sum_{d=1}^{min(a/k,b/k)}\mu(d)*\lfloor a/(kd)\rfloor * \lfloor b/(kd)\rfloor$。
    - 再用到余数求和的技巧,即$\sum_{i=1}^n\lfloor m/i\rfloor$的值可以通过分块来求解,时间复杂度为$O(\sqrt{m})$。
- 核心代码
```
void init() {
    memset(v,0,sizeof(v));
    int cnt = 0;
    for(int i = 2; i<=N; i++) {
        if(!v[i]) {
            miu[i] = -1;
            primes[++cnt] = i;
        }
        for(int j = 1; j<=cnt && i*primes[j]<=N; j++) {
            v[i*primes[j]] = 1;
            if(i%primes[j] == 0) {
                miu[i*primes[j]] = 0;
                break;
            }
            else miu[i*primes[j]] = -miu[i];
        }
    }
    for (int i = 1; i <= N; i++) {
        sum[i] = sum[i-1] + miu[i];
    }
}


long long ans = 0;
int gi;
for(int i = 1; i <=min(x,y); i=gi+1) {
    gi = min(x/(x/i),y/(y/i));
    ans += (sum[gi] - sum[i-1]) * (long long)(x/i) * (y/i);
}
```

# 概率与数学期望

### 刷题笔记

#### P10500 Rainbow 的信号
- 来源：洛谷
- 题目描述:给定长度为n的数组a,随机选择l,r,并求出a[min(l,r)~max(l,r)]的and,or,xor的值,问三个值的期望.
- 核心思路:
    - 按位分别计算(因为位运算不进位)
    - 先处理长度为1的情况,即l=r,此时and,or,xor的值都为a[i],所以期望都加上$2^k/n^2$。
    - 枚举右端点,
    对于and值,若右端点为0,则对期望无贡献;若右端点为1,则需要找到左端点最远的一个1的位置,设为p,则当左端点在p和右端点之间时,and值为1,所以期望加上$2^k*((r-1)-(last[0]+1)+1)*2/n^2$。
    对于or值,若右端点为1,则左端点可任选,期望加上$2^k*(r-1)*2/n^2$。若右端点为0,则需要找到左端点最近的一个1的位置,则当左端点在0和last[1]之间时,or值为1,所以期望加上$2^k*(last[1])*2/n^2$。
    对于xor值,显然可以以1为分界点来处理右端点之前的数,当左端点取在两个1之间是,xor相同,所以我们应该从r-1开始处理,设奇数段的长度之和为c1,偶数段的长度之和为c2,则当右端点为1时,期望加上$2^k*(c1)*2/n^2$,当右端点为0时,期望加上$2^k*(c2)*2/n^2$。右端点自增时,c1=c1+1,c2不变;若r为1,还需交换c1和c2。
- 核心代码
```
    for(int i = 0; i<=30; i++) {
        last[0] = last[1] = 0;
        c1 = c2 = 0;
        for(int j = 1; j<=n; j++) {
            int now = a[j] >> i & 1;
            double ret = (double)(1<<i)/(n*n);
            if(now) {
                ansand += ret + 2*ret*(j - last[0] - 1);
                ansor += ret + 2*ret*(j-1);
                ansxor += ret + 2*ret*c1;
            }
            else {
                ansor += 2*ret*last[1];
                ansxor += 2*ret*c2;
            }
            last[now] = j;
            c1++;
            if(now) swap(c1,c2);
        }
    }
```

# 博弈论之SG函数
1. NIM博弈:有n堆石子,每堆有a[i]个石子,两人轮流取石子,每次可以从一堆中取任意个石子,问先手是否必胜。定理:如果所有堆的石子数的异或和为0,则先手必败;否则先手必胜。
2. SG函数:对于一个博弈状态,定义SG函数.对于一个状态,如果它没有任何合法的下一步,则SG函数值为0;否则SG函数值为所有合法下一步的SG函数值的mex(mex是指最小的非负整数集合中不包含的数)。
3. 有向图游戏的和:如果一个博弈可以看作是几个独立的子博弈的组合,则这个博弈的SG函数值为所有子博弈的SG函数值的异或和。

### 刷题笔记

#### P10501 Cutting Game
- 来源：洛谷
- 题目描述:给定长度为n宽为m的矩形,每次可以把一个矩形切成两个矩形,当无法切分时游戏结束,问先手是否必胜。
- 核心思路:
    - 先求出SG函数值,设f[i][j]表示长度为i宽为j的矩形的SG函数值,则有以下状态转移:
    $$
    f[i][j]=\text{mex}\{f[k][j]\oplus f[i-k][j]|1\leq k < i\}\cup \{f[i][k]\oplus f[i][j-k]|1\leq k < j\}
    $$
    最后判断f[n][m]是否为0即可。
---
- 核心代码
```
int SG(int n, int m) {
    if(sg[n][m]!=-1) return sg[n][m];
    bool vis[N] = {};
    for(int i = 2; i<=n-2; i++) vis[SG(i,m)^SG(n-i,m)]=1; 
    for(int i = 2; i<=m-2; i++) vis[SG(n,m-i)^SG(n,i)]=1;
    for(int i = 0; i<N; i++) if(!vis[i]) {sg[n][m] = i;break;}
    return sg[n][m]; 
}
```

# 卡特兰数
1. 卡特兰数的四种计算方法:
    - $H(n)=C(2n,n)-C(2n,n-1)$
    - $H(n)=\frac{C(2n,n)}{n+1}$
    - $H(n)=\frac{4n-2}{n+1}H(n-1)$
    - $H(n)=\sum_{i=0}^{n-1}H(i)*H(n-1-i)$
2. 卡特兰数的应用:卡特兰数在组合数学中有很多应用,例如:
    - 路径问题:从(0,0)到(n,n)的路径中,只能向右或向下走,且不能经过对角线x=y,这样的路径数量为第n个卡特兰数。
    - 括号匹配:长度为2n的合法括号序列的数量为第n个卡特兰数。
    - 栈操作:有n个元素入栈,每次可以选择入栈或出栈,要求在任何时刻出栈的元素都不多于入栈的元素,这样的操作序列的数量为第n个卡特兰数。
    - 二叉树的数量:有n个节点的二叉树的数量为第n个卡特兰数。
    - 分割问题:把一个凸n+2边形分割成三角形的方式数量为第n个卡特兰数。
    - 在一个圆上有2n个点,连接这些点的线段不相交的方式数量为第n个卡特兰数。
### 刷题笔记
#### P10413 [蓝桥杯 2023 国 A] 圆上的连线
- 来源：蓝桥杯
- 题目描述:一个环上依次排列2023个点,问有多少种不同的连线方式，使得完全没有连线相交。当两个方案连线的数量不同或任何一个点连接的点在另一个方案中编号不同时，两个方案视为不同。答案对2023取余。
- 核心思路:
    - 当在2023个点中选取2k个点进行连线时,可以把这2k个点看作一个凸2k边形,连接这些点的线段不相交的方式数量为第k个卡特兰数,所以答案为$\sum_{k=1}^{1011}C(2023,2k)*H(k)\mod 2023$。
- 核心代码
```
#include<bits/stdc++.h>
using namespace std;


const int N = 5000,mod = 2023;

int n = 2023;
int c[N+10][N+10],h[N+10];
int ans;

int main() {
    for(int i = 0;i<=N;i++) c[i][0] = 1;
    for(int i = 1;i<=N;i++) {
        for(int j = 1; j<=i;j++) {
            c[i][j] = (c[i-1][j-1] + c[i-1][j])%mod;
        }
    }
    for(int i = 1; i<=n;i++) {
        if(i%2) continue;
        ans = (ans+c[n][i]*c[2*i][i]/(n+1))%mod;
    }
    cout<<ans;
    return 0;
}
```

# trick
1. 如何选取求组合数的方法