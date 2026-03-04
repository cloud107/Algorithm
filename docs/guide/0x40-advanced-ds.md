# 并查集

1. get操作:查询一个元素属于哪个集合
```
int get(int x) {
    if(x==fa[x]) return x;
    else return fa[x]=get(fa[x]);//路径压缩
}
```
2. merge操作:合并两个集合
```
void merge(int x,int y) {
    fa[get(x)]=get(y);
}
```
3. 边带权:d[x]表示x到它的父节点的权值,在get操作中更新d[x]以保持正确的权值关系,merge操作中需要更新d数组以保持权值关系
```
int get(int x) {
    if(x==fa[x]) return x;
    int root = get(fa[x]);
    d[x] += d[fa[x]];
    return fa[x] = root;
}
void merge(int x,int y) {
    int fx = get(x), fy = get(y);
    fa[fx] = fy;
    //根据题意更新权值 d[fx] = ;
}
```
4. 扩展域:将一个点按属性分成多个点,按属性进行合并

### 刷题笔记
#### P1955 [NOI2015] 程序自动分析
- 来源:洛谷
- 题目大意:给定n个约束条件(如两数相等或不相等)，判断是否存在一个满足所有约束条件的数列。
- 核心思路:使用并查集将相等的数放在同一个集合中,然后检查不相等的数是否在同一个集合中，如果是则矛盾。
- 核心代码:
```
//常规并查集,略
```
- 易错点:注意要先进行离散化

#### UVA1316 Supermarket
- 来源:UVA
- 题目大意:给定n个商品,每个商品有一个价格和一个保质期,每天限卖1件,求最多能卖多少钱
- 核心思路
    - 先将商品按照价格从高到低排序
    - 使用并查集维护每天是否已经卖出商品,对于每个商品,从它的保质期开始往前找第一个没有卖出商品的天数,如果找到了就卖出这个商品
- 核心代码
```
略
```

#### P1196 [NOI2002] 银河英雄传说
- 来源:洛谷
- 题目大意:有n个星舰,起初每个星舰都是独立的,有m条命令,每条命令是合并两个星舰(将一个队列按原顺序排在另一个队尾)或者查询两个星舰是否在同一个舰队中,若在同一个舰队中,输出它们之间的距离(前者在后者前面多少个星舰),否则输出-1;
- 核心思路:
    - 使用并查集维护每个星舰所属的舰队,使用一个数组d[x]表示x到它的父节点的距离,在get操作中更新d[x]以保持正确的距离关系,merge操作中需要更新d数组以保持距离关系
- 核心代码
```
int get(int x) {
    if(x==fa[x]) return x;
    int root = get(fa[x]);
    d[x] += d[fa[x]];
    return fa[x] = root;
}
void merge(int x,int y) {
    int fx = get(x),fy = get(y);
    fa[fx] = fy;
    d[fx] = size[fy];
    size[fy] += size[fx];
}
```

#### P5937 [CEOI 1999] Parity Game
- 来源:洛谷
- 题目大意:给定一个01序列,每次给出一个区间[l,r],给出m个询问,每次回答区间的1的个数的奇偶性,求出一个最小的k,使得前k个条件满足,而第k+1个条件不满足,如果所有条件都满足,输出m
- 核心思路:
    - 试想一个前缀和数组,若[l,r]区间的1的个数为偶数,则sum[l-1]和sum[r]的奇偶性相同,否则不同,因此可以使用并查集维护每个前缀和的奇偶性
    - 每次先检查l-1和r是否在同一个集合中,如果在同一个集合中,则检查它们到根节点的路权的异或值(偶数则为0,奇数则为1),不满足就矛盾;如果不在同一个集合中,则根据条件合并它们
- 核心代码
```
int get(int x) {
    if(x==fa[x]) return x;
    int root = get(fa[x]);
    d[x] ^= d[fa[x]];
    return fa[x] = root;
}
void merge(int x,int y,int w) {
    int fx = get(x), fy = get(y);
    fa[fx] = fy;
    d[fx] = d[y] ^ d[x] ^ w;
}
```

