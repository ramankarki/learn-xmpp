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
daemonize = true;
consider_bosh_secure = true;
cross_domain_bosh = true;
pidfile = "/var/run/prosody/prosody.pid";
c2s_require_encryption = false
authentication = "internal_plain"
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
VirtualHost "anon.localhost"
authentication = "anonymous"
Component "component.localhost"
component_secret = "mysecretcomponentpassword"
