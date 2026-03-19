### <a href="https://www.lanqiao.cn/problems/1463/learning/" target="_blank" rel="noreferrer">货物摆放</a>
- 来源: 蓝桥杯
- 题目描述: 有一个长方体的货物,体积为n,求长宽高的所有可能的组合.例如当n=4时,有以下6种方案:1×1×4、1×2×2、1×4×1、2×1×2、2×2×1、4×1×1。
- 核心思路: 
    - 枚举长宽高,满足长宽高的乘积等于n即可.
    - 类似于把一个数分解成两个数的乘积,只需要枚举1~sqrt(n);分解成三个数的乘积,需要两重循环,第一重枚举1~cbrt(n),第二重枚举i~sqrt(n/i)。
- 代码实现:
```
#include<bits/stdc++.h>
using namespace std;

#define int long long

int n = 2021041820210418;
int ans;

signed main() {
    for(int i = 1; i*i*i<=n;i++) {
        if(n%i) continue;
        for(int j = i; i*j*j<=n; j++) {
            if(n/i%j) continue;
            int k = n/i/j;
            if(i==j && i==k) ans+=1;
            else if(i==j || j==k || i==k) ans+=3;
            else ans+=6;
        }
    }
    cout<<ans<<endl;
    return 0;
}
```
- 正确性证明:ijk一定满足i<=j<=k,所以不会出现重复计数的问题