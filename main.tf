# Define variables
variable "project_id" {
  description = "Google Cloud project ID"
  type        = string # Ensure the variable type is explicitly set to string
}

variable "region" {
  description = "Google Cloud region"
  default     = "us-central1"
}

variable "zone" {
  description = "Google Cloud zone"
  default     = "us-central1-a"
}

# Prompt for Google Cloud credentials
variable "google_credentials" {
  description = "Google Cloud credentials in JSON format"
  type        = string
  default     = "{}" # Default value set to an empty JSON object
}

# Set up Google Cloud provider
provider "google" {
  project     = var.project_id != "" ? var.project_id : null # Set project to null if it's empty
  region      = var.region
  
  # Set the credentials using the provided credentials
  credentials = var.google_credentials != "" ? var.google_credentials : null
}

# Create Google Kubernetes Engine cluster
resource "google_container_cluster" "cluster" {
  name     = "app-cluster"
  location = var.zone

  node_pool {
    name         = "default-pool"
    
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
    
  }

  network_interface {
    network = "default"
    access_config {
      # Ephemeral IP
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
