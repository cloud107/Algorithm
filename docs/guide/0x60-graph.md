# 最短路
1. 单源最短路
    1. Dijkstra算法
    适用于无负权图，时间复杂度O(ElogV)，空间复杂度O(V)
    ```
    void dijkstra() {
        memset(d,0x3f,sizeof(d));
        d[1] = 0;
        priority_queue<pii,vector<pii>,greater<pii>>pq;//小根堆
        pq.push({0,1});//距离，节点
        while(!pq.empty()) {
            int x = pq.top().second;
            if(vis[x]) continue;
            vis[x] = 1;
            pq.pop();
            for(int i = head[x];i;i = nex[i]) {
                int y = ver[i];
                if(d[y] > d[x] + weight[i]) {
                    d[y] = d[x] + weight[i];
                    pq.push({d[y],y});
                }
            }
        }
    }
    ```
    2. SPFA算法(队列优化的Bellman-Ford算法)
    适用于有负权图但无负权回路，时间复杂度O(kE)，空间复杂度O(V) (k是一个常数，通常情况下k<2,需要注意的是对于特定构造的图，SPFA的时间复杂度可能退化到O(VE))
    ```
    void spfa() {
        memset(d,0x3f,sizeof(d));
        d[1] = 0;
        queue<int>qu;
        qu.push(1);
        while(!qu.empty()) {
            int x = qu.front();
            qu.pop();
            vis[x] = 0;
            for(int i = head[x];i;i = nex[i]) {
                int y = ver[i];
                if(d[y] > d[x] + weight[i]) {
                    d[y] = d[x] + weight[i];
                    if(!vis[y]) {
                        vis[y] = 1;
                        qu.push(y);
                    }
                }
            }
        }
    }
    ```

2. 任意两点间最短路径
    1. Floyd算法
    适用于小规模图（通常n<500），时间复杂度O(n^3)，floyd算法的本质是动态规划，用D[k,i,j]表示经过若干个编号不超过k的中间节点,从i到j的最短路径长度,则有状态转移方程D[k,i,j] = min(D[k-1,i,j], D[k-1,i,k] + D[k-1,k,j])
    ```
    void floyd() {
        memset(d,0x3f,sizeof(d));
        // 初始化d[i][j]为边权,如果没有边则为无穷大
        for(int i = 1;i<=n;i++) d[i][i] = 0;
        for(int k = 1;k<=n;k++) {
            for(int i = 1;i<=n;i++) {
                for(int j = 1;j<=n;j++) {
                    d[i][j] = min(d[i][j],d[i][k]+d[k][j]);
                }
            }
        }   
    }
    ```



### 刷题笔记

#### P1948 [USACO08JAN] Telephone Lines S
- 来源:洛谷
- 题意:给定一个无向图，n个点，m条边，每条边有一个权值，求从1到n的第k+1大的边权
- 核心思路:
    - 二分答案:这道题的答案显然具有单调性
    - check函数,判断在当前mid值(权值)下,是否存在一条从1到n的路径,且路径上的大于mid的边数不超过k
    - check函数的实现:用双端队列BFS,将大于mid的边权视为1,小于等于mid的边权视为0,在BFS过程中记录从1到每个点的路径上大于mid的边数,如果最终从1到n的路径上大于mid的边数不超过k,则说明当前mid值是可行的
- 核心代码:
```
int check(int x) {//双端队列BFS和dijkstra算法很像,只是因为权值都是0和1,所以可以简单维护最小值
    for(int i = 1;i<=2*p;i++) {
        if(edge[i]<=x) temp_edge[i] = 0;
        else temp_edge[i] = 1;
    }
    memset(d,0x3f,sizeof(d));
    memset(vis,0,sizeof(vis));
    dq.clear();
    dq.push_back(1);
    d[1] = 0;
    while(!dq.empty()) {
        int now = dq.front();
        dq.pop_front();
        if(vis[now]) continue;
        vis[now] = 1;
        for(int i = head[now]; i; i=nex[i]) {
            int to = ver[i];
            if(d[to] <= d[now] + temp_edge[i]) continue;
            if(!temp_edge[i]) {
                dq.push_front(to);
                d[to] = d[now];
            }
            else {
                dq.push_back(to); 
                d[to] = d[now] + 1;
            }
        }
    }
    return d[n];
}
//main函数
    while(l+1<r) {
        int mid = l+r>>1;
        if(check(mid)<=k) r = mid;
        else l=mid;
    }
```

#### P3008 [USACO11JAN] Roads and Planes G
- 来源:洛谷
- 题意:给定一张图,有两种边,一种是道路,一种是航道,道路是无向边,权值为非负,航道是有向边,权值可能是负数,求从1到所有节点的最短路(航线满足:如果有一条A到B的航道,则不存在B到A的道路或航道)
- 核心思路:
    - 有负边,不能用dijkstra,SPFA又会被卡
    - 用双向边进行连通分量划分,并统计每一个连通分量的入度
    - 建立一个连通分量序号的队列,将入度为0的连通分量加入队列
    - 取出队头的连通分量,建立一个优先队列,把该连通分量中所有节点加入优先队列,执行dijkstra算法,如果扩展到别的连通分量的节点,则更新这个节点的最短路,并将该连通分量的入度减1,如果入度为0,则加入连通分量队列
