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

### Work

### **Create Work**

```ts
// method: POST
path: `/work/create`;
// body: (workTitle, workDescription, userId) - string, (workDateStart, workDateEnd) - Date
```

### **Update Work**

```ts
// method: PUT
id: string;
path: `/work/edit?id=${id}`;
// body: (workTitle, workDescription) - string, (workDateStart, workDateEnd) - Date
```

### **Update Status Work**

```ts
// method: PUT
id: string;
path: `/work/edit-status?id=${id}`;
// body: workStatus - Boolean
```

### **Delete Work**

```ts
// method: DELETE
id: string;
path: `/work/delete/${id}`;
```

### **Get Info Work**

```ts
// method: GET
id: string;
path: `/work/info/${id}`;
```

### **Get All Work**

```ts
// method: GET
userId: string;
status: boolean; // option
year: int; // option
month: int; // option
path: `/work/all?userId=${userId}&status=${status}&year=${year}&month=${month}`;
```

### **Get All Work Current**

```ts
// method: GET
userId: string;
status: boolean; // option
path: `/work/all?userId=${userId}&status=${status}`;
```