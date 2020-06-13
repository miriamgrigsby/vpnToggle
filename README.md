# VPN Toggle

Simple Node.js program that is called automatically every 5 seconds by using a custom plist file for a macOS launchd daemon to toggle the VPN connection on and off. 

## Motivation

Connecting to the VPN for work is a common occurence, but unfortunately, everytime my computer goes to sleep or turns off the display, the VPN loses its connection. When I come back to work, my screen and mouse are frozen for up to a minute. The everyday inconvenience grew to disrupt my dev flow, and others on the team. As a result, I wrote a program to solve the mundane, yet common pet peeve around my office (even if we are all remote). 

### Node Version 

v13.3.0

### Tech Stack

Node with scripts and macOS daemon .plist 

### Installation

The executable file (Node): 

    fork and clone the repo into your location of choice

The .plist file: 
    
    touch ~/Library/LaunchAgents/com.vpn.daemon.plist 
    
    copy and paste the plist_example code from this repo into the com.vpn.daemon.plist file
    
    update all the routes in the plist file to be your username and the location of your executable file  
    
    run launchctl load ~/Library/LaunchAgents/com.vpn.daemon.plist
    
### Features

The two main features of the app connecting and disconnecting the VPN connection. When the user logs into their computer, the VPN will connect. The program will check every 5 seconds for user input and disconnect after 110 sec of inactivity. Once the computer senses user input again, the VPN will automatically reconnect, preventing any freezing or delays.   

### Operation Overview

In my case, my display is set to turn off after 2 minutes. I check my system every 5 seconds, but that time can be changed in the .plist file. Because my display turns off after 120 sec (set in my mac user preferences), I set my disconnection to happen after 110 sec of inactivity. Alter this time in the node file to more accurately describe your user preferences. I set it to disconnect 10 sec before my display shuts off to avoid any timing issues. The name of my VPN is Seaspan VPN, but be sure to change that to match your VPN. 

### .plist file

This file is broken down into 3 main parts: Label, StartInterval, Program.

  -The Label is absolutely necessary and the name follows a strict naming convention and should directly match the name of your .plist file
  
  -RunAtLoad, for agents means execution at boot up
  
  -StartInterval determines how often the executable file is called
  
  -StandardErrorPath and StandardOutPath are not necessary, but I found wildly useful when debugging (https://www.launchd.info/)
  
  -WorkingDirectory, again unnecessary, but improves clarity because every relative path the executable accesses will be relative to its working directory
  
  -ProgramArguments, which can also be Program, is also required and is where you define your executable file 
  

### Executable file
    
The first func, sh, uses the exec import from child_process (https://nodejs.org/api/child_process.html#child_process_child_process) to execute the command passed in and to resolve the stdout and stderr.

ToggleVpn() is where the magic happens to connect or disconnect after 110 sec of inactivity. The first await passes a shell command to the sh(). This command checks the system for inactivity and sets that int = stdout. Now we can check the value of stdout to see if it is >= to my designated timeframe, if so, disconnect vpn, otherwise connect it. 

### Notes about Debugging

After running the following command, the program should be working:
    run launchctl load ~/Library/LaunchAgents/com.vpn.daemon.plist

To check this, place a console.log("hello, world") in the node file and run the following command: 
    cat ~/vpn/stderr.log

This command prints the error log if there is one. In my case, I have an error "The ESM module loader is experimental." This is just a warning. Because I imported exec in the node file, I needed to change the file type from .js to .mjs which denotes module and is experimental. If there are other errors, it will be very clear. 

To see the actual console.log, run the following command: 
    cat ~/vpn/stdout.log

This stdout.log should update every 5 sec (or whatever time interval is set in the .plist). So running the command every 5 secs should add another console.log to the list. 

If you want to stop the whole process, which is needed as you're making changes to the node file, run the following command: 
    launchctl unload ~/Library/LaunchAgents/com.vpn.daemon.plist

NOTE: to run the load and unload, make sure the name of the .plist file matches the name of file you've created
