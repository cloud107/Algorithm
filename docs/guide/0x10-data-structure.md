# 栈
1. 单调栈:经典问题 直方图中最大矩形面积
```
a[n+1] = p = 0;
for(int i = 1; i <= n;i++) {
    if(a[i] > s[p]) {
        s[++p] = a[i];
    }
    else {
        int width = 0;
        while (s[p] > a[i]){
            width += w[p];
            ans = max(ans,width * s[p]);
            p--;
        }
        s[++p] = a[i],w[p] = width + 1;
    }
}
```
单调栈的核心在于维护一个单调的栈,单调的元素会被累计,而破坏单调性的元素出现时,会弹出栈顶的元素并进行答案计算.

---

# 队列
1. 单调队列:经典问题 最大子序和
```
int  l = 1, r = 1;
q[1] = 0;
for(int i = 1; i <= n; i++) {
    while( l <= r && q[l] < i - m) l++;
    ans = max(ans, sum[i] - sum[q[l]]);
    while(l <= r && sum[q[r]] >= sum[i]) r--;
    q[++r] = i;
}
```

---
# 字符串
1. KMP模式匹配
*重要引理*:若$j_0$是next[0]的一个"候选项",即 $j_0<i$ 且 $A [i-j_0+1 \sim i] = A [ 1 \sim j_0]$,则小于$j_0$ 的最大的next[i] 的候选项是 $next[j_0]$ .

所以说,当next[i-1]计算完毕后,next[i]的所有候选项为next[i-1]+1,next[next[i-1]]+1....
next数组的计算:
```
next[1] = 0;
for(int i = 2, j = 0;i <= n; i++){
    while(j > 0 && a[i] != a[j+1]) j=next[j];
    if(a[i] == a[j+1]) j++;
    next[i] = j;
}
```
f数组的计算:
```
for(int i = 1, j = 0; i <=m; i++)
{
    while(j > 0 && (j==n || b[i] != a[j+1])) j = next[j];
    if (b[i] == a[j+1]) j++;
    f[j] = j;
    // if(f[i] == n)
}
```

2. 最小表示法
```
int n = s.length();
s+=s;
int i = 0, j = 1, k;
while(i < n && j<n) {
    for(k = 0; k < n && s[i+k] == s[j+k]; k++);
    if (k == n) break;
    if (s[i+k] > s[j+k]) {
        i = i + k + 1;
        if(i == j) i++;
    } else {
        j = j + k + 1;
        if(i == j) j++;
    }
}
ans = min(i,j);
```

---

# Trie字典树
```
int trie[SIZE][26], tot = 1;
void insert(string str){
    int len = s.length(), p = 1;
    for(int k = 0; k < len; k++) {
        int ch = str[k]-'a';
        if(trie[p][ch] == 0) trie[p][ch] = ++tot;
        p = trie[p][ch];
    }
    end[p] = true;
}
bool search(string str) {
    int len = s.length();
    for(int k = 0; k < len; k++) {
        p = trie[p][str[k]-'a'];
        if(p == 0) return 0;
    }
    return end[p];
}
```

---

# 二叉堆
1. 对顶堆
依次插入a中的元素,并查询第u[i]小的数.
```
int p = 0;
for(int i = 1; i <= n; i++){
    wihle(p < u[i]){
        p++;
        b.push(a[p]);
        s.push(b.top());
        b.pop();
    }
    cout << s.top()<<endl;
    b.push(s.top());
    s.pop();
}
```