#### P2024 [NOI2001] 食物链
- 来源:洛谷
- 题目大意:有n种动物,每两种动物之间有三种关系:1.同类 2.前者吃后者 3.后者吃前者,给出k个句话,(op,x,y),op为1表示x和y是同类,op为2表示x吃y,判断每句话是否矛盾,输出矛盾的句子数
- 核心思路:
    - 可以将每种关系看作一个集合,对于每个动物x,可以将它分成三个点:x(同类),x+n(吃),x+2n(被吃),对于op=1的句子,合并x和y,x+n和y+n,x+2n和y+2n;对于op=2的句子,合并x+n和y,x+2n和y+n,x和y+2n;每次合并前先检查是否矛盾
- 核心代码
```
    while(k--) {
        int op,x,y;cin>>op>>x>>y;
        if(x>n||y>n) {ans++;continue;}
        if(op==1) {
            if(get(x+n) == get(y) || get(x) == get(y+n)) {
                ans++;
            }
            else {
                fa[get(x)] = get(y);
                fa[get(x+n)] = get(y+n);
                fa[get(x+n+n)] = get(y+n+n);
            }
        }
        if(op==2) {
            if(get(x)==get(y) || get(x)==get(y+n)) {
                ans++;
            }
            else {
                fa[get(x+n)] = get(y);
                fa[get(x+n+n)] = get((y+n));
                fa[get(x)] = get(y+n+n);
            }
        }
    }
```


# 树状数组

![树状数组](..\public\images\树状数组.png)

以前缀和举例

1. 查询:
```
int ask(int x) {
    int res = 0;
    for(int i = x; i; i-=i&-i) res +=tr[i];
    return res;
}
```
2. 修改:
```
void add(int x,int y) {
    for(int i = x; i<=n; i+=i&-1) tr[i] += y;
}
```

#### 刷题笔记
### P10589 楼兰图腾
- 来源:洛谷
- 题目大意:给定n个y值(已经对x值递增排序),求组成的"v"和"∧"的数量
- 核心思路:
    - 以"v"为例,正序枚举y,对于每一个y[i],首先利用树状数组查询前面大于y[i]的数量(加入left[i]),最后将当前y[i]加入树状数组中;再倒序枚举y,对于每一个y[i],首先利用树状数组查询前面小于y[i]的数量(加入right[i]),最后将当前y[i]加入树状数组中;最后统计答案累加left[i]*right[i];
- 核心代码
```
基础树状数组代码,略
```

### P3368 【模板】树状数组 2
- 来源:洛谷
- 题目大意:给定n个数,进行m次操作,每次操作为将区间内每一个数加上x,或查询某个位置的数的值
- 核心思路:
    - 先求出n个数的差分数组,加入树状数组中,对于区间加x的操作,相当于在差分数组的l位置加x,r+1位置减x;对于查询某个位置的数的值,相当于查询差分数组前缀和
- 核心代码
```
模版题,略
```

### P3372 【模板】线段树 1
- 来源:洛谷
- 题目大意:给定n个数,进行m次操作,每次操作为将区间内每一个数加上x,或查询某个区间的数的和
- 核心思路
    - 正解是使用线段树,但也可以使用树状数组维护差分数组,对于区间加x的操作,相当于在差分数组的l位置加x,r+1位置减x;对于查询某个区间的数的和,相当于查询差分数组前缀和前缀和即
    \[
    \sum_{i=1}^{x}\sum_{j=1}^{i} b[j]
    = \sum_{i=1}^{x}(x-i+1)\,b[i]
    = (x+1)\sum_{i=1}^{x} b[i] - \sum_{i=1}^{x} i\,b[i]
    \]
    - 所以我们维护两个树状数组,一个维护差分数组$b[i]$,一个维护$i*b[i]$,对于区间加x的操作,在第一个树状数组中在l位置加x,r+1位置减x;在第二个树状数组中在l位置加$l*x$,$r+1$位置减$(r+1)*x$;对于查询某个区间的数的和,相当于查询前缀和前缀和即$(x+1)*ask(b,x) - ask(i*b,x) - (ask(b,l-1)*(l-1)+ask(i*b,l-1))$;
- 核心代码
```
实在没什么可说的,基础树状数组,初见过
```
- 易错点:查询区间和时,应该减去左端点-1的前缀和