- 核心代码:
```
void solve() {
    queue<int> qu;
    qu.push(belong[s]);
    for(int i = 1;i<=num;i++) if(deg[i]==0) qu.push(i);
    memset(d,0x3f,sizeof(d));
    d[s]=0;
    bool vis[N] = {};
    while(!qu.empty())
    {
        priority_queue<pair<int,int>,vector<pair<int,int>>,greater<pair<int,int>>>pq;
        int now_DAG = qu.front();qu.pop();
        for(auto i : DAG[now_DAG]) pq.push({d[i],i});
        while(!pq.empty()) {
            int now = pq.top().second;
            pq.pop();
            if(vis[now]) continue;
            vis[now] = 1;
            if(d[now]==0x3f3f3f3f) {
                for(int i = head[now]; i; i=nex[i]) {
                    int to = ver[i];
                    if(belong[now] == belong[to]) {
                        // pq.push({d[to],to});
                    }
                    else {
                        if(--deg[belong[to]]==0) qu.push(belong[to]);//防止初始入度为0的连通分量指向其他连通分量,导致无法加入队列
                    }
                }
                continue;
            }
            for(int i = head[now]; i; i=nex[i]) {
                int to = ver[i];
                if(belong[now] == belong[to]) {
                    if(d[to] > d[now] + edge[i]) 
                    d[to] = d[now] + edge[i];
                    pq.push({d[to],to});
                }
                else {
                    if(--deg[belong[to]]==0) qu.push(belong[to]);
                    d[to] = min(d[to],d[now] + edge[i]);
                }
            }
        }
    }
}
```

#### P1347 排序
- 来源:洛谷
- 题意:给定n个数,m个形如A < B的不等式,判断从哪一个不等式开始有矛盾或可以确定每一对变量的大小关系,或者m个不等式后没有矛盾但无法确定每一对变量的大小关系
- 核心思路
    - 用d[i][j]=1表示i< j,0表示未知,如果每一个i,j,d[i][j]和d[j][i]有且仅有一个为1,则说明每一对变量的大小关系都可以确定,如果都为1,则说明有矛盾,如果存在i,j,d[i][j]和d[j][i]都为0,则说明无法确定每一对变量的大小关系
    - 二分答案
- 核心代码
```
bool check(int x) {
    memset(d,0,sizeof(d));
    for(int i = 1; i<=x; i++) {
        d[a[i].first][a[i].second] = 1;
        if(a[i].first==a[i].second) {
            ans = -1;
            return 1;
        }
    }
    for(int k = 1; k<=n; k++) {
        for(int i = 1; i<=n; i++) {
            for(int j = 1; j<=n; j++) {
                d[i][j] |= d[i][k]&d[k][j];
            }
        }
    }
    bool flag = 1;
    for(int i = 1; i<=n; i++) {
        for(int j = i; j<=n; j++) {
            if(i==j) continue;
            if(d[i][j]==1&&d[j][i]==1) {
                ans = -1;
                return 1;
            }
            if(d[i][j]==0 && d[j][i]==0) {
                flag = 0;
            }
        }
    }
    if(flag) ans = 1;
    return flag ;
}
```

#### P10927 Sightseeing trip
- 来源:洛谷
- 题意:给定一个有向图,每条边有一个权值,求最小环的经过的节点(至少包含三个点的环)
- 核心思路:
    - 用floyd算法,枚举k时,如果d[i][j]+edge[j][k]+edge[k][i] < ans,则更新ans和路径
    - 相当于对于每一个k枚举i,j,得到经过k的由编号不超过k的节点构成的最小环
- 核心代码:
```
#include<bits/stdc++.h>
using namespace std;

// #define int long long

const int N = 110;

int n,m,a[N][N],ans=0x3f3f3f3f,d[N][N],pos[N][N];

vector<int>path;

void get_path(int x,int y) {//递归获取路径,值得背
    if(!pos[x][y]) return ;
    get_path(x,pos[x][y]);
    path.push_back(pos[x][y]);
    get_path(pos[x][y],y);
}

signed main() {
    cin>>n>>m;
    memset(a,0x3f,sizeof(a));
    for(int i = 1; i<=n; i++) a[i][i] = 0;
    for(int i = 1; i<=m; i++) {
        int x,y,v;cin>>x>>y>>v;
        a[x][y]=a[y][x]=min(a[x][y],v);
    }
    memcpy(d,a,sizeof(d));
    for(int k = 1; k<=n; k++) {
        for(int i = 1; i<k; i++) {
            for(int j = i+1; j<k; j++) {
                if((long long)d[i][j] + a[j][k] + a[k][i] < ans) {
                    ans=d[i][j] + a[j][k] + a[k][i];
                    path.clear();
                    path.push_back(i);
                    get_path(i,j);
                    path.push_back(j);
                    path.push_back(k);
                }
            }
        }
        for(int i = 1; i<=n; i++) {
            for(int j = 1; j<=n; j++) {
                if(d[i][j]>d[i][k]+d[k][j]) {
                    d[i][j] = d[i][k]+d[k][j];
                    pos[i][j] = k;
                }
            }
        }
    }
    if(ans==0x3f3f3f3f) cout<<"No solution."<<endl;
    else {
        for(auto i : path) {
            cout<<i<<" ";
        }
    }
    return 0;
}
```

