# Define variables
variable "project_id" {
  description = "Google Cloud project ID"
}

variable "region" {
  description = "Google Cloud region"
  default     = "us-central1"
}

variable "zone" {
  description = "Google Cloud zone"
  default     = "us-central1-a"
}

# Set up Google Cloud provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Create Google Kubernetes Engine cluster
resource "google_container_cluster" "cluster" {
  name     = "app-cluster"
  location = var.zone

  node_pool {
    name         = "default-pool"
    machine_type = "e2-medium"  # Specify machine_type within node_pool block
    initial_node_count = 3
    autoscaling {
      min_node_count = 3
      max_node_count = 5
    }
  }

  addons_config {
    horizontal_pod_autoscaling {
      disabled = false
    }
  }

  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }
}

# Create Google Compute Engine instance template for Node.js application
resource "google_compute_instance_template" "app_template" {
  name         = "app-template"
  machine_type = "e2-medium"

  disk {
    boot       = true
    auto_delete = true
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }

  network_interface {
    network = "default"
    access_config {
      // Ephemeral IP
    }
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y docker.io
    systemctl enable docker
    systemctl start docker
    docker run -d --restart=always -p 80:3000 ik3232/e-commerce
  EOF
}
