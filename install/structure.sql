CREATE TABLE DEVICE(
 ID SERIAL PRIMARY KEY    NOT NULL,
 SERIAL_NUMBER  INT       NOT NULL, /* API KEY */
 USER_KEY       CHAR(32)  NOT NULL,
 PRIVATE_KEY    CHAR(32)  NOT NULL
);

CREATE TABLE DEVICE_REGISTERED(
 ID SERIAL PRIMARY KEY NOT NULL,
 ID_PERSON INT         NOT NULL
);

CREATE TABLE PERSON(
  ID SERIAL PRIMARY KEY   NOT NULL,
  EMAIL       VARCHAR(50) NOT NULL,
  CREATED        TIMESTAMP        NOT NULL,
  UPTIMESTAMPD     TIMESTAMP
);

CREATE TYPE EVENTS_TYPE AS ENUM ('laps', 'lapsStart', 'lapsStop');

CREATE TABLE DEVICE_EVENTS(
  ID BIGSERIAL PRIMARY KEY   NOT NULL,
  TYPE        EVENTS_TYPE       NOT NULL,
  CREATED        TIMESTAMP        NOT NULL,
  CONTENT     VARCHAR(50) NOT NULL
);
