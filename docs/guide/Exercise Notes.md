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

### <a href="https://www.lanqiao.cn/problems/183/learning/" target="_blank" rel="noreferrer">完全二叉树的权值</a> 
- 来源: 蓝桥杯
- 题目描述: 给定一个完全二叉树,每个节点有一个权值(可正可负),每一层所有节点的权值之和为这一层的权值,求出权值最大的层数
- 核心思路: 
    - 直接模拟
- 核心代码
``` cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long 

int n;
int dep,tot[1000];
int sum[1000];
int ans,maxn;

signed main() {
    cin>>n;
    for(dep = 0; tot[dep]<n; dep++) {
        tot[dep+1]=tot[dep]+((int)(1)<<dep);
        // cout<<tot[dep+1]<<endl;
    }
    // cout<<dep<<endl;
    int now = 1;
    maxn = -100010;
    for(int i = 1; i<=n; i++) {
        if(i>tot[now]) now++;
        int a;cin>>a;
        sum[now]+=a;
        if(i==tot[now] || i==n) //不要在一行还没结束的时候就更新最大值
        if(sum[now]>maxn) {
            ans = now;
            maxn = sum[now];
        }
    }
    cout<<ans<<endl;
    return 0;
}
```
- 复盘: 之所以选这道简单题是为了提醒自己模拟时一定要完全按照题目的要求,我当时每加一个节点就更新一次最大值,结果在一行还没结束的时候就更新了最大值,导致结果错.

### <a href="https://www.lanqiao.cn/problems/185/learning/" target="_blank" rel="noreferrer">修改数组</a>
- 来源: 蓝桥杯
- 题目描述: 给定一个数组,每加入一个数时,检查在这个数之前数组中是否存在和这个数相等的数,如果存在就把这个数加一,直到不存在为止,输出最后的数组
- 核心思路: 
    - 正解:并查集,每加入一个数就把这个数修改成它所在集合的代表元,然后把修改后的值和它加一的值合并
    - 另解(我当时想到的解法):树状数组+二分,构造一个树状数组记录每个数是否存在,存在为1不存在为0,由于树状数组可以快速求出前缀和,当我们得到一个新数a[i]时,我们用二分查找找到一个位置pos使得pos满足sum[pos]-sum[a[i]-1]==1且pos最小,说明a[i]到pos-1的闭区间内的数都存在,所以我们把a[i]修改成pos,然后把pos这个数标记为存在(树状数组中对应位置加1)
- 核心代码
    - 并查集解法
    ```cpp
    #include<bits/stdc++.h>
    using namespace std;

    const int N = 100010, M = 1000010;

    int n,a[N];
    int fa[M];

    int get(int x) {
        if(fa[x] == x) return x;
        return fa[x] = get(fa[x]);
    }

    void merge(int x,int y) {
        int fx = get(x), fy = get(y);
        fa[fx] = fy;
    }

    int main() {
        cin>>n;
        for(int i = 1; i<=n; i++) cin>>a[i];
        for(int i = 1; i<M;i++) fa[i] = i;
        for(int i = 1; i<=n; i++) {
            // cout<<a[i]<<" "<<get(a[i])<<endl;
            a[i] = get(a[i]);
            merge(a[i],a[i]+1);
        }
        for(int i = 1; i<=n;i++) cout<<a[i]<<" ";
        cout<<endl;
        return 0;
    }
    ```
    - 树状数组解法
    ```cpp
    #include<bits/stdc++.h>
    using namespace std;

    const int N = 100010,M = 200010;

    int a[N],n;
    int tr[M];

    void add(int x) {
        for(int i = x; i<M; i+=i&-i) tr[i]++;
    }

    int ask(int x) {
        int res = 0;
        for(int i = x; i; i-=i&-i) res += tr[i];
        return res;
    }

    bool check(int l,int r) {
        int res = ask(r) - ask(l-1);
        if(r-l+1>res) return 1;
        else return 0;
    }

    int main() {
        cin>>n;
        for(int i = 1; i<=n; i++) cin>>a[i];
        for(int i = 1; i<=n; i++) {
            int l = a[i]-1,r = M;
            while(l+1<r) {
                int mid = l+r>>1;
                if(check(a[i],mid)) r = mid;
                else l = mid;
            }
            a[i] = r;
            add(a[i]);
        }
        for(int i = 1; i<=n;i++) cout<<a[i]<<" ";
        return 0;
    }
    ```