#### P2886 [USACO07NOV] Cow Relays G
- 来源:洛谷
- 题意:给定一个无向图,求从起点S到终点E恰好经过N条边的最短路
- 核心思路:
    - 距离矩阵的递推公式如下,类似于矩阵快速幂可以算出结果
    $$
    \forall\, i,j \in [1,P],\quad
    (A^{r+m})[i,j] = \min_{1\le k\le P}\left\{(A^r)[i,k] + (A^m)[k,j]\right\}
    $$
    - 离散化
- 核心代码:
```
#include<bits/stdc++.h>
using namespace std;

const int N = 210;

int n,t,s,e,dis[1000010],tot;

int ans[N][N],d[N][N];

void mul(int (&a)[N][N],int (&b)[N][N]) {
    int temp[N][N];
    memset(temp,0x3f,sizeof(temp));
    for(int k = 1; k<=tot; k++) {
        for(int i = 1; i<=tot; i++) {
            for(int j = 1; j<=tot; j++) {
                temp[i][j] = min(temp[i][j],a[i][k] + b[k][j]);
            }
        }
    }
    memcpy(a,temp,sizeof(a));
}

void fpow() {
    for(int i = 1; i <= tot; i++) {
        for(int j = 1; j <= tot; j++) {
            if(i == j) ans[i][j] = 0;
            else ans[i][j] = 0x3f3f3f3f;
        }
    }
    while(n) {
        if(n&1) {
            mul(ans,d);
        }
        n>>=1;
        mul(d,d);
    }
}

int main() {
    cin>>n>>t>>s>>e;
    memset(d,0x3f,sizeof(d));
    for(int i = 1;i <=t;i++) {
        int w,u,v;cin>>w>>u>>v;
        if(!dis[u]) dis[u] = ++tot;
        if(!dis[v]) dis[v] = ++tot;
        d[dis[u]][dis[v]] = min(d[dis[u]][dis[v]], w);
        d[dis[v]][dis[u]] = min(d[dis[v]][dis[u]], w);
    }
    fpow();
    cout<<ans[dis[s]][dis[e]]<<endl;
    return 0;
}
```

# 最小生成树
定义:在一个连通图中,包含图中所有顶点的树叫做生成树,生成树中权值之和最小的叫做最小生成树
1. kruskal算法
    - 适用于稀疏图,时间复杂度O(ElogE),空间复杂度O(V)
    - 核心思路:将所有边按照权值从小到大排序,依次加入生成树中,如果加入的边连接了两个不同的连通分量,则将它们合并,直到生成树中包含了所有顶点
```
struct Edge {
    int u,v,w;
    bool operator < (const Edge &e) const {
        return w < e.w;
    }
}edge[M];
int fa[N],n,m,ans;
int get(int x) {
    if(fa[x]==x) return x;
    return fa[x] = get(fa[x]);
}
void kruskal() {
    sort(edge+1,edge+1+m);
    for(int i = 1; i<=n; i++) fa[i] = i;
    for(int i = 1; i<=m; i++) {
        int x = get(edge[i].u);
        int y = get(edge[i].v);
        if(x!=y) {
            fa[x] = y;
            ans += edge[i].w;
        }
    }
}
```
2. prim算法
    - 适用于稠密图,时间复杂度O(V^2),空间复杂度O(V)
    - 核心思路:从一个顶点开始,每次选择一条权值最小的边,将一个新的顶点加入生成树中,直到生成树中包含了所有顶点
```
void prim() {
    memset(d,0x3f,sizeof(d));
    d[1] = 0;
    for(int i = 1; i<=n; i++) {
        int x = -1;
        for(int j = 1; j<=n; j++) {
            if(!vis[j]&&(x==-1||d[j]<d[x])) x = j;
        }
        vis[x] = 1;
        ans += d[x];
        for(int j = head[x]; j; j=nex[j]) {
            int y = ver[j];
            if(!vis[y]&&edge[j]<d[y]) d[y] = edge[j];
        }
    }
}
```