### P10497 [USACO03OPEN] Lost Cows
- 来源:洛谷
- 题目大意:有n头奶牛,每头奶牛都有一个编号(1 ~ n各不相同),给定2 ~ n头奶牛前面编号比它小的奶牛的数量,求出每头奶牛的编号
- 核心思路:
    - 从后往前处理,对于每头奶牛,假设它前面编号比它小的奶牛的数量为x,则说明它应该放在剩下的第x+1小的编号上,我们使用树状数组维护剩下的位置,每次找用二分找到第x+1个空位后将其标记为已占用
- 核心代码
```
    for(int i = n; i>=1; i--) {
        int l = 0,r = n+1;
        while(l+1<r){ // 这样找到的r是大于等于a[i]+1的最小值
            int mid = l+r>>1;
            if(ask(mid)>=a[i]+1) r=mid;
            else l = mid;
        }
        add(r,-1);
        ans[i] = r;
    }
```
- 易错点:二分时不要写成`if(ask(mid)<=a[i]+1) l=mid; else r=mid;` 这样找到的l是小于等于a[i]+1的最大值,而不是大于等于a[i]+1的最小值

# 线段树
![线段树](..\public\images\线段树.png)

以区间最大值为例

1. 声明:
```
struct node {
    int l,r,dat;
}
node tr[maxn<<2];
```
2. 维护父节点信息:
```
void pushup(int p) {
    tr[p].dat = max(tr[p<<1].dat,tr[p<<1|1].dat);
}
```
3. 建树
```
void build(int p,int l,int r) {
    tr[p].l = l;tr[p].r = r;
    if(l==r) {
        tr[p].dat = a[l];
        return;
    }
    int mid = l+r>>1;
    build(p<<1,l,mid);
    build(p<<1|1,mid+1,r);
    pushup(p);
}
```
4. 单点修改
```
void change(int p,int x,int v) {
    if(tr[p].l==tr[p].r) {
        tr[p].dat += v;
        return;
    }
    int mid = tr[p].l+tr[p].r>>1;
    if(x<=mid) change(p<<1,x,v);
    else change(p<<1|1,x,v);
    pushup(p);
}
```
5. 区间查询
```
int ask(int p,int l,int r) {
    if(tr[p].lazy) pushdown(p);
    if(tr[p].l>=l&&tr[p].r<=r) return tr[p].dat;
    int mid = tr[p].l+tr[p].r>>1;
    int res = 0;
    if(l<=mid) res = max(res,ask(p<<1,l,r));
    if(r>mid) res = max(res,ask(p<<1|1,l,r));
    return res;
}
```
6. 区间修改(懒更新)
```
void add(int p,int l,int r,int v) {
    if(tr[p].l>=l&&tr[p].r<=r) {
        tr[p].dat += v;
        tr[p].lazy += v;
        return;
    }
    pushdown(p);
    int mid = tr[p].l+tr[p].r>>1;
    if(l<=mid) add(p<<1,l,r,v);
    if(r>mid) add(p<<1|1,l,r,v);
    pushup(p);
}
```
7. pushdown函数根据题意进行编写,以区间加为例
```
void pushdown(int p) {
    if(tr[p].lazy) {
        tr[p<<1].dat += tr[p].lazy;
        tr[p<<1|1].dat += tr[p].lazy;
        tr[p<<1].lazy += tr[p].lazy;
        tr[p<<1|1].lazy += tr[p].lazy;
        tr[p].lazy = 0;
    }
}
```



### SP1716 GSS3 - Can you answer these queries III
- 来源:SPOJ
- 题目大意:给定一个n个数,q个操作,每次操作是把a[x]修改成y,或者查询区间最大子段和
- 核心思路:
    - 线段树维护每个区间的最大子段和,前缀和,后缀和,区间和,修改时更新这些信息,查询时根据左右子树的信息合成父节点的信息
