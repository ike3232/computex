# Define provider
provider "google" {
  credentials = file(var.credentials_file)
  project     = var.project_id
  region      = var.region
}

# Google Compute Engine instance to host the React application
resource "google_compute_instance" "react_app_instance" {
  name         = "react-app-instance"
  machine_type = var.machine_type
  zone         = var.zone
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
  metadata_startup_script = var.startup_script
}

# Output the IP address of the deployed instance
output "instance_public_ip" {
  value = google_compute_instance.react_app_instance.network_interface.0.access_config.0.nat_ip
}
