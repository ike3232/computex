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
    name       = "default-pool"
    machine_type = "e2-medium"
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

  node_config {
    preemptible  = false
    disk_size_gb = 100
  }

  master_auth {
    username = ""
    password = ""

    client_certificate_config {
      issue_client_certificate = false
    }
  }
}

# Create Google Compute Engine instance for PostgreSQL database
resource "google_compute_instance" "postgres_instance" {
  name         = "postgres-instance"
  machine_type = "e2-medium"
  zone         = var.zone

  boot_disk {
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
    apt-get install -y postgresql
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/12/main/postgresql.conf
    echo "host all all 0.0.0.0/0 trust" >> /etc/postgresql/12/main/pg_hba.conf
    systemctl restart postgresql
  EOF
}

# Create Google Compute Engine instance template for Node.js application
resource "google_compute_instance_template" "app_template" {
  name         = "app-template"
  machine_type = "e2-medium"
  disks {
    boot = true
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

# Create managed instance group for Node.js application
resource "google_compute_instance_group_manager" "app_instance_group" {
  name               = "app-instance-group"
  base_instance_name = "app-instance"
  instance_template  = google_compute_instance_template.app_template.self_link
  target_size        = 3
  zone               = var.zone
  target_pools       = [google_compute_target_pool.app_pool.name]
}

# Create target pool for load balancing
resource "google_compute_target_pool" "app_pool" {
  name = "app-pool"
  region = var.region
}

# Add instances to the target pool
resource "google_compute_forwarding_rule" "app_forwarding_rule" {
  name        = "app-forwarding-rule"
  region      = var.region
  ip_protocol = "TCP"
  target      = google_compute_target_pool.app_pool.self_link
  port_range  = "80"
}

# Create health check for load balancer
resource "google_compute_http_health_check" "app_health_check" {
  name                = "app-health-check"
  request_path        = "/"
  check_interval_sec  = 10
  timeout_sec         = 5
  healthy_threshold   = 2
  unhealthy_threshold = 2
}

# Add health check to the target pool
resource "google_compute_target_pool_health_check" "app_pool_health_check" {
  target_pool = google_compute_target_pool.app_pool.self_link
  health_check = google_compute_http_health_check.app_health_check.self_link
}