### 刷题笔记
#### P10928 走廊泼水节
- 来源:洛谷
- 题意:给定一棵树,要求加边成完全图,加完后最小生成树还是初始的树,求加边的最小权值之和
- 核心思路:
    - 先将所有边按照权值从小到大排序,然后依次加入边,如果加入的边连接了两个不同的连通分量,则将它们合并,直到生成树中包含了所有顶点
    - 由于初始的树已经是最小生成树了,所以我们只能加入权值大于初始树中最大边权的边,否则会改变最小生成树的结构
- 核心代码:
```
void kruskal() {
    sort(edge+1,edge+n);
    for(int i = 1; i<n; i++) {
        int x = get(edge[i].x);
        int y = get(edge[i].y);
        int w = edge[i].w;
        if(x==y) continue;
        ans += (long long ) (size[x]*size[y]-1)*(w+1);
        merge(x,y);
    }
}
```

#### UVA1537 Picnic Planning
- 来源:UVA OJ
- 题意:给定一个无向图,求最小生成树的权值之和,限制根节点的读书不超过k(k度限制的最小生成树)
- 核心思路:
    - 先将根节点去掉,对剩下的图求最小生成树
    - 如果此时连通分量(不包括根节点)的数量cnt大于k,则说明无法满足条件
    - 接下来我们从每一个连通分量中选择一条权值最小的边连接到根节点
    - 根节点的度数限制还剩k-cnt,我们遍历剩下的边(1,x),求出x到1的路径上权值最大的边,如果这个边的权值大于(1,x)的权值,则说明可以用(1,x)替换掉这个边,从而减小总权值
- 核心代码:
```
#include <bits/stdc++.h>
using namespace std;

const int N = 510;

map<string,int> mp;

vector<pair<int,int>> eg[N];

vector<int> num;

struct node{
    int x,y,w,f;
    bool operator<(const node & other) const {
        return w<other.w;
    }
}edge[N];

int q,n,s,ans,tot,fa[N],cnt,deg,mx,a,b;

void init() {
    num.clear();
    ans = 0;
    tot = 1;
    cnt = 0;
    mp.clear();
    mp["Park"]=1;
    for(int i = 1;i<=50;i++) {
        fa[i] = i;
    }
    deg=0;
    for(int i = 1; i<=50; i++) eg[i].clear();
}

int get(int x) {
    if(fa[x] == x) return x;
    return fa[x] = get(fa[x]);
}

void merge(int x,int y) {
    x = get(x),y = get(y);
    fa[x] = y;
}

bool dfs(int f,int x) {
    // cout<<"f: "<<f<<" x: "<<x<<endl;
    if(x==1) return 1;
    for(auto i : eg[x]) {
        if(i.first==f) continue;
        int temp = mx;
        mx = max(mx,i.second);
        // cout<<"mx: "<<mx<<endl;
        if(dfs(x,i.first)) return 1;
        mx=temp;
    }
    return 0;
}

void K_kruskal() {
    sort(edge+1,edge+1+n);
    for(int i = 1;i<=n;i++) {
        if(edge[i].x==1) continue;
        int x = edge[i].x, y = edge[i].y, w = edge[i].w;
        if(get(x)==get(y)) continue;
        merge(x,y);
        cnt++;
        ans += w;
        edge[i].f = 1;
        eg[x].push_back({y,w});
        eg[y].push_back({x,w});
    }
    cnt = tot-1-cnt;
    if(cnt>s) {
        ans = -1;
        return ;
    }
    bool vis[30] = {};
    for(int i = 1; i<=n; i++) {
        int x = edge[i].x, y= edge[i].y;
        if(x!=1 || vis[get(y)]) continue;
        int w = edge[i].w;
        vis[get(y)] = 1;
        ans += w;
        edge[i].f = 1;
        eg[x].push_back({y,w});
        eg[y].push_back({x,w});
    }
    for(int i = 1; i<=n; i++) {
        int x = edge[i].x, y = edge[i].y;
        if(x!=1 || edge[i].f) continue;
        int w = edge[i].w;
        mx = 0;
        dfs(1,y);
        if(mx > w) num.push_back(mx-w);
    }
    int size = num.size();
    sort(num.begin(),num.end());
    for(int i = 1; i<=s-cnt;i++) {
        if(size-i<0) break;
        ans-=num[size-i];
    }
}

int main() {
    cin>>q;
    while(q--) {
        cin>>n;
        init();
        for(int i = 1; i<=n; i++) {
            string x,y;
            int w;
            cin>>x>>y>>w;
            if(!mp.count(x)) mp[x] = ++tot;
            if(!mp.count(y)) mp[y] = ++tot;
            if(mp[x]==1 || mp[y] == 1) deg++;
            a = mp[x],b = mp[y];
            if(b==1) swap(a,b);
            edge[i] = {a,b,w,0};
        }
        cin>>s;
        K_kruskal();
        cout<<"Total miles driven: "<<ans<<endl;
        if(q) cout<<endl;
    }
    return 0;
}
```

