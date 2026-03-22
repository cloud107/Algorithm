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


### <a href="https://sim.csp.thusaac.com/contest/40/problem/1" target="_blank" rel="noreferrer">数字变换</a>
- 来源: CCF-CSP认证
- 题目描述: 较复杂,详见链接,给出n(<5e5)个数,每个数的范围是(0~2^9),对每个数进行一定的变换,最后得到一个数.
- 核心思路
    - n较大,ai的范围却很小,直接打表输出
-核心代码:
```
#include<bits/stdc++.h>
using namespace std;

const int N = 500010;
const int M = 1010;
const int MOD_VAL = 8; 
const int STATE_SIZE = 512;

int n, m;
int k[M];
int final_map[STATE_SIZE];

// 修复：k 先取模，确保返回值在 0~7
inline int get_f(int x, int k_val) {
    int km = k_val % MOD_VAL;
    return ((x * x + km * km) % MOD_VAL) ^ km;
}

inline int get_g(int x, int k_val) {
    int c = x & 7;
    int b = (x >> 3) & 7;
    int a = (x >> 6) & 7;
    
    int resb = a;
    int resc = b ^ get_f(resb, k_val);
    int resa = c ^ get_f(resc, k_val);
    
    return (resa << 6) | (resb << 3) | resc;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> n >> m;
    for (int i = 1; i <= m; i++) cin >> k[i];

    // 预处理所有 0~511 的变换结果
    for (int x = 0; x < STATE_SIZE; x++) {
        int curr = x;
        for (int j = m; j >= 1; j--) {
            curr = get_g(curr, k[j]);
        }
        final_map[x] = curr;
    }

    // 输出时注意格式
    for (int i = 0; i < n; i++) {
        int val;
        cin >> val;
        int ans = final_map[val & 511];  // 只取低 9 位
        cout << ans;
        if (i < n - 1) cout << ' ';  // 最后一个数后不加空格
    }
    cout << '\n';

    return 0;
}
```
- 复盘: 我当时做的时候选择了记忆化搜索,结果超时了,后来AI说应该打表