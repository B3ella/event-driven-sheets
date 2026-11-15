CREATE DATABASE IF NOT EXISTS CRM;
USE CRM;

CREATE TABLE IF NOT EXISTS Clients (
    event_offset INT AUTO_INCREMENT UNIQUE KEY,
    client_id int,
    event_number int,
    name varchar(255),
    age int,
    user_to_blame varchar(255),
    event_type ENUM('CREATE','UPDATE','DELETE'),
    happened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (client_id, event_number)
);

CREATE TABLE IF NOT EXISTS view_metadata (
    table_name varchar(256) PRIMARY KEY,
    last_processed_offset int DEFAULT 0
);
