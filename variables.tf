variable "credentials_file" {
  description = "Path to the Google Cloud credentials JSON file"
  default     = "path/to/your/credentials.json"  # Set a default value or leave it empty
}

variable "project_id" {
  description = "Google Cloud project ID"
}

variable "region" {
  description = "Google Cloud region"
  default     = "us-central1"
}

variable "machine_type" {
  description = "Machine type for the GCE instance"
  default     = "e2-micro"
}

variable "zone" {
  description = "Zone for the GCE instance"
  default     = "us-central1-a"
}

variable "image" {
  description = "OS image for the GCE instance"
  default     = "debian-cloud/debian-10"
}

variable "startup_script" {
  description = "StartupScript for the GCE instance"
  default     = ""  # Set a default value or leave it empty
}
