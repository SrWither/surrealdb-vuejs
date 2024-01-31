DEFINE TABLE Users SCHEMAFULL
    PERMISSIONS
        FOR select, update, delete WHERE id = $auth.id;

DEFINE FIELD email ON TABLE Users TYPE string
    ASSERT string::is::email($value);
DEFINE FIELD password ON TABLE Users TYPE string;
DEFINE FIELD role ON TABLE Users TYPE record(roles) DEFAULT roles:normal;

DEFINE INDEX userEmailIndex ON TABLE Users COLUMNS email UNIQUE;
