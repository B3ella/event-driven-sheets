use CRM
CREATE TABLE IF NOT EXISTS Cients (
    offset int autoincrement,
    client_id int,
    envent_number int,
    name varchar(255),
    age int,
    user_to_blame varchar(255),
    event_type ENUM('CREATE','UPDATE','DELETE'),
    happend_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (client_id, envent_number)
)

CREATE TABLE IF NOT EXISTS view_metadata {
    table_name varchar(256) PRIMARY KEY,
    last_processed_offset int DEFAULT 0
}