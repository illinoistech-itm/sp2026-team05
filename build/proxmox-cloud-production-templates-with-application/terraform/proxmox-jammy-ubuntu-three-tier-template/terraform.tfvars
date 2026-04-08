###############################################################################
# These are your proxmox API token credentials (not username and password)
# That will be provided to you
###############################################################################
keypath = "id_ed25519_server_key" # The name to the private key you need to communicate with your instances
###############################################################################
# Debugging information settings
# No need to change these values
###############################################################################
pm_log_enable = true                           # Optional; defaults to false) Enable debug logging, see the section below for logging details
pm_parallel   = 2                              # (Optional; defaults to 4) Allowed simultaneous Proxmox processes (e.g. creating resources).
pm_timeout    = 1600                           # (Optional; defaults to 300) Timeout value (seconds) for proxmox API calls.
pm_log_file   = "terraform-plugin-proxmox.log" # (Optional; defaults to terraform-plugin-proxmox.log) If logging is enabled, the log file the provider will write logs to.
###############################################################################
# This is a variable to append to your cloud instances so they have a unique
# FQDN -- this is needed for the gossip based DNS to work
###############################################################################
frontend-yourinitials            = "team05-fe"                     # initials to add to make unique systems
frontend-numberofvms             = 3                      # quantity of that template to launch
frontend-desc                    = "Team-05 terraform frontend template"                     # What is the purpose of the TF template
backend-yourinitials             = "team05-be"                     # initials to add to make unique systems
backend-numberofvms              = 1                      # quantity of that template to launch
backend-desc                     = "Team-05 terrafrom backend template"                     # What is the purpose of the TF template
lb-yourinitials                  = "team05-lb"                     # initials to add to make unique systems
lb-numberofvms                   = 1                      # quantity of that template to launch
lb-desc                          = "Team-05 terraform lb template"                     # What is the purpose of the TF template
lb-macaddr                       = "bc:24:11:00:00:57"                     # Class assigned mac address for a public IP for your lb
consul-service-tag-contact-email = "hjuliano@hawk.illinoistech.edu" # Used as part of the consul service definition as a tag that can be queried
###############################################################################
# Name the template your created via Packer for Terraform to use to deploy
# instances from
###############################################################################
frontend-template_to_clone = "team05-fe-template" # The name of the template to clone
backend-template_to_clone  = "team05-be-template" # The name of the template to clone
lb-template_to_clone       = "team05-lb-template" # The name of the template to clone
FE-TAGS                    = "fe,team05,hjj" # Tags separated by commas: fe,team00
LB-TAGS                    = "lb,team05,hjj" # Tags separated by commas: lb,team00
BE-TAGS                    = "be,team05,hjj" # Tags separated by commas: be,team00
###############################################################################
# Customize instance hardware settings
###############################################################################
frontend-memory    = 2048  # Memory size of a VM
frontend-cores     = 1     # vCPU = cores * sockets
frontend-sockets   = 1     # vCPU = cores * sockets
frontend-disk_size = "30G" # Disk size of a VM - min size must equal to the disk size of your clone image
backend-memory     = 2048  # Memory size of a VM
backend-cores      = 1     # vCPU = cores * sockets
backend-sockets    = 1     # vCPU = cores * sockets
backend-disk_size  = "30G" # Disk size of a VM - min size must equal to the disk size of your clone image
lb-memory          = 2048  # Memory size of a VM
lb-cores           = 1     # vCPU = cores * sockets
lb-sockets         = 1     # vCPU = cores * sockets
lb-disk_size       = "30G" # Disk size of a VM - min size must equal to the disk size of your clone image