#### P10929 黑暗城堡
- 来源:洛谷
- 题意:给定n个点,m条边,求最短路径生成树的方案数
- 核心思路:
    - 先用dijkstra算法求出从1到每个点的最短路径长度
    -  然后对于每条边(u,v,w),如果d[u]+w==d[v],则说明这条边在最短路径树上,将子节点连接到父节点的方案树加一
    - 最后连乘每个节点的方案数,得到最终的方案数
- 核心代码:
```
void SPT() {
    for(int i = 1;i<=m;i++) {
        int x = edge[i].x, y = edge[i].y, w = edge[i].w;
        if(dist[x] + w == dist[y]) {
            cnt[y]++;
        }
        if(dist[y] + w == dist[x]) {
            cnt[x]++;
        }
    }

    for(int i = 2; i<=n; i++) {
        int x=d[i].second;
        ans = ans * cnt[x] % mod;
    }
}
```

# 树的直径与最近公共祖先
1. 树的直径
    - 定义:树中最远两点的距离被称为树的直径
    1. 树形DP求直径
    - 核心思路:对于树中的每个节点,求出以该节点为根的子树的最大深度d[x],设x的子节点为yi,则有d[x]=max(d[yi]+edge[x][yi]),树的直径为max(d[yi]+d[yj]+edge[x][yi]+edge[x][yj]),其中i!=j,当我们枚举到yi时,d[x]中存的就是x从yj(j< i>)出发的最大深度,所以树的直径公式简化为max(d[yi]+edge[x][yi]+d[x])
    ```
    void dp(int x) {
        v[x] = 1;
        for(int i = head[x]; i; i = nex[i]) {
            int y = ver[i];
            if(v[y]) continue;
            dp(y);
            ans = max(ans,d[y]+edge[i]+d[x]);
            d[x] = max(d[x],d[y]+edge[i]);
        }
    }
    ```
    2. 两次搜索求直径
    - 核心思路:从任意一个节点出发,用BFS或DFS找到距离它最远的节点A,然后以A为起点再进行一次BFS或DFS,找到距离A最远的节点B,则A和B之间的距离就是树的直径
    ```
    void dfs(int x,int pre,int w,int t) {
        d[pre] = d[x] + w;
        if(t==2) {
            fa[x] = pre;//记录前驱节点,用来保存直径路径
        }
        for(int i = head[x]; i; i = nex[i]) {
            int y = ver[i];
            if(y==pre) continue;
            dfs(y,x,weight[i],t);
        }
        if(d[x]>d[leaf]) leaf = x;
    }

    //main
    dfs(1,0,0,1);
    dfs(leaf,0,0,2);
    ```
    - 两次dfs可以求出树的直径,并且在第二次dfs中记录前驱节点,从而得到直径路径上的所有节点

2. 最近公共祖先(LCA)
    - 树上倍增法
    ```
    int lca(int x,int y) {
        if(dep[x]<dep[y]) swap(x,y);
        for(int i = N-1; i>=0; i--) {
            if(dep[fa[x][i]>=dep[y]]) {
                x = fa[x][i];
            }
        }//将x提升到和y同一深度
        if(x==y) return x;
        for(int i = N-1; i>=0; i--) {
            if(fa[x][i]!=fa[y][i]) {
                x = fa[x][i];
                y = fa[y][i];
            }
        }
        return fa[x][0];
    }
    ```

    - tarjan算法求LCA
    tarjan算法是一种离线算法,将已回溯的点标记为2,访问一次的点标记为1,当一个点x正在被回溯时,扫描所有关于x的询问,如果另一个点y的标记为2,此时y向上遍历到第一个标记为1的点,即为x和y的最近公共祖先
    ```
    void add_query(int x,int y,int id) {
        query[x].push_back(y), query_id[x].push_back(id);
        query[y].push_back(x), query_id[y].push_back(id);
    }
    void tarjan(int x) {
        v[x] = 1;
        for(int i = head[x]; i; i = nex[i]) {
            int y = ver[i];
            if(v[y]) continue;
            tarjan(y);
            fa[y] = x;
        }
        for(int i = 0; i<query[x].size(); i++) {
            int y = query[x][i], id = query_id[x][i];
            if(v[y] == 2) {
                ans[id] = get(y);//ans[id]存储第id个询问的答案(即x和y的最近公共祖先)
            }
        }
    }
    ```

