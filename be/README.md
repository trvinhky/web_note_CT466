### **Base URL**: http://localhost:5001/api/v1

### User

### **Create User**

```ts
// method: POST
path: `/user/create`;
// body: userName, userEmail, userAddress, userPhone, userPassword - string
```
### **Login**

```ts
// method: POST
path: `/user/login`;
// body: userEmail, userPassword - string
```

### **Get Count User**

```ts
// method: GET
path: `/user/count`;
```

### **Search Email User**

```ts
// method: GET
userEmail: string;
path: `/user/search/${userEmail}`;
```

### **Get Info User**

```ts
// method: GET
id: string;
path: `/user/info/${id}`;
```

### **Update Info User**

```ts
// method: PUT
id: string;
path: `/user/${id}`;
// body: userName, userAddress, userPhone - string
```


### Mark

### **Create Mark**

```ts
// method: POST
path: `/mark/create`;
// body: markName, markColor - string

```

### **Get All Mark**

```ts
// method: GET
path: `/mark/all`;
```

### **Delete Mark**

```ts
// method: DELETE
id: string;
path: `/mark/${id}`;
```


### Work

### **Create Work**

```ts
// method: POST
path: `/work/create`;
// body: (workTitle, markId, userId) - string, (workDateStart, workDateEnd) - Date
```

### **Update Work**

```ts
// method: PUT
id: string;
userId: string;
path: `/work/edit?id=${id}&userId=${userId}`;
// body: (workTitle, markId) - string, (workDateStart, workDateEnd) - Date
```

### **Delete Work**

```ts
// method: DELETE
id: string;
userId: string;
path: `/work/delete?id=${id}&userId=${userId}`;
```

### **Get Info Work**

```ts
// method: GET
id: string;
path: `/work/info/${id}`;
```


### Worker

### **Create Worker**

```ts
// method: POST
path: `/worker/create`;
// body: userId, workId, workerNote - string
```

### **Delete Worker**

```ts
// method: DELETE
userId: string;
workId: string;
path: `/worker/delete?userId=${userId}&workId=${workId}`;
```

### **Update Worker**

```ts
// method: PUT
userId: string;
workId: string;
path: `/worker/edit?userId=${userId}&workId=${workId}`;
// body: workerStatus - 0 | 1 | 2
```

### **Delete Worker By WorkId**

```ts
// method: DELETE
workId: string;
path: `/worker/delete/${workId}`;
```

### **Get Worker By WorkId**

```ts
// method: GET
workId: string;
path: `/worker/work/${workId}`;
```

### **Get All Worker**

```ts
// method: GET
year: int; // option
month: int; // option
markId: string; // option
userId: string;
path: `/worker/options?year=${year}&month=${month}&markId=${markId}&userId=${userId}`;
```