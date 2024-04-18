### **Base URL**: http://localhost:5001/api/v1

### User

### **Create User**

```ts
// method: POST
path: `/user/create`;
// body: userName, userEmail, userPassword - string
```

### **Login**

```ts
// method: POST
path: `/user/login`;
// body: userEmail, userPassword - string
```

### **Search**

```ts
// method: GET
email: string;
path: `/user/search?email=${email}`;
```


### Group

### **Create Group**

```ts
// method: POST
path: `/group/create`;
// body: groupName - string
```

### **Edit Group**

```ts
// method: PUT
id: string;
path: `/group/edit?id=${id}`;
// body: groupName - string
```

### **Delete Group**

```ts
// method: DELETE
id: string;
path: `/group/delete?id=${id}`;
```


### GroupInfo

### **Create GroupInfo**

```ts
// method: POST
path: `/groupInfo/create`;
// body: groupId, userId - string
```

### **Add Member GroupInfo**

```ts
// method: POST
path: `/groupInfo/add`;
// body: groupId, userId - string
```

### **Edit GroupInfo**

```ts
// method: PUT
groupId: string;
userId: string;
path: `/groupInfo/edit?groupId=${groupId}&userId=${userId}`;
```

### **Delete GroupInfo**

```ts
// method: DELETE
groupId: string;
userId: string;
path: `/groupInfo/delete?groupId=${groupId}&userId=${userId}`;
```

### **Get By groupId GroupInfo**

```ts
// method: GET
groupId: string;
status: boolean; // option
path: `/groupInfo/one?groupId=${groupId}&status=${status}`;
```

### **Get By userId GroupInfo**

```ts
// method: GET
userId: string;
status: boolean; // option
path: `/groupInfo/by?userId=${userId}&status=${status}`;
```


### Work

### **Create Work**

```ts
// method: POST
path: `/work/create`;
// body: (workTitle, workDescription, groupId) - string, (workDateStart, workDateEnd) - Date
```

### **Update Work**

```ts
// method: PUT
id: string;
path: `/work/edit?id=${id}`;
// body: (workTitle, workDescription) - string, (workDateStart, workDateEnd) - Date
```

### **Delete Work**

```ts
// method: DELETE
id: string;
path: `/work/delete/${id}`;
```

### **Get All Work**

```ts
// method: GET
year: int; 
month: int; 
path: `/work/all?year=${year}&month=${month}`;
```

### **Get All Work Current**

```ts
// method: GET
count: int; // option
path: `/work/current?count=${count}`;
```


### WorkInfo

### **Create WorkInfo**

```ts
// method: POST
path: `/workInfo/create`;
// body: groupId, userId, workId - string
```

### **Edit WorkInfo**

```ts
// method: PUT
groupId: string;
userId: string; 
workId: string;
path: `/workInfo/edit?groupId=${groupId}&userId=${userId}&workId=${workId}`;
// body: workInfoStatus - boolean
```

### **Delete WorkInfo**

```ts
// method: Delete
groupId: string;
workId: string;
path: `/workInfo/edit?groupId=${groupId}&workId=${workId}`;
// body: workInfoStatus - boolean
```

### **Get Info WorkInfo**

```ts
// method: GET
groupId: string;
userId: string; 
workId: string;
path: `/workInfo/info?groupId=${groupId}&userId=${userId}&workId=${workId}`;
```

### **Get All WorkInfo**

```ts
// method: GET
groupId: string;
userId: string; 
status: boolean;
path: `/workInfo/all?groupId=${groupId}&userId=${userId}&status=${status}`;
```

# Database
users
*userId
userName
userEmail
userPassword

groupInfo
*groupId
*userId
groupInfoAdmin
groupInfoStatus

groups
*groupId
groupName
groupCreateAt

works
*workId
workTitle
workDescription
workDateStart
workDateEnd
-groupId

workInfo
*workId
*groupId
*useId
workInfoStatus