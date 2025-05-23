terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
  required_version = ">= 0.13"
}

provider "yandex" {
  zone = "ru-central1-b"
}

resource "yandex_compute_disk" "boot-disk-2" {
  name     = "boot-disk-2"
  type     = "network-ssd"
  zone     = "ru-central1-b"
  size     = "35"
  image_id = "fd8r7e7939o13595bpef"
}

data "yandex_vpc_subnet" "default_subnet" {
  name = "default-ru-central1-b"
}

resource "yandex_compute_instance" "vm-2" {
  name = "terraform"

  resources {
    cores  = 2
    memory = 2
  }

  boot_disk {
    disk_id = yandex_compute_disk.boot-disk-2.id
  }

  network_interface {
    subnet_id = data.yandex_vpc_subnet.default_subnet.id
    nat       = true
  }

  metadata = {
    user-data = "${file("~/yd-terraform/meta.txt")}"
    ssh-keys  = "user:${file("~/.ssh/terraform.pub")}" 
 }
}


output "internal_ip_address_vm_2" {
  value = yandex_compute_instance.vm-2.network_interface.0.ip_address
}

output "external_ip_address_vm_2" {
  value = yandex_compute_instance.vm-2.network_interface.0.nat_ip_address
}

