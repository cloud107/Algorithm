# 树与图的遍历
1. 用三个数组模拟链表表示一棵树
```
void add(int x,int y) {
    ver[+++tot] = y, next[tot] = head[x], head[x] = tot;
    deg[y]++;//需要入度的时候加这一行
}
```
2. 树的深度
```
void dfs(int x) {
    v[x] = 1;//标记被访问
    for(int i = head[x]; i; i = next[i]) {
        int y = ver[i];
        if(v[y]) continue;
        d[y] = d[x] + 1;
        dfs(y);
    }
}
```
3. 树的重心
删除一个节点后树会分裂出多个子树,令最大的子树最小的节点就是树的重心
```
void dfs(int x) {
    v[x] = 1; size[x] = 1;
    for(int i = head[x]; i; i = next[i]) {
        int y = ver[i];
        if(v[y]) continue;
        dfs(y);
        size[x] += size[y];
        max_part = max(max_part, size[y]);
    }
    max_part = max(max_part, n - size[x]);
    if(max_part < ans) {
        ans = max_part;
        pos = x;
    }
}
```
# 图的连通块划分
```
void dfs(int x) {
    v[x] = 1;
    for(int i = head[x]; i; i = next[i]) {
        int y = ver[i];
        if(v[y]) continue;
        dfs(y);
    }
}
for(int i = 1; i <= n; i++) {
    if(!v[i]) {
        cnt++;
        dfs(i);
    }
}
```
# 广度优先遍历
广搜确定深度
```
void bfs() {
    memset(d, 0, sizeof(d));
    queue<int> q;
    q.push(1); d[1] = 1;
    while(q.size() > 0) {
        int x = q.front(); q.pop();
        for(int i = head[x]; i; i = next[i]) {
            int y = ver[i];
            if(v[y]) continue;
            d[y] = d[x] +1;
            q.push(y);
        }
    }
}
```
- 两段性: 访问完所有第i层的节点后,才会开始访问第i+1层的节点
- 单调性: 任意时刻队列中之后又两个层次的节点
# 拓扑排序
```
void topsort() {
    queue<int> q;
    for(int i = 1; i<=n; i++)
        if(deg[i] == 0) q.push(i);
    while(q.size()) {
        int x.front();q.pop();
        a[++cnt] = x;
        for(int i = head[x]; i; i = next[i]) {
            int y = ver[i];
            if(--deg[y] == 0) q.push(y);
        }
    }
}
```
# 深度优先搜索
```
void dfs() {
    if(check()) return ;
    // 剪枝
    for(int i = 0; i<N; i++) {
        // 向前演化
        dfs()
        // 向后回溯
    }
    return ;
}
```

# 剪枝技巧
- 优化搜索顺序
- 排除等效冗余
- 可行性剪枝
- 最优性剪枝
- 记忆化
# 迭代加深
```
bool dfs(int now) {
    if(now>dep) return 0;
    if(check()) return 1;
    // 剪枝
    for(int i = 0; i<N; i++) {
        // 向前演化
        if(dfs()) return 1;
        // 向后回溯
    }
    return 0;
}
while(!dfs(0)) {
    dep++;
}
```
# IDA*算法
- 设计一个代价函数，估计从目前状态到结束大概需要的步数，这个步数不能大于真实值，越接近真实值效果越好。
```
int eva() {

}
bool dfs(int now) {
    if(now + eva() > dep) return 0;
    if(check()) return 1;
    // 剪枝
    for(int i = 0; i<N; i++) {
        // 向前演化
        if(dfs()) return 1;
        // 向后回溯
    }
    return 0;
}
while(!dfs(0)) {
    dep++;
}
```
---
## trick
1. `memset(temp,chess,sizeof(temp))`: 把chess复制到temp中
2. 用来回溯的暂存的数组或数应当声明成临时变量，否则在回溯的过程中会导致混乱
3. 多测的题目一定要记得初始化
4. int gcd(int a, int b) {
    return b ? gcd(b,a%b) : b;
}