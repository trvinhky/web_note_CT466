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

### **Get Info**

```ts
// method: GET
id: string;
path: `/user/info?id=${id}`;
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

### **Get Group**

```ts
// method: GET
name: string;
path: `/group/one?name=${name}`;
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
path: `/groupInfo/one?groupId=${groupId}`;
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
```

### **Get Info WorkInfo**

```ts
// method: GET
groupId: string;
workId: string;
path: `/workInfo/info?groupId=${groupId}&workId=${workId}`;
```

### **Get All WorkInfo**

```ts
// method: GET
groupId: string;
userId: string; 
status: boolean;
year: int; // option
month: int; // option
path: `/workInfo/all?groupId=${groupId}&userId=${userId}&status=${status}&year=${year}&month=${month}`;
```

### **Get All Current WorkInfo**

```ts
// method: GET
groupId: string;
userId: string; 
count: int; // option
path: `/workInfo/current?groupId=${groupId}&userId=${userId}&count=${count}`;
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