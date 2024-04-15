terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "5.24.0"
    }
  }

 { credentials = file("/home/anthony/.config/gcloud/application_default_credentials.json")
  project     = "protean-topic-411511"
  region      = "us-central1"
}
  cloud {
    organization = "Ike3232"

    workspaces {
      name = "dev"
    }
  }  
}

provider "google" {
  project = "protean-topic-411511"
  region  = "us-central1"
  }

resource "google_compute_instance" "default" {
  name         = "my-instance"
  machine_type = "e2-micro"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
      labels = {
        my_label = "value"
      }
    }
  }

  network_interface {
    network = "default"

    access_config {
      // Ephemeral public IP
    }
  }
}
