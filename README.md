# SurrealDB Blog made in VueJS

![Blog](https://github.com/SrWither/surrealdb-vuejs/assets/59105868/b2bc085a-1f24-4fb6-9659-6d2b4cd36232)

### Init Database

```hs
DEFINE SCOPE Auth
    SESSION 3d

    SIGNUP (
      INSERT INTO Users
      (email, password)
      VALUES
      ($email, crypto::argon2::generate($password))
    )

    SIGNIN (
      SELECT * FROM Users WHERE
      email = $email
      AND crypto::argon2::compare(password, $password)
    )
;
DEFINE TABLE Posts SCHEMALESS
    PERMISSIONS
        FOR select
            WHERE published = true
            OR $auth.role = roles:admin
        FOR create, update
            WHERE $auth.role = roles:admin
        FOR delete
            WHERE $auth.role = roles:admin
;

DEFINE FIELD title ON TABLE Posts TYPE string;
DEFINE FIELD description ON TABLE Posts TYPE string;
DEFINE FIELD content ON TABLE Posts TYPE string;
DEFINE FIELD published ON TABLE Posts TYPE bool DEFAULT false;
DEFINE FIELD created_at ON TABLE Posts TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE Posts TYPE datetime DEFAULT time::now() VALUE time::now();
DEFINE FIELD user ON TABLE Posts TYPE record(Users) DEFAULT $auth.id;DEFINE TABLE Profiles SCHEMAFULL
    PERMISSIONS
        FOR select FULL 
        FOR update, delete WHERE user = $auth.id OR $auth.role = roles:admin;

DEFINE FIELD username ON TABLE Profiles TYPE string;
DEFINE FIELD user ON TABLE Profiles TYPE record(Users);

DEFINE INDEX profileUsernameIndex ON TABLE Profiles COLUMNS username UNIQUE;
CREATE roles:admin SET name = "Administrator";
CREATE roles:normal SET name = "Normal";
DEFINE TABLE Users SCHEMAFULL
    PERMISSIONS
        FOR select, update, delete WHERE id = $auth.id;

DEFINE FIELD email ON TABLE Users TYPE string
    ASSERT string::is::email($value);
DEFINE FIELD password ON TABLE Users TYPE string;
DEFINE FIELD role ON TABLE Users TYPE record(roles) DEFAULT roles:normal;

DEFINE INDEX userEmailIndex ON TABLE Users COLUMNS email UNIQUE;
```
### Create user

```hs
INSERT INTO Users (email, role, password) VALUES ("example@gmail.com", roles:admin, crypto::argon2::generate("123456"));
INSERT INTO Profiles (username, user) VALUES ("ExampleUser", (SELECT * FROM Users)[0].id);
```

## Init Frontend

### Change url in .env

```
VITE_SURREALDB="http://SURREALDBURL/rpc"
```

### Install dependencies

```
pnpm install
```

### Run

```
pnpm dev
```
