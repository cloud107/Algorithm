# 高精度
需要哪个敲哪个,非常方便,建议熟读背诵(~~我们程序员都是每天手抄背诵模版的~~)
```
#include <bits/stdc++.h>
using namespace std;

struct BigInt {
    vector<int> s;
    BigInt(string n) {
        if (n.empty()) s.push_back(0);
        for (int i = n.size() - 1; i >= 0; --i) s.push_back(n[i] - '0');
        trim();
    }
    BigInt(int n = 0) {
        if (n == 0) s.push_back(0);
        while (n > 0) s.push_back(n % 10), n /= 10;
    }
    void trim() {
        while (s.size() > 1 && s.back() == 0) s.pop_back();
    }
    // 比较大小：this < other
    bool operator<(const BigInt& o) const {
        if (s.size() != o.s.size()) return s.size() < o.s.size();
        for (int i = s.size() - 1; i >= 0; --i)
            if (s[i] != o.s[i]) return s[i] < o.s[i];
        return false;
    }
    // 加法
    BigInt operator+(const BigInt& o) const {
        BigInt res; res.s.clear();
        int carry = 0;
        for (size_t i = 0; i < max(s.size(), o.s.size()) || carry; ++i) {
            int sum = carry + (i < s.size() ? s[i] : 0) + (i < o.s.size() ? o.s[i] : 0);
            res.s.push_back(sum % 10);
            carry = sum / 10;
        }
        return res;
    }
    // 减法 (确保 this >= o)
    BigInt operator-(const BigInt& o) const {
        BigInt res; res.s.clear();
        int carry = 0;
        for (size_t i = 0; i < s.size(); ++i) {
            int sub = s[i] - carry - (i < o.s.size() ? o.s[i] : 0);
            if (sub < 0) sub += 10, carry = 1;
            else carry = 0;
            res.s.push_back(sub);
        }
        res.trim();
        return res;
    }
    // 乘法
    BigInt operator*(const BigInt& o) const {
        BigInt res; res.s.assign(s.size() + o.s.size(), 0);
        for (size_t i = 0; i < s.size(); ++i)
            for (size_t j = 0, carry = 0; j < o.s.size() || carry; ++j) {
                long long cur = res.s[i + j] + s[i] * 1LL * (j < o.s.size() ? o.s[j] : 0) + carry;
                res.s[i + j] = cur % 10;
                carry = cur / 10;
            }
        res.trim();
        return res;
    }
    // 除法 (大数 / 小数)
    BigInt operator/(int v) const {
        BigInt res; res.s.clear();
        res.s.resize(s.size());
        int r = 0;
        for (int i = s.size() - 1; i >= 0; --i) {
            long long cur = s[i] + r * 10LL;
            res.s[i] = cur / v;
            r = cur % v;
        }
        res.trim();
        return res;
    }
    // 取模 (大数 % 小数)
    int operator%(int v) const {
        int r = 0;
        for (int i = s.size() - 1; i >= 0; --i)
            r = (r * 10LL + s[i]) % v;
        return r;
    }
    // 输出
    friend ostream& operator<<(ostream& os, const BigInt& bi) {
        if (bi.s.empty()) return os << 0;
        for (int i = bi.s.size() - 1; i >= 0; --i) os << bi.s[i];
        return os;
    }
};
```

# KMP
```
#include<bits/stdc++.h>
using namespace std;

const int N = 1000010;

string s1,s2;
int len1,len2;
int nex[N],f[N];

int main() {
    cin>>s1>>s2;
    len1 = s1.length();
    len2 = s2.length();
    s1 = '#' + s1;
    s2 = '#' + s2;
    nex[1] = 0;
    for(int i = 2, j = 0; i<=len2; i++) {
        while(j>0 && s2[i] != s2[j+1]) j = nex[j];
        if(s2[i]==s2[j+1]) j++;
        nex[i] = j; 
    }
    for(int i = 1, j = 0; i<=len1; i++) {
        // cout<<j<<" "<<nex[j]<<endl;
        while(j>0 && (j==len1 || s1[i]!=s2[j+1])) j = nex[j];
        if(s1[i]==s2[j+1]) j++;
        f[i] = j;
        if(f[i] == len2) cout<<i-len2+1<<'\n';
    }
    for(int i = 1; i<=len2; i++) cout<<nex[i]<<' ';
    return 0;
}
```

# AC自动机
1. 统计有多少模版串在文本串中出现过
```
#include<bits/stdc++.h>
using namespace std;

const int N = 2000010;

int ch[N][30],nex[N],cnt[N],idx;
int n;

void insert(string s) {
    int p = 0;
    for(int i = 0; i<s.length(); i++) {
        int j = s[i] - 'a';
        if(!ch[p][j]) ch[p][j] = ++idx;
        p = ch[p][j];
    }
    cnt[p]++;
}

void build() {
    queue<int>qu;
    for(int i = 0;i<26; i++) {
        if(ch[0][i]) qu.push(ch[0][i]);
    }
    while(!qu.empty()) {
        int u = qu.front();qu.pop();
        for(int i = 0; i<26; i++) {
            int v = ch[u][i];
            if(v) nex[v] = ch[nex[u]][i],qu.push(v);
            else ch[u][i] = ch[nex[u]][i];
        }
    }
}

int query(string s) {
    int res = 0;
    for(int k = 0, i = 0; k<s.length(); k++) {
        i = ch[i][s[k]-'a'];
        for(int j = i; j&&~cnt[j];j=nex[j]) {
            res+=cnt[j], cnt[j]=-1;
        }
    }
    return res;
}

int main() {
    cin>>n;
    for(int i = 1; i<=n; i++) {
        string s;cin>>s;
        insert(s);
    }
    build();
    string s;
    cin>>s;
    int ans = query(s);
    cout<<ans<<endl;
    return 0;
}
```
2. 统计每一个模版串在文本串中出现了多少次
