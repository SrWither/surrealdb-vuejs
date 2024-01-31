DEFINE TABLE Profiles SCHEMAFULL
    PERMISSIONS
        FOR select FULL 
        FOR update, delete WHERE user = $auth.id OR $auth.role = roles:admin;

DEFINE FIELD username ON TABLE Profiles TYPE string;
DEFINE FIELD user ON TABLE Profiles TYPE record(Users);

DEFINE INDEX profileUsernameIndex ON TABLE Profiles COLUMNS username UNIQUE;
