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
