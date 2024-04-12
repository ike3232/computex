resource "google_compute_instance_template" "example" {
  name        = "my-instance"

  machine_type = "e2-micro"
  
  disk {
    source_image = "debian-cloud/debian-10"  # Change to your preferred OS image
    auto_delete  = true
  }

  network_interface {
    network = "default"
    access_config {
      // Ephemeral IP
    }
  }

  metadata_startup_script = "sudo apt-get update && sudo apt-get install -y nodejs npm && git clone your_repo_url && cd your_repo_directory && npm install && npm start"
}

resource "google_compute_health_check" "basic" {
  name               = "basic-check"
  check_interval_sec = 1
  timeout_sec        = 1
  tcp_health_check {
    port = 80
  }
}

resource "google_compute_instance_group_manager" "example" {
  name               = "example-instance-group-manager"
  base_instance_name = "example-instance"

  zone               = "us-central1-a"   # Change to your preferred zone

  target_size = 1  # Initial number of instances

  auto_healing_policies {
    health_check      = google_compute_health_check.basic.self_link
    initial_delay_sec = 60
  }

  update_policy {
    type = "PROACTIVE"
    minimal_action = "REPLACE"
  }

  named_port {
    name = "http"
    port = 80
  }
}

resource "google_compute_instance_group_manager" "example" {
  # Other configuration for the instance group manager...

  autoscaling {
    min_instances = 1
    max_instances = 10
    cool_down_period_sec = 60
    cpu_utilization {
      target = 0.8
    }
  }
}

