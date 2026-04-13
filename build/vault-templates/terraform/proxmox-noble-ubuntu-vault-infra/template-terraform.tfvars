###############################################################################
# These are your proxmox API token credentials (not username and password)
# That will be provided to you
###############################################################################
pm_api_url          = "https://system22h082.itm.iit.edu:8006/api2/json"                         # URL of your Proxmox cluster
pm_api_token_id     = ""                         # This is an API token you have previously created for a specific user
pm_api_token_secret = ""                         # This is a uuid that is only available when initially creating the token 
target_node         = "system22h082"             # Promox node to provision VMs
keypath             = "id_ed25519_vault_key" # The path to the private key you need to communicate with your instances
###############################################################################
# Debugging information settings
# No need to change these values
###############################################################################
pm_log_enable = true                           # Optional; defaults to false) Enable debug logging, see the section below for logging details
pm_parallel   = 1                              # (Optional; defaults to 4) Allowed simultaneous Proxmox processes (e.g. creating resources).
pm_timeout    = 600                            # (Optional; defaults to 300) Timeout value (seconds) for proxmox API calls.
pm_log_file   = "terraform-plugin-proxmox.log" # (Optional; defaults to terraform-plugin-proxmox.log) If logging is enabled, the log file the provider will write logs to.
###############################################################################
# This is a variable to append to your cloud instances so they have a unique
# FQDN -- this is needed for the gossip based DNS to work
###############################################################################
yourinitials = "team-05" # initials to add to make unique systems
numberofvms  = 1  # quantity of that template to launch
desc         = "This is for the team 05 vault server for spring 2026" # What is the purpose of the TF template
###############################################################################
# Name the template your created via Packer for Terraform to use to deploy
# instances from
###############################################################################
template_to_clone = "team05-vault-server" # The name of the template to clone
tags              = "vaultserver,team05" # comma - ',' separated: vaultserver,team00
###############################################################################
# Customize instance hardware settings
###############################################################################
memory    = 4096  # Memory size of a VM
cores     = 1     # vCPU = cores * sockets
sockets   = 1     # vCPU = cores * sockets
disk_size = "30G" # Disk size of a VM - min size must equal to the disk size of your clone image