- 核心代码
```
void pushup(int p) {
    tree[p].dat = max(max(tree[p*2].dat,tree[p*2+1].dat),tree[2*p].rmax+tree[2*p+1].lmax);
    tree[p].sum = tree[2*p].sum + tree[2*p+1].sum;
    tree[p].lmax = max(tree[2*p].lmax,tree[2*p].sum+tree[2*p+1].lmax);
    tree[p].rmax = max(tree[2*p+1].rmax,tree[2*p].rmax+tree[2*p+1].sum);
}

void build(int p,int l,int r) {
    tree[p].l = l,tree[p].r = r;
    if(l==r) {
        tree[p].dat = a[l];
        tree[p].sum = a[l];
        tree[p].lmax = a[l];
        tree[p].rmax = a[l];
        return ;
    }
    int mid = l+r>>1;
    build(p*2,l,mid);
    build(p*2+1,mid+1,r);
    pushup(p);
}

node ask(int p,int l,int r) {
    if(l<=tree[p].l && tree[p].r<=r) {
        return tree[p];
    }
    int mid = tree[p].l+tree[p].r >>1;
    if(r<=mid) return ask(2*p,l,r);
    if(l>mid) return ask(2*p+1,l,r);
    node left_res = ask(2*p,l,r);
    node right_res = ask(2*p+1,l,r);

    node res;
    // 手动合并左右结果
    res.sum = left_res.sum + right_res.sum;
    res.lmax = max(left_res.lmax, left_res.sum + right_res.lmax);
    res.rmax = max(right_res.rmax, right_res.sum + left_res.rmax);
    res.dat = max({left_res.dat, right_res.dat, left_res.rmax + right_res.lmax});

    return res;
}

void change(int p,int x,int y)  {
    int l = tree[p].l, r = tree[p].r;
    if(l==r && l == x) {
        tree[p].dat = y;
        tree[p].sum = y;
        tree[p].lmax = y;
        tree[p].rmax = y;
        return ;
    }
    int mid = l+r>>1;
    if(x<=mid) change(2*p,x,y);
    else change(2*p+1,x,y);
    pushup(p);
}
```

- 易错点:线段树代码较长,手写时要注意细节,保持专注

### P10463 Interval GCD
- 来源:洛谷
- 题目大意:给定n个数,q个操作,每次操作是把[l,r]加上d,或者查询区间最大公约数
- 核心思路:
    - 首先明确一个重要引理:gcd(a,b) = gcd(a,b-a),此公式可推广至多个数gcd(a1,a2,...,an) = gcd(a1,a2-a1,...,an-a1),因此我们可以维护一个差分数组b[i] = a[i]-a[i-1],则区间的gcd可以转化为gcd(sum[l],b[l+1],...,b[r])，对于区间加d的操作,相当于在b[l]上加d,b[r+1]上减d;对于查询区间的gcd,相当于查询sum[l]和b[l+1]到b[r]的gcd,我们可以使用线段树维护差分数组b的gcd,每次查询时先求出sum[l],再查询区间b[l+1]到b[r]的gcd,最后求出它们的gcd即可
- 核心代码
```
void pushup(int p) {
    tree[p].sum = tree[2*p].sum + tree[2*p+1].sum;
    tree[p].gcd = gcd(tree[2*p].gcd,tree[2*p+1].gcd);
}

void build(int p, int l, int r) {
    tree[p].l = l,tree[p].r = r;
    if(l==r) {
        tree[p].sum = tree[p].gcd = b[l];
        return ;
    }
    int mid = l + r >> 1;
    build(2*p,l,mid);
    build(2*p+1,mid+1,r);
    pushup(p);
}

void change(int p,int x, int y) {
    int l = tree[p].l, r = tree[p].r;
    if(l==r && l==x) {
        tree[p].sum += y;
        tree[p].gcd += y;
        return ;
    }
    int mid = l + r >> 1;
    if(x<=mid) change(2*p,x,y);
    else change(2*p+1,x,y);
    pushup(p);
}

int ask_gcd(int p,int l, int r) {
    if(l<=tree[p].l && tree[p].r <= r) {
        return tree[p].gcd;
    }
    int mid = tree[p].l + tree[p].r >> 1;
    int resl = -1,resr = -1;
    if(l<=mid) resl = ask_gcd(2*p,l,r);
    if(r>mid) resr = ask_gcd(2*p+1,l,r);
    if(resl != -1 && resr != -1) return gcd(resl,resr);
    if(resl != -1) return resl;
    if(resr != -1) return resr;
    return 0;
}

int ask_sum(int p, int l,int r) {
    if(l<=tree[p].l && tree[p].r<=r) {
        return tree[p].sum;
    }
    int mid = tree[p].l + tree[p].r>>1;
    int resl = 0, resr = 0;
    if(l<=mid) resl = ask_sum(2*p,l,r);
    if(r>mid) resr = ask_sum(2*p+1,l,r);
    return resl + resr;
}
```
- 易错点:
    - ask_gcd函数中把未查询的resl和resr赋初值为1,
    - 查询函数中不要把mid定义为查询区间的中点
    - 当修改区间的r为n是,要判断越界,否则线段树会有未定义的行为

