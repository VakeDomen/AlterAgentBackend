-- Up
CREATE TABLE users (
    id          VARCHAR primary key,
    name        VARCHAR not null,
    email       VARCHAR not null,
    password    VARCHAR not null,
    role        VARCHAR not null
);

CREATE TABLE clients (
    id          VARCHAR PRIMARY KEY,
    name        VARCHAR NOT NULL,
    email       VARCHAR NULL,
    phone       VARCHAR NULL,
    address     VARCHAR NULL,
    description VARCHAR NULL
);

CREATE TABLE services (
    id          VARCHAR PRIMARY KEY,
    name        VARCHAR NOT NULL UNIQUE,
    color       VARCHAR NOT NULL   
);

CREATE TABLE sessions (
    id          VARCHAR PRIMARY KEY,
    user_id     VARCHAR NOT NULL,
    client_id   VARCHAR NOT NULL,
    description VARCHAR NULL,
    service_id  VARCHAR NULL
);

CREATE TABLE tags (
    id          VARCHAR PRIMARY KEY,
    name        VARCHAR NOT NULL,
    color       VARCHAR NOT NULL
);

CREATE TABLE client_tags (
    id          VARCHAR PRIMARY KEY,
    client_id   VARCHAR NOT NULL,
    tag_id      VARCHAR NOT NULL
);

-- Down
DROP TABLE users;
DROP TABLE sessions;
DROP TABLE clients;
DROP TABLE services;
DROP TABLE tags;
DROP TABLE client_tags;