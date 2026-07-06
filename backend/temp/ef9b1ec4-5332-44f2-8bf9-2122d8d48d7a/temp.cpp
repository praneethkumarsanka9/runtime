#include <bits/stdc++.h>
using namespace std;
bool canFinish(vector<int>& v,int speed,int n){
    long long total = 0;
    for(int i = 0;i < v.size();i++){
        total += (v[i] + speed - 1)/speed;
    }
    if(total <= n){
        return true;
    }
    return false;
}
int min_speed(vector<int>& v,int total){
    int left = 1;
    int right = INT_MIN;
    for(int i = 0;i < v.size();i++){
        right = max(right,v[i]);
    }
    int min = right;
    while(left <= right){
        int mid = left + (right - left)/2;
        if(canFinish(v,mid,total)){
            min = mid;
            right = mid - 1;
        }else{
            left = mid + 1;
        }
    }
    return min;
}
int main(){
    int n;
    cin >> n;
    vector<int> v(n);
    for(int i = 0;i < n;i++){
        cin >> v[i];
    }
    int total;
    cin >> total;
    cout << min_speed(v,total);
    return 0;
}         