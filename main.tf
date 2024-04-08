# Define provider
provider "google" {
  credentials = jsondecode(var.google_credentials)
  project     = var.project_id
  region      = "us-central1"  # Specify the region directly
}

# Google Compute Engine e2 instance to host the React application
resource "google_compute_instance" "react_app_instance" {
  name         = "react-app-instance"
  machine_type = "e2-micro"  # Specify the e2 micro machine type directly
  zone         = "us-central1-a"   # Specify the zone directly
  boot_disk {
    initialize_params {
      image = var.image
    }
  }
  network_interface {
    network = "default"
    access_config {
      // Ephemeral IP
    }
  }
  metadata_startup_script = var.startup_script  # Update this line with the startup script for configuring the instance
}

# Output the IP address of the deployed instance
output "instance_public_ip" {
  value = google_compute_instance.react_app_instance.network_interface.0.access_config.0.nat_ip
}

# Variables
variable "google_credentials" {
  description = "Google Cloud credentials JSON object"
  type        = string
  sensitive   = true
}

variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
}

variable "image" {
  description = "Image for the compute instance"
  type        = string
  default     = "debian-cloud/debian-10"  # You can change this to suit your needs
}

variable "startup_script" {
  description = "Startup script for configuring the instance"
  type        = string
  default     = "#!/bin/bash\nsudo apt update && sudo apt install -y apache2"  # You can change this to suit your needs
}