### 刷题笔记
#### P3629 [APIO2010] 巡逻
- 来源:洛谷
- 题意:给定一棵树,要求遍历所有的边(边权均为1),为了减小总路程,可以加入一条或两条边,且加入的边必须恰好遍历一次,求加边后的最小总路程
- 核心思路:
    - 不加边时总路长为(n-1)*2
    - 显然在一棵树上加一条边就会形成一个环,总路程会减少L-1,其中L是环上除了加的边以外的长度,所以我们要找到一条最长的路径加入边,使得总路程减少最多
    - 只加一条边时,我们求出树的直径,设直径路径上的节点为x,y,则加入一条边连接x和y,总路长为(n-1)*2-直径长度+1
    - 加第二条边时,需要注意,此时会形成第二个环,如果这两个环有重叠部分,直接按第一个环的方式计算会导致重叠部分在被减一次,就没有被遍历到,与题意不符,而实际上重接部分最终应该被遍历两次,所以我们把第一个环的边权改成-1,这样再求树的直径,得到的就是第二个环的长度
    - 注意新加的边要恰好被遍历一次,所以加的第一条边不用加到树中
- 核心代码

```
#include<bits/stdc++.h>
using namespace std;

const int N = 100010;

int n,k;

int d[N],leaf,fa[N],dist[N];

int L1,L2,vis[N];

int head[N],nex[N*2],weight[N*2],ver[N*2],tot;

void dfs(int now, int pre, int w, int t) {
    d[now] = d[pre] + w;
    if(t==2) fa[now] = pre;
    for(int i = head[now]; i; i = nex[i]) {
        int y = ver[i], w = weight[i];
        if(y==pre) continue;
        dfs(y,now,w,t);
    }
    if(d[now]>d[leaf]) leaf = now;
}

void add(int x,int y,int w) {
    ver[++tot] = y;
    nex[tot] = head[x];
    weight[tot] = w;
    head[x] = tot;
}

void dp(int x,int pre) {
    for(int i = head[x]; i; i = nex[i]) {
        int y = ver[i];
        if(y==pre) continue;
        if(vis[x]&&vis[y]) weight[i] = -1;
        dp(y,x);
        L2=max(L2,dist[x] + dist[y] + weight[i]);
        dist[x] = max(dist[x],dist[y]+weight[i]);
    }
}

int main() {
    cin >> n >> k;
    for(int i = 1; i<n; i++) {
        int x,y;cin>>x>>y;
        add(x,y,1);add(y,x,1);
    }
    dfs(1,0,0,1);
    dfs(leaf,0,0,2);
    L1=d[leaf];
    if(k==1) {
        cout<<2*(n-1) - L1 + 1<<endl;
        return 0;
    }
    for(int i = leaf;i;i=fa[i]) vis[i] = 1;
    dp(1,0);
    cout<<2*n-L1-L2<<endl;
    return 0;
}

```

#### P1099 [NOIP 2007 提高组] 树网的核
- 来源:洛谷
- 题意:给定一棵树,求一个路径F,它是直径上的一段长度不超过s的路径,使得偏心距最小,求最小偏心距
- 核心思路:
    - 引理:一棵树的所有直径必定相交于同一点
    - 引理:一棵树的所有直径的中点必定相交于同一点(这一点可能在一条边的内部)
    - 引理:直径的选择不影响树的偏心距
    - 先求出树的直径,设为u1,u2,...,ut.设d[ui]为从ui出发不经过u1,u2,...,ut的最长路径长度,则树的偏心距为,则以ui,uj为端点的路径的偏心距为
    $$
    \max\left(\max_{i\le k\le j}\{d[u_k]\},\ \mathrm{dist}(u_1,u_i),\ \mathrm{dist}(u_j,u_t)\right)
    $$
    - 由直径的最长性,可以化简成
    $$
    \max\left(\max_{1\le k\le t}\{d[u_k]\},\ \mathrm{dist}(u_1,u_i),\ \mathrm{dist}(u_j,u_t)\right)
    $$
- 核心代码:
```
#include<bits/stdc++.h>
using namespace std;

const int N = 300010;

int n,s;

int tot,head[N],nex[N],weight[N],ver[N];

int leaf,d[N],fa[N];

int cnt,pres[N],posts[N],dia[N],vis[N];

void add(int x,int y,int w) {
    ver[++tot] = y;
    nex[tot] = head[x];
    weight[tot] = w;
    head[x] = tot;
}

void dfs(int x,int pre,int w,int t) {
    d[x] = d[pre] + w;
    if(t==2) fa[x] = pre;
    for(int i = head[x];i;i=nex[i]) {
        int y = ver[i];
        if(y == pre || vis[y]) continue;
        dfs(y,x,weight[i],t);
    }
    if(d[x]>d[leaf]) leaf = x;
}

void get_dia() {
    dfs(1,0,0,1);
    dfs(leaf,0,0,2);
    for(int i = leaf;i;i=fa[i]) {
        dia[++cnt] = i;
        pres[cnt] = d[i];
    }
    reverse(dia + 1, dia + cnt + 1);
    reverse(pres + 1, pres + cnt + 1);
    for(int i = 1;i<=cnt;i++) {
        posts[i] = pres[cnt] - pres[i];
    }
}

void solve() {
    for(int i = 1; i<=cnt; i++) {
        vis[dia[i]] = 1;
    }
    int maxd = 0;
    for(int i = 1; i<=cnt; i++) {
        memset(d, 0, sizeof(d));
        d[dia[i]] = 0;leaf = 0;
        dfs(dia[i],0,0,1);
        maxd=max(d[leaf],maxd);
    }
    int l = 1, r = 1;
    int mince = 1<<30;
    for(;l<=cnt;l++) {
        while(r<=cnt && pres[r+1] - pres[l] <= s) r++;
        mince = min(max(maxd,max(pres[l],posts[r])),mince);
    }
    cout<<mince;
}

int main() {
    cin>>n>>s;
    for(int i = 1; i<n; i++) {
        int x,y,w;cin>>x>>y>>w;
        add(x,y,w);add(y,x,w);
    }
    get_dia();
    solve();
    return 0;
}
```

