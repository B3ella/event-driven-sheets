CREATE DATABASE IF NOT EXISTS CRM;
USE CRM;

CREATE TABLE IF NOT EXISTS Clients (
    event_offset   BIGINT UNSIGNED AUTO_INCREMENT,
    client_id      INT UNSIGNED NOT NULL,
    event_number   INT UNSIGNED NOT NULL,
    name           VARCHAR(255) NULL,
    age            INT NULL,
    user_to_blame  VARCHAR(255) NOT NULL,
    event_type     ENUM('CREATE','UPDATE','DELETE') NOT NULL,
    happened_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (client_id, event_number),
    UNIQUE KEY uq_event_offset (event_offset)
);

CREATE TABLE IF NOT EXISTS view_metadata (
    table_name            VARCHAR(256) PRIMARY KEY,
    last_processed_offset BIGINT UNSIGNED NOT NULL DEFAULT 0
);