### P5490 【模板】扫描线 & 矩形面积并
- 来源:洛谷
- 题目大意:给定n个矩形,求它们的覆盖的面积
- 核心思路
    - 设一个矩形的左下角为(x1,y1),右上角为(x2,y2),将这个矩形保存为两个四元组(x1,y1,y2,1)和(x2,y1,y2,-1),将所有四元组按x排序,从左往右扫描,每遇到一个四元组,先计算当前x与上一个x的距离乘以当前被覆盖的长度(可以使用线段树维护),然后根据四元组的信息更新线段树
    - 线段树维护每个区间的覆盖次数和被覆盖的长度,当覆盖次数大于0时被覆盖长度为区间长度,否则为左右子树被覆盖长度之和
    - 注意线段树的l和r是表示的一个区间,而不是一个点,因此在更新区间时要左闭右开(左开右闭也可以,但有些地方要相应修改)
    - 最后注意离散化y坐标,否则线段树数组开不了那么大
- 核心代码
```
#include<bits/stdc++.h>
using namespace std;

#define int long long 

const int N = 100010;

struct node{
    int l,r,cnt,len;
};

struct Point{
    int x,y1,y2,k;
    bool operator<(const Point &other) const {
        return x<other.x;
    }
};

node tr[8*N];

Point pit[2*N];

int n,bef_cnt,dis_cnt,bef[2*N],dis[2*N],ans;

void discrete() {
    sort(bef+1,bef+1+bef_cnt);
    for(int i = 1; i<=bef_cnt; i++) {
        if(i == 1 || bef[i] != bef[i-1]) {
            dis[++dis_cnt] = bef[i];
        }
    }
}

int query(int x) {
    return lower_bound(dis+1,dis+1+dis_cnt,x) - dis;
}

void pushup(int p) {
    if(!tr[p].cnt) {
        if(tr[p].l==tr[p].r) tr[p].len = 0;
        else tr[p].len = tr[2*p].len+tr[2*p+1].len;
    }
    else tr[p].len = dis[tr[p].r+1] - dis[tr[p].l];
}

void build(int p,int l,int r) {
    tr[p] = {l,r,0,0};
    if(l==r) {
        return ;
    }
    int mid = l+r>>1;
    build(2*p,l,mid);
    build(2*p+1,mid+1,r);
}

void change(int p, int l, int r, int k) {
    if(l<=tr[p].l && tr[p].r<=r) {
        tr[p].cnt+=k;
        pushup(p);
        return;
    }
    int mid = tr[p].l + tr[p].r >> 1;
    if(l<=mid) change(2*p,l,r,k);
    if(r>mid) change(2*p+1,l,r,k);
    pushup(p);
}
    
signed main() {
    cin >> n;
    for(int i = 1; i<=n; i++) {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        bef[++bef_cnt] = y1;
        bef[++bef_cnt] = y2;
        pit[i*2-1]={min(x1,x2),min(y1,y2),max(y1,y2),1};
        pit[i*2]={max(x1,x2),min(y1,y2),max(y1,y2),-1};
    }
    discrete();
    sort(pit+1,pit+1+2*n);
    build(1,1,dis_cnt-1);
    for(int i = 1;i<=2*n-1;i++) {
        int l_idx = query(pit[i].y1);
        int r_idx = query(pit[i].y2);
        if(l_idx < r_idx) {
            change(1, l_idx, r_idx - 1, pit[i].k);
        }
        ans += (pit[i+1].x -pit[i].x) * tr[1].len;
    }
    cout<<ans;
    return 0;
}
```

- 易错点:
    - 扫描线最容易错的地方就是线段树维护的到底是点还是线,这道题是线,下一道题会介绍扫描线维护点

