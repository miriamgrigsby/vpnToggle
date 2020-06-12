import { exec } from 'child_process';

async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function toggleVPN() {
  let {stdout} = await sh("ioreg -c IOHIDSystem | awk '/HIDIdleTime/ {print int($NF/1000000000); exit }'")

  stdout >= 110 ? sh("networksetup -disconnectpppoeservice 'Seaspan VPN'") : sh("networksetup -connectpppoeservice 'Seaspan VPN'")
}

toggleVPN()

//launchctl load ~/Library/LaunchAgents/com.vpn.daemon.plist
//launchctl unload ~/Library/LaunchAgents/com.vpn.daemon.plist