# Main dependencies

libicu-dev and libexpat-dev allow to perform case transformations on international characters and process XML

```bash
$ sudo apt-get install libicu libexpat1-dev
```

# Install prosody

```bash
$ sudo apt-get install prosody
$ sudo service prosody start
$ sudo service prosody stop
```

## OR

## Install prosody docker image

https://hub.docker.com/u/prosody/prosody/

# Configure prosody server

## Configuration file path - /etc/prosody/prosody.cfg.lua

```lua
-- List of modules for every feature - http://prosody.im/doc/modules
modules_enabled = {
  "roster";
  "saslauth";
  "tls";
  "dialback";
  "disco";
  "version";
  "uptime";
  "time";
  "ping",
  "register";
  "posix";
  "bosh";
};
allow_registration = true;
daemonize = true; -- false if running in docker
consider_bosh_secure = true;
cross_domain_bosh = true; -- clients can't talk to prosody bosh endpoint directly, we handle SSL through nginx.
pidfile = "/var/run/prosody/prosody.pid";
c2s_require_encryption = false -- true in production for security
authentication = "internal_plain" -- this needs to be encrypted in production
log = {
  debug = "/var/log/prosody/prosody.log";
  error = "/var/log/prosody/prosody.err";
  { levels = { "error" }; to = "syslog"; };
}
VirtualHost "localhost"
enabled = true
ssl = {
  key = "/etc/prosody/certs/example.com.key";
  certificate = "/etc/prosody/certs/example.com.crt";
}
-- just for testing anonymous users
VirtualHost "anon.localhost"
authentication = "anonymous"
Component "component.localhost"
component_secret = "mysecretcomponentpassword"
```

## Restart prosody server

```bash
$ sudo service prosody restart
```