### P1502 窗口的星星
- 来源:洛谷
- 题目大意:给定n个点,每个点有一个坐标和一个权值,给定一个窗口大小为w*h,求窗口最大能圈住的点的权值和
- 核心思路:
    - 首先窗口的坐标肯定不能和星星的坐标重合,因此我们可以先把星星的横纵坐标减0.5,一颗星星的坐标为(x,y),我们认为窗口的右上角为(x,y)到(x+w-1,y+h-1)的区域时,窗口能圈住星星
    - 这样我们对每一个星星坐标(x,y)建立四元组(x,y,y+h-1,v)和(x+w-1,y,y+h-1,-v),对所有四元组按x排序,从左往右扫描,每遇到一个四元组,先根据四元组的信息更新线段树,然后查询当前线段树的最大值更新答案
    - 线段树维护每个区间的权值和,每次更新一个四元组时,相当于在区间[y,y+h-1]上加上v,查询时直接返回线段树的最大值即可
    - 需要注意的是这里线段树的l和r表示的是一个点,而不是一个区间,因此在更新区间时要左闭右闭
    - 最后注意离散化y坐标,否则线段树数组开不了
- AC代码(调了几个小时就因为电和区间没搞清楚)
```
#include<bits/stdc++.h>
using namespace std;

#define int long long

const int N = 10010;

struct TREE{
    int l,r,dat,lazy;
}tr[2*4*N];

struct POINT{
    int x,y1,y2,v;
    bool operator<(const POINT &other) const {
        if(x!=other.x)
            return x<other.x;
        return v>other.v;
    }
}pit[2*N];

int n,q,w,h,bef_cnt,dis_cnt,bef[2*N],dis[2*N],ans;

void discrete() {
    sort(bef+1,bef+1+bef_cnt);
    for(int i = 1; i<=bef_cnt; i++) {
        if(i==1 || bef[i]!=bef[i-1]) {
            dis[++dis_cnt] = bef[i];
        }
    }
}

int query(int x) {
    return lower_bound(dis+1,dis+1+dis_cnt,x) - dis;
}

void pushup(int p) {
    tr[p].dat = max(tr[2*p].dat,tr[2*p+1].dat);
}

void pushdown(int p) {
    if(!tr[p].lazy) return ;
    int lazy = tr[p].lazy;
    tr[2*p].dat+=lazy;
    tr[2*p].lazy+=lazy;
    tr[2*p+1].dat+=lazy;
    tr[2*p+1].lazy+=lazy;
    tr[p].lazy=0;
}

void build(int p,int l,int r) {
    tr[p] = {l,r,0,0
    };
    if(l==r) return ;
    int mid = l+r>>1;
    build(2*p,l,mid);
    build(2*p+1,mid+1,r);
}

void change(int p,int l,int r,int v) {
    if(l<=tr[p].l && tr[p].r <= r) {
        tr[p].dat+=v;
        tr[p].lazy+=v;
        return ;
    }
    pushdown(p);
    int mid = tr[p].l + tr[p].r >> 1;
    if(l<=mid) change(2*p,l,r,v);
    if(r>mid) change(2*p+1,l,r,v);
    pushup(p);
}

signed main() {
    cin>>q;
    while(q--) {
        cin>>n>>w>>h;
        ans=dis_cnt=bef_cnt=0;
        for(int i = 1;i<=n;i++) {
            int x,y,v;
            cin>>x>>y>>v;
            pit[2*i-1] = {x,y,y+h-1,v};
            pit[2*i] = {x+w-1,y,y+h-1,-v};
            bef[++bef_cnt] = y;
            bef[++bef_cnt] = y+h-1;
        }
        sort(pit+1,pit+1+2*n);
        discrete();
        build(1,1,dis_cnt);
        for(int i = 1; i<=2*n; i++) {
            change(1,query(pit[i].y1),query(pit[i].y2),pit[i].v);
            ans = max(ans,tr[1].dat);
        }
        // cout<<endl;
        cout<<ans<<endl;
    }
    return 0;
}
```
- 易错点:
    - 扫描线最容易错的地方就是线段树维护的到底是点还是线,这道题是点,上一道题是线