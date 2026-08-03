export const debriefs = [
  // 0 - Level 1: The Ping Drop
  { unit7: "System diagnostics complete. ICMP echo requests successfully transmitted and returned.", sarah: "Excellent work. We've confirmed that the target host is reachable. Network connectivity has been verified, allowing the investigation to continue." },
  // 1 - Level 2: The Silent Server
  { unit7: "HTTP client-server communication established. Response code 200 OK.", sarah: "The curl request completed successfully. Communication with the target system has been established. This confirms the web server is operational." },
  // 2 - Level 3: The Typo
  { unit7: "HTTP response analysis complete. Expected payload received.", sarah: "Good job finding that typo. We've successfully analyzed the HTTP request and response. The API is functioning correctly now." },
  // 3 - Level 4: The Broken Path
  { unit7: "REST endpoint verified. Valid HTTP 200 response logged.", sarah: "You identified the correct REST endpoint. The routing issue has been resolved and the service is back online." },
  // 4 - Level 5: The Malformed Payload
  { unit7: "JSON payload validation successful. Data structure integrity at 100%.", sarah: "Great work fixing that syntax error. We've validated and corrected the JSON payload. The application is accepting data again." },
  // 5 - Level 6: The Polling Problem
  { unit7: "Polling frequency analyzed. Resource utilization within acceptable parameters.", sarah: "You've successfully optimized the polling intervals. The servers are breathing a sigh of relief." },
  // 6 - Level 7: The First Hook
  { unit7: "Webhook endpoint registered and verified. Incoming POST requests detected.", sarah: "The webhook receiver is live! We are now successfully listening for incoming event data." },
  // 7 - Level 8: The Silent Drops
  { unit7: "Firewall rules updated. Inbound traffic on port 443 permitted.", sarah: "Traffic is flowing again. You successfully diagnosed and resolved the firewall block that was dropping our webhooks." },
  // 8 - Level 9: Decoding the Errors
  { unit7: "Error logs decoded. Root cause identified in authorization layer.", sarah: "Good catch on those error logs. We've identified the root cause and patched the authorization logic." },
  // 9 - Level 10: The Missing Credentials
  { unit7: "Authentication headers verified. API token accepted.", sarah: "Authentication successful. You've correctly supplied the necessary credentials to securely access the endpoint." },
  // 10 - Level 11: The Imposter
  { unit7: "Cryptographic signature validated. Payload authenticity confirmed.", sarah: "Security check passed. You successfully implemented HMAC signature verification to prevent spoofing." },
  // 11 - Level 12: The Key Rotation
  { unit7: "Secret key rotation complete. Old keys invalidated.", sarah: "Keys have been successfully rotated without any downtime. Excellent handling of the security protocol." },
  // 12 - Level 13: The Cryptographic Seal
  { unit7: "Encryption layer verified. Data confidentiality maintained.", sarah: "The payload encryption is working perfectly. Our sensitive data is now safe in transit." },
  // 13 - Level 14: The Network Flap
  { unit7: "Network stability restored. Connection timeouts reduced to 0.", sarah: "You've successfully handled the network timeouts. Our integration is much more resilient now." },
  // 14 - Level 15: The Dead Letter
  { unit7: "Dead letter queue implemented. Failed events safely stored.", sarah: "Great architectural decision. Failed webhooks are now safely captured in the dead letter queue for manual review." },
  // 15 - Level 16: The Endless Loop
  { unit7: "Infinite loop terminated. Idempotency layer stabilized.", sarah: "Crisis averted. You successfully broke the infinite recursion loop that was taking down the system." },
  // 16 - Level 17: The Overflow
  { unit7: "Rate limiting applied. Traffic shaped to acceptable throughput.", sarah: "The server overload has been mitigated. Rate limiting is successfully shaping the incoming webhook traffic." },
  // 17 - Level 18: The Phantom Event
  { unit7: "Event deduplication active. Duplicate payloads discarded.", sarah: "Duplicate events are no longer an issue. Our database integrity is protected." },
  // 18 - Level 19: The Replay Attack
  { unit7: "Timestamp validation active. Stale requests rejected.", sarah: "Security patch deployed. You've successfully mitigated the replay attack vulnerability." },
  // 19 - Level 20: The Parallel Processing
  { unit7: "Concurrency model updated. Race conditions resolved.", sarah: "Parallel processing is now stable. You've eliminated the race condition that was corrupting our data." },
  // 20 - Level 21: The Idempotent Request
  { unit7: "Idempotency keys verified. State mutations are safe.", sarah: "Excellent work implementing idempotency. We can now safely retry failed requests without side effects." },
  // 21 - Level 22: The Delivery Guarantee
  { unit7: "Message broker configured. At-least-once delivery guaranteed.", sarah: "The delivery pipeline is bulletproof. We have successfully implemented at-least-once delivery." },
  // 22 - Level 23: The State Mismatch
  { unit7: "Event ordering verified. State machine integrity restored.", sarah: "The out-of-order events have been handled. Our application state is perfectly synchronized again." },
  // 23 - Level 24: The Anomaly
  { unit7: "Anomaly contained. Unidentified data stream quarantined.", sarah: "That was... strange. But you handled it perfectly. The unknown data stream has been isolated for analysis." },
  // 24 - Project 1
  { unit7: "Cloud Watcher deployed. Global monitoring active.", sarah: "Project complete. The Cloud Watcher system is fully operational and monitoring our infrastructure." },
  // 25 - Project 2
  { unit7: "Notification Gateway online. Multi-channel routing active.", sarah: "The Notification Gateway is live. We can now intelligently route alerts across all our communication channels." },
  // 26 - Project 3
  { unit7: "Security Audit passed. Vulnerabilities patched.", sarah: "Excellent work on the security audit. The perimeter is secure and all known vulnerabilities are patched." },
  // 27 - Project 4
  { unit7: "Retry Architecture implemented. System resilience increased by 400%.", sarah: "The new retry architecture is working flawlessly. Our integrations can now survive massive network outages." },
  // 28 - Project 5
  { unit7: "Payload Validation active. Schema enforcement at 100%.", sarah: "Data corruption is a thing of the past. The strict payload validation schema is successfully dropping bad data." },
  // 29 - Project 6
  { unit7: "The Black Hole contained. Data loss prevented.", sarah: "You did it. The data sinkhole has been patched and all lost events have been successfully recovered." },
  // 30 - Project 7
  { unit7: "Zero Trust architecture deployed. Global security maximum.", sarah: "Incredible work, Engineer. The Zero Trust architecture is online. This entire infrastructure is now completely locked down." }
];

export const getDebrief = (index, status) => {
  if (status !== 'SUCCESS') {
    return {
      unit7: "Mission completed with suboptimal performance. Log analysis required.",
      sarah: "The incident is contained, but we experienced some turbulence. Let's review the logs for next time."
    };
  }
  
  if (index >= 0 && index < debriefs.length) {
    return debriefs[index];
  }
  
  // Fallback
  return {
    unit7: "System diagnostics complete. Infrastructure integrity at 100%.",
    sarah: "Good job stabilizing the environment. We've updated the NOC dashboard with your deployment logs."
  };
};
