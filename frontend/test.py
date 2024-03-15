arr = [ 1, 2, 3, 4, 5]
arr.pop(arr.index(max(arr)))
arr.pop(arr.index(min(arr)))
print(sum(arr))