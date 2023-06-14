# OpenPodcast Connect API

Server API for OpenPodcast Connect Platform

## DB Setup

Create the following table in the respective database

```sql
CREATE TABLE IF NOT EXISTS podcastConnectWaitlist (
  env_name VARCHAR(128) NOT NULL,
  env_value VARCHAR(1024) NOT NULL,
  value_encrypted BOOLEAN NOT NULL DEFAULT FALSE,
  session_id CHAR(36) NOT NULL,
  inserted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (session_id, env_name)
);
```

Grant the following permissions to the user

```sql
CREATE USER openpodcast_connect@'%' IDENTIFIED BY '<password>';
GRANT INSERT ON openpodcast_auth.podcastConnectWaitlist TO openpodcast_connect@';
```