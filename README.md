# cbt-wifi-unifi

Internal UniFi hotspot customization to redirect to CBT Wi-Fi external captive portal.

Complete configuration guide: [Ubiquiti UniFi](https://dev.socialidnow.com/index.php?title=Ubiquiti_UniFi)

## Overriding UniFi’s Captive Portal

### UniFi Network Controller

Download the necessary files from this repository (go to **Clone or Download** and **Download ZIP**).

After downloading our files, head to your controller’s directory:

- **Linux**: */usr/lib/unifi/data/sites/default/app-unifi-hotspot-portal*
- **Mac**: *~/Library/Application Support/UniFi/data/sites/default/app-unifi-hotspot-portal*
- **Windows**: *Ubiquiti UniFi\data\sites\default\app-unifi-hotspot-portal*

Once you’re in the directory, perform the following steps:

1. Rename the index.html file to index.default.html
2. Extract our archive file to a temporary directory
3. Open the file sid_unifi.js and ensure the sidPortal variable has the link to the portal provided by CoffeeBean (e.g. `sidPortal: "https://wifi.socialidnow.com/portals/cbt-ubnt-unifi-lab"`)
4. Copy the downloaded files into the UniFi controller directory
5. Restart the UniFi service running on your local machine

### UniFi Cloud Key

In case you're using a Cloud Key in your network setup, the location to where the files should be exported is */srv/unifi/data/sites/default/app-unifi-hotspot-portal*.

Transfer the downloaded files to the Cloud Key via SFTP.