#### P10931 闇の連鎖
- 来源:洛谷
- 题意:给定一张无向图,有两类边,一种是树边,一种是非树边,第一次切断一条树边,第二次切断一条非树边,求有多少种方法把图分成两个不连通的部分
- 核心思路:
    - 显然一条非树边能形成一个环
    - 遍历所有的非树边,对于每一条非树边(u,v),则u和v之间的路径权值加一
    - 遍历所有树边,如果树边(u,v)的权值为0,则说明切断这条树边后,u和v之间没有非树边连接,所以切断这条树边后,图就被分成了两个不连通的部分,此时答案加M,若权值为1,则说明切断这条树边后,u和v之间还有一条非树边连接,此时答案加1
    - 直接修改树边的权值会超时,所以我们采用树上差分的方式,对于每一条非树边(u,v),我们找到u和v的最近公共祖先lca(u,v),则u权值加一,v权值加一,lca(u,v)权值减二,最后再对树进行一次dfs,将差分数组还原成原数组
- 核心代码:
```
#include<bits/stdc++.h>
using namespace std;

const int N = 100010, M = 200010;

int n,m;

int head[N], nex[2*N], ver[2*N], tot;

int dep[N],fa[N][20];

int a[N],F[N];

int ans;

void add(int x,int y) {
    ver[++tot] = y;
    nex[tot] = head[x];
    head[x] = tot;
}

void bfs() {
    queue<int>qu;
    qu.push(1);
    dep[1] = 1;
    while(!qu.empty()){
        int x = qu.front();qu.pop();
        for(int i = head[x];i;i=nex[i]) {
            int y = ver[i];
            if(dep[y]) continue;
            dep[y] = dep[x] + 1;
            fa[y][0] = x;
            for(int i = 1;i<20;i++) {
                fa[y][i] = fa[fa[y][i-1]][i-1];
            }
            qu.push(y);
        }
    }
}

int lca(int x, int y) {
    if(dep[x] < dep[y]) swap(x,y);
    for(int i = 19;i>=0;i--) {
        if(dep[fa[x][i]]>=dep[y]) x = fa[x][i];
    }
    if(x==y) return x;
    for(int i = 19;i>=0;i--) {
        if(fa[x][i]!=fa[y][i]) x = fa[x][i],y = fa[y][i];
    }
    return fa[x][0];
}

void dfs(int x,int pre){
    F[x] = a[x];
    for(int i = head[x];i;i=nex[i]) {
        int y = ver[i];
        if(y==pre) continue;
        dfs(y,x);
        F[x]+=F[y];
    }
}

int main() {
    cin>>n>>m;
    for(int i = 1; i<n; i++) {
        int x,y;cin>>x>>y;
        add(x,y);add(y,x);
    }
    bfs();
    for(int i = 1; i<=m; i++) {
        int x,y;cin>>x>>y;
        a[x]++;a[y]++;
        a[lca(x,y)]-=2;
    }
    dfs(1,0);
    for(int i = 2;i<=n;i++) {
        if(F[i]==0) ans+=m;
        else if(F[i]==1) ans++;
    }
    cout<<ans<<endl;
    return 0;
}
```

#### P10930 异象石
- 来源:洛谷
- 题意:给定一棵树,接下来M个时刻,每个时刻会发生三种类型的事件之一:
    - 1 某个节点出现异象石
    - 2 某个节点的异象石消失
    - 3 询问所有异象石连通的边集的总长度的最小值
- 核心思路:
    - 把所有有异象石的节点按dfs序存在一个首位相接数组中,我们只需要求出这个数组中相邻的两个节点之间的距离之和,再除以2就是答案了
    - 当发生1,2事件时维护数组和答案即可
- 核心代码:
```
    int t;
    cin>>t;
    vis[t]=!vis[t];
    if(vis[t]) st.insert({dfn[t],t});
    auto it1=st.lower_bound({dfn[t],t}),it2=st.upper_bound({dfn[t],t});
    int a=(it1==st.begin()? (*--st.end()).se:(*--it1).se);
    int b=(it2==st.end()? (*st.begin()).se:(*it2).se);
    // swap(a,b);
    if(!vis[t]) st.erase({dfn[t],t});
    int d=get_dis(t,a)+get_dis(t,b)-get_dis(a,b);
    if(vis[t]) ans+=d;
    else ans-=d;
```

