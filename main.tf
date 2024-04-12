resource "google_service_account" "default" {
  account_id   = "protean-topic-411511"
  display_name = "my-Instance"
}

resource "google_compute_instance" "default" {
  name         = "my-instance"
  machine_type = "e2 micro"
  zone         = "us-central1-a"


  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      labels = {
        my_label = "value"
      }
    }
  }

  }

  network_interface {
    network = "default"

    access_config {
      // Ephemeral public IP
    }
  }



  service_account {
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    email  = google_service_account.default.email
    scopes = ["cloud-platform"]
  }
