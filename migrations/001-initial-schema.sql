-- Up
CREATE TABLE users (
    id          VARCHAR PRIMARY KEY,
    name        VARCHAR NOT NULL,
    email       VARCHAR NOT NULL,
    password    VARCHAR NOT NULL,
    role        VARCHAR NOT NULL
);

CREATE TABLE clients (
    id          VARCHAR PRIMARY KEY,
    name        VARCHAR DEFAULT 'Neimenovan'    NOT NULL,
    email       VARCHAR DEFAULT 'Ni e-naslova'  NOT NULL,
    phone       VARCHAR DEFAULT 'Ni številke'   NOT NULL,
    address     VARCHAR DEFAULT 'Ni naslova'    NOT NULL,
    description VARCHAR DEFAULT 'Brez opisa'    NOT NULL
);

CREATE TABLE services (
    id          VARCHAR PRIMARY KEY,
    name        VARCHAR NOT NULL UNIQUE,
    color       VARCHAR NOT NULL   
);

CREATE TABLE sessions (
    id          VARCHAR PRIMARY KEY,
    timestamp   TIMESTAMP NOT NULL,
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