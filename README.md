# Yobsi API Documentation

## HTTP
### POST /auth
**Parameters**

*Authentication using email*

```json
{
  "email": "someone@email.com",
  "password": "mysecret"
}
```
<br>

*Authentication using username*

```json
{
  "username": "someusername",
  "password": "mysecret"
}
```
<br>

*Authentication using facebook id*

```json
{
  "fbId": "89723hjksjdhfihdsf"
}
```

**Responses**

```json
STATUS CODE: 200

{
  "token": "sdlkfsdlkfjoiuj32orjklsjdf",
  "user": "{}"
}
```

```json
STATUS CODE: 4XX

{
  "error": "error description"
}
```
<br>

### POST /api/professionals
**Parameters**

*Local account creation*

```json
{
  "username": "pepito",
  "email": "pepe@gmail.com",
  "password": "secret"
}
```
<br>
*Facebook account creation*

```json
{
  "username": "pepito",
  "email": "pepe@gmail.com",
  "fbId": "sdkfjsdfjsdklf"
}
```

**Responses**

```json
STATUS CODE: 200
{
  "token": "sdlkfsdlkfjoiuj32orjklsjdf",
  "user": "{}"
}
```

```json
STATUS CODE: 4XX
{
  "error": "error description"
}
```
<br>
### POST /api/professionals/:usernameOrEmail/reset-password

**Responses**

```json
STATUS CODE: 200
{
  "message": "The reset password email was already sent!"
}
```

<br>
### PUT /api/professionals/:usernameOrEmail/attributes/password

**Parameters**

```json
Header:
Authorization=Bearer token_goes_here
```

```json
{
  "newPassword": "mysecretagain"
}
```

**Responses**

```json
STATUS CODE: 401
UnauthorizedError: No authorization token was found
```

```json
STATUS CODE: 400
{
  "error": "Password empty or it is less than six characters.'"
}
```

```json
STATUS CODE: 404
{
  "error": "User not found."
}
```

```json
STATUS CODE: 200
{
  "message": "User password was updated successfully.",
  "user": {}
}
```

<br>
## Websockets (socket.io)
### Connecting

```javascript
var tokenGivenByAuthREST = '...';
var serverURL = '...';
socketio.connect(serverURL, {query: 'token='+ tokenGivenByServer})
```
<br>
### Listen, when a profesional is available to get a job:
```javascript
socket.on('is-someone-available', function (job) {

});
```

<br>

### Emit, when a profesional wants to take the job:
```javascript
socket.emit('want-to-take-job', {
  jobId: 2390482jifds,
  professionalEmail: 'some_profesional@gmail.com'
});
```

<br>

### Emit, when a client decides to hire a professional:
```javascript
socket.emit('hire-professional', {
  jobId: 2390482jifds
});
```

<br>

### Listen, when a professional is being notified that he was hired:
```javascript
socket.on('you-are-hired', function (data) {
  // data.job
});
```


