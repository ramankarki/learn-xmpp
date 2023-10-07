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
  "ping";
  "register";
  "posix";
  "bosh";
  "muc";
  "websocket";
  "smacks";
};

-- sockets
cross_domain_websocket = true;
consider_websocket_secure = true;

-- bosh
consider_bosh_secure = true;
cross_domain_bosh = true; -- clients can't talk to prosody bosh endpoint directly, we handle SSL through nginx.

allow_registration = true;
daemonize = false; -- false if running in docker
pidfile = "/var/run/prosody/prosody.pid";
c2s_require_encryption = false -- true in production for security

authentication = "internal_plain" -- this needs to be encrypted in production

data_path = "/var/lib/prosody"
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

Component "muc.localhost" "muc"
  name = "Back to the Future chatrooms"
  -- If this is true, rooms can only be created by users in the 'admins' section. By specifying 'local', only users on the same domain (or parent domain) will be able to create a room.
  restrict_room_creation = false 
  max_history_messages = 10