- 复盘: 这题的正解是并查集,显然树状数组+二分的写法在代码量和时间复杂度上完败,但这是我自己想到的解法,我觉得很有意义

### <a href="https://sim.csp.thusaac.com/contest/list" target="_blank" rel="noreferrer">梦境巡查</a>
- 来源: CCF-CSP认证
- 题目描述: 给定一个长为n+1的数列a(含a[0]),一个长为n的数列b(不含b[0]),从0开始,每向前走一步就-a[i]+b[i],求出i∈[1,n],当b[i]置为0时,得到的数列中的最小值
- 标签: 前缀和,区间最值
- 核心思路:
    - 每次把一个b[i]置零,只会对后面的位置产生影响,所以我们可以对每一个i先求出前缀和数组1~i的最小值,再求出前缀和数组i~n的最小值,当把b[i]置为0时,前缀和数组1~i的最小值不变,前缀和数组i~n的最小值减小b[i],
- 核心代码:
```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 100010;

int a[N],b[N],sum[N],pre_max[N],post_max[N],n;

int main() {
    cin>>n;
    for(int i = 0; i<=n; i++) cin>>a[i];
    for(int i = 1; i<=n; i++) cin>>b[i];
    for(int i = 1; i<=n+1;i++) {
        sum[i] = sum[i-1]+a[i-1]-b[i-1];
        pre_max[i] = max(pre_max[i-1],sum[i]);
    }
    post_max[n+1] = sum[n+1];
    for(int i = n;i>0;i--) {
        post_max[i] = max(post_max[i+1],sum[i]);
    }
    for(int i = 2; i<=n+1;i++) {
        int ans = max(pre_max[i],post_max[i]+b[i-1]);
        cout<<ans<<" ";
    }
    return 0;
}
```
- 复盘: 当时看到区间最值只想到线段树和ST表,没有考虑到这题两个区间的边界都有一边固定

### <a href="https://www.lanqiao.cn/problems/3529/learning/" target="_blank" rel="noreferrer">太阳</a>
- 标签: 计算几何,区间合并
- 来源: 蓝桥杯
- 题目大意: 给定一个点(太阳)的坐标,给出n个与x轴平行的线段,求有多少个线段能被太阳照到
- 核心思路:
    - 因为太阳在上面,所以把线段按y降序排列
    - 枚举每一个线段,计算出左右端点与太阳的连线与y轴的夹角,如果这个线段的夹角在之前的线段的夹角范围内,说明这个线段被之前的线段遮挡了,否则说明这个线段能被太阳照到,更新夹角范围
    - 这里涉及到区间合并的问题,请看代码
- 核心代码:
```cpp
#include<bits/stdc++.h>
using namespace std;

const int N = 100010;

int n;
struct Node{
    int x,y,l;
    bool operator<(Node &o) {
        return y>o.y;
    }
}p[N];
double sunx,suny;
int ans;
map<double,double>mp;

int addline(double x,double y) {
    int res = 1; 
    auto it1 = mp.upper_bound(x);
    auto it2 = mp.upper_bound(y);
    if(it1!=mp.begin() && (--it1)++->second>=y) {
        res = 0;
    } else {
        if(it1!=mp.begin()) {
            it1--;
            if(it1->second>=x) x = it1->first;
            else it1++;
        }

        if(it2!=mp.begin()) {
            it2--;
            if(it2->second>=y) y = it2->second;
            it2++;
        }
        mp.erase(it1,it2);
        mp.insert({x,y});
    }
    return res;
}

int main() {
    cin>>n>>sunx>>suny;
    for(int i = 1; i<=n; i++) {
        cin>>p[i].x>>p[i].y>>p[i].l;
    }
    sort(p+1,p+1+n);
    for(int i = 1;i<=n;i++) {
        double deg1 = atan((p[i].x-sunx)/(suny-p[i].y));
        double deg2 = atan((p[i].x+p[i].l-sunx)/(suny-p[i].y));
        // cout<<i<<' '<<deg1<<' '<<deg2<<endl;
        if(addline(deg1,deg2)) {
            ans++;
        }
    }
    cout<<ans<<endl;
    return 0;
}
```

