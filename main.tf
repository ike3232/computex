provider "google" {
  credentials = jsondecode(var.google_credentials)
  project     = "protean-topic-411511"
  region      = "us-central1"
}
variable "google_credentials" {
  description = "Google Cloud service account credentials"
}


# Define Google Compute Engine instances

# Application Server
resource "google_compute_instance" "app_instance" {
  name         = "app-instance"
  machine_type = "n1-standard-2"
  zone         = "us-central1-c"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Include a public IP address
    }
  }

  metadata_startup_script = "sudo docker run -d -p 3000:3000 <DOCKER_IMAGE_NAME>"
}

# Database Server
resource "google_compute_instance" "db_instance" {
  name         = "db-instance"
  machine_type = "n1-standard-2"
  zone         = "us-central1-c"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Include a public IP address or configure private IP if needed
    }
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    # Install and configure your database server here
    # Example: Install and configure MySQL
    sudo apt-get update
    sudo apt-get install -y mysql-server
    sudo mysql_secure_installation
  EOF
}

# Define firewall rules if necessary

# Output the public IP address of the application server
output "app_instance_ip" {
  value = google_compute_instance.app_instance.network_interface[0].access_config[0].nat_ip
}