#### P4180 [BJWC2010] 严格次小生成树
- 来源:洛谷
- 题意:给定一张无向图,求严格次小生成树的权值之和
- 核心思路:
    - 先求出最小生成树,设为T,对于每一条非树边(u,v,w),加入后会形成一个环,我们找到uv树边路径上的最大边权val1和严格次大边权val2,如果w>val1,则加入后边权变成sum-val1+w,形成一个候选答案,如果w=val1,则加入后边权变成sum-val2+w,形成另一个候选答案,我们在所有候选答案中取最小的那个就是严格次小生成树的权值之和
    - 现在的问题就转换成了如何在树上求出u和v之间的最大边权和严格次大边权,我们可以用树上倍增法,在倍增表中记录每个节点到它的2^i祖先路径上的最大边权和严格次大边权,这样就可以在O(logN)的时间内求出u和v之间的最大边权和严格次大边权了
    $$
    F[x,k] = F[F[x,k-1],k-1]
    $$

    $$
    G[x,k,0] = \max\big(G[x,k-1,0],\ G[F[x,k-1],k-1,0]\big)
    $$

    $$
    G[x,k,1] =
    \begin{cases}
    \max\big(G[x,k-1,1],\ G[F[x,k-1],k-1,1]\big), & G[x,k-1,0] = G[F[x,k-1],k-1,0] \\
    \max\big(G[x,k-1,0],\ G[F[x,k-1],k-1,1]\big), & G[x,k-1,0] < G[F[x,k-1],k-1,0] \\
    \max\big(G[x,k-1,1],\ G[F[x,k-1],k-1,0]\big), & G[x,k-1,0] > G[F[x,k-1],k-1,0]
    \end{cases}
    $$

    当 $k=0$ 时，有初值：

    $$
    F[x,0] = \mathrm{father}(x)
    $$

    $$
    G[x,0,0] = \mathrm{edge}(x,\mathrm{father}(x))
    $$

    $$
    G[x,0,1] = -\infty \quad (\text{不存在次大值})
    $$
- 核心代码:
```
void dfs(int x,int pre) {
    for(int i = head[x];i;i=nex[i]) {
        int y = ver[i];
        if(y==pre) continue;
        dep[y] = dep[x] + 1;
        f[y][0] = x;
        g[y][0][0] = weight[i];
        g[y][0][1] = -1;
        for(int i = 1;i<20;i++) {
            f[y][i] = f[f[y][i-1]][i-1];
            g[y][i][0] = max(g[y][i-1][0],g[f[y][i-1]][i-1][0]);
            int a = g[y][i-1][0], b = g[f[y][i-1]][i-1][0];
            if(a==b) g[y][i][1] = max(g[y][i-1][1],g[f[y][i-1]][i-1][1]);
            else if(a<b) g[y][i][1] = max(g[y][i-1][0],g[f[y][i-1]][i-1][1]);
            else g[y][i][1] = max(g[y][i-1][1],g[f[y][i-1]][i-1][0]);
        }
        dfs(y,x);
    }
}

int lca(int x,int y) {
    res.clear();
    if(dep[x]<dep[y]) swap(x,y);
    for(int i = 19;i>=0;i--) {
        if(dep[f[x][i]]>=dep[y]) {
            res.push_back(g[x][i][0]);
            res.push_back(g[x][i][1]);
            x = f[x][i];
        }
    }
    if(x==y) return x;
    for(int i = 19;i>=0;i--) {
        if(f[x][i]!=f[y][i]) {
            res.push_back(g[x][i][0]);
            res.push_back(g[x][i][1]);
            res.push_back(g[y][i][0]);
            res.push_back(g[y][i][1]);
            x = f[x][i];
            y = f[y][i];
        }
    }
    res.push_back(g[x][0][0]);
    res.push_back(g[x][0][1]);
    res.push_back(g[y][0][0]);
    res.push_back(g[y][0][1]);
    return f[x][0];
}

void solve() {
    for(int i = 1;i<=m;i++) {
        if(edge[i].f) continue;
        int x = edge[i].x, y = edge[i].y, w = edge[i].w;
        if(x == y) continue; 
        lca(x,y);
        int max1 = -1, max2 = -1;
        for(int val : res) {
            if(val > max1) {
                max2 = max1;
                max1 = val;
            } else if(val != max1 && val > max2) {
                max2 = val;
            }
        }
        
        if(w > max1) {
            ans.push_back(w - max1);
        } else if(max2 != -1 && w == max1) {
            ans.push_back(w - max2);
        }
    }

    sort(ans.begin(),ans.end());
}
```