### <a href="https://www.lanqiao.cn/problems/3512/learning/" target="_blank" rel="noreferrer">接龙数列</a>
- 标签: 动态规划
- 来源: 蓝桥杯
- 题目描述: 给定一个数列,如果一个数的末尾和下一个数的开头相同,就可以把它们接在一起,最少删除多少个数能使给出的数列变成接龙数列
- 核心思路:
    - dp[i]表示以i(注意不是a[i])结尾的接龙数列的最大接龙数列长度
    - 依次枚举数列中的每一个数a[i],对于每一个数a[i],我们枚举它的开头数字和结尾数字,假设开头数字为x,结尾数字为y,我们就把dp[y]更新为max(dp[y],dp[x]+1),最后答案就是n-max(dp[i])中的最大值
- 核心代码:
```cpp
#include <iostream>
#include <string>
using namespace std;

int dp[10];

int main()
{
  // 请在此输入您的代码
  int n;
  cin>>n;
  string s;
  int m=0;
  for(int i=0;i<n;++i){
    cin>>s;
    int x=s[0]-'0',y=s[s.size()-1]-'0';
    dp[y]=max(dp[x]+1,dp[y]);
    m=max(m,dp[y]);
  }
  cout<<n-m<<endl;
  return 0;
}
```

### <a href="https://www.lanqiao.cn/problems/3512/learning/" target="_blank" rel="noreferrer">接龙数列</a>
- 标签: dfs
- 来源: 蓝桥杯
- 题目描述: 给定一个地图,1表示陆地,0表示水域,如果陆地连成一个环,其中的岛屿属于外围的子岛屿,不参与计数,求出这个地图上有多少个岛屿
- 核心思路:
    - 把地图向外扩展一圈水,从(0,0)开始dfs,把所有能访问到的水域都标记为访问过,同时搜到陆地时进行联通分量的计数,最后的答案就是联通分量的数量
- 核心代码:
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 60;
char c;
int g[N][N], n, m, res,t;
int dx[4] = {0, 0, 1, -1},dy[4] = {1, -1, 0, 0};
bool st[N][N];
void dfs_1(int r,int c){
  st[r][c]=true;
  for(int k=0;k<4;k++){
    int x=dx[k]+r,y=dy[k]+c;
    if(st[x][y]||g[x][y]==0) continue;
    dfs_1(x,y);
  }
}
void dfs_0(int r,int c){
  st[r][c]=true;
  for(int i=-1;i<=1;i++){
    for(int j=-1;j<=1;j++){
      int x=r+i,y=c+j;
      if(x<0||x>n+1||y<0||y>m+1||st[x][y]) continue;//越界+走过
      if(g[x][y]==0)dfs_0(x,y);//仍是海
      else dfs_1(x,y),res++;//岛屿
    }
  }
}
int main () {
    cin>>t;
    while(t--){
      memset(g,0,sizeof g);
      memset(st,false,sizeof st);
      res=0;
      cin>>n>>m;
      for(int i=1;i<=n;i++)
        for(int j=1;j<=m;j++){
          cin>>c;
          g[i][j]=c-'0';
        }
        dfs_0(0,0);//从外海开始遍历
        cout<<res<<'\n';
    }
    return 0;
}
```